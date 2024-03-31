import axios from "axios";
import qs from "query-string";

// icon 列表详情
export function listDetails(data: any) {
  return axios.post<any>(`/userDetail/getUserDetailByCondition`, data);
}
export function idDetails(data: any) {
  return axios.post<any>(`/userDetail/getById?id=${data.id}`);
}
// 上传图片
export function credential(data: any): any {
  return axios.post<any>("/serviceItemIcon/upload", data);
}

// 获取职位
export function getStateConstant(data: any): any {
  return axios.post<any>(`/position/getPositByOrganId?organId=${data.organId}`);
}
// 启用和禁用
export function enableAndDisable(uid: string): any {
  return axios.put<any>(`/serviceItemIcon/${uid}`);
}
// 删除
export function delate(uid: string): any {
  return axios.post<any>(`/userDetail/deleteUserDetail?id=${uid}`);
}
//serviceItemIcon 新增
export function iconAdd(data: any): any {
  return axios.post<any>("/userDetail/updateUserDetail", data);
}
// export function iconAdd(params: any): any {
//   return axios.post<any>("/userDetail/updateUserDetail", null, {
//     params: params,
//   });
// }

// 职责新增
export function newResponsibilities(data: any): any {
  data.modifiedBy = localStorage.getItem("username");
  return axios.post<any>("/respTemplate/update", data);
}
// 删除职责
export function delatePos(uid: string): any {
  return axios.post<any>(`/respTemplate/delete?id=${uid}`);
}
export function upDone(data: any): any {
  return axios.put<any>("/serviceItemIcon/move", data);
}

// 职责类目
export function listOfResponsibilities(data: any): any {
  // data.organId = localStorage.getItem("userOrganId");
  if (data.organizationId) {
    data.organId = data.organizationId;
    data.organizationId = undefined;
  }
  return axios.post<any>("/respTemplate/getByCondition", data);
}
// 职责类目2
export function listOfResponsibilities2(data: any): any {
  data.organId = localStorage.getItem("userOrganId"); 
  return axios.post<any>(`/respTemplate/getTypeList?organId=${data.organId}`);
}

// 按id查找职责
export function getResponsibilityById(data: any): any {
  return axios.post<any>(`/respTemplate/getById?id=${data.id}`);
}
