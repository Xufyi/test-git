<template>
  <div class="iqis-page">
    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">
          <div class="iqis-page-search-row">
            <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
              <DatePicker v-model="search.dates" type="daterange" :placeholder="i18n.t('customer.dateFilter')" style="width: 210px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
              <Select v-model="search.isInternal" :placeholder="i18n.t('customer.isInternal')" clearable style="width: 100px;">
                <Option v-for="st in search.isInternalList" :key="st.value" :value="st.value">{{st.label}}</Option>
              </Select>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('customer.searchAll')" slot="prepend" style="width: 110px;text-align: left">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:1;padding-left: 8px; font-size:0;">
              <Button style="margin-right:8px;" type="primary" @click="refreshData">{{$t('customer.search')}}</Button>
              <Button type="ghost" @click="reset">{{$t('customer.reset')}}</Button></div>
          </div>
          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <Button type="ghost" v-if="permsBtn.INSERT_CUSTOMER_SCORE" icon="plus" @click="clear();getCustomerList();add.open=true;add.change=false;">{{$t('customer.add')}}</Button>
              <Button style="margin:0 8px;" type="ghost" v-if="permsBtn.UPDATE_CUSTOMER_SCORE" icon="edit" :disabled="tableEditDis" @click="editThis();getCustomerList();add.change=true;">{{$t('customer.edit')}}</Button>
              <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"confirm :title="i18n.t('customer.confirmDelete')" placement="bottom-start" @on-ok="deleteThis()">
                <Button v-if="permsBtn.DELETE_CUSTOMER_SCORE" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t('customer.delete')}}</Button>
              </Poptip>
            </div>
            <div class="iqis-page-tool-second">
              <Button type="text"  icon="refresh" @click="reset">{{$t('customer.refreshData')}}</Button>
              <!-- <Button type="primary" @click="rank">自定义列表</Button> -->
              <!-- <Button type="ghost" icon="share">导出报表</Button> -->
            </div>
          </div>
          <Table ref="pageTable" class="tableCustom" @on-row-dblclick="onDBClick" :height="430" v-drag-table-column="table.columns" :loading="table.loading"  border stripe :columns="table.columns" :data="table.data" @on-selection-change="tableSelectChange"></Table>
          <div style="padding: 20px 0 20px 0px;">
            <Page v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                  :page-size-opts="[10,20,50,100]"
                  @on-change="pageChange" @on-page-size-change="pageSizeChange"
                  size="small" show-total show-elevator show-sizer></Page>
          </div>
        </div>
      </div>
    </div> 
    <Modal :title="add.change?i18n.t('customer.mt'):i18n.t('customer.at')" @on-ok="save()" v-model="add.open" :mask-closable="false" :width="640">
      <Row type="flex" :gutter="40">
        <i-col span="12">{{$t('customer.customerNo')}}</i-col>
        <i-col span="12">{{$t('customer.customerShortName')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12">
          <Select :placeholder="i18n.t('pleaseChoose')" :disabled="noPermsDis" @on-change="getList(add.customerId)" v-model="add.customerId" filterable>
            <Option v-for="data in customerList"  :value="data.customerId" :label="data.customerNum" :key="data.customerId">{{data.customerNum}}/{{data.customerAbbreviation}}</Option>
          </Select>
        </i-col>
        <i-col span="12">
          <Select :placeholder="i18n.t('pleaseChoose')" :disabled="noPermsDis" @on-change="getList(add.customerId)" v-model="add.customerId" filterable>
            <Option v-for="data in customerList"  :value="data.customerId" :key="data.customerId">{{data.customerAbbreviation}}</Option>
          </Select>
        </i-col>
      </Row>

      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="12">{{$t('customer.qualityScore')}}</i-col>
        <i-col span="12">{{$t('customer.periodScore')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12">
          <!-- <Input v-model="add.qualityScore" @on-blur="judgeNum(add.qualityScore,$event)" placeholder="i18n.t('customer.point100')" style="width: 100%;"></Input> -->
          <InputNumber :disabled="noPermsDis" :max="100" :min="0" v-model="add.qualityScore" :placeholder="i18n.t('customer.point100')" style="width: 100%;"></InputNumber>
        </i-col>
        <i-col span="12">
          <!-- <Input v-model="add.deliveryScore" @on-blur="judgeNum(add.deliveryScore,$event)" placeholder="i18n.t('customer.point100')" style="width: 100%;"></Input> -->
          <InputNumber :disabled="noPermsDis" :max="100" :min="0" v-model="add.deliveryScore" :placeholder="i18n.t('customer.point100')" style="width: 100%;"></InputNumber>
          
        </i-col>
      </Row>

      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="12">{{$t('customer.priceScore')}}</i-col>
        <i-col span="12">{{$t('customer.serviceScore')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12">
          <!-- <Input v-model="add.priceScore" @on-blur="judgeNum(add.priceScore,$event)" placeholder="i18n.t('customer.point100')" style="width: 100%;"></Input> -->
          <InputNumber :disabled="noPermsDis" :max="100" :min="0" v-model="add.priceScore" :placeholder="i18n.t('customer.point100')" style="width: 100%;"></InputNumber>
          
        </i-col>
        <i-col span="12">
          <!-- <Input v-model="add.serviceScore" @on-blur="judgeNum(add.serviceScore,$event)" placeholder="i18n.t('customer.point100')" style="width: 100%;"></Input> -->
          <InputNumber :disabled="noPermsDis" :max="100" :min="0" v-model="add.serviceScore" :placeholder="i18n.t('customer.point100')" style="width: 100%;"></InputNumber>
          
        </i-col>
      </Row>

      <Row type="flex" :gutter="40" style="margin-top: 20px">
        <i-col span="12">{{$t('customer.comprehensiveScore')}}</i-col>
        <i-col span="12">{{$t('customer.ratingLevel')}}</i-col>
      </Row>
      <Row type="flex" :gutter="40">
        <i-col span="12">
          <!-- <Input v-model="add.compositeScore" @on-blur="judgeNum(add.compositeScore,$event)" placeholder="i18n.t('customer.point100')" style="width: 100%;"></Input> -->
          <InputNumber :disabled="noPermsDis" :max="100" :min="0" v-model="add.compositeScore" :placeholder="i18n.t('customer.point100')" style="width: 100%;"></InputNumber>
          
        </i-col>
        <i-col span="12">
          <Input :disabled="noPermsDis" v-model="add.scoreGrade" :maxlength="6" :placeholder="i18n.t('customer.over6')" style="width: 100%;"></Input>
        </i-col>
      </Row>
      <div slot="footer">
        <Button type="primary" v-if="!noPermsDis" size="large" @click="save" ok-text>{{$t('customer.confirm')}}</Button>
        <Button type="text" size="large" cancel-text @click="add.open=false">{{$t('customer.cancel')}}</Button>
      </div>
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
import $ from 'jquery'
export default {
  data:function() {
    let vm = this;
    return {
      i18n:window.i18n,
      scoreId:'',
      headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
      tableEditDis:true,
      search: {
        isInternal:"",
        isInternalList:[
          {value:"",label:i18n.t('customer.all')},
          {value:"1",label:i18n.t('customer.internal')},
          {value:"0",label:i18n.t('customer.customer')}
        ],
        query: "",
        fieldName: "",
        typeTree:[],
        userList:[],
        dates:[],
        typeDataLoading:false,
        data: {
          searchTypes: [
            {label: i18n.t('customer.search'),value: ""}, 
            {label: i18n.t('customer.customerNo'),value: "customerNum"},              
            {label: i18n.t('customer.customerShortName'),value: "customerAbbreviation"},
            {label: i18n.t('customer.ratingLevel'),value: "reviewGrade"},
            {label: i18n.t('customer.reviewer'),value: "reviewerName"}
          ]
        }
      },
      table: {
        loading:true,
        selected:false,
        pager: { 
          rows: 10,
          need: true,
          total: 100,
          limit: 10,
          current: 1
        },
        data: [
        ],
        columns: [
          {
            type: 'selection',
            align: 'center',
            width:40,
            minWidth: 40,
            // maxWidth: 40
          },
          {
            title: i18n.t('customer.customerNo'),
            className:'tablePadding',          
            width:110,
            minWidth:110,
            ellipsis:true,              
            key: 'customerNum' 
          },
          {
            title: i18n.t('customer.customerShortName'),
            className:'tablePadding',
            width:this.$store.state.locale=='zh_CN'?110:150,
            minWidth:this.$store.state.locale=='zh_CN'?110:150,
            ellipsis:true,              
            key: 'customerAbbreviation'
          },
          {
            title: i18n.t('customer.ratingLevel'),
            width:110,
            minWidth:110,
            className:'tablePadding',
            ellipsis:true,              
            key: 'scoreGrade'
          },
          {
            title: i18n.t('customer.comprehensiveScore'),
            width:this.$store.state.locale=='zh_CN'?110:140,
            minWidth:this.$store.state.locale=='zh_CN'?110:140,
            className:'tablePadding',
            ellipsis:true,              
            key: 'compositeScore'
          },
          {
            title: i18n.t('customer.qualityScore'),
            width:110,
            minWidth:110,
            className:'tablePadding',
            ellipsis:true,              
            key: 'qualityScore'
          },
          {
            title: i18n.t('customer.periodScore'),
            width:110,
            minWidth:110,
            className:'tablePadding',
            ellipsis:true,              
            key: 'deliveryScore'
          },
          {
            title: i18n.t('customer.priceScore'),
            width:110,
            minWidth:110,
            className:'tablePadding',
            ellipsis:true,              
            key: 'priceScore'
          },
          {
            title: i18n.t('customer.serviceScore'),
            width:110,
            minWidth:110,
            className:'tablePadding',
            ellipsis:true,              
            key: 'serviceScore'
          },
          {
            title: i18n.t('customer.scoreTime'),
            className:'tablePadding',
            width:106,
            minWidth:106,
            ellipsis:true,              
            key: 'createTime',
            //以下为获取时间处理
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
            title: i18n.t('customer.isInternal'),
            className:'tablePadding',
            width:110,
            minWidth:110,
            ellipsis:true,              
            key: 'isInternal', 
            // render:function(h,data){
            //   return h("span",data.row["isInternal"]==1?i18n.t('customer.internal'):i18n.t('customer.customer'))
            // }
            render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('customer.customer'),1:i18n.t('customer.internal')})
          },
          {
            title: i18n.t('customer.reviewer'),
            className:'tablePadding',
            // width:110,
            minWidth:110,
            ellipsis:true,              
            key: 'reviewerName'
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
      rankData: [
        {
          title: i18n.t('customer.customerNo'),          
          width:110,
          minWidth:110,
          ellipsis:true,              
          key: 'customerNum' 
        },
        {
          title: i18n.t('customer.customerShortName'),
          width:110,
          minWidth:110,
          ellipsis:true,              
          key: 'customerAbbreviation'
        },
        {
          title: i18n.t('customer.ratingLevel'),
          ellipsis:true,              
          key: 'scoreGrade'
        },
        {
          title: i18n.t('customer.comprehensiveScore'),
          ellipsis:true,              
          key: 'compositeScore'
        },
        {
          title: i18n.t('customer.qualityScore'),
          ellipsis:true,              
          key: 'qualityScore'
        },
        {
          title: i18n.t('customer.periodScore'),
          ellipsis:true,              
          key: 'deliveryScore'
        },
        {
          title: i18n.t('customer.priceScore'),
          ellipsis:true,              
          key: 'priceScore'
        },
        {
          title: i18n.t('customer.serviceScore'),
          ellipsis:true,              
          key: 'serviceScore'
        },
        {
          title: i18n.t('customer.scoreTime'),
          width:90,
          minWidth:90,
          ellipsis:true,              
          key: 'createTime',
          //以下为获取时间处理
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
          title: i18n.t('customer.isInternal'),
          width:110,
          minWidth:110,
          ellipsis:true,              
          key: 'isInternal', 
          // render:function(h,data){
          //   return h("span",data.row["isInternal"]==1?i18n.t('customer.internal'):i18n.t('customer.customer'))
          // }
          render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('customer.customer'),1:i18n.t('customer.internal')})
        },
        {
          title: i18n.t('customer.reviewer'),
          width:110,
          minWidth:110,
          ellipsis:true,              
          key: 'reviewerName'
        }
      ],
      customerList:[],
      add:{
        open:false,
        change:false,
        customerId:'',
        customerNum:'',
        customerAbbreviation:'',
        scoreGrade:'',
        compositeScore:'',
        qualityScore:'',
        deliveryScore:'',
        priceScore:'',
        serviceScore:'',
        createTime:'',
        isInternal:'',
        reviewerName:'',
        scoreId:''

      },
      permsCur:[
        "INSERT_CUSTOMER_SCORE",
        "SELECT_CUSTOMER_SCORE",
        "UPDATE_CUSTOMER_SCORE",
        "DELETE_CUSTOMER_SCORE",
      ],
      permsBtn:{
        "DELETE_CUSTOMER_SCORE":false,
        "SELECT_CUSTOMER_SCORE":false,
        "UPDATE_CUSTOMER_SCORE":false,
        "INSERT_CUSTOMER_SCORE":false,
      },
      noPermsDis:true,
    }
  },
  //end data
  created() {
    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.refreshData();
    this.$nextTick(function(){
      $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
      var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
      $('.ivu-table-tip td').html(noData)
    })
  },
  methods:{
    onPopUp(){
      if((!this.add.change&&this.permsBtn.INSERT_CUSTOMER_SCORE)||(this.add.change&&this.permsBtn.UPDATE_CUSTOMER_SCORE)){
        this.noPermsDis=false;
      }else{
        this.noPermsDis=true;
      }
    },
    reset(){
      this.search.dates=[];
      this.table.selected='';
      this.search.isInternal='';
      this.search.query='';
      this.search.fieldName='';
      this.pageChange(1);
      this.refreshData();
    },
    clear(){
      let that =this;
      that.add.customerId='';
      that.add.customerNum='';
      that.add.customerAbbreviation='';
      that.add.scoreGrade='';
      that.add.compositeScore='';
      that.add.qualityScore='';
      that.add.deliveryScore='';
      that.add.priceScore='';
      that.add.serviceScore='';
      that.add.createTime=new Date;
      that.add.isInternal='';
      that.add.scoreId='';
      this.onPopUp()

    },
    getCustomerList(){
      let that =this;
      that.$http.get("/bas/customer/allCustomer").then(function (resp) {
        that.customerList=resp.data;
      });
    },
    getList(id){
      let that =this;
      if(id){
        that.$http.get("/bas/customer/"+id).then(function (resp) {
          that.add.customerAbbreviation=resp.data.customerAbbreviation;
          that.add.customerName=resp.data.customerName;
        }); 
      }else{
        that.table.data.customerAbbreviation='';
        that.table.data.customerName='';
      }
      this.onPopUp()

    },
    save(){
      let that = this;
      let params = [
        {type:'Empty',title:i18n.t('customer.customerNo'),value:that.add.customerId},
        {type:'Empty',title:i18n.t('customer.qualityScore'),value:that.add.qualityScore},
        {type:'Empty',title:i18n.t('customer.periodScore'),value:that.add.deliveryScore},
        {type:'Empty',title:i18n.t('customer.priceScore'),value:that.add.priceScore},
        {type:'Empty',title:i18n.t('customer.serviceScore'),value:that.add.serviceScore},
        {type:'Empty',title:i18n.t('customer.comprehensiveScore'),value:that.add.compositeScore},
        {type:'Empty',title:i18n.t('customer.ratingLevel'),value:that.add.scoreGrade},

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
      let ss = this.$refs.pageTable.getSelection();    
      let newData = {
        customerId:that.add.customerId,
        customerNum:that.add.customerNum,
        customerAbbreviation:that.add.Abbreviation,
        scoreGrade:that.add.scoreGrade,
        compositeScore:that.add.compositeScore,
        qualityScore:that.add.qualityScore,
        deliveryScore:that.add.deliveryScore,
        priceScore:that.add.priceScore,
        serviceScore:that.add.serviceScore,
        createTime:(new Date(that.add.createTime)).getTime(),
        isInternal:1,
        reviewerName:that.add.reviewerName,
        scoreId:that.add.scoreId,
      };
      //console.log(newData)
      if((ss&&ss.length==1)||that.scoreId){
        newData.scoreId=that.scoreId?that.scoreId:ss[0].scoreId
        that.$http.put("/customer/score/"+newData.scoreId,newData,that.headers).then(function (resp) {
          that.$Message.success(i18n.t('customer.editSuccess'));
          that.reset();
        })
      }else{
        that.$http.post("/customer/score",newData,that.headers).then(function(resp){
          that.$Message.success(i18n.t('customer.addSuccess'));
          that.reset();
        })
      }
      that.add.open=false;
    },
    refreshData(){
      let that =this; 
      that.table.loading = true;
      let params = {};
      let startDate = '';
      let endDate = '';
      params.page = this.table.pager.current;
      params.limit = this.table.pager.limit;
      if(this.search.dates && this.search.dates[0]){
        startDate = this.$iqis.utils.getDayStart(1,this.search.dates[0]);
        endDate = this.$iqis.utils.getDayEnd(this.search.dates[1]);
        params.query='startDate='+startDate+'&endDate='+endDate+'&isInternal='+that.search.isInternal+'&field='+that.search.fieldName+'&keyword='+that.search.query;
      }else{
        params.query='isInternal='+that.search.isInternal+'&field='+that.search.fieldName+'&keyword='+that.search.query;
      }

      this.$http.get("/customer/score",{params:params}).then(function (resp) {
        that.table.data = resp.data;
        that.table.loading = false;
        that.table.pager.total = resp.pagerInfo.total;
        let rowCount =  resp.data? resp.data.length:10;
        that.table.pager.rows = Math.max(rowCount,6);
      })       
      that.$http.get('/tenant/user/profile').then(function(resp){
        //console.log(resp.data)
        that.add.reviewerName=resp.data.name;
      })
    },
    tableSelectChange(selection){
      this.table.selected = selection && selection.length > 0;
      if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
    },
    deleteThis(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/customer/score/"+ss[i].scoreId));
          }
          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('customer.deleteSuccess'));
              that.reset();
            });
          }
        }

    },
    editThis(){
      let ss = this.$refs.pageTable.getSelection();
      let that = this;
      // //console.log('--------------------------------------')
      // //console.log(ss)
      if(ss && ss.length == 1){
        if(ss[0].isInternal===0){
          that.$Notice.warning({title: i18n.t('customer.formCustomer')});
          return;
        }
        that.add.open=true;
        that.$http.get("/customer/score/"+ss[0].scoreId).then(function (resp) {
          that.add.customerId=resp.data.customerId,
          that.add.customerNum=resp.data.customerNum,
          that.add.customerAbbreviation=resp.data.Abbreviation,
          that.add.scoreGrade=resp.data.scoreGrade,
          that.add.compositeScore=resp.data.compositeScore,
          that.add.qualityScore=resp.data.qualityScore,
          that.add.deliveryScore=resp.data.deliveryScore,
          that.add.priceScore=resp.data.priceScore,
          that.add.serviceScore=resp.data.serviceScore,
          that.add.createTime=new Date(resp.data.createTime),
          that.add.isInternal=resp.data.isInternal,
          // that.add.reviewerName=resp.data.reviewerName,
          that.add.scoreId=resp.data.scoreId
        });
        
      }else{
        that.add.open=false;
        // this.$Notice.warning({
        //   title: '必须选择一条记录后才可以进行修改',
        //   desc: ''
        // });
      }
    },
    onDBClick(o,i){
      let that = this;
      this.getCustomerList();
      if(o.isInternal===0){
        that.$Notice.warning({title: i18n.t('customer.formCustomer')});
        return;
      }
      that.add.open=true;
      that.add.change=true;
      that.scoreId=o.scoreId;
      that.$http.get("/customer/score/"+o.scoreId).then(function (resp) {
        that.add.customerId=resp.data.customerId,
        that.add.customerNum=resp.data.customerNum,
        that.add.customerAbbreviation=resp.data.Abbreviation,
        that.add.scoreGrade=resp.data.scoreGrade,
        that.add.compositeScore=resp.data.compositeScore,
        that.add.qualityScore=resp.data.qualityScore,
        that.add.deliveryScore=resp.data.deliveryScore,
        that.add.priceScore=resp.data.priceScore,
        that.add.serviceScore=resp.data.serviceScore,
        that.add.createTime=new Date(resp.data.createTime),
        that.add.isInternal=resp.data.isInternal,
        // that.add.reviewerName=resp.data.reviewerName,
        that.add.scoreId=resp.data.scoreId
      });
      this.onPopUp()

        
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
    judgeNum(num){
      // if(num>100 || num<0){
      //   this.$Notice.warning({title: '得分不能大于100或小于0'});        
      //   event.target.value='';
      // }
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
  .tableCustom .ivu-table-body{
    height:286px!important;
  }
} */
</style>
