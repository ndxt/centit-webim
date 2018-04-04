package com.centit.im.web.config;

import com.centit.fileserver.utils.FileStore;
import com.centit.fileserver.utils.OsFileStore;
import com.centit.framework.common.SysParametersUtils;
import com.centit.framework.components.impl.NotificationCenterImpl;
import com.centit.framework.components.impl.TextOperationLogWriterImpl;
import com.centit.framework.core.config.DataSourceConfig;
import com.centit.framework.hibernate.config.HibernateConfig;
import com.centit.framework.ip.app.config.IPAppSystemBeanConfig;
import com.centit.framework.ip.service.IntegrationEnvironment;
import com.centit.framework.model.adapter.MessageSender;
import com.centit.framework.model.adapter.NotificationCenter;
import com.centit.framework.model.adapter.OperationLogWriter;
import com.centit.framework.config.SpringSecurityDaoConfig;
import com.centit.im.robot.es.service.impl.IntelligentRobotEsImpl;
import com.centit.im.service.IntelligentRobotFactory;
import com.centit.im.service.impl.IntelligentRobotFactoryRpcImpl;
import com.centit.im.service.impl.IntelligentRobotFactorySingleImpl;
import com.centit.im.web.plugins.JsfgwSmsMessageSender;
import com.centit.support.algorithm.NumberBaseOpt;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;

@Configuration
@ComponentScan(basePackages = "com.centit",
        excludeFilters = @ComponentScan.Filter(value = org.springframework.stereotype.Controller.class))
@Import({IPAppSystemBeanConfig.class,
        DataSourceConfig.class,
        HibernateConfig.class,
        SpringSecurityDaoConfig.class})
public class ServiceBeanConfig {


    @Autowired
    private Environment env;

    @Autowired
    IntegrationEnvironment integrationEnvironment;

    @Bean
    public IntelligentRobotFactory intelligentRobotFactory() {
        if("es".equals(env.getProperty("webim.robot.type"))){
            IntelligentRobotFactorySingleImpl intelligentRobotFactory
                    = new IntelligentRobotFactorySingleImpl();
            IntelligentRobotEsImpl intelligentRobot = new IntelligentRobotEsImpl();
            intelligentRobot.setMaxAnswer( NumberBaseOpt.parseInteger(
                            env.getProperty("question.robot.answer.maxsize"), 4));
            intelligentRobotFactory.setIntelligentRobot(intelligentRobot );
            return intelligentRobotFactory;
        }else{
            IntelligentRobotFactoryRpcImpl intelligentRobotFactory
                    = new IntelligentRobotFactoryRpcImpl();
            intelligentRobotFactory.setIntegrationEnvironment(
                    integrationEnvironment
            );
            return intelligentRobotFactory;
        }
    }

    @Bean
    public FileStore fileStore(){

        String baseHome = env.getProperty("os.file.base.dir");
        if(StringUtils.isBlank(baseHome)) {
            baseHome = SysParametersUtils.getUploadHome();
        }

        return new OsFileStore(baseHome);
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
        JsfgwSmsMessageSender smsMessageManager =new JsfgwSmsMessageSender();
        smsMessageManager.setSmsSendUrl(env.getProperty("sms.send.url"));
        return smsMessageManager;
    }

    @Bean
    public InstantiationServiceBeanPostProcessor instantiationServiceBeanPostProcessor() {
        return new InstantiationServiceBeanPostProcessor();
    }

}