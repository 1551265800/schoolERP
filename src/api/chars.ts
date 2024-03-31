import axios from "axios";
import qs from "query-string";

// 统计
export function statistics(): any {
  return axios.post<any>("/countMsg/inReceiptCountByDay");
}
