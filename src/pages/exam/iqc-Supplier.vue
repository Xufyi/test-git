<template>
  <div class="iqis-page">
    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <!-- <div class="iqis-bus-tree treeCustom" style="display: -webkit-flex;display: flex;flex-direction: column;flex: 0 0 185px;font-size: 14px;overflow: auto; border: 1px solid #e9eaec;margin-right: 16px;margin-top:11px;padding-left: 10px; height:551px;">
          <div class="iqis-page-tool-row iqis-tree-tool" style="flex: 0 0 47px;" >
            <div style="display: -webkit-flex;display: flex;justify-content:space-between;width: 100%;">
              <div class="iqis-page-tool-primary" style="padding: 12px 6px;">
                <Button type="ghost" @click="addSubNode" v-if="permsBtn.INSERT_SUPPLIER">{{$t('iqc.addType')}}</Button>
              </div>
              <div class="iqis-page-tool-second" style="padding: 12px 10px;">
                <Button type="ghost"  v-if='permsBtn.UPDATE_SUPPLIER' :disabled="!tree.selected" @click="editTreeSelected" >{{$t('iqc.edit')}}</Button>
                <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                  confirm
                  :title="i18n.t('iqc.confirmDeleteType')"
                  placement="bottom-start"
                  @on-ok="deleteTreeNode">
                  <Button type="ghost" v-if='permsBtn.DELETE_SUPPLIER' :disabled="!tree.selected">{{$t('iqc.delete')}}</Button>
                </Poptip>
              </div>
            </div>
          </div>
          <div style="flex: 1 1 100px;overflow: auto;">
            <Tree ref="tree" :data="category" :multiple="false" @on-select-change="pageChange(1)" ></Tree>
          </div>
        </div> -->
        <TreeCategory ref="treeCategory" :treeData="treeData" v-on:changeTreeNode="changeTreeNode"></TreeCategory><!--树组件引用-->
          <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">
        <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
          <Date-picker type="daterange" format="yyyy-MM-dd" v-model="search.dates" :placeholder="i18n.t('iqc.dateFilter')" style="width: 210px;"></Date-picker>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('iqc.searchAll')" slot="prepend" style="width: 130px;text-align: left">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="table.selected='';refreshData(1);refreshTypeTree();">{{$t('iqc.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t('iqc.reset')}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <Button type="ghost" icon="plus" @click="addIqc" v-if="permsBtn.INSERT_SUPPLIER">{{$t('iqc.add')}}</Button>
        <Button style="margin:0 8px;" type="ghost" icon="edit" v-if="permsBtn.UPDATE_SUPPLIER" :disabled="tableEditDis" @click="editSelectRow">{{$t('iqc.edit')}}</Button>
        <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
          confirm
          title="确定要删除选择的项吗?"
          placement="bottom-start"
          @on-ok="deleteTableSelected">
          <Button type="ghost" icon="trash-a" v-if="permsBtn.DELETE_SUPPLIER" :disabled="!table.selected">{{$t('iqc.delete')}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second" style="font-size:0;">
        <Button type="text"  icon="refresh" @click="reset">{{$t('iqc.refreshData')}}</Button>
        <Button type="primary" @click="rank">{{$t('iqc.customList')}}</Button>
        <!-- <Dropdown style="margin-left: 20px"> -->
          <!-- <Button type="ghost" v-if="permsBtn.EXPORT_SUPPLIER" style="margin-left: 8px" @click="exportStatement(1)">{{$t('iqc.export')}}</Button> -->
          <Dropdown style="margin-left: 8px" v-if="permsBtn.IMPORT_SUPPLIER">
          <Button type="ghost">{{$t('iqc.export')}}<Icon style="margin-left:10px;" type="arrow-down-b"></Icon></Button>
          <DropdownMenu slot="list">
              <DropdownItem>
                <Button type="text" @click="exportStatement(1)">{{$t('iqc.thisPage')}}</Button>
              </DropdownItem>
            </DropdownMenu>
            <DropdownMenu slot="list">
              <DropdownItem>
                <Button type="text" @click="exportStatement(2)">{{$t('iqc.allData')}}</Button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
         
        <Dropdown style="margin-left: 8px" v-if="permsBtn.IMPORT_SUPPLIER">
          <Button type="ghost">{{$t('iqisUpload.importData')}}<Icon style="margin-left:10px;" type="arrow-down-b"></Icon></Button>
          <DropdownMenu slot="list">
            <DropdownItem>
              <Button type="text" @click="downloadTemplate()">{{$t('iqisUpload.downloadTheTemplate')}}</Button>
            </DropdownItem>
          </DropdownMenu>
          <DropdownMenu slot="list">
            <DropdownItem>
              <Button type="text" @click="openUpload()">{{$t('iqisUpload.importData')}}</Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      
    </div>
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>

          <!-- <div style="display:inline-block;"> -->
            <div style="padding: 20px 0 20px 0px;">
              <Page v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
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
        <!-- <Checkbox-group v-model.sync="arrangement.data">
        <Checkbox v-for="(item,index) in arrangement.data1" :label="item"  :key="index">{{item.title}}</Checkbox>
         </Checkbox-group> -->
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

    <div class="arrangement-dialog-from">
    	<Modal
      :title="prodBatch.title"
      v-model="prodBatch.show"
      class="rankBox"
      :mask-closable="false"
      :width="600">
      	<Row type="flex" :gutter="40">
        <i-col span="12">{{$t('iqc.supplierTypeName')}}</i-col>
        <i-col span="12">{{$t('iqc.supplierTypeCode')}}</i-col>
      </Row>
       <Row type="flex" :gutter="40">
        <i-col span="12">
        	<Input v-model="ruleForm.manufacturerTypeName" style="width: 100%;"></Input>
        </i-col>
        <i-col span="12">
        <i-input v-model="ruleForm.manufacturerTypeNum" style="width: 100%;"></i-input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">{{$t('iqc.category')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" >
        <i-col span="24">
          <Cascader :transfer="false"  v-model="ruleForm.item.parentId" :data="category"
                    :render-format = "loadTypeRender"
                    change-on-select :clearable="false" style="width: 100%"></Cascader>
        </i-col>
      </Row>
      <div slot="footer">
        <Button type="primary" size="large" @click="modalOk" :loading="prodBatch.dataLoading">{{$t('iqc.confirm')}}</Button>
        <Button type="text" size="large" @click="prodBatch.show=false">{{$t('iqc.cancel')}}</Button>
      </div>
      </Modal>
    </div>
    <Modal v-model="uploadShow" :title="i18n.t('iqisUpload.importSupplierList')" :mask-closable="false" :closable="false">
        <div v-if="!progressShow" style="font-size:14px;text-align:center">上传中，请勿刷新页面！</div>
        <div v-if="beforeShow" style="text-align:center">
          <Upload ref="upload" 
                  :action="uploadUrl" 
                  :max-size="15360"
                  :format="['xls']" 
                  :headers='{"x-access-token":$http.defaults.headers["x-access-token"]}'
                  :before-upload="beforeUpload"
                  :on-error="error"
                  :on-success="success"
                  :on-exceeded-size="exceeded"
                  :on-progress="hideBtn"
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
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import draggable from 'vuedraggable'
  import md5 from 'js-md5';
  import $ from 'jquery'
  import TreeCategory from "../../components/treeCategory/TreeCategory"
  export default {
    props:['params'],
    components: {
      Input,draggable,TreeCategory
    },
    data: function () {
      let vm = this;
      return {
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        snsData:null,
        data:[],
        dataFromBase:'',
        uploadShow:false,
        uploadUrl:process.env.API_HOST+'/bas/manufacturer/import',
        uploadFile:[],
        beforeShow:true,
        progressShow:true,
        beforeShow1:true,
        beforeShow2:true,
        otherBeforeShow:false,
        i18n:window.i18n,
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
            },{
              title: i18n.t('iqc.supplierNo'),
              className:'tablePadding',
              width:86,
              minWidth:86,
              ellipsis:true,
              key: 'manufacturerNum',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.supplierAbbr'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?96:145,
              minWidth:this.$store.state.locale=='zh_CN'?96:145,
              ellipsis:true,
              key: 'manufacturerAbbreviation',
             // vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
              render:(h, params) => {
                            return h(
                                'a', {
                                    props: {
                                        type: 'text',
                                        fontSize:'14px!important',
                                        stlye:'font-size:14px',
                                        href:'javascript:void(0)'
                                    },
                                    on: {
                                        click: () => {
                                          vm.$http.get('/tenant/tenant/?manufacturerName='+params.row.manufacturerName).then(function(resp1){

                                            if(!resp1.data){
                                              vm.$Notice.warning({title:i18n.t('iqc.notRegister')})
                                              return
                                            }
                                            let tenant = resp1.data.account;
                                            let account = 'insideAccount'+vm.tenantId;
                                            let password = md5('123456');
                                            vm.$http.get('/bas/customer/isAuthorizationCustomer?customerTenantId='+params.row.supplierTenantId).then(function(resp2){
                                              if(!resp2.data){
                                                vm.$Notice.warning({title:i18n.t('iqc.notPerms')})
                                                return
                                              }
                                              let url = '#'+vm.$route.fullPath+"?visitoMode=true";//window.location.protocol+'//'+window.location.host+/
                                              $('body').append($('<a href="'+url+'" style="display:none;font-size:14px" target="_blank" id="openWin"></a>'))
                                              vm.$http.post("/user/login",{tenant,account,password}).then(function (resp3) {
                                                vm.$SessionStorage.set("visitoModeToken",resp3.data);
                                                document.getElementById("openWin").click();//点击事件
                                                $('#openWin').remove();

                                                // var tempwindow=window.open();
                                                // tempwindow.location=url;

                                                // window.open(url)

                                              }).catch(function (error) {
                                                //console.log(error);
                                              });
                                            })
                                            
                                          })
                                        }
                                    }
                                }, params.row.manufacturerAbbreviation
                            );
                        }
            },{
              title: i18n.t('iqc.supplierFullName'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?240:260,
              minWidth:this.$store.state.locale=='zh_CN'?240:260,
              ellipsis:true,
              key: 'manufacturerName',
              render: (h, params)=>{
                return h("span",{domProps:{"innerHTML":params.row["manufacturerName"]+"<br>"+params.row["manufacturerEngName"]},style:{textAlign:'left',display:'block'}})
              }
            },{
              title: i18n.t('iqc.category'),
              className:'tablePadding',
              width:100,
              minWidth:100,
              ellipsis:true,
              key: 'manufacturerTypeName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.reviewResult'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?100:150,
              ellipsis:true,
              key: 'reviewLevel',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.scoreRating'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?100:150,
              ellipsis:true,
              key: 'scoringLevel',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.dateTime'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?106:130,
              minWidth: this.$store.state.locale=='zh_CN'?106:130,
              ellipsis:true,
              key: 'operationDate',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = "-"
                if(value){
                  var unixTimestamp = new Date(value);
                  str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                }
                return h("span",str);
              }
            }
          ]
        },
        editModal:{
          dataLoading:true,
          item:{},
          show:false,
          requesting:false
        },
        prodBatch:{
            show:false,
            title:'',
            dataLoading:false,
            btnState:'',
            CKstate:false,
            CKtypeID:'',
        },
        ruleForm:{
        	manufacturerTypeName:'',
        	manufacturerTypeNum:'',
        	item:{},
        	remark:'',
        },
        ListData:[],
   		  TypeData:[],
         category:[{
          title: '组织架构树',
          loading: false,
          children: []
        }],
        tree:{
          newNodeName:"",
          add:false,
          edit:false,
          selected:false
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
              title: i18n.t('iqc.supplierNo'),
              className:'tablePadding',
              width:86,
              minWidth:86,
              ellipsis:true,
              key: 'manufacturerNum',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.supplierAbbr'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?90:140,
              minWidth:this.$store.state.locale=='zh_CN'?90:140,
              ellipsis:true,
              key: 'manufacturerAbbreviation',
             // vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
              render:(h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        fontSize:'14px!important',
                                        stlye:'font-size:14px'
                                    },
                                    on: {
                                        click: () => {
                                          let tenant = 'sf2002';
                                          let account = 'sf2002';
                                          let password=md5('123456');
                                          let url = window.location.protocol+'//'+window.location.host+'/#'+vm.$route.fullPath+"?visitoMode=true";
                                          $('body').append($('<a href="'+url+'" style="display:none;font-size:14px" target="_blank" id="openWin"></a>'))
                                          this.$http.post("/user/login",{tenant,account,password}).then(function (resp) {
                                              vm.$SessionStorage.set("visitoModeToken",resp.data);
                                              document.getElementById("openWin").click();//点击事件
                                              $('#openWin').remove();
                                            }).catch(function (error) {
                                              //console.log(error);
                                            });
                                        }
                                    }
                                }, params.row.manufacturerAbbreviation),
                            ]);
                        }
            },{
              title: i18n.t('iqc.supplierFullName'),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?240:270,
              minWidth:this.$store.state.locale=='zh_CN'?240:270,
              ellipsis:true,
              key: 'manufacturerName',
              render: (h, params)=>{
                return h("span",{domProps:{"innerHTML":params.row["manufacturerName"]+"<br>"+params.row["manufacturerEngName"]},style:{textAlign:'left',display:'block'}})
              }
            },{
              title: i18n.t('iqc.category'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'manufacturerTypeName',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.reviewResult'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:180,
              ellipsis:true,
              key: 'reviewLevel',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.scoreRating'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:180,
              ellipsis:true,
              key: 'scoringLevel',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.dateTime'),
              className:'tablePadding',
              width:106,
              minWidth: 106,
              ellipsis:true,
              key: 'operationDate',
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
              title: i18n.t('iqc.supplieraddress'),
              className:'tablePadding',
              width:240,
              minWidth:240,
              ellipsis:true,
              key: 'address',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.contact'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'contacts',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.phone'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?100:130,
              ellipsis:true,
              key: 'phone',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            },{
              title: i18n.t('iqc.remarks'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'remark',
              render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
            }
        ],
        search: {
          query: "",
          fieldName: "",
          result:"",
          status:"",
          userList:[],
          dates:[],
          tos:[
            {value:"",label:i18n.t('iqc.all')},
            {value:"1",label:i18n.t('iqc.insideHandle')},
            {value:"2",label:i18n.t('iqc.supplier')}
          ],
          optList:[
            {value:"",label:i18n.t('iqc.all')},
            {value:i18n.t('iqc.special'),label:i18n.t('iqc.special')},
            {value:i18n.t('iqc.release'),label:i18n.t('iqc.release')},
            {value:i18n.t('iqc.rework'),label:i18n.t('iqc.rework')},
            {value:i18n.t('iqc.filter'),label:i18n.t('iqc.filter')},
            {value:i18n.t('iqc.return'),label:i18n.t('iqc.return')},
            {value:i18n.t('iqc.scrap'),label:i18n.t('iqc.scrap')}
          ],
          data: {
            searchTypes: [
              {
                label: i18n.t('iqc.searchAll'),
                value: ""
              },{
                label: i18n.t('iqc.supplierNo'),
                value: "manufacturerNum"
              },{
                label: i18n.t('iqc.supplierAbbr'),
                value: "manufacturerAbbreviation"
              },{
                label: i18n.t('iqc.supplierFullName'),
                value: "manufacturerName"
              },{
                label: i18n.t('iqc.category'),
                value: "manufacturerTypeName"
              },{
                label: i18n.t('iqc.reviewResult'),
                value: "reviewLevel"
              },{
                label: i18n.t('iqc.scoreRating'),
                value: "scoringLevel"
              },{
                label: i18n.t('iqc.remarks'),
                value: "remark"
              }
            ]
          }
        },
        permsCur:[
          "DELETE_SUPPLIER",
          "SELECT_SUPPLIER",
          "UPDATE_SUPPLIER",
          "EXPORT_SUPPLIER",
          "INSERT_SUPPLIER",
          "IMPORT_SUPPLIER"
        ],
        permsBtn:{
          "DELETE_SUPPLIER":false,
          "SELECT_SUPPLIER":false,
          "UPDATE_SUPPLIER":false,
          "EXPORT_SUPPLIER":false,
          "INSERT_SUPPLIER":false,
          "IMPORT_SUPPLIER":false
        },
        tenantId:'',
      }

      
    },//end data
    created(){
      // //console.log(process.env.API_HOST)
      let that = this;
      this.refreshData();
      this.refreshTypeTree();
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      // 根据登录用户查询本公司的tenantId
      that.$http.get("/tenant/user/profile").then(function (resp) {
        that.tenantId=resp.data.tenantId;
      })
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
    },
    watch:{
      renderList:function(a,b){
        if(a){
          this.reset('transfer');
        }
      }
    },
    computed:{
      treeData(){//需传输到树组件的数据
        let treeData={
          treeTitle:"分类",//树的根目录名称
          typeId:"manufacturerTypeId",//类别id字段
          typeName:"manufacturerTypeName",//类名名称
          treeListUrl:"/bas/manufacturerType",//树的数据接口名称
          addTreeUrl:"/bas/manufacturerType",//增加树元素的接口名称
          editTreeUrl:"/bas/manufacturerType",//修改树元素的接口名称
          deleteTreeUrl:"/bas/manufacturerType/",//删除树元素的接口名称
          chooseNodeUrl:"/bas/manufacturerlist/",//选择树元素查找对应列表的接口名称
          pager:{
            current:this.table.pager.current,
            limit:this.table.pager.limit
          },
        }
        return treeData
      },
      renderList (){
        return this.$store.state.renderExamList;
      }
    },

    methods:{
      changeTreeNode(resp,item){//从树组件传输数据回来，渲染列表页
        // console.log(resp);
        let that = this;
        that.snsData = item;
        console.log(that.snsData,"IOPOIOPPOIIOO");
        that.data = resp.data;
        that.table.pager.total = resp.pagerInfo.total;
        let rowCount = resp.data ? resp.data.length : 10;
        that.table.pager.rows = Math.max(rowCount, 6);
      },
      
      reset(method){
        // //console.log(this.$props,2222)
        
        this.table.selected='';
        this.search.dates=[];
        this.search.fieldName='';
        this.search.query='';
        this.tableEditDis=true;
        this.refreshData();
        let manufacturerTypeId = this.$props.params && this.$props.params.manufacturerTypeId;
        if(manufacturerTypeId&&method=='transfer'){
          this.table.loading=true;
          this.refreshTypeTree(manufacturerTypeId);
        }else{
          this.refreshTypeTree();
        }
        this.pageChange(1)
        this.$refs.treeCategory.refreshTypeTree()

      },
      exportStatement (index){
        //console.log(index,'index');
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        if(index == 1){
          url = '/bas/manufacturer/export/list';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          params.query = this.search.query;
        }
        if(index == 2){
          url = '/bas/manufacturer/export/list';
          params.page = 1;
          params.limit = this.table.pager.total;
          params.query = this.search.query;
        }

        this.$iqis.download(url,params,methods,()=>{}) //下载文件
      },
      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        // this.refreshData();
        // this.treeSelectChange();
        this.$refs.treeCategory.treeSelectChange(null,this.table.pager.current,pageSize)//调用树组件的方法-刷新树的数据
        
      },
      pageChange(page){
        this.table.pager.current = page;   
        // this.refreshData();                
        // this.treeSelectChange();
        this.$refs.treeCategory.treeSelectChange(null,this.table.pager.current,this.table.pager.limit)//调用树组件的方法-刷新树的数据
      },
      //左侧树结构--kai
      refreshTypeTree(selectValue){
        
        //console.log(selectValue)
        let that = this;
        that.tree.selected = false;
        this.$http.get("/bas/manufacturerType",{params:{limit:99999999,page:1}}).then(function(resp){
          let root = {title:i18n.t('iqc.supplierType'),selected: false,label:i18n.t('iqc.supplierType'),value:0,expand:true};
          if(!selectValue){
            root.selected = true;
            that.refreshData();
          }
          if(resp.data){
            if(selectValue){
              for(let i =0;i<resp.data.length;i++){
                resp.data[i].selected = resp.data[i].manufacturerTypeId == selectValue;
                that.tree.selected = true;
              }
              // let manufacturerTypeId = this.$props.params && this.$props.params.manufacturerTypeId;
              //   if(manufacturerTypeId){
              //     this.treeSelectChange(manufacturerTypeId);
              //   }
              // if(resp.data[i].selected==true){    
              that.treeSelectChange(selectValue);
              // }
            }
            
            
            that.$iqis.utils.treeify(resp.data,root,"manufacturerTypeId",function(item){
             return "["+item.manufacturerTypeNum+"]"+item.manufacturerTypeName;
             
						//return item.manufacturerTypeNum;
            },"parentId");
          }
          that.category = [root];
          
          
          // //console.log(that.category);
          
        });
      },
     showModal(d,pid,btnStates){
       	let that=this
        let result = this.$iqis.utils.findPathInTree(this.category[0],[],pid,"manufacturerTypeId");
        //console.log(result);
        result = result || [];
        if(!d){
          d = {parentId:[],manufacturerTypeName:"",remark:"",manufacturerTypeNum:''}
        }else{

        }
        result.splice(-1,1);
        //console.log(result);
        
        d.parentId = result;
        if(btnStates=='put'){
        	that.ruleForm.manufacturerTypeName=d.manufacturerTypeName
        	that.ruleForm.manufacturerTypeNum=d.manufacturerTypeNum
        }
        this.ruleForm.item = d;
        that.prodBatch.show=true;
      },
      addSubNode(){ //添加子菜单
			 let that=this;
			 that.prodBatch.title=i18n.t('iqc.addSupplierType')
			 that.prodBatch.btnState='post'
       let sns = that.$refs.tree.getSelectedNodes();
       that.ruleForm.manufacturerTypeName=''
       that.ruleForm.manufacturerTypeNum=''
			 that.showModal(null,sns[0].manufacturerTypeId,that.prodBatch.btnState);
      },
      editTreeSelected(){ //修改
        let that=this;
        let sns = that.snsData;
        that.prodBatch.btnState='put'
        that.prodBatch.title=i18n.t('iqc.editSupplierType')
        let s_item = this.category[0];
          if(sns && sns.length > 0){
            s_item = sns[0];
          }
          if(s_item){
            this.showModal(s_item,sns[0].manufacturerTypeId,that.prodBatch.btnState);
          }
        that.prodBatch.show=true;
        },
      deleteTreeNode(){  //删除
    	let that=this;
      let sns = that.snsData;
      let url="/bas/manufacturerType/"
      that.$http.delete(url+sns[0].manufacturerTypeId).then((res)=>{
      	that.$Message.success(i18n.t('iqc.deleteSuccess'));
      	that.tree.selected=false
      	that.refreshTypeTree();
      })
      },
    	treeSelectChange(selectValue){
        
        let that=this;
        // //console.log(selectValue,'供应商类别/manufacturerTypeId/传过来的数字Id')
        if(selectValue&&selectValue[0]&&!selectValue[0].manufacturerTypeId){//1如果选中的是供应商类别，刷新全部分类数据
          that.tree.selected=false;
          that.refreshData();
        }
        if(selectValue&&selectValue[0]&&selectValue[0].manufacturerTypeId){//2如果选中的是其他分类，使selectValue等于该分类的Id
          selectValue=selectValue[0].manufacturerTypeId;       
        }
        if((selectValue!=''&&!isNaN(selectValue))||!selectValue){//3如果是选中的其他分类Id，或传过来的分类Id，掉接口拿到该分类的数据
          if(!selectValue){
            let sns=that.snsData;
            if(sns&&sns.length==1){
              selectValue=sns[0].manufacturerTypeId;
              // //console.log(sns,22222222222);
              if(sns[0].title==i18n.t('iqc.supplierType')){
                that.refreshData();
                return;
              }
            }else{
              that.refreshTypeTree();
              return;
            }
          }
          let params = {};
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          let ListData=[];
          let TypeData=[];
          let idValueMap = [];
          that.prodBatch.CKstate=true;
          that.prodBatch.CKtypeID=selectValue;
          that.tree.selected=true
          //console.log(selectValue,'selectValue--------------');
          let url="/bas/manufacturerlist/"
          that.$http.get(url+selectValue,{params: params}).then((res)=>{
            that.data=res.data
            //console.log(res.data,'res.data')
            that.table.loading=false;
            that.table.pager.total = res.pagerInfo.total;
            let rowCount = res.data ? res.data.length : 10;
            that.table.pager.rows = Math.max(rowCount, 6);
          })
        }
      
        // let sns = that.snsData;
        // setTimeout(() => {]
        // if(!typeId[0]||!typeId[0].manufacturerTypeId){
        //   if(sns.length==0||sns[0].title==i18n.t('iqc.supplierType')){//如果选中的是供应商类别，刷新全部分类数据
        //     that.tree.selected=false;
        //     that.refreshData();
        //   }else{
        //     typeId=sns[0].manufacturerTypeId;
        //   }
        // }

        // //console.log(typeId,22222222222222)
        // //console.log(sns)        
        // if(!typeId){
        //   return;
        // }
        // if(typeId){
        //   // //console.log(typeId,22222)
        //   this.table.pager.current = 1;
        //   this.table.pager.limit = 10;
        //   let params = {};
        //   params.page = this.table.pager.current;
        //   params.limit = this.table.pager.limit;
        //   let ListData=[];
        //   let TypeData=[];
        //   let idValueMap = [];
        //   that.prodBatch.CKstate=true
        //   that.prodBatch.CKtypeID=sns[0].manufacturerTypeId
        //   // let typID=sns[0].manufacturerTypeId;
        //   if(typeId[0]){
        //     typeId=typeId[0].manufacturerTypeId
        //   }
        //   that.tree.selected=true
        //   let url="/bas/manufacturerlist/"
        //   that.$http.get(url+typeId,{params: params}).then((res)=>{
        //     that.data=res.data
        //     that.table.loading=false;
        //     that.table.pager.total = res.pagerInfo.total;
        //     let rowCount = res.data ? res.data.length : 10;
        //     that.table.pager.rows = Math.max(rowCount, 6);
        //   })
        // }
        // },500);
    	},
       loadTypeRender(label){
        if(!label || label.length == 0){
          return '-';
        }
        let result = label[label.length-1];
        if( (this.category.length > 0  && result == this.category[0].label)){
          return '-'
        }
        return result;
      },
      modalOk(){
        let that=this;
        let state=true;
        let params = [
          {type:'Empty',title:i18n.t('iqc.supplierTypeName'),value:that.ruleForm.manufacturerTypeName},
          {type:'Name',title:i18n.t('iqc.supplierTypeName'),value:that.ruleForm.manufacturerTypeName},
          {type:'Empty',title:i18n.t('iqc.supplierTypeCode'),value:that.ruleForm.manufacturerTypeNum},
          {type:'No',title:i18n.t('iqc.supplierTypeCode'),value:that.ruleForm.manufacturerTypeNum},
        ]
      
        for(let i in params){
          state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
            that.$Notice.warning({title:tips})//,duration: 0
          })
          if(!state){
            return;
            break;
          }
        }
        // //console.log(that.ruleForm.manufacturerTypeName,'--------------',that.ruleForm.manufacturerTypeNum)
        let sns = that.snsData;
        let manufacturerTypeId = sns[0].manufacturerTypeId;
        let plt =that.ruleForm.item.parentId[that.ruleForm.item.parentId.length-1];
        if(!plt){plt=0;}
        let newData={
          manufacturerTypeNum:that.ruleForm.manufacturerTypeNum,
          manufacturerTypeName:that.ruleForm.manufacturerTypeName,
          parentId:plt
        }
        if(that.prodBatch.btnState=='put'){
          newData.manufacturerTypeId=manufacturerTypeId;          
        	that.$http.put("/bas/manufacturerType",newData).then((res)=>{
	        that.$Message.success(i18n.t('iqc.editSuccess'));
	        that.prodBatch.show=false;
	        that.refreshTypeTree();
	        })
        }else if(that.prodBatch.btnState=='post'){
	        that.$http.post("/bas/manufacturerType",newData).then((res)=>{
	        that.$Message.success(i18n.t('iqc.addSuccess'));
	        that.prodBatch.show=false;
	        that.refreshTypeTree();
	        })
        }
      },
      //左侧树结构--end
      addIqc(){
        let that = this;
        console.log(that.snsData,"that.snsData");
        let sns=[{manufacturerTypeId:null}];
        if(that.snsData && that.snsData.length > 0){
          
          sns = that.snsData;
        }
        console.log(sns,"ERTYUIOP");
        
        // //console.log(sns,'寻找类别')
        // let s_item = this.category[0];
        // if(sns && sns.length > 0){
        //   s_item = sns[0];
        // }
        // let result = [];
        // if(s_item) {
        //   result = this.$iqis.utils.findPathInTree(this.category[0], [], s_item.manufacturerTypeId, "manufacturerTypeId");
        //   //console.log(result);
        // }
          this.$emit("open-tab","exam-iqc-Supplier-update",i18n.t('iqc.addSupplier'),"page-exam-iqc-Supplier-update",{manufacturerTypeId:sns[0].manufacturerTypeId});
      },
      editSelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection();
        //console.log(selectedRow)
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: '必须选择一条记录后才可以进行修改',
            desc: ''
          });
          return;
        }
        this.$emit("open-tab","exam-iqc-Supplier-update-"+selectedRow[0].manufacturerId,i18n.t('iqc.editSupplier')+"-"+selectedRow[0].manufacturerAbbreviation,"page-exam-iqc-Supplier-update",{manufacturerId:selectedRow[0].manufacturerId,proID:2});
      },
            /**双击打开 */
      onDBClick(obj,index){
        this.$emit("open-tab","exam-iqc-Supplier-update-"+obj.manufacturerId,i18n.t('iqc.editSupplier')+"-"+obj.manufacturerAbbreviation,"page-exam-iqc-Supplier-update",{manufacturerId:obj.manufacturerId,proID:2});
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
            delArr.push(this.$http.delete("/bas/manufacturer/"+ss[i].manufacturerId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('iqc.deleteSuccess'));
              	that.refreshData();
              	that.refreshTypeTree();
              	that.table.selected='';
              	if(that.prodBatch.CKstate==true){
              		that.treeSelectChange(that.prodBatch.CKtypeID)
              	}
            });
          }
        }
      },
//    loadEditData(){
//      this.editModal.dataLoading = true;
//
//      let that = this
//      this.$http.get("/tenant/user",{params:{limit:99999999}}).then(function (resp) {
//        if(resp.data){
//          that.search.userList = resp.data;
//          that.editModal.dataLoading = false;
//        }
//      });
//    },
      refreshData(index){
        let that = this;
        that.table.loading = true;
        let params = {};
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;
        let date=that.search.dates;
        if(this.search.dates && this.search.dates[0]){
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];

          params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          params.endDate = this.$iqis.utils.getDayEnd(edate);
        }
        this.$http.get("/bas/manufacturer",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
        })
        that.$store.commit('RENDER_CHANGE',false)
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
        that.urlProduct.dataList.splice(-4,4)
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
      downloadTemplate () {
        // this.$http.get("/bas/manufacturer/export/template").then(function(aa) {
        //   this.$iqis.download('/bas/manufacturer/export/template',()=>{})
        // })
        let url = "/bas/manufacturer/export/template"
        this.$iqis.download(url,()=>{}) //下载文件
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
    },
    //end methods




  }

</script>
<style scoped>
  .tableResponse .ivu-table-body{
    height:auto;
  }
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
<style>
  .ivu-table-cell.ivu-table-cell-ellipsis .ivu-btn{font-size:14px!important;}
  .tableCustom .ivu-table-cell.ivu-table-cell-ellipsis .ivu-btn{font-size:12px!important;padding:0;}
  .ivu-progress-success .ivu-progress-bg{background:rgb(65, 143, 238)!important;}
  .ivu-progress-success .ivu-progress-text{color:rgb(65, 143, 238)!important;}
</style>
