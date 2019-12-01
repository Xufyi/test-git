<template>
  <div class="iqis-page">
    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">
          <div class="iqis-page-search-row">
            <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
              <DatePicker v-model="search.dates" type="daterange" :placeholder="i18n.t('statistical.dateFilter')" style="width: 210px"></DatePicker>
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
              <Button type="ghost" v-if="permsBtn.INSERT_GRR" icon="plus" @click="addGRR">{{$t('statistical.add')}}</Button>
              <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.UPDATE_GRR" icon="edit" :disabled="tableEditDis" @click="editGRR">{{$t('statistical.edit')}}</Button>
              <Poptip @on-ok="deleteGRR" :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" confirm :title="i18n.t('statistical.confirmDelete')" placement="bottom-start">
                <Button v-if="permsBtn.DELETE_GRR" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t('statistical.delete')}}</Button>
              </Poptip>
              <Button :disabled="tableEditDis" style="margin:0 8px;" type="ghost" v-if="permsBtn.QUERY_GRR" @click="seeChart">{{$t('statistical.viewChart')}}</Button>

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
      search: {
        query: "",
        fieldName: "",
        dates:[],
        data: {
          searchTypes: [
            {label: i18n.t('statistical.search'),value: ""}, 
            {label: i18n.t('statistical.analNo'),value: "no"}, 
            {label: i18n.t('statistical.chkDevNo'),value: "chkDevNo"}, 
            {label: i18n.t('statistical.chkDevName'),value: "chkDevName"}, 
            {label: i18n.t('statistical.prodProcess'),value: "prodProcessName"}, 
            {label: "GRR",value: "grr"}, 
            {label: "ndc",value: "ndc"}, 
            {label: "GRR"+i18n.t('statistical.judge'),value: "grrResult"}, 
            {label: "ndc"+i18n.t('statistical.judge'),value: "ndcResult"}, 
            {label: i18n.t('statistical.overallJudge'),value: "overallResult"}, 
            {label: i18n.t('statistical.measUserNum'),value: "measUserNum"}, 
            {label: i18n.t('statistical.productNum'),value: "productNum"}, 
            {label: i18n.t('statistical.measNum'),value: "measNum"}, 
            {label: i18n.t('statistical.analysisRemarks'),value: "remarks"}, 
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
            title: i18n.t('statistical.analTime'),
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
            title: i18n.t('statistical.analNo'),
            className:'tablePadding',
            width:110,
            minWidth:110,
            ellipsis:true,              
            key: 'no'
          },
          {
            title:i18n.t('statistical.chkDevNo'),
            width:110,
            minWidth:110,
            className:'tablePadding',
            ellipsis:true,              
            key: 'chkDevNo'
          },
          {
            title: i18n.t('statistical.chkDevName'),
            width:110,
            minWidth:110,
            className:'tablePadding',
            ellipsis:true,              
            key: 'chkDevName'
          },
          {
            title: i18n.t('statistical.prodProcess'),
            width:110,
            minWidth:110,
            className:'tablePadding',
            ellipsis:true,              
            key: 'prodProcessName'
          },
          {
            title: "GRR",
            width:90,
            minWidth:90,
            className:'tablePadding',
            ellipsis:true,              
            key: 'grrAnalysisResultDto.grr',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: "ndc",
            width:90,
            minWidth:90,
            className:'tablePadding',
            ellipsis:true,              
            key: 'grrAnalysisResultDto.ndc',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: "GRR"+i18n.t('statistical.judge'),
            minWidth:75,
            className:'tablePadding',
            ellipsis:true,              
            key: 'grrAnalysisResultDto',
            render:(h, params)=>{
              let text = ''
              if(params.row.grrAnalysisResultDto){
                if(params.row.grrAnalysisResultDto.grrResult==0){
                  text = i18n.t('statistical.acceptable')
                }else if(params.row.grrAnalysisResultDto.grrResult==1){
                  text = i18n.t('statistical.acceptReluctantly')
                }else{
                  text= i18n.t('statistical.unacceptable')
                }
                return h('span',text)
              }
            }
          },
          {
            title:"ndc"+i18n.t('statistical.judge'),
            className:'tablePadding',            
            minWidth:75,
            ellipsis:true,              
            key: 'grrAnalysisResultDto.ndcResult',
            render:(h, params)=>{
              let text = ''
              if(params.row.grrAnalysisResultDto){
                if(params.row.grrAnalysisResultDto.ndcResult==0){
                  text = i18n.t('statistical.acceptable')
                }else{
                  text= i18n.t('statistical.unacceptable')
                }
                return h('span',text)
              }
            }
          },
          {
            title: i18n.t('statistical.overallJudge'),
            className:'tablePadding',
            minWidth:75,
            ellipsis:true,              
            key: 'grrAnalysisResultDto.overallResult', 
            render:(h, params)=>{
              let text = ''
              if(params.row.grrAnalysisResultDto){
                if(params.row.grrAnalysisResultDto.overallResult==0){
                  text = i18n.t('statistical.acceptable')
                }else if(params.row.grrAnalysisResultDto.overallResult==1){
                  text =  i18n.t('statistical.acceptReluctantly')
                }else{
                  text= i18n.t('statistical.unacceptable')
                }
                return h('span',text)
              }
            }
          },
          {
            title: i18n.t('statistical.measUserNum'),
            className:'tablePadding',
            minWidth:75,
            ellipsis:true,              
            key: 'measUserNum'
          },
          {
            title: i18n.t('statistical.productNum'),
            className:'tablePadding',
            minWidth:75,
            ellipsis:true,              
            key: 'productNum'
          },
          {
            title: i18n.t('statistical.measNum'),
            className:'tablePadding',
            minWidth:75,
            ellipsis:true,              
            key: 'measNum'
          },
          {
            title: i18n.t('statistical.analysisRemarks'),
            className:'tablePadding',
            width:120,
            minWidth:120,
            ellipsis:true,              
            key: 'remarks'
          },
        ]
      },
      permsCur:[
        "INSERT_GRR",
        "SELECT_GRR",
        "UPDATE_GRR",
        "DELETE_GRR",
        "QUERY_GRR",
      ],
      permsBtn:{
        "DELETE_GRR":false,
        "SELECT_GRR":false,
        "UPDATE_GRR":false,
        "INSERT_GRR":false,
        "QUERY_GRR":false,
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
        params.query='startDate='+startDate+'&endDate='+endDate+'&field='+that.search.fieldName+'&keyword='+that.search.query;
      }else{
        params.query='field='+that.search.fieldName+'&keyword='+that.search.query;
      }

      this.$http.get("/basic/grr",{params:params}).then(function (resp) {
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
    addGRR(){
      this.$emit("open-tab","msa-grr-add",i18n.t('statistical.addGrr'),"page-statistic-msa-grr-add",null)
    },
    editGRR(){
      let selectedRow = this.$refs.pageTable.getSelection()
      this.$emit("open-tab","msa-grr-add-"+selectedRow[0].grrId,i18n.t('statistical.editGrr')+"-"+selectedRow[0].productName,"page-statistic-msa-grr-add",{grrId:selectedRow[0].grrId});
    },
    onDBClick(obj){
      this.$emit("open-tab","msa-grr-add-"+obj.grrId,i18n.t('statistical.editGrr')+"-"+obj.productName,"page-statistic-msa-grr-add",{grrId:obj.grrId});
    },
    seeChart(){
      let selectedRow = this.$refs.pageTable.getSelection()
      if(!selectedRow[0].grrAnalysisResultDto){
        this.$Notice.warning({title:i18n.t('statistical.fillInfo')})
        return;
      }
      this.$emit("open-tab","msa-grr-chart-"+selectedRow[0].grrId,i18n.t('statistical.grrChart'),"page-statistic-msa-grr-chart",{grrId:selectedRow[0].grrId});
    },
    deleteGRR(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/basic/grr/"+ss[i].grrId));
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