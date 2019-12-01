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
                  <Button v-if="permsBtn.INSERT_PROD_LINE" type="ghost" :title='i18n.t("quality.al")'>{{$t("quality.addCategory")}}</Button>
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
                  <Button v-if="permsBtn.UPDATE_PROD_LINE" type="ghost" :disabled="!tree.selected">{{$t("quality.modify")}}</Button>
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
                  <Button v-if="permsBtn.DELETE_PROD_LINE" type="ghost" :disabled="!tree.selected">{{$t("quality.delete")}}</Button>
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
                <Select v-model="search.fieldName" :placeholder="i18n.t('quality.sa')" slot="prepend" style="width: 100px;text-align: left">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px;">
              <Button type="primary" @click="table.pager.current = 1;table.selected='';refreshTypeTree();refreshData();">{{$t("quality.search")}}</Button>
              <Button style="margin-left: 8px;" type="ghost" @click="table.selected='';search.query='';search.fieldName='';refreshTypeTree();refreshData();pageChange(1);$refs.treeCategory.refreshTypeTree()">{{$t("quality.reset")}}</Button>
            </div>
          </div>

          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary">
              <Button style="margin-right:8px;" v-if="permsBtn.INSERT_PROD_LINE" type="ghost" icon="plus" :title='i18n.t("quality.al")' @click="showModal(null)">{{$t("quality.add")}}</Button>
              <Button v-if="permsBtn.UPDATE_PROD_LINE" type="ghost" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t("quality.modify")}}</Button>
              <Poptip confirm :ok-text="i18n.t('quality.confirm')" :cancel-text="i18n.t('quality.cancel')" :title='i18n.t("quality.al")' placement="bottom-start" @on-ok="deleteTableSelected">
              <Button  style="margin-left:8px;" v-if="permsBtn.DELETE_PROD_LINE" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t("quality.delete")}}</Button></Poptip>

            </div>
            <div class="iqis-page-tool-second">
              <!--<Button type="primary" icon="more">自定义列表</Button>-->
              <Button type="text"  icon="refresh" @click="table.selected='';search.query='';search.fieldName='';refreshTypeTree();refreshData();pageChange(1)">{{$t("quality.refresh")}}</Button>
              <!--<Button type="ghost" icon="share">导出报表</Button>-->
            </div>
          </div>


          <Table ref="pageTable" class="tableCustom" :loading="table.loading" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display: inline-block;"> -->
            <div style="padding: 20px 0 20px 0px;">
              <Page id="pageId" v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                    :page-size-opts="[10,20,50,100]"
                    @on-change="pageChange" @on-page-size-change="pageSizeChange"
                    size="small" show-total show-elevator show-sizer></Page>
            </div>
        </div>
      </div>

    </div>
    <Modal
      :title="editModal.item.prodLineId ? i18n.t('quality.mp') : i18n.t('quality.ap')"
      v-model="editModal.show"
      :mask-closable="false"
      :width="600" >
      <Row type="flex" :gutter="40">
        <i-col span="12">{{$t("quality.lineName")}}</i-col>
        <i-col span="12">{{$t("quality.category")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12"><Input :disabled="noPermsDis" :placeholder="i18n.t('quality.required')" v-model="editModal.item.name" style="width: 100%;"></Input>
        </i-col>
        <i-col span="12">
          <Cascader :disabled="noPermsDis" :transfer="false" v-model="editModal.item.prodLineTypeValue" :data="category[0].children"
                    :render-format = "loadProdLineTypeRender"
                    change-on-select :clearable="false" style="width: 100%"></Cascader>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="12">{{$t("quality.pm")}}</i-col>
        <i-col span="12">{{$t("quality.qm")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" >
        <i-col span="12">
          <Select :disabled="noPermsDis" v-model="editModal.item.prodUserId" filterable :placeholder="i18n.t('quality.ps')">
            <Option v-for="item in search.userList" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
          </Select>
        </i-col>
        <i-col span="12">
          <Select :disabled="noPermsDis" v-model="editModal.item.qualityUserId" filterable :placeholder="i18n.t('quality.ps')">
            <Option v-for="item in search.userList" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
          </Select>
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
  import $ from 'jquery';
  import Input from "iview/src/components/input";
  import ICol from "iview/src/components/grid/col";
  import SessionStorage from '@/utils/sessionStorage';
  import TreeCategory from "../../components/treeCategory/TreeCategory"
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
            {type: 'selection',
              align: 'center',
              width:40,
              minWidth:40,
              maxWidth:40
            },{
              title: i18n.t("quality.no"),
              width:50,
              className:'tablePadding',
              align:'center',
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
            },{
              title: i18n.t("quality.lineName"),
              className:'tablePadding',
              minWidth:80,
              // width:120,
              ellipsis:true,
              key: 'name'
            },{
              title: i18n.t("quality.category"),
              className:'tablePadding',
              minWidth:80,
              // width:180,
              ellipsis:true,
              key: 'prodLineType'
            },{
              title: i18n.t("quality.pm"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?90:140,
              // width:120,
              ellipsis:true,
              key: 'prodUserName'
            },{
              title: i18n.t("quality.ct"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:120,
              // width:120,
              ellipsis:true,
              key: 'prodUserContact'
            },{
              title: i18n.t("quality.qm"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?90:120,
              // width:120,
              ellipsis:true,
              key: 'qualityUserName'
            },{
              title: i18n.t("quality.ct"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:120,
              // width:120,
              ellipsis:true,
              key: 'qualityUserContact'
            }
            ,{
              title: i18n.t("quality.remarks"),
              className:'tablePadding',
              minWidth:80,
              // width:250,
              ellipsis:true,
              key: 'remark'
           }
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
        ],
        permsBtn:{
          "DELETE_PROD_LINE":false,
          "SELECT_PROD_LINE":false,
          "UPDATE_PROD_LINE":false,
          "INSERT_PROD_LINE":false,
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
          typeId:"prodLineTypeId",//类别id字段
          typeName:"prodLineTypeName",//类名名称
          treeListUrl:"/basic/prodlinetype",//树的数据接口名称
          addTreeUrl:"/basic/prodlinetype",//增加树元素的接口名称
          editTreeUrl:"/basic/prodlinetype",//修改树元素的接口名称
          deleteTreeUrl:"/basic/prodlinetype/",//删除树元素的接口名称
          chooseNodeUrl:"/basic/prodlinelist/",//选择树元素查找对应列表的接口名称
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
//      tableStyle(){
//        let tableHeight = $(window).height()-175;
//        return {
//          "height":tableHeight+"px"
//        }
//      }
    },

    methods:{
      changeTreeNode(resp,item){//从树组件传输数据回来，渲染列表页
        // console.log(item,"OOOOOOOOOOOOO");
        let that = this;
        that.snsData = item;
        that.data = resp.data;
        that.table.pager.total = resp.pagerInfo.total;
        let rowCount = resp.data ? resp.data.length : 10;
        that.table.pager.rows = Math.max(rowCount, 6);
      },
      onPopUp(){
        let that = this;
        // console.log(that.prodLineId)
        if((!that.prodLineId&&that.permsBtn.INSERT_PROD_LINE)||(that.prodLineId&&that.permsBtn.UPDATE_PROD_LINE)){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;

        }
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

        this.$http.get("/basic/prodline",{params:params}).then(function (resp) {
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
          let url = "/basic/prodlinelist/";
          that.$http.get(url + sns[0].prodLineTypeId, {params: params}).then((resp) => {
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
        this.$http.get("/basic/prodlinetype").then(function(resp){
          let root = {title:i18n.t("quality.lsc"),selected: false,label:i18n.t("quality.lsc"),value:0,expand:true};

          if(!selectValue){
            root.selected = true;
          }

          if(resp.data){

            if(selectValue){
              for(let i =0;i<resp.data.length;i++){
                resp.data[i].selected = resp.data[i].prodLineTypeId == selectValue;
                that.tree.selected = true;
              }
            }

            that.$iqis.utils.treeify(resp.data,root,"prodLineTypeId","prodLineTypeName","parentId");
          }
          that.category = [root];
        });

      },
      editSelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t("quality.cbm"),
            desc: ''
          });
          return;
        }
        this.showModal(selectedRow[0]);
      },
      onDBClick(obj,index){
        this.showModal(obj);
      },
      showModal(d){
        // console.log(d,4444444444444);
        
        if(!d){
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

        this.editModal.item = d;
        // this.editModal.item.prodLineTypeValue = ''
        this.editModal.show = true;

        this.editModal.requesting = false;
        this.loadEditData();
        // console.log(d,'dddddddddddddd')
        this.prodLineId=d.prodLineId||''
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
          this.$http.delete("/basic/prodlinetype/"+s_item.value).then(function (resp) {
            that.$Message.success(i18n.t("quality.ds"));
            that.refreshTypeTree(null);
          });
        }

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
            prodLineTypeName : this.tree.newNodeName,
            parentId : s_item.value
          };
          this.$http.post("/basic/prodlinetype",params).then(function (resp) {
            that.$Message.success(i18n.t("quality.sas"));
            that.tree.add = false;
            that.refreshTypeTree(s_item.value);
          })
        }
        this.tree.newNodeName = "";
      },editNode(){
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
            prodLineTypeId:s_item.prodLineTypeId,
            prodLineTypeName : this.tree.newNodeName,
            parentId : s_item.parentId
          };
          this.$http.put("/basic/prodlinetype",params).then(function (resp) {
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
        // if (this.editModal.item ==) {

        // }
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
          // {type: 'Empty', title: '生产负责人', value: that.editModal.item.prodUserId},
          // {type: 'Empty', title: '品质负责人', value: that.editModal.item.qualityUserId},
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
      },
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
      },treeAddInit(e){
        this.tree.newNodeName = "";
        let that = this;
        let txt = this.$refs.addTxt;
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


      },treeSelectChange(){
        let that=this;
        that.table.selected='';
        let sns = that.snsData;
        if(sns.length==0||sns[0].title==i18n.t("quality.lsc")){
          that.tree.selected='';
          that.refreshData();
        }else
        {
          that.refreshSelectData();
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
      tableSelectChange(selection){
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
            delArr.push(this.$http.delete("/basic/prodline/"+ss[i].prodLineId));
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



      //////
    }
  }

</script>
<style>
.xx{
  position: relative;
  position: absolute;
}
</style>
