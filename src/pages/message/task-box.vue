<template>
    <div class="iqis-task-box" v-clickoutside="handleClose" style='position:relative' >
        <!-- <div class="" ref="reference" @click="toggleVisible();refreshTaskList();"id='taskBOX' > -->
        <div class="" ref="reference" id='taskBOX' >
            <span class="mesaage-count" >
                <i class="header-icon remind-icon" >
                  <Badge :count='unreaderLength' >
                    <img src="../../../static/img/message.svg" alt="" width="20px" height='20px'>
                  </Badge>
                </i>
            </span>
        <transition name="transition-drop">
          <Drop
              v-show="visible"
              @click.native="handleTransferClick"
              :class="{ [prefixCls + '-transfer']: transfer }"
              class-name="ivu-transfer-no-max-height"
              :placement="placement"
              ref="drop"
              :data-transfer="transfer"
              v-transfer-dom>
              <div class="message-div" style='overflow:hidden'>
                  <Tabs value="todo" size="small" class='initTabs initTabPane'>
                      <TabPane :label="i18n.t('message.wt')" name="todo">
                          <div class="message-list-div">
                            <Scroll :on-reach-bottom="handleReachBottomReadedFlag0" height="317" :class='taskList0.length <= 6?"initScroll":""'>
                                <template>
                                    <a v-for="(item , index) in taskList0" @click="changeReadedFlag($event,item.messageAttachments[0].type,index)"  v-bind:data-id="item.messageId"  :key="item.messageId" class="list-group-item">
                                        <div class="iqis-message-time">
                                            {{$t("message.do")}} {{$store.state.locale=='zh_CN'?item.messageContent.split(" ")[1]:item.messageContent.split("  ")[1]}} <span class="active" style="color:#2d8cf0">{{$store.state.locale=='zh_CN'?item.messageContent.split(" ")[2]:item.messageContent.split("  ")[2]}}</span>
                                            <span class="iqis-message-time-span">{{(new Date(item.createAt)).Format('yyyy-MM-dd hh:mm')}}</span>
                                        </div>
                                    </a>
                                </template>
                            </Scroll>
                          </div>
                      </TabPane>
                      <TabPane :label="i18n.t('message.tm7')" name="done">
                          <div class="message-list-div">
                            <Scroll :on-reach-bottom="handleReachBottomReadedFlag1" height="317" :class='taskList1.length <= 6?"initScroll":""'>
                                <template>
                                    <a v-for="(item , index) in taskList1" @click="changeReadedFlag($event,item.messageAttachments[0].type,index)"  v-bind:data-id="item.messageId" :key="item.messageId" class="list-group-item" >
                                        <div class="iqis-message-time">
                                            {{$t("message.do")}} {{$store.state.locale=='zh_CN'?item.messageContent.split(" ")[1]:item.messageContent.split("  ")[1]}} <span>{{$store.state.locale=='zh_CN'?item.messageContent.split(" ")[2]:item.messageContent.split("  ")[2]}}</span>
                                            <span class="iqis-message-time-span">{{(new Date(item.createAt)).Format('yyyy-MM-dd hh:mm')}}</span>
                                        </div>
                                    </a>
                                </template>
                            </Scroll>
                          </div>
                      </TabPane>
                  </Tabs>
                  <div style="text-align: center;cursor: pointer;" @click="onMoreHistory">{{$t("message.sm")}}</div>
              </div>
          </Drop>
        </transition>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery';
    import Vue from 'vue';
    import clickoutside from 'iview/src/directives/clickoutside';
    import TransferDom from 'iview/src/directives/transfer-dom';
    import { oneOf } from 'iview/src/utils/assist';
    import Drop from 'iview/src/components/select/dropdown.vue';

    const prefixCls = 'ivu-color-picker';

    export default {
        components: { Drop },
        directives: { clickoutside, TransferDom },
        props: {
          open: {
            type: Boolean
          },
          transfer: {
              type: Boolean,
              default: false
          },
          placement: {
              validator (value) {
                  return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
              },
              default: 'bottom'
          }
        },
        data(){
          return {
            i18n:window.i18n,
            disableCloseUnderTransfer: false,  // transfer 模式下，点击Drop也会触发关闭
            visible: false,
            prefixCls: prefixCls,
            readedFlagClass:"iqis-message-read-span",
            unreadFlagClass:"iqis-message-unread-span",
            readedFlag: 'no',
            taskList0:[],
            taskList1:[],
            totalPages0:'',
            totalPages1:'',
            page0:1,
            page1:1,
            unreaderLength:0
          }
        },
        watch: {
            visible (val) {
                if (val) {
                    this.$refs.drop.update();
                } else {
                    this.$refs.drop.destroy();
                }
            },
            newTask:function(v,ov){
                if(v.length > 0){
                    this.refreshTaskList(1);
                    this.unreaderLength++
                }
            }
        },
        methods: {
          handleTransferClick () {
              if (this.transfer) this.disableCloseUnderTransfer = true;
          },
          handleClose () {
              if (this.disableCloseUnderTransfer) {
                    this.disableCloseUnderTransfer = false;
                    return false;
                }
              this.visible = false;
          },
          toggleVisible () {
              this.visible = !this.visible;
          },
          onExpand:function(index, messageId) {
              let msg = this.taskList[index];
              msg['_viewed'] = true;
              msg['_expanded'] = !msg['_expanded'];
              Vue.set(this.taskList, index, msg);
          },
          onEnter:function (argument) {
              this.$emit("open-tab","product-list-add","添加产品","page-product-add",null);
          },
          onMoreHistory:function (argument) {
            //   this.$emit("open-tab","product-list-add","添加产品","page-product-add",null);
            let pageInfo = {
                key: 'message-task-list',
                page:'page-message-task-list',
                title:i18n.t('message.taskList'),
                params:null
            }
            this.$emit("open-tab",pageInfo);
            this.toggleVisible();
          },
          refreshTaskList: function (page,readedFlag) {
              var mlist = $(".iqis-task-box .message-list-div");
              const that = this;
              this.$http.get("/messages",{params:{messageType:'TASK',page:1,limit:10,finishFlag:0}}).then(function(resp){
                that.totalPages0=resp.pagerInfo.totalPages;
                    that.taskList0 = resp.data;
                    that.unreaderLength = resp.pagerInfo.total
              });
              this.$http.get("/messages",{params:{messageType:'TASK',page:1,limit:10,finishFlag:1}}).then(function(resp){
                that.totalPages1=resp.pagerInfo.totalPages;
                that.taskList1 = resp.data;
              });
            this.$store.commit('NEWTASK',[]);
          },
          handleReachBottomReadedFlag0 () {
            let that = this;
            if(that.page0<that.totalPages0){
                return new Promise(resolve => {
                    that.page0++;
                    setTimeout(() => {
                        that.$http.get("/messages",{params:{messageType:'TASK',page:that.page0,limit:10,finishFlag:0}}).then(function(resp){
                            for (let i = 0; i < 10; i++) {
                                if(resp.data[i]){  
                                    that.taskList0.push(resp.data[i]);
                                }
                            }
                        })
                        resolve();
                    }, 1000);
                });
                
            }
            else{
                that.$Notice.warning({title:i18n.t('message.ad')});
                return;
            }
          },
          handleReachBottomReadedFlag1 () {
            let that = this;              
            if(that.page1<that.totalPages1){
                return new Promise(resolve => {

                    that.page1++;
                    
                    setTimeout(() => {
                        that.$http.get("/messages",{params:{messageType:'TASK',page:that.page1,limit:10,finishFlag:1}}).then(function(resp){
                            for (let i = 0; i < 10; i++) {
                                if(resp.data[i]){   
                                    that.taskList1.push(resp.data[i]);
                                }
                            }
                        })
                        resolve();
                    }, 1000);
                });
            }
            else{
                that.$Notice.warning({title:i18n.t('message.ad')});
                return;
            }
          },
          changeReadedFlag(event,type,index){
            let that = this;
            let messageId=event.currentTarget.getAttribute('data-id');
            that.$http.get('/message/'+messageId,{readedFlag:1}).then(function(resp){
                if(resp.data.messageAttachments){
                    if(resp.data.messageAttachments[0].id === ''){
                        that.$Notice.warning({
                            title:i18n.t('message.tp')
                        });
                        return;
                    }
                    let info = '';
                    info = JSON.parse(resp.data.messageAttachments[0].body).titleExtraInfo?JSON.parse(resp.data.messageAttachments[0].body).titleExtraInfo:'';
                    if(type=='CUSTOMER_REFUND'){//客退管理 详情页
                            let pageInfo = {
                                key: 'customer-service-customer-return-add'+resp.data.messageAttachments[0].id,
                                page:'page-customer-return-add',
                                title:i18n.t('message.mcr')+'-'+info,
                                params:{refundId:resp.data.messageAttachments[0].id}
                            }
                            that.$emit("open-tab",pageInfo);
                            that.toggleVisible();
                        
                    }
                    else if(type=='CUSTOMER_COMPLAINT'){//客诉管理 详情页
                        let pageInfo = {
                            key: 'customer-service-customer-complaint-add'+resp.data.messageAttachments[0].id,
                            page:'page-customer-complaint-add',
                            title:i18n.t('message.mc')+'-'+info,
                            params:{complaintId:resp.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }
                    else if(type=='FIRSTRECORD_REVIEW'){
                        let pageInfo = {
                            key: 'qc-pqc-first'+resp.data.messageAttachments[0].id,
                            page:'page-exam-pqc-first-add',
                            title:i18n.t('message.mf')+'-'+info,
                            params:{firstRecordId:resp.data.messageAttachments[0].id,type:1}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }
                    else if(type=='IQC_ABNORMAL'){//来料异常单 详情页
                        let pageInfo = {
                            key: 'qc-iqc-abnormal-add'+resp.data.messageAttachments[0].id,
                            page:'page-exam-iqc-abnormal-add',
                            title:i18n.t('message.mi')+'-'+info,
                            params:{abnormalId:resp.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }
                    else if(type=='PQC_ABNORMAL'){//过程异常单 详情页
                        let pageInfo = {
                            key: 'qc-pqc-abnormal-add'+resp.data.messageAttachments[0].id,
                            page:'page-exam-pqc-abnormal-add',
                            title:i18n.t('message.mp')+'-'+info,
                            params:{abnormalId:resp.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }
                    else if(type=='OQC_ABNORMAL'){//出货异常单 详情页
                        let pageInfo = {
                            key: 'qc-pqc-abnormal-add'+resp.data.messageAttachments[0].id,
                            page:'page-exam-oqc-abnormal-add',
                            title:i18n.t('message.ms')+'-'+info,
                            params:{abnormalId:resp.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }
                    else if(type=='IQC_REVIEW'){//来料检验评审 详情页
                        let pageInfo = {
                            key: 'exam-iqc-add'+resp.data.messageAttachments[0].id,
                            page:'page-exam-iqc-add',
                            title:i18n.t('message.mii')+'-'+info,
                            params:{iqcId:resp.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }
                    else if(type=='iqc-Handle'){//来料检验评审 详情页
                        let pageInfo = {
                            key: 'exam-iqc-add'+resp.data.messageAttachments[0].id,
                            page:'page-exam-iqc-add',
                            title:i18n.t('message.mii')+'-'+info,
                            params:{iqcId:resp.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }
                    else if(type=='PQC_REVIEW'){//过程检验评审 详情页
                        let pageInfo = {
                            key: 'exam-pqc-add'+resp.data.messageAttachments[0].id,
                            page:'page-exam-pqc-add',
                            title:i18n.t('message.mpi')+'-'+info,
                            params:{pqcId:resp.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }
                    else if(type=='OQC_REVIEW'){//出货检验评审 详情页
                        let pageInfo = {
                            key: 'exam-oqc-add-update'+resp.data.messageAttachments[0].id,
                            page:'page-exam-oqc-add-update',
                            title:i18n.t('message.msi')+'-'+info,
                            params:{oqcId:resp.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }else if(type === 'TRIAL_PROD'){
                        let pageInfo = {
                            key: 'qc-pqc-trialProd-'+resp.data.messageAttachments[0].id,
                            page:'page-exam-pqc-trialProd-add',
                            title:i18n.t('message.mt')+'-'+info,
                            params:{trialProdId:resp.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }else if (resp.data.messageAttachments[0].type === 'FMEA_ANALYSIS_TABLE') {
                        let pageInfo = {
                            key: 'fmea-table-add-' + resp.data.messageAttachments[0].id,
                            page: 'page-statistic-fmea-table-add',
                            title: i18n.t('message.ModifyAnalysisForm')+'-' + info,
                            params: {
                            analysisId: resp.data.messageAttachments[0].id
                            }
                        }
                        that.$emit("open-tab", pageInfo);
                        that.toggleVisible();
                    }else if (resp.data.messageAttachments[0].type === 'IQC_EXAMINE') {
                        let pageInfo = {
                            key: 'exam-iqc-update-' + resp.data.messageAttachments[0].id,
                            page: 'page-exam-iqc-add',
                            title: "修改来料检验"+'-' + info,
                            params: {
                            iqcId: resp.data.messageAttachments[0].id
                            }
                        }
                        that.$emit("open-tab", pageInfo);
                        that.toggleVisible();
                    }
                    
                }
                // if(type == 1){
                //     let val = that.taskList0.splice(index,1);
                //     that.taskList1.unshift(val[0]);
                // }
            })
          },
          
        },
        computed: {
          transition () {
              if (this.placement === 'bottom-start' || this.placement === 'bottom' || this.placement === 'bottom-end') {
                  return 'slide-up';
              } else {
                  return 'fade';
              }
          },
          newTask(){
              return this.$store.state.newTask;
          }
        },
        mounted(){
        let that = this;
        this.refreshTaskList(1);
            $('#taskBOX').hover(function(){
                // that.toggleVisible();
                that.visible = true;
                that.refreshTaskList()
            },function(){
                that.visible = false;
            })
        }
    };
</script>
<style >
.iqis-message-time .active{color:#2d8cf0}
  .iqis-task-box .mesaage-count{
    background-size: 32px 32px;
    /*cursor: pointer;*/
    background-repeat: no-repeat;
    width:35px;
    height:35px;
    /*width: 32px;
    height: 32px;*/
  }
  .iqis-task-box .ivu-tabs-bar {
      border-bottom: 0px solid #dddee1;
      margin-bottom: 0px;
  }
  .iqis-task-box .ivu-tabs-tab.ivu-tabs-tab-disabled{
    color: #262626;
  }
  .iqis-task-box .ivu-tabs-nav-container{
    line-height: 30px;
  }
  .iqis-task-box .message-div{
    /*position: absolute;*/
    display: block;
    width: 380px;
    height: 423px;
    background: #fff;
    font-size: 12px;
    color: #333;
    font-style: normal;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
    /* overflow: scroll; */
  }
  .iqis-task-box .message-list-div {
    /* overflow: auto; */
    /* height: 317px; */
  }
  .iqis-task-box .message-list-div .list-group-item{
    padding-bottom: 1px;
    position: relative;
    display: block;
    padding: 15px 15px;
    margin-bottom: -1px;
    background-color: #fff;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    color: #333;
  }
  .iqis-task-box .message-list-div .list-group-item {
    line-height: 18px;
  }
  .iqis-task-box .message-list-div .iqis-message-link{
      display: none;
  }
  .iqis-task-box .message-list-div .iqis-message-link{
    display: inline-block;
    margin: 0 6px;
    color: #003eff;
    padding: 0 6px;
    cursor: pointer;
    background: #eee;
  }

  .iqis-task-box .message-list-div .iqis-message-time{
    font-size: 12px;
    color: #8B8B8B;
  }
  .iqis-task-box .message-list-div .iqis-message-unread-span{
    color: #418FEE;
  }
  .iqis-task-box .message-list-div .iqis-message-time-span{
    float: right;
  }
  .iqis-task-box .message-list-div .iqis-message-text {
    max-height: 1.4em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #5C5C5C;
  }

  .iqis-task-box .message-list-div .iqis-message-expand {
       max-height: none;
       white-space: normal;
  }

  .iqis-task-box .ivu-radio-group-button .ivu-radio-wrapper{
    padding: 0 6px;
    border: 0px solid #dddee1;
  }
  .ivu-badge-count{
      width:17px!important;
      height:17px!important;
      min-width:14px!important;
      border-radius: 50%!important;
      padding:0!important;
      top:-10px!important;
      right:-2px!important;
      font-size:12px!important;
      line-height:16px!important;
      text-align:center!important;
      font-style: normal!important;

  }
</style>
