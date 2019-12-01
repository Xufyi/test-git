/*
 * @Author: yaoxingpu 
 * @Date: 2019-04-03 19:23:20 
 * @Last Modified by: yaoxingpu
 * @Last Modified time: 2019-06-22 09:38:51
 */
<template>
    <div class="iqis-page">
    <div class="iqis-page-tool-row" style="display:none"></div>
    <div class="iqis-page-context statistic-spc-page">
      <div id="search-bar" class="search-bar">
        <div class="form-inline" role="form">
            <div class="ivu-line">
                <!-- 控制图类型 -->
                <span>{{$t('statistical.spcType')}}:</span>
                <RadioGroup size='small' v-model="chartType" type="button">
                    <!-- <Radio label="IMR">{{$t('statistical.I-MR')}}</Radio>
                    <Radio label="XR">{{$t('statistical.Xbar-R')}}</Radio>
                    <Radio label="XS">均值标准差图(Xbar-S)</Radio> -->
                    <Radio label="BAD_RATE_P">{{$t("statistical.DefectiveRateChant")}}</Radio>
                    <Radio label="BAD_RATE_NP">{{$t("statistical.DefectiveChart")}}</Radio>
                    <Radio label="DEFECT_RATE_U">{{$t("statistical.DefectiveRateChaut")}}</Radio>
                    <Radio label="DEFECT_C">{{$t("statistical.DefectChart")}}</Radio>
                </RadioGroup>
            </div>
            <!-- 统计数据 -->
            <div class="ivu-line" style='margin-top:10px;'>
                <span>{{$t("statistical.StatisticalData")}}:</span>
                <RadioGroup size='small' v-model="statisticalData" type="button">
                    <Radio label="iqc">{{$t("statistical.iqc")}}</Radio>
                    <Radio label="pqc">{{$t("statistical.pqc")}}</Radio>
                    <Radio label="oqc">{{$t("statistical.oqc")}}</Radio>
                </RadioGroup>
            </div>
            <!-- 统计方式 -->
            <div class="ivu-line" style='margin-top:10px;'>
                <span>{{$t("statistical.statisticalMethod")}}:</span>
                <RadioGroup size='small' v-model="statisticalPattern" type="button">
                    <Radio label="byTime">{{$t("statistical.time")}}</Radio>
                    <Radio label="byProduct">{{$t("statistical.product")}}</Radio>
                    <Radio label="byBatch" v-if="statisticalData == 'pqc'">{{$t("statistical.batch")}}</Radio>
                    <Radio label="byBatchNo" v-else>{{$t("statistical.batch")}}</Radio>
                    <Radio label="byProcess" v-show="(statisticalData == 'pqc')">{{$t("statistical.prodProcess")}}</Radio>
                    <Radio label="byLine" v-show="(statisticalData == 'pqc')">{{$t("statistical.productLine")}}</Radio>
                </RadioGroup>
            </div>
            <div class="exam-option-group-iqc ivu-line" style="margin-top:10px;">
                <label>{{$t("statistical.analysisCondition")}}:</label>
                <span class="exam-report-params">
                    <label style="width: auto;padding: 0 3px;">{{$t("statistical.DisplayDefectNameNumber")}}</label>
                    <Select :placeholder="i18n.t('Unlimited')" v-model="statisticFilterParams.number" style="width:140px" filterable>
                        <Option v-for="item in selectorsData.defectNumber" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                    <label style="width: auto;padding: 0 3px;">{{$t("statistical.fzfs")}}</label>
                    <Select :placeholder="i18n.t('Unlimited')" :disabled="packetModeShow" v-model="statisticFilterParams.packetModeId" style="width:140px" filterable>
                        <Option v-for="item in selectorsData.packetMOde" :value="item.packetModeId" :key="item.packetModeId">{{ item.name }}</Option>
                    </Select>
                    <label style="width: auto;padding: 0 3px;">{{$t("statistical.analysisType")}}</label>
                    <Select :placeholder="i18n.t('pleaseChoose')" disabled v-model="statisticFilterParams.analysisType" style="width:140px">
                        <Option :value="1">{{$t("statistical.analysisUse")}}</Option>
                        <Option :value="0">{{$t("statistical.controlUse")}}</Option>
                    </Select>
                    <label v-if="statisticFilterParams.analysisType==0" style="width: auto;padding: 0 3px;">{{$t("statistical.controlLimits")}}</label>
                    <Select v-if="statisticFilterParams.analysisType==0" :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.controlLimit" style="width:140px">
                    </Select>
                </span>
            </div>

            <div class="exam-option-group-iqc ivu-line" style="margin-top:10px;">
                <label>{{$t('statistical.filtrationCondition')}}:</label>
                <span class="exam-report-params">
                    <!-- 产品编号 -->
                    <label style="width: auto;padding: 0 3px;">{{$t('statistical.productNo')}}</label>
                    <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.productId" style="width:140px" filterable>
                        <Option v-for="item in selectorsData.productList" :value="item.productId" :key="item.productId">{{ item.no }}</Option>
                    </Select>
                    <label style="width: auto;padding: 0 3px;">{{$t('statistical.productSpec')}}</label>
                    <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.productId" style="width:140px" filterable>
                        <Option v-for="item in selectorsData.productList" :value="item.productId" :key="item.productId">{{ item.spec }}</Option>
                    </Select>
                    <label style="width: auto;padding: 0 3px;">{{$t('statistical.project')}}</label>
                    <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.inspectionTypeId" style="width:140px" filterable>
                        <Option v-for="item in selectorsData.inspectionTypeList" :value="item.inspectionTypeId" :key="item.inspectionTypeId">{{ item.name }}</Option>
                    </Select>
                    <label style="width: auto;padding: 0 3px;" v-if="buzType == 'pqc'">{{$t('statistical.productProcess')}}</label>
                    <Select :placeholder="i18n.t('Unlimited')" v-model="statisticFilterParams.prodStageId" style="width:140px" v-if="buzType == 'pqc'" filterable>
                        <Option v-for="item in selectorsData.prodProcessList" :value="item.prodProcessId" :key="item.prodProcessId">{{ item.prodProcessName }}</Option>
                    </Select>
                </span>
            </div>

            <div id="exam-report-date-pick" class="ivu-line" style='margin-top:10px;'>
                <label>{{$t('statistical.reportTime')}}:</label>
                <RadioGroup size='small' v-model="statisticDays.daysRange" type="button">
                    <Radio :disabled="daysRangeDis" label="0">{{$t('statistical.today')}}</Radio>
                    <Radio :disabled="daysRangeDis" label="7">{{$t('statistical.Nearly')}}7{{$t('statistical.days')}}</Radio>
                    <Radio :disabled="daysRangeDis" label="30">{{$t('statistical.Nearly')}}30{{$t('statistical.days')}}</Radio>
                    <Radio :disabled="daysRangeDis" label="-1">{{$t('statistical.custom')}}</Radio>
                </RadioGroup>
                <DatePicker v-if="statisticDays.daysRange == '-1'" type="daterange" class='initDatePicker' split-panels :placeholder="i18n.t('statistical.dateInterval')" style="width: 210px" @on-change="onCustomDateChange"></DatePicker>
            <Button type="primary" icon="ios-search" :disabled="isShowDisabled" @click="onBuildReport">{{$t('statistical.viewReport')}}</Button>
            <Button type="ghost" @click="onResetFilterParams">{{$t('statistical.reset')}}</Button>
            <!-- 导出报表 -->
            <Button style='float:right;' v-show="isChartShow == true" type="primary" icon="android-open" @click="onExportReport('exam-report')">{{$t('statistical.exportReport')}}</Button>
            </div>
            <div style='width:100%; border-bottom: 1px dashed #E9E9E9; margin:15px 0;'></div>
        </div>
      </div>
      
      <div id="report-tab" class="tab-content exam-report-main">
            <div id="report-tip" class="iqis-report-tab" v-show="isChartShow == false">
                <div class="iqis-table-no-data" style="height: 100px;line-height: 100px;">{{$t('statistical.pleaseChoose')}}</div>
            </div>
            <div id="exam-report" class="exam-report-border" v-if="isChartShow">
                <div class="iqis-chart">
                    <div class="iqis-chartNameText">
                        <div class="item"></div>
                        <div class="item item-text"><span class="chartName"></span></div>
                        <div class="item item-date">{{$t("statistical.tabulationDate")}}: {{makeDate}}</div>
                    </div>
                    <div class="info_all">
                        <div class="item">
                            <div class="info-item-txt">{{$t("statistical.productNo")}}：<span>{{info.no || ""}}</span></div>
                            <div class="info-item-txt">{{$t("statistical.productName")}}：<span>{{info.name || ""}}</span></div>
                            <div class="info-item-txt">{{$t("statistical.productSpec")}}：<span>{{info.spec || ""}}</span></div>
                            <div class="info-item-txt">UCL：<span>{{info.dataInfo.UCL || 0}}</span></div>
                            <div class="info-item-txt">CL：<span>{{info.dataInfo.CL || 0}}</span></div>
                            <div class="info-item-txt">LCL：<span>{{info.dataInfo.LCL || 0}}</span></div>
                        </div>
                        <div class="item">
                            <div class="info-item-txt">{{$t("statistical.batchTotal")}}：<span>{{info.dataInfo.allTotalQuantity || 0}}</span></div>
                            <div class="info-item-txt">{{$t("statistical.inspectionTotal")}}：<span>{{info.dataInfo.allSampleQuantity || 0}}</span></div>
                            <div class="info-item-txt">{{$t("statistical.badTotal2")}}：<span>{{info.dataInfo.allBadQuantity || 0}}</span></div>
                            <div class="info-item-txt">{{$t("statistical.defectTotal")}}：<span>{{info.dataInfo.allDefectCount || 0}}</span></div>
                            <!-- <div class="info-item-txt" v-show="rejectRatio">不良率：<span></span></div> -->
                            <div class="info-item-txt">{{$t("statistical.jyzs")}}：<span>{{info.dataInfo.size || 0}}</span></div>
                        </div>
                    </div>
                    <div class="chart-table">
                        <!-- 图表 -->
                        <div ref="spc_charts" class="charts"></div>
                        <div class="tables">
                            <Table border :columns="columns1" :data="data1"></Table>
                        </div>
                        <div class="tail-info">
                            <div class="item">{{$t("statistical.confirm")}}：</div>
                            <div class="item">{{$t("statistical.reReview")}}：</div>
                            <div class="item">{{$t("statistical.Tabulation")}}：</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
    import $ from 'jquery';
    import echart from 'echarts';
    import reportConfig from './statisticConfig';
    import html2canvas from 'html2canvas';
    import Highcharts from 'highcharts/highstock';
    import downloadPDF from '../../components/pdf/download-PDF.vue'
    export default {
        components: {
            downloadPDF,
        },
        name: '',
        data() {
            return {
                i18n:window.i18n,
                isShowDisabled:false,
                // 图表相关
                chartTable:'',
                spc:null,
                spcOption:{},
                ct:i18n.t("statistical.bll"),
                cd:i18n.t("statistical.incoming"),
                info:{
                    no:'',
                    name:'',
                    spec:'',
                    ucl:'',
                    cl:'',
                    lcl:'',
                    dataInfo:null,
                },

                htmlDomInfo:'',
                // rejectRatio:true,//控制不良率显示及隐藏
                makeDate:new Date().Format('yyyy-MM-dd hh:mm:ss'),
                buzType:'pqc',
                chartType:'BAD_RATE_P',
                statisticalData:'iqc',
                statisticalPattern:'byTime',
                statisticFilterParams:{
                    // productTypeId:null,
                    packetModeId:1,
                    number:5,
                    prodStageId:null,
                    productId:null,
                    inspectionTypeId:null,
                    sampleNum:1,
                    sampleGroup:null,
                    analysisType:1,
                    controlLimit:null,
                },
                selectorsData: {
                    defectNumber:[
                        {value:1,name:1},
                        {value:2,name:2},
                        {value:3,name:3},
                        {value:4,name:4},
                        {value:5,name:5},
                        {value:6,name:6},
                        {value:7,name:7},
                        {value:8,name:8},
                        {value:9,name:9},
                        {value:10,name:10},
                        {value:'',name:i18n.t("statistical.all")},
                    ],
                    
                    packetMOde:[
                        {packetModeId:1,name:i18n.t("statistical.mbyz")},
                        {packetModeId:2,name:i18n.t("statistical.mxsyz")},
                        {packetModeId:3,name:i18n.t("statistical.mtyz")},
                        {packetModeId:4,name:i18n.t("statistical.mzyz")},
                        {packetModeId:5,name:i18n.t("statistical.myyz")},
                    ],
                    productList:[],
                    productTypeList:[],
                    manufacturerList:[],
                    inspectionTypeList:[]
                },
                statisticDays:{
                    daysRange:'30',
                    custom:[], //Date
                    startTimestamp:0, // timestamp
                    endTimestamp:0
                },
                isChartShow:false,
                daysRangeDis:false,
                seriseData:[],
                columns1: [
                    {
                        title: i18n.t("statistical.groupSize"),
                        fixed: 'left',
                        width:40,
                        type:'index',
                    },
                     {
                        title: i18n.t("statistical.pls"),
                        align:'center',
                        minWidth:90,
                        maxWidth:90,
                        fixed: 'left',
                        key: 'totalQuantity'
                    },
                    {
                        title: i18n.t("statistical.testNumber"),
                        align:'center',
                        minWidth:90,
                        maxWidth:90,
                        fixed: 'left',
                        key: 'sampleQuantity'
                    },
                    {
                        title: i18n.t("statistical.badQuantity"),
                        align:'center',
                        minWidth:90,
                        maxWidth:90,
                        fixed: 'left',
                        key: 'badQuantity'
                    },
                    {
                        title: i18n.t("statistical.bll")+'%',
                        align:'center',
                        minWidth:90,
                        maxWidth:90,
                        fixed: 'left',
                        key: 'badRate'
                    },
                ],
                data1: [],
                lineName:[],
                brokenLine:[],//折线图data
                // batchOrNo:'byBatch',
                CL: 0,
                LCL: 0,
                UCL: 0,
            }
        },
        provide(){
            return {
                doms:{htmlDom:this.htmlDomInfo}
            }
        },
        created () {
            // 产品编号data
            this.$http.get("/basic/product/simple",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    this.selectorsData.productList = res.data;
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
            // 检验项目data 
            this.$http.get("/basic/inspectiontype",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    this.selectorsData.inspectionTypeList = res.data;
                    console.log(res.data,"res.datasdfasfasfasdfasdfasd");
                    
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
            // 生产工序data
            this.$http.get("/basic/prod-process",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    this.selectorsData.prodProcessList = res.data;
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
        },
        watch: {
            "statisticalPattern":function(newVal,oldVal){
                if(newVal == 'byTime'){

                }
            },
            "statisticFilterParams.productId":function(newVal,oldVal){
                let that = this;
                this.$http.get('/basic/product/'+newVal).then(function(res){
                    if(res.data){
                        that.info.no = res.data.no;
                        that.info.name = res.data.name;
                        that.info.spec = res.data.spec;
                    }
                    
                })
            },
            "chartType":function(newVal,oldVal){
                if(this.isChartShow){
                    if(newVal === 'BAD_RATE_P'){
                        this.ct = "不良率";
                    }
                    if(newVal === 'BAD_RATE_NP'){
                        this.ct = "不良数";
                    }
                    if(newVal === 'DEFECT_RATE_U'){
                        this.ct = "单位缺陷数";
                    }
                    if(newVal === 'DEFECT_C'){
                        this.ct = "缺陷数";
                    }
                }
            },
            "statisticalData":function(newVal,oldVal){
                if(this.isChartShow){
                    if(newVal === 'iqc'){
                        this.cd = "来料"
                    }
                    if(newVal === 'pqc'){
                        this.cd = "综合"
                    }
                    if(newVal === 'oqc'){
                        this.cd = "出货"
                    }
                    this.statisticalPattern = 'byTime'

                }
            },
        },
        mounted () {
            let that = this
            if(that.isChartShow)
            window.onresize = () => {
                return (() => {
                    let tabs_width = $('#report-tab').width();
                    $(".charts").css('width', tabs_width);
                    this.spc.resize();
                })()
            }
        },
        computed: {
            packetModeShow:function(){
                this.statisticFilterParams.packetModeId = null;
                if(this.statisticalPattern !== 'byTime'){
                    this.statisticFilterParams.packetModeId = null;
                    return true;
                }else{
                    this.statisticFilterParams.packetModeId = 1;
                    return false;
                }
                
                // this.statisticalPattern == 'byTime' ? true : false;
            },
            rejectRatio:function(){
                return this.chartType == 'BAD_RATE_P' ? true : false;
            }
        },
        methods: {
            onCustomDateChange(d){
                this.statisticDays.custom[0] = this.$iqis.utils.date.toDate(d[0]);
                this.statisticDays.custom[1] = this.$iqis.utils.date.toDate(d[1]);
            },
            /* 重置 */
            onResetFilterParams(){
                this.statisticFilterParams.productTypeId=null;
                this.statisticFilterParams.productId='';
                this.statisticFilterParams.manufacturerId=null;
                this.statisticDays.daysRange = "30";
                this.statisticFilterParams.prodStageId = null;
                this.statisticFilterParams.sampleNum = 1;
                this.statisticFilterParams.sampleGroup = null;
                this.statisticalData = "iqc";
                this.statisticalPattern = "byTime";
                this.chartType="BAD_RATE_P"
                this.sampleNumDis=true
                this.daysRangeDis = false
            },
            /* 导出 */
            onExportReport(borderId){
                // this.$bus.$emit('todoSth', {params:'bus'});
                let that = this;
                $(".iqis-chart").css("border","none")
                this.htmlDomInfo = $('.iqis-chart')[0]
                this.getChartHtml = this.htmlDomInfo
                let Url = ''
                // console.log(this.getChartHtml,'sfsafsfas');
                html2canvas($('.iqis-chart')[0]).then(function(canvas) {

                    // document.body.appendChild(canvas);
                    // canvas.width = 595.28
                    // canvas.width = 595.28;//这个设置不能丢，否者会成为canvas默认的300*150的大小
                     // canvas.height = 600;//这个设置不能丢，否者会成为canvas默认的300*150的大小
                    /* let contentWidth = canvas.width;
                    let contentHeight = canvas.height;

                    //一页pdf显示html页面生成的canvas高度;
                    var pageHeight = contentWidth / 592.28 * 841.89;
                    //未生成pdf的html页面高度
                    var leftHeight = contentHeight; */
                    Url = canvas.toDataURL("image/jpeg",1.0)
                    $(".iqis-chart").css("border","1px solid #333")
                    // return false;
                    const {href} = that.$router.resolve({ 
                        name: 'downloadPDF',
                        query:{x:Url}
                        // params:{id:1}
                    }); 
                    window.open(href, '_blank');
                    
                });
                
            },
            /* 查看报表 */
            onBuildReport(){
                let that = this;
                
                /* if(this.statisticFilterParams.productId == null){
                    this.$Notice.warning({title: i18n.t('statistical.selectProd'), desc: ''});
                    return;
                }
                if(this.statisticFilterParams.inspectionTypeId == null){
                    this.$Notice.warning({title: i18n.t('statistical.selectProj'), desc: ''});
                    return;
                }
                if(this.statisticFilterParams.sampleNum==null){
                    this.$Notice.warning({title: '请输入每组样本数', desc: ''});    
                    return;          
                } */
                let time_end = this.$iqis.utils.getDayEnd();
                let time_start = this.$iqis.utils.getDayStart(1);
                let daysRange = this.statisticDays.daysRange;
                if(daysRange == 7){
                    time_start = this.$iqis.utils.get7DayStart();
                }else if(daysRange == 30){
                    time_start = this.$iqis.utils.get30DayStart();
                }else if(daysRange == -1){
                    let startDate = this.statisticDays.custom[0];
                    let endDate = this.statisticDays.custom[1];
                    if(startDate && endDate){
                        time_end = endDate.getTime()+ 86399999;
                        time_start = startDate.getTime();
                    }else{
                        this.$Notice.warning({
                        title: i18n.t('statistical.selectTime'),
                        desc: ''
                        });
                        return;
                    }
                }
                this.statisticDays.startTimestamp = time_start;
                this.statisticDays.endTimestamp = time_end;
                // this.getReportData();
                let params ={
                    hourOffset:8,
                    start:this.statisticDays.startTimestamp,
                    end:this.statisticDays.endTimestamp,
                    by:this.statisticalPattern,
                    groupSize:this.statisticFilterParams.number,
                    groupTime:this.statisticFilterParams.packetModeId,
                    chartType:this.chartType,
                    productId:this.statisticFilterParams.productId,
                    prodProcessId:this.statisticFilterParams.prodStageId,
                    inspectorId:this.statisticFilterParams.inspectionTypeId,
                }
                that.isShowDisabled = true;
                // 表格头部相关数据
                this.$http.get("/diagram/report/"+this.statisticalData+"/countSpc",{params}).then(function(res){
                    console.log(res,"UUU");
                    that.isShowDisabled = false
                    if((res.data != {}) && res.data.title){
                        that.info.dataInfo = res.data
                        that.brokenLine = []
                        that. data1 = []
                        that.columns1= [
                            {
                                title: i18n.t('statistical.groupSize'),
                                fixed: 'left',
                                width:40,
                                type:'index',
                            },
                            {
                                title: i18n.t('statistical.pls'),
                                align:'center',
                                minWidth:90,
                                maxWidth:90,
                                fixed: 'left',
                                key: 'totalQuantity'
                            },
                            {
                                title: i18n.t('statistical.testNumber'),
                                align:'center',
                                minWidth:90,
                                maxWidth:90,
                                fixed: 'left',
                                key: 'sampleQuantity'
                            },
                            {
                                title: '不良数',
                                align:'center',
                                minWidth:90,
                                maxWidth:90,
                                fixed: 'left',
                                key: 'badQuantity'
                            },
                            {
                                title: i18n.t('statistical.badRate')+'%',
                                align:'center',
                                minWidth:90,
                                maxWidth:90,
                                fixed: 'left',
                                key: 'badRate'
                            },
                        ]
                        let titleList = res.data.title
                        let listData = res.data.list
                        for(let i = 0; i < listData.length; i++){
                            that.data1.push(listData[i])
                        }
                        // that.data1.push(listData)
                        for(let i = 0; i < titleList.length; i++){
                            that.columns1.push({
                                title: titleList[i].title,
                                align:'center',
                                minWidth:70,
                                key: titleList[i].key
                            })
                        }
                        that.brokenLine = res.data.brokenLine;//折线图数据
                        that.chartTable =res.data.chartTable;
                        // console.log(res,"res.data.chartTableres.data.chartTableres.data.chartTable");
                        that.lineName = [];
                        for(let i = 1; i < res.data.chartTable[0].length; i++){
                            that.lineName.push(res.data.chartTable[0][i])
                            // that.lineName.push(arr)
                        }
                        console.log(that.lineName,"this.barname1111111111111");
                        // return false;
                    // for(let i = 0; i < this.chartTable[0].length-1)
                    that.isChartShow = true;
                    that.$nextTick(function(){
                        $('.chartName').text("【 "+that.cd+that.ct+i18n.t('statistical.part3')+" 】")
                        that.SpcFun()
                    })
                    }else{
                        that.$Notice.warning({
                            title: i18n.t('statistical.noData')+'!',
                            desc: ''
                        });
                    }
                }).catch(function(err){
                    that.isShowDisabled = false
                })
                
            },
            /* 图表 */
            SpcFun(xAxisData=[],seriesData=[],idName = ''){
                let that = this;
                    this.spc = echart.init(this.$refs.spc_charts); 
                    // console.log(this.spc,'spc');
                    // console.log(this.chartTable,'this.chartTablethis.chartTablethis.chartTable');
                    
                    this.spcOption = {
                        legend: {
                            type:'scroll'
                        },
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        dataset: {
                            /* source: [
                                ['product', '2019', '2018', '2015', '2014'],
                                ['看不上', 41.1, 30.4, 65.1, 53.3],
                                ['缓慢', 86.5, 92.1, 85.7, 83.1],
                                ['动力不足', 24.1, 67.2, 79.5, 86.4],
                                ['没什么弹力', 20.1, 56.2, 91.5, 43.9]
                            ] */
                            source:this.chartTable
                        },
                        xAxis: [
                            {
                                show:false,
                                type: 'category', 
                                gridIndex: 0,
                                data:that.lineName,
                                // data: ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie']
                            },
                            {
                                type: 'category', 
                                gridIndex: 1,
                            }
                        ],
                        yAxis: [
                            {
                                type:"value",
                                gridIndex: 0,
                                max:function(value){
                                    if(value.max > that.info.dataInfo.UCL){
                                        return value.max;
                                    }else{
                                        return ((that.info.dataInfo.UCL - value.max)+(that.info.dataInfo.UCL - value.max)/2) + value.max;
                                    }
                                },
                                axisLabel:{
                                    formatter:`{value}%`
                                }
                            },
                            {   
                                gridIndex: 1,
                                max:'dataMax',
                                splitLine: {
                                    show: true
                                },
                                axisLabel:{
                                    formatter:`{value}%`
                                }
                            }
                        ],
                        grid: [
                            {bottom: '65%',left:'4%',right:"7%"},
                            {top: '40%',left:'4%',right:"7%"}
                        ],
                        series: [
                            {
                                type:'line',
                                color:'#418FEE',
                                markPoint: {
                                    data: [
                                        {
                                            type: 'max',
                                            name: '最大值'
                                        },
                                        {
                                            type: 'min',
                                            name: '最小值'
                                        }
                                    ]
                                },
                                markLine: {
                                    // silent:true,//图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
                                    // symbol:'circle',//标记类型
                                    symbolSize:6,//标线两端的标记大小，可以是一个数组分别指定两端，也可以是单个统一指定。
                                    precision: 3,//标线数值的精度，在显示平均值线的时候有用。
                                    data: [{
                                            name:"UCL",
                                            yAxis:this.info.dataInfo.UCL,
                                            itemStyle: {
                                                normal: {
                                                    color: '#64A600',
                                                   /*  label: {
                                                        formatter: `{b} {c}`
                                                    } */
                                                },
                                            },
                                            label: {
                                                formatter: `{b}= {c}`
                                            }
                                        },
                                        {
                                            name: 'CL',
                                            yAxis:this.info.dataInfo.CL,
                                            itemStyle: {
                                                normal: {
                                                    color: '#64A600',
                                                    /* label: {
                                                        formatter:`{b} {c}`
                                                    } */
                                                }
                                            },
                                             lineStyle: {
                                                normal: {
                                                    type: 'solid'
                                                }
                                            },
                                            label: {
                                                formatter:`{b}= {c}`
                                            }
                                        },
                                        {
                                            name: 'LCL',
                                            yAxis:this.info.dataInfo.LCL,
                                            itemStyle: {
                                                normal: {
                                                    color: '#64A600',
                                                    /* label: {
                                                        formatter: '{c} {c}'
                                                    } */
                                                }
                                            },
                                            label: {
                                                formatter: '{b}= {c}'
                                            }
                                        }
                                    ]
                                },
                                /* label:{
                                    show:true,
                                }, */
                                /* tooltip : {
                                    show:true,
                                    trigger: 'axis',
                                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                    }
                                }, */
                                data:this.brokenLine
                            },//折线数据

                           /*  {
                                type: 'bar', 
                                stack: '1',//配置样式
                                label: {show:true,formatter:1}, 
                                barMaxWidth:50, 
                                xAxisIndex: 1, 
                                yAxisIndex: 1,
                                seriesLayoutBy: 'row',
                                itemStyle: {    //设置每个数据节点对应颜色
                                    normal: {
                                        color: function (params,index) {
                                            var colorList = ["#95F05D", "#C9690C", "#975FE4", "#FFD736", "#5DA0F0", "#21A4BF","#2981CC","#FA9737","#EC63F2","#FAD337","#29CCCC","#B10DB9","#F2637B","#A51E34"];
                                            return colorList[params.seriesIndex-1]
                                        }
                                    }
                                }
                            }, */
                        ]
                    };
                    let leng = this.chartTable.length-1;
                    for(let i = 0; i < leng; i++){
                        this.spcOption.series.push({
                            type: 'bar', 
                            stack: '1',//配置样式
                            label: {
                                show:true,
                                // position:'left',
                                formatter:function(params){
                                    for(let i = 1; i < params.value.length; i++){
                                        if(params.value[params.seriesIndex] < 10){
                                            return params.value[params.seriesIndex] = '';
                                        }else{
                                            return params.value[params.seriesIndex]+'%'
                                        }
                                    }
                                }
                            }, 
                            barMaxWidth:50, 
                            xAxisIndex: 1, 
                            yAxisIndex: 1,
                            seriesLayoutBy: 'row',
                            itemStyle: {    //设置每个数据节点对应颜色
                                normal: {
                                    color: function (params,index) {
                                        if(params.seriesName == '其他'){
                                            return "#418FEE";
                                        }else{
                                            var colorList = ["#A51E34", "#F2637B", "#B10DB9", "#29CCCC", "#FAD337", "#EC63F2","#FA9737","#2981CC","#95F05D","#21A4BF","#5DA0F0","#FFD736","#975FE4","#C9690C","#CC330","#FF6699","#CC99FF","#66FFCC","#CCCC00","#CC6699","#996600","#336699","#336600","#00CCFF","#CCCCFF","#FFFF00","#9900FF","#CC9900"];
                                            return colorList[params.seriesIndex-1]
                                        }
                                    }
                                }
                            }
                        })
                    }
                    // 使用刚指定的配置项和数据显示图表。
                    this.spc.clear();//此方法作用是在重新渲染画布时,清空上一次绘制的画布,避免画布错乱!
                    this.spc.setOption(this.spcOption);
                    window.addEventListener('resize', () => {
                        this.spc.resize();  // 多个图表，第一个图表
                    });
                }
            },
        }
</script>

<style lang="" scoped>
.iqis-chart{
    width: 100%;
    border: 1px solid #333;
    padding: 10px;
    box-sizing: border-box;
}
.iqis-chartNameText{
    width: 100%;
    height:60px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}
.item{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
.item-text{
    font-size: 24px;
    line-height: 60px;
    font-weight: bold;
    text-align: center;
}
.info_all{
    width: 100%;
    height: 80px;
    display: grid;
    border: 1px solid #333;
    grid-template-rows: 40px 40px;
    margin-top: 10px;
}
.info_all .item{
    width: 100%;
    height: 100%;
    /* border: 1px solid #333; */
    display: grid;
    grid-template-columns: repeat(6,1fr);
    line-height: 40px;
    padding: 0 10px;

}
.chart-table{
    width: 100%;
}
.chart-table .charts{
    width: 100%;
    height: 450px;
}
.tail-info{
    width: 100%;
    height: 50px;
    display: grid;
    grid-template-columns: repeat(3,1fr);
}
.tail-info .item{
    width: 100%;
    height: 100%;
    line-height: 50px;
}
.statistic-spc-page .iqis-table-no-data{
    text-align: center;
    color: #333;
    font-size: 16px;
}
</style>