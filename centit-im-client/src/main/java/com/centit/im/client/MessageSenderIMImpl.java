package com.centit.im.client;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.centit.framework.common.ResponseData;
import com.centit.framework.model.adapter.MessageSender;
import com.centit.framework.model.basedata.NoticeMessage;
import com.centit.im.po.ImMessage;
import com.centit.im.utils.ImMessageBuild;
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
    public ResponseData sendMessage(String sender, String receiver, NoticeMessage message) {
        try {
            imClient.sendMessage(
                    ImMessageBuild.create()
                        .sender(sender).receiver(receiver)
                        .senderName(sender)
                        .sendTime(DatetimeOpt.currentUtilDate())
                        .type(ImMessage.MSG_TYPE_SYSTEM)
                        .contentType(ImMessage.CONTENT_TYPE_TEXT)
                        .content((JSONObject)JSON.toJSON(message))
                        .build());
            return ResponseData.makeSuccessResponse();
        }catch (Exception e){
            log.error(e.getMessage(),e);
            return ResponseData.makeErrorMessage(e.getMessage());
        }
    }
}
