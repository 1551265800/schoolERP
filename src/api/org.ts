import axios from "axios";
import qs from "query-string";
// 新增/编辑组织
export function editorialOrganization(data: any) {
  return axios.post<any>(`/organization/updateOrgan`, data);
}
// 删除组织
export function delate(uid: string): any {
  return axios.post<any>(`/organization/deleteOrgan?organId=${uid}`);
}
// 根据id获取组织
export function idDetails(data: any) {
  return axios.post<any>(`/organization/getOrganById?organId=${data.userId}`);
}
// 组织详情
export function listDetails(data: any) {
  return axios.post<any>(`/organization/getOrganByCondition`, data);
}

// export function getMenuList2() {
//   const formData = new FormData();
//   formData.append("characterId", "1");
//   return axios.post(
//     "http://192.168.3.139:8010/routeMenu/getByCharacter",
//     formData,
//     {
//       headers: {
//         token: String(localStorage.getItem("token")),
//       },
//     }
//   );
// }
