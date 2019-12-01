import * as MutationTypes from '../mutation-types'
import sessionStorageTools from '@/utils/sessionStorage'
export default {
  state: {
      secendMenuList:[],
      showSecendMenu:false
  },
  /**
   * store 中的状态的唯一方法
   * 通过store.commit()方法触发，来改变状态值
   */
  mutations: {
    /**
     * 用户点击第一级菜单
     */
    [MutationTypes.SECEND_MENU_CHANGE] (state) {

    }
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
