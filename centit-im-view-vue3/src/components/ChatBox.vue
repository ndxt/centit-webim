<template>
  <div
    class="layui-layer layui-layer-page layui-box layui-layim-chat"
    id="chatBox"
    type="page"
    v-if="pvdData.receiver.receiverCode"
  >
    <div class="layui-layer-title" style="cursor: move" @mousedown="move"></div>
    <div id="layui-layim-chat" class="layui-layer-content">
      <ul class="layui-unselect layim-chat-list">
        <li
          class="layim-friend0 layim-chatlist-friend0 layim-this"
          layim-event="tabChat"
        >
          <img
            src="data:image/jpg;base64,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"
          /><span> {{ positionX }} {{ positionY }}</span>
        </li>
      </ul>
      <div class="layim-chat-box">
        <div class="layim-chat layim-chat-friend layui-show">
          <div class="layui-unselect layim-chat-title">
            <div class="layim-chat-other">
              <img
                class="layim-friend0"
                src="data:image/jpg;base64,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"
              /><span class="layim-chat-username" layim-event="">{{
                pvdData.receiver.receiverName
              }}</span>
              <p class="layim-chat-status"></p>
            </div>
          </div>
          <div class="layim-chat-main" ref="chatMain">
            <ul>
              <slot></slot>
            </ul>
          </div>
          <div class="layim-chat-footer">
            <div class="layui-unselect layim-chat-tool">
              <span class="layui-icon layim-tool-face" title="选择表情"></span
              ><span class="layui-icon layim-tool-image" title="上传图片"
                ><input
                  @change="getFile($event, 'img')"
                  type="file"
                  name="file" /></span
              ><span
                class="layui-icon layim-tool-image"
                title="发送文件"
                data-type="file"
                ><input
                  @change="getFile($event, 'file')"
                  type="file"
                  name="file" /></span
              ><span
                class="layui-icon layim-tool-robot"
                title="智能问答"
                lay-filter="robot"
                ></span
              >
              <span class="layim-tool-log" @click="chatLogOpen"
                ><i class="layui-icon"></i>聊天记录
              </span>
            </div>
            <div class="layim-chat-textarea">
              <textarea v-model="msg"></textarea>
            </div>
            <div class="layim-chat-bottom">
              <div class="layim-chat-send">
                <span class="layim-send-btn" @click="sendMsg">发送</span
                ><span
                  class="layim-send-set"
                  layim-event="setSend"
                  lay-type="show"
                  ><em class="layui-edge"></em
                ></span>
                <ul class="layui-anim layim-menu-box">
                  <li class="layim-this" layim-event="setSend" lay-type="Enter">
                    <i class="layui-icon"></i>按Enter键发送消息
                  </li>
                  <li layim-event="setSend" lay-type="Ctrl+Enter">
                    <i class="layui-icon"></i>按Ctrl+Enter键发送消息
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="layui-layer-setwin"
      ><a class="layui-layer-min" href="javascript:;" @click="closeBox"
        ><cite></cite></a
      ><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a></span
    ><span class="layui-layer-resize"></span>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { fileUpload } from "@/api";
export default defineComponent({
  name: "ChatBox",
  data() {
    return {
      msg: "",
      show: true,
      full: false,
      positionX: "",
      positionY: "",
    };
  },
  inject: ["pvdData"],
  components: {},
  methods: {
    toBottom() {
      this.$nextTick(() => {
        this.$refs["chatMain"].scrollTop = this.$refs["chatMain"].scrollHeight;
      });
    },
    sendMsg() {
      this.$emit("sendMsg", this.msg);
      this.msg = "";
    },
    closeBox() {
      this.$emit("closeBox");
    },
    fullScreen() {
      this.full = true;
    },
    move(e) {
      let dom = e.target.parentNode;
      let disX = e.clientX - dom.offsetLeft;
      let disY = e.clientY - dom.offsetTop;
      document.onmousemove = (e) => {
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        this.positionX = top;
        this.positionY = left;
        if (dom.getAttribute("id") == "chatBox") {
          dom.style.left = left + "px";
          dom.style.top = top + "px";
        }
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    chatLogOpen() {
      this.$emit("chatLogOpen");
    },
    getFile(e, type) {
      fileUpload(e.target.files[0], {
        client: "html5",
        osId: "FILE_SVR",
        optId: "LOCAL_FILE",
        // optMethod: 'test',
        // optTag: 'test',
        fileOwner: "u0000000",
      }).then((res) => {
        this.$emit("sendFile", res, type);
      });
    },
  },
});
</script>

<style lang="less" scoped>
#chatBox {
  z-index: 100;
  width: 600px;
  top: 50%;
  left: 50%;
  min-width: 500px;
  min-height: 420px;
  background-image: none;
  position: fixed;
  transform: translate(-50%, -50%);
}
</style>
