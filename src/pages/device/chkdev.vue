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
                  :title="i18n.t('chkdev.nca')"
                  @on-popper-show="treeAddInit"
                  placement="bottom-start">
                  <Button v-if="permsBtn.INSERT_CHKDEV" type="ghost" :title="i18n.t('chkdev.aec')">{{$t('chkdev.aclass')}}</Button>
                  <div class="iqis-poptip-content" slot="content">
                    <i-input :autofocus="true" ref="addTxt" v-model="tree.newNodeName">
                      <Button slot="append" @click="addNewNode">{{$t('chkdev.confirm')}}</Button>
                    </i-input>
                  </div>
                </Poptip>
              </div>
              <div class="iqis-page-tool-second" style="padding: 12px 10px;">
                <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                  v-model="tree.edit"
                  :title="i18n.t('chkdev.pen')"
                  @on-popper-show="treeEditInit"  
                  placement="bottom-start">
                  <Button v-if="permsBtn.UPDATE_CHKDEV" type="ghost" :disabled="!tree.selected">{{$t('chkdev.modify')}}</Button>
                  <div class="iqis-poptip-content" slot="content">
                    <i-input ref="editTxt" v-on:focus.native="selectAll" v-model="tree.newNodeName">
                      <Button slot="append" @click="editNode">{{$t('chkdev.confirm')}}</Button>
                    </i-input>
                  </div>
                </Poptip>
                <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                  confirm
                  :title="i18n.t('chkdev.confirmDeleteType')"
                  placement="bottom-start"
                  @on-ok="deleteTreeNode">
                  <Button v-if="permsBtn.DELETE_CHKDEV" type="ghost" :disabled="!tree.selected">{{$t('chkdev.delete')}}</Button>
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
            <div class="iqis-page-search-bar-item" style="flex:0 0 210px; margin-right:8px;">
              <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('chkdev.dateFilter')" style="width: 200px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 100px;">
              <Select v-model="search.useState" style="width:90px" :placeholder="i18n.t('chkdev.useState')">
                <Option value="1">{{$t('chkdev.normal')}}</Option>
                <Option value="2">{{$t('chkdev.limitedUse')}}</Option>
                <Option value="3">{{$t('chkdev.notInService')}}</Option>
                <Option value="4">{{$t('chkdev.scrapped')}}</Option>
                <Option value="5">{{$t('chkdev.inMmaintenance')}}</Option>
                <Option value="6">{{$t('chkdev.waitRepair')}}</Option>
              </Select>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('chkdev.searchAll')" slot="prepend" style="width: 100px;text-align: left">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
              <Button style="margin-right:8px;" type="primary" @click="table.pager.current = 1;table.selected='';refreshTypeTree();refreshData();">{{$t('chkdev.search')}}</Button>
              <Button type="ghost" @click="reset">{{$t('chkdev.reset')}}</Button>
            </div>
          </div>

          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <Button v-if="permsBtn.INSERT_CHKDEV" type="ghost" icon="plus"  @click="addChkdev" :title="i18n.t('chkdev.addDevice')">{{$t('chkdev.add')}}</Button>
              <Button style="margin:0 8px;" v-if="permsBtn.UPDATE_CHKDEV" type="ghost" icon="edit" :disabled="tableEditDis" @click="editChkdev">{{$t('chkdev.modify')}}</Button>
              <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                confirm
                :title="i18n.t('chkdev.confirmDelete')"
                placement="bottom-start"
                @on-ok="deleteTableSelected">
                <Button v-if="permsBtn.DELETE_CHKDEV" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t('chkdev.delete')}}</Button>
              </Poptip>

            </div>
            <div class="iqis-page-tool-second">
              <!--<Button type="primary" icon="more">自定义列表</Button>-->
              <Button type="text"  icon="refresh" @click="reset">{{$t('chkdev.refreshData')}}</Button>
              <Dropdown style="margin-left: 8px"  v-if="permsBtn.IMPORT_CHKDEV">
                <Button type="ghost">{{$t('iqisUpload.importData')}}<Icon style="margin-left:10px;" type="arrow-down-b"></Icon></Button>
                <DropdownMenu slot="list">
                  <DropdownItem>
                    <Button type="text" @click="downloadTemplate()">{{$t('iqisUpload.downloadTheTemplate')}}</Button>
                  </DropdownItem>
                </DropdownMenu>
                <DropdownMenu slot="list">
                  <DropdownItem>
                    <Button type="text" @click="openUpload();uploadShow=true;beforeShow=true;beforeShow1=true;uploadFile=[]">{{$t('iqisUpload.importData')}}</Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown> 
              <!--<Button type="ghost" icon="share">导出报表</Button>-->
              <Dropdown style="margin-left: 10px">
                <Button type="ghost">{{$t("pqc.exportReport")}}<Icon style="margin-left:8px;" type="arrow-down-b"></Icon></Button>
                <DropdownMenu slot="list">
                  <DropdownItem>
                    <Button type="text" @click="exportStatement(1)">{{$t("pqc.pageData")}}</Button>
                  </DropdownItem>
                  <DropdownItem>
                    <Button type="text" @click="exportStatement(2)">{{$t("pqc.allTheData")}}</Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          <Modal v-model="uploadShow" :title="i18n.t('iqisUpload.importEquipmentLedger')" :mask-closable="false" :closable="false">
              <div v-if="!progressShow" style="font-size:14px;text-align:center">{{$t('chkdev.updating')}}</div>
              <div v-if="beforeShow" style="text-align:center">
                <Upload ref="upload" 
                        :action="uploadUrl" 
                        :max-size="15360"
                        :format="['xls']" 
                        :headers='{"x-access-token":$http.defaults.headers["x-access-token"]}'
                        :before-upload="beforeUpload"
                        :on-error="error"
                        :on-success="success"
                        :on-progress="hideBtn"
                        :on-exceeded-size="exceeded"
                        >
                        <Button  class="iqis-table-footer-btn" type="ghost">{{$t('iqisUpload.selectTheFile')}}</Button>
                  <!-- <Button icon="ios-cloud-upload-outline">选择文件</Button> -->
                </Upload>
              <Tag style="margin-top:10px;" v-if="uploadFile.name&&beforeShow&&progressShow" closable @on-close="uploadFile=[]">{{uploadFile.name}}</Tag>
              </div>
              <div v-if="!beforeShow">{{$t('fileCenter.uploadSuccess')}}！<br/>{{dataFromBase}}</div>
            <div slot="footer">
              <Button type="primary" size="large" v-if="uploadFile.name&&beforeShow2" v-on:click="shangchuan"  @click="$refs.upload.post(uploadFile)">{{$t('fileCenter.upload')}}</Button>
              <Button v-if="beforeShow1" type="text"  size="large" @click="uploadShow=false">{{$t('message.ce')}}</Button>
              <Button v-if="otherBeforeShow" type="primary" size="large" v-on:click="sure" @click="uploadShow=false;reset()">{{$t('message.cm')}}</Button>
            </div>
          </Modal>


          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick"  v-drag-table-column="table.columns" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data" :loading="table.loading"></Table>
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

</template>
<script>
  import Input from "iview/src/components/input";
  import ICol from "iview/src/components/grid/col";
  import $ from "jquery";
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
        chkDevTypeId:"",
        snsData:null,
        tableEditDis:true,
        uploadUrl:process.env.API_HOST+'/basic/chkdev/batch/import',
        uploadShow:false,
        uploadFile:[],
        beforeShow:true,
        progressShow:true,
        beforeShow1:true,
        beforeShow2:true,
        otherBeforeShow:false,
        data:[
        ],
        i18n:window.i18n,
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
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
              title: i18n.t('chkdev.createTime'),
              className:'tablePadding',
              minWidth:106,
              width:106,
              ellipsis:true,
              key: 'createTime',
              render:function(h,data){
                let value = data.row.createTime;
                let str = "-"
                if(value){
                  var unixTimestamp = new Date(value);
                  str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                }

                return h("span",str);
              }
            },{
              title: i18n.t('chkdev.deviceCode'),
              className:'tablePadding',
              minWidth:80,
              width:100,
              ellipsis:true,
              key: 'no'
            },{
              title: i18n.t('chkdev.deviceName'),
              className:'tablePadding',
              minWidth:80,
              width:100,
              ellipsis:true,
              key: 'name'
            },{
              title: i18n.t('chkdev.spec'),
              className:'tablePadding',
              minWidth:80,
              width:100,
              ellipsis:true,
              key: 'spec'
            },{
              title: i18n.t('chkdev.deviceParameters'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:120,
              width:this.$store.state.locale=='zh_CN'?100:120,
              ellipsis:true,
              key: 'param'
            },{
              title: i18n.t('chkdev.chkca'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:130,
              width:this.$store.state.locale=='zh_CN'?100:130,
              ellipsis:true,
              key: 'chkDevTypeName'
            },{
              title:i18n.t('chkdev.caliState'),
              className:'tablePadding',
              minWidth:80,
              width:100,
              ellipsis:true,
              key: "calibrationState",
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{
                "QUALIFIED":"<span style='color:green'>"+i18n.t('chkdev.qualified')+"</span>",
                "CALIBRATED":"<span style='color:orange'>"+i18n.t('chkdev.calibrated')+"</span>",
                "OVERDUE":"<span style='color:red'>"+i18n.t('chkdev.overdue')+"</span>",
                "PAUSE":"<span style='color:orange'>"+i18n.t('chkdev.notInService')+"</span>",
                "LIMIT":"<span style='color:orange'>"+i18n.t('chkdev.limitedUse')+"</span>",
                "STOP":"<span style='color:red'>"+i18n.t('chkdev.stop')+"</span>"
              })

            },{
              title: i18n.t('chkdev.maintState'),
              className:'tablePadding',
              minWidth:80,
              width:100,
              ellipsis:true,
              key: 'maintainState',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{
                "NORMAL":"<span style='color:green'>"+i18n.t('chkdev.normal')+"</span>",
                "MAINTAINED":"<span style='color:orange'>"+i18n.t('chkdev.mainttained')+"</span>",
                "OVERDUE":"<span style='color:red'>"+i18n.t('chkdev.overdue')+"</span>",
                "REPAIR":"<span style='color:orange'>"+i18n.t('chkdev.repair')+"</span>",
                })
            },{
              title: i18n.t('chkdev.useState'),
              className:'tablePadding',
              minWidth:80,
              width:100,
              ellipsis:true,
              key: 'useState',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{
                1:"<span style='color:green'>"+i18n.t('chkdev.normal')+"</span>",
                2:"<span style='color:orange'>"+i18n.t('chkdev.limitedUse')+"</span>",
                3:"<span style='color:orange'>"+i18n.t('chkdev.notInService')+"</span>",
                4:"<span style='color:red'>"+i18n.t('chkdev.scrapped')+"</span>",
                5:"<span style='color:orange'>"+i18n.t('chkdev.inMmaintenance')+"</span>",
                6:"<span style='color:orange'>"+i18n.t('chkdev.waitRepair')+"</span>",
                7:"<span style='color:red'>"+i18n.t('chkdev.stop')+"</span>",
              })
            },{
              title: i18n.t('chkdev.department'),
              className:'tablePadding',
              minWidth:80,
              width:100,
              ellipsis:true,
              key: 'departmentName'
            },{
              title: i18n.t('chkdev.custodian'),
              className:'tablePadding',
              minWidth:80,
              width:100,
              ellipsis:true,
              key: 'keeperUserName'
            },{
              title: i18n.t('chkdev.label'),
              className:'tablePadding',
              minWidth:80,
              width:100,
              ellipsis:true,
              key: 'factoryCard'
            },{
              title: i18n.t('chkdev.serialNumber'),
              className:'tablePadding',
              minWidth:80,
              width:100,
              ellipsis:true,
              key: 'factoryNumber'
            },{
              title: i18n.t('chkdev.remarks'),
              className:'tablePadding',
              minWidth:80,
              width:150,
              ellipsis:true,
              key: 'remark'
            }
          ]
        },
        search: {
          unitList:[
            {label:"H/亨",value:'H'},
            {label:"mH/豪亨",value:'mH'},
            {label:"uH/微亨",value:'uH'}
          ],
          query: "",
          fieldName: "",
          dates:[],
          typeTree:[],
          userList:[],
          departmentList:[],
          useState:"",
          typeDataLoading:false,
          data: {
            searchTypes: [
              {
                label: i18n.t('chkdev.searchAll'),
                value: ""
              },{
                label: i18n.t('chkdev.deviceCode'),
                value: "no"
              },{
                label: i18n.t('chkdev.deviceName'),
                value: "name"
              },{
                label: i18n.t('chkdev.spec'),
                value: "spec"
              },{
                label: i18n.t('chkdev.deviceParameters'),
                value: "param"
              },{
                label: i18n.t('chkdev.chkca'),
                value: "chkDevTypeName"
              },{
                label: i18n.t('chkdev.caliState'),
                value: "calibrationState"
              },{
                label: i18n.t('chkdev.maintState'),
                value: "maintainState"
              },{
                label: i18n.t('chkdev.department'),
                value: "departmentName"
              },{
                label: i18n.t('chkdev.custodian'),
                value: "keeperUserName"
              },{
                label: i18n.t('chkdev.label'),
                value: "factoryCard"
              },{
                label: i18n.t('chkdev.serialNumber'),
                value: "factoryNumber"
              },{
                label: i18n.t('chkdev.remarks'),
                value: "remark"
              }
            ]
          }
        },
        permsCur:[
          "INSERT_CHKDEV",
          "SELECT_CHKDEV",
          "DELETE_CHKDEV",
          "UPDATE_CHKDEV",
          "IMPORT_CHKDEV"
        ],
        permsBtn:{
          "DELETE_CHKDEV":false,
          "SELECT_CHKDEV":false,
          "UPDATE_CHKDEV":false,
          "INSERT_CHKDEV":false,
          "IMPORT_CHKDEV":false,
        },
        noPermsDis:true,
      }
    },//end data

    created(){
      let permsAll = this.$store.state.permissions;
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" :alt="i18n.t(\'chkdev.noData\')"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
      this.refreshTypeTree();
      this.refreshData();
    },
    computed:{
      treeData(){//需传输到树组件的数据
        let treeData={
          treeTitle:"分类",//树的根目录名称
          typeId:"chkDevTypeId",//类别id字段
          typeName:"chkDevTypeName",//类名名称
          treeListUrl:"/basic/chkdevtype",//树的数据接口名称
          addTreeUrl:"/basic/chkdevtype",//增加树元素的接口名称
          editTreeUrl:"/basic/chkdevtype",//修改树元素的接口名称
          deleteTreeUrl:"/basic/chkdevtype/",//删除树元素的接口名称
          chooseNodeUrl:"/basic/chkdevlist/",//选择树元素查找对应列表的接口名称
          pager:{
            current:this.table.pager.current,
            limit:this.table.pager.limit
          },
        }
        return treeData
      },
      treeStyle(){
        return {
          // "height":(9*40+159)+"px"//(Math.max(this.table.pager.rows,10)*40+144)+"px"
          "height":550+"px"//(Math.max(this.table.pager.rows,10)*40+144)+"px"
        };
      }
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
      addChkdev(){
        let sns = null
        if(this.snsData && this.snsData.length > 0){
          sns = this.snsData
        }
        let id = sns&&sns.length>0?sns[0].chkDevTypeId:''
        this.$emit("open-tab","device-manage-chkdev-add",i18n.t('chkdev.addDevice'),"page-device-manage-chkdev-add",{chkDevTypeId:id});
      },
      editChkdev(){
        let selectedRow = this.$refs.pageTable.getSelection()     
        this.$emit("open-tab","device-manage-chkdev-add-"+selectedRow[0].chkDevId,i18n.t('chkdev.modifyDevice')+"-"+selectedRow[0].name,"page-device-manage-chkdev-add",{chkDevId:selectedRow[0].chkDevId});
      },
      onDBClick(obj,index){
        this.$emit("open-tab","device-manage-chkdev-add-"+obj.chkDevId,i18n.t('chkdev.modifyDevice')+"-"+obj.name,"page-device-manage-chkdev-add",{chkDevId:obj.chkDevId});
      },
      reset(){
        this.table.pager.current = 1;
        this.search.dates=[];
        this.search.useState='';
        this.search.query='';
        this.search.fieldName='';
        this.table.selected='';
        // this.refreshTypeTree();
        this.refreshData();
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
        this.table.loading = true;
        let that = this;

        let params = {};

        if(this.search.dates && this.search.dates[0]){
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];

          params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          params.endDate = this.$iqis.utils.getDayEnd(edate);
        }

        params.useState = this.search.useState;
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;

        this.$http.get("/basic/chkdev",{params:params}).then(function (resp) {
          that.table.loading = false;
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
        })
        // that.initUserList();
      },
      refreshSelectData(obj){
        this.table.loading=true;
        let that=this;
        let sns = obj||that.snsData;
        if(sns.length==0||sns[0].title==i18n.t('chkdev.chkca')){
          that.refreshData();
        }else {
          let params = {};

          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          that.tree.selected = true;
          let url = "/basic/chkdevlist/";
          that.$http.get(url + sns[0].chkDevTypeId, {params: params}).then((resp) => {
            that.table.loading = false;
            that.data = resp.data;
            that.table.pager.total = resp.pagerInfo.total;
            let rowCount = resp.data ? resp.data.length : 10;
            that.table.pager.rows = Math.max(rowCount, 6);
          });
        }
      },
      exportStatement(index) {
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        // let query='';
        // let chkDevTypeId=""
        if(index == 1){
          url='/basic/chkDev/export/list';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          params.chkDevTypeId = this.chkDevTypeId
          params.useState = this.search.useState
          params.fieldName = this.search.fieldName
          params.query = this.search.query;
          // let query = this.search.query;
          // let useState = this.search.useState
          // let fieldName = this.search.fieldName;
          // // let treatmentMethod = this.search.treatmentMethod;
          // let chkDevTypeId = this.chkDevTypeId;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];

            let startDate = this.$iqis.utils.getDayStart(1,sdate);
            let endDate = this.$iqis.utils.getDayEnd(edate);
            params.startDate = startDate
            params.endDate = endDate
            // params.query="startDate%3D"+startDate+"%26endDate%3D"+endDate+"%26field%3D"+fieldName+"%26keyword%3D"+query+"%26treatmentMethod%3D"+treatmentMethod+"%26chkDevTypeId%3D"+chkDevTypeId;
            // params.query="startDate%3D"+startDate+"%26endDate%3D"+endDate+"%26useState%3D"+useState+"%26field%3D"+fieldName+"%26keyword%3D"+query+"%26chkDevTypeId%3D"+chkDevTypeId
          }else {
            // params.query="field="+fieldName+"%26keyword%3D"+query+"%26treatmentMethod%3D"+treatmentMethod+"%26chkDevTypeId%3D"+chkDevTypeId;
            // params.query='useState%3D'+useState+'%26field%3D'+fieldName+"%26keyword%3D"+query+"%26chkDevTypeId%3D"+chkDevTypeId
          }
        }
        if(index == 2){
          url='/basic/chkDev/export/list';
          params.page = 1;
          params.limit = this.table.pager.total;
          params.chkDevTypeId = this.chkDevTypeId
          params.useState = this.search.useState
          params.fieldName = this.search.fieldName
          params.query = this.search.query;
          // let query = this.search.query;
          // let useState = this.search.useState
          // let fieldName = this.search.fieldName;
          // let chkDevTypeId = this.chkDevTypeId;
          // let treatmentMethod = this.search.treatmentMethod;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];

            let startDate = this.$iqis.utils.getDayStart(1,sdate);
            let endDate = this.$iqis.utils.getDayEnd(edate);
            params.startDate = startDate
            params.endDate = endDate
            // params.query="startDate%3D"+startDate+"%26endDate%3D"+endDate+"%26field%3D"+fieldName+"%26keyword%3D"+query+"%26treatmentMethod%3D"+treatmentMethod;
            //  params.query="startDate%3D"+startDate+"%26endDate%3D"+endDate+"%26useState%3D"+useState+"%26field%3D"+fieldName+"%26keyword%3D"+query
          }else {
            // params.query="field="+fieldName+"%26keyword%3D"+query+"%26treatmentMethod%3D"+treatmentMethod;
            // params.query='useState%3D'+useState+'%26field%3D'+fieldName+"%26keyword%3D"+query+"%26chkDevTypeId%3D"+chkDevTypeId
            // params.query='useState%3D'+useState+'%26field%3D'+fieldName+"%26keyword%3D"+query
          }
        }

        this.$iqis.download(url,params,methods,()=>{}) //下载文件
      },
      refreshTypeTree(selectValue){
        let that = this;
        that.tree.selected = false;
        this.$http.get("/basic/chkdevtype",{params:{limit:99999999}}).then(function(resp){
          let root = {title:i18n.t('chkdev.chkca'),selected: false,label:i18n.t('chkdev.chkca'),value:0,expand:true};

          if(!selectValue){
            //console.log("set root select:"+selectValue);
            root.selected = true;
          }

          if(resp.data){

            if(selectValue){
              for(let i =0;i<resp.data.length;i++){
                //console.log("set node select:"+selectValue);
                resp.data[i].selected = resp.data[i].chkDevTypeId == selectValue;
                that.tree.selected = true;
              }
            }

            that.$iqis.utils.treeify(resp.data,root,"chkDevTypeId","chkDevTypeName","parentId");
          }
          //console.log(root);
          that.category = [root];
        });

      },
      deleteTreeNode(){
        let sns = that.snsData;
        let s_item = null;
        if(sns && sns.length > 0){
          s_item = sns[0];
        }

        if(s_item){
          let that = this;
          this.$http.delete("/basic/chkdevtype/"+s_item.value).then(function (resp) {
            that.$Message.success(i18n.t('chkdev.deleteSuccess'));
            that.refreshTypeTree(null);
          });
        }

      },
      addNewNode(){
        let that = this;
        let params = [
          {type:'Empty',title:i18n.t('chkdev.nameDeviceCategory'),value:that.tree.newNodeName},
          {type:'Name',title:i18n.t('chkdev.nameDeviceCategory'),value:that.tree.newNodeName},
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
        if(this.tree.newNodeName){
          let sns = that.snsData;
          let s_item = this.category[0];
          if(sns && sns.length > 0){
            s_item = sns[0];
          }
          let params = {
            chkDevTypeName : this.tree.newNodeName,
            parentId : s_item.value
          };
          this.$http.post("/basic/chkdevtype",params).then(function (resp) {
            that.$Message.success(i18n.t('chkdev.sas'));
            that.tree.add = false;
            that.refreshTypeTree(s_item.value);
          })
        }
        this.tree.newNodeName = "";
      },editNode(){

        let that = this;
        let params = [
          {type:'Empty',title:i18n.t('chkdev.nameDeviceCategory'),value:that.tree.newNodeName},
          {type:'Name',title:i18n.t('chkdev.nameDeviceCategory'),value:that.tree.newNodeName},
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
        if(this.tree.newNodeName){
          let sns = that.snsData;
          let s_item = this.category[0];
          if(sns && sns.length > 0){
            s_item = sns[0];
          }

          //console.log(this.tree.newNodeName);
          //console.log(s_item);
          let params = {
            chkDevTypeId:s_item.chkDevTypeId,
            chkDevTypeName : this.tree.newNodeName,
            parentId : s_item.parentId
          };
          this.$http.put("/basic/chkdevtype",params).then(function (resp) {
            that.$Message.success(i18n.t('chkdev.editSuccess'));
            that.tree.edit = false;
            that.refreshTypeTree(s_item.value);
          })
        }else{
          this.$Message.warn(i18n.t('chkdev.nce'));
        }
        this.tree.newNodeName = "";
      },
      modalCancel(){

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
        this.search.chkDevTypeList = [];
        this.$http.get("/basic/chkdevtype",{params:{limit:99999999}}).then(function (resp) {
          that.search.chkDevTypeList = resp.data;
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
      treeSelectChange(a){
        let that=this;
        that.table.selected='';
        this.chkDevTypeId=a[0].chkDevTypeId
        let sns = that.snsData;
        if(sns.length==0||sns[0].title==i18n.t('chkdev.chkca')){
          that.tree.selected='';
          that.refreshData();
        }else
        {
          that.refreshSelectData();
        }
      },
      loadEditData(){
        this.editModal.dataLoading = false;
        let that = this
        this.$http.get("/systemManage/department",{params:{limit:99999999}}).then(function (resp) {
          if(resp.data){
            that.search.departmentList = resp.data;
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
            delArr.push(this.$http.delete("/basic/chkdev/"+ss[i].chkDevId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('chkdev.deleteSuccess'));
              that.table.selected='';
              that.refreshSelectData();
            });
          }
        }
      },
      downloadTemplate () {
        let url = "/basic/chkdev/export/template"
        this.$iqis.download(url,()=>{})
      },
      error(error,file) {
        this.$Notice.error({
          title: i18n.t('tips')+':',
          desc:file.message
        })
        this.beforeShow=true
        this.beforeShow1=true
        this.beforeShow2=true
        this.uploadFile=[]
        this.progressShow=true;
        $('.ivu-upload .iqis-table-footer-btn').show()

      },
      success(response) {
        this.beforeShow=false;
        this.beforeShow1=false;
        this.otherBeforeShow=true;
        this.dataFromBase = response.data
        this.progressShow=true;
    
      },
      hideBtn(){
        this.progressShow=false;
        $('.ivu-upload .iqis-table-footer-btn').hide()
      },
      openUpload(){
        this.uploadShow=true;
        this.beforeShow=true;
        this.beforeShow1=true;
        this.uploadFile=[]
        this.progressShow=true;
        $('.ivu-upload .iqis-table-footer-btn').show()
      },

  
     beforeUpload(file){
      let fileArr = file.name.split('.')
      if(file.name.split('.')[fileArr.length-1] != 'xls'){
        this.$Notice.warning({title:i18n.t('iqisUpload.format')})
        return;
      }
      this.uploadFile=file;
      return false;
     },
     shangchuan() {
       this.beforeShow1=false
       this.beforeShow2=false
     },
     sure() {
       this.otherBeforeShow=false
       this.beforeShow2=true
     },
     exceeded() {
       this.$Notice.warning({
          title: i18n.t('tips')+':',
          desc: i18n.t('iqisUpload.maxfile')
       });
       this.beforeShow=true
       this.beforeShow1=true
       this.beforeShow2=true
       this.uploadFile=[]
     }
    }
  }

</script>
<style>
  .ivu-progress-success .ivu-progress-bg {
    background-color:rgb(65, 143, 238)!important;
  }
  .ivu-progress-success .ivu-progress-text {
      color: rgb(65, 143, 238)!important;
  }
  .ivu-input-number-input {
    height: 32px;
    line-height: 32px;
  }
  .ivu-input-number-input-wrap {
      height: 32px;
  }
  .ivu-input-number {
      height: 32px;
      line-height: 32px;
  }
</style>
