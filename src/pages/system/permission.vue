<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('system.searchAll')" slot="prepend" style="width: 90px;text-align: left">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="table.pager.current = 1;refreshData()">{{$t('system.search')}}</Button>
        <Button type="ghost" @click="pageChange(1);search.query='';table.selected='';search.fieldName='';refreshData()">{{$t('system.reset')}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <Button v-if="permsBtn.INSERT_ROLE" type="ghost" icon="plus"  @click="showModal(null)">{{$t('system.add')}}</Button>
        <Button style="margin:0 8px;" v-if="permsBtn.UPDATE_ROLE" type="ghost" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t('system.edit')}}</Button>
        <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
          confirm
          :title="i18n.t('system.confirmDelete')"
          placement="bottom-start"
          @on-ok="deleteTableSelected">
          <Button v-if="permsBtn.DELETE_ROLE" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t('system.delete')}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="pageChange(1);table.selected='';search.query='';search.fieldName='';refreshData();">{{$t('system.refreshData')}}</Button>
        <!--<Button type="ghost" icon="share">导出报表</Button>-->
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-permission-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-permission-table" style="flex: 1 1 100px;overflow: auto;">
          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick"  v-drag-table-column="table.columns"   :loading="table.loading" @on-selection-change="tableSelectChange"  border stripe :columns="table.columns" :data="data"></Table>
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
      :title="editModal.item.jobId?i18n.t('system.modifyRole'):i18n.t('system.addRole')"
      v-model="editModal.show"
      :mask-closable="false"
      :width="600" >
      <Row type="flex" :gutter="40">
        <i-col span="12">{{$t('system.roleNumber')}}</i-col>
        <i-col span="12">{{$t('system.roleName')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12"><i-input :disabled="noPermsDis" :placeholder="i18n.t('system.required')" v-model="editModal.item.jobNum" style="width: 100%;"></i-input>
        </i-col>
        <i-col span="12">
          <i-input :placeholder="i18n.t('system.required')" :disabled="noPermsDis" v-model="editModal.item.jobName" style="width: 100%;"></i-input>
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
      :title="i18n.t('system.rolePermission')"
      v-model="editPermissionModal.show"
      :mask-closable="false"
      :width="600">
      <div class="iqis-bus-tree" style="display: -webkit-flex;display: flex;flex-direction: column;flex: 0 0 260px;font-size: 14px;overflow: auto; margin-right: 16px;" :style="treeStyle">
        <div style="flex: 1 1 100px;overflow: auto;">
          <Tree ref="tree" :data="category" :multiple="false"  show-checkbox></Tree>
        </div>
      </div>
      <div slot="footer">
        <Button v-if="permsBtn.UPDATE_PERMISSION" type="primary" size="large" @click="permissionModalOk" :loading="editPermissionModal.requesting">{{$t('system.confirm')}}</Button>
        <Button type="text" size="large" @click="editPermissionModal.show=false">{{$t('system.cancel')}}</Button>
      </div>
      <Spin v-if="editPermissionModal.dataLoading" fix size="large"></Spin>
    </Modal>
  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import $ from "jquery";
  export default {
    components: {
      Input
    },
    data: function () {
      let vm = this;
      return {
        data:[
        ],
        i18n:window.i18n,
        tableEditDis:true,
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        editModal:{
          dataLoading:false,
          item:{},
          show:false,
          requesting:false
        },
        editPermissionModal:{
          dataLoading:false,
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
          newNodeName:""
        },
        table:{
          selected:false,
          loading:true,
          pager:{
            rows:10,
            need:true,
            total:0,
            limit:10,
            current:1
          },
          columns:[
            {type: 'selection',
                width: 40,
                maxWidth: 40,
                minWidth: 40,
                align: 'center'
            },{title: i18n.t('system.no'),
            className:'tablePadding',
              width:60,
              align: 'center',
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              minWidth:60,
              // maxWidth:60
            },
            {
              title: i18n.t('system.roleNumber'),
              className:'tablePadding',
              // width: 200,
              minWidth:200,
              ellipsis:true,
              key: 'jobNum'
            },{
              title: i18n.t('system.roleName'),
              className:'tablePadding',
              minWidth:200,
              // width:200,
              key: 'jobName'
            },{
              title: i18n.t('system.permissions'),
              className:'tablePadding',
              minWidth:160,
              // width:160,
              key: '',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                      color:'#5299EF',
                      fontSize:'14px'
                    },
                    on: {
                      click: () => {
                        this.editPermissionModal.show=true;
                        this.selectPerms=[];
                        this.refreshTypeTree(params.row.jobId)
                      }
                    }
                  }, i18n.t('system.permissionEdit'))
                ]);
              }
            },{
              title: i18n.t('system.remarks'),
              className:'tablePadding',
              minWidth:360,
              // maxWidth:500,
              // width:360,
              key: 'remark'
            }
          ]
        },
        search: {
          query: "",
          fieldName: "",
          data: {
            searchTypes: [
              {
                label: i18n.t('system.searchAll'),
                value: ""
              },{
                label: i18n.t('system.roleNumber'),
                value: "jobNum"
              },{
                label: i18n.t('system.roleName'),
                value: "jobName"
              },{
                label: i18n.t('system.remarks'),
                value: "remark"
              }
            ]
          }
        },
        selectPerms:[],
        permsCur:[
          "SELECT_ROLE",
          "INSERT_ROLE",
          "UPDATE_ROLE",
          "DELETE_ROLE",
          "UPDATE_PERMISSION",
          "SELECT_PERMISSION",
        ],
        permsBtn:{
          "DELETE_ROLE":false,
          "SELECT_ROLE":false,
          "UPDATE_ROLE":false,
          "INSERT_ROLE":false,
          "UPDATE_PERMISSION":false,
          "SELECT_PERMISSION":false,
        },
        noPermsDis:true,
      }
    },//end data
    created(){
      let permsAll = this.$store.state.permissions;
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" :alt="i18n.t(\'system.noData\')"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
      this.table.pager.current = 1;
      this.refreshData();
    },
    computed:{
      treeStyle(){
        return {
          "height":(Math.max(this.table.pager.rows,10)*35)+"px"
        };
      }
    },

    methods:{
      onPopUp(){
        let that = this;
        if((!that.editModal.item.jobId&&that.permsBtn.INSERT_ROLE)||(that.editModal.item.jobId&&that.permsBtn.UPDATE_ROLE)){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
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
      refreshData(){
        this.table.loading = true;
        let params = {page:this.table.pager.current,limit:this.table.pager.limit,query:this.search.query,fieldName:this.search.fieldName};
        let that = this;
        this.$http.get("/systemManage/job",{params:params}).then(function (resp) {
          that.data = resp.data;
          if(resp.pagerInfo){
            that.table.pager.total = resp.pagerInfo.total;
          }
          that.table.loading = false;
        })

      },
      refreshTypeTree(selectValue){
        let that = this;
        this.editPermissionModal.item.jobId=selectValue;
        this.$http.get("/system/auth/permisson?roleId="+selectValue).then(function(resp){
          // console.log(resp,'权限---------------')
          let aclValues=[];//所有的权限名称
          let otherPerms=[];//显示在页面上的可供选择的权限
          for(let i in resp.data){
            aclValues.push(resp.data[i].aclValue)
          }
          // console.log(aclValues,'所有权限名称')
          
          for(let i in aclValues){
            if(aclValues[i]&&(aclValues[i].indexOf("SELECT")!=-1||aclValues[i].indexOf("UPDATE_PERMISSION")!=-1)){
              that.selectPerms.push(resp.data[i])//根据权限字段自动赋予查询和权限修改的权限
            }else{
              otherPerms.push(resp.data[i])
            }
          }
          // for(let i in otherPerms){
          //   if(otherPerms[i].moduleName==i18n.t('system.statisticalChart')||otherPerms[i].moduleName==i18n.t('system.samplePlan')){//||otherPerms[i].moduleName==i18n.t('system.samplePlan')根据权限名称把‘统计报表’和‘抽样计划’加入选中权限列表而不显示在页面上
          //     otherPerms.splice(i,1),
          //     that.selectPerms.push(otherPerms[i])
          //   }
          // }
          resp.data = otherPerms;
          let root = {title:i18n.t('system.rolePermission'),label:i18n.t('system.rolePermission'),checked:false,value:0,expand:true,disabled:!that.permsBtn.UPDATE_PERMISSION};
          if(resp.data){
            // alert(that.noPermsDis)
            that.$iqis.utils.permissionparenttreeify(resp.data,root,"moduleId","moduleName","parentModuleId","checked",null,null,!that.permsBtn.UPDATE_PERMISSION);
          }
          that.category = [root];
          // console.log(root,'root')
        });
      },
      showModal(d){
        if(!d){
          d = {jobNum:"",jobName:'',remark:""}
        }else{

        }
        this.editModal.item = d;
        this.editModal.show = true;
        this.editModal.requesting = false;
        this.loadEditData();
        this.editModal.item.jobId=d.jobId;
        this.onPopUp();
      },loadEditData(){
        this.editModal.dataLoading = false;
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
      onDBClick(o,i){
        this.showModal(o );
      },
      modalOk(){
        let that = this;
        // console.log(this.editModal.item);
        this.editModal.requesting = false;
        let params = [
          {type:'Empty',title:i18n.t('system.roleNumber'),value:that.editModal.item.jobNum},
          {type:'No',title:i18n.t('system.roleNumber'),value:that.editModal.item.jobNum},
          {type:'Empty',title:i18n.t('system.roleName'),value:that.editModal.item.jobName},
          {type:'Name',title:i18n.t('system.roleName'),value:that.editModal.item.jobName},
          {type:'Word600',title:i18n.t('system.remarks'),value:that.editModal.item.remark},
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
        if(this.editModal.item.jobNum=='admin'||this.editModal.item.jobName==i18n.t('system.administrators')){
          this.$Notice.warning({
            title: i18n.t('system.damoa'),
            desc: ''
          });
          this.editModal.requesting = false;
          return;
        }
        if(this.editModal.item.jobId){
          that.$http.put("/systemManage/job",that.editModal.item).then(function (resp) {
            that.refreshData();
            that.$Message.success(i18n.t('system.editSuccess'));
            that.editModal.show = false;
          });
        }else{
          that.$http.post("/systemManage/job",that.editModal.item).then(function (resp) {
            that.refreshData();
            that.$Message.success(i18n.t('system.addSuccess'));
            that.editModal.show = false;
          });
        }
      },permissionModalOk(){
        this.editPermissionModal.requesting = false;
        let that = this;

        if(this.editPermissionModal.item.jobId){
          let jobId = this.editPermissionModal.item.jobId;
          let treeData = that.category[0].children;
          let params = [];
          this.getParams(treeData,params);
          that.editPermissionModal.show = false;

          for(let i in that.selectPerms){
            if(that.selectPerms[i].aclValue=="UPDATE_PERMISSION"){
              that.selectPerms[i].checked=false;
            }else{
              that.selectPerms[i].checked=true;
            }
            params.push(that.selectPerms[i])
          }
          // console.log(params,'保存的权限');

          that.$http.post("/system/auth/permisson?roleId="+jobId,params,this.headers).then(function (resp) {
            that.$Message.success(i18n.t('system.editSuccess'));
            that.editPermissionModal.requesting = false;
            that.editPermissionModal.show = false;
          });
        }
      },getParams(treeData,params){
        if (treeData.length > 0) {
          for (let i = 0; i < treeData.length; i++) {
            var o = {
              moduleId: treeData[i].moduleId,
              moduleName: treeData[i].moduleName,
              parentModuleId: treeData[i].parentModuleId,
              aclValue: treeData[i].aclValue,
              checked: treeData[i].checked
            };
            params.push(o);
            let childtreeData = treeData[i].children;
            this.getParams(childtreeData,params);
          }
        }
      },
//      treeSelectChange(){
//        let sns = this.$refs.tree.getSelectedNodes();
//        let s_item = null;
//        if(sns && sns.length > 0){
//          s_item = sns[0];
//        }
//        this.tree.selected = s_item && s_item.value;
//      },
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
        // console.log(ss[0],'11111111111111111111111')
        if(ss[0].jobNum=='admin'){
          this.$Notice.warning({title:i18n.t('system.supplierScore')})
          return;
        }
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/systemManage/job/"+ss[i].jobId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('system.deleteSuccess'));
              that.refreshData();
            });
          }
        }
      }
    }//end methods
  }

</script>
<style>

</style>
