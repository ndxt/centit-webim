<template>
  <div
    class="layui-layer layui-layer-page layui-box layui-layim-chat"
    id="chatBox"
    type="page"
    v-if="pvdData.receiver.receiverCode"
  >
    <div class="layui-layer-title" style="cursor: move">​</div>
    <div id="layui-layim-chat" class="layui-layer-content">
      <ul class="layui-unselect layim-chat-list">
        <li
          class="layim-friend0 layim-chatlist-friend0 layim-this"
          layim-event="tabChat"
        >
          <img src="http://localhost/webapp/src/avatar/service.jpg" /><span
            >智能客服</span
          >
        </li>
      </ul>
      <div class="layim-chat-box">
        <div class="layim-chat layim-chat-friend layui-show">
          <div class="layui-unselect layim-chat-title">
            <div class="layim-chat-other">
              <img
                class="layim-friend0"
                src="http://localhost/webapp/src/avatar/service.jpg"
              /><span class="layim-chat-username" layim-event="">{{
                pvdData.receiver.receiverName
              }}</span>
              <p class="layim-chat-status"></p>
            </div>
          </div>
          <div class="layim-chat-main">
            <ul>
              <slot></slot>
            </ul>
          </div>
          <div class="layim-chat-footer">
            <div class="layui-unselect layim-chat-tool">
              <span class="layui-icon layim-tool-face" title="选择表情"></span
              ><span class="layui-icon layim-tool-image" title="上传图片"
                ><input type="file" name="file" /></span
              ><span
                class="layui-icon layim-tool-image"
                title="发送文件"
                data-type="file"
                ><input type="file" name="file" /></span
              ><span
                class="layui-icon layim-tool-robot"
                title="智能问答"
                lay-filter="robot"
                ></span
              >
              <span class="layim-tool-log" layim-event="chatLog"
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
      ><a class="layui-layer-min" href="javascript:;"><cite></cite></a
      ><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a></span
    ><span class="layui-layer-resize"></span>
  </div>
</template>

<script>
export default {
  name: 'ChatBox',
  data() {
    return {
      msg: ''
    };
  },
  inject: ['pvdData'],
  components: {},
  methods: {
    sendMsg() {
      this.$emit('sendMsg', this.msg);
      this.msg = '';
    }
  }
};
</script>

<style lang="less" scoped>
#chatBox {
  z-index: 100;
  width: 600px;
  top: 207.5px;
  left: 659px;
  min-width: 500px;
  min-height: 420px;
  background-image: none;
  position: absolute;
}
</style>
