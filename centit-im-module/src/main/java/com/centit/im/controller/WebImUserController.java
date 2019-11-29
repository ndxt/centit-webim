package com.centit.im.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.centit.fileserver.common.FileStore;
import com.centit.framework.common.ResponseData;
import com.centit.framework.common.ResponseMapData;
import com.centit.framework.common.WebOptUtils;
import com.centit.framework.core.controller.BaseController;
import com.centit.framework.core.controller.WrapUpContentType;
import com.centit.framework.core.controller.WrapUpResponseBody;
import com.centit.framework.model.basedata.IUnitInfo;
import com.centit.im.po.WebImCustomer;
import com.centit.im.po.WebImFriendMemo;
import com.centit.im.po.WebImGroup;
import com.centit.im.po.WebImGroupMember;
import com.centit.im.service.WebImUserManager;
import com.centit.support.algorithm.CollectionsOpt;
import com.centit.support.algorithm.StringBaseOpt;
import com.centit.support.image.ImageOpt;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.image.RenderedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

/**
 * Created by codefan on 17-5-26.
 */
@Controller
@RequestMapping("/webimcust")
@Api(value = "用户管理接口", tags = "用户管理接口")
public class WebImUserController extends BaseController {

    @Autowired
    protected WebImUserManager webImUserManager;

    @Autowired
    protected FileStore fileStore;

    //配置用户信息
    @ApiOperation(value = "01配置用户信息")
    @RequestMapping(value = "/friend", method = RequestMethod.POST)
    @WrapUpResponseBody
    public ResponseData setFriendMemo(
            @RequestBody WebImFriendMemo memo) {
        webImUserManager.saveUserFriendMemo(memo);
        return ResponseData.makeSuccessResponse();
    }

    /**
     * 注册用户 返回 token
     * @param user 用户信息
     * @return ResponseData
     */
    @ApiOperation(value = "02注册用户")

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
     * @return 所有联系人
     */
    @ApiOperation(value = "03查询用户列表")
    @RequestMapping(value = "/listUser", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<WebImCustomer> listAllUser() {
        return  webImUserManager.listAllUser();
    }

    @ApiOperation(value = "04查询机构列表")
    @RequestMapping(value = "/allUnit",
            method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<? extends IUnitInfo> listAllUnits() {
        List<? extends IUnitInfo> allUnits = webImUserManager.listAllUnit();
        if(allUnits==null || allUnits.isEmpty()){
            return allUnits;
        }
        CollectionsOpt.sortAsTree(allUnits,
                ( p,  c) -> StringUtils.equals(p.getUnitCode(),c.getParentUnit()) );
        return allUnits;
    }

    /**
     * 获取下层机构
     * @param parentUnitCode 父机构代码
     * @return 下层机构
     */
    @ApiOperation(value = "05查询下层机构列表")
    @ApiImplicitParam(
            name = "parentUnitCode", value = "机构代码；‘0’表示顶层机构",
            required = true, paramType = "path", dataType = "String")
    @RequestMapping(value = "/subUnit/{parentUnitCode}",
            method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<? extends IUnitInfo> listSubUnits(@PathVariable String parentUnitCode) {
        List<? extends IUnitInfo> allUnits = webImUserManager.listSubUnit(parentUnitCode);
        if(allUnits==null || allUnits.isEmpty()){
            return allUnits;
        }
        //IUnitInfo::getUnitOrder 这个可能为null所以如果排序这个排序方法要重写
        //Collections.sort(allUnits, Comparator.comparing(IUnitInfo::getUnitOrder));
        return allUnits;
    }
    /**
     * 返回联系人信息
     * @param userCode 用户代码
     * @return 用户信息
     */
    @ApiOperation(value = "06查询联系人信息")
    @RequestMapping(value = "/user/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public WebImCustomer getUser(@PathVariable String userCode) {
        return webImUserManager.getUser(userCode);
    }

    /**
     * 返回客服专家（客服模式）所有服务的对象
     * @param serviceUserCode 客服代码
     * @param lastServiceDate   最后服务时间，如果为null默认为 一个月内服务过的人员
     * @return 所有服务的对象
     */
    @ApiOperation(value = "07查询所有服务的对象")
    @RequestMapping(value = "/cust/{serviceUserCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<WebImCustomer> listServiceCustomer(@PathVariable String serviceUserCode,
                                    Date lastServiceDate) {
        return webImUserManager.listServiceCustomer(serviceUserCode,lastServiceDate);
    }

    /**
     * @return 返回所有客服专家（客服模式）
     *
     */
    @ApiOperation(value = "08查询所有客服专家")
    @RequestMapping(value = "/services", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<WebImCustomer> listCustomerService() {
        return webImUserManager.listCustomerService();
    }

    /**
     * @return 返回系统联系状态
     *
     */
    @ApiOperation(value = "09查询系统联系状态")
    @RequestMapping(value = "/userState", method = RequestMethod.GET)
    @WrapUpResponseBody
    public Map<String,String> listAllUserState() {
        return webImUserManager.listAllUserState();
    }

    /**
     * @return 返回用户的群组（机构）
     * @param userCode 用户代码
     */
    @ApiOperation(value = "10查询用户的机构（内置的和组织机构一致的群）")
    @RequestMapping(value = "/userUnits/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<IUnitInfo>  listUserUnit(@PathVariable String userCode) {
        return webImUserManager.listUserUnits(userCode);

    }

    /**
     * @return  返回机构中的成员
     * @param unitCode 机构代码
     */
    @ApiOperation(value = "11查询机构中的成员")
    @RequestMapping(value = "/unitUsers/{unitCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<WebImCustomer> listUnitUsers(@PathVariable String unitCode) {
        return webImUserManager.listUnitUsers(unitCode);
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
     * @return 返回用户的群
     * @param userCode 用户代码
     */
    @ApiOperation(value = "13查询用户的机构（内置的和组织机构一致的群）")
    @RequestMapping(value = "/userGroups/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<WebImGroup> listUserGroups(@PathVariable String userCode) {
        return webImUserManager.listUserGroups(userCode);

    }

    /**
     * @return 创建群 接收用户数组
     * @param request  HttpServletRequest
     * @param groupJson 用户数组
     */
    @ApiOperation(value = "14创建群及用户数组")
    @ApiImplicitParam(
            name = "groupJson", value = "json格式，群组信息，添加了一个额外的属性“members”为群成员用户代码数值",
            paramType = "body", dataTypeClass = WebImGroup.class)
    @RequestMapping(value = "/group", method = RequestMethod.POST)
    @WrapUpResponseBody
    public WebImGroup createGroup(
            @RequestBody String groupJson,
            HttpServletRequest request) {
        JSONObject jsonObject = JSON.parseObject(groupJson);
        WebImGroup webImGroup = WebImGroup.createFromJson(jsonObject);
        String currentUserCode = WebOptUtils.getCurrentUserCode(request);
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
     *  @return 修改群基本信息
     *  @param groupJson 用户数组
     */
    @ApiOperation(value = "15修改群基本信息")
    @RequestMapping(value = "/group", method = RequestMethod.PUT)
    @WrapUpResponseBody
    public ResponseData updateGroupInfo(
            @RequestBody String groupJson) {

        WebImGroup webImGroup = WebImGroup.createFromJsonString(groupJson);

        webImUserManager.updateGroupInfo(webImGroup);
        return ResponseData.makeSuccessResponse();
    }

    /**
     * @return  申请加入群
     * @param memberCode 成员代码
     * @param groupId 组Id
     *
     */
    @ApiOperation(value = "16申请加入群")
    @RequestMapping(value = "/member/{groupId}/{memberCode}", method = RequestMethod.PUT)
    @WrapUpResponseBody
    public ResponseData addGroupMember(
            @PathVariable String groupId,
            @PathVariable String memberCode) {

        webImUserManager.addGroupMember(groupId,memberCode);
        return ResponseData.makeSuccessResponse();
    }

    /**
     *  @return  更新所有群成员
     * @param groupId 组Id
     * @param membersJsonStr [["123"],["234"]]
     */
    @ApiOperation(value = "17更新所有群成员")
    @RequestMapping(value = "/member/{groupId}", method = RequestMethod.PUT)
    @WrapUpResponseBody
    public ResponseData updateGroupMembers(
            @PathVariable String groupId,
            @RequestBody String membersJsonStr) {
        JSONArray ja = JSON.parseArray(membersJsonStr);
        webImUserManager.updateGroupMembers(groupId,
                CollectionsOpt.listToArray(StringBaseOpt.objectToStringList(ja)));
        return ResponseData.makeSuccessResponse();
    }

    /**
     * @return 修改一个群成员信息
     * @param memberInfoJson 成员
     *
     */
    @ApiOperation(value = "18修改群成员信息")
    @RequestMapping(value = "/member", method = RequestMethod.PUT)
    @WrapUpResponseBody
    public ResponseData updateGroupMember(
            @RequestBody String memberInfoJson) {

        webImUserManager.updateGroupMemberInfo(
                WebImGroupMember.createFromJson(JSON.parseObject(memberInfoJson)));
        return ResponseData.makeSuccessResponse();
    }

    /**
     * @return 获取群成员信息
     * @param groupId 组Id
     *
     */
    @ApiOperation(value = "19获取群成员信息")
    @RequestMapping(value = "/member/{groupId}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<WebImGroupMember> listGroupMembers(
            @PathVariable String groupId) {

        return webImUserManager.listGroupMembers(groupId);
    }

    /**
     * @return 获取群基本信息
     * @param groupId 组Id
     *
     */
    @ApiOperation(value = "20获取群基本信息")
    @RequestMapping(value = "/group/{groupId}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public WebImGroup getGroupInfo(
            @PathVariable String groupId) {

        return  webImUserManager.getGroupInfo(groupId);
    }

    /**
     * @return 退出群
     * @param memberCode 成员代码
     * @param groupId 组ID
     *
     */
    @ApiOperation(value = "21退出群")
    @RequestMapping(value = "/quitGroup/{groupId}/{memberCode}", method = RequestMethod.PUT)
    @WrapUpResponseBody
    public ResponseData removeGroupMember(
            @PathVariable String groupId,
            @PathVariable String memberCode) {
        webImUserManager.removeGroupMember(groupId,memberCode);
        return ResponseData.makeSuccessResponse();
    }

    /**
     * @return 退群
     * @param groupId 组ID
     * @param userCode 操作用户代码
     *
     */
    @ApiOperation(value = "22用户退群")
    @RequestMapping(value = "/dissolveGroup/{groupId}/{userCode}", method = RequestMethod.PUT)
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
     * @return 删除群（解散）
     * @param groupId 组ID
     * @param userCode 操作用户代码
     *
     */
    @ApiOperation(value = "23删除（解散）群")
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

    @ApiOperation(value = "24 获取用户头像")
    @RequestMapping(value = "/sculpture/{userCode}", method = RequestMethod.GET)
    @WrapUpResponseBody(contentType = WrapUpContentType.IMAGE)
    public RenderedImage getHeadSculpture(@PathVariable String userCode, Integer size, Integer point) {
        String headFileId = null;
        WebImCustomer user = webImUserManager.getUser(userCode);
        if(user != null){
            headFileId = user.getHeadSculpture();
        }
        if(StringUtils.length(headFileId) > 35){
            Pair<String, Long> md5Size = FileController.fetchMd5andSize(headFileId);
            try(InputStream inputStream = fileStore.loadFileStream(md5Size.getLeft(), md5Size.getRight())) {
                return ImageIO.read(inputStream);
            } catch (IOException e) {
                logger.error(e.getMessage());
            }
        }
        if(size == null){
            size = 60;
        }

        if(point == null){
            point = 12;
        }
        return ImageOpt.createIdIcon(userCode, size, point);
    }

    /**
     * 返回所有服务过用户的 客服专家（客服模式）
     * @param custCode 用户代码
     * @param lastServiceDate  最后服务时间，如果为null默认为 一个月内服务过的人员
     * @return 所有服务的对象
     */
    @ApiOperation(value = "25查询和用户交流过的所有客服")
    @RequestMapping(value = "/services/{custCode}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public List<WebImCustomer> listCustomerService(@PathVariable String custCode,
                                                   Date lastServiceDate) {
        return webImUserManager.listCustomerService(custCode, lastServiceDate);
    }

}
