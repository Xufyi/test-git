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
              <i-input class='lineheight34' v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('quality.sa')" slot="prepend" style="width: 120px;text-align: left">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
              <Button style="margin-right:8px;" type="primary" @click="table.selected='';refreshTypeTree();refreshData();">{{$t("quality.search")}}</Button>
              <Button type="ghost" @click="table.selected='';search.query='';search.fieldName='';refreshTypeTree();refreshData();pageChange(1);$refs.treeCategory.refreshTypeTree()">{{$t("quality.reset")}}</Button>
            </div>
          </div>

          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <Button style="margin-right:8px;" v-if="permsBtn.INSERT_INSPECTION_TYPE" type="ghost" icon="plus"  @click="showModal(null)">{{$t("quality.add")}}</Button>
              <Button style="margin-right:8px;" v-if="permsBtn.UPDATE_INSPECTION_TYPE" type="ghost" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t("quality.modify")}}</Button>
              <Poptip
                confirm
                :title="i18n.t('quality.dsi')"
                placement="bottom-start"
                :ok-text='i18n.t("quality.confirm")'
                :cancel-text='i18n.t("quality.cancel")'
                @on-ok="deleteTableSelected">
                <Button v-if="permsBtn.DELETE_INSPECTION_TYPE" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t("quality.delete")}}</Button>
              </Poptip>

            </div>
            <div class="iqis-page-tool-second" style="margin-right: 9px;">
              <!--<Button type="primary" icon="more">自定义列表</Button>-->
              <Button type="text"  icon="refresh" @click="search.dates=[];table.selected='';search.query='';search.fieldName='';refreshTypeTree();refreshData();pageChange(1)">{{$t("quality.refresh")}}</Button>
              <!--<Button type="ghost" icon="share">导出报表</Button>-->
            </div>
          </div>


          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
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
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
    <Modal
      :title="editModal.item.inspectionTypeId?i18n.t('quality.moii'):i18n.t('quality.aii')"
      v-model="editModal.show"
      :mask-closable="false"
      :width="600" >
      <Row type="flex" :gutter="40">
        <i-col span="12">{{$t("quality.inspection")}}</i-col>
        <i-col span="12">{{$t("quality.uom")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12"><Input :disabled="noPermsDis" :placeholder="i18n.t('quality.required')" v-model="editModal.item.name" style="width: 100%;"></Input>
        </i-col>
        <i-col span="12">
          <Select :disabled="noPermsDis" v-model="editModal.item.measUnitTypeId" filterable :placeholder="i18n.t('Unlimited')">
            <!-- <Option value="" >无</Option> -->
            <Option v-for="(item,index) in search.measUnitType" :value="item.measUnitTypeId" :key="index">{{ item.measUnitTypeName }}</Option>
          </Select>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="12">{{$t("quality.category")}}</i-col>
        <i-col span="12">{{$t("quality.iec")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" >
        <i-col span="12">
          <Cascader :disabled="noPermsDis"  :transfer="false" v-model="editModal.item.inspectionTypeValue" :data="category"
                    :render-format = "loadTypeRender"
                    change-on-select :clearable="false" style="width: 100%"></Cascader>
        </i-col>
        <i-col span="12">
          <Select :disabled="noPermsDis" v-model="editModal.item.chkDevTypeId" multiple filterable :placeholder="i18n.t('Unlimited')">
            <!-- <Option value="">无</Option> -->
            <Option v-for="(item,index) in search.chkDevType" :value="item.chkDevTypeId" :key="index">{{ item.chkDevTypeName }}</Option>
          </Select>
        </i-col>
      </Row>
      <!-- 单独设置抽样方案 -->
      <Row style="margin-top: 20px">
        <i-col span="12">
          <Checkbox v-model="editModal.item.useSamplingPlan" :true-value="1" :false-value="0">{{$t('product.SeparateSamplingPlan')}}</Checkbox>
        </i-col>
      </Row>
      <div v-show="editModal.item.useSamplingPlan==1">
        <Row type="flex" :gutter="40" style="margin-top: 20px">
          <i-col span="12">{{$t('product.samplingPlan')}}</i-col>
          <i-col span="12">{{$t('product.inspectionStandard')}}</i-col>
        </Row>
        <Row type="flex" :gutter="40" >
          <i-col span="12">
            <Select v-model="editModal.item.samplingPlanCode" filterable>
              <Option v-for="(item,index) in search.samplingPlans" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
          </i-col>
          <i-col span="12">
            <Select v-if="editModal.item.samplingPlanCode!='percent'" :disabled="editModal.item.samplingPlanCode=='full'" v-model="editModal.item.inspectionStandard" filterable>
              <Option v-for="(item,index) in search.samplingLevel" :value="item.value" :key="item.key">{{ item.label }}</Option>
            </Select>
            <Select v-if="editModal.item.samplingPlanCode=='percent'" v-model="editModal.item.inspectionStandard" filterable>
              <Option v-for="(item,index) in search.samplingLevel" :value="item" :key="item"></Option>
            </Select>
          </i-col>
        </Row>
        <Row type="flex" :gutter="40" style="margin-top: 20px">
          <i-col span="12">AQL</i-col>
          <!-- <i-col span="12">{{$t('product.major')}}</i-col> -->
        </Row>
        <Row type="flex" :gutter="40" >
          <i-col span="12">
            <Select  :disabled="editModal.item.samplingPlanCode=='full'||editModal.item.samplingPlanCode=='percent'" v-model="editModal.item.aql" filterable>
              <Option v-for="(item,index) in search.aql" :value="item" :key="index">{{ item }}</Option>
            </Select>
            
          </i-col>
          <!-- <i-col span="12">
            <Select :disabled="editModal.item.samplingPlanCode=='full'||editModal.item.samplingPlanCode=='percent'" v-model="editModal.item.majAql" filterable>
              <Option v-for="item in search.aql" :value="item" :key="item">{{ item }}</Option>
            </Select>
            
          </i-col> -->
        </Row>
        <!-- <Row type="flex" :gutter="40" style="margin-top: 20px">
          <i-col span="12">{{$t('product.minor')}}</i-col>
        </Row>
        <Row type="flex" :gutter="40" >
          <i-col span="12">
            <Select :disabled="editModal.item.samplingPlanCode=='full'||editModal.item.samplingPlanCode=='percent'" v-model="editModal.item.minAql" filterable>
              <Option v-for="item in search.aql" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </i-col>
        </Row> -->
      </div>

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
        data:[
        ],
        tableEditDis:true,
        editModal:{
          dataLoading:false,
          item:{
            inspectionTypeValue:[],name:"",remark:"",measUnitTypeId:'',chkDevTypeId:[],useSamplingPlan:0,samplingPlanCode:'',inspectionStandard:'',aql:''
          },
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
            className:'tablePadding',
              width:50,
              align: 'center',
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
            },
            {
              title: i18n.t("quality.inspection"),
              className:'tablePadding',
              minWidth:80,
              // width:120,
              ellipsis:true,
              key: 'name'
            },{
              title: i18n.t("quality.category"),
              className:'tablePadding',
              minWidth:80,
              // width:120,
              ellipsis:true,
              key: 'parentName'
            },{
              title: i18n.t("quality.uom"),
              className:'tablePadding',
              minWidth:80,
              // width:140,
              ellipsis:true,
              key: 'measUnitTypeName'
            },{
              title: i18n.t("quality.iec"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:150,
              // width:140,
              ellipsis:true,
              key: 'chkDevTypeName'
            },
            {
              title: i18n.t("quality.samplingPlan"),
              className:'tablePadding',
              minWidth:80,
              // width:120,
              ellipsis:true,
              key:"useSamplingPlan",
              render:(h,params) => {
                let that = this;
                let text ="";
                text = params.row.useSamplingPlan;
                if(text==1) {
                  return h("div","是")
                }
                else{
                  return h("div","否")
                }
              }
            },{
              title: i18n.t("quality.remarks"),
              className:'tablePadding',
              minWidth:80,
              // width:200,
              ellipsis:true,
              key: 'remark'
            }
            // ,{
            //   title: '备注',
            //   minWidth:100,
            //   width:500,
            //   key: 'remark'
            // }
          ]
        },
        search: {
          query: "",
          fieldName: "",
          typeTree:[],
          measUnitType:[],
          chkDevType:[],
          typeDataLoading:false,
          data: {
            searchTypes: [
              {
                label: i18n.t("quality.sa"),
                value: ""
              },{
                label: i18n.t("quality.inspection"),
                value: "name"
              },{
                label: i18n.t("quality.category"),
                value: "parentName"
              },{
                label: i18n.t("quality.uom"),
                value: "measUnitTypeName"
              },{
                label: i18n.t("quality.iec"),
                value: "chkDevTypeName"
              },{
                label: i18n.t("quality.remarks"),
                value: "remark"
              }
            ]
          },
          aql:[],
          samplingLevel:[],
          samplingPlans:[
            {
              value:"105E",
              label:i18n.t('product.105E')
            },{
              value:"Z1-4",
              label:i18n.t('product.Z1-4')
            },{
              value:"0D",
              label:i18n.t('product.0D')
            },{
              value:"GB/T2828.1-2012",
              label:i18n.t('product.GB')
            },
            {
              value:"full",
              label:i18n.t('product.fullSampling')
            },{
              value:"percent",
              label:i18n.t('product.percentSampling')
            }
          ],
          samplingValue:[]
        },
        permsCur:[
          "INSERT_INSPECTION_TYPE",
          "SELECT_INSPECTION_TYPE",
          "DELETE_INSPECTION_TYPE",
          "UPDATE_INSPECTION_TYPE",
        ],
        permsBtn:{
          "DELETE_INSPECTION_TYPE":false,
          "SELECT_INSPECTION_TYPE":false,
          "UPDATE_INSPECTION_TYPE":false,
          "INSERT_INSPECTION_TYPE":false,
        },
        noPermsDis:true,
        inspectionStandardFlag:false,


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
    watch:{
      "editModal.item.samplingPlanCode":function(){
        let that = this;
        if(that.editModal.item.samplingPlanCode){
          if(that.editModal.item.samplingPlanCode=='full'){
            that.search.samplingLevel=[]
            that.editModal.item.aql=''
          }else if(that.editModal.item.samplingPlanCode=='percent'){
            that.search.samplingLevel=that.search.samplingValue
            that.editModal.item.aql=''
          }else{
            if(that.inspectionStandardFlag){
              that.inspectionStandardFlag=false;
            }else{
              that.editModal.item.inspectionStandard=''
            }
            that.search.samplingLevel = that.$iqis.objects.samplingPlans
              [that.editModal.item.samplingPlanCode].level;
            that.search.aql = that.$iqis.objects.samplingPlans
              [that.editModal.item.samplingPlanCode].aql; 
          }
        }
      }
    },

    methods:{
      onPopUp(){
        let that = this;
        if((!that.editModal.item.inspectionTypeId&&that.permsBtn.INSERT_INSPECTION_TYPE)||(that.editModal.item.inspectionTypeId&&that.permsBtn.UPDATE_INSPECTION_TYPE)){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
      },
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
      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        this.refreshData();
        this.refreshSelectData();

      },
      pageChange(page){
        this.table.pager.current = page;
        this.refreshData();
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

        this.$http.get("/basic/inspectiontype",{params:params}).then(function (resp) {
          // that.data = resp.data;
          //当在添加检验项目的时候，选择测量单位类别和检验项目类别为无时，在列表中对应显示为无
          let dataList = [];
          dataList = resp.data;
          that.tableEditDis=true;
          // console.log(resp.data,6666666666666);
          that.data = []
          for(let i = 0; i < dataList.length; i++){
              if(dataList[i].chkDevTypeName == null){
                  dataList[i].chkDevTypeName = i18n.t("Unlimited")
              }
              if(dataList[i].measUnitTypeName == null){
                  dataList[i].measUnitTypeName = i18n.t("Unlimited")
              }
              that.data.push(dataList[i]);
              
              
          }
          // console.log(that.data,77777777777);

          

          
          that.table.loading = false;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
        })
        this.$http.get('/basic/perent').then((res)=>{
            this.search.samplingValue=res.data.samplingValue.split(',')
        })
      },
      refreshSelectData(obj){
        let that=this;
        let sns = obj||this.$refs.tree.getSelectedNodes();
        if(sns.length==0||sns[0].title==i18n.t("quality.inspection")){
          that.refreshData();

        }else {
          let params = {};

          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          that.tree.selected = true;
          let url = "/basic/inspectiontypelist/";
          that.$http.get(url + sns[0].inspectionTypeId, {params: params}).then((resp) => {

            that.data = resp.data;
            that.table.pager.total = resp.pagerInfo.total;
            // console.log(resp.pagerInfo.total,'监控翻页')
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
        let selectedRow = this.$refs.pageTable.getSelection();
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t("quality.cbm"),
            desc: ''
          });
          return;
        }
        if(selectedRow[0].chkDevTypeId){selectedRow[0].chkDevTypeId=selectedRow[0].chkDevTypeId.split(',')}
        // this.loadEditData();
        this.showModal(selectedRow[0]);
      },
      onDBClick(obj,index){
        // this.loadEditData();
        if(obj.chkDevTypeId){obj.chkDevTypeId=obj.chkDevTypeId.split(',')}
        this.showModal(obj);
      },
      showModal(d){
        let that = this;
        that.loadEditData();
        if(!d){
          let sns = that.$refs.tree.getSelectedNodes();
          let s_item = that.category[0];
          if(sns && sns.length > 0){
            s_item = sns[0];
          }
          let result = that.$iqis.utils.findPathInTree(that.category[0],[],s_item.inspectionTypeId,"inspectionTypeId");
          result = result || [];
          d = {inspectionTypeValue:[],name:"",remark:"",measUnitTypeId:'',chkDevTypeId:[],useSamplingPlan:0,samplingPlanCode:'',inspectionStandard:'',aql:''}
          d.inspectionTypeValue = result;
        }else{
          that.inspectionStandardFlag=true;
          if(d.chkDevTypeId){
            for(let i in d.chkDevTypeId){
              d.chkDevTypeId[i]=Number(d.chkDevTypeId[i])
            }
          }else{
            d.chkDevTypeId=[]

          }
          let result = that.$iqis.utils.findPathInTree(that.category[0],[],d.parentId,"inspectionTypeId");
          result = result || [];
          d.inspectionTypeValue = result;
        }
        that.editModal.item = d;
        console.log(that.editModal.item,'this.editModal.item-------')
        that.editModal.show = true;
        that.editModal.requesting = false;

        that.editModal.item.inspectionTypeId=d.inspectionTypeId;
        that.onPopUp();
        if(that.editModal.item.useSamplingPlan===0){
          that.editModal.item.samplingPlanCode=''
          that.editModal.item.inspectionStandard=''
          that.editModal.item.aql=''
        }
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
            that.$Message.success(i18n.t('quality.ds'));
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
            name : this.tree.newNodeName,
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
            name : this.tree.newNodeName,
            parentId : s_item.parentId
          };
          this.$http.put("/basic/inspectiontype",params).then(function (resp) {
            that.$Message.success(i18n.t("quality.ats"));
            that.tree.edit = false;
            that.refreshTypeTree(s_item.value);
          })
        }else{
          this.$Message.warn(i18n.t("quality.tnc"));
        }
        this.tree.newNodeName = "";
      },
      modalCancel(){

      },
      modalOk(){
        let that = this;
        this.editModal.requesting = false;
        this.editModal.item.parentId = null;
        if(this.editModal.item.inspectionTypeValue && this.editModal.item.inspectionTypeValue.length > 0){
          let plt = this.editModal.item.inspectionTypeValue[this.editModal.item.inspectionTypeValue.length-1];
          if(plt){
            this.editModal.item.parentId = plt;
          }
        }
        let params = [
          {type: 'Empty', title: i18n.t("quality.inspection"), value:that.editModal.item.name},
          {type: 'Name', title: i18n.t("quality.inspection"), value:that.editModal.item.name},
          {type: 'Word600', title: i18n.t("quality.remarks"), value:that.editModal.item.remark},
        ]
        if(that.editModal.item.useSamplingPlan===1){
          params.push(//所有抽样方案
            {type: 'Empty', title: i18n.t("product.samplingPlan"), value:that.editModal.item.samplingPlanCode},
          )
          if(that.editModal.item.samplingPlanCode!='full'){//除全检
            params.push(
              {type: 'Empty', title: i18n.t("product.inspectionStandard"), value:that.editModal.item.inspectionStandard},
            )
          }
          if(that.editModal.item.samplingPlanCode!='percent'&&that.editModal.item.samplingPlanCode!='full'){//除百分比和全检
            params.push(
              {type: 'Empty', title: 'AQL', value:that.editModal.item.aql},
            )
          }
        }
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
        let editModal = JSON.parse(JSON.stringify(this.editModal.item)) 
        console.log(this.editModal.item,'this.editModal.item')
        // if(this.editModal.item.chkDevTypeId instanceof Array == true) {
          editModal.chkDevTypeId=editModal.chkDevTypeId.join(',')
        // }
        // return;
        if(this.editModal.item.inspectionTypeId){
          that.$http.put("/basic/inspectiontype",editModal).then(function (resp) {
            that.table.selected='';
            that.search.query='';
            that.search.fieldName='';
            that.$Message.success(i18n.t("quality.ats"));
            that.editModal.show = false;
            //跳转到对应的树节点下
            that.refreshTypeTree(that.editModal.item.inspectionTypeId);
            let sns=[];
            let node={};
            node.title="";
            node.inspectionTypeId=that.editModal.item.inspectionTypeId;
            sns.push(node);
            that.refreshSelectData(sns);
          });
        }else{
          if(that.editModal.item.useSamplingPlan===0){
            that.editModal.item.samplingPlanCode=''
            that.editModal.item.inspectionStandard=''
            that.editModal.item.aql=''
          }
          // console.log(that.editModal.item,4533)
          that.$http.post("/basic/inspectiontype",editModal).then(function (resp) {
            that.table.selected='';
            that.search.query='';
            that.search.fieldName='';
            that.table.pager.current = 1;
            that.$Message.success(i18n.t("quality.as"));
            that.editModal.show = false;
            //跳转到对应的树节点下
            that.refreshTypeTree(resp.data.inspectionTypeId);
            let sns=[];
            let node={};
            node.title="";
            node.inspectionTypeId=resp.data.inspectionTypeId;
            sns.push(node);
            that.refreshSelectData(sns);
          });
        }

        //this.editModal = true;
      },
      loadTypeRender(label){
        //render-format
        if(!label || label.length == 0){
          return i18n.t("quality.inspection");
        }
        let result = label[label.length-1];
        if( (this.category.length > 0  && result == this.category[0].label)){
          return i18n.t("quality.inspection")
        }

        return result;
      },
      loadType(){
        this.search.typeDataLoading = false;
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
      },
      treeSelectChange(){
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
        this.editModal.dataLoading = false;

        let that = this
        let resp=that.$iqis.utils.syncget("/basic/measunittype",{params:{limit:99999999}})
        if(resp.data){
          that.search.measUnitType = resp.data;
          
          that.editModal.dataLoading = false;
          that.search.measUnitType.unshift({measUnitTypeId:'',measUnitTypeName:i18n.t("Unlimited")});
        }
        let resp2=that.$iqis.utils.syncget("/basic/chkdevtype",{params:{limit:99999999}})
        if(resp2.data){
          that.search.chkDevType = resp2.data;
          // that.search.chkDevType.unshift({chkDevTypeId:null,chkDevTypeName:i18n.t("quality.nothing")});
          that.editModal.dataLoading = false;
        }
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
            delArr.push(this.$http.delete("/basic/inspectiontype/"+ss[i].inspectionTypeId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('quality.ds'));
              that.table.selected='';
              that.refreshTypeTree();
              that.refreshSelectData();
               that.refreshData()
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
