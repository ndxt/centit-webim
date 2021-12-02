import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Im from "./components/index";

const app = createApp(App);
app.config.globalProperties.$filters = {
  formatDateForIm(date: number | string, format: string) {
    const value = new Date(date);
    const o = {
      "M+": value.getMonth() + 1,
      "d+": value.getDate(),
      "h+": value.getHours(),
      "m+": value.getMinutes(),
      "s+": value.getSeconds(),
    };
    if (/(y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (value.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
      for (const k in o) {
        if (new RegExp(`(${k})`).test(format)) {
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return format;
    }
  },
};
app.use(router).use(Im).mount("#app");
