package com.centit.im.po;

/**
 * Created by codefan on 17-6-19.
 */
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

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
