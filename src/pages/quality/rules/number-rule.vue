<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t("quality.rnrs")}}
      </div>
      <div class="iqis-page-block-body">
        <div style="background:#eee;padding:20px;margin-top:10px;">
          <div style="margin-bottom:6px;"><Icon type="ios-information-outline" size="16"></Icon>{{$t("quality.hca")}}</div>
          <img style="margin:0 auto;display:block;max-width:100%;" src="../../../assets/img/number-rule.png" width="722" alt="">
        </div>
        <Row type="flex" :gutter="25">
          <i-col span="12">
            <div class="iqis-page-block-label">{{$t("quality.sifn")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="!permsBtn.UPDATE_NUMBER_SEQUENCE" v-model="ruleForm.iqcNumber" :placeholder="i18n.t('quality.pes')"></i-input>
            </div>
          </i-col>
          <i-col span="12">
            <div class="iqis-page-block-label">{{$t("quality.sierfn")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="!permsBtn.UPDATE_NUMBER_SEQUENCE" v-model="ruleForm.iqcAbnormalNumber" :placeholder="i18n.t('quality.pes')"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="12">
            <div class="iqis-page-block-label">{{$t("quality.stcifn")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="!permsBtn.UPDATE_NUMBER_SEQUENCE" v-model="ruleForm.pqcNumber" :placeholder="i18n.t('quality.pes')"></i-input>
            </div>
          </i-col>
          <i-col span="12">
            <div class="iqis-page-block-label">{{$t("quality.sperfn")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="!permsBtn.UPDATE_NUMBER_SEQUENCE" v-model="ruleForm.pqcAbnormalNumber" :placeholder="i18n.t('quality.pes')"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="12">
            <div class="iqis-page-block-label">{{$t("quality.stsifn")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="!permsBtn.UPDATE_NUMBER_SEQUENCE" v-model="ruleForm.oqcNumber" :placeholder="i18n.t('quality.pes')"></i-input>
            </div>
          </i-col>
          <i-col span="12">
            <div class="iqis-page-block-label">{{$t("quality.sserfn")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="!permsBtn.UPDATE_NUMBER_SEQUENCE" v-model="ruleForm.oqcAbnormalNumber" :placeholder="i18n.t('quality.pes')"></i-input>
            </div>
          </i-col>
        </Row>

      </div>
    </div>
    <IqisAffix placement="bottom" :offset="0" v-if="permsBtn.UPDATE_NUMBER_SEQUENCE">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
	      <Button type="primary" @click="save">{{$t("quality.save")}}</Button>
      </div>
    </IqisAffix>
    <div class="page-end" style="padding-bottom: 80px;padding-top: 30px;"></div>

  </div>

</template>
<script>
  import ICol from "iview/src/components/grid/col";

  export default {

    components: {ICol},
    data(){
      return {
        i18n:window.i18n,
      	headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        ruleForm:{
          iqcNumber:'',
          iqcAbnormalNumber:'',
          pqcNumber:'',
          pqcAbnormalNumber:'',
          oqcNumber:'',
          oqcAbnormalNumber:'',
        },
        permsCur:[
          "SELECT_NUMBER_SEQUENCE",
          "UPDATE_NUMBER_SEQUENCE",
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "SELECT_NUMBER_SEQUENCE":false,
          "UPDATE_NUMBER_SEQUENCE":false,
        },
        noPermsDis:true,


      }
    },
    created(){
      let that = this;
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      that.$http.get('/basic/numberSequence').then(function(resp){
        if(resp.data){
          that.ruleForm=resp.data;
        }
      })
    },



    methods:{
      save(){
        let that = this;
        let params = [
          {type: 'No25', title: i18n.t("quality.im"), value: that.ruleForm.iqcNumber},
          {type: 'No25', title: i18n.t("quality.ier"), value: that.ruleForm.iqcAbnormalNumber},
          {type: 'No25', title: i18n.t("quality.ctf"), value: that.ruleForm.pqcNumber},
          {type: 'No25', title: i18n.t("quality.per"), value: that.ruleForm.pqcAbnormalNumber},
          {type: 'No25', title: i18n.t("quality.sif"), value: that.ruleForm.oqcNumber},
          {type: 'No25', title: i18n.t("quality.ser"), value: that.ruleForm.oqcAbnormalNumber},
        ]
        let state = true;
        for (let i in params) {
          state = that.$iqis.utils.formValidate(params[i].type, params[i].title, params[i].value, (tips) => {
            that.$Notice.warning({title: tips})
          })
          if (!state) {
            return;
            break;
          }
        }
        that.$http.put('/basic/numberSequence',that.ruleForm,that.headers).then(function(resp){
          that.$Message.success(i18n.t("quality.as"))
        })
      }


    }//end methods


  }
</script>
<style scoped>

</style>
