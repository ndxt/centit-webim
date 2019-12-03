package com.centit.im.po;

import com.centit.support.database.orm.GeneratorCondition;
import com.centit.support.database.orm.GeneratorType;
import com.centit.support.database.orm.ValueGenerator;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import java.util.Date;


/**
 * create by scaffold 2017-05-26
 * @author codefan@sina.com

  好友别名和备注用于为好友（同事）重命名 和 填写备注信息
*/
@Data
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
    //@NotBlank(message = "字段不能为空")
    @Length(max = 20, message = "字段长度不能大于{max}")
    @ValueGenerator(strategy = GeneratorType.CONSTANT, value = ImMessage.DEFAULT_OSID)
    private String  osId;
    /**
     * 最后更改时间 null
     */
    @Column(name = "LAST_UPDATE_TIME")
    @Temporal(TemporalType.TIMESTAMP)
    @ValueGenerator(strategy = GeneratorType.FUNCTION,
            condition = GeneratorCondition.ALWAYS, value = "today()")
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

}
