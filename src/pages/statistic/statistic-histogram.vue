<template>
  <div class="iqis-page">
    <div class="iqis-page-tool-row" style="display:none">
      <div class="iqis-page-tool-primary">

      </div>
      <div class="iqis-page-tool-second">

      </div>
    </div>
    <div class="iqis-page-context statistic-histogram-page2">
      <div id="search-bar" class="search-bar">
        <div class="form-inline" role="form">
          <div class="ivu-line">
            <span>{{$t('statistical.statisticalBusiness')}}:</span>
            <RadioGroup v-model="buzType" type="button">
              <Radio v-for="(value, key, index) in buzParams" :key="key" :label="key">{{buzNameMap[key]}}</Radio>
            </RadioGroup>
          </div>
          <!-- 统计参数 -->
          <div class="ivu-line" style='margin-top:10px;'>
            <label>{{$t('statistical.businessType')}}:</label>
            <RadioGroup v-model="statisticIndicator" type="button">
              <Radio v-for="(value, key, index) in buzParams[buzType]" :key="key" :label="key">{{buzNameMap[key]}}
              </Radio>
            </RadioGroup>
          </div>
          <div class="exam-option-group-ycjs ivu-line" style='margin-top:10px;'>
            <label>{{$t('statistical.statisticalMethod')}}:</label>
            <RadioGroup v-model="statisticMethod" type="button">
              <Radio v-for="(value, key, index) in buzParams[buzType][statisticIndicator]" :key="key" :label="key">
                {{buzNameMap[key]}}
              </Radio>
            </RadioGroup>
          </div>
          <div class="exam-option-group-iqc ivu-line" >
            <label>{{$t('statistical.filtrationCondition')}}:</label>
            <span class="exam-report-params">
              <div class="conditionItem"><label style="width: auto;padding: 0 3px;">{{$t('statistical.productType')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.productTypeId" style="width:140px" filterable>
                <Option v-for="item in selectorsData.productTypeList" :value="item.prodTypeId"
                        :key="item.prodTypeId">{{ item.name }}</Option>
              </Select></div>
              <div class="conditionItem"><label style="width: auto;padding: 0 3px;">{{$t('statistical.productNo')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.productId" style="width:140px" filterable>
                <Option v-for="item in selectorsData.productList" :value="item.productId" :label="item.no" :key="item.productId">{{item.no+" / "+item.name}}</Option>
              </Select></div>
              <div class="conditionItem"><label style="width: auto;padding: 0 3px;">{{$t('statistical.productSpec')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.productId" style="width:140px" filterable>
                <Option v-for="(list,index) in selectorsData.productList" :value="list.productId" :label="list.spec" :key="index">{{list.spec}}</Option>
              </Select></div>
              <div class="conditionItem"><label style="width: auto;padding: 0 3px;" v-if="buzType == 'iqc'">{{$t('statistical.supplierName')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.manufacturerId" style="width:140px" v-if="buzType == 'iqc'" filterable>
                <Option v-for="item in selectorsData.manufacturerList" :value="item.manufacturerId"
                        :key="item.manufacturerId">{{ item.manufacturerAbbreviation }}</Option>
              </Select></div>
              <div class="conditionItem"><label style="width: auto;padding: 0 3px;" v-if="(buzType == 'oqc'||buzType == 'cc')&&!toSupplierCustomerId">{{$t('statistical.customerName')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.customerId" style="width:140px" v-if="(buzType == 'oqc'||buzType == 'cc')&&!toSupplierCustomerId" filterable>
                <Option v-for="item in selectorsData.customerList" :value="item.customerId"
                        :key="item.customerId">{{ item.customerAbbreviation }}</Option>
              </Select></div>
              <div class="conditionItem"><label style="width: auto;padding: 0 3px;" v-if="buzType == 'pqc'">{{$t('statistical.productLine')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.prodLineId" style="width:140px" v-if="buzType == 'pqc'" filterable>
                <Option v-for="item in selectorsData.prodLineList" :value="item.prodLineId"
                        :key="item.prodLineId">{{ item.name }}</Option>
              </Select></div>
              <div class="conditionItem"><label style="width: auto;padding: 0 3px;" v-if="buzType == 'pqc'">{{$t('statistical.productProcess')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.prodProcessId" style="width:140px" v-if="buzType == 'pqc'" filterable>
                <Option v-for="item in selectorsData.prodProcessList" :value="item.prodProcessId"
                        :key="item.prodProcessId">{{ item.prodProcessName }}</Option>
              </Select></div>
            </span>
            <!-- <Button type="ghost" icon="refresh" @click="onResetFilterParams">重置条件</Button> -->
          </div>

          <div id="exam-report-date-pick" class="ivu-line" style='margin-top:10px;'>
            <label>{{$t('statistical.reportTime')}}:</label>
            <RadioGroup v-model="statisticDays.daysRange" type="button">
              <Radio label="0">{{$t('statistical.today')}}</Radio>
              <Radio label="7">{{$t('statistical.Nearly')}}7{{$t('statistical.days')}}</Radio>
              <Radio label="30">{{$t('statistical.Nearly')}}30{{$t('statistical.days')}}</Radio>
              <Radio label="-1">{{$t('statistical.custom')}}</Radio>
            </RadioGroup>
            <DatePicker v-if="statisticDays.daysRange == '-1'" type="daterange" split-panels :placeholder="i18n.t('statistical.dateInterval')"
                        :start-date="new Date(2018, 2, 1)" style="width: 210px"
                        @on-change="onCustomDateChange"></DatePicker>
            <Button type="primary" icon="ios-search" @click="onBuildReport">{{$t('statistical.viewReport')}}</Button>
            <Button type="ghost" @click="onResetFilterParams">{{$t('statistical.reset')}}</Button>
            <Button style='float:right;' v-show="isChartShow == true" type="primary" icon="android-open" @click="onExportReport('exam-reportzzt')">{{$t('statistical.exportReport')}}</Button> 
            <!-- <Button type="primary" size='small' icon="md-open" @click="onExportReport('exam-report')">导出报表</Button> -->
            <!-- <Button style='float:right;' type="primary" size='small' icon="android-open" @click="onExportReport('exam-report')">导出报表</Button> -->
          </div>
          <div style='width:100%; border-bottom: 1px dashed #E9E9E9; margin:15px 0;'></div>
          
          <!-- <Button type="info" icon="arrow-down-a" @click="onExportReport">导出</Button> -->
        </div>
      </div>
      <div id="report-tab" class="tab-content exam-report-main">
        <div id="report-tip" class="iqis-report-tab" v-show="isChartShow == false">
          <div class="iqis-table-no-data" style="height: 100px;line-height: 100px;">{{$t('statistical.pleaseChoose')}}</div>
        </div>
        <div id="exam-reportzzt" class="exam-report-border" v-show="isChartShow">
          <!-- report title -->
          <table class="exam-report-title-table">
            <tr>
              <td width="25%">
                <!-- <button type="button" style='width:80px; margin-left:8px;' class="btn btn-default report-export-btn"
                        @click="onExportReport('exam-report')"><span class="glyphicon glyphicon-export">导出</span>
                </button> -->
                <!-- <Icon type="md-open" /> -->
                
              </td>
              <td width="50%" class="exam-report-title-cell"><span style='font-size:32px;'
                                                                   class="exam-report-title-txt">【{{reportTitleTxt}}】</span>
              </td>
              <td width="25%">{{$t('statistical.tabulationDate')}}:<span class="report-title-date-txt">{{reportDateTxt}}</span></td>
            </tr>
            <tr>
              <td width="25%"></td>
              <td width="50%" class="exam-report-date-cell">{{$t('statistical.dateInterval')}}:<span class="report-title-date-range-txt">{{reportDateRangeTxt}}</span>
              </td>
              <td width="25%">{{$t('statistical.pages')}}:<span class="report-title-pager-txt">1 / 1</span></td>
            </tr>
          </table>
          <!-- report title end -->
          <!-- report total info -->
          <div class="exam-report-total-border">
            <template v-for="item in collectList">
              <span class="exam-total-item"><label class="total-label">{{ item.label }}:</label>{{ item.value }}</span>
            </template>
          </div>
          <!-- report total info end -->
          <!-- histogramChart  -->
          <div ref="histogramChartAV" id='histogramChartzzt' class="exam-report-chart-div"
               style="height: 400px; width: 100%">

          </div>
          <!-- histogramChart end -->

          <!-- <table class="exam-report-datas-table" style="display:table">
              <thead>
                  <tr><td v-for="item in reportConfig[statisticIndicator].columns"> {{item.label}} </td></tr>
                </thead>
              <tbody class="report-datas-body">
                <tr v-for="row in selectRows">
                    <td v-for="column in reportConfig[statisticIndicator].columns"> {{row[column.field]}} </td>
                </tr>
              </tbody>

          </table>

          <table class="exam-report-footer" v-if="true">
              <tr>
                  <td width="15%">{{$t('statistical.confirm')}}:</td>
                  <td width="15%">{{$t('statistical.reReview')}}:</td>
                  <td width="15%">制表:</td>
                  <td></td>
                  <td></td>
              </tr>
          </table> -->
          <div class="exam-report-datas-div">
            <table class="exam-report-datas-table">
              <thead>
              <tr class="report-data-thead">
                <th>{{$t('statistical.supplierName')}}</th>
                <th>{{$t('statistical.batchTotal')}}</th>
                <th>{{$t('statistical.inspectionTotal')}}</th>
                <th>{{$t('statistical.abnormalTotal')}}</th>
                <th class="table-gap"></th>
                <th>{{$t('statistical.supplierName')}}</th>
                <th>{{$t('statistical.batchTotal')}}</th>
                <th>{{$t('statistical.inspectionTotal')}}</th>
                <th>{{$t('statistical.abnormalTotal')}}</th>
              </tr>
              </thead>
              <tbody class="report-datas-body">
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td class="table-gap"></td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td class="table-gap"></td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
              </tr>
              </tbody>

            </table>

            <table class="exam-report-footer">
              <tr>
                <td width="200px">{{$t('statistical.confirm')}}:</td>
                <td width="200px">{{$t('statistical.reReview')}}:</td>
                <td width="200px">{{$t('statistical.Tabulation')}}:</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>

        </div>
      </div>
      <Modal
        v-model="isShowDataSelectModal"
        :title="buzNameMap[statisticIndicator]+i18n.t('statistical.dataSelect')"
        width="50">
        <Table ref="modalTable" size="small" style="overflow:auto;max-height: 400px;" border
               :columns="dataSelectorColumns" :data="dataSelectorDatas"></Table>
        <div slot="footer">
          <Button type="primary" size="large" @click="onDataSelectorOkButton();isShowDataSelectModal=false" ok-text>{{$t('statistical.confirm')}}</Button>
          <Button type="text" size="large" cancel-text @click="isShowDataSelectModal=false">{{$t('statistical.cancel')}}</Button>
        </div>
      </Modal>
    </div> <!-- end iqis-page-content -->

    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
  </div>
</template>

<script>
  import $ from 'jquery'
  import ReportDateSelector from '../../components/reportDateSelector/ReportDateSelector'
  import echarts from 'echarts'
  import ICol from "iview/src/components/grid/col";
  import reportConfig from './statisticConfig';
  import TableModal from './TableModal/';

  export default {
    data() {
      let vm = this;

      return {
        i18n:window.i18n,
        chartType: i18n.t('statistical.histogram'),
        reportTitleTxt: '', //报表title
        reportDateTxt: '', //报表日期
        reportDateRangeTxt: '',//报表时间范围
        isShowDataSelectModal: false,
        buzType: 'iqc',
        statisticIndicator: 'acceptance_rate',
        statisticMethod: 'byProduct',
        statisticDays: {
          daysRange: '30',
          custom: [], //Date
          startTimestamp: 0, // timestamp
          endTimestamp: 0
        },
        statisticFilterParams: {
          productTypeId: null,
          productId: null,
          manufacturerId: null,
          customerId: null,
          prodLineId:null,
          prodProcessId:null
        },
        reportConfig: reportConfig,
        buzNameMap: reportConfig.buzNameMap,
        buzParams: reportConfig.buzParams,
        dataSelectorColumns: [
          {
            type: 'selection',
            width: 40,
            maxWidth: 40,
            minWidth: 40,
            align: 'center'
          },
          {
            key: "_iqis_rowIndex",
            title: i18n.t('statistical.serialNumber'),
            sortable: true
          }
        ],
        dataSelectorDatas: [],
        //modal table data end
        histogramChart: null,
        isChartShow: false,
        collectList: [],
        selectRows: [],
        selectorsData: {
          productList: [],
          productTypeList: [],
          manufacturerList: [],
          customerList: [],
          prodLineList: [],
          prodProcessList: []
        },
        toSupplierCustomerId:''
      }//end return

    },//end  data
    created(){
      let toSupplierCustomerId=this.$store.state.customerId||''
      if(toSupplierCustomerId){
        this.toSupplierCustomerId=toSupplierCustomerId;
        delete this.buzParams.iqc;
        delete this.buzParams.cc;
        delete this.buzParams.pqc.first_pass_yield.byCustomer;
        delete this.buzParams.pqc.acceptance_rate.byCustomer;
        delete this.buzParams.pqc.return_rate.byCustomer;
        delete this.buzParams.pqc.bad_rate.byCustomer;
        delete this.buzParams.pqc.abnormal_count.byCustomer;

        delete this.buzParams.oqc.acceptance_rate.byCustomer;
        delete this.buzParams.oqc.return_rate.byCustomer;
        delete this.buzParams.oqc.bad_rate.byCustomer;
        delete this.buzParams.oqc.abnormal_count.byCustomer;
        this.buzType='pqc'
      }
    },
    methods: {
      initChart() {
        this.histogramChart = echarts.init(this.$refs.histogramChartAV);
      },
      onCustomDateChange(d) {
        this.statisticDays.custom[0] = this.$iqis.utils.date.toDate(d[0]);
        this.statisticDays.custom[1] = this.$iqis.utils.date.toDate(d[1]);
      },
      onResetFilterParams() {
        this.statisticFilterParams.productTypeId = null;
        this.statisticFilterParams.productId = null;
        this.statisticFilterParams.manufacturerId = null;
        this.statisticFilterParams.customerId = null;
        this.statisticFilterParams.prodLineId = null;
        this.statisticFilterParams.prodProcessId = null;

        this.statisticDays.daysRange = "30";
      },
      onBuildReport() {
        let time_end = this.$iqis.utils.getDayEnd2();
        let time_start = this.$iqis.utils.getDayStart(1);
        let daysRange = this.statisticDays.daysRange;
        if (daysRange == 7) {
          time_start = this.$iqis.utils.get7DayStart();
        } else if (daysRange == 30) {
          time_start = this.$iqis.utils.get30DayStart();
        } else if (daysRange == -1) {
          let startDate = this.statisticDays.custom[0];
          let endDate = this.statisticDays.custom[1];
          if (startDate && endDate) {
            time_end = endDate.getTime() + 86399999;
            time_start = startDate.getTime();
          } else {
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
      },


      // onExportReport(){
      //     if($("#exam-report").is(":visible")){
      //         var c_html = "<div id=\"exam-report\" class=\"exam-report-border\" style='background: #fff;width:1200px;'>"+$("#exam-report").html()+"</div>";

      //         var pageHead = "<div style='text-align: center;font-size: 11pt;font-weight: bold;'>"+$(".exam-report-title-txt").text()+"- "
      //             +$(".report-title-date-range-txt").text()+"&nbsp;<td width=\"25%\">制表日期:<span class=\"\">"+$(".report-title-date-txt").text()+"</span></td>&nbsp;&nbsp;页数:<span class='report-title-pager-txt'></span></div>";
      //         // var w =printHtml(c_html,pageHead,["static/css/iqis/page.css"
      //         //     ,"static/js/iqis/modules/exam/exam.css"
      //         //     ,"static/js/iqis/modules/exam/exam-report-print.css"]);
      //         window.pageData.exam_report_chart = echarts.init(document.getElementById("exam-report-chart"));
      //         var dataUrl = window.pageData.exam_report_chart.getDataURL({type:"png",pixelRatio:2,excludeComponents:["toolbox"]});

      //         w.iqis_param_imgId = "chartImage";
      //         w.iqis_param_imgDataUrl = dataUrl;

      //         // var script=document.createElement("script");
      //         // script.type="text/javascript";
      //         // script.src="static/js/iqis/modules/exam/printHelper.js";
      //         // w.document.getElementsByTagName('head')[0].appendChild(script);

      //     }
      // },
      onDataSelectorOkButton(e) {
        let selectRows = this.$refs.modalTable.getSelection();
        // if(selectRows.length == 0){
        //     // toast("没有数据");
        //     // $("#report-tip").show();
        //     return;
        // }
        // console.log(selectRows,1123456);
        
        this.fillReportText(selectRows);
        this.updateHistogramChart(selectRows);
      },
      onExportReport(borderId) {//border div的ID
        var reportBorder = $("#" + borderId);
        // 添加统一的外层
        var content_html = "<div id=\"exam-report\" class=\"exam-report-border export-chart-preview\" style='background: #fff;width:1200px;'>" + reportBorder.html() + "</div>";
        var pageHead = "<div style='text-align: center;font-size: 11pt;font-weight: bold;'>" + $(".exam-report-title-txt").text() + "- "
          + reportBorder.find(".report-title-date-range-txt").text() + "&nbsp;<td width=\"25%\">"+i18n.t('statistical.tabulationDate')+":<span class=\"\">"
          + reportBorder.find(".report-title-date-txt").text() + "</span></td>&nbsp;&nbsp;"+i18n.t('statistical.pages')+":<span class='report-title-pager-txt'></span></div>";
        var w = this.$iqis.utils.printHtml(content_html, pageHead, ["static/css/export-chart-preview.css"]);


        var chartId = reportBorder.find(".exam-report-chart-div").attr("id");

        var chart_ = echarts.getInstanceByDom(document.getElementById(chartId));

        var dataUrl = chart_.getDataURL({type: "png", pixelRatio: 2, excludeComponents: ["toolbox"]});

        w.iqis_param_imgId = "chartImage";
        w.iqis_param_imgDataUrl = dataUrl;
        w.iqis_param_chartId = chartId;

        w.iqis_param_footer = ".exam-report-footer";
        w.iqis_param_table = ".exam-report-datas-table";

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "static/js/printHelper.js";
        w.document.getElementsByTagName('head')[0].appendChild(script);
      },
      getReportData() {
        let reportType = this.buzType;
        let busType = this.statisticIndicator;
        let byType = this.statisticMethod;

        let hourOffset = this.$iqis.utils.__hour_offset
        let time_start = this.statisticDays.startTimestamp;
        let time_end = this.statisticDays.endTimestamp;
        let groupType = time_end - time_start > 86400000 ? 0 : 1;

        let business = this.statisticIndicator;
        let params = {"business": business, "by": byType, hourOffset: hourOffset, start: time_start, end: time_end,toSupplierCustomerId:this.toSupplierCustomerId||''};

        $.each(this.statisticFilterParams, function (key, value) {
          params[key] = value ? value : '';
        })

        let that = this;
        this.$http.get("/diagram/report/" + reportType + "/dispatcher", {params}).then(function (resp) {
          // console.log(resp, "数据");
          // if(!resp || !resp.data || !resp.data.list || resp.data.list.length ==0){
          //     // that.$Notice.warning({title: '暂无数据'});
          //     // return;
          // }
          var rconfig = reportConfig[business] || {};
          
          if(that.statisticMethod == 'byProduct'){
            var columnConfig = rconfig.columnss;
          }else{
            var columnConfig = rconfig.columns;
          }
          /* if (columnConfig) {
            
            columnConfig[0].label = "名称";
          } */
          //init modal table's data
          let columns = $.map(columnConfig, function (item, index) {
            return {title: item.label, key: item.field, sortable: true};
          });
          $.each(resp.data.list, function (index, item) {
            item['_checked'] = true;
            item["_iqis_rowIndex"] = index + 1;
          })
          that.showDataSelectModal(columns, resp.data.list);
        });
      },
      showDataSelectModal(columns, data) {
        
        let length = this.dataSelectorColumns.length;
        this.dataSelectorColumns.splice(2, length - 2);//保持前两个(固定的)
        let that = this;
        $.each(columns, function (index, item) {
          that.dataSelectorColumns.push(item);
        });
        if(data){
          for(var index = 0;index<data.length;index++){
            if(data[index].fpy == 100){
              data[index].fpy = Math.floor((100-data[index].bad/data[index].count) * 100) / 100;
            }
          }
        }
        this.dataSelectorDatas = data;
        
        this.isShowDataSelectModal = true;
      },
      fillReportText(selectRows) {
        let that = this;
        // let selectRows = this.$refs.modalTable.getSelection();
        var rconfig = reportConfig[this.statisticIndicator] || {};
        // var columnConfig = rconfig.columns;
        if(that.statisticMethod == 'byProduct'){
            var columnConfig = rconfig.columnss;
          }else{
            var columnConfig = rconfig.columns;
          }

        /* if (columnConfig) {
          columnConfig[0].label = "名称";
        } */
        let reportType = this.buzType;
        var reportTitle = this.buzNameMap[reportType] + rconfig.reportTitle + this.chartType;
        if(reportTitle=='客诉客诉数量直方图'){
          reportTitle=='客诉数量直方图'
        }
        if(this.$store.state.locale=='en_US'){
          reportTitle =this.buzNameMap[reportType]+ ' ' + rconfig.reportTitle+' ' +this.chartType 
          if(reportTitle=='Customer Complaint Customer Complaint Quantity Histogram'){
            reportTitle='Customer Complaint Quantity Histogram'
          }
        }

        let time_start = this.statisticDays.startTimestamp;
        let time_end = this.statisticDays.endTimestamp;

        let reportDateRangeTxt
          = (new Date(time_start)).Format("yyyy-MM-dd hh:mm:ss") + " ～ " + (new Date(time_end)).Format("yyyy-MM-dd hh:mm:ss");

        this.reportTitleTxt = reportTitle;
        this.reportDateTxt = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        this.reportDateRangeTxt = reportDateRangeTxt;
        //total count
        let collectFun = rconfig.collect || function () {
          return [];
        }
        let collectList = collectFun(selectRows);
        this.collectList = collectList;
        this.selectRows = selectRows;
        // var totalC = $("#exam-report .exam-report-total-border");
        // totalC.empty();
        // if(collectList != null){
        //     for(var i=0;i<collectList.length;i++){
        //         var item = collectList[i];
        //         totalC.append("<span class=\"exam-total-item\"><label class=\"total-label\">"+item.label+":</label>"+item.value+"</span>");
        //     }
        // }
      
        var reportThead = $(".statistic-histogram-page2 .report-data-thead");
        var reportTbody = $(".statistic-histogram-page2 .report-datas-body");
        reportThead.empty();
        reportTbody.empty();

        var columnCount = 2; //双栏显示
        if (columnConfig) {

          $(".statistic-histogram-page2 .exam-report-datas-table").show();

          if (columnConfig.length > 6) {
            columnCount = 1; //单栏显示
          }

          var rowStr = "";
          var rowTemplate = "<tr>";
          for (var c = 0; c < columnCount; c++) {

            for (var i = 0; i < columnConfig.length; i++) {
              rowStr += "<th>" + columnConfig[i].label + "</th>";
              rowTemplate += "<td></td>";
            }
            if (c < columnCount - 1) {
              rowStr += "<th class=\"table-gap\"></th>";
              rowTemplate += "<td class=\"table-gap\"></td>";
            }
          }
          rowTemplate += "</tr>";
              reportThead.append(rowStr);
          
          this.$nextTick(res=>{
        
          var clen = columnConfig.length;

          for (var i = 0; i < selectRows.length; i += columnCount) {
            var one = selectRows[i];
            var two = selectRows[i + 1];
            var rowIndex = Math.floor(i / 2);
            reportTbody.append(rowTemplate);
            var tr = $(reportTbody.children()[rowIndex]);
            for (var c = 0; c < clen; c++) {
              // console.log(one[columnConfig[c].field],'pppp')
              if (one) {
                $(tr.children()[c]).html(one[columnConfig[c].field]);
              }
              if (two && columnCount == 2) {
                $(tr.children()[c + clen + 1]).html(two[columnConfig[c].field]);
              }
            }
          }
      })

        } else {
          $(".statistic-histogram-page2 .exam-report-datas-table").hide();
        }
      },
      updateHistogramChart(selectRows) {
        this.isChartShow = true;
        if (!this.histogramChart) {
          return;
        }
        // let selectRows = this.$refs.modalTable.getSelection();
        if (selectRows.length == 0) {
          // toast("没有数据");
          // $("#report-tip").show();
          return;
        }
        var rconfig = reportConfig[this.statisticIndicator] || {};
        var columnConfig = rconfig.columns;
        var hideZero = rconfig.hideZero == null ? false : rconfig.hideZero;
        // var reportSelectOkTxt = "直方图";
        var valueField = rconfig.valueField || "rate";
        var seriesName = rconfig.seriesName;
        var yFormatter = rconfig.yFormatter || function (value, index) {
          if (index == 0) {
            return "0%";
          } else {
            return value + '%';
          }
        };
        var maxData = 0;
        var minY = null;
        var xLabels = [];
        var datas = [];
        $(selectRows).each(function (index, item) {
          var v = item[valueField];
          if (!(hideZero && v == 0)) {
            xLabels.push(item.name);
            datas.push(v);
            maxData = Math.max(maxData, v);
            if (minY == null) {
              minY = v;
            }
            minY = Math.min(minY, v);
          }
        });

        if (minY == null) {
          minY = 0;
        } else {
          var y_gap = (maxData - minY) / 5;
          if (y_gap <= 0) {
            y_gap = 1;
          }
          minY = Math.max(0, minY - y_gap);
        }
        //图表排序
        //  var arr = datas;
        // arr.sort(function(a,b){
        //     return b-a;
        // })
        // 指定图表的配置项和数据
        var option = {
          tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
              var showHtm = "";
              for (var i = 0; i < params.length; i++) {
                //x轴名称
                var name = params[i].axisValueLabel;
                //名称
                var text = params[i].seriesName;
                //值
                var value = params[i].data;

                //if(!value || value == minY){
                //    showHtm += name+ '<br />' + text + ' : 无数据' ;
                // }else{
                showHtm += name + '<br />' + text + ' : ' + value;
                //}
              }
              return showHtm;
            }
          },
          grid: {
            left: '10px',
            right: '40px',
            bottom: '12px',
            top: '14px',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: xLabels
          },
          yAxis: {
            type: 'value'
            , axisLabel: {
              formatter: yFormatter
            }
            , scale: true
            , min: minY
          },
          series: [{
            name: seriesName,
            data: datas,
            barMaxWidth: '50',
            //配置样式
            itemStyle: {
              //通常情况下:
              normal: {
                color:'#4fa8f9'
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                /* color: function (params) {
                  return reportConfig.colorList[params.dataIndex % reportConfig.colorList.length];
                } */
              }
            },
            type: 'bar'
          }]
        };

        var ang = 0;
        if (option.xAxis.data.length > 20) {
          ang = 75;
        } else if (option.xAxis.data.length > 10) {
          ang = 50;
        }

        if (!option.xAxis.axisLabel) {
          option.xAxis.axisLabel = {rotate: ang};
        } else if (option.xAxis.axisLabel.rotate == null) {
          option.xAxis.axisLabel.rotate = ang;
        }
        this.histogramChart.clear();
        this.histogramChart.setOption(option);
        let width = $('.statistic-histogram-page2').width();
        this.$nextTick(res=>{
          this.histogramChart.resize();
        })
      }
    },
    mounted() {
      this.initChart();
      const that = this;
      var resizeTimer = null;
      $(window).bind('resize', function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          let width = $('.statistic-histogram-page2').width();
          if (width == 0) return;
          that.histogramChart.resize({width: width});
        }, 200);
      });

      this.$http.get("/basic/prodtype", {params: {limit: 99999999,query:'customerId='+this.toSupplierCustomerId||''}}).then(function (resp) {
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.productTypeList = resp.data;
          // that.selectorsData.productTypeList = [{prodTypeId:-1,name:"全部"}].concat(resp.data)
        }
      });
      this.$http.get("/basic/product", {
        params: {
          examType: 1,
          useState: 1,
          page: 1,
          limit: 99999999,
          customerId:this.toSupplierCustomerId||''
        }
      }).then(function (resp) {
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.productList = resp.data;
        }
      });
      this.$http.get("/bas/manufacturer", {params: {page: 1, limit: 99999999}}).then(function (resp) {
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.manufacturerList = resp.data;
        }
      });
      this.$http.get("/bas/customerList", {params: {page: 1, limit: 99999999}}).then(function (resp) {
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.customerList = resp.data;
        }
      });
      this.$http.get("/basic/prodline", {params: {page: 1, limit: 99999999,toSupplierCustomerId:this.toSupplierCustomerId||''}}).then(function (resp) {
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.prodLineList = resp.data;
        }
      });
      this.$http.get("/basic/prod-process", {params: {page: 1, limit: 99999999,toSupplierCustomerId:this.toSupplierCustomerId||''}}).then(function (resp) {
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.prodProcessList = resp.data;
        }
      });
    },
    watch: {
      buzType(val) {
        let that = this;
        /* 清空过滤条件中所选内容 */
        that.statisticFilterParams.productTypeId = null;
        that.statisticFilterParams.productId = null;
        that.statisticFilterParams.manufacturerId = null;
        that.statisticFilterParams.customerId = null;
        that.statisticFilterParams.prodLineId = null;
        that.statisticFilterParams.prodProcessId = null;
        let indicators = this.buzParams[this.buzType];
        if (indicators[this.statisticIndicator] === undefined) {
          this.statisticIndicator = Object.keys(indicators)[0];
        }
        let methods = indicators[this.statisticIndicator];
        if (methods[this.statisticMethod] === undefined) {
          this.statisticMethod = Object.keys(methods)[0];
        }
        let examType = this.buzType==="cc"?"":this.buzType==="iqc"?1:this.buzType==="pqc"?2:4;
        this.$http.get("/basic/product", {
          params: {
            examType: examType,
            useState: 1,
            page: 1,
            limit: 99999999,
            customerId:this.toSupplierCustomerId||''
          }
        }).then(function (resp) {
          if (resp && resp.data && resp.data.length > 0) {
            that.selectorsData.productList = resp.data;
          }
        });
      },
      statisticIndicator(val) {
        /* 清空过滤条件中所选内容 */
        this.statisticFilterParams.productTypeId = null;
        this.statisticFilterParams.productId = null;
        this.statisticFilterParams.manufacturerId = null;
        this.statisticFilterParams.customerId = null;
        this.statisticFilterParams.prodLineId = null;
        this.statisticFilterParams.prodProcessId = null;

        let indicators = this.buzParams[this.buzType];
        let methods = indicators[val];
        if (methods[this.statisticMethod] === undefined) {
          this.statisticMethod = Object.keys(methods)[0];
        }
      },
      statisticMethod(){
        /* 清空过滤条件中所选内容 */
        this.statisticFilterParams.productTypeId = null;
        this.statisticFilterParams.productId = null;
        this.statisticFilterParams.manufacturerId = null;
        this.statisticFilterParams.customerId = null;
        this.statisticFilterParams.prodLineId = null;
        this.statisticFilterParams.prodProcessId = null;
      },
      "statisticDays.daysRange": function (argument) {
        this.statisticDays.custom[0] = null;
        this.statisticDays.custom[1] = null;
      }
    },
    beforeDestroy() {

    }

  }
</script>
<style>
  .report-export-bth {
    padding: 0px 20px;
    margin-left: 8px;
  }

  .statistic-histogram-page2 {
    margin-bottom: 10px;
    padding-bottom: 48px
  }

  .statistic-histogram-page2 .ivu-line {
    padding-bottom: 3px;
  }

  .statistic-histogram-page2 .exam-report-main {
    margin-top: 10px;
    /* margin-right: 10px; */
    background-color: #fff;
    color: #333;
  }

  .statistic-histogram-page2 .iqis-table-no-data {
    text-align: center;
    color: #333;
    font-size: 16px;
  }

  .statistic-histogram-page2 .exam-report-title-table,
  .statistic-histogram-page2 .exam-report-total-table,
  .statistic-histogram-page2 .exam-report-datas-table,
  .statistic-histogram-page2 .exam-report-footer {
    width: 100%;
    border: 0;
    border-collapse: collapse;
  }

  .statistic-histogram-page2 .exam-report-border {
    border: 1px solid #666;
    margin-bottom: 0;
  }

  .statistic-histogram-page2 .exam-report-total-border {
    border: 1px solid #666;
    margin-left: 18px;
    margin-right: 18px;
    padding: 6px 10px;
  }

  .statistic-histogram-page2 .exam-total-item {
    margin-right: 30px;
  }

  .statistic-histogram-page2 .total-label {
    padding-right: 8px;
  }

  .statistic-histogram-page2 .exam-report-title-table .exam-report-date-cell {
    text-align: center;
  }

  .statistic-histogram-page2 .exam-report-title-table td {
    border: 0;
    vertical-align: bottom;
    line-height: 30px;
    border-collapse: collapse;
  }

  .statistic-histogram-page2 .exam-report-title-table .exam-report-title-cell {
    font-size: 32px;
    line-height: 40px;
    text-align: center;
  }

  .statistic-histogram-page2 .exam-report-datas-div {
    width: 100%;
    padding: 0 12px;
    margin-top: 10px;
  }

  .statistic-histogram-page2 .exam-report-datas-table {
    border: 1px;
    border-color: #333;
  }

  .statistic-histogram-page2 .exam-report-datas-table th,
  .statistic-histogram-page2 .exam-report-datas-table td {
    border: 1px solid #333;
    padding: 3px;
    text-align: center;
  }

  .statistic-histogram-page2 .exam-report-datas-table th {
    background-color: #efefef;
  }

  .statistic-histogram-page2 .exam-report-datas-table td.table-gap,
  .statistic-histogram-page2 .exam-report-datas-table th.table-gap {
    border-top: 0;
    border-bottom: 0;
    width: 10px;
    background-color: #fff;
  }

  .statistic-histogram-page2 .exam-report-footer {
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
</style>

