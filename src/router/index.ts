import { createRouter, createWebHashHistory,createWebHistory  } from "vue-router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css";
import { DEFAULT_LAYOUT } from "@/router/routes/base";
import { appRoutes, formatModules } from "./routes";
import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from "./routes/base";
import createRouteGuard from "./guard";


NProgress.configure({ showSpinner: false }); // NProgress Configuration

// 创建路由
const router = createRouter({
  history: createWebHashHistory (),
  routes: [
    {
      path: "/",
      redirect: "/home/welcome",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue"),
      meta: {
        requiresAuth: false,
        hideInMenu: true,
      },
    },
    {
      path: "/out",
      name: "out",
      component: () => import("@/views/retentionSample/index.vue"),
      meta: {
        requiresAuth: false,
        hideInMenu: true,
      },
    },
    ...appRoutes,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
