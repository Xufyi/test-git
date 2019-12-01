<template>
  <div class="iqis-page">

    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-bus-tree" style="display: -webkit-flex;display: flex;flex-direction: column;flex: 0 0 260px;font-size: 14px;overflow: auto; border: 1px solid #e9eaec;margin-right: 16px;margin-top:11px;padding-left: 10px;" :style="treeStyle">
          <div class="iqis-page-tool-row iqis-tree-tool" style="flex: 0 0 47px;" >
            <div style="display: -webkit-flex;display: flex;justify-content:space-between;width: 100%;">
              <div class="iqis-page-tool-primary" style="padding: 12px 6px;">
                <Button type="ghost" icon="plus" @click="addSubNode" title='添加供应商类别'>添加分类</Button>
              </div>
              <div class="iqis-page-tool-second" style="padding: 12px 16px;">
                <Button type="ghost" icon="edit" :disabled="!tree.selected" @click="editTreeSelected" >修改</Button>
                <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                  confirm
                  title="确定要删除选择的类别吗?"
                  placement="bottom-end"
                  @on-ok="deleteTreeNode">
                  <Button type="ghost" :disabled="!tree.selected" icon="trash-a">删除</Button>
                </Poptip>

              </div>

            </div>

          </div>
          <div style="flex: 1 1 100px;overflow: auto;">
            <Tree ref="tree" :data="category" :multiple="false" @on-select-change="treeSelectChange" ></Tree>
          </div>
        </div>
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">

          <div class="iqis-page-search-row">
            <div class="iqis-page-search-bar-item" style="flex:0 0 210px;">
              <DatePicker type="daterange" v-model="search.dates" placement="bottom-end" placeholder="操作日期过滤" style="width: 200px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" placeholder="搜索全部" slot="prepend" style="width: 80px">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 24px;">
              <Button type="primary" @click="refreshTypeTree();refreshData()">搜索</Button>
              <Button type="ghost" @click="search.query='';search.fieldName='';search.dates=[]">重置</Button>
            </div>
          </div>

          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary">
              <Button type="ghost" icon="plus" @click="addProduct" title='添加供应商'>添加</Button>
              <Button type="ghost" icon="edit"  @click="editSelectRow" >修改</Button>
              <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                confirm
                title="确定要删除选择的项吗?"
                placement="bottom-end"
                @on-ok="deleteTableSelected">
                <Button type="ghost" icon="trash-a" :disabled="!table.selected">删除</Button>
              </Poptip>

            </div>
            <div class="iqis-page-tool-second">
              <!--<Button type="primary" icon="more">自定义列表</Button>-->
        <Button type="text"  icon="refresh" @click="table.selected='';search.dates=[];search.fieldName='';search.query='';refreshData(1);refreshTypeTree();">刷新</Button>
              
              <Button type="ghost" icon="share">导出报表</Button>
            </div>
          </div>


          <Table ref="pageTable" :height="430" :loading="table.loading" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <div style="padding: 20px 0 20px 0px;">
            <Page v-if="table.pager.need" :total="table.pager.total"  :page-size="table.pager.limit" :current="table.pager.current"
                  :page-size-opts="[10,20,50,100]"
                  @on-change="pageChange" @on-page-size-change="pageSizeChange"
                  size="small" show-total show-elevator show-sizer></Page>
          </div>

        </div>
      </div>

    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
    <Modal
      :title="editModal.item.measUnitId?'修改供应商类别':'添加供应商类别'"
      v-model="editModal.show"
      :mask-closable="false"
      :width="600" >
      <Row type="flex" :gutter="40">
        <i-col span="12">产品类别名称</i-col>
        <i-col span="12">产品类别代码</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12"><Input placeholder="必填" v-model="editModal.item.userName" style="width: 100%;"></Input>
        </i-col>
        <i-col span="12">
          <i-input placeholder="必填" v-model="editModal.item.manufacturerTypeNum" style="width: 100%;"></i-input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">所属类别</i-col>
      </Row>
      <Row type="flex" :gutter="40" >
        <i-col span="24">
          <Cascader :transfer="false"  v-model="editModal.item.productTypeValue" :data="category"
                    :render-format = "loadTypeRender"
                    change-on-select :clearable="false" style="width: 100%"></Cascader>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">备注
        </i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="24"><Input placeholder="请输入相关描述" v-model="editModal.item.remark" type="textarea" :rows="4" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <div slot="footer">
        <Button type="text" size="large" @click="editModal.show=false">取消</Button>
        <Button type="primary" size="large" @click="modalOk" :loading="editModal.requesting">确定</Button>
      </div>
      <!-- <Spin v-if="editModal.dataLoading" fix size="large"></Spin> -->
    </Modal>
  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import ICol from "iview/src/components/grid/col";

  export default {
    components: {
      ICol,
      Input
    },
    data: function () {
      let vm = this;
      return {
        data:[
        ],
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
              width:40,
              minWidth:40,
              maxWidth:40
            },{
              title: '供应商编号',
              width:130,
              key: 'manufacturerNum'
            },{
              title: '供应商简称',
              width:130,
              key: 'manufacturerAbbreviation'
            },{
              title: '供应商全称',
              width:200,
              key: 'manufacturerName'
            },{
              title: '英文名称',
              align: 'center',
              width:260,
              key: 'manufacturerEngName'
            },{
              title: '厂商类别',
              align: 'center',
              width:100,
              key: 'manufacturerTypeName'
            },{
              title: '联系人',
              align: 'center',
              width:120,
              key: 'contacts'
            },{
              title: '电话',
              align: 'center',
              width:130,
              key: 'phone'
            },{
              title: '厂商地址',
              align: 'center',
              width:200,
              key: 'address'
            },{
              title: '备注',
              width:330,
              key: 'remark'
            }
            ,{
              title: '备注',
              minWidth:100,
              key: 'remark'
            }
          ]
        },
        search: {
          query: "",
          fieldName: "",
          typeTree:[],
          userList:[],
          dates:[],
          typeDataLoading:false,
          data: {
            searchTypes: [
              {
                label: "搜索全部",
                value: ""
              }, {
                label: "供应商编号",
                value: "no"
              }, {
                label: "供应商名称",
                value: "name"
              }, {
                label: "备注",
                value: "remark"
              }
            ]
          }
        }


      }
    },//end data

    created(){
      this.refreshTypeTree();
      this.refreshData();
    },
    computed:{
      treeStyle(){
        return {
          "height":(9*40+159)+"px"//(Math.max(this.table.pager.rows,10)*40+144)+"px"
        };
      }
    },

    methods:{
      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        this.refreshData();

      },
      pageChange(page){
        this.table.pager.current = page;
        this.refreshData();
      },
      refreshData(){
        let that = this;

        that.table.loading = true;

        let params = {};

        if(this.search.dates && this.search.dates[0]){
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];
          params.startDate = this.$iqis.utils.getDayStart(0,sdate);
          params.endDate = this.$iqis.utils.getDayEnd(edate);
        }

        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;


        this.$http.get("/bas/manufacturer",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.loading = false;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
        })
      },
      refreshTypeTree(selectValue){
        let that = this;
        that.tree.selected = false;
        this.$http.get("/bas/manufacturerType",{params:{limit:99999999}}).then(function(resp){
          let root = {title:"供应商类别",selected: false,label:"供应商类别",value:0,expand:true};

          if(!selectValue){
            //console.log("set root select:"+selectValue);
            root.selected = true;
          }

          if(resp.data){

            if(selectValue){
              for(let i =0;i<resp.data.length;i++){
                //console.log("set node select:"+selectValue);
                resp.data[i].selected = resp.data[i].manufacturerTypeId == selectValue;
                that.tree.selected = true;
              }
            }

            that.$iqis.utils.treeify(resp.data,root,"manufacturerTypeId",function(item){
              return "["+item.manufacturerTypeNum+"]"+item.manufacturerTypeName;
            },"parentId");
          }
          that.category = [root];
        });

      },
      addProduct(){
        //this.$emit("open-tab","product-list-add","添加产品","page-product-add",null);

      },
      editSelectRow(e){
//         let selectedRow = this.$refs.pageTable.getSelection()
//         //console.log(selectedRow);
//         if(!selectedRow || selectedRow.length != 1){
//           this.$Notice.warning({
//             title: '必须选择一条记录后才可以进行修改',
//             desc: ''
//           });
//           return;
//         }
// //+selectedRow[0].productId+"]"
//         this.$emit("open-tab","product-list-update-"+selectedRow[0].productId,"修改产品","page-product-add",{productId:selectedRow[0].productId});

        //this.showModal(selectedRow[0]);
      },
      onDBClick(obj,index){
        this.$emit("open-tab","exam-iqc-Supplier-update-"+obj.manufacturerId,"修改供应商-"+obj.manufacturerAbbreviation,"page-exam-iqc-Supplier-update",{manufacturerId:obj.manufacturerId,proID:2});
      },
      showModal(d,pid){
        let result = this.$iqis.utils.findPathInTree(this.category[0],[],pid,"manufacturerTypeId");
        result = result || [];
        if(!d){
          d = {productTypeValue:[],name:"",remark:"",manufacturerTypeNum:''}
        }else{

        }
        d.productTypeValue = result;
        //console.log(88888+'--llll')
        //console.log(d)
        this.editModal.item = d;
        this.editModal.show = true;
        this.editModal.requesting = false;
        // this.loadEditData();
      },
      deleteTreeNode(){
        let sns = this.$refs.tree.getSelectedNodes();
        //console.log(sns)
        let s_item = null;
        if(sns && sns.length > 0){
          s_item = sns[0];
        }

        if(s_item){
          let that = this;
          this.$http.delete("/bas/manufacturerType/"+s_item.manufacturerTypeId).then(function (resp) {
            that.$Message.success("删除成功！");
            that.refreshTypeTree(null);
          });
        }

      },addSubNode(){
        let that = this;
        let sns = this.$refs.tree.getSelectedNodes();
        let s_item = this.category[0];
        if(sns && sns.length > 0){
          s_item = sns[0];
        }
          this.showModal(null,s_item.manufacturerTypeId);


      },editTreeSelected(){

        // let that = this;
        //
        // let sns = this.$refs.tree.getSelectedNodes();
        // let s_item = this.category[0];
        // if(sns && sns.length > 0){
        //   s_item = sns[0];
        // }
        // if(s_item){
        //   this.showModal(s_item,s_item.parentId);
        // }
      },
      modalCancel(){

      },
      modalOk(){
        //console.log(this.editModal.item);
        // this.editModal.requesting = true;
        // this.editModal.item.parentId = null;
        // if(this.editModal.item.productTypeValue && this.editModal.item.productTypeValue.length > 0){
        //   let plt = this.editModal.item.productTypeValue[this.editModal.item.productTypeValue.length-1];
        //   if(plt){
        //     this.editModal.item.parentId = plt;
        //   }
        // }

        // if(!this.editModal.item.name || !this.editModal.item.manufacturerTypeNum){
        //   this.$Notice.warning({
        //     title: '必须录入名称和选择类型以及单位符号',
        //     desc: ''
        //   });
        //   this.editModal.requesting = false;
        //   return;
        // }
        // let that = this;
        // if(this.editModal.item.manufacturerTypeId){
        //   that.$http.put("/basic/prodtype",that.editModal.item).then(function (resp) {
        //     that.refreshTypeTree(that.editModal.item);
        //     that.$Message.success("修改成功");
        //     that.editModal.show = false;
        //   });
        // }else{
        //   that.$http.post("/basic/prodtype",that.editModal.item).then(function (resp) {
        //     that.refreshTypeTree(that.editModal.item.parentId);
        //     that.$Message.success("添加成功");
        //     that.editModal.show = false;
        //   });
        // }

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
        this.$http.get("/basic/measunittype",{params:{limit:99999999}}).then(function (resp) {
          that.search.prodLineTypeList = resp.data;
          that.search.typeDataLoading = false;
        });
      },treeAddInit(e){
        this.tree.newNodeName = "";
        let that = this;
        let txt = this.$refs.addTxt;
        //console.log(txt);
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
        let sns = this.$refs.tree.getSelectedNodes();
        let s_item = null;
        if(sns && sns.length > 0){
          s_item = sns[0];
        }
        this.tree.selected = s_item && s_item.value;
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
        this.table.selected = selection && selection.length > 0
      },deleteTableSelected(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/basic/product/"+ss[i].productId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success("删除成功！");
              that.refreshData();
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
