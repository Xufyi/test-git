<template>
  <div class="iqis-page">
    <div class="iqis-page-block-title">{{$t("pqc.basicInformation")}}</div>
    <div class="iqis-page-block">

      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="24">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.time")}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :disabled="prodBatch.PutOrPost=='put'" :clearable="false" v-model="ruleForm.createTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>

              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.inspector")}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :disabled="prodBatch.PutOrPost=='put'" :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.createUserId" filterable> <!-- @on-change="getName(basic.customerId)" -->
                  <Option v-for="data in inspectorList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.sn")}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input v-model="ruleForm.sampleQuantity" disabled></i-input>
              </div>
            </i-col>
        </Row>
        <Row type="flex" :gutter="24">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.pn")}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :disabled="prodBatch.PutOrPost=='put'" :label="ruleForm.productNo" remote :remote-method="remoteMethod" :loading="loadingRemote"  v-model="ruleForm.productId" filterable :placeholder="i18n.t('pleaseChoose')" @on-change="changeProductId(ruleForm.productId,3)">
                    <Option v-for="(items,index) in productList" :value="items.productId" :label="items.no" :key="index">{{ items.no}}/{{ items.name }}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.name")}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input v-model="ruleForm.productName" disabled></i-input>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.specifications")}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input v-model="ruleForm.spec" disabled></i-input>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.cf")}}</div>
              <div class="iqis-page-block-ctrl">
                <Select v-model="ruleForm.inspectionRecordTypeId" filterable :placeholder="i18n.t('pleaseChoose')">
                    <Option v-for="(items,index) in prodBatch.category" :value="items.inspectionRecordTypeId"  :key="index">{{items.inspectionRecordTypeName}}</Option>
                </Select>
              </div>
            </i-col>
        </Row>
        <Row type="flex" :gutter="24">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.templateID')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :disabled="prodBatch.PutOrPost=='put'" v-model="ruleForm.inspectionTemplateId" filterable :placeholder="i18n.t('pleaseChoose')" @on-change="changeTemplateId(ruleForm.inspectionTemplateId)">
                    <Option v-for="(items,index) in prodBatch.num" :value="items.templateId"  :key="index">{{items.templateNumber}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.templateName")}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input v-model="ruleForm.templateName" disabled></i-input>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.pl')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :disabled="prodBatch.PutOrPost=='put'" v-model="ruleForm.productLineId" filterable :placeholder="i18n.t('pleaseChoose')">
                    <Option v-for="(items,index) in prodBatch.LineData" :value="items.prodLineId"  :key="index">{{items.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.department')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :disabled="prodBatch.PutOrPost=='put'" v-model="ruleForm.departmentId" filterable :placeholder="i18n.t('pleaseChoose')">
                    <Option v-for="(items,index) in prodBatch.department" :value="items.departmentId"  :key="index">{{items.departmentName}}</Option>
                </Select>
              </div>
            </i-col>
        </Row>
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-title">{{$t('pqc.InspectionRecordSheet')}}</div>
          </div>
          <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
            <Checkbox v-model="showNow"></Checkbox>
            <Button type="primary" @click="changeShowNow()">
                <span v-if="showNow">{{$t("pqc.ShowFullList")}}</span>
                <span v-else>{{$t("pqc.DisplayInspectionPeriod")}}</span>
            </Button>
          </div>
        </div>
        
        <div class="iqis-page-block-table">
          <Table class="recordTable noBorder" :no-data-text="i18n.t('pqc.noData')" ref="paramTable"  id='styleTable' border stripe 
                 :columns="recordColumns" v-drag-table-column="recordColumns" :data="recordTable" >
          </Table>
        </div>
        <div>
          <Checkbox v-model="ruleForm.paramState" :true-value=0 :false-value=1>{{$t('pqc.StartParameterRecord')}}</Checkbox>
        </div>
        <div class="iqis-page-block" v-if="ruleForm.paramState===0">
          <div class="iqis-page-block-title">
            <div class="iqis-page-block-tools">
              <div class="iqis-page-block-tools-primary">{{$t("pqc.paramsRecord")}}</div>
                <div class="iqis-page-block-tools-second">
                <Poptip confirm
                :title="i18n.t('pqc.dsi')"
                :ok-text='i18n.t("pqc.confirm")'
                :cancel-text='i18n.t("pqc.cancel")'
                placement="bottom-end"
                @on-ok="deleteTableSelected">
                <Button type="ghost" icon="trash-a" :disabled="noPermsDis">{{$t("pqc.delete")}}</Button>
                </Poptip>
              </div>
            </div>
          </div>
          <div class="iqis-page-block-body">
            <div class="iqis-page-block-tools">
              <div class="iqis-page-block-tools-primary">
                <div class="iqis-page-block-label">{{$t("pqc.paramsTable")}}</div>
              </div>
              <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
              </div>
            </div>
            <div class="iqis-page-block-table">
              <!-- <Table :no-data-text="i18n.t('pqc.noData')" ref="paramTable" class="iqis-inline-editor-table noHeight noBorder" id='styleTable'  @on-selection-change="paramTableSelectChange" border stripe -->
              <Table :no-data-text="i18n.t('pqc.noData')" ref="paramTable2" class="noBorder" border stripe
                     v-drag-table-column="paramsColumns" :columns="paramsColumns" :data="paramsData" >
              </Table>
            </div>
          </div>
        </div>
        <IqisAffix placement="bottom" :offset="0">
        <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
            <Button type="primary"  @click="confirm" >{{$t('pqc.save')}}</Button>
            <Button type="ghost" @click="closePage">{{$t("pqc.cancel")}}</Button>
        </div>
        </IqisAffix>
        <div class="page-end" style="padding-bottom: 65px"></div>
      </div><!--end body-->
    </div>
  </div>
</template>
<script>
  import ICol from "iview/src/components/grid/col";
  import InspectionPeriod from '../../../components/inspectionPeriod/InspectionPeriod.vue'
  import NestedTables from '../../../components/nestedTables/NestedTabels.vue'
  import $ from 'jquery'
  export default {
    components: {ICol,InspectionPeriod,NestedTables},
    props:["params","tabKey"],
    data(){
      let vm = this;
      return {
        paramValuearray:[],
        showNow:false,
        i18n:window.i18n,
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        prodBatch:{
          PutOrPost:'post',
          department:[],
          LineData:[],
          category:[],
          num:[],
        },
        ruleForm:{
            inspectionRecordId:"",
            inspectionRecordTypeId: "",
            inspectionTemplateId: 0,
            paramState: 1,//是否启用参数记录,默认不开启为1
            productLineId: 0,
            productName: "",
            productNo: "",
            spec: "",
            state: 0,//状态
            templateNumber: "",
            departmentId:"",
            templateName:"",
            inspectionRecordId:'',
            productId:'',
            createTime:new Date(),
            createUserId:""
        },
        recordTable:[],
        recordColumns:[
           {
            //  title:"序号",
             title:i18n.t("pqc.no"),
             width:40,
             minWidth:40,
             maxWidth:40,
             align:"center",
             render: this.$iqis.utils.tableHelper.buildIndexColumnRender(this),
           },
           {
            //  title:"项目",
             title:i18n.t('pqc.project'),
             width:80,
             minWidth:80,
             key:"item"
           },
          //  {
          //    title:i18n.t("pqc.Subproject"),
          //    width:80,
          //    minWidth:80,
          //    key:"subItem"
          //  },
           {
            //  title:"检验标准",
             title:i18n.t("pqc.InspectionStandards"),
             width:350,
             minWidth:350,
             key:"inspectionStandard"
           },
           {
            //  title:"检验结果",
             title:i18n.t("pqc.testResult"),
             minWidth:100,
             key:"inspectionResult",
             render:(h,params)=>{
              //  debugger
               if(params.row.result<3){
                  let label1 = ''
                  let label0 = ''
                if(params.row.result==0){
                  label1='OK';label0='NG'
                }else if(params.row.result==1){
                  label1=i18n.t('pqc.yes');label0=i18n.t("pqc.no")
                }else if(params.row.result==2){
                  label1=i18n.t('pqc.have');label0=i18n.t('pqc.notHave')
                }
                return h("Select",{
                  props: {
                    value:this.recordTable[params.index].inspectionResult?Number(this.recordTable[params.index].inspectionResult):''
                  },
                  on: {
                    "on-change": event => {
                      this.recordTable[params.index].inspectionResult =event;
                    }
                  }
                },[
                  h("Option",{
                    props:{
                      value:1,
                    }
                  },label1),
                  h("Option",{
                    props:{
                      value:0,
                    }
                  },label0)
                ])
               }else{
                  return h("div", [
                      h("Input", {
                          props: {
                              type: "text",
                              placeholder:i18n.t("pqc.pleaseEnter"),
                              value:this.recordTable[params.index].inspectionResult
                          },
                          on: {
                              "on-blur": event => {
                                  this.recordTable[params.index].inspectionResult =event.target.value;
                              }
                          }
                      })
                  ]);
               }
               
             }
           },
           {
                title: "Sl",
                key:"sl",
                minWidth:50,

            },
            {
                title: i18n.t('product.positiveTolerance'),
                key:"positiveTolerance",
                minWidth:50,

            },
            {
                title:  i18n.t('product.negativeTolerance'),
                key:"negativeTolerance",
                minWidth:50,

            },
            {
                title: "USL",
                key:"usl",
                minWidth:50,

            },
            {
                title: "LSL",
                key:"lsl",
                minWidth:50,

            },
           {
             title:i18n.t('pqc.unit'),
             minWidth:50,
             key:"unitSymbol"
           },
          //  {
          //    title:i18n.t("pqc.sn"),
          //    minWidth:110,
          //    key:"sampleQuantity",
          //  },

        ],
        sampleQuantity:"",
        currentTimeName:"",//当前检验时段
        timeIntervalArray:[],//所有检验时段的表头
        oldTimeData:[],//储存所有检验时段的数据
        paramsData:[],
        paramsColumns: [
          {
              type:"selection",
              width:40,
              minWidth:40,
              maxWidth:40,
              align: 'center',
              
          },
          {
            title: i18n.t("pqc.no"),
            render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
            align: "center",
            width: 60,
            maxWidth: 80
          },
          {
            title: i18n.t("pqc.pps"),
            minWidth:this.$store.state.locale=='zh_CN'?110:160,
            align: "center",
            ellipsis: true,
            //required:true,
            key: "prodProcessName",
          },
          {
            title: i18n.t("pqc.inspection"),
            align: "center",
            minWidth:this.$store.state.locale=='zh_CN'?70:70,
            ellipsis: true,
            //required:true,
            key: "inspectionTypeName",
            render: (h, params) => {
              let _this = this;
              let texts = "";
              //console.log(params)
              texts = params.row.inspectionTypeName;
              return h(
                "div",
                {
                  props: {}
                },
                texts
              );
            }
          },
          {
            title: i18n.t("pqc.unitSymbol"),
            align: "center",
            minWidth:this.$store.state.locale=='zh_CN'?60:80,
            ellipsis: true,
            key: "unitSymbol",
            render:(h,params)=>{
              if(!params.row.unitSymbol){
                return h('div',i18n.t('Unlimited'))
              }else{
                return h('div',params.row.unitSymbol)
              }
            }
          },
          {
            // title: '检验设备',
            title: i18n.t("pqc.TestingEquipment"),
            align: "center",
            width:130,
            minWidth:this.$store.state.locale=='zh_CN'?80:120,
            ellipsis: true,
            //required:true,
            key: "chkDevId",
            render: (h, params) => {
              let _this = this;
              return h('Select', {
                  props:{
                      value: this.paramsData[params.index].chkDevId,
                      placeholder:i18n.t("Unlimited")
                  },
                  on: {
                      'on-change':(event) => {
                          this.paramsData[params.index].chkDevId = event;
                      }
                  },
                },
                params.row.chkDevList.map(function(type){// chdDevTypeList原带出检验设备列表
                  return h('Option', {
                        props: {value:type.chkDevId,label:type.name}
                  }, type);
                })
              );
            }
          },
          {
            title: "USL",
            minWidth:this.$store.state.locale=='zh_CN'?30:40,
            align: "center",
            ellipsis: true,
            key: "usl",
            render: (h, params) => {
              let _this = this;
              let texts = "";
              texts = params.row.usl;
              return h(
                "div",
                {
                  props: {}
                },
                texts
              );
            }
          },
          {
            title: "SL",
            minWidth:this.$store.state.locale=='zh_CN'?30:40,
            align: "center",
            ellipsis: true,
            key: "sl",
            render: (h, params) => {
              let _this = this;
              let texts = "";
              texts = params.row.sl;
              return h(
                "div",
                {
                  props: {}
                },
                texts
              );
            }
          },
          {
            title: "LSL",
            align: "center",
            minWidth:this.$store.state.locale=='zh_CN'?30:40,
            ellipsis: true,
            key: "lsl",
            render: (h, params) => {
              let _this = this;
              let texts = "";
              texts = params.row.lsl;
              return h(
                "div",
                {
                  props: {}
                },
                texts
              );
            }
          },
          {
            title: i18n.t("pqc.sn"),
            // title: "样本数",
            align: "center",
            minWidth:120,
            ellipsis: true,
            key: "sampleQuantity",
            render: (h, params) => {
                return h("div", [
                    h("Input", {
                        props: {
                            type: "text",
                            value:this.paramsData[params.index].sampleQuantity
                        },
                        on: {
                            "on-blur": event => {
                                this.paramsData[params.index].sampleQuantity =event.target.value;
                            }
                        }
                    })
                ]);
            }
          },
            {
                // title:'记录',
                title:i18n.t("pqc.record"),
                align:"center",
                // ellipsis:true,
                // key: 'paramId',
                key:'qqq',
                minWidth:700,
                render:(h,params) => {
                  // console.log(this.paramsData,9);
                  // let paramsList = params
                  return h(NestedTables,{
                    props:{
                      // sampleNum:this.sampleNum,
                      index:'pqcinstab'+params.index,
                      // paramsindex:this.paramsIndex,
                      expand:this.paramsData[params.index].expand,
                      paramsInfo:this.paramsData[params.index],
                      sampleNum:params.row.sampleQuantity || 10,
                      paramValuearray:this.paramValuearray[params.index],
                      // isdisabled:this.inputDisbale||this.noPermsDis
                    },
                    on:{
                      paramvalue:(data) => {
                        
                        this.paramValuearray[params.index] = data//这是接受子组件传入的数据
                        console.log(this.paramValuearray,"data");
                      }
                    }
                  })
                }
              },
              {
                // title:"操作",
                title:i18n.t("pqc.operation"),
                minWidth: 60,
                align: 'center',
                key:"xxx",
                render: (h, params) => {
                  return h('div', [
                    h('Button', {
                        props: {
                            type: 'text',
                            size: 'small'
                        },
                        style: {
                          color:'rgb(65, 143, 238)',
                          marginRight: '-5px'
                        },
                        on: {
                          click: (event) => {
                            this.paramsData[params.index].expand = !this.paramsData[params.index].expand
                          }
                        }
                    },this.paramsData[params.index].expand? i18n.t('pqc.Collapse') : i18n.t('pqc.Expand')),
                  ]);
                },
              },
        ],
        permsCur:[
          "UPDATE_INSPECTION  _RECORD",
          "INSERT_INSPECTION_RECORD"
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "UPDATE_INSPECTION_RECORD":false,
          "INSERT_INSPECTION_RECORD":false,
        },
        noPermsDis:true,
        loadingRemote:false,
        source:null,
        productList:[],
        changeProductFlag:false,
        changeTemplateFlag:false,
        newData:[],
        oldData:[],
        inspectorList:[]
      }
    },
   created(){
      let that=this;
      var myDate = new Date().getHours()
      this.$http.get('/basic/prodline?page=1&limit=99999').then(resp=>{
        that.prodBatch.LineData = resp.data;
      })
      this.$http.get('/inspectionRecordType').then(resp=>{
        that.prodBatch.category=resp.data
      })
      this.$http.get('/inspectionTemplate').then(resp=>{
        that.prodBatch.num=resp.data
      })
      this.$http.get('/systemManage/allDepartment').then(resp=>{
        that.prodBatch.department=resp.data
      })
      this.$http.get("/tenant/user",{params:{limit:999999999}}).then(resp=>{
        that.inspectorList = resp.data
      })
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      let inspectionRecordId = this.$props.params && this.$props.params.inspectionRecordId;
      if(inspectionRecordId){
        that.refreshData(inspectionRecordId)
        that.prodBatch.PutOrPost='put'
      }else{
       that.prodBatch.PutOrPost='post';
       this.$http.get('/tenant/user/profile').then(function(resp){
          that.ruleForm.createUserId=resp.data.userId;
        })
      }
      if((this.prodBatch.PutOrPost=='post'&&this.permsBtn.INSERT_INSPECTION_RECORD)||(this.prodBatch.PutOrPost=='put'&&this.permsBtn.UPDATE_INSPECTION_RECORD)){
        this.noPermsDis=false;
      }else{
        this.noPermsDis=true;
      }
   },
   mounted () {
    if(this.$props.params && this.$props.params.inspectionRecordTypeId){
      this.ruleForm.inspectionRecordTypeId = this.$props.params.inspectionRecordTypeId
    }
   },
    methods:{
      changeShowNow(){  
        let that = this;
        that.showNow = !that.showNow//改变显示方式，改变后true为显示当前时段，false为显示完整列表
        that.oldTimeData = JSON.parse(JSON.stringify(that.recordTable))
        let inputs = new Array(that.ruleForm.sampleQuantity)
        inputs.fill('')
        if(that.showNow){//显示检验时段
          let m = Number((new Date().getHours()).toString())>9?(new Date().getHours()).toString():0+(new Date().getHours()).toString()
          let s = Number((new Date().getMinutes()).toString())>9?(new Date().getMinutes()).toString():0+(new Date().getMinutes()).toString()
          let now = Number(m+s)//当前分秒
          
          // 提出当前列
          that.recordColumns.splice(11)
          for(let i in that.timeIntervalArray){
            let start = Number(that.timeIntervalArray[i].split('~')[0].replace(":",""))
            let end = Number(that.timeIntervalArray[i].split('~')[1].replace(":",""))
            if(start<now&&now<=end){//比较得出当前时段
              let currentTimeName = that.timeIntervalArray[i]
              that.currentTimeName = currentTimeName
              that.recordColumns.push({
                title: currentTimeName,
                key:currentTimeName,
                minWidth:100,
                render: (h, params) => {
                  return h("div", [
                    inputs.map(function(item,index,data){
                      return h("Input", {
                          props: {
                              type: "text",
                              value:that.recordTable[params.index][currentTimeName][index]
                          },
                          style:{
                            width:100/that.ruleForm.sampleQuantity+'%',
                            background:that.backgroundColor(that.recordTable[params.index][currentTimeName][index],params.row.usl,params.row.lsl)
                          },
                          on: {
                              "on-blur": event => {
                                console.log(event,'event');
                                  that.recordTable[params.index][currentTimeName][index] =event.target.value;
                                  $(event.target).parent('.ivu-input-wrapper.ivu-input-type').css('background',that.backgroundColor(that.recordTable[params.index][currentTimeName][index],params.row.usl,params.row.lsl,event.target))

                              }
                          }
                      })
                    })
                  ])
                }
              })
              break;
            }
          }

        }else{//显示完整列表
          // 渲染列
          that.recordColumns.splice(11)
          for(let i in that.timeIntervalArray){
            that.recordColumns.push({
              title: that.timeIntervalArray[i],
              key:that.timeIntervalArray[i],
              minWidth:100,
              render: (h, params) => {
                  return h("div", [
                    inputs.map(function(item,index,data){
                      return h("Input", {
                          props: {
                              type: "text",
                              value:that.recordTable[params.index][that.timeIntervalArray[i]][index]
                          },
                          style:{
                            width:100/that.ruleForm.sampleQuantity+'%',
                            background:that.backgroundColor(that.recordTable[params.index][that.timeIntervalArray[i]][index],params.row.usl,params.row.lsl)
                          },
                          on: {
                              "on-blur": event => {
                                console.log(event,'event');
                                  that.recordTable[params.index][that.timeIntervalArray[i]][index] =event.target.value;
                                  $(event.target).parent('.ivu-input-wrapper.ivu-input-type').css('background',that.backgroundColor(that.recordTable[params.index][that.timeIntervalArray[i]][index],params.row.usl,params.row.lsl,event.target))
                              }
                          }
                      })
                    })
                  ])
              }
            })
          }
          let recordTable = that.oldTimeData//拿到上一次完整列的数据
          for(let i in that.recordTable){//拿到当前检验时段的数据
            recordTable[i][that.currentTimeName] = that.recordTable[i][that.currentTimeName]//插入当前时间到完整列
          }
          that.recordTable = recordTable
        }
      },
      backgroundColor(val,usl,lsl,target){
        // console.log('val=>',val);
        // console.log('usl=>',usl);
        // console.log('lsl=>',lsl);
        let isNum = /^[0-9]\d*\,\d*|[0-9]\d*$/.test(val)
        if(val&&(!isNum||isNaN(val)||val<0||val>1000000000)){
          this.$Notice.warning({title:"记录只能为大于0且小于1000000000的数字"})
          $(target).focus().select()
          return;
        }
        if(val&&(Number(val)>Number(usl)||Number(val)<Number(lsl))){
          return 'red'
        }else{
          return 'transparent'
        }
      },
      deleteTableSelected() {
          let that = this;
          let ss = this.$refs.paramTable2.getSelection();
          for (let i = 0; i < that.paramsData.length; i++) {
              for (let j = 0; j < ss.length; j++) {
                  if (that.paramsData[i].dataNumber === ss[j].dataNumber) {
                      that.paramsData.splice(i, 1);
                  }
              }
          }
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
    //数据初始请求
    refreshData(obj){
      let that=this;
      that.changeProductFlag=true;
      that.changeTemplateFlag=true;
      let idValueMap = [];
      // let url="/examinecenter/pqc/inspectrecord/";
      let url = "/inspectionRecord/"
      that.$http.get(url+obj).then((res)=>{
          that.ruleForm = res.data
          that.ruleForm.createTime = new Date(that.ruleForm.createTime);
          that.ruleForm.sampleQuantity = res.data.sampleQuantity
          let recordTable = res.data.inspectionRecordDetailDtoList
          for(let key in recordTable[0].timeIntervalArray){
            that.timeIntervalArray.push(key)
          }
          for(let i in recordTable){
            for(let key in recordTable[i].timeIntervalArray){
                recordTable[i][key] = recordTable[i].timeIntervalArray[key].split(',')
            }
          }
          that.recordTable = recordTable
          that.oldTimeData = JSON.parse(JSON.stringify(that.recordTable))
          that.showNow = !that.showNow;
          console.log(that.recordTable,'recordTable');
          
          that.changeShowNow()
          that.paramsData = res.data.inspectionRecordParamsDtoList
          for(let i in res.data.inspectionRecordParamsDtoList){
            that.paramValuearray[i] = res.data.inspectionRecordParamsDtoList[i].paramValueArray
          }
          // console.log(that.paramsData,"that.paramsData");
          for(let i in that.paramsData){
            that.paramsData[i].expand = true;
          }
          // console.log(that.paramsData,"that.paramsDatasssss");
      })
    },
    //select选中
      changeProductId(val,index){
        
        let that = this;
        if(!val){return;}
        that.$http.get('/basic/product/detail/'+val).then(res=>{
          that.ruleForm.productName=res.data.name
          that.ruleForm.productNo=res.data.no
          that.ruleForm.spec=res.data.spec
          let paramsData = []
          if(that.changeProductFlag){//阻止修改时从无到有时的on-change，添加时和修改之后的执行不受影响
            that.changeProductFlag=false;
            paramsData = JSON.parse(JSON.stringify(that.paramsData))//拿到refreshData里的参数
            for(let i in paramsData){
              paramsData[i]['inspectionTypeName']=paramsData[i]['inspectionName']
            }
          }else{
            paramsData = res.data.settings.qc.pqc.params//拿到产品带出的参数
          }
          for(let i in paramsData){
              paramsData[i]['dataNumber']=i
          }
          let chkDevTypeIds = []
          for(let i in paramsData){
            if(!paramsData[i].chkDevTypeId){paramsData[i].chkDevTypeId="-1"}
            chkDevTypeIds.push(paramsData[i].chkDevTypeId.replace(/\,/g,'_'))
          }
          let resp =chkDevTypeIds?that.$iqis.utils.syncget('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{useState: 1,page: 1,limit: 9999}):null;
          for(let i in paramsData){
            let chkDevList = resp ? resp.data[i]||[] : [];
            chkDevList.unshift({chkDevId:null,name:i18n.t('Unlimited')});
            paramsData[i]['chkDevList'] = chkDevList;
          }
          that.paramsData = paramsData
        })
      },

     //数据保存
     confirm(){
        let that = this;
        if(that.prodBatch.PutOrPost=="post"){
          this.$Modal.confirm({
              title: i18n.t('pqc.tips'),
              content: i18n.t('pqc.basicData'),
              onOk: () => {
                  that.save()
              },
              onCancel: () => {
                  return;
              }
          });
        }else{
          that.save()
        }
     },
     save(){
        let that = this;
        let params = [
            {type:'Empty',title:i18n.t('pqc.time'),value:this.ruleForm.createTime},
            {type:'Empty',title:i18n.t('pqc.pn'),value:this.ruleForm.productId},
            {type:'Empty',title:i18n.t('pqc.cf'),value:this.ruleForm.inspectionRecordTypeId},
            {type:'Empty',title:i18n.t('pqc.templateID'),value:this.ruleForm.inspectionTemplateId},
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
        for(let i in that.paramsData){
            let paramsTable = [
                {type:'Num',title:i18n.t("pqc.pr1")+(Number(i)+Number(1))+i18n.t("pqc.lineOfTheTemplate"),value:that.paramsData[i].sampleQuantity},
            ]
            let state2 = true;
            for(let j in paramsTable){
                state2 = that.$iqis.utils.formValidate(paramsTable[j].type,paramsTable[j].title,paramsTable[j].value,(tips)=>{
                    that.$Notice.warning({title:tips})//,duration: 0
                })
                if(!state2){
                    return;
                    break;
                }
            }
        }
        let recordTable = JSON.parse(JSON.stringify(that.recordTable))
        for(let i in recordTable){
          let timeIntervalArray = {}
          for(let j in that.timeIntervalArray){
            timeIntervalArray[that.timeIntervalArray[j]]=recordTable[i][that.timeIntervalArray[j]].join(',')
          }
          recordTable[i]['timeIntervalArray'] = timeIntervalArray
        }
        
        that.ruleForm['inspectionRecordDetailDtoList']=recordTable
        // console.log(that.ruleForm.inspectionRecordDetailDtoList,'inspectionRecordDetailDtoList')
        if(that.ruleForm.paramState===0){//启用参数记录
          that.ruleForm['inspectionRecordParamsDtoList']=that.paramsData
          if(that.prodBatch.PutOrPost=='post'){
            for(let i in that.ruleForm.inspectionRecordParamsDtoList){
              that.ruleForm.inspectionRecordParamsDtoList[i]['prodProcessId']=that.ruleForm.inspectionRecordParamsDtoList[i].prodStageId
              that.ruleForm.inspectionRecordParamsDtoList[i]['inspectionId']=that.ruleForm.inspectionRecordParamsDtoList[i].inspectionTypeId
              that.ruleForm.inspectionRecordParamsDtoList[i]['unitId']=that.ruleForm.inspectionRecordParamsDtoList[i].measUnitId
              that.ruleForm.inspectionRecordParamsDtoList[i]['paramValueArray']=that.paramValuearray[i]
            }
          }
        }else{
          that.ruleForm['inspectionRecordParamsDtoList']=[] 
        }
        console.log(that.ruleForm,'inspectionRecordParamsDtoList')
        that.ruleForm.createTime = (new Date(that.ruleForm.createTime)).getTime();
         if(that.prodBatch.PutOrPost=='put'){
           for(let i in that.ruleForm.inspectionRecordParamsDtoList){
             that.ruleForm.inspectionRecordParamsDtoList[i]['paramValueArray']=that.paramValuearray[i]
           }
           let url="/inspectionRecord";
           that.$http.put(url,that.ruleForm,that.headers).then((res)=>{
             that.$Message.success(i18n.t("pqc.ats"));
             that.ruleForm.createTime = new Date(that.ruleForm.createTime);
           })
         }else if(that.prodBatch.PutOrPost=='post'){
           let urls="/inspectionRecord"
           that.$http.post(urls,that.ruleForm,that.headers).then((res)=>{
             that.$Message.success(i18n.t("pqc.as"));
             that.closePage();
             that.$emit("open-tab","exam-pqc-inspectrecord-update-"+res.data.inspectionRecordId,i18n.t('pqc.mpr')+"-"+res.data.productName,"page-exam-pqc-inspectrecord-update",{inspectionRecordId:res.data.inspectionRecordId,proID:2});
           })
         }
     },
     //取消
     closePage(){
       this.$emit("close-tab",this.$props.tabKey);
     },
     changeTemplateId(inspectionTemplateId) {
       let that = this
       
       if(inspectionTemplateId) {
          this.$http.get('/inspectionTemplate/'+inspectionTemplateId).then(function(resp){
            that.ruleForm.templateName=resp.data.templateName
            that.ruleForm.templateNumber=resp.data.templateNumber
            if(that.changeTemplateFlag){//阻止修改时从无到有时的on-change，添加时和修改之后的执行不受影响
              that.changeTemplateFlag=false;
              return;
            }else{
              that.ruleForm.sampleQuantity=resp.data.sampleQuantity              
              let timeIntervalArray = resp.data.timeIntervalArray
              that.timeIntervalArray = []
              for(let i in timeIntervalArray){
                that.timeIntervalArray.push(timeIntervalArray[i][0]+'~'+timeIntervalArray[i][1])
              }              
              
              let recordTable=resp.data.inspectionTemplateDetailDtoList
              for(let i in recordTable){
                for(let j in that.timeIntervalArray){
                  recordTable[i][that.timeIntervalArray[j]]=[]
                }
              }
              that.recordTable = recordTable
              that.oldTimeData = JSON.parse(JSON.stringify(that.recordTable))
              that.showNow = !that.showNow;
              that.changeShowNow()
            }
          })
       }
      }      
    },//end methods
  }
</script>
<style>
.iqis-page-block-tools-second label{
  opacity: 0;
}
.recordTable td:last-child .ivu-table-cell{
  padding:0!important
}
.recordTable td{
  height:58px;
}

.ivu-input-wrapper.ivu-input-type{
  border-right: 1px solid #e9eaec;
}
.ivu-input-wrapper.ivu-input-type:last-child{
  border-right:0;
}
</style>
