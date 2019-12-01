<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
          <Date-picker type="daterange" format="yyyy-MM-dd" v-model="search.calibraionTime" :placeholder="i18n.t('chkdev.chooseThisCaliTime')" style="width: 210px"></Date-picker>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
          <Date-picker type="daterange" format="yyyy-MM-dd" v-model="search.planTime" :placeholder="i18n.t('chkdev.choosePlanCaliTime')" style="width: 210px"></Date-picker>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model.trim="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('chkdev.searchAll')" slot="prepend" style="width: 110px;text-align: left">
            <Option v-for="st in search.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="refreshData">{{$t('chkdev.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t('chkdev.reset')}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <Button style="margin:0 8px;" v-if="permsBtn.UPDATE_CALIBRATION" type="ghost" icon="edit" :disabled="tableEditDis" @click="calibrate">{{$t('chkdev.calibrate')}}</Button>
        <Button v-if="permsBtn.QUERY_HISTORY_CALIBRATION" type="ghost" @click="historyRecord">{{$t('chkdev.history')}}</Button>
      </div>
      <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="reset">{{$t('chkdev.refreshData')}}</Button>
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table ref="pageTable"  class="tableCustom" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
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
    <Modal
      :title="i18n.t('chkdev.qualified')"
      v-model="calibraionModal"
      :mask-closable="false"
      :width="900" >
      <Row type="flex" :gutter="40">
        <i-col span="6">{{$t('chkdev.caliResult')}}</i-col>
        <i-col span="6">{{$t('chkdev.thisCaliTime')}}</i-col>
        <i-col span="6">{{$t('chkdev.operator')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="6">
          <Select :disabled="!permsBtn.UPDATE_CALIBRATION" style="width:100%" :placeholder="i18n.t('pleaseChoose')" v-model="editModal.result" filterable>
            <Option v-for="(data,index) in resultList"  :value="data.value" :label="data.label" :key="index"></Option>
          </Select>
        </i-col>
        <i-col span="6">
          <Date-picker :disabled="!permsBtn.UPDATE_CALIBRATION" type="datetime" format="yyyy-MM-dd HH:mm" v-model="editModal.calibraionTime" :placeholder="i18n.t('chkdev.chooseThisCaliTime')" style="width: 100%"></Date-picker>
        </i-col>
        <i-col span="6">
          <Select :disabled="!permsBtn.UPDATE_CALIBRATION" :placeholder="i18n.t('pleaseChoose')" v-model="editModal.operator" filterable style="width:100%">
            <Option v-for="(data,index) in userList"  :value="data.userId" :label="data.name" :key="index"></Option>
          </Select>
        </i-col>
        <i-col>
          <Button type="text" size="large" @click="seeHistory" v-if="permsBtn.QUERY_HISTORY_CALIBRATION">{{$t('chkdev.seeCaliHistory')}}</Button>          
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top:20px">
        <i-col span="24">{{$t('chkdev.caliExplain')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="24">
          <Input :disabled="!permsBtn.UPDATE_CALIBRATION" :placeholder="i18n.t('chkdev.pird')" v-model="editModal.calibraionExplain" type="textarea" :rows="1" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" class="tableTitle" style="margin-top:20px">
        <i-col span="24">{{$t('chkdev.caliPlan')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" class="tableFormat">
        <i-col span="6">{{$t('chkdev.caliPeriod')}}：{{editModal.calibrationPeriod}}{{$t('chkdev.month')}}</i-col>
        <i-col span="6">{{$t('chkdev.caliMethod')}}：{{editModal.calibrationMethod=='1'?i18n.t('chkdev.within'):i18n.t('chkdev.outside')}}</i-col>
        <i-col span="6">{{$t('chkdev.lastCaliResult')}}：
          <span v-if="editModal.preChkCalibrationPlan.result==0">{{$t('chkdev.qualified')}}</span>
          <span v-if="editModal.preChkCalibrationPlan.result==1">{{$t('chkdev.stop')}}</span>
          <span v-if="editModal.preChkCalibrationPlan.result==2">{{$t('chkdev.limitedUse')}}</span>
          </i-col>
        <i-col span="6">{{$t('chkdev.lastCaliTime')}}：{{editModal.preChkCalibrationPlan.calibraionTime?new Date(editModal.preChkCalibrationPlan.calibraionTime).Format("yyyy-M-d h:m"):''}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" class="tableTitle" style="margin-top:20px">
        <i-col span="24">{{$t('chkdev.deviceInfo')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" class="tableFormat">
        <i-col span="6">{{$t('chkdev.deviceCode')}}：{{editModal.chkDev.no}}</i-col>
        <i-col span="6">{{$t('chkdev.deviceName')}}：{{editModal.chkDev.name}}</i-col>
        <i-col span="6">{{$t('chkdev.spec')}}：{{editModal.chkDev.spec}}</i-col>
        <i-col span="6">{{$t('chkdev.deviceParameters')}}：{{editModal.chkDev.param}}</i-col>
        <i-col span="6">{{$t('chkdev.type')}}：{{editModal.chkDev.chkDevTypeName}}</i-col>
        <i-col span="6">{{$t('chkdev.serialNumber')}}：{{editModal.chkDev.factoryNumber}}</i-col>
        <i-col span="12">{{$t('chkdev.label')}}：{{editModal.chkDev.factoryCard}}</i-col>
        <i-col span="6">{{$t('chkdev.department')}}：{{editModal.chkDev.departmentName}}</i-col>
        <i-col span="6">{{$t('chkdev.custodian')}}：{{editModal.chkDev.keeperUserName}}</i-col>
        <i-col span="6">{{$t('chkdev.time')}}：{{new Date(editModal.chkDev.createTime).Format("yyyy-M-d h:m")}}</i-col>
        <i-col span="6">{{$t('chkdev.useState')}}：
          <span v-if="editModal.chkDev.useState==1">{{$t('chkdev.normal')}}</span>
          <span v-if="editModal.chkDev.useState==2">{{$t('chkdev.limitedUse')}}</span>
          <span v-if="editModal.chkDev.useState==3">{{$t('chkdev.notInService')}}</span>
          <span v-if="editModal.chkDev.useState==4">{{$t('chkdev.scrap')}}</span>
          <span v-if="editModal.chkDev.useState==5">{{$t('chkdev.inMmaintenance')}}</span>
          <span v-if="editModal.chkDev.useState==6">{{$t('chkdev.waitRepair')}}</span>
        </i-col>
        <i-col span="24" style="margin-bottom:0;">{{$t('chkdev.remarks')}}：{{editModal.chkDev.remark}}</i-col>
      </Row>
      <div slot="footer">
        <Button v-if="permsBtn.UPDATE_CALIBRATION" type="primary" size="large" @click="saveCalibration()">{{$t('chkdev.confirm')}}</Button>
        <Button type="text" size="large" @click="calibraionModal=false">{{$t('chkdev.cancel')}}</Button>
      </div>
    </Modal>
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
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        editModal:{
          result:null,
          calibraionTime:null,
          operator:null,
          calibraionExplain:null,
          calibrationPeriod:null,
          calibrationMethod:null,
          preChkCalibrationPlan:{
            result:null,
            calibraionTime:null,
          },
          chkDev:{
            no:null,
            name:null,
            spec:null,
            param:null,
            chkDevTypeName:null,
            factoryNumber:null,
            factoryCard:null,
            departmentName:null,
            keeperUserId:null,
            createTime:null,
            useState:null,
            remark:null,
          }
        },
        userList:[],
        resultList:[
          {value:0,label:i18n.t('chkdev.qualified')},
          {value:1,label:i18n.t('chkdev.stop')},
          {value:2,label:i18n.t('chkdev.limitedUse')},
        ],
        tableEditDis:true,
        calibraionModal:false,
        search: {
          query: "",
          fieldName: "",
          calibraionTime:[],
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
              label: i18n.t('chkdev.caliResult'),
              value: "result"
            },  {
              label: i18n.t('chkdev.caliMethod'),
              value: "calibrationMethod"
            },  {
              label: i18n.t('chkdev.caliPeriod'),
              value: "calibrationPeriod"
            },  {
              label: i18n.t('chkdev.operator'),
              value: "operatorName"
            },  {
              label: i18n.t('chkdev.caliExplain'),
              value: "calibraionExplain"
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
              title: i18n.t('chkdev.thisCaliTime'),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'calibraionTime',
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
              title: i18n.t('chkdev.planCaliTime'),
              className:'tablePadding',
              width:103,
              minWidth:103,
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
              width:120,
              minWidth:120,
              className:'tablePadding',
              ellipsis:true,
              key: 'chkDevName'
            },{
              title: i18n.t('chkdev.spec'),
              width:120,
              minWidth:120,
              className:'tablePadding',
              ellipsis:true,
              key: 'chkDevSpec'
            },{
              title: i18n.t('chkdev.chkca'),
              width:120,
              minWidth:120,
              className:'tablePadding',
              ellipsis:true,
              key: 'chkDevTypeName'
            },{
              title: i18n.t('chkdev.caliResult'),
              minWidth:80,
              className:'tablePadding',
              ellipsis:true,
              key: 'result',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{
                0:"<span style='color:green'>"+i18n.t('chkdev.qualified')+"</span>",
                1:"<span style='color:red'>"+i18n.t('chkdev.stop')+"</span>",
                2:"<span style='color:orange'>"+i18n.t('chkdev.limitedUse')+"</span>"
              })
            },{
              title: i18n.t('chkdev.caliMethod'),
              minWidth:80,
              className:'tablePadding',
              ellipsis:true,
              key: 'calibrationMethod',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{"1":i18n.t('chkdev.within'),"0":i18n.t('chkdev.outside')})
            },{
              title:i18n.t('chkdev.caliPeriod'),
              className:'tablePadding',
              minWidth:80,
              align: 'center',
              ellipsis:true,
              key: 'calibrationPeriod',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{1:"1"+i18n.t('chkdev.month'),3:"3"+i18n.t('chkdev.month'),6:"6"+i18n.t('chkdev.month'),12:"12"+i18n.t('chkdev.month')})
            },{
              title: i18n.t('chkdev.operator'),
              className:'tablePadding',
              width:110,
              minWidth:110,
              ellipsis:true,
              key: 'operatorName'
            },{
              title: i18n.t('chkdev.caliExplain'),
              className:'tablePadding',
              width:140,
              minWidth:140,
              ellipsis:true,
              key: 'calibraionExplain'
            }
          ]
        },
        permsCur:[
          "UPDATE_CALIBRATION",
          "SELECT_CALIBRATION",
          "QUERY_HISTORY_CALIBRATION",

        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "UPDATE_CALIBRATION":false,
          "SELECT_CALIBRATION":false,
          "QUERY_HISTORY_CALIBRATION":false,
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
      refreshData(){
        let that = this;
        that.table.loading = true;
        let params = {};
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        let startCalibrationTime = ''
        let endCalibrationTime = ''
        let startPlanTime = ''
        let endPlanTime = ''
        let date1=that.search.calibraionTime;
        if(date1[0] !=undefined&&date1[0] !=''){
          startCalibrationTime= (new Date(date1[0])).getTime();
          endCalibrationTime=(new Date(date1[1])).getTime();
        }
        let date2=that.search.planTime;
        if(date2[0] !=undefined&&date2[0] !=''){
          startPlanTime= (new Date(date2[0])).getTime();
          endPlanTime=(new Date(date2[1])).getTime();
        }
        params.query = 'isHistory=0'+
                      '&startCalibrationTime='+startCalibrationTime+
                      '&endCalibrationTime='+endCalibrationTime+
                      '&startPlanTime='+startPlanTime+
                      '&endPlanTime='+endPlanTime+
                      '&field='+that.search.fieldName+
                      '&keyword='+that.search.query
        that.$http.get("/basic/chkdev/calibrationPlan",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
          that.$http.get("/tenant/user",{params:{limit:99999999}}).then(function (resp) {
            if(resp.data){
              that.userList = resp.data;
            }
          });
        })
      },
      historyRecord(){
        this.$emit("open-tab","device-manage-calibration-history",i18n.t('chkdev.historyCail'),"page-device-manage-calibration-history",null);
      },
      seeHistory(){
        this.calibraionModal=false;
        this.$emit("open-tab","device-manage-calibration-history"+this.editModal.chkDevId,i18n.t('chkdev.historyCail'),"page-device-manage-calibration-history",{chkDevId:this.editModal.chkDevId});
      },
      reset(){
        this.table.selected='';
        this.search.fieldName='';
        this.search.query='';
        this.search.calibraionTime=[];
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
      tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
      },
      calibrate(e){
        let that=this;
        let selectedRow = this.$refs.pageTable.getSelection()
        if(!selectedRow || selectedRow.length != 1){
          return;
        }
        let calibrationPlanId=selectedRow[0].calibrationPlanId
        let url="/basic/chkdev/calibrationPlan/"
        that.$http.get(url+calibrationPlanId).then((res)=>{
          that.calibraionModal=true;
          if(!res.data.preChkCalibrationPlan){
            res.data.preChkCalibrationPlan={
              result:null,
              calibraionTime:null
            }
          }
          res.data.calibraionTime=res.data.calibraionTime?new Date(res.data.calibraionTime):new Date()
          res.data.operator = res.data.operator?res.data.operator:this.$store.state.currentUserId
          that.editModal = res.data
        })
      },
      onDBClick(obj,index){
        let that = this;
        let calibrationPlanId=obj.calibrationPlanId
        let url="/basic/chkdev/calibrationPlan/"
        that.$http.get(url+calibrationPlanId).then((res)=>{
          that.calibraionModal=true;
          if(!res.data.preChkCalibrationPlan){
            res.data.preChkCalibrationPlan={
              result:null,
              calibraionTime:null
            }
          }
          res.data.calibraionTime=res.data.calibraionTime?new Date(res.data.calibraionTime):new Date()
          res.data.operator = res.data.operator?res.data.operator:this.$store.state.currentUserId
          that.editModal = res.data
        })
      },
      saveCalibration(){
        let that = this;
        let params = [
          {type:'Empty',title:i18n.t('chkdev.caliResult'),value:that.editModal.result},
          {type:'Empty',title:i18n.t('chkdev.thisCaliTime'),value:that.editModal.calibraionTime},
          {type:'Empty',title:i18n.t('chkdev.operator'),value:that.editModal.operator},
          {type:'Word600',title:i18n.t('chkdev.caliExplain'),value:that.editModal.calibraionExplain},
        ]
        let state = true;
        for(let i in params){
          state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
            that.$Notice.warning({title:tips})//,duration: 0
          })
          if(!state){
            return;
            break;
          }
        }
        that.editModal.calibraionTime = that.editModal.calibraionTime.getTime()
        that.$http.put('/basic/chkdev/calibrationPlan',that.editModal,that.headers).then((res)=>{
          that.calibraionModal=false;
          that.$Message.success(i18n.t('chkdev.saveSuccess'));
          that.reset()
        }).catch((err)=>{
          that.editModal.calibraionTime=new Date(that.editModal.calibraionTime)
        })
      },
      
      
    }//end methods




  }

</script>
<style>
.tableTitle{
  font-size:16px;
  font-weight: bold;
  color:#797979;
}
.tableFormat{
    background: rgba(247, 247, 247, 1);
    padding: 15px 0;
}
.tableFormat .ivu-col{
  margin-bottom:10px;
}
</style>
