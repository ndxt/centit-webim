package com.centit.im.service;

import com.centit.im.po.RobotAnswer;

/**
 * Created by codefan on 17-6-19.
 */
public interface IntelligentRobot {

    RobotAnswer sayHello(String custUserCode);

    RobotAnswer sayGoodbye(String custUserCode);

    RobotAnswer askQuestion(String custUserCode, String question);
}
