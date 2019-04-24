package com.centit.im.controller;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.centit.framework.common.JsonResultUtils;
import com.centit.framework.common.ResponseMapData;
import com.centit.framework.core.controller.BaseController;
import com.centit.framework.core.controller.WrapUpResponseBody;
import com.centit.framework.core.dao.PageQueryResult;
import com.centit.support.database.utils.PageDesc;
import com.centit.im.po.WebImMessage;
import com.centit.im.service.WebImMessageManager;
import com.centit.im.service.WebImSocket;
import com.centit.im.socketio.ImMessage;
import com.centit.im.socketio.ImMessageUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by codefan on 17-5-20.
 */
@Controller
@RequestMapping("/webim")
@Api(value = "即时消息发送接口", tags = "即时消息发送接口")
public class WebImController extends BaseController {

    @Resource
    protected WebImMessageManager webImMessageManager;

    @Resource
    protected WebImSocket webImSocket;

    public static JSONArray messgeListToJson(JSONArray messageList){
        if(CollectionUtils.isEmpty(messageList))
            return messageList;
        for(Object obj : messageList){
            JSONObject jsonObject = (JSONObject)obj;
            JSONObject jsonContent =  (JSONObject)JSON.parse(jsonObject.getString("content"));
            jsonObject.put("content", jsonContent);
            jsonObject.put("contentType", jsonContent.get("contentType"));
        }
        return messageList;
    }

    public static JSONArray messgeListToJson(List<WebImMessage> messageList){
        if(CollectionUtils.isEmpty(messageList))
            return null;
        return messgeListToJson((JSONArray)JSON.toJSON(messageList));
    }
    /**
     * 获取历史信息
     * @param receiver 接收人（一般为自己或者自己所在的组
     * @param sender    发送人
     * @param pageDesc  分页信息
     * @param lastReadDate 上次阅读消息的时间
     */
    @ApiOperation(value = "查询历史消息")
    @ApiImplicitParams({
    @ApiImplicitParam(name = "receiver", value = "发送人",
            required=true, paramType = "path", dataType= "String"),
            @ApiImplicitParam(name = "sender", value = "接收人",
                    required=true, paramType = "path", dataType= "String")})
    @RequestMapping(value = "/historyMessage/{receiver}/{sender}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public PageQueryResult listUserHistoryMessage(
            @PathVariable String receiver,@PathVariable String sender,
            PageDesc pageDesc, Date lastReadDate) {
        JSONArray listObjects = webImMessageManager
                .listChatMessage(sender, receiver, lastReadDate, pageDesc);
        return PageQueryResult.createJSONArrayResult(messgeListToJson(listObjects), pageDesc);
    }

    /**
     * 获取历史信息; 客服模式，获取对方的所有信息
     * @param receiver 接收人（一般为自己或者自己所在的组
     * @param pageDesc  分页信息
     * @param lastReadDate 上次阅读消息的时间
     * @param response HttpServletResponse
     */
    @RequestMapping(value = "/allHistoryMessage/{receiver}", method = RequestMethod.GET)
    public void listAllHistoryMessage(
            @PathVariable String receiver,
            PageDesc pageDesc, Date lastReadDate,
            HttpServletResponse response) {
        JSONArray listObjects = webImMessageManager
                .listAllChatMessage(receiver, lastReadDate, pageDesc);
        ResponseMapData resData = new ResponseMapData();
        resData.addResponseData(OBJLIST, messgeListToJson(listObjects));
        resData.addResponseData(PAGE_DESC, pageDesc);
        JsonResultUtils.writeResponseDataAsJson(resData, response);
    }

    /**
     * 获取群聊历史信息; 获取对方的所有信息
     * @param receiver 一般为用户所在的组
     * @param pageDesc  分页信息
     * @param lastReadDate 上次阅读消息的时间
     * @param response HttpServletResponse
     */
    @RequestMapping(value = "/groupHistoryMessage/{receiver}", method = RequestMethod.GET)
    public void listGroupHistoryMessage(
            @PathVariable String receiver,
            PageDesc pageDesc, Date lastReadDate,
            HttpServletResponse response) {
        JSONArray listObjects = webImMessageManager
                .listGroupChatMessage(receiver, lastReadDate, pageDesc);
        ResponseMapData resData = new ResponseMapData();
        resData.addResponseData(OBJLIST, messgeListToJson(listObjects));
        resData.addResponseData(PAGE_DESC, pageDesc);
        JsonResultUtils.writeResponseDataAsJson(resData, response);
    }

    /**
     * 获取群聊历史信息
     * @param userCode 接收人（一般为自己或者自己所在的组
     * @param unitCode  群 （机构）
     * @param pageDesc  分页信息
     * @param lastReadDate 上次阅读消息的时间
     * @param response HttpServletResponse
     */
    @RequestMapping(value = "/groupHistoryMessage/{userCode}/{unitCode}", method = RequestMethod.GET)
    public void listUserGroupHistoryMessage(
            @PathVariable String userCode,@PathVariable String unitCode,
            PageDesc pageDesc, Date lastReadDate,
            HttpServletResponse response) {

        JSONArray listObjects = webImMessageManager
                .listGroupChatMessage(userCode, unitCode, lastReadDate, pageDesc);
        ResponseMapData resData = new ResponseMapData();
        resData.addResponseData(OBJLIST, messgeListToJson(listObjects));
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
    @WrapUpResponseBody
    public Map<String,Integer> statGroupUnreadMessage(
            @PathVariable String userCode) {
        return webImMessageManager.statGroupUnreadMessage(userCode);
    }

    //获取未读信息统计数据 包括最后一条未读消息
    @RequestMapping(value = "/getUnreadLastMsg/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public JSONArray statUnreadWithLastMsg(
            @PathVariable String userCode) {
        JSONArray unreadSum = webImMessageManager.statUnreadWithLastMsg(userCode);
        return messgeListToJson(unreadSum);
    }

    //获取未读群信息统计数据 包括最后一条未读消息
    @RequestMapping(value = "/getGroupUnreadLastMsg/{userCode}", method = RequestMethod.GET)
    public void statGroupUnreadeWithLastMsg(
            @PathVariable String userCode,
            HttpServletResponse response) {
        JSONArray unreadSum = webImMessageManager.statGroupUnreadWithLastMsg(userCode);
        JsonResultUtils.writeSingleDataJson(messgeListToJson(unreadSum), response);
    }

    //设置信息状态
    @RequestMapping(value = "/setReadState/{receiver}/{sender}", method = RequestMethod.POST)
    public void setReadState(
            @PathVariable String receiver,@PathVariable String sender,
            HttpServletResponse response) {
        int ret = webImMessageManager.setReadState(receiver,sender);
        JsonResultUtils.writeSingleDataJson(ret, response);
    }

    //设置信息状态
    @RequestMapping(value = "/setGroupReadState/{receiver}/{unitCode}", method = RequestMethod.POST)
    public void setGroupReadState(
            @PathVariable String receiver,@PathVariable String unitCode,
            HttpServletResponse response) {
        webImMessageManager.setGroupReadState(receiver,unitCode);
        JsonResultUtils.writeSuccessJson(response);
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
