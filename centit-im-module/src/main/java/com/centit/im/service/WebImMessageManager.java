package com.centit.im.service;

import com.centit.framework.core.dao.PageDesc;
import com.centit.framework.hibernate.service.BaseEntityManager;
import com.centit.im.po.WebImMessage;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by codefan on 17-5-22.
 */
public interface WebImMessageManager extends BaseEntityManager<WebImMessage,String> {

    /**
     * 获取 消息列表
     * @param pageDesc
     * @return
     */
    List<WebImMessage> listChatMessage(String sender, String receiver, Date lastReadDate, PageDesc pageDesc);

    List<WebImMessage> listAllChatMessage(String receiver, Date lastReadDate, PageDesc pageDesc);

    List<WebImMessage> listGroupChatMessage(String userCode ,String unitCode, Date lastReadDate, PageDesc pageDesc);


    Map<String,Integer> statUnreadMessage(String receiver);


    Map<String,Integer> statGroupUnreadMessage(String userCode);
    /**
     * 更改阅读状态  将未读信息 U 状态设置为 C
     * @param receiver
     * @param sender
     * @return
     */
    int setReadState(String receiver, String sender);

    /**
     * 更改客服模式的 阅读状态 将所有的未读信息 U 状态设置为 C
     * @param userCode
     * @return
     */
    int setReadState(String userCode);

    /**
     * 更改群聊阅读状态 ，插入 F_WEB_IM_READ_GROUP 更新 最后阅读时间
     * @param userCode
     * @param unitCode
     * @return
     */
    void setGroupReadState(String userCode, String unitCode);
}
