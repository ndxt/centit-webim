package com.centit.im.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.centit.framework.common.JsonResultUtils;
import com.centit.framework.common.ResponseMapData;
import com.centit.framework.core.controller.BaseController;
import com.centit.framework.model.basedata.IUnitInfo;
import com.centit.im.po.WebImCustomer;
import com.centit.im.po.WebImFriendMemo;
import com.centit.im.po.WebImGroup;
import com.centit.im.po.WebImGroupMember;
import com.centit.im.service.WebImUserManager;
import com.centit.support.algorithm.ListOpt;
import com.centit.support.database.utils.PageDesc;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

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

    @RequestMapping(value = "/allUnit",
            method = RequestMethod.GET)
    public void listAllUnits(HttpServletResponse response) {
        List<? extends IUnitInfo> allUnits = webImUserManager.listAllUnit();
        ListOpt.sortAsTree(allUnits,
                ( p,  c) -> StringUtils.equals(p.getUnitCode(),c.getParentUnit()) );
        JsonResultUtils.writeSingleDataJson(
                allUnits,response);
    }

    /**
     * 获取下层机构
     * @param parentUnitCode
     * @param response
     */
    @RequestMapping(value = "/subUnit/{parentUnitCode}",
            method = RequestMethod.GET)
    public void listSubUnits(@PathVariable String parentUnitCode,
                             HttpServletResponse response) {
        List<? extends IUnitInfo> allUnits = webImUserManager.listSubUnit(parentUnitCode);
        Collections.sort(allUnits, Comparator.comparing(IUnitInfo::getUnitOrder));
        JsonResultUtils.writeSingleDataJson(
                allUnits,response);
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


    /**
     * 创建群 接收用户数组
     * @param userCode
     * @param response
     */
    @RequestMapping(value = "/creategroup/{userCode}", method = RequestMethod.POST)
    public void cresteGroup(
            @PathVariable String userCode,String group,String member,
            HttpServletResponse response) {
        WebImGroup webImGroup = new WebImGroup().stingToObject(StringEscapeUtils.unescapeHtml4(group));
        WebImGroupMember[] webImGroupMembers = new WebImGroupMember().stringToArray(StringEscapeUtils.unescapeHtml4(member));
        WebImGroup dbWebImGroup = webImUserManager.saveGroup(userCode,webImGroup,webImGroupMembers);
        JsonResultUtils.writeSingleDataJson(dbWebImGroup, response);
    }

    /**
     * 申请加入群
     * @param userCode
     * @param groupId
     * @param response
     */
    @RequestMapping(value = "/addgroup/{userCode}/{groupId}", method = RequestMethod.PUT)
    public void addGroup(
            @PathVariable String userCode,
            @PathVariable String groupId,
            @RequestBody WebImGroupMember webImGroupMember,
            HttpServletResponse response) {
        WebImGroup dbWebImGroup = webImUserManager.getWebImGroup(groupId);
        if (dbWebImGroup == null){
            JsonResultUtils.writeErrorMessageJson("群不存在",response);
            return;
        }
        if (dbWebImGroup.getGroupType().equals("U")){
            JsonResultUtils.writeErrorMessageJson("机构群不可自行加入",response);
            return;
        }
        webImUserManager.addGroup(userCode,groupId,webImGroupMember);
        JsonResultUtils.writeSuccessJson(response);
    }

    /**
     * 邀请加入群
     * @param userCode
     * @param groupId
     * @param response
     */
    @RequestMapping(value = "/invitegroup/{userCode}/{groupId}", method = RequestMethod.PUT)
    public void inviteGroup(
            @PathVariable String userCode,
            @PathVariable String groupId,
            @RequestBody WebImGroupMember webImGroupMember,
            HttpServletResponse response) {
        WebImGroup dbWebImGroup = webImUserManager.getWebImGroup(groupId);
        if (dbWebImGroup == null){
            JsonResultUtils.writeErrorMessageJson("群不存在",response);
            return;
        }
        webImUserManager.addGroup(userCode,groupId,webImGroupMember);
        JsonResultUtils.writeSuccessJson(response);
    }

    /**
     * 获取群成员信息
     * @param groupId
     * @param pageDesc
     * @param response
     */
    @RequestMapping(value = "/listgroupmember/{groupId}", method = RequestMethod.GET)
    public void inviteGroup(
            @PathVariable String groupId,PageDesc pageDesc,
            HttpServletResponse response) {
        WebImGroup dbWebImGroup = webImUserManager.getWebImGroup(groupId);
        if (dbWebImGroup == null){
            JsonResultUtils.writeErrorMessageJson("群不存在",response);
            return;
        }
        ResponseMapData resData = new ResponseMapData();
        resData.addResponseData(OBJLIST, webImUserManager.listGroupMember(groupId));
        resData.addResponseData(PAGE_DESC, pageDesc);
        JsonResultUtils.writeResponseDataAsJson(resData, response);
    }

    /**
     * 修改群成员信息
     * @param webImGroupMember
     * @param response
     */
    @RequestMapping(value = "/updategroupmember", method = RequestMethod.PUT)
    public void updateGroupMember(
            @RequestBody WebImGroupMember webImGroupMember,
            HttpServletResponse response) {
        webImUserManager.updateGroupMember(webImGroupMember);
        JsonResultUtils.writeSuccessJson(response);
    }


    /**
     * 修改群信息
     * @param groupId
     * @param webImGroup
     * @param response
     */
    @RequestMapping(value = "/updategroup/{groupId}", method = RequestMethod.PUT)
    public void updategGroup(
            @PathVariable String groupId,
            @RequestBody WebImGroup webImGroup,
            HttpServletResponse response) {
        WebImGroup dbWebImGroup = webImUserManager.getWebImGroup(groupId);
        if (dbWebImGroup == null){
            JsonResultUtils.writeErrorMessageJson("群不存在",response);
            return;
        }
        dbWebImGroup.copy(webImGroup);
        webImUserManager.updateGroup(groupId,dbWebImGroup);
        JsonResultUtils.writeSuccessJson(response);
    }

    /**
     * 退出群
     * @param userCode
     * @param groupId
     * @param response
     */
    @RequestMapping(value = "/quitgroup/{userCode}/{groupId}", method = RequestMethod.PUT)
    public void quitGroup(
            @PathVariable String userCode,
            @PathVariable String groupId,
            HttpServletResponse response) {
        webImUserManager.quitGroup(userCode,groupId);
        JsonResultUtils.writeSuccessJson(response);
    }

    /**
     * 解散群
     * @param userCode
     * @param groupId
     * @param response
     */
    @RequestMapping(value = "/dissolvegroup/{userCode}/{groupId}", method = RequestMethod.PUT)
    public void dissolveGroup(
            @PathVariable String userCode,
            @PathVariable String groupId,
            HttpServletResponse response) {
        WebImGroup webImGroup = webImUserManager.getWebImGroup(groupId);
        if (webImGroup == null){
            JsonResultUtils.writeErrorMessageJson("群不存在",response);
            return;
        }
        if (webImGroup.getGroupType().equals("U")){
            JsonResultUtils.writeErrorMessageJson("机构群不允许解散",response);
            return;
        }
        webImUserManager.dissolveGroup(userCode,groupId);
        JsonResultUtils.writeSuccessJson(response);
    }

}
