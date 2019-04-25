package com.centit.im.po;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;
import java.util.Date;


/**
 * create by scaffold 2017-05-23 
 * @author codefan@sina.com
 
  匿名用户（ 用于客服模式）匿名用户（ 用于客服模式）

用户的ID为 各个系统的用户ID ，或者由前端根据 前端的硬件属性生产一个唯一的编号   
*/
@Entity
@Table(name = "F_WEB_IM_CUSTOMER")
public class WebImCustomer implements java.io.Serializable {
	private static final long serialVersionUID =  1L;

	/**
	 * 用户代码 用户的ID为 各个系统的用户ID ，或者由前端根据 前端的硬件属性生产一个唯一的编号
	 */
	@Id
	@Column(name = "USER_CODE")
	//@GeneratedValue(generator = "assignedGenerator")
	//@GenericGenerator(name = "assignedGenerator", strategy = "assigned")
	@NotBlank(message = "字段不能为空")
	private String userCode;
	/**
	 * 业务系统ID null
	 */
	@Column(name = "OS_ID")
	@NotBlank(message = "字段不能为空")
	private String osId;

	/**用户类别
	 * C 客户， U 一般用户 ，S 客服 ，P 外部专家
	 */
	@Column(name = "USER_TYPE")
	@Length(max = 1, message = "字段长度不能大于{max}")
	private String  userType;

	/**
	 * 用户名称 null 
	 */
	@Column(name = "USER_NAME")
	@NotBlank(message = "字段不能为空")
	@Length(max = 100, message = "字段长度不能大于{max}")
	private String  userName;
	/**
	 * 用户头像
	 */
	@Column(name = "HEAD_SCULPTURE")
	@Length(max = 200, message = "字段长度不能大于{max}")
	private String  headSculpture;

	/**
	 * 最后服务的客户 null
	 */
	@Column(name = "SERVICE_OPTS")
	@Length(max = 1000, message = "字段长度不能大于{max}")
	private String  serviceOpts;
	/**
	 * 最后服务的客户 null 
	 */
	@Column(name = "CUSTOMER_SERVICE")
	@Length(max = 32, message = "字段长度不能大于{max}")
	private String  customerService;
	/**
	 * 最後活躍的時間
	 */
	@Column(name = "LAST_ACTIVE_DATE")
	@Temporal(TemporalType.TIMESTAMP)
	private Date  lastActiveDate;
	/**
	 * 创建人员 null 
	 */
	@Column(name = "CREATOR")
	@Length(max = 32, message = "字段长度不能大于{max}")
	private String  creator;
	/**
	 * 创建时间 null 
	 */
	@Column(name = "CREATE_TIME")
	@Temporal(TemporalType.TIMESTAMP)
	private Date  createTime;

	/**
	 * O online
	 * F offline
	 */
	@Transient
	private String userState;

	// Constructors
	/** default constructor */
	public WebImCustomer() {
	}
	/** minimal constructor */
	public WebImCustomer(String userCode,String  userName) {

		this.userCode = userCode;
		this.userName= userName; 		
	}

/** full constructor */
	public WebImCustomer(String userCode, String osId,String  userType, String  userName,String  headSculpture,
						 String  customerService,Date  lastActiveDate,String  creator,Date  createTime) {
		this.userCode = userCode;
		this.osId = osId;
		this.userType = userType;
		this.userName= userName;
		this.headSculpture = headSculpture;
		this.customerService= customerService;
		this.lastActiveDate = lastActiveDate;
		this.creator= creator;
		this.createTime= createTime;		
	}


	public String getOsId() {
		return this.osId;
	}
	
	public void setOsId(String osId) {
		this.osId = osId;
	}
  
	public String getUserCode() {
		return this.userCode;
	}
	
	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}
	
	

	// Property accessors
  
	public String getUserName() {
		return this.userName;
	}
	
	public void setUserName(String userName) {
		this.userName = userName;
	}
  
	public String getCustomerService() {
		return this.customerService;
	}
	
	public void setCustomerService(String customerService) {
		this.customerService = customerService;
	}
  
	public String getCreator() {
		return this.creator;
	}
	
	public void setCreator(String creator) {
		this.creator = creator;
	}
	/**用户类别
	 * C 客户， U 一般用户 ，S 客服 ，P 外部专家
	 */
	public String getUserType() {
		return userType;
	}
	/**用户类别
	 * C 客户， U 一般用户 ，S 客服 ，P 外部专家
	 */
	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getHeadSculpture() {
		return headSculpture;
	}

	public void setHeadSculpture(String headSculpture) {
		this.headSculpture = headSculpture;
	}

	public Date getLastActiveDate() {
		return lastActiveDate;
	}

	public void setLastActiveDate(Date lastActiveDate) {
		this.lastActiveDate = lastActiveDate;
	}

	public Date getCreateTime() {
		return this.createTime;
	}
	
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getServiceOpts() {
		return serviceOpts;
	}

	public void setServiceOpts(String serviceOpts) {
		this.serviceOpts = serviceOpts;
	}

	/**
	 * O online
	 * F offline
	 */
	public String getUserState() {
		if(userState==null)
			return "F";
		return userState;
	}
	/**
	 * O online
	 * F offline
	 */
	public void setUserState(String userState) {
		this.userState = userState;
	}


	public WebImCustomer copy(WebImCustomer other){
  
		this.setOsId(other.getOsId());  
		this.setUserCode(other.getUserCode());
  
		this.userName= other.getUserName();  
		this.customerService= other.getCustomerService();  
		this.creator= other.getCreator();  
		this.createTime= other.getCreateTime();
		this.userType= other.getUserType();
		this.headSculpture= other.getHeadSculpture();
		this.lastActiveDate= other.getLastActiveDate();
		this.serviceOpts = other.getServiceOpts();
		return this;
	}
	
	public WebImCustomer copyNotNullProperty(WebImCustomer other){
  
	if( other.getOsId() != null)
		this.setOsId(other.getOsId());  
	if( other.getUserCode() != null && !other.getUserCode().equals(""))
		this.setUserCode(other.getUserCode());
  
		if( other.getUserName() != null)
			this.userName= other.getUserName();  
		if( other.getCustomerService() != null)
			this.customerService= other.getCustomerService();  
		if( other.getCreator() != null)
			this.creator= other.getCreator();  
		if( other.getCreateTime() != null)
			this.createTime= other.getCreateTime();
		if( other.getUserType() != null)
			this.userType= other.getUserType();
		if( other.getHeadSculpture() != null)
			this.headSculpture= other.getHeadSculpture();
		if( other.getLastActiveDate() != null)
			this.lastActiveDate= other.getLastActiveDate();
		if( other.getServiceOpts() != null)
			this.serviceOpts= other.getServiceOpts();

		return this;
	}

	public WebImCustomer clearProperties(){
  
		this.userName= null;  
		this.customerService= null;  
		this.creator= null;  
		this.createTime= null;
		this.userType= null;
		this.headSculpture= null;
		this.lastActiveDate= null;
		this.serviceOpts = null;
		return this;
	}
}
