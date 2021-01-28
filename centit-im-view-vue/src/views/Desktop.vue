<template>
  <vue-im
    :userName="$route.query.userName"
    :userCode="$route.query.userCode"
    :receiverName="$route.query.receiverName"
    :receiverCode="$route.query.receiverCode"
    :userType="$route.meta.type"
  />
</template>

<script>
export default {
  name: 'Desktop',
  data() {
    return {};
  },
  mounted() {}
};
</script>
