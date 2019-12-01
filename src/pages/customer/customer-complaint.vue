<template>
  <div class="iqis-page">
    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">
          <div class="iqis-page-search-row">
            <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
              <DatePicker v-model="search.dates" type="daterange" :placeholder="i18n.t('customer.dateFilter')" style="width: 210px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
              <Select v-model="search.isInternal" :placeholder="i18n.t('customer.source')" clearable style="width: 100px;">
                <Option v-for="st in search.isInternalList" :key="st.value" :value="st.value">{{st.label}}</Option>
              </Select>
            </div>
            <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
              <Select v-model="search.treatmentMethod" :placeholder="i18n.t('customer.source')" clearable style="width: 100px;">
                <Option v-for="st in search.treatmentMethodList" :key="st.value" :value="st.value">{{st.label}}</Option>
              </Select>
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
            <div class="iqis-page-search-bar-item" style="flex:1;padding-left: 8px; font-size:0;">
              <Button style="margin-right:8px;" type="primary" @click="refreshData">{{$t('customer.search')}}</Button>
              <Button type="ghost" @click="reset">{{$t('customer.reset')}}</Button></div>
          </div>
          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <Button type="ghost" v-if="permsBtn.INSERT_CUSTOMER_COMPLAINT" icon="plus" @click="addComplain">{{$t('customer.add')}}</Button>
              <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.UPDATE_CUSTOMER_COMPLAINT" icon="edit" @click="editComplain" :disabled="tableEditDis">{{$t('customer.edit')}}</Button><!--  :disabled="!table.selected" -->
              <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"confirm :title="i18n.t('customer.confirmDelete')" placement="bottom-start" @on-ok="deleteThis()">
                <Button v-if="permsBtn.DELETE_CUSTOMER_COMPLAINT" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t('customer.delete')}}</Button>
              </Poptip>
            </div>
            <div class="iqis-page-tool-second" style="font-size:0;">
              <Button type="text"  icon="refresh" @click="reset">{{$t('customer.refreshData')}}</Button>
              <Button type="primary" @click="rank">{{$t('customer.customList')}}</Button>
              <Dropdown style="margin-left: 8px" v-if="permsBtn.EXPORT_CUSTOMER_COMPLAINT">
                <Button type="ghost">{{$t('customer.export')}}<Icon style="margin-left:10px;" type="arrow-down-b"></Icon></Button>
                <DropdownMenu slot="list">
                    <DropdownItem>
                      <Button type="text" @click="exportStatement(1)">{{$t('customer.thisPage')}}</Button>
                    </DropdownItem>
                    <DropdownItem>
                      <Button type="text" @click="exportStatement(3)">{{$t('customer.allData')}}</Button>
                    </DropdownItem>
                    <DropdownItem>
                      <Button type="text" @click="exportStatement(2)">{{$t('customer.complaintReport')}}</Button>
                    </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" highlight-row :height="430" :loading="table.loading" @on-selection-change="tableSelectChange" v-drag-table-column="table.columns" border stripe :columns="table.columns" :data="table.data"></Table>
          <div style="padding: 20px 0 20px 0px;">
            <!-- <Page v-if="table.pager.need" :total="100" :page-size="10" :current="1" :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page> -->
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
  props:["params","tabKey"],
  data:function() {
    let vm = this;
    return {
      i18n:window.i18n,
      tableEditDis:true,
      headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
      search: {
        isInternal:"",
        isInternalList:[
          {value:"",label:i18n.t('customer.all')},
          {value:"1",label:i18n.t('customer.internalProcessing')},
          {value:"0",label:i18n.t('customer.supplier')}
        ],
        treatmentMethod:"",
        treatmentMethodList:[
          {value:"REJECT",label:i18n.t('customer.return')},
          {value:"REWORK",label:i18n.t('customer.rework')},
          {value:"SCREEN",label:i18n.t('customer.filter')},
          {value:"SPECIAL_ADOPTION",label:i18n.t('customer.special')},
          {value:"EMERGENCY_RELEASE",label:i18n.t('customer.release')},
          {value:"SCRAP",label:i18n.t('customer.scrap')},
        ],
        status:"",
        state:[
          {value:"",label:i18n.t('customer.all')},
          {value:"0",label:i18n.t('customer.unsubmit')},
          {value:"1",label:i18n.t('customer.unaudited')},
          {value:"2",label:i18n.t('customer.auditPass')},
          {value:"3",label:i18n.t('customer.auditReject')},
          {value:"4",label:i18n.t('customer.treated')},
          {value:"41",label:i18n.t('customer.Unanswered')},
          {value:"5",label:i18n.t('customer.treating')},
          {value:"51",label:i18n.t('customer.answering')},
          {value:"6",label:i18n.t('customer.back')},
          {value:"7",label:i18n.t('customer.beBack')},
          {value:"8",label:i18n.t('customer.notClosed')},
          {value:"9",label:i18n.t('customer.closed')}
        ],
        query: "",
        fieldName: "",
        userList:[],
        data: {
          searchTypes: [
            {label: i18n.t('customer.searchAll'),value: ""},
            {label: i18n.t('customer.productNo'),value: "productNo"},
            {label: i18n.t('customer.productName'),value: "productName"},
            {label: i18n.t('customer.productSpec'),value: "productSpec"},
            {label: i18n.t('customer.prodType'),value: "productTypeName"},
            {label: i18n.t('customer.productUnit'),value: "productUnitName"},
            {label: i18n.t('customer.customer'),value: "customerName"},
            {label: i18n.t('customer.supplier'),value: "supplierName"},
            {label: i18n.t('customer.abnTheme'),value: "subject"},
            {label: i18n.t('customer.abnNo'),value: "complaintNo"},
            {label: i18n.t('customer.qcNo'),value: "qcNo"},
            {label: i18n.t('customer.productBatchNo'),value: "batchNo"},
            {label: i18n.t('customer.place'),value: "complaintPlace"},
            {label: i18n.t('customer.initiator'),value: "creatorName"}
          ]
        }
      },
      reviewId:'',
      table: {
        loading:false,
        selected:false,
        pager: {
          rows: 10,
          need: true,
          total: 100,
          limit: 10,
          current: 1
        },
        data: [
        ],
        columns: [
          {type: 'selection',
            align: 'center',
            width:40,
            minWidth:40,
            maxWidth:40
          },
          {
            title: i18n.t('customer.happenTime'),
            className:'tablePadding',
            minWidth:106,
            width:106,
            ellipsis:true,
            key: 'complaintDate',
            render:function(h,data){
              let value = data.row[data.column.key];
              let str = "-"
              if(value){
                var unixTimestamp = new Date(value);
                str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
              }
              return h("span",str);
            }
          },
          {
            title: i18n.t('customer.productNo'),
            className:'tablePadding',
            width:120,
            minWidth:120,
            ellipsis:true,
            key: 'productNo'
          },
          {
            title: i18n.t('customer.productName'),
            className:'tablePadding',
            minWidth:80,
            width:80,
            ellipsis:true,
            key: 'productName'
          },
          {
            title: i18n.t('pqc.il'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?60:100,
            minWidth:this.$store.state.locale=='zh_CN'?60:100,
            ellipsis:true,
            key: 'batchQuantity'
          },
          {
            title: i18n.t('customer.treatmentMethod'),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?80:130,
            ellipsis:true,
            key: 'treatmentMethod',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{"REJECT":i18n.t('customer.return'),"REWORK":i18n.t('customer.rework'),"SCREEN":i18n.t('customer.filter'),"EMERGENCY_RELEASE":i18n.t('customer.release'),"SCRAP":i18n.t('customer.scrap'),"SPECIAL_ADOPTION":i18n.t('customer.special')})
          },
          {
            title: i18n.t('customer.customer'),
            className:'tablePadding',
            minWidth:80,
            width:80,
            ellipsis:true,
            key: 'customerName'
          },
          {
            title: i18n.t('customer.majorAbnormal'),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?80:130,
            ellipsis:true,
            key: 'isFatal',
            render:function(h,data){
              return h("span",data.row["isFatal"]==1?i18n.t('customer.yes'):i18n.t('customer.not'))
            }
          },
          {
            title: i18n.t('customer.status'),
            className:'tablePadding',
            minWidth:60,
            ellipsis:true,
            key: 'complaintState',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('customer.unsubmit'),1:i18n.t('customer.unaudited'),2:i18n.t('customer.auditPass'),3:"<span style='color:red;'>"+i18n.t('customer.auditReject')+"</span>",4:i18n.t('customer.treated'),41:i18n.t('customer.Unanswered'),5:i18n.t('customer.treating'),51:i18n.t("customer.answering"),6:i18n.t('customer.back'),7:"<span style='color:red;'>"+i18n.t("customer.beBack")+"</span>",8:i18n.t('customer.notClosed'),9:i18n.t('customer.closed')})
          },
          {
            title: i18n.t('customer.mainDefect'),
            className:'tablePadding',
            minWidth:121,
            width:121,
            ellipsis:true,
            key: 'majorDefect'
          },
          {
            title: i18n.t('customer.abnTheme'),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?80:110,
            width:this.$store.state.locale=='zh_CN'?80:110,
            ellipsis:true,
            key: 'subject'
          },
          {
            title: i18n.t('customer.source'),
            className:'tablePadding',
            minWidth:60,
            ellipsis:true,
            key: 'isInernal',
            render:function(h,data){
              return h("span",data.row["isInternal"]==1?i18n.t('customer.internal'):i18n.t('customer.outside'))
            }
          },
          {
            title: i18n.t('customer.abnNo'),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?103:130,
            width:this.$store.state.locale=='zh_CN'?103:130,
            ellipsis:true,
            key: 'complaintNo'
          },
          {
            title: i18n.t('customer.qcNo'),
            className:'tablePadding',
            width:103,
            minWidth:103,
            ellipsis:true,
            key: 'qcNo'
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
      rankData: [
        {
          title: i18n.t('customer.happenTime'),
          className:'tablePadding',
          minWidth:106,
          width:106,
          ellipsis:true,
          key: 'complaintDate',
          render:function(h,data){
            let value = data.row[data.column.key];
            let str = "-"
            if(value){
              var unixTimestamp = new Date(value);
              str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
            }
            return h("span",str);
          }
        },
        {
          title: i18n.t('customer.productNo'),
          className:'tablePadding',
          width:120,
          minWidth:120,
          ellipsis:true,
          key: 'productNo'
        },
        {
          title: i18n.t('customer.productName'),
          className:'tablePadding',
          minWidth:80,
          width:80,
          ellipsis:true,
          key: 'productName'
        },
        {
          title: i18n.t('pqc.il'),
          className:'tablePadding',
          width:this.$store.state.locale=='zh_CN'?60:130,
          minWidth:this.$store.state.locale=='zh_CN'?60:130,
          ellipsis:true,
          key: 'batchQuantity'
        },
        {
          title: i18n.t('customer.treatmentMethod'),
          className:'tablePadding',
          minWidth:this.$store.state.locale=='zh_CN'?76:150,
          ellipsis:true,
          key: 'treatmentMethod',
          render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{"REJECT":i18n.t('customer.return'),"REWORK":i18n.t('customer.rework'),"SCREEN":i18n.t('customer.filter'),"EMERGENCY_RELEASE":i18n.t('customer.release'),"SCRAP":i18n.t('customer.scrap'),"SPECIAL_ADOPTION":i18n.t('customer.special')})
        },
        {
          title: i18n.t('customer.customer'),
          className:'tablePadding',
          minWidth:80,
          width:80,
          ellipsis:true,
          key: 'customerName'
        },
        {
          title: i18n.t('customer.majorAbnormal'),
          className:'tablePadding',
          minWidth:this.$store.state.locale=='zh_CN'?70:150,
          ellipsis:true,
          key: 'isFatal',
          render:function(h,data){
            return h("span",data.row["isFatal"]==1?i18n.t('customer.yes'):i18n.t('customer.not'))
          }
        },
        {
          title: i18n.t('customer.status'),
          className:'tablePadding',
          minWidth:60,
          ellipsis:true,
          key: 'complaintState',
          render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('customer.unsubmit'),1:i18n.t('customer.unaudited'),2:i18n.t('customer.auditPass'),3:"<span style='color:red;'>"+i18n.t('pqc.rad')+"</span>",4:i18n.t('customer.treated'),41:i18n.t('customer.Unanswered'),5:i18n.t('customer.treating'),51:i18n.t("customer.answering"),6:i18n.t('customer.back'),7:"<span style='color:red;'>"+i18n.t('customer.answering')+"</span>",8:i18n.t('customer.notClosed'),9:i18n.t('customer.closed')})
        },
        {
          title: i18n.t('customer.mainDefect'),
          className:'tablePadding',
          minWidth:121,
          width:121,
          ellipsis:true,
          key: 'majorDefect'
        },
        {
          title: i18n.t('customer.abnTheme'),
          className:'tablePadding',
          minWidth:this.$store.state.locale=='zh_CN'?80:120,
          width:this.$store.state.locale=='zh_CN'?80:120,
          key: 'subject'
        },
        {
          title: i18n.t('customer.source'),
          className:'tablePadding',
          minWidth:69,
          ellipsis:true,
          key: 'isInernal',
          render:function(h,data){
            return h("span",data.row["isInternal"]==1?i18n.t('customer.internal'):i18n.t('customer.outside'))
          }
        },
        {
          title: i18n.t('customer.abnNo'),
          className:'tablePadding',
          minWidth:this.$store.state.locale=='zh_CN'?103:130,
          width:this.$store.state.locale=='zh_CN'?103:130,
          ellipsis:true,
          key: 'complaintNo'
        },
        {
          title: i18n.t('customer.qcNo'),
          className:'tablePadding',
          width:103,
          minWidth:103,
          ellipsis:true,
          key: 'qcNo'
        },

        {
          title: i18n.t('customer.productSpec'),
          className:'tablePadding',
          width: 120,
          minWidth:120,
          ellipsis:true,
          key: 'productSpec',
          render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
        {
          title: i18n.t('customer.prodType'),
          className:'tablePadding',
          width: this.$store.state.locale=='zh_CN'?80:120,
          minWidth:this.$store.state.locale=='zh_CN'?80:120,
          ellipsis:true,
          key: 'productTypeName',
          render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
        {
          title: i18n.t('customer.productUnit'),
          className:'tablePadding',
          minWidth:60,
          ellipsis:true,
          key: 'productUnitName',
          render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
        {
          title: i18n.t('customer.supplier'),
          className:'tablePadding',
          width: 96,
          minWidth:96,
          ellipsis:true,
          key: 'supplierName',
          render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },

        {
          title: i18n.t('customer.productBatchNo'),
          className:'tablePadding',
          width: this.$store.state.locale=='zh_CN'?103:130,
          minWidth:this.$store.state.locale=='zh_CN'?103:130,
          ellipsis:true,
          key: 'batchNo',
          render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
        {
          title: i18n.t('customer.place'),
          className:'tablePadding',
          width: this.$store.state.locale=='zh_CN'?92:110,
          minWidth:this.$store.state.locale=='zh_CN'?92:110,
          ellipsis:true,
          key: 'complaintPlace',
          render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
        {
          title: i18n.t('customer.qcNum'),
          className:'tablePadding',
          width: this.$store.state.locale=='zh_CN'?60:150,
          minWidth:this.$store.state.locale=='zh_CN'?60:150,
          ellipsis:true,
          key: 'inspectionQuantity',
          render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
        {
          title: i18n.t('customer.badNum'),
          className:'tablePadding',
          width: this.$store.state.locale=='zh_CN'?60:150,
          minWidth:this.$store.state.locale=='zh_CN'?60:150,
          ellipsis:true,
          key: 'badQuantity',
          // render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
        {
          title: i18n.t('customer.badRate'),
          className:'tablePadding',
          minWidth:70,
          ellipsis:true,
          key: 'badRate',
          render:(h,params)=>{
            // return h('span',params.row['badRate']=(params.row.badQuantity/params.row.inspectionQuantity*100).toFixed(2))
            return h('span',params.row['badRate']=((params.row.badQuantity/params.row.inspectionQuantity*100) > 100 ? 100 : Math.floor(params.row.badQuantity/params.row.inspectionQuantity*10000) / 100))
          }
        },
        {
          title: i18n.t('customer.treatmentLimit'),
          className:'tablePadding',
          minWidth:this.$store.state.locale=='zh_CN'?70:150,
          ellipsis:true,
          key: 'treatmentTimeLimit',
          render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
        {
          title: i18n.t('customer.initiator'),
          className:'tablePadding',
          width: 70,
          minWidth:70,
          ellipsis:true,
          key: 'creatorName',
          render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
      ],
      permsCur:[
        "INSERT_CUSTOMER_COMPLAINT",
        "SELECT_CUSTOMER_COMPLAINT",
        "UPDATE_CUSTOMER_COMPLAINT",
        "DELETE_CUSTOMER_COMPLAINT",
        "AUDIT_CUSTOMER_COMPLAINT",
        "EXPORT_CUSTOMER_COMPLAINT",
      ],
      permsBtn:{
        "DELETE_CUSTOMER_COMPLAINT":false,
        "SELECT_CUSTOMER_COMPLAINT":false,
        "UPDATE_CUSTOMER_COMPLAINT":false,
        "EXPORT_CUSTOMER_COMPLAINT":false,
        "AUDIT_CUSTOMER_COMPLAINT":false,
        "INSERT_CUSTOMER_COMPLAINT":false
      },
    }
  },
  //end data
  created() {
    this.refreshData();
    let permsAll = this.$store.state.permissions;
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.$nextTick(function(){
      $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
      var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
      $('.ivu-table-tip td').html(noData)
    })
    if(this.$props.params.verify == 'verify'){
      clearTimeout(settime)
      var settime = setTimeout(() => {
        this.refreshDatas(this.$props.params.nature1,this.$props.params.nature2,this.$props.params.nature3)

      }, 200);

    }
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
    refreshDatas(nature1,nature2,nature3){
      let that = this;
      that.table.loading = true;

      let params = {};
      params.page = this.table.pager.current;
      params.limit = this.table.pager.limit;
      params.query='treatmentMethod='+nature2+'&isFatal='+nature3+'&complaintState=9&productId='+nature1;
      this.$http.get("/customer/complaint",{params:params}).then(function (resp){
        that.table.data = resp.data;
        that.table.pager.total = resp.pagerInfo.total;
        let rowCount =  resp.data? resp.data.length:10;
        that.table.pager.rows = Math.max(rowCount,6);
        that.table.loading = false;
        that.$store.commit('RENDER_CHANGE',false);
      })
    },
    reset(){
      this.table.selected='';
      this.search.dates=[];
      this.search.isInternal='';
      this.search.treatmentMethod='';
      this.search.status='';
      this.search.fieldName='';
      this.search.query='';
      this.refreshData(1);
      this.pageChange(1);
    },
    exportStatement (index){
      //console.log(index,'index');
      let url ='';
      let  methods = 'get'
      let params = {}; //搜索条件
      if(index == 1){
        url = '/customer/complaint/export/list';
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
      }
      if(index == 3){
        url = '/customer/complaint/export/list';
        params.page = 1;
        params.limit = this.table.pager.total;
        params.query = this.search.query;
      }
      if(index == 2){
        url = '/customer/complaint/export/report'
        let reviewList=this.$refs.pageTable.getSelection()
        if( reviewList.length != 1){
          this.$Notice.warning({
              title: i18n.t('customer.exportChooseOne'),
          });
          return;
        }
        params.complaintId = reviewList[0].complaintId
      }

      this.$iqis.download(url,params,methods,()=>{}) //下载文件
    },
    refreshData(){
      let that =this;
      that.table.loading = true;

      let params = {};
      let startDate = '';
      let endDate = '';
      params.page = this.table.pager.current;
      params.limit = this.table.pager.limit;
      if(this.search.dates && this.search.dates[0]){
        startDate = this.$iqis.utils.getDayStart(1,this.search.dates[0]);
        endDate = this.$iqis.utils.getDayEnd(this.search.dates[1]);
        params.query='startDate='+startDate+'&endDate='+endDate+'&isInternal='+that.search.isInternal+'&treatmentMethod='+that.search.treatmentMethod+'&complaintState='+that.search.status+'&field='+that.search.fieldName+'&keyword='+that.search.query;
      }else{
        params.query='isInternal='+that.search.isInternal+'&treatmentMethod='+that.search.treatmentMethod+'&complaintState='+that.search.status+'&field='+that.search.fieldName+'&keyword='+that.search.query;
      }

      this.$http.get("/customer/complaint",{params:params}).then(function (resp) {
        //console.log(resp)
        that.table.data = resp.data;
        that.table.loading = false;
        that.table.pager.total = resp.pagerInfo.total;
        let rowCount =  resp.data? resp.data.length:10;
        that.table.pager.rows = Math.max(rowCount,6);
        that.$store.commit('RENDER_CHANGE',false);
      })
    },
    deleteThis(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            if (ss[i].isInternal == 0){
              this.$Notice.warning({
                title: i18n.t('customer.complaintDelete'),
                desc: ''
              });
              return;
            }
            delArr.push(this.$http.delete("/customer/complaint/"+ss[i].complaintId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('customer.deleteSuccess'));
              that.reset();
            });
          }
        }
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
    tableSelectChange(selection){
      this.table.selected = selection && selection.length > 0;
      if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
    },
    addComplain(){
      this.$emit("open-tab","customer-customer-complaint-add",i18n.t('customer.addComplaint'),"page-customer-complaint-add",null);
    },
    editComplain(){
      let selectedRow = this.$refs.pageTable.getSelection()
      // //console.log(selectedRow)
      if(!selectedRow || selectedRow.length != 1){
        this.$Notice.warning({
          title: i18n.t("quality.cbm"),
          desc: ''
        });
        return;
      }else{
        if(selectedRow[0].productName){
          this.$emit("open-tab","customer-customer-complaint-edit-"+selectedRow[0].complaintId,i18n.t('customer.editComplaint')+"-"+selectedRow[0].productName,"page-customer-complaint-add",{complaintId:selectedRow[0].complaintId});
        }else{
          this.$emit("open-tab","customer-customer-complaint-edit-"+selectedRow[0].complaintId,i18n.t('customer.editComplaint')+"-","page-customer-complaint-add",{complaintId:selectedRow[0].complaintId});
        }
      }
    },
    onDBClick(o,i){
      if(o.productName){
        this.$emit("open-tab","customer-customer-complaint-edit-"+o.complaintId,i18n.t('customer.editComplaint')+"-"+o.productName,"page-customer-complaint-add",{complaintId:o.complaintId});
      }else{
        this.$emit("open-tab","customer-customer-complaint-edit-"+o.complaintId,i18n.t('customer.editComplaint')+"-","page-customer-complaint-add",{complaintId:o.complaintId});
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
