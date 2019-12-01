<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
          <Date-picker type="daterange" format="yyyy-MM-dd" v-model="search.maintainTime" :placeholder="i18n.t('chkdev.chooseHistMaintTime')" style="width: 210px"></Date-picker>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
          <Date-picker type="daterange" format="yyyy-MM-dd" v-model="search.planTime" :placeholder="i18n.t('chkdev.choosePlanMaintTime')" style="width: 210px"></Date-picker>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model.trim="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('chkdev.searchAll')" slot="prepend" style="width: 110px;text-align: left">
            <Option v-for="st in search.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:0 0 280px;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="refreshData('search')">{{$t('chkdev.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t('chkdev.reset')}}</Button>
      </div>
      <div style="flex:1" class="iqis-page-search-bar-item">
        <Button type="text" style="color: #4896E4;float:right" icon="refresh" @click="reset">{{$t('chkdev.refreshData')}}</Button>
      </div>
      
    </div>
    <div class="iqis-page-context" style="margin-top:10px;">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table ref="pageTable"  class="tableCustom" v-drag-table-column="table.columns" :loading="table.loading" border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display:inline-block;"> -->
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



  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import draggable from 'vuedraggable';
  import $ from 'jquery'
  export default {
    components: {
      Input,draggable
    },
    props:["params"],
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        search: {
          query: "",
          fieldName: "",
          maintainTime:[],
          planTime:[],
          searchTypes: [
            {
              label: i18n.t('chkdev.searchAll'),
              value: ""
            }, {
              label: i18n.t('chkdev.deviceCode'),
              value: "chkDevNo"
            }, {
              label: i18n.t('chkdev.deviceName'),
              value: "chkDevName"
            },  {
              label: i18n.t('chkdev.spec'),
              value: "chkDevSpec"
            },  {
              label: i18n.t('chkdev.chkca'),
              value: "chkDevTypeName"
            },  {
              label: i18n.t('chkdev.maintResult'),
              value: "result"
            },  {
              label: i18n.t('chkdev.maintPeriod'),
              value: "maintainPeriod"
            },  {
              label: i18n.t('chkdev.operator'),
              value: "operatorName"
            },  {
              label: i18n.t('chkdev.maintExplain'),
              value: "maintainExplain"
            },  
          ]
        },
        data:[],
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
              title: i18n.t('chkdev.thisMaintTime'),
              className:'tablePadding',
              width:106,
              minWidth:106,
              ellipsis:true,
              key: 'maintainTime',
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
              title: i18n.t('chkdev.planMaintTime'),
              className:'tablePadding',
              width:106,
              minWidth:106,
              ellipsis:true,
              key: 'planTime',
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
              title: i18n.t('chkdev.deviceCode'),
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'chkDevNo'
            },{
              title: i18n.t('chkdev.deviceName'),
              width:106,
              minWidth:106,
              className:'tablePadding',
              ellipsis:true,
              key: 'chkDevName'
            },{
              title: i18n.t('chkdev.spec'),
              width:106,
              minWidth:106,
              className:'tablePadding',
              ellipsis:true,
              key: 'chkDevSpec'
            },{
              title: i18n.t('chkdev.chkca'),
              width:106,
              minWidth:106,
              className:'tablePadding',
              ellipsis:true,
              key: 'chkDevTypeName'
            },{
              title: i18n.t('chkdev.maintResult'),
              className:'tablePadding',
              minWidth:80,
              ellipsis:true,
              key: 'result',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{
                0:"<span style='color:green'>"+i18n.t('chkdev.qualified')+"</span>",
                1:"<span style='color:orange'>"+i18n.t('chkdev.repair')+"</span>"
              })
            },{
              title:i18n.t('chkdev.maintPeriod'),
              className:'tablePadding',
              minWidth:80,
              align: 'center',
              ellipsis:true,
              key: 'maintainPeriod',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{1:"1"+i18n.t('chkdev.month'),3:"3"+i18n.t('chkdev.month'),6:"6"+i18n.t('chkdev.month'),12:"12"+i18n.t('chkdev.month')})
            },{
              title: i18n.t('chkdev.operator'),
              className:'tablePadding',
              width:110,
              minWidth:110,
              ellipsis:true,
              key: 'operatorName'
            },{
              title: i18n.t('chkdev.maintExplain'),
              className:'tablePadding',
              width:140,
              minWidth:140,
              ellipsis:true,
              key: 'maintainExplain'
            }
          ]
        },
        permsCur:[
          "DELETE_SUPPLIER_SCORE",
          "INSERT_SUPPLIER_SCORE",
          "UPDATE_SUPPLIER_SCORE",
          "SELECT_SUPPLIER_SCORE",

        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "DELETE_SUPPLIER_SCORE":false,
          "INSERT_SUPPLIER_SCORE":false,
          "UPDATE_SUPPLIER_SCORE":false,
          "SELECT_SUPPLIER_SCORE":false,
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
    methods:{
      refreshData(type){
        let that = this;
        that.table.loading = true;
        let params = {};
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        let startmaintainTime = ''
        let endmaintainTime = ''
        let startPlanTime = ''
        let endPlanTime = ''
        let date1=that.search.maintainTime;
        if(date1[0] !=undefined&&date1[0] !=''){
          startmaintainTime= (new Date(date1[0])).getTime();
          endmaintainTime=(new Date(date1[1])).getTime();
        }
        let date2=that.search.planTime;
        if(date2[0] !=undefined&&date2[0] !=''){
          startPlanTime= (new Date(date2[0])).getTime();
          endPlanTime=(new Date(date2[1])).getTime();
        }
        let chkDevId = that.$props.params && that.$props.params.chkDevId
        params.query = 'isHistory=1'+
                      '&startmaintainTime='+startmaintainTime+
                      '&endmaintainTime='+endmaintainTime+
                      '&startPlanTime='+startPlanTime+
                      '&endPlanTime='+endPlanTime+
                      '&field='+that.search.fieldName+
                      '&keyword='+that.search.query
        if(chkDevId&&type!='search'){params.query = params.query + '&chkDevId='+chkDevId}  
        that.$http.get("/basic/chkdev/maintainPlan",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
        })
      },
      reset(){
        this.table.selected='';
        this.search.fieldName='';
        this.search.query='';
        this.search.maintainTime=[];
        this.search.planTime=[];
        this.tableEditDis=true;
        this.refreshData(1);
        this.pageChange(1)
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
      
      
    }//end methods




  }

</script>
<style>
.bbb{
  font-size:16px;
  font-weight: bold;
  color:#797979;
}
.aaa{
    background: rgba(247, 247, 247, 1);
    padding: 15px 0;
}
.aaa .ivu-col{
  margin-bottom:10px;
}
</style>
