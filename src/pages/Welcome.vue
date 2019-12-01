<template>
  <div class="welcome-content">
    <div class="welcome-head" style="position: relative;">
      <div class="welcome-top-tool">
        <div class="welcome-top-tool-left">
          <!--<Breadcrumb>-->
          <!--<BreadcrumbItem >控制台</BreadcrumbItem>-->
          <!--</Breadcrumb>-->
        </div>
        
        <div class="welcome-top-tool-right">
          <DatePicker  type="daterange" placement="bottom-end" split-panels :placeholder="i18n.t('statistical.dateInterval')"
                        :start-date="new Date(2018, 2, 1)" style="width: 210px"
                        @on-change="onCustomDateChange"></DatePicker>
          <!-- <DatePicker type="daterange" placement="bottom-end" placeholder="日期区间" style="width: 200px"></DatePicker> -->
        </div>
        <div class="welcome-top-tool-right">
          <ReportDateSelector :intShow="false" @changed="day" v-model="total.days"></ReportDateSelector>
        </div>
      </div>
      

      <Row :gutter="24">
        <i-col span="6">
          <div class="welcome-total-col" style="background-color: #0F3F88;">
            <!-- <div class="welcome-total-item-cell cursor" @click="openTab('iqc')" style="text-align: left; width:40%">{{total.data.iqcAcceptanceRate}}<span style="margin-top:8px;" class="welcome-total-item-cell-name"><span style="font-size:20px"></span>{{$t('homePage.incomingMaterial')}}</span></div>
            <div class="welcome-total-item-cell" style="text-align: right; width:60%"><span class="cursor" @click="openTabIqcList()">{{total.data.iqcBatchCount}} <span style="font-size:12px">{{$t('homePage.incomingNumber')}}</span></span><span style="margin-top:12px;" class="welcome-total-item-cell-name" @click="openTabIqcAbnormal()"><span class="cursor"><span style="font-size:16px">{{total.data.iqcHappenAbnormalCount}} </span>{{$t('homePage.abnormalNumber')}}</span></span></div> -->
            <div class="item-left" @click="openTab('iqc')">
              <div class="item item-1">{{total.data.iqcAcceptanceRate}}</div>
              <div class="item item-2">{{$t('homePage.incomingMaterial')}}</div>
            </div>
            <div class="item-right">
              <div class="item item-1" @click="openTabIqcList()"><span style="cursor: pointer;"><span style="font-size:18px;">{{total.data.iqcBatchCount}}</span>&nbsp;{{$t('homePage.incomingNumber')}}</span></div>
              <div class="item item-2"@click="openTabIqcAbnormal()"><span style="cursor: pointer;"><span style="font-size:18px;">{{total.data.iqcHappenAbnormalCount}}</span>&nbsp;{{$t('homePage.abnormalNumber')}}</span></div>
            </div>
          </div>
        </i-col>
        <i-col span="6">
          <div class="welcome-total-col" style="background-color: #0E5ACE;">
            <!-- <div class="welcome-total-item-cell cursor" @click="openTab('oqc')" style="text-align: left; width:40%">{{total.data.oqcAcceptanceRate}}<span style="margin-top:8px;" class="welcome-total-item-cell-name"><span style="font-size:20px"></span>{{$t('homePage.shippingAllowance')}}</span></div>
            <div class="welcome-total-item-cell" style="text-align: right; width:60%"><span class="cursor" @click="openTabOqcList()">{{total.data.oqcBatchCount}} <span style="font-size:12px">{{$t('homePage.batchNumber')}}</span></span><span style="margin-top:12px;" class="welcome-total-item-cell-name" @click="openTabOqcAbnormal()"><span class="cursor"><span style="font-size:16px">{{total.data.oqcHappenAbnormalCount}} </span>{{$t('homePage.abnormalNumber')}}</span></span></div> -->
            <div class="item-left"  @click="openTab('oqc')">
              <div class="item item-1">{{total.data.oqcAcceptanceRate}}</div>
              <div class="item item-2">{{$t('homePage.shippingAllowance')}}</div>
            </div>
            <div class="item-right">
              <div class="item item-1" @click="openTabOqcList()"><span style="cursor: pointer;"><span style="font-size:18px;">{{total.data.oqcBatchCount}}</span>&nbsp;{{$t('homePage.batchNumber')}}</span></div>
              <div class="item item-2" @click="openTabOqcAbnormal()"><span style="cursor: pointer;"><span style="font-size:18px;">{{total.data.oqcHappenAbnormalCount}}</span>&nbsp;{{$t('homePage.abnormalNumber')}}</span></div>
            </div>
          </div>
        </i-col>
        <i-col span="6">
          <div class="welcome-total-col" style="background-color: #3E89FA;">
            <!-- <div class="welcome-total-item-cell cursor" @click="openTab('pqc')" style="text-align: left; width:40%">{{total.data.directRate}}<span style="margin-top:8px;" class="welcome-total-item-cell-name"><span style="font-size:20px"></span>{{$t('homePage.passthroughRate')}}</span></div>
            <div class="welcome-total-item-cell" style="text-align: right; width:60%"><span class="cursor" @click="openTabPqcList()">{{total.data.totalProductionCount}} <span style="font-size:12px">{{$t('homePage.productionQuantity')}}</span></span><span style="margin-top:12px;" class="welcome-total-item-cell-name" @click="openTabPqcAbnormal()"><span class="cursor"><span style="font-size:16px">{{total.data.badProductionCount}} </span>{{$t('homePage.badNumber')}}</span></span></div> -->
            <div class="item-left"  @click="openTab('pqc')">
              <div class="item item-1">{{total.data.directRate}}</div>
              <div class="item item-2">{{$t('homePage.passthroughRate')}}</div>
            </div>
            <div class="item-right">
              <div class="item item-1" @click="openTabPqcList()"><span style="cursor: pointer;"><span style="font-size:18px;">{{total.data.totalProductionCount}}</span>&nbsp;{{$t('homePage.productionQuantity')}}</span></div>
              <div class="item item-2" @click="openTabPqcAbnormal()"><span style="cursor: pointer;"><span style="font-size:18px;">{{total.data.badProductionCount}}</span>&nbsp;{{$t('homePage.badNumber')}}</span></div>
            </div>
          </div>
        </i-col>  
        <i-col span="6">
          <div class="welcome-total-col" style="background-color: #1BB3F3;">
            <!-- <div class="welcome-total-item-cell cursor" @click="openTab('cc')" style="text-align: left; width:40%">{{total.data.totalComplaintCount}}<span style="margin-top:8px;" class="welcome-total-item-cell-name"><span style="font-size:20px"></span>{{$t('homePage.customerComplaint')}}</span></div>
            <div class="welcome-total-item-cell" style="text-align: right; width:60%"><span class="cursor" @click="openTabCcList()">{{total.data.importantComplaintCount}} <span style="font-size:12px">{{$t('homePage.significantAbnormal')}}</span></span><span style="margin-top:12px;" class="welcome-total-item-cell-name" @click="openTabCcAbnormal()"><span class="cursor"><span style="font-size:16px">{{total.data.customerRefundCount}} </span>{{$t('homePage.guestBackNumber')}}</span></span></div> -->
            <div class="item-left" @click="openTab('cc')">
              <div class="item item-1">{{total.data.totalComplaintCount}}</div>
              <div class="item item-2">{{$t('homePage.customerComplaint')}}</div>
            </div>
            <div class="item-right">
              <div class="item item-1" @click="openTabCcList()"><span style="cursor: pointer;"><span style="font-size:18px;">{{total.data.importantComplaintCount}}</span>&nbsp;{{$t('homePage.significantAbnormal')}}</span></div>
              <div class="item item-2" @click="openTabCcAbnormal()"><span style="cursor: pointer;"><span style="font-size:18px;">{{total.data.customerRefundCount}}</span>&nbsp;{{$t('homePage.guestBackNumber')}}</span></div>
            </div>
          </div>
        </i-col>
      </Row>
      <!-- <div style="height: 24px;width: 100%;clear: both;">&nbsp;</div> -->
      <div style="height: 10px;width: 100%;clear: both;">&nbsp;</div>
      <Spin size="large" fix v-if="total.loading"></Spin>
    </div>

    <!-- <Row :gutter="24">
      <i-col span="12"> -->
        <div class="welcom-report-item">
          <div class="welcome-report-head">
            <Row>
              <i-col span="12">
                <div style="float:left"><span class="welcome-report-title">{{$t('homePage.passthroughRate')}}</span></div><div class="selectDiv" style="float:left; margin-left:10px;padding: 4px 0 0 0;"><Cascader :change-on-select="true" style="width:240px;" :placeholder="i18n.t('homePage.WorkshopAndLine')" :data="datass" v-model="value1"></Cascader></div>
              </i-col>
              <i-col span="8">
                <span class="welcome-report-title">{{$t('homePage.defectRanking')}}</span> 
              </i-col>
              <i-col span="4">
                <!-- <span class="welcome-report-title">{{$t('homePage.defectRanking')}}</span>  -->
              </i-col>
            </Row>
            
            <!-- <div class="welcome-report-date-tool"></div> -->
          </div>
          <div class="iqis-table-container" style="padding:0 10px;">
            <!-- <div style="height: 360px;width:100%;margin-bottom: 24px;" ref="abnormalCauseEchart"></div> -->
            <Row :gutter="24">
              <i-col span="12" class="i_col">
                <div style="height: 300px;width:100%;margin-bottom: 24px; float:left" ref="lineEchart"></div>
              </i-col>
              <i-col span="8">
                <div style="height: 300px;width:100%;" ref="barEchart"></div>
              </i-col>
              <i-col span="4">
                
                <div>
                  <!-- <Table :columns="columns1" :show-header="false" :data="data1"></Table> -->
                  <ul class="ulStyle" style="margin-top:13px; width:260px;">
                    <li v-for="(item,index) in data1">
                      <span class="sp1"><div :class="'divStyle'+(index+1)">{{index+1}}</div></span>
                      <span class="sp2">{{item.defectName}}</span>
                      <span class="sp3">{{item.defectQuantity}}</span>
                    </li>
                  </ul>
                </div>
              </i-col>
            </Row>
            
            <!-- <Table :columns="abnormalCause.table.columns" class="iqis-table welcome-report-table" :data="abnormalCauseListData" size="small"></Table> -->
          </div>
          <Spin size="large" fix v-if="abnormalCause.loading"></Spin>
        </div>
      </i-col>
      <!-- <i-col span="12">
        <div class="welcom-report-item">
          <div class="welcome-report-head">
            <span class="welcome-report-title">{{$t("homePage.processDefectHistogram")}}</span>
            <div class="welcome-report-date-tool">
            </div>
          </div>
          <div class="welcome-report-body iqis-table-container">
            <div style="height: 166px;width:100%;margin-bottom: 24px;" ref="defectEchart"></div>
            <Table :columns="defect.table.columns" class="iqis-table welcome-report-table" :data="defect.data" size="small"></Table>
          </div>
          <Spin size="large" fix v-if="defect.loading"></Spin>
        </div>
      </i-col> -->
      <!-- <i-col span="12">
        <div class="welcom-report-item">
          <div class="welcome-report-head">
            <span class="welcome-report-title">过程缺陷分布</span>
            <div class="welcome-report-date-tool">
              <ReportDateSelector v-model="defect.days"></ReportDateSelector>
            </div>
          </div>
          <div class="welcome-report-body">
            <div style="height: 166px;width:100%;margin-bottom: 24px;" ref="defectEchart"></div>
            <Table :columns="defect.table.columns" class="iqis-table welcome-report-table" :data="defect.data" size="small"></Table>
          </div>
          <Spin size="large" fix v-if="defect.loading"></Spin>
        </div>
      </i-col> -->
    <!-- </Row> -->
    <div style="height: 10px;width: 100%;clear: both;">&nbsp;</div>
    <Row :gutter="24">
      <i-col span="12">
        <div class="welcom-report-item" style="height: 362px;" >
          <div class="welcome-report-head">
            <span class="welcome-report-title">{{$t("homePage.guestComplaints")}}</span>
            <div class="welcome-report-date-tool">
              <!-- <ReportDateSelector  v-model="complaint.days"></ReportDateSelector> -->
            </div>
          </div>
          <div class="welcome-report-body">
            <div style="height: 270px;width:100%;" ref="complaintEchart"></div>
          </div>
          <Spin size="large" fix v-if="complaint.loading"></Spin>
        </div>
      </i-col>
      <i-col span="12">
        <div class="welcom-report-item" style="height: 362px;" >
          <div class="welcome-report-head">
            <span class="welcome-report-title">{{$t("homePage.abnormalSupplier")}}</span>
            <div class="welcome-report-date-tool">
              <!-- <ReportDateSelector  v-model="supplier.days"></ReportDateSelector> -->
            </div>
          </div>
          <div class="welcome-report-body">
            <div style="height: 270px;width:100%;" ref="supplierEchart"></div>
          </div>
          <Spin size="large" fix v-if="supplier.loading"></Spin>
        </div>
      </i-col>
    </Row>
    <div style="clear: both"></div>
    <div class="page-end" style="padding-bottom: 12px"></div>
  </div>

</template>
<script>
  import $ from 'jquery'
  import ReportDateSelector from '../components/reportDateSelector/ReportDateSelector'
  import echarts from 'echarts'
  import ICol from "iview/src/components/grid/col";
  import reportConfig from '../pages/statistic/tendencyConfig.js';
  export default {
    props:["params"],
    components: {ICol},
    data(){
      return {
        value1:[],
        datass: [],
        echartDataName:[],
        echartSeries:[],
        echartXaxisName:[],
        timeStart:null,
        timeEnd:null,
        prodLineTypeId:0,
        essenceDate:[],
        Day:30,
        custom:[],
        i18n:window.i18n,
        colors:["#4fa8f9", "#6ec71e", "#f56e6a", "#fc8b40", "#818af8", "#31c9d7", "#f35e7a", "#ab7aee", "#14d68b", "#edb00d"],
        columns1: [
              {
                  title: 'Name',
                  key: 'name'
              },
              /* {
                  title: 'Age',
                  key: 'age'
              }, */
              {
                  title: 'Address',
                  key: 'address'
              }
          ],
        data1: [],
        total:{//total
          days:30,
          loading:false,
          chart:null,
          data:{
            iqcCount:0,
            iqcAbnormalCount:0,
            oqcCount:0,
            oqcAbnormalCount:0,
            totalProductionCount:0,
            badProductionCount:0,
            totalComplaintCount:0,
            importantComplaintCount:0
          }
        },
        stacked:{
          chart:null,
        },
        histogram:{
          chart:null,
          option:null,
        },
        abnormalCauseListData:[],
        abnormalCause:{//abnormal-cause
          days:30,
          loading:false,
          chart:null,
          table:{
            columns:[
              {
                type:'index',
                title: i18n.t("homePage.ranking"),
                // width:100,
                align:'center',
              },{
                title: i18n.t("homePage.badRate"),
                className:'countStyle',
                align:'center',
                key: 'rate'
              },{
                title: i18n.t("homePage.lineName"),
                align:'center',
                className:'nameStyle',
                key: 'name'
              }
            ]
          },
          data:[
            /* {
              index:1,
              count:1610,
              name:"指标错误"
            },{
              index:2,
              count:1091,
              name:"操作失误"
            },{
              index:3,
              count:528,
              name:"磨具错位"
            },{
              index:4,
              count:201,
              name:"参数错误"
            },{
              index:5,
              count:66,
              name:"温度太高"
            } */

          ]
        },
        defect:{//defect top5
          days:30,
          loading:false,
          chart:null,
          table:{
            columns:[
              {
                type:'index',
                title: i18n.t("homePage.ranking"),
                align:'center',
                // key: 'index'
              },{
                // width:260,
                title: i18n.t("homePage.defectsQuantity"),
                // align:'center',
                align:'center',
                className:'countStyle',
                
                key: 'count'
              },{
                title: i18n.t("homePage.defectName"),
                align:'center',
                className:'nameStyle',
                key: 'name'
              }
            ]
          },
          data:[]
        },
        complaint:{//customer complaint distribute
          days:30,
          loading:false,
          chart:null,
          data:[
            {
              index:1,
              count:156,
              name:"翔子磁电"
            },{
              index:2,
              count:90,
              name:"德尔莱"
            },{
              index:3,
              count:88,
              name:"鑫腾"
            },{
              index:4,
              count:70,
              name:"盛源"
            },{
              index:5,
              count:23,
              name:"安优"
            },{
              index:6,
              count:8,
              name:"斯沃琪"
            }

          ]
        },
        supplier:{//supplier abnormal distribute
          days:30,
          loading:false,
          chart:null,
          data:[
            {
              index:1,
              count:982,
              name:"某某电子"
            },{
              index:2,
              count:672,
              name:"某某科技"
            },{
              index:3,
              count:570,
              name:"某米"
            },{
              index:4,
              count:301,
              name:"某达"
            },{
              index:5,
              count:157,
              name:"某某商城"
            }

          ]
        }
      }
    },
    mounted() {
      this.init();
      this.lineEchartFun();
      let that = this;
      that.$http.get("/basic/prodlinetype",{params:{limit:99999999}}).then(function(resp){
        let root = {title:i18n.t('customer.projectType'),selected: false,label:"车间/线别",value:0,expand:true};
        that.$iqis.utils.treeify(resp.data,root,"prodLineTypeId","prodLineTypeName","parentId");
        that.datass = [root];
        // //console.log(that.selects.inspectionTypes,'检验项目数据')
      })
    },
    created () {

    },
    watch:{
      //监听切换时间
      'total.days':function(newVal,oldVal){
        this.getTotalData();
        this.updateKsChart();
        this.updateGysChart();
      },
      'abnormalCause.days':'updateYcyyChart',
      'defect.days':'updateQxChart',
      'complaint.days':'updateKsChart',
      'supplier.days':'updateGysChart',
      '$store.getters.pageWidth':'resizeCharts',

      value1:{
            handler:function (val, oldVal) {
              this.prodLineTypeId = val[val.length-1] || 0
              let that = this;
              this.$http.get('/diagram/report/pqc/collation?business=first_pass_yield&by=byLineType&hourOffset=8&start='+this.timeStart+'&end='+this.timeEnd+'&prodLineTypeId='+this.prodLineTypeId).then(function(res){
          console.log(res,'dddddddddddddddd');
          if(res.data){
            that.echartSeries = []
            that.echartDataName = []
            that.echartXaxisName = []
            that.data1 = [];
            for(let i = 0; i < res.data[0].list.length; i++){
              that.echartXaxisName.push(res.data[0].list[i].date)
            }
            
            for(let i = 0; i < res.data.length-1; i++){
              that.echartDataName.push(res.data[i].name)
              let obj = new Object();
              obj.name = res.data[i].name;
              obj.type = res.data[i].type;
              let arrData = [];
              for(let j = 0; j < res.data[i].list.length; j++){
                arrData.push(res.data[i].list[j].dataList)
              }
              obj.data = arrData
              that.echartSeries.push(obj)
              for(let i = 0; i < that.echartSeries.length; i++){
                if(that.echartSeries[i].data.length == 0){
                  that.echartXaxisName.push('-')
                  for(let j = 0; j < that.echartSeries.length; j++){
                    that.echartSeries[i].data.push(0)
                    
                  }
                }
              }
            }
            let length = res.data.length-1;
            for(let i = 0; i < res.data[length].defectData.length; i++){
              if(i < 7){
                that.data1.push(res.data[length].defectData[i])
              }
            }
            if(that.data1.length < 7){
              let cha =7 - that.data1.length
              for(let i = 0; i < cha; i++){
                  that.data1.push({defectName:'-',defectQuantity:0})
                  
              }
            }
            if(res.data.length == 1){
              that.echartSeries = [
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
              ]
              that.echartDataName = ['-','-','-','-','-','-','-',];
              that.echartXaxisName = ['-','-','-','-','-','-','-',];
              
            }
            console.log(that.echartXaxisName,'that.echartXaxisName');
            console.log(that.echartDataName,"that.echartDataName");
            console.log(that.echartSeries,"that.echartSeries");
            that.lineEchartFun();
            // that.barEchartFun()
          }
        })
            },
            deep:true
      },
      data1:{
        handler:function(val,oldVal){
          // if(val.length !== 0){
            this.barEchartFun();
          // }
        },
        deep:true
      }
    },
    computed:{

    },
    methods:{
      //只是时间组件传过来的值(子组件-->父组件)
      day(val){
        this.Day = val;
      },
      onCustomDateChange(d) {
        this.essenceDate = []
        this.essenceDate = d
        this.custom[0] = this.$iqis.utils.date.toDate(d[0]);
        this.custom[1] = this.$iqis.utils.date.toDate(d[1]);
        
        /* this.custom[0] = d[0];
        this.custom[1] = d[1]; */
      },
      // 四个色块的跳转功能
      openTab(IPOC){
        if(IPOC =="iqc"){
          this.$emit("open-tab",'statistic-analysis-diagram-tendency',"趋势图",'page-statistic-tendency',{sign:true,ipoc:IPOC,business:'acceptance_rate',day:this.Day,custom:this.custom,essenceDate:this.essenceDate});
        }else if(IPOC == 'pqc'){
          this.$emit("open-tab",'statistic-analysis-diagram-tendency',"趋势图",'page-statistic-tendency',{sign:true,ipoc:IPOC,business:'acceptance_rate',day:this.Day,custom:this.custom,essenceDate:this.essenceDate});
        }else if(IPOC == 'oqc'){
          this.$emit("open-tab",'statistic-analysis-diagram-tendency',"趋势图",'page-statistic-tendency',{sign:true,ipoc:IPOC,business:'acceptance_rate',day:this.Day,custom:this.custom,essenceDate:this.essenceDate});
        }else{
          this.$emit("open-tab",'statistic-analysis-diagram-tendency',"趋势图",'page-statistic-tendency',{sign:true,ipoc:IPOC,business:'customer_complaint_count',day:this.Day,custom:this.custom});
        }
      },
      openTabIqcList(){
        this.$emit("open-tab",'qc-iqc-list',"来料检验",'page-exam-iqc-list');
      },
      openTabIqcAbnormal(){
        this.$emit("open-tab",'qc-iqc-abnormal',"来料异常",'page-exam-iqc-abnormal-list');
      },
      openTabOqcList(){
        this.$emit("open-tab",'qc-oqc-examine',"出货检验",'page-exam-oqc-list');
      },
      openTabOqcAbnormal(){
        this.$emit("open-tab",'qc-iqc-abnormal',"出货异常",'page-exam-iqc-abnormal-list');
      },
      openTabPqcList(){
        this.$emit("open-tab",'qc-pqc-bad-ratio',"过程直通率",'page-exam-pqc-bad-list');
      },
      openTabPqcAbnormal(){
        this.$emit("open-tab",'qc-pqc-bad-ratio',"过程直通率",'page-exam-pqc-bad-list');
      },
      openTabCcList(){
        this.$emit("open-tab",'customer-service-customer-complaint',"客诉管理",'page-customer-complaint');
      },
      openTabCcAbnormal(){
        this.$emit("open-tab",'customer-service-customer-return',"客退管理",'page-customer-return');
      },
      init(){
        // console.log('welcome init >>>>>>>>>>>================================')
        this.initChart();
        this.getTotalData();
      },
      resizeCharts(){
        let itemWidth = (this.$store.getters.pageWidth-(24*1))*0.5 - 20;
        let i_colWidth = $('.i_col').width()
        this.stacked.chart && this.stacked.chart.resize({width:(this.$store.getters.pageWidth-(24*1))*0.495})
        this.histogram.chart && this.histogram.chart.resize({width:(this.$store.getters.pageWidth-(24*1))*0.32})
        this.abnormalCause.chart && this.abnormalCause.chart.resize({width:itemWidth});
        this.defect.chart && this.defect.chart.resize({width:itemWidth});
        this.complaint.chart && this.complaint.chart.resize({width:itemWidth});
        this.supplier.chart && this.supplier.chart.resize({width:itemWidth});
      },
      getParams(type){//total,abnormalCause,defect,complaint,supplier
        let time_start;
        let time_end;
        let daysRange = this[type].days;
        if(daysRange == 0){//today
          time_start = this.$iqis.utils.getDayStart(1);
          time_end = this.$iqis.utils.getDayEnd();
        }else if(daysRange == 1){//tomorrow
           time_start = this.$iqis.utils.getDayStart(2);
           time_end = this.$iqis.utils.getDayStart(1);
        }else if(daysRange == 7){
            time_start = this.$iqis.utils.get7DayStart();
            time_end = this.$iqis.utils.getDayEnd();
        }else if(daysRange == 14){
            time_start = this.$iqis.utils.getDayStart(14);
            time_end = this.$iqis.utils.getDayEnd();
        }else if(daysRange == 30){
            time_start = this.$iqis.utils.getDayStart(30);
            time_end = this.$iqis.utils.getDayEnd();
        }
        let params = {
            hourOffset: this.$iqis.utils.getHourOffset(),
            start:time_start,
            end:time_end
        };
        return params;
      },
      getTotalData(){
        let time_start;
        let time_end;
        let daysRange = this.total.days;
        if(daysRange == 0){//today
          time_start = this.$iqis.utils.getDayStart(1);
          time_end = this.$iqis.utils.getDayEnd();
        }else if(daysRange == 1){//tomorrow
           time_start = this.$iqis.utils.getDayStart(2);
           time_end = this.$iqis.utils.getDayStart(1);
        }else if(daysRange == 7){
            time_start = this.$iqis.utils.get7DayStart();
            time_end = this.$iqis.utils.getDayEnd();
        }else if(daysRange == 14){
            time_start = this.$iqis.utils.getDayStart(14);
            time_end = this.$iqis.utils.getDayEnd();
        }else if(daysRange == 30){
            time_start = this.$iqis.utils.getDayStart(30);
            time_end = this.$iqis.utils.getDayEnd();
        }
        let params = {
            hourOffset: this.$iqis.utils.getHourOffset(),
            start:time_start,
            end:time_end
        };
        this.timeStart = time_start;
        this.timeEnd = time_end
        let that = this;
        this.$http.get("/diagram/home/total",{params}).then(function (resp){
            that.total.data = resp.data;
        });
        this.$http.get('/diagram/report/pqc/collation?business=first_pass_yield&by=byLineType&hourOffset=8&start='+this.timeStart+'&end='+this.timeEnd+'&prodLineTypeId='+this.prodLineTypeId).then(function(res){
          console.log(res,'dddddddddddddddd');
          if(res.data){
            that.echartSeries = []
            that.echartDataName = []
            that.echartXaxisName = []
            that.data1 = [];
            
            for(let i = 0; i < res.data[0].list.length; i++){
              that.echartXaxisName.push(res.data[0].list[i].date)
            }
            for(let i = 0; i < res.data.length-1; i++){
              that.echartDataName.push(res.data[i].name)
              let obj = new Object();
              obj.name = res.data[i].name;
              obj.type = res.data[i].type;
              obj.smooth = 0.4
              obj.smoothMonotone = 'y';
              /* obj.lineStyle={
                    width:3,
                  }; */
              // obj.showSymbol = false;
              let arrData = [];
              for(let j = 0; j < res.data[i].list.length; j++){
                arrData.push(res.data[i].list[j].dataList)
              }
              obj.data = arrData
              that.echartSeries.push(obj)
              for(let i = 0; i < that.echartSeries.length; i++){//控制总长度
                let length = that.echartSeries.length
                if(that.echartSeries[i].data.length == 0){//
                  that.echartXaxisName.push('-')
                  for(let j = 0; j < length; j++){
                    that.echartSeries[j].data.push(0)
                  }
                }
              }
            }
            let length = res.data.length-1;
            for(let i = 0; i < res.data[length].defectData.length; i++){
              if(i < 7){
                that.data1.push(res.data[length].defectData[i])
              }
            }
            if(that.data1.length < 7){
              let cha =7 - that.data1.length
              for(let i = 0; i < cha; i++){
                  that.data1.push({defectName:'-',defectQuantity:0})
              }
            }
            if(res.data.length == 1){
              that.echartSeries = [
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
                {name:'-',data:[0,0,0,0,0,0,0],type:'line'},
              ]
              that.echartDataName = ['-','-','-','-','-','-','-',];
              that.echartXaxisName = ['-','-','-','-','-','-','-',];
              
            }
            console.log(that.echartXaxisName,'that.echartXaxisName');
            console.log(that.echartDataName,"that.echartDataName");
            console.log(that.echartSeries,"that.echartSeries");
            that.lineEchartFun();
            // that.barEchartFun();
          }
        })
      },
      lineEchartFun(){
        this.stacked.chart = echarts.init(this.$refs.lineEchart);
        let that = this
        /* that.lineOption.series.push({
          itemStyle: {    //设置每个数据节点对应颜色
            normal: {
                color: function (params,index) {
                        var colorList = ["#4fa8f9", "#6ec71e", "#f56e6a", "#fc8b40", "#818af8", "#31c9d7", "#f35e7a", "#ab7aee", "#14d68b", "#edb00d"];
                        return colorList[params.seriesIndex-1]
                }
            }
        }
        }) */
        this.lineOption = {
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data:this.echartDataName
              // data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
          },
          grid: {
              top:'25px',
              left: '1%',
              right: '2%',
              bottom: '3%',
              containLabel: true
          },
          /* toolbox: {
              feature: {
                  saveAsImage: {}
              }
          }, */
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.echartXaxisName
              // data: ['周一','周二','周三','周四','周五','周六','周日']
          },
          yAxis: {
              type: 'value',
              max: 100,
              min:'dataMin',
              scale: false,
              axisLine: {
                lineStyle: {
                    color: "rgb(162, 162, 162)"
                }
            },
               axisLabel: {
                formatter: '{value} %'
            }
          },
          color:reportConfig.colorList,
          // color:["#f56e6a","#818af8"],
          series: this.echartSeries
          }
          // 使用刚指定的配置项和数据显示图表。
          this.stacked.chart.clear();//此方法作用是在重新渲染画布时,清空上一次绘制的画布,避免画布错乱!
          this.stacked.chart.setOption(this.lineOption);
         /*  window.addEventListener('resize', () => {
              this.stacked.chart.resize();  // 多个图表，第一个图表
          }); */
      },
      
      barEchartFun(){
        let dataName = [];
        let dataList = [];
        for(let i = 0; i < this.data1.length; i++){
          dataName.push('['+(i+1)+']'+this.data1[i].defectName)
          dataList.push(this.data1[i].defectQuantity)
        }
        dataName = dataName.reverse()
        dataList = dataList.reverse()
        console.log(dataName,"dataName");
        console.log(dataList,"dataList");
        
        
        this.histogram.chart = echarts.init(this.$refs.barEchart);
        let that = this;
        that.histogram.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
          },
          /* legend: {
              data: ['2011年', '2012年']
          }, */
          grid: {
              top:'20px',
              left: '6%',
              right: '5%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01],
              max:'dataMax'
          },
          yAxis: {
            // show:false,
              type: 'category',
              data: dataName,
              axisLabel: {
                show: false,
              }
          },
          series: [
              /* {
                  name: '2011年',
                  type: 'bar',
                  data: [18203, 23489, 29034, 104970, 131744, 630230]
              }, */
              {
                  // name: dataName,
                  type: 'bar',
                  itemStyle: {
                  //通常情况下:
                  normal: {
                      //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                      color:"rgb(107, 178, 247)",
                      /* color: function (params) {
                          return reportConfig.colorList[params.dataIndex % reportConfig.colorList.length];
                          }*/
                      } 
                  },
                  data: dataList
              }
          ]
        }
        that.histogram.chart.clear();
        that.histogram.chart.setOption(that.histogram.option)
        window.addEventListener('resize', () => {
            that.histogram.chart.resize();  //此功能主要是做图表自适应
        });

      },
      updateYcyyChart(){
        let params = this.getParams('abnormalCause');
        let that = this;
        /* /examinecenter/pqc/pqc?page=1&limit=7&query=result%3D%26state%3D%26field%3D%26keyword%3D%26customerId%3D&customerId= */
        // this.$http.get("/diagram/home/abnormal-top5",{params}).then(function (resp){
          // /diagram/report/pqc/dispatcher?business=bad_rate&by=byLine&hourOffset=8&start=1527091200000&end=1534867199000&toSupplierCustomerId=&productTypeId=&productId=&manufacturerId=&customerId=&prodLineId=
        this.$http.get("/diagram/report/pqc/dispatcher?business=bad_rate&by=byLine&hourOffset=8&start="+params.start+"&end="+params.end+"&toSupplierCustomerId=&productTypeId=&productId=&manufacturerId=&customerId=&prodLineId=").then(function (resp){
            that.abnormalCause.data = resp.data.list;
            // alert(that.abnormalCause.data)
            if(that.abnormalCause.data == undefined){
              that.abnormalCause.data =[{
                      index:1,
                      rate:0,
                      name:"-"
                    },{
                      index:2,
                      rate:0,
                      name:"-"
                    },{
                      index:3,
                      rate:0,
                      name:"-"
                    },{
                      index:4,
                      rate:0,
                      name:"-"
                    },{
                      index:5,
                      rate:0,
                      name:"-"
                    }
                ];
            }
            if(that.abnormalCause.data /*&&  that.abnormalCause.chart */){
              // that.abnormalCause.data = [];
              // that.abnormalCause.data = (resp.data.list).slice(0,5);
              that.abnormalCause.data = (that.abnormalCause.data).slice(0,5);//截取前5条数据
              // alert(that.abnormalCause.data.length)
              // console.log(that.abnormalCause.data);
              
              if(that.abnormalCause.data.length < 5){
                let a = 5 - that.abnormalCause.data.length;
                for(let i = 0; i < a; i++){
                  that.abnormalCause.data.push({name:'-',rate:'0.00'})
                }
              }
              var labels = [];
              var cdatas = [];
              that.abnormalCauseListData = []; 
              
              for(var i=0;i<that.abnormalCause.data.length;i++){
                labels.push(that.abnormalCause.data[i].name);
                if(Number(that.abnormalCause.data[i].rate) > 100){
                  let rate = '100.00'
                  cdatas.push(rate);
                }else{
                  cdatas.push(that.abnormalCause.data[i].rate);
                }
                var obj = new Object();
                obj.name = that.abnormalCause.data[i].name;
                if(Number(that.abnormalCause.data[i].rate) > 100){
                  let rate = '100.00%'
                  obj.rate = rate;
                }else{
                  obj.rate = that.abnormalCause.data[i].rate+'%';
                }
                
                that.abnormalCauseListData.push(obj)
              }

              that.abnormalCause.chart.setOption({
                color: ['#3398DB'],
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  top:'3%',
                  bottom: '3%',
                  containLabel: true,
                },
                xAxis: [{
                  type: 'category',
                  data: labels,
                  axisTick: {
                    alignWithLabel: true
                  }
                }],
                yAxis: [{
                  type: 'value',
                  min:0,
                  // max:100,
                  dataMax:100,
                  scale: true,
                  // max: function(value) {
                  //     return value.max;
                  // },
                  axisLabel: {
                    formatter: '{value} %'
                  }
                }],
                series: [{
                  name: i18n.t("homePage.badRate")+'(%)',
                  type: 'bar',
                  barWidth: '50px',
                  data: cdatas
                }]
              })
            }
        })

      },

      updateQxChart(){
        let params = this.getParams('defect');
        let that = this;

        // this.$http.get("/diagram/home/defect-top5",{params}).then(function (resp){
        this.$http.get("/diagram/report/pqc/dispatcher?business=defect&by=byDefect&hourOffset=8&start="+params.start+"&end="+params.end+"&toSupplierCustomerId=&productTypeId=&productId=&manufacturerId=&prodProcessId=&prodLineId=").then(function (resp){
          that.defect.data = resp.data.list;
          if(that.defect.data == undefined){
            that.defect.data =[{//为了美化空数据的展示
                    index:1,
                    count:0,
                    name:"-"
                  },{
                    index:2,
                    count:0,
                    name:"-"
                  },{
                    index:3,
                    count:0,
                    name:"-"
                  },{
                    index:4,
                    count:0,
                    name:"-"
                  },{
                    index:5,
                    count:0,
                    name:"-"
                  }
              ];
          }
          if(that.defect.data/*  && that.defect.chart */){
            var labels = [];
            var cdatas = [];
            that.defect.data = (that.defect.data).slice(0,5);
            // console.log(that.defect.data);
            
            if(that.defect.data.length < 5){
                let a = 5 - that.defect.data.length;
                for(let i = 0; i < a; i++){
                  that.defect.data.push({name:'-',count:0})
                }
              }
            for(var i=0;i<that.defect.data.length;i++){
              labels.push(that.defect.data[i].name);
              cdatas.push(that.defect.data[i].count);
            }

            that.defect.chart.setOption({
              color: ['#1BB3F3'],
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                top:'3%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [{
                type: 'category',
                data: labels,
                axisTick: {
                  alignWithLabel: true
                }
              }],
              yAxis: [{
                type: 'value'
              }],
              series: [{
                name: i18n.t("homePage.abnormalQuantity"),
                type: 'bar',
                // barWidth: '60%',
                barWidth: '50px',
                data: cdatas
              }]
            });
          }
        })
      },

      updateKsChart(){
        let params = this.getParams('complaint');
        let that = this;
        let x = 0;
        this.$http.get("/diagram/home/complaint",{params}).then(function (resp){

          that.complaint.data = resp.data;
          if(that.complaint.data.length == 0){
            that.complaint.data = [{
              index:1,
              count:0,
              name:"-"
            }]
          }
          if(that.complaint.data && that.complaint.chart){
            var labels = [];
            var cdatas = [];
            for(var i=0;i<that.complaint.data.length;i++){
              labels.push({name:that.complaint.data[i].name,icon: 'circle'});
              // labels.push(that.complaint.data[i].name);
              cdatas.push({value:that.complaint.data[i].count,name:that.complaint.data[i].name});
            }

            that.complaint.chart.setOption({
              tooltip: {
                trigger: 'item',
                //formatter: "{a} <br/>{b}: {c} ({d}%)"
                formatter:function(item) {
                  var result = '';
                  result += item.name+"<br/>"+item.marker + " " + item.seriesName + " : " + item.value+" ["+item.percent+"%]"  +"<br/>";
                  return result;
                }
              },
              legend: {
                orient: 'vertical',
                top:'middle',
                right: '0',
                align: 'left',
                formatter:  function(name){
                    var total = 0;
                    var target;
                    let count = [];
                    for (var i = 0, l = cdatas.length; i < l; i++) {
                    total += cdatas[i].value;
                    count.push(cdatas[i].value)
                    if (cdatas[i].name == name) {
                        target = cdatas[i].value;
                        }
                    }
                    console.log(count,"count.push(cdatas[i].value)");
                    
                    if(name.length > 4){
                      name=name.substring(0,3)+"···";
                    }

                    // console.log(x++,"x++");
                    
                    var arr = [
                      '{a|'+name+'}',
                      '{b|'+ ((target/total)*100).toFixed(2)+'%}',
                      '{c|'+count[x]+'}'
                    ]
                    return arr.join('')
                    x++;
                },
                textStyle:{
                    rich:{
                        a:{
                            fontSize:14,
                            width:60,
                            height:30,
                            // verticalAlign:'top',
                            align:'left',
                            padding:[0,0,0,0]
                        },
                        b:{
                            fontSize:14,
                            width:60,
                            height:30,
                            align:'left',
                            padding:[0,0,0,10],
                            // lineHeight:25
                        },
                        c:{
                            fontSize:14,
                            // width:150,
                            height:30,
                            align:'left',
                            padding:[0,0,0,10],
                            // lineHeight:25
                        }
                    }
                },
                data:labels
              },
              color:that.colors,
              series: [
                {
                  name:i18n.t("homePage.customerComplaints"),
                  type:'pie',
                  radius: ["70%","90%"],
                  center: ['29%', '50%'],
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                      show: true,
                      formatter:function(){
                        let total = 0;
                        that.complaint.data.forEach(function(o){total += o.count});
                        return "{number|"+ total + "\n\n}{title|"+i18n.t('homePage.defectiveQuantity')+"}";
                      },
                      rich: {
                        title: {
                          fontSize: '14',
                          fontFamily: 'Microsoft YaHei',
                          color: '#5C5C5C'
                        },
                        number: {
                          fontSize: '27',
                        fontFamily: 'HelveticaNeue',
                          color: '#262626'
                        }
                      },
                      position: 'center'
                    },

                    emphasis: {
                      show: false,
                      textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                      }
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data:cdatas
                }
              ]
            })
          }
        });
      },

      updateGysChart(){
        let params = this.getParams('supplier');
        let that = this;
        let x = 0;
        this.$http.get("/diagram/home/supplier-abnormal-distribution",{params}).then(function (resp){

          that.supplier.data = resp.data;
          if(that.supplier.data.length == 0){
            that.supplier.data = [{
              index:1,
              count:0,
              name:"-"
            }]
          }
          if(that.supplier.data && that.supplier.chart){
            var labels = [];
            var cdatas = [];
            for(var i=0;i<that.supplier.data.length;i++){
              labels.push({name:that.supplier.data[i].name,icon: 'circle'});
              cdatas.push({value:that.supplier.data[i].count,name:that.supplier.data[i].name});
            }

            that.supplier.chart.setOption({
              tooltip: {
                trigger: 'item',
                formatter:function(item) {
                  var result = '';
                  result += item.name+"<br/>"+item.marker + " " + item.seriesName + " : " + item.value+" ["+item.percent+"%]" +"<br/>";
                  return result;
                }
              },
              legend: {
                orient: 'vertical',
                top:'middle',
                right:"0",
                align: 'left',
                formatter:  function(name){
                    var total = 0;
                    var target;
                    let count=[];
                    for (var i = 0, l = cdatas.length; i < l; i++) {
                    total += cdatas[i].value;
                    count.push(cdatas[i].value)
                    if (cdatas[i].name == name) {
                      
                        target = cdatas[i].value;

                        }
                    }
                    // console.log(count,"countcountcountcount");
                    
                    if(name.length > 4){
                      name=name.substring(0,3)+"...";
                    }
                    var arr = [
                      '{a|'+name+'}',
                      '{b|'+ ((target/total)*100).toFixed(2)+'%}',
                      '{c|'+count[x]+'}'
                    ]
                    return arr.join('')
                    x++;
                },
                textStyle:{
                    rich:{
                        a:{
                            fontSize:14,
                            width:60,
                            height:30,
                            // verticalAlign:'top',
                            align:'left',
                            padding:[0,0,0,0]
                        },
                        b:{
                            fontSize:14,
                            width:60,
                            height:30,
                            align:'left',
                            padding:[0,0,0,10],
                            // lineHeight:25
                        },
                        c:{
                            fontSize:14,
                            // width:150,
                            height:30,
                            align:'left',
                            padding:[0,0,0,10],
                            // lineHeight:25
                        }
                    }
                },
                data:labels
              },
              color:that.colors,
              series: [
                {
                  name:i18n.t("homePage.abnormalQuantity"),
                  type:'pie',
                  radius: ["70%","90%"],
                  center: ['29%', '50%'],
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                      show: true,
                      formatter:function(){
                        let total = 0;
                        that.supplier.data.forEach(function(o){total += o.count});
                        return "{number|"+total+"\n\n}{title|"+i18n.t('homePage.defectiveQuantity')+"}";
                      },
                      rich: {
                        title: {
                          fontSize: '14',
                          fontFamily: 'Microsoft YaHei',
                          color: '#5C5C5C'
                        },
                        number: {
                          fontSize: '27',
                          fontFamily: 'HelveticaNeue',
                          color: '#262626'
                        }
                      },
                      position: 'center'
                    },
                    emphasis: {
                      show: false,
                      textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                      }
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data:cdatas
                }
              ]
            })
            window.addEventListener('resize', () => {
                that.supplier.chart.resize();  //此功能主要是做图表自适应
            });
          }
        });
      },


      initChart(){
        /* this.abnormalCause.chart = echarts.init(this.$refs.abnormalCauseEchart);
        this.updateYcyyChart();

        this.defect.chart = echarts.init(this.$refs.defectEchart);
        this.updateQxChart(); */

        this.complaint.chart = echarts.init(this.$refs.complaintEchart);
        this.updateKsChart();
        this.supplier.chart = echarts.init(this.$refs.supplierEchart);
        this.updateGysChart();
        
        this.resizeCharts();
      }
    }
  }

</script>
<style scoped>
  .cursor{
    cursor: pointer;
  }
  .welcome-top-tool{
    /* height: 50px; */
    height: 40px;
  }

  .welcome-top-tool-left{
    float:left;
  }
  .welcome-top-tool-right{
    float: right;
  }

  
  .welcome-total-col{
    display: flex;
    height: 80px;
    color: #fff;
    border-radius: 2px;
    padding: 0px 10px;
    box-sizing: border-box;
  }
  .welcome-total-col .item-left{
    height: 100%;
    flex: 0.4;
    cursor: pointer;
  }
  .welcome-total-col .item-right{
    height: 100%;
    flex: 0.6;
  }
  .welcome-total-col .item-left .item{
    height:50%;
  }
  .welcome-total-col .item-right .item{
    height:50%;
    text-align: right;
  }
  .welcome-total-col .item-left .item-1{
    font-size: 18px;
    padding-top: 10px;
  }
  .welcome-total-col .item-left .item-2{
    padding-top: 7px;
  }
  .welcome-total-col .item-right .item-1{
    padding-top: 10px;
  }


  .item-1,.item-2,.item-3{
    white-space:nowrap;
  }
  
  .welcome-total-item-cell{
    float: left;
    /* width: 50%; */
    font-size: 16px;
  }
  .welcome-total-item-cell-name{
    font-size: 12px;
    display: block;
  }

  .welcom-report-item{
    position: relative;
    /* height: 465px; */
    height: 340px;
    border: 1px solid #E9E9E9;
    border-radius: 2px;
    overflow: hidden;
  }

  .welcome-report-head{
    /* height: 56px; */
    height: 40px;
    border-bottom: 1px solid #E9E9E9;
  }

  .welcome-report-title{
    float: left;
    /* margin-top: 15px; */
    line-height: 39px;
    font-size: 16px;
    padding-left: 24px;

  }

  .welcome-report-date-tool{
    float: right;
    margin-top: 12px;
    /* padding-right: 12px; */
  }

  .welcome-report-body{
    padding: 24px 0;
    /* padding-top: 24px;
    padding-left: 24px;
    padding-right: 24px;
 */
  }
  .ulStyle{
    list-style-type: none;
  }
  .ulStyle li{
    border-bottom: 1px solid rgb(230, 230, 230);
    height: 37px;
    line-height: 37px;
  }
  .sp1{
    display: inline-block;
    width:20px;
    height:100%;
    /* background-color: red; */
    text-align: center;
    /* border-radius: 50 */
  }
  .sp2{
    display: inline-block;
    width: 100px;
    margin-left: 10px;
  }
  .sp3{
    display: inline-block;
    width: 100px;
    /* margin-left: 100px; */
  }
  .divStyle1{
    width: 20px;
    height: 20px;
    background-color: rgb(20, 58, 125);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: white;
  }
  .divStyle2{
    width: 20px;
    height: 20px;
    background-color: rgb(22, 83, 197);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: white;
  }
  .divStyle3{
    width: 20px;
    height: 20px;
    background-color:rgb(59, 129, 246);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: white;
  }
  
</style>
<style>
  .welcome-report-table  td {
    height: 30px !important;
  }
  .ivu-btn.ivu-btn-text{
    font-size:14px;
  }
  .ivu-btn.ivu-btn-primary{
    font-size:14px;
  }
  .ivu-btn.ivu-btn-ghost{
    font-size:14px;    
  }
  /* .welcome-report-title{
    margin-top:16px!important;
  } */
  
</style>
