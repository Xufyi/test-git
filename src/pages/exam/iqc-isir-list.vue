<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
       <DatePicker type="daterange" v-model="search.dates" :placeholder="i18n.t('iqc.dateFilter')" style="width: 210px"></DatePicker>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select v-model="search.status" :placeholder="i18n.t('iqc.state')" clearable style="width: 100px;">
          <Option v-for="st in search.statusList" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model.trim="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('iqc.searchAll')" slot="prepend" style="width: 110px;text-align: left">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="table.selected='';refreshData()">{{$t('iqc.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t('iqc.reset')}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <!-- <Button type="ghost" icon="refresh" @click="refreshData">刷新</Button> -->
        <Button style="margin-right:8px;" type="ghost" v-if="permsBtn.INSERT_ISIR" icon="plus" @click="addIqc">{{$t('iqc.add')}}</Button>
        <Button style="margin-right:8px;" type="ghost" v-if="permsBtn.UPDATE_ISIR" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t('iqc.edit')}}</Button>
        <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
          confirm
          :title="i18n.t('iqc.confirmDelete')"
          placement="bottom-start"
          @on-ok="deleteTableSelected">
          <Button type="ghost" v-if="permsBtn.DELETE_ISIR" icon="trash-a" :disabled="!table.selected">{{$t('iqc.delete')}}</Button>
        </Poptip>
        <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.AUDIT_ISIR" @click="Toexamine" :disabled="!table.selected" icon="android-list">{{$t('iqc.audit')}}</Button>
        <Button type="ghost" icon="ios-copy" v-if="permsBtn.INSERT_ISIR" :disabled="tableEditDis" @click="copySelectRow" >{{$t('product.copy')}}</Button>
      </div>
      <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="reset">{{$t('iqc.refreshData')}}</Button>
        <!-- <Button type="primary" @click="rank">{{$t('iqc.customList')}}</Button> -->
        <Dropdown style="margin-left: 5px"  v-if="permsBtn.EXPORT_ISIR">
          <Button type="ghost">{{$t('iqc.export')}}<Icon style="padding-left:10px;" type="arrow-down-b"></Icon></Button>
          <DropdownMenu slot="list">
              <DropdownItem>
                <Button type="text" @click="exportStatement(1)">{{$t('iqc.thisPage')}}</Button>
              </DropdownItem>
              <DropdownItem>
                <Button type="text" @click="exportStatement(3)">{{$t('iqc.allData')}}</Button>
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
          <Table id="table" ref="pageTable" class="tableCustom"  @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
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
      :title="i18n.t('iqc.audit')"
      v-model="Audit.status"
      :mask-closable="false"
      :width="300" >
        <Select v-model="Audit.fieldName" style="width:200px">
           <Option v-for="(item,index) in Audit.resultStats" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        <div slot="footer">
        <Button type="primary" size="large" @click="AuditOk" >{{$t('iqc.confirm')}}</Button>
        <Button type="text" size="large" @click="AuditNo">{{$t('iqc.cancel')}}</Button>
      </div>
      </Modal>
    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->

  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import draggable from 'vuedraggable';
  import $ from 'jquery';
  export default {
    components: {
      Input,draggable
    },
    props:["params","tabKey"],
    data: function () {
      let vm = this;
      return {
        isZH:'',
        i18n:window.i18n,
      	headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        data:[],
        tableEditDis:true,
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
            {
              type: 'selection',
              align: 'center',
              width:40,
              minWidth:40,
              maxWidth:40
            },
            {
              title: "时间",
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?106:120,
              minWidth:this.$store.state.locale=='zh_CN'?106:120,
              // align: 'center',
              ellipsis:true,
              key: 'createTime',
              render:function(h,data){
                let value = data.row.createTime;
                let str = "-"
                if(value){
                  var unixTimestamp = new Date(value);
                  str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                }
                return h("span",str);
              }
            },{
              title: i18n.t('iqc.supplier'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'manufacturerName'
            },{
              title: i18n.t('iqc.productNo'),
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'prodNo',
            },{
              title: i18n.t('iqc.productName'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'prodName',
            },{
              title: "重量",
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'sampleWeight',
            },
            {
              title: "送样数量",
              className:'tablePadding',
              width:100,
              minWidth:60,
              ellipsis:true,
              key: 'sampleQuantity',
            },
            {
              title: "送样次数",
              className:'tablePadding',
              width:100,
              minWidth:100,
              ellipsis:true,
              key: 'sampleNum'
            },{
              title: i18n.t('iqc.state'),
              className:'tablePadding',
              width:100,
              minWidth:100,
              ellipsis:true,
              key: 'state',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('iqc.inspecting'),1:i18n.t('iqc.unaudited'),2:"<span style='color:green;'>"+i18n.t('iqc.auditPass')+"</span>",3:"<span style='color:red;'>"+i18n.t('iqc.auditReject')+"</span>"})
            },
            {
              title: i18n.t('iqc.iqcNo'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?103:115,
              minWidth:this.$store.state.locale=='zh_CN'?103:115,
              ellipsis:true,
              key: 'isirNo'
            },{
              title: i18n.t('iqc.inspector'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:100,
              ellipsis:true,
              key: 'inspectorName'
            },{
              title: i18n.t('iqc.auditor'),
              className:'tablePadding',
              minWidth:70,
              ellipsis:true,
              key: 'auditorName'
            }
          ]
        },
        Audit:{//审核状态
        	status:false,
        	resultStats:[
            {value:"2",label:i18n.t('iqc.auditPass')},
            {value:"3",label:i18n.t('iqc.auditReject')},
          ],
          fieldName:'2',
        },
        search: {
          query: "",
          fieldName: "",
          status:"",
          userList:[],
          statusList:[
            {value:"",label:i18n.t('iqc.all')},
            {value:"0",label:i18n.t('iqc.inspecting')},
            {value:"1",label:i18n.t('iqc.unaudited')},
            {value:"2",label:i18n.t('iqc.auditPass')},
            {value:"3",label:i18n.t('iqc.auditReject')}
          ],
          data: {
            searchTypes: [
              {
                label: i18n.t('iqc.searchAll'),
                value: ""
              }, {
                label: i18n.t('iqc.supplier'),
                value: "manufacturerName"
              }, {
                label: i18n.t('iqc.productNo'),
                value: "prodNo"
              }, {
                label: i18n.t('iqc.productName'),
                value: "prodName"
              }, {
                label: i18n.t('iqc.iqcNo'),
                value: "isirNo"
              }, {
                label: i18n.t('iqc.inspector'),
                value: "inspectorName"
              }, {
                label: i18n.t('iqc.auditor'),
                value: "auditorName"
              }
            ]
          }
        },
        permsCur:[
          "EXPORT_ISIR",
          "UPDATE_ISIR",
          "SELECT_ISIR",
          "INSERT_ISIR",
          "DELETE_ISIR",
          "AUDIT_ISIR",
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "EXPORT_ISIR":false,
          "UPDATE_ISIR":false,
          "SELECT_ISIR":false,
          "INSERT_ISIR":false,
          "DELETE_ISIR":false,
          "AUDIT_ISIR":false,
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
          // this.refreshData(1);
          this.reset();
        } 
      }
    },
    computed:{
      renderList (){
        //console.log(this.$store.state.renderExamList)
        return this.$store.state.renderExamList;
      }
    },

    methods:{
      copySelectRow(){
        let selectedRow = this.$refs.pageTable.getSelection()
        this.$emit("open-tab","exam-iqc-first-add-"+selectedRow[0].isirId,"复制初样检验","page-exam-iqc-first-add",{copyId:selectedRow[0].isirId});
      },
      reset(){
        this.table.selected='';
        this.search.status='';
        this.search.dates='';
        this.search.fieldName='';
        this.search.query='';
        this.tableEditDis = true;
        this.pageChange(1);
        this.refreshData(1);
      },
      /** 
       * 导出报表
       * index 为 1 时为导出当前条件列表
       * index 为 2 时为导出检验报告
       */
      exportStatement (index){
        let that = this;
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        if(index == 1){ 
          url = '/isir/exportList';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          params.query='state%3D'+that.search.status+'%26field%3D'+that.search.fieldName+'%26keyword%3D'+that.search.query;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            let startDate = this.$iqis.utils.getDayStart(1,sdate);
            let endDate = this.$iqis.utils.getDayEnd(edate);
            params.query='startDate%3D'+startDate+'%26endDate%3D'+endDate+'%26state%3D'+that.search.status+'%26field%3D'+that.search.fieldName+'%26keyword%3D'+that.search.query;
          }
        }
        if(index == 2){
          url = '/isir/exportReport/'
          let reviewList=this.$refs.pageTable.getSelection()
          if( reviewList.length != 1){
            this.$Notice.warning({
                title: i18n.t('iqc.exportChooseOne'),
            });
            return;
          }
          params.isirId = reviewList[0].isirId
        }
        if(index == 3){ 
          url = '/isir/exportList';
          params.page = 1;
          params.limit = this.table.pager.total;
          params.query='state%3D'+that.search.status+'%26field%3D'+that.search.fieldName+'%26keyword%3D'+that.search.query;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            let startDate = this.$iqis.utils.getDayStart(1,sdate);
            let endDate = this.$iqis.utils.getDayEnd(edate);
            params.query='startDate%3D'+startDate+'%26endDate%3D'+endDate+'%26state%3D'+that.search.status+'%26field%3D'+that.search.fieldName+'%26keyword%3D'+that.search.query;
          }
        }
        //console.log(params)
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
      }
      ,
      addIqc(){
        this.$emit("open-tab","exam-iqc-first-add","添加初样检验","page-exam-iqc-first-add",null);
      },
      //评审
      Toexamine(){
      	let that=this;
      	let reviewList=this.$refs.pageTable.getSelection()
      	if(reviewList.length==0){
      		this.$Notice.warning({
            title: i18n.t('iqc.auditChooseOne'),
            desc: ''
          });
          return;
      	}else{
      		that.Audit.status=true;
      	}
      },
      AuditOk(){
      	let that=this;
      	let url='/isir/audit?isirId='
        let AuditRwo=this.$refs.pageTable.getSelection()
      	for(let i=0;i<AuditRwo.length;i++){
      		that.$http.post(url+AuditRwo[i].isirId+"&state="+that.Audit.fieldName,that.headers).then((res)=>{
      		that.$Message.success(i18n.t('iqc.auditSuccess'));
      		that.Audit.status=false;
      		that.refreshData();
      	  })
      	}
      },
      AuditNo(){
      	let that=this
      	that.Audit.status=false;
      },
      editSelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        this.$emit("open-tab","exam-iqc-first-add-"+selectedRow[0].isirId,"修改初样检验-"+selectedRow[0].prodName,"page-exam-iqc-first-add",{isirId:selectedRow[0].isirId});
      },
      /**双击打开 */
      onDBClick(obj,index){
        this.$emit("open-tab","exam-iqc-first-add-"+obj.isirId,"修改初样检验-"+obj.prodName,"page-exam-iqc-first-add",{isirId:obj.isirId});
      },
      tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
      },
      
      deleteTableSelected(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/isir/"+ss[i].isirId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('iqc.deleteSuccess'));
              that.refreshData();
            });
          }
        }

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

        // 列表接口
        this.$http.get("/isir/list",{params:params}).then(function (resp) {
          that.table.loading = false;
          
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
        })
        
        this.$store.commit("RENDER_CHANGE",false);
      },
    }//end methods



  }

</script>
<style scoped>
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
</style>
