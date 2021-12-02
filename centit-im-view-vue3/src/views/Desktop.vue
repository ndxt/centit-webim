<template>
  <vue-im
    :userName="$route.query.userName"
    :userCode="$route.query.userCode"
    :receiverName="$route.query.receiverName"
    :receiverCode="$route.query.receiverCode"
    :userType="'User'"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Desktop",
});
</script>
