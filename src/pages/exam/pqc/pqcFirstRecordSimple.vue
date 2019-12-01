<template>
  <div>  
    <div class="iqis-page" >
      <div class="iqis-page-block">
        <div class="iqis-page-block-title">
          {{$t('pqc.bi')}}
        </div>
        <div class="iqis-page-block-body">
          <Row type="flex" :gutter="25">
            <!-- 产品编号 -->
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.pn")}}</div>
              <div class="iqis-page-block-ctrl">
                  <Select :label="first.no" remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pqc.pleaseSelect')" :disabled="firstDis||noPermsDis" v-model="first.productId" filterable @on-change="getProductData(first.productId)">
                    <Option v-for="data in productList" :key="data.productId" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
                  </Select>
              </div>
            </i-col>
            <!-- 产品名称 -->
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.name")}}</div>
              <div class="iqis-page-block-ctrl">
                  <i-input  :placeholder="i18n.t('pqc.pe')" disabled v-model="first.productName" style="width: 100%;"></i-input>
              </div>
            </i-col>
            <!-- 规格型号 -->
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.specifications')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input  :placeholder="i18n.t('pqc.pe')" disabled v-model="first.spec" style="width: 100%;"></i-input>
              </div>
            </i-col>
            <!-- 产品类别 -->
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.pc')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input disabled v-model="first.prodTypeName" :placeholder="i18n.t('pqc.pe')" style="width: 100%;"></i-input>
              </div>
            </i-col>
          </Row>
          <Row type="flex" :gutter="25">
            <!-- 产品批号 -->
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.ln')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input  :disabled="firstDis||noPermsDis" :placeholder="i18n.t('pqc.pe')" :maxlength=9 v-model="first.prodBatchNo" style="width: 100%;"></i-input>
              </div>
            </i-col>
            <!-- 批量数 -->
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.bn")}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input :disabled="firstDis||noPermsDis" v-model="first.batchQuantity" :placeholder="i18n.t('pqc.pe')" :maxlength=9 style="width: 100%;"></i-input>
              </div>
            </i-col>
            <!-- 生产线别 -->
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.pl')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" :disabled="firstDis||noPermsDis" v-model="first.prodLineId" filterable>
                  <Option v-for="(data,index) in prodLineList" :key="index" :value="data.prodLineId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <!-- 生产工序 -->
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.pp')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pqc.pleaseSelect')" :disabled="firstDis||noPermsDis" v-model="first.prodProcessId" filterable>
                  <Option v-for="(data,index) in prodProcessList" :value="data.prodProcessId" :key="index">{{ data.prodProcessName }}</Option>
                </Select>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <!-- 判定结果 -->
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.drt")}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pqc.pleaseSelect')" :disabled="firstDis||noPermsDis" v-model="first.result" filterable>
                  <Option v-for="(data,index) in results" :key="index" :value="data.value">{{data.label}}</Option>
                </Select>
              </div>
            </i-col>
            <!-- 检验员 -->
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.inspector")}}</div>
              <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pqc.pleaseSelect')" :disabled="firstDis||noPermsDis" v-model="first.inspectorId" filterable>
                      <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                  </Select>
              </div>
            </i-col>
            <!-- 时间 -->
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.time')}}</div>
              <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable="false" :disabled="firstDis||noPermsDis" v-model="first.createTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>

        </div>
      </div>
      <div class="iqis-page-block">
        <!-- 图片上传 -->
        <div class="iqis-page-block-title">
          {{$t('pqc.pu')}}
        </div>
        <div class="iqis-page-block-body">
          <Spin size="large" v-if="spinShow" style="text-align:left">
              <IqisUpload style="margin-top:10px;" ref="upload" :edit="!firstDis&&!noPermsDis" :fullScreen="true" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png']" :fileCount="20" :value='first.pqcFirstRecordExtInfoDtos' :chartTypeShow="true">
              </IqisUpload>
          </Spin>
        </div>
      </div>
      <!-- 图片预览 -->
      <div class="iqis-page-block">
        <div class="iqis-page-block-title">
          {{$t("pqc.ppv")}}
        </div>
        <div class="iqis-page-block-body">
          <div id="watchPic">
          </div>
        </div>
      </div>

      <!--end blocks-->
      <div class="page-end" style="padding-bottom: 65px"></div>
      <!-- 未提交、申请审核驳回 -->
      <IqisAffix placement="bottom" :offset="0">
        <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
          <Button type="primary" @click="savefirst('submit')" v-if="!noPermsDis&&!firstDis">{{$t("pqc.submit")}}</Button>
          <Button type="primary" @click="savefirst('save')" v-if="!noPermsDis&&!firstDis">{{$t("pqc.save")}}</Button>
          <Button type="ghost" @click="closePage">{{$t("pqc.cancel")}}</Button>
        </div>
      </IqisAffix>
      
      <!-- <Spin size="large" fix v-if="loadStat.complaintDataLoading || loadStat.selectsDataLoading"></Spin> -->
    </div>
  </div>

</template>

<script>
import ICol from "iview/src/components/grid/col";
import $ from 'jquery';
import Affix from "iview/src/components/affix/affix";
import Cascader from "iview/src/components/cascader/cascader";

export default {
  props:["params","tabKey","id"],
  data(){
    let vm = this;
    return{
      i18n:window.i18n,
      btnState: "post",
      firstRecordId:'',
      currentUserId:'',
      spinShow:false,
      headers: {"headers": {"Content-Type": "application/json; charset=UTF-8"}},
      results:[
         {value:1,label:i18n.t("pqc.qualified")},
         {value:0,label:i18n.t('pqc.unqualified')},
      ],
      userId:'',
      customerList:[],
      userList:[],
      productList:[],
      prodLineList:[],
      processIdList:[],
      prodProcessList:[],

      first:{
        firstRecordId:'',
        createTime:new Date(),
        productId:'',
        no:'',
        productName:'',
        spec:'',
        prodTypeName:'',
        prodBatchNo:'',
        batchQuantity:'',
        prodLineId:'',
        prodProcessId:'',
        result:'',
        state:'',
        inspectorId:'',
        extInfoNum:'',
        pqcFirstRecordExtInfoDtos:[],
        type:0
      },
      permsCur:[
        "UPDATE_FIRST_RECORD",
        "INSERT_FIRST_RECORD"
      ],
      permsBtn:{
        "UPDATE_FIRST_RECORD":false,
        "INSERT_FIRST_RECORD":false,
      },
      noPermsDis:false,
      firstDis:false,
      userId:'',
      loadingRemote:false,
      source:null,
    }
  },
  created(){
    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.refreshData();
  },
  methods:{
    remoteMethod: _.debounce(function(query) {
      let that = this;
      that.loadingRemote = true;

      if (query !== '') {
        that.cancelQuest();
        that.$nextTick(()=>{

          that.$http.get('/basic/product/simple?page=1&limit=999999&examType=2&useState=1&fieldName=no,name&query='+query,{
            cancelToken: new this.$http.CancelToken(function executor(c) {
            that.source = c;
            })
          }).then(res =>{
            that.productList = res.data
            that.loadingRemote = false;
          })

        })
      } else {
        that.productList = [];
        that.loadingRemote = false;
      }
    },500),
    cancelQuest(){
      if(typeof this.source ==='function'){
        this.source(i18n.t('pqc.TerminationRequest')); 
      }
    },
    refreshData(){
      let that = this;
      // this.$emit("change",that.first)
      let pqcId = that.$props.id;
      that.$http.all([
        that.$http.get("/tenant/user",{params:{limit:999999999}}),
        // that.$http.get("/basic/product",{params:{limit:999999999,examType:2, useState:1, page:1}}),
        that.$http.get('/tenant/user/profile'),
        that.$http.get('/basic/prodline',{params:{limit:99999999}}),
        that.$http.get('/basic/reviewprocess',{params:{limit:99999999}}),
        that.$http.get('/basic/prod-process',{params:{limit:99999999}}),
        that.$http.get("/tenant/user/profile"),
      ]).then(function(resps){

        that.userList = resps[0].data;//检验员
        // that.productList = resps[1].data;
        that.userId=resps[1].data.userId;
        that.prodLineList=resps[2].data;//生产线别
        that.processIdList = resps[3].data;
        that.prodProcessList = resps[4].data;//生产工序
        that.userId = resps[5].data.userId;
        
        if(((!pqcId&&that.permsBtn.INSERT_FIRST_RECORD)||(pqcId&&that.permsBtn.UPDATE_FIRST_RECORD))){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
        if(pqcId){//修改
          that.firstRecordId=pqcId;
          that.btnState = "put";
          that.first.firstRecordId=pqcId;
          that.getData();
        }else{//添加
          that.first.createTime=new Date();
          that.spinShow=true;
          that.$http.get('/tenant/user/profile').then((resp)=>{
            that.currentUserId=resp.data.userId;
            that.first.inspectorId=that.currentUserId;
            for(let i in that.prodProcessList){
              if(that.prodProcessList[i].prodProcessName==i18n.t('pqc.finalInspection')){
                that.first.prodProcessId=that.prodProcessList[i].prodProcessId;
              } 
            }
          })
        }
      })
    },
    getData(){
      let that = this;
      that.$http.get('/examinecenter/pqc/firstrecord/'+that.firstRecordId).then(function(resp){
        resp.data.firstRecordDto.createTime=resp.data.firstRecordDto.createTime?new Date(resp.data.firstRecordDto.createTime):null;
        that.first=resp.data.firstRecordDto;
        // that.first.no=resp.data.firstRecordDto.no;
        // alert(that.first.no);
        // that.first.productName=resp.data.firstRecordDto.productName;
        // that.first.spec=resp.data.firstRecordDto.spec;
        // that.first.prodTypeName=resp.data.firstRecordDto.prodTypeName;
        // that.first.prodBatchNo=resp.data.firstRecordDto.prodBatchNo;
        // that.first.batchQuantity=resp.data.firstRecordDto.batchQuantity;
        // that.first.prodLineId=resp.data.firstRecordDto.prodLineId;
        // that.first.prodProcessId=resp.data.firstRecordDto.prodProcessId;
        // that.first.result=resp.data.firstRecordDto.result;
        // that.first.inspectorId=resp.data.firstRecordDto.inspectorId;
        // that.first.createTime=resp.data.firstRecordDto.createTime;
        for(let i in that.first.pqcFirstRecordExtInfoDtos){
          that.first.pqcFirstRecordExtInfoDtos[i].name=that.first.pqcFirstRecordExtInfoDtos[i].firstrecordExtInfoName;
          that.first.pqcFirstRecordExtInfoDtos[i].type=that.first.pqcFirstRecordExtInfoDtos[i].firstrecordExtInfoType;
        }
        that.spinShow=true;
        // if(that.first.state==1||that.first.state==2||that.userId!=that.first.inspectorId){
        //   that.firstDis=true;
        // }else{
        //   that.firstDis=false;
        // }
      })
    },
    getProductData(productId){//获取产品相关
      let that = this;
      that.$http.get('/basic/product/detail/'+productId).then(function(resp){
        that.first.no=resp.data.no;
        that.first.productName=resp.data.name;
        that.first.spec=resp.data.spec;
        that.first.prodTypeName=resp.data.prodTypeName;
      })
    },
    savefirst(requestMethod){//试产申请保存和提交
      let that=this;
      let state = true;
      let params = [
        {type:'Empty',title:i18n.t('pqc.pn'),value:that.first.productId},//产品编号
        // {type:'No',title:i18n.t("pqc.ln"),value:that.first.prodBatchNo},//產品批號
        {type:'Empty',title:i18n.t('pqc.bn'),value:that.first.batchQuantity},//批量数
        {type:'NumNot0',title:i18n.t("pqc.il"),value:that.first.batchQuantity},
        {type:'Empty',title:i18n.t("pqc.pl"),value:that.first.prodLineId},//生產綫別
        {type:'Empty',title:i18n.t('pqc.drt'),value:that.first.result},//判定结果
        {type:'Empty',title:i18n.t('pqc.inspector'),value:that.first.inspectorId},//检验员
        {type:'Empty',title:i18n.t('pqc.time'),value:that.first.createTime},//时间
      ]
      for(let i in params){
        state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
          that.$Notice.warning({title:tips})
        })
        if(!state){
          return;
          break;
        }
      }
      let file = this.$refs.upload.myUploadList
      ////console.log(file,'文件返回数据-------------')
      if(file&&file.length>0){
        let arr = []
        for(var i = 0;i<file.length;i++){
          let item = {
            'url':file[i].url,
            'firstrecordExtInfoName':file[i].name,
            'firstrecordExtInfoType':file[i].url.substring(file[i].url.lastIndexOf(".")+1,file[i].url.length),
          }
          arr.push(item)
        }
        that.first.pqcFirstRecordExtInfoDtos=arr;
        that.spinShow=false;
      }else{
        that.first.pqcFirstRecordExtInfoDtos=[]
      }
      that.first.createTime=that.first.createTime?(new Date(that.first.createTime)).getTime():null;
      let parmas = {
        defectRecordList: [],
        firstRecordDto: that.first,
        paramRecordList: []
      }  
      if(requestMethod=='save'){
          if(that.btnState=="post") {
            that.$http.post('/examinecenter/pqc/firstrecord',parmas,that.headers).then(function(resp){
                that.btnState="put"
                that.$Message.success(i18n.t("pqc.as"));
                that.first.firstRecordId=resp.data.firstRecordDto.firstRecordId;
                that.$emit("open-tab","qc-pqc-first-add-"+that.firstRecordId,i18n.t("pqc.aofr")+"-"+that.first.productName,"page-exam-pqc-first-add",{firstRecordId:that.firstRecordId});
                that.first.createTime=that.first.createTime?new Date(that.first.createTime):null;
                that.spinShow=true;
            }).catch(function(){
                that.first.createTime=that.first.createTime?new Date(that.first.createTime):null;
                that.spinShow=true;
            })
          }
          else if(that.btnState=="put") {//修改
            that.$http.put('/examinecenter/pqc/firstrecord',parmas,that.headers).then(function(resp){
                that.$Message.success(i18n.t('pqc.ats'));
                that.first.createTime=that.first.createTime?new Date(that.first.createTime):null;    
                that.spinShow=true;                 
            }).catch(function(){
                that.first.createTime=that.first.createTime?new Date(that.first.createTime):null;   
                that.spinShow=true;             
            })
          }
      }
      
      
      else{//提交
        that.$http.post('/examinecenter/pqc/firstrecord/applyaudit',parmas,that.headers).then(function(resp){
            that.$Message.success(i18n.t('pqc.cs'));
            that.closePage();
        })
      }
      this.$emit("hidden",1)
    },
    // formatTime1(){
    //   let that = this;
    //   that.first.planfirstRecordTime=that.first.planfirstRecordTime?new Date(that.first.planfirstRecordTime):null;
    //   that.first.firstAuditTime=that.first.firstAuditTime?new Date(that.first.firstAuditTime):null;
    // },
    closePage(){
      this.$emit("off");
    },
  },
}
</script>
<style>
.titleSmall{color:#418FEE;font-size:16px;}
.blockSmall{margin-bottom:30px;border-bottom:1px dashed #ddd;padding-bottom:20px;}
.noBorder .ivu-select-selection,
.noBorder .ivu-select:focus .ivu-select-selection,
.noBorder .ivu-input
{
  border:0!important;
  border-color:transparent!important;
  box-shadow:0 none!important;
  outline: none!important;
}
.firstList{
  padding:24px;
  background:#FAFAFA;
  margin-top:15px;
}
.firstList p{
  padding:0;
  margin-top:14px;
  font-size: 14px;
  color: #262626;
}
.firstList p:first-child{
  margin-top: 0;
}
.ivu-input-group-append{
  background:#fff!important;
}
.ivu-poptip-confirm .ivu-poptip-body .ivu-icon{
  left: 16px;
}
.ivu-table-footer{
  border-top: 1px solid #e9eaec;
}
.ivu-select-input[disabled]{
  color:#666;
}
.iqis-page-block-tools{
  margin-bottom:8px;
}
.iqis-page-block-tools-second .ivu-btn-ghost:not([disabled]) {
    color:#418FEE;
    background-color: transparent;
    border-color: #418FEE;
}
</style>
