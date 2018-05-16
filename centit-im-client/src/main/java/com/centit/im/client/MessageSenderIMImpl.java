package com.centit.im.client;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.centit.framework.model.adapter.MessageSender;
import com.centit.framework.model.basedata.NoticeMessage;
import com.centit.im.po.ImMessage;
import com.centit.support.algorithm.DatetimeOpt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by codefan on 17-4-11.
 */
public class MessageSenderIMImpl implements MessageSender {

    private static Logger log = LoggerFactory.getLogger(MessageSenderIMImpl.class);

    private IMClient imClient;

    public void setImClient(IMClient imClient) {
        this.imClient = imClient;
    }



    /**
     * 发送内部系统消息
     *
     * @param sender     发送人内部用户编码
     * @param receiver   接收人内部用户编码
     * @param message 消息主题
     * @return "OK" 表示成功，其他的为错误信息
     */
    @Override
    public String sendMessage(String sender, String receiver, NoticeMessage message) {
        ImMessage iMmessage = new ImMessage ();
        iMmessage.setSender(sender);
        iMmessage.setReceiver(receiver);
        iMmessage.setSenderName(sender);
        iMmessage.setSendTime(DatetimeOpt.currentUtilDate());
        iMmessage.setContent((JSONObject)JSON.toJSON(message));
        iMmessage.setType(ImMessage.MSG_TYPE_SYSTEM);
        iMmessage.setContentType(ImMessage.CONTENT_TYPE_TEXT);
        try {
            imClient.sendMessage(iMmessage);
            return "OK";
        }catch (Exception e){
            log.error(e.getMessage(),e);
            return e.getMessage();
        }
    }
}
