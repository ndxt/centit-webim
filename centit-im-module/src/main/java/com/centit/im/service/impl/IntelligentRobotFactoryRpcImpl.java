package com.centit.im.service.impl;


import com.centit.framework.common.WebOptUtils;
import com.centit.framework.components.CodeRepositoryUtil;
import com.centit.framework.filter.RequestThreadLocal;
import com.centit.framework.model.basedata.OsInfo;
import com.centit.im.service.IntelligentRobot;
import com.centit.im.service.IntelligentRobotFactory;

import javax.servlet.http.HttpServletRequest;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by codefan on 17-6-19.
 */
//@Service("intelligentRobotFactory")
public class IntelligentRobotFactoryRpcImpl implements IntelligentRobotFactory {
    private static ConcurrentHashMap<String, IntelligentRobot> intelligentRobotMap
            = new ConcurrentHashMap<>();//根据用户找session

    @Override
    public IntelligentRobot getIntelligentRobot(String osId){
        if(osId == null)
            return null;
        HttpServletRequest request = RequestThreadLocal.getLocalThreadWrapperRequest();
        String topUnit = WebOptUtils.getCurrentTopUnit(request);
        IntelligentRobot robot = intelligentRobotMap.get(osId);
        if(robot == null){
            IntelligentRobotRpcImpl robotImpl = new IntelligentRobotRpcImpl();
            OsInfo osInfo = CodeRepositoryUtil.getOsInfo(topUnit, osId);
            robotImpl.initAppSession(osInfo.getOsUrl()+"/service/askrobot");
            intelligentRobotMap.put(osId,robotImpl);
            robot = robotImpl;
        }
        return robot;
    }
}
