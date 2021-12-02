<template>
  <div class="container">
    <ChatBox
      :receiver="receiver"
      @sendMsg="sendMsg"
      @sendFile="sendFile"
      @closeBox="closeBox"
      @chatLogOpen="chatLogOpen"
      ref="chatBox"
    >
      <ChatLine
        v-for="(item, index) in webSocketMsg[receiver.receiverCode]"
        :item="item"
        :key="index"
      />
    </ChatBox>
    <NewMessageTip v-if="tipShow" @tipClick="tipClick" />
    <SideBar
      :boxStyle="boxStyle"
      @clickCustUser="clickCustUser"
      v-if="type === 'kefu'"
    />
    <ChatLog
      :userName="receiverName"
      @closeHistory="closeHistory"
      v-if="chatLogShow == true"
    >
      <ChatLine
        v-for="(item, index) in historyMessageList"
        :item="item"
        :key="index"
      />
    </ChatLog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { getHistoryMessage } from "@/api";
import ChatBox from "../components/ChatBox";
import ChatLine from "../components/ChatLine";
import SideBar from "../components/SideBar";
import NewMessageTip from "../components/NewMessageTip";
import ChatLog from "../components/ChatLog";

export default defineComponent({
  name: "Desktop",
  data() {
    return {
      // websocket
      $ws: null,
      lockReturn: false,
      timeout: 60 * 1000 * 5,
      timeoutObj: null,
      timeoutNum: null,
      serverTimeoutObj: null,
      // 聊天数据
      user: {
        userCode: "",
        userName: "",
      },
      receiver: {
        receiverCode: "",
        receiverName: "",
      },
      webSocketMsg: {},
      tipShow: false,
      tipReceiver: {},
      chatLogShow: false,
      historyMessageList: [],
    };
  },
  props: {
    userType: String,
    userCode: String,
    userName: String,
    receiverCode: String,
    receiverName: String,
    boxStyle: {
      type: Object,
      default: function () {
        return {
          zIndex: "10000",
          width: "260px",
          height: "520px",
          top: "0px",
          right: "0px",
          backgroundImage: "none",
        };
      },
    },
  },
  provide() {
    return {
      pvdData: {
        user: this.user,
        receiver: this.receiver,
      },
    };
  },
  components: {
    ChatBox,
    ChatLine,
    SideBar,
    NewMessageTip,
    ChatLog,
  },
  computed: {
    type() {
      return this.userType;
    },
  },
  methods: {
    // socket相关事件
    initWebSocket(wsurl) {
      this.$ws = new WebSocket(wsurl);
      this.$ws.onopen = this.wsOpen;
      this.$ws.onclose = this.wsClose;
      this.$ws.onmessage = this.wsMsg;
      this.$ws.onerror = this.wsError;
    },
    //打开websocket
    wsOpen() {
      //开始websocket心跳
      this.startWsHeartbeat();
      this.wsSend("register");
      this.wsSend("askForService");
    },
    wsClose(e) {
      console.log(e, "ws close");
    },
    wsMsg(msg) {
      //每次接收到服务端消息后 重置websocket心跳
      this.resetHeartbeat();
      this.pushNewMsg(msg);
    },
    wsError(err) {
      console.log(err, "ws error");
      this.reconnect();
    },
    wsSend(type, msg) {
      let data = {};
      switch (type) {
        // 注册
        case "register":
          data = {
            contentType: "register",
            receiver: "0",
            sendTime: +new Date(),
            sender: this.user.userCode,
            type: "M",
          };
          break;
        // 发送消息
        case "text":
          data = {
            content: { msg: msg },
            msg: msg,
            contentType: "text",
            receiver: this.receiver.receiverCode,
            sendTime: +new Date(),
            sender: this.user.userCode,
            senderName: this.user.userName,
            type: "C",
          };
          this.pushNewMsg({ data });
          break;
        case "askForService":
          data = {
            contentType: "askForService",
            sendTime: +new Date(),
            sender: this.user.userCode,
            type: "M",
          };
          break;
      }
      this.$ws.send(JSON.stringify(data));
    },
    //重启websocket
    reconnect() {
      if (this.lockReturn) {
        return;
      }
      this.lockReturn = true;
      this.timeoutNum && clearTimeout(this.timeoutNum);
      this.timeoutNum = setTimeout(() => {
        this.initWebSocket(
          "ws://" +
            window.location.host +
            "/api/ws/chat/im/" +
            this.user.userCode
        );
        this.lockReturn = false;
      }, 3000);
    },
    startWsHeartbeat() {
      this.timeoutObj && clearTimeout(this.timeoutObj);
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
      this.timeoutObj = setInterval(() => {
        //判断websocket当前状态
        if (this.$ws.readyState != 1) {
          this.reconnect();
        }
      }, this.timeout);
    },
    //重置websocket心跳
    resetHeartbeat() {
      clearTimeout(this.timeoutObj);
      clearTimeout(this.serverTimeoutObj);
      this.startWsHeartbeat();
    },
    // socket相关事件结束
    pushNewMsg(msg) {
      let msgTemp =
        typeof msg.data == "string" ? JSON.parse(msg.data) : msg.data;
      let targetCode =
        msgTemp.sender && this.user.userCode !== msgTemp.sender
          ? msgTemp.sender
          : this.receiver.receiverCode
          ? this.receiver.receiverCode
          : "";
      if (targetCode && !this.webSocketMsg[targetCode]) {
        this.webSocketMsg[targetCode] = [];
      }
      if (targetCode) {
        this.webSocketMsg[targetCode].push(msgTemp);
        this.webSocketMsg = Object.assign({}, this.webSocketMsg);
      }
      // 没有选中当前聊天对象或者收到的消息不是当前对象且收到消息时弹窗
      if (
        (!this.receiver.receiverCode ||
          (this.receiver.receiverCode &&
            this.receiver.receiverCode !== msgTemp.sender)) &&
        msgTemp.contentType == "text" &&
        msgTemp.type == "C" &&
        msgTemp.sender !== this.user.userCode
      ) {
        this.tipShow = true;
        this.tipReceiver = {
          receiverCode: msgTemp.sender,
          receiverName: msgTemp.senderName,
        };
      }
      this.$refs['chatBox'].toBottom()
    },
    changeReceiver({ receiverCode, receiverName }) {
      this.receiver.receiverCode = receiverCode;
      this.receiver.receiverName = receiverName;
    },
    // 操作事件
    sendMsg(msg) {
      if (msg) {
        this.wsSend("text", msg);
      }
    },
    sendFile(file, type) {
      if (file) {
        this.wsSend(
          "text",
          `${type}[http://ceshi.centit.com/file/api/file/fileserver/download/preview/${file.fileId}]`
        );
      }
    },
    tipClick() {
      this.tipShow = false;
      this.changeReceiver(this.tipReceiver);
    },
    clickCustUser(data) {
      this.changeReceiver({
        receiverCode: data.userCode,
        receiverName: data.userName,
      });
    },
    closeBox() {
      this.receiver.receiverCode = "";
    },
    chatLogOpen() {
      this.chatLogShow = true;
      this.historyMessageList = [];
      getHistoryMessage(this.user.userCode, this.receiver.receiverCode).then(
        (data) => {
          this.historyMessageList = data.objList;
        }
      );
    },
    closeHistory() {
      this.chatLogShow = false;
    },
    // 操作事件结束
  },
  mounted() {
    this.user.userCode = this.userCode;
    this.user.userName = this.userName;
    this.receiver.receiverCode = this.receiverCode;
    this.receiver.receiverName = this.receiverName;
    if (this.user.userCode) {
      this.initWebSocket(
        "ws://" + window.location.host + "/api/ws/chat/im/" + this.user.userCode
      );
    }
  },
  watch: {
    userCode(val) {
      if (val) {
        this.user.userCode = val;
        this.initWebSocket(
          "ws://" + window.location.host + "/api/ws/chat/im/" + val
        );
      }
    },
    userName(val) {
      if (val) {
        this.user.userName = val;
      }
    },
    receiverCode(val) {
      if (val) {
        this.receiver.receiverCode = val;
      }
    },
    receiverName(val) {
      if (val) {
        this.receiver.receiverName = val;
      }
    },
  },
});
</script>
<style lang="css">
@import "../common/css/layui.css";
@import "../common/css/layer/default/layer.css";
@import "../common/css/layim/layim.css";
</style>
<style lang="less" scoped>
.container {
  width: 0;
  height: 0;
  position: fixed;
  left: 0;
  top: 0;
}
</style>
