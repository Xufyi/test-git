<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 210px;">
        <DatePicker type="daterange" v-model="search.dates" :placeholder="i18n.t('pqc.otf')" style="width: 200px;margin-right:10px"></DatePicker>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select v-model="search.treatmentMethod" :placeholder="i18n.t('pqc.treatmentMethod')" clearable style="width: 100px;">
          <Option v-for="st in search.optList" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select v-model="search.abnormalState" :placeholder="i18n.t('pqc.state')" clearable style="width: 100px;">
          <Option v-for="st in search.stateList" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 110px;">
        <Select v-model="search.isFatal" :placeholder="i18n.t('pqc.majorAnomaly')" clearable style="width: 100px;">
          <Option v-for="st in search.isFatals" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model.trim="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('pqc.sa')" slot="prepend" style="width: 110px;text-align:left;">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px" type="primary" @click="table.selected='';refreshData()">{{$t("pqc.search")}}</Button>
        <Button type="ghost" @click="reset">{{$t("pqc.reset")}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <!--<Button type="ghost" icon="refresh" @click="refreshData">刷新</Button>-->
        <Button type="ghost" v-if="permsBtn.INSERT_PQC_ABNORMAL" icon="plus" @click="addIqc">{{$t("pqc.add")}}</Button>
        <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.UPDATE_PQC_ABNORMAL" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t("pqc.modify")}}</Button>
        <Poptip
          confirm
          :title="i18n.t('pqc.dsi')"
          placement="bottom-start"
          :ok-text='i18n.t("pqc.confirm")'
          :cancel-text='i18n.t("pqc.cancel")'
          @on-ok="deleteTableSelected">
          <Button v-if="permsBtn.DELETE_PQC_ABNORMAL" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t("pqc.delete")}}</Button>
        </Poptip>

      </div>
      <div class="iqis-page-tool-second" style="font-size:0;">
        <Button type="text"  icon="refresh" @click="reset">{{$t("pqc.refresh")}}</Button>
        <Button type="primary" @click="rank">{{$t("pqc.customList")}}</Button>
        <Dropdown style="margin-left: 10px" v-if="permsBtn.EXPORT_PQC_ABNORMAL">
          <Button type="ghost">{{$t("pqc.exportReport")}}<Icon style="margin-left:8px;" type="arrow-down-b"></Icon></Button>
          <DropdownMenu slot="list">
            <DropdownItem>
              <Button type="text" @click="exportStatement(1)">{{$t("pqc.pageData")}}</Button>
            </DropdownItem>
            <DropdownItem>
              <Button type="text" @click="exportStatement(3)">{{$t("pqc.allTheData")}}</Button>
            </DropdownItem>
            <DropdownItem>
              <Button type="text" @click="exportStatement(2)">{{$t("pqc.abnReport")}}</Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table class="tableCustom" ref="pageTable"  @on-row-dblclick="onDBClick"  v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <div style="padding: 20px 0 20px 0px;">
            <Page v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                  :page-size-opts="[10,20,50,100]"
                  @on-change="pageChange" @on-page-size-change="pageSizeChange"
                  size="small" show-total show-elevator show-sizer></Page>
          </div>

        </div>
      </div>
    </div>
    <div class="arrangement-dialog">
      <Modal
        v-model="arrangement.state"
        :title="i18n.t('pqc.customList')"
        class="rankBox"
        :mask-closable="false"
        :width="600" >
        <span class="list_txt">{{$t("pqc.select")}}</span>
        <div class="list_ok list">
          <div v-for="(item,index) in arrangement.data1" class="dataItem" :class="'check'+index"  :key="index">
            <input type="checkbox"  :value="item"  v-model="arrangement.data" >
            <span >{{item.title}}</span>
          </div>
        </div>
        <span class="list_txt2">{{$t("pqc.tsl")}}</span>
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
          <Button type="primary" size="large" @click="ReplyOk" >{{$t("pqc.rdc")}}</Button>
          <Button type="primary" size="large" @click="RankOk" >{{$t("pqc.confirm")}}</Button>
          <Button type="text" size="large" @click="RankNo">{{$t("pqc.cancel")}}</Button>
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
          <Option v-for="(item,index) in Audit.resultStats" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        <div slot="footer">
          <Button type="primary" size="large" @click="AuditOk" >{{$t("pqc.confirm")}}</Button>
          <Button type="text" size="large" @click="AuditNo">{{$t("pqc.cancel")}}</Button>
        </div>
      </Modal>
    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->

  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import draggable from 'vuedraggable';
  import $ from 'jquery'
  export default {
    // props:['params'],
    components: {
      Input,draggable
    },
    props:["params","tabKey"],
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        data:[],
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
              className:this.$store.state.customerId?'hide':'',
              minWidth:this.$store.state.customerId?0:40,
              maxWidth:this.$store.state.customerId?0:40
            },
            {
              title: i18n.t("pqc.occurrenceTime"),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?106:120,
              minWidth:this.$store.state.locale=='zh_CN'?106:120,
              // align: 'center',
              ellipsis:true,
              // key: 'abnormalDate',
              key: 'auditTime',
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
              title: i18n.t("pqc.pn"),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'productNo'
            },{
              title: i18n.t("pqc.name"),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'productName'
            },{
              title: i18n.t("pqc.il"),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?80:100,
              minWidth:this.$store.state.locale=='zh_CN'?80:100,
              ellipsis:true,
              key: 'batchQuantity',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t("pqc.treatmentMethod"),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:130,
              ellipsis:true,
              key: 'treatmentMethod',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{"REJECT":i18n.t("pqc.rg"),"REWORK":i18n.t("pqc.rework"),"SCREEN":i18n.t("pqc.filtrate"),"EMERGENCY_RELEASE":i18n.t("pqc.er"),"SCRAP":i18n.t('pqc.scrap'),"SPECIAL_ADOPTION":i18n.t("pqc.speclelAdoption")})
            },{
              title: i18n.t("pqc.place"),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'abnormalPlace',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('pqc.majorAnomaly'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:100,
              ellipsis:true,
              key: 'isFatal',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{1:i18n.t("pqc.yes"),0:i18n.t("pqc.not")})
            },{
              title: i18n.t("pqc.state"),
              className:'tablePadding',
              minWidth:64,
              ellipsis:true,
              key: 'abnormalState',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t("pqc.unsubmit"),1:i18n.t("pqc.unaudited"),5:i18n.t("pqc.treating"),3:"<span style='color:red;'>"+i18n.t("pqc.auditReject")+"</span>",8:i18n.t("pqc.notClosed"),9:i18n.t("pqc.closed")})
            },{
              title: i18n.t("pqc.mainDefect"),
              className:'tablePadding',
              width:170,
              minWidth:170,
              // width:80,
              ellipsis:true,
              key: 'majorDefect'
            },{
              title: i18n.t("pqc.abnTheme"),
              className:'tablePadding',
              // width:80,
              width:150,
              minWidth:150,
              ellipsis:true,
              key: 'subject'
            },{
              title: i18n.t("pqc.initiator"),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'creatorName'
            },{
              title: i18n.t("pqc.abnNo"),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?103:120,
              minWidth:this.$store.state.locale=='zh_CN'?103:120,
              ellipsis:true,
              key: 'abnormalNo',
              //render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:"<span style='color:red;'>不合格</span>",1:"<span style='color:green;'>合格</span>"})
            },{
              title: i18n.t("pqc.iqcNo"),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?103:120,
              minWidth:this.$store.state.locale=='zh_CN'?103:120,
              ellipsis:true,
              key: 'qcNo'
            }
          ]
        },
        Audit:{//审核状态
          status:false,
          resultStats:[
            {value:"2",label:i18n.t("pqc.auditPass")},
            {value:"3",label:i18n.t("pqc.auditReject")},
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
            title: i18n.t("pqc.occurrenceTime"),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?106:130,
            minWidth:this.$store.state.locale=='zh_CN'?106:130,
            // align: 'center',
            ellipsis:true,
            // key: 'abnormalDate',
            key:"auditTime",
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
            title: i18n.t("pqc.pn"),
            className:'tablePadding',
            width:103,
            minWidth:103,
            ellipsis:true,
            key: 'productNo'
          },{
            title: i18n.t("pqc.name"),
            width:103,
            minWidth:103,
            ellipsis:true,
            key: 'productName'
          },{
            title: i18n.t("pqc.il"),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?61:120,
            minWidth:this.$store.state.locale=='zh_CN'?61:120,
            ellipsis:true,
            key: 'batchQuantity',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },{
            title: i18n.t("pqc.treatmentMethod"),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?76:140,
            ellipsis:true,
            key: 'treatmentMethod',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{"REJECT":i18n.t("pqc.rg"),"REWORK":i18n.t("pqc.rework"),"SCREEN":i18n.t("pqc.filtrate"),"EMERGENCY_RELEASE":i18n.t("pqc.er"),"SCRAP":i18n.t('pqc.scrap'),"SPECIAL_ADOPTION":i18n.t("pqc.speclelAdoption")})
          },{
            title: i18n.t("pqc.place"),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?80:130,
            minWidth:this.$store.state.locale=='zh_CN'?80:130,
            ellipsis:true,
            key: 'abnormalPlace',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },{
            title: i18n.t('pqc.majorAnomaly'),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?80:130,
            ellipsis:true,
            key: 'isFatal',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{1:i18n.t("pqc.yes"),0:i18n.t("pqc.not")})
          },{
            title: i18n.t("pqc.state"),
            className:'tablePadding',
            minWidth:64,
            ellipsis:true,
            key: 'abnormalState',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t("pqc.unsubmit"),1:i18n.t("pqc.unaudited"),5:i18n.t("pqc.treating"),3:"<span style='color:red;'>"+i18n.t("pqc.auditReject")+"</span>",8:i18n.t("pqc.notClosed"),9:i18n.t("pqc.closed")})
          },{
            title: i18n.t("pqc.mainDefect"),
            className:'tablePadding',
            width:170,
            minWidth:170,
            // width:80,
            ellipsis:true,
            key: 'majorDefect'
          },{
            title: i18n.t("pqc.abnTheme"),
            className:'tablePadding',
            // width:80,
            width:150,
            minWidth:150,
            ellipsis:true,
            key: 'subject'
          },{
            title: i18n.t("pqc.initiator"),
            className:'tablePadding',
            width:80,
            minWidth:80,
            ellipsis:true,
            key: 'creatorName'
          },{
            title: i18n.t("pqc.abnNo"),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?103:130,
            minWidth:this.$store.state.locale=='zh_CN'?103:130,
            ellipsis:true,
            key: 'abnormalNo',
            //render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:"<span style='color:red;'>不合格</span>",1:"<span style='color:green;'>合格</span>"})
          },{
            title: i18n.t("pqc.abnNo"),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?103:130,
            minWidth:this.$store.state.locale=='zh_CN'?103:130,
            ellipsis:true,
            key: 'qcNo'
          },

          {
            title: i18n.t("pqc.specifications"),
            className:'tablePadding',
            width:103,
            minWidth:103,
            ellipsis:true,
            key: 'productSpec'
          },{
            title: i18n.t("pqc.pc"),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?80:150,
            minWidth:this.$store.state.locale=='zh_CN'?80:150,
            ellipsis:true,
            key: 'productTypeName'
          },{
            title: i18n.t("pqc.unit"),
            className:'tablePadding',
            width:66,
            minWidth:66,
            ellipsis:true,
            key: 'productUnitName'
          },{
            title: i18n.t('pqc.belongSupplier'),
            className:'tablePadding',
            width:65,
            minWidth:65,
            ellipsis:true,
            key: 'supplierName'
          },{
            title: i18n.t("pqc.ac"),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?60:150,
            minWidth:this.$store.state.locale=='zh_CN'?60:150,
            ellipsis:true,
            key: 'customerName'
          },{
            title: i18n.t("pqc.ln"),
            className:'tablePadding',
            width:103,
            minWidth:103,
            ellipsis:true,
            key: 'batchNo'
          },{
            title: i18n.t("pqc.qcNum"),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?61:140,
            minWidth:this.$store.state.locale=='zh_CN'?61:140,
            ellipsis:true,
            key: 'inspectionQuantity'
          },{
            title: i18n.t('pqc.badNumber'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?61:140,
            minWidth:this.$store.state.locale=='zh_CN'?61:140,
            ellipsis:true,
            key: 'badQuantity'
          },{
            title: i18n.t('pqc.defectRate')+'%',
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?76:100,
            minWidth:this.$store.state.locale=='zh_CN'?76:100,
            ellipsis:true,
            key: 'batchNo',
            render:(h,params)=>{
              // return h('span',params.row['badRate']=(params.row.badQuantity/params.row.inspectionQuantity*100).toFixed(2))
              return h('span',params.row['badRate']=((params.row.badQuantity/params.row.inspectionQuantity*100) > 100 ? 100 : Math.floor(params.row.badQuantity/params.row.inspectionQuantity*10000) / 100))
            }
          },{
            title: i18n.t('pqc.treatmentLimit'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?70:150,
            minWidth:this.$store.state.locale=='zh_CN'?70:150,
            ellipsis:true,
            key: 'treatmentTimeLimit'
          }
        ],
        search: {
          query: "",
          fieldName: "",
          result:"",
          status:"",
          userList:[],
          abnormalState:'',
          isFatal:'',
          treatmentMethod:'',
          isFatals:[
            {value:"",label:i18n.t("pqc.all")},
            {value:"1",label:i18n.t("pqc.yes")},
            {value:"0",label:i18n.t("pqc.not")}
          ],
          optList:[
            {value:"",label:i18n.t("pqc.all")},
            {value:"REJECT",label:i18n.t("pqc.rg")},
            {value:"REWORK",label:i18n.t('pqc.rework')},
            {value:"SCREEN",label:i18n.t("pqc.filtrate")},
            {value:"SPECIAL_ADOPTION",label:i18n.t("pqc.speclelAdoption")},
            {value:"EMERGENCY_RELEASE",label:i18n.t("pqc.er")},
            {value:"SCRAP",label:i18n.t('pqc.scrap')},
          ],
          stateList:[
            {value:'',label:i18n.t("pqc.all")},
            {value:0,label:i18n.t("pqc.unsubmit")},
            {value:1,label:i18n.t("pqc.unaudited")},
            {value:5,label:i18n.t("pqc.treating")},
            {value:3,label:i18n.t("pqc.auditReject")},
            {value:8,label:i18n.t("pqc.notClosed")},
            {value:9,label:i18n.t("pqc.closed")},

          ],
          data: {
            searchTypes: [
              {label: i18n.t("pqc.sa"),value: ""},
              {label: i18n.t("pqc.pn"),value: "productNo"},
              {label: i18n.t("pqc.name"),value: "productName"},
              {label: i18n.t("pqc.specifications"),value: "productSpec"},
              {label: i18n.t("pqc.pc"),value: "prodTypeName"},
              {label: i18n.t("pqc.productUnit"),value: "productUnitName"},
              {label: i18n.t('pqc.supplier'),value: "supplierName"},
              {label: i18n.t("pqc.initiator"),value: "creatorName"},
              {label: i18n.t("pqc.abnTheme"),value: "subject"},
              {label: i18n.t("pqc.abnNo"),value: "abnormalNo"},
              {label: i18n.t("pqc.ln"),value: "batchNo"},
              {label: i18n.t("pqc.place"),value: "abnormalPlace"},
              {label: i18n.t("pqc.abnNo"),value: "qcNo"}
            ]
          }
        },
        permsCur:[
          "UPDATE_PQC_ABNORMAL",
          "AUDIT_PQC_ABNORMAL",
          "EXPORT_PQC_ABNORMAL",
          "SELECT_PQC_ABNORMAL",
          "INSERT_PQC_ABNORMAL",
          "DELETE_PQC_ABNORMAL",
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "INSERT_PQC_ABNORMAL":false,
          "SELECT_PQC_ABNORMAL":false,
          "UPDATE_PQC_ABNORMAL":false,
          "DELETE_PQC_ABNORMAL":false,
          "EXPORT_PQC_ABNORMAL":false,
          "AUDIT_PQC_ABNORMAL":false
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
      if(this.$props.params.verify == 'verify'){
        clearTimeout(settime)
        var settime = setTimeout(() => {
            this.refreshDatas(this.$props.params.nature1,this.$props.params.nature2,this.$props.params.nature3,this.$props.params.nature4)

        }, 200);

      }
    },
    watch:{
      renderList:function(a,b){
        if(a){
          this.reset();
        }
      }
    },
    computed:{
      renderList (){
        return this.$store.state.renderExamList;
      }
    },

    methods:{
      refreshDatas(nature1,nature2,nature3,nature4){
        // let that = this;
        // that.table.loading = true;

        // let params = {};
        // let startDate = '';
        // let endDate = '';
        // params.page = this.table.pager.current;
        // params.limit = this.table.pager.limit;
        // params.query='treatmentMethod='+nature3+'&isFatal='+nature4+'&field='+nature1+'&keyword='+nature2;
        // let url="/examinecenter/pqc/abnormal?page="+params.page+"&limit="+params.limit+"&query="+query;
        // this.$http.get(url).then(function (resp){
        //   that.data = resp.data;
        //   that.table.pager.total = resp.pagerInfo.total;
        //   let rowCount =  resp.data? resp.data.length:10;
        //   that.table.pager.rows = Math.max(rowCount,6);
        //   that.table.loading = false;
        //   that.$store.commit('RENDER_CHANGE',false);
        let that = this;
        that.table.loading = true;
        let params = {};
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;
        params.treatmentMethod = this.search.treatmentMethod;
        params.customerId = this.$store.state.customerId||'';

        let query='';

          query='abnormalState%3D9%26productId%3D'+nature2+"%26treatmentMethod%3D"+nature3+'%26isFatal%3D'+nature4;


        let url="/examinecenter/pqc/abnormal?page="+params.page+"&limit="+params.limit+"&query="+query;
        this.$http.get(url).then(function (resp) {
          for(let i=0;i<resp.data.length;i++){
            resp.data[i]._checked = false;
          }
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
        })
      },
      reset(){
        this.table.selected='';
        this.search.abnormalState='';
        this.search.isFatal='';
        this.search.result='';
        this.search.status='';
        this.search.dates='';
        this.search.fieldName='';
        this.search.query='';
        this.search.treatmentMethod='';
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
      onCClick(obj,index){
        // //console.log(obj)
        this.data[index]._checked = !this.data[index]._checked;
      },
      /**双击打开 */
      onDBClick(obj,index){
         this.$emit("open-tab","exam-pqc-abnormal-update-"+obj.abnormalId,i18n.t('pqc.mpe')+"-"+obj.productNo,"page-exam-pqc-abnormal-add",{abnormalId:obj.abnormalId})
      },
      addIqc(){
        //console.log(this.$props.tabKey);
        this.$emit("open-tab","exam-pqc-abnormal-add",i18n.t('pqc.ape'),"page-exam-pqc-abnormal-add",null);
      },
      //评审
      Toexamine(){
        let that=this;
        let reviewList=this.$refs.pageTable.getSelection()
        if(reviewList.length==0){
          this.$Notice.warning({
            title: i18n.t('pqc.psa'),
            desc: ''
          });
          return;
        }else{
          that.Audit.status=true;
        }
      },
      AuditOk(){
        let that=this;
        let url='/examinecenter/iqc/iqc/audit?iqcId='
        let AuditRwo=this.$refs.pageTable.getSelection()
        for(let i=0;i<AuditRwo.length;i++){
          that.$http.post(url+AuditRwo[i].iqcId+"&state="+that.Audit.fieldName,that.headers).then((res)=>{
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
        let query='';

        if(index == 1){
          url='/examinecenter/pqc/abnormal/export/list';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          let query = this.search.query;
          let fieldName = this.search.fieldName;
          let treatmentMethod = this.search.treatmentMethod;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];

            let startDate = this.$iqis.utils.getDayStart(1,sdate);
            let endDate = this.$iqis.utils.getDayEnd(edate);
            params.query="startDate%3D"+startDate+"%26endDate%3D"+endDate+"%26field%3D"+fieldName+"%26keyword%3D"+query+"%26treatmentMethod%3D"+treatmentMethod;
          }else {
            params.query="field="+fieldName+"%26keyword%3D"+query+"%26treatmentMethod%3D"+treatmentMethod;
          }
        }
        if(index == 3){
          url='/examinecenter/pqc/abnormal/export/list';
          params.page = 1;
          params.limit = this.table.pager.total;
          let query = this.search.query;
          let fieldName = this.search.fieldName;
          let treatmentMethod = this.search.treatmentMethod;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];

            let startDate = this.$iqis.utils.getDayStart(1,sdate);
            let endDate = this.$iqis.utils.getDayEnd(edate);
            params.query="startDate%3D"+startDate+"%26endDate%3D"+endDate+"%26field%3D"+fieldName+"%26keyword%3D"+query+"%26treatmentMethod%3D"+treatmentMethod;
          }else {
            params.query="field="+fieldName+"%26keyword%3D"+query+"%26treatmentMethod%3D"+treatmentMethod;
          }
        }
        if(index == 2){
          url = '/examinecenter/pqc/abnormal/export/report'
          let reviewList=this.$refs.pageTable.getSelection()
          if( reviewList.length != 1){
            this.$Notice.warning({
              title: i18n.t('pqc.sap'),
            });
            return;
          }
          params.abnormalId = reviewList[0].abnormalId
        }

        this.$iqis.download(url,params,methods,()=>{}) //下载文件
      },
      editSelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        //console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t("pqc.yms"),
            desc: ''
          });
          return;
        }

        this.$emit("open-tab","exam-pqc-abnormal-update-"+selectedRow[0].abnormalId,i18n.t('pqc.mpe')+"-"+selectedRow[0].productNo,"page-exam-pqc-abnormal-add",{abnormalId:selectedRow[0].abnormalId});
        // this.showModal(selectedRow[0]);
      },tableSelectChange(selection){
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
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/examinecenter/pqc/abnormal/"+ss[i].abnormalId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('pqc.deleteSuccess'));
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
        that.table.loading = true;
        let params = {};
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;
        params.treatmentMethod = this.search.treatmentMethod;
        params.customerId = this.$store.state.customerId||'';
        let customerId = this.$store.state.customerId||'';
        let query='';
        if(this.search.dates && this.search.dates[0]){
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];

          params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          params.endDate = this.$iqis.utils.getDayEnd(edate);
          query="startDate%3D"+params.startDate+"%26endDate%3D"+params.endDate+"%26field%3D"+params.fieldName+"%26keyword%3D"+params.query+"%26treatmentMethod%3D"+params.treatmentMethod+"%26abnormalState%3D"+that.search.abnormalState+'%26isFatal%3D'+that.search.isFatal+'%26customerId%3D'+customerId;
        }else {
          query="field%3D"+params.fieldName+"%26keyword%3D"+params.query+"%26treatmentMethod%3D"+params.treatmentMethod+"%26abnormalState%3D"+that.search.abnormalState+'%26isFatal%3D'+that.search.isFatal+'%26customerId%3D'+customerId;
        }

        let url="/examinecenter/pqc/abnormal?page="+params.page+"&limit="+params.limit+"&query="+query;
        this.$http.get(url).then(function (resp) {
          for(let i=0;i<resp.data.length;i++){
            resp.data[i]._checked = false;
          }
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
        })
        this.$store.commit('RENDER_CHANGE',false)
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
        that.urlProduct.dataList.splice(-10,10)
        that.arrangement.data=that.urlProduct.dataList;
      },
      //排序确定
      RankOk(){
        if(this.arrangement.data.length===0){
          this.$Notice.warning({
            title: i18n.t('pqc.tlc'),
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
      },



    }//end methods




  }

</script>
<style>
  .rankBox .list{width: 100%;min-height: 30px;}
  .rankBox .list_txt2{display: block;margin-top: 20px;}
  /* .rankBox .check0{display: none;} */
  .list_txt ,.list_txt2{display:block;margin-bottom:10px;font-size:16px;color:#5C5C5C;}
  .list_no{background:#FAFAFA;}
  .list_ok .dataItem{display: inline-block;padding: 5px 10px;}
  .list_no div , .list_no span{display: inline-block;}
  .list_no span{padding: 1px 10px;font-size: 14px;}
  .list_no .X0{display: none}
  .list_no .process-item{margin-left: 10px;cursor: pointer;margin-bottom: 15px;width:auto!important;}
  .list_no .ivu-card-body{padding:0!important;border: 1px solid #418FEE;border-radius: 2px;}
  .displayNO{display: none;}
  .list_no .ivu-card-body{padding-right: 0x !important;}
</style>
