<template>
    <div class="iqis-message-box" v-clickoutside="handleClose">
        <!-- <div class="" ref="reference" @click="toggleVisible();refreshMessageList();" id='messagesBOX'> -->
        <div class="" ref="reference"  id='messagesBOX'>
            <span class="mesaage-count" >
                <i class="header-icon remind-icon">
                  <Badge :count="unMessagesLength" >
                    <!-- <Icon type="ios-bell"></Icon> -->
                    <img src="../../../static/img/task.svg" alt="" width="20px" height='20px'>                 
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
                  <Tabs value="unread" size="small" class='initTabs initTabPane'>
                      <TabPane :label="i18n.t('message.unread')" name="unread" >
                          <div class="message-list-div" style='position:relative'>
                            <Scroll :on-reach-bottom="handleReachBottomReadedFlag0" height="317" :class='messageList0.length <= 5?"initScroll":""'>
                                <template>
                                    <span style='cursor:pointer'  v-for="(item , index) in messageList0" @click="reading(index,item.messageId,1)" target="_blank"  :href="item.messageAttachments[0].type === 'SYSTEM'?'http://www.wuqc.cn/h-pd-4.html#_pp=114_785':'javascript:void(0)'"  v-bind:data-id="item.messageId" :key="item.messageId" class="list-group-item"  >
                                        <div class="iqis-message-time">
                                            <span :class="item.readedFlag ? readedFlagClass : unreadFlagClass">{{item.readedFlag ? i18n.t('message.readx') : i18n.t('message.unreadx')}}</span>
                                            {{(new Date(item.createAt)).Format('yyyy-MM-dd hh:mm')}}
                                            <span class="iqis-message-view-span" :data-id='item.messageId' @click.stop="changeReadedFlag($event)" >{{$t('message.vd')}}</span>
                                        </div>
                                        <div class="iqis-message-text" v-bind:class="{'iqis-message-expand': item._expanded}" v-html="warpMessageContext(item.messageContent)"></div>
                                    </span>
                                </template>
                            </Scroll>
                            <span style='position:absolute;top:-52px;right:15px;color:#418FEE;cursor:pointer' @click='readAll'> ✔{{$t("message.am")}}</span>
                          </div>
                      </TabPane>
                      <TabPane :label="i18n.t('message.read')" name="read">
                          <div class="message-list-div">
                            <Scroll :on-reach-bottom="handleReachBottomReadedFlag1" height="317" :class='messageList1.length <= 5?"initScroll":""'>
                                <template>
                                    <span style='cursor:pointer'  v-for="(item , index) in messageList1" @click="reading(index,item.messageId,0)" target="_blank"  :href="item.messageAttachments[0].type === 'SYSTEM'?'http://www.wuqc.cn/h-pd-4.html#_pp=114_785':'javascript:void(0)'"  v-bind:data-id="item.messageId" :key="item.messageId" class="list-group-item" v-if="item.readedFlag == 1">
                                        <div class="iqis-message-time">
                                            <span class="iqis-message-read-span">{{$t('message.readx')}}</span>{{(new Date(item.createAt)).Format('yyyy-MM-dd hh:mm')}}
                                            <span class="iqis-message-view-span" :data-id='item.messageId' @click.stop="changeReadedFlag($event)" >{{$t("message.vd")}}</span>
                                        </div>
                                        <div class="iqis-message-text" v-bind:class="{'iqis-message-expand': item._expanded}" v-html="warpMessageContext(item.messageContent)"></div>
                                    </span>
                                </template>
                            </Scroll>
                          </div>
                      </TabPane>
                  </Tabs>
                  <div style="text-align: center;cursor: pointer;" @click="onMoreHistory">{{$t("message.co")}}</div>
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
    import Emitter from 'iview/src/mixins/emitter';
    import Drop from 'iview/src/components/select/dropdown.vue';

    const prefixCls = 'ivu-color-picker';
    export default {
        components: { Drop },
        directives: { clickoutside, TransferDom },
        mixins: [ Emitter ],
        props: {
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
            messageList0:[],
            messageList1:[],
            totalPages0:'',
            totalPages1:'',
            page0:1,
            page1:1,
            unMessagesLength:0,
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
            newText:function(v,ov){
                if(v.length > 0){
                    this.refreshMessageList(1);
                    this.unMessagesLength++
                }
            }
        },
        methods: {
        click1(){
        },
        readAll(){
            this.$http.put('/unreadMessage').then((res)=>{
                    this.refreshMessageList();
            })
        },
        reading(index,id,type){
            let that = this;
            this.$http.get('/message/'+id,).then((res)=>{
                if(res.data.messageAttachments[0].type === "ASSOCIATE_SUPPLIER"){
                    var s=  {
                        title: i18n.t("message.cl"),
                        tabTitle: i18n.t("message.cl"),
                        key: "customer-service-list",
                        page: "page-customer-list",
                        params:{}
                    }
                    that.$emit("open-tab",s);
                    that.toggleVisible();
                }
                    let info = '';
                    info = JSON.parse(res.data.messageAttachments[0].body).titleExtraInfo?JSON.parse(res.data.messageAttachments[0].body).titleExtraInfo:'';
                    if(res.data.messageAttachments[0].type=='CUSTOMER_COMPLAINT'){//客诉管理 详情页
                        let pageInfo = {
                            key: 'customer-service-customer-complaint-add'+res.data.messageAttachments[0].id,
                            page:'page-customer-complaint-add',
                            title:i18n.t("message.mc")+'-'+info,
                            params:{complaintId:res.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }
                    else if(res.data.messageAttachments[0].type=='IQC_ABNORMAL'){//来料异常单 详情页
                        let pageInfo = {
                            key: 'qc-iqc-abnormal-add'+res.data.messageAttachments[0].id,
                            page:'page-exam-iqc-abnormal-add',
                            title: i18n.t("message.mi")+'-'+info,
                            params:{abnormalId:res.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }
                    else if(res.data.messageAttachments[0].type=='PQC_ABNORMAL'){//过程异常单 详情页
                        let pageInfo = {
                            key: 'qc-pqc-abnormal-add'+res.data.messageAttachments[0].id,
                            page:'page-exam-pqc-abnormal-add',
                            title: i18n.t("message.mp")+'-'+info,
                            params:{abnormalId:res.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }
                    else if(res.data.messageAttachments[0].type=='OQC_ABNORMAL'){//出货异常单 详情页
                        let pageInfo = {
                            key: 'qc-pqc-abnormal-add'+res.data.messageAttachments[0].id,
                            page:'page-exam-oqc-abnormal-add',
                            title: i18n.t("message.ms")+'-'+info,
                            params:{abnormalId:res.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }
                    else if(res.data.messageAttachments[0].type=='IQC_EXAMINE'){//出货来料检验 详情页
                        let pageInfo = {
                            key: 'exam-iqc-update-'+res.data.messageAttachments[0].id,
                            page:'page-exam-iqc-add',
                            title: "修改来料检验"+'-'+info,
                            params:{iqcId:res.data.messageAttachments[0].id}
                        }
                        that.$emit("open-tab",pageInfo);
                        that.toggleVisible();
                    }


                if(type == 1){
                    that.messageList0[index].readedFlag = res.data.readedFlag;
                    setTimeout(function(){
                        let item = that.messageList0.splice(index,1);
                        that.refreshMessageList();
                        if(that.unMessagesLength >=1){
                            that.unMessagesLength--;
                        }
                    },2000)
                }
                
            })
        },
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
              let msg = this.messageList[index];
              msg['_viewed'] = true;
              msg['_expanded'] = !msg['_expanded'];
              Vue.set(this.messageList, index, msg);
          },
          onEnter:function (argument) {
              this.$emit("open-tab","product-list-add","添加产品","page-product-add",null);
          },
          onMoreHistory:function (argument) {
            // this.$emit("open-tab","product-list-add","添加产品","page-product-add",null);
            let pageInfo = {
                key: 'message-message-list',
                page:'page-message-message-list',
                title:i18n.t('message.ml'),
                params:null
            }
            this.$emit("open-tab",pageInfo);
            this.toggleVisible();
          },
          refreshMessageList: function (page) {
              var mlist = $(".iqis-message-box .message-list-div");
              const that = this;
              this.$http.get("/messages",{params:{messageType:'TEXT',page:1,limit:10,readedFlag:0}}).then(function(resp){
                  if(resp.data){
                    that.messageList0 = resp.data;
                    that.unMessagesLength = resp.pagerInfo.total
                    that.$store.commit('NEWTEXT',[]);
                  }
              });
              this.$http.get("/messages",{params:{messageType:'TEXT',page:1,limit:10,readedFlag:1}}).then(function(resp){
                that.totalPages1=resp.pagerInfo.totalPages;
                that.messageList1 = resp.data;
              })

          },
          handleReachBottomReadedFlag0 () {
            let that = this;
            if(that.page0<that.totalPages0){
                
                return new Promise(resolve => {

                    that.page0++;
                    setTimeout(() => {
                        that.$http.get("/messages",{params:{messageType:'TASK',page:that.page0,limit:10,readedFlag:0}}).then(function(resp){
                            for (let i = 0; i < 10; i++) {
                                if(resp.data[i]){  
                                    that.messageList0.push(resp.data[i]);
                                }
                            }
                        })
                        resolve();
                        
                    }, 1000);
                });
                
            }
            else{
                that.$Notice.warning({title:i18n.t("message.ad")});
                return;
            }
          },
          handleReachBottomReadedFlag1 () {
            let that = this;              
            if(that.page1<that.totalPages1){
                return new Promise(resolve => {

                    that.page1++;
                    
                    setTimeout(() => {
                        that.$http.get("/messages",{params:{messageType:'TASK',page:that.page1,limit:10,readedFlag:1}}).then(function(resp){
                            for (let i = 0; i < 10; i++) {
                                if(resp.data[i]){   
                                    that.messageList1.push(resp.data[i]);
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
          warpMessageContext : function (content) {
              var rel = content.match(/\[LINK .*?\]/ig);

              var nContent = content;
              $(rel).each(function (index,item) {
                  var strs = item.replace("[","").replace("]","").split(" ");

                  if(strs.length == 3){
                      var nstr = "<span class='iqis-message-link' data-type='"+strs[1]+"' data-id='"+strs[2]+"'></span>";
                      nContent = nContent.replace(item,nstr);
                  }
              });
              return nContent;
          },

          warpMessageAttachment : function ($el) {
              $el.find(".iqis-message-link").each(function(index,el){
                  var type = $(el).data("type");
                  var id = $(el).data("id");
                  if(type == "AbnormalListDto-Handle"){

                  }
              });
          },
          changeReadedFlag(event){
            let that = this;
            let messageId=event.currentTarget.getAttribute('data-id');
            that.$http.get('/message/'+messageId,{readedFlag:1}).then(function(resp){
            let info = '';
            if(resp.data.messageAttachments[0].id === ''){
                        that.$Notice.warning({
                            title:i18n.t('message.tp')
                        });
                        return;
                    }
            if(resp.data.messageAttachments[0].body){
                if(resp.data.messageAttachments[0].body.titleExtraInfo){
                    info = JSON.parse(resp.data.messageAttachments[0].body).titleExtraInfo ? JSON.parse(resp.data.messageAttachments[0].body).titleExtraInfo : '';
                }
            }
            if (resp.data.messageAttachments[0].type == 'CUSTOMER_REFUND') { //客退管理 详情页
              let pageInfo = {
                key: 'customer-service-customer-return-add' + resp.data.messageAttachments[0].id,
                page: 'page-customer-return-add',
                title: i18n.t('message.mcr')+'-' + info,
                params: {
                  refundId: resp.data.messageAttachments[0].id
                }
              }
              that.$emit("open-tab", pageInfo);
            //   that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);
              // 'qc-oqc-abnormal-add'+resp.data.messageAttachments[0].id,'出货异常单','page-exam-oqc-abnormal-add',{oqcId:resp.data.messageAttachments[0].id}
              that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);
              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type == 'CUSTOMER_COMPLAINT') { //客诉管理 详情页
              let pageInfo = {
                key: 'customer-service-customer-complaint-add' + resp.data.messageAttachments[0].id,
                page: 'page-customer-complaint-add',
                title: i18n.t("message.mc")+'-' + info,
                params: {
                  complaintId: resp.data.messageAttachments[0].id
                }
              }
              that.$emit("open-tab", pageInfo);
            //   that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type == 'IQC_ABNORMAL') { //来料异常单 详情页
              let pageInfo = {
                key: 'qc-iqc-abnormal-add' + resp.data.messageAttachments[0].id,
                page: 'page-exam-iqc-abnormal-add',
                title:  i18n.t("message.mi")+'-' + info,
                params: {
                  abnormalId: resp.data.messageAttachments[0].id
                }
              }
              that.$emit("open-tab", pageInfo);
            //   that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type == 'PQC_ABNORMAL') { //过程异常单 详情页
              let pageInfo = {
                key: 'qc-pqc-abnormal-add' + resp.data.messageAttachments[0].id,
                page: 'page-exam-pqc-abnormal-add',
                title: i18n.t('message.mp')+'-' + info,
                params: {
                  abnormalId: resp.data.messageAttachments[0].id
                }
              }
              that.$emit("open-tab", pageInfo);
            //   that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type == 'OQC_ABNORMAL') { //出货异常单 详情页
              let pageInfo = {
                key: 'qc-pqc-abnormal-add' + resp.data.messageAttachments[0].id,
                page: 'page-exam-oqc-abnormal-add',
                title:  i18n.t("message.ms")+'-' + info,
                params: {
                  abnormalId: resp.data.messageAttachments[0].id
                }
              }
              that.$emit("open-tab", pageInfo);
            //   that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

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
              that.$emit("open-tab", pageInfo);
            //   that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

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
              that.$emit("open-tab", pageInfo);
            //   that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);

              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type == 'PQC_REVIEW') { //过程检验评审 详情页
              let pageInfo = {
                key: 'exam-pqc-add' + resp.data.messageAttachments[0].id,
                page: 'page-exam-pqc-add',
                title: i18n.t('message.mpi')+'-' + info,
                params: {
                  pqcId: resp.data.messageAttachments[0].id
                }
              }
              that.$emit("open-tab", pageInfo);
            //   that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);
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
              that.$emit("open-tab", pageInfo);
            //   that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);
              that.toggleVisible();
            } else if (resp.data.messageAttachments[0].type === 'TRIAL_PROD') {
              let pageInfo = {
                key: 'page-exam-pqc-trialProd-add' + resp.data.messageAttachments[0].id,
                page: 'page-exam-pqc-trialProd-add',
                title: i18n.t("message.mt")+'-' + info,
                params: {
                  trialProdId: resp.data.messageAttachments[0].id
                }
              }
              that.$emit("open-tab", pageInfo);
            //   that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);
              that.toggleVisible();
            }else if (resp.data.messageAttachments[0].type === 'REVIEW_SUPPLIER') {
              let pageInfo = {
                key: 'customer-service-appraise-appraisal',
                page: 'page-customer-appraise-appraisal',
                title: i18n.t("message.cr") + info,
                params: {
                }
              }
              that.$emit("open-tab", pageInfo);
            //   that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);
              that.toggleVisible();
            }else if (resp.data.messageAttachments[0].type === 'PQC_DIRECT_RATE') {
              let pageInfo = {
                key: 'qc-pqc-bad-ratio'+ resp.data.messageAttachments[0].id,
                page: 'page-exam-pqc-bad-update',
                title: "修改过程直通率" + info,
                params: {
                  directRateId: resp.data.messageAttachments[0].id
                }
              }
              that.$emit("open-tab", pageInfo);
            //   that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);
              that.toggleVisible();
            }else if (resp.data.messageAttachments[0].type === 'IQC_EXAMINE') {
              let pageInfo = {
                key: 'exam-iqc-update-'+ resp.data.messageAttachments[0].id,
                page: 'page-exam-iqc-add',
                title: "修改来料检验"+'-' + info,
                params: {
                  iqcId: resp.data.messageAttachments[0].id
                }
              }
              that.$emit("open-tab", pageInfo);
            //   that.$emit("open-tab",pageInfo.key,pageInfo.title,pageInfo.page,pageInfo.params);
              that.toggleVisible();
            }


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
          newText(){
              return this.$store.state.newText;
          }
        },
        mounted(){
            let that = this;
                // that.visible = true;
          this.refreshMessageList(1);
          $('#messagesBOX').hover(function(){
                that.visible = true;
                that.refreshMessageList(1);
                },function(){
                    that.visible = false;
                })
        }
    };
</script>
<style >
  .iqis-message-box .mesaage-count{
    /*display: inline-block;*/
    /*vertical-align: middle;*/
    /*background-image: url('./cancel.png');*/
    background-size: 32px 32px;
    /*cursor: pointer;*/
    background-repeat: no-repeat;
    /*width: 32px;
    height: 32px;*/
  }
  .iqis-message-box .ivu-tabs-bar {
      border-bottom: 0px solid #dddee1;
      margin-bottom: 0px;
  }
  .iqis-message-box .ivu-tabs-tab.ivu-tabs-tab-disabled{
    color: #262626;
  }
  .iqis-message-box .ivu-tabs-nav-container{
    line-height: 30px;
  }
  .iqis-message-box .message-div{
    /*position: absolute;*/
    display: block;
    width: 300px;
    height: 423px;
    background: #fff;
    font-size: 12px;
    color: #333;
    font-style: normal;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
  }
  .iqis-message-box .message-list-div {
    /* overflow: auto; */
    height: 317px;
  }
  .iqis-message-box .message-more-div {
    text-align: center;cursor: pointer;
  }
  .iqis-message-box .message-list-div .list-group-item{
    padding-bottom: 1px;
    position: relative;
    display: block;
    padding: 10px 15px;
    margin-bottom: -1px;
    background-color: #fff;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    color: #333;
  }
  .iqis-message-box .message-list-div .list-group-item {
    line-height: 18px;
  }
  .iqis-message-box .message-list-div .iqis-message-link{
      display: none;
  }
  .iqis-message-box .message-list-div .iqis-message-link{
    display: inline-block;
    margin: 0 6px;
    color: #003eff;
    padding: 0 6px;
    cursor: pointer;
    background: #eee;
  }

  .iqis-message-box .message-list-div .iqis-message-time{
    font-size: 12px;
    color: #8B8B8B;
  }
  .iqis-message-box .message-list-div .iqis-message-unread-span{
    color: #418FEE;
  }
  .iqis-message-box .message-list-div .iqis-message-view-span{
    color: #509DFC;
    float: right;
  }
  .iqis-message-box .message-list-div .iqis-message-text {
    max-height: 35px;
    overflow:hidden; 
    text-overflow:ellipsis;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2; 
    color: #5C5C5C;
  }

  .iqis-message-box .message-list-div .iqis-message-expand {
       max-height: none;
       white-space: normal;
  }

  .iqis-message-box .ivu-radio-group-button .ivu-radio-wrapper{
    padding: 0 6px;
    border: 0px solid #dddee1;
  }
</style>
