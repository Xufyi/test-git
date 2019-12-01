<template>
  <!-- <router-view></router-view> -->
  <div class="iqis-page">
    <div class="iqis-page-context" style="padding-top:5px;">
      <Row type="flex" :gutter="25">
        <!-- <i-col span="3" align="right">
              <Button type="primary" icon="arrow-left-c">任务列表</Button>
            </i-col>
          <i-col span="18"> -->
        <div style="width:800px;margin:0 auto;">
          <div class="clearfix">
            <div class="pull-left">
              <DatePicker type="daterange" v-model="demo" :placeholder="i18n.t('message.dateFilter')" style="width: 253px"></DatePicker>
              <Button type="primary">{{$t('message.search')}}</Button>
              <!-- <Button type="ghost">重置</Button> -->
            </div>
            <div class="pull-right">
              <Button :class="{tabActive:readedFlag==2}" @click="readedFlag=2;getData()" type="text" size="small">{{$t('message.alltasks')}}</Button>
              <Button :class="{tabActive:readedFlag==0}" @click="readedFlag=0;getData();" type="text" size="small">{{$t('message.processed')}}</Button>
              <Button :class="{tabActive:readedFlag==1}" @click="readedFlag=1;getData();" type="text" size="small">{{$t('message.completed')}}</Button>
            </div>
          </div>
          <ul class="data-list">
            <li v-for="data in data" :id="data.messageId" :key="data.messageId" @click="changeReadedFlag($event)" class="clearfix list-item">
              <a v-if="$store.state.locale=='zh_CN'" class="pull-left" href="javascript:void(0);">
                {{data.messageContent.split(" ")[0]}} {{data.messageContent.split(" ")[1]}}
                <span v-bind:class="{readed:data.readedFlag==0}">{{data.messageContent.split(" ")[2]}}</span> {{data.messageContent.split(" ")[3]}}
              </a>
              <a v-else class="pull-left" href="javascript:void(0);">
                {{data.messageContent.split(" ")[0]}} {{data.messageContent.split("  ")[1]}}
                <span v-bind:class="{readed:data.readedFlag==0}">{{data.messageContent.split("  ")[2]}}</span> {{data.messageContent.split("  ")[3]}}
              </a>
              <span class="pull-right">{{new Date(data.createAt).Format('yyyy-MM-dd hh:mm')}}</span>
            </li>
          </ul>
          <div style="padding: 20px 0 20px 0px;">
            <Page v-if="pager.need" :total="pager.total" :page-size="pager.limit" :current="pager.current" :page-size-opts="[10,20,50,100]" @on-change="pageChange" @on-page-size-change="pageSizeChange" size="small" show-total show-elevator show-sizer></Page>
          </div>
        </div>
        <!-- </i-col> -->
      </Row>
    </div>
  </div>
</template>

<script>
  export default {
    data: function() {
      let vm = this;
      return {
        i18n:window.i18n,
        demo: '',
        data: [],
        readedFlag: 2,
        pager: {
          rows: 10,
          need: true,
          total: 100,
          limit: 10,
          current: 1
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        let that = this;
        let params = {};
        params.page = that.pager.current;
        params.limit = that.pager.limit;
        params.messageType = 'TASK';
        if (that.readedFlag < 2) {
          params.readedFlag = that.readedFlag;
        }
        that.$http.get('/messages', {
          params: params
        }).then(function(resp) {
          that.data = resp.data;
          that.pager.total = resp.pagerInfo.total;
          let rowCount = resp.data ? resp.data.length : 10;
          that.pager.rows = Math.max(rowCount, 6);
        })
      },
      pageSizeChange(pageSize) {
        this.pager.current = 1;
        this.pager.limit = pageSize;
        this.getData();
      },
      pageChange(page) {
        this.pager.current = page;
        this.getData();
      },
      changeReadedFlag(event) {
        let that = this; // //console.log(event.target);//console.log(event.currentTarget);
        let messageId = event.currentTarget.getAttribute('id'); // //console.log(messageId);
        that.$http.get('/message/' + messageId, {
          readedFlag: 1
        }).then(function(resp) {
          // that.getData();
          if (resp.data.messageAttachments) {
            if(resp.data.messageAttachments[0].id === ''){
                        that.$Notice.warning({
                            title:i18n.t('message.tp')
                        });
                        return;
                    }
            let info = '';
            info = JSON.parse(resp.data.messageAttachments[0].body).titleExtraInfo ? JSON.parse(resp.data.messageAttachments[0].body).titleExtraInfo : '';

            if (resp.data.messageAttachments[0].type == 'CUSTOMER_REFUND') { //客退管理 详情页
              let pageInfo = {
                key: 'customer-service-customer-return-add' + resp.data.messageAttachments[0].id,
                page: 'page-customer-return-add',
                title: i18n.t('message.mcr')+'-' + info,
                params: {
                  refundId: resp.data.messageAttachments[0].id
                }
              }
              // that.$emit("open-tab", pageInfo);
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

              // 'qc-oqc-abnormal-add'+resp.data.messageAttachments[0].id,'出货异常单','page-exam-oqc-abnormal-add',{oqcId:resp.data.messageAttachments[0].id}
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

              that.toggleVisible();
  
            } else if (resp.data.messageAttachments[0].type == 'CUSTOMER_COMPLAINT') { //客诉管理 详情页
              let pageInfo = {
                key: 'customer-service-customer-complaint-add' + resp.data.messageAttachments[0].id,
                page: 'page-customer-complaint-add',
                title: i18n.t('message.mc')+'-' + info,
                params: {
                  complaintId: resp.data.messageAttachments[0].id
                }
              }
              // that.$emit("open-tab", pageInfo);
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type == 'IQC_ABNORMAL') { //来料异常单 详情页
              let pageInfo = {
                key: 'qc-iqc-abnormal-add' + resp.data.messageAttachments[0].id,
                page: 'page-exam-iqc-abnormal-add',
                title: i18n.t("message.mi")+'-' + info,
                params: {
                  abnormalId: resp.data.messageAttachments[0].id
                }
              }
              // that.$emit("open-tab", pageInfo);
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type == 'PQC_ABNORMAL') { //过程异常单 详情页
              let pageInfo = {
                key: 'qc-pqc-abnormal-add' + resp.data.messageAttachments[0].id,
                page: 'page-exam-pqc-abnormal-add',
                title: i18n.t("message.mp")+'-' + info,
                params: {
                  abnormalId: resp.data.messageAttachments[0].id
                }
              }
              // that.$emit("open-tab", pageInfo);
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type == 'FIRSTRECORD_REVIEW') { //过程异常单 详情页
              let pageInfo = {
                key: 'qc-pqc-first' + resp.data.messageAttachments[0].id,
                page: 'page-exam-pqc-first-add',
                title: i18n.t("message.me")+'-' + info,
                params: {
                  firstRecordId: resp.data.messageAttachments[0].id,
                  type:1
                }
              }
              // that.$emit("open-tab", pageInfo);
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

              that.toggleVisible();
            }else if (resp.data.messageAttachments[0].type == 'OQC_ABNORMAL') { //出货异常单 详情页
              let pageInfo = {
                key: 'qc-pqc-abnormal-add' + resp.data.messageAttachments[0].id,
                page: 'page-exam-oqc-abnormal-add',
                title: i18n.t("message.ms")+'-' + info,
                params: {
                  abnormalId: resp.data.messageAttachments[0].id
                }
              }
              // that.$emit("open-tab", pageInfo);
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type == 'IQC_REVIEW') { //来料检验评审 详情页
              let pageInfo = {
                key: 'exam-iqc-add' + resp.data.messageAttachments[0].id,
                page: 'page-exam-iqc-add',
                title: i18n.t("message.mii")+'-' + info,
                params: {
                  iqcId: resp.data.messageAttachments[0].id
                }
              }
              // that.$emit("open-tab", pageInfo);
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type == 'iqc-Handle') { //来料检验评审 详情页
              let pageInfo = {
                key: 'exam-iqc-add' + resp.data.messageAttachments[0].id,
                page: 'page-exam-iqc-add',
                title: i18n.t("message.mii")+'-' + info,
                params: {
                  iqcId: resp.data.messageAttachments[0].id
                }
              }
              // that.$emit("open-tab", pageInfo);
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type == 'PQC_REVIEW') { //过程检验评审 详情页
              let pageInfo = {
                key: 'exam-pqc-add' + resp.data.messageAttachments[0].id,
                page: 'page-exam-pqc-add',
                title: i18n.t("message.mpi")+'-' + info,
                params: {
                  pqcId: resp.data.messageAttachments[0].id
                }
              }
              // that.$emit("open-tab", pageInfo);
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);
              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type == 'OQC_REVIEW') { //出货检验评审 详情页
              let pageInfo = {
                key: 'exam-oqc-add-update-' + resp.data.messageAttachments[0].id,
                page: 'page-exam-oqc-add-update',
                title: i18n.t('message.msi')+'-' + info,
                params: {
                  oqcId: resp.data.messageAttachments[0].id
                }
              }
              // that.$emit("open-tab", pageInfo);
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);
              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type === 'TRIAL_PROD') {
              let pageInfo = {
                key: 'qc-pqc-trialProd-' + resp.data.messageAttachments[0].id,
                page: 'page-exam-pqc-trialProd-add',
                title: i18n.t("message.mt")+'-' + info,
                params: {
                  trialProdId: resp.data.messageAttachments[0].id
                }
              }
              // that.$emit("open-tab", pageInfo);
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);
              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type === 'FMEA_ANALYSIS_TABLE') {
              let pageInfo = {
                key: 'fmea-table-add-' + resp.data.messageAttachments[0].id,
                page: 'page-statistic-fmea-table-add',
                title: i18n.t("message.ModifyAnalysisForm")+'-' + info,
                params: {
                  analysisId: resp.data.messageAttachments[0].id
                }
              }
              // that.$emit("open-tab", pageInfo);
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);
              that.toggleVisible();
            }
  
  
            // if(type == 1){
            //     let val = that.taskList0.splice(index,1);
            //     that.taskList1.unshift(val[0]);
            // }
          }
        })
      },
    },
    watch: {
      readedFlag: function(newFlag) {
        this.pageSizeChange();
        this.pageChange();
      }
    }
  }
</script>

<style>
  .clearfix:after {
    clear: both;
    display: block;
    visibility: hidden;
    height: 0;
    content: '';
  }
  
  .pull-left {
    float: left;
  }
  
  .pull-right {
    float: right;
  }
  
  .list-item {
    list-style: none;
    padding: 25px 0;
    border-bottom: 1px solid #e9e9e9;
    color: #5C5C5C;
  }
  
  .list-item .readed {
    color: #418FEE;
  }
  
  .list-item a {
    color: #5C5C5C;
  }
  
  .ivu-btn:focus.ivu-btn-text:focus {
    box-shadow: none;
  }
  .tabActive {
    color: #418FEE;
  }
</style>




