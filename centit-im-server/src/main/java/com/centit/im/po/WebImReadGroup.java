package com.centit.im.po;

import java.util.Date;
import java.sql.Timestamp;
import javax.persistence.Column;

import javax.persistence.EmbeddedId;


import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import javax.persistence.GeneratedValue;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;


/**
 * create by scaffold 2017-05-23 
 * @author codefan@sina.com
 
  用户组信息查看时间用来记录 组信息 成功推送到给这个用户的时间，这个时间之后的信息 都是这个用户 关于该组的未读信息   
*/
@Entity
@Table(name = "F_WEB_IM_READ_GROUP")
public class WebImReadGroup implements java.io.Serializable {
	private static final long serialVersionUID =  1L;

	@EmbeddedId
	private com.centit.im.po.WebImReadGroupId cid;

	/**
	 * 业务系统ID null
	 */
	@Column(name = "OS_ID")
	@NotBlank(message = "字段不能为空")
	private String osId;
	/**
	 * 最后成功推送时间 null 
	 */
	@Column(name = "LAST_PUSH_TIME")
	@NotNull
	private Date  lastPushTime;

	// Constructors
	/** default constructor */
	public WebImReadGroup() {
	}


/** full constructor */
	public WebImReadGroup(com.centit.im.po.WebImReadGroupId id
			
	,Date  lastPushTime) {
		this.cid = id; 
			
	
		this.lastPushTime= lastPushTime;
	}

	public com.centit.im.po.WebImReadGroupId getCid() {
		return this.cid;
	}
	
	public void setCid(com.centit.im.po.WebImReadGroupId id) {
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
			this.cid = new com.centit.im.po.WebImReadGroupId();
		return this.cid.getUserCode();
	}
	
	public void setUserCode(String userCode) {
		if(this.cid==null)
			this.cid = new com.centit.im.po.WebImReadGroupId();
		this.cid.setUserCode(userCode);
	}
  
	public String getUnitCode() {
		if(this.cid==null)
			this.cid = new com.centit.im.po.WebImReadGroupId();
		return this.cid.getUnitCode();
	}
	
	public void setUnitCode(String unitCode) {
		if(this.cid==null)
			this.cid = new com.centit.im.po.WebImReadGroupId();
		this.cid.setUnitCode(unitCode);
	}
	
	

	// Property accessors
  
	public Date getLastPushTime() {
		return this.lastPushTime;
	}
	
	public void setLastPushTime(Date lastPushTime) {
		this.lastPushTime = lastPushTime;
	}



	public WebImReadGroup copy(WebImReadGroup other){
  
		this.setOsId(other.getOsId());  
		this.setUserCode(other.getUserCode());  
		this.setUnitCode(other.getUnitCode());
  
		this.lastPushTime= other.getLastPushTime();

		return this;
	}
	
	public WebImReadGroup copyNotNullProperty(WebImReadGroup other){
  
	if( other.getOsId() != null)
		this.setOsId(other.getOsId());  
	if( other.getUserCode() != null)
		this.setUserCode(other.getUserCode());  
	if( other.getUnitCode() != null)
		this.setUnitCode(other.getUnitCode());
  
		if( other.getLastPushTime() != null)
			this.lastPushTime= other.getLastPushTime();

		return this;
	}

	public WebImReadGroup clearProperties(){
  
		this.lastPushTime= null;

		return this;
	}
}
