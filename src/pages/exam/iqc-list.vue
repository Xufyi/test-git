<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
       <DatePicker type="daterange" v-model="search.dates" :placeholder="i18n.t('iqc.dateFilter')" style="width: 210px"></DatePicker>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select v-model="search.result" :placeholder="i18n.t('iqc.result')" clearable style="width: 100px;">
          <Option v-for="st in search.resultStats" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select v-model="search.status" :placeholder="i18n.t('iqc.state')" clearable style="width: 100px;">
          <Option v-for="st in search.statusList" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model.trim="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('iqc.searchAll')" slot="prepend" style="width: 110px;text-align: left">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="table.selected='';refreshData()">{{$t('iqc.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t('iqc.reset')}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <!-- <Button type="ghost" icon="refresh" @click="refreshData">刷新</Button> -->
        <Button style="margin-right:8px;" type="ghost" v-if="permsBtn.INSERT_IQC" icon="plus" @click="addIqc">{{$t('iqc.add')}}</Button>
        <Button style="margin-right:8px;" type="ghost" v-if="permsBtn.UPDATE_IQC" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t('iqc.edit')}}</Button>
        <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
          confirm
          :title="i18n.t('iqc.confirmDelete')"
          placement="bottom-start"
          @on-ok="deleteTableSelected">
          <Button type="ghost" v-if="permsBtn.DELETE_IQC" icon="trash-a" :disabled="!table.selected">{{$t('iqc.delete')}}</Button>
        </Poptip>
        <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.AUDIT_IQC" @click="Toexamine" :disabled="!table.selected" icon="android-list">{{$t('iqc.audit')}}</Button>
        <Button type="ghost" v-if="permsBtn.INSERT_IQC_ABNORMAL" @click="createAbnormal" :disabled="tableEditDis" icon="android-alert">{{$t('iqc.startAbn')}}</Button>
        <Button style="margin-left:8px;" type="ghost" icon="ios-copy" v-if="permsBtn.INSERT_IQC" :disabled="tableEditDis" @click="copySelectRow" >{{$t('product.copy')}}</Button>
      </div>
      <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="reset">{{$t('iqc.refreshData')}}</Button>
        <Button type="primary" @click="rank">{{$t('iqc.customList')}}</Button>
        <Dropdown style="margin-left: 5px"  v-if="permsBtn.EXPORT_IQC">
          <Button type="ghost">{{$t('iqc.export')}}<Icon style="padding-left:10px;" type="arrow-down-b"></Icon></Button>
          <DropdownMenu slot="list">
              <DropdownItem>
                <Button type="text" @click="exportStatement(1)">{{$t('iqc.thisPage')}}</Button>
              </DropdownItem>
              <DropdownItem>
                <Button type="text" @click="exportStatement(3)">{{$t('iqc.allData')}}</Button>
              </DropdownItem>
              <DropdownItem>
                <Button type="text" @click="exportStatement(2)">{{$t('iqc.inspectReport')}}</Button>
              </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table id="table" ref="pageTable" class="tableCustom"  @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
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
    <div class="Toexamine">
    	<Modal
      :title="i18n.t('iqc.audit')"
      v-model="Audit.status"
      :mask-closable="false"
      :width="300" >
        <Select v-model="Audit.fieldName" style="width:200px">
           <Option v-for="(item,index) in Audit.resultStats" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        <div slot="footer">
        <Button type="primary" size="large" @click="AuditOk" >{{$t('iqc.confirm')}}</Button>
        <Button type="text" size="large" @click="AuditNo">{{$t('iqc.cancel')}}</Button>
      </div>
      </Modal>
    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->

  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import draggable from 'vuedraggable';
  import $ from 'jquery';
  export default {
    components: {
      Input,draggable
    },
    props:["params","tabKey"],
    data: function () {
      let vm = this;
      return {
        isZH:'',
        reviewState:"",
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
              width:40,
              minWidth:40,
              maxWidth:40
            },
            {
              title: i18n.t('iqc.inspectTime'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?106:120,
              minWidth:this.$store.state.locale=='zh_CN'?106:120,
              // align: 'center',
              ellipsis:true,
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
              title: i18n.t('iqc.supplier'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'manufacturerName'
            },{
              title: i18n.t('iqc.productNo'),
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'productInfo.no',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.productName'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'productInfo.name',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.productSpec'),
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'productInfo.spec',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },
            {
              title: i18n.t('iqc.productUnit'),
              className:'tablePadding',
              minWidth:60,
              width:60,
              ellipsis:true,
              key: 'productInfo.prodUnitName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },
            {
              title: i18n.t('iqc.batchNum'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?66:115,
              minWidth:this.$store.state.locale=='zh_CN'?66:115,
              ellipsis:true,
              key: 'totalQuantity'
            },{
              title: i18n.t('iqc.result'),
              className:'tablePadding',
              minWidth:70,
              width:70,
              ellipsis:true,
              key: 'result',
              render:(h,params)=>{
                return h('span',{style:{'color':params.row.result == 1 ? 'green' : 'red'}},params.row.result == 1 ? i18n.t('iqc.qualified') : i18n.t('iqc.unqualified'))
              }
            },{
              title: i18n.t('iqc.sampleNum'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?81:100,
              minWidth:this.$store.state.locale=='zh_CN'?81:100,
              ellipsis:true,
              key: 'sampleQuantity'
            },{
              title: i18n.t('iqc.badNum'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?66:105,
              minWidth:this.$store.state.locale=='zh_CN'?66:105,
              ellipsis:true,
              key: 'badQuantity'
            },{
              title: i18n.t('iqc.badRate'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?70:80,
              minWidth:this.$store.state.locale=='zh_CN'?70:80,
              ellipsis:true,
              key: 'badRate'
            },
            // {
            //   title: i18n.t('iqc.state'),
            //   className:'tablePadding',
            //   minWidth:this.$store.state.locale=='zh_CN'?70:115,
            //   ellipsis:true,
            //   key: 'state',
            //   render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('iqc.inspecting'),1:i18n.t('iqc.unaudited'),2:"<span style='color:green;'>"+i18n.t('iqc.auditPass')+"</span>",3:"<span style='color:red;'>"+i18n.t('iqc.auditReject')+"</span>"})
            // },
            {
              title: "状态",
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?100:155,
              minWidth:this.$store.state.locale=='zh_CN'?70:115,
              ellipsis:true,
              key: 'reviewStateName',
              // render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('iqc.unaudited'),1:i18n.t('iqc.unReview'),2:i18n.t('iqc.judged'),3:i18n.t('iqc.notClosed'),4:i18n.t('iqc.closed')})
              // render:(h, params)=>{
              //   if(params.row.state===3||params.row.state===0){
              //     params.row.reviewState=null
              //   }
              //   let ret =  vm.$iqis.utils.tableHelper.buildMapCell(
              //     vm,{0:i18n.t('iqc.unaudited'),1:i18n.t('iqc.unReview'),2:i18n.t('iqc.judged'),3:i18n.t('iqc.notClosed'),4:i18n.t('iqc.closed'),5:i18n.t('review')}
              //   )
              //   return ret(h,params);
              // }
            },
            {
              title: i18n.t('iqc.iqcNo'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?103:115,
              minWidth:this.$store.state.locale=='zh_CN'?103:115,
              ellipsis:true,
              key: 'iqcNo'
            },{
              title: i18n.t('iqc.inspector'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:100,
              width:this.$store.state.locale=='zh_CN'?70:100,
              ellipsis:true,
              key: 'inspectorName'
            },{
              title: i18n.t('iqc.auditor'),
              className:'tablePadding',
              minWidth:200,
              width:200,
              ellipsis:true,
              key: 'auditorName'
            }
          ]
        },
        Audit:{//审核状态
        	status:false,
        	resultStats:[
            {value:"2",label:i18n.t('iqc.auditPass')},
            {value:"3",label:i18n.t('iqc.auditReject')},
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
              title: i18n.t('iqc.inspectTime'),
              className:'tablePadding',
              width:106,
              minWidth:106,
              // align: 'center',
              ellipsis:true,
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
              title: i18n.t('iqc.supplier'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'manufacturerName'
            },{
              title: i18n.t('iqc.productNo'),
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'productInfo.no',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.productName'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'productInfo.name',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.productSpec'),
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'productInfo.spec',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },
            {
              title: i18n.t('iqc.productUnit'),
              className:'tablePadding',
              width:60,
              minWidth:60,
              ellipsis:true,
              key: 'productInfo.prodUnitName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },
            {
              title: i18n.t('iqc.batchNum'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?66:130,
              minWidth:this.$store.state.locale=='zh_CN'?66:130,
              ellipsis:true,
              key: 'totalQuantity'
            },{
              title: i18n.t('iqc.result'),
              className:'tablePadding',
              minWidth:54,
              ellipsis:true,
              key: 'result',
              render:(h,params)=>{
                return h('span',{style:{'color':params.row.result == 1 ? 'green' : 'red'}},params.row.result == 1 ? i18n.t('iqc.qualified') : i18n.t('iqc.unqualified'))
              }
            },{
              title: i18n.t('iqc.sampleNum'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?80:110,
              minWidth:this.$store.state.locale=='zh_CN'?80:110,
              ellipsis:true,
              key: 'sampleQuantity'
            },{
              title: i18n.t('iqc.badNum'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?66:110,
              minWidth:this.$store.state.locale=='zh_CN'?66:110,
              ellipsis:true,
              key: 'badQuantity'
            },{
              title: i18n.t('iqc.badRate'),
              className:'tablePadding',
              width:70,
              minWidth:70,
              ellipsis:true,
              key: 'badRate'
            },{
              title: i18n.t('iqc.state'),
              className:'tablePadding',
              minWidth:54,
              ellipsis:true,
              key: 'state',
              //0检验中（没有提交审核）、1待审核（已提交审核）、2审核通过（通过审核按钮由有相应权限人员操作），3审核未通过（当审核不通过时，可重新点审核改变审核结果，也可以再次编辑后提交，状
              // render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:"检验中",1:"待审核",2:"审核通过",3:"审核驳回"})
              render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('iqc.inspecting'),1:i18n.t('iqc.unaudited'),2:"<span style='color:green;'>{{$t('iqc.auditPass')}}</span>",3:"<span style='color:red;'>{{$t('iqc.auditReject')}}</span>"})

            },{
              title: i18n.t('iqc.reviewState'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?70:115,
              ellipsis:true,
              key: 'reviewState',
              // render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('iqc.unaudited'),1:i18n.t('iqc.unReview'),2:i18n.t('iqc.judged'),3:i18n.t('iqc.notClosed'),4:i18n.t('iqc.closed')})
              render:(h, params)=>{
                if(params.row.state===3||params.row.state===0){
                  params.row.reviewState=null
                }
                let ret =  vm.$iqis.utils.tableHelper.buildMapCell(
                  vm,{0:i18n.t('iqc.unaudited'),1:i18n.t('iqc.unReview'),2:i18n.t('iqc.judged'),3:i18n.t('iqc.notClosed'),4:i18n.t('iqc.closed'),5:i18n.t('review')}
                )
                return ret(h,params);
              }
            },{
              title: i18n.t('iqc.iqcNo'),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'iqcNo'
            },{
              title: i18n.t('iqc.inspector'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?54:100,
              ellipsis:true,
              key: 'inspectorName'
            },{
              title: i18n.t('iqc.auditor'),
              className:'tablePadding',
              minWidth:54,
              ellipsis:true,
              key: 'auditorName'
            },
            
            {
              title: i18n.t('iqc.prodType'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?80:120,
              minWidth:this.$store.state.locale=='zh_CN'?80:120,
              ellipsis:true,
              key: 'productInfo.prodTypeName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },
            {
              title: i18n.t('iqc.workTime'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?70:100,
              minWidth:this.$store.state.locale=='zh_CN'?70:100,
              ellipsis:true,
              key: 'chkShiftName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },
         ],
        search: {
          query: "",
          fieldName: "",
          result:"",
          status:"",
          userList:[],
          resultStats:[
            {value:"",label:i18n.t('iqc.all')},
            {value:"1",label:i18n.t('iqc.qualified')},
            {value:"0",label:i18n.t('iqc.unqualified')}
          ],
          statusList:[
            {value:"",label:i18n.t('iqc.all')},
            {value:"0",label:i18n.t('iqc.inspecting')},
            {value:"1",label:i18n.t('iqc.unaudited')},
            {value:"2",label:i18n.t('iqc.auditPass')},
            {value:"3",label:i18n.t('iqc.auditReject')}
          ],
          data: {
            searchTypes: [
              {
                label: i18n.t('iqc.searchAll'),
                value: ""
              }, {
                label: i18n.t('iqc.supplier'),
                value: "manufacturerName"
              }, {
                label: i18n.t('iqc.iqcNo'),
                value: "iqcNo"
              }, {
                label: i18n.t('iqc.productNo'),
                value: "productNo"
              }, {
                label: i18n.t('iqc.productName'),
                value: "productName"
              }, {
                label: i18n.t('iqc.productSpec'),
                value: "spec"
              }, {
                label: i18n.t('iqc.prodType'),
                value: "prodType"
              }, {
                label: i18n.t('iqc.inspector'),
                value: "inspectorName"
              }, {
                label: i18n.t('iqc.auditor'),
                value: "auditorName"
              }
            ]
          }
        },
        permsCur:[
          "EXPORT_IQC",
          "UPDATE_IQC",
          "SELECT_IQC",
          "INSERT_IQC",
          "DELETE_IQC",
          "AUDIT_IQC",
          'INSERT_IQC_ABNORMAL'
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "EXPORT_IQC":false,
          "UPDATE_IQC":false,
          "SELECT_IQC":false,
          "INSERT_IQC":false,
          "DELETE_IQC":false,
          "AUDIT_IQC":false,
          "INSERT_IQC_ABNORMAL":false,
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
      // let locale =this.$store.state.locale;
      // this.isZH=locale=='zh_CN'?true:false;
    },
    watch:{
      renderList:function(a,b){
        if(a){
          // this.refreshData(1);
          this.reset();
        } 
      }
    },
    computed:{
      renderList (){
        //console.log(this.$store.state.renderExamList)
        return this.$store.state.renderExamList;
      }
    },

    methods:{
      copySelectRow(){
        let selectedRow = this.$refs.pageTable.getSelection()
        //console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t('stopCopy'),
            desc: ''
          });
          return;
        }
        this.$emit("open-tab","exam-iqc-copy-"+selectedRow[0].iqcId,i18n.t('product.copy')+"-"+selectedRow[0].productInfo.name,"page-exam-iqc-add",{iqcId:selectedRow[0].iqcId});
      },
      createAbnormal(){
        let that= this;
        let selectedRow = that.$refs.pageTable.getSelection()
        // //console.log(selectedRow,'当前行')
        if(selectedRow[0].state==0||selectedRow[0].state==3){
          that.$Notice.warning({title:i18n.t('iqc.stateStopAbn')})
          return;
        }
        if(selectedRow[0].result==1){
          that.$Notice.warning({title:i18n.t('iqc.resultStopAbn')})
          return;
        }
        that.$http.get("/examinecenter/iqc/abnormal",{page:1,limit:999999}).then(function (resp){
          for(let i in resp.data){
            if(resp.data[i].qcNo==selectedRow[0].iqcNo){
              that.$Notice.warning({title:i18n.t('iqc.haveAbnStopAbn')})
              return;
            }
          }
          that.$emit("open-tab","qc-iqc-abnormal-add",i18n.t('iqc.addIqcAbn'),"page-exam-iqc-abnormal-add",{qcNo:selectedRow[0].iqcNo});
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
        this.search.result='';
        this.search.status='';
        this.search.dates='';
        this.search.fieldName='';
        this.search.query='';
        this.tableEditDis = true;
        this.pageChange(1);
        this.refreshData(1);
      },
      /** 
       * 导出报表
       * index 为 1 时为导出当前条件列表
       * index 为 2 时为导出检验报告
       */
      exportStatement (index){
        let that = this;
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        if(index == 1){ 
          url = '/examinecenter/iqc/iqc/export/list';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          params.query='result%3D'+that.search.result+'%26state%3D'+that.search.status+'%26field%3D'+that.search.fieldName+'%26keyword%3D'+that.search.query;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            let startDate = this.$iqis.utils.getDayStart(1,sdate);
            let endDate = this.$iqis.utils.getDayEnd(edate);
            params.query='startDate%3D'+startDate+'%26endDate%3D'+endDate+'%26result%3D'+that.search.result+'%26state%3D'+that.search.status+'%26field%3D'+that.search.fieldName+'%26keyword%3D'+that.search.query;
          }
        }
        if(index == 2){
          url = '/examinecenter/iqc/iqc/export/report'
          let reviewList=this.$refs.pageTable.getSelection()
          if( reviewList.length != 1){
            this.$Notice.warning({
                title: i18n.t('iqc.exportChooseOne'),
            });
            return;
          }
          params.iqcId = reviewList[0].iqcId
          // if(this.reviewState>=11&&this.reviewState!=22) {
          //   this.$iqis.download("/examinecenter/iqc/iqcs/export/report",params,methods,()=>{}) //下载文件
          // }
        }
        if(index == 3){ 
          url = '/examinecenter/iqc/iqc/export/list';
          params.page = 1;
          params.limit = this.table.pager.total;
          params.query='result%3D'+that.search.result+'%26state%3D'+that.search.status+'%26field%3D'+that.search.fieldName+'%26keyword%3D'+that.search.query;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            let startDate = this.$iqis.utils.getDayStart(1,sdate);
            let endDate = this.$iqis.utils.getDayEnd(edate);
            params.query='startDate%3D'+startDate+'%26endDate%3D'+endDate+'%26result%3D'+that.search.result+'%26state%3D'+that.search.status+'%26field%3D'+that.search.fieldName+'%26keyword%3D'+that.search.query;
          }
        }
        
        //console.log(params)
        this.$iqis.download(url,params,methods,()=>{}) //下载文件
      },

      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        this.refreshData();
      },
      pageChange(page){
        this.table.pager.current = page;
        this.refreshData();
      }
      ,
      addIqc(){
        this.$emit("open-tab","exam-iqc-add",i18n.t('iqc.addIqc'),"page-exam-iqc-add",null);
      },
      //评审
      Toexamine(){
      	let that=this;
      	let reviewList=this.$refs.pageTable.getSelection()
      	if(reviewList.length==0){
      		this.$Notice.warning({
            title: i18n.t('iqc.auditChooseOne'),
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
      		that.$Message.success(i18n.t('iqc.auditSuccess'));
      		that.Audit.status=false;
      		that.refreshData();
      	  })
      	}
      },
      AuditNo(){
      	let that=this
      	that.Audit.status=false;
      },
      editSelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        //console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: '必须选择一条记录后才可以进行修改',
            desc: ''
          });
          return;
        }
        this.$emit("open-tab","exam-iqc-update-"+selectedRow[0].iqcId,i18n.t('iqc.editIqc')+"-"+selectedRow[0].productInfo.name,"page-exam-iqc-add",{iqcId:selectedRow[0].iqcId});
        // this.showModal(selectedRow[0]);
      },
      /**双击打开 */
      onDBClick(obj,index){
        this.$emit("open-tab","exam-iqc-update-"+obj.iqcId,i18n.t('iqc.editIqc')+"-"+obj.productInfo.name,"page-exam-iqc-add",{iqcId:obj.iqcId});
      },
      tableSelectChange(selection){
        this.reviewState = selection[0].reviewState
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
            delArr.push(this.$http.delete("/examinecenter/iqc/iqc/"+ss[i].iqcId));
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
          params.query='startDate='+startDate+'&endDate='+endDate+'&result='+that.search.result+'&state='+that.search.status+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }else{
          params.query='result='+that.search.result+'&state='+that.search.status+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }
        this.$http.get("/examinecenter/iqc/iqc",{params:params}).then(function (resp) {
          that.table.loading = false;
          
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
        })
        
        this.$store.commit("RENDER_CHANGE",false);
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
            title: i18n.t('iqc.listNull'),
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
<style scoped>
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
</style>
