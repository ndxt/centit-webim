package com.centit.im.utils;

import com.centit.im.po.ImMessage;
import com.centit.support.algorithm.DatetimeOpt;

import java.util.Date;
import java.util.Map;

/**
 * Created by codefan on 17-5-20.
 */
public class ImMessageBuild {
    private ImMessage msg;

    public ImMessageBuild() {
    }

    public static ImMessageBuild create(ImMessage msg){
        ImMessageBuild build = new ImMessageBuild();
        build.msg = msg;
        return build;
    }

    public static ImMessageBuild create(){
        ImMessage msg = new ImMessage();
        msg.setSendTime(DatetimeOpt.currentUtilDate());
        return create(msg);
    }

    public ImMessageBuild type(String msgType){
        msg.setType(msgType);
        return this;
    }

    public ImMessageBuild broadcast(){
        msg.setType(ImMessage.MSG_TYPE_BROADCAST);
        msg.setReceiver("onlineusers");
        return this;
    }

    public ImMessageBuild toAll(){
        msg.setType(ImMessage.MSG_TYPE_TO_ALL);
        msg.setReceiver("all");
        return this;
    }


    public ImMessageBuild contentType(String conType){
        msg.setContentType(conType);
        return this;
    }

    public ImMessageBuild content(Map<String,Object> con){
        msg.setContent(con);
        return this;
    }

    public ImMessageBuild addContent(String key ,Object con){
        msg.getContent().put(key,con);
        return this;
    }

    public ImMessageBuild sender(String from){
        msg.setSender(from);
        return this;
    }

    public ImMessageBuild senderName(String fromUserName){
        msg.setSenderName(fromUserName);
        return this;
    }


    public ImMessageBuild message(String text){
//        this.msg.setContentType(ImMessage.CONTENT_TYPE_TEXT);
        this.msg.getContent().put(ImMessage.CONTENT_FIELD_MESSAGE,text);
        return this;
    }

    public ImMessageBuild file(String fileUrl){
        this.msg.setContentType(ImMessage.CONTENT_TYPE_FILE);
        this.msg.getContent().put(ImMessage.CONTENT_FIELD_FILE,fileUrl);
        return this;
    }

    public ImMessageBuild iamge(String iamgeUrl){
        this.msg.setContentType(ImMessage.CONTENT_TYPE_IMAGE);
        this.msg.getContent().put(ImMessage.CONTENT_FIELD_FILE,iamgeUrl);
        return this;
    }

    public ImMessageBuild voice(String voiceUrl){
        this.msg.setContentType(ImMessage.CONTENT_TYPE_VOICE);
        this.msg.getContent().put(ImMessage.CONTENT_FIELD_FILE,voiceUrl);
        return this;
    }

    public ImMessageBuild video(String videoUrl) {
        this.msg.setContentType(ImMessage.CONTENT_TYPE_VIDEO);
        this.msg.getContent().put(ImMessage.CONTENT_FIELD_FILE, videoUrl);
        return this;
    }

    public ImMessageBuild receiver(String to){
        msg.setReceiver(to);
        return this;
    }

    public ImMessageBuild sendTime(Date sendDatetime){
        msg.setSendTime(sendDatetime);
        return this;
    }

    public ImMessage build(){
        return msg;
    }

}
