package com.centit.im.service;

import com.centit.framework.model.basedata.IUnitInfo;
import com.centit.im.po.WebImFriendMemo;
import com.centit.im.po.WebImCustomer;
import com.centit.im.po.WebImGroup;
import com.centit.im.po.WebImGroupMember;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by codefan on 17-5-26.
 */
public interface WebImUserManager {

    /**
     * 根据用户代码 获取用户信息
     * @param userCode
     * @return
     */
    WebImCustomer getUser(String userCode);


    /**
     * 注册用户信息
     * @param user
     * @return
     */
    int registerUser(WebImCustomer user);
    /**
     * 返回系统所有联系人（聊天模式） 或者 所有客服专家（客服模式）
     * @return
     */
    List<WebImCustomer> listAllUser();


    /**
     *  返回客服专家（客服模式）所有服务的对象
     * @param serviceUserCode   客服代码
     * @param lastServiceDate   最后服务时间，如果为null 默认为一个月内交流过的客服
     * @return
     */
    List<WebImCustomer> listServiceCustomer(String serviceUserCode, Date lastServiceDate);

    /**
     * 获取所有的客服
     * @return
     */
    List<WebImCustomer> listCustomerService();

    /**
     * 返回机构中的成员
     */
    List<WebImCustomer> listAllUnitUser(String unitCode);

    /**
     * 返回系统联系状态
     */
    Map<String, String> listAllUserState();

    /**
     * 返回系统所有机构
     */
    List<? extends IUnitInfo> listAllUnit();


    /**
     * 返回下级机构
     * @param parentUnitCode 上级机构代码， '0' 返回顶层机构
     * @return
     */
    List<? extends IUnitInfo> listSubUnit(String parentUnitCode);
    /**
     * 返回用户的组（群、机构）
     * @param userCode
     * @return
     */
    List<IUnitInfo> listUserUnit(String  userCode);

    /**
     * 配置用户信息
     * @param userCode
     * @param cust
     * @return
     */
    String configUserInfo(String userCode,WebImCustomer cust);

    /**
     * 设置用户 朋友的备注信息
     * @param memo
     */
    void saveUserFriendMemo(WebImFriendMemo memo);

    /**
     * 创建群
     * @param userCode
     * @param webImGroup
     */
    void saveGroup(String userCode,WebImGroup webImGroup,WebImGroupMember webImGroupMember);

    /**
     * 申请加入群
     * @param userCode
     * @param groupId
     */
    void addGroup(String userCode, String groupId,WebImGroupMember webImGroupMember);

//    /**
//     * 拉进群
//     * @param userCode
//     * @param groupId
//     */
//    void inviteGroup(String userCode, String groupId);

    /**
     * 获取群成员信息
     * @param groupId
     * @return
     */
    List<WebImGroupMember> listGroupMember(String groupId);

    /**
     * 修改个人在群中的信息
     * @param webImGroupMember
     */
    void updateGroupMember(WebImGroupMember webImGroupMember);

    /**
     * 修改群信息
     * @param groupId
     * @param webImGroup
     */
    void updateGroup(String groupId,WebImGroup webImGroup);

    /**
     * 退出群
     * @param userCode
     * @param groupId
     */
    void quitGroup(String userCode,String groupId);

    /**
     * 解散群
     * @param userCode
     * @param groupId
     */
    void dissolveGroup(String userCode,String groupId);

    WebImGroup getWebImGroup(String groupId);
}
