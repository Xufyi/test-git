<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 215px;">
        <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('pqc.dateFilter')" style="width: 205px"></DatePicker>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select v-model="search.status" :placeholder="i18n.t('pqc.state')" clearable style="width: 100px;">
          <Option v-for="st in search.state" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select v-model="search.result" :placeholder="i18n.t('pqc.drt')" clearable style="width: 100px;">
          <Option v-for="st in search.results" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('pqc.sa')" slot="prepend" style="width: 110px;text-align: left">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="refreshData">{{$t('pqc.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t('pqc.reset')}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <Button type="ghost" icon="plus" @click="addFirst" v-if="permsBtn.INSERT_FIRST_RECORD">{{$t('pqc.add')}}</Button>
        <Button style="margin:0 8px;" type="ghost" icon="edit" @click="editFirst" v-if="permsBtn.UPDATE_FIRST_RECORD" :disabled="tableEditDis">{{$t('pqc.modify')}}</Button>
        <Poptip
          confirm
          :title="i18n.t('quality.dsi')"
          placement="bottom-start"
          :ok-text='i18n.t("quality.confirm")'
          :cancel-text='i18n.t("quality.cancel")'
          @on-ok="deleteTableSelected">
          <Button type="ghost" icon="trash-a"  v-if="permsBtn.DELETE_FIRST_RECORD" :disabled="!table.selected">{{$t('pqc.delete')}}</Button>
          
        </Poptip>
        <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.AUDIT_FIRST_RECORD" @click="Toexamine" :disabled="!table.selected" icon="android-list">{{$t('pqc.review')}}</Button>
      </div>
      <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="reset">{{$t('pqc.refresh')}}</Button>
        <Dropdown style="margin-left: 5px" >
          <Button type="ghost">{{$t('iqc.export')}}<Icon style="padding-left:10px;" type="arrow-down-b"></Icon></Button>
          <DropdownMenu slot="list">
              <DropdownItem>
                <Button type="text" @click="exportStatement(1)">{{$t('iqc.thisPage')}}</Button>
              </DropdownItem>
              <DropdownItem>
                <Button type="text" @click="exportStatement(3)">{{$t("pqc.allTheData")}}</Button>
              </DropdownItem>
              <DropdownItem>
                <Button type="text" @click="exportStatement(2)">{{$t('iqc.inspectReport')}}</Button>
              </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
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
    <div class="Toexamine">
    	<Modal
      :title="i18n.t('quality.review')"
      v-model="Audit.status"
      :mask-closable="false"
      :width="300" >
        <Select v-model="Audit.fieldName" style="width:200px">
           <Option v-for="(item,index) in Audit.resultStats" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        <div slot="footer">
        <Button type="primary" size="large" @click="AuditOk" >{{$t('pqc.confirm')}}</Button>
        <Button type="text" size="large" @click="AuditNo">{{$t('pqc.cancel')}}</Button>
      </div>
      </Modal>
    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
    <div class="arrangement-dialog">
      <Modal
      :title="i18n.t('pqc.customList')"
      v-model="arrangement.state"
      class="rankBox"
      :mask-closable="false"
      :width="600" >
      <span class="list_txt">{{$t("pqc.select")}}</span>
       <div class="list_ok list">
        <div v-for="(item,index) in arrangement.data1" class="dataItem" :class="'check'+index"  :key="index">
          <input type="checkbox"   :value="item"  v-model="arrangement.data" >
           <span >{{item.title}}</span>
         </div>
       </div>
       <span class="list_txt2">{{$t("pqc.tsl")}}</span>
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
        <Button type="primary" size="large" @click="RankOk" >{{$t("pqc.confirm")}}</Button>
        <Button type="text" size="large" @click="RankNo">{{$t("pqc.cancel")}}</Button>
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
        _firstRecordId:"",
        _type:"",
        tableEditDis:true,
        Audit:{//审核状态
        	status:false,
        	resultStats:[
            {value:"2",label:i18n.t("pqc.auditPass")},
            {value:"3",label:i18n.t("pqc.auditReject")},
          ],
          fieldName:'2',
        },
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
              title: i18n.t("pqc.time"),
              className:'tablePadding',
              width: 140,
              minWidth: 140,
              ellipsis:true,
              key: 'createTime',
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
              title:i18n.t("fileCenter.version"),
              width:120,
              minWidth:120,
              ellipsis:true,
              key:'type',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{'1':i18n.t("pqc.standardRecord"),'0':i18n.t("pqc.simpleRecord")})
            },
            {
              title: i18n.t("pqc.ln"),
              className:'tablePadding',
              width: 120,
              minWidth:120,
              ellipsis:true,
              key: 'prodBatchNo',
            },{
              title: i18n.t('pqc.pn'),
              className:'tablePadding',
              width: 120,
              minWidth:120,
              ellipsis:true,
              key: 'no',
            },{
              title: i18n.t('pqc.name'),
              className:'tablePadding',
              width: 120,
              minWidth:120,
              ellipsis:true,
              key: 'productName',
            },{
              title: i18n.t('pqc.specifications'),
              className:'tablePadding',
              width: 103,
              minWidth:103,
              ellipsis:true,
              key: 'spec',
            },{
              title: i18n.t("pqc.pc"),
              className:'tablePadding',
              width: this.$store.state.locale=='zh_CN'?70:120,
              minWidth:this.$store.state.locale=='zh_CN'?70:120,
              ellipsis:true,
              key: 'prodTypeName',
            },{
              title: i18n.t("pqc.pl"),
              className:'tablePadding',
              // width: this.$store.state.locale=='zh_CN'?106:130,
              minWidth:this.$store.state.locale=='zh_CN'?70:120,
              ellipsis:true,
              key: 'prodLineName',
            },{
              title: i18n.t("pqc.wp"),
              className:'tablePadding',
              // width: this.$store.state.locale=='zh_CN'?106:130,
              minWidth: this.$store.state.locale=='zh_CN'?106:130,
              ellipsis:true,
              key: 'prodProcessName',

            },{
              title: i18n.t("pqc.bn"),
              className:'tablePadding',
              width: 80,
              minWidth:80,
              ellipsis:true,
              key: 'batchQuantity',
            },{
              title: i18n.t('pqc.drt'),
              className:'tablePadding',
              width: 80,
              minWidth:80,
              ellipsis:true,
              key: 'result',
              // render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{'1':i18n.t('pqc.qualified'),'0':i18n.t('pqc.unqualified')})
              render:(h,params)=>{
                return h('span',{style:{'color':params.row.result == 1 ? 'green' : 'red'}},params.row.result == 1 ? i18n.t("pqc.qualified") : i18n.t("pqc.unqualified"))
              }
            },{
              title: i18n.t("pqc.inspector"),
              className:'tablePadding',
              width: 80,
              minWidth:80,
              ellipsis:true,
              key: 'inspectorName',
            },{
              title: i18n.t('pqc.state'),
              className:'tablePadding',
              width: 80,
              minWidth:80,
              ellipsis:true,
              key: 'state',
              // render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{'1':i18n.t('pqc.unaudited'),'2':i18n.t("pqc.auditPass"),'3':"<span style='color:red'>"+i18n.t('pqc.auditReject')+"</span>",'0':i18n.t('pqc.emt')})
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t("pqc.inspecting"),1:i18n.t("pqc.unaudited"),2:"<span style='color:green;'>"+i18n.t("pqc.auditPass")+"</span>",3:"<span style='color:red;'>"+i18n.t("pqc.auditReject")+"</span>"})

            },
            {
              title:i18n.t('pqc.reviewState'),
              width:103,
              minWidth:103,
              ellipsis:true,
              key:"reviewState",
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{'0':i18n.t('pqc.toAudit'),'1':i18n.t('pqc.toReview'),'3':i18n.t('pqc.tobeTheCase'),'4':i18n.t('pqc.hasBeen'),'5':i18n.t('review')})
            },
            {
              title: i18n.t("pqc.auditor"),
              className:'tablePadding',
              width: 63,
              minWidth:63,
              ellipsis:true,
              key: 'auditorName',
            },
          ]
        },
        search: {
          dates:[],
          status:"",
          state:[
            {value:"",label:i18n.t('pqc.all')},
            {value:"4",label:i18n.t('pqc.emt')},
            {value:"1",label:i18n.t('pqc.unaudited')},
            {value:"2",label:i18n.t("pqc.auditPass")},
            {value:"3",label:i18n.t('pqc.auditReject')},
          ],
          result:'',
          results:[
            {value:"1",label:i18n.t('pqc.qualified')},
            {value:"0",label:i18n.t('pqc.unqualified')},
          ],
          query: "",
          userList:[],
          fieldName: "",
          data: {
            searchTypes: [
              {label: i18n.t('pqc.sa'),value: ""},
              {label: i18n.t('pqc.ln'),value: "prodBatchNo"},
              {label: i18n.t('pqc.pn'),value: "no"},
              {label: i18n.t('pqc.name'),value: "productName"},
              {label: i18n.t('pqc.specifications'),value: "spec"},
              {label: i18n.t("pqc.pc"),value: "prodTypeName"},
              {label: i18n.t("pqc.wp"),value: "prodProcessName"},
              // {label: i18n.t('pqc.drt'),value: "result"},
              {label: i18n.t("pqc.inspector"),value: "inspectorName"},
              {label: i18n.t("pqc.auditor"),value: "auditorName"},
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
        permsCur:[
          "EXPORT_FIRST_RECORD",
          "UPDATE_FIRST_RECORD",
          "SELECT_FIRST_RECORD",
          "INSERT_FIRST_RECORD",
          "DELETE_FIRST_RECORD",
          "AUDIT_FIRST_RECORD",
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "EXPORT_FIRST_RECORD":false,
          "UPDATE_FIRST_RECORD":false,
          "SELECT_FIRST_RECORD":false,
          "INSERT_FIRST_RECORD":false,
          "DELETE_FIRST_RECORD":false,
          "AUDIT_FIRST_RECORD":false,
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
        this.search.dates=[];
        this.search.status='';
        this.search.result='';
        this.search.fieldName='';
        this.search.query='';
        this.refreshData(1);
        this.pageChange(1)
      },
      exportStatement (index){
        if(this._type==0) {
          this.$Notice.warning({
              title: i18n.t('pqc.esr'),
          });
          return;
        }
        let that = this;
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        if(index == 1){ 
          url = '/examinecenter/pqc/firstrecord/exportList';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          params.query = this.search.query;
          // params.page = this.table.pager.current;
          // params.limit = this.table.pager.limit;
          // params.query='result%3D'+that.search.result+'%26state%3D'+that.search.status+'%26field%3D'+that.search.fieldName+'%26keyword%3D'+that.search.query;
          // if(this.search.dates && this.search.dates[0]){
          //   let sdate = this.search.dates[0];
          //   let edate = this.search.dates[1];
          //   let startDate = this.$iqis.utils.getDayStart(1,sdate);
          //   let endDate = this.$iqis.utils.getDayEnd(edate);
          //   params.query='startDate%3D'+startDate+'%26endDate%3D'+endDate+'%26result%3D'+that.search.result+'%26state%3D'+that.search.status+'%26field%3D'+that.search.fieldName+'%26keyword%3D'+that.search.query;
          // }
        }
        if(index == 3){ 
          url = '/examinecenter/pqc/firstrecord/exportList';
          params.page = 1;
          params.limit = this.table.pager.total;
          params.query = this.search.query;
          // params.page = this.table.pager.current;
          // params.limit = this.table.pager.limit;
          // params.query='result%3D'+that.search.result+'%26state%3D'+that.search.status+'%26field%3D'+that.search.fieldName+'%26keyword%3D'+that.search.query;
          // if(this.search.dates && this.search.dates[0]){
          //   let sdate = this.search.dates[0];
          //   let edate = this.search.dates[1];
          //   let startDate = this.$iqis.utils.getDayStart(1,sdate);
          //   let endDate = this.$iqis.utils.getDayEnd(edate);
          //   params.query='startDate%3D'+startDate+'%26endDate%3D'+endDate+'%26result%3D'+that.search.result+'%26state%3D'+that.search.status+'%26field%3D'+that.search.fieldName+'%26keyword%3D'+that.search.query;
          // }
        }
        if(index == 2){
          url = '/examinecenter/pqc/firstrecord/exportReport/'+that._firstRecordId
          let reviewList=this.$refs.pageTable.getSelection()
          if( reviewList.length != 1){
            this.$Notice.warning({
                title: i18n.t('iqc.exportChooseOne'),
            });
            return;
          }
          // params.firstRecordId = reviewList[0].firstRecordId
        }
        //console.log(params)
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
          params.query='startDate='+startDate+'&endDate='+endDate+'&state='+that.search.status+'&result='+that.search.result+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }else{
          params.query='state='+that.search.status+'&result='+that.search.result+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }

        this.$http.get("/examinecenter/pqc/firstrecord",{params:params}).then(function (resp){
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
      addFirst(){
        this.$emit("open-tab","qc-pqc-first-add",i18n.t("pqc.afr"),"page-exam-pqc-first-add",null);
      },
      editFirst(){
        let selectedRow = this.$refs.pageTable.getSelection()
        //console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t('pqc.yms'),
            desc: ''
          });
          return;
        }
        this.$emit("open-tab","qc-pqc-first-add-"+selectedRow[0].firstRecordId,i18n.t('pqc.aofr')+"-"+selectedRow[0].productName,"page-exam-pqc-first-add",{firstRecordId:selectedRow[0].firstRecordId,type:selectedRow[0].type});
      },
      /**双击打开 */
      onDBClick(obj,index){
        this.$emit("open-tab","qc-pqc-first-add-"+obj.firstRecordId,i18n.t('pqc.aofr')+"-"+obj.productName,"page-exam-pqc-first-add",{firstRecordId:obj.firstRecordId,type:obj.type});

      },
      tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
        this._firstRecordId = selection[0].firstRecordId
        this._type = selection[0].type
      },deleteTableSelected(){
        this.table.selected =false
        this.tableEditDis = true
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/examinecenter/pqc/firstrecord/"+ss[i].firstRecordId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('pqc.ds'));
              that.refreshData();
            });
          }
        }
      },
      Toexamine(){
        let that=this;
        this.table.selected =false
        this.tableEditDis = true
      	let reviewList=this.$refs.pageTable.getSelection()
      	if(reviewList.length==0){
      		this.$Notice.warning({
            title: i18n.t('pqc.psa'),
            desc: ''
          });
          return;
      	}else{
      		that.Audit.status=true;
      	}
      },
      AuditOk(){
      	let that=this;
        let url='/examinecenter/pqc/firstrecord/audit?firstRecordId='
        let AuditRwo=this.$refs.pageTable.getSelection()
        let AuditList=[];
        //console.log(AuditRwo);
        for(let i=0;i<AuditRwo.length;i++) {
          if (AuditRwo[i].state == 4) {
            this.$Notice.warning({title: i18n.t("pqc.tsd")});
            return;
          }
        }
      	for(let i=0;i<AuditRwo.length;i++){
      		that.$http.post(url+AuditRwo[i].firstRecordId+"&state="+that.Audit.fieldName,that.headers).then((res)=>{
      		that.$Message.success(i18n.t('pqc.auditSuccess'));
      		that.Audit.status=false;
      		that.refreshData();
      	  })
      	}
      },
      AuditNo(){
      	let that=this
      	that.Audit.status=false;
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
</style>
