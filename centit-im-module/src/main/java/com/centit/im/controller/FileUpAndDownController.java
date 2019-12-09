package com.centit.im.controller;

import com.alibaba.fastjson.JSONObject;
import com.centit.fileserver.controller.FileController;
import io.swagger.annotations.Api;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/file")
@Api(value = "上传文件接口", tags = "上传文件接口")
public class FileUpAndDownController extends FileController {

    @Override
    protected void fileUploadCompleteOpt(String fileMd5, long size, JSONObject retJson) {
        /*Map<String, Object> fileInfo = (Map<String, Object>)retJson.get(ResponseData.RES_DATA_FILED);
        String src = (String)fileInfo.get("src");
        fileInfo.put("src" ,"./"+src);*/
    }
}
