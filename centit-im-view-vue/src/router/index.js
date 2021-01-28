import Vue from "vue";
import VueRouter from "vue-router";
import Test from "../views/Test.vue";
import Desktop from "../views/Desktop.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Test
  },

  {
    path: "/kefu",
    name: "Kefu",
    component: Desktop,
    meta: { type: 'kefu' }
  },

  {
    path: "/user",
    name: "User",
    component: Desktop,
    meta: { type: 'user' }
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  routes
});

export default router;
