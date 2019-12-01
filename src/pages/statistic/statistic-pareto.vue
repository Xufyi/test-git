<template>
  <div class="iqis-page">
    <div class="iqis-page-tool-row" style="display:none">
      <div class="iqis-page-tool-primary">

      </div>
      <div class="iqis-page-tool-second">

      </div>
    </div>
    <div class="iqis-page-context statistic-pareto-page">
      <div id="search-bar" class="search-bar">
        <div class="form-inline" role="form">
          <div class="ivu-line">
            <span>{{$t('statistical.statisticalBusiness')}}:</span>
            <RadioGroup size='small' v-model="buzType" type="button">
              <Radio v-for="(value, key, index) in buzParams" :key="key" :label="key">{{buzNameMap[key]}}</Radio>
            </RadioGroup>
          </div>
          <div class="exam-option-group-iqc ivu-line">
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
                <Option v-for="item in selectorsData.productList" :value="item.productId" :label="item.spec" :key="item.productId">{{item.spec}}</Option>
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
                <Option v-for="item in selectorsData.prodLineList" :value="item.prodLineId"
                        :key="item.prodLineId">{{ item.name }}</Option>
              </Select></div>
              <div class="conditionItem">
                <label style="width: auto;padding: 0 3px;" v-if="buzType == 'pqc'">{{$t('statistical.productProcess')}}</label>
                <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.prodProcessId" style="width:140px" v-if="buzType == 'pqc'" filterable>
                  <Option v-for="item in selectorsData.prodProcessList" :value="item.prodProcessId" :key="item.prodProcessId">{{ item.prodProcessName }}</Option>
                </Select>
              </div>
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
            <DatePicker class="initDatePicker" v-if="statisticDays.daysRange == '-1'" type="daterange" split-panels :placeholder="i18n.t('statistical.dateInterval')"
                        :start-date="new Date(2018, 2, 1)" style="width: 210px"
                        @on-change="onCustomDateChange"></DatePicker>
            <Button type="primary" icon="ios-search" @click="onBuildReport">{{$t('statistical.viewReport')}}</Button>
            <Button type="ghost" @click="onResetFilterParams">{{$t('statistical.reset')}}</Button>
            <Button style='float:right;' v-show="isChartShow == true" type="primary" icon="android-open" @click="onExportReport('exam-reportplt')">{{$t('statistical.exportReport')}}</Button>
          </div>
          <div style='width:100%; border-bottom: 1px dashed #E9E9E9; margin:15px 0;'></div>
          <!-- <Button type="info" icon="arrow-down-a">导出</Button> -->
        </div>
      </div>
      <div id="report-tab-pareto" class="tab-content exam-report-main">
        <div id="report-tip" class="iqis-report-tab" v-show="isChartShow == false">
          <div class="iqis-table-no-data" style="height: 100px;line-height: 100px;">{{$t('statistical.pleaseChoose')}}</div>
        </div>
        <div id="exam-reportplt" class="exam-report-border hidden" v-show="isChartShow">
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
          <!-- paretoChart  -->
          <div ref="paretoChart" id="paretoChart" class="exam-report-chart-div" style="height: 400px; width: 100%">

          </div>
          <!-- paretoChart end -->
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
        :title="i18n.t('statistical.defectSelect')"
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
  import numeral from 'numeral';

  export default {
    data() {
      let vm = this;

      return {
        i18n:window.i18n,
        chartType: i18n.t('statistical.pareto'),
        reportTitleTxt: '', //报表title
        reportDateTxt: '', //报表日期
        reportDateRangeTxt: '',//报表时间范围
        isShowDataSelectModal: false,
        buzType: 'iqc',
        statisticIndicator: 'defect',
        statisticMethod: 'byDefect',
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
          prodProcessId: null,
          prodLineId: null
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
        paretoChart: null,
        isChartShow: false,
        collectList: [],
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
        this.paretoChart = echarts.init(this.$refs.paretoChart);
      },
      onCustomDateChange(d) {
        this.statisticDays.custom[0] = this.$iqis.utils.date.toDate(d[0]);
        this.statisticDays.custom[1] = this.$iqis.utils.date.toDate(d[1]);
      },
      onResetFilterParams() {
        this.statisticFilterParams.productTypeId = null;
        this.statisticFilterParams.productId = null;
        this.statisticFilterParams.manufacturerId = null;
        this.statisticFilterParams.prodLineId=null;
        this.statisticFilterParams.prodProcessId=null;
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
        this.updateParetoChart(selectRows);
      },
      getReportData() {
        let reportType = this.buzType;
        let busType = this.statisticIndicator;
        let byType = this.statisticMethod;

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
          // console.log(resp);
          // if(!resp || !resp.data || !resp.data.list || resp.data.list.length ==0){
          //     // toast("无结果可以显示");
          //     return;
          // }
          var rconfig = reportConfig[business] || {};
          var columnConfig = rconfig.columns;
          if (columnConfig) {
            columnConfig[0].label = i18n.t('statistical.name');
          }
          // console.log('init data')
          //init modal table's data
          //计算占总比
          let valueField = rconfig.valueField;
          let totalValue = 0;
          $(resp.data.list).each(function (index, item) {
            totalValue += item[valueField];
          });

          let columns = $.map(columnConfig, function (item, index) {
            return {title: item.label, key: item.field, sortable: true};
          });
          // console.log('init data2')
          $.each(resp.data.list, function (index, item) {
            item['_checked'] = true;
            item["_iqis_rowIndex"] = index + 1;
            let val = item[valueField];
            // console.log('init data numeral = ')
            // console.log(numeral)
            /* let zb = numeral(val / totalValue * 100);
            // console.log('zb=' + zb)
            item["zb"] = zb.format("0.00"); */
            let zb = val / totalValue * 100;
            zb = Math.floor(zb * 100) / 100
            item["zb"] = zb;
          })
          // console.log('init data3')
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
          columnConfig[0].label = i18n.t('statistical.name');
        }
        let reportType = this.buzType;
        var reportTitle = this.buzNameMap[reportType] + rconfig.reportTitle + this.chartType;
        if(reportTitle=='客诉客诉数量排列图'){
          reportTitle=='客诉数量排列图'
        }
        if(this.$store.state.locale=='en_US'){
          reportTitle =this.buzNameMap[reportType]+ ' ' + rconfig.reportTitle+' ' +this.chartType 
          if(reportTitle=='Customer Complaint Customer Complaint Quantity Pareto'){
            reportTitle='Customer Complaint Quantity Pareto'
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

        var reportThead = $(".statistic-pareto-page .report-data-thead");
        var reportTbody = $(".statistic-pareto-page .report-datas-body");
        reportThead.empty();
        reportTbody.empty();

        var columnCount = 2;
        if (columnConfig) {
          $(".statistic-pareto-page .exam-report-datas-table").show();

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
          $(".statistic-pareto-page .exam-report-datas-table").hide();
        }
      },
      updateParetoChart(selectRows) {
        if (!this.paretoChart) {
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
        var datas2 = [];
        var total_defect = 0;

        $(selectRows).each(function (index, item) {
          var v = item[valueField];
          total_defect += v;
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
        // console.log('updateParetoChart')
        var appV = 0;
        $(selectRows).each(function (index, item) {
          appV += item[valueField];
          var d2 = numeral(appV / total_defect * 100);
          var cv = numeral(item[valueField] / total_defect * 100);
          d2 = d2.format("0.00");
          item["zb"] = cv.format("0.00");
          datas2.push(d2);
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
                if (i == 0) {
                  showHtm += name + '<br />';
                }
                showHtm += text + ' : ' + value + '<br />';
                //}
              }
              return showHtm;
            }
          },
          grid: {
            left: '10px',
            right: '30px',
            bottom: '12px',
            top: '35px',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            axisLabel: {
              interval: 0,
              rotate: 60
            },
            data: xLabels
          },
          yAxis: [{
            type: 'value',
            interval: total_defect / 10.0,
            axisLabel: {
              formatter: function (value, index) {
                if (total_defect > 200) {
                  return parseInt(value + "");
                }
                return Math.round(value * 10) / 10;
              }
            },
            splitLine: {
              show: false
            },
            max: 'dataMax'
          },
            {
              type: 'value',
              max: 100,
              position: 'right',
              interval: 10,
              axisLabel: {
                formatter: function (value, index) {
                  if (index == 0) {
                    return "0%";
                  } else {
                    return value + '%';
                  }
                }
              }
            }
          ],
          color: ['#6ec71e'],
          series: [{
            name: i18n.t('statistical.defectQuantity'),
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
            showAllSymbol: true,
            label: {
              show: true,
              formatter: function (param) {
                var bv = numeral(param.value / total_defect * 100);
                return param.value + "\n" + bv.format('0.00') + "%"
              },
              position: 'top'
            },
            type: 'bar'
          }, {
            name: i18n.t('statistical.defectPercentage')+"(%)",
            yAxisIndex: 1,
            type: 'line',
            data: datas2
          }
          ]
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
        this.paretoChart.clear();
        this.paretoChart.setOption(option);
        let width = $('.statistic-pareto-page').width();
        this.paretoChart.resize({width: width});
        this.isChartShow = true;
      }
    },
    mounted() {
      this.initChart();
      const that = this;
      var resizeTimer = null;
      $(window).bind('resize', function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          let width = $('.statistic-pareto-page').width();
          if (width == 0) return;
          that.paretoChart.resize({width: width});
        }, 200);
      });

      this.$http.get("/basic/prodtype", {params: {limit: 99999999,query:'customerId='+this.toSupplierCustomerId||''}}).then(function (resp) {
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.productTypeList = resp.data;
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
    },
    watch: {
      buzType(){
        this.statisticFilterParams.productTypeId = null;
        this.statisticFilterParams.productId = null;
        this.statisticFilterParams.manufacturerId = null;
        this.statisticFilterParams.customerId = null;
        this.statisticFilterParams.prodLineId = null;
        this.statisticFilterParams.prodProcessId = null;
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
  .statistic-pareto-page {
    margin-bottom: 10px;
    padding-bottom: 48px
  }

  .statistic-pareto-page .ivu-line {
    padding-bottom: 3px;
  }

  .statistic-pareto-page .exam-report-main {
    margin-top: 10px;
    /* margin-right: 10px; */
    background-color: #fff;
    color: #333;
  }

  .statistic-pareto-page .iqis-table-no-data {
    text-align: center;
    color: #333;
    font-size: 16px;
  }

  .statistic-pareto-page .exam-report-title-table,
  .statistic-pareto-page .exam-report-total-table,
  .statistic-pareto-page .exam-report-datas-table,
  .statistic-pareto-page .exam-report-footer {
    width: 100%;
    border: 0;
    border-collapse: collapse;
  }

  .statistic-pareto-page .exam-report-border {
    border: 1px solid #666;
    margin-bottom: 0;
  }

  .statistic-pareto-page .exam-report-total-border {
    border: 1px solid #666;
    margin-left: 18px;
    margin-right: 18px;
    padding: 6px 10px;
  }

  .statistic-pareto-page .exam-total-item {
    margin-right: 30px;
  }

  .statistic-pareto-page .total-label {
    padding-right: 8px;
  }

  .statistic-pareto-page .exam-report-title-table .exam-report-date-cell {
    text-align: center;
  }

  .statistic-pareto-page .exam-report-title-table td {
    border: 0;
    vertical-align: bottom;
    line-height: 30px;
    border-collapse: collapse;
  }

  .statistic-pareto-page .exam-report-title-table .exam-report-title-cell {
    font-size: 32px;
    line-height: 40px;
    text-align: center;
  }

  .statistic-pareto-page .exam-report-datas-div {
    width: 100%;
    padding: 0 12px;
    margin-top: 10px;
  }

  .statistic-pareto-page .exam-report-datas-table {
    border: 1px;
    border-color: #333;
  }

  .statistic-pareto-page .exam-report-datas-table th,
  .statistic-pareto-page .exam-report-datas-table td {
    border: 1px solid #333;
    padding: 3px;
    text-align: center;
  }

  .statistic-pareto-page .exam-report-datas-table th {
    background-color: #efefef;
  }

  .statistic-pareto-page .exam-report-datas-table td.table-gap,
  .statistic-pareto-page .exam-report-datas-table th.table-gap {
    border-top: 0;
    border-bottom: 0;
    width: 10px;
    background-color: #fff;
  }

  .statistic-pareto-page .exam-report-footer {
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
