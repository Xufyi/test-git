<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t('statistical.BasicInformation')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.analysisNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="noPermsDis" v-model="basic.no" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.analTheme")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="noPermsDis" v-model="basic.theme" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.analysisTime")}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :clearable="false" :disabled="noPermsDis" v-model="basic.analysisTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.analysisPeople")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis" v-model="basic.analysisUserId" filterable>
                <Option v-for="(item,index) in userList" :key="index" :value="item.userId">{{item.name}}</Option>
              </Select>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.version')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="noPermsDis" v-model="basic.version" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.analysisType')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis" v-model="basic.analysisType" filterable>
                <Option value="process">{{$t('statistical.processProject')}}</Option>
                <Option value="design">{{$t('statistical.designProject')}}</Option>
              </Select>        
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.scoringStandard')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis" v-model="basic.scoringStandardId" filterable>
                <Option v-for="(item,index) in standardList" :key="index" :value="item.scoringStandardId">{{item.name}}</Option>
              </Select>        
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.launchProcess')}}</div>
            <div class="iqis-page-block-ctrl">
              <RadioGroup v-model="basic.isProcess" @on-change="changeLaunchProcess">
                <Radio :disabled="basic.auditState==1" :label='0'>{{$t('statistical.no2')}}</Radio>
                <Radio :disabled="basic.auditState==1" :label='1'>{{$t("statistical.yes")}}</Radio>
              </RadioGroup>    
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.productNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :label="basic.productNo" filterable remote :remote-method="remoteMethod" :loading="loadingRemote" :disabled="basic.disabled||noPermsDis" v-model="basic.productId" @on-change="changeProductId(basic.productId)">
                <Option v-for="(data,index) in productList" :key="index" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select>   
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.productName')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.productName" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.productSpec")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.productSpec" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6" v-if="basic.isProcess==1">
            <div class="iqis-page-block-label">{{$t('statistical.approvalProcess')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis||basic.auditState==1" v-model="basic.reviewProcessId" filterable>
                <Option v-for="(item,index) in reviewProcessList" :key="index" :value="item.reviewProcessId">{{item.name}}</Option>
              </Select>             
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('statistical.remarks')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" v-model="basic.remarks" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
        </Row>
        
      </div>
    </div>
    <div class="iqis-page-block" v-if="basic.auditState==1&&basic.reviewProcessId">
      <div class="iqis-page-block-title">
        {{$t('statistical.approvalRecord')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.auditor')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[0].reviewUserName" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.auditTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :clearable="false" disabled v-model="basic.fmeaAnalysisReviewRecord[0].reviewTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.reviewer')}}3</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[3].reviewUserName" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.reviewTime")}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :clearable="false" disabled v-model="basic.fmeaAnalysisReviewRecord[3].reviewTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </div> 
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.reviewer')}}1</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[1].reviewUserName" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.reviewTime")}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :clearable="false" disabled v-model="basic.fmeaAnalysisReviewRecord[1].reviewTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.reviewer')}}4</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[4].reviewUserName" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.reviewTime")}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :clearable="false" disabled v-model="basic.fmeaAnalysisReviewRecord[4].reviewTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.reviewer')}}2</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[2].reviewUserName" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.reviewTime")}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :clearable="false" disabled v-model="basic.fmeaAnalysisReviewRecord[2].reviewTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </div> 
          </i-col>  
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.judgMan')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[5].reviewUserName" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.judgeTime")}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :clearable="false" disabled v-model="basic.fmeaAnalysisReviewRecord[5].reviewTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </div> 
          </i-col> 
        </Row>
      </div>
    </div>
    <div class="iqis-page-block" v-if="basic.isProcess==0||(basic.isProcess==1&&basic.approvalState==2)">
      <div class="iqis-page-block-title">
        {{$t('statistical.projectAnal')}}
      </div>
      <div class="iqis-page-block-body">
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label">{{$t('statistical.projectTable')}}</div>
          </div>
          <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
            <!-- <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('statistical.changed')}} <span
              style="color:#1b75ea">{{prodBatch.TableLength}}</span> {{$t('statistical.defects')}}</span> -->
            <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
              confirm
              :title="i18n.t('statistical.confirmDelete')"
              placement="bottom-end"
              @on-ok="deleteTableItem">
              <Button type="ghost" icon="trash-a" :disabled="noPermsDis">{{$t('statistical.delete')}}</Button>
            </Poptip>
          </div>
        </div>
        <div class="iqis-page-block-table">
          <Table  :no-data-text="i18n.t('noData')" class="location noHeight noBorder" ref="projectTable" border stripe
                  :loading="table.loading" v-drag-table-column="table.columns" :columns="table.columns"
                  :data="basic.fmeaAnalysisProjectList">
            <Button :disabled="noPermsDis" @click="addTableItem" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t('statistical.addProject')}}</Button>
          </Table>
        </div>
      </div>
    </div>
    <IqisAffix placement="bottom" :offset="0">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="approve" v-if="isApprover">{{$t('statistical.approvePass')}}</Button>
        <Button type="primary" @click="save('submit')" v-if="!noPermsDis&&!basic.auditState==1">{{$t('statistical.submit')}}</Button>
        <Button type="primary" @click="save('save')" v-if="!noPermsDis">{{$t('statistical.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('statistical.cancel')}}</Button>
      </div>
    </IqisAffix>
    <div class="page-end" style="padding-bottom: 65px"></div>

  </div>
</template>
<script>
import $ from "jquery"

export default {
  props:["params","tabKey"],
  data:function(){
    return{
      num1_10:/^(10|[1-9])$/,
      i18n:window.i18n,
      headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
      isApprover:false,
      analysisId:null,
      basic:{
        
        no:null,
        theme:null,
        analysisTime:new Date(),
        analysisUserId:this.$store.state.currentUserId,
        analysisUserName:null,
        version:null,
        analysisType:"process",
        scoringStandardId:null,
        productId:null,
        productNo:null,
        productName:null,
        remarks:null,
        isProcess:0,
        reviewProcessId:null,
        fmeaAnalysisProjectList:[],
        fmeaAnalysisReviewRecord:[],
        isHistory:0,
        tenantId: null,
        analysisId: null,
        approvalState: null,
        auditState: null,
      },
      table:{
        selected:[],
        loading:false,
        columns:[
          {
            type: 'selection',
            width: 40,
            align: 'center',
            minWidth: 40,
            maxWidth: 40
          },
          {
            title: i18n.t('statistical.item'),
            minWidth: 120,
            align: 'center',
            ellipsis: true,
            key: 'project',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].project,
                  disabled:this.noPermsDis,
                  type:"textarea",
                  autosize:{
                    maxRows: 4
                  },
                },
                on: {
                  'on-blur': (event) => {
                      this.basic.fmeaAnalysisProjectList[params.index].project =event.target.value;
                    }
                }
              })])
            }
          },
          {
            title: i18n.t("statistical.failureMode"),
            minWidth: 250,
            align: 'center',
            ellipsis: true,
            key: 'failureMode',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].failureMode,
                  disabled:this.noPermsDis,
                  type:"textarea",
                  autosize:{
                    maxRows: 4
                  },
                },
                on: {
                  'on-blur': (event) => {
                      this.basic.fmeaAnalysisProjectList[params.index].failureMode =event.target.value;
                    }
                }
              })])
            }
          },
          {
            title: i18n.t("statistical.failureEffect"),
            minWidth: 250,
            align: 'center',
            ellipsis: true,
            key: 'failureEffect',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].failureEffect,
                  disabled:this.noPermsDis,
                  type:"textarea",
                  autosize:{
                    maxRows: 4
                  },
                },
                on: {
                  'on-blur': (event) => {
                      this.basic.fmeaAnalysisProjectList[params.index].failureEffect =event.target.value;
                    }
                }
              })])
            }
          },
          {
            title: 'Sev',
            minWidth: 40,
            align: 'center',
            ellipsis: true,
            key: 'sev1',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].sev1,
                  disabled:this.noPermsDis,
                },
                on: {
                  'on-blur': (event) => {
                    if(this.verify(event.target,'Sev')){
                      this.basic.fmeaAnalysisProjectList[params.index].sev1 = event.target.value;
                      this.basic.fmeaAnalysisProjectList[params.index].rpn1 = Number(event.target.value)*Number(params.row.occ1)*Number(params.row.det1)
                    }
                  },
                }
              })])
            }
          },
          {
            title: i18n.t("statistical.failureCause"),
            minWidth: 250,
            align: 'center',
            ellipsis: true,
            key: 'failureCause',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].failureCause,
                  disabled:this.noPermsDis,
                  type:"textarea",
                  autosize:{
                    maxRows: 4
                  },
                },
                on: {
                  'on-blur': (event) => {
                      this.basic.fmeaAnalysisProjectList[params.index].failureCause =event.target.value;
                    }
                }
              })])
            }
          },
          {
            title: 'Occ',
            minWidth: 40,
            align: 'center',
            ellipsis: true,
            key: 'occ1',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].occ1,
                  disabled:this.noPermsDis
                },
                on: {
                  'on-blur': (event) => {
                    if(this.verify(event.target,'Occ')){
                      this.basic.fmeaAnalysisProjectList[params.index].occ1 =event.target.value;
                      this.basic.fmeaAnalysisProjectList[params.index].rpn1 = Number(params.row.sev1)*Number(event.target.value)*Number(params.row.det1)
                    }
                  },
                }
              })])
            }
          },
          {
            title: i18n.t('statistical.controlPrevention'),
            minWidth: 250,
            align: 'center',
            ellipsis: true,
            key: 'controlPrevention',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].controlPrevention,
                  disabled:this.noPermsDis,
                  type:"textarea",
                  autosize:{
                    maxRows: 4
                  },
                },
                on: {
                  'on-blur': (event) => {
                      this.basic.fmeaAnalysisProjectList[params.index].controlPrevention =event.target.value;
                    }
                }
              })])
            }
          },
          {
            title: i18n.t("statistical.controlDetection"),
            minWidth: 250,
            align: 'center',
            ellipsis: true,
            key: 'controlDetection',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].controlDetection,
                  disabled:this.noPermsDis,
                  type:"textarea",
                  autosize:{
                    maxRows: 4
                  },
                },
                on: {
                  'on-blur': (event) => {
                      this.basic.fmeaAnalysisProjectList[params.index].controlDetection =event.target.value;
                    }
                }
              })])
            }
          },
          {
            title: 'Det',
            minWidth: 40,
            align: 'center',
            ellipsis: true,
            key: 'det1',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].det1,
                  disabled:this.noPermsDis
                },
                on: {
                  'on-blur': (event) => {
                    if(this.verify(event.target,'Det')){
                      this.basic.fmeaAnalysisProjectList[params.index].det1 =event.target.value;
                      this.basic.fmeaAnalysisProjectList[params.index].rpn1 = Number(params.row.sev1)*Number(params.row.occ1)*Number(event.target.value)
                    }
                  },
                }
              })])
            }
          },
          {
            title: 'RPN',
            minWidth: 54,
            align: 'center',
            ellipsis: true,
            key: 'rpn1',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].rpn1,
                  disabled:true
                },
                on: {
                  'on-blur': (event) => {
                      this.basic.fmeaAnalysisProjectList[params.index].rpn1 =event.target.value;
                    }
                }
              })])
            }
          },
          {
            title: i18n.t('statistical.suggest'),
            minWidth: 250,
            align: 'center',
            ellipsis: true,
            key: 'suggest',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].suggest,
                  disabled:this.noPermsDis,
                  type:"textarea",
                  autosize:{
                    maxRows: 4
                  },
                },
                on: {
                  'on-blur': (event) => {
                      this.basic.fmeaAnalysisProjectList[params.index].suggest =event.target.value;
                    }
                }
              })])
            }
          },
          {
            title: i18n.t('statistical.accept'),
            minWidth: 250,
            align: 'center',
            ellipsis: true,
            key: 'accept',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].accept,
                  disabled:this.noPermsDis,
                  type:"textarea",
                  autosize:{
                    maxRows: 4
                  },
                },
                on: {
                  'on-blur': (event) => {
                      this.basic.fmeaAnalysisProjectList[params.index].accept =event.target.value;
                    }
                }
              })])
            }
          },
          {
            title: 'Sev',
            minWidth: 40,
            align: 'center',
            ellipsis: true,
            key: 'sev2',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].sev2,
                  disabled:this.noPermsDis
                },
                on: {
                  'on-blur': (event) => {
                    if(this.verify(event.target,'Sev')){
                      this.basic.fmeaAnalysisProjectList[params.index].sev2 =event.target.value;
                      this.basic.fmeaAnalysisProjectList[params.index].rpn2 = Number(event.target.value)*Number(params.row.occ2)*Number(params.row.det2)
                    }
                  },
                }
              })])
            }
          },
          {
            title: 'Occ',
            minWidth: 40,
            align: 'center',
            ellipsis: true,
            key: 'occ2',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].occ2,
                  disabled:this.noPermsDis
                },
                on: {
                  'on-blur': (event) => {
                    if(this.verify(event.target,'Occ')){
                      this.basic.fmeaAnalysisProjectList[params.index].occ2 =event.target.value;
                      this.basic.fmeaAnalysisProjectList[params.index].rpn2 = Number(params.row.sev2)*Number(event.target.value)*Number(params.row.det2)
                    }
                  },
                }
              })])
            }
          },
          {
            title: 'Det',
            minWidth: 40,
            align: 'center',
            ellipsis: true,
            key: 'det2',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].det2,
                  disabled:this.noPermsDis
                },
                on: {
                  'on-blur': (event) => {
                    if(this.verify(event.target,'Det')){
                      this.basic.fmeaAnalysisProjectList[params.index].det2 =event.target.value;
                      this.basic.fmeaAnalysisProjectList[params.index].rpn2 = Number(params.row.sev2)*Number(params.row.occ2)*Number(event.target.value)
                    }
                  },
                }
              })])
            }
          },
          {
            title: 'RPN',
            minWidth: 54,
            align: 'center',
            ellipsis: true,
            key: 'rpn2',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].rpn2,
                  disabled:true
                },
                on: {
                  'on-blur': (event) => {
                      this.basic.fmeaAnalysisProjectList[params.index].rpn2 =event.target.value;
                    }
                }
              })])
            }
          },
        ],
        rowTemplate:{
          project:null,
          failureMode:null,
          sev1:null,
          failureCause:null,
          occ1:null,
          controlPrevention:null,
          controlDetection:null,
          det1:null,
          rpn1:null,
          suggest:null,
          accept:null,
          sev2:null,
          occ2:null,
          det2:null,
          rpn2:null,
        }
      },
      loadingRemote:false,
      source:null,

      standardList:[],
      productList:[],
      userList:[],
      reviewProcessList:[],

      sort:{},

      permsCur:[
        "INSERT_FMEA_ANALYSIS_TABLE",
        "SELECT_FMEA_ANALYSIS_TABLE",
        "UPDATE_FMEA_ANALYSIS_TABLE",
        "DELETE_FMEA_ANALYSIS_TABLE",
        "AUDIT_FMEA_ANALYSIS_TABLE",
      ],
      permsBtn:{
        "DELETE_FMEA_ANALYSIS_TABLE":false,
        "SELECT_FMEA_ANALYSIS_TABLE":false,
        "UPDATE_FMEA_ANALYSIS_TABLE":false,
        "INSERT_FMEA_ANALYSIS_TABLE":false,
        "AUDIT_FMEA_ANALYSIS_TABLE":false,
      },
      noPermsDis:true,
    }
  },
  created(){
    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.refreshData()
  },
  methods:{
    refreshData(){
      let that = this;
      that.analysisId = that.$props.params && that.$props.params.analysisId;
      that.$http.all([
        that.$http.get("/tenant/user",{params:{limit:99999}}),
        that.$http.get("/fmea/scoring",{params:{limit:99999}}),
        that.$http.get("/basic/reviewprocess",{params:{limit:99999}}),
      ]).then((res)=>{
          that.userList = res[0].data
          that.standardList = res[1].data
          that.reviewProcessList = res[2].data
          if(!that.analysisId){

          }else{
            that.$http.get('/fmea/analysisTable/'+that.analysisId).then((res)=>{
              res.data.analysisTime = new Date(res.data.analysisTime)
              // res.data.launchProcess = res.data.reviewProcessId && 1 || 0

              // 给项目分析表排序
              let arr = res.data.fmeaAnalysisProjectList
              let newData = new Array()
              let sort = {}
              arr.forEach((value,index)=>{
                if(!sort[value.project]){
                  let res = arr.filter((val,i)=>{
                    return value.project == val.project
                  })
                  res[0]['first'] = true
                  newData.push.apply(newData,res);
                  sort[value.project]=res.length
                }
              })
              res.data.fmeaAnalysisProjectList = newData
              this.sort = sort
              this.basic = Object.assign({},this.basic,res.data)

              // 判断是否是审批人
              if(that.basic.auditState==1&&that.basic.reviewProcessId){
                this.basic.fmeaAnalysisReviewRecord.forEach((val,index,arr)=>{
                  this.basic.fmeaAnalysisReviewRecord[index].reviewTime = val.reviewTime?new Date(val.reviewTime):null
                })
                let index = this.basic.fmeaAnalysisReviewRecord.findIndex((item,index,arr)=>{
                  return item.reviewUserId == that.$store.state.currentUserId &&!item.reviewTime//若当前人是审批人之一并且尚未审批
                })
                let record = this.basic.fmeaAnalysisReviewRecord
                if(index!=-1){//若当前人是审批人之一并且尚未审批
                  if(!record[0].reviewTime){//若审核人未审核
                    if(index==0){//若是审核人
                      that.isApprover=true
                    }else{
                      that.isApprover=false
                    }
                  }else if(!record[5].reviewTime){//若判定人未判定
                    that.isApprover = true
                  }else{//若判定人已判定
                    if(index==5){//若是判定人
                      that.isApprover=true
                    }else{
                      that.isApprover=false
                    }
                  }
                }
              }
            })
          }
          if(((!that.analysisId&&that.permsBtn.INSERT_FMEA_ANALYSIS_TABLE)||(that.analysisId&&that.permsBtn.UPDATE_FMEA_ANALYSIS_TABLE))){
            that.noPermsDis=false;
          }else{
            that.noPermsDis=true;
          }
      })
    },
    remoteMethod: _.debounce(function(query) {
      let that = this;
      that.loadingRemote = true;
      if (query) {
        that.cancelQuest();
        that.$nextTick(()=>{
          that.$http.get('/basic/product/simple?page=1&limit=999999&useState=1&fieldName=no,name&query='+query,{
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
        this.source(i18n.t('statistical.TerminationRequest'));
      }
    },
    changeProductId(value){
      let that = this;
      if(value){
        that.$http.get('/basic/product/detail/'+value).then((res)=>{
          that.basic.productNo=res.data.no;
          that.basic.productName=res.data.name;
          that.basic.productSpec=res.data.spec;
        })
      }
    },
    changeLaunchProcess(){
      if(this.basic.isProcess==0){
        this.basic.reviewProcessId=null
      }
    },
    addTableItem(){
      let that = this;
      let obj = {...that.table.rowTemplate}
      that.basic.fmeaAnalysisProjectList.push(obj)
      let index = that.basic.fmeaAnalysisProjectList.length-1
      that.basic.fmeaAnalysisProjectList[index]['tableNumber'] = index
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((index-5)*43);
        $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');
      })
    },
    deleteTableItem(){
      let that = this;
      let ss = this.$refs.projectTable.getSelection();
      for (let i = 0; i < that.basic.fmeaAnalysisProjectList.length; i++) {
        for (let j = 0; j < ss.length; j++) {
          if (that.basic.fmeaAnalysisProjectList[i].tableNumber === ss[j].tableNumber) {
            that.basic.fmeaAnalysisProjectList.splice(i, 1)
          }
        }
      }
    },
    verify(target,title){
      let value = target.value
      if(value&&!this.num1_10.test(value)){
        this.$Notice.warning({title:'Sev'+i18n.t('Verification.Num1_10')})
        target.select()
        return false
      }else{
        return true
      }
    },
    save(type){
      let that = this;
      let data = {...that.basic}
      // 表单验证-基本信息
      let params = [
        {type:'Empty',title:i18n.t("statistical.analysisNo"),value:data.no},
        {type:'No',title:i18n.t("statistical.analysisNo"),value:data.no},
        {type:'Empty',title:i18n.t("statistical.analTheme"),value:data.theme},
        {type:'Name',title:i18n.t("statistical.analTheme"),value:data.theme},
        {type:'Empty',title:i18n.t("statistical.version"),value:data.version},
        {type:'Name',title:i18n.t("statistical.version"),value:data.version},
        {type:'Empty',title:i18n.t('statistical.scoringStandard'),value:data.scoringStandardId},
        {type:'Empty',title:i18n.t('statistical.productNo'),value:data.productId},
        {type:'Word600',title:i18n.t("statistical.remarks"),value:data.remarks},
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
      // 表单验证-项目分析
      // for(let i in data.fmeaAnalysisProjectList){
      //   let val = data.fmeaAnalysisProjectList[i]
      //   let params = [
      //     /* {type:'Num1_10',title:'第'+(Number(i)+Number(1))+'行-Sev',value:val.sev1},
      //     {type:'Num1_10',title:'第'+(Number(i)+Number(1))+'行-Occ',value:val.occ1},
      //     {type:'Num1_10',title:'第'+(Number(i)+Number(1))+'行-Det',value:val.det1},
      //     {type:'Num1_10',title:'第'+(Number(i)+Number(1))+'行-RPN',value:val.rpn1},
      //     {type:'Num1_10',title:'第'+(Number(i)+Number(1))+'行-Sev',value:val.sev2},
      //     {type:'Num1_10',title:'第'+(Number(i)+Number(1))+'行-Occ',value:val.occ2},
      //     {type:'Num1_10',title:'第'+(Number(i)+Number(1))+'行-Det',value:val.det2},
      //     {type:'Num1_10',title:'第'+(Number(i)+Number(1))+'行-RPN',value:val.rpn2}, */
      //     {type:'Num1_10',title:i18n.t("statistical.No")+(Number(i)+Number(1))+'-Sev',value:val.sev1},
      //     {type:'Num1_10',title:i18n.t("statistical.No")+(Number(i)+Number(1))+'-Occ',value:val.occ1},
      //     {type:'Num1_10',title:i18n.t("statistical.No")+(Number(i)+Number(1))+'-Det',value:val.det1},
      //     {type:'Num1_10',title:i18n.t("statistical.No")+(Number(i)+Number(1))+'-Sev',value:val.sev2},
      //     {type:'Num1_10',title:i18n.t("statistical.No")+(Number(i)+Number(1))+'-Occ',value:val.occ2},
      //     {type:'Num1_10',title:i18n.t("statistical.No")+(Number(i)+Number(1))+'-Det',value:val.det2},
      //   ]
      //   let state = true;
      //   for(let j in params){
      //     state = that.$iqis.utils.formValidate(params[j].type,params[j].title,params[j].value,(tips)=>{
      //       that.$Notice.warning({title:tips})//,duration: 0
      //     })
      //     if(!state){
      //       return;
      //       break;
      //     }
      //   }
      // }
      data.analysisTime=new Date(data.analysisTime).getTime()
      if(type=="save"){
        if(!that.analysisId){
          that.$http.post('/fmea/analysisTable',data,that.headers).then((res)=>{
            that.$Message.success(i18n.t('statistical.saveSuccess')); 
            that.closePage()
            that.$emit("open-tab","fmea-table-add-"+res.data.analysisId,i18n.t("statistical.ModifyAnalysisForm")+"-"+data.productName,"page-statistic-fmea-table-add",{analysisId:res.data.analysisId});
          })
        }else{
          that.$http.put('/fmea/analysisTable',data,that.headers).then((res)=>{
            that.$Message.success(i18n.t('statistical.saveSuccess')); 
            that.refreshData()
          })
        }
      }else{
        that.$http.post('/fmea/commit/analysisTable',data,that.headers).then((res)=>{
          that.$Message.success(i18n.t("statistical.submitSuccess")); 
          that.closePage()
        })
      }

    },
    approve(){//审批
      this.$http.put('/fmea/approval/analysisTable/'+this.analysisId).then((res)=>{
        this.$Message.success(i18n.t("statistical.approveHavePassed")); 
        this.isApprover=false
        this.refreshData()
      })
    },
    closePage(){
      this.$emit("close-tab",this.$props.tabKey);
    },
  }
} 
</script>
