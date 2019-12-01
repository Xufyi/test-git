<template>
  <div class="iqis-page">

    <!-- 第一部分-添加客退 -->
    <div class="iqis-page-block" v-if="refund.show">
      <div class="iqis-page-block-title">
        {{$t('customer.returnRegistration')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.returnTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :disabled="refund.disabled||noPermsDis" type="datetime" v-model="refund.refundDate" format="yyyy-MM-dd HH:mm" style="width:100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.returnNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="refund.disabled||noPermsDis" v-model="refund.refundNo" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.returnCustomer')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="refund.disabled||noPermsDis" v-model="refund.customerId" filterable>
                <Option v-for="data in customerList" :key="data.customerId" :value="data.customerId">{{data.customerAbbreviation}}</Option>
              </Select>
            </div>

          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.whetherReturn')}}</div>
            <div class="iqis-page-block-ctrl">
              <RadioGroup v-model="refund.isReplenishment" @on-change="backOrNo">
                <Radio :disabled="refund.disabled||noPermsDis" :label='1'>{{$t('customer.yes')}}</Radio>
                <Radio :disabled="refund.disabled||noPermsDis" :label='0'>{{$t('customer.not')}}</Radio>
              </RadioGroup>
            </div>

          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('customer.productNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :label="refund.productNo" remote :remote-method="remoteMethod" :loading="loadingRemote"  :placeholder="i18n.t('pleaseChoose')" :disabled="refund.disabled||noPermsDis" v-model="refund.productId" filterable @on-change="getProduct(refund.productId)">
                <Option v-for="data in product" :key="data.productId" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select>
            </div>

          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('customer.productName')}}</div>
            <div class="iqis-page-block-ctrl">

              <i-input disabled v-model="refund.productName" :placeholder="i18n.t('customer.pleaseInput')" style="width: 100%;"></i-input>
            </div>

          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('customer.productSpec')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="refund.productSpec" :placeholder="i18n.t('customer.pleaseInput')" style="width: 100%;"></i-input>
            </div>

          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('customer.outgoingQuantity')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="refund.disabled||noPermsDis" v-model="refund.deliveryQuantity" :placeholder="i18n.t('customer.pleaseInput')" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('customer.returnQuantity')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="refund.disabled||noPermsDis" v-model="refund.refundQuantity" :placeholder="i18n.t('customer.pleaseInput')" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6" v-if="back.backNum">

            <div class="iqis-page-block-label">{{$t('customer.replenishmentQuantity')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="refund.disabled||noPermsDis" v-model="refund.replenishmentQuantity" :placeholder="i18n.t('customer.pleaseInput')" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6" v-if="back.backNum">

            <div class="iqis-page-block-label">{{$t('customer.planReturnTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :disabled="refund.disabled||noPermsDis" type="datetime" v-model="refund.planReplenishmentDate"  format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
            </div>

          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('customer.productBatch')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="refund.disabled||noPermsDis" v-model="refund.batchNo" placeholder="" style="width: 100%;"></i-input>
            </div>
          </i-col>

        </Row>
        <Row :gutter="25" style="display:flex;">
          <i-col style="flex:auto">
            <div class="iqis-page-block-label">{{$t('customer.processingDepartment')}}</div>
            <div class="iqis-page-block-ctrl">
              <Cascader  :disabled="refund.disabled||noPermsDis" :transfer="false" v-model="refund.departmentValue" :data="departments[0].children"
                    :render-format = "loadTypeRender"
                    change-on-select :clearable="false" style="width: 100%"></Cascader>
            </div>
          </i-col>
          <i-col style="flex:auto">
            <div class="iqis-page-block-label">{{$t('customer.auditor')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="refund.disabled||noPermsDis" v-model="refund.auditorId" filterable>
                <Option v-for="data in user" :key="data.userId" :value="data.userId">{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col style="flex:auto">
            <div class="iqis-page-block-label">{{$t('customer.reviewTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker disabled type="datetime" v-model="refund.auditDate" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </div>
          </i-col>

          <i-col style="flex:auto">
            <div class="iqis-page-block-label">{{$t('customer.creator')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="refund.disabled||noPermsDis" v-model="refund.creatorId" filterable :placeholder="i18n.t('customer.pleaseSelect')">
                <Option v-for="data in user" :key="data.userId" :value="data.userId">{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col style="flex:auto">
            <div class="iqis-page-block-label">{{$t('customer.createTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :disabled="refund.disabled||noPermsDis" type="datetime" v-model="refund.createTime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
            </div>
          </i-col>
        </Row>
      </div>
    </div>
    <!-- 第二部分-处理和缺陷记录 -->
    <div class="iqis-page-block"  v-if="handle.show">
      <!-- 第二部分-处理记录 -->
      <div class="iqis-page-block-title">
        {{$t('customer.treatmentRecord')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.startTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :disabled="handle.disabled||noPermsDis" type="datetime" v-model="handle.data.startDate" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.endTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :disabled="handle.disabled||noPermsDis" type="datetime" v-model="handle.data.endDate" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.treatmentMethod')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="handle.disabled||noPermsDis" v-model="handle.data.treatmentMethod" style="width: 100%">
                <Option v-for="method in handle.treatmentMethods" :key="method.value" :value="method.value">{{method.label}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.treatmentQuantity')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="handle.disabled||noPermsDis" placeholder="" v-model="handle.data.treatmentQuantity" style="width: 100%;">
                <span slot="append">{{handle.productUnit}}</span>
              </i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.qualifiedQuantity')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="handle.disabled||noPermsDis" placeholder="" v-model="handle.data.qualifiedQuantity" style="width: 100%;">
                <span slot="append">{{handle.productUnit}}</span>
              </i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.treatmentTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="handle.disabled||noPermsDis" placeholder="" number v-model="handle.data.treatmentHours" style="width: 100%;">
                <span slot="append">H</span>
              </i-input>
            </div><!--bug-->
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('customer.treatmentInstructions')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="handle.disabled||noPermsDis" type="textarea" placeholder="……" v-model="handle.data.treatmentDescription" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
      <!-- 第二部分-缺陷记录 -->
      <div class="iqis-page-block-title">
        {{$t('customer.defectRecord')}}
      </div>
      <div class="iqis-page-block-tools">
        <div class="iqis-page-block-tools-primary">
          <div class="iqis-page-block-label">{{$t('customer.defectTable')}}</div>
        </div>
        <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
          <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('customer.changed')}} <span style="color:#1b75ea">{{TableLength}}</span> {{$t('customer.defects')}}</span>
          <Button :disabled="noPermsDis" v-if="!handle.disabled" type="ghost" icon="trash-a" @click="deleteDefect">{{$t('customer.delete')}}</Button>
        </div>
      </div>
      <div class="iqis-page-block-body">
        <Table  :no-data-text="i18n.t('noData')" ref="defectTable" class="noBorder noHeight location defectTable" :loading="handle.table.loading" @on-selection-change="getTableLength" v-drag-table-column="handle.table.columns" border stripe :columns="handle.table.columns" :data="handle.table.data">
          <Button :disabled="noPermsDis" class="iqis-table-footer-btn" slot="footer" v-if="!handle.disabled" type="dashed" @click="addDefect" icon="plus" style="width:100%;margin:16px;">{{$t('customer.addDefect')}}</Button>
        </Table>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.auditor')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="handle.disabled||noPermsDis" v-model="handle.data.auditorId" filterable>
                <Option v-for="data in user" :key="data.userId" :value="data.userId">{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.reviewTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker disabled type="datetime" v-model="handle.data.auditDate" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.treatmentPerson')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="handle.disabled||noPermsDis" v-model="handle.data.transactorId" filterable :placeholder="i18n.t('customer.pleaseSelect')" style="width: 100%">
                <Option v-for="data in user" :key="data.userId" :value="data.userId">{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.treatmentTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :disabled="handle.disabled||noPermsDis" type="datetime" v-model="handle.data.treatmentDate" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
            </div>
          </i-col>
        </Row>
      </div>
    </div>
    <!--  第二部分-归还记录 -->
    <div class="iqis-page-block" v-if="back.show">
      <div class="iqis-page-block-title">
        {{$t('customer.replenishmentRecord')}}
      </div>
      <div class="iqis-page-block-tools">
        <div class="iqis-page-block-tools-primary">
          <div class="iqis-page-block-label">{{$t('customer.replenishmentTable')}}</div>
        </div>
        <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
          <!-- <Button :disabled="back.disabled" @click="addDelivery" type="primary" icon="plus">添加</Button> -->
          <Button :disabled="noPermsDis" v-if="!back.disabled" @click="deleteDelivery" type="ghost" icon="trash-a">{{$t('customer.delete')}}</Button>
        </div>
      </div>

      <div class="iqis-page-block-body">
        <Table  :no-data-text="i18n.t('noData')" class="noBorder noHeight" ref="deliveryTable" :loading="back.table.loading" v-drag-table-column="back.table.columns" border stripe :columns="back.table.columns" :data="back.table.data">
          <Button :disabled="noPermsDis" class="iqis-table-footer-btn" slot="footer" v-if="!back.disabled" type="dashed" @click="addDelivery" icon="plus" style="width:100%;margin:16px;">{{$t('customer.addReplenishment')}}</Button>
        </Table>
      </div>
    </div>

    <!-- 客户添加按钮组 第一部分可编辑-->
    <IqisAffix placement="bottom" :offset="0" v-if="button.creator&&!noPermsDis">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="create">{{$t('customer.commit')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('customer.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!-- 审核人审核按钮组 第一部分不可编辑-->
    <IqisAffix placement="bottom" :offset="0" v-else-if="button.auditor&&permsBtn.UPDATE_CUSTOMER_REFUND">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="createPass">{{$t('customer.auditPass')}}</Button>
        <Button type="ghost" @click="createNotPass">{{$t('customer.auditReject')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('customer.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!-- 处理人处理退货按钮组 第一部分不可编辑，第二部分可编辑-->
    <IqisAffix placement="bottom" :offset="0"  v-else-if="button.handler&&permsBtn.UPDATE_CUSTOMER_REFUND">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="handleSave('submit')">{{$t('customer.commit')}}</Button>
        <Button type="primary" @click="handleSave('save')">{{$t('customer.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('customer.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!-- 审核人审核退货按钮组 第一和二部分不可编辑-->
    <IqisAffix placement="bottom" :offset="0"  v-else-if="button.handleAuditor&&permsBtn.UPDATE_CUSTOMER_REFUND">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="handlePass">{{$t('customer.auditPass')}}</Button>
        <Button type="ghost" @click="handleNotPass">{{$t('customer.auditReject')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('customer.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!-- 处理人归还按钮组 第一和第二部分不可编辑，第三部分可编辑-->
    <IqisAffix placement="bottom" :offset="0"  v-else-if="button.backer&&permsBtn.UPDATE_CUSTOMER_REFUND">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="deliverySave('submit')">{{$t('customer.end')}}</Button>
        <Button type="primary" @click="deliverySave('save')">{{$t('customer.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('customer.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!-- 其他按钮-全部不可编辑 -->
    <IqisAffix placement="bottom" :offset="0" v-else>
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="closePage">{{$t('customer.cancel')}}</Button>
      </div>
    </IqisAffix>

    <!--end blocks-->
    <div class="page-end" style="padding-bottom: 65px"></div>
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
      headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
      data:[],
      selects:{
        defectTypeList:[],
        inspectionTypes:[],
      },
      customerList:[],
      allDepartment:[],
      user:[],
      product:[],
      departments:[],
      TableLength:0,
      refund:{
        show:false,
        disabled:false,
        refundDate:new Date(),
        isReplenishment:null,
        batchNo: '',
        createTime:new Date(),
        customerId: '',
        deliveryQuantity: '',
        planReplenishmentDate:'',
        auditDate:'',
        productId: '',
        productName:'',
        productSpec:'',
        refundId: '',
        refundNo: "",
        refundQuantity: '',
        replenishmentQuantity: '',
        auditorId:'',
        creatorId: '',
        departmentId: '',
        departmentName:'',
        departmentValue:[],
        userRole:'',
        state:0
      },
      handle:{
        show:false,
        disabled:false,
        treatmentMethods:
        [
          {value:"SCREEN",label:i18n.t('customer.filter')},
          {value:"REWORK",label:i18n.t('customer.rework')},
          {value:"SCRAP",label:i18n.t('customer.scrap')},
          {value:"TEMPORARY_STORAGE",label:i18n.t('customer.storage')},
          {value:"SPECIAL_ADOPTION",label:i18n.t('customer.special')},
        ],
        productUnit:'',
        userId:'',
        data:{
          auditDate:'',
          state: '',
          auditorId: '',
          departmentId:'',
          endDate: '',
          qualifiedQuantity: '',
          refundId: '',
          startDate:new Date(),
          transactorId: '',
          treatmentDate:new Date(),
          treatmentDescription:'',
          treatmentHours:'',
          treatmentMethod: '',
          treatmentQuantity: '',
          treatmentRecordId: '',
          userRole:'',
        },
        discountData:{
          rows:[{
          }],
          tableData:{
            defectLocationId: '',
            defectLocationName: '',
            defectQuantity: '',
            defectRecordId: '',
            defectTypeId: '',
            defectTypeName: '',
            inspectionTypeId: '',
            inspectionTypeName: '',
            qualityLevelId: '',
            qualityLevelName: '',
            refundId: '',
            treatmentDescription: '',
            treatmentHours: ''
          },
         },
        prodBatch:{
          indeV:0,
          DefectId:'',
          iqcId:'',
          ParameterDeta:false,
          selected:false,
          disabled:true,
          turrn:false,
          ShowState:false,
          TableLength:0,
          reviewProcessShow:false,
          defectNumber:0,
          AuditStatus:'',
          productON:[],
          productNames:[],
          productSpec:[],
          productTypeName:[],
          dataTable:[],
          spectorNameData:[],
          chkshiftData:[],
          DefectName:[],
          DefectGrade:[],
          DefectPosition:[],
          chkValMapData:[],
          dataTableAll:[],
          btnState:'',
          ProcessingData:[],
        },
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
              maxWidth:40
            },{
              title: i18n.t('customer.no'),
              width:40,
              minWidth:40,
              minWidth:40,

              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm)
            },
            // {
            //   title: i18n.t('customer.project'),
            //   width:100,
            //   minWidth:100,
            //   key: 'inspectionTypeName',
            //   render: (h, params) => {
            //     let _this = this;
            //     let texts = '';
            //     texts=params.row.inspectionTypeName
            //     return h('div', {
            //         props: {
            //             },
            //     },texts)
            //   }
            // },
            {
              title: i18n.t('customer.project'),
              width:this.$store.state.locale=='zh_CN'?103:120,
              align: 'center',
              ellipsis:true,
              minWidth: this.$store.state.locale=='zh_CN'?103:120,
              key: 'inspectionTypeId',
              // render:vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(vm,(vm)=>{return vm.selects.inspectionTypes},"inspectionTypeId","name",null,this.getDefectNameList),
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
                    this.handle.disabled||this.noPermsDis,
                  )
                  return ret(h,params);
                }
            },
            {
              title: i18n.t('customer.defectName'),
              width:120,
              minWidth:120,
              key: 'defectTypeId',
              render: (h, params) => {
                let _this = this;
                return h('Select',
                  {
                    props:{
                      value: this.handle.table.data[params.index].defectTypeId,
                      disabled:this.handle.disabled||this.noPermsDis,
                      filterable:true
                    },
                    on:{
                      'on-change':(value) => {
                        this.handle.table.data[params.index].defectTypeId = value;
                        this.TesySynthesis(this.handle.table.data[params.index].defectTypeId,params.index)
                      }
                    }
                  },
                  this.handle.table.data[params.index].defectTypeList.map(function(type){
                    return h('Option', {props: {value: type.defectTypeId,label:type.name}},type);
                  })
                );
							}
            },
            {
              title: i18n.t('customer.defectLevel'),
              align: 'center',
              minWidth:this.$store.state.locale=='zh_CN'?54:100,
              key: 'qualityLevelId',
              render: (h, params) => {
                let _this = this;
                return h('Select',
                  {
                    props:{
                      value: this.handle.table.data[params.index].qualityLevelId,
                      disabled:this.handle.disabled||this.noPermsDis
                    },
                    on: {
                      'on-change':(event) => {
                        this.handle.table.data[params.index].qualityLevelId = event;
                      }
                    },
                  },
                  this.handle.prodBatch.DefectGrade.map(function(type){
                      return h('Option', {
                          props: {value: type.qltyLvId,label:type.name}
                      }, type);
                  })
							  );
							}
            },{
              title: i18n.t('customer.defectPosition'),
              width:120,
              minWidth:120,
              key: 'defectLocationId',
              render: (h, params) => {
                let _this = this;
                return h('Select',
                  {
                    props:{
                      value: this.handle.table.data[params.index].defectLocationId,
                      disabled:this.handle.disabled||this.noPermsDis
                    },
                    on: {
                      'on-change':(event) => {
                        this.handle.table.data[params.index].defectLocationId = event;
                      }
                    },
                  },
                  this.handle.prodBatch.DefectPosition.map(function(type){
                    return h('Option', {
                      props: {value: type.defectLocId,label:type.name}
                    }, type);
                  })
							  );
							}
            },{
              title: i18n.t('customer.defectNum'),
              align: 'center',
              minWidth:this.$store.state.locale=='zh_CN'?60:120,
              key: 'defectQuantity',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: me.handle.table.data[params.index].defectQuantity,
                      disabled:this.handle.disabled||this.noPermsDis
                    },
                    on: {
                      'on-blur': (event) => {
                        this.handle.table.data[params.index].defectQuantity = event.target.value
                      }
                    }
                  })
                ])
              }
            },{
              title: i18n.t('customer.treatmentRecord'),
              align: 'center',
              minWidth:150,
              key: 'treatmentDescription',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: me.handle.table.data[params.index].treatmentDescription,
                      disabled:this.handle.disabled||this.noPermsDis
                    },
                    on: {
                      'on-blur': (event) => {
                        this.handle.table.data[params.index].treatmentDescription = event.target.value
                      }
                    }
                  })
                ])
              }
            },{
              title: i18n.t('customer.treatmentTime'),
              align: 'center',
              minWidth:this.$store.state.locale=='zh_CN'?54:110,
              key: 'treatmentHours',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: me.handle.table.data[params.index].treatmentHours,
                      disabled:this.handle.disabled||this.noPermsDis
                    },
                    on: {
                      'on-blur': (event) => {
                        this.handle.table.data[params.index].treatmentHours = event.target.value;
                        // if(event.target.value<=0||isNaN(event.target.value)){
                        //   this.$Notice.warning({title:'处理工时必须是0以上数字'})
                        //   event.target.value='';
                        //   this.handle.table.data[params.index].treatmentHours='';
                        // }
                      }
                    }
                  })
                ])
              }
            },/*{
              title: '附件',
              align: 'center',
              minWidth:150,
              key: '',
              render:function (h, data) {
                return h("IqisUpload", {
                  props: {//:size="54" :edit="switchs.fileEdit" v-model="product.settings.ext"
                    "value":data.row[data.column.key],
                    "size": 32,
                    // "edit":this.uploadEdit,
                    "edit":!vm.handle.disabled&&!vm.noPermsDis,
                    "row-index": data.index,
                    "row":data.row,
                    // disabled:this.handle.disabled
                  },
                  on: {
                    input: (val) => {
                      //vm.cellDefectEditorEnd(val, data.column.key, data.index)
                    }
                  }
                })
              }
            }*/
            {
              title: i18n.t('customer.pic'),
              align: 'center',
              key: 'attachments',
              minWidth: 250,
              render:function (h, data) {
                try{
                  vm.handle.table.data[data.index].attachments.length
                }catch(err) {
                  vm.handle.table.data[data.index].attachments=[]
                }
                ////console.log('hahh',data);
                return h("IqisUpload", {
                  props: {//:size="54" :edit="switchs.fileEdit" v-model="product.settings.ext"
                    "value":data.row[data.column.key]?data.row[data.column.key]:[],
                    "size": 32,
                    "row-index": data.index,
                    "row":data.row,
                    "edit":vm.picBtnShow,
                    "maxSize":10240,
                    "fileType":['jpg','jpeg','png'],
                    "fileCount":5,
                    'chartTypeShow':"true",
                    //disabled:this.other.basicD1D2Show,
                  },
                  on: {
                    input: (val) => {
                      vm.handle.table.data[data.index].attachments.push(val[0]);
                      //vm.cellDefectEditorEnd(val, data.column.key, data.index)
                    },
                    del: (val) => {
                      vm.handle.table.data[data.index].attachments.splice(val,1);
                      //vm.cellDefectEditorEnd(val, data.column.key, data.index)
                    }
                  }
                })
              }
            }
          ]
        }
      },
      back:{
        backNum:true,
        show:false,
        discountData:{
          rows:[{
          }],
          tableData:{
            deliveryDate: "",
            deliveryNo:"",
            deliveryQuantity: "",
            deliveryRecordId: "",
            recorderId: "",
            refundId: "",
            remainQuantity: ""
          },
        },
        users:[],
        table:{
          loading:false,
          selected:false,
          data:[],
          defectNumber:0,

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
              maxWidth:40
            },{
              title: i18n.t('customer.no'),
              width:40,
              minWidth:40,
              maxWidth:40,
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),

            },{
              title: i18n.t('customer.replenishmentTime'),
              minWidth:100,
              key: 'deliveryDate',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('DatePicker',{
                    props: {
                      type: 'date',
                      // format:"yyyy-MM-dd HH:mm",
                      value: me.back.table.data[params.index].deliveryDate,
                      disabled:this.back.disabled||this.noPermsDis
                    },
                    on: {
                      'on-change': (event) => {
                        this.back.table.data[params.index].deliveryDate = event;
                      }
                    }
                  })
                ])
              }
            },{
              title: i18n.t('customer.replenishmentOrder'),
              width:this.$store.state.locale=='zh_CN'?103:150,
              minWidth:this.$store.state.locale=='zh_CN'?103:150,
              key: 'deliveryNo',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: me.back.table.data[params.index].deliveryNo,
                      disabled:this.back.disabled||this.noPermsDis
                    },
                    on: {
                      'on-blur': (event) => {
                        this.back.table.data[params.index].deliveryNo = event.target.value
                      }
                    }
                  })
                ])
              }
            },{
              title: i18n.t('customer.haveReplenishOua'),
              align: 'center',
              minWidth:54,
              key: 'deliveryQuantity',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: me.back.table.data[params.index].deliveryQuantity,
                      disabled:this.back.disabled||this.noPermsDis
                    },
                    on: {
                      'on-blur': (event) => {
                        this.back.table.data[params.index].deliveryQuantity = event.target.value;
                        for(let i=0;i<me.back.table.data.length;i++){
                          if(i===0){
                            me.back.table.data[i].remainQuantity=me.refund.replenishmentQuantity-me.back.table.data[i].deliveryQuantity;
                          }else{
                            me.back.table.data[i].remainQuantity=me.back.table.data[i-1].remainQuantity-me.back.table.data[i].deliveryQuantity;
                          }
                        }
                      }
                    }
                  })
                ])
              }
            },{
              title: i18n.t('customer.notReplenishOua'),
              align: 'center',
              minWidth:54,
              key: 'remainQuantity',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: me.back.table.data[params.index].remainQuantity,
                      disabled:true
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
              title: i18n.t('customer.recorder'),
              align: 'center',
              minWidth:100,
              key: 'recorderId',
              render: (h, params) => {
                let _this = this;
                return h('Select',
                  {
                    props:{
                      value: this.back.table.data[params.index].recorderId,
                      disabled:this.back.disabled||this.noPermsDis
                    },
                    on: {
                      'on-change':(event) => {
                        this.back.table.data[params.index].recorderId = event;
                      }
                    },
                  },
                  this.back.users.map(function(type){
                      return h('Option', {
                          props: {value:type.userId,label:type.name}
                      }, type);
                  })
							  );
							}
            }
          ]
        }
      },
      button:{
        creator:false,
        auditor:false,
        handler:false,
        handleAuditor:false,
        backer:false,
        other:false
      },
      permsCur:[
        "UPDATE_CUSTOMER_REFUND",
        "INSERT_CUSTOMER_REFUND"
      ],
      permsBtn:{
        "UPDATE_CUSTOMER_REFUND":false,
        "INSERT_CUSTOMER_REFUND":false,
      },
      noPermsDis:true,
      uploadEdit:true,
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

          that.$http.get('/basic/product/simple?page=1&limit=999999&examType=6&useState=1&fieldName=no,name&query='+query,{
            cancelToken: new this.$http.CancelToken(function executor(c) {
            that.source = c;
            })
          }).then(res =>{
            that.product = res.data
            that.loadingRemote = false;
          })

        })
      } else {
        that.product = [];
        that.loadingRemote = false;
      }
    },500),
    cancelQuest(){
      if(typeof this.source ==='function'){
        this.source('终止请求'); 
      }
    },
    getInspectiontype(){//获取检验项目下拉框
      let that=this;
      that.$http.get("/basic/inspectiontype",{params:{limit:99999999}}).then(function(resp){
        let root = {title:i18n.t('customer.projectType'),selected: false,label:i18n.t('customer.projectType'),value:0,expand:true};
        that.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
        that.selects.inspectionTypes = [root];
        // //console.log(that.selects.inspectionTypes,'检验项目数据')
      })
    },
    getDefectNameList(val,key,index,o){//获取当前检验项目下的缺陷名称列表
      if(o == null || Object.keys(o).length == 0){
        return;
      }
      //console.log('获取缺陷名称列表的参数',val,key,index,o);
      let that = this;
      this.handle.table.data = this.handle.table.data ||[];
      let newRow = this.handle.table.data[index];
      if(!newRow && this.handle.table.data[index]){
        newRow =  JSON.parse(JSON.stringify(this.handle.table.data[index]));
      }
      if(!newRow){return;}
      newRow[key] = val;
      newRow['inspectionTypeName'] = o.name;
      newRow['inspectionTypeId'] = o.inspectionTypeId;
      newRow['chkDevTypeId'] = o.chkDevTypeId;
      newRow['chkDevTypeName'] = o.chkDevTypeName;

      let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+o.inspectionTypeId);//带出缺陷名称列表
      newRow['defectTypeList'] = resp ? resp.data||[]:[];
      that.handle.table.data[index] = newRow;
      that.$set(that.handle.table.data, index, newRow);
      return;
    },
    refreshData(){
      let that = this;
      let refundId = that.$props.params && that.$props.params.refundId;
      that.getSelect();//获取下拉框数据
      that.loadSelectsData();//获取联动下拉框数据
      that.getInspectiontype();

      if(refundId){//其他任何编辑
        that.refund.refundId = refundId;
        that.getData();
      }else{//添加
        that.getBlock();
        that.refund.isReplenishment=1;
      }
      if((!that.refund.refundId&&that.permsBtn.INSERT_CUSTOMER_REFUND)||(that.refund.refundId&&that.permsBtn.UPDATE_CUSTOMER_REFUND)){
        that.noPermsDis=false;
      }else{
        that.noPermsDis=true;
      }

    },
    getData(){
      let that = this;
      that.loadSelectsData(function(){
        that.$http.get('/customer/refund/'+that.refund.refundId).then(function(resp){

          //合并数据
          let item = resp.data;
          // that.$iqis.utils.deepMerge(that.refund,item);
          that.refund=item;
          //渲染时间数据
          item.createTime = new Date(item.createTime);
          item.auditDate =item.auditDate?new Date(item.auditDate):'';
          item.refundDate=new Date(item.refundDate);
          item.planReplenishmentDate=new Date(item.planReplenishmentDate);

          //渲染部门数据
          let result = that.$iqis.utils.findPathInTree(that.departments[0],[],item.departmentId,"departmentId");
          result = result || [];
            //console.log(that.departments[0])
          item.departmentValue = result;
          // 再次合并
          that.refund=item;
          if(that.refund.isReplenishment==1){
            that.back.backNum=true;
          }else{
            that.back.backNum=false;
          }
          // 获取产品信息
          that.getProduct(item.productId);

          that.getBlock();
          // 获得内容模块
        })
      })

    },
    getBlock(){

      let that = this;
      //console.log(that.refund.state)
      //console.log(that.refund.userRole)
      if(that.refund.state == 0){//添加客退
        that.refund.show=true;
        that.button.creator=true;
      }
      else if(that.refund.state == 2){//退货审核驳回
        that.refund.show=true;
        if(that.refund.userRole.indexOf('CREATOR')!==-1){
          that.button.creator=true;
        }else{
          that.refund.disabled=true;
          that.button.other=true;
        }
      }
      else if(that.refund.state == 1){//退货待审核
        that.refund.show=true;
        that.refund.disabled=true;
        if(that.refund.userRole.indexOf('AUDITOR')!==-1){
          that.button.auditor=true;
        }
        // else if(that.refund.userRole.indexOf('CREATOR')!==-1){
        //   that.button.creator=true;
        // }
        else{
          that.button.other=true;
        }
      }else if(that.refund.state==3||that.refund.state==4||that.refund.state==6){//待处理，处理中，处理驳回
        that.uploadEdit=false;
        that.refund.show=true;
        that.handle.show=true;
        that.refund.disabled=true;
       
        that.$http.get('/customer/refund/treatmentrecord/'+that.refund.refundId).then(function(resp){
          that.handle.data=resp.data;
          for(let i in that.handle.table.data){
            that.handle.table.data[i]['defectNumber']=i
          }

          if(that.refund.state==3){
            that.handle.data.startDate='';
            that.handle.data.endDate='';
            that.handle.data.treatmentDate=new Date();
          }else{
            that.handle.data.treatmentDate=new Date(that.handle.data.treatmentDate);
            that.handle.data.startDate=new Date(that.handle.data.startDate);
            that.handle.data.endDate=new Date(that.handle.data.endDate);
          }
          that.handle.data.auditDate=that.handle.data.auditDate?new Date(that.handle.data.auditDate):'';
          
          // if(that.refund.state==3&&that.refund.userRole.indexOf('AUDITOR')!==-1){
          //   that.button.auditor=true;
          //   that.handle.disabled=true;
          // }
          if(that.handle.data.userRole.indexOf('PROCESSOR')!==-1){
            that.button.handler=true;
            that.handle.data.transactorId=that.handle.userId;
          }
          else{
            that.handle.disabled=true;
            that.button.other=true;
          }
        })
        that.handle.table.loading=true;
        that.getDefectData();


      }else if(that.refund.state==5){//处理待审核
        that.refund.show=true;
        that.handle.show=true;
        that.refund.disabled=true;
        that.handle.disabled=true;
        that.handle.table.loading=true;
        that.$http.get('/customer/refund/treatmentrecord/'+that.refund.refundId).then(function(resp){
          that.handle.data=resp.data;
          that.handle.data.auditDate=that.handle.data.auditDate?new Date(that.handle.data.auditDate):'';
          that.handle.data.treatmentDate=new Date(that.handle.data.treatmentDate);
          that.handle.data.startDate=new Date(that.handle.data.startDate);
          that.handle.data.endDate=new Date(that.handle.data.endDate);
          //console.log(that.handle.data)
          if(that.handle.data.userRole.indexOf('AUDITOR')!==-1){
            that.button.handleAuditor=true;
          }else{
            that.button.other=true;
          }
          that.getDefectData();
        })

      }else if(that.refund.state==7 ||that.refund.state==8){//待归还，归还中
        that.refund.show=true;
        that.handle.show=true;
        that.back.show=true;
        that.refund.disabled=true;
        that.handle.disabled=true;
        that.$http.get('/customer/refund/treatmentrecord/'+that.refund.refundId).then(function(resp){
          that.handle.data=resp.data;
          that.handle.data.auditDate=that.handle.data.auditDate?new Date(that.handle.data.auditDate):'';
          that.handle.data.treatmentDate=new Date(that.handle.data.treatmentDate);
          that.handle.data.startDate=new Date(that.handle.data.startDate);
          that.handle.data.endDate=new Date(that.handle.data.endDate);
          
          if(that.refund.userRole.indexOf('CREATOR')!==-1){
            that.button.backer=true;
          }
          // else if(that.refund.state==7&&that.refund.userRole.indexOf('AUDITOR')!==-1){
          //   that.button.auditor=true;
          //   // that.back.show=false;
          //   that.back.disabled=true;
          // }
          else{
            that.back.disabled=true;
            that.button.other=true;
          }
          that.getDefectData();
          that.getDeliveryData();
        })

      }else if(that.refund.state==9){//已结案
        that.refund.show=true;
        that.handle.show=true;
        that.back.show=true;
        that.refund.disabled=true;
        that.handle.disabled=true;
        that.back.disabled=true;
        that.button.other=true;
        if(that.refund.isReplenishment==0){//不归还的数据结案后不显示处理和归还记录
          that.handle.show=false;
          that.back.show=false;
        }
        that.$http.get('/customer/refund/treatmentrecord/'+that.refund.refundId).then(function(resp){
          that.handle.data=resp.data;
          that.handle.data.auditDate=that.handle.data.auditDate?new Date(that.handle.data.auditDate):'';          
          that.handle.data.treatmentDate=new Date(that.handle.data.treatmentDate);
          that.handle.data.startDate=new Date(that.handle.data.startDate);
          that.handle.data.endDate=new Date(that.handle.data.endDate);
        });
        that.getDefectData();
        that.getDeliveryData();
      }
      

    },
    // 创建部分（添加部分）-----------------------------------------------------
    getSelect(){//获得下拉框数据
      let that = this;
      that.$http.all([
        that.$http.get("/bas/customerList",{params:{limit:99999999}}),
        that.$http.get("/systemManage/allDepartment",{params:{limit:999999999}}),
        that.$http.get("/tenant/user",{params:{limit:999999999}}),
        // that.$http.get("/basic/product",{params:{limit:999999999,examType:4, useState:1, page:1}}),
        that.$http.get("/tenant/user/profile"),
        // that.$http.get("/basic/product",{params:{limit:999999999,examType:2, useState:1, page:1}}),
      ]).then(function(resps){
          that.customerList = resps[0].data;
          that.allDepartment = resps[1].data;
          that.user = resps[2].data;
          // that.product = resps[3].data;
          that.refund.creatorId=resps[3].data.userId;
          that.handle.userId=resps[3].data.userId;
          // let newData = []
          // for(let i in that.product){
          //   newData.push(that.product[i].productId)
          // }
          // for(let i in resps[5].data){
          //   if(newData.indexOf(resps[5].data[i].productId)==-1){
          //     that.product.push(resps[5].data[i])
          //   }
          // }
      });
    },
    loadSelectsData(callback){//获取数据
      let that = this;
      this.$http.get("/systemManage/department",{params:{limit:99999999}}).then(function(resps){
        let root = {title:i18n.t('customer.departmentType'),selected: false,label:i18n.t('customer.departmentType'),value:0,expand:true};
        if(resps.data){
          that.$iqis.utils.treeify(resps.data,root,"departmentId",function(item){
            return item.departmentName;
          },"parentId");
        }
        that.departments = [root];
        callback && callback();
      })
    },
    loadTypeRender(label){//处理联动选择框的数据A/B/C为C  render-format
      if(!label || label.length == 0){
        return '-';
      }
      let result = label[label.length-1];

      if( (this.departments.length > 0  && result == this.departments[0].label)){
        return '-'
      }
      // return result;

      this.refund.departmentName= result;
      return result;
    },
    getProduct(id){//获取产品编号/名称/规模型号
      let that =this;
      that.$http.get("/basic/product/"+id).then(function (resp) {
        that.refund.productName=resp.data.name;
        that.refund.productSpec=resp.data.spec;
        that.handle.productUnit=resp.data.prodUnitName;
      });
    },
    create(){//添加客退，提交客退
      let that = this;
      let params = [
        {type:'Empty',title:i18n.t('customer.returnTime'),value:that.refund.refundDate},
        {type:'Empty',title:i18n.t('customer.returnNo'),value:that.refund.refundNo},
        {type:'No',title:i18n.t('customer.returnNo'),value:that.refund.refundNo},
        {type:'Empty',title:i18n.t('customer.returnCustomer'),value:that.refund.customerId},
        {type:'Empty',title:i18n.t('customer.productNo'),value:that.refund.productId},
        {type:'Empty',title:i18n.t('customer.outgoingQuantity'),value:that.refund.deliveryQuantity},
        {type:'NumNot0',title:i18n.t('customer.outgoingQuantity'),value:that.refund.deliveryQuantity},
        {type:'Empty',title:i18n.t('customer.returnQuantity'),value:that.refund.refundQuantity},
        {type:'NumNot0',title:i18n.t('customer.returnQuantity'),value:that.refund.refundQuantity},
        {type:'Empty',title:i18n.t('customer.replenishmentQuantity'),value:that.refund.replenishmentQuantity},
        {type:'NumNot0',title:i18n.t('customer.replenishmentQuantity'),value:that.refund.replenishmentQuantity},
        {type:'Empty',title:i18n.t('customer.planReturnTime'),value:that.refund.planReplenishmentDate},
        {type:'EmptyLength',title:i18n.t('customer.processingDepartment'),value:that.refund.departmentValue},
        {type:'Empty',title:i18n.t('customer.auditor'),value:that.refund.auditorId},
      ]
      if(that.refund.isReplenishment==0){
        params.splice(9,3)
      }
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
      // if(Number(that.refund.refundQuantity)>Number(that.refund.deliveryQuantity)){
      //   that.$Notice.warning({title:'退货数量不能大于出货数量'});
      //   return;
      // }
      // if(that.refund.isReplenishment==1&&Number(that.refund.replenishmentQuantity)>Number(that.refund.refundQuantity)){
      //   that.$Notice.warning({title:'归还数量不能大于退货数量'});
      //   return;
      // }
      let newData = {
        refundDate:(new Date(that.refund.refundDate)).getTime(),
        refundNo:that.refund.refundNo,
        customerId:that.refund.customerId,
        customerName:that.refund.customerName,
        isReplenishment:that.refund.isReplenishment,
        productId:that.refund.productId,
        productNo:that.refund.productNo,
        productName:that.refund.productName,
        productSpec:that.refund.productSpec,
        deliveryQuantity:that.refund.deliveryQuantity,
        refundQuantity:that.refund.refundQuantity,
        replenishmentQuantity:that.refund.replenishmentQuantity,
        planReplenishmentDate:(new Date(that.refund.planReplenishmentDate)).getTime(),
        batchNo:that.refund.batchNo,
        auditorId:that.refund.auditorId,
        departmentId:that.refund.departmentId,
        departmentName:that.refund.departmentName,
        state:that.refund.state,
        auditDate:(new Date(that.refund.auditDate)).getTime()||'',
        createTime:(new Date(that.refund.createTime)).getTime(),
        creatorId:that.refund.creatorId,
        refundId:that.refund.refundId,
        userRole:that.refund.userRole
      };
      // alert(newData.auditDate)
      let departmentId = null;
      if(that.refund.departmentValue && that.refund.departmentValue.length > 0){
        departmentId = that.refund.departmentValue[that.refund.departmentValue.length-1];
      }
      newData.departmentId = departmentId;

      if(that.refund.refundId){
        that.$http.put("/customer/refund/"+that.refund.refundId,newData,that.headers).then(function (resp) {
          that.$Message.success(i18n.t('customer.commitSuccess'));
          that.closePage();
        })
      }else{
        that.$http.post("/customer/refund",newData,that.headers).then(function (resp) {
          that.$Message.success(i18n.t('customer.commitSuccess'));
          that.closePage();

        })
      }

    },
    createPass(){//添加审核通过
      let that = this;
      that.refund.auditDate=new Date();
      that.$http.post('/customer/refund/audit',{refundId:that.refund.refundId,checked:1}).then(function(resp){
        that.$Message.success(i18n.t('customer.auditSuccess'));
        that.closePage();
      })
    },
    createNotPass(){//添加审核驳回
      let that = this;
      that.refund.auditDate=new Date();
      that.$http.post('/customer/refund/audit',{refundId:that.refund.refundId,checked:0}).then(function(resp){
        that.$Message.success(i18n.t('customer.auditSuccess'));
        that.closePage();

      })
    },
    // 缺陷部分-----------------------------------------------------
    getDefectData(){//获取缺陷记录
      let that=this;
      that.$http.get('/customer/refund/defectrecord?refundId='+that.refund.refundId).then(function(resp){
        that.handle.table.data=resp.data;
        if(that.handle.table.data){
          for(let i in that.handle.table.data){
            let inspectionTypeId = that.handle.table.data[i].inspectionTypeId;
            let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+inspectionTypeId);//带出缺陷名称列表
            let defectTypeList = resp ? resp.data||[] : [];
            that.handle.table.data[i]['defectTypeList'] = defectTypeList;
            if(!that.handle.table.data[i].defectLocationId){
              that.handle.table.data[i].defectLocationId=i18n.t('customer.null');
            }
          }
        }
        that.defecttypeD();
        that.DefectGradeData();
        that.DefectPositionData();
        that.handle.table.loading=false;
      })
    },
    defecttypeD(){//获取缺陷名称
      let that=this;
      let idValueMap = [];
      let url="/basic/defecttype?page=1&limit=9999"
      that.$http.get(url).then((res)=>{
        let urlProduct=res.data;
        that.handle.prodBatch.DefectName=res.data;
      })
    },
    TesySynthesis(obj,index){//检验项目
      let that=this;
      for(let x in that.handle.prodBatch.DefectName){
        if(obj==that.handle.prodBatch.DefectName[x].defectTypeId){
          that.handle.table.data[index].inspectionTypeId=that.handle.prodBatch.DefectName[x].inspectionTypeId;
          that.handle.table.data[index].inspectionTypeName=that.handle.prodBatch.DefectName[x].inspectionTypeName;
          that.handle.table.data[index].qualityLevelId=that.handle.prodBatch.DefectName[x].qltyLvId;
          // that.handle.table.data[index].defectLocationId=that.handle.prodBatch.DefectName[x].defectLocId;
          that.DefectGradeData(that.handle.prodBatch.DefectName[x].qltyLvId,index)
        }
      }
    },
    DefectGradeData(Lvid,index){//缺陷等级
      let that=this;
      let idValueMap = [];
      let url="/basic/qltylv?page=1&limit=99999"
      that.$http.get(url).then((res)=>{
        let urlProduct=res.data
        that.handle.prodBatch.DefectGrade=urlProduct;
        for(let x in that.handle.prodBatch.DefectGrade){
          if(Lvid==that.handle.prodBatch.DefectGrade[x].qltyLvId){
            that.handle.table.data[index].qualityLevelName=that.handle.prodBatch.DefectGrade[x].name;
          }
        }
      })
    },
    DefectPositionData(){//缺陷位置
      let that=this;
      let url="/basic/defectloc?page=1&limit=99999"
      that.$http.get(url).then((res)=>{
        that.handle.prodBatch.DefectPosition=res.data
        that.handle.prodBatch.DefectPosition.unshift({defectLocId:i18n.t('customer.null'),name:i18n.t('customer.null')});
      })
    },
    addDefect(){//添加缺陷
      let that=this;
      let obj = JSON.parse(JSON.stringify(that.handle.discountData.tableData))
      that.handle.table.data.push(obj)
      let index=that.handle.table.data.length
      that.handle.table.data[index-1].defectNumber=index-1
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((index-5)*43);
        $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');

      })
    },
    deleteDefect(){//删除缺陷
      let that = this;
      let ss = this.$refs.defectTable.getSelection();
      for(let i=0;i<that.handle.table.data.length;i++){
        for(let j=0;j<ss.length;j++){
          if(that.handle.table.data[i].defectNumber===ss[j].defectNumber){
              that.handle.table.data.splice(i,1)
          }
        }
      }
    },
    // 处理部分-----------------------------------------------------
    handleSave(requestMethod){//处理保存，缺陷保存
    // //console.log(requestMethod,'处理保存失效')
      let that=this;
      let params = [
        {type:'Empty',title:i18n.t('customer.startTime'),value:that.handle.data.startDate},
        {type:'Empty',title:i18n.t('customer.endTime'),value:that.handle.data.endDate},
        {type:'Empty',title:i18n.t('customer.treatmentMethod'),value:that.handle.data.treatmentMethod},
        {type:'Empty',title:i18n.t('customer.treatmentQuantity'),value:that.handle.data.treatmentQuantity},
        {type:'NumNot0',title:i18n.t('customer.treatmentQuantity'),value:that.handle.data.treatmentQuantity},
        {type:'Empty',title:i18n.t('customer.qualifiedQuantity'),value:that.handle.data.qualifiedQuantity},
        {type:'NumNot0',title:i18n.t('customer.qualifiedQuantity'),value:that.handle.data.qualifiedQuantity},
        {type:'Empty',title:i18n.t('customer.treatmentTime'),value:that.handle.data.treatmentHours},
        {type:'Num',title:i18n.t('customer.treatmentTime'),value:that.handle.data.treatmentHours},
        {type:'Empty',title:i18n.t('customer.treatmentInstructions'),value:that.handle.data.treatmentDescription},
        {type:'Word600',title:i18n.t('customer.treatmentInstructions'),value:that.handle.data.treatmentDescription},
        {type:'Empty',title:i18n.t('customer.auditor'),value:that.handle.data.auditorId},
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
      // if(that.refund.isReplenishment==1&&Number(that.handle.data.treatmentQuantity)>Number(that.refund.replenishmentQuantity)){
      //   that.$Notice.warning({title:'处理数量不能大于归还数量'});
      //   return;
      // }else if(Number(that.handle.data.treatmentQuantity)>Number(that.refund.refundQuantity)){
      //   that.$Notice.warning({title:'处理数量不能大于退货数量'});
      //   return;
      // }
      // if(Number(that.handle.data.qualifiedQuantity)>Number(that.handle.data.treatmentQuantity)){
      //   that.$Notice.warning({title:'合格数量不能大于处理数量'});
      //   return;
      // }
      that.handle.data.auditDate=(new Date(that.handle.data.auditDate)).getTime();//会报错
      that.handle.data.endDate=(new Date(that.handle.data.endDate)).getTime();
      that.handle.data.startDate=(new Date(that.handle.data.startDate)).getTime();
      that.handle.data.treatmentDate=(new Date(that.handle.data.treatmentDate)).getTime();

      that.handle.data.auditState=that.refund.state;
      that.handle.data.state=that.refund.state;

      if(that.handle.table.data.length>0){
        for(let i=0;i<that.handle.table.data.length;i++){
          that.handle.table.data[i].refundId=that.handle.data.refundId;
          if(that.handle.table.data[i].defectTypeId==''|| that.handle.table.data[i].qualityLevelId=='' || that.handle.table.data[i].defectLocationId==''  ||  that.handle.table.data[i].defectQuantity===''|| that.handle.table.data[i].treatmentDescription==''|| that.handle.table.data[i].treatmentHours===''){
            // if(that.handle.table.data[i].defectTypeId==''&& that.handle.table.data[i].qualityLevelId=='' && that.handle.table.data[i].defectLocationId==''  &&  that.handle.table.data[i].defectQuantity==''&& that.handle.table.data[i].treatmentDescription==''&& that.handle.table.data[i].treatmentHours===''){
            //   that.$Notice.warning({title: '请删除空白数据'});
            //   return;
            // }else{
              that.$Notice.warning({title: i18n.t('customer.pleaseInput')+i18n.t('customer.defectRecord')+ ( i + 1) });
              return;
            // }
          }
          let paramsDefects = [
            {type: 'Num', title: i18n.t('customer.defectNum'), value: that.handle.table.data[i].defectQuantity},
            {type: 'Word20', title: i18n.t('customer.treatmentRecord'), value: that.handle.table.data[i].treatmentDescription},
            {type: 'Num', title: i18n.t('customer.treatmentTime'), value: that.handle.table.data[i].treatmentHours},
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
          if(that.handle.table.data[i].defectLocationId==i18n.t('customer.null')){
            that.handle.table.data[i].defectLocationId='';
          }

        }
      }

      that.$http.post('/customer/refund/defectrecord?refundId='+that.handle.data.refundId,that.handle.table.data,that.headers).then(function(resp){
        //console.log('缺陷保存成功！')
        if(requestMethod=='save'){
          that.$http.post('/customer/refund/treatmentrecord',that.handle.data,that.headers).then(function(resp){
              that.$Message.success(i18n.t('customer.saveSuccess'));
              for(let i = 0; i<that.handle.table.data.length; i++){
                if(!that.handle.table.data[i].defectLocationId){
                  that.handle.table.data[i].defectLocationId=i18n.t('customer.null');
                }
              }
              that.handle.data.auditDate=new Date(that.handle.data.auditDate);
              that.handle.data.endDate=new Date(that.handle.data.endDate);
              that.handle.data.startDate=new Date(that.handle.data.startDate);
              that.handle.data.treatmentDate=new Date(that.handle.data.treatmentDate);
          })//保存处理记录
        }else if(requestMethod=='submit'){
          that.$http.post('/customer/refund/treatmentrecord',that.handle.data,that.headers).then(function(resp){
            that.$http.post('/customer/refund/treatmentrecord/apply?treatmentRecordId='+that.handle.data.treatmentRecordId,that.headers).then(function(resp){
              that.$Message.success(i18n.t('customer.commitSuccess'));
              that.closePage();
            })//提交处理记录
          })
          this.closePage();
        }
      })






    },
    handlePass(){//处理审核通过
      let that = this;
      that.$http.post('/customer/refund/treatmentrecord/audit?treatmentRecordId='+that.handle.data.treatmentRecordId+'&checked=1').then(function(resp){
        that.$Message.success(i18n.t('customer.auditSuccess'));
        that.closePage();
      })
    },
    handleNotPass(){//处理审核驳回
      let that = this;
      that.$http.post('/customer/refund/treatmentrecord/audit?treatmentRecordId='+that.handle.data.treatmentRecordId+'&checked=0').then(function(resp){
        that.$Message.success(i18n.t('customer.auditSuccess'));
        that.closePage();
      })
    },

    // 归还部分-----------------------------------------------------

    getDeliveryData(){//获取归还记录
      let that =this;
      that.$http.get('/customer/refund/deliveryrecord?refundId='+that.refund.refundId).then(function(resp){
        that.back.table.data=resp.data;
        for(let i=0;i<resp.data.length;i++){
          that.back.table.data[i].deliveryDate=new Date(that.back.table.data[i].deliveryDate);
          that.back.table.data[i]['defectNumber']=i
        }
      })
      that.getRecorderId();
    },
    getRecorderId(userName,index){//获取记录人
      let that=this;
      let idValueMap = [];
      let url="/tenant/user"
      that.$http.get(url).then((res)=>{
        let users=res.data
        that.back.users=users;
        for(let x in that.back.users){
          if(userName==that.back.users[x].name){
            that.back.table.data[x].recorderId=that.back.users[x].userId;
          }
        }
      })
    },
    addDelivery(){//添加归还
      let that=this;
      let obj = JSON.parse(JSON.stringify(that.back.discountData.tableData))
      that.back.table.data.push(obj)
      let index=that.back.table.data.length
      that.back.table.data[index-1].defectNumber=index-1
      that.back.table.data[index-1].recorderId=that.handle.userId
    },
    deleteDelivery(){//删除缺陷
      let that = this;
      let ss = this.$refs.deliveryTable.getSelection();
      for(let i=0;i<that.back.table.data.length;i++){
        for(let j=0;j<ss.length;j++){
          if(that.back.table.data[i].defectNumber===ss[j].defectNumber){
              that.back.table.data.splice(i,1)
          }
        }
      }
    },
    deliverySave(requestMethod){//保存归还记录
      let that=this;
      if(that.back.table.data.length<1){
        that.$Notice.warning({title: i18n.t('customer.replenishmentRecordNull')});
        return;
      }
      // //console.log(that.back.table.data)
      // //console.log('-------------------------------')
      for(let i=0;i<that.back.table.data.length;i++){
        if(that.back.table.data[i].deliveryDate=='' || that.back.table.data[i].deliveryNo==''  ||  that.back.table.data[i].deliveryQuantity===''|| that.back.table.data[i].remainQuantity==='' || that.back.table.data[i].recorderId==''){
          // if(that.back.table.data[i].deliveryDate=='' && that.back.table.data[i].deliveryNo==''  &&  that.back.table.data[i].deliveryQuantity===''&& that.back.table.data[i].remainQuantity==='' && that.back.table.data[i].recorderId==''){
          //   that.$Notice.warning({title: '请删除空白记录'});
          //   return;
          // }else{
            that.$Notice.warning({title: i18n.t('customer.pleaseInput')}+i18n.t('customer.replenishmentRecord'));
            return;
          // }
          // return;
        }
        let paramsDefects = [
          {type: 'No', title: i18n.t('customer.replenishmentOrder'), value: that.back.table.data[i].deliveryNo},
          {type: 'NumNot0', title: i18n.t('customer.haveReplenishmentOuantity'), value: that.back.table.data[i].deliveryQuantity},
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
        // if(that.back.table.data[0].deliveryQuantity>that.refund.replenishmentQuantity){
        //   that.$Notice.warning({title: '已归还数量不得大于上次待归还数量'});
        //   return;
        // }
        // if(i>0&&that.back.table.data[i].deliveryQuantity>that.back.table.data[i-1].remainQuantity){
        //   that.$Notice.warning({title: '已归还数量不得大于上次待归还数量'});
        //   return;
        // }

      }
      for(let i=0;i<that.back.table.data.length;i++){
        that.back.table.data[i].refundId=that.refund.refundId;
        that.back.table.data[i].deliveryDate=(new Date(that.back.table.data[i].deliveryDate)).getTime();
      }
      that.refund.state=that.refund.state;
      if(requestMethod=='save'){
        that.$http.post('/customer/refund/deliveryrecord?refundId='+that.refund.refundId,that.back.table.data,that.headers).then(function(resp){
          that.$Message.success(i18n.t('customer.saveSuccess'));
          for(let i=0;i<resp.data.length;i++){
            that.back.table.data[i].deliveryDate=new Date(that.back.table.data[i].deliveryDate);
          }
        })//保存归还
      }else if(requestMethod=='submit'){
        that.$http.post('/customer/refund/deliveryrecord?refundId='+that.refund.refundId,that.back.table.data,that.headers).then(function(resp){
          that.$http.post('/customer/refund/complete?refundId='+that.refund.refundId).then(function(resp){
            that.$Message.success(i18n.t('customer.endSuccess'));
            that.closePage();
          })
        })//结案
      }

    },
    closePage(){
      this.$emit("close-tab",this.$props.tabKey);
    },
    getTableLength(){
      let that = this;
      let ss = this.$refs.defectTable.getSelection();
      that.TableLength=ss.length;
    }
  },
  computed:{
    backOrNo(){
      if(this.refund.isReplenishment==1){
        return this.back.backNum=true;
      }else{
        return this.back.backNum=false;
      }
    },
    picBtnShow(){
      if(!this.handle.disabled&&!this.noPermsDis){
        return true
      }else{
        return false
      }
    }
  },
  watch:{
    "picBtnShow":function(flag){
      if(!flag){
        console.log($('.defectTable'),'1')
        $('.defectTable').addClass('picBtnHide')
      }else{
        console.log($('.defectTable'),'2')
        $('.defectTable').removeClass('picBtnHide')
      }
    }
  }
}



      // that.$http.get("/tenant/user").then(function (resp) {
      //   that.data=resp.data;
      //   that.okdata();
      // });
      //提交表单，触发事件，获取所有数据，处理数据，再传输数据
      // function aaa(b){
      //   c=1+b;
      //   return c;
      // }
      // aaa=aaa(1);
      // aaa==2
    //okdata(){
      // let that=this;
      // let customerId=[];
      // that.data.forEach((e)=>{
      //   for(let i=0;i<customerId.length;i++){
      //     if(customerId[i].name !=e.name){
      //       customerId[i].name.push(e.name)
      //       return
      //     }
      //   }
      //   customerId.push({
      //     name:[e.name]
      //   })
      // })
      // that.refund.customerId = customerId;

    // }
</script>
<style>
.noBorder .ivu-select-selection,
.noBorder .ivu-select:focus .ivu-select-selection,
.noBorder .ivu-input
{
  border:0!important;
  border-color:transparent!important;
  box-shadow:0 none!important;
  outline: none!important;
}
.ivu-select-input[disabled]{
  color: #666;
}
</style>
