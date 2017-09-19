package com.centit.im.socketio;

import com.centit.im.service.WebImSocket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import org.springframework.web.socket.server.standard.SpringConfigurator;
/**
 * Created by codefan on 17-5-19.
 */
@ServerEndpoint(value="/im/{userCode}" ,configurator = SpringConfigurator.class)
@Service
public class WebImSocketListener {

    private static Logger logger = LoggerFactory.getLogger(WebImSocketListener.class);
    @Resource
    @Autowired
    protected WebImSocket webImSocket;

    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("userCode") String userCode) {
        try {
            webImSocket.signInUser(userCode, session);
        }catch (Exception e){
            logger.info("onOpen",e);
        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(Session session) {
        try {
            webImSocket.signOutUser(session);
        }catch (Exception e){
            logger.info("onClose",e);
        }
    }

    /**
     * 收到客户端消息后调用的方法
     */
    @OnMessage
    public void onMessage(String message, Session session) {
        try{
            webImSocket.recvMessage(session, message);
        }catch (Exception e){
            logger.info("onMessage" + message,e);
        }
    }

    /**
     * 发生错误时调用
     *
     * @param error
     */
    @OnError
    public void onError(Throwable error) {
        logger.info("onError" + error);
        error.printStackTrace();
    }
}
