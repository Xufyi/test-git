<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t("pqc.basicInformation")}}
      </div>

      <div class="iqis-page-block-body"> 
        <Row type="flex" :gutter="25">
          <!-- 产品编号 -->
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.pn")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :label="pqcFirstRecordDto.no" filterable remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pleaseChoose')" :disabled="sub2||noPermsDis" v-model="pqcFirstRecordDto.productId" @on-change="getProductName(pqcFirstRecordDto.productId)">
                <Option v-for="(data,index) in productList" :key="index" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <!-- 产品名称 -->
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.name")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  disabled v-model="pqcFirstRecordDto.productName" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <!-- 规格型号 -->
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.specifications")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  disabled :value="pqcFirstRecordDto.spec" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <!-- 产品类别 -->
          <i-col span="6">  
            <div class="iqis-page-block-label">{{$t("pqc.pc")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  disabled :value="prodTypeId" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <!-- 产品批号 -->
         <i-col span="6">
            <div class="iqis-page-block-label">{{$t("menus.productBatch")}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input v-model="pqcFirstRecordDto.prodBatchNo"   style="width: 100%;" :maxlength=50 :disabled="sub2||noPermsDis">
                </i-input>
              </div>
          </i-col> 

          <!-- 批量数 -->
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.bn")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="pqcFirstRecordDto.batchQuantity"   @on-blur="getAql()" style="width: 100%;" :maxlength=9 :disabled="sub2||noPermsDis">
              </i-input>
            </div>
          </i-col>

          <!-- 首件数量 -->
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.FirstItemQuantity')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="pqcFirstRecordDto.firstQuantity"   @on-blur="firstRecordNo()" style="width: 100%;" :maxlength=9 :disabled="sub2||noPermsDis">
              </i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24">
          <!-- 生产线别 -->
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.pl")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="pqcFirstRecordDto.prodLineId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="sub2||noPermsDis">
                <Option v-for="item in selects.prodLineList" :value="item.prodLineId" :key="item.prodLineId">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>

          <!-- 生产工序站点 -->
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.pps")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="pqcFirstRecordDto.prodProcessId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="sub2||noPermsDis" @on-change="generateParam(pqcFirstRecordDto.prodProcessId)">
                <Option v-for="item in selects.prodProcessList" :value="item.prodProcessId" :key="item.itemIndex+''+item.prodProcessId">{{ item.prodProcessName }}</Option>
              </Select>
            </div>
          </i-col>
          <!-- 检验员 -->
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.inspector")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="pqcFirstRecordDto.inspectorId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="sub2||noPermsDis">
                <Option v-for="item in selects.userList" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
              </Select>
            </div>

          </i-col>
          <!-- 时间 -->
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.time")}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker type="datetime" v-model="pqcFirstRecordDto.createTime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('pqc.pst')" style="width: 100%" :disabled="sub2||noPermsDis"></DatePicker>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24">
            <!-- 检验说明 -->
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t("pqc.qcExplain")}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" :placeholder="i18n.t('pqc.pe')" v-model="pqcFirstRecordDto.inspectExplain" :disabled="sub2||noPermsDis" style="width: 100%;"></i-input>
              </div>
            </i-col>
          </Row>
          <Row type="flex" :gutter="24">
          <i-col span="24">
           <div class="iqis-page-block-title">{{$t('pqc.ProductAccessories')}}</div>
           <dragImageView :productId="pqcFirstRecordDto.productId"></dragImageView>
          </i-col>
        </Row>
        <!-- <div style="margin-top:20px;background-color: #fafafa;padding: 24px 24px 4px 24px;">
          <table class="tt-tip-table" style="width: 100%;">
            <tr>
              <td style="width: 33%;"> -->
                <!-- 抽样方案 -->
                <!-- <div class="tt-tip-row">
                  <span class="tt-tip-label">{{$t("pqc.samplingPlan")}}：</span>
                  <span v-if="sampling.plan=='105E'">{{$t("pqc.s105e")}}</span>
                  <span v-if="sampling.plan=='Z1-4'">{{$t("pqc.z14")}}</span>
                  <span v-if="sampling.plan=='0D'">{{$t("pqc.zod")}}</span>
                  <span v-if="sampling.plan=='GB/T2828.1-2012'">{{$t("pqc.gb")}}</span>
                  <span v-if="sampling.plan=='full'">{{$t('product.fullSampling')}}</span>
                  <span v-if="sampling.plan=='percent'">{{$t('product.percentSampling')}}</span>
                </div> -->
                <!-- 检验水准 -->
                <!-- <div class="tt-tip-row"><span class="tt-tip-label">{{$t("pqc.inspectionStandard")}}：</span>
                  <span v-if="sampling.plan=='0D'&&sampling.level==1">{{$t("pqc.zd")}}</span>
                  <span v-else-if="sampling.plan=='percent'">{{sampling.level+"%"}}</span>
                  <span v-else-if="sampling.level==1">{{$t("pqc.cl1")}}</span>
                  <span v-else-if="sampling.level==2">{{$t("pqc.cl2")}}</span>
                  <span v-else-if="sampling.level==3">{{$t("pqc.cl3")}}</span>
                  <span v-else-if="sampling.level==101">{{$t("pqc.sls1")}}</span>
                  <span v-else-if="sampling.level==102">{{$t("pqc.sls2")}}</span>
                  <span v-else-if="sampling.level==103">{{$t("pqc.sls3")}}</span>
                  <span v-else-if="sampling.level==104">{{$t("pqc.sls4")}}</span>
                  <span v-else-if="!sampling.level">-</span>

                </div> -->
                <!-- 宽严准则 -->
                <!-- <div class="tt-tip-row"><span class="tt-tip-label">{{$t("pqc.staus")}}：</span>
                  <span v-if="sampling.rule=='NORMAL'">{{$t("pqc.normal")}}</span>
                  <span v-if="sampling.rule=='SOFTEN'">{{$t("pqc.normal")}}</span>
                  <span v-if="sampling.rule=='STRICTER'">{{$t("pqc.strict")}}</span>
                  <span v-else-if="!sampling.rule">-</span>
                </div> -->
                <!-- 抽样数量 -->
                <!-- <div class="tt-tip-row"><span class="tt-tip-label">{{$t("pqc.nos")}}：</span>{{sampling.samplingCount}}</div>
              </td>
              <td style="width: 33%;">
                <div class="tt-tip-row">
                  <span class="tt-tip-text"></span><span class="tt-tip-text">AQL</span>
                  <span class="tt-tip-text">AC</span><span class="tt-tip-text">RE</span>
                </div>
                <div class="tt-tip-row">
                  <span class="tt-tip-text">{{$t('pqc.serious')}}</span><span class="tt-tip-text">{{sampling.crAql}}</span>
                  <span class="tt-tip-text">{{sampling.crAC}}</span><span class="tt-tip-text">{{sampling.crRE}}</span>
                </div>
                <div class="tt-tip-row">
                  <span class="tt-tip-text">{{$t('pqc.main')}}</span><span class="tt-tip-text">{{sampling.majAql}}</span>
                  <span class="tt-tip-text">{{sampling.majAC}}</span><span class="tt-tip-text">{{sampling.majRE}}</span>
                </div>
                <div class="tt-tip-row">
                  <span class="tt-tip-text">{{$t('pqc.slight')}}</span><span class="tt-tip-text">{{sampling.minAql}}</span>
                  <span class="tt-tip-text">{{sampling.minAC}}</span><span class="tt-tip-text">{{sampling.minRE}}</span>
                </div>
              </td>
              <td style="width: 34%;">
                <div>
                  &nbsp;
                </div>
                <div class="tt-tip-card" v-if="sampling.extStatus != ''">
                  <div style="margin-bottom: 20px;">{{$t("pqc.prompted")}}:</div>
                  <span  v-if="sampling.extStatus==='exempted'" style="color: #418FEE;"><Icon type="ios-checkmark-outline"></Icon>{{$t("pqc.tph")}}</span>
                  <span v-if="sampling.extStatus==='pending'" style="color: red;"><Icon type="ios-checkmark-outline"></Icon>{{$t("pqc.tphr")}}</span>
                </div>
              </td>
            </tr>
          </table>
        </div> -->
      </div>
    </div>

    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t("pqc.paramsRecord")}}
      </div>
      <div class="iqis-page-block-body">
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label">{{$t("pqc.paramsTable")}}</div>
          </div>
          <div class="iqis-page-block-tools-second" style="margin-top: 6px;"> </div>
        </div>
        <!-- 参数记录 -->
        <div class="iqis-page-block-table removeBorder isborder aaa">
          <Table class="noBorder" :no-data-text="i18n.t('pqc.noData')" @on-row-click="paramslist" ref="paramTable"  id='styleTable' border stripe
                 :loading="table.param.loading" :columns="table.param.columns" :data="pqcParams" v-drag-table-column="table.param.columns">
          </Table>
        </div>
      </div>

      <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        <!-- {{$t('iqc.paramsRecord')}} -->
        {{$t('pqc.AttributeRecord')}}
      </div>
      <div class="iqis-page-block-body">
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label"><!-- {{$t('iqc.paramsTable')}} -->{{$t('pqc.AttributeInspectionRecord')}}</div>
          </div>
          <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
          </div>
        </div>
        <div class="iqis-page-block-table removeBorder">
          <!-- <Table  :no-data-text="i18n.t('noData')" ref="paramTable" class="iqis-inline-editor-table noHeight noBorder iqcParamTable" -->
          <!-- <Table  :no-data-text="i18n.t('noData')" class="height24" ref="paramTable" @on-row-click="paramslist" @on-selection-change="paramTableSelectChange" border stripe
                 :loading="table.param.loading" v-drag-table-column="table.param.columns" :columns="table.param.columns"
                 :data="iqcParams">
          </Table> -->
                                                          <!-- iqcAttribute -->
          <Table class="noBorder" v-drag-table-column="table.param.attribute" :columns="table.param.attribute " border stripe :data="attribute"></Table>
        </div>
      </div>
    </div>

      <div class="iqis-page-block">
        <!-- 缺陷記錄 -->
        <div class="iqis-page-block-title">
          {{$t("pqc.defectRecord")}}
        </div>
        <div class="iqis-page-block-body">
          <div class="iqis-page-block-tools">
            <div class="iqis-page-block-tools-primary">
              <div class="iqis-page-block-label">{{$t("pqc.defectTable")}}</div>
            </div>
            <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
              <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t("pqc.yxza")}} {{pqc.TableLength}} {{$t("pqc.xqx")}}</span>
              <!-- <span v-else class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{pqc.TableLength}} defect records have been selected</span> -->
              <Poptip
                confirm
                :title="i18n.t('pqc.dsi')"
                :ok-text='i18n.t("pqc.confirm")'
                :cancel-text='i18n.t("pqc.cancel")'
                placement="bottom-end"
                @on-ok="deleteTableSelected">
                <Button type="ghost" icon="trash-a" v-if='!sub2' :disabled="pqc.paramSelect">{{$t("pqc.delete")}}</Button>
              </Poptip>
            </div>
          </div>
          <div class="iqis-page-block-table">
            <Table :no-data-text="i18n.t('pqc.noData')" 
                   ref="paramTable" 
                   class="iqis-inline-editor-table noHeight noBorder location" 
                   @on-selection-change="defectTableSelectChange"
                   border 
                   stripe
                   :loading="table.defect.loading" 
                   v-drag-table-column="table.defect.columns" 
                   :columns="table.defect.columns" 
                   :data="pqcDefectTable" >
              <Button :disabled="sub2||noPermsDis"  @click="addDefect" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t("pqc.addDefect")}}</Button>
            </Table>
          </div>

          <Row type="flex" :gutter="24">
            <!-- 首件数量 -->
            <!-- <i-col span="4"  style="width: 20% !important;">
              <div class="iqis-page-block-label">{{$t('pqc.FirstItemQuantity')}}</div>
              <div class="iqis-page-block-ctrl">
                <InputNumber v-model="pqcFirstRecordDto.sampleQuantity"  :number="true" :placeholder="i18n.t('pqc.pe')" :disabled="sub2||noPermsDis"  style="width: 100%;" v-on:on-change ="ratechange;"></InputNumber>
              </div>
            </i-col> -->
            <!-- 不良数 -->
            <!-- <i-col span="4"  style="width: 20% !important;">
              <div class="iqis-page-block-label">{{$t("pqc.badNumber")}}</div>
              <div class="iqis-page-block-ctrl">
                <InputNumber :max="Number(pqc.sampleQuantity)" :min="0" v-model="pqcFirstRecordDto.badQuantity"  :number="true" :placeholder="i18n.t('pqc.pe')" :disabled='sub2 || pqc.sampleQuantity==""||noPermsDis'  style="width: 100%;" v-on:on-change ="ratechange;changeResult(pqcFirstRecordDto.badQuantity)"></InputNumber>
              </div>
            </i-col> -->
            <!-- 不良率 -->
            <!-- <i-col span="4"  style="width: 20% !important;">
              <div class="iqis-page-block-label">{{$t("pqc.defectRate")}}(%)</div>
              <div class="iqis-page-block-ctrl">
                <i-input  placeholder="-" :readonly="true" v-model="reckonBadRate" style="width: 100%;" :disabled="true"></i-input>
              </div>
            </i-col> -->
            <!-- 检验结果 -->
            <i-col span="4"  style="width: 20% !important;">
              <div class="iqis-page-block-label">{{$t("pqc.tr")}}</div>
              <div class="iqis-page-block-ctrl">
                <Select v-model="pqcFirstRecordDto.result" :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="sub2||noPermsDis">
                  <Option v-for="item in selects.resultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </div>
            </i-col>
            <!-- 评审流程 -->
            <i-col span="4" style="width: 20% !important;">
              <div v-if="pqcFirstRecordDto.result==0">
                <div class="iqis-page-block-label">{{$t("pqc.reviewTeam")}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select v-model="pqcFirstRecordDto.reviewProcessId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" @on-change="reviewProcessBtn(pqcFirstRecordDto.reviewProcessId)" :disabled="sub2||noPermsDis">
                    <!-- 不发起评审流程 -->
                    <!-- <Option :value="null">{{$t('noReview')}}</Option> -->
                    <Option v-for="item in selects.reviewList" :value="item.reviewProcessId" :key="item.reviewProcessId">{{ item.name }}</Option>
                  </Select>
                </div>
              </div>
            </i-col>
          </Row>
          

        </div>
      </div>

          <div class="iqis-page-block" v-if="(this.pqc.AuditStatus == 2 || this.pqc.AuditStatus == 1 )&&this.pqcFirstRecordDto.reviewProcessId">
            <div class="iqis-page-block-title">
              {{$t("pqc.treatmentRecord")}}
            </div>
            <div class="iqis-page-block-body">
              <div v-for="(items,index) in HandleList">
                <div class="review-block" >
                  <Row type="flex" :gutter="24">
                    <i-col span="4" style="width: 20% !important;">
                      <div class="iqis-page-block-label">{{$t("pqc.treatmentMethod")}}</div>
                      <div class="iqis-page-block-ctrl">
                        <Select v-model="items.treatmentType" :disabled="items.disabled||noPermsDis" filterable :placeholder="i18n.t('pqc.pleaseChoose')">
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
                        <i-input  :placeholder="i18n.t('pqc.pe')"  v-model="items.reviewer" disabled style="width: 100%;"></i-input>
                      </div>
                    </i-col>
                    <i-col span="4" style="width: 20% !important;">
                      <div class="iqis-page-block-label">{{$t("pqc.auditTime")}}</div>
                      <div class="iqis-page-block-ctrl">
                        <DatePicker type="datetime" v-model="items.dataTime" format = "yyyy-MM-dd HH:mm"  :disabled="true" :placeholder="i18n.t('pqc.pst')" style="width: 100%"></DatePicker>
                      </div>
                    </i-col>
                  </Row>
                  <Row>
                    <i-col span="24">
                      <div class="iqis-page-block-label" >{{(index == (HandleList.length-1))? i18n.t("pqc.judgeOpinion"):i18n.t("pqc.reviewOpinion") }}</div>
                      <div class="iqis-page-block-ctrl">
                        <i-input type="textarea" :placeholder="i18n.t('pqc.pe')" :rows="4" v-model="items.opinion" :disabled="items.disabled||noPermsDis"></i-input>
                      </div>
                    </i-col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
      <div v-if="reviewState==4" style="text-align:center;color:#999;font-size:16px;font-weight: bold;">{{$t("pqc.reviewProcess")}}</div>
    </div>

    <IqisAffix placement="bottom" :offset="0">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="subReview()" v-if="sub1&&permsBtn.UPDATE_PQC">{{$t("pqc.submit")}}</Button>
        <Button type="primary" @click="subBasic()" v-if="!sub2&&permsBtn.UPDATE_PQC">{{$t("pqc.submit")}}</Button>
        <Button type="primary" v-if="reviewState==3&&pqc.CurrentOperatorId == pqcFirstRecordDto.inspectorId" @click="endCase">{{$t('pqc.end')}}</Button>
        <Button type="primary" @click="save" :loading="loadStat.saveLoading" v-if="!sub2&&!noPermsDis">{{$t("pqc.save")}}</Button>
        <Button type="ghost" @click="closePage">{{$t("pqc.cancel")}}</Button>
      </div>
    </IqisAffix>
    <!--end blocks-->
    <div class="page-end" style="padding-bottom: 80px;padding-top: 30px;"></div>
    <Spin size="large" fix v-if="loadStat.pqcDataLoading || loadStat.selectsDataLoading"></Spin>

  </div>
</template>
<script>
import ICol from "iview/src/components/grid/col";
import $ from "jquery"
import SessionStorage from '@/utils/sessionStorage'
import NestedTables from '@/components/nestedTables/NestedTabels.vue'
import dragImageView from '../../../components/imageview/dragImageView'
export default {
  components: { ICol,dragImageView },
  props: ["params", "tabKey","id"],
  data() {
    let vm = this;
    return {
      ext:[],
      flag:false,//getProductName
      i18n:window.i18n,
      paramsList:null,
      locale:null,
      pqcId:"",
      pqcParamsNew:[],
      productList: [],
      "firstRecordPropertyDtos":[
        // {
        //   propertyId: 0,
        //   propertyRecordId: 0,
        // }
      ],
      // pqcP:[],
      productId2:'',
      maxlength:9,
      sub1:false,
      sub2:false,
      sub3:false,
      headers: {
        headers: { "Content-Type": "application/json; charset=UTF-8" }
      },
      loadStat: {
        saveLoading: false,
        pqcDataLoading: false,
        selectsDataLoading: false
      },
      selects: {
        productList: [],
        prodLineList: [],
        prodBatchList: [],
        chkShiftList: [],
        defectTypeList:[],
        inspectionTypes:[],
        prodProcessList: [],
        userList: [],
        reviewList: [],
        resultList: [
          { value: 1, label: i18n.t("pqc.qualified") },
          { value: 0, label: i18n.t("pqc.unqualified") }
        ],
        treatmentList: [
          { value: "JUDGE", label: i18n.t("pqc.judged")},
          { value: "REJECT", label: i18n.t("pqc.rg") },
          { value: "REWORK", label: i18n.t("pqc.rework") },
          { value: "SCREEN", label: i18n.t("pqc.filtrate") },
          { value: "SPECIAL_ADOPTION", label: i18n.t("pqc.speclelAdoption") },
          { value: "EMERGENCY_RELEASE", label: i18n.t("pqc.er") },
          { value: "SCRAP", label: i18n.t("pqc.scrap") }
        ]
      },
      sampling: {
        crAql: "",
        crAC: "",
        crRE: "",
        majAql: "",
        majAC: "",
        majRE: "",
        minAql: "",
        minAC: "",
        minRE: "",
        plan: "",
        level: "",
        rule: "",
        samplingCount: "",
        extStatus: "", //附加状态，停产：pending，免检：exempted ,
        lenientTransfer: "", //宽严程度：NORMAL 正常，SOFTEN 放宽，STRICTER 加严 ,
        lenientTransferName: "" //宽严程度：NORMAL 正常，SOFTEN 放宽，STRICTER 加严 ,
      },
      pqcParams: [],
      pqcDefectTable: [],
      attribute: [],
      HandleList: [],
      discountData: {
        rows: [{}],
        tableData: {
          defectRecordId: "",
          pqcId: "",
          defectTypeId: "",
          chkDevId: "",
          defectTypeName: "",
          inspectionTypeName: "",
          qltyLvId: "",
          defectLocId: "",
          chkDevType: "",
          defectCount: "",
          sampleQuantity: "",
          extInfoList: [],
          chdDevTypeList: []
        }
      },
      prodTypeId: "",
      pqcFirstRecordDto: {
        firstQuantity:"",
        firstRecordId:"",
        no: "",
        productName: "",
        spec: "",
        prodBatchNo: "",
        // firstRecordNo:"",
        batchQuantity: "",
        prodLineId: "",
        prodProcessId: "",
        firstRecordNo: "",
        createTime: vm.timetrans(new Date()/1000),
        type: 1,
        result:1,
        sampleQuantity:0,
        badQuantity:0,
        badRate:0,
        inspectExplain:"",
        productId: "",
        inspectorId: "",
        reviewProcessId: ""
        
      },
      pqc: {
        qcExplain:'',
        productName:'',
        productNo:'',
        productSpec:'',
        prodBatchId:'',
        prodProcessId:"",
        prodLineId:"",
        chkShiftId:'',
        pqcDate:vm.timetrans(new Date()/1000),
        auditorId: "",
        badQuantity: 0,
        badRate:0,
        batch: "",
        createTime: "",
        inspectionStandard: "",
        inspectorId: "",
        pqcId: "",
        pqcNo: "",
        manufacturerId: "",
        productId: '',
        prodFlowId: "",
        name: "",
        no: "",
        prodTypeId: "",
        prodTypeName: "",
        spec: "",
        reportNo: "",
        result: 1,
        reviewProcessId: "",
        totalBatchQuantity: "",
        batchQuantity: "",
        sampleQuantity: 0,
        samplingPlan: "",
        state: "",
        strictStandard: "",
        basicDisabled: true,
        AuditStatus: "0",
        DefectNameList: [],
        DefectGradeList: [],
        DefectLocList: [],
        chdDevTypeList: [],
        TableLength: 0,
        paramSelect: true,
        btnState: "post",
        CurrentOperatorId: "",
        subLockdisabled: false
      },
      reviews: {
        auditor: {
          disabled: true,
          pqcId: "",
          opinion: "",
          reviewRecordId: "",
          reviewTime: "",
          reviewerId: "",
          reviewerName: "",
          role: "auditor",
          treatmentType: null
        },
        judge: {
          disabled: true,
          pqcId: "",
          opinion: "",
          reviewRecordId: "",
          reviewTime: "",
          reviewerId: "",
          reviewerName: "",
          role: "auditor",
          treatmentType: null
        },
        reviewer1: {
          disabled: true,
          pqcId: "",
          opinion: "",
          reviewRecordId: "",
          reviewTime: "",
          reviewerId: "",
          reviewerName: "",
          role: "auditor",
          treatmentType: null
        },
        reviewer2: {
          disabled: true,
          pqcId: "",
          opinion: "",
          reviewRecordId: "",
          reviewTime: "",
          reviewerId: "",
          reviewerName: "",
          role: "auditor",
          treatmentType: null
        },
        reviewer3: {
          disabled: true,
          pqcId: "",
          opinion: "",
          reviewRecordId: "",
          reviewTime: "",
          reviewerId: "",
          reviewerName: "",
          role: "auditor",
          treatmentType: null
        },
        reviewer4: {
          disabled: true,
          pqcId: "",
          opinion: "",
          reviewRecordId: "",
          reviewTime: "",
          reviewerId: "",
          reviewerName: "",
          role: "auditor",
          treatmentType: null
        }
      },
      table: {
        param: {
          selected: [],
          loading: false,
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
                width: this.$store.state.locale=='zh_CN'?160:110,
                minWidth: this.$store.state.locale=='zh_CN'?160:110,
                align: 'center',
                ellipsis: true,
                key: 'currentAndParentName',
                render: (h, params) => {
                  let _this = this;
                  let texts = '';
                  texts = params.row.currentAndParentName
                  return h('div', {
                    props: {},
                  }, texts)
                }
              },
              {
                title: i18n.t('iqc.measUnit'),
                minWidth: this.$store.state.locale=='zh_CN'?54:80,
                align: 'center',
                ellipsis: true,
                key: 'unitSymbol',
                render: (h, params) => {
                  let _this = this;
                  let texts = '';
                  texts = params.row.unitSymbol
                  if(!texts) {
                    return h('div',i18n.t('Unlimited'))
                  }
                  else{
                    return h('div', {
                      props: {},
                    }, texts)
                  }
                  
                }
              },
              {
                title: i18n.t('pqc.chkDev'),
                width:80,
                minWidth:this.$store.state.locale=='zh_CN'?80:120,
                align: 'center',
                ellipsis: true,
                key: 'chkDevId',
                render: (h, params) => {
                  let that = this
                  return h("div", [
                    h("Select", {
                      props: {
                        value:that.pqcParams[params.index].chkDevId,
                        placeholder:i18n.t('Unlimited'),
                        disabled:this.sub2||this.noPermsDis,
                      },
                      on: {
                        "on-change": event => {
                          that.pqcParams[params.index].chkDevId = event
                        }
                      }
                    },
                    params.row.chkDevList.map(function(type) {
                      return h(
                        "Option",
                        {
                          props:{
                            value: type.chkDevId, label: type.name
                          },
                          type
                        }
                      )
                    })
                    )
                  ])
                }
              },
              {
                title: 'USL',
                minWidth: 55,
                align: 'center',
                ellipsis: true,
                key: 'usl',
                render: (h, params) => {
                  let _this = this;
                  let texts = '';
                  texts = params.row.usl
                  return h('div', {
                    props: {},
                  }, texts)
                }
              },
              {
                title: 'SL',
                minWidth: 55,
                align: 'center',
                ellipsis: true,
                key: 'sl',
                render: (h, params) => {
                  let _this = this;
                  let texts = '';
                  texts = params.row.sl
                  return h('div', {
                    props: {},
                  }, texts)
                }
              },
              {
                title: 'LSL',
                minWidth: 55,
                align: 'center',
                ellipsis: true,
                key: 'lsl',
                render: (h, params) => {
                  let _this = this;
                  let texts = '';
                  texts = params.row.lsl
                  return h('div', {
                    props: {},
                  }, texts)
                }
              },
              {
                title:i18n.t('pqc.record'),
                align: "center",
                ellipsis: true,
                minWidth:this.$store.state.locale=='zh_CN'?60:60,
                key: "data1",
                render: (h, params) => {
                  var me = this;
                  return h("div", [
                    h("Input", {
                      style:{
                          background:this.stylefun(params)
                      },
                      props: {
                        disabled:this.sub2||this.noPermsDis,
                        type: "text",
                        value: params.row.paramValueArray?params.row.paramValueArray[0]:''
                      },
                      on: {
                        "on-blur": event => {
                          me.pqcParams[params.index].paramValueArray[0] = event.target.value;
                          // me.$set(me.pqcParams[params.index].paramValueArray, 0, event.target.value)
                            this.toFixed(event,params.row.scale)
                            let obj = document.getElementById('styleTable').getElementsByTagName('tbody');
                            let indexObj = obj[0].children[params.index].children[7]
                            $(indexObj).find(".ivu-input-wrapper").css("background",'transparent')
                            if(event.target.value){
                              if(Number(event.target.value) > Number(this.pqcParams[params.index].usl) || Number(event.target.value) < Number(this.pqcParams[params.index].lsl)){
                                indexObj.className ="ivu-table-column-center styleTable ";
                              }else{
                                indexObj.className = "ivu-table-column-center";
                              }
                            }else{
                                indexObj.className = "ivu-table-column-center";
                            }
                            // 自定义单位数据
                            let string = event.target.value
                            let index = params.index
                            let key = 0
                            this.stringHandling(string,index,key)
                        },
                        // "on-keyup":event =>{
                        //   this.clearNoNum(event.target,this.pqcParams[params.index].scale);
                        // },
                        "on-keydown":event=>{
                          this.paramsFocus(0)
                        }
                      }
                    })
                  ]);
                }
              },
              {
                title: " ",
                align: "center",
                minWidth:this.$store.state.locale=='zh_CN'?60:60,
                ellipsis: true,
                key: "data2",
                render: (h, params) => {
                  var me = this;
                  return h("div", [
                    h("Input", {
                      style:{
                          background:this.stylefun(params)
                      },
                      props: {
                        disabled:this.sub2||this.noPermsDis,
                        type: "text",
                        value: params.row.paramValueArray?params.row.paramValueArray[1]:''
                      },
                      on: {
                        "on-blur": event => {
                          me.pqcParams[params.index].paramValueArray[1] = event.target.value;
                            // me.$set(me.pqcParams[params.index].paramValueArray, 1, event.target.value)
                              this.toFixed(event,params.row.scale)
                              let obj = document.getElementById('styleTable').getElementsByTagName('tbody');
                              let indexObj = obj[0].children[params.index].children[8]
                              $(indexObj).find(".ivu-input-wrapper").css("background",'transparent')
                            if(event.target.value){
                              if(Number(event.target.value) > Number(this.pqcParams[params.index].usl) || Number(event.target.value) < Number(this.pqcParams[params.index].lsl)){
                                indexObj.className ="ivu-table-column-center styleTable";
                              }else{
                                indexObj.className = "ivu-table-column-center";
                              }
                            }else{
                                indexObj.className = "ivu-table-column-center";
                            }
                            // 自定义单位数据
                            let string = event.target.value
                            let index = params.index
                            let key = 1
                            this.stringHandling(string,index,key)
                        },
                        // "on-keyup":event =>{
                        //   this.clearNoNum(event.target,this.pqcParams[params.index].scale);
                        // },
                        "on-keydown":event=>{
                          this.paramsFocus(0)
                        }
                      }
                    })
                  ]);
                }
              },
              {
                title: " ",
                align: "center",
                minWidth:this.$store.state.locale=='zh_CN'?60:60,
                ellipsis: true,
                key: "data3",
                render: (h, params) => {
                  var me = this;
                  return h("div", [
                    h("Input", {
                      style:{
                          background:this.stylefun(params)
                      },
                      props: {
                        disabled:this.sub2||this.noPermsDis,
                        type: "text",
                        value: params.row.paramValueArray?params.row.paramValueArray[2]:''
                      },
                      on: {
                        "on-blur": event => {
                          me.pqcParams[params.index].paramValueArray[2] = event.target.value;
                          // me.$set(me.pqcParams[params.index].paramValueArray, 2, event.target.value)
                              this.toFixed(event,params.row.scale)
                              let obj = document.getElementById('styleTable').getElementsByTagName('tbody');
                              let indexObj = obj[0].children[params.index].children[9]
                              $(indexObj).find(".ivu-input-wrapper").css("background",'transparent')
                            if(event.target.value){
                              if(Number(event.target.value) > Number(this.pqcParams[params.index].usl) || Number(event.target.value) < Number(this.pqcParams[params.index].lsl)){
                                indexObj.className ="ivu-table-column-center styleTable";
                              }else{
                                indexObj.className = "ivu-table-column-center";
                              }
                            }else{
                                indexObj.className = "ivu-table-column-center";
                            }
                            // 自定义单位数据
                            let string = event.target.value
                            let index = params.index
                            let key = 2
                            this.stringHandling(string,index,key)
                        },
                        // "on-keyup":event =>{
                        //   this.clearNoNum(event.target,this.pqcParams[params.index].scale);
                        // },
                        "on-keydown":event=>{
                          this.paramsFocus(0)
                        }
                      }
                    })
                  ]);
                }
              },
              {
                title: " ",
                align: "center",
                ellipsis: true,
                minWidth:this.$store.state.locale=='zh_CN'?60:60,
                key: "data4",
                render: (h, params) => {
                  var me = this;
                  return h("div", [
                    h("Input", {
                      style:{
                          background:this.stylefun(params)
                      },
                      props: {
                        disabled:this.sub2||this.noPermsDis,
                        type: "text",
                        value: params.row.paramValueArray?params.row.paramValueArray[3]:''
                      },
                      on: {
                        "on-blur": event => {
                          me.pqcParams[params.index].paramValueArray[3] = event.target.value;
                          // me.$set(me.pqcParams[params.index].paramValueArray, 3, event.target.value)
                              this.toFixed(event,params.row.scale)
                              let obj = document.getElementById('styleTable').getElementsByTagName('tbody');
                              let indexObj = obj[0].children[params.index].children[10]
                              $(indexObj).find(".ivu-input-wrapper").css("background",'transparent')
                            if(event.target.value){
                              if(Number(event.target.value) > Number(this.pqcParams[params.index].usl) || Number(event.target.value) < Number(this.pqcParams[params.index].lsl)){
                                indexObj.className ="ivu-table-column-center styleTable";
                              }else{
                                indexObj.className = "ivu-table-column-center";
                              }
                            }else{
                                indexObj.className = "ivu-table-column-center";
                            }
                            // 自定义单位数据
                            let string = event.target.value
                            let index = params.index
                            let key = 3
                            this.stringHandling(string,index,key)
                        },
                        // "on-keyup":event =>{
                        //   this.clearNoNum(event.target,this.pqcParams[params.index].scale);
                        // },
                        "on-keydown":event=>{
                          this.paramsFocus(0)
                        }
                      }
                    })
                  ]);
                }
              },
              {
                title: " ",
                align: "center",
                minWidth:this.$store.state.locale=='zh_CN'?60:60,
                ellipsis: true,
                key: "data5",
                render: (h, params) => {
                  var me = this;
                  return h("div", [
                    h("Input", {
                      style:{
                          background:this.stylefun(params)
                      },
                      props: {
                        disabled:this.sub2||this.noPermsDis,
                        type: "text",
                        value: params.row.paramValueArray?params.row.paramValueArray[4]:''
                      },
                      on: {
                        "on-blur": event => {
                          me.pqcParams[params.index].paramValueArray[4] = event.target.value;
                          // me.$set(me.pqcParams[params.index].paramValueArray, 4, event.target.value)
                              this.toFixed(event,params.row.scale)
                              let obj = document.getElementById('styleTable').getElementsByTagName('tbody');
                              let indexObj = obj[0].children[params.index].children[11]
                              $(indexObj).find(".ivu-input-wrapper").css("background",'transparent')
                            if(event.target.value){
                              if(Number(event.target.value) > Number(this.pqcParams[params.index].usl) || Number(event.target.value) < Number(this.pqcParams[params.index].lsl)){
                                indexObj.className ="ivu-table-column-center styleTable";
                              }else{
                                indexObj.className = "ivu-table-column-center";
                              }
                            }else{
                                indexObj.className = "ivu-table-column-center";
                            }
                            // 自定义单位数据
                            let string = event.target.value
                            let index = params.index
                            let key = 4
                            this.stringHandling(string,index,key)
                        },
                        // "on-keyup":event =>{
                        //     this.clearNoNum(event.target,this.pqcParams[params.index].scale);
                        // },
                        "on-keydown":event=>{
                          this.paramsFocus(0)
                        }
                      },
                    })
                  ]);
                }
              },
              {
                title:" ",
                align: "center",
                ellipsis: true,
                minWidth:this.$store.state.locale=='zh_CN'?60:60,
                key: "data6",
                render: (h, params) => {
                  var me = this;
                  return h("div", [
                    h("Input", {
                      style:{
                          background:this.stylefun(params)
                      },
                      props: {
                        disabled:this.sub2||this.noPermsDis,
                        type: "text",
                        value: params.row.paramValueArray?params.row.paramValueArray[5]:''
                      },
                      on: {
                        "on-blur": event => {
                          me.pqcParams[params.index].paramValueArray[5] = event.target.value;
                          // me.$set(me.pqcParams[params.index].paramValueArray, 5, event.target.value)
                            this.toFixed(event,params.row.scale)
                            let obj = document.getElementById('styleTable').getElementsByTagName('tbody');
                            let indexObj = obj[0].children[params.index].children[12]
                            $(indexObj).find(".ivu-input-wrapper").css("background",'transparent')
                            if(event.target.value){
                              if(Number(event.target.value) > Number(this.pqcParams[params.index].usl) || Number(event.target.value) < Number(this.pqcParams[params.index].lsl)){
                                indexObj.className ="ivu-table-column-center styleTable";
                              }else{
                                indexObj.className = "ivu-table-column-center";
                              }
                            }else{
                                indexObj.className = "ivu-table-column-center";
                            }
                            // 自定义单位数据
                            let string = event.target.value
                            let index = params.index
                            let key = 5
                            this.stringHandling(string,index,key)
                        },
                        // "on-keyup":event =>{
                        //   this.clearNoNum(event.target,this.pqcParams[params.index].scale);
                        // },
                        "on-keydown":event=>{
                          this.paramsFocus(0)
                        }
                      }
                    })
                  ]);
                }
              },
              {
                title: " ",
                align: "center",
                minWidth:this.$store.state.locale=='zh_CN'?60:60,
                ellipsis: true,
                key: "data7",
                render: (h, params) => {
                  var me = this;
                  return h("div", [
                    h("Input", {
                      style:{
                          background:this.stylefun(params)
                      },
                      props: {
                        disabled:this.sub2||this.noPermsDis,
                        type: "text",
                        value: params.row.paramValueArray?params.row.paramValueArray[6]:''
                      },
                      on: {
                        "on-blur": event => {
                          me.pqcParams[params.index].paramValueArray[6] = event.target.value;
                          // me.$set(me.pqcParams[params.index].paramValueArray, 6, event.target.value)
                              this.toFixed(event,params.row.scale)
                              let obj = document.getElementById('styleTable').getElementsByTagName('tbody');
                              let indexObj = obj[0].children[params.index].children[13]
                              $(indexObj).find(".ivu-input-wrapper").css("background",'transparent')
                            if(event.target.value){
                              if(Number(event.target.value) > Number(this.pqcParams[params.index].usl) || Number(event.target.value) < Number(this.pqcParams[params.index].lsl)){
                                indexObj.className ="ivu-table-column-center styleTable";
                              }else{
                                indexObj.className = "ivu-table-column-center";
                              }
                            }else{
                                indexObj.className = "ivu-table-column-center";
                            }
                            // 自定义单位数据
                            let string = event.target.value
                            let index = params.index
                            let key = 6
                            this.stringHandling(string,index,key)
                        },
                        // "on-keyup":event =>{
                        //   this.clearNoNum(event.target,this.pqcParams[params.index].scale);
                        // },
                        "on-keydown":event=>{
                          this.paramsFocus(0)
                        }
                      }
                    })
                  ]);
                }
              },
              {
                title: " ",
                align: "center",
                minWidth:this.$store.state.locale=='zh_CN'?60:60,
                ellipsis: true,
                key: "data8",
                render: (h, params) => {
                  var me = this;
                  return h("div", [
                    h("Input", {
                      style:{
                          background:this.stylefun(params)
                      },
                      props: {
                        disabled:this.sub2||this.noPermsDis,
                        type: "text",
                        value: params.row.paramValueArray?params.row.paramValueArray[7]:''
                      },
                      on: {
                        "on-blur": event => {
                          me.pqcParams[params.index].paramValueArray[7] = event.target.value;
                          // me.$set(me.pqcParams[params.index].paramValueArray, 7, event.target.value)
                              this.toFixed(event,params.row.scale)
                              let obj = document.getElementById('styleTable').getElementsByTagName('tbody');
                              let indexObj = obj[0].children[params.index].children[14]
                              $(indexObj).find(".ivu-input-wrapper").css("background",'transparent')
                            if(event.target.value){
                              if(Number(event.target.value) > Number(this.pqcParams[params.index].usl) || Number(event.target.value) < Number(this.pqcParams[params.index].lsl)){
                                indexObj.className ="ivu-table-column-center styleTable";
                              }else{
                                indexObj.className = "ivu-table-column-center";
                              }
                            }else{
                                indexObj.className = "ivu-table-column-center";
                            }
                            // 自定义单位数据
                            let string = event.target.value
                            let index = params.index
                            let key = 7
                            this.stringHandling(string,index,key)
                        },
                        // "on-keyup":event =>{
                        //   this.clearNoNum(event.target,this.pqcParams[params.index].scale);
                        // },
                        "on-keydown":event=>{
                          this.paramsFocus(0)
                        }
                      }
                    })
                  ]);
                }
              },
              {
                title: " ",
                align: "center",
                ellipsis: true,
                minWidth:this.$store.state.locale=='zh_CN'?60:60,
                key: "data9",
                render: (h, params) => {
                  var me = this;
                  return h("div", [
                    h("Input", {
                      style:{
                          background:this.stylefun(params)
                      },
                      props: {
                        disabled:this.sub2||this.noPermsDis,
                        type: "text",
                        value: params.row.paramValueArray?params.row.paramValueArray[8]:''
                      },
                      on: {
                        "on-blur": event => {
                          me.pqcParams[params.index].paramValueArray[8] = event.target.value;
                          // me.$set(me.pqcParams[params.index].paramValueArray, 8, event.target.value)
                              this.toFixed(event,params.row.scale)
                              let obj = document.getElementById('styleTable').getElementsByTagName('tbody');
                              let indexObj = obj[0].children[params.index].children[15]
                              $(indexObj).find(".ivu-input-wrapper").css("background",'transparent')
                            if(event.target.value){
                              if(Number(event.target.value) > Number(this.pqcParams[params.index].usl) || Number(event.target.value) < Number(this.pqcParams[params.index].lsl)){
                                indexObj.className ="ivu-table-column-center styleTable";
                              }else{
                                indexObj.className = "ivu-table-column-center";
                              }
                            }else{
                                indexObj.className = "ivu-table-column-center";
                            }
                            // 自定义单位数据
                            let string = event.target.value
                            let index = params.index
                            let key = 8
                            this.stringHandling(string,index,key)
                        },
                        // "on-keyup":event =>{
                        //   this.clearNoNum(event.target,this.pqcParams[params.index].scale);
                        // },
                        "on-keydown":event=>{
                          this.paramsFocus(0)
                        }
                      }
                    })
                  ]);
                }
              },
              {
                title: " ",
                align: "center",
                minWidth:this.$store.state.locale=='zh_CN'?60:60,
                ellipsis: true,
                key: "data10",
                render: (h, params) => {
                  var me = this;
                  return h("div", [
                    h("Input", {
                      style:{
                          background:this.stylefun(params)
                      },
                      props: {
                        disabled:this.sub2||this.noPermsDis,
                        type: "text",
                        value: params.row.paramValueArray?params.row.paramValueArray[9]:''
                      },
                      on: {
                        "on-blur": event => {
                          me.pqcParams[params.index].paramValueArray[9] = event.target.value;
                          // me.$set(me.pqcParams[params.index].paramValueArray, 9, event.target.value)
                              this.toFixed(event,params.row.scale)
                              let obj = document.getElementById('styleTable').getElementsByTagName('tbody');
                              let indexObj = obj[0].children[params.index].children[16]
                              $(indexObj).find(".ivu-input-wrapper").css("background",'transparent')
                            if(event.target.value){
                              if(Number(event.target.value) > Number(this.pqcParams[params.index].usl) || Number(event.target.value) < Number(this.pqcParams[params.index].lsl)){
                                indexObj.className ="ivu-table-column-center styleTable";
                              }else{
                                indexObj.className = "ivu-table-column-center";
                              }
                            }else{
                                indexObj.className = "ivu-table-column-center";
                            }
                            // 自定义单位数据
                            let string = event.target.value
                            let index = params.index
                            let key = 9
                            this.stringHandling(string,index,key)
                        },
                        // "on-keyup":event =>{
                        //     this.clearNoNum(event.target,this.pqcParams[params.index].scale);
                        // },
                        // "on-keydown":event=>{
                        //   this.paramsFocus(0)
                        // }
                      },
                    })
                  ]);
                }
              },
              // {
              //   title:'记录',
              //   align:"center",
              //   // ellipsis:true,
              //   // key: 'paramId',
              //   minWidth:700,
              //   render:(h) => {
              //     return h("Input",{
              //       props:{
              //         sampleNum:this.sampleNum,
              //         paramsList:this.paramsList
              //       }
              //     })
              //   }
              // },
          ],
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
                //  render: (h, params) => {
                //   let _this = this;
                //   let texts = '';
                //   texts = params.row.inspectionName
                //   return h('div', {
                //     props: {},
                //   }, texts)
                // } 
              },
              {
                title:i18n.t('pqc.InspectionStandards'),
                width:500,
                align:"center",
                key:'inspectionLevel'
              },
              {
                title:i18n.t('pqc.tr'),
                width:100,
                aligh:"center",
                key:'result',
                render:(h,params) => {
                  let that = this;
                  return h('Select',{
                    props:{disabled:that.sub2||that.noPermsDis,value:that.attribute[params.index].result},
                    on:{
                      "on-change":(event) => {
                        that.attribute[params.index].result = event
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
              title:i18n.t('pqc.InspectionInstructions'),
              minWidth:200,
              align:'center',
              key:'inspectionExplain',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      disabled:me.sub2||me.noPermsDis,
                      type: 'textarea',
                      autosize:{
                        minRows:1,
                        maxRows:4
                      },
                      maxlength:600,
                      value:params.row.inspectionExplain
                    },
                    on:{
                      "on-blur":function(event){
                        me.attribute[params.index].inspectionExplain = event.target.value
                      }
                    }
                  })
                ])
              }
            },
          ]
        },
        // 缺陷记录columns
        defect: {
          selected: [],
          loading: false,
          columns: [
            {
              type: "selection",
              align: "center",
              width: 40,
              maxWidth: 40,
              minWidth: 40,

            },
            {
              title: i18n.t("pqc.no"),
              render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align: "center",
              minWidth: 80,
              width: 60,
            },
            {//检验项目
              title: i18n.t("pqc.inspection"),
              align: "center",
              width:160,
              minWidth:160,
              ellipsis: true,//开启后，文本将不换行，超出部分显示为省略号
              key: "inspectionTypeName",
              // render:(h, params)=>{
              //     let ret =  vm.$iqis.utils.tableHelper.editable.buildCascaderCell4(vm,(vm)=>{return vm.selects.inspectionTypes},"inspectionTypeId","name",null,

              //       this.getDefectNameList,//获取当前检验项目下的缺陷名称列表
              //       this.sub2||this.noPermsDis
              //     )
              //     return ret(h,params);
              // }
            },
            {
              title: i18n.t("pqc.defectName"),
              width:120,
              minWidth:120,
              align: "center",
              ellipsis: true,
              key: "defectTypeId",
              render: (h, params) => {
                let _this = this;
                return h(
                  "Select",
                  {
                    props: {
                      disabled:this.sub2||this.noPermsDis,
                      value: this.pqcDefectTable[params.index].defectTypeId
                    },
                    on: {
                      "on-change": event => {
                        this.pqcDefectTable[params.index].defectTypeId = event;
                        // this.initInspectionSelector(this.pqcDefectTable[params.index].defectTypeId,params.index
                        // );
                      }
                    }
                  },
                  this.pqc.DefectNameList.map(function(type) {
                    return h(
                      "Option",
                      { props: { value: type.defectTypeId, label: type.name } },
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
                      type: "textarea",
                      disabled:this.sub2||this.noPermsDis,
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
                        this.pqcDefectTable[params.index].describe = event.target.value
                        // this.pqcDefectTable[params.index] = params.row
                      }
                    }
                  })
                ]);
              }
            },
            // {
            //   title: i18n.t("pqc.defectGrade"),
            //   align: "center",
            //   width:this.$store.state.locale=='zh_CN'?80:100,
            //   minWidth:this.$store.state.locale=='zh_CN'?80:100,
            //   ellipsis: true,
            //   key: "qltyLvId",
            //   render: (h, params) => {
            //     let _this = this;
            //     return h(
            //       "Select",
            //       {
            //         props: {
            //           disabled:
            //             this.sub2||this.noPermsDis,
            //           value: this.pqcDefectTable[params.index].qltyLvId
            //         },
            //         on: {
            //           "on-change": event => {
            //             this.pqcDefectTable[params.index].qltyLvId = event;
            //           }
            //         }
            //       },
            //       this.pqc.DefectGradeList.map(function(type) {
            //         return h(
            //           "Option",
            //           {
            //             props: { value: type.qltyLvId, label: type.name }
            //           },
            //           type
            //         );
            //       })
            //     );
            //   }
            // },
            // {
            //   title: i18n.t("pqc.defectPosition"),
            //   align: "center",
            //   width:120,
            //   minWidth:120,
            //   ellipsis: true,
            //   focus: true,
            //   key: "defectLocId",
            //   render: (h, params) => {
            //     let _this = this;
            //     return h(
            //       "Select",
            //       {
            //         props: {
            //           disabled:
            //             this.sub2||this.noPermsDis,
            //           value: this.pqcDefectTable[params.index].defectLocId
            //         },
            //         on: {
            //           "on-change": event => {
            //             this.pqcDefectTable[params.index].defectLocId = event;
            //           }
            //         }
            //       },
            //       this.pqc.DefectLocList.map(function(type) {
            //         return h(
            //           "Option",
            //           {
            //             props: { value: type.defectLocId, label: type.name }
            //           },
            //           type
            //         );
            //       })
            //     );
            //   }
            // },
            // {
            //   title: i18n.t("pqc.chkDev"),
            //   align: "center",
            //   ellipsis: true,
            //   width:150,
            //   minWidth:150,
            //   key: "chkDevId",
            //   render: (h, params) => {
            //     let _this = this;
            //     let chdDevTypeList =
            //       this.pqcDefectTable[params.index].chkDevTypeList || [];
            //     return h(
            //       "Select",
            //       {
            //         props: {
            //           disabled:
            //             this.sub2||this.noPermsDis,
            //           placeholder: i18n.t("pqc.wu"),
            //           value: this.pqcDefectTable[params.index].chkDevId
            //         },
            //         on: {
            //           "on-change": event => {
            //             this.pqcDefectTable[params.index].chkDevId = event;
            //           }
            //         }
            //       },
            //       params.row.chkDevTypeList.map(function(type) {//chdDevTypeList原带出检验设备列表
            //         return h(
            //           "Option",
            //           {
            //             props: { value: type.chkDevId, label: type.name }
            //           },
            //           type
            //         );
            //       })
            //     );
            //   }
            // },
            // {
            //   title: i18n.t("pqc.sampleQuantity"),
            //   align: "center",
            //   minWidth:80,
            //   ellipsis: true,
            //   key: "sampleQuantity",
            //   render: (h, params) => {
            //     var me = this;
            //     return h("div", [
            //       h("Input", {
            //         props: {
            //           disabled:
            //             this.sub2||this.noPermsDis,
            //           type: "text",
            //           value: me.pqcDefectTable[params.index].sampleQuantity
            //         },
            //         on: {
            //           "on-blur": event => {
            //             this.pqcDefectTable[params.index].sampleQuantity =
            //               event.target.value;
            //           }
            //         }
            //       })
            //     ]);
            //   }
            // },
            {
              title: "实抽样数",
              key:"sampleQuantity",
              minWidth: 200,
              width:200,
              render: (h, params) => {console.log(params,"pppp")
                return h("div", [
                  h("Input", {
                    props: {
                      type: "textarea",
                      disabled:this.sub2||this.noPermsDis,
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
                        this.pqcDefectTable[params.index].sampleQuantity = event.target.value
                        // this.pqcDefectTable[params.index] = params.row
                      }
                    }
                  })
                ]);
              }
            },
            {
              title: i18n.t("pqc.dn"),//缺陷數
              minWidth:80,
              align: "center",
              ellipsis: true,
              key: "defectCount",
              render: (h, params) => {
                var me = this;
                return h("div", [
                  h("Input", {
                    props: {
                      disabled:
                        this.sub2||this.noPermsDis,
                      type: "text",
                      value: me.pqcDefectTable[params.index].defectCount
                    },
                    on: {
                      "on-blur": event => {
                        this.pqcDefectTable[params.index].defectCount =
                          event.target.value;
                          this.pqcFirstRecordDto.badQuantity=0;
                          for(let i in this.pqcDefectTable){
                            this.pqcFirstRecordDto.badQuantity+=Number(this.pqcDefectTable[i].defectCount);
                          }
                          this.changeResult(this.pqcFirstRecordDto.badQuantity)
                      }
                    }
                  })
                ]);
              }
            },
            {
              title: "缺陷率%",
              key:"defectRate",
              minWidth: 200,
              width:200,
              render: (h, params) => {
                return h("div", [
                  h("Input", {
                    props: {
                      type: "textarea",
                      disabled:this.sub2||this.noPermsDis,
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
                        this.pqcDefectTable[params.index].defectRate = event.target.value
                        // this.pqcDefectTable[params.index] = params.row
                      }
                    }
                  })
                ]);
              }
            },
            {
              title: i18n.t('pqc.remarks'),
              key:"remark",
              minWidth: 200,
              width:200,
              render: (h, params) => {
                return h("div", [
                  h("Input", {
                    props: {
                      type: "textarea",
                      disabled:this.sub2||this.noPermsDis,
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
                        this.pqcDefectTable[params.index].remark = event.target.value
                        // this.pqcDefectTable[params.index] = params.row
                      }
                    }
                  })
                ]);
              }
            },
            // {
            //   title: i18n.t("pqc.picture"), 
            //   align: 'center',
            //   key: 'extInfoList',
            //   render:function (h, data) {
            //     try{
            //       vm.pqcDefectTable[data.index].extInfoList.length
            //     }catch(err) {
            //       vm.pqcDefectTable[data.index].extInfoList=[]
            //     }

            //     return h("IqisUpload", {
            //       props: {//:size="54" :edit="switchs.fileEdit" v-model="product.settings.ext"
            //         "value":data.row[data.column.key],
            //         "size": 32,
            //         "row-index": data.index,
            //         "row":data.row,
            //         "edit":!vm.sub2&&!vm.noPermsDis,
            //         "maxSize":10240,
            //         "fileType":['jpg','jpeg','png'],
            //         "fileCount":5,
            //         'chartTypeShow':"true",
            //       },
            //       on: {
            //         input: (val) => {
            //           var obj = {'defectrecordExtInfoName':val[0].name,'defectrecordExtInfoType':val[0].mime,'url':val[0].url};
            //           vm.pqcDefectTable[data.index].extInfoList.push(obj);
            //         },
            //         del: (val) => {
            //           vm.pqcDefectTable[data.index].extInfoList.splice(val,1);
            //         }
            //       }
            //     })
            //   }
            // }
          ]
        }
      },
      permsCur:[
        "UPDATE_PQC",
        "INSERT_PQC"
      ],//当前页面需要的权限名称
      permsBtn:{//控制每个权限对应按钮的禁用状态
        "UPDATE_PQC":false,
        "INSERT_PQC":false,
      },
      noPermsDis:true,
      loadingRemote:false,
      source:null,
      reviewState:'',
    }
  },
  created() {
    this.locale = SessionStorage.get("language-main");
    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.refreshData();
    
  },
  watch: {
      /* "pqcFirstRecordDto.productId":function(){
        this.ext = this.ext;
      } */
    },
  computed: {
    //计算不良率
    reckonBadRate() {
      if (this.pqcFirstRecordDto.sampleQuantity !== "" && this.pqcFirstRecordDto.badQuantity !== "") {
        if ( this.pqcFirstRecordDto.sampleQuantity == 0 && this.pqcFirstRecordDto.badQuantity == 0 ) {
          return "0";
        } 
        else if ( this.pqcFirstRecordDto.badQuantity == null && this.pqcFirstRecordDto.sampleQuantity == null ) {
          return "";
        } 
        else {
          let x = (this.pqcFirstRecordDto.badQuantity / this.pqcFirstRecordDto.sampleQuantity * 100 );
          x = Math.floor(x * 100 ) / 100
          if(x>100){
            return 100;
          }
          else{
            return x;
          }
        }
      }
    },
    // pqcResult(){
    //   if(this.pqcFirstRecordDto.badQuantity==0){
    //     return 1;
    //   }else{
    //     return 0;
    //   }
    // }
  },
  methods: {
    paramsFocus(index){
      if(index===0&&event.keyCode==13){
        $(event.target).parents('td').next().find('input').focus()
      }
      // else if(index==1&&event.keyCode==13){
      //   $(event.target).parents('.ivu-table-row').next().find('td:first-child input').focus()
      // }
    },
    //字符创处理
    stringHandling(string,index,key){
      let strings = string.replace(/，/g,",")
        let j = 0
        let stringArr = ''
        if(strings !== Number){
            
            stringArr = strings.split('');//把字符串转换为数组
            for(let i = 0; i < stringArr.length; i++){
                if(stringArr[i] == ','){
                    j++
                }
            }
            // ["12", "34", "56", ""]78°29′24″
            if(j === 3){
                stringArr = strings.split(',')
                if(stringArr.length === 4){
                    stringArr.splice(1,0,'°')
                    stringArr.splice(3,0,'′')
                    stringArr.splice(6,0,'″')
                    // this.data1[index][key] = stringArr.join("")
                    // this.params.row.paramValueArray[0] = stringArr.join("")
                    // this.pqcParams[index][key] = stringArr.join("")
                    this.pqcParams[index].paramValueArray[key] = stringArr.join("")
                }
            }
        }
    },
    //产品编号 按字母查询
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
    paramslist(val){
        this.paramsList = val;
        
      },

    // 产品编号下拉框选择变化时调用
    getProductName(productId){
      let that = this;
      if(productId){
        that.$http.get('/basic/product/detail/'+productId).then(function(resp){//产品的接口 赋值给需要的v-model
          // that.ext = resp.data.settings.ext
          that.prodTypeId=resp.data.prodTypeName;
          that.pqcFirstRecordDto.productName=resp.data.name;
          that.pqcFirstRecordDto.spec=resp.data.spec;
          that.pqcFirstRecordDto.no=resp.data.no;
          let aql = resp.data.settings.qc.pqc.aql;
          that.sampling.plan = aql.samplingPlanCode;
          that.sampling.level = aql.inspectionStandard;
          that.sampling.crAql = aql.crAql;
          that.sampling.majAql = aql.majAql;
          that.sampling.minAql = aql.minAql;
          if(!that.pqcId) {
            for(let i in resp.data.settings.qc.pqc.property) {
              let item = resp.data.settings.qc.pqc.property[i];

              let o = {};
              o.propertyId = item.propertyId;
              o.inspectionId= item.inspectionId
              o.currentAndParentName = item.currentAndParentName
              // o.inspectionExplain = "";
              // o.result = 0;
              o.inspectionName = item.inspectionName;
              o.inspectionLevel = item.inspectionLevel
              that.attribute.push(o)
            }
          }
          that.pqc.prodFlowId = aql.prodFlowId;//生产工序站点
          if (that.pqc.prodFlowId) {//生产工序站点
            that.$http.get("/basic/prod-task/" + that.pqc.prodFlowId).then(resp3 => {
              if(!that.pqcId){
                for(let j=0;j<resp3.data.prodTaskItems.length;j++) {
                  let item = resp3.data.prodTaskItems[j];
                      if( item.prodProcessName == i18n.t('pqc.finalInspection') &&!that.pqcFirstRecordDto.prodProcessId){
                        that.pqcFirstRecordDto.prodProcessId=item.prodProcessId
                      }
                }
              }
                that.selects.prodProcessList = resp3.data.prodTaskItems; 
            });
          }
          
          if(that.flag){
            that.flag=false;
          }else{
            that.pqcParams = resp.data.settings.qc.pqc.params
            for(let i=0;i<that.pqcParams.length;i++){
              that.pqcParams[i].paramValueArray =['','','','','','','','','','']//參數記錄的12345賦值
            }
            that.pqcParamsNew = resp.data.settings.qc.pqc.params
          }
          let chkDevTypeIds = []
          for(let i in that.pqcParams){
            if(!that.pqcParams[i].chkDevTypeId){
              that.pqcParams[i].chkDevTypeId=-1
            }if(that.pqcParams[i].chkDevTypeId==-1) {
              chkDevTypeIds.push(that.pqcParams[i].chkDevTypeId)
            }else{
              chkDevTypeIds.push(that.pqcParams[i].chkDevTypeId.replace(/\,/g,'_'))
            }
          }
          let chkDevListResp =chkDevTypeIds?that.$iqis.utils.syncget('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{useState: 1,page: 1,limit: 9999}):null;
        // that.$http.get('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds).then(function(chkDevListResp){
          for(let i in that.pqcParams){
            let chkDevList = chkDevListResp ? chkDevListResp.data[i]||[] : [];
            chkDevList.unshift({chkDevId:null,name:i18n.t('Unlimited')});
            that.pqcParams[i]['chkDevList'] = chkDevList;
          }
          
          let endDate = new Date(that.pqcFirstRecordDto.createTime).getTime();
          let calculateUrl = "/business-rule/product/new-calculate-lenient-transfer?productId="+productId+"&qcType=pqc&endDate="+endDate;//??????????????????
          that.$http.put(calculateUrl).then(resp => {
            if(that.sampling.plan=="full") {
              that.sampling.rule=''
              that.sampling.level=''
              return
            }
            if(that.sampling.plan=="percent") {
              that.sampling.rule=''
              return
            }
            that.sampling.rule = resp.data.lenientTransfer;  
          })
         
          if(that.sampling.plan=="full"||that.sampling.plan=="percent") {     
             that.sampling.crAql ='-' 
             that.sampling.majAql = '-'
             that.sampling.minAql ='-'
             that.sampling.crAC = '-'
             that.sampling.crRE = '-'
             that.sampling.majAC ='-'
             that.sampling.majRE = '-'
             that.sampling.minAC ='-'
             that.sampling.minRE = '-'
          }
        })

        // 獲取生產綫別
        that.$http.get("/basic/prodline",{params:{limit:99999999}}).then(function(resp)  {
          that.selects.prodLineList = [];
          that.selects.prodLineList = resp.data;
        }) 

      }
    },
    // 缺陷数输入框失去焦点时调用的
    changeResult(val){
      if(val==0){
        this.pqcFirstRecordDto.result=1;
      }else{
        this.pqcFirstRecordDto.result=0;
      }
    },
    // clearNoNum(obj,num){
    //   obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
    //   obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    //   obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    //   let allRep = '';
    //   for(let i=0;i<num;i++){
    //     let rep = '\\d';
    //     allRep += rep;
    //   }
    //   if(obj.value.indexOf(".")>0){
    //     if(obj.value.substring(obj.value.indexOf("."),obj.value.length-1).length>num){
    //       obj.value =  obj.value.substring(0,obj.value.length-1);
    //     }
    //   }
    //   if(obj.value.indexOf(".")==obj.value.length-1&&num==0){
    //       obj.value = obj.value.substring(0,obj.value.length-1);
    //   }
    
    //   if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点
    //       obj.value= parseFloat(obj.value);
    //   }
    // },
    // 缺陷记录 选中项发生变化时就会触发 
    defectTableSelectChange(v) {
      this.pqc.TableLength = v.length;
      if (v.length > 0) {
        this.pqc.paramSelect = false;
      } else {
        this.pqc.paramSelect = true;
      }
    },
    getInspectiontype(){//获取检验项目下拉框
      let that=this;
      // that.$http.get("/basic/inspectiontype",{params:{limit:99999999}}).then(function(resp){
      //   let root = {title:i18n.t("pqc.projectType"),selected: false,label:i18n.t("pqc.projectType"),value:0,expand:true};
      //   that.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
      //   that.selects.inspectionTypes = [root];)
      // })
        let resp = that.$iqis.utils.syncget("/basic/inspectiontype?page=1&limit=99999");
        let root = {title:i18n.t("pqc.projectType"),selected: false,label:i18n.t("pqc.projectType"),value:0,expand:true};
        that.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
        that.selects.inspectionTypes = [root];
      // let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表


    },
    getDefectNameList(val,key,index,o){//获取当前检验项目下的缺陷名称列表
      if(o == null || Object.keys(o).length == 0){
        return;
      }
      let that = this;
      this.pqcDefectTable = this.pqcDefectTable ||[];
      
      let newRow = this.pqcDefectTable[index];
      if(!newRow && this.pqcDefectTable[index]){
        newRow =  JSON.parse(JSON.stringify(this.pqcDefectTable[index]));
      }
      if(!newRow){return;}
      newRow[key] = val;
      newRow['inspectionTypeName'] = o.name;
      newRow['inspectionTypeId'] = o.inspectionTypeId;
      newRow['chkDevTypeId'] = o.chkDevTypeId;
      newRow['chkDevTypeName'] = o.chkDevTypeName;
      newRow['chkDevTypeList'] = [];
      if(o.inspectionTypeId){
        let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+o.inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
        newRow['defectTypeList'] = resp ? resp.data||[]:[];
      }
      let ids = []
      let _ids = (o.chkDevTypeId+"").replace(/,/g,"_");//1,2,3 --> 1_2_3
      ids.push(_ids);//["1_2_3",]
      if(ids){
        // let resp2 = that.$iqis.utils.syncget('/basic/chkdevlist/'+o.chkDevTypeId+'?page=1&limit=99999&useState=1');//带出检验设备列表
        let resp2 = that.$iqis.utils.syncget('/basic/chkdevListByIds'+'?chkDevTypeIds[]='+ids+'&page=1&limit=99999&useState=1');
        newRow['chkDevTypeList'] = resp2 ? resp2.data[0]||[]  :  [];
      }else{
        newRow['chkDevTypeList']=[]
      }
      for(let i in newRow['chkDevTypeList']){
        if(newRow['chkDevTypeList'][i].chkDevId==i18n.t("pqc.wu")){
          newRow['chkDevTypeList'].splice(i,1)
        }
      }
      newRow['chkDevTypeList'].unshift({chkDevId:i18n.t("pqc.wu"),name:i18n.t("pqc.wu")});
      that.pqcDefectTable[index] = newRow;
      that.$set(that.pqcDefectTable, index, newRow);
      return;
    },
    refreshData() {
      let that = this;
      let pqcId = that.$props.id
      
      that.loadSelectsData();
      that.CurrentOperator();//获取当前登录人员信息
      that.getInspectiontype();//获取检验项目下拉框
      that.pqc.prodProcessId=0;      
      if (pqcId) {
        let that = this;
        that.pqcId = pqcId;
        that.flag=true;
        let url = "/examinecenter/pqc/firstrecord/";
        that.$http.get(url + pqcId).then(res => {
          for(let i in res.data.firstRecordPropertyDtos) {
            let item = res.data.firstRecordPropertyDtos[i]
            let o ={}
            o.result = item.result
            o.propertyId = item.propertyId
            o.inspectionId = item.inspectionId
            o.currentAndParentName = item.currentAndParentName
            o.inspectionExplain = item.inspectionExplain
            o.inspectionName = item.inspectionName
            o.inspectionLevel = item.inspectionLevel
            that.attribute.push(o)
          }
          that.pqcFirstRecordDto.reviewProcessId = res.data.firstRecordDto.reviewProcessId;
          that.pqcFirstRecordDto.firstQuantity = res.data.firstRecordDto.firstQuantity;
          that.pqcFirstRecordDto.result = res.data.firstRecordDto.result;
          that.pqc.AuditStatus=res.data.firstRecordDto.state;
          that.pqcFirstRecordDto.inspectorId = res.data.firstRecordDto.inspectorId;
          that.reviewState = res.data.firstRecordDto.reviewState;
          that.pqc.pqcId = pqcId;
          that.pqcFirstRecordDto=res.data.firstRecordDto
          that.pqc.btnState = "put";
          // that.pqc.AuditStatus = res.data.firstRecordDto.state;
          that.pqcFirstRecordDto.createTime = new Date(res.data.firstRecordDto.createTime);
          that.pqcDefectTable=res.data.defectRecordList
          // that.pqcParams=res.data.paramRecordList
        
          for(let i in that.pqcDefectTable){
            let inspectionTypeId = that.pqcDefectTable[i].inspectionTypeId;
            let chkDevTypeId = that.pqcDefectTable[i].chkDevTypeId;

            let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
            let defectTypeList = resp ? resp.data||[] : [];
            that.pqcDefectTable[i]['defectTypeList'] = defectTypeList;
            let ids = []
            let _ids = (chkDevTypeId+"").replace(/,/g,"_");//1,2,3 --> 1_2_3
            ids.push(_ids);//["1_2_3",]
            if(ids){
              let resp2 = that.$iqis.utils.syncget('/basic/chkdevListByIds'+'?chkDevTypeIds[]='+ids+'&page=1&limit=99999&useState=1');//带出检验设备列表
              let chkDevTypeList = resp2 ? resp2.data[0]||[] : [];
              that.pqcDefectTable[i]['chkDevTypeList'] = chkDevTypeList;
            }else{
              that.pqcDefectTable[i]['chkDevTypeList'] = [];
            }
            that.pqcDefectTable[i]['chkDevTypeList'].unshift({chkDevId:i18n.t("pqc.wu"),name:i18n.t("pqc.wu")});              
            if(!that.pqcDefectTable[i].defectLocId){
              that.pqcDefectTable[i].defectLocId=i18n.t("pqc.wu");
            }
            if(!that.pqcDefectTable[i].chkDevId){
              that.pqcDefectTable[i].chkDevId=i18n.t("pqc.wu");
            }
          }
          for (let x in that.pqcDefectTable) {
            that.pqcDefectTable[x].defectNumber = parseInt(x);
            that.pqcDefectTable[x].chdDevTypeList = [];
            that.pqcDefectTable[x].defectTypeName =res.data.defectRecordList[x].defectTypeName;
            that.pqcDefectTable[x].qltyLvId =res.data.defectRecordList[x].qltyLvId;
            that.pqcDefectTable[x].inspectionTypeName =res.data.defectRecordList[x].inspectionTypeName;
            // that.$http.get( "/basic/inspectiontype/" + res.data.defectRecordList[x].inspectionTypeId ).then(resp => {
                // that.chkdevlistData(resp.data.chkDevTypeId, x);
              // });
            if(that.pqcDefectTable[x].extInfoList==null){
              that.pqcDefectTable[x].extInfoList=new Array();
            }

          }
          let arr = [];
          for(let i=0;i<res.data.paramRecordList.length;i++){
            let _item = res.data.paramRecordList[i] 
            let item = {
              paramValueArray:_item.paramValueArray,
              currentAndParentName:_item.currentAndParentName,
              chkDevTypeId:_item.chkDevTypeId,
              chkDevId:_item.chkDevId,
              inspectionTypeId:_item.inspectionTypeId,
              inspectionTypeName:_item.inspectionTypeName,
              lsl:_item.lsl,
              measUnitId:_item.measUnitId,
              scale:_item.scale,
              sl:_item.sl,
              unitSymbol:_item.unitSymbol,
              usl:_item.usl,
              wll:_item.wll,
              wul:_item.wul,
              prodStageId:res.data.firstRecordDto.prodProcessId
            }
            arr.push(item)
          }

          that.pqcParams = JSON.parse(JSON.stringify(arr));
          // that.pqcP = JSON.parse(JSON.stringify(arr));
          let chkDevTypeIds = []
          for(let i in that.pqcParams){
            if(!that.pqcParams[i].chkDevTypeId){
              that.pqcParams[i].chkDevTypeId="-1"
            }
            if(that.pqcParams[i].chkDevTypeId=="-1") {
              chkDevTypeIds.push(that.pqcParams[i].chkDevTypeId)
            }else {
              chkDevTypeIds.push(that.pqcParams[i].chkDevTypeId.replace(/\,/g,'_'))
            }
          }
          
          let chkDevListResp =chkDevTypeIds?that.$iqis.utils.syncget('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{useState: 1,page: 1,limit: 9999}):null;
          for(let i in that.pqcParams){
            let chkDevList = chkDevListResp ? chkDevListResp.data[i]||[] : [];
            // chkDevList.unshift({chkDevId:i18n.t("pqc.wu"),name:i18n.t('pqc.wu')});
            chkDevList.unshift({chkDevId:null,name:i18n.t('Unlimited')});
            that.pqcParams[i]['chkDevList'] = chkDevList;
          }
          that.pqcParamsNew = JSON.parse(JSON.stringify(that.pqcParams)); //pqcParamsNew用于存放所有，pqcParams用于存放经工序过滤后的
          // that.$nextTick(()=>{
          //   for(let i=0;i<that.pqcParams.length;i++){
          //     for(let k=0;k<=10;k++){
          //       if(that.pqcParams[i].paramValueArray[k]){
          //         let obj = document.getElementById('styleTable').getElementsByTagName('tbody');
          //         let indexObj = obj[0].children[i].children[7+k]
          //         if(Number(that.pqcParams[i].paramValueArray[k]) > Number(that.pqcParams[i].wul) || Number(that.pqcParams[i].paramValueArray[k]) < Number(that.pqcParams[i].wll)){
          //          
          //           $(indexObj).addClass('styleTable')
          //           // indexObj.className ="ivu-table-column-center styleTable";
          //         }else{
          //           
                    
          //           indexObj.className = "ivu-table-column-center";
          //         }
          //       }
          //       // break;
          //     }
          //   }
          // })
          
          

          
          if(that.copy=='copy'){
              that.pqcId=null
              that.pqc.pqcId=null
              that.pqc.AuditStatus=0;
              that.pqcFirstRecordDto.inspectorId=that.pqc.CurrentOperatorId
            }
          if ( (that.pqc.AuditStatus == 2 || that.pqc.AuditStatus == 1 )&& res.data.firstRecordDto.reviewProcessId != null) {
            that.ReviewRecord(pqcId);
          }
          /**
           *  判断按钮，输入状态
           */
          //未提交
          if(that.pqc.AuditStatus == 0){
            if(that.pqc.CurrentOperatorId == that.pqcFirstRecordDto.inspectorId){
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
            if(that.pqcFirstRecordDto.result == 1){
              that.sub1 = false;
            }else{
              that.sub1 = true;
            }
          }

          //审核不通过
          if(that.pqc.AuditStatus == 3){
            if(that.pqc.CurrentOperatorId == that.pqcFirstRecordDto.inspectorId){
              that.sub2 = false;
            }else{
              that.sub2 = true;
            }
            that.sub1 = false;
          }   
          // 获取产品详情
          that.productDetailData(that.pqcFirstRecordDto.productId);
          that.initDefectTypeSelector();//获取缺陷数据
          that.initDefectGradeSelector();
          that.initDefectLocSelector();
          if(that.pqc.prodBatchId){that.getProdBatchData(that.pqc.prodBatchId,1)}
        });
      }
      if((!that.pqcId&&that.permsBtn.INSERT_PQC)||(that.pqcId&&that.permsBtn.UPDATE_PQC)){
        that.noPermsDis=false;
      }else{
        that.noPermsDis=true;
      }
    },
    loadSelectsData() {
      let that = this;
      that.loadStat.selectsDataLoading = true;
      this.$http
        .all([
          this.$http.get("/tenant/user", { params: { limit: 999999999 } }),
          this.$http.get("/basic/chkshift", { params: { limit: 99999999 } }),
          this.$http.get("/examinecenter/pqc/prodbatch",{ params: { limit: 99999999} }),
          // this.$http.get("/examinecenter/pqc/prodbatch",{ params: { limit: 99999999,query:"query=&productionState=0"} }),
          this.$http.get("/basic/reviewprocess", {params: { limit: 99999999 }}),
          // this.$http.get("/examinecenter/pqc/prodbatch",{ params: { limit: 99999999,query:"query=&productionState=1"} }),
        ])
        .then(function(resps) {
          // that.selects.productList = resps[0].data;
          that.selects.userList = resps[0].data;
          that.selects.chkShiftList = resps[1].data;
          that.selects.prodBatchList = resps[2].data;//拿到生产状态为0待生产的产品批号，2018/08/27要求拿到全部
          that.selects.reviewList = resps[3].data;
          that.selects.reviewList.unshift({reviewProcessId:null,name:i18n.t('noReview')})
          // for(var i in resps[5].data){
          //   that.selects.prodBatchList.push(resps[5].data[i]);//拿到生产状态为1生产中的产品批号
          // }
          that.loadStat.selectsDataLoading = false;
        });
    },
    ratechange() {
      let that = this;
      let isNullBadQuantity =that.pqcFirstRecordDto.badQuantity == null || that.pqcFirstRecordDto.badQuantity == "";
      let isNullSampleQuantity = that.pqc.sampleQuantity == null || that.pqc.sampleQuantity == "";
      //判断不良数和实际抽样数是否正整数
      if (!isNullSampleQuantity) {
        if (!that.pqc.sampleQuantity.toString().match("^[1-9][0-9]*$")) {
          this.$Notice.warning({
            title: i18n.t("pqc.tan"),
            desc: ""
          });
          return true;
        }
      }
      if (!isNullBadQuantity && !isNullSampleQuantity) {
        let x = parseInt(that.pqcFirstRecordDto.badQuantity) / parseInt(that.pqc.sampleQuantity) * 100;
        x = x.toFixed(2);
        that.pqc.badRate = x;
      }
      if (isNullBadQuantity || isNullSampleQuantity) {
        that.pqc.badRate = 0;
      }
    },

    // 首件数量输入框失去焦点时调用
    firstRecordNo() {
      this.pqcFirstRecordDto.sampleQuantity=this.pqcFirstRecordDto.firstQuantity
    },

    // 批量数输入框失去焦点时调用
    getAql() {
      let that = this;
      if(!that.pqcFirstRecordDto.batchQuantity){
        return;
      }
      if (!that.pqcFirstRecordDto.productId) {
        return;
      }
      let type=0;
      let data=[]
      if(that.sampling.plan=='GB/T2828.1-2012'){
        type=1;
      }
      if (that.pqcFirstRecordDto.batchQuantity == "") {
        data=[
          {
            code:that.sampling.plan,
            level:that.sampling.level,
            tolerance:that.sampling.rule,
            aql:that.sampling.crAql,
            num:0,
            type:type
          },
          {
            code:that.sampling.plan,
            level:that.sampling.level,
            tolerance:that.sampling.rule,
            aql:that.sampling.majAql,
            num:0,
            type:type
          },
          {
            code:that.sampling.plan,
            level:that.sampling.level,
            tolerance:that.sampling.rule,
            aql:that.sampling.minAql,
            num:0,
            type:type
          },
        ]
      } else {
          data=[
          {
            code:that.sampling.plan,
            level:that.sampling.level,
            tolerance:that.sampling.rule,
            aql:that.sampling.crAql,
            num:that.pqcFirstRecordDto.batchQuantity,
            type:type
          },
          {
            code:that.sampling.plan,
            level:that.sampling.level,
            tolerance:that.sampling.rule,
            aql:that.sampling.majAql,
            num:that.pqcFirstRecordDto.batchQuantity,
            type:type
          },
          {
            code:that.sampling.plan,
            level:that.sampling.level,
            tolerance:that.sampling.rule,
            aql:that.sampling.minAql,
            num:that.pqcFirstRecordDto.batchQuantity,
            type:type
          },
        ]
      }
    
      if(that.sampling.plan=='full') {
        that.sampling.samplingCount=that.pqcFirstRecordDto.batchQuantity
        // that.pqc.sampleQuantity=that.sampling.samplingCount
        return
      }
      if(that.sampling.plan=='percent') {
        that.sampling.samplingCount=that.pqcFirstRecordDto.batchQuantity*that.sampling.level/100
        // that.pqc.sampleQuantity=that.sampling.samplingCount
        return
      }
      that.$http.post('/sampling-plan/aql?samplingPlanParamDtos',data,that.headers).then((res) => {
        // that.sampling.crAC = res.data[0].samplingPlanAc
        that.sampling.crRE = res.data[0].samplingPlanRe
        that.sampling.samplingCount = res.data[0].sampleNum;
        // that.pqc.sampleQuantity=that.sampling.samplingCount
        // that.sampling.majAC = res.data[1].samplingPlanAc
        that.sampling.majRE = res.data[1].samplingPlanRe
        // that.sampling.minAC = res.data[2].samplingPlanAc
        that.sampling.minRE = res.data[2].samplingPlanRe

      })
    },
    generateParam(val) {//生產工序站點
      let that = this;
      let oldParams = JSON.parse(JSON.stringify(that.pqcParamsNew));
      that.pqcParams = [];
      for(let i in oldParams){
        if(oldParams[i].prodStageId == val){
          that.pqcParams.push(oldParams[i])
        }
      }
      if(that.pqcParams.length==0) {//如果生产工序站点和参数记录中的prodStageId不一致 要把数据还回来
        for(let i in oldParams) {
          that.pqcParams.push(oldParams[i])
        }
      }
    },
    //增加综合缺陷记录
    defects(defects,paramValuearray,paramsVal,ParamssVal) {//生成缺陷记录
        defects=[]
        for(let i in ParamssVal) {
          let item = ParamssVal[i]
          if(item.result==1) {
            let obj ={}
            obj.inspectionTypeId = item.inspectionId
            obj.inspectionTypeName = item.inspectionName
            defects.push(obj)
          }
        }
        for(let i in paramValuearray) {//遍历参数记录
          let item = paramValuearray[i]
          let Params = paramsVal[i]//参数记录对应的一行的信息
          let number = 0
          for(let j in item) {//字符转数值
            if(item[j]) {
              item[j]=Number(item[j])
            }
          }
          for(let i = 0;i<item.length;i++){//去掉空字符
              if(item[i]==''){
                  item.splice(i,1);
                  i=i-1;
              }
          }
          for(let i in item) {//遍历出标红数量
            if(item[i]>Params.usl || item[i]<Params.lsl) {
              number++
            }
          }
          let AS = item.sort((a, b) => a - b)
          let max = AS[item.length-1]//最大值
          let min = AS[0]//最小值
          let record
          if(min>Params.sl) {
            record = `规格:${Params.sl} 正${Params.positiveTolerance} 负${Params.negativeTolerance} 实测最大${max}`
          }
          if(max<Params.sl) {
            record = `规格:${Params.sl} 正${Params.positiveTolerance} 负${Params.negativeTolerance} 实测最小${min}`
          }
          if(min<=Params.sl && max >=Params.sl) {
            record = `规格:${Params.sl} 正${Params.positiveTolerance} 负${Params.negativeTolerance} 实测最大${max} 实测最小${min}`
          }
          if(max>Params.usl || min<Params.lsl) {//新增缺陷的一行数据
            let obj = {}
            obj.inspectionTypeId = Params.inspectionTypeId//检验项目
            obj.inspectionTypeName = Params.inspectionTypeName
            // obj.defectName = "尺寸NG"//缺陷名称
            // obj.sampleQuantity = Params.num//实抽样数
            // obj.defectCount = (number/item.length)*Params.num//缺陷数
            // obj.defectRate = ((number/item.length)*Params.num)/Params.num///缺陷率
            obj.describe = record
            defects.push(obj)
          }
        }
        return defects
    },
    addDefect() {
      let paramArr=[]
      for(let i in this.pqcParams) {//获得参数记录中的记录值
        let item = this.pqcParams[i]
        paramArr.push(item.paramValueArray)
      }
      this.initDefectTypeSelector();//获取缺陷数据
      this.pqcDefectTable=this.defects(this.pqcDefectTable,paramArr,this.pqcParams,this.attribute)
      return
      let that = this;
      that.discountData.tableData.pqcId = that.pqc.pqcId;
      let obj = JSON.parse(JSON.stringify(that.discountData.tableData));
      that.pqcDefectTable.push(obj);
      let index = that.pqcDefectTable.length;
      that.pqcDefectTable[index - 1].defectNumber = index - 1;
      // this.$nextTick(function(){
      //   $(".location .ivu-table-body").scrollTop((index-5)*43);
      //     $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');
      // })
      that.initDefectTypeSelector();//获取缺陷数据
      that.initDefectGradeSelector();
      that.initDefectLocSelector();
    },
    //检验设备类别
    // chkdevlistData(objId, index) {
    //   let that = this;
    //   // if(!objId){return}
    //   let url = "/basic/chkdevlist/";
    //   that.$http.get(url + objId).then(res => {
    //     let urlProduct = res.data;
    //     that.pqcDefectTable[index].chdDevTypeList = [];
    //     for (let x in urlProduct) {
    //       if (objId === urlProduct[x].chkDevTypeId) {
    //         that.pqcDefectTable[index].chkDevTypeId =
    //           urlProduct[x].chkDevTypeId;
    //         that.pqcDefectTable[index].chdDevTypeList.push(urlProduct[x]);
    //       }
    //     }
    //     that.$set(that.pqcDefectTable, index, that.pqcDefectTable[index]);
    //   });
    // },
    //产品详细查询
    productDetailData(val) {
      let that = this;
      let totalQuantity;
      let url = "/basic/product/detail/";
      let endDate = new Date(that.pqcFirstRecordDto.createTime).getTime();

      that.$http.get(url + val).then(res => {
        let productId = res.data.productId;
        let plan = res.data.settings.qc.pqc.aql.samplingPlanCode;
        let calculateUrl = "/business-rule/product/new-calculate-lenient-transfer?productId="+productId+"&qcType=pqc&endDate="+endDate;

        if(plan=='full') {
          that.sampling.samplingCount=that.pqcFirstRecordDto.batchQuantity 
          that.pqc.sampleQuantity=that.sampling.samplingCount
          that.sampling.crAql ='-' 
          that.sampling.majAql = '-'
          that.sampling.minAql ='-'
          return
        }
        if(plan=='percent') {
          that.sampling.samplingCount=that.pqcFirstRecordDto.batchQuantity*res.data.settings.qc.pqc.aql.inspectionStandard/100
          that.pqc.sampleQuantity=that.sampling.samplingCount
          that.sampling.crAql ='-' 
          that.sampling.majAql = '-'
          that.sampling.minAql ='-'
        }
        else{
          that.sampling.crAql = res.data.settings.qc.pqc.aql.crAql;
          that.sampling.majAql = res.data.settings.qc.pqc.aql.majAql;
          that.sampling.minAql = res.data.settings.qc.pqc.aql.minAql;
          that.sampling.level = res.data.settings.qc.pqc.aql.inspectionStandard;
          that.sampling.plan = res.data.settings.qc.pqc.aql.samplingPlanCode;
          that.$http.put(calculateUrl).then(resp => {
          that.sampling.rule = resp.data.lenientTransfer;
          if (resp.data.extStatus != null) {
            that.sampling.extStatus = resp.data.extStatus;
          }
        that.$http.get( "/business-rule/product/lenient-transfer?productId=" + productId + "&qcType=" + plan )
          .then(resp2 => {
            let that = this;
            let crUrl = "";
            let majUrl = "";
            let minUrl = "";
            let type = 0;
            let data=[]
            if(that.sampling.plan=='GB/T2828.1-2012'){
              type=1;
            }
            if (that.pqcFirstRecordDto.batchQuantity == "") {
              data=[
                {
                  code:that.sampling.plan,
                  level:that.sampling.level,
                  tolerance:that.sampling.rule,
                  aql:that.sampling.crAql,
                  num:that.pqcFirstRecordDto.batchQuantity,
                  type:type
                },
                {
                  code:that.sampling.plan,
                  level:that.sampling.level,
                  tolerance:that.sampling.rule,
                  aql:that.sampling.majAql,
                  num:that.pqcFirstRecordDto.batchQuantity,
                  type:type
                },
                {
                  code:that.sampling.plan,
                  level:that.sampling.level,
                  tolerance:that.sampling.rule,
                  aql:that.sampling.minAql,
                  num:that.pqcFirstRecordDto.batchQuantity,
                  type:type
                },
              ]
            } else {
              data=[
                {
                  code:that.sampling.plan,
                  level:that.sampling.level,
                  tolerance:that.sampling.rule,
                  aql:that.sampling.crAql,
                  num:that.pqcFirstRecordDto.batchQuantity,
                  type:type
                },
                {
                  code:that.sampling.plan,
                  level:that.sampling.level,
                  tolerance:that.sampling.rule,
                  aql:that.sampling.majAql,
                  num:that.pqcFirstRecordDto.batchQuantity,
                  type:type
                },
                {
                  code:that.sampling.plan,
                  level:that.sampling.level,
                  tolerance:that.sampling.rule,
                  aql:that.sampling.minAql,
                  num:that.pqcFirstRecordDto.batchQuantity,
                  type:type
                },
              ]
            }
            that.$http.post('/sampling-plan/aql?samplingPlanParamDtos',data,that.headers).then((res) => {
              // that.sampling.crAC = res.data[0].samplingPlanAc
              that.sampling.crRE = res.data[0].samplingPlanRe
              that.sampling.samplingCount = res.data[0].sampleNum;
              that.pqc.sampleQuantity=that.sampling.samplingCount
              // that.sampling.majAC = res.data[1].samplingPlanAc
              that.sampling.majRE = res.data[1].samplingPlanRe
              // that.sampling.minAC = res.data[2].samplingPlanAc
              that.sampling.minRE = res.data[2].samplingPlanRe
            })
          });
        })
        }
      });
    },
    //获取缺陷数据
    initDefectTypeSelector() {
      let that = this;
      let url = "/basic/defecttype?page=1&limit=9999";
      that.$http.get(url).then(res => {
        let urlProduct = res.data;
        that.pqc.DefectNameList = res.data;
      });
    },
    initDefectGradeSelector(Lvid, index) {
      let that = this;
      let url = "/basic/qltylv?page=1&limit=99999";
      that.$http.get(url).then(res => {
        let urlProduct = res.data;
        that.pqc.DefectGradeList = urlProduct;
        for (let x in that.pqc.DefectGradeList) {
          if (Lvid == that.pqc.DefectGradeList[x].qltyLvId) {
            that.pqcDefectTable[index].qltyLvId =
              that.pqc.DefectGradeList[x].qltyLvId;
          }
        }
      });
    },
    initDefectLocSelector() {
      let that = this;
      let url = "/basic/defectloc?page=1&limit=99999";
      that.$http.get(url).then(res => {
        that.pqc.DefectLocList = res.data;
        that.pqc.DefectLocList.unshift({defectLocId:i18n.t("pqc.wu"),name:i18n.t("pqc.wu")});
      });
    },
    // 缺陷记录->缺陷名称->切换项时调用的函数
    initInspectionSelector(obj, index) {
      let that = this;
      for (let x in that.pqc.DefectNameList) {
        if (obj == that.pqc.DefectNameList[x].defectTypeId) {
          that.pqcDefectTable[index].inspectionTypeName = that.pqc.DefectNameList[x].inspectionTypeName;
          that.initDefectGradeSelector(that.pqc.DefectNameList[x].qltyLvId,index);
          that.$http.get("/basic/inspectiontype/" +that.pqc.DefectNameList[x].inspectionTypeId)
            .then(resp => {
              // that.chkdevlistData(resp.data.chkDevTypeId, index);//已由检验项目带出检验设备类别下的检验设备，不需要再通过缺陷名称带出
            });
        }
      }
    },
    //缺陷记录 气泡提示框 删除的回调
    deleteTableSelected() {
      let that = this;
      this.pqc.paramSelect=true//将删除变为不可操作
      let ss = this.$refs.paramTable.getSelection();
      for (let i = 0; i < that.pqcDefectTable.length; i++) {
        for (let j = 0; j < ss.length; j++) {
          if (that.pqcDefectTable[i].defectNumber === ss[j].defectNumber) {
            that.pqcDefectTable.splice(i, 1);
          }
        }
      }
      this.pqc.TableLength=0
    },
    //获取当前登录人员信息 /tenant/user/profile
    CurrentOperator() {
      let that = this;
      let url = "/tenant/user/profile";
      that.$http.get(url).then(res => {
        that.pqc.CurrentOperatorId = res.data.userId;
        that.pqcFirstRecordDto.inspectorId = res.data.userId
      });
    },
    //评审记录
    ReviewRecord(pqcId) {
      let that = this;
      let scuss = false;
      let scussOne = false;
      let isList = false; //是否评审人员
      let url = "/examinecenter/pqc/firstrecord/reviewrecord/";
      that.$http.get(url + pqcId).then(res => {
        //判断人信息
        let JudgePerson = res.data[res.data.length - 1]; // 最后一条数据
        let Judgeindex = res.data.length - 1; //最后一条数据的下标
        this.sub3 = true
        for (let i = 0; i < res.data.length; i++) {
          if(!res.data[i].treatmentType || res.data[i].treatmentType == null){
            res.data[i].treatmentType = null;
          }
          if (res.data[i].reviewerId == that.pqc.CurrentOperatorId) {
            if (i != Judgeindex) {
              scuss = true;
            }
            if (i == 0) {
              scussOne = true;
            }
          }

          if (res.data[0].treatmentType == null) {
            res.data[i].disabled = true;
            if (scussOne == true) {
              res.data[0].disabled = false;
            }
          }
          if (JudgePerson.treatmentType != null || JudgePerson.treatmentType != null) {
            res.data[i].disabled = true;
            if (scuss == false) {
              res.data[Judgeindex].disabled = false;
            }
          }

          //按钮状态判断
            //判断当前登录人员 是否在 评审人员里面
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].reviewerId == that.pqc.CurrentOperatorId) {
                isList = true;
                break;
              }
            }
          if(isList){
            //第一条数据没填
            if(res.data[0].treatmentType == null){
              res.data[i].disabled = true; //所有人都不能填
              //如果当前登入人是 第一个人
              if(res.data[0].reviewerId == that.pqc.CurrentOperatorId){
                res.data[0].disabled = false;
              }
            }else{
              if(res.data[0].reviewerId == that.pqc.CurrentOperatorId){
                res.data[0].disabled = false;
              }
              if(i!=0){
                if(res.data[i].reviewerId == that.pqc.CurrentOperatorId){
                  res.data[i].disabled = false;
                  //如果最后一个人没填
                  if(res.data[Judgeindex].treatmentType == null || res.data[Judgeindex].treatmentType == null){

                  }else{
                    res.data[i].disabled = true;
                    res.data[0].disabled = true;
                    //当前登入人员是最后一个的时候
                    if(res.data[Judgeindex].reviewerId == that.pqc.CurrentOperatorId){
                      if(that.pqc.AuditStatus == 1 || that.pqc.AuditStatus == 2){
                        res.data[Judgeindex].disabled = false;
                      }else{
                        res.data[i].disabled = true;
                      }
                    }
                  }
                }
              }
            }
          }else{
            res.data[i].disabled = true;
          }
        }
        for (let i = 0; i < res.data.length; i++) {
          if(res.data[i].reviewTime){
            res.data[i].dataTime = that.timetrans(res.data[i].reviewTime/1000);
          }else{
            if(!res.data[i].disabled){
              res.data[i].dataTime = that.timetrans(new Date()/1000);
            }
          }
        }

          // 待审核状态
          if(that.pqc.AuditStatus == 1 || that.pqc.AuditStatus == 2){
            if(that.pqcFirstRecordDto.result == 0){
            that.sub2 = true;
            //当是评审人员
            if(isList){
              //当第一个人没填
              if(res.data[0].treatmentType == null){
                //当第一个人是 登录人员
                if(that.pqc.CurrentOperatorId == res.data[0].reviewerId){
                  that.sub1 = true;
                }else{
                  that.sub1 = false;
                }
              }else{
                //当第一个人填了,且最后一个人没填
                if(res.data[Judgeindex].treatmentType == null){
                  that.sub1 = true
                }else{
                  //当最后一个人填了
                  that.sub1 = false;
                  //当最后一个人填了，且当前登录人就是最后一个人的时候
                  if(that.pqc.CurrentOperatorId == res.data[Judgeindex].reviewerId){
                    that.sub1 = true;
                  }
                }
              }
            }else{
              that.sub1 = false;
            }
          }else{
            that.sub1 = false;
          }
          }else{
            that.sub1 = false;
          }
        that.HandleList = res.data;//审核人列表

        // 以上部分可以考虑隐藏,以下部分为重塑过程检验流程的代码
        let handlers = []
        for (var i = 0; i < 6; i++) {
          handlers.push(that.HandleList[i].reviewerId)
        }
        //若第1部分未审核
        // if (!that.HandleList[0].treatmentType||!that.HandleList[0].opinion) {
        // 审核处理方式未填写即为未审核
        if (!that.HandleList[0].treatmentType) {
          if (that.pqc.CurrentOperatorId == that.HandleList[0].reviewerId) {//若当前是审核人
            that.sub1 = true;
            for (var i = 0; i < that.HandleList.length; i++) {
                that.HandleList[i].disabled = true;
                that.HandleList[0].disabled = false;
            }
          } else {
            that.sub1 = false;
            for (var i = 0; i < that.HandleList.length; i++) {
                that.HandleList[i].disabled = true;
            }
            that.$Notice.warning({
              title: i18n.t('pqc.auditFirst'),
              desc: ''
            });
          }
        }
        // 若第1部分已审核，第6部分未判定
        // else if ((that.HandleList[0].treatmentType||that.HandleList[0].opinion) && (!that.HandleList[5].treatmentType&&!that.HandleList[5].opinion)) {
        // 审核处理方式已填写且判定处理方式未填写即为已审核
        else if (that.HandleList[0].treatmentType && !that.HandleList[5].treatmentType) {
          for (let i in that.HandleList) {
            if (that.HandleList[i].reviewerId==that.pqc.CurrentOperatorId) {//若是流程中的人
              that.HandleList[i].disabled = false;
            } else {
              that.HandleList[i].disabled = true;
            }
          }
          if (handlers.indexOf(that.pqc.CurrentOperatorId) !== -1) {//按钮
            that.sub1 = true;
          } else {
            that.sub1 = false;
          }
          
        }
        //若第6部分已判定
        // else if (that.HandleList[5].treatmentType||that.HandleList[5].opinion) {
        // 判定处理方式已填写即为已判定
        else if (that.HandleList[5].treatmentType) {
          if (that.pqc.CurrentOperatorId == that.HandleList[5].reviewerId) {//若是判定人
            that.sub1 = true;
            for (var i = 0; i < that.HandleList.length; i++) {
                that.HandleList[i].disabled = true;
                that.HandleList[5].disabled = false;
            }
          } else {
            that.sub1 = false;
            for (var i = 0; i < that.HandleList.length; i++) {
                that.HandleList[i].disabled = true;
            }
          }
          if(that.reviewState==4){
            that.HandleList[5].disabled=true;
            that.sub1 = false;
          }
        }
        for (var i = 0; i < that.HandleList.length; i++) {
          if(that.HandleList[i].disabled==false){
            that.HandleList[i].dataTime=that.HandleList[i].reviewTime?new Date(that.HandleList[i].reviewTime):new Date();
          }else{
            that.HandleList[i].dataTime=that.HandleList[i].reviewTime?new Date(that.HandleList[i].reviewTime):'';
          }
        }
      });
    },
    closePage() {
      this.$emit("off");
    },
    closeThenOpen(o){
      this.$emit("closeThenOpen",o);
    },

    reviewProcessBtn(val) {//评审流程调用的方法
      let that = this;
      if (val === that.pqcFirstRecordDto.reviewProcessId) {
        if (that.pqc.AuditStatus == 2 || that.pqc.AuditStatus == 1) {
          that.ReviewRecord(that.pqc.pqcId);
        }
      }

    },
    save() {
      let that = this;
      this.$emit("hidden")
      let params = [
        {type:'Empty',title:i18n.t('pqc.pn'),value:that.pqcFirstRecordDto.productId},//产品编号
        // {type:'Empty',title:i18n.t("pqc.ln"),value:that.pqcFirstRecordDto.prodBatchNo},//產品批號
        {type:'Empty',title:i18n.t('pqc.batchNumber'),value:that.pqcFirstRecordDto.batchQuantity},//檢驗批量
        {type:'NumNot0',title:i18n.t('pqc.batchNumber'),value:that.pqcFirstRecordDto.batchQuantity},//檢驗批量
        {type:'Empty',title:i18n.t("pqc.TheFirst"),value:that.pqcFirstRecordDto.firstQuantity},//首件数量
        {type:'NumNot0',title:i18n.t('pqc.FirstItemQuantity'),value:that.pqcFirstRecordDto.firstQuantity},
        {type:'Empty',title:i18n.t("pqc.pl"),value:that.pqcFirstRecordDto.prodLineId},//生產綫別
        // {type:'Empty',title:i18n.t("pqc.workTime"),value:that.pqc.chkShiftId},//檢驗班別
        {type:'Empty',title:i18n.t("pqc.pps"),value:that.pqcFirstRecordDto.prodProcessId},//生產工序站點
        // {type:'Empty',title:i18n.t("pqc.iqcNo"),value:that.pqc.pqcNo},//檢驗單號
        // {type:'No',title:i18n.t("pqc.iqcNo"),value:that.pqc.pqcNo},//檢驗單號
        {type:'Empty',title:i18n.t("pqc.inspector"),value:that.pqcFirstRecordDto.inspectorId},// 检验员
        {type:'Empty',title:i18n.t("pqc.time"),value:that.pqcFirstRecordDto.createTime},//時間
      ]
      /* if(that.pqcFirstRecordDto.result==0){
        params.push({type:'Empty',title:i18n.t("pqc.reviewTeam"),value:that.pqcFirstRecordDto.reviewProcessId})//評審流程
      } */
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
      // for(let i in that.pqcParams){
      //   that.pqcParams[i].paramId = that.pqcParams[i].prodChkParamId
      //   for(let j in that.pqcParams[i].paramValueArray){
      //     let paramsPqcParams = [
      //       {type: 'NumAll', title: i18n.t("pqc.paramsRecord"), value: that.pqcParams[i].paramValueArray[j]},
      //     ]
      //     let state = true;
      //     for (let i in paramsPqcParams) {
      //       state = that.$iqis.utils.formValidate(paramsPqcParams[i].type, paramsPqcParams[i].title, paramsPqcParams[i].value, (tips) => {
      //         that.$Notice.warning({title: tips})//,duration: 0
      //       })
      //       if (!state) {
      //         return;
      //         break;
      //       }
      //     }
      //   }
      // }
      // for (let i = 0; i < that.pqcDefectTable.length; i++) {
      //   // if (!that.pqcDefectTable[i].inspectionTypeId || !that.pqcDefectTable[i].defectTypeId || !that.pqcDefectTable[i].qltyLvId  || that.pqcDefectTable[i].sampleQuantity === '' || that.pqcDefectTable[i].defectCount === '') {
      //   //   that.$Notice.warning({title: i18n.t("pqc.qtxd") + (i + 1) + i18n.t("pqc.tqxj")});
      //   //     return;
      //   // }
      //   let paramsDefects = [
      //     // {type: 'NumNot0', title: i18n.t("pqc.sampleQuantity"), value: that.pqcDefectTable[i].sampleQuantity},
      //     {type: 'Num', title: i18n.t("pqc.dn"), value: that.pqcDefectTable[i].defectCount},
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
      let url = "/examinecenter/pqc/firstrecord";
      let Success = true;

      for(let i = 0; i<that.pqcDefectTable.length; i++){
        if(that.pqcDefectTable[i].defectLocId==i18n.t("pqc.wu")){//無
          that.pqcDefectTable[i].defectLocId='';
        }
        if(that.pqcDefectTable[i].chkDevId==i18n.t("pqc.wu")){
          that.pqcDefectTable[i].chkDevId='';
        }
      }
      for (let i in that.pqcParams){
        that.pqcParams[i]['paramId']=that.pqcParams[i].prodChkParamId;
      }
      if (Success == true) {
        that.pqcFirstRecordDto.createTime = new Date(that.pqcFirstRecordDto.createTime).getTime();
          for(let i in that.pqcDefectTable){
            that.pqcDefectTable[i].defectRecordId=null
            for(let j in that.pqcDefectTable[i].extInfoList){
              // that.pqcDefectTable[i].extInfoList[i].pqcDefectrecordExtInfoId=null
            }
          }
        let properties = []
        for(let i in that.attribute){
          let item = that.attribute[i];
          let o = {}
          o.inspectionExplain = item.inspectionExplain;
          o.currentAndParentName = item.currentAndParentName;
          o.propertyId = item.propertyId;
          o.inspectionId = item.inspectionId
          o.inspectionName = item.inspectionName;
          o.inspectionLevel = item.inspectionLevel;
          o.result = item.result
          properties.push(o)
        }
        let parmas = {
          defectRecordList: that.pqcDefectTable,
          firstRecordDto: that.pqcFirstRecordDto,
          paramRecordList: that.pqcParams,
          firstRecordPropertyDtos:properties
        };
        // 修改
        if (that.pqc.btnState == "put") {
          that.$http.put(url, parmas, that.headers).then(res => {
            that.$Message.success(i18n.t("pqc.ats"));//修改成功
            that.pqcFirstRecordDto.createTime =that.pqcFirstRecordDto.createTime? new Date(that.pqcFirstRecordDto.createTime):null;
            for(let i = 0; i<that.pqcDefectTable.length; i++){
              if(!that.pqcDefectTable[i].defectLocId){
                that.pqcDefectTable[i].defectLocId=i18n.t("pqc.wu");
              }
              if(!that.pqcDefectTable[i].chkDevId){
                that.pqcDefectTable[i].chkDevId=i18n.t("pqc.wu");
              }
            }
          });
          // 添加
        } else if (that.pqc.btnState == "post") {
          that.$http.post('/examinecenter/pqc/firstrecord', parmas, that.headers).then(res => {
            that.pqc.btnState="put"
            that.pqcFirstRecordDto.createTime =that.pqcFirstRecordDto.createTime? new Date(that.pqcFirstRecordDto.createTime).getTime():null;
            that.pqcFirstRecordDto.firstRecordId = res.data.firstRecordDto.firstRecordId;
            that.$Message.success(i18n.t("pqc.as"));
            for(let i = 0; i<that.pqcDefectTable.length; i++){
              if(!that.pqcDefectTable[i].defectLocId){
                that.pqcDefectTable[i].defectLocId=i18n.t("pqc.wu");
              }
              if(!that.pqcDefectTable[i].chkDevId){
                that.pqcDefectTable[i].chkDevId=i18n.t("pqc.wu");
              }
            }
            let o = {
              action: "open-tab",
              key:"qc-pqc-first-add-"+res.data.firstRecordDto.firstRecordId,
              title: i18n.t('pqc.aofr'),
              page:"page-exam-pqc-first-add",
              param: {firstRecordId:res.data.firstRecordDto.firstRecordId,type:res.data.firstRecordDto.type}
            }
            that.closeThenOpen(o)
            return;
          });
        }
      }
       
    },
    subBasic() {
      let that = this;
      let params = [
        {type:'Empty',title:i18n.t('pqc.pn'),value:that.pqcFirstRecordDto.productId},//产品编号
        // {type:'Empty',title:i18n.t("pqc.ln"),value:that.pqcFirstRecordDto.prodBatchNo},//產品批號
        {type:'Empty',title:i18n.t('pqc.batchNumber'),value:that.pqcFirstRecordDto.batchQuantity},//檢驗批量
        {type:'NumNot0',title:i18n.t('pqc.batchNumber'),value:that.pqcFirstRecordDto.batchQuantity},//檢驗批量
        {type:'Empty',title:i18n.t("pqc.TheFirst"),value:that.pqcFirstRecordDto.firstQuantity},//首件数量
        {type:'NumNot0',title:i18n.t('pqc.FirstItemQuantity'),value:that.pqcFirstRecordDto.firstQuantity},
        {type:'Empty',title:i18n.t("pqc.pl"),value:that.pqcFirstRecordDto.prodLineId},//生產綫別
        // {type:'Empty',title:i18n.t("pqc.workTime"),value:that.pqc.chkShiftId},//檢驗班別
        {type:'Empty',title:i18n.t("pqc.pps"),value:that.pqcFirstRecordDto.prodProcessId},//生產工序站點
        // {type:'Empty',title:i18n.t("pqc.iqcNo"),value:that.pqc.pqcNo},//檢驗單號
        // {type:'No',title:i18n.t("pqc.iqcNo"),value:that.pqc.pqcNo},//檢驗單號
        {type:'Empty',title:i18n.t("pqc.inspector"),value:that.pqcFirstRecordDto.inspectorId},// 检验员
        {type:'Empty',title:i18n.t("pqc.time"),value:that.pqcFirstRecordDto.createTime},//時間
      ]
      /* if(that.pqcFirstRecordDto.result==0){
        params.push({type:'Empty',title:i18n.t("pqc.reviewTeam"),value:that.pqcFirstRecordDto.reviewProcessId})//評審流程
      } */
      let state = true;
      for(let i in params){
        state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
          that.$Notice.warning({title:tips})
        })
        if(!state){
          return;
          break;
        }
      }
     
      // for(let i in that.pqcParams){
      //   that.pqcParams[i].paramId = that.pqcParams[i].prodChkParamId
      //   for(let j in that.pqcParams[i].paramValueArray){
      //     let paramsPqcParams = [
      //       {type: 'NumAll', title: i18n.t("pqc.paramsRecord"), value: that.pqcParams[i].paramValueArray[j]},
      //     ]
      //     let state = true;
      //     for (let i in paramsPqcParams) {
      //       state = that.$iqis.utils.formValidate(paramsPqcParams[i].type, paramsPqcParams[i].title, paramsPqcParams[i].value, (tips) => {
      //         that.$Notice.warning({title: tips})//,duration: 0
      //       })
      //       if (!state) {
      //         return;
      //         break;
      //       }
      //     }
      //   }
      // }
     
      // for (let i = 0; i < that.pqcDefectTable.length; i++) {
      //   if (!that.pqcDefectTable[i].inspectionTypeId || !that.pqcDefectTable[i].defectTypeId || !that.pqcDefectTable[i].qltyLvId || !that.pqcDefectTable[i].chkDevId || that.pqcDefectTable[i].sampleQuantity === '' || that.pqcDefectTable[i].defectCount === '') {          
      //       that.$Notice.warning({title: i18n.t("pqc.qtxd") + (i + 1) + i18n.t("pqc.tqxj")});
      //       return;
      //   }
      //   let paramsDefects = [
      //     {type: 'NumNot0', title: i18n.t("pqc.sampleQuantity"), value: that.pqcDefectTable[i].sampleQuantity},
      //     {type: 'Num', title: i18n.t("pqc.dn"), value: that.pqcDefectTable[i].defectCount},
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
      let url = "/examinecenter/pqc/firstrecord/applyaudit";
      let Success = true;
      //锁定提交按钮
      that.pqc.subLockdisabled = true;
      for(let i=0;i<that.pqcParams.length;i++){
        that.pqcParams[i].paramId = that.pqcParams[i].prodChkParamId
      }
      for(let i = 0; i<that.pqcDefectTable.length; i++){
        if(that.pqcDefectTable[i].defectLocId==i18n.t("pqc.wu")){
          that.pqcDefectTable[i].defectLocId='';
        }
        if(that.pqcDefectTable[i].chkDevId==i18n.t("pqc.wu")){
          that.pqcDefectTable[i].chkDevId='';
        }
      }
      if (Success == true) {
        that.pqcFirstRecordDto.createTime = new Date(that.pqcFirstRecordDto.createTime).getTime();
        let properties = []
        for(let i in that.attribute){
          let item = that.attribute[i];
          let o = {}
          o.inspectionExplain = item.inspectionExplain;
          o.currentAndParentName = item.currentAndParentName;
          o.propertyId = item.propertyId;
          o.inspectionId = item.inspectionId;
          o.inspectionName = item.inspectionName;
          o.inspectionLevel = item.inspectionLevel;

          // o.inspectionName = item.inspectionName;
          // o.inspectionLevel = item.inspectionLevel;
          o.result = item.result
          properties.push(o)
        }

        // for(let i in that.attribute){
        //   let item = that.attribute[i];
        //   let o = {}
        //   o.inspectionExplain = item.inspectionExplain;
        //   o.propertyId = item.propertyId;
        //   o.inspectionId = item.inspectionId
        //   o.inspectionName = item.inspectionName;
        //   o.inspectionLevel = item.inspectionLevel;
        //   o.result = item.result
        //   properties.push(o)
        // }
        let parmas = {
          defectRecordList: that.pqcDefectTable,
          firstRecordDto: that.pqcFirstRecordDto,
          paramRecordList: that.pqcParams,
          firstRecordPropertyDtos:properties
        };
        if (that.pqc.btnState == "put") {
          that.$http.post(url, parmas, that.headers).then(res => {
                that.$Message.success(i18n.t("pqc.cs"));
                that.closePage();
          });
        } else if (that.pqc.btnState == "post") {
          that.$http.post(url, parmas, that.headers).then(res => {
                that.$Message.success(i18n.t("pqc.cs"));
                that.closePage();
          });
        }
      }
    },
    subReview() {
      let that = this;
      for(let i=0;i<that.HandleList.length;i++){
        if(!that.HandleList[i].disabled&&!that.HandleList[i].treatmentType){
          that.$Notice.warning({title: i18n.t("pqc.toh")});
          return;
          break;
        }
        let state = true;
        state = that.$iqis.utils.formValidate('Word600',i18n.t("pqc.opinion"),that.HandleList[i].opinion,(tips)=>{
          that.$Notice.warning({title:tips})
        })
        if(!state){
          return;
        }
      }
      let resp = that.$iqis.utils.syncget('/examinecenter/pqc/firstrecord/'+that.pqc.pqcId);
      if(resp.data.firstRecordDto.state==0||resp.data.firstRecordDto.state==3){
        that.$Notice.warning({title:i18n.t('pqc.tew')})
        that.refreshData()
        return;
      }
      let resp2 = that.$iqis.utils.syncget('/examinecenter/pqc/firstrecord/reviewrecord/'+that.pqc.pqcId); 
      if(that.HandleList[5].disabled&&(resp2.data[5].opinion||resp2.data[5].treatmentType)){
        that.$Notice.warning({title:i18n.t("pqc.tth")})
        that.refreshData()
        return;
      }   
      for (let i = 0; i < that.HandleList.length; i++) {
        that.HandleList[i].reviewTime = new Date(
          that.HandleList[i].dataTime
        ).getTime();
      }
      let url = "/examinecenter/pqc/firstrecord/reviewrecord?firstRecordId=";
      that.$http.put(url + that.pqc.pqcId, that.HandleList, that.headers) .then(res => {
          that.$Message.success(i18n.t("pqc.cs"));
          that.closePage();
      });
    },
    endCase(){
      let that = this;
      that.$http.put('/examinecenter/pqc/firstrecord/reviewrecord/close/'+that.pqcId).then((res)=>{
        that.$Message.success(i18n.t("pqc.finalSuccess"))
        that.closePage()
      })
    },
    timetrans(date){
      var date = new Date(date*1000);//如果date为10位不需要乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
      return Y+M+D+h+m;
    },
    stylefun(params){
        let background = ''
        let wul = Number(params.row.wul)
        let wll = Number(params.row.wll)
        if(wul=="" || wll=="") {
          background='transparent'
          return background;
        }//上下限為空時 不標紅
        let i = Number(params.column.key.substring(4)) - 1
        let s_val = this.pqcParams[params.index].paramValueArray[i]
        let val = Number(s_val)
        if(s_val !='' && (val > wul || val < wll)){
          
            background='red'
        }else{
            background='transparent'
        }
        return background;
    },
    toFixed(event,scale) {
      if(!event.target.value)return
      event.target.value = Number(event.target.value).toFixed(scale)
    }
  },
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
  width: 94px;
}

.tt-tip-text {
  display: inline-block;
  width: 68px;
}

.review-block {
  margin-bottom: 20px;
}

</style>
<style>
.removeBorder .ivu-input {
  border: 0px solid red!important;
}
.removeBorder textarea.ivu-input{
  height: 32px !important;
  /* color:yellow; */
}
.isborder .ivu-input-disabled{
    background-color: transparent !important;
}
.aaa input{
  height: 40px;
}
</style>

