package com.centit.im.service.impl;

import com.centit.framework.components.CodeRepositoryUtil;
import com.alibaba.fastjson.JSONArray;
import com.centit.framework.common.WebOptUtils;
import com.centit.framework.model.adapter.PlatformEnvironment;
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
import com.centit.im.socketio.ImMessage;
import com.centit.support.algorithm.DatetimeOpt;
import org.apache.commons.lang3.StringUtils;
import com.centit.support.algorithm.UuidOpt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;

/**
 * Created by codefan on 17-5-26.
 */
@Service("webImUserManager")
public class WebImUserManagerImpl implements WebImUserManager {

    @Resource
    protected PlatformEnvironment platformEnvironment;

    @Resource
    protected WebImSocket webImSocket;

    @Resource
    protected WebImCustomerDao customerDao;

    @Resource
    protected FriendMemoDao friendMemoDao;

    @Resource
    protected WebImGroupDao webImGroupDao;

    @Resource
    protected WebImGroupMemberDao webImGroupMemberDao;
    /**
     * 返回联系人信息
     */
    @Override
    @Transactional
    public WebImCustomer getUser(String userCode) {
        WebImCustomer cust = customerDao.getObjectById(userCode);
        if (cust == null) {
            IUserInfo ui = platformEnvironment.getUserInfoByUserCode(userCode);
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
        WebImCustomer customer = customerDao.getObjectById(user.getUserCode());
        /*{
            cust.copyNotNullProperty(user);
            customerDao.updateObject(cust);
        }else*/
        if(customer == null){
            user.setCreator("U0000000");
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

        List<? extends IUserInfo> users = platformEnvironment.listAllUsers();
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
     * @return
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
    * 返回机构中的成员
    */
    @Override
    @Transactional
    public List<WebImCustomer> listAllUnitUser( String unitCode ) {

        List<? extends IUserUnit> users = platformEnvironment.listUnitUsers(unitCode);
        List<WebImCustomer> allcusts = new ArrayList<>(users.size());
        for(IUserUnit user : users){
            WebImCustomer cust = customerDao.getObjectById(user.getUserCode());
            if(cust==null){
                IUserInfo ui= platformEnvironment.getUserInfoByUserCode(user.getUserCode());
                cust = new WebImCustomer(user.getUserCode(),ui.getUserName());
                cust.setUserType("U");
                cust.setOsId(ImMessage.DEFAULT_OSID);
            }
            cust.setUserState(webImSocket.checkUserState(cust.getUserCode()));
            allcusts.add(cust);
        }
        return allcusts;
    }

    /**
     * 返回系统联系状态
     */
    @Override
    @Transactional
    public Map<String, String> listAllUserState() {
        List<? extends IUserInfo> users = platformEnvironment.listAllUsers();
        return webImSocket.checkUsersState(users);
    }

    /**
     * 返回系统所有机构
     */
    @Override
    @Transactional
    public List<? extends IUnitInfo> listAllUnit() {
        return platformEnvironment.listAllUnits();
    }

    /**
     * 返回下级机构
     * @param parentUnitCode 上级机构代码， '0' 返回顶层机构
     * @return
     */
    @Override
    @Transactional
    public List<? extends IUnitInfo> listSubUnit(String parentUnitCode){
        List<? extends IUnitInfo> allUnits = platformEnvironment.listAllUnits();
        List<IUnitInfo> units = new ArrayList<>();
        for (IUnitInfo uc : allUnits) {
            //获取顶层机构
            if (StringUtils.isBlank(parentUnitCode) || "0".equals(parentUnitCode)){
                if(StringUtils.isBlank(uc.getParentUnit()) || "0".equals(uc.getParentUnit())) {
                    units.add(uc);
                }
            }else if(parentUnitCode.equals(uc.getParentUnit())) {
                units.add(uc);
            }
        }
        return units;
    }

    @Override
    @Transactional
    public List<IUnitInfo> listUserUnit(String  userCode) {
        List<? extends IUserUnit> units = platformEnvironment.listUserUnits(userCode);
        if(units==null || units.size()<1)
            return null;
        List<IUnitInfo> userUnits = new ArrayList<>(units.size());
        for( IUserUnit unit : units ) {
            userUnits.add(platformEnvironment.getUnitInfoByUnitCode(unit.getUnitCode()));
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
        WebImCustomer dbWebImCustomer = customerDao.getObjectById(userCode);
        dbWebImCustomer.copyNotNullProperty(cust);
        customerDao.mergeObject(dbWebImCustomer);
        return userCode;
    }

    @Override
    @Transactional
    public void saveUserFriendMemo(WebImFriendMemo memo){
        friendMemoDao.saveNewObject(memo);
    }

    /**
     * 创建群
     * @param userCode
     * @param webImGroup
     */
    @Override
    @Transactional
    public void saveGroup(String userCode, WebImGroup webImGroup,WebImGroupMember webImGroupMember) {
        webImGroup.setGroupId(UuidOpt.getUuidAsString32());
        webImGroup.setCreator(userCode);
        webImGroup.setCreateTime(DatetimeOpt.currentUtilDate());
        webImGroupMember.setGroupId(webImGroup.getGroupId());
        webImGroupMember.setUserCode(userCode);
        webImGroupMember.setGroupMemo(webImGroup.getGroupName());
        webImGroupMember.setJoinTime(DatetimeOpt.currentUtilDate());
        webImGroupMember.setLastPushTime(DatetimeOpt.currentUtilDate());
        webImGroupDao.saveNewObject(webImGroup);
        webImGroupMemberDao.saveNewObject(webImGroupMember);
    }

    /**
     * 创建群
     * @param userCode
     * @param webImGroup
     */
    @Override
    @Transactional
    public WebImGroup saveGroup(String userCode, WebImGroup webImGroup,WebImGroupMember[] webImGroupMembers) {
        webImGroup.setGroupId(UuidOpt.getUuidAsString32());
        webImGroup.setCreator(userCode);
        webImGroup.setCreateTime(DatetimeOpt.currentUtilDate());
        webImGroupDao.saveNewObject(webImGroup);
        for (WebImGroupMember webImGroupMember : webImGroupMembers){
            webImGroupMember.setGroupId(webImGroup.getGroupId());
            webImGroupMember.setUserCode(userCode);
            webImGroupMember.setGroupMemo(webImGroup.getGroupName());
            webImGroupMember.setJoinTime(DatetimeOpt.currentUtilDate());
            webImGroupMember.setLastPushTime(DatetimeOpt.currentUtilDate());
            webImGroupMemberDao.saveNewObject(webImGroupMember);
        }
        return webImGroup;
    }

    /**
     * 加入群
     * @param userCode
     * @param groupId
     */
    @Override
    @Transactional
    public void addGroup(String userCode, String groupId,WebImGroupMember webImGroupMember) {
        WebImGroup dbWebImGroup = webImGroupDao.getObjectById(groupId);
        webImGroupMember.setGroupMemo(dbWebImGroup.getGroupName());
        webImGroupMember.setUserCode(userCode);
        webImGroupMember.setGroupId(groupId);
        webImGroupMember.setJoinTime(DatetimeOpt.currentUtilDate());
        webImGroupMember.setLastPushTime(DatetimeOpt.currentUtilDate());
        webImGroupMemberDao.saveNewObject(webImGroupMember);
    }

    /**
     * 获取群成员信息
     * @param groupId
     * @return
     */
    @Override
    public List<WebImGroupMember> listGroupMember(String groupId){
        return webImGroupMemberDao.listObjectsByProperty("groupId",groupId);
    }

    /**
     * 修改个人在群中的信息
     * @param webImGroupMember
     */
    @Override
    public void updateGroupMember(WebImGroupMember webImGroupMember){
        WebImGroupMember dbWebImGroupMember = webImGroupMemberDao.getObjectById(new WebImGroupMemberId(webImGroupMember.getUserCode(),webImGroupMember.getGroupId()));
        dbWebImGroupMember.copy(webImGroupMember);
        webImGroupMemberDao.updateObject(dbWebImGroupMember);
    }

    /**
     * 修改群信息
     * @param groupId
     * @param webImGroup
     */
    @Override
    public void updateGroup(String groupId,WebImGroup webImGroup){
        webImGroupDao.updateObject(webImGroup);
    }

    /**
     * 退出群
     * @param userCode
     * @param groupId
     */
    @Override
    public void quitGroup(String userCode,String groupId){
        webImGroupMemberDao.deleteObjectById(new WebImGroupMemberId(userCode,groupId));
    }

    /**
     * 解散群
     * @param userCode
     * @param groupId
     */
    @Override
    public void dissolveGroup(String userCode,String groupId){
        WebImGroup dbWebImGroup = webImGroupDao.getObjectById(groupId);
        if (dbWebImGroup.getCreator().equals(userCode)){
            webImGroupDao.deleteObjectById(groupId);
        }
        HashMap<String,Object> map = new HashMap();
        map.put("groupId",groupId);
        webImGroupMemberDao.deleteObjectsByProperties(map);
    }

    @Override
    public WebImGroup getWebImGroup(String groupId){
       return webImGroupDao.getObjectById(groupId);
    }

}

