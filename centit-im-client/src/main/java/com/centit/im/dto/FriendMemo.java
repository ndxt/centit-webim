package com.centit.im.dto;
import lombok.Data;

import java.util.Date;


/**
 * create by scaffold 2017-05-26
 * @author codefan@sina.com

  好友别名和备注用于为好友（同事）重命名 和 填写备注信息
*/
@Data
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
    /* default constructor */
    public FriendMemo() {
    }

}
