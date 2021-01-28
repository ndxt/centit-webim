<template>
  <li
    v-if="
      item.type == 'C' &&
      item.sender == pvdData.user.userCode &&
      item.receiver == pvdData.receiver.receiverCode
    "
    class="layim-chat-mine"
  >
    <div class="layim-chat-user">
      <img src="http://localhost/webapp/src/avatar/user.png" /><cite
        ><i>{{ $moment(item.sendTime).format("YYYY-MM-DD h:mm:ss") }}</i
        >{{ item.senderName }}</cite
      >
    </div>
    <div class="layim-chat-text">{{ item.content.msg }}</div>
  </li>
  <li
    v-else-if="
      item.type == 'C' &&
      item.sender == pvdData.receiver.receiverCode &&
      item.receiver == pvdData.user.userCode
    "
  >
    <div class="layim-chat-user">
      <img src="http://localhost/webapp/src/avatar/service.jpg" /><cite
        >{{ item.senderName
        }}<i>{{ $moment(item.sendTime).format("MM-DD-YYYY h:mm:ss") }}</i></cite
      >
    </div>
    <div class="layim-chat-text">{{ item.content.msg }}</div>
  </li>
  <li v-else-if="item.type == 'M'" class="layim-chat-system">
    <span>{{ item.content.msg }}</span>
  </li>
</template>

<script>
export default {
  name: 'ChatLine',
  data() {
    return {};
  },
  inject: ['pvdData'],
  props: {
    item: Object
  },
  components: {}
};
</script>

<style lang="less" scoped>
</style>
