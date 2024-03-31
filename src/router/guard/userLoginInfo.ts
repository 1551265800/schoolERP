import type { Router, LocationQueryRaw } from "vue-router";
import NProgress from "nprogress"; // progress bar
import { Message } from "@arco-design/web-vue";
import { useUserStore } from "@/store";
import { isLogin } from "@/utils/auth";

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (isLogin()) {
      if (userStore.role) {
        next();
      } else {
        try {
          await userStore.info();
          //   if (isLoadRouters) {
          //     // console.log('路由已添加，直接跳转到目标页面');
          //     next()
          // } else {
          //     //解决刷新页面空白
          //     //console.log('重新加载路由，并跳转到目标页');
          //     let route = JSON.parse(localStorage.getItem('routes'))
          //     // store.commit('setRouters', route);
          //     // store.commit('setAsyncRoutesMark', true);

          //     //添加动态路由
          //     let menuList = JSON.parse(localStorage.getItem('menuList'))
          //     dealWithRoute(menuList)
          //     next({...to,replace: true})
          // }
          next();
        } catch (error: any) {
          await userStore.logout();
          next({
            name: "login",
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
        }
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (to.name === "login" || "new" || "merchantInfo") {
        next();
      } else {
        Message.error("请重新登录");
        next({
          name: "login",
          query: {
            redirect: to.name,
            ...to.query,
          } as LocationQueryRaw,
        });
      }
    }
  });
}
