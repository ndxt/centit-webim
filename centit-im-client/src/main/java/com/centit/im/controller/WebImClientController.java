package com.centit.im.controller;


import com.centit.framework.core.controller.WrapUpResponseBody;
import com.centit.im.po.RobotAnswer;
import com.centit.im.service.IntelligentRobot;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Created by codefan on 17-5-20.
 */
@Controller
@RequestMapping("/askrobot")
@Api(value = "robot2", tags = "robot2")
public class WebImClientController{

    @Autowired
    protected IntelligentRobot robot;

    @ApiOperation(value = "1打招呼")
    @RequestMapping(value = "/hello/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public RobotAnswer sayHello(
            @PathVariable String userCode) {

        return robot.sayHello(userCode);

    }
    @ApiOperation(value = "2再见")
    @RequestMapping(value = "/goodby/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public RobotAnswer sayGoodbye(
            @PathVariable String userCode) {

        return robot.sayGoodbye(userCode);

    }
    @ApiOperation(value = "3询问")
    @RequestMapping(value = "/ask/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public RobotAnswer askQuestion(
            @PathVariable String userCode,
            @RequestParam String question) {

        return robot.askQuestion(userCode,question);
    }

}
