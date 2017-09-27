package com.centit.im.socketio;

import com.alibaba.fastjson.JSON;
import com.centit.im.po.RobotAnswer;
import com.centit.im.po.WebImCustomer;
import com.centit.support.algorithm.DatetimeOpt;
import org.apache.commons.lang3.StringUtils;

/**
 * Created by codefan on 17-5-20.
 */
public class ImMessageUtils {

    public static ImMessage fromJSonString(String jsonString){
        ImMessage msg = JSON.parseObject(jsonString, ImMessage.class);
        if(msg.getSendTime()==null)
            msg.setSendTime(DatetimeOpt.currentUtilDate());
        return msg;
    }

    public static boolean checkMessage(ImMessage msg) {
        if (StringUtils.isBlank(msg.getType())
            ||StringUtils.isBlank(msg.getContentType()))

            return false;

        if(msg.getSendTime()==null)
            msg.setSendTime(DatetimeOpt.currentUtilDate());
        return true;
    }

    public static ImMessage buildOnlineMessage(String userCode, String userName, String headSculpture){
        ImMessageBuild msgBuilder = new ImMessageBuild().type(ImMessage.MSG_TYPE_BROADCAST)
                .contentType(ImMessage.CONTENT_TYPE_NOTICE)
                .sender(userCode)
                .senderName(userName)
                .addContent("state","online");
        if(StringUtils.isNotBlank(headSculpture))
            msgBuilder.addContent("headSculpture",headSculpture);
        return msgBuilder.build();
    }

    public static ImMessage buildOfflineMessage(String userCode){
        return new ImMessageBuild().type(ImMessage.MSG_TYPE_BROADCAST)
                .contentType(ImMessage.CONTENT_TYPE_NOTICE)
                .sender(userCode)
                .addContent("state","offline").build();
    }

    public static ImMessage buildSystemMessage(String sender, String message){
        return new ImMessageBuild().type(ImMessage.MSG_TYPE_SYSTEM)
                .contentType(ImMessage.CONTENT_TYPE_TEXT)
                .sender(sender)
                .senderName("系统提示")
                .message(message).build();
    }

    //切换客服是系统信息
    public static ImMessage buildSystemMessageChangService(String sender, String message,WebImCustomer cust,WebImCustomer service,String type){
        return new ImMessageBuild().type(ImMessage.MSG_TYPE_SYSTEM)
                .contentType(ImMessage.CONTENT_TYPE_TEXT)
                .sender(sender)
                .senderName("系统提示")
                .addContent("id",cust.getUserCode())
                .addContent("custName",cust.getUserName())
                .addContent("serviceCode",service.getUserCode())
                .addContent("serviceName",service.getUserName())
                .addContent("type",type)
                .message(message).build();
    }

    public static ImMessage buildSystemMessage(String message){
        return buildSystemMessage("system",message);
    }

    public static ImMessage buildAcceptCustMessage(String service, WebImCustomer customer){
        return new ImMessageBuild().type(ImMessage.MSG_TYPE_SYSTEM)
                .contentType(ImMessage.CONTENT_TYPE_TEXT)
                .sender(customer.getUserCode())
                .senderName("系统提示")
                .message("请为客户 "+ customer.getUserName() +" 服务。")
                .addContent("custUserCode",customer.getUserCode())
                .addContent("custUserName",customer.getUserName())
                .addContent("custHeadSculpture",customer.getHeadSculpture()).build();
    }

    public static ImMessage buildRobotAnswer(String receiver,RobotAnswer answer){
        return new ImMessageBuild().type(ImMessage.MSG_TYPE_QUESTION)
                .contentType(ImMessage.CONTENT_TYPE_TEXT)
                .sender("robot")
                .senderName("智能客服")
                .receiver(receiver)
                .message(answer.getMessage())
                .addContent("options",answer.getOptions()).build();
    }
}
