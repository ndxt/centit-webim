package com.centit.im.client;

import com.centit.im.po.FriendMemo;
import com.centit.im.po.ImMessage;
import com.centit.im.po.WebImCustomer;

import java.io.IOException;

/**
 * Created by codefan on 17-4-11.
 */
public interface IMClient {

    void setFriendMemo(FriendMemo memo) throws Exception;

    /**
     * 注册用户 返回 token
     * @param user
     */
    void registerUser(WebImCustomer user) throws Exception;

    void setUserConfig(WebImCustomer cust) throws Exception;


    void sendMessage(ImMessage message) throws Exception;
}
