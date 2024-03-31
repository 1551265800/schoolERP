import axios from "axios";
import qs from "query-string";
// 新增/编辑供应商
export function editorialOrganization(data: any) {
  return axios.post<any>(`/originDetail/update`, data );
}
// 删除供应商
export function delate(uid: string): any {
  return axios.post<any>(`/originDetail/delete?id=${uid}`);
}
// 根据id获取供应商
export function idDetails(data: any) {
  return axios.post<any>(
    `/originDetail/getById?id=${data.userId}`
  );
}
// 供应商详情
export function listDetails(data: any) {
  return axios.post<any>(`/originDetail/getByCondition`, data );
}