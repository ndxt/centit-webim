package com.centit.im.service.Impl;

import com.centit.im.po.RobotAnswer;
import com.centit.im.service.AskRobot;

/**
 * Created by codefan on 17-6-20.
 */
public class AskRobotImpl implements AskRobot{
    @Override
    public RobotAnswer sayHello(String custUserCode) {
        return RobotAnswer.createTestAnswer();
    }

    @Override
    public RobotAnswer sayBoodbye(String custUserCode) {
        return RobotAnswer.createTestAnswer();
    }

    @Override
    public RobotAnswer askQuestion(String custUserCode, String question) {
        return RobotAnswer.createTestAnswer();
    }
}
