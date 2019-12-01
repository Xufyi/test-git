<template>

  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 210px;">
        <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('pqc.otf')" style="width: 200px"></DatePicker>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px; margin-left:8px;">
        <Select v-model="search.productionState" :placeholder="i18n.t('pqc.ps')" clearable style="width: 100px;">
          <Option v-for="st in searchs.measUnit" :key="st.measUnitId" :value="st.measUnitId">{{st.name}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('pqc.sa')" slot="prepend" style="width: 110px;text-align:left;">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="refreshData();table.selected=''">{{$t("pqc.search")}}</Button>
        <Button type="ghost" @click="reset">{{$t("pqc.reset")}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <!-- <Button type="ghost" icon="refresh" @click="refreshData">刷新</Button> -->
        <Button type="ghost" v-if="permsBtn.INSERT_PROD_BATCH" icon="plus" @click="addIqc">{{$t("pqc.add")}}</Button>
        <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.UPDATE_PROD_BATCH" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t("pqc.modify")}}</Button>
        <Poptip
          confirm
          :title="i18n.t('pqc.dsi')"
          placement="bottom-start"
          :ok-text='i18n.t("pqc.confirm")'
          :cancel-text='i18n.t("pqc.cancel")'
          @on-ok="deleteTableSelected">
          <Button type="ghost" v-if="permsBtn.DELETE_PROD_BATCH" icon="trash-a" :disabled="!table.selected">{{$t("pqc.delete")}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second" style="font-size:0;">
        <Button type="text"  icon="refresh" @click="reset">{{$t("pqc.refresh")}}</Button>
        <Button type="primary"style="margin-right:8px;" @click="rank">{{$t("pqc.customList")}}</Button>
        <!-- <Button type="ghost" @click="exportReport()">导出报表</Button> -->

        <Dropdown style="margin-left: 8px" v-if="permsBtn.IMPORT_PROD_BATCH">
          <Button type="ghost">{{$t('pqc.exportReport')}}<Icon style="margin-left:10px;" type="arrow-down-b"></Icon></Button>
          <DropdownMenu slot="list">
            <DropdownItem>
              <Button type="text" @click="exportReport(1)">{{$t("pqc.pageData")}}</Button>
            </DropdownItem>
          </DropdownMenu>
          <DropdownMenu slot="list">
            <DropdownItem>
              <Button type="text" @click="exportReport(2)">{{$t("pqc.allTheData")}}</Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        
        <!-- 导入数据 -->
         <Dropdown style="margin-left: 8px" v-if="permsBtn.IMPORT_PROD_BATCH">
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

    <Modal v-model="uploadShow" :title="i18n.t('iqisUpload.importProductBatches')" :mask-closable="false" :closable="false">
        <div v-if="!progressShow" style="font-size:14px;text-align:center">{{$t('pqc.dnr')}}</div>
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

    <div class="iqis-page-context">
      <div class="iqis-exam-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-exam-table" style="flex: 1 1 100px;overflow: auto;">
          <Table class="tableCustom" ref="pageTable"  @on-row-dblclick="onDBClick"  v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display:inline-block;"> -->
            <div style="padding: 20px 0 20px 0px;">
              <Page v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                    :page-size-opts="[10,20,50,100]"
                    @on-change="pageChange" @on-page-size-change="pageSizeChange"
                    size="small" show-total show-elevator show-sizer></Page>
            </div>
          <!-- </div>
           <div style="display:inline-block;">
            <div style="float: left;margin: 4px;line-height: 24px;">
                <Button type="primary" size="small" @click="goElevatorPage">跳转</Button>
            </div>
          </div> -->
          

        </div>
      </div>

    </div>
    <div class="iqis-page-dialog">
      <Modal
        :title="editModal.item.prodBatchId?i18n.t('pqc.rtpb'):i18n.t('pqc.apb')"
        v-model="editModal.show"
        :mask-closable="false"
        :width="600" >
        <Row type="flex" :gutter="40">
          <i-col span="8">{{$t("pqc.pt")}}</i-col>
          <i-col span="8">{{$t("pqc.orderNumber")}}</i-col>
          <i-col span="8">{{$t("pqc.ln")}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
          <i-col span="8">
            <Date-picker class="white" :disabled="noPermsDis" type="datetime" :clearable="false" format="yyyy-MM-dd HH:mm" v-model="editModal.date"  ></Date-picker>
          </i-col>
          <i-col span="8">
            <Input :disabled="noPermsDis" :placeholder="i18n.t('pqc.pe')" v-model="editModal.item.orderNo" style="width: 100%;"></Input>
          </i-col>
          <i-col span="8">
            <Input :disabled="noPermsDis" :placeholder="i18n.t('pqc.pe')" v-model="editModal.item.batchNo" style="width: 100%;"></Input>
          </i-col>
        </Row>
        <Row type="flex" :gutter="40" style="margin-top:20px;">
          <i-col span="8">{{$t("pqc.pn")}}</i-col>
          <i-col span="8">{{$t("pqc.name")}}</i-col>
          <i-col span="8">{{$t("pqc.pc")}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
          <i-col span="8">
            <Select :label="editModal.item.productNo" remote :remote-method="remoteMethod" :loading="loadingRemote" :disabled="noPermsDis" v-model="editModal.item.productId" filterable  :placeholder="i18n.t('pleaseChoose')" @on-change="selectOn(editModal.item.productId)">
              <Option v-for="item in productList" :value="item.productId" :label="item.no" :key="item.no">{{ item.no}}/{{ item.name}}</Option>
            </Select>
          </i-col>
          <i-col span="8">
            <!-- <Select disabled v-model="editModal.item.productId" filterable :placeholder="i18n.t('pleaseChoose')">
              <Option v-for="(items,index) in urlProduct.name" :value="items.productId" :label="items.name" :key="index">{{ items.name}}</Option>
            </Select> -->
             <Input disabled v-model="editModal.item.productName"></Input>
          </i-col>
          <i-col span="8">
            <!-- <Select v-model="editModal.item.prodTypeId" filterable disabled  :placeholder="i18n.t('pqc.pe')">
              <Option v-for="(items,index) in urlProduct.prodTypeName" :value="items.prodTypeId" :key="index">{{ items.name}}</Option>
            </Select> -->
            <Input disabled v-model="editModal.item.prodTypeName"></Input>
          </i-col>
        </Row>
        <Row type="flex" :gutter="40" style="margin-top:20px;">
          <i-col span="8">{{$t("pqc.bn")}}</i-col>
          <i-col span="8">{{$t("pqc.ac")}}</i-col>
          <!-- <i-col span="8">{{$t("pqc.ps")}}</i-col> -->
        </Row>
        <Row type="flex" :gutter="40">
          <i-col span="8">
            <Input :disabled="noPermsDis" :placeholder="i18n.t('pqc.pe')" v-model="editModal.item.batchQuantity"  style="width: 100%;"></Input>
          </i-col>
          <i-col span="8">
            <Select :disabled="noPermsDis" v-model="editModal.item.customerId" filterable :placeholder="i18n.t('pleaseChoose')">
              <Option v-for="(items,index) in urlProduct.customerList" :value="items.customerId" :key="index">{{ items.name}}</Option>
            </Select>
          </i-col>
          <!-- <i-col span="8">
            <Select :disabled="noPermsDis" v-model="editModal.item.productionState" filterable :placeholder="i18n.t('pleaseChoose')">
              <Option v-for="item in searchs.measUnit" :value="item.measUnitId" :key="item.measUnitId">{{ item.name }}</Option>
            </Select>
          </i-col> -->
        </Row>
        <!-- <Row type="flex" :gutter="40" style="margin-top:20px;">
          <i-col span="24">{{$t("pqc.pl")}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
          <i-col span="24">
            <Select :disabled="noPermsDis" v-model="editModal.prodLineList" multiple  filterable  :placeholder="i18n.t('pqc.pleaseChoose')">
              <Option v-for="(item,index) in urlProduct.cityList" :value="item.prodLineId" :key="index">{{ item.prodLineName }}</Option>
            </Select>
          </i-col>
        </Row> -->
        <Row type="flex" :gutter="40" style="margin-top:20px;">
          <i-col span="24">{{$t("pqc.remarks")}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
          <i-col span="24">
            <Input :disabled="noPermsDis" :placeholder="i18n.t('pqc.pe')" type="textarea" v-model="editModal.item.remark" style="width: 100%;" :maxlength="Number(600)"></Input>
          </i-col>
        </Row>
        <div slot="footer">
          <Button type="primary"  v-if="!noPermsDis" size="large" @click="ModalOk" :loading="editModal.requesting">{{$t("pqc.confirm")}}</Button>
          <Button type="text" size="large" @click="editModal.show=false">{{$t("pqc.cancel")}}</Button>
        </div>
      </Modal>
    </div>
    <div class="arrangement-dialog">
      <Modal
        :title="i18n.t('pqc.customList')"
        v-model="arrangement.state"
        class="rankBox"
        :mask-closable="false"
        :width="600" >
        <span class="list_txt">{{$t("pqc.select")}}</span>
        <div class="list_ok list">
          <div v-for="(item,index) in arrangement.data1" class="dataItem" :class="'check'+index"  :key="index">
            <input type="checkbox"   :value="item"  v-model="arrangement.data">
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
    <!--弹框-->
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import draggable from 'vuedraggable';
  import $ from 'jquery'

  export default {
    components: {
      Input,draggable
    },
    data () {
      let vm = this;
      return {
        i18n:window.i18n,
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        data:[],
        uploadUrl:process.env.API_HOST+'/examinecenter/pqc/prodbatch/import',
        uploadShow:false,
        uploadFile:[],
        beforeShow:true,
        progressShow:true,
        beforeShow1:true,
        beforeShow2:true,
        otherBeforeShow:false,
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
              minWidth:40,
              maxWidth:40
            },
            // {title: '序号',
            //   width:80,
            //   render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
            //   align: 'center',
            //   minWidth:80,
            //   maxWidth:80
            // },
            {
              title: i18n.t("pqc.pt"),
              className:'tablePadding',
              width:106,
              minWidth:106,
              // align: 'center',
              ellipsis:true,
              key: 'productionDate',
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
              title: i18n.t("pqc.ln"),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'batchNo'
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
              title: i18n.t("pqc.specifications"),
              className:'tablePadding',
              width:120,
              minWidth:120,
              ellipsis:true,
              key: 'productSpec'
            },{
              title: i18n.t("pqc.unit"),
              className:'tablePadding',
              align:'center',
              width:60,
              ellipsis:true,
              key: 'prodUnitName'
            },{
              title: i18n.t("pqc.bn"),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?70:100,
              minWidth:this.$store.state.locale=='zh_CN'?70:100,
              ellipsis:true,
              key: 'batchQuantity'
            },{
              title: i18n.t("pqc.ac"),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?80:140,
              minWidth:this.$store.state.locale=='zh_CN'?80:140,
              ellipsis:true,
              key: 'customerName'
            },
            // {
            //   title: i18n.t("pqc.pl"),
            //   className:'tablePadding',
            //   width:this.$store.state.locale=='zh_CN'?80:120,
            //   minWidth:this.$store.state.locale=='zh_CN'?80:120,
            //   ellipsis:true,
            //   key: 'allProdLineName'
            // },{
            //   title: i18n.t("pqc.ps"),
            //   className:'tablePadding',
            //   minWidth:this.$store.state.locale=='zh_CN'?80:125,
            //   ellipsis:true,
            //   key: 'productionState',
            //   render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{2:i18n.t("pqc.completed"),1:i18n.t("pqc.ip"),0:i18n.t("pqc.tbp")})
            // },
            {
              title: i18n.t("pqc.orderNumber"),
              className:'tablePadding',
              width:this.$store.state.locale=='zh_CN'?80:100,
              minWidth:this.$store.state.locale=='zh_CN'?80:100,
              ellipsis:true,
              key: 'orderNo'
            },{
              title: i18n.t("pqc.operator"),
              className:'tablePadding',
              width:60,
              minWidth:60,
              ellipsis:true,
              key: 'updaterName'
            },{
              title: i18n.t("pqc.ot"),
              className:'tablePadding',
              minWidth:106,
              width:106,
              ellipsis:true,
              key: 'updateTime',
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
        listData:[],
        rankData:[
          {
            title: i18n.t("pqc.pt"),
            className:'tablePadding',
            width:106,
            minWidth:106,
            // align: 'center',
            ellipsis:true,
            key: 'productionDate',
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
            title: i18n.t("pqc.ln"),
            className:'tablePadding',
            width:80,
            minWidth:80,
            ellipsis:true,
            key: 'batchNo'
          },{
            title: i18n.t("pqc.pn"),
            className:'tablePadding',
            width:80,
            minWidth:80,
            ellipsis:true,
            key: 'productNo'
          },{
            title: i18n.t("pqc.name"),
            className:'tablePadding',
            width:80,
            minWidth:80,
            ellipsis:true,
            key: 'productName'
          },{
            title: i18n.t("pqc.productStandard"),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?80:150,
            minWidth:this.$store.state.locale=='zh_CN'?80:150,
            ellipsis:true,
            key: 'productSpec'
          },{
            title: i18n.t("pqc.unit"),
            className:'tablePadding',
            maxWidth:60,
            align:'center',
            minWidth:60,
            ellipsis:true,
            key: 'prodUnitName'
          },{
            title: i18n.t("pqc.bn"),
            className:'tablePadding',
            minWidth:96,
            ellipsis:true,
            key: 'batchQuantity'
          },{
            title: i18n.t("pqc.ac"),
            className:'tablePadding',
            minWidth:this.$store.state.locale=='zh_CN'?80:160,
            ellipsis:true,
            key: 'customerName'
          },
          // {
          //   title: i18n.t("pqc.pl"),
          //   className:'tablePadding',
          //   width:this.$store.state.locale=='zh_CN'?100:180,
          //   minWidth:this.$store.state.locale=='zh_CN'?80:180,
          //   ellipsis:true,
          //   key: 'allProdLineName'
          // },{
          //   title: i18n.t("pqc.ps"),
          //   className:'tablePadding',
          //   maxWidth:this.$store.state.locale=='zh_CN'?80:160,
          //   minWidth:this.$store.state.locale=='zh_CN'?80:160,
          //   ellipsis:true,
          //   key: 'productionState',
          //   render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{2:i18n.t("pqc.completed"),1:i18n.t("pqc.ip"),0:i18n.t("pqc.tbp")})
          // },
          {
            title: i18n.t("pqc.orderNumber"),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?80:160,
            minWidth:this.$store.state.locale=='zh_CN'?80:160,
            ellipsis:true,
            key: 'orderNo'
          },{
            title: i18n.t("pqc.operator"),
            className:'tablePadding',
            minWidth:80,
            ellipsis:true,
            key: 'updaterName'
          },{
            title: i18n.t("pqc.ot"),
            className:'tablePadding',
            minWidth:80,
            width:150,
            ellipsis:true,
            key: 'updateTime',
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
          {title: i18n.t("pqc.pc"),width:this.$store.state.locale=='zh_CN'?80:120,minWidth:this.$store.state.locale=='zh_CN'?80:120,ellipsis:true,key: 'prodTypeName'},
          {title: i18n.t("pqc.remarks"),width:100,minWidth:100,ellipsis:true,key: 'remark'}
        ],
        search: {
          dates:'',
          query: "",
          fieldName:"",
          productionState:"",
          result:"",
          status:"",
          userList:[],
          tos:[
            {value:"",label:i18n.t("pqc.all")},
            {value:"1",label:i18n.t("pqc.internalProcessing")},
            {value:"2",label:i18n.t("pqc.supplier")}
          ],
          optList:[
            {value:"",label:i18n.t("pqc.all")},
            {value:i18n.t("pqc.speclelAdoption"),label:i18n.t("pqc.speclelAdoption")},
            {value:i18n.t("pqc.er"),label:i18n.t("pqc.er")},
            {value:i18n.t("pqc.rework"),label:i18n.t("pqc.rework")},
            {value:i18n.t("pqc.filtrate"),label:i18n.t("pqc.filtrate")},
            {value:i18n.t("pqc.rg"),label:i18n.t("pqc.rg")},
            {value:i18n.t("pqc.scrap"),label:i18n.t("pqc.scrap")}
          ],
          data: {
            searchTypes: [
              {
                label: i18n.t("pqc.sa"),
                value: ""
              }, {
                label: i18n.t("pqc.ln"),
                value: "batchNo"
              }, {
                label: i18n.t("pqc.pn"),
                value: "productNo"
              }, {
                label: i18n.t("pqc.name"),
                value: "productName"
              }, {
                label: i18n.t("pqc.roductClassification"),
                value: "prodTypeName"
              }, {
                label: i18n.t("pqc.orderNumber"),
                value: "orderNo"
              }, {
                label: i18n.t("pqc.operator"),
                value: "updaterName"
              },
              //  {
              //   label: i18n.t("pqc.pl"),
              //   value: "prodLineName"
              // },
               {
                label: i18n.t("pqc.remarks"),
                value: "remark"
              }
            ]
          }
        },
        //获取产品编号/名称/客户信息
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
        editModal:{
          dataLoading:true,
          data:'',
          Quantity:[],
          prodLineList:[],
          item:{
            productName:'',
            productNo:'',
            prodTypeName:'',
          },
          show:false,
          requesting:false,
          batchNo:'',
          batchName:'',
        },
        searchs:{
          measUnit:[
            {
              name: i18n.t("pqc.completed"),
              measUnitId: 2
            },{
              name: i18n.t("pqc.ip"),
              measUnitId:1
            },{
              name: i18n.t("pqc.tbp"),
              measUnitId:0
            }
          ],
        },
        //排序
        arrangement:{
          state:false,
          data:[],
          data1:[],
        },
        permsCur:[
          "INSERT_PROD_BATCH",
          "DELETE_PROD_BATCH",
          "UPDATE_PROD_BATCH",
          "SELECT_PROD_BATCH",
          "EXPORT_PROD_BATCH",
          "IMPORT_PROD_BATCH"
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "INSERT_PROD_BATCH":false,
          "SELECT_PROD_BATCH":false,
          "UPDATE_PROD_BATCH":false,
          "DELETE_PROD_BATCH":false,
          "EXPORT_PROD_BATCH":false,
          "IMPORT_PROD_BATCH":false
        },
        noPermsDis:true,
        loadingRemote:false,
        source:null,
        productList:[]

      }
    },//end data

    created(){
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.refreshData();
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
      
    },
    computed:{

    },
    methods:{
      remoteMethod: _.debounce(function(query) {
        let that = this;
        that.loadingRemote = true;

        if (query !== '') {
          that.cancelQuest();
          that.$nextTick(()=>{

            that.$http.get('/basic/product/simple?page=1&limit=999999&examType=2&useState=1&fieldName=no,name&query='+query,{
              cancelToken: new this.$http.CancelToken(function executor(c) {
              that.source = c;
              })
            }).then(res =>{
              that.productList = res.data
              that.loadingRemote = false;
            })

          })
        } else {
          that.productList = [];
          that.loadingRemote = false;
        }
      },500),
      cancelQuest(){
        if(typeof this.source ==='function'){
          this.source(i18n.t('pqc.TerminationRequest')); 
        }
      },
      onPopUp(){
        let that = this;
        if((!that.editModal.item.prodBatchId&&that.permsBtn.INSERT_PROD_BATCH)||(that.editModal.item.prodBatchId&&that.permsBtn.UPDATE_PROD_BATCH)){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
      },
      reset(){
        this.search.dates=[];
        this.search.productionState='';
        this.search.fieldName='';
        this.search.query='';
        this.refreshData();
        this.table.selected='';
        this.tableEditDis=true;
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
      exportReport (index){
        let url ='';
        let  methods = 'get'
        let params = {}; //搜索条件
        url = '/examinecenter/pqc/prodbatch/export/list';
        if(index == 1) {
          params.page = this.table.pager.current;//1
          params.limit = this.table.pager.limit;//10
          params.query = "keyword%3D"+this.search.query+"%26productionState%3D"+this.search.productionState+"%26field%3D"+this.search.fieldName;
          //params.fieldName = this.search.fieldName;
          //params.productionState = this.search.status;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            //params.startDate = this.$iqis.utils.getDayStart(1,sdate);
            //params.endDate = this.$iqis.utils.getDayEnd(edate);
            params.query = "keyword%3D"+this.search.query+"%26productionState%3D"+this.search.productionState+"%26field%3D"+this.search.fieldName+"%26startDate%3D"+this.$iqis.utils.getDayStart(1,sdate)+"%26endDate%3D"+this.$iqis.utils.getDayEnd(edate);
          }
        }
        if (index==2) {
          params.page = 1;//1
          params.limit = this.table.pager.total;//10
          params.query = "keyword%3D"+this.search.query+"%26productionState%3D"+this.search.productionState+"%26field%3D"+this.search.fieldName;
          //params.fieldName = this.search.fieldName;
          //params.productionState = this.search.status;
          if(this.search.dates && this.search.dates[0]){
            let sdate = this.search.dates[0];
            let edate = this.search.dates[1];
            //params.startDate = this.$iqis.utils.getDayStart(1,sdate);
            //params.endDate = this.$iqis.utils.getDayEnd(edate);
            params.query = "keyword%3D"+this.search.query+"%26productionState%3D"+this.search.productionState+"%26field%3D"+this.search.fieldName+"%26startDate%3D"+this.$iqis.utils.getDayStart(1,sdate)+"%26endDate%3D"+this.$iqis.utils.getDayEnd(edate);
          }
        }
        
        this.$iqis.download(url,params,methods,()=>{}) //下载文件
      },
      // 添加
      addIqc(){
        let that = this;
        that.editModal.item={
          batchNo: "",
          batchQuantity: 0,
          customerId: '',
          orderNo: "",
          prodBatchId: '',
          prodLineList: [],
          prodTypeId: '',
          prodTypeName: "",
          productId: '',
          productName: "",
          productNo: "",
          productionState: '',
          remark: ''
        };
        that.editModal.prodLineList=[];
        that.editModal.date='';
        that.editModal.inspectionTypeId=false;
        that.editModal.show=true;
        that.basicName();
        that.basicCategory();
        that.customerList();
        that.lineName();
        that.onPopUp();
        // this.$emit("open-tab","exam-iqc-add","新建来料检验","page-exam-iqc-add",null);
      },
      // 修改
      editSelectRow(e){
        let that = this;
        that.editModal.inspectionTypeId=true;

        that.editModal.batchNo='';
        that.editModal.batchName='';
        let selectedRow = this.$refs.pageTable.getSelection();
        if(!selectedRow || selectedRow.length != 1){
          this.$Notice.warning({
            title: i18n.t("pqc.yms"),
            desc: ''
          });
          return;
        }
        that.editModal.item.prodBatchId=selectedRow[0].prodBatchId;
        that.onPopUp();
        let TypeName=selectedRow[0].prodTypeName;
        that.editModal.date= new Date(selectedRow[0].productionDate);
        that.basicCategory(TypeName);
        that.basicName();
        that.customerList();
        that.lineName();
        that.editModal.prodLineList=selectedRow[0].prodLineList;
        let item={
          prodBatchId:selectedRow[0].prodBatchId,
          orderNo:selectedRow[0].orderNo,
          batchNo:selectedRow[0].batchNo,
          productId:selectedRow[0].productId,
          productNo:selectedRow[0].productNo,
          productName:selectedRow[0].productName,
          prodTypeName:selectedRow[0].prodTypeName,
          batchQuantity:selectedRow[0].batchQuantity,
//        totalProdQuantity:selectedRow[0].totalProdQuantity,
          productionState :selectedRow[0].productionState,
          customerId:selectedRow[0].customerId,
          prodLineList:selectedRow[0].prodLineList,
          remark:selectedRow[0].remark
        }
        that.editModal.item=item
        that.editModal.show=true;
      },
      //点击确定
      ModalOk () {
        let that = this;
        let params = [
          {type:'Empty',title:i18n.t('pqc.pt'),value:that.editModal.date},
          // {type:'Empty',title:i18n.t('pqc.orderNumber'),value:that.editModal.item.orderNo},
          // {type:'No',title:i18n.t('pqc.orderNumber'),value:that.editModal.item.orderNo},
          {type:'Empty',title:i18n.t('pqc.ln'),value:that.editModal.item.batchNo},
          {type:'No',title:i18n.t('pqc.ln'),value:that.editModal.item.batchNo},
          {type:'Empty',title:i18n.t('pqc.pn'),value:that.editModal.item.productId},
          // {type:'Empty',title:i18n.t('pqc.bn'),value:that.editModal.item.batchQuantity},
          // {type:'NumNot0',title:i18n.t('pqc.bn'),value:that.editModal.item.batchQuantity},
          // {type:'Empty',title:i18n.t('pqc.ps'),value:that.editModal.item.productionState},
          // {type:'Empty',title:i18n.t('pqc.pl'),value:that.editModal.prodLineList},
          {type:'Word600',title:i18n.t('pqc.remarks'),value:that.editModal.remark},
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
        // if(that.editModal.prodLineList.length==0){
        //   that.$Notice.warning({title:i18n.t("pqc.tpl")})
        //   return;
        // }
        var oldTime = (new Date(that.editModal.date)).getTime();
        that.editModal.item.productionDate=oldTime;
//          if(that.editModal.item.productId==undefined||that.editModal.item.batchNo==undefined||that.editModal.item.productId==undefined||that.editModal.item.batchQuantity==undefined||that.editModal.item.orderNo==undefined||that.editModal.item.prodLineId==undefined||that.editModal.item.prodTypeId==undefined||that.editModal.item.productionDate==undefined||that.editModal.item.productionState==undefined){
//            that.$Notice.warning({
//            title: '请完善产品信息11',
//            desc: ''
//          });
//            return
//          }
//         if(that.editModal.item.productId==''||that.editModal.item.batchNo==''||that.editModal.item.productId==''||that.editModal.item.batchQuantity==''||that.editModal.item.orderNo==''||that.editModal.item.prodLineId==''||that.editModal.item.prodTypeId==''||that.editModal.item.productionDate==''){
//            that.$Notice.warning({
//            title: '请完善产品信息22',
//            desc: ''
//          });
//            return
//          }
        that.editModal.item.prodLineList=that.editModal.prodLineList;
        // this.editModal.item.totalBadQuantity= this.editModal.Quantity;
        if(this.editModal.inspectionTypeId===false){
          let url="/examinecenter/pqc/prodbatch";
          that.$http.post(url,that.editModal.item,that.headers).then((res)=>{
            that.reset();
            that.$Message.success(i18n.t("pqc.as"));
            that.editModal.show = false;
          })
        }else{
          let url="/examinecenter/pqc/prodbatch";
          that.$http.put(url,that.editModal.item,that.headers).then((res)=>{
            that.reset();
            that.$Message.success(i18n.t("pqc.ats"));
            that.editModal.show = false;
          })
        }
      },
      //select选中
      selectOn(val){
        let that = this;
        if(!val){return;}
        that.$http.get('/basic/product/detail/'+val).then(res=>{
          that.editModal.item.productName=res.data.name
          that.editModal.item.productNo=res.data.no
          that.editModal.item.prodTypeName=res.data.prodTypeName

        })
        // this.basicName(val);
      },
      //获取产品编号及名称
      basicName(val){
        return;//以下接口数据量过大，避免使用
        let idValueMap = [];
        let url_product="/basic/product?examType=2&useState=1&page=1&limit=9999";
        this.$http.get(url_product).then((res)=>{
          let urlProduct=res.data
          urlProduct.forEach(e => {
            let no=e.no;
            let productId=e.productId;
            let name=e.name;
            let boxOn={no,productId,name};
            let boxName={name,productId,no};
            for(var i=0;i<idValueMap.length;i++){
              if(idValueMap[i].name != e.name){
                idValueMap[i].no.push(boxOn);
                idValueMap[i].name.push(boxName)
                return;
              }
            }
            idValueMap.push({
              no:[boxOn],
              name:[boxName],
            })
          });
          for(var index in urlProduct){
            if(val===urlProduct[index].productId){
              this.basicCategory(urlProduct[index].prodTypeName)
            }
          }
          this.urlProduct.no=idValueMap[0].no;
          this.urlProduct.name=idValueMap[0].name;
        })
      },
      //获取产品类别
      basicCategory(obj){
        return;
        let idValueMap = [];
        let url_prodtype="/basic/prodtype?limit=99999999"
        this.$http.get(url_prodtype).then((res)=>{
          let urlProduct=res.data
          urlProduct.forEach(e => {
            let prodTypeId=e.prodTypeId;
            let name=e.name;
            let boxName={name,prodTypeId}
            for(var i=0;i<idValueMap.length;i++){
              if(idValueMap[i].name != e.name){
                idValueMap[i].name.push(boxName);
                return;
              }}
            idValueMap.push({
              name:[boxName]
            });
          });
          for(var index in urlProduct){
            if(obj===urlProduct[index].name){
              this.editModal.item.prodTypeId=urlProduct[index].prodTypeId
            }
          }
          this.urlProduct.prodTypeName=idValueMap[0].name;
        })
      },
      //获取客户信息数据
      customerList(){
        let that=this;
        let idValueMap = [];
        let url="/bas/customerList?page=1&limit=9999&keyword=&field="
        that.$http.get(url).then((res)=>{
          let urlProduct=res.data
          urlProduct.forEach(e => {
            let customerId=e.customerId;
            let name=e.customerAbbreviation;
            let boxName={name,customerId}
            for(var i=0;i<idValueMap.length;i++){
              if(idValueMap[i].name != e.name){
                idValueMap[i].name.push(boxName);
                return;
              }
            }
            idValueMap.push({
              name:[boxName]
            });
          });
          that.urlProduct.customerList=idValueMap[0].name;
        })
      },
      //获取生产线别数据
      lineName(){
        let idValueMap = [];
        let url_prodtype="/basic/prodline?page=1&limit=999999&keyword=&field="
        this.$http.get(url_prodtype).then((res)=>{
          let urlProduct=res.data
          urlProduct.forEach(e => {
            let prodLineId=e.prodLineId;
            let prodLineName=e.name;
            let boxName={prodLineId,prodLineName}
            for(var i=0;i<idValueMap.length;i++){
              if(idValueMap[i].name != e.name){
                idValueMap[i].name.push(boxName);
                return;
              }
            }
            idValueMap.push({
              name:[boxName],
            });
          });
          this.urlProduct.cityList=idValueMap[0].name;
        })
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
        that.urlProduct.dataList.splice(-2,2)
        that.arrangement.data=that.urlProduct.dataList;
      },
      //排序确定
      RankOk(){
        if(this.arrangement.data.length===0){
          this.$Notice.warning({
            title: i18n.t("pqc.tlcbe"),
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
            delArr.push(this.$http.delete("/examinecenter/pqc/prodbatch/"+ss[i].prodBatchId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t("pqc.ds"));
              that.reset();
            });
          }
        }

      },
      loadEditData(){
        this.editModal.dateLoading = true;
        let that = this
        this.$http.get("/tenant/user",{params:{limit:99999999}}).then(function (resp) {
          if(resp.data){
            that.search.userList = resp.data;
            that.editModal.dateLoading = false;
          }
        });
      },
      onCClick(obj,index){
        this.data[index]._checked = !this.data[index]._checked;
      },
      /**双击打开 */
      onDBClick(obj,index){
        let that = this;
        that.editModal.inspectionTypeId=true;
        that.editModal.batchNo='';
        that.editModal.batchName='';
        let TypeName=obj.prodTypeName;
        that.editModal.date= new Date(obj.productionDate);
        that.basicCategory(TypeName);
        that.basicName();
        that.customerList();
        that.lineName();
        that.editModal.item.prodBatchId=obj.prodBatchId;
        that.onPopUp();
        that.editModal.prodLineList=obj.prodLineList;
        let item={
          prodBatchId:obj.prodBatchId,
          orderNo:obj.orderNo,
          batchNo:obj.batchNo,
          productId:obj.productId,
          productNo:obj.productNo,
          productName:obj.productName,
          prodTypeName:obj.prodTypeName,
          batchQuantity:obj.batchQuantity,
//        totalProdQuantity:obj.totalProdQuantity,
          productionState :obj.productionState,
          customerId:obj.customerId,
          prodLineList:obj.prodLineList,
          remark:obj.remark
        }
        that.editModal.item=item
        that.editModal.show=true;
      },
      refreshData(){
        let that = this;
        that.table.loading = true;
        let params = {};
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = "keyword="+this.search.query+"&productionState="+this.search.productionState+"&field="+this.search.fieldName;

        if(this.search.dates && this.search.dates[0]){
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];
          params.query = "keyword="+this.search.query+"&productionState="+this.search.productionState+"&field="+this.search.fieldName+"&startDate="+this.$iqis.utils.getDayStart(1,sdate)+"&endDate="+this.$iqis.utils.getDayEnd(edate);
          //params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          //params.endDate = this.$iqis.utils.getDayEnd(edate);
        }
        //params.productionState=this.search.productionState;

        //params.fieldName = this.search.fieldName;

        this.$http.get("/examinecenter/pqc/prodbatch",{params:params}).then(function (resp) {
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
       downloadTemplate () {
        let url = "/examinecenter/pqc/prodbatch/export/template"
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
    },//end methods
    mounted(){
    }
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
  .list_no .ivu-card-body{padding-right: 0px !important;}
  .ivu-progress-success .ivu-progress-bg {
    background-color:rgb(65, 143, 238)!important;
  }
  .ivu-progress-success .ivu-progress-text {
      color: rgb(65, 143, 238)!important;
  }
  .white input{
    background:#fff!important;
  }
</style>
