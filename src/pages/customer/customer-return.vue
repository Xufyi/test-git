<template>
  <div class="iqis-page">

    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">

          <div class="iqis-page-search-row">
            <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
              <DatePicker type="daterange" v-model="search.dates" :placeholder="i18n.t('customer.dateFilter')" style="width: 210px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
              <Select v-model="search.status" :placeholder="i18n.t('customer.status')" clearable style="width: 100px;">
                <Option v-for="st in search.state" :key="st.value" :value="st.value">{{st.label}}</Option>
              </Select>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('customer.searchAll')" slot="prepend" style="width: 110px;text-align:left;">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
              <Button style="margin-right:8px;" type="primary" @click="refreshData">{{$t('customer.search')}}</Button>
              <Button type="ghost" @click="reset">{{$t('customer.reset')}}</Button>
            </div>
          </div>

          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <Button type="ghost" v-if="permsBtn.INSERT_CUSTOMER_REFUND" icon="plus" @click="addRefund">{{$t('customer.add')}}</Button>
              <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.UPDATE_CUSTOMER_REFUND" icon="edit" :disabled="tableEditDis" @click="editRefund">{{$t('customer.edit')}}</Button>
              <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                confirm
                title="确定要删除选择的项吗?"
                placement="bottom-start"
                @on-ok="deleteTableSelected">
                <Button type="ghost" v-if="permsBtn.DELETE_CUSTOMER_REFUND" icon="trash-a" :disabled="!table.selected">{{$t('customer.delete')}}</Button>
              </Poptip>

            </div>
            <div class="iqis-page-tool-second" style="font-size:0;">
              <Button type="text"  icon="refresh" @click="reset">{{$t('customer.refreshData')}}</Button>
              <Button type="primary" @click="rank">{{$t('customer.customList')}}</Button>
              <Dropdown style="margin-left: 8px" v-if="permsBtn.EXPORT_CUSTOMER_REFUND">
                <Button type="ghost">{{$t('customer.export')}}<Icon style="margin-left:10px;" type="arrow-down-b"></Icon></Button>
                <DropdownMenu slot="list">
                    <DropdownItem>
                      <Button type="text" @click="exportStatement(1)">{{$t('customer.thisPage')}}</Button>
                    </DropdownItem>
                    <DropdownItem>
                      <Button type="text" @click="exportStatement(3)">{{$t('customer.allData')}}</Button>
                    </DropdownItem>
                    <DropdownItem>
                      <Button type="text" @click="exportStatement(2)">{{$t('customer.returnReport')}}</Button>
                    </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>


          <Table class="tableCustom" ref="pageTable" highlight-row :height="430" @on-row-dblclick="onDBClick" :loading="table.loading" v-drag-table-column="table.columns" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <div style="padding: 20px 0 20px 0px;">
            <Page v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                  :page-size-opts="[10,20,50,100]"
                  @on-change="pageChange" @on-page-size-change="pageSizeChange"
                  size="small" show-total show-elevator show-sizer></Page>
          </div>
        </div>
      </div>

    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
    <div class="arrangement-dialog">
      <Modal
      :title="i18n.t('customer.customList')"
      v-model="arrangement.state"
      class="rankBox"
      :mask-closable="false"
      :width="600" >
      <span class="list_txt">{{$t('customer.select')}}</span>
       <div class="list_ok list">
        <div v-for="(item,index) in arrangement.data1" class="dataItem" :class="'check'+index"  :key="index">
          <input type="checkbox"   :value="item"  v-model="arrangement.data" >
           <span >{{item.title}}</span>
         </div>
       </div>
       <span class="list_txt2">{{$t('customer.selected')}}</span>
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
        <Button type="primary" size="large" @click="ReplyOk" >{{$t('customer.restore')}}</Button>
        <Button type="primary" size="large" @click="RankOk" >{{$t('customer.confirm')}}</Button>
        <Button type="text" size="large" @click="RankNo">{{$t('customer.cancel')}}</Button>
      </div>
      </Modal>
    </div>
  </div>

</template>
<script>

import $ from 'jquery'
  export default {

    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        tableEditDis:true,
        customerRefund:'',
        data:[
        ],
        search: {
          query: "",
          fieldName: "",
          result:"",
          userList:[],
          status:"",
          state:[
            {value:"",label:i18n.t('customer.all')},
            {value:"1",label:i18n.t('customer.ReturnAuditing')},
            {value:"2",label:i18n.t('customer.ReturnAuditReject')},
            {value:"3",label:i18n.t('customer.treated')},
            {value:"4",label:i18n.t('customer.treating')},
            {value:"5",label:i18n.t('customer.treatAuditing')},
            {value:"6",label:i18n.t('customer.treatAuditReject')},
            {value:"7",label:i18n.t('customer.waitReplenishment')},
            {value:"8",label:i18n.t('customer.Replenishing')},
            {value:"9",label:i18n.t('customer.closed')}
          ],
          data: {
            searchTypes: [
              {label: i18n.t('customer.searchAll'),value: ""},
              {label: i18n.t('customer.returnNo'),value: "refundNo"},
              {label: i18n.t('customer.productNo'),value: "productNo"},
              {label: i18n.t('customer.productName'),value: "productName"},
              // {label: "规格型号",value: "productSpec"},
              {label: i18n.t('customer.treatmentMethod'),value: "treatmentMethod"},
              {label: i18n.t('customer.status'),value: "state"},
              {label: i18n.t('customer.returnCustomer'),value: "customerName"}
            ]
          }
        },
        date:new Date(),
        table:{
          loading:false,
          selected:false,
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
              maxWidth:40
            },{
              title: i18n.t('customer.returnTime'),
              className:'tablePadding',
              width:106,
              minWidth:106,
              ellipsis:true,
              key: 'refundDate',
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
              title: i18n.t('customer.returnNo'),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'refundNo'
            },{
              title: i18n.t('customer.productNo'),
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'productNo'
            },{
              title: i18n.t('customer.productName'),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'productName'
            },{
              title: i18n.t('customer.productSpec'),
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'productSpec'
            },{
              title: i18n.t('customer.returnQuantity'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?70:110,
              minWidth:this.$store.state.locale=='zh_CN'?70:110,
              ellipsis:true,
              key: 'refundQuantity',
            },{
              title: i18n.t('customer.treatmentMethod'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:120,
              ellipsis:true,
              key: 'treatmentMethod',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{"SCREEN":i18n.t('customer.filter'),"REWORK":i18n.t('customer.rework'),"SCRAP":i18n.t('customer.scrap'),"TEMPORARY_STORAGE":i18n.t('customer.storage'),"SPECIAL_ADOPTION":i18n.t('customer.special')})
            },{
              title: i18n.t('customer.status'),
              className:'tablePadding',
              minWidth:65,
              ellipsis:true,
              key: 'state',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{1:i18n.t('customer.ReturnAuditing'),2:i18n.t('customer.ReturnAuditReject'),3:i18n.t('customer.treated'),4:i18n.t('customer.treating'),5:i18n.t('customer.treatAuditing'),6:i18n.t('customer.treatAuditReject'),7:i18n.t("customer.waitReplenishment"),8:i18n.t('customer.Replenishing'),9:i18n.t('customer.closed')})
            },{
              title: i18n.t('customer.planReturnTime'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?106:120,
              minWidth:this.$store.state.locale=='zh_CN'?106:120,
              ellipsis:true,
              key: 'planReplenishmentDate',
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
              title: i18n.t('customer.actualReturnTime'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?106:130,
              minWidth:this.$store.state.locale=='zh_CN'?106:130,
              ellipsis:true,
              key: 'realReplenishmentDate',
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
              title: i18n.t('customer.returnCustomer'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?80:110,
              minWidth:this.$store.state.locale=='zh_CN'?80:110,
              ellipsis:true,
              key: 'customerShortName'
            }
          ]
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
            title: i18n.t('customer.returnTime'),
            className:'tablePadding',
            width:106,
            minWidth:106,
            ellipsis:true,
            key: 'refundDate',
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
            title: i18n.t('customer.returnNo'),
            className:'tablePadding',
            width:103,
            minWidth:103,
            ellipsis:true,
            key: 'refundNo'
          },{
            title: i18n.t('customer.productNo'),
            className:'tablePadding',
            width:120,
            minWidth:120,
            ellipsis:true,
            key: 'productNo'
          },{
            title: i18n.t('customer.productName'),
            className:'tablePadding',
            width:103,
            minWidth:103,
            ellipsis:true,
            key: 'productName'
          },{
            title: i18n.t('customer.productSpec'),
            className:'tablePadding',
            width:120,
            minWidth:120,
            ellipsis:true,
            key: 'productSpec'
          },{
            title: i18n.t('customer.returnQuantity'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?70:120,
            minWidth:this.$store.state.locale=='zh_CN'?70:120,
            ellipsis:true,
            key: 'refundQuantity',
          },{
            title: i18n.t('customer.treatmentMethod'),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?80:150,
            ellipsis:true,
            key: 'treatmentMethod',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{"SCREEN":i18n.t('customer.filter'),"REWORK":i18n.t('customer.rework'),"SCRAP":i18n.t('customer.scrap'),"TEMPORARY_STORAGE":i18n.t('customer.storage'),"SPECIAL_ADOPTION":i18n.t('customer.special')})
          },{
            title: i18n.t('customer.status'),
            className:'tablePadding',
            minWidth:80,
            ellipsis:true,
            key: 'stateTips'
          },{
            title: i18n.t('customer.planReturnTime'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?106:130,
            minWidth:this.$store.state.locale=='zh_CN'?106:130,
            ellipsis:true,
            key: 'planReplenishmentDate',
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
            title: i18n.t('customer.actualReturnTime'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?106:130,
            minWidth:this.$store.state.locale=='zh_CN'?106:130,
            ellipsis:true,
            key: 'realReplenishmentDate',
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
            title: i18n.t('customer.returnCustomer'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?80:120,
            minWidth:this.$store.state.locale=='zh_CN'?80:120,
            ellipsis:true,
            key: 'customerShortName'
          },

          {
            title: i18n.t('customer.productBatch'),
            className:'tablePadding',
            width:103,
            minWidth:103,
            ellipsis:true,
            key: 'batchNo'
          },{
            title: i18n.t('customer.prodType'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?80:120,
            minWidth:this.$store.state.locale=='zh_CN'?80:120,
            ellipsis:true,
            key: 'prodTypeName'
          },{
            title: i18n.t('customer.productUnit'),
            className:'tablePadding',
            width:60,
            minWidth:60,
            ellipsis:true,
            key: 'productUnitName'
          },{
            title: i18n.t('customer.outgoingQuantity'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?70:140,
            minWidth:this.$store.state.locale=='zh_CN'?70:140,
            ellipsis:true,
            key: 'deliveryQuantity'
          },{
            title: i18n.t('customer.replenishmentQuantity'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?70:160,
            minWidth:this.$store.state.locale=='zh_CN'?70:160,
            ellipsis:true,
            key: 'replenishmentQuantity'
          },{
            title: i18n.t('customer.processingDepartment'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?70:160,
            minWidth:this.$store.state.locale=='zh_CN'?70:160,
            ellipsis:true,
            key: 'departmentName'
          },{
            title: i18n.t('customer.treatmentQuantity'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?70:140,
            minWidth:this.$store.state.locale=='zh_CN'?70:140,
            ellipsis:true,
            key: 'treatmentQuantity'
          },{
            title: i18n.t('customer.treatmentQuantity'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?70:140,
            minWidth:this.$store.state.locale=='zh_CN'?70:140,
            ellipsis:true,
            key: 'qualifiedQuantity'
          },{
            title: i18n.t('customer.treatmentTime'),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?70:140,
            ellipsis:true,
            key: 'treatmentHours'
          },{
            title: i18n.t('customer.Registrant'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?70:140,
            minWidth:this.$store.state.locale=='zh_CN'?70:140,
            ellipsis:true,
            key: 'creaotrName'
          },{
            title: i18n.t('customer.Restitution'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?70:140,
            minWidth:this.$store.state.locale=='zh_CN'?70:140,
            ellipsis:true,
            key: 'creaotrName'
          },
        ],
        permsCur:[
          "INSERT_CUSTOMER_REFUND",
          "SELECT_CUSTOMER_REFUND",
          "AUDIT_CUSTOMER_REFUND",
          "UPDATE_CUSTOMER_REFUND",
          "DELETE_CUSTOMER_REFUND",
          "EXPORT_CUSTOMER_REFUND"
        ],
        permsBtn:{
          "DELETE_CUSTOMER_REFUND":false,
          "SELECT_CUSTOMER_REFUND":false,
          "UPDATE_CUSTOMER_REFUND":false,
          "AUDIT_CUSTOMER_REFUND":false,
          "INSERT_CUSTOMER_REFUND":false,
          "EXPORT_CUSTOMER_REFUND":false
        },
      }
    },//end data

    created(){
      this.refreshData();
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
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
        this.search.dates=[];
        this.table.selected='';
        this.search.query='';
        this.search.status='';
        this.search.fieldName='';
        this.refreshData();
        this.pageChange(1);
      },
       exportStatement (index){
        //console.log(index,'index');
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        if(index == 1){
          url = '/customer/refund/export/list';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          params.query = this.search.query;
          // params.fieldName = this.search.fieldName;
          // params.result = this.search.result;
          // params.state = this.search.status;
          // if(this.search.dates && this.search.dates[0]){
          //   let sdate = this.search.dates[0];
          //   let edate = this.search.dates[1];
          //   params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          //   params.endDate = this.$iqis.utils.getDayEnd(edate);
          // }
        }
        if(index == 3){
          url = '/customer/refund/export/list';
          params.page = 1;
          params.limit = this.table.pager.total;
          params.query = this.search.query;
          // params.fieldName = this.search.fieldName;
          // params.result = this.search.result;
          // params.state = this.search.status;
          // if(this.search.dates && this.search.dates[0]){
          //   let sdate = this.search.dates[0];
          //   let edate = this.search.dates[1];
          //   params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          //   params.endDate = this.$iqis.utils.getDayEnd(edate);
          // }
        }
        if(index == 2){
          url = '/customer/refund/export/report'
          let reviewList=this.$refs.pageTable.getSelection()
          if( reviewList.length != 1){
            this.$Notice.warning({
                title: i18n.t('customer.exportChooseOne'),
            });
            return;
          }
          params.refundId = reviewList[0].refundId
        }

        this.$iqis.download(url,params,methods,()=>{}) //下载文件
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
      refreshData(){
        let that = this;

        that.table.loading = true;

        let params = {};
        let startDate = '';
        let endDate = '';

        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        if(this.search.dates && this.search.dates[0]){
          startDate = this.$iqis.utils.getDayStart(1,this.search.dates[0]);
          endDate = this.$iqis.utils.getDayEnd(this.search.dates[1]);
          params.query='startDate='+startDate+'&endDate='+endDate+'&state='+that.search.status+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }else{
          params.query='state='+that.search.status+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }
        this.$http.get("/customer/refund",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.loading = false;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.$store.commit('RENDER_CHANGE',false);
        })

      },

      addRefund(){
        this.$emit("open-tab","customer-customer-return-add",i18n.t('customer.addReturn'),"page-customer-return-add",null);
      },
      editRefund(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        //console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          // this.$Notice.warning({
          //   title: '必须选择一条记录后才可以进行修改',
          //   desc: ''
          // });
          return;
        }else{
          this.$emit("open-tab","customer-customer-return-add-"+selectedRow[0].refundId,i18n.t('customer.editReturn')+"-"+selectedRow[0].productName,"page-customer-return-add",{refundId:selectedRow[0].refundId});
          // //console.log(selectedRow[0].refundId)
        }
        //this.showModal(selectedRow[0]);
      },
      onDBClick(o,i){
          this.$emit("open-tab","customer-customer-return-add-"+o.refundId,i18n.t('customer.editReturn')+"-"+o.productName,"page-customer-return-add",{refundId:o.refundId});
      },
      loadEditData(){
        // this.editModal.dataLoading = true;
        //
        // let that = this
        // this.$http.get("/tenant/user",{params:{limit:99999999}}).then(function (resp) {
        //   if(resp.data){
        //     that.search.userList = resp.data;
        //     that.editModal.dataLoading = false;
        //   }
        // });
        this.editModal.dataLoading = false;
      },tableSelectChange(selection){
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
            delArr.push(this.$http.delete("/customer/refund/"+ss[i].refundId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('customer.deleteSuccess'));
              that.reset();
            });
          }
        }
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
        that.dataList.splice(-11,11)
        that.arrangement.data=that.dataList;
      },
      //排序确定
      RankOk(){
        if(this.arrangement.data.length===0){
          this.$Notice.warning({
            title: i18n.t('customer.listNull'),
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
    }
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
  .tableResponse.ivu-table-wrapper{
    height:536px!important;
  }
  .tableResponse .ivu-table-body{
    height:482px!important;
  }
}
@media screen and (max-width:1440px){
  .tableResponse.ivu-table-wrapper{
    height:449px!important;
  }
  .tableResponse .ivu-table-body{
    height:395px!important;
  }
}
@media screen and (max-width:1366px){
  .tableResponse.ivu-table-wrapper{
    height:340px!important;
  }
  .tableResponse .ivu-table-body{
    height:286px!important;
  }
} */
</style>
