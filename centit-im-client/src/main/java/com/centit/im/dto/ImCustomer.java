package com.centit.im.dto;

import lombok.Data;

import java.util.Date;


/**
 * create by scaffold 2017-05-23
 * @author codefan@sina.com

  匿名用户（ 用于客服模式）匿名用户（ 用于客服模式）

用户的ID为 各个系统的用户ID ，或者由前端根据 前端的硬件属性生产一个唯一的编号
*/
@Data
public class ImCustomer implements java.io.Serializable {
    private static final long serialVersionUID =  1L;

    /**
     * 用户代码 用户的ID为 各个系统的用户ID ，或者由前端根据 前端的硬件属性生产一个唯一的编号
     */
    private String userCode;
    /**
     * 业务系统ID null
     */
    private String osId;

    /**用户类别
     * C 客户， U 一般用户 ，S 客服 ，P 外部专家
     */
    private String  userType;

    /**
     * 用户名称 null
     */
    private String  userName;
    /**
     * 用户头像
     */
    private String  headSculpture;

    /**
     * 最后服务的客户 null
     */
    private String  serviceOpts;
    /**
     * 最后服务的客户 null
     */
    private String  customerService;
    /**
     * 最後活躍的時間
     */
    private Date  lastActiveDate;
    /**
     * 创建人员 null
     */
    private String  creator;
    /**
     * 创建时间 null
     */
    private Date  createTime;

    /**
     * O online
     * F offline
     */
    private String userState;

    public ImCustomer() {
    }

    /**
     * 获取用户状态
     * O online
     * F offline
     * @return 返回状态码
     */
    public String getUserState() {
        if(userState==null)
            return "F";
        return userState;
    }
}
