import localeMessageBox from "@/components/message-box/locale/zh-CN";
import localeLogin from "@/views/login/locale/zh-CN";
import localeSuccess from "@/views/result/success/locale/zh-CN";
import localeError from "@/views/result/error/locale/zh-CN";
import locale403 from "@/views/exception/403/locale/zh-CN";
import locale404 from "@/views/exception/404/locale/zh-CN";
import locale500 from "@/views/exception/500/locale/zh-CN";
import localeUserInfo from "@/views/user/info/locale/zh-CN";
import localeUserSetting from "@/views/user/setting/locale/zh-CN";
// import localelivingIn from '@/views/merchants/livingIn/locale/zh-CN';
import locallist from '@/views/account/list/locale/zh-CN'
import locallistdeatil from '@/views/account/detail/locale/zh-CN'
// import localincome from '@/views/income/store/locale/zh-CN'
import localeSettings from './zh-CN/settings';
import chPayLocale from './ch-pay-locale';

export default {
  "menu.dashboard": "仪表盘",
  "menu.server.dashboard": "仪表盘-服务端",
  "menu.server.workplace": "工作台-服务端",
  "menu.server.monitor": "实时监控-服务端",
  "menu.list": "列表页",
  "menu.custom": "自定义",
  "menu.merchants": "商户管理",
  "menu.result": "结果页",
  "menu.exception": "异常页",
  "menu.form": "表单页",
  "menu.profile": "详情页",
  "menu.visualization": "数据可视化",
  "menu.user": "个人中心",
  "menu.arcoWebsite": "Arco Design",
  "menu.faq": "常见问题",
  "navbar.docs": "文档中心",
  "navbar.action.locale": "切换为中文",
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserInfo,
  ...localeUserSetting,
  ...chPayLocale,
  // ...localelivingIn,
  ...locallist,
  ...locallistdeatil,
  // ...localincome,
};
