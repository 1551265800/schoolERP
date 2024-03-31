import axios from "axios";
import qs from "query-string";
// 新增/编辑出库记录
export function editorialOrganization(data: any) {
  return axios.post<any>(`/outOrder/update`, data );
}
// 删除出库记录
export function delate(uid: string): any {
  return axios.post<any>(`/outOrder/delete?id=${uid}`);
}
// 确认出库信息
export function confom(uid: string): any {
  return axios.post<any>(`/outOrder/confirm?id=${uid}`);
}
// 根据id获取出库记录
export function idDetails(data: any) {
  return axios.post<any>(
    `/outOrder/getById?id=${data.userId}`
  );
}
// 出库记录详情
export function listDetails(data: any) {
  data.organId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/outOrder/getByCondition`, data );
}


// 库存详情
export function inventoryDetails(data: any) {
  data.organId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/receiptSave/getByCondition`, data );
}

// 每日库存详情
export function dailyInventoryDetails(data: any) {
  return axios.post<any>(`/receiptSaveCountLog/getByCondition`, data );
}



// 每日职责详情
export function detailsOfDailyDuties(data: any) {
  data.organId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/respDailyCheck/getByCondition`, data );
}
// 评分
export function scoring(data: any) {
  // data.organId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/respDailyCheck//update`, data );
}