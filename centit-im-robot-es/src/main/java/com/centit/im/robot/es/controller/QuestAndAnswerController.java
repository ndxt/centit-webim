package com.centit.im.robot.es.controller;

import com.alibaba.fastjson.JSONArray;
import com.centit.framework.common.JsonResultUtils;
import com.centit.framework.common.ResponseMapData;
import com.centit.framework.core.controller.BaseController;
import com.centit.framework.core.dao.PageDesc;
import com.centit.im.robot.es.po.QuestAndAnswer;
import com.centit.im.robot.es.service.QuestAndAnswerManager;
import com.centit.support.algorithm.DatetimeOpt;
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
public class QuestAndAnswerController extends BaseController {

    @Resource
    protected QuestAndAnswerManager questAndAnswerManager;

    /** 条件查询
     * @param request  {@link HttpServletRequest}
     * @param response {@link HttpServletResponse}
     * @return {data:[]}
     */
    @RequestMapping(method = RequestMethod.GET)
    public void list(PageDesc pageDesc, HttpServletRequest request, HttpServletResponse response) {
        Map<String, Object> searchColumn = convertSearchColumn(request);
        JSONArray listObjects = questAndAnswerManager.listObjectsAsJson(searchColumn, pageDesc);
        ResponseMapData resData = new ResponseMapData();
        resData.addResponseData(OBJLIST, listObjects);
        resData.addResponseData(PAGE_DESC, pageDesc);
        JsonResultUtils.writeResponseDataAsJson(resData, response);
    }


    /** 查询详情
     * @param questionId  questionId
     * @param response    {@link HttpServletResponse}
     * @return {data:{}}
     */
    @RequestMapping(value = "/{questionId}", method = {RequestMethod.GET})
    public void getQuestionCatalog(@PathVariable String questionId, HttpServletResponse response) {
        QuestAndAnswer questAndAnswer = questAndAnswerManager.getObjectById(questionId);
        JsonResultUtils.writeSingleDataJson(questAndAnswer, response);
    }

    /**
     * 新增
     * @return
     */
    @RequestMapping(method = {RequestMethod.POST})
    public void createQuestionCatalog(@RequestBody QuestAndAnswer questAndAnswer,
                                      HttpServletResponse response) throws IOException {
        questAndAnswer.setCreateTime(DatetimeOpt.currentUtilDate());
        questAndAnswerManager.saveNewObject(questAndAnswer);
        JsonResultUtils.writeSuccessJson(response);
    }

    /**
     * 删除
     * @param questionId  questionId
     */
    @RequestMapping(value = "/{questionId}", method = {RequestMethod.DELETE})
    public void deleteQuestionCatalog(@PathVariable String questionId, HttpServletResponse response) {
        questAndAnswerManager.deleteObjectById(questionId);
        JsonResultUtils.writeSingleDataJson(questionId,response);
    }

    /**
     * 标记删除
     * @param questionId  questionId
     */
    @RequestMapping(value = "/delete/{questionId}", method = {RequestMethod.DELETE})
    public void deleteQuestionCatalogSign(@PathVariable String questionId, HttpServletResponse response) {
        QuestAndAnswer questAndAnswer = questAndAnswerManager.getObjectById(questionId);
        if (questAndAnswer != null){
            questAndAnswer.setDeleteSign("T");
            questAndAnswerManager.mergeObject(questAndAnswer);
        }else {
            JsonResultUtils.writeErrorMessageJson("当前对象不存在", response);
            return;
        }
        JsonResultUtils.writeSingleDataJson(questionId,response);
    }


    /** 修改
     * @param response    {@link HttpServletResponse}
     */
    @RequestMapping(value = "/{questionId}", method = {RequestMethod.PUT})
    public void updateQuestionCatalog(@PathVariable String questionId,
                                      @RequestBody QuestAndAnswer questAndAnswer,
                                      HttpServletResponse response) throws IOException {
        QuestAndAnswer dbQuestAndAnswer  =
                questAndAnswerManager.getObjectById( questionId);
        if (null != questAndAnswer) {
            dbQuestAndAnswer.copyNotNullProperty(questAndAnswer);
            questAndAnswerManager.mergeObject(dbQuestAndAnswer);
        } else {
            JsonResultUtils.writeErrorMessageJson("当前对象不存在", response);
            return;
        }
        JsonResultUtils.writeBlankJson(response);
    }

}
