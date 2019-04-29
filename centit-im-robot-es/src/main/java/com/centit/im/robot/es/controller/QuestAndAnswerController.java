package com.centit.im.robot.es.controller;

import com.alibaba.fastjson.JSONArray;
import com.centit.framework.common.JsonResultUtils;
import com.centit.framework.common.ResponseData;
import com.centit.framework.common.ResponseMapData;
import com.centit.framework.core.controller.BaseController;
import com.centit.framework.core.controller.WrapUpResponseBody;
import com.centit.support.database.utils.PageDesc;
import com.centit.im.robot.es.po.QuestAndAnswer;
import com.centit.im.robot.es.service.QuestAndAnswerManager;
import com.centit.support.algorithm.DatetimeOpt;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Created by zhang_gd on 2017/9/26.
 */
@Controller
@RequestMapping("/questAndAnswer")
@Api(value = "robot", tags = "robot")
public class QuestAndAnswerController extends BaseController {

    @Resource
    protected QuestAndAnswerManager questAndAnswerManager;

    /** 条件查询
     * @param request  {@link HttpServletRequest}
     *
     * @return {data:[]}
     */
    @ApiOperation(value = "1条件查询")
    @RequestMapping(value = "/listAll",method = RequestMethod.GET)
    @WrapUpResponseBody
    public JSONArray list(PageDesc pageDesc, HttpServletRequest request) {
        Map<String, Object> searchColumn = convertSearchColumn(request);
        return questAndAnswerManager.listObjectsAsJson(searchColumn, pageDesc);
    }


    /** 查询详情
     * @param questionId  questionId
     *
     * @return {data:{}}
     */
    @ApiOperation(value = "2查询详情")
    @RequestMapping(value = "/list/{questionId}", method = {RequestMethod.GET})
    @WrapUpResponseBody
    public QuestAndAnswer getQuestionCatalog(@PathVariable String questionId) {
        return questAndAnswerManager.getObjectById(questionId);
    }

    /**
     * 新增
     * @return
     */
    @ApiOperation(value = "3新增")
    @RequestMapping(value="/addQuestion",method = {RequestMethod.POST})
    @WrapUpResponseBody
    public ResponseData createQuestionCatalog(@RequestBody QuestAndAnswer questAndAnswer) throws IOException {
        questAndAnswer.setCreateTime(DatetimeOpt.currentUtilDate());
        questAndAnswerManager.saveNewObject(questAndAnswer);
        return ResponseData.makeSuccessResponse();
    }

    /**
     * 删除
     * @param questionId  questionId
     */
    @ApiOperation(value = "4删除")
    @RequestMapping(value = "/deleteQuestion/{questionId}", method = {RequestMethod.DELETE})
    @WrapUpResponseBody
    public ResponseData deleteQuestionCatalog(@PathVariable String questionId) {
        questAndAnswerManager.deleteObjectById(questionId);
        return ResponseData.makeSuccessResponse();
    }

    /**
     * 标记删除
     * @param questionId  questionId
     */
    @ApiOperation(value = "5标记删除")
    @RequestMapping(value = "/delete/{questionId}", method = {RequestMethod.DELETE})
    @WrapUpResponseBody
    public ResponseData deleteQuestionCatalogSign(@PathVariable String questionId) {
        questAndAnswerManager.deleteQuestionCatalogSign(questionId);
        return ResponseData.makeSuccessResponse();
    }


    /** 修改
     * @param response    {@link HttpServletResponse}
     */
    @ApiOperation(value = "6修改")
    @RequestMapping(value = "/updateQuestion", method = {RequestMethod.PUT})
    @WrapUpResponseBody
    public ResponseData updateQuestionCatalog(
                                      @RequestBody QuestAndAnswer questAndAnswer,
                                      HttpServletResponse response) throws IOException {

        questAndAnswerManager.updateQuestionCatalog( questAndAnswer);
        return ResponseData.makeSuccessResponse();
    }

}
