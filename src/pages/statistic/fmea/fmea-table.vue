<template>
  <div class="iqis-page">
    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">
          <div class="iqis-page-search-row">
            <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
              <DatePicker v-model="search.dates" type="daterange" :placeholder="i18n.t('statistical.dateFilter')" style="width: 210px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
              <Select v-model="search.analysisType" :placeholder="i18n.t('statistical.analysisType')" clearable style="width: 100px;">
                <Option value="process">{{$t("statistical.processProject")}}</Option>
                <Option value="design">{{$t("statistical.designProject")}}</Option>
              </Select>
            </div>
            <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
              <Select v-model="search.auditState" :placeholder="i18n.t('statistical.auditState')" clearable style="width: 100px;">
                <Option :value="0">{{$t("statistical.unsubmit")}}</Option>
                <Option :value="1">{{$t("statistical.unaudited")}}</Option>
                <Option :value="2">{{$t("statistical.approvePass")}}</Option>
                <Option :value="3">{{$t("statistical.auditReject")}}</Option>
              </Select>
            </div>
            <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
              <Select v-model="search.approvalState" :placeholder="i18n.t('statistical.approvalState')" clearable style="width: 100px;">
                <Option :value="0">{{$t("statistical.notLaunched")}}</Option>
                <Option :value="1">{{$t("statistical.approving")}}</Option>
                <Option :value="2">{{$t("statistical.approvePass")}}</Option>
              </Select>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('statistical.searchAll')" slot="prepend" style="width: 110px;text-align: left">
                  <Option v-for="(st,index) in search.data.searchTypes" :key="index" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:1;padding-left: 8px; font-size:0;">
              <Button style="margin-right:8px;" type="primary" @click="refreshData">{{$t('statistical.search')}}</Button>
              <Button type="ghost" @click="reset">{{$t('statistical.reset')}}</Button></div>
          </div>
          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <Button type="ghost" v-if="permsBtn.INSERT_FMEA_ANALYSIS_TABLE" icon="plus" @click="addItem">{{$t('statistical.add')}}</Button>
              <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.UPDATE_FMEA_ANALYSIS_TABLE" icon="edit" :disabled="tableEditDis" @click="editItem">{{$t("statistical.update")}}</Button>
              <Poptip @on-ok="deleteItem" :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" confirm :title="i18n.t('statistical.confirmDelete')" placement="bottom-start">
                <Button v-if="permsBtn.DELETE_FMEA_ANALYSIS_TABLE" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t('statistical.delete')}}</Button>
              </Poptip>
              <Button :disabled="!table.selected"  icon="android-list" style="margin:0 8px;" type="ghost" v-if="permsBtn.AUDIT_FMEA_ANALYSIS_TABLE" @click="auditShow=true">{{$t("statistical.audit")}}</Button>

            </div>
            <div class="iqis-page-tool-second">
              <Button type="text"  icon="refresh" @click="reset">{{$t('statistical.refreshData')}}</Button>
            </div>
          </div>
          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" :height="430" v-drag-table-column="table.columns" :loading="table.loading"  border stripe :columns="table.columns" :data="table.data" @on-selection-change="tableSelectChange"></Table>
          <div style="padding: 20px 0 20px 0px;">
            <Page v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                  :page-size-opts="[10,20,50,100]"
                  @on-change="pageChange" @on-page-size-change="pageSizeChange"
                  size="small" show-total show-elevator show-sizer></Page>
          </div>
        </div>
      </div>
    </div>
    <Modal
      :title="i18n.t('iqc.audit')"
      v-model="auditShow"
      :mask-closable="false"
      :width="300" >
        <Select v-model="auditPass" style="width:200px">
           <Option :value="1" >{{$t("statistical.auditPass")}}</Option>
           <Option :value="0" >{{$t("statistical.auditReject")}}</Option>
        </Select>
        <div slot="footer">
        <Button type="primary" size="large" @click="auditOk">{{$t('iqc.confirm')}}</Button>
        <Button type="text" size="large" @click="auditShow=false">{{$t('iqc.cancel')}}</Button>
      </div>
      </Modal>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  data:function() {
    let vm = this;
    return {
      i18n:window.i18n,
      headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
      tableEditDis:true,
      auditShow:false,
      auditPass:1,
      search: {
        query: "",
        fieldName: "",
        analysisType:"",
        dates:[],
        auditState:"",
        approvalState:"",
        data: {
          searchTypes: [
            {label: i18n.t('statistical.search'),value: ""}, 
            {label: i18n.t("statistical.version"),value: "version"}, 
            {label: i18n.t("statistical.analysisNo"),value: "no"}, 
            {label: i18n.t("statistical.analTheme"),value: "theme"}, 
            {label: i18n.t("statistical.productNo"),value: "productNo"}, 
            {label: i18n.t("statistical.productName"),value: "productName"}, 
            {label: i18n.t("statistical.productSpec"),value: "productSpec"}, 
            {label: i18n.t("statistical.analysisPeople"),value: "analysisUserName"}, 
            {label: i18n.t("statistical.remarks"),value: "remarks"}, 
          ]
        }
      },
      table: {
        loading:true,
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
          {
            type: 'selection',
            align: 'center',
            width:40,
            minWidth: 40,
            // maxWidth: 40
          },
          {
            title: i18n.t("statistical.analTime"),
            className:'tablePadding',          
            width:110,
            minWidth:110,
            ellipsis:true,              
            key: 'analysisTime',
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
            title: i18n.t("statistical.version"),
            className:'tablePadding',
            width:110,
            minWidth:110,
            ellipsis:true,              
            key: 'version'
          },
          {
            title: i18n.t("statistical.analysisNo"),
            className:'tablePadding',
            width:110,
            minWidth:110,
            ellipsis:true,              
            key: 'no'
          },
          {
            title:i18n.t("statistical.analTheme"),
            width:110,
            minWidth:110,
            className:'tablePadding',
            ellipsis:true,              
            key: 'theme'
          },
          {
            title: i18n.t("statistical.analysisType"),
            width:110,
            minWidth:110,
            className:'tablePadding',
            ellipsis:true,              
            key: 'analysisType',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{'process':i18n.t("statistical.processProject"),'design':i18n.t("statistical.designProject")})

          },
          {
            title: i18n.t("statistical.productNo"),
            width:110,
            minWidth:110,
            className:'tablePadding',
            ellipsis:true,              
            key: 'productNo'
          },
          {
            title: i18n.t("statistical.productName"),
            width:90,
            minWidth:90,
            className:'tablePadding',
            ellipsis:true,              
            key: 'productName',
          },
          {
            title: i18n.t("statistical.productSpec"),
            width:90,
            minWidth:90,
            className:'tablePadding',
            ellipsis:true,              
            key: 'productSpec',
          },
          {
            title: i18n.t("statistical.auditState"),
            minWidth:75,
            className:'tablePadding',
            ellipsis:true,              
            key: 'auditState',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t("statistical.unsubmit"),1:i18n.t("statistical.unaudited"),2:"<span style='color:green'>"+i18n.t("statistical.auditPass")+"</span>",3:"<span style='color:red'>"+i18n.t("statistical.auditReject")+"</span>"})
          },
          {
            title:i18n.t("statistical.auditReject"),
            className:'tablePadding',            
            minWidth:75,
            ellipsis:true,              
            key: 'approvalState',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t("statistical.notLaunched"),1:i18n.t("statistical.approving"),2:"<span style='color:green'>"+i18n.t("statistical.approvePass")+"</span>"})
          },
          {
            title: i18n.t("statistical.analysisPeople"),
            className:'tablePadding',
            minWidth:75,
            ellipsis:true,              
            key: 'analysisUserName',
          },
          {
            title: i18n.t("statistical.remarks"),
            className:'tablePadding',
            minWidth:75,
            ellipsis:true,              
            key: 'remarks'
          },
        ]
      },
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
  //end data
  created() {
    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.refreshData();
    this.$nextTick(function(){
      $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
      var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
      $('.ivu-table-tip td').html(noData)
    })
  },
  methods:{
    reset(){
      this.search.dates=[];
      this.table.selected='';
      this.search.analysisType='';
      this.search.auditState='';
      this.search.approvalState='';
      this.search.query='';
      this.search.fieldName='';
      this.pageChange(1);
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
        params.query='startDate='+startDate+'&endDate='+endDate+'&analysisType='+that.search.analysisType+'&auditState='+that.search.auditState+'&approvalState='+that.search.approvalState+'&field='+that.search.fieldName+'&keyword='+that.search.query;
      }else{
        params.query='analysisType='+that.search.analysisType+'&auditState='+that.search.auditState+'&approvalState='+that.search.approvalState+'&field='+that.search.fieldName+'&keyword='+that.search.query;
      }

      this.$http.get("/fmea/analysisTable",{params:params}).then(function (resp) {
        that.table.data = resp.data;
        that.table.loading = false;
        that.table.pager.total = resp.pagerInfo.total;
        let rowCount =  resp.data? resp.data.length:10;
        that.table.pager.rows = Math.max(rowCount,6);
      })
    },
    tableSelectChange(selection){
      this.table.selected = selection && selection.length > 0;
      if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
    },
    addItem(){
      this.$emit("open-tab","fmea-table-add",i18n.t("statistical.AddAnAnalysisForm"),"page-statistic-fmea-table-add",null)
    },
    editItem(){
      let selectedRow = this.$refs.pageTable.getSelection()
      this.$emit("open-tab","fmea-table-add-"+selectedRow[0].analysisId,i18n.t("statistical.ModifyAnalysisForm")+"-"+selectedRow[0].productName,"page-statistic-fmea-table-add",{analysisId:selectedRow[0].analysisId});
    },
    onDBClick(obj){
      this.$emit("open-tab","fmea-table-add-"+obj.analysisId,i18n.t("statistical.ModifyAnalysisForm")+"-"+obj.productName,"page-statistic-fmea-table-add",{analysisId:obj.analysisId});
    },
    auditOk(){
      let that=this;
      let url='/fmea/applyAudit/analysisTable/'
      let AuditRwo=this.$refs.pageTable.getSelection()
      for(let i=0;i<AuditRwo.length;i++){
        that.$http.post(url+AuditRwo[i].analysisId+"?state="+that.auditPass).then((res)=>{
        that.$Message.success(i18n.t('iqc.auditSuccess'));
        that.auditShow=false;
        that.refreshData();
        })
      }
    },
    deleteItem(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/fmea/analysisTable/"+ss[i].analysisId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('statistical.deleteSuccess'));
              that.reset();
            });
          }
        }
    },
  }
}
</script>