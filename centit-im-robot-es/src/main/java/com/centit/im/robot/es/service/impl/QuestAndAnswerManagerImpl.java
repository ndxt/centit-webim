package com.centit.im.robot.es.service.impl;

import com.centit.framework.common.ObjectException;
import com.centit.im.robot.es.po.QuestAndAnswer;
import com.centit.im.robot.es.service.QuestAndAnswerManager;
import com.centit.search.service.Impl.ESIndexer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("questAndAnswerManager")
public class QuestAndAnswerManagerImpl implements QuestAndAnswerManager {
    @Autowired(required = false)
    private ESIndexer esObjectIndexer;


    public void saveNewObject(QuestAndAnswer questAndAnswer) {
        if (esObjectIndexer.saveNewDocument(questAndAnswer) == null) {
            throw new ObjectException(500, "elasticsearch操作失败");
        }
    }


    public void deleteObjectById(String docId) {
        if (!esObjectIndexer.deleteDocument(docId)) {
            throw new ObjectException(500, "elasticsearch操作失败");
        }
    }


    public void updateQuestionCatalog(QuestAndAnswer questAndAnswer) {
        if (esObjectIndexer.mergeDocument(questAndAnswer) == null) {
            throw new ObjectException(500, "elasticsearch操作失败");
        }
    }
}
