package com.centit.im.dao;

import java.util.HashMap;
import java.util.Map;
import com.centit.framework.core.dao.CodeBook;
import com.centit.framework.hibernate.dao.BaseDaoImpl;
import com.centit.im.po.WebImReadGroupId;
import com.centit.im.socketio.ImMessage;
import com.centit.support.algorithm.DatetimeOpt;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.centit.im.po.WebImReadGroup;
import org.springframework.stereotype.Repository;


/**
 * WebImReadGroupDao  Repository.
 * create by scaffold 2017-05-23 
 * @author codefan@sina.com
 * 用户组信息查看时间用来记录 组信息 成功推送到给这个用户的时间，这个时间之后的信息 都是这个用户 关于该组的未读信息   
*/

@Repository
public class WebImReadGroupDao extends BaseDaoImpl<WebImReadGroup,com.centit.im.po.WebImReadGroupId>
	{

	public static final Log log = LogFactory.getLog(WebImReadGroupDao.class);
	
	@Override
	public Map<String, String> getFilterField() {
		if( filterField == null){
			filterField = new HashMap<String, String>();

			filterField.put("osId" , CodeBook.EQUAL_HQL_ID);

			filterField.put("userCode" , CodeBook.EQUAL_HQL_ID);

			filterField.put("unitCode" , CodeBook.EQUAL_HQL_ID);

			filterField.put("lastPustTime" , CodeBook.EQUAL_HQL_ID);

		}
		return filterField;
	}

	public void setGroupReadState(String userCode,String unitCode){
		WebImReadGroup dbWebImReadGroup = this.getObjectById(new WebImReadGroupId(userCode,unitCode));
		if (dbWebImReadGroup == null){
			WebImReadGroup webImReadGroup = new WebImReadGroup();
			webImReadGroup.setOsId(ImMessage.DEFAULT_OSID);
			webImReadGroup.setLastPushTime(DatetimeOpt.currentUtilDate());
			webImReadGroup.setCid(new WebImReadGroupId(userCode,unitCode));
			this.saveNewObject(webImReadGroup);
		}else {
			dbWebImReadGroup.setLastPushTime(DatetimeOpt.currentUtilDate());
			this.saveObject(dbWebImReadGroup);
		}
	}
}
