<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 210px; margin-right:8px;">
        <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('pqc.otf')" style="width: 200px"></DatePicker>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('pqc.sa')" slot="prepend" style="width: 125px;text-align:left;">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="refreshData();table.selected='';">{{$t("pqc.search")}}</Button>
        <Button type="ghost" @click="reset">{{$t("pqc.reset")}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <Button type="ghost" v-if="permsBtn.INSERT_DATA_RECORD" icon="plus" @click="addIqc">{{$t("pqc.add")}}</Button>
        <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.UPDATE_DATA_RECORD" icon="edit" @click="editSelectRow" :disabled="tableEditDis">{{$t("pqc.modify")}}</Button>
        <Poptip
          confirm
          :title="i18n.t('pqc.dsi')"
          :ok-text='i18n.t("pqc.confirm")'
          :cancel-text='i18n.t("pqc.cancel")'
          placement="bottom-start"
          @on-ok="deleteTableSelected">
          <Button v-if="permsBtn.DELETE_DATA_RECORD" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t("pqc.delete")}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second" style="font-size:0;">
        <Button type="text"  icon="refresh" @click="reset">{{$t("pqc.refresh")}}</Button>
        <Button type="primary" @click="rank">{{$t("pqc.customList")}}</Button>
        <Dropdown style="margin-left: 8px" v-if="permsBtn.EXPORT_DATA_RECORD">
          <Button type="ghost">{{$t("pqc.exportReport")}}<Icon style="margin-left:10px;" type="arrow-down-b"></Icon></Button>
          <DropdownMenu slot="list">
            <DropdownItem>
              <Button type="text" @click="exportStatement(1)">{{$t("pqc.pageData")}}</Button>
            </DropdownItem>
            <DropdownItem>
              <Button type="text" @click="exportStatement(3)">{{$t("pqc.allTheData")}}</Button>
            </DropdownItem>
            <DropdownItem>
              <Button type="text" @click="exportStatement(2)">{{$t("pqc.inspectReport")}}</Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table class="tableCustom" ref="pageTable"  @on-row-dblclick="onDBClick"  v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <div style="padding: 20px 0 20px 0px;">
            <Page v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                  :page-size-opts="[10,20,50,100]"
                  @on-change="pageChange" @on-page-size-change="pageSizeChange"
                  size="small" show-total show-elevator show-sizer></Page>
          </div>

        </div>
      </div>

    </div>
      <div class="arrangement-dialog">
      <Modal
      :title="i18n.t('pqc.customList')"
      v-model="arrangement.state"
      class="rankBox"
      :mask-closable="false"
      :width="600" >
      <span class="list_txt">{{$t("pqc.customList")}}</span>
       <div class="list_ok list">
        <div v-for="(item,index) in arrangement.data1" class="dataItem" :class="'check'+index"  :key="index">
          <input type="checkbox"   :value="item"  v-model="arrangement.data">
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
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        data:[
        ],
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
              className:this.$store.state.customerId?'hide':'',
              minWidth:this.$store.state.customerId?0:40,
              maxWidth:this.$store.state.customerId?0:40
            },
            // {title: '序号',
            //   width:80,
            //   render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
            //   align: 'center',
            //   minWidth:80,
            //   maxWidth:80
            // },
            {
              title: i18n.t("pqc.inspectTime"),
              className:'tablePadding',
              width: 106,
              minWidth:106,
              // align: 'center',
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
            },{
              title: i18n.t("pqc.batchNo"),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'batchNo'
            },{
              title: i18n.t("pqc.pn"),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'productNo'
            },{
              title: i18n.t("pqc.name"),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'productName'
            },{
              width:103,
              title: i18n.t("pqc.specifications"),
              className:'tablePadding',
              minWidth:103,
              ellipsis:true,
              key: 'productSpec'
            },{
              title: i18n.t("pqc.inspection"),
              className:'tablePadding',
              minWidth:76,
              width:76,
              ellipsis:true,
              key: 'inspectionTypeName'
            },{
              title: i18n.t("pqc.unit"),
              className:'tablePadding',
              minWidth:70,
              ellipsis:true,
              key: 'unitSymbol'
            },{
              title: i18n.t("pqc.sn"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?66:110,
              width:this.$store.state.locale=='zh_CN'?66:110,
              ellipsis:true,
              key: 'sampleQuantity'
            },
            // {
            //   title: 'Ca',
            //   minWidth:50,
            //   ellipsis:true,
            //   key: 'ca'
            // },
            {
                title: 'Cp',
                className:'tablePadding',
              width:46,
              minWidth:46,
              ellipsis:true,
              key: 'cp'
            },{
              title: 'Cpk',
              className:'tablePadding',
              width:46,
              minWidth:46,
              ellipsis:true,
              key: 'cpk'
            },
            // {
            //   title: 'Ppk',
            //   minWidth:50,
            //   ellipsis:true,
            //   key: 'ppk'
            // },
            {
              title: i18n.t("pqc.iec"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?96:220,
              ellipsis:true,
              width:this.$store.state.locale=='zh_CN'?96:220,
              
              key: 'chkDevTypeName'
            },{
              title: i18n.t("pqc.pl"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:120,
              width:this.$store.state.locale=='zh_CN'?70:120,
              
              ellipsis:true,
              key: 'prodLineName'
            },{
              title: i18n.t("pqc.pp"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:150,
              width:this.$store.state.locale=='zh_CN'?80:150,
              
              ellipsis:true,
              key: 'prodProcessName'
            },{
              title: i18n.t("pqc.inspector"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?60:80,
              width:this.$store.state.locale=='zh_CN'?60:80,
              
              ellipsis:true,
              key: 'operatorName'
            }
          ]
        },
        search: {
          query: "",
          fieldName: "",
          dates:[],
          userList:[],
          data: {
            searchTypes: [
              {
                label: i18n.t("pqc.sa"),
                value: ""
              }, {
                label: i18n.t("pqc.batchNo"),
                value: "batchNo"
              },{
                label: i18n.t("pqc.pn"),
                value: "productNum"
              },{
                label: i18n.t("pqc.name"),
                value: "productName"
              },{
                label: i18n.t("pqc.specifications"),
                value: "productSpec"
              },{
                label: i18n.t("pqc.inspection"),
                value: "inspectionTypeName"
              },{
                label: i18n.t("pqc.unit"),
                value: "unitSymbol"
              },{
                label: i18n.t("pqc.iec"),
                value: "chkDevTypeName"
              },{
                label: i18n.t("pqc.pl"),
                value: "prodLineName"
              },{
                label: i18n.t("pqc.pps"),
                value: "prodProcessName"
              },{
                label: i18n.t("pqc.inspector"),
                value: "operatorName"
              }
            ]
          }
        },
         rankData:[
            {
              title: i18n.t("pqc.inspectTime"),
              className:'tablePadding',
              width: 106,
              minWidth:106,
              // align: 'center',
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
            },{
              title: i18n.t("pqc.batchNo"),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'batchNo'
            },{
              title: i18n.t("pqc.pn"),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'productNo'
            },{
              title: i18n.t("pqc.name"),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'productName'
            },{
              width:103,
              title: i18n.t("pqc.specifications"),
              className:'tablePadding',
              minWidth:103,
              ellipsis:true,
              key: 'productSpec'
            },{
              title: i18n.t("pqc.inspection"),
              className:'tablePadding',
              minWidth:76,
              width:76,
              ellipsis:true,
              key: 'inspectionTypeName'
            },{
              title: i18n.t("pqc.unit"),
              className:'tablePadding',
              width:70,
              ellipsis:true,
              key: 'unitSymbol'
            },{
              title: i18n.t("pqc.sn"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?66:130,
              width:this.$store.state.locale=='zh_CN'?66:130,
              ellipsis:true,
              key: 'sampleQuantity'
            },
            // {
            //   title: 'Ca',
            //   minWidth:50,
            //   ellipsis:true,
            //   key: 'ca'
            // },
            {
                title: 'Cp',
                className:'tablePadding',
              width:46,
              minWidth:46,
              ellipsis:true,
              key: 'cp'
            },{
              title: 'Cpk',
              className:'tablePadding',
              width:46,
              minWidth:46,
              ellipsis:true,
              key: 'cpk'
            },
            // {
            //   title: 'Ppk',
            //   minWidth:50,
            //   ellipsis:true,
            //   key: 'ppk'
            // },
            {
              title: i18n.t("pqc.iec"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?96:240,
              ellipsis:true,
              width:this.$store.state.locale=='zh_CN'?96:240,
              
              key: 'chkDevTypeName'
            },{
              title: i18n.t("pqc.pl"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:130,
              width:this.$store.state.locale=='zh_CN'?70:130,
              
              ellipsis:true,
              key: 'prodLineName'
            },{
              title: i18n.t("pqc.pp"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:160,
              width:this.$store.state.locale=='zh_CN'?80:160,
              
              ellipsis:true,
              key: 'prodProcessName'
            },{
              title: i18n.t("pqc.inspector"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?60:100,
              width:this.$store.state.locale=='zh_CN'?60:100,
              
              ellipsis:true,
              key: 'operatorName'
            },{
              title: i18n.t("pqc.pc"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:160,
              width:this.$store.state.locale=='zh_CN'?80:160,
              ellipsis:true,
              key: 'prodTypeName'
            },{
              title: i18n.t("pqc.bn"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?60:120,
              width:this.$store.state.locale=='zh_CN'?60:120,
              ellipsis:true,
              key: 'batchQuantity'
            },{
              title: i18n.t("pqc.unitSymbol"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?76:100,
              width:this.$store.state.locale=='zh_CN'?76:100,
              ellipsis:true,
              key: 'measUnitName'
            },{
              title: 'USL',
              className:'tablePadding',
              minWidth:56,
              width:56,
              ellipsis:true,
              key: 'usl'
            },{
              title: 'SL',
              className:'tablePadding',
              minWidth:40,
              width:40,
              ellipsis:true,
              key: 'sl'
            },{
              title: 'LSL',
              className:'tablePadding',
              minWidth:56,
              width:56,
              ellipsis:true,
              key: 'lsl'
            }
         ],
        //获取产品编号/名称/客户信息
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
        //排序
        arrangement:{
          state:false,
          data:[],
          data1:[],
        },
        permsCur:[
          "INSERT_DATA_RECORD",
          "DELETE_DATA_RECORD",
          "UPDATE_DATA_RECORD",
          "SELECT_DATA_RECORD",
          "EXPORT_DATA_RECORD",
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "INSERT_DATA_RECORD":false,
          "SELECT_DATA_RECORD":false,
          "UPDATE_DATA_RECORD":false,
          "DELETE_DATA_RECORD":false,
          "EXPORT_DATA_RECORD":false
        },


      }
    },//end data
    watch:{
      renderList:function(a,b){
        if(a){
          this.reset();
        }
      }
    },
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
    computed:{
      renderList (){
        return this.$store.state.renderExamList;
      }
    },

    methods:{
      reset(){
        this.search.dates=[];
        this.table.selected='';
        this.search.query='';
        this.search.fieldName='';
        this.refreshData();
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
      },modalOk(){
        //console.log(this.editModal.item);
        this.editModal.requesting = true;
        // this.editModal.item.prodLineTypeId = null;
        // if(this.editModal.item.prodLineTypeValue && this.editModal.item.prodLineTypeValue.length > 0){
        //   let plt = this.editModal.item.prodLineTypeValue[this.editModal.item.prodLineTypeValue.length-1];
        //   if(plt){
        //     this.editModal.item.prodLineTypeId = plt;
        //   }
        // }

        if(!this.editModal.item.name || !this.editModal.item.judgeId
          //|| !this.editModal.item.reviewer1Id || !this.editModal.item.reviewer2Id
          //|| !this.editModal.item.reviewer3Id || !this.editModal.item.reviewer4Id
          || !this.editModal.item.auditorId){
          this.$Notice.warning({
            title: i18n.t("pqc.naa"),
            desc: ''
          });
          this.editModal.requesting = false;
          return;
        }
        let that = this;
        if(this.editModal.item.prodLineId){
          that.$http.put("/basic/reviewprocess",that.editModal.item).then(function (resp) {
            that.refreshData();
            that.$Message.success(i18n.t("pqc.ats"));
            that.editModal.show = false;
          });
        }else{
          that.$http.post("/basic/reviewprocess",that.editModal.item).then(function (resp) {
            that.refreshData();
            that.$Message.success(i18n.t("pqc.as"));
            that.editModal.show = false;
          });
        }

        //this.editModal = true;
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
          url = '/examinecenter/pqc/datarecord/export/list';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          params.query = this.search.query;
          params.fieldName = this.search.fieldName;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            params.startDate = this.$iqis.utils.getDayStart(1,sdate);
            params.endDate = this.$iqis.utils.getDayEnd(edate);
          }
        }
        if(index == 3){
          url = '/examinecenter/pqc/datarecord/export/list';
          params.page = 1;
          params.limit = this.table.pager.total;
          params.query = this.search.query;
          params.fieldName = this.search.fieldName;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            params.startDate = this.$iqis.utils.getDayStart(1,sdate);
            params.endDate = this.$iqis.utils.getDayEnd(edate);
          }
        }
        if(index == 2){
          url = '/examinecenter/pqc/datarecord/export/report'
          let reviewList=this.$refs.pageTable.getSelection()
          if( reviewList.length != 1){
            this.$Notice.warning({
              title: i18n.t("pqc.spde"),
            });
            return;
          }
          params.dataRecordId = reviewList[0].dataRecordId
        }

        this.$iqis.download(url,params,methods,()=>{}) //下载文件
      },
      addIqc(){
        this.$emit("open-tab","exam-pqc-cpk-add",i18n.t("pqc.atdcpk"),"page-exam-pqc-cpk-add",null);
      },
      onCClick(obj,index){
        // //console.log(obj)
        this.data[index]._checked = !this.data[index]._checked;
      },
      /**双击打开 */
      onDBClick(obj,index){
           this.$emit("open-tab","exam-pqc-cpk-add-"+obj.dataRecordId,i18n.t("pqc.mtdcpk")+"-"+obj.productName,"page-exam-pqc-cpk-add",{dataRecordId:obj.dataRecordId});
         
      },
      editSelectRow(e){
           let selectedRow = this.$refs.pageTable.getSelection()
           //console.log(selectedRow);
           if(!selectedRow || selectedRow.length != 1){
             this.$Notice.warning({
               title: i18n.t("pqc.yms"),
               desc: ''
             });
             return;
           }

           this.$emit("open-tab","exam-pqc-cpk-add-"+selectedRow[0].dataRecordId,i18n.t("pqc.mtdcpk")+"-"+selectedRow[0].productName,"page-exam-pqc-cpk-add",{dataRecordId:selectedRow[0].dataRecordId});
      },tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
        //console.log(this.table.selected)
        //console.log(selection)
      },deleteTableSelected(){
           let ss = this.$refs.pageTable.getSelection();
           let that = this;
           if(ss && ss.length > 0){
             let delArr = [];
             for(let i=0;i<ss.length;i++){
               delArr.push(this.$http.delete("/examinecenter/pqc/datarecord/"+ss[i].dataRecordId));
             }

             if(delArr.length > 0){
               this.$http.all(delArr).then(function (resps) {
                 that.$Message.success(i18n.t("pqc.ds"));
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
        that.table.selected='';
        that.table.loading = true;
        let params = {};
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;
        params.customerId = this.$store.state.customerId||'';
        //console.log(params.customerId)
        if(this.search.dates && this.search.dates[0]){
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];

          params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          params.endDate = this.$iqis.utils.getDayEnd(edate);
        }

        this.$http.get("/examinecenter/pqc/datarecord",{params:params}).then(function (resp) {
          for(let i=0;i<resp.data.length;i++){
            resp.data[i]._checked = false;
          }
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
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
        that.urlProduct.dataList.splice(-6,6)
        that.arrangement.data=that.urlProduct.dataList;
      },
      //排序确定
      RankOk(){
        if(this.arrangement.data.length===0){
         this.$Notice.warning({
            title: i18n.t("pqc.lcrs"),
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
<style >
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
</style>
