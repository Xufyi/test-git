<template>
  <div class="login" style="overflow-y:scroll;">
    <div style="padding-top:10px;padding-bottom:10px;" class='loginBody' v-show='isNotIE9' >
      <div class="register-card"  v-if="registerShow" style="margin:0 auto" @keydown.enter="registerVerification">
        <!-- <div style="text-align: center;margin-bottom: 10px;"><img src="../../assets/img/login-page-logo.svg" height="40"/></div> -->
        <div style="text-align: center;margin-bottom: 10px;"><img src="../../assets/img/new-login-page-logo.png" height="60"/></div>
        <div style="height: 598px;background-color: #fff;padding: 30px;">
          <div style="height: 30px;"><span style="font-size: 24px;font-weight: bold;">{{$t('login.Register')}}</span>
            <span class="login-shuts" style="float: right;display: block;padding-top: 14px;font-size: 14px;">{{$t('login.ExistingAccount')}}<a class="blue" href="#" id="register-btn" @click="toLogin">{{$t('login.LoginImmediately')}}</a><span style="padding: 0 12px;color:#E9E9E9">|</span><a href="http://www.wuqc.cn/h-col-144.html" target="_blank">{{$t('login.Agent')}}</a> <span  style="padding: 0 12px;color:#E9E9E9">|</span><a href="http://www.wuqc.cn/" target="_blank">{{$t('login.OfficialWebsite')}}</a></span>
          </div>
          <div class="login-input login-input1" style="margin-top: 24px">
            <i-input v-model="register.account" placeholder="" @on-focus="focus(1)" @on-blur="blur(1)"></i-input>
            <span class="label" :class="register.account==''?'':'focus'">{{$t('login.EnterpriseAccount')}}</span>
            
            <span style="color:#8B8B8B;display:block;margin-top:6px;"><Icon type="ios-information-outline" size="14"></Icon> {{$t('login.EnterpriseAccount')}} {{$t('login.RegisterSuccess')}}</span>
          </div>
          <div class="login-input login-input2" style="margin-top: 6px">
            <i-input v-model="register.companyName" placeholder="" @on-focus="focus(2)" @on-blur="blur(2)"></i-input>
            <span class="label" :class="register.companyName==''?'':'focus'">{{$t('login.FullName')}}</span>                        
            
            <span style="color:#8B8B8B;display:block;margin-top:6px;"><Icon type="ios-information-outline" size="14"></Icon> {{$t('login.FullName')}} {{$t('login.RegisterSuccess')}}</span>
          </div>
          <div class="login-input login-input3" style="margin-top: 6px">
            <i-input v-model="register.phoneNum" placeholder="" @on-focus="focus(3)" @on-blur="blur(3)"></i-input>
            <span class="label" :class="register.phoneNum==''?'':'focus'">{{$t('login.PhoneNumber')}}</span>            
          </div>
          <div class="login-input login-input4 clearfix" style="margin-top: 30px">
            <i-input style="width:240px;float:left;" v-model="register.code" placeholder="" @on-focus="focus(4)" @on-blur="blur(4)"></i-input>
            <span class="label code" :class="register.code==''?'':'focus'">{{$t('login.VerificationCode')}}</span>
            <Button type="primary" @click="sendVerification('register')" :disabled="register.sendDisabled" style="width:120px;float:right;height:40px;font-size:14px;">{{register.sendText}}</Button>
          </div>
          <!-- <div class="send-tip" v-if="register.sendTip" style="height:32px;line-height:32px;padding:0 14px;margin-top:4px;background:rgba(234,244,255,1);border-radius:2px;border:1px solid rgba(65,143,238,0.24);color:#8B8B8B">
            <Icon type="information-circled" size="14" color="#418FEE" style="margin-right:16px;"></Icon>
            验证码已发送，请查收获取验证码
          </div> -->
          <div class="login-input login-input5" style="margin-top: 30px">
            <i-input type="password" v-model="register.password" placeholder="" @on-focus="focus(5)" @on-blur="blur(5)"></i-input>
            <span class="label" :class="register.password==''?'':'focus'">{{$t('login.SetPassword')}}</span>
          </div>
          <div class="login-input login-input6" style="margin-top: 30px">
            <i-input type="password" v-model="register.password2" placeholder="" @on-focus="focus(6)" @on-blur="blur(6)"></i-input>
            <span class="label" :class="register.password==''?'':'focus'">{{$t('login.ConfirmPassword')}}</span>                        
          </div>
          <div class="login-tools" style="font-size:14px">{{$t('login.RegisterAgree')}}<a style="color:##418FEE;font-size:14px" href="static/user-agreement.html" target="_blank">《无忧QC质量云平台用户协议》</a>
          </div>
          <Button type="primary" @click="registerVerification" style="width: 100%;height: 40px;font-size: 14px;margin-top: 10px;">{{$t('login.Register')}}</Button>
        </div>
      </div>
      <!-- 注册成功  -->
      <div class="end-card" v-if="endShow" style="margin:0 auto;text-align:center;" @keydown.enter="endShow=false;loginShow=true;clearRegister()">
        <div style="text-align: center;margin-bottom: 18px;"><img src="../../assets/img/login-page-logo.svg" height="40"/></div>
        
        <div style="background-color: #fff;padding: 40px;">
          <Icon type="checkmark-circled" style="font-size:72px;color:#7DEE41;"></Icon>
          <p style="font-size:24px;color:#000;padding:0;margin:15px 0;">{{$t('login.RegisterSucceeded')}}</p>
          <div style="padding:30px 20px;width:360px;background:rgba(250,250,250,1);border-radius:2px;display:none;">
            您的注册信息我们已经收到，客服人员会尽快为您审核，审核期间请保持手机畅通，审核结果会发送至企业邮箱，请注意查收！
          </div>
          <Button type="primary" style="width:120px;margin-top:20px;" @click="login()">{{$t('login.LoginImmediately')}}</Button>
        </div>
      </div>
    </div>
    <div v-show='isNotIE9'  style="width:100%;height: 50px;line-height: 50px;text-align: center;">Copyright © 2017-2022 {{$t('login.Nineplusone')}}
      <a target="_blank" href="http://www.miibeian.gov.cn/">粤ICP备17106276号</a>
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5';
  import $ from 'jquery';
  export default {
    props: ["error"],
    data() {
      let that = this;
      return {
        // sendSecond:0,
        isNotIE9:true,
        interval:'',
        loginShow:true,
        registerShow:true,
        infoShow:false,
        endShow:false,
        findShow:false,
        resetShow:false,
        admin:false,
        register:{
          "account":'',
          "companyName": '',
          // "createTime": new Date,
          // "departmentId": '',
          // "departmentName": "",
          // "email": "",
          // "jobId": '',
          "code":'',
          "position": '',
          "contact": '',
          "tel": '',
          "password": '',
          "password2": '',
          "phoneNum": '',
          // "remark": "",
          // "userId": ''
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
          loginMethods:that.$LocalStorage.get('loginMethods')=='company'? 'company':'person',
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
      
    },
    methods: {
    toLogin(){
        this.$router.push({path: '/'})
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
          // data.sendTip=true;
          that.$Notice.warning({title:i18n.t('login.sendSuccess')})
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
                data.sendText=x+'s'+i18n.t('login.Resend');
                x--; 
            }
          }, 1000);
        }else{
          that.$Notice.warning({title:resp.data.msg})
          data.sendDisabled=false;
        }
      })
      
      
    },
    registerVerification(){
        let that =this ;

        let params = [
            {type:'Empty',title:i18n.t('login.EnterpriseAccount'),value:that.register.account},
            {type:'Account',title:i18n.t('login.EnterpriseAccount'),value:that.register.account},
            {type:'Empty',title:i18n.t('login.FullName'),value:that.register.companyName},
            {type:'NameCN',title:i18n.t('login.FullName'),value:that.register.companyName},
            {type:'PhoneNum',title:i18n.t('login.PhoneNumber'),value:that.register.phoneNum},
            {type:'Password',title:i18n.t('login.Password'),value:that.register.password},
            {type:'Password',title:i18n.t('login.ConfirmPassword'),value:that.register.password2},
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
        if(that.register.password2!=that.register.password){
            that.$Notice.warning({title:i18n.t('login.differentPassword')})
            return;
        }

        that.$http.post('/verification/sms/verify?phoneNum='+that.register.phoneNum+'&code='+that.register.code).then(function(resp){
          // //console.log(resp,'验证结果')
            if(resp.data.success==true){
              // that.$Message.success(i18n.t('login.verifySuccess'))
            that.register.password=md5(that.register.password)
            that.register.password2=md5(that.register.password2)
            that.register['invitationCode'] = window.location.href.includes('code')?window.location.href.split('code=')[1]:''
            that.$http.post('/tenant/register/free',that.register).then(function(resp){
                that.registerShow=false;
                that.endShow=true;
            })
            }else{
            that.$Notice.warning({title:i18n.t('login.verifyFail')})
            }
        })
    },
    login(){
        let that =this ;    
        that.$http.post("/user/login",{tenant:that.register.account,account:'admin',password:that.register.password}).then(function (resp) {
          that.$SessionStorage.set("token",resp.data);
          if(that.IEVersion() !== -1){
            that.$SessionStorage.set('reload',true)
          }
        //   if(that.form.rememberMe){
        //     that.$LocalStorage.set('tenantId',that.form.tenantId)
        //     that.$LocalStorage.set('password',that.form.password)
        //     that.$LocalStorage.set('rememberMe',true)
        //   }else{
        //     that.$LocalStorage.set('tenantId','');
        //     that.$LocalStorage.set('password','');
        //     that.$LocalStorage.set('rememberMe',false)
        //   }

          that.$router.push({path: '/home'})
        })
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

        if(this.$SessionStorage.get("language-main")=='en_US'){
          $('.label.focus').addClass('hide');
        }
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
    // html{
    //     height:auto;
    // }
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
    height: 662px;
    margin-right: 80px;

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
    height: 14px;
    line-height: 14px;
    margin-top: 30px;
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
  .label.focus.hide{
    display: none;
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
</style>
