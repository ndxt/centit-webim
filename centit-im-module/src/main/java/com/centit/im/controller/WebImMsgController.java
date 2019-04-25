package com.centit.im.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.centit.framework.common.JsonResultUtils;
import com.centit.framework.common.ResponseData;
import com.centit.framework.common.ResponseMapData;
import com.centit.framework.core.controller.BaseController;
import com.centit.framework.core.controller.WrapUpResponseBody;
import com.centit.framework.core.dao.PageQueryResult;
import com.centit.im.po.WebImMessage;
import com.centit.im.service.WebImMessageManager;
import com.centit.im.socketio.ImMessage;
import com.centit.im.socketio.ImMessageUtils;
import com.centit.support.database.utils.PageDesc;
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
 * Created by codefan on 17-5-26.
 */
@Controller
@Api(value = "消息管理接口", tags = "消息管理接口")
@RequestMapping("/webimmsg")
public class WebImMsgController extends BaseController {

    @Resource
    protected WebImMessageManager webImMessageManager;
    public static JSONArray messgeListToJson(JSONArray messageList){
        if(CollectionUtils.isEmpty(messageList))
            return messageList;
        for(Object obj : messageList){
            JSONObject jsonObject = (JSONObject)obj;
            JSONObject jsonContent =  (JSONObject) JSON.parse(jsonObject.getString("content"));
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
    @ApiOperation(value = "1查询历史消息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "receiver", value = "接收人",
                    required=true, paramType = "path", dataType= "String"),
            @ApiImplicitParam(name = "sender", value = "发送人",
                    required=true, paramType = "path", dataType= "String")})
    @RequestMapping(value = "/historyMessage/{receiver}/{sender}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public PageQueryResult listUserHistoryMessage(
            @PathVariable String receiver, @PathVariable String sender,
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
     *
     */
    @ApiOperation(value = "2获取收到所有信息")
    @ApiImplicitParam(name = "lastReadDate", value = "上次消息的时间",
                    required=false, paramType = "query", dataType= "String")
    @RequestMapping(value = "/allHistoryMessage/{receiver}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public PageQueryResult listAllHistoryMessage(
            @PathVariable String receiver,
            PageDesc pageDesc, Date lastReadDate) {
        JSONArray listObjects = webImMessageManager
                .listAllChatMessage(receiver, lastReadDate, pageDesc);
        return PageQueryResult.createJSONArrayResult(messgeListToJson(listObjects), pageDesc);
    }

    /**
     * 获取群聊历史信息; 获取对方的所有信息
     * @param receiver 一般为用户所在的组
     * @param pageDesc  分页信息
     * @param lastReadDate 上次阅读消息的时间
     *
     */
    @ApiOperation(value = "3获取群聊历史信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "receiver", value = "接收人",
                    required=true, paramType = "path", dataType= "String"),
            @ApiImplicitParam(name = "lastReadDate", value = "上次消息的时间",
                    required=false, paramType = "path", dataType= "String")})
    @RequestMapping(value = "/groupHistoryMessage/{receiver}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public PageQueryResult listGroupHistoryMessage(
            @PathVariable String receiver,
            PageDesc pageDesc, Date lastReadDate) {
        JSONArray listObjects = webImMessageManager
                .listGroupChatMessage(receiver, lastReadDate, pageDesc);
        return PageQueryResult.createJSONArrayResult(messgeListToJson(listObjects), pageDesc);
    }

    /**
     * 获取群聊历史信息
     * @param userCode 接收人（一般为自己或者自己所在的组
     * @param unitCode  群 （机构）
     * @param pageDesc  分页信息
     * @param lastReadDate 上次阅读消息的时间
     *
     */
    @ApiOperation(value = "4获取组群聊历史信息")

    @RequestMapping(value = "/groupHistoryMessage/{userCode}/{unitCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public PageQueryResult listUserGroupHistoryMessage(
            @PathVariable String userCode,@PathVariable String unitCode,
            PageDesc pageDesc, Date lastReadDate) {

        JSONArray listObjects = webImMessageManager
                .listGroupChatMessage(userCode, unitCode, lastReadDate, pageDesc);
        return PageQueryResult.createJSONArrayResult(messgeListToJson(listObjects), pageDesc);
    }

    //获取未读信息统计数据
    @ApiOperation(value = "5获取未读信息统计")

    @RequestMapping(value = "/statUnread/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public Map<String,Integer> statUnreadMessage(
            @PathVariable String userCode) {
        return webImMessageManager.statUnreadMessage(userCode);
    }

    //获取未读群信息统计数据
    @ApiOperation(value = "6获取未读群信息统计")

    @RequestMapping(value = "/statGroupUnread/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public Map<String,Integer> statGroupUnreadMessage(
            @PathVariable String userCode) {
        return webImMessageManager.statGroupUnreadMessage(userCode);
    }

    //获取未读信息统计数据 包括最后一条未读消息
    @ApiOperation(value = "7获取最后未读信息及统计")

    @RequestMapping(value = "/getUnreadLastMsg/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public JSONArray statUnreadWithLastMsg(
            @PathVariable String userCode) {
         JSONArray listObjects = webImMessageManager.statUnreadWithLastMsg(userCode);
        return messgeListToJson(listObjects);
    }

    //获取未读群信息统计数据 包括最后一条未读消息
    @ApiOperation(value = "8获取包括最后未读群信息统计")

    @RequestMapping(value = "/getGroupUnreadLastMsg/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public JSONArray statGroupUnreadeWithLastMsg(
            @PathVariable String userCode) {
        JSONArray obj = webImMessageManager.statGroupUnreadWithLastMsg(userCode);
        return messgeListToJson(obj);
    }

    //设置信息状态
    @ApiOperation(value = "9设置信息状态")

    @RequestMapping(value = "/setReadState/{receiver}/{sender}", method = RequestMethod.POST)
    @WrapUpResponseBody
    public int setReadState(
            @PathVariable String receiver,@PathVariable String sender) {
        return webImMessageManager.setReadState(receiver,sender);
    }

    //设置信息状态
    @ApiOperation(value = "10设置群信息状态")

    @RequestMapping(value = "/setGroupReadState/{receiver}/{unitCode}", method = RequestMethod.POST)
    @WrapUpResponseBody
    public ResponseData setGroupReadState(
            @PathVariable String receiver,@PathVariable String unitCode) {
        webImMessageManager.setGroupReadState(receiver,unitCode);
        return ResponseData.makeSuccessResponse();
    }

}
