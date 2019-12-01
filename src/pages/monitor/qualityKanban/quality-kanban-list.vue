/*
 * @Author: yaoxingpu 
 * @Date: 2019-03-11 10:37:18 
 * @Last Modified by: yaoxingpu
 * @Last Modified time: 2019-06-05 09:25:51
 */
<template>
  <div class="iqis-page">
    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <TreeCategory ref="treeCategory" :treeData="treeData" v-on:changeTreeNode="changeTreeNode"></TreeCategory><!--树组件引用-->
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">
        <div class="iqis-page-search-row">
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('quality.sa')" slot="prepend" style="width: 100px;text-align: left">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <!-- 重置按钮 -->
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px;">
              <Button type="primary" @click="table.pager.current = 1;table.selected='';refreshTypeTree();refreshData();">{{$t("quality.search")}}</Button>
              <Button style="margin-left: 8px;" type="ghost" @click="table.selected='';search.query='';search.fieldName='';refreshTypeTree();refreshData();pageChange(1);$refs.treeCategory.refreshTypeTree()">{{$t("quality.reset")}}</Button>
            </div>
          </div>
          <!-- 搜索相关 -->
          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary">
                <!-- 添加 -->
              <Button style="margin-right:8px;" v-if="permsBtn.INSERT_PROD_LINE" type="ghost" icon="plus" :title='i18n.t("quality.al")' @click="showModal(null)">{{$t("quality.add")}}</Button>
              <!-- 修改 -->
              <Button v-if="permsBtn.UPDATE_PROD_LINE" type="ghost" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t("quality.modify")}}</Button>
              <!-- 删除 -->
              <Poptip confirm :ok-text="i18n.t('quality.confirm')" :cancel-text="i18n.t('quality.cancel')" :title='i18n.t("monitor.delete?")' placement="bottom-start" @on-ok="deleteTableSelected">
                    <Button  style="margin-left:8px;" v-if="permsBtn.DELETE_PROD_LINE" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t("quality.delete")}}</Button>
              </Poptip>
              <!-- 投放按钮 -->
              <Button v-if="permsBtn.SHOW_BOARD" type="ghost" icon="monitor" :disabled="tableEditDis" @click="handleHelp">{{$t('monitor.putOn')}}</Button>
            </div>
            <!-- 刷新按钮 -->
            <div class="iqis-page-tool-second">
              <Button type="text"  icon="refresh" @click="table.selected='';search.query='';search.fieldName='';refreshTypeTree();refreshData();pageChange(1)">{{$t("quality.refresh")}}</Button>
            </div>
          </div>
          <!-- 表格 -->
          <Table ref="pageTable" class="tableCustom" :loading="table.loading" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
            <div style="padding: 20px 0 20px 0px;">
              <Page id="pageId" v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                    :page-size-opts="[10,20,50,100]"
                    @on-change="pageChange" @on-page-size-change="pageSizeChange"
                    size="small" show-total show-elevator show-sizer></Page>
            </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import $ from 'jquery';
  import Input from "iview/src/components/input";
  import ICol from "iview/src/components/grid/col";
  import SessionStorage from '@/utils/sessionStorage';
  import TreeCategory from "../../../components/treeCategory/TreeCategory"
  export default {
    components: {
      ICol,
      Input,
      TreeCategory
    },
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        snsData:null,
        locale:'zh_CN',
        data:[
        ],
        boardId:'',//修改是所需要的组件id
        tableEditDis:true,
        editModal:{
          dataLoading:true,
          item:{},
          show:false,
          requesting:false
        },

        category:[{
          title: '组织架构树',
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
          loading:false,
          pager:{
            rows:10,
            need:true,
            total:100,
            limit:10,
            current:1
          },
          columns:[
              {
                type:'selection',
                align:'center',
                width:40,
                minWidth:40,
                maxWidth:40
              },
             /*  {
                type:'index',
                title:'序号',
                align:'center',
                width:40,
                minWidth:40,
                maxWidth:40
              }, */
              
              {
                title:i18n.t("monitor.category"),
                // align:'center',
                className:'tablePadding',
                key:'boardTypeName'
              },
              {
                title:i18n.t("monitor.qualityKanban"),
                // align:'center',
                className:'tablePadding',
                key:'boardNo'
              },
              {
                title:i18n.t("monitor.nameKanban"),
                // align:'center',
                className:'tablePadding',
                key:'boardName'
              },
              {
                title:i18n.t("monitor.operatingTime"),
                width:125,
                // align:'center',
                className:'tablePadding',
                key:'operationTime',
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
                title:i18n.t("monitor.operatingPeople"),
                // align:'center',
                className:'tablePadding',
                key:'operationName'
              },
              {
                title:i18n.t("monitor.note"),
                // align:'center',
                className:'tablePadding',
                key:'remark'
              },
          ]
        },
        search: {
          query: "",
          fieldName: "",
          prodLineTypeTree:[],
          userList:[],
          prodLineTypeLoading:false,
          data: {
            searchTypes: [
              {
                label: i18n.t("quality.sa"),
                value: ""
              }, {
                label:i18n.t("quality.lineName"),
                value: "name"
              }, {
                label: i18n.t("quality.category"),
                value: "prodLineTypeName"
              }, {
                label: i18n.t("quality.pm"),
                value: "prodUserName"
              }, {
                label: i18n.t("quality.qm"),
                value: "qualityUserName"
              }, {
                label: i18n.t("quality.remarks"),
                value: "remark"
              }
            ]
          }
        },
        permsCur:[
          "INSERT_PROD_LINE",
          "SELECT_PROD_LINE",
          "DELETE_PROD_LINE",
          "UPDATE_PROD_LINE",
          "SHOW_BOARD",
        ],
        permsBtn:{
          "DELETE_PROD_LINE":false,
          "SELECT_PROD_LINE":false,
          "UPDATE_PROD_LINE":false,
          "INSERT_PROD_LINE":false,
          "SHOW_BOARD":false,
        },
        noPermsDis:true,
        prodLineId:'',
      }
    },//end data
    created(){
      this.locale = SessionStorage.get("language-main");
      this.refreshTypeTree();
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.refreshData();
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
          typeId:"boardTypeId",//类别id字段
          typeName:"boardTypeName",//类名名称
          treeListUrl:"/boardType",//树的数据接口名称
          addTreeUrl:"/boardType",//增加树元素的接口名称
          editTreeUrl:"/boardType",//修改树元素的接口名称
          deleteTreeUrl:"/boardType/",//删除树元素的接口名称
          chooseNodeUrl:"/board/byTypeId/",//选择树元素查找对应列表的接口名称
          pager:{
            current:this.table.pager.current,
            limit:this.table.pager.limit
          },
        }
        return treeData
      },
      treeStyle(){
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
        that.data = resp.data;
        that.table.pager.total = resp.pagerInfo.total;
        let rowCount = resp.data ? resp.data.length : 10;
        that.table.pager.rows = Math.max(rowCount, 6);
      },
      // 投放按钮
      handleHelp () {
                
          const {href} = this.$router.resolve({ 
          name: 'kanban',
          params:{id:this.boardId}
          }); 
          window.open(href, '_blank');
      },
      onPopUp(){
        let that = this;
        if((!that.prodLineId&&that.permsBtn.INSERT_PROD_LINE)||(that.prodLineId&&that.permsBtn.UPDATE_PROD_LINE)){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;

        }
      },
      /* 分页按钮事件：
        on-page-size-change	切换每页条数时的回调，返回切换后的每页条数
      */
      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        // this.refreshSelectData();
        this.$refs.treeCategory.treeSelectChange(null,this.table.pager.current,pageSize)//调用树组件的方法-刷新树的数据

      },
      pageChange(page){
        this.table.pager.current = page;
        // this.refreshSelectData();
        this.$refs.treeCategory.treeSelectChange(null,this.table.pager.current,this.table.pager.limit)//调用树组件的方法-刷新树的数据
      },
      refreshData(){
        let that = this;
        that.table.loading = true;
        let params = {};
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;
        /* 表格数据接口 */
        this.$http.get("/board",{params:params}).then(function (resp) {
          
          that.data = resp.data;
          that.table.loading = false;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
        })
      },
      refreshSelectData(obj){
        let that=this;
        let sns = obj||that.snsData;
        if(sns.lenght==0||sns[0].title==i18n.t("quality.lsc")){
          that.refreshData();
        }else {
          let params = {};

          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          that.tree.selected = true;
          let url = "/board/byTypeId/";
          that.$http.get(url + sns[0].boardTypeId, {params: params}).then((resp) => {
            that.data = resp.data;
            that.table.pager.total = resp.pagerInfo.total;
            let rowCount = resp.data ? resp.data.length : 10;
            that.table.pager.rows = Math.max(rowCount, 6);
          });
        }
      },
      refreshTypeTree(selectValue){
        let that = this;
        that.tree.selected = false;
        this.$http.get("/boardType").then(function(resp){
          
          let root = {title:i18n.t("quality.lsc"),selected: false,label:i18n.t("quality.lsc"),value:0,expand:true};

          if(!selectValue){
            root.selected = true;
          }

          if(resp.data){

            if(selectValue){
              for(let i =0;i<resp.data.length;i++){
                resp.data[i].selected = resp.data[i].boardTypeId == selectValue;
                that.tree.selected = true;
              }
            }

            that.$iqis.utils.treeify(resp.data,root,"boardTypeId","boardTypeName","parentId");
          }
          that.category = [root];
        });

      },
      /* 修改按钮事件 */
      editSelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t("quality.cbm"),
            desc: ''
          });
          return;
        }
        // this.showModal(selectedRow[0]);
        this.$emit("open-tab","quality-Kanban-add",i18n.t("monitor.modifyKanban"),"page-monitor-quality-Kanban-add",{query:selectedRow[0],discern:1});//discern :1 表示点击了修改后的跳转
      },
      /* 投放按钮事件 */
      launchFun(){

      },
      /* 表格事件：双击某一行时触发 */
      onDBClick(obj,index){

      },
      showModal(){
        // 添加质量看板页面
        this.$emit("open-tab","quality-Kanban-add",i18n.t("monitor.addKanban"),"page-monitor-quality-Kanban-add",null);
        /* if(!d){
          let that = this;
          let sns = that.snsData;
          let s_item = this.category[0];
          if(sns && sns.length > 0){
            s_item = sns[0];
          }
          let result = this.$iqis.utils.findPathInTree(this.category[0],[],s_item.prodLineTypeId,"prodLineTypeId");
          result = result || [];
          d = {prodLineTypeValue:[],name:"",remark:"",qualityUserId:'',prodUserId:''}
          d.prodLineTypeValue = result;

        }else{
          let result = this.$iqis.utils.findPathInTree(this.category[0],[],d.prodLineTypeId,"prodLineTypeId");
          result = result || [];
          d.prodLineTypeValue = result;
        }
        this.loadEditData();
        this.prodLineId=d.prodLineId||''
        this.onPopUp(); */
      },
      addNewNode(){
        let that = this;
        let params = [
          {type: 'Empty', title: i18n.t("quality.lsc"), value: that.tree.newNodeName},
          {type: 'Name', title: i18n.t("quality.lsc"), value: that.tree.newNodeName},
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
            boardTypeName : this.tree.newNodeName,
            parentId : s_item.value
          };
          this.$http.post("/boardType",params).then(function (resp) {
            that.$Message.success(i18n.t("quality.sas"));
            that.tree.add = false;
            that.refreshTypeTree(s_item.value);
          })
        }
        this.tree.newNodeName = "";
      },
      /* modalOk(){
        let that = this;
        this.editModal.requesting = false;
        this.editModal.item.prodLineTypeId = null;
        if(this.editModal.item.prodLineTypeValue && this.editModal.item.prodLineTypeValue.length > 0){
          let plt = this.editModal.item.prodLineTypeValue[this.editModal.item.prodLineTypeValue.length-1];
          if(plt){
            this.editModal.item.prodLineTypeId = plt;
          }
        }
        let params = [
          {type: 'Empty', title: i18n.t("quality.lineName"), value: that.editModal.item.name},
          {type: 'Name', title: i18n.t("quality.lineName"), value: that.editModal.item.name},
          {type: 'Empty', title: i18n.t("quality.category"), value: that.editModal.item.prodLineTypeId},
          {type: 'Word600', title: i18n.t("quality.remarks"), value: that.editModal.item.remark},
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
        if(this.editModal.item.prodLineId){
          that.$http.put("/basic/prodline",that.editModal.item).then(function (resp) {
            that.table.selected='';
            that.search.query='';
            that.search.fieldName='';
            that.$Message.success(i18n.t("quality.ats"));
            that.editModal.show = false;
            //跳转到对应的树节点下
            that.refreshTypeTree(resp.data.prodLineTypeId);
            let sns=[];
            let node={};
            node.title="";
            node.prodLineTypeId=resp.data.prodLineTypeId;
            sns.push(node);
            that.refreshSelectData(sns);
          });
        }else{
          that.$http.post("/basic/prodline",that.editModal.item).then(function (resp) {
            that.table.selected='';
            that.search.query='';
            that.search.fieldName='';
            that.table.pager.current = 1;
            that.$Message.success(i18n.t("quality.as"));
            that.editModal.show = false;
            //跳转到对应的树节点下
            that.refreshTypeTree(resp.data.prodLineTypeId);
            let sns=[];
            let node={};
            node.title="";
            node.prodLineTypeId=resp.data.prodLineTypeId;
            sns.push(node);
            that.refreshSelectData(sns);
          });
        }
        that.tableEditDis = true;
        //this.editModal = true;
      }, */
      loadProdLineTypeRender(label){
        //render-format
        if(!label || label.length == 0){
          return '-';
        }
        let result = label[label.length-1];

        if( (this.category.length > 0  && result == this.category[0].label)){
          return '-'
        }

        return result;
      },
      loadProdLineType(){
        this.search.prodLineTypeLoading = true;
        let that = this;
        this.search.prodLineTypeList = [];
        this.$http.get("/basic/prodlinetype",{params:{limit:99999999}}).then(function (resp) {
          that.search.prodLineTypeList = resp.data;
          that.search.prodLineTypeLoading = false;
        });
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
      /* 表格事件：
        on-selection-change：	在多选模式下有效，只要选中项发生变化时就会触发
      */
      tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
        if(selection[0]){
          this.boardId = selection[0].boardId;
        }
        
      },
      /* 删除按钮事件 */
      deleteTableSelected(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/board/"+ss[i].boardId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t("quality.ds"));
              that.table.selected='';
              that.search.query='';
              that.search.fieldName='';
              that.refreshSelectData();
            });
          }
        }
      }
    }
  }

</script>
<style>
.xx{
  position: relative;
  position: absolute;
}
</style>
