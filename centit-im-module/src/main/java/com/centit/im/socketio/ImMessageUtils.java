package com.centit.im.socketio;

import com.alibaba.fastjson.JSON;
import com.centit.im.po.ImMessage;
import com.centit.im.po.RobotAnswer;
import com.centit.im.po.WebImCustomer;
import com.centit.im.utils.ImMessageBuild;
import com.centit.support.algorithm.DatetimeOpt;
import com.centit.support.compiler.Lexer;
import org.apache.commons.lang3.StringUtils;

/**
 * Created by codefan on 17-5-20.
 */
public class ImMessageUtils {

    public static ImMessage fromJSonString(String jsonString){
        if("{".equals(Lexer.getFirstWord(jsonString))) {
            ImMessage msg = JSON.parseObject(jsonString, ImMessage.class);
            if (msg.getSendTime() == null) {
                msg.setSendTime(DatetimeOpt.currentUtilDate());
            }
            if (msg.getType() == null) {
                msg.setType(ImMessage.MSG_TYPE_UNKNOWN);
            }
            return msg;
        } else {
            return ImMessageBuild.create()
                    .type(ImMessage.MSG_TYPE_UNKNOWN)
                    .message(jsonString)
                    .build();
        }
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

    public static ImMessage buildOfflineCommand(){
        return new ImMessageBuild().type(ImMessage.MSG_TYPE_SYSTEM)
                .contentType(ImMessage.CONTENT_TYPE_OFFLINE)
                .sender("system")
                .message("同名用户在其他地方登录，您被迫下线！").build();
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

    public static ImMessage buildSystemMessagePraise(String message,String senderId){
        return new ImMessageBuild().type(ImMessage.MSG_TYPE_SYSTEM)
                .contentType(ImMessage.CONTENT_TYPE_TEXT)
                .sender("system")
                .senderName("系统提示")
                .addContent("id",senderId)
                .message(message).build();
    }

    //切换客服后向新客服发送提示信息
    public static ImMessage buildChatMessage(String message,WebImCustomer cust,WebImCustomer service,WebImCustomer beforeChangeService){
        return new ImMessageBuild().type(ImMessage.MSG_TYPE_CHAT)
                .contentType(ImMessage.CONTENT_TYPE_TEXT)
                .sender(cust.getUserCode())
                .senderName(cust.getUserName())
                .receiver(service.getUserCode())
                .addContent("chatType","service")
                .addContent("beforeId",beforeChangeService.getUserCode())
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
