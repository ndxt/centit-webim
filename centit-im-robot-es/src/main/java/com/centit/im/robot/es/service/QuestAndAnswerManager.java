package com.centit.im.robot.es.service;

import com.alibaba.fastjson.JSONArray;
import com.centit.im.robot.es.po.QuestAndAnswer;
import com.centit.support.database.utils.PageDesc;

import java.util.Map;

/**
 * Created by zhang_gd on 2017/9/26.
 */

public interface QuestAndAnswerManager {
    void saveNewObject(QuestAndAnswer questAndAnswer);

    void deleteObjectById(String docId);

    void updateQuestionCatalog(QuestAndAnswer questAndAnswer);

}
