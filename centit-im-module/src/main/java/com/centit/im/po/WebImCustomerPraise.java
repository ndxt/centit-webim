package com.centit.im.po;

import com.centit.support.database.orm.GeneratorType;
import com.centit.support.database.orm.ValueGenerator;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.*;
import java.util.Date;


/**
 * create by scaffold 2017-05-26
 * @author codefan@sina.com

  客服评价null
*/
@Data
@Entity
@Table(name = "F_WEB_IM_CUSTOMER_PRAISE")
public class WebImCustomerPraise implements java.io.Serializable {
    private static final long serialVersionUID =  1L;

    /**
     * 评价ID null
     */
    @Id
    @Column(name = "PRAISE_ID")
    @ValueGenerator(strategy = GeneratorType.UUID22)
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
    @Temporal(TemporalType.TIMESTAMP)
    @ValueGenerator(strategy = GeneratorType.FUNCTION, value = "today()")
    private Date  createTime;

    // Constructors
    /* default constructor */
    public WebImCustomerPraise() {
    }

}
