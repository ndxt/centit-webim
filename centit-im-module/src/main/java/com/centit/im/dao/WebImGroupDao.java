package com.centit.im.dao;

import com.centit.framework.core.dao.CodeBook;
import com.centit.framework.jdbc.dao.BaseDaoImpl;
import com.centit.im.po.WebImGroup;
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
public class WebImGroupDao extends BaseDaoImpl<WebImGroup,String>
    {

    public static final Log log = LogFactory.getLog(WebImGroupDao.class);

    @Override
    public Map<String, String> getFilterField() {
        Map<String, String> filterField = new HashMap<>();
        filterField.put("groupId" , CodeBook.EQUAL_HQL_ID);
        filterField.put("groupName" , CodeBook.LIKE_HQL_ID);
        filterField.put("groupNotice" , CodeBook.LIKE_HQL_ID);
        filterField.put("(like)name", "(GROUP_NAME like :name or GROUP_NOTICE like :name)");
        return filterField;
    }

}
