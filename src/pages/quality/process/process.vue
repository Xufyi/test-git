<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('quality.sa')" slot="prepend" style="width: 120px; text-align: left">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="table.selected='';table.pager.current = 1;refreshData()">{{$t("quality.search")}}</Button>
        <Button type="ghost" @click="table.selected='';table.pager.current = 1;search.query='';search.fieldName='';refreshData()">{{$t("quality.reset")}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <Button style="margin-right:8px;" v-if="permsBtn.INSERT_PROD_PROCESS" type="ghost" icon="plus"  @click="showModal(null)">{{$t("quality.add")}}</Button>
        <Button style="margin-right:8px;" v-if="permsBtn.UPDATE_PROD_PROCESS" type="ghost" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t("quality.modify")}}</Button>
        <Poptip
          confirm
          :title="i18n.t('quality.dsi')"
          placement="bottom-start"
          :ok-text='i18n.t("quality.confirm")'
          :cancel-text='i18n.t("quality.cancel")'
          @on-ok="deleteTableSelected">
          <Button v-if="permsBtn.DELETE_PROD_PROCESS" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t("quality.delete")}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second">
        <!--<Button type="primary" icon="more">自定义列表</Button>-->
        <Button type="text"  icon="refresh" @click="table.pager.current = 1;table.selected='';search.query='';search.fieldName='';refreshData();">{{$t("quality.refresh")}}</Button>
        <!--<Button type="ghost" icon="share">导出报表</Button>-->
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-abnormal-type-context" style="display: -webkit-flex;display: flex;">
        <!--<div class="iqis-abnormal-type-tree" style="flex: 0 0 260px;font-size: 14px;overflow: auto; border: 1px solid #e9eaec;margin-right: 8px;padding-left: 10px;" :style="treeStyle">-->
          <!--<Tree :data="category" @on-select-change="treeSelectChange" ></Tree>-->
        <!--</div>-->
        <div class="iqis-abnormal-type-table" style="flex: 1 1 100px;overflow: auto;">
          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns"   :loading="table.loading" @on-selection-change="tableSelectChange"  border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display:inline-block"> -->
             <div style="padding: 20px 0 20px 0px;">
                <Page id="pageId" v-if="table.pager.need" :total="table.pager.total":page-size="table.pager.limit" :current="table.pager.current"
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
      :title="editModal.item.prodProcessId?i18n.t('quality.mpss'):i18n.t('quality.apss')"
      v-model="editModal.show"
      :mask-closable="false"
      :width="600" >
      <Row type="flex" :gutter="40">
        <i-col span="12">{{$t("quality.osn")}}</i-col>
        <i-col span="12">{{$t("quality.psc")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12"><i-input :disabled="noPermsDis||normalProcessDis" :placeholder="i18n.t('quality.required')" v-model="editModal.item.prodProcessName" style="width: 100%;"></i-input>
        </i-col>
        <i-col span="12">
          <i-input :placeholder="i18n.t('quality.required')" :disabled="noPermsDis||normalProcessDis" v-model="editModal.item.prodProcessCode" style="width: 100%;"></i-input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">{{$t("quality.remarks")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="24"><Input :disabled="noPermsDis||normalProcessDis" :placeholder="i18n.t('quality.pird')" v-model="editModal.item.prodProcessRemark" type="textarea" :rows="4" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <div slot="footer">
        <Button v-if="!noPermsDis&&!normalProcessDis" type="primary" size="large" @click="modalOk" :loading="editModal.requesting">{{$t("quality.confirm")}}</Button>
        <Button type="text" size="large" @click="editModal.show=false">{{$t("quality.cancel")}}</Button>
      </div>
      <Spin v-if="editModal.dataLoading" fix size="large"></Spin>
    </Modal>
  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import $ from "jquery"

  export default {
    components: {
      Input
    },
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        data:[
        ],
        noPermsDis:false,
        tableEditDis:true,
        editModal:{
          dataLoading:false,
          item:{},
          show:false,
          requesting:false
        },
        category:[],
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
              title: i18n.t("quality.psc"),
              className:'tablePadding',
              maxWidth:300,
              ellipsis:true,
              key: 'prodProcessCode'
            },{
              title: i18n.t("quality.osn"),
              className:'tablePadding',
              maxWidth:300,
              ellipsis:true,
              // width:300,
              key: 'prodProcessName'
            },{
              title: i18n.t("quality.remarks"),
              className:'tablePadding',
              // width: 250,
              // minWidth:250,
              ellipsis:true,
              // width:600,
              key: 'prodProcessRemark'
            }
          ]
        },
        search: {
          query: "",
          fieldName: "",
          data: {
            searchTypes: [
              {
                label: i18n.t("quality.sa"),
                value: ""
              }, {
                label: i18n.t("quality.pc"),
                value: "prodProcessCode"
              },{
                label: i18n.t("quality.processName"),
                value: "prodProcessName"
              },{
                label: i18n.t("quality.remarks"),
                value: "prodProcessRemark"
              }
            ]
          }
        },
        permsCur:[
          "INSERT_PROD_PROCESS",
          "SELECT_PROD_PROCESS",
          "UPDATE_PROD_PROCESS",
          "DELETE_PROD_PROCESS",
        ],
        permsBtn:{
          "DELETE_PROD_PROCESS":false,
          "SELECT_PROD_PROCESS":false,
          "UPDATE_PROD_PROCESS":false,
          "INSERT_PROD_PROCESS":false,
        },
        normalProcessDis:false,


      }
    },//end data

    created(){
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      // this.refreshTree();
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
      this.table.pager.current = 1;
      this.refreshData();
    },

    computed:{
      treeStyle(){
        return {
          "height":(Math.max(this.table.pager.rows,10)*40+54)+"px"
        };
      }
    },

    methods:{
      onPopUp(){
        let that = this;
        if((!that.editModal.item.prodProcessId&&that.permsBtn.INSERT_PROD_PROCESS)||(that.editModal.item.prodProcessId&&that.permsBtn.UPDATE_PROD_PROCESS)){
          this.noPermsDis=false;
        }else{
          this.noPermsDis=true;

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
      treeSelectChange(n){
        // console.log(n);
//        if(n){
//          this.search.selectType = n.inspectionTypeId;
//        }else{
//          this.search.selectType = null;
//        }
        this.table.pager.current = 1;
        this.refreshData();

      },
      // refreshTree(){
      //   let that = this
      //   this.$http.get("/basic/abnormaltype",{params:{limit:99999999}}).then(function (resp) {
      //     let root = {title:"异常原因类别",selected:true,expand:true};
      //     if(resp.data){
      //       that.$iqis.utils.treeify.apply(that.$iqis.utils,[resp.data,root,"abnormalTypeId","abnormalTypeName","parentId"]);
      //     }
      //     console.log(root);
      //     that.category = [root];
      //   });
      // },
      refreshData(){
        this.table.loading = true;
        let params = {page:this.table.pager.current, limit:this.table.pager.limit, query:this.search.query,fieldName:this.search.fieldName};
        let that = this;
        this.$http.get("/basic/prod-process",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.$http.get("/basic/default-prod-process").then(function (res) {
            if(res.data){
              that.data = [...that.data,...res.data]
            }
          });
          if(resp.pagerInfo){
            that.table.pager.total = resp.pagerInfo.total;
          }
          that.table.loading = false;
          that.tableEditDis=true;

        })

      },
      showModal(d){
        let that = this;
        if(!d){
          d = {prodProcessName:"",prodProcessCode:'',prodProcessRemark:""}
        }else{

        }
        if(d&&d.prodProcessName==i18n.t("product.finalInspection")){
          that.normalProcessDis=true;
        }else{
          that.normalProcessDis=false;
        }

        this.editModal.item = d;
        this.editModal.show = true;
        this.editModal.requesting = false;
        this.loadEditData();
        this.editModal.item.prodProcessId=d.prodProcessId
        this.onPopUp()
      },loadEditData(){
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
      },
      editSelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        // console.log(selectedRow);
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
      modalOk(){
        let that = this;
        // console.log(this.editModal.item);
        this.editModal.requesting = false;
        let params = [
          {type: 'Empty', title: i18n.t("quality.osn"), value: that.editModal.item.prodProcessName},
          {type: 'Name', title: i18n.t("quality.osn"), value: that.editModal.item.prodProcessName},
          {type: 'Empty', title: i18n.t("quality.psc"), value: that.editModal.item.prodProcessCode},
          {type: 'No', title: i18n.t("quality.psc"), value: that.editModal.item.prodProcessCode},
          {type: 'Word600', title: i18n.t("quality.remarks"), value: that.editModal.item.prodProcessRemark},
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

        if(this.editModal.item.prodProcessId){
          that.$http.put("/basic/prod-process",that.editModal.item).then(function (resp) {
            that.table.selected='';
            that.refreshData();
            that.$Message.success(i18n.t("quality.ats"));
            that.editModal.show = false;
          });
        }else{
          that.$http.post("/basic/prod-process",that.editModal.item).then(function (resp) {
            that.table.selected='';
            that.search.query='';
            that.search.fieldName='';
            that.table.pager.current = 1;
            that.refreshData();
            that.$Message.success(i18n.t("quality.as"));
            that.editModal.show = false;
          });
        }

        //this.editModal = true;
      },tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
      },deleteTableSelected(){
        let ss = this.$refs.pageTable.getSelection();
        // console.log(ss,'选中数据')
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            if(ss[i].prodProcessName==i18n.t("product.finalInspection")){
              that.$Notice.warning({title:i18n.t("quality.tfi")})
              break;
            }
            delArr.push(this.$http.delete("/basic/prod-process/"+ss[i].prodProcessId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t("quality.ds"));
              that.table.selected='';
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
