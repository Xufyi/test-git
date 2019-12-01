import SessionStorage from '@/utils/sessionStorage'
import LocalStorage from '@/utils/localStorage'
import store from '@/store/index'

export default [
  {
    path: '/home',
    name: 'Home',
    // redirect: '/dashboard',
    meta: {
      title: '主页',
      hidden: true
    },
    beforeEnter: (to, from, next) => {
      let sessionToken = SessionStorage.get("token") != 'undefined' ? SessionStorage.get("token"):null;
      // let localToken = LocalStorage ? LocalStorage.get("token"):null;
      if(sessionToken){
          next();
          return;
      }
      next('/')
    },
    component: resolve => require(['@/pages/Main'], resolve),
    // children: [
    //   {
    //     path: 'dashboard',
    //     name: 'Dashboard',
    //     meta: {
    //       title: '主面板'
    //     },
    //     component: resolve => require(['@/pages/Main'], resolve)
    //   }
    // ]
  },
  {
    path: '/',
    name: 'Login',
    meta: {
      title: '登陆'
    },
    props: true ,
    component: resolve => require(['@/pages/login/login'], resolve)
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
      title: '注册'
    },
    props: true ,
    component: resolve => require(['@/pages/login/register'], resolve)
  },
  {
    path: '/perfectInfo',
    name: 'PerfectInfo',
    meta: {
      title: '完善信息'
    },
    props: true ,
    component: resolve => require(['@/pages/login/perfectInfo'], resolve)
  },
  {
    path: '/operationGuide',
    name: 'operationGuide',
    meta: {
      title: '操作向导'
    },
    component: resolve => require(['@/pages/operation-guide'], resolve)
  },
  {
    path: '/toSupplier',
    name: 'toSupplier',
    // redirect: '/dashboard',
    meta: {
      title: '查看供应商',
      hidden: true
    },
    // beforeEnter: (to, from, next) => {
    //   let sessionToken = SessionStorage.get("token") != 'undefined' ? SessionStorage.get("token"):null;
    //   // let localToken = LocalStorage ? LocalStorage.get("token"):null;
    //   if(sessionToken){
    //       next();
    //       return;
    //   }
    //   next('/')
    // },
    component: resolve => require(['@/pages/toSupplier'], resolve),
  },
  {
    path: '/kanban/:id',
    name: 'kanban',
    component: resolve => require(['@/pages/monitor/qualityKanban/kanbanModule/quality-kanban-projectionScreen.vue'], resolve)
  },
  {
    path: '/downloadPDF',
    name: 'downloadPDF',
    component: resolve => require(['@/components/pdf/download-PDF.vue'], resolve)
  },
]
