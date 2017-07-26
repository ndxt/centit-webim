package com.centit.im.web.plugins;

import com.centit.framework.model.adapter.MessageSender;
import com.centit.support.network.HttpExecutor;
import org.apache.http.impl.client.CloseableHttpClient;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by codefan on 17-7-24.
 */
public class JsfgwSmsMessageSender implements MessageSender{

    private String smsSendUrl;

    public void setSmsSendUrl(String smsSendUrl) {
        this.smsSendUrl = smsSendUrl;
    }

    private String sendSms(Map<String,Object> fromData ){
        String jsonStr = null;
        try (CloseableHttpClient httpClient = HttpExecutor.createHttpClient()){
            jsonStr = HttpExecutor.formPost(httpClient,
                    this.smsSendUrl,fromData);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return jsonStr;
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
        Map<String,Object> fromData = new HashMap<>(10);
        fromData.put("sender",sender);
        fromData.put("receiver",receiver);
        fromData.put("subject",msgSubject);
        fromData.put("content",msgContent);

        return sendSms(fromData);

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
     * @param optTag     业务主键 ，复合主键用URL方式对的格式 a=v1;b=v2
     * @return "OK" 表示成功，其他的为错误信息
     */
    @Override
    public String sendMessage(String sender, String receiver, String msgSubject,
                              String msgContent, String optId, String optMethod, String optTag) {
        Map<String,Object> fromData = new HashMap<>(15);
        fromData.put("sender",sender);
        fromData.put("receiver",receiver);
        fromData.put("subject",msgSubject);
        fromData.put("content",msgContent);
        fromData.put("optId",optId);
        fromData.put("optMethod",optMethod);
        fromData.put("optTag",optTag);

        return sendSms(fromData);
    }
}