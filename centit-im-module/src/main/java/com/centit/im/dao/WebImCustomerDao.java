package com.centit.im.dao;

import com.centit.framework.core.dao.CodeBook;
import com.centit.framework.jdbc.dao.BaseDaoImpl;
import com.centit.im.po.WebImCustomer;
import com.centit.support.algorithm.DatetimeOpt;
import com.centit.support.database.utils.QueryUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * WebImCustomerDao  Repository.
 * create by scaffold 2017-05-23
 * @author codefan@sina.com
 * 匿名用户（ 用于客服模式）匿名用户（ 用于客服模式）

用户的ID为 各个系统的用户ID ，或者由前端根据 前端的硬件属性生产一个唯一的编号
*/

@Repository
public class WebImCustomerDao extends BaseDaoImpl<WebImCustomer,String>
    {

    public static final Log log = LogFactory.getLog(WebImCustomerDao.class);

    @Override
    public Map<String, String> getFilterField() {
        if( filterField == null){
            filterField = new HashMap<String, String>();

            filterField.put("osId" , CodeBook.EQUAL_HQL_ID);

            filterField.put("userCode" , CodeBook.EQUAL_HQL_ID);


            filterField.put("userName" , CodeBook.EQUAL_HQL_ID);

            filterField.put("customerService" , CodeBook.EQUAL_HQL_ID);

            filterField.put("creator" , CodeBook.EQUAL_HQL_ID);

            filterField.put("createTime" , CodeBook.EQUAL_HQL_ID);

        }
        return filterField;
    }

    public List<WebImCustomer> listCustByType (String userType) {
         return this.listObjectsByFilter("where USER_TYPE = ?",new Object[]{userType});
    }

    public List<WebImCustomer> listCustomerService() {
        return this.listObjectsByFilter(" where USER_TYPE = 'S' or USER_TYPE = 'P'", new Object[]{});
    }

    public List<WebImCustomer> listCustomerServiceByOptId(String optId) {
        return this.listObjectsByFilter(
                "where (USER_TYPE = 'S' or USER_TYPE = 'P') and SERVICE_OPTS like ? ",
                new Object[]{"%"+optId+"%"});
    }


    public List<WebImCustomer> listServiceCustomer(String serviceUserCode, Date lastServiceDate) {
        Date lsd = lastServiceDate==null? DatetimeOpt.addMonths(
                DatetimeOpt.currentUtilDate(),-1) :lastServiceDate;
        String sql = "select b.USER_CODE,b.OS_ID,b.USER_TYPE,b.USER_NAME,b.HEAD_SCULPTURE,b.CUSTOMER_SERVICE," +
                " b.LAST_ACTIVE_DATE,b.CREATOR,b.Service_Opts,b.CREATE_TIME " +
                " from f_web_im_customer b " +
                " where exists ( SELECT * FROM f_web_im_message f" +
                "       where ((f.SENDER = b.USER_CODE and f.RECEIVER= :serviceCode ) or" +
                " (f.SENDER= :serviceCode and f.RECEIVER = b.USER_CODE)) and f.SEND_TIME >= :serviceDate) " +
                " and b.USER_TYPE = 'C' " + // 客户
                " ORDER BY b.LAST_ACTIVE_DATE ";
        return this.listObjectsBySql(sql, QueryUtils.createSqlParamsMap(
                "serviceCode",serviceUserCode,"serviceDate",lsd));
    }

    public List<WebImCustomer> listCustomerService(String custCode, Date lastServiceDate) {
        Date lsd = lastServiceDate==null? DatetimeOpt.addMonths(
                DatetimeOpt.currentUtilDate(),-1) :lastServiceDate;
        String sql = "select b.USER_CODE,b.OS_ID,b.USER_TYPE,b.USER_NAME,b.HEAD_SCULPTURE,b.CUSTOMER_SERVICE," +
                " b.LAST_ACTIVE_DATE,b.CREATOR,b.Service_Opts,b.CREATE_TIME " +
                " from f_web_im_customer b " +
                " where exists ( SELECT * FROM f_web_im_message f" +
                "       where ((f.SENDER = b.USER_CODE and f.RECEIVER= :custCode ) or" +
                " (f.SENDER= :custCode and f.RECEIVER = b.USER_CODE)) and f.SEND_TIME >= :serviceDate) " +
                " and ( b.USER_TYPE = 'S' or b.USER_TYPE = 'P' ) " + // 客服 或者 专家
                " ORDER BY b.LAST_ACTIVE_DATE ";
        return this.listObjectsBySql(sql, QueryUtils.createSqlParamsMap(
                "custCode", custCode,"serviceDate",lsd));
    }

    }
