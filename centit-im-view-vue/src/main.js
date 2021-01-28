import Vue from 'vue';
import App from "./App.vue";
import router from "./router";
// import store from "./store";
// import wsConnection from './api/socket'
// Vue.prototype.$ws = wsConnection;

import Im from './components/index'
Vue.use(Im)

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
