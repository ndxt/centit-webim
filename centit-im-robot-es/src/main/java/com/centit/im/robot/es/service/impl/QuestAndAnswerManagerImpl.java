package com.centit.im.robot.es.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.centit.framework.jdbc.service.BaseEntityManagerImpl;
import com.centit.im.robot.es.dao.QuestAndAnswerDao;
import com.centit.im.robot.es.po.QuestAndAnswer;
import com.centit.im.robot.es.service.QuestAndAnswerManager;
import com.centit.search.service.ESServerConfig;
import com.centit.search.service.Indexer;
import com.centit.search.service.IndexerSearcherFactory;
import com.centit.search.service.Searcher;
import com.centit.support.algorithm.StringBaseOpt;
import com.centit.support.database.utils.PageDesc;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
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
    private ESServerConfig esServerConfig;
    private Indexer indexer;
    private Searcher searcher;
    public void setEsServerConfig(ESServerConfig esServerConfig) {
        this.esServerConfig = esServerConfig;

    }


    public JSONArray listObjectsAsJson(Map<String, Object> searchColumn,PageDesc pageDesc){

       return questAndAnswerDao.listObjectsAsJson(searchColumn,pageDesc);
    }
    public JSONArray listESsAsJson(String question,PageDesc pageDesc){
        if(searcher==null) {
            searcher = IndexerSearcherFactory.obtainSearcher(esServerConfig, QuestAndAnswer.class);
        }

        Pair<Long,List<Map<String, Object>>> questiosns = searcher.search(question,pageDesc.getPageNo(),pageDesc.getPageSize());
        JSONArray ja = new JSONArray();
        for(Map<String, Object> q : questiosns.getRight()){
            JSONObject jo =new JSONObject();
            jo.put("questionId", StringBaseOpt.objectToString(q.get("keyWords")));
            jo.put("keyWords", StringBaseOpt.objectToString(q.get("questionId")));
            jo.put("questionTitle", StringBaseOpt.objectToString(q.get("questionTitle")));
            jo.put("questionAnswer", StringBaseOpt.objectToString(q.get("questionAnswer")));
            ja.add(jo);
        }
        return ja;

    }
    public QuestAndAnswer getObjectById(String questionId){
        return questAndAnswerDao.getObjectById(questionId);
    }

    public void saveNewObject(QuestAndAnswer questAndAnswer){
        questAndAnswerDao.saveNewObject(questAndAnswer);
        if (indexer==null){
            indexer = IndexerSearcherFactory.obtainIndexer(
                    esServerConfig, QuestAndAnswer.class);}
        if (indexer!=null){
            indexer.saveNewDocument(questAndAnswer);
        }
    }

    public void deleteObjectById(String questionId){
        QuestAndAnswer questAndAnswer=getObjectById(questionId);
        if (questAndAnswer==null) return;
        questAndAnswerDao.deleteObjectById(questionId);
        if (indexer==null){
            indexer = IndexerSearcherFactory.obtainIndexer(
                    esServerConfig, QuestAndAnswer.class);}
        if (indexer!=null){
            indexer.deleteDocument(questAndAnswer);
        }
    }

    public void deleteQuestionCatalogSign(String questionId){
        QuestAndAnswer questAndAnswer=getObjectById(questionId);
        if (questAndAnswer==null) return;
        questAndAnswer.setDeleteSign("T");
        questAndAnswerDao.mergeObject(questAndAnswer);
        if (indexer==null){
            indexer = IndexerSearcherFactory.obtainIndexer(
                    esServerConfig, QuestAndAnswer.class);}
        if (indexer!=null){
            indexer.deleteDocument(questAndAnswer);
        }
    }
    public void updateQuestionCatalog(QuestAndAnswer questAndAnswer){
        QuestAndAnswer dbquestAndAnswer=getObjectById(questAndAnswer.getQuestionId());
        if (dbquestAndAnswer==null) return;
        dbquestAndAnswer.copyNotNullProperty(questAndAnswer);
        questAndAnswerDao.mergeObject(dbquestAndAnswer);
        if (indexer==null){
            indexer = IndexerSearcherFactory.obtainIndexer(
                    esServerConfig, QuestAndAnswer.class);}
        if (indexer!=null){
            indexer.mergeDocument(dbquestAndAnswer);
        }
    }

}
