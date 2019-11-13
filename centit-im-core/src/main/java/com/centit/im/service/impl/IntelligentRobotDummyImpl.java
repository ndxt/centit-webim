package com.centit.im.service.impl;

import com.centit.im.po.RobotAnswer;
import com.centit.im.service.IntelligentRobot;

/**
 * Created by codefan on 17-6-19.
 */
//@Service("intelligentRobot")
public class IntelligentRobotDummyImpl implements IntelligentRobot {


    @Override
    public RobotAnswer sayHello(String custUserCode) {
        return RobotAnswer.createTestAnswer();
    }

    @Override
    public RobotAnswer sayGoodbye(String custUserCode) {
        return RobotAnswer.createTestAnswer();
    }

    @Override
    public RobotAnswer askQuestion(String custUserCode, String question) {
        return RobotAnswer.createTestAnswer();
    }
}
