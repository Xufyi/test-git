<template>
  <div class="iqis-page">

    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <!-- <div class="iqis-bus-tree treeCustom" style="display: -webkit-flex;display: flex;flex-direction: column;flex: 0 0 185px;font-size: 14px;overflow: auto; border: 1px solid #e9eaec;margin-right: 16px;margin-top:11px;padding-left: 10px;" :style="treeStyle">
          <div class="iqis-page-tool-row iqis-tree-tool" style="flex: 0 0 47px;" >
            <div style="display: -webkit-flex;display: flex;justify-content:space-between;width: 100%;">
              <div class="iqis-page-tool-primary" style="padding: 12px 6px;">
                <Button type="ghost" v-if="permsBtn.INSERT_PRODUCT" @click="addSubNode">{{$t('product.addType')}}</Button>
              </div>
              <div class="iqis-page-tool-second" style="padding: 12px 10px;">
                <Button type="ghost" v-if="permsBtn.UPDATE_PRODUCT" :disabled="!tree.selected" @click="editTreeSelected" >{{$t('product.edit')}}</Button>
                <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"
                  confirm
                  :title="i18n.t('product.confirmDeleteType')+'?'"
                  placement="bottom-start"
                  @on-ok="deleteTreeNode">
                  <Button type="ghost" v-if="permsBtn.DELETE_PRODUCT" :disabled="!tree.selected">{{$t('product.delete')}}</Button>
                </Poptip>

              </div>

            </div>

          </div>
          <div style="flex: 1 1 100px;overflow: auto;">
            <Tree ref="tree" :data="category" :multiple="false" @on-select-change="pageChange(1)"></Tree>
          </div>
        </div> -->
        <TreeCategory ref="treeCategory" :treeData="treeData" v-on:changeTreeNode="changeTreeNode"></TreeCategory><!--树组件引用-->
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">

          <div class="iqis-page-search-row">
            <div class="iqis-page-search-bar-item linehieght34" style="flex:0 0 220px;">
            <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('product.dateFilter')" style="width: 210px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 135px;">
              <Select class="heightSetting" v-model="search.examType" :placeholder="i18n.t('product.openedInspection')" clearable style="width: 130px;">
                <Option v-for="st in search.examTypeList" :key="st.value" :value="st.value">{{st.label}}</Option>
              </Select>
            </div>
            <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 95px;">
              <Select v-model="search.useState" :placeholder="i18n.t('product.useState')" clearable style="width: 90px;">
                <Option v-for="st in search.stateList" :key="st.value" :value="st.value">{{st.label}}</Option>
              </Select>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:0 0 255px;">
              <i-input class="lineheight34" v-model="search.query" clearable style="width: 250px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('product.searchAll')" slot="prepend" style="width: 100px;text-align: left">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1; font-size:0;">
              <Button style="margin-right:8px;" type="primary" @click="table.selected='';refreshTypeTree();refreshData()">{{$t('product.search')}}</Button>
              <Button type="ghost" @click="reset">{{$t('product.reset')}}</Button>
            </div>
          </div>

          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <Button style="margin-right:8px;" type="ghost" icon="plus" v-if="permsBtn.INSERT_PRODUCT" @click="addProduct" :title="i18n.t('product.addProduct')">{{$t('product.add')}}</Button>
              <Button style="margin-right:8px;" type="ghost" icon="edit" v-if="permsBtn.UPDATE_PRODUCT" :disabled="tableEditDis" @click="editSelectRow" >{{$t('product.edit')}}</Button>
              <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"
                confirm
                :title="i18n.t('product.confirmDelete')+'?'"
                placement="bottom-start"
                @on-ok="deleteTableSelected">
                <Button type="ghost" icon="trash-a" v-if="permsBtn.DELETE_PRODUCT" :disabled="!table.selected">{{$t('product.delete')}}</Button>
              </Poptip>
              <Button style="margin-left:8px;" type="ghost" icon="ios-copy" v-if="permsBtn.INSERT_PRODUCT" :disabled="tableEditDis" @click="copySelectRow" >{{$t('product.copy')}}</Button>
              <!-- <Button type="ghost" icon="android-share-alt" v-if="permsBtn.SHARE_PRODUCT" @click="shareProd()" >{{$t('product.shareProd')}}</Button> -->
            </div>
            <div class="iqis-page-tool-second" style="font-size:0;">
              <Button type="text"  icon="refresh" @click="reset">{{$t('product.refreshData')}}</Button>
              <Button type="primary" @click="rank">{{$t('product.customList')}}</Button>
              <!-- <Button v-if="permsBtn.EXPORT_PRODUCT" style="margin-left: 8px" @click="exportStatement(1)" type="ghost">{{$t('product.export')}}</Button> -->

              <Dropdown style="margin-left: 8px" v-if="permsBtn.IMPORT_PRODUCT">
                <Button type="ghost">{{$t('product.exportList')}}<Icon style="margin-left:10px;" type="arrow-down-b"></Icon></Button>
                <DropdownMenu slot="list">
                  <DropdownItem>
                    <Button type="text" @click="exportStatement(1)">{{$t('product.currentData')}}</Button>
                  </DropdownItem>
                </DropdownMenu>
                <DropdownMenu slot="list">
                  <DropdownItem>
                    <Button type="text" @click="exportStatement(2)">{{$t('product.allTheData')}}</Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown> 
              <Dropdown style="margin-left: 8px" v-if="permsBtn.IMPORT_PRODUCT">
                <Button type="ghost">{{$t('iqisUpload.importData')}}<Icon style="margin-left:10px;" type="arrow-down-b"></Icon></Button>
                <DropdownMenu slot="list">
                  <DropdownItem>
                    <Button type="text" @click="downloadTemplate()">{{$t('iqisUpload.downloadTheTemplate')}}</Button>
                  </DropdownItem>
                </DropdownMenu>
                <DropdownMenu slot="list">
                  <DropdownItem>
                    <Button type="text" @click="openUpload();uploadShow=true;beforeShow=true;beforeShow1=true;uploadFile=[]">{{$t('iqisUpload.importData')}}</Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown> 
            </div>
          </div>

          <Modal v-model="uploadShow" :title="i18n.t('iqisUpload.importProductLibrary')" :mask-closable="false" :closable="false">
              <div v-if="!progressShow" style="font-size:14px;text-align:center">{{$t('product.uploading')}}</div>
              <div v-if="beforeShow" style="text-align:center">
                <Upload ref="upload" 
                        :action="uploadUrl" 
                        :max-size="153600"
                        :format="['xls']" 
                        :headers='{"x-access-token":$http.defaults.headers["x-access-token"]}'
                        :before-upload="beforeUpload"
                        :on-error="error"
                        :on-success="success"
                        :on-progress="hideBtn"
                        :on-exceeded-size="exceeded"
                        >
                        <Button  class="iqis-table-footer-btn" type="ghost">{{$t('iqisUpload.selectTheFile')}}</Button>
                  <!-- <Button icon="ios-cloud-upload-outline">选择文件</Button> -->
                </Upload>
              <Tag style="margin-top:10px;" v-if="uploadFile.name&&beforeShow&&progressShow" closable @on-close="uploadFile=[]">{{uploadFile.name}}</Tag>
              </div>
              <div v-if="!beforeShow">{{$t('fileCenter.uploadSuccess')}}！<br/>{{dataFromBase}}</div>
            <div slot="footer">
              <Button type="primary" size="large" v-if="uploadFile.name&&beforeShow2" v-on:click="shangchuan"  @click="$refs.upload.post(uploadFile)">{{$t('fileCenter.upload')}}</Button>
              <Button v-if="beforeShow1" type="text"  size="large" @click="uploadShow=false">{{$t('message.ce')}}</Button>
              <Button v-if="otherBeforeShow" type="primary" size="large" v-on:click="sure" @click="uploadShow=false;reset()">{{$t('message.cm')}}</Button>
            </div>
          </Modal>

          <!--产品库列表-->
          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" :loading="table.loading" v-drag-table-column="table.columns" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
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
    <div class="arrangement-dialog">
      <Modal
      :title="i18n.t('product.customList')"
      v-model="arrangement.state"
      class="rankBox"
      :mask-closable="false"
      :width="600" >
      <span class="list_txt">{{$t('product.select')}}</span>
       <div class="list_ok list">
        <div v-for="(item,index) in arrangement.data1" class="dataItem" :class="'check'+index"  :key="index">
          <input type="checkbox"   :value="item"  v-model="arrangement.data" >
           <span >{{item.title}}</span>
         </div>
       </div>
       <span class="list_txt2">{{$t('product.selected')}}</span>
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
        <Button type="primary" size="large" @click="ReplyOk" >{{$t('product.restore')}}</Button>
        <Button type="primary" size="large" @click="RankOk" >{{$t('product.confirm')}}</Button>
        <Button type="text" size="large" @click="RankNo">{{$t('product.cancel')}}</Button>
      </div>
      </Modal>
    </div>
    <Modal
      :title="editModal.item.productId?i18n.t('product.editProdType'):i18n.t('product.addProdType')"
      v-model="editModal.show"
      :mask-closable="false"
      :width="600" >
      <Row type="flex" :gutter="40">
        <i-col span="12">{{$t('product.prodTypeName')}}</i-col>
        <i-col span="12">{{$t('product.prodTypeCode')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12"><Input v-model="editModal.item.name" style="width: 100%;"></Input>
        </i-col>
        <i-col span="12">
          <i-input v-model="editModal.item.prodTypeCode" style="width: 100%;"></i-input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">{{$t('product.type')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" >
        <i-col span="24">
          <Cascader :transfer="false"  v-model="editModal.item.productTypeValue" :data="category"
                    :render-format = "loadProdTypeRender"
                    change-on-select :clearable="false" style="width: 100%"></Cascader>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">{{$t('product.remarks')}}
        </i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="24"><Input v-model="editModal.item.remark" type="textarea" :rows="4" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <div slot="footer">
        <Button type="primary" size="large" @click="modalOk" :loading="editModal.requesting">{{$t('product.confirm')}}</Button>
        <Button type="text" size="large" @click="editModal.show=false">{{$t('product.cancel')}}</Button>
      </div>
      <Spin v-if="editModal.dataLoading" fix size="large"></Spin>
    </Modal>
    <Modal
      :title="i18n.t('product.shareProd')"
      v-model="shareProdShow"
      :mask-closable="false"
      :width="600" >
      <div>{{$t('product.shareProdNotice')}}</div>
      <Select class="customWidth" v-model="shareProdCompany" multiple filterable>
        <Option v-for="(items,index) in companys" :value="items.tenantId" :key="index" >{{items.companyName}}</Option>
      </Select>
      <div slot="footer">
        <Button type="primary" size="large" @click="saveShareProd" :loading="editModal.requesting">{{$t('product.confirm')}}</Button>
        <Button type="text" size="large" @click="shareProdShow=false">{{$t('product.cancel')}}</Button>
      </div>
      <Spin v-if="editModal.dataLoading" fix size="large"></Spin>
    </Modal>
  </div>

</template>
<script>
  import $ from "jquery";
  import Input from "iview/src/components/input";
  import ICol from "iview/src/components/grid/col";
  import TreeCategory from '../../components/treeCategory/TreeCategory'

  export default {
    components: {
      ICol,
      Input,
      TreeCategory
    },
    props:["params"],
    data: function () {
      let vm = this;
      return {
        data:[
        ],
        i18n:window.i18n,
        snsData:null,
        companys:[],
        shareProdCompany:[],
        uploadUrl:process.env.API_HOST+'/basic/product/batch/import',
        uploadShow:false,
        uploadFile:[],
        beforeShow:true,
        progressShow:true,
        beforeShow1:true,
        beforeShow2:true,
        otherBeforeShow:false,
        shareProdShow:false,
        tableEditDis:true,
        editModal:{
          dataLoading:false,
          item:{},
          show:false,
          requesting:false
        },

        category:[{
          title: i18n.t('product.prodType'),
          loading: false,
          children: []
        }],
        tree:{
          newNodeName:"",
          add:false,
          edit:false,
          selected:false
        },
        table:{
          loading:false,
          selected:false,
          pager:{
            rows:10,
            need:true,
            total:100,
            limit:10,
            current:1
          },
          columns:[
            {type: 'selection',
              align: 'center',
              className:this.$store.state.customerId?'hide':'',
              minWidth:this.$store.state.customerId?0:40,
              minWidth:this.$store.state.customerId?0:40,
              width:this.$store.state.customerId?0:40
            },{
              title: i18n.t('product.productNo'),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'no'
            },
            {
              title: i18n.t('product.productName'),
              className:'tablePadding',
              minWidth:103,
              width:103,
              ellipsis:true,
              key: 'name'
            },
            {
              title: i18n.t('product.productSpec'),
              className:'tablePadding',
              minWidth:103,
              width:103,
              ellipsis:true,
              key: 'spec'
            },{
              title: i18n.t('product.type'),
              className:'tablePadding',
              minWidth:80,
              width:80,
              ellipsis:true,
              key: 'prodTypeName'
            },{
              title: i18n.t('product.productUnit'),
              className:'tablePadding',
              minWidth:70,
              width:70,
              ellipsis:true,
              key: 'prodUnitName'
            },{
              title: i18n.t('product.status'),
              className:'tablePadding',
              width:70,
              minWidth:70,
              ellipsis:true,
              key: 'useState',
              render:function(h,data){
                return h("span",data.row["useState"]==1?i18n.t('product.using'):i18n.t('product.stopUsing'))
              }
            },{
              title: i18n.t('product.openedInspection'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?100:120,
              width:this.$store.state.locale=='zh_CN'?100:120,
              ellipsis:true,
              key: 'examType',
              render:function(h,data){
                var str = [];
                var val = data.row.examType;
                if(!val){
                  return "-";
                }
                if(val & 0x1){
                  str.push(i18n.t('product.incoming'));
                }
                if(val & 0x2){
                  str.push(i18n.t('product.process'));
                }
                if(val & 0x4){
                  str.push(i18n.t('product.outgoing'));
                }
                return h("span",str.join(" | "))
              }
            },{
              title: i18n.t('product.version'),
              className:'tablePadding',
              minWidth:60,
              width:60,
              ellipsis:true,
              key: 'userVersion'
            },{
              title: i18n.t('product.operator'),
              className:'tablePadding',
              minWidth:60,
              width:60,
              ellipsis:true,
              key: 'updater'
            },{
              title: i18n.t('product.dateTime'),
              className:'tablePadding',
              minWidth:106,
              width:106,
              ellipsis:true,
              key: 'updateTime',
              render:function(h,data){
                let value = data.row.updateTime;
                let str = "-"
                if(value){
                  var unixTimestamp = new Date(value);
                  str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                }

                return h("span",str);
              }
            },{
              title: i18n.t('product.remarks'),
              className:'tablePadding',
              minWidth:70,
              // width:70,
              ellipsis:true,
              key: 'remark'
            }
          ]
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
            title: i18n.t('product.productNo'),
            className:'tablePadding',
            width:103,
            minWidth:103,
            ellipsis:true,
            key: 'no'
          },{
            title: i18n.t('product.productName'),
            className:'tablePadding',
            minWidth:103,
            width:103,
            ellipsis:true,
            key: 'name'
          },{
            title: i18n.t('product.productSpec'),
            className:'tablePadding',
            minWidth:103,
            width:103,
            ellipsis:true,
            key: 'spec'
          },{
            title: i18n.t('product.type'),
            className:'tablePadding',
            minWidth:80,
            width:80,
            ellipsis:true,
            key: 'prodTypeName'
          },{
            title: i18n.t('product.productUnit'),
            className:'tablePadding',
            minWidth:70,
            width:70,
            ellipsis:true,
            key: 'prodUnitName'
          },{
            title: i18n.t('product.status'),
            className:'tablePadding',
            minWidth:70,
            width:70,
            ellipsis:true,
            key: 'useState',
            render:function(h,data){
              return h("span",data.row["useState"]==1?i18n.t('product.using'):i18n.t('product.stopUsing'))
            }
          },{
            title: i18n.t('product.openedInspection'),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?100:130,
            width:this.$store.state.locale=='zh_CN'?100:130,
            ellipsis:true,
            key: 'examType',
            render:function(h,data){
              var str = [];
              var val = data.row.examType;
              if(!val){
                return "-";
              }
              if(val & 0x1){
                str.push(i18n.t('product.incoming'));
              }
              if(val & 0x2){
                str.push(i18n.t('product.process'));
              }
              if(val & 0x4){
                str.push(i18n.t('product.outgoing'));
              }
              return h("span",str.join(" | "))
            }
          },{
            title: i18n.t('product.operator'),
            className:'tablePadding',
            minWidth:70,
            width:70,
            ellipsis:true,
            key: 'updater'
          },{
            title: i18n.t('product.dateTime'),
            className:'tablePadding',
            minWidth:106,
            width:106,
            ellipsis:true,
            key: 'updateTime',
            render:function(h,data){
              let value = data.row.updateTime;
              let str = "-"
              if(value){
                var unixTimestamp = new Date(value);
                str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
              }

              return h("span",str);
            }
          },{
            title: i18n.t('product.remarks'),
            className:'tablePadding',
            minWidth:70,
            width:70,
            ellipsis:true,
            key: 'remark'
          }
        ],
        search: {
          query: "",
          fieldName: "",
          typeTree:[],
          userList:[],
          dates:[],
          typeDataLoading:false,
          useState:"",
          stateList:[
            {value:"",label:i18n.t('product.all')},
            {value:"1",label:i18n.t('product.using')},
            {value:"0",label:i18n.t('product.stopUsing')}
          ],
          examType:"",
          examTypeList:[
            {value:"",label:i18n.t('product.all')},
            {value:"1",label:i18n.t('product.iqc')},
            {value:"2",label:i18n.t('product.pqc')},
            {value:"4",label:i18n.t('product.oqc')},
            {value:"3",label:i18n.t('product.iqc')+"|"+i18n.t('product.pqc')},
            {value:"5",label:i18n.t('product.iqc')+"|"+i18n.t('product.oqc')},
            {value:"6",label:i18n.t('product.pqc')+"|"+i18n.t('product.oqc')},
            {value:"7",label:i18n.t('product.iqc')+"|"+i18n.t('product.pqc')+"|"+i18n.t('product.oqc')},
          ],
          data: {
            searchTypes: [
              {
                label: i18n.t('product.searchAll'),
                value: ""
              }, {
                label: i18n.t('product.productNo'),
                value: "no"
              }, {
                label: i18n.t('product.productName'),
                value: "name"
              },  {
                label: i18n.t('product.productSpec'),
                value: "spec"
              },  {
                label: i18n.t('product.productUnit'),
                value: "prodUnitName"
              },  {
                label: i18n.t('product.type'),
                value: "prodTypeName"
              },  {
                label: i18n.t('product.operator'),
                value: "updater"
              }, {
                label: i18n.t('product.remarks'),
                value: "remark"
              }
            ]
          }
        },
        permsCur:[
          'INSERT_PRODUCT',
          'SELECT_PRODUCT',
          'UPDATE_PRODUCT',
          'DELETE_PRODUCT',
          'EXPORT_PRODUCT',
          'SHARE_PRODUCT',
          "IMPORT_PRODUCT"
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "INSERT_PRODUCT":false,
          "SELECT_PRODUCT":false,
          "UPDATE_PRODUCT":false,
          "DELETE_PRODUCT":false,
          "EXPORT_PRODUCT":false,
          'SHARE_PRODUCT':false,
          "IMPORT_PRODUCT":false
        },

      }
    },//end data
    created(){
      let permsAll = this.$store.state.permissions;
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.refreshTypeTree();
      this.refreshData();
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
    },
    watch:{
      renderList:function(a,b){
        if(a){
          this.reset('transfer');//从编辑页面传值过来时，加上一个参数
        }
      }
    },
    computed:{
      treeData(){//需传输到树组件的数据
        let treeData={
          treeTitle:"分类",//树的根目录名称
          typeId:"prodTypeId",//类别id字段
          typeName:"name",//类名名称
          treeListUrl:"/basic/prodtype",//树的数据接口名称
          addTreeUrl:"/basic/prodtype",//增加树元素的接口名称
          editTreeUrl:"/basic/prodtype",//修改树元素的接口名称
          deleteTreeUrl:"/basic/prodtype/",//删除树元素的接口名称
          chooseNodeUrl:"/basic/productlist/",//选择树元素查找对应列表的接口名称
          pager:{
            current:this.table.pager.current,
            limit:this.table.pager.limit
          },
        }
        return treeData
      },
      treeStyle(){
        return {
          // "height":(9*40+159)+"px"//(Math.max(this.table.pager.rows,10)*40+144)+"px"
          "height":535+"px"//(Math.max(this.table.pager.rows,10)*40+144)+"px"
        };
      },
      renderList (){
        return this.$store.state.renderExamList;
      }
    },
  
    methods:{
      changeTreeNode(resp,item){//从树组件传输数据回来，渲染列表页
        // console.log(resp);
        let that = this;
        that.data = resp.data;
        that.snsData = item;
        that.table.pager.total = resp.pagerInfo.total;
        let rowCount = resp.data ? resp.data.length : 10;
        that.table.pager.rows = Math.max(rowCount, 6);
      },
      shareProd(){
        let that = this;
        that.companys=[];
        that.shareProdShow=true;
        that.$http.get('/tenant/tenant',{page:1,limit:9999999}).then(function(resp){
          that.companys=resp.data;
        })
      },
      saveShareProd(){
        let that = this;
        that.editModal.requesting=true;
        let shareTenantIds = that.shareProdCompany;
        that.$http.get('/basic/productlist?shareTenantIds[]='+shareTenantIds).then(function(resp){
          that.$Message.success(i18n.t('product.shareSuccess')+'!')
          that.shareProdShow=false;
          that.editModal.requesting=false;
        }).catch(function(err){
          that.editModal.requesting=false;
        })
      },
      exportStatement (index){
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        if(index == 1){
          url = '/basic/product/export/list';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          params.query = this.search.query;
          params.fieldName = this.search.fieldName;
          params.result = this.search.result;
          params.state = this.search.status;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            params.startDate = this.$iqis.utils.getDayStart(1,sdate);
            params.endDate = this.$iqis.utils.getDayEnd(edate);
          }
        }
        if(index == 2){
          url = '/basic/product/export/list';
          params.page = 1;
          params.limit = this.table.pager.total;
          params.query = this.search.query;
          params.fieldName = this.search.fieldName;
          params.result = this.search.result;
          params.state = this.search.status;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            params.startDate = this.$iqis.utils.getDayStart(1,sdate);
            params.endDate = this.$iqis.utils.getDayEnd(edate);
          }
        }

        this.$iqis.download(url,params,methods,()=>{}) //下载文件
      },
      // //点击跳转到输入的页码
      // goElevatorPage(){
      //   var evtObj;
      //   var thisPage=document.getElementById('pageId');
        // //console.log(thisPage);
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
      reset(method){
        this.table.selected='';
        this.tableEditDis=true;
        this.search.query='';
        this.search.fieldName='';
        this.search.useState="";
        this.search.examType="";
        this.search.dates=[];
        // this.refreshData();
        this.pageChange(1)
        this.$refs.treeCategory.refreshTypeTree()
        // //console.log(this.$props.params)
        let prodTypeId = this.$props.params && this.$props.params.prodTypeId;
        // //console.log(prodTypeId,'拿到修改/添加页传过来的产品类别Id')
        if(prodTypeId&&method=='transfer'){
          this.table.loading=true;
          this.refreshTypeTree(prodTypeId);
        }else{
          this.refreshTypeTree();
        }
      },
      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        // this.refreshSelectData();
        // this.refreshData();
        // this.treeSelectChange();
        this.$refs.treeCategory.treeSelectChange(null,this.table.pager.current,pageSize)//调用树组件的方法-刷新树的数据

      },
      pageChange(page){
        // this.refreshSelectData();
        this.table.pager.current = page;
        // this.refreshData();
        // this.treeSelectChange();
        this.$refs.treeCategory.treeSelectChange(null,this.table.pager.current,this.table.pager.limit)//调用树组件的方法-刷新树的数据
        


      },
      refreshData(){
        let that = this;
        that.table.selected='';
        that.tree.selected='';

        that.table.loading = true;

        let params = {};

        if(this.search.dates && this.search.dates[0]){
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];

          params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          params.endDate = this.$iqis.utils.getDayEnd(edate);
        }
        params.examType = this.search.examType;
        params.useState = this.search.useState;
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;
        params.customerId = this.$store.state.customerId||'';
        this.$http.get("/basic/product",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.loading = false;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
        })
        this.$store.commit('RENDER_CHANGE',false)
      },

      refreshTypeTree(selectValue){
        let that = this;
        that.tree.selected = false;
        let customerId = this.$store.state.customerId||'';
        let params={}
        params.limit=999999999;
        params.query='customerId='+customerId;
        this.$http.get("/basic/prodtype",{params:params}).then(function(resp){
          let root = {title:i18n.t('product.prodType'),selected: false,label:i18n.t('product.prodType'),value:0,expand:true};

          if(!selectValue){
            // //console.log("set root select:"+selectValue);
            root.selected = true;
            that.refreshData();
          }

          if(resp.data){

            if(selectValue){
              for(let i =0;i<resp.data.length;i++){
                // //console.log("set node select:"+selectValue);
                resp.data[i].selected = resp.data[i].prodTypeId == selectValue;
                that.tree.selected = true;
              }
              that.treeSelectChange(selectValue);
            }

            that.$iqis.utils.treeify(resp.data,root,"prodTypeId",function(item){
              return item.name;
            },"parentId");
          }
          // //console.log(root);
          that.category = [root];
        });

      },
      treeSelectChange(selectValue){
        let that=this;
        if(selectValue&&selectValue[0]&&!selectValue[0].prodTypeId){//1如果选中的是供应商类别，刷新全部分类数据
          // //console.log(selectValue,111111111111)
          // that.tree.selected=false;
          that.refreshData();
        }
        if(selectValue&&selectValue[0]&&selectValue[0].prodTypeId){//2如果选中的是其他分类，使selectValue等于该分类的Id
          selectValue=selectValue[0].prodTypeId;
        }
        if((selectValue!=''&&!isNaN(selectValue))||!selectValue){//3如果是选中的其他分类Id，或传过来的分类Id，掉接口拿到该分类的数据
          if(!selectValue){
            let sns=that.snsData;
            if(sns&&sns.length==1){
              selectValue=sns[0].prodTypeId;
              // //console.log(sns,22222222222);
              if(sns[0].title==i18n.t('product.prodType')){
                that.refreshData();
                return;
              }
            }else{
              that.refreshTypeTree();
              return;
            }
          }
          let params = {};
          params.page = that.table.pager.current;
          params.limit = that.table.pager.limit;
          params.customerId = this.$store.state.customerId||'';
          that.tree.selected=true
          let url="/basic/productlist/"
          // //console.log(selectValue,333333333)
          that.$http.get(url+selectValue,{params: params}).then((res)=>{
            that.data=res.data
            that.table.loading=false;
            that.table.pager.total = res.pagerInfo.total;
            // //console.log(res.pagerInfo.total,'监控翻页')
            let rowCount = res.data ? res.data.length : 10;
            that.table.pager.rows = Math.max(rowCount, 6);
          })
        }
        //   let that=this;
        //   that.table.selected='';
        //   let sns = that.snsData;
        //   if(sns.length==0||sns[0].title=='产品类别'){
        //     that.tree.selected='';
        //     that.refreshData();
        //   }else
        //   {
        //     that.refreshSelectData();
        //   }
        // },
        // refreshSelectData(){
        //   let that=this;
        //   let sns = that.snsData;
        //   if(sns.length==0||sns[0].title=='产品类别'){
        //     that.refreshData();
        //   }else {
        //     this.table.pager.current=1;
        //     this.table.pager.limit=10;
        //     let params = {};
        //     params.page = this.table.pager.current;
        //     params.limit = this.table.pager.limit;
        //     //console.log(params);
        //     that.tree.selected = true;
        //     let url = "/basic/productlist/";
        //     that.$http.get(url + sns[0].prodTypeId, {params: params}).then((resp) => {
        //       that.data = resp.data;
        //       that.table.pager.total = resp.pagerInfo.total;
        //       let rowCount = resp.data ? resp.data.length : 10;
        //       that.table.pager.rows = Math.max(rowCount, 6);
        //     });
        //   }
      },
      addProduct(){
        let that = this;

        let sns = that.snsData;
        let s_item = this.category[0];
        if(sns && sns.length > 0){
          s_item = sns[0];
        }
        let result = [];
        if(s_item) {
          result = this.$iqis.utils.findPathInTree(this.category[0], [], s_item.prodTypeId, "prodTypeId");
          // //console.log(result);
        }
        this.$emit("open-tab","product-list-add-"+result,i18n.t('product.add')+i18n.t('product.product'),"page-product-add",{productTypeValue:result});

      },
      editSelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        // //console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: '必须选择一条记录后才可以进行修改',
            desc: ''
          });
          return;
        }
        this.$emit("open-tab","product-list-update-"+selectedRow[0].productId,i18n.t('product.edit')+i18n.t('product.product'),"page-product-add",{productId:selectedRow[0].productId});
      },
      onDBClick(obj,index){
        this.$emit("open-tab","product-list-update-"+obj.productId,i18n.t('product.edit')+i18n.t('product.product'),"page-product-add",{productId:obj.productId});
      },
      copySelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        // //console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t('stopCopy'),
            desc: ''
          });
          return;
        }
        this.$emit("open-tab","product-list-copy-"+selectedRow[0].productId,i18n.t('product.copy')+i18n.t('product.product'),"page-product-add",{productId:selectedRow[0].productId});
      },
      showModal(d,pid){
        let result = this.$iqis.utils.findPathInTree(this.category[0],[],pid,"prodTypeId");
        result = result || [];
        if(!d){
          d = {productTypeValue:[],name:"",remark:"",prodTypeCode:''}
        }else{

        }
        d.productTypeValue = result;
        this.editModal.item = d;
        this.editModal.show = true;
        this.editModal.requesting = false;
        this.loadEditData();
      },
      deleteTreeNode(){
        let sns = that.snsData;
        let s_item = null;
        if(sns && sns.length > 0){
          s_item = sns[0];
        }

        if(s_item){
          let that = this;
          this.$http.delete("/basic/prodtype/"+s_item.value).then(function (resp) {
            that.$Message.success(i18n.t('product.deleteSuccess'));
            that.refreshTypeTree(null);
          });
        }

      },addSubNode(){

        let that = this;

        let sns = that.snsData;
        let s_item = this.category[0];
        if(sns && sns.length > 0){
          s_item = sns[0];
        }
        if(s_item){
          // //console.log(s_item);
          this.showModal(null,s_item.prodTypeId);
        }
      },editTreeSelected(){

        let that = this;

        let sns = that.snsData;
        let s_item = this.category[0];
        if(sns && sns.length > 0){
          s_item = sns[0];
        }
        // //console.log(sns)
        // //console.log(s_item.parentId)
        if(s_item){
          this.showModal(s_item,s_item.parentId);
        }
      },
      modalCancel(){

      },
      modalOk(){
        let that = this;
        // //console.log(this.editModal.item);
        this.editModal.requesting = false;
        this.editModal.item.parentId = null;
        if(this.editModal.item.productTypeValue && this.editModal.item.productTypeValue.length > 0){
          let plt = this.editModal.item.productTypeValue[this.editModal.item.productTypeValue.length-1];
          if(plt){
            this.editModal.item.parentId = plt;
          }
        }
        let params = [
          {type:'Empty',title:i18n.t('product.prodTypeName'),value:that.editModal.item.name},
          {type:'Name',title:i18n.t('product.prodTypeName'),value:that.editModal.item.name},
          {type:'Empty',title:i18n.t('product.prodTypeCode'),value:that.editModal.item.prodTypeCode},
          {type:'No',title:i18n.t('product.remarks'),value:that.editModal.item.remark},
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
        if(this.editModal.item.prodTypeId){
          that.$http.put("/basic/prodtype",that.editModal.item).then(function (resp) {
            that.refreshTypeTree(that.editModal.item);
            that.$Message.success(i18n.t('product.editSuccess'));
            that.editModal.show = false;
          });
        }else{
          that.$http.post("/basic/prodtype",that.editModal.item).then(function (resp) {
            that.refreshTypeTree(that.editModal.item.parentId);
            that.$Message.success(i18n.t('product.addSuccess'));
            that.editModal.show = false;
          });
        }

        //this.editModal = true;
      },
      loadProdTypeRender(label){
        //render-format
        if(!label || label.length == 0){
          return '-';
        }
        let result = label[label.length-1];

        if( (this.category.length > 0  && result == this.category[0].label)){
          return '-'
        }
        return result;
      },
      loadType(){
        this.search.typeDataLoading = true;
        let that = this;
        this.search.prodLineTypeList = [];
        this.$http.get("/basic/measunittype",{params:{limit:99999999}}).then(function (resp) {
          that.search.prodLineTypeList = resp.data;
          that.search.typeDataLoading = false;
        });
      },treeAddInit(e){
        this.tree.newNodeName = "";
        let that = this;
        let txt = this.$refs.addTxt;
        // //console.log(txt);
        this.$nextTick(function () {
          txt.focus();
        });
      },treeEditInit(e){
        let sns = that.snsData;
        let s_item = null;
        if(sns && sns.length > 0){
          s_item = sns[0];
        }

        if(s_item){
          this.tree.newNodeName = s_item.label;
          let that = this;
          let txt = this.$refs.editTxt;
          this.$nextTick(function () {
            txt.focus();
          });
        }
      },

      loadEditData(){
        this.editModal.dataLoading = false;
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
            delArr.push(this.$http.delete("/basic/product/"+ss[i].productId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('product.deleteSuccess'));
              // that.refreshSelectData();
              that.treeSelectChange();
            });
          }
        }
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
        // that.dataList.splice(-10,11)
        that.arrangement.data=that.dataList;
      },
      //排序确定
      RankOk(){
        if(this.arrangement.data.length===0){
         this.$Notice.warning({
            title: i18n.t('product.listNull'),
            desc: ''
          });
          return;
        }
        let data=[{type: 'selection',align: 'center',width:40,minWidth:40,maxWidth:40}]
        let dataList=data.concat(this.arrangement.data)
        this.table.columns=dataList;
        this.index=2;
        this.arrangement.state=false;
      },
      // 默认数据显示
      RankNo(){
        this.arrangement.state=false;
      },
      downloadTemplate () {
        let url = "/basic/product/export/template"
        this.$iqis.download(url,()=>{})
      },
      error(error,file) {
        this.$Notice.error({
          title: i18n.t('tips')+':',
          desc:file.message
        })
        this.beforeShow=true
        this.beforeShow1=true
        this.beforeShow2=true
        this.uploadFile=[]
        this.progressShow=true;
        $('.ivu-upload .iqis-table-footer-btn').show()

      },
      success(response) {
        this.beforeShow=false;
        this.beforeShow1=false;
        this.otherBeforeShow=true;
        this.dataFromBase = response.data
        this.progressShow=true;
    
      },
      hideBtn(){
        this.progressShow=false;
        $('.ivu-upload .iqis-table-footer-btn').hide()
      },
      openUpload(){
        this.uploadShow=true;
        this.beforeShow=true;
        this.beforeShow1=true;
        this.uploadFile=[]
        this.progressShow=true;
        $('.ivu-upload .iqis-table-footer-btn').show()
      },
  
     beforeUpload(file){
      let fileArr = file.name.split('.')
      if(file.name.split('.')[fileArr.length-1] != 'xls'){
        this.$Notice.warning({title:i18n.t('iqisUpload.format')})
        return;
      }
      this.uploadFile=file;
      return false;
     },
     shangchuan() {
       this.beforeShow1=false
       this.beforeShow2=false
     },
     sure() {
       this.otherBeforeShow=false
       this.beforeShow2=true
     },
     exceeded() {
       this.$Notice.warning({
          title: i18n.t('tips')+':',
          desc: i18n.t('iqisUpload.maxfile')
       });
       this.beforeShow=true
       this.beforeShow1=true
       this.beforeShow2=true
       this.uploadFile=[]
     }
    }
  }

</script>
<style>
.list_ok .dataItem {
    display: inline-block;
    padding: 5px 10px;
}
.list_no .process-item{
  margin-left: 10px;
  cursor: pointer;
  margin-bottom: 15px;
  width: auto!important;
}

.ivu-progress-success .ivu-progress-bg {
    background-color:rgb(65, 143, 238)!important;
}
.ivu-progress-success .ivu-progress-text {
    color: rgb(65, 143, 238)!important;
}
/*新增，修改切换组件，边个宽度不能自适应的问题。*/
.tableCustom .ivu-table-header table,.tableCustom .ivu-table-body table,.tableCustom .ivu-table-tip table{
  width: 100%!important;
}
</style>
