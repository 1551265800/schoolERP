import axios from "axios";
import type { RouteRecordNormalized } from "vue-router";
import { UserState } from "@/store/modules/user/types";
import { useLoginStore } from "@/store";
import { setToken, clearToken,isLogin } from "@/utils/auth";
export interface LoginData {
  username: string;
  password: string;
  // randomStr:string;
  // code:string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  const loginStore = useLoginStore()
  let params = new URLSearchParams()
    params.append('username', data.username)
    params.append('password', data.password)
    // params.append('randomStr', loginStore.randomStr.toString())
    // params.append('code', data.code)
    return axios.post("/login",params);
}

export function logout() {
  clearToken();
 // return axios.post<LoginRes>("/api/user/logout");
}

export function getUserInfo() {
  if (isLogin()) {
    const role = localStorage.getItem("roles");
    return {
      role,
    };
  }
  return  new Error("未登录");
  // return axios.post<UserState>("/api/user/info");
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>("/api/user/menu");
}
