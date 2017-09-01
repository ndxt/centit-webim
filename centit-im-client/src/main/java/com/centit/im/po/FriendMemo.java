package com.centit.im.po;

import java.util.Date;


/**
 * create by scaffold 2017-05-26 
 * @author codefan@sina.com
 
  好友别名和备注用于为好友（同事）重命名 和 填写备注信息   
*/

public class FriendMemo implements java.io.Serializable {
	private static final long serialVersionUID =  1L;

	private String userCode;

	/**
	 * 好友代码 null
	 */
	private String friendCode;


	/**
	 * 业务系统ID null 
	 */
	private String  osId;
	/**
	 * 最后更改时间 null 
	 */

	private Date  lastUpdateTime;
	/**
	 * 备注名称 null 
	 */
	private String  friendAlias;
	/**
	 * 好友备注 null 
	 */

	private String  friendMemo;

	// Constructors
	/** default constructor */
	public FriendMemo() {
	}

	/**
	 * minimal constructor
	 * @param userCode 用户
	 * @param friendCode 好友
	 * @param osId ID
	 * @param lastUpdateTime 最后更新时间
	 */
	public FriendMemo(String userCode  , String friendCode,
			String  osId,Date  lastUpdateTime) {
		this.userCode = userCode;
		this.friendCode = friendCode;

		this.osId= osId; 
		this.lastUpdateTime= lastUpdateTime; 		
	}

	/**
	 * full constructor
	 * @param userCode 用户
	 * @param friendCode 好友
	 * @param osId ID
	 * @param lastUpdateTime 最后更新时间
	 * @param friendAlias 好友别名
	 * @param friendMemo 好友备忘录
	 */
	public FriendMemo(String userCode  , String friendCode,
			String  osId,Date  lastUpdateTime,String  friendAlias,String  friendMemo) {
		this.userCode = userCode;
		this.friendCode = friendCode;
		this.osId= osId;
		this.lastUpdateTime= lastUpdateTime;
		this.friendAlias= friendAlias;
		this.friendMemo= friendMemo;		
	}


  
	public String getUserCode() {
		return this.userCode;
	}
	
	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}
  
	public String getFriendCode() {
		return this.friendCode;
	}
	
	public void setFriendCode(String friendCode) {
		this.friendCode = friendCode;
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



	public FriendMemo copy(FriendMemo other){
  
		this.setUserCode(other.getUserCode());  
		this.setFriendCode(other.getFriendCode());
  
		this.osId= other.getOsId();  
		this.lastUpdateTime= other.getLastUpdateTime();  
		this.friendAlias= other.getFriendAlias();  
		this.friendMemo= other.getFriendMemo();

		return this;
	}
	
	public FriendMemo copyNotNullProperty(FriendMemo other){
  
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

	public FriendMemo clearProperties(){
  
		this.osId= null;  
		this.lastUpdateTime= null;  
		this.friendAlias= null;  
		this.friendMemo= null;

		return this;
	}
}
