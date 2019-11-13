package com.centit.im.client;

import com.centit.im.dto.FriendMemo;
import com.centit.im.dto.WebImCustomer;
import com.centit.im.po.ImMessage;

/**
 * Created by codefan on 17-4-11.
 */
public interface IMClient {

    void setFriendMemo(FriendMemo memo);

    /**
     * 注册用户 返回 token
     * @param user WebImCustomer对象
     * @throws Exception 异常
     */
    void registerUser(WebImCustomer user);

    /**
     * 设置用户
     * @param cust WebImCustomer对象
     * @throws Exception 异常
     */
    void setUserConfig(WebImCustomer cust);

    /**
     * 发送消息
     * @param message ImMessage对象
     * @throws Exception 异常
     */
    void sendMessage(ImMessage message);
}
