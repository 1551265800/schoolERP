import axios from "axios";
import qs from "query-string";

// 新增/编辑入库信息
export function edit(data: any) {
  data.organId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/inOrder/update`, data );
}
// 删除入库信息
export function delate(uid: string): any {
  return axios.post<any>(`/inOrder/deleteById?id=${uid}`);
}
// 根据id获取入库信息
export function idDetails(data: any) {
  return axios.post<any>(
    `/inOrder/getById?id=${data.userId}`
  );
}
// 入库信息详情
export function listDetails(data: any) {
  data.organId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/inOrder/getByCondition`, data );
}

// newDelivery
export function newDelivery(data: any) {
  data.confirm = true
  return axios.post<any>(`/outOrder/add`, data );
}
export function goodlistDetails() {
  return axios.post<any>(`/wareRecord/getByCondition`);
}
// 供应商详情
export function supplierDetails() {
  return axios.post<any>(`/originDetail/getAllOriginDetail`,  );
}

export function foodDetails(data: any) {
  data.organId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/prePurchaseOrder/getReceiptMessageByCondition`, data );
}