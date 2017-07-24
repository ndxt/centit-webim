package com.centit.im.controller;


import com.centit.framework.core.common.JsonResultUtils;
import com.centit.framework.core.common.ResponseData;
import com.centit.framework.core.controller.BaseController;
import com.centit.framework.core.dao.PageDesc;
import com.centit.im.socketio.ImMessage;
import com.centit.im.po.WebImMessage;
import com.centit.im.service.WebImMessageManager;
import com.centit.im.socketio.ImMessageUtils;
import com.centit.im.service.WebImSocket;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by codefan on 17-5-20.
 */
@Controller
@RequestMapping("/webim")
public class WebImController extends BaseController {

    @Resource
    protected WebImMessageManager webImMessageManager;

    @Resource
    protected WebImSocket webImSocket;


    /**
     * 获取历史信息
     * @param receiver 接收人（一般为自己或者自己所在的组
     * @param sender    发送人
     * @param pageDesc  分页信息
     * @param lastReadDate 上次阅读消息的时间
     * @param response
     */
    @RequestMapping(value = "/historyMessage/{receiver}/{sender}", method = RequestMethod.GET)
    public void listUserHistoryMessage(
            @PathVariable String receiver,@PathVariable String sender,
            PageDesc pageDesc, Date lastReadDate,
            HttpServletResponse response) {
        List<WebImMessage> listObjects = webImMessageManager
                .listChatMessage(sender, receiver, lastReadDate, pageDesc);
        ResponseData resData = new ResponseData();
        resData.addResponseData(OBJLIST, listObjects);
        resData.addResponseData(PAGE_DESC, pageDesc);
        JsonResultUtils.writeResponseDataAsJson(resData, response);
    }

    /**
     * 获取历史信息; 客服模式，获取对方的所有信息
     * @param receiver 接收人（一般为自己或者自己所在的组
     * @param pageDesc  分页信息
     * @param lastReadDate 上次阅读消息的时间
     * @param response
     */
    @RequestMapping(value = "/allHistoryMessage/{receiver}", method = RequestMethod.GET)
    public void listAllHistoryMessage(
            @PathVariable String receiver,
            PageDesc pageDesc, Date lastReadDate,
            HttpServletResponse response) {
        List<WebImMessage> jsonArry = webImMessageManager
                .listAllChatMessage(receiver, lastReadDate, pageDesc);
        ResponseData resData = new ResponseData();
        resData.addResponseData(OBJLIST, jsonArry);
        resData.addResponseData(PAGE_DESC, pageDesc);
        JsonResultUtils.writeResponseDataAsJson(resData, response);
    }

    /**
     * 获取群聊历史信息
     * @param userCode 接收人（一般为自己或者自己所在的组
     * @param unitCode  群 （机构）
     * @param pageDesc  分页信息
     * @param lastReadDate 上次阅读消息的时间
     * @param response
     */
    @RequestMapping(value = "/groupHistoryMessage/{userCode}/{unitCode}", method = RequestMethod.GET)
    public void listUserGroupHistoryMessage(
            @PathVariable String userCode,@PathVariable String unitCode,
            PageDesc pageDesc, Date lastReadDate,
            HttpServletResponse response) {

        List<WebImMessage> listObjects = webImMessageManager
                .listGroupChatMessage(userCode, unitCode, lastReadDate, pageDesc);
        ResponseData resData = new ResponseData();
        resData.addResponseData(OBJLIST, listObjects);
        resData.addResponseData(PAGE_DESC, pageDesc);
        JsonResultUtils.writeResponseDataAsJson(resData, response);
    }

    //获取未读信息统计数据
    @RequestMapping(value = "/statUnread/{userCode}", method = RequestMethod.GET)
    public void statUnreadMessage(
            @PathVariable String userCode,
            HttpServletResponse response) {
        Map<String,Integer> unreadSum = webImMessageManager.statUnreadMessage(userCode);
        JsonResultUtils.writeSingleDataJson(unreadSum, response);
    }

    //获取未读群信息统计数据
    @RequestMapping(value = "/statGroupUnread/{userCode}", method = RequestMethod.GET)
    public void statGroupUnreadMessage(
            @PathVariable String userCode,
            HttpServletResponse response) {
        Map<String,Integer> unreadSum = webImMessageManager.statGroupUnreadMessage(userCode);
        JsonResultUtils.writeSingleDataJson(unreadSum, response);
    }

    //设置信息状态
    @RequestMapping(value = "/setReadState/{receiver}/{sender}", method = RequestMethod.POST)
    public void setMessageState(
            @PathVariable String receiver,@PathVariable String sender,
            HttpServletResponse response) {
        int ret = webImMessageManager.setReadState(receiver,sender);
        JsonResultUtils.writeSingleDataJson(ret, response);
    }


    //发送消息，给第三方使用
    @RequestMapping(value = "/sendMessage/{receiver}/{sender}", method = RequestMethod.POST)
    public void sendMessage(
            @PathVariable String receiver,@PathVariable String sender,
            @RequestBody ImMessage message,
            HttpServletResponse response) {

        message.setReceiver(receiver);
        message.setSender(sender);
        ImMessageUtils.checkMessage(message);
        webImSocket.sendMessage(receiver,message);
        JsonResultUtils.writeSuccessJson(response);
    }

    //发送群（组、机构）消息，给第三方使用
    @RequestMapping(value = "/sendUnitMessage/{receiver}/{sender}", method = RequestMethod.POST)
    public void sendGroupMessage(
            @PathVariable String receiver,@PathVariable String sender,
            @RequestBody ImMessage message,
            HttpServletResponse response) {

        message.setReceiver(receiver);
        message.setSender(sender);
        ImMessageUtils.checkMessage(message);
        webImSocket.sendGroupMessage(receiver,message);
        JsonResultUtils.writeSuccessJson(response);
    }

    //广播消息，给第三方使用
    @RequestMapping(value = "/toall/{sender}", method = RequestMethod.POST)
    public void toallMessage(@PathVariable String sender,
                             @RequestBody ImMessage message,
                             HttpServletResponse response) {
        message.setSender(sender);
        ImMessageUtils.checkMessage(message);
        webImSocket.toallMessage(message);
        JsonResultUtils.writeSuccessJson(response);
    }

    //在线广播消息，给第三方使用
    @RequestMapping(value = "/broadcast/{sender}", method = RequestMethod.POST)
    public void broadcastMessage(@PathVariable String sender,
                                 @RequestBody ImMessage message,
                                 HttpServletResponse response) {
        message.setSender(sender);
        ImMessageUtils.checkMessage(message);
        webImSocket.broadcastMessage(message);
        JsonResultUtils.writeSuccessJson(response);
    }


}
