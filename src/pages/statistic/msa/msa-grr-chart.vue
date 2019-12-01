<template>
  <div class="iqis-page" id="grrChart">
    <div style="display:flex;justify-content:space-between">
      <div>
        <span>{{$t('statistical.analNo')}}</span> 
        <Select style="width:250px;display:inline-block" v-model="grrId" filterable>
          <Option v-for="(item,index) in grrList" :key="index" :value="item.grrId" :label="item.no">{{item.no}}</Option>
        </Select>
        <Button type="primary" @click="getData">{{$t('statistical.seeAnalChart')}}</Button>
      </div>
      <Button type="primary" @click="onExportReport" :loading="reportLoading">
        <span v-if="!reportLoading">{{$t('statistical.exportReport')}}</span>
        <span v-else>{{$t('statistical.exporting')}}</span>
      </Button>
    </div>
    <Tabs value="name1">  

      <TabPane :label="i18n.t('statistical.dataSheet')" class="chartTable1" name="name1">
        <div class="content">
          <table style="width:100%;">
            <tr>
              <td width="25%"></td>
              <td width="50%" class="chartTitle">【{{$t('statistical.dataSheet')}}】</td>
              <td width="25%">
                <div>{{$t('statistical.tabulationDate')}}：{{new Date().Format("yyyy-MM-dd hh:mm")}}</div>
                <div>{{$t('statistical.pages')}}：1/6</div>
              </td>
            </tr>
          </table>
          <Row class="chartInfo" :gutter="25">
            <i-col span="8">{{$t('statistical.chkDevNo')}}：{{basic.chkDevNo}}</i-col>
            <i-col span="8">{{$t('statistical.analTime')}}：{{basic.analysisTime}}</i-col>
            <i-col span="8">{{$t('statistical.analysisPeople')}}：{{basic.analysisUserName}}</i-col>
            <i-col span="8">{{$t('statistical.measUserNum')}}：{{basic.measUserNum}}</i-col>
            <i-col span="8">{{$t('statistical.measNum')}}：{{basic.measNum}}</i-col>
            <i-col span="8">{{$t('statistical.productNum')}}：{{basic.productNum}}</i-col>
          </Row>
          <table v-if="tableData[0]" class="grrChartTable" style="width:100%" border="1" cellspacing="0">
            <tr>
              <th>/</th>
              <th :colspan="basic.measNum+2" v-for="(item,index) in grrAnalysisDataDtos" :key="index">{{item[0].inspectorName}}</th>
              <th>{{$t('statistical.productMean')}}</th>
            </tr>
            <tr>
              <th v-for="(item,index) in tableTitle2" :key="index">{{item}}</th>
            </tr>
            <tr v-for="(item,index) in tableData" :key="index">
              <td class="th">{{index+1==tableData.length?i18n.t('statistical.meanValue'):index+1}}</td>
              <td v-for="(it,ind) in item" :key="ind">{{it}}</td>
            </tr>
            <tr>
              <td class="th" style="text-align:left;padding-left:20px" :colspan="tableData[0].length+1">
                Rbar = (
                <span v-for="(item,index) in grrAnalysisDataDtos" :key="index" >[Rbar{{index+1}}={{expression['Rbar'+index]}}]{{index+1==grrAnalysisDataDtos.length?')':'+'}}</span>
                ÷[{{$t('statistical.inspectorNum')}}={{basic.measUserNum}}]={{expression.Rbar}}
              </td>
            </tr>
            <tr>
              <td class="th" style="text-align:left;padding-left:20px" :colspan="tableData[0].length+1">
                Xbar = (
                <span v-for="(item,index) in grrAnalysisDataDtos" :key="index" >[Xbar{{index+1}}={{expression['Xbar'+index]}}]{{index+1==grrAnalysisDataDtos.length?')':'+'}}</span>
                ÷[{{$t('statistical.inspectorNum')}}={{basic.measUserNum}}]={{expression.xbar}}
              </td>
            </tr>
            <tr>
              <td class="th" style="text-align:left;padding-left:20px" :colspan="tableData[0].length+1">
                Xdiff = [MaxXbar={{expression.MaxXbar}}] - [MinXbar={{expression.MinXbar}}] = {{expression.Xdiff}}
              </td>
            </tr>
            <tr>
              <td class="th" style="text-align:left;padding-left:20px" :colspan="tableData[0].length+1">
                Rp = [MaxXbar（{{$t('statistical.productOf')}}）={{expression.prod_MaxXbar}}] - [MinXbar（{{$t('statistical.productOf')}}）={{expression.prod_MinXbar}}] = {{expression.Rp}}
              </td>
            </tr>
            <tr>
              <td class="th" style="text-align:left;padding-left:20px" :colspan="tableData[0].length+1">
                UCLr = [Rbar={{expression.Rbar}}] x [D4={{expression.D4}}] = {{expression.UCLr}}
              </td>
            </tr>
            <tr>
              <td class="th" style="text-align:left;padding-left:20px" :colspan="tableData[0].length+1">
                LCLr = [Rbar={{expression.Rbar}}] x [D3=0.000] = {{expression.LCLr}}
              </td>
            </tr>
            <tr>
              <td class="th" style="text-align:left;padding-left:20px" :colspan="tableData[0].length+1">
                {{$t('statistical.lastLeg')}}
              </td>
            </tr>
          </table>
          <Row style="line-height:40px;">
            <i-col span="8">{{$t('statistical.confirm')}}：</i-col>
            <i-col span="8">{{$t('statistical.reReview')}}：</i-col>
            <i-col span="8">{{$t('statistical.Tabulation')}}：</i-col>
          </Row>
        </div>
      </TabPane>

      <TabPane :label="i18n.t('statistical.dataReport')" class="chartTable2" name="name2">
        <div class="content">
          <table style="width:100%;">
            <tr>
              <td width="25%"></td>
              <td width="50%" class="chartTitle">【{{$t('statistical.dataReport')}}】</td>
              <td width="25%">
                <div>{{$t('statistical.tabulationDate')}}：{{new Date().Format("yyyy-MM-dd hh:mm")}}</div>
                <div>{{$t('statistical.pages')}}：2/6</div>
              </td>
            </tr>
          </table>
          <Row class="chartInfo" :gutter="25">
            <i-col span="6">{{$t('statistical.analNo')}}：{{basic.no}}</i-col>
            <i-col span="6">{{$t('statistical.analTime')}}：{{basic.analysisTime}}</i-col>
            <i-col span="6">{{$t('statistical.analysisPeople')}}：{{basic.analysisUserName}}</i-col>
            <i-col span="6">{{$t('statistical.prodProcess')}}：{{basic.prodProcessName}}</i-col>
            <i-col span="6">{{$t('statistical.chkDevNo')}}：{{basic.chkDevNo}}</i-col>
            <i-col span="6">{{$t('statistical.chkDevName')}}：{{basic.chkDevName}}</i-col>
            <i-col span="6">{{$t('statistical.project')}}：{{basic.inspectionTypeName}}</i-col>
            <i-col span="6" style="height:21px;"></i-col>
            <i-col span="6">{{$t('statistical.productNo')}}：{{basic.productNo}}</i-col>
            <i-col span="6">{{$t('statistical.productName')}}：{{basic.productName}}</i-col>
            <i-col span="6">{{$t('statistical.usl')}}：{{basic.usl}}</i-col>
            <i-col span="6">{{$t('statistical.lsl')}}：{{basic.lsl}}</i-col>
            <i-col span="6">Rbar={{expression.Rbar}}</i-col>
            <i-col span="6">Xdiff={{expression.Xdiff}}</i-col>
            <i-col span="6">Rp={{expression.Rp}}</i-col>
          </Row>
          <table class="grrChartTable" style="width:100%" border="1" cellspacing="0">
            
            <tr>
              <th>{{$t('statistical.measSysAnal')}}</th>
              <th>%{{$t('statistical.totalVariation')}}</th>
              <th colspan="2">{{$t('statistical.measReference')}}</th>
            </tr>
            <tr>
              <td rowspan="3" style="text-align:left;padding-left:20px">
                <div class="color999">{{$t('statistical.EV')}}</div>
                <div style="display:flex">
                  <div class="color999" style="width:45px;">EV</div>
                  <div style="flex:1">
                    <div class="color999">= Rbar x K1</div>
                    = {{grrAnalysisResultDto.rbar}} x {{grrAnalysisResultDto.k1}}<br>
                    = {{grrAnalysisResultDto.ev}}
                  </div>
                </div>
              </td>
              <td rowspan="3" style="text-align:left;padding-left:20px">
                <div style="display:flex">
                  <div class="color999" style="width:45px;">%EV</div>
                  <div style="flex:1">
                    <div class="color999">= [ EV ÷ TV ] × 100</div>
                    = [ {{grrAnalysisResultDto.ev}} ÷ {{grrAnalysisResultDto.tv}} ] x 100<br>
                    = {{grrAnalysisResultDto.evProbability}}
                  </div>
                </div>
              </td>
              <th width="100">{{$t('statistical.measNum')}}</th>
              <th width="100">K1</th>
            </tr>
            <tr>
              <td>2</td>
              <td>0.8862</td>
            </tr>
            <tr>
              <td>3</td>
              <td>0.5908</td>
            </tr>

            <tr>
              <td rowspan="3" style="text-align:left;padding-left:20px">
                <div class="color999">{{$t('statistical.AV')}}</div>
                <div style="display:flex">
                  <div class="color999" style="width:45px;">AV</div>
                  <div style="flex:1">
                    <div class="color999">= √<span style="border-top:1px solid #999">[(Xdiff x K2)² - (EV² ÷ ({{$t('statistical.productNum')}} x {{$t('statistical.measNum')}}))]</span></div>
                    = √<span style="border-top:1px solid #495060">[({{grrAnalysisResultDto.xdiff}} x {{grrAnalysisResultDto.k2}})² - ({{grrAnalysisResultDto.ev}}² ÷ ({{basic.productNum}} x {{basic.measNum}}))]</span><br>
                    = {{grrAnalysisResultDto.av}}
                  </div>
                </div>
              </td>
              <td rowspan="3" style="text-align:left;padding-left:20px">
                <div style="display:flex">
                  <div class="color999" style="width:45px;">%AV</div>
                  <div style="flex:1">
                    <div class="color999">= [ AV ÷ TV ] × 100</div>
                    = [ {{grrAnalysisResultDto.av}} ÷ {{grrAnalysisResultDto.tv}} ] x 100<br>
                    = {{grrAnalysisResultDto.avProbability}}
                  </div>
                </div>
              </td>
              <th>{{$t('statistical.evaluatePeopleNum')}}</th>
              <th>K2</th>
            </tr>
            <tr>
              <td>2</td>
              <td>0.7071</td>
            </tr>
            <tr>
              <td>3</td>
              <td>0.5231</td>
            </tr>

            <tr>
              <td rowspan="3" style="text-align:left;padding-left:20px">
                <div class="color999">{{$t('statistical.GRR')}}</div>
                <div style="display:flex">
                  <div class="color999" style="width:45px;">GRR</div>
                  <div style="flex:1">
                    <div class="color999">= √<span style="border-top:1px solid #999">EV² + AV²</span></div>
                    = √<span style="border-top:1px solid #495060">{{grrAnalysisResultDto.ev}}² + {{grrAnalysisResultDto.av}}²</span><br>
                    = {{grrAnalysisResultDto.grr}}
                  </div>
                </div>
              </td>
              <td rowspan="3" style="text-align:left;padding-left:20px">
                <div style="display:flex">
                  <div class="color999" style="width:45px;">%GRR</div>
                  <div style="flex:1">
                    <div class="color999">= [ GRR ÷ TV ] × 100</div>
                    = [ {{grrAnalysisResultDto.grr}} ÷ {{grrAnalysisResultDto.tv}} ] x 100<br>
                    = {{grrAnalysisResultDto.grrProbability}}
                  </div>
                </div>
              </td>
              <th>{{$t('statistical.productNum')}}</th>
              <th>K3</th>
            </tr>
            <tr>
              <td>2</td>
              <td>0.7071</td>
            </tr>
            <tr>
              <td>3</td>
              <td>0.5231</td>
            </tr>

            <tr>
              <td rowspan="3" style="text-align:left;padding-left:20px">
                <div class="color999">{{$t('statistical.PV')}}</div>
                <div style="display:flex">
                  <div class="color999" style="width:45px;">PV</div>
                  <div style="flex:1">
                    <div class="color999">= √<span style="border-top:1px solid #999">Rp x K3</span></div>
                    = √<span style="border-top:1px solid #495060">{{grrAnalysisResultDto.rp}} x {{grrAnalysisResultDto.k3}}</span><br>
                    = {{grrAnalysisResultDto.pv}}
                  </div>
                </div>
              </td>
              <td rowspan="3" style="text-align:left;padding-left:20px">
                <div style="display:flex">
                  <div class="color999" style="width:45px;">%PV</div>
                  <div style="flex:1">
                    <div class="color999">= [ PV ÷ TV ] × 100</div>
                    = [ {{grrAnalysisResultDto.pv}} ÷ {{grrAnalysisResultDto.tv}} ] x 100<br>
                    = {{grrAnalysisResultDto.pvProbability}}
                  </div>
                </div>
              </td>
              <td>4</td>
              <td>0.4467</td>
            </tr>
            <tr>
              <td>5</td>
              <td>0.4030</td>
            </tr>
            <tr>
              <td>6</td>
              <td>0.3742</td>
            </tr>

            <tr>
              <td rowspan="4" style="text-align:left;padding-left:20px">
                <div class="color999">{{$t('statistical.TV')}}</div>
                <div style="display:flex">
                  <div class="color999" style="width:45px;">TV</div>
                  <div style="flex:1">
                    <div class="color999">= √<span style="border-top:1px solid #999">GRR² + PV²</span></div>
                    = √<span style="border-top:1px solid #495060">{{grrAnalysisResultDto.grr}}² + {{grrAnalysisResultDto.pv}}²</span><br>
                    = {{grrAnalysisResultDto.tv}}
                  </div>
                </div>
              </td>
              <td rowspan="4" style="text-align:left;padding-left:20px">
                <div style="display:flex">
                  <div class="color999" style="width:45px;">ndc</div>
                  <div style="flex:1">
                    <div class="color999">= [ PV ÷ GRR ] × 1.41</div>
                    = [ {{grrAnalysisResultDto.pv}} ÷ {{grrAnalysisResultDto.grr}} ] x 1.41<br>
                    = {{grrAnalysisResultDto.ndc}}<br>
                    ≈ {{Number(grrAnalysisResultDto.ndc).toFixed()}}
                  </div>
                </div>
              </td>
              <td>7</td>
              <td>0.3534</td>
            </tr>
            <tr>
              <td>8</td>
              <td>0.3375</td>
            </tr>
            <tr>
              <td>9</td>
              <td>0.3249</td>
            </tr>
            <tr>
              <td>10</td>
              <td>0.3146</td>
            </tr>
            <tr>
              <th colspan="4">{{$t('statistical.analJudge')}}</th>
            </tr>
            <tr>
              <th>% GRR</th>
              <th>n d c</th>
              <th>{{$t('statistical.overallJudge')}}</th>
              <th>{{$t('statistical.analComparison')}}</th>
            </tr>
            <tr>
              <td>{{grrAnalysisResultDto.grrResult==0?i18n.t('statistical.acceptable'):grrAnalysisResultDto.grrResult==1?i18n.t('statistical.acceptReluctantly'):i18n.t('statistical.unacceptable')}}</td>
              <td>{{grrAnalysisResultDto.ndcResult==0?i18n.t('statistical.acceptable'):i18n.t('statistical.unacceptable')}}</td>
              <td>{{grrAnalysisResultDto.overallResult==0?i18n.t('statistical.acceptable'):grrAnalysisResultDto.overallResult==1?i18n.t('statistical.acceptReluctantly'):i18n.t('statistical.unacceptable')}}</td>

              <td v-if="grrAnalysisResultDto.ev>grrAnalysisResultDto.av">{{$t('statistical.repeatability')}} > {{$t('statistical.reproducibility')}}</td>
              <td v-else-if="grrAnalysisResultDto.ev<grrAnalysisResultDto.av">{{$t('statistical.reproducibility')}} > {{$t('statistical.repeatability')}}</td>
              <td v-else>{{$t('statistical.reproducibility')}} = {{$t('statistical.repeatability')}}</td>
            </tr>
            <tr>
              <th colspan="4">{{$t('statistical.causeAnalysis')}}</th>
            </tr>
            <tr>
              <td colspan="4">
                <i-input type="textarea"></i-input>
              </td>
            </tr>
          </table>
          <Row style="line-height:40px;">
            <i-col span="8">{{$t('statistical.confirm')}}：</i-col>
            <i-col span="8">{{$t('statistical.reReview')}}：</i-col>
            <i-col span="8">{{$t('statistical.Tabulation')}}：</i-col>
          </Row>
        </div>
      </TabPane>

      <TabPane :label="i18n.t('statistical.averageControl')" class="chartTable3" name="name3">
        <div class="content">
          <table style="width:100%;">
            <tr>
              <td width="25%"></td>
              <td width="50%" class="chartTitle">【{{$t('statistical.averageControl')}}】</td>
              <td width="25%">
                <div>{{$t('statistical.tabulationDate')}}：{{new Date().Format("yyyy-MM-dd hh:mm")}}</div>
                <div>{{$t('statistical.pages')}}：3/6</div>
              </td>
            </tr>
          </table>
          <Row class="chartInfo" :gutter="25">
            <i-col span="4">{{$t('statistical.chkDevNo')}}：{{basic.chkDevNo}}</i-col>
            <i-col span="4">{{$t('statistical.chkDevName')}}：{{basic.chkDevName}}</i-col>
            <i-col span="4">{{$t('statistical.analysisPeople')}}：{{basic.analysisUserName}}</i-col>
            <i-col span="4">{{$t('statistical.productNum')}}：{{basic.productNum}}</i-col>
            <i-col span="4">{{$t('statistical.measUserNum')}}：{{basic.measUserNum}}</i-col>
            <i-col span="4">{{$t('statistical.measNum')}}：{{basic.measNum}}</i-col>
            <i-col span="4">{{$t('statistical.productNo')}}：{{basic.productNo}}</i-col>
            <i-col span="4">{{$t('statistical.productName')}}：{{basic.productName}}</i-col>
            <i-col span="4">xbar：{{grrAnalysisResultDto.xbar}}</i-col>
            <i-col span="4">xUCL：{{averageData.ucl}}</i-col>
            <i-col span="4">xLCL：{{averageData.lcl}}</i-col>
          </Row>
          <div id="averageChart" style="width:100%;height:400px"></div>
          <table class="grrChartTable" style="width:100%" border="1" cellspacing="0">
            <tr>
              <td :width="index==0?100:'auto'" :class="index==0?'th':''" v-for="(item,index) in averageData.dataList[0]" :key="index">{{index==0?i18n.t('statistical.prodOrderNum'):index}}</td>
            </tr>
            <tr v-for="(item,index) in averageData.dataList" :key="index">
              <td :class="ind==0?'th':''" v-for="(it,ind) in item" :key="ind">{{it}}</td>
            </tr>
          </table>
          <Row style="line-height:40px;">
            <i-col span="8">{{$t('statistical.confirm')}}：</i-col>
            <i-col span="8">{{$t('statistical.reReview')}}：</i-col>
            <i-col span="8">{{$t('statistical.Tabulation')}}：</i-col>
          </Row>
        </div>
      </TabPane>

      <TabPane :label="i18n.t('statistical.rangeControl')" class="chartTable4" name="name4">
        <div class="content">
          <table style="width:100%;">
            <tr>
              <td width="25%"></td>
              <td width="50%" class="chartTitle">【{{$t('statistical.rangeControl')}}】</td>
              <td width="25%">
                <div>{{$t('statistical.tabulationDate')}}：{{new Date().Format("yyyy-MM-dd hh:mm")}}</div>
                <div>{{$t('statistical.pages')}}：4/6</div>
              </td>
            </tr>
          </table>
          <Row class="chartInfo" :gutter="25">
            <i-col span="4">{{$t('statistical.chkDevNo')}}：{{basic.chkDevNo}}</i-col>
            <i-col span="4">{{$t('statistical.chkDevName')}}：{{basic.chkDevName}}</i-col>
            <i-col span="4">{{$t('statistical.analysisPeople')}}：{{basic.analysisUserName}}</i-col>
            <i-col span="4">{{$t('statistical.productNum')}}：{{basic.productNum}}</i-col>
            <i-col span="4">{{$t('statistical.measUserNum')}}：{{basic.measUserNum}}</i-col>
            <i-col span="4">{{$t('statistical.measNum')}}：{{basic.measNum}}</i-col>
            <i-col span="4">{{$t('statistical.productNo')}}：{{basic.productNo}}</i-col>
            <i-col span="4">{{$t('statistical.productName')}}：{{basic.productName}}</i-col>
            <i-col span="4">rbar：{{grrAnalysisResultDto.rbar}}</i-col>
            <i-col span="4">rUCL：{{rangeData.ucl}}</i-col>
            <i-col span="4">rLCL：{{rangeData.lcl}}</i-col>
          </Row>
          <div id="rangeChart" style="width:100%;height:400px"></div>
          <table class="grrChartTable" style="width:100%" border="1" cellspacing="0">
            <tr>
              <td :class="index==0?'th':''" :width="index==0?100:'auto'" v-for="(item,index) in rangeData.dataList[0]" :key="index">{{index==0?i18n.t('statistical.prodOrderNum'):index}}</td>
            </tr>
            <tr v-for="(item,index) in rangeData.dataList" :key="index">
              <td :class="ind==0?'th':''" v-for="(it,ind) in item" :key="ind">{{it}}</td>
            </tr>
          </table>
          <Row style="line-height:40px;">
            <i-col span="8">{{$t('statistical.confirm')}}：</i-col>
            <i-col span="8">{{$t('statistical.reReview')}}：</i-col>
            <i-col span="8">{{$t('statistical.Tabulation')}}：</i-col>
          </Row>
        </div>
        </TabPane>

      <TabPane :label="i18n.t('statistical.shakeChart')" class="chartTable5" name="name5">
        <div class="content">
          <table style="width:100%;margin-bottom:15px;">
            <tr>
              <td width="25%"></td>
              <td width="50%" class="chartTitle">【{{$t('statistical.shakeChart')}}】</td>
              <td width="25%">
                <div>{{$t('statistical.tabulationDate')}}：{{new Date().Format("yyyy-MM-dd hh:mm")}}</div>
                <div>{{$t('statistical.pages')}}：5/6</div>
              </td>
            </tr>
          </table>
          <Row class="chartInfo" :gutter="25">
            <i-col span="4">{{$t('statistical.chkDevNo')}}：{{basic.chkDevNo}}</i-col>
            <i-col span="4">{{$t('statistical.chkDevName')}}：{{basic.chkDevName}}</i-col>
            <i-col span="4">{{$t('statistical.analysisPeople')}}：{{basic.analysisUserName}}</i-col>
            <i-col span="4">{{$t('statistical.productNum')}}：{{basic.productNum}}</i-col>
            <i-col span="4">{{$t('statistical.measUserNum')}}：{{basic.measUserNum}}</i-col>
            <i-col span="4">{{$t('statistical.measNum')}}：{{basic.measNum}}</i-col>
            <i-col span="4">{{$t('statistical.productNo')}}：{{basic.productNo}}</i-col>
            <i-col span="4">{{$t('statistical.productName')}}：{{basic.productName}}</i-col>
            <i-col span="4">{{$t('statistical.totalGroupSize')}}：{{Number(basic.productNum)*Number(basic.measUserNum)}}</i-col>
          </Row>
          <div id="shockChart" style="width:100%;height:400px"></div>
          <Row :gutter="25">
            <i-col span="12">
              <table class="grrChartTable" style="width:100%" border="1" cellspacing="0">
                <tr>
                  <th>{{$t('statistical.serialNumber')}}</th>
                  <th>{{$t('statistical.prodOrderNum')}}</th>
                  <th>{{$t('statistical.inspector')}}</th>
                  <th>{{$t('statistical.average')}}</th>
                  <th>{{$t('statistical.maximum')}}</th>
                  <th>{{$t('statistical.minimum')}}</th>
                </tr>
                <tr v-for="(item,index) in shockData1" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{$t('statistical.product')}}{{item.prodOrderNum}}</td>
                  <td>{{item.inspectorName}}</td>
                  <td>{{item.meanValue}}</td>
                  <td>{{item.maxValue}}</td>
                  <td>{{item.minValue}}</td>
                </tr>
              </table>
            </i-col>
            <i-col span="12">
              <table class="grrChartTable" style="width:100%" border="1" cellspacing="0">
                <tr>
                  <th>{{$t('statistical.serialNumber')}}</th>
                  <th>{{$t('statistical.prodOrderNum')}}</th>
                  <th>{{$t('statistical.inspector')}}</th>
                  <th>{{$t('statistical.average')}}</th>
                  <th>{{$t('statistical.maximum')}}</th>
                  <th>{{$t('statistical.minimum')}}</th>
                </tr>
                <tr v-for="(item,index) in shockData2" :key="index">
                  <td>{{shockData1.length+index+1}}</td>
                  <td>{{$t('statistical.product')}}{{item.prodOrderNum}}</td>
                  <td>{{item.inspectorName}}</td>
                  <td>{{item.meanValue}}</td>
                  <td>{{item.maxValue}}</td>
                  <td>{{item.minValue}}</td>
                </tr>
              </table>
            </i-col>
          </Row>
          <Row style="line-height:40px;">
            <i-col span="8">{{$t('statistical.confirm')}}：</i-col>
            <i-col span="8">{{$t('statistical.reReview')}}：</i-col>
            <i-col span="8">{{$t('statistical.Tabulation')}}：</i-col>
          </Row>
        </div>
      </TabPane>
      
      <TabPane :label="i18n.t('statistical.scatterChart')" class="chartTable6" name="name6">
        <div class="content">
          <table style="width:100%;margin-bottom:15px;">
            <tr>
              <td width="25%"></td>
              <td width="50%" class="chartTitle">【{{$t('statistical.scatterChart')}}】</td>
              <td width="25%">
                <div>{{$t('statistical.tabulationDate')}}：{{new Date().Format("yyyy-MM-dd hh:mm")}}</div>
                <div>{{$t('statistical.pages')}}：6/6</div>
              </td>
            </tr>
          </table>
          <Row class="chartInfo" :gutter="25">
            <i-col span="4">{{$t('statistical.chkDevNo')}}：{{basic.chkDevNo}}</i-col>
            <i-col span="4">{{$t('statistical.chkDevName')}}：{{basic.chkDevName}}</i-col>
            <i-col span="4">{{$t('statistical.analysisPeople')}}：{{basic.analysisUserName}}</i-col>
            <i-col span="4">{{$t('statistical.productNum')}}：{{basic.productNum}}</i-col>
            <i-col span="4">{{$t('statistical.measUserNum')}}：{{basic.measUserNum}}</i-col>
            <i-col span="4">{{$t('statistical.measNum')}}：{{basic.measNum}}</i-col>
            <i-col span="4">{{$t('statistical.productNo')}}：{{basic.productNo}}</i-col>
            <i-col span="4">{{$t('statistical.productName')}}：{{basic.productName}}</i-col>
          </Row>
          <div id="scatteredChart" style="width:100%;height:400px"></div>
          <Row :gutter="25">
            <i-col span="12">
              <table v-if="scatteredData1[0]" class="grrChartTable" style="width:100%" border="1" cellspacing="0">
                <tr>
                  <th>{{$t('statistical.serialNumber')}}</th>
                  <th>{{$t('statistical.prodOrderNum')}}</th>
                  <th>{{$t('statistical.inspector')}}</th>
                  <th>{{$t('statistical.average')}}</th>
                  <th v-for="(item,index) in scatteredData1[0].value" :key="index">{{$t('statistical.times')}}{{index+1}}</th>
                </tr>
                <tr v-for="(item,index) in scatteredData1" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{$t('statistical.product')}}{{item.prodOrderNum}}</td>
                  <td>{{item.inspectorName}}</td>
                  <td>{{item.meanValue}}</td>
                  <td v-for="(it,ind) in item.value" :key="ind">{{it}}</td>
                </tr>
              </table>
            </i-col>
            <i-col span="12">
              <table v-if="scatteredData2[0]" class="grrChartTable" style="width:100%" border="1" cellspacing="0">
                <tr>
                  <th>{{$t('statistical.serialNumber')}}</th>
                  <th>{{$t('statistical.prodOrderNum')}}</th>
                  <th>{{$t('statistical.inspector')}}</th>
                  <th>{{$t('statistical.average')}}</th>
                  <th v-for="(item,index) in scatteredData2[0].value" :key="index">{{$t('statistical.times')}}{{index+1}}</th>
                </tr>
                <tr v-for="(item,index) in scatteredData2" :key="index">
                  <td>{{scatteredData1.length+index+1}}</td>
                  <td>{{$t('statistical.product')}}{{item.prodOrderNum}}</td>
                  <td>{{item.inspectorName}}</td>
                  <td>{{item.meanValue}}</td>
                  <td v-for="(it,ind) in item.value" :key="ind">{{it}}</td>
                </tr>
              </table>
            </i-col>
          </Row>
          <Row style="line-height:40px;">
            <i-col span="8">{{$t('statistical.confirm')}}：</i-col>
            <i-col span="8">{{$t('statistical.reReview')}}：</i-col>
            <i-col span="8">{{$t('statistical.Tabulation')}}：</i-col>
          </Row>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import $ from 'jquery'
import echarts from 'echarts'
import html2canvas from 'html2canvas';
export default {
  props:["params","tabKey"],
  data:function() {
    let vm = this;
    return{
      i18n:window.i18n,
      grrId:null,
      grrList:[],

      basic:{},
      grrAnalysisDataDtos:{},
      grrAnalysisResultDto:{},
      tableData:[],
      expression:{},
      tableTitle2:[],
      tabsShow:true,

      averageData:{dataList:[],ucl:null,cl:null,lcl:null},//平均数控制图
      averageChart:null,
      averageChartOption:{},

      rangeData:{dataList:[],ucl:null,cl:null,lcl:null},//极差控制图
      rangeChart:null,
      rangeChartOption:{},

      shockData1:[],
      shockData2:[],
      shockChart:null,
      shockChartOption:{
        xAxis: {
          type: 'category',
        },
        grid: {
            left:40,right:70
        },
        yAxis: {
            type: 'value',
            max:'dataMax',
            scale:true,
        },
        tooltip: {
            trigger: 'axis',
        },
        series: [{
            symbol:'rect',
            symbolSize: 6,
            data: [],
            itemStyle: { //设置每个数据节点对应颜色
              normal: {
                color: function (params) {
                  let index = Math.floor(params.dataIndex/(Number(vm.basic.measUserNum)*3))
                  return vm.colorList[index]
                }
              }
            },
            type: 'scatter',
            markLine:{
                symbol:'none',
                lineStyle:{
                  type:"solid"
                },
                animation: false,
                data:[
                  // [
                  //   { xAxis: 0, yAxis: 23.21,lineStyle: {color: 'red'}},      // 当xAxis为类目轴时，数值1会被理解为类目轴的index，通过xAxis:-1|MAXNUMBER可以让线到达grid边缘
                  //   { xAxis: 0, yAxis: 23.1},             // 当xAxis为类目轴时，字符串'周三'会被理解为与类目轴的文本进行匹配
                  // ],
                  // [
                  //   { xAxis: 1, yAxis: 23.11,lineStyle: {color: 'yellow'}},
                  //   { xAxis: 1, yAxis: 23.02},
                  // ],
                  // [
                  //   { xAxis: 2, yAxis: 23.22},
                  //   { xAxis: 2, yAxis: 23.05},
                  // ],
                  
                  // [
                  //   { xAxis: 0, yAxis: 23.153},
                  //   { xAxis: 1, yAxis: 23.070},
                  // ],
                  // [
                  //   { xAxis: 1, yAxis: 23.070},
                  //   { xAxis: 2, yAxis: 23.157},
                  // ]
                ],
            }
        }]
      },

      scatteredData1:[],
      scatteredData2:[],
      scatteredChart:null,
      scatteredChartOption:{
        xAxis: {
          type: 'category',
        },
        grid: {
            left:40,right:70
        },
        yAxis: {
            type: 'value',
            max:'dataMax',
            scale:true,
        },
        tooltip: {
            trigger: 'axis',
        },
        series: [{
            symbolSize: 6,
            data: [],
            itemStyle: { //设置每个数据节点对应颜色
              normal: {
                color: function (params) {
                  let index = Math.floor(params.dataIndex/(Number(vm.basic.measUserNum)*Number(vm.basic.measNum)))
                  return vm.colorList[index]
                }
              }
            },
            type: 'scatter',
        }]
      },
      reportUrls:[],
      reportLoading:false,
      // colorList:["#95F05D", "#C9690C", "#975FE4", "#FFD736", "#5DA0F0", "#21A4BF","#2981CC","#FA9737","#EC63F2","#FAD337","#29CCCC","#B10DB9","#F2637B","#A51E34"]
      colorList:["#A51E34", "#F2637B", "#B10DB9", "#29CCCC", "#FAD337", "#EC63F2","#FA9737","#2981CC","#95F05D","#21A4BF","#5DA0F0","#FFD736","#975FE4","#C9690C"]

    }
  },created(){
    this.refreshData()
    
  },mounted () {
      let that = this
      window.onresize = () => {
          return (() => {
              let tabs_width = $('#grrChart .ivu-tabs-content').width()-40;
              $("#averageChart").css('width', tabs_width);
              $("#rangeChart").css('width', tabs_width);
              $("#shockChart").css('width', tabs_width);
              $("#scatteredChart").css('width', tabs_width);
              this.averageChart.resize();
              this.rangeChart.resize();
              this.shockChart.resize();
              this.scatteredChart.resize();
          })()
      }
  },
  methods:{
    refreshData(){
      this.$http.get('/basic/grr?page=1&limit=99999').then((res)=>{
        this.grrList = res.data
        this.grrId = this.$props.params && this.$props.params.grrId
        this.getData()
      })
    },
    getData(){
      let that = this;
      if(!this.grrId){return}
      that.$http.get('/basic/grr/chart/'+that.grrId).then((res)=>{
        that.basic = res.data
        //重复性和再现性两个表
        that.grrAnalysisDataDtos = res.data.grrAnalysisDataDtos
        that.grrAnalysisResultDto = res.data.grrAnalysisResultDto
        that.tableData = res.data.tableData
        that.expression = res.data.expression

        that.tableTitle2 = [i18n.t('statistical.prodOrderNum')]
        for(let i in that.grrAnalysisDataDtos){
          for(let j=0;j<that.grrAnalysisDataDtos[i][0].measValue.split(',').length;j++){
            let times = Number(j)+Number(1)
            that.tableTitle2.push(i18n.t('statistical.times')+times)
          }
          that.tableTitle2.push(i18n.t('statistical.meanValue'),i18n.t('statistical.range2'))
        }
        that.tableTitle2.push(i18n.t('statistical.meanValue'))

        //平均数控制图表
        that.averageChart = echarts.init(document.getElementById("averageChart"));//初始化
        that.averageChartOption = that.drawAvgAndRange(res.data.grrMeanSpcDto)//操作接口数据改为图需要的数据
        that.averageChart.setOption(that.averageChartOption);//显示图表
        that.averageData = res.data.grrMeanSpcDto

        //极差控制图表
        that.rangeChart = echarts.init(document.getElementById("rangeChart"));
        that.rangeChartOption = that.drawAvgAndRange(res.data.grrRangeSpc)
        that.rangeChart.setOption(that.rangeChartOption);
        that.rangeData = res.data.grrRangeSpc

        //震荡图
        let shockChart = res.data.shockChart
        let data1 = []
        let dataMarkLine = []
        for(let i in shockChart){
          data1.push({value:[i18n.t('statistical.product')+shockChart[i].prodOrderNum+shockChart[i].inspectorName,shockChart[i].maxValue]})
          data1.push({value:[i18n.t('statistical.product')+shockChart[i].prodOrderNum+shockChart[i].inspectorName,shockChart[i].meanValue],symbol:'none'})
          data1.push({value:[i18n.t('statistical.product')+shockChart[i].prodOrderNum+shockChart[i].inspectorName,shockChart[i].minValue]})
          let index = Math.floor(Number(i)/3)
          dataMarkLine.push(
            [
              {xAxis:Number(i),yAxis:Number(shockChart[i].maxValue),lineStyle:{color:that.colorList[index]}},
              {xAxis:Number(i),yAxis:Number(shockChart[i].minValue)},
            ] 
          )
          if(((Number(i)+1)%3)==0){
            dataMarkLine.push(
              [
                { xAxis: i-2, yAxis: shockChart[i-2].meanValue},
                { xAxis: i-1, yAxis: shockChart[i-1].meanValue},
              ],
              [
                { xAxis: i-1, yAxis: shockChart[i-1].meanValue},
                { xAxis: Number(i), yAxis: shockChart[i].meanValue},
              ]
            )
          }
        }
        that.shockChartOption.series[0].data = data1
        that.shockChartOption.series[0].markLine.data = dataMarkLine
        // 震荡表
        that.shockData1 = []
        that.shockData2 = []
        let length1 = Math.ceil(res.data.shockChart.length/2)
        for(let i=0;i<length1;i++){
          that.shockData1.push(res.data.shockChart[i])
        }
        for(let i=length1;i<res.data.shockChart.length;i++){
          that.shockData2.push(res.data.shockChart[i])
        }
        that.shockChart = echarts.init(document.getElementById("shockChart"));
        that.shockChart.setOption(that.shockChartOption);

        //散点图
        let scatteredChart = res.data.scatteredChart
        let data2 = []
        for(let i in scatteredChart){
          for(let j in scatteredChart[i].value){
            data2.push([i18n.t('statistical.product')+scatteredChart[i].prodOrderNum+scatteredChart[i].inspectorName,scatteredChart[i].value[j]])
          }
        }
        that.scatteredChartOption.series[0].data = data2
        that.scatteredChart = echarts.init(document.getElementById("scatteredChart"));
        that.scatteredChart.setOption(that.scatteredChartOption);
        // 散点表
        that.scatteredData1 = []
        that.scatteredData2 = []
        let length2 = Math.ceil(scatteredChart.length/2)
        for(let i=0;i<length2;i++){
          that.scatteredData1.push(scatteredChart[i])
        }
        for(let i=length2;i<scatteredChart.length;i++){
          that.scatteredData2.push(scatteredChart[i])
        }

      })
    },drawAvgAndRange(params){
      let that = this;
      let option={
        tooltip: {
            trigger: 'axis'
        },
        legend:{

        },
        grid: {
            left:40,right:70
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: []
        },
        yAxis: {
            type: 'value',
            // min:'dataMin',
            max:'dataMax',
            scale:true,
        },
        series: []
      }

      let series = []
      for(let i in params.dataList){
        let data=[]
        let name=null
        for(let j in params.dataList[i]){
          if(j==0){
            name = params.dataList[i][j]
          }else{
            data.push(params.dataList[i][j])
          }
        }
        series.push({
          name:name,
          data: data,
          type: 'line',
          itemStyle:{color:that.colorList[i]}
        })
      }
      option.series=series

      let xTitle = []
      for(let i=1;i<params.dataList[0].length;i++){
        xTitle.push(i)
      }
      option.xAxis.data=xTitle

      let markLine = {
        data: [
          {
            yAxis: Number(params.ucl),
            label:{
              formatter:'UCL {c}'
            },
            lineStyle: {
              color: 'green',
              type: 'dashed'
            }
          },
          {
            yAxis: Number(params.cl),
            label:{
              formatter:'CL {c}'
            },
            lineStyle: {
              color: 'green',
              type: 'solid'
            }
          },
          {
            yAxis: Number(params.lcl),
            label:{
              formatter:'LCL {c}'
            },
            lineStyle: {
              color: 'green',
              type: 'dashed'
            }
          },
        ]
      }
      option.series[0]['markLine']=markLine

      return option
    },
    onExportReport(){
      let that = this;
      that.reportLoading = true;
      setTimeout(()=>{
        that.reportUrls = []
        $("#grrChart .ivu-tabs-tabpane .content").css("border","none")
        for(let i=1;i<7;i++){
          html2canvas($('.chartTable'+i+' .content')[0]).then(function(canvas){
            let url = canvas.toDataURL("image/jpeg",1.0)
            that.reportUrls.push(url)
          })
        }
      },500)
    }
  },
  watch:{
    reportUrls(urls){
      if(urls.length == 6){
        this.$LocalStorage.set('grrReportUrls',JSON.stringify(urls))
        const {href} = this.$router.resolve({ 
          name: 'downloadPDF',
          query:{type:"multiple"}
        }); 
        this.reportLoading = false;
        $("#grrChart .ivu-tabs-tabpane .content").css("border","1px solid #000")
        window.open(href, '_blank');
      }
    }
  }
}
</script>
<style>
#grrChart .ivu-tabs{
  margin-top:20px;
}
#grrChart .ivu-tabs-content.ivu-tabs-content-animated{
  flex: 0 1 auto;
  padding: 0px;
  overflow: visible;
}
#grrChart .ivu-tabs-bar{
  margin-right:0!important;
  margin-bottom:25px;
}
#grrChart .ivu-tabs-nav-scroll{
  text-align:center;
}
#grrChart .nav-text.ivu-tabs-nav{
  float:none;
  display: inline-block;
}

.chartTitle{
  font-size: 32px;
  line-height: 40px;
  text-align: center;
}
.chartInfo{
  border: 1px solid #666;
  margin: 20px 0!important;
  padding-top:10px;
}
.chartInfo .ivu-col{
  margin-bottom:10px;
}
.grrChartTable{
  border-color: #e9eaec;
}
.grrChartTable th,.grrChartTable td{
  height: 40px;
  text-align: center;
  color: #495060;
}
.grrChartTable th{
  background: #eee;
  font-weight: bold;
}
.grrChartTable .th{
  background:#eee;
}
.color999{
  color:#999;
  font-weight: bold;
}

#grrChart .ivu-tabs .ivu-tabs-tabpane .content{
  border: 1px solid #000;
  padding: 20px;
}
</style>