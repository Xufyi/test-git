<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 215px;">
        <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('pqc.dateFilter')" style="width: 205px"></DatePicker>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('pqc.sa')" slot="prepend" style="width: 110px;text-align: left">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="refreshData">{{$t('pqc.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t('pqc.reset')}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <!-- 添加 -->
        <Button type="ghost" icon="plus" @click="addFirst">{{$t('pqc.add')}}</Button>
        <!-- 修改 -->
        <Button style="margin:0 8px;" type="ghost" icon="edit" @click="editFirst" :disabled="tableEditDis">{{$t('pqc.modify')}}</Button>
        <Poptip
          confirm
          :title="i18n.t('quality.dsi')"
          placement="bottom-start"
          :ok-text='i18n.t("quality.confirm")'
          :cancel-text='i18n.t("quality.cancel")'
          @on-ok="deleteTableSelected">
          <Button type="ghost" icon="trash-a"  v-if="permsBtn.DELETE_FIRST_RECORD" :disabled="!table.selected">{{$t('pqc.delete')}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="reset">{{$t('pqc.refresh')}}</Button>
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table class="tableCustom" ref="pageTable"  @on-row-dblclick="onDBClick"  highlight-row v-drag-table-column="table.columns"  @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
            <div style="padding: 20px 0 20px 0px;">
              <Page id="pageId" v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
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
  import $ from "jquery";

  export default {
    props:['params'],
    components: {
      Input
    },
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        data:[
        ],
        tableEditDis:true,
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
            {
              type: 'selection',
              align: 'center',
              width:40,
              minWidth:40,
              maxWidth:40
            },
            {
              // title: "模板编号",
              title: i18n.t('pqc.templateID'),
              width: 130,
              minWidth: 130,
              ellipsis:true,
              key: 'templateNumber',
            },
            {
              // title:"模板名称",
              title:i18n.t('pqc.templateName'),
              width:230,
              minWidth:230,
              ellipsis:true,
              key:'templateName',
            },
            {
              title: i18n.t("pqc.createTime"),
              width: 180,
              minWidth:180,
              ellipsis:true,
              key: 'createTime',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = "-"
                if(value){
                  var unixTimestamp = new Date(value);
                  str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                }
                return h("span",str);
              }
            },
            {
              // title: "操作人",
              title: i18n.t("pqc.operator"),
              width: 200,
              minWidth:200,
              ellipsis:true,
              key: 'operatorName',
            },
            {
              title: i18n.t('pqc.remarks'),
              ellipsis:true,
              key: 'remarks',
            }
          ]
        },
        search: {
          dates:[],
          status:"",
          state:[
            {value:"",label:i18n.t('pqc.all')},
            {value:"4",label:i18n.t('pqc.emt')},
            {value:"1",label:i18n.t('pqc.unaudited')},
            {value:"2",label:i18n.t("pqc.auditPass")},
            {value:"3",label:i18n.t('pqc.auditReject')},
          ],
          result:'',
          results:[
            {value:"1",label:i18n.t('pqc.qualified')},
            {value:"0",label:i18n.t('pqc.unqualified')},
          ],
          query: "",
          userList:[],
          fieldName: "",
          data: {
            searchTypes: [
              /* {label: "模板编号",value: "试试"},
              {label: "模板名称",value: "prodBatchNo"},
              {label: "操作人",value: "no"},
              {label: "备注",value: "productName"}, */
              {label: i18n.t('pqc.templateID'),value: "试试"},
              {label: i18n.t('pqc.templateName'),value: "prodBatchNo"},
              {label: i18n.t('pqc.operator'),value: "no"},
              {label: i18n.t("pqc.remarks"),value: "productName"},
            ]
          }
        },
        arrangement:{
          state:false,
          data:[],
          data1:[],
        },
        index:1,
        dataList:[],
        permsCur:[
          "EXPORT_FIRST_RECORD",
          "UPDATE_FIRST_RECORD",
          "SELECT_FIRST_RECORD",
          "INSERT_FIRST_RECORD",
          "DELETE_FIRST_RECORD",
          "AUDIT_FIRST_RECORD",
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "EXPORT_FIRST_RECORD":false,
          "UPDATE_FIRST_RECORD":false,
          "SELECT_FIRST_RECORD":false,
          "INSERT_FIRST_RECORD":false,
          "DELETE_FIRST_RECORD":false,
          "AUDIT_FIRST_RECORD":false,
        },

      }
    },//end data

    created(){
      this.refreshData();
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
    },
    methods:{
      // 重置
      reset(){
        this.search.dates=[];
        this.search.status='';
        this.search.result='';
        this.search.fieldName='';
        this.search.query='';
        this.refreshData(1);
        this.pageChange(1)
      },
      refreshData(){
        let that = this;
        that.table.loading = true;
        let params = {};
        let startDate = '';
        let endDate = '';
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        let customerId=this.$store.state.customerId||''
        if(this.search.dates && this.search.dates[0]){ // 操作日期過濾
          startDate = this.$iqis.utils.getDayStart(1,this.search.dates[0]);
          endDate = this.$iqis.utils.getDayEnd(this.search.dates[1]);
          params.query='startDate='+startDate+'&endDate='+endDate+'&state='+that.search.status+'&result='+that.search.result+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }
        else{
          params.query='state='+that.search.status+'&result='+that.search.result+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }

        this.$http.get("/inspectionTemplate/").then(function (resp){
          that.data=resp.data
        })
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
      // 添加新数据
      addFirst(){                                         //添加巡检表模板
        this.$emit("open-tab","qc-pqc-first-ad",i18n.t("pqc.AddTemplate"),"page-exam-pqc-inspectrecord-template-add",null);
      },
      // 修改项数据
      editFirst(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        console.log(selectedRow,"selectedRowselectedRowselectedRowselectedRow");
        
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t('pqc.yms'),
            desc: ''
          });
          return;
        }
        this.$emit("open-tab","qc-pqc-first-update-"+selectedRow[0].templateId,i18n.t('pqc.ModifyTemplate')+"-"+selectedRow[0].templateName,"page-exam-pqc-inspectrecord-template-add",{templateId:selectedRow[0].templateId});
      },
      /**双击打开 */
      onDBClick(obj,index){
        this.$emit("open-tab","qc-pqc-first-update-"+obj.templateId,i18n.t('pqc.ModifyTemplate')+'-'+obj.templateName,"page-exam-pqc-inspectrecord-template-add",{templateId:obj.templateId});

      },
      tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
      },
      // 点击OK回调的函数
      deleteTableSelected(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/inspectionTemplate/"+ss[i].templateId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('pqc.ds'));
              that.refreshData();
            });
          }
        }
      },
    }//end methods
  }

</script>