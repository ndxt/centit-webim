package com.centit.im.web.config;

import com.centit.fileserver.utils.SystemTempFileUtils;
import com.centit.framework.common.SysParametersUtils;
import com.centit.framework.model.adapter.MessageSender;
import com.centit.framework.model.adapter.NotificationCenter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

import java.io.File;

/**
 * Created by codefan on 17-7-6.
 */
public class InstantiationServiceBeanPostProcessor implements ApplicationListener<ContextRefreshedEvent>
{

    @Autowired
    protected NotificationCenter notificationCenter;


    @Autowired
    private MessageSender smsMessageManager;


    @Override
    public void onApplicationEvent(ContextRefreshedEvent event)
    {
        SystemTempFileUtils.setTempFileDirectory(
                SysParametersUtils.getTempHome() + File.separatorChar );

        notificationCenter.registerMessageSender("sms", smsMessageManager);
    }

}