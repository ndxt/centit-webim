package com.centit.im.service.impl;

import com.centit.framework.appclient.AppSession;
import com.centit.framework.appclient.RestfulHttpRequest;
import com.centit.im.po.RobotAnswer;
import com.centit.im.service.IntelligentRobot;
import org.apache.http.impl.client.CloseableHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URLEncoder;


/**
 * Created by codefan on 17-6-19.
 */

public class IntelligentRobotRpcImpl implements IntelligentRobot {

    private static Logger log = LoggerFactory.getLogger(IntelligentRobotRpcImpl.class);

    private AppSession appSession;

    public void initAppSession(String appServerUrl,String userCode,String password){
        appSession = new AppSession(appServerUrl,userCode,password);
    }

    public void initAppSession(String appServerUrl){
        appSession = new AppSession(appServerUrl);
    }

    public CloseableHttpClient getHttpClient() throws Exception {
        return appSession.allocHttpClient();
    }

    public void releaseHttpClient(CloseableHttpClient httpClient) {
        appSession.releaseHttpClient(httpClient);
    }

    @Override
    public RobotAnswer sayHello(String custUserCode)  {
        RobotAnswer result =  RestfulHttpRequest.getResponseObject(appSession,
                "/hello/" + custUserCode,RobotAnswer.class);
        if(result != null){
            return result;
        }else{
            return RobotAnswer.createTestAnswer();
        }
    }

    @Override
    public RobotAnswer sayGoodbye(String custUserCode) {
        RobotAnswer result =  RestfulHttpRequest.getResponseObject(appSession,
                "/goodbye/" + custUserCode,RobotAnswer.class);
        if(result != null){
            return result;
        }else{
            return RobotAnswer.createTestAnswer();
        }
    }

    @Override
    public RobotAnswer askQuestion(String custUserCode, String question) {
        try {
            RobotAnswer result =  RestfulHttpRequest.getResponseObject(appSession,
                    "/ask/" + custUserCode+"?question="+
                            URLEncoder.encode(question,"utf-8") +"&userCode"+custUserCode,
                    RobotAnswer.class);
            if(result != null){
                return result;
            }
        }catch (Exception e){
            log.error(e.getMessage(),e);
        }
        return RobotAnswer.createTestAnswer();
    }
}
