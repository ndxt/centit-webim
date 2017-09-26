package com.centit.im.web.po;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.centit.search.annotation.ESType;
import com.centit.search.document.ESDocument;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by codefan on 17-6-1.
 * @author codefan
 * @version 0.1
 */
@ESType(type="QUESTION_AND_ANSWER")
@Entity
@Table(name="QUESTION_AND_ANSWER")
public class QuestAndAnswer implements ESDocument, Serializable {
    public static final String ES_DOCUMENT_TYPE = "QUESTION_AND_ANSWER";
    private static final long serialVersionUID =  1L;

    /**
     * 问题标识
     */
    @ESType(type="text", revert = true)
    @Id
    @Column(name = "QUESTION_ID")
    @GeneratedValue(generator = "assignedGenerator")
    @GenericGenerator(name = "assignedGenerator", strategy = "assigned")
    private String questionId;

    /**
     * 所属系统
     */
    @ESType(type="text")
    @Column(name = "OS_ID")
    private String osId;
    /**
     * 所属业务
     */
    @ESType(type="text", revert = true)
    @Column(name = "OPT_ID")
    private String optId;

    /**
     * CHAR(1) comment '是否删除 T/F'
     */
    @Column(name = "DELETE_SIGN")
    private String  deleteSign;

    /**
     * 问题标题
     */
    @ESType(type="text",index = "analyzed", query = true, revert = true, highlight = true, analyzer = "ik_smart")
    @Column(name = "QUESTION_TITLE")
    private String questionTitle;

    /**
     * 关键字
     */
    @ESType(type="text",index = "analyzed", query = true, revert = false, highlight = true, analyzer = "ik_smart")
    @Column(name = "KEY_WORDS")
    private String keyWords;

    /**
     * 问题标题联url
     */
    @ESType(type="text")
    @Column(name = "QUESTION_URL")
    private String questionUrl;

    /**
     * 问题回答和内容
     */
    @ESType(type="text",index = "analyzed", query = true, revert = true, highlight = true, analyzer = "ik_smart")
    @Column(name = "QUESTION_ANSWER")
    private String questionAnswer;


    @ESType(type="date")
    @Column(name = "CREATE_TIME")
    private Date createTime;

    /**
     * 创建人
     */
    @Column(name = "CREATOR")
    private String creator;
    /**
     * 更新时间
     */
    @Column(name = "LAST_UPDATE_TIME")
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
    public String toString(){
        return toJsonString();
    }

    public String toJsonString(){
        return JSON.toJSONString(this);
    }

    public String getOsId() {
        return osId;
    }

    public void setOsId(String osId) {
        this.osId = osId;
    }

    public String getOptId() {
        return optId;
    }

    public void setOptId(String optId) {
        this.optId = optId;
    }


    public String getQuestionTitle() {
        return questionTitle;
    }

    public void setQuestionTitle(String questionTitle) {
        this.questionTitle = questionTitle;
    }

    public String getQuestionUrl() {
        return questionUrl;
    }

    public void setQuestionUrl(String questionUrl) {
        this.questionUrl = questionUrl;
    }

    public String getQuestionAnswer() {
        return questionAnswer;
    }

    public void setQuestionAnswer(String questionAnswer) {
        this.questionAnswer = questionAnswer;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public String getDeleteSign() {
        return deleteSign;
    }

    public void setDeleteSign(String deleteSign) {
        this.deleteSign = deleteSign;
    }

    public String getKeyWords() {
        return keyWords;
    }

    public void setKeyWords(String keyWords) {
        this.keyWords = keyWords;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public Date getLastUpdateTime() {
        return lastUpdateTime;
    }

    public void setLastUpdateTime(Date lastUpdateTime) {
        this.lastUpdateTime = lastUpdateTime;
    }

    @Override
    //@JSONField(serialize=false,deserialize=false)
    public String obtainDocumentId() {
        return questionId;
    }

    @Override
    //@JSONField(serialize=false,deserialize=false)
    public String obtainDocumentType() {
        return ES_DOCUMENT_TYPE;
    }


    @Override
    public JSONObject toJSONObject() {
        return (JSONObject)JSON.toJSON(this);
    }
}
