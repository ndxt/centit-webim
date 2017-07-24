package com.centit.im.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.centit.framework.appclient.AppSession;
import com.centit.im.po.RobotAnswer;
import com.centit.im.service.IntelligentRobot;
import com.centit.support.network.HttpExecutor;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.http.impl.client.CloseableHttpClient;

/**
 * Created by codefan on 17-6-19.
 */

public class IntelligentRobotImpl implements IntelligentRobot {

    private AppSession appSession;

    public void initAppSession(String appServerUrl,String userCode,String password){
        appSession = new AppSession(appServerUrl,userCode,password);
    }

    public void initAppSession(String appServerUrl){
        appSession = new AppSession(appServerUrl);
    }

    public CloseableHttpClient getHttpClient() throws Exception {
        return appSession.getHttpClient();
    }

    public void releaseHttpClient(CloseableHttpClient httpClient) {
        appSession.releaseHttpClient(httpClient);
    }

    @Override
    public RobotAnswer sayHello(String custUserCode)  {
        CloseableHttpClient httpClient = null;
        try {
            httpClient = getHttpClient();
            String jsonStr = HttpExecutor.simpleGet(httpClient, appSession.completeQueryUrl("/hello/" + custUserCode));
            JSONObject jsonObj = JSONObject.parseObject(jsonStr);
            RobotAnswer result = JSONObject.toJavaObject(jsonObj.getJSONObject("data"), RobotAnswer.class);
            releaseHttpClient(httpClient);
            return result;
        }catch (Exception e){
            releaseHttpClient(httpClient);
            return RobotAnswer.createTestAnswer();
        }
    }

    @Override
    public RobotAnswer sayBoodbye(String custUserCode) {
        CloseableHttpClient httpClient = null;
        try {
            httpClient = getHttpClient();
            String jsonStr = HttpExecutor.simpleGet(httpClient,
                    appSession.completeQueryUrl("/goodbye/"+ custUserCode));
            JSONObject jsonObj = JSONObject.parseObject(jsonStr);
            RobotAnswer result = JSONObject.toJavaObject(jsonObj.getJSONObject("data"), RobotAnswer.class);
            releaseHttpClient(httpClient);
            return result;
        }catch (Exception e){
            releaseHttpClient(httpClient);
            return RobotAnswer.createTestAnswer();
        }
    }

    @Override
    public RobotAnswer askQuestion(String custUserCode, String question) {
        CloseableHttpClient httpClient = null;
        try {
            httpClient = getHttpClient();
            String jsonStr = HttpExecutor.simpleGet(httpClient,
                appSession.completeQueryUrl("/ask/"+ custUserCode+"?question="+
                        StringEscapeUtils.escapeHtml4(question)));
            JSONObject jsonObj = JSONObject.parseObject(jsonStr);
            RobotAnswer result = JSONObject.toJavaObject(jsonObj.getJSONObject("data"), RobotAnswer.class);
            releaseHttpClient(httpClient);
            return result;
        }catch (Exception e){
            releaseHttpClient(httpClient);
            return RobotAnswer.createTestAnswer();
        }
    }
}
