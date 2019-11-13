package com.centit.im.dao;

import com.centit.framework.core.dao.CodeBook;
import com.centit.framework.jdbc.dao.BaseDaoImpl;
import com.centit.im.po.ImMessage;
import com.centit.im.po.WebImGroupMember;
import com.centit.im.po.WebImGroupMemberId;
import com.centit.support.algorithm.DatetimeOpt;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;


/**
 * WebImReadGroupDao  Repository.
 * create by scaffold 2017-05-23
 * @author codefan@sina.com
 * 用户组信息查看时间用来记录 组信息 成功推送到给这个用户的时间，这个时间之后的信息 都是这个用户 关于该组的未读信息
*/

@Repository
public class WebImGroupMemberDao extends BaseDaoImpl<WebImGroupMember,WebImGroupMemberId>
    {

    public static final Log log = LogFactory.getLog(WebImGroupMemberDao.class);

    @Override
    public Map<String, String> getFilterField() {
        if( filterField == null){
            filterField = new HashMap<>();

            filterField.put("osId" , CodeBook.EQUAL_HQL_ID);

            filterField.put("userCode" , CodeBook.EQUAL_HQL_ID);

            filterField.put("unitCode" , "UNIT_CODE = :unitCode");

            filterField.put("lastPustTime" , CodeBook.EQUAL_HQL_ID);

            filterField.put("groupId" , CodeBook.EQUAL_HQL_ID);

        }
        return filterField;
    }

    public void setGroupReadState(String userCode, String groupCode/*unitCode*/){
        WebImGroupMember dbWebImReadGroup = this.getObjectById(new WebImGroupMemberId(groupCode, userCode));
        if (dbWebImReadGroup == null){
            WebImGroupMember webImReadGroup = new WebImGroupMember();
            webImReadGroup.setOsId(ImMessage.DEFAULT_OSID);
            webImReadGroup.setLastPushTime(DatetimeOpt.currentUtilDate());
            webImReadGroup.setCid(new WebImGroupMemberId(groupCode, userCode));
            this.saveNewObject(webImReadGroup);
        }else {
            dbWebImReadGroup.setLastPushTime(DatetimeOpt.currentUtilDate());
            this.updateObject(dbWebImReadGroup);
        }
    }
}
