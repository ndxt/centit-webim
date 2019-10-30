package com.centit.im.robot.es.service;

import com.centit.im.robot.es.po.QuestAndAnswer;

/**
 * Created by zhang_gd on 2017/9/26.
 */

public interface QuestAndAnswerManager {
    void saveNewObject(QuestAndAnswer questAndAnswer);

    void deleteObjectById(String docId);

    void updateQuestionCatalog(QuestAndAnswer questAndAnswer);

}
