<template>
  <div class="login" style="overflow-y:scroll;" v-if="isPerfect">
    <div style="padding-top:10px;padding-bottom:10px;" class='loginBody' v-show='isNotIE9' >
      <div class="perfect-card"  v-if="perfectShow" style="margin:0 auto" @keydown.enter="perfectVerification">
        <div style="text-align: center;margin-bottom: 10px;"><img src="../../assets/img/login-page-logo.svg" height="40"/></div>
        <div style="height: 458px;background-color: #fff;padding: 30px;">
          <div style="height: 30px;"><span style="font-size: 24px;font-weight: bold;">完善信息</span>
            <span class="login-shuts" style="float: right;display: block;padding-top: 14px;font-size: 14px;"><a href="http://www.wuqc.cn/h-col-144.html" target="_blank">{{$t('login.Agent')}}</a> <span  style="padding: 0 12px;color:#E9E9E9">|</span><a href="http://www.wuqc.cn/" target="_blank">{{$t('login.OfficialWebsite')}}</a></span>
          </div>
          <div class="login-input login-input1" style="margin-top: 24px">
            <i-input v-model="perfect.account" placeholder="" @on-focus="focus(1)" @on-blur="blur(1)"></i-input>
            <span class="label" :class="perfect.account==''?'':'focus'">{{$t('login.EnterpriseAccount')}}</span>
            
            <span style="color:#8B8B8B;display:block;margin-top:6px;"><Icon type="ios-information-outline" size="14"></Icon> {{$t('login.EnterpriseAccount')}} 提交成功后不可修改</span>
          </div>
          <div class="login-input login-input2" style="margin-top: 6px">
            <i-input v-model="perfect.companyName" placeholder="" @on-focus="focus(2)" @on-blur="blur(2)"></i-input>
            <span class="label" :class="perfect.companyName==''?'':'focus'">{{$t('login.FullName')}}</span>                        
            
            <span style="color:#8B8B8B;display:block;margin-top:6px;"><Icon type="ios-information-outline" size="14"></Icon> {{$t('login.FullName')}} 提交成功后不可修改</span>
          </div>
          <div class="login-input login-input3" style="margin-top: 6px">
            <i-input v-model="perfect.phoneNum" placeholder="" @on-focus="focus(3)" @on-blur="blur(3)"></i-input>
            <span class="label" :class="perfect.phoneNum==''?'':'focus'">{{$t('login.PhoneNumber')}}</span>            
          </div>
          <div class="login-input login-input4 clearfix" style="margin-top: 30px">
            <i-input style="width:240px;float:left;" v-model="perfect.code" placeholder="" @on-focus="focus(4)" @on-blur="blur(4)"></i-input>
            <span class="label code" :class="perfect.code==''?'':'focus'">{{$t('login.VerificationCode')}}</span>
            <Button type="primary" @click="sendVerification('perfect')" :disabled="perfect.sendDisabled" style="width:120px;float:right;height:40px;font-size:14px;">{{perfect.sendText}}</Button>
          </div>
          <div class="login-tools" style="font-size:14px">同意<a style="color:##418FEE;font-size:14px" href="static/user-agreement.html" target="_blank">《无忧QC质量云平台用户协议》</a>
          </div>
          <Button type="primary" @click="perfectVerification" style="width: 100%;height: 40px;font-size: 14px;margin-top: 10px;">提交</Button>        </div>
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
        isPerfect:false,
        isNotIE9:true,
        interval:'',
        loginShow:true,
        perfectShow:true,
        infoShow:false,
        endShow:false,
        findShow:false,
        resetShow:false,
        admin:false,
        perfect:{
          "account":'',
          "companyName": '',
          "code":'',
          "position": '',
          "contact": '',
          "tel": '',
          "password": '',
          "password2": '',
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
      let that = this;
      if(window.location.href.indexOf('temp')!=-1){
        let temp = window.location.href.split('?')[1].split('&')[0].split('=')[1]
        that.$http.defaults.headers["x-access-token"] = temp
        that.$SessionStorage.set("token",temp);
        that.$http.get('/tenant/user/profile').then(function(resp){
          if(!resp.data.companyName){
            that.isPerfect = true
          }else{
            that.isPerfect = false
            if(that.IEVersion() !== -1){
              that.$SessionStorage.set('reload',true)
            }
            that.$router.push({path: '/home'})
            that.$Spin.hide();
          }
        })
        
      }
    },
    methods: {  
    sendVerification(method){
      let that = this;
      let data = {};
      let type= '';
      if(method=='perfect'){
        data = that.perfect;
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
    perfectVerification(){
        let that =this ;

        let params = [
            {type:'Empty',title:i18n.t('login.EnterpriseAccount'),value:that.perfect.account},
            {type:'No',title:i18n.t('login.EnterpriseAccount'),value:that.perfect.account},
            {type:'Empty',title:i18n.t('login.FullName'),value:that.perfect.companyName},
            {type:'NameCN',title:i18n.t('login.FullName'),value:that.perfect.companyName},
            {type:'Empty',title:i18n.t('login.PhoneNumber'),value:that.perfect.phoneNum},
            {type:'PhoneNum',title:i18n.t('login.PhoneNumber'),value:that.perfect.phoneNum},
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
        that.$http.post('/verification/sms/verify?phoneNum='+that.perfect.phoneNum+'&code='+that.perfect.code).then(function(resp){
            if(resp.data.success==true){
            that.perfect.tel = that.perfect.phoneNum
                that.$http.put('/perfect/company',that.perfect).then(function(resp){
                    that.$router.push({path: '/home'})
                })
            }else{
            that.$Notice.warning({title:i18n.t('login.verifyFail')})
            }
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

  .login-card,.perfect-card,.info-card,.end-card,.find-card,.reset-card{
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
