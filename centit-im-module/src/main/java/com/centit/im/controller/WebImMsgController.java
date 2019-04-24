package com.centit.im.controller;

import com.centit.framework.core.controller.BaseController;
import com.centit.im.service.WebImMessageManager;
import io.swagger.annotations.Api;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;

/**
 * Created by codefan on 17-5-26.
 */
@Controller
@Api(value = "消息管理接口", tags = "消息管理接口")
@RequestMapping("/webimmsg")
public class WebImMsgController extends BaseController {

    @Resource
    protected WebImMessageManager webImMessageManager;

}
