package com.centit.im.web.plugins;

import com.centit.framework.common.ResponseData;
import com.centit.framework.model.adapter.MessageSender;
import com.centit.framework.model.basedata.NoticeMessage;
import com.centit.support.network.HttpExecutor;
import com.centit.support.network.HttpExecutorContext;
import org.apache.http.impl.client.CloseableHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by codefan on 17-7-24.
 */
public class JsfgwSmsMessageSender implements MessageSender{

    private static Logger log = LoggerFactory.getLogger(JsfgwSmsMessageSender.class);

    private String smsSendUrl;

    public void setSmsSendUrl(String smsSendUrl) {
        this.smsSendUrl = smsSendUrl;
    }

    private String sendSms(Map<String,Object> fromData ){
        String jsonStr = null;
        try (CloseableHttpClient httpClient = HttpExecutor.createHttpClient()){
            jsonStr = HttpExecutor.formPost(HttpExecutorContext.create(httpClient),
                    this.smsSendUrl,fromData);
        } catch (IOException e) {
            log.error(e.getMessage(),e);
        }
        return jsonStr;
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
        Map<String,Object> fromData = new HashMap<>(15);
        fromData.put("sender",sender);
        fromData.put("receiver",receiver);
        fromData.put("subject",message.getMsgSubject());
        fromData.put("content",message.getMsgContent());
        fromData.put("optId",message.getOptId());
        fromData.put("optMethod",message.getOptMethod());
        fromData.put("optTag",message.getOptTag());

        /*String resStr =*/sendSms(fromData);
        return ResponseData.successResponse;
    }
}
