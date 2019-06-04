package com.centit.im.robot.es.po;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.centit.search.annotation.ESField;
import com.centit.search.annotation.ESType;
import com.centit.search.document.ESDocument;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by codefan on 17-6-1.
 * @author codefan
 * @version 0.1
 */
@ESType(indexName="webim")
@Entity
public class QuestAndAnswer implements ESDocument, Serializable {
    private static final long serialVersionUID =  1L;

    /**
     * 问题标识
     */
    @ESField(type="text",index = true)
    @Id
    //@GeneratedValue(generator = "assignedGenerator")
    //@GenericGenerator(name = "assignedGenerator", strategy = "assigned")
    private String questionId;

    /**
     * 所属系统
     */
    @ESField(type="text",index = true)
    private String osId;
    /**
     * 所属业务
     */
    @ESField(type="text",index = true)
    private String optId;


    /**
     * 问题标题
     */
    @ESField(type="text",index = true, query = true, highlight = true, analyzer = "ik_smart")
    private String questionTitle;

    /**
     * 关键字
     */
    @ESField(type="text",index = true, query = true, revert = false, highlight = true, analyzer = "ik_smart")
    private String keyWords;

    /**
     * 问题标题联url
     */
    @ESField(type="text", revert = true)
    private String questionUrl;

    /**
     * 问题回答和内容
     */
    @ESField(type="text",index = true, query = true, highlight = true, analyzer = "ik_smart")
    private String questionAnswer;


    @ESField(type="date",index = true)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createTime;

    /**
     * 创建人
     */
    @ESField(type="text",index = true)
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
    public JSONObject toJSONObject() {
        return (JSONObject)JSON.toJSON(this);
    }

    public QuestAndAnswer copyNotNullProperty(QuestAndAnswer other){

        if( other.getQuestionId() != null)
            this.questionId= other.getQuestionId();
        if( other.getOsId() != null)
            this.osId= other.getOsId();
        if( other.getOptId() != null)
            this.optId= other.getOptId();
        if( other.getCreator() != null)
            this.creator= other.getCreator();
        if( other.getCreateTime() != null)
            this.createTime= other.getCreateTime();
        if( other.getQuestionTitle() != null)
            this.questionTitle= other.getQuestionTitle();
        if( other.getKeyWords() != null)
            this.keyWords= other.getKeyWords();
        if( other.getQuestionUrl() != null)
            this.questionUrl= other.getQuestionUrl();
        if( other.getQuestionAnswer() != null)
            this.questionAnswer= other.getQuestionAnswer();
        if( other.getLastUpdateTime() != null)
            this.lastUpdateTime= other.getLastUpdateTime();
        return this;
    }

}
