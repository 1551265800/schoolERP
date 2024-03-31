// import { getMenuList2 } from "@/api/org";
// 从后端获取菜单
let menu: any;
menu = [
  {
    path: "/icon",
    name: "icon",
    component: "DEFAULT_LAYOUT",
    meta: {
      locale: "menu.icon",
      requiresAuth: true,
      icon: "icon-brush",
      ignoreCache: true,
    },
    children: [
      {
        path: "informationManagement",
        name: "informationManagement",
        component: "informationManagement",
        meta: {
          locale: "人员管理",
          requiresAuth: true,
          roles: ["*"],
          ignoreCache: true,
        },
      },
      {
        path: "position",
        name: "position",
        component: "position",
        meta: {
          locale: "职位管理",
          requiresAuth: true,
          roles: ["*"],
          ignoreCache: true,
        },
      },
      {
        path: "organization",
        name: "organization",
        component: "organization",
        meta: {
          locale: "组织管理",
          requiresAuth: true,
          roles: ["*"],
          ignoreCache: true,
        },
      },
      {
        path: "supplier",
        name: "supplier",
        component: "supplier",
        meta: {
          locale: "供货商管理",
          requiresAuth: true,
          roles: ["*"],
          ignoreCache: true,
        },
      },
    ],
  },
  {
    path: "/system",
    name: "system",
    component: "DEFAULT_LAYOUT",
    meta: {
      locale: "menu.system",
      requiresAuth: true,
      icon: "icon-apps",
      ignoreCache: true,
    },
    children: [
      {
        path: "warehouseDetails",
        name: "warehouseDetails",
        component: "warehouseDetails",
        meta: {
          locale: "原材料详情",
          requiresAuth: true,
          roles: ["*"],
          ignoreCache: true,
        },
      },
      {
        path: "putInAndOutOfStorage",
        name: "putInAndOutOfStorage",
        component: "putInAndOutOfStorage",
        meta: {
          locale: "出入库",
          requiresAuth: true,
          roles: ["*"],
          ignoreCache: true,
        },
      },
      {
        path: "inventoryDetails",
        name: "inventoryDetails",
        component: "inventoryDetails",
        meta: {
          locale: "库存详情",
          requiresAuth: true,
          roles: ["*"],
          ignoreCache: true,
        },
      },
      {
        path: "wareDetails",
        name: "wareDetails",
        component: "wareDetails",
        meta: {
          locale: "出库记录",
          requiresAuth: true,
          roles: ["*"],
          ignoreCache: true,
        },
      },
    ],
  },
]; 



(async () => {
  // const res = await getMenuList2();
  // console.log(res.data);
  // menu = res.data;
 
})();

export { menu };
