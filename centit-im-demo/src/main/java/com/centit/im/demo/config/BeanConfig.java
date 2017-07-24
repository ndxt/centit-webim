package com.centit.im.demo.config;

import com.centit.framework.hibernate.config.DataSourceConfig;
import com.centit.framework.staticsystem.config.SpringConfig;
import com.centit.im.demo.service.impl.IntelligentRobotFactoryDemoImpl;
import com.centit.im.service.IntelligentRobot;
import com.centit.im.service.IntelligentRobotFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@ComponentScan(basePackages = {"com.centit.*"})
@Import({SpringConfig.class, DataSourceConfig.class})
public class BeanConfig  {


    @Bean
    public IntelligentRobotFactory intelligentRobotFactory(
            @Autowired IntelligentRobot intelligentRobot) {
        IntelligentRobotFactoryDemoImpl intelligentRobotFactory = new IntelligentRobotFactoryDemoImpl();

        intelligentRobotFactory.setIntelligentRobot(intelligentRobot);
        return  intelligentRobotFactory;
    }

}
