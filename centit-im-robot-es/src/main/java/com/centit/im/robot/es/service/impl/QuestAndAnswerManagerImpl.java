package com.centit.im.robot.es.service.impl;

import com.centit.framework.hibernate.service.BaseEntityManagerImpl;
import com.centit.im.robot.es.dao.QuestAndAnswerDao;
import com.centit.im.robot.es.po.QuestAndAnswer;
import com.centit.im.robot.es.service.QuestAndAnswerManager;
import org.springframework.stereotype.Service;

/**
 * Created by zhang_gd on 2017/9/26.
 */
@Service("questAndAnswerManager")
public class QuestAndAnswerManagerImpl extends BaseEntityManagerImpl<QuestAndAnswer,
        String, QuestAndAnswerDao >
        implements QuestAndAnswerManager {
}
