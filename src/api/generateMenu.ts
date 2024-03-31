import axios from "axios";
import qs from "query-string";

// 新增/编辑菜品
export function editorial(data: any) {
  data.organId = localStorage.getItem("userOrganId");
  return axios.post<any>(`/mealOrder/update`, data);
}
// 取消点餐
export function delateOrder(uid: string): any {
  return axios.post<any>(`/mealOrder/delete?id=${uid}`);
}
// 根据id获取菜品
export function idDetails(data: any) {
  return axios.post<any>(`/mealOrder/getById?id=${data.userId}`);
}
// 原材料详情
export function mealOrderDetails(data: any) {
  data.organId = localStorage.getItem("userOrganId");
  return axios.post<any>(`/mealOrder/getByCondition`, data);
}

// 时间类目
export function getTime() {
  return axios.post<any>(`/util/getDateMsg`);
}
// 修改增加量
export function changeIncrement(increase: any) {
  return axios.post<any>(`/mealOrder/batchUpdateIncrease?increase=${increase}`);
}
