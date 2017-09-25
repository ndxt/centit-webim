package com.centit.im.web.plugins;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.centit.search.annotation.ESType;
import com.centit.search.document.ESDocument;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by codefan on 17-6-1.
 */
@ESType(type="file")
public class QuestDocument implements ESDocument, Serializable {
    public static final String ES_DOCUMENT_TYPE = "file";
    private static final long serialVersionUID =  1L;
    /**
     * 所属系统
     */
    @ESType(type="text")
    private String osId;
    /**
     * 所属业务
     */
    @ESType(type="text")
    private String optId;

    /**
     * 关联的业务对象主键 键值对形式
     */
    @ESType(type="text")
    private String optTag;
    /**
     * 问题标题
     */
    @ESType(type="text",index = "analyzed", query = true, revert = false, highlight = true, analyzer = "ik_smart")
    private String questionTitle;
    /**
     * 问题标题联url
     */
    @ESType(type="text")
    private String questionUrl;

    /**
     * 问题回答和内容
     */
    @ESType(type="text",index = "analyzed", query = true, revert = false, highlight = true, analyzer = "ik_smart")
    private String questionAnswer;


    @ESType(type="date")
    private Date createTime;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (!(o instanceof QuestDocument)) return false;

        QuestDocument that = (QuestDocument) o;

        if (!getOsId().equals(that.getOsId())) return false;
        if (!getQuestionTitle().equals(that.getQuestionTitle())) return false;
        return true;
    }

    @Override
    public int hashCode() {
        int result = getOsId().hashCode();
        result = 31 * result + getQuestionTitle().hashCode();
        return result;
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

    public String getOptTag() {
        return optTag;
    }

    public void setOptTag(String optTag) {
        this.optTag = optTag;
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

    @Override
    //@JSONField(serialize=false,deserialize=false)
    public String obtainDocumentId() {
        return questionTitle;
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
