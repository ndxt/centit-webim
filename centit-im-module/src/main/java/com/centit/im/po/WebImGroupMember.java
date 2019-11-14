package com.centit.im.po;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.centit.support.algorithm.DatetimeOpt;
import com.centit.support.database.orm.GeneratorCondition;
import com.centit.support.database.orm.GeneratorType;
import com.centit.support.database.orm.ValueGenerator;
import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


/**
 * create by scaffold 2017-05-23
 * @author codefan@sina.com

  用户组信息查看时间用来记录 组信息 成功推送到给这个用户的时间，这个时间之后的信息 都是这个用户 关于该组的未读信息
*/
@Data
@Entity
@Table(name = "F_WEB_IM_GROUP_MEMBER")
public class WebImGroupMember implements java.io.Serializable {
    private static final long serialVersionUID =  1L;

    @EmbeddedId
    private WebImGroupMemberId cid;

    /**
     * 业务系统ID null
     */
    @Column(name = "OS_ID")
    @NotBlank(message = "字段不能为空")
    private String osId;

    @Column(name = "GROUP_ALIAS")
    private String groupAlias;

    @Column(name = "GROUP_MEMO")
    private String groupMemo;
    /**
     * 最后成功推送时间 null
     */
    @Column(name = "LAST_PUSH_TIME")
    @ValueGenerator(strategy = GeneratorType.FUNCTION,
                condition = GeneratorCondition.ALWAYS, value = "today()")
    @Temporal(TemporalType.TIMESTAMP)
    private Date  lastPushTime;

    @Column(name = "JOIN_TIME")
    @ValueGenerator(strategy = GeneratorType.FUNCTION, value = "today()")
    @Temporal(TemporalType.TIMESTAMP)
    private Date  joinTime;

    // Constructors
    /* default constructor */
    public WebImGroupMember() {
    }


/* full constructor */
    public WebImGroupMember(WebImGroupMemberId id, Date  lastPushTime) {
        this.cid = id;
        this.lastPushTime= lastPushTime;
    }


    public String getUserCode() {
        if(this.cid==null)
            this.cid = new WebImGroupMemberId();
        return this.cid.getUserCode();
    }

    public void setUserCode(String userCode) {
        if(this.cid==null)
            this.cid = new WebImGroupMemberId();
        this.cid.setUserCode(userCode);
    }

    public String getGroupId() {
        if(this.cid==null)
            this.cid = new WebImGroupMemberId();
        return this.cid.getGroupId();
    }

    public void setGroupId(String unitCode) {
        if(this.cid==null)
            this.cid = new WebImGroupMemberId();
        this.cid.setGroupId(unitCode);
    }

    public static WebImGroupMember createFromJson(JSONObject jo){

        WebImGroupMember webImGroupMember = new WebImGroupMember();
        webImGroupMember.setOsId(jo.getString("osId"));
        webImGroupMember.setGroupId(jo.getString("groupId"));
        webImGroupMember.setUserCode(jo.getString("userCode"));
        webImGroupMember.setGroupAlias(jo.getString("groupAlias"));
        webImGroupMember.setGroupMemo(jo.getString("groupMemo"));
        webImGroupMember.setJoinTime(DatetimeOpt.castObjectToDate(jo.get("joinTime")));
        webImGroupMember.setLastPushTime(DatetimeOpt.castObjectToDate(jo.get("lastPushTime")));

        return webImGroupMember;
    }

    public static List<WebImGroupMember> createFromJsonArray(JSONArray ja){
        if(ja == null || ja.size()<1 ) {
            return null;
        }
        List<WebImGroupMember> members = new ArrayList<>(ja.size());
        for(Object obj : ja){
            members.add(createFromJson( (JSONObject) obj ));
        }
        return members;
    }

}
