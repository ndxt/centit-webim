package com.centit.im.web.config;

import com.centit.fileserver.utils.SystemTempFileUtils;
import com.centit.framework.components.CodeRepositoryCache;
import com.centit.framework.components.OperationLogCenter;
import com.centit.framework.model.adapter.NotificationCenter;
import com.centit.framework.model.adapter.OperationLogWriter;
import com.centit.framework.model.adapter.PlatformEnvironment;
import com.centit.im.service.WebImSocket;
import com.centit.im.socketio.WebImSocketListener;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

import java.io.File;

/**
 * Created by codefan on 17-7-6.
 */
public class InstantiationServiceBeanPostProcessor implements ApplicationListener<ContextRefreshedEvent>
{

    @Value("${app.home:}")
    protected String appHome;

    @Autowired
    protected NotificationCenter notificationCenter;

    @Autowired
    private OperationLogWriter operationLogWriter;

    @Autowired
    private PlatformEnvironment platformEnvironment;

    @Autowired
    protected WebImSocket webImSocket;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event){
        CodeRepositoryCache.setPlatformEnvironment(platformEnvironment);
        if(StringUtils.isNotBlank(appHome)) {
            SystemTempFileUtils.setTempFileDirectory(appHome + File.separatorChar + "temp");
        }
        File file = new File(SystemTempFileUtils.getTempDirectory());
        if(!file.exists()){
            file.mkdirs();
        }
        WebImSocketListener.webImSocket = webImSocket;
        OperationLogCenter.registerOperationLogWriter(operationLogWriter);
    }

}
