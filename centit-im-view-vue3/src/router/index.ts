import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Test from "../views/Test.vue";
import Desktop from "../views/Desktop.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Test,
  },

  {
    path: "/kefu",
    name: "Kefu",
    component: Desktop,
    meta: { type: "kefu" },
  },

  {
    path: "/user",
    name: "User",
    component: Desktop,
    meta: { type: "user" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
