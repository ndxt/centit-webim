package com.centit.im.service.impl;

import com.centit.framework.common.WebOptUtils;
import com.centit.framework.components.CodeRepositoryUtil;
import com.centit.framework.filter.RequestThreadLocal;
import com.centit.framework.model.basedata.IUnitInfo;
import com.centit.framework.model.basedata.IUserInfo;
import com.centit.framework.model.basedata.IUserUnit;
import com.centit.im.dao.FriendMemoDao;
import com.centit.im.dao.WebImCustomerDao;
import com.centit.im.dao.WebImGroupDao;
import com.centit.im.dao.WebImGroupMemberDao;
import com.centit.im.po.*;
import com.centit.im.service.WebImSocket;
import com.centit.im.service.WebImUserManager;
import com.centit.support.algorithm.CollectionsOpt;
import com.centit.support.algorithm.DatetimeOpt;
import com.centit.support.algorithm.UuidOpt;
import com.centit.support.database.utils.PageDesc;
import com.centit.support.database.utils.QueryUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * Created by codefan on 17-5-26.
 */
@Service("webImUserManager")
public class WebImUserManagerImpl implements WebImUserManager {

    /*@Autowired
    protected PlatformEnvironment platformEnvironment;*/

    @Autowired
    protected WebImSocket webImSocket;

    @Autowired
    protected WebImCustomerDao customerDao;

    @Autowired
    protected FriendMemoDao friendMemoDao;

    @Autowired
    protected WebImGroupDao webImGroupDao;

    @Autowired
    protected WebImGroupMemberDao webImGroupMemberDao;
    /**
     * 返回联系人信息
     */
    @Override
    @Transactional
    public WebImCustomer getUser(String userCode) {
        HttpServletRequest request = RequestThreadLocal.getLocalThreadWrapperRequest();
        String topUnit = WebOptUtils.getCurrentTopUnit(request);
        WebImCustomer cust = customerDao.getObjectById(userCode);
        if (cust == null) {
            IUserInfo ui = CodeRepositoryUtil.getUserInfoByCode(topUnit, userCode);
            if (ui != null) {
                cust = new WebImCustomer(userCode, ui.getUserName());
                cust.setUserType("U");
                cust.setOsId(ImMessage.DEFAULT_OSID);
            }
        }
        if(cust!=null) {
            cust.setUserState(
                    webImSocket.checkUserState(userCode));
        }
        return cust;
    }

    /**
     * 注册用户信息
     *
     * @param user
     * @return
     */
    @Override
    public int registerUser(WebImCustomer user) {
        HttpServletRequest request = RequestThreadLocal.getLocalThreadWrapperRequest();
        String topUnit = WebOptUtils.getCurrentTopUnit(request);
        WebImCustomer customer = customerDao.getObjectById(user.getUserCode());
        if(customer == null){
            user.setCreator("U0000000");
            if(StringUtils.isBlank(user.getUserName())) {
                IUserInfo userInfo = CodeRepositoryUtil
                        .getUserInfoByCode(topUnit, user.getUserCode());
                if (userInfo != null) {
                    user.setUserName(userInfo.getUserName());
                }
            }
            user.setCreateTime(DatetimeOpt.currentUtilDate());
            user.setLastActiveDate(DatetimeOpt.currentUtilDate());
            customerDao.saveNewObject(user);
        }
        return 1;
    }

    /**
     * 返回系统所有联系人
     */
    @Override
    @Transactional
    public List<WebImCustomer> listAllUser() {
        HttpServletRequest request = RequestThreadLocal.getLocalThreadWrapperRequest();
        String topUnit = WebOptUtils.getCurrentTopUnit(request);
        List<? extends IUserInfo> users = CodeRepositoryUtil.listAllUsers(topUnit);
        if (users == null || users.size() < 1)
            return new ArrayList<>();
        List<WebImCustomer> custs = customerDao.listObjects();
        Map<String, WebImCustomer> customerMap = new HashMap<>(custs.size() * 3 / 2 + 1);
        for (WebImCustomer cust : custs) {
            customerMap.put(cust.getUserCode(), cust);
        }
        List<WebImCustomer> allcusts = new ArrayList<>(users.size());
        for (IUserInfo user : users) {
            WebImCustomer cust = customerMap.get(user.getUserCode());
            if (cust == null) {
                cust = new WebImCustomer(user.getUserCode(), user.getUserName());
                cust.setUserType("U");
                cust.setOsId(ImMessage.DEFAULT_OSID);
            }
            cust.setUserState(webImSocket.checkUserState(cust.getUserCode()));
            allcusts.add(cust);
        }
        return allcusts;
    }

    @Override
    @Transactional
    public List<WebImCustomer> listCustomerService(){

        List<WebImCustomer> allcusts = customerDao.listCustomerService();
        if(allcusts==null || allcusts.size()<1)
            return allcusts;
        for(WebImCustomer cust : allcusts) {
            cust.setUserState(webImSocket.checkUserState(cust.getUserCode()));
        }
        return allcusts;
    }

    /**
     *  返回客服专家（客服模式）所有服务的对象
     * @param serviceUserCode   客服代码
     * @param lastServiceDate   最后服务时间，如果为null 默认为一个月内交流过的客服
     * @return WebImCustomer 客户信息
     */
    @Override
    @Transactional
    public List<WebImCustomer> listServiceCustomer(String serviceUserCode, Date lastServiceDate){
        List<WebImCustomer> allcusts = customerDao.listServiceCustomer(serviceUserCode,lastServiceDate);
        for(WebImCustomer cust : allcusts) {
            cust.setUserState(webImSocket.checkUserState(cust.getUserCode()));
        }
        return allcusts;
    }

    /**
     * 返回所有服务过用户的 客服专家（客服模式）
     * @param custCode 用户代码
     * @param lastServiceDate   最后服务时间，如果为null 默认为一个月内交流过的客服
     * @return
     */
    @Override
    @Transactional
    public List<WebImCustomer> listCustomerService(String custCode, Date lastServiceDate){
        List<WebImCustomer> allcusts = customerDao.listCustomerService(custCode, lastServiceDate);
        for(WebImCustomer cust : allcusts) {
            cust.setUserState(webImSocket.checkUserState(cust.getUserCode()));
        }
        return allcusts;
    }

    private WebImCustomer fetchCustomerInfo(String userCode){
        HttpServletRequest request = RequestThreadLocal.getLocalThreadWrapperRequest();
        String topUnit = WebOptUtils.getCurrentTopUnit(request);
        IUserInfo ui= CodeRepositoryUtil.getUserInfoByCode(topUnit, userCode);
        if(ui==null){ //数据库数据不一致会导致这个情况
            return null;
        }
        WebImCustomer cust = new WebImCustomer(userCode,ui.getUserName());
        cust.setUserType("U");
        cust.setOsId(ImMessage.DEFAULT_OSID);
        return cust;
    }

    /**
    * 返回机构中的成员
    */
    @Override
    @Transactional
    public List<WebImCustomer> listUnitUsers(String unitCode ) {
        List<? extends IUserUnit> users = CodeRepositoryUtil.listUnitUsers(unitCode);
        List<WebImCustomer> allcusts = new ArrayList<>(users.size());
        for(IUserUnit user : users){
            WebImCustomer cust = customerDao.getObjectById(user.getUserCode());
            if(cust==null){
                cust = fetchCustomerInfo(user.getUserCode());
            }
            if(cust!=null) {
                cust.setUserState(webImSocket.checkUserState(cust.getUserCode()));
                allcusts.add(cust);
            }
        }
        return allcusts;
    }

    /**
     * 查询人员
     */
    @Override
    @Transactional
    public List<WebImCustomer> queryUsers(String name, PageDesc pageDesc){
//        List<WebImCustomer> result = customerDao.listObjects(
//                CollectionsOpt.createHashMap("userName", name), pageDesc);
//        if(result!=null && result.size()>0){
//            return result;
//        }
        HttpServletRequest request = RequestThreadLocal.getLocalThreadWrapperRequest();
        String topUnit = WebOptUtils.getCurrentTopUnit(request);
        List<? extends IUserInfo> users = CodeRepositoryUtil.listAllUsers(topUnit);
        if (users == null || users.size() < 1)
            return new ArrayList<>();
        List<WebImCustomer> allcusts = new ArrayList<>(pageDesc.getPageSize());
        int nMatchCount = 0;
        int startRow = pageDesc.getRowStart();
        int endRow = pageDesc.getRowEnd();
        for(IUserInfo user : users){
            if(StringUtils.contains(user.getUserName(), name)
                || StringUtils.contains(user.getRegCellPhone(), name)
                || StringUtils.contains(user.getLoginName(), name)){
                WebImCustomer cust = null;
                if(cust == null) {
                    nMatchCount++;
                    if (nMatchCount > startRow) {
                        cust = new WebImCustomer(user.getUserCode(), user.getUserName());
                        cust.setUserType("U");
                        cust.setOsId(ImMessage.DEFAULT_OSID);
                        cust.setUserState(ImMessage.USER_STATE_OFFLINE);
                        allcusts.add(cust);
                    }
                    if(nMatchCount>=endRow){
                        break;
                    }
                }
            }
        }
        pageDesc.setTotalRows(nMatchCount>=endRow? nMatchCount + pageDesc.getPageSize() :  nMatchCount);
        return allcusts;
    }

    /**
     * 返回系统联系状态
     */
    @Override
    @Transactional
    public Map<String, String> listAllUserState() {
        HttpServletRequest request = RequestThreadLocal.getLocalThreadWrapperRequest();
        String topUnit = WebOptUtils.getCurrentTopUnit(request);
        List<? extends IUserInfo> users = CodeRepositoryUtil.listAllUsers(topUnit);
        return webImSocket.checkUsersState(users);
    }

    /**
     * 返回系统所有机构
     */
    @Override
    @Transactional
    public List<? extends IUnitInfo> listAllUnit() {
        HttpServletRequest request = RequestThreadLocal.getLocalThreadWrapperRequest();
        String topUnit = WebOptUtils.getCurrentTopUnit(request);
        return CodeRepositoryUtil.listAllUnits(topUnit);
    }

    /**
     * 返回下级机构
     * @param parentUnitCode 上级机构代码， '0' 返回顶层机构
     * @return
     */
    @Override
    @Transactional
    public List<? extends IUnitInfo> listSubUnit(String parentUnitCode){
        HttpServletRequest request = RequestThreadLocal.getLocalThreadWrapperRequest();
        String topUnit = WebOptUtils.getCurrentTopUnit(request);
        List<? extends IUnitInfo> allUnits = CodeRepositoryUtil.listAllUnits(topUnit);
        List<IUnitInfo> units = new ArrayList<>();
        for (IUnitInfo uc : allUnits) {
            //获取顶层机构
            if (StringUtils.isBlank(parentUnitCode) || "0".equals(parentUnitCode)){
                if(StringUtils.isBlank(uc.getParentUnit()) || "0".equals(uc.getParentUnit())) {
                    units.add(uc);
                }
            } else if(parentUnitCode.equals(uc.getParentUnit())) {
                units.add(uc);
            }
        }
        return units;
    }

    @Override
    @Transactional
    public List<IUnitInfo> listUserUnits(String  userCode) {
        HttpServletRequest request = RequestThreadLocal.getLocalThreadWrapperRequest();
        String topUnit = WebOptUtils.getCurrentTopUnit(request);
        List<? extends IUserUnit> units = CodeRepositoryUtil.listUserUnits(topUnit, userCode);
        if(units==null || units.size()<1)
            return null;
        List<IUnitInfo> userUnits = new ArrayList<>(units.size());
        for( IUserUnit unit : units ) {
            IUnitInfo unitInfo = CodeRepositoryUtil.getUnitInfoByCode(topUnit, unit.getUnitCode());
            if(unitInfo!=null) {
                userUnits.add(unitInfo);
            }
        }
        return userUnits;
    }


    /**
     * 配置用户信息
     * @param userCode 用户代码
     * @param cust 聊天客户信息
     * @return 用户代码
     */
    @Override
    @Transactional
    public String configUserInfo(String userCode,WebImCustomer cust){
        cust.setUserCode(userCode);
        customerDao.updateObject(cust);
        return userCode;
    }

    @Override
    @Transactional
    public void saveUserFriendMemo(WebImFriendMemo memo){
        friendMemoDao.saveNewObject(memo);
    }

    private void saveMemberToGroup(String groupId,String memberCode){
        WebImGroupMember member =webImGroupMemberDao.getObjectById(new WebImGroupMemberId(groupId, memberCode));
        if(member!=null){
            return;
        }
        member = new WebImGroupMember(new WebImGroupMemberId(groupId, memberCode), DatetimeOpt.currentUtilDate());
        member.setJoinTime(DatetimeOpt.currentUtilDate());
        member.setOsId(ImMessage.DEFAULT_OSID);

        HttpServletRequest request = RequestThreadLocal.getLocalThreadWrapperRequest();
        String topUnit = WebOptUtils.getCurrentTopUnit(request);
        WebImCustomer customer = customerDao.getObjectById(memberCode);
         if(customer == null) {
             customer = new WebImCustomer();
             customer.setCreator("U0000000");
             customer.setUserCode(memberCode);
             customer.setUserName(memberCode);
             IUserInfo userInfo = CodeRepositoryUtil.getUserInfoByCode(topUnit, memberCode);
             if (userInfo != null){
                 customer.setUserName(userInfo.getUserName());
             }
             customer.setOsId(ImMessage.DEFAULT_OSID);
             customer.setCreateTime(DatetimeOpt.currentUtilDate());
             customer.setLastActiveDate(DatetimeOpt.currentUtilDate());
             customerDao.saveNewObject(customer);
        }

        member.setGroupAlias(customer.getUserName());
        webImGroupMemberDao.saveNewObject(member);
    }

    /**
     * 返回用户的群
     * @param userCode 用户所在的群 不包括机构
     * @return WebImGroup
     */
    @Override
    @Transactional
    public List<WebImGroup> listUserGroups(String  userCode){
        return webImGroupDao.listObjectsByFilter(
                "where GROUP_TYPE <> 'U' and GROUP_ID in " +
                        "(select UNIT_CODE from F_WEB_IM_GROUP_MEMBER " +
                        " where USER_CODE = ?)", new Object[]{userCode});
    }

    @Override
    @Transactional
    public List<WebImGroup> queryUserGroups(String userCode, String groupName){
        return webImGroupDao.listObjectsByFilter(
                "where GROUP_TYPE <> 'U' and GROUP_NAME like ? " +
                        " and GROUP_ID in " +
                        "(select UNIT_CODE from F_WEB_IM_GROUP_MEMBER " +
                        " where USER_CODE = ?) " ,
                new Object[]{QueryUtils.getMatchString(groupName), userCode});
    }

    @Override
    @Transactional
    public List<WebImGroup> queryGroups(Map<String, Object> params, PageDesc pageDesc){
        return webImGroupDao.listObjectsByProperties(params, pageDesc);
    }
    /**
     * 创建群
     * @param webImGroup
     */
    @Override
    @Transactional
    public String createGroup(WebImGroup webImGroup) {
        String groupId = webImGroup.getGroupId();
        if(StringUtils.isBlank(groupId)){
            groupId = UuidOpt.getUuidAsString22();
            webImGroup.setGroupId(groupId);
        }
        webImGroupDao.saveNewObject(webImGroup);
        String creator = webImGroup.getCreator();
        if(StringUtils.isNotBlank(creator)) {
            saveMemberToGroup(groupId,creator );
        }
        return groupId;
    }

    /**
     * 创建群
     * @param members  群成员
     * @param webImGroup 群信息
     */
    @Override
    @Transactional
    public String createGroupWithMembers(WebImGroup webImGroup, String[] members){
        String groupId = createGroup(webImGroup);

        if(members!=null) {
            for (String memberCode : members) {
                saveMemberToGroup(groupId, memberCode);
            }
        }
        return groupId;
    }

    /**
     * 加入群
     * @param webImGroup 群信息
     */
    @Override
    @Transactional
    public void updateGroupInfo(WebImGroup webImGroup) {
        if(webImGroup == null){
            return;
        }
        webImGroupDao.updateObject(webImGroup);
    }

    /**
     * 获取群成员信息
     * @param groupId
     * @return
     */
    @Override
    public List<WebImGroupMember> listGroupMembers(String groupId){
        return webImGroupMemberDao.listObjectsByProperties(
                CollectionsOpt.createHashMap("groupId",groupId));
    }

    /**
     * 修改个人在群中的信息
     * @param webImGroupMember
     */
    @Override
    @Transactional
    public void updateGroupMemberInfo(WebImGroupMember webImGroupMember){
        webImGroupMemberDao.updateObject(webImGroupMember);
    }

    /**
     * 修改群信息
     * @param groupId
     * @param memberCode
     */
    @Override
    @Transactional
    public void addGroupMember(String groupId,String memberCode){
        saveMemberToGroup(groupId,memberCode);
    }

    @Override
    @Transactional
    public void updateGroupMembers(String groupId, String[] members){
        if(members==null || members.length<1){
            return;
        }

        List<String> memberList = CollectionsOpt.arrayToList(members);
        List<WebImGroupMember> dbMembers = webImGroupMemberDao.listObjectsByProperties(
                CollectionsOpt.createHashMap("groupId",groupId));
        if(dbMembers!=null && dbMembers.size()>0){
            for( WebImGroupMember member : dbMembers){
                if(! memberList.contains(member.getUserCode())){
                    webImGroupMemberDao.deleteObjectById(member.getCid());
                }
            }
        }
        for (String memberCode : members){
            saveMemberToGroup(groupId,memberCode );
        }
    }
    /**
     * 退出群
     * @param userCode
     * @param groupId
     */
    @Override
    @Transactional
    public void removeGroupMember(String groupId,String userCode){
        webImGroupMemberDao.deleteObjectById(new WebImGroupMemberId(groupId, userCode));
    }

    /**
     * 解散群
     * @param userCode
     * @param groupId
     */
    @Override
    @Transactional
    public int dissolveGroup(String groupId, String userCode, boolean force){
        WebImGroup dbWebImGroup = webImGroupDao.getObjectById(groupId);
        if (dbWebImGroup !=null &&
                ( force ||  dbWebImGroup.getCreator().equals(userCode))){
            HashMap<String,Object> map = new HashMap();
            map.put("groupId",groupId);
            webImGroupMemberDao.deleteObjectsByProperties(map);
            webImGroupDao.deleteObjectById(groupId);
            return 1;
        }else{
            return -1;
        }
    }

    @Override
    public WebImGroup getGroupInfo(String groupId){
       return webImGroupDao.getObjectById(groupId);
    }

}

