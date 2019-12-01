<template>
  <div class="iqis-page">
    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-bus-tree treeCustom" style="display: -webkit-flex;display: flex;flex-direction: column;flex: 0 0 185px;font-size: 14px;overflow: auto; border: 1px solid #e9eaec;margin-right: 16px;padding-left: 10px;" :style="treeStyle">
          <div style="flex: 1 1 100px;overflow: auto;">
            <Tree ref="tree" :data="category" :multiple="false" @on-select-change="pageChange(1)"></Tree>
          </div>
        </div>
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">
          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" :loading="table.loading" v-drag-table-column="table.columns" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display:inline-block;"> -->
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
    <div class="arrangement-dialog">
      <Modal
      :title="i18n.t('fileCenter.customList')"
      v-model="arrangement.state"
      class="rankBox"
      :mask-closable="false"
      :width="600" >
      <span class="list_txt">{{$t('fileCenter.select')}}</span>
       <div class="list_ok list">
        <div v-for="(item,index) in arrangement.data1" class="dataItem" :class="'check'+index"  :key="index">
          <input type="checkbox"   :value="item"  v-model="arrangement.data" >
           <span >{{item.title}}</span>
         </div>
       </div>
       <span class="list_txt2">{{$t('fileCenter.tsl')}}</span>
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
        <Button type="primary" size="large" @click="ReplyOk" >{{$t('fileCenter.rdc')}}</Button>
        <Button type="primary" size="large" @click="RankOk" >{{$t('fileCenter.confirm')}}</Button>
        <Button type="text" size="large" @click="RankNo">{{$t('fileCenter.cancel')}}</Button>
      </div>
      </Modal>
    </div>
    <Modal
      :title="editModal.item.productId?'修改产品类别':'添加产品类别'"
      v-model="editModal.show"
      :mask-closable="false"
      :width="600" >
      <Row type="flex" :gutter="40">
        <i-col span="12">产品类别名称</i-col>
        <i-col span="12">产品类别代码</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12"><Input placeholder="必填" v-model="editModal.item.name" style="width: 100%;"></Input>
        </i-col>
        <i-col span="12">
          <i-input placeholder="必填" v-model="editModal.item.prodTypeCode" style="width: 100%;"></i-input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">所属类别</i-col>
      </Row>
      <Row type="flex" :gutter="40" >
        <i-col span="24">
          <Cascader :transfer="false"  v-model="editModal.item.productTypeValue" :data="category"
                    :render-format = "loadProdTypeRender"
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
        <Button type="primary" size="large" @click="modalOk" :loading="editModal.requesting">确定</Button>
        <Button type="text" size="large" @click="editModal.show=false">取消</Button>
      </div>
      <Spin v-if="editModal.dataLoading" fix size="large"></Spin>
    </Modal>
  </div>

</template>
<script>
  import $ from "jquery";
  import Input from "iview/src/components/input";
  import ICol from "iview/src/components/grid/col";

  export default {
    components: {
      ICol,
      Input
    },
    props:["params"],
    data: function () {
      let vm = this;
      return {
        data:[
        ],

        tableEditDis:true,
        editModal:{
          dataLoading:false,
          item:{},
          show:false,
          requesting:false
        },

        category:[{
          title: '生产类别',
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
            {
              title: '用户角色',
              ellipsis:true,
              key: 'role'
            },{
              title: '添加目录',
              ellipsis:true,
              key: 'ADDDIRECTORY'
            },{
              title: '上传',
              ellipsis:true,
              key: 'UPLOAD'
            },{
              title: '下载',
              ellipsis:true,
              key: 'DOWNLOAD'
            },{
              title: '移动',
              ellipsis:true,
              key: 'MOVE'
            },{
              title: '重命名',
              ellipsis:true,
              key: 'RENAME',
            },{
              title: '详情',
              ellipsis:true,
              key: 'DETAILS',
            },{
              title: '删除',
              ellipsis:true,
              key: 'DELETE'
            }
          ]
        },
        arrangement:{
          state:false,
          data:[],
          data1:[],
        },
        index:1,
        dataList:[],
        search: {
          query: "",
          fieldName: "",
          typeTree:[],
          userList:[],
          dates:[],
          typeDataLoading:false,
          useState:"",
          stateList:[
            {value:"",label:"全部"},
            {value:"1",label:"使用中"},
            {value:"0",label:"停止使用"}
          ],
          examType:"",
          examTypeList:[
            {value:"",label:"全部"},
            {value:"1",label:"来料"},
            {value:"2",label:"过程"},
            {value:"4",label:"出货"},
            {value:"3",label:"来料|过程"},
            {value:"5",label:"来料|出货"},
            {value:"6",label:"过程|出货"},
            {value:"7",label:"来料|过程|出货"},
          ],
          data: {
            searchTypes: [
              {
                label: "搜索全部",
                value: ""
              }, {
                label: "产品编号",
                value: "no"
              }, {
                label: "产品名称",
                value: "name"
              },  {
                label: "产品规格",
                value: "spec"
              },  {
                label: "产品单位",
                value: "prodUnitName"
              },  {
                label: "所属类别",
                value: "prodTypeName"
              },  {
                label: "操作人",
                value: "updater"
              }, {
                label: "备注",
                value: "remark"
              }
            ]
          }
        },
        permsCur:[
          'INSERT_PRODUCT',
          'SELECT_PRODUCT',
          'UPDATE_PRODUCT',
          'DELETE_PRODUCT',
          'EXPORT_PRODUCT'
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "INSERT_PRODUCT":false,
          "SELECT_PRODUCT":false,
          "UPDATE_PRODUCT":false,
          "DELETE_PRODUCT":false,
          "EXPORT_PRODUCT":false
        },

      }
    },//end data
    created(){
      let permsAll = this.$store.state.permissions;
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.refreshTypeTree();
      this.refreshData();
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
    },
    watch:{
      renderList:function(a,b){
        if(a){
          this.reset('transfer');//从编辑页面传值过来时，加上一个参数
        }
      }
    },
    computed:{
      treeStyle(){
        return {
          "height":(9*40+159)+"px"//(Math.max(this.table.pager.rows,10)*40+144)+"px"
        };
      },
      renderList (){
        return this.$store.state.renderExamList;
      }
    },

    methods:{
      // getPermissionsAll(){
      //   this.permsAll = this.$store.state.perms;
      //   for(let i in this.permsCur){
      //     // this.getPermissionsBtn(this.permsCur[i]);
      //     if(this.permsAll.indexOf(this.permsCur[i])!=-1){
      //       this.permsBtn[this.permsCur[i]] = false;
      //     }else{
      //       this.permsBtn[this.permsCur[i]]= true;
      //     }
      //   }
      // },
      // getPermissionsBtn(perm){
      //   if(this.permsAll.indexOf(perm)!=-1){
      //     this.permsBtn[perm] = false;
      //   }else{
      //     this.permsBtn[perm]= true;
      // }
      exportStatement (index){
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        if(index == 1){
          url = '/basic/product/export/list';
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

        this.$iqis.download(url,params,methods,()=>{}) //下载文件
      },
      // //点击跳转到输入的页码
      // goElevatorPage(){
      //   var evtObj;
      //   var thisPage=document.getElementById('pageId');
      //   //console.log(thisPage);
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
      reset(method){
        this.table.selected='';
        this.tableEditDis=true;
        this.search.query='';
        this.search.fieldName='';
        this.search.useState="";
        this.search.examType="";
        this.search.dates=[];
        this.refreshData();
        this.pageChange(1)
        //console.log(this.$props.params)
        let prodTypeId = this.$props.params && this.$props.params.prodTypeId;
        // //console.log(prodTypeId,'拿到修改/添加页传过来的产品类别Id')
        if(prodTypeId&&method=='transfer'){
          this.table.loading=true;
          this.refreshTypeTree(prodTypeId);
        }else{
          this.refreshTypeTree();
        }
      },
      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        // this.refreshSelectData();
        // this.refreshData();
        this.treeSelectChange();

      },
      pageChange(page){
        // this.refreshSelectData();
        this.table.pager.current = page;
        // this.refreshData();
        this.treeSelectChange();


      },
      refreshData(){
        let that = this;
        that.table.selected='';
        that.tree.selected='';

        that.table.loading = true;

        let params = {};

        if(this.search.dates && this.search.dates[0]){
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];

          params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          params.endDate = this.$iqis.utils.getDayEnd(edate);
        }
        params.examType = this.search.examType;
        params.useState = this.search.useState;
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;
        params.customerId = this.$store.state.customerId||'';
        this.$http.get("/basic/product",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.loading = false;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
        })
        this.$store.commit('RENDER_CHANGE',false)
      },

      refreshTypeTree(selectValue){
        let that = this;
        that.tree.selected = false;
        let customerId = this.$store.state.customerId||'';
        let params={}
        params.limit=999999999;
        params.query='customerId='+customerId;
        this.$http.get("/basic/prodtype",{params:params}).then(function(resp){
          let root = {title:"产品类别",selected: false,label:"产品类别",value:0,expand:true};

          if(!selectValue){
            //console.log("set root select:"+selectValue);
            root.selected = true;
            that.refreshData();
          }

          if(resp.data){

            if(selectValue){
              for(let i =0;i<resp.data.length;i++){
                //console.log("set node select:"+selectValue);
                resp.data[i].selected = resp.data[i].prodTypeId == selectValue;
                that.tree.selected = true;
              }
              that.treeSelectChange(selectValue);
            }

            that.$iqis.utils.treeify(resp.data,root,"prodTypeId",function(item){
              return item.name;
            },"parentId");
          }
          //console.log(root);
          that.category = [root];
        });

      },
      treeSelectChange(selectValue){
        let that=this;
        if(selectValue&&selectValue[0]&&!selectValue[0].prodTypeId){//1如果选中的是供应商类别，刷新全部分类数据
          // //console.log(selectValue,111111111111)
          // that.tree.selected=false;
          that.refreshData();
        }
        if(selectValue&&selectValue[0]&&selectValue[0].prodTypeId){//2如果选中的是其他分类，使selectValue等于该分类的Id
          selectValue=selectValue[0].prodTypeId;
        }
        if((selectValue!=''&&!isNaN(selectValue))||!selectValue){//3如果是选中的其他分类Id，或传过来的分类Id，掉接口拿到该分类的数据
          if(!selectValue){
            let sns=this.$refs.tree.getSelectedNodes();
            if(sns&&sns.length==1){
              selectValue=sns[0].prodTypeId;
              // //console.log(sns,22222222222);
              if(sns[0].title=='产品类别'){
                that.refreshData();
                return;
              }
            }else{
              that.refreshTypeTree();
              return;
            }
          }
          let params = {};
          params.page = that.table.pager.current;
          params.limit = that.table.pager.limit;
          params.customerId = this.$store.state.customerId||'';
          that.tree.selected=true
          let url="/basic/productlist/"
          // //console.log(selectValue,333333333)
          that.$http.get(url+selectValue,{params: params}).then((res)=>{
            that.data=res.data
            that.table.loading=false;
            that.table.pager.total = res.pagerInfo.total;
            // //console.log(res.pagerInfo.total,'监控翻页')
            let rowCount = res.data ? res.data.length : 10;
            that.table.pager.rows = Math.max(rowCount, 6);
          })
        }
        //   let that=this;
        //   that.table.selected='';
        //   let sns = this.$refs.tree.getSelectedNodes();
        //   if(sns.length==0||sns[0].title=='产品类别'){
        //     that.tree.selected='';
        //     that.refreshData();
        //   }else
        //   {
        //     that.refreshSelectData();
        //   }
        // },
        // refreshSelectData(){
        //   let that=this;
        //   let sns = this.$refs.tree.getSelectedNodes();
        //   if(sns.length==0||sns[0].title=='产品类别'){
        //     that.refreshData();
        //   }else {
        //     this.table.pager.current=1;
        //     this.table.pager.limit=10;
        //     let params = {};
        //     params.page = this.table.pager.current;
        //     params.limit = this.table.pager.limit;
        //     //console.log(params);
        //     that.tree.selected = true;
        //     let url = "/basic/productlist/";
        //     that.$http.get(url + sns[0].prodTypeId, {params: params}).then((resp) => {
        //       that.data = resp.data;
        //       that.table.pager.total = resp.pagerInfo.total;
        //       let rowCount = resp.data ? resp.data.length : 10;
        //       that.table.pager.rows = Math.max(rowCount, 6);
        //     });
        //   }
      },
      addProduct(){
        let that = this;

        let sns = this.$refs.tree.getSelectedNodes();
        let s_item = this.category[0];
        if(sns && sns.length > 0){
          s_item = sns[0];
        }
        let result = [];
        if(s_item) {
          result = this.$iqis.utils.findPathInTree(this.category[0], [], s_item.prodTypeId, "prodTypeId");
          //console.log(result);
        }
        this.$emit("open-tab","product-list-add-"+result,"添加产品","page-product-add",{productTypeValue:result});

      },
      editSelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        //console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: '必须选择一条记录后才可以进行修改',
            desc: ''
          });
          return;
        }
        this.$emit("open-tab","product-list-update-"+selectedRow[0].productId,"修改产品","page-product-add",{productId:selectedRow[0].productId});
      },
      onDBClick(obj,index){
        this.$emit("open-tab","product-list-update-"+obj.productId,"修改产品","page-product-add",{productId:obj.productId});
      },
      copySelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        //console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t('stopCopy'),
            desc: ''
          });
          return;
        }
        this.$emit("open-tab","product-list-copy-"+selectedRow[0].productId,"复制产品","page-product-add",{productId:selectedRow[0].productId});
      },
      showModal(d,pid){
        let result = this.$iqis.utils.findPathInTree(this.category[0],[],pid,"prodTypeId");
        result = result || [];
        if(!d){
          d = {productTypeValue:[],name:"",remark:"",prodTypeCode:''}
        }else{

        }
        d.productTypeValue = result;
        this.editModal.item = d;
        this.editModal.show = true;
        this.editModal.requesting = false;
        this.loadEditData();
      },
      deleteTreeNode(){
        let sns = this.$refs.tree.getSelectedNodes();
        let s_item = null;
        if(sns && sns.length > 0){
          s_item = sns[0];
        }

        if(s_item){
          let that = this;
          this.$http.delete("/basic/prodtype/"+s_item.value).then(function (resp) {
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
        if(s_item){
          //console.log(s_item);
          this.showModal(null,s_item.prodTypeId);
        }
      },editTreeSelected(){

        let that = this;

        let sns = this.$refs.tree.getSelectedNodes();
        let s_item = this.category[0];
        if(sns && sns.length > 0){
          s_item = sns[0];
        }
        //console.log(sns)
        //console.log(s_item.parentId)
        if(s_item){
          this.showModal(s_item,s_item.parentId);
        }
      },
      modalCancel(){

      },
      modalOk(){
        let that = this;
        //console.log(this.editModal.item);
        this.editModal.requesting = false;
        this.editModal.item.parentId = null;
        if(this.editModal.item.productTypeValue && this.editModal.item.productTypeValue.length > 0){
          let plt = this.editModal.item.productTypeValue[this.editModal.item.productTypeValue.length-1];
          if(plt){
            this.editModal.item.parentId = plt;
          }
        }
        let params = [
          {type:'Empty',title:'产品类别名称',value:that.editModal.item.name},
          {type:'Name',title:'产品类别名称',value:that.editModal.item.name},
          {type:'Empty',title:'产品类别代码',value:that.editModal.item.prodTypeCode},
          {type:'No',title:'产品类别代码',value:that.editModal.item.prodTypeCode},
          {type:'Word600',title:'备注',value:that.editModal.item.remark},
        ]
        let state = true;
        for(let i in params){
          state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
            that.$Notice.warning({title:tips})//,duration: 0
          })
          if(!state){
            return;
            break;
          }
        }
        if(this.editModal.item.prodTypeId){
          that.$http.put("/basic/prodtype",that.editModal.item).then(function (resp) {
            that.refreshTypeTree(that.editModal.item);
            that.$Message.success("修改成功");
            that.editModal.show = false;
          });
        }else{
          that.$http.post("/basic/prodtype",that.editModal.item).then(function (resp) {
            that.refreshTypeTree(that.editModal.item.parentId);
            that.$Message.success("添加成功");
            that.editModal.show = false;
          });
        }

        //this.editModal = true;
      },
      loadProdTypeRender(label){
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
      },

      loadEditData(){
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
            delArr.push(this.$http.delete("/basic/product/"+ss[i].productId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success("删除成功！");
              // that.refreshSelectData();
              that.treeSelectChange();
            });
          }
        }
      },
      rank(){
        let that=this;
        if(that.index===1){
            that.defaultData()
        }else{
           that.arrangement.data=that.arrangement.data;
        }
        that.arrangement.data1=that.rankData;
        that.arrangement.state=true;
      },
      //默认排序
      ReplyOk(){
        this.defaultData()
      },
      //默认排序
      defaultData(){
        let that=this;
        that.index=1;
        that.dataList=that.rankData.concat();
        // that.dataList.splice(-10,11)
        that.arrangement.data=that.dataList;
      },
      //排序确定
      RankOk(){
        if(this.arrangement.data.length===0){
         this.$Notice.warning({
            title: '列表不能为空请重新选择',
            desc: ''
          });
          return;
        }
        let data=[{type: 'selection',align: 'center',width:40,minWidth:40,maxWidth:40}]
        let dataList=data.concat(this.arrangement.data)
        this.table.columns=dataList;
        this.index=2;
        this.arrangement.state=false;
      },
      // 默认数据显示
      RankNo(){
        this.arrangement.state=false;
      },
    }
  }

</script>
<style>
.list_ok .dataItem {
    display: inline-block;
    padding: 5px 10px;
}
.list_no .process-item{
  margin-left: 10px;
  cursor: pointer;
  margin-bottom: 15px;
  width: auto!important;
}
</style>
