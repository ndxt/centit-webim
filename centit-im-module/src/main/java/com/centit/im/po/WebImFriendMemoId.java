package com.centit.im.po;

import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 * FriendMemoId  entity.
 * create by scaffold 2017-05-26
 * @author codefan@sina.com
 * 好友别名和备注用于为好友（同事）重命名 和 填写备注信息
*/
//好友别名和备注 的主键
@Embeddable
public class WebImFriendMemoId implements java.io.Serializable {
    private static final long serialVersionUID =  1L;

    /**
     * 用户代码 null
     */
    @Column(name = "USER_CODE")
    @NotBlank(message = "字段不能为空")
    private String userCode;

    /**
     * 好友代码 null
     */
    @Column(name = "FRIEND_CODE")
    @NotBlank(message = "字段不能为空")
    private String friendCode;

    // Constructors
    /* default constructor */
    public WebImFriendMemoId() {
    }
    /* full constructor */
    public WebImFriendMemoId(String userCode, String friendCode) {

        this.userCode = userCode;
        this.friendCode = friendCode;
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


    public boolean equals(Object other) {
        if ((this == other))
            return true;
        if ((other == null))
            return false;
        if (!(other instanceof WebImFriendMemoId))
            return false;

        WebImFriendMemoId castOther = (WebImFriendMemoId) other;
        boolean ret;

        ret = this.getUserCode() == castOther.getUserCode() ||
                       (this.getUserCode() != null && castOther.getUserCode() != null
                               && this.getUserCode().equals(castOther.getUserCode()));

        ret = ret && ( this.getFriendCode() == castOther.getFriendCode() ||
                       (this.getFriendCode() != null && castOther.getFriendCode() != null
                               && this.getFriendCode().equals(castOther.getFriendCode())));

        return ret;
    }

    public int hashCode() {
        int result = 17;

        result = 37 * result +
             (this.getUserCode() == null ? 0 :this.getUserCode().hashCode());

        result = 37 * result +
             (this.getFriendCode() == null ? 0 :this.getFriendCode().hashCode());

        return result;
    }
}
