<template>
  <div class="iqis-page">
    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">
          <div class="iqis-page-search-row">
            <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
              <DatePicker v-model="search.dates" type="daterange" :placeholder="i18n.t('chkdev.dateFilter')" style="width: 210px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
              <Select v-model="search.repairResult" :placeholder="i18n.t('chkdev.repairResult')" clearable style="width: 100px;">
                <Option v-for="st in search.repairResultList" :key="st.value" :value="st.value">{{st.label}}</Option>
              </Select>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('chkdev.searchAll')" slot="prepend" style="width: 110px;text-align: left">
                  <Option v-for="st in search.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            
            <div class="iqis-page-search-bar-item" style="flex:1;padding-left: 8px; font-size:0;">
              <Button style="margin-right:8px;" type="primary" @click="refreshData">{{$t('chkdev.search')}}</Button>
              <Button type="ghost" @click="reset">{{$t('chkdev.reset')}}</Button></div>
          </div>
          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <Button type="ghost" v-if="permsBtn.INSERT_REPAIRRECORD" icon="plus" @click="addRecord">{{$t('chkdev.add')}}</Button>
              <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.UPDATE_REPAIRRECORD" :disabled="tableEditDis" icon="edit" @click="editRecord">{{$t('chkdev.modify')}}</Button>
              <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" confirm :title="i18n.t('chkdev.confirmDelete')" placement="bottom-start" @on-ok="deleteRecord">
                <Button v-if="permsBtn.DELETE_REPAIRRECORD" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t('chkdev.delete')}}</Button>
              </Poptip>
            </div>
            <div class="iqis-page-tool-second">
              <Button type="text"  icon="refresh" @click="reset">{{$t('chkdev.refreshData')}}</Button>
              <!-- <Button type="primary" @click="rank">自定义列表</Button> -->
              <!-- <Button type="ghost" icon="share">导出报表</Button> -->
            </div>
          </div>
          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" highlight-row :height="430" border stripe  v-drag-table-column="table.columns" :columns="table.columns" :loading="table.loading" :data="table.data" @on-selection-change="tableSelectChange"></Table>
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
        repairResult:'',
        repairResultList:[
          {value:0,label:i18n.t('chkdev.qualified')},
          {value:1,label:i18n.t('chkdev.scrap')},
        ],
        dates:[],
          searchTypes: [
            {label: i18n.t('chkdev.searchAll'),value: ""},
            {label: i18n.t('chkdev.repairNo'),value: "repairNo"},
            {label: i18n.t('chkdev.deviceCode'),value: "chkDevNo"},
            {label: i18n.t('chkdev.deviceName'),value: "chkDevName"},
            {label: i18n.t('chkdev.spec'),value: "chkDevSpec"},
            {label: i18n.t('chkdev.faultDescription'),value: "faultDescription"},
            {label: i18n.t('chkdev.causeAnalsis'),value: "causeAnalsis"},
            {label: i18n.t('chkdev.repairRecord'),value: "repairRecord"},
            {label: i18n.t('chkdev.repairMan'),value: "repairUserName"},
          ]
      },
      table: {
        loading:true,
        selected:false,
        pager: {
          rows: 10,
          need: true,
          total: 100,
          limit: 10,
          current: 1,
        },
        data: [
        ],
        columns: [
          {
            type: 'selection',
            align: 'center',
            width:40,
            minWidth: 40,
            maxWidth: 40
          },
          {
            title: i18n.t('chkdev.repairTime'),
            className:'tablePadding',
            width:106,
            minWidth:106,
            ellipsis:true,
            key: 'repairTime',
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
            title: i18n.t('chkdev.repairNo'),
            className:'tablePadding',
            width:120,
            minWidth:120,
            ellipsis:true,
            key: 'repairNo'
          },
          {
            title: i18n.t('chkdev.deviceCode'),
            className:'tablePadding',
            width:120,
            minWidth:120,
            ellipsis:true,
            key: 'chkDevNo',
          },
          {
            title: i18n.t('chkdev.deviceName'),
            className:'tablePadding',
            width:120,
            minWidth:120,
            ellipsis:true,
            key: 'chkDevName'
          },
          {
            title: i18n.t('chkdev.spec'),
            className:'tablePadding',
            width:120,
            minWidth:120,
            ellipsis:true,
            key: 'chkDevSpec',
          },
          {
            title: i18n.t('chkdev.repairResult'),
            className:'tablePadding',
            minWidth:80,
            ellipsis:true,
            key: 'repairResult',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{
                0:"<span style='color:green'>合格</span>",
                1:"<span style='color:red'>报废</span>"
            })

          },
          {
            title: i18n.t('chkdev.faultDescription'),
            minWidth:140,
            className:'tablePadding',
            ellipsis:true,
            key: 'faultDescription'
          },
          {
            title: i18n.t('chkdev.causeAnalsis'),
            minWidth:140,
            className:'tablePadding',
            ellipsis:true,
            key: 'causeAnalsis'
          },
          {
            title: i18n.t('chkdev.repairRecord'),
            className:'tablePadding',
            minWidth:140,            
            ellipsis:true,
            key: 'repairRecord'
          },
          {
            title: i18n.t('chkdev.repairMan'),
            className:'tablePadding',
            width:100,
            minWidth:100,
            ellipsis:true,
            key: 'repairUserName'
          },
        ]
      },
      permsCur:[
        "SELECT_REPAIRRECORD",
        "UPDATE_REPAIRRECORD",
        "DELETE_REPAIRRECORD",
        "INSERT_REPAIRRECORD",
      ],
      permsBtn:{
        "DELETE_REPAIRRECORD":false,
        "SELECT_REPAIRRECORD":false,
        "UPDATE_REPAIRRECORD":false,
        "INSERT_REPAIRRECORD":false,
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
      this.search.repairResult = ''
      this.table.selected='';
      this.search.query='';
      this.search.fieldName='';
      this.refreshData();
      this.pageChange(1);
    },
    tableSelectChange(selection){
      this.table.selected = selection && selection.length > 0;
      if(selection.length!=1){
        this.tableEditDis=true;
      }else{
        this.tableEditDis=false;
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
        params.query='startDate='+startDate+'&endDate='+endDate+'&repairResult='+that.search.repairResult+'&field='+that.search.fieldName+'&keyword='+that.search.query;
      }else{
        params.query='repairResult='+that.search.repairResult+'&field='+that.search.fieldName+'&keyword='+that.search.query;
      }

      this.$http.get("/basic/repairRecord",{params:params}).then(function (resp) {
        that.table.data = resp.data;
        that.table.loading = false;
        that.table.pager.total = resp.pagerInfo.total;
        let rowCount =  resp.data? resp.data.length:10;
        that.table.pager.rows = Math.max(rowCount,6);
      })
    },
    addRecord(){
        this.$emit("open-tab","device-manage-repair-add",i18n.t('chkdev.addRepairRecord'),"page-device-manage-repair-add",null);
    },
    editRecord(){
        let selectedRow = this.$refs.pageTable.getSelection()     
        this.$emit("open-tab","device-manage-repair-add-"+selectedRow[0].repairRecordId,i18n.t('chkdev.editRepairRecord')+"-"+selectedRow[0].chkDevName,"page-device-manage-repair-add",{repairRecordId:selectedRow[0].repairRecordId});
    },
    onDBClick(obj,index){
        this.$emit("open-tab","device-manage-repair-add-"+obj.repairRecordId,i18n.t('chkdev.editRepairRecord')+"-"+obj.chkDevName,"page-device-manage-repair-add",{repairRecordId:obj.repairRecordId});
    },
    deleteRecord(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/basic/repairRecord/"+ss[i].repairRecordId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('chkdev.deleteSuccess'));
              that.reset();
            });
          }
        }

    },
    save(){
      let that = this;
    },
  }
}
</script>
