<template>
  <!-- <router-view></router-view> -->
  <div class="iqis-page">
    <div class="iqis-page-context" style="padding-top:5px;">
      <Row type="flex" :gutter="25">
        <!-- <i-col span="3" align="right">
          <Button type="primary" icon="arrow-left-c">消息列表</Button>
        </i-col>
        <i-col span="18"> -->
        <div style="width:800px;margin:0 auto;">
          <div class="clearfix">
            <div class="pull-left">
              <DatePicker type="daterange" v-model="demo" :placeholder="i18n.t('message.df')" style="width: 253px"></DatePicker>
              <Button type="primary">{{$t("message.search")}}</Button>
              <!-- <Button type="ghost">重置</Button> -->
            </div>
            <div class="pull-right">
              <Button :class="{tabActive:readedFlag==2}" @click="readedFlag=2;getData()" type="text" size="small">{{$t("message.at")}}</Button>
              <Button :class="{tabActive:readedFlag==0}" @click="readedFlag=0;getData();" type="text" size="small">{{$t("message.unread")}}</Button>
              <Button :class="{tabActive:readedFlag==1}" @click="readedFlag=1;getData();" type="text" size="small">{{$t("message.read")}}</Button>
              <Button @click="changeAllReadedFlag" type="text" size="small">{{$t("message.ma")}}</Button>
            </div>
          </div>
          <ul class="data-list">
            <li v-for="data in data" :id="data.messageId" :key="data.messageId" @click="changeReadedFlag($event);" class="clearfix list-item">
              <a class="pull-left" target="_blank"  :href="data.messageAttachments[0].type === 'SYSTEM'?'http://www.wuqc.cn/h-pd-4.html#_pp=114_785':'javascript:void(0)'"><span class="pull-left" v-bind:class="{readed:data.readedFlag==0}">【{{data.readedFlag==1?i18n.t("message.read"):i18n.t("message.unread")}}】</span>{{data.messageContent}}</a>
              <span class="pull-right">{{new Date(data.createAt).Format('yyyy-MM-dd hh:mm')}}</span>
            </li>
          </ul>
          <div style="padding: 20px 0 20px 0px;">
            <Page v-if="pager.need" :total="pager.total" :page-size="pager.limit" :current="pager.current"
                  :page-size-opts="[10,20,50,100]"
                  @on-change="pageChange" @on-page-size-change="pageSizeChange"
                  size="small" show-total show-elevator show-sizer></Page>
          </div>
        </div>
        <!-- </i-col> -->
      </Row>
    </div>
  </div>
</template>

<script>

export default {
  data:function() {
    let vm = this;
    return {
      i18n:window.i18n,
      demo:'',
      data:[],
      readedFlag:2,
      pager: {
        rows: 10,
        need: true,
        total: 100,
        limit: 10,
        current: 1
      }
    }
  },
  created(){
    this.getData();
  },
  methods:{
    getData(){
      let that = this;
      let params = {};
      params.page = that.pager.current;
      params.limit = that.pager.limit;
      params.messageType = 'TEXT';
      if(that.readedFlag<2){
        params.readedFlag = that.readedFlag;
      }
      that.$http.get('/messages',{params:params}).then(function(resp){
        that.data=resp.data;
        that.pager.total = resp.pagerInfo.total;
        let rowCount =  resp.data? resp.data.length:10;
        that.pager.rows = Math.max(rowCount,6);
      })
    },
    pageSizeChange(pageSize){
      this.pager.current = 1;
      this.pager.limit = pageSize;
      this.getData();
    },
    pageChange(page){
      this.pager.current = page;
      this.getData();
    },
    changeReadedFlag(event){
      let that = this;// //console.log(event.target);//console.log(event.currentTarget);
      let messageId=event.currentTarget.getAttribute('id');
      that.$http.get('/message/'+messageId,{readedFlag:1}).then(function(resp){
        that.getData();
        // this.$emit("open-tab","product-list-update-"+selectedRow[0].productId,"修改产品","page-product-add",{productId:selectedRow[0].productId});
        if(resp.data.messageAttachments){
          if(resp.data.messageAttachments[0].id === ''){
                        that.$Notice.warning({
                            title:i18n.t("message.tp")
                        });
                        return;
                    }
          if(resp.data.messageAttachments[0].type=='ASSOCIATE_CUSTOMER'){//关联客户 详情页
            that.$emit("open-tab",'page-exam-iqc-Supplier-list-'+resp.data.messageAttachments[0].id,i18n.t("message.sl"),'page-exam-iqc-Supplier-list',{customerId:resp.data.messageAttachments[0].id});
            that.toggleVisible();
          }
          else if(resp.data.messageAttachments[0].type=='ASSOCIATE_SUPPLIER'){//关联供应商 详情页
            that.$emit("open-tab",'qc-iqc-suppliers-list-'+resp.data.messageAttachments[0].id,i18n.t("message.as"),'page-exam-iqc-Supplier-update',{manufacturerId:resp.data.messageAttachments[0].id});
            that.toggleVisible();
          }
          else if(resp.data.messageAttachments[0].type=='REVIEW_SUPPLIER'){//对供应商评审 列表页激活
            that.$emit("open-tab",'customer-service-appraise-appraisal',i18n.t("message.cr"),'page-customer-appraise-appraisal',null);
          }
          else if(resp.data.messageAttachments[0].type=='SCORE_SUPPLIER'){//对供应商评分 列表页激活
            that.$emit("open-tab",'customer-service-appraise-grade',i18n.t("message.crg"),'page-customer-appraise-grade',null);
          }
          else if(resp.data.messageAttachments[0].type=='CUSTOMER_REFUND'){//客退管理 详情页
            that.$emit("open-tab",'customer-service-customer-return-add'+resp.data.messageAttachments[0].id,i18n.t("message.rs"),'page-customer-return-add',{refundId:resp.data.messageAttachments[0].id});
          }
          else if(resp.data.messageAttachments[0].type=='CUSTOMER_COMPLAINT'){//客诉管理 详情页
            that.$emit("open-tab",'page-customer-complaint-add'+resp.data.messageAttachments[0].id,i18n.t("message.rs"),'page-customer-complaint-add',{complaintId:resp.data.messageAttachments[0].id});
          }
          else if(resp.data.messageAttachments[0].type=='IQC_ABNORMAL'){//来料异常单 详情页
            that.$emit("open-tab",'qc-iqc-abnormal-add'+resp.data.messageAttachments[0].id,i18n.t("message.mi")+'-','page-exam-iqc-abnormal-add',{abnormalId:resp.data.messageAttachments[0].id});
            that.toggleVisible();

          }
          else if(resp.data.messageAttachments[0].type=='PQC_ABNORMAL'){//过程异常单 详情页
            that.$emit("open-tab",'qc-pqc-abnormal-add'+resp.data.messageAttachments[0].id,i18n.t("message.mp")+'-','page-exam-pqc-abnormal-add',{abnormalId:resp.data.messageAttachments[0].id});
            that.toggleVisible();
          }
          else if(resp.data.messageAttachments[0].type=='OQC_ABNORMAL'){//出货异常单 详情页
            that.$emit("open-tab",'qc-oqc-abnormal-add'+resp.data.messageAttachments[0].id,i18n.t("message.ms")+'-','page-exam-oqc-abnormal-add',{abnormalId:resp.data.messageAttachments[0].id});
            that.toggleVisible();
          }
          else if(resp.data.messageAttachments[0].type=='IQC_REVIEW'){//来料检验评审 详情页
            that.$emit("open-tab",'exam-iqc-add'+resp.data.messageAttachments[0].id,i18n.t("message.li"),'page-exam-iqc-add',{iqcId:resp.data.messageAttachments[0].id});
          }
          else if(resp.data.messageAttachments[0].type=='PQC_REVIEW'){//过程检验评审 详情页
            that.$emit("open-tab",'exam-pqc-add'+resp.data.messageAttachments[0].id,i18n.t("message.pi"),'page-exam-pqc-add',{pqcId:resp.data.messageAttachments[0].id});
          }
          else if(resp.data.messageAttachments[0].type=='OQC_REVIEW'){//出货检验评审 详情页
            that.$emit("open-tab",'exam-oqc-add-update'+resp.data.messageAttachments[0].id,i18n.t("message.ir"),'page-exam-oqc-add-update',{oqcId:resp.data.messageAttachments[0].id});
          }
        }

      })
    },
    changeAllReadedFlag(){
      let that=this;
      let allReadedFlag = [];
      for(let i=0;i<that.data.length;i++){
        allReadedFlag.push(that.$http.get('/message/'+that.data[i].messageId,{readedFlag:1}));
      }
      that.$http.all(allReadedFlag).then(function (resps) {
        that.getData();
      });
    }
  },
  watch:{
    readedFlag:function(newFlag){
      this.pageSizeChange();
      this.pageChange();
    },
  }
}
</script>

<style>
.clearfix:after{clear:both;display: block;visibility: hidden;height:0;content:'';}
.pull-left{float:left;}
.pull-right{float:right;}
.list-item{list-style:none;padding:25px 0;border-bottom:1px solid #e9e9e9;color:#5C5C5C;}
.list-item .readed{color:#418FEE;}
.list-item a{color:#5C5C5C;}
.ivu-btn:focus.ivu-btn-text:focus{box-shadow: none;}
/*button.ivu-btn.ivu-btn-text{position:relative;top:5px;}*/
.tabActive{color:#418FEE;}
</style>




