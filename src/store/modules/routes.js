import * as MutationTypes from '../mutation-types'
// import * as ActionTypes from '../action-types'
export default {
  state: {
    map: {},
    prev: {
      url: undefined
    }
  },
  /**
   * store 中的状态的唯一方法
   * 通过store.commit()方法触发，来改变状态值
   */
  mutations: {
    /**
     * 路由键值映射
     */
    [MutationTypes.ROUTES_MAP] (state, status) {
      Object.assign(state.map, status)
    },
    // 页面需要登录，纪录页面数据
    [MutationTypes.ROUTES_LOG_PREV_PAGE] (state, playload) {
      state.prev.url = playload.url
    },
    // 清理路由信息
    [MutationTypes.ROUTES_CLEAR_PREV_PAGE] (state) {
      state.prev.url = undefined
    }
  },
  /**
   * 通过store.dispatch()方法来触发
   */
  actions: {
  },
  /**
   * 对外暴露的方法
   */
  getters: {

  }
}
