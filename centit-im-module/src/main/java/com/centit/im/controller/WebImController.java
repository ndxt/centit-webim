package com.centit.im.controller;


import com.centit.framework.common.ResponseData;
import com.centit.framework.core.controller.BaseController;
import com.centit.framework.core.controller.WrapUpResponseBody;
import com.centit.im.po.ImMessage;
import com.centit.im.service.WebImSocket;
import com.centit.im.socketio.ImMessageUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Created by codefan on 17-5-20.
 */
@Controller
@RequestMapping("/webim")
@Api(value = "即时消息发送接口", tags = "即时消息发送接口")
public class WebImController extends BaseController {

    @Autowired
    protected WebImSocket webImSocket;

    //发送消息，给第三方使用
    @ApiOperation(value = "1第三方发送消息")

    @RequestMapping(value = "/sendMessage/{receiver}/{sender}", method = RequestMethod.POST)
    @WrapUpResponseBody
    public ResponseData sendMessage(
            @PathVariable String receiver,@PathVariable String sender,
            @RequestBody ImMessage message) {

        message.setReceiver(receiver);
        message.setSender(sender);
        ImMessageUtils.checkMessage(message);
        webImSocket.sendMessage(receiver,message);
        return ResponseData.makeSuccessResponse();
    }

    //发送群（组、机构）消息，给第三方使用
    @ApiOperation(value = "2第三方发送群消息")
    @RequestMapping(value = "/sendUnitMessage/{receiver}/{sender}", method = RequestMethod.POST)
    @WrapUpResponseBody
    public ResponseData sendGroupMessage(
            @PathVariable String receiver,@PathVariable String sender,
            @RequestBody ImMessage message) {

        message.setReceiver(receiver);
        message.setSender(sender);
        ImMessageUtils.checkMessage(message);
        webImSocket.sendGroupMessage(receiver,message);
        return ResponseData.makeSuccessResponse();
    }

    //广播消息，给第三方使用
    @ApiOperation(value = "3第三方广播消息")

    @RequestMapping(value = "/toall/{sender}", method = RequestMethod.POST)
    @WrapUpResponseBody
    public ResponseData toallMessage(@PathVariable String sender,
                             @RequestBody ImMessage message) {
        message.setSender(sender);
        ImMessageUtils.checkMessage(message);
        webImSocket.toallMessage(message);
        return ResponseData.makeSuccessResponse();
    }

    //在线广播消息，给第三方使用
    @ApiOperation(value = "4第三方在线广播消息")

    @RequestMapping(value = "/broadcast/{sender}", method = RequestMethod.POST)
    @WrapUpResponseBody
    public ResponseData broadcastMessage(@PathVariable String sender,
                                 @RequestBody ImMessage message) {
        message.setSender(sender);
        ImMessageUtils.checkMessage(message);
        webImSocket.broadcastMessage(message);
        return ResponseData.makeSuccessResponse();
    }

}
