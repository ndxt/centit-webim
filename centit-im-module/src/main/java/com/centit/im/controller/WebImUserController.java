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
import com.centit.support.algorithm.CollectionsOpt;
import com.centit.support.algorithm.StringBaseOpt;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * Created by codefan on 17-5-26.
 */
@Controller
@RequestMapping("/webimcust")
@Api(value = "用户管理接口", tags = "用户管理接口")
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
    @ApiOperation(value = "查询用户列表")
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
        CollectionsOpt.sortAsTree(allUnits,
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
     * @param response
     */
    @RequestMapping(value = "/creategroup", method = RequestMethod.POST)
    public void cresteGroup(
            @RequestBody String groupJson,
            HttpServletRequest request,
            HttpServletResponse response) {
        JSONObject jsonObject = JSON.parseObject(groupJson);
        WebImGroup webImGroup = WebImGroup.createFromJson(jsonObject);
        String currentUserCode = this.getLoginUserCode(request);
        if(StringUtils.isNotBlank(currentUserCode)) {
            webImGroup.setCreator(currentUserCode);
        }
        webImGroup.setGroupType("G");

        Object members = jsonObject.get("members");
        String groupId = webImUserManager
                .createGroupWithMembers(webImGroup,
                        CollectionsOpt.listToArray(StringBaseOpt.objectToStringList(members)));
        webImGroup.setGroupId(groupId);
        JsonResultUtils.writeSingleDataJson(webImGroup, response);
    }

    /**
     * 修改群基本信息
     * @param response
     */
    @RequestMapping(value = "/updategroup", method = RequestMethod.PUT)
    public void updateGroupInfo(
            @RequestBody String groupJson,
            HttpServletResponse response) {

        WebImGroup webImGroup = WebImGroup.createFromJsonString(groupJson);

        webImUserManager.updateGroupInfo(webImGroup);
        JsonResultUtils.writeSuccessJson(response);
    }

    /**
     * 申请加入群
     * @param memberCode
     * @param groupId
     * @param response
     */
    @RequestMapping(value = "/addgroupmember/{groupId}/{memberCode}", method = RequestMethod.PUT)
    public void addGroupMember(
            @PathVariable String groupId,
            @PathVariable String memberCode,
            HttpServletResponse response) {

        webImUserManager.addGroupMember(groupId,memberCode);
        JsonResultUtils.writeSuccessJson(response);
    }

    /**
     * 更新所有群成员
     * @param groupId
     * @param response
     */
    @RequestMapping(value = "/updategroupmembers/{groupId}", method = RequestMethod.PUT)
    public void updateGroupMembers(
            @PathVariable String groupId,
            @RequestBody String membersJsonStr,
            HttpServletResponse response) {
        JSONArray ja = JSON.parseArray(membersJsonStr);
        webImUserManager.updateGroupMembers(groupId,CollectionsOpt.listToArray(StringBaseOpt.objectToStringList(ja)));
        JsonResultUtils.writeSuccessJson(response);
    }

    /**
     * 获取群成员信息
     * @param groupId
     * @param response
     */
    @RequestMapping(value = "/listgroupmember/{groupId}", method = RequestMethod.GET)
    public void listGroupMembers(
            @PathVariable String groupId,
            HttpServletResponse response) {

        JsonResultUtils.writeSingleDataJson(
                webImUserManager.listGroupMembers(groupId),response );
    }

    /**
     * 获取群基本信息
     * @param groupId
     * @param response
     */
    @RequestMapping(value = "/getgroupInfo/{groupId}", method = RequestMethod.GET)
    public void getGroupInfo(
            @PathVariable String groupId,
            HttpServletResponse response) {

        JsonResultUtils.writeSingleDataJson(
                webImUserManager.getGroupInfo(groupId),response );
    }
    /**
     * 修改群成员信息
     * @param memberInfoJson
     * @param response
     */
    @RequestMapping(value = "/updatememberinfo", method = RequestMethod.PUT)
    public void updateGroupMember(
            @RequestBody String memberInfoJson,
            HttpServletResponse response) {

        webImUserManager.updateGroupMemberInfo(
                WebImGroupMember.createFromJson(JSON.parseObject(memberInfoJson)));
        JsonResultUtils.writeSuccessJson(response);
    }

    /**
     * 退出群
     * @param memberCode
     * @param groupId
     * @param response
     */
    @RequestMapping(value = "/quitgroup/{groupId}/{memberCode}", method = RequestMethod.PUT)
    public void removeGroupMember(
            @PathVariable String groupId,
            @PathVariable String memberCode,
            HttpServletResponse response) {
        webImUserManager.removeGroupMember(groupId,memberCode);
        JsonResultUtils.writeSuccessJson(response);
    }

    /**
     * 解散群
     * @param groupId
     * @param userCode
     * @param response
     */
    @RequestMapping(value = "/dissolvegroup/{groupId}/{userCode}", method = RequestMethod.PUT)
    public void dissolveGroup(
            @PathVariable String groupId,
            @PathVariable String userCode,
            HttpServletResponse response) {
        int nRres = webImUserManager
                .dissolveGroup(groupId, userCode, false);
        ResponseMapData resData = new ResponseMapData();
        resData.addResponseData("flag", nRres);
        if(nRres > 0 ){
            JsonResultUtils.writeResponseDataAsJson(resData, response);
        }else{
            resData.addResponseData("message", "群不存在或者您不是群主。");
            JsonResultUtils.writeResponseDataAsJson(resData, response);

        }
    }

    /**
     * 删除群
     * @param groupId
     * @param userCode
     * @param response
     */
    @RequestMapping(value = "/deleteGroup/{groupId}/{userCode}", method = RequestMethod.DELETE)
    public void deleteGroup(
            @PathVariable String groupId,
            @PathVariable String userCode,
            HttpServletResponse response) {
        int nRres = webImUserManager
                .dissolveGroup(groupId, userCode, true);
        ResponseMapData resData = new ResponseMapData();
        resData.addResponseData("flag", nRres);
        if(nRres > 0 ){
            JsonResultUtils.writeResponseDataAsJson(resData, response);
        }else{
            resData.addResponseData("message", "群不存在。");
            JsonResultUtils.writeResponseDataAsJson(resData, response);
        }
    }
}
