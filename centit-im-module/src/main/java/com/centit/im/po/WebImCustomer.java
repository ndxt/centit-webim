package com.centit.im.po;

import com.centit.support.database.orm.GeneratorType;
import com.centit.support.database.orm.ValueGenerator;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import java.util.Date;


/**
 * create by scaffold 2017-05-23
 * @author codefan@sina.com

  匿名用户（ 用于客服模式）匿名用户（ 用于客服模式）

用户的ID为 各个系统的用户ID ，或者由前端根据 前端的硬件属性生产一个唯一的编号
*/
@Data
@Entity
@Table(name = "F_WEB_IM_CUSTOMER")
public class WebImCustomer implements java.io.Serializable {
    private static final long serialVersionUID =  1L;

    /**
     * 用户代码 用户的ID为 各个系统的用户ID ，或者由前端根据 前端的硬件属性生产一个唯一的编号
     */
    @Id
    @Column(name = "USER_CODE")
    //@NotBlank(message = "字段不能为空")
    @ValueGenerator(strategy = GeneratorType.UUID)
    private String userCode;
    /**
     * 业务系统ID null
     */
    @Column(name = "OS_ID")
    //@NotBlank(message = "字段不能为空")
    @ValueGenerator(strategy = GeneratorType.CONSTANT, value = ImMessage.DEFAULT_OSID)
    private String osId;

    /**用户类别
     * C 客户， U 一般用户 ，S 客服， P 外部专家
     */
    @Column(name = "USER_TYPE")
    @Length(max = 1, message = "字段长度不能大于{max}")
    private String userType;

    /**
     * 用户名称 null
     */
    @Column(name = "USER_NAME")
    //@NotBlank(message = "字段不能为空")
    @Length(max = 100, message = "字段长度不能大于{max}")
    private String userName;
    /**
     * 用户头像
     */
    @Column(name = "HEAD_SCULPTURE")
    @Length(max = 200, message = "字段长度不能大于{max}")
    private String headSculpture;

    /**
     * 最后服务的客户 null
     */
    @Column(name = "SERVICE_OPTS")
    @Length(max = 1000, message = "字段长度不能大于{max}")
    private String serviceOpts;
    /**
     * 最后服务的客户 null
     */
    @Column(name = "CUSTOMER_SERVICE")
    @Length(max = 32, message = "字段长度不能大于{max}")
    private String customerService;
    /**
     * 最後活躍的時間
     */
    @Column(name = "LAST_ACTIVE_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastActiveDate;
    /**
     * 创建人员 null
     */
    @Column(name = "CREATOR")
    @Length(max = 32, message = "字段长度不能大于{max}")
    private String creator;
    /**
     * 创建时间 null
     */
    @Column(name = "CREATE_TIME")
    @Temporal(TemporalType.TIMESTAMP)
    @ValueGenerator(strategy = GeneratorType.FUNCTION, value = "today()")
    private Date  createTime;

    /**
     * O online
     * F offline
     */
    @Transient
    private String userState;

    // Constructors
    /* default constructor */
    public WebImCustomer() {
    }
    /* minimal constructor */
    public WebImCustomer(String userCode,String  userName) {
        this.userCode = userCode;
        this.userName= userName;
    }

    /**
     * @return  O online  F offline
     */
    public String getUserState() {
        if(userState==null)
            return "F";
        return userState;
    }

}
