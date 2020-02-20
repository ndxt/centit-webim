package com.centit.im.client;

import com.centit.framework.appclient.AppSession;
import com.centit.framework.appclient.HttpReceiveJSON;
import com.centit.framework.appclient.RestfulHttpRequest;
import com.centit.im.dto.FriendMemo;
import com.centit.im.dto.ImCustomer;
import com.centit.im.po.ImMessage;
import com.centit.support.common.ObjectException;
import org.apache.http.impl.client.CloseableHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by codefan on 17-4-11.
 */
public class IMClientImpl implements IMClient {

    private static Logger log = LoggerFactory.getLogger(MessageSenderIMImpl.class);

    private AppSession appSession;

//    @Value("${pusherserver.url}")
//    private String appServerUrl;
//    @Value("${pusherserver.userCode}")
//    private String userCode;
//    @Value("${pusherserver.password}")
//    private String password;
//    @Value("${pusherserver.export.url}")
//    private String appServerExportUrl;

    public void initAppSession(String appServerUrl, String appLoginUrl, String userCode,String password ){
        appSession = new AppSession(appServerUrl,false,userCode,password);
        appSession.setAppLoginUrl(appLoginUrl);
    }

    public CloseableHttpClient getHttpClient() throws Exception {
        return appSession.allocHttpClient();
    }

    public void releaseHttpClient(CloseableHttpClient httpClient) {
        appSession.releaseHttpClient(httpClient);
    }

    @Override
    public void setFriendMemo(FriendMemo memo){
        String jsonStr =  RestfulHttpRequest.jsonPost(appSession, "/webimcust/friend", memo);
        HttpReceiveJSON resJson = HttpReceiveJSON.valueOfJson(jsonStr);
        if (resJson.getCode() != 0) {
            throw new ObjectException(memo, resJson.getMessage());
        }
    }

    /**
     * 注册用户 返回 token
     *
     * @param user WebImCustomer对象
     */
    @Override
    public void registerUser(ImCustomer user){
        String jsonStr =  RestfulHttpRequest.jsonPost(appSession, "/webimcust/register", user);
        HttpReceiveJSON resJson = HttpReceiveJSON.valueOfJson(jsonStr);
        if (resJson.getCode() != 0) {
            throw new ObjectException(user, resJson.getMessage());
        }
    }

    /**
     * 设置用户
     *
     * @param cust WebImCustomer对象
     */
    @Override
    public void setUserConfig(ImCustomer cust){

        String jsonStr =  RestfulHttpRequest.jsonPost(appSession, "/webimcust/config/"+ cust.getUserCode(),cust);
        HttpReceiveJSON resJson = HttpReceiveJSON.valueOfJson(jsonStr);
        if (resJson.getCode() != 0) {
            throw new ObjectException(cust, resJson.getMessage());
        }
    }

    /**
     * 发送消息
     *
     * @param message ImMessage对象
     */
    @Override
    public void sendMessage(ImMessage message){
        String jsonStr =  RestfulHttpRequest.jsonPost(appSession,
                "/webimcust/sendMessage/" + message.getReceiver() +"/" + message.getSender(), message);
        HttpReceiveJSON resJson = HttpReceiveJSON.valueOfJson(jsonStr);
        if (resJson.getCode() != 0) {
            throw new ObjectException(message, resJson.getMessage());
        }
    }
}
