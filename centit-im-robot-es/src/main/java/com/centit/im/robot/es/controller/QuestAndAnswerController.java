package com.centit.im.robot.es.controller;

import com.centit.framework.common.ResponseData;
import com.centit.framework.core.controller.BaseController;
import com.centit.framework.core.controller.WrapUpResponseBody;
import com.centit.framework.core.dao.PageQueryResult;
import com.centit.im.robot.es.po.QuestAndAnswer;
import com.centit.im.robot.es.service.QuestAndAnswerManager;
import com.centit.search.service.Impl.ESSearcher;
import com.centit.support.algorithm.CollectionsOpt;
import com.centit.support.algorithm.DatetimeOpt;
import com.centit.support.algorithm.NumberBaseOpt;
import com.centit.support.database.utils.PageDesc;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
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
    @Autowired(required = false)
    private ESSearcher esObjectSearcher;

    /**
     * 新增
     *
     * @return
     */
    @ApiOperation(value = "3新增")
    @RequestMapping(value = "/addQuestion", method = {RequestMethod.POST})
    @WrapUpResponseBody
    public ResponseData createQuestionCatalog(@RequestBody QuestAndAnswer questAndAnswer) throws IOException {
        questAndAnswer.setCreateTime(DatetimeOpt.currentUtilDate());
        questAndAnswerManager.saveNewObject(questAndAnswer);

        return ResponseData.makeSuccessResponse();
    }

    /**
     * 删除
     *
     * @param questionId questionId
     */
    @ApiOperation(value = "4删除")
    @RequestMapping(value = "/deleteQuestion/{questionId}", method = {RequestMethod.DELETE})
    @WrapUpResponseBody
    public ResponseData deleteQuestionCatalog(@PathVariable String questionId) {
        questAndAnswerManager.deleteObjectById(questionId);
        return ResponseData.makeSuccessResponse();
    }

    /**
     * 修改
     *
     */
    @ApiOperation(value = "6修改")
    @RequestMapping(value = "/updateQuestion", method = {RequestMethod.PUT})
    @WrapUpResponseBody
    public void updateQuestionCatalog(
            @RequestBody QuestAndAnswer questAndAnswer) {
        questAndAnswerManager.updateQuestionCatalog(questAndAnswer);
    }

    @ApiOperation(value = "7es精确查询")
    @RequestMapping(value = "/listES/{map}/{value}/{queryWord}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public PageQueryResult<Map<String, Object>> listEs(String map,String value,String queryWord, PageDesc pageDesc) {
        Pair<Long, List<Map<String, Object>>> res = esObjectSearcher.search(CollectionsOpt.createHashMap(map, value),queryWord, pageDesc.getPageNo(), pageDesc.getPageSize());
        pageDesc.setTotalRows(NumberBaseOpt.castObjectToInteger(res.getLeft()));
        return PageQueryResult.createResult(res.getRight(), pageDesc);
    }
    @ApiOperation(value = "8es查询")
    @RequestMapping(value = "/listESall/{queryWord}", method = RequestMethod.GET)
    @WrapUpResponseBody
    public PageQueryResult<Map<String, Object>> listEsAll(String queryWord, PageDesc pageDesc) {
        Pair<Long, List<Map<String, Object>>> res = esObjectSearcher.search(queryWord, pageDesc.getPageNo(), pageDesc.getPageSize());
        pageDesc.setTotalRows(NumberBaseOpt.castObjectToInteger(res.getLeft()));
        return PageQueryResult.createResult(res.getRight(), pageDesc);
    }
}
