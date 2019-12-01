<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('quality.sa')" slot="prepend" style="width: 120px;text-align: left">
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
        <Button style="margin-right:8px;" v-if="permsBtn.INSERT_PROD_TASK" type="ghost" icon="plus"  @click="showModal(null)">{{$t("quality.add")}}</Button>
        <Button style="margin-right:8px;" v-if="permsBtn.UPDATE_PROD_TASK" type="ghost" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t("quality.modify")}}</Button>
        <Poptip
          confirm
         :title="i18n.t('quality.dsi')"
          placement="bottom-start"
          :ok-text='i18n.t("quality.confirm")'
          :cancel-text='i18n.t("quality.cancel")'
          @on-ok="deleteTableSelected">
          <Button v-if="permsBtn.DELETE_PROD_TASK" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t("quality.delete")}}</Button>
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
              <Page v-if="table.pager.need" :total="table.pager.total":page-size="table.pager.limit" :current="table.pager.current"
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
      :title="editModal.item.prodTaskId?i18n.t('quality.mip'):i18n.t('quality.aip')"
      v-model="editModal.show"
      :mask-closable="false"
      :width="600" >
      <Row type="flex" :gutter="40">
        <i-col span="12">{{$t("quality.nip")}}</i-col>
        <i-col span="12">{{$t("quality.ipc")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12"><i-input :disabled="noPermsDis||normalTaskDis" :placeholder="i18n.t('quality.required')" v-model="editModal.item.prodTaskName" style="width: 100%;"></i-input>
        </i-col>
        <i-col span="12">
          <i-input :placeholder="i18n.t('quality.required')" :disabled="noPermsDis||normalTaskDis" v-model="editModal.item.prodTaskCode" style="width: 100%;"></i-input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">{{$t("quality.pos")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="24">
          <div  style="margin-bottom: 3px;">
            <Select :disabled="noPermsDis||normalTaskDis" v-model="search.processSel" @on-change="modalFindProcessItem" filterable :placeholder="i18n.t('quality.saps')">
              <Option v-for="(item,index) in search.processList" :value="item.prodProcessId" :key="index">
                <span>{{ item.prodProcessName }}</span>
                <span style="float:right;color:#ccc">{{$t("quality.ctl")}}</span>
                </Option>
            </Select>
          </div>
          <draggable style="border: 1px solid #e1e1e1;padding-top: 8px; height: 150px;overflow-y:auto;width: 100%;display: -webkit-flex;display: flex;flex-wrap:wrap;align-items: flex-start;" v-model="editModal.item.prodTaskItems" :options="{group:'people'}" @start="drag=true" @end="drag=false;">
            <Card class="process-item" v-for="(element,index) in editModal.item.prodTaskItems" :key="index">
              <div style="width:inherit;height:inherit;">
                <div style="display:inline-block;">
                  {{element.prodProcessName}}
                </div>
                <Button :disabled="noPermsDis" v-show='!element.isdefault&&!normalTaskDis' class="process-remove-btn" style="border:none;padding:0!important;" slot="extra" type="ghost" @click="removeItem(element)"><Icon type="close-round"></Icon></Button>
              </div>
            </Card>
        </draggable>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">{{$t("quality.remarks")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="24"><Input :disabled="noPermsDis||normalTaskDis" :placeholder="i18n.t('quality.pird')" v-model="editModal.item.prodTaskRemark" type="textarea" :rows="2" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <div slot="footer">
        <Button v-if="!noPermsDis&&!normalTaskDis" type="primary" size="large" @click="modalOk" :loading="editModal.requesting">{{$t("quality.confirm")}}</Button>
        <Button type="text" size="large" @click="editModal.show=false">{{$t("quality.cancel")}}</Button>
      </div>
      <Spin v-if="editModal.dataLoading" fix size="large"></Spin>
    </Modal>
  </div>

</template>
<script>  
  import Input from "iview/src/components/input";
  import draggable from 'vuedraggable'
  import $ from "jquery"

  export default {
    components: {
      Input,draggable
    },
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        normalTaskDis:false,
        data:[
        ],
        defaultProcess:'',
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
              title: i18n.t("quality.processCode"),
              className:'tablePadding',
              maxWidth:240,
              // width: 160,
              ellipsis:true,
              key: 'prodTaskCode'
            },{
              title: i18n.t("quality.pn"),
              className:'tablePadding',
              maxWidth:240,
              ellipsis:true,
              // width:200,
              key: 'prodTaskName'
            },{
              title: i18n.t("quality.nps"),
              className:'tablePadding',
              // width:100,
              minWidth:100,
              // width:200,
              ellipsis:true,
              key: 'prodTaskItemCount'
            },{
              title: i18n.t("quality.remarks"),
              className:'tablePadding',
              ellipsis:true,
              // width:150,
              // minWidth:150,
              // width:600,
              key: 'prodTaskRemark'
            }
          ]
        },
        search: {
          query: "",
          fieldName: "",
          processSel:'',
          processList:[],
          data: {
            searchTypes: [
              {
                label: i18n.t("quality.sa"),
                value: ""
              },{
                label: i18n.t("quality.processCode"),
                value: "prodTaskCode"
              },{
                label: i18n.t("quality.pn"),
                value: "prodTaskName"
              },{
                label: i18n.t("quality.remarks"),
                value: "prodTaskRemark"
              }
            ]
          }
        },
        permsCur:[
          "INSERT_PROD_TASK",
          "SELECT_PROD_TASK",
          "UPDATE_PROD_TASK",
          "DELETE_PROD_TASK",
        ],
        permsBtn:{
          "DELETE_PROD_TASK":false,
          "SELECT_PROD_TASK":false,
          "UPDATE_PROD_TASK":false,
          "INSERT_PROD_TASK":false,
        },
        noPermsDis:true,
        defaultState:false,

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
      // this.refreshTree();
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
        if((!that.editModal.item.prodTaskId&&that.permsBtn.INSERT_PROD_TASK)||(that.editModal.item.prodTaskId&&that.permsBtn.UPDATE_PROD_TASK)){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
      },
      // //点击跳转到输入的页码
      // goElevatorPage(){(!editModal.item.prodTaskId&&permsBtn.INSERT_PROD_TASK)||(editModal.item.prodTaskId&&permsBtn.UPDATE_PROD_TASK)
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

      },
      pageChange(page){
        this.table.pager.current = page;
        this.refreshData();
      },
      treeSelectChange(n){
        // console.log(n);
        if(n){
          this.search.selectType = n.inspectionTypeId;
        }else{
          this.search.selectType = null;
        }
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
          // console.log(root);
      //     that.category = [root];
      //   });
      // },
      refreshData(){
        this.table.loading = true;
        let params = {page:this.table.pager.current, limit:this.table.pager.limit, query:this.search.query,fieldName:this.search.fieldName};
        if(this.search.selectType){
          params.parentId = this.search.selectType;
        }
        let that = this;
        this.$http.get("/basic/prod-task",{params:params}).then(function (resp) {
          // that.$http.get("/basic/default-prod-task",{params:params}).then(function (resp1) {
          //   if(resp1.data){
          //     resp1.data.isdefault = true;
          //   }
          //   if(resp1.data && resp.data){
          //     that.data = [resp1.data,...resp.data]
          //   }else{
              that.data = resp.data;
            // }
            if(resp.pagerInfo){
              that.table.pager.total = resp.pagerInfo.total;
            }
            that.table.loading = false;
          // });
          that.tableEditDis=true;

        })

      },
      showModal(d){
        // console.log(d,'11111111')
        let that = this

        if(d&&d.prodTaskName==i18n.t("quality.gf")){
          that.normalTaskDis=true;
        }else{
          that.normalTaskDis=false;
        }
        let ss = d;
        if(!d){
          d = {prodTaskName:"",prodTaskCode:'',prodTaskRemark:"",prodTaskItems:[]}
          this.defaultState = false;//添加的时候需要默认加上产品终检
        }else{
          this.defaultState = true;//修改时由于已经有了产品终检
        }
        for(let i in d.prodTaskItems){
          if(d.prodTaskItems[i].prodProcessName === i18n.t("quality.pfi")){
            d.prodTaskItems[i].isdefault = true;
          }else{
            d.prodTaskItems[i].isdefault = false;
          }
        }
        // that.$nextTick(function(){
          // setTimeout(function(){
            // console.log(d.prodTaskItems)
            that.editModal.item = d;
            that.editModal.show = true;
          // },2000)
        // })
        
        that.editModal.requesting = false;
        that.loadEditData();
        that.editModal.item.prodTaskId=d.prodTaskId;
        that.onPopUp() 
      },loadEditData(){ 
        this.editModal.dataLoading = true;
        let that = this
        this.$http.get("/basic/prod-process",{params:{limit:99999999}}).then(function (resp) {
          if(resp.data){
            
            for(let i=0;i<resp.data.length;i++){
              if(resp.data[i].prodProcessName === '产品终检' && resp.data[i].prodProcessCode === "CPZJ" && !that.defaultState){
                resp.data[i].isdefault = true;
                that.editModal.item.prodTaskItems.push(resp.data[i])
                break;
              }else{
                resp.data[i].isdefault = false;
              }
            }
            that.search.processList = resp.data;
            for(let i=0;i<resp.data.length;i++){
              if(resp.data[i].prodProcessName === '产品终检'){
                that.search.processList.splice(i,1)
              }
            }
            that.editModal.dataLoading = false;
          }
        });
      },
      modalFindProcessItem(val){
        // console.log(val)
        for(let i =0;i<this.search.processList.length;i++){
          let item = this.search.processList[i];
          if(item.prodProcessId == val){
            this.editModal.item.prodTaskItems.push(this.$iqis.utils.clone(item));
            let that = this;
            this.$nextTick(function () {
              that.search.processSel = '';
            });
            return;
          }
        }
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
      onDBClick(o,i){
        this.showModal(o);
      },
      modalOk(){
        let that = this;
        // console.log(this.editModal.item);
        this.editModal.requesting = false;
        let paramsV = [
          {type: 'Empty', title: i18n.t("quality.nip"), value: that.editModal.item.prodTaskName},
          {type: 'Name', title: i18n.t("quality.nip"), value: that.editModal.item.prodTaskName},
          {type: 'Empty', title: i18n.t("quality.ipc"), value: that.editModal.item.prodTaskCode},
          {type: 'No', title: i18n.t("quality.ipc"), value: that.editModal.item.prodTaskCode},
          {type: 'Word600', title: i18n.t("quality.remarks"), value: that.editModal.item.prodTaskRemark},
        ]
        let state = true;
        for (let i in paramsV) {
          state = that.$iqis.utils.formValidate(paramsV[i].type, paramsV[i].title, paramsV[i].value, (tips) => {
            that.$Notice.warning({title: tips})
          })
          if (!state) {
            return;
            break;
          }
        }



        let params = that.$iqis.utils.clone(that.editModal.item);

        params.prodTaskItemsStr = "";

        if(that.editModal.item.prodTaskItems && that.editModal.item.prodTaskItems.length > 0){
          let idArr = [];
          for(let i=0;i<that.editModal.item.prodTaskItems.length;i++){
            idArr.push(that.editModal.item.prodTaskItems[i].prodProcessId)
          }
          params.prodTaskItemsStr = idArr.join(",");
        }
        delete params.prodTaskItems;

        if(params.prodTaskId){
          that.$http.put("/basic/prod-task",params).then(function (resp) {
            that.table.selected='';
            that.refreshData();
            that.$Message.success(i18n.t("quality.ats"));
            that.editModal.show = false;
          });
        }else{
          that.$http.post("/basic/prod-task",params).then(function (resp) {
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
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            if(ss[i].prodTaskName==i18n.t("quality.gf")){
              that.$Notice.warning({title:i18n.t("quality.tfi")})
              break;
            }
            delArr.push(this.$http.delete("/basic/prod-task/"+ss[i].prodTaskId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t("quality.ds"));
              that.table.selected='';
              that.refreshData();
            });
          }
        }

      },removeItem(item){
        if(this.editModal.item && this.editModal.item.prodTaskItems){
          let index = this.editModal.item.prodTaskItems.indexOf(item);
          if(index >=0){
            this.editModal.item.prodTaskItems.splice(index,1);
          }
        }
      }


    }//end methods
  }

</script>
<style scoped>
  .process-remove-btn{
    margin:0 5px 0 10px;
  }

</style>
<style>
 .ivu-card-extra {
    /* position: absolute;
    right: 16px; */
    top: 5px!important;
}
  .process-item{
    width: 115px;
    flex: 0 0 auto;
    overflow: hidden;
    margin: 2px 10px 2px 12px;
    cursor: move;
  }

  .process-item .ivu-card-body{
    /* padding-right: 50px !important; */
    height:inherit;
    width:inherit;
  }
  .ivu-card-body{
    padding:5px;
  }
.process-item{
  width:auto;
}
</style>
