package com.centit.im.controller;


import com.centit.framework.common.JsonResultUtils;
import com.centit.im.po.RobotAnswer;
import com.centit.im.service.AskRobot;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by codefan on 17-5-20.
 */
@Controller
@RequestMapping("/askrobot")
public class WebImClientController {

    @Resource
    protected AskRobot robot;

    @RequestMapping(value = "/hello/{userCode}", method = RequestMethod.GET)
    public void sayHello(
            @PathVariable String userCode,
            HttpServletResponse response) {

        RobotAnswer answer = robot.sayHello(userCode);
        JsonResultUtils.writeSingleDataJson(answer, response);
    }

    @RequestMapping(value = "/goodby/{userCode}", method = RequestMethod.GET)
    public void sayGoodbye(
            @PathVariable String userCode,
            HttpServletResponse response) {

        RobotAnswer answer = robot.sayBoodbye(userCode);
        JsonResultUtils.writeSingleDataJson(answer, response);
    }

    @RequestMapping(value = "/ask/{userCode}", method = RequestMethod.GET)
    public void askQuestion(
            @PathVariable String userCode,
            @RequestParam String question,
            HttpServletResponse response) {

        RobotAnswer answer = robot.askQuestion(userCode,question);
        JsonResultUtils.writeSingleDataJson(answer, response);
    }

}
