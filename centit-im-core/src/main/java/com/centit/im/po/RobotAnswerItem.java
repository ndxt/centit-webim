package com.centit.im.po;

import lombok.Data;

/**
 * Created by codefan on 17-6-19.
 */
@Data
public class RobotAnswerItem {
    private String label;
    private String type;
    private String value;

    public RobotAnswerItem(){

    }

    public RobotAnswerItem(String label, String type, String value){
        this.label = label;
        this.type = type;
        this.value = value;
    }

}
