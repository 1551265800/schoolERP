import axios from "axios";
import qs from "query-string";

export function edit(data: any) {
  data.organId = localStorage.getItem("userOrganId");
  return axios.post<any>(`/retentionSample/update`, data);
}
export function delate(uid: string): any {
  return axios.post<any>(`/retentionSample/delete?id=${uid}`);
}
export function idDetails(data: any) {
  return axios.post<any>(`/retentionSample/getById?id=${data.userId}`);
}
export function listDetails(data: any) {
  data.organId = localStorage.getItem("userOrganId");
  return axios.post<any>(`/retentionSample/getByCondition`, data);
}

export function goodlistDetails() {
  return axios.post<any>(`/wareRecord/getByCondition`);
}
// 供应商详情
export function supplierDetails() {
  return axios.post<any>(`/originDetail/getAllOriginDetail`);
}
