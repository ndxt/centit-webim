package com.centit.im.po;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;
import java.util.Date;


/**
 * create by scaffold 2017-05-26
 * @author codefan@sina.com

  好友别名和备注用于为好友（同事）重命名 和 填写备注信息
*/
@Entity
@Table(name = "F_WEB_IM_FRIEND_MEMO")
public class WebImFriendMemo implements java.io.Serializable {
	private static final long serialVersionUID =  1L;

	@EmbeddedId
	private WebImFriendMemoId cid;


	/**
	 * 业务系统ID null
	 */
	@Column(name = "OS_ID")
	@NotBlank(message = "字段不能为空")
	@Length(max = 20, message = "字段长度不能大于{max}")
	private String  osId;
	/**
	 * 最后更改时间 null
	 */
	@Column(name = "LAST_UPDATE_TIME")
	@NotBlank(message = "字段不能为空")
	@Temporal(TemporalType.TIMESTAMP)
	private Date  lastUpdateTime;
	/**
	 * 备注名称 null
	 */
	@Column(name = "FRIEND_ALIAS")
	@Length(max = 100, message = "字段长度不能大于{max}")
	private String  friendAlias;
	/**
	 * 好友备注 null
	 */
	@Column(name = "FRIEND_MEMO")
	@Length(max = 1000, message = "字段长度不能大于{max}")
	private String  friendMemo;

	// Constructors
	/* default constructor */
	public WebImFriendMemo() {
	}
	/* minimal constructor */
	public WebImFriendMemo(WebImFriendMemoId id

		, String  osId, Date  lastUpdateTime) {
		this.cid = id;


		this.osId= osId;
		this.lastUpdateTime= lastUpdateTime;
	}

/* full constructor */
	public WebImFriendMemo(WebImFriendMemoId id

	, String  osId, Date  lastUpdateTime, String  friendAlias, String  friendMemo) {
		this.cid = id;


		this.osId= osId;
		this.lastUpdateTime= lastUpdateTime;
		this.friendAlias= friendAlias;
		this.friendMemo= friendMemo;
	}

	public WebImFriendMemoId getCid() {
		return this.cid;
	}

	public void setCid(WebImFriendMemoId id) {
		this.cid = id;
	}

	public String getUserCode() {
		if(this.cid==null)
			this.cid = new WebImFriendMemoId();
		return this.cid.getUserCode();
	}

	public void setUserCode(String userCode) {
		if(this.cid==null)
			this.cid = new WebImFriendMemoId();
		this.cid.setUserCode(userCode);
	}

	public String getFriendCode() {
		if(this.cid==null)
			this.cid = new WebImFriendMemoId();
		return this.cid.getFriendCode();
	}

	public void setFriendCode(String friendCode) {
		if(this.cid==null)
			this.cid = new WebImFriendMemoId();
		this.cid.setFriendCode(friendCode);
	}



	// Property accessors

	public String getOsId() {
		return this.osId;
	}

	public void setOsId(String osId) {
		this.osId = osId;
	}

	public Date getLastUpdateTime() {
		return this.lastUpdateTime;
	}

	public void setLastUpdateTime(Date lastUpdateTime) {
		this.lastUpdateTime = lastUpdateTime;
	}

	public String getFriendAlias() {
		return this.friendAlias;
	}

	public void setFriendAlias(String friendAlias) {
		this.friendAlias = friendAlias;
	}

	public String getFriendMemo() {
		return this.friendMemo;
	}

	public void setFriendMemo(String friendMemo) {
		this.friendMemo = friendMemo;
	}



	public WebImFriendMemo copy(WebImFriendMemo other){

		this.setUserCode(other.getUserCode());
		this.setFriendCode(other.getFriendCode());

		this.osId= other.getOsId();
		this.lastUpdateTime= other.getLastUpdateTime();
		this.friendAlias= other.getFriendAlias();
		this.friendMemo= other.getFriendMemo();

		return this;
	}

	public WebImFriendMemo copyNotNullProperty(WebImFriendMemo other){

	if( other.getUserCode() != null)
		this.setUserCode(other.getUserCode());
	if( other.getFriendCode() != null)
		this.setFriendCode(other.getFriendCode());

		if( other.getOsId() != null)
			this.osId= other.getOsId();
		if( other.getLastUpdateTime() != null)
			this.lastUpdateTime= other.getLastUpdateTime();
		if( other.getFriendAlias() != null)
			this.friendAlias= other.getFriendAlias();
		if( other.getFriendMemo() != null)
			this.friendMemo= other.getFriendMemo();

		return this;
	}

	public WebImFriendMemo clearProperties(){

		this.osId= null;
		this.lastUpdateTime= null;
		this.friendAlias= null;
		this.friendMemo= null;

		return this;
	}
}
