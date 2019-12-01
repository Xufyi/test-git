<template>
  <div class="login" style='' >
    <div style="flex: 1 1 100px;display:-webkit-flex;display: flex;" class='loginBody' v-show='isNotIE9' >
      <div style="flex: 1 1 100px;text-align: center;align-items:center;">
        <img src="../../assets/img/login-bg.png" height="394" width="532"/>
      </div>
      <!-- 登录 -->
      <div class="login-card" v-if="loginShow" style="flex:0 0 440px;" @keydown.enter="handleSubmit">
        <div style="text-align: center;margin-bottom: 18px;"><img src="../../assets/img/new-login-page-logo.png" height="60" width="438"/></div>
        <div style="height: 430px;background-color: #fff;padding: 40px 30px;">
          <div style="height: 30px;"><span style="font-size: 24px;font-weight: bold;">{{$t("login.Login")}}</span>
            <span v-if="serverType==0" class="login-shuts" style="float: right;display: block;padding-top: 14px;font-size: 14px;">
              <!-- <a href="#" id="register-btn" @click="clearRegister();loginShow=false;registerShow=true;">免费注册</a> -->
              <a href="javascript:void(0)" target="_blank" id="register-btn" @click="toRegister">{{$t("login.FreeRegister")}}</a>
              <span style="padding: 0 12px;color:#E9E9E9">|</span>
              <a href="http://www.wuqc.cn/h-col-144.html" target="_blank">{{$t("login.Agent")}}</a> 
              <span  style="padding: 0 12px;color:#E9E9E9">|</span>
              <a href="http://www.wuqc.cn/" target="_blank">{{$t("login.OfficialWebsite")}}</a>
            </span>
            <Select v-if="serverType==1" v-model="languageMain" style="float: right;width:100px;border:0;font-size:12px!important;" placeholder="language" @on-change="changeLanguage">
              <Option value="zh_CN">简体中文</Option>
              <Option value="en_US">English</Option>
            </Select>
          </div>
          <div v-if="serverType==0" class="" style="display:flex;margin-top:15px;font-size:14px!important;">
            <RadioGroup v-model="form.loginMethods" @on-change="clearUserName" style="line-height:32px;flex:1;">
              <Radio label="company">{{$t("login.EnterpriseLogin")}}</Radio>
              <Radio label="person">{{$t("login.EmployeeLogin")}}</Radio>
            </RadioGroup>
            <Select v-model="languageMain" style="width:100px;border:0;font-size:12px!important;" placeholder="language" @on-change="changeLanguage">
              <Option value="zh_CN">简体中文</Option>
              <Option value="en_US">English</Option>
            </Select>
          </div>
          <div v-if="serverType==0" class="login-input login-input1" style="margin-top: 15px">
            <i-input v-model="form.tenantId" @on-focus="focus(1)" @on-blur="blur(1)">
            </i-input>
            <span class="label" :class="form.tenantId==''?'':'focus'">{{$t("login.EnterpriseAccount")}}</span>
          </div>
          <div v-if="form.loginMethods=='person'&&serverType==0" class="login-input login-input2" style="margin-top: 24px">
            <i-input v-model="form.userName" @on-focus="focus(2)" @on-blur="blur(2)">
            </i-input>
            <span class="label" :class="form.userName==''?'':'focus'">{{$t("login.EmployeeAccount")}}</span>
          </div>
          <div v-if="serverType==1" class="login-input login-input2" style="margin-top: 24px">
            <i-input v-model="form.userName" @on-focus="focus(2)" @on-blur="blur(2)">
            </i-input>
            <span class="label" :class="form.userName==''?'':'focus'">账号</span>
          </div>
          <div class="login-input login-input3" style="margin-top: 24px">
            <i-input type="password" v-model="form.password" @on-focus="focus(3)" @on-blur="blur(3)">
            </i-input>
            <span class="label" :class="form.password==''?'':'focus'">{{$t("login.Password")}}</span>                        
          </div>
          <!-- <div class="login-error-tip"></div> -->
          <div class="login-tools"><Checkbox v-model="form.rememberMe">{{$t("login.RememberMe")}}</Checkbox>
            <a type="text" href="javascript:void(0)" style="float: right;color:#495060" @click="clearFind();loginShow=false;findShow=true;">{{$t("login.ForgetPassword")}}</a>
          </div>
          <Button type="primary" @click="handleSubmit" style="width: 100%;height: 40px;font-size: 14px;margin-top: 12px;">{{$t("login.Login")}}</Button>
        </div>
      </div>
      <!-- 找回密码 -->
      <div class="find-card" v-if="findShow"  style="flex:0 0 440px;" @keydown.enter="findVerification">
        <div style="text-align: center;margin-bottom: 18px;"><img src="../../assets/img/new-login-page-logo.png" height="60" width="438"/></div>
        <div style="height: 350px;background-color: #fff;padding: 40px 30px;">
          <div style="height: 30px;"><span style="font-size: 24px;font-weight: bold;">{{$t('login.RetrievePassword')}}</span>
            <span class="login-shuts" style="float: right;display: block;padding-top: 14px;font-size: 14px;"><a class="blue" href="#" id="register-btn" @click="loginShow=true;findShow=false;">{{$t('login.ReturnLogin')}}</a></span>
          </div>
          <div class="login-input login-input12" style="margin-top: 24px">
            <i-input :max-length="11" v-model="find.phoneNum" placeholder="" @on-focus="focus(12)" @on-blur="blur(12)"></i-input>
            <span class="label" :class="find.phoneNum==''?'':'focus'">{{$t('login.PhoneNumber')}}</span>
          </div>
          <div class="login-input login-input13 clearfix" style="margin-top: 30px">
            <i-input style="width:240px;float:left;" v-model="find.code" placeholder="" @on-focus="focus(13)" @on-blur="blur(13)"></i-input>
            <span class="label code" :class="find.code==''?'':'focus'">{{$t('login.VerificationCode')}}</span>                        
            <Button type="primary" @click="sendVerification('find')" :disabled="find.sendDisabled" style="width:120px;float:right;height:40px;font-size:14px;">{{find.sendText}}</Button>
          </div>
          <div class="send-tip" v-if="find.sendTip" style="height:32px;line-height:32px;padding:0 14px;margin-top:4px;background:rgba(234,244,255,1);border-radius:2px;border:1px solid rgba(65,143,238,0.24);color:#8B8B8B">
            <Icon type="information-circled" size="14" color="#418FEE" style="margin-right:16px;"></Icon>
            {{$t('login.sendSuccess')}}
          </div>
          <Button type="primary" @click="findVerification" style="width: 100%;height: 40px;font-size: 14px;margin-top: 12px;">{{$t('login.Next')}}</Button>
        </div>
      </div>
      <!-- 重置密码 -->
      <div class="reset-card" v-if="resetShow"  style="flex:0 0 440px;" @keydown.enter="submitFind">
        <div style="text-align: center;margin-bottom: 18px;"><img src="../../assets/img/login-page-logo.png" height="49" width="438"/></div>
        <div style="height: 350px;background-color: #fff;padding: 40px 30px;">
          <div style="height: 30px;"><span style="font-size: 24px;font-weight: bold;">{{$t('login.ResetPassword')}}</span>
            <!-- <span class="login-shuts" style="float: right;display: block;padding-top: 14px;font-size: 14px;"><a class="blue" href="#" id="register-btn" @click="loginShow=true;findShow=false;">返回登录</a></span> -->
          </div>
          <div class="login-input login-input14" style="margin-top: 24px">
            <i-input type="password" v-model="find.newPassword" placeholder="" @on-focus="focus(14)" @on-blur="blur(14)"></i-input>
            <span class="label" :class="find.newPassword==''?'':'focus'">{{$t('login.NewPassword')}}</span>
          </div>
          <div class="login-input login-input15" style="margin-top: 24px">
            <i-input type="password" v-model="find.judegNewPassword" placeholder="" @on-focus="focus(15)" @on-blur="blur(15)"></i-input>
            <span class="label" :class="find.judegNewPassword==''?'':'focus'">{{$t('login.ConfirmPassword')}}</span>
          </div>
          <Button type="primary" @click="submitFind" style="width: 100%;height: 40px;font-size: 14px;margin-top: 52px;">{{$t('login.ResetPassword')}}</Button>
        </div>
      </div>
    </div>
    <div v-show='isNotIE9'  style="flex: 0 0 50px;height: 50px;line-height: 50px;text-align: center;">Copyright © 2017-2022 深圳市矢分科技有限公司
      <a target="_blank" href="http://www.miibeian.gov.cn/">粤ICP备17106276号</a>
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5';
  import $ from 'jquery';
  import SessionStorage from '@/utils/sessionStorage'
  export default {
    props: ["error"],
    data() {
      let that = this;
      return {
        // sendSecond:0,
        serverType:0,
        languageMain:'zh_CN',
        isNotIE9:true,
        interval:'',
        loginShow:true,
        registerShow:false,
        infoShow:false,
        endShow:false,
        findShow:false,
        resetShow:false,
        admin:false,
        register:{
          "account":'',
          "companyName": '',
          "code":'',
          "position": '',
          "contact": '',
          "tel": '',
          "password": '',
          "phoneNum": '',
          sendText:i18n.t('login.send'),
          sendDisabled:false,
          sendTip:false,
        },
        find:{
          newPassword:'',
          judegNewPassword:'',
          "phoneNum": '',
          "code":'',     
          sendText:i18n.t('login.send'),
          sendDisabled:false,  
          sendTip:false,             
        },
        loading:false,
        errorCode:this.$props.error,
        errors:{
          "014011":{
            code:"014011",
            message:"请重新登录"
          }
        },
        form: {
          tenantId: that.$LocalStorage.get('tenantId')?that.$LocalStorage.get('tenantId'):'',
          userName: that.$LocalStorage.get('userName')?that.$LocalStorage.get('userName'):'',
          password: that.$LocalStorage.get('password')?that.$LocalStorage.get('password'):'',
          rememberMe: that.$LocalStorage.get('rememberMe')=='true'? true:false,
          loginMethods:that.$LocalStorage.get('loginMethods')=='person'? 'person':'company',
        },
        rules: {
          userName: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      };
    },
    created(){
      let locale = this.$SessionStorage.get("language-main");
      this.languageMain = locale||'zh_CN'
      // //console.log(this.$SessionStorage.get("token"),'token')
      let ie = this.IEVersion();
      if(ie < 10 && ie != -1){
        this.isNotIE9 = false;
      }else{

      }
      let query=window.location.search
      if(query.indexOf('from=1')!=-1){
        // alert('from=1')
        this.form.tenantId='WUQC'
        this.form.userName='QC'
        this.form.password='123456'
        this.form.loginMethods='person'
      }
      // if(query.indexOf('register')!=-1){
      //   // alert('register')
      //   this.loginShow=false;
      //   this.registerShow=true;
      // }
      if(window.location.href.indexOf('serverType=1')!=-1){//独占式标志
        this.serverType = 1
      }
      this.$http.defaults.headers["language-main"]=locale||'zh_CN';
    },
    methods: {
      changeLanguage(){
        let that = this;
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
      clearRegister(){
        this.register.account='';
        this.register.companyName= '';
        this.register.code='';
        this.register.position= '';
        this.register.contact= '';
        this.register.tel= '';
        this.register.password= '';
        this.register.phoneNum= '';
        this.register.sendTip=false;  
        this.register.sendDisabled=false;
        this.register.sendText=i18n.t('login.send'); 
        clearInterval(this.interval);
      },
      clearFind(){
        this.find.code='';
        this.find.sendTip=false;
        this.find.phoneNum='';
        this.find.newPassword='';
        this.find.judegNewPassword='';
        this.find.sendDisabled=false;
        this.find.sendText=i18n.t('login.send'); 
        clearInterval(this.interval);    
      },
      handleSubmit() {
        let that = this;
        let userName  = '';
        if(that.serverType==1){//独占式时企业账号置空
          that.form.tenantId=null
        }
        if(that.form.loginMethods=='company'&&that.serverType==0){//不是独占式且企业登录且时员工账号取admin
          userName='admin';
        }
        else{
          userName=that.form.userName;
        }
        if(!that.form.tenantId&&that.serverType==0){//不是独占式时企业账号不能为空
          that.$Notice.warning({title:i18n.t('login.tenantIdNull')})
          return;
        }
        if((that.form.loginMethods=='person'||that.serverType==1)&&!that.form.userName){//员工登录或独占式时员工账号不能为空
          that.$Notice.warning({title:i18n.t('login.userNameNull')})
          return;
        }
        if(!that.form.password){
          that.$Notice.warning({title:i18n.t('login.passwordNull')})
          return;
        }
        this.$http.post("/user/login",{tenant:this.form.tenantId,account:userName,password:md5(this.form.password)}).then(function (resp) {
          that.$SessionStorage.set("token",resp.data);
          
          if(that.IEVersion() !== -1){
            that.$SessionStorage.set('reload',true)
          }
          if(that.form.rememberMe){
            that.$LocalStorage.set('tenantId',that.form.tenantId)
            if(that.form.loginMethods=='person'){
              that.$LocalStorage.set('userName',userName)
            }else{
              that.$LocalStorage.set('userName','')
            }
            that.$LocalStorage.set('password',that.form.password)
            that.$LocalStorage.set('loginMethods',that.form.loginMethods)
            that.$LocalStorage.set('rememberMe',true)
          }else{
            that.$LocalStorage.set('tenantId','');
            that.$LocalStorage.set('userName','');
            that.$LocalStorage.set('password','');
            that.$LocalStorage.set('loginMethods','company');
            that.$LocalStorage.set('rememberMe',false)
          }

          that.$router.push({path: '/home'})
        }).catch(function (error) {
          //console.log(error);
          that.loading = false;
        });
      },
      
      registerVerification(){
        let that =this ;

        let params = [
          {type:'PhoneNum',title:i18n.t('login.PhoneNumber'),value:that.register.phoneNum},
          {type:'Empty',title:i18n.t('login.VerificationCode'),value:that.register.code},
          {type:'Password',title:i18n.t('login.Password'),value:that.register.password},
        ]
        let state=true;
        for(let i in params){
          state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
            that.$Notice.warning({title:tips})
          })
          if(!state){
            return;
            break;
          }
        }
        that.$http.post('/verification/sms/verify?phoneNum='+that.register.phoneNum+'&code='+that.register.code).then(function(resp){
          // //console.log(resp,'验证结果')
          if(resp.data.success==true){
            that.$Message.success(i18n.t('login.verifySuccess'))
            that.infoShow=true;
            that.registerShow=false;  
          }else{
            that.$Notice.warning({title:i18n.t('login.verifyFail')})
          }
          
        })
      },
      findVerification(){
        let that =this;
        let phoneNum =/^1\d{10}$/
        if(!phoneNum.test(that.find.phoneNum)){
          this.$Notice.warning({title:i18n.t('login.phoneError')})
        return;
        }
        if(!that.find.code){
          that.$Notice.warning({title:i18n.t('login.verifyNull')})
          return;
        }
        that.$http.post('/verification/sms/verify?phoneNum='+that.find.phoneNum+'&code='+that.find.code).then(function(resp){
          if(resp.data.success==true){
            that.$Message.success(i18n.t('login.verifySuccess'))         
            that.resetShow=true;
            that.findShow=false; 
          }else{
            that.$Notice.warning({title:i18n.t('login.verifyFail')})
          }
          
        })
      },
      sendVerification(method){
        let that = this;
        let data = {};
        let type= '';
        if(method=='register'){
          data = that.register;
          type = 0;
        }else if(method == 'find'){
          data = that.find;
          type = 1;
        }
        let phoneNum =/^1\d{10}$/
        if(!phoneNum.test(data.phoneNum)){
          this.$Notice.warning({title:i18n.t('login.phoneError')})
        return;
        }
        data.sendDisabled=true;
        that.$http.post('/verification/sms/send/code?phoneNum='+data.phoneNum+'&type='+type).then(function(resp){
          if(resp.data.success==true){
            data.sendTip=true;
            var x = 90;
            that.interval=setInterval(() => {
                if (x == 0) { 
                  data.sendDisabled=false;  
                  data.sendText=i18n.t('login.send'); 
                  x = 90;
                  clearInterval(that.interval);
                  return;
              } else { 
                  data.sendDisabled=true;
                  data.sendText=x+'s'+i18n.t('login.resend');
                  x--; 
              }
            }, 1000);
          }else{
            that.$Notice.warning({title:resp.data.msg})
            data.sendDisabled=false;
          }
        })
        
        
      },
      submitRegister(){
        let that = this;
        let params = [
          {type:'Empty',title:i18n.t('login.EnterpriseAccount'),value:that.register.account},
          {type:'No',title:i18n.t('login.EnterpriseAccount'),value:that.register.account},
          {type:'Empty',title:i18n.t('login.FullName'),value:that.register.companyName},
          {type:'NameCN',title:i18n.t('login.FullName'),value:that.register.companyName},
        ]
        let state=true;
        for(let i in params){
          state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
            that.$Notice.warning({title:tips})
          })
          if(!state){
            return;
            break;
          }
        }  
        that.register.password=md5(that.register.password)
        that.$http.post('/tenant/register/free',that.register).then(function(resp){
          that.$Message.success(i18n.t('login.registerSuccess'))
          that.infoShow=false;
          that.endShow=true;
        })
      },
      submitFind(){
        let that =this;
        // if(!that.find.newPassword){
        //   that.$Notice.warning({title:'新密码不能为空'})
        //   return;
        // }
        // if(!that.find.judegNewPassword){
        //   that.$Notice.warning({title:'确认密码不能为空'})
        //   return;
        // }
        let params = [
          {type:'Empty',title:i18n.t('login.newPassword'),value:that.find.newPassword},
          {type:'Password',title:i18n.t('login.newPassword'),value:that.find.newPassword},
          {type:'Empty',title:i18n.t('login.ConfirmPassword'),value:that.find.judegNewPassword},
        ]
        let state = true;      
        for(let i in params){
          state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
            that.$Notice.warning({title:tips})
          })
          if(!state){
            return;
            break;
          }
        }
        if(that.find.judegNewPassword!=that.find.newPassword){
          that.$Notice.warning({title:i18n.t('login.differentPassword')})
          return;
        }
        that.find.newPassword=md5(that.find.newPassword)
        that.find.judegNewPassword=md5(that.find.judegNewPassword)
        that.$http.put('/tenant/user/originalPassword',that.find).then(function(resp){
          that.$Message.success(i18n.t('login.resetSuccess'))
          that.resetShow=false;
          that.loginShow=true;
        })
      },
      clearUserName(){
        let that = this;
        if(that.form.loginMethods=='person'){
          that.form.userName==''
        }
        // if(that.$LocalStorage.get('loginMethods')=='company'){
        //   if(that.form.loginMethods=='company'){
        //     that.form.password==that.$LocalStorage.get('password')
        //   }else{
        //     that.form.userName==''
        //     that.form.password==''
        //   }
        // }else{
        //   if(that.form.loginMethods=='company'){
        //     that.form.password==''
        //   }else{
        //     that.form.userName==that.$LocalStorage.get('userName')
        //     that.form.password==that.$LocalStorage.get('password')
        //   }
        // }
      },
      IEVersion() {
          let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
          let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
          let isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
          let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
          if(isIE) {
              let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
              reIE.test(userAgent);
              let fIEVersion = parseFloat(RegExp["$1"]);
              if(fIEVersion == 7) {
                  return 7;
              } else if(fIEVersion == 8) {
                  return 8;
              } else if(fIEVersion == 9) {
                  return 9;
              } else if(fIEVersion == 10) {
                  return 10;
              } else {
                  return 6;//IE版本<=7
              }   
          } else if(isEdge) {
              return 'edge';//edge
          } else if(isIE11) {
              return 11; //IE11  
          }else{
              return -1;//不是ie浏览器
          }
      },
      focus(which){
        $('.login-input'+which).find('.label').addClass('focus');
      },
      blur(which){
        if($('.login-input'+which+' .ivu-input').val().length>0){
          $('.login-input'+which).find('.label').addClass('focus');
        }else{
          $('.login-input'+which).find('.label').removeClass('focus');
        }
      },
    },
    mounted(){
    }
  };
</script>


<style lang="less">

  .login {
    width: 100%;
    height: 100%;
    background-color: #F0F2F5;
    text-align: left;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    position:relative;
  }

  .login-con {
    width: 300px;
    margin-left: 800px;
  }

  .login-card,.register-card,.info-card,.end-card,.find-card,.reset-card{
    width: 440px;
    height: 480px;
    margin-right: 80px;

  }
  .login-card{
    height: 502px!important;
  }
  .end-card{
    height: 342px;
  }
  .find-card,.reset-card{
    height: 422px;
  }
  .login-shuts a,
  .login-shuts a:active,
  .login-shuts a:visited{
    color: #5c5c5c;
  }

  .login-input input{
    font-size: 14px !important;
    height: 40px!important;
  }

  .login-error-tip{
    color: red;
    font-size: 14px;
    height: 20px;
    padding: 2px;
  }

  .login-tools{
    height: 32px;
    line-height: 32px;
    margin-top: 14px;
  }
  .blue{
    color:#418FEE!important
  }
  .clearfix:after{
    clear: both;
    display: block;
    visibility: hidden;
    height:0;
    content:'';
  }
  .adminBox .ivu-checkbox-wrapper{
    position: absolute;
    top:50%;
    // right:5px;
    right:0;
    margin-right:0;
    transform: translate(0,-50%)
  }
  .login-input{
    position:relative;
  }
  .login-input .label{
    position:absolute;
    left: 7px;
    top: 0px;
    z-index: 2;
    font-size:14px;
    // transition:all 1s;
    line-height:40px;
    color:#959595;
  }
  .login-input .label.focus{
    left:auto;
    right:7px;
  }
  .login-input .label.blur{
    right:auto;
    left: 7px;
  }
  .login-input .label.focus.user{
    right:117px;
  }
  .login-input .label.focus.code{
    right:147px;
  }
  .login .ivu-input{
    // border-right-color:transparent;
    position: relative;
    z-index: 3;
    background: transparent;
  }
  .ivu-input-group-append{
    background:#fff;    
  }
  .login .ivu-input-wrapper{
    height: 40px;
  }
.loginBody{
  align-items:center;
}
.changeHeight{
  height:388px!important;
}

.login .ivu-select-single .ivu-select-selection{
  border:0;
}
.login .ivu-select-selected-value{
  font-size:12px!important;
}
</style>
