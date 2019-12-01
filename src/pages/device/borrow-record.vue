<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
          <Date-picker type="daterange" format="yyyy-MM-dd" v-model="search.lendTime" :placeholder="i18n.t('chkdev.chooseLendTime')" style="width: 210px"></Date-picker>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
          <Date-picker type="daterange" format="yyyy-MM-dd" v-model="search.returnTime" :placeholder="i18n.t('chkdev.chooseReturnTime')" style="width: 210px"></Date-picker>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select v-model="search.state" :placeholder="i18n.t('chkdev.state')" clearable style="width: 100px;">
          <Option v-for="st in search.stateLst" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
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
        <Button v-if="permsBtn.INSERT_BORROWRECORD" type="ghost" icon="plus" @click="addBorrow">{{$t('chkdev.add')}}</Button>
        <Button style="margin:0 8px;" v-if="permsBtn.UPDATE_BORROWRECORD" type="ghost" icon="edit" :disabled="tableEditDis" @click="editBorrow">{{$t('chkdev.modify')}}</Button>
        <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" confirm :title="i18n.t('customer.confirmDelete')" placement="bottom-start" @on-ok="deleteBorrow">
            <Button v-if="permsBtn.DELETE_BORROWRECORD" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t('customer.delete')}}</Button>
        </Poptip>
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
      :title="borrowId?i18n.t('chkdev.editBorrowRecord'):i18n.t('chkdev.addBorrowRecord')"
      v-model="borrowModal"
      :mask-closable="false"
      :width="900" >
      <Row type="flex" :gutter="40">
        <i-col span="6">{{$t('chkdev.deviceCode')}}</i-col>
        <i-col span="6">{{$t('chkdev.borrowNo')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="6">
          <Select :disabled="noPermsDis" v-model="editModal.chkDevId" filterable style="width:100%" :placeholder="i18n.t('chkdev.pleaseSelect')" @on-change="changeChkDev">
            <Option v-for="(item,index) in chkDevList" :value="item.chkDevId" :key="index" :label="item.no">{{item.no}}/{{item.name}}</Option>
            </Select>
        </i-col>
        <i-col span="6">
          <Input :disabled="noPermsDis" v-model="editModal.borrowNo" style="width:100%"></Input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" class="tableFormat" style="margin-top:15px;">
        <i-col span="6">{{$t('chkdev.deviceName')}}：{{chkDev.name}}</i-col>
        <i-col span="6">{{$t('chkdev.spec')}}：{{chkDev.spec}}</i-col>
        <i-col span="12">{{$t('chkdev.deviceParameters')}}：{{chkDev.param}}</i-col>
        <i-col span="6">{{$t('chkdev.type')}}：{{chkDev.chkDevTypeName}}</i-col>
        <i-col span="6">{{$t('chkdev.serialNumber')}}：{{chkDev.factoryNumber}}</i-col>
        <i-col span="12">{{$t('chkdev.label')}}：{{chkDev.factoryCard}}</i-col>
        <i-col span="6">{{$t('chkdev.department')}}：{{chkDev.departmentName}}</i-col>
        <i-col span="6">{{$t('chkdev.custodian')}}：{{chkDev.keeperUserName}}</i-col>
        <i-col span="6">{{$t('chkdev.time')}}：{{chkDev.createTime?new Date(chkDev.createTime).Format("yyyy-M-d h:m"):''}}</i-col>
        <i-col span="6">{{$t('chkdev.useState')}}：
          <span v-if="chkDev.useState==1">{{$t('chkdev.normal')}}</span>
          <span v-if="chkDev.useState==2">{{$t('chkdev.limitedUse')}}</span>
          <span v-if="chkDev.useState==3">{{$t('chkdev.notInService')}}</span>
          <span v-if="chkDev.useState==4">{{$t('chkdev.scrapped')}}</span>
          <span v-if="chkDev.useState==5">{{$t('chkdev.inMmaintenance')}}</span>
          <span v-if="chkDev.useState==6">{{$t('chkdev.waitRepair')}}</span>
        </i-col>
        <i-col span="24" style="margin-bottom:0;">{{$t('chkdev.remarks')}}：{{chkDev.remark}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top:15px;">
        <i-col span="6">{{$t('chkdev.borrowDepartment')}}</i-col>
        <i-col span="6">{{$t('chkdev.borrowUser')}}</i-col>
        <i-col span="6">{{$t('chkdev.lendTime')}}</i-col>
        <i-col span="6">{{$t('chkdev.lendUser')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="6">
          <Select :disabled="noPermsDis" style="width:100%" :placeholder="i18n.t('pleaseChoose')" v-model="editModal.departmentId" filterable>
            <Option v-for="(data,index) in departmentList"  :value="data.departmentId" :label="data.departmentName" :key="index"></Option>
          </Select>
        </i-col>
        <i-col span="6">
          <Select :disabled="noPermsDis" :placeholder="i18n.t('pleaseChoose')" v-model="editModal.borrowUserId" filterable style="width:100%">
            <Option v-for="(data,index) in userList"  :value="data.userId" :label="data.name" :key="index"></Option>
          </Select>
        </i-col>
        <i-col span="6">
          <Date-picker :disabled="noPermsDis" type="datetime" format="yyyy-MM-dd HH:mm" v-model="editModal.lendTime" :placeholder="i18n.t('chkdev.chooseLendTime')" style="width: 100%"></Date-picker>
        </i-col>
        <i-col span="6">
          <Select :disabled="noPermsDis" style="width:100%" :placeholder="i18n.t('pleaseChoose')" v-model="editModal.lendUserId" filterable>
            <Option v-for="(data,index) in userList"  :value="data.userId" :label="data.name" :key="index"></Option>
          </Select>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top:15px;">
        <i-col span="6">{{$t('chkdev.returnUser')}}</i-col>
        <i-col span="6">{{$t('chkdev.returnTime')}}</i-col>
        <i-col span="6">{{$t('chkdev.signerUser')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="6">
          <Select :disabled="noPermsDis" :placeholder="i18n.t('pleaseChoose')" v-model="editModal.returnUserId" filterable style="width:100%">
            <Option v-for="(data,index) in userList"  :value="data.userId" :label="data.name" :key="index"></Option>
          </Select>
        </i-col>
        <i-col span="6">
          <Date-picker :disabled="noPermsDis" type="datetime" format="yyyy-MM-dd HH:mm" v-model="editModal.returnTime" :placeholder="i18n.t('chkdev.chooseReturnTime')" style="width: 100%"></Date-picker>
        </i-col>
        <i-col span="6">
          <Select :disabled="noPermsDis" :placeholder="i18n.t('pleaseChoose')" v-model="editModal.signerUserId" filterable style="width:100%">
            <Option v-for="(data,index) in userList"  :value="data.userId" :label="data.name" :key="index"></Option>
          </Select>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top:20px">
        <i-col span="24">{{$t('chkdev.lendExplain')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="24">
          <Input :disabled="noPermsDis" :placeholder="i18n.t('chkdev.pird')" v-model="editModal.lendExplain" type="textarea" :rows="1" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <div slot="footer">
        <Button v-if="!noPermsDis" type="primary" size="large" @click="saveBorrow()">{{$t('chkdev.confirm')}}</Button>
        <Button type="text" size="large" @click="borrowModal=false">{{$t('chkdev.cancel')}}</Button>
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
            "departmentId":null,
            "borrowUserId":null,
            "lendTime":"",
            "lendUserId":null,
            "returnUserId":null,
            "returnTime":null,
            "signerUserId":null,
            "lendExplain":null
        },
        chkDev:{
            no:null,
            name:null,
            spec:null,
            param:null,
            chkDevTypeName:null,
            factoryCard:null,
            factoryNumber:null,
            departmentName:null,
            keeperUserName:null,
            createTime:null,
            useState:null,
            remark:null
        },
        userList:[],
        chkDevList:[],
        departmentList:[],
        tableEditDis:true,
        borrowModal:false,
        borrowId:null,
        search: {
          query: "",
          fieldName: "",
          lendTime:[],
          returnTime:[],
          state:'',
          stateLst:[
            {value:0,label:i18n.t('chkdev.lend')},
            {value:1,label:i18n.t('chkdev.return')},
          ],
          searchTypes: [
            {
              label: i18n.t('chkdev.searchAll'),
              value: ""
            }, {
              label: i18n.t('chkdev.borrowNo'),
              value: "borrowNo"
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
              label: i18n.t('chkdev.department'),
              value: "dependDepartmentName"
            },  {
              label: i18n.t('chkdev.borrowDepartment'),
              value: "departmentName"
            },  {
              label: i18n.t('chkdev.borrowUser'),
              value: "borrowUserName"
            },  {
              label: i18n.t('chkdev.lendUser'),
              value: "lendUserName"
            },  {
              label: i18n.t('chkdev.returnUser'),
              value: "returnUserName"
            },  {
              label: i18n.t('chkdev.signerUser'),
              value: "signerUserName"
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
            },{
              title: i18n.t('chkdev.state'),
              className:'tablePadding',
              minWidth:80,
              ellipsis:true,
              key: 'state',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{
                  0:"<span style='color:orange'>"+i18n.t('chkdev.lend')+"</span>",
                  1:"<span style='color:green'>"+i18n.t('chkdev.returned')+"</span>"
              })
            },{
              title: i18n.t('chkdev.borrowNo'),
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'borrowNo',
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
              title: i18n.t('chkdev.department'),
              minWidth:120,
              className:'tablePadding',
              ellipsis:true,
              key: 'dependDepartmentName'
            },{
              title: i18n.t('chkdev.borrowDepartment'),
              minWidth:120,
              className:'tablePadding',
              minWidth:80,
              ellipsis:true,
              key: 'departmentName',
            },{
              title: i18n.t('chkdev.borrowUser'),
              width:80,
              minWidth:80,
              className:'tablePadding',
              ellipsis:true,
              key: 'borrowUserName'
            },{
              title: i18n.t('chkdev.lendUser'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'lendUserName',
            },{
              title: i18n.t('chkdev.lendTime'),
              className:'tablePadding',
              width:106,
              minWidth:106,
              ellipsis:true,
              key: 'lendTime',
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
              title: i18n.t('chkdev.returnTime'),
              className:'tablePadding',
              width:106,
              minWidth:106,
              ellipsis:true,
              key: 'returnTime',
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
              title: i18n.t('chkdev.returnUser'),
              width:80,
              minWidth:80,
              className:'tablePadding',
              ellipsis:true,
              key: 'returnUserName'
            },{
              title: i18n.t('chkdev.signerUser'),
              width:80,
              minWidth:80,
              className:'tablePadding',
              ellipsis:true,
              key: 'signerUserName',
            },
          ]
        },
        permsCur:[
          "DELETE_BORROWRECORD",
          "INSERT_BORROWRECORD",
          "UPDATE_BORROWRECORD",
          "SELECT_BORROWRECORD",

        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "DELETE_BORROWRECORD":false,
          "INSERT_BORROWRECORD":false,
          "UPDATE_BORROWRECORD":false,
          "SELECT_BORROWRECORD":false,
        },
        noPermsDis:false,
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
      onPopUp(){
        let that = this;
        if(((!that.borrowId&&that.permsBtn.INSERT_BORROWRECORD)||(that.borrowId&&that.permsBtn.UPDATE_BORROWRECORD))){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
      },
      refreshData(){
        let that = this;
        that.table.loading = true;
        let params = {};
        let startDate = '';
        let endDate = '';
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        let startLendTime = ''
        let endLendTime = ''
        let startReturnTime = ''
        let endReturnTime = ''
        let date1=that.search.lendTime;
        if(date1[0] !=undefined&&date1[0] !=''){
          startLendTime= (new Date(date1[0])).getTime();
          endLendTime=(new Date(date1[1])).getTime();
        }
        let date2=that.search.returnTime;
        if(date2[0] !=undefined&&date2[0] !=''){
          startReturnTime= (new Date(date2[0])).getTime();
          endReturnTime=(new Date(date2[1])).getTime();
        }
        params.query = 'startLendTime='+startLendTime+
                      '&endLendTime='+endLendTime+
                      '&startReturnTime='+startReturnTime+
                      '&endReturnTime='+endReturnTime+
                      '&state='+that.search.state+
                      '&field='+that.search.fieldName+
                      '&keyword='+that.search.query
        that.$http.get("/basic/borrowRecord",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
        })
        that.$http.get("/tenant/user",{params:{limit:99999999}}).then(function (resp) {
            that.userList = resp.data;
        });
        that.$http.get('/systemManage/department',{params:{limit:99999999}}).then(function (resp) {
            that.departmentList = resp.data  
        })
        that.$http.get('/basic/chkdev',{params:{limit:99999999}}).then(function (resp) {
            that.chkDevList = resp.data  
        })
      },
      addBorrow(){
        this.editModal={
            "chkDevId":null,
            "departmentId":null,
            "borrowUserId":null,
            "lendTime":"",
            "lendUserId":null,
            "returnUserId":null,
            "returnTime":null,
            "signerUserId":null,
            "lendExplain":null,
            "borrowNo":null,
        },
        this.chkDev={
            no:null,
            name:null,
            spec:null,
            param:null,
            chkDevTypeName:null,
            factoryCard:null,
            factoryNumber:null,
            departmentName:null,
            keeperUserName:null,
            createTime:null,
            useState:null,
            remark:null
        },
          this.borrowId = null
          this.borrowModal = true;
          this.editModal.lendUserId = this.$store.state.currentUserId
          this.editModal.lendTime = new Date()
          this.onPopUp()
      },
      editBorrow(){
        let that = this;
        let selectedRow = this.$refs.pageTable.getSelection()   
        let borrowId=selectedRow[0].borrowId
        that.borrowId = borrowId
        this.onPopUp()
        let url="/basic/borrowRecord/"
        that.$http.get(url+borrowId).then((res)=>{
            that.borrowModal=true;
            res.data.lendTime=res.data.lendTime?new Date(res.data.lendTime):new Date()
            res.data.returnTime=res.data.returnTime?new Date(res.data.returnTime):new Date()
            that.editModal = res.data
            that.editModal.signerUserId = that.editModal.signerUserId?that.editModal.signerUserId:that.$store.state.currentUserId
            that.editModal.returnTime = that.editModal.returnTime?that.editModal.returnTime:new Date()
        })
      },
      onDBClick(obj,index){
        let that = this;
        let borrowId=obj.borrowId
        that.borrowId = borrowId
        this.onPopUp()
        let url="/basic/borrowRecord/"
        that.$http.get(url+borrowId).then((res)=>{
            that.borrowModal=true;
            res.data.lendTime=res.data.lendTime?new Date(res.data.lendTime):new Date()
            res.data.returnTime=res.data.returnTime?new Date(res.data.returnTime):new Date()
            that.editModal = res.data
            that.editModal.signerUserId = that.editModal.signerUserId?that.editModal.signerUserId:that.$store.state.currentUserId
            that.editModal.returnTime = that.editModal.returnTime?that.editModal.returnTime:new Date()
        })
      },
      deleteBorrow(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/basic/borrowRecordId/"+ss[i].borrowId));
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
      reset(){
        this.table.selected='';
        this.search.fieldName='';
        this.search.query='';
        this.search.lendTime=[];
        this.search.returnTime=[];
        this.search.state = ''
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
        if(!that.editModal.chkDevId){
            return;
        }
        that.$http.get('/basic/chkdev/'+that.editModal.chkDevId).then((res)=>{
            that.chkDev = res.data
        })
      },
      saveBorrow(){
        let that = this;
        let params = [
          {type:'Empty',title:i18n.t('chkdev.deviceCode'),value:that.editModal.chkDevId},
          {type:'Empty',title:i18n.t('chkdev.borrowNo'),value:that.editModal.borrowNo},
          {type:'No',title:i18n.t('chkdev.borrowNo'),value:that.editModal.borrowNo},
          {type:'Empty',title:i18n.t('chkdev.borrowDepartment'),value:that.editModal.departmentId},
          {type:'Empty',title:i18n.t('chkdev.borrowUser'),value:that.editModal.borrowUserId},
          {type:'Empty',title:i18n.t('chkdev.lendTime'),value:that.editModal.lendTime},
          {type:'Empty',title:i18n.t('chkdev.lendUser'),value:that.editModal.lendUserId},
          {type:'Word600',title:i18n.t('chkdev.lendExplain'),value:that.editModal.lendExplain},
        ]
        if(that.borrowId){
          params.push(
              {type:'Empty',title:i18n.t('chkdev.returnUser'),value:that.editModal.returnUserId},
              {type:'Empty',title:i18n.t('chkdev.returnTime'),value:that.editModal.returnTime},
              {type:'Empty',title:i18n.t('chkdev.signerUser'),value:that.editModal.signerUserId},
              {type:'Word600',title:i18n.t('chkdev.lendExplain'),value:that.editModal.lendExplain},
          )
        }
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
        that.editModal.lendTime = that.editModal.lendTime?that.editModal.lendTime.getTime():null
        that.editModal.returnTime = that.editModal.returnTime?that.editModal.returnTime.getTime():null
        if(!that.borrowId){
          that.$http.post('/basic/borrowRecord',that.editModal,that.headers).then((res)=>{
            that.borrowModal=false;
            that.$Message.success(i18n.t('chkdev.saveSuccess'));
            that.reset()
          }).catch((err)=>{
            that.editModal.lendTime = new Date(that.editModal.lendTime)
            that.editModal.returnTime = new Date(that.editModal.returnTime)
          })
        }else{
          that.$http.put('/basic/borrowRecord',that.editModal,that.headers).then((res)=>{
            that.borrowModal=false;
            that.$Message.success(i18n.t('chkdev.saveSuccess'));
            that.reset()
          }).catch((err)=>{
            that.editModal.lendTime = new Date(that.editModal.lendTime)
            that.editModal.returnTime = new Date(that.editModal.returnTime)
          })
        }
        
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
