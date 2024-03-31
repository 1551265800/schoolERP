import axios from "axios";
import qs from "query-string";
import type { DescData } from "@arco-design/web-vue/es/descriptions/interface";

export interface PolicyRecord {
  heLiBaoOrderNo: string;
  orderNo: string;
  owningServiceProvider: string;
  productTypes:  string;
  orderdate: string;
  paymentMethod: string;
  orderStatus: string;
  actualTransactionAmount: string;
  ledgerCount: Number;
  isLedger: string;
  buyingPrice: Number;

}
export interface PolicyParams extends Partial<PolicyRecord> {
  current: number;
  size: number;
  subMchType:0
}
export interface PolicyListRes {
  list: PolicyRecord[];
  total: number;
}
export interface types {
 type:string
}

// 旅居商城和列表数据
export function getStoreList(params:any) :any{
  return axios.get<PolicyListRes>("/order/getListPage", {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}


// 订单详情
export function listDetail(params:any) :any{
  return axios.get<PolicyListRes>(`/order/${params}`,
  );
}
// 分账信息
// export function listDetailData(params:any) :any{
//   return axios.get<PolicyListRes>(`/order/getChPayEstimatedLedger/${params}`,
//   );
// }
//基本信息
// export function merchantList(params: any) {
//   // console.log(params);
//   return axios.get<any>("/merchant/account", {
//     params,
//   });
// }
// 枚举类型
export function getType(type: any) {
  // console.log(params);
  return axios.get<any>(`/enumParam/${type}`,);
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


