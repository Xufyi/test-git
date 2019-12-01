<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t('iqc.basicInfo')}}
      </div>
      
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('iqc.productNo')}}</div>
            <div class="iqis-page-block-ctrl">
            <Select :label="ruleForm.productNo" remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.productId" :disabled='inputDisbale||noPermsDis' filterable @on-change="changeProductId(ruleForm.productId)">
                <Option v-for="items in productSimple" :value="items.productId" :label="items.no" :key="items.productId">{{ items.no}}/{{ items.name}}</Option>
            </Select>
            <!-- <i-input  v-if='inputDisbale' v-model="ruleForm.productNo" :disabled='inputDisbale' style="width: 100%;"></i-input> -->
            </div>
            <div class="iqis-page-block-label">{{$t('iqc.supplier')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('null')" v-model="ruleForm.manufacturerId" :disabled='inputDisbale||noPermsDis' filterable>
                <Option value=" ">{{$t('iqc.null')}}</Option>
                <Option v-for="item in prodBatch.dataTable" :value="item.manufacturerId" :key="item.manufacturerId">{{ item.manufacturerAbbreviation }}</Option>
              </Select>
            </div>
            <div class="iqis-page-block-label">{{$t('iqc.iqcNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  v-model="ruleForm.iqcNo" :disabled='inputDisbale||noPermsDis' style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('iqc.productName')}}</div>

            <div class="iqis-page-block-ctrl">
            <!-- <Select v-model="ruleForm.productId"  v-if='!inputDisbale' :disabled="prodBatch.disabled||noPermsDis">
                <Option v-for="(items,index) in prodBatch.productNames" :value="items.productId" :label="items.name" :key="index">{{ items.name}}</Option>
            </Select>
            <i-input  v-if='inputDisbale' v-model="ruleForm.productName" :disabled='prodBatch.disabled' style="width: 100%;"></i-input> -->
            <i-input  v-model="ruleForm.productName" disabled style="width: 100%;"></i-input>

            </div>
            <div class="iqis-page-block-label">{{$t('iqc.productBatch')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  v-model="ruleForm.batch" :disabled='inputDisbale||noPermsDis' style="width: 100%;"></i-input>
            </div>
            <!-- <div class="iqis-page-block-label">报告编号</div>
            <div class="iqis-page-block-ctrl">
              <i-input  v-model="ruleForm.reportNo" :disabled='inputDisbale||noPermsDis'  style="width: 100%;"></i-input>
            </div> -->
            <div class="iqis-page-block-label">{{$t('iqc.createTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" v-model="ruleForm.DataTime" :clearable='false' :disabled='inputDisbale||noPermsDis' style="width: 100%"></Date-picker>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('iqc.productSpec')}}</div>
            <div class="iqis-page-block-ctrl">
            <!-- <Select v-model="ruleForm.productId" v-if='!inputDisbale'  :disabled="prodBatch.disabled||noPermsDis">
                <Option v-for="(items,index) in prodBatch.productSpec" :value="items.productId" :label="items.spec" :key="index">{{ items.spec}}</Option>
            </Select>
            <i-input  v-if='inputDisbale' v-model="ruleForm.productSpec" :disabled='prodBatch.disabled' style="width: 100%;"></i-input> -->
            <i-input  v-model="ruleForm.productSpec" disabled style="width: 100%;"></i-input>


            </div>
            <div class="iqis-page-block-label">{{$t('iqc.batchNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  v-model="ruleForm.totalQuantity" number :disabled='inputDisbale||noPermsDis' style="width: 100%;" @on-blur ="getAql(ruleForm.totalQuantity,'select')">
                <span slot="append">{{ruleForm.prodUnitName}}</span>
              </i-input>
            </div>
            <div class="iqis-page-block-label">{{$t('iqc.inspector')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.inspectorId" :disabled='inputDisbale||noPermsDis' filterable>
                <Option v-for="item in prodBatch.spectorNameData" :value="item.inspectorId" :key="item.inspectorId">{{ item.inspectorName }}</Option>
              </Select>
            </div>
            

          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('iqc.prodType')}}</div>
            <div class="iqis-page-block-ctrl">
            <!-- <Select v-model="ruleForm.prodTypeId"  v-if='!inputDisbale' :disabled="prodBatch.disabled||noPermsDis" >
                <Option v-for="(items,index) in prodBatch.productTypeName" :value="items.prodTypeId"  :key="index">{{ items.name}}</Option>
            </Select>
            <i-input  v-if='inputDisbale' v-model="ruleForm.prodTypeName" :disabled='prodBatch.disabled' style="width: 100%;"></i-input> -->
            <i-input  v-model="ruleForm.prodTypeName" disabled style="width: 100%;"></i-input>
            

            </div>
            <div class="iqis-page-block-label">{{$t('iqc.workTime')}}</div>
            <div class="iqis-page-block-ctrl">
            <Select :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.chkShiftId" :disabled='inputDisbale||noPermsDis' filterable>
                <Option v-for="item in prodBatch.chkshiftData" :value="item.chkShiftId" :key="item.chkShiftId">{{ item.name }}</Option>
              </Select>
            </div>
            
          </i-col>
        </Row>
        
        
        
        <Row type="flex" :gutter="24">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('iqc.qcExplain')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="ruleForm.qcExplain" :disabled='inputDisbale||noPermsDis' style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24">
          <i-col span="24">
           <div class="iqis-page-block-title">{{$t('iqc.prodFile')}}</div>
           <dragImageView :productId="ruleForm.productId"></dragImageView>
          </i-col>
        </Row>
        <div style="margin-top:20px;background-color: #fafafa;padding: 24px 24px 4px 24px;" v-show="samplingPlanType==0">
          <table class="tt-tip-table" style="width: 100%;">
            <tr>
              <td style="width: 40%;">
                <div class="tt-tip-row">
                  <span class="tt-tip-label">{{$t('iqc.samplingPlan')}}：</span>
                  <span v-if="fromProduct.qcType=='105E'">{{$t('iqc.105E')}}</span>
                  <span v-else-if="fromProduct.qcType=='Z1-4'">{{$t('iqc.Z1-4')}}</span>
                  <span v-else-if="fromProduct.qcType=='0D'">{{$t('iqc.0D')}}</span>
                  <span v-else-if="fromProduct.qcType=='GB/T2828.1-2012'">{{$t('iqc.GB')}}</span>
                  <span v-else-if="fromProduct.qcType=='full'">{{$t('product.fullSampling')}}</span>
                  <span v-else-if="fromProduct.qcType=='percent'">{{$t('product.percentSampling')}}</span>
                </div>
                <div class="tt-tip-row"><span class="tt-tip-label">{{$t('iqc.inspectionStandard')}}：</span>
                  <span v-if="fromProduct.qcType=='0D'&&fromIqc.inspectionStandard==1">{{$t('iqc.0DInspection')}}</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==1">{{$t('iqc.normalInspection')}}Ⅰ</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==2">{{$t('iqc.normalInspection')}}Ⅱ</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==3">{{$t('iqc.normalInspection')}}Ⅲ</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==101">{{$t('iqc.specialInspection')}} S1</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==102">{{$t('iqc.specialInspection')}} S2</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==103">{{$t('iqc.specialInspection')}} S3</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==104">{{$t('iqc.specialInspection')}} S4</span>
                  <span v-else-if="!fromIqc.inspectionStandard">-</span>
                  <span v-else>{{fromIqc.inspectionStandard}}%</span>
                </div>
                <div class="tt-tip-row"><span class="tt-tip-label">{{$t('iqc.kyRule')}}：</span>
                  <span v-if="fromProduct.lenientTransfer=='NORMAL'">{{$t('iqc.normal')}}</span>
                  <span v-else-if="fromProduct.lenientTransfer=='SOFTEN'">{{$t('iqc.relax')}}</span>
                  <span v-else-if="fromProduct.lenientTransfer=='STRICTER'">{{$t('iqc.strict')}}</span>
                  <span v-else>-</span>
                </div>
                <div class="tt-tip-row"><span class="tt-tip-label">{{$t('iqc.sampleQua')}}：</span>{{forCrTable.sampleNum}}</div>
              </td>
              <td style="width: 40%;">
                <div class="tt-tip-row">
                  <span class="tt-tip-text"></span><span class="tt-tip-text">AQL</span>
                  <span class="tt-tip-text">AC</span><span class="tt-tip-text">RE</span>
                </div>
                <div class="tt-tip-row">
                  <span class="tt-tip-text">{{$t('iqc.crAql')}}</span><span class="tt-tip-text">{{fromIqc.crAql}}</span>
                  <span class="tt-tip-text">{{forCrTable.samplingPlanCrAc}}</span><span
                  class="tt-tip-text">{{forCrTable.samplingPlanCrRe}}</span>
                </div>
                <div class="tt-tip-row">
                  <span class="tt-tip-text">{{$t('iqc.majAql')}}</span><span class="tt-tip-text">{{fromIqc.majAql}}</span>
                  <span class="tt-tip-text">{{forCrTable.samplingPlanMajAc}}</span><span
                  class="tt-tip-text">{{forCrTable.samplingPlanMajRe}}</span>
                </div>
                <div class="tt-tip-row">
                  <span class="tt-tip-text">{{$t('iqc.minAql')}}</span><span class="tt-tip-text">{{fromIqc.minAql}}</span>
                  <span class="tt-tip-text">{{forCrTable.samplingPlanMinAc}}</span><span
                  class="tt-tip-text">{{forCrTable.samplingPlanMinRe}}</span>
                </div>
              </td>
              <td style="width: 20%;">
                <div>
                  &nbsp;
                </div>
                <div class="tt-tip-card" v-if="fromProduct.extStatus != ''">
                  <div style="margin-bottom: 20px;">{{$t('iqc.tips')}}:</div>
                  <span v-if="fromProduct.extStatus==='exempted'" style="color: #418FEE;"><Icon
                    type="ios-checkmark-outline"></Icon>{{$t('iqc.exempted')}}</span>
                  <span v-if="fromProduct.extStatus==='pending'" style="color: red;"><Icon
                    type="ios-checkmark-outline"></Icon>{{$t('iqc.pending')}}</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <Row style="margin-top:20px;background-color: #fafafa;padding: 24px 24px 4px 24px;" v-show="samplingPlanType==1">
          <i-col span="8" class="tt-tip-row">
            <span class="tt-tip-label">{{$t('iqc.kyRule')}}：</span>
            <span v-if="fromProduct.lenientTransfer=='NORMAL'">{{$t('iqc.normal')}}</span>
            <span v-else-if="fromProduct.lenientTransfer=='SOFTEN'">{{$t('iqc.relax')}}</span>
            <span v-else-if="fromProduct.lenientTransfer=='STRICTER'">{{$t('iqc.strict')}}</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="8">
            <div class="tt-tip-card" v-if="fromProduct.extStatus != ''">
              <span class="tt-tip-label" style="margin-bottom: 20px;">{{$t('iqc.tips')}}:</span>
              <span v-if="fromProduct.extStatus==='exempted'" style="color: #418FEE;"><Icon
                type="ios-checkmark-outline"></Icon>{{$t('iqc.exempted')}}</span>
              <span v-if="fromProduct.extStatus==='pending'" style="color: red;"><Icon
                type="ios-checkmark-outline"></Icon>{{$t('iqc.pending')}}</span>
            </div>
          </i-col>
        </Row>
      </div>

    </div>

    <!--参数记录-->
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t('iqc.paramsRecord')}}
      </div>
      <div class="iqis-page-block-body">
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label">{{$t('iqc.paramsTable')}}</div>
          </div>
          <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
          </div>
        </div>
        <div class="iqis-page-block-table">
          <!-- <Table  :no-data-text="i18n.t('noData')" ref="paramTable" class="iqis-inline-editor-table noHeight noBorder iqcParamTable" -->
          <Table  :no-data-text="i18n.t('noData')" class="height24 noBorder" ref="paramTable" @on-selection-change="paramTableSelectChange" border stripe
                 :loading="table.param.loading" v-drag-table-column="table.param.columns" :columns="table.param.columns"
                 :data="iqcParams">
          </Table>
        </div>
      </div>
    </div>
    <!-- 属性记录表 -->
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        <!-- {{$t('iqc.paramsRecord')}} -->
        {{$t('iqc.attrRecord')}}
      </div>
      <div class="iqis-page-block-body">
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label"><!-- {{$t('iqc.paramsTable')}} -->{{$t('iqc.attrTable')}}</div>
          </div>
          <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
          </div>
        </div>
        <div class="iqis-page-block-table">
          <!-- <Table  :no-data-text="i18n.t('noData')" ref="paramTable" class="iqis-inline-editor-table noHeight noBorder iqcParamTable" -->
          <!-- <Table  :no-data-text="i18n.t('noData')" class="height24" ref="paramTable" @on-row-click="paramslist" @on-selection-change="paramTableSelectChange" border stripe
                 :loading="table.param.loading" v-drag-table-column="table.param.columns" :columns="table.param.columns"
                 :data="iqcParams">
          </Table> -->
                                                          <!-- iqcAttribute -->
          <Table :columns="table.param.attribute" class="noBorder" border stripe :data="iqcParamss"></Table>
        </div>
      </div>
    </div>

    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t('iqc.defectRecord')}}
      </div>
      <div class="iqis-page-block-body">
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label">{{$t('iqc.defectTable')}}</div>
          </div>
          <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
            <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('iqc.changed')}} <span
              style="color:#1b75ea">{{prodBatch.TableLength}}</span> {{$t('iqc.defects')}}</span>
            <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
              confirm
              :title="i18n.t('iqc.confirmDelete')"
              placement="bottom-end"
              @on-ok="deleteTableSelected">
              <Button type="ghost" icon="trash-a" v-if="!inputDisbale" :disabled="!prodBatch.selected||noPermsDis">{{$t('iqc.delete')}}</Button>
            </Poptip>
          </div>
        </div>
        <div class="iqis-page-block-table">
          <Table  :no-data-text="i18n.t('noData')" ref="paramTableFects" class="iqis-inline-editor-table noHeight defectTable noBorder location"  @on-selection-change="defectTableSelectChange"  border stripe
                  :loading="table.defect.loading" v-drag-table-column="table.defect.columns" :columns="table.defect.columns" :data="iqcDefects" >
            <Button :disabled='inputDisbale||noPermsDis' @click="addDefect"  class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus">自动生成缺陷记录</Button>
          </Table>
        </div>

        <Row type="flex" :gutter="24">
          <!-- <i-col span="4" style="width: 20% !important;">
            <div class="iqis-page-block-label">{{$t('iqc.sampleNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <InputNumber :max="Number(ruleForm.totalQuantity)" :min="0" v-model="ruleForm.sampleQuantity"  :number="true" :disabled='inputDisbale || ruleForm.totalQuantity==""||noPermsDis'  style="width: 100%;" v-on:on-change ="BadNumber"></InputNumber>
            </div>
          </i-col> -->
          <!-- <i-col span="4" style="width: 20% !important;">
            <div class="iqis-page-block-label">{{$t('iqc.badNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <InputNumber :max="ruleForm.sampleQuantity" :min="0" v-model="ruleForm.badQuantity" :number="true" :disabled='inputDisbale || ruleForm.sampleQuantity == 0||noPermsDis'  style="width: 100%;" @on-change ="BadNumber();changeResult(ruleForm.badQuantity)"></InputNumber>
            </div>
          </i-col> -->
          <!-- <i-col span="4" style="width: 20% !important;">
            <div class="iqis-page-block-label">{{$t('iqc.badRate')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="reckonBadRate" disabled style="width: 100%;"></i-input>
            </div>
          </i-col> -->
          <i-col span="4" style="width: 20% !important;">
            <div class="iqis-page-block-label">{{$t('iqc.result')}}</div>
            <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.result" :disabled='inputDisbale||noPermsDis' filterable>
                  <Option v-for="item in resultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
          </i-col>
          <!-- <i-col span="4" style="width: 20% !important;">
            <div v-if="ruleForm.result==0">
              <div class="iqis-page-block-label">{{$t('iqc.reviewTeam')}}</div>
              <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.reviewProcessId" :disabled='inputDisbale||noPermsDis' filterable @on-change="reviewProcessBtn(ruleForm.reviewProcessId)"> -->
                    <!-- 不发起评审流程 -->
                    <!-- <Option :value="null">{{$t('noReview')}}</Option> -->
                    <!-- <Option v-for="(item,index) in ProcessIdList" :value="item.reviewProcessId" :key="index">{{ item.name }}</Option>
                  </Select>
              </div>
            </div>
          </i-col> -->
        </Row>
        <!-- <Row type="flex" :gutter="24">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('iqc.qcExplain')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="ruleForm.qcExplain" :disabled='inputDisbale||noPermsDis' style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row> -->
      </div>
    </div>

    <Process @cancel="closePage" ref="process" :inspector="prodBatch.spectorNameData" :iqcDefects="iqcDefects" v-if="reviewState!=0&&reviewState!=3" :state="reviewState" :endUrl="'/examinecenter/iqc/reviewrecord/close/'" :processUrl="'/examinecenter/iqc/reviewrecord'" qcType="iqc" :qcId="iqcId" :authorized="!noPermsDis" :inspectorId="ruleForm.inspectorId" :qcNo="ruleForm.iqcNo" :createTime="ruleForm.DataTime" :totalQuantity="ruleForm.totalQuantity" :productNo="ruleForm.productNo" :productName="ruleForm.productName" :caseExplain="ruleForm.caseExplain" @watchState="watchState" @save="save" :judgeDefResult="arr1"   :defResult="arr"></Process>

    <IqisAffix placement="bottom" :offset="0" v-if="true">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <!-- <Button type="primary" v-if="reviewState==3&&userids == ruleForm.inspectorId" @click="endCase">{{$t('iqc.end')}}</Button> -->
        <!-- 提交按钮 -->
        <Button type="primary" @click="submData" :disabled="submit1" v-if="button.review&&permsBtn.INSERT_IQC">{{$t('iqc.commit')}}</Button>
        <Button type="primary" @click="submitBtn"  v-if="button.add&&permsBtn.UPDATE_IQC">{{$t('iqc.commit')}}</Button>
        <!-- 保存按钮 -->
        <Button type="primary" @click="save" :loading="loadStat.saveLoading" v-if="button.add&&!noPermsDis">{{$t('iqc.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('iqc.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!--end blocks-->
    <div class="page-end" style="padding-bottom: 40px;padding-top: 30px;"></div>
      <Spin size="large" fix v-if="loadStat.iqcDataLoading || loadStat.selectsDataLoading"></Spin>
    </div>
</template>
<script>
  import ICol from "iview/src/components/grid/col";
  import $ from "jquery"
   import numeral from 'numeral';
  import NestedTables from '../../components/nestedTables/NestedTabels.vue'
  import dragImageView from '../../components/imageview/dragImageView.vue'
  export default {
    components: {ICol,NestedTables,dragImageView},
    props: ["params", "tabKey"],
    data() {
      let vm = this;
      return {
        processExamplesId:"",
        resultShow:true,
        // defResult:'',
        arr:[],
        arr1:[],
        mark:false,
        paramsIndex:0,
        ext:[],
        tag:'iqc',
        aa:0,
        i18n:window.i18n,
        sampleNum:0,
        // validateState:false,
        // paramValue:'',
        paramValuearray:[],
        productProperty:'',
        productPropertyCache:'',
        productDetail:[],
        productSimple:[],
        productData:[],
        productId: '',
        iqcParamsRefresh:[],
        iqcParamsNew: [],
        iqcId: '',
        button: {
          add: true, //添加
          review: false //评审
        },
        block: {
          review: false
        },
        handlistshow: true,
        submit1: false,
        userids: '',
        currentUser: {},
        submDataButton: false,
        submDataButton2: false,
        inputDisbale: false, //由检验单状态与评审状态控制
        headers: {"headers": {"Content-Type": "application/json; charset=UTF-8"}},
        loadStat: {
          saveLoading: false,
          iqcDataLoading: false,
          selectsDataLoading: false
        },
        defectResultList:[
            {value: 0, name: "合格"},
            {value: 1, name: "允收"},
            {value: 2, name: "特采"},
            {value: 3, name: "特采(返工)"},
            {value: 4, name: "退货"},
        ],
        subShow: false,
        selects: {
          products: [],
          manufacturerList: [],
          inspectorList: [],
          userList: [],
          inspectionTypes: [],
          defectTypeList: [],
          treatmentList: [
            // {value:"",label:""},
            {value: "JUDGE", label: i18n.t('iqc.judged')},
            {value: "REJECT", label: i18n.t('iqc.return')},
            {value: "REWORK", label: i18n.t('iqc.rework')},
            {value: "SCREEN", label: i18n.t('iqc.filter')},
            {value: "SPECIAL_ADOPTION", label: i18n.t('iqc.special')},
            {value: "EMERGENCY_RELEASE", label: i18n.t('iqc.release')},
            {value: "SCRAP", label: i18n.t('iqc.scrap')}
          ]
        },
        sampling: {
          crAql: '4.00',
          crAC: '14',
          crRE: '15',
          majAql: '0.40',
          majAC: '2',
          majRE: '3',
          minAql: '0.03',
          minAC: '0',
          minRE: '1',
          plan: i18n.t('iqc.105E'),
          level: i18n.t('iqc.normalInspection')+'II',
          rule: i18n.t('iqc.relax'),
          samplingCount: '10000',
          "extStatus": '',//附加状态，停产：pending，免检：exempted ,
          "lenientTransfer": '',//宽严程度：NORMAL 正常，SOFTEN 放宽，STRICTER 加严 ,
          "lenientTransferName": '',//宽严程度：NORMAL 正常，SOFTEN 放宽，STRICTER 加严 ,
        },
        iqcParams: [],
        iqcParamss: [],
        iqcAttribute:[

        ],//属性记录表数据
        iqcDefects: [],
        iqcDefectss:[],
        "iqcPropertyRecordList": [],
        iqc: {
          "auditorId": '',
          "badQuantity": '',
          "badRate": '',
          "batch": '',
          "createTime": '',
          "inspectionStandard": '',
          "inspectorId": '',
          "iqcId": '',
          "iqcNo": '',
          "manufacturerId": '',
          "productId": 0,
          "productInfo": {
            "examType": '',
            "name": '',
            "no": '',
            "prodTypeId": '',
            "prodTypeName": '',
            "prodUnitId": '',
            "prodUnitName": '',
            "productId": '',
            "remark": '',
            "spec": '',
            "updateTime": '',
            "updater": '',
            "useState": '',
            "version": ''
          },
          "reportNo": '',
          "result": '',
          "reviewProcessId": '',
          "sampleQuantity": '',
          "samplingPlan": '',
          "state": '',
          "strictStandard": '',
          "totalQuantity": ''
        },
        reviews: {
          auditor: {
            "disabled": true,
            "iqcId": '',
            "opinion": "",
            "reviewRecordId": '',
            "reviewTime": '',
            "reviewerId": '',
            reviewerName: "",
            "role": 'auditor',
            "treatmentType": ''
          },
          judge: {
            "disabled": true,
            "iqcId": '',
            "opinion": "",
            "reviewRecordId": '',
            "reviewTime": '',
            "reviewerId": '',
            reviewerName: "",
            "role": 'auditor',
            "treatmentType": ''
          },
          reviewer1: {
            "disabled": true,
            "iqcId": '',
            "opinion": "",
            "reviewRecordId": '',
            "reviewTime": '',
            "reviewerId": '',
            reviewerName: "",
            "role": 'auditor',
            "treatmentType": ''
          },
          reviewer2: {
            "disabled": true,
            "iqcId": '',
            "opinion": "",
            "reviewRecordId": '',
            "reviewTime": '',
            "reviewerId": '',
            reviewerName: "",
            "role": 'auditor',
            "treatmentType": ''
          },
          reviewer3: {
            "disabled": true,
            "iqcId": '',
            "opinion": "",
            "reviewRecordId": '',
            "reviewTime": '',
            "reviewerId": '',
            reviewerName: "",
            "role": 'auditor',
            "treatmentType": ''
          },
          reviewer4: {
            "disabled": true,
            "iqcId": '',
            "opinion": "",
            "reviewRecordId": '',
            "reviewTime": '',
            "reviewerId": '',
            reviewerName: "",
            "role": 'auditor',
            "treatmentType": ''
          }

        },
        sign:0,
        paramsList:null,
        table: {
          param: {
            selected: [],
            loading: false,
            //属性记录表
            attribute:[
              {
                title: i18n.t('iqc.no'),
                width: 40,
                render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
                align: "center",
                minWidth: 40,
                maxWidth: 40
              },
              {
                title: i18n.t('iqc.project'),
                width: this.$store.state.locale=='zh_CN'?160:110,
                minWidth: this.$store.state.locale=='zh_CN'?160:110,
                align: 'center',
                ellipsis: true,
                // key: 'inspectionTypeName',
                key:'inspectionName',
               /*  render: (h, params) => {
                  let _this = this;
                  let texts = '';
                  texts = params.row.inspectionName
                  return h('div', {
                    props: {},
                  }, texts)
                } */
              },
              {
                title:i18n.t("iqc.inspectionLevel"),
                width:500,
                minWidth:500,
                align:"center",
                key:'inspectionLevel'
              },
              {
                title:i18n.t("iqc.result"),
                width:100,
                minWidth:100,
                aligh:"center",
                key:'result',
                render:(h,params) => {
                  let that = this;
                  return h('Select',{
                    props:{value:this.iqcParamss[params.index].result || 0,disabled: this.inputDisbale||this.noPermsDis},
                    on:{
                      "on-change":(event) => {
                        that.iqcPropertyRecordList[params.index].result = event
                      }
                    },
                  },
                  [
                    h('Option',{
                      props:{value:0}
                    },'OK'),
                    h('Option',{
                      props:{value:1}
                    },"NG")
                  ])
                }
              },
              {
              title:i18n.t("iqc.inspectionExplain"),
              minWidth:200,
              // width:200,
              align:'center',
              key:'inspectionExplain',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'textarea',
                      disabled: this.inputDisbale||this.noPermsDis,
                      // disabled:me.noPermsDis,
                      size:"small",
                      autosize:{
                        minRows:1,
                        maxRows:4
                      },
                      maxlength:600,
                      value:this.iqcParamss[params.index].inspectionExplain
                    },
                    on:{
                      "on-blur":function(event){
                        // me.iqcPropertyRecordList[params.index].inspectionExplain = event.target.value
                        me.iqcPropertyRecordList[params.index].inspectionExplain = event.target.value
                        
                        
                      }
                    }
                  })
                ])
              }
            },
            ],
            // 参数记录
            columns: [
              {
                title: i18n.t('iqc.no'),
                width: 40,
                render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
                align: "center",
                minWidth: 40,
                maxWidth: 40
              },
              {
                title: i18n.t('iqc.project'),
                width: this.$store.state.locale=='zh_CN'?200:110,
                minWidth: this.$store.state.locale=='zh_CN'?160:110,
                align: 'center',
                ellipsis: true,
                key: 'inspectionTypeName',
              },
              {
                title: i18n.t('iqc.chkDev'),
                align: "center",
                width:120,
                minWidth:this.$store.state.locale=='zh_CN'?100:40,
                ellipsis: true,
                //required:true,
                key: "chkDevName",
                render:(h,params)=>{
                  if(!params.row.chkDevName){
                    return h('div',i18n.t('Unlimited'))
                  }else{
                    return h('div',params.row.chkDevName)
                  }
                }
              },
              {
                title: i18n.t('iqc.measUnit'),
                minWidth: this.$store.state.locale=='zh_CN'?54:80,
                width: this.$store.state.locale=='zh_CN'?70:80,
                align: 'center',
                ellipsis: true,
                key:'unitSymbol',
                render:(h,params)=>{
                  if(!params.row.unitSymbol){
                    return h('div',i18n.t('Unlimited'))
                  }else{
                    return h('div',params.row.unitSymbol)
                  }
                }
              },
              {
                title: 'USL',
                minWidth: 55,
                width: 65,
                align: 'center',
                ellipsis: true,
                key: 'usl',
              },
              {
                title: 'SL',
                minWidth: 55,
                width: 65,
                align: 'center',
                ellipsis: true,
                key: 'sl',

              },
              {
                title: 'LSL',
                minWidth: 55,
                width: 55,
                align: 'center',
                ellipsis: true,
                key: 'lsl',

              },
              {
                // title: i18n.t("pqc.sn"),
                title: i18n.t('iqc.sampleQua'),
                align: "center",
                minWidth:this.$store.state.locale=='zh_CN'?60:80,
                width:this.$store.state.locale=='zh_CN'?80:80,
                ellipsis: true,
                key: "num",
                render:(h,params)=>{
                  if(params.row.num===null){
                    return h('div','--')
                  }else{
                    return h('div',params.row.num)
                  }
                }

              },
              {
                title: "AC",
                width: 50,
                minWidth: 30,
                align: 'center',
                ellipsis: true,
                focus: true,
                key: 'ac',
                render:(h,params)=>{
                  if(params.row.ac===0){
                    return h('div','0')
                  }
                  else if(params.row.ac===null||!params.row.ac){
                    return h('div','--')
                  }else{
                    return h('div',params.row.ac)
                  }
                }
              },
              {
                title: "RE",
                width: 50,
                minWidth: 30,
                align: 'center',
                ellipsis: true,
                focus: true,
                key: 're',
                render:(h,params)=>{
                  if(params.row.re===0){
                    return h('div','0')
                  }
                  else if(params.row.re===null||!params.row.re){
                    return h('div','--')
                  }else{
                    return h('div',params.row.re)
                  }
                }
              },
              // {
              //   title: i18n.t('iqc.chkDevTypeName'),
              //   width: this.$store.state.locale=='zh_CN'?120:140,
              //   minWidth: this.$store.state.locale=='zh_CN'?120:140,
              //   align: 'center',
              //   ellipsis: true,
              //   focus: true,
              //   key: 'chkDevTypeName',//chkDevName
              //   render: (h, params) => {
              //     let _this = this;
              //     let texts = '';
              //     texts = params.row.chkDevTypeName
              //     return h('div', {
              //       props: {},
              //     }, texts)
              //   }
              // },
              // {
              //   // title: i18n.t('iqc.sampleNumber'),
              //   title: '抽样数量',
              //   minWidth: this.$store.state.locale=='zh_CN'?54:120,
              //   align: 'center',
              //   ellipsis: true,
              //   key: 'sampleNum',
              //   render: (h, params) => {
              //     let _this = this;
              //     let texts = '';
              //     this.sampleNum = params.row.sampleNum
              //     texts = this.forCrTable.sampleNum
              //     return h('div', {
              //       props: {},
              //     }, texts)
              //   }
              // },
              {
                title:i18n.t('iqc.record'),
                align:"center",
                // ellipsis:true,
                // key: 'paramId',
                key:'qqq',
                width:700,
                minWidth:700,
                render:(h,params) => {
                  return h(NestedTables,{
                    props:{
                      // sampleNum:this.sampleNum,
                      index:'iqctab'+params.index,
                      paramsindex:this.paramsIndex,
                      scale:params.row.scale,
                      aa:this.aa,
                      tag:this.tag,
                      expand:this.iqcParams[params.index].expand,
                      // paramsInfo:this.iqcParams[params.index],
                      paramsInfo:params.row,
                      sampleNum:params.row.num || 10,
                      paramValuearray:this.paramValuearray[params.index],
                      isdisabled:this.inputDisbale||this.noPermsDis,
                      chkDevId:params.row.chkDevId,
                      unitSymbol:params.row.unitSymbol
                    },
                    on:{
                      paramvalue:(data) => {
                        this.paramValuearray[params.index] = data//这是接受子组件传入的数据
                      }
                    }
                  })
                }
              },
              {
                title:i18n.t('iqc.operation'),
                minWidth: 50,
                // width: 50,
                align: 'center',
                key:"xxx",
                render: (h, params) => {
                
                return h('div', [
                    h('Button', {
                      style: {
                        color:'rgb(65, 143, 238)',
                        marginRight: '-5px',
                        display:(params.row.num<=10)?"none":"inline-block",
                      },
                        props: {
                            type: 'text',
                            size: 'small'
                        },
                        /* style: {
                          color:'rgb(65, 143, 238)',
                          marginRight: '-5px'
                        }, */
                        on: {
                          click: (event) => {
                            this.iqcParams[params.index].expand = !this.iqcParams[params.index].expand
                          }
                        }
                    },this.iqcParams[params.index].expand?i18n.t('iqc.close') : i18n.t('iqc.open') ),
                ]);
              },
              },
              
            ]
          },
          defect: {
            selected: [],
            loading: false,
            columns: [
              {
                type: 'selection',
                width: 40,
                align: 'center',
                minWidth: 40,
                maxWidth: 40
              },
              {
                title: i18n.t('iqc.no'),
                width: 60,
                render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
                align: "center",
                minWidth: 60,
                maxWidth: 60
              },
              
              // {
              //   title: '检验项目',
              //   width:103,
              //   align: 'center',
              //   ellipsis:true,
              //   minWidth: 103,
              //   key: 'inspectionTypeName',
              //   render: (h, params) => {
              //     let _this = this;
              //     let texts = '';
              //     texts=params.row.inspectionTypeName
              //     return h('div', {
              //         props: {
              //            },
              //       },texts)
              //    }
              // },
              {
                title: i18n.t('iqc.project'),//检验项目
                width: this.$store.state.locale=='zh_CN'?160:115,
                align: 'center',
                ellipsis: true,
                minWidth: this.$store.state.locale=='zh_CN'?160:115,
                // key: 'inspectionTypeId',
                render: (h, params) => {
                  let texts = '';
                  texts=params.row.inspectionTypeName
                  return h('div', {
                      props: {
                         },
                    },texts)
                 }
                // render: vm.$iqis.utils.tableHelper.editable.buildCascaderCell4(vm, (vm) => {
                //   return vm.selects.inspectionTypes
                // }, "inspectionTypeId", "name", null, this.getDefectNameList, 'inputDisbale'),
                // render:
                // (h, params)=>{
                //   let ret =  vm.$iqis.utils.tableHelper.editable.buildCascaderCell4(
                //     vm,
                //     (vm)=>{
                //       return vm.selects.inspectionTypes
                //     },
                //     "inspectionTypeId",
                //     "name",
                //     null,
                //     this.getDefectNameList,
                //     vm.inputDisbale||vm.noPermsDis,
                //   )
                //   return ret(h,params);
                // }
              },
              {
                title: '缺陷名称',
                width: 120,
                align: 'center',
                ellipsis:true,
                minWidth: 120,
                //required:true,
                key: 'defectName',
                render: (h, params) => {
                	let _this = this;
                  return h('Select', {
                      props:{
                          filterable:true,
                          value: this.iqcDefects[params.index].defectTypeId,
                          disabled:this.inputDisbale||this.noPermsDis,
                      },
                      style:{
                        border:'0px'
                      },
                      on: {
                          'on-change':(event) => {
                              this.iqcDefects[params.index].defectTypeId = event;

                              this.TesySynthesis(this.iqcDefects[params.index].defectTypeId,params.index)
                          }
                      },
                  },
                      this.prodBatch.DefectName.map(function(type){
                          return h('Option', {
                              props: {value: type.defectTypeId,label:type.name}
                          }, type);
                      })
                  );
                }
              },
              // {
              //   title: i18n.t('iqc.defectName'),//缺陷名称
              //   width: 120,
              //   align: 'center',
              //   ellipsis: true,
              //   minWidth: 120,
              //   //required:true,
              //   key: 'defectTypeId',
              //   render: (h, params) => {
              //     let _this = this;
              //     return h('Select', {
              //         props: {
              //           filterable: true,
              //           value: this.iqcDefects[params.index].defectTypeId,
              //           disabled: this.inputDisbale||this.noPermsDis,
              //         },
              //         style: {
              //           border: '0px'
              //         },
              //         on: {
              //           'on-change': (event) => {
              //             this.iqcDefects[params.index].defectTypeId = event;

              //             this.TesySynthesis(this.iqcDefects[params.index].defectTypeId, params.index)
              //           }
              //         },
              //       },
              //       this.iqcDefects[params.index].defectTypeList.map(function (type) {
              //         return h('Option', {
              //           props: {value: type.defectTypeId, label: type.name}
              //         }, type);
              //       })
              //     );
              //   }
                // render:(h, params)=>{
                //   let ret =  vm.$iqis.utils.tableHelper.editable.buildSelectCell2(
                //     vm,
                //     (vm)=>{
                //       let rowData = vm.iqcDefects[params.index];
                //       return rowData['defectTypeList'];
                //       //console.log(rowData,'获取当前行的缺陷名称列表')
                //     },
                //     "defectTypeId",
                //     "name",
                //     this.onDefectNameChange
                //   )
                //   return ret(h,params);
                // }

              // },
              {
                title: "描述",
                key:"describe",
                minWidth: 200,
                width:400,
                render: (h, params) => {
                  return h("div", [
                    h("Input", {
                      props: {
                        type: "input",
                        disabled:this.inputDisbale||this.noPermsDis,
                        value:params.row.describe,
                        autosize:{
                            // minRows:1,
                            maxRows:4
                        },
                        rows:4,
                        maxlength:600,
                      },
                      on: {
                        "on-blur": event => {
                          this.iqcDefects[params.index].describe = event.target.value
                          // this.iqcDefects[params.index] =params.row;
                        }
                      }
                    })
                  ]);
                }
                // render: (h, params) => {
                //   return h("div", [
                //     h("Input", {
                //       props: {
                //         type: "textarea",
                //         value:params.row.remark,
                //         autosize:{
                //             // minRows:1,
                //             maxRows:4
                //         },
                //         rows:4,
                //         maxlength:600,
                //       },
                //       on: {
                //         "on-blur": event => {
                //           params.row.remark = event.target.value
                //           this.iqcDefects[params.index] =params.row;
                //         }
                //       }
                //     })
                //   ]);
                // }
              },
              // {
              //   title: i18n.t('iqc.defectLevel'),
              //   width: 85,
              //   align: 'center',
              //   ellipsis: true,
              //   minWidth: 85,
              //   key: 'qltyLvId',
              //   render: (h, params) => {
							//   	let _this = this;
							//     return h('Select', {
							//         props:{
              //             value: this.iqcDefects[params.index].qltyLvId,
              //             disabled:this.inputDisbale||this.noPermsDis
							//         },
							//         on: {
							//             'on-change':(event) => {
							//                 this.iqcDefects [params.index].qltyLvId = event;
							//             }
							//         },
							//     },
							// 	this.prodBatch.DefectGrade.map(function(type){
							// 	    return h('Option', {
							// 	        props: {value: type.qltyLvId,label:type.name}
							// 	    }, type);
							// 	})
							//   );
							// }
              // },

              // {
              //   width: 100,
              //   title: i18n.t('iqc.defectPosition'),
              //   minWidth: 100,
              //   align: 'center',
              //   ellipsis: true,
              //   focus: true,
              //   key: 'defectLocId',
              //  render: (h, params) => {
							//   	let _this = this;
							//     return h('Select', {
							//         props:{
              //             value: this.iqcDefects[params.index].defectLocId,
              //             disabled:this.inputDisbale||this.noPermsDis
							//         },
							//         on: {
							//             'on-change':(event) => {
							//                 this.iqcDefects[params.index].defectLocId = event;
							//             }
							//         },
							//     },
							// 	this.prodBatch.DefectPosition.map(function(type){
							// 	    return h('Option', {
							// 	        props: {value: type.defectLocId,label:type.name}
							// 	    }, type);
							// 	})
							//   );
							// }
              // },
              // {
              //   title: i18n.t('iqc.chkDev'),
              //   width: 150,
              //   align: 'center',
              //   minWidth: 150,
              //   ellipsis: true,
              //   key: 'chkDevId',
              //   render: (h, params) => {
							//   	let _this = this;
							//     return h('Select', {
							//         props:{
              //             value: this.iqcDefects[params.index].chkDevId,
              //             disabled:this.inputDisbale||this.noPermsDis
							//         },
							//         on: {
							//             'on-change':(event) => {
							//                 this.iqcDefects[params.index].chkDevId = event;
							//             }
							//         },
							//     },
							//     params.row.chkDevTypeList.map(function(type){// chdDevTypeList原带出检验设备列表
			    		// 			return h('Option', {
							// 		        props: {value:type.chkDevId,label:type.name}
							// 		   }, type);
							//     })
							//   );
							// }
              // },
              {
                title: i18n.t('iqc.sampleQuantity'),//实抽样数
                minWidth: this.$store.state.locale=='zh_CN'?54:120,
                width: this.$store.state.locale=='zh_CN'?70:120,
                align: 'center',
                ellipsis: true,
                key: 'sampleQuantity',
                render: (h, params) => {
                  let that = this
                  return h("div", [
                    h("Input", {
                      props: {
                        type: "input",
                        disabled:this.inputDisbale||this.noPermsDis,
                        value:params.row.sampleQuantity,
                        autosize:{
                            // minRows:1,
                            maxRows:4
                        },
                        rows:4,
                        maxlength:600,
                      },
                      on: {
                        "on-blur": event => {
                          this.iqcDefects[params.index].sampleQuantity = event.target.value
                          if(event.target.value&&this.iqcDefects[params.index].defectCount) {
                              this.iqcDefects[params.index].defectRate=(Math.min(100,((this.iqcDefects[params.index].defectCount/Number(event.target.value))*100))).toFixed(2)+'%'
                          }
                          // this.iqcDefects[params.index] =params.row;
                        }
                      }
                    })
                  ]);
                }
                // render: (h, params) => {
                //   var me = this
                //   return h('div', [h('Input', {
                //     props: {
                //       type: 'text',
                //       value: me.iqcDefects[params.index].sampleQuantity,
                //       disabled:this.inputDisbale||this.noPermsDis
                //     },
                //     on: {
                //       "on-change": (event) => {
                //         params.row.sampleQuantity = event.target.value;
                //         this.iqcDefects[params.index] = params.row;
                //         if(params.row.defectCount){
                //           this.iqcDefects[params.index].defectRate = ((params.row.defectCount / params.row.sampleQuantity) * 100).toFixed(2)
                //         }
                //         console.log(params.row,"sdfsdfsdfsd")
                //       },
                //       // 'on-blur': (event) => {
                //       //     console.log(params,"QQQQQQQQQQQQQQQQQQQ")
                //       //     this.iqcDefects[params.index].sampleQuantity =event.target.value;
                //       //   }
                //     }
                //   })
                //   ])
                // }
              },
              {
                title: i18n.t('iqc.defectNum'),//缺陷数
                minWidth: this.$store.state.locale=='zh_CN'?54:110,
                width: this.$store.state.locale=='zh_CN'?74:110,
                align: 'center',
                ellipsis: true,
                key: 'defectCount',
                render: (h, params) => {
                  return h("div", [
                    h("Input", {
                      props: {
                        type: "input",
                        disabled:this.inputDisbale||this.noPermsDis,
                        value:params.row.defectCount,
                        autosize:{
                            // minRows:1,
                            maxRows:4
                        },
                        rows:4,
                        maxlength:600,
                      },
                      on: {
                        "on-blur": event => {
                          this.iqcDefects[params.index].defectCount = event.target.value
                          if(event.target.value&&this.iqcDefects[params.index].sampleQuantity) {
                            this.iqcDefects[params.index].defectRate=(Math.min(100,(Number(event.target.value)/(this.iqcDefects[params.index].sampleQuantity)*100))).toFixed(2)+'%'
                          }
                        }
                      }
                    })
                  ]);
                }
                // render: (h, params) => {
                //   var me = this
                //   return h('div', [h('Input', {
                //     props: {
                //       type: 'text',
                //       value: me.iqcDefects[params.index].defectCount,
                //       disabled: this.inputDisbale||this.noPermsDis
                //     },
                //     on: {
                //       "on-change": (event) => {
                //         params.row.defectCount = event.target.value;
                //         this.iqcDefects[params.index] = params.row;

                //         if(params.row.sampleQuantity){
                //           this.iqcDefects[params.index].defectRate = ((params.row.defectCount / params.row.sampleQuantity) * 100).toFixed(2)
                //         }
                //         console.log(params.row,"sdfsdfsdfsd")
                //         this.ruleForm.badQuantity = 0;
                //           for (let i in this.iqcDefects) {
                //             this.ruleForm.badQuantity += Number(this.iqcDefects[i].defectCount);
                //           }
                //           this.changeResult(this.ruleForm.badQuantity)
                //       },
                //     }
                //   })
                //   ])
                // }
              },
              {
                title: "缺陷率%",
                minWidth: this.$store.state.locale=='zh_CN'?54:120,
                width: this.$store.state.locale=='zh_CN'?100:120,
                align: 'center',
                ellipsis: true,
                key: 'defectRate',  
                render: (h, params) => {
                  return h("div", [
                    h("Input", {
                      props: {
                        type: "input",
                        disabled:true,
                        value:params.row.defectRate,
                        autosize:{
                            // minRows:1,
                            maxRows:4
                        },
                        rows:4,
                        maxlength:600,
                      },
                      // on: {
                      //   "on-blur": event => {
                      //     this.iqcDefects[params.index].defectRate = event.target.value
                      //     // this.iqcDefects[params.index] =params.row;
                      //   }
                      // }
                    })
                  ]);
                }
              },
              {
                title: '判定结果',
                width: 120,
                align: 'center',
                ellipsis:true,
                minWidth: 120,
                render: (h, params) => {
                	let _this = this;
                  return h('Select', {
                      props:{
                          filterable:true,
                          value: this.iqcDefects[params.index].decisionResultsId,
                          disabled:this.resultShow,
                      },
                      style:{
                        border:'0px'
                      },
                      on: {
                          'on-change':(event) => {
                              this.iqcDefects[params.index].decisionResultsId = event;
                              if(this.reviewState==1||this.reviewState==6) {
                                _this.defResults()
                              }else {
                                _this.judgeDefResults()
                              }
                          }
                      },
                  },
                      this.defectResultList.map(function(type){
                          return h('Option', {
                              props: {value: type.value,label:type.name}
                          }, type);
                      })
                  );
                }
              },
              {
                title: "备注",
                key:"remark",
                minWidth: 200,
                width:400,
                render: (h, params) => {
                  return h("div", [
                    h("Input", {
                      props: {
                        type: "input",
                        disabled:this.inputDisbale||this.noPermsDis,
                        value:params.row.remark,
                        autosize:{
                            // minRows:1,
                            maxRows:4
                        },
                        rows:4,
                        maxlength:600,
                      },
                      on: {
                        "on-blur": event => {
                          this.iqcDefects[params.index].remark = event.target.value
                          // this.iqcDefects[params.index] =params.row;
                        }
                      }
                    })
                  ]);
                }
              },
              // {
              //   title: i18n.t('iqc.pic'),
              //   align: 'center',
              //   key: 'extInfoList',
              //   minWidth: 230,
              //   width: 230,
              //   render: function (h, data) {
              //     try {
              //       vm.iqcDefects[data.index].extInfoList.length
              //     } catch (err) {
              //       vm.iqcDefects[data.index].extInfoList = []
              //     }

              //     return h("IqisUpload", {
              //       props: {//:size="54" :edit="switchs.fileEdit" v-model="product.settings.ext"
              //         "value": data.row[data.column.key],
              //         "size": 32,
              //         "row-index": data.index,
              //         "row":data.row,
              //         // "edit":(vm.prodBatch.AuditStatus == 1 || vm.prodBatch.AuditStatus == 2 ? false : true)&&!this.noPermsDis,
              //         "edit":vm.picBtnShow,
              //         "maxSize":10240,
              //         "fileType":['jpg','jpeg','png'],
              //         "fileCount":5,
              //         'chartTypeShow':"true",
              //         //disabled:this.other.basicD1D2Show,
              //       },
              //       on: {
              //         input: (val) => {
              //           var obj = {
              //             'defectrecordExtInfoName': val[0].name,
              //             'defectrecordExtInfoType': val[0].mime,
              //             'url': val[0].url
              //           };
              //           vm.iqcDefects[data.index].extInfoList.push(obj);

              //           //vm.cellDefectEditorEnd(val, data.column.key, data.index)
              //         },
              //         del: (val) => {
              //           vm.iqcDefects[data.index].extInfoList.splice(val, 1);
              //           //vm.cellDefectEditorEnd(val, data.column.key, data.index)
              //         }
              //       }
              //     })
              //   }
              // }


            ]
          }
        },

        discountData: {
          rows: [{}],
          tableData: {
            defectRecordId: '',
            iqcId: '',
            defectRate:'',
            defectTypeId: '',
            chkDevId: '',
            defectTypeName: '',
            inspectionTypeName: '',
            qltyLvName: '',
            defectLocId: '',
            chkDevType: '',
            defectCount: '',
            sampleQuantity: '',
            extInfoList: [],
            chdDevTypeList: []
          },
        },
        //自定义参数
        prodBatch: {
          indeV: 0,
          dataVB: [],
          iqcId: '',
          ParameterDeta: false,
          selected: false,
          disabled: true,
          turrn: false,
          ShowState: false,
          TableLength: 0,
          reviewProcessShow: false,
          defectNumber: 0,
          AuditStatus: 0,
          productNo: [],
          productNames: [],
          productSpec: [],
          productTypeName: [],
          dataTable: [],
          spectorNameData: [],
          chkshiftData: [],
          DefectName: [],
          DefectGrade: [],
          DefectPosition: [],
          chkValMapData: [],
          dataTableAll: [],
          btnState: '',
          ProcessingData: [],
          reviewProcessIndex: null,
          reviewProcessstate: false,
          inspectorName: '',
          Success: false,
        },
        resultList: [
          {
            value: 0,
            label: i18n.t('iqc.unqualified')
          },
          {
            value: 1,
            label: i18n.t('iqc.qualified')
          },
        ],
        ProcessIdList: [],
        ruleForm: {
          iqcId: '',
          DataTime: new Date(),
          productId: '',
          productNo:"",
          prodTypeId: '',
          inspectorId: '',
          caseExplain:"",
          manufacturerId: '',
          iqcNo: '',
          chkShiftId: '',
          batch: '',
          reportNo: '',
          totalQuantity: '',
          prodUnitName: '',
          createTime: '',
          sampleQuantity: 0,
          badQuantity: 0,
          badRate: '',
          result: 1,
          reviewProcessId: '',
        },
        HandleList: [],
        fromProduct: {
          qcType: '',
          lenientTransfer: '',
          extStatus: '',
        },
        fromIqc: {
          crAql: '',
          majAql: '',
          minAql: '',
          inspectionStandard: '',
        },
        forCrTable: {
          samplingPlanCrAc: '',
          samplingPlanCrRe: '',
          samplingPlanMajAc: '',
          samplingPlanMajRe: '',
          samplingPlanMinAc: '',
          samplingPlanMinRe: '',
          sampleNum: ''
        },
        forMaTable: {
          samplingPlanAc: '',
          samplingPlanRe: '',
        },
        forMinTable: {
          samplingPlanAc: '',
          samplingPlanRe: '',
        }, 
        permsCur:[
          "UPDATE_IQC",
          "INSERT_IQC",
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "UPDATE_IQC":false,
          "INSERT_IQC":false,
        },
        noPermsDis:true, //由用户权限控制,不是使用用户ID判断，而是通过后台给的权限控制
        loadingRemote:false,
        source:null,
        reviewState:'',
        sampleRefreshFlag1:false,
        sampleRefreshFlag2:false,
        samplingPlanType:0,
        changeProductFlag:false,
        productIdCache:''

      }
    },
    computed: {
      //计算不良率
      reckonBadRate() {
        if (
          this.ruleForm.sampleQuantity !== "" &&
          this.ruleForm.badQuantity !== ""
        ) {
          if (
            this.ruleForm.sampleQuantity == 0 &&
            this.ruleForm.badQuantity == 0
          ) {
            return "0";
          } else if (
            this.ruleForm.badQuantity == null &&
            this.ruleForm.sampleQuantity == null
          ) {
            return "";
          } else {
            let x = this.ruleForm.badQuantity / this.ruleForm.sampleQuantity * 100
             x = Math.floor(x * 100) / 100 //计算出的百分比不四舍五入
            if(x>100){
              return 100;
            }else{
              return x;
            }
          }
        }
      },
      ruleFormResult() {
        let that = this;
        if (that.ruleForm.badQuantity == 0) {
          return 1;
        } else {
          return 0;
        }
      },
      picBtnShow(){
        if(!this.inputDisbale&&!this.noPermsDis){
          return true
        }else{
          return false
        }
      }
    },
    watch:{
      "picBtnShow":function(flag){
        if(!flag){
          $('.defectTable').addClass('picBtnHide')
        }else{
          $('.defectTable').removeClass('picBtnHide')
        }
      }
    },
    created(){
      this.initData()

    },
    methods: {
      rowClassName (row, index) {
          if (index === 1) {
              return 'demo-table-info-row';
          } else if (index === 2) {
              return 'demo-table-error-row';
          }
          return '';
      },
      
      paramsFocus(index){
        if(index===0&&event.keyCode==13){
          $(event.target).parents('.ivu-table-column-center').next().find('input').focus()
        }else if(index==1&&event.keyCode==13){
          $(event.target).parents('.ivu-table-row').next().find('td:nth-child(9) input').focus()
        }
      },
      initData(){
        let that=this;
        let copy = that.$props && that.$props.tabKey;
        that.copy = copy.split('-')[2];
        let permsAll = this.$store.state.permissions; 
        this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
        let iqcId = that.$props.params && that.$props.params.iqcId;
        //当此页面时从列表页复制打开是
        that.mark = true
        that.iqcId = iqcId;
        that.dataTable();
        that.spectorName();

        that.reviewProcess();
        if (iqcId) {
          that.sampleRefreshFlag1=true;
          that.sampleRefreshFlag2=true;
          that.refreshData(iqcId);
          that.prodBatch.iqcId = iqcId
          that.prodBatch.btnState = "put"
        } else {
          that.defecttypeD();
          that.DefectGradeData();
          that.DefectPositionData();
          that.prodBatch.btnState = "post"
        }

        // that.productName();
        that.basicCategory();
        
        that.chkshiftFun();
        that.BadNumber();
        that.getInspectiontype();
        if(((!that.iqcId&&that.permsBtn.INSERT_IQC)||(that.iqcId&&that.permsBtn.UPDATE_IQC))){
          this.noPermsDis=false;
        }else{
          this.noPermsDis=true;
        }

       
      },
      endCase(){
        let that = this;
        if(!that.ruleForm.caseExplain){
          that.$Notice.warning({title:"结案说明不能为空"})
          return;
        }
        that.$http.put('/examinecenter/iqc/reviewrecord/close/'+that.iqcId,{caseExplain:that.ruleForm.caseExplain}).then((res)=>{
          that.$Message.success(i18n.t('iqc.endSuccess'))
          that.closePage()
        })
      },
      remoteMethod: _.debounce(function(query) {
        let that = this;
        that.loadingRemote = true;

        if (query !== '') {
          that.cancelQuest();
          that.$nextTick(()=>{

            that.$http.get('/basic/product/simple?page=1&limit=999999&examType=1&useState=1&fieldName=no,name&query='+query,{
              cancelToken: new this.$http.CancelToken(function executor(c) {
              that.source = c;
              })
            }).then(res =>{
              that.productSimple = res.data
              that.loadingRemote = false;
            })

          })
        } else {
          that.productSimple = [];
          that.loadingRemote = false;
        }
      },500),
      cancelQuest(){
        if(typeof this.source ==='function'){
          this.source('终止请求'); 
        }
      },
      changeResult(val) {
        if (val == 0) {
          this.ruleForm.result = 1;
        } else {
          this.ruleForm.result = 0;
        }
      },
      onDefectNameChange(val, fieldName, rowIndex) {
        let that = this;
        //console.log(val, fieldName, rowIndex, '当选择缺陷名称后')
        let rowData = this.iqcDefects[rowIndex];
        rowData[fieldName] = val;
      },
      getInspectiontype() {//获取检验项目下拉框
        let that = this;
        that.$http.get("/basic/inspectiontype", {params: {limit: 99999999}}).then(function (resp) {
          let root = {title: i18n.t('iqc.projectType'), selected: false, label: i18n.t('iqc.projectType'), value: 0, expand: true};
          that.$iqis.utils.treeify(resp.data, root, "inspectionTypeId", "name", "parentId");
          that.selects.inspectionTypes = [root];
          // //console.log(that.selects.inspectionTypes,'检验项目数据')
        })
      },
      getDefectNameList(val, key, index, o) {//获取当前检验项目下的缺陷名称列表
        if (o == null || Object.keys(o).length == 0) {
          return;
        }
        //console.log('获取缺陷名称列表的参数', val, key, index, o);
        let that = this;
        this.iqcDefects = this.iqcDefects || [];
        let newRow = this.iqcDefects[index];
        if (!newRow && this.iqcDefects[index]) {
          newRow = JSON.parse(JSON.stringify(this.iqcDefects[index]));
        }
        if (!newRow) {
          return;
        }
        newRow[key] = val;
        newRow['inspectionTypeName'] = o.name;
        newRow['inspectionTypeId'] = o.inspectionTypeId;
        newRow['chkDevTypeId'] = o.chkDevTypeId;
        newRow['chkDevTypeName'] = o.chkDevTypeName;

        let resp = that.$iqis.utils.syncget('/basic/defecttypelist/' + o.inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
        newRow['defectTypeList'] = resp ? resp.data || [] : [];
        if(o.chkDevTypeId){
          let chkDevTypeIds = []
          chkDevTypeIds[0]=o.chkDevTypeId.replace(/\,/g,'_')
          let resp2 = that.$iqis.utils.syncget('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{page:1,limit:99999,useState:1});//带出检验设备列表
          newRow['chkDevTypeList'] = resp2 ? resp2.data[0] || [] : [];
        }else{
          newRow['chkDevTypeList']=[]
        }
        // for(let i in newRow['chkDevTypeList']){
        //   if(newRow['chkDevTypeList'][i].chkDevId==i18n.t('Unlimited')){
        //     newRow['chkDevTypeList'].splice(i,1)
        //   }
        // }
        newRow['chkDevTypeList'].unshift({chkDevId:null, name: i18n.t('Unlimited')});
        that.iqcDefects[index] = newRow;
        that.$set(that.iqcDefects, index, newRow);
        // //console.log(newRow, '当前行数据')
        return;
      },
      clearNoNum(obj, num) {
        obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        let allRep = '';
        for (let i = 0; i < num; i++) {
          let rep = '\\d';
          allRep += rep;
        }
        if (obj.value.indexOf(".") > 0) {
          if (obj.value.substring(obj.value.indexOf("."), obj.value.length - 1).length > num) {
            obj.value = obj.value.substring(0, obj.value.length - 1);
          }
        }
        // let replaces = new RegExp('(\\-)*(\\d+)\.('+ allRep +').*',);
        // obj.value = obj.value.replace(replaces,'$1$2.$3');//只能输入两个小数
        if (obj.value.indexOf(".") == obj.value.length - 1 && num == 0) {
          obj.value = obj.value.substring(0, obj.value.length - 1);
        }
        if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点
          obj.value = parseFloat(obj.value);
        }
      },
      getAql(num,method) {
        // let reg = /^[0-9]*$/
        // if(!reg.test(num)){
        //  this.$Notice.error({
        //       title: '输入错误！',
        //       desc: '请输入数字！'
        //   });
        //   return;
        // }
        let that = this;
        if (!num) {
          return;
        }
        let state = true;
        state = that.$iqis.utils.formValidate('Num', i18n.t('iqc.batchNum'), num, (tips) => {
          // that.$Notice.warning({title:tips})
        })
        if (!state) {
          return;
        }
        if (that.ruleForm.productId == '') {
          this.$Notice.warning({title: i18n.t('iqc.prodNoFirst')});
          return;
        }
        if(that.samplingPlanType==1){
          let data = []
          let iqcParams = JSON.parse(JSON.stringify(that.iqcParams))
          that.iqcParams = [];
          for(let i=0;i<iqcParams.length;i++){
            let item = iqcParams[i]
            let one = {
              code:item.samplingPlanCode,
              level:item.inspectionStandard,
              aql:item.aql,
              num:that.ruleForm.totalQuantity,
              type:0,
              tolerance:that.fromProduct.lenientTransfer
            }
            if(one.code=='GB/T2828.1-2012'){
              one.type=1;
            }
            data.push(one)
          }
          
          that.$http.post('/sampling-plan/aql?samplingPlanParamDtos',data,that.headers).then((res) => {
            for(let i in iqcParams){
              let item = iqcParams[i]
              item['num']=res.data[i].sampleNum
              item['ac']=res.data[i].samplingPlanAc
              item['re']=res.data[i].samplingPlanRe
            }
          that.iqcParams = iqcParams
          })
        }else{
          
          let type = 0;
          if (that.fromProduct.qcType == 'GB/T2828.1-2012') {
            type = 1;
          }
          if(that.fromProduct.qcType=='full'){
            that.forCrTable.sampleNum=that.ruleForm.totalQuantity;
          }
          if(that.fromProduct.qcType=='percent'){
            that.forCrTable.sampleNum=that.ruleForm.totalQuantity*that.fromIqc.inspectionStandard/100
          }
          if(that.fromProduct.qcType=='full'||that.fromProduct.qcType=='percent'){
            that.fromProduct.lenientTransfer=''
            that.fromIqc.crAql='-'
            that.fromIqc.majAql='-'
            that.fromIqc.minAql='-'
            that.forCrTable.samplingPlanCrAc='-'
            that.forCrTable.samplingPlanMajAc='-'
            that.forCrTable.samplingPlanMinAc='-'
            that.forCrTable.samplingPlanCrRe='-'
            that.forCrTable.samplingPlanMajRe='-'
            that.forCrTable.samplingPlanMinRe='-'
            let iqcParams = JSON.parse(JSON.stringify(that.iqcParams))
            for(let i in iqcParams){
              iqcParams[i]['num']=that.forCrTable.sampleNum
            }
            that.iqcParams=iqcParams
            return;
          }
          let data=[
            {
              code:that.fromProduct.qcType,
              level:that.fromIqc.inspectionStandard,
              tolerance:that.fromProduct.lenientTransfer,
              aql:that.fromIqc.crAql,
              num:num,
              type:type
            },
            {
              code:that.fromProduct.qcType,
              level:that.fromIqc.inspectionStandard,
              tolerance:that.fromProduct.lenientTransfer,
              aql:that.fromIqc.majAql,
              num:num,
              type:type
            },
            {
              code:that.fromProduct.qcType,
              level:that.fromIqc.inspectionStandard,
              tolerance:that.fromProduct.lenientTransfer,
              aql:that.fromIqc.minAql,
              num:num,
              type:type
            },
          ]
          that.$http.post('/sampling-plan/aql?samplingPlanParamDtos',data,that.headers).then((res) => {
            that.forCrTable.samplingPlanCrAc = res.data[0].samplingPlanAc
            that.forCrTable.samplingPlanCrRe = res.data[0].samplingPlanRe
            that.forCrTable.sampleNum = res.data[0].sampleNum;
            if(that.sampleRefreshFlag1&&that.sampleRefreshFlag2){
              that.sampleRefreshFlag2=false;
            }else{
              that.ruleForm.sampleQuantity=that.forCrTable.sampleNum;
            }
            that.forCrTable.samplingPlanMajAc = res.data[1].samplingPlanAc
            that.forCrTable.samplingPlanMajRe = res.data[1].samplingPlanRe
            that.forCrTable.samplingPlanMinAc = res.data[2].samplingPlanAc
            that.forCrTable.samplingPlanMinRe = res.data[2].samplingPlanRe
            let iqcParams = JSON.parse(JSON.stringify(that.iqcParams))
            for(let i in iqcParams){
              iqcParams[i]['num']=that.forCrTable.sampleNum
            }
            that.iqcParams=iqcParams
          })
        }

      },
      paramTableSelectChange(v) {

      }, cellParamEditorEnd(val) {

      }, defectTableSelectChange(v) {
        this.prodBatch.TableLength = v.length;
        if (v.length > 0) {
          this.prodBatch.selected = true
        } else {
          this.prodBatch.selected = false
        }
      }, cellDefectEditorEnd(val) {

      },
      loadSelectsData(callback) {
//      let that = this;
//      that.loadStat.selectsDataLoading = true;
//      this.$http.all([
//        this.$http.get("/basic/product",{params:{limit:99999999,examType:1}}),
//        this.$http.get("/bas/manufacturer",{params:{limit:999999999}}),
//        this.$http.get("/tenant/user",{params:{limit:999999999}}),
//        this.$http.get("/basic/inspectiontype",{params:{limit:99999999}}),
//        this.$http.get("/basic/measunit",{params:{limit:99999999}}),
//        this.$http.get("/basic/prod-task",{params:{limit:99999999}}),
//        this.$http.get("/basic/chkdev",{params:{limit:99999999}})
//      ]).then(function(resps) {
//        that.loadStat.selectsDataLoading = false;
//
//
//        callback && callback();
//      });
      },
      refreshData(iqcId) {
        let that = this;
        that.changeProductFlag=true;
        let url = "/examinecenter/iqc/iqcdetail/";

        that.$http.get('/basic/reviewprocess?page=1&limit=9999').then((res) => {
          that.ProcessIdList = res.data;
          that.ProcessIdList.unshift({reviewProcessId:null,name:i18n.t('noReview')})

          that.$http.get(url + iqcId).then((res) => {
            for(let i = 0; i < res.data.paramRecordList.length; i++){
              this.paramValuearray[i] = res.data.paramRecordList[i].paramValueArray
            }
            that.productProperty = res.data.iqcPropertyRecordList
            that.productPropertyCache = res.data.iqcPropertyRecordList
            that.iqcParamss = res.data.iqcPropertyRecordList
            let iqcData = res.data;
            that.state = res.data.iqcItem.state;
            that.reviewState = res.data.iqcItem.reviewState;
            that.productIdCache = res.data.iqcItem.productId;
            that.processExamplesId = res.data.iqcItem.processExamplesId;
            that.ruleForm = {
              DataTime: new Date(res.data.iqcItem.createTime),
              iqcId: iqcId,
              iqcNo: res.data.iqcItem.iqcNo,
              productId: res.data.iqcItem.productId,
              productNo: res.data.iqcItem.productInfo.no,
              productName: res.data.iqcItem.productInfo.name,
              productSpec: res.data.iqcItem.productInfo.spec,
              prodTypeId: res.data.iqcItem.productInfo.prodTypeId,
              prodTypeName: res.data.iqcItem.productInfo.prodTypeName,
              inspectorId: res.data.iqcItem.inspectorId,
              manufacturerId: res.data.iqcItem.manufacturerId,
              chkShiftId: res.data.iqcItem.chkShiftId,
              batch: res.data.iqcItem.batch,
              reportNo: res.data.iqcItem.reportNo,
              totalQuantity: res.data.iqcItem.totalQuantity,
              sampleQuantity: res.data.iqcItem.sampleQuantity,
              badQuantity: res.data.iqcItem.badQuantity,
              badRate: res.data.iqcItem.badRate,
              result: res.data.iqcItem.result,
              qcExplain: res.data.iqcItem.qcExplain,
              caseExplain: res.data.iqcItem.caseExplain,
              reviewProcessId: res.data.iqcItem.reviewProcessId,
              prodUnitName: res.data.iqcItem.productInfo.prodUnitName
            }
            that.productId = res.data.iqcItem.productId;
            if (that.ruleForm.badRate == null) {
              that.BadNumber();
            }
            that.iqcParamsRefresh = res.data.paramRecordList
            if(that.copy=='copy'){
              that.iqcId=null
              that.ruleForm.iqcId=null
              that.reviewState=0;
              that.ruleForm.iqcNo=""
              that.ruleForm.DataTime=new Date()
              that.ruleForm.inspectorId=that.userids
            };

      
            // that.state = that.reviewState
            // //状态修改
            // if (that.state == 0 || that.state == 3) {
            //   that.block.review = false;
            //   that.button.add = true;
            //   that.button.review = false;
             
              
            //   if ((that.state == 3 || that.state == 0) && that.userids == that.ruleForm.inspectorId) {
            //     that.inputDisbale = false;
            //   } else {
            //     that.inputDisbale = true;
            //     that.button.add = false;
            //   }
               
            // }
            // if (that.state == 1 || that.state == 2) {
            //   that.inputDisbale = true;
            //   that.button.add = false;
            //   if (that.ruleForm.result == 0) {//不合格才有评审记录
            //     that.block.review = true;
            //     alert(that.button.review)
            //     alert(1)

            //   } else {
            //     that.block.review = false;
            //     alert(2)
            //   }
             
            // }

            // alert("refreshData: reviewState = " + that.reviewState)
            //状态修改
            if (that.reviewState == 0 || that.reviewState == 3) { //未发起评审或审核驳回
              that.block.review = false;
              that.button.add = true;
              that.button.review = false;
             
              
              if ((that.reviewState == 3 || that.reviewState == 0) && that.userids == that.ruleForm.inspectorId) {
                that.inputDisbale = false;
              } else {
                that.inputDisbale = true;
                that.button.add = false;
              }
               
            }else {
              that.inputDisbale = true;
            }
            if (that.reviewState == 1 || that.reviewState == 2) { //待审核 2未定义（暂未使用）
              that.inputDisbale = true;
              that.button.add = false;
              that.block.review = true; 
              that.button.review = true; //打开评审按钮
            }
            // alert("===refreshData: reviewState = " + that.reviewState + ", that.button.review = "  + that.button.review)

            that.prodBatch.indeV = res.data.iqcItem.productId;
            that.iqcDefects = res.data.defectRecordList;
            if (that.iqcDefects) {
              for (let i in that.iqcDefects) {
                let inspectionTypeId = that.iqcDefects[i].inspectionTypeId;
                let resp = that.$iqis.utils.syncget('/basic/defecttypelist/' + inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
                let defectTypeList = resp ? resp.data || [] : [];
                that.iqcDefects[i]['defectTypeList'] = defectTypeList;
              }
              let chkDevTypeIds = []
              for(let i in that.iqcDefects){
                if(!that.iqcDefects[i].chkDevTypeId){that.iqcDefects[i].chkDevTypeId=-1}
                if(that.iqcDefects[i].chkDevTypeId!=-1){

                  chkDevTypeIds.push(that.iqcDefects[i].chkDevTypeId.replace(/\,/g,'_'))
                }else{
                  chkDevTypeIds.push(that.iqcDefects[i].chkDevTypeId)
                }
              }
              let resp =chkDevTypeIds?that.$iqis.utils.syncget('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{useState: 1,page: 1,limit: 9999}):null;
              for(let i in that.iqcDefects){
                let chkDevList = resp ? resp.data[i]||[] : [];
                chkDevList.unshift({chkDevId:null,name:i18n.t('Unlimited')});
                that.iqcDefects[i]['chkDevTypeList'] = chkDevList;
              }
            }

            // //console.log(that.iqcDefects,2222);

            for (let x in that.iqcDefects) {
              that.iqcDefects[x].defectNumber = parseInt(x)
              /*that.iqcDefects[x].chdDevTypeList=[]*/
              // that.chkdevlistData(res.data.defectRecordList[x].chkDevTypeId, x);
              that.iqcDefects[x].defectTypeName = res.data.defectRecordList[x].defectTypeName;
              that.iqcDefects[x].qltyLvId = res.data.defectRecordList[x].qltyLvId;
              that.iqcDefects[x].inspectionTypeName = res.data.defectRecordList[x].inspectionTypeName;
              //that.chkdevlistData(that.iqcDefects[x].chkDevTypeId,x)
              if (that.iqcDefects[x].extInfoList == null) {
                that.iqcDefects[x].extInfoList = new Array();
              }
            }
            that.defecttypeD();
            that.DefectGradeData();
            that.DefectPositionData();
            that.prodBatch.reviewProcessIndex = res.data.iqcItem.reviewProcessId;
            if (that.prodBatch.reviewProcessIndex != null && that.ruleForm.result == 0) {
              that.prodBatch.reviewProcessstate = true
            }
            that.prodBatch.inspectorName = res.data.iqcItem.inspectorName;
            // if ((that.state == 2 || that.state == 1)) {//待审核或审核通过
            //   that.getReviewRecord(iqcId)
            // }
            // alert("refreshData: reviewState = " + that.reviewState + ", that.button.review = "  + that.button.review)
            if ((that.reviewState == 1)) {//待审核
              that.getReviewRecord(iqcId) //拿评审人员及评审记录等信息，确定当前评审状态
            }

          })

        })

      },
      //获取检验人员
      spectorName() {
        let that = this;
        let idValueMap = [];
        let res = that.$iqis.utils.syncget('/tenant/user?page=1&limit=99999')//改为同步
        // let url = "/tenant/user?page=1&limit=99999";
        // that.$http.get(url).then((res) => {
          let urlProduct = res.data
          urlProduct.forEach(e => {
            let inspectorId = e.userId;
            let inspectorName = e.name;
            let boxName = {inspectorId, inspectorName};
            for (var i = 0; i < idValueMap.length; i++) {
              if (idValueMap[i].name != e.name) {
                idValueMap[i].name.push(boxName);
                return;
              }
            }
            idValueMap.push({
              name: [boxName],
            })
          });
          that.prodBatch.spectorNameData = idValueMap[0].name;
          that.CurrentOperator(idValueMap[0].name)
        // })
      },
      //获取当前登录人员信息 /tenant/user/profile
      CurrentOperator(obj) {
        let that = this;
        let res = that.$iqis.utils.syncget('/tenant/user/profile')
        // let url = '/tenant/user/profile'
        // that.$http.get(url).then((res) => {
          that.currentUser = res.data;
          for (let i = 0; i < obj.length; i++) {
            if (obj[i].inspectorId === res.data.userId) {
              that.userids = res.data.userId;
              that.ruleForm.inspectorId = res.data.userId;
            }
          }
        // })
      },

      //select选中
      changeProductId(val, method) {
        //console.log(val)
        let that = this
        // that.productName(val,'select');
        that.detailData(val);
        // that.prodBatch.dataVB.push(val);
        
        // if (that.prodBatch.dataVB.length > 1) {
          // that.ParameterDetails(val)
        // }
      },
      //参数记录表详情
      ParameterDetails(val) {
        let that = this
        // let url = "/basic/product/detail/"
        // that.$http.get(url + val).then((res) => {
          // //console.log(res.data,'参数记录')
          // that.productDetail = res.data.settings.qc.iqc.params
          let param = {}
          let paramInfo
          let paramRecordList = []
          if (that.productDetail.length == 0) {
            that.iqcParams = []
          } else {
            for (let i = 0; i < that.productDetail.length; i++) {
              that.productDetail[i].paramValueArray = []
              let param = {
                expand:true,
                sign:0,
                paramId: that.productDetail[i].prodChkParamId,
                paramInfo: that.productDetail[i],
                paramValueArray: that.productDetail[i].paramValueArray,
                paramValue: ""
              }
              paramRecordList.push(param);
            }
            let iqcId = that.$props.params && that.$props.params.iqcId;
            if (iqcId) {
              if (val == that.productId && that.iqcParamsNew.length > 0) {
                that.iqcParams = JSON.parse(JSON.stringify(that.iqcParamsNew));
                
              } else {
                that.iqcParams = JSON.parse(JSON.stringify(paramRecordList));
                
                
              }
            } else {
              that.iqcParams = JSON.parse(JSON.stringify(paramRecordList));
            }
          }
        // })
      },
      //获取产品信息
      productName(val,type) {
        let that = this;
        let idValueMap = [];
        // let productData = []
        // let url_product = "/basic/product?page=1&limit=99999&examType=1&useState=1";//{examType:1, useState:1, page:1,limit:99999999}
        // that.$http.get(url_product).then((res) => {
        if(type!='select'){
          let res = that.$iqis.utils.syncget('/basic/product?page=1&limit=99999&examType=1&useState=1');//带出缺陷名称列表

          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].examType == 1 || res.data[i].examType == 3 || res.data[i].examType == 5 || res.data[i].examType == 7) {
              that.productData.push(res.data[i])
            }
          }
          
        }
        
        if (that.iqcId && that.inputDisbale && that.productData.indexOf(that.ruleForm.productId) == -1) {
          that.$Notice.warning({title: i18n.t('iqc.openInspectFirst')})
        }
        if (that.iqcId && !that.inputDisbale && that.productData.indexOf(that.ruleForm.productId) == -1) {
          that.ruleForm.prodTypeId = '';
        }
        that.productData.forEach(e => {
          let productId = e.productId;
          let no = e.no;
          let name = e.name;
          let typeName = e.prodTypeName;
          let spec = e.spec;
          let boxOn = {no, productId, name};
          let boxName = {name, productId};
          let boxSpec = {spec, productId};
          for (var i = 0; i < idValueMap.length; i++) {
            if (idValueMap[i].name != e.name) {
              idValueMap[i].no.push(boxOn);
              idValueMap[i].name.push(boxName);
              idValueMap[i].spec.push(boxSpec);
              return;
            }
          }
          idValueMap.push({
            no: [boxOn],
            name: [boxName],
            spec: [boxSpec],
          })
        });
        for (var index in that.productData) {
          if (val === that.productData[index].productId) {
            that.ruleForm.prodUnitName = that.productData[index].prodUnitName
            that.basicCategory(that.productData[index].prodTypeName)
          } else {
            that.ruleForm.prodTypeId = '';
          }
        }
        that.prodBatch.productNo = idValueMap[0].no;
        that.prodBatch.productNames = idValueMap[0].name;
        that.prodBatch.productSpec = idValueMap[0].spec;
        // })
      },
      //获取产品类别
      basicCategory(obj) {
        let idValueMap = [];
        let url_prodtype = "/basic/prodtype?limit=99999999"
        this.$http.get(url_prodtype).then((res) => {
          let urlProduct = res.data
          urlProduct.forEach(e => {
            let prodTypeId = e.prodTypeId;
            let name = e.name;
            let boxName = {name, prodTypeId}
            for (var i = 0; i < idValueMap.length; i++) {
              if (idValueMap[i].name != e.name) {
                idValueMap[i].name.push(boxName);
                return;
              }
            }
            idValueMap.push({
              name: [boxName]
            });
          });
          for (var index in urlProduct) {
            if (obj === urlProduct[index].name) {
              this.ruleForm.prodTypeId = urlProduct[index].prodTypeId
            }
          }
          this.prodBatch.productTypeName = idValueMap[0].name;
        })
      },
      //产品详细查询
      detailData(val) {
        let that = this;
        let turrn = false
        let totalQuantity
        let url = "/basic/product/detail/"
        let urls = "/business-rule/product/lenient-transfer?productId="
        // that.$http.get(url + val).then((res) => {
          let res = that.$iqis.utils.syncget(url+val);
          // this.ext = res.data.settings.ext
          let iqcParams = []
          //let changeProperty = that.changeProductFlag;
          if(that.changeProductFlag){
            that.changeProductFlag=false;
            iqcParams = that.iqcParamsRefresh
          }else{
            iqcParams = res.data.settings.qc.iqc.params
            
          }
          if(that.productIdCache!=val){
              that.iqcParamss = res.data.settings.qc.iqc.property
          }else{
              that.iqcParamss = that.productPropertyCache
          }
          let chkDevTypeIds = []
          for(let i in iqcParams){
            if(!iqcParams[i].chkDevTypeId){iqcParams[i].chkDevTypeId="-1"}
            chkDevTypeIds.push(iqcParams[i].chkDevTypeId.replace(/\,/g,'_'))
          }
          let resp =chkDevTypeIds?that.$iqis.utils.syncget('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{useState: 1,page: 1,limit: 9999}):null;
          for(let i in iqcParams){
            let chkDevList = resp ? resp.data[i]||[] : [];
            chkDevList.unshift({chkDevId:null,name:i18n.t('Unlimited')});
            iqcParams[i]['chkDevList'] = chkDevList;
          }
          that.iqcParams = iqcParams
          
          for(let i= 0; i < that.iqcParams.length; i++){
            that.iqcParams[i].expand = true
          }
          
          that.samplingPlanType=res.data.settings.qc.iqc.aql.samplingPlanType
          let propertyList = res.data.settings.qc.iqc.property  
          
          // if(!changeProperty){
          //   alert()
            
          // }
          for(let i = 0; i < that.iqcParamss.length; i++){
            that.iqcPropertyRecordList.push(
              {
                "inspectionExplain": that.iqcParamss[i].inspectionExplain ? that.iqcParamss[i].inspectionExplain : '',//说明
                "inspectionId": that.iqcParamss[i].inspectionId,//检验项目id
                "inspectionLevel": that.iqcParamss[i].inspectionLevel,//标准
                "inspectionName": that.iqcParamss[i].inspectionName,//检验项目名称
                "iqcId": this.iqcId,
                "propertyRecordId":that.mark ? '' : that.iqcParamss[i].propertyRecordId ? that.iqcParamss[i].propertyRecordId : '',//组件id
                "result": that.iqcParamss[i].result ? that.iqcParamss[i].result : 0,//检验结果
              }
            )
          }
          console.log(that.iqcPropertyRecordList);
          
          // console.log(that.iqcPropertyRecordList,'that.iqcPropertyRecordList');
          
          that.ruleForm.productSpec=res.data.spec;
          that.ruleForm.productName=res.data.name;
          that.ruleForm.prodTypeName=res.data.prodTypeName;
          that.ruleForm.prodUnitName=res.data.prodUnitName;
          that.samplingPlanType=res.data.settings.qc.iqc.aql.samplingPlanType;
          if(that.samplingPlanType==0){
            that.fromIqc.crAql = res.data.settings.qc.iqc.aql.crAql,
            that.fromIqc.majAql = res.data.settings.qc.iqc.aql.majAql,
            that.fromIqc.minAql = res.data.settings.qc.iqc.aql.minAql
            that.fromIqc.inspectionStandard = res.data.settings.qc.iqc.aql.inspectionStandard
            that.fromProduct.qcType=res.data.settings.qc.iqc.aql.samplingPlanCode
          }else{
             that.fromIqc.crAql = ''
            that.fromIqc.majAql = ''
            that.fromIqc.minAql = ''
            that.fromIqc.inspectionStandard = ''
            that.fromProduct.qcType=''
          }
          let productId = res.data.productId;
          let qcType = res.data.settings.qc.iqc.aql.samplingPlanCode;
          let type = 0;
          if (qcType == 'GB/T2828.1-2012') {
            type = 1;
          }
          if(qcType=='full'){
            that.forCrTable.sampleNum=that.ruleForm.totalQuantity;
          }
          if(qcType=='percent'){
            that.forCrTable.sampleNum=that.ruleForm.totalQuantity*that.fromIqc.inspectionStandard/100
          }
          if(qcType=='full'||qcType=='percent'){
            if(that.sampleRefreshFlag1&&that.sampleRefreshFlag2){
              that.sampleRefreshFlag1=false;
            }else{
              that.ruleForm.sampleQuantity=that.forCrTable.sampleNum;
            }

            that.fromProduct.lenientTransfer=''
            that.fromIqc.crAql='-'
            that.fromIqc.majAql='-'
            that.fromIqc.minAql='-'
            that.forCrTable.samplingPlanCrAc='-'
            that.forCrTable.samplingPlanMajAc='-'
            that.forCrTable.samplingPlanMinAc='-'
            that.forCrTable.samplingPlanCrRe='-'
            that.forCrTable.samplingPlanMajRe='-'
            that.forCrTable.samplingPlanMinRe='-'
            let iqcParams = JSON.parse(JSON.stringify(that.iqcParams))
            for(let i in iqcParams){
              iqcParams[i]['num']=that.forCrTable.sampleNum
            }
            that.iqcParams=iqcParams
            return;
          }
         

          let endDate = new Date(that.ruleForm.DataTime).getTime();
          let calculateUrl = "/business-rule/product/new-calculate-lenient-transfer?productId=" + productId + "&qcType=iqc&endDate=" + endDate;
          that.$http.put(calculateUrl).then(resp => {
            that.fromProduct.lenientTransfer = resp.data.lenientTransfer;
            if(qcType=='full'||qcType=='percent'){
              that.fromProduct.lenientTransfer=''
            }
            that.getAql(that.ruleForm.totalQuantity)
            if (resp.data.extStatus != null) {
              that.fromProduct.extStatus = resp.data.extStatus;
            }
            //console.log(that.fromProduct.extStatus,"附加状态");

            that.$http.get(urls + productId + '&qcType=' + qcType).then((resname) => {
              // that.fromProduct.qcType = resname.data.qcType

              if (that.fromIqc.crAql == '' && that.fromIqc.majAql == '' && that.fromIqc.minAql == '') {
                that.forCrTable.samplingPlanAc = ''
                that.forCrTable.samplingPlanRe = ''
                that.forMaTable.samplingPlanAc = ''
                that.forMaTable.samplingPlanRe = ''
                that.forMinTable.samplingPlanAc = ''
                that.forMinTable.samplingPlanRe = ''
                that.forCrTable.sampleNum = ''
              } else {
                if (that.ruleForm.totalQuantity == '') {
                  totalQuantity = 0;
                } else {
                  totalQuantity = that.ruleForm.totalQuantity
                }
                let data=[
                  {
                    code:that.fromProduct.qcType,
                    level:that.fromIqc.inspectionStandard,
                    tolerance:that.fromProduct.lenientTransfer,
                    aql:that.fromIqc.crAql,
                    num:totalQuantity,
                    type:type
                  },
                  {
                    code:that.fromProduct.qcType,
                    level:that.fromIqc.inspectionStandard,
                    tolerance:that.fromProduct.lenientTransfer,
                    aql:that.fromIqc.majAql,
                    num:totalQuantity,
                    type:type
                  },
                  {
                    code:that.fromProduct.qcType,
                    level:that.fromIqc.inspectionStandard,
                    tolerance:that.fromProduct.lenientTransfer,
                    aql:that.fromIqc.minAql,
                    num:totalQuantity,
                    type:type
                  },
                ]
                // data = JSON.stringify(data)
                that.$http.post('/sampling-plan/aql?samplingPlanParamDtos',data,that.headers).then((res) => {
                  that.forCrTable.samplingPlanAc = res.data[0].samplingPlanAc
                  that.forCrTable.samplingPlanRe = res.data[0].samplingPlanRe
                  that.forMaTable.samplingPlanAc = res.data[1].samplingPlanAc
                  that.forMaTable.samplingPlanRe = res.data[1].samplingPlanRe
                  that.forMinTable.samplingPlanAc = res.data[2].samplingPlanAc
                  that.forMinTable.samplingPlanRe = res.data[2].samplingPlanRe
                  let iqcParams = JSON.parse(JSON.stringify(that.iqcParams))
                  for(let i in iqcParams){
                    iqcParams[i]['num']=that.forCrTable.sampleNum

                  }
                  
                  that.iqcParams=iqcParams
                })
                // if (that.fromIqc.crAql != '') {
                //   let urlaql = "/sampling-plan/aql?code=" + that.fromProduct.qcType + "&level=" + that.fromIqc.inspectionStandard + "&tolerance=" + that.fromProduct.lenientTransfer + "&aql=" + that.fromIqc.crAql + "&num=" + totalQuantity + "&type=" + type;
                //   that.$http.get(urlaql).then((res) => {
                //     that.forCrTable.samplingPlanAc = res.data.samplingPlanAc
                //     that.forCrTable.samplingPlanRe = res.data.samplingPlanRe
                //     // that.forCrTable.sampleNum=res.data.sampleNum
                //   })
                // }
                // if (that.fromIqc.majAql != '') {
                //   let urlaqls = "/sampling-plan/aql?code=" + that.fromProduct.qcType + "&level=" + that.fromIqc.inspectionStandard + "&tolerance=" + that.fromProduct.lenientTransfer + "&aql=" + that.fromIqc.majAql + "&num=" + totalQuantity + "&type=" + type;
                //   that.$http.get(urlaqls).then((res) => {
                //     that.forMaTable.samplingPlanAc = res.data.samplingPlanAc
                //     that.forMaTable.samplingPlanRe = res.data.samplingPlanRe
                //   })
                // }
                // if (that.fromIqc.minAql != '') {
                //   let urlaqlk = "/sampling-plan/aql?code=" + that.fromProduct.qcType + "&level=" + that.fromIqc.inspectionStandard + "&tolerance=" + that.fromProduct.lenientTransfer + "&aql=" + that.fromIqc.minAql + "&num=" + totalQuantity + "&type=" + type;
                //   that.$http.get(urlaqlk).then((res) => {
                //     that.forMinTable.samplingPlanAc = res.data.samplingPlanAc
                //     that.forMinTable.samplingPlanRe = res.data.samplingPlanRe
                //   })
                // }
                if (that.ruleForm.totalQuantity) {
                  // that.getAql(this.ruleForm.totalQuantity,'refreshData')
                }
              }
            })
          })
        // })

      },
      //获取参数记录
      transferData() {
        let that = this;
        let url = '/examinecenter/iqc/iqc'
        that.$http.get(url).then((res) => {

        })
      },
      defResults() {
        this.arr =[]
        for(let i in this.iqcDefects) {
          let item = this.iqcDefects[i]
          this.arr.push(item.decisionResultsId)
        }
      },
      judgeDefResults() {
        this.arr1 =[]
        for(let i in this.iqcDefects) {
          let item = this.iqcDefects[i]
          this.arr1.push(item.decisionResultsId)
        }
      },
      //加载供应商
      dataTable() {
        let that = this;
        let idValueMap = [];
        let url = "/bas/manufacturer?page=1&limit=999"
        // that.$http.get(url).then((res) => {
        let res = that.$iqis.utils.syncget(url);
          let urlProduct = res.data
          urlProduct.forEach(e => {
            let manufacturerId = e.manufacturerId;
            let manufacturerName = e.manufacturerAbbreviation;
            let manufacturerNum = e.manufacturerNum;
            let boxOn = {manufacturerId, manufacturerNum, manufacturerName};
            for (var i = 0; i < idValueMap.length; i++) {
              if (idValueMap[i].manufacturerName != e.manufacturerName) {
                idValueMap[i].no.push(boxOn);
                return;
              }
            }
            idValueMap.push({
              no: [boxOn],
            })
          });
          if(idValueMap[0]) {
            that.prodBatch.dataTable = idValueMap[0].no;
          }else {
            that.prodBatch.dataTable = []
          }
        // })
      },
      //检验班别
      chkshiftFun() {
        let that = this;
        let url = "/basic/chkshift?page=1&limit=99999"
        that.$http.get(url).then((res) => {
          that.prodBatch.chkshiftData = res.data
        })
      },
      //获取缺陷数据
      defecttypeD() {
        let that = this;
        let idValueMap = [];
        let url = "/basic/defecttype?page=1&limit=9999"
        that.$http.get(url).then((res) => {
          let urlProduct = res.data
          that.prodBatch.DefectName = res.data;
          that.prodBatch.DefectName.unshift({defectTypeId:0,name:"尺寸NG"})
        })
      },
      TesySynthesis(obj, index) {
        let that = this;
        // this.onDefectNameChange();
        for (let x in that.prodBatch.DefectName) {
          if (obj == that.prodBatch.DefectName[x].defectTypeId) {
            // that.iqcDefects[index].inspectionTypeName = that.prodBatch.DefectName[x].inspectionTypeName;
            // that.DefectGradeData(that.prodBatch.DefectName[x].qltyLvId, index)
            // that.chkdevlistData(that.prodBatch.DefectName[x].inspectionType.chkDevTypeId, index)
          }
        }
      },
      //缺陷等级
      DefectGradeData(Lvid, index) {
        let that = this;
        let idValueMap = [];
        let url = "/basic/qltylv?page=1&limit=99999"
        that.$http.get(url).then((res) => {
          let urlProduct = res.data
          that.prodBatch.DefectGrade = urlProduct;
          for (let x in that.prodBatch.DefectGrade) {
            if (Lvid == that.prodBatch.DefectGrade[x].qltyLvId) {
              that.iqcDefects[index].qltyLvId = that.prodBatch.DefectGrade[x].qltyLvId;
            }
          }
        })
      },
      // //检验设备类别
      // chkdevlistData(objId, index) {
      //   let that = this;
      //   let url = "/basic/chkdevlist/"
      //   that.$http.get(url + objId).then((res) => {
      //     let urlProduct = res.data
      //     that.iqcDefects[index].chdDevTypeList = []
      //     for (let x in urlProduct) {
      //       if (objId === urlProduct[x].chkDevTypeId) {
      //         that.iqcDefects[index].chkDevTypeId = urlProduct[x].chkDevTypeId;
      //         that.iqcDefects[index].chdDevTypeList.push(urlProduct[x]);
      //       }
      //     }
      //     that.$set(that.iqcDefects, index, that.iqcDefects[index])
      //   })
      // },
      //缺陷位置
      DefectPositionData() {
        let that = this;
        let url = "/basic/defectloc?page=1&limit=99999"
        that.$http.get(url).then((res) => {

          that.prodBatch.DefectPosition = res.data;
          //console.log(that.prodBatch.DefectPosition, 11111111111111111111111111)

          that.prodBatch.DefectPosition.unshift({defectLocId: i18n.t('Unlimited'), name: i18n.t('Unlimited')});
        })
      },
      //添加缺陷记录
      addDefect() {
        // this.iqcDefects=[]
        // // console.log(this.paramValuearray,67899)
        // console.log(this.iqcParams,67899)
        // for(let i in this.paramValuearray) {//遍历参数记录
        //   let item = this.paramValuearray[i]
        //   let iqcParams = this.iqcParams[i]//参数记录对应的一行的信息
        //   let number = 0
        //   for(let j in item) {//字符转数值
        //     if(item[j]) {
        //       item[j]=Number(item[j])
        //     }
        //   }
        //   for(let i = 0;i<item.length;i++){//去掉空字符
        //       if(item[i]==''){
        //           item.splice(i,1);
        //           i=i-1;
        //       }
        //   }
        //   for(let i in item) {//遍历出标红数量
        //     if(item[i]>iqcParams.usl || item[i]<iqcParams.lsl) {
        //       number++
        //     }
        //   }
        //   let AS = item.sort((a, b) => a - b)
        //   let max = AS[item.length-1]//最大值
        //   let min = AS[0]//最小值
        //   let record
        //   if(min>iqcParams.sl) {
        //     record = `规格:${iqcParams.sl} 正${iqcParams.usl} 负${iqcParams.lsl} 实测最大${max}`
        //   }
        //   if(max<iqcParams.sl) {
        //     record = `规格:${iqcParams.sl} 正${iqcParams.usl} 负${iqcParams.lsl} 实测最小${min}`
        //   }
        //   if(min<=iqcParams.sl && max >=iqcParams.sl) {
        //     record = `规格:${iqcParams.sl} 正${iqcParams.usl} 负${iqcParams.lsl} 实测最大${max} 实测最小${min}`
        //   }
        //   if(max>iqcParams.usl || min<iqcParams.lsl) {//新增缺陷的一行数据
        //     let obj = {}
        //     obj.inspectionTypeId = iqcParams.inspectionTypeId//检验项目
        //     obj.inspectionTypeName = iqcParams.inspectionTypeName
        //     obj.defectName = "尺寸NG"//缺陷名称
        //     obj.sampleQuantity = iqcParams.num//实抽样数
        //     obj.defectCount = (number/item.length)*iqcParams.num//缺陷数
        //     obj.defectRate = ((number/item.length)*iqcParams.num)/iqcParams.num///缺陷率
        //     obj.remark = record
        //     this.iqcDefects.push(obj)
        //   }
        // }
        // this.iqcDefects 缺陷的data 
        // this.paramValuearray 记录的值
        // this.iqcParams 参数记录的data
        this.iqcDefects=this.$iqis.utils.tableHelper.defects(this.iqcDefects,this.paramValuearray,this.iqcParams,this.iqcPropertyRecordList)
        return
        let that = this;
        that.discountData.tableData.iqcId = that.prodBatch.iqcId
        let obj = JSON.parse(JSON.stringify(that.discountData.tableData))
        that.iqcDefects.push(obj)
        let index = that.iqcDefects.length
        that.iqcDefects[index - 1].defectNumber = index - 1
        // //console.log($(".location .ivu-table-body").scrollHeight)
        this.$nextTick(function(){
          $(".location .ivu-table-body").scrollTop((index-5)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');
        })
      },
      //评审流程
      reviewProcess() {
        let that = this;
        let url = '/basic/reviewprocess?page=1&limit=9999'
        that.$http.get(url).then((res) => {
          that.ProcessIdList = res.data
          that.ProcessIdList.unshift({reviewProcessId:null,name:i18n.t('noReview')})
        })

      },

      deleteTableSelected() {
        let that = this;
        let ss = this.$refs.paramTableFects.getSelection();
        for (let i = 0; i < that.iqcDefects.length; i++) {
          for (let j = 0; j < ss.length; j++) {
            if (that.iqcDefects[i].rowId === ss[j].rowId) {
              that.iqcDefects.splice(i, 1)
            }
          }
        }
      },
      //评审记录
      getReviewRecord(iqcId) { //是老评审方法？？
        return
        let that = this;
        let url = "/examinecenter/iqc/reviewrecord/"
        that.$http.get(url + iqcId).then((res) => {
          // alert("getReviewRecord: reviewState = " + that.reviewState + ", that.button.review =" + that.button.review)

          //检验中
          // if(that.state == 0){
          //   that.inputDisbale=false;
          // }
          // //待审核
          // if(that.state == 1){

          //   that.inputDisbale=true;
          // }

          // if(that.state == 2){

          //   that.inputDisbale=true;
          //   if(that.prodBatch.result == 0){
          //       that.submDataButton=true;

          //       }else{
          //       that.submDataButton=false;

          //       }
          // }
          // //审核不合格
          // if(that.state == 3){
          //   that.submDataButton=false;
          //   //审核不合格 且当前登入ID 是检验员 可以输入，不是则不可以输入
          //   if(that.userids == that.ruleForm.inspectorId){
          //     that.inputDisbale=false;

          //   }else{
          //     that.inputDisbale=true;
          //   }
          // }
          let JudgePerson = res.data[res.data.length - 1] //最后一个

          for (let i = 1; i < res.data.length; i++) {
            if (res.data[0].treatmentType == null) {
              res.data[i].disabled = true
              if (that.state == 3) {//|| that.state == 2
                res.data[0].disabled = true;
              }
            } else {
              if (JudgePerson.treatmentType != null) {
                res.data[i].disabled = true;
                // res.data.pop().disabled=false;
              }
            }
            if (JudgePerson.treatmentType != null) {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].disabled = true;
              }
              if (that.userids == JudgePerson.reviewerId) {
                if (that.state == 3) {
                  res.data[res.data.length - 1].disabled = true;
                } else {
                  res.data[res.data.length - 1].disabled = false;
                }
              }
            }
          }
          that.HandleList = res.data //审核人列表
          //console.log(res.data, 1212)
          if (that.userids == that.HandleList[0].reviewerId) {
            that.HandleList[0].dataTime = that.timetrans(new Date() / 1000);
          } else {
            that.HandleList[0].dataTime = i18n.t("pleaseChoose")
          }
          if (that.HandleList[0].treatmentType) {
            for (let i = 0; i < that.HandleList.length; i++) {
              if (that.HandleList[i].reviewTime) {
                that.HandleList[i].dataTime = that.timetrans(that.HandleList[i].reviewTime / 1000)
              } else {

                if (i > 0 && that.userids == that.HandleList[i].reviewerId) {
                  that.HandleList[i].dataTime = that.timetrans(new Date() / 1000);
                } else {
                  that.HandleList[i].dataTime = i18n.t("pleaseChoose")
                }
              }
            }
          }
          // let isShow=true;
          // for(var i = 1;i<that.HandleList.length;i++){
          //   if(that.currentUser.userId==that.HandleList[i].reviewerId){
          //     isShow=false;
          //   }
          // }
          // if(!isShow){
          //   that.submDataButton=true;
          // }else{
          //   that.submDataButton=false;
          // }
          // let flag = true;
          let handlers = []
          for (var i = 0; i < 6; i++) {
            handlers.push(that.HandleList[i].reviewerId)
            // if(that.HandleList[0].reviewerId==that.HandleList[i].reviewerId&&that.HandleList[0].reviewerId==that.currentUser.userId){
            //   flag = false;
            //   that.button.review=true;
            //   break;
            // }
          }
          //若第1部分未审核
          if (!that.HandleList[0].treatmentType) {

            if (that.userids == that.HandleList[0].reviewerId) {//若当前是审核人
              that.button.review = true;
            } else {
              that.button.review = false;
              that.$Notice.warning({
                title: i18n.t('iqc.auditFirst'),
                desc: ''
              });
            }
          }
          // 若第1部分已审核，第6部分未判定
          else if ((that.HandleList[0].opinion || that.HandleList[0].treatmentType) && (JudgePerson.opinion == null && JudgePerson.treatmentType == null)) {
            if (handlers.indexOf(that.userids) !== -1) {//若是审核/评审/判定人
              that.button.review = true;
            } else {
              that.button.review = false;
            }
          }
          //若第6部分已判定
          else if (JudgePerson.opinion !== null || JudgePerson.treatmentType !== null) {
            if (that.userids == JudgePerson.reviewerId) {//若是判定人
              that.button.review = true;
            } else {
              that.button.review = false;
            }
            if(that.reviewState==4){
              that.HandleList[5].disabled=true;
              that.button.review = false;
            }
          }
          // for(var i = 0;i<that.HandleList.length;i++){
          //   //console.log(flag,that.HandleList.length,that.HandleList[i].reviewerId ,that.currentUser.userId,'审核')
          //   if(flag){
          //     if(that.currentUser.userId == that.HandleList[i].reviewerId){
          //       if(!that.HandleList[0].treatmentType&&(JudgePerson.opinion==null||JudgePerson.treatmentType==null)){

          //         that.button.review=false;
          //       }
          //       //如果最后一个评审人提交则全部都不能提交
          //       else if(JudgePerson.opinion!=null||JudgePerson.treatmentType !=null){
          //         that.button.review=false;
          //       }
          //       //如果登入的是最后一个评审人,则可以提交
          //       else if(that.userids == JudgePerson.reviewerId){
          //         that.button.review=true;
          //       }
          //     }
          //   }
          // }
          //   //审核不合格
          //   if(that.state == 3){
          //     that.submDataButton=false;
          //     //审核不合格 且当前登入ID 是检验员 可以输入，不是则不可以输入
          //     if(that.userids == that.ruleForm.inspectorId){
          //       that.inputDisbale=false;
          //     }else{
          //       that.inputDisbale=true;
          //     }
          //   }
          // }
          let requests = false;
          for (let i = 0; i < that.HandleList.length; i++) {
            if (that.userids == that.HandleList[i].reviewerId) {
              requests = true;
              break;
            }
          }
          if (requests && that.ruleForm.AuditStatus == 3) {
            that.submDataButton = true;
          }
          for (let i = 0; i < that.HandleList.length; i++) {
            if (that.userids != that.HandleList[i].reviewerId) {
              that.submDataButton = false;
            }
          }
        })
      },
      //计算不良率
      BadNumber() {
        let that = this;
        //console.log(this.ruleForm.badQuantity, this.ruleForm.sampleQuantity)
        // if(this.ruleForm.badQuantity!='' && this.ruleForm.sampleQuantity!=''){
        //   //console.log(1)
        //   that.ruleForm.badRate=((that.ruleForm.badQuantity/that.ruleForm.sampleQuantity)*100).toFixed(2)
        // }
        // if(!that.ruleForm.badRate||that.ruleForm.badRate==Infinity||that.ruleForm.badRate==NaN){
        //   //console.log(2)
        //   that.ruleForm.badRate = 0;
        // }
        // if(parseInt(that.ruleForm.badQuantity)==0&&parseInt(that.ruleForm.sampleQuantity)==0){
        //   //console.log(3)
        //   that.ruleForm.badRate = 0;
        //   return;
        // }

        if (this.ruleForm.badQuantity && this.ruleForm.sampleQuantity && this.ruleForm.badQuantity > 0 && this.ruleForm.sampleQuantity > 0) {
          that.ruleForm.badRate = ((that.ruleForm.badQuantity / that.ruleForm.sampleQuantity) * 100).toFixed(2)
        } else {
          that.ruleForm.badRate = 0;
        }
      },
      closePage() {
        this.$emit("close-tab", this.$props.tabKey);
      },
      reviewProcessBtn(val) {
        let that = this
        if (val === that.prodBatch.reviewProcessIndex) {
          that.prodBatch.reviewProcessstate = true
        } else {
          that.prodBatch.reviewProcessstate = false
        }
      },

      ReviewState() {
        let that = this;
        for (let i = 0; i < that.HandleList.length; i++) {
          if (that.HandleList[i].reviewer == that.prodBatch.inspectorName) {
            if (that.HandleList[i].dataTime == '' || that.HandleList[i].reviewer == null || that.HandleList[i].treatmentType == null) {
              this.$Notice.warning({
                title: i18n.t("iqc.pe"),
                desc: ''
              });
              that.prodBatch.Success = false;
            } else {
              that.prodBatch.Success = true;
            }
          }
        }
      },
      //数据提交
      submData() {
        let that = this;

        //  alert("iqc-add:submitBtn that.HandleList = " + JSON.stringify(that.HandleList))
        let p = this.$refs.process.getReviewRecord() 
        // alert("p="+ JSON.stringify(p))
        that.HandleList = p
        console.log(p)
        for (let i = 0; i < that.HandleList.length; i++) {
            if (!that.HandleList[i].disabled && !that.HandleList[i].treatmentType) {
              that.$Notice.warning({title: i18n.t('iqc.methodNotNull')});
              return;
              break;
            }
            let state = true;
            state = that.$iqis.utils.formValidate('Word600', i18n.t('iqc.opinion'), that.HandleList[i].opinion, (tips) => {
              that.$Notice.warning({title: tips})
            })
            if (!state) {
              return;
            }
        }

        let resp = that.$iqis.utils.syncget('/examinecenter/iqc/iqcdetail/'+that.prodBatch.iqcId);
        if(resp.data.iqcItem.state==0||resp.data.iqcItem.state==3){
          that.$Notice.warning({title:i18n.t('iqc.rejectStopReview')})
          that.refreshData(that.iqcId)
          return;
        }
        let resp2 = that.$iqis.utils.syncget('/examinecenter/iqc/reviewrecord/'+that.prodBatch.iqcId); 
        if(that.HandleList[5].disabled&&(resp2.data[5].opinion||resp2.data[5].treatmentType)){
          that.$Notice.warning({title:i18n.t('iqc.judgeStopReview')})
          that.refreshData(that.iqcId)
          return;
        }    
        if (that.prodBatch.Success == false) {
          that.submit1 = true;

          for (let i = 0; i < that.HandleList.length; i++) {
            that.HandleList[i].reviewTime = (new Date(that.HandleList[i].dataTime)).getTime()
            that.HandleList[i].dataTime = that.HandleList[i].reviewTime

          }
          if (that.ruleForm.result == 1) {
            that.ruleForm.reviewProcessId = null;
          }
          let url = "/examinecenter/iqc/reviewrecord?iqcId="
          that.$http.put(url + that.prodBatch.iqcId, that.HandleList, that.headers).then((res) => {
            that.$Message.success(i18n.t('iqc.commitSuccess'));
            // this.$emit("open-tab","exam-iqc-list","来料检验","page-exam-iqc-list",null);
            that.closePage()
          })
        }
      },
      //数据提交
      submitBtn() {

        let that = this;
      
        let params = [
          {type: 'Empty', title: i18n.t('iqc.productNo'), value: that.ruleForm.productId},
          // {type: 'Empty', title: i18n.t('iqc.supplier'), value: that.ruleForm.manufacturerId},
          {type: 'Empty', title: i18n.t('iqc.productBatch'), value: that.ruleForm.batch},
          {type: 'No', title: i18n.t('iqc.productBatch'), value: that.ruleForm.batch},
          {type: 'Empty', title: i18n.t('iqc.batchNum'), value: that.ruleForm.totalQuantity},
          {type: 'NumNot0', title: i18n.t('iqc.batchNum'), value: that.ruleForm.totalQuantity},
          {type: 'Empty', title: i18n.t('iqc.workTime'), value: that.ruleForm.chkShiftId},
          {type: 'Empty', title: i18n.t('iqc.iqcNo'), value: that.ruleForm.iqcNo},
          {type: 'No', title: i18n.t('iqc.iqcNo'), value: that.ruleForm.iqcNo},
          {type: 'Empty', title: i18n.t('iqc.createTime'), value: that.ruleForm.DataTime},
          {type: 'Empty', title: i18n.t('iqc.sampleNum'), value: that.ruleForm.sampleQuantity},
          {type: 'NumAllNot0', title: i18n.t('iqc.sampleNum'), value: that.ruleForm.sampleQuantity},
          {type: 'Empty', title: i18n.t('iqc.badNum'), value: that.ruleForm.badQuantity},
          {type: 'Num', title: i18n.t('iqc.badNum'), value: that.ruleForm.badQuantity},
          // {type:'Empty',title:'检验说明',value:that.ruleForm.qcExplain},
          {type: 'Word600', title: i18n.t('iqc.qcExplain'), value: that.ruleForm.qcExplain},
        ]
        if (that.ruleForm.result == 1) {
          that.ruleForm.reviewProcessId = null;
        }
        /* if (that.ruleForm.result == 0) {
          params.push({type: 'Empty', title: i18n.t('iqc.reviewTeam'), value: that.ruleForm.reviewProcessId})
        } */
        let state = true;
        for (let i in params) {
          state = that.$iqis.utils.formValidate(params[i].type, params[i].title, params[i].value, (tips) => {
            that.$Notice.warning({title: tips})//,duration: 0
          })
          if (!state) {
            return;
            break;
          }
        }
        // if(parseInt(that.ruleForm.sampleQuantity)>parseInt(that.ruleForm.totalQuantity)){
        //   that.$Notice.warning({
        //       title: '实际抽样数必须小于批量数！',
        //   });
        //   return;
        // }
        // if(parseInt(that.ruleForm.badQuantity) > parseInt(that.ruleForm.sampleQuantity)){
        //   that.$Notice.warning({
        //       title: '不良数必须小于实际抽样数！',
        //   });
        //   that.ruleForm.badRate = '';
        //   return;
        // }
        // if(!that.ruleForm.badRate||that.ruleForm.badRate==Infinity||that.ruleForm.badRate==NaN){
        //   that.ruleForm.badRate = '';
        //   that.$Notice.warning({
        //       title: '请输入正确的不良数或实际抽样数',
        //   });
        //   return;
        // }
        
        /* for(let i in that.iqcParams){
          for(let j in that.iqcParams[i].paramValueArray  ){
            let paramsIqcParams = [
              {type: 'NumAll', title: i18n.t('iqc.paramsRecord'), value: that.iqcParams[i].paramValueArray[j]},
            ]
            let state = true;
            for (let i in paramsIqcParams) {
              state = that.$iqis.utils.formValidate(paramsIqcParams[i].type, paramsIqcParams[i].title, paramsIqcParams[i].value, (tips) => {
                that.$Notice.warning({title: tips})//,duration: 0
              })
              if (!state) {
                return;
                break;
              }
            }
          }
        } */
        for (let i = 0; i < that.iqcDefects.length; i++) {
          if (!that.iqcDefects[i].inspectionTypeId || that.iqcDefects[i].sampleQuantity === '' || that.iqcDefects[i].defectCount === '') {
            that.$Notice.warning({title: i18n.t('iqc.pleaseInput') + i18n.t('iqc.defectRecord') + (i + 1) });
            return;
          }
          let paramsDefects = [
            {type: 'NumNot0', title: i18n.t('iqc.sampleQuantity'), value: that.iqcDefects[i].sampleQuantity},
            {type: 'Num', title: i18n.t('iqc.defectNum'), value: that.iqcDefects[i].defectCount},
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
        
        // let resp = that.$iqis.utils.syncget('/basic/reviewprocess/'+that.ruleForm.reviewProcessId);
        // if(!resp.data.auditorId||!resp.data.auditorName){
        //   that.$Notice.warning({title:'该评审流程缺少审核人'})
        //   return;
        // }
        // if(!resp.data.judgeId||!resp.data.judgeName){
        //   that.$Notice.warning({title:'该评审流程缺少判定人'})
        //   return;
        // }
        for (let i = 0; i < that.iqcDefects.length; i++) {
          if (that.iqcDefects[i].defectLocId == i18n.t('Unlimited')) {
            that.iqcDefects[i].defectLocId = '';
          }
          if (that.iqcDefects[i].chkDevId == i18n.t('Unlimited')) {
            that.iqcDefects[i].chkDevId = '';
          }
        }
        if(that.copy=='copy'){

            that.prodBatch.btnState = 'post'
            for(let i in that.iqcDefects){
              that.iqcDefects[i].defectRecordId=null
              for(let j in that.iqcDefects[i].extInfoList){
                that.iqcDefects[i].extInfoList[i].iqcDefectrecordExtInfoId=null
              }
            }
          }
        if (that.prodBatch.btnState == 'post') {
          let iqcParams = []
          let url = '/examinecenter/iqc/iqcdetail';
          var oldTime = new Date(that.ruleForm.DataTime).getTime()
          that.ruleForm.createTime = oldTime
          for(let i in that.iqcParams){
            let values = this.paramValuearray[i]
            let item = {
              // paramInfo:that.iqcParams[i],
              // paramId:that.iqcParams[i].prodChkParamId||'',
              chkDevId:that.iqcParams[i].chkDevId||'',
              chkDevName:that.iqcParams[i].chkDevName || '',
              paramValueArray:values||[],
              inspectionTypeId:that.iqcParams[i].inspectionTypeId|| '',
              measUnitId:that.iqcParams[i].measUnitId||'',
              usl:that.iqcParams[i].usl||'',
              sl:that.iqcParams[i].sl||'',
              lsl:that.iqcParams[i].lsl||'',
              wll:that.iqcParams[i].wll||'',
              wul:that.iqcParams[i].wul||'',
              scale:that.iqcParams[i].scale||'',
              currentAndParentName:that.iqcParams[i].currentAndParentName||'',
              positiveTolerance:that.iqcParams[i].positiveTolerance||'',
              negativeTolerance:that.iqcParams[i].negativeTolerance||''
            }
            iqcParams.push(item)
          }
          let parmas = {
            defectRecordList: that.iqcDefects,
            iqcItem: that.ruleForm,
            paramRecordList: iqcParams,
            ruleForm: that.ruleForm,
            iqcPropertyRecordList:that.iqcPropertyRecordList
          }
          // for(let i = 0; i <parmas.paramRecordList.length; i++){
          //   let values = this.paramValuearray[i]
          //   parmas.paramRecordList[i].paramValueArray = values || []
          //   parmas.paramRecordList[i].paramId = parmas.paramRecordList[i].prodChkParamId
          // }
          // return;
          // params.paramRecordList[0].paramValueArray.push(this.paramValue)
          // if(that.prodBatch.btnState=='put'){
          //     that.$http.put(url,parmas,that.headers).then((res)=>{
          //           that.closePage()
          //         // that.$Message.success("数据修改成功");
          //     })
          // }
          // else if(that.prodBatch.btnState=='post'){

          that.$http.post(url, parmas, that.headers).then((res) => {
            that.prodBatch.iqcId = res.data.iqcItem.iqcId
            that.ruleForm.iqcId = res.data.iqcItem.iqcId
            // that.$Message.success("数据添加成功");
            that.prodBatch.btnState = 'put'
            that.$http.post('/examinecenter/iqc/iqc/applyaudit?iqcId=' + that.prodBatch.iqcId).then((res) => {
              that.$Message.success(i18n.t('iqc.commitSuccess'));
              that.closePage()
            })
          })
          // }
        } else {
          var oldTime = new Date(that.ruleForm.DataTime).getTime()
          that.ruleForm.createTime = oldTime
          let Success2 = true
          let urls = '/examinecenter/iqc/iqc/applyaudit?iqcId=';
          // if(that.prodBatch.reviewProcessIndex !=null&&that.ruleForm.result==0&&that.state==2){
          //   for(let i=0;i<that.HandleList.length;i++){
          //   if(that.HandleList[i].disabled==false){
          //     if(that.HandleList[i].dataTime==''||that.HandleList[i].reviewer==null||that.HandleList[i].treatmentType==null){
          //       this.$Notice.warning({
          //             title: '请完善处理信息',
          //             desc: ''
          //           });
          //           Success2=false;
          //     }else{
          //       Success2=true;
          //       that.ProcessingPublic()
          //     }
          //   }
          // }
          // }else{

          // }
          if (Success2 == true) {
            let parmas = {
              defectRecordList: that.iqcDefects,
              iqcItem: that.ruleForm,
              paramRecordList: that.iqcParams,
              ruleForm: that.ruleForm,
              iqcPropertyRecordList:that.iqcPropertyRecordList
            }
            for(let i = 0; i <parmas.paramRecordList.length; i++){
            let values = this.paramValuearray[i]
            parmas.paramRecordList[i].paramValueArray = values || []
            parmas.paramRecordList[i].paramId = parmas.paramRecordList[i].prodChkParamId
          }
            if (that.prodBatch.btnState == 'put') {
              that.$http.put('/examinecenter/iqc/iqcdetail', parmas, that.headers).then((res) => {
                // that.$Message.success("数据修改成功");
                that.$http.post(urls + that.prodBatch.iqcId).then((res) => {
                  that.$Message.success(i18n.t('iqc.commitSuccess'));
                  // this.$emit("open-tab","exam-iqc-list","来料检验","page-exam-iqc-list",null);
                  that.closePage()
                })
              })

            }
          }
        }
      },
      //数据保存
      save(val) {
        
        
        let that = this;
        
       
        let params = [
          {type: 'Empty', title: i18n.t('iqc.productNo'), value: that.ruleForm.productId},
          // {type: 'Empty', title: i18n.t('iqc.supplier'), value: that.ruleForm.manufacturerId},
          {type: 'Empty', title: i18n.t('iqc.productBatch'), value: that.ruleForm.batch},
          {type: 'No', title: i18n.t('iqc.productBatch'), value: that.ruleForm.batch},
          {type: 'Empty', title: i18n.t('iqc.batchNum'), value: that.ruleForm.totalQuantity},
          {type: 'NumNot0', title: i18n.t('iqc.batchNum'), value: that.ruleForm.totalQuantity},
          {type: 'Empty', title: i18n.t('iqc.workTime'), value: that.ruleForm.chkShiftId},
          {type: 'Empty', title: i18n.t('iqc.iqcNo'), value: that.ruleForm.iqcNo},
          {type: 'No', title: i18n.t('iqc.iqcNo'), value: that.ruleForm.iqcNo},
          {type: 'Empty', title: i18n.t('iqc.createTime'), value: that.ruleForm.DataTime},
          {type: 'Word600', title: i18n.t('iqc.qcExplain'), value: that.ruleForm.qcExplain},
        ]
        let state = true;
      
        /* if (that.ruleForm.result == 0) {
          params.push({type: 'Empty', title: i18n.t('iqc.reviewTeam'), value: that.ruleForm.reviewProcessId})
        } */
        for (let i in params) {
          state = that.$iqis.utils.formValidate(params[i].type, params[i].title, params[i].value, (tips) => {
            that.$Notice.warning({title: tips})//,duration: 0
          })
          if (!state) {
            return;
            break;
          }
        }
        /* for(let i in that.iqcParams){
          for(let j in that.iqcParams[i].paramValueArray){
            let paramsIqcParams = [
              {type: 'NumAll', title: i18n.t('iqc.paramsRecord'), value: that.iqcParams[i].paramValueArray[j]},
            ]
            let state = true;
            for (let i in paramsIqcParams) {
              state = that.$iqis.utils.formValidate(paramsIqcParams[i].type, paramsIqcParams[i].title, paramsIqcParams[i].value, (tips) => {
                that.$Notice.warning({title: tips})//,duration: 0
              })
              if (!state) {
                return;
                break;
              }
            }
          }
        } */
        //console.log(that.iqcDefects,'所有缺陷记录--------------------')
        // for (let i = 0; i < that.iqcDefects.length; i++) {
        //   if (!that.iqcDefects[i].inspectionTypeId || !that.iqcDefects[i].defectTypeId ||  that.iqcDefects[i].sampleQuantity === '' || that.iqcDefects[i].defectCount === '') {
        //       that.$Notice.warning({title: i18n.t('iqc.pleaseInput') +i18n.t('iqc.defectRecord')+ (i + 1) });
        //       return;
        //   }
        //   let paramsDefects = [
        //     {type: 'NumNot0', title: i18n.t('iqc.sampleQuantity'), value: that.iqcDefects[i].sampleQuantity},
        //     {type: 'Num', title: i18n.t('iqc.defectNum'), value: that.iqcDefects[i].defectCount},
        //   ]
        //   let state = true;
        //   for (let j in paramsDefects) {
        //     state = that.$iqis.utils.formValidate(paramsDefects[j].type, paramsDefects[j].title, paramsDefects[j].value, (tips) => {
        //       that.$Notice.warning({title: tips})//,duration: 0
        //     })
        //     if (!state) {
        //       return;
        //       break;
        //     }
        //   }
        // }
        for (let i = 0; i < that.iqcDefects.length; i++) {
          if (that.iqcDefects[i].defectLocId == i18n.t('Unlimited')) {
            that.iqcDefects[i].defectLocId = '';
          }
          if (that.iqcDefects[i].chkDevId == i18n.t('Unlimited')) {
            that.iqcDefects[i].chkDevId = '';
          }
          // that.iqcDefects[i].abnormalId=that.abnormalId;
        }

        let url = '/examinecenter/iqc/iqcdetail?type=save';
        let Success = true
        // if(that.state==2&&that.prodBatch.reviewProcessIndex !=null&&that.ruleForm.result==0){
        //   for(let i=0;i<that.HandleList.length;i++){
        //   if(that.HandleList[i].disabled===false){
        //     //console.log(that.HandleList[i])
        //     if(false){
        //       this.$Notice.warning({
        //             title: '请完善处理信息',
        //             desc: ''
        //           });
        //           Success=false;
        //     }else{
        //       Success=true;
        //       that.ProcessingPublic()
        //     }
        //   }
        // }
        // }
        if (Success == true) {
          var oldTime = (new Date(that.ruleForm.DataTime)).getTime()
          that.ruleForm.createTime = oldTime
          if (that.ruleForm.result == 1) {
            that.ruleForm.reviewProcessId = null;
          }

          if(that.copy=='copy'){

            that.prodBatch.btnState = 'post'
            for(let i in that.iqcDefects){
              that.iqcDefects[i].defectRecordId=null
              for(let j in that.iqcDefects[i].extInfoList){
                that.iqcDefects[i].extInfoList[i].iqcDefectrecordExtInfoId=null
              }
            }
          }
          let iqcParams = []
          // console.log(that.iqcParams,"iqcParams");
          
          for(let i in that.iqcParams){
            let values = this.paramValuearray[i]
            let item = {
              // paramInfo:that.iqcParams[i],
              // paramId:that.iqcParams[i].prodChkParamId||'',
              chkDevId:that.iqcParams[i].chkDevId||'',
              chkDevName:that.iqcParams[i].chkDevName || '',
              paramValueArray:values||[],
              inspectionTypeId:that.iqcParams[i].inspectionTypeId|| '',
              measUnitId:that.iqcParams[i].measUnitId||'',
              usl:that.iqcParams[i].usl||'',
              sl:that.iqcParams[i].sl||'',
              lsl:that.iqcParams[i].lsl||'',
              wll:that.iqcParams[i].wll||'',
              wul:that.iqcParams[i].wul||'',
              scale:that.iqcParams[i].scale||'',
              currentAndParentName:that.iqcParams[i].currentAndParentName||'',
              positiveTolerance:that.iqcParams[i].positiveTolerance||'',
              negativeTolerance:that.iqcParams[i].negativeTolerance||''
            }
            iqcParams.push(item)
          }
          let parmas = {
            defectRecordList: that.iqcDefects,
            iqcItem: that.ruleForm,
            paramRecordList: iqcParams,
            iqcPropertyRecordList:that.iqcPropertyRecordList,
          }
          // console.log(that.iqcParamss,'that.iqcPropertyRecordList');
          // return false;
          /* for(let i = 0; i <parmas.paramRecordList.length; i++){
            let values = this.paramValuearray[i]
            parmas.paramRecordList[i].paramValueArray = values || []
            parmas.paramRecordList[i].paramId = parmas.paramRecordList[i].prodChkParamId
          } */
          console.log(parmas,"thatparmas");
          if(val==2) {
            parmas.iqcItem.processExamplesId=that.processExamplesId
          }
          if (that.prodBatch.btnState == 'put') {
            //console.log('')
            that.$http.put(url, parmas, that.headers).then((res) => {
              that.$Message.success(i18n.t('iqc.editSuccess'));
              that.closePage();
              that.$emit("open-tab","exam-iqc-update-"+that.prodBatch.iqcId,i18n.t('iqc.editIqc')+"-"+parmas.iqcItem.productName,"page-exam-iqc-add",{iqcId:that.prodBatch.iqcId});
              for (let i = 0; i < that.iqcDefects.length; i++) {
                if (!that.iqcDefects[i].defectLocId) {
                  that.iqcDefects[i].defectLocId = i18n.t('Unlimited');
                }
                if (!that.iqcDefects[i].chkDevId) {
                  that.iqcDefects[i].chkDevId = i18n.t('Unlimited');
                }
              }
            })
          } else if (that.prodBatch.btnState == 'post') {
            that.$http.post(url, parmas, that.headers).then((res) => {
              that.prodBatch.iqcId = res.data.iqcItem.iqcId
              that.ruleForm.iqcId = res.data.iqcItem.iqcId
              that.$Message.success(i18n.t('iqc.addSuccess'));
              for (let i = 0; i < that.iqcDefects.length; i++) {
                if (!that.iqcDefects[i].defectLocId) {
                  that.iqcDefects[i].defectLocId = i18n.t('Unlimited');
                }
                if (!that.iqcDefects[i].chkDevId) {
                  that.iqcDefects[i].chkDevId = i18n.t('Unlimited');
                }
              }
              that.closePage();
              that.$emit("open-tab","exam-iqc-update-"+that.prodBatch.iqcId,i18n.t('iqc.editIqc')+"-"+parmas.iqcItem.productName,"page-exam-iqc-add",{iqcId:that.prodBatch.iqcId});
            })
          }
        }

      },
      ProcessingPublic() {
        let that = this
        for (let i = 0; i < that.HandleList.length; i++) {
          that.HandleList[i].reviewTime = (new Date(that.HandleList[i].dataTime)).getTime()
        }
      },
      timetrans(date) {
        var date = new Date(date * 1000);//如果date为10位不需要乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m;
      },
      watchState(val,value) {
        // this.resultShow=val
        if(!val) {
          this.resultShow=val
        }else if(!value) {
          this.resultShow=value
        }else {
          this.resultShow=true
        }
      }
    },
    mounted() {

    }
  }
</script>
<style scoped>
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
<style>
.picBtnHide .ivu-upload{
  display: none;
}
.ivu-table .demo-table-info-row td{
        background-color: blue;
        color: #fff;
    }
    .ivu-table .demo-table-error-row td{
        background-color: red;
        color: #fff;
    }
  .noHeight .ivu-table-column-center .ivu-input {
    background: transparent;
    color: inherit;
  }

  .ivu-table-column-center.error {
    background-color: red !important;
  }

  .ivu-table-column-center.error .ivu-input {
    color: #fff;
  }

  .ivu-input.errorParam {
    background: red !important;
    color: #fff;
  }

  .iqcParamTable tbody td:nth-child(n+9) div {
    height: inherit !important;
    width: inherit !important;
    padding: 0 !important;
  }

  .iqcParamTable .ivu-input {
    height: 100%;
  }
</style>
