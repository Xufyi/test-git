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
        <Button style="margin-right:8px;" type="primary" @click="table.pager.current = 1;table.selected='';refreshData()">{{$t("quality.search")}}</Button>
        <Button type="ghost" @click="table.selected='';search.fieldName='';search.query='';refreshData();pageChange(1)">{{$t("quality.reset")}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0">
        <Button style="margin-right:8px;" v-if="permsBtn.INSERT_REVIEW_PROCESS" type="ghost" icon="plus"  @click="showModal(null)">{{$t("quality.add")}}</Button>
        <Button style="margin-right:8px;" v-if="permsBtn.UPDATE_REVIEW_PROCESS" type="ghost" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t("quality.modify")}}</Button>
        <Poptip
          confirm
          :title="i18n.t('quality.dsi')"
          placement="bottom-start"
          :ok-text='i18n.t("quality.confirm")'
          :cancel-text='i18n.t("quality.cancel")'
          @on-ok="deleteTableSelected">
          <Button v-if="permsBtn.DELETE_REVIEW_PROCESS" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t("quality.delete")}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second">
        <!--<Button type="primary" icon="more">自定义列表</Button>-->
        <Button type="text"  icon="refresh" @click="table.selected='';search.query='';search.fieldName='';refreshData();pageChange(1)">{{$t("quality.refresh")}}</Button>
        <!--<Button type="ghost" icon="share">导出报表</Button>-->
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
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
      :title="editModal.item.reviewProcessId?i18n.t('quality.merp'):i18n.t('quality.aerp')"
      v-model="editModal.show"
      :mask-closable="false"
      :width="700" >
      <Row type="flex" :gutter="40">
        <i-col span="24">{{$t("quality.arpn")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="24"><i-input :disabled="noPermsDis" :placeholder="i18n.t('quality.required')" v-model="editModal.item.name" style="width: 100%;"></i-input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="8">{{$t("quality.auditor")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" >
        <i-col span="8">
          <Select :disabled="noPermsDis" v-model="editModal.item.auditorId" filterable :placeholder="i18n.t('quality.ps')">
            <Option v-for="item in search.userList" :value="item.userId" :key="item.userId" :label="item.name">{{ item.name }}</Option>
          </Select>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="8">{{$t("iqc.reviewer")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" >
        <i-col span="24">
          <Button :disabled="noPermsDis" type="primary" icon="person-stalker" v-if="reviewerBtnShow&&!noPermsDis" @click="reviewerBtnShow=false;">{{$t('customer.addMoreMember')}}</Button>
          <Select :placeholder="i18n.t('pleaseChoose')" style="width:146px" v-else v-model="reviewerId" @on-change="addMember(reviewerId,editModal.item.reviewers)" filterable>
            <Option v-for="data in search.userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
          </Select>
          <draggable style="display:inline-block" v-model="editModal.item.reviewers" :options="{group:'people'}" @start="drag=true" @end="drag=false;">
            <Tag :closable="!noPermsDis" v-for="(data,index) in editModal.item.reviewers" type="dot" color="blue" :key="index" :name="index" @on-close="deleteMember(index,editModal.item.reviewers)">{{data.reviewerName}}</Tag>
          </draggable>

        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="8">{{$t("quality.jp")}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" >
        <i-col span="8">
          <Select :disabled="noPermsDis" v-model="editModal.item.judgeId" filterable :placeholder="i18n.t('quality.ps')">
            <Option v-for="item in search.userList" :value="item.userId" :key="item.userId" :label="item.name">{{ item.name }}</Option>
          </Select>
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
  import draggable from 'vuedraggable'
  import Input from "iview/src/components/input";
  import $ from "jquery"

  export default {
    components: {
      Input,draggable
    },
    data: function () {
      let vm = this;
      return {
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        reviewerId:null,
        reviewerBtnShow:true,
        i18n:window.i18n,
        label:'',
        data:[
        ],
        tableEditDis:true,
        editModal:{
          dataLoading:false,
          item:{},
          show:false,
          requesting:false
        },
        table:{
          selected:false,
          loading:false,
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
              className:'tablePadding',
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align: 'center',
              // minWidth:80,
              // maxWidth:80
            },
            {
              title: i18n.t("quality.pn"),
              className:'tablePadding',
              // width: 120,
              minWidth:100,
              ellipsis:true,
              key: 'name'
            },{
              title: i18n.t("quality.aa"),
              className:'tablePadding',
              // width: 120,
              minWidth:this.$store.state.locale=='zh_CN'?100:110,
              ellipsis:true,
              key: 'auditorName'
            },{
              title: i18n.t("quality.aa1"),
              className:'tablePadding',
              // width: 120,
              minWidth:this.$store.state.locale=='zh_CN'?100:110,
              ellipsis:true,
              key: 'reviewer1Name'
            },{
              title: i18n.t("quality.aa2"),
              className:'tablePadding',
              // width: 120,
              minWidth:this.$store.state.locale=='zh_CN'?100:110,
              ellipsis:true,
              key: 'reviewer2Name'
            },{
              title: i18n.t("quality.aa3"),
              className:'tablePadding',
              // width: 120,
              minWidth:this.$store.state.locale=='zh_CN'?100:110,
              ellipsis:true,
              key: 'reviewer3Name'
            },{
              title: i18n.t("quality.aa4"),
              className:'tablePadding',
              // width: 120,
              minWidth:this.$store.state.locale=='zh_CN'?100:110,
              ellipsis:true,
              key: 'reviewer4Name'
            },{
              title: i18n.t("quality.dj"),
              className:'tablePadding',
              // width: 120,
              minWidth:100,
              ellipsis:true,
              key: 'judgeName'
            },{
              title: i18n.t("quality.remarks"),
              className:'tablePadding',
              // width: 200,
              minWidth:100,
              ellipsis:true,
              key: 'remark'
            }
          ]
        },
        search: {
          query: "",
          fieldName: "",
          userList:[],
          data: {

            searchTypes: [
              {
                label: i18n.t("quality.sa"),
                value: ""
              }, {
                label: i18n.t("quality.pn"),
                value: "name"
              }, {
                label: i18n.t("quality.aa"),
                value: "auditorName"
              }, {
                label: i18n.t("quality.aa1"),
                value: "reviewer1Name"
              }, {
                label: i18n.t("quality.aa2"),
                value: "reviewer2Name"
              }, {
                label: i18n.t("quality.aa3"),
                value: "reviewer3Name"
              }, {
                label: i18n.t("quality.aa4"),
                value: "reviewer4Name"
              }, {
                label: i18n.t("quality.dj"),
                value: "judgeName"
              }, {
                label: i18n.t("quality.remarks"),
                value: "remark"
              }
            ]
          }
        },
        permsCur:[
          "INSERT_REVIEW_PROCESS",
          "DELETE_REVIEW_PROCESS",
          "UPDATE_REVIEW_PROCESS",
          "SELECT_REVIEW_PROCESS",
        ],
        permsBtn:{
          "DELETE_REVIEW_PROCESS":false,
          "SELECT_REVIEW_PROCESS":false,
          "UPDATE_REVIEW_PROCESS":false,
          "INSERT_REVIEW_PROCESS":false,
        },
        noPermsDis:true,


      }
    },//end data

    created(){
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.loadEditData();
      this.refreshData();
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
    },
    mounted(){
      // this.refreshData();
    },
    computed:{


    },

    methods:{
      addMember(id,part){//添加小组成员
        let that = this;
        let array=[];
        for(let i=0;i<part.length;i++){
          array.push(part[i].reviewerId);
        }
        that.$http.get('/tenant/user/'+id).then(function(resp){
          let name=resp.data.name;
          if(array.indexOf(id)==-1){
            part.push({
              reviewerId:id,
              reviewerName:name
            });
          }else{
            that.$Notice.warning({title: i18n.t('customer.memberExisted')});
          }
        })
      },
      deleteMember(index,part){//删除小组成员
        // //console.log(index)
        let that = this;
        part.splice(index, 1);
      },
      onPopUp(){
        let that = this;
        if((!that.editModal.item.reviewProcessId&&that.permsBtn.INSERT_REVIEW_PROCESS)||(that.editModal.item.reviewProcessId&&that.permsBtn.UPDATE_REVIEW_PROCESS)){
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
      },modalOk(){
        let that = this;

        // console.log(this.editModal.item);
        this.editModal.requesting = false;
        // this.editModal.item.prodLineTypeId = null;
        // if(this.editModal.item.prodLineTypeValue && this.editModal.item.prodLineTypeValue.length > 0){
        //   let plt = this.editModal.item.prodLineTypeValue[this.editModal.item.prodLineTypeValue.length-1];
        //   if(plt){
        //     this.editModal.item.prodLineTypeId = plt;
        //   }
        // }
        let params = [
          {type: 'Empty', title: i18n.t("quality.arpn"), value: that.editModal.item.name},
          {type: 'Name', title: i18n.t("quality.arpn"), value: that.editModal.item.name},
          {type: 'Empty', title: i18n.t("quality.auditor"), value: that.editModal.item.auditorId},
          {type: 'EmptyLength', title: i18n.t("iqc.reviewer"), value: that.editModal.item.reviewers},
          {type: 'Empty', title: i18n.t("quality.jp"), value: that.editModal.item.judgeId},
          {type: 'Word600', title: '备注', value: that.editModal.item.remark},
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
        console.log(that.editModal.item,'aaaa');
        
        if(this.editModal.item.reviewProcessId){
          that.$http.put("/basic/reviewprocess",that.editModal.item,that.headers).then(function (resp) {
            that.refreshData();
            that.$Message.success(i18n.t("quality.ats"));
            that.editModal.show = false;
          });
        }else{
          that.$http.post("/basic/reviewprocess",that.editModal.item,that.headers).then(function (resp) {
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
      }
      ,
      showModal(d){
        if(!d){
          this.reviewerId = null
          this.reviewerBtnShow=true;
          d = {auditorId:'',judgeId:'',name:'',remark:"",reviewers:[]}
        }else{
          // console.log("d");
          // console.log(d);
          // let result = this.$iqis.utils.findPathInTree.apply(this.$iqis.utils,
          //   [this.category[0],[],d.prodLineTypeId,"prodLineTypeId"]);
          // result = result || [];
          // d.prodLineTypeValue = result;
        }
        this.editModal.item = d;
        this.editModal.show = true;
        this.editModal.requesting = false;
        // this.loadEditData();
        this.editModal.item.reviewProcessId=d.reviewProcessId||''
        this.onPopUp();
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
      tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
        // console.log(this.table.selected)
        // console.log(selection)
      },deleteTableSelected(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/basic/reviewprocess/"+ss[i].reviewProcessId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t("quality.ds"));
              that.table.selected='';
              that.refreshData();
            });
          }
        }
        this.refreshData();
      },
      loadEditData(){
        this.editModal.dataLoading = false;

        let that = this
        this.$http.get("/tenant/user",{params:{limit:99999999}}).then(function (resp) {
          if(resp.data){
            that.search.userList = resp.data;
            that.editModal.dataLoading = false;
          }
        });
      },
      refreshData(){
        let that = this;
        that.table.loading = true;

        let params = {};

        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;
        this.$http.get("/basic/reviewprocess",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
          that.tableEditDis=true;
          that.table.selected=false;
        })
      }




    }//end methods




  }

</script>
<style>

</style>
