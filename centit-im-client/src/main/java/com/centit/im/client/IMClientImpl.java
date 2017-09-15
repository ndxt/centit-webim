package com.centit.im.client;

import com.centit.framework.appclient.AppSession;
import com.centit.framework.common.ObjectException;
import com.centit.framework.common.ResponseJSON;
import com.centit.im.po.FriendMemo;
import com.centit.im.po.ImMessage;
import com.centit.im.po.WebImCustomer;
import com.centit.support.network.HttpExecutor;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.impl.client.CloseableHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

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

    public void initAppSession(String appServerUrl, String userCode,String password ){
        appSession = new AppSession(appServerUrl,false,userCode,password);    }

    public CloseableHttpClient getHttpClient() throws Exception {
        return appSession.getHttpClient();
    }

    public void releaseHttpClient(CloseableHttpClient httpClient) {
        appSession.releaseHttpClient(httpClient);
    }

    @Override
    public void setFriendMemo(FriendMemo memo){

        CloseableHttpClient httpClient = null;
        try {
            httpClient = getHttpClient();
        } catch (Exception e) {
            log.error(e.getMessage(),e);
        }
        try {
            appSession.checkAccessToken(httpClient);
            String jsonStr = HttpExecutor.jsonPost(httpClient,
                    appSession.completeQueryUrl("/webimcust/friend"), memo);
            ResponseJSON resJson = ResponseJSON.valueOfJson(jsonStr);

            if (resJson.getCode() != 0) {
                throw new ObjectException(memo, resJson.getMessage());
            }
        } catch (ClientProtocolException e) {
            log.error(e.getMessage(),e);
        } catch (IOException e) {
            log.error(e.getMessage(),e);
        } finally {
            releaseHttpClient(httpClient);
        }
    }

    /**
     * 注册用户 返回 token
     *
     * @param user WebImCustomer对象
     */
    @Override
    public void registerUser(WebImCustomer user){
        CloseableHttpClient httpClient = null;
        try {
            httpClient = getHttpClient();
        } catch (Exception e) {
            log.error(e.getMessage(),e);
        }
        try {
            appSession.checkAccessToken(httpClient);
            String jsonStr = HttpExecutor.jsonPost(httpClient,
                    appSession.completeQueryUrl("/webimcust/register"),user);
            ResponseJSON resJson = ResponseJSON.valueOfJson(jsonStr);

            if (resJson.getCode() != 0) {
                throw new ObjectException(user, resJson.getMessage());
            }
        } catch (ClientProtocolException e) {
            log.error(e.getMessage(),e);
        } catch (IOException e) {
            log.error(e.getMessage(),e);
        } finally {
            releaseHttpClient(httpClient);
        }
    }

    /**
     * 设置用户
     *
     * @param cust WebImCustomer对象
     */
    @Override
    public void setUserConfig(WebImCustomer cust){
        CloseableHttpClient httpClient = null;
        try {
            httpClient = getHttpClient();
        } catch (Exception e) {
            log.error(e.getMessage(),e);
        }
        try {
            appSession.checkAccessToken(httpClient);
            String jsonStr = HttpExecutor.jsonPost(httpClient,
                    appSession.completeQueryUrl("/webimcust/config/"+ cust.getUserCode()),cust);
            ResponseJSON resJson = ResponseJSON.valueOfJson(jsonStr);

            if (resJson.getCode() != 0) {
                throw new ObjectException(cust, resJson.getMessage());
            }
        } catch (ClientProtocolException e) {
            log.error(e.getMessage(),e);
        } catch (IOException e) {
            log.error(e.getMessage(),e);
        } finally {
            releaseHttpClient(httpClient);
        }
    }

    /**
     * 发送消息
     *
     * @param message ImMessage对象
     */
    @Override
    public void sendMessage(ImMessage message){
        CloseableHttpClient httpClient = null;
        try {
            httpClient = getHttpClient();
        } catch (Exception e) {
            log.error(e.getMessage(),e);
        }
        try {
            appSession.checkAccessToken(httpClient);
            String jsonStr = HttpExecutor.jsonPost(httpClient,
                    appSession.completeQueryUrl(
                        "/webim/sendMessage/"+message.getReceiver() +"/" + message.getSender() ),
                        message);
            ResponseJSON resJson = ResponseJSON.valueOfJson(jsonStr);

            if (resJson.getCode() != 0) {
                throw new ObjectException(message, resJson.getMessage());
            }
        } catch (ClientProtocolException e) {
            log.error(e.getMessage(),e);
        } catch (IOException e) {
            log.error(e.getMessage(),e);
        } finally {
            releaseHttpClient(httpClient);
        }
    }
}
