<template>
  <div class="iqis-page">

    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <!-- <div class="iqis-bus-tree treeCustom" style="display: -webkit-flex;display: flex;flex-direction: column;flex: 0 0 185px;font-size: 14px;overflow: auto; border: 1px solid #e9eaec;margin-right: 16px;margin-top:11px;padding-left: 10px;" :style="treeStyle">
          <div class="iqis-page-tool-row iqis-tree-tool" style="flex: 0 0 47px;" >
            <div style="display: -webkit-flex;display: flex;justify-content:space-between;width: 100%;">
              <div class="iqis-page-tool-primary" style="padding: 12px 6px;">
                <Button v-if="permsBtn.INSERT_DEPARTMENT" type="ghost" @click="addSubNode" :title="i18n.t('system.addDepartment')">{{$t('system.addType')}}</Button>
              </div>
              <div class="iqis-page-tool-second" style="padding: 12px 10px;">
                <Button v-if="permsBtn.UPDATE_DEPARTMENT" type="ghost":disabled="!tree.selected" @click="editTreeSelected" >{{$t('system.edit')}}</Button>
                <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                  confirm
                  :title="i18n.t('system.confirmDeleteType')"
                  placement="bottom-start"
                  @on-ok="deleteTreeNode">
                  <Button v-if="permsBtn.DELETE_DEPARTMENT" type="ghost" :disabled="!tree.selected">{{$t('system.delete')}}</Button>
                </Poptip>

              </div>

            </div>
          </div>
          <div style="flex: 1 1 100px;overflow: auto;">
            <Tree ref="tree" :data="category" :multiple="false" @on-select-change="pageChange(1)" ></Tree>
          </div>
        </div> -->
        <TreeCategory ref="treeCategory" :treeData="treeData" v-on:changeTreeNode="changeTreeNode"></TreeCategory><!--树组件引用-->
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow-y: auto;">

          <div class="iqis-page-search-row" style="">
            <div class="iqis-page-search-bar-item" style="flex:0 0 210px; margin-right:8px;">
              <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('system.dateFilter')" style="width: 200px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('system.searchAll')" slot="prepend" style="width: 90px;text-align: left">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px;">
              <Button style="margin-right:8px;" type="primary" @click="table.pager.current = 1;table.selected='';refreshTypeTree();refreshData();">{{$t('system.search')}}</Button>
              <Button type="ghost" @click="table.pager.current = 1;search.dates=[];table.selected='';search.query='';search.fieldName='';refreshData();$refs.treeCategory.refreshTypeTree()">{{$t('system.reset')}}</Button>
            </div>
          </div>

          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <Button v-if="permsBtn.INSERT_USER" type="ghost" icon="plus"  @click="showModal(null)" :title="i18n.t('system.addEmployees')">{{$t('system.add')}}</Button>
              <Button style="margin:0 8px;" v-if="permsBtn.UPDATE_USER" type="ghost" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t('system.edit')}}</Button>
              <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                confirm
                :title="i18n.t('system.confirmDelete')"
                placement="bottom-start"
                @on-ok="deleteTableSelected">
                <Button v-if="permsBtn.DELETE_USER" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t('system.delete')}}</Button>
              </Poptip>
              <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                confirm
                :title="i18n.t('system.sureWantResetPwd')"
                placement="bottom-start"
                @on-ok="resetKey">
                <Button style="margin-left:8px;" v-if="permsBtn.RESET_KEY_USER" type="ghost" icon="refresh" :disabled="!table.selected">{{$t('system.ResetPassword')}}</Button>
              </Poptip>
            </div>
            <div class="iqis-page-tool-second">
              <!--<Button type="primary" icon="more">自定义列表</Button>-->
              <Button type="text"  icon="refresh" @click="table.pager.current = 1;search.dates=[];table.selected='';search.query='';search.fieldName='';refreshTypeTree();refreshData();">{{$t('system.refreshData')}}</Button>
              <!--<Button type="ghost" icon="share">导出报表</Button>-->
            </div>
          </div>
          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data" :loading="table.loading"></Table>
          <div style="padding: 20px 0 20px 0px;">
            <Page v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                  :page-size-opts="[10,20,50,100]"
                  @on-change="pageChange" @on-page-size-change="pageSizeChange"
                  size="small" show-total show-elevator show-sizer></Page>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
    <Modal
      :title="editModal.item.userId?i18n.t('system.editUser'):i18n.t('system.addUser')"
      v-model="editModal.show"
      :mask-closable="false"
      :width="600" >
      <Row type="flex" :gutter="40">
        <i-col span="12">{{$t('system.EmployeeAccount')}} <span style="color:rgb(187, 190, 196)">(初始密码: 123456)</span></i-col>
        <i-col span="12">{{$t('system.employeeName')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12"><Input :disabled="adminDisabled||noPermsDis" :placeholder="i18n.t('system.required')" v-model="editModal.item.account" style="width: 100%;"></Input>
        </i-col>
        <i-col span="12"><Input :disabled="adminDisabled||noPermsDis" :placeholder="i18n.t('system.required')" v-model="editModal.item.name" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="12">{{$t('system.department')}}</i-col>
        <i-col span="12">{{$t('system.subordinateRole')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" >
        <i-col span="12">
          <Cascader :disabled="adminDisabled||noPermsDis"  :transfer="false" v-model="editModal.item.departmentValue" :data="category[0].children"
                    :render-format = "loadDepartmentRender"
                    change-on-select :clearable="false" style="width: 100%"></Cascader>
        </i-col>
        <i-col span="12" :gutter="40">
          <Select :disabled="adminDisabled||noPermsDis" v-if="!adminDisabled" v-model="editModal.item.jobId" filterable :placeholder="i18n.t('system.pleaseSelect')">
            <Option v-for="item in search.jobList" :value="item.jobId" :key="item.jobId">{{ item.jobName }}</Option>
          </Select>
          <Input v-if="adminDisabled" disabled :value="i18n.t('system.administrators')" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="12">{{$t('system.contactInformation')}}</i-col>
        <i-col span="12">{{$t('system.emailAddress')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12"><Input :disabled="noPermsDis" v-model="editModal.item.phoneNum" style="width: 100%;"></Input>
        </i-col>
        <i-col span="12"><Input :disabled="noPermsDis" v-model="editModal.item.email" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="12">代理人</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12">
          <Select placeholder="请选择" v-model="editModal.item.positionAgentId" :disabled="noPermsDis" filterable>
            <Option v-for="item in userData" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
          </Select>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">{{$t('system.remarks')}}
        </i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="24"><Input :disabled="noPermsDis" :placeholder="i18n.t('system.pird')" v-model="editModal.item.remark" type="textarea" :rows="4" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <div slot="footer">
        <Button v-if="!noPermsDis" type="primary" size="large" @click="modalOk" :loading="editModal.requesting">{{$t('system.confirm')}}</Button>
        <Button type="text" size="large" @click="editModal.show=false">{{$t('system.cancel')}}</Button>
      </div>
      <Spin v-if="editModal.dataLoading" fix size="large"></Spin>
    </Modal>
    <Modal
    :title="editDepartmentModal.item.departmentId?i18n.t('system.editDepartment'):i18n.t('system.addDepartment')"
    v-model="editDepartmentModal.show"
    :mask-closable="false"
    :width="600" >
    <Row type="flex" :gutter="40">
    <i-col span="12">{{$t('system.departmentNumber')}}</i-col>
    <i-col span="12">{{$t('system.departmentName')}}</i-col>
    </Row>
    <Row type="flex" :gutter="40">
    <i-col span="12">
    <i-input :placeholder="i18n.t('system.required')" v-model="editDepartmentModal.item.departmentNum" style="width: 100%;"></i-input>
    </i-col>
    <i-col span="12">
    <i-input :placeholder="i18n.t('system.required')" v-model="editDepartmentModal.item.departmentName" style="width: 100%;"></i-input>
    </i-col>
    </Row>
    <Row type="flex" :gutter="40" style="margin-top: 20px">
    <i-col span="12">{{$t('system.subDepartNumber')}}</i-col>
    </Row>
    <Row type="flex" :gutter="40" >
      <i-col span="12">
        <Cascader :transfer="false"  v-model="editDepartmentModal.item.departmentValue" :data="category"
                  :render-format = "loadDepartmentRender"
                  change-on-select :clearable="false" style="width: 100%"></Cascader>
      </i-col>
    </Row>
    <Row type="flex" :gutter="40" style="margin-top: 20px">
    <i-col span="24">{{$t('system.remarks')}}
    </i-col>
    </Row>
    <Row type="flex" :gutter="40">
    <i-col span="24"><Input :placeholder="i18n.t('system.pird')" v-model="editDepartmentModal.item.remark" type="textarea" :rows="4" style="width: 100%;"></Input>
    </i-col>
    </Row>
    <div slot="footer">
    <Button type="primary" size="large" @click="departmentModalOk" :loading="editDepartmentModal.requesting">{{$t('system.confirm')}}</Button>
    <Button type="text" size="large" @click="editDepartmentModal.show=false">{{$t('system.cancel')}}</Button>
    </div>
    <Spin v-if="editDepartmentModal.dataLoading" fix size="large"></Spin>
    </Modal>
  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import ICol from "iview/src/components/grid/col";
  import TreeCategory from '../../components/treeCategory/TreeCategory'
  export default {
    components: {
      ICol,
      Input,
      TreeCategory
    },
    data(){
      let vm = this;
      return {
        snsData:null,
        data:[
        ],
        userData:[],
        i18n:window.i18n,
        adminDisabled:false,
        tableEditDis:true,
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        editModal:{
          dataLoading:true,
          item:{},
          show:false,
          requesting:false
        },
        editDepartmentModal:{
          dataLoading:false,
          item:{},
          show:false,
          requesting:false
        },

        category:[{
          title: i18n.t('system.organizationTree'),
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
                maxWidth: 40,
                minWidth: 40,
                width: 40,
                align: 'center'
            },{title: i18n.t('system.no'),
            className:'tablePadding',
              // width:80,
              align: 'center',
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              minWidth:60,
              width:60,
              maxWidth:60
            },{
              title: i18n.t('system.createTime'),
              className:'tablePadding',
              align: 'center',
              width:136,
              minWidth:136,
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
              title: i18n.t('system.EmployeeAccount'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:130,
              maxWidth:150,
              width:150,
              ellipsis:true,
              key: 'account'
            },{
              title: i18n.t('system.employeeName'),
              className:'tablePadding',
              minWidth:80,
              width:150,
              ellipsis:true,
              key: 'name'
            },{
              title: i18n.t('system.department'),
              className:'tablePadding',
              minWidth:80,
              width:150,
              ellipsis:true,
              key: 'departmentName'
            },{
              title: i18n.t('system.subordinateRole'),
              className:'tablePadding',
              minWidth:80,
              width:150,
              ellipsis:true,
              key: 'jobName'
            },{
              title: i18n.t('system.remarks'),
              className:'tablePadding',
              minWidth:80,
              width:350,
              maxWidth:750,
              ellipsis:true,
              key: 'remark'
            }
          ]
        },
        search: {
          query: "",
          fieldName: "",
          dates: [],
          departmentTree:[],
          jobList:[],
          data: {
            searchTypes: [
              {
                label: i18n.t('system.searchAll'),
                value: ""
              },{
                label: i18n.t('system.EmployeeAccount'),
                value: "account"
              },{
                label: i18n.t('system.employeeName'),
                value: "name"
              },{
                label: i18n.t('system.department'),
                value: "departmentName"
              },{
                label: i18n.t('system.subordinateRole'),
                value: "jobName"
              },{
                label: i18n.t('system.remarks'),
                value: "remark"
              }
            ]
          }
        },
        permsCur:[
          "INSERT_USER",
          "DELETE_USER",
          "UPDATE_USER",
          "SELECT_USER",
          "RESET_KEY_USER",
          "SELECT_DEPARTMENT",
          "INSERT_DEPARTMENT",
          "UPDATE_DEPARTMENT",
          "DELETE_DEPARTMENT",
        ],
        permsBtn:{
          "DELETE_USER":false,
          "SELECT_USER":false,
          "UPDATE_USER":false,
          "INSERT_USER":false,
          "RESET_KEY_USER":false,
          "SELECT_DEPARTMENT":false,
          "INSERT_DEPARTMENT":false,
          "UPDATE_DEPARTMENT":false,
          "DELETE_DEPARTMENT":false,
        },
        noPermsDis:true,
      }
    },//end data

    created(){
      let that = this
      let permsAll = this.$store.state.permissions;
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      // console.log(this.permsCur,'111111')
      this.$http.get("/tenant/user?limit=9999999").then(function (resp) {
        that.userData = resp.data;
      })
      this.refreshTypeTree();
      this.refreshData();
    },
    computed:{
      treeData(){//需传输到树组件的数据
        let treeData={
          treeTitle:"分类",//树的根目录名称
          typeId:"departmentId",//类别id字段
          typeName:"departmentName",//类名名称
          treeListUrl:"/systemManage/department",//树的数据接口名称
          addTreeUrl:"/systemManage/department",//增加树元素的接口名称
          editTreeUrl:"/systemManage/department",//修改树元素的接口名称
          deleteTreeUrl:"/systemManage/department/",//删除树元素的接口名称
          chooseNodeUrl:"/tenant/userlist/",//选择树元素查找对应列表的接口名称
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
          "height":551+"px"
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
      onPopUp(){
        let that =this;
        if((!that.editModal.item.userId&&that.permsBtn.INSERT_USER)||(that.editModal.item.userId&&that.permsBtn.UPDATE_USER)){
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
        this.table.loading=true;
        let that = this;
        let params = {};

        if(this.search.dates && this.search.dates[0]){
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];

          params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          params.endDate = this.$iqis.utils.getDayEnd(edate);
        }

        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;

        this.$http.get("/tenant/user",{params:params}).then(function (resp) {
          that.table.loading=false;
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
        })
      },
      refreshSelectData(obj){
        // console.log(obj,'部门-----------')
        this.table.loading=true;
        let that=this;
        let sns = obj||that.snsData;
        if(sns.length==0||sns[0].title==i18n.t('system.department')||(obj&&!obj[0].departmentId)){
          that.refreshData();
        }else {
          let params = {};
          // this.table.pager.current=1;
          // this.table.pager.limit=10;
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          that.tree.selected = true;
          let url = "/tenant/userlist/";
          console.log()
          that.$http.get(url + sns[0].departmentId, {params: params}).then((resp) => {
            that.table.loading=false;
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
        this.$http.get("/systemManage/department",{params:{limit:99999999}}).then(function(resp){
          let root = {title:i18n.t('system.department'),selected: false,label:i18n.t('system.department'),value:0,expand:true};

          if(!selectValue){
            // console.log("set root select:"+selectValue);
            root.selected = true;
          }

          if(resp.data){

            if(selectValue){
              for(let i =0;i<resp.data.length;i++){
                // console.log("set node select:"+selectValue);
                resp.data[i].selected = resp.data[i].departmentId == selectValue;
                that.tree.selected = true;
              }
            }

            that.$iqis.utils.treeify(resp.data,root,"departmentId",function(item){
              return item.departmentName;
            },"parentId");
          }
          // console.log(root);
          that.category = [root];
        });
      },
      editSelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        // console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t('system.cbm'),
            desc: ''
          });
          return;
        }
        this.showModal(selectedRow[0]);
      },
      onDBClick(o){
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
          let result = this.$iqis.utils.findPathInTree(this.category[0],[],s_item.departmentId,"departmentId");
          result = result || [];
          d = {departmentValue:[],name:"",remark:"",account:'',departmentName:'',jobName:'',positionAgentId:'',phoneNum:null,email:null}
          d.departmentValue = result;

        }else{
          let result = this.$iqis.utils.findPathInTree(this.category[0],[],d.departmentId,"departmentId");

          result = result || [];
          d.departmentValue = result;
        }

        this.editModal.item = d;
        this.editModal.show = true;
        this.editModal.requesting = false;
        this.loadEditData();
        this.loadDepartment();
        this.editModal.item.userId=d.userId;
        this.onPopUp();
      },addSubNode(){

        let that = this;

        let sns = that.snsData;
        let s_item = this.category[0];
        if(sns && sns.length > 0){
          s_item = sns[0];
        }
        if(s_item){
          this.showDepartmentModal(null,s_item.departmentId);
        }
      },editTreeSelected(){

        let that = this;

        let sns = that.snsData;
        let s_item = this.category[0];
        if(sns && sns.length > 0){
          s_item = sns[0];
        }
        if(s_item){
          this.showDepartmentModal(s_item,s_item.parentId);
        }
      },deleteTreeNode(){
        let sns = that.snsData;
        let s_item = null;
        if(sns && sns.length > 0){
          s_item = sns[0];
        }

        if(s_item){
          let that = this;
          this.$http.delete("/systemManage/department/"+s_item.value).then(function (resp) {
            that.$Message.success(i18n.t('system.deleteSuccess'));
            that.refreshTypeTree(null);
          });
        }
      },
      treeSelectChange(){
        let that=this;
        that.table.selected='';
        let sns = that.snsData;
        if(sns.length==0||sns[0].title==i18n.t('system.department')){
          that.tree.selected='';
          that.refreshData();
        }else
        {
          that.refreshSelectData();
        }
      },
      showDepartmentModal(d,pid){
        let result = this.$iqis.utils.findPathInTree(this.category[0],[],pid,"departmentId");
        result = result || [];
        if(!d){
          d = {departmentValue:[],departmentNum:"",remark:"",departmentName:''}
        }else{

        }
        // console.log(result);
        d.departmentValue = result;
        this.editDepartmentModal.item = d;
        this.editDepartmentModal.show = true;
        this.editDepartmentModal.requesting = false;
      },
      modalCancel(){
            that.search.fieldName = '';
            that.search.query = '';

      },
      modalOk(){
        let that = this;
        // console.log(this.editModal.item);
        this.editModal.requesting = false;
        this.editModal.item.departmentId = null;
        if(this.editModal.item.departmentValue && this.editModal.item.departmentValue.length > 0){
          let plt = this.editModal.item.departmentValue[this.editModal.item.departmentValue.length-1];
          if(plt){
            this.editModal.item.departmentId = plt;
          }
        }
        let params = [
          {type:'Empty',title:i18n.t('system.EmployeeAccount'),value:that.editModal.item.account},
          {type:'Account',title:i18n.t('system.EmployeeAccount'),value:that.editModal.item.account},
          {type:'Empty',title:i18n.t('system.employeeName'),value:that.editModal.item.name},
          {type:'Name',title:i18n.t('system.employeeName'),value:that.editModal.item.name},
          {type:'Empty',title:i18n.t('system.department'),value:that.editModal.item.departmentId},
          {type:'Empty',title:i18n.t('system.subordinateRole'),value:that.editModal.item.jobId},
          {type:'Empty',title:i18n.t('system.contactInformation'),value:that.editModal.item.phoneNum},
          {type:'Empty',title:"代理人",value:that.editModal.item.positionAgentId},
          {type:'PhoneNum',title:i18n.t('system.contactInformation'),value:that.editModal.item.phoneNum},
          // {type:'PhoneNum',title:i18n.t('system.contactInformation'),value:that.editModal.item.phoneNum},

          // {type:'Email',title:i18n.t('system.emailAddress'),value:that.editModal.item.email},
          {type:'Word600',title:i18n.t('system.remarks'),value:that.editModal.item.remark},
        ]
        if(that.editModal.item.account=='admin'){
          params.splice(4,1)
        }
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
        console.log(that.editModal.item,'that.editModal.item');
        if(that.editModal.item.phoneNum == ""){
           that.editModal.item.phoneNum = null
        }
        
        if(this.editModal.item.userId){
          that.$http.put("/tenant/user",that.editModal.item,that.headers).then(function (resp) {
            that.table.selected='';
            that.search.query='';
            that.search.fieldName='';
            that.search.dates=[];
            that.$Message.success(i18n.t('system.editSuccess'));
            that.editModal.show = false;
            //跳转到对应的树节点下
            that.refreshTypeTree(that.editModal.item.departmentId);
            let sns=[];
            let node={};
            node.title="";
            node.departmentId=that.editModal.item.departmentId;
            sns.push(node);
            that.refreshSelectData(sns);
          });
        }else{
          console.log(that.headers);
          
          that.$http.post("/tenant/user",that.editModal.item,that.headers).then(function (resp) {
            that.table.selected='';
            that.search.fieldName = '';
            that.search.query = '';
            that.search.dates=[];
            that.$Message.success(i18n.t('system.addSuccess'));
            that.editModal.show = false;
            //跳转到对应的树节点下
            that.refreshTypeTree(resp.data.departmentId);
            let sns=[];
            let node={};
            node.title="";
            node.departmentId=resp.data.departmentId;
            sns.push(node);
            that.refreshSelectData(sns);
          });
        }
        this.editModal.requesting = false;
      },
      departmentModalOk(){
        let that = this;
        this.editDepartmentModal.requesting = false;
        this.editDepartmentModal.item.parentId = null;
        if(this.editDepartmentModal.item.departmentValue && this.editDepartmentModal.item.departmentValue.length > 0){
          let plt = this.editDepartmentModal.item.departmentValue[this.editDepartmentModal.item.departmentValue.length-1];
          if(plt){
            this.editDepartmentModal.item.parentId = plt;
          }
        }
        let params = [
          {type:'Empty',title:i18n.t('system.departmentNumber'),value:that.editDepartmentModal.item.departmentNum},
          {type:'No',title:i18n.t('system.departmentNumber'),value:that.editDepartmentModal.item.departmentNum},
          {type:'Empty',title:i18n.t('system.departmentName'),value:that.editDepartmentModal.item.departmentName},
          {type:'Name',title:i18n.t('system.departmentName'),value:that.editDepartmentModal.item.departmentName},
          {type:'Word600',title:i18n.t('system.remarks'),value:that.editDepartmentModal.item.remark},
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
        if(this.editDepartmentModal.item.departmentId){
          that.$http.put("/systemManage/department",that.editDepartmentModal.item).then(function (resp) {
            that.table.selected='';
            that.refreshSelectData();
            that.refreshTypeTree(that.editDepartmentModal.item);
            that.$Message.success(i18n.t('system.editSuccess'));
            that.editDepartmentModal.show = false;
          });
        }else{
          that.$http.post("/systemManage/department",that.editDepartmentModal.item).then(function (resp) {that.table.selected='';
            that.search.query='';
            that.search.fieldName='';
            that.table.pager.current = 1;
            that.refreshData();
            that.refreshTypeTree(that.editDepartmentModal.item);
            that.$Message.success(i18n.t('system.addSuccess'));
            that.editDepartmentModal.show = false;
          });
        }
      },
      loadDepartmentRender(label){
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
      loadDepartment(){
        this.search.departmentLoading = true;
        let that = this;
        this.search.departmentList = [];
        this.$http.get("/systemManage/department",{params:{limit:99999999}}).then(function (resp) {
          that.refreshTypeTree(that.editDepartmentModal.item);
          that.search.departmentList = resp.data;
          that.search.departmentLoading = false;
        });
      },
      loadEditData(){
        this.editModal.dataLoading = true;

        let that = this;
        this.$http.get("/systemManage/job?isQueryAdmin=0",{params:{limit:99999999}}).then(function (resp) {
          if(resp.data){
            that.search.jobList = resp.data;
            that.editModal.dataLoading = false;

            if(that.editModal.item.account=='admin'){
              that.adminDisabled=true;

            }else{
              that.adminDisabled=false;
            }
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
        // console.log(ss,'ss--------------------------------')
        if(ss[0].account=='admin'){
          this.$Notice.warning({title:i18n.t('system.adminNoDel')})
          return;
        }
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/tenant/user/"+ss[i].userId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('system.adminNoDel'));
              that.table.selected='';
              that.refreshSelectData();
            });
          }
        }
      },
      resetKey(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.put("/tenant/user/initialPassword?userId="+ss[i].userId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('system.resetSuccess'));
              that.refreshSelectData();
            });
          }
        }
      }
    }
  }

</script>
<style>

</style>
