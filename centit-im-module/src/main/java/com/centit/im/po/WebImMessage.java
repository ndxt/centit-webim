package com.centit.im.po;

import com.alibaba.fastjson.JSON;
import com.centit.im.socketio.ImMessage;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;
import java.util.Date;


/**
 * create by scaffold 2017-05-23 
 * @author codefan@sina.com
 
  消息记录null   
*/
@Entity
@Table(name = "F_WEB_IM_MESSAGE")
public class WebImMessage implements java.io.Serializable {
	private static final long serialVersionUID =  1L;
	/**
	 * 消息ID null 
	 */
	@Id
	@Column(name = "MSG_ID")
	@GeneratedValue(generator = "assignedGenerator")
	@GenericGenerator(name = "assignedGenerator", strategy = "assigned")
	//UuidOpt.getUuidAsString32()
	private String msgId;

	/**
	 * 业务系统ID null 
	 */
	@Column(name = "OS_ID")
	@NotBlank(message = "字段不能为空")
	@Length(max = 20, message = "字段长度不能大于{max}")
	private String  osId;
	/**
	 * 消息类别 C chat  G Group  S 系统信息，比如文字
	 */
	@Column(name = "MSG_TYPE")
	@NotBlank(message = "字段不能为空")
	@Length(max = 1, message = "字段长度不能大于{max}")
	private String  msgType;
	/**
	 * 发送人员 null 
	 */
	@Column(name = "SENDER")
	@NotBlank(message = "字段不能为空")
	@Length(max = 32, message = "字段长度不能大于{max}")
	private String  sender;
	/**
	 * 发送人姓名
	 */
	@Column(name = "SENDER_NAME")
	@Length(max = 100, message = "字段长度不能大于{max}")
	private String  senderName;
	/**
	 * 接收人员（组） null 
	 */
	@Column(name = "RECEIVER")
	@NotBlank(message = "字段不能为空")
	@Length(max = 32, message = "字段长度不能大于{max}")
	private String  receiver;
	/**
	 * 发送时间 null 
	 */
	@Column(name = "SEND_TIME")
	@Temporal(TemporalType.TIMESTAMP)
	private Date  sendTime;
	/**
	 * 状态 U 未读 C  已读 
	 */
	@Column(name = "MSG_STATE")
	@Length(max = 1, message = "字段长度不能大于{max}")
	private String  msgState;
	/**
	 * 内容 null 
	 */
	@Column(name = "CONTENT")
	@Length(max = 1000, message = "字段长度不能大于{max}")
	private String  content;

	/** default constructor */
	public WebImMessage() {
		this.osId= ImMessage.DEFAULT_OSID;
	}

	/**
	 * minimal constructor
	 * @param msgId 消息ID
	 * @param msgType 消息类型
	 * @param sender 发送者
	 * @param receiver 接受者
	 */
	public WebImMessage(
		String msgId,String  msgType,String  sender,String  receiver) {
		this.msgId = msgId;
		this.osId= ImMessage.DEFAULT_OSID;
		this.msgType= msgType; 
		this.sender= sender; 
		this.receiver= receiver; 		
	}

	public WebImMessage(
	 String msgId,String  msgType,String  sender,String  receiver,Date  sendTime,String  msgState,String  content,String senderName) {
		this.msgId = msgId;
		this.osId= ImMessage.DEFAULT_OSID;
		this.msgType= msgType;
		this.sender= sender;
		this.receiver= receiver;
		this.sendTime= sendTime;
		this.msgState= msgState;
		this.content= content;
		this.senderName= senderName;
	}

  
	public String getMsgId() {
		return this.msgId;
	}

	public void setMsgId(String msgId) {
		this.msgId = msgId;
	}

	public String getOsId() {
		return this.osId;
	}
	
	public void setOsId(String osId) {
		this.osId = osId;
	}
  
	public String getMsgType() {
		return this.msgType;
	}
	
	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}
  
	public String getSender() {
		return this.sender;
	}
	
	public void setSender(String sender) {
		this.sender = sender;
	}
  
	public String getReceiver() {
		return this.receiver;
	}
	
	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}
  
	public Date getSendTime() {
		return this.sendTime;
	}
	
	public void setSendTime(Date sendTime) {
		this.sendTime = sendTime;
	}
  
	public String getMsgState() {
		return this.msgState;
	}
	
	public void setMsgState(String msgState) {
		this.msgState = msgState;
	}
  
	public String getContent() {
		return this.content;
	}
	
	public void setContent(String content) {
		this.content = content;
	}

	public String getSenderName() {
		return senderName;
	}

	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}

	public WebImMessage copy(ImMessage other){
		this.sender= other.getSender();
		this.receiver= other.getReceiver();
		this.sendTime= other.getSendTime();
		this.senderName= other.getSenderName();
		this.content = JSON.toJSONString(other.getContent());
		this.msgType= other.getType();
		return this;
	}

	public WebImMessage copy(WebImMessage other){
  
		this.setMsgId(other.getMsgId());
		this.osId= other.getOsId();  
		this.msgType= other.getMsgType();  
		this.sender= other.getSender();  
		this.receiver= other.getReceiver();  
		this.sendTime= other.getSendTime();  
		this.msgState= other.getMsgState();  
		this.content= other.getContent();
		this.senderName= other.getSenderName();
		return this;
	}
	
	public WebImMessage copyNotNullProperty(WebImMessage other){
  
	if( other.getMsgId() != null)
		this.setMsgId(other.getMsgId());
  
		if( other.getOsId() != null)
			this.osId= other.getOsId();  
		if( other.getMsgType() != null)
			this.msgType= other.getMsgType();  
		if( other.getSender() != null)
			this.sender= other.getSender();  
		if( other.getReceiver() != null)
			this.receiver= other.getReceiver();  
		if( other.getSendTime() != null)
			this.sendTime= other.getSendTime();  
		if( other.getMsgState() != null)
			this.msgState= other.getMsgState();  
		if( other.getContent() != null)
			this.content= other.getContent();
		if( other.getSenderName() != null)
			this.senderName= other.getSenderName();

		return this;
	}

	public WebImMessage clearProperties(){
  
		this.osId= null;  
		this.msgType= null;  
		this.sender= null;  
		this.receiver= null;  
		this.sendTime= null;  
		this.msgState= null;  
		this.content= null;
		this.senderName= null;

		return this;
	}
}
