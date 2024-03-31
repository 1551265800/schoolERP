import axios from "axios";
import qs from "query-string";

// 新增/编辑职位
export function editorship(data: any) {
  return axios.post<any>(`/position/updatePosit`, data );
}
// 删除职位
export function delate(uid: string): any {
  return axios.post<any>(`/position/deletePosit?positId=${uid}`);
}
// 根据id获取职位
export function idDetails(data: any) {
  return axios.post<any>(
    `/position/getPositById?positId=${data.userId}`
  );
}