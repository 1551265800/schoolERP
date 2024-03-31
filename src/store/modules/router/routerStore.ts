import { defineStore } from 'pinia';

const useStore = defineStore('store', {
  state: () => ({
    asyncRoutesMark: false,
    menu: [],
    routers: []
  }),
  actions: {
    setAsyncRoutesMark(data:any) {
      this.asyncRoutesMark = data;
    },
    setMenuList(data:any) {
      this.menu = data;
    },
    setRouters(data:any) {
      this.routers = data;
    }
  }
});

export default useStore;