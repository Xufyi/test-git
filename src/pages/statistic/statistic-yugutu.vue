<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
       <DatePicker type="daterange" v-model="search.dates" :placeholder="i18n.t('statistical.dateFilter')" style="width: 210px"></DatePicker>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input v-model.trim="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('statistical.searchAll')" slot="prepend" style="width: 110px;text-align: left">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 24px;">
        <Button type="primary" @click="table.selected='';refreshData()">{{$t('statistical.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t('statistical.reset')}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary">
        <!-- <Button type="ghost" icon="refresh" @click="refreshData">刷新</Button> -->
        <Button type="ghost"  icon="plus" @click="addIqc" v-if='INSERT_FISHBONE'>{{$t('statistical.add')}}</Button>
        <Button type="ghost"  icon="edit" :disabled="tableEditDis" v-if='UPDATE_FISHBONE' @click="editSelectRow">{{$t('statistical.edit')}}</Button>
        <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
          confirm
          :title="i18n.t('statistical.confirmDelete')"
          placement="bottom-start"
          @on-ok="deleteTableSelected">
          <Button type="ghost"  icon="trash-a" :disabled="!table.selected" v-if="DELETE_FISHBONE">{{$t('statistical.delete')}}</Button>
        </Poptip>
        <Button type="ghost"  :disabled="tableEditDis" @click="Toexamine"  icon="android-list">{{$t('statistical.viewChart')}}</Button>
      </div>
      <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="reset">{{$t('statistical.refreshData')}}</Button>
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table  :no-data-text="i18n.t('noData')" ref="pageTable" class="tableCustom"  @on-row-dblclick="onDBClick" :height="430" v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display:inline-block;"> -->
            <div style="padding: 20px 0 20px 0px;">
              <Page id="pageId" v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
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
  export default {
    components: {
      Input,draggable
    },
    props:["params","tabKey"],
    data: function () {
      let vm = this;
      return {
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
            {type: 'selection',
              align: 'center',
              width:40,
              minWidth:40,
              maxWidth:40
            },
            {
              title: i18n.t('statistical.analysisDate'),
              width:90,
              minWidth:90,
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
              title: i18n.t('statistical.analysisNo'),
              width:this.$store.state.locale=='zh_CN'?80:100,
              minWidth:this.$store.state.locale=='zh_CN'?80:100,
              ellipsis:true,
              key: 'number'
            },{
              title: i18n.t('statistical.analysisItem'),
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'project',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('statistical.analysisPurpose'),
              width:this.$store.state.locale=='zh_CN'?80:120,
              minWidth:this.$store.state.locale=='zh_CN'?80:120,
              ellipsis:true,
              key: 'purpost',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('statistical.analysisPeople'),
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'analystName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },
            {
              title: i18n.t('statistical.analysisResult'),
              width:this.$store.state.locale=='zh_CN'?80:100,
              minWidth:this.$store.state.locale=='zh_CN'?50:100,
              ellipsis:true,
              key: 'result'
            },{
              title: i18n.t('statistical.analysisRemarks'),
              minWidth:54,
              ellipsis:true,
              key: 'remarks',
            },
          ]
        },
        Audit:{//审核状态
        	status:false,
        	resultStats:[
            {value:"2",label:i18n.t('statistical.auditPass')},
            {value:"3",label:i18n.t('statistical.auditReject')},
          ],
          fieldName:'2',
        },
        //排序
        arrangement:{
          state:false,
          data:[],
          data1:[],
        },
        urlProduct:{
          no:[],
          name:[],
          prodTypeName:[],
          cityList:[],
          prodTypeId:'',
          customerList:[],
          dataList:[],
          index:1
        },
         rankData:[
            {type: 'selection',
              align: 'center',
              width:40,
              minWidth:40,
              maxWidth:40
            },
            {
              title: i18n.t('statistical.analysisDate'),
              width:90,
              minWidth:90,
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
              title: i18n.t('statistical.analysisNo'),
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'manufacturerName'
            },{
              title: i18n.t('statistical.analysisItem'),
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'productInfo.no',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('statistical.analysisPurpose'),
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'productInfo.name',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('statistical.analysisPeople'),
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'productInfo.spec',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },
            {
              title: i18n.t('statistical.analysisResult'),
              width:80,
              minWidth:50,
              ellipsis:true,
              key: 'totalQuantity'
            },{
              title: i18n.t('statistical.analysisRemarks'),
              minWidth:54,
              ellipsis:true,
              key: 'result',
              render:(h,params)=>{
                return h('span',{style:{'color':params.row.result == 1 ? 'green' : 'red'}},params.row.result == 1 ? i18n.t('statistical.qualified') : i18n.t('statistical.unqualified'))
              }
            },
          ],
        search: {
          query: "",
          number: "",
          fieldName:'',
          project:"",
          purpost:"",
          analystName:'',
          data: {
            searchTypes: [
              {
                label: i18n.t('statistical.searchAll'),
                value: ""
              }, {
                label: i18n.t('statistical.analysisNo'),
                value: "number"
              }, {
                label: i18n.t('statistical.analysisItem'),
                value: "project"
              }, {
                label: i18n.t('statistical.analysisPurpose'),
                value: "purpost"
              }, {
                label: i18n.t('statistical.analysisPeople'),
                value: "analystName"
              },
               {
                label: i18n.t('statistical.analysisResult'),
                value: "result"
              },
               {
                label: i18n.t('statistical.analysisRemarks'),
                value: "remarks"
              },
            ]
          }
        },
        INSERT_FISHBONE:false,
        DELETE_FISHBONE:false,
        UPDATE_FISHBONE:false
      }
    },//end data

    created(){
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$http.get('/tenant/user/profile').then(res=>{
        for(let i=0;i<res.data.permissions.length;i++){
          if(res.data.permissions[i] === "INSERT_FISHBONE"){
            this.INSERT_FISHBONE = true;
          }
          if(res.data.permissions[i] === "DELETE_FISHBONE"){
            this.DELETE_FISHBONE = true;
          }
          if(res.data.permissions[i] === "UPDATE_FISHBONE"){
            this.UPDATE_FISHBONE = true;
          }
        }
        this.refreshData();
      });
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
        // console.log(this.$store.state.renderExamList)
        return this.$store.state.renderExamList;
      }
    },

    methods:{
      // //点击跳转到输入的页码
      // goElevatorPage(){
      //   var evtObj;
      //   var thisPage=document.getElementById('pageId');
        // console.log(thisPage);
      //   var elevatorDiv=thisPage.getElementsByClassName("ivu-page-options-elevator");
      //   if(elevatorDiv && elevatorDiv.length>0){
      //       var pageInput = elevatorDiv[0].getElementsByTagName("input")[0];
      //           if (window.KeyEvent) {//firefox 浏览器下模拟事件
      //               evtObj = document.createEvent('KeyEvents');
      //               evtObj.initKeyEvent("keyup", true, true, window, true, false, false, false, 13, 0);
      //           } else {//chrome 浏览器下模拟事件
      //               evtObj = document.createEvent('UIEvents');
      //               evtObj.initUIEvent("keyup", true, true, window, 1);
      //               delete evtObj.keyCode;
      //               if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
      //                   Object.defineProperty(evtObj, "keyCode", { value: 13 });                       
      //               } else {
      //                   evtObj.key = String.fromCharCode(13);
      //               }
      //           }
      //           pageInput.dispatchEvent(evtObj);
      //   }
      // },
      reset(){
        this.table.selected='';
        this.search.result='';
        this.search.status='';
        this.search.dates='';
        this.search.fieldName='';
        this.search.query='';
        this.pageChange(1);
        this.refreshData(1);
      },
      /** 
       * 导出报表
       * index 为 1 时为导出当前条件列表
       * index 为 2 时为导出检验报告
       */
      exportStatement (index){
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        if(index == 1){ 
          url = '/examinecenter/iqc/iqc/export/list';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          params.query = this.search.query;
          params.fieldName = this.search.fieldName;
          params.result = this.search.result;
          params.state = this.search.status;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            params.startDate = this.$iqis.utils.getDayStart(1,sdate);
            params.endDate = this.$iqis.utils.getDayEnd(edate);
          }
        }
        if(index == 2){
          url = '/examinecenter/iqc/iqc/export/report'
          let reviewList=this.$refs.pageTable.getSelection()
          if( reviewList.length != 1){
            this.$Notice.warning({
                title: i18n.t('statistical.exportChooseOne'),
            });
            return;
          }
          params.iqcId = reviewList[0].iqcId
        }
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
        this.$emit("open-tab","page-yugutu-change",i18n.t('statistical.addCausality'),"page-yugutu-change",null);
      },
      //评审
      Toexamine(){
        let selectedRow = this.$refs.pageTable.getSelection()
        // console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t('statistical.viewChooseOne'),
            desc: ''
          });
          return;
        }
        this.$emit("open-tab","page-yugutu"+selectedRow[0].fishboneId,i18n.t('statistical.viewCausality')+"-"+selectedRow[0].project,"page-yugutu",{fishboneId:selectedRow[0].fishboneId});
      },
      AuditOk(){
      	let that=this;
      	let url='/examinecenter/iqc/iqc/audit?iqcId='
        let AuditRwo=this.$refs.pageTable.getSelection()
      	for(let i=0;i<AuditRwo.length;i++){
      		that.$http.post(url+AuditRwo[i].iqcId+"&state="+that.Audit.fieldName,that.headers).then((res)=>{
      		that.$Message.success(i18n.t('statistical.aduitSuccess'));
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
        // console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          // this.$Notice.warning({
          //   title: '必须选择一条记录后才可以进行修改',
          //   desc: ''
          // });
          return;
        }
        this.$emit("open-tab","page-yugutu-change"+selectedRow[0].fishboneId,i18n.t('statistical.editCausality')+"-"+selectedRow[0].project,"page-yugutu-change",{fishboneId:selectedRow[0].fishboneId});

      },
      /**双击打开 */
      onDBClick(obj,index){
        this.$emit("open-tab","page-yugutu-change"+obj.fishboneId,i18n.t('statistical.editCausality')+"-"+obj.project,"page-yugutu-change",{fishboneId:obj.fishboneId});
      },
      tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
      },deleteTableSelected(){
        let ss = this.$refs.pageTable.getSelection();
        if(ss.length <=0){
          this.$Notice.warning({
            title: i18n.t('statistical.deleteChooseOne'),
            desc: ''
          });
          return;
        }
        for(let i=0;i<ss.length;i++){
          this.$http.delete('/basic/fishbone/'+ss[i].fishboneId).then(res=>{
            if(i == ss.length-1){
              this.refreshData();
              this.$Message.success(i18n.t('statistical.deleteSuccess'));
            }
          });
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
          params.query='startDate='+startDate+'&endDate='+endDate+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }else{
          params.query='field='+that.search.fieldName+'&keyword='+that.search.query;
        }

        this.$http.get("/basic/fishbone",{params:params}).then(function (resp) {
          that.table.loading = false;
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
        })
        
        this.$store.commit("RENDER_CHANGE",false);
      },

 			//自定义排序
       rank(){
        let that=this;
        if(that.urlProduct.index===1){
            that.defaultData()
        }else{
           that.arrangement.data=that.arrangement.data;
        }
        that.arrangement.data1=that.rankData;
        that.arrangement.state=true;
      },
      ReplyOk(){
        this.defaultData()
      },
      //默认排序
      defaultData(){
        let that=this;
        that.urlProduct.index=1;
        that.urlProduct.dataList=that.rankData.concat();
        that.urlProduct.dataList.splice(-3,3)
        that.arrangement.data=that.urlProduct.dataList;
      },
      //排序确定
      RankOk(){
        if(this.arrangement.data.length===0){
         this.$Notice.warning({
            title: i18n.t('statistical.listNull'),
            desc: ''
          });
          return;
        }
        let data=[{type: 'selection',align: 'center',width:40,minWidth:40,maxWidth:40}]
        let dataList=data.concat(this.arrangement.data)
        this.table.columns=dataList;
        this.urlProduct.index=2;
        this.arrangement.state=false;
      },
      // 默认数据显示
      RankNo(){
        this.arrangement.state=false;
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
  .ivu-table-wrapper{
    height:auto!important;
    overflow: auto!important;
  }
  .ivu-table-overflowY{
    height:auto!important;
    
  }
</style>
