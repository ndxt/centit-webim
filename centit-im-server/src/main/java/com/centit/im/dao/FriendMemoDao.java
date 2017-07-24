package com.centit.im.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.centit.framework.core.dao.CodeBook;
import com.centit.framework.hibernate.dao.BaseDaoImpl;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.centit.im.po.FriendMemo;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;



/**
 * FriendMemoDao  Repository.
 * create by scaffold 2017-05-26 
 * @author codefan@sina.com
 * 好友别名和备注用于为好友（同事）重命名 和 填写备注信息   
*/

@Repository
public class FriendMemoDao extends BaseDaoImpl<FriendMemo,com.centit.im.po.FriendMemoId>
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

	public List<FriendMemo> listUserFriendMemo(String userCode){
		return this.listObjects("From FriendMemo where cid.userCode = ? ",userCode);
	}
}
