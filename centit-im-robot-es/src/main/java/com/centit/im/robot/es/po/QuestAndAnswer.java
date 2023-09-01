package com.centit.im.robot.es.po;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.centit.search.annotation.ESField;
import com.centit.search.annotation.ESType;
import com.centit.search.document.ESDocument;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by codefan on 17-6-1.
 * @author codefan
 * @version 0.1
 */
@Data
@Entity
@ESType(indexName = "webim")
public class QuestAndAnswer implements ESDocument, Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 问题标识
     */
    @Id
    @ESField(type = "text", index = true)
    private String questionId;

    /**
     * 所属系统
     */
    @ESField(type = "text", index = true)
    private String osId;
    /**
     * 所属业务
     */
    @ESField(type = "text", index = true)
    private String optId;


    /**
     * 问题标题
     */
    @ESField(type = "text", index = true, query = true, highlight = true, analyzer = "ik_smart")
    private String questionTitle;

    /**
     * 关键字
     */
    @ESField(type = "text", index = true, query = true, highlight = true, analyzer = "ik_smart")
    private String keyWords;

    /**
     * 问题标题联url
     */
    @ESField(type = "text")
    private String questionUrl;

    /**
     * 问题回答和内容
     */
    @ESField(type = "text", index = true, query = true, highlight = true, analyzer = "ik_smart")
    private String questionAnswer;


    @ESField(type = "date", index = true)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createTime;

    /**
     * 创建人
     */
    @ESField(type = "text", index = true)
    private String creator;
    /**
     * 更新时间
     */
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastUpdateTime;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof QuestAndAnswer)) return false;
        QuestAndAnswer that = (QuestAndAnswer) o;
        if (!getQuestionId().equals(that.getQuestionId())) return false;
        return true;
    }

    @Override
    public int hashCode() {
        return getQuestionId().hashCode();
    }

    @Override
    public String toString() {
        return toJsonString();
    }

    public String toJsonString() {
        return JSON.toJSONString(this);
    }


    @Override
    //@JSONField(serialize=false,deserialize=false)
    public String obtainDocumentId() {
        return questionId;
    }


    @Override
    public JSONObject toJSONObject() {
        return (JSONObject) JSON.toJSON(this);
    }

}
