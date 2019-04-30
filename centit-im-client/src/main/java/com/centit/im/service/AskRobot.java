package com.centit.im.service;

import com.centit.im.po.RobotAnswer;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

/**
 * Created by codefan on 17-6-20.
 */

public interface AskRobot {
    RobotAnswer sayHello(String custUserCode);

    RobotAnswer sayBoodbye(String custUserCode);

    RobotAnswer askQuestion(String custUserCode, String question);
}
