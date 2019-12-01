import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
import * as MutationTypes from "./mutation-types";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:null,
    windowWidth: 0,
    windowHeight:0,
    permissions:[],
    showNavFlag:true,
    renderExamList:false,
    oldMainTabPaneName:'',
    isLogin:false,
    stas:false,
    newTask:[],
    newText:[],
  },
  actions,
  getters:{
    pageWidth: function(state){
      return state.windowWidth-(state.showNavFlag?260:50)-48;
    }
  },
  mutations:{
    ['stas']:function(state,v){
      state.stas = v
    },
    [MutationTypes.WINDOW_WIDTH_CHANGE]:function (state,v) {
      state.windowWidth = v;
    },
    [MutationTypes.WINDOW_HEIGHT_CHANGE]:function (state,v) {
      state.windowHeight = v;
    },
    [MutationTypes.NAV_SHOW_CHANGE]:function (state,v) {
      state.showNavFlag = v;
    },
    [MutationTypes.PERMISSION_CHANGE]:function (state,v) {
      state.permissions = v;
    },
    [MutationTypes.CURRENTUSERID_CHANGE]:function (state,v) {
      state.currentUserId = v;
    },
    [MutationTypes.CUSTOMERID_CHANGE]:function (state,v) {
      state.customerId = v;
    },
    [MutationTypes.LOCALE_CHANGE]:function (state,v) {
      state.locale = v;
    },
    [MutationTypes.RENDER_CHANGE]:function(state,v){
      state.renderExamList = v;
    },
    [MutationTypes.OLDTABPANENAME](state,v){
      if(state.oldMainTabPaneName == v){
        return;
      }
      state.oldMainTabPaneName = v;
    },
    [MutationTypes.ISLOGIN]:(state,v) => {
      state.isLogin = v;
    },
    ["NEWTASK"]:(state,v) => {
      state.newTask = v;
    },
    ["NEWTEXT"]:(state,v) => {
      state.newText = v;
    },
  }
})
