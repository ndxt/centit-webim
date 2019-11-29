package com.centit.im.web.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(com.centit.im.web.config.FrameworkProperties.PREFIX)
@Data
public class FrameworkProperties {
    public static final String PREFIX = "framework";

    private AppConfig app;
    private JdbcPlatform jdbcplatform;

    @Data
    public static class AppConfig{
        private String home;
    }

    @Data
    public static class JdbcPlatform{
        private String uer;
        private String username;
        private String password;
    }

}
