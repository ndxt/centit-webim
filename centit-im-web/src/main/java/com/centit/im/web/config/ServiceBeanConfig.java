package com.centit.im.web.config;

import com.centit.fileserver.utils.FileStore;
import com.centit.fileserver.utils.OsFileStore;
import com.centit.framework.components.impl.NotificationCenterImpl;
import com.centit.framework.components.impl.TextOperationLogWriterImpl;
import com.centit.framework.ip.service.IntegrationEnvironment;
import com.centit.framework.model.adapter.MessageSender;
import com.centit.framework.model.adapter.NotificationCenter;
import com.centit.framework.model.adapter.OperationLogWriter;
import com.centit.im.robot.es.po.QuestAndAnswer;
import com.centit.im.robot.es.service.QuestAndAnswerManager;
import com.centit.im.robot.es.service.impl.IntelligentRobotEsImpl;
import com.centit.im.service.IntelligentRobotFactory;
import com.centit.im.service.impl.IntelligentRobotFactoryRpcImpl;
import com.centit.im.service.impl.IntelligentRobotFactorySingleImpl;
import com.centit.im.web.plugins.JsfgwSmsMessageSender;
import com.centit.search.service.ESServerConfig;
import com.centit.search.service.Impl.ESIndexer;
import com.centit.search.service.Impl.ESSearcher;
import com.centit.search.service.IndexerSearcherFactory;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;

import java.io.File;

@Configuration
@ComponentScan(basePackages = "com.centit",
        excludeFilters = @ComponentScan.Filter(value = org.springframework.stereotype.Controller.class))
@EnableConfigurationProperties(WebImProperties.class)
public class ServiceBeanConfig {

    @Value("${framework.app.home:/}")
    protected String appHome;

    @Autowired
    private WebImProperties webImProperties;

    @Autowired
    IntegrationEnvironment integrationEnvironment;
    @Autowired
    QuestAndAnswerManager questAndAnswerManager;

//    @Bean
//    public MultipartConfigElement multipartConfigElement() {
//        MultipartConfigFactory factory = new MultipartConfigFactory();
//        //文件最大
//        factory.setMaxFileSize("80MB"); //KB,MB
//        /// 设置总上传数据总大小
//        return factory.createMultipartConfig();
//    }
    @Bean
    public IntelligentRobotFactory intelligentRobotFactory() {
        if("es".equals(webImProperties.getRobot().getType())){
            IntelligentRobotFactorySingleImpl intelligentRobotFactory
                    = new IntelligentRobotFactorySingleImpl();
            IntelligentRobotEsImpl intelligentRobot = new IntelligentRobotEsImpl();
            intelligentRobot.setEsServerConfig(webImProperties.getElasticSearch());

            intelligentRobot.setMaxAnswer(webImProperties.getRobot().getMaxAnswer());
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
public ESServerConfig esServerConfig(){
    return webImProperties.getElasticSearch();
}

    @Bean(name = "esObjectIndexer")
    public ESIndexer esObjectIndexer(@Autowired ESServerConfig esServerConfig){
        return IndexerSearcherFactory.obtainIndexer(
                esServerConfig, QuestAndAnswer.class);
    }

    @Bean(name = "esObjectSearcher")
    public ESSearcher esObjectSearcher(@Autowired ESServerConfig esServerConfig){
        return IndexerSearcherFactory.obtainSearcher(
                esServerConfig, QuestAndAnswer.class);
    }
    @Bean
    public FileStore fileStore(){

        String baseHome = webImProperties.getFileStore().getBaseDir();
        if(StringUtils.isBlank(baseHome)) {
            baseHome = appHome + File.separatorChar + "temp";
        }

        return new OsFileStore(baseHome);
    }

    @Bean
    public NotificationCenter notificationCenter() {
        NotificationCenterImpl notificationCenter = new NotificationCenterImpl();
        notificationCenter.initDummyMsgSenders();
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
        smsMessageManager.setSmsSendUrl(webImProperties.getSms().getSendUrl());
        return smsMessageManager;
    }

    @Bean
    public InstantiationServiceBeanPostProcessor instantiationServiceBeanPostProcessor() {
        return new InstantiationServiceBeanPostProcessor();
    }

    @Bean
    public CsrfTokenRepository csrfTokenRepository() {
        return new HttpSessionCsrfTokenRepository();
    }

}
