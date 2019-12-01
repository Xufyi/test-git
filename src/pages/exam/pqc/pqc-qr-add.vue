/*
 * @Author: yaoxingpu 
 * @Date: 2018-12-25 10:24:13 
 * @Last Modified by: yaoxingpu
 * @Last Modified time: 2019-04-28 16:46:56
 */

<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t("pqc.cf")}}：
        <span>
          <RadioGroup v-model="qualityRecordId">
            <Radio style="font-size:14px;" :disabled="qualityRecordID != null || !((state == 1 || state == 2) ? false : true && rightControl)" label="productCheck">
                <span style="font-size:14px;">{{$t("pqc.pi")}}</span>
            </Radio>
            <Radio style="font-size:14px;" :disabled="qualityRecordID != null || !((state == 1 || state == 2) ? false : true && rightControl)" label="devickCheck">
                <span style="font-size:14px;">{{$t('pqc.ei')}}</span>
            </Radio>
            <Radio style="font-size:14px;" :disabled="qualityRecordID != null || !((state == 1 || state == 2) ? false : true && rightControl)" label="otherInspection">
                <span style="font-size:14px;">{{$t('pqc.oc')}}</span>
            </Radio>
        </RadioGroup>
          </span>
      </div>
      <div class="iqis-page-block-title">{{$t("pqc.bi")}}</div>
      <div class="iqis-page-block-body">
        <Row v-show="qualityRecordId == 'productCheck' ? true : false" type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.pn')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select @on-change="selectOn(productCheck.productId)" :label="productCheck.productNo" remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pqc.pleaseSelect')" :disabled="!((state == 1 || state == 2) ? false : true && rightControl)" v-model="productCheck.productId" filterable>
                <Option v-for="data in productList" :key="data.productId" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.name")}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <Select :placeholder="i18n.t('pqc.pleaseSelect')" ref="productCheckName" disabled v-model="productCheck.productId" filterable>
                <Option v-for="data in productList" :key="data.productId" :label="data.name" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select> -->
              <i-input v-model="productCheck.productName" ref="productCheckName" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.specifications')}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <Select :placeholder="i18n.t('pqc.pleaseSelect')" disabled v-model="productCheck.productId" filterable>
                <Option v-for="data in productList" :key="data.productId" :label="data.spec" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select> -->
              <i-input v-model="productCheck.productSpec" disabled></i-input>
            </div>
          </i-col>
        </Row>
        <Row v-show="qualityRecordId == 'productCheck' ? true : false" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.pl')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pqc.pleaseSelect')" :disabled="!((state == 1 || state == 2) ? false : true && rightControl)" v-model="productCheck.prodLineId" filterable>
                <Option v-for="(data,index) in prodLineList" :key="index" :value="data.prodLineId">{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
           <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.pp')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pqc.pleaseSelect')" :disabled="!((state == 1 || state == 2) ? false : true && rightControl)" v-model="productCheck.prodProcessId" filterable>
                <Option v-for="(data,index) in productionProcessList" :key="index" :value="data.prodProcessId">{{data.prodProcessName}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.inspector")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pqc.pleaseSelect')" :disabled="!((state == 1 || state == 2) ? false : true && rightControl)" v-model="productCheck.inspectorId" filterable>
                <Option v-for="(data,index) in userList" :key="index" :value="data.userId">{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.time")}}</div>
            <div class="iqis-page-block-ctrl">
                <!-- <DatePicker :clearable="false" :disabled="disabled.application||noPermsDis" v-model="application.planTrialProdTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker> -->
                <Date-picker :disabled="!((state == 1 || state == 2) ? false : true && rightControl)" type="datetime" format="yyyy-MM-dd HH:mm" v-model="createTimesProductCheck" :clearable='false' style="width: 100%"></Date-picker>
            </div>
          </i-col>
        </Row>
        <Row v-show="qualityRecordId == 'devickCheck' ? true : false" type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.en')}}</div>
            <div class="iqis-page-block-ctrl">
             <i-input :disabled="!((state == 1 || state == 2) ? false : true && rightControl)" v-model="devickCheck.chkdevNo" :placeholder="i18n.t('pqc.pe')" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.deviceName')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="!((state == 1 || state == 2) ? false : true && rightControl)" v-model="devickCheck.chkdevName" :placeholder="i18n.t('pqc.pe')" style="width: 100%;"></i-input>
            </div>
          </i-col>
           <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.pl')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pqc.pleaseSelect')" :disabled="!((state == 1 || state == 2) ? false : true && rightControl)" v-model="devickCheck.prodLineId" filterable>
                <Option v-for="(data,index) in prodLineList" :key="index" :value="data.prodLineId">{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
        </Row>
        <!-- <div v-if="qualityRecordID != null ? true : false"> -->
          <Row v-show="qualityRecordId == 'devickCheck' ? true : false" type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.inspector')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pqc.pleaseSelect')" :disabled="!((state == 1 || state == 2) ? false : true && rightControl)" v-model="devickCheck.inspectorId" filterable>
                <Option v-for="(data,index) in userList" :key="index" :value="data.userId">{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.time')}}</div>
            <div class="iqis-page-block-ctrl">
                <DatePicker :disabled="!((state == 1 || state == 2) ? false : true && rightControl)" :clearable="false" v-model="createTimesOtherInspection" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
            </div>
          </i-col>
        </Row>
        <!-- </div> -->
        <!-- 添加时 -->
        <div v-if="qualityRecordID == null ? true : false">
          <Row v-show="qualityRecordId == 'otherInspection' ? true : false" type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.inspector')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pqc.pleaseSelect')" v-model="otherInspection.inspectorId" filterable>
                <Option v-for="(data,index) in userList" :key="index" :value="data.userId">{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.time')}}</div>
            <div class="iqis-page-block-ctrl">
                <DatePicker  :clearable="false" v-model="createTimesOtherInspection" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
            </div>
          </i-col>
        </Row>
        </div>
        <Row>
          <i-Col span="24">
          <div class="iqis-page-block-title" style="margin-bottom:10px;">{{$t("pqc.pu")}}</div>
          <!-- <div class="iqis-page-block-label">图片上传</div> -->
            <div class="iqis-page-block-body">
              <Spin size="large" v-if="spinShow" style="text-align:left">
                  <!-- <IqisUpload ref="upload" :edit="(state == 1 || state == 2) ? false : true" :fullScreen="true" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png']" :fileCount="20" :value='qualityRecordId == "productCheck" ? productCheck.pqcQualityRecordExtInfoDtos : qualityRecordId == "devickCheck" ? devickCheck.pqcQualityRecordExtInfoDtos : otherInspection.pqcQualityRecordExtInfoDtos' :chartTypeShow="true"></IqisUpload> -->
                  <IqisUpload :divimgid='"sss"' :pr='pr' v-on:childByValue='childByValue' v-show='qualityRecordId == "productCheck"' ref="upload" :edit="(state == 1 || state == 2) ? false : true" :fullScreen="true" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png']" :fileCount="20" :value='productCheck.pqcQualityRecordExtInfoDtos' :chartTypeShow="true"></IqisUpload>
                  <IqisUpload :divimgid='"sss"' :pr='pr' v-on:childByValue='childByValue' v-show='qualityRecordId == "devickCheck"' ref="upload1" :edit="(state == 1 || state == 2) ? false : true" :fullScreen="true" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png']" :fileCount="20" :value='devickCheck.pqcQualityRecordExtInfoDtos' :chartTypeShow="true"></IqisUpload>
                  <IqisUpload :divimgid='"sss"' :pr='pr' v-on:childByValue='childByValue' v-show='qualityRecordId == "otherInspection"' ref="upload2" :edit="(state == 1 || state == 2) ? false : true" :fullScreen="true" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png']" :fileCount="20" :value='otherInspection.pqcQualityRecordExtInfoDtos' :chartTypeShow="true"></IqisUpload>
              </Spin>
            </div>
          <div class="iqis-page-img-title">{{$t('pqc.ppv')}}</div>
            <div v-if='qualityRecordId == "productCheck"' class="iqis-page-block-body">
              <div id="watchPicpr">
              </div>
            </div>
            <div v-if='qualityRecordId == "devickCheck"' class="iqis-page-block-body">
              <div id="watchPicpr1">
              </div>
            </div>
            <div v-if='qualityRecordId == "otherInspection"' class="iqis-page-block-body">
              <div id="watchPicpr2">
              </div>
            </div>
          </i-Col>
        </Row>
      </div>
    </div>
    
    <div class="page-end" style="padding-bottom: 65px"></div>
    <!-- 未提交、申请审核驳回 -->
    <IqisAffix placement="bottom" :offset="0" v-if="true">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <!-- <Button type="primary" v-show="!!((state == 1 || state == 2) ? false : true && rightControl)" @click="saveApplication('submit')">提交</Button> -->
        <!-- {{rightControl}}{{是他te}} -->
        <Button type="primary" v-show="(state==3||state==4 || state == null)&&rightControl" @click="saveApplication('submit')">{{$t('pqc.submit')}}</Button>
        <Button type="primary" v-show="(state==3||state==4 || state == null)&&rightControl" @click="saveApplication('save')">{{$t("pqc.save")}}</Button>
        <Button type="ghost" @click="closePage">{{$t('pqc.cancel')}}</Button>
      </div>
    </IqisAffix>
  </div>

</template>

<script>
import $ from 'jquery'
export default {
  props:["params","tabKey"],
  data(){
    let vm = this;
    return{
        i18n:window.i18n,
        save:false,
        save1:false,
        save2:false,
        pr:'pr',
        /* productCheck:true,//产品检查
        devickCheck:false,
        otherInspection:false, */
        imgurl:null,
        userIds:null,
        dengluId:null,
        tenantId:null,
        state:null,
        qualityRecordId:"productCheck",
        qualityRecordID:null,
        productCheck:{//产品检查
          type:0,
          productId:null,
          productNo:null,
          productName:null,
          productSpec:null,
          prodLineId:null,
          inspectorId:null,
          createTime:null,
          prodProcessId:null,
          pqcQualityRecordExtInfoDtos:[],
        },
        devickCheck:{//设备检查
          type:1,
          chkdevNo:null,
          chkdevName:null,
          prodLineId:null,
          inspectorId:null,
          createTime:null,
          pqcQualityRecordExtInfoDtos:[],
        },
        otherInspection:{
          type:2,
          inspectorId:null,
          createTime:null,
          pqcQualityRecordExtInfoDtos:[],
        },
        createTimesProductCheck: new Date(),
        createTimesDevickCheck: new Date(),
        createTimesOtherInspection: new Date(),

        customerList:[],
        userList:[],
        productList:[],
        prodLineList:[],
        processIdList:[],
        productionProcessList:[],






        /* -------------------分割线------------------ */
      trialProdId:'',
      spinShow:false,
      TableLength:0,
      loadStat:{
        selectsDataLoading:false,
        complaintDataLoading:false,
        saveLoading:false,
        submitLoading:false
      },
      selects:{
        defectTypeList:[],
        inspectionTypes:[],
      },
      headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
      
      
      other:{
        productUnitName:'',
        memberBtnShow:true,
        memberInputShow:false,
      },

      treatmentMethods:[
         {value:"PASS",label:i18n.t('pqc.adopt')},
         {value:"RE_TRIAL_PROD",label:i18n.t("pqc.ttp")},
         {value:"STOP_TRIAL_PROD",label:i18n.t('pqc.stp')},
      ],
      userId:'',
      

      pageButton:'application',
      show:{
        record:false,
        review:false,
      },
      disabled:{
        application:false,
        record:false,
        review1Record:true,
        review2Record:true,
        review3Record:true,
        review4Record:true,
        auditorRecord:true,
        judgeRecord:true,
      },
      application:{
        trialProdId:'',
        applicationTime:'',
        applicationUserId:'',
        trialProdNo:'',
        orderNo:'',
        productId:'',
        productName:'',
        productNo:'',
        productSpec:'',
        customerId:'',
        prodLineId:'',
        planTrialProdTime:'',
        trialProdObjective:'',
        materialCondition:'',
        memberList:[],
        applicationAuditorId:'',
        applicationAuditTime:'',
        trialProdState:'',
      },
      record:{
        "actualTrialProdTime": "",
        "badQuantity": '',
        "badRate": '',
        "recordAuditTime": "",
        "recordAuditor": "",
        "recordAuditorId": '',
        "recordList": [
          // {
          //   "badQuantity": 0,
          //   "badRate": 0,
          //   "defectLocId": 0,
          //   "defectLocName": "",
          //   "defectTypeId": 0,
          //   "defectTypeName": "",
          //   "extInfoList": [
          //     {
          //       "createTime": "",
          //       "defectrecordExtInfoName": "",
          //       "defectrecordExtInfoNum": "",
          //       "defectrecordExtInfoType": "",
          //       "tenantId": 0,
          //       "trialProdDefectRecordId": 0,
          //       "trialProdDefectrecordExtInfoId": 0,
          //       "url": ""
          //     }
          //   ],
          //   "inspectionTypeId": 0,
          //   "inspectionTypeName": "",
          //   "qltyLvId": 0,
          //   "qltyLvName": "",
          //   "sampleQuantity": 0,
          //   "trialProdDefectRecordId": 0,
          //   "trialProdId": 0
          // }
        ],
        "recordTime": "",
        "recordUser": "",
        "recordUserId": '',
        "reviewProcessId": '',
        "reviewProcessName": "",
        "trialProdCaption": "",
        "trialProdId": '',
        "trialProdQuantity": ''
      },
      review:{
        "auditorRecord": {
          "opinion": "",
          "reviewTime": "",
          "reviewer": "",
          "reviewerId": '',
          "treatmentType": "",
          "trialProdId": '',
          "trialProdReviewrecordId": ''
        },
        "judgeRecord": {
          "opinion": "",
          "reviewTime": "",
          "reviewer": "",
          "reviewerId": '',
          "treatmentType": "",
          "trialProdId": '',
          "trialProdReviewrecordId": ''
        },
        "review1Record": {
          "opinion": "",
          "reviewTime": "",
          "reviewer": "",
          "reviewerId": '',
          "treatmentType": "",
          "trialProdId": '',
          "trialProdReviewrecordId": ''
        },
        "review2Record": {
          "opinion": "",
          "reviewTime": "",
          "reviewer": "",
          "reviewerId": '',
          "treatmentType": "",
          "trialProdId": '',
          "trialProdReviewrecordId": ''
        },
        "review3Record": {
          "opinion": "",
          "reviewTime": "",
          "reviewer": "",
          "reviewerId": '',
          "treatmentType": "",
          "trialProdId": '',
          "trialProdReviewrecordId": ''
        },
        "review4Record": {
          "opinion": "",
          "reviewTime": "",
          "reviewer": "",
          "reviewerId": '',
          "treatmentType": "",
          "trialProdId": '',
          "trialProdReviewrecordId": ''
        },
        "trialProdId": ''
      },
      defectRecords:{
        table:{
          loading:false,
          selected:false,
          data:[],
          pager:{
            rows:10,
            need:true,
            total:100,
            limit:10,
            current:1
          },
          columns:[
            {type: 'selection',
              align: 'center',
              width:40,
              minWidth:40,
              maxWidth:40,
            },{
              title: i18n.t('pqc.no'),
              minWidth:30,
              maxWidth:30,
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm)
            },
            {
              title: i18n.t('pqc.inspection'),
              width:103,
              align: 'center',
              ellipsis:true,
              minWidth: 103,
              key: 'inspectionTypeId',
              render:
                (h, params)=>{
                  let ret =  vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(
                    vm,
                    (vm)=>{
                      return vm.selects.inspectionTypes
                    },
                    "inspectionTypeId",
                    "name",
                    null,
                    this.getDefectNameList,
                    vm.disabled.record||vm.noPermsDis,
                  )
                  return ret(h,params);
                }
            },
            {
              title: i18n.t('pqc.defectName'),
              width:80,
              minWidth:80,
              key: 'defectTypeId',
              render: (h, params) => {
                let _this = this;
                return h('Select',
                  {
                    props:{
                      value: this.defectRecords.table.data[params.index].defectTypeId,
                      disabled:this.disabled.record||this.noPermsDis,
                      filterable:true
                    },
                    on:{
                      'on-change':(value) => {
                        this.defectRecords.table.data[params.index].defectTypeId = value;
                        this.onDefectTypeSelectChange(this.defectRecords.table.data[params.index].defectTypeId,params.index)
                      }
                    }
                  },
                  this.defectRecords.table.data[params.index].defectTypeList.map(function(type){
                    return h('Option', {props: {value: type.defectTypeId,label:type.name}},type);
                  })
                );
              }
            },{
              title: i18n.t('pqc.defectGrade'),
              width:80,
              minWidth:80,
              align: 'center',
              key: 'qltyLvId',
              render: (h, params) => {
                let _this = this;
                return h('Select',
                  {
                    props:{
                      value: this.defectRecords.table.data[params.index].qltyLvId,
                      disabled:this.disabled.record||this.noPermsDis
                    },
                    on: {
                      'on-change':(event) => {
                        this.defectRecords.table.data[params.index].qltyLvId = event;
                      }
                    },
                  },
                  this.defectRecords.prodBatch.DefectGrade.map(function(type){
                      return h('Option', {
                          props: {value: type.qltyLvId,label:type.name}
                      }, type);
                  })
                );
              }
            },{
              title: i18n.t('pqc.defectPosition'),
              align: 'center',
              width:100,
              minWidth:100,
              key: 'defectLocId',
              render: (h, params) => {
                let _this = this;
                return h('Select',
                  {
                    props:{
                      value: this.defectRecords.table.data[params.index].defectLocId,
                      disabled:this.disabled.record||this.noPermsDis,
                      placeholder:i18n.t('null')
                    },
                    on: {
                      'on-change':(event) => {
                        this.defectRecords.table.data[params.index].defectLocId = event;
                      }
                    },
                  },
                  this.defectRecords.prodBatch.DefectPosition.map(function(type){
                    return h('Option', {
                      props: {value: type.defectLocId,label:type.name}
                    }, type);
                  })
                );
              }
            },{
              title: i18n.t('pqc.sampleQuantity'),
              width:80,
              minWidth:80,
              align: 'center',
              key: 'sampleQuantity',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: me.defectRecords.table.data[params.index].sampleQuantity,
                      disabled:this.disabled.record||this.noPermsDis
                    },
                    on: {
                      'on-blur':(event) => {
                        this.defectRecords.table.data[params.index].sampleQuantity = event.target.value;
                        this.defectRate(this.defectRecords.table.data[params.index].badQuantity,this.defectRecords.table.data[params.index].sampleQuantity,params.index)
                      }
                    }
                  })
                ])
              }
            },{
              title: i18n.t('pqc.dn'),
              width:80,
              minWidth:80,
              align: 'center',
              key: 'badQuantity',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: me.defectRecords.table.data[params.index].badQuantity,
                      disabled:this.disabled.record||this.noPermsDis
                    },
                    on: {
                      'on-blur':(event) => {
                        this.defectRecords.table.data[params.index].badQuantity = event.target.value
                        this.defectRate(this.defectRecords.table.data[params.index].badQuantity,this.defectRecords.table.data[params.index].sampleQuantity,params.index)
                      }
                    }
                  })
                ])
              }
            },{
              title: i18n.t('pqc.defectRates'),
              width:80,
              minWidth:80,
              align: 'center',
              key: 'defectRate',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: this.defectRecords.table.data[params.index].defectRate,//me.defectRecords.table.data[params.index].badQuantity/me.defectRecords.table.data[params.index].sampleQuantity*100+'%',//me.defectRate(me.defectRecords.table.data[params.index].badQuantity,me.defectRecords.table.data[params.index].sampleQuantity),
                      disabled:true//this.disabled.record
                    },
                    on: {
                      'on-change':(event) => {
                        //console.log(event)
                      }
                    }
                  })
                ])
              }
            },{
              title: i18n.t('pqc.picture'),
              align: 'center',
              key: 'extInfoList',
              minWidth: 250,
              render:function (h, data) {
                try{
                  vm.defectRecords.table.data[data.index].extInfoList.length
                }catch(err) {
                  vm.defectRecords.table.data[data.index].extInfoList=[]
                }

                return h("IqisUpload", {
                  props: {//:size="54" :edit="switchs.fileEdit" v-model="product.settings.ext"
                    "value":data.row[data.column.key],
                    "size": 32,
                    "row-index": data.index,
                    "row":data.row,
                    "edit":!vm.disabled.record&&!vm.noPermsDis,
                    "maxSize":10240,
                    "fileType":['jpg','jpeg','png'],
                    "fileCount":5,
                    'chartTypeShow':"true",
                    //disabled:this.other.applicationD1D2Show,
                  },
                  on: {
                    input: (val) => {
                      var obj = {
                        'defectrecordExtInfoName': val[0].name,
                        'defectrecordExtInfoType': val[0].mime,
                        'url': val[0].url
                      };
                      vm.defectRecords.table.data[data.index].extInfoList.push(obj);
                      //vm.cellDefectEditorEnd(val, data.column.key, data.index)
                    },
                    del: (val) => {
                      vm.defectRecords.table.data[data.index].extInfoList.splice(val,1);
                      //vm.cellDefectEditorEnd(val, data.column.key, data.index)
                    }
                  }
                })
              }
            }
          ]
        },
        discountData:{
          rows:[{
          }],
          tableData:{
            defectLocId: '',
            defectLocName: '',
            badQuantity: '',
            defectRate: '',
            defectRecordId:null,
            defectTypeId: '',
            defectTypeName: '',
            inspectionTypeId: '',
            inspectionTypeName: '',
            qltyLvId: '',
            qltyLvName: '',
            trialProdId: '',
            treatmentDescription: '',
            treatmentHours: ''
          },
        },
        prodBatch:{
          selected:false,
          disabled:true,
          defectNumber:0,
          dataTable:[],
          DefectName:[],
          DefectGrade:[],
          DefectPosition:[]
        }
      },
      permsCur:[
        "UPDATE_TRIAL_PROD",
        "INSERT_TRIAL_PROD"
      ],
      permsBtn:{
        "UPDATE_TRIAL_PROD":false,
        "INSERT_TRIAL_PROD":false,
      },
      noPermsDis:false,
      firstDis:false,
      currentLogin:null,//当前登录人员
      rightControl:true,//权限控制
      loadingRemote:false,
      source:null,

    }
  },

  created(){
    this.CurrentOperator()
    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.refreshData();
    // this.spinShow();
    this.childByValue()
  },
  watch: {
    qualityRecordId:function(a,b){
      let that = this;
      let lg = that.$refs.upload.myUploadList.length
      let lg1 = that.$refs.upload1.myUploadList.length
      let lg2 = that.$refs.upload2.myUploadList.length
      //console.log(that.$refs.upload,345678);
        if(b == 'productCheck'){
          that.productCheck.inspectorId = that.currentLogin
          if(that.productCheck.productId !== null || lg != 0 || that.productCheck.prodLineId !== null && that.productCheck.prodProcessId !== null){
            
            that.qualityRecordId = b;
            this.$Modal.confirm({
                title: i18n.t('pqc.prompted'),
                content: '<span>'+i18n.t("pqc.ttd")+'</span>',
                okText: i18n.t('pqc.confirm'),
                cancelText: i18n.t('pqc.cancel'),
                onOk: () => {
                  that.qualityRecordId = a
                this.productCheck = {
                    type:0,
                    productId:null,
                    prodLineId:null,
                    inspectorId:that.currentLogin,
                    // createTime:null,
                    prodProcessId:null,
                    pqcQualityRecordExtInfoDtos:[],
                  }
                  that.$refs.upload.myUploadList = []
                  // that.$refs.upload.uploadFileList = []
                  // that.$refs.upload.uploadList = []
                  $('#watchPicpr').html('<span></span>')
                },
                 onCancel: () => {
                        that.qualityRecordId = "productCheck";
                    }
            });
          }
        }
         if(b == 'devickCheck'){
           that.devickCheck.inspectorId = that.currentLogin
          if(that.devickCheck.chkdevNo !== null || lg1 != 0 ||  that.devickCheck.chkdevName !== null || that.devickCheck.prodLineId !== null){
            that.qualityRecordId = b;
            this.$Modal.confirm({
                title: i18n.t('pqc.prompted'),
                content: '<span>'+i18n.t("pqc.ttd")+'</span>',
                okText: i18n.t('pqc.comfirm'),
                cancelText: i18n.t('pqc.cancel'),
                onOk: () => {
                that.qualityRecordId = a
                this.devickCheck = {
                  type:1,
                  chkdevNo:null,
                  chkdevName:null,
                  prodLineId:null,
                  // inspectorId:null,
                  // createTime:null,
                  pqcQualityRecordExtInfoDtos:[],
                  }
                  that.$refs.upload1.myUploadList = []
                  $('#watchPicpr1').html('<span></span>')
                },
                 onCancel: () => {
                        that.qualityRecordId = "devickCheck";
                    }
            });
          }
        }
         if(b == 'otherInspection'){
           if(lg2 !=0){
             that.qualityRecordId = b;
             this.$Modal.confirm({
                title: i18n.t('pqc.prompted'),
                content: '<span>'+i18n.t("pqc.ttd")+'</span>',
                okText: i18n.t('pqc.comfirm'),
                cancelText: i18n.t('pqc.cancel'),
                onOk: () => {
                  that.qualityRecordId = a;
                /* this.otherInspection = {
                  type:2,
                  inspectorId:null,
                  createTime:null,
                  pqcQualityRecordExtInfoDtos:[],
                  } */
                  this.otherInspection.pqcQualityRecordExtInfoDtos = [];
                  that.$refs.upload2.myUploadList = []
                  $('#watchPicpr2').html('<span></span>')
                },
                 onCancel: () => {
                        that.qualityRecordId = "otherInspection";
                    }
            });
           }
          /* if(that.otherInspection.inspectorId !== null){
            
          } */
        }

        /* if(that.qualityRecordId == "productCheck"){
          
        }else if(that.qualityRecordId == "devickCheck"){
          that.productCheck.pqcQualityRecordExtInfoDtos = [];
          that.otherInspection.pqcQualityRecordExtInfoDtos = [];
        }else if(that.qualityRecordId == "otherInspection"){
          that.devickCheck.pqcQualityRecordExtInfoDtos = [];
          that.productCheck.pqcQualityRecordExtInfoDtos = [];
        }
      // }
      //console.log(that.productCheck.pqcQualityRecordExtInfoDtos,1);
      //console.log(that.devickCheck.pqcQualityRecordExtInfoDtos,2);
      //console.log(that.otherInspection.pqcQualityRecordExtInfoDtos,3); */
    }
  },
  methods:{
    selectOn(val, index) {
      let that = this;
      if(!val){return;}
      that.$http.get('/basic/product/detail/'+val).then(res=>{
        that.productCheck.productName=res.data.name
        that.productCheck.productNo=res.data.no
        that.productCheck.prodTypeName=res.data.prodTypeName
        that.productCheck.productSpec=res.data.spec

      })
      // this.productName(val)
    },
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
    childByValue(childByValue){
      this.imgurl = childByValue
    },
     CurrentOperator(obj) {
        let that = this;
        let url = '/tenant/user/profile'
        that.$http.get(url).then((res) => {
          that.currentLogin = res.data.userId
          that.productCheck.inspectorId = res.data.userId
          that.devickCheck.inspectorId = res.data.userId
          that.otherInspection.inspectorId = res.data.userId
        })
      },
    refreshData(){
      let that = this;
      // that.spinShow=true;
      let qualityRecordId = that.$props.params && that.$props.params.qualityRecordId;
      if(!that.qualityRecordID){
          that.qualityRecordID = qualityRecordId;
      }
      if (qualityRecordId) {//修改
        let that = this;
        let url = "/examinecenter/pqc/qualityrecord/";
        that.$http.get(url + qualityRecordId).then(res => {
          that.qualityRecordID = res.data.qualityRecordId;
          that.state = res.data.state;
          // alert(that.state)
          if(res.data){
            let type = res.data.type
            if(type == 0){
              if(res.data.inspectorId == that.currentLogin){
                that.rightControl = true;//可以修改
              }else{
                that.rightControl = false;//
              }
              that.qualityRecordId = "productCheck";
              that.createTimesProductCheck = new Date(res.data.createTime)
              that.productCheck = res.data;
              that.spinShow=true;
              that.tenantId = res.data.tenantId;
              //console.log(res.data,1);
            }else if(type == 1){
              if(res.data.inspectorId == that.currentLogin){
                that.rightControl = true;
              }else{
                that.rightControl = false;
              }
              that.qualityRecordId = "devickCheck";
              that.createTimesDevickCheck = new Date(res.data.createTime)
              that.devickCheck = res.data;
              that.spinShow=true;
              that.tenantId = res.data.tenantId;
              //console.log(res.data,2);
            }else if(type == 2){
              if(res.data.inspectorId == that.currentLogin){
                that.rightControl = true;
              }else{
                that.rightControl = false;
              }
              that.qualityRecordId = "otherInspection";
              that.createTimesOtherInspection = new Date(res.data.createTime)
              that.otherInspection = res.data;
              that.spinShow=true;
              that.tenantId = res.data.tenantId;
              //console.log(res.data,3);
            }
          }

          // return false;
          

          /**
           *  判断按钮，输入状态
           */
          /* //未提交
          if(that.pqc.AuditStatus == 0){
            if(that.pqc.CurrentOperatorId == that.pqc.inspectorId){
              that.sub2 = false;
            }else{
              that.sub2 = true;
            }
            that.sub1 = false;
          }
          // 待审核状态
          if(that.pqc.AuditStatus == 1){
            that.sub2 = true;
          }
          //审核成功
          if(that.pqc.AuditStatus == 2){
            that.sub2 = true;
            //当为合格状态时
            if(that.pqc.result == 1){
              that.sub1 = false;
            }else{
              that.sub1 = true;
              that.handListShow = true;
            }
          }

          //审核不通过
          if(that.pqc.AuditStatus == 3){
            if(that.pqc.CurrentOperatorId == that.pqc.inspectorId){
              that.sub2 = false;
            }else{
              that.sub2 = true;
            }
            that.sub1 = false;
          } */

        });
      }else{
        that.spinShow=true;
      }
      that.$http.all([
        that.$http.get("/tenant/user",{params:{limit:999999999}}),
        // that.$http.get("/basic/product",{params:{limit:999999999,examType:2, useState:1, page:1}}),//产品列表
        that.$http.get("/bas/customerList",{params:{limit:99999999}}),
        that.$http.get('/tenant/user/profile'),
        that.$http.get('/basic/prodline',{params:{limit:99999999}}),//生产线别
        that.$http.get('/basic/reviewprocess',{params:{limit:99999999}}),
        that.$http.get('/basic/prod-process',{params:{limit:99999999}})//生产工序
      ]).then(function(resps){
        that.userList = resps[0].data; //检验员
        // that.productList = resps[1].data;
        //console.log(that.userList,998);
        
        that.customerList = resps[1].data;
        that.userId=resps[2].data.userId;
        that.prodLineList=resps[3].data;//生产线别
        
        that.processIdList = resps[4].data;
        that.productionProcessList = resps[5].data;//生产工序
         /* let trialProdId = that.$props.params && that.$props.params.trialProdId; */
        if(((!qualityRecordId&&that.permsBtn.INSERT_TRIAL_PROD)||(qualityRecordId&&that.permsBtn.UPDATE_TRIAL_PROD))){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
        /*if(trialProdId){//修改
        that.trialProdId=trialProdId;
          that.getData();
          that.getDefectData();
        }else{//添加
          that.application.applicationUserId=that.userId;
          that.application.applicationTime=new Date();
        } */
      })
    },
    
   /*  getData(){
      let that = this;
      that.$http.get('/examinecenter/pqc/trialProd/trialProd/'+that.trialProdId).then(function(resp){
        //console.log(resp.data,'获取试产管理全部数据')
        resp.data.application.applicationTime=resp.data.application.applicationTime?new Date(resp.data.application.applicationTime):null;
        resp.data.application.planTrialProdTime=resp.data.application.planTrialProdTime?new Date(resp.data.application.planTrialProdTime):null;
        resp.data.application.applicationAuditTime=resp.data.application.applicationAuditTime?new Date(resp.data.application.applicationAuditTime):null;
        that.application=resp.data.application;
        if(resp.data.record){
          resp.data.record.actualTrialProdTime=resp.data.record.actualTrialProdTime?new Date(resp.data.record.actualTrialProdTime):null;
          resp.data.record.recordAuditTime=resp.data.record.recordAuditTime?new Date(resp.data.record.recordAuditTime):null;
          resp.data.record.recordTime=resp.data.record.recordTime?new Date(resp.data.record.recordTime):null;
          that.record=resp.data.record;
          that.defectRecords.table.data=resp.data.record.recordList;
          that.record.trialProdId=that.application.trialProdId;
          that.getProductData(that.application.productId)
          if(that.defectRecords.table.data){
            for(let i in that.defectRecords.table.data){
              let inspectionTypeId = that.defectRecords.table.data[i].inspectionTypeId;
              let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
              let defectTypeList = resp ? resp.data||[] : [];
              that.defectRecords.table.data[i]['defectTypeList'] = defectTypeList;
            }
          }
          for(var i = 0;i<that.defectRecords.table.data.length;i++){
            if(that.defectRecords.table.data[i].extInfoList==null){
              that.defectRecords.table.data[i].extInfoList=new Array();
            }
            that.defectRecords.table.data[i].defectNumber=i;
          }
          that.getDefectData();
          for(let x in that.defectRecords.table.data){
            that.defectRate(that.defectRecords.table.data[x].badQuantity,that.defectRecords.table.data[x].sampleQuantity,x);
          }
        }
        if(resp.data.review){
          if(resp.data.review.auditorRecord){resp.data.review.auditorRecord.reviewTime=resp.data.review.auditorRecord.reviewTime?new Date(resp.data.review.auditorRecord.reviewTime):null;}
          if(resp.data.review.judgeRecord){resp.data.review.judgeRecord.reviewTime=resp.data.review.judgeRecord.reviewTime?new Date(resp.data.review.judgeRecord.reviewTime):null;}
          if(resp.data.review.review1Record){resp.data.review.review1Record.reviewTime=resp.data.review.review1Record.reviewTime?new Date(resp.data.review.review1Record.reviewTime):null;}
          if(resp.data.review.review2Record){resp.data.review.review2Record.reviewTime=resp.data.review.review2Record.reviewTime?new Date(resp.data.review.review2Record.reviewTime):null;}
          if(resp.data.review.review3Record){resp.data.review.review3Record.reviewTime=resp.data.review.review3Record.reviewTime?new Date(resp.data.review.review3Record.reviewTime):null;}
          if(resp.data.review.review4Record){resp.data.review.review4Record.reviewTime=resp.data.review.review4Record.reviewTime?new Date(resp.data.review.review4Record.reviewTime):null;}
          that.review=resp.data.review;
          that.review.trialProdId=that.application.trialProdId;
        }
        that.getBlock();
        
      })
    }, */
    getBlock(){
      let that = this;
      let userId = that.userId;
      let state = that.application.trialProdState;//当前状态
      //console.log(state,'当前状态！！！！')
      //console.log(userId,'当前id！！！！')
      let applicationUserId = that.application.applicationUserId;
      let applicationAuditorId = that.application.applicationAuditorId;
      let recordAuditorId = that.record.recordAuditorId;
      
      //未提交，申请待审核，申请审核驳回
      if(state=='UNSUBMIT' || state == 'AUDITING'|| state == 'AUDITREJECT' ){
        if(state == 'AUDITING'){
          that.disabled.application=true;
          if(userId==applicationAuditorId){
            that.pageButton='applicationAudit';
          }else{
            that.pageButton='';
          }
        }else{
          if(userId==applicationUserId){
            that.disabled.application=false;
            that.pageButton='application';    
          }else{
          that.disabled.application=true;
            that.pageButton='';
          }
        }
      }  
      //待试产，试产中，试产待审核，试产审核驳回
      else if(state == 'AUDITPASS'||state == 'TRIALPRODUCTING'||state == 'TRIALPRODAUDITING'||state == 'TRIALPRODAUDITREJECT'){
        that.disabled.application=true;
        that.show.record=true;
        that.disabled.record=false;
        that.pageButton='trialProd';
        if(state == 'AUDITPASS'){
          // if(userId==applicationAuditorId){
          //   that.show.record=false;
          //   that.pageButton='applicationAudit';
          // }else{
            that.record.recordTime=new Date();
            that.record.recordUserId=userId;
            that.pageButton='trialProd';
          // }
        }else if(state == 'TRIALPRODAUDITING'){
          that.disabled.record=true;
          if(userId==recordAuditorId){
            that.pageButton='trialProdAudit'; 
          }else{
            that.pageButton='';
          }
        }
      }
      //待评审，评审中，试产完成
      else if(state == 'TRIALPRODAUDITPASS'||state == 'REVIEWING'||state == 'TRIALPRODEND'){
        that.show.record=true;
        that.show.review=true;
        that.disabled.application=true; 
        that.disabled.record=true; 
        let reviewIds = [];
        reviewIds.push(that.review.auditorRecord.reviewerId)
        reviewIds.push(that.review.review1Record.reviewerId)
        reviewIds.push(that.review.review2Record.reviewerId)
        reviewIds.push(that.review.review3Record.reviewerId)
        reviewIds.push(that.review.review4Record.reviewerId)
        reviewIds.push(that.review.judgeRecord.reviewerId)
        if(reviewIds.indexOf(userId)!=-1){
          that.pageButton='review';
        }else{
          that.pageButton='';
        }
        if(that.review.auditorRecord.reviewerId==userId){that.disabled.auditorRecord=false}
        if(that.review.review1Record.reviewerId==userId){that.disabled.review1Record=false}
        if(that.review.review2Record.reviewerId==userId){that.disabled.review2Record=false}
        if(that.review.review3Record.reviewerId==userId){that.disabled.review3Record=false}
        if(that.review.review4Record.reviewerId==userId){that.disabled.review4Record=false}
        if(that.review.judgeRecord.reviewerId==userId){that.disabled.judgeRecord=false;}
        if(state == 'TRIALPRODAUDITPASS'){
          that.disabled.review1Record=true
          that.disabled.review2Record=true
          that.disabled.review3Record=true
          that.disabled.review4Record=true
          that.disabled.judgeRecord=true
          if(that.review.auditorRecord.reviewerId==userId){
            that.pageButton='review';
          }else{
            that.pageButton=''; 
            that.$Notice.warning({title: i18n.t('pqc.auditFirst')})
          }
        }
        if(state == 'TRIALPRODEND'){
          that.disabled.auditorRecord=true
          that.disabled.review1Record=true
          that.disabled.review2Record=true
          that.disabled.review3Record=true
          that.disabled.review4Record=true
          if(that.review.judgeRecord.reviewerId==userId){
            that.pageButton='review';
          }else{
            that.pageButton='';
          }
        }
        that.review.auditorRecord.reviewTime=!that.review.auditorRecord.reviewTime&&that.review.auditorRecord.reviewerId==userId&&that.disabled.auditorRecord==false?new Date():that.review.auditorRecord.reviewTime;
        that.review.review1Record.reviewTime=!that.review.review1Record.reviewTime&&that.review.review1Record.reviewerId==userId&&that.disabled.review1Record==false?new Date():that.review.review1Record.reviewTime;
        that.review.review2Record.reviewTime=!that.review.review2Record.reviewTime&&that.review.review2Record.reviewerId==userId&&that.disabled.review2Record==false?new Date():that.review.review2Record.reviewTime;
        that.review.review3Record.reviewTime=!that.review.review3Record.reviewTime&&that.review.review3Record.reviewerId==userId&&that.disabled.review3Record==false?new Date():that.review.review3Record.reviewTime;
        that.review.review4Record.reviewTime=!that.review.review4Record.reviewTime&&that.review.review4Record.reviewerId==userId&&that.disabled.review4Record==false?new Date():that.review.review4Record.reviewTime;
        that.review.judgeRecord.reviewTime=!that.review.judgeRecord.reviewTime&&that.review.judgeRecord.reviewerId==userId&&that.disabled.judgeRecord==false?new Date():that.review.judgeRecord.reviewTime;
      }
      
    },
    
    getProductData(productId){//获取产品相关
      let that = this;
      that.$http.get('/basic/product/detail/'+productId).then(function(resp){
        that.application.productNo=resp.data.no;
        that.application.productName=resp.data.name;
        that.application.productSpec=resp.data.spec;
        that.other.productUnitName=resp.data.prodUnitName;
      })
    },
    addMember(id){//添加小组成员
      let that = this;
      let array=[];
      for(let i in that.application.memberList){
        array.push(that.application.memberList[i].memberId);
      }
      that.$http.get('/tenant/user/'+id).then(function(resp){
        let name=resp.data.name;

        if(array.indexOf(id)==-1){
          that.application.memberList.push({
            memberId:id,
            memberName:name
          });

        }else{
          that.$Notice.warning({title: i18n.t('pqc.memberExisted')});
        }
      })

    },
    deleteMember(index,part){//删除小组成员
      let that = this;
      part.splice(index, 1);
    },
    /* saveApplication(requestMethod){//试产申请保存和提交
      let that=this;
      //console.log('申请保存或提交')
      let state = true;
      let params = [
        {type:'Empty',title:'申请时间',value:that.application.applicationTime},
        {type:'Empty',title:'申请人',value:that.application.applicationUserId},
        {type:'Empty',title:'试产单号',value:that.application.trialProdNo},
        {type:'No',title:'试产单号',value:that.application.trialProdNo},
        {type:'No',title:'订单号',value:that.application.orderNo},
        {type:'Empty',title:'产品编号',value:that.application.productId},
        {type:'Empty',title:'试产线别',value:that.application.prodLineId},
        {type:'Empty',title:'计划试产时间',value:that.application.planTrialProdTime},
        {type:'Empty',title:'试产目的',value:that.application.trialProdObjective},
        {type:'Word600',title:'试产目的',value:that.application.trialProdObjective},
        {type:'Word600',title:'物料状况',value:that.application.materialCondition},
        {type:'EmptyLength',title:'通知人员',value:that.application.memberList},
        {type:'Empty',title:'指定审核人',value:that.application.applicationAuditorId},
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
      that.application.applicationTime=that.application.applicationTime?(new Date(that.application.applicationTime)).getTime():null;
      that.application.planTrialProdTime=that.application.planTrialProdTime?(new Date(that.application.planTrialProdTime)).getTime():null;
      that.application.applicationAuditTime=that.application.applicationAuditTime?(new Date(that.application.applicationAuditTime)).getTime():null;
      if(!that.trialProdId){
        that.$http.post('/examinecenter/pqc/trialProd/application?type='+requestMethod,that.application,that.headers).then(function(resp){
          if(requestMethod=='save'){
            //console.log(resp.data)
            that.$Message.success("添加成功！");
            that.closePage();
            //console.log(resp.data.trialProdId)
            that.trialProdId=resp.data.trialProdId;
            that.$emit("open-tab","qc-pqc-trialProd-edit-"+that.trialProdId,"修改试产管理-"+that.application.productName,"page-exam-pqc-trialProd-add",{trialProdId:that.trialProdId});
          }
          if(requestMethod=='submit'){
            that.$Message.success("提交成功！");
            that.closePage();
          }
          that.formatTime1()
        }).catch(function(){
          that.formatTime1()
        })
      }else{
        that.$http.put('/examinecenter/pqc/trialProd/application?type='+requestMethod,that.application,that.headers).then(function(resp){
          if(requestMethod=='save'){
            that.$Message.success("修改成功！");
          }
          if(requestMethod=='submit'){
            that.$Message.success("提交成功！");
            that.closePage();
          }
          that.formatTime1()
        }).catch(function(){
          that.formatTime1()
        })
      }
    }, */
    saveApplication(requestMethod){
      let that = this;
      let file = null;
      if(this.qualityRecordId == "productCheck"){
        file = that.$refs.upload.myUploadList
      }else if(this.qualityRecordId == "devickCheck"){
        file = that.$refs.upload1.myUploadList
      }else if(this.qualityRecordId == "otherInspection"){
        file = that.$refs.upload2.myUploadList
       }
      
      if(requestMethod=="submit"){//提交
      //console.log(file,'文件返回数据-------------')
      if(file&&file.length>0){
        let arr = []
        for(var i = 0;i<file.length;i++){
          let item = {
            'url':file[i].url,
            'qualityrecordExtInfoName':file[i].name,
            'qualityrecordExtInfoType':file[i].url.substring(file[i].url.lastIndexOf(".")+1,file[i].url.length),
          }
          arr.push(item)
        }
        if(this.qualityRecordId == "productCheck"){
          that.productCheck.pqcQualityRecordExtInfoDtos=arr;
        }else if(this.qualityRecordId == "devickCheck"){
          that.devickCheck.pqcQualityRecordExtInfoDtos=arr;
        }else if(this.qualityRecordId == "otherInspection"){
          that.otherInspection.pqcQualityRecordExtInfoDtos=arr;
        }
        that.spinShow=false;
      }
      let params = null;
        if(this.qualityRecordId == "productCheck"){
            this.productCheck.createTime = new Date(this.createTimesProductCheck).getTime()
            params = this.productCheck
            this.productCheck.qualityRecordId = that.qualityRecordID;
            if(!this.productCheck.productId){
              that.$Notice.warning({title:i18n.t("pqc.pnc")}); 
              return false;
              }else if(!this.productCheck.inspectorId) {
                that.$Notice.warning({title:i18n.t("pqc.tic")}); 
                return false; 
              }else if(!this.productCheck.createTime) {
                that.$Notice.warning({title:i18n.t("pqc.tcn")}); 
                return false; 
              }
          }else if(this.qualityRecordId == "devickCheck"){
            this.devickCheck.createTime = new Date(this.createTimesDevickCheck).getTime()
            params = this.devickCheck
            this.devickCheck.qualityRecordId = that.qualityRecordID;
            let state = true;
              let param = [
                {type:'No',title:i18n.t("pqc.en"),value:that.devickCheck.chkdevNo},
                {type:'Empty',title:i18n.t("pqc.deviceName"),value:that.devickCheck.chkdevName},
              ]
              for(let i in param){
                state = that.$iqis.utils.formValidate(param[i].type,param[i].title,param[i].value,(tips)=>{
                  that.$Notice.warning({title:tips})
                })
                if(!state){
                  return;
                  break;
                }
              }
            /* if(!this.devickCheck.prodLineId) {
                that.$Notice.warning({title:"生产线别不能为空！"});
                 return false;
              }else */ if(!this.devickCheck.inspectorId) {
                that.$Notice.warning({title:i18n.t("pqc.tic")}); 
                return false; 
              }else if(!this.devickCheck.createTime) {
                that.$Notice.warning({title:i18n.t("pqc.tcn")}); 
                return false; 
              }
              
          }else if(this.qualityRecordId == "otherInspection"){
            this.otherInspection.createTime = new Date(this.createTimesOtherInspection).getTime()
            params = this.otherInspection
            this.otherInspection.qualityRecordId = that.qualityRecordID;
            if(!this.otherInspection.inspectorId){
              that.$Notice.warning({title:i18n.t("pqc.tic")}); 
              return false;
              }else if(!this.otherInspection.createTime) {
                that.$Notice.warning({title:i18n.t("pqc.tcn")}); 
                return false;
              }
          }
        this.$http.post('/examinecenter/pqc/qualityrecord/applyaudit',params,this.headers).then(function(res){
          // //console.log(res.data,9900);
          
          that.$Message.success(i18n.t("pqc.cs"));
          that.closePage();
        })
      }else{//保存
        // that.save = true;
        if(this.qualityRecordID){//修改时的保存
        if(file&&file.length>0){
          let arr = []
          for(var i = 0;i<file.length;i++){
            let item = {
              'url':file[i].url,
              'qualityrecordExtInfoName':file[i].name,
              'qualityrecordExtInfoType':file[i].url.substring(file[i].url.lastIndexOf(".")+1,file[i].url.length),
            }
            arr.push(item)
          }
          if(this.qualityRecordId == "productCheck"){
            that.productCheck.pqcQualityRecordExtInfoDtos=arr;
          }else if(this.qualityRecordId == "devickCheck"){
            that.devickCheck.pqcQualityRecordExtInfoDtos=arr;
          }else if(this.qualityRecordId == "otherInspection"){
            that.otherInspection.pqcQualityRecordExtInfoDtos=arr;
          }
          that.spinShow=false;
        }
           let params = null;
        if(this.qualityRecordId == "productCheck"){
            this.productCheck.createTime = new Date(this.createTimesProductCheck).getTime()
            this.productCheck.tenantId = this.tenantId;
            this.productCheck.qualityRecordId = this.qualityRecordID;
            this.productCheck.state = this.state;
            params = this.productCheck
            if(!this.productCheck.productId){
              that.$Notice.warning({title:i18n.t("pqc.pnc")}); 
              return false;
              }else if(!this.productCheck.inspectorId) {
                that.$Notice.warning({title:i18n.t("pqc.tic")}); 
                return false; 
              }else if(!this.productCheck.createTime) {
                that.$Notice.warning({title:i18n.t("pqc.tcn")}); 
                return false; 
              }
          }else if(this.qualityRecordId == "devickCheck"){
            this.devickCheck.createTime = new Date(this.createTimesDevickCheck).getTime()
            this.devickCheck.tenantId = this.tenantId;
            this.devickCheck.qualityRecordId = this.qualityRecordID;
            this.devickCheck.state = this.state;
            params = this.devickCheck
            let state = true;
              let param = [
                {type:'No',title:i18n.t("pqc.en"),value:that.devickCheck.chkdevNo},
                {type:'Empty',title:i18n.t("pqc.deviceName"),value:that.devickCheck.chkdevName},
              ]
              for(let i in param){
                state = that.$iqis.utils.formValidate(param[i].type,param[i].title,param[i].value,(tips)=>{
                  that.$Notice.warning({title:tips})
                })
                if(!state){
                  return;
                  break;
                }
              }
            /* if(!this.devickCheck.prodLineId) {
                that.$Notice.warning({title:"生产线别不能为空！"});
                 return false;
              }else */ if(!this.devickCheck.inspectorId) {
                that.$Notice.warning({title:i18n.t("pqc.tic")}); 
                return false; 
              }else if(!this.devickCheck.createTime) {
                that.$Notice.warning({title:i18n.t("pqc.tcn")}); 
                return false; 
              }
          }else if(this.qualityRecordId == "otherInspection"){
            this.otherInspection.createTime = new Date(this.createTimesOtherInspection).getTime()
            this.otherInspection.tenantId = this.tenantId;
            this.otherInspection.qualityRecordId = this.qualityRecordID;
            this.otherInspection.state = this.state;
            params = this.otherInspection
             if(!this.otherInspection.inspectorId){
              that.$Notice.warning({title:i18n.t("pqc.tic")}); 
              return false;
              }else if(!this.devickCheck.createTime) {
                that.$Notice.warning({title:i18n.t("pqc.tcn")}); 
                return false;
              }
          }

          this.$http.put('/examinecenter/pqc/qualityrecord',params,this.headers).then(function(res){
            // alert(111)
            that.$Message.success(i18n.t("customer.saveSuccess"));
            that.refreshData();
          })
        }else{//新增时的保存
        // that.save = true;
        if(file&&file.length>0){
          let arr = []
          for(var i = 0;i<file.length;i++){
            let item = {
              'url':file[i].url,
              'qualityrecordExtInfoName':file[i].name,
              'qualityrecordExtInfoType':file[i].url.substring(file[i].url.lastIndexOf(".")+1,file[i].url.length),
            }
            arr.push(item)
          }
          if(this.qualityRecordId == "productCheck"){
            that.productCheck.pqcQualityRecordExtInfoDtos=arr;
           
          }else if(this.qualityRecordId == "devickCheck"){
            that.devickCheck.pqcQualityRecordExtInfoDtos=arr;
            
          }else if(this.qualityRecordId == "otherInspection"){
            that.otherInspection.pqcQualityRecordExtInfoDtos=arr;
          }
          that.spinShow=false;
        }
          let params = null;
        if(this.qualityRecordId == "productCheck"){
            this.productCheck.createTime = new Date(this.createTimesProductCheck).getTime()
            params = this.productCheck
            // alert(this.save)
             if(!this.productCheck.productId){
              that.$Notice.warning({title:i18n.t("pqc.pnc")}); 
              return false;
              }else if(!this.productCheck.inspectorId) {
                that.$Notice.warning({title:i18n.t("pqc.tic")}); 
                return false; 
              }else if(!this.productCheck.createTime) {
                that.$Notice.warning({title:i18n.t("pqc.tcn")}); 
                return false; 
              }
            this.save1 = true;
            this.save2 = true;
          }else if(this.qualityRecordId == "devickCheck"){
            this.devickCheck.createTime = new Date(this.createTimesDevickCheck).getTime()
            params = this.devickCheck
            let state = true;
              let param = [
                {type:'No',title:i18n.t("pqc.en"),value:that.devickCheck.chkdevNo},
                {type:'Empty',title:i18n.t("pqc.deviceName"),value:that.devickCheck.chkdevName},
              ]
              for(let i in param){
                state = that.$iqis.utils.formValidate(param[i].type,param[i].title,param[i].value,(tips)=>{
                  that.$Notice.warning({title:tips})
                })
                if(!state){
                  return;
                  break;
                }
              }
            this.save = true;
            this.save2 = true;
          }else if(this.qualityRecordId == "otherInspection"){
            this.otherInspection.createTime = new Date(this.createTimesOtherInspection).getTime()
            params = this.otherInspection
            if(!this.otherInspection.inspectorId){
              that.$Notice.warning({title:i18n.t("pqc.tic")}); 
              return false;
              }else if(!this.devickCheck.createTime) {
                that.$Notice.warning({title:i18n.t("pqc.tcn")}); 
                return false;
              }
            this.save = true;
            this.save1 = true;
          }
         that.$http.post('/examinecenter/pqc/qualityrecord',params,this.headers).then(function(res){
          //console.log(res.data,44444);
          // //console.log(that.$refs.productCheckName.query,555);
          that.$Message.success(i18n.t("customer.saveSuccess"));
          that.closePage()
          that.qualityRecordID = res.data.qualityRecordId;
          if(that.qualityRecordId == "productCheck"){
            //console.log(that.$refs.productCheckName,2222);
            that.$emit("open-tab","exam-pqc-qr-"+that.qualityRecordID,i18n.t("pqc.rqr")+"-"+that.productCheck.productName,"page-exam-pqc-qr-add",{qualityRecordId:that.qualityRecordID});
          }else if(that.qualityRecordId == "devickCheck"){
            that.$emit("open-tab","exam-pqc-qr-"+that.qualityRecordID,i18n.t("pqc.rqr")+"-"+that.devickCheck.chkdevName,"page-exam-pqc-qr-add",{qualityRecordId:that.qualityRecordID});
          }else if(that.qualityRecordId == "otherInspection"){
            that.$emit("open-tab","exam-pqc-qr-"+that.qualityRecordID,i18n.t("pqc.rqr")+"-","page-exam-pqc-qr-add",{qualityRecordId:that.qualityRecordID});
          }
         })
        }
      }
      
    },
    formatTime1(){
      let that = this;
      that.application.applicationTime=that.application.applicationTime?new Date(that.application.applicationTime):null;
      that.application.planTrialProdTime=that.application.planTrialProdTime?new Date(that.application.planTrialProdTime):null;
      that.application.applicationAuditTime=that.application.applicationAuditTime?new Date(that.application.applicationAuditTime):null;
    },
    auditApplication(requestMethod){//审核通过/审核驳回
      let that =this;
      //console.log(requestMethod)
      that.$http.put('/examinecenter/pqc/trialProd/application/checked?trialProdId='+that.trialProdId+'&checked='+requestMethod).then(function(resp){
        if(requestMethod==1){
          that.$Message.success(i18n.t("pqc.sat"))
        }else{
          that.$Message.success(i18n.t("pqc.sr"))
        }
        that.closePage();
      })
    },
    saveTrialProd(requestMethod){//试产记录的保存和提交
      let that=this;
      if(requestMethod=='submit'){
        let state = true;
        let params = [
          {type:'Empty',title:i18n.t("pqc.at"),value:that.record.actualTrialProdTime},
          {type:'Empty',title:i18n.t("pqc.qotp"),value:that.record.trialProdQuantity},
          {type:'NumNot0',title:i18n.t("pqc.qotp"),value:that.record.trialProdQuantity},
          {type:'Empty',title:i18n.t("pqc.badQuantity"),value:that.record.badQuantity},
          {type:'Num',title:i18n.t("pqc.badQuantity"),value:that.record.badQuantity},
          {type:'Num',title:i18n.t("pqc.badQuantity"),value:that.record.badQuantity},
          {type:'Empty',title:i18n.t("pqc.reviewTeam"),value:that.record.reviewProcessId},
          // {type:'Empty',title:'试产说明',value:that.record.trialProdCaption},
          {type:'Word600',title:i18n.t("pqc.explain"),value:that.record.trialProdCaption},
          {type:'Empty',title:i18n.t('pqc.aa'),value:that.record.recordAuditorId},
          {type:'Empty',title:i18n.t("pqc.recorder"),value:that.record.recordUserId},
          {type:'Empty',title:i18n.t("pqc.ret"),value:that.record.recordTime},
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
        for(let i=0;i<that.defectRecords.table.data.length;i++){
          if(that.defectRecords.table.data[i].inspectionTypeId==''||that.defectRecords.table.data[i].defectTypeId==''|| that.defectRecords.table.data[i].sampleQuantity===''|| that.defectRecords.table.data[i].badQuantity===''){
              that.$Notice.warning({title: i18n.t('pqc.qtxd')+(i+1)+i18n.t("pqc.tqxj")});
              return;
          }
          let paramsDefects = [
            {type: 'NumNot0', title:i18n.t("pqc.sampleQuantity"), value: that.defectRecords.table.data[i].sampleQuantity},
            {type: 'Num', title: i18n.t("pqc.dn"), value: that.defectRecords.table.data[i].badQuantity},
          ]
          let state = true;
          for (let j in paramsDefects) {
            state = that.$iqis.utils.formValidate(paramsDefects[j].type, paramsDefects[j].title, paramsDefects[j].value, (tips) => {
              that.$Notice.warning({title: tips})//,duration: 0
            })
            if (!state) {
              return;
              break;
            }
          }
        }
      }
      that.record.badRate=that.badRate;
      that.record.actualTrialProdTime=that.record.actualTrialProdTime?(new Date(that.record.actualTrialProdTime)).getTime():null;
      that.record.recordAuditTime=that.record.recordAuditTime?(new Date(that.record.recordAuditTime)).getTime():null;
      that.record.recordTime=that.record.recordTime?(new Date(that.record.recordTime)).getTime():null;
      that.record.recordList=that.defectRecords.table.data;
      
      //console.log(that.record,'试产记录数据')
      that.$http.put('/examinecenter/pqc/trialProd/record?type='+requestMethod,that.record,that.headers).then(function(resp){
        if(requestMethod=='save'){
          that.$Message.success(i18n.t("pqc.ats"));
        }
        else{
          that.$Message.success(i18n.t("pqc.cs"));
          that.closePage();
        }
        that.formatTime2()
      }).catch(function(){
        that.formatTime2()
      })
    },
    formatTime2(){
      let that = this;
      that.record.actualTrialProdTime=that.record.actualTrialProdTime?new Date(that.record.actualTrialProdTime):null;
      that.record.recordAuditTime=that.record.recordAuditTime?new Date(that.record.recordAuditTime):null;
      that.record.recordTime=that.record.recordTime?new Date(that.record.recordTime):null;
    },
    auditRecord(requestMethod){
      let that =this;
      //console.log(requestMethod)
      that.$http.put('/examinecenter/pqc/trialProd/record/checked?trialProdId='+that.trialProdId+'&checked='+requestMethod).then(function(resp){
        if(requestMethod==1){
          that.$Message.success(i18n.t("pqc.sat"))
        }else{
          that.$Message.success(i18n.t("pqc.sr"))
        }
        that.closePage();
      })
      
    },
    submitReview(){
      let that = this;
      let state = true;
      let params = [
      ]
      if(that.disabled.auditorRecord==false){
        params.push(
          {type:'Empty',title:i18n.t("pqc.treatmentMethod"),value:that.review.auditorRecord.treatmentType},
          {type:'Word600',title:i18n.t("pqc.ao"),value:that.review.auditorRecord.opinion},
        )
      }
      if(that.disabled.review1Record==false){
        params.push(
          {type:'Empty',title:i18n.t("pqc.treatmentMethod"),value:that.review.review1Record.treatmentType},
          {type:'Word600',title:i18n.t("pqc.reviewOpinion"),value:that.review.review1Record.opinion},
        )
      }
      if(that.disabled.review2Record==false){
        params.push(
          {type:'Empty',title:i18n.t("pqc.treatmentMethod"),value:that.review.review2Record.treatmentType},
          {type:'Word600',title:i18n.t("pqc.reviewOpinion"),value:that.review.review2Record.opinion},
        )
      }
      if(that.disabled.review3Record==false){
        params.push(
          {type:'Empty',title:i18n.t("pqc.treatmentMethod"),value:that.review.review3Record.treatmentType},
          {type:'Word600',title:i18n.t("pqc.reviewOpinion"),value:that.review.review3Record.opinion},
        )
      }
      if(that.disabled.review4Record==false){
        params.push(
          {type:'Empty',title:i18n.t("pqc.treatmentMethod"),value:that.review.review4Record.treatmentType},
          {type:'Word600',title:i18n.t("pqc.reviewOpinion"),value:that.review.review4Record.opinion},
        )
      }
      if(that.disabled.judgeRecord==false){
        params.push(
          {type:'Empty',title:i18n.t("pqc.treatmentMethod"),value:that.review.judgeRecord.treatmentType},
          {type:'Word600',title:i18n.t("pqc.judgeOpinion"),value:that.review.judgeRecord.opinion},
        )
      }
      for(let i in params){
        state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
          that.$Notice.warning({title:tips})
        })
        if(!state){
          return;
          break;
        }
      }
      

      that.review.auditorRecord.reviewTime=that.review.auditorRecord.reviewTime?new Date(that.review.auditorRecord.reviewTime):null;
      that.review.review1Record.reviewTime=that.review.review1Record.reviewTime?new Date(that.review.review1Record.reviewTime):null;
      that.review.review2Record.reviewTime=that.review.review2Record.reviewTime?new Date(that.review.review2Record.reviewTime):null;
      that.review.review3Record.reviewTime=that.review.review3Record.reviewTime?new Date(that.review.review3Record.reviewTime):null;
      that.review.review4Record.reviewTime=that.review.review4Record.reviewTime?new Date(that.review.review4Record.reviewTime):null;
      that.review.judgeRecord.reviewTime=that.review.judgeRecord.reviewTime?new Date(that.review.judgeRecord.reviewTime):null;
      //console.log(that.review,'提交评审')
      that.$http.put('/examinecenter/pqc/trialProd/reviewrecord',that.review,that.headers).then(function(resp){
        that.$Message.success(i18n.t("pqc.cs"))   
        if(that.application.trialProdState=='TRIALPRODAUDITPASS'){
          that.closePage()
        }
      })
    },
    
    // 缺陷部分-----------------------------------------------------
    getDefectData(){//获取缺陷记录
      let that=this;
      that.getDefectTypeData();
      that.getInspectiontype();
      that.getDefectGradeData();
      that.getDefectPositionData();

      that.defectRecords.table.loading=false;
    },
    getDefectTypeData(){//获取缺陷数据
      let that=this;
      let idValueMap = [];
      let url="/basic/defecttype?page=1&limit=9999"
      that.$http.get(url).then((res)=>{
        let urlProduct=res.data;
        that.defectRecords.prodBatch.DefectName=res.data;
      })
    },
    onDefectTypeSelectChange(obj,index){
      let that=this;
      for(let x in that.defectRecords.prodBatch.DefectName){
        if(obj==that.defectRecords.prodBatch.DefectName[x].defectTypeId){
          that.defectRecords.table.data[index].inspectionTypeId=that.defectRecords.prodBatch.DefectName[x].inspectionTypeId;//检验项目
          that.defectRecords.table.data[index].inspectionTypeName=that.defectRecords.prodBatch.DefectName[x].inspectionTypeName;//检验项目
          that.defectRecords.table.data[index].qltyLvId=that.defectRecords.prodBatch.DefectName[x].qltyLvId;//缺陷等级
        }
      }
    },
    getInspectiontype(){//获取检验项目下拉框
      let that=this;
      let resp = that.$iqis.utils.syncget('/basic/inspectiontype?page=1&limit=99999');
      // that.$http.get("/basic/inspectiontype",{params:{limit:99999999}}).then(function(resp){
      let root = {title:i18n.t("pqc.projectType"),selected: false,label:i18n.t("pqc.projectType"),value:0,expand:true};
      that.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
      that.selects.inspectionTypes = [root];
      // //console.log(that.selects.inspectionTypes,'检验项目数据')
      // })
    },
    getDefectNameList(val,key,index,o){//获取当前检验项目下的缺陷名称列表
      //console.log(val,key,index,o,'------------------------')
      if(o == null || Object.keys(o).length == 0){
        return;
      }
      //console.log('获取缺陷名称列表的参数',val,key,index,o);
      let that = this;
      this.defectRecords.table.data = this.defectRecords.table.data ||[];
      let newRow = this.defectRecords.table.data[index];
      if(!newRow && this.defectRecords.table.data[index]){
        newRow =  JSON.parse(JSON.stringify(this.defectRecords.table.data[index]));
      }
      if(!newRow){return;}
      newRow[key] = val;
      newRow['inspectionTypeName'] = o.name;
      newRow['inspectionTypeId'] = o.inspectionTypeId;
      newRow['chkDevTypeId'] = o.chkDevTypeId;
      newRow['chkDevTypeName'] = o.chkDevTypeName;

      let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+o.inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
      newRow['defectTypeList'] = resp ? resp.data||[]:[];
      that.defectRecords.table.data[index] = newRow;
      that.$set(that.defectRecords.table.data, index, newRow);
      return;
    },
    getDefectGradeData(Lvid,index){//缺陷等级
      let that=this;
      let idValueMap = [];
      let url="/basic/qltylv?page=1&limit=99999"
      that.$http.get(url).then((res)=>{
        let urlProduct=res.data
        that.defectRecords.prodBatch.DefectGrade=urlProduct;
        for(let x in that.defectRecords.prodBatch.DefectGrade){
          if(Lvid==that.defectRecords.prodBatch.DefectGrade[x].qltyLvId){
            that.defectRecords.table.data[index].qltyLvName=that.defectRecords.prodBatch.DefectGrade[x].name;
          }
        }
      })
    },
    getDefectPositionData(){//缺陷位置
      let that=this;
      let url="/basic/defectloc?page=1&limit=99999"
      that.$http.get(url).then((res)=>{
        that.defectRecords.prodBatch.DefectPosition=res.data
        // that.defectRecords.prodBatch.DefectPosition.unshift({defectLocId:'无',name:'无'});
        that.$set(that.defectRecords.prodBatch.DefectPosition,0,{defectLocId:null,name:i18n.t("pqc.nothing")});

      })
    },
    
    defectRate(obj1,obj2,index){
      let that=this;
      if(obj1!==''&&obj2!==''){
        let x=obj1/obj2*100;
        if(x > 100){
          x = 100
          that.defectRecords.table.data[index].defectRate=x+'%';
        }
        x = Math.floor(x*100)/100;
        that.defectRecords.table.data[index].defectRate=x+'%';
      }
    },
    addDefect(){//添加缺陷
      let that=this;
      let obj = JSON.parse(JSON.stringify(that.defectRecords.discountData.tableData))
      that.defectRecords.table.data.push(obj)
      let index=that.defectRecords.table.data.length
      that.defectRecords.table.data[index-1].defectNumber=index-1
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((index-5)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');

      })
    },
    /* deleteDefect(){//删除缺陷
      let that = this;
      let ss = this.$refs.defectTable.getSelection();
      for(let i=0;i<that.defectRecords.table.data.length;i++){
        for(let j=0;j<ss.length;j++){
          if(that.defectRecords.table.data[i].defectNumber===ss[j].defectNumber){
              that.defectRecords.table.data.splice(i,1)
          }
        }
      }
    }, */
    /* getTableLength(){
      let that = this;
      let ss = this.$refs.defectTable.getSelection();
      that.TableLength=ss.length;
    }, */
    closePage(){
      this.$emit("close-tab",this.$props.tabKey);
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
.applicationList{
  padding:24px;
  background:#FAFAFA;
  margin-top:15px;
}
.applicationList p{
  padding:0;
  margin-top:14px;
  font-size: 14px;
  color: #262626;
}
.applicationList p:first-child{
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

.imgUpload{
  border: 1px solid #E9E9E9;
  padding: 10px;
}
.iqis-page-img-title{
  border-bottom: 1px solid #E9E9E9;
  margin-top: 20px;
}
</style>