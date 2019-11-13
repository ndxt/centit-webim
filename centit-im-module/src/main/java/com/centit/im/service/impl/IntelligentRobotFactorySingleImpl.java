package com.centit.im.service.impl;

import com.centit.im.service.IntelligentRobot;
import com.centit.im.service.IntelligentRobotFactory;

/**
 * Created by codefan on 17-6-19.
 */
//@Service("intelligentRobotFactory")
public class IntelligentRobotFactorySingleImpl implements IntelligentRobotFactory {

    //@Autowired
    protected IntelligentRobot intelligentRobot;

    @Override
    public IntelligentRobot getIntelligentRobot(String osId){
        if(intelligentRobot==null)
            intelligentRobot = new IntelligentRobotDummyImpl();
        return intelligentRobot;
    }

    public void setIntelligentRobot(IntelligentRobot intelligentRobot) {
        this.intelligentRobot = intelligentRobot;
    }

}
