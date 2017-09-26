package com.centit.im.web.plugins;

import com.centit.im.po.RobotAnswer;
import com.centit.im.service.IntelligentRobot;
import org.springframework.stereotype.Service;

/**
 * Created by codefan on 17-6-19.
 */
//@Service("intelligentRobot")
public class IntelligentRobotDemoImpl implements IntelligentRobot {


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
