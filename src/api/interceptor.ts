import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { Message, Modal } from "@arco-design/web-vue";
import { useUserStore } from "@/store";
import { getToken } from "@/utils/auth";
import router from "@/router";

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

const contextPath = "https://api.dongkai.laogaopeixun.com";
// const contextPath = "http://api.dongkai.dongyingnews.cn";
// const contextPath = "/api";
// const contextPath = "http://i9iari.natappfree.cc";

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.url = contextPath + config.url;
    const token = getToken();
    // const token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhYWEiLCJzdWIiOiJhYWEiLCJpc3MiOiJsaXV4dWh1aTIyIiwiaWF0IjoxNjk2ODM3NjcxLCJleHAiOjE2OTgxMzM2NzF9.jnc7zi_a2ZJ3PXw-gPfiBxun3Hw_Soryp0S0P7z_oQo";
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res:any= response.data;
    if (res.code !== 200 && response.config.url !== '/code') {
      if (
        [50008, 50012, 50014, 401].includes(res.code) && response.config.url !== "/user/info"
      ) {
        Modal.error({
          title: "登录失败",
          content:
            "请重新登录",
          okText: "重新登录",
          async onOk() {
            const userStore = useUserStore();
            await userStore.logout();
            window.location.reload();
          },
        });
      }
      return Promise.reject(res);
    }
    return res;
  },
  (error) => {
    console.log(error.response);
    if (error.response.status === 401) {
        router.push({ path: '/login' })
        const userStore = useUserStore();
        userStore.logout();
        Message.error(error.response.data.message || "请重新登录")
    } else {
      Message.error({
        content: error.response.data.message || "Request Error",
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  }
);
