<template>
  <div
    class="layui-layer layui-layer-page layui-box layui-layim"
    id="layui-layer1"
    type="page"
    times="1"
    showtime="0"
    contype="string"
    :style="boxStyle"
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
                <img
                  src="data:image/png;base64,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"
                /><span>{{ item.userName }}</span>
                <p></p>
                <span class="layim-msg-status">new</span>
              </li>
              <li
                v-for="item in custArrF"
                :key="item.userCode"
                class="layim-list-gray"
                @click="clickCustUser(item)"
              >
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjU2MUFFMUFBNUJGMTFFNzkxRUJFM0FCRjFEODVBRUYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjU2MUFFMUJBNUJGMTFFNzkxRUJFM0FCRjFEODVBRUYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NTYxQUUxOEE1QkYxMUU3OTFFQkUzQUJGMUQ4NUFFRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NTYxQUUxOUE1QkYxMUU3OTFFQkUzQUJGMUQ4NUFFRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pvm4qS4AABGWSURBVHja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"
                /><span>{{ item.userName }}</span>
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
            <ul class="layui-layim-list layui-show layim-list-history"></ul>
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
import { defineComponent } from "vue";
import { getCust } from "@/api";
export default defineComponent({
  name: "SideBar",
  data() {
    return {
      custArrF: [],
      custArrO: [],
    };
  },
  inject: ["pvdData"],
  props: {
    boxStyle: Object,
  },
  methods: {
    clickCustUser(data) {
      this.$emit("clickCustUser", data);
    },
  },
  watch: {
    "pvdData.user.userCode": {
      handler(val) {
        if (val) {
          getCust(val).then((data) => {
            data.forEach((item) => {
              if (item.userState == "F") {
                this.custArrF.push(item);
              } else {
                this.custArrO.push(item);
              }
            });
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
});
</script>

<style lang="less" scoped></style>
