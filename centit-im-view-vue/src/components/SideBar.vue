<template>
  <div
    class="layui-layer layui-layer-page layui-box layui-layim"
    id="layui-layer1"
    type="page"
    times="1"
    showtime="0"
    contype="string"
    style="
      z-index: 19891015;
      width: 260px;
      height: 520px;
      top: 0px;
      left: 1658px;
      background-image: none;
    "
  >
    <div class="layui-layer-title" style="cursor: move">​</div>
    <div id="layui-layim" class="layui-layer-content" style="height: 410px">
      <div class="layui-layim-main">
        <div class="layui-layim-info">
          <div class="layui-layim-user">客服-易娟</div>
          <div class="layui-layim-status">
            <ul class="layui-anim layim-menu-box">
              <li layim-event="status" lay-type="online">
                <i class="layui-icon"></i
                ><cite class="layui-icon layim-status-online"></cite>在线
              </li>
              <li layim-event="status" lay-type="hide">
                <i class="layui-icon"></i
                ><cite class="layui-icon layim-status-hide"></cite>隐身
              </li>
            </ul>
          </div>
          <input class="layui-layim-remark" placeholder="编辑签名" value="" />
        </div>
        <ul class="layui-unselect layui-layim-tab layim-tab-two">
          <li
            class="layui-icon layim-this"
            title="联系人"
            layim-event="tab"
            lay-type="friend"
          >
            
          </li>
          <li
            class="layui-icon layim-hide"
            title="群组"
            layim-event="tab"
            lay-type="group"
          >
            
          </li>
          <li
            class="layui-icon"
            title="历史会话"
            layim-event="tab"
            lay-type="history"
          >
            
          </li>
        </ul>
        <ul
          class="layui-unselect layim-tab-content layui-show layim-list-friend"
        >
          <li>
            <h5 layim-event="spread" lay-type="true">
              <i class="layui-icon"></i><span>服务过的用户</span
              ><em>(<cite class="layim-count"> 4</cite>)</em>
            </h5>
            <ul class="layui-layim-list layui-show">
              <li
                v-for="item in custArrO"
                :key="item.userCode"
                @click="clickCustUser(item)"
              >
                <img src="http://localhost/webapp/src/avatar/user.png" /><span
                  >{{ item.userName }}</span
                >
                <p></p>
                <span class="layim-msg-status">new</span>
              </li>
              <li
                v-for="item in custArrF"
                :key="item.userCode"
                class="layim-list-gray"
                @click="clickCustUser(item)"
              >
                <img src="http://localhost/webapp/src/avatar/user.png" /><span
                  >{{ item.userName }}</span
                >
                <p></p>
                <span class="layim-msg-status">new</span>
              </li>
            </ul>
          </li>
          <li>
            <h5 layim-event="spread" lay-type="undefined">
              <i class="layui-icon"></i><span>客服同事</span
              ><em>(<cite class="layim-count"> 0</cite>)</em>
            </h5>
            <ul class="layui-layim-list">
              <li class="layim-null">该分组下暂无好友</li>
            </ul>
          </li>
        </ul>
        <ul class="layui-unselect layim-tab-content">
          <li>
            <ul class="layui-layim-list layui-show layim-list-group">
              <li class="layim-null">暂无群组</li>
            </ul>
          </li>
        </ul>
        <ul class="layui-unselect layim-tab-content">
          <li>
            <ul class="layui-layim-list layui-show layim-list-history">
              <li
                layim-event="chat"
                data-type="history"
                data-index="friend61000020100913924X"
                class="layim-friend61000020100913924X"
              >
                <img src="http://localhost/webapp/src/avatar/user.png" /><span
                  >赖静</span
                >
                <p></p>
                <span class="layim-msg-status">new</span>
              </li>
              <li
                layim-event="chat"
                data-type="history"
                data-index="friend410000198104251385"
                class="layim-friend410000198104251385 layim-list-gray"
              >
                <img src="http://localhost/webapp/src/avatar/user.png" /><span
                  >谭洋</span
                >
                <p></p>
                <span class="layim-msg-status">new</span>
              </li>
              <li
                layim-event="chat"
                data-type="history"
                data-index="friend530000201008017099"
                class="layim-friend530000201008017099 layim-list-gray"
              >
                <img src="http://localhost/webapp/src/avatar/user.png" /><span
                  >尹芳</span
                >
                <p></p>
                <span class="layim-msg-status">new</span>
              </li>
              <li
                layim-event="chat"
                data-type="history"
                data-index="friend810000201606084942"
                class="layim-friend810000201606084942 layim-list-gray"
              >
                <img src="http://localhost/webapp/src/avatar/user.png" /><span
                  >易娟</span
                >
                <p></p>
                <span class="layim-msg-status">new</span>
              </li>
            </ul>
          </li>
        </ul>
        <ul class="layui-unselect layim-tab-content">
          <li>
            <ul
              class="layui-layim-list layui-show"
              id="layui-layim-search"
            ></ul>
          </li>
        </ul>
        <ul class="layui-unselect layui-layim-tool">
          <li
            class="layui-icon layim-tool-search"
            layim-event="search"
            title="搜索"
          >
            
          </li>
          <li
            class="layui-icon layim-tool-skin"
            layim-event="skin"
            title="更换背景"
          >
            
          </li>
        </ul>
        <div class="layui-layim-search">
          <input /><label class="layui-icon" layim-event="closeSearch">ဇ</label>
        </div>
      </div>
    </div>
    <span class="layui-layer-setwin"
      ><a
        class="layui-layer-ico layui-layer-close layui-layer-close1"
        href="javascript:;"
      ></a
    ></span>
  </div>
</template>

<script>
import { getCust } from '@/api';
export default {
  name: 'SideBar',
  data() {
    return {
      custArrF: [],
      custArrO: []
    };
  },
  inject: ['pvdData'],
  props: {},
  methods: {
    clickCustUser(data) {
      this.$emit('clickCustUser', data);
    }
  },
  watch: {
    'pvdData.user.userCode': {
      handler(val) {
        if (val) {
          getCust(val).then(data => {
            data.forEach(item => {
              if (item.userState == 'F') {
                this.custArrF.push(item);
              } else {
                this.custArrO.push(item);
              }
            });
          });
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
</style>
