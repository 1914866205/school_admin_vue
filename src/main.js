import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import httpAxios from './views/utils/httpAxios'
import './assets/css/global.scss'
Vue.use(ElementUI)
// 富文本
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import global from './js/global.js'
import check from './js/checkData.js'
import './assets/css/global.css'

Vue.use(VueQuillEditor /* { default global options } */)
//高德地图
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '025c96a31208089600fc9d6bdbd5f465',
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor'
  ], //依赖配置，根据自己的需求引入
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
})
// 设置默认接口请求路径
Vue.prototype.axios = axios
Vue.prototype.global = global
Vue.prototype.check = check

Vue.config.productionTip = false

// router.beforeEach((to, from, next) => {
//   let token = localStorage.getItem('token')
//   let isLogin
//   if (token == 'null') {
//     isLogin = false
//   } else {
//     isLogin = true
//   }
//   if (!isLogin) {
//     if (to.path !== '/login') {
//       return next({ path: '/login' })
//     } else {
//       next()
//     }
//   } else {
//     if (to.path === '/login') {
//       return next({ path: '/' })
//     }
//     next()
//   }
// })



new Vue({
  router,
  store,
  httpAxios,
  render: (h) => h(App)
}).$mount('#app')
