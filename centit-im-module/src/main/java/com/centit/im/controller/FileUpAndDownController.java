package com.centit.im.controller;

import com.alibaba.fastjson.JSONObject;
import com.centit.fileserver.controller.FileController;
import com.centit.fileserver.utils.UploadDownloadUtils;
import io.swagger.annotations.Api;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;

@Controller
@RequestMapping("/file")
@Api(value = "上传文件接口", tags = "上传文件接口")
public class FileUpAndDownController extends FileController {
    @Value("${webim.file-store.multipart-resolver:common}") //none 不推送 standard for spring boot
    protected String resolverType;

    @Override
    protected void fileUploadCompleteOpt(String fileMd5, long size, JSONObject retJson) {
        /*Map<String, Object> fileInfo = (Map<String, Object>)retJson.get(ResponseData.RES_DATA_FILED);
        String src = (String)fileInfo.get("src");
        fileInfo.put("src" ,"./"+src);*/
    }

    @Override
    protected Pair<String, InputStream> fetchInputStreamFromRequest(HttpServletRequest request) throws IOException {
        if(StringUtils.equals(resolverType, "standard")){
            return UploadDownloadUtils.fetchInputStreamFromStandardResolver(request);
        } else {
            return UploadDownloadUtils.fetchInputStreamFromMultipartResolver(request);
        }
    }
}
