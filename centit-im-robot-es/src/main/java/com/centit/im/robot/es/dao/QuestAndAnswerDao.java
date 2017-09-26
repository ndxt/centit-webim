package com.centit.im.robot.es.dao;

import com.centit.framework.core.dao.CodeBook;
import com.centit.framework.hibernate.dao.BaseDaoImpl;
import com.centit.im.robot.es.po.QuestAndAnswer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhang_gd on 2017/9/26.
 */
@Repository
public class QuestAndAnswerDao extends BaseDaoImpl<QuestAndAnswer,String> {

    public static final Log logger = LogFactory.getLog(QuestAndAnswerDao.class);

    @Override
    public Map<String, String> getFilterField() {
        if( filterField == null){
            filterField = new HashMap<String, String>();

            filterField.put("questionId" , CodeBook.EQUAL_HQL_ID);

            filterField.put("osId" , CodeBook.EQUAL_HQL_ID);

            filterField.put("optId" , CodeBook.EQUAL_HQL_ID);

            filterField.put("deleteSign" , CodeBook.EQUAL_HQL_ID);

            filterField.put("questionTitle" , CodeBook.EQUAL_HQL_ID);

            filterField.put("keyWords" , CodeBook.EQUAL_HQL_ID);

            filterField.put("questionUrl" , CodeBook.EQUAL_HQL_ID);

            filterField.put("questionAnswer" , CodeBook.EQUAL_HQL_ID);

            filterField.put("createTime" , CodeBook.EQUAL_HQL_ID);

            filterField.put("creator" , CodeBook.EQUAL_HQL_ID);

            filterField.put("lastUpdateTime" , CodeBook.EQUAL_HQL_ID);
        }
        return filterField;
    }
}
