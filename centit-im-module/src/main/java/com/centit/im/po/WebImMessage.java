package com.centit.im.po;

import com.alibaba.fastjson.JSON;
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
  消息记录null
*/
@Data
@Entity
@Table(name = "F_WEB_IM_MESSAGE")
public class WebImMessage implements java.io.Serializable {
    private static final long serialVersionUID =  1L;

    /**
     * 消息ID null
     */
    @Id
    @Column(name = "MSG_ID")
    @ValueGenerator(strategy = GeneratorType.UUID22)
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
    @ValueGenerator(strategy = GeneratorType.FUNCTION, value = "today()")
    private Date  sendTime;
    /**
     * 状态 U 未读 C 已读
     */
    @Column(name = "MSG_STATE")
    @Length(max = 1, message = "字段长度不能大于{max}")
    private String  msgState;
    /**
     * 内容 null
     */
    @Column(name = "CONTENT_TYPE")
    @Length(max = 20, message = "内容类型字段长度不能大于{max}")
    private String  contentType;
    /**
     * 内容 null
     */
    @Column(name = "CONTENT")
    @Length(max = 1000, message = "字段长度不能大于{max}")
    private String  content;

    /* default constructor */
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
        String msgId, String  msgType,String  sender,String  receiver) {
        this.msgId = msgId;
        this.osId= ImMessage.DEFAULT_OSID;
        this.msgType= msgType;
        this.sender= sender;
        this.receiver= receiver;
    }

    public WebImMessage copy(ImMessage other){
        this.sender= other.getSender();
        this.receiver= other.getReceiver();
        this.sendTime= other.getSendTime();
        this.senderName= other.getSenderName();
        this.contentType = other.getContentType();
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
        this.contentType = other.getContentType();
        this.content= other.getContent();
        this.senderName= other.getSenderName();
        return this;
    }

}
