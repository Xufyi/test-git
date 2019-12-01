<template>
  <div class="iqis-page">
    <div class="iqis-page-tool-row" style="display:none">
      <div class="iqis-page-tool-primary">

      </div>
      <div class="iqis-page-tool-second">

      </div>
    </div>
    <div class="iqis-page-context statistic-histogram-page">
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
              <Radio v-for="(value, key, index) in buzParams[buzType]" :key="key" :label="key">{{buzNameMap[key]}}<!-- --{{key}} -->
              </Radio>
            </RadioGroup>
          </div>
          <div class="exam-option-group-ycjs ivu-line" style='margin-top:10px;'>
            <label>{{$t('statistical.contrastMode')}}:</label>
            <RadioGroup size='small' v-model="statisticMethod" type="button">
              <Radio v-for="(value, key, index) in buzParams[buzType][statisticIndicator]" :key="key" :label="key">
                {{buzNameMap[key]}}<!-- --{{key}} -->
              </Radio>
            </RadioGroup>
          </div>
          <div class="exam-option-group-iqc ivu-line">
            <label>{{$t('statistical.contrastCondition')}}:</label>
            <span class="exam-report-params">
                <span class="conditionItem" v-show='statisticMethod == "byProductType" ? true : false'>
                    <label style="width: auto;padding: 0 3px;">{{$t('statistical.productType')}}</label>
                    <Select :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.productTypeId" style="width:510px;" multiple filterable>
                        <Option v-for="item in selectorsData.productTypeList" :value="item.prodTypeId"
                                :key="item.prodTypeId">{{ item.name }}</Option>
                    </Select>
                </span>
              
              <span class="conditionItem" v-show='statisticMethod == "byProduct" ? true : false'>
                   <label style="width: auto;padding: 0 3px;">{{$t('statistical.productNo')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.productId" style="width:510px" multiple filterable>
                        <Option v-for="item in selectorsData.productList" :value="item.productId" :label="item.no" :key="item.productId">{{item.no+" / "+item.name}}</Option>
                    </Select>
              </span>
             
              <!-- 来料 -->
              <span class="conditionItem" v-show='statisticMethod == "byManufacturer" ? true : false'>
                    <label style="width: auto;padding: 0 3px;" v-if="buzType == 'iqc'">{{$t('statistical.supplierName')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.manufacturerId" style="width:510px" v-if="buzType == 'iqc'" multiple filterable>
                        <Option v-for="item in selectorsData.manufacturerList" :value="item.manufacturerId"
                                :key="item.manufacturerId">{{ item.manufacturerAbbreviation }}</Option>
                    </Select>
              </span>
              <span class="conditionItem" v-show="statisticMethod == 'byCause' ? true : false">
                    <label style="width: auto;padding: 0 3px;" v-if="(buzType == 'iqc' || buzType == 'pqc' || buzType == 'oqc' || buzType == 'cc')">{{$t('statistical.abnormalCause')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.abnormalCauseId" style="width:510px" v-if="buzType == 'iqc' || buzType == 'pqc' || buzType == 'oqc' || buzType == 'cc'" multiple filterable>
                        <Option v-for="item in selectorsData.specialCauseList" :value="item.abnormalId"
                                :key="item.abnormalId">{{ item.name }}</Option>
                    </Select>
              </span>

              <span class="conditionItem" v-show="statisticMethod == 'byHandle' ? true : false">
                    <label style="width: auto;padding: 0 3px;" v-if="buzType == 'iqc' || buzType == 'pqc' || buzType == 'oqc' || buzType == 'cc'">{{$t('statistical.treatmentMethod')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.treatmentMethod" style="width:510px" v-if="buzType == 'iqc' || buzType =='pqc' || buzType == 'oqc' || buzType == 'cc'" multiple filterable>
                        <Option v-for="(item,index) in processModeList" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
              </span>
              
              <!-- 过程 -->
              <span class="conditionItem" v-show="statisticMethod == 'byBatch' ? true : false">
                    <label style="width: auto;padding: 0 3px;" v-if="buzType == 'pqc'">{{$t('statistical.productBatch')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.prodBatchId" style="width:510px" v-if="buzType == 'pqc'" multiple filterable>
                        <Option v-for="(item,index) in selectorsData.batchList" :value="item.prodBatchId" :label='item.batchNo' :key="index">{{ item.batchNo }}</Option>
                    </Select>
              </span>
              <span class="conditionItem" v-show="statisticMethod == 'byLine' ? true : false">
                    <label style="width: auto;padding: 0 3px;" v-if="buzType == 'pqc'">{{$t('statistical.productLine')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.prodLineId" style="width:510px" v-if="buzType == 'pqc'" multiple filterable>
                        <Option v-for="item in selectorsData.prodLineList" :value="item.prodLineId" :key="item.prodLineId">{{ item.name }}</Option>
                    </Select>
              </span>
              <span class="conditionItem" v-show="statisticMethod == 'byProcess' ? true : false">
                    <label style="width: auto;padding: 0 3px;" v-if="buzType == 'pqc'">{{$t('statistical.productProcess')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.prodProcessId" style="width:510px" v-if="buzType == 'pqc'" multiple filterable>
                        <Option v-for="item in selectorsData.prodProcessList" :value="item.prodProcessId"
                                :key="item.prodProcessId">{{ item.prodProcessName }}</Option>
                    </Select>
              </span>
              <span class="conditionItem" v-show="statisticMethod == 'byCustomer' ? true : false">
                    <label style="width: auto;padding: 0 3px;" v-if="(buzType == 'oqc'||buzType == 'cc' || buzType == 'pqc')&&!toSupplierCustomerId">{{$t('statistical.customerName')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.customerId" style="width:510px" v-if="(buzType == 'oqc'||buzType == 'cc' || buzType == 'pqc')&&!toSupplierCustomerId" multiple filterable>
                        <Option v-for="item in selectorsData.customerList" :value="item.customerId"
                                :key="item.customerId">{{ item.customerAbbreviation }}</Option>
                    </Select>
              </span>
              
              <span class="conditionItem" v-show="statisticMethod == 'byInspector' ? true : false">
                    <label style="width: auto;padding: 0 3px;" v-if="(buzType == 'pqc')">{{$t('statistical.inspector')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.inspectorId" style="width:510px" v-if="(buzType == 'pqc')" multiple filterable>
                        <Option v-for="(item,index) in selectorsData.inspectorList" :value="item.userId" :label="item.name"
                                :key="index">{{ item.name }}</Option>
                    </Select>
              </span>
              
              <span class="conditionItem" v-show="statisticMethod == 'byClass' ? true : false">
                    <label style="width: auto;padding: 0 3px;" v-if="(buzType == 'pqc')">{{$t('statistical.inspectionClass')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="statisticFilterParams.chkShiftId" style="width:510px" v-if="(buzType == 'pqc')" multiple filterable>
                        <Option v-for="(item,index) in selectorsData.chkshiftList" :value="item.chkShiftId" :label="item.name"
                                :key="index">{{ item.name }}</Option>
                    </Select>
              </span>

              <!-- 出货 -->
            </span>
            <!-- <Button type="ghost" @click="onFilterResetFilterParams">重置</Button> -->

            <!-- <Button type="ghost" icon="refresh" @click="onContrastResetFilterParams">重置条件</Button> -->
          </div>

          <div class="exam-option-group-iqc ivu-line">
            <div span='1' style="float:left;line-height:37px;" :style="this.$store.state.locale=='zh_CN'?'width:64.5px':'width:150px'">
              <div style='margin-top:5px;'>{{$t('statistical.filtrationCondition')}}:</div>
            </div>

            <div>
            <span class="exam-report-params">
              <span class="conditionItem" v-show='statisticMethod == "byProductType" ? false : true'>
                <div style='display:inline-block;'>
                  <label style="width: auto;padding: 0 3px;">{{$t('statistical.productType')}}</label>
                  <Select  :placeholder="i18n.t('pleaseChoose')" v-model="gl_statisticFilterParams.productTypeId" style="width:140px;" filterable>
                      <Option v-for="item in selectorsData.productTypeList" :value="item.prodTypeId"
                              :key="item.prodTypeId">{{ item.name }}</Option>
                  </Select>
                </div>
              </span>
              
              <span class="conditionItem" v-show='statisticMethod == "byProduct" ? false : true'>
                <div style='display:inline-block;'>
                   <label style="width: auto;padding: 0 3px;">{{$t('statistical.productNo')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="gl_statisticFilterParams.productId" style="width:140px" filterable>
                        <Option v-for="item in selectorsData.productList" :value="item.productId" :label="item.no" :key="item.productId">{{item.no+" / "+item.name}}</Option>
                    </Select>
                </div>
              </span>
             
              <!-- 来料 -->
              <span class="conditionItem" v-show='statisticMethod == "byManufacturer" ? false : true'>
                <div style='display:inline-block;' v-if="buzType == 'iqc'">
                    <label style="width: auto;padding: 0 3px;" v-if="buzType == 'iqc'">{{$t('statistical.supplierName')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="gl_statisticFilterParams.manufacturerId" style="width:140px" v-if="buzType == 'iqc'" filterable>
                        <Option v-for="item in selectorsData.manufacturerList" :value="item.manufacturerId"
                                :key="item.manufacturerId">{{ item.manufacturerAbbreviation }}</Option>
                    </Select>
                </div>
              </span>

              <span class="conditionItem" v-show="statisticMethod == 'byCause' ? false : true">
                <div style='display:inline-block;' v-if="(statisticIndicator == 'abnormal_count' || buzType == 'cc')">
                    <label style="width: auto;padding: 0 3px;" v-if="(statisticIndicator == 'abnormal_count' || buzType == 'cc')">{{$t('statistical.abnormalCause')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="gl_statisticFilterParams.abnormalCauseId" style="width:140px" v-if="statisticIndicator == 'abnormal_count' || buzType == 'cc'" filterable>
                        <Option v-for="item in selectorsData.specialCauseList" :value="item.abnormalId"
                                :key="item.abnormalId">{{ item.name }}</Option>
                    </Select>
                </div>
              </span>

              <span class="conditionItem" v-show="statisticMethod == 'byHandle' ? false : true">
                <div style='display:inline-block;' v-if="statisticIndicator == 'abnormal_count' || buzType == 'cc'">
                    <label style="width: auto;padding: 0 3px;" v-if="statisticIndicator == 'abnormal_count' || buzType == 'cc'">{{$t('statistical.treatmentMethod')}}</label>
                    <Select :placeholder="i18n.t('pleaseChoose')" v-model="gl_statisticFilterParams.treatmentMethod" style="width:140px" v-if="statisticIndicator == 'abnormal_count' || buzType == 'cc'" filterable>
                        <Option v-for="(item,index) in processModeList" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </div>
              </span>
              
              <!-- 过程 -->
              <span class="conditionItem" v-show="statisticMethod == 'byBatch' ? false : true">
                <div style='display:inline-block;' v-if="(buzType == 'pqc' && statisticIndicator == 'first_pass_yield') || (buzType == 'pqc' && statisticIndicator == 'acceptance_rate') || (buzType == 'pqc' && statisticIndicator == 'return_rate') || (buzType == 'pqc' && statisticIndicator == 'bad_rate')">
                    <label style="width: auto;padding: 0 3px;" v-if="(buzType == 'pqc' && statisticIndicator == 'first_pass_yield') || (buzType == 'pqc' && statisticIndicator == 'acceptance_rate') || (buzType == 'pqc' && statisticIndicator == 'return_rate') || (buzType == 'pqc' && statisticIndicator == 'bad_rate')">{{$t('statistical.productBatch')}}</label>
                    
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="gl_statisticFilterParams.prodBatchId" style="width:140px" v-if="(buzType == 'pqc' && statisticIndicator == 'first_pass_yield') || (buzType == 'pqc' && statisticIndicator == 'acceptance_rate') || (buzType == 'pqc' && statisticIndicator == 'return_rate') || (buzType == 'pqc' && statisticIndicator == 'bad_rate')" filterable>
                        <Option v-for="(item,index) in selectorsData.batchList" :value="item.prodBatchId" :label='item.batchNo' :key="index">{{ item.batchNo }}</Option>
                    </Select>
                </div>
              </span>

              <span class="conditionItem" v-show="statisticMethod == 'byLine' ? false : true">
                <div style='display:inline-block;' v-if="buzType == 'pqc'">
                    <label style="width: auto;padding: 0 3px;" v-if="buzType == 'pqc'">{{$t('statistical.productLine')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="gl_statisticFilterParams.prodLineId" style="width:140px" v-if="buzType == 'pqc'" filterable>
                        <Option v-for="item in selectorsData.prodLineList" :value="item.prodLineId" :key="item.prodLineId">{{ item.name }}</Option>
                    </Select>
                </div>
              </span>

              <span class="conditionItem" v-show="statisticMethod == 'byProcess' ? false : true">
                <div style='display:inline-block;' v-if="buzType == 'pqc'">
                    <label style="width: auto;padding: 0 3px;" v-if="buzType == 'pqc'">{{$t('statistical.productProcess')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="gl_statisticFilterParams.prodProcessId" style="width:140px" v-if="buzType == 'pqc'" filterable>
                        <Option v-for="item in selectorsData.prodProcessList" :value="item.prodProcessId"
                                :key="item.prodProcessId">{{ item.prodProcessName }}</Option>
                    </Select>
                </div>
              </span>

              <span class="conditionItem" v-show="statisticMethod == 'byCustomer' ? false : true">
                <div style='display:inline-block;' v-if="(buzType == 'oqc' || buzType == 'cc' || buzType == 'pqc')&&!toSupplierCustomerId">
                    <label style="width: auto;padding: 0 3px;" v-if="(buzType == 'oqc' || buzType == 'cc' || buzType == 'pqc')&&!toSupplierCustomerId">{{$t('statistical.customerName')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="gl_statisticFilterParams.customerId" style="width:140px" v-if="(buzType == 'oqc'||buzType == 'cc' || buzType == 'pqc')&&!toSupplierCustomerId" filterable>
                        <Option v-for="item in selectorsData.customerList" :value="item.customerId"
                                :key="item.customerId">{{ item.customerAbbreviation }}</Option>
                    </Select>
                </div>
              </span>
               <!-- || (buzType == 'pqc' && statisticIndicator == 'abnormal_count') ? false : true -->
              <span class="conditionItem" v-show="statisticMethod == 'byInspector' ? false : true">
                <div style='display:inline-block;' v-if="((buzType == 'pqc' && statisticIndicator == 'first_pass_yield') || (buzType == 'pqc' && statisticIndicator == 'acceptance_rate') || (buzType == 'pqc' && statisticIndicator == 'return_rate') || (buzType == 'pqc' && statisticIndicator == 'bad_rate'))&&!toSupplierCustomerId">
                    <label style="width: auto;padding: 0 3px;" v-if="((buzType == 'pqc' && statisticIndicator == 'first_pass_yield') || (buzType == 'pqc' && statisticIndicator == 'acceptance_rate') || (buzType == 'pqc' && statisticIndicator == 'return_rate') || (buzType == 'pqc' && statisticIndicator == 'bad_rate'))&&!toSupplierCustomerId">{{$t('statistical.inspector')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="gl_statisticFilterParams.inspectorId" style="width:140px" v-if="((buzType == 'pqc' && statisticIndicator == 'first_pass_yield') || (buzType == 'pqc' && statisticIndicator == 'acceptance_rate') || (buzType == 'pqc' && statisticIndicator == 'return_rate') || (buzType == 'pqc' && statisticIndicator == 'bad_rate'))&&!toSupplierCustomerId" filterable>
                        <Option v-for="(item,index) in selectorsData.inspectorList" :value="item.userId" :label="item.name"
                                :key="index">{{ item.name }}</Option>
                    </Select>
                </div>
              </span>
              
              <span class="conditionItem" v-show="statisticMethod == 'byClass' ? false : true">
                <div style='display:inline-block;' v-if="((buzType == 'pqc' && statisticIndicator == 'acceptance_rate') || (buzType == 'pqc' && statisticIndicator == 'return_rate') || (buzType == 'pqc' && statisticIndicator == 'bad_rate'))&&!toSupplierCustomerId">
                    <label style="width: auto;padding: 0 3px;" v-if="((buzType == 'pqc' && statisticIndicator == 'acceptance_rate') || (buzType == 'pqc' && statisticIndicator == 'return_rate') || (buzType == 'pqc' && statisticIndicator == 'bad_rate'))&&!toSupplierCustomerId">{{$t('statistical.inspectionClass')}}</label>
                    <Select  :placeholder="i18n.t('pleaseChoose')" v-model="gl_statisticFilterParams.chkShiftId" style="width:140px" v-if="((buzType == 'pqc' && statisticIndicator == 'acceptance_rate') || (buzType == 'pqc' && statisticIndicator == 'return_rate') || (buzType == 'pqc' && statisticIndicator == 'bad_rate'))&&!toSupplierCustomerId" filterable>
                        <Option v-for="(item,index) in selectorsData.chkshiftList" :value="item.chkShiftId" :label="item.name"
                                :key="index">{{ item.name }}</Option>
                    </Select>
                </div>
              </span>

              <!-- 出货 -->

              
            <!-- <Button type="ghost" @click="onFilterResetFilterParams">重置</Button> -->
            <!-- <Button type="ghost" icon="refresh" @click="onFilterResetFilterParams">重置条件</Button> -->
            </span>
            </div>
          </div>
          

          <div id="exam-report-date-pick" class="ivu-line" style='margin-top:10px;'>
            <label>{{$t('statistical.reportTime')}}:</label>
            <RadioGroup size='small' v-model="statisticDays.daysRange" type="button">
              <Radio label="0">{{$t('statistical.today')}}</Radio>
              <Radio label="7">{{$t('statistical.Nearly')}}7{{$t('statistical.days')}}</Radio>
              <Radio label="30">{{$t('statistical.Nearly')}}30{{$t('statistical.days')}}</Radio>
              <Radio label="-1">{{$t('statistical.custom')}}</Radio>
            </RadioGroup>
            <DatePicker class='initDatePicker' v-if="statisticDays.daysRange == '-1'" type="daterange" split-panels :placeholder="i18n.t('statistical.dateInterval')"
                        :start-date="new Date(2018, 2, 1)" style="width: 210px"
                        @on-change="onCustomDateChange"></DatePicker>
            <Button type="primary" icon="ios-search" @click="onBuildReport">{{$t('statistical.viewReport')}}</Button>
            <Button style='float:right;' v-show="isChartShow == true" type="primary" icon="android-open" @click="onExportReport('exam-reportdbt')">{{$t('statistical.exportReport')}}</Button>
            <Button type="ghost" @click="onFilterResetFilterParams">{{$t('statistical.reset')}}</Button>
          </div>
          <div style='width:100%; border-bottom: 1px dashed #E9E9E9; margin:15px 0;'></div>
          <!-- <Button type="info" icon="arrow-down-a" @click="onExportReport">导出</Button> -->
        </div>
      </div>
      <div id="report-tab" class="tab-content exam-report-main">
        <div id="report-tip" class="iqis-report-tab" v-show="isChartShow == false">
          <div class="iqis-table-no-data" style="height: 100px;line-height: 100px;">{{$t('statistical.pleaseChoose')}}</div>
        </div>
        <div id="exam-reportdbt" class="exam-report-border" v-show="isChartShow">
          <!-- report title -->
          <table class="exam-report-title-table">
            <tr>
              <td width="25%">
                <!-- <button type="button" style='width:80px; margin-left:8px;' class="btn btn-default report-export-btn"
                        @click="onExportReport('exam-report')"><span class="glyphicon glyphicon-export">导出</span>
                </button> -->
              </td>
              <td width="50%" class="exam-report-title-cell"><span style='font-size:32px;'
                                                                   class="exam-report-title-txt">【{{reportTitleTxt}}】</span>
              </td>
              <td width="25%">{{$t('statistical.tabulationDate')}}：<span class="report-title-date-txt">{{reportDateTxt}}</span></td>
            </tr>
            <tr>
              <td width="25%"></td>
              <td width="50%" class="exam-report-date-cell">{{$t('statistical.dateInterval')}}：<span class="report-title-date-range-txt">{{reportDateRangeTxt}}</span>
              </td>
              <td width="25%">{{$t('statistical.pages')}}：<span class="report-title-pager-txt">1 / 1</span></td>
            </tr>
          </table>

          <!-- <div class="exam-report-total-border">
            <template v-for="item in collectList">
              <span class="exam-total-item"><label class="total-label">{{ item.label }}：</label>{{ item.value }}</span>
            </template>
          </div> -->
          <div class="exam-report-total-border">
            <template>
              <span class="exam-total-item"><label class="total-label">{{ statistics }}{{$t('statistical.quantity')}}:</label>{{allNumber}}</span>
            </template>
          </div>

          <div ref="comparison" id='histogramChart' class="exam-report-chart-div"
               style="height: 400px; width: 100%">

          </div>
          <div class="exam-report-datas-div">
            <!-- <table class="exam-report-datas-table">
              <thead>
              <tr class="report-data-thead">
                <th>{{$t('statistical.supplierName')}}</th>
                <th>总批量数</th>
                <th>总检验数</th>
                <th>总异常数</th>
                <th class="table-gap"></th>
                <th>{{$t('statistical.supplierName')}}</th>
                <th>总批量数</th>
                <th>总检验数</th>
                <th>总异常数</th>
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
 -->
            <table class="exam-report-footer">
              <tr>
                <td width="200px">{{$t('statistical.confirm')}}：</td>
                <td width="200px">{{$t('statistical.reReview')}}：</td>
                <td width="200px">{{$t('statistical.Tabulation')}}：</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>

        </div>
      </div>
      <!-- <Modal
        v-model="isShowDataSelectModal"
        title="允收率数据选择"
        width="50">
        <Table ref="modalTable" size="small" style="overflow:auto;max-height: 400px;" border
               :columns="dataSelectorColumns" :data="dataSelectorDatas"></Table>
        <div slot="footer">
          <Button type="primary" size="large" @click="onDataSelectorOkButton();isShowDataSelectModal=false" ok-text>确定</Button>
          <Button type="text" size="large" cancel-text @click="isShowDataSelectModal=false">取消</Button>
        </div>
      </Modal> -->
    </div> <!-- end iqis-page-content -->

    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
  </div>
</template>

<script>
  import $ from 'jquery'
  import ReportDateSelector from '../../components/reportDateSelector/ReportDateSelector'
  import echarts from 'echarts'
  import ICol from "iview/src/components/grid/col";
  import reportConfig from './statisticConfig.js';
  import numeral from 'numeral';
  import TableModal from './TableModal/';

    var pieColorList = reportConfig.colorList;
  // var pieColorList = reportConfig.pieColorList;

  export default {
    data() {
      let vm = this;

      return {
        i18n:window.i18n,
        processModeList:[
            {value:"REJECT",label:i18n.t('statistical.return')},
            {value:"REWORK",label:i18n.t('statistical.rework')},
            {value:"SCREEN",label:i18n.t('statistical.filter')},
            {value:"SPECIAL_ADOPTION",label:i18n.t('statistical.special')},
            {value:"EMERGENCY_RELEASE",label:i18n.t('statistical.release')},
            {value:"SCRAP",label:i18n.t('statistical.scrap')}
        ],
        chartType: i18n.t('statistical.contrastChart'),
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
          abnormalCauseId:[],//异常id
          treatmentMethod:[],//处理方式
          prodBatchId:[],//过程直通率批号
          inspectorId:[],//过程直通率检验员
          chkShiftId:[],//过程允收率检验班别
          productTypeId: [],
          productId: [],
          manufacturerId: [],
          customerId: [],
          prodLineId:[],
          prodProcessId:[],
          
        },
        gl_statisticFilterParams:{
            abnormalCauseId:'',//异常id
            treatmentMethod:'',//处理方式
            prodBatchId:'',//过程直通率批号
            inspectorId:'',//过程直通率检验员
            chkShiftId:'',//过程允收率检验班别
            productTypeId: '',
            productId: '',
            manufacturerId: '',
            customerId: '',
            prodLineId:'',
            prodProcessId:'',
          },
        reportConfig: reportConfig,
        buzNameMap: reportConfig.buzNameMap,
        statistics:'',
        allNumber:0
,        buzParams: reportConfig.buzParams,
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
          prodProcessList: [],
          specialCauseList:[],//异常原因
          batchList:[],//过程直通率批号
          inspectorList:[],//过程直通率检验员
          chkshiftList:[],//过程允收率检验班别
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
        this.histogramChart = echarts.init(this.$refs.comparison);
      },
      onCustomDateChange(d) {
        this.statisticDays.custom[0] = this.$iqis.utils.date.toDate(d[0]);
        this.statisticDays.custom[1] = this.$iqis.utils.date.toDate(d[1]);
      },
      /* 对比条件重置 */
      /* onContrastResetFilterParams() {
        let that = this;
        that.statisticFilterParams = {
            abnormalCauseId:[],//异常id
            treatmentMethod:[],//处理方式
            prodBatchId:[],//过程直通率批号
            inspectorId:[],//过程直通率检验员
            chkShiftId:[],//过程允收率检验班别
            productTypeId: [],
            productId: [],
            manufacturerId: [],
            customerId: [],
            prodLineId:[],
            prodProcessId:[],
            
          }
      }, */
      /* 过滤条件重置 */
      onFilterResetFilterParams() {
        // let that = this;
        // alert(111)
            // debugger
            this.gl_statisticFilterParams.productId = null; 
            this.gl_statisticFilterParams.abnormalCauseId = null;//异常id
            this.gl_statisticFilterParams.treatmentMethod = null;//处理方式
            this.gl_statisticFilterParams.prodBatchId = null;//过程直通率批号
            this.gl_statisticFilterParams.inspectorId = null;//过程直通率检验员
            this.gl_statisticFilterParams.chkShiftId = null;//过程允收率检验班别
            this.gl_statisticFilterParams.productTypeId =  null;
            this.gl_statisticFilterParams.manufacturerId =  null;
            this.gl_statisticFilterParams.customerId =  null;
            this.gl_statisticFilterParams.prodLineId = null;
            this.gl_statisticFilterParams.prodProcessId = null;
            this.statisticDays.daysRange = "30";
            this.statisticFilterParams = {
            abnormalCauseId:[],//异常id
              treatmentMethod:[],//处理方式
              prodBatchId:[],//过程直通率批号
              inspectorId:[],//过程直通率检验员
              chkShiftId:[],//过程允收率检验班别
              productTypeId: [],
              productId: [],
              manufacturerId: [],
              customerId: [],
              prodLineId:[],
              prodProcessId:[],
            }

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

      /* onDataSelectorOkButton(selectRows) {
        let selectRows = selectRows;
        console.log(selectRows,1);
        
        // this.fillReportText(selectRows);
        this.updateHistogramChart(selectRows);
      }, */

      onExportReport(borderId) {//border div的ID
        var reportBorder = $("#" + borderId);
        // 添加统一的外层
        var content_html = "<div id=\"exam-report\" class=\"exam-report-border export-chart-preview\" style='background: #fff;width:1200px;'>" + reportBorder.html() + "</div>";
        var pageHead = "<div style='text-align: center;font-size: 11pt;font-weight: bold;'>" + $(".exam-report-title-txt").text() + "- "
          + reportBorder.find(".report-title-date-range-txt").text() + "&nbsp;<td width=\"25%\">"+i18n.t('statistical.tabulationDate')+"：<span class=\"\">"
          + reportBorder.find(".report-title-date-txt").text() + "</span></td>&nbsp;&nbsp;"+i18n.t('statistical.pages')+"：<span class='report-title-pager-txt'></span></div>";
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

        // gl_statisticFilterParams

        let keyList = []
        $.each(this.gl_statisticFilterParams, function(key,value){
          keyList.push(key)
        })
        let obj1 = {};
        let obj2 = {};
        for (let i = 0; i < keyList.length; i++) {
          if(this.gl_statisticFilterParams[keyList[i]] == ''){
            obj1[keyList[i]] = this.gl_statisticFilterParams[keyList[i]]
            delete this.gl_statisticFilterParams[keyList[i]]
          }
          if(this.statisticFilterParams[keyList[i]].length == 0){
            obj2[keyList[i]] = this.statisticFilterParams[keyList[i]]
            delete this.statisticFilterParams[keyList[i]]
          }
        }
        let obj3 = $.extend({}, this.gl_statisticFilterParams, this.statisticFilterParams)
        $.each(obj3, function (key, value) {
          params[key] = value ? value : '';
        })
        let that = this;
        // this.$http.get("/diagram/report/" + reportType + "/dispatcher", {params}).then(function (resp) {
        this.$http.get("/diagram/report/" + reportType + "/collation", {params}).then(function (resp) {
          that.gl_statisticFilterParams = $.extend(that.gl_statisticFilterParams, obj1)
          that.statisticFilterParams = $.extend(that.statisticFilterParams, obj2)

          
            that.dataSelectorDatas = resp.data
            if(resp.data.length == 0){
              that.$Notice.warning({
              title: i18n.t('statistical.noData'),
              desc: ''
            });
            return;
            }
            

            // alert(resp.data.length)
            // console.log(resp);
            
            if(resp.data.length){
              that.allNumber = resp.data.length
              that.statistics = that.buzNameMap[that.statisticMethod]
            }else{
              that.allNumber = 0;
              that.statistics = that.buzNameMap[that.statisticMethod]
              // that.statistics = '---'
            }
            that.updateHistogramChart(that.dataSelectorDatas);
            that.fillReportText(that.dataSelectorDatas)
        });
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
        if(reportTitle=='客诉客诉数量对比图'){
          reportTitle=='客诉数量对比图'
        }
        if(this.$store.state.locale=='en_US'){
          reportTitle =this.buzNameMap[reportType]+ ' ' + rconfig.reportTitle+' ' +this.chartType 
          if(reportTitle=='Customer Complaint Customer Complaint Quantity Chart'){
            reportTitle='Customer Complaint Quantity Chart'
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

        var reportThead = $(".statistic-histogram-page .report-data-thead");
        var reportTbody = $(".statistic-histogram-page .report-datas-body");
        reportThead.empty();
        reportTbody.empty();

        var columnCount = 2; //双栏显示
        if (columnConfig) {
          $(".statistic-histogram-page .exam-report-datas-table").show();

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
          $(".statistic-histogram-page .exam-report-datas-table").hide();
        }
      },
      updateHistogramChart(selectRows) {
        // console.log(this.buzNameMap,9987654);
        
        this.isChartShow = true;
        if (!this.histogramChart) {
          return;
        }
        if (selectRows.length == 0) {
          return;
        }
        var rconfig = reportConfig[this.statisticIndicator] || {};
        var columnConfig = rconfig.columns;
        var hideZero = rconfig.hideZero == null ? false : rconfig.hideZero;
        var valueField = rconfig.valueField || "rate";
        var seriesName = rconfig.seriesName;
        var yFormatter = rconfig.yFormatter || function (value, index) {
          if (index == 0) {
            return "0%";
          } else {
            return value + '%';
          }
        };

        var xLabels = [];

            var series = [];

            var minY = 100;

            var pac_totalCount = 0;
            var pac_totalBad = 0;

            var initLabelFlag = false;

            var tbody = $("#dashboard-line-pass-report .report-datas-body");
            tbody.empty();
            // console.log(selectRows,33453)
            // console.log(selectRows)
            $(selectRows).each(function (index, dataItem) {
                // console.log(dataItem.list,index);
                // console.log(selectRows)
              if (!initLabelFlag) {
                initLabelFlag = true;

                for (var i = 0; i < dataItem.list.length; i++) {
                  xLabels.push(dataItem.list[i].date);
                }
              }

              
              pac_totalCount += dataItem.count;
              pac_totalBad += dataItem.bad;

              var lineSeries = {
                name: dataItem.name,
                type: 'line',
                /* stack: dataItem.prodLineId,
                showAllSymbol: true, */
                data: []
              };
                
              for (var j = 0; j < dataItem.list.length; j++) {
                var fpy = dataItem.list[j].dataList;
                if (fpy != 0) {
                  minY = Math.min(fpy, minY);
                  // alert(minY)
                }
                if (fpy < 0) {
                  fpy = 0;
                }
                lineSeries.data.push(fpy);

              }
              series.push(lineSeries);
            //   console.log(lineSeries,888);
              
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
            $("#dashboard-line-pass-report .report-total-batch-txt").text(selectRows.length);
            $("#dashboard-line-pass-report .report-total-pass-txt").text(pac_totalCount - pac_totalBad);

            var totalFpyNum = numeral((pac_totalCount - pac_totalBad) / pac_totalCount * 100);
            var fpyStr = totalFpyNum.format('0.00') + "%";
            $("#dashboard-line-pass-report .report-total-fpy-txt").text(fpyStr);


        /* var maxData = 0;
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
        } */
        let that = this;
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
                    
                    if(value > 100){
                      value = '100.00'
                    }

                    if (i == 0) {
                      showHtm += name + '<br />';
                    }
                    if (value == minY) {
                      showHtm += text + ' ： 0<br />';
                    } else {
                      if(that.statisticIndicator == 'abnormal_count' || that.buzType == 'cc'){
                        showHtm += text + ' ： ' + value + '<br />';
                      }else{
                      showHtm += text + ' ： ' + value + '%' + '<br />';
                      }
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
                type: 'scroll',
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
                axisLabel: {
                  formatter: function (value, index) {
                    if(that.statisticIndicator == 'abnormal_count' || that.buzType == 'cc'){
                      if (index == 0) {
                        return 0;
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
                    
                  }
                }
              },
              color: pieColorList,
              series: series
            };
        that.histogramChart.clear();
        that.histogramChart.setOption(option);
        let width = $('.statistic-histogram-page').width();
        that.$nextTick(res=>{
          that.histogramChart.resize();
        })
      }
    },
    mounted() {
        this.statistics = this.buzNameMap[this.statisticMethod]
      this.initChart();
      const that = this;
      var resizeTimer = null;
      $(window).bind('resize', function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          let width = $('.statistic-histogram-page').width();
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
      this.$http.get("/bas/manufacturer", {params: {page: 1, limit: 99999999,toSupplierCustomerId:this.toSupplierCustomerId||''}}).then(function (resp) {
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.manufacturerList = resp.data;
        }
      });
      /* 客户 */
      this.$http.get("/bas/customerList", {params: {page: 1, limit: 99999999,toSupplierCustomerId:this.toSupplierCustomerId||''}}).then(function (resp) {
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.customerList = resp.data;
          // console.log(resp.data,66666666666);
          
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
      //异常原因接口
      this.$http.get("/basic/abnormal",{params: {page: 1, limit: 99999999,toSupplierCustomerId:this.toSupplierCustomerId||''}}).then(function (resp) {
        if (resp && resp.data && resp.data.length > 0) {
          that.selectorsData.specialCauseList = resp.data;
        }
      });
      //过程批号接口
      this.$http.get("/examinecenter/pqc/prodbatch",{params:{page:1,limit:99999999,query:'toSupplierCustomerId='+this.toSupplierCustomerId||''}}).then(function (resp) { 
          if (resp && resp.data && resp.data.length > 0) {
            that.selectorsData.batchList = resp.data;
            
          }
       });

       //过程直通率检验员接口
       this.$http.get("/tenant/user",{params:{page:1,limit:99999999,toSupplierCustomerId:this.toSupplierCustomerId||''}}).then(function (resp) { 
           if (resp && resp.data && resp.data.length > 0) {
            that.selectorsData.inspectorList = resp.data;
          }
        });

        //过程允收率检验班别
        this.$http.get("/basic/chkshift",{params:{page:1,limit:99999999,toSupplierCustomerId:this.toSupplierCustomerId||''}}).then(function (resp) { 
                if (resp && resp.data && resp.data.length > 0) {
                that.selectorsData.chkshiftList = resp.data;
                // console.log(resp.data,123);
                
            }
         })

    },
    watch: {
      buzType(val) {
        let that = this;
        this.statisticFilterParams.productTypeId = [];
        this.statisticFilterParams.productId = [];
        this.statisticFilterParams.manufacturerId = [];
        this.statisticFilterParams.abnormalCauseId = [];
        this.statisticFilterParams.treatmentMethod = [];
        this.statisticFilterParams.prodLineId = [];
        this.statisticFilterParams.prodProcessId = [];
        this.statisticFilterParams.prodBatchId = [];
        this.statisticFilterParams.customerId = [];
        this.statisticFilterParams.inspectorId = [];
        this.statisticFilterParams.chkShiftId = [];

        this.gl_statisticFilterParams.productTypeId = '';
        this.gl_statisticFilterParams.productId = '';
        this.gl_statisticFilterParams.manufacturerId = '';
        this.gl_statisticFilterParams.abnormalCauseId = '';
        this.gl_statisticFilterParams.treatmentMethod = '';
        this.gl_statisticFilterParams.prodLineId = '';
        this.gl_statisticFilterParams.prodProcessId = '';
        this.gl_statisticFilterParams.prodBatchId = '';
        this.gl_statisticFilterParams.customerId = '';
        this.gl_statisticFilterParams.inspectorId = '';
        this.gl_statisticFilterParams.chkShiftId = '';

        let indicators = this.buzParams[this.buzType];
        // console.log(indicators,44567);
        
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
        this.statisticFilterParams.productTypeId = [];
        this.statisticFilterParams.productId = [];
        this.statisticFilterParams.manufacturerId = [];
        this.statisticFilterParams.abnormalCauseId = [];
        this.statisticFilterParams.treatmentMethod = [];
        this.statisticFilterParams.prodLineId = [];
        this.statisticFilterParams.prodProcessId = [];
        this.statisticFilterParams.prodBatchId = [];
        this.statisticFilterParams.customerId = [];
        this.statisticFilterParams.inspectorId = [];
        this.statisticFilterParams.chkShiftId = [];

        this.gl_statisticFilterParams.productTypeId = '';
        this.gl_statisticFilterParams.productId = '';
        this.gl_statisticFilterParams.manufacturerId = '';
        this.gl_statisticFilterParams.abnormalCauseId = '';
        this.gl_statisticFilterParams.treatmentMethod = '';
        this.gl_statisticFilterParams.prodLineId = '';
        this.gl_statisticFilterParams.prodProcessId = '';
        this.gl_statisticFilterParams.prodBatchId = '';
        this.gl_statisticFilterParams.customerId = '';
        this.gl_statisticFilterParams.inspectorId = '';
        this.gl_statisticFilterParams.chkShiftId = '';
        
        let indicators = this.buzParams[this.buzType];
        let methods = indicators[val];
        if (methods[this.statisticMethod] === undefined) {
          this.statisticMethod = Object.keys(methods)[0];
        }
      },
      "statisticDays.daysRange": function (argument) {
        this.statisticDays.custom[0] = null;
        this.statisticDays.custom[1] = null;
      },


      //监听对比方式的变化
      statisticMethod:function () { 
        // byProduct
          if (this.statisticMethod != 'byProductType') this.statisticFilterParams.productTypeId = [];
          if (this.statisticMethod != 'byProduct') this.statisticFilterParams.productId = [];
          if (this.statisticMethod != 'byManufacturer') this.statisticFilterParams.manufacturerId = [];
          if (this.statisticMethod != 'byCause') this.statisticFilterParams.abnormalCauseId = [];
          if (this.statisticMethod != 'byHandle') this.statisticFilterParams.treatmentMethod = [];
          if (this.statisticMethod != 'byLine') this.statisticFilterParams.prodLineId = [];
          if (this.statisticMethod != 'byProcess') this.statisticFilterParams.prodProcessId = [];
          if (this.statisticMethod != 'byBatch') this.statisticFilterParams.prodBatchId = [];
          if (this.statisticMethod != 'byCustomer') this.statisticFilterParams.customerId = [];
          if (this.statisticMethod != 'byInspector') this.statisticFilterParams.inspectorId = [];
          if (this.statisticMethod != 'byClass') this.statisticFilterParams.chkShiftId = [];

         /*  if (this.statisticMethod == 'byProductType')
          if (this.statisticMethod == 'byProduct')
          if (this.statisticMethod == 'byManufacturer')
          if (this.statisticMethod == 'byCause')
          if (this.statisticMethod == 'byHandle')
          if (this.statisticMethod == 'byLine')
          if (this.statisticMethod == 'byProcess')
          if (this.statisticMethod == 'byBatch')
          if (this.statisticMethod == 'byCustomer')
          if (this.statisticMethod == 'byInspector')
          if (this.statisticMethod == 'byClass') */

           this.gl_statisticFilterParams.productTypeId = '';
           this.gl_statisticFilterParams.productId = '';
           this.gl_statisticFilterParams.manufacturerId = '';
           this.gl_statisticFilterParams.abnormalCauseId = '';
           this.gl_statisticFilterParams.treatmentMethod = '';
           this.gl_statisticFilterParams.prodLineId = '';
           this.gl_statisticFilterParams.prodProcessId = '';
           this.gl_statisticFilterParams.prodBatchId = '';
           this.gl_statisticFilterParams.customerId = '';
           this.gl_statisticFilterParams.inspectorId = '';
           this.gl_statisticFilterParams.chkShiftId = '';
          // this.statistics = this.buzNameMap[this.statisticMethod]
       },

      


   /*  beforeDestroy() {

    } */
    }

  }
</script>
<style>
  .report-export-bth {
    padding: 0px 20px;
    margin-left: 8px;
  }

  .statistic-histogram-page {
    margin-bottom: 10px;
    padding-bottom: 48px
  }

  .statistic-histogram-page .ivu-line {
    padding-bottom: 3px;
  }

  .statistic-histogram-page .exam-report-main {
    margin-top: 10px;
    /* margin-right: 10px; */
    background-color: #fff;
    color: #333;
  }

  .statistic-histogram-page .iqis-table-no-data {
    text-align: center;
    color: #333;
    font-size: 16px;
  }

  .statistic-histogram-page .exam-report-title-table,
  .statistic-histogram-page .exam-report-total-table,
  .statistic-histogram-page .exam-report-datas-table,
  .statistic-histogram-page .exam-report-footer {
    width: 100%;
    border: 0;
    border-collapse: collapse;
  }

  .statistic-histogram-page .exam-report-border {
    border: 1px solid #666;
    margin-bottom: 0;
  }

  .statistic-histogram-page .exam-report-total-border {
    border: 1px solid #666;
    margin-left: 18px;
    margin-right: 18px;
    padding: 6px 10px;
  }

  .statistic-histogram-page .exam-total-item {
    margin-right: 30px;
  }

  .statistic-histogram-page .total-label {
    padding-right: 8px;
  }

  .statistic-histogram-page .exam-report-title-table .exam-report-date-cell {
    text-align: center;
  }

  .statistic-histogram-page .exam-report-title-table td {
    border: 0;
    vertical-align: bottom;
    line-height: 30px;
    border-collapse: collapse;
  }

  .statistic-histogram-page .exam-report-title-table .exam-report-title-cell {
    font-size: 32px;
    line-height: 40px;
    text-align: center;
  }

  .statistic-histogram-page .exam-report-datas-div {
    width: 100%;
    padding: 0 12px;
    margin-top: 10px;
  }

  .statistic-histogram-page .exam-report-datas-table {
    border: 1px;
    border-color: #333;
  }

  .statistic-histogram-page .exam-report-datas-table th,
  .statistic-histogram-page .exam-report-datas-table td {
    border: 1px solid #333;
    padding: 3px;
    text-align: center;
  }

  .statistic-histogram-page .exam-report-datas-table th {
    background-color: #efefef;
  }

  .statistic-histogram-page .exam-report-datas-table td.table-gap,
  .statistic-histogram-page .exam-report-datas-table th.table-gap {
    border-top: 0;
    border-bottom: 0;
    width: 10px;
    background-color: #fff;
  }

  .statistic-histogram-page .exam-report-footer {
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
