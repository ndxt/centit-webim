package com.centit.im.service.impl;

import com.centit.framework.model.adapter.PlatformEnvironment;
import com.centit.framework.model.basedata.IUnitInfo;
import com.centit.framework.model.basedata.IUserInfo;
import com.centit.framework.model.basedata.IUserUnit;
import com.centit.im.dao.FriendMemoDao;
import com.centit.im.dao.WebImCustomerDao;
import com.centit.im.po.FriendMemo;
import com.centit.im.po.WebImCustomer;
import com.centit.im.service.WebImSocket;
import com.centit.im.service.WebImUserManager;
import com.centit.im.socketio.ImMessage;
import com.centit.support.algorithm.DatetimeOpt;
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
     * @param userCode
     * @param cust
     * @return
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
    public void saveUserFriendMemo(FriendMemo memo){
        friendMemoDao.saveNewObject(memo);
    }
}

