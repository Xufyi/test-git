<template>
  <div class="iqis-page">

    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <!-- <div class="iqis-bus-tree treeCustom" style="display: -webkit-flex;display: flex;flex-direction: column;flex: 0 0 185px;font-size: 14px;overflow: auto; border: 1px solid #e9eaec;margin-right: 16px;margin-top:11px;padding-left: 10px;" :style="treeStyle">
          <div class="iqis-page-tool-row iqis-tree-tool" style="flex: 0 0 47px;" >
            <div style="display: -webkit-flex;display: flex;justify-content:space-between;width: 100%;">
              <div class="iqis-page-tool-primary" style="padding: 12px 6px;">
                <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                  v-model="tree.add"
                  :title="i18n.t('quality.pecn')"
                  @on-popper-show="treeAddInit"
                  placement="bottom-start">
                  <Button v-if="permsBtn.INSERT_ABNORMAL_CAUSE" type="ghost" :title='i18n.t("quality.aecc")'>{{$t("quality.addCategory")}}</Button>
                  <div class="iqis-poptip-content" slot="content">
                    <i-input :autofocus="true" ref="addTxt" v-model="tree.newNodeName">
                      <Button slot="append" @click="addNewNode">{{$t("quality.confirm")}}</Button>
                    </i-input>
                  </div>
                </Poptip>
              </div>
              <div class="iqis-page-tool-second" :style="locale == 'zh_CN' ? 'padding: 12px 10px;' : 'padding: 12px 8px;'">
                <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                  v-model="tree.edit"
                  :title="i18n.t('quality.pen')"
                  @on-popper-show="treeEditInit"
                  placement="bottom-start">
                  <Button v-if="permsBtn.UPDATE_ABNORMAL_CAUSE" type="ghost" :disabled="!tree.selected">{{$t("quality.modify")}}</Button>
                  <div class="iqis-poptip-content" slot="content">
                    <i-input ref="editTxt" v-on:focus.native="selectAll" v-model="tree.newNodeName">
                      <Button slot="append" @click="editNode">{{$t("quality.confirm")}}</Button>
                    </i-input>
                  </div>
                </Poptip>
                <Poptip
                  confirm
                  :title="i18n.t('product.confirmDelete')"
                  placement="bottom-start"
                  :ok-text='i18n.t("quality.confirm")'
                  :cancel-text='i18n.t("quality.cancel")'
                  @on-ok="deleteTreeNode">
                  <Button v-if="permsBtn.DELETE_ABNORMAL_CAUSE" type="ghost" :disabled="!tree.selected">{{$t("quality.delete")}}</Button>
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
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('quality.sa')" slot="prepend" style="width: 120px;text-align: left">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0">
              <Button style="margin-right:8px;" type="primary" @click="table.selected='';refreshTypeTree();refreshData();">{{$t("quality.search")}}</Button>
              <Button type="ghost" @click="reset">{{$t("quality.reset")}}</Button>
            </div>
          </div>

          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <Button style="margin-right:8px;" v-if="permsBtn.INSERT_ABNORMAL_CAUSE" type="ghost" icon="plus"  @click="showModal(null)" :title='i18n.t("quality.aec")'>{{$t("quality.add")}}</Button>
              <Button style="margin-right:8px;" v-if="permsBtn.UPDATE_ABNORMAL_CAUSE" type="ghost" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t("quality.modify")}}</Button>
              <Poptip
                confirm
                :title="i18n.t('quality.dsi')"
                placement="bottom-start"
                :ok-text='i18n.t("quality.confirm")'
                :cancel-text='i18n.t("quality.cancel")'
                @on-ok="deleteTableSelected">
                <Button v-if="permsBtn.DELETE_ABNORMAL_CAUSE" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t("quality.delete")}}</Button>
              </Poptip>

            </div>
            <div class="iqis-page-tool-second">
              <!--<Button type="primary" icon="more">自定义列表</Button>-->
              <Button type="text"  icon="refresh" @click="reset">{{$t("quality.refresh")}}</Button>
              <!--<Button type="ghost" icon="share">导出报表</Button>-->
            </div>
          </div>


          <Table style="width:100% !important" ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display:inline-block"> -->
            <div style="padding: 20px 0 20px 0px;">
              <Page id="pageId" v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                    :page-size-opts="[10,20,50,100]"
                    @on-change="pageChange" @on-page-size-change="pageSizeChange"
                    size="small" show-total show-elevator show-sizer></Page>
            </div>
          <!-- </div> -->
          <!-- <div style="display: inline-block;">
            <div style="float: left;margin: 4px;line-height: 24px;">
                <Button type="primary" size="small" @click="goElevatorPage">跳转</Button>
            </div>
          </div> -->
          

        </div>
      </div>

    </div>
    <Modal
      :title="editModal.item.abnormalId?i18n.t('quality.mec'):i18n.t('quality.aec')"
      v-model="editModal.show"
      :mask-closable="false"
      :width="600" >
      <Row type="flex" :gutter="40">
        <i-col span="12">{{$t("quality.ecn")}}</i-col>
        <i-col span="12">{{$t("quality.category")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12"><Input :disabled="noPermsDis" :placeholder="i18n.t('quality.required')" v-model="editModal.item.name" style="width: 100%;"></Input>
        </i-col>
        <i-col span="12">
          <Cascader :disabled="noPermsDis"  :transfer="false" v-model="editModal.item.abnormalTypeValue" :data="category[0].children"
                    :render-format = "loadTypeRender"
                    change-on-select :clearable="false" style="width: 100%"></Cascader>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">{{$t("quality.remarks")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="24"><Input :disabled="noPermsDis" :placeholder="i18n.t('quality.pird')" v-model="editModal.item.remark" type="textarea" :rows="4" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <div slot="footer">
        <Button v-if="!noPermsDis" type="primary" size="large" @click="modalOk" :loading="editModal.requesting">{{$t("quality.confirm")}}</Button>
        <Button type="text" size="large" @click="editModal.show=false">{{$t("quality.cancel")}}</Button>
      </div>
      <Spin v-if="editModal.dataLoading" fix size="large"></Spin>
    </Modal>
  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import ICol from "iview/src/components/grid/col";
  import $ from "jquery"
  import SessionStorage from '@/utils/sessionStorage'
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
        locale:'zh_CN',
        i18n:window.i18n,
        data:[
        ],
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
          loading:true,
          pager:{
            rows:10,
            need:true,
            total:100,
            limit:10,
            current:1
          },
          columns:[
            {type: 'selection',
              align: 'center',
              // width:40,
              minWidth:40,
              maxWidth:40
            },{title: i18n.t("quality.no"),
            className:'tablePadding',
              width:50,
              align: 'center',
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              // minWidth:80,
              // maxWidth:80
            },
            {
              title: i18n.t("quality.ecn"),
              className:'tablePadding',
              // width: 240,
              minWidth:100,
              ellipsis:true,
              key: 'name'
            },{
              title: i18n.t("quality.category"),
              className:'tablePadding',
              minWidth:100,
              ellipsis:true,
              // width:200,
              key: 'abnormalType'
            },{
              title: i18n.t("quality.remarks"),
              className:'tablePadding',
              minWidth:100,
              ellipsis:true,
              // width:600,
              key: 'remark'
            }
          ]
        },
        search: {
          query: "",
          fieldName: "",
          typeTree:[],
          userList:[],
          typeDataLoading:false,
          data: {
            searchTypes: [
              {
                label: i18n.t("quality.sa"),
                value: ""
              }, {
                label: i18n.t("monitor.abnormalCauseName"),
                value: "name"
              }, {
                label: i18n.t("quality.category"),
                value: "abnormalType"
              }, {
                label: i18n.t("quality.remarks"),
                value: "remark"
              }
            ]
          }
        },
        permsCur:[
          "INSERT_ABNORMAL_CAUSE",
          "SELECT_ABNORMAL_CAUSE",
          "DELETE_ABNORMAL_CAUSE",
          "UPDATE_ABNORMAL_CAUSE",
        ],
        permsBtn:{
          "DELETE_ABNORMAL_CAUSE":false,
          "SELECT_ABNORMAL_CAUSE":false,
          "UPDATE_ABNORMAL_CAUSE":false,
          "INSERT_ABNORMAL_CAUSE":false,
        },
        noPermsDis:true,

      }
    },//end data

    created(){
      this.locale = SessionStorage.get("language-main");
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
      this.refreshTypeTree();
      this.refreshData();
      this.refreshSelectData();
    },
    computed:{
      treeData(){//需传输到树组件的数据
        let treeData={
          treeTitle:"分类",//树的根目录名称
          typeId:"abnormalTypeId",//类别id字段
          typeName:"abnormalTypeName",//类名名称
          treeListUrl:"/basic/abnormaltype",//树的数据接口名称
          addTreeUrl:"/basic/abnormaltype",//增加树元素的接口名称
          editTreeUrl:"/basic/abnormaltype",//修改树元素的接口名称
          deleteTreeUrl:"/basic/abnormaltype/",//删除树元素的接口名称
          chooseNodeUrl:"/basic/abnormalList/",//选择树元素查找对应列表的接口名称
          pager:{
            current:this.table.pager.current,
            limit:this.table.pager.limit
          },
        }
        return treeData
      },
      treeStyle(){
        return {
          // "height":(9*40+159)+"px"
          "height":535+"px"
        };
      }
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
      onPopUp(){
        let that = this;
        if((!that.editModal.item.abnormalId&&that.permsBtn.INSERT_ABNORMAL_CAUSE)||(that.editModal.item.abnormalId&&that.permsBtn.UPDATE_ABNORMAL_CAUSE)){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;

        }
      },
      reset(){
        this.search.dates=[];
        this.table.selected='';
        this.search.query='';
        this.search.fieldName='';
        // this.refreshTypeTree();
        // this.refreshData();
        this.pageChange(1)
        this.$refs.treeCategory.refreshTypeTree()
      },
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

        this.$http.get("/basic/abnormal",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.loading = false;

          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.tableEditDis=true;

        })
      },
      refreshSelectData(obj){
        let that=this;
        let sns = obj||that.snsData;
        if(sns.length==0||sns[0].title==i18n.t("quality.ec")){
          that.refreshData();
        }else {
          let params = {};

          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          that.tree.selected = true;
          let url = "/basic/allAbnormal/";
          that.$http.get(url + sns[0].abnormalTypeId, {params: params}).then((resp) => {
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
        this.$http.get("/basic/abnormaltype",{params:{limit:99999999}}).then(function(resp){
          let root = {title:i18n.t("quality.ec"),selected: false,label:i18n.t("quality.ec"),value:0,expand:true};

          if(!selectValue){
            // //console.log("set root select:"+selectValue);
            root.selected = true;
          }

          if(resp.data){

            if(selectValue){
              for(let i =0;i<resp.data.length;i++){
                // //console.log("set node select:"+selectValue);
                resp.data[i].selected = resp.data[i].abnormalTypeId == selectValue;
                that.tree.selected = true;
              }
            }

            that.$iqis.utils.treeify(resp.data,root,"abnormalTypeId","abnormalTypeName","parentId");
          }
          // //console.log(root);
          that.category = [root];
          that.tableEditDis=true;
        });

      },
      editSelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        // //console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t("quality.cbm"),
            desc: ''
          });
          return;
        }
        this.showModal(selectedRow[0]);
      },
      onDBClick(o,i){
        this.showModal(o);
      },
      showModal(d){
        if(!d){
          let that = this;
          let sns = that.snsData;
          let s_item = this.category[0];
          if(sns && sns.length > 0){
            s_item = sns[0];
          }
          let result = this.$iqis.utils.findPathInTree(this.category[0],[],s_item.abnormalTypeId,"abnormalTypeId");
          result = result || [];
          d = {abnormalTypeValue:[],name:"",remark:""}
          d.abnormalTypeValue = result;
        }else{
          // //console.log("d");
          // //console.log(d);
          let result = this.$iqis.utils.findPathInTree(this.category[0],[],d.abnormalTypeId,"abnormalTypeId");
          result = result || [];
          d.abnormalTypeValue = result;
        }

        this.editModal.item = d;
        this.editModal.show = true;
        this.editModal.requesting = false;
        this.loadEditData();
        this.editModal.item.abnormalId=d.abnormalId;
        this.onPopUp();
      },
      deleteTreeNode(){
        let sns = that.snsData;
        let s_item = null;
        if(sns && sns.length > 0){
          s_item = sns[0];
        }

        if(s_item){
          let that = this;
          this.$http.delete("/basic/abnormaltype/"+s_item.value).then(function (resp) {
            that.$Message.success(i18n.t("quality.ds"));
            that.refreshTypeTree(null);
          });
        }

      },
      addNewNode(){
        this.tree.add = false;
        let that = this;
        if(this.tree.newNodeName){
          let state = true;
          state = that.$iqis.utils.formValidate('Name',i18n.t("quality.ec"),this.tree.newNodeName, (tips) => {
            that.$Notice.warning({title: tips})
          })
          if (!state) {
            return;
          }
          let sns = that.snsData;
          let s_item = this.category[0];
          if(sns && sns.length > 0){
            s_item = sns[0];
          }

          // //console.log(this.tree.newNodeName);
          // //console.log(s_item);
          let params = {
            abnormalTypeName : this.tree.newNodeName,
            parentId : s_item.value
          };
          this.$http.post("/basic/abnormaltype",params).then(function (resp) {
            that.$Message.success(i18n.t("quality.sas"));
            that.refreshTypeTree(s_item.value);
          })
        }
        this.tree.newNodeName = "";
      },editNode(){

        let that = this;
        if(this.tree.newNodeName){
          let state = true;
          state = that.$iqis.utils.formValidate('Name',i18n.t("quality.ec"),this.tree.newNodeName, (tips) => {
            that.$Notice.warning({title: tips})
          })
          if (!state) {
            return;
          }
          let sns = that.snsData;
          let s_item = this.category[0];
          if(sns && sns.length > 0){
            s_item = sns[0];
          }

          // //console.log(this.tree.newNodeName);
          // //console.log(s_item);
          let params = {
            abnormalTypeId:s_item.abnormalTypeId,
            abnormalTypeName : this.tree.newNodeName,
            parentId : s_item.parentId
          };
          this.$http.put("/basic/abnormaltype",params).then(function (resp) {
            that.$Message.success(i18n.t("quality.ats"));
            that.tree.edit = false;
            that.refreshTypeTree(s_item.value);
          })
        }else{
          this.$Message.warn(i18n.t("quality.nce"));
        }
        this.tree.newNodeName = "";
      },
      modalCancel(){

      },
      modalOk(){
        let that = this;

        // //console.log(this.editModal.item);
        this.editModal.requesting = false;
        this.editModal.item.abnormalTypeId = null;
        if(this.editModal.item.abnormalTypeValue && this.editModal.item.abnormalTypeValue.length > 0){
          let plt = this.editModal.item.abnormalTypeValue[this.editModal.item.abnormalTypeValue.length-1];
          if(plt){
            this.editModal.item.abnormalTypeId = plt;
          }
        }
        let params = [
          {type: 'Empty', title: i18n.t("quality.ecn"), value: that.editModal.item.name},
          {type: 'Name', title: i18n.t("quality.ecn"), value: that.editModal.item.name},
          {type: 'Empty', title: i18n.t("quality.category"), value: that.editModal.item.abnormalTypeId  },
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

        if(this.editModal.item.abnormalId){
          that.$http.put("/basic/abnormal",that.editModal.item).then(function (resp) {
            that.table.selected='';
            that.search.query='';
            that.search.fieldName='';
            that.$Message.success(i18n.t("quality.ats"));
            that.editModal.show = false;
            //跳转到对应的树节点下
            that.refreshTypeTree(that.editModal.item.abnormalTypeId);
            let sns=[];
            let node={};
            node.title="";
            node.abnormalTypeId=that.editModal.item.abnormalTypeId;
            sns.push(node);
            that.refreshSelectData(sns);
          });
        }else{
          that.$http.post("/basic/abnormal",that.editModal.item).then(function (resp) {
            that.table.selected='';
            that.search.query='';
            that.search.fieldName='';
            that.table.pager.current = 1;
            that.$Message.success(i18n.t("quality.as"));
            that.editModal.show = false;
            //跳转到对应的树节点下
            that.refreshTypeTree(resp.data.abnormalTypeId);
            let sns=[];
            let node={};
            node.title="";
            node.abnormalTypeId=resp.data.abnormalTypeId;
            sns.push(node);
            that.refreshSelectData(sns);
          });
        }

        //this.editModal = true;
      },
      loadTypeRender(label){
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
      loadType(){
        this.search.typeDataLoading = true;
        let that = this;
        this.search.prodLineTypeList = [];
        this.$http.get("/basic/abnormaltype",{params:{limit:99999999}}).then(function (resp) {
          that.search.prodLineTypeList = resp.data;
          that.search.typeDataLoading = false;
        });
      },treeAddInit(e){
        this.tree.newNodeName = "";
        let that = this;
        let txt = this.$refs.addTxt;
        // //console.log(txt);
        this.$nextTick(function () {
          txt.focus();
        });
      },treeEditInit(e){
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
      treeSelectChange(){
        let that=this;
        that.table.selected='';
        let sns = that.snsData;
        if(sns.length==0||sns[0].title==i18n.t("quality.ec")){
          that.tree.selected='';
          that.refreshData();
        }else
        {
          that.refreshSelectData();
        }
      },
      loadEditData(){
        // this.editModal.dataLoading = true;
        //
        // let that = this
        // this.$http.get("/tenant/user",{params:{limit:99999999}}).then(function (resp) {
        //   if(resp.data){
        //     that.search.userList = resp.data;
        //     that.editModal.dataLoading = false;
        //   }
        // });
        this.editModal.dataLoading = false;
      },tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
      },deleteTableSelected(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/basic/abnormal/"+ss[i].abnormalId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t("quality.ds"));
              that.table.selected='';
              that.refreshSelectData();
            });
          }
        }

      }



      //////
    }
  }

</script>
<style>

</style>
