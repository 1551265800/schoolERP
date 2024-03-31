import { createPinia } from "pinia";
import useAppStore from "./modules/app";
import useUserStore from "./modules/user";
import useTabBarStore from "./modules/tab-bar";
import useLoginStore from "./modules/login";
import useStore from "./modules/router/routerStore";

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore,useLoginStore,useStore };
export default pinia;
