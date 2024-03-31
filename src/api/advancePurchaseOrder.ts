import axios from "axios";
import qs from "query-string";

export function editorialOrganization(data: any) {
  data.organId = localStorage.getItem('userOrganId')
  data.operatorName = localStorage.getItem('username')
  return axios.post<any>(`/prePurchaseOrder/update`, data );
}
export function editorialOrganization2(data: any) {
  data.supplierId = localStorage.getItem('userOrganId')
  data.operatorName = localStorage.getItem('username')
  return axios.post<any>(`/prePurchaseOrder/update`, data );
}
export function delate(uid: string): any {
  return axios.post<any>(`/prePurchaseOrder/delete?id=${uid}`);
}
export function idDetails(data: any) {
  return axios.post<any>(
    `/prePurchaseOrder/getById?id=${data.userId}`
  );
}
export function listDetails(data: any) {
  data.organId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/prePurchaseOrder/getByCondition`, data );
}
export function listDetails2(data: any) {
  data.organId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/prePurchaseOrder/getByConditionForPhone`, data );
}
// 供应商获取列表
export function listSupplier(data: any) {
  data.supplierId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/prePurchaseOrder/getByConditionForPhone`, data );
}
// 学校类目
export function listSchool() {
  return axios.post<any>(`/organization/getOrganByCondition`);
}
// 供应商学校类目
export function listSchool2() {
  return axios.post<any>(`/organization/getOrganByConditionForSupplier`);
}
export function caiGouList(data: any) {
  data.organId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/inOrderCount/getByCondition`, data );
}
// 上传图片
export function putPic(data: any) {
  return axios.post<any>(`/ossImage/upload`, data );
}

// 食材原料类目
export function foodMaterial() {
  return axios.post<any>(`/wareRecord/getByCondition`);
}
// 供货商类目
export function supplierCategory() {
  return axios.post<any>(`/originDetail/getAllOriginDetail`);
}