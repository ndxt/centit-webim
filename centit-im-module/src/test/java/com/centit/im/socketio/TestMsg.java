package com.centit.im.socketio;

import com.centit.im.po.ImMessage;

public class TestMsg {
    public static void main(String[] args) {
        ImMessage msg = ImMessageUtils.fromJSonString("{'beat':'beat'}");
        switch (msg.getType()){
            case "A":
                System.out.println("ok");
                break;
            default:
                System.out.println("done nvl");
                break;
        }
    }
}
