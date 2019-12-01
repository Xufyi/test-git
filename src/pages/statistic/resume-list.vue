<template>
  <div class="iqis-page">
    <Row :gutter="24" style="height:70px; margin-bottom:15px; border-bottom: 1px solid #e9e9e9;">
      <i-col span="10" class="selectBox">
        <div class="productlayout">

          <div class="fl nameWidth"><span>{{$t('statistical.productNo')}}</span></div>
          <div class="marginLF">
            <Select style="width:150px" remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pleaseChoose')" v-model="basic.productId" filterable >
                <Option v-for="items in productSimple" :value="items.productId" :label="items.no" :key="items.productId">{{ items.no}}</Option>
            </Select>
          </div>
        </div>
      </i-col>

      <i-col span="10" class="selectBox">
        <div class="productlayout">

          <div class="fl nameWidth"><span>{{$t('statistical.productName')}}</span></div>
          <div class="marginLF">
            <Select style="width:150px" remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pleaseChoose')" v-model="basic.productId" filterable >
                <Option v-for="items in productSimple" :value="items.productId" :label="items.name" :key="items.productId">{{ items.name}}</Option>
            </Select>
          </div>

        </div>
      </i-col>

      <i-col span="4" style="margin-left:10px">
        <div class="productlayout">
          <Button type="primary" size="large" @click="likerecord">{{$t('statistical.viewResume')}}</Button>
        </div>
      </i-col>
    </Row>
    <div v-if="promptmessage" style="text-align:center; width:100%; color: #959595;">{{$t('statistical.pleaseSelect')}}</div>

    <!-- <div class="iqis-page"> -->
    <span v-show="hideshowtoggle" class="iqis-page-headline">{{$t('statistical.productBasic')}}</span>
    <div v-show="hideshowtoggle" class="iqis-page-message">
      <Row style="margin-bottom:20px;">
        <i-col span="24">
          <div class="creationtime">
            <p>创建时间：</p>
            <p>{{product.updateTime}}</p>
          </div>
        </i-col>
      </Row>
      <Row :gutter="16" style="margin-bottom:20px;">
        <i-col :sm="5" :xs='5' style="min-width:220px">{{$t('statistical.productNo')}}：&nbsp;<span v-model="product.no"> {{product.no}}</span></i-col>
        <i-col :sm="5" :xs='5' style="min-width:300px">{{$t('statistical.productName')}}：<span v-model="product.name"> {{product.name}}</span></i-col>
        <i-col :sm="5" :xs='5' style="min-width:220px">{{$t('statistical.productSpec')}}：<span v-model="product.spec"> {{product.spec}}</span></i-col>
        <i-col :sm="5" :xs='5' style="min-width:220px">{{$t('statistical.productType')}}：<span v-model="product.prodTypeName"> {{product.prodTypeName}}</span></i-col>
      </Row>
      <!-- <Row style="margin-bottom:20px;">
        <i-col :sm="5" :xs='5' style="min-width:220px">产品编号：&nbsp;<span v-model="product.no"> {{product.no}}</span></i-col>
        <i-col :sm="5" :xs='5' style="min-width:220px">产品名称：<span v-model="product.name"> {{product.name}}</span></i-col>
        <i-col :sm="5" :xs='5' style="min-width:220px">规格型号：<span v-model="product.spec"> {{product.spec}}</span></i-col>
        <i-col :sm="5" :xs='5' style="min-width:220px">产品类别：<span v-model="product.prodTypeName"> {{product.prodTypeName}}</span></i-col>
      </Row> -->
      <Row>
        <i-col span="24">
          <Row>
            <i-col span="24">
              <Row>
                <i-col span="24" style="minWidth:70px;margin-right:8px;">
                  <span style="margin-right:3px; display:inline-block; margin-bottom:20px;">{{$t('statistical.productBatch')}}：</span>
                  <span class="sn2">
                    <p v-for="(item,index) in bachlist" :key="index">{{item}}</p>
                  </span>
                </i-col>
              </Row>
            </i-col>
          </Row>
        </i-col>
      </Row>

      <Row style="margin-bottom:20px;">
        <i-col :sm="2" :xs='4' style="min-width:80px">{{$t('statistical.launchResume')}}：</i-col>
        <i-col :sm="2" :xs='4' style="min-width:100px">
          <Checkbox v-if="!this.$store.state.customerId" @on-change="iqcbtn" v-model="aResume.iqcResume" :disabled='aResume.iqcdisabled'
                    id="iqcbtnref" ref="iqcbtnref">{{$t('statistical.iqcResume')}}
          </Checkbox>
        </i-col>
        <i-col :sm="2" :xs='4' style="min-width:100px">
          <Checkbox ref="pqcbtnref" id="pqcbtnref" @on-change="pqcbtn" v-model="aResume.pqcResume"
                    :disabled='aResume.pqcdisabled'>{{$t('statistical.pqcResume')}}
          </Checkbox>
        </i-col>
        <i-col :sm="2" :xs='4' style="min-width:100px">
          <Checkbox ref="oqcbtnref" id="oqcbtnref" @on-change="oqcbtn" v-model="aResume.oqcResume"
                    :disabled='aResume.oqcdisabled'>{{$t('statistical.oqcResume')}}
          </Checkbox>
        </i-col>
        <i-col :sm="2" :xs='4' style="min-width:100px">
          <CheckboxGroup v-if="!this.$store.state.customerId">
            <Checkbox disabled :label="i18n.t('statistical.ccResume')" v-model="aResume.ccResume"></Checkbox>
          </CheckboxGroup>
        </i-col>
      </Row>

      <div v-show='aResume.iqcshow'>
        <span class="iqis-page-headline">{{$t('statistical.iqcResume')}}<!-- <Button style="margin-left:10px;" type="info" size='small'
                                                     icon="arrow-down-a"
                                                     @click="onExportReport('iqc-chart')">导出</Button> --></span>
        <Row style="margin-top:24px; margin-bottom:20px;">
          <i-col :sm="3" :xs='4' style="min-width:132px">{{$t('statistical.iqcTotal')}}：<span
            v-model="iqcResume.totalQuantity"> {{iqcResume.totalQuantity}}</span></i-col>
          <i-col :sm="3" :xs='4' style="min-width:132px">{{$t('statistical.badTotal')}}：<span
            v-model="iqcResume.badTotalQuantity"> {{iqcResume.badTotalQuantity}}</span></i-col>
          <i-col :sm="3" :xs='4' style="min-width:132px">{{$t('statistical.badRate')}}：<span
            v-model="iqcResume.badRate"> {{iqcResume.badRate}}</span></i-col>
          <i-col :sm="3" :xs='4' style="min-width:132px;"><span style="cursor:pointer;"
                                                                @click="openNewTabiqc('productNo',basic.productId,'','')">{{$t('statistical.happenAbnormal')}}：</span><span
            class="unusualcolor"
            v-model="iqcResume.occurredAbnormalQuantity"> {{iqcResume.occurredAbnormalQuantity}}</span></i-col>
          <i-col :sm="3" :xs='4' style="min-width:132px"><span style="cursor:pointer;"
                                                               @click='openNewTabiqc("productNo",basic.productId,"","1")'>{{$t('statistical.majorAbnormal')}}：</span><span
            v-model="iqcResume.majorAbnormalQuantity" class="unusualcolor"> {{iqcResume.majorAbnormalQuantity}}</span>
          </i-col>
        </Row>
        <Row>
          <i-col :sm="3" style="min-width:150px">{{$t('statistical.checkBatchTotal')}}：<span
            v-model="iqcResume.checkBatchQuantity"> {{iqcResume.checkBatchQuantity}}</span></i-col>
          <i-col :sm="3" style="min-width:132px">{{$t('statistical.approvalBatchTotal')}}：<span
            v-model="iqcResume.approvalBatchQuantity"> {{iqcResume.approvalBatchQuantity}}</span></i-col>
          <i-col :sm="3" style="min-width:130px">{{$t('statistical.approvalRate')}}：<span
            v-model="iqcResume.approvalRate"> {{iqcResume.approvalRate}}</span></i-col>
          <i-col :sm="2" style="min-width:90px"><span style="cursor:pointer;"
                                                      @click="openNewTabiqc('productNo',basic.productId,'REJECT','')">{{$t('statistical.return')}}：</span><span
            v-model="iqcResume.returnQuantity" class="unusualcolor"> {{iqcResume.returnQuantity}}</span></i-col>
          <i-col :sm="2" style="min-width:90px"><span style="cursor:pointer;"
                                                      @click="openNewTabiqc('productNo',basic.productId,'SPECIAL_ADOPTION','')">{{$t('statistical.special')}}：</span><span
            v-model="iqcResume.specialProductionQuantity"
            class="unusualcolor"> {{iqcResume.specialProductionQuantity}}</span></i-col>
          <i-col :sm="2" style="min-width:100px"><span style="cursor:pointer;"
                                                       @click="openNewTabiqc('productNo',basic.productId,'REWORK','')">{{$t('statistical.rework')}}：</span><span
            v-model="iqcResume.reworkQuantity" class="unusualcolor"> {{iqcResume.reworkQuantity}}</span></i-col>
          <i-col :sm="2" style="min-width:100px"><span style="cursor:pointer;"
                                                       @click="openNewTabiqc('productNo',basic.productId,'SCREEN','')">{{$t('statistical.filter')}}：</span><span
            v-model="iqcResume.screeningQuantity" class="unusualcolor"> {{iqcResume.screeningQuantity}}</span></i-col>
          <i-col :sm="2" style="min-width:100px"><span style="cursor:pointer;"
                                                       @click="openNewTabiqc('productNo',basic.productId,'EMERGENCY_RELEASE','')">{{$t('statistical.release')}}：</span><span
            v-model="iqcResume.emergencyQuantity" class="unusualcolor"> {{iqcResume.emergencyQuantity}}</span></i-col>
          <i-col :sm="2" style="min-width:90px"><span style="cursor:pointer;"
                                                      @click="openNewTabiqc('productNo',basic.productId,'SCRAP','')">{{$t('statistical.scrap')}}：</span><span
            v-model="iqcResume.scrapQuantity" class="unusualcolor"> {{iqcResume.scrapQuantity}}</span></i-col>
        </Row>

        <Row :gutter='24' style="margin-top:40px;">
          <i-col span="24" id='iqc-chart'>
            <div style="height:300px;" ref="myChart" id="myChart" class="exam-report-chart-div"></div>
          </i-col>
        </Row>

        <Row :gutter='24' style="margin-top:20px; margin-bottom:22px;">
          <i-col span="24">
            <div class="supplierdetails" id="supplierdetails">
              <p>{{$t('statistical.supplierDetails')}}</p>
              <p>{{$t('statistical.thereAre')}}<span v-model="incomingsupplier" class="unusualcolor"> {{incomingsupplier}} </span>{{$t('statistical.suppliers')}}</p>
              <p>
                <!-- <Button style="margin-left:10px;" type="info" size='small' icon="arrow-down-a"
                        @click="onExportReport('iqc-chartlist')">导出
                </Button> -->
              </p>
            </div>
          </i-col>
        </Row>

        <Row :gutter='24'>
          <i-col span="24">
            <Table border stripe :columns="columns1" :data="data1"></Table>
          </i-col>
        </Row>

        <Row :gutter='24' style="margin-top:40px;">
          <i-col span="24" id="iqc-chartlist">
            <!-- <div style="height:300px" ref="myChart2"></div> -->
            <div class="exam-report-chart-div" style="height:300px;" v-for="(item,index) in chart2HistogramData"
                 :id="item.chartName" :key="index"></div>
          </i-col>
        </Row>
      </div>

      <div v-show="aResume.pqcshow">
        <span class="iqis-page-headline iqis-page-headlinecourse">{{$t('statistical.pqcResume')}}</span>

        <Row style="margin-top:24px; margin-bottom:20px;">
          <i-col :sm="3" :xs='4' style="min-width:132px">{{$t('statistical.productTotal')}}：<span
            v-model="pqcResume.totalQuantity"> {{pqcResume.totalQuantity}}</span></i-col>
          <i-col :sm="3" :xs='4' style="min-width:132px">{{$t('statistical.badTotal')}}：<span
            v-model="pqcResume.badTotalQuantity"> {{pqcResume.badTotalQuantity}}</span></i-col>
          <i-col :sm="3" :xs='4' style="min-width:132px">{{$t('statistical.badRate')}}：<span
            v-model="pqcResume.badRate"> {{pqcResume.badRate}}</span></i-col>
          <i-col :sm="3" :xs='4' style="min-width:132px"><span style="cursor:pointer;"
                                                               @click="openNewTabpqc('productNo',basic.productId,'','')">{{$t('statistical.happenAbnormal')}}：</span><span
            v-model="pqcResume.occurredAbnormalQuantity"
            class="unusualcolor"> {{pqcResume.occurredAbnormalQuantity}}</span></i-col>
          <i-col :sm="3" :xs='4' style="min-width:132px"><span style="cursor:pointer;"
                                                               @click="openNewTabpqc('productNo',basic.productId,'','1')">{{$t('statistical.majorAbnormal')}}：</span><span
            v-model="pqcResume.majorAbnormalQuantity"
            class="unusualcolor">{{pqcResume.majorAbnormalQuantity}}</span>
          </i-col>
        </Row>

        <Row style="margin-bottom:20px;">
          <i-col :sm="3" style="min-width:150px">{{$t('statistical.checkBatchTotal')}}：<span
            v-model="pqcResume.checkBatchQuantity"> {{pqcResume.checkBatchQuantity}}</span></i-col>
          <i-col :sm="3" style="min-width:132px">{{$t('statistical.approvalBatchTotal')}}：<span
            v-model="pqcResume.approvalBatchQuantity"> {{pqcResume.approvalBatchQuantity}}</span></i-col>
          <i-col :sm="3" style="min-width:130px">{{$t('statistical.approvalRate')}}：<span
            v-model="pqcResume.approvalRate"> {{pqcResume.approvalRate}}</span></i-col>
          <i-col :sm="2" style="min-width:90px"><span style="cursor:pointer;"
                                                      @click="openNewTabpqc('productNo',basic.productId,'REJECT','')">{{$t('statistical.return')}}：</span><span
            v-model="iqcResume.returnQuantity" class="unusualcolor"> {{pqcResume.returnQuantity}}</span>
          </i-col>
          <i-col :sm="2" style="min-width:90px"><span style="cursor:pointer;"
                                                      @click="openNewTabpqc('productNo',basic.productId,'SPECIAL_ADOPTION','')">{{$t('statistical.special')}}：</span><span
            v-model="iqcResume.returnQuantity" class="unusualcolor"> {{pqcResume.specialProductionQuantity}}</span>
          </i-col>
          <i-col :sm="2" style="min-width:100px"><span style="cursor:pointer;"
                                                       @click="openNewTabpqc('productNo',basic.productId,'REWORK','')">{{$t('statistical.rework')}}：</span><span
            v-model="iqcResume.returnQuantity" class="unusualcolor"> {{pqcResume.reworkQuantity}}</span>
          </i-col>
          <i-col :sm="2" style="min-width:100px"><span style="cursor:pointer;"
                                                       @click="openNewTabpqc('productNo',basic.productId,'SCREEN','')">{{$t('statistical.filter')}}：</span><span
            v-model="iqcResume.returnQuantity" class="unusualcolor"> {{pqcResume.screeningQuantity}}</span>
          </i-col>
          <i-col :sm="2" style="min-width:100px"><span style="cursor:pointer;"
                                                       @click="openNewTabpqc('productNo',basic.productId,'EMERGENCY_RELEASE','')">{{$t('statistical.release')}}：</span><span
            v-model="iqcResume.returnQuantity" class="unusualcolor"> {{pqcResume.emergencyQuantity}}</span>
          </i-col>
          <i-col :sm="2" style="min-width:90px"><span style="cursor:pointer;"
                                                      @click="openNewTabpqc('productNo',basic.productId,'SCRAP','')">{{$t('statistical.scrap')}}：</span><span
            v-model="iqcResume.returnQuantity" class="unusualcolor"> {{pqcResume.scrapQuantity}}</span>
          </i-col>
        </Row>

        <Row style="margin-bottom:20px;">
          <!--<i-col :sm="3" :xs='4' style="min-width:125px">工序不良直方图</i-col>-->
          <!--<i-col :sm="3" :xs='4' style="min-width:125px">缺陷排列图</i-col>-->
          <!--<i-col :sm="3" :xs='4' style="min-width:125px">线别直通率趋势图</i-col>-->
          <!--<i-col :sm="3" :xs='4' style="min-width:125px">CPK趋势图</i-col>-->
        </Row>
        <!-- 过程履历工序不良直方图 -->
        <Row :gutter='24'>
          <i-col span="24">
            <div style="height:300px;" ref="myChart3"></div>
          </i-col>
        </Row>
        <!-- 过程履历缺陷排列图 -->
        <Row :gutter='24' style="margin-top:40px;">
          <i-col span="24">
            <div style="height:300px;" ref="myChart4"></div>
          </i-col>
        </Row>
        <!-- 过程履历线别直通率趋势图 -->
        <Row :gutter='24' style="margin-top:40px;">
          <i-col span="24">
            <div style="height:300px;" ref="myChart5"></div>
          </i-col>
        </Row>
        <!-- 过程履历CPK趋势图 -->
        <!-- <Row v-if="true" :gutter='24' style="margin-top:40px;">
            <i-col span="24">
                <div style="height:300px;" ref="myChart6"></div>
            </i-col>
        </Row> -->
      </div>

      <div v-show="aResume.oqcshow">
        <span class="iqis-page-headline iqis-page-headlinecourse">{{$t('statistical.oqcResume')}}<!-- <Button style="margin-left:10px;" type="info"
                                                                              size='small' icon="arrow-down-a"
                                                                              @click="onExportReport('oqc-chart')">导出</Button> --></span>

        <Row style="margin-top:24px; margin-bottom:20px;">
          <i-col :sm="3" :xs='4' style="min-width:132px">{{$t('statistical.outgoingTotal')}}：<span
            v-model="oqcResume.totalQuantity"> {{oqcResume.totalQuantity}}</span></i-col>
          <i-col :sm="3" :xs='4' style="min-width:132px">{{$t('statistical.badTotal')}}：<span
            v-model="oqcResume.badTotalQuantity"> {{oqcResume.badTotalQuantity}}</span></i-col>
          <i-col :sm="3" :xs='4' style="min-width:132px">{{$t('statistical.badRate')}}：<span
            v-model="oqcResume.badRate"> {{oqcResume.badRate}}</span></i-col>
          <i-col :sm="3" :xs='4' style="min-width:132px"><span style="cursor:pointer;"
                                                               @click="openNewTaboqc(basic.productId,'','')">{{$t('statistical.happenAbnormal')}}：</span><span
            v-model="oqcResume.occurredAbnormalQuantity"
            class="unusualcolor"> {{oqcResume.occurredAbnormalQuantity}}</span>
          </i-col>
          <i-col :sm="3" :xs='4' style="min-width:132px"><span style="cursor:pointer;"
                                                               @click="openNewTaboqc(basic.productId,'','1')">{{$t('statistical.majorAbnormal')}}：</span><span
            v-model="oqcResume.majorAbnormalQuantity"
            class="unusualcolor"> {{oqcResume.majorAbnormalQuantity}}</span>
          </i-col>
        </Row>

        <Row>
          <i-col :sm="3" style="min-width:150px">{{$t('statistical.checkBatchTotal')}}：<span
            v-model="oqcResume.checkBatchQuantity"> {{oqcResume.checkBatchQuantity}}</span></i-col>
          <i-col :sm="3" style="min-width:132px">{{$t('statistical.approvalBatchTotal')}}：<span
            v-model="oqcResume.approvalBatchQuantity"> {{oqcResume.approvalBatchQuantity}}</span></i-col>
          <i-col :sm="3" style="min-width:130px">{{$t('statistical.approvalRate')}}：<span
            v-model="oqcResume.approvalRate"> {{oqcResume.approvalRate}}</span></i-col>
          <i-col :sm="2" style="min-width:90px"><span style="cursor:pointer;"
                                                      @click="openNewTaboqc(basic.productId,'REJECT','')">{{$t('statistical.return')}}：</span><span
            v-model="oqcResume.returnQuantity"
            class="unusualcolor"> {{oqcResume.returnQuantity}}</span>
          </i-col>
          <i-col :sm="2" style="min-width:90px"><span style="cursor:pointer;"
                                                      @click="openNewTaboqc(basic.productId,'SPECIAL_ADOPTION','')">{{$t('statistical.special')}}：</span><span
            v-model="oqcResume.returnQuantity"
            class="unusualcolor">{{oqcResume.specialProductionQuantity}}</span>
          </i-col>
          <i-col :sm="2" style="min-width:100px"><span style="cursor:pointer;"
                                                       @click="openNewTaboqc(basic.productId,'REWORK','')">{{$t('statistical.rework')}}：</span><span
            v-model="oqcResume.reworkQuantity"
            class="unusualcolor"> {{oqcResume.reworkQuantity}}</span>
          </i-col>
          <i-col :sm="2" style="min-width:100px"><span style="cursor:pointer;"
                                                       @click="openNewTaboqc(basic.productId,'SCREEN','')">{{$t('statistical.filter')}}：</span><span
            v-model="oqcResume.screeningQuantity"
            class="unusualcolor"> {{oqcResume.screeningQuantity}}</span>
          </i-col>
          <i-col :sm="2" style="min-width:100px"><span style="cursor:pointer;"
                                                       @click="openNewTaboqc(basic.productId,'EMERGENCY_RELEASE','')">{{$t('statistical.release')}}：</span><span
            v-model="oqcResume.emergencyQuantity"
            class="unusualcolor"> {{oqcResume.emergencyQuantity}}</span>
          </i-col>
          <i-col :sm="2" style="min-width:90px"><span style="cursor:pointer;"
                                                      @click="openNewTaboqc(basic.productId,'SCRAP','')">{{$t('statistical.scrap')}}：</span><span
            v-model="oqcResume.scrapQuantity"
            class="unusualcolor"> {{oqcResume.scrapQuantity}}</span>
          </i-col>
        </Row>

        <Row :gutter='24' style="margin-top:40px;">
          <i-col span="24" id='oqc-chart'>
            <div style="height:300px;" ref="myChart7" id="myChart7" class="exam-report-chart-div"></div>
          </i-col>
        </Row>
      </div>

      <div v-show="aResume.ccshow">
      <span class="iqis-page-headline iqis-page-headlinecourse">{{$t('statistical.ccResume')}}<!-- <Button style="margin-left:10px;" type="info"
                                                                            size='small' icon="arrow-down-a"
                                                                            @click="onExportReport('cc-chart')">导出</Button> --></span>

        <Row style="margin-top:24px; margin-bottom:20px;">
          <i-col :sm="3" :xs='4' style="min-width:132px"><span style="cursor:pointer;"
                                                               @click="openNewTabcc(basic.productId,'','')">{{$t('statistical.happenAbnormal')}}：</span><span
            v-model="cusComplainResume.occurredAbnormalQuantity"
            class="unusualcolor"> {{cusComplainResume.occurredAbnormalQuantity}}</span>
          </i-col>
          <i-col :sm="3" :xs='4' style="min-width:132px"><span style="cursor:pointer;"
                                                               @click="openNewTabcc(basic.productId,'','1')">{{$t('statistical.majorAbnormal')}}：</span><span
            v-model="cusComplainResume.majorAbnormalQuantity"
            class="unusualcolor"> {{cusComplainResume.majorAbnormalQuantity}}</span>
          </i-col>
        </Row>

        <Row>
          <i-col :sm="3" style="min-width:100px"><span style="cursor:pointer;"
                                                       @click="openNewTabcc(basic.productId,'REJECT','')">{{$t('statistical.return')}}：</span><span
            v-model="cusComplainResume.returnQuantity"
            class="unusualcolor"> {{cusComplainResume.returnQuantity}}</span>
          </i-col>
          <i-col :sm="3" style="min-width:100px"><span style="cursor:pointer;"
                                                       @click="openNewTabcc(basic.productId,'SPECIAL_ADOPTION','')">{{$t('statistical.special')}}：</span><span
            v-model="cusComplainResume.specialProductionQuantity"
            class="unusualcolor"> {{cusComplainResume.specialProductionQuantity}}</span></i-col>
          <i-col :sm="3" style="min-width:100px"><span style="cursor:pointer;"
                                                       @click="openNewTabcc(basic.productId,'REWORK','')">{{$t('statistical.rework')}}：</span><span
            v-model="cusComplainResume.reworkQuantity"
            class="unusualcolor"> {{cusComplainResume.reworkQuantity}}</span>
          </i-col>
          <i-col :sm="3" style="min-width:110px"><span style="cursor:pointer;"
                                                       @click="openNewTabcc(basic.productId,'SCREEN','')">{{$t('statistical.filter')}}：</span><span
            v-model="cusComplainResume.screeningQuantity"
            class="unusualcolor"> {{cusComplainResume.screeningQuantity}}</span></i-col>
          <i-col :sm="3" style="min-width:120px"><span style="cursor:pointer;"
                                                       @click="openNewTabcc(basic.productId,'EMERGENCY_RELEASE','')">{{$t('statistical.release')}}：</span><span
            v-model="cusComplainResume.emergencyQuantity"
            class="unusualcolor"> {{cusComplainResume.emergencyQuantity}}</span></i-col>
          <i-col :sm="3" style="min-width:90px"><span style="cursor:pointer;"
                                                      @click="openNewTabcc(basic.productId,'SCRAP','')">{{$t('statistical.scrap')}}：</span><span
            v-model="cusComplainResume.scrapQuantity"
            class="unusualcolor"> {{cusComplainResume.scrapQuantity}}</span>
          </i-col>
        </Row>
        <Row :gutter='24' style="margin-top:20px;">
          <i-col span="24" id="cc-chart">
            <div style="height:300px;" ref="myChart8" id="myChart8" class="exam-report-chart-div"></div>
          </i-col>
        </Row>

        <Row :gutter='24' style="margin-top:20px; margin-bottom:22px;">
          <i-col span="24">
            <div class="supplierdetails">
              <p>{{$t('statistical.customerDetails')}}</p>
              <p>{{$t('statistical.thereAre')}}<span v-model="complaintsupplier" class="unusualcolor"> {{complaintsupplier}} </span>>{{$t('statistical.customers')}}</p>
            </div>
          </i-col>
        </Row>

        <Row :gutter='24'>
          <i-col span="24">
            <Table border stripe :columns="columns2" :data="data2"></Table>
          </i-col>
        </Row>
      </div>
    </div>
    <!-- </div>    -->


  </div>

</template>

<script>

  import echart from 'echarts'
  import $ from 'jquery'

  export default {
    data() {
      let vm = this;
      return {
        i18n:window.i18n,
        headers: {"headers": {"Content-Type": "application/json; charset=UTF-8"}},
        productSimple:[],
        loadingRemote:false,
        source:null,
        dataarray:[1,2,3,4,5,6,7,8,9,],
        bachlist: [],
        aResume: {
          iqcResume: false,
          pqcResume: false,
          oqcResume: false,
          ccResume: false,
          iqcdisabled: false,
          pqcdisabled: false,
          oqcdisabled: false,
          ccdisabled: false,
          iqcshow: false,
          pqcshow: false,
          oqcshow: false,
          ccshow: false
        },
        winWidth: null, //浏览器宽度
        productList: [],
        promptmessage: true,
        hideshowtoggle: false,
        incomingsupplier: 0, //来料供应商总数
        complaintsupplier: 0, //客诉供应商总数
        // value:0,
        "basic": {
          productId: '',
          productNo: '',
          productName: '',
          productUnitName: ''
        },

        date: new Date(),
        currentDate: new Date(), //当前日期
        resumeprofile: {},
        //产品基本信息
        "product": {
          "no": "",
          "name": "",
          "spec": "",
          "prodTypeName": "",
          "prodUnitId": 53,
          "prodUnitName": "条",
          "updateTime": '',
        },

        //來料履历
        "iqcResume": {
          "totalQuantity": '', //来料总数
          "badTotalQuantity": '', //不良总数
          "badRate": "", //不良率
          "occurredAbnormalQuantity": '', //发生异常数量
          "majorAbnormalQuantity": '', //重大异常数量
          "checkBatchQuantity": '', //总检验批次
          "approvalBatchQuantity": '', //允收批次
          "approvalRate": "", //允收率
          "returnQuantity": '', //退货
          "specialProductionQuantity": '', //特采
          "reworkQuantity": '', //返工
          "screeningQuantity": '', //筛选
          "emergencyQuantity": '', //紧急放行
          "scrapQuantity": '' //报废
        },


        //过程履历
        "pqcResume": {
          "totalQuantity": '', //总生产数
          "badTotalQuantity": '', //总不良数
          "badRate": "", //不良率
          "occurredAbnormalQuantity": '', //发生异常数量
          "majorAbnormalQuantity": '', //重大异常数量
          "checkBatchQuantity": '', //总检验批次
          "approvalBatchQuantity": '', //允收批次
          "approvalRate": "", //允收率
          "returnQuantity": '', //退货
          "specialProductionQuantity": '', //特采
          "reworkQuantity": '', //返工
          "screeningQuantity": '', //筛选
          "emergencyQuantity": '', //紧急放行
          "scrapQuantity": '' //报废
        },


        //出货履历
        "oqcResume": {
          "totalQuantity": '', //总出货数
          "badTotalQuantity": '', //总不良数
          "badRate": "", //不良率
          "occurredAbnormalQuantity": '', //发生异常数量
          "majorAbnormalQuantity": '', //重大异常数量
          "checkBatchQuantity": '', //总检验批次
          "approvalBatchQuantity": '', //允收批次
          "approvalRate": "", //允收率
          "returnQuantity": '', //退货
          "specialProductionQuantity": '', //特采
          "reworkQuantity": '', //返工
          "screeningQuantity": '', //筛选
          "emergencyQuantity": '', //紧急放行
          "scrapQuantity": '' //报废
        },

        //客诉履历
        "cusComplainResume": {
          "returnQuantity": '',//退货
          "specialProductionQuantity": '', //特采
          "reworkQuantity": '',//返工
          "screeningQuantity": '', //筛选
          "emergencyQuantity": '',//紧急放行
          "scrapQuantity": '', //报废
          "occurredAbnormalQuantity": '',//发生异常数量
          "majorAbnormalQuantity": '',//重大异常数量
        },

        columns1: [
          {
            title: i18n.t('statistical.supplierName'),
            key: 'name',
            align: 'center',
            minWidth: 120

          },
          {
            title: i18n.t('statistical.iqcTotal'),
            key: 'suppliedsum',
            align: 'center',
            minWidth: 80
          },
          {
            title: i18n.t('statistical.badTotal'),
            key: 'totalbadnumber',
            align: 'center',
            minWidth: 80
          },
          {
            title: i18n.t('statistical.badRate'),
            key: 'totalrejectratio',
            align: 'center',
            minWidth: 60
          },
          {
            title: i18n.t('statistical.checkBatchTotal'),
            key: 'totalinspectionlot',
            align: 'center',
            minWidth: 90
          },
          {
            title: i18n.t('statistical.approvalBatchTotal'),
            key: 'acceptancebatches',
            align: 'center',
            minWidth: 80
          },
          {
            title: i18n.t('statistical.approvalRate'),
            key: 'assys',
            align: 'center',
            minWidth: 60
          },
          {
            title: i18n.t('statistical.abnormityMessage'),
            key: 'abnormitymessage',
            width: 500,
            render: function (h, data) {
              return h('Row', [
                h('i-col', {
                  props: {
                    span: 20,
                  }
                }, [
                  h('div', {
                    style: {
                      paddingLeft: '15px',
                      paddingTop: '20px',
                    }
                  }, [
                    h('a', {
                      style: {
                        color: '#495060'
                      },
                      on: {
                        'click': () => {
                          let that = this;
                          // alert(data.row)
                          // that.openNewTab('supplierName',data.row.name,'')
                        }
                      }
                    }, i18n.t('statistical.happenAbnormal')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0',
                      }
                    }, data.row.occurredAbnormalQuantity),
                    h('span', {
                      style: {
                        marginLeft: '20px',
                      }
                    }, i18n.t('statistical.majorAbnormal')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0'
                      }
                    }, data.row.majorAbnormalQuantity)
                  ]),
                  h('div', {
                    style: {
                      paddingLeft: '15px',
                      paddingTop: '12px',
                      paddingBottom: '20px'
                    }
                  }, [
                    h('span', i18n.t('statistical.return')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0'
                      }
                    }, data.row.returnQuantity),
                    h('span', {
                      style: {
                        marginLeft: '16px'
                      }
                    }, i18n.t('statistical.special')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0'
                      }
                    }, data.row.specialProductionQuantity),
                    h('span', {
                      style: {
                        marginLeft: '16px'
                      }
                    }, i18n.t('statistical.rework')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0'
                      }
                    }, data.row.reworkQuantity),
                    h('span', {
                      style: {
                        marginLeft: '16px'
                      }
                    }, i18n.t('statistical.filter')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0'
                      }
                    }, data.row.screeningQuantity),
                    h('span', {
                      style: {
                        marginLeft: '16px'
                      }
                    }, i18n.t('statistical.release')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0'
                      }
                    }, data.row.emergencyQuantity),
                    h('span', {
                      style: {
                        marginLeft: '16px'
                      }
                    },i18n.t('statistical.scrap')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0'
                      }
                    }, data.row.scrapQuantity),
                  ])
                ]),
                h('i-col', {
                  props: {
                    span: 4
                  },

                }, [
                  h('a', {
                    style: {
                      color: '#2d8cf0',
                      cursor: 'pointer',
                      lineHeight: '80px',
                    },
                    on: {
                      'click': function () {

                      }
                    }
                  }, i18n.t('statistical.viewDefect'))
                ])
              ])
            }
          }
        ],
        data1: [],
        columns2: [
          {
            title: i18n.t('statistical.customerName'),
            key: 'name',
            align: 'center',
            minWidth: 120

          },
          {
            title: i18n.t('statistical.complaintQuantity'),
            key: 'suppliedsum',
            align: 'center',
            minWidth: 80
          },
          {
            title: i18n.t('statistical.abnormityMessage'),
            key: 'abnormitymessage',
            width: 500,
            render: function (h, data) {
              return h('Row', [
                h('i-col', {
                  props: {
                    span: 20,
                  }
                }, [
                  h('div', {
                      style: {
                        paddingLeft: '15px',
                        paddingTop: '20px',
                      }
                    },
                    // [
                    //     h('span',i18n.t('statistical.happenAbnormal')+'：'),
                    //     h('span',{
                    //         style:{
                    //             color:'#2d8cf0',
                    //         }
                    //     },data.row.occurredAbnormalQuantity),
                    //     h('span',{
                    //         style:{
                    //             marginLeft:'20px',
                    //         }
                    //     },i18n.t('statistical.majorAbnormal')+'：'),
                    //     h('span',{
                    //         style:{
                    //             color:'#2d8cf0'
                    //         }
                    //     },data.row.majorAbnormalQuantity)
                    // ]
                  ),
                  h('div', {
                    style: {
                      paddingLeft: '15px',
                      paddingTop: '12px',
                      paddingBottom: '20px'
                    }
                  }, [
                    h('span', i18n.t('statistical.return')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0'
                      }
                    }, data.row.returnQuantity),
                    h('span', {
                      style: {
                        marginLeft: '16px'
                      }
                    }, i18n.t('statistical.special')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0'
                      }
                    }, data.row.specialProductionQuantity),
                    h('span', {
                      style: {
                        marginLeft: '16px'
                      }
                    }, i18n.t('statistical.rework')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0'
                      }
                    }, data.row.reworkQuantity),
                    h('span', {
                      style: {
                        marginLeft: '16px'
                      }
                    }, i18n.t('statistical.filter')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0'
                      }
                    }, data.row.screeningQuantity),
                    h('span', {
                      style: {
                        marginLeft: '16px'
                      }
                    }, i18n.t('statistical.release')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0'
                      }
                    }, data.row.emergencyQuantity),
                    h('span', {
                      style: {
                        marginLeft: '16px'
                      }
                    },i18n.t('statistical.scrap')+'：'),
                    h('span', {
                      style: {
                        color: '#2d8cf0'
                      }
                    }, data.row.scrapQuantity),
                  ])
                ]),
                h('i-col', {
                  props: {
                    span: 4
                  },

                }, [
                  h('a', {
                    style: {
                      color: '#2d8cf0',
                      cursor: 'pointer',
                      lineHeight: '80px',
                    },
                    on: {
                      'click': function () {

                      }
                    }
                  }, i18n.t('statistical.viewDefect')+'：')
                ])
              ])
            }
          }
        ],
        data2: [],

        chart: null,     //图表1 来料履历缺陷排列图

        //图表2 来料履历表格缺陷数排列图
        chart2: null,
        charts: {},
        chartnames: [],
        chart2HistogramData: [],//图表2数据
        chart4HistogramData: [],//图表4数据


        chart3: null,    //图表3 过程履历工序不良直方图
        chart4: null,    //图表4 过程履历缺陷数排列图
        chart5: null,    //图表5 过程履历线别直通率趋势图
        chart6: null,    //图表6 过程履历CPK趋势图
        chart7: null,    //图表7 出货履历缺陷数排列图
        chart8: null,    //图表8 客诉履历客诉饼图
        iqcDynamicChart: [],

      }
    },

    mounted() {

      this.initChart();
      // if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth){
      //     // winHeight = document.documentElement.clientHeight;
      //     this.winWidth = document.documentElement.clientWidth;
      //     // this.$refs.myChart.style.width = (this.winWidth-330)+'px';
      // }
      // let that = this;
      // window.onresize = function () {
      //     //所有图表宽度自适应
      //     // debugger;
      //     that.chart.resize();
      //     that.chart3.resize();
      //     that.chart4.resize();
      //     that.chart5.resize();
      //     // that.chart6.resize();
      //     that.chart7.resize();
      //     that.chart8.resize();
      //     //     for(var i = 0; i < that.chartnames.length; i++){
      //     //     // debugger;
      //     //     // try {
      //     //     // } catch (error) {
      //     //     // }
      //     //     var cht = that.chartnames[i]
      //     //     cht.resize();
      //     // }
      // }
      const that = this;
      var resizeTimer = null;
      $(window).bind('resize', function () {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          let width = $('.iqis-page-message').width();
          if (width == 0) return;
          if (that.chart) that.chart.resize({width: width});
          if (that.chart3) that.chart3.resize({width: width});
          if (that.chart4) that.chart4.resize({width: width});
          if (that.chart5) that.chart5.resize({width: width});
          // that.chart6.resize();
          if (that.chart7) that.chart7.resize({width: width});
          if (that.chart8) that.chart8.resize({width: width});
          that.iqcDynamicChart.forEach(function (chart) {
            if (chart) chart.resize({width: width});
          })
        }, 200);
      });
    },
    watch: {},

    created() {
      this.getProductName();
    },

    computed: {},

    methods: {
      remoteMethod: _.debounce(function(query) {
        let that = this;
        that.loadingRemote = true;

        if (query !== '') {
          that.cancelQuest();
          that.$nextTick(()=>{
            // that.$http.get("/basic/product", {params: {limit: 999999999,customerId:that.$store.state.customerId||''}})
            that.$http.get('/basic/product/simple?page=1&limit=999999&examType=1&useState=1&fieldName=no,name&query='+query,{
              cancelToken: new this.$http.CancelToken(function executor(c) {
              that.source = c;
              })
            }).then(res =>{
              that.productSimple = res.data
              that.loadingRemote = false;
            })

          })
        } else {
          that.productSimple = [];
          that.loadingRemote = false;
        }
      },500),
      cancelQuest(){
        if(typeof this.source ==='function'){
          this.source('终止请求'); 
        }
      },
      //查看
      openNewTabiqc(nature1, nature2, nature3, nature4) {
        this.$emit("open-tab", "qc-iqc-abnormal", i18n.t('statistical.iqcAbn'), "page-exam-iqc-abnormal-list", {
          nature1,
          nature2,
          nature3,
          nature4,
          verify: 'verify'
        });
      },

      openNewTabpqc(nature1, nature2, nature3, nature4) {
        this.$emit("open-tab", "qc-pqc-abnormal", i18n.t('statistical.pqcAbn'), "page-exam-pqc-abnormal-list", {
          nature1,
          nature2,
          nature3,
          nature4,
          verify: 'verify'
        });
      },
      openNewTaboqc(nature1, nature2, nature3) {
        this.$emit("open-tab", "qc-oqc-abnormal", i18n.t('statistical.oqcAbn'), "page-exam-oqc-abnormal-list", {
          nature1,
          nature2,
          nature3,
          verify: 'verify'
        });
      },
      openNewTabcc(nature1, nature2, nature3) {
        this.$emit("open-tab", "customer-service-customer-complaint", i18n.t('statistical.complaintAbn'), "page-customer-complaint", {
          nature1,
          nature2,
          nature3,
          verify: 'verify'
        });
      },

      //查看履历
      likerecord() {
        if (this.basic.productId == '') {
          this.$Notice.warning({
            title: i18n.t('statistical.noOrNameNull'),
          });
          return false;
        } else {
          // let productname = this.$refs.productname;
          //  this.$emit("open-tab","resume-details-"+this.basic.productId,productname.query+"-履历","resume-details",{productId:this.basic.productId});
          this.resumeproFile();
          this.aresume();
          this.bachList();
          this.hideshowtoggle = true;
        }
      },
      // 展开履历
      aresume() {
        let that = this;
        that.aResume.iqcResume = false;
        that.aResume.pqcResume = false;
        that.aResume.oqcResume = false;
        that.aResume.ccResume = false;
        that.aResume.iqcdisabled = false;
        that.aResume.pqcdisabled = false;
        that.aResume.oqcdisabled = false;
        that.aResume.ccdisabled = false;
        that.aResume.iqcshow = false;
        that.aResume.pqcshow = false;
        that.aResume.oqcshow = false;
        that.aResume.ccshow = false;
        that.$http.get('/basic/product/detail/' + that.basic.productId).then((res) => {

          var iqcbtnref = document.getElementById('iqcbtnref');
          var pqcbtnref = document.getElementById('pqcbtnref');
          var oqcbtnref = document.getElementById('oqcbtnref');

          if (res.data.settings.qc.iqc.aql.useState == 0) {
            this.aResume.iqcdisabled = true;
            iqcbtnref.style.color = '#c5c8ce';
          } else {
            iqcbtnref.style.color = '#495060';
          }

          if (res.data.settings.qc.pqc.aql.useState == 0) {
            this.aResume.pqcdisabled = true;
            this.aResume.ccdisabled = true;
            pqcbtnref.style.color = '#c5c8ce'
          } else {
            pqcbtnref.style.color = '#495060'
          }
          if (res.data.settings.qc.oqc.aql.useState == 0) {
            this.aResume.oqcdisabled = true;
            this.aResume.ccdisabled = true;
            oqcbtnref.style.color = '#c5c8ce'
          } else {
            oqcbtnref.style.color = '#495060'
          }
          //默认勾选一项
          if (this.aResume.iqcdisabled == false) {
            this.aResume.iqcResume = true;
            this.aResume.iqcshow = true;
          }
          if (this.aResume.pqcdisabled == false) {
            this.aResume.pqcResume = true;
            this.aResume.pqcshow = true;
          }
          if (this.aResume.oqcdisabled == false) {
            this.aResume.oqcResume = true;
            this.aResume.oqcshow = true;
          }
          if (this.aResume.ccdisabled == false) {
            this.aResume.ccResume = true;
            this.aResume.ccshow = true;
          }


        })
      },

      iqcbtn(property) {
        if (property) {
          this.aResume.iqcshow = true;
        } else {
          this.aResume.iqcshow = false;
        }
      },
      pqcbtn(property) {
        if (property) {
          this.aResume.pqcshow = true;
        } else {
          this.aResume.pqcshow = false;
        }
      },
      oqcbtn(property) {
        if (property) {
          this.aResume.oqcshow = true;
        } else {
          this.aResume.oqcshow = false;
        }
      },

      onExportReport(borderId) {//border div的ID
        var reportBorder = $("#" + borderId);
        // 添加统一的外层
        var content_html = "<div id=\"exam-report\" class=\"exam-report-border export-chart-preview\" style='background: #fff;width:1200px;'>" + reportBorder.html() + "</div>";
        var pageHead = "<div style='text-align: center;font-size: 11pt;font-weight: bold;'>" + $(".exam-report-title-txt").text() + "- "
          + reportBorder.find(".report-title-date-range-txt").text() + "&nbsp;<td width=\"25%\">"+i18n.t('statistical.tabulationDate')+"：<span class=\"\">"
          + reportBorder.find(".report-title-date-txt").text() + "</span></td>&nbsp;&nbsp;"+i18n.t('statistical.pages')+"：<span class='report-title-pager-txt'></span></div>";
        var w = this.$iqis.utils.printHtml(content_html, pageHead, ["static/css/export-chart-preview.css"]);


        // var chartId = reportBorder.find(".exam-report-chart-div").attr("id");
        for (let i = 0; i < this.chart2HistogramData.length; i++) {
          var chartId = this.chart2HistogramData[i].chartName;
          var chart_ = echart.getInstanceByDom(document.getElementById(chartId));

          var dataUrl = chart_.getDataURL({type: "png", pixelRatio: 2, excludeComponents: ["toolbox"]});

          w.iqis_param_imgId = "chartImage";
          w.iqis_param_imgDataUrl = dataUrl;
          w.iqis_param_chartId = chartId;
        }


        w.iqis_param_footer = ".exam-report-footer";
        w.iqis_param_table = ".exam-report-datas-table";

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "static/js/printHelper.js";
        w.document.getElementsByTagName('head')[0].appendChild(script);
      },

      //产品编号与产品名称
      getProductName(basicproductId) {
        let that = this;
        //  提示信息显示与隐藏
        if (basicproductId != undefined) {
          that.promptmessage = false;
        }

        that.$http.get("/basic/product", {params: {limit: 999999999,customerId:that.$store.state.customerId||''}})
          .then(function (resp) {
            that.productList = resp.data;
          })
      },

      //产品批号接口
      bachList() {
        let that = this;
        that.$http.get('/examinecenter/pqc/prodbatch', {
          params: {
            query: "productId=" + that.basic.productId,
            limit: 99999999
          }
        }).then((res) => {

          that.bachlist = [];
          for (let i = 0; i < res.data.length; i++) {
            that.bachlist.push(res.data[i].batchNo)
          }

        })
      },

      //   接口数据
      resumeproFile() {
        let that = this;
        // that.$http.get('/diagram/product/profile?productId=' + this.basic.productId)
        //   .then(function (res) {
        that.$http.all([
            that.$http.get("/diagram/product/profile?productId="+ this.basic.productId+"&business=cusComplain"),
            that.$http.get("/diagram/product/profile?productId="+ this.basic.productId+"&business=iqc"),
            that.$http.get("/diagram/product/profile?productId="+ this.basic.productId+"&business=pqc&by=byDefect"),
            that.$http.get("/diagram/product/profile?productId="+ this.basic.productId+"&business=pqc&by=byLine"),
            that.$http.get("/diagram/product/profile?productId="+ this.basic.productId+"&business=pqc&by=byProdProcess"),
            that.$http.get("/diagram/product/profile?productId="+ this.basic.productId+"&business=oqc"),
        ]).then(function(resps){
            that.resumeprofile['cusComplainResume'] = resps[0].data.cusComplainResume;
            that.resumeprofile['product'] = resps[0].data.product;
            that.resumeprofile['iqcResume'] = resps[1].data.iqcResume;
            that.resumeprofile['pqcResume'] = resps[2].data.pqcResume;
            that.resumeprofile['pqcResume'].prodLineDirectRateData = resps[3].data.pqcResume.prodLineDirectRateData;
            that.resumeprofile['pqcResume'].procedureBadData = resps[4].data.pqcResume.procedureBadData;
            that.resumeprofile['oqcResume'] = resps[5].data.oqcResume;
            console.log(that.resumeprofile,'that.resumeprofile')
            that.product.no = that.resumeprofile.product.no;
            that.product.name = that.resumeprofile.product.name;
            that.product.spec = that.resumeprofile.product.spec;
            that.product.prodTypeName = that.resumeprofile.product.prodTypeName;
            that.product.updateTime = new Date(that.resumeprofile.product.updateTime).Format("yyyy-MM-dd hh:mm")

            // console.log(that.resumeprofile,"数据");
            if (that.resumeprofile.product.examType == 1 || that.resumeprofile.product.examType == 3 || that.resumeprofile.product.examType == 5 || that.resumeprofile.product.examType == 7) {
              // alert('来料')
              //来料
              //来料履历表格数据
              var listdata1 = that.resumeprofile.iqcResume.histogramData;
              that.incomingsupplier = listdata1.length; //来料供应商总数
              that.data1 = [];//防止表格内数据叠加
              for (let i = 0; i < listdata1.length; i++) {
                var data1 = new Object();
                data1.name = listdata1[i].manufacturerName;
                data1.suppliedsum = listdata1[i].totalQuantity;
                data1.totalbadnumber = listdata1[i].badTotalQuantity;
                if(listdata1[i].badTotalQuantity > listdata1[i].totalQuantity){
                  data1.totalrejectratio = 100+"%";
                } else {
                  data1.totalrejectratio = listdata1[i].badRate;
                }
                data1.totalinspectionlot = listdata1[i].checkBatchQuantity; //检验批次
                data1.acceptancebatches = listdata1[i].approvalBatchQuantity; //允收批次
                data1.assys = listdata1[i].approvalRate; //允收率
                data1.returnQuantity = listdata1[i].returnQuantity; //退货
                data1.specialProductionQuantity = listdata1[i].specialProductionQuantity; //特采
                data1.reworkQuantity = listdata1[i].reworkQuantity; //返工
                data1.screeningQuantity = listdata1[i].screeningQuantity; //筛选
                data1.emergencyQuantity = listdata1[i].emergencyQuantity; //紧急放行
                data1.scrapQuantity = listdata1[i].scrapQuantity; //报废
                data1.occurredAbnormalQuantity = listdata1[i].occurredAbnormalQuantity; //发生异常
                data1.majorAbnormalQuantity = listdata1[i].majorAbnormalQuantity; //重大异常
                that.data1.push(data1);
              }

              //产品履历
              that.iqcResume = that.resumeprofile.iqcResume;

              //表一来料履历缺陷数柏拉图
              that.updateLlDefectnumberPlato();
              //表二 来料履历缺陷数排列图
              that.updateLldefectchart();

              that.aResume.iqcshow = true; // 显示
            }

            if (that.resumeprofile.product.examType == 2 || that.resumeprofile.product.examType == 3 || that.resumeprofile.product.examType == 6 || that.resumeprofile.product.examType == 7) {
              //过程
              // alert('过程')
              //过程履历
              that.pqcResume = that.resumeprofile.pqcResume;
              //表三 过程履历工序不良直方图
              that.updateGcdysHistogram();
              //表四 过程履历缺陷排列图
              that.updateGcdefectchart();
              //表五 过程履历线别直通率趋势图
              that.updateGcRTYRunchart();

              that.aResume.pqcshow = true;

            }

            if (that.resumeprofile.product.examType == 4 || that.resumeprofile.product.examType == 5 || that.resumeprofile.product.examType == 6 || that.resumeprofile.product.examType == 7) {
              //出货履历
              that.oqcResume = that.resumeprofile.oqcResume;
              that.updateChdefectchart();
              that.aResume.oqcshow = true;
            }

            if (that.resumeprofile.product.examType != null && that.resumeprofile.product.examType != 1) {
              that.aResume.ccshow = true;
              //客诉履历表格数据
              var listdata2 = that.resumeprofile.cusComplainResume.histogramData;
              that.complaintsupplier = listdata2.length; //客诉供应商总数
              that.data2 = []; //防止表格内数据累积
              for (let i = 0; i < listdata2.length; i++) {
                var data2 = new Object();
                data2.name = listdata2[i].customerName //客户名称
                data2.suppliedsum = listdata2[i].totalQuantity //客诉次数
                data2.returnQuantity = listdata2[i].returnQuantity; //退货
                data2.specialProductionQuantity = listdata2[i].specialProductionQuantity; //特采
                data2.reworkQuantity = listdata2[i].reworkQuantity;//返工
                data2.screeningQuantity = listdata2[i].screeningQuantity; //筛选
                data2.emergencyQuantity = listdata2[i].emergencyQuantity; //紧急放行
                data2.scrapQuantity = listdata2[i].scrapQuantity; //报废
                that.data2.push(data2);
              }


              //客诉履历
              that.cusComplainResume = that.resumeprofile.cusComplainResume
              //that.initChart(); //这里为什么要重复初化? by denghuiping


              //表六 过程履历CPK趋势图
              // that.updateGcCPKRTYRunchart();
              //表八 客诉履历客诉饼图
              that.updateKsPiechart();
            }

          })

      },


      //表一 来料履历缺陷数柏拉图
      updateLlDefectnumberPlato() {
        let that = this;
        // let _currentDate = new Date(that.currentDate).getTime(); //日期格式转化
        // that.$http.get('/diagram/report/pqc/dispatcher?business=defect&by=byDefect&hourOffset=8&start=1456761600000&end='+_currentDate+'&productTypeId=&productId='+that.basic.productId+'&prodLineId=')
        // .then(function(res){

        // })


        let colors = ["#A51E34", "#F2637B", "#B10DB9", "#29CCCC", "#FAD337", "#EC63F2","#FA9737","#2981CC","#95F05D","#21A4BF","#5DA0F0","#FFD736","#975FE4","#C9690C","#CC330","#FF6699","#CC99FF","#66FFCC","#CCCC00","#CC6699","#996600","#336699","#336600","#00CCFF","#CCCCFF","#FFFF00","#9900FF","#CC9900"];
        var colors1 = ["#A51E34", "#F2637B", "#B10DB9", "#29CCCC", "#FAD337", "#EC63F2","#FA9737","#2981CC","#95F05D","#21A4BF","#5DA0F0","#FFD736","#975FE4","#C9690C","#CC330","#FF6699","#CC99FF","#66FFCC","#CCCC00","#CC6699","#996600","#336699","#336600","#00CCFF","#CCCCFF","#FFFF00","#9900FF","#CC9900"];
        var labels = []; //xAxis 的 data
        var cdatas = []; //series 的 data
        var count = []; //折线的data
        if (that.resumeprofile.iqcResume.diagramData == '' || that.resumeprofile.iqcResume.diagramData == null) {
          labels = ['', '', '']
          cdatas = [0, 0, 0]
        } else {
          let totalBadCount = 0;
          let accumulativeBadCount = 0;
          for (let i = 0; i < that.resumeprofile.iqcResume.diagramData.length; i++) {
            totalBadCount += parseInt(that.resumeprofile.iqcResume.diagramData[i].badCount);
          }
          for (let i = 0; i < that.resumeprofile.iqcResume.diagramData.length; i++) {
            accumulativeBadCount += parseInt(that.resumeprofile.iqcResume.diagramData[i].badCount);
            let rate = (accumulativeBadCount*100/totalBadCount).toFixed(2);

            labels.push(that.resumeprofile.iqcResume.diagramData[i].name);  //名称
            cdatas.push(that.resumeprofile.iqcResume.diagramData[i].badCount); //总抽样数
            count.push(rate);   //缺陷率
          }
        }
        //  var arr = cdatas;
        //     arr.sort(function(a,b){
        //         return b-a;
        //     })
        that.chart.clear();
        that.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          color: colors,
          title: {
            text: i18n.t('statistical.defectChart'),
          },
          grid: {
            left: 70,
            right:50,
          },
          // legend: {
          //     data:['缺陷总数',i18n.t('statistical.defectRate')]
          // },
          xAxis: [
            {
              type: 'category',
              data: labels,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              // name: '水量',
              // min:0,
              // max: 100,
              // interval: '10n',
              // axisLabel: {
              //     formatter: '{value} ml'
              // }
              splitLine: {
                show: false
              },
              max: 'dataMax'
            },
            {
              type: 'value',
              min: 0,
              max: 100,
              interval: 10,
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [

            {
              name: i18n.t('statistical.sampleTotal'),
              type: 'bar',
              barMaxWidth: '50px',
              data: cdatas,
              itemStyle: {
                normal: {
                  color: function (obj) {
                    if (obj.dataIndex >= 0) {
                      return colors[obj.dataIndex];
                    }
                  },
                }
              }

            },

            {
              name: i18n.t('statistical.defectRate'),
              type: 'line',
              yAxisIndex: 1,
              data: count,
              color:'#418FEE',
            }
          ]


        }, false, false, true);
        $(window).resize();
      },

      //表二 来料履历缺陷数排列图
      updateLldefectchart() {
        let that = this;
        var labels = []; //xAxis 的 data
        var cdatas = []; //series 的 data
        var count = []; //折线的data
        // var chartnames = []; //把所有的chart[n] 放到此数组
        that.chart2HistogramData = that.resumeprofile.iqcResume.histogramData; //chart2图表数据
        var chartname = that.chart2HistogramData;
        // console.log(chartname, "chartname");
        this.$nextTick(() => { //等待模板渲染完毕在获取对应id，否则为null (当dom发生变化，更新后执行的回调。)
          //把所有的chart[n] 放到此数组
          for (var i = 0; i < chartname.length; i++) {
            that.chartnames.push(chartname[i].chartName);
          }
          // 再把所有的chart[n] 放到此对象 并且存为{chart1:null} 形式
          // var chartss = {};
          // for(var i = 0; i < that.chartnames.length; i++){
          //     that.charts[that.chartnames[i]] = null;
          //     chartss[that.chartnames[i]] = null
          // };
          that.iqcDynamicChart = [];//清空上一次动态生产的图表实例，防止OOM
          let totalBadCount = 0;
          let accumulativeBadCount = 0;
          
          for (var i = 0; i < that.chartnames.length; i++) {
            var labels = [];
            var cdatas = [];

            for (var j = 0; j < that.chart2HistogramData[i].defect.length; j++) {
              totalBadCount += parseInt(that.chart2HistogramData[i].defect[j].defectCount);
            }
            //根据表格的每一条数据遍历出图标
            for (var j = 0; j < that.chart2HistogramData[i].defect.length; j++) {
              labels.push(that.chart2HistogramData[i].defect[j].name);
              cdatas.push(that.chart2HistogramData[i].defect[j].defectCount);
              accumulativeBadCount += parseInt(that.chart2HistogramData[i].defect[j].defectCount);
              let rate = (accumulativeBadCount*100/totalBadCount).toFixed(2);
              count.push(rate)
            }
            if (labels.length == 0 || cdatas.length == '') {
              labels = ['---', '---', '---']
              cdatas = [0, 0, 0]
            }
            let cht = echart.init(document.getElementById(that.chartnames[i]));
            cht.setOption({
              title: {
                text: that.chart2HistogramData[i].manufacturerName + i18n.t('statistical.defectChart')  //图表标题
              },
               grid: {
                left: 70,
                right:50,
              },
              tooltip: {},
              legend: {
                data: [i18n.t('statistical.sales')]
              },
              
              xAxis: {
              type: 'category',
              data: labels,
              axisPointer: {
                type: 'shadow'
              }
            },
              yAxis: [
                {
                  type: 'value',
                  splitLine: {
                    show: false
                  },
                  max: 'dataMax'
                },
                {
                  type: 'value',
                  min: 0,
                  max: 100,
                  interval: 10,
                  axisLabel: {
                    formatter: '{value} %'
                  }
                }
              ],
              series: [{
                // name: i18n.t('statistical.sales'),
                type: 'bar',
                barMaxWidth: '50px',
                // data: [5, 20, 36],
                data: cdatas,
                itemStyle: {    //设置每个数据节点对应颜色
                  normal: {
                    color: function (params) {
                      // build a color map as your need.
                      var colorList = ["#A51E34", "#F2637B", "#B10DB9", "#29CCCC", "#FAD337", "#EC63F2","#FA9737","#2981CC","#95F05D","#21A4BF","#5DA0F0","#FFD736","#975FE4","#C9690C","#CC330","#FF6699","#CC99FF","#66FFCC","#CCCC00","#CC6699","#996600","#336699","#336600","#00CCFF","#CCCCFF","#FFFF00","#9900FF","#CC9900"];
                      return colorList[params.dataIndex]
                    }
                  }
                }
              },
              {
              name: i18n.t('statistical.defectRate'),
              type: 'line',
              yAxisIndex: 1,
              data: count,
              color:'#418FEE',
            }
              ]
            });
            that.iqcDynamicChart.push(cht);
            $(window).resize();
          }


        })


      },

      //表三 过程履历工序不良柱状图
      updateGcdysHistogram() {
        let that = this;
        let _currentDate = new Date(that.currentDate).getTime(); //日期格式转化


        var labels = []; //xAxis 的 data
        var cdatas = []; //series 的 data
        if (that.resumeprofile.pqcResume.procedureBadData == '' || that.resumeprofile.pqcResume.procedureBadData == null) {
          labels = ['---', '---', '---']
          cdatas = [0, 0, 0]
        } else {
          for (let i = 0; i < that.resumeprofile.pqcResume.procedureBadData.length; i++) {
            labels.push(that.resumeprofile.pqcResume.procedureBadData[i].name);
            cdatas.push(that.resumeprofile.pqcResume.procedureBadData[i].badCount);
          }
        }
        // var arr = cdatas;
        // arr.sort(function(a,b){
        //     return b-a;
        // })
        // 使用指定的配置项和数据显示图表
        that.chart3.setOption({
          title: {
            text: i18n.t('statistical.processBadChart')  //图表标题
          },
          grid: {
            left: 50,
            right:50,
          },
          tooltip: {},
          legend: {
            data: [i18n.t('statistical.sales')]
          },
          xAxis: {
            // data: ["充电器","电子表","功放机","蓝牙耳机","低音炮","T92变压器","野外电池"]
            data: labels,
          },
          yAxis: {},
          series: [{
            // name: i18n.t('statistical.sales'),
            type: 'bar',
            barMaxWidth: '50px',
            // data: [5, 20, 36,40,25,10,9],
            data: cdatas,

            //设置每个数据节点对应颜色
            itemStyle: {
              normal: {
                color: function (params) {
                  // build a color map as your need.
                  var colorList = ["#A51E34", "#F2637B", "#B10DB9", "#29CCCC", "#FAD337", "#EC63F2","#FA9737","#2981CC","#95F05D","#21A4BF","#5DA0F0","#FFD736","#975FE4","#C9690C","#CC330","#FF6699","#CC99FF","#66FFCC","#CCCC00","#CC6699","#996600","#336699","#336600","#00CCFF","#CCCCFF","#FFFF00","#9900FF","#CC9900"];
                  return colorList[params.dataIndex]
                }
              }
            }
          }]
        });


      },


      //表四 过程履历缺陷排列图
      updateGcdefectchart() {
        let that = this;
        var labels = []; //xAxis 的 data
        var cdatas = []; //series 的 data

        let count = [];
        let totalBadCount = 0;
        let accumulativeBadCount = 0;
        if (that.resumeprofile.pqcResume.defectDiagram.length == 0) {
          labels = ['---', '---', '---']
          cdatas = [0, 0, 0]
        } else {
          for(let j = 0; j < that.resumeprofile.pqcResume.defectDiagram.length; j++){
              totalBadCount += parseInt(that.resumeprofile.pqcResume.defectDiagram[j].defectCount);
            }
          for (let i = 0; i < that.resumeprofile.pqcResume.defectDiagram.length; i++) {
            labels.push(that.resumeprofile.pqcResume.defectDiagram[i].name);
            cdatas.push(that.resumeprofile.pqcResume.defectDiagram[i].defectCount);
            
            accumulativeBadCount += parseInt(that.resumeprofile.pqcResume.defectDiagram[i].defectCount);
            let rate = (accumulativeBadCount*100/totalBadCount).toFixed(2);
            count.push(rate)
          }
        }
        ;

        // var arr = cdatas;
        //     arr.sort(function(a,b){
        //         return b-a;
        //     })
        that.chart4.setOption({
          title: {
            text: i18n.t('statistical.defectChart')  //图表标题
          },
          grid: {
            left: 50,
            right:50,
          },
          tooltip: {},
          legend: {
            data: [i18n.t('statistical.sales')]
          },
          xAxis: {
            // data: ["凹陷","电感低","尺寸不良"]
            data: labels
          },
          yAxis: [
            {
              type: 'value',
              splitLine: {
                show: false
              },
              max: 'dataMax'
            },
            {
              type: 'value',
              min: 0,
              max: 100,
              interval: 10,
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [{
            // name: i18n.t('statistical.sales'),
            type: 'bar',
            barMaxWidth: '50px',
            // data: [5, 20, 36],
            data: cdatas,
            itemStyle: {    //设置每个数据节点对应颜色
              normal: {
                color: function (params) {
                  // build a color map as your need.
                  var colorList = ["#A51E34", "#F2637B", "#B10DB9", "#29CCCC", "#FAD337", "#EC63F2","#FA9737","#2981CC","#95F05D","#21A4BF","#5DA0F0","#FFD736","#975FE4","#C9690C","#CC330","#FF6699","#CC99FF","#66FFCC","#CCCC00","#CC6699","#996600","#336699","#336600","#00CCFF","#CCCCFF","#FFFF00","#9900FF","#CC9900"];
                  return colorList[params.dataIndex]
                }
              }
            }
          },
          {
              name: i18n.t('statistical.defectRate'),
              type: 'line',
              yAxisIndex: 1,
              data: count,
              color:'#418FEE',
            }]
        });
        $(window).resize();

      },


      //表五 过程履历线别直通率趋势图
      updateGcRTYRunchart() {
        let that = this;
        let _currentDate = new Date(that.currentDate).getTime(); //日期格式转化

        var labels = []; //xAxis 的 data
        var cdatas = []; //series 的 data
        if (that.resumeprofile.pqcResume.prodLineDirectRateData == '' || that.resumeprofile.pqcResume.prodLineDirectRateData == null) {
          labels = ['---', '---', '---']
          cdatas = [0, 0, 0]
        } else {
          try {
            for (let i = 0; i < that.resumeprofile.pqcResume.prodLineDirectRateData.length; i++) {
              labels.push(that.resumeprofile.pqcResume.prodLineDirectRateData[i].name);
              cdatas.push(that.resumeprofile.pqcResume.prodLineDirectRateData[i].rate);
            }
          } catch (error) {

          }

        }

        that.chart5.setOption({
          title: {
            text: i18n.t('statistical.LineThroughTrendChart')  //图表标题
          },
          grid: {
            left: 50,
            right:50,
          },
          tooltip: {},
          legend: {
            data: [i18n.t('statistical.sales')]
          },
          xAxis: {
            // data: ["数据1","数据2","数据3","数据4","数据5","数据6","数据7","数据8","数据9"]
            data: labels,
          },
          yAxis: {},
          series: [{
            // name: i18n.t('statistical.sales'),
            type: 'line',
            color:'#418FEE',
            // color: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C','#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF'],
            // data: [5, 20, 36,34,56,76,78,23,8],
            data: cdatas,
            itemStyle: {    //设置每个数据节点对应颜色
              normal: {
                color: function (params) {
                  // build a color map as your need.
                  var colorList = ["#A51E34", "#F2637B", "#B10DB9", "#29CCCC", "#FAD337", "#EC63F2","#FA9737","#2981CC","#95F05D","#21A4BF","#5DA0F0","#FFD736","#975FE4","#C9690C","#CC330","#FF6699","#CC99FF","#66FFCC","#CCCC00","#CC6699","#996600","#336699","#336600","#00CCFF","#CCCCFF","#FFFF00","#9900FF","#CC9900"];
                  return colorList[params.dataIndex]
                }
              }
            }
          }]
        });
        $(window).resize();

      },
      /**
       //表六 过程履历CPK趋势图
       updateGcCPKRTYRunchart(){
            let that = this;
            let _currentDate = new Date(that.currentDate).getTime(); //日期格式转化

                var labels = []; //xAxis 的 data
                var cdatas = []; //series 的 data
                if (that.resumeprofile.pqcResume.prodLineDirectRateData == '' || that.resumeprofile.pqcResume.prodLineDirectRateData == null) {
                    labels = ['---','---','---']
                    cdatas = [0,0,0]
                }else{
                    for(let i = 0; i < that.resumeprofile.pqcResume.prodLineDirectRateData.length; i++){
                        labels.push(that.resumeprofile.pqcResume.prodLineDirectRateData[i].name);
                        cdatas.push(that.resumeprofile.pqcResume.prodLineDirectRateData[i].rate);
                    }
                }

                 that.chart6.setOption({
                    title: {
                        text: 'CPK趋势图'  //图表标题
                    },
                    grid:{
                        left:50
                    },
                    tooltip: {},
                    legend: {
                        data:[i18n.t('statistical.sales')]
                    },
                    xAxis: {
                        // data: ["数据1","数据2","数据3","数据4","数据5","数据6","数据7","数据8","数据9"]
                        data:labels,
                    },
                    yAxis: {},
                    series: [{
                        // name: i18n.t('statistical.sales'),
                        type: 'line',
                        // color: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C','#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF'],
                        // data: [5, 20, 36,34,56,76,78,23,8],
                        data:cdatas,
                        itemStyle: {    //设置每个数据节点对应颜色
                            normal: {
                                color: function(params) {
                                    // build a color map as your need.
                                    var colorList = ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C','#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF'];
                                    return colorList[params.dataIndex]
                                }
                            }
                        }
                    }]
                });
        },
       */


      //表七 出货履历缺陷数排列图
      updateChdefectchart() {
        let that = this;
        let _currentDate = new Date(that.currentDate).getTime(); //日期格式转化

        let count = [];
        let totalBadCount = 0;
        let accumulativeBadCount = 0;
        that.$http.get('/diagram/report/oqc/dispatcher?business=defect&by=byDefect&hourOffset=8&start=1509465600000&end=' + _currentDate + '&productTypeId=&productId=' + this.basic.productId + '&prodLineId=')
          .then(function (res) {
            console.log(res,"res");
            
            var labels = []; //xAxis 的 data
            var cdatas = []; //series 的 data
            if (res.data.list == '' || res.data.list == null) {
              labels = ['---', '---', '---']
              cdatas = [0, 0, 0]
            } else {
              for(let i = 0; i < res.data.list.length; i++){
                totalBadCount += parseInt(res.data.list[i].count);
              }
              for (let i = 0; i < res.data.list.length; i++) {
                labels.push(res.data.list[i].name);
                cdatas.push(res.data.list[i].count);
                accumulativeBadCount += parseInt(res.data.list[i].count);
                let rate = (accumulativeBadCount*100/totalBadCount).toFixed(2);
                count.push(rate)
              }
            }
            // var arr = cdatas;
            // arr.sort(function(a,b){
            //     return b-a;
            // })
            that.chart7.setOption({
              title: {
                text: i18n.t('statistical.defectChart')  //图表标题
              },
              grid: {
                left: 50,
                right:50,
              },
              tooltip: {},
              legend: {
                data: [i18n.t('statistical.sales')]
              },
              xAxis: {
                // data: ["缺角","质量不均","裂缝","薄厚不均","色差","其他"]
                data: labels
              },
              yAxis: [
                {
                  type: 'value',
                  splitLine: {
                    show: false
                  },
                  max: 'dataMax'
                },
                {
                  type: 'value',
                  min: 0,
                  max: 100,
                  interval: 10,
                  axisLabel: {
                    formatter: '{value} %'
                  }
                }
              ],
              series: [{
                // name: i18n.t('statistical.sales'),
                type: 'bar',
                barMaxWidth: '50px',
                // data: [5, 20, 36, 20, 36, 20],
                data: cdatas,
                itemStyle: {    //设置每个数据节点对应颜色
                  normal: {
                    color: function (params) {
                      // build a color map as your need.
                      var colorList = ["#A51E34", "#F2637B", "#B10DB9", "#29CCCC", "#FAD337", "#EC63F2","#FA9737","#2981CC","#95F05D","#21A4BF","#5DA0F0","#FFD736","#975FE4","#C9690C","#CC330","#FF6699","#CC99FF","#66FFCC","#CCCC00","#CC6699","#996600","#336699","#336600","#00CCFF","#CCCCFF","#FFFF00","#9900FF","#CC9900"];
                      return colorList[params.dataIndex]
                    }
                  }
                }
              },
              {
              name: i18n.t('statistical.defectRate'),
              type: 'line',
              yAxisIndex: 1,
              data: count,
              color:'#418FEE',
            }]
            });
            $(window).resize();

          })

      },

      //表八 客诉履历客诉饼图
      updateKsPiechart() {
        let that = this;

        var labels = []; //xAxis 的 data
        var cdatas = []; //series 的 data
        var datas = [];
        if (that.resumeprofile.cusComplainResume.histogramData == '' || that.resumeprofile.cusComplainResume.histogramData == null) {
          labels = ['---', '---', '---']
          cdatas = [0, 0, 0]
          datas = [
            // {value: 0, name: '---'},
            // {value: 0, name: '---'},
            {value: 0, name: '---'}
          ]
        } else {
          for (let i = 0; i < that.resumeprofile.cusComplainResume.histogramData.length; i++) {
            labels.push(that.resumeprofile.cusComplainResume.histogramData[i].manufacturerName);
            cdatas.push(that.resumeprofile.cusComplainResume.histogramData[i].totalQuantity);

          }

          for (let i = 0; i < labels.length; i++) {
            var obj = new Object();
            obj.value = cdatas[i]
            obj.name = labels[i]
            datas.push(obj);
          }

        }
        this.chart8.setOption({
          title: {
            text: i18n.t('statistical.complaintChart')  //图表标题
          },
          grid: {
            left: 50
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },

          legend: {
            orient: 'vertical',
            x: '60%',
            // data:['欧神电子','全一科技','华泰科技','孟加','其他']
            data: labels
          },

          series: [
            {
              name: i18n.t('statistical.complaintQuantity'),
              type: 'pie',
              radius: ["70%", "90%"],
              center: ['40%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  /* formatter:function(){
                    let total = 0;
                    that.dataarray.forEach(function(o){total += o});
                    return  total;
                  }, */
                  fontSize:19,
                  color:"rgb(35, 35, 35)",
                  formatter:this.complaintsupplier+'\n\n'+i18n.t('statistical.complaintTotal')
                  
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
                  show: true
                }
              },
              data: datas,
              itemStyle: {    //设置每个数据节点对应颜色
                  normal: {
                    color: function (params) {
                      // build a color map as your need.
                      var colorList = ["#A51E34", "#F2637B", "#B10DB9", "#29CCCC", "#FAD337", "#EC63F2","#FA9737","#2981CC","#95F05D","#21A4BF","#5DA0F0","#FFD736","#975FE4","#C9690C","#CC330","#FF6699","#CC99FF","#66FFCC","#CCCC00","#CC6699","#996600","#336699","#336600","#00CCFF","#CCCCFF","#FFFF00","#9900FF","#CC9900"];
                      return colorList[params.dataIndex]
                    }
                  }
                }
            }
          ]
        });
        $(window).resize();

      },

      initChart() {

        //表一 来料履历缺陷数柏拉图
        this.chart = echart.init(this.$refs.myChart);
        // this.$refs.myChart.style.height = '300px'
        //表二 来料履历缺陷数排列图
        // this.chart2 = echart.init(this.$refs.myChart2);
        //表三 过程履历工序不良直方图
        this.chart3 = echart.init(this.$refs.myChart3);
        //表四 过程履历缺陷排列图
        this.chart4 = echart.init(this.$refs.myChart4);

        //表五 过程履历线别直通率趋势图
        this.chart5 = echart.init(this.$refs.myChart5);
        //表六 过程履历CPK趋势图
        // this.chart6 = echart.init(this.$refs.myChart6);

        //表七 出货履历缺陷数排列图
        this.chart7 = echart.init(this.$refs.myChart7);


        //表八 客诉履历客诉饼图
        this.chart8 = echart.init(this.$refs.myChart8);

      },


      refreshData() {
        this.table.loading = true;
        let params = {page: this.table.pager.current, limit: this.table.pager.limit};
        if (this.search.selectType) {
          params.parentId = this.search.selectType;
        }
        let that = this;
        this.$http.get("/rule-LENIENT_TRANSFER", {params: params}).then(function (resp) {

          that.data = resp.data;
          if (resp.pagerInfo) {
            that.table.pager.total = resp.pagerInfo.total;
          }
          that.table.loading = false;
        })

      },

    }
  }

</script>
<style scoped>
  .fl {
    float: left
  }

  .Wout {
    width: auto;
  }
.selectBox{
  width:250px;
}
.en_US .selectBox{
  width:280px;
  padding:0px!important;
}
  /* .magTOp{margin: 15px 0;line-height: 30px;} */
  .nameWidth {
    width: 80px;
    text-align: center;
    box-sizing: border-box;
    padding-right: 10px;
    height: 30px;
    line-height: 32px;
    /* font-size: 14px; */
  }
.en_US .nameWidth{
  width:120px;
}
  .marginLF {
    margin-left: 80px;
  }

  .productlayout {
    width: 250px;
  }
.en_US .productlayout{
  width:280px;
}
  /* 标题 */
  .iqis-page-headline {
    width: 100%;
    height: 16px;
    font-size: 16px;
    /* font-family:'微软雅黑'; */
    /* color:rgba(38,38,38,1); */
    line-height: 16px;

    display: inline-block;
    margin-top: 25px;
    padding-left: 0px;
    padding-bottom: 35px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }

  .iqis-page-headlinecourse {
    margin-top: 40px;
  }

  .iqis-page-message {
    width: 100%;
    padding: 24px 0 45px 5px;
    font-size: 14px;
    /* font-family:MicrosoftYaHei; */
    /* color:rgba(92,92,92,1); */
    line-height: 14px;
  }

  /* p标签的公共样式 */
  .sn2 p, .creationtime p, .supplierdetails p {
    display: inline-block;
    padding: 0;
  }

  /* 产品批号 */
  .creationtime p:nth-child(2), .supplierdetails p:nth-child(2) {
    margin-left: 8px;
  }

  .sn2 p {
    margin-right: 30px;
    margin-bottom: 20px;
  }

  .unusualcolor {
    color: rgba(65, 143, 238, 1);
  }

</style>


