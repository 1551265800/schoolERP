import { DEFAULT_LAYOUT } from "../base";
import { AppRouteRecordRaw } from "../types";

const CHPAYROUTES: any = [
  {
    path: "/home",
    name: "home",
    component: DEFAULT_LAYOUT,
    meta: {
      locale: "menu.home",
      requiresAuth: true,
      icon: "icon-home",
    },
    children: [
      {
        path: "welcome",
        name: "Welcome",
        component: () => import("@/views/home/index.vue"),
        meta: {
          locale: "menu.home.welcome",
          requiresAuth: true,
          roles: ["*"],
        },
      },
    ],
  },
  {
    path: "/icon",
    name: "icon",
    component: DEFAULT_LAYOUT,
    meta: {
      locale: "menu.icon",
      requiresAuth: true,
      icon: "icon-brush",
      order: 4,
      ignoreCache: true,
    },
    children: [
      {
        path: "informationManagement",
        name: "informationManagement",
        component: () => import("@/views/serviceItemIcon/list/index.vue"),
        meta: {
          locale: "人员管理",
          requiresAuth: true,
          roles: ["1"],
          ignoreCache: true,
        },
      },
      {
        path: "positionManagement",
        name: "positionManagement",
        component: () => import("@/views/serviceItemIcon/list/positionManagement.vue"),
        meta: {
          locale: "职责管理",
          requiresAuth: true,
          roles: ["1"],
          ignoreCache: true,
        },
      },
      {
        path: "dailyResponsibilityScore",
        name: "dailyResponsibilityScore",
        component: () => import("@/views/account/list/dailyResponsibilityScore.vue"),
        meta: {
          locale: "每日职责评分",
          requiresAuth: true,
          roles: ["1","2"],
          ignoreCache: true,
        },
      },
      {
        path: "position",
        name: "position",
        component: () => import("@/views/serviceItemIcon/list/position.vue"),
        meta: {
          locale: "职位管理",
          requiresAuth: true,
          roles: ["1"],
          ignoreCache: true,
        },
      },
      {
        path: "organization",
        name: "organization",
        component: () =>
          import("@/views/serviceItemIcon/list/organization.vue"),
        meta: {
          locale: "组织管理",
          requiresAuth: true,
          roles: ["1"],
          ignoreCache: true,
        },
      },
      {
        path: "supplier",
        name: "supplier",
        component: () => import("@/views/serviceItemIcon/list/supplier.vue"),
        meta: {
          locale: "供货商管理",
          requiresAuth: true,
          roles: ["1"],
          ignoreCache: true,
        },
      },
      {
        path: "advancePurchaseOrder",
        name: "advancePurchaseOrder",
        component: () => import("@/views/serviceItemIcon/list/advancePurchaseOrder.vue"),
        meta: {
          locale: "预采购单",
          requiresAuth: true,
          roles: ["1"],
          ignoreCache: true,
        },
      },
      {
        path: "phoneOrder",
        name: "phoneOrder",
        component: () => import("@/views/serviceItemIcon/list/phoneOrder.vue"),
        meta: {
          locale: "预采购单(手机)",
          requiresAuth: true,
          roles: ["1"],
          ignoreCache: true,
        },
      },
      {
        path: "supplierOrder",
        name: "supplierOrder",
        component: () => import("@/views/serviceItemIcon/list/supplierOrder.vue"),
        meta: {
          locale: "预采购单（供货商）",
          requiresAuth: true,
          roles: ["3"],
          ignoreCache: true,
        },
      },
      {
        path: "purchaseOrder",
        name: "purchaseOrder",
        component: () => import("@/views/serviceItemIcon/list/purchaseOrder.vue"),
        meta: {
          locale: "生成采购单",
          requiresAuth: true,
          roles: ["1"],
          ignoreCache: true,
        },
      },
      {
        path: "purchaseStatistics",
        name: "purchaseStatistics",
        component: () => import("@/views/serviceItemIcon/list/purchaseStatistics.vue"),
        meta: { 
          locale: "采购统计",
          requiresAuth: true,
          roles: ["1"],
          ignoreCache: true,
        },
      },
    ],
  },
  {
    path: "/system",
    name: "system",
    component: DEFAULT_LAYOUT,
    meta: {
      locale: "menu.system",
      requiresAuth: true,
      icon: "icon-apps",
      order: 4,
      ignoreCache: true,
    },
    children: [
      {
        path: "warehouseDetails",
        name: "warehouseDetails",
        component: () => import("@/views/account/list/warehouseDetails.vue"),
        meta: {
          locale: "原材料详情",
          requiresAuth: true,
          roles: ["1","2"],
          ignoreCache: true,
        },
      },
      {
        path: "seasonings",
        name: "seasonings",
        component: () => import("@/views/account/list/seasonings.vue"),
        meta: {
          locale: "调料盘点",
          requiresAuth: true,
          roles: ["1","2"],
          ignoreCache: true,
        },
      },
      {
        path: "seasondetil",
        name: "seasondetil",
        component: () => import("@/views/account/list/seasondetil.vue"),
        meta: {
          hideInMenu: true,
          locale: "调料详情",
          requiresAuth: true,
          roles: ["1","2"],
          ignoreCache: true,
        },
      },
      {
        path: "putInAndOutOfStorage",
        name: "putInAndOutOfStorage",
        component: () => import("@/views/account/list/index.vue"),
        meta: {
          locale: "出入库",
          requiresAuth: true,
          roles: ["1","2"],
          ignoreCache: true,
        },
      },
      {
        path: "inventoryDetails",
        name: "inventoryDetails",
        component: () => import("@/views/account/list/inventoryDetails.vue"),
        meta: {
          locale: "库存详情",
          requiresAuth: true,
          roles: ["1","2"],
          ignoreCache: true,
        },
      },
      {
        path: "dailyInventoryDetails",
        name: "dailyInventoryDetails",
        component: () => import("@/views/account/list/dailyInventoryDetails.vue"),
        meta: {
          locale: "每日库存详情",
          requiresAuth: true,
          roles: ["1","2"],
          ignoreCache: true,
        },
      },
      {
        path: "wareDetails",
        name: "wareDetails",
        component: () => import("@/views/account/list/wareDetails.vue"),
        meta: {
          locale: "出库记录",
          requiresAuth: true,
          roles: ["1","2"],
          ignoreCache: true,
        },
      },
    ],
  },
  {
    path: "/menu",
    name: "menu",
    component: DEFAULT_LAYOUT,
    meta: {
      locale: "菜品管理",
      requiresAuth: true,
      icon: "icon-archive",
      order: 4,
      ignoreCache: true,
    },
    children: [
      {
        path: "menuList",
        name: "MenuList",
        component: () => import("@/views/menu/menuList.vue"),
        meta: {
          locale: "菜品详情",
          requiresAuth: true,
          roles: ["1","2"],
          ignoreCache: true,
        },
      },
      {
        path: "generateMenu",
        name: "generateMenu",
        component: () => import("@/views/menu/generateMenu.vue"),
        meta: {
          locale: "生成菜单",
          requiresAuth: true,
          roles: ["1","2"],
          ignoreCache: true,
        },
      },
      {
        path: "retentionSample2",
        name: "RetentionSample2",
        component: () => import("@/views/menu/retentionSample2.vue"),
        meta: {
          locale: "菜品留样",
          requiresAuth: true,
          roles: ["1","2"],
          ignoreCache: true,
        },
      },
    ],
  },
];

export default CHPAYROUTES;
