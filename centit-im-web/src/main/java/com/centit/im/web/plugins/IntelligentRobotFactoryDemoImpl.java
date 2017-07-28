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

    @Override
    public IntelligentRobot getIntelligentRobot(String osId){
        if(intelligentRobot==null)
            intelligentRobot = new IntelligentRobotDemoImpl();
        return intelligentRobot;
    }
}
