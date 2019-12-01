<template>
  <!-- <router-view></router-view> -->
  <div class="iqis-page">
    <div class="iqis-page-context">
      <div class="iqis-bus-context">
        <Row type="flex" :gutter="25" style="margin:25px 0 40px 0;">
          <i-col span="4">
            <Button type="primary" icon="arrow-left-c">{{$t('message.pd')}}</Button>
          </i-col>
          <i-col span="16" align="center">
            <div style="width:64px;height:64px;line-height:64px;border-radius:50%;background:#69B0FF;text-align:center;"><Icon style="line-height:inherit;color:#E6F7FF;font-size:36px;" type="person"></Icon></div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25" class="row-box">
          <i-col span="18" offset="3" class="form-row">
            <div class="form-label">{{$t("message.act")}}</div>
            <div class="form-input">
              <i-input disabled  :placeholder="i18n.t('message.pe')" v-model="data.account" :value="demo" style="width: 100%;">
              </i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25" class="row-box">
          <i-col span="18" offset="3" class="form-row">
            <div class="form-label">{{$t("message.un")}}</div>
            <div class="form-input">
              <i-input disabled  :placeholder="i18n.t('message.pe')" v-model="data.name" :value="demo" style="width: 100%;">
              </i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25" class="row-box">
          <i-col span="18" offset="3" class="form-row">
            <div class="form-label">{{$t("message.sr")}}</div>
            <div class="form-input">
              <i-input disabled  :placeholder="i18n.t('message.pe')" v-model="data.jobName" :value="demo" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25" class="row-box">
          <i-col span="18" offset="3" class="form-row">
            <div class="form-label">{{$t("message.dt")}}</div>
            <div class="form-input">
              <i-input disabled  :placeholder="i18n.t('message.pe')" v-model="data.departmentName" :value="demo" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25" class="row-box">
          <i-col span="18" offset="3" class="form-row">
            <div class="form-label">{{$t("message.bc")}}</div>
            <div class="form-input">
              <i-input :disabled="changeP" @on-blur="changePhone();changeP=true;" :placeholder="i18n.t('message.pe')" v-model="data.phoneNum" :value="demo" style="width: 100%;">
                <a @click="changeP=false;" href="javascript:void(0)" slot="append" style="margin-right:10px;">{{$t("message.mo")}}</a>
                <a @click="data.phoneNum=''" href="javascript:void(0)" slot="append">{{$t("message.ue")}}</a>
              </i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25" class="row-box">
          <i-col span="18" offset="3" class="form-row">
            <div class="form-label">{{$t("message.be")}}</div>
            <div class="form-input">
              <i-input :disabled="changeE" @on-blur="changeEmail();changeE=true;" :placeholder="i18n.t('message.pe')" v-model="data.email" :value="demo" style="width: 100%;">
                <a @click="changeE=false;" href="javascript:void(0)" slot="append" style="margin-right:10px;">{{$t("message.mo")}}</a>
                <a @click="data.email=''" href="javascript:void(0)" slot="append">{{$t("message.ue")}}</a>
              </i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div> 

  </div>
</template>

<script>

export default {
  data:function() {
    let vm = this;
    return {
      i18n:window.i18n,
      demo:'',
      changeP:true,
      changeE:true,
      data:{

      }
    }
  },
  created(){
    this.getData();
  },
  methods:{
    getData(){
      let that = this;
      that.$http.get("/tenant/user/profile").then(function(resp){
        that.data=resp.data;
      })
    },
    changePhone(){
      let that = this;
      let data = {
        userId:that.data.userId,
        mobile:that.data.phoneNum,
        email:that.data.email,
      }
      that.$http.put("/tenant/user/userInfo",data).then(function(resp){
        //console.log('success')
      })
    },
    changeEmail(){
      let that = this;
      let data = {
        userId:that.data.userId,
        mobile:that.data.phoneNum,
        email:that.data.email,
      }
      that.$http.put("/tenant/user/userInfo",data).then(function(resp){
        //console.log('success')
      })
    }
  }
}
</script>

<style>
  .row-box{margin-bottom:20px;}
  .form-row{display:-webkit-flex;display: flex;}
  .form-label{width:7em;padding-right: 1em;text-align:right;line-height: 32px;}
  .form-input{flex:1;}
  .ivu-input-group-append{background:transparent;}
</style>

