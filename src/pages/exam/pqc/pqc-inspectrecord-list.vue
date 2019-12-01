<template>
  <div class="iqis-page">
    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <!-- <div class="iqis-bus-tree treeCustom" style="display: -webkit-flex;display: flex;flex-direction: column;flex: 0 0 185px;font-size: 14px;overflow: auto; border: 1px solid #e9eaec;margin-right: 16px;margin-top:11px;padding-left: 10px;" :style="treeStyle">
          <div class="iqis-page-tool-row iqis-tree-tool" style="flex: 0 0 47px;" >
            <div style="display: -webkit-flex;display: flex;justify-content:space-between;width: 100%;">
              <div class="iqis-page-tool-primary" style="padding: 12px 6px;">
                <Poptip
                  v-model="tree.add"
                  :title='i18n.t("quality.pecn")'
                  @on-popper-show="treeAddInit"
                  placement="bottom-start">
                  <Button  type="ghost" :title='i18n.t("quality.al")'>{{$t("quality.addCategory")}}</Button>
                  <div class="iqis-poptip-content" slot="content">
                    <i-input :autofocus="true" ref="addTxt" v-model="tree.newNodeName" :max-length="20">
                    <Button slot="append" @click="addNewNode">{{$t("quality.confirm")}}</Button>
                    </i-input>
                  </div>
                </Poptip>
              </div>
              <div class="iqis-page-tool-second" :style="locale == 'zh_CN' ? 'padding: 12px 10px;' : 'padding: 12px 8px;'">
                <Poptip
                  v-model="tree.edit"
                  :title='i18n.t("quality.pen")'
                  @on-popper-show="treeEditInit"
                  placement="bottom-start">
                  <Button type="ghost" :disabled="!tree.selected">{{$t("quality.modify")}}</Button>
                  <div class="iqis-poptip-content" slot="content">
                    <i-input ref="editTxt" v-on:focus.native="selectAll" v-model="tree.newNodeName" :max-length="20">
                    <Button slot="append" @click="editNode">{{$t("quality.confirm")}}</Button>
                    </i-input>
                  </div>
                </Poptip>
                <Poptip
                  confirm
                  :title='i18n.t("quality.ay")'
                  placement="bottom-start"
                  @on-ok="deleteTreeNode"
                  :ok-text='i18n.t("quality.confirm")'
                  :cancel-text='i18n.t("quality.cancel")'>
                  <Button type="ghost" :disabled="!tree.selected">{{$t("quality.delete")}}</Button>
                </Poptip>
              </div>
            </div>
          </div>
          <div style="flex: 1 1 100px;overflow: auto;">
            <Tree ref="tree" :data="category" :multiple="false" @on-select-change="treeSelectChange" ></Tree>
          </div>
        </div> -->
        <TreeCategory ref="treeCategory" :treeData="treeData" v-on:changeTreeNode="changeTreeNode"></TreeCategory><!--树组件引用-->
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">
          <div class="iqis-page-search-row">
            <div class="iqis-page-search-bar-item" style="flex:0 0 210px;">
              <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('pqc.otf')" style="width: 200px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.result" :placeholder="i18n.t('pqc.sa')" slot="prepend" style="width: 110px;text-align:left;">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
              <Button style="margin-right:8px;" type="primary" @click="table.selected='';refreshData(1)">{{$t("pqc.search")}}</Button>
              <Button type="ghost" @click="reset">{{$t("pqc.reset")}}</Button>
            </div>
          </div>
          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <Button type="ghost" v-if="permsBtn.INSERT_INSPECTION_RECORD" icon="plus" @click="addIqc">{{$t("pqc.add")}}</Button>
              <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.UPDATE_INSPECTION_RECORD" icon="edit" @click="editSelectRow" :disabled="tableEditDis">{{$t("pqc.modify")}}</Button>
              <Poptip
                confirm
                :title="i18n.t('pqc.dsi')"
                placement="bottom-start"
                :ok-text='i18n.t("pqc.confirm")'
                :cancel-text='i18n.t("pqc.cancel")'
                @on-ok="deleteTableSelected">
                <Button v-if="permsBtn.DELETE_INSPECTION_RECORD" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t("pqc.delete")}}</Button>
              </Poptip>
            </div>
            <div class="iqis-page-tool-second" style="font-size:0;">
              <Button type="text"  icon="refresh" @click="reset">{{$t("pqc.refresh")}}</Button>
              <!-- <Dropdown style="margin-left: 8px" v-if="permsBtn.EXPORT_DATA_RECORD"> -->
              <Dropdown style="margin-left: 8px">
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
                <Table class="tableCustom" ref="pageTable" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
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
      </div>
    </div>
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
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->



  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import draggable from 'vuedraggable'
  import $ from "jquery";
  import TreeCategory from "../../../components/treeCategory/TreeCategory"
  export default {
    components: {
      Input,draggable,TreeCategory
    },
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        locale:'zh_CN',
        snsData:null,
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        data:[
        ],
        tableEditDis:true,
        category:[{
          title: i18n.t('monitor.category'),
          loading: false,
          children: []
        }],
        tree:{
          newNodeName:"",
          add:false,
          edit:false,
          selected:false
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
              minWidth:40,
              maxWidth:40
            },
            {
              // title: "时间",
              title: i18n.t('pqc.time'),
              className:'tablePadding',
              width:106,
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
              // title: "分类",
              title: i18n.t("pqc.cf"),
              className:'tablePadding',
              width:106,
              minWidth:106,
              // align: 'center',
              ellipsis:true,
              key: 'inspectionRecordTypeName',
            },{
              title: i18n.t("pqc.pn"),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'productNo',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t("pqc.name"),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'productName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t("pqc.specifications"),
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'spec',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t("pqc.pl"),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?70:120,
              minWidth:this.$store.state.locale=='zh_CN'?70:120,
              ellipsis:true,
              key: 'productLineName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t("pqc.department"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:100,
              ellipsis:true,
              key: 'departmentName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              // title: "状态",
              title: i18n.t("pqc.status"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:100,
              ellipsis:true,
              key: 'state',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('pqc.inspecting'),1:i18n.t('pqc.completed')})
            },{
              // title: "操作人",
              title: i18n.t("pqc.operator"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:100,
              ellipsis:true,
              key: 'createUserName',
            }
          ]
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
        
        ],
        search: {
          query: "",
          fieldName: "",
          result:"",
          results:'',
          status:"",
          userList:[],
          dates:[],
          resultList:[
            {value:'',label:i18n.t("pqc.all")},
            {value:0,label:i18n.t("pqc.tbi")},
            {value:1,label:i18n.t("pqc.qualified")}
          ],
          tos:[
            {value:"",label:i18n.t("pqc.all")},
            {value:"1",label:i18n.t("pqc.internalProcessing")},
            {value:"2",label:i18n.t("pqc.supplier")}
          ],
          optList:[
            {value:"",label:i18n.t("pqc.all")},
            {value:i18n.t("pqc.speclelAdoption"),label:i18n.t("pqc.speclelAdoption")},
            {value:i18n.t("pqc.er"),label:i18n.t("pqc.er")},
            {value:i18n.t("pqc.rework"),label:i18n.t("pqc.rework")},
            {value:i18n.t("pqc.filtrate"),label:i18n.t("pqc.filtrate")},
            {value:i18n.t("pqc.rg"),label:i18n.t("pqc.rg")},
            {value:i18n.t("pqc.scrap"),label:i18n.t("pqc.scrap")}
          ],
          data: {
            searchTypes: [
              {
                label: i18n.t("pqc.sa"),
                value: ""
              },{
                label: i18n.t("pqc.pn"),
                value: "productNo"
              },{
                label: i18n.t('pqc.name'),
                value: "productName"
              },{
                label: i18n.t('pqc.specifications'),
                value: "spec"
              },{
                label: i18n.t("pqc.pl"),
                value: "prodLineName"
              },{
                label: i18n.t("pqc.department"),
                value: "departmentName"
              }
            ]
          }
        },
        permsCur:[
          "DELETE_INSPECTION_RECORD",
          "SELECT_INSPECTION_RECORD",
          "EXPORT_INSPECTION_RECORD",
          "INSERT_INSPECTION_RECORD",
          "UPDATE_INSPECTION_RECORD",
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "INSERT_INSPECTION_RECORD":false,
          "SELECT_INSPECTION_RECORD":false,
          "UPDATE_INSPECTION_RECORD":false,
          "DELETE_INSPECTION_RECORD":false,
          "EXPORT_INSPECTION_RECORD":false
        },
      }
    },//end data
    created(){
      this.refreshTypeTree();
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
      treeData(){//需传输到树组件的数据
        let treeData={
          treeTitle:"分类",//树的根目录名称
          typeId:"inspectionRecordTypeId",//类别id字段
          typeName:"inspectionRecordTypeName",//类名名称
          treeListUrl:"/inspectionRecordType",//树的数据接口名称
          addTreeUrl:"/inspectionRecordType",//增加树元素的接口名称
          editTreeUrl:"/inspectionRecordType",//修改树元素的接口名称
          deleteTreeUrl:"/inspectionRecordType/",//删除树元素的接口名称
          chooseNodeUrl:"/inspectionRecordByTypeId/",//选择树元素查找对应列表的接口名称
          pager:{
            current:this.table.pager.current,
            limit:this.table.pager.limit
          },
        }
        return treeData
      },
      treeStyle(){
        // let height = $(window).height()-130;
        let height = 535;
        return {
          "height":height+"px"
        };
      },
    },
    methods:{
      changeTreeNode(resp,item){//从树组件传输数据回来，渲染列表页
        // console.log(resp);
        let that = this;
        that.snsData = item;
        console.log(that.snsData,"IOPOIOPPOIIOO");
        that.data = resp.data;
        that.table.pager.total = resp.pagerInfo.total;
        let rowCount = resp.data ? resp.data.length : 10;
        that.table.pager.rows = Math.max(rowCount, 6);
      },
      reset(){
        this.pageChange(1);
        this.table.selected='';
        this.search.query='';
        this.search.result='';
        this.search.results='';
        this.search.dates=[];
        // this.refreshData(1)
        // this.table.pager.current = 1;
        this.$refs.treeCategory.refreshTypeTree()
      },
      /**
       * 导出报表
       * index 为 1 时为导出当前条件列表
       * index 为 2 时为导出检验报告
       */
      exportStatement (index){
        //console.log(index,'index');
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
            params.page = this.table.pager.current;
            params.limit = this.table.pager.limit;
            params.query = this.search.query;
            params.fieldName = this.search.result;
            params.result = this.search.results;
        if(index == 1){
          url = '/inspectionRecord/exportList';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          let query='';
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            let startDate = this.$iqis.utils.getDayStart(1,sdate);
            let endDate = this.$iqis.utils.getDayEnd(edate);
            /* query="startDate%3D"+startDate+"%26endDate%3D"+endDate+"%26field%3D"+this.search.fieldName+"%26keyword%3D"+this.search.query+"%26result%3D"+this.search.results;
          } else {
            query="field%3D"+this.search.fieldName+"%26keyword%3D"+this.search.query+"%26result%3D"+this.search.results;
          } */
          query="startDate%3D"+params.startDate+"%26endDate%3D"+params.endDate+"%26field%3D"+params.fieldName+"%26keyword%3D"+params.query;
        } else {
          query="field%3D"+params.fieldName+"%26keyword%3D"+params.query;
        }
          params.query = query;
        }
        if(index == 3){
          url = '/inspectionRecord/exportList';
          params.page = 1;
          params.limit = this.table.pager.total;
          let query='';
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            let startDate = this.$iqis.utils.getDayStart(1,sdate);
            let endDate = this.$iqis.utils.getDayEnd(edate);
            /* query="startDate%3D"+startDate+"%26endDate%3D"+endDate+"%26field%3D"+this.search.fieldName+"%26keyword%3D"+this.search.query+"%26result%3D"+this.search.results;
          } else {
            query="field%3D"+this.search.fieldName+"%26keyword%3D"+this.search.query+"%26result%3D"+this.search.results;
          } */
          query="startDate%3D"+params.startDate+"%26endDate%3D"+params.endDate+"%26field%3D"+params.fieldName+"%26keyword%3D"+params.query;
        } else {
          query="field%3D"+params.fieldName+"%26keyword%3D"+params.query;
        }
          params.query = query;
        }
        if(index == 2){
          let reviewList=this.$refs.pageTable.getSelection()

          if( reviewList.length != 1){
            this.$Notice.warning({
              title: i18n.t("pqc.sap"),
            });
            return;
          }
          url = '/inspectionRecord/export/'+reviewList[0].inspectionRecordId;
        }
        this.$iqis.download(url,params,methods,()=>{}) //下载文件
      },
      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        // this.refreshData();
        this.$refs.treeCategory.treeSelectChange(null,this.table.pager.current,pageSize)//调用树组件的方法-刷新树的数据
      },
      pageChange(page){
        this.table.pager.current = page;
        // this.refreshData();
        this.$refs.treeCategory.treeSelectChange(null,this.table.pager.current,this.table.pager.limit)//调用树组件的方法-刷新树的数据
      },
      modalOk(){
        this.editModal.requesting = true;
        if(!this.editModal.item.name || !this.editModal.item.judgeId
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
      },
      addIqc(){
        let that = this;
        let sns = that.snsData
        let id = sns&&sns[0]?sns[0].inspectionRecordTypeId:null
        this.$emit("open-tab","exam-pqc-inspectrecord-update",i18n.t("pqc.apr"),"page-exam-pqc-inspectrecord-update",{inspectionRecordTypeId:id});
      },
      editSelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection();
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t('pqc.yms'),
            desc: ''
          });
          return;
        }
        this.$emit("open-tab","exam-pqc-inspectrecord-update-"+selectedRow[0].inspectionRecordId,i18n.t('pqc.mpr')+"-"+selectedRow[0].productName,"page-exam-pqc-inspectrecord-update",{inspectionRecordId:selectedRow[0].inspectionRecordId,proID:2});
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
            delArr.push(this.$http.delete("/inspectionRecord/"+ss[i].inspectionRecordId));
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
      refreshData(index){
        let that = this;
        that.snsData=null
        that.table.loading = true;
        let params = {};
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.result;
        params.result = that.search.results;
        let query='';
        if(this.search.dates && this.search.dates[0]){
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];

          params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          params.endDate = this.$iqis.utils.getDayEnd(edate);
          query="startDate%3D"+params.startDate+"%26endDate%3D"+params.endDate+"%26field%3D"+params.fieldName+"%26keyword%3D"+params.query;
        } else {
          query="field%3D"+params.fieldName+"%26keyword%3D"+params.query;
        }
        this.$http.get("/inspectionRecord?query="+query+"&page="+params.page+"&limit="+params.limit).then(function (resp) {
          for(let i=0;i<resp.data.length;i++){
            resp.data[i]._checked = false;
          }
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
        })
      },
      onCClick(obj,index){
        // //console.log(obj)
        this.data[index]._checked = !this.data[index]._checked;
      },
      /**双击打开 */
      onDBClick(obj,index){
        this.$emit("open-tab","exam-pqc-inspectrecord-update-"+obj.inspectionRecordId,i18n.t('pqc.mpr')+"-"+obj.productName,"page-exam-pqc-inspectrecord-update",{inspectionRecordId:obj.inspectionRecordId,proID:2});
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
        that.arrangement.data=that.urlProduct.dataList;
      },
      //排序确定
      RankOk(){
        if(this.arrangement.data.length===0){
         this.$Notice.warning({
            title: i18n.t("pqc.tlc"),
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
      treeAddInit(e){
        this.tree.newNodeName = "";
        let that = this;
        let txt = this.$refs.addTxt;
        this.$nextTick(function () {
          txt.focus();
        });
      },
      addNewNode(){
        let that = this;
        let params = [
          {type: 'Empty', title: i18n.t('monitor.category'), value: that.tree.newNodeName},
          {type: 'Name', title: i18n.t('monitor.category'), value: that.tree.newNodeName},
        ]
        let state = true;
        for (let i in params) {
          state = that.$iqis.utils.formValidate(params[i].type, params[i].title, params[i].value, (tips) => {
            that.$Notice.warning({title: tips})
          })
          if (!state) {
            return;
            break;
          }
        }
        if(this.tree.newNodeName){
          let sns = that.snsData;
          console.log(sns,'sns')
          
          let s_item = this.category[0];
          console.log(this.category[0],'this.category[0]');
          
          if(sns && sns.length > 0){
            s_item = sns[0];
          }

          let params = {
            inspectionRecordTypeName : this.tree.newNodeName,
            parentId :s_item.value,
            // del:0
          };
          this.$http.post("/inspectionRecordType",params,this.headers).then(function (resp) {
            that.$Message.success(i18n.t("quality.sas"));
            that.tree.add = false;
            that.refreshTypeTree(s_item.value);
          })
        }
        this.tree.newNodeName = "";
      },
      refreshTypeTree(selectValue){
        let that = this;
        that.tree.selected = false;
        this.$http.get("/inspectionRecordType").then(function(resp){
          let root = {title:i18n.t('monitor.category'),selected: false,label:i18n.t('monitor.category'),value:0,expand:true};

          if(!selectValue){
            root.selected = true;
          }

          if(resp.data){

            if(selectValue){
              for(let i =0;i<resp.data.length;i++){
                resp.data[i].selected = resp.data[i].inspectionRecordTypeId == selectValue;
                that.tree.selected = true;
              }
            }

            that.$iqis.utils.treeify(resp.data,root,"inspectionRecordTypeId","inspectionRecordTypeName","parentId");
          }
          that.category = [root];
        });
      },
      treeEditInit(e){
        let sns = that.snsData;
        let s_item = null;
        if(sns && sns.length > 0){
          s_item = sns[0];
        }

        if(s_item){
          this.tree.newNodeName = s_item.label;
          let that = this;
          let txt = this.$refs.editTxt;
          this.$nextTick(function () {
            txt.focus();
          });
        }
      },
      editNode(){
        let that = this;
        let params = [
          {type: 'Empty', title: i18n.t('monitor.category'), value: that.tree.newNodeName},
          {type: 'Name', title: i18n.t('monitor.category'), value: that.tree.newNodeName},
        ]
        let state = true;
        for (let i in params) {
          state = that.$iqis.utils.formValidate(params[i].type, params[i].title, params[i].value, (tips) => {
            that.$Notice.warning({title: tips})
          })
          if (!state) {
            return;
            break;
          }
        }
        if(this.tree.newNodeName){
          
          let sns = that.snsData;
          let s_item = this.category[0];
          if(sns && sns.length > 0){
            s_item = sns[0];
          }

          let params = {
            inspectionRecordTypeId:s_item.inspectionRecordTypeId,
            inspectionRecordTypeName : this.tree.newNodeName,
            parentId : s_item.parentId
          };
          this.$http.put("/inspectionRecordType",params,that.headers).then(function (resp) {
            that.$Message.success(i18n.t("quality.ats"));
            that.tree.edit = false;
            that.refreshTypeTree(s_item.value);
          })
        }else{
          this.$Message.warn(i18n.t("quality.nce"));
        }
        this.tree.newNodeName = "";
      },
      deleteTreeNode(){
        let sns = that.snsData;
        let s_item = null;
        if(sns && sns.length > 0){
          s_item = sns[0];
        }
        if(s_item){
          let that = this;
          that.$http.delete("/inspectionRecordType/"+s_item.value).then(function (resp) {
            that.$Message.success(i18n.t("quality.ds"));
            that.refreshTypeTree(null);
          });
        }
      },
      treeSelectChange(){
        let that=this;
        that.table.selected='';
        let sns = that.snsData;
        if(sns.length==0||sns[0].title==i18n.t('monitor.category')){
          that.tree.selected='';
          that.refreshData();
        }else
        {
          that.refreshSelectData();
        }
      },
      refreshSelectData(obj){
        let that=this;
        let sns = obj||that.snsData;
        if(sns.lenght==0||sns[0].title==i18n.t('monitor.category')){
          that.refreshData();
        }else {
          let params = {};

          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          that.tree.selected = true;
          let url = "/inspectionRecordByTypeId/";
          that.$http.get(url + sns[0].inspectionRecordTypeId, {params: params}).then((resp) => {
            that.data = resp.data;
            that.table.pager.total = resp.pagerInfo.total;
            let rowCount = resp.data ? resp.data.length : 10;
            that.table.pager.rows = Math.max(rowCount, 6);
          });
        }
      },
    }//end methods
  }

</script>
<style>
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

