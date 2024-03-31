import axios from "axios";
import qs from "query-string";

// 根据id发送数据
export function messageCheck(id: any) {
  return axios.post<any>(`/retentionSample/messageCheck?id=${id}`);
}
