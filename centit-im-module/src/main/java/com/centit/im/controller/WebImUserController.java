package com.centit.im.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.centit.framework.common.JsonResultUtils;
import com.centit.framework.common.ResponseData;
import com.centit.framework.common.ResponseMapData;
import com.centit.framework.core.controller.BaseController;
import com.centit.framework.core.controller.WrapUpResponseBody;
import com.centit.framework.model.basedata.IUnitInfo;
import com.centit.im.po.WebImCustomer;
import com.centit.im.po.WebImFriendMemo;
import com.centit.im.po.WebImGroup;
import com.centit.im.po.WebImGroupMember;
import com.centit.im.service.WebImUserManager;
import com.centit.support.algorithm.CollectionsOpt;
import com.centit.support.algorithm.StringBaseOpt;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
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
    @ApiOperation(value = "1配置用户信息")
    @RequestMapping(value = "/friend", method = RequestMethod.POST)
    @WrapUpResponseBody
    public ResponseData setFriendMemo(
            @RequestBody WebImFriendMemo memo) {
        webImUserManager.saveUserFriendMemo(memo);
        return ResponseData.makeSuccessResponse();
    }

    /**
     * 注册用户 返回 token
     * @param user
     *
     */
    @ApiOperation(value = "2注册用户")

    @RequestMapping(value = "/register",
           method = RequestMethod.POST)
    @WrapUpResponseBody
    public ResponseData registerUser(
            @RequestBody WebImCustomer user) {
        webImUserManager.registerUser(user);
        return ResponseData.makeSuccessResponse();
    }

    /**
     * 返回系统所有联系人
     *
     */
    @ApiOperation(value = "3查询用户列表")
    @RequestMapping(value = "/listUser", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<WebImCustomer> listAllUser() {
        return  webImUserManager.listAllUser();
    }
    @ApiOperation(value = "4查询机构列表")
    @RequestMapping(value = "/allUnit",
            method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<? extends IUnitInfo> listAllUnits() {
        List<? extends IUnitInfo> allUnits = webImUserManager.listAllUnit();
        CollectionsOpt.sortAsTree(allUnits,
                ( p,  c) -> StringUtils.equals(p.getUnitCode(),c.getParentUnit()) );
        return allUnits;
    }

    /**
     * 获取下层机构
     * @param parentUnitCode
     *
     */
    @ApiOperation(value = "5查询下层机构列表")
    @RequestMapping(value = "/subUnit/{parentUnitCode}",
            method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<? extends IUnitInfo> listSubUnits(@PathVariable String parentUnitCode) {
        List<? extends IUnitInfo> allUnits = webImUserManager.listSubUnit(parentUnitCode);
        Collections.sort(allUnits, Comparator.comparing(IUnitInfo::getUnitOrder));
        return allUnits;
    }
    /**
     * 返回联系人信息
     *
     */
    @ApiOperation(value = "6查询联系人信息")
    @RequestMapping(value = "/user/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public WebImCustomer getUser(@PathVariable String userCode) {
        return webImUserManager.getUser(userCode);
    }

    /**
     * 返回客服专家（客服模式）所有服务的对象
     * @param serviceUserCode 客服代码
     * @param lastServiceDate   最后服务时间，如果为null默认为 一个月内服务过的人员
     *
     */
    @ApiOperation(value = "7查询所有服务的对象")
    @RequestMapping(value = "/cust/{serviceUserCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<WebImCustomer> listServiceCustomer(@PathVariable String serviceUserCode,
                                    Date lastServiceDate) {
        return webImUserManager.listServiceCustomer(serviceUserCode,lastServiceDate);
    }

    /**
     * 返回所有客服专家（客服模式）
     *
     */
    @ApiOperation(value = "8查询所有客服专家")
    @RequestMapping(value = "/services", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<WebImCustomer> listCustomerService() {
        return webImUserManager.listCustomerService();
    }

    /**
     * 返回系统联系状态
     *
     */
    @ApiOperation(value = "9查询系统联系状态")
    @RequestMapping(value = "/listUserState", method = RequestMethod.GET)
    @WrapUpResponseBody
    public Map<String,String> listAllUserState() {
        return webImUserManager.listAllUserState();
    }

    /**
     * 返回用户的群组（机构）
     *
     */
    @ApiOperation(value = "10查询用户的群组")
    @RequestMapping(value = "/listUserUnit/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<IUnitInfo>  listUserUnit(@PathVariable String userCode) {
        return webImUserManager.listUserUnit(userCode);

    }

    /**
     * 返回机构中的成员
     *
     */
    @ApiOperation(value = "11查询机构中的成员")
    @RequestMapping(value = "/listUnitUser/{unitCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<WebImCustomer> listAllUnitUser(@PathVariable String unitCode) {
        return webImUserManager.listAllUnitUser(unitCode);
    }

    //配置用户信息
    @ApiOperation(value = "12配置用户信息")
    @RequestMapping(value = "/config/{userCode}", method = RequestMethod.POST)
    @WrapUpResponseBody
    public String  setUserConfig(
            @PathVariable String userCode,
            @RequestBody WebImCustomer cust) {
        return webImUserManager.configUserInfo(userCode,cust);
    }


    /**
     * 创建群 接收用户数组
     *
     */
    @ApiOperation(value = "13创建群及用户数组")
    @RequestMapping(value = "/creategroup", method = RequestMethod.POST)
    @WrapUpResponseBody
    public WebImGroup cresteGroup(
            @RequestBody String groupJson,
            HttpServletRequest request) {
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
        return webImGroup;
    }

    /**
     * 修改群基本信息
     *
     */
    @ApiOperation(value = "14修改群基本信息")
    @RequestMapping(value = "/updategroup", method = RequestMethod.PUT)
    @WrapUpResponseBody
    public ResponseData updateGroupInfo(
            @RequestBody String groupJson) {

        WebImGroup webImGroup = WebImGroup.createFromJsonString(groupJson);

        webImUserManager.updateGroupInfo(webImGroup);
        return ResponseData.makeSuccessResponse();
    }

    /**
     * 申请加入群
     * @param memberCode
     * @param groupId
     *
     */
    @ApiOperation(value = "15申请加入群")
    @RequestMapping(value = "/addgroupmember/{groupId}/{memberCode}", method = RequestMethod.PUT)
    @WrapUpResponseBody
    public ResponseData addGroupMember(
            @PathVariable String groupId,
            @PathVariable String memberCode) {

        webImUserManager.addGroupMember(groupId,memberCode);
        return ResponseData.makeSuccessResponse();
    }

    /**
     * 更新所有群成员
     * @param groupId
     * @param membersJsonStr [["123"],["234"]]
     */
    @ApiOperation(value = "16更新所有群成员")
    @RequestMapping(value = "/updategroupmembers/{groupId}", method = RequestMethod.PUT)
    @WrapUpResponseBody
    public ResponseData updateGroupMembers(
            @PathVariable String groupId,
            @RequestBody String membersJsonStr) {
        JSONArray ja = JSON.parseArray(membersJsonStr);
        webImUserManager.updateGroupMembers(groupId,CollectionsOpt.listToArray(StringBaseOpt.objectToStringList(ja)));
        return ResponseData.makeSuccessResponse();
    }

    /**
     * 获取群成员信息
     * @param groupId
     *
     */
    @ApiOperation(value = "17获取群成员信息")
    @RequestMapping(value = "/listgroupmember/{groupId}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<WebImGroupMember> listGroupMembers(
            @PathVariable String groupId) {

        return webImUserManager.listGroupMembers(groupId);
    }

    /**
     * 获取群基本信息
     * @param groupId
     *
     */
    @ApiOperation(value = "18获取群基本信息")
    @RequestMapping(value = "/getgroupInfo/{groupId}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public WebImGroup getGroupInfo(
            @PathVariable String groupId) {

        return  webImUserManager.getGroupInfo(groupId);
    }
    /**
     * 修改群成员信息
     * @param memberInfoJson
     *
     */
    @ApiOperation(value = "19修改群成员信息")
    @RequestMapping(value = "/updatememberinfo", method = RequestMethod.PUT)
    @WrapUpResponseBody
    public ResponseData updateGroupMember(
            @RequestBody String memberInfoJson) {

        webImUserManager.updateGroupMemberInfo(
                WebImGroupMember.createFromJson(JSON.parseObject(memberInfoJson)));
        return ResponseData.makeSuccessResponse();
    }

    /**
     * 退出群
     * @param memberCode
     * @param groupId
     *
     */
    @ApiOperation(value = "20退出群")
    @RequestMapping(value = "/quitgroup/{groupId}/{memberCode}", method = RequestMethod.PUT)
    @WrapUpResponseBody
    public ResponseData removeGroupMember(
            @PathVariable String groupId,
            @PathVariable String memberCode) {
        webImUserManager.removeGroupMember(groupId,memberCode);
        return ResponseData.makeSuccessResponse();
    }

    /**
     * 解散群
     * @param groupId
     * @param userCode
     *
     */
    @ApiOperation(value = "21解散群")
    @RequestMapping(value = "/dissolvegroup/{groupId}/{userCode}", method = RequestMethod.PUT)
    @WrapUpResponseBody
    public ResponseMapData dissolveGroup(
            @PathVariable String groupId,
            @PathVariable String userCode) {
        int nRres = webImUserManager
                .dissolveGroup(groupId, userCode, false);
        ResponseMapData resData = new ResponseMapData();
        resData.addResponseData("flag", nRres);
        if(nRres > 0 ){
            return resData;
        }else{
            resData.addResponseData("message", "群不存在或者您不是群主。");
            return  resData;

        }
    }

    /**
     * 删除群
     * @param groupId
     * @param userCode
     *
     */
    @ApiOperation(value = "22删除群")
    @RequestMapping(value = "/deleteGroup/{groupId}/{userCode}", method = RequestMethod.DELETE)
    @WrapUpResponseBody
    public ResponseMapData deleteGroup(
            @PathVariable String groupId,
            @PathVariable String userCode) {
        int nRres = webImUserManager
                .dissolveGroup(groupId, userCode, true);
        ResponseMapData resData = new ResponseMapData();
        resData.addResponseData("flag", nRres);
        if(nRres > 0 ){
            return resData;
        }else{
            resData.addResponseData("message", "群不存在。");
            return resData;
        }
    }
}
