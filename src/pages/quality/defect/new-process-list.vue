<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('quality.sa')" slot="prepend" style="width: 120px;text-align: left">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="table.pager.current = 1;table.selected='';pageChange(1)">{{$t("quality.search")}}</Button>
        <Button type="ghost" @click="table.selected='';search.fieldName='';search.query='';pageChange(1)">{{$t("quality.reset")}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0">
        <Button style="margin-right:8px;" v-if="permsBtn.INSERT_REVIEW_PROCESS" type="ghost" icon="plus"  @click="addItem">{{$t("quality.add")}}</Button>
        <Button style="margin-right:8px;" v-if="permsBtn.UPDATE_REVIEW_PROCESS" type="ghost" icon="edit" :disabled="tableEditDis" @click="editItem">{{$t("quality.modify")}}</Button>
        <Poptip
          confirm
          :title="i18n.t('quality.dsi')"
          placement="bottom-start"
          :ok-text='i18n.t("quality.confirm")'
          :cancel-text='i18n.t("quality.cancel")'
          @on-ok="deleteTableSelected">
          <Button v-if="permsBtn.DELETE_REVIEW_PROCESS" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t("quality.delete")}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="table.selected='';search.query='';search.fieldName='';pageChange(1)">{{$t("quality.refresh")}}</Button>
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
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
  import draggable from 'vuedraggable'
  import Input from "iview/src/components/input";
  import $ from "jquery"

  export default {
    components: {
      Input,draggable
    },
    data: function () {
      let vm = this;
      return {
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        reviewerId:null,
        reviewerBtnShow:true,
        i18n:window.i18n,
        label:'',
        data:[
        ],
        tableEditDis:true,
        editModal:{
          dataLoading:false,
          item:{},
          show:false,
          requesting:false
        },
        table:{
          selected:false,
          loading:false,
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
            },{title: i18n.t("quality.no"),
              width:50,
              className:'tablePadding',
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align: 'center',
              // minWidth:80,
              // maxWidth:80
            },
            {
              title:'适用部门',
              className:'tablePadding',
              // width: 120,
              minWidth:100,
              ellipsis:true,
              key: 'departmentName'
            },
            {
              title: i18n.t("quality.pn"),
              className:'tablePadding',
              // width: 120,
              minWidth:100,
              ellipsis:true,
              key: 'name'
            },{
              title: '创建时间',
              className:'tablePadding',
              // width: 200,
              minWidth:100,
              ellipsis:true,
              key: 'creatorTime'
            },{
              title: '创建人',
              className:'tablePadding',
              // width: 200,
              minWidth:100,
              ellipsis:true,
              key: 'creatorName'
            }
          ]
        },
        search: {
          query: "",
          fieldName: "",
          userList:[],
          data: {

            searchTypes: [
              {
                label: i18n.t("quality.sa"),
                value: ""
              }, {
                label: '适用部门',
                value: "departmentName"
              }, {
                label: i18n.t("quality.pn"),
                value: "name"
              }, {
                label: '创建人',
                value: "creatorName"
              }, 
            ]
          }
        },
        permsCur:[
          "INSERT_REVIEW_PROCESS",
          "DELETE_REVIEW_PROCESS",
          "UPDATE_REVIEW_PROCESS",
          "SELECT_REVIEW_PROCESS",
        ],
        permsBtn:{
          "DELETE_REVIEW_PROCESS":false,
          "SELECT_REVIEW_PROCESS":false,
          "UPDATE_REVIEW_PROCESS":false,
          "INSERT_REVIEW_PROCESS":false,
        },
        noPermsDis:true,


      }
    },//end data

    created(){
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.refreshData();
    },
    methods:{
      addItem(){
        this.$emit("open-tab","new-process-add","添加评审流程","page-new-process-add",null);
      },
      editItem(){
        let selectedRow = this.$refs.pageTable.getSelection();
        this.$emit("open-tab","new-process-add-"+selectedRow[0].reviewProcessId,'修改评审流程-'+selectedRow[0].name,"page-new-process-add",{reviewProcessId:selectedRow[0].reviewProcessId});

      },
      onDBClick(obj){
        this.$emit("open-tab","new-process-add-"+obj.reviewProcessId,'修改评审流程-'+obj.name,"page-new-process-add",{reviewProcessId:obj.reviewProcessId});
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
      deleteTableSelected(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/basic/reviewprocess/"+ss[i].reviewProcessId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t("quality.ds"));
              that.table.selected='';
              that.refreshData();
            });
          }
        }
        this.refreshData();
      },
      refreshData(){
        let that = this;
        that.table.loading = true;

        let params = {};

        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;
        this.$http.get("/basic/reviewprocess",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
          that.tableEditDis=true;
          that.table.selected=false;
        })
      }
    }//end methods




  }

</script>
<style>

</style>
