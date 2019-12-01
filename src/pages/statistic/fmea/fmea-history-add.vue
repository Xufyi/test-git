<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        基本信息
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
              <i-input :disabled="noPermsDis" v-model="basic.analysisUserName" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.version")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="noPermsDis" v-model="basic.version" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.analysisType")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-if="basic.analysisType='process'" :disabled="noPermsDis" :value="i18n.t('statistical.processProject')" style="width: 100%;"></i-input>
              <i-input v-else-if="basic.analysisType='design'" :disabled="noPermsDis" :value="i18n.t('statistical.designProject')" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.scoringStandard")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="noPermsDis" v-model="basic.scoringStandardName" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.launchProcess")}}</div>
            <div class="iqis-page-block-ctrl">
              <RadioGroup v-model="basic.launchProcess">
                <Radio :disabled="noPermsDis" :label='0'>{{$t('statistical.no2')}}</Radio>
                <Radio :disabled="noPermsDis" :label='1'>{{$t("statistical.yes")}}</Radio>
              </RadioGroup>    
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.productNo")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="noPermsDis" v-model="basic.productNo" style="width: 100%;"></i-input>
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
          <i-col span="6" v-if="basic.launchProcess==1">
            <div class="iqis-page-block-label">{{$t("statistical.approvalProcess")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.reviewProcessName" style="width: 100%;"></i-input>             
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">备注</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="noPermsDis" type="textarea" v-model="basic.remarks" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
        </Row>
        
      </div>
    </div>
    <div class="iqis-page-block" v-if="basic.approvalState==1">
      <div class="iqis-page-block-title">
        {{$t("statistical.approvalRecord")}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.auditor")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[0].reviewUserName" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.auditTime")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[0].reviewTime" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.reviewer")}}3</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[3].reviewUserName" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.reviewTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[3].reviewTime" style="width: 100%;"></i-input>
            </div> 
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.reviewer")}}1</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[1].reviewUserName" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.reviewTime")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[1].reviewTime" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.reviewer")}}4</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[4].reviewUserName" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.reviewTime")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[4].reviewTime" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.reviewer")}}2</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[2].reviewUserName" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.reviewTime")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[2].reviewTime" style="width: 100%;"></i-input>
            </div> 
          </i-col>  
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("statistical.judgMan")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[5].reviewUserName" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
          <i-col span="6">
            <div class="iqis-page-block-label">{{i18n.t("statistical.judgeTime")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.fmeaAnalysisReviewRecord[5].reviewTime" style="width: 100%;"></i-input>
            </div> 
          </i-col> 
        </Row>
      </div>
    </div>
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t("statistical.projectAnal")}}
      </div>
      <div class="iqis-page-block-body">
        <div class="iqis-page-block-table">
          <Table  :no-data-text="i18n.t('noData')" class="location noHeight noBorder" ref="projectTable" border stripe
                  :loading="table.loading" v-drag-table-column="table.columns" :columns="table.columns"
                  :data="basic.fmeaAnalysisProjectList">
          </Table>
        </div>
      </div>
    </div>
    <IqisAffix placement="bottom" :offset="0">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="ghost" @click="closePage">{{$t("statistical.cancel")}}</Button>
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
      i18n:window.i18n,
      headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
      noPermsDis:true,
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
        launchProcess:0,
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
            title: i18n.t("statistical.item"),
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
                  disabled:this.noPermsDis
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
            minWidth: 120,
            align: 'center',
            ellipsis: true,
            key: 'failureMode',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].failureMode,
                  disabled:this.noPermsDis
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
            minWidth: 120,
            align: 'center',
            ellipsis: true,
            key: 'failureEffect',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].failureEffect,
                  disabled:this.noPermsDis
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
                      this.basic.fmeaAnalysisProjectList[params.index].sev1 =event.target.value;
                    }
                }
              })])
            }
          },
          {
            title: i18n.t("statistical.failureCause"),
            minWidth: 120,
            align: 'center',
            ellipsis: true,
            key: 'failureCause',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].failureCause,
                  disabled:this.noPermsDis
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
                      this.basic.fmeaAnalysisProjectList[params.index].occ1 =event.target.value;
                    }
                }
              })])
            }
          },
          {
            title: i18n.t("statistical.controlPrevention"),
            minWidth: 120,
            align: 'center',
            ellipsis: true,
            key: 'controlPrevention',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].controlPrevention,
                  disabled:this.noPermsDis
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
            minWidth: 120,
            align: 'center',
            ellipsis: true,
            key: 'controlDetection',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].controlDetection,
                  disabled:this.noPermsDis
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
                      this.basic.fmeaAnalysisProjectList[params.index].det1 =event.target.value;
                    }
                }
              })])
            }
          },
          {
            title: 'RPN',
            minWidth: 40,
            align: 'center',
            ellipsis: true,
            key: 'rpn1',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].rpn1,
                  disabled:this.noPermsDis
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
            title: i18n.t("statistical.suggest"),
            minWidth: 120,
            align: 'center',
            ellipsis: true,
            key: 'suggest',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].suggest,
                  disabled:this.noPermsDis
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
            title: i18n.t("statistical.accept"),
            minWidth: 120,
            align: 'center',
            ellipsis: true,
            key: 'accept',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].accept,
                  disabled:this.noPermsDis
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
                      this.basic.fmeaAnalysisProjectList[params.index].sev2 =event.target.value;
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
                      this.basic.fmeaAnalysisProjectList[params.index].occ2 =event.target.value;
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
                      this.basic.fmeaAnalysisProjectList[params.index].det2 =event.target.value;
                    }
                }
              })])
            }
          },
          {
            title: 'RPN',
            minWidth: 40,
            align: 'center',
            ellipsis: true,
            key: 'rpn2',
            render: (h, params) => {
              var me = this
              return h('div', [h('Input', {
                props: {
                  type: 'text',
                  value: me.basic.fmeaAnalysisProjectList[params.index].rpn2,
                  disabled:this.noPermsDis
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

      sort:{}
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
      that.$http.get('/fmea/history/analysisTable/'+that.analysisId).then((res)=>{
        res.data.analysisTime = new Date(res.data.analysisTime)
        res.data.launchProcess = res.data.reviewProcessId && 1 || 0

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
        if(that.basic.approvalState==1){
          that.isApprover = this.basic.fmeaAnalysisReviewRecord.some((item,index,arr)=>{
            return item.reviewUserId == that.$store.state.currentUserId
          })
        }
      })
    },
    closePage(){
      this.$emit("close-tab",this.$props.tabKey);
    },
  }
}
</script>
