<template>
  <div class="iqis-page">
    <div class="iqis-page-tool-row" style="display:none">
    </div>
    <div class="iqis-page-context statistic-spc-page">
      <div id="search-bar" class="search-bar">
        <div class="form-inline" role="form">
            <div class="ivu-line">
              <span>{{$t('statistical.spcType')}}:</span>
              <RadioGroup size='small' v-model="chartType" type="button">
                  <Radio label="IMR">{{$t('statistical.I-MR')}}</Radio>
                  <Radio label="XR">{{$t('statistical.Xbar-R')}}</Radio>
                  <Radio label="XS">{{$t('statistical.Xbar-S')}}</Radio>
                  <!-- <Radio disabled label="P">不良品率图(P图)</Radio>
                  <Radio disabled label="nP">不良品数图(nP图)</Radio>
                  <Radio disabled label="U">单位缺陷数图(U图)</Radio>
                  <Radio disabled label="C">缺陷数图(C图)</Radio> -->
              </RadioGroup>
            </div>
            <div class="ivu-line" style='margin-top:10px;'>
              <span>{{$t('statistical.statisticalBusiness')}}:</span>
              <RadioGroup size='small' v-model="statisticalData" type="button">
                  <Radio label="iqc">{{$t('statistical.iqc')}}</Radio>
                  <!-- <Radio label="iqcSPC">来料SPC数据记录</Radio> -->
                  <Radio label="pqc">{{$t('statistical.pqc')}}</Radio>
                  <Radio label="pqcSPC">{{$t('statistical.pqcCPK')}}</Radio>
                  <Radio label="oqc">{{$t('statistical.oqc')}}</Radio>
                  <!-- <Radio label="oqcSPC">出货SPC数据记录</Radio> -->
              </RadioGroup>
            </div>
            <div class="exam-option-group-iqc ivu-line" style="margin-top:10px;">
                <label>{{$t('statistical.filtrationCondition')}}:</label>
                <span class="exam-report-params">
                    <label style="width: auto;padding: 0 3px;">{{$t('statistical.productNo')}}</label>
                    <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.productId" style="width:140px" filterable>
                        <Option v-for="item in selectorsData.productList" :value="item.productId" :key="item.productId">{{ item.no }}</Option>
                    </Select>

                    <!-- <label style="width: auto;padding: 0 3px;">产品名称</label>
                    <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.productId" style="width:140px">
                        <Option v-for="item in selectorsData.productList" :value="item.productId" :key="item.productId">{{ item.name }}</Option>
                    </Select> -->

                    <label style="width: auto;padding: 0 3px;">{{$t('statistical.productSpec')}}</label>
                    <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.productId" style="width:140px" filterable>
                        <Option v-for="item in selectorsData.productList" :value="item.productId" :key="item.productId">{{ item.spec }}</Option>
                    </Select>
                    <label style="width: auto;padding: 0 3px;">{{$t('statistical.project')}}</label>
                    <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.inspectionTypeId" style="width:140px" filterable>
                        <Option v-for="item in selectorsData.inspectionTypeList" :value="item.inspectionTypeId" :key="item.inspectionTypeId">{{ item.inspectionTypeName }}</Option>
                    </Select>
                    <!-- <div class="conditionItem"> -->
                        <label style="width: auto;padding: 0 3px;" v-if="buzType == 'pqc'">{{$t('statistical.productProcess')}}</label>
                        <Select :placeholder="i18n.t('Unlimited')" v-model="statisticFilterParams.prodStageId" style="width:140px" v-if="buzType == 'pqc'" filterable>
                        <Option v-for="item in selectorsData.prodProcessList" :value="item.prodProcessId" :key="item.prodProcessId">{{ item.prodProcessName }}</Option>
                        </Select>
                    <!-- </div> -->
                </span>
            </div>
            <div class="exam-option-group-iqc ivu-line" style="margin-top:10px;">
                <label>{{$t('statistical.analysisCondition')}}:</label>
                <span class="exam-report-params">
                    <label style="width: auto;padding: 0 3px;">{{$t('statistical.perSampleNum')}}</label>
                    <Input style="width:80px" :disabled="sampleNumDis" v-model="statisticFilterParams.sampleNum"></Input>
                    <label style="width: auto;padding: 0 3px;">{{$t('statistical.sampleSize')}}</label>
                    <Input style="width:80px" v-model="statisticFilterParams.sampleGroup"/>
                    <label style="width: auto;padding: 0 3px;">{{$t('statistical.analysisType')}}</label>
                    <Select disabled :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.analysisType" style="width:140px">
                        <Option :value="1">{{$t('statistical.analysisUse')}}</Option>
                        <Option :value="0">{{$t('statistical.controlUse')}}</Option>
                    </Select>
                    <label v-if="statisticFilterParams.analysisType==0" style="width: auto;padding: 0 3px;">{{$t('statistical.controlLimits')}}</label>
                    <Select v-if="statisticFilterParams.analysisType==0" :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.controlLimit" style="width:140px">
                        <!-- <Option v-for="item in selectorsData.inspectionTypeList" :value="item.inspectionTypeId" :key="item.inspectionTypeId">{{ item.inspectionTypeName }}</Option> -->
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
            <Button style='float:right;' v-show="isChartShow == true" type="primary" icon="android-open" @click="onExportReport('exam-report')">{{$t('statistical.exportReport')}}</Button>
            </div>
            <div style='width:100%; border-bottom: 1px dashed #E9E9E9; margin:15px 0;'></div>
            <!-- <Button type="info" icon="arrow-down-a" @click="onExportReport">导出</Button> -->
        </div>
      </div>
      
      <div id="report-tab" class="tab-content exam-report-main">
          <div id="report-tip" class="iqis-report-tab" v-show="isChartShow == false">
              <div class="iqis-table-no-data" style="height: 100px;line-height: 100px;">{{$t('statistical.pleaseChoose')}}</div>
          </div>
          <div id="exam-report" class="exam-report-border" v-if="isChartShow">
              <!-- <iframe src="static/spc/chart.html" style="width:100%;" name="spcChart" id="spcChart" scrolling="no" frameborder="0" ></iframe> -->
                <Chart :parent="chartData" :newDate="newDate"></Chart>
          </div>
      </div>
    </div> <!-- end iqis-page-content -->
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
  </div>
</template>
<script>
  import $ from 'jquery';
  import echarts from 'echarts';
  import reportConfig from './statisticConfig';
  import Chart from './chart.vue'  

  export default {
    components: {Chart},  
    computed:{
        chartData:function(data){
            data={
                data:this.data,
                groupSize:this.groupSize,
                targetValue:this.targetValue,
                usl:this.usl,
                lsl:this.lsl,
                chartType:this.chartType,
                rules:this.rules,
                isConvert:this.isConvert,
            }
            return data
        }
    },
    data(){
      let vm = this;
      return {
        newDate:new Date(),
        i18n:window.i18n,
        isShowDisabled:false,
          rules:[],
          isConvert:0,
        reportTitleTxt:'', //报表title
        reportDateTxt:'', //报表日期
        reportDateRangeTxt:'',//报表时间范围
        isShowDataSelectModal:false,
        chartType:'IMR',
        statisticalData:'iqc',
        groupSize:1,
        data:[0.48,0.49,0.49,0.49,0.50,0.52,0.51,0.51,0.51,0.51,0.50,0.51,0.51,0.50,0.50,0.49,0.49,0.49,0.50,0.50,0.49,0.51,0.50,0.50,0.52,0.51,0.51,0.51,0.51,0.49],
        targetValue: 0.5, // 目标值
        usl: 0.55, //上限
        lsl: 0.45, //下限
        buzType:'pqc',
        statisticIndicator:'acceptance_rate',
        statisticMethod:'byProduct',
        statisticDays:{
          daysRange:'30',
          custom:[], //Date
          startTimestamp:0, // timestamp
          endTimestamp:0
        },
        statisticFilterParams:{
            // productTypeId:null,
            prodStageId:null,
            productId:null,
            inspectionTypeId:null,
            sampleNum:1,
            sampleGroup:null,
            analysisType:1,
            controlLimit:null,
        },
        daysRangeDis:false,
        sampleNumDis:true,
        reportConfig: reportConfig,
        buzNameMap: reportConfig.buzNameMap,
        buzParams:  reportConfig.buzParams,
        dataSelectorColumns: [
            {
                type: 'selection',
                width: 40,
                maxWidth: 40,
                minWidth: 40,
                align: 'center'
            },
            {
                key:"_iqis_rowIndex",
                title:i18n.t('statistical.serialNumber'),
                sortable:true
            }
        ],
        dataSelectorDatas: [],
        //modal table data end
        histogramChart:null,
        isChartShow:false,
        collectList:[],
        selectRows:[],
        selectorsData: {
            productList:[],
            productTypeList:[],
            manufacturerList:[],
            inspectionTypeList:[]
        }
      }//end return

    },//end  data
    methods:{
        initChart(){
            this.histogramChart = echarts.init(this.$refs.histogramChart);
        },
        onCustomDateChange(d){
          this.statisticDays.custom[0] = this.$iqis.utils.date.toDate(d[0]);
          this.statisticDays.custom[1] = this.$iqis.utils.date.toDate(d[1]);
        },
        onResetFilterParams(){
          this.statisticFilterParams.productTypeId=null;
          this.statisticFilterParams.productId=null;
          this.statisticFilterParams.manufacturerId=null;
          this.statisticDays.daysRange = "30";
          this.statisticFilterParams.prodStageId = null;
          this.statisticFilterParams.sampleNum = 1;
          this.statisticFilterParams.sampleGroup = null;
          this.chartType="IMR"
          this.sampleNumDis=true
          this.daysRangeDis = false
        },
        onBuildReport(){
          if(this.statisticFilterParams.productId == null){
            this.$Notice.warning({title: i18n.t('statistical.selectProd'), desc: ''});
            return;
          }
          if(this.statisticFilterParams.inspectionTypeId == null){
            this.$Notice.warning({title: i18n.t('statistical.selectProj'), desc: ''});
            return;
          }
          if(this.statisticFilterParams.sampleNum==null){
            this.$Notice.warning({title: i18n.t('statistical.inputSample'), desc: ''});    
            return;          
          }
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
          this.getReportData();
          this.isChartShow = true;

        },
        onExportReport(borderId){//border div的ID
            var image1 = new Image();
            var image2 = new Image();
            var image3 = new Image();
            var image4 = new Image();
            var image5 = new Image();
            var image6 = new Image();

            var firstControlChart = document.getElementById('firstControlChart');
            var secondControlChart = document.getElementById('secondControlChart');
            var x = document.getElementById('CPK').children[0].innerHTML
            var data = 'data:image/svg+xml;base64,'+ window.btoa(unescape(encodeURIComponent(x)));
            var sampleRunChart = document.getElementById('sampleRunChart');
            var avgRunChart = document.getElementById('avgRunChart');
            var passRateRunChart = document.getElementById('passRateRunChart');

            var chartTable = document.getElementById('chartTable').innerHTML;
            var chartNote = document.getElementById('chartNote').innerHTML
            var cpkNote = document.getElementById('cpkNote').innerHTML

            image1.src = firstControlChart.children[0].children[0].toDataURL("image/png");
            image2.src = secondControlChart.children[0].children[0].toDataURL("image/png");
            image3.src = data
            image4.src = sampleRunChart.children[0].children[0].toDataURL("image/png");
            image5.src = avgRunChart.children[0].children[0].toDataURL("image/png");
            image6.src = passRateRunChart.children[0].children[0].toDataURL("image/png");

            var content_html = "<div id='exam-report' class='exam-report-border export-chart-preview' style='background: #fff;width:100%;margin-top: 50px;'>\
            <div id='paretoChart'><div id='htmls'>"+
            "<div class='imgBox print-page' id='page-1'><img src='"+image1.src+"'><img src='"+image2.src+"'><div style='display:flex'><img style='flex:1' src='"+image3.src+"'><div class='cpkNote' style='flex:2;margin-left:30px;'>"+cpkNote+"</div></div></div><div class='imgBox print-page' id='page-2'><img src='"+image4.src+"'><img src='"+image5.src+"'><img src='"+image6.src+"'></div>"+
            "<div class='print-page' id='page-3'><div class='Chart_note' style='margin-top:-0px;text-align:center;height:30px;color:#999;font-family:MicrosoftYaHei;font-size: 14px;'>"+chartNote+"</div><div id='chartNote'>"+chartTable+"</div></div></div></div></div>";
            var pageHead = '';
            var w =this.$iqis.utils.printHtml(content_html,pageHead,["static/css/export-chart-preview.css","static/spc/lib/h-ui/css/H-ui.css","static/spc/css/DataAnlysisStyle.css"]);
            w.iqis_param_chartId = 'paretoChart';
            w.iqis_param_footer = ".exam-report-footer";
            w.iqis_param_table = ".exam-report-datas-table";
            var script=document.createElement("script");
            script.type="text/javascript";
            script.src="static/js/printHelper2.js";
            w.document.getElementsByTagName('head')[0].appendChild(script);
        },
        getReportData() {
            let reportType = this.buzType;
            let busType = this.statisticIndicator;
            let byType = this.statisticMethod;

            let hourOffset = this.$iqis.utils.__hour_offset
            let time_start = this.statisticDays.startTimestamp;
            let time_end = this.statisticDays.endTimestamp;
            if(this.statisticFilterParams.sampleGroup){
                time_start = ''
                time_end = ''
            }
            let groupType = time_end-time_start > 86400000 ? 0:1;

            let business = this.statisticIndicator;
            console.log(this.statisticFilterParams.sampleGroup,'this.statisticFilterParams.sampleGroup')
            let params = {hourOffset:hourOffset,start:time_start,end:time_end,chartType:this.chartType,statisticalData:this.statisticalData,sampleNum:this.statisticFilterParams.sampleNum,sampleGroup:this.statisticFilterParams.sampleGroup,analysisType:this.statisticFilterParams.analysisType};
            // console.log(this.statisticFilterParams,98877);
            
            $.each(this.statisticFilterParams,function(key,value){
              params[key] = value ? value : null;
            })
            
            let that = this;
            console.log(params,'params')
            this.isShowDisabled = true
            this.$http.get("/diagram/report/"+reportType+"/spc",{params}).then(function(resp){
                that.isShowDisabled = false
                if(!resp || !resp.data || !resp.data.data){
                    that.$Notice.warning({title: i18n.t('statistical.noData')});
                    return;
                }
                if(resp.data.tip){
                    that.$Notice.warning({title: resp.data.tip});
                }

                //============================ 注意 ====================================
                
                // /rule/{ruleId} 此{ruleId}是图形判定规则模块中列表的一条数据的ruleId
                that.$http.get("/rule-DIAGRAM_DECIDE",{page:1,limit:999999999}).then(function(res){
                    var ruleId = ''
                    if(res.data.length == 0) {
                        that.$Notice.warning({title: i18n.t('statistical.pleaseAddData')});
                        return false;
                    }else{
                        ruleId = res.data[0].ruleId
                    }
                     that.$http.get("/rule/"+ruleId).then(function(resp){
                        // console.log(resp.data.items,666666666666666);12121212121212
                        that.items = []
                        // that.rules   rules:[{id:1},{id:2,seriesCount:5},{id:5,seriesCount:9,insideCount:5}],
                        let items = resp.data.items;
                        if(items.DIAGRAM_OUT_TRIPLE_2){
                            //这是双图
                        }else{
                            //这是单图
                            that.rules = []
                            let obj = Object();
                            
                            if(items.DIAGRAM_CONTINUOUS_SAME_SIDE.ruleEnabled){
                                
                                obj.id = 2;
                                obj.seriesCount = items.DIAGRAM_CONTINUOUS_SAME_SIDE.ruleItemV1
                                that.rules.push(obj)
                            };
                            if(items.DIAGRAM_CONTINUOUS_UP_OR_DOWN.ruleEnabled){
                                // let obj = Object();
                                obj.id = 3;
                                obj.seriesCount = items.DIAGRAM_CONTINUOUS_UP_OR_DOWN.ruleItemV1
                                that.rules.push(obj)
                            };
                            if(items.DIAGRAM_ALTERNATE_UP_AND_DOWN.ruleEnabled){
                                // let obj = Object();
                                obj.id = 4;
                                obj.seriesCount = items.DIAGRAM_ALTERNATE_UP_AND_DOWN.ruleItemV1
                                that.rules.push(obj)
                            };
                            if(items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleEnabled){
                                // let obj = Object();
                                obj.id = 5;
                                obj.seriesCount = items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleItemV1
                                obj.insideCount = items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleItemV2
                                that.rules.push(obj)
                            };
                            if(items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleEnabled){
                                // let obj = Object();
                                obj.id = 6;
                                obj.seriesCount = items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleItemV1
                                obj.insideCount = items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleItemV2
                                that.rules.push(obj)
                            };
                            if(items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE.ruleEnabled){
                                // let obj = Object();
                                obj.id = 7;
                                obj.seriesCount = items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE.ruleItemV1
                                that.rules.push(obj)
                            };
                            if(items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE.ruleEnabled){
                                // let obj = Object();
                                obj.id = 8;
                                obj.seriesCount = items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE.ruleItemV1
                                that.rules.push(obj)
                        };
                    }
                })
                })
               
                that.data = resp.data.data;
                that.usl = resp.data.usl;
                that.lsl = resp.data.lsl;
                that.targetValue = resp.data.targetValue;
                that.groupSize = resp.data.groupSize;
                that.isConvert = resp.data.isConvert;
                if(that.isChartShow){
                    that.reloadChart();
                }
                that.isChartShow = true;
                that.newDate = new Date()
            }).catch(function(err){
              this.isShowDisabled = false
            });
            this.isShowDisabled = false
        },
        reloadChart(){
            if(this.chartType == 'IMR'){
                this.groupSize = 1
                // this.data = [0.48,0.49,0.49,0.49,0.50,0.52,0.51,0.51,0.51,0.51,0.50,0.51,0.51,0.50,0.50,0.49,0.49,0.49,0.50,0.50,0.49,0.51,0.50,0.50,0.52,0.51,0.51,0.51,0.51,0.49];
                // this.targetValue = 0.5;  // 目标值
                // this.usl = 0.55; //上限
                // this.lsl = 0.45; //下限
            }else{
                // this.groupSize = 5;
                // this.data = [0.952, 0.936, 0.903, 0.93, 0.879, 0.937, 0.882, 0.913, 0.925, 0.94, 0.906, 0.919, 0.878, 0.891,0.894,0.88, 0.907, 0.898, 0.936, 0.907, 0.901, 0.893, 0.95, 0.929, 0.868, 0.921, 0.925, 0.945, 0.931,0.935, 0.906,0.907, 0.901, 0.921, 0.922, 0.911, 0.912, 0.911, 0.915, 0.913];
                // this.targetValue = 0.9; // 目标值
                // this.usl = 1.0; //上限
                // this.lsl = 0.8; //下限
            }
            // window.frames["spcChart"].window.location.reload()
        }
    },
    created(){
        let that = this;
        this.$http.get("/basic/prod-process", {params: {page: 1, limit: 99999999,toSupplierCustomerId:this.toSupplierCustomerId||''}}).then(function (resp) {
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.prodProcessList = resp.data;
          that.selectorsData.prodProcessList.unshift({prodProcessName:i18n.t("Unlimited"),prodProcessId:null})
        }
      });
    },
    mounted(){
        const that = this;
        let initialHeight = $('.iqis-main-tabs').height() - 32;
        $('#spcChart').height(initialHeight);

        var resizeTimer = null;
        // $(window).bind('resize', function (){
        //     if (resizeTimer) clearTimeout(resizeTimer);
        //     resizeTimer = setTimeout(function(){
        //         let targetHeight = $('.iqis-main-tabs').height() - 32;
        //         //console.log('targetHeight',targetHeight)
        //         if(targetHeight == 0) return;
        //         $('#spcChart').height(targetHeight)
        //     } , 200);
        // });
        
        this.$http.get("/basic/product",{params: {examType:1, useState:1, page:1,limit:99999999,customerId:this.$store.state.customerId}}).then(function(resp){
            if(resp && resp.data && resp.data.length > 0){
                that.selectorsData.productList = resp.data;
                // console.log(resp.data,8888888);
                // console.log(window,9);
                
                
            }
        });
        window.resizeSpcFrame = function(height){
            if(height == 0) return;
            $('#spcChart').height(height)
        }
        window.noData = function(){
            that.$Notice.warning({title:i18n.t('statistical.dataLoss')})
        }
        window.vm = this;
    },
    watch: {
        statisticalData(data){
            let that = this;
            let examType
            if(data=='iqc'){
                examType=1
            }else if(data=='pqc'||data=='pqcSPC'){
                examType=2
            }else if(data=='oqc'){
                examType=4
            }
            this.$http.get("/basic/product",{params: {examType:examType, useState:1, page:1,limit:99999999,customerId:this.$store.state.customerId}}).then(function(resp){
                if(resp && resp.data && resp.data.length > 0){
                    that.selectorsData.productList = resp.data;
                }
            });
        },
        chartType(type){
            this.statisticFilterParams.productId = null;
            this.statisticFilterParams.inspectionTypeId = null;
            this.statisticFilterParams.prodProcessId = null;
            if(type=='IMR'){
                this.statisticFilterParams.sampleNum=1
                this.sampleNumDis=true;
            }else{
                this.statisticFilterParams.sampleNum=null
                this.sampleNumDis=false;
            }
        },
        buzType (val) {
            let indicators = this.buzParams[this.buzType];
            if(indicators[this.statisticIndicator] === undefined){
                this.statisticIndicator = Object.keys(indicators)[0];
            }
            let methods = indicators[this.statisticIndicator];
            if(methods[this.statisticMethod] === undefined){
                this.statisticMethod = Object.keys(methods)[0];
            }
        },
        statisticIndicator (val) {
            let indicators = this.buzParams[this.buzType];
            let methods = indicators[val];
            if(methods[this.statisticMethod] === undefined){
                this.statisticMethod = Object.keys(methods)[0];
            }
        },
        "statisticDays.daysRange": function (argument) {
          this.statisticDays.custom[0] = null;
          this.statisticDays.custom[1] = null;
        },
        "statisticFilterParams.productId":function () {
            if(this.statisticFilterParams.productId == null){
                this.selectorsData.inspectionTypeList = [];
                return;
            }
            this.statisticFilterParams.inspectionTypeId = null;
            this.selectorsData.inspectionTypeList = []
            let url = "/basic/product/detail/" + this.statisticFilterParams.productId;
            let that = this;
            this.$http.get(url).then(function(resp){
                if(resp && resp.data){
                    let type = that.statisticalData
                    if(that.statisticalData == 'pqcSPC'){
                        type = 'pqc'
                    }
                    let arr1 = resp.data.settings.qc[type].params;
                    
                    let arr2 = [];
                    for (let i = 0; i < arr1.length; i++) {
                        let exist = false;
                        for (let j = 0; j < arr2.length; j++) {
                            if(arr2[j].inspectionTypeId == arr1[i].inspectionTypeId){
                                exist = true;
                            }
                        }
                        if(!exist) arr2.push(arr1[i]);
                    }
                    that.selectorsData.inspectionTypeList.push(...arr2)
                }
            });
        },
        "statisticFilterParams.sampleGroup":function(num){
            if(num){
                this.statisticDays.daysRange = null
                this.daysRangeDis=true
            }else{
                this.daysRangeDis=false
            }
        }
    },
    beforeDestroy(){

    }

  }
</script>

<style>
  .report-export-bth{
    padding: 0px 20px;
    margin-left: 8px;
  }
  .statistic-spc-page {
    /*margin-bottom: 10px;*/
    /*padding-bottom: 48px*/
  }
  .statistic-spc-page .ivu-line {
    padding-bottom: 3px;
  }
  .statistic-spc-page .exam-report-main{
      margin-top: 10px;
      /* margin-right: 10px; */
      background-color: #fff;
      color: #333;
  }
  .statistic-spc-page .iqis-table-no-data{
      text-align: center;
      color: #333;
      font-size: 16px;
  }
  .statistic-spc-page .exam-report-title-table,
  .statistic-spc-page .exam-report-total-table,
  .statistic-spc-page .exam-report-datas-table,
  .statistic-spc-page .exam-report-footer{
      width: 100%;
      border: 0;
      border-collapse:collapse;
  }
  .statistic-spc-page .exam-report-border{
      /*border: 1px solid #666;*/
      margin-bottom: 0;
  }
  .statistic-spc-page .exam-report-total-border{
    border: 1px solid #666;
    margin-left: 18px;
    margin-right: 18px;
    padding: 6px 10px;
  }
  .statistic-spc-page .exam-total-item{
    margin-right: 30px;
  }
  .statistic-spc-page .total-label{
      padding-right: 8px;
  }
  .statistic-spc-page .exam-report-title-table .exam-report-date-cell{
    text-align: center;
  }
  .statistic-spc-page .exam-report-title-table td{
    border: 0;
    vertical-align: bottom;
    line-height: 30px;
    border-collapse: collapse;
  }
  .statistic-spc-page .exam-report-title-table .exam-report-title-cell{
    font-size: 32px;
    line-height: 40px;
    text-align: center;
  }
  .statistic-spc-page .exam-report-datas-div {
    width: 100%;
    padding: 0 12px;
    margin-top: 10px;
  }
  .statistic-spc-page .exam-report-datas-table {
    border: 1px;
    border-color: #333;
  }
  .statistic-spc-page .exam-report-datas-table th,
  .statistic-spc-page .exam-report-datas-table td{
    border: 1px solid #333;
    padding: 3px;
    text-align: center;
  }
  .statistic-spc-page .exam-report-datas-table th{
    background-color: #efefef;
  }

  .statistic-spc-page .exam-report-datas-table td.table-gap,
  .statistic-spc-page .exam-report-datas-table th.table-gap{
      border-top: 0;
      border-bottom: 0;
      width: 10px;
      background-color: #fff;
  }

  .statistic-spc-page .exam-report-footer{
    margin: 10px 12px;
  }

</style>
<style>
/* 2018/7/4 */
  .ivu-radio-group-button .ivu-radio-wrapper,
  .ivu-radio-group-button .ivu-radio-wrapper:first-child {
    border: 0;
    font-size: 14px !important;
    box-shadow: none;
  }

  .ivu-radio-group-button .ivu-radio-wrapper-checked,
  .ivu-radio-group-button .ivu-radio-wrapper-checked.ivu-radio-focus,
  .ivu-radio-group-button .ivu-radio-wrapper-checked.ivu-radio-focus:first-child {
    box-shadow: none !important;
  }

  .ivu-radio-group-button .ivu-radio-wrapper:after,
  .ivu-radio-group-button .ivu-radio-wrapper:before,
  .ivu-radio-group-button .ivu-radio-wrapper-checked:before {
    background: transparent !important;
  }

  .ivu-radio-group-button .ivu-radio-wrapper {
    height: 24px !important;
    line-height: 22px !important;
    padding: 0 12px 0 8px !important;
    border: 1px solid transparent !important;
    margin-right: 10px;
  }

  .ivu-radio-group-button .ivu-radio-wrapper-checked {
    border-radius: 2px !important;
    border: 1px solid rgba(65, 143, 238, 1) !important;
  }
  .statistic-histogram-page2 .ivu-line{
    padding-bottom:0;
  }
  .ivu-radio-group-button .ivu-radio-wrapper-disabled,.ivu-radio-group-button .ivu-radio-wrapper-disabled:first-child, .ivu-radio-group-button .ivu-radio-wrapper-disabled:hover{
      background:#fff;
  }
</style>
