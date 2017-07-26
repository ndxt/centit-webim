package com.centit.im.web.plugins;

import com.centit.im.service.IntelligentRobot;
import com.centit.im.service.IntelligentRobotFactory;

/**
 * Created by codefan on 17-6-19.
 */
//@Service("intelligentRobotFactory")
public class IntelligentRobotFactoryDemoImpl implements IntelligentRobotFactory {

    //@Resource
    protected IntelligentRobot intelligentRobot;

    public void setIntelligentRobot(IntelligentRobot intelligentRobot) {
        this.intelligentRobot = intelligentRobot;
    }

    @Override
    public IntelligentRobot getIntelligentRobot(String osId){

        return intelligentRobot;
    }
}
