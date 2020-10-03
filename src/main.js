import "babel-polyfill";
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import axios from 'axios'
import Qs from 'qs'
import iView from 'iview'
import filters from './filters/index'
import * as MutationType from './store/mutation-types'
// import * as ActionType from './store/action-types'
import SessionStorage from '@/utils/sessionStorage'
import LocalStorage from '@/utils/localStorage'
import menus from '@/router/menus.js'

import utils from '@/utils/Common'
import objects from '@/utils/CommonObject'
//样式
import 'iview/dist/styles/iview.css';

import '@/assets/styles/style.css'

import ReportDateSelector from './components/reportDateSelector/ReportDateSelector'

import IqisAffix from './components/page/IqisAffix'

import IqisUpload from './components/file/IqisUpload'

import $ from 'jquery'
import ah from 'ajax-hook'
// import Blob from './src/utils/excel/Blob.js'
// import Export2Excel from './src/utils/excel/Export2Excel.js'

import Affix from "iview/src/components/affix/affix";
import Notice from "iview/src/components/notice"



/* import VueI18n from 'vue-i18n'// 引入i18n国际化插件 */

Vue.component("ReportDateSelector",ReportDateSelector)
Vue.component("IqisUpload",IqisUpload)
Vue.component("IqisAffix",IqisAffix)

Vue.component("EditorTextCell",resolve => require(['@/components/editableTable/TextCell'], resolve))
Vue.component("EditorSelectCell",resolve => require(['@/components/editableTable/SelectCell'], resolve))
Vue.component("EditorSelectCell2",resolve => require(['@/components/editableTable/SelectCell2'], resolve))
Vue.component("EditorCascaderCell",resolve => require(['@/components/editableTable/CascaderCell'], resolve))
Vue.component("EditorCascaderCell2",resolve => require(['@/components/editableTable/CascaderCell2'], resolve))
Vue.component("Process",resolve => require(['@/components/process/process'], resolve))

//Vue.use
Vue.use(iView,{
  i18n:(key,value)=>i18n.t(key,value)
});
/* Vue.use(VueI18n)// 引入i18n国际化插件 */


Vue.config.productionTip = false


//过滤器的注册
for (var key in filters) {
  if (filters.hasOwnProperty(key)) {
    Vue.filter(key, filters[key])
  }
}


if(process.env.API_HOST){
  axios.defaults.baseURL = process.env.API_HOST;
}
window.API_HOST = axios.defaults.baseURL||''; //export to iframe by huiping

axios.defaults.headers= {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};

axios.defaults.transformRequest= [function (data, headers) {
  // Do whatever you want to transform the data
  let result = data;
  if(headers["Content-Type"] == 'application/x-www-form-urlencoded; charset=UTF-8'){
    result = Qs.stringify(data, {arrayFormat: 'brackets'})
  }else if(headers["Content-Type"] == 'application/json; charset=UTF-8'){
    result = JSON.stringify(data)
  }

  return result;
}];

//关闭UC浏览器的左右滑动换页
(function stopGesture(){
  var control = navigator.control || {}
  if(control.gesture){
    control.gesture(false);
  }
})();


axios.interceptors.response.use((response) => {

  const data = response.data

  return data;
}, (error) => {
  //console.log(error.response);
  if(error.response){
    let code = error.response.data.code;
    let status = error.response.status;
    if(code == "014011"){
      router.push({ name: 'login', params: { error: "014011" }});
    }
    else if(status == "500"){
      Notice.error({
        title: i18n.t('tips')+':',
        desc: '服务器忙，请稍后再试'
      });
    }
    else{
      Notice.error({
        title: i18n.t('tips')+':',
        desc: error.response.data.message ? error.response.data.message : i18n.t('error')
      });
    }
  }
  return Promise.reject(error);
});
// 拦截演示账号
// 考虑 axios 和 $.ajax
var blacklist = "JHL2018"
//登录请求使用如下方法拦截方便
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    var black = false

    if(config.url.indexOf('/user/login') != -1){
      black  = blacklist.indexOf(config.data.tenant) != -1 
    } 
    // else if(config.headers['x-access-token']){
    //   var token = config.headers['x-access-token']
    //   token = token.match(/.*\.(.*)\..*/)[1]

    //   var decode = decodeURIComponent(atob(token).split('').map(function (c) {
    //         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    //   }).join(''));
    //   var tenant = JSON.parse(decode)
    //   black  = blacklist.indexOf(tenant.tenantAccount) != -1 
    // }
    if(black){
      config.baseURL = config.baseURL ?  (config.baseURL + '/tmp') : '/tmp'
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
//非登录请求使用如下方法拦截方便
ah.hookAjax({ 
  open:function(arg,xhr){
    var black = false
    if(arg[1].indexOf('/user/login') == -1 && arg[1].indexOf('/tenant/register') == -1){

      var token = SessionStorage.get("token")
        if(token){
          token = token.match(/.*\.(.*)\..*/)[1]
        var decode = decodeURIComponent(atob(token).split('').map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        var tenant = JSON.parse(decode)
        black  = tenant && tenant.tenantAccount && blacklist.indexOf(tenant.tenantAccount) != -1 
      }
      
    }

    if(black){
      if(arg[1].indexOf('/iqis-ws') != -1){
        arg[1] = arg[1].replace('/iqis-ws', "/tmp/iqis-ws")
      }else {
        if(process.env.API_HOST){
          arg[1] = arg[1].replace(process.env.API_HOST, process.env.API_HOST + "/tmp")
        }else{
          arg[1] = "/tmp" + arg[1]
        }
      }
    }
  }
})

function IqisUtils(){
  return utils;
}
function ParamsStr(data){
  let str = '?';
  for (const key in data) {
  //console.log(data[key])
    if (data.hasOwnProperty(key)) {
        let oneKey = key + '=' + data[key];
        str += oneKey+'&'
    }
  }
  if(str == '?'){
    return ''
  }
  return str
}
function download (a){
  return function(url,params,methods,callback) {
    let baseURL = '';
    if(process.env.API_HOST){
      baseURL = process.env.API_HOST;
    }
    //intercept DEMO account
    var black = false
    var token = SessionStorage.get("token")
    token = token.match(/.*\.(.*)\..*/)[1]
    var decode = decodeURIComponent(atob(token).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    var tenant = JSON.parse(decode)
    black  = tenant && tenant.tenantAccount && blacklist.indexOf(tenant.tenantAccount) != -1 

    if(black){
        if(process.env.API_HOST){
          baseURL = baseURL.replace(process.env.API_HOST, process.env.API_HOST + "/tmp")
        }else{
          baseURL = "/tmp" + baseURL
        }
    }
    //intercept DEMO account end

    let Params = params || {};
    let Methods = methods || 'get';
    Params.token = SessionStorage.get("token");
    let BaseUrl
   // if(callback == 'a'){
       BaseUrl = baseURL+ url + ParamsStr(Params);
    //}else{
       //BaseUrl = baseURL+ url +'?query='+params.query+'&page='+params.page+'&limit='+params.limit+'&token='+params.token;
    //}
    if(Methods == 'get'){
      let A = document.createElement('a');
      A.setAttribute('download','');
      A.href=BaseUrl;
      A.click();
    }else{
      $('<form method="post" target="_blank" role="form" hidden="hidden" action='+BaseUrl+'></form>').appendTo('body').submit().remove();
    }
  }
}
let ARR = {
  inArray:function(arr,val,type,callback){
    if(arr && arr.length>0){
      for(let i = 0; i<arr.length; i++){
        if(arr[i] == val){
          if(type == 1){
            return true;
          }
        }
      }
    }
    if(type == 1){
      return false
    }
  }
}
//注册axios,localstorage,sessionstorage在Vue原型上
Vue.prototype.$http = axios
Vue.prototype.$SessionStorage = SessionStorage
Vue.prototype.$LocalStorage = LocalStorage
Vue.prototype.$ = $
Vue.prototype.$iqis={
  menus:menus,
  utils: new IqisUtils(),
  objects:objects,
  download: new download(),
  arrFun: ARR,
}

/* vue-自定义指令-拖拽 */
Vue.directive('drag-table-column',{
  bind: function (el, binding, vnode) {
    var oDiv=$(el);
    var columns = binding.value;
    //console.log("drag-table-column binding!!")
    //console.log(columns);

    //console.log(binding);
    //console.log(vnode);
    var ths = oDiv.find(".ivu-table-header th");
    $(ths).each(function (thIndex,th) {
      let index = thIndex;
      $(th).addClass("iqis-drag-table-column");
      th.onmousedown=function(ev){

        vnode.componentInstance.$emit("drag-start");

        let $th = $(this);
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

        let disX=ev.clientX;
        let disY=ev.clientY;

        let offset = $th.offset();
        let thWidth = $th.width();

        let mouseOffsetX = disX - offset.left;


        let endX = offset.left + thWidth;
        let startX =  offset.left ;


        let tipEl = window.document.createElement("div");
        tipEl.className = "iqis-drag-table-tip";

        tipEl.style.top = offset.top+"px";

        let moveX = 0;

        if((ev.clientX > startX && ev.clientX < endX)){
          window.document.body.appendChild(tipEl);

          document.onmousemove=function(ev){

            moveX=ev.clientX-disX;
            let t=ev.clientY-disY;
            //console.log(moveX+","+t);
            tipEl.style.left = (moveX+thWidth+offset.left)+"px";
            //columns[index].width+=l;

            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

          };
          document.onmouseup=function(){
            window.document.body.removeChild(tipEl);
            let col = columns[index];
            if(col.width){
              let newW = col.width + moveX ;
              if(col.minWidth){
                newW = Math.max(newW,col.minWidth);
              }
              if(col.maxWidth){
                newW = Math.min(newW,col.maxWidth);
              }
              col.width = Math.max(8,newW);
            }
            document.onmousemove=null;
            document.onmouseup=null;
          };
        }
//minWidth

      };
    })

  }
});


Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};


/* // 注册i18n实例并引入语言文件，文件格式等下解析
const i18n = new VueI18n({
  locale: 'zh_CN',
  messages: {
    'zh_CN': require('@/assets/languages/zh.json'),
    'en_US': require('@/assets/languages/en.json')
  }
}) */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,//将i18n注入到vue实例中
  components: { App },
  template: '<App/>'
})


var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?188e513941d69828162bec428cf91b70";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
  //console.log(hm,'hm')
  //console.log(s,'s')
  
})();


console.log('test-aaa');
console.log('test-bbb');