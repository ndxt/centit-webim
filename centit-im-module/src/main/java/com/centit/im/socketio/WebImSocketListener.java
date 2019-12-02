package com.centit.im.socketio;

import com.centit.im.service.WebImSocket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

/**
 * Created by codefan on 17-5-19.
 * @author codefan
 */
//@Service 这个在 spring boot中是必须的，在web的war包中不需要，
// 所以去掉然后在spring boot的配置类中添加这个bean的创建方法
@ServerEndpoint(value="/im/{userCode}"/*, configurator = MySpringConfigurator.class*/)
public class WebImSocketListener {

    private static Logger logger = LoggerFactory.getLogger(WebImSocketListener.class);

    //static ApplicationContext context;
    static WebImSocket webImSocket;

    /**
     * ServerEndpoint 对象是每个线程都会创建一个，所以这个依赖的bean要设置为静态变量
     * 否则 后续创建的 WebImSocketListener 这个属性会是null值
     * @param webImSocket bean
     */
    @Autowired
    public void setWebImSocket(WebImSocket webImSocket) {
        WebImSocketListener.webImSocket = webImSocket;
    }
    // 这个应该可以不用
    /*private WebImSocket getWebImSocket(){
        if(WebImSocketListener.webImSocket == null){
            WebImSocketListener.webImSocket =
                    WebImSocketListener.context.getBean("webImSocket", WebImSocket.class);
        }
        return WebImSocketListener.webImSocket;
    }*/
    /*
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("userCode") String userCode) {
        try {
            WebImSocketListener.webImSocket.signInUser(userCode, session);
            //logger.debug("User Login : " + userCode + " session :" + session.getId());
        }catch (Exception e){
            logger.error("onOpen",e);
        }
    }

    /*
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(Session session) {
        try {
            WebImSocketListener.webImSocket.signOutUser(session);
            //logger.debug("User Logout session :" + session.getId());
        }catch (Exception e){
            logger.error("onClose",e);
        }
    }

    /*
     * 收到客户端消息后调用的方法
     */
    @OnMessage
    public void onMessage(String message, Session session) {
        try{
            WebImSocketListener.webImSocket.recvMessage(session, message);
        }catch (Exception e){
            logger.error("onMessage" + message,e);
        }
    }

    /**
     * 发生错误时调用
     * @param error Throwable
     */
    @OnError
    public void onError(Throwable error) {
        logger.error("onError" + error.getMessage(),error);
        //error.printStackTrace();
    }
}
