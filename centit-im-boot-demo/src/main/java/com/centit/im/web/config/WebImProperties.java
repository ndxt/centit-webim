package com.centit.im.web.config;

import com.centit.search.service.ESServerConfig;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(WebImProperties.PREFIX)
@Data
public class WebImProperties {
    public static final String PREFIX = "webim";

    private SmsConfig sms;
    private RobotConfig robot;
    private FileStoreConfig fileStore;

    private ESServerConfig elasticSearch;

    @Data
    public static class SmsConfig{
        private String sendUrl;
    }

    @Data
    public static class RobotConfig{
        private String type;
        private Integer maxAnswer;
    }

    @Data
    public static class FileStoreConfig{
        private String baseDir;
    }

}
