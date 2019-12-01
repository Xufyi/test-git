<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 210px; margin-right:8px;">
        <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('pqc.otf')" style="width: 200px"></DatePicker>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select v-model="search.type" :placeholder="i18n.t('pqc.cf')" clearable style="width: 100px;">
          <Option v-for="st in search.typeList" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select v-model="search.state" :placeholder="i18n.t('pqc.state')" clearable style="width: 100px;">
          <Option v-for="st in search.statusList" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" class="selectFontSize" :placeholder="i18n.t('pqc.sa')" slot="prepend" style="width: 110px;text-align:left;">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="table.selected='';refreshData()">{{$t('pqc.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t("pqc.reset")}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <Button type="ghost" v-if="permsBtn.INSERT_QUALITY_RECORD" icon="plus" @click="addPqc">{{$t("pqc.add")}}</Button>
        <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.UPDATE_QUALITY_RECORD" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t('pqc.modify')}}</Button>
        <Poptip
          confirm
          :title="i18n.t('quality.dsi')"
          placement="bottom-start"
          :ok-text='i18n.t("quality.confirm")'
          :cancel-text='i18n.t("quality.cancel")'
          @on-ok="deleteTableSelected">
          <Button v-if="permsBtn.DELETE_QUALITY_RECORD" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t('pqc.delete')}}</Button>
        </Poptip>
        <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.AUDIT_QUALITY_RECORD" @click="Toexamine" :disabled="!table.selected" icon="android-list">{{$t('pqc.review')}}</Button>
        <!-- <Button type="ghost" v-if="permsBtn.INSERT_PQC_ABNORMAL" @click="createAbnormal" :disabled="tableEditDis" icon="android-alert">发起异常</Button> -->
      </div>
      <!-- 后期可能用到 -->
      <div class="iqis-page-tool-second" style="font-size:0;">
        <Button type="text"  icon="refresh" @click="reset">{{$t('pqc.refresh')}}</Button>
        <!-- <Button type="primary" @click="rank">自定义列表</Button>
        <Dropdown style="margin-left: 8px" v-if="permsBtn.EXPORT_PQC">
          <Button type="ghost">导出报表<Icon style="margin-left:10px;" type="arrow-down-b"></Icon></Button>
          <DropdownMenu slot="list">
            <DropdownItem>
              <Button type="text" @click="exportStatement(1)">当页数据</Button>
            </DropdownItem>
            <DropdownItem>
              <Button type="text" @click="exportStatement(2)">检验报告</Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown> -->
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table class="tableCustom"  ref="pageTable" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display: inline-block;"> -->
            <div style="padding: 20px 0 20px 0px;">
                  <Page id="pageId" v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                      :page-size-opts="[10,20,50,100]"
                      @on-change="pageChange" @on-page-size-change="pageSizeChange"
                      size="small" show-total show-elevator show-sizer></Page>
            </div>
        </div>
      </div>

    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
    <div class="arrangement-dialog">
      <Modal
        :title="i18n.t('pqc.customList')"
        v-model="arrangement.state"
        class="rankBox"
        :mask-closable="false"
        :width="600" >
        <span class="list_txt">{{$t('pqc.select')}}</span>
        <div class="list_ok list">
          <div v-for="(item,index) in arrangement.data1" class="dataItem" :class="'check'+index"  :key="index" style="display:inline-block;padding:5px">
            <input type="checkbox"   :value="item"  v-model="arrangement.data" >
            <span >{{item.title}}</span>
          </div>
        </div>
        <span class="list_txt2">{{$t('pqc.tsl')}}</span>
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
          <Button type="primary" size="large" @click="ReplyOk" >{{$t("pqc.rdc")}}发</Button>
          <Button type="primary" size="large" @click="RankOk" >{{$t("pqc.confirm")}}发</Button>
          <Button type="text" size="large" @click="RankNo">{{$t("pqc.cancel")}}发</Button>
        </div>
      </Modal>
    </div>
    <div class="Toexamine">
      <Modal
        :title="i18n.t('pqc.review')"
        v-model="Audit.status"
        :mask-closable="false"
        :width="300" >
        <Select v-model="Audit.fieldName" style="width:200px">
          <Option v-for="(item,index) in Audit.statusList" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        <div slot="footer">
          <Button type="primary" size="large" @click="AuditOk" >{{$t("pqc.confirm")}}</Button>
          <Button type="text" size="large" @click="AuditNo">{{$t("pqc.cancel")}}</Button>
        </div>
      </Modal>
    </div>

  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import draggable from 'vuedraggable';
  import $ from "jquery";
  export default {
    components: {
      Input,
      draggable
    },
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        data:[
        ],
        tableEditDis:true,
        Audit:{//审核状态
          status:false,
          statusList:[
            {value:"2",label:i18n.t("pqc.verified")},
            {value:"3",label:i18n.t("pqc.rad")},
          ],
          fieldName:'2',
        },
        //排序
        arrangement:{
          state:false,
          data:[],
          data1:[],
        },
        urlProduct:{
          no:[],
          name:[],
          prodTypeName:[],
          cityList:[],
          prodTypeId:'',
          customerList:[],
          dataList:[],
          index:1
        },
        rankData:[
          {
            title: i18n.t('pqc.inspectTime'),
            className:'tablePadding',
            width: 106,
            minWidth:106,
            // align: 'center',
            ellipsis:true,
            key: 'pqcDate',
            render:function(h,data){
              let value = data.row[data.column.key];
              let str = "-"
              if(value){
                var unixTimestamp = new Date(value);
                str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
              }
              return h("span",str);
            }
          },{
            title: i18n.t('pqc.pl'),
            className:'tablePadding',
            width:103,
            minWidth:103,
            ellipsis:true,
            key: 'prodLineName'
          },{
            title: i18n.t("pqc.pn"),
            className:'tablePadding',
            width:103,
            minWidth:103,
            ellipsis:true,
            key: 'productNo'
          },{
            title: i18n.t('pqc.name'),
            className:'tablePadding',
            width:103,
            minWidth:103,
            ellipsis:true,
            key: 'productName'
          },{
            title: i18n.t('pqc.specifications'),
            className:'tablePadding',
            width:120,
            minWidth:120,
            ellipsis:true,
            key: 'productSpec'
          },{
            title: i18n.t("pqc.unit"),
            className:'tablePadding',
            align:'center',
            minWidth:30,
            ellipsis:true,
            key: 'prodUnitName'
          },{
            title: i18n.t("pqc.pp"),
            className:'tablePadding',
            width:80,
            minWidth:80,
            ellipsis:true,
            key: 'prodProcessName'
          },{
            title: i18n.t("pqc.result"),
            className:'tablePadding',
            minWidth:70,
            ellipsis:true,
            key: 'type',
            render:(h,params)=>{
              return h('span',{style:{'color':params.row.type == 1 ? 'green' : 'red'}},params.row.type == 1 ? i18n.t("pqc.qualified") : i18n.t("pqc.unqualified"))
            }
          },{
            title: i18n.t("pqc.il"),
            className:'tablePadding',
            width:76,
            minWidth:76,
            ellipsis:true,
            key: 'batchQuantity'
          },{
            title: i18n.t("pqc.actualSampling"),
            className:'tablePadding',
            width:86,
            minWidth:86,
            ellipsis:true,
            key: 'sampleQuantity'
          },{
            title: i18n.t("pqc.badNumber"),
            className:'tablePadding',
            width:66,
            minWidth:66,
            ellipsis:true,
            key: 'badQuantity'
          },{
            title: i18n.t('pqc.defectRate')+'(%)',
            className:'tablePadding',
            width:81,
            minWidth:81,
            ellipsis:true,
            key: 'badRate'
          },{
            title: i18n.t("pqc.state"),
            className:'tablePadding',
            minWidth:54,
            ellipsis:true,
            key: 'state',
            // render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{1:"待审核",0:"检验中",2:"审核通过",3:"审核驳回"})
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{4:i18n.t("pqc.emt"),1:i18n.t('pqc.unaudited'),2:"<span style='color:green;'>"+i18n.t("pqc.auditPass")+"</span>",3:"<span style='color:red;'>"+i18n.t('pqc.auditReject')+"</span>"})
            //状态有：0检验中（没有提交审审核）、2审核通过（通过审核按钮由有相应权限人员操作），3审核驳回（当审核不通过时，可重新点审核改变审核结果，也可以再次编辑后提交，状态变为待审核，重新审核） ,
          },{
            title: i18n.t("pqc.ln"),
            className:'tablePadding',
            width:80,
            minWidth:80,
            ellipsis:true,
            key: 'batchNo'
          },{
            title: i18n.t('pqc.iqcNo'),
            className:'tablePadding',
            width:103,
            minWidth:103,
            ellipsis:true,
            key: 'pqcNo'
          },{
            title: i18n.t('pqc.inspector'),
            className:'tablePadding',
            width:60,
            minWidth:60,
            ellipsis:true,
            key: 'inspectorName'
          },
          
          {
            title: i18n.t('pqc.auditor'),
            className:'tablePadding',
            width:60,
            minWidth:60,
            ellipsis:true,
            key: 'auditorName'
          },{
            title: i18n.t("pqc.pc"),
            className:'tablePadding',
            width:80,
            minWidth:80,
            ellipsis:true,
            key: 'prodTypeName'
          },{
            title: i18n.t('pqc.ac'),
            className:'tablePadding',
            width:80,
            minWidth:80,
            ellipsis:true,
            key: 'customerName'
          },{
            title: i18n.t('pqc.workTime'),
            className:'tablePadding',
            width:60,
            minWidth:60,
            ellipsis:true,
            key: 'chkShiftName'
          },
        ],
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
              className:this.$store.state.customerId?'hide':'',
              minWidth:this.$store.state.customerId?0:40,
              maxWidth:this.$store.state.customerId?0:40
            },
            {
              title: i18n.t('pqc.time'),
              className:'tablePadding',
              width: 90,
              minWidth:90,
              // align: 'center',
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
            },{
              title: i18n.t("pqc.cf"),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'type',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t("pqc.pi"),1:i18n.t('pqc.ei'),2:i18n.t('pqc.oc')})
            },{
              title: i18n.t('pqc.pn'),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'no',
              // render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{null:"======="})
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = ""
                if(!value){
                  str = "--";
                }else{
                  str = value
                }
                return h("span",str);
              }
              
            },{
              title: i18n.t('pqc.name'),
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'productName',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = ""
                if(!value){
                  str = "--";
                }else{
                  str = value
                }
                return h("span",str);
              }
            },{
              title: i18n.t('pqc.specifications'),
              className:'tablePadding',
              align:'center',
              minWidth:this.$store.state.locale=='zh_CN'?60:100,
              ellipsis:true,
              key: 'spec',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = ""
                if(!value){
                  str = "--";
                }else{
                  str = value
                }
                return h("span",str);
              }
              
            },{
              title: i18n.t('pqc.pl'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?80:110,
              minWidth:this.$store.state.locale=='zh_CN'?80:110,
              ellipsis:true,
              key: 'prodLineName',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = ""
                if(!value){
                  str = "--";
                }else{
                  str = value
                }
                return h("span",str);
              }
            },{
              title: i18n.t("pqc.wp"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:130,
              ellipsis:true,
              key: 'prodProcessName',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = ""
                if(!value){
                  str = "--";
                }else{
                  str = value
                }
                return h("span",str);
              }
              /* render:(h,params)=>{
                return h('span',{style:{'color':params.row.type == 1 ? 'green' : 'red'}},params.row.type == 1 ? '合格' : '不合格')
              } */
            },{
              title: i18n.t('pqc.en'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?76:130,
              minWidth:this.$store.state.locale=='zh_CN'?76:130,
              ellipsis:true,
              key: 'chkdevNo',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = ""
                if(!value){
                  str = "--";
                }else{
                  str = value
                }
                return h("span",str);
              }
            },{
              title: i18n.t('pqc.deviceName'),
              className:'tablePadding',
              width:86,
              minWidth:86,
              ellipsis:true,
              key: 'chkdevName',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = ""
                if(!value){
                  str = "--";
                }else{
                  str = value
                }
                return h("span",str);
              }
            },{
              title: i18n.t('pqc.inspector'),
              className:'tablePadding',
              width:66,
              minWidth:66,
              ellipsis:true,
              key: 'inspectorName'
            },{
              title: i18n.t('pqc.state'),
              className:'tablePadding',
              width:81,
              minWidth:81,
              ellipsis:true,
              key: 'state',
              // render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{4:"检查中",1:"待审核",2:"<span style='color:green;'>审核通过</span>",3:"<span style='color:red;'>审核驳回</span>"})
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{4:i18n.t('pqc.emt'),1:i18n.t("pqc.unaudited"),2:i18n.t("pqc.auditPass"),3:"<span style='color:red;'>"+i18n.t('pqc.auditReject')+"</span>"})

            },{
              title: i18n.t('pqc.auditor'),
              className:'tablePadding',
              minWidth:70,
              ellipsis:true,
              key: 'auditorName',
              /* render:function(h,data){
                let value = data.row[data.column.key];
                let str = ""
                if(!value){
                  str = "--";
                }else{
                  str = value
                }
                return h("span",str);
              } */
              // render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{1:"待审核",0:"检验中",2:"审核通过",3:"审核驳回"})
              // render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:"检验中",1:"待审核",2:"<span style='color:green;'>审核通过</span>",3:"<span style='color:red;'>审核驳回</span>"})

              //状态有：0检验中（没有提交审审核）、2审核通过（通过审核按钮由有相应权限人员操作），3审核驳回（当审核不通过时，可重新点审核改变审核结果，也可以再次编辑后提交，状态变为待审核，重新审核） ,
            },{
              title: i18n.t('pqc.fjx'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'extInfoNum'
            }/* ,{
              title: '检验单号',
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'pqcNo'
            },{
              title: '检验员',
              className:'tablePadding',
              width:60,
              minWidth:60,
              ellipsis:true,
              key: 'inspectorName'
            },{
              title: '审核人',
              className:'tablePadding',
              width:60,
              minWidth:60,
              ellipsis:true,
              key: 'auditorName'
            } */
          ]
        },
        search: {
          query: "",
          fieldName: "",
          type:"",
          state:"",
          dates:[],
          userList:[],
          typeList:[
            {value:"",label:i18n.t("pqc.all")},
            {value:"0",label:i18n.t('pqc.pi')},
            {value:"1",label:i18n.t("pqc.ei")},
            {value:"2",label:i18n.t('pqc.oc')}
          ],
          statusList:[
            {value:"",label:i18n.t("pqc.all")},
            {value:"4",label:i18n.t('pqc.inspecting')},
            {value:"1",label:i18n.t('pqc.unaudited')},
            {value:"2",label:i18n.t("pqc.auditPass")},
            {value:"3",label:i18n.t('pqc.auditReject')}
          ],
          data: {
            searchTypes: [
              {
                label: i18n.t("pqc.sa"),
                value: ""
              },{
                label: i18n.t('pqc.pn'),
                value: "no"
              },  {
                label: i18n.t("pqc.name"),
                value: "productName"
              }, {
                label: i18n.t('pqc.specifications'),
                value: "spec"
              }, {
                label: i18n.t("pqc.pl"),
                value: "prodLineName"
              }, {
                label: i18n.t('pqc.wp'),
                value: "prodProcessName"
              }, {
                label: i18n.t('pqc.en'),
                value: "chkdevNo"
              }, {
                label: i18n.t('pqc.deviceName'),
                value: "chkdevName"
              }, {
                label: i18n.t('pqc.inspector'),
                value: "inspectorName"
              }, /* {
                label: "状态",
                value: "state"
              },  */{
                label: i18n.t("pqc.auditor"),
                value: "auditorName"
              }
            ]
          }
        },
        // permsCur:[
        //   "UPDATE_PQC",
        //   "SELECT_PQC",
        //   "INSERT_PQC",
        //   "DELETE_PQC",
        //   "AUDIT_PQC",
        //   "EXPORT_PQC",
        //   "INSERT_PQC_ABNORMAL"
        // ],//当前页面需要的权限名称
        // permsBtn:{//控制每个权限对应按钮的禁用状态
        //   "INSERT_PQC":false,
        //   "SELECT_PQC":false,
        //   "UPDATE_PQC":false,
        //   "DELETE_PQC":false,
        //   "AUDIT_PQC":false,
        //   "EXPORT_PQC":false,
        //   "INSERT_PQC_ABNORMAL":false
        // },
        permsCur:[
          "INSERT_QUALITY_RECORD",
          "SELECT_QUALITY_RECORD",
          "UPDATE_QUALITY_RECORD",
          "DELETE_QUALITY_RECORD",
          "AUDIT_QUALITY_RECORD",
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          /* "EXPORT_FIRST_RECORD":false,
          "UPDATE_FIRST_RECORD":false,
          "SELECT_FIRST_RECORD":false,
          "INSERT_FIRST_RECORD":false,
          "DELETE_FIRST_RECORD":false,
          "AUDIT_FIRST_RECORD":false, */

          "INSERT_QUALITY_RECORD":false,
          "SELECT_QUALITY_RECORD":false,
          "UPDATE_QUALITY_RECORD":false,
          "DELETE_QUALITY_RECORD":false,
          "AUDIT_QUALITY_RECORD":false,        },
      }
    },//end data
    watch:{
      renderList:function(a,b){
        if(a){
          this.reset();
        }
      }
    },
    created(){
      this.refreshData();
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      // this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
    },
    computed:{
      renderList (){
        return this.$store.state.renderExamList;
      }
    },

    methods:{
      createAbnormal(){
        let selectedRow = this.$refs.pageTable.getSelection()
      },

      /* createAbnormal(){
        let that= this;
        let selectedRow = that.$refs.pageTable.getSelection()
        // //console.log(selectedRow,'当前行')
        if(selectedRow[0].state==0||selectedRow[0].state==3){
          that.$Notice.warning({title:'检验中或审核驳回不能发起异常'})
          return;
        }
        if(selectedRow[0].type==1){
          that.$Notice.warning({title:' 检验结果合格不能发起异常'})
          return;
        }
        that.$http.get("/examinecenter/pqc/abnormal",{page:1,limit:999999}).then(function (resp){
          for(let i in resp.data){
            if(resp.data[i].qcNo==selectedRow[0].pqcNo){
              that.$Notice.warning({title:'该检验单已发起异常'})
              return;
            }
          }
          that.$emit("open-tab","exam-pqc-abnormal-add","添加过程异常","page-exam-pqc-abnormal-add",{qcNo:selectedRow[0].pqcNo});
        })
      }, */

      reset(){
        this.search.dates=[];
        this.table.selected='';
        this.search.type='';
        this.search.state='';
        this.search.query='';
        this.search.fieldName='';
        this.refreshData();
        this.pageChange(1)
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
      //评审
      Toexamine(){
        let that=this;
        let reviewList=this.$refs.pageTable.getSelection()
        if(reviewList.length==0){
          this.$Notice.warning({
            title: i18n.t("pqc.psa"),
            desc: ''
          });
          return;
        }else{
          that.Audit.status=true;
        }
      },
      /**
       * 导出报表
       * index 为 1 时为导出当前条件列表
       * index 为 2 时为导出检验报告
       */
      exportStatement (index){
        //console.log(index,'index');
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        if(index == 1){
          url = '/examinecenter/pqc/pqc/export/list';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          params.query = this.search.query;
          params.fieldName = this.search.fieldName;
          params.type = this.search.type;
          params.state = this.search.state;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            params.startDate = this.$iqis.utils.getDayStart(1,sdate);
            params.endDate = this.$iqis.utils.getDayEnd(edate);
          }
        }
        if(index == 2){
          url = '/examinecenter/pqc/pqc/export/report'
          let reviewList=this.$refs.pageTable.getSelection()
          if( reviewList.length != 1){
            this.$Notice.warning({
              title: i18n.t('pqc.sap'),
            });
            return;
          }
          params.pqcId = reviewList[0].pqcId
        }

        this.$iqis.download(url,params,methods,()=>{}) //下载文件
      },
      AuditOk(){
        let that=this;
        // let url='/examinecenter/pqc/pqc/audit?pqcId='
        let url='/examinecenter/pqc/qualityrecord/audit?qualityRecordId='
        
        let AuditRwo=this.$refs.pageTable.getSelection()
        let AuditList=[];
        //console.log(AuditRwo);
        for(let i=0;i<AuditRwo.length;i++) {
          if (AuditRwo[i].state == 4) {
            this.$Notice.warning({
              title: i18n.t('pqc.tsd'),
              desc: ''
            });
            return;
          }
        }
        for(let i=0;i<AuditRwo.length;i++) {
          that.$http.post(url+AuditRwo[i].qualityRecordId+"&state="+that.Audit.fieldName,that.headers).then((res)=>{
            that.$Message.success(i18n.t('pqc.auditSuccess'));
            that.Audit.status=false;
            that.refreshData();
          })
        }
      },
      AuditNo(){
        let that=this
        that.Audit.status=false;
      },
      addPqc(){
        this.$emit("open-tab","exam-pqc-qr-add",i18n.t("pqc.aqr"),"page-exam-pqc-qr-add",null);
      },
      editSelectRow(e){
         let selectedRow = this.$refs.pageTable.getSelection();
         //console.log(selectedRow);
        //  return false;
         if(!selectedRow || selectedRow.length != 1){
           this.$Notice.warning({
             title: i18n.t('pqc.yms'),
             desc: ''
           });
           return;
         }
        if(selectedRow[0].productName == null && selectedRow[0].chkdevName != null){
          this.$emit("open-tab","exam-pqc-qr-"+selectedRow[0].qualityRecordId,i18n.t('pqc.eqr')+"-"+selectedRow[0].chkdevName,"page-exam-pqc-qr-add",{qualityRecordId:selectedRow[0].qualityRecordId});
        }else if(selectedRow[0].chkdevName == null && selectedRow[0].productName != null){
          this.$emit("open-tab","exam-pqc-qr-"+selectedRow[0].qualityRecordId,i18n.t('pqc.eqr')+"-"+selectedRow[0].productName,"page-exam-pqc-qr-add",{qualityRecordId:selectedRow[0].qualityRecordId});
        }else if(selectedRow[0].productName == null && selectedRow[0].chkdevName == null){
          this.$emit("open-tab","exam-pqc-qr-"+selectedRow[0].qualityRecordId,i18n.t('pqc.eqr'),"page-exam-pqc-qr-add",{qualityRecordId:selectedRow[0].qualityRecordId});

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
             delArr.push(this.$http.delete("/examinecenter/pqc/qualityrecord/"+ss[i].qualityRecordId));
           }

           if(delArr.length > 0){
             this.$http.all(delArr).then(function (resps) {
               that.$Message.success(i18n.t("pqc.ds"));
               that.refreshData();
             });
           }
         }

      },
      loadEditData(){
        this.editModal.dataLoading = true;

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
        that.table.selected='';

        that.table.loading = true;

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
        params.customerId = this.$store.state.customerId||'';
        // params.fieldName = this.search.fieldName;
        // params.type = this.search.type;
        // params.state = this.search.state;

        let startDate = '';
        let endDate = '';
        let customerId=this.$store.state.customerId||''
        if(this.search.dates && this.search.dates[0]){
          startDate = this.$iqis.utils.getDayStart(1,this.search.dates[0]);
          endDate = this.$iqis.utils.getDayEnd(this.search.dates[1]);
          params.query='startDate='+startDate+'&endDate='+endDate+'&type='+that.search.type+'&state='+that.search.state+'&field='+that.search.fieldName+'&keyword='+that.search.query+'&customerId='+customerId;
        }else{
          params.query='type='+that.search.type+'&state='+that.search.state+'&field='+that.search.fieldName+'&keyword='+that.search.query+'&customerId='+customerId;
        }

        // this.$http.get("/examinecenter/pqc/pqc",{params:params}).then(function (resp) {
        this.$http.get("/examinecenter/pqc/qualityrecord",{params:params}).then(function (resp) {
          
          for(let i=0;i<resp.data.length;i++){
            resp.data[i]._checked = false;
          }
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
        })
        this.$store.commit("RENDER_CHANGE",false);
      },
      onCClick(obj,index){
        // //console.log(obj)
        this.data[index]._checked = !this.data[index]._checked;
      },
      /**双击打开 */
      onDBClick(obj,index){
        //console.log(obj,888);
        
         this.$emit("open-tab","exam-pqc-qr-"+obj.qualityRecordId,i18n.t('pqc.eqr')+"-"+obj.productName,"page-exam-pqc-qr-add",{qualityRecordId:obj.qualityRecordId});
         
      },
      //自定义排序
      rank(){
        let that=this;
        if(that.urlProduct.index===1){
          that.defaultData()
        }else{
          that.arrangement.data=that.arrangement.data;
        }
        that.arrangement.data1=that.rankData;
        that.arrangement.state=true;
      },
      ReplyOk(){
        this.defaultData()
      },
      //默认排序
      defaultData(){
        let that=this;
        that.urlProduct.index=1;
        that.urlProduct.dataList=that.rankData.concat();
        that.urlProduct.dataList.splice(-3,3)
        that.arrangement.data=that.urlProduct.dataList;
      },
      //排序确定
      RankOk(){
        if(this.arrangement.data.length===0){
          this.$Notice.warning({
            title: i18n.t('pqc.lcrs'),
            desc: ''
          });
          return;
        }
        let data=[{type: 'selection',align: 'center',width:40,minWidth:40,maxWidth:40}]
        let dataList=data.concat(this.arrangement.data)
        this.table.columns=dataList;
        this.urlProduct.index=2;
        this.arrangement.state=false;
      },
      // 默认数据显示
      RankNo(){
        this.arrangement.state=false;
      }



    }//end methods




  }

</script>
<style>

</style>

