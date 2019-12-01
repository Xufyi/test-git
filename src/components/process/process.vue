<template>
  <div class="iqis-page process">
    <!-- <i-input v-model="state" style="width:100px" @on-change="getBlock"></i-input>
    <Checkbox v-model="authorized">有权限</Checkbox> -->
    <div class="iqis-page-block" v-if="auditShow">
      <div class="iqis-page-block-title">审核</div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label">处理方式</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.audit.treatmentType" disabled filterable>
                <Option v-for="item in treatmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">审核人</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.audit.name" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">时间</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.audit.time" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">审核代理人</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.audit.agentName" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">时间</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.audit.agentTime" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">审核意见</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="dto.audit.opinion" :disabled="auditDis"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div>

    <div class="iqis-page-block" v-if="review1Show">
      <div class="iqis-page-block-title">评审团1</div>
      <div class="iqis-page-block-body">
        <template>
          <Row type="flex" :gutter="24" v-for="(data,index) in dto.review1" :key="index">
            <i-col span="6">
              <div class="iqis-page-block-label">处理方式</div>
              <div class="iqis-page-block-ctrl">
                <Select v-model="dto.review1[index].treatmentType" :disabled="review1Dis||dto.review1[index].disabled" filterable>
                  <Option v-for="item in treatmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">评审人{{index+1}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input v-model="dto.review1[index].name" disabled></i-input>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">时间</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.review1[index].time" style="width: 100%"></DatePicker>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">评审代理人</div>
              <div class="iqis-page-block-ctrl">
                <i-input v-model="dto.review1[index].agentName" disabled></i-input>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">时间</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.review1[index].agentTime" style="width: 100%"></DatePicker>
              </div>
            </i-col>
            <i-col span="24">
              <div class="iqis-page-block-label">评审意见</div>
              <div class="iqis-page-block-ctrl">
                <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="dto.review1[index].opinion" :disabled="review1Dis||dto.review1[index].disabled"></i-input>
              </div>
            </i-col>
          </Row>
        </template>
      </div>
    </div>

    <div class="iqis-page-block" v-if="judge1Show">
      <div class="iqis-page-block-title">判定1</div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label">处理方式</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.judge1.treatmentType" disabled filterable>
                <Option v-for="item in treatmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">判定人</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.judge1.name" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">时间</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.judge1.time" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">判定代理人</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.judge1.agentName" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">时间</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.judge1.agentTime" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">判定意见</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="dto.judge1.opinion" :disabled="judge1Dis"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div>

    <div class="iqis-page-block" v-if="appellantShow">
      <div class="iqis-page-block-title">上诉</div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label">处理方式</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.appellant.treatmentType" :disabled="appellantDis" filterable>
                <Option v-for="item in treatmentList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">上诉人</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.appellant.name" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">时间</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.appellant.time" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">上诉代理人</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.appellant.agentName" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">时间</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.appellant.agentTime" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">上诉意见</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="dto.appellant.opinion" :disabled="appellantDis"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div>

    <div class="iqis-page-block" v-if="review2Show">
      <div class="iqis-page-block-title">评审团2</div>
      <div class="iqis-page-block-body">
        <template>
          <Row type="flex" :gutter="24" v-for="(data,index) in dto.review2" :key="index">
            <i-col span="6">
              <div class="iqis-page-block-label">处理方式</div>
              <div class="iqis-page-block-ctrl">
                <Select v-model="dto.review2[index].treatmentType" :disabled="review2Dis||dto.review2[index].disabled" filterable>
                  <Option v-for="item in treatmentLists" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">评审人{{index+1}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input v-model="dto.review2[index].name" disabled></i-input>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">时间</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.review2[index].time" style="width: 100%"></DatePicker>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">评审代理人</div>
              <div class="iqis-page-block-ctrl">
                <i-input v-model="dto.review2[index].agentName" disabled></i-input>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">时间</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.review2[index].agentTime" style="width: 100%"></DatePicker>
              </div>
            </i-col>
            <i-col span="24">
              <div class="iqis-page-block-label">评审意见</div>
              <div class="iqis-page-block-ctrl">
                <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="dto.review2[index].opinion" :disabled="review2Dis||dto.review2[index].disabled"></i-input>
              </div>
            </i-col>
          </Row>
        </template>
      </div>
    </div>

    <div class="iqis-page-block" v-if="judge2Show">
      <div class="iqis-page-block-title">判定2</div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label">处理方式</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.judge2.treatmentType" :disabled="judge2Dis" filterable>
                <Option v-for="item in treatmentLists" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">判定人</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.judge2.name" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">时间</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.judge2.time" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">判定代理人</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.judge2.agentName" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">时间</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.judge2.agentTime" style="width: 100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">判定意见</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="dto.judge2.opinion" :disabled="judge2Dis"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div>

    <div class="iqis-page-block" v-if="noticeShow">
      <div class="iqis-page-block-title">重工处理通知</div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label">重工处理通知人</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.notice.name" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">时间</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.notice.time" style="width: 100%"></DatePicker>
              <!-- <i-input v-model="dto.notice.time" disabled></i-input> -->
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">重工处理通知代理人</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.notice.agentName" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">时间</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.notice.agentTime" style="width: 100%"></DatePicker>
              <!-- <i-input v-model="dto.notice.agentTime" disabled></i-input> -->
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">意见</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="dto.notice.opinion" :disabled="noticeDis"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div>

    <div class="iqis-page-block" v-if="initiateShow">
      <div class="iqis-page-block-title">重工处理</div>
      <div class="iqis-page-block-body">
        <div class="secondTitle">基本资料：</div>
        <Row type="flex" :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label">重工单号</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.basicInformation.reworkNo" :disabled="initiateDis"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">检验单号</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="qcNo" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">时间</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="createTime" style="width: 100%"></DatePicker>
              <!-- <i-input v-model="createTime" disabled></i-input> -->
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">产品编号</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="productNo" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">产品名称</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="productName" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">数量</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.basicInformation.reworkCount" :disabled="initiateDis"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">收料时间</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" :disabled="initiateDis" v-model="dto.basicInformation.receivingTime" style="width: 100%"></DatePicker>
              <!-- <i-input v-model="dto.basicInformation.receivingTime" :disabled="initiateDis"></i-input> -->
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">收料编号</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.basicInformation.receivingNo" :disabled="initiateDis"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">责任单位</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.basicInformation.responsibleDept" :disabled="initiateDis"></i-input>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">重工原因</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="dto.basicInformation.reworkReason" :disabled="initiateDis"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div>

    <template v-if="writeShow">
      <div class="iqis-page-block-tools">
        <div class="iqis-page-block-tools-primary">
          <div class="iqis-page-block-label secondTitle">重工方法：</div>
        </div>
        <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
          <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
            confirm
            :title="i18n.t('iqc.confirmDelete')"
            placement="bottom-end" @on-ok="deleteParams">
            <Button type="ghost" icon="trash-a">删除</Button>
          </Poptip>
        </div>
      </div>
      <div class="iqis-page-block-table">
        <Table  :no-data-text="i18n.t('noData')" ref="write" class="iqis-inline-editor-table noHeight defectTable noBorder location"  border stripe
                v-drag-table-column="writeColumns" :columns="writeColumns" :data="dto.table" >
          <Button :disabled="writeDis" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus" @click="addParams">添加重工内容</Button>
        </Table>
      </div>
    </template>

    <template v-if="countersignShow">
      <div class="secondTitle">会签单位：</div>
      <Row type="flex" :gutter="24">
        <i-col span="6">
          <div class="iqis-page-block-label">IQC确认人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.countersign.iqcConf.name" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.countersign.iqcConf.time" style="width: 100%"></DatePicker>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">IQC确认代理人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.countersign.iqcConf.agentName" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.countersign.iqcConf.agentTime" style="width: 100%"></DatePicker>
          </div>
        </i-col>
      </Row>
      <Row type="flex" :gutter="24">
        <i-col span="6">
          <div class="iqis-page-block-label">SQA确认人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.countersign.sqaConf.name" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.countersign.sqaConf.time" style="width: 100%"></DatePicker>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">SQA确认代理人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.countersign.sqaConf.agentName" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.countersign.sqaConf.agentTime" style="width: 100%"></DatePicker>
          </div>
        </i-col>
      </Row>
      <Row type="flex" :gutter="24">
        <i-col span="6">
          <div class="iqis-page-block-label">生产部确认人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.countersign.prodDepaConf.name" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.countersign.prodDepaConf.time" style="width: 100%"></DatePicker>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">生产部确认代理人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.countersign.prodDepaConf.agentName" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.countersign.prodDepaConf.agentTime" style="width: 100%"></DatePicker>
          </div>
        </i-col>
      </Row>
      <Row type="flex" :gutter="24">
        <i-col span="6">
          <div class="iqis-page-block-label">资材部确认人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.countersign.matDepaConf.name" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.countersign.matDepaConf.time" style="width: 100%"></DatePicker>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">资材部确认代理人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.countersign.matDepaConf.agentName" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.countersign.matDepaConf.agentTime" style="width: 100%"></DatePicker>
          </div>
        </i-col>

      </Row>
    </template>

    <template v-if="enforceShow">
      <div class="iqis-page-block-tools">
        <div class="iqis-page-block-tools-primary">
          <div class="iqis-page-block-label secondTitle">工时统计：</div>
        </div>
        <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
          <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
            confirm
            :title="i18n.t('iqc.confirmDelete')"
            placement="bottom-end" @on-ok="deleteManHour">
            <Button type="ghost" icon="trash-a">删除</Button>
          </Poptip>
        </div>
      </div>
      <div class="iqis-page-block-table">
        <Table  :no-data-text="i18n.t('noData')" ref="manHourTable" class="iqis-inline-editor-table noHeight defectTable noBorder location"  border stripe
                v-drag-table-column="manHourColumns" :columns="manHourColumns" :data="dto.manHourTable" >
          <Button :disabled="enforceDis" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus" @click="addManHour">添加工时统计</Button>
        </Table>
      </div>

      <div class="iqis-page-block-tools">
        <div class="iqis-page-block-tools-primary">
          <div class="iqis-page-block-label secondTitle">物料损耗统计：</div>
        </div>
        <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
          <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
            confirm
            :title="i18n.t('iqc.confirmDelete')"
            placement="bottom-end" @on-ok="deleteMaterialLoss">
            <Button type="ghost" icon="trash-a">删除</Button>
          </Poptip>
        </div>
      </div>
      <div class="iqis-page-block-table">
        <Table  :no-data-text="i18n.t('noData')" ref="materialLossTable" class="iqis-inline-editor-table noHeight defectTable noBorder location"  border stripe
                v-drag-table-column="materialLossColumns" :columns="materialLossColumns" :data="dto.materialLossTable" >
          <Button :disabled="enforceDis" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus" @click="addMaterialLoss">添加物料损耗统计</Button>
        </Table>
      </div>
    </template>

    <template v-if="signAuditShow">
      <div class="secondTitle">签核单位：</div>
      <Row type="flex" :gutter="24">
        <i-col span="6">
          <div class="iqis-page-block-label">审核人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.signAudit.reAudit.name" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.signAudit.reAudit.time" style="width: 100%"></DatePicker>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">审核代理人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.signAudit.reAudit.agentName" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.signAudit.reAudit.agentTime" style="width: 100%"></DatePicker>
          </div>
        </i-col>
      </Row>
      <Row type="flex" :gutter="24">
        <i-col span="6">
          <div class="iqis-page-block-label">核准人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.signAudit.approve.name" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.signAudit.approve.time" style="width: 100%"></DatePicker>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">核准代理人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.signAudit.approve.agentName" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.signAudit.approve.agentTime" style="width: 100%"></DatePicker>
          </div>
        </i-col>
      </Row>
    </template>

    <template v-if="signQcShow">
      <Row type="flex" :gutter="24">
        <i-col span="6">
          <div class="iqis-page-block-label">品管确认人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.signAudit.qualManageConf.name" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.signAudit.qualManageConf.time" style="width: 100%"></DatePicker>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">品管确认代理人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.signAudit.qualManageConf.agentName" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.signAudit.qualManageConf.agentTime" style="width: 100%"></DatePicker>
          </div>
        </i-col>
      </Row>
    </template>

    <template v-if="signProShow">
      <Row type="flex" :gutter="24">
        <i-col span="6">
          <div class="iqis-page-block-label">生管确认人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.signAudit.prodManageConf.name" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.signAudit.prodManageConf.time" style="width: 100%"></DatePicker>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">生管确认代理人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.signAudit.prodManageConf.agentName" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.signAudit.prodManageConf.agentTime" style="width: 100%"></DatePicker>
          </div>
        </i-col>

      </Row>
    </template>
    
    <template v-if="purchaseAuditShow">
      <div class="secondTitle">签核：</div>
      <Row type="flex" :gutter="24">
        <i-col span="6">
          <div class="iqis-page-block-label">采购签核人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.purchaseAudit.name" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.purchaseAudit.time" style="width: 100%"></DatePicker>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">采购签核代理人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.purchaseAudit.agentName" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.purchaseAudit.agentTime" style="width: 100%"></DatePicker>
          </div>
        </i-col>
        <i-col span="24">
          <div class="iqis-page-block-label">采购处理意见</div>
          <div class="iqis-page-block-ctrl">
            <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="dto.purchaseAudit.opinion" :disabled="purchaseAuditDis"></i-input>
          </div>
        </i-col>
      </Row>
    </template>

    <template v-if="managerAuditShow">
      <Row type="flex" :gutter="24">
        <i-col span="6">
          <div class="iqis-page-block-label">经理签核</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.managerAudit.name" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.managerAudit.time" style="width: 100%"></DatePicker>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">经理签核代理人</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="dto.managerAudit.agentName" disabled></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">时间</div>
          <div class="iqis-page-block-ctrl">
            <DatePicker  format="yyyy-MM-dd HH:mm" type="datetime" disabled v-model="dto.managerAudit.agentTime" style="width: 100%"></DatePicker>
          </div>
        </i-col>
        <i-col span="24">
          <div class="iqis-page-block-label">经理批示</div>
          <div class="iqis-page-block-ctrl">
            <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="dto.managerAudit.opinion" :disabled="managerAuditDis"></i-input>
          </div>
        </i-col>
      </Row>
    </template>

    <div class="iqis-page-block" v-if="endCaseShow">
      <div class="iqis-page-block-title">结案</div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="24">
          <i-col span="24">
            <div class="iqis-page-block-label">结案说明</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :autosize="{minRows: 1,maxRows: 6}" v-model="dto.endCase" :disabled="endCaseDis"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div>
    <div v-if="state==19" style="text-align:center;color:#999;font-size:16px;font-weight: bold;">已结案</div>
    <!-- 底部操作按钮 -->
    <IqisAffix placement="bottom" :offset="0" v-if="state!=0&&state!=3" style="z-index:1000">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button v-if="!auditDis" type="primary" @click="save(2)">审核通过</Button>
        <Button v-if="!auditDis" type="primary" @click="save('reject')">审核驳回</Button>
        <!-- <Button v-if="!auditDis" type="primary" @click="save()">审核</Button> -->
        <Button v-if="!commit" type="primary" @click="save()">确定</Button>
        <Button v-if="!judge1Dis||!judge2Dis" type="primary" @click="save(3)">判定通过</Button>
        <Button v-if="!judge1Dis||!judge2Dis" type="primary" @click="save('reject')">判定驳回</Button>
        <Button v-if="!review1Dis||!appellantDis||!review2Dis||!initiateDis||!writeDis||!enforceDis||!purchaseAuditDis||!managerAuditDis||!noticeDis" type="primary" @click="save">提交</Button>
        <!-- <Button v-if="!countersignDis||!signAuditDis" type="primary" @click="save">确定</Button> -->
        <Button v-if="!endCaseDis" type="primary" @click="save(1)">结案</Button>
        <Button type="ghost" @click="closePage">取消</Button>
      </div>
    </IqisAffix>
    <!-- <IqisAffix placement="bottom" :offset="0" v-if="state!=0&&state!=3" style="z-index:1000">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button v-if="!auditDis" type="primary" @click="save">审核通过</Button>
        <Button v-if="!auditDis" type="primary" @click="save('reject')">审核驳回</Button>
        <Button v-if="!judge1Dis||!judge2Dis" type="primary" @click="save">判定通过</Button>
        <Button v-if="!judge1Dis||!judge2Dis" type="primary" @click="save('reject')">判定驳回</Button>
        <Button v-if="!review1Dis||!appellantDis||!review2Dis||!initiateDis||!writeDis||!enforceDis||!purchaseAuditDis||!managerAuditDis" type="primary" @click="save">提交</Button>
        <Button v-if="!countersignDis||!signAuditDis" type="primary" @click="save">确定</Button>
        <Button v-if="!endCaseDis" type="primary" @click="save">结案</Button>
        <Button type="primary">A</Button>
        <Button type="primary">B</Button>
        <Button type="primary">C</Button>
        <Button type="ghost">取消</Button>
      </div>
    </IqisAffix> -->
  </div>
</template>
<script>
import $ from "jquery"
export default {
  // state---状态
  // qcType---哪个qc
  // authorized---禁用状态
  // inspectorId---检验员
  // qcNo---单号
  // createTime---新建时间
  // productNo---产品编号
  // productName---产品名称
  props:['state','processUrl','endUrl','iqcDefects','defResult','judgeDefResult','inspector','qcType','qcId','authorized','totalQuantity','inspectorId','qcNo','createTime','productNo','productName',"reviewRecord","caseExplain"], //结案说明临时方案
  data(){
    return{
      headers: {"headers": {"Content-Type": "application/json; charset=UTF-8"}},
      currentUserId:this.$store.state.currentUserId,
      i18n:window.i18n,
      userDate:[],
      // 由状态和处理方式共同判断显隐条件
      auditShow:false,//检验待审核
      review1Show:false,//检验待评审
      judge1Show:false,//检验待判定
      appellantShow:false,//待上诉
      review2Show:false,//上诉待评审
      judge2Show:false,//上诉待判定
      initiateShow:false,//重工待发起
      noticeShow:false,
      writeShow:false,//重工方法待填写
      countersignShow:false,//重工待会签
      enforceShow:false,//重工待执行
      signAuditShow:false,//重工待签核
      signQcShow:false,//品管
      signProShow:false,//生管
      purchaseAuditShow:false,//重工采购待签核
      managerAuditShow:false,//重工经理待签核
      endCaseShow:false,//待结案

      // 处理方式完整下拉数据
      treatmentList: [
        {value: "QUALIFIED", label: '合格'},
        {value: "ACCEPTABLE", label: '允收'},
        {value: "SPECIAL", label: '特采'},
        {value: "REWORK", label: '特采(返工)'},
        {value: "RETURN", label: '退货'},
        // {value: "REJECT", label: '驳回'},
      ],
      treatmentLists: [
        // {value: "QUALIFIED", label: '合格'},
        // {value: "ACCEPTABLE", label: '允收'},
        {value: "SPECIAL", label: '特采'},
        {value: "REWORK", label: '特采(返工)'},
        {value: "RETURN", label: '退货'},
        // {value: "REJECT", label: '驳回'},
      ],
      treatmentList2: [
        {value: "SPECIAL", label: '特采'},
        {value: "REWORK", label: '特采(返工)'},
        {value: "NOAPPEAL", label: '不上诉'},
      ],
      //需传输给后台的数据，对应html的结构
      dto:{
        audit:{//审核
          userId:null,
          agentId:null,
          treatmentType:'',//处理方式
          name:'',//审核人
          time:'',//审核时间
          agentName:'',//审核代理人
          agentTime:'',//代理时间
          opinion:'',//审核意见
        },
        review1:[//评审1
          {
            userId:null,
            agentId:null,
            treatmentType:'',
            name:'',
            time:'',
            agentName:'',
            agentTime:'',
            opinion:'',
            disabled:false,
          }
        ],
        judge1:{//判定1
          userId:null,
          agentId:null,
          treatmentType:'',
          name:'',
          time:'',
          agentName:'',
          agentTime:'',
          opinion:'',
        },
        appellant:{//上诉
          userId:null,
          agentId:null,
          treatmentType:'',
          name:'',
          time:'',
          agentName:'',
          agentTime:'',
          opinion:'',
        },
        review2:[//评审2
          {
            userId:null,
            agentId:null,
            treatmentType:'',
            name:'',
            time:'',
            agentName:'',
            agentTime:'',
            opinion:'',
            disabled:false,
          },
        ],
        judge2:{//判定2
          userId:null,
          agentId:null,
          treatmentType:'',
          name:'',
          time:'',
          agentName:'',
          agentTime:'',
          opinion:'',
        },
        initiate:{//重工待发起（基本资料）
          userId:null,
          agentId:null,
          name:'',
          time:'',
          agentName:'',
          agentTime:'',
          treatmentType:"PASS",
        },
        basicInformation:{
          reworkNo:'',
          reworkCount:'',
          receivingTime:new Date(),
          receivingNo:'',
          responsibleDept:'',
          reworkReason:'',
        },
        write:{//重工方法填写
          userId:null,
          agentId:null,
          name:'',
          time:'',
          agentName:'',
          agentTime:'',
          
        },
        table:[
            {
              reweokContent:'',//重工内容
              reweokPlace:''//重工地点
            }
        ],
        countersign:{//重工待会签（会签单位）
          //IQC确认人
          iqcConf:{
            userId:null,
            agentId:null,
            name:'',
            time:'',
            agentName:'',
            agentTime:'',
            disabled:false,
          },
          // SQA确认人
          sqaConf:{
            userId:null,
            agentId:null,
            name:'',
            time:'',
            agentName:'',
            agentTime:'',
            disabled:false,
          },
          // 生产部确认人
          prodDepaConf:{
            userId:null,
            agentId:null,
            name:'',
            time:'',
            agentName:'',
            agentTime:'',
            disabled:false,
          },
          // 资材部确认人
          matDepaConf:{
            userId:null,
            agentId:null,
            name:'',
            time:'',
            agentName:'',
            agentTime:'',
            disabled:false,
          }
        },
        enforce:{//重工待执行
          userId:null,
          agentId:null,
          name:'',
          time:'',
          agentName:'',
          agentTime:'',
        },
        materialLossTable:[//物料损耗统计
            {
              materialNo:'',
              spec:'',
              num:''
            }
        ],
         manHourTable:[//工时统计，暂不包括总计
            {
              createTime:'',
              workOrder:'',
              num:'',
              peopleNum:'',
              manHour:'',
              sum:'',
              timeInterval:'',
              leaderId:'',
            }
        ],
        signAudit:{//重工待签核（签核单位）
          //（重工）审核人
          reAudit:{
            userId:null,
            agentId:null,
            name:'',
            time:'',
            agentName:'',
            agentTime:'',
            disabled:false,
          },
          // 核准人
          approve:{
            userId:null,
            agentId:null,
            name:'',
            time:'',
            agentName:'',
            agentTime:'',
            disabled:false,
          },
          // 品管确认人
          qualManageConf:{
            userId:null,
            agentId:null,
            name:'',
            time:'',
            agentName:'',
            agentTime:'',
            disabled:false,
          },
          // 生管确认人
          prodManageConf:{
            userId:null,
            agentId:null,
            name:'',
            time:'',
            agentName:'',
            agentTime:'',
            disabled:false,
          }
        },
        purchaseAudit:{//重工采购待签核
          userId:null,
          agentId:null,
          name:'',
          time:'',
          agentName:'',
          agentTime:'',
          opinion:'',
        },
        managerAudit:{//重工经理待签核
          userId:null,
          agentId:null,
          name:'',
          time:'',
          agentName:'',
          agentTime:'',
          opinion:'',
        },
        endCase:'',//待结案
      },
      writeColumns:[
        {
          type: 'selection',
          width: 40,
          align: 'center',
          minWidth: 40,
          maxWidth: 40
        },
        {
          title: i18n.t('iqc.no'),
          width: 40,
          render: this.$iqis.utils.tableHelper.buildIndexColumnRender(this),
          align: "center",
          minWidth: 40,
          maxWidth: 40
        },
        {
          title: '重工内容',
          key:"reweokContent",
          minWidth: 300,
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  value:params.row.reweokContent,
                  disabled:this.writeDis,
                },
                on: {
                  "on-blur": event => {
                    params.row.reweokContent = event.target.value
                    this.dto.table[params.index] =params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '重工地点',
          key:"reweokPlace",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  value:params.row.reweokPlace,
                  disabled:this.writeDis,
                },
                on: {
                  "on-blur": event => {
                    params.row.reweokPlace = event.target.value
                    this.dto.table[params.index] =params.row;
                  }
                }
              })
            ]);
          }
        },
      ],
      manHourColumns:[
        {
          type: 'selection',
          width: 40,
          align: 'center',
          minWidth: 40,
          maxWidth: 40
        },
        {
          title: i18n.t('iqc.no'),
          width: 40,
          render: this.$iqis.utils.tableHelper.buildIndexColumnRender(this),
          align: "center",
          minWidth: 40,
          maxWidth: 40
        },
        {
          title: '时间',
          key:"createTime",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h("DatePicker", {
                props: {
                  value:params.row.createTime,
                  disabled:this.enforceDis,
                },
                on: {
                  "on-change": event => {
                    params.row.createTime = event
                    this.dto.manHourTable[params.index] =params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '制造工令',
          key:"workOrder",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  value:params.row.workOrder,
                  disabled:this.enforceDis,
                },
                on: {
                  "on-blur": event => {
                    params.row.workOrder = event.target.value
                    this.dto.manHourTable[params.index] =params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '数量',
          key:"num",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  value:params.row.num,
                  disabled:this.enforceDis,
                },
                on: {
                  "on-blur": event => {
                    params.row.num = event.target.value
                    this.dto.manHourTable[params.index] =params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '人数',
          key:"peopleNum",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  value:params.row.peopleNum,
                  disabled:this.enforceDis,
                },
                on: {
                  "on-blur": event => {
                    params.row.peopleNum = event.target.value
                    this.dto.manHourTable[params.index] =params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '单位工时',
          key:"manHour",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  value:params.row.manHour,
                  disabled:this.enforceDis,
                },
                on: {
                  "on-blur": event => {
                    params.row.manHour = event.target.value
                    this.dto.manHourTable[params.index] =params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '合计',
          key:"sum",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  value:params.row.sum,
                  disabled:this.enforceDis,
                },
                on: {
                  "on-blur": event => {
                    params.row.sum = event.target.value
                    this.dto.manHourTable[params.index] =params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '时段',
          key:"timeInterval",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  value:params.row.timeInterval,
                  disabled:this.enforceDis,
                },
                on: {
                  "on-blur": event => {
                    params.row.timeInterval = event.target.value
                    this.dto.manHourTable[params.index] =params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '负责人',
          key:"leaderId",
          minWidth: 100,
          render: (h, params) => {
            let _this = this;
            return h('Select', {
                props:{
                    filterable:true,
                    value: params.row.leaderId,
                    disabled:this.enforceDis,
                },
                style:{
                  border:'0px'
                },
                on: {
                    'on-change':(event) => {
                        params.row.leaderId = event
                        this.dto.manHourTable[params.index] =params.row
                    }
                },
            },
                this.userDate.map(function(type){
                    return h('Option', {
                        props: {value: type.userId,label:type.name}
                    }, type);
                })
            );
          }
          // render: (h, params) => {
          //   return h("div", [
          //     h("Input", {
          //       props: {
          //         value:params.row.leader,
          //         disabled:this.enforceDis,
          //       },
          //       on: {
          //         "on-blur": event => {
          //           params.row.leader = event.target.value
          //           this.dto.manHourTable[params.index] =params.row;
          //         }
          //       }
          //     })
          //   ]);
          // }
        },
      ],
      materialLossColumns:[
        {
          type: 'selection',
          width: 40,
          align: 'center',
          minWidth: 40,
          maxWidth: 40
        },
        {
          title: i18n.t('iqc.no'),
          width: 40,
          render: this.$iqis.utils.tableHelper.buildIndexColumnRender(this),
          align: "center",
          minWidth: 40,
          maxWidth: 40
        },
        {
          title: '料号',
          key:"materialNo",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  value:params.row.materialNo,
                  disabled:this.enforceDis,
                },
                on: {
                  "on-blur": event => {
                    params.row.materialNo = event.target.value
                    this.dto.materialLossTable[params.index] =params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '品名/规格',
          key:"spec",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  value:params.row.spec,
                  disabled:this.enforceDis,
                },
                on: {
                  "on-blur": event => {
                    params.row.spec = event.target.value
                    this.dto.materialLossTable[params.index] =params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '数量',
          key:"num",
          minWidth: 100,
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: {
                  value:params.row.num,
                  disabled:this.enforceDis,
                },
                on: {
                  "on-blur": event => {
                    params.row.num = event.target.value
                    this.dto.materialLossTable[params.index] =params.row;
                  }
                }
              })
            ]);
          }
        },
      ],
    }
  },
  created(){
    
    
    this.refreshData()
    this.getUser()
  },
  methods:{
    getReviewRecord(){
      return this.dto
    },
    getUser() {
      let url = "/tenant/user?limit=9999999"
      this.$http.get(url).then((res) => {
          this.userDate = res.data;
        })
    },
    closePage() {
      this.$emit("cancel")
    },
    save(reject){
        // let dto = JSON.parse(JSON.stringify(this.dto))
        if((reject==2&&(this.state==1||this.state==6))||(reject==3&&(this.state==5||this.state==10))) {
          this.$emit("save",2)
        }
        if(reject=='reject'){
          if(this.state==1||this.state==3){
            this.dto.audit.treatmentType = 'REJECT'
          }else if(this.state==5){
            this.dto.judge1.treatmentType = 'REJECT'
          }else if(this.state==9){
            this.dto.judge2.treatmentType = 'REJECT'
          }
        }
        if(this.state == 11) {
          this.dto.initiate.treatmentType='PASS'
        }
        if(this.state == 22) {
          this.dto.notice.treatmentType='PASS'
        }
        if(this.state == 12) {
          this.dto.table.treatmentType="PASS"
          this.dto.write.treatmentType="PASS"
        }
        if(this.state == 13&&(this.dto.countersign.iqcConf.userId==this.currentUserId||this.dto.countersign.iqcConf.agentId==this.currentUserId)) {//状态为13(会签) 且 当前人和会签人1一致  下三个相同
          this.dto.countersign.iqcConf.treatmentType="PASS"
        }
        if(this.state == 13&&(this.dto.countersign.sqaConf.userId==this.currentUserId||this.dto.countersign.sqaConf.agentId==this.currentUserId)) {
          this.dto.countersign.sqaConf.treatmentType="PASS"
        }
        if(this.state == 13&&(this.dto.countersign.prodDepaConf.userId==this.currentUserId||this.dto.countersign.prodDepaConf.agentId==this.currentUserId)) {
          this.dto.countersign.prodDepaConf.treatmentType="PASS"
        }
        if(this.state == 13&&(this.dto.countersign.matDepaConf.userId==this.currentUserId||this.dto.countersign.matDepaConf.agentId==this.currentUserId)) {
          this.dto.countersign.matDepaConf.treatmentType="PASS"
        }
        if(this.state == 14&&this.dto.enforce.userId==this.currentUserId) {
          this.dto.enforce.treatmentType="PASS"
        }
        if(this.state == 15&&(this.dto.signAudit.approve.userId==this.currentUserId||this.dto.signAudit.approve.agentId==this.currentUserId)) {
          this.dto.signAudit.approve.treatmentType="PASS"
        }
        if(this.state == 15&&(this.dto.signAudit.reAudit.userId==this.currentUserId||this.dto.signAudit.reAudit.agentId==this.currentUserId)) {
          this.dto.signAudit.reAudit.treatmentType="PASS"
        }
        if(this.state == 20&&(this.dto.signAudit.qualManageConf.userId==this.currentUserId||this.dto.signAudit.qualManageConf.agentId==this.currentUserId)) {
          this.dto.signAudit.qualManageConf.treatmentType="PASS"
        }
        if(this.state == 21&&(this.dto.signAudit.prodManageConf.userId==this.currentUserId||this.dto.signAudit.prodManageConf.agentId==this.currentUserId)) {
          this.dto.signAudit.prodManageConf.treatmentType="PASS"
        }
        if(this.state == 16&&(this.dto.purchaseAudit.userId==this.currentUserId||this.dto.purchaseAudit.agentId==this.currentUserId)) {
          this.dto.purchaseAudit.treatmentType="PASS"
        }
        if(this.state == 17&&(this.dto.managerAudit.userId==this.currentUserId||this.dto.managerAudit.agentId==this.currentUserId)) {
          this.dto.managerAudit.treatmentType="PASS"
        }

        if(reject==1) {
          this.$http.put(this.endUrl+this.qcId, {caseExplain:this.dto.endCase}).then(res=>{
            this.$Message.success('提交成功')
            this.$emit("cancel")
          })
          return
        }
        this.$http.put(this.processUrl+'?'+this.qcType+'Id='+this.qcId, this.dto, this.headers).then(res=>{
          this.$Message.success('提交成功')
          this.$emit("cancel")
        })
        

    },
    refreshData(){
      let that = this;
      that.$http.get(that.processUrl+'/'+that.qcId).then(res=>{//所有的时间需要转换

        that.dto.basicInformation.reworkReason=''//带出结果为返工的描述
        that.dto.basicInformation = res.data.basicInformation || that.dto.basicInformation
        that.dto.basicInformation.receivingTime = res.data.basicInformation.receivingTime?new Date(res.data.basicInformation.receivingTime) : ''

        that.dto.basicInformation.reworkCount = res.data.basicInformation.reworkCount?res.data.basicInformation.reworkCount:this.totalQuantity//为空时带出批量数 
        if(this.state==11) {
          for(let i in this.iqcDefects) {
            let item = this.iqcDefects[i]
            if(item.decisionResultsId==3) {
              if(!that.dto.basicInformation.reworkReason) {//要变空 否则显示null
                that.dto.basicInformation.reworkReason=''
              }
              that.dto.basicInformation.reworkReason += `${item.inspectionTypeName}, ${item.defectTypeName}, ${item.describe}。  `
            }
          }
        }
        
        
        that.dto.audit = res.data.audit || that.dto.audit
        if(!res.data.audit.treatmentType) {//默认是退货
          that.dto.audit.treatmentType='RETURN'
        }
        that.dto.audit.time = res.data.audit.time?new Date(res.data.audit.time) : ''
        that.dto.audit.agentTime = res.data.audit.agentTime?new Date(res.data.audit.agentTime) : ''
        that.dto.judge1 = res.data.judge1 || that.dto.judge1
        that.dto.judge1.time = res.data.judge1.time? new Date(res.data.judge1.time) : ''
        that.dto.judge1.agentTime = res.data.judge1.agentTime? new Date(res.data.judge1.agentTime) : ''
        that.dto.judge2 = res.data.judge2 || that.dto.judge2
        that.dto.judge2.time = res.data.judge2.time?new Date(res.data.judge2.time) : ''
        that.dto.judge2.agentTime = res.data.judge2.agentTime?new Date(res.data.judge2.agentTime) : ''
        that.dto.appellant = res.data.appellant || that.dto.appellant
        that.dto.appellant.time = res.data.appellant.time? new Date(res.data.appellant.time) : ''
        that.dto.appellant.agentTime = res.data.appellant.agentTime? new Date(res.data.appellant.agentTime) : ''
        that.dto.initiate = res.data.initiate || that.dto.initiate
        that.dto.write = res.data.write || that.dto.write
        that.dto.table = res.data.table || that.dto.table
        that.dto.countersign.iqcConf = res.data.countersign.iqcConf || that.dto.countersign.iqcConf
        that.dto.countersign.iqcConf.time = res.data.countersign.iqcConf.time? new Date(res.data.countersign.iqcConf.time) : ''
        that.dto.countersign.iqcConf.agentTime = res.data.countersign.iqcConf.agentTime? new Date(res.data.countersign.iqcConf.agentTime) : ''
        that.dto.countersign.matDepaConf = res.data.countersign.matDepaConf || that.dto.countersign.matDepaConf
        that.dto.countersign.matDepaConf.time = res.data.countersign.matDepaConf.time? new Date(res.data.countersign.matDepaConf.time) : ''
        that.dto.countersign.matDepaConf.agentTime = res.data.countersign.matDepaConf.agentTime? new Date(res.data.countersign.matDepaConf.agentTime) : ''
        that.dto.countersign.prodDepaConf = res.data.countersign.prodDepaConf || that.dto.countersign.prodDepaConf
        that.dto.countersign.prodDepaConf.time = res.data.countersign.prodDepaConf.time? new Date(res.data.countersign.prodDepaConf.time) : ''
        that.dto.countersign.prodDepaConf.agentTime = res.data.countersign.prodDepaConf.agentTime? new Date(res.data.countersign.prodDepaConf.agentTime) : ''
        that.dto.countersign.sqaConf = res.data.countersign.sqaConf || that.dto.countersign.sqaConf
        that.dto.countersign.sqaConf.time = res.data.countersign.sqaConf.time? new Date(res.data.countersign.sqaConf.time) : ''
        that.dto.countersign.sqaConf.agentTime = res.data.countersign.sqaConf.agentTime? new Date(res.data.countersign.sqaConf.agentTime) : ''
        that.dto.enforce = res.data.enforce || that.dto.enforce
        that.dto.manHourTable = res.data.manHourTable || that.dto.manHourTable
        for(let i in that.dto.manHourTable) {
          that.dto.manHourTable[i].createTime = that.dto.manHourTable[i].createTime? new Date(that.dto.manHourTable[i].createTime):''
        }
        that.dto.materialLossTable = res.data.materialLossTable || that.dto.materialLossTable
        that.dto.signAudit.approve = res.data.signAudit.approve || that.dto.signAudit.approve
        that.dto.signAudit.approve.time = res.data.signAudit.approve.time? new Date(res.data.signAudit.approve.time) : ''
        that.dto.signAudit.approve.agentTime = res.data.signAudit.approve.agentTime? new Date(res.data.signAudit.approve.agentTime) : ''
        that.dto.signAudit.prodManageConf = res.data.signAudit.prodManageConf || that.dto.signAudit.prodManageConf
        that.dto.signAudit.prodManageConf.time = res.data.signAudit.prodManageConf.time? new Date(res.data.signAudit.prodManageConf.time) : ''
        that.dto.signAudit.prodManageConf.agentTime = res.data.signAudit.prodManageConf.agentTime? new Date(res.data.signAudit.prodManageConf.agentTime) : ''
        that.dto.signAudit.qualManageConf = res.data.signAudit.qualManageConf || that.dto.signAudit.qualManageConf
        that.dto.signAudit.qualManageConf.time = res.data.signAudit.qualManageConf.time? new Date(res.data.signAudit.qualManageConf.time) : ''
        that.dto.signAudit.qualManageConf.agentTime = res.data.signAudit.qualManageConf.agentTime? new Date(res.data.signAudit.qualManageConf.agentTime) : ''
        that.dto.signAudit.reAudit = res.data.signAudit.reAudit || that.dto.signAudit.reAudit
        that.dto.signAudit.reAudit.time = res.data.signAudit.reAudit.time? new Date(res.data.signAudit.reAudit.time) :''
        that.dto.signAudit.reAudit.agentTime = res.data.signAudit.reAudit.agentTime? new Date(res.data.signAudit.reAudit.agentTime) :''
        that.dto.purchaseAudit = res.data.purchaseAudit || that.dto.purchaseAudit
        that.dto.purchaseAudit.time = res.data.purchaseAudit.time? new Date(res.data.purchaseAudit.time) : ''
        that.dto.purchaseAudit.agentTime = res.data.purchaseAudit.agentTime? new Date(res.data.purchaseAudit.agentTime) : ''
        that.dto.managerAudit = res.data.managerAudit || that.dto.managerAudit
        that.dto.managerAudit.time = res.data.managerAudit.time? new Date(res.data.managerAudit.time) : ''
        that.dto.managerAudit.agentTime = res.data.managerAudit.agentTime? new Date(res.data.managerAudit.agentTime) : ''
        that.dto.review1 = res.data.review1 || that.dto.review1
        that.dto.review2 = res.data.review2 || that.dto.review2
        for(let i in that.dto.review1) {
          that.dto.review1[i] = res.data.review1[i] || that.dto.review1[i]
          that.dto.review1[i].time = that.dto.review1[i].time? new Date(that.dto.review1[i].time):''
          that.dto.review1[i].agentTime = that.dto.review1[i].agentTime? new Date(that.dto.review1[i].agentTime):''
        }
        for(let i in that.dto.review2) {
          that.dto.review2[i] = res.data.review2[i] || that.dto.review2[i]
          that.dto.review2[i].time = that.dto.review2[i].time? new Date(that.dto.review2[i].time):''
          that.dto.review2[i].agentTime = that.dto.review2[i].agentTime? new Date(that.dto.review2[i].agentTime):''
        }
        that.dto.notice = res.data.notice || that.dto.notice
        that.dto.notice.time = res.data.notice.time? new Date(res.data.notice.time) : ''
        that.dto.notice.agentTime = res.data.notice.agentTime? new Date(res.data.notice.agentTime) : ''
        that.dto.endCase = res.data.endCase
        if(this.state==5||this.state==10) {
          this.dto.judge1.treatmentType=this.dto.audit.treatmentType
        }


        that.$forceUpdate();
        that.getBlock()
        that.$emit('watchState',this.auditDis,this.judge1Dis)
      })
    },
    getBlock(){
      let state = this.state
      if(state != 0 &&state != 3){
        this.auditShow=true
      }
      if(this.dto.audit && this.dto.audit.treatmentType && (this.dto.audit.treatmentType=='SPECIAL'||this.dto.audit.treatmentType=='REWORK')&&state!=6){
        this.review1Show=true
      }
      if(state>=5&&state!=6){
        this.judge1Show=true
      }
      if(this.dto.judge1 && this.dto.judge1.treatmentType && this.dto.judge1.treatmentType=='RETURN'&&(state!=5&&state!=10)){
        this.appellantShow=true
      }
      if(this.dto.appellant && this.dto.appellant.treatmentType && (this.dto.appellant.treatmentType=='SPECIAL'||this.dto.appellant.treatmentType=='REWORK')){
        this.review2Show=true
      }
      if(this.dto.appellant && this.dto.appellant.treatmentType && (this.dto.appellant.treatmentType=='SPECIAL'||this.dto.appellant.treatmentType=='REWORK')&&state!=8){
        this.judge2Show=true
      }
      if(this.dto.judge1 && this.dto.judge1.treatmentType && (this.dto.judge1.treatmentType=='REWORK'||(this.dto.judge2&&this.dto.judge2.treatmentType=='REWORK'))&&(state!=5&&state!=10)){
        this.noticeShow=true
        if(state>=11&&state!=22){
          this.initiateShow=true
        }
        if(state>=12&&state!=22){
          this.writeShow=true
        }
        if(state>=13&&state!=22){
          this.countersignShow=true
        }
        if(state>=14&&state!=22){
          this.enforceShow=true
        }
        if(state>=15&&state!=22){
          this.signAuditShow=true
        }
        if(state>=16&&state!=22){
          this.signQcShow=true
        }
        if(state>=16&&state!=20&&state!=22){
          this.signProShow=true
        }
        if(state>=16&&state!=20&&state!=21&&state!=22){
          this.purchaseAuditShow=true
        }
        if(state>=17&&state!=20&&state!=21&&state!=22){
          this.managerAuditShow=true
        }
      }
      if(state>=18&&state!=20&&state!=21&&state!=22&&(state!=5&&state!=10)){
        this.endCaseShow=true
      }
    },
    addParams(){
      var newRow = {
       "reweokContent":"",
       "reweokPlace":"",
        rowId:this.dto.table.length
      }
      this.dto.table.push({...newRow});
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((this.dto.write.length-1-6)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');
      })
      
    },
    deleteParams(){
      let selection = this.$refs.write.getSelection();
      console.log(selection,88)
      
      if(selection.length > 0){
        for(let i in selection){
          for(let j in this.dto.table){
            if(selection[i].rowId == this.dto.table[j].rowId){
             this.dto.table.splice(j,1);
            }
          }
        }
      }
      // this.selectsParams = 0;
     
      
    },
    addManHour(){
      var newRow = {
        "createTime":'',
        "workOrder":'',
        "num":'',
        "peopleNum":'',
        "manHour":'',
        "sum":'',
        "timeInterval":'',
        "leaderId":'',

        rowId:this.dto.manHourTable.length
      }
      this.dto.manHourTable.push({...newRow});
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((this.dto.manHourTable.length-1-6)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');
      })
      
    },
    deleteManHour(){
      let selection = this.$refs.manHourTable.getSelection();
      
      if(selection.length > 0){
        for(let i in selection){
          for(let j in this.dto.manHourTable){
            if(selection[i].rowId == this.dto.manHourTable[j].rowId){
             this.dto.manHourTable.splice(j,1);
            }
          }
        }
      }

    },
    addMaterialLoss(){
      var newRow = {
          "materialNo":'',
          "spec":'',
          "num":'',

        rowId:this.dto.materialLossTable.length
      }
      this.dto.materialLossTable.push({...newRow});
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((this.dto.materialLossTable.length-1-6)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');
      })
      
    },
    deleteMaterialLoss(){
      let selection = this.$refs.materialLossTable.getSelection();
      
      if(selection.length > 0){
        for(let i in selection){
          for(let j in this.dto.materialLossTable){
            if(selection[i].rowId == this.dto.materialLossTable[j].rowId){
             this.dto.materialLossTable.splice(j,1);
            }
          }
        }
      }

    }

  },
 

  
  computed:{
  
    auditDis(){//审核部分亮起条件：状态是检验待审核或检验判定驳回 且当前人是审核人 且有权限
      let isCurrent = (this.state == 1||this.state == 6)&&(this.currentUserId == this.dto.audit.userId||this.currentUserId == this.dto.audit.agentId)&&this.authorized

      let ddd = {
        state: this.state,
        currentUserId: this.currentUserId,
        dto:this.dto,
        authorized: this.authorized
      }
      return !isCurrent

    },
    commit() {
      //(this.state == 13 && (this.currentUserId == this.dto.countersign.iqcConf.userId || this.currentUserId == this.dto.countersign.matDepaConf.userId||this.currentUserId == this.dto.countersign.prodDepaConf.userId||this.currentUserId == this.dto.countersign.sqaConf.userId))//状态为会签 且当前人为签核人
      //(this.state == 20&&this.currentUserId == this.dto.signAudit.qualManageConf.userId) //状态为品管核签 
      let isCurrent = (this.state == 13 && (this.currentUserId == this.dto.countersign.iqcConf.userId || this.currentUserId == this.dto.countersign.iqcConf.agentId ||this.currentUserId == this.dto.countersign.matDepaConf.userId||this.currentUserId == this.dto.countersign.matDepaConf.agentId||this.currentUserId == this.dto.countersign.prodDepaConf.userId||this.currentUserId == this.dto.countersign.prodDepaConf.agentId||this.currentUserId == this.dto.countersign.sqaConf.userId||this.currentUserId == this.dto.countersign.sqaConf.agentId))||(this.state == 20&&(this.currentUserId == this.dto.signAudit.qualManageConf.userId||this.currentUserId == this.dto.signAudit.qualManageConf.agentId))||(this.state == 21&&(this.currentUserId ==this.dto.signAudit.prodManageConf.userId||this.currentUserId ==this.dto.signAudit.prodManageConf.agentId))||(this.state == 15 && (this.currentUserId == this.dto.signAudit.reAudit.userId||this.currentUserId == this.dto.signAudit.reAudit.agentId||this.currentUserId == this.dto.signAudit.approve.userId||this.currentUserId == this.dto.signAudit.approve.agentId))
      return !isCurrent
    },
    review1Dis(){//评审1部分亮起条件：状态是检验待评审 且当前人是评审人之一 且有权限
      let isMember = this.dto.review1.some((item,index,arr)=>{
        return item.userId == this.currentUserId||item.agentId == this.currentUserId
      })
      let isCurrent = this.state == 4&&isMember&&this.authorized
      return !isCurrent
    },
    judge1Dis(){//判定1部分亮起条件：状态是检验待判定或上诉判定驳回 且当前人是判定人 且有权限
      let isCurrent = (this.state == 5||this.state == 10)&&(this.currentUserId == this.dto.judge1.userId||this.currentUserId == this.dto.judge1.agentId)&&this.authorized
      return !isCurrent
    },
    appellantDis(){//上诉部分亮起条件：状态是待上诉 且当前人是上诉人 且有权限
      let isCurrent = this.state == 7&&(this.currentUserId == this.dto.appellant.userId||this.currentUserId == this.dto.appellant.agentId)&&this.authorized
      return !isCurrent
    },
    noticeDis(){
      let isCurrent = this.state == 22&&(this.currentUserId == this.dto.notice.userId||this.currentUserId == this.dto.notice.agentId)
      return !isCurrent
    },
    review2Dis(){//评审2部分亮起条件：状态是上诉待评审 且当前人是评审人之一 且有权限
      let isMember = this.dto.review2.some((item,index,arr)=>{
        return item.userId == this.currentUserId||item.agentId == this.currentUserId
      })
      let isCurrent = this.state == 8&&isMember&&this.authorized
      return !isCurrent
    },
    judge2Dis(){//判定2部分亮起条件：状态是上诉待判定 且当前人是判定人 且有权限
      let isCurrent = this.state == 9&&(this.currentUserId == this.dto.judge2.userId||this.currentUserId == this.dto.judge2.agentId)&&this.authorized
      return !isCurrent
    },

    initiateDis(){//基本资料部分亮起条件：状态是重工待发起 且当前人是发起人 且有权限
      let isCurrent = this.state == 11&&(this.currentUserId == this.dto.initiate.userId||this.currentUserId == this.dto.initiate.agentId)&&this.authorized
      return !isCurrent
    },
    writeDis(){//重工方法部分亮起条件：状态是重工方法待填写 且当前人是填写人 且有权限
      let isCurrent = this.state == 12&&(this.currentUserId == this.dto.write.userId||this.currentUserId == this.dto.write.agentId)&&this.authorized
      return !isCurrent    
    },
    countersignDis(){//会签单位部分亮起条件：状态是重工待会签 且当前人是会签人之一 且有权限
      if(!this.dto.countersign){
        return false
      }
      let iqcConf = this.dto.countersign.iqcConf
      let sqaConf = this.dto.countersign.sqaConf
      let prodDepaConf = this.dto.countersign.prodDepaConf
      let matDepaConf = this.dto.countersign.matDepaConf
      let isMember = 
        (!iqcConf.time&&!iqcConf.agentTime&&
        (this.currentUserId == iqcConf.userId||this.currentUserId == iqcConf.agentId))||

        (!sqaConf.time&&!sqaConf.agentTime&&
        (this.currentUserId == sqaConf.userId||this.currentUserId == sqaConf.agentId))||

        (!prodDepaConf.time&&!prodDepaConf.agentTime&&
        (this.currentUserId == prodDepaConf.userId||this.currentUserId == prodDepaConf.agentId))||
        
        (!matDepaConf.time&&!matDepaConf.agentTime&&
        (this.currentUserId == matDepaConf.userId||this.currentUserId == matDepaConf.agentId))

      let isCurrent = this.state == 13&&isMember&&this.authorized
      return !isCurrent   
    },
    enforceDis(){//工时统计和物料损耗统计部分亮起条件：状态是重工待执行 且当前人是执行人 且有权限
      let isCurrent = this.state == 14&&(this.currentUserId == this.dto.enforce.userId||this.currentUserId == this.dto.enforce.agentId)&&this.authorized
      return !isCurrent     
    },
    signAuditDis(){//签核单位部分亮起条件：状态是重工待签核 且当前人是签核人之一 且有权限
      let reAudit = this.dto.signAudit.reAudit
      let approve = this.dto.signAudit.approve
      let qualManageConf = this.dto.signAudit.qualManageConf
      let prodManageConf = this.dto.signAudit.prodManageConf
      let isMember = 
        (!reAudit.time&&!reAudit.agentTime&&
        (this.currentUserId == reAudit.userId||this.currentUserId == reAudit.agentId))||

        ((reAudit.time||reAudit.agentTime)&&!approve.time&&!approve.agentTime&&
        (this.currentUserId == approve.userId||this.currentUserId == approve.agentId))||

        ((approve.time||approve.agentTime)&&!qualManageConf.time&&!qualManageConf.agentTime&&
        (this.currentUserId == qualManageConf.userId||this.currentUserId == qualManageConf.agentId))||
        
        ((qualManageConf.time||qualManageConf.agentTime)&&!prodManageConf.time&&!prodManageConf.agentTime&&
        (this.currentUserId == prodManageConf.userId||this.currentUserId == prodManageConf.agentId))

      let isCurrent = this.state == 15&&isMember&&this.authorized
      return !isCurrent      
    },
    purchaseAuditDis(){//采购签核部分亮起条件：状态是重工采购待签核 且当前人是采购签核人 且有权限
      let isCurrent = this.state == 16&&(this.currentUserId == this.dto.purchaseAudit.userId||this.currentUserId == this.dto.purchaseAudit.agentId)&&this.authorized
      return !isCurrent     
    },
    managerAuditDis(){//经理签核部分亮起条件：状态是重工经理待签核 且当前人是经理签核人 且有权限
      let isCurrent = this.state == 17&&(this.currentUserId == this.dto.managerAudit.userId||this.currentUserId == this.dto.managerAudit.agentId)&&this.authorized
      return !isCurrent     
    },
    endCaseDis(){//结案部分亮起条件：状态是待结案 且当前人是检验员 且有权限
      let isCurrent = this.state == 18&&this.currentUserId == this.inspectorId&&this.authorized
      return !isCurrent
    }
  },
  watch:{
    defResult:function() {
       let defResult = Math.max(...this.defResult)
       switch(defResult) {
          case 0:
            this.dto.audit.treatmentType='QUALIFIED'
            break;
          case 1:
            this.dto.audit.treatmentType='ACCEPTABLE'
            break;
          case 2:
            this.dto.audit.treatmentType='SPECIAL'
            break;
          case 3:
            this.dto.audit.treatmentType='REWORK'
            break;
          case 4:
            this.dto.audit.treatmentType='RETURN'
            break;
        }
    },
    judgeDefResult:function() {
       let judgeDefResult = Math.max(...this.judgeDefResult)
       switch(judgeDefResult) {
          case 0:
            this.dto.judge1.treatmentType='QUALIFIED'
            break;
          case 1:
            this.dto.judge1.treatmentType='ACCEPTABLE'
            break;
          case 2:
            this.dto.judge1.treatmentType='SPECIAL'
            break;
          case 3:
            this.dto.judge1.treatmentType='REWORK'
            break;
          case 4:
            this.dto.judge1.treatmentType='RETURN'
            break;
        }
    }
  }
}
</script>

<style>
.process .ivu-col.ivu-col-span-6{
  width:20%;
}
.secondTitle{
  font-weight: bold;
}
</style>
