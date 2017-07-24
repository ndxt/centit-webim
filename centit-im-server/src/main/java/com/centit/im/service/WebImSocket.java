package com.centit.im.service;

import com.centit.framework.model.basedata.IUserInfo;
import com.centit.framework.model.basedata.IUserUnit;
import com.centit.im.socketio.ImMessage;

import javax.websocket.Session;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by codefan on 17-5-19.
 */
public interface WebImSocket {

    /**
     * 登录
     * @param userCode
     * @param session
     */
    void signInUser(String userCode, Session session);

    /**
     * 登出服务
     * @param session
     */
    void signOutUser(Session session);

    /**
     * 接受消息，并对消息进行处理
     * @param session
     * @param jsonMessage
     */
    void recvMessage(Session session, String jsonMessage);

    /**
     * 接受消息，并对消息进行处理
     * @param session
     * @param message
     */
    void recvMessage(Session session, ImMessage message);

    /**
     * 发送消息
     * @param userCode
     * @param message
     */
    void sendMessage(String userCode, ImMessage message);

    /**
     * 发送小组（群）信息
     * @param unitCode
     * @param message
     */
    void sendGroupMessage(String unitCode, ImMessage message);

    /**
     * 广播信息（所有人）
     * @param message
     */
    void toallMessage(ImMessage message);

    /**
     * 广播信息（在线人员）
     * @param message
     */
    void broadcastMessage(ImMessage message);

    /**
     * 检验用户的状态
     */
    String checkUserState(String userCode);

    /**
     * 检验用户的状态
     */
    Map<String, String> checkUsersState(List<? extends IUserInfo> users);

    /**
     * 检验用户的状态
     */
    Map<String, String> checkUnitUserState(List<? extends IUserUnit> users);

    /**
     * 获取所有在线用户
     */
    Set<String> getAllOnlineUsers();
}
