<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">{{$t('iqc.basicInfo')}}</div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="24">
          <i-col span="4" style="width:20%">
            <div class="iqis-page-block-label">供方/Supplier</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('null')" v-model="dto.manufacturerId" :disabled='noPermsDis||userDis' filterable>
                <Option value=" ">{{$t('iqc.null')}}</Option>
                <Option v-for="item in supplierList" :value="item.manufacturerId" :key="item.manufacturerId">{{ item.manufacturerName }}</Option></Select>
            </div>
          </i-col>
          <i-col span="4" style="width:20%">
            <div class="iqis-page-block-label">檢查報告編號/Insp.report NO:</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.isirNo" :disabled='noPermsDis||userDis' style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="4" style="width:20%">
            <div class="iqis-page-block-label">时间/Date</div>
            <div class="iqis-page-block-ctrl">
              <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" v-model="dto.createTime" :clearable='false' :disabled='noPermsDis||userDis' style="width: 100%"></Date-picker>
            </div>
          </i-col>
          <i-col span="4" style="width:20%">
            <div class="iqis-page-block-label">检验员/Inspector</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="dto.inspectorId" :disabled='noPermsDis||userDis' filterable>
                <Option v-for="item in userList" :value="item.userId" :key="item.userId">{{ item.name }}</Option></Select>
            </div>
          </i-col>
        </Row>
        <Row :gutter="24">
          <i-col span="4" style="width:20%">
            <div class="iqis-page-block-label">零件料號/Part number:</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="dto.productId" :disabled='noPermsDis||userDis' filterable @on-change="changeProductId(dto.productId)">
                <Option v-for="(items,index) in productList" :value="items.productId" :label="items.no" :key="index">{{items.no}}/{{ items.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="4" style="width:20%">
            <div class="iqis-page-block-label">零件名稱/Part description:</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.prodName" disabled style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="4" style="width:20%">
            <div class="iqis-page-block-label">樣品重量/Sample weight:</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.sampleWeight" :disabled='noPermsDis||userDis' style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="4" style="width:20%">
            <div class="iqis-page-block-label">送樣數量/No.of samples:</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.sampleQuantity" number :disabled='noPermsDis||userDis' style="width: 100%;">
                <span slot="append">{{dto.prodUnitName}}</span></i-input>
            </div>
          </i-col>
          <i-col span="4" style="width:20%">
            <div class="iqis-page-block-label">版本/Version:</div>
            <div class="iqis-page-block-ctrl">
              <i-input  v-model="dto.version" :disabled='noPermsDis||userDis' style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <table class="tableStyle" bgcolor="#dcdee2" cellspacing="1px">
          <tr bgcolor="white">
            <td style="width:50%;" bgcolor="#f8f8f9">送样原因/Reason for initial</td>
            <td style="width:50%;" bgcolor="#f8f8f9">结论/Decision</td></tr>
          <tr bgcolor="white">
            <td>
              <CheckboxGroup v-model="dto.initialReasonList">
                <Checkbox label="NEW_PART" :disabled="noPermsDis||userDis">新零件/New part</Checkbox></CheckboxGroup>
            </td>
            <td>
              <RadioGroup v-model="dto.decision">
                <Radio label="APPROVED" :disabled="noPermsDis||userDis">通过/Approved</Radio></RadioGroup>
            </td>
          </tr>
          <tr bgcolor="white">
            <td>
              <CheckboxGroup v-model="dto.initialReasonList">
                <Checkbox label="PROD_MODIFY" :disabled="noPermsDis||userDis">產品更改/Product modifilcation</Checkbox></CheckboxGroup>
            </td>
            <td>
              <RadioGroup v-model="dto.decision">
                <Radio label="APPROVED_CONDITIONS" :disabled="noPermsDis||userDis">有條件通過/Approved with conditions</Radio></RadioGroup>
            </td>
          </tr>
          <tr bgcolor="white">
            <td>
              <CheckboxGroup v-model="dto.initialReasonList">
                <Checkbox label="PRODUCTION_RELOCATION" :disabled="noPermsDis||userDis">產地更改/Production relocation</Checkbox></CheckboxGroup>
            </td>
            <td>
              <RadioGroup v-model="dto.decision">
                <Radio label="REJECTED" :disabled="noPermsDis||userDis">拒收/Rejected</Radio></RadioGroup>
            </td>
          </tr>
          <tr bgcolor="white">
            <td>
              <CheckboxGroup v-model="dto.initialReasonList">
                <Checkbox label="CHANGE_PROCESS" :disabled="noPermsDis||userDis">生產過程更改/Change of production process</Checkbox></CheckboxGroup>
            </td>
            <td>
              <RadioGroup v-model="dto.decision">
                <Radio label="REJECTED_INSTALL" :disabled="noPermsDis||userDis">拒收，採取措施可能安裝/Rejected,installation possible with measures</Radio></RadioGroup>
            </td>
          </tr>
          <tr bgcolor="white">
            <td>
              <CheckboxGroup v-model="dto.initialReasonList">
                <Checkbox label="STOP_PRODUCTION" :disabled="noPermsDis||userDis">長期停產/Longer stoppage of production</Checkbox></CheckboxGroup>
            </td>
            <td>
              <RadioGroup v-model="dto.decision">
                <Radio label="NEW_SAMPIES" :disabled="noPermsDis||userDis">拒收，要求重新送樣/Rejected,new sampies required</Radio></RadioGroup>
            </td>
          </tr>
          <tr bgcolor="white">
            <td>
              <CheckboxGroup v-model="dto.initialReasonList">
                <Checkbox label="NEW_SUB_SUPPLIER" :disabled="noPermsDis||userDis">新的分包商/New sub-supplier</Checkbox></CheckboxGroup>
            </td>
            <td></td>
          </tr>
        </table>
        <table class="tableStyle" bgcolor="#dcdee2" cellspacing="1px">
          <tr bgcolor="white">
            <td colspan="3" bgcolor="#f8f8f9">檢驗報告/inspection report</td>
          </tr>
          <tr bgcolor="white">
            <td>
              <CheckboxGroup v-model="dto.inspectionReportList">
                <Checkbox label="DIMENSION_INSPECTION" :disabled="noPermsDis||userDis">尺寸檢驗/Dimension inspection</Checkbox></CheckboxGroup>
            </td>
            <td colspan="2">
              <RadioGroup v-model="dto.initialInspectionReport">
                <Radio label="SAMPLE_INSPECTION_REPORT" :disabled="noPermsDis||userDis">初樣檢查報告/Initial sample inspection report</Radio></RadioGroup>
            </td>
          </tr>
          <tr bgcolor="white">
            <td>
              <CheckboxGroup v-model="dto.inspectionReportList">
                <Checkbox label="FUNCTION_INSPECTION" :disabled="noPermsDis||userDis">功能檢查/Function inspection</Checkbox></CheckboxGroup>
            </td>
            <td colspan="2">
              <CheckboxGroup style="margin-left:20px" v-model="dto.subInitalInspectionReportList">
                <Checkbox label="APPROVED_CONDITIONS" :disabled="noPermsDis||userDis">初樣檢查/Initial sample inspection</Checkbox></CheckboxGroup>
            </td>
          </tr>
          <tr bgcolor="white">
            <td>
              <CheckboxGroup v-model="dto.inspectionReportList">
                <Checkbox label="MATERIAL_INSPECTION" :disabled="noPermsDis||userDis">材料檢驗/Material inspection</Checkbox></CheckboxGroup>
            </td>
            <td colspan="2">
              <CheckboxGroup style="margin-left:20px" v-model="dto.subInitalInspectionReportList">
                <Checkbox label="SUBSEQUENT_INSPECTION" :disabled="noPermsDis||userDis">後續樣品檢查/Subsequent sample inspection</Checkbox></CheckboxGroup>
            </td>
          </tr>
          <tr bgcolor="white">
            <td>
              <CheckboxGroup v-model="dto.inspectionReportList">
                <Checkbox label="RELIABILITY_INSPECTION" :disabled="noPermsDis||userDis">可靠性檢查/Reliability inspection</Checkbox></CheckboxGroup>
            </td>
            <td colspan="2">
              <CheckboxGroup style="margin-left:20px" v-model="dto.subInitalInspectionReportList">
                <Checkbox label="PRE_SAMPLE_INSPECTION" :disabled="noPermsDis||userDis">預初樣檢驗/Pre sample inspection</Checkbox></CheckboxGroup>
            </td>
          </tr>
          <tr bgcolor="white">
            <td>
              <CheckboxGroup v-model="dto.inspectionReportList">
                <Checkbox label="VISUAL_INSPECTION" :disabled="noPermsDis||userDis">外觀檢查/Visual inspection</Checkbox></CheckboxGroup>
            </td>
            <td colspan="2">
              <RadioGroup v-model="dto.initialInspectionReport">
                <Radio label="OTHER_INSPECTION_REPORT" :disabled="noPermsDis||userDis">其他樣品檢查報告/Inspection report,other samples</Radio></RadioGroup>
            </td>
          </tr>
          <tr bgcolor="white">
            <td>
              <CheckboxGroup v-model="dto.inspectionReportList">
                <Checkbox label="ATTRIBUTIVE_INSPECTION" :disabled="noPermsDis||userDis">屬性檢查/Attributive inspection</Checkbox></CheckboxGroup>
            </td>
            <td style="width:25%">送樣次數/Sample no:</td>
            <td style="width:25%" class="td_input">
              <Input v-model="dto.sampleNum" :disabled="noPermsDis||userDis" size="large" placeholder="请输入" /></td>
          </tr>
          <tr bgcolor="white">
            <td>
              <CheckboxGroup v-model="dto.inspectionReportList">
                <Checkbox label="OTHERS" :disabled="noPermsDis||userDis">其他/Others</Checkbox></CheckboxGroup>
            </td>
            <td colspan="2"></td>
          </tr>
        </table>
        <div style="padding-top:20px">
          <div style="padding-bottom:10px;">備注/Remark</div>
          <Input v-model="dto.remarks" :disabled="noPermsDis||userDis" type="textarea" placeholder="" />
        </div>
        <div class="iqis-page-block">
          <div class="iqis-page-block-title">
            参数记录
          </div>
          <div class="iqis-page-block-body">
            <div class="iqis-page-block-tools">
              <div class="iqis-page-block-tools-primary">
                <div class="iqis-page-block-label">参数记录列表</div>
              </div>
              <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
                <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('iqc.changed')}} <span
                  style="color:#1b75ea">{{selectsParams}}</span> 项参数记录</span>
                <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                  confirm
                  :title="i18n.t('iqc.confirmDelete')"
                  placement="bottom-end"
                  @on-ok="deleteParams">
                  <Button type="ghost" icon="trash-a" :disabled="noPermsDis||userDis">{{$t('iqc.delete')}}</Button>
                </Poptip>
              </div>
            </div>
            <div class="iqis-page-block-table">
              <Table  :no-data-text="i18n.t('noData')" class="height24 noBorder" ref="paramsTable" @on-selection-change="changeSelectParams" border stripe
                      v-drag-table-column="columns" :columns="columns"
                      :data="dto.isirParamRecordDtoList">
                <Button  :disabled="noPermsDis||userDis" @click="addParams" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t('product.addIqcParams')}}</Button>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-end" style="padding-bottom: 65px"></div>
    <Spin size="large" fix v-if="loading"></Spin>
    <IqisAffix placement="bottom" :offset="0">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button v-if="!noPermsDis&&!userDis&&!loading" type="primary" @click="save('submit')">{{$t('product.commit')}}</Button>
        <Button v-if="!noPermsDis&&!userDis&&!loading" type="primary" @click="save('save')">{{$t('product.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('product.cancel')}}</Button>
      </div>
    </IqisAffix>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  props: ["params", "tabKey"],
  data(){
    let vm = this;
    return{
      loading:true,
      isirId:null,
      headers: {"headers": {"Content-Type": "application/json; charset=UTF-8"}},
      userDis:false,
      noPermsDis:false,
      i18n:window.i18n,
      supplierList:[],
      userList:[],
      productList:[],
      measunitList:[],
      chkdevList:[],
      inspectiontypeList:[],
      dto:{
        "auditorId": null,
        "auditorName": "",
        "createTime": "",
        "decision": "",
        "initialInspectionReport": "",
        "initialReason": "",
        "initialReasonList": [],
        "inspectionReport": "",
        "inspectionReportList": [],
        "inspectorId": null,
        "inspectorName": "",
        "isirId": null,
        "isirNo": "",
        "isirParamRecordDtoList": [
          // {
          //   "chkDevId": 0,
          //   "chkDevName": "string",
          //   "decision": "string",
          //   "inspectionTypeId": 0,
          //   "inspectionTypeName": "string",
          //   "isirId": 0,
          //   "lsl": "string",
          //   "measUnitId": 0,
          //   "measUnitName": "string",
          //   "paramId": 0,
          //   "paramRecordId": 0,
          //   "paramValue": "string",
          //   "paramValueArray": [
          //     "string"
          //   ],
          //   "result": 0,
          //   "scale": 0,
          //   "sl": "string",
          //   "tenantId": 0,
          //   "usl": "string",
          //   "wll": "string",
          //   "wul": "string"
          // }
        ],
        "manufacturerId": null,
        "manufacturerName": "",
        "prodName": "",
        "prodNo": "",
        "productId": null,
        "remarks": "",
        "sampleNum": null,
        "sampleQuantity": null,
        "sampleWeight": "",
        "state": 0,
        "subInitalInspectionReport": "",
        "subInitalInspectionReportList": [],
        "version": ""
      },
      selectsParams:0,
      columns: [
        {
          type: 'selection',
          width:40,
          align: 'center',
          minWidth:40,
          maxWidth:40,
        },
        {
          title: i18n.t('iqc.no'),
          width: 40,
          render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
          align: "center",
          minWidth: 40,
          maxWidth: 40
        },
        {
          title: i18n.t('product.project'),
          minWidth: this.$store.state.locale=='zh_CN'?90:120,
          width:this.$store.state.locale=='zh_CN'?90:120,
          align: 'center',
          ellipsis:true,
          //required:true,
          key: 'inspectionTypeId',
          render:
          (h, params)=>{
            let ret =  vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(
              vm,
              (vm)=>{
                return vm.inspectiontypeList
              },
              "inspectionTypeId",
              "name",
              null,
              this.closeInspectionType,
              vm.noPermsDis||vm.userDis,
            )
            return ret(h,params);
          }
        },
        {
          title: i18n.t('product.measUnit'),
          width: this.$store.state.locale=='zh_CN'?85:150,
          minWidth:this.$store.state.locale=='zh_CN'?85:150,
          align: 'center',
          ellipsis:true,

          key: 'measUnitId',
          render:
          (h, params)=>{
            let ret =  vm.$iqis.utils.tableHelper.editable.buildSelectCell2(
              vm,
              (vm)=>{
                return vm.measunitList
              },
              "measUnitId",
              "unitSymbol",
              this.changeSelectMeasUnit,
              vm.noPermsDis||vm.userDis
            )
            return ret(h,params);
          }

        },
        {
          title: i18n.t('iqc.chkDev'),
          width: this.$store.state.locale=='zh_CN'?120:220,
          minWidth:this.$store.state.locale=='zh_CN'?120:220,
          align: 'center',
          ellipsis:true,
          key: 'chkDevId',
          render:
          (h, params)=>{
            let ret =  vm.$iqis.utils.tableHelper.editable.buildSelectCell2(
              vm,
              (vm)=>{
                return vm.chkdevList
              },
              "chkDevId",
              "name",
              this.changeSelectChkDev,
              vm.noPermsDis||vm.userDis
            )
            return ret(h,params);
          }
        },
        
        {
          title: 'USL',
          minWidth:72,
          align: 'center',
          ellipsis:true,
          key: 'usl',
          render: (h, params) => {
            return h('div', [h
              ('Input',{
                props: {
                  type: 'text',
                  disabled:vm.noPermsDis||vm.userDis,
                  value:params.row.usl
                },
                on: {
                  'on-blur':(event) => {
                    params.row.usl = event.target.value
                    this.dto.isirParamRecordDtoList[params.index] = params.row;
                  }
                }
              })
            ])
          }
        },
        {
          title: 'SL',
          minWidth:72,
          align: 'center',
          ellipsis:true,
          key: 'sl',
          render: (h, params) => {
            return h('div', [h
              ('Input',{
                props: {
                  type: 'text',
                  disabled:vm.noPermsDis||vm.userDis,
                  value:params.row.sl
                },
                on: {
                  'on-blur':(event) => {
                    params.row.sl = event.target.value
                    this.dto.isirParamRecordDtoList[params.index] = params.row;
                  }
                }
              })
            ])
          }
        },
        {
          title: 'LSL',
          minWidth:72,
          align: 'center',
          ellipsis:true,
          key: 'lsl',
          render: (h, params) => {
            return h('div', [h
              ('Input',{
                props: {
                  type: 'text',
                  disabled:vm.noPermsDis||vm.userDis,
                  value:params.row.lsl
                },
                on: {
                  'on-blur':(event) => {
                    params.row.lsl = event.target.value
                    this.dto.isirParamRecordDtoList[params.index] = params.row;
                  }
                }
              })
            ])
          }
        },
        {
          title: '记录',
          align: 'center',
          ellipsis:true,
          minWidth:360,
          key: 'paramValueArray',
          render: (h, params) => {
            return h('div',
            [0,1,2,3,4].map(function(i) {//chdDevTypeList原带出检验设备列表
              return h(
                "Input",{
                  style:{
                    width:'20%',
                    background:vm.backgroundColor(params.row.paramValueArray[i],params.row.usl,params.row.lsl),
                    borderRight:i!=4?'1px solid #e9eaec':'',
                  },
                  props: {
                    value: params.row.paramValueArray[i],
                    disabled:vm.noPermsDis||vm.userDis
                  },
                  on: {
                    "on-blur": event => {
                      params.row.paramValueArray[i] = event.target.value;
                      vm.dto.isirParamRecordDtoList[params.index] = params.row
                      $(event.target).parent('.ivu-input-wrapper.ivu-input-type').css('background',vm.backgroundColor(params.row.paramValueArray[i],params.row.usl,params.row.lsl,event.target))
                    }
                  }
                }
              );
            })
            )
          }
        },
        {
          title: '结果',
          minWidth:80,
          width:80,
          align: 'center',
          ellipsis:true,
          key: 'result',
          render: (h, params) => {
            return h('Select', {
              props:{
                value:this.dto.isirParamRecordDtoList[params.index].result,
                disabled:vm.noPermsDis||vm.userDis
              },
              on: {
                'on-change':(val) => {
                  params.row.result = val
                  this.dto.isirParamRecordDtoList[params.index] = params.row
                } 
              },
            },
            [
              h('Option',{
                props: {value: 1}
              },'OK'),
              h('Option',{
                props: {value: 0}
              },'NG'),
            ]
          )}
        },
        {
          title: '结论',
          minWidth:180,
          width:180,
          align: 'center',
          ellipsis:true,
          key: 'decision',
          render: (h, params) => {
            return h('div', [h
              ('Input',{
                props: {
                  type: 'text',
                  disabled:vm.noPermsDis||vm.userDis,
                  value:params.row.decision
                },
                on: {
                  'on-blur':(event) => {
                    params.row.decision = event.target.value
                    this.dto.isirParamRecordDtoList[params.index] = params.row;
                  }
                }
              })
            ])
          }
        },
        
      ],
      permsCur:[
        "EXPORT_ISIR",
        "UPDATE_ISIR",
        "SELECT_ISIR",
        "INSERT_ISIR",
        "DELETE_ISIR",
        "AUDIT_ISIR",
      ],//当前页面需要的权限名称
      permsBtn:{//控制每个权限对应按钮的禁用状态
        "EXPORT_ISIR":false,
        "UPDATE_ISIR":false,
        "SELECT_ISIR":false,
        "INSERT_ISIR":false,
        "DELETE_ISIR":false,
        "AUDIT_ISIR":false,
      },
    }
  },
  created(){
    this.refreshData()
    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
  },methods:{
    backgroundColor(val,usl,lsl,target){
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
    refreshData(){
      this.$http.all([
        this.$http.get('/bas/manufacturer?page=1&limit=999999'),
        this.$http.get('/basic/product/simple?page=1&limit=999999&useState=1'),
        this.$http.get('/tenant/user?page=1&limit=999999'),
        this.$http.get('/basic/measunit?page=1&limit=999999'),
        this.$http.get('/basic/chkdev?useState=1&page=1&limit=999999'),
        this.$http.get("/basic/inspectiontype?page=1&limit=999999"),
      ]).then(res=>{
        this.supplierList = res[0].data
        this.productList = res[1].data
        this.userList = res[2].data
        this.measunitList = res[3].data
        this.chkdevList = res[4].data
        let resp = res[5];
        let root = {title:i18n.t('product.projectType'),selected: false,label:i18n.t('product.projectType'),value:0,expand:true};
        this.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
        this.inspectiontypeList = [root];
        this.isirId = this.$props.params && this.$props.params.isirId;
        if(this.isirId){//修改
          this.$http.get("/isir/"+this.isirId).then((res) => {
            res.data.createTime = new Date(res.data.createTime)
            this.dto = res.data
            if(this.dto.inspectorId != this.$store.state.currentUserId||this.dto.state==1||this.dto.state==2){
              this.userDis = true
            }
          })
        }else{
          let copyId = this.$props.params && this.$props.params.copyId; 
          if(copyId){//复制
            this.$http.get("/isir/"+copyId).then((res) => {
              res.data.createTime = new Date(res.data.createTime)
              this.dto.productId = res.data.productId
              this.dto.prodNo = res.data.prodNo
              this.dto.prodName = res.data.prodName
              this.dto.isirParamRecordDtoList = res.data.isirParamRecordDtoList.map((item,index)=>{
                let row = item
                row.paramValueArray = ['','','','','']
                row.paramRecordId = null
                row.result = null
                row.decision = null
                return row
              })
            })
          }else{//添加
            
          }
          this.dto.inspectorId = this.$store.state.currentUserId
          this.dto.createTime = new Date()
        }

        // 权限
        if(((!this.isirId&&this.permsBtn.INSERT_ISIR)||(this.isirId&&this.permsBtn.UPDATE_ISIR))){
          this.noPermsDis=false;
        }else{
          this.noPermsDis=true;
        }

        this.loading = false
      })
    },
    changeProductId(id){
      this.$http.get('/basic/product/'+id).then(res=>{
        this.dto.prodNo = res.data.productNo
        this.dto.prodName = res.data.name
        this.dto.prodUnitName = res.data.prodUnitName
      })
    },
    changeSelectParams(selects){
      this.selectsParams = selects.length
    },
    closeInspectionType(val,valName,index,row){
      this.dto.isirParamRecordDtoList[index].inspectionTypeId = val
    },
    changeSelectMeasUnit(val,valName,index){
      this.dto.isirParamRecordDtoList[index].measUnitId = val
    },
    changeSelectChkDev(val,valName,index){
      this.dto.isirParamRecordDtoList[index].chkDevId = val
    },
    addParams(){
      var newRow = {
        "chkDevId": null,
        "chkDevName": "",
        "decision": "",
        "inspectionTypeId": null,
        "inspectionTypeName": "",
        "isirId": null,
        "lsl": "",
        "measUnitId": null,
        "measUnitName": "",
        "paramId": null,
        "paramRecordId": null,
        "paramValue": "",
        "paramValueArray": [],
        "result": null,
        "scale": null,
        "sl": "",
        "tenantId": null,
        "usl": "",
        "wll": "",
        "wul": "",
        rowId:this.dto.isirParamRecordDtoList.length
      }
      this.dto.isirParamRecordDtoList.push({...newRow});
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((this.dto.isirParamRecordDtoList.length-1-6)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');
      })
      console.log(this.dto.isirParamRecordDtoList,'this.dto.isirParamRecordDtoList');
      
    },
    deleteParams(){
      let selection = this.$refs.paramsTable.getSelection();
      if(selection.length > 0){
        for(let i in selection){
          for(let j in this.dto.isirParamRecordDtoList){
            if(selection[i].rowId == this.dto.isirParamRecordDtoList[j].rowId){
             this.dto.isirParamRecordDtoList.splice(j,1);
            }
          }
        }
      }
      this.selectsParams = 0;
    },
    closePage(){
      this.$emit("close-tab",this.$props.tabKey);
    },
    save(type){
      let dto = JSON.parse(JSON.stringify(this.dto))
      dto.createTime = new Date(dto.createTime).getTime()
      let params = [
        // {type: 'Empty', title: '檢查報告編號/Insp.report NO', value: dto.isirNo},
        {type: 'Empty', title: '零件料號/Part number', value: dto.productId}
      ]
      let state = true;
      for (let i in params) {
        state = this.$iqis.utils.formValidate(params[i].type, params[i].title, params[i].value, (tips) => {
          this.$Notice.warning({title: tips})//,duration: 0
        })
        if (!state) {
          return;
          break;
        }
      }
      // let paramRowNull = false
      // for(let i in dto.isirParamRecordDtoList){
      //   for(let j in dto.isirParamRecordDtoList[i]){
      //     if(!dto.isirParamRecordDtoList[i][j])
      //   }
      // }
      if(type=="save"){
        if(!this.isirId){
          this.$http.post('/isir/add',dto,this.headers).then(res=>{
            this.$Message.success('添加成功')
              this.closePage();
              this.$emit("open-tab","exam-iqc-first-add-"+res.data.isirId,"修改初样检验-"+dto.prodName,"page-exam-iqc-first-add",{isirId:res.data.isirId});
          })
        }else{
           this.$http.put('/isir/update',dto,this.headers).then(res=>{
            this.$Message.success('修改成功')
            // this.refreshData()
          })
        }
      }else{
        this.$http.post('/isir/commit',dto,this.headers).then(res=>{
          this.$Message.success('提交成功')
          this.closePage();
        })
      }
    },
  }
}
</script>
<style scoped>
  .tableStyle{
      margin-top: 10px;
  }
  .tableStyle,tr{
      width:100%;
  }
  .tableStyle td{
      padding: 15px 10px;
  }
  .tt-tip-table {
    border: 0;
    padding: 0;
    margin: 0;
    vertical-align: top;
    font-size: 14px;
  }

  .tt-tip-table td,
  .tt-tip-table th {
    border: 0;
    text-align: left;
    padding: 0;
    margin: 0;
    vertical-align: top;
  }

  .tt-tip-row {
    margin-bottom: 16px;
  }

  .tt-tip-label {
    display: inline-block;
    width: 135px;
  }

  .tt-tip-text {
    display: inline-block;
    width: 68px;
  }

  .review-block {
    margin-bottom: 20px;
  }

  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
    
  }

  .iqis-page-block-tools {
    margin-bottom: 8px;
  }

  .iqis-page-block-tools-second .ivu-btn-ghost:not([disabled]) {
    color: #418FEE;
    background-color: transparent;
    border-color: #418FEE;
  }

</style>