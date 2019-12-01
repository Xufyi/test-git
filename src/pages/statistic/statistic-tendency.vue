<template>
  <div class="iqis-page">
    <div class="iqis-page-tool-row" style="display:none">
      <div class="iqis-page-tool-primary">

      </div>
      <div class="iqis-page-tool-second">

      </div>
    </div>
    <div class="iqis-page-context statistic-tendency-page">
      <div id="search-bar" class="search-bar">
        <div class="form-inline" role="form">
          <div class="ivu-line">
            <span>{{$t('statistical.statisticalBusiness')}}:</span>
            <RadioGroup size='small' v-model="buzType" type="button">
              <Radio v-for="(value, key, index) in buzParams" :key="key" :label="key">{{buzNameMap[key]}}</Radio>
            </RadioGroup>
          </div>
          <!-- 统计参数 -->
          <div class="ivu-line" style='margin-top:10px;'>
            <label>{{$t('statistical.businessType')}}:</label>
            <RadioGroup size='small' v-model="statisticIndicator" type="button">
              <Radio v-for="(value, key, index) in buzParams[buzType]" :key="key" :label="key">{{buzNameMap[key]}}
              </Radio>
            </RadioGroup>
          </div>
          <div class="exam-option-group-iqc ivu-line">
            <label>{{$t('statistical.filtrationCondition')}}:</label>
            <span class="exam-report-params">
              <div class="conditionItem"><label style="width: auto;padding: 0 3px;">{{$t('statistical.productType')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.productTypeId" filterable style="width:140px">
                <Option v-for="item in selectorsData.productTypeList" :value="item.prodTypeId"
                        :key="item.prodTypeId">{{ item.name }}</Option>
              </Select></div>

              <div class="conditionItem"><label style="width: auto;padding: 0 3px;">{{$t('statistical.productNo')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.productId" filterable style="width:140px">
                <Option v-for="item in selectorsData.productList" :value="item.productId" :label="item.no" :key="item.productId">{{ item.no+" / "+item.name}}</Option>
              </Select></div>

              <div class="conditionItem"><label style="width: auto;padding: 0 3px;">{{$t('statistical.productSpec')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.productId" filterable style="width:140px">
                <Option v-for="item in selectorsData.productList" :value="item.productId" :label="item.spec" :key="item.productId">{{ item.spec}}</Option>
              </Select></div>

              <div class="conditionItem"><label style="width: auto;padding: 0 3px;" v-if="buzType == 'iqc'">{{$t('statistical.supplierName')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.manufacturerId" style="width:140px" v-if="buzType == 'iqc'"
                      filterable>
                <Option v-for="item in selectorsData.manufacturerList" :value="item.manufacturerId"
                        :key="item.manufacturerId">{{ item.manufacturerAbbreviation }}</Option>
              </Select></div>
              <div class="conditionItem"><label style="width: auto;padding: 0 3px;" v-if="(buzType == 'oqc'||buzType == 'cc')&&!toSupplierCustomerId">{{$t('statistical.customerName')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.customerId" style="width:140px"
                      v-if="(buzType == 'oqc'||buzType == 'cc')&&!toSupplierCustomerId" filterable>
                <Option v-for="item in selectorsData.customerList" :value="item.customerId"
                        :key="item.customerId">{{ item.customerAbbreviation }}</Option>
              </Select></div>
              <div class="conditionItem"><label style="width: auto;padding: 0 3px;" v-if="buzType == 'pqc'">{{$t('statistical.productLine')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.prodLineId" style="width:140px" v-if="buzType == 'pqc'" filterable>
                <Option v-for="(item,index) in selectorsData.prodLineList" :value="item.prodLineId" :label="item.name"
                        :key="index">{{ item.name }}</Option>
              </Select></div>
              <div class="conditionItem"><label style="width: auto;padding: 0 3px;" v-if="buzType == 'pqc'">{{$t('statistical.productProcess')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.prodProcessId" style="width:140px" v-if="buzType == 'pqc'" filterable>
                <Option v-for="item in selectorsData.prodProcessList" :value="item.prodProcessId"
                        :key="item.prodProcessId">{{ item.prodProcessName }}</Option>
              </Select></div>

              <div class="conditionItem"><label style="width: auto;padding: 0 3px;" v-if="(buzType == 'iqc' && statisticIndicator == 'defect') || (buzType == 'pqc' && statisticIndicator == 'defect') || (buzType == 'oqc' && statisticIndicator == 'defect') || (buzType == 'cc' && statisticIndicator == 'defect')">{{$t('statistical.project')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.inspectionTypeId" filterable style="width:140px" v-if="(buzType == 'iqc' && statisticIndicator == 'defect') || (buzType == 'pqc' && statisticIndicator == 'defect') || (buzType == 'oqc' && statisticIndicator == 'defect') || (buzType == 'cc' && statisticIndicator == 'defect')">
                <Option v-for="item in selectorsData.inspectionTypeList" :value="item.inspectionTypeId" :label="item.name" :key="item.inspectionTypeId">{{ item.name}}</Option>
              </Select></div>

              <div class="conditionItem"><label style="width: auto;padding: 0 3px;" v-if="(buzType == 'iqc' && statisticIndicator == 'defect') || (buzType == 'pqc' && statisticIndicator == 'defect') || (buzType == 'oqc' && statisticIndicator == 'defect') || (buzType == 'cc' && statisticIndicator == 'defect')">{{$t('statistical.defectName')}}</label>
              <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.defectTypeId" filterable style="width:140px" v-if="(buzType == 'iqc' && statisticIndicator == 'defect') || (buzType == 'pqc' && statisticIndicator == 'defect') || (buzType == 'oqc' && statisticIndicator == 'defect') || (buzType == 'cc' && statisticIndicator == 'defect')">
                <Option v-for="item in selectorsData.defectList" :value="item.defectTypeId" :label="item.name" :key="item.defectTypeId">{{ item.name}}</Option>
              </Select></div>
            </span>
            <!-- <Button type="ghost" icon="refresh" @click="onResetFilterParams">重置条件</Button> -->
          </div>

          <div id="exam-report-date-pick" class="ivu-line" style='margin-top:10px;'>
            <label>{{$t('statistical.reportTime')}}:</label>
            <RadioGroup size='small' v-model="statisticDays.daysRange" type="button">
              <Radio label="0">{{$t('statistical.today')}}</Radio>
              <Radio label="7">{{$t('statistical.Nearly')}}7{{$t('statistical.days')}}</Radio>
              <Radio label="30">{{$t('statistical.Nearly')}}30{{$t('statistical.days')}}</Radio>
              <Radio label="-1">{{$t('statistical.custom')}}</Radio>
            </RadioGroup>
            <DatePicker class="initDatePicker" :value="essenceDate" v-if="statisticDays.daysRange == '-1'" type="daterange" split-panels :placeholder="i18n.t('statistical.dateInterval')"
                        :start-date="new Date(2018, 2, 1)" style="width: 210px"
                        @on-change="onCustomDateChange"></DatePicker>
            <Button type="primary" icon="ios-search" @click="onBuildReport">{{$t('statistical.viewReport')}}</Button>
            <Button type="ghost" @click="onResetFilterParams">{{$t('statistical.reset')}}</Button>
            <Button style='float:right;' v-show="isChartShow == true" type="primary" icon="android-open" @click="onExportReport('exam-reportqst')">{{$t('statistical.exportReport')}}</Button>
          </div>
          <div style='width:100%; border-bottom: 1px dashed #E9E9E9; margin:15px 0;'></div>
          <!-- <Button type="info" icon="arrow-down-a">导出</Button> -->
        </div>
      </div>
      <div id="report-tab-tendency" class="tab-content exam-report-main">
        <div id="report-tip" class="iqis-report-tab" v-show="isChartShow == false">
          <div class="iqis-table-no-data" style="height: 100px;line-height: 100px;">{{$t('statistical.pleaseChoose')}}</div>
        </div>
        <div id="exam-reportqst" class="exam-report-border hidden" v-show="isChartShow">
          <table class="exam-report-title-table">
            <tr>
              <td width="25%">
                <!-- <button type="button" style='width:80px; margin-left:8px;' class="btn btn-default report-export-btn"
                        @click="onExportReport('exam-report')"><span class="glyphicon glyphicon-export">导出</span>
                </button> -->
              </td>
              <td width="50%" class="exam-report-title-cell"><span class="exam-report-title-txt"
                                                                   style="font-size:32px;">【{{reportTitleTxt}}】</span>
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
          <div class="exam-report-total-border">
            <template v-for="item in collectList">
              <span class="exam-total-item"><label class="total-label">{{ item.label }}:</label>{{ item.value }}</span>
            </template>
          </div>
          <!-- tendencyChart  -->
          <div ref="tendencyChart" id="tendencyChart" class="exam-report-chart-div" style="height: 400px; width: 100%">

          </div>
          <!-- tendencyChart end -->
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
              </tbody>

            </table>

            <table class="exam-report-footer" v-if="true">
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
  import reportConfig from './tendencyConfig';
  import TableModal from './TableModal/';

  export default {
    props:["params"],
    data() {
      let vm = this;
      return {
        essenceDate:[],
        i18n:window.i18n,
        chartType: i18n.t('statistical.trend'),
        reportTitleTxt: '', //报表title
        reportDateTxt: '', //报表日期
        reportDateRangeTxt: '',//报表时间范围
        isShowDataSelectModal: false,
        buzType: 'iqc',
        statisticIndicator: 'acceptance_rate',
        statisticMethod: 'byTime',
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
          prodLineId: null,
          prodProcessId: null,
          customerId: null,
          defectTypeId:null,
          inspectionTypeId:null,
        },
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
        tendencyChart: null,
        isChartShow: false,
        collectList: [],
        selectorsData: {
          productList: [],
          productTypeList: [],
          manufacturerList: [],
          customerList: [],
          prodLineList: [],
          prodProcessList: [],
          defectList:[],//缺陷名称列表
          inspectionTypeList:[],//检验项目
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
      onExportReport(borderId) {//border div的ID
        var reportBorder = $("#" + borderId);
        // console.log(reportBorder, 8888);
        // 添加统一的外层
        var content_html = "<div id=\"exam-report\" class=\"exam-report-border export-chart-preview\" style='background: #fff;width:1200px;'>" + reportBorder.html() + "</div>";
        var pageHead = "<div style='text-align: center;font-size: 11pt;font-weight: bold;'>" + $(".exam-report-title-txt").text() + "- "
          + reportBorder.find(".report-title-date-range-txt").text() + "&nbsp;<td width=\"25%\">"+i18n.t('statistical.tabulationDate')+":<span class=\"\">"
          + reportBorder.find(".report-title-date-txt").text() + "</span></td>&nbsp;&nbsp;"+i18n.t('statistical.pages')+":<span class='report-title-pager-txt'></span></div>";
        var w = this.$iqis.utils.printHtml(content_html, pageHead, ["static/css/export-chart-preview.css"]);


        var chartId = reportBorder.find(".exam-report-chart-div").attr("id");
        // console.log(chartId, 999);
        // console.log(this.$refs.histogramChart.id);


        var chart_ = echarts.getInstanceByDom(document.getElementById(chartId));
        // console.log(chart_, 666);

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
      initChart() {
        this.tendencyChart = echarts.init(this.$refs.tendencyChart);
      },
      onCustomDateChange(d) {
        this.statisticDays.custom[0] = this.$iqis.utils.date.toDate(d[0]);
        this.statisticDays.custom[1] = this.$iqis.utils.date.toDate(d[1]);
      },
      onResetFilterParams() {
        this.statisticFilterParams.productTypeId = null;
        this.statisticFilterParams.productId = null;
        this.statisticFilterParams.manufacturerId = null;
        this.statisticFilterParams.prodLineId = null;
        this.statisticFilterParams.prodProcessId = null;
        this.statisticFilterParams.customerId = null;
        this.statisticFilterParams.defectTypeId = null;
        this.statisticFilterParams.inspectionTypeId = null;
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
      onDataSelectorOkButton(e) {
        let selectRows = this.$refs.modalTable.getSelection();
        
        if (selectRows.length == 0) {
          // toast("没有数据");
          // $("#report-tip").show();
          return;
        }
        this.fillReportText(selectRows);
        this.updateTendencyChart(selectRows);
      },
      getReportData() {
        var reportType = this.buzType;
        var busType = this.statisticIndicator;
        var byType = this.statisticMethod;

        let hourOffset = this.$iqis.utils.__hour_offset
        let time_start = this.statisticDays.startTimestamp;
        let time_end = this.statisticDays.endTimestamp;
        let groupType = time_end - time_start > 86400000 ? 0 : 1;

        var business = this.statisticIndicator;
        var params = {"business": business, "by": byType, hourOffset: hourOffset, start: time_start, end: time_end,toSupplierCustomerId:this.toSupplierCustomerId||''};
        $.each(this.statisticFilterParams, function (key, value) {
          params[key] = value ? value : '';
        });
        let that = this;
        this.$http.get("/diagram/report/" + reportType + "/dispatcher", {params}).then(function (resp) {
          var rconfig = reportConfig[business] || {};
          var columnConfig = rconfig.columns;
          if (columnConfig) {
            columnConfig[0].label =i18n.t('statistical.time');
          }
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
        this.dataSelectorDatas = data;
        this.isShowDataSelectModal = true;
      },
      fillReportText(selectRows) {
        // let selectRows = this.$refs.modalTable.getSelection();
        var rconfig = reportConfig[this.statisticIndicator] || {};
        var columnConfig = rconfig.columns;
        if (columnConfig) {
          columnConfig[0].label =i18n.t('statistical.time');
        }
        let reportType = this.buzType;
        var reportTitle = this.buzNameMap[reportType] + rconfig.reportTitle + this.chartType;
        if(reportTitle=='客诉客诉数量趋势图'){
          reportTitle=='客诉数量趋势图'
        }
        if(this.$store.state.locale=='en_US'){
          reportTitle =this.buzNameMap[reportType]+ ' ' + rconfig.reportTitle+' ' +this.chartType 
          if(reportTitle=='Customer Complaint Customer Complaint Quantity Trend Chart'){
            reportTitle='Customer Complaint Quantity Trend Chart'
          }
        }
        let time_start = this.statisticDays.startTimestamp;
        let time_end = this.statisticDays.endTimestamp;

        let reportDateRangeTxt
          = (new Date(time_start)).Format("yyyy-MM-dd hh:mm:ss") + " ～ " + (new Date(time_end)).Format("yyyy-MM-dd hh:mm:ss");

        this.reportTitleTxt = reportTitle;
        this.reportDateTxt = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        this.reportDateRangeTxt = reportDateRangeTxt;

        var collectFun = rconfig.collect || function () {
          return [];
        }
        let collectList = collectFun(selectRows);
        this.collectList = collectList;

        var reportThead = $(".statistic-tendency-page .report-data-thead");
        var reportTbody = $(".statistic-tendency-page .report-datas-body");
        reportThead.empty();
        reportTbody.empty();

        var columnCount = 2;
        if (columnConfig) {
          $(".statistic-tendency-page .exam-report-datas-table").show();

          if (columnConfig.length > 6) {
            columnCount = 1;
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

          var clen = columnConfig.length;

          for (var i = 0; i < selectRows.length; i += columnCount) {
            var one = selectRows[i];
            var two = selectRows[i + 1];
            var rowIndex = Math.floor(i / 2);
            reportTbody.append(rowTemplate);
            var tr = $(reportTbody.children()[rowIndex]);
            for (var c = 0; c < clen; c++) {
              if (one) {
                $(tr.children()[c]).text(one[columnConfig[c].field]);
              }
              if (two && columnCount == 2) {
                $(tr.children()[c + clen + 1]).text(two[columnConfig[c].field]);
              }
            }
          }

        } else {
          $(".statistic-tendency-page .exam-report-datas-table").hide();
        }
      },
      updateTendencyChart(selectRows) {
        if (!this.tendencyChart) {
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
        let that = this;
        var yFormatter = rconfig.yFormatter || function (value, index) {
          if(that.statisticIndicator == 'defect'){
             if (index == 0) {
            return "0";
          } else {
            return value;
          }
          }else{
            if (index == 0) {
              return "0%";
            } else {
              return value + '%';
            }
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
            type: 'line',
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
        this.tendencyChart.clear();
        this.tendencyChart.setOption(option);
        let width = $('.statistic-tendency-page').width();
        this.tendencyChart.resize({width: width});
        this.isChartShow = true;
      }
    },
    mounted() {
      this.initChart();
      let that = this;
      console.log(that.$props.params,"that.$props.params")
      if(that.$props && that.$props.params){
        /* if(that.$props.params.ipoc == 'pqc'){
          that.buzType = that.$props.params.ipoc;
        }else if(that.$props.params.ipoc == 'oqc'){
          that.buzType = that.$props.params.ipoc;
        }else if(that.$props.params.ipoc == 'cc'){
          that.buzType = that.$props.params.ipoc;
        }else{
          that.buzType = that.$props.params.ipoc;
          } */
          // that.onBuildReport()
          this.buzType = this.$props.params.ipoc;
          {

            let time_end = this.$iqis.utils.getDayEnd2();
            let time_start = this.$iqis.utils.getDayStart(1);
            this.statisticDays.daysRange = "0"
            let daysRange = this.$props.params.day;
            if (daysRange == 7) {
              this.statisticDays.daysRange = "7"
              time_start = this.$iqis.utils.get7DayStart();
            } else if (daysRange == 30) {
              this.statisticDays.daysRange = "30"
              time_start = this.$iqis.utils.get30DayStart();
            }
            if (this.$props.params.custom.length > 1) {
              this.statisticDays.daysRange = -1
              let startDate = this.$props.params.custom[0];
              let endDate = this.$props.params.custom[1];
              if (startDate && endDate) {
                this.essenceDate = []
                this.essenceDate = this.$props.params.essenceDate
                time_end = endDate.getTime() + 86399999;
                time_start = startDate.getTime();
              } else {
                this.$Notice.warning({
                  title: i18n.t('statistical.selectTime'),
                  desc: ''
                });
              }
            }
            this.statisticDays.startTimestamp = time_start;
            this.statisticDays.endTimestamp = time_end;
          }
          var reportType = this.buzType;
          var busType = this.statisticIndicator;
          var byType = this.statisticMethod;
          let hourOffset = this.$iqis.utils.__hour_offset
          let time_start = this.statisticDays.startTimestamp;
          let time_end = this.statisticDays.endTimestamp;
          let groupType = time_end - time_start > 86400000 ? 0 : 1;
          var business = this.$props.params.business;
          var params = {"business": business, "by": byType, hourOffset: hourOffset, start: time_start, end: time_end,toSupplierCustomerId:this.toSupplierCustomerId||''};
          $.each(this.statisticFilterParams, function (key, value) {
            params[key] = value ? value : '';
          });
          this.$http.get("/diagram/report/" + reportType + "/dispatcher", {params}).then(function (resp) {
            if(!resp.data.list){
              return false;
            }
            var rconfig = reportConfig[business] || {};
            var columnConfig = rconfig.columns;
            if (columnConfig) {
              columnConfig[0].label =i18n.t('statistical.time');
            }
            //init modal table's data
            let columns = $.map(columnConfig, function (item, index) {
              return {title: item.label, key: item.field, sortable: true};
            });
            $.each(resp.data.list, function (index, item) {
              item['_checked'] = true;
              item["_iqis_rowIndex"] = index + 1;
            })
            // that.showDataSelectModal(columns, resp.data.list);
            let length = that.dataSelectorColumns.length;
            that.dataSelectorColumns.splice(2, length - 2);//保持前两个(固定的)
            $.each(columns, function (index, item) {
              that.dataSelectorColumns.push(item);
            });
            that.dataSelectorDatas = resp.data.list;
            // that.isShowDataSelectModal = true;
            // let selectRows = that.$refs.modalTable.getSelection();
            let selectRows = resp.data.list;
            /* if (selectRows.length == 0) {
              return;
            } */
            // console.log(that.$refs.modalTable,"44444444");
            that.fillReportText(selectRows);
            that.updateTendencyChart(selectRows);
          });
      }





      
      var resizeTimer = null;
      $(window).bind('resize', function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          let width = $('.statistic-tendency-page').width();
          if (width == 0) return;
          that.tendencyChart.resize({width: width});
        }, 200);
      });

      this.$http.get("/basic/prodtype", {params: {limit: 99999999,query:'customerId='+this.toSupplierCustomerId||''}}).then(function (resp) {
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.productTypeList = resp.data;
        }
      });
      this.$http.get("/basic/product", {
        params: {
          examType: this.buzType == 'iqc' ? 1 : this.buzType == 'pqc' ? 2 : this.buzType == 'oqc' ? 4 : '',
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
      this.$http.get("/bas/manufacturer", {params: {page: 1, limit: 99999999,toSupplierCustomerId:this.toSupplierCustomerId||''}}).then(function (resp) {
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.manufacturerList = resp.data;
        }
      });
      this.$http.get("/bas/customerList", {params: {page: 1, limit: 99999999,toSupplierCustomerId:this.toSupplierCustomerId||''}}).then(function (resp) {
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
      //检验项目接口
      this.$http.get('/basic/inspectiontype', {params: {page: 1, limit: 99999999,toSupplierCustomerId:this.toSupplierCustomerId||''}}).then(function(resp){
        if (resp && resp.data && resp.data.length > 0) {
           that.selectorsData.inspectionTypeList = resp.data;
          
        }
      })
      //缺陷名称接口
      this.$http.get('/basic/defecttype', {params: {page: 1, limit: 99999999,toSupplierCustomerId:this.toSupplierCustomerId||''}}).then(function(resp){
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.defectList = resp.data;
          
        }
      })
    },
    watch: {
      statisticIndicator(val){
        this.statisticFilterParams.productTypeId = null;
        this.statisticFilterParams.productId = null;
        this.statisticFilterParams.manufacturerId = null;
        this.statisticFilterParams.customerId = null;
        this.statisticFilterParams.prodLineId = null;
        this.statisticFilterParams.prodProcessId = null;
        this.statisticFilterParams.inspectionTypeId = null;
        this.statisticFilterParams.defectTypeId = null;
      },
      buzType(val) {
        let that = this;
        this.statisticFilterParams.productTypeId = null;
        this.statisticFilterParams.productId = null;
        this.statisticFilterParams.manufacturerId = null;
        this.statisticFilterParams.customerId = null;
        this.statisticFilterParams.prodLineId = null;
        this.statisticFilterParams.prodProcessId = null;
        this.statisticFilterParams.inspectionTypeId = null;
        this.statisticFilterParams.defectTypeId = null;
        this.$http.get("/basic/product", {
        params: {
          examType: this.buzType == 'iqc' ? 1 : this.buzType == 'pqc' ? 2 : this.buzType == 'oqc' ? 4 : '',
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
        this.statisticFilterParams.inspectionTypeId = null;
        this.statisticFilterParams.defectTypeId = null;


        let indicators = this.buzParams[this.buzType];
        if (indicators[this.statisticIndicator] === undefined) {
          this.statisticIndicator = Object.keys(indicators)[0];
        }
      },
      "statisticDays.daysRange": function (argument) {
        // console.log(argument)
        this.statisticDays.custom[0] = null;
        this.statisticDays.custom[1] = null;
      }
    },
    beforeDestroy() {

    }

  }
</script>

<style>
  .statistic-tendency-page {
    margin-bottom: 10px;
    padding-bottom: 48px
  }

  .statistic-tendency-page .ivu-line {
    padding-bottom: 3px;
  }

  .statistic-tendency-page .exam-report-main {
    margin-top: 10px;
    margin-right: 10px;
    background-color: #fff;
    color: #333;
  }

  .statistic-tendency-page .iqis-table-no-data {
    text-align: center;
    color: #333;
    font-size: 16px;
  }

  .statistic-tendency-page .exam-report-title-table,
  .statistic-tendency-page .exam-report-total-table,
  .statistic-tendency-page .exam-report-datas-table,
  .statistic-tendency-page .exam-report-footer {
    width: 100%;
    border: 0;
    border-collapse: collapse;
  }

  .statistic-tendency-page .exam-report-border {
    border: 1px solid #666;
    margin-bottom: 0;
  }

  .statistic-tendency-page .exam-report-total-border {
    border: 1px solid #666;
    margin-left: 18px;
    margin-right: 18px;
    padding: 6px 10px;
  }

  .statistic-tendency-page .exam-total-item {
    margin-right: 30px;
  }

  .statistic-tendency-page .total-label {
    padding-right: 8px;
  }

  .statistic-tendency-page .exam-report-title-table .exam-report-date-cell {
    text-align: center;
  }

  .statistic-tendency-page .exam-report-title-table td {
    border: 0;
    vertical-align: bottom;
    line-height: 30px;
    border-collapse: collapse;
  }

  .statistic-tendency-page .exam-report-title-table .exam-report-title-cell {
    font-size: 32px;
    line-height: 40px;
    text-align: center;
  }

  .statistic-tendency-page .exam-report-datas-div {
    width: 100%;
    padding: 0 12px;
    margin-top: 10px;
  }

  .statistic-tendency-page .exam-report-datas-table {
    border: 1px;
    border-color: #333;
  }

  .statistic-tendency-page .exam-report-datas-table th,
  .statistic-tendency-page .exam-report-datas-table td {
    border: 1px solid #333;
    padding: 3px;
    text-align: center;
  }

  .statistic-tendency-page .exam-report-datas-table th {
    background-color: #efefef;
  }

  .statistic-tendency-page .exam-report-datas-table td.table-gap,
  .statistic-tendency-page .exam-report-datas-table th.table-gap {
    border-top: 0;
    border-bottom: 0;
    width: 10px;
    background-color: #fff;
  }

  .statistic-tendency-page .exam-report-footer {
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
