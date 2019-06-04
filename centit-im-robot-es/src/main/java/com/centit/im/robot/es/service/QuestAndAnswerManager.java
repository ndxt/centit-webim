package com.centit.im.robot.es.service;

import com.alibaba.fastjson.JSONArray;
import com.centit.framework.common.ObjectException;
import com.centit.framework.jdbc.service.BaseEntityManager;
import com.centit.im.robot.es.po.QuestAndAnswer;
import com.centit.search.service.ESServerConfig;
import com.centit.search.service.Impl.ESIndexer;
import com.centit.support.database.utils.PageDesc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by zhang_gd on 2017/9/26.
 */

public interface QuestAndAnswerManager {
    void saveNewObject(QuestAndAnswer questAndAnswer);
    void deleteObjectById(String docId);
    void updateQuestionCatalog(QuestAndAnswer questAndAnswer);
}
