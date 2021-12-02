<template>
  <div
    class="layui-layer layui-layer-iframe layui-layer-border layui-box"
    id="layui-layer3"
    type="iframe"
    times="3"
    showtime="0"
    contype="string"
    style="
      z-index: 100;
      width: 450px;
      height: 100%;
      top: -2px;
      right: 0px;
      position: fixed;
      left: auto;
    "
  >
    <div class="layui-layer-title" style="cursor: move">
      与 {{ userName }} 的聊天记录
    </div>
    <div id="layui-layim-chatlog" class="layui-layer-content">
      <div class="layim-chat-main" style="height: 100%">
        <ul>
          <slot></slot>
        </ul>
      </div>
    </div>
    <span class="layui-layer-setwin"
      ><a class="layui-layer-min" href="javascript:;"><cite></cite></a
      ><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a
      ><a
        @click="closeHistory"
        class="layui-layer-ico layui-layer-close layui-layer-close1"
        href="javascript:;"
      ></a></span
    ><span class="layui-layer-resize"></span>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "ChatLog",
  props: {
    userName: String,
  },
  methods: {
    closeHistory() {
      this.$emit("closeHistory");
    },
  },
});
</script>

<style lang="less" scoped></style>
