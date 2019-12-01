<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t("pqc.basicInformation")}}
      </div>

      <div class="iqis-page-block-body">
        <Row style="margin-top:10px;">
          <i-col span="24">
            <RadioGroup v-model="createBatchNo" @on-change="changeCreateBatchNo()">
              <Radio :disabled="createBatchNoDis" :label="1">{{$t('pqc.npbn')}}</Radio>
              <Radio :disabled="createBatchNoDis" :label="0">{{$t('pqc.selectBatch')}}</Radio>
            </RadioGroup>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.ln")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-show="createBatchNo===1" v-model="pqc.batchNo" :disabled='sub2||noPermsDis' style="width: 100%;"></i-input>
              <Select v-show="createBatchNo===0" v-model="pqc.prodBatchId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" @on-change="changeProdBatchId(pqc.prodBatchId,1)" :disabled="sub2||noPermsDis">
                <!-- <Option :value="''">无</Option> -->
                <Option v-for="item in selects.prodBatchList" :value="item.prodBatchId" :key="item.prodBatchId">{{ item.batchNo }}</Option>
              </Select>

            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.bq")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  :disabled="sub2||noPermsDis||createBatchNo===0" v-model="pqc.batchQuantity" @on-blur="getAql()" style="width: 100%;">
                <span slot="append">{{pqc.prodUnitName}}</span>
              </i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.pn")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :label="pqc.productNo" filterable remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pleaseChoose')" :disabled="sub2||noPermsDis" v-model="pqc.productId" @on-change="getProductName(pqc.productId)">
                <Option v-for="(data,index) in productList" :key="index" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select>
              <!-- <i-input  v-model="pqc.productNo" style="width: 100%;"></i-input> -->
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.name")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  disabled v-model="pqc.productName" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.pl")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="pqc.prodLineId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="sub2||noPermsDis">
                <Option v-for="item in selects.prodLineList" :value="item.prodLineId" :key="item.prodLineId">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.pps")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="pqc.prodProcessId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="sub2||noPermsDis" @on-change="generateParam(pqc.prodProcessId);">
                <!-- <Option :value='0' >产品终检</Option> -->
                <Option v-for="item in selects.prodProcessList" :value="item.prodProcessId" :key="item.prodProcessId">{{ item.prodProcessName }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.workTime")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="pqc.chkShiftId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="sub2||noPermsDis">
                <Option v-for="item in selects.chkShiftList" :value="item.chkShiftId" :key="item.chkShiftId">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>

        </Row>
        
        <Row type="flex" :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.iqcNo")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  :value="pqc.ipqcNo" v-model="pqc.ipqcNo" style="width: 100%;" :disabled="sub2||noPermsDis"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.time")}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker type="datetime" v-model="pqc.ipqcDate" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('pqc.pst')" style="width: 100%" :disabled="sub2||noPermsDis"></DatePicker>
            </div>

          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.inspector")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="pqc.inspectorId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="sub2||noPermsDis">
                <Option v-for="item in selects.userList" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
              </Select>
            </div>

          </i-col>
        </Row>
        <Row :gutter="24">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('pqc.SetInspectionPeriod')}}</div>
            <div class="iqis-page-block-ctrl" style="display:grid;grid-template-columns: 1fr 60px">
              <div style="display:grid;grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;">
                <TimePicker :disabled="timeValueDis||sub2||noPermsDis" v-for="(item,index) in timeIntervalUncertainty" :key="index" class="TimePicker" format="HH:mm" type="timerange" v-model="timeIntervalUncertainty[index]" :transfer="true"></TimePicker>
              </div>
             <Button type="primary" style="padding: 0;" @click="confirmTimes">{{timeValueDis?'编辑':'确定'}}</Button>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t("pqc.qcExplain")}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" :placeholder="i18n.t('pqc.pe')" v-model="pqc.qcExplain" :disabled="sub2||noPermsDis" style="width: 100%;"></i-input>
              </div>
            </i-col>
        </Row>
        <Row type="flex" :gutter="24">
          <i-col span="24">
           <div class="iqis-page-block-title">{{$t('pqc.ProductAccessories')}}</div>
           <dragImageView :productId="pqc.productId"></dragImageView>
          </i-col>
        </Row>
        <div style="margin-top:20px;background-color: #fafafa;padding: 24px 24px 4px 24px;" v-show="samplingPlanType==0">
          <table class="tt-tip-table" style="width: 100%;">
            <tr>
              <td style="width: 40%;">
                <!-- <div class="tt-tip-row"><span class="tt-tip-label">抽样方案：</span>{{sampling.plan}}</div> -->

                <div class="tt-tip-row">
                  <span class="tt-tip-label">{{$t("pqc.samplingPlan")}}：</span>
                  <span v-if="sampling.plan=='105E'">{{$t("pqc.s105e")}}</span>
                  <span v-if="sampling.plan=='Z1-4'">{{$t("pqc.z14")}}</span>
                  <span v-if="sampling.plan=='0D'">{{$t("pqc.zod")}}</span>
                  <span v-if="sampling.plan=='GB/T2828.1-2012'">{{$t("pqc.gb")}}</span>
                  <span v-if="sampling.plan=='full'">{{$t('product.fullSampling')}}</span>
                  <span v-if="sampling.plan=='percent'">{{$t('product.percentSampling')}}</span>
                </div>
                <div class="tt-tip-row"><span class="tt-tip-label">{{$t("pqc.inspectionStandard")}}：</span>
                  <span v-if="sampling.plan=='0D'&&sampling.level==1">{{$t("pqc.zd")}}</span>
                  <span v-else-if="sampling.plan!='percent'&&sampling.level==1">{{$t("pqc.cl1")}}</span>
                  <span v-else-if="sampling.plan!='percent'&&sampling.level==2">{{$t("pqc.cl2")}}</span>
                  <span v-else-if="sampling.plan!='percent'&&sampling.level==3">{{$t("pqc.cl3")}}</span>
                  <span v-else-if="sampling.plan!='percent'&&sampling.level==101">{{$t("pqc.sls1")}}</span>
                  <span v-else-if="sampling.plan!='percent'&&sampling.level==102">{{$t("pqc.sls2")}}</span>
                  <span v-else-if="sampling.plan!='percent'&&sampling.level==103">{{$t("pqc.sls3")}}</span>
                  <span v-else-if="sampling.plan!='percent'&&sampling.level==104">{{$t("pqc.sls4")}}</span>
                  <span v-else-if="!sampling.level">-</span>
                  <span v-else>{{sampling.level}}%</span>

                </div>
                <div class="tt-tip-row"><span class="tt-tip-label">{{$t("pqc.staus")}}：</span>
                  <span v-if="sampling.rule=='NORMAL'">{{$t("pqc.normal")}}</span>
                  <span v-else-if="sampling.rule=='SOFTEN'">{{$t("pqc.Relaxation")}}</span>
                  <span v-else-if="sampling.rule=='STRICTER'">{{$t("pqc.strict")}}</span>
                  <span v-else>-</span>
                </div>
                <div class="tt-tip-row"><span class="tt-tip-label">{{$t("pqc.nos")}}：</span>{{sampling.samplingCount}}</div>
              </td>
              <td style="width: 40%;">
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
              <td style="width: 20%;">
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
        </div>
        <Row style="margin-top:20px;background-color: #fafafa;padding: 24px 24px 4px 24px;" v-show="samplingPlanType==1">
          <i-col span="8" class="tt-tip-row">
            <span class="tt-tip-label">{{$t("pqc.staus")}}：</span>
            <span v-if="sampling.rule=='NORMAL'">{{$t("pqc.normal")}}</span>
            <span v-else-if="sampling.rule=='SOFTEN'">{{$t("pqc.Relaxation")}}</span>
            <span v-else-if="sampling.rule=='STRICTER'">{{$t("pqc.strict")}}</span>
            <span v-else>-</span>
          </i-col>
          <i-col span="8">
            <div class="tt-tip-card" v-if="sampling.extStatus != ''">
              <span class="tt-tip-label" style="margin-bottom: 20px;">{{$t("pqc.prompted")}}:</span>
              <span  v-if="sampling.extStatus==='exempted'" style="color: #418FEE;"><Icon type="ios-checkmark-outline"></Icon>{{$t("pqc.tph")}}</span>
              <span v-if="sampling.extStatus==='pending'" style="color: red;"><Icon type="ios-checkmark-outline"></Icon>{{$t("pqc.tphr")}}</span>
            </div>
          </i-col>
        </Row>

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
          <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
            <Button type="primary" @click="changeShowNow()">{{showNow?i18n.t('pqc.ShowFullList'):i18n.t("pqc.DisplayInspectionPeriod")}}</Button>
          </div>
        </div>
        <div class="iqis-page-block-table">
          <!-- <Table :no-data-text="i18n.t('pqc.noData')" ref="paramTable" class="iqis-inline-editor-table noHeight noBorder" id='styleTable'  @on-selection-change="paramTableSelectChange" border stripe -->
          <Table :no-data-text="i18n.t('pqc.noData')" ref="paramTable" class="noBorder" id='styleTable' @on-row-click="paramslist"  @on-selection-change="paramTableSelectChange" border stripe
                 :loading="table.param.loading" v-drag-table-column="table.param.columns" :columns="table.param.columns" :data="pqcParams" >
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
                <Button type="ghost" icon="trash-a" v-if='!sub2' :disabled="sub2||noPermsDis">{{$t("pqc.delete")}}</Button>
              </Poptip>
            </div>
          </div>
          <div class="iqis-page-block-table">
            <Table :no-data-text="i18n.t('pqc.noData')" ref="paramTable" class="iqis-inline-editor-table defectTable noHeight noBorder location"  @on-selection-change="defectTableSelectChange" border stripe
                   :loading="table.defect.loading" v-drag-table-column="table.defect.columns" :columns="table.defect.columns" :data="pqcDefectTable" >
              <Button :disabled='sub2||noPermsDis'  @click="addDefect" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;"  icon="plus">自动生成缺陷记录</Button>
            </Table>
          </div>

          <Row type="flex" :gutter="24">
            <!-- <i-col span="4"  style="width: 20% !important;">
              <div class="iqis-page-block-label">{{$t("pqc.actualSampling")}}</div>
              <div class="iqis-page-block-ctrl"> -->
                <!-- <i-input  :placeholder="i18n.t('pqc.pe')" v-model="pqc.sampleQuantity" style="width: 100%;" @on-blur="ratechange" :disabled="sub2"></i-input> -->
                <!-- <InputNumber :max="" :min="0" v-model="pqc.sampleQuantity" :number="true" @on-blur="ratechange" :disabled='sub2'  style="width: 100%;"></InputNumber> -->
                <!-- <InputNumber :max="Number(pqc.batchQuantity)" :min="0" v-model="pqc.sampleQuantity"  :number="true" :placeholder="i18n.t('pqc.pe')" :disabled='sub2 || pqc.batchQuantity==""||noPermsDis'  style="width: 100%;" v-on:on-change ="ratechange;"></InputNumber>

              </div>
            </i-col> -->
            <!-- <i-col span="4"  style="width: 20% !important;">
              <div class="iqis-page-block-label">{{$t("pqc.badNumber")}}</div>
              <div class="iqis-page-block-ctrl"> -->
                <!-- <InputNumber :max="pqc.sampleQuantity" :min="0" v-model="pqc.badQuantity" :number="true" @on-blur="ratechange" :disabled='sub2'  style="width: 100%;"></InputNumber> -->
                <!-- <InputNumber :max="Number(pqc.sampleQuantity)" :min="0" v-model="pqc.badQuantity"  :number="true" :placeholder="i18n.t('pqc.pe')" :disabled='sub2 || pqc.sampleQuantity==""||noPermsDis'  style="width: 100%;" v-on:on-change ="ratechange;changeResult(pqc.badQuantity)"></InputNumber> -->
                <!-- <i-input  :placeholder="i18n.t('pqc.pe')" v-model="pqc.badQuantity" style="width: 100%;" @on-blur="ratechange" :disabled="sub2"></i-input> -->

              <!-- </div>
            </i-col> -->
            <!-- <i-col span="4"  style="width: 20% !important;">
              <div class="iqis-page-block-label">{{$t("pqc.defectRate")}}(%)</div>
              <div class="iqis-page-block-ctrl">
                <i-input  placeholder="-" :readonly="true" v-model="reckonBadRate" style="width: 100%;" :disabled="true"></i-input>
              </div>
            </i-col> -->
            <i-col span="4"  style="width: 20% !important;">
              <div class="iqis-page-block-label">{{$t("pqc.tr")}}</div>
              <div class="iqis-page-block-ctrl">
                <Select v-model="pqc.result" :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="sub2||noPermsDis">
                  <Option v-for="item in selects.resultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="4" style="width: 20% !important;">
              <div v-if="pqc.result==0">
                <div class="iqis-page-block-label">{{$t("pqc.reviewTeam")}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select v-model="pqc.reviewProcessId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" @on-change="reviewProcessBtn(pqc.reviewProcessId)" :disabled="sub2||noPermsDis">
                    <!-- 不发起评审流程 -->
                    <!-- <Option :value="null">{{$t('noReview')}}</Option> -->
                    <Option v-for="(item,index) in selects.reviewList" :value="item.reviewProcessId" :key="index">{{ item.name }}</Option>
                  </Select>
                </div>
              </div>
            </i-col>
          </Row>

        </div>
      </div>

      <div class="iqis-page-block" v-if="sub2&&pqc.reviewProcessId !=null&&pqc.result==0">
        <div v-if="pqc.reviewProcessId !=null&&pqc.result==0&&sub2">
          <div class="iqis-page-block" v-if="handListShow">
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
              <Row type="flex" :gutter="24">
                <i-col span="24">
                  <div class="iqis-page-block-label">结案说明</div>
                  <div class="iqis-page-block-ctrl">
                    <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="pqc.caseExplain" :disabled='this.reviewState!=3||this.pqc.inspectorId!=this.pqc.CurrentOperatorId||this.noPermsDis' style="width: 100%;"></i-input>
                  </div>
                </i-col>
              </Row>
            </div>
          </div>
        </div>
      </div>
      <div v-if="reviewState==4" style="text-align:center;color:#999;font-size:16px;font-weight: bold;">{{$t('pqc.reviewProcess')}}</div>
    </div>

    <IqisAffix placement="bottom" :offset="0">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" v-if="reviewState==3&&pqc.CurrentOperatorId == pqc.inspectorId" @click="endCase">{{$t('pqc.end')}}</Button>
        <Button type="primary" @click="subReview()" v-if="sub1&&permsBtn.UPDATE_PQC">{{$t("pqc.submit")}}</Button>
        <Button type="primary" @click="subBasic()" v-if="!sub2&&permsBtn.UPDATE_PQC">{{$t("pqc.submit")}}</Button>
        <Button type="primary" @click="save" :loading="loadStat.saveLoading" v-if="!sub2&&!noPermsDis">{{$t("pqc.save")}}</Button>
        <Button type="ghost" @click="closePage">{{$t("pqc.cancel")}}</Button>
      </div>
    </IqisAffix>
    <!--end blocks-->
    <div class="page-end" style="padding-bottom: 40px;padding-top: 30px;"></div>
    <Spin size="large" fix v-if="loadStat.pqcDataLoading || loadStat.selectsDataLoading"></Spin>

  </div>
</template>
<script>
import ICol from "iview/src/components/grid/col";
import $ from "jquery"
import SessionStorage from '@/utils/sessionStorage'
import NestedTables from '../../../components/nestedTables/NestedTabels'
import dragImageView from '../../../components/imageview/dragImageView'

export default {
  components: { ICol,NestedTables,dragImageView},
  props: ["params", "tabKey"],
  data() {
    let vm = this;
    return {
      currentTimeIndex:null,
      oldTimeData:[],
      showNow:true,
      timeValueDis:false,
      timeIntervalUncertainty:[[],[],[],[],[],[]],
      inputs:['','',''],
      finalPorcessId:null,
      mark:false,
      del:0,
      ext:[],
      aa:0,
      tag:'pqc',
      paramsIndex:0,
      paramsList:null,
      sampleNum:0,
      productProperty:'',
      productPropertyCache:'',
      productIdCache:'',
      newDate:new Date().getFullYear().toString()+(new Date().getMonth()+1).toString()+new Date().getDate().toString(),
      createBatchNo:1,
      createBatchNoDis:false,
      i18n:window.i18n,
      refreshFlag:false,
      locale:null,
      ipqcId:"",
      pqcParamsNew:[],
      pqcAttribute:[],
      productList: [],
      productId2:'',
      handListShow:false,
      maxlength:9,
      sub1:false,
      sub2:false,
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
        customerList: [],
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
      pqcParamsRefresh:[],
      pqcDefectTable: [],
      HandleList: [],
      discountData: {
        rows: [{}],
        tableData: {
          defectRecordId: "",
          ipqcId: "",
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
      "pqcPropertyRecordList": [],
      paramValuearray:[],
      istrue:true,
      istrues:true,
      pqc: {
        timeIntervalArray:[[],[],[],[],[],[]],
        caseExplain:"",
        qcExplain:'',
        batchNo:new Date().getFullYear().toString()+(new Date().getMonth()+1).toString()+new Date().getDate().toString(),
        productName:'',
        productNo:'',
        productSpec:'',
        prodBatchId:'',
        prodProcessId:"",
        prodLineId:"",
        chkShiftId:'',
        ipqcDate:vm.timetrans(new Date()/1000),
        auditorId: "",
        badQuantity: 0,
        badRate:0,
        batch: "",
        createTime: "",
        customerId:'',
        inspectionStandard: "",
        inspectorId: "",
        ipqcId: "",
        ipqcNo: "",
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
        batchQuantity: "",
        batchQuantity: "",
        sampleQuantity: 0,
        samplingPlan: "",
        state: "",
        strictStandard: "",
        basicDisabled: true,
        AuditStatus: 0,
        DefectNameList: [],
        DefectGradeList: [],
        DefectLocList: [],
        chdDevTypeList: [],
        TableLength: 0,
        paramSelect: false,
        btnState: "post",
        CurrentOperatorId: "",
        subLockdisabled: false
      },
      attribute:[],
      

      reviews: {
        auditor: {
          disabled: true,
          ipqcId: "",
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
          ipqcId: "",
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
          ipqcId: "",
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
          ipqcId: "",
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
          ipqcId: "",
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
          ipqcId: "",
          opinion: "",
          reviewRecordId: "",
          reviewTime: "",
          reviewerId: "",
          reviewerName: "",
          role: "auditor",
          treatmentType: ""
        }
      },
      paramValue:'',
      table: {
        param: {
          attribute:[
            {
              title: i18n.t('iqc.no'),
              width: 80,
              render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align: "center",
              minWidth: 40,
              // maxWidth: 40
            },
            {
              title: "生产工序站点",
              width: 120,
              // render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align: "center",
              minWidth: 40,
              key:"prodProcessName"
              // maxWidth: 40
            },
            {
              title: "检验项目",
              width: 120,
              // render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align: "center",
              minWidth: 40,
              key:"inspectionName"
              // maxWidth: 40
            },
            {
              title: "检验标准",
              // width: 40,
              // render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align: "center",
              minWidth: 40,
              key:"inspectionLevel"
              // maxWidth: 40
            },
            {
              title: "检验结果",
              width: 80,
              // render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align: "center",
              minWidth: 40,
              key:'result',

              // maxWidth: 40
              render:(h,params) => {
                let that = this;
                return h('Select',{
                  props:{disabled:that.sub2||that.noPermsDis,value:that.attribute[params.index].result || 0},
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
              title: "检验说明",
              // width: 40,
              // render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align: "center",
              minWidth: 40,
              key:'inspectionExplain',
              // maxWidth: 40
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
          ],
          selected: [],
          loading: false,
          columns: [
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
              render: (h, params) => {
                let _this = this;
                let texts = "";
                texts = params.row.prodProcessName;
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
              title: i18n.t("pqc.inspection"),
              align: "center",
              width:70,
              minWidth:this.$store.state.locale=='zh_CN'?70:40,
              ellipsis: true,
              //required:true,
              key: "inspectionTypeName",
              render: (h, params) => {
                let _this = this;
                let texts = "";
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
              title: i18n.t('pqc.chkDev'),
              align: "center",
              width:80,
              minWidth:this.$store.state.locale=='zh_CN'?80:120,
              ellipsis: true,
              //required:true,
              key: "chkDevName",
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
              // title: i18n.t("pqc.sn"),
              title: i18n.t('pqc.nos'),
              align: "center",
              minWidth:this.$store.state.locale=='zh_CN'?60:80,
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
          ]
        },
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
            {
              title: i18n.t("pqc.inspection"),
              align: "center",
              width:120,
              minWidth:120,
              ellipsis: true,
              key: "inspectionTypeName",//inspectionTypeName
              // render: (h, params) => {
              //   let _this = this;
              //   let texts = "";
              //   texts = params.row.inspectionTypeName;
              //   return h(
              //     "div",
              //     {
              //       props: {}
              //     },
              //     texts
              //   );
              // }
              // render:vm.$iqis.utils.tableHelper.editable.buildCascaderCell4(vm,(vm)=>{return vm.selects.inspectionTypes},"inspectionTypeId","name",null,this.getDefectNameList,'sub2'),
              // render:(h, params)=>{
              //     let ret =  vm.$iqis.utils.tableHelper.editable.buildCascaderCell4(vm,(vm)=>{return vm.selects.inspectionTypes},
              //       "inspectionTypeId",
              //       "name",
              //       null,
              //       vm.getDefectNameList,
              //       vm.sub2||vm.noPermsDis,
              //       // vm.inputDisbale || vm.noPermsDis
              //     )
              //     return ret(h,params);
              //   }
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
                      disabled:
                        this.sub2||this.noPermsDis,
                      value: this.pqcDefectTable[params.index].defectTypeId
                    },
                    on: {
                      "on-change": event => {
                        this.pqcDefectTable[params.index].defectTypeId = event;
                        // this.initInspectionSelector(
                        //   this.pqcDefectTable[params.index].defectTypeId,
                        //   params.index
                        // );
                      }
                    }
                  },
                  _this.pqc.DefectNameList.map(function(type) {
                    return h(
                      "Option",
                      {
                        props: { value: type.defectTypeId, label: type.name }
                      },
                      type
                    );
                  })
                );
              }
            },
            {
              title: "描述",
              minWidth:80,
              width:400,
              align: "center",
              ellipsis: true,
              key: "describe",
              render: (h, params) => {
                var me = this;
                return h("div", [
                  h("Input", {
                    props: {
                      disabled:
                        this.sub2||this.noPermsDis,
                      type: "text",
                      value: me.pqcDefectTable[params.index].describe
                    },
                    on: {
                      "on-blur": event => {
                        this.pqcDefectTable[params.index].describe =
                          event.target.value;
                          this.pqc.badQuantity=0;
                          for(let i in this.pqcDefectTable){
                            this.pqc.badQuantity+=Number(this.pqcDefectTable[i].describe);
                          }
                          this.changeResult(this.pqc.badQuantity)
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
            //           value: this.pqcDefectTable[params.index].defectLocId,
            //           placeholder:i18n.t('Unlimited')
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
            //           placeholder: i18n.t('Unlimited'),
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
            {
              title: i18n.t("pqc.sampleQuantity"),
              align: "center",
              minWidth:80,
              ellipsis: true,
              key: "sampleQuantity",
              render: (h, params) => {
                var me = this;
                return h("div", [
                  h("Input", {
                    props: {
                      disabled:
                        this.sub2||this.noPermsDis,
                      type: "text",
                      value: me.pqcDefectTable[params.index].sampleQuantity
                    },
                    on: {
                      "on-blur": event => {
                        this.pqcDefectTable[params.index].sampleQuantity =
                          event.target.value;
                        // this.pqc.sampleQuantity=0;
                        // for(let i in this.pqcDefectTable){
                        //   this.pqc.sampleQuantity+=Number(this.pqcDefectTable[i].sampleQuantity);
                        // }
                      }
                    }
                  })
                ]);
              }
            },
            {
              title: i18n.t("pqc.dn"),
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
                          this.pqc.badQuantity=0;
                          for(let i in this.pqcDefectTable){
                            this.pqc.badQuantity+=Number(this.pqcDefectTable[i].defectCount);
                          }
                          this.changeResult(this.pqc.badQuantity)
                      }
                    }
                  })
                ]);
              }
            },
            {
              title: "缺陷率",
              minWidth:80,
              align: "center",
              ellipsis: true,
              key: "defectRate",
              render: (h, params) => {
                var me = this;
                return h("div", [
                  h("Input", {
                    props: {
                      disabled:
                        this.sub2||this.noPermsDis,
                      type: "text",
                      value: me.pqcDefectTable[params.index].defectRate
                    },
                    on: {
                      "on-blur": event => {
                        this.pqcDefectTable[params.index].defectRate =
                          event.target.value;
                          this.pqc.badQuantity=0;
                          for(let i in this.pqcDefectTable){
                            this.pqc.badQuantity+=Number(this.pqcDefectTable[i].defectRate);
                          }
                          this.changeResult(this.pqc.badQuantity)
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
                        // this.pqcDefectTable[params.index] =params.row
                      }
                    }
                  })
                ]);
              }
            },
            // {
            //   title: i18n.t("pqc.picture"),
            //   // minWidth:80,
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
            //         // "edit":vm.pqc.AuditStatus == 2 || vm.pqc.AuditStatus == 1?false:true,
            //         "edit":vm.picBtnShow,
            //         "maxSize":10240,
            //         "fileType":['jpg','jpeg','png'],
            //         "fileCount":5,
            //         'chartTypeShow':"true",
            //         //disabled:this.other.basicD1D2Show,
            //       },
            //       on: {
            //         input: (val) => {
            //           var obj = {'defectrecordExtInfoName':val[0].name,'defectrecordExtInfoType':val[0].mime,'url':val[0].url};
            //           vm.pqcDefectTable[data.index].extInfoList.push(obj);

            //           //vm.cellDefectEditorEnd(val, data.column.key, data.index)
            //         },
            //         del: (val) => {
            //           vm.pqcDefectTable[data.index].extInfoList.splice(val,1);
            //           //vm.cellDefectEditorEnd(val, data.column.key, data.index)
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
      sampleRefreshFlag1:false,
      sampleRefreshFlag2Num:2,
      samplingPlanType:0,
      changeProductIdFlag:3,//默认添加进来是3，表示不收修改第一次和第二的影响
      changeProductIdFlag1:3,//默认添加进来是3，表示不收修改第一次和第二的影响

      finalPorcessFlag:0
    }
  },
  created() {
    let that=this;
    var y = new Date().getFullYear().toString()
    var m = new Date().getMonth()>8?(new Date().getMonth()+1).toString():'0'+(new Date().getMonth()+1).toString()
    var d = new Date().getDate()>9?new Date().getDate().toString():'0'+new Date().getDate().toString()
    // this.newDate=new Date().getFullYear().toString()+new Date().getMonth()>8?(new Date().getMonth()+1).toString():'0'+(new Date().getMonth()+1).toString()+new Date().getDate()>9?new Date().getDate().toString():'0'+new Date().getDate().toString(),
    this.newDate = y+m+d
    let copy = that.$props && that.$props.tabKey;
    that.copy = copy.split('-')[2];
    this.locale = SessionStorage.get("language-main");
    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.refreshData();
    
    
  },
  watch: {
    "picBtnShow":function(flag){
      if(!flag){
        $('.defectTable').addClass('picBtnHide')
      }else{
        $('.defectTable').removeClass('picBtnHide')
      }
    },
    "finalPorcessId":function(newVal){
      let that = this;
      that.generateParam(that.pqc.prodProcessId)
    },
    "pqcParams":{
      handler(newVal,oldVal){
        let that = this;
        for(let i= 0; i < newVal.length; i++){
            that.pqcParams[i].expand = true
          }
      },
      immediate:true
    }
  },
  computed: {

    //计算不良率
    reckonBadRate() {
      if (
          this.pqc.sampleQuantity !== "" &&
          this.pqc.badQuantity !== ""
        ) {
        if (
          this.pqc.sampleQuantity == 0 &&
          this.pqc.badQuantity == 0
        ) {
          return "0";
        } else if (
          this.pqc.badQuantity == null &&
          this.pqc.sampleQuantity == null
        ) {
          return "";
        } else {
          let x = (this.pqc.badQuantity / this.pqc.sampleQuantity * 100 );
          x = Math.floor(x * 100 ) / 100
          if(x>100){
            return 100;
          }else{
            return x;
          }
        }
      }
    },
    pqcResult(){
      if(this.pqc.badQuantity==0){
        return 1;
      }else{
        return 0;
      }
    },
    picBtnShow(){
      if(!this.sub2&&!this.noPermsDis){
        return true
      }else{
        return false
      }
    }
  },
  methods: {
    confirmTimes(){
      for(let x=0;x<this.timeIntervalUncertainty.length;x++){
        if(!this.timeIntervalUncertainty[x][0]){
          continue
        }
        let start = this.timeIntervalUncertainty[x][0].replace(":","")
        let end = this.timeIntervalUncertainty[x][1].replace(":","")
        
        for(let y=x+1;y<this.timeIntervalUncertainty.length;y++){
          if(!this.timeIntervalUncertainty[y][0]){
            continue
          }
          let itemStart = this.timeIntervalUncertainty[y][0].replace(":","")
          let itemEnd = this.timeIntervalUncertainty[y][1].replace(":","")
          if((itemStart>=start&&itemStart<end)||(itemEnd<=end&&itemEnd>start)){
            this.$Notice.warning({title:"检验时段不能有重合"})
            return;
          }
        }
      }
      this.timeValueDis=!this.timeValueDis;
      this.showNow=!this.showNow;
      this.pqc.timeIntervalArray = JSON.parse(JSON.stringify(this.timeIntervalUncertainty))
      
      this.changeShowNow()
    },
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
    changeShowNow(){  
      let that = this;
      that.showNow = !that.showNow//改变显示方式，改变后true为显示当前时段，false为显示完整列表
      if(that.showNow){//显示检验时段
        that.oldTimeData = JSON.parse(JSON.stringify(that.pqcParams))
        let m = Number((new Date().getHours()).toString())>9?(new Date().getHours()).toString():0+(new Date().getHours()).toString()
        let s = Number((new Date().getMinutes()).toString())>9?(new Date().getMinutes()).toString():0+(new Date().getMinutes()).toString()
        let now = Number(m+s)//当前分秒
        
        // 提出当前列
        that.table.param.columns.splice(11)
        for(let i in that.pqc.timeIntervalArray){
          let start = Number(that.pqc.timeIntervalArray[i][0].replace(":",""))
          let end = Number(that.pqc.timeIntervalArray[i][1].replace(":",""))
          if(start<now&&now<=end){//比较得出当前时段
            that.currentTimeIndex = i
            that.table.param.columns.push({
              title: that.pqc.timeIntervalArray[i][0]+'~'+that.pqc.timeIntervalArray[i][1],
              key:'time'+Number(i)+Number(1)+'Value',
              minWidth:77*that.inputs.length,
              render: (h, params) => {
                return h("div",[
                  that.inputs.map(function(item,index,data){
                    return h("Input", {
                      props: {
                          type: "text",
                          value:that.pqcParams[params.index].timeValueArray[i][index]
                      },
                      style:{
                        width:'75px',
                        borderRight:index!=2?'1px solid #e9eaec':'',
                        background:that.backgroundColor(that.pqcParams[params.index].timeValueArray[i][index],params.row.usl,params.row.lsl)
                      },
                      on: {
                          "on-blur": event => {
                              that.pqcParams[params.index].timeValueArray[i][index] =event.target.value;
                              $(event.target).parent('.ivu-input-wrapper.ivu-input-type').css('background',that.backgroundColor(that.pqcParams[params.index].timeValueArray[i][index],params.row.usl,params.row.lsl,event.target))
                          },
                          "on-keydown":event=>{
                            if(event.keyCode==13) {
                              // $(event.target).parents('td').next().find('input').focus()
                              if(index==2) {
                                $(event.target).parents('td').next().find('.ivu-input:eq(0)').focus()
                              }else{
                                $(event.target).parent().next().find('input').focus()
                              }
                            }
                          },
                          "on-keyup":event=>{
                            if(event.keyCode==13) {
                              // console.log(event,9999)
                            }
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
        that.table.param.columns.splice(11)
        for(let i in that.pqc.timeIntervalArray){
          let title = that.pqc.timeIntervalArray[i][0]?that.pqc.timeIntervalArray[i][0]+'~'+that.pqc.timeIntervalArray[i][1]:" "
          that.table.param.columns.push({
            title: title,
            key:'time'+Number(i)+Number(1)+'Value',
            minWidth:77*that.inputs.length,
            render: (h, params) => {
              return h("div",[
                that.inputs.map(function(item,index,data){
                  return h("Input", {
                      props: {
                          type: "text",
                          value:that.pqcParams[params.index].timeValueArray[i][index],
                          disabled:title==' '
                      },
                      style:{
                        width:'75px',
                        borderRight:index!=2?'1px solid #e9eaec':'',
                        background:that.backgroundColor(that.pqcParams[params.index].timeValueArray[i][index],params.row.usl,params.row.lsl)
                      },
                      on: {
                          "on-blur": event => {
                              that.pqcParams[params.index].timeValueArray[i][index] =event.target.value;
                              $(event.target).parent('.ivu-input-wrapper.ivu-input-type').css('background',that.backgroundColor(that.pqcParams[params.index].timeValueArray[i][index],params.row.usl,params.row.lsl,event.target))
                          },
                          "on-keydown":event=>{
                            if(event.keyCode==13) {
                              // $(event.target).parents('td').next().find('input').focus()
                              if(index==2) {
                                $(event.target).parents('td').next().find('.ivu-input:eq(0)').focus()
                              }else{
                                $(event.target).parent().next().find('input').focus()
                              }
                            }
                          },
                      }
                  })
                })
              ])
            }
          })
        }
        if(that.currentTimeIndex){
          let pqcParams = that.oldTimeData//拿到上一次完整列的数据
          for(let i in that.pqcParams){//拿到当前检验时段的数据
            pqcParams[i].timeValueArray[that.currentTimeIndex] = that.pqcParams[i].timeValueArray[that.currentTimeIndex]//插入当前时间到完整列
          }
          that.pqcParams = pqcParams
        }
      }
    },
    changeCreateBatchNo(){
      let that = this;
      if(that.createBatchNo==1){
        that.pqc.prodBatchId=''
        that.selects.prodBatchList=that.prodBatchList
        that.pqc.productId=''
        that.pqc.productName=''
        that.pqc.productSpec=''
        that.pqc.prodTypeName=''
        that.selects.prodProcessList=[]
        that.attribute=[]
      }
    },
    paramslist(val){
        this.paramsList = val;
        
      },
    paramsFocus(index){
      if(index===0&&event.keyCode==13){
        $(event.target).parents('.ivu-table-column-center').next().find('input').focus()
      }else if(index==1&&event.keyCode==13){
        $(event.target).parents('.ivu-table-row').next().find('td:nth-child(10) input').focus()
      }
    },
    endCase(){
      let that = this;
      if(!that.pqc.caseExplain){
        that.$Notice.warning({title:"结案说明不能为空"})
        return;
      }
      that.$http.put('/ipqc/reviewrecord/close/'+that.ipqcId,{caseExplain:that.pqc.caseExplain}).then((res)=>{
        that.$Message.success(i18n.t('pqc.endSuccess'))
        that.closePage()
      })
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
    getProductName(productId){
      let that = this;
      if(productId){
        that.changeProductId(productId)
        that.$http.get('/examinecenter/pqc/prodbatch/byProduct/'+productId).then(function(resp){
          that.selects.prodBatchList=resp.data;
        })
      }

    },
    changeResult(val){
      if(val==0){
        this.pqc.result=1;
      }else{
        this.pqc.result=0;
      }
    },
    clearNoNum(obj,num){
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
      obj.value = obj.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
      obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
      obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
      let allRep = '';
      for(let i=0;i<num;i++){
        let rep = '\\d';
        allRep += rep;
      }
      if(obj.value.indexOf(".")>0){
        if(obj.value.substring(obj.value.indexOf("."),obj.value.length-1).length>num){
          obj.value =  obj.value.substring(0,obj.value.length-1);
        }
      }
      // let replaces = new RegExp('(\\-)*(\\d+)\.('+ allRep +').*',);
      // obj.value = obj.value.replace(replaces,'$1$2.$3');//只能输入两个小数
      if(obj.value.indexOf(".")==obj.value.length-1&&num==0){
          obj.value = obj.value.substring(0,obj.value.length-1);
      }
      if(obj.value.indexOf(".")< 0 && obj.value !=""){//以上已经过滤，此处控制的是如果没有小数点
          obj.value= parseFloat(obj.value);
      }
    },
    paramTableSelectChange(v) {},
    cellParamEditorEnd(val) {},
    defectTableSelectChange(v) {
      this.pqc.TableLength = v.length;
      if (v.length > 0) {
        this.pqc.paramSelect = true;
      } else {
        this.pqc.paramSelect = false;
      }
    },
    cellDefectEditorEnd(val) {},
    getInspectiontype(){//获取检验项目下拉框
      let that=this;
      that.$http.get("/basic/inspectiontype",{params:{limit:99999999}}).then(function(resp){
        let root = {title:i18n.t("pqc.projectType"),selected: false,label:i18n.t("pqc.projectType"),value:0,expand:true};
        that.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
        that.selects.inspectionTypes = [root];
      })
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
      if(o.chkDevTypeId){
          let chkDevTypeIds = []
          chkDevTypeIds[0]=o.chkDevTypeId.replace(/\,/g,'_')
          let resp2 = that.$iqis.utils.syncget('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{page:1,limit:99999,useState:1});//带出检验设备列表
          newRow['chkDevTypeList'] = resp2 ? resp2.data[0] || [] : [];
        }else{
          newRow['chkDevTypeList']=[]
        }
      // for(let i in newRow['chkDevTypeList']){
      //   if(!newRow['chkDevTypeList'][i].chkDevId){
      //     newRow['chkDevTypeList'].splice(i,1)
      //   }
      // }
      newRow['chkDevTypeList'].unshift({chkDevId:null,name:i18n.t('Unlimited')});
      that.pqcDefectTable[index] = newRow;
      that.$set(that.pqcDefectTable, index, newRow);
      return;
    },
    refreshData() {
      let that = this;

      let ipqcId = that.$props.params && that.$props.params.ipqcId;
      that.mark = true;
      that.loadSelectsData();
      that.CurrentOperator();
      that.getInspectiontype();
      that.pqc.prodProcessId=0;      
      if (ipqcId) {
        // that.finalPorcessFlag = 0
        that.sampleRefreshFlag1=true;
        that.sampleRefreshFlag2=true;
        that.sampleRefreshFlag2Num=0,
        that.changeProductIdFlag=1//表示修改第一次进来
        that.changeProductIdFlag1=1//表示修改第一次进来
        that.ipqcId = ipqcId;
        that.refreshFlag=true;
        let url = "/ipqc/";
        that.$http.get(url + ipqcId).then(res => {
          that.pqc.btnState = "put";
          for(let i in res.data.propertyRecordsDtos) {
            let item = res.data.propertyRecordsDtos[i]
            let o = {}
            o.prodProcessName = item.prodProcessName
            o.inspectionName = item.inspectionName
            o.inspectionLevel = item.inspectionLevel
            o.result = item.result
            o.inspectionExplain = item.inspectionExplain
            that.attribute.push(o)
          }
          // o.prodProcessName = item.prodProcessName
          //   o.inspectionName = item.inspectionName;
          //   o.inspectionId = item.inspectionId
          //   o.inspectionLevel = item.inspectionLevel
          //   o.prodStageId = item.prodStageId
          //   o.propertyId = item.propertyId
          //   o.result = 0
           that.pqcParams = res.data.paramRecordList;
           let pqcParams = res.data.paramRecordList;
            let chkDevTypeIds = []
            for(let i in pqcParams){
              if(!pqcParams[i].chkDevTypeId){pqcParams[i].chkDevTypeId=-1}
              if(pqcParams[i].chkDevTypeId!=-1){

                chkDevTypeIds.push(pqcParams[i].chkDevTypeId.replace(/\,/g,'_'))
              }else{
                chkDevTypeIds.push(pqcParams[i].chkDevTypeId)
              }
            }
            let resp =chkDevTypeIds?that.$iqis.utils.syncget('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{useState: 1,page: 1,limit: 9999}):null;
            // that.$http.get('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds).then(function(resp){
            for(let i in pqcParams){
              let chkDevList = resp ? resp.data[i]||[] : [];
              chkDevList.unshift({chkDevId:null,name:i18n.t('Unlimited')});
              pqcParams[i]['chkDevList'] = chkDevList;
            }
            if(that.pqcParamsRefresh.length>0){
              for(let i in pqcParams){
                pqcParams[i]['chkDevId']=that.pqcParamsRefresh[i].chkDevId||''
              }
            }
            that.pqcParams = pqcParams


          for(let i = 0; i < res.data.paramRecordList.length; i++){
            this.paramValuearray[i] = res.data.paramRecordList[i].paramValueArray
          }
          // that.pqcParamss = res.data.pqcPropertyRecordList
          that.pqcParamssNew = res.data.pqcPropertyRecordList
          that.productPropertyCache = res.data.pqcPropertyRecordList
          that.productIdCache = res.data.ipqcItem.productId
          that.pqc.AuditStatus = res.data.ipqcItem.state;
          that.reviewState = res.data.ipqcItem.reviewState;
          that.pqc.ipqcDate = new Date(res.data.ipqcItem.ipqcDate);
          that.pqc.ipqcId = ipqcId;
          that.pqc.ipqcNo = res.data.ipqcItem.ipqcNo;
          that.pqc.productId = res.data.ipqcItem.productId;
          that.pqc.productSpec = res.data.ipqcItem.productSpec;
          //              prodTypeId=res.data.ipqcItem.prodTypeId;
          that.pqc.inspectorId = res.data.ipqcItem.inspectorId;
          that.pqc.chkShiftId = res.data.ipqcItem.chkShiftId;
          that.pqc.prodBatchId = res.data.ipqcItem.prodBatchId;
          that.productId2 = res.data.ipqcItem.prodBatchId;
          that.pqc.reportNo = res.data.ipqcItem.reportNo;
          that.pqc.batchQuantity = res.data.ipqcItem.batchQuantity;
          that.pqc.sampleQuantity = res.data.ipqcItem.sampleQuantity;
          that.pqc.badQuantity = res.data.ipqcItem.badQuantity;
          that.pqc.badRate = res.data.ipqcItem.badRate;
          that.pqc.result = res.data.ipqcItem.result;
          that.pqc.qcExplain = res.data.ipqcItem.qcExplain;
          that.pqc.customerId = res.data.ipqcItem.customerId;
          that.pqc.caseExplain = res.data.ipqcItem.caseExplain;
          that.pqc.prodProcessId = res.data.ipqcItem.prodProcessId;
          that.pqc.prodLineId = res.data.ipqcItem.prodLineId;
          that.pqc.timeIntervalArray = res.data.ipqcItem.timeIntervalArray
          that.timeIntervalUncertainty = res.data.ipqcItem.timeIntervalArray
          
          that.pqc.reviewProcessId = res.data.ipqcItem.reviewProcessId;
          that.pqcDefectTable = res.data.defectRecordList;
          
          that.pqc.batchNo = res.data.ipqcItem.batchNo;

          that.productSelectDisabled = true
          if(that.pqcDefectTable){
            for(let i in that.pqcDefectTable){
              let inspectionTypeId = that.pqcDefectTable[i].inspectionTypeId;
              let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
              let defectTypeList = resp ? resp.data||[] : [];
              that.pqcDefectTable[i]['defectTypeList'] = defectTypeList;
            }
            let chkDevTypeIds = []
            for(let i in that.pqcDefectTable){
              if(!that.pqcDefectTable[i].chkDevTypeId){that.pqcDefectTable[i].chkDevTypeId=-1}
              if(that.pqcDefectTable[i].chkDevTypeId!=-1){

                chkDevTypeIds.push(that.pqcDefectTable[i].chkDevTypeId.replace(/\,/g,'_'))
              }else{
                chkDevTypeIds.push(that.pqcDefectTable[i].chkDevTypeId)
              }
            }
            let resp =chkDevTypeIds?that.$iqis.utils.syncget('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{useState: 1,page: 1,limit: 9999}):null;
            for(let i in that.pqcDefectTable){
              let chkDevList = resp ? resp.data[i]||[] : [];
              chkDevList.unshift({chkDevId:null,name:i18n.t('Unlimited')});
              that.pqcDefectTable[i]['chkDevTypeList'] = chkDevList;
            }
          }
          for (let x in that.pqcDefectTable) {
            that.pqcDefectTable[x].defectNumber = parseInt(x);
            that.pqcDefectTable[x].chdDevTypeList = [];
            that.pqcDefectTable[x].defectTypeName =
              res.data.defectRecordList[x].defectTypeName;
            that.pqcDefectTable[x].qltyLvId =
              res.data.defectRecordList[x].qltyLvId;
            that.pqcDefectTable[x].inspectionTypeName =
              res.data.defectRecordList[x].inspectionTypeName;
            that.$http.get( "/basic/inspectiontype/" +res.data.defectRecordList[x].inspectionTypeId)
              .then(resp => {
                // that.chkdevlistData(resp.data.chkDevTypeId, x);
              });
            if(that.pqcDefectTable[x].extInfoList==null){
              that.pqcDefectTable[x].extInfoList=new Array();
            }

          }

          // that.productDetailData(res.data.ipqcItem.productId);
         
          for(let i= 0; i < that.pqcParams.length; i++){
            that.pqcParams[i].expand = true
          }
          that.initDefectTypeSelector();
          that.initDefectGradeSelector();
          that.initDefectLocSelector();
          // if(that.pqc.prodBatchId){that.changeProdBatchId(that.pqc.prodBatchId,1)}


          that.pqc.reviewProcessId = res.data.ipqcItem.reviewProcessId;
          that.pqc.inspectorName = res.data.ipqcItem.inspectorName;
          let arr = res.data.paramRecordList
          let arr1 = res.data.propertyRecordsDtos
          that.pqcParamsRefresh = JSON.parse(JSON.stringify(arr));
          that.pqcParamsNew = JSON.parse(JSON.stringify(arr));
          that.pqcAttribute = JSON.parse(JSON.stringify(arr1))
          that.pqcParams = JSON.parse(JSON.stringify(arr));
           if(that.copy=='copy'){
              that.ipqcId=null
              that.pqc.ipqcId=null
              that.pqc.AuditStatus=0;
              that.pqc.inspectorId=that.pqc.CurrentOperatorId
            }
          if (
            (that.pqc.AuditStatus == 2 ||
            that.pqc.AuditStatus == 1 )&&
            res.data.ipqcItem.reviewProcessId != null
          ) {
            that.ReviewRecord(ipqcId);
          }
          /**
           *  判断按钮，输入状态
           */
          //未提交
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
          }
        });
      }else {
        that.finalPorcessFlag = 2
      }
      if((!that.ipqcId&&that.permsBtn.INSERT_PQC)||(that.ipqcId&&that.permsBtn.UPDATE_PQC)){
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
          this.$http.get("/basic/reviewprocess", {params: { limit: 99999999 }}),
          this.$http.get("/basic/prodline", {params: { limit: 99999999 }}),
          this.$http.get("/bas/customerList",{params:{limit:99999999}}),

        ])
        .then(function(resps) {
          that.selects.userList = resps[0].data;
          that.selects.chkShiftList = resps[1].data;
          that.selects.prodBatchList = resps[2].data;
          that.prodBatchList=resps[2].data
          if(that.$props.params && that.$props.params.ipqcId){//如果是修改，产品批号类型无法修改
            that.createBatchNo=0;
            that.createBatchNoDis=true;
          }else{//如果是添加
            for(let i in that.selects.prodBatchList){
              let item = that.selects.prodBatchList[i];
              if(item.batchNo==Number(that.newDate)){//如果当天日期的产品批号已存在
                that.createBatchNo=0;//则产品批号类型为选择已有
                that.pqc.prodBatchId=item.prodBatchId//且选中该产品批号
                break;
              }else{//如果不存在
                that.createBatchNo=1;//则产品批号类型为新建
                that.pqc.batchNo=Number(that.newDate)//且自动生成当天日期的产品批号
              }
            }
          }
          that.selects.reviewList = resps[3].data;
          that.selects.reviewList.unshift({reviewProcessId:null,name:i18n.t('noReview')})
          that.selects.prodLineList = resps[4].data;
          
          that.selects.customerList = resps[5].data;
          that.loadStat.selectsDataLoading = false;
        });
    },
    changeProdBatchId(prodBatchId, index) {
      let that = this;
      if(!prodBatchId||prodBatchId===''){
        return;
      }
      let ipqcId = that.$props.params && that.$props.params.ipqcId;
      // that.selects.prodLineList = [];
      if(!this.productSelectDisabled){
        that.pqc.prodProcessId =0;
        that.pqc.prodLineId =null;
      }
      that.productSelectDisabled = false
      that.$http.get("/examinecenter/pqc/prodbatch/" + prodBatchId).then(function(resp) {
        that.pqc.productNo = resp.data.productNo;
        that.pqc.batchQuantity = resp.data.batchQuantity;
        that.pqc.productName = resp.data.productName;
        that.pqc.prodTypeName = resp.data.prodTypeName;
        that.pqc.productId = resp.data.productId;
        // that.selects.prodLineList = resp.data.prodLines;
        //产品批次
        that.changeProductId(resp.data.productId,prodBatchId)
      });
    },
    changeProductId(productId,prodBatchId){//此函数收on-change影响，修改进来时默认执行两次
      let that = this ;
      if(productId){
        that.$http.get("/basic/product/detail/" + productId).then(function(resp1) {
          that.del = resp1.data.del
          if(that.istrues){
            that.istrues = false;
            if(resp1.data.del !== 0){
              that.$Notice.warning({
                title: i18n.t("该产品已被删除"),
                desc: ""
              });
            }
          }
        //产品带出对应的属性记录
        if(!that.ipqcId) {
          that.attribute=[]
          for(let i in resp1.data.settings.qc.pqc.property) {
            let item = resp1.data.settings.qc.pqc.property[i];
            let o = {};
            o.prodProcessName = item.prodProcessName
            o.inspectionName = item.inspectionName;
            o.inspectionId = item.inspectionId
            o.inspectionLevel = item.inspectionLevel
            o.prodStageId = item.prodStageId
            o.propertyId = item.propertyId
            o.result = 0
            that.attribute.push(o)
          }
        }
        that.pqc.basicDisabled = false;
        let aql = resp1.data.settings.qc.pqc.aql;
        that.pqc.productNo=resp1.data.no;
        that.pqc.prodUnitName = resp1.data.prodUnitName;
        that.pqc.productSpec = resp1.data.spec;
        that.pqc.prodTypeName = resp1.data.prodTypeName;
        that.pqc.productName = resp1.data.name;
        if(aql){
          that.pqc.prodFlowId = aql.prodFlowId;
        }
         if (that.pqc.prodFlowId) {
          that.$http
            .get("/basic/prod-task/" + that.pqc.prodFlowId)
            .then(resp3 => {
              that.selects.prodProcessList = resp3.data.prodTaskItems;
              for(let i = 0;i < resp3.data.prodTaskItems.length; i++){
                // if(resp3.data.prodTaskItems[i].prodProcessName== i18n.t('pqc.finalInspection')&&!that.pqc.prodProcessId){
                if(resp3.data.prodTaskItems[i].prodProcessName== i18n.t('pqc.finalInspection')){
                  that.finalPorcessId = JSON.parse(JSON.stringify(resp3.data.prodTaskItems[i].prodProcessId))
                  if(that.finalPorcessFlag<2) {
                    that.finalPorcessFlag++
                  }else{
                    that.pqc.prodProcessId=resp3.data.prodTaskItems[i].prodProcessId;
                  }
                } 
              }
            });
        }else{
        }
        that.samplingPlanType=resp1.data.settings.qc.pqc.aql.samplingPlanType;
        if(that.changeProductIdFlag==1){//控制修改第一次进来往下执行
          that.changeProductIdFlag++
          return;
        }
        if(that.samplingPlanType==0){
          that.sampling.plan = aql.samplingPlanCode;
          that.sampling.level = aql.inspectionStandard;
          that.sampling.crAql = aql.crAql;
          that.sampling.majAql = aql.majAql;
          that.sampling.minAql = aql.minAql;
        }else{
          that.sampling.plan = '';
          that.sampling.level = '';
          that.sampling.crAql = '';
          that.sampling.majAql = '';
          that.sampling.minAql = '';
        }

        let ipqcId = that.$props.params && that.$props.params.ipqcId;
            
        that.pqcParamsNew = resp1.data.settings.qc.pqc.params
        // that.pqcAttribute = resp1.data.settings.qc.pqc.property
        if(resp1.data.settings.qc.pqc){
        }
        let endDate = new Date(that.pqc.ipqcDate).getTime();
        let calculateUrl = "/business-rule/product/new-calculate-lenient-transfer?productId="+resp1.data.productId+"&qcType=pqc&endDate="+endDate;
        that.$http.put(calculateUrl).then(resp => {
          that.sampling.rule = resp.data.lenientTransfer;
          if(that.sampling.plan=='full'||that.sampling.plan=='percent'){
            that.sampling.rule=''
          }
          that.getAql()
          if (resp.data.extStatus != null) {
            that.sampling.extStatus = resp.data.extStatus;
          }
        })
        
        if(that.changeProductIdFlag1==1){//控制修改第一次进来往下执行
          that.changeProductIdFlag1++
          return;
        }
        for(let i = 0; i < resp1.data.settings.qc.pqc.property.length; i++){
            let item = resp1.data.settings.qc.pqc.property[i]
            item.result = 0
        }
        that.pqcAttribute = resp1.data.settings.qc.pqc.property
        // if (that.pqc.prodFlowId) {
        //   that.$http
        //     .get("/basic/prod-task/" + that.pqc.prodFlowId)
        //     .then(resp3 => {
        //       that.selects.prodProcessList = resp3.data.prodTaskItems;
        //       for(let i = 0;i < resp3.data.prodTaskItems.length; i++){
        //         // if(resp3.data.prodTaskItems[i].prodProcessName== i18n.t('pqc.finalInspection')&&!that.pqc.prodProcessId){
        //         if(resp3.data.prodTaskItems[i].prodProcessName== i18n.t('pqc.finalInspection')){
        //           that.finalPorcessId = JSON.parse(JSON.stringify(resp3.data.prodTaskItems[i].prodProcessId))
        //           if(that.finalPorcessFlag<1) {
        //             that.finalPorcessFlag++
        //           }else{
        //             that.pqc.prodProcessId=resp3.data.prodTaskItems[i].prodProcessId;
        //             console.log(that.pqc.prodProcessId,444)
        //           }
        //         } 
        //       }
        //     });
        // }else{
        // }
        // 渲染检验时段，修改进来不该取resp1.data.settings.qc.pqc.params，而应该直接取that.pqcParams
        let pqcParams = resp1.data.settings.qc.pqc.params      
        for(let i in pqcParams){
          pqcParams[i]['timeValueArray'] = []
          for(let j=0;j<6;j++){
            if(that.pqcParams[i]){
              pqcParams[i].timeValueArray[j] = that.pqcParams[i].timeValueArray[j]
            }else{
              pqcParams[i].timeValueArray[j] = ['','','']              
            }
          }
        }
        that.pqcParams = pqcParams
        that.oldTimeData = JSON.parse(JSON.stringify(that.pqcParams))
        that.showNow = !that.showNow;
        that.changeShowNow()
        that.generateParam(that.pqc.prodProcessId)
          
        });
      }
    },
    ratechange() {
      let that = this;
      let isNullBadQuantity =
        that.pqc.badQuantity == null || that.pqc.badQuantity == "";
      let isNullSampleQuantity =
        that.pqc.sampleQuantity == null || that.pqc.sampleQuantity == "";
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
        let x =
          parseInt(that.pqc.badQuantity) /
          parseInt(that.pqc.sampleQuantity) *
          100;
        x = x.toFixed(2);
        that.pqc.badRate = x;
      }
      if (isNullBadQuantity || isNullSampleQuantity) {
        that.pqc.badRate = 0;
      }
    },
    getAql() {
      let that = this;
      if(!that.pqc.batchQuantity){
        return;
      }
      if(!that.pqc.productId){
        return;
      }
      if (that.pqc.prodBatchId < 0) {
        this.$Notice.warning({
            title: i18n.t("pqc.pea"),
            desc: ""
          });
        return;
      }
      if(that.samplingPlanType==1){
        let data = []
        if(!that.pqcParams||that.pqcParams.length==0){return}
        let pqcParams = JSON.parse(JSON.stringify(that.pqcParams))
        
        that.pqcParams = [];
        for(let i=0;i<pqcParams.length;i++){
          let item = pqcParams[i]
          let one = {
            code:item.samplingPlanCode,
            level:item.inspectionStandard,
            aql:item.aql,
            num:that.pqc.batchQuantity,
            type:0,
            tolerance:that.sampling.rule,
            // paramValueArray:[]
          }
          if(one.code=='GB/T2828.1-2012'){
            one.type=1;
          }
          data.push(one)
        }
        that.$http.post('/sampling-plan/aql?samplingPlanParamDtos',data,that.headers).then((res) => {
          let ipqcId = that.$props.params && that.$props.params.ipqcId;
          if(ipqcId) {
            let url = "/ipqc/";
            that.$http.get(url + ipqcId).then(res => {
              for(let i in pqcParams){
                if(res.data.paramRecordList[i].chkDevId){
                  pqcParams[i].chkDevId = res.data.paramRecordList[i].chkDevId
                }
              }
            })
          }
          
          for(let i in pqcParams){
            let item = pqcParams[i]
            item['num']=res.data[i].sampleNum
            item['ac']=res.data[i].samplingPlanAc
            item['re']=res.data[i].samplingPlanRe
          }
          that.pqcParams = pqcParams
          
        })
      }else{
        let crUrl = "";
        let majUrl = "";
        let minUrl = "";
        let type=0;
        let data=[]
        if(that.sampling.plan=='GB/T2828.1-2012'){
          type=1;
        }
        if(that.sampling.plan=='full'){
          that.sampling.samplingCount=that.pqc.batchQuantity;
        }
        if(that.sampling.plan=='percent'){
          that.sampling.samplingCount=that.pqc.batchQuantity*that.sampling.level/100
        }
        if(that.sampling.plan=='full'||that.sampling.plan=='percent'){
          
          that.sampling.crAC='-'
          that.sampling.majAC='-'
          that.sampling.minAC='-'
          that.sampling.crAql='-'
          that.sampling.majAql='-'
          that.sampling.minAql='-'
          that.sampling.crRE='-'
          that.sampling.majRE='-'
          that.sampling.minRE='-'
          that.sampling.rule=''
          let pqcParams = JSON.parse(JSON.stringify(that.pqcParams))
          for(let i in pqcParams){
            pqcParams[i]['num']=that.sampling.samplingCount
          }
          that.pqcParams=pqcParams
          return;
        }
          let state = true;
          state = that.$iqis.utils.formValidate('NumNot0',i18n.t("pqc.il"),that.pqc.batchQuantity,(tips)=>{
          })
          if(!state){
            return;
          }
            data=[
            {
              code:that.sampling.plan,
              level:that.sampling.level,
              tolerance:that.sampling.rule,
              aql:that.sampling.crAql,
              num:that.pqc.batchQuantity||0,
              type:type
            },
            {
              code:that.sampling.plan,
              level:that.sampling.level,
              tolerance:that.sampling.rule,
              aql:that.sampling.majAql,
              num:that.pqc.batchQuantity||0,
              type:type
            },
            {
              code:that.sampling.plan,
              level:that.sampling.level,
              tolerance:that.sampling.rule,
              aql:that.sampling.minAql,
              num:that.pqc.batchQuantity||0,
              type:type
            },
          ]
        that.$http.post('/sampling-plan/aql?samplingPlanParamDtos',data,that.headers).then((res) => {
          that.sampling.crAC = res.data[0].samplingPlanAc
          that.sampling.crRE = res.data[0].samplingPlanRe
          that.sampling.samplingCount = res.data[0].sampleNum;
          if(that.sampleRefreshFlag2Num>=1){
            that.pqc.sampleQuantity=that.sampling.samplingCount;
          }else{
            that.sampleRefreshFlag2Num++
          }
          that.sampling.majAC = res.data[1].samplingPlanAc
          that.sampling.majRE = res.data[1].samplingPlanRe
          that.sampling.minAC = res.data[2].samplingPlanAc
          that.sampling.minRE = res.data[2].samplingPlanRe
          let pqcParams = JSON.parse(JSON.stringify(that.pqcParams))
          for(let i in pqcParams){
            pqcParams[i]['num']=that.sampling.samplingCount
          }
          that.pqcParams=pqcParams

        })
      }
    },
    generateParam(val) {
      // return false;
      let that = this;
      let oldParams = JSON.parse(JSON.stringify(that.pqcParamsNew));
      let oldAttribute = JSON.parse(JSON.stringify(that.pqcAttribute))
      if(val == that.finalPorcessId){
        that.pqcParams = oldParams;
        that.attribute = oldAttribute;//如果是终检,所有的工序站点都拿来
        return
      } 
      that.pqcParams = [];
      that.attribute = [];
      for(let i in oldParams){
        if(oldParams[i].prodStageId == val){
          that.pqcParams.push(oldParams[i])
        }
      }
      for(let i in oldAttribute) {
        if(oldAttribute[i].prodStageId == val) {
          that.attribute.push(oldAttribute[i])
        }
      }
    },
    //增加综合缺陷记录
    addDefect() {
      this.initDefectTypeSelector();
      let arr = []
      let paramArr = []
      for(let i in this.pqcParams) {//把记录的值遍历到一个数组里
        for(let j in this.pqcParams[i].timeValueArray) {
          let item = this.pqcParams[i].timeValueArray[j]
          for(let k in item) {
            if(Number(item[k])) {
              arr.push(Number(item[k]))
            }
          }
        }
        paramArr.push(arr)
        arr = []
      }
      this.pqcDefectTable=this.$iqis.utils.tableHelper.defects(this.pqcDefectTable,paramArr,this.pqcParams,this.attribute)
      return
      let that = this;
      that.discountData.tableData.ipqcId = that.pqc.ipqcId;
      let obj = JSON.parse(JSON.stringify(that.discountData.tableData));
      that.pqcDefectTable.push(obj);
      let index = that.pqcDefectTable.length;
      that.pqcDefectTable[index - 1].defectNumber = index - 1;
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((index-5)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');

      })
      that.initDefectTypeSelector();
      that.initDefectGradeSelector();
      that.initDefectLocSelector();
    },
    //检验设备类别
    chkdevlistData(objId, index) {
      let that = this;
      // if(!objId){return}
      let url = "/basic/chkdevlist/";
      that.$http.get(url + objId).then(res => {
        let urlProduct = res.data;
        that.pqcDefectTable[index].chdDevTypeList = [];
        for (let x in urlProduct) {
          if (objId === urlProduct[x].chkDevTypeId) {
            that.pqcDefectTable[index].chkDevTypeId =
              urlProduct[x].chkDevTypeId;
            that.pqcDefectTable[index].chdDevTypeList.push(urlProduct[x]);
          }
        }
        that.$set(that.pqcDefectTable, index, that.pqcDefectTable[index]);
      });
    },
    //产品详细查询
    productDetailData(val) {
      let that = this;
      let totalQuantity;
      let url = "/basic/product/detail";
      if(val){
          that.$http.get(url + val).then(res => {
            that.sampling.crAql = res.data.settings.qc.pqc.aql.crAql;
            that.sampling.majAql = res.data.settings.qc.pqc.aql.majAql;
            that.sampling.minAql = res.data.settings.qc.pqc.aql.minAql;
            that.sampling.level = res.data.settings.qc.pqc.aql.inspectionStandard;
            that.sampling.plan = res.data.settings.qc.pqc.aql.samplingPlanCode;
            let productId = res.data.productId;
            let plan = res.data.settings.qc.pqc.aql.samplingPlanCode;
            let endDate = new Date(that.pqc.ipqcDate).getTime();
            let calculateUrl = "/business-rule/product/new-calculate-lenient-transfer?productId="+productId+"&qcType=pqc&endDate="+endDate;
            that.$http.put(calculateUrl).then(resp => {
              that.sampling.rule = resp.data.lenientTransfer;
              if (resp.data.extStatus != null) {
                that.sampling.extStatus = resp.data.extStatus;
              }
            that.$http.get("/business-rule/product/lenient-transfer?productId=" +productId +"&qcType=" +plan).then(resp2 => {
                let that = this;
                let crUrl = "";
                let majUrl = "";
                let minUrl = "";
                let type = 0;
                let data=[]
                if(that.sampling.plan=='GB/T2828.1-2012'){
                  type=1;
                }
                if(that.sampling.plan=='full'){
                  that.sampling.samplingCount=that.pqc.batchQuantity;
                }
                if(that.sampling.plan=='percent'){
                  that.sampling.samplingCount=that.pqc.batchQuantity*that.sampling.level/100
                }
                if(that.sampling.plan=='full'||that.sampling.plan=='percent'){
                  that.sampling.crAC='-'
                  that.sampling.majAC='-'
                  that.sampling.minAC='-'
                  that.sampling.crAql='-'
                  that.sampling.majAql='-'
                  that.sampling.minAql='-'
                  that.sampling.crRE='-'
                  that.sampling.majRE='-'
                  that.sampling.minRE='-'
                  that.sampling.rule=''
                  let pqcParams = JSON.parse(JSON.stringify(that.pqcParams))
                  for(let i in pqcParams){
                    pqcParams[i]['num']=that.sampling.samplingCount
                  }
                  that.pqcParams=pqcParams
                  return;
                }
                if (that.pqc.batchQuantity == "") {
                  data=[
                    {
                      code:that.sampling.plan,
                      level:that.sampling.level,
                      tolerance:that.sampling.rule,
                      aql:that.sampling.crAql,
                      num:that.pqc.batchQuantity,
                      type:type
                    },
                    {
                      code:that.sampling.plan,
                      level:that.sampling.level,
                      tolerance:that.sampling.rule,
                      aql:that.sampling.majAql,
                      num:that.pqc.batchQuantity,
                      type:type
                    },
                    {
                      code:that.sampling.plan,
                      level:that.sampling.level,
                      tolerance:that.sampling.rule,
                      aql:that.sampling.minAql,
                      num:that.pqc.batchQuantity,
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
                      num:that.pqc.batchQuantity,
                      type:type
                    },
                    {
                      code:that.sampling.plan,
                      level:that.sampling.level,
                      tolerance:that.sampling.rule,
                      aql:that.sampling.majAql,
                      num:that.pqc.batchQuantity,
                      type:type
                    },
                    {
                      code:that.sampling.plan,
                      level:that.sampling.level,
                      tolerance:that.sampling.rule,
                      aql:that.sampling.minAql,
                      num:that.pqc.batchQuantity,
                      type:type
                    },
                  ]
                }
                // that.$http.get(crUrl).then(res => {
                //   that.sampling.crRE = res.data.samplingPlanRe;
                //   that.sampling.crAC = res.data.samplingPlanAc;
                //   that.sampling.samplingCount = res.data.sampleNum;
                // });
                // that.$http.get(majUrl).then(res => {
                //   that.sampling.majAC = res.data.samplingPlanAc;
                //   that.sampling.majRE = res.data.samplingPlanRe;
                // });
                // that.$http.get(minUrl).then(res => {
                //   that.sampling.minAC = res.data.samplingPlanAc;
                //   that.sampling.minRE = res.data.samplingPlanRe;
                // });
                that.$http.post('/sampling-plan/aql?samplingPlanParamDtos',data,that.headers).then((res) => {
                  that.sampling.crAC = res.data[0].samplingPlanAc
                  that.sampling.crRE = res.data[0].samplingPlanRe
                  that.sampling.samplingCount = res.data[0].sampleNum;
                  if(that.sampleRefreshFlag1){
                    that.sampleRefreshFlag1=false;
                  }else{
                    that.pqc.sampleQuantity=that.sampling.samplingCount;
                  }
                  that.sampling.majAC = res.data[1].samplingPlanAc
                  that.sampling.majRE = res.data[1].samplingPlanRe
                  that.sampling.minAC = res.data[2].samplingPlanAc
                  that.sampling.minRE = res.data[2].samplingPlanRe
                  let pqcParams = JSON.parse(JSON.stringify(that.pqcParams))
                  for(let i in pqcParams){
                    pqcParams[i]['num']=that.sampling.samplingCount
                  }
                  that.pqcParams=pqcParams
                })
              });
            })
        });
      }
     
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
        that.pqc.DefectLocList.unshift({defectLocId:null,name:i18n.t('Unlimited')});
      });
    },
    initInspectionSelector(obj, index) {
      let that = this;
      for (let x in that.pqc.DefectNameList) {
        if (obj == that.pqc.DefectNameList[x].defectTypeId) {
          that.pqcDefectTable[index].inspectionTypeName =
            that.pqc.DefectNameList[x].inspectionTypeName;
          that.initDefectGradeSelector(
            that.pqc.DefectNameList[x].qltyLvId,
            index
          );
          that.$http
            .get(
              "/basic/inspectiontype/" +
                that.pqc.DefectNameList[x].inspectionTypeId
            )
            .then(resp => {
              // that.chkdevlistData(resp.data.chkDevTypeId, index);已由检验项目带出检验设备类别下的检验设备，不需要再通过缺陷名称带出
            });
        }
      }
    },
    deleteTableSelected() {
      let that = this;
      let ss = this.$refs.paramTable.getSelection();
      for (let i = 0; i < that.pqcDefectTable.length; i++) {
        for (let j = 0; j < ss.length; j++) {
          if (that.pqcDefectTable[i].defectNumber === ss[j].defectNumber) {
            that.pqcDefectTable.splice(i, 1);
          }
        }
      }
    },
    //获取当前登录人员信息 /tenant/user/profile
    CurrentOperator() {
      let that = this;
      let url = "/tenant/user/profile";
      that.$http.get(url).then(res => {
        that.pqc.CurrentOperatorId = res.data.userId;
        that.pqc.inspectorId = res.data.userId
      });
    },
    //评审记录
    ReviewRecord(ipqcId) {
      let that = this;
      let scuss = false;
      let scussOne = false;
      let isList = false; //是否评审人员
      let url = "/ipqc/reviewrecord/";
      that.$http.get(url + ipqcId).then(res => {
        //判断人信息

        let JudgePerson = res.data[res.data.length - 1]; // 最后一条数据
        let Judgeindex = res.data.length - 1; //最后一条数据的下标


        for (let i = 0; i < res.data.length; i++) {
          if(!res.data[i].treatmentType || res.data[i].treatmentType == ''){
            res.data[i].treatmentType = '';
          }
          if (res.data[i].reviewerId == that.pqc.CurrentOperatorId) {
            if (i != Judgeindex) {
              scuss = true;
            }
            if (i == 0) {
              scussOne = true;
            }
          }

          if (res.data[0].treatmentType == "") {
            res.data[i].disabled = true;
            if (scussOne == true) {
              res.data[0].disabled = false;
            }
          }
          if (JudgePerson.treatmentType != null || JudgePerson.treatmentType != "") {
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
            if(res.data[0].treatmentType == ""){
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
                  if(res.data[Judgeindex].treatmentType == null || res.data[Judgeindex].treatmentType == ""){

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
            that.handListShow = true;
            if(that.pqc.result == 0){
            that.sub2 = true;
            //当是评审人员
            if(isList){
              //当第一个人没填
              if(res.data[0].treatmentType == ""){
                //当第一个人是 登录人员
                if(that.pqc.CurrentOperatorId == res.data[0].reviewerId){
                  that.sub1 = true;
                }else{
                  that.sub1 = false;
                }
              }else{
                //当第一个人填了,且最后一个人没填
                if(res.data[Judgeindex].treatmentType == ""){
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
        that.HandleList = res.data;

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
      this.$emit("close-tab", this.$props.tabKey);
    },
    reviewProcessBtn(val) {
      let that = this;
      if (val === that.pqc.reviewProcessId) {
        if (that.pqc.AuditStatus == 2 || that.pqc.AuditStatus == 1) {
          that.ReviewRecord(that.pqc.ipqcId);
        }
      }
    },
    save() {
      let that = this;
      //判断该批号下的产品是否被删除，如果删除了，就不能保存
      if(that.del !== 0){
        that.$Notice.warning({
          title: i18n.t(i18n.t('pqc.deletedProduct')),
          desc: ""
        });
        return false;
      }

      let params=[]
      if(that.createBatchNo===1){
        params.push(
          {type:'Empty',title:i18n.t("pqc.ln"),value:that.pqc.batchNo}
        )
      }else{
        params.push(
          {type:'Empty',title:i18n.t("pqc.ln"),value:that.pqc.prodBatchId}
        )
      }
      params.push(
        {type:'Empty',title:i18n.t("pqc.batchNumber"),value:that.pqc.batchQuantity},
        {type:'NumNot0',title:i18n.t("pqc.batchNumber"),value:that.pqc.batchQuantity},
        {type:'Empty',title:i18n.t("pqc.pn"),value:that.pqc.productId},
        {type:'Empty',title:i18n.t("pqc.pl"),value:that.pqc.prodLineId},
        {type:'Empty',title:i18n.t("pqc.pps"),value:that.pqc.prodProcessId},
        {type:'Empty',title:i18n.t("pqc.workTime"),value:that.pqc.chkShiftId},
        {type:'Empty',title:i18n.t("pqc.iqcNo"),value:that.pqc.ipqcNo},
        {type:'No',title:i18n.t("pqc.iqcNo"),value:that.pqc.ipqcNo},
        {type:'Empty',title:i18n.t("pqc.time"),value:that.pqc.ipqcDate},
      )
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
      // for (let i = 0; i < that.pqcDefectTable.length; i++) {
      //   if (!that.pqcDefectTable[i].inspectionTypeId || !that.pqcDefectTable[i].defectTypeId  || that.pqcDefectTable[i].sampleQuantity === '' || that.pqcDefectTable[i].defectCount === '') {
      //     that.$Notice.warning({title: i18n.t("pqc.qtxd") + (i + 1) + i18n.t("pqc.tqxj")});
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

      // if(that.copy=='copy'){
      //   that.pqc.btnState = 'post'
      //   for(let i in that.pqcDefectTable){
      //     that.pqcDefectTable[i].defectRecordId=null
      //     for(let j in that.pqcDefectTable[i].extInfoList){
      //       that.pqcDefectTable[i].extInfoList[i].pqcDefectrecordExtInfoId=null
      //     }
      //   }
      // }
      let propertyRecordsDtos = []

      for(let i in that.attribute) {
        let j = that.attribute[i]
        let o = {}
        o.prodStageId = j.prodStageId//生产工序id
        o.propertyId = j.propertyId//检验标准id
        o.inspectionId = j.inspectionId//检验项目id
        o.result = j.result//检验结果
        o.inspectionExplain = j.inspectionExplain//检验说明
        if(j.propertyRecordId){
          o.propertyRecordId = j.propertyRecordId
        }
        propertyRecordsDtos.push(o)
      }
      let parmas = {
        defectRecordList: that.pqcDefectTable,
        ipqcItem: that.pqc,
        paramRecordList: that.pqcParams,
        propertyRecordsDtos:propertyRecordsDtos
      };
      parmas.ipqcItem.ipqcDate = new Date(parmas.ipqcItem.ipqcDate).getTime();

      
      if (that.pqc.btnState == "put") {
        that.$http.put('/ipqc/update', parmas, that.headers).then(res => {
          that.$Message.success(i18n.t("pqc.ats"));
          that.closePage();
          that.$emit("open-tab","exam-pqc-new-inspectrecord-add-"+res.data.ipqcItem.ipqcId,"修改巡检记录"+that.pqc.productName,"page-exam-pqc-new-inspectrecord-add",{ipqcId:res.data.ipqcItem.ipqcId});
        });
      } else if (that.pqc.btnState == "post") {
        that.$http.post('/ipqc/add', parmas, that.headers).then(res => {
          that.$Message.success(i18n.t("pqc.as"));
          that.closePage();
          that.pqc.ipqcId = res.data.ipqcItem.ipqcId;
          that.$emit("open-tab","exam-pqc-new-inspectrecord-add-"+res.data.ipqcItem.ipqcId,"修改巡检记录"+that.pqc.productName,"page-exam-pqc-new-inspectrecord-add",{ipqcId:res.data.ipqcItem.ipqcId});
        });
      }
    },  
    subBasic() {
      let that = this;
      //判断该批号下的产品是否被删除，如果删除了，就不能提交
      if(that.del !== 0){
        that.$Notice.warning({
                title: i18n.t(i18n.t('pqc.deletedProduct')),
                desc: ""
              });
              return false;
      }
      let params=[]
      if(that.createBatchNo===1){
        params.push(
          {type:'Empty',title:i18n.t("pqc.ln"),value:that.pqc.batchNo}
        )
      }else{
        params.push(
          {type:'Empty',title:i18n.t("pqc.ln"),value:that.pqc.prodBatchId}
        )
      }
      params.push(
        {type:'Empty',title:i18n.t("pqc.batchNumber"),value:that.pqc.batchQuantity},
        {type:'NumNot0',title:i18n.t("pqc.batchNumber"),value:that.pqc.batchQuantity},
        {type:'Empty',title:i18n.t("pqc.pn"),value:that.pqc.productId},
        {type:'Empty',title:i18n.t("pqc.pl"),value:that.pqc.prodLineId},
        {type:'Empty',title:i18n.t("pqc.pps"),value:that.pqc.prodProcessId},
        {type:'Empty',title:i18n.t("pqc.workTime"),value:that.pqc.chkShiftId},
        {type:'Empty',title:i18n.t("pqc.iqcNo"),value:that.pqc.ipqcNo},
        {type:'No',title:i18n.t("pqc.iqcNo"),value:that.pqc.ipqcNo},
        {type:'Empty',title:i18n.t("pqc.time"),value:that.pqc.ipqcDate},
        {type:'NumAllNot0',title:i18n.t("pqc.actualSampling"),value:that.pqc.sampleQuantity},
        {type:'Num',title:i18n.t("pqc.badNumber"),value:that.pqc.badQuantity},
      )
      if(that.pqc.result==0){
        params.push({type:'Empty',title:i18n.t("pqc.reviewTeam"),value:that.pqc.reviewProcessId})
      }
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
      for (let i = 0; i < that.pqcDefectTable.length; i++) {
        if (!that.pqcDefectTable[i].inspectionTypeId || !that.pqcDefectTable[i].defectTypeId   || that.pqcDefectTable[i].sampleQuantity === '' || that.pqcDefectTable[i].defectCount === '') {
            
            that.$Notice.warning({title: i18n.t("pqc.qtxd") + (i + 1) + i18n.t("pqc.tqxj")});
         
            return;
        }
        let paramsDefects = [
          {type: 'NumNot0', title: i18n.t("pqc.sampleQuantity"), value: that.pqcDefectTable[i].sampleQuantity},
          {type: 'Num', title: i18n.t("pqc.dn"), value: that.pqcDefectTable[i].defectCount},
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
      for(let i=0;i<that.pqcParams.length;i++){
        that.pqcParams[i].paramId = that.pqcParams[i].prodChkParamId
      }
      // if(that.copy=='copy'){
      //   that.pqc.btnState = 'post'
      //   for(let i in that.pqcDefectTable){
      //     that.pqcDefectTable[i].defectRecordId=null
      //     for(let j in that.pqcDefectTable[i].extInfoList){
      //       that.pqcDefectTable[i].extInfoList[i].pqcDefectrecordExtInfoId=null
      //     }
      //   }
      // }
      // for(let i in that.attribute) {
      //   let j = that.attribute[i]
      //   console.log(j,345)
      //   let o = {}
      //   o.prodStageId = j.prodStageId//生产工序id
      //   o.propertyId = j.propertyId//检验标准id
      //   o.inspectionId = j.inspectionId//检验项目id
      //   o.result = j.result//检验结果
      //   o.inspectionExplain = j.inspectionExplain//检验说明
      //   if(j.propertyRecordId){
      //     o.propertyRecordId = j.propertyRecordId
      //   }
      //   propertyRecordsDtos.push(o)
      // }
      let propertyRecordsDtos = []
      for(let i in that.attribute) {
        let j = that.attribute[i]
        let o = {}
        o.prodStageId = j.prodStageId//生产工序id
        o.propertyId = j.propertyId//检验项目id
        o.inspectionId = j.inspectionId //检验标准id
        // o.inspectionId = j.inspectionId
        // o.inspectionLevel = j.inspectionLevel
        o.result = j.result//检验结果
        o.inspectionExplain = j.inspectionExplain//检验说明
        if(j.propertyRecordId){
          o.propertyRecordId = j.propertyRecordId
        }
        propertyRecordsDtos.push(o)
      }
      let parmas = {
        defectRecordList: that.pqcDefectTable,
        ipqcItem: that.pqc,
        paramRecordList: that.pqcParams,
        propertyRecordsDtos: propertyRecordsDtos
      };
      parmas.ipqcItem.ipqcDate = new Date(parmas.ipqcItem.ipqcDate).getTime();
      if (that.pqc.btnState == "put") {
        that.$http.put('/ipqc/update', parmas, that.headers).then(res => {
          that.$http
            .post(
              "/ipqc/applyaudit?ipqcId=" +
                res.data.ipqcItem.ipqcId
            )
            .then(res => {
              that.$Message.success(i18n.t("pqc.cs"));
              that.closePage();
            });
        });
      } else if (that.pqc.btnState == "post") {
        that.$http.post('/ipqc/add', parmas, that.headers).then(res => {
          that.$http
            .post(
              "/ipqc/applyaudit?ipqcId=" +
                res.data.ipqcItem.ipqcId
            )
            .then(res => {
              that.$Message.success(i18n.t("pqc.cs"));
              that.closePage();
            });
        });
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
      let resp = that.$iqis.utils.syncget('/examinecenter/pqc/pqcdetail/'+that.pqc.ipqcId);
      if(resp.data.ipqcItem.state==0||resp.data.ipqcItem.state==3){
        that.$Notice.warning({title:i18n.t('pqc.tew')})
        that.refreshData()
        return;
      }
      let resp2 = that.$iqis.utils.syncget('/ipqc/reviewrecord/'+that.pqc.ipqcId); 
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
      let url = "/ipqc/reviewrecord/?ipqcId=";
      that.$http
        .put(url + that.pqc.ipqcId, that.HandleList, that.headers)
        .then(res => {
          that.$Message.success(i18n.t("pqc.as"));
          that.closePage();
        });
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
    }
  },
  mounted(){
    let that = this;
    // this.refreshData();
    // let that = this;
    // setTimeout(function(){
      
    // },3000)
  }
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
</style>
