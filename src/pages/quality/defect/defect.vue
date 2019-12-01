<template>
  <div class="iqis-page">

    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-bus-tree treeCustom" style="display: -webkit-flex;display: flex;flex-direction: column;flex: 0 0 185px;font-size: 14px;overflow: auto; border: 1px solid #e9eaec;margin-right: 16px;margin-top:11px;padding-left: 10px;" :style="treeStyle">
          <div style="flex: 1 1 100px;overflow: auto;">
            <Tree ref="tree" :data="category" :multiple="false" @on-select-change="treeSelectChange" ></Tree>
          </div>
        </div>
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">

          <div class="iqis-page-search-row">
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t("quality.sa")" slot="prepend" style="width: 90px;text-align: left">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
              <Button style="margin-right:8px;" type="primary" @click="table.pager.current = 1;table.selected='';refreshTypeTree();refreshData()">{{$t("quality.search")}}</Button>
              <Button type="ghost" @click="table.selected='';search.query='';search.fieldName='';refreshTypeTree();refreshData();pageChange(1);$refs.treeCategory.refreshTypeTree()">{{$t("quality.reset")}}</Button>
            </div>
          </div>

          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <Button style="margin-right:8px;" v-if="permsBtn.INSERT_DEFECT_TYPE" type="ghost" icon="plus"  @click="showModal(null)">{{$t("quality.add")}}</Button>
              <Button style="margin-right:8px;" v-if="permsBtn.UPDATE_DEFECT_TYPE" type="ghost" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t("quality.modify")}}</Button>
              <Poptip
                confirm
                :title="i18n.t('quality.dsi')"
                placement="bottom-start"
                :ok-text='i18n.t("quality.confirm")'
                :cancel-text='i18n.t("quality.cancel")'
                @on-ok="deleteTableSelected">
                <Button v-if="permsBtn.DELETE_DEFECT_TYPE" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t("quality.delete")}}</Button>
              </Poptip>

            </div>
            <div class="iqis-page-tool-second">
              <!--<Button type="primary" icon="more">自定义列表</Button>-->
              <Button type="text"  icon="refresh" @click="table.selected='';search.query='';search.fieldName='';refreshTypeTree();refreshData();pageChange(1)">{{$t("quality.refresh")}}</Button>
              <!--<Button type="ghost" icon="share">导出报表</Button>-->
            </div>
          </div>


          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" :loading="table.loading" v-drag-table-column="table.columns" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display:inline-block;"> -->
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
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
    <Modal
      :title="editModal.item.defectTypeId?i18n.t('quality.mdn'):i18n.t('quality.adn')"
      v-model="editModal.show"
      :mask-closable="false"
      :width="600" >
      <Row type="flex" :gutter="40">
        <i-col span="12">{{$t("quality.dn")}}</i-col>
        <i-col span="12">{{$t("quality.dg")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12"><Input :disabled="noPermsDis" :placeholder="i18n.t('quality.required')" v-model="editModal.item.name" style="width: 100%;"></Input>
        </i-col>
        <i-col span="12">
          <Select :disabled="noPermsDis" v-model="editModal.item.qltyLvId" filterable :placeholder="i18n.t('quality.ps')">
            <Option :disabled="noPermsDis" v-for="item in search.defectLevel" :value="item.qltyLvId" :key="item.qltyLvId">{{ item.name }}</Option>
          </Select>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">{{$t("quality.inspection")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" >
        <i-col span="24">
          <Cascader :disabled="noPermsDis"  :transfer="false" v-model="editModal.item.inspectionTypeValue" :data="category[0].children"
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
  export default {
    components: {
      ICol,
      Input
    },
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        modify:0,
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
          loading:false,
          selected:false,
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
              width:50,
              align: 'center',
              className:'tablePadding',
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
            },
            {
              title: i18n.t("quality.dn"),
              className:'tablePadding',
              // width: 240,
               minWidth:80,
              // maxWidth:80,
              ellipsis:true,
              key: 'name'
            },{
              title: i18n.t("quality.dg"),
              className:'tablePadding',
              // width:240,
              minWidth:80,
              ellipsis:true,
              key: 'qltyLvName'
            },{
              title: i18n.t("quality.inspection"),
              className:'tablePadding',
              // width:200,
              minWidth:80,
              ellipsis:true,
              key: 'inspectionTypeName'
            },{
              title: i18n.t("quality.remarks"),
              className:'tablePadding',
              minWidth:100,
              ellipsis:true,
              // width:300,
              key: 'remark'
            }
          ]
        },
        search: {
          query: "",
          fieldName: "",
          typeTree:[],
          defectLevel:[],
          typeDataLoading:false,
          data: {
            searchTypes: [
              {
                label: i18n.t("quality.sa"),
                value: ""
              },{
                label: i18n.t("quality.dn"),
                value: "name"
              },{
                label: i18n.t("quality.dg"),
                value: "qltyLvName"
              },{
                label: i18n.t("quality.inspection"),
                value: "inspectionTypeName"
              },{
                label: i18n.t("quality.remarks"),
                value: "remark"
              }
            ]
          }
        },
        permsCur:[
          "INSERT_DEFECT_TYPE",
          "DELETE_DEFECT_TYPE",
          "UPDATE_DEFECT_TYPE",
          "SELECT_DEFECT_TYPE",
        ],
        permsBtn:{
          "DELETE_DEFECT_TYPE":false,
          "SELECT_DEFECT_TYPE":false,
          "UPDATE_DEFECT_TYPE":false,
          "INSERT_DEFECT_TYPE":false,
        },
        noPermsDis:true,


      }
    },//end data

    created(){
      let permsAll = this.$store.state.permissions;
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
      this.refreshTypeTree();
      this.refreshData();
    },
    computed:{
      treeStyle(){
        return {
          // "height":(9*40+159)+"px"//(Math.max(this.table.pager.rows,10)*40+144)+"px"
          "height":535+"px"//(Math.max(this.table.pager.rows,10)*40+144)+"px"
        };
      }
    },
    methods:{
      onPopUp(){
        let that = this;
        if((!that.editModal.item.defectTypeId&&that.permsBtn.INSERT_DEFECT_TYPE)||(that.editModal.item.defectTypeId&&that.permsBtn.UPDATE_DEFECT_TYPE)){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
      },

      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        this.refreshSelectData();

      },
      pageChange(page){
        this.table.pager.current = page;
        this.refreshSelectData();
      },
      refreshData(){
        let that = this;

        that.table.loading = true;

        let params = {};

        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;

        this.$http.get("/basic/defecttype",{params:params}).then(function (resp) {
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
        that.tree.selected = true;
        let sns = obj||this.$refs.tree.getSelectedNodes();
        if(sns.length==0||sns[0].title==i18n.t("quality.inspection")){
          that.refreshData();
        }else {
          let params = {};

          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          let url = "/basic/defecttypelist/";
          that.$http.get(url + sns[0].inspectionTypeId, {params: params}).then((resp) => {
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
        this.$http.get("/basic/inspectiontype",{params:{limit:99999999}}).then(function(resp){
          let root = {title:i18n.t("quality.inspection"),selected: false,label:i18n.t("quality.inspection"),value:0,expand:true};

          if(!selectValue){
            root.selected = true;
          }

          if(resp.data){
            if(selectValue){
              for(let i =0;i<resp.data.length;i++){
                resp.data[i].selected = resp.data[i].inspectionTypeId == selectValue;
                that.tree.selected = true;
              }
            }

            that.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
          }
          that.category = [root];
          that.tableEditDis=true;
        });

      },
      editSelectRow(e){
        this.modify = 1
        let selectedRow = this.$refs.pageTable.getSelection();
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
        if(!d){
          let that = this;
          let sns = this.$refs.tree.getSelectedNodes();
          let s_item = this.category[0];
          if(sns && sns.length > 0){
            s_item = sns[0];
          }
          let result = this.$iqis.utils.findPathInTree(this.category[0],[],s_item.inspectionTypeId,"inspectionTypeId");
          result = result || [];
          d = {inspectionTypeValue:[],name:"",remark:"",qltyLvId:'',qltyLvName:''}
          d.inspectionTypeValue = result;

        }else{
          let result = this.$iqis.utils.findPathInTree(this.category[0],[],d.inspectionTypeId,"inspectionTypeId");
          result = result || [];
          d = {inspectionTypeValue:[],defectTypeId:d.defectTypeId,name:d.name,remark:d.remark,qltyLvId:d.qltyLvId,qltyLvName:d.qltyLvName}
          d.inspectionTypeValue = result;
        }

        this.editModal.item = d;
        this.editModal.show = true;
        this.editModal.requesting = false;
        this.loadEditData();
        this.editModal.item.defectTypeId=d.defectTypeId||'';
        this.onPopUp()
      },
      deleteTreeNode(){
        let sns = this.$refs.tree.getSelectedNodes();
        let s_item = null;
        if(sns && sns.length > 0){
          s_item = sns[0];
        }

        if(s_item){
          let that = this;
          this.$http.delete("/basic/inspectiontype/"+s_item.value).then(function (resp) {
            that.$Message.success(i18n.t("quality.ds"));
            that.refreshTypeTree(null);
          });
        }

      },
      addNewNode(){
        this.tree.add = false;
        let that = this;
        if(this.tree.newNodeName){
          let sns = this.$refs.tree.getSelectedNodes();
          let s_item = this.category[0];
          if(sns && sns.length > 0){
            s_item = sns[0];
          }

          let params = {
            measUnitTypeName : this.tree.newNodeName,
            parentId : s_item.value
          };
          this.$http.post("/basic/inspectiontype",params).then(function (resp) {
            that.$Message.success(i18n.t("quality.sas"));
            that.refreshTypeTree(s_item.value);
          })
        }
        this.tree.newNodeName = "";
      },editNode(){

        let that = this;
        if(this.tree.newNodeName){
          let sns = this.$refs.tree.getSelectedNodes();
          let s_item = this.category[0];
          if(sns && sns.length > 0){
            s_item = sns[0];
          }

          let params = {
            inspectionTypeId:s_item.inspectionTypeId,
            measUnitTypeName : this.tree.newNodeName,
            parentId : s_item.parentId
          };
          this.$http.put("/basic/inspectiontype",params).then(function (resp) {
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
        //判断缺陷等级Id是否被删除，若删除则无法保存
        this.$http.get("/basic/qltylv",{params:{limit:99999999}}).then(function (res) {
          //在点击修改时进入此方法进行提示
          if(that.modify){
            var isQltyLvExist = 1;
            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                if (that.editModal.item.qltyLvId == res.data[i].qltyLvId) {
                  isQltyLvExist = 0;
                  break;
                }
              }
              if (isQltyLvExist == 1) {
                that.$Notice.warning({title: i18n.t("quality.ddns")});
                that.modify = 0
                return;
              }
            }
          }
          
          that.editModal.requesting = false;
          that.editModal.item.inspectionTypeId = null;
          if (that.editModal.item.inspectionTypeValue && that.editModal.item.inspectionTypeValue.length > 0) {
            let plt = that.editModal.item.inspectionTypeValue[that.editModal.item.inspectionTypeValue.length - 1];
            if (plt) {
              that.editModal.item.inspectionTypeId = plt;
            }
          }
          let params = [
            {type: 'Empty', title: i18n.t("quality.dn"), value: that.editModal.item.name},
            {type: 'Name', title: i18n.t("quality.dn"), value: that.editModal.item.name},
            {type: 'Empty', title: i18n.t("quality.dg"), value: that.editModal.item.qltyLvId},
            {type: 'Empty', title: i18n.t("quality.inspection"), value: that.editModal.item.inspectionTypeId},
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
          if (that.editModal.item.defectTypeId) {
            that.$http.put("/basic/defecttype", that.editModal.item).then(function (resp) {
              that.table.selected = '';
              that.search.query = '';
              that.search.fieldName = '';
              that.table.pager.current = 1;
              that.$Message.success(i18n.t("quality.ats"));
              that.editModal.show = false;
              //跳转到对应的树节点下
              that.refreshTypeTree(that.editModal.item.inspectionTypeId);
              let sns = [];
              let node = {};
              node.title = "";
              node.inspectionTypeId = that.editModal.item.inspectionTypeId;
              sns.push(node);
              that.refreshSelectData(sns);
            });
          } else {
            that.$http.post("/basic/defecttype", that.editModal.item).then(function (resp) {
              that.table.selected = '';
              that.search.query = '';
              that.search.fieldName = '';
              that.table.pager.current = 1;
              that.$Message.success(i18n.t("quality.as"));
              that.editModal.show = false;
              //跳转到对应的树节点下
              that.refreshTypeTree(resp.data.inspectionTypeId);
              let sns = [];
              let node = {};
              node.title = "";
              node.inspectionTypeId = resp.data.inspectionTypeId;
              sns.push(node);
              that.refreshSelectData(sns);
            });
          }
        });

        //this.editModal = true;
      },
      loadTypeRender(label){
        //render-format
        if(!label || label.length == 0){
          return '';
        }
        let result = label[label.length-1];

        if( (this.category.length > 0  && result == this.category[0].label)){
          return ''
        }

        return result;
      },
      loadType(){
        this.search.typeDataLoading = true;
        let that = this;
        this.search.prodLineTypeList = [];
        this.$http.get("/basic/inspectiontype",{params:{limit:99999999}}).then(function (resp) {
          that.search.prodLineTypeList = resp.data;
          that.search.typeDataLoading = false;
        });
      },treeAddInit(e){
        this.tree.newNodeName = "";
        let that = this;
        let txt = this.$refs.addTxt;
        this.$nextTick(function () {
          txt.focus();
        });
      },treeEditInit(e){
        let sns = this.$refs.tree.getSelectedNodes();
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
        let sns = this.$refs.tree.getSelectedNodes();
        if(sns.length==0||sns[0].title==i18n.t("quality.inspection")){
          that.refreshData();
        }else
        {
          that.refreshSelectData();
        }
      },
      loadEditData(){
        this.editModal.dataLoading = true;

        let that = this;
        let qltyLvId = that.editModal.item.qltyLvId;
        this.$http.get("/basic/qltylv",{params:{limit:99999999}}).then(function (resp) {
          if(resp.data){
            that.search.defectLevel = resp.data;

            //判断缺陷等级Id是否在等级列表中，若不在，将这个缺陷等级push到等级列表中
            var isQltylvExist = 1;
            for(var i=0;i<that.search.defectLevel.length;i++){
              if(that.editModal.item.qltyLvId == that.search.defectLevel[i].qltyLvId){
                isQltylvExist = 0;
                break;
              }
            }
            if(isQltylvExist == 1 && that.editModal.item.qltyLvName != ''){
              var qltyLv = {
                qltyLvId:that.editModal.item.qltyLvId,
                name:that.editModal.item.qltyLvName
              }
              that.$set(that.search.defectLevel,that.search.defectLevel.length,qltyLv);
              that.editModal.item.qltyLvId = qltyLvId;
            }

            that.editModal.dataLoading = false;
          }
        });
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
            delArr.push(this.$http.delete("/basic/defecttype/"+ss[i].defectTypeId));
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
