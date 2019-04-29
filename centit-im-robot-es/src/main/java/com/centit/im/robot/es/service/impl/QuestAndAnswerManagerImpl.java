package com.centit.im.robot.es.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.centit.framework.jdbc.service.BaseEntityManagerImpl;
import com.centit.im.robot.es.dao.QuestAndAnswerDao;
import com.centit.im.robot.es.po.QuestAndAnswer;
import com.centit.im.robot.es.service.QuestAndAnswerManager;
import com.centit.support.database.utils.PageDesc;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Map;

/**
 * Created by zhang_gd on 2017/9/26.
 */
@Service("questAndAnswerManager")
public class QuestAndAnswerManagerImpl extends BaseEntityManagerImpl<QuestAndAnswer,
        String, QuestAndAnswerDao >
        implements QuestAndAnswerManager {
    @Resource
    private QuestAndAnswerDao questAndAnswerDao;

    public JSONArray listObjectsAsJson(Map<String, Object> searchColumn,PageDesc pageDesc){
        return questAndAnswerDao.listObjectsAsJson(searchColumn,pageDesc);
    }
    public QuestAndAnswer getObjectById(String questionId){
        return questAndAnswerDao.getObjectById(questionId);
    }

    public void saveNewObject(QuestAndAnswer questAndAnswer){
        questAndAnswerDao.saveNewObject(questAndAnswer);
    }

    public void deleteObjectById(String questionId){
        questAndAnswerDao.deleteObjectById(questionId);
    }

    public void deleteQuestionCatalogSign(String questionId){
        QuestAndAnswer questAndAnswer=getObjectById(questionId);
        if (questAndAnswer==null) return;
        questAndAnswer.setDeleteSign("T");
        questAndAnswerDao.mergeObject(questAndAnswer);
    }
    public void updateQuestionCatalog(QuestAndAnswer questAndAnswer){
        QuestAndAnswer dbquestAndAnswer=getObjectById(questAndAnswer.getQuestionId());
        if (dbquestAndAnswer==null) return;
        dbquestAndAnswer.copyNotNullProperty(questAndAnswer);
        questAndAnswerDao.mergeObject(dbquestAndAnswer);
    }

}
