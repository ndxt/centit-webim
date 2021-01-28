<template>
  <div
    class="messageTip layui-layer layui-layer-page layui-box layui-layim-min"
    id="layui-layer2"
    @click="tipClick"
  >
    <div class="layui-layer-content" style="height: 40px">
      <img
        id="layui-layim-min"
        src="http://localhost/webapp/src/avatar/user.png"
        style="cursor: move"
      /><span>收到新消息</span>
    </div>
    <span class="layui-layer-setwin"></span>
  </div>
</template>

<script>
export default {
  name: 'NewMessageTip',
  props: {},
  methods: {
    tipClick() {
      this.$emit('tipClick');
    }
  }
};
</script>

<style lang="less" scoped>
.messageTip {
  z-index: 100;
  width: 182px;
  height: 50px;
  top: 885px;
  left: 868px;
  position: absolute;
}
</style>
