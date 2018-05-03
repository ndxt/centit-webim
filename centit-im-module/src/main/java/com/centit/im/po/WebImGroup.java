package com.centit.im.po;

import com.alibaba.fastjson.JSONObject;
import com.centit.support.algorithm.DatetimeOpt;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;


/**
 * create by scaffold 2017-05-23 
 * @author codefan@sina.com
 
  用户组信息查看时间用来记录 组信息 成功推送到给这个用户的时间，这个时间之后的信息 都是这个用户 关于该组的未读信息   
*/
@Entity
@Table(name = "F_WEB_IM_GROUP")
public class WebImGroup implements java.io.Serializable {
	private static final long serialVersionUID =  1L;

	@Id
	@Column(name = "GROUP_ID")
	//@GeneratedValue(generator = "assignedGenerator")
	//@GenericGenerator(name = "assignedGenerator", strategy = "assigned")
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
	@NotNull
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
	@NotNull
	@Temporal(TemporalType.TIMESTAMP)
	private Date  createTime;



	// Constructors
	/** default constructor */
	public WebImGroup() {
	}


/** full constructor */
	public WebImGroup(String id , Date  createTime) {
		this.groupId = id;
		this.createTime= createTime;
	}


	public String getOsId() {
		return this.osId;
	}

	public void setOsId(String osId) {
		this.osId = osId;
	}

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public String getGroupType() {
		return groupType;
	}

	public void setGroupType(String groupType) {
		this.groupType = groupType;
	}

	public String getGroupName() {
		return groupName;
	}

	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}

	public String getGroupNotice() {
		return groupNotice;
	}

	public void setGroupNotice(String groupNotice) {
		this.groupNotice = groupNotice;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public WebImGroup copy(WebImGroup other){

		this.setOsId(other.getOsId());
		this.setGroupId(other.getGroupId());
		this.setCreator(other.getCreator());
		this.setGroupName(other.getGroupName());
		this.setGroupType(other.getGroupType());
		this.setGroupNotice(other.getGroupNotice());
		this.setCreateTime(other.getCreateTime());
		return this;
	}

	public WebImGroup copyNotNullProperty(WebImGroup other){

		if( other.getOsId() != null)
			this.setOsId(other.getOsId());
		if( other.getGroupId() != null)
			this.setGroupId(other.getGroupId());
		if( other.getCreator() != null)
			this.setCreator(other.getCreator());
		if( other.getGroupName() != null)
			this.setGroupName(other.getGroupName());
		if( other.getGroupType() != null)
			this.setGroupType(other.getGroupType());
		if( other.getGroupNotice() != null)
			this.setGroupNotice(other.getGroupNotice());
		if( other.getCreateTime() != null)
			this.setCreateTime(other.getCreateTime());

		return this;
	}

	public WebImGroup clearProperties(){
		return this;
	}


	public WebImGroup stingToObject(String str){
		JSONObject jo = JSONObject.parseObject(str);
		if (jo.get("osId") != null)
			this.setOsId(jo.get("osId").toString());
		if (jo.get("groupId") != null)
			this.setGroupId(jo.get("groupId").toString());
		if (jo.get("creator") != null)
			this.setCreator(jo.get("creator").toString());
		if (jo.get("groupName") != null)
			this.setGroupName(jo.get("groupName").toString());
		if (jo.get("groupType") != null)
			this.setGroupType(jo.get("groupType").toString());
		if (jo.get("groupNotice") != null)
			this.setGroupNotice(jo.get("groupNotice").toString());
		if (jo.get("createTime") != null)
			this.setCreateTime(DatetimeOpt.castObjectToDate(jo.get("createTime")));
		return this;
	}
}
