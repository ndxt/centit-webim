package com.centit.im.po;

import com.alibaba.fastjson2.JSON;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by codefan on 17-6-19.
 */
@Data
public class RobotAnswer {
    private String message;
    private List<RobotAnswerItem> options;

    public RobotAnswer(){

    }

    public RobotAnswer(String message) {
        this.message = message;

    }

    public RobotAnswer addHttpOption(String label, String url){
        if(options==null)
            options = new ArrayList<>(10);
        options.add(new RobotAnswerItem(label,"http",url));
        return this;
    }

    public RobotAnswer addQuestionOption(String label, String question){
        if(options==null)
            options = new ArrayList<>(10);
        options.add(new RobotAnswerItem(label,"question",question));
        return this;
    }

    public RobotAnswer addCommandOption(String label, String commandJson){
        if(options==null)
            options = new ArrayList<>(10);
        options.add(new RobotAnswerItem(label,"command",commandJson));
        return this;
    }

    public String toJsonString(){
        return JSON.toJSONString(this);
    }

    public static RobotAnswer createTestAnswer(){
        RobotAnswer answer = new RobotAnswer("没有对应的 机器人，请联系系统开发人员");
        answer.addHttpOption("测试外部链接","http://www.baidu.com");
        answer.addQuestionOption("测试其他问题","另一个不会有人回答的问题！");
        answer.addCommandOption("转人工服务", ImMessage.CONTENT_TYPE_ASKFORSERVICE);
        return answer;
    }

}
