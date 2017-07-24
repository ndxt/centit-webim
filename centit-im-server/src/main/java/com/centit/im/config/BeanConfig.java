package com.centit.im.config;

import com.centit.framework.components.impl.NotificationCenterImpl;
import com.centit.framework.components.impl.TextOperationLogWriterImpl;
import com.centit.framework.hibernate.config.DataSourceConfig;
import com.centit.framework.model.adapter.MessageSender;
import com.centit.framework.model.adapter.NotificationCenter;
import com.centit.framework.model.adapter.OperationLogWriter;
import com.centit.framework.staticsystem.config.SpringConfig;
import com.centit.framework.staticsystem.service.IntegrationEnvironment;
import com.centit.im.listener.InstantiationServiceBeanPostProcessor;
import com.centit.im.plugins.SmsMessageSender;
import com.centit.im.service.IntelligentRobotFactory;
import com.centit.im.service.impl.IntelligentRobotFactoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;

@Configuration
@PropertySource("classpath:system.properties")
@ComponentScan(basePackages = {"com.centit.*"})
@Import({SpringConfig.class, DataSourceConfig.class})
public class BeanConfig  implements EnvironmentAware {

    private Environment env;

    @Override
    public void setEnvironment(final Environment environment) {
        this.env = environment;
    }

    @Bean
    public IntelligentRobotFactory intelligentRobotFactory(
            @Autowired IntegrationEnvironment integrationEnvironment) {
        IntelligentRobotFactoryImpl intelligentRobotFactory = new IntelligentRobotFactoryImpl();

        intelligentRobotFactory.setIntegrationEnvironment(
                integrationEnvironment
        );
        return intelligentRobotFactory;
    }


    @Bean
    public NotificationCenter notificationCenter() {
        NotificationCenterImpl notificationCenter = new NotificationCenterImpl();
        notificationCenter.initMsgSenders();
        //notificationCenter.registerMessageSender("innerMsg",innerMessageManager);
        return notificationCenter;
    }

    @Bean
    @Lazy(value = false)
    public OperationLogWriter operationLogWriter() {
        TextOperationLogWriterImpl operationLog =  new TextOperationLogWriterImpl();
        operationLog.init();
        return operationLog;
    }

    @Bean
    public MessageSender smsMessageManager(){
        SmsMessageSender smsMessageManager =new SmsMessageSender();
        smsMessageManager.setSmsSendUrl(env.getProperty("sms.send.url"));
        return smsMessageManager;
    }

    @Bean
    public InstantiationServiceBeanPostProcessor instantiationServiceBeanPostProcessor() {
        return new InstantiationServiceBeanPostProcessor();
    }

}
