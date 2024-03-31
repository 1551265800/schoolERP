import axios from "axios";
import qs from "query-string";


// 表单校验
export function login(data: any):any{
  return axios.request({
        url: `/login`,
        method: 'post',
        data
  })

}
export function obtainingTheVerificationCode(params: any){
  return axios.get<any>("/code", {
    params,
    responseType: 'arraybuffer'
  });
}