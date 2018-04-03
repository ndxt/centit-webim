package com.centit.im.dao;

import com.alibaba.fastjson.JSONArray;
import com.centit.framework.core.dao.CodeBook;
import com.centit.framework.core.dao.PageDesc;
import com.centit.framework.hibernate.dao.BaseDaoImpl;
import com.centit.framework.hibernate.dao.DatabaseOptUtils;
import com.centit.im.po.WebImMessage;
import com.centit.support.algorithm.DatetimeOpt;
import com.centit.support.algorithm.NumberBaseOpt;
import com.centit.support.algorithm.StringBaseOpt;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * WebImMessageDao  Repository.
 * create by scaffold 2017-05-23
 * @author codefan@sina.com
 * 消息记录null
*/

@Repository
public class WebImMessageDao extends BaseDaoImpl<WebImMessage,java.lang.String>
{

	public static final Log log = LogFactory.getLog(WebImMessageDao.class);

	@Override
	public Map<String, String> getFilterField() {
		if( filterField == null){
			filterField = new HashMap<String, String>();

			filterField.put("msgId" , CodeBook.EQUAL_HQL_ID);

			filterField.put("osId" , CodeBook.EQUAL_HQL_ID);

			filterField.put("msgType" , CodeBook.EQUAL_HQL_ID);

			filterField.put("sender" , CodeBook.EQUAL_HQL_ID);

			filterField.put("receiver" , CodeBook.EQUAL_HQL_ID);

			filterField.put("sendTime" , CodeBook.EQUAL_HQL_ID);

			filterField.put("msgState" , CodeBook.EQUAL_HQL_ID);

			filterField.put("content" , CodeBook.EQUAL_HQL_ID);

		}
		return filterField;
	}

    public List<WebImMessage> listChatMessage(String sender,String receiver,
                                              Date lastReadDate, PageDesc pageDesc) {
        Date lrd = lastReadDate==null? DatetimeOpt.currentUtilDate():lastReadDate;
        String sql = "FROM WebImMessage f " +
                "WHERE 1=1 AND f.sendTime <= ? " +
                "AND (f.sender = ? AND f.receiver = ?) OR (f.sender = ? AND f.receiver = ?) " +
                "ORDER BY f.sendTime DESC ";
        return this.listObjects( sql,
                new Object[]{lrd,sender,receiver,receiver,sender}, pageDesc);
    }

    public List<WebImMessage> listAllChatMessage(String receiver,
                                                 Date lastReadDate, PageDesc pageDesc) {
        Date lrd = lastReadDate==null? DatetimeOpt.currentUtilDate():lastReadDate;
        String sql = "FROM WebImMessage f " +
                "WHERE 1=1 AND f.sendTime <= ? AND ( f.receiver = ?  OR f.sender = ?) " +
                "ORDER BY f.sendTime DESC";
        return this.listObjects( sql,
                new Object[]{lrd,receiver,receiver}, pageDesc);
    }


    public List<WebImMessage> listGroupChatMessage(String unitCode,
                                                   Date lastReadDate, PageDesc pageDesc) {
        Date lrd = lastReadDate==null? DatetimeOpt.currentUtilDate():lastReadDate;
        String sql = "FROM WebImMessage f " +
                "WHERE f.sendTime <= ? AND f.receiver = ? AND f.msgType = 'G' " +
                "ORDER BY f.sendTime DESC";
        return  this.listObjects( sql,
                new Object[]{lrd,unitCode}, pageDesc);
    }

    @Transactional(propagation= Propagation.MANDATORY)
    public int updateReadState(String sender,String receiver){
        String sql = "UPDATE WebImMessage f " +
                "SET f.msgState='C' " +
                "WHERE f.msgState='U' AND f.receiver=? AND f.sender=?";
        return DatabaseOptUtils.doExecuteHql( this, sql, new Object[] {receiver,sender});
    }

    @Transactional(propagation= Propagation.MANDATORY)
    public int updateReadState(String receiver){
        String sql = "UPDATE WebImMessage f " +
                "SET f.msgState='C' " +
                "WHERE f.msgState='U' AND f.receiver=? ";
        return DatabaseOptUtils.doExecuteHql( this, sql, new Object[] {receiver});
    }

    public Map<String, Integer> statUnreadMsg(String receiver){
        String sql = "select v.SENDER, v.UNREAD_SUM  from  F_V_UNREAD_CHAT_MSG v where  v.RECEIVER= ? ";
        List<Object[]> jsonArray = (List<Object[]>) DatabaseOptUtils.findObjectsBySql(this,sql, new Object[] {receiver}, new PageDesc(-1, -1));
        Map<String, Integer> map = new HashMap<>(jsonArray.size() * 2);
        for(Object[] obj : jsonArray){
            map.put( StringBaseOpt.objectToString(obj[0]),
                    NumberBaseOpt.castObjectToInteger(obj[1] ));
        }
        return map;
    }


    public  Map<String, Integer> statGroupUnreadMsg(String userCode){
        String sql = "select v.UNIT_CODE, v.UNREAD_SUM  from  F_V_UNREAD_GROUP_MSG v where v.USER_CODE = ?";
        List<Object[]> jsonArray = (List<Object[]>) DatabaseOptUtils.findObjectsBySql(this,sql, new Object[] {userCode}, new PageDesc(-1, -1));
        Map<String, Integer> map = new HashMap<>(jsonArray.size() * 2);
        for(Object[] obj : jsonArray){
            map.put( StringBaseOpt.objectToString(obj[0]),
                    NumberBaseOpt.castObjectToInteger(obj[1] ));
        }
        return map;
    }

    public JSONArray statUnreadWithLastMsg(String receiver){
        String sql = "select v.SENDER, v.RECEIVER, v.UNREAD_SUM, v.SEND_TIME," +
                "v.MSG_ID, v.MSG_TYPE, v.MSG_STATE, v.CONTENT from  F_V_LAST_UNREAD_CHAT_MSG v where  v.RECEIVER= ? ";
        JSONArray jsonArray = DatabaseOptUtils.findObjectsAsJSONBySql(
                this,sql, new Object[] {receiver}, new PageDesc(-1, -1));

        return jsonArray;
    }


    public  JSONArray statGroupUnreadWithLastMsg(String userCode){
        String sql = "select v.USER_CODE, v.UNIT_CODE, v.UNREAD_SUM, v.SEND_TIME," +
                "v.MSG_ID, v.MSG_TYPE, v.MSG_STATE, v.CONTENT from  F_V_LAST_UNREAD_GROUP_MSG v where  v.USER_CODE= ? ";
        JSONArray jsonArray = DatabaseOptUtils.findObjectsAsJSONBySql(
                this,sql, new Object[] {userCode}, new PageDesc(-1, -1));

        return jsonArray;

    }
}
