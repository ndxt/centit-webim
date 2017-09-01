package com.centit.im.client;

import com.centit.framework.model.adapter.MessageSender;
import com.centit.im.po.ImMessage;
import com.centit.support.algorithm.DatetimeOpt;
import com.centit.support.json.JSONOpt;
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
     * @param msgSubject 消息主题
     * @param msgContent 消息内容
     * @return "OK" 表示成功，其他的为错误信息
     */
    @Override
    public String sendMessage(String sender, String receiver, String msgSubject, String msgContent) {
        return  sendMessage( sender,  receiver,  msgSubject,
                msgContent, null,null,null /*optId,  optMethod,  optTag*/);
    }

    /**
     * 发送内部系统消息
     *
     * @param sender     发送人内部用户编码
     * @param receiver   接收人内部用户编码
     * @param msgSubject 消息主题
     * @param msgContent 消息内容
     * @param optId      关联的业务编号
     * @param optMethod  管理的操作
     * @param optTag     业务主键 复合主键用URL方式对的格式 a等于v1 同时 b等于v2
     * @return "OK" 表示成功，其他的为错误信息
     */
    @Override
    public String sendMessage(String sender, String receiver, String msgSubject, String msgContent, String optId, String optMethod, String optTag) {
        ImMessage message = new ImMessage ();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setSenderName(sender);
        message.setSendTime(DatetimeOpt.currentUtilDate());
        message.setContent(JSONOpt.createHashMap("title", msgSubject , "content",  msgContent));
        message.setType(ImMessage.MSG_TYPE_SYSTEM);
        message.setContentType(ImMessage.CONTENT_TYPE_TEXT);
        try {
            imClient.sendMessage(message);
            return "OK";
        }catch (Exception e){
            log.error(e.getMessage());
            return e.getMessage();
        }
    }
}
