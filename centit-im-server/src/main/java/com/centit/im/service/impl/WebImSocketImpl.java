package com.centit.im.service.impl;

import com.centit.framework.model.adapter.NotificationCenter;
import com.centit.framework.model.adapter.PlatformEnvironment;
import com.centit.framework.model.basedata.IUserInfo;
import com.centit.framework.model.basedata.IUserUnit;
import com.centit.im.dao.CustomerPraiseDao;
import com.centit.im.dao.WebImCustomerDao;
import com.centit.im.dao.WebImMessageDao;
import com.centit.im.dao.WebImReadGroupDao;
import com.centit.im.po.*;
import com.centit.im.service.IntelligentRobot;
import com.centit.im.service.IntelligentRobotFactory;
import com.centit.im.service.WebImSocket;
import com.centit.im.socketio.ImMessage;
import com.centit.im.socketio.ImMessageBuild;
import com.centit.im.socketio.ImMessageUtils;
import com.centit.support.algorithm.DatetimeOpt;
import com.centit.support.algorithm.NumberBaseOpt;
import com.centit.support.algorithm.StringBaseOpt;
import com.centit.support.algorithm.UuidOpt;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.websocket.Session;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Created by codefan on 17-5-19.
 */
@Service
public class WebImSocketImpl implements WebImSocket {
    private static AtomicInteger onlineCount = new AtomicInteger(0);
     //ConcurrentHashMap是线程安全的，而HashMap是线程不安全的。
    private static ConcurrentHashMap<String, Session> userCodeToSession
             = new ConcurrentHashMap<>();//根据用户找session
    private static ConcurrentHashMap<Session, WebImCustomer> sessionToUserCode
            = new ConcurrentHashMap<>();//根据session找用户
    /**
     * 在线客服
     */
    private static ConcurrentHashMap<String, WebImCustomer> onlineCustService
            = new ConcurrentHashMap<>();

    private static Session getSessionByUserCode(String userCode){
        if(userCode == null)
            return null;
        return userCodeToSession.get(userCode);
    }

    private static WebImCustomer getUserBySession(Session session){
        if(session == null)
            return null;
        return sessionToUserCode.get(session);
    }
    private static String getUserCodeBySession(Session session){
        if(session == null)
            return null;
        WebImCustomer cust = sessionToUserCode.get(session);
        if(cust == null)
            return null;
        return cust.getUserCode();
    }


    private static WebImCustomer getOnlineServiceByUserCode(String userCode){
        if(userCode == null)
            return null;
        return onlineCustService.get(userCode);
    }

    @Resource
    protected WebImMessageDao messageDao;

    @Resource
    protected WebImCustomerDao customerDao;

    @Resource(name = "webImReadGroupDao")
    protected WebImReadGroupDao webImReadGroupDao;

    @Resource
    protected CustomerPraiseDao customerPraiseDao;

    @Resource
    protected PlatformEnvironment platformEnvironment;

    @Resource
    protected IntelligentRobotFactory intelligentRobotFactory;

    @Value("${notify.type}")
    protected String noticeType;

    @Autowired
    protected NotificationCenter notificationCenter;
    /**
     * 登录
     *
     * @param userCode
     * @param session
     */
    @Override
    public void signInUser(String userCode, Session session) {
        Session oldSession = getSessionByUserCode(userCode);
        if(oldSession!=null){
            ImMessage message = new ImMessageBuild().type(ImMessage.MSG_TYPE_SYSTEM)
                    .contentType(ImMessage.CONTENT_TYPE_OFFLINE)
                    .sender("system")
                    .message("同名用户在其他地方登录，您被迫下线！").build();
            pushMessage(oldSession,message);
            sessionToUserCode.remove(oldSession);
        }
    }

    /**
     * 等出服务
     *
     * @param userCode
     * @param session
     */
    private void signOutUser(String userCode, Session session) {
        if (userCode != null && userCode != "") {
            onlineCount.decrementAndGet();    //在线数减1
            //System.out.println("用户" + userCode + "退出wsll！当前在线人数为" + onlineCount);
            userCodeToSession.remove(userCode);
            sessionToUserCode.remove(session);
            //下线通知
            onlineCustService.remove(userCode);
            broadcastMessage(
                        ImMessageUtils.buildOfflineMessage(userCode));
        }
    }

    /**
     * 登出服务
     *
     * @param session
     */
    @Override
    public void signOutUser(Session session) {
        WebImCustomer user = getUserBySession(session);
        if(user!=null)
            signOutUser(user.getUserCode(),session);
    }


    private void pushCustomerServiceInfo(Session session, String custUserCode, WebImCustomer service){
        pushMessage(session ,new ImMessageBuild().type(ImMessage.MSG_TYPE_COMMAND)
                .contentType(ImMessage.CONTENT_TYPE_SERVICE)
                .sender("system")
                .receiver(custUserCode)
                .senderName("系统管理员")
                .sendTime(DatetimeOpt.currentUtilDate())
                .addContent("userCode",service.getUserCode())
                .addContent("userName",service.getUserName())
                .addContent("userState",service.getUserState())
                .addContent("headSculpture",service.getHeadSculpture())
                .message("客服 " + service.getUserName() +
                        ("O".equals(service.getUserState())?
                                " 正在为您服务。":" 为您服务，暂时不在线，请留言。")).build());
    }

    /**
     * 注册匿名用户
     *  message.type = 'command'
     *  message.contenttype= 'register'
     * @param session
     * @param message
     *      content OsID:userName
     *      sender  userCode
     */
    @Transactional
    private void registerUser(Session session, ImMessage message) {
        String userCode = message.getSender();
        String osId = message.fetchContentString("osId");
        String userName = message.fetchContentString("userName");
        WebImCustomer cust = customerDao.getObjectById(userCode);
        Date currDate = DatetimeOpt.currentUtilDate();
        //保存和服信息
        if(cust!=null){
            cust.setLastActiveDate(currDate);
            cust.setUserName(userName);
            cust.setHeadSculpture(message.fetchContentString("headSculpture"));
            cust.setUserType(message.fetchContentString("userType"));
            String serviceOpts = message.fetchContentString("serviceOpts");
            if(StringUtils.isNotBlank(serviceOpts))
                cust.setServiceOpts(serviceOpts);
            //cust.setUserState("O");
            customerDao.updateObject(cust);
        }else {
            cust = new WebImCustomer();
            cust.setUserCode(message.fetchContentString("userCode"));
            cust.setOsId(osId);
            cust.setUserName(userName);
            cust.setHeadSculpture(message.fetchContentString("headSculpture"));
            cust.setUserType(message.fetchContentString("userType"));
            cust.setCreateTime(currDate);
            cust.setLastActiveDate(currDate);
            cust.setServiceOpts(message.fetchContentString("serviceOpts"));
            //cust.setUserState("O");
            cust.setCreator("U0000000");
            customerDao.saveNewObject(cust);
        }

        sessionToUserCode.put(session, cust);
        userCodeToSession.put(userCode, session);
        onlineCount.incrementAndGet(); //在线数加1
        // 客服模式 分配客服 第一步实现随机分配 客服
        //if ("S".equals(serverType)) {
        //客服
        if("S".equals(cust.getUserType()) || "P".equals(cust.getUserType())) {
            cust.setUserState(ImMessage.USER_STATE_ONLINE);
            onlineCustService.put(cust.getUserCode(), cust);
        }
         /*{
            pushMessage(session ,ImMessageUtils
                    .buildSystemMessage(message.getReceiver(), "系统错误：您的用户信息不存在！"));
         }*/
    }

    @Transactional
    private void askForService(Session session, ImMessage message) {
        String userCode = message.getSender();
        WebImCustomer cust = customerDao.getObjectById(userCode);
        if(cust==null || ! "C".equals(cust.getUserType()))
            return;
        String custServiceCode = message.fetchContentString("customerService");
        //客户端指定了客服，则只能用这个客服
        WebImCustomer service = null;
        if(StringUtils.isBlank(custServiceCode))
            custServiceCode = cust.getCustomerService();

        String optId = message.fetchContentString("optId");
        //客户端指定 客服和业务类别关联
        if (StringUtils.isNotBlank(optId)) {
            List<WebImCustomer> allServices = customerDao.listCustomerServiceByOptId(optId);
            if (allServices != null && allServices.size() > 0) {
                List<WebImCustomer> onlineServices = new ArrayList<>();
                for (WebImCustomer cs : allServices) {
                    if (getSessionByUserCode(cs.getUserCode()) != null) {
                        onlineServices.add(cs);
                        cs.setUserState(ImMessage.USER_STATE_ONLINE);
                    }else{
                        cs.setUserState(ImMessage.USER_STATE_OFFLINE);
                    }

                    if(StringUtils.equals(custServiceCode,cs.getUserCode() )){
                        service = cs;
                    }
                }
                Random random = new Random();
                //有符合要求的在线客服 随机分配一个
                if (ImMessage.USER_STATE_OFFLINE.equalsIgnoreCase(service.getUserState())
                        && onlineServices.size() > 0) {
                    service = onlineServices.get(random.nextInt(onlineServices.size()));
                    service.setUserState(ImMessage.USER_STATE_ONLINE);
                }else if(service==null){ // 没有指定 随机分配一个离线客服
                    service = allServices.get(random.nextInt(allServices.size()));
                    service.setUserState(ImMessage.USER_STATE_OFFLINE);
                }
            }
        }

        //如果还是没有分配的客服则随机分配
        if(service==null){ // 随机分配
            //分配默认值
            service =  customerDao.getObjectById(custServiceCode);
            if(service!=null)
                service.setUserState( checkUserState(service.getUserCode()) );

            Random random = new Random();
            if ( (service == null
                        || ImMessage.USER_STATE_OFFLINE.equalsIgnoreCase(service.getUserState()) )
                    && onlineCustService.size() > 0) {
                String[] keys = new String[onlineCustService.size()];
                keys = onlineCustService.keySet().toArray(keys);
                String randomKey = keys[random.nextInt(keys.length)];
                service = getOnlineServiceByUserCode(randomKey);
                service.setUserState(ImMessage.USER_STATE_ONLINE);
            } else if(service==null){
                List<WebImCustomer> allService = customerDao.listCustomerService();//("S");
                if (allService != null && allService.size() > 0) {
                    service = allService.get(random.nextInt(allService.size()));
                    service.setUserState(ImMessage.USER_STATE_OFFLINE);
                }
            }
        }

        if(service!=null){
            cust.setCustomerService(service.getUserCode());
            customerDao.updateObject(cust);
            pushCustomerServiceInfo(session,cust.getUserCode(),service);
        } else {
            pushMessage(session ,ImMessageUtils
                    .buildSystemMessage(message.getReceiver(), "系统错误：服务端没有客服人员，请联系技术支持人员"));
        }
    }
    @Transactional
    private void setReadState(Session session, ImMessage message) {

        if(StringUtils.isBlank(message.getReceiver()) ||
                "all".equalsIgnoreCase(message.getReceiver())) {
            messageDao.updateReadState(message.getSender());
        }else{
            /**
             * 这边的传参没有错，是设置发送方的未读消息，所以在消息中 需要 receiver 为消息的发送者
             */
            messageDao.updateReadState(message.getSender(), message.getReceiver());
        }
    }

    @Transactional
    private void setGroupReadState(Session session, ImMessage message) {
       /* messageDao.updateGroupReadState(message.getSender(),
                message.getReceiver(), DatetimeOpt.currentUtilDate());*/
        //修改群发已读消息状态不需要改变消息状态，只需要改变最后推送消息成功的时间
        webImReadGroupDao.setGroupReadState(message.getSender(),message.getReceiver());
    }


    @Transactional
    private void successChangeCustomerService(Session session, String receiver,
                                              WebImCustomer service ) {
        Session receiverSession = getSessionByUserCode( receiver );
        if(receiverSession!=null)
            pushCustomerServiceInfo(receiverSession ,receiver, service);

        WebImCustomer cust = customerDao.getObjectById(receiver);
        if(cust!=null){
            cust.setCustomerService(service.getUserCode());
            customerDao.updateObject(cust);
        }

        pushMessage(session /*message.getSender()*/,ImMessageUtils
                .buildSystemMessage(receiver,"切换客服成功，请离开本窗口。") );

        pushMessage(service.getUserCode() ,ImMessageUtils
                .buildSystemMessage(receiver,"请为这个新的客户服务。") );
    }

    @Transactional
    private void changeOnlineCustomerService(Session session, ImMessage message) {
        String serviceUserCode = message.fetchContentString("service");
        WebImCustomer service = getOnlineServiceByUserCode(serviceUserCode);
        if(service==null){
            //给发送方 回复 切换客服失败
            pushMessage(session /*message.getSender()*/,ImMessageUtils
                    .buildSystemMessage(message.getReceiver(),"切换客服失败，因为您选择的客服不在线。") );
        } else {
            successChangeCustomerService(session, message.getReceiver(), service );
        }
    }


    @Transactional
    private void changeCustomerService(Session session, ImMessage message) {
        String serviceUserCode = message.fetchContentString("service");
        WebImCustomer service = getOnlineServiceByUserCode(serviceUserCode);
        if(service==null){
            service =  customerDao.getObjectById(serviceUserCode);
            service.setUserState(ImMessage.USER_STATE_OFFLINE);
        }
        if(service ==null){
            pushMessage(session ,ImMessageUtils
                    .buildSystemMessage(message.getReceiver(),"切换客服失败，没有这个客服。") );
        } else {
            successChangeCustomerService(session, message.getReceiver(), service );
        }
    }

    @Transactional
    private void saveFormData(Session session, ImMessage message){
        //customerPraise
        String fromType = message.fetchContentString("formType");
        if(StringUtils.isBlank(fromType))
            return;
        switch(fromType) {
            case "praise":
                CustomerPraise praise = new CustomerPraise();
                praise.setPraiseId(UuidOpt.getUuidAsString32());
                praise.setCustomerCode(message.getSender());
                praise.setUserCode(message.getReceiver());
                praise.setServiceScore(NumberBaseOpt.parseInteger(message.fetchContentString("score"),0));
                praise.setCreateTime(DatetimeOpt.currentUtilDate());
                praise.setOsId(message.fetchContentString("osId"));
                praise.setServiceSummary("summary");
                customerPraiseDao.saveNewObject(praise);

                pushMessage(session /*message.getSender()*/,ImMessageUtils
                        .buildSystemMessage("您的评价已经成功提交。") );

                pushMessage(message.getReceiver() ,ImMessageUtils
                        .buildSystemMessage("对方已经给您评价。") );
                break;
            default:
                break;
        }
    }

    /**
     * 响应事件，这个是最复杂的部分
     * @param session
     * @param message
     */
    @Transactional
    private void onCommand(Session session, ImMessage message) {
        switch (message.getContentType()) {
            case ImMessage.CONTENT_TYPE_READ :// "read";
                setReadState(session, message);
                break;
            case ImMessage.CONTENT_TYPE_READGROUP ://  "readGroup";
                setGroupReadState(session, message);
                break;
            case ImMessage.CONTENT_TYPE_REGISTER ://  "register";
                registerUser(session, message);
                break;
            case ImMessage.CONTENT_TYPE_SERVICE ://  "service";
                changeCustomerService(session, message);
                break;
            case ImMessage.CONTENT_TYPE_FORM ://  "form";
                saveFormData(session, message);
                break;
            case ImMessage.CONTENT_TYPE_ASKFORSERVICE ://  "askForService";
                // 分配客服
                askForService(session, message);
                break;
            case ImMessage.CONTENT_TYPE_ASKROBOT ://  "askRobot";
                // 初始化机器人
                askRobot(session, message);
                break;
            /*case ImMessage.CONTENT_TYPE_NOTICE :// "notice";
                break;*/
            default:
                pushMessage(message.getReceiver(), message);
                break;
        }
    }

    @Transactional
    private void saveRobotAnswer(String recever,  RobotAnswer answer){
        WebImMessage webMessage = new WebImMessage();
        webMessage.setSenderName("智能客服");
        webMessage.setSender("robot");
        webMessage.setReceiver(recever);

        StringBuilder sbContent = new StringBuilder(answer.getMessage());
        if( answer.getOptions()!=null &&  answer.getOptions().size()>0) {
            for (RobotAnswerItem item : answer.getOptions()) {
                sbContent.append("\r\n").append(item.getLabel());
            }
        }
        webMessage.setContent( sbContent.toString() );
        webMessage.setMsgId(UuidOpt.getUuidAsString32());
        webMessage.setMsgType("C");
        webMessage.setMsgState("C");
        webMessage.setSendTime(DatetimeOpt.currentUtilDate());
        messageDao.saveNewObject(webMessage);
    }

    @Transactional
    public void askRobot(Session session,  ImMessage message) {
        WebImCustomer cust = getUserBySession(session);
        if(cust==null){
            RobotAnswer answer = new RobotAnswer("没有您的注册信息，请先注册:");
            answer.addCommandOption("注册",ImMessage.CONTENT_TYPE_REGISTER);
            pushMessage(session, ImMessageUtils.buildRobotAnswer(message.getSender(), answer));
            return;
        }
        IntelligentRobot robot = intelligentRobotFactory.getIntelligentRobot(cust.getOsId());
        if(robot==null){
            RobotAnswer answer = new RobotAnswer("系统没有设置机器人信息，请申请人工服务:");
            answer.addCommandOption("转人工服务",ImMessage.CONTENT_TYPE_ASKFORSERVICE);
            pushMessage(session, ImMessageUtils.buildRobotAnswer(message.getSender(), answer));
            return;
        }
        if(ImMessage.MSG_TYPE_COMMAND.equalsIgnoreCase(message.getType())){
            RobotAnswer answer = robot.sayHello(cust.getUserCode());
            ImMessage robotMessage = ImMessageUtils.buildRobotAnswer(message.getSender(), answer);
            pushMessage(session, robotMessage);
            saveRobotAnswer(message.getSender(), answer);
            return;
        }else{
            WebImMessage webMessage = new WebImMessage();
            webMessage.copy(message);
            webMessage.setMsgId(UuidOpt.getUuidAsString32());
            webMessage.setMsgType("C");
            webMessage.setMsgState("C");
            webMessage.setReceiver("robot");
            webMessage.setSendTime(DatetimeOpt.currentUtilDate());
            messageDao.saveNewObject(webMessage);

            RobotAnswer answer = robot.askQuestion(cust.getUserCode(),message.fetchContentString("question"));
            ImMessage robotMessage = ImMessageUtils.buildRobotAnswer(message.getSender(), answer);
            pushMessage(session, robotMessage);
            saveRobotAnswer(message.getSender(), answer);
            return;
        }
    }
    /**
     * 接受消息，并对消息进行处理
     *
     * @param session
     * @param message
     */
    @Override
    @Transactional
    public void recvMessage(Session session,  ImMessage message) {

        switch (message.getType()){
            case ImMessage.MSG_TYPE_CHAT:
            {
                if(StringUtils.isBlank(message.getReceiver()))
                    break;
                this.sendMessage(message.getReceiver(), message);
                break;
            }
            case ImMessage.MSG_TYPE_QUESTION:
                askRobot(session,  message);
                break;
            case ImMessage.MSG_TYPE_GROUP:
                this.sendGroupMessage(message.getReceiver(), message);
                break;
            case ImMessage.MSG_TYPE_BROADCAST:
                this.broadcastMessage(message);
                break;
            case ImMessage.MSG_TYPE_TOALL:
                this.toallMessage(message);
                break;
            case ImMessage.MSG_TYPE_COMMAND:
                this.onCommand(session,message);
                break;
        }
    }
    /**
     * 接受消息，并对消息进行处理
     * @param session
     * @param jsonMessage
     */
    @Override
    @Transactional
    public void recvMessage(Session session, String jsonMessage){
        ImMessage msg = ImMessageUtils.fromJSonString(jsonMessage);
        if(StringUtils.isBlank(msg.getSender())){
            msg.setSender( getUserCodeBySession(session));
        }
        recvMessage(session,msg);
    }

    private boolean pushMessage(Session session , ImMessage message) {
        if(session==null)
            return false;
        session.getAsyncRemote().sendText(message.toString());
        return true;
    }

    private boolean pushMessage(String userCode, ImMessage message) {
        Session session = getSessionByUserCode(userCode);
        return pushMessage(session, message);
    }

    /**
     * 发送消息
     *
     * @param userCode
     * @param message
     */
    @Override
    @Transactional
    public void sendMessage(String userCode, ImMessage message) {

        WebImMessage webMessage = new WebImMessage();
        webMessage.copy(message);
        webMessage.setMsgId(UuidOpt.getUuidAsString32());
        webMessage.setMsgType("C");
        webMessage.setMsgState("U");
        Session session = getSessionByUserCode(userCode);
        if(session!=null) {
            pushMessage(session, message);
        }else{
            if(StringUtils.equals("sms",noticeType)){
                Map<String, Object> content = message.getContent();
                notificationCenter.sendMessage(
                        message.getSender(),message.getReceiver(),
                        "离线消息",
                        StringBaseOpt.objectToString(content.get("msg")),
                        "sms");
            }
        }
        webMessage.setSendTime(DatetimeOpt.currentUtilDate());
        messageDao.saveNewObject(webMessage);
    }

    /**
     * 发送小组（群）信息
     *
     * @param unitCode
     * @param message
     */
    @Override
    @Transactional
    public void sendGroupMessage(String unitCode, ImMessage message) {
        List<? extends IUserUnit> users =
                platformEnvironment.listUnitUsers(unitCode);
        for(IUserUnit user : users){
            pushMessage(user.getUserCode(), message);
        }

        WebImMessage webMessage = new WebImMessage();
        webMessage.copy(message);
        webMessage.setMsgId(UuidOpt.getUuidAsString32());
        webMessage.setMsgType("G");
        webMessage.setMsgState("U");
        webMessage.setSendTime(DatetimeOpt.currentUtilDate());
        messageDao.saveNewObject(webMessage);
    }

    /**
     * 广播信息（所有人）
     *
     * @param message
     */
    @Override
    @Transactional
    public void toallMessage( ImMessage message) {
        List<? extends IUserInfo> users =
                platformEnvironment.listAllUsers();
        for(IUserInfo user : users){
            pushMessage(user.getUserCode(), message);
        }

        WebImMessage webMessage = new WebImMessage();
        webMessage.copy(message);
        webMessage.setMsgId(UuidOpt.getUuidAsString32());
        webMessage.setMsgType("G");
        webMessage.setMsgState("U");
        webMessage.setReceiver("all");
        webMessage.setSendTime(DatetimeOpt.currentUtilDate());
        messageDao.saveNewObject(webMessage);
    }

    /**
     * 广播信息（在线人员）
     *
     * @param message
     */
    @Override
    public void broadcastMessage( ImMessage message) {
        for(Session session : sessionToUserCode.keySet()) {
            pushMessage(session, message);
        }
    }

    /**
     * 检验用户的状态
     *
     * @param users
     */
    @Override
    public Map<String, String> checkUsersState(List<? extends IUserInfo> users) {
        Map<String, String> userState = new HashMap<>();
        if(users==null)
            return userState;
        for(IUserInfo user : users){
            userState.put(user.getUserCode(),
                    getSessionByUserCode(user.getUserCode())==null?
                            ImMessage.USER_STATE_OFFLINE:ImMessage.USER_STATE_ONLINE);
        }
        return userState;
    }

    /**
     * 检验用户的状态
     */
    @Override
    public String checkUserState(String userCode){
        return  getSessionByUserCode(userCode)==null?
                ImMessage.USER_STATE_OFFLINE:ImMessage.USER_STATE_ONLINE;
    }
    /**
     * 检验用户的状态
     *
     * @param users
     */
    @Override
    public Map<String, String> checkUnitUserState(List<? extends IUserUnit> users) {
        Map<String, String> userState = new HashMap<>();
        if(users==null)
            return userState;
        for(IUserUnit user : users){
            userState.put(user.getUserCode(),
                    getSessionByUserCode(user.getUserCode())==null?
                            ImMessage.USER_STATE_OFFLINE:ImMessage.USER_STATE_ONLINE);
        }
        return userState;
    }

    @Override
    public Set<String> getAllOnlineUsers() {
        return userCodeToSession.keySet();
    }
}
