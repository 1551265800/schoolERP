import axios from "axios";
import qs from "query-string";
import type { DescData } from "@arco-design/web-vue/es/descriptions/interface";

export interface PolicyRecord {
  id: string;
  name: string;
  number: number;
  count: number;
  createdTime: string;
}
export interface PolicyParams extends Partial<PolicyRecord> {
  current: number;
  size: number;
}
export interface PolicyListRes {
  list: PolicyRecord[];
  total: number;
}

// 服务套餐管理
export function queryPolicyList(params: PolicyParams):any {
  return axios.get<PolicyListRes>("/strategy", {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
// 枚举类型
export function getType(type: any) {
  // console.log(params);
  return axios.get<any>(`/enumParam/${type}`,);
}
// 禁用/启用
export function action(uid: String) {
  // console.log(params);
  return axios.put<any>('/strategy/status' + "?uid="+uid, 
   
  );
}
// 删除服务套餐
export function deleteService(uid: any):any {
  // console.log(params);
  return axios.delete<any>(`/strategy/${uid}`);
}


// 删除权益信息
export function delstrategyService(uid: any):any {
  // console.log(params);
 
  return axios.delete<any>(`/strategyService/${uid}`);
}

// 根据Id获取编辑详情
export function detail(params: any) {
  // console.log(params);
  return axios.get<any>("/strategyService/list",{
   params
  });
}
// 创建服务套餐
export function createService(data: any) {
  // console.log(params);
  return axios.post<any>("/strategy",data);
}
// 修改服务套餐
export function editeService(data: any) {
  // console.log(params);
  return axios.put<any>("/strategy",data);
}
// 上传权益icon
export function uploadIcon(data: any) {
  // console.log(params);
  return axios.post<any>("/strategyService/uploadIcon",data);
}









// 创建业务系统
export function getsystem(data: any):any {
  // console.log(params);
 
  return axios.post<any>("/system",data);
}


// 刷新秘钥
export function secret(params: any) {
  // console.log(params);
  return axios.put<any>(`/system/secret/${params}`);
}
// 修改秘钥
export function system(data: any) {
  // console.log(params);
  return axios.put<any>("/system",data);
}





export interface ServiceRecord {
  id: number;
  title: string;
  description: string;
  name?: string;
  actionType?: string;
  icon?: string;
  data?: DescData[];
  enable?: boolean;
  expires?: boolean;
}
export function queryInspectionList() {
  return axios.get("/api/list/quality-inspection");
}

export function queryTheServiceList() {
  return axios.get("/api/list/the-service");
}

export function queryRulesPresetList() {
  return axios.get("/api/list/rules-preset");
}


