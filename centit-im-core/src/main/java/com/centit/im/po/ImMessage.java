package com.centit.im.po;

import com.alibaba.fastjson2.JSON;
import com.centit.support.algorithm.StringBaseOpt;
import lombok.Data;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by codefan on 17-5-20.
 */
@Data
public class ImMessage implements  java.io.Serializable {
    private static final long serialVersionUID =  1L;

    public static final String DEFAULT_OSID="WebIM";

    public static final String USER_STATE_ONLINE = "O";
    public static final String USER_STATE_OFFLINE = "F";

    public static final String MSG_TYPE_CHAT = "C";
    public static final String MSG_TYPE_QUESTION = "Q";
    public static final String MSG_TYPE_GROUP = "G";
    public static final String MSG_TYPE_SYSTEM = "S";
    public static final String MSG_TYPE_COMMAND = "M";
    public static final String MSG_TYPE_BROADCAST = "B";
    public static final String MSG_TYPE_TO_ALL = "A";
    public static final String MSG_TYPE_UNKNOWN = "U";
    public static final String MSG_TYPE_BEAT = "T";
    /**
     * chat 一对一聊天
     * group    群聊
     * toall 群发所有人
     * system 系统通知
     * command 命令
     * broadcast 广播
     */
    private String type;

    public static final String CONTENT_TYPE_TEXT = "text";
    public static final String CONTENT_TYPE_FILE = "file";
    public static final String CONTENT_TYPE_IMAGE = "image";
    public static final String CONTENT_TYPE_VOICE = "voice";
    public static final String CONTENT_TYPE_VIDEO = "video";

    /**
     *  command 命令
     */
    public static final String CONTENT_TYPE_REGISTER = "register";
    public static final String CONTENT_TYPE_SIGN_OUT = "signOut";
    public static final String CONTENT_TYPE_READ = "read";
    public static final String CONTENT_TYPE_READGROUP = "readGroup";
    public static final String CONTENT_TYPE_SERVICE = "service";
    public static final String CONTENT_TYPE_OFFLINE = "offline";
    public static final String CONTENT_TYPE_RECONNECT = "reconnect";
    public static final String CONTENT_TYPE_ASKFORSERVICE = "askForService";
    public static final String CONTENT_TYPE_ASKROBOT = "askRobot";
    public static final String CONTENT_TYPE_NOTICE = "notice";
    //信息更新
    public static final String CONTENT_TYPE_UPDATE_INFO = "update";
    public static final String CONTENT_TYPE_QUIT_GROUP = "quitGroup";
    public static final String CONTENT_TYPE_DELETE_FRIEND = "deleteFriend";
    public static final String CONTENT_TYPE_DELETE_GROUP = "deleteGroup";
    public static final String CONTENT_TYPE_PUSH_FORM = "pushForm";
    public static final String CONTENT_TYPE_FORM = "form";

    /**
     -- 对应 chat group toall --
     * text
     * file
     * image
     -- 对应 broadcast --
     * state 状态变更 比如离线
     -- 对应 command --
     * form 表单
     * pushForm 推送表单
     * register 匿名用户注册
     * read 查看信息，读取状态
     * readgroup 查看组信息,设置（查看）读取时间
     * askforservice 呼叫客服
     * service 客服抢单
     */
    private String contentType;

    public static final String CONTENT_FIELD_MESSAGE = "msg";
    public static final String CONTENT_FIELD_FILE = "file";

    /**
     * 消息ID
     */
    private String msgId;

    /**
     * 消息内容，可能式富文本，
     */
    private Map<String,Object> content;
    /**
     * 发送方
     */
    private String sender;/*from*/
    /**
     * 接收方
     */
    private String receiver;
    /**
     * 发送时间，客户端不填写，默认为当前时间
     */
    private Date sendTime;
    /**
     * 发送人姓名
     */
    private String senderName;/*from*/
    /**
     * @return JSON IM前端的JSON格式
     */
    public  long getLongSendTime(){
        if(sendTime==null)
            return 0L;
        return sendTime.getTime();
    }

    public ImMessage(){

    }

    @Override
    public String toString() {
        return JSON.toJSONString(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ImMessage)) return false;

        ImMessage imMessage = (ImMessage) o;

        if (!getType().equals(imMessage.getType())) return false;
        if (!getSender().equals(imMessage.getSender())) return false;
        if (!getReceiver().equals(imMessage.getReceiver())) return false;
        return getSendTime().equals(imMessage.getSendTime());

    }

    @Override
    public int hashCode() {
        int result = getType().hashCode();
        result = 31 * result + getSender().hashCode();
        result = 31 * result + getReceiver().hashCode();
        result = 31 * result + getSendTime().hashCode();
        return result;
    }

    public boolean hasContent() {
        return (content!=null && content.size()>0);
    }

    public Map<String,Object> getContent() {
        if(content==null)
            content = new HashMap<>(8);
        return content;
    }

    public String fetchContentString(String key){
        if(this.content==null)
            return null;
        return StringBaseOpt.objectToString(this.content.get(key));
    }
}
