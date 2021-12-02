<template>
  <div class="container">
    <div class="jumbotron">
      <h1>客服系统测试桩</h1>
      <p>模拟用户，模拟客服</p>
      <p>
        <button class="btn btn-success">与图灵机器人交谈</button>
      </p>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">模拟用户</div>
      <div class="panel-body">
        <form>
          <div class="form-group">
            <div class="row">
              <div class="col-md-1 text-center">
                <button type="button" class="btn btn-default">
                  <i
                    class="glyphicon glyphicon-repeat"
                    title="生成随机用户"
                  ></i>
                </button>
              </div>
              <div class="col-md-4">
                <input type="text" class="form-control" placeholder="用户名" />
              </div>
              <div class="col-md-2">
                <img
                  style="height: 32px"
                  class="img-responsive img-circle"
                  alt="头像"
                  src="http://tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg"
                />
              </div>
              <div class="col-md-5">
                <p style="margin: 0; line-height: 32px">810000201606084942</p>
              </div>
            </div>
          </div>

          <button type="button" class="btn btn-primary" @click="beginTalk">
            与客服交谈
          </button>
        </form>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">模拟客服</div>
      <div class="panel-body">
        <button
          type="button"
          class="btn btn-sm btn-primary"
          @click="kefuBeginTalk"
        >
          <i class="glyphicon glyphicon-plus"></i>
          添加客服
        </button>
      </div>
      <table class="table table-hover table-striped">
        <colgroup></colgroup>
        <colgroup></colgroup>
        <colgroup></colgroup>
        <colgroup width="360"></colgroup>
        <tbody>
          <!-- ngRepeat: ser in vm.service -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "Home",
  components: {},
  methods: {
    beginTalk() {
      this.$router.push({
        name: "User",
        query: {
          userName: "胡明",
          userCode: "310000200103041235",
          receiverName: "客服-易娟",
          receiverCode: "99000020070304214X",
        },
      });
    },
    kefuBeginTalk() {
      this.$router.push({
        name: "Kefu",
        query: {
          userName: "客服-易娟",
          userCode: "99000020070304214X",
        },
      });
    },
  },
});
</script>
<style scoped src="../common/css/bootstrap.min.css"></style>
