/**
 * api接口统一管理
 */
import { get, post, $delete, put } from './httpAxios.js'

// Get 请求
export const apiGet = (url, data) => get(url, data)
// post 请求
export const apiPost = (url, data) => post(url, data)
// put 请求
export const apiPut = (url, data) => put(url, data)
// delete 请求
export const apiDel = (url, data) => $delete(url, data)

export async function init(url, data, method) {
  // 方法
  if (method == 'get') {
    this.result = await apiGet(url, data).then((res) => {
      return res
    })
  }
  if (method == 'post') {
    this.result = await apiPost(url, data).then((res) => {
      return res
    })
  }
  if (method == 'put') {
    this.result = await apiPut(url, data).then((res) => {
      return res
    })
  }
  if (method == 'delete') {
    this.result = await apiDel(url, data).then((res) => {
      return res
    })
  }
  return this.result
}
