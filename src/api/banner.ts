import axios from "axios";
import qs from "query-string";

// icon 列表详情
export function listDetails(params: any) {
  return axios.get<any>(`/banner`, { params });
}
// 上传图片
export function credential(data: any): any {
  return axios.post<any>("/banner/upload", data);
}
// 启用和禁用
export function enableAndDisable(uid: string): any {
  return axios.put<any>(`/banner/${uid}`);
}
// 删除
export function delate(uid: string): any {
  return axios.delete<any>(`/banner/${uid}`);
}
//serviceItemIcon 新增
export function iconAdd(data: any): any {
  return axios.post<any>("/banner", data);
}

// 上移/下移
export function upDone(data: any): any {
  return axios.put<any>("/banner/move", data);
}