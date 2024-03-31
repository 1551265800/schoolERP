import axios from "axios";
import qs from "query-string";

// 新增/编辑菜品
export function editorialOrganization(data: any) {
  return axios.post<any>(`/meal/update`, data );
}
// 删除菜品
export function delate(uid: string): any {
  return axios.post<any>(`/meal/delete?id=${uid}`);
}
// 根据id获取菜品
export function idDetails(data: any) {
  return axios.post<any>(
    `/meal/getById?id=${data.userId}`
  );
}
// 原材料详情
export function listDetails(data: any) {
  data.organId = localStorage.getItem("userOrganId"); 
  return axios.post<any>(`/meal/getByCondition`, data );
}
// 上传图片
export function putPic(data: any) {
  return axios.post<any>(`/ossImage/upload`, data );
}

// 食材原料类目
export function foodMaterial() {
  return axios.post<any>(`/wareRecord/getByCondition`);
}

// 食材品类类目
export function getCategory() {
  return axios.post<any>(`/foodClassify/getAllFoodClassify`);
}
// 单位类目
export function unitCategory() {
  return axios.post<any>(`/unit/getAllUnit`);
}