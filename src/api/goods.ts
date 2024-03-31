import axios from "axios";
import qs from "query-string";

// 新增/编辑仓库
export function editorialOrganization(data: any) {
  return axios.post<any>(`/wareRecord/update`, data );
}
// 新增/编辑调料仓库
export function addWarehouse(data: any) {
  return axios.post<any>(`/inOrder/add`, data );
}
// 删除仓库
export function delate(uid: string): any {
  return axios.post<any>(`/wareRecord/delete?id=${uid}`);
}
// 根据id获取仓库
export function idDetails(data: any) {
  return axios.post<any>(
    `/wareRecord/getById?id=${data.userId}`
  );
}
// 原材料详情
export function listDetails(data: any) {
  return axios.post<any>(`/wareRecord/getByCondition`, data );
}
// 调料入库
export function seasoningIn(data: any) {
  return axios.post<any>(`/inOrder/add`, data );
}
// 去除0
export function listDetails2(data: any) {
  data.organId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/wareRecord/getByConditionForPhone`, data );
}
// 调料库存详情
export function seasoningInventory(data: any) {
  data.organId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/receiptSave/getByCondition`, data );
}
// 上传图片
export function putPic(data: any) {
  return axios.post<any>(`/ossImage/upload`, data );
}
// 食材品类类目
export function getCategory() {
  return axios.post<any>(`/foodClassify/getAllFoodClassify`);
}
// 单位类目
export function unitCategory() {
  return axios.post<any>(`/unit/getAllUnit`);
}

// 获取调料种类
export function seasoningCategory(data: any) {
  data.organId = localStorage.getItem('userOrganId')
  return axios.post<any>(`/wareRecord/getByConditionForSeasoning`, data );
}
// 新增调料种类
export function addSeasoningCategory(data: any) {
  return axios.post<any>(`/wareRecord/updateSeasoning`, data );
}