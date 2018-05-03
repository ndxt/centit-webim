package com.centit.im.po;

import java.util.Date;
import javax.persistence.*;


import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotBlank;


/**
 * create by scaffold 2017-05-23 
 * @author codefan@sina.com
 
  用户组信息查看时间用来记录 组信息 成功推送到给这个用户的时间，这个时间之后的信息 都是这个用户 关于该组的未读信息   
*/
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
	@NotNull
	@Temporal(TemporalType.TIMESTAMP)
	private Date  lastPushTime;

	@Column(name = "JOIN_TIME")
	@NotNull
	@Temporal(TemporalType.TIMESTAMP)
	private Date  joinTime;

	// Constructors
	/** default constructor */
	public WebImGroupMember() {
	}


/** full constructor */
	public WebImGroupMember(WebImGroupMemberId id
			
	, Date  lastPushTime) {
		this.cid = id;
		this.lastPushTime= lastPushTime;
	}

	public WebImGroupMemberId getCid() {
		return this.cid;
	}
	
	public void setCid(WebImGroupMemberId id) {
		this.cid = id;
	}

	public String getOsId() {
		return this.osId;
	}

	public void setOsId(String osId) {
		this.osId = osId;
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

	public String getGroupAlias() {
		return groupAlias;
	}

	public void setGroupAlias(String groupAlias) {
		this.groupAlias = groupAlias;
	}

	public String getGroupMemo() {
		return groupMemo;
	}

	public void setGroupMemo(String groupMemo) {
		this.groupMemo = groupMemo;
	}

	public Date getJoinTime() {
		return joinTime;
	}

	public void setJoinTime(Date joinTime) {
		this.joinTime = joinTime;
	}

	// Property accessors
  
	public Date getLastPushTime() {
		return this.lastPushTime;
	}
	
	public void setLastPushTime(Date lastPushTime) {
		this.lastPushTime = lastPushTime;
	}



	public WebImGroupMember copy(WebImGroupMember other){
  
		this.setOsId(other.getOsId());  
		this.setUserCode(other.getUserCode());  
		this.setGroupId(other.getGroupId());

		this.setGroupAlias(other.getGroupAlias());
		this.setGroupMemo(other.getGroupMemo());
		this.setJoinTime(other.getJoinTime());

		this.lastPushTime= other.getLastPushTime();

		return this;
	}
	
	public WebImGroupMember copyNotNullProperty(WebImGroupMember other){
  
		if( other.getOsId() != null)
			this.setOsId(other.getOsId());
		if( other.getUserCode() != null)
			this.setUserCode(other.getUserCode());
		if( other.getGroupId() != null)
			this.setGroupId(other.getGroupId());
		if( other.getGroupAlias() != null)
			this.setGroupAlias(other.getGroupAlias());
		if( other.getGroupMemo() != null)
			this.setGroupMemo(other.getGroupMemo());
		if( other.getJoinTime() != null)
			this.setJoinTime(other.getJoinTime());

		if( other.getLastPushTime() != null)
			this.lastPushTime= other.getLastPushTime();

		return this;
	}

	public WebImGroupMember clearProperties(){
  
		this.lastPushTime= null;

		return this;
	}
}
