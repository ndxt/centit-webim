package com.centit.im.web.service.impl;

import com.centit.framework.hibernate.service.BaseEntityManagerImpl;
import com.centit.im.web.dao.QuestAndAnswerDao;
import com.centit.im.web.po.QuestAndAnswer;
import com.centit.im.web.service.QuestAndAnswerManager;
import org.springframework.stereotype.Service;

/**
 * Created by zhang_gd on 2017/9/26.
 */
@Service("questAndAnswerManager")
public class QuestAndAnswerManagerImpl extends BaseEntityManagerImpl<QuestAndAnswer,
        String,QuestAndAnswerDao>
        implements QuestAndAnswerManager {
}
