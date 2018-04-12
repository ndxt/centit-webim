package com.centit.im.dao;

import com.centit.framework.core.dao.CodeBook;
import com.centit.framework.jdbc.dao.BaseDaoImpl;
import com.centit.im.po.WebImFriendMemo;
import com.centit.im.po.WebImFriendMemoId;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;



/**
 * FriendMemoDao  Repository.
 * create by scaffold 2017-05-26 
 * @author codefan@sina.com
 * 好友别名和备注用于为好友（同事）重命名 和 填写备注信息   
*/

@Repository
public class FriendMemoDao extends BaseDaoImpl<WebImFriendMemo,WebImFriendMemoId>
	{

	public static final Log log = LogFactory.getLog(FriendMemoDao.class);
	
	@Override
	public Map<String, String> getFilterField() {
		if( filterField == null){
			filterField = new HashMap<String, String>();

			filterField.put("userCode" , CodeBook.EQUAL_HQL_ID);

			filterField.put("friendCode" , CodeBook.EQUAL_HQL_ID);


			filterField.put("osId" , CodeBook.EQUAL_HQL_ID);

			filterField.put("lastUpdateTime" , CodeBook.EQUAL_HQL_ID);

			filterField.put("friendAlias" , CodeBook.EQUAL_HQL_ID);

			filterField.put("friendMemo" , CodeBook.EQUAL_HQL_ID);

		}
		return filterField;
	}

	public List<WebImFriendMemo> listUserFriendMemo(String userCode){
		return this.listObjectsByFilter("where user_Code = ? ",new Object[]{userCode});
	}
}
