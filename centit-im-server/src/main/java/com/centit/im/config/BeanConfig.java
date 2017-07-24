package com.centit.im.config;

import com.centit.framework.hibernate.config.DataSourceConfig;
import com.centit.framework.staticsystem.config.SpringConfig;
import com.centit.framework.staticsystem.service.IntegrationEnvironment;
import com.centit.im.service.IntelligentRobotFactory;
import com.centit.im.service.impl.IntelligentRobotFactoryImpl;
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
           @Autowired IntegrationEnvironment integrationEnvironment) {
        IntelligentRobotFactoryImpl intelligentRobotFactory = new IntelligentRobotFactoryImpl();

        intelligentRobotFactory.setIntegrationEnvironment(
                integrationEnvironment
        );
        return intelligentRobotFactory;
    }

}
