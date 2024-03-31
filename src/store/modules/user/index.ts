import { defineStore } from "pinia";
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  LoginData,
} from "@/api/user";
import { setToken, clearToken } from "@/utils/auth";
import { removeRouteListener } from "@/utils/route-listener";
import { UserState } from "./types";
import useAppStore from "../app";
import { createApp, provide } from "vue";
import App from "@/App.vue";
import { inject } from "vue";
import router from "@/router";
import CHPAYROUTES from "@/router/routes/modules/ch-pay-routes";
const useUserStore = defineStore("user", {
  state: (): UserState => ({
    name: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: "",
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        // this.role = this.role === "user" ? "admin" : "user";
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    info() {
      const res: any = getUserInfo();
      this.setInfo(res);
    },

    // Login登录设置token
    async login(loginForm: LoginData) {
      try {
        const res: any = await userLogin(loginForm);
        console.log(res);
        setToken(res.data.token);

        this.setInfo({ role: res.data.roles });
        localStorage.setItem("username", res.data.userDetailName);
        localStorage.setItem("userOrganId", res.data.userOrganId);
        localStorage.setItem("roles", res.data.roles);
        const app = createApp(App);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
