package com.centit.im.po;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 * WebImReadGroupId  entity.
 * create by scaffold 2017-05-23
 * @author codefan@sina.com
 * 用户组信息查看时间用来记录 组信息 成功推送到给这个用户的时间，这个时间之后的信息 都是这个用户 关于该组的未读信息
*/
@Data
@Embeddable
public class WebImGroupMemberId implements java.io.Serializable {
    private static final long serialVersionUID =  1L;

    /**
     * 用户代码 null
     */
    @Column(name = "USER_CODE")
    //@NotBlank(message = "字段不能为空")
    private String userCode;

    /**
     * 组代码 null
     */
    @Column(name = "UNIT_CODE")
    //@NotBlank(message = "字段不能为空")
    private String groupId;

    /* default constructor */
    public WebImGroupMemberId() {
    }

    public WebImGroupMemberId( String groupId, String userCode) {
        this.userCode = userCode;
        this.groupId = groupId;
    }

    public boolean equals(Object other) {
        if ((this == other))
            return true;
        if ((other == null))
            return false;
        if (!(other instanceof WebImGroupMemberId))
            return false;

        WebImGroupMemberId castOther = (WebImGroupMemberId) other;
        boolean ret ;

        ret = this.getUserCode() == castOther.getUserCode() ||
                       (this.getUserCode() != null && castOther.getUserCode() != null
                               && this.getUserCode().equals(castOther.getUserCode()));

        ret = ret && ( this.getGroupId() == castOther.getGroupId() ||
                       (this.getGroupId() != null && castOther.getGroupId() != null
                               && this.getGroupId().equals(castOther.getGroupId())));

        return ret;
    }

    public int hashCode() {
        int result = 17;

        result = 37 * result +
             (this.getUserCode() == null ? 0 :this.getUserCode().hashCode());

        result = 37 * result +
             (this.getGroupId() == null ? 0 :this.getGroupId().hashCode());

        return result;
    }
}
