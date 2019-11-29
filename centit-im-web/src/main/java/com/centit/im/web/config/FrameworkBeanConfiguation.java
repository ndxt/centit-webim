package com.centit.im.web.config;

import com.alibaba.fastjson.parser.Feature;
import com.alibaba.fastjson.support.config.FastJsonConfig;
import com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter;
import com.centit.framework.ip.service.IntegrationEnvironment;
import com.centit.framework.ip.service.impl.JdbcIntegrationEnvironment;
import com.centit.framework.model.adapter.PlatformEnvironment;
import com.centit.framework.security.model.CentitPasswordEncoder;
import com.centit.framework.security.model.CentitUserDetailsService;
import com.centit.framework.security.model.StandardPasswordEncoderImpl;
import com.centit.framework.staticsystem.service.impl.JdbcPlatformEnvironment;
import com.centit.framework.staticsystem.service.impl.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.MediaType;

import java.util.ArrayList;
import java.util.List;

@EnableConfigurationProperties(FrameworkProperties.class)
@Configuration("frameworkBeanConfiguation")
public class FrameworkBeanConfiguation {

    @Autowired
    private FrameworkProperties frameworkProperties;

    @Bean
    public FastJsonHttpMessageConverter fastJsonHttpMessageConverter(){
        FastJsonHttpMessageConverter fastJsonHttpMessageConverter =
                new FastJsonHttpMessageConverter();
        List<MediaType> supportedMediaTypes = new ArrayList<>();
        supportedMediaTypes.add(MediaType.APPLICATION_JSON);
        supportedMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);

        fastJsonHttpMessageConverter.setSupportedMediaTypes(supportedMediaTypes);

        FastJsonConfig fastJsonConfig = new FastJsonConfig();
        fastJsonConfig.setFeatures(Feature.AllowArbitraryCommas,Feature.AllowUnQuotedFieldNames,
                Feature.DisableCircularReferenceDetect);
        fastJsonConfig.setDateFormat("yyyy-MM-dd HH:mm:ss");

        fastJsonHttpMessageConverter.setFastJsonConfig(fastJsonConfig);
        return fastJsonHttpMessageConverter;
    }

    @Bean({"passwordEncoder"})
    public CentitPasswordEncoder passwordEncoder() {
        return new StandardPasswordEncoderImpl();
    }

    @Bean
    @Lazy(value = false)
    public PlatformEnvironment platformEnvironment(
            @Autowired CentitPasswordEncoder passwordEncoder) {
        JdbcPlatformEnvironment jdbcPlatformEnvironment = new JdbcPlatformEnvironment();

        jdbcPlatformEnvironment.setDataBaseConnectInfo(
                frameworkProperties.getJdbcplatform().getUer(),
                frameworkProperties.getJdbcplatform().getUsername(),
                frameworkProperties.getJdbcplatform().getPassword());
        jdbcPlatformEnvironment.setPasswordEncoder(passwordEncoder);
        return jdbcPlatformEnvironment;
    }

    @Bean
    @Lazy(value = false)
    public IntegrationEnvironment integrationEnvironment() {

        JdbcIntegrationEnvironment jdbcIntegrationEnvironment = new JdbcIntegrationEnvironment();
        jdbcIntegrationEnvironment.setDataBaseConnectInfo(
                frameworkProperties.getJdbcplatform().getUer(),
                frameworkProperties.getJdbcplatform().getUsername(),
                frameworkProperties.getJdbcplatform().getPassword());
        jdbcIntegrationEnvironment.reloadIPEnvironmen();

        return jdbcIntegrationEnvironment;
    }

    @Bean
    public CentitUserDetailsService centitUserDetailsService(@Autowired PlatformEnvironment platformEnvironment) {
        UserDetailsServiceImpl userDetailsService = new UserDetailsServiceImpl();
        userDetailsService.setPlatformEnvironment(platformEnvironment);
        return userDetailsService;
    }


}
