<template>
  <div class="layout iqis-main">

    <div class="iqis-header">
      <div class="iqis-header-item-left iqis-logo-area">
        <img class="iqis-logo" src="../../static/img/head-logo.png" alt="" style="margin-left: 8px;height: 32px;margin-top: 8px"></img>
      </div>
      <div class="iqis-header-item-left iqis-logo-area" style="font-size:18px;color:#fff;line-height:48px;">
        <span style="margin:12px 30px 0;color:#519CF9;background:#519CF9;width:2px;height:24px;float:left;"></span>
        <span style="font-family:'微软雅黑'">{{companyName}}</span>
      </div>



    </div>
    <div class="iqis-body toSupplier">
      <div class="iqis-sider iqis-menu-anim-icons" :class="mainMenuClass" style="border-right:1px solid #C9D1D8">

        <div style="width: 120px;height: 100%;flex:0 0 120px;" class="iqis-main-menu-first">

          <Menu width="120px" theme="dark" ref="mainMenu" @on-select="selectSecendMenu" :active-name="menu.currentMainMenu" >
            <Button type="text" @click="triggerLeft" class="iqis-main-show-btn"><Icon type="navicon-round" class="iqis-main-menu-icon"></Icon></Button>
            <!-- <template v-for="menuItem in this.menuConfig" >
              <MenuItem v-if="menuItem.show" :name="menuItem.key" :key="menuItem.key">
                <span class="iqis-main-item-icon" :class="'iqis-menu-icon-'+menuItem.icon"></span>
                <span class="main-menu-text">{{menuItem.title}}</span>
              </MenuItem>
            </template> -->
            <MenuItem v-if="menuConfig[0].show" :name="menuConfig[0].key">
                <span class="iqis-main-item-icon iqis-menu-icon-monitoring-center"></span>
                <span class="main-menu-text">{{menuConfig[0].title}}</span>
            </MenuItem>
            <MenuItem v-if="menuConfig[1].show" :name="menuConfig[1].key">
                <span class="iqis-main-item-icon iqis-menu-icon-pqc"></span>
                <span class="main-menu-text">{{menuConfig[1].title}}</span>
            </MenuItem>
            <MenuItem v-if="menuConfig[2].show" :name="menuConfig[2].key">
                <span class="iqis-main-item-icon iqis-menu-icon-pqc"></span>
                <span class="main-menu-text">{{menuConfig[2].title}}</span>
            </MenuItem>
            <MenuItem v-if="menuConfig[3].show" :name="menuConfig[3].key">
                <span class="iqis-main-item-icon iqis-menu-icon-pqc"></span>
                <span class="main-menu-text">{{menuConfig[3].title}}</span>
            </MenuItem>
            <MenuItem v-if="menuConfig[4].show" :name="menuConfig[4].key">
                <span class="iqis-main-item-icon iqis-menu-icon-pqc"></span>
                <span class="main-menu-text">{{menuConfig[4].title}}</span>
            </MenuItem>
            <MenuItem v-if="menuConfig[5].show" :name="menuConfig[5].key">
                <span class="iqis-main-item-icon iqis-menu-icon-oqc"></span>
                <span class="main-menu-text">{{menuConfig[5].title}}</span>
            </MenuItem>
            <MenuItem v-if="menuConfig[6].show" :name="menuConfig[6].key">
                <span class="iqis-main-item-icon iqis-menu-icon-oqc"></span>
                <span class="main-menu-text">{{menuConfig[6].title}}</span>
            </MenuItem>
            <MenuItem v-if="menuConfig[7].show" :name="menuConfig[7].key">
                <span class="iqis-main-item-icon iqis-menu-icon-oqc"></span>
                <span class="main-menu-text">{{menuConfig[7].title}}</span>
            </MenuItem>
            <Submenu name="1" v-if="menuConfig[8].show">
                <template slot="title">
                  <span class="iqis-main-item-icon iqis-menu-icon-statistic"></span>
                  <span class="main-menu-text">{{$t('customer.statisticRecord')}}</span>
                </template>
                <MenuItem :name="menuConfig[8].key">
                  <!-- <span class="iqis-main-item-icon iqis-menu-icon-statistic"></span> -->
                    <span class="main-menu-text">{{menuConfig[8].title}}</span>
                </MenuItem>
                <MenuItem  :name="menuConfig[9].key">
                  <!-- <span class="iqis-main-item-icon iqis-menu-icon-statistic"></span> -->
                    <span class="main-menu-text">{{menuConfig[9].title}}</span>
                </MenuItem>
                <MenuItem :name="menuConfig[10].key">
                  <!-- <span class="iqis-main-item-icon iqis-menu-icon-statistic"></span> -->
                    <span class="main-menu-text">{{menuConfig[10].title}}</span>
                </MenuItem>
                <MenuItem :name="menuConfig[11].key">
                  <!-- <span class="iqis-main-item-icon iqis-menu-icon-statistic"></span> -->
                    <span class="main-menu-text">{{menuConfig[11].title}}</span>
                </MenuItem>
                <MenuItem :name="menuConfig[12].key">
                  <!-- <span class="iqis-main-item-icon iqis-menu-icon-statistic"></span> -->
                    <span class="main-menu-text">{{menuConfig[12].title}}</span>
                </MenuItem>
                <MenuItem :name="menuConfig[13].key">
                  <!-- <span class="iqis-main-item-icon iqis-menu-icon-statistic"></span> -->
                    <span class="main-menu-text">{{menuConfig[13].title}}</span>
                </MenuItem>
                <MenuItem :name="menuConfig[14].key">
                  <!-- <span class="iqis-main-item-icon iqis-menu-icon-statistic"></span> -->
                    <span class="main-menu-text">{{menuConfig[14].title}}</span>
                </MenuItem>
            </Submenu>
          </Menu>
        </div>

      </div>
      <div class="iqis-context" style='flex:1'>
        <Tabs type="card" closable class="iqis-main-tabs" v-model="currentTab" :animated="false" @on-click="tabClick" @on-tab-remove="closeTab">
          <TabPane v-for="tab in tabs" :name="tab.key" :key="tab.key" class="iqis-menu-anim-icons iqis-tab-anim" :closable="tab.closable" :label="tab.tabTitle"> <component :is="tab.page" :params="tab.params" :tab-key="tab.key" @open-tab="openTab" @close-tab="closeTab" ></component> </TabPane>
        </Tabs>
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
          menuConfig : [
            {
                title: i18n.t('customer.realTime'),
                tabTitle: i18n.t('customer.realTime'),
                show: true,
                permission: 'SELECT_MONITOR',
                key: "monitoring-center-real-time",
                page: "page-monitor-real-time"
            },{
                title: i18n.t('customer.passRateRecord'),
                tabTitle: i18n.t('customer.passRateRecord'),
                show: true,
                permission: 'SELECT_DIRECT_RATE',
                key: "qc-pqc-bad-ratio",
                page: "page-exam-pqc-bad-list"
            },{
                title: i18n.t('customer.pqcRecord'),
                tabTitle: i18n.t('customer.pqcRecord'),
                show: true,
                permission: 'SELECT_PQC',
                key: "qc-pqc-examine",
                page: "page-exam-pqc-list"
            },{
                title: i18n.t('customer.cpkRecord'),
                tabTitle:  i18n.t('customer.cpkRecord'),
                show: true,
                permission: 'SELECT_DATA_RECORD',
                key: "qc-pqc-cpk",
                page: "page-exam-pqc-cpk-list"
            },{
                title:  i18n.t('customer.pqcAbnRecord'),
                tabTitle: i18n.t('customer.pqcAbnRecord'),
                show: true,
                permission: 'SELECT_PQC_ABNORMAL',
                key: "qc-pqc-abnormal",
                page: "page-exam-pqc-abnormal-list"
            },{
                title: i18n.t('customer.trialProdRecord'),
                tabTitle: i18n.t('customer.trialProdRecord'),
                show: true,
                permission: 'SELECT_TRIAL_PROD',
                key: "qc-pqc-trialProd",
                page: "page-exam-pqc-trialProd-list"
            },{
                title: i18n.t('customer.oqcRecord'),
                tabTitle:i18n.t('customer.oqcRecord'),
                show: true,
                permission: 'SELECT_OQC',
                key: "qc-oqc-examine",
                page: "page-exam-oqc-list"
            },{
                title:i18n.t('customer.oqcAbnRecord'),
                tabTitle: i18n.t('customer.oqcAbnRecord'),
                show: true,
                permission: 'SELECT_OQC_ABNORMAL',
                key: "qc-oqc-abnormal",
                page: "page-exam-oqc-abnormal-list"
            },{
                title:  i18n.t('menus.productCV'),
                tabTitle: i18n.t('menus.productCV'),
                show: true,
                permission: 'SELECT_PRODUCT_PROFILE',
                key: "statistic-analysis-product-resume",
                page: "page-resume-profile"
            },{
                title: i18n.t('menus.histogram'),
                tabTitle: i18n.t('menus.histogram'),
                show: true,
                key: "statistic-analysis-diagram-histogram",
                page: "page-statistic-histogram"
            },{
              title: i18n.t('menus.pieChart'),
              tabTitle: i18n.t('menus.pieChart'),
              show: true,
              key: "statistic-analysis-diagram-preGiaph",
              page: "page-statistic-preGiaph"
            },{
              title: i18n.t('menus.trendMap'),
              tabTitle:  i18n.t('menus.trendMap'),
              show: true,
              key: "statistic-analysis-diagram-tendency",
              page: "page-statistic-tendency"
            },{
              title:  i18n.t('menus.contrastFigure'),
              tabTitle:  i18n.t('menus.contrastFigure'),
              show: true,
              permission: [],
              key: "statistic-analysis-diagram-comparison",
              page: "page-statistic-comparison"
            },  {
              title: i18n.t('menus.paretoChart'),
              tabTitle:  i18n.t('menus.paretoChart'),
              show: true,
              permission: [],
              key: "statistic-analysis-diagram-pareto",
              page: "page-statistic-pareto"
            }, {
              title:  i18n.t('menus.spc'),
              tabTitle: i18n.t('menus.spc'),
              show: true,
              permission: [],
              key: "statistic-spc",
              page: "page-statistic-spc"
            }
        ],
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
          // {"title":"供应产品列表","tabTitle":"供应产品列表","key":"toSupplier-product","page":"page-toSupplier-product",closable:false,params:{}}
          {"title":i18n.t('customer.prodList'),"tabTitle":i18n.t('customer.prodList'),"key":"product-list","page":"page-product-list",closable:false,params:{}}
        ],
        pageHeight:window.innerHeight,
        isMessageBoxShow : false,
        isTaskBoxShow: false,
        isProfileBoxShow: false
      }
    },
    created () {
      let sessionLanguage = SessionStorage.get("language-main") != 'undefined' ? SessionStorage.get("language-main"):null;
      let localLanguage = LocalStorage.get("language-main") != 'undefined' ? LocalStorage.get("language-main"):null;
      this.$http.defaults.headers["language-main"] =sessionLanguage || localLanguage;
      if(this.$http.defaults.headers["language-main"]==null){
        this.$http.defaults.headers["language-main"]='zh_CN'
      }
      if(this.$http.defaults.headers["language-main"]=='en_US'){
        this.$nextTick(function(){
          $('.iqis-body').addClass('en_US')
        })
      }
      if(SessionStorage.get("reload")){
        window.location.reload()
        SessionStorage.set('reload','');
      }
      let sessionToken = SessionStorage.get("token") != 'undefined' ? SessionStorage.get("token"):null;
      let localToken = LocalStorage.get("token") != 'undefined' ? LocalStorage.get("token"):null;
      let visitoModeToken = SessionStorage.get("visitoModeToken") ? SessionStorage.get("visitoModeToken"):null;

      //访客模式 路由上是否为 visitoMode = true && visitoModeToken 不为空;
      let visitoModeQuery = this.$route.query?this.$route.query.visitoMode:false;

      this.$http.defaults.headers["x-access-token"] = sessionToken || localToken;
      /** 访客模式 */
      if(visitoModeToken && visitoModeQuery){
        this.$http.defaults.headers["x-access-token"] = visitoModeToken;
      }

      
      this.resizeFun();
      this.menu.selectMenuItem = this.menuConfig[0];
      this.mapifyMenuItem(this.menu.menuMap,this.menuConfig,null);
      
    },
    watch: {
      isLOGON:function(val,oldval){
        if(val){
          console.log("退出登入！")
        }
      },
      "menu.isCollapsed":function(val){
        console.log("val="+val);
        console.log("currentMainMenu:"+this.menu.currentMainMenu);
        if(!val){
          //this.selectMainMenu(this.menu.currentMainMenu);
          //let that = this;
          //console.log("that.menu.currentMainMenu:"+that.menu.currentMainMenu);
          //console.log("that.currentTab:"+that.currentTab);
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
        return {
          "iqis-main-sider-min": this.menu.isCollapsed
        }
      },
      isLOGON(){
        return this.$store.state.isLogin;
      }
    },
    methods: {
      showActive(){
        // $(this).addClass('active').sibling().removeClass('active');
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
        console.log(new Date().getTime() + '====>click tab: ' + key);
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
        console.log('====>close tab: ' + key);
        if(key){
          for(var i=0;i<this.tabs.length;i++){
            if(this.tabs[i].key == key){
              this.tabs.splice(i,1);
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
          this.currentTab = "product-list";
          return;
        }
        this.currentTab = this.$store.state.oldMainTabPaneName;
      },
      tabPaneIndex(oldtabpanename){
        let currentTab = oldtabpanename?oldtabpanename:this.currentTab
        this.$store.commit(MutationTypes.OLDTABPANENAME,currentTab);
      },
      showTab(cfg){ //openTab (click menu)
        if(!cfg || !cfg.key){
          return;
        }
        console.log("showTab:")
        console.log(cfg)
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
          console.log(this.$refs.secendMenu)
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
        console.log("mmmm:"+mmmmm);
        console.log(this.$refs.secendMenu.$children);

        let sm = this.$refs.secendMenu;
        let that = this;
        this.$nextTick(function(){
          that.menu.openMenus = [];
          for(var i=0;i<sm.$children.length;i++){
            var ci = sm.$children[i]
            console.log(ci)
            console.log(ci.opened)
            if(ci.opened){
              that.menu.openMenus.push(ci.name);
            }
          }
          console.log(that.menu.openMenus)

        });

      },
      triggerLeft(){
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
      },
      initMain(){

        this.$Spin.show();
        let that = this;
        let resp = that.syncget('/tenant/user/profile');//将异步请求改为同步，以解决未拿到customerId就打开了主页面,导致数据筛选不成功的问题"
        // console.log(resp,'当前登录用户的相关信息')
        that.user.name = resp.data.name;

        document.title = resp.data.companyName+" | 工厂质量云";
        that.companyName=resp.data.companyName;
        if(resp.data.permissions){
          that.$store.commit(MutationTypes.PERMISSION_CHANGE,that.$iqis.utils.clone(resp.data.permissions));
          for(let i in that.menuConfig){
              if(resp.data.permissions.indexOf(that.menuConfig[i].permission)!=-1){
                  that.menuConfig[i].show=true;
              }else{
                  that.menuConfig[i].show=false;
              }
          }
        }
        if(resp){
          let tenantId=resp.data.account.slice(13)
          let permissionResp = that.syncget('/bas/getCustomer/'+tenantId);
          that.$store.commit(MutationTypes.CUSTOMERID_CHANGE,that.$iqis.utils.clone(permissionResp.data.customerId));
        }
        that.refreshMenuPermission(that.menu.data);
        that.$Spin.hide();
      },
      syncget(rUrl,param){
        if(process.env.API_HOST){
          rUrl = process.env.API_HOST + rUrl;
        }
        var token = SessionStorage.get("visitoModeToken");
        var r;
        $.ajax({
            url:rUrl
            ,headers: {
                "x-access-token": token
                ,"hours-offset":this.__hour_offset
            }
            ,type:"get"
            ,dataType:"json"
            ,data:param
            ,async: false
        }).done(function(response) {
            r = response;
        });
        return r;
      },
      resizeFun(focus){
        this.windowHeight = document.documentElement.clientHeight
        this.windowWidth = document.documentElement.clientWidth

        console.log("try::"+this.windowWidth);
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
          console.log(new Date().getTime() + '====>Main: onSwitchTaskBox , argument=' + argument);
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
          console.log(new Date().getTime() + '====>Main: onSwitchMessageBox , argument=' + argument);
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
          console.log(new Date().getTime() + '====>Main: onSwitchProfileBox , argument=' + argument);
          this.isProfileBoxShow = argument;
      },
      onProfileOpenTab:function (tabInfo) {
        let key = tabInfo.key;
        let page = tabInfo.page;
        let title  = tabInfo.title;
        let params = tabInfo.params;
        this.openTab(key,title,page,params);
      }

    },
    mounted:function () {
      const that = this
      window.onresize = () => {
        return (() => {
          that.resizeFun();
        })()
      };

      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      this.menu.showNavFlag = true
      console.log("start init main");
      this.initMain()
      this.currentTab = "product-list"



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
    flex: 0 0 120px;
    width: 120px;
    height: 100%;
    display: -webkit-flex; /* Safari */
    display:flex;
  }
  .iqis-context{
    flex: 1 1 100px;
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

.toSupplier .ivu-menu-dark{
    width:150px!important;
}
.toSupplier .iqis-main-menu-first{
    width:150px!important;
    flex: 0 0 150px!important;
}
.toSupplier .iqis-sider{
    width:150px!important;
    flex:0 0 150px!important;
}
.toSupplier .iqis-main-menu-first li:last-child.ivu-menu-item-active{
    background: none !important;
}
.toSupplier .iqis-main-sider-min {
    -webkit-box-flex: 0 !important;
    -ms-flex: 0 0 50px !important;
    flex: 0 0 50px !important;
    width: 50px !important;
    overflow: hidden;
}
.toSupplier .iqis-main-sider-min .ivu-menu-submenu-title{
    display: none;
}
.toSupplier .ivu-menu-submenu{
    /* padding: 1px 2px 1px 15px !important; */
}
.toSupplier .ivu-menu-vertical .ivu-menu-item,.toSupplier  .ivu-menu-vertical .ivu-menu-submenu-title {
  padding:0;
  height: 38px;
  line-height: 38px;
  padding-left:15px;
}
.toSupplier .ivu-menu-vertical .ivu-menu-submenu-title-icon {
    top: 12px;
}
.en_US .tablePadding{
  padding:0!important;
}
</style>
