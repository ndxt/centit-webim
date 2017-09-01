package com.centit.im.client;

import com.centit.im.po.FriendMemo;
import com.centit.im.po.ImMessage;
import com.centit.im.po.WebImCustomer;

/**
 * Created by codefan on 17-4-11.
 */
public interface IMClient {

    void setFriendMemo(FriendMemo memo) throws Exception;

    /**
     * 注册用户 返回 token
     * @param user WebImCustomer对象
     * @throws Exception 异常
     */
    void registerUser(WebImCustomer user) throws Exception;

    /**
     * 设置用户
     * @param cust WebImCustomer对象
     * @throws Exception 异常
     */
    void setUserConfig(WebImCustomer cust) throws Exception;

    /**
     * 发送消息
     * @param message ImMessage对象
     * @throws Exception 异常
     */
    void sendMessage(ImMessage message) throws Exception;
}
