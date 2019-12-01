<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
        <DatePicker v-model="search.dates" type="daterange" :placeholder="i18n.t('customer.dateFilter')" style="width: 210px"></DatePicker>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model.trim="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('iqc.searchAll')" slot="prepend" style="width: 110px;text-align: left">
            <Option v-for="st in search.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="refreshData">{{$t('iqc.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t('iqc.reset')}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <Button style="margin-right:8px;" v-if="permsBtn.INSERT_TRANSFERRECORD" type="ghost" icon="plus" @click="addTransfer">{{$t('chkdev.add')}}</Button>
        <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" confirm :title="i18n.t('customer.confirmDelete')" placement="bottom-start" @on-ok="deleteTransfer">
            <Button v-if="permsBtn.DELETE_TRANSFERRECORD" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t('customer.delete')}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="reset">{{$t('iqc.refreshData')}}</Button>
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
      :title="i18n.t('chkdev.transferRecord')"
      v-model="transferModal"
      :mask-closable="false"
      :width="900" >
      <Row type="flex" :gutter="40">
        <i-col span="6">{{$t('chkdev.deviceCode')}}</i-col>
        <i-col span="6">{{$t('chkdev.transferNo')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="6">
          <Select v-model="editModal.chkDevId" filterable style="width:100%" :disabled="eidtDis" :placeholder="i18n.t('chkdev.pleaseSelect')" @on-change="changeChkDev">
            <Option v-for="(item,index) in chkDevList" :value="item.chkDevId" :key="index" :label="item.no">{{item.no}}/{{item.name}}</Option>
          </Select>
        </i-col>
        <i-col span="6">
          <Input :disabled="eidtDis" :placeholder="i18n.t('pleaseChoose')" v-model="editModal.transferNo" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" class="tableFormat" style="margin-top:15px;">
        <i-col span="6">{{$t("chkdev.deviceName")}}：{{editModal.name}}</i-col>
        <i-col span="6">{{$t('chkdev.spec')}}：{{editModal.spec}}</i-col>
        <i-col span="12">{{$t('chkdev.deviceParameters')}}：{{editModal.param}}</i-col>
        <i-col span="6">{{$t('chkdev.type')}}：{{editModal.chkDevTypeName}}</i-col>
        <i-col span="6">{{$t('chkdev.serialNumber')}}：{{editModal.factoryNumber}}</i-col>
        <i-col span="12">{{$t('chkdev.label')}}：{{editModal.factoryCard}}</i-col>
        <i-col span="6">{{$t('chkdev.department')}}：{{editModal.departmentName}}</i-col>
        <i-col span="6">{{$t('chkdev.custodian')}}：{{editModal.keeperUserName}}</i-col>
        <i-col span="6">{{$t('chkdev.time')}}：{{editModal.createTime?new Date(editModal.createTime).Format("yyyy-M-d h:m"):''}}</i-col>
        <i-col span="6">{{$t('chkdev.useState')}}：
          <span v-if="editModal.useState==1">{{$t('chkdev.normal')}}</span>
          <span v-if="editModal.useState==2">{{$t('chkdev.limitedUse')}}</span>
          <span v-if="editModal.useState==3">{{$t('chkdev.notInService')}}</span>
          <span v-if="editModal.useState==4">{{$t('chkdev.scrapped')}}</span>
          <span v-if="editModal.useState==5">{{$t('chkdev.inMmaintenance')}}</span>
          <span v-if="editModal.useState==6">{{$t('chkdev.waitRepair')}}</span>
        </i-col>
        <i-col span="24" style="margin-bottom:0;">{{$t('chkdev.remarks')}}：{{editModal.remark}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top:15px;">
        <i-col span="6">{{$t('chkdev.transferDepartment')}}</i-col>
        <i-col span="6">{{$t('chkdev.custodian')}}</i-col>
        <i-col span="6">{{$t('chkdev.transferTime')}}</i-col>
        <i-col span="6">{{$t('chkdev.operator')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="6">
          <Select  @on-change="changeDepartment(editModal.transferDepartmentId)" :disabled="eidtDis" style="width:100%" :placeholder="i18n.t('pleaseChoose')" v-model="editModal.transferDepartmentId" filterable>
            <Option v-for="(data,index) in departmentList"  :value="data.departmentId" :label="data.departmentName" :key="index"></Option>
          </Select>
        </i-col>
        <i-col span="6">
          <Select :disabled="eidtDis" :placeholder="i18n.t('pleaseChoose')" v-model="editModal.transferKeeperId" filterable style="width:100%">
            <Option v-for="(data,index) in userList2"  :value="data.userId" :label="data.name" :key="index"></Option>
          </Select>
        </i-col>
        <i-col span="6">
          <Date-picker :disabled="eidtDis" type="datetime" format="yyyy-MM-dd HH:mm" v-model="editModal.transferTime" :placeholder="i18n.t('chkdev.transferTime')" style="width: 100%"></Date-picker>
        </i-col>
        <i-col span="6">
          <Select :disabled="eidtDis" :placeholder="i18n.t('pleaseChoose')" v-model="editModal.operatorId" filterable style="width:100%">
            <Option v-for="(data,index) in userList"  :value="data.userId" :label="data.name" :key="index"></Option>
          </Select>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top:20px">
        <i-col span="24">{{$t('chkdev.transferCause')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="24">
          <Input :disabled="eidtDis" :placeholder="i18n.t('chkdev.pird')" v-model="editModal.transferCause" type="textarea" :rows="1" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <div slot="footer">
        <Button v-if="!eidtDis" type="primary" size="large" @click="saveTransfer()">{{$t('iqc.confirm')}}</Button>
        <Button type="text" size="large" @click="transferModal=false">{{$t('iqc.cancel')}}</Button>
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
            "chkDevId":null,
            "chkDevTypeId":null,
            "chkDevTypeName": null,
            "departmentId":null,
            "departmentName": null,
            "factoryCard": null,
            "factoryNumber": null,
            "keeperUserId":null,
            "keeperUserName": null,
            "name": null,
            "no": null,
            "operatorId":null,
            "operatorName": null,
            "param": null,
            "remark": null,
            "spec": null,
            "tenantId":null,
            "transferCause": null,
            "transferDepartmentId":null,
            transferKeeperId:null,
            "transferDepartmentName": null,
            "transferNo": null,
            "transferRecordId":null,
            "transferTime":new Date(),
            "useState": null,
            "createTime":''
        },
        userList:[],
        userList2:[],
        chkDevList:[],
        departmentList:[],
        eidtDis:false,
        tableEditDis:true,
        transferModal:false,
        search: {
          query: "",
          fieldName: "",
          dates:[],
          searchTypes: [
            {
              label: i18n.t('chkdev.searchAll'),
              value: ""
            }, {
              label: i18n.t('chkdev.transferNo'),
              value: "transferNo"
            }, {
              label: i18n.t('chkdev.deviceCode'),
              value: "no"
            }, {
              label: i18n.t('chkdev.deviceName'),
              value: "name"
            },  {
              label: i18n.t('chkdev.EquipmentModel'),
              value: "spec"
            },  {
              label: i18n.t('chkdev.department'),
              value: "departmentName"
            },  {
              label: i18n.t("chkdev.transferDepartment"),
              value: "transferDepartmentName"
            },  {
              label: i18n.t('chkdev.transferCause'),
              value: "transferCause"
            },  {
              label: i18n.t('chkdev.operator'),
              value: "operatorName"
            } 
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
              title: i18n.t('chkdev.transferTime'),
              className:'tablePadding',
              width:106,
              minWidth:106,
              ellipsis:true,
              key: 'transferTime',
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
              title: i18n.t('chkdev.transferNo'),
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'transferNo',
            },{
              title: i18n.t('chkdev.deviceCode'),
              width:120,
              minWidth:120,
              className:'tablePadding',
              ellipsis:true,
              key: 'no'
            },{
              title: i18n.t('chkdev.deviceName'),
              width:120,
              minWidth:120,
              className:'tablePadding',
              ellipsis:true,
              key: 'name'
            },{
              title: i18n.t('chkdev.EquipmentModel'),
              width:120,
              minWidth:120,
              className:'tablePadding',
              ellipsis:true,
              key: 'spec'
            },{
              title: "所属部门",
              minWidth:120,
              className:'tablePadding',
              ellipsis:true,
              key: 'departmentName'
            },{
              title: i18n.t('chkdev.department'),
              minWidth:120,
              className:'tablePadding',
              minWidth:80,
              ellipsis:true,
              key: 'transferDepartmentName',
            },{
              title: i18n.t('chkdev.transferCause'),
              width:140,
              minWidth:140,
              className:'tablePadding',
              ellipsis:true,
              key: 'transferCause',
            },{
              title: i18n.t('chkdev.operator'),
              className:'tablePadding',
              width:110,
              minWidth:110,
              ellipsis:true,
              key: 'operatorName'
            }
          ]
        },
        permsCur:[
          "DELETE_TRANSFERRECORD",
          "INSERT_TRANSFERRECORD",
          "SELECT_TRANSFERRECORD",

        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "DELETE_TRANSFERRECORD":false,
          "INSERT_TRANSFERRECORD":false,
          "SELECT_TRANSFERRECORD":false,
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
        that.$http.get("/basic/transferRecord",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
        })
        that.$http.get("/tenant/user",{params:{limit:99999999}}).then(function (resp) {
            that.userList = resp.data;
            that.userList2 = resp.data;
        });
        that.$http.get('/systemManage/department',{params:{limit:99999999}}).then(function (resp) {
            that.departmentList = resp.data  
        })
        that.$http.get('/basic/chkdev',{params:{limit:99999999}}).then(function (resp) {
            that.chkDevList = resp.data  
        })
      },
      addTransfer(){
        this.eidtDis = false;
        this.editModal={
            "chkDevId":null,
            "chkDevTypeId":null,
            "chkDevTypeName": null,
            "departmentId":null,
            "departmentName": null,
            "factoryCard": null,
            "factoryNumber": null,
            "keeperUserId":null,
            "keeperUserName": null,
            "name": null,
            "no": null,
            "operatorId":null,
            "operatorName": null,
            "param": null,
            "remark": null,
            "spec": null,
            "tenantId":null,
            "transferCause": null,
            "transferDepartmentId":null,
            transferKeeperId:null,
            "transferDepartmentName": null,
            "transferNo": null,
            "transferRecordId":null,
            "transferTime":new Date(),
            "useState": null,
            "createTime":''
        }
          this.editModal.operatorId = this.$store.state.currentUserId
          this.transferModal = true;
          this.userList2 = JSON.parse(JSON.stringify(this.userList))
      },
      editTransfer(){
        let that = this;
        let selectedRow = this.$refs.pageTable.getSelection()   
        let transferRecordId=selectedRow[0].transferRecordId
        let url="/basic/transferRecord/"
        that.$http.get(url+transferRecordId).then((res)=>{
            that.eidtDis = true;
            that.transferModal=true;
            res.data.transferTime=res.data.transferTime?new Date(res.data.transferTime):new Date()
            that.editModal = res.data
        })
      },
      onDBClick(obj,index){
        let that = this;
        that.eidtDis = true;
        let transferRecordId=obj.transferRecordId
        let url="/basic/transferRecord/"
        that.$http.get(url+transferRecordId).then((res)=>{
            that.transferModal=true;
            res.data.transferTime=res.data.transferTime?new Date(res.data.transferTime):new Date()
            that.editModal = res.data
        })
      },
      deleteTransfer(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/basic/transferRecord/"+ss[i].transferRecordId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('chkdev.deleteSuccess'));
              that.table.selected='';
              that.refreshData();
            });
          }
        }
      },
      changeDepartment(val){
          let that=this;
          if(!val){return;}
          this.$http.get("/tenant/userlist/"+val+"?limit=999999").then(function (resp) {
              that.userList2=resp.data;
          })
      },
      reset(){
        this.table.selected='';
        this.search.fieldName='';
        this.search.query='';
        this.search.calibraionTime=[];
        this.search.planTime=[];
        this.tableEditDis=true;
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
      changeChkDev(){
        let that = this;
        if(!that.editModal.chkDevId||that.eidtDis){
            return;
        }
        that.$http.get('/basic/chkdev/'+that.editModal.chkDevId).then((res)=>{
            that.editModal.no = res.data.no
            that.editModal.name = res.data.name
            that.editModal.spec = res.data.spec
            that.editModal.param = res.data.param
            that.editModal.chkDevTypeName = res.data.chkDevTypeName
            that.editModal.factoryCard = res.data.factoryCard
            that.editModal.factoryNumber = res.data.factoryNumber
            that.editModal.departmentName = res.data.departmentName
            that.editModal.keeperUserName = res.data.keeperUserName
            that.editModal.createTime = res.data.createTime
            that.editModal.useState = res.data.useState
            that.editModal.remark = res.data.remark
        })
      },
      saveTransfer(){
        let that = this;
        let params = [
          {type:'Empty',title:i18n.t('chkdev.deviceCode'),value:that.editModal.chkDevId},
          {type:'Empty',title:i18n.t('chkdev.transferNo'),value:that.editModal.transferNo},
          {type:'No',title:i18n.t('chkdev.transferNo'),value:that.editModal.transferNo},
          {type:'Empty',title:i18n.t('chkdev.transferDepartment'),value:that.editModal.transferDepartmentId},
          {type:'Empty',title:i18n.t("chkdev.custodian"),value:that.editModal.transferKeeperId},
          {type:'Empty',title:i18n.t('chkdev.transferTime'),value:that.editModal.transferTime},
          {type:'Empty',title:i18n.t('chkdev.operator'),value:that.editModal.operatorId},
          {type:'Word600',title:'转移原因',value:that.editModal.transferCause},
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
        that.editModal.transferTime = that.editModal.transferTime.getTime()
        that.$http.post('/basic/transferRecord',that.editModal,that.headers).then((res)=>{
          that.transferModal=false;
          that.$Message.success(i18n.t('iqc.saveSuccess'));
          that.reset()
        }).catch((err)=>{
          that.editModal.transferTime = new Date(that.editModal.transferTime)

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
