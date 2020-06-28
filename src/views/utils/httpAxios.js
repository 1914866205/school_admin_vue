import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8081'
// axios.defaults.baseURL = 'http://120.26.177.51:8081'

//全局请求拦截
axios.interceptors.request.use((config) => {
  //请求不是登录、验证码接口，添加token header
  if (['/sysUser/login', '/captcha'].indexOf(config.url) === -1) {
    const token = localStorage.getItem('token')
    if (token != null) {
      config.headers.Authorization = token
    }
    return config
  }
})

/**
 * get方法，对应 get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}

/**
 * post方法，对应 post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}

/**
 * put方法，对应 put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function put(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .put(url, params)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}

/**
 * $delete，对应 delete请求
 */
export function $delete(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        data: params
      })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
