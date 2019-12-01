<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 215px;">
        <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('iqc.dateFilter')" style="width: 205px"></DatePicker>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 70px;">
        <Select v-model="search.isInternal" :placeholder="i18n.t('iqc.assign')" clearable style="width: 65px;">
          <Option v-for="st in search.isInternalList" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select v-model="search.treatmentMethod" :placeholder="i18n.t('iqc.treatmentMethod')" clearable style="width: 100px;">
          <Option v-for="st in search.treatmentMethodList" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select v-model="search.status" :placeholder="i18n.t('iqc.state')" clearable style="width: 100px;">
          <Option v-for="st in search.state" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 100px;">
        <Select v-model="search.isFatal" :placeholder="i18n.t('iqc.mainAbn')" clearable style="width: 90px;">
          <Option v-for="st in search.isFatals" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('iqc.searchAll')" slot="prepend" style="width: 110px;text-align: left">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="refreshData">{{$t('iqc.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t('iqc.reset')}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <Button  type="ghost" icon="plus" @click="addIqc" v-if="permsBtn.INSERT_IQC_ABNORMAL">{{$t('iqc.add')}}</Button>
        <Button style="margin:0 8px;" type="ghost" icon="edit" @click="editIqc" v-if="permsBtn.UPDATE_IQC_ABNORMAL" :disabled="tableEditDis">{{$t('iqc.edit')}}</Button>
        <Poptip
          confirm
          :title="i18n.t('iqc.confirmDelete')"
          placement="bottom-start"
          @on-ok="deleteTableSelected">
          <Button type="ghost" icon="trash-a"  v-if="permsBtn.DELETE_IQC_ABNORMAL" :disabled="!table.selected">{{$t('iqc.delete')}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second" style="font-size:0;">
        <Button type="text"  icon="refresh" @click="reset">{{$t('iqc.refreshData')}}</Button>
        <Button type="primary" @click="rank">{{$t('iqc.customList')}}</Button>
        <Dropdown style="margin-left: 8px" v-if="permsBtn.EXPORT_IQC_ABNORMAL">
          <Button type="ghost">{{$t('iqc.export')}}<Icon style="margin-left:10px;" type="arrow-down-b"></Icon></Button>
          <DropdownMenu slot="list">
              <DropdownItem>
                <Button type="text" @click="exportStatement(1)">{{$t('iqc.thisPage')}}</Button>
              </DropdownItem>
              <DropdownItem>
                <Button type="text" @click="exportStatement(3)">{{$t('iqc.allData')}}</Button>
              </DropdownItem>
              <DropdownItem>
                <Button type="text" @click="exportStatement(2)">{{$t('iqc.abnReport')}}</Button>
              </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table class="tableCustom" ref="pageTable"  @on-row-dblclick="onDBClick"  highlight-row v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display:inline-block;"> -->
            <div style="padding: 20px 0 20px 0px;">
              <Page id="pageId" v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                    :page-size-opts="[10,20,50,100]"
                    @on-change="pageChange" @on-page-size-change="pageSizeChange"
                    size="small" show-total show-elevator show-sizer></Page>
            </div>
          <!-- </div>
          <div style="display: inline-block;">
            <div style="float: left;margin: 4px;line-height: 24px;">
                <Button type="primary" size="small" @click="goElevatorPage">跳转</Button>
            </div>
          </div> -->

        </div>
      </div>

    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
    <div class="arrangement-dialog">
      <Modal
      :title="i18n.t('iqc.customList')"
      v-model="arrangement.state"
      class="rankBox"
      :mask-closable="false"
      :width="600" >
      <span class="list_txt">{{$t('iqc.select')}}</span>
       <div class="list_ok list">
        <div v-for="(item,index) in arrangement.data1" class="dataItem" :class="'check'+index"  :key="index">
          <input type="checkbox"   :value="item"  v-model="arrangement.data" >
           <span >{{item.title}}</span>
         </div>
       </div>
       <span class="list_txt2">{{$t('iqc.selected')}}</span>
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
        <Button type="primary" size="large" @click="ReplyOk" >{{$t('iqc.restore')}}</Button>
        <Button type="primary" size="large" @click="RankOk" >{{$t('iqc.confirm')}}</Button>
        <Button type="text" size="large" @click="RankNo">{{$t('iqc.cancel')}}</Button>
      </div>
      </Modal>
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
            {type: 'selection',
              align: 'center',
              width:40,
              minWidth:40,
              maxWidth:40
            },
            {
              title: i18n.t('iqc.happenTime'),
              className:'tablePadding',
              width: 106,
              minWidth: 106,
              ellipsis:true,
              key: 'abnormalDate',
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
              title: i18n.t('iqc.productNo'),
              className:'tablePadding',
              width: 120,
              minWidth:120,
              ellipsis:true,
              key: 'productNo',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.productName'),
              className:'tablePadding',
              width: 80,
              minWidth:80,
              ellipsis:true,
              key: 'productName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.batchNum'),
              className:'tablePadding',
              width: this.$store.state.locale=='zh_CN'?70:120,
              minWidth:this.$store.state.locale=='zh_CN'?70:120,
              ellipsis:true,
              key: 'batchQuantity',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.treatmentMethod'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:130,
              ellipsis:true,
              key: 'treatmentMethod',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{"REJECT":i18n.t('iqc.return'),"REWORK":i18n.t('iqc.rework'),"SCREEN":i18n.t('iqc.filter'),"EMERGENCY_RELEASE":i18n.t('iqc.release'),"SCRAP":i18n.t('iqc.scrap'),"SPECIAL_ADOPTION":i18n.t('iqc.special')})
            },{
              title: i18n.t('iqc.supplier'),
              className:'tablePadding',
              width: 70,
              minWidth:70,
              ellipsis:true,
              key: 'supplierName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.mainAbn'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:120,
              ellipsis:true,
              key: 'isFatal',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{1:i18n.t('iqc.yes'),0:i18n.t('iqc.not')})
            },{
              title: i18n.t('iqc.state'),
              className:'tablePadding',
              minWidth:70,
              ellipsis:true,
              key: 'abnormalState',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('iqc.unsubmit'),1:i18n.t('iqc.unaudited'),2:i18n.t('iqc.auditPass'),3:"<span style='color:red;'>"+i18n.t('iqc.auditReject')+"</span>",4:i18n.t('iqc.treated'),41:i18n.t('iqc.Unanswered'),5:i18n.t('iqc.treating'),6:i18n.t('iqc.back'),7:"<span style='color:red;'>"+i18n.t('iqc.beBack')+"</span>",8:i18n.t('iqc.notClosed'),9:i18n.t('iqc.closed')})
            },{
              title: i18n.t('iqc.mainDefect'),
              className:'tablePadding',
              width: 140,
              minWidth:140,
              ellipsis:true,
              key: 'majorDefect',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.abnTheme'),
              className:'tablePadding',
              width: this.$store.state.locale=='zh_CN'?103:120,
              minWidth:this.$store.state.locale=='zh_CN'?103:120,
              ellipsis:true,
              key: 'subject',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.assign'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?54:70,
              ellipsis:true,
              key: 'isInternal',
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{1:i18n.t('iqc.inside'),0:i18n.t('iqc.external')})
            },{
              title: i18n.t('iqc.abnNo'),
              className:'tablePadding',
              width: this.$store.state.locale=='zh_CN'?103:130,
              minWidth:this.$store.state.locale=='zh_CN'?103:130,
              ellipsis:true,
              key: 'abnormalNo'
            },{
              title: i18n.t('iqc.iqcNo'),
              className:'tablePadding',
              width: 103,
              minWidth:103,
              ellipsis:true,
              key: 'qcNo',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            }
          ]
        },
        search: {
          isInternal:"",
          isInternalList:[
            {value:"",label:i18n.t('iqc.all')},
            {value:"1",label:i18n.t('iqc.inside')},
            {value:"0",label:i18n.t('iqc.external')}
          ],
          isFatal:"",
          isFatals:[
            {value:"",label:i18n.t('iqc.all')},
            {value:"1",label:i18n.t('iqc.yes')},
            {value:"0",label:i18n.t('iqc.not')}
          ],
          treatmentMethod:"",
          treatmentMethodList:[
            {value:"",label:i18n.t('iqc.all')},
            {value:"REJECT",label:i18n.t('iqc.return')},
            {value:"REWORK",label:i18n.t('iqc.rework')},
            {value:"SCREEN",label:i18n.t('iqc.filter')},
            {value:"SPECIAL_ADOPTION",label:i18n.t('iqc.special')},
            {value:"EMERGENCY_RELEASE",label:i18n.t('iqc.release')},
            {value:"SCRAP",label:i18n.t('iqc.scrap')},
          ],
          status:"",
          state:[
            {value:"",label:i18n.t('iqc.all')},
            {value:"0",label:i18n.t('iqc.unsubmit')},
            {value:"1",label:i18n.t('iqc.unaudited')},
            {value:"2",label:i18n.t('iqc.auditPass')},
            {value:"3",label:i18n.t('iqc.auditReject')},
            // {value:"4",label:"待处理"},
            {value:"41",label:i18n.t('iqc.Unanswered')},
            {value:"5",label:i18n.t('iqc.treating')},
            {value:"6",label:i18n.t('iqc.back')},
            {value:"7",label:i18n.t('iqc.beBack')},
            {value:"8",label:i18n.t('iqc.notClosed')},
            {value:"9",label:i18n.t('iqc.closed')}
          ],
          query: "",
          userList:[],
          fieldName: "",
          data: {
            searchTypes: [
              {label: i18n.t('iqc.searchAll'),value: ""},
              {label: i18n.t('iqc.productNo'),value: "productNo"},
              {label: i18n.t('iqc.productName'),value: "productName"},
              {label: i18n.t('iqc.productSpec'),value: "productSpec"},
              {label: i18n.t('iqc.prodType'),value: "prodTypeName"},
              {label: i18n.t('iqc.productUnit'),value: "productUnitName"},
              {label: i18n.t('iqc.supplier'),value: "supplierName"},
              {label: i18n.t('iqc.creator'),value: "creatorName"},
              {label: i18n.t('iqc.abnTheme'),value: "subject"},
              {label: i18n.t('iqc.abnNo'),value: "abnormalNo"},
              {label: i18n.t('iqc.productBatch'),value: "batchNo"},
              {label: i18n.t('iqc.place'),value: "abnormalPlace"},
              {label: i18n.t('iqc.iqcNo'),value: "qcNo"}
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
        rankData:[
          {
            title: i18n.t('iqc.happenTime'),
            className:'tablePadding',
            width: 106,
            minWidth: 106,
            ellipsis:true,
            key: 'abnormalDate',
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
            title: i18n.t('iqc.productNo'),
            className:'tablePadding',
            width: 120,
            minWidth:120,
            ellipsis:true,
            key: 'productNo',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },{
            title: i18n.t('iqc.productName'),
            className:'tablePadding',
            width: 80,
            minWidth:80,
            ellipsis:true,
            key: 'productName',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },{
            title: i18n.t('iqc.batchNum'),
            className:'tablePadding',
            width: this.$store.state.locale=='zh_CN'?70:120,
            minWidth:this.$store.state.locale=='zh_CN'?70:120,
            ellipsis:true,
            key: 'batchQuantity',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },{
            title: i18n.t('iqc.treatmentMethod'),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?70:160,
            ellipsis:true,
            key: 'treatmentMethod',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{"REJECT":i18n.t('iqc.return'),"REWORK":i18n.t('iqc.rework'),"SCREEN":i18n.t('iqc.filter'),"EMERGENCY_RELEASE":i18n.t('iqc.release'),"SCRAP":i18n.t('iqc.scrap'),"SPECIAL_ADOPTION":i18n.t('iqc.special')})
          },{
            title: i18n.t('iqc.treatmentMethod'),
            className:'tablePadding',
            width: this.$store.state.locale=='zh_CN'?80:160,
            minWidth:this.$store.state.locale=='zh_CN'?80:160,
            ellipsis:true,
            key: 'supplierName',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },{
            title: i18n.t('iqc.mainAbn'),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?70:120,
            ellipsis:true,
            key: 'isFatal',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{1:i18n.t('iqc.yes'),0:i18n.t('iqc.not')})
          },{
            title: i18n.t('iqc.state'),
            className:'tablePadding',
            minWidth:70,
            ellipsis:true,
            key: 'abnormalState',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('iqc.unsubmit'),1:i18n.t('iqc.unaudited'),2:i18n.t('iqc.auditPass'),3:"<span style='color:red;'>i18n.t('iqc.auditReject')}</span>",4:i18n.t('iqc.treated'),41:i18n.t('iqc.Unanswered'),5:i18n.t('iqc.treating'),6:i18n.t('iqc.back'),7:"<span style='color:red;'>{{$t('iqc.beBack')}</span>",8:i18n.t('iqc.notClosed'),9:i18n.t('iqc.closed')})
          },{
            title: i18n.t('iqc.mainDefect'),
            className:'tablePadding',
            width: 140,
            minWidth:140,
            ellipsis:true,
            key: 'majorDefect',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },{
            title: i18n.t('iqc.abnTheme'),
            className:'tablePadding',
            width: this.$store.state.locale=='zh_CN'?103:130,
            minWidth:this.$store.state.locale=='zh_CN'?103:130,
            ellipsis:true,
            key: 'subject',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },{
            title: i18n.t('iqc.assign'),
            className:'tablePadding',
            minWidth:54,
            ellipsis:true,
            key: 'isInternal',
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{1:i18n.t('iqc.inside'),0:i18n.t('iqc.external')})
          },{
            title: i18n.t('iqc.abnNo'),
            className:'tablePadding',
            width: this.$store.state.locale=='zh_CN'?103:130,
            minWidth:this.$store.state.locale=='zh_CN'?103:130,
            ellipsis:true,
            key: 'abnormalNo'
          },{
            title: i18n.t('iqc.iqcNo'),
            className:'tablePadding',
            width: this.$store.state.locale=='zh_CN'?103:130,
            minWidth:this.$store.state.locale=='zh_CN'?103:130,
            ellipsis:true,
            key: 'qcNo',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },

          {
            title: i18n.t('iqc.productSpec'),
            className:'tablePadding',
            width: 120,
            minWidth:120,
            ellipsis:true,
            key: 'productSpec',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: i18n.t('iqc.prodType'),
            className:'tablePadding',
            width: this.$store.state.locale=='zh_CN'?80:140,
            minWidth:this.$store.state.locale=='zh_CN'?80:140,
            ellipsis:true,
            key: 'productTypeName',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: i18n.t('iqc.productUnit'),
            className:'tablePadding',
            minWidth:60,
            ellipsis:true,
            key: 'productUnitName',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: i18n.t('iqc.customer'),
            className:'tablePadding',
            width: 80,
            minWidth:80,
            ellipsis:true,
            key: 'customerName',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },

          {
            title: i18n.t('iqc.productBatch'),
            className:'tablePadding',
            width: 103,
            minWidth:103,
            ellipsis:true,
            key: 'batchNo',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: i18n.t('iqc.place'),
            className:'tablePadding',
            width: this.$store.state.locale=='zh_CN'?92:120,
            minWidth:this.$store.state.locale=='zh_CN'?92:120,
            ellipsis:true,
            key: 'abnormalPlace',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: i18n.t('iqc.qcNum'),
            className:'tablePadding',
            width: this.$store.state.locale=='zh_CN'?60:150,
            minWidth:this.$store.state.locale=='zh_CN'?60:150,
            ellipsis:true,
            key: 'sampleQuantity',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: i18n.t('iqc.badNum'),
            className:'tablePadding',
            width: this.$store.state.locale=='zh_CN'?60:130,
            minWidth:this.$store.state.locale=='zh_CN'?60:130,
            ellipsis:true,
            key: 'badQuantity',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: i18n.t('iqc.badRate'),
            className:'tablePadding',
            minWidth:70,
            ellipsis:true,
            key: 'badRate',
            render:(h,params)=>{
              // return h('span',params.row['badRate']=(params.row.badQuantity/params.row.sampleQuantity*100).toFixed(2))
              return h('span',params.row['badRate']=params.row.badQuantity/params.row.sampleQuantity*100 > 100 ? 100 : Math.floor(params.row.badQuantity/params.row.sampleQuantity*10000) / 100)
            }
          },
          {
            title: i18n.t('iqc.treatmentLimit'),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?70:150,
            ellipsis:true,
            key: 'treatmentTimeLimit',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: i18n.t('iqc.creator'),
            className:'tablePadding',
            width: 70,
            minWidth:70,
            ellipsis:true,
            key: 'creatorName',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
        ],
        permsCur:[
          "EXPORT_IQC_ABNORMAL",
          "UPDATE_IQC_ABNORMAL",
          "SELECT_IQC_ABNORMAL",
          "INSERT_IQC_ABNORMAL",
          "DELETE_IQC_ABNORMAL",
          "AUDIT_IQC_ABNORMAL",
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "EXPORT_IQC_ABNORMAL":false,
          "UPDATE_IQC_ABNORMAL":false,
          "SELECT_IQC_ABNORMAL":false,
          "INSERT_IQC_ABNORMAL":false,
          "DELETE_IQC_ABNORMAL":false,
          "AUDIT_IQC_ABNORMAL":false,
        },

      }
    },//end data

    created(){
      this.refreshData();
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
      if(this.$props.params.verify == 'verify'){
        clearTimeout(settime)
        var settime = setTimeout(() => {
            this.refreshDatas(this.$props.params.nature1,this.$props.params.nature2,this.$props.params.nature3,this.$props.params.nature4)

        }, 200);

      }
      
     

// =======
//       clearTimeout(settime)
//       var settime = setTimeout(() => {
//         if(this.$props.params.recordskip == 'recordskip'){
//           // alert(this.$props.params.productId)
//           this.refreshDatas()
//         }
//       }, 200);
// >>>>>>> af4eb191318b94ef65e67e4179fa457830afe16a

      

    },
    watch:{
      renderList:function(a,b){
        if(a){
          this.reset(1);
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
        let that = this;
        that.table.loading = true;

        let params = {};
        let startDate = '';
        let endDate = '';
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query='treatmentMethod='+nature3+'&isFatal='+nature4+'&abnormalState=9&productId='+nature2;
        this.$http.get("/examinecenter/iqc/abnormal",{params:params}).then(function (resp){
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
          that.$store.commit('RENDER_CHANGE',false);
        })
      },
      // //点击跳转到输入的页码
      // goElevatorPage(){
      //   var evtObj;
      //   var thisPage=document.getElementById('pageId');
      //   //console.log(thisPage);
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
      reset(){

        this.table.selected='';
        this.search.dates=[];
        this.search.isInternal='';
        this.search.treatmentMethod='';
        this.search.status='';
        this.search.isFatal='';
        this.search.fieldName='';
        this.search.query='';
        this.tableEditDis=true;
        this.refreshData(1);
        this.pageChange(1)
      },
      exportStatement (index){
        //console.log(index,'index');
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        if(index == 1){
          url = '/examinecenter/iqc/abnormal/export/list';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          params.query = this.search.query;
          // params.fieldName = this.search.fieldName;
          // params.result = this.search.isInternal;
          // params.state = this.search.status;
          // if(this.search.dates && this.search.dates[0]){
          //   let sdate = this.search.dates[0];
          //   let edate = this.search.dates[1];
          //   params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          //   params.endDate = this.$iqis.utils.getDayEnd(edate);
          // }
        }
        if(index == 3){
          url = '/examinecenter/iqc/abnormal/export/list';
          params.page = 1;
          params.limit = this.table.pager.total;
          params.query = this.search.query;
          // params.fieldName = this.search.fieldName;
          // params.result = this.search.isInternal;
          // params.state = this.search.status;
          // if(this.search.dates && this.search.dates[0]){
          //   let sdate = this.search.dates[0];
          //   let edate = this.search.dates[1];
          //   params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          //   params.endDate = this.$iqis.utils.getDayEnd(edate);
          // }
        }
        if(index == 2){
          url = '/examinecenter/iqc/abnormal/export/report'
          let reviewList=this.$refs.pageTable.getSelection()
          if( reviewList.length != 1){
            this.$Notice.warning({
                title: i18n.t('iqc.exportChooseOne'),
            });
            return;
          }
          params.abnormalId = reviewList[0].abnormalId
        }

        this.$iqis.download(url,params,methods,()=>{}) //下载文件
      },
      refreshData(){
        let that = this;

        that.table.loading = true;

        let params = {};
        let startDate = '';
        let endDate = '';
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        if(this.search.dates && this.search.dates[0]){
          startDate = this.$iqis.utils.getDayStart(1,this.search.dates[0]);
          endDate = this.$iqis.utils.getDayEnd(this.search.dates[1]);
          params.query='startDate='+startDate+'&endDate='+endDate+'&isInternal='+that.search.isInternal+'&treatmentMethod='+that.search.treatmentMethod+'&abnormalState='+that.search.status+'&isFatal='+that.search.isFatal+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }else{
          params.query='isInternal='+that.search.isInternal+'&treatmentMethod='+that.search.treatmentMethod+'&abnormalState='+that.search.status+'&isFatal='+that.search.isFatal+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }

        this.$http.get("/examinecenter/iqc/abnormal",{params:params}).then(function (resp){
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
          that.$store.commit('RENDER_CHANGE',false);
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
      },modalOk(){
        //console.log(this.editModal.item);
        this.editModal.requesting = true;
        // this.editModal.item.prodLineTypeId = null;
        // if(this.editModal.item.prodLineTypeValue && this.editModal.item.prodLineTypeValue.length > 0){
        //   let plt = this.editModal.item.prodLineTypeValue[this.editModal.item.prodLineTypeValue.length-1];
        //   if(plt){
        //     this.editModal.item.prodLineTypeId = plt;
        //   }
        // }

        if(!this.editModal.item.name || !this.editModal.item.judgeId
          //|| !this.editModal.item.reviewer1Id || !this.editModal.item.reviewer2Id
          //|| !this.editModal.item.reviewer3Id || !this.editModal.item.reviewer4Id
          || !this.editModal.item.auditorId){
          this.$Notice.warning({
            title: i18n.t("pqc.naa"),
            desc: ''
          });
          this.editModal.requesting = false;
          return;
        }
        let that = this;
        if(this.editModal.item.prodLineId){
          that.$http.put("/basic/reviewprocess",that.editModal.item).then(function (resp) {
            that.refreshData();
            that.$Message.success(i18n.t('iqc.editSuccess'));
            that.editModal.show = false;
          });
        }else{
          that.$http.post("/basic/reviewprocess",that.editModal.item).then(function (resp) {
            that.refreshData();
            that.$Message.success(i18n.t('iqc.addSuccess'));
            that.editModal.show = false;
          });
        }

        //this.editModal = true;
      }
      ,
      addIqc(){
        this.$emit("open-tab","qc-iqc-abnormal-add",i18n.t('iqc.addIqcAbn'),"page-exam-iqc-abnormal-add",null);
      },
      editIqc(){
        let selectedRow = this.$refs.pageTable.getSelection()
        //console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          // this.$Notice.warning({
          //   title: '必须选择一条记录后才可以进行修改',
          //   desc: ''
          // });
          return;
        }
        this.$emit("open-tab","qc-iqc-abnormal-edit-"+selectedRow[0].abnormalId,i18n.t('iqc.editIqcAbn')+"-"+selectedRow[0].productName,"page-exam-iqc-abnormal-add",{abnormalId:selectedRow[0].abnormalId});
      },
      /**双击打开 */
      onDBClick(obj,index){
        this.$emit("open-tab","qc-iqc-abnormal-edit-"+obj.abnormalId,i18n.t('iqc.editIqcAbn')+"-"+obj.productName,"page-exam-iqc-abnormal-add",{abnormalId:obj.abnormalId});

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
            delArr.push(this.$http.delete("/examinecenter/iqc/abnormal/"+ss[i].abnormalId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('iqc.deleteSuccess'));
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
      rank(){
        let that=this;
        if(that.index===1){
            that.defaultData()
        }else{
           that.arrangement.data=that.arrangement.data;
        }
        that.arrangement.data1=that.rankData;
        that.arrangement.state=true;
      },
      //默认排序
      ReplyOk(){
        this.defaultData()
      },
      //默认排序
      defaultData(){
        let that=this;
        that.index=1;
        that.dataList=that.rankData.concat();
        that.dataList.splice(-11,11)
        that.arrangement.data=that.dataList;
      },
      //排序确定
      RankOk(){
        if(this.arrangement.data.length===0){
         this.$Notice.warning({
            title: i18n.t('iqc.listNull'),
            desc: ''
          });
          return;
        }
        // let data=[{type: 'selection',align: 'center',width:40,minWidth:40,maxWidth:40}]
        let data=[{type: 'selection',align: 'center',width:40,minWidth:40}]
        let dataList=data.concat(this.arrangement.data)
        this.table.columns=dataList;
        this.index=2;
        this.arrangement.state=false;
      },
      // 默认数据显示
      RankNo(){
        this.arrangement.state=false;
      },
      hightLight(){
        // ivu-table-row ivu-table-row-highlight
      }




    }//end methods




  }

</script>
<style scoped>

/* 公用自定义列样式 */
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
/* .ivu-table-wrapper{
  height:auto!important;
  overflow: auto!important;
} */
.ivu-table-overflowY{
  height:auto!important;
}
/* 公用列表和树形响应式高度 */
/* @media screen and (max-width:1920px){
  .tableCustom.ivu-table-wrapper{
    height:536px!important;
  }
  .tableCustom .ivu-table-body{
    height:482px!important;
  }
}
@media screen and (max-width:1440px){
  .tableCustom.ivu-table-wrapper{
    height:449px!important;
  }
  .tableCustom .ivu-table-body{
    height:395px!important;
  }
}
@media screen and (max-width:1366px){
  .tableCustom.ivu-table-wrapper{
    height:340px!important;
  }
  .tableCustom>.ivu-table>.ivu-table-body{
    height:286px!important;
  }
} */
</style>
