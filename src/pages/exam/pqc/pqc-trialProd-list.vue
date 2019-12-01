<template>
  <div class="iqis-page">
    <!-- 日期选择框 -->
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 215px;">
        <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('pqc.dateFilter')" style="width: 205px"></DatePicker>
      </div>
      <!-- 检验状态 -->
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select v-model="search.status" :placeholder="i18n.t('pqc.state')" clearable style="width: 100px;">
          <Option v-for="st in search.state" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('pqc.sa')" slot="prepend" style="width: 110px;text-align: left">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <!-- 搜索/重置按钮 -->
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="refreshData">{{$t('pqc.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t('pqc.reset')}}</Button>
      </div>
    </div>
    <!-- 添加/修改/删除按钮 -->
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <Button type="ghost" icon="plus" @click="addTrial" v-if="permsBtn.INSERT_TRIAL_PROD">{{$t('pqc.add')}}</Button>
        <Button style="margin:0 8px;" type="ghost" icon="edit" @click="editTrial" v-if="permsBtn.UPDATE_TRIAL_PROD" :disabled="tableEditDis">{{$t('pqc.modify')}}</Button>
        <Poptip
          confirm
          :title="i18n.t('pqc.dsi')"
          placement="bottom-start"
          :ok-text='i18n.t("pqc.confirm")'
          :cancel-text='i18n.t("pqc.cancel")'
          @on-ok="deleteTableSelected">
          <Button type="ghost" icon="trash-a"  v-if="permsBtn.DELETE_TRIAL_PROD" :disabled="!table.selected">{{$t('pqc.delete')}}</Button>
        </Poptip>
      </div>
     
      <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="reset">{{$t("pqc.refresh")}}</Button>

        <Button type="primary" @click="rank">{{$t('pqc.customList')}}</Button>
        <Dropdown style="margin-left: 20px" v-if="permsBtn.EXPORT_TRIAL_PROD">
          <Button type="ghost">{{$t('pqc.exportReport')}}<Icon type="arrow-down-b"></Icon></Button>
          <DropdownMenu slot="list">
              <DropdownItem>
                <Button type="text" @click="exportStatement(1)">{{$t('pqc.pageData')}}</Button>
              </DropdownItem>
              <DropdownItem>
                <Button type="text" @click="exportStatement(2)">{{$t('pqc.abnReport')}}</Button>
              </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
     <!-- 单据表格 -->
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table class="tableCustom" ref="pageTable"  @on-row-dblclick="onDBClick"  highlight-row v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display:inline-block;"> -->
            <div style="padding: 20px 0 20px 0px;">
              <Page id="pageId" v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                    :page-size-opts="[10,20,50,100]"
                    @on-change="pageChange" @on-page-size-change="pageSizeChange"
                    size="small" show-total show-elevator show-sizer></Page>
            </div>
          <!-- </div>
          <div style="display: inline-block;">
            <div style="float: left;margin: 4px;line-height: 24px;">
                <Button type="primary" size="small" @click="goElevatorPage">跳转</Button>
            </div>
          </div> -->

        </div>
      </div>

    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
    <div class="arrangement-dialog">
      <Modal
      :title="i18n.t('pqc.customList')"
      v-model="arrangement.state"
      class="rankBox"
      :mask-closable="false"
      :width="600" >
      <span class="list_txt">{{$t('pqc.select')}}</span>
       <div class="list_ok list">
        <div v-for="(item,index) in arrangement.data1" class="dataItem" :class="'check'+index"  :key="index">
          <input type="checkbox"   :value="item"  v-model="arrangement.data" >
           <span >{{item.title}}</span>
         </div>
       </div>
       <span class="list_txt2">{{$t('pqc.tsl')}}</span>
       <div class="list_no list">
       <draggable style="padding: 8px 0; overflow-y:auto;width: 100%;display: -webkit-flex;display: flex;flex-wrap:wrap;align-items: flex-start;" v-model="arrangement.data" :options="{group:'people'}" @start="drag=true" @end="drag=false">
            <Card class="process-item" v-for="(element,index) in arrangement.data" :key="index" :class="element.title==null?'displayNO':''">
              <div style="text-align:left">
                <span>{{element.title}}</span>
              </div>
            </Card>
        </draggable>
       </div>
        <div slot="footer">
        <Button type="primary" size="large" @click="ReplyOk" >{{$t("pqc.rdc")}}</Button>
        <Button type="primary" size="large" @click="RankOk" >{{$t('pqc.confirm')}}</Button>
        <Button type="text" size="large" @click="RankNo">{{$t('pqc.cancel')}}</Button>
      </div>
      </Modal>
    </div>
  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import $ from "jquery";

  export default {
    props:['params'],
    components: {
      Input
    },
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        data:[
        ],
        tableEditDis:true,
        table:{
          selected:false,
          loading:true,
          pager:{
            rows:10,
            need:true,
            total:0,
            limit:10,
            current:1
          },
          columns:[
            {type: 'selection',
              align: 'center',
              width:40,
              minWidth:40,
              maxWidth:40
            },
            {
              title: i18n.t('pqc.time'),
              className:'tablePadding',
              width: 106,
              minWidth: 106,
              ellipsis:true,
              key: 'applicationTime',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = "-"
                if(value){
                  var unixTimestamp = new Date(value);
                  str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                }
                return h("span",str);
              }
            },{
              title: i18n.t('pqc.pn'),
              className:'tablePadding',
              width: 120,
              minWidth:120,
              ellipsis:true,
              key: 'productNo',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.name'),
              className:'tablePadding',
              width: 80,
              minWidth:80,
              ellipsis:true,
              key: 'productName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.specifications'),
              className:'tablePadding',
              width: 103,
              minWidth:103,
              ellipsis:true,
              key: 'productSpec',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.qotp'),
              className:'tablePadding',
              width: this.$store.state.locale=='zh_CN'?70:180,
              minWidth:this.$store.state.locale=='zh_CN'?70:180,
              ellipsis:true,
              key: 'trialProdQuantity',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.tpls'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?80:150,
              minWidth:this.$store.state.locale=='zh_CN'?80:150,
              ellipsis:true,
              key: 'prodLineName',
            },{
              title: i18n.t('pqc.state'),
              className:'tablePadding',
              minWidth:70,
              ellipsis:true,
              key: 'trialProdState',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{'UNSUBMIT':i18n.t('pqc.unsubmit'),'AUDITING':i18n.t('pqc.afa'),'AUDITREJECT':i18n.t('pqc.ra'),'AUDITPASS':i18n.t('pqc.wtp'),'TRIALPRODUCTING':i18n.t('pqc.itp'),'TRIALPRODAUDITING':i18n.t("pqc.tpw"),'TRIALPRODAUDITREJECT':i18n.t('pqc.tpr'),'TRIALPRODAUDITPASS':i18n.t('pqc.wr'),'REVIEWING':i18n.t('pqc.itr'),'TRIALPRODEND':i18n.t('pqc.ct')})
            },{
              title: i18n.t('pqc.at'),
              className:'tablePadding',
              width: 106,
              minWidth: 106,
              ellipsis:true,
              key: 'actualTrialProdTime',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = "-"
                if(value){
                  var unixTimestamp = new Date(value);
                  str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                }
                return h("span",str);
              }
            },{
              title: i18n.t('pqc.result'),
              className:'tablePadding',
              minWidth:100,
              ellipsis:true,
              key: 'trialProdResult',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.applicant'),
              className:'tablePadding',
              width: 103,
              minWidth:103,
              ellipsis:true,
              key: 'applicationUser',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },
          ]
        },
        search: {
          status:"",
          state:[
            {value:"",label:i18n.t('pqc.all')},
            {value:"unsubmit",label:i18n.t('pqc.unsubmit')},
            {value:"auditing",label:i18n.t('pqc.afa')},
            {value:"auditReject",label:i18n.t('pqc.ra')},
            {value:"auditPass",label:i18n.t('pqc.wtp')},
            {value:"trialProducing",label:i18n.t('pqc.itp')},
            {value:"trialProdAuditing",label:i18n.t('pqc.tpw')},
            {value:"trialProdAuditReject",label:i18n.t('pqc.tpr')},
            {value:"trialProdAuditPass",label:i18n.t('pqc.wr')},
            {value:"Reviewing",label:i18n.t('pqc.itr')},
            {value:"trialProdEnd",label:i18n.t('pqc.ct')}
          ],
          query: "",
          userList:[],
          fieldName: "",
          data: {
            searchTypes: [
              {label: i18n.t('pqc.sa'),value: ""},
              {label: i18n.t('pqc.pn'),value: "productNo"},
              {label: i18n.t('pqc.name'),value: "productName"},
              {label: i18n.t('pqc.specifications'),value: "productSpec"},
              {label: i18n.t('pqc.productUnit'),value: "prodUnitName"},
              {label: i18n.t('pqc.pc'),value: "prodTypeName"},
              {label: i18n.t('pqc.customerName'),value: "customerName"},
              {label: i18n.t('pqc.tpls'),value: "prodLineName"},
              {label: i18n.t('pqc.result'),value: "trialProdResult"},
              {label: i18n.t('pqc.applicant'),value: "applicationUser"},
            ]
          }
        },
        arrangement:{
          state:false,
          data:[],
          data1:[],
        },
        index:1,
        dataList:[],
        rankData:[
          {
              title: i18n.t('pqc.time'),
              className:'tablePadding',
              width: 106,
              minWidth: 106,
              ellipsis:true,
              key: 'planTrialProdTime',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = "-"
                if(value){
                  var unixTimestamp = new Date(value);
                  str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                }
                return h("span",str);
              }
            },{
              title: i18n.t('pqc.pn'),
              className:'tablePadding',
              width: 120,
              minWidth:120,
              ellipsis:true,
              key: 'productNo',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.name'),
              className:'tablePadding',
              width: 80,
              minWidth:80,
              ellipsis:true,
              key: 'productName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.specifications'),
              className:'tablePadding',
              width: 103,
              minWidth:103,
              ellipsis:true,
              key: 'productSpec',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.qotp'),
              className:'tablePadding',
              width: this.$store.state.locale=='zh_CN'?70:200,
              minWidth:this.$store.state.locale=='zh_CN'?70:200,
              ellipsis:true,
              key: 'trialProdQuantity',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.line'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'prodLineName',
            },{
              title: i18n.t('pqc.state'),
              className:'tablePadding',
              minWidth:80,
              ellipsis:true,
              key: 'trialProdState',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{'UNSUBMIT':i18n.t('pqc.unsubmit'),'AUDITING':i18n.t('pqc.afa'),'AUDITREJECT':i18n.t('pqc.ra'),'AUDITPASS':i18n.t('pqc.wtp'),'TRIALPRODUCTING':i18n.t('pqc.itp'),'TRIALPRODAUDITING':i18n.t("pqc.tpw"),'TRIALPRODAUDITREJECT':i18n.t('pqc.tpr'),'TRIALPRODAUDITPASS':i18n.t('pqc.wr'),'REVIEWING':i18n.t('pqc.itr'),'TRIALPRODEND':i18n.t('pqc.ct')})

            },{
              title: i18n.t('pqc.at'),
              className:'tablePadding',
              width: 106,
              minWidth: 106,
              ellipsis:true,
              key: 'actualTrialProdTime',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = "-"
                if(value){
                  var unixTimestamp = new Date(value);
                  str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                }
                return h("span",str);
              }
            },{
              title: i18n.t('pqc.result'),
              className:'tablePadding',
              minWidth:70,
              ellipsis:true,
              key: 'trialProdResult',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.applicant'),
              className:'tablePadding',
              width: 103,
              minWidth:103,
              ellipsis:true,
              key: 'applicationUser',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },
            
            {
              title: i18n.t('pqc.atm'),
              className:'tablePadding',
              width: 106,
              minWidth:106,
              ellipsis:true,
              key: 'applicationTime',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = "-"
                if(value){
                  var unixTimestamp = new Date(value);
                  str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                }
                return h("span",str);
              }
            },{
              title: i18n.t('pqc.oddn'),
              className:'tablePadding',
              width: 103,
              minWidth:103,
              ellipsis:true,
              key: 'trialProdNo',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.onr'),
              className:'tablePadding',
              width: 103,
              minWidth:103,
              ellipsis:true,
              key: 'orderNo',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.pc'),
              className:'tablePadding',
              width: this.$store.state.locale=='zh_CN'?90:130,
              minWidth:this.$store.state.locale=='zh_CN'?90:130,
              ellipsis:true,
              key: 'prodTypeName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.unit'),
              className:'tablePadding',
              minWidth:56,
              ellipsis:true,
              key: 'prodUnitName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.ac'),
              className:'tablePadding',
              width: this.$store.state.locale=='zh_CN'?90:150,
              minWidth:this.$store.state.locale=='zh_CN'?90:150,
              ellipsis:true,
              key: 'customerName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.objective'),
              className:'tablePadding',
              width: 90,
              minWidth:90,
              ellipsis:true,
              key: 'trialProdObjective',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.badQuantity'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:100,
              ellipsis:true,
              key: 'badQuantity',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },
            {
              title: i18n.t('pqc.defectRate'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:100,
              ellipsis:true,
              key: 'badRate',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)

            },
        ],
        permsCur:[
          "EXPORT_TRIAL_PROD",
          "UPDATE_TRIAL_PROD",
          "SELECT_TRIAL_PROD",
          "INSERT_TRIAL_PROD",
          "DELETE_TRIAL_PROD",
          "AUDIT_TRIAL_PROD",
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "EXPORT_TRIAL_PROD":false,
          "UPDATE_TRIAL_PROD":false,
          "SELECT_TRIAL_PROD":false,
          "INSERT_TRIAL_PROD":false,
          "DELETE_TRIAL_PROD":false,
          "AUDIT_TRIAL_PROD":false,
        },

      }
    },//end data

    created(){
      this.refreshData();
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
    },
    watch:{
      renderList:function(a,b){
        if(a){
          this.reset(1);
        }
      }
    },
    computed:{
      renderList (){
        return this.$store.state.renderExamList;
      }
    },
    methods:{
      reset(){

        this.table.selected='';
        this.search.dates=[];
        this.search.isInternal='';
        this.search.treatmentMethod='';
        this.search.status='';
        this.search.isFatal='';
        this.search.fieldName='';
        this.search.query='';
        this.refreshData(1);
        this.pageChange(1)
      },
      exportStatement (index){
        //console.log(index,'index');
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        if(index == 1){
          url = '/examinecenter/pqc/trialProd/application/export/list';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          params.query = this.search.query;
          // params.fieldName = this.search.fieldName;
          // params.result = this.search.isInternal;
          // params.state = this.search.status;
          // if(this.search.dates && this.search.dates[0]){
          //   let sdate = this.search.dates[0];
          //   let edate = this.search.dates[1];
          //   params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          //   params.endDate = this.$iqis.utils.getDayEnd(edate);
          // }
        }
        if(index == 2){
          url = '/examinecenter/pqc/trialProd/application/export/report'
          let reviewList=this.$refs.pageTable.getSelection()
          if( reviewList.length != 1){
            this.$Notice.warning({
                title: i18n.t('pqc.sap'),
            });
            return;
          }
          params.trialProdId = reviewList[0].trialProdId
        }

        this.$iqis.download(url,params,methods,()=>{}) //下载文件
      },
      refreshData(){
        let that = this;

        that.table.loading = true;

        let params = {};
        let startDate = '';
        let endDate = '';
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        let customerId=this.$store.state.customerId||''
        if(this.search.dates && this.search.dates[0]){
          startDate = this.$iqis.utils.getDayStart(1,this.search.dates[0]);
          endDate = this.$iqis.utils.getDayEnd(this.search.dates[1]);
          params.query='startDate='+startDate+'&endDate='+endDate+'&trialProdState='+that.search.status+'&field='+that.search.fieldName+'&keyword='+that.search.query+'&toSupplierCustomerId='+customerId;
        }else{
          params.query='trialProdState='+that.search.status+'&field='+that.search.fieldName+'&keyword='+that.search.query+'&toSupplierCustomerId='+customerId;
        }

        this.$http.get("/examinecenter/pqc/trialProd/application",{params:params}).then(function (resp){
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
          that.$store.commit('RENDER_CHANGE',false);
        })
      },
      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        this.refreshData();
      },
      pageChange(page){
        this.table.pager.current = page;
        this.refreshData();
      },
      addTrial(){
        this.$emit("open-tab","qc-pqc-trialProd-add",i18n.t('pqc.tpm'),"page-exam-pqc-trialProd-add",null);
      },
      editTrial(){
        let selectedRow = this.$refs.pageTable.getSelection()
        //console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t('pqc.yms'),
            desc: ''
          });
          return;
        }
        this.$emit("open-tab","qc-pqc-trialProd-edit-"+selectedRow[0].trialProdId,i18n.t('pqc.mtp')+"-"+selectedRow[0].productName,"page-exam-pqc-trialProd-add",{trialProdId:selectedRow[0].trialProdId});
      },
      /**双击打开 */
      onDBClick(obj,index){
        this.$emit("open-tab","qc-pqc-trialProd-edit-"+obj.trialProdId,i18n.t('pqc.mtp')+"-"+obj.productName,"page-exam-pqc-trialProd-add",{trialProdId:obj.trialProdId});

      },
      tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
      },deleteTableSelected(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/examinecenter/pqc/trialProd/application/"+ss[i].trialProdId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t("pqc.ds"));
              that.refreshData();
            });
          }
        }
      },
      loadEditData(){
        this.editModal.dataLoading = true;

        let that = this
        this.$http.get("/tenant/user",{params:{limit:99999999}}).then(function (resp) {
          if(resp.data){
            that.search.userList = resp.data;
            that.editModal.dataLoading = false;
          }
        });
      },
      rank(){
        let that=this;
        if(that.index===1){
            that.defaultData()
        }else{
           that.arrangement.data=that.arrangement.data;
        }
        that.arrangement.data1=that.rankData;
        that.arrangement.state=true;
      },
      //默认排序
      ReplyOk(){
        this.defaultData()
      },
      //默认排序
      defaultData(){
        let that=this;
        that.index=1;
        that.dataList=that.rankData.concat();
        that.dataList.splice(-9,9)
        that.arrangement.data=that.dataList;
      },
      //排序确定
      RankOk(){
        if(this.arrangement.data.length===0){
         this.$Notice.warning({
            title: i18n.t('pqc.tlc'),
            desc: ''
          });
          return;
        }
        let data=[{type: 'selection',align: 'center',width:40,minWidth:40,maxWidth:40}]
        let dataList=data.concat(this.arrangement.data)
        this.table.columns=dataList;
        this.index=2;
        this.arrangement.state=false;
      },
      // 默认数据显示
      RankNo(){
        this.arrangement.state=false;
      },
      hightLight(){
        // ivu-table-row ivu-table-row-highlight
      }




    }//end methods




  }

</script>
<style scoped>

/* 公用自定义列样式 */
.rankBox .list{width: 100%;min-height: 30px;}
.rankBox .list_txt2{display: block;margin-top: 20px;}
/* .rankBox .check0{display: none;} */
.list_txt ,.list_txt2{display:block;margin-bottom:10px;font-size:16px;color:#5C5C5C;}
.list_no{background:#FAFAFA;}
.list_ok .dataItem{display: inline-block;padding: 5px 10px;}
.list_no div , .list_no span{display: inline-block;}
.list_no span{padding: 1px 10px;font-size: 14px;}
.list_no .X0{display: none}
.list_no .process-item{margin-left: 10px;cursor: pointer;margin-bottom: 15px;width:auto!important;}
.list_no .ivu-card-body{padding:0!important;border: 1px solid #418FEE;border-radius: 2px;}
.displayNO{display: none;}
.list_no .ivu-card-body{padding-right: 0x !important;}
/* .ivu-table-wrapper{
  height:auto!important;
  overflow: auto!important;
} */
.ivu-table-overflowY{
  height:auto!important;
}
/* 公用列表和树形响应式高度 */
/* @media screen and (max-width:1920px){
  .tableCustom.ivu-table-wrapper{
    height:536px!important;
  }
  .tableCustom .ivu-table-body{
    height:482px!important;
  }
}
@media screen and (max-width:1440px){
  .tableCustom.ivu-table-wrapper{
    height:449px!important;
  }
  .tableCustom .ivu-table-body{
    height:395px!important;
  }
}
@media screen and (max-width:1366px){
  .tableCustom.ivu-table-wrapper{
    height:340px!important;
  }
  .tableCustom>.ivu-table>.ivu-table-body{
    height:286px!important;
  }
} */

/*新增，修改切换组件，边个宽度不能自适应的问题。*/
.tableCustom .ivu-table-header table,.tableCustom .ivu-table-body table,.tableCustom .ivu-table-tip table{
  width: 100%!important;
}
/*新增*/
</style>
