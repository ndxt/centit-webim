package com.centit.im.controller;

import com.centit.framework.common.JsonResultUtils;
import com.centit.framework.core.controller.BaseController;
import com.centit.framework.model.basedata.IUnitInfo;
import com.centit.im.po.WebImFriendMemo;
import com.centit.im.po.WebImCustomer;
import com.centit.im.service.WebImUserManager;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by codefan on 17-5-26.
 */
@Controller
@RequestMapping("/webimcust")
public class WebImUserController extends BaseController {

    @Resource
    protected WebImUserManager webImUserManager;


    //配置用户信息
    @RequestMapping(value = "/friend", method = RequestMethod.POST)
    public void setFriendMemo(
            @RequestBody WebImFriendMemo memo,
            HttpServletResponse response) {
        webImUserManager.saveUserFriendMemo(memo);
        JsonResultUtils.writeSuccessJson(response);
    }

    /**
     * 注册用户 返回 token
     * @param user
     * @param response
     */
    @RequestMapping(value = "/register",
           method = RequestMethod.POST)
    public void registerUser(
            @RequestBody WebImCustomer user,
            HttpServletResponse response) {
        webImUserManager.registerUser(user);
        JsonResultUtils.writeSuccessJson(response);
    }

    /**
     * 返回系统所有联系人
     * @param response
     */
    @RequestMapping(value = "/listUser", method = RequestMethod.GET)
    public void listAllUser(
            HttpServletResponse response) {
        List<WebImCustomer> allCusts =
                webImUserManager.listAllUser();
        JsonResultUtils.writeSingleDataJson(allCusts,response);
    }

    /**
     * 返回联系人信息
     * @param response
     */
    @RequestMapping(value = "/user/{userCode}", method = RequestMethod.GET)
    public void getUser(@PathVariable String userCode,
                        HttpServletResponse response) {
        WebImCustomer cust = webImUserManager.getUser(userCode);
        JsonResultUtils.writeSingleDataJson(cust,response);
    }

    /**
     * 返回客服专家（客服模式）所有服务的对象
     * @param serviceUserCode 客服代码
     * @param lastServiceDate   最后服务时间，如果为null默认为 一个月内服务过的人员
     * @param response  listServiceCustomer(String serviceUserCode)
     */
    @RequestMapping(value = "/cust/{serviceUserCode}", method = RequestMethod.GET)
    public void listServiceCustomer(@PathVariable String serviceUserCode,
                                    Date lastServiceDate, HttpServletResponse response) {
        List<WebImCustomer> allcusts  = webImUserManager
                .listServiceCustomer(serviceUserCode,lastServiceDate);
        JsonResultUtils.writeSingleDataJson(allcusts,response);
    }

    /**
     * 返回所有客服专家（客服模式）
     * @param response  listServiceCustomer(String serviceUserCode)
     */
    @RequestMapping(value = "/services", method = RequestMethod.GET)
    public void listCustomerService(HttpServletResponse response) {
        List<WebImCustomer> allcusts  = webImUserManager.listCustomerService();
        JsonResultUtils.writeSingleDataJson(allcusts,response);
    }

    /**
     * 返回系统联系状态
     * @param response
     */
    @RequestMapping(value = "/listUserState", method = RequestMethod.GET)
    public void listAllUserState(HttpServletResponse response) {
        Map<String,String> mapUserState = webImUserManager.listAllUserState();
        JsonResultUtils.writeSingleDataJson(mapUserState,response);
    }

    /**
     * 返回用户的群组（机构）
     * @param response
     */
    @RequestMapping(value = "/listUserUnit/{userCode}", method = RequestMethod.GET)
    public void listUserUnit(@PathVariable String userCode,
                             HttpServletResponse response) {
        List<IUnitInfo> listUserUnit = webImUserManager.listUserUnit(userCode);
        JsonResultUtils.writeSingleDataJson(listUserUnit,response);

    }

    /**
     * 返回机构中的成员
     * @param response
     */
    @RequestMapping(value = "/listUnitUser/{unitCode}", method = RequestMethod.GET)
    public void listAllUnitUser(@PathVariable String unitCode,
                                HttpServletResponse response) {
        List<WebImCustomer> listAllUnitUser = webImUserManager.listAllUnitUser(unitCode);
        JsonResultUtils.writeSingleDataJson(listAllUnitUser,response);
    }

    //配置用户信息
    @RequestMapping(value = "/config/{userCode}", method = RequestMethod.POST)
    public void setUserConfig(
            @PathVariable String userCode,
            @RequestBody WebImCustomer cust,
            HttpServletResponse response) {
        String useCode = webImUserManager.configUserInfo(userCode,cust);
        JsonResultUtils.writeSingleDataJson(useCode, response);
    }
}
