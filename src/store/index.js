import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),
    menuList: JSON.parse(localStorage.getItem('menuList'))
  },
  mutations: {
    setToken(state, token){
      state.token = token
    },
    setUser(state, user){
      state.user = user
    },
    setMenuList(state, menuList){
      state.menuList = menuList
    }
  },
  actions: {},
  modules: {}
})
