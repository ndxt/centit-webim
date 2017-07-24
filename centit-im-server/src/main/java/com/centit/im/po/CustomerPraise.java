package com.centit.im.po;

import java.util.Date;
import java.sql.Timestamp;
import javax.persistence.Column;


import javax.persistence.Id;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import javax.persistence.GeneratedValue;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;


/**
 * create by scaffold 2017-05-26 
 * @author codefan@sina.com
 
  客服评价null   
*/
@Entity
@Table(name = "F_CUSTOMER_PRAISE")
public class CustomerPraise implements java.io.Serializable {
	private static final long serialVersionUID =  1L;



	/**
	 * 评价ID null 
	 */
	@Id
	@Column(name = "PRAISE_ID")
	@GeneratedValue(generator = "assignedGenerator")
	@GenericGenerator(name = "assignedGenerator", strategy = "assigned")
	private String praiseId;

	/**
	 * 业务系统ID null 
	 */
	@Column(name = "OS_ID")
	@NotBlank(message = "字段不能为空")
	@Length(max = 20, message = "字段长度不能大于{max}")
	private String  osId;
	/**
	 * 用户代码 null 
	 */
	@Column(name = "USER_CODE")
	@Length(max = 32, message = "字段长度不能大于{max}")
	private String  userCode;
	/**
	 * 客户代码 null 
	 */
	@Column(name = "CUSTOMER_CODE")
	@NotBlank(message = "字段不能为空")
	@Length(max = 32, message = "字段长度不能大于{max}")
	private String  customerCode;
	/**
	 * 服务摘要 null 
	 */
	@Column(name = "SERVICE_SUMMARY")
	@Length(max = 200, message = "字段长度不能大于{max}")
	private String  serviceSummary;
	/**
	 * 服务评分 null 
	 */
	@Column(name = "SERVICE_SCORE")
	@NotBlank(message = "字段不能为空")
	private int  serviceScore;
	/**
	 * 评价时间 null 
	 */
	@Column(name = "CREATE_TIME")
	private Date  createTime;

	// Constructors
	/** default constructor */
	public CustomerPraise() {
	}
	/** minimal constructor */
	public CustomerPraise(
		String praiseId		
		,String  osId,String  customerCode,int  serviceScore) {
	
	
		this.praiseId = praiseId;		
	
		this.osId= osId; 
		this.customerCode= customerCode; 
		this.serviceScore= serviceScore; 		
	}

/** full constructor */
	public CustomerPraise(
	 String praiseId		
	,String  osId,String  userCode,String  customerCode,String  serviceSummary,int  serviceScore,Date  createTime) {
	
	
		this.praiseId = praiseId;		
	
		this.osId= osId;
		this.userCode= userCode;
		this.customerCode= customerCode;
		this.serviceSummary= serviceSummary;
		this.serviceScore= serviceScore;
		this.createTime= createTime;		
	}
	

  
	public String getPraiseId() {
		return this.praiseId;
	}

	public void setPraiseId(String praiseId) {
		this.praiseId = praiseId;
	}
	// Property accessors
  
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
  
	public String getCustomerCode() {
		return this.customerCode;
	}
	
	public void setCustomerCode(String customerCode) {
		this.customerCode = customerCode;
	}
  
	public String getServiceSummary() {
		return this.serviceSummary;
	}
	
	public void setServiceSummary(String serviceSummary) {
		this.serviceSummary = serviceSummary;
	}
  
	public int getServiceScore() {
		return this.serviceScore;
	}
	
	public void setServiceScore(int serviceScore) {
		this.serviceScore = serviceScore;
	}
  
	public Date getCreateTime() {
		return this.createTime;
	}
	
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}



	public CustomerPraise copy(CustomerPraise other){
  
		this.setPraiseId(other.getPraiseId());
  
		this.osId= other.getOsId();  
		this.userCode= other.getUserCode();  
		this.customerCode= other.getCustomerCode();  
		this.serviceSummary= other.getServiceSummary();  
		this.serviceScore= other.getServiceScore();  
		this.createTime= other.getCreateTime();

		return this;
	}
	
	public CustomerPraise copyNotNullProperty(CustomerPraise other){
  
	if( other.getPraiseId() != null)
		this.setPraiseId(other.getPraiseId());
  
		if( other.getOsId() != null)
			this.osId= other.getOsId();  
		if( other.getUserCode() != null)
			this.userCode= other.getUserCode();  
		if( other.getCustomerCode() != null)
			this.customerCode= other.getCustomerCode();  
		if( other.getServiceSummary() != null)
			this.serviceSummary= other.getServiceSummary();  
		if( other.getServiceScore() != -1)
			this.serviceScore= other.getServiceScore();  
		if( other.getCreateTime() != null)
			this.createTime= other.getCreateTime();		

		return this;
	}

	public CustomerPraise clearProperties(){
  
		this.osId= null;  
		this.userCode= null;  
		this.customerCode= null;  
		this.serviceSummary= null;  
		this.serviceScore= -1;
		this.createTime= null;

		return this;
	}
}
