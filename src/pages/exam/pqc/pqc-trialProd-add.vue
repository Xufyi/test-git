<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t('pqc.aftp')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.ati")}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :clearable="false" :disabled="disabled.application||noPermsDis" v-model="application.applicationTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.applicant')}}</div>
            <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pqc.pleaseSelect')" :disabled="disabled.application||noPermsDis" v-model="application.applicationUserId" filterable>
                  <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.oddn')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  :placeholder="i18n.t('pqc.pe')" :disabled="disabled.application||noPermsDis" v-model="application.trialProdNo" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.onr')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="disabled.application||noPermsDis" v-model="application.orderNo" :placeholder="i18n.t('pqc.pe')" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.pn')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select  :label="application.productNo" remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pqc.pleaseChoose')" v-if='!disabled.application' :disabled="disabled.application||noPermsDis" v-model="application.productId" filterable @on-change="getProductData(application.productId)">
                <Option v-for="data in productList" :key="data.productId" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select>
              <i-input  :placeholder="i18n.t('pqc.pe')" v-if='disabled.application' v-model="application.productNo" disabled style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.name')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="application.productName" :placeholder="i18n.t('pqc.pe')" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.specifications')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="application.productSpec" :placeholder="i18n.t('pqc.pe')" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.ac')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="disabled.application||noPermsDis" v-model="application.customerId" filterable>
                <Option v-for="data in customerList" :key="data.customerId" :value="data.customerId">{{data.customerAbbreviation}}</Option>
              </Select>
            </div>
          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.tpls")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="disabled.application||noPermsDis" v-model="application.prodLineId" filterable>
                <Option v-for="(data,index) in prodLineList" :key="index" :value="data.prodLineId">{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.ptdt')}}</div>
            <div class="iqis-page-block-ctrl">
                <DatePicker :clearable="false" :disabled="disabled.application||noPermsDis" v-model="application.planTrialProdTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
            </div>
          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('pqc.objective')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="disabled.application||noPermsDis" v-model="application.trialProdObjective" placeholder="" type="textarea" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('pqc.mc')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="disabled.application||noPermsDis" v-model="application.materialCondition" placeholder="" type="textarea" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('pqc.nt')}}</div>
            <div class="iqis-page-block-ctrl">
              <Button :disabled="disabled.application||noPermsDis" type="primary" icon="person-stalker" v-if="other.memberBtnShow&&!disabled.application" @click="other.memberInputShow=true;other.memberBtnShow=false;memberInputValue='';">{{$t('pqc.addMoreMember')}}</Button>
              <Select :placeholder="i18n.t('pqc.pleaseChoose')" style="width:146px" v-if="other.memberInputShow" v-model="application.memberId" @on-change="addMember(application.memberId)" filterable>
                  <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
                <Tag :closable="!disabled.application&&!noPermsDis" v-for="(data,index) in application.memberList" type="dot" color="blue" :key="index" :name="index" @on-close="deleteMember(index,application.memberList)">{{data.memberName}}</Tag>
            </div>
          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.aa")}}</div>

            <div class="iqis-page-block-ctrl"> 
              <Select :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="disabled.application||noPermsDis" v-model="application.applicationAuditorId" filterable>
                <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.auditTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :clearable="false" disabled v-model="application.applicationAuditTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>              
            </div>
          </i-col>
        </Row>

      </div>
    </div>
    <!-- 试产记录 -->
    <div class="iqis-page-block" v-if="show.record">
      <div class="iqis-page-block-title" style="margin-bottom:15px;">
        {{$t('pqc.trialProdRecord')}}
      </div>
      <div class="iqis-page-block-body">
          <Row type="flex" :gutter="25">
            <i-col span="6">
              <!-- 实际试产时间 -->
              <div class="iqis-page-block-label">{{$t('pqc.at')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :clearable="false" :disabled="disabled.record||noPermsDis" v-model="record.actualTrialProdTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
              </div>
            </i-col>
            <i-col span="6">
              <!-- 试产数量 -->
              <div class="iqis-page-block-label">{{$t("pqc.qotp")}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input  :placeholder="i18n.t('pqc.pe')" :disabled="disabled.record||noPermsDis" v-model="record.trialProdQuantity" style="width: 100%;">
                  <span slot="append">{{other.productUnitName}}</span>
                </i-input>
              </div>
            </i-col>
            <i-col span="6">
              <!-- 不良数量 -->
              <div class="iqis-page-block-label">{{$t('pqc.badQuantity')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input  :placeholder="i18n.t('pqc.pe')" :disabled="disabled.record||noPermsDis" v-model="record.badQuantity" style="width: 100%;">
                  <span slot="append">{{other.productUnitName}}</span>
                </i-input>
              </div>
            </i-col>
            <i-col span="6">
              <!-- 不良率 -->
              <div class="iqis-page-block-label">{{$t('pqc.defectRate')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input disabled v-model="badRate" placeholder="0" style="width: 100%;">
                  <span slot="append">%</span>
                </i-input>
              </div>
            </i-col>
          </Row>
          <!-- 缺陷记录表 -->
          <div class="iqis-page-block-tools">
            <div class="iqis-page-block-tools-primary">
              <div class="iqis-page-block-label">{{$t('pqc.defectTable')}}</div>
            </div>
            <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
              <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t("pqc.yxz")}} <span style="color:#1b75ea">{{TableLength}}</span> {{$t("pqc.qxjl")}}</span>
              <Button v-if="!disabled.record" :disabled="noPermsDis" type="ghost" icon="trash-a" @click="deleteDefect">{{$t('pqc.delete')}}</Button>
            </div>
          </div>
          <!-- 缺陷记录表格 -->
          <Table class="noBorder noHeight location" ref="defectTable" :loading="defectRecords.table.loading" @on-selection-change="getTableLength" v-drag-table-column="defectRecords.table.columns" border stripe :columns="defectRecords.table.columns" :data="defectRecords.table.data">
            <Button :disabled="noPermsDis" class="iqis-table-footer-btn" icon="plus" v-if="!disabled.record" slot="footer" type="dashed" style="width:100%;margin: 16px;font-size:14px;" @click="addDefect">{{$t('pqc.addDefect')}}</Button>
          </Table>
          <Row type="flex" :gutter="25">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.srp")}}</div>
              <div class="iqis-page-block-ctrl">
                <!-- 选择评审流程 -->
                <Select :disabled="disabled.record||noPermsDis" v-model="record.reviewProcessId" filterable>
                  <!-- 不发起评审流程 -->
                  <!-- <Option :value="null">{{$t('noReview')}}</Option> -->
                  <Option v-for="(data,index) in processIdList" :key="index" :value="data.reviewProcessId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('pqc.explain')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input type="textarea" :disabled="disabled.record||noPermsDis" v-model="record.trialProdCaption" :placeholder="i18n.t('pqc.pe')" style="width: 100%;"></i-input>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.aa')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :disabled="disabled.record||noPermsDis" v-model="record.recordAuditorId" filterable>
                  <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.aa')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :clearable="false" disabled v-model="record.recordAuditTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.recorder")}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :disabled="disabled.record||noPermsDis" v-model="record.recordUserId" filterable>
                  <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.ret')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :clearable="false" :disabled="disabled.record||noPermsDis" v-model="record.recordTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
      </div>
    </div>
     <!-- 试产评审记录 -->
    <div class="iqis-page-block" v-if="show.review">
      <div class="iqis-page-block-title">
        {{$t('pqc.tprr')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25" class="review-block">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.treatmentMethod')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="review.auditorRecord.treatmentType" :disabled="disabled.auditorRecord||noPermsDis" filterable :placeholder="i18n.t('pqc.pleaseSelect')">
                <Option v-for="item in treatmentMethods" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6" offset="6">
            <div class="iqis-page-block-label">{{$t('pqc.auditor')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  :placeholder="i18n.t('pqc.pe')"  v-model="review.auditorRecord.reviewer" disabled style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.time')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime"  v-model="review.auditorRecord.reviewTime" disabled :placeholder="i18n.t('pqc.pst')" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t("pqc.ao")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :placeholder="i18n.t('pqc.pe')" :rows="4" v-model="review.auditorRecord.opinion" :disabled="disabled.auditorRecord||noPermsDis"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25" class="review-block">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.treatmentMethod')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="review.review1Record.treatmentType" :disabled="disabled.review1Record||noPermsDis" filterable :placeholder="i18n.t('pqc.pleaseChoose')">
                <Option v-for="item in treatmentMethods" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6" offset="6">
            <div class="iqis-page-block-label">{{$t('pqc.reviewer')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  :placeholder="i18n.t('pqc.pe')"  v-model="review.review1Record.reviewer" disabled style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.time')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime"  v-model="review.review1Record.reviewTime" disabled :placeholder="i18n.t('pqc.pst')" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('pqc.ao')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :placeholder="i18n.t('pqc.pe')" :rows="4" v-model="review.review1Record.opinion" :disabled="disabled.review1Record||noPermsDis"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25" class="review-block">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.treatmentMethod')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="review.review2Record.treatmentType" :disabled="disabled.review2Record||noPermsDis" filterable :placeholder="i18n.t('pqc.pleaseSelect')">
                <Option v-for="item in treatmentMethods" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6" offset="6">
            <div class="iqis-page-block-label">{{$t("pqc.reviewer")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  :placeholder="i18n.t('pqc.pe')"  v-model="review.review2Record.reviewer" disabled style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.time')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime"  v-model="review.review2Record.reviewTime" disabled :placeholder="i18n.t('pqc.pst')" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('pqc.reviewOpinion')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :placeholder="i18n.t('pqc.pe')" :rows="4" v-model="review.review2Record.opinion" :disabled="disabled.review2Record||noPermsDis"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25" class="review-block">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.treatmentMethod')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="review.review3Record.treatmentType" :disabled="disabled.review3Record||noPermsDis" filterable :placeholder="i18n.t('pqc.pleaseSelect')">
                <Option v-for="item in treatmentMethods" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6" offset="6">
            <div class="iqis-page-block-label">{{$t('pqc.reviewer')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  :placeholder="i18n.t('pqc.pe')"  v-model="review.review3Record.reviewer" disabled style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.time')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime"  v-model="review.review3Record.reviewTime" disabled :placeholder="i18n.t('pqc.pleaseSelect')" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('pqc.reviewOpinion')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :placeholder="i18n.t('pqc.pe')" :rows="4" v-model="review.review3Record.opinion" :disabled="disabled.review3Record||noPermsDis"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25" class="review-block">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.treatmentMethod')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="review.review4Record.treatmentType" :disabled="disabled.review4Record||noPermsDis" filterable :placeholder="i18n.t('pqc.pleaseSelect')">
                <Option v-for="item in treatmentMethods" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6" offset="6">
            <div class="iqis-page-block-label">{{$t('pqc.reviewer')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  :placeholder="i18n.t('pqc.pe')"  v-model="review.review4Record.reviewer" disabled style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.time')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime"  v-model="review.review4Record.reviewTime" disabled :placeholder="i18n.t('pqc.pst')" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('pqc.reviewOpinion')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :placeholder="i18n.t('pqc.pe')" :rows="4" v-model="review.review4Record.opinion" :disabled="disabled.review4Record||noPermsDis"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25" class="review-block">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.treatmentMethod')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="review.judgeRecord.treatmentType" :disabled="disabled.judgeRecord||noPermsDis" filterable :placeholder="i18n.t('pqc.pleaseSelect')">
                <Option v-for="item in treatmentMethods" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6" offset="6">
            <div class="iqis-page-block-label">{{$t('pqc.treatmentMethod')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  :placeholder="i18n.t('pqc.pe')"  v-model="review.judgeRecord.reviewer" disabled style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.srp")}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime"  v-model="review.judgeRecord.reviewTime" disabled :placeholder="i18n.t('pqc.pst')" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t("pqc.judgeOpinion")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :placeholder="i18n.t('pqc.pe')" :rows="4" v-model="review.judgeRecord.opinion" :disabled="disabled.judgeRecord||noPermsDis"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div>

    <!--end blocks-->
    <div class="page-end" style="padding-bottom: 65px"></div>
    <!-- 未提交、申请审核驳回 -->
    <IqisAffix placement="bottom" :offset="0" v-if="pageButton=='application'&&((!trialProdId&&permsBtn.INSERT_TRIAL_PROD)||(trialProdId&&permsBtn.UPDATE_TRIAL_PROD))">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="saveApplication('submit')">{{$t('pqc.submit')}}</Button>
        <Button type="primary" @click="saveApplication('save')">{{$t("pqc.save")}}</Button>
        <Button type="ghost" @click="closePage">{{$t('pqc.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!-- 申请待审核 -->
    <IqisAffix placement="bottom" :offset="0" v-else-if="pageButton=='applicationAudit'&&permsBtn.UPDATE_TRIAL_PROD">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="auditApplication(1)">{{$t('pqc.auditPass')}}</Button>
        <Button type="ghost" @click="auditApplication(0)">{{$t('pqc.auditReject')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('pqc.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!-- 待试产、试产中、试产审核驳回 -->
    <IqisAffix placement="bottom" :offset="0" v-else-if="pageButton=='trialProd'&&permsBtn.UPDATE_TRIAL_PROD">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="saveTrialProd('submit')">{{$t('pqc.submit')}}</Button>
        <Button type="primary" @click="saveTrialProd('save')">{{$t("pqc.save")}}</Button>
        <Button type="ghost" @click="closePage">{{$t('pqc.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!-- 试产待审核 -->
    <IqisAffix placement="bottom" :offset="0" v-else-if="pageButton=='trialProdAudit'&&permsBtn.UPDATE_TRIAL_PROD">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="auditRecord(1)">{{$t('pqc.auditPass')}}</Button>
        <Button type="ghost" @click="auditRecord(0)">{{$t('pqc.auditReject')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('pqc.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!-- 待评审、评审中、试产完成 -->
    <IqisAffix placement="bottom" :offset="0" v-else-if="pageButton=='review'&&permsBtn.UPDATE_TRIAL_PROD">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="submitReview">{{$t('pqc.submit')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('pqc.cancel')}}</Button>
      </div>
    </IqisAffix>
    <IqisAffix placement="bottom" :offset="0" v-else>
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="ghost" @click="closePage">{{$t('pqc.cancel')}}</Button>
      </div>
    </IqisAffix>
    
    <Spin size="large" fix v-if="loadStat.complaintDataLoading || loadStat.selectsDataLoading"></Spin>
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
         {value:"PASS",label:i18n.t("pqc.adopt")},
         {value:"RE_TRIAL_PROD",label:i18n.t("pqc.ttp")},
         {value:"STOP_TRIAL_PROD",label:i18n.t("pqc.stp")},
      ],
      userId:'',
      customerList:[],
      userList:[],
      productList:[],
      prodLineList:[],
      processIdList:[],

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
              title: i18n.t("pqc.no"),
              minWidth:30,
              maxWidth:30,
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm)
            },
            {
              title: i18n.t("pqc.inspection"),
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
              title: i18n.t("pqc.defectName"),
              width:this.$store.state.locale=='zh_CN'?80:100,
              minWidth:this.$store.state.locale=='zh_CN'?80:100,
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
              title: i18n.t("pqc.defectGrade"),
              width:this.$store.state.locale=='zh_CN'?80:100,
              minWidth:this.$store.state.locale=='zh_CN'?80:100,
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
              title: i18n.t("pqc.defectPosition"),
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
                      placeholder:i18n.t("pqc.wu")
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
              title: i18n.t("pqc.sampleQuantity"),
              width:this.$store.state.locale=='zh_CN'?80:120,
              minWidth:this.$store.state.locale=='zh_CN'?80:120,
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
              title: i18n.t("pqc.dn"),
              width:this.$store.state.locale=='zh_CN'?80:120,
              minWidth:this.$store.state.locale=='zh_CN'?80:120,
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
              title: i18n.t("pqc.defectRates"),
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
                        params.row.remark = event.target.value
                        this.defectRecords.table.data[params.index] = params.row
                      }
                    }
                  })
                ]);
              }
            },
            {
              title: i18n.t("pqc.picture"),
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
      that.$http.all([
        that.$http.get("/tenant/user",{params:{limit:999999999}}),
        // that.$http.get("/basic/product",{params:{limit:999999999,examType:2, useState:1, page:1}}),
        that.$http.get("/bas/customerList",{params:{limit:99999999}}),
        that.$http.get('/tenant/user/profile'),
        that.$http.get('/basic/prodline',{params:{limit:99999999}}),
        that.$http.get('/basic/reviewprocess',{params:{limit:99999999}})
      ]).then(function(resps){

        that.userList = resps[0].data;
        // that.productList = resps[1].data;
        that.customerList = resps[1].data;
        that.userId=resps[2].data.userId;
        that.prodLineList=resps[3].data;
        that.processIdList = resps[4].data;
        that.processIdList.unshift({reviewProcessId:null,name:i18n.t('noReview')})

        let trialProdId = that.$props.params && that.$props.params.trialProdId;
        if(((!trialProdId&&that.permsBtn.INSERT_TRIAL_PROD)||(trialProdId&&that.permsBtn.UPDATE_TRIAL_PROD))){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
        if(trialProdId){//修改
        that.trialProdId=trialProdId;
          that.getData();
          that.getDefectData();
        }else{//添加
          that.application.applicationUserId=that.userId;
          that.application.applicationTime=new Date();
        }
      })
    },
    getData(){
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
    },
    getBlock(){
      let that = this;
      let userId = that.userId;
      let state = that.application.trialProdState;//当前状态
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
        if(that.record.reviewProcessId == null){
          that.show.record=false;
        }else{
          that.show.record = true;
        }
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
        }
        // 新增,试产中，试产待审核，试产审核驳回，页面显示 "试产记录"
        else if(state == 'TRIALPRODUCTING'||state == 'TRIALPRODAUDITING'||state == 'TRIALPRODAUDITREJECT'){
            that.show.record = true;
        }
        // 新增
        else if(state == 'TRIALPRODAUDITING'){
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
        if(that.record.reviewProcessId == null){
          that.show.record=false;
          that.show.review=false;
        }else{
          that.show.record=true;
          that.show.review=true;

        }
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
             if(that.record.reviewProcessId !== null){
              that.$Notice.warning({title:i18n.t("oqc.auditFirst")})
            }
            
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
          that.$Notice.warning({title: i18n.t("pqc.memberExisted")});
        }
      })

    },
    deleteMember(index,part){//删除小组成员
      let that = this;
      part.splice(index, 1);
    },
    saveApplication(requestMethod){//试产申请保存和提交
      let that=this;
      //console.log('申请保存或提交')
      let state = true;
      let params = [
        {type:'Empty',title:i18n.t("pqc.atm"),value:that.application.applicationTime},
        {type:'Empty',title:i18n.t("pqc.applicant"),value:that.application.applicationUserId},
        {type:'Empty',title:i18n.t("pqc.oddn"),value:that.application.trialProdNo},
        {type:'No',title:i18n.t("pqc.oddn"),value:that.application.trialProdNo},
        {type:'No',title:i18n.t("pqc.onr"),value:that.application.orderNo},
        {type:'Empty',title:i18n.t("pqc.pn"),value:that.application.productId},
        {type:'Empty',title:i18n.t("pqc.tpls"),value:that.application.prodLineId},
        {type:'Empty',title:i18n.t("pqc.ptdt"),value:that.application.planTrialProdTime},
        {type:'Empty',title:i18n.t("pqc.objective"),value:that.application.trialProdObjective},
        {type:'Word600',title:i18n.t("pqc.objective"),value:that.application.trialProdObjective},
        {type:'Word600',title:i18n.t("pqc.mc"),value:that.application.materialCondition},
        {type:'EmptyLength',title:i18n.t("pqc.nt"),value:that.application.memberList},
        {type:'Empty',title:i18n.t("pqc.aa"),value:that.application.applicationAuditorId},
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
            that.$Message.success(i18n.t("pqc.as"));
            that.closePage();
            //console.log(resp.data.trialProdId)
            that.trialProdId=resp.data.trialProdId;
            that.$emit("open-tab","qc-pqc-trialProd-edit-"+that.trialProdId,i18n.t("pqc.mtp")+"-"+that.application.productName,"page-exam-pqc-trialProd-add",{trialProdId:that.trialProdId});
          }
          if(requestMethod=='submit'){
            that.$Message.success(i18n.t("pqc.cs"));
            that.closePage();
          }
          that.formatTime1()
        }).catch(function(){
          that.formatTime1()
        })
      }else{
        that.$http.put('/examinecenter/pqc/trialProd/application?type='+requestMethod,that.application,that.headers).then(function(resp){
          if(requestMethod=='save'){
            that.$Message.success(i18n.t("pqc.ats"));
          }
          if(requestMethod=='submit'){
            that.$Message.success(i18n.t("pqc.cs"));
            that.closePage();
          }
          that.formatTime1()
        }).catch(function(){
          that.formatTime1()
        })
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
      //console.log('试产保存或提交')
      if(requestMethod=='submit'){
        let state = true;
        let params = [
          {type:'Empty',title:i18n.t("pqc.at"),value:that.record.actualTrialProdTime},
          {type:'Empty',title:i18n.t("pqc.qotp"),value:that.record.trialProdQuantity},
          {type:'NumNot0',title:i18n.t("pqc.qotp"),value:that.record.trialProdQuantity},
          {type:'Empty',title:i18n.t("pqc.badQuantity"),value:that.record.badQuantity},
          {type:'Num',title:i18n.t("pqc.badQuantity"),value:that.record.badQuantity},
          {type:'Num',title:i18n.t("pqc.badQuantity"),value:that.record.badQuantity},
          // {type:'Empty',title:i18n.t("pqc.reviewTeam"),value:that.record.reviewProcessId},
          // {type:'Empty',title:'试产说明',value:that.record.trialProdCaption},
          {type:'Word600',title:i18n.t("pqc.explain"),value:that.record.trialProdCaption},
          {type:'Empty',title:i18n.t("pqc.aa"),value:that.record.recordAuditorId},
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
              that.$Notice.warning({title: i18n.t("pqc.qtxd")+(i+1)+i18n.t("pqc.tqxj")});
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
      //console.log(i18n.t("pqc.gt"),val,key,index,o);
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
        // that.defectRecords.prodBatch.DefectPosition.unshift({defectLocId:i18n.t("pqc.wu"),name:i18n.t("pqc.wu")});
        that.$set(that.defectRecords.prodBatch.DefectPosition,0,{defectLocId:null,name:i18n.t("pqc.wu")});

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
    deleteDefect(){//删除缺陷
      let that = this;
      let ss = this.$refs.defectTable.getSelection();
      for(let i=0;i<that.defectRecords.table.data.length;i++){
        for(let j=0;j<ss.length;j++){
          if(that.defectRecords.table.data[i].defectNumber===ss[j].defectNumber){
              that.defectRecords.table.data.splice(i,1)
          }
        }
      }
    },
    getTableLength(){
      let that = this;
      let ss = this.$refs.defectTable.getSelection();
      that.TableLength=ss.length;
    },
    closePage(){
      this.$emit("close-tab",this.$props.tabKey);
    },
  },

  computed:{
    badRate(){//不良率
      let that = this;
      if(that.record.badQuantity&&that.record.trialProdQuantity){
        let x=that.record.badQuantity/that.record.trialProdQuantity*100;
        // x = x.toFixed(2);
        if(x > 100){
          return x=100
        }
        x = Math.floor(x*100) / 100
        return x;
      }else{
        return 0.00;
      }
    }
  }
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
</style>
