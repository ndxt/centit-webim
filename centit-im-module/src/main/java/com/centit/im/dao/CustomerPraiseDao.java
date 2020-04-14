package com.centit.im.dao;

import com.centit.framework.core.dao.CodeBook;
import com.centit.framework.jdbc.dao.BaseDaoImpl;
import com.centit.im.po.WebImCustomerPraise;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;



/**
 * CustomerPraiseDao  Repository.
 * create by scaffold 2017-05-26
 * @author codefan@sina.com
 * 客服评价null
*/

@Repository
public class CustomerPraiseDao extends BaseDaoImpl<WebImCustomerPraise,java.lang.String>
    {

    public static final Log log = LogFactory.getLog(CustomerPraiseDao.class);

    @Override
    public Map<String, String> getFilterField() {
        Map<String, String> filterField = new HashMap<String, String>();
        filterField.put("praiseId" , CodeBook.EQUAL_HQL_ID);
        filterField.put("osId" , CodeBook.EQUAL_HQL_ID);
        filterField.put("userCode" , CodeBook.EQUAL_HQL_ID);
        filterField.put("customerCode" , CodeBook.EQUAL_HQL_ID);
        filterField.put("serviceSummary" , CodeBook.EQUAL_HQL_ID);
        filterField.put("serviceScore" , CodeBook.EQUAL_HQL_ID);
        filterField.put("createTime" , CodeBook.EQUAL_HQL_ID);
        return filterField;
    }
}
