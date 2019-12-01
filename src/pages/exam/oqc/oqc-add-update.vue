<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t('oqc.basicInfo')}}
      </div>

      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label"><span>{{$t('oqc.orderNo')}}</span></div>
            <div class="iqis-page-block-ctrl">
            <i-input v-model="ruleForm.orderNo" style="width: 100%"  :disabled='dbd12||noPermsDis'></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label"><span>{{$t('oqc.orderNum')}}</span></div>
            <div class="iqis-page-block-ctrl">
              <i-input @on-blur='verification'  v-model="ruleForm.totalQuantity" :disabled='dbd12||noPermsDis' style="width: 100%;"><span style="width:50px" slot="append">{{ruleForm.prodUnitName}}</span></i-input>
              <!-- <InputNumber v-model="ruleForm.totalQuantity" :disabled='dbd12' style="width: 100%; display: block;"></InputNumber> -->
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label"><span>{{$t('oqc.customer')}}</span></div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.customerId" filterable :disabled='dbd12||noPermsDis'>
                <Option v-for="(items,index) in prodBatch.customerList" :value="items.customerId" :key="index">{{ items.customerAbbreviation}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label"><span>{{$t('oqc.customerProdNo')}}</span></div>
            <div class="iqis-page-block-ctrl">
            <i-input v-model="ruleForm.customerProductNo" style="width: 100%"  :disabled='dbd12||noPermsDis'></i-input>
            </div>
          </i-col>
        </Row>
        <Row :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.productNo')}}</div>
            <div class="iqis-page-block-ctrl">
            <Select :label="ruleForm.productNo" remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.productId" :disabled='dbd12||noPermsDis' filterable @on-change="changeProductId(ruleForm.productId,1)">
                <!-- <Option v-for="(items,index) in prodBatch.productON" :value="items.productId" :label="items.no" :key="index">{{ items.no}}/{{ items.name}}</Option> -->
                <Option v-for="(items,index) in productSimple" :value="items.productId" :label="items.no" :key="index">{{ items.no}}/{{ items.name}}</Option>
            </Select>
            <!-- <i-input  v-if='dbd12' v-model="ruleForm.productNo" :disabled='dbd12||noPermsDis' style="width: 100%;"></i-input> -->

            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.productName')}}</div>
            <div class="iqis-page-block-ctrl">
            <!-- <Select v-if='!dbd12' v-model="ruleForm.productId"  :disabled="prodBatch.disabled||noPermsDis">
                <Option v-for="(items,index) in prodBatch.productNames" :value="items.productId" :label="items.name" :key="index">{{ items.name}}</Option>
            </Select>
            <i-input  v-if='dbd12' v-model="ruleForm.productName" :disabled='prodBatch.disabled||noPermsDis' style="width: 100%;"></i-input> -->
            <i-input  v-model="ruleForm.productName" disabled style="width: 100%;"></i-input>

            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.productSpec')}}</div>
            <div class="iqis-page-block-ctrl">
            <!-- <Select v-if='!dbd12' v-model="ruleForm.productId"  :disabled="prodBatch.disabled||noPermsDis">
                <Option v-for="(items,index) in prodBatch.productSpec" :value="items.productId" :label="items.spec" :key="index">{{ items.spec}}</Option>
            </Select>
            <i-input  v-if='dbd12' v-model="ruleForm.productSpec" :disabled='prodBatch.disabled||noPermsDis' style="width: 100%;"></i-input> -->
            <i-input  v-model="ruleForm.productSpec" disabled style="width: 100%;"></i-input>


            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.prodType')}}</div>
            <div class="iqis-page-block-ctrl">
            <!-- <Select v-if='!dbd12' v-model="ruleForm.prodTypeId"  :disabled="prodBatch.disabled||noPermsDis" >
                <Option v-for="(items,index) in prodBatch.prodTypeName" :value="items.prodTypeId"  :key="index">{{ items.name}}</Option>
            </Select>
            <i-input  v-if='dbd12' v-model="ruleForm.prodTypeName" :disabled='prodBatch.disabled||noPermsDis' style="width: 100%;"></i-input> -->
            <i-input  v-model="ruleForm.prodTypeName" disabled style="width: 100%;"></i-input>
            

            </div>
          </i-col>
        </Row>
        <Row :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.quantity')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  @on-blur="getAql()" v-model="ruleForm.oqcQuantity" :disabled='dbd12||noPermsDis' style="width: 100%;">
                <span slot="append" >{{ruleForm.prodUnitName}}</span>
              </i-input>
            </div>
            
          </i-col>
          <i-col span="18">
            
            <div class="iqis-page-block-label">{{$t('oqc.productBatch')}}</div>
            <div class="iqis-page-block-ctrl">
              <!--<i-input  v-model="ruleForm.batch" :disabled='prodBatch.AuditStatus==2?true:false' style="width: 100%;"></i-input>   -->
              <!-- <Select v-model="ruleForm.batchNo" multiple filterable :disabled='dbd12' style="height: 33px !important;width:100%; overflow: auto;">
                <Option v-for="(items,index) in prodBatch.prodbatchList" :value="items.batchNo" :key="index">{{ items.batchNo}}</Option>
              </Select> -->
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.batchNo" multiple filterable :disabled="dbd12||noPermsDis">
                <Option v-for="(items,index) in prodBatch.prodbatchList" :value="items.batchNo" :key="index" >{{ items.batchNo}}</Option>
              </Select>
            </div>
            
          </i-col>
        </Row>
        
        <Row :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.oqcNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  v-model="ruleForm.oqcNo" :disabled='dbd12||noPermsDis' style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.time')}}</div>
            <div class="iqis-page-block-ctrl">
              <Date-picker type="datetime" :options="options" format="yyyy-MM-dd HH:mm" v-model="ruleForm.DataTime" :disabled='dbd12||noPermsDis' style="width: 100%"></Date-picker>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.inspector')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" ref="disabledprice" v-model="ruleForm.inspectorId" :disabled='dbd12||noPermsDis' filterable>
                <Option v-for="item in prodBatch.spectorNameData" :value="item.inspectorId" :key="item.inspectorId">{{ item.inspectorName }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            
            <div class="iqis-page-block-label">{{$t('oqc.workTime')}}</div>
            <div class="iqis-page-block-ctrl">
            <Select :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.chkShiftId" :disabled='dbd12||noPermsDis' filterable>
                <Option v-for="item in prodBatch.chkshiftData" :value="item.chkShiftId" :key="item.chkShiftId">{{ item.name }}</Option>
              </Select>
            </div>
            
          </i-col>
        </Row>
        
        <Row type="flex" :gutter="24">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.qcExplain')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="ruleForm.qcExplain" :disabled='dbd12||noPermsDis' style="width: 100%;"></i-input>
              </div>
            </i-col>
          </Row>
          <Row type="flex" :gutter="24">
          <i-col span="24">
           <div class="iqis-page-block-title">{{$t('oqc.productAccessories')}}</div>
           <dragImageView :productId="ruleForm.productId"></dragImageView>
          </i-col>
        </Row>
        <div style="margin-top:20px;background-color: #fafafa;padding: 24px 24px 4px 24px;" v-show="samplingPlanType==0">
          <table class="tt-tip-table" style="width: 100%;">
            <tr>
              <td style="width: 40%;">
                <div class="tt-tip-row">
                  <span class="tt-tip-label">{{$t('oqc.samplingPlan')}}：</span>
                  <span v-if="fromProduct.qcType=='105E'">{{$t('oqc.105E')}}</span>
                  <span v-if="fromProduct.qcType=='Z1-4'">{{$t('oqc.Z1-4')}}</span>
                  <span v-if="fromProduct.qcType=='0D'">{{$t('oqc.0D')}}</span>
                  <span v-if="fromProduct.qcType=='GB/T2828.1-2012'">{{$t('oqc.GB')}}</span>
                  <span v-if="fromProduct.qcType=='full'">{{$t('product.fullSampling')}}</span>
                  <span v-if="fromProduct.qcType=='percent'">{{$t('product.percentSampling')}}</span>
                </div>
                <div class="tt-tip-row"><span class="tt-tip-label">{{$t('oqc.inspectionStandard')}}：</span>
                  <span v-if="fromProduct.qcType=='0D'&&fromIqc.inspectionStandard==1">{{$t('oqc.0DInspection')}}</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==1">{{$t('oqc.normalInspection')}}Ⅰ</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==2">{{$t('oqc.normalInspection')}}Ⅱ</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==3">{{$t('oqc.normalInspection')}}Ⅲ</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==101">{{$t('oqc.specialInspection')}} S1</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==102">{{$t('oqc.specialInspection')}} S2</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==103">{{$t('oqc.specialInspection')}} S3</span>
                  <span v-else-if="fromProduct.qcType!='percent'&&fromIqc.inspectionStandard==104">{{$t('oqc.specialInspection')}} S4</span>
                  <span v-else-if="!fromIqc.inspectionStandard">-</span>
                  <span v-else>{{fromIqc.inspectionStandard}}%</span>
                </div>
                <div class="tt-tip-row"><span class="tt-tip-label">{{$t('oqc.kyRule')}}：</span>
                  <span v-if="fromProduct.lenientTransfer=='NORMAL'">{{$t('oqc.normal')}}</span>
                  <span v-else-if="fromProduct.lenientTransfer=='SOFTEN'">{{$t('oqc.relax')}}</span>
                  <span v-else-if="fromProduct.lenientTransfer=='STRICTER'">{{$t('oqc.strict')}}</span>
                  <span v-else>-</span>
                </div>
                <div class="tt-tip-row"><span class="tt-tip-label">{{$t('oqc.sampleQua')}}：</span>{{forCrTable.sampleNum}}</div>
              </td>
              <td style="width: 40%;">
                <div class="tt-tip-row">
                  <span class="tt-tip-text"></span><span class="tt-tip-text">AQL</span>
                  <span class="tt-tip-text">AC</span><span class="tt-tip-text">RE</span>
                </div>
                <div class="tt-tip-row">
                  <span class="tt-tip-text">{{$t('oqc.crAql')}}</span><span class="tt-tip-text">{{fromIqc.crAql}}</span>
                  <span class="tt-tip-text">{{forCrTable.samplingPlanAc}}</span><span
                  class="tt-tip-text">{{forCrTable.samplingPlanRe}}</span>
                </div>
                <div class="tt-tip-row">
                  <span class="tt-tip-text">{{$t('oqc.majAql')}}</span><span class="tt-tip-text">{{fromIqc.majAql}}</span>
                  <span class="tt-tip-text">{{forMaTable.samplingPlanAc}}</span><span
                  class="tt-tip-text">{{forMaTable.samplingPlanRe}}</span>
                </div>
                <div class="tt-tip-row">
                  <span class="tt-tip-text">{{$t('oqc.minAql')}}</span><span class="tt-tip-text">{{fromIqc.minAql}}</span>
                  <span class="tt-tip-text">{{forMinTable.samplingPlanAc}}</span><span
                  class="tt-tip-text">{{forMinTable.samplingPlanRe}}</span>
                </div>
              </td>
              <td style="width: 20%;">
                <div>
                  &nbsp;
                </div>
                <div class="tt-tip-card" v-if="fromProduct.extStatus != ''">
                  <div style="margin-bottom: 20px;">{{$t('oqc.tips')}}:</div>
                  <span v-if="fromProduct.extStatus==='exempted'" style="color: #418FEE;"><Icon
                    type="ios-checkmark-outline"></Icon>{{$t('oqc.exempted')}}</span>
                  <span v-if="fromProduct.extStatus==='pending'" style="color: red;"><Icon
                    type="ios-checkmark-outline"></Icon>{{$t('oqc.pending')}}</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <Row style="margin-top:20px;background-color: #fafafa;padding: 24px 24px 4px 24px;" v-show="samplingPlanType==1">
          <i-col span="8" class="tt-tip-row"><span class="tt-tip-label">{{$t('oqc.kyRule')}}：</span>
            <span v-if="fromProduct.lenientTransfer=='NORMAL'">{{$t('oqc.normal')}}</span>
            <span v-else-if="fromProduct.lenientTransfer=='SOFTEN'">{{$t('oqc.relax')}}</span>
            <span v-else-if="fromProduct.lenientTransfer=='STRICTER'">{{$t('oqc.strict')}}</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="8">
            <div class="tt-tip-card" v-if="fromProduct.extStatus != ''">
              <span class="tt-tip-label" style="margin-bottom: 20px;">{{$t('oqc.tips')}}:</span>
              <span v-if="fromProduct.extStatus==='exempted'" style="color: #418FEE;"><Icon
                type="ios-checkmark-outline"></Icon>{{$t('oqc.exempted')}}</span>
              <span v-if="fromProduct.extStatus==='pending'" style="color: red;"><Icon
                type="ios-checkmark-outline"></Icon>{{$t('oqc.pending')}}</span>
            </div>
          </i-col>
        </Row>
      </div>

    </div>

    <!-- 参数记录 -->
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t('oqc.paramsRecord')}}
      </div>
      <div class="iqis-page-block-body">
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label">{{$t('oqc.paramsTable')}}</div>
          </div>
          <div class="iqis-page-block-tools-second" style="margin-top: 6px;">

          </div>
        </div>
        <div class="iqis-page-block-table">
          <!-- <Table  :no-data-text="i18n.t('noData')" ref="paramTable" id="styleTable" class="iqis-inline-editor-table noHeight oqcParamTable" -->
          <Table  :no-data-text="i18n.t('noData')" class="noBorder" ref="paramTable" id="styleTable" @on-row-click="paramslist"
                 @on-selection-change="paramTableSelectChange" border stripe v-drag-table-column="table.param.columns"
                 :loading="table.param.loading" :columns="table.param.columns" :data="oqcParams">
          </Table>
        </div>
      </div>
      <!-- 属性记录表 -->
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        <!-- {{$t('iqc.paramsRecord')}} -->
        {{$t('oqc.attributeRecord')}}
      </div>
      <div class="iqis-page-block-body">
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label"><!-- {{$t('iqc.paramsTable')}} -->{{$t('oqc.recordSheet')}}</div>
          </div>
          <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
          </div>
        </div>
        <div class="iqis-page-block-table">
          <!-- <Table  :no-data-text="i18n.t('noData')" ref="paramTable" class="iqis-inline-editor-table noHeight noBorder iqcParamTable" -->
          <!-- <Table  :no-data-text="i18n.t('noData')" class="height24" ref="paramTable" @on-row-click="paramslist" @on-selection-change="paramTableSelectChange" border stripe
                 :loading="table.param.loading" v-drag-table-column="table.param.columns" :columns="table.param.columns"
                 :data="oqcParams">
          </Table> -->
                                                          <!-- iqcAttribute -->
          <Table :columns="table.param.attribute " v-drag-table-column="table.param.attribute" class="noBorder" border stripe :data="oqcParamss"></Table>
        </div>
      </div>
    </div>

      <div class="iqis-page-block">
        <div class="iqis-page-block-title">
          {{$t('oqc.defectRecord')}}
        </div>
        <div class="iqis-page-block-body">
          <div class="iqis-page-block-tools">
            <div class="iqis-page-block-tools-primary">
              <div class="iqis-page-block-label">{{$t('oqc.defectTable')}}</div>
            </div>
            <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
              <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('oqc.changed')}} <span
                style="color:#1b75ea">{{prodBatch.TableLength}}</span> {{$t('oqc.defects')}}</span>
              <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                confirm
                :title="i18n.t('oqc.confirmDelete')"
                placement="bottom-end"
                @on-ok="deleteTableSelected">
                <Button type="ghost" icon="trash-a" v-if='!dbd12' :disabled="!prodBatch.selected||noPermsDis">{{$t('oqc.delete')}}</Button>
              </Poptip>
            </div>
          </div>
          <div class="iqis-page-block-table">
            <Table  :no-data-text="i18n.t('noData')" ref="paramTableFects" v-drag-table-column="table.defect.columns" class="noBorder iqis-inline-editor-table noHeight location defectTable"
                   @on-selection-change="defectTableSelectChange" border stripe
                   :loading="table.defect.loading" :columns="table.defect.columns" :data="oqcDefects" :disabled='dbd12'>
              <Button :disabled='dbd12||noPermsDis' @click="addDefect" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus">自动生成缺陷记录</Button>
            </Table>
          </div>

          <Row type="flex" :gutter="24">
            <!-- <i-col span="4" style="width: 20% !important;">
              <div class="iqis-page-block-label">{{$t('oqc.sampleNum')}}</div>
              <div class="iqis-page-block-ctrl"> -->
                <!-- <i-input  v-model="ruleForm.sampleQuantity" :disabled='dbd12' style="width: 100%;" ></i-input> -->
                <!-- <InputNumber :min="0" v-model="ruleForm.sampleQuantity" :disabled='dbd12||noPermsDis' style="width: 100%;"></InputNumber>

              </div>
            </i-col> -->
            <!-- <i-col span="4" style="width: 20% !important;">
              <div class="iqis-page-block-label">{{$t('oqc.badNum')}}</div>
              <div class="iqis-page-block-ctrl">
                <InputNumber @on-change="changeResult(ruleForm.badQuantity)" :min="0" v-model="ruleForm.badQuantity" :disabled='dbd12||noPermsDis' style="width: 100%;" v-on:on-change ="changeResult(ruleForm.badQuantity)"></InputNumber> -->
                <!-- <i-input  :max="ruleForm.sampleQuantity" :min="0" v-model="ruleForm.badQuantity" :disabled='dbd12' style="width: 100%;"></i-input> -->
              <!-- </div>
            </i-col> -->
            <!-- <i-col span="4" style="width: 20% !important;">
              <div class="iqis-page-block-label">{{$t('oqc.badRate')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input v-model="reckonBadRate" disabled style="width: 100%;"></i-input>
              </div>
            </i-col> -->
            <i-col span="4" style="width: 20% !important;">
              <div class="iqis-page-block-label">{{$t('oqc.result')}}</div>
              <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" @on-change='consequence(ruleForm.result);' v-model="ruleForm.result" :disabled='dbd12||noPermsDis' filterable>
                    <Option v-for="item in resultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
              </div>
            </i-col>
            <i-col span="4" style="width: 20% !important;">
            	<div v-if="ruleForm.result==0">
            	<div class="iqis-page-block-label">{{$t('oqc.reviewTeam')}}</div>
              <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.reviewProcessId" :disabled='dbd12||noPermsDis' filterable @on-change="reviewProcessBtn(ruleForm.reviewProcessId)">
                    <!-- 不发起评审流程 -->
                    <!-- <Option :value="null">{{$t('noReview')}}</Option> -->
                    <Option v-for="(item,index) in ProcessIdList" :value="item.reviewProcessId" :key="index">{{ item.name }}</Option>
                  </Select>
                </div>
              </div>
            </i-col>
          </Row>
          <!-- <Row type="flex" :gutter="24">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.qcExplain')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="ruleForm.qcExplain" :disabled='dbd12||noPermsDis' style="width: 100%;"></i-input>
              </div>
            </i-col>
          </Row> -->

        </div>
      </div>
      <div class="iqis-page-block" v-if="(prodBatch.AuditStatus == 1 ||prodBatch.AuditStatus == 2 )&&ruleForm.reviewProcessId != null">
      	<div v-if="prodBatch.reviewProcessIndex !=null&&ruleForm.result==0&&prodBatch.reviewProcessstate==true">
          <div v-show="disposerecordshow" class="iqis-page-block" >
            <div class="iqis-page-block-title">
                          {{$t('oqc.treatmentRecord')}}
            </div>
            <div class="iqis-page-block-body">
              <div v-for="(items,index) in HandleList">
                <div class="review-block" >
                  <Row type="flex" :gutter="24">
                    <i-col span="4" style="width: 20% !important;">
                      <div class="iqis-page-block-label">{{$t('oqc.treatmentMethod')}}</div>
                      <div class="iqis-page-block-ctrl">
                        <Select :placeholder="i18n.t('pleaseChoose')" v-model="items.treatmentType" :disabled="items.disabled||noPermsDis" filterable>
                        <!-- <Select v-model="items.treatmentType" :disabled="((index == (HandleList.length-1)) &&(HandleList[HandleList.length-1].reviewer == currentName)) ? false : items.disabled||noPermsDis" filterable> -->
                          
                          <Option v-for="item in selects.treatmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                      </div>
                    </i-col>
                    <i-col span="4" style="width: 20% !important;">
                      <div>&nbsp;</div>
                    </i-col>
                    <i-col span="4" style="width: 20% !important;">
                      <div>&nbsp;</div>
                    </i-col>
                    <i-col span="4" style="width: 20% !important;">
                      <div class="iqis-page-block-label">{{items.roleName}}</div>
                      <div class="iqis-page-block-ctrl">
                        <i-input   v-model="items.reviewer" :disabled="true" style="width: 100%;"></i-input>
                      </div>
                    </i-col>
                    <i-col span="4" style="width: 20% !important;">
                      <div class="iqis-page-block-label">{{$t('oqc.auditTime')}}</div>
                      <div class="iqis-page-block-ctrl">
                        <DatePicker type="datetime" v-model="items.dataTime" disabled style="width: 100%"></DatePicker>
                      </div>
                    </i-col>
                  </Row>
                  <Row>
                    <i-col span="24">
                      <!-- {{HandleList[HandleList.length-1].reviewer}}{{currentName}} -->
                      <div class="iqis-page-block-label" >{{(index == (HandleList.length-1))?i18n.t('oqc.judgeOpinion'):i18n.t('oqc.reviewOpinion') }}</div>
                      <div class="iqis-page-block-ctrl">
                        <i-input type="textarea" :rows="4" v-model="items.opinion" :disabled="items.disabled||noPermsDis"></i-input>
                        <!-- <i-input type="textarea" :rows="4" v-model="items.opinion" :disabled="((index == (HandleList.length-1)) &&(HandleList[HandleList.length-1].reviewer == currentName)) ? false : items.disabled||noPermsDis"></i-input> -->
                      </div>
                    </i-col>
                  </Row>
                </div>
              </div>
              <Row type="flex" :gutter="24">
                <i-col span="24">
                  <div class="iqis-page-block-label">结案说明</div>
                  <div class="iqis-page-block-ctrl">
                    <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="ruleForm.caseExplain" :disabled='this.reviewState!=3||this.ruleForm.inspectorId!=this.prodBatch.CurrentOperatorId||this.noPermsDis' style="width: 100%;"></i-input>
                  </div>
                </i-col>
              </Row>
            </div>
          </div>
      	</div>
      </div>
      <div v-if="reviewState==4" style="text-align:center;color:#999;font-size:16px;font-weight: bold;">{{$t('oqc.completed')}}</div>
    </div>
    <Process v-if="AuditStatus!=0&&AuditStatus!=3" :state="AuditStatus" :processUrl="'/examinecenter/oqc/reviewrecord'" qcType="oqc" :qcId="oqcId" :authorized="!noPermsDis" :inspectorId="ruleForm.inspectorId" :qcNo="ruleForm.oqcNo" :createTime="ruleForm.DataTime" :productNo="ruleForm.productNo" :productName="ruleForm.productName"></Process>

    <IqisAffix placement="bottom" :offset="0" v-if="AuditStatus==0||AuditStatus==3">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <!-- 提交评审流程 -->
        <Button type="primary" v-if="reviewState==3&&prodBatch.CurrentOperatorId==ruleForm.inspectorId" @click="endCase">{{$t('oqc.end')}}</Button>
      	<Button type="primary" @click="submData" v-if="submDataButton&&permsBtn.UPDATE_OQC">{{$t('oqc.commit')}}</Button><!--评审-->
        <!--  -->
      	<Button type="primary" @click="submitBtn" v-if="submitButton&&permsBtn.UPDATE_OQC">{{$t('oqc.commit')}}</Button><!--提交基础-->
        <Button type="primary" @click="save" :loading="loadStat.saveLoading" v-if="saveButtonShow&&!noPermsDis">{{$t('oqc.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('oqc.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!--end blocks-->
    <div class="page-end" style="padding-bottom: 40px;padding-top: 30px;"></div>
    <Spin size="large" fix v-if="loadStat.oqcDataLoading || loadStat.selectsDataLoading"></Spin>

  </div>
</template>
<script>
  import ICol from "iview/src/components/grid/col";
  import $ from 'jquery';
  import NestedTables from '../../../components/nestedTables/NestedTabels.vue'
  import dragImageView from '../../../components/imageview/dragImageView.vue'
  export default {
    components: {ICol,NestedTables,dragImageView},
    props: ["params", "tabKey"],
    data() {
      let vm = this;
      return {
        mark:false,
        ext:[],
        tag:'oqc',
        aa:0,
        paramsIndex:0,
        i18n:window.i18n,
        sampleNum:0,
        paramValue:'',
        productProperty:'',
        productPropertyCache:'',
        paramValuearray:[],
        paramsList:null,
        currentName:null,
        productDetail:[],
        productSimple:[],
        oqcId:'',
        productId: '',
        oqcParamsNew: [],
        submitButton: true,
        saveButtonShow: true,
        dbd12: false,
        dbd03: false,
        submDataButton: false,
        disposerecordshow: true, //处理记录 显示或隐藏
        options: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now();
          }
        },
        headers: {
          headers: {"Content-Type": "application/json; charset=UTF-8"}
        },
        loadStat: {
          saveLoading: false,
          oqcDataLoading: false,
          selectsDataLoading: false
        },
        selects: {
          products: [],
          manufacturerList: [],
          inspectorList: [],
          inspectionTypes: [],
          defectTypeList: [],
          userList: [],
          treatmentList: [
            // {value:"",label:""},
            {value: "JUDGE", label: i18n.t('oqc.judged')},
            {value: "REJECT", label: i18n.t('oqc.return')},
            {value: "REWORK", label: i18n.t('oqc.rework')},
            {value: "SCREEN", label: i18n.t('oqc.filter')},
            {value: "SPECIAL_ADOPTION", label: i18n.t('oqc.special')},
            {value: "EMERGENCY_RELEASE", label: i18n.t('oqc.release')},
            {value: "SCRAP", label: i18n.t('oqc.scrap')}
          ]
        },
        sampling: {
          crAql: "4.00",
          crAC: "14",
          crRE: "15",
          majAql: "0.40",
          majAC: "2",
          majRE: "3",
          minAql: "0.03",
          minAC: "0",
          minRE: "1",
          plan: i18n.t('oqc.105E'),
          level: i18n.t('oqc.normalInspection')+"II",
          rule: i18n.t('oqc.relax'),
          samplingCount: "10000",
          extStatus: "", //附加状态，停产：pending，免检：exempted ,
          lenientTransfer: "", //宽严程度：NORMAL 正常，SOFTEN 放宽，STRICTER 加严 ,
          lenientTransferName: "" //宽严程度：NORMAL 正常，SOFTEN 放宽，STRICTER 加严 ,
        },
        oqcParams: [],
        oqcParamsRefresh:[],
        oqcParamss: [],
        "oqcPropertyRecordList": [],
        oqcDefects: [],
        oqc: {
          auditorId: "",
          badQuantity: "",
          badRate: "",
          batch: "",
          createTime: "",
          inspectionStandard: "",
          inspectorId: "",
          oqcId: "",
          oqcNo: "",
          manufacturerId: "",
          productId: 0,
          productInfo: {
            examType: "",
            name: "",
            no: "",
            prodTypeId: "",
            prodTypeName: "",
            prodUnitId: "",
            prodUnitName: "",
            productId: "",
            remark: "",
            spec: "",
            updateTime: "",
            updater: "",
            useState: "",
            version: ""
          },
          reportNo: "",
          result: "",
          reviewProcessId: "",
          sampleQuantity: 0,
          samplingPlan: "",
          state: "",
          strictStandard: "",
          totalQuantity: ""
        },
        reviews: {
          auditor: {
            disabled: true,
            oqcId: "",
            opinion: "",
            reviewRecordId: "",
            reviewTime: "",
            reviewerId: "",
            reviewerName: "",
            role: "auditor",
            treatmentType: ""
          },
          judge: {
            disabled: true,
            oqcId: "",
            opinion: "",
            reviewRecordId: "",
            reviewTime: "",
            reviewerId: "",
            reviewerName: "",
            role: "auditor",
            treatmentType: ""
          },
          reviewer1: {
            disabled: true,
            oqcId: "",
            opinion: "",
            reviewRecordId: "",
            reviewTime: "",
            reviewerId: "",
            reviewerName: "",
            role: "auditor",
            treatmentType: ""
          },
          reviewer2: {
            disabled: true,
            oqcId: "",
            opinion: "",
            reviewRecordId: "",
            reviewTime: "",
            reviewerId: "",
            reviewerName: "",
            role: "auditor",
            treatmentType: ""
          },
          reviewer3: {
            disabled: true,
            oqcId: "",
            opinion: "",
            reviewRecordId: "",
            reviewTime: "",
            reviewerId: "",
            reviewerName: "",
            role: "auditor",
            treatmentType: ""
          },
          reviewer4: {
            disabled: true,
            oqcId: "",
            opinion: "",
            reviewRecordId: "",
            reviewTime: "",
            reviewerId: "",
            reviewerName: "",
            role: "auditor",
            treatmentType: ""
          }
        },
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
                key:'currentAndParentName',
                /* render: (h, params) => {
                  let _this = this;
                  let texts = '';
                  texts = params.row.inspectionTypeName
                  return h('div', {
                    props: {},
                  }, texts)
                } */
              },
              {
                title:i18n.t('oqc._inspectionStandard'),
                width:500,
                align:"center",
                key:'inspectionLevel'
              },
              {
                title:i18n.t('oqc.result'),
                width:100,
                aligh:"center",
                key:'result',
                render:(h,params) => {
                  return h('Select',{
                    props:{value:this.oqcPropertyRecordList[params.index].result || 0, disabled:this.dbd12||this.noPermsDis},
                     on:{
                      "on-change":(event) => {
                        console.log(event);
                        this.oqcPropertyRecordList[params.index].result = event
                        console.log(this.oqcPropertyRecordList);
                        
                      }
                    },
                  },
                  [
                    h('Option',{
                      props:{value:0,}
                    },'OK'),
                    h('Option',{
                      props:{value:1}
                    },"NG")
                  ])
                }
              },
              {
              title:i18n.t('oqc.inspectionInstruction'),
              minWidth:200,
              align:'center',
              key:'inspectionExplain',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'textarea',
                      // disabled:me.noPermsDis,
                      size:"small",
                      disabled:this.dbd12||this.noPermsDis,
                      autosize:{
                        minRows:1,
                        maxRows:4
                      },
                      maxlength:600,
                      value:this.oqcPropertyRecordList[params.index].inspectionExplain
                      // value:me.product.settings.qc.iqc.paramss[params.index].inspectionLevel
                    },
                    on:{
                      "on-blur":function(event){
                        // me.iqcPropertyRecordList[params.index].inspectionExplain = event.target.value
                        me.oqcPropertyRecordList[params.index].inspectionExplain = event.target.value
                        console.log(params,666);
                        
                      }
                    }
                  })
                ])
              }
            },
            ],
            columns: [
              // {
              //   type: "selection",
              //   align: 'center',
              //   minWidth: 40,
              //   maxWidth: 40
              // },
              {
                title: i18n.t('oqc.no'),
                align: 'center',
                maxWidth: 60,
                minWidth:this.$store.state.locale=='zh_CN'?103:120,
                render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm)
                // align:"center",
                // minWidth:80,
                // maxWidth:80
              },
              {
                title: i18n.t('oqc.project'),
                width: this.$store.state.locale=='zh_CN'?160:120,
                minWidth: this.$store.state.locale=='zh_CN'?160:120,
                align: 'center',
                ellipsis: true,
                key: "currentAndParentName",
                render: (h, params) => {
                  let _this = this;
                  let texts = "";
                  texts = params.row.currentAndParentName;
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
                title: i18n.t('oqc.chkDev'),
                align: "center",
                width:180,
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
                // render: (h, params) => {
                //   let _this = this;
                //   return h('Select', {
                //       props:{
                //           value: this.oqcParams[params.index].chkDevId,
                //           disabled:this.inputDisbale||this.noPermsDis,
                //           placeholder:i18n.t('Unlimited')
                //       },
                //       on: {
                //           'on-change':(event) => {
                //               this.oqcParams[params.index].chkDevId = event;
                //           }
                //       },
                //     },
                //     params.row.chkDevList.map(function(type){// chdDevTypeList原带出检验设备列表
                //       return h('Option', {
                //             props: {value:type.chkDevId,label:type.name}
                //       }, type);
                //     })
                //   );
                // }
              },
              {
                title: i18n.t('oqc.measUnit'),
                minWidth: this.$store.state.locale=='zh_CN'?54:100,
                align: 'center',
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
                title: "USL",
                minWidth: 55,
                align: 'center',
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
                minWidth: 55,
                align: 'center',
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
                minWidth: 55,
                align: 'center',
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
                // title: i18n.t("pqc.sn"),
                title:i18n.t('oqc.sampleQua'),
                align: "center",
                minWidth:this.$store.state.locale=='zh_CN'?60:80,
                ellipsis: true,
                key: "num",
                render:(h,params)=>{
                  if(params.row.num==null){
                    return h('div','--')
                  }else{
                    return h('div',params.row.num)
                  }
                }
              },
              {
                title: "AC",
                // width: 50,
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
                // width: 50,
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
              {
                title:i18n.t('oqc.record'),
                align:"center",
                // ellipsis:true,
                // key: 'paramId',
                minWidth:700,
                render:(h,params) => {
                  
                  return h(NestedTables,{
                    props:{
                      scale:params.row.scale,
                      index:'oqctab'+params.index,
                      paramsindex:this.paramsIndex,
                      aa:this.aa,
                      tag:this.tag,
                      expand:this.oqcParams[params.index].expand,
                      sampleNum:params.row.num || 10,
                      // paramsInfo:this.oqcParams[params.index],
                      paramsInfo:params.row,
                      paramValuearray:this.paramValuearray[params.index],
                      isdisabled:this.dbd12||this.noPermsDis
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
                title:i18n.t('oqc.action'),
                minWidth: 70,
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
                          marginRight: '-5px',
                          display:(params.row.num<=10)?"none":"inline-block",
                        },
                        on: {
                            click: (event) => {
                              this.oqcParams[params.index].expand = !this.oqcParams[params.index].expand
                            }
                        }
                    }, this.oqcParams[params.index].expand? i18n.t('oqc.close') : i18n.t('oqc.open')),
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
                type: "selection",
                align: 'center',
                minWidth: 40,
                maxWidth: 40
              },
              {
                title: i18n.t('oqc.no'),
                minWidth: 80,
                maxWidth: 80,
                align: "center",
                render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm)
              },
              {
                title: i18n.t('oqc.project'),
                width: this.$store.state.locale=='zh_CN'?160:120,
                align: 'center',
                ellipsis: true,
                minWidth: this.$store.state.locale=='zh_CN'?160:120,
                key: 'inspectionTypeName',
                // render: vm.$iqis.utils.tableHelper.editable.buildCascaderCell4(vm, (vm) => {
                //   return vm.selects.inspectionTypes
                // }, "inspectionTypeId", "name", null, this.getDefectNameList, 'dbd12'),
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
                //     this.dbd12||this.noPermsDis,
                //   )
                //   return ret(h,params);
                // }
              },
              {
                title: i18n.t('oqc.defectName'),
                width: 180,
                minWidth: 180,
                align: 'center',
                ellipsis: true,
                //required:true,
                // key: 'defectName',
                // render: (h, params) => {
                // 	let _this = this;
                //   return h('Select', {
                //       props:{
                //           filterable:true,
                //           value: this.iqcDefects[params.index].defectTypeId,
                //           disabled:this.inputDisbale,
                //       },
                //       style:{
                //         border:'0px'
                //       },
                //       on: {
                //           'on-change':(event) => {
                //               this.iqcDefects[params.index].defectTypeId = event;

                //               this.TesySynthesis(this.iqcDefects[params.index].defectTypeId,params.index)
                //           }
                //       },
                //   },
                //       this.prodBatch.DefectName.map(function(type){
                //           return h('Option', {
                //               props: {value: type.defectTypeId,label:type.name}
                //           }, type);
                //       })
                //   );
                // }
                key: "defectTypeId",
                render: (h, params) => {
                  // console.log(this.oqcDefects[params.index].defectTypeList,888999)
                  let _this = this;
                  return h(
                    "Select",
                    {
                      props: {
                        value: this.oqcDefects[params.index].defectTypeId,
                        disabled:this.dbd12||this.noPermsDis,
                      },
                      on: {
                        "on-change": event => {
                          this.oqcDefects[params.index].defectTypeId = event;
                          // this.TesySynthesis(
                          //   this.oqcDefects[params.index].defectTypeId,
                          //   params.index
                          // );
                        }
                      }
                    },
                    this.prodBatch.DefectName.map(function (type) {
                      return h(
                        "Option",
                        {
                          props: {value: type.defectTypeId, label: type.name}
                        },
                        type
                      );
                    })
                  );
                }
              },
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
                        disabled:this.dbd12||this.noPermsDis,
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
                          this.oqcDefects[params.index].describe = event.target.value
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
            //   {
            //     title: i18n.t('oqc.sampleQuantity'),
            //     width: this.$store.state.locale=='zh_CN'?100:120,
            //     align: 'center',
            //     minWidth: this.$store.state.locale=='zh_CN'?100:120,
            //     ellipsis: true,
            //     key: "sampleQuantity",
            //     render: (h, params) => {
            //       var me = this;
            //       return h("div", [
            //         h("Input", {
            //           props: {
            //             type: "text",
            //             value: me.oqcDefects[params.index].sampleQuantity,
            //             disabled:
            //             this.dbd12||this.noPermsDis,
            //           },
            //           on: {
            //             "on-change":(event) => {
            //               params.row.sampleQuantity = event.target.value;
            //               this.oqcDefects[params.index] =params.row;
            //               if(params.row.defectCount){
            //               this.oqcDefects[params.index].defectRate = ((params.row.defectCount / params.row.sampleQuantity) * 100).toFixed(2)
            //             }
            //             },
            //             // "on-blur": event => {
            //             //   this.oqcDefects[params.index].sampleQuantity =event.target.value;
            //             // }
            //           }
            //         })
            //       ]);
            //     }
            //   },
            //   {
            //     title: i18n.t('oqc.defectNum'),
            //     width: this.$store.state.locale=='zh_CN'?100:120,
            //     align: 'center',
            //     minWidth: this.$store.state.locale=='zh_CN'?100:120,
            //     ellipsis: true,
            //     key: "defectCount",
            //     render: (h, params) => {
            //       var me = this;
            //       return h("div", [
            //         h("Input", {
            //           props: {
            //             type: "text",
            //             value: me.oqcDefects[params.index].defectCount,
            //             disabled:
            //             this.dbd12||this.noPermsDis,
            //           },
            //           on: {
            //             "on-change":event => {
            //               params.row.defectCount = event.target.value;
            //               this.oqcDefects[params.index] = params.row;
            //               if(params.row.sampleQuantity){
            //                 this.oqcDefects[params.index].defectRate = ((params.row.defectCount / params.row.sampleQuantity) * 100).toFixed(2)
            //               }
            //               this.ruleForm.badQuantity = 0;
            //               for (let i in this.oqcDefects) {
            //                 this.ruleForm.badQuantity += Number(this.oqcDefects[i].defectCount);
            //               }
            //               this.changeResult(this.ruleForm.badQuantity)
            //             },
            //             // "on-blur": event => {
            //             //   this.oqcDefects[params.index].defectCount = event.target.value;
            //             //   this.ruleForm.badQuantity = 0;
            //             //   for (let i in this.oqcDefects) {
            //             //     this.ruleForm.badQuantity += Number(this.oqcDefects[i].defectCount);
            //             //   }
            //             //   this.changeResult(this.ruleForm.badQuantity)

            //             // }
            //           }
            //         })
            //       ]);
            //     }
            //   },
            //   {
            //     title: "缺陷率%",
            //     minWidth: 120,
            //     align: 'center',
            //     ellipsis: true,
            //     key: 'defectRate',  
            //   },
            //   {
            //   title: i18n.t('oqc.remarks'),
            //   key:"remark",
            //   minWidth: 200,
            //   width:200,
            //   render: (h, params) => {
            //     return h("div", [
            //       h("Input", {
            //         props: {
            //           type: "textarea",
            //           value:params.row.remark,
            //           autosize:{
            //               // minRows:1,
            //               maxRows:4
            //           },
            //           rows:4,
            //           maxlength:600,
            //         },
            //         on: {
            //           "on-blur": event => {
            //             params.row.remark = event.target.value
            //             this.oqcDefects[params.index] = params.row
            //           }
            //         }
            //       })
            //     ]);
            //   }
            // }, 
              // {
              //   title: i18n.t('oqc.pic'),
              //   align: 'center',
              //   key: 'extInfoList',
              //   minWidth: 250,
              //   render: function (h, data) {
              //     try {
              //       vm.oqcDefects[data.index].extInfoList.length
              //     } catch (err) {
              //       vm.oqcDefects[data.index].extInfoList = []
              //     }

              //     return h("IqisUpload", {
              //       props: {//:size="54" :edit="switchs.fileEdit" v-model="product.settings.ext"
              //         "value": data.row[data.column.key],
              //         "size": 32,
              //         "row-index": data.index,
              //         "row": data.row,
              //         // "edit": vm.prodBatch.AuditStatus == 1 || vm.prodBatch.AuditStatus == 2 ? false : true,
              //         "edit":vm.picBtnShow,
              //         "maxSize": 10240,
              //         "fileType": ['jpg', 'jpeg', 'png'],
              //         "fileCount": 5,
              //         'chartTypeShow': "true",
              //         //disabled:this.other.basicD1D2Show,
              //       },
              //       on: {
              //         input: (val) => {
              //           var obj = {
              //             'defectrecordExtInfoName': val[0].name,
              //             'defectrecordExtInfoType': val[0].mime,
              //             'url': val[0].url
              //           };
              //           vm.oqcDefects[data.index].extInfoList.push(obj);

              //           //vm.cellDefectEditorEnd(val, data.column.key, data.index)
              //         },
              //         del: (val) => {
              //           vm.oqcDefects[data.index].extInfoList.splice(val, 1);
              //           //vm.cellDefectEditorEnd(val, data.column.key, data.index)
              //         }
              //       }
              //     })
              //   }
              // }
              {
                title: i18n.t('iqc.sampleQuantity'),//实抽样数
                minWidth: this.$store.state.locale=='zh_CN'?54:120,
                align: 'center',
                ellipsis: true,
                key: 'sampleQuantity',
                render: (h, params) => {
                  return h("div", [
                    h("Input", {
                      props: {
                        type: "input",
                        disabled:this.dbd12||this.noPermsDis,
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
                          this.oqcDefects[params.index].sampleQuantity = event.target.value
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
                align: 'center',
                ellipsis: true,
                key: 'defectCount',
                render: (h, params) => {
                  return h("div", [
                    h("Input", {
                      props: {
                        type: "input",
                        disabled:this.dbd12||this.noPermsDis,
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
                          this.oqcDefects[params.index].defectCount = event.target.value
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
                align: 'center',
                ellipsis: true,
                key: 'defectRate', 
                 render: (h, params) => {
                  return h("div", [
                    h("Input", {
                      props: {
                        type: "input",
                        disabled:this.dbd12||this.noPermsDis,
                        value:params.row.defectRate,
                        autosize:{
                            // minRows:1,
                            maxRows:4
                        },
                        rows:4,
                        maxlength:600,
                      },
                      on: {
                        "on-blur": event => {
                          this.oqcDefects[params.index].defectRate = event.target.value
                          // this.iqcDefects[params.index] =params.row;
                        }
                      }
                    })
                  ]);
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
                        disabled:this.dbd12||this.noPermsDis,
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
                          this.oqcDefects[params.index].remark = event.target.value
                          // this.iqcDefects[params.index] =params.row;
                        }
                      }
                    })
                  ]);
                }
              },
            ]
          }
        },

        discountData: {
          rows: [{}],
          tableData: {
            defectRecordId: "",
            oqcId: "",
            defectTypeId: "",
            chkDevId: "",
            defectTypeName: "",
            inspectionTypeName: "",
            qltyLvName: "",
            chkDevName: "",
            defectLocId: "",
            chkDevType: "",
            defectRate:'',
            defectCount: "",
            sampleQuantity: "",
            extInfoList: [],
            chdDevTypeList: []
          }
        },
        //自定义参数
        prodBatch: {
          oqcList: [],
          indeV: 0,
          dataVB: [],
          oqcId: "",
          ParameterDeta: false,
          selected: false,
          disabled: true,
          turrn: false,
          ShowState: false,
          TableLength: 0,
          reviewProcessShow: false,
          defectNumber: 0,
          AuditStatus: "0",
          productON: [],
          productNames: [],
          productSpec: [],
          prodTypeName: [],
          spectorNameData: [],
          chkshiftData: [],
          DefectName: [],
          DefectGrade: [],
          DefectPosition: [],
          chkValMapData: [],
          dataTableAll: [],
          btnState: "",
          ProcessingData: [],
          reviewProcessIndex: null,
          reviewProcessstate: false,
          inspectorName: "",
          Success: false,
          customerList: [],
          prodbatchList: [],
          CurrentOperatorName: "",
          CurrentOperatorId: ""
        },
        resultList: [
          {
            value: 0,
            label: i18n.t('oqc.unqualified')
          },
          {
            value: 1,
            label: i18n.t('oqc.qualified')
          }
        ],
        ProcessIdList: [],
        ruleForm: {
          caseExplain:"",
          oqcId: "",
          batchNo: [],
          DataTime: new Date(),
          customerProductNo: "",
          customerId: "",
          oqcQuantity: '',
          orderNo: "",
          productId: "",
          prodTypeId: "",
          customerId: "",
          inspectorId: "",
          oqcNo: "",
          chkShiftId: "",
          batch: "",
          reportNo: "",
          totalQuantity: "",
          prodUnitName: "",
          createTime: "",
          sampleQuantity: 0,
          badQuantity: 0,
          badRate: 0,
          result: 1,
          reviewProcessId: ""
        },
        // batchNo: '',
        HandleList: [],
        fromProduct: {
          qcType: "",
          lenientTransfer: "",
          extStatus: ""
        },
        fromIqc: {
          crAql: "",
          majAql: "",
          minAql: "",
          inspectionStandard: ""
        },
        forCrTable: {
          samplingPlanAc: "",
          samplingPlanRe: "",
          sampleNum: "",
          batchEnd: ""
        },
        forMaTable: {
          samplingPlanAc: "",
          samplingPlanRe: ""
        },
        forMinTable: {
          samplingPlanAc: "",
          samplingPlanRe: ""
        },
        permsCur:[
          "UPDATE_OQC",
          "SELECT_OQC",
          "INSERT_OQC",
          "DELETE_OQC",
          "EXPORT_OQC",
          "AUDIT_OQC",
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "INSERT_OQC":false,
          "SELECT_OQC":false,
          "UPDATE_OQC":false,
          "DELETE_OQC":false,
          "EXPORT_OQC":false,
          "AUDIT_OQC":false
        },
        noPermsDis:true,
        loadingRemote:false,
        source:null,
        reviewState:'',
        sampleRefreshFlag1:false,
        sampleRefreshFlag2:false,
        samplingPlanType:0,
        changeProductFlag:false,
        productIdCache:''
      };
    },
    created() {
      this.initData()
      
    },
    watch: {
      /* "ruleForm.productId":function(){
        console.log(334);
        let url = "/basic/product/detail/";
        let val = this.ruleForm.productId
        let res = this.$iqis.utils.syncget(url+val); 
        this.ext = res.data.settings.ext
      } */
      "picBtnShow":function(flag){
        if(!flag){
          $('.defectTable').addClass('picBtnHide')
        }else{
          $('.defectTable').removeClass('picBtnHide')
        }
      }
    },
    methods: {
      paramslist(val){
        console.log(val);
        this.paramsList = val;
      },
      paramsFocus(index){
        if(index===0&&event.keyCode==13){
          $(event.target).parents('.ivu-table-column-center').next().find('input').focus()
        }else if(index==1&&event.keyCode==13){
          $(event.target).parents('.ivu-table-row').next().find('td:nth-child(9) input').focus()
        }
      },
      initData(){
        let that = this;
        let copy = that.$props && that.$props.tabKey;
        that.copy = copy.split('-')[2];
        let permsAll = this.$store.state.permissions; 
        this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
        that.getOqcList();
        let oqcId = that.$props.params && that.$props.params.oqcId;
        that.mark = true;
        if (oqcId) {
          that.sampleRefreshFlag1=true;
          that.sampleRefreshFlag2=true;
          that.oqcId = oqcId;
          that.refreshData(oqcId);
          that.prodBatch.oqcId = oqcId;
          that.prodBatch.btnState = "put";
          
        } else {
          that.defecttypeD();
          that.DefectGradeData();
          that.DefectPositionData();
          that.prodBatch.btnState = "post";
        }
        that.customerList();
        that.prodbatchList();
        // that.productName();
        that.basicCategory();
        that.spectorName();
        that.chkshiftFun();
        that.reviewProcess();
        that.CurrentOperator();
        that.getInspectiontype();
        if(((!that.oqcId&&that.permsBtn.INSERT_OQC)||(that.oqcId&&that.permsBtn.UPDATE_OQC))){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
      },
      endCase(){
        let that = this;
        if(!that.ruleForm.caseExplain){
          that.$Notice.warning({title:"结案说明不能为空"})
          return;
        }
        that.$http.put('/examinecenter/oqc/reviewrecord/close/'+that.oqcId,{caseExplain:that.ruleForm.caseExplain}).then((res)=>{
          that.$Message.success(i18n.t('oqc.endSuccess'))
          that.closePage()
        })
      },
      remoteMethod: _.debounce(function(query) {
        let that = this;
        that.loadingRemote = true;

        if (query !== '') {
          that.cancelQuest();
          that.$nextTick(()=>{

            that.$http.get('/basic/product/simple?page=1&limit=999999&examType=4&useState=1&fieldName=no,name&query='+query,{
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
      getInspectiontype() {//获取检验项目下拉框
        let that = this;
        that.$http.get("/basic/inspectiontype", {params: {limit: 99999999}}).then(function (resp) {
          let root = {title: i18n.t('oqc.projectType'), selected: false, label: i18n.t('oqc.projectType'), value: 0, expand: true};
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
        this.oqcDefects = this.oqcDefects || [];
        let newRow = this.oqcDefects[index];
        if (!newRow && this.oqcDefects[index]) {
          newRow = JSON.parse(JSON.stringify(this.oqcDefects[index]));
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
        // //console.log(resp,'获取缺陷数据')
        newRow['chkDevTypeList'].unshift({chkDevId: null, name: i18n.t('Unlimited')});

        that.oqcDefects[index] = newRow;
        that.$set(that.oqcDefects, index, newRow);
        //console.log(newRow, '当前行数据')
        return;
      },
      clearNoNum(obj, num) {
        /* obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
      obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
      obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
      let allRep = '';
      for(let i=0;i<num;i++){
        let rep = '\\d';
        allRep += rep;
      }
      let replaces = new RegExp('(\\-)*(\\d+)\.('+ allRep +').*',);
      obj.value = obj.value.replace(replaces,'$1$2.$3');//只能输入两个小数
      if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点
        obj.value= parseFloat(obj.value);
      } */

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
        // alert(obj.value)
        // let replaces = new RegExp('(\\-)*(\\d+)\.('+ allRep +').*',);
        // obj.value = obj.value.replace(replaces,'$1$2.$3');//只能输入两个小数
        if (obj.value.indexOf(".") == obj.value.length - 1 && num == 0) {
          // alert("hhahha")
          obj.value = obj.value.substring(0, obj.value.length - 1);
        }
        // alert(obj.value)
        if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点
          obj.value = parseFloat(obj.value);
        }
      },
      verification() {
        // alert(11111)
        if (isNaN(this.ruleForm.totalQuantity)) {
          this.ruleForm.totalQuantity = "";
          this.$Notice.warning({title: i18n.t('oqc.orderOnlyNum')});
        }
      },
      paramTableSelectChange(v) {
      },
      cellParamEditorEnd(val) {
      },
      defectTableSelectChange(v) {
        // alert(12445)
        this.prodBatch.TableLength = v.length;
        if (v.length > 0) {
          this.prodBatch.selected = true;
        } else {
          this.prodBatch.selected = false;
        }
      },
      cellDefectEditorEnd(val) {
      },
      loadSelectsData(callback) {
        let that = this;
        that.loadStat.selectsDataLoading = true;
        this.$http
          .all([
            // this.$http.get("/basic/product", {
            //   params: {limit: 99999999, examType: 1}
            // }),
            this.$http.get("/bas/manufacturer", {params: {limit: 999999999}}),
            this.$http.get("/tenant/user", {params: {limit: 999999999}}),
            this.$http.get("/basic/inspectiontype", {
              params: {limit: 99999999}
            }),
            this.$http.get("/basic/measunit", {params: {limit: 99999999}}),
            this.$http.get("/basic/prod-task", {params: {limit: 99999999}}),
            this.$http.get("/basic/chkdev", {params: {limit: 99999999}})
          ])
          .then(function (resps) {
            that.loadStat.selectsDataLoading = false;

            callback && callback();
          });
      },
      refreshData(oqcId) {
        let that = this;
        that.changeProductFlag=true;
        let url = "/examinecenter/oqc/oqcdetail/";
        that.$http.get(url + oqcId).then(res => {
          
          that.productProperty = res.data.oqcPropertyRecordList
          that.productPropertyCache = res.data.oqcPropertyRecordList
          that.oqcParamss = res.data.oqcPropertyRecordList
          for(let i = 0; i < res.data.paramRecordList.length; i++){
            this.paramValuearray[i] = res.data.paramRecordList[i].paramValueArray
          }
          that.prodBatch.AuditStatus = res.data.oqcItem.state;
          that.reviewState = res.data.oqcItem.reviewState;
          // 待审核或审核通过时
          if(that.copy=='copy'){
            that.prodBatch.AuditStatus=0;
          }
          if (
            that.prodBatch.AuditStatus == 1 ||
            that.prodBatch.AuditStatus == 2
          ) {
            that.dbd12 = true;
          }
          if (that.prodBatch.AuditStatus == 1) {
            // alert(444)
            that.dbd03 = true;
          }
          //检验中或审核驳回时
          if (
            that.prodBatch.AuditStatus == 0 ||
            that.prodBatch.AuditStatus == 3
          ) {
            that.dbd03 = false;
            that.submitButton = true;
            that.saveButtonShow = true;
          }
          if (that.ruleForm.result == 1) {
            that.saveButtonShow = false;
            that.submitButton = false;
          }

          if (!that.dbd12) {
            that.saveButtonShow = true;
            that.submitButton = true;
          }

          //审核驳回隐藏submDataButton按钮
          if (
            that.prodBatch.AuditStatus == 3 ||
            that.prodBatch.AuditStatus == 0
          ) {
            that.submDataButton = false;
            that.disposerecordshow = false;
          }

          if (that.prodBatch.AuditStatus == 2) {
            that.disposerecordshow = true;
          }
          that.ruleForm = {
            DataTime: new Date(res.data.oqcItem.createTime),
            customerProductNo: res.data.oqcItem.customerProductNo,
            customerId: res.data.oqcItem.customerId,
            oqcQuantity: res.data.oqcItem.oqcQuantity,
            oqcId: oqcId,
            batchNo: res.data.oqcItem.batchNo.split(","),
            oqcNo: res.data.oqcItem.oqcNo,
            orderNo: res.data.oqcItem.orderNo,
            productId: res.data.oqcItem.productId,
            productNo: res.data.oqcItem.productInfo.no,
            productName: res.data.oqcItem.productInfo.name,
            productSpec: res.data.oqcItem.productInfo.spec,
            prodTypeName: res.data.oqcItem.productInfo.prodTypeName,
            prodTypeId: res.data.oqcItem.productInfo.prodTypeId,
            inspectorId: res.data.oqcItem.inspectorId,
            chkShiftId: res.data.oqcItem.chkShiftId,
            batch: res.data.oqcItem.batch,
            reportNo: res.data.oqcItem.reportNo,
            totalQuantity: res.data.oqcItem.totalQuantity,
            sampleQuantity: res.data.oqcItem.sampleQuantity,
            badQuantity: res.data.oqcItem.badQuantity,
            badRate: res.data.oqcItem.badRate,
            result: res.data.oqcItem.result,
            caseExplain:res.data.oqcItem.caseExplain,
            qcExplain: res.data.oqcItem.qcExplain,
            reviewProcessId: res.data.oqcItem.reviewProcessId,
            prodUnitName: res.data.oqcItem.productInfo.prodUnitName
          };
          that.productId = res.data.oqcItem.productId;
          that.productIdCache = res.data.oqcItem.productId;
          if(that.copy=='copy'){
            that.oqcId=null
            that.ruleForm.iqcId=null
          }
          if (
            that.prodBatch.AuditStatus == 2 ||
            (that.prodBatch.AuditStatus == 1 && that.ruleForm.result == 0)
          ) {
            that.submDataButton = true;
          }
          that.prodBatch.indeV = res.data.oqcItem.productId;
          that.oqcDefects = res.data.defectRecordList;
          console.log(that.oqcDefects,12222)
          if (that.oqcDefects) {
            for (let i in that.oqcDefects) {
              let inspectionTypeId = that.oqcDefects[i].inspectionTypeId;
              let resp = that.$iqis.utils.syncget('/basic/defecttypelist/' + inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
              let defectTypeList = resp ? resp.data || [] : [];
              that.oqcDefects[i]['defectTypeList'] = defectTypeList;
              // //console.log(that.oqcDefects, '缺陷记录--------------------')
            }
            let chkDevTypeIds = []
            for(let i in that.oqcDefects){
              if(!that.oqcDefects[i].chkDevTypeId){that.oqcDefects[i].chkDevTypeId=-1}
              if(that.oqcDefects[i].chkDevTypeId!=-1){

                chkDevTypeIds.push(that.oqcDefects[i].chkDevTypeId.replace(/\,/g,'_'))
              }else{
                chkDevTypeIds.push(that.oqcDefects[i].chkDevTypeId)
              }
            }
            let resp =chkDevTypeIds?that.$iqis.utils.syncget('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{useState: 1,page: 1,limit: 9999}):null;
            for(let i in that.oqcDefects){
              let chkDevList = resp ? resp.data[i]||[] : [];
              chkDevList.unshift({chkDevId:null,name:i18n.t('Unlimited')});
              that.oqcDefects[i]['chkDevTypeList'] = chkDevList;
            }
          }
          for (let x in that.oqcDefects) {
            /*that.getChkdevlistData(res.data.defectRecordList[x].inspectionTypeId, x)*/
            //that.getChkdevlistData(7, x)
            // that.getChkdevlistData(res.data.defectRecordList[x].chkDevTypeId, x);
            that.oqcDefects[x].defectNumber = parseInt(x);
            that.oqcDefects[x].chkDevName =
              res.data.defectRecordList[x].chkDevName; //检验设备
            that.oqcDefects[x].defectTypeName =
              res.data.defectRecordList[x].defectTypeName;
            that.oqcDefects[x].qltyLvId = res.data.defectRecordList[x].qltyLvId;
            that.oqcDefects[x].inspectionTypeName =
              res.data.defectRecordList[x].inspectionTypeName;
            if (that.oqcDefects[x].extInfoList == null) {
              that.oqcDefects[x].extInfoList = new Array();
            }
          }
          that.oqcParamsRefresh = res.data.paramRecordList
          // that.detailData(res.data.oqcItem.productId);
          // that.oqcParams = res.data.paramRecordList;
          // let arr = [];
          // for(let i=0;i<res.data.paramRecordList.length;i++){
          //   if(!res.data.paramRecordList[i]){
          //     break;
          //   }
          //   let item = {
          //     paramValueArray:res.data.paramRecordList[i].paramValueArray,
          //     chkDevTypeId:res.data.paramRecordList[i].paramInfo.chkDevTypeId,
          //     chkDevId:res.data.paramRecordList[i].chkDevId,
          //     chkDevTypeName:res.data.paramRecordList[i].paramInfo.chkDevTypeName,
          //     inspectionTypeId:res.data.paramRecordList[i].paramInfo.inspectionTypeId,
          //     inspectionTypeName:res.data.paramRecordList[i].paramInfo.inspectionTypeName,
          //     lsl:res.data.paramRecordList[i].paramInfo.lsl,
          //     measUnitId:res.data.paramRecordList[i].paramInfo.measUnitId,
          //     measUnitName:res.data.paramRecordList[i].paramInfo.measUnitName,
          //     measUnitType:res.data.paramRecordList[i].paramInfo.measUnitType,
          //     measUnitTypeId:res.data.paramRecordList[i].paramInfo.measUnitTypeId,
          //     no:res.data.paramRecordList[i].paramInfo.no,
          //     prodChkParamId:res.data.paramRecordList[i].paramInfo.prodChkParamId,
          //     prodProcessName:res.data.paramRecordList[i].paramInfo.prodProcessName,
          //     prodStageId:res.data.paramRecordList[i].paramInfo.prodStageId,
          //     productId:res.data.paramRecordList[i].paramInfo.productId,
          //     sampleFq:res.data.paramRecordList[i].paramInfo.sampleFq,
          //     sampleNum:res.data.paramRecordList[i].paramInfo.sampleNum,
          //     scale:res.data.paramRecordList[i].paramInfo.scale,
          //     sl:res.data.paramRecordList[i].paramInfo.sl,
          //     unitSymbol:res.data.paramRecordList[i].paramInfo.unitSymbol,
          //     usl:res.data.paramRecordList[i].paramInfo.usl,
          //     wll:res.data.paramRecordList[i].paramInfo.wll,
          //     wul:res.data.paramRecordList[i].paramInfo.wul,
          //   }
          //   arr.push(item)
          // }
          // that.oqcParams = JSON.parse(JSON.stringify(arr));
          // that.oqcParamsRefresh = JSON.parse(JSON.stringify(arr));
          // that.productDetail = JSON.parse(JSON.stringify(arr));
          // that.oqcParamsNew = JSON.parse(JSON.stringify(arr));
          // that.$nextTick(()=>{
          //   for(let i=0;i<that.oqcParams.length;i++){
          //     for(let k=0;k<5;k++){
          //       if(that.oqcParams[i].paramValueArray[k]){
          //         let obj = document.getElementById('styleTable').getElementsByTagName('tbody');
          //         let indexObj = obj[0].children[i];
          //         //console.log(obj,"obj");
          //         //console.log(indexObj,"indexObj");
          //         if(Number(that.oqcParams[i].paramValueArray[k]) > Number(that.oqcParams[i].wul) || Number(that.oqcParams[i].paramValueArray[k]) < Number(that.oqcParams[i].wll)){

          //         }else{

          //         }
          //       }
          //     }
          //   }
          // })

          that.defecttypeD();
          that.DefectGradeData();
          that.DefectPositionData();
          that.prodBatch.reviewProcessIndex = res.data.oqcItem.reviewProcessId;
          if (
            that.prodBatch.reviewProcessIndex != null &&
            that.ruleForm.result == 0
          ) {
            that.prodBatch.reviewProcessstate = true;
          }
          that.prodBatch.inspectorName = res.data.oqcItem.inspectorName;
          if (
            (that.prodBatch.AuditStatus == 1 ||
            that.prodBatch.AuditStatus == 2 )&&
            res.data.oqcItem.reviewProcessId != null
          ) {
            that.ReviewRecord(oqcId);
          }
        });
      },
      //获取所属客户
      customerList() {
        let that = this;
        let url = "/bas/customerList?page=1&limit=9999&query=&fieldName=";
        that.$http.get(url).then(res => {
          that.prodBatch.customerList = res.data;
        });
      },
      //获取产品批号
      prodbatchList() {
        let that = this;
        let url =
          "/examinecenter/pqc/prodbatch?page=1&limit=9999&query=&fieldName=";
        that.$http.get(url).then(res => {
          that.prodBatch.prodbatchList = res.data;
        });
      },
      //获取检验人员
      spectorName() {
        let that = this;
        let idValueMap = [];
        let url = "/tenant/user?page=1&limit=99999";
        that.$http.get(url).then(res => {
          let urlProduct = res.data;
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
              name: [boxName]
            });
          });
          that.prodBatch.spectorNameData = idValueMap[0].name;
          that.CurrentOperator(idValueMap[0].name);
        });
      },

      //获取当前登录人员信息 /tenant/user/profile
      CurrentOperator(obj) {
        let that = this;
        let url = "/tenant/user/profile";
        that.$http.get(url).then(res => {
          that.prodBatch.CurrentOperatorId = res.data.userId;
          if(that.copy=='copy'){
            that.ruleForm.inspectorId=that.prodBatch.CurrentOperatorId
          }
          that.currentName = res.data.name;
          
          for (let i = 0; i < obj.length; i++) {
            if (obj[i].inspectorName == res.data.name) {
              if (
                that.prodBatch.AuditStatus == 3 &&
                that.prodBatch.CurrentOperatorId != that.ruleForm.inspectorId
              ) {
                that.dbd12 = true;
                that.dbd03 = true;
                that.submitButton = false;
                that.saveButtonShow = false;
              }
              // 修复bug 检验人员随登录人员变动问题
              if (!that.$refs.disabledprice.disabled) {
                that.ruleForm.inspectorId = obj[i].inspectorId;
              }
              //添加时带出检验人员
              if (
                that.prodBatch.AuditStatus == "" ||
                that.prodBatch.AuditStatus == null
              ) {
                that.ruleForm.inspectorId = obj[i].inspectorId;
              }
            }
          }
        });
      },
      //select选中
      changeProductId(val, index) {
        let that = this;
        that.prodBatch.dataVB.push(val);
        if (that.prodBatch.dataVB.length > 0) {
          // that.productName(val);
          that.detailData(val);
          // that.ParameterDetails(val);
        }
      },
      //参数记录表详情
      ParameterDetails(val) {
        let that = this;
        // let url = "/basic/product/detail/";
        // that.$http.get(url + val).then(res => {
          // let dataTable = res.data.settings.qc.oqc.params;
          let param = {};
          let paramInfo;
          let paramRecordList = [];
          if (that.productDetail.length == 0) {
            that.oqcParams = [];
          } else {
            for (let i = 0; i < that.productDetail.length; i++) {
              that.productDetail[i].paramValueArray = [];
              let param = {
                paramId: that.productDetail[i].prodChkParamId,
                paramInfo: that.productDetail[i],
                paramValueArray: that.productDetail[i].paramValueArray
              };
              paramRecordList.push(param);
            }
            let oqcId = that.$props.params && that.$props.params.oqcId;
            if (oqcId) {
              if (val == that.productId && that.oqcParamsNew.length > 0) {
                that.oqcParams = JSON.parse(JSON.stringify(that.oqcParamsNew));
              } else {
                that.oqcParams = JSON.parse(JSON.stringify(paramRecordList));
              }
            } else {
              that.oqcParams = JSON.parse(JSON.stringify(paramRecordList));
            }
//          that.oqcParams = paramRecordList;
          }

        // });
      },
      //获取产品信息
      productName(val) {
        return;
        let that = this;
        let idValueMap = [];
        let url_product = "/basic/product?examType=4&page=1&limit=9999&useState=1";
        that.$http.get(url_product).then(res => {
          let productData = res.data;
          productData.forEach(e => {
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
              spec: [boxSpec]
            });
          });
          for (var index in productData) {
            if (val === productData[index].productId) {
              that.ruleForm.prodUnitName = productData[index].prodUnitName;
              that.basicCategory(productData[index].prodTypeName);
            }
          }
          that.prodBatch.productON = idValueMap[0].no;
          that.prodBatch.productNames = idValueMap[0].name;
          that.prodBatch.productSpec = idValueMap[0].spec;
        });
      },
      //获取产品类别
      basicCategory(obj) {
        let idValueMap = [];
        let url_prodtype = "/basic/prodtype?limit=99999999";
        this.$http.get(url_prodtype).then(res => {
          let urlProduct = res.data;
          urlProduct.forEach(e => {
            let prodTypeId = e.prodTypeId;
            let name = e.name;
            let boxName = {name, prodTypeId};
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
              this.ruleForm.prodTypeId = urlProduct[index].prodTypeId;
            }
          }
          this.prodBatch.prodTypeName = idValueMap[0].name;
        });
      },
      //产品详细查询
      detailData(val) {
        let that = this;
        let turrn = false;
        
        let url = "/basic/product/detail/";
        let urls = "/business-rule/product/lenient-transfer?productId=";
        // that.$http.get(url + val).then(res => {
        let res = that.$iqis.utils.syncget(url+val); 
        // this.ext = res.data.settings.ext
        let oqcParams = []
        if(that.changeProductFlag){
          that.changeProductFlag=false;
          oqcParams = that.oqcParamsRefresh
        }else{
          oqcParams = res.data.settings.qc.oqc.params
        }
        if(that.productIdCache!=val){
              that.oqcParamss = res.data.settings.qc.oqc.property
          }else{
              that.oqcParamss = that.productPropertyCache
          }
        let chkDevTypeIds = []
        for(let i in oqcParams){
          if(!oqcParams[i].chkDevTypeId){oqcParams[i].chkDevTypeId="-1"}
          chkDevTypeIds.push(oqcParams[i].chkDevTypeId.replace(/\,/g,'_'))
        }
        let resp =chkDevTypeIds?that.$iqis.utils.syncget('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{useState: 1,page: 1,limit: 9999}):null;
        // that.$http.get('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds).then(function(resp){
        for(let i in oqcParams){
          let chkDevList = resp ? resp.data[i]||[] : [];
          chkDevList.unshift({chkDevId:null,name:i18n.t('Unlimited')});
          oqcParams[i]['chkDevList'] = chkDevList;
        }
        // if(that.oqcParamsRefresh.length>0){
        //   for(let i in oqcParams){
        //     oqcParams[i]['chkDevId']=that.oqcParamsRefresh[i].chkDevId||''
        //   }
        // }
        that.oqcParams = oqcParams
        for(let i= 0; i < that.oqcParams.length; i++){
            that.oqcParams[i].expand = true
          }
        // })
        
          // that.oqcParamss = res.data.settings.qc.oqc.property
          that.samplingPlanType=res.data.settings.qc.oqc.aql.samplingPlanType
          /* for(let i = 0; i < that.oqcParamss.length; i++){
            if(this.productProperty.length !== 0){ 
              that.oqcPropertyRecordList.push(
                {
                  "inspectionExplain": this.productProperty[i].inspectionExplain || "",//检验说明
                  "propertyId": that.oqcParamss[i].propertyId,
                  "result": this.productProperty[i].result || 0,//结果
                }
              )
            }else {
              that.oqcPropertyRecordList.push(
                {
                  "inspectionExplain": "",//检验说明
                  "propertyId": that.oqcParamss[i].propertyId,
                  "result": 0,//结果
                }
              )
            }
          } */
          for(let i = 0; i < that.oqcParamss.length; i++){
            that.oqcPropertyRecordList.push(
              {
                "inspectionExplain": that.oqcParamss[i].inspectionExplain ? that.oqcParamss[i].inspectionExplain : '',//说明
                "inspectionId": that.oqcParamss[i].inspectionId,//检验项目id
                "inspectionLevel": that.oqcParamss[i].inspectionLevel,//标准
                "inspectionName": that.oqcParamss[i].inspectionName,//检验项目名称
                "oqcId": this.oqcId,
                "propertyRecordId": that.mark ? '' : that.oqcParamss[i].propertyRecordId ? that.oqcParamss[i].propertyRecordId : '',//组件id
                "result": that.oqcParamss[i].result ? that.oqcParamss[i].result : 0,//检验结果
              }
            )
          }
          
          // that.productDetail = res.data.settings.qc.oqc.params,
          that.ruleForm.productSpec=res.data.spec;
          that.ruleForm.productName=res.data.name;
          that.ruleForm.prodTypeName=res.data.prodTypeName;
          that.ruleForm.prodUnitName=res.data.prodUnitName;
          that.samplingPlanType=res.data.settings.qc.oqc.aql.samplingPlanType;
          if(that.samplingPlanType==0){
          (that.fromIqc.crAql = res.data.settings.qc.oqc.aql.crAql),
            (that.fromIqc.majAql = res.data.settings.qc.oqc.aql.majAql),
            (that.fromIqc.minAql = res.data.settings.qc.oqc.aql.minAql);
            that.fromProduct.qcType=res.data.settings.qc.oqc.aql.samplingPlanCode
          that.fromIqc.inspectionStandard =
            res.data.settings.qc.oqc.aql.inspectionStandard;
          }else{
             that.fromIqc.crAql = ''
            that.fromIqc.majAql = ''
            that.fromIqc.minAql = ''
            that.fromIqc.inspectionStandard = ''
            that.fromProduct.qcType=''
          }
          let productId = res.data.productId;
          let qcType = res.data.settings.qc.oqc.aql.samplingPlanCode;
          let type = 0;
          if (qcType == 'GB/T2828.1-2012') {
            type = 1;
          }
          if(qcType=='full'){
            that.forCrTable.sampleNum=that.ruleForm.oqcQuantity;
          }
          if(qcType=='percent'){
            that.forCrTable.sampleNum=that.ruleForm.oqcQuantity*that.fromIqc.inspectionStandard/100
          }
          if(qcType=='full'||qcType=='percent'){
            if(that.sampleRefreshFlag1){
              that.sampleRefreshFlag1=false;
            }else{
              that.ruleForm.sampleQuantity=that.forCrTable.sampleNum;
            }
            that.fromProduct.lenientTransfer=''
            that.fromIqc.crAql='-'
            that.fromIqc.majAql='-'
            that.fromIqc.minAql='-'
            that.forCrTable.samplingPlanAc='-'
            that.forMaTable.samplingPlanAc='-'
            that.forMinTable.samplingPlanAc='-'
            that.forCrTable.samplingPlanRe='-'
            that.forMaTable.samplingPlanRe='-'
            that.forMinTable.samplingPlanRe='-'
            let oqcParams = JSON.parse(JSON.stringify(that.oqcParams))
            for(let i in oqcParams){
              oqcParams[i]['num']=that.forCrTable.sampleNum
            }
            that.oqcParams=oqcParams
            return;
          }

          let endDate = new Date(that.ruleForm.DataTime).getTime();
          let calculateUrl = "/business-rule/product/new-calculate-lenient-transfer?productId=" + productId + "&qcType=oqc&endDate=" + endDate;
          that.$http.put(calculateUrl).then(resp => {
            that.fromProduct.lenientTransfer = resp.data.lenientTransfer;
            if(qcType=='full'||qcType=='percent'){
              that.fromProduct.lenientTransfer=''
            }
            that.getAql()
            if (resp.data.extStatus != null) {
              that.fromProduct.extStatus = resp.data.extStatus;
            }
            that.$http.get(urls + productId + "&qcType=" + qcType).then(resname => {
              (that.fromProduct.qcType = resname.data.qcType);
              let oqcQuantity=0;
              if (that.ruleForm.oqcQuantity==''||that.ruleForm.oqcQuantity==null) {
                oqcQuantity = 0;
              } else {
                oqcQuantity = that.ruleForm.oqcQuantity;
              }
              if (
                that.fromIqc.crAql == "" &&
                that.fromIqc.majAql == "" &&
                that.fromIqc.minAql == ""
              ) {
                that.forCrTable.samplingPlanAc = "";
                that.forCrTable.samplingPlanRe = "";
                that.forMaTable.samplingPlanAc = "";
                that.forMaTable.samplingPlanRe = "";
                that.forMinTable.samplingPlanAc = "";
                that.forMinTable.samplingPlanRe = "";
                that.forCrTable.sampleNum = "";
              } else {
                
                let data=[
                  {
                    code:that.fromProduct.qcType,
                    level:that.fromIqc.inspectionStandard,
                    tolerance:that.fromProduct.lenientTransfer,
                    aql:that.fromIqc.crAql,
                    num:oqcQuantity,
                    type:type
                  },
                  {
                    code:that.fromProduct.qcType,
                    level:that.fromIqc.inspectionStandard,
                    tolerance:that.fromProduct.lenientTransfer,
                    aql:that.fromIqc.majAql,
                    num:oqcQuantity,
                    type:type
                  },
                  {
                    code:that.fromProduct.qcType,
                    level:that.fromIqc.inspectionStandard,
                    tolerance:that.fromProduct.lenientTransfer,
                    aql:that.fromIqc.minAql,
                    num:oqcQuantity,
                    type:type
                  },
                ]
                that.$http.post('/sampling-plan/aql?samplingPlanParamDtos',data,that.headers).then((res) => {
                  that.forCrTable.samplingPlanAc = res.data[0].samplingPlanAc
                  that.forCrTable.samplingPlanRe = res.data[0].samplingPlanRe
                  if (!that.ruleForm.oqcQuantity == "") {
                    that.forCrTable.sampleNum = res.data[0].sampleNum;
                  }
                  that.forCrTable.batchEnd = res.data[0].batchEnd;
                  that.forMaTable.samplingPlanAc = res.data[1].samplingPlanAc
                  that.forMaTable.samplingPlanRe = res.data[1].samplingPlanRe
                  that.forMinTable.samplingPlanAc = res.data[2].samplingPlanAc
                  that.forMinTable.samplingPlanRe = res.data[2].samplingPlanRe
                  let oqcParams = JSON.parse(JSON.stringify(that.oqcParams))
                  for(let i in oqcParams){
                    oqcParams[i]['num']=that.forCrTable.sampleNum
                  }
                  that.oqcParams=oqcParams

                })
                // if (that.fromIqc.crAql != "") {
                //   let urlaql =
                //     "/sampling-plan/aql?code=" +
                //     that.fromProduct.qcType +
                //     "&level=" +
                //     that.fromIqc.inspectionStandard +
                //     "&tolerance=" +
                //     that.fromProduct.lenientTransfer +
                //     "&aql=" +
                //     that.fromIqc.crAql +
                //     "&num=" +
                //     totalQuantity +
                //     "&type=" +
                //     type;
                //   if (that.ruleForm.oqcQuantity == '' || that.ruleForm.oqcQuantity == null) {
                //     return;
                //   }
                //   that.$http.get(urlaql).then(res => {
                //     that.forCrTable.samplingPlanAc = res.data.samplingPlanAc;
                //     that.forCrTable.samplingPlanRe = res.data.samplingPlanRe;
                //     if (!that.ruleForm.oqcQuantity == "") {
                //       that.forCrTable.sampleNum = res.data.sampleNum;
                //     }

                //     that.forCrTable.batchEnd = res.data.batchEnd;
                //   });
                // }
                // if (that.fromIqc.majAql != "") {
                //   let urlaqls =
                //     "/sampling-plan/aql?code=" +
                //     that.fromProduct.qcType +
                //     "&level=" +
                //     that.fromIqc.inspectionStandard +
                //     "&tolerance=" +
                //     that.fromProduct.lenientTransfer +
                //     "&aql=" +
                //     that.fromIqc.majAql +
                //     "&num=" +
                //     totalQuantity +
                //     "&type=" +
                //     type;
                //   that.$http.get(urlaqls).then(res => {
                //     that.forMaTable.samplingPlanAc = res.data.samplingPlanAc;
                //     that.forMaTable.samplingPlanRe = res.data.samplingPlanRe;
                //   });
                // }
                // if (that.fromIqc.minAql != "") {
                //   let urlaqlk =
                //     "/sampling-plan/aql?code=" +
                //     that.fromProduct.qcType +
                //     "&level=" +
                //     that.fromIqc.inspectionStandard +
                //     "&tolerance=" +
                //     that.fromProduct.lenientTransfer +
                //     "&aql=" +
                //     that.fromIqc.minAql +
                //     "&num=" +
                //     totalQuantity +
                //     "&type=" +
                //     type;
                //   that.$http.get(urlaqlk).then(res => {
                //     that.forMinTable.samplingPlanAc = res.data.samplingPlanAc;
                //     that.forMinTable.samplingPlanRe = res.data.samplingPlanRe;
                //   });
                // }
              }
            });

          })

        // });
      },

      //根据出货数量获取抽样数量
      getAql() {
        let that = this;
        if (!this.ruleForm.productId) {
          that.$Notice.warning({title: i18n.t('oqc.prodNoFirst')})
          that.ruleForm.oqcQuantity = ''
          return;
        }
        if (!that.ruleForm.oqcQuantity) {
          return;
        }
        /*if(Number(that.ruleForm.oqcQuantity)>Number(that.forCrTable.batchEnd)){
          that.ruleForm.oqcQuantity=that.forCrTable.batchEnd
        }
        if(that.ruleForm.oqcQuantity==""){
          that.ruleForm.oqcQuantity='0';
        }*/
        if(that.samplingPlanType==1){
          let data = []
          let oqcParams = JSON.parse(JSON.stringify(that.oqcParams))
          console.log(oqcParams,'oqcParams')
          that.oqcParams = [];
          for(let i=0;i<oqcParams.length;i++){
            let item = oqcParams[i]
            let one = {
              code:item.samplingPlanCode,
              level:item.inspectionStandard,
              aql:item.aql,
              num:that.ruleForm.oqcQuantity,
              type:0,
              tolerance:that.fromProduct.lenientTransfer
            }
            if(one.code=='GB/T2828.1-2012'){
              one.type=1;
            }
            data.push(one)
          }
          console.log(data,'data')
          that.$http.post('/sampling-plan/aql?samplingPlanParamDtos',data,that.headers).then((res) => {
            console.log(res.data,'res.data')
            for(let i in oqcParams){
              let item = oqcParams[i]
              item['num']=res.data[i].sampleNum
              item['ac']=res.data[i].samplingPlanAc
              item['re']=res.data[i].samplingPlanRe
            }
            that.oqcParams = oqcParams
          })
        }else{
          let urlaql = "";
          let urlaqls = "";
          let urlaqlk = "";
          let type = 0;
          let data=[]
          if (that.fromProduct.qcType == 'GB/T2828.1-2012') {
            type = 1;
          }
          if(that.fromProduct.qcType=='full'){
            that.forCrTable.sampleNum=that.ruleForm.oqcQuantity;
          }
          if(that.fromProduct.qcType=='percent'){
            that.forCrTable.sampleNum=that.ruleForm.oqcQuantity*that.fromIqc.inspectionStandard/100
          }
          if(that.fromProduct.qcType=='full'||that.fromProduct.qcType=='percent'){
            that.fromProduct.lenientTransfer=''
            that.fromIqc.crAql='-'
            that.fromIqc.majAql='-'
            that.fromIqc.minAql='-'
            that.forCrTable.samplingPlanAc='-'
            that.forMaTable.samplingPlanAc='-'
            that.forMinTable.samplingPlanAc='-'
            that.forCrTable.samplingPlanRe='-'
            that.forMaTable.samplingPlanRe='-'
            that.forMinTable.samplingPlanRe='-'
            let oqcParams = JSON.parse(JSON.stringify(that.oqcParams))
            for(let i in oqcParams){
              oqcParams[i]['num']=that.forCrTable.sampleNum
            }
            that.oqcParams=oqcParams
            return;
          }
          //console.log(that.ruleForm.oqcQuantity, 1111111111111111111111111)
          
          if (!that.ruleForm.oqcQuantity) {
            // urlaql =
            //   "/sampling-plan/aql?code=" +
            //   that.fromProduct.qcType +
            //   "&level=" +
            //   that.fromIqc.inspectionStandard +
            //   "&tolerance=" +
            //   that.fromProduct.lenientTransfer +
            //   "&aql=" +
            //   that.fromIqc.crAql +
            //   "&num=0" +
            //   "&type=" +
            //   type;
            // urlaqls =
            //   "/sampling-plan/aql?code=" +
            //   that.fromProduct.qcType +
            //   "&level=" +
            //   that.fromIqc.inspectionStandard +
            //   "&tolerance=" +
            //   that.fromProduct.lenientTransfer +
            //   "&aql=" +
            //   that.fromIqc.majAql +
            //   "&num=0" +
            //   "&type=" +
            //   type;
            // urlaqlk =
            //   "/sampling-plan/aql?code=" +
            //   that.fromProduct.qcType +
            //   "&level=" +
            //   that.fromIqc.inspectionStandard +
            //   "&tolerance=" +
            //   that.fromProduct.lenientTransfer +
            //   "&aql=" +
            //   that.fromIqc.minAql +
            //   "&num=0" +
            //   "&type=" +
            //   type;
            data=[
            {
              code:that.fromProduct.qcType,
              level:that.fromIqc.inspectionStandard,
              tolerance:that.fromProduct.lenientTransfer,
              aql:that.fromIqc.crAql,
              num:0,
              type:type
            },
            {
              code:that.fromProduct.qcType,
              level:that.fromIqc.inspectionStandard,
              tolerance:that.fromProduct.lenientTransfer,
              aql:that.fromIqc.majAql,
              num:0,
              type:type
            },
            {
              code:that.fromProduct.qcType,
              level:that.fromIqc.inspectionStandard,
              tolerance:that.fromProduct.lenientTransfer,
              aql:that.fromIqc.minAql,
              num:0,
              type:type
            },
          ]
          
          } else {
            data=[
              {
                code:that.fromProduct.qcType,
                level:that.fromIqc.inspectionStandard,
                tolerance:that.fromProduct.lenientTransfer,
                aql:that.fromIqc.crAql,
                num:that.ruleForm.oqcQuantity,
                type:type
              },
              {
                code:that.fromProduct.qcType,
                level:that.fromIqc.inspectionStandard,
                tolerance:that.fromProduct.lenientTransfer,
                aql:that.fromIqc.majAql,
                num:that.ruleForm.oqcQuantity,
                type:type
              },
              {
                code:that.fromProduct.qcType,
                level:that.fromIqc.inspectionStandard,
                tolerance:that.fromProduct.lenientTransfer,
                aql:that.fromIqc.minAql,
                num:that.ruleForm.oqcQuantity,
                type:type
              },
            ]
            // urlaql =
            //   "/sampling-plan/aql?code=" +
            //   that.fromProduct.qcType +
            //   "&level=" +
            //   that.fromIqc.inspectionStandard +
            //   "&tolerance=" +
            //   that.fromProduct.lenientTransfer +
            //   "&aql=" +
            //   that.fromIqc.crAql +
            //   "&num=" +
            //   that.ruleForm.oqcQuantity +
            //   "&type=" +
            //   type;
            // urlaqls =
            //   "/sampling-plan/aql?code=" +
            //   that.fromProduct.qcType +
            //   "&level=" +
            //   that.fromIqc.inspectionStandard +
            //   "&tolerance=" +
            //   that.fromProduct.lenientTransfer +
            //   "&aql=" +
            //   that.fromIqc.majAql +
            //   "&num=" +
            //   that.ruleForm.oqcQuantity +
            //   "&type=" +
            //   type;
            // urlaqlk =
            //   "/sampling-plan/aql?code=" +
            //   that.fromProduct.qcType +
            //   "&level=" +
            //   that.fromIqc.inspectionStandard +
            //   "&tolerance=" +
            //   that.fromProduct.lenientTransfer +
            //   "&aql=" +
            //   that.fromIqc.minAql +
            //   "&num=" +
            //   that.ruleForm.oqcQuantity +
            //   "&type=" +
            //   type;
          }

          // that.$http.get(urlaql).then(res => {
          //   that.forCrTable.samplingPlanAc = res.data.samplingPlanAc;
          //   that.forCrTable.samplingPlanRe = res.data.samplingPlanRe;
          //   that.forCrTable.sampleNum = res.data.sampleNum;
          //   that.ruleForm.sampleQuantity=that.forCrTable.sampleNum

          // });
          // that.$http.get(urlaqls).then(res => {
          //   that.forMaTable.samplingPlanAc = res.data.samplingPlanAc;
          //   that.forMaTable.samplingPlanRe = res.data.samplingPlanRe;
          // });
          // that.$http.get(urlaqlk).then(res => {
          //   that.forMinTable.samplingPlanAc = res.data.samplingPlanAc;
          //   that.forMinTable.samplingPlanRe = res.data.samplingPlanRe;
          // });
          that.$http.post('/sampling-plan/aql?samplingPlanParamDtos',data,that.headers).then((res) => {
            that.forCrTable.samplingPlanAc = res.data[0].samplingPlanAc
            that.forCrTable.samplingPlanRe = res.data[0].samplingPlanRe
            that.forCrTable.sampleNum = res.data[0].sampleNum;
            if(that.sampleRefreshFlag1&&that.sampleRefreshFlag2){
              that.sampleRefreshFlag2=false;
            }else{
              that.ruleForm.sampleQuantity=that.forCrTable.sampleNum;
            }
            that.forMaTable.samplingPlanAc = res.data[1].samplingPlanAc
            that.forMaTable.samplingPlanRe = res.data[1].samplingPlanRe
            that.forMinTable.samplingPlanAc = res.data[2].samplingPlanAc
            that.forMinTable.samplingPlanRe = res.data[2].samplingPlanRe
            let oqcParams = JSON.parse(JSON.stringify(that.oqcParams))
            for(let i in oqcParams){
              oqcParams[i]['num']=that.forCrTable.sampleNum
            }
            that.oqcParams=oqcParams

          })
        }

      },

      //获取参数记录
      transferData() {
        let that = this;
        let url = "/examinecenter/oqc/oqc";
        that.$http.get(url).then(res => {
        });
      },
      //检验班别
      chkshiftFun() {
        let that = this;
        let url = "/basic/chkshift?page=1&limit=99999";
        that.$http.get(url).then(res => {
          that.prodBatch.chkshiftData = res.data;
        });
      },
      //获取缺陷数据
      defecttypeD() {
        let that = this;
        let idValueMap = [];
        let url = "/basic/defecttype?page=1&limit=9999";
        that.$http.get(url).then(res => {
          let urlProduct = res.data;
          that.prodBatch.DefectName = res.data;
        });
      },
      TesySynthesis(obj, index) {
        let that = this;
        for (let x in that.prodBatch.DefectName) {
          if (obj == that.prodBatch.DefectName[x].defectTypeId) {
            that.oqcDefects[index].inspectionTypeName =
              that.prodBatch.DefectName[x].inspectionTypeName;
            that.DefectGradeData(that.prodBatch.DefectName[x].qltyLvId, index);
            // that.getChkdevlistData(
            //   that.prodBatch.DefectName[x].inspectionType.chkDevTypeId,
            //   index
            // );
          }
        }
      },
      //缺陷等级
      DefectGradeData(Lvid, index) {
        let that = this;
        let idValueMap = [];
        let url = "/basic/qltylv?page=1&limit=99999";
        that.$http.get(url).then(res => {
          let urlProduct = res.data;
          that.prodBatch.DefectGrade = urlProduct;
          for (let x in that.prodBatch.DefectGrade) {
            if (Lvid == that.prodBatch.DefectGrade[x].qltyLvId) {
              that.oqcDefects[index].qltyLvId =
                that.prodBatch.DefectGrade[x].qltyLvId;
            }
          }
        });
      },
      //检验设备类别
      getChkdevlistData(id, index) {
        let that = this;
        let url = "/basic/chkdevlist/";
        if (id != "") {
          that.$http.get(url + id).then(res => {
            let urlProduct = res.data;
            that.oqcDefects[index].chdDevTypeList = [];
            for (let x in urlProduct) {
              if (id === urlProduct[x].chkDevTypeId) {
                that.oqcDefects[index].chkDevTypeId = urlProduct[x].chkDevTypeId;
                that.oqcDefects[index].chdDevTypeList.push(urlProduct[x]);
              }
            }
            that.$set(that.oqcDefects, index, that.oqcDefects[index]);
          });
        }
      },
      //缺陷位置
      DefectPositionData() {
        let that = this;
        let url = "/basic/defectloc?page=1&limit=99999";
        that.$http.get(url).then(res => {
          that.prodBatch.DefectPosition = res.data;
          that.prodBatch.DefectPosition.unshift({defectLocId: i18n.t('Unlimited'), name: i18n.t('Unlimited')});

        });
      },
      //添加缺陷记录
      addDefect() {
        // this.oqcDefects=[]
        // // console.log(this.paramValuearray,67899)
        // console.log(this.oqcParams,67899)
        // for(let i in this.oqcPropertyRecordList) {
        //   let item = this.oqcPropertyRecordList[i]
        //   if(item.result==1) {
        //     let obj ={}
        //     obj.inspectionTypeId = item.inspectionId
        //     obj.inspectionTypeName = item.inspectionName
        //     this.oqcDefects.push(obj)
        //   }
        // }
        // for(let i in this.paramValuearray) {//遍历参数记录
        //   let item = this.paramValuearray[i]
        //   let oqcParams = this.oqcParams[i]//参数记录对应的一行的信息
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
        //     if(item[i]>oqcParams.usl || item[i]<oqcParams.lsl) {
        //       number++
        //     }
        //   }
        //   let AS = item.sort((a, b) => a - b)
        //   let max = AS[item.length-1]//最大值
        //   let min = AS[0]//最小值
        //   let record
        //   if(min>oqcParams.sl) {
        //     record = `规格:${oqcParams.sl} 正${oqcParams.usl} 负${oqcParams.lsl} 实测最大${max}`
        //   }
        //   if(max<oqcParams.sl) {
        //     record = `规格:${oqcParams.sl} 正${oqcParams.usl} 负${oqcParams.lsl} 实测最小${min}`
        //   }
        //   if(min<=oqcParams.sl && max >=oqcParams.sl) {
        //     record = `规格:${oqcParams.sl} 正${oqcParams.usl} 负${oqcParams.lsl} 实测最大${max} 实测最小${min}`
        //   }
        //   if(max>oqcParams.usl || min<oqcParams.lsl) {//新增缺陷的一行数据
        //     let obj = {}
        //     obj.inspectionTypeId = oqcParams.inspectionTypeId//检验项目
        //     obj.inspectionTypeName = oqcParams.inspectionTypeName
        //     obj.defectTypeId = "尺寸NG"//缺陷名称
        //     obj.sampleQuantity = oqcParams.num//实抽样数
        //     obj.defectCount = (number/item.length)*oqcParams.num//缺陷数
        //     obj.defectRate = ((number/item.length)*oqcParams.num)/oqcParams.num///缺陷率
        //     obj.describe = record
        //     this.oqcDefects.push(obj)
        //   }
        // }
        this.oqcDefects=this.$iqis.utils.tableHelper.defects(this.oqcDefects,this.paramValuearray,this.oqcParams,this.oqcPropertyRecordList)
        return
        let that = this;
        that.discountData.tableData.oqcId = that.prodBatch.oqcId;
        let obj = JSON.parse(JSON.stringify(that.discountData.tableData));
        that.oqcDefects.push(obj);
        let index = that.oqcDefects.length;
        that.oqcDefects[index - 1].defectNumber = index - 1;
        this.$nextTick(function(){
          $(".location .ivu-table-body").scrollTop((index-5)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');

        })
      },
      //评审流程
      reviewProcess() {
        let that = this;
        let url = "/basic/reviewprocess?page=1&limit=9999";
        that.$http.get(url).then(res => {
          that.ProcessIdList = res.data;
          that.ProcessIdList.unshift({reviewProcessId:null,name:i18n.t('noReview')})
        });
      },

      deleteTableSelected() {
        let that = this;
        let ss = this.$refs.paramTableFects.getSelection();
        for (let i = 0; i < that.oqcDefects.length; i++) {
          for (let j = 0; j < ss.length; j++) {
            if (that.oqcDefects[i].defectNumber === ss[j].defectNumber) {
              that.oqcDefects.splice(i, 1);
            }
          }
        }
      },
      //评审记录
      ReviewRecord(oqcId) { 
        let that = this;
        let scuss = false;
        let scussOne = false;
        let url = "/examinecenter/oqc/reviewrecord/";
        that.$http.get(url + oqcId).then(res => {
          let JudgePerson = res.data[res.data.length - 1];
          let Judgeindex = res.data.length - 1;
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].reviewerId == that.prodBatch.CurrentOperatorId) {
              // if(that.prodBatch.AuditStatus==3){

              if (i != Judgeindex) {
                scuss = true;
              }
              if (i == 0) {
                scussOne = true;
              }
              //  }
            }
            if (res.data[0].treatmentType == null) {
              res.data[i].disabled = true;
              if (scussOne == true) {
                res.data[0].disabled = false;
              }
            }
            if (JudgePerson.treatmentType != null) {
              res.data[i].disabled = true;
              if (scuss == false) {
                res.data[Judgeindex].disabled = false;
              }
            }

            // alert(res.data[i].disabled)
          }

          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].reviewTime != null) {
              res.data[i].dataTime = new Date(res.data[i].reviewTime);
            }
          }
          that.HandleList = res.data;

          let isShow = false;

          for (var i = 0; i < that.HandleList.length; i++) {
            if (
              that.prodBatch.CurrentOperatorId == that.HandleList[i].reviewerId
            ) {
              isShow = true;
              break;
            }
          }
          if (isShow && that.prodBatch.AuditStatus != 0) {
            that.submDataButton = true;
          } else {
            that.submDataButton = false;
          }

          let flag = true;
          for (var i = 1; i < that.HandleList.length; i++) {
            if (that.HandleList[0].reviewerId == that.HandleList[i].reviewerId) {
              flag = false;
              break;
            }
          }
          // 判断
          if (
            that.prodBatch.CurrentOperatorId != that.HandleList[5].reviewerId &&
            (that.prodBatch.AuditStatus == 2 || that.prodBatch.AuditStatus == 1)
          ) {
            that.HandleList[5].disabled = true;
          }
          for (var i = 1; i < that.HandleList.length; i++) {
            if (flag) {
              if (
                that.prodBatch.CurrentOperatorId == that.HandleList[i].reviewerId
              ) {
                if (
                  that.HandleList[0].opinion == null ||
                  that.HandleList[0].treatmentType == null
                ) {
                  that.submDataButton = false;
                  this.$Notice.warning({
                    title: i18n.t('oqc.auditFirst'),
                    desc: ""
                  });
                  break;
                }
              }
            }
          }
          if (
            that.prodBatch.AuditStatus == 1 &&
            that.HandleList[5].treatmentType != null &&
            that.HandleList[5].reviewerId != that.prodBatch.CurrentOperatorId
          ) {
            that.submDataButton = false;
          }
          if(that.HandleList[5].reviewerId == that.prodBatch.CurrentOperatorId&&that.HandleList[5].treatmentType!=null){
            that.HandleList[5].disabled = false;
          }
          if (that.prodBatch.AuditStatus == 3) {
            that.submDataButton = false;
          }
          if (
            that.prodBatch.AuditStatus == 2 &&
            that.HandleList[5].reviewerId != that.prodBatch.CurrentOperatorId
          ) {
            that.submDataButton = false;
          }
          //显示编辑状态下的时间
          for (var i = 0; i < that.HandleList.length; i++) {
            if (!that.HandleList[i].disabled) {
              that.HandleList[i].dataTime = new Date();
            }
          }

          // 以上部分可以考虑隐藏,以下部分为重塑出货检验流程的代码
          that.HandleList = res.data;
          //console.log(res.data, 1212)
          let handlers = []
          for (var i = 0; i < 6; i++) {
            handlers.push(that.HandleList[i].reviewerId)
          }
          //若第1部分未审核
          // if (!that.HandleList[0].treatmentType||!that.HandleList[0].opinion) {
          // 审核处理方式未填写即为未审核
          if (!that.HandleList[0].treatmentType) {
            if (that.prodBatch.CurrentOperatorId == that.HandleList[0].reviewerId) {//若当前是审核人
              that.submDataButton = true;
              for (var i = 0; i < that.HandleList.length; i++) {
                  that.HandleList[i].disabled = true;
                  that.HandleList[0].disabled = false;
              }
            } else {
              that.submDataButton = false;
              for (var i = 0; i < that.HandleList.length; i++) {
                  that.HandleList[i].disabled = true;
              }
              that.$Notice.warning({
                title: i18n.t('oqc.auditFirst'),
                desc: ''
              });
            }
          }
          // 若第1部分已审核，第6部分未判定
          // else if ((that.HandleList[0].treatmentType||that.HandleList[0].opinion) && (!that.HandleList[5].treatmentType&&!that.HandleList[5].opinion)) {
          // 审核处理方式已填写且判定处理方式未填写即为已审核
          else if (that.HandleList[0].treatmentType && !that.HandleList[5].treatmentType) {
            for (let i in that.HandleList) {
              if (that.HandleList[i].reviewerId==that.prodBatch.CurrentOperatorId) {//若是流程中的人
                that.HandleList[i].disabled = false;
              } else {
                that.HandleList[i].disabled = true;
              }
            }
            if (handlers.indexOf(that.prodBatch.CurrentOperatorId) !== -1) {//按钮
              that.submDataButton = true;
            } else {
              that.submDataButton = false;
            }
            
          }
          //若第6部分已判定
          // else if (that.HandleList[5].treatmentType||that.HandleList[5].opinion) {
          // 判定处理方式已填写即为已判定
          else if (that.HandleList[5].treatmentType) {
            if (that.prodBatch.CurrentOperatorId == that.HandleList[5].reviewerId) {//若是判定人
              that.submDataButton = true;
              for (var i = 0; i < that.HandleList.length; i++) {
                  that.HandleList[i].disabled = true;
                  that.HandleList[5].disabled = false;
              }
            } else {
              that.submDataButton = false;
              for (var i = 0; i < that.HandleList.length; i++) {
                  that.HandleList[i].disabled = true;
              }
            }
            if(that.reviewState==4){
              that.HandleList[5].disabled=true;
              that.submDataButton = false;
            }
          }
          for (var i = 0; i < that.HandleList.length; i++) {
            if(that.HandleList[i].disabled==false){
              //console.log(that.HandleList[i].dataTime)
              that.HandleList[i].dataTime=that.HandleList[i].reviewTime?new Date(that.HandleList[i].reviewTime):new Date();
            }else{
              that.HandleList[i].dataTime=that.HandleList[i].reviewTime?new Date(that.HandleList[i].reviewTime):'';
            }
          }
        });
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
      //计算不良率
      BadNumber() {
        let that = this;
        if (
          that.ruleForm.badQuantity == "" ||
          that.ruleForm.sampleQuantity == ""
        ) {
          that.ruleForm.badRate = "0";
        } else {
          that.ruleForm.badRate =
            Math.round(
              that.ruleForm.badQuantity / that.ruleForm.sampleQuantity * 100
            ) / 100;
        }
      },
      closePage() {
        this.$store.commit("RENDER_CHANGE", true);
        this.$emit("close-tab", this.$props.tabKey);
      },
      reviewProcessBtn(val) {
        let that = this;
        if (val === that.prodBatch.reviewProcessIndex) {
          that.prodBatch.reviewProcessstate = true;
        } else {
          that.prodBatch.reviewProcessstate = false;
        }
      },
      
      //数据提交
      submData() {
        let that = this;
        for (let i = 0; i < that.HandleList.length; i++) {
          if (!that.HandleList[i].disabled && !that.HandleList[i].treatmentType) {
            that.$Notice.warning({title: i18n.t('oqc.methodNotNull')});
            return;
            break;
          }
          let state = true;
          state = that.$iqis.utils.formValidate('Word600', i18n.t('oqc.opinion'), that.HandleList[i].opinion, (tips) => {
            that.$Notice.warning({title: tips})
          })
          if (!state) {
            return;
          }
        }
        let resp = that.$iqis.utils.syncget('/examinecenter/oqc/oqcdetail/'+that.prodBatch.oqcId);
        if(resp.data.oqcItem.state==0||resp.data.oqcItem.state==3){
          that.$Notice.warning({title:i18n.t('oqc.rejectStopReview')})
          that.refreshData(that.oqcId)
          return;
        }
        let resp2 = that.$iqis.utils.syncget('/examinecenter/oqc/reviewrecord/'+that.prodBatch.oqcId); 
        if(that.HandleList[5].disabled&&(resp2.data[5].opinion||resp2.data[5].treatmentType)){
          that.$Notice.warning({title:i18n.t('oqc.judgeStopReview')})
          that.refreshData(that.oqcId)
          return;
        }   
        // if (this.checkBadQuantity()) {
        //   return;
        // }
        
        // if (this.ruleForm.badQuantity == ""){
        //   this.$Notice.warning({ title: "不良数不能为空！" });
        //   return true;
        // } else
        // if(!this.ruleForm.badQuantity&&this.ruleForm.badQuantity!=0){
        //     this.$Notice.warning({
        //           title: '不良数不能为空',
        //           desc: ''
        //         });
        //     return;
        // }
        // if(!this.ruleForm.sampleQuantity){
        //     this.$Notice.warning({
        //           title: '实际抽样数必须是0以上的数字',
        //           desc: ''
        //         });
        //     return;
        // }
        //  if (this.ruleForm.sampleQuantity == ""){
        //   this.$Notice.warning({ title: "缺陷数不能为空！" });
        //   return true;
        // }

        //    	that.ReviewState()
        if (that.prodBatch.Success == false) {
          for (let i = 0; i < that.HandleList.length; i++) {
            that.HandleList[i].reviewTime = (new Date(
              that.HandleList[i].dataTime
            )).getTime();
          }
          let url = "/examinecenter/oqc/reviewrecord?oqcId=";
          that.$http
            .put(url + that.prodBatch.oqcId, that.HandleList, that.headers)
            .then(res => {
              that.$Message.success(i18n.t('oqc.commitSuccess'));
              this.$store.commit("RENDER_CHANGE", true);
              this.$emit("close-tab", this.$props.tabKey);
              //    		this.$emit("open-tab","exam-oqc-list","来料检验","page-exam-oqc-list",null);
            });
        }
      },
      //数据提交
      submitBtn() {
        let that = this;
        // if (this.checkBadQuantity()) {
        //   return;
        // }
        let params = [
          {type: 'Empty', title: i18n.t('oqc.orderNo'), value: that.ruleForm.orderNo},
          {type: 'No', title: i18n.t('oqc.orderNo'), value: that.ruleForm.orderNo},
          {type: 'Empty', title: i18n.t('oqc.orderNum'), value: that.ruleForm.totalQuantity},
          {type: 'NumNot0', title: i18n.t('oqc.orderNum'), value: that.ruleForm.totalQuantity},
          // {type: 'Empty', title: i18n.t('oqc.customer'), value: that.ruleForm.customerId},
          {type: 'No', title: i18n.t('oqc.customerProdNo'), value: that.ruleForm.customerProductNo},
          {type: 'Empty', title: i18n.t('oqc.productNo'), value: that.ruleForm.productId},
          {type: 'No', title: i18n.t('oqc.productNo'), value: that.ruleForm.productId},
          {type: 'Empty', title: i18n.t('oqc.quantity'), value: that.ruleForm.oqcQuantity},
          {type: 'NumNot0', title: i18n.t('oqc.quantity'), value: that.ruleForm.oqcQuantity},
          {type: 'Empty', title: i18n.t('oqc.workTime'), value: that.ruleForm.chkShiftId},
          {type: 'Empty', title: i18n.t('oqc.oqcNo'), value: that.ruleForm.oqcNo},
          {type: 'No', title: i18n.t('oqc.oqcNo'), value: that.ruleForm.oqcNo},
          {type: 'Empty', title: i18n.t('oqc.time'), value: that.ruleForm.DataTime},
          {type: 'NumAllNot0', title: i18n.t('oqc.sampleNum'), value: that.ruleForm.sampleQuantity},
          {type: 'Num', title: i18n.t('oqc.badNum'), value: that.ruleForm.badQuantity},
        ]
        let state = true;
        /* if (that.ruleForm.result == 0) {
          params.push({type: 'Empty', title: i18n.t('oqc.reviewTeam'), value: that.ruleForm.reviewProcessId})
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
        // if (parseInt(that.ruleForm.oqcQuantity) > parseInt(that.ruleForm.totalQuantity)) {
        //   that.$Notice.warning({
        //     title: '订单数不能大于出货数！',
        //   });
        //   return;
        // }
        // if (parseInt(that.ruleForm.sampleQuantity) > parseInt(that.ruleForm.oqcQuantity)) {
        //   that.$Notice.warning({
        //     title: '实际抽样数不能大于出货数！',
        //   });
        //   return;
        // }
        /* for(let i in that.oqcParams){
          for(let j in that.oqcParams[i].paramValueArray){
            let paramsOqcParams = [
              {type: 'NumAll', title: i18n.t('oqc.paramsRecord'), value: that.oqcParams[i].paramValueArray[j]},
            ]
            let state = true;
            for (let i in paramsOqcParams) {
              state = that.$iqis.utils.formValidate(paramsOqcParams[i].type, paramsOqcParams[i].title, paramsOqcParams[i].value, (tips) => {
                that.$Notice.warning({title: tips})//,duration: 0
              })
              if (!state) {
                return;
                break;
              }
            }
          }
        } */
        for (let i = 0; i < that.oqcDefects.length; i++) {
          // if (that.oqcDefects[i].inspectionTypeId == '' || that.oqcDefects[i].defectTypeId == '' || that.oqcDefects[i].qltyLvId == '' || that.oqcDefects[i].chkDevId == '' || that.oqcDefects[i].sampleQuantity === '' || that.oqcDefects[i].defectCount === '') {
          if (that.oqcDefects[i].inspectionTypeId == '' || that.oqcDefects[i].defectTypeId == '' || that.oqcDefects[i].sampleQuantity === '' || that.oqcDefects[i].defectCount === '') {
            // if (that.oqcDefects[i].inspectionTypeId == '' && that.oqcDefects[i].defectTypeId === '' && that.oqcDefects[i].qltyLvId === '' && that.oqcDefects[i].chkDevId == '' && that.oqcDefects[i].sampleQuantity === '' && that.oqcDefects[i].defectCount === '') {
            //   that.$Notice.warning({title: '请删除空白缺陷记录'});
            //   return;
            // } else {
              that.$Notice.warning({title: '请填写第'+ ( i + 1 ) +'缺陷记录'});
              return;
            // }
          }
          let paramsDefects = [
            {type: 'NumNot0', title: i18n.t('oqc.sampleQuantity'), value: that.oqcDefects[i].sampleQuantity},
            {type: 'Num', title: i18n.t('oqc.defectNum'), value: that.oqcDefects[i].defectCount},
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
          // that.oqcDefects[i].abnormalId=that.abnormalId;

        }
        
        for (let i = 0; i < that.oqcDefects.length; i++) {
          if (that.oqcDefects[i].defectLocId == i18n.t('Unlimited')) {
            that.oqcDefects[i].defectLocId = '';
          }
          if (that.oqcDefects[i].chkDevId == i18n.t('Unlimited')) {
            that.oqcDefects[i].chkDevId = '';
          }
        }
        let Success = true;
        let url = "/examinecenter/oqc/oqc/applyaudit?oqcId=";

        if (Success == true) {
          if (that.prodBatch.oqcId == "") {
            this.saveAndCommit();
          } else {
            this.saveAndCommit();
          }
        }
      },
      //数据保存
      save() {
        let that = this;
        let params = [
          {type: 'Empty', title: i18n.t('oqc.orderNo'), value: that.ruleForm.orderNo},
          {type: 'No', title: i18n.t('oqc.orderNo'), value: that.ruleForm.orderNo},
          {type: 'Empty', title: i18n.t('oqc.orderNum'), value: that.ruleForm.totalQuantity},
          {type: 'NumNot0', title: i18n.t('oqc.orderNum'), value: that.ruleForm.totalQuantity},
          // {type: 'Empty', title: i18n.t('oqc.customer'), value: that.ruleForm.customerId},
          {type: 'No', title: i18n.t('oqc.customerProdNo'), value: that.ruleForm.customerProductNo},
          {type: 'Empty', title: i18n.t('oqc.productNo'), value: that.ruleForm.productId},
          {type: 'No', title: i18n.t('oqc.productNo'), value: that.ruleForm.productId},
          {type: 'Empty', title: i18n.t('oqc.quantity'), value: that.ruleForm.oqcQuantity},
          {type: 'NumNot0', title: i18n.t('oqc.quantity'), value: that.ruleForm.oqcQuantity},
          {type: 'Empty', title: i18n.t('oqc.workTime'), value: that.ruleForm.chkShiftId},
          {type: 'Empty', title: i18n.t('oqc.oqcNo'), value: that.ruleForm.oqcNo},
          {type: 'No', title: i18n.t('oqc.oqcNo'), value: that.ruleForm.oqcNo},
          {type: 'Empty', title: i18n.t('oqc.time'), value: that.ruleForm.DataTime},
        ]
        let state = true;
        /* if (that.ruleForm.result == 0) {
          params.push({type: 'Empty', title: i18n.t('oqc.reviewTeam'), value: that.ruleForm.reviewProcessId})
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
        // if(Number(that.ruleForm.sampleQuantity)>Number(that.ruleForm.oqcQuantity)){
        //   that.$Notice.warning({title:'实际抽样数不能大于出货数量'})
        //   return;
        // }
        /* for(let i in that.oqcParams){
          for(let j in that.oqcParams[i].paramValueArray){
            let paramsOqcParams = [
              {type: 'NumAll', title: i18n.t('oqc.paramsRecord'), value: that.oqcParams[i].paramValueArray[j]},
            ]
            let state = true;
            for (let i in paramsOqcParams) {
              state = that.$iqis.utils.formValidate(paramsOqcParams[i].type, paramsOqcParams[i].title, paramsOqcParams[i].value, (tips) => {
                that.$Notice.warning({title: tips})//,duration: 0
              })
              if (!state) {
                return;
                break;
              }
            }
          }
        } */
        // for (let i = 0; i < that.oqcDefects.length; i++) {
        //   if (that.oqcDefects[i].inspectionTypeId == '' || that.oqcDefects[i].defectTypeId == '' || that.oqcDefects[i].sampleQuantity === '' || that.oqcDefects[i].defectCount === '') {
        //     // if (that.oqcDefects[i].inspectionTypeId == '' && that.oqcDefects[i].defectTypeId === '' && that.oqcDefects[i].qltyLvId === '' && that.oqcDefects[i].chkDevId == '' && that.oqcDefects[i].sampleQuantity === '' && that.oqcDefects[i].defectCount === '') {
        //     //   that.$Notice.warning({title: '请删除空白缺陷记录'});
        //     //   return;
        //     // } else {
        //       that.$Notice.warning({title: i18n.t('oqc.pleaseInput')+ i18n.t('oqc.defectRecord') + ( i + 1 )});              
        //       return;
        //     // }
        //   }
        //   let paramsDefects = [
        //     {type: 'NumNot0', title: i18n.t('oqc.sampleQuantity'), value: that.oqcDefects[i].sampleQuantity},
        //     {type: 'Num', title: i18n.t('oqc.defectNum'), value: that.oqcDefects[i].defectCount},
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

        //   // that.oqcDefects[i].abnormalId=that.abnormalId;

        // }
        for(let i = 0; i < that.oqcDefects.length; i++){
          if (that.oqcDefects[i].defectLocId == i18n.t('Unlimited')) {
            that.oqcDefects[i].defectLocId = '';
          }
          if (that.oqcDefects[i].chkDevId == i18n.t('Unlimited')) {
            that.oqcDefects[i].chkDevId = '';
          }
        }
        // if(!this.ruleForm.sampleQuantity){
        //     this.$Notice.warning({
        //           title: '实际抽样数必须是0以上的数字',
        //           desc: ''
        //         });
        //     return;
        // }
        // if(!this.ruleForm.badQuantity&&this.ruleForm.badQuantity!=0){
        //     this.$Notice.warning({
        //           title: '不良数不能为空',
        //           desc: ''
        //         });
        //     return;
        // }
        // if(Number(that.ruleForm.badQuantity)>Number(that.ruleForm.sampleQuantity)){
        //   that.$Notice.warning({title:'不良数不能大于实际抽样数'})
        //   return;
        // }
        // if (this.checkBadQuantity()) {
        //   return;
        // }

        let url = "/examinecenter/oqc/oqcdetail?type=save";
        let Success = true;
        if (Success == true) {
          var oldTime = new Date(that.ruleForm.DataTime).getTime();
          that.ruleForm.createTime = oldTime;
          if(that.copy=='copy'){
            that.prodBatch.oqcId=null;
            that.prodBatch.btnState = 'post'
            for(let i in that.oqcDefects){
              that.oqcDefects[i].defectRecordId=null
              for(let j in that.oqcDefects[i].extInfoList){
                that.oqcDefects[i].extInfoList[i].iqcDefectrecordExtInfoId=null
              }
            }
          }
          if (this.checkOqcNoRep()) {
            return;
          }
          let oqcParams = []
          // for(let i in that.oqcParams){
          //   let values = this.paramValuearray[i]
          //   let item = {
          //     paramInfo:that.oqcParams[i],
          //     paramId:that.oqcParams[i].prodChkParamId||'',
          //     paramValueArray:values||[],
          //     chkDevId:that.oqcParams[i].chkDevId||''
          //   }
          //   oqcParams.push(item)
          // }
          for(let i in that.oqcParams){
            let values = this.paramValuearray[i]
            let item = {
              // paramInfo:that.oqcParams[i],
              // paramId:that.oqcParams[i].prodChkParamId||'',
              chkDevId:that.oqcParams[i].chkDevId||'',
              chkDevName:that.oqcParams[i].chkDevName || '',
              paramValueArray:values||[],
              inspectionTypeId:that.oqcParams[i].inspectionTypeId|| '',
              measUnitId:that.oqcParams[i].measUnitId||'',
              usl:that.oqcParams[i].usl||'',
              sl:that.oqcParams[i].sl||'',
              lsl:that.oqcParams[i].lsl||'',
              wll:that.oqcParams[i].wll||'',
              wul:that.oqcParams[i].wul||'',
              scale:that.oqcParams[i].scale||'',
              currentAndParentName:that.oqcParams[i].currentAndParentName||""
            }
            oqcParams.push(item)
          }
          let parmas = {
            defectRecordList: that.oqcDefects,
            oqcItem: that.ruleForm,
            paramRecordList: oqcParams,
            oqcPropertyRecordList:that.oqcPropertyRecordList
          };
          /* for(let i = 0; i <parmas.paramRecordList.length; i++){
            let values = this.paramValuearray[i]
            parmas.paramRecordList[i].paramValueArray = values || []
            parmas.paramRecordList[i].paramId = parmas.paramRecordList[i].prodChkParamId
          } */
          console.log(parmas,111111111111);
          
          //console.log(parmas.oqcItem.batchNo)
          if(typeof(parmas.oqcItem.batchNo) === 'object'){
            parmas.oqcItem.batchNo= parmas.oqcItem.batchNo.join(",");
          }
          
          if (that.prodBatch.btnState == "put") {
            that.$http
              .put("/examinecenter/oqc/oqcdetail?type=save", parmas, that.headers)
              .then(res => {
                that.$Message.success(i18n.t('oqc.editSuccess'));
                // that.oqcItem.batchNo= parmas.oqcItem.batchNo.split(",");
                for (let i = 0; i < that.oqcDefects.length; i++) {
                  if (!that.oqcDefects[i].defectLocId) {
                    that.oqcDefects[i].defectLocId = i18n.t('Unlimited');
                  }
                  if (!that.oqcDefects[i].chkDevId) {
                    that.oqcDefects[i].chkDevId = i18n.t('Unlimited');
                  }
                }
                that.closePage();
                that.$emit("open-tab", "exam-oqc-abnormal-" + that.prodBatch.oqcId, i18n.t('oqc.editOqc') + '-' + res.data.oqcItem.productInfo.name, "page-exam-oqc-add-update", {oqcId: that.prodBatch.oqcId});
              });
          } else if (that.prodBatch.btnState == "post") {
            that.$http.post("/examinecenter/oqc/oqcdetail?type=save", parmas, that.headers).then(res => {
              that.prodBatch.oqcId = res.data.oqcItem.oqcId;
              that.ruleForm.oqcId = res.data.oqcItem.oqcId;
              that.prodBatch.btnState = "put";
              that.$Message.success(i18n.t('oqc.addSuccess'));
              for (let i = 0; i < that.oqcDefects.length; i++) {
                if (!that.oqcDefects[i].defectLocId) {
                  that.oqcDefects[i].defectLocId = i18n.t('Unlimited');
                }
                if (!that.oqcDefects[i].chkDevId) {
                  that.oqcDefects[i].chkDevId = i18n.t('Unlimited');
                }
              }
              that.closePage();
              that.$emit("open-tab", "exam-oqc-abnormal-" + that.prodBatch.oqcId, i18n.t('oqc.editOqc') + '-' + res.data.oqcItem.productInfo.name, "page-exam-oqc-add-update", {oqcId: that.prodBatch.oqcId});
            });
          }
        }
      },
      //解决 检验结果保存为不合格，在保存为合格之后的bug
      consequence(reustlt) {
        if (reustlt == 1) {
          this.ruleForm.reviewProcessId = "";
        }
      },
      //保存和提交
      saveAndCommit() {
        let that = this;
        let url = "/examinecenter/oqc/oqcdetail";
        let Success = true;
        if (Success == true) {
          var oldTime = new Date(that.ruleForm.DataTime).getTime();
          that.ruleForm.createTime = oldTime;
          if(that.copy=='copy'){

            that.prodBatch.btnState = 'post'
            that.prodBatch.oqcId=null;
            for(let i in that.oqcDefects){
              that.oqcDefects[i].defectRecordId=null
              for(let j in that.oqcDefects[i].extInfoList){
                that.oqcDefects[i].extInfoList[i].iqcDefectrecordExtInfoId=null
              }
            }
          }
          if (this.checkOqcNoRep()) {
            return;
          }
          let oqcParams = []
          for(let i in that.oqcParams){
            let values = this.paramValuearray[i]
            let item = {
              // paramInfo:that.oqcParams[i],
              // paramId:that.oqcParams[i].prodChkParamId||'',
              chkDevId:that.oqcParams[i].chkDevId||'',
              chkDevName:that.oqcParams[i].chkDevName || '',
              paramValueArray:values||[],
              inspectionTypeId:that.oqcParams[i].inspectionTypeId|| '',
              measUnitId:that.oqcParams[i].measUnitId||'',
              usl:that.oqcParams[i].usl||'',
              sl:that.oqcParams[i].sl||'',
              lsl:that.oqcParams[i].lsl||'',
              wll:that.oqcParams[i].wll||'',
              wul:that.oqcParams[i].wul||'',
              scale:that.oqcParams[i].scale||''
            }
            oqcParams.push(item)
          }
          // for(let i in that.oqcParams){
          //   let values = this.paramValuearray[i]
          //   let item = {
          //     paramInfo:that.oqcParams[i],
          //     paramId:that.oqcParams[i].prodChkParamId||'',
          //     paramValueArray:values||[],
          //     chkDevId:that.oqcParams[i].chkDevId||''
          //   }
          //   oqcParams.push(item)
          // }
          let parmas = {
            defectRecordList: that.oqcDefects,
            oqcItem: that.ruleForm,
            paramRecordList: oqcParams,
            // batchNo: that.ruleForm.batchNo
            oqcPropertyRecordList:that.oqcPropertyRecordList
          };
          // for(let i = 0; i <parmas.paramRecordList.length; i++){
          //   let values = this.paramValuearray[i]
          //   parmas.paramRecordList[i].paramValueArray = values || []
          //   parmas.paramRecordList[i].paramId = parmas.paramRecordList[i].prodChkParamId
          // }
          if(typeof(parmas.oqcItem.batchNo) === 'object'){
            // alert(typeof(parmas.oqcItem.batchNo))
            parmas.oqcItem.batchNo= parmas.oqcItem.batchNo.join(",");
          }

          if (that.prodBatch.btnState == "put") {
            that.$http.put(url, parmas, that.headers).then(res => {
              //that.$Message.success("数据修改成功");
              that.$http
                .post(
                  "/examinecenter/oqc/oqc/applyaudit?oqcId=" +
                  that.prodBatch.oqcId
                )
                .then(res => {
                  that.$Message.success(i18n.t('oqc.commitSuccess'));
                  this.$store.commit("RENDER_CHANGE", true);
                  this.$emit("close-tab", this.$props.tabKey);
                  //    		this.$emit("open-tab","exam-oqc-list","来料检验","page-exam-oqc-list",null);
                });
              this.$store.commit("RENDER_CHANGE", true);
              this.$emit("close-tab", this.$props.tabKey);
            });
          } else if (that.prodBatch.btnState == "post") {
            that.$http.post(url, parmas, that.headers).then(res => {
              that.prodBatch.oqcId = res.data.oqcItem.oqcId;

              that.$http
                .post(
                  "/examinecenter/oqc/oqc/applyaudit?oqcId=" +
                  that.prodBatch.oqcId
                )
                .then(res => {
                  that.$Message.success(i18n.t('oqc.commitSuccess'));
                  this.$store.commit("RENDER_CHANGE", true);
                  this.$emit("close-tab", this.$props.tabKey);
                  //    		this.$emit("open-tab","exam-oqc-list","来料检验","page-exam-oqc-list",null);
                });
            });
          }
        }
      },
      ProcessingPublic() {
        let that = this;
        for (let i = 0; i < that.HandleList.length; i++) {
          that.HandleList[i].reviewTime = new Date(
            that.HandleList[i].dataTime
          ).getTime();
        }
        let url = "/examinecenter/oqc/reviewrecord?oqcId=";
        that.$http
          .put(url + that.prodBatch.oqcId, that.HandleList, that.headers)
          .then(res => {
            that.$Message.success(i18n.t('oqc.commitSuccess'));
            this.$store.commit("RENDER_CHANGE", true);
            this.$emit("close-tab", this.$props.tabKey);
          });
      },

      //判断检验单号是否重复
      checkOqcNoRep() {
        let that = this;
        for (var i = 0; i < that.prodBatch.oqcList.length; i++) {
          if (that.ruleForm.oqcNo == that.prodBatch.oqcList[i].oqcNo) {
            if (this.prodBatch.oqcId != that.prodBatch.oqcList[i].oqcId) {
              that.$Notice.error({
                title: i18n.t('tips'),
                desc: i18n.t('oqc.qcNoRepeat')
              });
              return true;
            }
          }
        }
      },
      //获取出货检验列表
      getOqcList() {
        let that = this;
        let url = "/examinecenter/oqc/oqc?page=1&limit=99999";
        that.$http.get(url).then(res => {
          that.prodBatch.oqcList = res.data;
        });
      }

      //         handleView (name) {
      //              this.imgName = name;
      //              this.visible = true;
      //          },
      //          handleRemove (file) {
      //              // 从 upload 实例删除数据
      //              const fileList = this.$refs.upload.fileList;
      //              this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      //          },
      //          handleSuccess (response, file, fileList) {
      //              // 因为上传过程为实例，这里模拟添加 url
      //              file.url ="C:/Users/iqis/Desktop/" + file.name;
      //              file.name = '毛';
      //          },
      //          handleFormatError (file) {
      //              this.$Notice.warning({
      //                  title: '文件格式不正确',
      //                  desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
      //              });
      //          },
      //          handleMaxSize (file) {
      //              this.$Notice.warning({
      //                  title: '超出文件大小限制',
      //                  desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      //              });
      //          },
      //          handleBeforeUpload () {
      //              const check = this.uploadList.length < 5;
      //              if (!check) {
      //                  this.$Notice.warning({
      //                      title: '附件数量不能大于5。'
      //                  });
      //              }
      //              return check;
      //          }
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
            /* let x = (
              this.ruleForm.badQuantity /
              this.ruleForm.sampleQuantity *
              100
            ).toFixed(2); */
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
        if (this.ruleForm.badQuantity == 0) {
          return 1;
        } else {
          return 0;
        }
      },
      picBtnShow(){
        if(!this.dbd12&&!this.noPermsDis){
          return true
        }else{
          return false
        }
      }
    }
    //      mounted () {
    //          this.uploadList = this.$refs.upload.fileList;
    //      }
  };
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
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
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
    background: rgba(0, 0, 0, 0.6);
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

  .pdg {
    /* height: 54px !important; */
    padding: 0 16px !important;
    color: red;
  }

</style>
<style>
  .oqcParamTable tbody td:nth-child(n+9) div {
    height: inherit !important;
    width: inherit !important;
    padding: 0 !important;
  }

  .oqcParamTable .ivu-input {
    height: 100%;
    background: transparent;
    border: 0;
    color: inherit;
  }
</style>
