<template>
  <div class="iqis-page">
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <Button style="margin-right:8px;" v-if="permsBtn.INSERT_DEFECT_LOC" type="ghost" icon="plus" @click="addModel=true;addChange=false;clearAdd()">{{$t("quality.add")}}</Button>
        <Button style="margin-right:8px;" v-if="permsBtn.UPDATE_DEFECT_LOC  " type="ghost" icon="edit" :disabled="tableEditDis" @click="addChange=true;getOne();">{{$t("quality.modify")}}</Button>
        <Poptip confirm
         :title="i18n.t('quality.dsi')" 
         placement="bottom-start" 
         :ok-text='i18n.t("quality.confirm")'
        :cancel-text='i18n.t("quality.cancel")'
         @on-ok="deleteOne">
          <Button v-if="permsBtn.DELETE_DEFECT_LOC" type="ghost" icon="trash-a" :disabled="!table.selectedDatas">{{$t("quality.delete")}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="refreshTable">{{$t("quality.refresh")}}</Button>
        <!-- <Poptip
          style="width:90px;"
          confirm
          placement="bottom-start"
          title="确定要删除已经选择的数据?"
          @on-ok="deleteSelected"
          ok-text="删除"
          cancel-text="取消">
          <Button  type="ghost" icon="trash-a" style="width:90px;" :disabled="table.selectedDatas==null" @on-cancel="cancel">删除</Button>
        </Poptip> -->
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-defect-lcation-table " style="flex: 1 1 100px;">
        <!--<Table class="iqis-inline-editor-table" :height="530"  @on-selection-change="tableSelectChange" @drag-start="dragStartHandler" border stripe-->
               <!--:loading="table.loading" :columns="table.columns" :data="data" ref="defectlocTable">-->
        <!--</Table>-->
        <Table ref="pageTable" class="easyTableCustom tableCustom" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data" :loading="table.loading"></Table>
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
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
    <Modal :title="addChange?i18n.t('quality.mdLocation'):i18n.t('quality.adLocation')" v-model="addModel" :mask-closable="false" :width="600">
      <Row type="flex" :gutter="40">
        <i-col span="12">{{$t("quality.dlName")}}</i-col>
        <i-col span="12">{{$t("quality.remarks")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12">
          <Input :disabled="noPermsDis" v-model="add.name" placeholder="" style="width: 100%;"></Input>
        </i-col>
        <i-col span="12">
          <Input :disabled="noPermsDis" v-model="add.remark" placeholder="" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <div slot="footer">
        <Button v-if="!noPermsDis" type="primary" size="large" ok-text @click="saveOne">{{$t("quality.confirm")}}</Button>
        <Button type="text" size="large" cancel-text @click="addModel=false">{{$t("quality.cancel")}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import $ from "jquery"

  export default {
    data(){
      let vm = this;
      return {
        i18n:window.i18n,
        defectLocId:'',
        newData:[

        ],
        data:[

        ],
        tableEditDis:true,
        tryCount:0,
        table:{
          pager:{
            rows:10,
            need:true,
            total:100,
            limit:10,
            current:1
          },
          rowIdCreateIndex:1,
          selectedDatas:null,
          //{"prodUnitId":1,"no":"1","name":"箱","remark":""}
          loading:true,
          columns:[
            {type: 'selection',
              align: 'center',
              width:40,
              minWidth:40,
              maxWidth:40
            },{title: i18n.t("quality.no"),
              width:50,
              className:'tablePadding',
              align: 'center',
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
            },
            {
              title: i18n.t("quality.dl"),
              className:'tablePadding',
              width: 250,
              minWidth:80,
              required:true,
              ellipsis:true,
              key: 'name',
//              render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellEditorEnd),
            }
            ,
            {
              title: i18n.t("quality.remarks"),
              className:'tablePadding',
              ellipsis:true,
              key: 'remark',
//              render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellEditorEnd)
            }

          ]
        },
        addModel:false,
        addChange:false,
        add:{
          name:'',
          remark:''
        },
        permsCur:[
          "INSERT_DEFECT_LOC",
          "DELETE_DEFECT_LOC",
          "UPDATE_DEFECT_LOC",
          "SELECT_DEFECT_LOC"
        ],
        permsBtn:{
          "DELETE_DEFECT_LOC":false,
          "SELECT_DEFECT_LOC":false,
          "UPDATE_DEFECT_LOC":false,
          "INSERT_DEFECT_LOC":false,
        },
        noPermsDis:true,
      }//end return

    },//end  data
    created() {
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
    },
    methods:{
      onPopUp(){
        let that = this;
        if((!that.addChange&&that.permsBtn.INSERT_DEFECT_LOC)||(that.addChange&&that.permsBtn.UPDATE_DEFECT_LOC))
        {
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
        this.loadData();

      },
      pageChange(page){
        this.table.pager.current = page;
        this.loadData();
      },
      clearAdd(){
        this.add.name='';
        this.add.remark='';
        this.onPopUp();
      },
      getOne(){
        let that = this;
        let ss = that.$refs.pageTable.getSelection();
        // console.log(ss)
        if(ss && ss.length ==1){
          that.addModel=true;
          that.$http.get('/basic/defectloc/'+ss[0].defectLocId).then(function(resp){
            that.add = resp.data;
          })
        }else{
          this.$Notice.warning({
            title:i18n.t("quality.cbm"),
            desc: ''
          });
        }
        this.onPopUp();

      },
      onDBClick(o,i){
        let that = this;
        that.addModel=true;
        that.addChange=true;
        this.onPopUp();
        that.defectLocId=o.defectLocId;
          that.$http.get('/basic/defectloc/'+o.defectLocId).then(function(resp){
            that.add = resp.data;
          })
      },
      saveOne(){
        let that = this;
        let params = [
          {type: 'Empty', title: i18n.t("quality.dlName"), value: that.add.name},
          {type: 'Name', title: i18n.t("quality.dlName"), value: that.add.name},
          {type: 'Word600', title: i18n.t("quality.remarks"), value: that.add.remark},
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
        let ss = that.$refs.pageTable.getSelection();
        if(!that.add.name) {
          that.$Notice.warning({title: i18n.t("quality.td")});
          return;
        }
        if(that.add.remark.length>600){
          this.$Notice.warning({
            title: i18n.t("quality.rs"),
            desc: ''
          });
          return;
        }
        if( (ss && ss.length ==1) || that.defectLocId){
          let defectLocId=that.defectLocId?that.defectLocId:ss[0].defectLocId;
          that.$http.put('/basic/defectloc?defectLocId='+defectLocId,that.add).then(function(resp){
            that.$Message.success(i18n.t("quality.ats"));
            that.addModel=false;
            that.refreshTable();
          })
        }
        else{
          that.$http.post('/basic/defectloc',that.add).then(function(resp){
            that.$Message.success(i18n.t("quality.as"));
            that.addModel=false;
            that.refreshTable();
          })
        }
      },
      deleteOne(){

        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/basic/defectloc/"+ss[i].defectLocId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t("quality.ds"));
              that.refreshTable();
            });
          }
        }

      },
      commitEditorData(){
        for(let k in this.newData){
          this.data.splice(k, 1, this.newData[k]);
        }
        this.newData = [];
      },
      refreshDataLocal(){
        this.commitEditorData();
        this.data = this.$iqis.utils.clone(this.data);
      },

      addNewData(){
        let newRow = {
          "name":"",
          "remark":"",
          _updated : true
        };
        this.$iqis.utils.tableHelper.editable.initRowData([newRow],["name"]);
        this.commitEditorData();
        this.data.push(newRow);
      //  console.log('===============');
        // console.log(111,newRow);
      },
      dragStartHandler(){
        this.commitEditorData();
        // console.log("dragStart");
      },
      tableSelectChange(arr){
        this.table.selectedDatas = arr;
        if(!arr || arr.length == 0){
          this.table.selectedDatas = null;
        }
        if(arr.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
      },
      deleteSelected(){
        // console.log(this.table.selectedDatas);
        if(this.table.selectedDatas == null){
          this.$Notice.open({
            title: i18n.t("quality.psd"),
            desc: ''
          });
        }else{
          let that = this;
          let key = "defectLocId";

          let selection = this.table.selectedDatas;
          let rowIdArr = [];
          for(let i=0;i<selection.length;i++){
            rowIdArr.push(selection[i]._$_row_id);
          }

          this.commitEditorData();
          let deleteRows = [];
          for(let i=0;i<rowIdArr.length;i++){
            for(let j=0;j<this.data.length;j++){
              if(this.data[j]._$_row_id == rowIdArr[i]){
                deleteRows.push(this.data[j]);
              }
            }
          }

          this.$nextTick(function(){
            // console.log(deleteRows);
            // console.log(deleteRows.length);
            let arr = [];
            for(let i=0;i<deleteRows.length;i++){
              let item = deleteRows[i];
              // console.log(item);
              // console.log("id:"+item[key]);
              if(item[key]){
                arr.push(that.$http.delete("/basic/defectloc/"+item[key]));
              }else{ //没有保存到数据库的项目 直接前端删除
                let itemIndex = this.data.indexOf(item);
                if(itemIndex >=0){
                  this.data.splice(itemIndex,1);
                }
              }
            }
            // console.log(arr);
            if(arr.length > 0){
              that.$http.all(arr).then(this.$http.spread(function () {
                // console.log(arguments);
                that.loadData();
                that.$Notice.success({
                  title: i18n.t("quality.ds"),
                  desc: ''
                });
              }));
            }
          })





        }

      },
      saveRow(row,rowIndex){
        // console.log("start saveRow")
        let d = this.$iqis.utils.clone(row);
        let key = "defectLocId";
        d["_$_row_id"] = null;
        let that = this;
        if(row[key]){
          this.$http.put("/basic/defectloc",d).then(function (resp) {
            that.$Message.success(i18n.t("quality.ats"));
            row._updated = false;
            row._error = null;

            // console.log(row);
            // console.log("save update Over")
          }).catch(function (error) {
            row._error = error;
            // console.log(row);
            that.commitEditorData();
            //that.refreshDataLocal();
          });
        }else{
          this.$http.post("/basic/defectloc",d).then(function (resp) {
            row.defectLocId = resp.data.defectLocId;
            that.$Message.success(i18n.t("quality.as"));
            row._updated = false;
            row._error = null;
            // console.log(row);
            // console.log("save Over")
            that.refreshTable();
          }).catch(function (error) {

            row._error = error;
            // console.log(row);
            // console.log(that.data);
            that.commitEditorData();
            //that.refreshDataLocal();
          });
        }

      },
      refreshTable(e){
        let allUpdated = true;
        this.table.loading = true;

        if(e){
          this.tryCount = 0;
          setTimeout((that)=>{
            that.commitEditorData();
            that.refreshTable();
          },200,this);
        }else{
          for(let i=0;i<this.data.length;i++){
            if(this.data[i]._updated == true){
              // console.log("find updated row!!!")
              // console.log(this.data[i]);
              allUpdated = false;
              break;
            }
          }

          if(!allUpdated && this.tryCount < 20){
            this.tryCount+=1;
            // console.log("refreshTable: setTimeout");
            setTimeout((that)=>{
              that.refreshTable();
            },300,this);
          }else{
            // console.log("refreshTable: loadData");
            this.loadData();
          }

        }



      },
      cellEditorEnd(val,key,index){
        //page.data[rowIndex][field] = val;
        // console.log("cellEditorEnd")
        var newRow = this.newData[index];
        if(!newRow){
          newRow =  JSON.parse(JSON.stringify(this.data[index]));
        }
        var oldV = newRow[key];
        newRow[key] = val;
        this.newData[index] = newRow;

        if(oldV != val){
          newRow._updated = true;
          this.saveRow(newRow,index);
        }
      },loadData(){
        let that = this;
        let params={};
        that.table.loading = true;
        that.table.selectedDatas = null;
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        this.$http.get("/basic/defectloc",{params:params}).then(function (resp) {

          that.$iqis.utils.tableHelper.editable.initRowData(resp.data,["name"]);

          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
          that.tableEditDis=true;
        });
      }
    },
    mounted(){
      this.loadData();

    },
    beforeDestroy(){
      // console.log("beforeDestroy!!!!!!")
    }
  }
</script>
<style>

</style>
