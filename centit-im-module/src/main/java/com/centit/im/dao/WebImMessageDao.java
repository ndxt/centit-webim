package com.centit.im.dao;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.centit.framework.core.dao.CodeBook;
import com.centit.support.database.utils.PageDesc;
import com.centit.framework.jdbc.dao.BaseDaoImpl;
import com.centit.framework.jdbc.dao.DatabaseOptUtils;
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

    /*
     * TODO 重构这个sql语句，把这个语句 更改为 sql语句
     */
    public JSONArray listChatMessage(String sender,String receiver,
                                              Date lastReadDate, PageDesc pageDesc) {
        Date lrd = lastReadDate==null? DatetimeOpt.currentUtilDate():lastReadDate;
        String sql = "select f.MSG_ID, f.OS_ID, f.MSG_TYPE, f.SENDER, f.RECEIVER, " +
                   "f.SEND_TIME, f.SENDER_NAME, f.MSG_STATE, f.CONTENT_TYPE, f.CONTENT FROM F_WEB_IM_MESSAGE f " +
                "WHERE 1=1 AND f.SEND_TIME <= ? " +
                "AND (f.SENDER = ? AND f.RECEIVER = ?) OR (f.SENDER = ? AND f.RECEIVER = ?) " +
                "ORDER BY f.SEND_TIME DESC ";
        return DatabaseOptUtils.listObjectsBySqlAsJson(this,  sql,
                new Object[]{lrd,sender,receiver,receiver,sender}, pageDesc);
    }

    /*
     * TODO 重构这个sql语句，把这个语句 更改为 sql语句，病添加和 T_Web_IM_CUSTOMER 表管理，返回 用户的姓名 和 头像
     */
    public JSONArray listAllChatMessage(String receiver,
                                                 Date lastReadDate, PageDesc pageDesc) {
        Date lrd = lastReadDate==null? DatetimeOpt.currentUtilDate():lastReadDate;
        String sql = "select f.MSG_ID, f.OS_ID, f.MSG_TYPE, f.SENDER, f.RECEIVER, " +
                   "f.SEND_TIME, f.SENDER_NAME, f.MSG_STATE, f.CONTENT_TYPE, f.CONTENT FROM F_WEB_IM_MESSAGE f " +
                "WHERE 1=1 AND f.SEND_TIME <= ? AND ( f.RECEIVER = ?  OR f.SENDER = ?) " +
                "ORDER BY f.SEND_TIME DESC";
        return DatabaseOptUtils.listObjectsBySqlAsJson(this,  sql,
                new Object[]{lrd,receiver,receiver}, pageDesc);
    }

    /*
     * TODO 重构这个sql语句，把这个语句 更改为 sql语句，病添加和 T_Web_IM_CUSTOMER 表管理，返回 用户的姓名 和 头像
     */
    public JSONArray  listGroupChatMessage(String unitCode,
                                                   Date lastReadDate, PageDesc pageDesc) {
        Date lrd = lastReadDate==null? DatetimeOpt.currentUtilDate():lastReadDate;
        String sql = "select f.MSG_ID, f.OS_ID, f.MSG_TYPE, f.SENDER, f.RECEIVER, " +
                   "f.SEND_TIME, f.SENDER_NAME, f.MSG_STATE, f.CONTENT_TYPE, f.CONTENT FROM F_WEB_IM_MESSAGE f " +
                "WHERE f.SEND_TIME <= ? AND f.RECEIVER = ? AND f.MSG_TYPE = 'G' " +
                "ORDER BY f.SEND_TIME DESC";
        return  DatabaseOptUtils.listObjectsBySqlAsJson(this,  sql,
                new Object[]{lrd,unitCode}, pageDesc);
    }

    @Transactional(propagation= Propagation.MANDATORY)
    public int updateReadState(String sender,String receiver){
        String sql = "UPDATE F_WEB_IM_MESSAGE f " +
                "SET f.MSG_STATE='C' " +
                "WHERE f.MSG_STATE='U' AND f.RECEIVER=? AND f.SENDER=?";
        return DatabaseOptUtils.doExecuteSql( this, sql, new Object[] {receiver,sender});
    }

    @Transactional(propagation= Propagation.MANDATORY)
    public int updateReadState(String receiver){
        String sql = "UPDATE F_WEB_IM_MESSAGE f " +
                "SET f.MSG_STATE='C' " +
                "WHERE f.MSG_STATE='U' AND f.RECEIVER=? ";
        return DatabaseOptUtils.doExecuteSql( this, sql, new Object[] {receiver});
    }

    public Map<String, Integer> statUnreadMsg(String receiver){
        String sql = "select v.SENDER, v.UNREAD_SUM  from  F_V_UNREAD_CHAT_MSG v where  v.RECEIVER= ? ";
        JSONArray jsonArray =
                DatabaseOptUtils.listObjectsBySqlAsJson(this,sql,
                        new String[]{"senderCode","unreadSum"}, new Object[] {receiver});
        Map<String, Integer> map = new HashMap<>(jsonArray.size() * 2);
        for(Object obj : jsonArray){
            map.put( StringBaseOpt.objectToString( ((JSONObject)obj).get("senderCode") ),
                    NumberBaseOpt.castObjectToInteger(((JSONObject)obj).get("unreadSum") ));
        }
        return map;
    }


    public  Map<String, Integer> statGroupUnreadMsg(String userCode){
        String sql = "select v.UNIT_CODE, v.UNREAD_SUM  from  F_V_UNREAD_GROUP_MSG v where v.USER_CODE = ?";
        JSONArray jsonArray =
                DatabaseOptUtils.listObjectsBySqlAsJson(this,sql,
                        new String[]{"unitCode","unreadSum"},
                        new Object[] {userCode});
        Map<String, Integer> map = new HashMap<>(jsonArray.size() * 2);
        for(Object obj : jsonArray){
            map.put( StringBaseOpt.objectToString( ((JSONObject)obj).get("unitCode") ),
                    NumberBaseOpt.castObjectToInteger(((JSONObject)obj).get("unreadSum") ));
        }
        return map;
    }

    public JSONArray statUnreadWithLastMsg(String receiver){
        String sql = "select v.SENDER, v.RECEIVER, v.UNREAD_SUM, v.SEND_TIME, V.SENDER_NAME," +
                "v.MSG_ID, v.MSG_TYPE, v.MSG_STATE, v.CONTENT, v.CONTENT_TYPE " +
                "from  F_V_LAST_UNREAD_CHAT_MSG v where  v.RECEIVER= ? ";
        JSONArray jsonArray = DatabaseOptUtils.listObjectsBySqlAsJson(
                this,sql,
                new String[]{"sender","receiver","unreadSum","sendTime","senderName",
                        "msgId","msgType","msgState","content","contentType"},
                new Object[] {receiver});

        return jsonArray;
    }


    public  JSONArray statGroupUnreadWithLastMsg(String userCode){
        String sql = "select v.USER_CODE, v.UNIT_CODE, v.UNREAD_SUM, v.SEND_TIME, V.SENDER_NAME," +
                "v.MSG_ID, v.MSG_TYPE, v.MSG_STATE, v.CONTENT, v.CONTENT_TYPE " +
                "from  F_V_LAST_UNREAD_GROUP_MSG v where  v.USER_CODE= ? ";
        JSONArray jsonArray = DatabaseOptUtils.listObjectsBySqlAsJson(
                this,sql,
                new String[]{"userCode","unitCode","unreadSum","sendTime","senderName",
                        "msgId","msgType","msgState","content","contentType"},
                new Object[] {userCode});

        return jsonArray;

    }
}
