package com.centit.im.po;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.centit.support.algorithm.DatetimeOpt;
import com.centit.support.database.orm.GeneratorType;
import com.centit.support.database.orm.ValueGenerator;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;
import java.util.Date;


/**
 * create by scaffold 2017-05-23
 * @author codefan@sina.com

  用户组信息查看时间用来记录 组信息 成功推送到给这个用户的时间，这个时间之后的信息 都是这个用户 关于该组的未读信息
*/
@Data
@Entity
@Table(name = "F_WEB_IM_GROUP")
public class WebImGroup implements java.io.Serializable {
    private static final long serialVersionUID =  1L;

    @Id
    @Column(name = "GROUP_ID")
    @ValueGenerator(strategy = GeneratorType.UUID22)
    @NotBlank(message = "字段不能为空")
    private String groupId;

    /**
     * 业务系统ID null
     */
    @Column(name = "OS_ID")
    @NotBlank(message = "字段不能为空")
    private String osId;

    /**
     * 'U  unit机构群不能删除，不能退出  G Group 普通群',
     */
    @Column(name = "GROUP_TYPE")
    @Length(max = 1, message = "字段长度不能大于{max}")
    private String groupType;

    @Column(name = "GROUP_NAME")
    @Length(max = 100, message = "字段长度不能大于{max}")
    private String groupName;

    @Column(name = "GROUP_NOTICE")
    @Length(max = 1000, message = "字段长度不能大于{max}")
    private String groupNotice;

    @Column(name = "CREATOR")
    @Length(max = 32, message = "字段长度不能大于{max}")
    private String creator;
    /**
     * 最后成功推送时间 null
     */
    @Column(name = "CREATE_TIME")
    @Temporal(TemporalType.TIMESTAMP)
    @ValueGenerator(strategy = GeneratorType.FUNCTION, value = "today")
    private Date  createTime;

    // Constructors
    /* default constructor */
    public WebImGroup() {
    }

    public static WebImGroup createFromJsonString(String jsonStr){
        JSONObject jsonObject = JSON.parseObject(jsonStr);
        if(jsonObject==null){
            return null;
        }
        return createFromJson(jsonObject);
    }

    public static WebImGroup createFromJson(JSONObject jsonObject){
        WebImGroup imGroup = new WebImGroup();
        imGroup.setGroupId(jsonObject.getString("groupId"));
        imGroup.setOsId(jsonObject.getString("osId"));
        imGroup.setGroupType(jsonObject.getString("groupType"));
        imGroup.setGroupName(jsonObject.getString("groupName"));
        imGroup.setGroupNotice(jsonObject.getString("groupNotice"));
        imGroup.setCreator(jsonObject.getString("creator"));
        imGroup.setCreateTime(DatetimeOpt.castObjectToDate(jsonObject.get("createTime")));
        return imGroup;
    }
}
