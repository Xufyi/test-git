import * as MutationTypes from '../mutation-types'
import sessionStorageTools from '@/utils/sessionStorage'
export default {
  state: {
    firstMenuItem:"",//保存当前点击的第一级菜单
  },
  /**
   * store 中的状态的唯一方法
   * 通过store.commit()方法触发，来改变状态值
   */
  mutations: {
    /**
     * 存储用户点击第一级菜单
     */
    // [MutationTypes.SAVE_CURRENT_FIRST_MENU] (state,value) {
    //     state.firstMenuItem = value
    // }
  },
  /**
   * 通过store.dispatch()方法来触发
   */
  actions: {

  },
  getters: {
    // 对外暴露的方法
  }
}
