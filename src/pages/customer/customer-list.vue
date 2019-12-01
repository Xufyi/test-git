<template>
  <div class="iqis-page">

    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <!-- <div class="iqis-bus-tree treeCustom" style="display: -webkit-flex;display: flex;flex-direction: column;flex: 0 0 185px;font-size: 14px;overflow: auto; border: 1px solid #e9eaec;margin-right: 16px;margin-top:11px;padding-left: 10px;height:500px" :style="treeStyle">
          <div class="iqis-page-tool-row iqis-tree-tool" style="flex: 0 0 47px;" >
            <div style="display: -webkit-flex;display: flex;justify-content:space-between;width: 100%;">
              <div class="iqis-page-tool-primary" style="padding: 12px 6px;">
                <Button type="ghost" @click="addSubNode" v-if="permsBtn.INSERT_CUSTOMER">{{$t('customer.addType')}}</Button>
              </div>
              <div class="iqis-page-tool-second" style="padding: 12px 10px;">
                <Button type="ghost" v-if="permsBtn.UPDATE_CUSTOMER" :disabled="!tree.selected" @click="editTreeSelected" >{{$t('customer.edit')}}</Button>
                <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                  confirm
                  :title="i18n.t('customer.confirmDeleteType')"
                  placement="bottom-start"
                  @on-ok="deleteTreeNode">
                  <Button type="ghost" v-if="permsBtn.DELETE_CUSTOMER" :disabled="!tree.selected">{{$t('customer.delete')}}</Button>
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
              <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('customer.dateFilter')" style="width: 210px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('customer.searchAll')" slot="prepend" style="width: 130px;text-align: left">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
              <Button style="margin-right:8px;" type="primary" @click="refreshTypeTree();refreshData()">{{$t('customer.search')}}</Button>
              <Button type="ghost" @click="reset">{{$t('customer.reset')}}</Button>
            </div>
          </div>

          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <Button type="ghost" icon="plus" v-if="permsBtn.INSERT_CUSTOMER" @click="addCust">{{$t('customer.add')}}</Button>
              <Button style="margin:0 8px;" type="ghost" icon="edit" v-if="permsBtn.UPDATE_CUSTOMER" :disabled="tableEditDis" @click="editSelectRow" >{{$t('customer.edit')}}</Button>
              <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                confirm
                :title="i18n.t('customer.confirmDelete')"
                placement="bottom-start"
                @on-ok="deleteTableSelected">
                <Button type="ghost" v-if="permsBtn.DELETE_CUSTOMER" icon="trash-a" :disabled="!table.selected">{{$t('customer.delete')}}</Button>
              </Poptip>

            </div>
            <div class="iqis-page-tool-second" style="font-size:0;">
              <Button type="text"  icon="refresh" @click="reset">{{$t('customer.refreshData')}}</Button>
              <Button type="primary" @click="rank">{{$t('customer.customList')}}</Button>
              <!-- <Dropdown> -->
              <!-- <Button type="ghost" style="margin-left: 8px" v-if="permsBtn.EXPORT_CUSTOMER" @click="exportStatement(1)">{{$t('customer.export')}}</Button> -->

              <Dropdown style="margin-left: 8px" v-if="permsBtn.IMPORT_CUSTOMER">
                <Button type="ghost">{{$t('customer.export')}}<Icon style="margin-left:10px;" type="arrow-down-b"></Icon></Button>
                <DropdownMenu slot="list">
                  <DropdownItem>
                    <Button type="text" @click="exportStatement(1)">{{$t('customer.thisPage')}}</Button>
                  </DropdownItem>
                </DropdownMenu>
                <DropdownMenu slot="list">
                  <DropdownItem>
                    <Button type="text" @click="exportStatement(2)">{{$t('customer.allData')}}</Button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown style="margin-left: 8px" v-if="permsBtn.IMPORT_CUSTOMER">
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
                <!-- <DropdownMenu slot="list">
                    <DropdownItem>
                      <Button type="text" @click="exportStatement(1)">当页数据</Button>
                    </DropdownItem>
                </DropdownMenu>
              </Dropdown> -->
            </div>
          </div>

          <Modal v-model="uploadShow" :title="i18n.t('iqisUpload.importCustomerList')" :mask-closable="false" :closable="false">
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


          <Table class="tableCustom" highlight-row ref="pageTable" @on-row-dblclick="onDBClick" :loading="table.loading" v-drag-table-column="table.columns" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <div style="padding: 20px 0 20px 0px;">
            <Page v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                  :page-size-opts="[10,20,50,100]"
                  @on-change="pageChange" @on-page-size-change="pageSizeChange"
                  size="small" show-total show-elevator show-sizer></Page>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
    <Modal
      :title="editModal.item.measUnitId?i18n.t('customer.editCustType'):i18n.t('customer.addCustType')"
      v-model="editModal.show"
      :mask-closable="false"
      :width="600" >
      <Row type="flex" :gutter="40">
        <i-col span="12">{{$t('customer.custTypeName')}}</i-col>
        <i-col span="12">{{$t('customer.custTypeNo')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12"><Input v-model="editModal.item.customerTypeName" style="width: 100%;"></Input>
        </i-col>
        <i-col span="12">
          <i-input v-model="editModal.item.customerTypeNum" style="width: 100%;"></i-input>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">{{$t('customer.type')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40" >
        <i-col span="24">
          <Cascader  :transfer="false" v-model="editModal.item.customerTypeValue" :data="category"
                    :render-format = "loadTypeRender"
                    change-on-select :clearable="false" style="width: 100%"></Cascader>
        </i-col>
      </Row>
      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="24">{{$t('customer.remarks')}}
        </i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="24"><Input v-model="editModal.item.remark" type="textarea" :rows="4" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <div slot="footer">
        <Button type="primary" size="large" @click="modalOk" :loading="editModal.requesting">{{$t('customer.confirm')}}</Button>
        <Button type="text" size="large" @click="editModal.show=false">{{$t('customer.cancel')}}</Button>
      </div>
      <Spin v-if="editModal.dataLoading" fix size="large"></Spin>
    </Modal>
    <Modal
      :title="i18n.t('customer.rolePerms')"
      v-model="editPermissionModal.show"
      :mask-closable="false">
      <div style="font-size: 14px;height:auto;margin-top:-40px;">
        <div>
          <CheckboxGroup style="line-height:40px;font-size:14px;" v-model="jurisdictionCode">
            <Checkbox style="display:none" label="SELECT_PRODUCT">{{$t('customer.prodList')}}</Checkbox><br>
            <Checkbox  label="SELECT_MONITOR">{{$t('customer.realTime')}}</Checkbox><br>
            <Checkbox label="SELECT_DIRECT_RATE">{{$t('customer.passRateRecord')}}</Checkbox><br>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
            <Checkbox label="SELECT_PQC">{{$t('customer.pqcRecord')}}</Checkbox><br>
            <Checkbox label="SELECT_DATA_RECORD">{{$t('customer.cpkRecord')}}</Checkbox><br>
            <Checkbox label="SELECT_PQC_ABNORMAL">{{$t('customer.pqcAbnRecord')}}</Checkbox><br>
            <Checkbox label="SELECT_TRIAL_PROD">{{$t('customer.trialProdRecord')}}</Checkbox><br>
            <Checkbox label="SELECT_OQC">{{$t('customer.oqcRecord')}}</Checkbox><br>
            <Checkbox label="SELECT_OQC_ABNORMAL">{{$t('customer.oqcAbnRecord')}}</Checkbox><br>
            <Checkbox label="SELECT_PRODUCT_PROFILE">{{$t('customer.statisticRecord')}}</Checkbox>
          </CheckboxGroup>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="permissionModalOk" :loading="editPermissionModal.requesting">{{$t('customer.confirm')}}</Button>
        <Button type="text" size="large" @click="editPermissionModal.show=false">{{$t('customer.cancel')}}</Button>
      </div>
      <Spin v-if="editPermissionModal.dataLoading" fix size="large"></Spin>
    </Modal>
    <div class="arrangement-dialog">
      <Modal
      :title="i18n.t('customer.customList')"
      v-model="arrangement.state"
      class="rankBox"
      :mask-closable="false"
      :width="600" >
      <span class="list_txt">{{$t('customer.select')}}</span>
       <div class="list_ok list">
        <div v-for="(item,index) in arrangement.data1" class="dataItem" :class="'check'+index"  :key="index">
          <input type="checkbox"   :value="item"  v-model="arrangement.data" >
           <span >{{item.title}}</span>
         </div>
       </div>
       <span class="list_txt2">{{$t('customer.selected')}}</span>
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
        <Button type="primary" size="large" @click="ReplyOk" >{{$t('customer.restore')}}</Button>
        <Button type="primary" size="large" @click="RankOk" >{{$t('customer.confirm')}}</Button>
        <Button type="text" size="large" @click="RankNo">{{$t('customer.cancel')}}</Button>
      </div>
      </Modal>
    </div>
  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import ICol from "iview/src/components/grid/col";
  import $ from 'jquery'
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
        i18n:window.i18n,
        snsData:null,
        uploadUrl:process.env.API_HOST+'/bas/customer/import',
        uploadShow:false,
        uploadFile:[],
        beforeShow:true,
        progressShow:true,
        beforeShow1:true,
        beforeShow2:true,
        otherBeforeShow:false,
        jurisdictionCode:['SELECT_PRODUCT'],
        customerTenantId:'',
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        data:[
        ],
        tableEditDis:true,
        editModal:{
          dataLoading:true,
          item:{},
          show:false,
          requesting:false
        },
        editPermissionModal:{
          dataLoading:false,
          item:{},
          show:false,
          requesting:false
        },
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
              width:40,
              minWidth:40,
              maxWidth:40
            },{
              title: i18n.t('customer.customerNo'),
              className:'tablePadding',
              ellipsis:true,
              minWidth:this.$store.state.locale=='zh_CN'?80:100,
              width:this.$store.state.locale=='zh_CN'?80:100,
              key: 'customerNum'
            },{
              title: i18n.t('customer.customerShortName'),
              className:'tablePadding',
              ellipsis:true,
              width:this.$store.state.locale=='zh_CN'?80:150,
              minWidth:this.$store.state.locale=='zh_CN'?80:150,
              key: 'customerAbbreviation'
            },{
              title: i18n.t('customer.fullName'),
              className:'tablePadding',
              ellipsis:true,
              minWidth:this.$store.state.locale=='zh_CN'?240:310,
              width:this.$store.state.locale=='zh_CN'?240:310,
              key: 'customerName',
              render:function (h, data) {
                return h("span",{domProps:{"innerHTML":data.row["customerName"]+"<br>"+data.row["customerEngName"]}})
              }
            },{
              title: i18n.t('customer.type'),
              className:'tablePadding',
              ellipsis:true,
              width:80,
              minWidth:80,
              key: 'customerTypeName'
            },{
              title: i18n.t('customer.latestReviewResults'),
              className:'tablePadding',
              ellipsis:true,
              minWidth:this.$store.state.locale=='zh_CN'?110:140,
              key: 'recentlyReviewGrade'
            },{
              title: i18n.t('customer.latestRating'),
              className:'tablePadding',
              ellipsis:true,
              minWidth:this.$store.state.locale=='zh_CN'?110:120,
              key: 'recentlyScoreGrade'
            },{
              title: i18n.t('customer.permission'),
              className:'tablePadding',
              minWidth:90,
              ellipsis:true,
              key: '---',
              render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color:'#5299EF',
                      fontSize:'12px'
                    },
                    on: {
                      click: () => {
                        let vm =this;
                        vm.customerTenantId=params.row.customerTenantId;
                        if(!vm.customerTenantId){
                          vm.$Notice.warning({title:i18n.t('customer.NotRelax')})
                          return;
                        }
                        vm.editPermissionModal.show=true;
                        vm.$http.get('/bas/customer/getCustomerAuthorization?customerTenantId='+vm.customerTenantId).then(function(resp){
                          vm.jurisdictionCode=[];
                          let aclValue=resp.data.aclValue.split(',');
                          let demo=[
                            "SELECT_PRODUCT",
                            "SELECT_MONITOR",
                            "SELECT_DIRECT_RATE",
                            "SELECT_PQC",
                            "SELECT_DATA_RECORD",
                            "SELECT_PQC_ABNORMAL",
                            "SELECT_TRIAL_PROD",
                            "SELECT_OQC",
                            "SELECT_OQC_ABNORMAL",
                            "SELECT_PRODUCT_PROFILE",
                            // 'SELECT_IQCDIAGRAM',
                            // 'SELECT_OQCDIAGRAM',
                            // 'SELECT_PQCDIAGRAM',
                          ]
                          for(let i in aclValue){
                            if(demo.indexOf(aclValue[i])!=-1&&vm.jurisdictionCode.indexOf(aclValue[i])==-1){
                              vm.jurisdictionCode.push(aclValue[i])
                            }
                          }
                          // //console.log(vm.jurisdictionCode,'vm.jurisdictionCode')
                        })
                        // this.refreshTypeTree(params.row.jobId)
                      }
                    }
                  }, i18n.t('customer.permissionEdit'))
                ]);
              }
            },{
              title: i18n.t('customer.dateTime'),
              className:'tablePadding',
              minWidth:106,
              width:106,
              ellipsis:true,
              key: 'operateDate',
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
        search: {
          query: "",
          fieldName: "",
          typeTree:[],
          userList:[],
          dates:[],
          typeDataLoading:false,
          data: {
            searchTypes: [
              {
                label: i18n.t('customer.searchAll'),
                value: ""
              }, {
                label: i18n.t('customer.customerNo'),
                value: "customerNum"
              }, {
                label: i18n.t('customer.customerShortName'),
                value: "customerAbbreviation"
              }, {
                label: i18n.t('customer.fullName'),
                value: "customerName"
              }, {
                label: i18n.t('customer.fullNameEN'),
                value: "customerEngName"
              }, {
                label: i18n.t('customer.custTypeName'),
                value: "customerTypeName"
              }, {
                label: i18n.t('customer.contact'),
                value: "contacts"
              }, {
                label: i18n.t('customer.contactNumber'),
                value: "phone"
              }, {
                label: i18n.t('customer.customerAddress'),
                value: "address"
              }, {
                label: i18n.t('customer.remarks'),
                value: "remark"
              }
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
        rankData: [
          {
            title: i18n.t('customer.customerNo'),
            className:'tablePadding',
            ellipsis:true,
            minWidth:100,
            width:100,
            key: 'customerNum'
          },{
            title: i18n.t('customer.customerShortName'),
            className:'tablePadding',
            ellipsis:true,
            width:this.$store.state.locale=='zh_CN'?80:170,
            minWidth:this.$store.state.locale=='zh_CN'?80:170,
            key: 'customerAbbreviation'
          },{
            title: i18n.t('customer.fullName'),
            className:'tablePadding',
            ellipsis:true,
            minWidth:this.$store.state.locale=='zh_CN'?240:300,
            width:this.$store.state.locale=='zh_CN'?240:300,
            key: 'customerName',
            render:function (h, data) {
              return h("span",{domProps:{"innerHTML":data.row["customerName"]+"<br>"+data.row["customerEngName"]}})
            }
          },{
            title: i18n.t('customer.type'),
            className:'tablePadding',
            ellipsis:true,
            width:80,
            minWidth:80,
            key: 'customerTypeName'
          },{
            title: i18n.t('customer.latestReviewResults'),
            className:'tablePadding',
            ellipsis:true,
            minWidth:this.$store.state.locale=='zh_CN'?65:200,
            key: 'recentlyReviewGrade'
          },{
            title: i18n.t('customer.latestRating'),
            className:'tablePadding',
            ellipsis:true,
            minWidth:this.$store.state.locale=='zh_CN'?65:140,
            key: 'recentlyScoreGrade'
          },{
            title: i18n.t('customer.permission'),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?70:90,
            ellipsis:true,
            key: '---',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color:'#5299EF',
                    fontSize:'12px'
                  },
                  on: {
                    click: () => {
                      this.editPermissionModal.show=true;
                      // this.refreshTypeTree(params.row.jobId)
                    }
                  }
                }, i18n.t('customer.permissionEdit'))
              ]);
            }
          },{
            title: i18n.t('customer.dateTime'),
            className:'tablePadding',
            minWidth:106,
            width:106,
            ellipsis:true,
            key: 'operateDate',
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
            title: i18n.t('customer.customerAddress'),
            className:'tablePadding',
            width:240,
            minWidth:240,
            ellipsis:true,
            key: 'address',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },{
            title: i18n.t('customer.contact'),
            className:'tablePadding',
            width:80,
            minWidth:80,
            ellipsis:true,
            key: 'contacts',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },{
            title: i18n.t('customer.contactNumber'),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?100:130,
            ellipsis:true,
            key: 'phone',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },{
            title: i18n.t('customer.remarks'),
            className:'tablePadding',
            width:80,
            minWidth:80,
            ellipsis:true,
            key: 'remark',
            render:vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          }
        ],
        permsCur:[
          "EXPORT_CUSTOMER",
          "SELECT_CUSTOMER",
          "INSERT_CUSTOMER",
          "UPDATE_CUSTOMER",
          "DELETE_CUSTOMER",
          "IMPORT_CUSTOMER"
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "INSERT_CUSTOMER":false,
          "SELECT_CUSTOMER":false,
          "UPDATE_CUSTOMER":false,
          "DELETE_CUSTOMER":false,
          "EXPORT_CUSTOMER":false,
          "IMPORT_CUSTOMER":false
        },
      }
    },//end data

    created(){
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
      this.refreshTypeTree();
      this.refreshData();
      this.treeSelectChange();
      

    },
    computed:{
      treeData(){//需传输到树组件的数据
        let treeData={
          treeTitle:"分类",//树的根目录名称
          typeId:"customerTypeId",//类别id字段
          typeName:"customerTypeName",//类名名称
          treeListUrl:"/bas/customerType",//树的数据接口名称
          addTreeUrl:"/bas/customerType",//增加树元素的接口名称
          editTreeUrl:"/bas/customerType",//修改树元素的接口名称
          deleteTreeUrl:"/bas/customerType/",//删除树元素的接口名称
          chooseNodeUrl:"/bas/customerList/",//选择树元素查找对应列表的接口名称
          pager:{
            current:this.table.pager.current,
            limit:this.table.pager.limit
          },
        }
        return treeData
      },
      treeStyle(){
        return {
          "height":(9*40+159)+"px"//(Math.max(this.table.pager.rows,10)*40+144)+"px"
        };
      },
      renderList (){
        return this.$store.state.renderExamList;
      }
    },
    watch:{
      renderList:function(a,b){
        if(a){
          this.reset('transfer');
        }
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
        this.table.selected='';
        this.search.query='';
        this.search.fieldName='';
        this.search.dates=[];
        // this.refreshData();
        let customerTypeId = this.$props.params && this.$props.params.customerTypeId;
        // //console.log(customerTypeId,'拿到修改/添加页传过来的客户类别Id')
        if(customerTypeId&&method=='transfer'){
          this.table.loading=true;
          this.refreshTypeTree(customerTypeId);
        }else{
          this.refreshTypeTree();
        }
        this.pageChange(1);
        this.$refs.treeCategory.refreshTypeTree()
      },
      exportStatement (index){
        //console.log(index,'index');
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        if(index == 1){
          url = '/bas/customer/export/list';
          params.page = this.table.pager.current;
          params.limit = this.table.pager.limit;
          params.query = this.search.query;
        }
        if(index == 2){
          url = '/bas/customer/export/list';
          params.page = 1;
          params.limit = this.table.pager.total;
          params.query = this.search.query;
        }

        this.$iqis.download(url,params,methods,()=>{}) //下载文件
      },
      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        // this.treeSelectChange();
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
      refreshData(){
        let that = this;

        that.table.loading = true;

        let params = {};

        if(this.search.dates && this.search.dates[0]){
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];

          params.startDate = this.$iqis.utils.getDayStart(1,sdate);//0
          params.endDate = this.$iqis.utils.getDayEnd(edate);
        }

        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;

        this.$http.get("/bas/customerList",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.loading = false;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.$store.commit('RENDER_CHANGE',false);
        })

        // let customerId = [];
        // for(let i=0;i<that.data.length;i++){
        //   customerId.push(that.$http.get('/customer/review/recently',that.data[i].customerId));
        //   //console.log(customerId[i])
        // }
        // that.$http.all(customerId).then(function (resps) {
        //   //console.log()
        // });
      },
      refreshTypeTree(selectValue){
        let that = this;
        that.tree.selected = false;
        this.$http.get("/bas/customerType",{params:{limit:99999999}}).then(function(resp){
          let root = {title:i18n.t('customer.custType'),selected: false,label:i18n.t('customer.custType'),value:0,expand:true};

          if(!selectValue){
            // //console.log("set root select:"+selectValue);
            root.selected = true;
            that.refreshData();
          }

          if(resp.data){

            if(selectValue){
              for(let i =0;i<resp.data.length;i++){
                // //console.log("set node select:"+selectValue);
                resp.data[i].selected = resp.data[i].customerTypeId == selectValue;
                that.tree.selected = true;
              }
              that.treeSelectChange(selectValue);              
            }

            // that.$iqis.utils.treeify(resp.data,root,"customerTypeId","customerTypeName","parentId");
            that.$iqis.utils.treeify(resp.data,root,"customerTypeId",function(item){
						 return "["+item.customerTypeNum+"]"+item.customerTypeName;
						//return item.manufacturerTypeNum;
            },"parentId");
          }
          // //console.log(root);
          that.category = [root];
        });

      },

      addCust(){
        let that = this;

        let sns = that.snsData;
        let s_item = this.category[0];
        if(sns && sns.length > 0){
          s_item = sns[0];
        }
        let result = [];
        if(s_item) {
          result = this.$iqis.utils.findPathInTree(this.category[0], [], s_item.customerTypeId, "customerTypeId");
          //console.log(result,'寻找传过去的类别');
        }
        this.$emit("open-tab","customer-add",i18n.t('customer.addCust'),"page-customer-add",{customerTypeValue:result});
      },

      editSelectRow(e){
        let selectedRow = this.$refs.pageTable.getSelection()
        //console.log(selectedRow);
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t("quality.cbm"),
            desc: ''
          });
          return;
        }else{
          this.$emit("open-tab","customer-add"+selectedRow[0].customerId,i18n.t('customer.editCust')+"-"+selectedRow[0].customerAbbreviation,"page-customer-add",{customerId:selectedRow[0].customerId});
          // this.showModal(selectedRow[0]);
        }
      },
      onDBClick(o,i){
          this.$emit("open-tab","customer-add"+o.customerId,i18n.t('customer.editCust')+"-"+o.customerAbbreviation,"page-customer-add",{customerId:o.customerId});
      },
      showModal(d,pid){
        let result = this.$iqis.utils.findPathInTree(this.category[0],[],pid,"customerTypeId");
        result = result || [];
        //console.log(result);

        if(!d){
          d = {customerTypeValue:[],name:"",remark:"",userId:''}
        }else{

        }
        d.customerTypeValue = result;

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
        //console.log(s_item);
        if(s_item){
          let that = this;
          this.$http.delete("/bas/customerType/"+s_item.customerTypeId).then(function (resp) {//customerTypeId
            that.$Message.success(i18n.t('customer.deleteSuccess'));
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
          this.showModal(null,s_item.customerTypeId);
        }
      },editTreeSelected(){

        let that = this;

        let sns = that.snsData;
        let s_item = this.category[0];
        if(sns && sns.length > 0){
          s_item = sns[0];
        }
        if(s_item){
          this.showModal(s_item,s_item.parentId);
        }
      },
      modalCancel(){

      },
      modalOk(){
        let that = this;
        this.editModal.item.parentId = null;
        if(this.editModal.item.customerTypeValue && this.editModal.item.customerTypeValue.length > 0){
          let plt = this.editModal.item.customerTypeValue[this.editModal.item.customerTypeValue.length-1];
          if(plt){
            this.editModal.item.parentId = plt;
          }
        }
        let params = [
          {type: 'Empty', title: i18n.t('customer.custTypeName'), value: that.editModal.item.customerTypeName},
          {type: 'Name', title: i18n.t('customer.custTypeName'), value: that.editModal.item.customerTypeName},
          {type: 'Empty', title: i18n.t('customer.custTypeNo'), value: that.editModal.item.customerTypeNum},
          {type: 'No', title: i18n.t('customer.custTypeNo'), value: that.editModal.item.customerTypeNum},
          // {type: 'Empty', title: i18n.t('customer.type'), value: that.editModal.item.parentId},
          {type: 'Word600', title: i18n.t('customer.remarks'), value: that.editModal.item.remark},
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
        this.editModal.requesting = true;
        
        
        //console.log(that.editModal.item);

        if(that.editModal.item.customerTypeId){
          that.$http.put("/bas/customerType",that.editModal.item).then(function (resp) {
            that.refreshTypeTree(that.editModal.item);
            that.$Message.success(i18n.t('customer.editSuccess'));
            that.editModal.show = false;
            that.editModal.requesting = false;
          }).catch(err => {
            that.editModal.requesting = false;
          });
        }else{
          that.$http.post("/bas/customerType",that.editModal.item).then(function (resp) {
            that.refreshTypeTree(that.editModal.item.parentId);
            that.$Message.success(i18n.t('customer.addSuccess'));
            that.editModal.show = false;
            that.editModal.requesting = false;
          }).catch(err => {
            that.editModal.requesting = false;
          });
        }

        //this.editModal = true;
      },
      loadTypeRender(label){
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


      },treeSelectChange(selectValue){
        let that=this;
        // //console.log(selectValue,'客户类别/customerTypeId/传过来的数字Id')
        if(selectValue&&selectValue[0]&&!selectValue[0].customerTypeId){//1如果选中的是供应商类别，刷新全部分类数据
          that.tree.selected=false;
          that.refreshData();
        }
        if(selectValue&&selectValue[0]&&selectValue[0].customerTypeId){//2如果选中的是其他分类，使selectValue等于该分类的Id
          selectValue=selectValue[0].customerTypeId;
        }
        if((selectValue!=''&&!isNaN(selectValue))||!selectValue){//3如果是选中的其他分类Id，或传过来的分类Id，掉接口拿到该分类的数据
          if(!selectValue){//4如果是翻页则无值传过来，则给selectValue赋值并执行之后的内容
            let sns=that.snsData;
            if(sns&&sns.length==1){
              selectValue=sns[0].customerTypeId;
              // //console.log(sns,22222222222);
              if(sns[0].title==i18n.t('customer.custType')){
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
          that.tree.selected=true
          let url="/bas/allCustomer/"
          that.$http.get(url+selectValue,{params: params}).then((res)=>{
            that.data=res.data
            that.table.loading=false;
            that.table.pager.total = res.pagerInfo.total;
            let rowCount = res.data ? res.data.length : 10;
            that.table.pager.rows = Math.max(rowCount, 6);
          })
        }
      //   let that=this;
      //   that.table.selected='';
      //   let sns = that.snsData;
      //   if(sns.length==0||sns[0].title==i18n.t('customer.custType')){
      //     that.tree.selected=false;
      //     that.refreshData();
      //   }else{
      //     that.refreshSelectData();
      //   }
      // },
      // refreshSelectData(){
      //   let that=this;
      //   let sns = that.snsData;
      //   if(sns.length==0||sns[0].title==i18n.t('customer.custType')){
      //     that.refreshData();
      //   }else {
      //     this.table.pager.current=1;
      //     this.table.pager.limit=10;
      //     let params = {};
      //     params.page = this.table.pager.current;
      //     params.limit = this.table.pager.limit;
      //     //console.log(params);
      //     that.tree.selected = true;
      //     let url = "/bas/allCustomer/";
      //     that.$http.get(url + sns[0].customerTypeId, {params: params}).then((resp) => {
      //       that.data = resp.data;
      //       that.table.pager.total = resp.pagerInfo.total;
      //       let rowCount = resp.data ? resp.data.length : 10;
      //       that.table.pager.rows = Math.max(rowCount, 6);
      //     });
      //   }
      },
      loadEditData(){
        // this.editModal.dataLoading = true;
        //
        // let that = this
        // this.$http.get("/tenant/user",{params:{limit:99999999}}).then(function (resp) {
        //   if(resp.data){
        //     that.search.userList = resp.data;
        //     that.editModal.dataLoading = false;
        //   }
        // });
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
            delArr.push(this.$http.delete("/bas/customer/"+ss[i].customerId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('customer.deleteSuccess'));
              that.reset();
            });
          }
        }
      },
      permissionModalOk(){
        this.editPermissionModal.requesting = false;
        let that = this;
        if(that.jurisdictionCode.indexOf('SELECT_PRODUCT_PROFILE')!=-1){
          that.jurisdictionCode.push('SELECT_IQCDIAGRAM','SELECT_OQCDIAGRAM','SELECT_PQCDIAGRAM')
        }
        let data={
          jurisdictionCode:(that.jurisdictionCode).toString(),
          customerTenantId:that.customerTenantId,
        }
        that.$http.post('/bas/customer/authorizationCustomer',data).then(function(resp){
          that.$Message.success(i18n.t('customer.editSuccess'));
          that.editPermissionModal.show = false;
        })
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
        that.dataList.splice(-4,4)
        that.arrangement.data=that.dataList;
      },
      //排序确定
      RankOk(){
        if(this.arrangement.data.length===0){
          this.$Notice.warning({
            title: i18n.t('customer.listNull'),
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
        let url = "/bas/customer/export/template"
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
.ivu-progress-success .ivu-progress-bg {
    background-color:rgb(65, 143, 238)!important;
}
.ivu-progress-success .ivu-progress-text {
    color: rgb(65, 143, 238)!important;
}
/* 公用列表和树形响应式高度 */
/* @media screen and (max-width:1920px){
  .tableResponse.ivu-table-wrapper{
    height:536px!important;
  }
  .tableResponse .ivu-table-body{
    height:482px!important;
  }
  .treeResponse.iqis-bus-tree{
    height:625px!important;
  }
}
@media screen and (max-width:1440px){
  .tableResponse.ivu-table-wrapper{
    height:449px!important;
  }
  .tableResponse .ivu-table-body{
    height:395px!important;
  }
  .treeResponse.iqis-bus-tree{
    height:538px!important;
  }
}
@media screen and (max-width:1366px){
  .tableResponse.ivu-table-wrapper{
    height:340px!important;
  }
  .tableResponse .ivu-table-body{
    height:286px!important;
  }
  .treeResponse.iqis-bus-tree{
    height:429px!important;
  }
} */
</style>
