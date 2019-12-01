<template>
  <div class="iqis-page">
    <div class="iqis-page-block">

      <div class="iqis-page-block-body company-info" style="margin:0 130px;">
        <Row style="margin-bottom:12px;margin-top:20px;">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('system.company')}}
            </div>
          </i-col>
          <i-col span="24" style="position:relative;">
            <div v-if="editable" style="height:122px;width:122px;border:1px solid #ddd;">
              <Upload action="https://iqis.oss-cn-shenzhen.aliyuncs.com"
                      ref="upload"
                      :data="{'key':ossKey,'policy':policy,'OSSAccessKeyId':OSSAccessKeyId,'success_action_status':success_action_status,'signature':signature,'x-oss-object-acl' : 'public-read'}"
                      type="text"
                      style="display: inline-block;"
                      :format="['jpg','jpeg','png']"
                      :max-size="5120"
                      :on-format-error="handleFormatError"
                      :on-exceeded-size="handleMaxSize"
                      :show-upload-list="false"
                      :before-upload="handleBeforeUpload"
                      :on-success="uploadSuccess">
                <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"placement="right-start" :offset="100"  style="width:120px;height:120px;position:relative;">
                  <img id="iqisLogo1" class="iqis-logo" :src="table.item.logoUrl" style="max-width:120px;max-height:120px;position:relative;top:50%;left:50%;transform:translate(-50%,-50%)">
                  <div class="api" slot="content">
                    <img style="max-width:522px" :src="table.item.logoUrl" alt="">
                  </div>
                </poptip>
              </Upload>
            </div>
            <div v-if="!editable" style="height:122px;width:122px;border:1px solid #ddd;position:relative;">
              <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"placement="right-start" :offset="100" >
                <img id="iqisLogo2" class="iqis-logo" :src="table.item.logoUrl" style="max-width:120px;max-height:120px;position:relative;top:50%;left:50%;transform:translate(-50%,-50%)">
                <div class="api" slot="content">
                  <img style="max-width:522px" :src="table.item.logoUrl" alt="">
                  <div v-if="!table.item.logoUrl">{{$t('system.clickUpload')}}
                  </div>
                </div>
              </poptip>
            </div>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('system.companyAccount')}}</div>
          </i-col>
          <i-col span="24">
            <i-input v-model="table.item.account" disabled></i-input>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('system.companyName')}}</div>
          </i-col>
          <i-col span="24">
            <i-input v-model="table.item.companyName" disabled></i-input>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('system.companyAddress')}}</div>
          </i-col>
          <i-col span="24">
            <i-input v-model="table.item.address"  :disabled="!editable"></i-input>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('system.contactInformation')}}</div>
          </i-col>
          <i-col span="24">
            <i-input v-model="table.item.tel"  disabled></i-input>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('system.bindEmail')}}</div>
          </i-col>
          <i-col span="24">
            <i-input v-model="table.item.email"  :disabled="!editable"></i-input>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('system.bindQQ')}}</div>
          </i-col>
          <i-col span="24">
            <i-input v-model="table.item.qq"  :disabled="!editable"></i-input>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('system.contactWeChat')}}</div>
          </i-col>
          <i-col span="24">
            <i-input v-model="table.item.weChat"  :disabled="!editable"></i-input>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('system.companyProfile')}}</div>
          </i-col>
          <i-col span="24">
            <i-input v-model="table.item.companyIntroduction"  type="textarea" :autosize="{minRows: 3,maxRows: 15}" :disabled="!editable"></i-input>
          </i-col>
        </Row>

        <!-- <row type="flex" align="middle">
          <i-col style="width: 310px;text-align: right">
            <div style="font-weight:bold;margin-top: 5px;" id="logoTitle">公司Logo</div>
            <div style="font-weight:bold;height: 34px;margin-top: 20px">公司账号</div>
            <div style="font-weight:bold;margin-top: 20px;height: 34px">公司名称</div>
            <div style="font-weight:bold;margin-top: 20px;height: 34px">公司地址</div>
            <div style="font-weight:bold;margin-top: 20px;height: 34px">联系方式</div>
            <div style="font-weight:bold;margin-top: 20px;height: 34px">绑定电子邮箱</div>
            <div style="font-weight:bold;margin-top: 20px;height: 34px">联系QQ</div>
            <div style="font-weight:bold;margin-top: 20px;height: 34px">联系微信</div>
            <div style="font-weight:bold;margin-top: 20px;height: 34px">公司简介</div>
          </i-col>
          <i-col>
            <div style="margin-left: 10px" v-if="editable">
              <Upload action="https://iqis.oss-cn-shenzhen.aliyuncs.com"
                      ref="upload"
                      :data="{'key':ossKey,'policy':policy,'OSSAccessKeyId':OSSAccessKeyId,'success_action_status':success_action_status,'signature':signature,'x-oss-object-acl' : 'public-read'}"
                      type="text"
                      style="display: inline-block;"
                      :format="['jpg','jpeg','png']"
                      :max-size="5120"
                      :on-format-error="handleFormatError"
                      :on-exceeded-size="handleMaxSize"
                      :show-upload-list="false"
                      :before-upload="handleBeforeUpload"
                      :on-success="uploadSuccess">
                  <img id="iqisLogo" class="iqis-logo" :src="table.item.logoUrl" style="border: 1px solid #d9d9d9;max-width:120px;max-height:120px;">
              </Upload>
            </div>
            <div style="margin-left: 10px" v-if="!editable">
                <img id="iqisLogo2" class="iqis-logo" :src="table.item.logoUrl" style="border: 1px solid #d9d9d9;max-width:120px;max-height:120px;">
            </div>
            <div style="height: 34px;margin-top: 10px;margin-left: 10px"><i-input style="width:468px;" v-model="table.item.account" disabled></i-input></div>
            <div style="margin-top: 20px;height: 34px;margin-left: 10px"><i-input style="width:468px;" v-model="table.item.companyName" disabled></i-input></div>
            <div style="margin-top: 20px;height: 34px;margin-left: 10px"><i-input style="width:468px;" v-model="table.item.address" :disabled="!editable"></i-input></div>
            <div style="margin-top: 20px;height: 34px;margin-left: 10px"><i-input style="width:468px;" v-model="table.item.tel" disabled></i-input></div>
            <div style="margin-top: 20px;height: 34px;margin-left: 10px"><i-input style="width:468px;" v-model="table.item.email" :disabled="!editable"></i-input></div>
            <div style="margin-top: 20px;height: 34px;margin-left: 10px"><i-input style="width:468px;" v-model="table.item.qq" :disabled="!editable"></i-input></div>
            <div style="margin-top: 20px;height: 34px;margin-left: 10px"><i-input style="width:468px;" v-model="table.item.weChat" :disabled="!editable"></i-input></div>
            <div style="margin-top: 20px;height: 34px;margin-left: 10px"><i-input style="width:468px;" v-model="table.item.companyIntroduction" :disabled="!editable"  type="textarea" :autosize="{minRows: 3,maxRows: 15}"></i-input></div>
          </i-col>
        </row> -->
      </div>
    </div>
    <IqisAffix placement="bottom" :offset="0" v-if="permsBtn.UPDATE_COMPANY">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" v-if="!editable" @click="editable=!editable;getLogoWH(1)">{{$t('system.editInformation')}}</Button>
        <Button type="primary" v-if="editable" @click="tableChange();">{{$t('system.save')}}</Button>
        <Button type="ghost" v-if="editable" @click="editable=!editable;refreshData()">{{$t('system.cancel')}}</Button>
      </div>
    </IqisAffix>
    <div class="page-end" style="padding-bottom: 80px"></div>
  </div>
</template>

<script>
  import Input from "iview/src/components/input";
  import $  from 'jquery';

  export default {
    components: {
      Input
    },
    data: function () {
      let vm = this;
      return {
        table: {
          item: {}
        },
        i18n:window.i18n,
        data: [],
        uploadData:{},
        ossKey:'',
        policy:'',
        OSSAccessKeyId:'',
        success_action_status:'',
        signature:'',
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        switchs:{
          fileEdit:false
        },
        editable:false,
        permsCur:[
          "SELECT_COMPANY",
          "UPDATE_COMPANY",
        ],
        permsBtn:{
          "SELECT_COMPANY":false,
          "UPDATE_COMPANY":false,
        },
        whetherHover:false,
      }
    },//data.end
    created(){
      let that = this;
      let permsAll = this.$store.state.permissions;
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.refreshData();
      setTimeout(function(){
        that.getLogoWH(2)
      },500)
    },
    mounted(){
    },
    methods:{
      refreshData(){
        let that = this;

        this.$http.get("/systemManage/company").then(function (resp) {
          that.table.item = resp.data;
        })
      },
      tableChange(){
        let that = this;
        // let phoneNum = this.table.item.tel;
        // if(!phoneNum||phoneNum.length!=11||isNaN(phoneNum)){
        //   this.$Notice.warning({title:'请输入正确的手机号'})
        // return;
        // }
        let params = [
          {type:'Word40',title:i18n.t('system.companyAddress'),value:that.table.item.address},
          {type:'Email',title:i18n.t('system.bindEmail'),value:that.table.item.email},
          {type:'Word20',title:i18n.t('system.contactQQ'),value:that.table.item.qq},
          {type:'Word20',title:i18n.t('system.contactWeChat'),value:that.table.item.weChat},
          {type:'Word600',title:i18n.t('system.companyProfile'),value:that.table.item.companyIntroduction},
        ]
        let state = true;
        for(let i in params){
          state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
            that.$Notice.warning({title:tips})//,duration: 0
          })
          if(!state){
            return;
            break;
          }
        }
        if(this.table.item.account){
          that.$http.put("/systemManage/company",that.table.item).then(function (resp) {
            that.refreshData();
            that.$Message.success(i18n.t('system.editSuccess'));
            that.editable=!that.editable;
            that.getLogoWH(2)
          });
        }
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: i18n.t('system.fileFormatError'),
          desc: i18n.t('system.fileFormat')+['jpg','jpeg','png']
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: i18n.t('system.fileSizeError'),
          desc: file.name + i18n.t('system.moreMaxFile')+5+i18n.t('system.mb')
        });
      },
      handleBeforeUpload (file) {
        let that = this;
        let url  = that.$http.defaults.baseURL == undefined
        || that.$http.defaults.baseURL == ''
        || that.$http.defaults.baseURL == null? "/file/policy" : that.$http.defaults.baseURL + '/file/policy'
        $.ajax({
          url: url,
          async: false,
          type:'GET',
          headers:{
            'x-access-token':that.$SessionStorage.get('token')
          },
          success: function(res){
            that.imgName=file.name
            that.ossKey=res.data.dir + file.name;
            that.policy=res.data.policy
            that.OSSAccessKeyId=res.data.accessKeyId
            that.success_action_status=201
            that.signature=res.data.signature
          }
        });

        let promise = new Promise((resolve) => {
          this.$nextTick(function () {
            resolve(true);
          });
        });
        return promise; //通过返回一个promis对象解决
      },
      //js解析xml
      parseXML(xmlString){
        var xmlDoc=null;
        if(!window.DOMParser && window.ActiveXObject)
        {
          var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
          for(var i=0;i<xmlDomVersions.length;i++)
          {
            try {
              xmlDoc = new ActiveXObject(xmlDomVersions[i]);
              xmlDoc.async = false;
              xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
              break;
            }
            catch(e) {
            }
          }
        }
        else if(window.DOMParser && document.implementation && document.implementation.createDocument) {
          try {
            var domParser = new  DOMParser();
            xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
          } catch(e) {

          }
        }
        else {
          return null;
        }
        return xmlDoc;

      },
      uploadSuccess(res, file){
        let that = this;
        file.url = that.parseXML(res).getElementsByTagName("Location")[0].firstChild.nodeValue;
        that.table.item.logoUrl=file.url;
        that.getLogoWH(1)
      },
      getLogoWH(type){
        let that = this;
        if(!that.table.item.logoUrl){
          $('.ivu-poptip').css('opacity','0');
        }else{
          $('.ivu-poptip').css('opacity','1');
        }
        var img = new Image()
        img.src=this.table.item.logoUrl
        img.onload=function(){
          // let imgW = img.naturalWidth;
          // let imgH = img.naturalHeight;
          let imgW = img.width;
          let imgH = img.height;
          // console.log(imgW,imgH)
          if(imgW>imgH){
            $('#iqisLogo'+type).width(120)
            $('#iqisLogo'+type).height('auto')
          }else{
            $('#iqisLogo'+type).width('auto')
            $('#iqisLogo'+type).height(120)
          }
        }
      },
      hideHover(){
        if(!this.table.item.logoUrl){
          $('.ivu-poptip-popper').css('opacity','0')
        }else{
          $('.ivu-poptip-popper').css('opacity','1')
        }
      }
    }
  }
</script>

<style>
.company-info .ivu-row{
  margin-bottom:20px;
}
.company-info .iqis-page-block-label{
  /* padding:5px 20px 0 0; */
}
.company-info .ivu-poptip-popper{
  min-width:auto;
}
.company-info .ivu-poptip-body {
  padding: 8px;
}
.company-info .ivu-poptip-rel{
  width:120px;
  height: 120px;
}
</style>
