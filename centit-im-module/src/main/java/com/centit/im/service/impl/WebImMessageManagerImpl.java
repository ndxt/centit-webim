package com.centit.im.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.centit.framework.jdbc.service.BaseEntityManagerImpl;
import com.centit.im.dao.WebImGroupDao;
import com.centit.im.dao.WebImGroupMemberDao;
import com.centit.im.dao.WebImMessageDao;
import com.centit.im.po.WebImMessage;
import com.centit.im.service.WebImMessageManager;
import com.centit.support.database.utils.PageDesc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.Map;

/**
 * Created by codefan on 17-5-22.
 */
@Service
public class WebImMessageManagerImpl extends BaseEntityManagerImpl<WebImMessage,
        java.lang.String,WebImMessageDao>
        implements WebImMessageManager {

    @Autowired
    private WebImGroupMemberDao webImGroupMemberDao;

    @Autowired
    private WebImGroupDao webImGroupDao;

    private WebImMessageDao webImMessageDao ;

    @NotNull
    @Autowired
    //@Qualifier("webImMessageDao")
    public void setWebImMessageDao(WebImMessageDao baseDao)
    {
        this.webImMessageDao = baseDao;
        setBaseDao(this.webImMessageDao);
    }


    @Override
    @Transactional(propagation= Propagation.REQUIRED)
    public JSONArray listChatMessage(String sender, String receiver,
                                              Date lastReadDate, PageDesc pageDesc) {
//        webImMessageDao.updateReadState(sender, receiver);//将消息设置为已读
        return webImMessageDao.listChatMessage(sender,receiver,lastReadDate,pageDesc);
    }

    @Override
    @Transactional(propagation= Propagation.REQUIRED)
    public JSONArray  listAllChatMessage(String receiver,
                                                  Date lastReadDate, PageDesc pageDesc) {
        webImMessageDao.updateReadState(receiver);//将消息设置为已读
        return webImMessageDao.listAllChatMessage(receiver,lastReadDate,pageDesc);
    }

    @Override
    @Transactional(propagation= Propagation.REQUIRED)
    public  JSONArray listGroupChatMessage(String receiver, Date lastReadDate, PageDesc pageDesc){
        return webImMessageDao.listGroupChatMessage(receiver,lastReadDate,pageDesc);
    }


    @Override
    @Transactional(propagation= Propagation.REQUIRED)
    public JSONArray listGroupChatMessage(String userCode,
                                                   String unitCode, Date lastReadDate, PageDesc pageDesc){
        webImGroupMemberDao.setGroupReadState(userCode, unitCode);
//        setGroupReadState(userCode,unitCode);
//        webImMessageDao.updateGroupReadState(userCode,unitCode, DatetimeOpt.currentUtilDate());
        return webImMessageDao.listGroupChatMessage(unitCode,lastReadDate,pageDesc);
    }


    @Override
    @Transactional(propagation= Propagation.REQUIRED)
    public Map<String, Integer> statUnreadMessage(String receiver) {
        return webImMessageDao.statUnreadMsg(receiver);//通过视图统计个人未读消息数量
    }


    @Override
    @Transactional(propagation= Propagation.REQUIRED)
    public Map<String, Integer> statGroupUnreadMessage(String userCode) {
        return webImMessageDao.statGroupUnreadMsg(userCode);//通过视图统计组未读消息数量
    }

    @Override
    @Transactional(propagation= Propagation.REQUIRED)
    public JSONArray statUnreadWithLastMsg(String receiver) {
        return webImMessageDao.statUnreadWithLastMsg(receiver);
    }

    @Override
    @Transactional(propagation= Propagation.REQUIRED)
    public JSONArray statGroupUnreadWithLastMsg(String userCode) {
        return webImMessageDao.statGroupUnreadWithLastMsg(userCode);
    }

    @Override
    @Transactional(propagation= Propagation.REQUIRED)
    public int setReadState(String receiver, String sender) {
       return webImMessageDao.updateReadState(sender,receiver);//将消息设置为已读
    }

    @Override
    @Transactional(propagation= Propagation.REQUIRED)
    public int setReadState(String userCode) {
        return webImMessageDao.updateReadState(userCode);//将消息设置为已读
    }

    @Override
    @Transactional(propagation= Propagation.REQUIRED)
    public void setGroupReadState(String userCode, String unitCode) {
        webImGroupMemberDao.setGroupReadState(userCode,unitCode);
    }

}
