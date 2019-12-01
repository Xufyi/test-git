<template>
  <div class="layout iqis-main">

    <div class="iqis-header">
      <div class="iqis-header-item-left iqis-logo-area">
        <img class="iqis-logo" src="../../static/img/new-head-logo.png" alt="" style="margin-left: 8px;height: 40px;margin-top: 4px"></img>
      </div>
      <div class="iqis-header-item-left iqis-logo-area" style="font-size:18px;color:#fff;line-height:48px;">
        <span style="margin:12px 30px 0;color:#519CF9;background:#519CF9;width:2px;height:24px;float:left;"></span>
        <span style="font-family:'微软雅黑'">{{companyName}}</span>
      </div>
      
      <ul class="iqis-header-item-right iqis-header-right-fns" style='width:auto;float:right'>
          <!-- <li class="remind" @click="onMessageButtonClick"><i class="header-icon remind-icon"><Icon type="ios-bell"></Icon></i></li>
          <li class="cus-portrait"><i class="header-icon cus-icon"><Icon type="ios-person"></Icon></i></li> -->
          <!-- <li class="remind">
            <a style="font-size:14px;color:#fff;text-decoration:underline;display:block;" target="_blank" href="http://www.wuqc.cn/h-pd-4.html#_pp=114_785">立即购买</a>
          </li> -->
          <!-- <li class="remind" style="padding:0;">
            
          </li> -->
          <li v-if="tenantId&&tenantId==1000" class="remind">
            <!-- <a style="font-size:14px;color:#fff;text-decoration:underline;display:block;" target="_blank" href="?register">立即注册</a> -->
            <a style="font-size:14px;color:#fff;text-decoration:underline;display:block;" target="_blank" href="javascript:void(0)" @click="toRegister">{{$t('login.SignUpNow')}}</a>
          </li>
          <li class="remind">
            <i  style='display:inline-block;width:25px;height:25px' class="header-icon remind-icon">
              <TaskBox @open-tab="onTaskOpenTab"></TaskBox>
            </i>
          </li>
          <li class="remind">
            <i  style='display:inline-block;width:25px;height:25px' class="header-icon remind-icon">
              <MessageBox @open-tab="onMessageOpenTab"></MessageBox>
            </i>
          </li>
          <li class="remind" style='height:48px;overflow:hidden'>
            <i  style='display:inline-block;height:25px' class="header-icon remind-icon">
              <ProfileBox @open-tab="onProfileOpenTab" @logout="logout" placement="bottom-end"></ProfileBox>
            </i>
          </li>
          <!-- <li class="cus-info"><span>{{user.name}}</span></li> -->
      </ul>
      <div style="float:right;height:100%;cursor:pointer" class="languageSelectBox" @click="changeLanguage">
        <img src="static/img/language.svg" style="width: 20px;position: relative;top: 14px;float:left;">
        <!-- <Select class="languageSelect" v-model="languageMain" style="margin-top:8px;width:70px;border:0;font-size:12px!important;background:transparent!important;" placeholder="language" @on-change="changeLanguage">
          <Option value="zh_CN">简体中文</Option>
          <Option value="en_US">English</Option>
        </Select> -->
        <span style="line-height: 48px;margin: 0 20px 0 10px;color: #fff;">{{languageMain=='zh_CN'?"English":"简体中文"}}</span>
      </div>

    </div>
    <div class="iqis-body">
      <div class="iqis-sider iqis-menu-anim-icons" :class="mainMenuClass" style="">

        <div style="width: 120px;height: 100%;flex:0 0 120px;position:relative" class="iqis-main-menu-first">
          <div class="versions" :style='menu.isCollapsed?"width:50px":"width:100%"' style='transition:all 0.5s;position:absolute;bottom:0;height:54px;color:#C0C0C0;font-size:12px;text-align:center;border-top:1px solid #464B53;line-height:54px'>
            <!-- 版本号 -->
            {{menu.isCollapsed?version:i18n.t('version')+' '+version}}
          </div>
          <Menu width="120px" theme="dark" ref="mainMenu" @on-select="clickMainMenu" :active-name="menu.currentMainMenu" >
            <Button type="text" @click="triggerLeft" class="iqis-main-show-btn"><Icon type="navicon-round" class="iqis-main-menu-icon"></Icon></Button>
            <template v-for="menuItem in menu.data" >
              <MenuItem v-if="menuItem.show" :name="menuItem.key" :key="menuItem.key">
                <span class="iqis-main-item-icon" :class="'iqis-menu-icon-'+menuItem.icon"></span>
                <span class="main-menu-text">{{menuItem.title}}</span>
              </MenuItem>
            </template>
          </Menu>
        </div>
        <div class="iqis-main-menu-second" style='width:140px;'>
          <Menu style="width: 140px;margin-right: -15px;flex:0 0 138px; min-height: 100%;" ref="secendMenu" :openNames="menu.openMenus" :active-name="menu.currentMenuItem" @on-select="selectSecendMenu" @on-open-change="onOpenMenus">
            <div class="iqis-second-menu-title">
              {{menu.selectMenuItem.title}}
            </div>
            <template v-for="sm in this.menu.selectMenuItem.children">
              <MenuItem v-if="sm.page && sm.show" :name="sm.key"  class="iqis-menu-submenu" :class="sm.developing?'menuDeveloping':''" :key="sm.key">{{sm.title}}</MenuItem>
              <Submenu v-if="!sm.page && sm.show" :name="sm.key" :key="sm.key">
                <template slot="title">
                  {{sm.title}}
                </template>
                <MenuItem v-if="ssm.show" :class="ssm.developing?'menuDeveloping':''" v-for="ssm in sm.children" :name="ssm.key" :key="ssm.key">{{ssm.title}}</MenuItem>
              </Submenu>
            </template>
          </Menu>
        </div>

      </div>
      <div class="iqis-context" style='flex:1' v-if="tabs.length>0">
        <Tabs type="card" closable class="iqis-main-tabs" v-model="currentTab" :animated="false" @on-click="tabClick" @on-tab-remove="closeTab">
          <TabPane v-for="tab in tabs" :name="tab.key" :key="tab.key" class="iqis-menu-anim-icons iqis-tab-anim" :closable="tab.closable" :label="tab.tabTitle"> 
            <component :is="tab.page" :params="tab.params" :tab-key="tab.key" :ref='tab.key' @open-tab="openTab" @close-tab="closeTab" ></component> 
          </TabPane>
        </Tabs>
      </div>
      <div v-else style="width: 100px;height: 100%;padding: 24px 0 0 24px;flex: 1 1 0%;position: relative;">
        <div style="flex: 0 0 32px;margin-right: 23px;border-bottom: 1px solid #dddee1;height: 32px;margin-bottom: -1px;line-height: 1.5;font-size: 14px;box-sizing: border-box;white-space: nowrap;overflow: hidden;position: relative;zoom: 1;">{{$t('login.yhn')}}</div>
        <div style="position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);width:560px;">
          <span style="float:left;font-size:28px;margin-right:10px;height:49px;line-height:44px;">{{$t('login.welcome')}}</span><img src="../assets/img/login-page-logo.png" height="49" width="438"/>
        </div>
      </div>
    </div>
    <BackTop :height="100" :bottom="60"></BackTop>
  </div>
</template>

<script>
  import $ from 'jquery'
  import * as MutationTypes from '../store/mutation-types'
  import Layout from "iview/src/components/layout/layout";
  import Affix from "iview/src/components/affix/affix";
  import SessionStorage from '@/utils/sessionStorage'
  import LocalStorage from '@/utils/localStorage'
  import { MessageBox, TaskBox, ProfileBox } from './message'
  import * as SockJS from 'sockjs-client'
  import Stomp from 'stompjs'
  export default {
    components: {
      Affix,
      Layout,
      MessageBox,
      TaskBox,
      ProfileBox
    },
    data(){
      return {
        version: 'V1.4.28',//版本号
        permissions:[],
        i18n:window.i18n,
        languageMain:this.$SessionStorage.get("language-main")||'zh_CN',
        selectFilesCenter:false,
        tenantId:'',
        reload:true,
        profileShow:false,
        messageShow:false,
        taskShow:false,
        companyName:'',
        topHead:{
          state:false
        },
        user:{
          name:"-"
        },
        permission:[],
        menu:{
          menuTheme:'dark',
          currentMenuItem:"",
          currentMainMenu:"monitoring-center",
          openMenus:[],
          isCollapsed:false,
          data:[],
          showNavFlag:true,
          menuMap:{},
          secondMenuItem:null
        },
        scrollTop:0,
        windowHeight:window.innerHeight,
        windowWidth:window.innerWidth,
        currentTab:null,
        tabs:[
          {"title":i18n.t("main.home"),"tabTitle":i18n.t("main.home"),"key":"tab-index","page":"page-welcome",closable:false,params:{}}
        ],
        pageHeight:window.innerHeight,
        isMessageBoxShow : false,
        isTaskBoxShow: false,
        isProfileBoxShow: false
      }
    },
    created () {
      let that = this;
      if(SessionStorage.get("reload")){
        window.location.reload()
        SessionStorage.set('reload','');
      }

      //设备类型
      this.$http.defaults.headers["device-type"]='PC'

      //中英文切换
      let sessionLanguage = SessionStorage.get("language-main") != 'undefined' ? SessionStorage.get("language-main"):null;
      let localLanguage = LocalStorage.get("language-main") != 'undefined' ? LocalStorage.get("language-main"):null;
      this.$http.defaults.headers["language-main"] =sessionLanguage || localLanguage;
      if(this.$http.defaults.headers["language-main"]==null){
        this.$http.defaults.headers["language-main"]='zh_CN'
      }
      //console.log(this.$http.defaults.headers["language-main"],'语言====================')
      if(that.$http.defaults.headers["language-main"]=='en_US'){
        that.$nextTick(function(){
          $('.iqis-sider').addClass('en-menu')
          $('.iqis-body').addClass('en_US')
        })
      }
      that.$store.commit(MutationTypes.LOCALE_CHANGE,that.$iqis.utils.clone(that.$http.defaults.headers["language-main"]));

      let sessionToken = SessionStorage.get("token") != 'undefined' ? SessionStorage.get("token"):null;
      let localToken = LocalStorage.get("token") != 'undefined' ? LocalStorage.get("token"):null;
      let visitoModeToken = SessionStorage.get("visitoModeToken") ? SessionStorage.get("visitoModeToken"):null;

      //访客模式 路由上是否为 visitoMode = true && visitoModeToken 不为空;
      let visitoModeQuery = this.$route.query?this.$route.query.visitoMode:false;
      this.$http.defaults.headers["x-access-token"] = sessionToken || localToken;

      let resp = that.$iqis.utils.syncget('/tenant/user/profile');
      let profile = JSON.parse(JSON.stringify(resp.data))
      if(!profile.tenantDetailDto){
        that.$Modal.confirm({
            title: '试用提示',
            content: '<p>您尚未开通该产品，是否立即试用？</p>',
            okText:"是",
            cancelText:"否",
            onOk: () => {
                that.$http.post('/tenant/trial/product?prodType=STANDARD_PROD').then(res=>{
                  that.$Message.success("开通成功")
                  location.reload()
                })
            },
            onCancel: () => {
                if(window.location.search.includes('goTo=')){
                  let url = window.location.search.split('=')[1]
                  window.open(url,'_self')
                }else{
                  window.open("http://www.wuqc.cn/",'_self')
                }
            }
        });
      }else if(profile.tenantDetailDto.tenantStatus=="EXPIRED"||profile.tenantDetailDto.tenantStatus=="FROZEN"){
        that.logout()
      }

      /** 访客模式 */
      if(visitoModeToken && visitoModeQuery){
        this.$http.defaults.headers["x-access-token"] = visitoModeToken;
        this.$router.push({path:'/toSupplier?visitoMode=true'});
      }
      var menuConfig = this.$iqis.utils.clone(this.$iqis.menus);
      // that.$http.get("/tenant/user/profile").then(function (resp) {
        
        // if(resp.data.permissions.indexOf('QUERY_FILE')==-1){
        //   for(let i in menuConfig[9].children[1].children){
        //     if(menuConfig[9].children[1].children[i].tabTitle=='文件库')
        //     menuConfig[9].children[1].children.splice(i,1)
        //   }
        // }
        // if(resp.data.permissions.indexOf('QUERY_HISTORY_FILE')==-1){
        //   for(let i in menuConfig[9].children[1].children){
        //     if(menuConfig[9].children[1].children[i].tabTitle=='历史版本')
        //     menuConfig[9].children[1].children.splice(i,1)
        //   }
        // }
        // if(resp.data.permissions.indexOf('QUERY_RECOVERY_FILE')==-1){
        //   for(let i in menuConfig[9].children[1].children){
        //     if(menuConfig[9].children[1].children[i].tabTitle=='回收站')
        //       menuConfig[9].children[1].children.splice(i,1)
        //   }
        // }
        // if(resp.data.permissions.indexOf('QUERY_FILE')==-1&&resp.data.permissions.indexOf('QUERY_HISTORY_FILE')==-1&&resp.data.permissions.indexOf('QUERY_RECOVERY_FILE')==-1){
        //   menuConfig[9].children.splice(1,1)
        // }
        // //console.log(menuConfig,'111111111111')
        that.menu.data = menuConfig;
      // })

      this.resizeFun();
      this.menu.selectMenuItem = menuConfig[0];
      this.mapifyMenuItem(this.menu.menuMap,menuConfig,null);
      let wxURL = '';
      if(process.env.NODE_ENV ==='development'){
        wxURL = process.env.API_HOST;
      }
      this.$http.get('/tenant/user/topic').then(res=>{
    	let webFn = function(){
    		let socket = new SockJS(wxURL +'/iqis-ws');
	    	let StompClient = Stomp.over(socket);
	            StompClient.connect({},function(frames){
	        	for(let i=0;i<res.data.length;i++){
	                StompClient.subscribe(res.data[i], function(message){
                    // //console.log(message,'messages')
                    // //console.log(JSON.parse(message.body),'messages')
                    let itemMessage = JSON.parse(message.body)
                    if(itemMessage && itemMessage.type === 'TASK'){
                      that.$store.commit('NEWTASK',[itemMessage]);
                      // //console.log(that.$store.state.newTask)
                      that.$Notice.info({
                        title: i18n.t('login.tn'),
                        desc: i18n.t('login.newTask'),
                      });
                    }
                    if(itemMessage && itemMessage.type === 'TEXT'){
                      that.$store.commit('NEWTEXT',[itemMessage]);
                      that.$Notice.info({
                        title: i18n.t('login.notification'),
                        desc: i18n.t("login.newMessage"),
                      });
                    }
	                },function(err){
	                	//console.log(err);
	                })
    			}
            });
	        }
    	setTimeout(webFn,0);
    }).catch(err=>{
        //console.log(err)
    })
    },
    watch: {
      isLOGON:function(val,oldval){
        if(val){
          //console.log("退出登入！")
        }
      },
      "menu.isCollapsed":function(val){
        //console.log("val="+val);
        //console.log("currentMainMenu:"+this.menu.currentMainMenu);
        if(!val){
          //this.selectMainMenu(this.menu.currentMainMenu);
          //let that = this;
          ////console.log("that.menu.currentMainMenu:"+that.menu.currentMainMenu);
          ////console.log("that.currentTab:"+that.currentTab);
          let that = this;
          this.$nextTick(function () {
            //that.menu.currentMenuItem = that.currentTab;
            //that.tabClick(that.currentTab);
            that.selectMainMenu(that.menu.currentMainMenu);

          })
          // setTimeout((that)=>{
          //
          // },200,this);

        }
      },
      '$store.getters.pageWidth':'resizeTabs'
    },
    //this.$store.state
    computed:{
      mainMenuClass(){
        let locale = SessionStorage.get("language-main");
        return {
          "iqis-main-sider-min": this.menu.isCollapsed,
          "en-menu": !this.menu.isCollapsed&&locale=='en_US',
        }
      },
      isLOGON(){
        return this.$store.state.isLogin;
      }
    },
    methods: {
      changeLanguage(){
        let that = this;
        that.languageMain=that.languageMain=='zh_CN'?'en_US':'zh_CN'
        if(that.languageMain=='zh_CN'){
          //console.log('中文')
          this.$SessionStorage.set("language-main",'zh_CN');
          
          location.reload()
        }else{
          //console.log('英文')
          this.$SessionStorage.set("language-main",'en_US');
          location.reload()
        }
        //console.log(this.$SessionStorage.get("language-main"))
        that.$i18n.locale=that.languageMain
        this.$http.defaults.headers["language-main"]=this.$SessionStorage.get("language-main");
        
      },
      toRegister(){
        const {href} = this.$router.resolve({ 
          name: 'Register',
        }); 
        window.open(href, '_blank');
      },
      showActive(){
        // $(this).addClass('active').sibling().removeClass('active');
      },
      getMenu(data){
        let that = this;
        console.log(that.permissions,"that.permissions");
        // return;
        
        for(let i in data){
          if(data[i].children){
            that.getMenu(data[i].children)
          }
          if(data[i].permission){
            for(let j in data[i].permission){
              let perm='_'+data[i].permission[j]+','
              console.log(perm,"---");
              //  let reg = new RegExp("[A-Z]*(\b"+perm+"\b)$")
              let reg = new RegExp(",[A-Z]*"+perm);
              if(reg.test(that.permissions)){
                data[i].show=true;//该目录下但凡有一个权限存在，则保留该菜单项
                break;
              }else{
                data[i].show=false
              }
            }
          }else{
            data[i].show=true;
          }
          
        }
      },
      refreshMenuPermission(menus){
        for(var i=0;i<menus.length;i++){
          var item = menus[i];
          let flag = true;
          if(item.permission && item.permission.length > 0){
            for(var j=0;i<item.permission.length;j++){
              if(this.$store.state.permissions.indexOf(item.permission[j]) == -1){
                flag = false;
                break;
              }
            }
          }
          item.show = flag;
          if(item.children){
            this.refreshMenuPermission(item.children);
          }
        }
      },
      logout () {
        let that = this;
        that.$LocalStorage.set("token",'');
        that.$SessionStorage.set("token",'');
        that.$store.commit('ISLOGIN',false);
        that.$http.defaults.headers["x-access-token"] = "";
        // this.$router.push({path:"/",params:{error:"014011"}});
        window.location.reload();
      },
      menuAffic(state){
        var itabBar = $(".ivu-tabs-bar");
        var itabContent = $(".ivu-tabs-content");
        var ww = itabBar.parent().width();
        if(state){
          itabBar.addClass("ivu-affix");
          itabBar.addClass("iqis-affix-tabs")
          itabBar.css("width",ww+"px");
          itabContent.css("margin-top","48px");
        }else{
          itabBar.removeClass("ivu-affix");
          itabBar.removeClass("iqis-affix-tabs");
          itabContent.css("margin-top","0");
        }


      },
      tabClick(key){
        if(key === 'tab-index'){
          this.$refs[key][0].init();
        }
        //console.log(new Date().getTime() + '====>click tab: ' + key);
        var menuItem = this.menu.menuMap[key];
        if(menuItem){
          this.menu.currentMainMenu = menuItem.rootKey;
          if(!this.menu.isCollapsed){
            this.selectMainMenu(menuItem.rootKey);
          }
          let that = this;
          let thatMenuKey = key;
          this.$nextTick(function () {
            that.menu.currentMenuItem = thatMenuKey;
            that.$nextTick(function () {
              that.$refs.secendMenu.updateActiveName();
            });
          });
        }
      },
      closeTab(key){
        if(key){
          this.$store.commit('stas',false);
          // clearInterval(timeS)
          // console.log(this.tabs,"this.tabs");
          for(var i=0;i<this.tabs.length;i++){
            if(this.tabs[i].key == key){
              this.tabs.splice(i,1);//起关闭标签页的作用
              if(i < this.tabs.length-1){
                this.currentTab = this.tabs[i].key;
              }else if(i > 1){
                this.currentTab = this.tabs[i-1].key;
              }else if(this.tabs.length > 0){
                this.currentTab = this.tabs[0].key;
              }
              if(this.tabs.length == 1){
                this.currentTabFun(true);
              }else{
              this.currentTabFun();
              }
              this.$store.commit('RENDER_CHANGE',true);
              return;
            }
          }
        }
      },
      currentTabFun(value){
        if(value){
          this.currentTab = "tab-index";
          return;
        }
        // this.currentTab = this.$store.state.oldMainTabPaneName;
        this.currentTab = this.tabs[this.tabs.length-1].key
      },
      tabPaneIndex(oldtabpanename){
        let currentTab = oldtabpanename?oldtabpanename:this.currentTab
        this.$store.commit(MutationTypes.OLDTABPANENAME,currentTab);
      },
      showTab(cfg){ //openTab (click menu)
        if(!cfg || !cfg.key){
          return;
        }
        //console.log("showTab:")
        //console.log(cfg)
        var toTab = null;
        for(var i=0;i<this.tabs.length;i++){
          var tabItem = this.tabs[i];
          if(cfg.key == tabItem.key){
            toTab = tabItem.key;
          }
        }
        this.tabPaneIndex(false)

        if(!toTab){
          this.tabs.push(cfg);
          this.currentTab = cfg.key;
        }else{
          this.currentTab = toTab;
        }

      },
      selectSecendMenu(menuKey){

        var menuItem = this.menu.menuMap[menuKey];
        if(menuItem){
          this.showTab(menuItem);
        }
      },
      topMenuChange(state){
        this.topHead.state = state;
      },
      clickMainMenu(m){
        this.menu.isCollapsed = false;
        this.selectMainMenu(m);

      },
      selectMainMenu(m){
        {

          for(var i=0;i<this.menu.data.length;i++){
            var menuItem = this.menu.data[i];

            if(menuItem.key == m){
              this.menu.selectMenuItem = menuItem;
              this.menu.currentMainMenu = menuItem.key;
              break;
            }
          }
          var openMenuName = [];
          if(this.menu.selectMenuItem && this.menu.selectMenuItem.children){
            for(var i=0;i<this.menu.selectMenuItem.children.length;i++){
              var subMenu = this.menu.selectMenuItem.children[i];
              if(subMenu.children){
                openMenuName.push(subMenu.key);
              }
            }
          }
          this.menu.openMenus = openMenuName;
          // //console.log(this.$refs.secendMenu)
          //this.$refs.secendMenu.openNames = this.menu.openMenus;
          let sm = this.$refs.secendMenu;
          let that = this;
          this.$nextTick(function () {
            sm.updateOpened();
            that.menu.currentMenuItem = that.currentTab;
            that.$nextTick(function () {
              that.$refs.secendMenu.updateActiveName();
            });
          })
        }

      },
      onOpenMenus(mmmmm){
        //console.log("mmmm:"+mmmmm);
        //console.log(this.$refs.secendMenu.$children);

        let sm = this.$refs.secendMenu;
        let that = this;
        this.$nextTick(function(){
          that.menu.openMenus = [];
          for(var i=0;i<sm.$children.length;i++){
            var ci = sm.$children[i]
            //console.log(ci)
            //console.log(ci.opened)
            if(ci.opened){
              that.menu.openMenus.push(ci.name);
            }
          }
          //console.log(that.menu.openMenus)

        });

      },
      triggerLeft(){
        //console.log(this.menu.isCollapsed,'11111111111111')
        this.menu.isCollapsed = !this.menu.isCollapsed;
        this.$store.commit(MutationTypes.NAV_SHOW_CHANGE,!this.menu.isCollapsed);
      },
      mapifyMenuItem(map,menus,rootKey){
        for(var i=0;i<menus.length;i++){
          var item = menus[i];
          var itemRootkey = rootKey;
          if(rootKey == null){
            itemRootkey = item.key;
          }
          item["rootKey"] = itemRootkey;
          if(item.children){
            this.mapifyMenuItem(map,item.children,itemRootkey);
          }else{
            map[item.key] = item;
          }
        }
      },
      resizeTabs(){
        var itabBar = $(".ivu-tabs-bar");
        let itemWidth = (this.$store.getters.pageWidth)
        var ww = itemWidth;
        if(itabBar.hasClass("ivu-affix")){
          itabBar.css("width",ww+"px");
        }
        //console.log($(".ivu-tabs-bar").width(),'??????')
      },
      initMain(){

        this.$Spin.show();
        let that = this;
        this.$http.get("/tenant/user/profile").then(function (resp) {
          //console.log(resp.data,'当前登录用户信息')
          that.user.name = resp.data.name;
          that.tenantId = resp.data.tenantId;

          document.title = resp.data.companyName+" | "+i18n.t('login.fqc');
          that.companyName=resp.data.companyName;

          if(resp.data.permissions){
            that.$store.commit(MutationTypes.PERMISSION_CHANGE,that.$iqis.utils.clone(resp.data.permissions));
            that.$store.commit(MutationTypes.CURRENTUSERID_CHANGE,that.$iqis.utils.clone(resp.data.userId));
            // //console.log(resp.data.permissions,'当前用户所有权限字段')
            for(let i in resp.data.permissions){
              if(resp.data.permissions[i].indexOf('SELECT')==-1){
                that.permissions.push(resp.data.permissions[i])
              }
            }
            let permsArray = [...that.permissions]
            that.permissions=","+that.permissions.join(',')+','
            that.getMenu(that.menu.data)
            if(permsArray.length==0){//若没有任何权限，则不打开任何页面
              that.tabs = []
            }else if(that.permissions.indexOf("QUERY_HOME_PAGE")==-1){//若有权限但没有首页权限，则打开所拥权限的第一个页面
              that.getMenu2(that.menu.data)
            }else{//若有首页权限，则打开首页
              that.currentTab = "tab-index"
            }
            //console.log(that.menu.data,'menu.data1111111111111111111111')
          }
          // that.refreshMenuPermission(that.menu.data);
          that.$Spin.hide();
        });
      },
      resizeFun(focus){
        this.windowHeight = document.documentElement.clientHeight
        this.windowWidth = document.documentElement.clientWidth

        if(this.windowHeight){
          this.pageHeight = this.windowHeight-60;
          if(focus){
            this.$store.commit(MutationTypes.WINDOW_WIDTH_CHANGE,this.windowWidth-1);
            this.$store.commit(MutationTypes.WINDOW_HEIGHT_CHANGE,this.windowHeight-1);
          }else{
            this.$store.commit(MutationTypes.WINDOW_WIDTH_CHANGE,this.windowWidth);
            this.$store.commit(MutationTypes.WINDOW_HEIGHT_CHANGE,this.windowHeight);
          }
        }else{
          let self=this;
          this.$nextTick(() => {
            self.resizeFun();
          });
        }

      },
      handleScroll(e){
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        this.scrollTop = scrollTop;
      },
      doubleClick(key,title,page,params){
        this.openTab(key,title,page,params);
      },
      openTab(key,title,page,params){
        let cfg ={
          title: title,
          tabTitle: title,
          show: true,
          key: key,
          page: page,
          params:params
        };
        this.showTab(cfg);
      },
      //,openTab(key,title,page,params){
      onSwitchTaskBox:function (argument) {
          //console.log(new Date().getTime() + '====>Main: onSwitchTaskBox , argument=' + argument);
          this.isTaskBoxShow= argument;
      },
      onTaskOpenTab:function (tabInfo) {
        // this.openTab("monitoring-center-real-time","实时监控-来自消息","page-monitor-real-time",null);
        let key = tabInfo.key;
        let page = tabInfo.page;
        let title  = tabInfo.title;
        let params = tabInfo.params;
        this.openTab(key,title,page,params);
      },
      onSwitchMessageBox:function (argument) {
          //console.log(new Date().getTime() + '====>Main: onSwitchMessageBox , argument=' + argument);
          this.isMessageBoxShow = argument;
      },
      onMessageOpenTab:function (tabInfo) {//从子组件中传值过来，执行openTab页面跳转
        let key = tabInfo.key;
        let page = tabInfo.page;
        let title  = tabInfo.title;
        let params = tabInfo.params;
        this.openTab(key,title,page,params);
      },
      onSwitchProfileBox:function (argument) {
          //console.log(new Date().getTime() + '====>Main: onSwitchProfileBox , argument=' + argument);
          this.isProfileBoxShow = argument;
      },
      onProfileOpenTab:function (tabInfo) {
        let key = tabInfo.key;
        let page = tabInfo.page;
        let title  = tabInfo.title;
        let params = tabInfo.params;
        this.openTab(key,title,page,params);
      },
      getMenu2(data){
        let that = this;
        let flag = true;
        for(let i in data){
          if(!flag){
            break
          }
          if(data[i].show){
            flag = false;
            if(data[i].children){
              that.getMenu2(data[i].children)
            }else{
              this.tabs = []
              this.tabs = [{"title":data[i].title,"tabTitle":data[i].tabTitle,"key":data[i].key,"page":data[i].page,closable:true,params:{}}]
              this.currentTab =data[i].key
              this.tabClick(this.currentTab)
            }
          }
        }
      },
    },
    mounted:function () {
      const that = this
      console.log(this.$store,"this.$store");
      console.log(this.$store.getters,"this.$store.getters");
      console.log(this.$store.getters.pageWidth,"this.$store.getters.pageWidth");
      
      
      window.onresize = () => {
        return (() => {
          that.resizeFun();
        })()
      };

      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      this.menu.showNavFlag = true
      //console.log("start init main");
      this.initMain()
      //this.currentMenuItem = "11-3"
      //window.addEventListener('scroll', this.handleScroll);
    }
  }
</script>

<style scoped>
  .layout{
    border: 0;
    font-family: "Microsoft YaHei","微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",  Arial, sans-serif;
    background: #fff;
    /* overflow: hidden; */
    display: -webkit-flex; /* Safari */
    display:flex;
    flex-direction: column;
    height:100%;
    width: 100%;
    align-items:stretch;
  }

  .iqis-header{
    flex:0 0 48px;
    height: 48px;
    background: #418FEE;
  }
  .iqis-body{
    flex:auto;
    height: 100%;
    background: #fff;
    display: -webkit-flex; /* Safari */
    display:flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items:stretch;
  }
  .iqis-sider{
    background: #fff;
    flex: 0 0 260px;
    width: 260px;
    height: 100%;
    display: -webkit-flex; /* Safari */
    display:flex;
  }
  .iqis-context{
    /* flex: 1 1 100px; */
    width:100px;
    height: 100%;
    padding: 24px 0 0 24px;
  }



  .layout-con{
    height: 100%;
    width: 100%;
  }
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

  .iqis-header-context{
    background: #418FEE;
    width: 100%;
    height: 40px;
    overflow: hidden;
  }

  .iqis-logo{
    height: 48px;
  }

  .iqis-header-item-left{
    float: left;
  }
  .iqis-header-item-right{
    float:right;
  }

  .iqis-header-right-fns{
    margin-right: 24px;
    color: #FFF;
  }

  .iqis-header-right-fns li{
    list-style-type:none;
    display: block;
    float: left;
    /* font-size: 24px; */
    line-height: 48px;
    margin-left: 30px;
  }

  .cus-info{
    font-size: 14px !important;
  }

</style>
<style>
  .ivu-icon-ios-close-empty{
    width: 14px !important;
  }

  .iqis-menu-anim-icons{
    transition: all .3s ease;
  }

  .ivu-menu-dark{
    background-color:#3C4047 !important;
  }


  .iqis-main-menu-first{
    width: 130px;
    float: left;
    background:#3C4047 !important;
    height: 500px;
  }

  .iqis-main-menu-first .ivu-menu-item-active{
    background: #418FEE !important;
    color: #fff !important;
  }

  .iqis-main-menu-second{
    width: 140px;
    /*max-height: 100vh;*/
    height: 100%;
    float: right;
    overflow: auto;
  }
  .iqis-main-menu-second::-webkit-scrollbar{
    display:none;
  }

  .iqis-main-menu-second .ivu-menu-submenu-title{
    padding: 1px 2px 1px 20px !important;
    line-height: 28px;
    height: 30px;
    font-weight: bold;
  }

  .iqis-main-menu-second .ivu-menu-submenu .ivu-menu-item{
    padding: 1px 2px 1px 37px !important;
    line-height: 28px;
    height: 30px;
  }

  .iqis-second-menu-title{
    height: 70px;
    line-height: 70px;
    font-size: 16px;
    font-weight: bold;
    padding-left: 36px;
    margin-bottom: 10px;
    background: #fff url("../assets/img/second-title-bottom.png") repeat-x 0 100%;
  }

  .iqis-main-menu-second .ivu-menu-submenu-title-icon:before{
    content: "\f104" !important;
  }

  .iqis-main-menu-second .ivu-menu-submenu-title-icon{
    float: left !important;
    top: 4px !important;
    margin-top: 3px !important;
  }
  /*.iqis-main-menu-second .ivu-menu-child-item-active .ivu-menu-submenu-title .ivu-icon{*/
    /*color: #2d8cf0;*/
  /*}*/
  /*ivu-menu-submenu ivu-menu-item-active ivu-menu-child-item-active*/
  .iqis-main-menu-second .ivu-menu-child-item-active .ivu-menu-submenu-title{
    background-color: #F1F8FF;
  }

  .iqis-main-menu-second .ivu-menu-opened .ivu-menu-submenu-title{
    background-color: #fff !important;
  }

  .iqis-main-menu-second .ivu-menu-item-selected{
    background-color: #F1F8FF;

  }
  /*ivu-menu-submenu ivu-menu-item-active ivu-menu-opened ivu-menu-child-item-active*/

  .iqis-main-show-btn{
    background-color: #42474F !important;
    height: 40px !important;
    width: 100% !important;
    color: #8B8B8B !important;
    text-align: center;
    font-size: 16px !important;
    box-shadow:none !important;
  }

  .iqis-main-menu-first .ivu-menu-item{
    padding: 1px 2px 1px 15px !important;
    line-height: 38px;
    font-weight: bold;
    height: 40px;
    overflow: hidden;
  }

  .main-menu-text{
    padding-left: 10px;
  }

  .iqis-main-sider-min{
    flex: 0 0 50px !important;
    width: 50px !important;
    overflow: hidden;
  }

  .iqis-main-sider-min .iqis-main-menu-first{
    flex: 0 0 50px;
  }

  .iqis-main-sider-min .iqis-main-menu-icon{
    transform: rotate(90deg);
  }

  .iqis-main-sider-min .iqis-main-menu-first .ivu-menu,
  .iqis-main-sider-min .iqis-main-menu-first{
    transition: width .2s ease;
    width:50px !important;
  }

  .iqis-main-sider-min .iqis-main-menu-second{
    /*display: none;*/
    width: 1px;
    overflow: hidden;
  }
  .iqis-main-sider-min .main-menu-text{
    display: none;
  }



  .iqis-main-content{
    overflow-x: auto;
    padding-top: 20px;
  }
  .ivu-tabs-tab{
    border-radius: 0 !important;
  }
  .ivu-back-top{
    opacity: 0.3;
  }
  .iqis-tab-anim{
    transition: none !important;
  }

  .iqis-menu-submenu{
    font-size: 14px;
    font-weight: bold;
    height: 30px;
    padding: 1px 2px 1px 37px !important;
    line-height: 28px;
  }

  .iqis-main-item-icon{
    display: inline-block;
    float: left;
    width: 14px;
    height: 38px;
  }

  .iqis-main-tabs{
    display: -webkit-flex; /* Safari */
    display:flex;
    flex-direction: column;
    height: 100%;
  }
  .iqis-main-tabs .ivu-tabs-bar{
    flex:0 0 32px;
    margin-right: 23px;
    margin-bottom: 10px;
  }
  .iqis-main-tabs .ivu-tabs-content{
    flex:1 1 100px;
    padding-right: 24px;
    overflow: auto;
  }



  .iqis-menu-icon-monitoring-center{
    background: transparent url("../assets/icons/monitoring-center-icon-normal.svg") no-repeat 50% 50%;
  }
  .ivu-menu-item-selected .iqis-menu-icon-monitoring-center,
  .ivu-menu-item:hover .iqis-menu-icon-monitoring-center{
    background: transparent url("../assets/icons/monitoring-center-icon-hover.svg") no-repeat 50% 50%;
  }

  .iqis-menu-icon-quality{
    background: transparent url("../assets/icons/quality-icon-normal.svg") no-repeat 50% 50%;
  }
  .ivu-menu-item-selected .iqis-menu-icon-quality,
  .ivu-menu-item:hover .iqis-menu-icon-quality{
    background: transparent url("../assets/icons/quality-icon-hover.svg") no-repeat 50% 50%;
  }


  .iqis-menu-icon-iqc{
    background: transparent url("../assets/icons/iqc-icon-normal.svg") no-repeat 50% 50%;
  }
  .ivu-menu-item-selected .iqis-menu-icon-iqc,
  .ivu-menu-item:hover .iqis-menu-icon-iqc{
    background: transparent url("../assets/icons/iqc-icon-hover.svg") no-repeat 50% 50%;
  }


  .iqis-menu-icon-product{
    background: transparent url("../assets/icons/product-icon-normal.svg") no-repeat 50% 50%;
  }
  .ivu-menu-item-selected .iqis-menu-icon-product,
  .ivu-menu-item:hover .iqis-menu-icon-product{
    background: transparent url("../assets/icons/product-icon-hover.svg") no-repeat 50% 50%;
  }


  .iqis-menu-icon-pqc{
    background: transparent url("../assets/icons/pqc-icon-normal.svg") no-repeat 50% 50%;
  }
  .ivu-menu-item-selected .iqis-menu-icon-pqc,
  .ivu-menu-item:hover .iqis-menu-icon-pqc{
    background: transparent url("../assets/icons/pqc-icon-hover.svg") no-repeat 50% 50%;
  }

  .iqis-menu-icon-oqc{
    background: transparent url("../assets/icons/oqc-icon-normal.svg") no-repeat 50% 50%;
  }
  .ivu-menu-item-selected .iqis-menu-icon-oqc,
  .ivu-menu-item:hover .iqis-menu-icon-oqc{
    background: transparent url("../assets/icons/oqc-icon-hover.svg") no-repeat 50% 50%;
  }

  .iqis-menu-icon-customer{
    background: transparent url("../assets/icons/customer-icon-normal.svg") no-repeat 50% 50%;
  }
  .ivu-menu-item-selected .iqis-menu-icon-customer,
  .ivu-menu-item:hover .iqis-menu-icon-customer{
    background: transparent url("../assets/icons/customer-icon-hover.svg") no-repeat 50% 50%;
  }

  .iqis-menu-icon-statistic{
    background: transparent url("../assets/icons/statistic-icon-normal.svg") no-repeat 50% 50%;
  }
  .ivu-menu-item-selected .iqis-menu-icon-statistic,
  .ivu-menu-item:hover .iqis-menu-icon-statistic{
    background: transparent url("../assets/icons/statistic-icon-hover.svg") no-repeat 50% 50%;
  }

  .iqis-menu-icon-equipment{
    background: transparent url("../assets/icons/equipment-icon-normal.svg") no-repeat 50% 50%;
  }
  .iqis-menu-icon-files{
    background: transparent url("../assets/icons/filecentericon-normal.svg") no-repeat 50% 50%;

  }
  .ivu-menu-item-selected .iqis-menu-icon-files,
  .ivu-menu-item:hover .iqis-menu-icon-files{
    background: transparent url("../assets/icons/filecentericon-hover.svg") no-repeat 50% 50%;
  }
  .ivu-menu-item-selected .iqis-menu-icon-equipment,
  .ivu-menu-item:hover .iqis-menu-icon-equipment{
    background: transparent url("../assets/icons/equipment-icon-hover.svg") no-repeat 50% 50%;
  }

  .iqis-menu-icon-system{
    background: transparent url("../assets/icons/system-icon-normal.svg") no-repeat 50% 50%;
  }
  .ivu-menu-item-selected .iqis-menu-icon-system,
  .ivu-menu-item:hover .iqis-menu-icon-system{
    background: transparent url("../assets/icons/system-icon-hover.svg") no-repeat 50% 50%;
  }
  .iqis-main-item-icon{
    width: 18px;
    height: 38px;
    background-size:100%!important;
  }

  .iqis-affix-tabs{
    top: 0;
    padding-top: 20px;
    background-color: rgb(255, 255, 255);
    /*box-shadow: rgb(55, 55, 55) 0px 10px 10px -8px;*/
  }

  .iqis-main .iqis-header .ivu-badge-dot,
  .iqis-main .iqis-header .ivu-badge-count{
    box-shadow: 0 0 0 1px #418FEE;
    -webkit-font-smoothing: antialiased;
  }

 p{
   padding: 50px;
 }
 .ivu-table{
   /* font-size:14px!important; */
 }
 .iqis-header-right-fns{
   margin-right:22px!important;
 }
.iqis-header-right-fns li{
  margin-left:0!important;
  padding:0 12px;
}
.iqis-header-right-fns li:hover,.iqis-header-right-fns li:active,.iqis-header-right-fns li:focus{
  background:#4b98f8;
}
.iqis-sider.iqis-menu-anim-icons{
  border-right-color:#000;
}
.ivu-menu-vertical.ivu-menu-light:after{
  width:2px;  
  height:inherit;
  background:rgba(201,209,216,0.29);
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
  color:#343B42;
}


/* 英文版样式 */
.en-menu.iqis-sider{
  flex: 0 0 315px;
  width: 315px;
}
.en-menu .iqis-main-menu-first .ivu-menu-item{
  padding-left:10px!important;
}
.en-menu .iqis-main-menu-first{
  width:130px!important;
  flex:0 0 130px!important;
}
.en-menu .iqis-main-menu-first .ivu-menu{
  width:130px!important;
}
.en-menu .main-menu-text{
  padding-left: 5px;
}
.en-menu .iqis-main-menu-second{
  width:185px!important;
}
.en-menu .ivu-menu-light{
  width:185px!important;
}
.en-menu .iqis-main-menu-second .ivu-menu-submenu-title{
  padding-left:10px!important;
}
.en-menu .iqis-main-menu-second .ivu-menu-submenu .ivu-menu-item{
  padding-left:30px!important;
}
.en-menu .iqis-menu-submenu{
  padding-left:27px!important;
}
.en_US .tablePadding{
  padding:0!important;
}

.languageSelect .ivu-select-selection{
  background:transparent;
  border:0;
  color:#fff!important;
}
.languageSelect .ivu-select-placeholder,.languageSelect .ivu-icon{
  color:#fff!important;
}
.languageSelect .ivu-select-dropdown{
  top:43px!important;
}
.languageSelect .ivu-select-placeholder,.languageSelect .ivu-select-selected-value{
  font-size:12px!important;
}
.languageSelect .ivu-select-dropdown{
  width:70px!important;
}
.languageSelect .ivu-select-item{
  padding: 7px 0;
  text-align:center;
}
.languageSelect .ivu-icon{
  display: none!important;
}
.languageSelect .ivu-select-placeholder,.languageSelect .ivu-select-selected-value{
  padding:0!important;
}
.languageSelect .ivu-select-selection{
  text-align:center;
}
.menuDeveloping{
  color:#aaa;
}
.ivu-modal p{
  padding:0;
}
</style>
