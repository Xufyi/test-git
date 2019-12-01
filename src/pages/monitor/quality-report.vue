<template>
  <div class="iqis-page">
    <div class="iqis-page-tool-row" style="display:none">
      <div class="iqis-page-tool-primary">

      </div>
      <div class="iqis-page-tool-second">

      </div>
    </div>
    <div class="iqis-page-context quality-report-page">
      <div id="search-bar" class="search-bar">
        <div class="form-inline" role="form">
          <div class="ivu-line">
            <label>{{$t('monitor.reportType')}}:</label>
            <RadioGroup v-model="buzType" type="button">
              <Radio v-for="(value, key, index) in buzParams" :key="key" :label="key">{{buzNameMap[key]}}</Radio>
            </RadioGroup>
          </div>
          <div id="exam-report-date-pick" class="ivu-line">
            <label>{{$t('monitor.reportTime')}}:</label>
            <RadioGroup v-model="statisticDays.daysRange" type="button">
              <Radio label="0">{{$t('monitor.today')}}</Radio>
              <Radio label="7">7{{$t('monitor.days')}}</Radio>
              <Radio label="30">30{{$t('monitor.days')}}</Radio>
              <Radio label="-1">{{$t('monitor.customize')}}</Radio>
            </RadioGroup>
            <DatePicker v-if='statisticDays.daysRange == "-1"' :style="custom" type="daterange" split-panels style="width: 210px"
                        @on-change="onCustomDateChange"></DatePicker>
          <Button type="primary" icon="ios-search" @click="onBuildReport">{{$t('monitor.viewReport')}}</Button>
          </div></br>
          <div style='width:100%; border-bottom: 1px dashed #E9E9E9; margin:0px 0px 20px 0px;'></div>
        </div>
      </div>
      <div id="report-tab" class="tab-content report-main">
        <div id="report-tip" class="iqis-report-tab" v-show="isChartShow == false">
          <div class="iqis-table-no-data" style="height: 100px;line-height: 100px;">{{$t('monitor.pleaseChoose')}}</div>
        </div>
        <div id="iqc-report" class="iqis-report-tab" v-show="isChartShow == true && buzType == 'iqc'">
          <div id="dashboard-rr-report" class="dashboard-report-border">
            <table class="dashboard-report-title-table">
              <tr>
                <td width="25%">
                  <button type="button" class="btn btn-default report-export-btn"
                          @click="onExportReport('dashboard-rr-report')"><span
                    class="glyphicon glyphicon-export"></span> {{$t('monitor.export')}}
                  </button>
                </td>
                <td width="50%" class="dashboard-report-title-cell">【{{$t('monitor.iqcAllowYieldChart')}}】</td>
                <td width="25%">{{$t('monitor.tableDate')}}：<span class="report-title-date-txt">0000-00-00 00:00:00</span></td>
              </tr>
              <tr>
                <td width="25%"></td>
                <td width="50%" class="dashboard-report-date-cell">{{$t('monitor.dateRange')}}：<span class="report-title-date-range-txt">0000-00-00 00:00:00 ～ 0000-00-00 00:00:00</span>
                </td>
                <td width="25%">{{$t('monitor.page')}}：<span class="report-title-pager-txt">1 / 1</span></td>
              </tr>
            </table>
            <div class="dashboard-report-total-border">
              <table class="dashboard-report-total-table">
                <td width="20%">{{$t('monitor.batchNum')}}：<span class="report-total-batch-txt">-</span></td>
                <td width="20%">{{$t('monitor.qualifiedBatchNum')}}：<span class="report-total-pass-txt">-</span></td>
                <td width="20%">{{$t('monitor.allowYield')}}（%）：<span class="report-total-rr-txt">-</span></td>
                <td width="40%"><span class="report-total-group-txt"></span></td>
              </table>
            </div>
            <div id="dashboard-report-chart-iqc-1" class="dashboard-report-chart-div"
                 style="height: 270px;width: 500px">

            </div>
            <div class="dashboard-report-datas-div">
              <table class="dashboard-report-datas-table">
                <thead>
                <tr class="report-data-thead">
                  <th>{{$t('monitor.time')}}</th>
                  <th>{{$t('monitor.batchNum')}}</th>
                  <th>{{$t('monitor.qualifiedBatchNum')}}</th>
                  <th>{{$t('monitor.allowYield')}}%</th>
                  <th class="table-gap"></th>
                  <th>{{$t('monitor.time')}}</th>
                  <th>{{$t('monitor.batchNum')}}</th>
                  <th>{{$t('monitor.qualifiedBatchNum')}}</th>
                  <th>{{$t('monitor.allowYield')}}%</th>
                </tr>
                </thead>
                <tbody class="report-datas-body">
                <!-- <tr>
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
                              </tr> -->
                </tbody>

              </table>
            </div>

            <table class="dashboard-report-footer">
              <tr>
                <td width="15%">{{$t('monitor.confirm')}}：</td>
                <td width="15%">{{$t('monitor.review')}}：</td>
                <td width="15%">{{$t('monitor.tabulation')}}</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="report-border-gap"></div>
          <div id="dashboard-ex-report" class="dashboard-report-border">
            <table class="dashboard-report-title-table">
              <tr>
                <td width="25%">
                  <button type="button" class="btn btn-default report-export-btn"
                          @click="onExportReport('dashboard-ex-report')"><span
                    class="glyphicon glyphicon-export"></span> {{$t('monitor.export')}}
                  </button>
                </td>
                <td width="50%" class="dashboard-report-title-cell">【{{$t('monitor.iqcTypeAbnChart')}}】</td>
                <td width="25%">{{$t('monitor.tableDate')}}：<span class="report-title-date-txt">0000-00-00 00:00:00</span></td>
              </tr>
              <tr>
                <td width="25%"></td>
                <td width="50%" class="dashboard-report-date-cell">{{$t('monitor.dateRange')}}：<span class="report-title-date-range-txt">0000-00-00 00:00:00 ～ 0000-00-00 00:00:00</span>
                </td>
                <td width="25%">{{$t('monitor.page')}}：<span class="report-title-pager-txt">1 / 1</span></td>
              </tr>
            </table>
            <div class="dashboard-report-total-border">
              <table class="dashboard-report-total-table">
                <td width="20%">{{$t('monitor.sumBatchNum')}}：<span class="report-total-batch-txt">-</span></td>
                <td width="20%">{{$t('monitor.sumInspectNum')}}：<span class="report-total-exam-txt">-</span></td>
                <td width="20%">{{$t('monitor.sumAbnNum')}}：<span class="report-total-ex-txt">-</span></td>
                <td width="40%"><span class="report-total-group-txt"></span></td>
              </table>
            </div>
            <div id="dashboard-report-chart-iqc-2" class="dashboard-report-chart-div"
                 style="height: 270px;width: 500px">

            </div>
            <div class="dashboard-report-datas-div">
              <table class="dashboard-report-datas-table">
                <thead>
                <tr class="report-data-thead">
                  <th>{{$t('monitor.productName')}}</th>
                  <th>{{$t('monitor.sumBatchNum')}}</th>
                  <th>{{$t('monitor.sumInspectNum')}}</th>
                  <th>{{$t('monitor.sumAbnNum')}}</th>
                  <th class="table-gap"></th>
                  <th>{{$t('monitor.productName')}}</th>
                  <th>{{$t('monitor.sumBatchNum')}}</th>
                  <th>{{$t('monitor.sumInspectNum')}}</th>
                  <th>{{$t('monitor.sumAbnNum')}}</th>
                </tr>
                </thead>
                <tbody class="report-datas-body">
                <!-- <tr>
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
                            </tr> -->
                </tbody>

              </table>
            </div>

            <table class="dashboard-report-footer">
              <tr>
                <td width="15%">{{$t('monitor.confirm')}}：</td>
                <td width="15%">{{$t('monitor.review')}}：</td>
                <td width="15%">{{$t('monitor.tabulation')}}：</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="report-border-gap"></div>
          <div id="dashboard-mf-report" class="dashboard-report-border">
            <table class="dashboard-report-title-table">
              <tr>
                <td width="25%">
                  <button type="button" class="btn btn-default report-export-btn"
                          @click="onExportReport('dashboard-mf-report')"><span
                    class="glyphicon glyphicon-export"></span> {{$t('monitor.export')}}
                  </button>
                </td>
                <td width="50%" class="dashboard-report-title-cell">【{{$t('monitor.supplierAbnHistChart')}}】</td>
                <td width="25%">{{$t('monitor.tableDate')}}：<span class="report-title-date-txt">0000-00-00 00:00:00</span></td>
              </tr>
              <tr>
                <td width="25%"></td>
                <td width="50%" class="dashboard-report-date-cell">{{$t('monitor.dateRange')}}：<span class="report-title-date-range-txt">0000-00-00 00:00:00 ～ 0000-00-00 00:00:00</span>
                </td>
                <td width="25%">{{$t('monitor.page')}}：<span class="report-title-pager-txt">1 / 1</span></td>
              </tr>
            </table>
            <div class="dashboard-report-total-border">
              <table class="dashboard-report-total-table">
                <td width="20%">{{$t('monitor.supplierNum')}}：<span class="report-total-batch-txt">-</span></td>
                <!-- <td width="20%">{{$t('monitor.sumInspectNum')}}：<span class="report-total-exam-txt">-</span></td> -->
                <td width="20%">{{$t('monitor.sumAbnNum')}}：<span class="report-total-ex-txt">-</span></td>
                <td width="40%"><span class="report-total-group-txt"></span></td>
              </table>
            </div>
            <div id="dashboard-report-chart-iqc-3" class="dashboard-report-chart-div"
                 style="height: 270px;width: 500px">

            </div>
            <div class="dashboard-report-datas-div">
              <table class="dashboard-report-datas-table">
                <thead>
                <tr class="report-data-thead">
                  <th>{{$t('monitor.supplierName')}}</th>
                  <th>{{$t('monitor.sumBatchNum')}}</th>
                  <th>{{$t('monitor.sumInspectNum')}}</th>
                  <th>{{$t('monitor.sumAbnNum')}}</th>
                  <th class="table-gap"></th>
                  <th>{{$t('monitor.supplierName')}}</th>
                  <th>{{$t('monitor.sumBatchNum')}}</th>
                  <th>{{$t('monitor.sumInspectNum')}}</th>
                  <th>{{$t('monitor.sumAbnNum')}}</th>
                </tr>
                </thead>
                <tbody class="report-datas-body">
                <!-- <tr>
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
                            </tr> -->
                </tbody>

              </table>
            </div>

            <table class="dashboard-report-footer">
              <tr>
                <td width="15%">{{$t('monitor.confirm')}}：</td>
                <td width="15%">{{$t('monitor.review')}}：</td>
                <td width="15%">{{$t('monitor.tabulation')}}：</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="report-border-gap"></div>
        </div>

        <div id="pqc-report" class="iqis-report-tab" v-show="isChartShow == true && buzType == 'pqc'">
          <div id="dashboard-pass-report" class="dashboard-report-border">
            <table class="dashboard-report-title-table">
              <tr>
                <td width="25%">
                  <button type="button" class="btn btn-default report-export-btn"
                          @click="onExportReport('dashboard-pass-report')"><span
                    class="glyphicon glyphicon-export"></span> {{$t('monitor.export')}}
                  </button>
                </td>
                <td width="50%" class="dashboard-report-title-cell">【{{$t('monitor.overallFpyChart')}}】</td>
                <td width="25%">{{$t('monitor.tableDate')}}：<span class="report-title-date-txt">0000-00-00 00:00:00</span></td>
              </tr>
              <tr>
                <td width="25%"></td>
                <td width="50%" class="dashboard-report-date-cell">{{$t('monitor.dateRange')}}：<span class="report-title-date-range-txt">0000-00-00 00:00:00 ～ 0000-00-00 00:00:00</span>
                </td>
                <td width="25%">{{$t('monitor.page')}}：<span class="report-title-pager-txt">1 / 1</span></td>
              </tr>
            </table>
            <div class="dashboard-report-total-border">
              <table class="dashboard-report-total-table">
                <td width="20%">{{$t('monitor.sumPutProdNum')}}：<span class="report-total-batch-txt">-</span></td>
                <td width="20%">{{$t('monitor.sumGoodProdNum')}}：<span class="report-total-pass-txt">-</span></td>
                <td width="20%">{{$t('monitor.fpy')}}(%)：<span class="report-total-fpy-txt">-</span></td>
                <td width="15%"></td>
                <td width="30%"></td>
              </table>
            </div>
            <div id="dashboard-report-chart-pqc-1" class="dashboard-report-chart-div"
                 style="height: 270px;width: 500px">

            </div>
            <div class="dashboard-report-datas-div">
              <table class="dashboard-report-datas-table">
                <thead>
                <tr class="report-data-thead">
                  <th>{{$t('monitor.time')}}</th>
                  <th>{{$t('monitor.putProdNum')}}</th>
                  <th>{{$t('monitor.goodProdNum')}}</th>
                  <th>{{$t('monitor.fpy')}}%</th>
                  <th class="table-gap"></th>
                  <th>{{$t('monitor.time')}}</th>
                  <th>{{$t('monitor.putProdNum')}}</th>
                  <th>{{$t('monitor.goodProdNum')}}</th>
                  <th>{{$t('monitor.fpy')}}%</th>
                </tr>
                </thead>
                <tbody class="report-datas-body">
                <!-- <tr>
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
                          </tr> -->
                </tbody>

              </table>
            </div>
            <table class="dashboard-report-footer">
              <tr>
                <td width="15%">{{$t('monitor.confirm')}}：</td>
                <td width="15%">{{$t('monitor.review')}}：</td>
                <td width="15%">{{$t('monitor.tabulation')}}：</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="report-border-gap"></div>

          <div id="dashboard-line-pass-report" class="dashboard-report-border">
            <table class="dashboard-report-title-table">
              <tr>
                <td width="25%">
                  <button type="button" class="btn btn-default report-export-btn"
                          @click="onExportReport('dashboard-line-pass-report')"><span
                    class="glyphicon glyphicon-export"></span> {{$t('monitor.export')}}
                  </button>
                </td>
                <td width="50%" class="dashboard-report-title-cell">【{{$t('monitor.lineFpyChart')}}】</td>
                <td width="25%">{{$t('monitor.tableDate')}}：<span class="report-title-date-txt">0000-00-00 00:00:00</span></td>
              </tr>
              <tr>
                <td width="25%"></td>
                <td width="50%" class="dashboard-report-date-cell">{{$t('monitor.dateRange')}}：<span class="report-title-date-range-txt">0000-00-00 00:00:00 ～ 0000-00-00 00:00:00</span>
                </td>
                <td width="25%">{{$t('monitor.page')}}：<span class="report-title-pager-txt">1 / 1</span></td>
              </tr>
            </table>
            <div class="dashboard-report-total-border">
              <table class="dashboard-report-total-table">
                <td width="20%">{{$t('monitor.lineNum')}}：<span class="report-total-batch-txt">-</span></td>
                <!-- <td width="20%">{{$t('monitor.sumGoodProdNum')}}：<span class="report-total-pass-txt">-</span></td> -->
                <td width="15%">{{$t('monitor.fpy')}}（%）：<span class="report-total-fpy-txt">-</span></td>
                <td width="15%"></td>
                <td width="30%"></td>
              </table>
            </div>
            <div id="dashboard-report-chart-pqc-2" class="dashboard-report-chart-div"
                 style="height: 520px;width: 500px">

            </div>
            <div class="dashboard-report-datas-div" style="display: none;">
              <table class="dashboard-report-datas-table">
                <thead>
                <tr class="report-data-thead">
                  <th>{{$t('monitor.prodLine')}}</th>
                  <th>{{$t('monitor.putProdNum')}}</th>
                  <th>{{$t('monitor.goodProdNum')}}</th>
                  <th>{{$t('monitor.fpy')}}%</th>
                  <th class="table-gap"></th>
                  <th>{{$t('monitor.prodLine')}}</th>
                  <th>{{$t('monitor.putProdNum')}}</th>
                  <th>{{$t('monitor.goodProdNum')}}</th>
                  <th>{{$t('monitor.fpy')}}%</th>
                </tr>
                </thead>
                <tbody class="report-datas-body">
                <!-- <tr>
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
                          </tr> -->
                </tbody>

              </table>
            </div>
            <table class="dashboard-report-footer">
              <tr>
                <td width="15%">{{$t('monitor.confirm')}}：</td>
                <td width="15%">{{$t('monitor.review')}}：</td>
                <td width="15%">{{$t('monitor.tabulation')}}：</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="report-border-gap"></div>

          <div id="dashboard-pex-report" class="dashboard-report-border">
            <table class="dashboard-report-title-table">
              <tr>
                <td width="25%">
                  <button type="button" class="btn btn-default report-export-btn"
                          @click="onExportReport('dashboard-pex-report')"><span
                    class="glyphicon glyphicon-export"></span> {{$t('monitor.export')}}
                  </button>
                </td>
                <td width="50%" class="dashboard-report-title-cell">【{{$t('monitor.pqcAbnChart')}}】</td>
                <td width="25%">{{$t('monitor.tableDate')}}：<span class="report-title-date-txt">0000-00-00 00:00:00</span></td>
              </tr>
              <tr>
                <td width="25%"></td>
                <td width="50%" class="dashboard-report-date-cell">{{$t('monitor.dateRange')}}：<span class="report-title-date-range-txt">0000-00-00 00:00:00 ～ 0000-00-00 00:00:00</span>
                </td>
                <td width="25%">{{$t('monitor.page')}}：<span class="report-title-pager-txt">1 / 1</span></td>
              </tr>
            </table>
            <div class="dashboard-report-total-border">
              <table class="dashboard-report-total-table">
                <td width="20%">{{$t('monitor.sumInspectNum')}}：<span class="report-total-sampling-txt">-</span></td>
                <td width="15%">{{$t('monitor.sumAbnNum')}}：<span class="report-total-batch-txt">-</span></td>
                <td width="15%">{{$t('monitor.proportion')}}：<span class="report-total-ex-txt">-</span></td>
                <td width="15%"></td>
                <td width="20%"></td>
              </table>
            </div>
            <div id="dashboard-report-chart-pqc-3" class="dashboard-report-chart-div"
                 style="height: 270px;width: 500px">

            </div>
            <div class="dashboard-report-datas-div">
              <table class="dashboard-report-datas-table">
                <thead>
                <tr class="report-data-thead">
                  <th>{{$t('monitor.productName')}}</th>
                  <th>{{$t('monitor.inspectNum')}}</th>
                  <th>{{$t('monitor.abnNum')}}</th>
                  <th>{{$t('monitor.proportion')}}(%)</th>
                  <th class="table-gap"></th>
                  <th>{{$t('monitor.productName')}}</th>
                  <th>{{$t('monitor.inspectNum')}}</th>
                  <th>{{$t('monitor.abnNum')}}</th>
                  <th>{{$t('monitor.proportion')}}(%)</th>
                </tr>
                </thead>
                <tbody class="report-datas-body">
                <!-- <tr>
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
                          </tr> -->
                </tbody>

              </table>
            </div>
            <table class="dashboard-report-footer">
              <tr>
                <td width="15%">{{$t('monitor.confirm')}}：</td>
                <td width="15%">{{$t('monitor.review')}}：</td>
                <td width="15%">{{$t('monitor.tabulation')}}：</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="report-border-gap"></div>

          <div id="dashboard-blt-def-report" class="dashboard-report-border">
            <table class="dashboard-report-title-table">
              <tr>
                <td width="25%">
                  <button type="button" class="btn btn-default report-export-btn"
                          @click="onExportReport('dashboard-blt-def-report')"><span
                    class="glyphicon glyphicon-export"></span> {{$t('monitor.export')}}
                  </button>
                </td>
                <td width="50%" class="dashboard-report-title-cell">【{{$t('monitor.defectsDistributionChart')}}】</td>
                <td width="25%">{{$t('monitor.tableDate')}}：<span class="report-title-date-txt">0000-00-00 00:00:00</span></td>
              </tr>
              <tr>
                <td width="25%"></td>
                <td width="50%" class="dashboard-report-date-cell">{{$t('monitor.dateRange')}}：<span class="report-title-date-range-txt">0000-00-00 00:00:00 ～ 0000-00-00 00:00:00</span>
                </td>
                <td width="25%">{{$t('monitor.page')}}：<span class="report-title-pager-txt">1 / 1</span></td>
              </tr>
            </table>
            <div class="dashboard-report-total-border">
              <table class="dashboard-report-total-table">
                <!--<td width="20%">{{$t('monitor.sumBatchNum')}}：<span class="report-total-batch-txt">-</span></td>-->
                <td width="20%">{{$t('monitor.samplingNum')}}：<span class="report-total-sampling-txt">-</span></td>
                <td width="20%">{{$t('monitor.defectsnum')}}：<span class="report-total-defect-txt">-</span></td>
                <td width="15%">{{$t('monitor.statisticalMethods')}}：<span class="report-total-group-txt">{{$t('monitor.defectName')}}</span></td>
                <td width="15%"><span class="report-total-bv-txt"></span></td>
                <td width="10%"><span class="report-total-group-txt"></span></td>
              </table>
            </div>
            <div id="dashboard-report-chart-pqc-4" class="dashboard-report-chart-div"
                 style="height: 520px;width: 500px">

            </div>

            <table class="dashboard-report-footer">
              <tr>
                <td width="15%">{{$t('monitor.confirm')}}：</td>
                <td width="15%">{{$t('monitor.review')}}：</td>
                <td width="15%">{{$t('monitor.tabulation')}}：</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="report-border-gap"></div>
        </div>


        <div id="oqc-report" class="iqis-report-tab" v-show="isChartShow == true && buzType == 'oqc'">
          <div id="dashboard-oqc-rr-report" class="dashboard-report-border">
            <table class="dashboard-report-title-table">
              <tr>
                <td width="25%">
                  <button type="button" class="btn btn-default report-export-btn"
                          @click="onExportReport('dashboard-oqc-rr-report')"><span
                    class="glyphicon glyphicon-export"></span> {{$t('monitor.export')}}
                  </button>
                </td>
                <td width="50%" class="dashboard-report-title-cell">【{{$t('monitor.oqcAllowYieldChart')}}】</td>
                <td width="25%">{{$t('monitor.tableDate')}}：<span class="report-title-date-txt">0000-00-00 00:00:00</span></td>
              </tr>
              <tr>
                <td width="25%"></td>
                <td width="50%" class="dashboard-report-date-cell">{{$t('monitor.dateRange')}}：<span class="report-title-date-range-txt">0000-00-00 00:00:00 ～ 0000-00-00 00:00:00</span>
                </td>
                <td width="25%">{{$t('monitor.page')}}：<span class="report-title-pager-txt">1 / 1</span></td>
              </tr>
            </table>
            <div class="dashboard-report-total-border">
              <table class="dashboard-report-total-table">
                <td width="20%">{{$t('monitor.batchNum')}}：<span class="report-total-batch-txt">-</span></td>
                <td width="20%">{{$t('monitor.qualifiedBatchNum')}}：<span class="report-total-pass-txt">-</span></td>
                <td width="20%">{{$t('monitor.allowYield')}}（%）：<span class="report-total-rr-txt">-</span></td>
                <td width="40%"><span class="report-total-group-txt"></span></td>
              </table>
            </div>
            <div id="dashboard-report-chart-oqc-1" class="dashboard-report-chart-div"
                 style="height: 320px;width: 500px">

            </div>
            <div class="dashboard-report-datas-div">
              <table class="dashboard-report-datas-table">
                <thead>
                <tr class="report-data-thead">
                  <th>{{$t('monitor.date')}}</th>
                  <th>{{$t('monitor.batchNum')}}</th>
                  <th>{{$t('monitor.qualifiedBatchNum')}}</th>
                  <th>{{$t('monitor.allowYield')}}%</th>
                  <th class="table-gap"></th>
                  <th>{{$t('monitor.date')}}</th>
                  <th>{{$t('monitor.batchNum')}}</th>
                  <th>{{$t('monitor.qualifiedBatchNum')}}</th>
                  <th>{{$t('monitor.allowYield')}}%</th>
                </tr>
                </thead>
                <tbody class="report-datas-body">
                <!-- <tr>
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
                          </tr> -->
                </tbody>

              </table>
            </div>
            <table class="dashboard-report-footer">
              <tr>
                <td width="15%">{{$t('monitor.confirm')}}：</td>
                <td width="15%">{{$t('monitor.review')}}：</td>
                <td width="15%">{{$t('monitor.tabulation')}}：</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="report-border-gap"></div>

          <div id="dashboard-oqc-ex-report" class="dashboard-report-border">
            <table class="dashboard-report-title-table">
              <tr>
                <td width="25%">
                  <button type="button" class="btn btn-default report-export-btn"
                          @click="onExportReport('dashboard-oqc-ex-report')"><span
                    class="glyphicon glyphicon-export"></span> {{$t('monitor.export')}}
                  </button>
                </td>
                <td width="50%" class="dashboard-report-title-cell">【{{$t('monitor.oqcAbnChart')}}】</td>
                <td width="25%">{{$t('monitor.tableDate')}}：<span class="report-title-date-txt">0000-00-00 00:00:00</span></td>
              </tr>
              <tr>
                <td width="25%"></td>
                <td width="50%" class="dashboard-report-date-cell">{{$t('monitor.dateRange')}}：<span class="report-title-date-range-txt">0000-00-00 00:00:00 ～ 0000-00-00 00:00:00</span>
                </td>
                <td width="25%">{{$t('monitor.page')}}：<span class="report-title-pager-txt">1 / 1</span></td>
              </tr>
            </table>
            <div class="dashboard-report-total-border">
              <table class="dashboard-report-total-table">
                <td width="20%">{{$t('monitor.sumOqcNum')}}：<span class="report-total-batch-txt">-</span></td>
                <td width="20%">{{$t('monitor.sumInspectNum')}}：<span class="report-total-exam-txt">-</span></td>
                <td width="20%">{{$t('monitor.sumAbnNum')}}：<span class="report-total-ex-txt">-</span></td>
                <td width="40%"><span class="report-total-group-txt"></span></td>
              </table>
            </div>
            <div id="dashboard-report-chart-oqc-2" class="dashboard-report-chart-div"
                 style="height: 320px;width: 500px">

            </div>
            <div class="dashboard-report-datas-div">
              <table class="dashboard-report-datas-table">
                <thead>
                <tr class="report-data-thead">
                  <th>{{$t('monitor.productNo')}}</th>
                  <th>{{$t('monitor.oqcNum')}}</th>
                  <th>{{$t('monitor.inspectNum')}}</th>
                  <th>{{$t('monitor.abnNum')}}</th>
                  <th class="table-gap"></th>
                  <th>{{$t('monitor.productNo')}}</th>
                  <th>{{$t('monitor.oqcNum')}}</th>
                  <th>{{$t('monitor.inspectNum')}}</th>
                  <th>{{$t('monitor.abnNum')}}</th>
                </tr>
                </thead>
                <tbody class="report-datas-body">
                <!-- <tr>
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
                          </tr> -->
                </tbody>

              </table>
            </div>
            <table class="dashboard-report-footer">
              <tr>
                <td width="15%">{{$t('monitor.confirm')}}：</td>
                <td width="15%">{{$t('monitor.review')}}：</td>
                <td width="15%">{{$t('monitor.tabulation')}}：</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="report-border-gap"></div>
        </div>


        <div id="cc-report" class="iqis-report-tab" v-show="isChartShow == true && buzType == 'cc'">

          <div id="dashboard-cc-report" class="dashboard-report-border">
            <table class="dashboard-report-title-table">
              <tr>
                <td width="25%">
                  <button type="button" class="btn btn-default report-export-btn"
                          @click="onExportReport('dashboard-cc-report')"><span
                    class="glyphicon glyphicon-export"></span> {{$t('monitor.export')}}
                  </button>
                </td>
                <td width="50%" class="dashboard-report-title-cell">【{{$t('monitor.ccProdChart')}}】</td>
                <td width="25%">{{$t('monitor.tableDate')}}：<span class="report-title-date-txt">0000-00-00 00:00:00</span></td>
              </tr>
              <tr>
                <td width="25%"></td>
                <td width="50%" class="dashboard-report-date-cell">{{$t('monitor.dateRange')}}：<span class="report-title-date-range-txt">0000-00-00 00:00:00 ～ 0000-00-00 00:00:00</span>
                </td>
                <td width="25%">{{$t('monitor.page')}}：<span class="report-title-pager-txt">1 / 1</span></td>
              </tr>
            </table>
            <div class="dashboard-report-total-border">
              <table class="dashboard-report-total-table">
                <td width="20%">{{$t('monitor.customerNum')}}：<span class="report-total-exam-txt">-</span></td>
                <td width="20%">{{$t('monitor.sumComplaintNum')}}：<span class="report-total-batch-txt">-</span></td>
                <td width="20%"><span class="report-total-ex-txt"></span></td>
                <td width="40%"><span class="report-total-group-txt"></span></td>
              </table>
            </div>
            <div id="dashboard-report-chart-cc-1" class="dashboard-report-chart-div" style="height: 320px;width: 500px">

            </div>
            <div class="dashboard-report-datas-div">
              <table class="dashboard-report-datas-table">
                <thead>
                <tr class="report-data-thead">
                  <th>{{$t('monitor.productName')}}</th>
                  <th>{{$t('monitor.complaintNum')}}</th>
                  <th class="table-gap"></th>
                  <th>{{$t('monitor.productName')}}</th>
                  <th>{{$t('monitor.complaintNum')}}</th>
                </tr>
                </thead>
                <tbody class="report-datas-body">
                <!-- <tr>
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
                          </tr> -->
                </tbody>

              </table>
            </div>
            <table class="dashboard-report-footer">
              <tr>
                <td width="15%">{{$t('monitor.confirm')}}：</td>
                <td width="15%">{{$t('monitor.review')}}：</td>
                <td width="15%">{{$t('monitor.tabulation')}}：</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="report-border-gap"></div>

          <div id="dashboard-blt-cc-report" class="dashboard-report-border">
            <table class="dashboard-report-title-table">
              <tr>
                <td width="25%">
                  <button type="button" class="btn btn-default report-export-btn"
                          @click="onExportReport('dashboard-blt-cc-report')"><span
                    class="glyphicon glyphicon-export"></span> {{$t('monitor.export')}}
                  </button>
                </td>
                <td width="50%" class="dashboard-report-title-cell">【{{$t('monitor.complaintProblemChart')}}】</td>
                <td width="25%">{{$t('monitor.tableDate')}}：<span class="report-title-date-txt">0000-00-00 00:00:00</span></td>
              </tr>
              <tr>
                <td width="25%"></td>
                <td width="50%" class="dashboard-report-date-cell">{{$t('monitor.dateRange')}}：<span class="report-title-date-range-txt">0000-00-00 00:00:00 ～ 0000-00-00 00:00:00</span>
                </td>
                <td width="25%">{{$t('monitor.page')}}：<span class="report-title-pager-txt">1 / 1</span></td>
              </tr>
            </table>
            <div class="dashboard-report-total-border">
              <table class="dashboard-report-total-table">
                <td width="20%">{{$t('monitor.sumBatchNum')}}：<span class="report-total-batch-txt">-</span></td>
                <td width="20%">{{$t('monitor.defectsnum')}}:<span class="report-total-defect-txt">-</span></td>
                <td width="15%">{{$t('monitor.statisticalMethods')}}：<span class="report-total-group-txt">{{$t('monitor.defectName')}}</span></td>
                <td width="15%"><span class="report-total-bv-txt"></span></td>
                <td width="20%"><span class="report-total-sampling-txt"></span></td>
                <td width="10%"><span class="report-total-group-txt"></span></td>
              </table>
            </div>
            <div id="dashboard-report-chart-cc-2" class="dashboard-report-chart-div" style="height: 520px;width: 500px">

            </div>

            <table class="dashboard-report-footer">
              <tr>
                <td width="15%">{{$t('monitor.confirm')}}：</td>
                <td width="15%">{{$t('monitor.review')}}：</td>
                <td width="15%">{{$t('monitor.tabulation')}}：</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="report-border-gap"></div>


          <div id="dashboard-cc-pie-report" class="dashboard-report-border">
            <table class="dashboard-report-title-table">
              <tr>
                <td width="25%">
                  <button type="button" class="btn btn-default report-export-btn"
                          @click="onExportReport('dashboard-cc-pie-report')"><span
                    class="glyphicon glyphicon-export"></span> {{$t('monitor.export')}}
                  </button>
                </td>
                <td width="50%" class="dashboard-report-title-cell">【{{$t('monitor.complaintPieChart')}}】</td>
                <td width="25%">{{$t('monitor.tableDate')}}：<span class="report-title-date-txt">0000-00-00 00:00:00</span></td>
              </tr>
              <tr>
                <td width="25%"></td>
                <td width="50%" class="dashboard-report-date-cell">{{$t('monitor.dateRange')}}：<span class="report-title-date-range-txt">0000-00-00 00:00:00 ～ 0000-00-00 00:00:00</span>
                </td>
                <td width="25%">{{$t('monitor.page')}}：<span class="report-title-pager-txt">1 / 1</span></td>
              </tr>
            </table>
            <div class="dashboard-report-total-border">
              <table class="dashboard-report-total-table">
                <td width="20%">{{$t('monitor.customerNum')}}：<span class="report-total-exam-txt"></span></td>
                <td width="20%">{{$t('monitor.sumComplaintNum')}}：<span class="report-total-batch-txt">-</span></td>
                <td width="20%"><span class="report-total-ex-txt"></span></td>
                <td width="40%"><span class="report-total-group-txt"></span></td>
              </table>
            </div>
            <div id="dashboard-report-chart-cc-3" class="dashboard-report-chart-div" style="height: 320px;width: 500px">

            </div>
            <div class="dashboard-report-datas-div">
              <table class="dashboard-report-datas-table">
                <thead>
                <tr class="report-data-thead">
                  <th>{{$t('monitor.customerName')}}</th>
                  <th>{{$t('monitor.complaintNum')}}</th>
                  <th class="table-gap"></th>
                  <th>{{$t('monitor.customerName')}}</th>
                  <th>{{$t('monitor.complaintNum')}}</th>
                </tr>
                </thead>
                <tbody class="report-datas-body">
                <!-- <tr>
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
                          </tr> -->
                </tbody>

              </table>
            </div>
            <table class="dashboard-report-footer">
              <tr>
                <td width="15%">{{$t('monitor.confirm')}}：</td>
                <td width="15%">{{$t('monitor.review')}}：</td>
                <td width="15%">{{$t('monitor.tabulation')}}：</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div class="report-border-gap"></div>

        </div>


      </div>
    </div> <!-- end iqis-page-content -->

    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
  </div>
</template>

<script>
  import $ from 'jquery'
  import ReportDateSelector from '../../components/reportDateSelector/ReportDateSelector'
  import echarts from 'echarts'
  import ICol from "iview/src/components/grid/col";
  import reportConfig from '../statistic/statisticConfig';
  import numeral from 'numeral';
  import html2canvas from 'html2canvas';
  import jspdf from 'jspdf';

  var colorList = reportConfig.colorList;
  var pieColorList = reportConfig.pieColorList;
  export default {
    data() {
      let vm = this;

      return {
        chartType: '直方图',
        reportTitleTxt: '', //报表title
        reportDateTxt: '', //报表{{$t('monitor.date')}}
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
          manufacturerId: null
        },
        reportConfig: reportConfig,
        buzNameMap: reportConfig.buzNameMap,
        buzParams: reportConfig.buzParams,
        // histogramChart:null,
        report_iqc_1: null,
        report_iqc_2: null,
        report_iqc_3: null,
        report_pqc_1: null,
        report_pqc_2: null,
        report_pqc_3: null,
        report_pqc_4: null,
        report_oqc_1: null,
        report_oqc_2: null,
        report_cc_1: null,
        report_cc_2: null,
        report_cc_3: null,

        isChartShow: false,
        collectList: [],
        selectRows: [],
        selectorsData: {
          productList: [],
          productTypeList: [],
          manufacturerList: []
        }
      }//end return

    },//end  data
    computed: {
      custom() {
        if (this.statisticDays.daysRange == '-1') {
          return {opacity: 1}
        } else {
          return {opacity: 0}
        }
      }
    },
    created(){
    },
    methods: {
      initChart() {
        // this.histogramChart = echarts.init(this.$refs.histogramChart);

        this.report_iqc_1 = echarts.init(document.getElementById("dashboard-report-chart-iqc-1"));
        this.report_iqc_2 = echarts.init(document.getElementById("dashboard-report-chart-iqc-2"));
        this.report_iqc_3 = echarts.init(document.getElementById("dashboard-report-chart-iqc-3"));

        this.report_pqc_1 = echarts.init(document.getElementById("dashboard-report-chart-pqc-1"));
        this.report_pqc_2 = echarts.init(document.getElementById("dashboard-report-chart-pqc-2"));
        this.report_pqc_3 = echarts.init(document.getElementById("dashboard-report-chart-pqc-3"));
        this.report_pqc_4 = echarts.init(document.getElementById("dashboard-report-chart-pqc-4"));

        this.report_oqc_1 = echarts.init(document.getElementById("dashboard-report-chart-oqc-1"));
        this.report_oqc_2 = echarts.init(document.getElementById("dashboard-report-chart-oqc-2"));

        this.report_cc_1 = echarts.init(document.getElementById("dashboard-report-chart-cc-1"));
        this.report_cc_2 = echarts.init(document.getElementById("dashboard-report-chart-cc-2"));
        this.report_cc_3 = echarts.init(document.getElementById("dashboard-report-chart-cc-3"));


      },
      onCustomDateChange(d) {
        this.statisticDays.custom[0] = this.$iqis.utils.date.toDate(d[0]);
        this.statisticDays.custom[1] = this.$iqis.utils.date.toDate(d[1]);
      },
      onBuildReport() {

        let time_end = this.$iqis.utils.getDayEnd2();
        let time_start = this.$iqis.utils.getDayStart(1);
        let hourOffset = this.$iqis.utils.__hour_offset;
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
              title: i18n.t('monitor.pleaseChooseTime'),
              desc: ''
            });
            return;
          }
        }
        this.statisticDays.startTimestamp = time_start;
        this.statisticDays.endTimestamp = time_end;

        if (this.buzType == "pqc") {
          this.refreshPqc();
        } else if (this.buzType == "oqc") {
          this.refreshOqc();
        } else if (this.buzType == "cc") {
          this.refreshCc();
        } else {
          this.refreshIqc();
        }
      },
      onExportReport(borderId) {//border div的ID
        var reportBorder = $("#" + borderId);
        // 添加统一的外层
        var content_html = "<div id=\"exam-report\" class=\"exam-report-border export-chart-preview\" style='background: #fff;width:1200px;'>" + reportBorder.html() + "</div>";
        var pageHead = "<div style='text-align: center;font-size: 11pt;font-weight: bold;'>" + $(".exam-report-title-txt").text() + "- "
          + reportBorder.find(".report-title-date-range-txt").text() + "&nbsp;<td width=\"25%\">{{$t('monitor.tableDate')}}：<span class=\"\">"
          + reportBorder.find(".report-title-date-txt").text() + "</span></td>&nbsp;&nbsp;{{$t('monitor.page')}}：<span class='report-title-pager-txt'></span></div>";
        var w = this.$iqis.utils.printHtml(content_html, pageHead, ["static/css/export-chart-preview.css"]);


        var chartId = reportBorder.find(".dashboard-report-chart-div").attr("id");

        var chart_ = echarts.getInstanceByDom(document.getElementById(chartId));

        var dataUrl = chart_.getDataURL({type: "png", pixelRatio: 2, excludeComponents: ["toolbox"]});

        w.iqis_param_imgId = "chartImage";
        w.iqis_param_imgDataUrl = dataUrl;
        w.iqis_param_chartId = chartId;

        w.iqis_param_footer = ".dashboard-report-footer";
        w.iqis_param_table = ".dashboard-report-datas-table";

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "static/js/printHelper.js";
        w.document.getElementsByTagName('head')[0].appendChild(script);

      },
      refreshIqc() {
        //window.IQIS.mask(true);
        let that = this;
        let colorList = reportConfig.colorList;
        var hourOffset = this.$iqis.utils.__hour_offset;
        let time_start = this.statisticDays.startTimestamp;
        let time_end = this.statisticDays.endTimestamp;
        let groupType = time_end - time_start > 86400000 ? 0 : 1;


        let reportDateTxt = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        let reportDateRangeTxt
          = (new Date(time_start)).Format("yyyy-MM-dd hh:mm:ss") + " ～ " + (new Date(time_end)).Format("yyyy-MM-dd hh:mm:ss");
        $("#iqc-report .report-title-date-txt").text(reportDateTxt);
        $("#iqc-report .report-title-date-range-txt").text(reportDateRangeTxt);

        //diagram/report/iqc/dispatcher?business=acceptance_rate&by=byProduct&hourOffset=8&start=1519660800000&end=1522252799999&productTypeId=&productId=&manufacturerId=
        //    Request Method: GET
        var ys_params = {
          business: "acceptance_rate",
          by: "byTime",
          hourOffset: hourOffset,
          start: time_start,
          end: time_end
        };

        this.$http.get("/diagram/report/iqc/dispatcher", {params: ys_params}).then(function (resp) {
          // window.IQIS.mask(false);
          // alert(1);
          if (resp.data) {
            // alert(2)
            var xLabels = [];
            var datas = [];

            var minY = 100;
            var maxY = 100;

            var totalCount = 0;
            var totalPass = 0;


            var tbody = $("#dashboard-rr-report .report-datas-body");
            tbody.empty();
            $(resp.data.list).each(function (index, dataItem) {
              var label = dataItem.name;
              var value = dataItem.rate;

              totalCount += dataItem.total;
              totalPass += dataItem.pass;

              xLabels.push(label);
              datas.push(value);

              var rowIndex = Math.floor(index / 2);
              if (rowIndex >= tbody.children().length) {
                tbody.append("<tr><td></td><td></td><td></td><td></td><td class='table-gap'></td><td></td><td></td><td></td><td></td></tr>");
              }
              var tr = $(tbody.children()[rowIndex]);

              if (index % 2 == 0) {
                $(tr.children()[0]).text(label);
                $(tr.children()[1]).text(dataItem.total);
                $(tr.children()[2]).text(dataItem.pass);
                $(tr.children()[3]).text(dataItem.rate);
              } else {
                $(tr.children()[5]).text(label);
                $(tr.children()[6]).text(dataItem.total);
                $(tr.children()[7]).text(dataItem.pass);
                $(tr.children()[8]).text(dataItem.rate);
              }
            });
            $("#dashboard-rr-report .report-total-batch-txt").text(totalCount);
            $("#dashboard-rr-report .report-total-pass-txt").text(totalPass);

            /* var totalRRNum = numeral(totalPass / totalCount * 100);
            var rateStr = totalRRNum.format('0.00') + "%"; */
            if(totalCount == 0 || totalPass == 0){
              rateStr = 0
            }else{
              var totalRRNum = (totalPass / totalCount * 100);
              var rateStr = Math.floor(totalRRNum * 100) / 100;
            }
            

            $("#dashboard-rr-report .report-total-rr-txt").text(rateStr);

            if (maxY == 0) {
              maxY = 100;
            } else {
              // maxY = Math.ceil(maxY / 10) * 10 + 10;
              maxY = Math.ceil(maxY / 10) * 10;
            }

            if (minY == 100) {
              minY = 0;
            } else {
              // minY = Math.floor(minY / 10) * 10 - 10;
              minY = Math.floor(minY / 10) * 10;
              minY = Math.max(0, minY);
            }

            for (var i3 = 0; i3 < datas.length; i3++) {
              if (datas[i3] == 0) {
                datas[i3] = minY;
              }
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
                    //    showHtm += name+ '<br />' + text + ' ： 无数据' ;
                    // }else{
                    showHtm += name + '<br />' + text + ' ： ' + value + '%';
                    //}
                  }
                  return showHtm;
                }
              }//'{b}<br/>{a}:{c}%'
              ,
              grid: {
                left: '20px',
                right: '50px',
                bottom: '12px',
                top: '14px',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xLabels
              },
              yAxis: {
                type: 'value',
                min: minY,
                max: maxY,
                scale: true,
                axisLabel: {
                  formatter: function (value, index) {
                    if (index == 0) {
                      return "0%";
                    } else {
                      return value + '%';
                    }
                  }
                }
              },
              color: ["#95F05D", "#C9690C", "#975FE4", "#FFD736", "#5DA0F0", "#21A4BF","#2981CC","#FA9737","#EC63F2","#FAD337","#29CCCC","#B10DB9","#F2637B","#A51E34"],
              series: [
                {
                  name: i18n.t('monitor.iqcAllowYield'),
                  type: 'line',
                  color:'#418FEE',
                  stack: i18n.t('monitor.allowYield'),
                  showAllSymbol: true,
                  markLine: {
                    symbol: "none",
                    lineStyle: {
                      color: '#888',
                      type: 'dotted',
                      width: 2
                    },
                    data: [{
                      name: '100%',
                      yAxis: 100
                    }]

                  },
                  data: datas
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            that.report_iqc_1.setOption(option, false, false, true);

            $(window).resize();
          }
        });

        var ycjs_params = {
          business: "abnormal_count",
          by: "byProduct",
          hourOffset: hourOffset,
          start: time_start,
          end: time_end
        };
        this.$http.get("/diagram/report/iqc/dispatcher", {params: ycjs_params}).then(function (resp) {
          // alert(JSON.stringify(resp.data))
          if (resp.data) {
            // alert(4)
            var xLabels = [];
            var datas = [];

            var pac_totalCount = 0;
            var pac_totalAbnormal = 0;
            var pac_totalSamplingCount = 0;

            var tbody = $("#dashboard-ex-report .report-datas-body");
            tbody.empty();
            $(resp.data.list).each(function (index, dataItem) {
              var label = dataItem.name;

              let value = dataItem.count;

              pac_totalCount += dataItem.batchCount;
              pac_totalAbnormal += dataItem.count;
              pac_totalSamplingCount += dataItem.total;

              xLabels.push(label);
              datas.push(value);

              var rowIndex = Math.floor(index / 2);
              if (rowIndex >= tbody.children().length) {
                tbody.append("<tr><td></td><td></td><td></td><td></td><td class='table-gap'></td><td></td><td></td><td></td><td></td></tr>");
              }
              var tr = $(tbody.children()[rowIndex]);

              if (index % 2 == 0) {
                $(tr.children()[0]).text(label);
                $(tr.children()[1]).text(dataItem.batchCount);
                $(tr.children()[2]).text(dataItem.total);
                $(tr.children()[3]).text(dataItem.count);
              } else {
                $(tr.children()[5]).text(label);
                $(tr.children()[6]).text(dataItem.batchCount);
                $(tr.children()[7]).text(dataItem.total);
                $(tr.children()[8]).text(dataItem.count);
              }
            });

            $("#dashboard-ex-report .report-total-batch-txt").text(pac_totalCount);
            $("#dashboard-ex-report .report-total-exam-txt").text(pac_totalSamplingCount);
            $("#dashboard-ex-report .report-total-ex-txt").text(pac_totalAbnormal);

            // var arr = datas
            // arr.sort(function(a,b){
            //     return b-a
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
                    //    showHtm += name+ '<br />' + text + ' ： 无数据' ;
                    // }else{
                    showHtm += name + '<br />' + text + ' ： ' + value + '';
                    //}
                  }
                  return showHtm;
                }
              },
              grid: {
                left: '12px',
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
              },
              series: [{
                barMaxWidth: '50',
                name: i18n.t('monitor.abnNum'),
                data: datas,
                //配置样式
                itemStyle: {
                  //通常情况下：
                  normal: {
                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    color: function (params) {
                      return colorList[params.dataIndex % colorList.length];
                    }
                  }
                },
                type: 'bar'
              }]
            };
            // 使用刚指定的配置项和数据显示图表。
            that.report_iqc_2.setOption(option, false, false, true);
            $(window).resize();
          }
        });

        var ycjs_m_params = {
          business: "abnormal_count",
          by: "byManufacturer",
          hourOffset: hourOffset,
          start: time_start,
          end: time_end
        };
        this.$http.get("/diagram/report/iqc/dispatcher", {params: ycjs_m_params}).then(function (resp) {

          if (resp.data) {
            var xLabels = [];
            var datas = [];

            var pmc_totalCount = 0;
            var pmc_totalAbnormal = 0;
            var pmc_totalSamplingCount = 0;


            var tbody = $("#dashboard-mf-report .report-datas-body");
            tbody.empty();
            $(resp.data.list).each(function (index, dataItem) {
              var label = dataItem.name;

              let value = dataItem.count;

              pmc_totalCount += dataItem.batchCount;
              pmc_totalAbnormal += dataItem.count;
              pmc_totalSamplingCount += dataItem.total;

              xLabels.push(label);
              datas.push(value);

              var rowIndex = Math.floor(index / 2);
              if (rowIndex >= tbody.children().length) {
                tbody.append("<tr><td></td><td></td><td></td><td></td><td class='table-gap'></td><td></td><td></td><td></td><td></td></tr>");
              }
              var tr = $(tbody.children()[rowIndex]);

              if (index % 2 == 0) {
                $(tr.children()[0]).text(label);
                $(tr.children()[1]).text(dataItem.batchCount);
                $(tr.children()[2]).text(dataItem.total);
                $(tr.children()[3]).text(dataItem.count);
              } else {
                $(tr.children()[5]).text(label);
                $(tr.children()[6]).text(dataItem.batchCount);
                $(tr.children()[7]).text(dataItem.total);
                $(tr.children()[8]).text(dataItem.count);
              }
            });
            let supplierCount = resp.data.list.length;
            // $("#dashboard-mf-report .report-total-batch-txt").text(pmc_totalCount);
            $("#dashboard-mf-report .report-total-batch-txt").text(supplierCount);//{{$t('monitor.supplierNum')}}量
            // $("#dashboard-mf-report .report-total-exam-txt").text(pmc_totalSamplingCount);
            $("#dashboard-mf-report .report-total-ex-txt").text(pmc_totalAbnormal);

            // var arr = datas;
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
                    //    showHtm += name+ '<br />' + text + ' ： 无数据' ;
                    // }else{
                    showHtm += name + '<br />' + text + ' ： ' + value + '';
                    //}
                  }
                  return showHtm;
                }
              },
              grid: {
                left: '12px',
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
              },
              series: [{
                barMaxWidth: '50',
                name: i18n.t('monitor.abnNum'),
                data: datas,
                //配置样式
                itemStyle: {
                  //通常情况下：
                  normal: {
                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    color: function (params) {
                      return colorList[params.dataIndex % colorList.length];
                    }
                  }
                },
                type: 'bar'
              }]
            };

            // 使用刚指定的配置项和数据显示图表。
            that.report_iqc_3.setOption(option, false, false, true);

            $(window).resize();
          }
        });
        this.isChartShow = true;
      },
      refreshPqc() {
        // window.IQIS.mask(true);
        let that = this;
        var hourOffset = this.$iqis.utils.__hour_offset;
        let time_start = this.statisticDays.startTimestamp;
        let time_end = this.statisticDays.endTimestamp;
        let groupType = time_end - time_start > 86400000 ? 0 : 1;

        $("#pqc-report .report-title-date-txt").text((new Date()).Format("yyyy-MM-dd hh:mm:ss"));
        $("#pqc-report .report-title-date-range-txt").text((new Date(time_start)).Format("yyyy-MM-dd hh:mm:ss") + " ～ " +
          (new Date(time_end)).Format("yyyy-MM-dd hh:mm:ss"));

        /**/

        var fpy_params = {
          business: "first_pass_yield",
          by: "byTime",
          hourOffset: hourOffset,
          start: time_start,
          end: time_end
        };
        this.$http.get("/diagram/report/pqc/dispatcher", {params: fpy_params}).then(function (resp) {
          // window.IQIS.mask(false);

          if (resp.data) {
            var xLabels = [];
            var datas = [];


            var pac_totalCount = 0;
            var pac_totalBad = 0;
            var pac_totalFpy = 0;

            var minY = 100;

            var tbody = $("#dashboard-pass-report .report-datas-body");
            tbody.empty();
            $(resp.data.list).each(function (index, dataItem) {
              var label = dataItem.name;
              if (groupType == 0) {
                xLabels.push(label.substr(5));
              } else {
                xLabels.push(label.substr(11));
              }
              datas.push(dataItem.fpy);

              var value = dataItem.fpy;

              if (value != 0) {
                minY = Math.min(value, minY);
              }

              pac_totalCount += dataItem.count;
              pac_totalBad += dataItem.bad;

              var rowIndex = Math.floor(index / 2);
              if (rowIndex >= tbody.children().length) {
                tbody.append("<tr><td></td><td></td><td></td><td></td><td class='table-gap'></td><td></td><td></td><td></td><td></td></tr>");
              }
              var tr = $(tbody.children()[rowIndex]);

              if (index % 2 == 0) {
                $(tr.children()[0]).text(label);
                $(tr.children()[1]).text(dataItem.count);
                $(tr.children()[2]).text(dataItem.count - dataItem.bad < 0 ? 0 : dataItem.count - dataItem.bad);
                $(tr.children()[3]).text(dataItem.fpy);
              } else {
                $(tr.children()[5]).text(label);
                $(tr.children()[6]).text(dataItem.count);
                $(tr.children()[7]).text(dataItem.count - dataItem.bad < 0 ? 0 : dataItem.count - dataItem.bad);
                $(tr.children()[8]).text(dataItem.fpy);
              }
            });

            if (minY == 100) {
              minY = 0;
            } else {
              minY = Math.floor(minY / 2) * 2 - 2;
              minY = Math.max(0, minY);
            }

            $("#dashboard-pass-report .report-total-batch-txt").text(pac_totalCount);
            $("#dashboard-pass-report .report-total-pass-txt").text(pac_totalCount - pac_totalBad);

           /*  var totalFpyNum = numeral((pac_totalCount - pac_totalBad) / pac_totalCount * 100);
            var fpyStr = totalFpyNum.format('0.00') + "%"; */
            if(pac_totalCount == 0 || pac_totalBad == 0){
              var fpyStr = 0
            }else{
              var totalFpyNum =(pac_totalCount - pac_totalBad) / pac_totalCount * 100;
              var fpyStr = Math.floor(totalFpyNum * 100) / 100;
            }
            $("#dashboard-pass-report .report-total-fpy-txt").text(fpyStr);

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

                    if (!value) {
                      showHtm += name + '<br />' + text + ' ： 0';
                    } else {
                      showHtm += name + '<br />' + text + ' ： ' + value + '%';
                    }
                  }
                  return showHtm;
                }
              }//'{b}<br/>{a}:{c}%'
              ,
              grid: {
                left: '15px',
                right: '30px',
                bottom: '3px',
                top: '20px',
                containLabel: true
              },

              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xLabels
              },
              yAxis: {
                type: 'value',
                min: minY,
                scale: true,
                axisLabel: {
                  formatter: function (value, index) {
                    if (index == 0) {
                      return "0%";
                    } else {
                      return value + '%';
                    }
                  }
                }
              },
              color:'#418FEE',
              series: [
                {
                  name: i18n.t('monitor.directRate'),
                  type: 'line',
                  color:'#418FEE',
                  stack: i18n.t('monitor.sumNum'),
                  showAllSymbol: true,
                  /* label: {
                    show: true,
                    position: 'bottom'
                  }, */
                  markLine: {
                    symbol: "none",
                    lineStyle: {
                      color: '#888',
                      type: 'dotted',
                      width: 2
                    },
                    data: [{
                      name: '100%',
                      yAxis: 100
                    }]

                  },
                  data: datas
                }
              ]
            };
            that.report_pqc_1.clear();
            // 使用刚指定的配置项和数据显示图表。
            that.report_pqc_1.setOption(option, false, false, true);

            $(window).resize();
          }
        });

        this.$http.get("/diagram/prod-line/first-pass-yield", {
          params: {
            hourOffset: hourOffset,
            start: time_start,
            end: time_end,
            groupType: groupType
          }
        }).then(function (resp) {
          // window.IQIS.mask(false);
          if (resp.data) {
            var xLabels = [];

            var series = [];

            var minY = 100;

            var pac_totalCount = 0;
            var pac_totalBad = 0;

            var initLabelFlag = false;

            var tbody = $("#dashboard-line-pass-report .report-datas-body");
            tbody.empty();
            $(resp.data).each(function (index, dataItem) {

              if (!initLabelFlag) {
                initLabelFlag = true;

                for (var i = 0; i < dataItem.list.length; i++) {
                  xLabels.push(dataItem.list[i].date);
                }
              }
              pac_totalCount += dataItem.count;
              pac_totalBad += dataItem.bad;

              var lineSeries = {
                name: dataItem.prodLineName,
                type: 'line',
                // color:'#418FEE',
                stack: dataItem.prodLineId,
                showAllSymbol: true,
                data: []
              };

              for (var j = 0; j < dataItem.list.length; j++) {
                var fpy = dataItem.list[j].fpy;
                if (fpy != 0) {
                  minY = Math.min(fpy, minY);
                }
                if (fpy < 0) {
                  fpy = 0;
                }
                lineSeries.data.push(fpy);

              }
              series.push(lineSeries);
            });


            if (minY == 100) {
              minY = 0;
            } else {
              minY = Math.floor(minY / 10.0) * 10 - 10;
              minY = Math.max(0, minY);
            }

            $(series).each(function (a, b) {
              for (var i = 0; i < b.data.length; i++) {
                if (b.data[i] == 0) {
                  b.data[i] = minY;
                }
              }
            });

            $("#dashboard-line-pass-report .report-total-batch-txt").text(resp.data.length);
            $("#dashboard-line-pass-report .report-total-pass-txt").text(pac_totalCount - pac_totalBad);

           /*  var totalFpyNum = numeral((pac_totalCount - pac_totalBad) / pac_totalCount * 100);
            var fpyStr = totalFpyNum.format('0.00') + "%"; */
            
            if(pac_totalCount == 0 || pac_totalBad == 0){
              var fpyStr = 0
            }else{
              var totalFpyNum = (pac_totalCount - pac_totalBad) / pac_totalCount * 100;
            var fpyStr = Math.floor(totalFpyNum * 100) / 100;
            }
            
            $("#dashboard-line-pass-report .report-total-fpy-txt").text(fpyStr);
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

                    if (i == 0) {
                      showHtm += name + '<br />';
                    }
                    if (value == minY) {
                      showHtm += text + ' ： 0<br />';
                    } else {
                      showHtm += text + ' ： ' + value + '%' + '<br />';
                    }


                  }
                  return showHtm;
                }
              }//'{b}<br/>{a}:{c}%'
              ,
              grid: {
                left: '15px',
                right: '45px',
                bottom: '3px',
                top: '55px',
                containLabel: true
              },
              legend: {
                type: 'plain',
                orient: 'horizontal',
                left: 10,
                right: 10,
                top: 10
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xLabels
              },
              yAxis: {
                type: 'value',
                scale: true,
                min: minY,
                max: 100,
                splitNumber:10,//分段数
                // interval:20,
                axisLabel: {
                  formatter: function (value, index) {
                    if (index == 0) {
                      return "0%";
                    } else {
                      return value + '%';
                    }
                  }
                }
              },
              color: pieColorList,
              series: series
            };
            that.report_pqc_2.clear();
            // 使用刚指定的配置项和数据显示图表。
            that.report_pqc_2.setOption(option, false, false, true);


            $(window).resize();

          }
        });

        this.$http.get("/diagram/report/pqc/dispatcher", {
          params: {
            hourOffset: hourOffset,
            start: time_start,
            end: time_end,
            business: "abnormal_count",
            by: "byProduct"
          }
        }).then(function (resp) {


          if (resp.data) {
            var xLabels = [];
            var datas = [];

            var pac_totalRate = 0;
            var pac_totalAbnormal = 0;
            var pac_totalSamplingCount = 0;


            var tbody = $("#dashboard-pex-report .report-datas-body");
            tbody.empty();
            $(resp.data.list).each(function (index, dataItem) {
              var label = dataItem.name;

              var value = dataItem.total;

              pac_totalSamplingCount += dataItem.count;
              pac_totalAbnormal += dataItem.total;
              pac_totalRate = "100%";

              xLabels.push(label);
              datas.push(value);

              var rowIndex = Math.floor(index / 2);
              if (rowIndex >= tbody.children().length) {
                tbody.append("<tr><td></td><td></td><td></td><td></td><td class='table-gap'></td><td></td><td></td><td></td><td></td></tr>");
              }
              var tr = $(tbody.children()[rowIndex]);

              if (index % 2 == 0) {
                $(tr.children()[0]).text(label);
                $(tr.children()[1]).text(dataItem.total);
                $(tr.children()[2]).text(dataItem.count);
                $(tr.children()[3]).text(dataItem.rate);
              } else {
                $(tr.children()[5]).text(label);
                $(tr.children()[6]).text(dataItem.count);
                $(tr.children()[7]).text(dataItem.total);
                $(tr.children()[8]).text(dataItem.rate);
              }
            });

            $("#dashboard-pex-report .report-total-batch-txt").text(pac_totalSamplingCount);
            $("#dashboard-pex-report .report-total-sampling-txt").text(pac_totalAbnormal);
            $("#dashboard-pex-report .report-total-ex-txt").text(pac_totalRate);

            // var arr = datas;
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
                    //    showHtm += name+ '<br />' + text + ' ： 无数据' ;
                    // }else{
                    showHtm += name + '<br />' + text + ' ： ' + value + '';
                    //}
                  }
                  return showHtm;
                }
              },
              grid: {
                left: '3px',
                right: '26px',
                bottom: '3px',
                top: '14px',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                data: xLabels
              },
              yAxis: {
                type: 'value',
              },
              series: [{
                barMaxWidth: '50',
                name: i18n.t('monitor.abnNum'),
                data: datas,
                //配置样式
                itemStyle: {
                  //通常情况下：
                  normal: {
                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    color: function (params) {
                      return colorList[params.dataIndex % colorList.length];
                    }
                  }
                },
                type: 'bar'
              }]
            };
            // 使用刚指定的配置项和数据显示图表。
            that.report_pqc_3.setOption(option, false, false, true);

            $(window).resize();
          }
        });
        //duplicate
        // this.$http.get("/diagram/pqc/product/abnormal-count",{params:{hourOffset:hourOffset,start:time_start,end:time_end}}).then(function(resp){
        //     if (resp.data) {
        //         var xLabels = [];
        //         var datas = [];

        //         var pac_totalCount = 0;
        //         var pac_totalAbnormal = 0;
        //         var pac_totalSamplingCount = 0;


        //         var tbody = $("#dashboard-pex-report .report-datas-body");
        //         tbody.empty();
        //         $(resp.data).each(function (index,dataItem) {
        //             var label = dataItem.label;

        //             value = dataItem.count;

        //             pac_totalCount += dataItem.total;
        //             pac_totalAbnormal += dataItem.count;
        //             pac_totalSamplingCount += dataItem.samplingCount;

        //             xLabels.push(label);
        //             datas.push(value);

        //             var rowIndex = Math.floor(index/2);
        //             if(rowIndex >= tbody.children().length){
        //                 tbody.append("<tr><td></td><td></td><td></td><td></td><td class='table-gap'></td><td></td><td></td><td></td><td></td></tr>");
        //             }
        //             var tr = $(tbody.children()[rowIndex]);

        //             if(index%2 == 0){
        //                 $(tr.children()[0]).text(label);
        //                 $(tr.children()[1]).text(dataItem.total);
        //                 $(tr.children()[2]).text(dataItem.samplingCount);
        //                 $(tr.children()[3]).text(dataItem.count);
        //             }else{
        //                 $(tr.children()[5]).text(label);
        //                 $(tr.children()[6]).text(dataItem.total);
        //                 $(tr.children()[7]).text(dataItem.samplingCount);
        //                 $(tr.children()[8]).text(dataItem.count);
        //             }
        //         });

        //         $("#dashboard-pex-report .report-total-batch-txt").text(pac_totalCount);
        //         $("#dashboard-pex-report .report-total-sampling-txt").text(pac_totalSamplingCount);
        //         $("#dashboard-pex-report .report-total-ex-txt").text(pac_totalAbnormal);

        //         // 指定图表的配置项和数据
        //         var option =  {
        //             tooltip: {
        //                 trigger: 'axis',
        //                 formatter:function (params, ticket, callback) {
        //                     var showHtm="";
        //                     for(var i=0;i<params.length;i++){
        //                         //x轴名称
        //                         var name = params[i].axisValueLabel;
        //                         //名称
        //                         var text = params[i].seriesName;
        //                         //值
        //                         var value = params[i].data;

        //                         //if(!value || value == minY){
        //                         //    showHtm += name+ '<br />' + text + ' ： 无数据' ;
        //                         // }else{
        //                         showHtm += name+ '<br />' + text + ' ： ' + value+'';
        //                         //}
        //                     }
        //                     return showHtm;
        //                 }
        //             },
        //             grid: {
        //                 left: '3px',
        //                 right: '26px',
        //                 bottom: '3px',
        //                 top:'14px',
        //                 containLabel: true
        //             },
        //             xAxis: {
        //                 type: 'category',
        //                 data: xLabels
        //             },
        //             yAxis: {
        //                 type: 'value'
        //             },
        //             series: [{
        //                 name:i18n.t('monitor.abnNum'),
        //                 data: datas,
        //                 //配置样式
        //                 itemStyle: {
        //                     //通常情况下：
        //                     normal:{
        //                         //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
        //                         color: function (params){
        //                             return colorList[params.dataIndex%colorList.length];
        //                         }
        //                     }
        //                 },
        //                 type: 'bar'
        //             }]
        //         };

        //         // 使用刚指定的配置项和数据显示图表。
        //         that.report_pqc_3.setOption(option,false,false,true);

        //         $(window).resize();
        //     }
        // });

        ///diagram/report/pqc/dispatcher?business=defect&by=byDefect&hourOffset=8&start=1519833600000&end=1522425599999
        var blt_pqc_param = {
          business: "defect",
          by: "byDefect",
          hourOffset: hourOffset,
          start: time_start,
          end: time_end,
          productTypeId: '',
          productId: '',
          prodLineId: ''
        };
        this.$http.get("/diagram/report/pqc/dispatcher", {params: blt_pqc_param}).then(function (resp) {

          if (resp.data) {
            var xLabels = [];
            var datas = [];
            var datas2 = [];

            var total_batch = 0;
            var total_sampling = 0;
            var total_defect = 0;

            $(resp.data.list).each(function (index, item) {
              total_batch += item.batchCount;
              total_sampling += item.total;
              total_defect += item.count;
            });


            var unit_defect = 0;

            var showCount = 19;
            var other = 0;
            var preValue = 0;
            $(resp.data.list).each(function (index, item) {

              if (index < showCount) {
                xLabels.push(item.name);
                datas.push(item.count);

                var bv = numeral((item.count + preValue) / total_defect * 100);
                preValue += item.count;
                datas2.push(bv.format('0.00'));

              } else {
                other += item.count;
              }
            });

            if (other > 0) {
              xLabels.push(i18n.t('monitor.other'));
              datas.push(other);
              /* var bv = numeral((other + preValue) / total_defect * 100);
              datas2.push(bv.format('0.00')); */
              var bv = (other + preValue) / total_defect * 100;
              bv = Math.floor(bv * 100) / 100
              datas2.push(bv);
            }


//            $("#dashboard-blt-def-report .report-total-batch-txt").text(total_batch);
            $("#dashboard-blt-def-report .report-total-sampling-txt").text(total_sampling);
            $("#dashboard-blt-def-report .report-total-defect-txt").text(total_defect);

            total_defect = Math.max(1, total_defect);

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
                    //    showHtm += name+ '<br />' + text + ' ： 无数据' ;
                    // }else{
                    if (i == 0) {
                      showHtm += name + '<br />';
                    }
                    showHtm += text + ' ： ' + value + '<br />';
                    //}
                  }
                  return showHtm;
                }
              },
              grid: {
                left: '3px',
                right: '26px',
                bottom: '3px',
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
                min: 0,
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
                // max: total_defect
                max: 'dataMax'
              },
                {
                  type: 'value',
                  max: 100,
                  min: 0,
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
              color: ['#336699'],
              series: [{
                barMaxWidth: '50',
                name: i18n.t('monitor.abnNum'),
                data: datas,
                //配置样式
                itemStyle: {
                  //通常情况下：
                  normal: {
                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    color: function (params) {
                      return colorList[params.dataIndex % colorList.length];
                    }
                  }
                },
                showAllSymbol: true,
                label: {
                  show: true,
                  formatter: function (param) {
                    /* var bv = numeral(param.value / total_defect * 100);
                    return param.value + "\n" + bv.format('0.00') + "%" */
                    var bv = Math.floor(param.value / total_defect * 10000) / 100;
                    return param.value + "\n" + bv + "%"
                  },
                  position: 'top'
                },
                type: 'bar'
              }, {
                name: i18n.t('monitor.defectProportion')+'(%)',
                yAxisIndex: 1,
                type: 'line',
                color:'#418FEE',
                data: datas2
              }
              ]
            };

            // 使用刚指定的配置项和数据显示图表。
            that.report_pqc_4.setOption(option, false, false, true);

            $(window).resize();

          }
        });
        this.isChartShow = true;
      },
      refreshOqc() {
        // window.IQIS.mask(true);
        let that = this;
        var hourOffset = this.$iqis.utils.__hour_offset;
        let time_start = this.statisticDays.startTimestamp;
        let time_end = this.statisticDays.endTimestamp;
        let groupType = time_end - time_start > 86400000 ? 0 : 1;

        $("#oqc-report .report-title-date-txt").text((new Date()).Format("yyyy-MM-dd hh:mm:ss"));
        $("#oqc-report .report-title-date-range-txt").text((new Date(time_start)).Format("yyyy-MM-dd hh:mm:ss") + " ～ " +
          (new Date(time_end)).Format("yyyy-MM-dd hh:mm:ss"));

        this.$http.get("/diagram/oqc/day/receive-rate", {
          params: {
            hourOffset: hourOffset,
            start: time_start,
            end: time_end,
            groupType: groupType
          }
        }).then(function (resp) {
          // window.IQIS.mask(false);
          if (resp.data) {
            var xLabels = [];
            var datas = [];

            var minY = 100;
            var maxY = 100;

            var totalCount = 0;
            var totalPass = 0;


            var tbody = $("#dashboard-oqc-rr-report .report-datas-body");
            tbody.empty();
            $(resp.data).each(function (index, dataItem) {
              var label =dataItem.date;
              var value = dataItem.rate;

              totalCount += dataItem.total;
              totalPass += dataItem.pass;

              xLabels.push(label);
              datas.push(value);

              var rowIndex = Math.floor(index / 2);
              if (rowIndex >= tbody.children().length) {
                tbody.append("<tr><td></td><td></td><td></td><td></td><td class='table-gap'></td><td></td><td></td><td></td><td></td></tr>");
              }
              var tr = $(tbody.children()[rowIndex]);

              if (index % 2 == 0) {
                $(tr.children()[0]).text(label);
                $(tr.children()[1]).text(dataItem.total);
                $(tr.children()[2]).text(dataItem.pass);
                $(tr.children()[3]).text(dataItem.rate);
              } else {
                $(tr.children()[5]).text(label);
                $(tr.children()[6]).text(dataItem.total);
                $(tr.children()[7]).text(dataItem.pass);
                $(tr.children()[8]).text(dataItem.rate);
              }
            });

            $("#dashboard-oqc-rr-report .report-total-batch-txt").text(totalCount);
            $("#dashboard-oqc-rr-report .report-total-pass-txt").text(totalPass);

            /* var totalRRNum = numeral(totalPass / totalCount * 100);
            var rateStr = totalRRNum.format('0.00') + "%"; */
            if(totalCount == 0 || totalPass == 0){
              var rateStr = 0
            }else{
              var totalRRNum = (totalPass / totalCount * 100);
              var rateStr = Math.floor(totalRRNum * 100) / 100;
            }
            // var totalRRNum = (totalPass / totalCount * 100);
            // var rateStr = Math.floor(totalRRNum * 100) / 100;

            $("#dashboard-oqc-rr-report .report-total-rr-txt").text(rateStr);

            if (maxY == 0) {
              maxY = 100;
            } else {
              // maxY = Math.ceil(maxY / 10) * 10 + 10;
              maxY = Math.ceil(maxY / 10) * 10;
            }

            if (minY == 100) {
              minY = 0;
            } else {
              // minY = Math.floor(minY / 10) * 10 - 10;
              minY = Math.floor(minY / 10) * 10;
              minY = Math.max(0, minY);
            }

            for (var i3 = 0; i3 < datas.length; i3++) {
              if (datas[i3] == 0) {
                datas[i3] = minY;
              }
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
                    //    showHtm += name+ '<br />' + text + ' ： 无数据' ;
                    // }else{
                    showHtm += name + '<br />' + text + ' ： ' + value + '%';
                    //}
                  }
                  return showHtm;
                }
              }//'{b}<br/>{a}:{c}%'
              ,
              grid: {
                left: '15px',
                right: '45px',
                bottom: '3px',
                top: '14px',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xLabels
              },
              yAxis: {
                type: 'value',
                min: minY,
                max: maxY,
                scale: true,
                axisLabel: {
                  formatter: function (value, index) {
                    if (index == 0) {
                      return "0%";
                    } else {
                      return value + '%';
                    }
                  }
                }
              },
              color:'#418FEE',
              series: [
                {
                  name: i18n.t('monitor.iqcAllowYield'),
                  type: 'line',
                  color:'#418FEE',
                  stack: i18n.t('monitor.allowYield'),
                  showAllSymbol: true,
                  markLine: {
                    symbol: "none",
                    lineStyle: {
                      color: '#888',
                      type: 'dotted',
                      width: 2
                    },
                    data: [{
                      name: '100%',
                      yAxis: 100
                    }]

                  },
                  data: datas
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            that.report_oqc_1.setOption(option, false, false, true);

            $(window).resize();
          }
        });

        this.$http.get("/diagram/oqc/product/abnormal-count", {
          params: {
            hourOffset: hourOffset,
            start: time_start,
            end: time_end
          }
        }).then(function (resp) {
          if (resp.data) {
            var xLabels = [];
            var datas = [];

            var pac_totalCount = 0;
            var pac_totalAbnormal = 0;
            var pac_totalSamplingCount = 0;


            var tbody = $("#dashboard-oqc-ex-report .report-datas-body");
            tbody.empty();
            $(resp.data).each(function (index, dataItem) {
              var label = dataItem.label;

              var value = dataItem.count;

              pac_totalCount += resp.data[0].batchQuantity;
              pac_totalAbnormal += resp.data[0].count;
              pac_totalSamplingCount += resp.data[0].inspectionQuantity;

              // xLabels.push(label);
              xLabels.push(index+1); //将x轴的名称改为编号
              datas.push(value);

              var rowIndex = Math.floor(index / 2);
              if (rowIndex >= tbody.children().length) {
                tbody.append("<tr><td></td><td></td><td></td><td></td><td class='table-gap'></td><td></td><td></td><td></td><td></td></tr>");
              }
              var tr = $(tbody.children()[rowIndex]);

              if (index % 2 == 0) {
                $(tr.children()[0]).text(label);
                $(tr.children()[1]).text(resp.data[index].batchQuantity);
                $(tr.children()[2]).text(resp.data[index].inspectionQuantity);
                $(tr.children()[3]).text(resp.data[index].count);
              } else {
                $(tr.children()[5]).text(label);
                $(tr.children()[6]).text(resp.data[index].batchQuantity);
                $(tr.children()[7]).text(resp.data[index].inspectionQuantity);
                $(tr.children()[8]).text(resp.data[index].count);
              }
            });

            $("#dashboard-oqc-ex-report .report-total-batch-txt").text(pac_totalCount);
            $("#dashboard-oqc-ex-report .report-total-exam-txt").text(pac_totalSamplingCount);
            $("#dashboard-oqc-ex-report .report-total-ex-txt").text(pac_totalAbnormal);

            // var arr = datas;
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
                    //    showHtm += name+ '<br />' + text + ' ： 无数据' ;
                    // }else{
                    showHtm += name + '<br />' + text + ' ： ' + value + '';
                    //}
                  }
                  return showHtm;
                }
              },
              grid: {
                left: '15px',
                right: '26px',
                bottom: '3px',
                top: '14px',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                data: xLabels
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                barMaxWidth: '50',
                name: i18n.t('monitor.abnNum'),
                data: datas,
                //配置样式
                itemStyle: {
                  //通常情况下：
                  normal: {
                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    color: function (params) {
                      return colorList[params.dataIndex % colorList.length];
                    }
                  }
                },
                type: 'bar'
              }]
            };

            // 使用刚指定的配置项和数据显示图表。
            that.report_oqc_2.setOption(option, false, false, true);

            $(window).resize();
          }
        });
        this.isChartShow = true;
      },
      refreshCc() {
        // window.IQIS.mask(true);
        let that = this;
        var hourOffset = this.$iqis.utils.__hour_offset;
        let time_start = this.statisticDays.startTimestamp;
        let time_end = this.statisticDays.endTimestamp;
        let groupType = time_end - time_start > 86400000 ? 0 : 1;

        $("#cc-report .report-title-date-txt").text((new Date()).Format("yyyy-MM-dd hh:mm:ss"));
        $("#cc-report .report-title-date-range-txt").text((new Date(time_start)).Format("yyyy-MM-dd hh:mm:ss") + " ～ " +
          (new Date(time_end)).Format("yyyy-MM-dd hh:mm:ss"));
        //客诉直方图
        this.$http.get("/diagram/day/customer-complaint-count", {
          params: {
            hourOffset: hourOffset,
            start: time_start,
            end: time_end
          }
        }).then(function (resp) {
          // window.IQIS.mask(false);

          if (resp.data) {
            var xLabels = [];
            var datas = [];

            var cc_totalCount = 0;


            var tbody = $("#dashboard-cc-report .report-datas-body");
            tbody.empty();
            $(resp.data).each(function (index, dataItem) {
              var label = dataItem.customerName;

              var value = dataItem.count;

              cc_totalCount += dataItem.count;

              xLabels.push(label);
              datas.push(value);

              var rowIndex = Math.floor(index / 2);
              if (rowIndex >= tbody.children().length) {
                tbody.append("<tr><td></td><td></td><td class='table-gap'></td><td></td><td></td></tr>");
              }
              var tr = $(tbody.children()[rowIndex]);

              if (index % 2 == 0) {
                $(tr.children()[0]).text(label);
                $(tr.children()[1]).text(dataItem.count);
              } else {
                $(tr.children()[3]).text(label);
                $(tr.children()[4]).text(dataItem.count);
              }
            });

            $("#dashboard-cc-report .report-total-batch-txt").text(cc_totalCount);
            $("#dashboard-cc-report .report-total-exam-txt").text(resp.data.length);

            // var arr = datas;
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
                    //    showHtm += name+ '<br />' + text + ' ： 无数据' ;
                    // }else{
                    showHtm += name + '<br />' + text + ' ： ' + value + '';
                    //}
                  }
                  return showHtm;
                }
              },
              grid: {
                left: '12px',
                right: '26px',
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
              },
              series: [{
                barMaxWidth: '50',
                name: i18n.t('monitor.complaintNum'),
                data: datas,
                //配置样式
                itemStyle: {
                  //通常情况下：
                  normal: {
                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    color: function (params) {
                      return colorList[params.dataIndex % colorList.length];
                    }
                  }
                },
                type: 'bar'
              }]
            };

            // 使用刚指定的配置项和数据显示图表。
            that.report_cc_1.setOption(option, false, false, true);

            $(window).resize();
          }
        });

        this.$http.get("/diagram/day/customer-complaint-count", {
          params: {
            hourOffset: hourOffset,
            start: time_start,
            end: time_end
          }
        }).then(function (resp) {

          if (resp.data) {

            var legendData = [];
            var seriesData = [];

            var showCount = 8;

            var otherNum = 0;

            var cc_totalCount = 0;

            var showCount = 8;


            var tbody = $("#dashboard-cc-pie-report .report-datas-body");
            tbody.empty();
            $(resp.data).each(function (index, dataItem) {
              var label = dataItem.productName;

              var value = dataItem.count;

              cc_totalCount += dataItem.count;

              var rowIndex = Math.floor(index / 2);
              if (rowIndex >= tbody.children().length) {
                tbody.append("<tr><td></td><td></td><td class='table-gap'></td><td></td><td></td></tr>");
              }
              var tr = $(tbody.children()[rowIndex]);

              if (index % 2 == 0) {
                $(tr.children()[0]).text(dataItem.customerName);
                $(tr.children()[1]).text(dataItem.count);
              } else {
                $(tr.children()[3]).text(dataItem.customerName);
                $(tr.children()[4]).text(dataItem.count);
              }
            });

            $("#dashboard-cc-pie-report .report-total-batch-txt").text(cc_totalCount);
            $("#dashboard-cc-pie-report .report-total-exam-txt").text(resp.data.length);

            $(resp.data).each(function (index, dataItem) {
              if (index > showCount) {
                otherNum += dataItem["count"];
              } else {
                legendData.push(dataItem["customerName"]);
                seriesData.push({
                  name: dataItem["customerName"],
                  value: dataItem["count"]
                });
              }
            });

            if (otherNum > 0) {
              legendData.push(i18n.t('monitor.other'));
              seriesData.push({
                name: i18n.t('monitor.other'),
                value: otherNum
              });
            }

            // 指定图表的配置项和数据
            var option = {
              tooltip: {
                trigger: 'item',
                formatter: "{b} <br/>{a} : {c} ({d}%)"
              },
              legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: legendData
                // ,selected: data.selected
              },
              color: pieColorList,
              grid: {
                top: "12px",
                left: "12px",
                right: "12px",
                bottom: "12px"
              },
              series: [
                {
                  name: i18n.t('monitor.complaintNum'),
                  type: 'pie',
                  radius: '72%',
                  center: ['40%', '50%'],
                  data: seriesData,
                  label: {
                    show: true,
                    formatter: "{b}: {c}  [ {d}% ]"
                  },
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            };
            that.report_cc_3.clear();
            // 使用刚指定的配置项和数据显示图表。
            that.report_cc_3.setOption(option, false, false, true);

            $(window).resize();
          }
        });

        this.$http.get("/diagram/defect/customer-complaint-count", {
          params: {
            hourOffset: hourOffset,
            start: time_start,
            end: time_end
          }
        }).then(function (resp) {
          if (resp.data) {
            var xLabels = [];
            var datas = [];
            var datas2 = [];

            var total_batch = 0;
            var total_defect = 0;

            if (resp.data.collect) {
              total_batch = resp.data.collect.batch;
              total_defect = resp.data.collect.count;
            }

            var unit_defect = 0;

            var showCount = 19;
            var other = 0;
            var preValue = 0;
            $(resp.data.list).each(function (index, item) {
              if (index < showCount) {
                xLabels.push(item.defectTypeName);
                datas.push(item.count);

                var bv = numeral((item.count + preValue) / total_defect * 100);
                preValue += item.count;
                datas2.push(bv.format('0.00'));

              } else {
                other += item.count;
              }
            });

            if (other > 0) {
              xLabels.push(i18n.t('monitor.other'));
              datas.push(other);
              var bv = numeral((other + preValue) / total_defect * 100);
              datas2.push(bv.format('0.00'));
            }


            $("#dashboard-blt-cc-report .report-total-batch-txt").text(total_batch);
            $("#dashboard-blt-cc-report .report-total-defect-txt").text(total_defect);

            total_defect = Math.max(1, total_defect);

            // var arr = datas;
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
                    //    showHtm += name+ '<br />' + text + ' ： 无数据' ;
                    // }else{
                    if (i == 0) {
                      showHtm += name + '<br />';
                    }
                    showHtm += text + ' ： ' + value + '<br />';
                    //}
                  }
                  return showHtm;
                }
              },
              grid: {
                left: '3px',
                right: '26px',
                bottom: '3px',
                top: '30px',
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
                max: total_defect
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
              color: ['#336699'],
              series: [{
                barMaxWidth: '50',
                name: i18n.t('monitor.abnNum'),
                data: datas,
                //配置样式
                itemStyle: {
                  //通常情况下：
                  normal: {
                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                    color: function (params) {
                      return colorList[params.dataIndex % colorList.length];
                    }
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
                name: i18n.t('monitor.defectProportion')+'(%)',
                yAxisIndex: 1,
                type: 'line',
                color:'#418FEE',
                data: datas2
              }
              ]
            };

            // 使用刚指定的配置项和数据显示图表。
            that.report_cc_2.setOption(option, false, false, true);

            $(window).resize();

          }
        });
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
          let width = $('.quality-report-page').width();
          if (width == 0) return;
          if (that.buzType == 'iqc') {
            if (that.report_iqc_1) that.report_iqc_1.resize({width: width});
            if (that.report_iqc_2) that.report_iqc_2.resize({width: width});
            if (that.report_iqc_3) that.report_iqc_3.resize({width: width});
          } else if (that.buzType == 'pqc') {
            if (that.report_pqc_1) that.report_pqc_1.resize({width: width});
            if (that.report_pqc_2) that.report_pqc_2.resize({width: width});
            if (that.report_pqc_3) that.report_pqc_3.resize({width: width});
            if (that.report_pqc_4) that.report_pqc_4.resize({width: width});
          } else if (that.buzType == 'oqc') {
            if (that.report_oqc_1) that.report_oqc_1.resize({width: width});
            if (that.report_oqc_2) that.report_oqc_2.resize({width: width});
          } else if (that.buzType == 'cc') {
            if (that.report_cc_1) that.report_cc_1.resize({width: width});
            if (that.report_cc_2) that.report_cc_2.resize({width: width});
            if (that.report_cc_3) that.report_cc_3.resize({width: width});
          }
        }, 200);
      });

      this.onBuildReport();
    },

    watch: {
      buzType(val) {
        let indicators = this.buzParams[this.buzType];
        if (indicators[this.statisticIndicator] === undefined) {
          this.statisticIndicator = Object.keys(indicators)[0];
        }
      },
      statisticIndicator(val) {
        let indicators = this.buzParams[this.buzType];
        let methods = indicators[val];
        if (methods[this.statisticMethod] === undefined) {
          this.statisticMethod = Object.keys(methods)[0];
        }
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
  .quality-report-page {
    padding-bottom: 48px
  }

  .quality-report-page .ivu-line {
    padding-bottom: 3px;
  }

  .quality-report-page .report-main {
    margin-top: 10px;
    /* margin-right: 10px; */
    background-color: #fff;
    color: #333;
  }

  .quality-report-page .iqis-table-no-data {
    text-align: center;
    color: #333;
    font-size: 16px;
  }

  .quality-report-page .dashboard-report-title-cell {
    font-size: 32px;
    line-height: 40px;
    text-align: center;
  }

  .quality-report-page .dashboard-report-title-table,
  .quality-report-page .dashboard-report-total-table,
  .quality-report-page .dashboard-report-datas-table,
  .quality-report-page .dashboard-report-footer {
    width: 100%;
    border: 0;
    border-collapse: collapse;
  }

  .quality-report-page .dashboard-report-border {
    border: 1px solid #666;
    margin-bottom: 10px;
  }

  .quality-report-page .dashboard-report-title-table .dashboard-report-date-cell {
    text-align: center;
  }

  .quality-report-page .dashboard-report-total-border {
    border: 1px solid #666;
    margin-left: 18px;
    margin-right: 18px;
    padding: 6px 10px;
  }

  .quality-report-page .exam-total-item {
    margin-right: 30px;
  }

  .quality-report-page .total-label {
    padding-right: 8px;
  }

  .quality-report-page .dashboard-report-title-table td {
    border: 0;
    vertical-align: bottom;
    line-height: 30px;
    border-collapse: collapse;
  }

  .quality-report-page .dashboard-report-title-table .dashboard-report-title-cell {
    font-size: 32px;
    line-height: 40px;
    text-align: center;
  }
  .en_US .quality-report-page .dashboard-report-title-table .dashboard-report-title-cell{
    font-size:22px;
  }
  .quality-report-page .dashboard-report-datas-div {
    width: 100%;
    padding: 0 12px;
    margin-top: 10px;
  }

  .quality-report-page .dashboard-report-datas-table {
    border: 1px;
    border-color: #333;
  }

  .quality-report-page .dashboard-report-datas-table th,
  .quality-report-page .dashboard-report-datas-table td {
    border: 1px solid #333;
    padding: 3px;
    text-align: center;
  }

  .quality-report-page .dashboard-report-datas-table th {
    background-color: #efefef;
  }

  .quality-report-page .dashboard-report-datas-table td.table-gap,
  .quality-report-page .dashboard-report-datas-table th.table-gap {
    border-top: 0;
    border-bottom: 0;
    width: 10px;
    background-color: #fff;
  }

  .quality-report-page .dashboard-report-footer {
    margin: 10px 12px;
  }

  .quality-report-page .report-export-btn {
    padding: 0px 20px;
    margin-left: 8px;
  }

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

  .quality-report-page .ivu-line {
    padding: 0;
    height: 24px !important;
    line-height: 22px;
    margin-bottom: 10px;
  }

  .quality-report-page .ivu-line > label {
    margin-right: 20px;
  }
</style>
