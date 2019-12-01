<template>
    <div class="kappa">
        <div>
            <div class="iqis-page-block-title">{{$t('statistical.productBasic')}}</div>
            <div>
                <Row type="flex" :gutter="24">
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.analysisTime')}}</div>
                        <DatePicker  type="datetime" format="yyyy-MM-dd HH:mm" v-model="ruleForm.analysisTime" :disabled="sub2!=ruleForm.reviewer3Id && sub2!=ruleForm.reviewer1Id && sub2!=ruleForm.reviewer2Id" style="width:100%"></DatePicker>
                    </i-col>
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.analyst')}}</div>
                        <div v-if="!kappaId" class="iqis-page-block-ctrl">
                            <Select :placeholder="i18n.t('pleaseChoose')" :disabled="sub1" v-model="ruleForm.analysisUserId" @on-change="getId(ruleForm.analysisUserId)">
                                <Option v-for="item in inspectorList" :key="item.userId" :value="item.userId">{{item.name}}</Option>
                            </Select>
                        </div>
                        <i-input v-if="kappaId" style="width: 100%;" disabled v-model="ruleForm.analysisUserName"></i-input>
                    </i-col>
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.analysisNum')}}</div>
                        <i-input style="width: 100%;" :disabled="sub1" v-model="ruleForm.no"></i-input>
                    </i-col>
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.startInspection')}}</div>
                        <div class="iqis-page-block-ctrl">
                        <RadioGroup v-model="ruleForm.prodExamType" :disabled="sub1" @on-change="changeProdExamType()">
                            <Radio :disabled="sub1" :label="1">{{$t('statistical.iqcUnusual')}}</Radio>
                            <Radio :disabled="sub1" :label="2">{{$t('statistical.pqc')}}</Radio>
                            <Radio :disabled="sub1" :label="3">{{$t('statistical.oqc')}}</Radio>
                        </RadioGroup>
                        </div>
                    </i-col>
                </Row>
                <Row type="flex" :gutter="24">
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.pn')}}</div>
                        <div v-if="!kappaId" class="iqis-page-block-ctrl">
                            <Select :label="ruleForm.productNo" :disabled="sub1" :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.productId" filterable remote :remote-method="remoteMethod" :loading="loadingRemote" @on-change="changeProductId(ruleForm.productId)">
                                <Option v-for="items in productSimple" :value="items.productId" :label="items.no" :key="items.productId">{{ items.no}}/{{ items.name}}</Option>
                            </Select>
                        </div>
                        <i-input v-if="kappaId" style="width: 100%;" disabled v-model="ruleForm.productNo"></i-input>
                    </i-col>
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.name')}}</div>
                        <i-input style="width: 100%;" :disabled="inputDisbale" v-model="ruleForm.productName"></i-input>
                    </i-col>
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.specifications')}}</div>
                        <i-input style="width: 100%;" :disabled="inputDisbale" v-model="ruleForm.productSpec"></i-input>
                    </i-col>
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.inspection')}}</div>
                        <div v-if="!kappaId" class="iqis-page-block-ctrl">
                            <Select :placeholder="i18n.t('pleaseChoose')" :disabled="sub1" v-model="ruleForm.inspectionTypeId" @on-change="changeInspectionTypeId(ruleForm.inspectionTypeId)">
                                <Option v-for="(item,index) in inspectionTypeList" :key="index" :value="item.inspectionTypeId">{{item.inspectionTypeName}}</Option>
                            </Select>
                        </div>
                        <i-input v-if="kappaId" style="width: 100%;" disabled v-model="ruleForm.inpsectionTypeName"></i-input>
                    </i-col>
                </Row>
                <Row type="flex" :gutter="24">
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.deviceCode')}}</div>
                        <div v-if="!kappaId" class="iqis-page-block-ctrl">
                            <Select :placeholder="i18n.t('pleaseChoose')" :disabled="sub1" @on-change="changeChkDevId(ruleForm.chkDevId)" v-model="ruleForm.chkDevId">
                                <Option v-for="(item,index) in chkDevList" :key="index" :value="item.chkDevId">{{item.name}}</Option>
                            </Select>
                        </div>
                        <i-input v-if="kappaId" style="width: 100%;" disabled v-model="ruleForm.chkDevNo"></i-input>
                    </i-col>
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.deviceName')}}</div>
                        <i-input style="width: 100%;" :disabled="inputDisbale" v-model="ruleForm.chkDevName"></i-input>
                    </i-col>
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.department')}}</div>
                        <div v-if="!kappaId" class="iqis-page-block-ctrl">
                            <Select :placeholder="i18n.t('pleaseChoose')" :disabled="sub1" v-model="ruleForm.departmentId" filterable>
                                <Option v-for="(items,index) in department" :value="items.departmentId"  :key="index">{{items.departmentName}}</Option>
                            </Select>
                        </div>
                        <i-input v-if="kappaId" style="width: 100%;" disabled v-model="ruleForm.departmentName"></i-input>
                    </i-col>
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.numberOfMeasurement')}}</div>
                        <div class="iqis-page-block-ctrl">
                            <Select :placeholder="i18n.t('pleaseChoose')" :disabled="sub1" v-model="ruleForm.measureNum" @on-change="_measurementNum(ruleForm.measureNum)">
                                <Option :value="2"></Option>
                                <Option :value="3"></Option>
                            </Select>
                        </div>
                    </i-col>
                </Row>
                <Row type="flex" :gutter="24">
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.ProdQuantity')}}</div>
                        <i-input style="width: 100%;" :disabled="sub1" v-model="ruleForm.productNum" @on-blur="_ProductQuantity(ruleForm.productNum)"></i-input>
                    </i-col>
                    <i-col span="6"> 
                        <div class="iqis-page-block-label">{{$t('statistical.A')}}</div>
                        <div v-if="!kappaId" class="iqis-page-block-ctrl">
                            <Select :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.reviewer1Id" :disabled="inputDisbale">
                                <Option v-for="item in inspectorList" :key="item.userId" :value="item.userId">{{item.name}}</Option>
                            </Select>
                        </div>
                        <i-input v-if="kappaId" style="width: 100%;" disabled v-model="ruleForm.reviewer1Name"></i-input>
                    </i-col>
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.B')}}</div>
                        <div v-if="!kappaId" class="iqis-page-block-ctrl">
                            <Select :placeholder="i18n.t('pleaseChoose')" :disabled="sub1" v-model="ruleForm.reviewer2Id" @on-change="getName(ruleForm.reviewer2Id,0)">
                                <Option v-for="item in inspectorList" :key="item.userId" :value="item.userId">{{item.name}}</Option>
                            </Select>
                        </div>
                        <i-input v-if="kappaId" style="width: 100%;" disabled v-model="ruleForm.reviewer2Name"></i-input>
                    </i-col>
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.C')}}</div>
                        <div v-if="!kappaId" class="iqis-page-block-ctrl">
                            <Select :placeholder="i18n.t('pleaseChoose')" :disabled="sub1" v-model="ruleForm.reviewer3Id" @on-change="getName(ruleForm.reviewer3Id,1)">
                                <Option v-for="item in inspectorList" :key="item.userId" :value="item.userId">{{item.name}}</Option>
                            </Select>
                        </div>
                        <i-input v-if="kappaId" style="width: 100%;" disabled v-model="ruleForm.reviewer3Name"></i-input>
                    </i-col>
                </Row>
                <Row >
                    <i-col>
                        <div class="iqis-page-block-label">{{$t('statistical.causeIdentify')}}</div>
                        <i-input style="width: 100%;" :disabled="sub2!=ruleForm.reviewer3Id && sub2!=ruleForm.reviewer1Id && sub2!=ruleForm.reviewer2Id" v-model="ruleForm.causeAnalysis"></i-input>
                    </i-col>
                </Row>
            </div>
        </div>
        <div>
            <div class="iqis-page-block-title" style="margin-bottom:10px">
                {{$t('statistical.analyzeData')}}
            </div>
            <table border="1" style="width:45%;float:left;border-collapse:collapse;border:1px solid #dddee1;" class="padding10 padding5" v-if="sub==2">
                <tr>
                    <th>/</th>
                    <th style="width:23%" colspan="2">{{A}}</th>
                    <th style="width:23%" colspan="2">{{B}}</th>
                    <th style="width:23%" colspan="2">{{C}}</th>
                    <th style="width:22%" colspan="2">{{$t('statistical.judgement')}}</th>
                </tr>
                <tr>
                    <th>{{$t('statistical.no')}}</th>
                    <th>A1</th>
                    <th>A2</th>
                    <th>B1</th>
                    <th>B2</th>
                    <th>C1</th>
                    <th>C2</th>
                    <th>{{$t('statistical.benchmark')}}</th>
                    <th>{{$t('statistical.code')}}</th>
                </tr>
                <tr style="text-align:center" v-for="(item,index) in this.totalData">
                    <th>{{index+1}}</th>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][0]" :disabled="sub2!=ruleForm.reviewer1Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][1]" :disabled="sub2!=ruleForm.reviewer1Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][2]" :disabled="sub2!=ruleForm.reviewer2Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][3]" :disabled="sub2!=ruleForm.reviewer2Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][4]" :disabled="sub2!=ruleForm.reviewer3Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][5]" :disabled="sub2!=ruleForm.reviewer3Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][6]" :disabled="sub2!=ruleForm.reviewer3Id && sub2!=ruleForm.reviewer1Id && sub2!=ruleForm.reviewer2Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" :disabled="inputDisbale" v-model="ruleForm.analysisDataList[index][7]" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <!-- <td style="width:11%">{{u[index]}}</td> -->
                </tr>
            </table>
            <table border="1" style="width:45%;float:left;border-collapse:collapse;border:1px solid #dddee1;" class="padding10 padding5" v-if="sub==3">
                <tr>
                    <th>/</th>
                    <th style="width:25%" colspan="3">{{A}}</th>
                    <th style="width:25%" colspan="3">{{B}}</th>
                    <th style="width:25%" colspan="3">{{C}}</th>
                    <th style="width:16%" colspan="2">{{$t('statistical.judgement')}}</th>
                </tr>
                <tr>
                    <th>{{$t('statistical.no')}}</th>
                    <th>A1</th>
                    <th>A2</th>
                    <th>A3</th>
                    <th>B1</th>
                    <th>B2</th>
                    <th>B3</th>
                    <th>C1</th>
                    <th>C2</th>
                    <th>C3</th>
                    <th style="width:8%">{{$t('statistical.benchmark')}}</th>
                    <th style="width:8%">{{$t('statistical.code')}}</th>
                </tr>
                <tr style="text-align:center" v-for="(item,index) in this.totalData">
                    <th>{{index+1}}</th>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][0]" :disabled="sub2!=ruleForm.reviewer1Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][1]" :disabled="sub2!=ruleForm.reviewer1Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][2]" :disabled="sub2!=ruleForm.reviewer1Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][3]" :disabled="sub2!=ruleForm.reviewer2Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][4]" :disabled="sub2!=ruleForm.reviewer2Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][5]" :disabled="sub2!=ruleForm.reviewer2Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][6]" :disabled="sub2!=ruleForm.reviewer3Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][7]" :disabled="sub2!=ruleForm.reviewer3Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][8]" :disabled="sub2!=ruleForm.reviewer3Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][9]" :disabled="sub2!=ruleForm.reviewer3Id && sub2!=ruleForm.reviewer1Id && sub2!=ruleForm.reviewer2Id" @blur="calculate(index)" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                    <td><input type="text" v-model="ruleForm.analysisDataList[index][10]" :disabled="inputDisbale" style="height:100%;width:100%;border;border:none;outline:medium;text-align:center"></td>
                </tr>
            </table>
            <table border="1" style="width:54%;float:right;border-collapse:collapse;border:1px solid #dddee1;" class="padding10 padding5" v-if="sub==2">
                <tr>
                    <th colspan="15" >0 ：0 = A&nbsp;&nbsp;&nbsp;&nbsp; 1 ：0 = B &nbsp;&nbsp;&nbsp;&nbsp; 0 ：1 = C  &nbsp;&nbsp;&nbsp;&nbsp; 1 ：1 = D</th>
                </tr>
                <tr>
                    <th style="width:6%">A-A</th>
                    <th style="width:6%">B-B</th>
                    <th style="width:6%">C-C</th>
                    <th style="width:12%" colspan="2">A-B</th>
                    <th style="width:12%" colspan="2">B-C</th>
                    <th style="width:12%" colspan="2">A-C</th>
                    <th style="width:12%" colspan="2">A-{{$t('statistical.benchmark')}}</th>
                    <th style="width:12%" colspan="2">B-{{$t('statistical.benchmark')}}</th>
                    <th style="width:12%" colspan="2">C-{{$t('statistical.benchmark')}}</th>
                </tr>
                <tr style="text-align:center" v-for="(item,index) in this.totalData">
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][0]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][1]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][2]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][3]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][4]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][5]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][6]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][7]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][8]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][9]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][10]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][11]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][12]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][13]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][14]}}</div></td>
                </tr>
            </table>
            <table border="1" style="width:54%;float:right;border-collapse:collapse;border:1px solid #dddee1;" class="padding10 padding5" v-if="sub==3">
                <tr>
                    <th colspan="21" >0 ：0 = A&nbsp;&nbsp;&nbsp;&nbsp; 1 ：0 = B &nbsp;&nbsp;&nbsp;&nbsp; 0 ：1 = C  &nbsp;&nbsp;&nbsp;&nbsp; 1 ：1 = D</th>
                </tr>
                <tr>
                    <th>A-A</th>
                    <th>B-B</th>
                    <th>C-C</th>
                    <th style="width:14%" colspan="3">A-B</th>
                    <th style="width:14%" colspan="3">B-C</th>
                    <th style="width:14%" colspan="3">A-C</th>
                    <th style="width:14%" colspan="3">A-{{$t('statistical.benchmark')}}</th>
                    <th style="width:14%" colspan="3">B-{{$t('statistical.benchmark')}}</th>
                    <th style="width:14%" colspan="3">C-{{$t('statistical.benchmark')}}</th>
                </tr>
                <tr style="text-align:center" v-for="(item,index) in this.totalData">
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][0]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][1]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][2]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][3]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][4]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][5]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][6]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][7]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][8]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][9]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][10]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][11]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][12]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][13]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][14]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][15]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][16]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][17]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][18]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][19]}}</div></td>
                    <td><div v-if="ruleForm.analysisDataResultList.length!=0">{{ruleForm.analysisDataResultList[index][20]}}</div></td>
                </tr>
            </table>
        </div>
        <div style="clear:both"></div>
        <div style="margin-bottom:100px">
            <div class="iqis-page-block-title" style="margin-top:20px;margin-bottom:10px">
                Kappa{{$t('statistical.crosstab')}}
            </div>
            <table border="1" style="width:49%;float:left;border-collapse:collapse;margin-bottom:10px;border:1px solid #dddee1;" class="padding10 padding5 center">
                <tr>
                    <th colspan="3" rowspan="2">A-B{{$t('statistical.crosstab')}}</th>
                    <th style="width:28%" colspan="2">B</th>
                    <th style="width:14%" rowspan="2">{{$t('statistical.combined')}}</th>
                </tr>
                <tr>
                    <th style="width:14%">0</th>
                    <th style="width:14%">1</th>
                </tr>
                <tr>
                    <th style="width:14%" rowspan="4">A</th>
                    <th style="width:14%" rowspan="2">0</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{aBCrosstabList[0][0]}}</td>
                    <td>{{aBCrosstabList[0][1]}}</td>
                    <td>{{aBCrosstabList[0][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{aBCrosstabList[1][0]}}</td>
                    <td>{{aBCrosstabList[1][1]}}</td>
                    <td>{{aBCrosstabList[1][2]}}</td>
                </tr>
                <tr>
                    <th rowspan="2">1</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{aBCrosstabList[2][0]}}</td>
                    <td>{{aBCrosstabList[2][1]}}</td>
                    <td>{{aBCrosstabList[2][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{aBCrosstabList[3][0]}}</td>
                    <td>{{aBCrosstabList[3][1]}}</td>
                    <td>{{aBCrosstabList[3][2]}}</td>
                </tr>
                <tr>
                    <th rowspan="2" colspan="2">{{$t('statistical.combined')}}</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{aBCrosstabList[4][0]}}</td>
                    <td>{{aBCrosstabList[4][1]}}</td>
                    <td>{{aBCrosstabList[4][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{aBCrosstabList[5][0]}}</td>
                    <td>{{aBCrosstabList[5][1]}}</td>
                    <td>{{aBCrosstabList[5][2]}}</td>
                </tr>
            </table>
            <table border="1" style="width:49%;float:right;border-collapse:collapse;margin-bottom:10px;border:1px solid #dddee1;" class="padding10 padding5 center">
                <tr>
                    <th colspan="3" rowspan="2">【A-{{$t('statistical.reference')}}】{{$t('statistical.crosstab')}}</th>
                    <th style="width:28%" colspan="2">{{$t('statistical.benchmark')}}</th>
                    <th style="width:14%" rowspan="2">{{$t('statistical.combined')}}</th>
                </tr>
                <tr>
                    <th style="width:14%">0</th>
                    <th style="width:14%">1</th>
                </tr>
                <tr>
                    <th style="width:14%" rowspan="4">A</th>
                    <th style="width:14%" rowspan="2">0</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{aStandardCrosstabList[0][0]}}</td>
                    <td>{{aStandardCrosstabList[0][1]}}</td>
                    <td>{{aStandardCrosstabList[0][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{aStandardCrosstabList[1][0]}}</td>
                    <td>{{aStandardCrosstabList[1][1]}}</td>
                    <td>{{aStandardCrosstabList[1][2]}}</td>
                </tr>
                <tr>
                    <th rowspan="2">1</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{aStandardCrosstabList[2][0]}}</td>
                    <td>{{aStandardCrosstabList[2][1]}}</td>
                    <td>{{aStandardCrosstabList[2][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{aStandardCrosstabList[3][0]}}</td>
                    <td>{{aStandardCrosstabList[3][1]}}</td>
                    <td>{{aStandardCrosstabList[3][2]}}</td>
                </tr>
                <tr>
                    <th rowspan="2" colspan="2">{{$t('statistical.combined')}}</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{aStandardCrosstabList[4][0]}}</td>
                    <td>{{aStandardCrosstabList[4][1]}}</td>
                    <td>{{aStandardCrosstabList[4][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{aStandardCrosstabList[5][0]}}</td>
                    <td>{{aStandardCrosstabList[5][1]}}</td>
                    <td>{{aStandardCrosstabList[5][2]}}</td>
                </tr>
            </table>
            <div style="clear:both"></div>
            <table border="1" style="width:49%;float:left;border-collapse:collapse;margin-bottom:10px;border:1px solid #dddee1;" class="padding10 padding5 center">
                <tr>
                    <th colspan="3" rowspan="2">B-C{{$t('statistical.crosstab')}}</th>
                    <th style="width:28%" colspan="2">C</th>
                    <th style="width:14%" rowspan="2">{{$t('statistical.combined')}}</th>
                </tr>
                <tr>
                    <th style="width:14%">0</th>
                    <th style="width:14%">1</th>
                </tr>
                <tr>
                    <th style="width:14%" rowspan="4">B</th>
                    <th style="width:14%" rowspan="2">0</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{bCCrosstabList[0][0]}}</td>
                    <td>{{bCCrosstabList[0][1]}}</td>
                    <td>{{bCCrosstabList[0][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{bCCrosstabList[1][0]}}</td>
                    <td>{{bCCrosstabList[1][1]}}</td>
                    <td>{{bCCrosstabList[1][2]}}</td>
                </tr>
                <tr>
                    <th rowspan="2">1</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{bCCrosstabList[2][0]}}</td>
                    <td>{{bCCrosstabList[2][1]}}</td>
                    <td>{{bCCrosstabList[2][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{bCCrosstabList[3][0]}}</td>
                    <td>{{bCCrosstabList[3][1]}}</td>
                    <td>{{bCCrosstabList[3][2]}}</td>
                </tr>
                <tr>
                    <th rowspan="2" colspan="2">{{$t('statistical.combined')}}</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{bCCrosstabList[4][0]}}</td>
                    <td>{{bCCrosstabList[4][1]}}</td>
                    <td>{{bCCrosstabList[4][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{bCCrosstabList[5][0]}}</td>
                    <td>{{bCCrosstabList[5][1]}}</td>
                    <td>{{bCCrosstabList[5][2]}}</td>
                </tr>
            </table>
            <table border="1" style="width:49%;float:right;border-collapse:collapse;margin-bottom:10px;border:1px solid #dddee1;" class="padding10 padding5 center">
                <tr>
                    <th colspan="3" rowspan="2">【B-{{$t('statistical.reference')}}】{{$t('statistical.crosstab')}}</th>
                    <th style="width:28%" colspan="2">{{$t('statistical.benchmark')}}</th>
                    <th style="width:14%" rowspan="2">{{$t('statistical.combined')}}</th>
                </tr>
                <tr>
                    <th style="width:14%">0</th>
                    <th style="width:14%">1</th>
                </tr>
                <tr>
                    <th style="width:14%" rowspan="4">B</th>
                    <th style="width:14%" rowspan="2">0</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{bStandardCrosstabList[0][0]}}</td>
                    <td>{{bStandardCrosstabList[0][1]}}</td>
                    <td>{{bStandardCrosstabList[0][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{bStandardCrosstabList[1][0]}}</td>
                    <td>{{bStandardCrosstabList[1][1]}}</td>
                    <td>{{bStandardCrosstabList[1][2]}}</td>
                </tr>
                <tr>
                    <th rowspan="2">1</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{bStandardCrosstabList[2][0]}}</td>
                    <td>{{bStandardCrosstabList[2][1]}}</td>
                    <td>{{bStandardCrosstabList[2][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{bStandardCrosstabList[3][0]}}</td>
                    <td>{{bStandardCrosstabList[3][1]}}</td>
                    <td>{{bStandardCrosstabList[3][2]}}</td>
                </tr>
                <tr>
                    <th rowspan="2" colspan="2">{{$t('statistical.combined')}}</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{bStandardCrosstabList[4][0]}}</td>
                    <td>{{bStandardCrosstabList[4][1]}}</td>
                    <td>{{bStandardCrosstabList[4][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{bStandardCrosstabList[5][0]}}</td>
                    <td>{{bStandardCrosstabList[5][1]}}</td>
                    <td>{{bStandardCrosstabList[5][2]}}</td>
                </tr>
            </table>
            <div style="clear:both"></div>
            <table border="1" style="width:49%;float:left;border-collapse:collapse;margin-bottom:10px;border:1px solid #dddee1;" class="padding10 padding5 center">
                <tr>
                    <th colspan="3" rowspan="2">A-C{{$t('statistical.crosstab')}}</th>
                    <th style="width:28%" colspan="2">A</th>
                    <th style="width:14%" rowspan="2">{{$t('statistical.combined')}}</th>
                </tr>
                <tr>
                    <th style="width:14%">0</th>
                    <th style="width:14%">1</th>
                </tr>
                <tr>
                    <th style="width:14%" rowspan="4">C</th>
                    <th style="width:14%" rowspan="2">0</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{aCCrosstabList[0][0]}}</td>
                    <td>{{aCCrosstabList[0][1]}}</td>
                    <td>{{aCCrosstabList[0][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{aCCrosstabList[1][0]}}</td>
                    <td>{{aCCrosstabList[1][1]}}</td>
                    <td>{{aCCrosstabList[1][2]}}</td>
                </tr>
                <tr>
                    <th rowspan="2">1</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{aCCrosstabList[2][0]}}</td>
                    <td>{{aCCrosstabList[2][1]}}</td>
                    <td>{{aCCrosstabList[2][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{aCCrosstabList[3][0]}}</td>
                    <td>{{aCCrosstabList[3][1]}}</td>
                    <td>{{aCCrosstabList[3][2]}}</td>
                </tr>
                <tr>
                    <th rowspan="2" colspan="2">{{$t('statistical.combined')}}</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{aCCrosstabList[4][0]}}</td>
                    <td>{{aCCrosstabList[4][1]}}</td>
                    <td>{{aCCrosstabList[4][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{aCCrosstabList[5][0]}}</td>
                    <td>{{aCCrosstabList[5][1]}}</td>
                    <td>{{aCCrosstabList[5][2]}}</td>
                </tr>
            </table>
            <table border="1" style="width:49%;float:right;border-collapse:collapse;margin-bottom:10px;border:1px solid #dddee1;" class="padding10 padding5 center">
                <tr>
                    <th colspan="3" rowspan="2">【C-{{$t('statistical.reference')}}】{{$t('statistical.crosstab')}}</th>
                    <th style="width:28%" colspan="2">{{$t('statistical.benchmark')}}</th>
                    <th style="width:14%" rowspan="2">{{$t('statistical.combined')}}</th>
                </tr>
                <tr>
                    <th style="width:14%">0</th>
                    <th style="width:14%">1</th>
                </tr>
                <tr>
                    <th style="width:14%" rowspan="4">C</th>
                    <th style="width:14%" rowspan="2">0</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{cStandardCrosstabList[0][0]}}</td>
                    <td>{{cStandardCrosstabList[0][1]}}</td>
                    <td>{{cStandardCrosstabList[0][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{cStandardCrosstabList[1][0]}}</td>
                    <td>{{cStandardCrosstabList[1][1]}}</td>
                    <td>{{cStandardCrosstabList[1][2]}}</td>
                </tr>
                <tr>
                    <th rowspan="2">1</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{cStandardCrosstabList[2][0]}}</td>
                    <td>{{cStandardCrosstabList[2][1]}}</td>
                    <td>{{cStandardCrosstabList[2][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{cStandardCrosstabList[3][0]}}</td>
                    <td>{{cStandardCrosstabList[3][1]}}</td>
                    <td>{{cStandardCrosstabList[3][2]}}</td>
                </tr>
                <tr>
                    <th rowspan="2" colspan="2">{{$t('statistical.combined')}}</th>
                    <th>{{$t('statistical.calculate')}}</th>
                    <td>{{cStandardCrosstabList[4][0]}}</td>
                    <td>{{cStandardCrosstabList[4][1]}}</td>
                    <td>{{cStandardCrosstabList[4][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.expectCalculate')}}</th>
                    <td>{{cStandardCrosstabList[5][0]}}</td>
                    <td>{{cStandardCrosstabList[5][1]}}</td>
                    <td>{{cStandardCrosstabList[5][2]}}</td>
                </tr>
            </table>
            <div style="clear:both"></div>
            <table border="1" style="width:49%;float:left;border-collapse:collapse;margin-bottom:10px;border:1px solid #dddee1;" class="padding10 padding5 center">
                <tr>
                    <th colspan="10">{{$t('statistical.dataStatistics')}}</th>
                </tr>
                <tr>
                    <th style="width:10%">--</th>
                    <th style="width:10%">A-B</th>
                    <th style="width:10%">B-C</th>
                    <th style="width:10%">A-C</th>
                    <th style="width:10%">A-{{$t('statistical.benchmark')}}</th>
                    <th style="width:10%">B-{{$t('statistical.benchmark')}}</th>
                    <th style="width:10%">C-{{$t('statistical.benchmark')}}</th>
                    <th style="width:10%">A-A</th>
                    <th style="width:10%">B-B</th>
                    <th style="width:10%">C-C</th>
                </tr>
                <tr>
                    <th>0 ：0</th>
                    <td>{{dataStatisticsList[0][0]}}</td>
                    <td>{{dataStatisticsList[0][1]}}</td>
                    <td>{{dataStatisticsList[0][2]}}</td>
                    <td>{{dataStatisticsList[0][3]}}</td>
                    <td>{{dataStatisticsList[0][4]}}</td>
                    <td>{{dataStatisticsList[0][5]}}</td>
                    <td>{{dataStatisticsList[0][6]}}</td>
                    <td>{{dataStatisticsList[0][7]}}</td>
                    <td>{{dataStatisticsList[0][8]}}</td>
                </tr>
                <tr>
                    <th>1 ：0</th>
                    <td>{{dataStatisticsList[1][0]}}</td>
                    <td>{{dataStatisticsList[1][1]}}</td>
                    <td>{{dataStatisticsList[1][2]}}</td>
                    <td>{{dataStatisticsList[1][3]}}</td>
                    <td>{{dataStatisticsList[1][4]}}</td>
                    <td>{{dataStatisticsList[1][5]}}</td>
                </tr>
                <tr>
                    <th>0 ：1</th>
                    <td>{{dataStatisticsList[2][0]}}</td>
                    <td>{{dataStatisticsList[2][1]}}</td>
                    <td>{{dataStatisticsList[2][2]}}</td>
                    <td>{{dataStatisticsList[2][3]}}</td>
                    <td>{{dataStatisticsList[2][4]}}</td>
                    <td>{{dataStatisticsList[2][5]}}</td>
                </tr>
                <tr>
                    <th>1 ：1</th>
                    <td>{{dataStatisticsList[3][0]}}</td>
                    <td>{{dataStatisticsList[3][1]}}</td>
                    <td>{{dataStatisticsList[3][2]}}</td>
                    <td>{{dataStatisticsList[3][3]}}</td>
                    <td>{{dataStatisticsList[3][4]}}</td>
                    <td>{{dataStatisticsList[3][5]}}</td>
                </tr>
            </table>
            <table border="1" style="width:49%;float:right;border-collapse:collapse;height:150px;border:1px solid #dddee1;" class="padding10 padding5 center">
                <tr>
                    <th colspan="10">Kappa {{$t('statistical.count')}}</th>
                </tr>
                <tr>
                    <th>--</th>
                    <th style="width:14%">A-B</th>
                    <th style="width:14%">B-C</th>
                    <th style="width:14%">A-C</th>
                    <th style="width:14%">A-{{$t('statistical.benchmark')}}</th>
                    <th style="width:14%">B-{{$t('statistical.benchmark')}}</th>
                    <th style="width:14%">C-{{$t('statistical.benchmark')}}</th>
                </tr>
                <tr>
                    <th>Kappa</th>
                    <td>{{kappaValueList[0][0]}}</td>
                    <td>{{kappaValueList[0][1]}}</td>
                    <td>{{kappaValueList[0][2]}}</td>
                    <td>{{kappaValueList[0][3]}}</td>
                    <td>{{kappaValueList[0][4]}}</td>
                    <td>{{kappaValueList[0][5]}}</td>
                </tr>
                <tr>
                    <th >{{$t('statistical.determine')}}</th>
                    <td v-if="kappaValueList[1][0]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="kappaValueList[1][0]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="kappaValueList[1][0]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                    <td v-if="kappaValueList[1][1]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="kappaValueList[1][1]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="kappaValueList[1][1]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                    <td v-if="kappaValueList[1][2]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="kappaValueList[1][2]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="kappaValueList[1][2]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                    <td v-if="kappaValueList[1][3]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="kappaValueList[1][3]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="kappaValueList[1][3]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                    <td v-if="kappaValueList[1][4]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="kappaValueList[1][4]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="kappaValueList[1][4]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                    <td v-if="kappaValueList[1][5]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="kappaValueList[1][5]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="kappaValueList[1][5]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                </tr>
            </table>
            <div style="clear:both"></div>
            <table border="1" style="width:49%;float:left;border-collapse:collapse;margin-bottom:10px;border:1px solid #dddee1;" class="padding10 padding5 center">
                <tr>
                    <th>--</th>
                    <th colspan="3">{{$t('statistical.selfAssessment')}}</th>
                    <th colspan="3">{{$t('statistical.comparing')}}</th>
                </tr>
                <tr>
                    <th>{{$t('statistical.evaluation')}}</th>
                    <th style="width:14%">A</th>
                    <th style="width:14%">B</th>
                    <th style="width:14%">C</th>
                    <th style="width:14%">A</th>
                    <th style="width:14%">B</th>
                    <th style="width:14%">C</th>
                </tr>
                <tr>
                    <th>{{$t('statistical.inspectionNum')}}</th>
                    <td>{{selfEvaluationList[0][0]}}</td>
                    <td>{{selfEvaluationList[0][1]}}</td>
                    <td>{{selfEvaluationList[0][2]}}</td>
                    <td>{{selfEvaluationList[0][3]}}</td>
                    <td>{{selfEvaluationList[0][4]}}</td>
                    <td>{{selfEvaluationList[0][5]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.match')}}</th>
                    <td>{{selfEvaluationList[1][0]}}</td>
                    <td>{{selfEvaluationList[1][1]}}</td>
                    <td>{{selfEvaluationList[1][2]}}</td>
                    <td>{{selfEvaluationList[1][3]}}</td>
                    <td>{{selfEvaluationList[1][4]}}</td>
                    <td>{{selfEvaluationList[1][5]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.wrongRejectNumber')}}</th>
                    <th>--</th>
                    <th>--</th>
                    <th>--</th>
                    <td>{{selfEvaluationList[2][0]}}</td>
                    <td>{{selfEvaluationList[2][1]}}</td>
                    <td>{{selfEvaluationList[2][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.errorAcceptanceNumber')}}</th>
                    <th>--</th>
                    <th>--</th>
                    <th>--</th>
                    <td>{{selfEvaluationList[3][0]}}</td>
                    <td>{{selfEvaluationList[3][1]}}</td>
                    <td>{{selfEvaluationList[3][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.noMatch')}}</th>
                    <th>--</th>
                    <th>--</th>
                    <th>--</th>
                    <td>{{selfEvaluationList[4][0]}}</td>
                    <td>{{selfEvaluationList[4][1]}}</td>
                    <td>{{selfEvaluationList[4][2]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.validityResult')}}</th>
                    <td>{{selfEvaluationList[5][0]}}</td>
                    <td>{{selfEvaluationList[5][1]}}</td>
                    <td>{{selfEvaluationList[5][2]}}</td>
                    <td>{{selfEvaluationList[5][3]}}</td>
                    <td>{{selfEvaluationList[5][4]}}</td>
                    <td>{{selfEvaluationList[5][5]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.determineResults')}}</th>
                    <td v-if="selfEvaluationList[6][0]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="selfEvaluationList[6][0]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="selfEvaluationList[6][0]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                    <td v-if="selfEvaluationList[6][1]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="selfEvaluationList[6][1]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="selfEvaluationList[6][1]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                    <td v-if="selfEvaluationList[6][2]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="selfEvaluationList[6][2]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="selfEvaluationList[6][2]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                    <td v-if="selfEvaluationList[6][3]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="selfEvaluationList[6][3]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="selfEvaluationList[6][3]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                    <td v-if="selfEvaluationList[6][4]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="selfEvaluationList[6][4]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="selfEvaluationList[6][4]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                    <td v-if="selfEvaluationList[6][5]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="selfEvaluationList[6][5]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="selfEvaluationList[6][5]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                </tr>
            </table>
            <table border="1" style="width:49%;float:right;border-collapse:collapse;border:1px solid #dddee1;" class="padding10 padding5 center">
                <tr>
                    <th>--</th>
                    <th style="width:33%">{{$t('statistical.rystemResults')}}</th>
                    <th style="width:33%">{{$t('statistical.compareWithBenchmarks')}}</th>
                </tr>
                <tr>
                    <th>{{$t('statistical.totalExperience')}}</th>
                    <td>{{systemResultList[0][0]}}</td>
                    <td>{{systemResultList[0][1]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.sameNumber')}}</th>
                    <td>{{systemResultList[1][0]}}</td>
                    <td>{{systemResultList[1][1]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.calculationResults')}}</th>
                    <td>{{systemResultList[2][0]}}</td>
                    <td>{{systemResultList[2][1]}}</td>
                </tr>
                <tr>
                    <th>{{$t('statistical.determineResults')}}</th>
                    <td v-if="systemResultList[3][0]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="systemResultList[3][0]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="systemResultList[3][0]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                    <td v-if="systemResultList[3][1]==0">{{$t('statistical.good')}}</td>
                    <td v-else-if="systemResultList[3][1]==1">{{$t('statistical.general')}}</td>
                    <td v-else-if="systemResultList[3][1]==2">{{$t('statistical.poor')}}</td>
                    <td v-else></td>
                </tr>
            </table>
            <div style="clear:both"></div>
            <table border="1" style="width:49%;float:left;border-collapse:collapse;margin-bottom:10px;border:1px solid #dddee1;" class="padding10 padding5">
                <tr>
                    <th colspan="5">{{$t('statistical.conclusion')}}</th>
                </tr>
                <tr>
                    <th style="width:20%">--</th>
                    <th style="width:20%">{{$t('statistical.validity')}}</th>
                    <th style="width:20%">{{$t('statistical.alarmFailureRate')}}</th>
                    <th style="width:20%">{{$t('statistical.alarmFalseRate')}}</th>
                    <th style="width:20%">{{$t('statistical.determine')}}</th>
                </tr>
                <tr style="text-align:center">
                    <th>A</th>
                    <td>{{inspectionResultList[0][0]}}</td>
                    <td>{{inspectionResultList[0][1]}}</td>
                    <td>{{inspectionResultList[0][2]}}</td>
                    <td v-if="inspectionResultList[0][3]==0">{{$t('statistical.accept2')}}</td>
                    <td v-else-if="inspectionResultList[0][3]==1">{{$t('statistical.reluctantlyAccepted')}}</td>
                    <td v-else-if="inspectionResultList[0][3]==2">{{$t('statistical.notAccept')}}</td>
                    <td v-else></td>
                </tr>
                <tr style="text-align:center">
                    <th>B</th>
                    <td>{{inspectionResultList[1][0]}}</td>
                    <td>{{inspectionResultList[1][1]}}</td>
                    <td>{{inspectionResultList[1][2]}}</td>
                    <td v-if="inspectionResultList[1][3]==0">{{$t('statistical.accept2')}}</td>
                    <td v-else-if="inspectionResultList[1][3]==1">{{$t('statistical.reluctantlyAccepted')}}</td>
                    <td v-else-if="inspectionResultList[1][3]==2">{{$t('statistical.notAccept')}}</td>
                    <td v-else></td>
                </tr>
                <tr style="text-align:center" >
                    <th>C</th>
                    <td>{{inspectionResultList[2][0]}}</td>
                    <td>{{inspectionResultList[2][1]}}</td>
                    <td>{{inspectionResultList[2][2]}}</td>
                    <td v-if="inspectionResultList[2][3]==0">{{$t('statistical.accept2')}}</td>
                    <td v-else-if="inspectionResultList[2][3]==1">{{$t('statistical.reluctantlyAccepted')}}</td>
                    <td v-else-if="inspectionResultList[2][3]==2">{{$t('statistical.notAccept')}}</td>
                    <td v-else></td>
                </tr>
            </table>
            <table  border="1" style="width:49%;float:right;border-collapse:collapse;border:1px solid #dddee1;" class="padding10 padding5">
                <tr>
                    <th colspan="4">{{$t('statistical.basis')}}</th>
                </tr>
                <tr style="text-align:center">
                    <th>--</th>
                    <th style="width:23%">{{$t('statistical.validity')}}</th>
                    <th style="width:23%">{{$t('statistical.alarmFailureRate')}}</th>
                    <th style="width:23%">{{$t('statistical.alarmFalseRate')}}</th>
                </tr>
                <tr style="text-align:center">
                    <th>{{$t('statistical.acceptable')}}</th>
                    <th>≥90%</th>
                    <th>≤ 2%</th>
                    <th>≤ 5%</th>
                </tr>
                <tr style="text-align:center">
                    <th>{{$t('statistical.edge')}}</th>
                    <th>≥80%</th>
                    <th>≤5%</th>
                    <th>≤ 10%</th>
                </tr>
                <tr style="text-align:center">
                    <th>{{$t('statistical.notAcceptable')}}</th>
                    <th>＜80%</th>
                    <th>＞ 5%</th>
                    <th>＞ 10%</th>
                </tr>
            </table>
            <div style="clear:both"></div>
        </div>
        <IqisAffix placement="bottom" :offset="0">
        <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
            <Button type="primary" @click="confirm">{{$t('iqc.save')}}</Button>
            <Button type="ghost" @click="closePage">{{$t('iqc.cancel')}}</Button>
        </div>
        </IqisAffix>
    </div>
</template>

<script>
import $ from 'jquery';
export default {
    props:["params","tabKey"],
    data() {
        return{
            i18n:window.i18n,
            headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
            inputDisbale:true,//置灰
            totalData:"",//分析数据的数组 list
            loadingRemote:false,
            productSimple:[],//产品编号的 list
            inspectorList:[],
            aBCrosstabList:[[],[],[],[],[],[]],
            aCCrosstabList:[[],[],[],[],[],[]],
            bCCrosstabList:[[],[],[],[],[],[]],
            aStandardCrosstabList:[[],[],[],[],[],[]],
            bStandardCrosstabList:[[],[],[],[],[],[]],
            cStandardCrosstabList:[[],[],[],[],[],[]],
            systemResultList:[[],[],[],[]],
            inspectionResultList:[[],[],[]],
            selfEvaluationList:[[],[],[],[],[],[],[]],
            kappaValueList:[[],[]],
            dataStatisticsList:[[],[],[],[]],
            inspectionTypeList:[],
            chkDevList:[],
            people1Id:[],
            people2Id:[],
            people3Id:[],
            source:null,
            kappaId:"",
            sub:3,
            sub1:false,
            sub2:"",
            A:"",
            B:"#",
            C:"#",
            department:[],//部门的 list
            ruleForm:{
                analysisTime: new Date(),//分析时间
                analysisUserId:"",
                analysisUserName:"",
                inpsectionTypeName:"",
                departmentName:"",
                reviewer1Name:"",
                reviewer2Name:"",
                reviewer3Name:"",
                chkDevNo:"",
                productId:"",
                productNo:"",//产品编号
                productName:"",//产品名称
                productSpec:"",//规格型号
                no:"",//分析单号
                productNum:"",//产品数量
                departmentId:"",//分析部门
                measureNum:3,//测量次数
                causeAnalysis:"",
                reviewer1Id:"",//评价人A
                reviewer2Id:"",//评价人B
                reviewer3Id:"",//评价人C
                prodExamType:1,
                inspectionTypeId:"",//检验项目
                chkDevId:"",//设备编号
                chkDevName:"",//设备名称
                analysisDataList:[
                    // ['1','1','1','1','1','1','1','+']
                ],
                analysisDataResultList:[]
            },
        }
    },
    created() {
        let that = this
        this.$http.get('/systemManage/allDepartment').then(resp=>{//调部门的接口
            that.department=resp.data
        })
        this.$http.get("/tenant/user",{params:{limit:999999999}}).then(resp=>{//调人员的接口
            that.inspectorList = resp.data
        })
        this.$http.get('/tenant/user/profile').then(function(resp){//调当前人员的接口
          that.ruleForm.analysisUserId=resp.data.userId;
          that.sub2=resp.data.userId;
          that.ruleForm.reviewer1Id=resp.data.userId;
          that.A=resp.data.name+"-A"
          that.people1Id.push(resp.data.userId)
          that.refreshData()
        })
    },
    methods:{
        _ProductQuantity(val) {//根据val值渲染分析数据的条数
            this.totalData=Number(val)
            for(let i=0;i<val;i++) {
                let arr=[]
                if(this.sub==2) {
                    arr.push("","","","","","","",)
                }
                if(this.sub==3) {
                    arr.push("","","","","","","","","","",)
                }
                this.ruleForm.analysisDataList.push(arr)
            }
        },
        remoteMethod: _.debounce(function(query) {//根据搜索字段查询
            let that = this;
            that.loadingRemote = true;

            if (query !== '') {
                that.cancelQuest();
                that.$nextTick(()=>{
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
        cancelQuest(){//这个函数什么用
            if(typeof this.source ==='function'){
            this.source('终止请求'); 
            }
        },
        changeProductId(val) {//根据id拿到产品名称和型号
            let that = this
            // that.ruleForm.inspectionTypeId=""
            // that.ruleForm.chkDevId=""
            // that.ruleForm.chkDevName=""
            let url = "/basic/product/detail/"
            if(val) {
                let res = that.$iqis.utils.syncget(url+val);
                that.ruleForm.productSpec=res.data.spec
                that.ruleForm.productName=res.data.name
                if(that.ruleForm.prodExamType==1) {
                    that.inspectionTypeList=res.data.settings.qc.iqc.params
                }else if(that.ruleForm.prodExamType==2) {
                    that.inspectionTypeList=res.data.settings.qc.pqc.params
                }else{
                    that.inspectionTypeList=res.data.settings.qc.oqc.params
                }
            }
        },
        update() {//刷新数据
            let a=new Date().getSeconds()
            let b=this.ruleForm.causeAnalysis
            this.ruleForm.causeAnalysis=a
            this.ruleForm.causeAnalysis=b
        },
        calculate(index) {
            // let inputVal = document.getElementById(index+val).value
            let arr = []
            if(this.sub==2) {
                for(let i=0;i<this.ruleForm.analysisDataList[index].length;i++) {
                    if(this.ruleForm.analysisDataList[index][i]=="") {
                        return;
                    }
                    if(this.ruleForm.analysisDataList[index][i]!="") {
                        arr.push(this.ruleForm.analysisDataList[index][i])
                        if(arr.length==7&&arr.indexOf('0')==-1) {
                            this.ruleForm.analysisDataList[index][7]="+"
                            this.update()
                        }
                        if(arr.length==7&&arr.indexOf('1')==-1) {
                            this.ruleForm.analysisDataList[index][7]="-"
                            this.update()
                        }
                        if(arr.length==7&&arr.indexOf('1')!=-1&&arr.indexOf('0')!=-1) {
                            this.ruleForm.analysisDataList[index][7]="*"
                            this.update()
                        }
                    }
                }
            }
            if(this.sub==3) {
                for(let i=0;i<this.ruleForm.analysisDataList[index].length;i++) {
                    if(this.ruleForm.analysisDataList[index][i]=="") {
                        return;
                    }
                    if(this.ruleForm.analysisDataList[index][i]!="") {
                        arr.push(this.ruleForm.analysisDataList[index][i])
                        if(arr.length==10&&arr.indexOf('0')==-1) {
                            this.ruleForm.analysisDataList[index][10]="+"
                            this.update()
                        }
                        if(arr.length==10&&arr.indexOf('1')==-1) {
                            this.ruleForm.analysisDataList[index][10]="-"
                            this.update()
                        }
                        if(arr.length==10&&arr.indexOf('1')!=-1&&arr.indexOf('0')!=-1) {
                            this.ruleForm.analysisDataList[index][10]="*"
                            this.update()
                        }
                    }
                }
            }
        },
        getName(val,num) {//根据所选的评价人 将评价人绑定到分析数据的表头
            for(let i in this.inspectorList) {
                let j=this.inspectorList[i]
                if(num==0&&val==j.userId) {
                    this.B=j.name+"-B"
                    if(this.people2Id.length!=0) {
                        this.people2Id=[]
                        this.people2Id.push(val)
                    }else{
                        this.people2Id.push(val)
                    }
                }
                if(num==1&&val==j.userId) {
                    this.C=j.name+"-C"
                    if(this.people3Id.length!=0) {
                        this.people3Id=[]
                        this.people3Id.push(val)
                    }else{
                        this.people3Id.push(val)
                    }
                }
                if(num==2&&val==j.userId) {
                    this.A=j.name+"-A"
                    if(this.people1Id.length!=0) {
                        this.people1Id=[]
                        this.people1Id.push(val)
                    }else{
                        this.people1Id.push(val)
                    }
                }
            }
        },
        refreshData() {
            let that = this;
            that.kappaId = that.$props.params && that.$props.params.kappaId;
            if(that.kappaId) {
                that.$http.get('/kappa/'+that.kappaId).then((res)=>{
                    that.sub1=true;
                    that._ProductQuantity(res.data.productNum);
                    that.people1Id=[]
                    that.people1Id.push(res.data.reviewer1Id)
                    that.people2Id.push(res.data.reviewer2Id)
                    that.people3Id.push(res.data.reviewer3Id)
                    that.ruleForm.analysisUserName=res.data.analysisUserName;
                    that.ruleForm.inpsectionTypeName=res.data.inpsectionTypeName;
                    that.ruleForm.departmentName=res.data.departmentName;
                    that.ruleForm.reviewer1Name=res.data.reviewer1Name;
                    that.ruleForm.reviewer2Name=res.data.reviewer2Name;
                    that.ruleForm.reviewer3Name=res.data.reviewer3Name;
                    that.ruleForm.chkDevNo=res.data.chkDevNo;
                    that.ruleForm.analysisTime=new Date(res.data.analysisTime);
                    that.ruleForm.no=res.data.no;
                    that.ruleForm.productId=res.data.productId;
                    that.ruleForm.productNo=res.data.productNo;
                    that.ruleForm.productName=res.data.productName;
                    that.ruleForm.productSpec=res.data.productSpec;
                    that.ruleForm.inspectionTypeId=res.data.inspectionTypeId;
                    that.ruleForm.chkDevId=res.data.chkDevId;
                    that.ruleForm.chkDevName=res.data.chkDevName;
                    that.ruleForm.departmentId=res.data.departmentId;
                    that.ruleForm.measureNum=res.data.measureNum;
                    that.ruleForm.productNum=res.data.productNum;
                    that.ruleForm.analysisUserId=res.data.analysisUserId;
                    that.A=res.data.reviewer1Name+"-A"
                    that.ruleForm.reviewer1Id=res.data.reviewer1Id;
                    that.B=res.data.reviewer2Name+"-B"
                    that.ruleForm.reviewer2Id=res.data.reviewer2Id;
                    that.C=res.data.reviewer3Name+"-C"
                    that.ruleForm.reviewer3Id=res.data.reviewer3Id;
                    that.ruleForm.causeAnalysis=res.data.causeAnalysis;
                    that.ruleForm.prodExamType=res.data.prodExamType;
                    // that.ruleForm.analysisData=res.data.analysisData[0];
                    if(res.data.kappaDetailDto) {//传给后台的数据不全时 接口不会返回kappaDetailDto
                        that.aBCrosstabList=res.data.kappaDetailDto.aBCrosstabList;
                        that.aCCrosstabList=res.data.kappaDetailDto.aCCrosstabList;
                        that.bCCrosstabList=res.data.kappaDetailDto.bCCrosstabList;
                        that.aStandardCrosstabList=res.data.kappaDetailDto.aStandardCrosstabList;
                        that.bStandardCrosstabList=res.data.kappaDetailDto.bStandardCrosstabList;
                        that.cStandardCrosstabList=res.data.kappaDetailDto.cStandardCrosstabList;
                        that.systemResultList=res.data.kappaDetailDto.systemResultList;
                        that.inspectionResultList=res.data.kappaDetailDto.inspectionResultList;
                        that.selfEvaluationList=res.data.kappaDetailDto.selfEvaluationList;
                        that.kappaValueList=res.data.kappaDetailDto.kappaValueList;
                        that.dataStatisticsList=res.data.kappaDetailDto.dataStatisticsList;
                    }
                    that.ruleForm.analysisDataResult=res.data.analysisDataResult;
                    if(!res.data.analysisDataResultList) {//传给后台的数据不全时 analysisDataResultList会返回null 但analysisDataResultList必须为数组(模板中设置了数组的length属性) 所以给个空数组
                        that.ruleForm.analysisDataResultList=[]
                    }else {
                        that.ruleForm.analysisDataResultList=res.data.analysisDataResultList
                    }
                    that.ruleForm.analysisDataList=res.data.analysisDataList
                })
                
            }
        },
        getId(val) {//评价人跟随分析人员
            this.ruleForm.reviewer1Id=val
            this.getName(val,2)
        },
        changeProdExamType() {//切换检验 调用
            this.ruleForm.productId=""
            this.ruleForm.productNo=""
            this.ruleForm.productName=""
            this.ruleForm.productSpec=""
            this.ruleForm.inspectionTypeId=""
            this.ruleForm.chkDevId=""
            this.ruleForm.chkDevName=""
        },
        changeInspectionTypeId(value) {//检验项目改变时调用
            let that =this
            if(value){
                let chkDevTypeIds = []
                for(let i in that.inspectionTypeList){
                    if(that.inspectionTypeList[i].inspectionTypeId==value){
                        chkDevTypeIds[0] = that.inspectionTypeList[i].chkDevTypeId.replace(/\,/g,'_')
                        break;
                    }
                }
                that.$http.get('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{page:1,limit:99999,useState:1}).then((res)=>{
                that.chkDevList = res.data[0]
                })
            }else{
                that.chkDevList = []
            }
        },
        changeChkDevId(value) {//设备编号改变时调用
            let that = this;
            if(value){
                that.$http.get('/basic/chkdev/'+value).then((res)=>{
                    that.ruleForm.chkDevName = res.data.name
                })
            }
        },
        _measurementNum(val) {
            if(val==2) {
                this.sub=2
            }
            if(val==3) {
                this.sub=3
            }
        },
        closePage() {
            this.$emit("close-tab", this.$props.tabKey);
        },
        confirm(){
            let that = this;
            if(!that.kappaId){
                this.$Modal.confirm({
                    title: i18n.t('statistical.tips'),
                    content: i18n.t('statistical.cannotModified'),
                    onOk: () => {
                        that.save()
                    },
                    onCancel: () => {
                        return;
                    }
                });
            }else{
                that.save()
            }
        },
        save() {
            let that = this;
            if(that.ruleForm.analysisDataList) {
                for(let i=0;i<that.ruleForm.analysisDataList.length;i++) {//遍历出0和1之外的
                    let j=that.ruleForm.analysisDataList[i]
                    for(let k=0;k<j.length-1;k++) {
                        if(j[k]!="0" && j[k]!="1" && j[k]!="") {
                            that.$Notice.warning({title:"第"+(i+1)+"行数据必须是0或1"})
                        return
                        }
                    }
                }
                for(let i=0;i<that.ruleForm.analysisDataList.length;i++) {//判断基准
                    let j=that.ruleForm.analysisDataList[i]
                    if(that.sub==2 && j[0]!="" && j[1]!="" && j[2]!="" && j[3]!="" && j[4]!=""&&j[5]!=""&&j[6]=="") {
                        that.$Notice.warning({title:"请输入第"+(i+1)+"行基准数"})
                        return
                    }
                    if(that.sub==3 && j[0]!="" && j[1]!="" && j[2]!="" && j[3]!="" && j[4]!=""&&j[5]!=""&& j[6]!="" && j[7]!="" && j[8]!="" && j[9]=="" ) {
                        that.$Notice.warning({title:"请输入第"+(i+1)+"行基准数"})
                        return
                    }
                }
            }
            let params = [
                {type:'Empty',title:i18n.t('statistical.analysisTime'),value:this.ruleForm.analysisTime},
                {type:'Empty',title:i18n.t('statistical.analyst'),value:this.ruleForm.analysisUserId},
                {type:'Empty',title:i18n.t('statistical.analysisNum'),value:this.ruleForm.no},
                {type:'Empty',title:i18n.t('statistical.pn'),value:this.ruleForm.productId},
                {type:'Empty',title:i18n.t('statistical.inspection'),value:this.ruleForm.inspectionTypeId},
                {type:'Empty',title:i18n.t('statistical.deviceCode'),value:this.ruleForm.chkDevId},
                {type:'Empty',title:i18n.t('statistical.department'),value:this.ruleForm.departmentId},
                {type:'Empty',title:i18n.t('statistical.numberOfMeasurement'),value:this.ruleForm.measureNum},
                {type:'Empty',title:i18n.t('statistical.ProdQuantity'),value:this.ruleForm.productNum},
                {type:'Empty',title:i18n.t('statistical.B'),value:this.ruleForm.reviewer2Id},
                {type:'Empty',title:i18n.t('statistical.C'),value:this.ruleForm.reviewer3Id},
            ]
            let state = true;
            for(let i in params){
                state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
                    that.$Notice.warning({title:tips})//,duration: 0
                })
                if(!state){
                    return;
                    break;
                }
            }
            if((that.people1Id[0]==that.people2Id[0]) || (that.people1Id[0]==that.people3Id[0]) || (that.people2Id[0]==that.people3Id[0])) {
                that.$Notice.warning({title:i18n.t('statistical.cannotRepeat')})
                return;
            }
            that.ruleForm.analysisTime=new Date(that.ruleForm.analysisTime).getTime()
            let paramsInfo=that.ruleForm
            if(that.kappaId) {
                that.ruleForm.kappaId=that.kappaId
                // that.$http.get('/kappa/'+that.kappaId).then((res)=>{
                //     let currentIndex = that.inspectorList.findIndex((val,index,arr)=>{
                //         return val.userId==that.$store.state.currentUserId
                //     })
                //     let data = res.data.analysisDataList
                //     for(let i in data){
                //         let currentData = []
                //         if(that.sub==3) {
                //             if(currentIndex==0){
                //                 currentData[0]=that.ruleForm.analysisDataList[i][0]
                //                 currentData[1]=that.ruleForm.analysisDataList[i][1]
                //                 currentData[2]=that.ruleForm.analysisDataList[i][2]
                //                 currentData[9]=that.ruleForm.analysisDataList[i][9]
                //             }else if(currentIndex==1){
                //                 currentData[3]=that.ruleForm.analysisDataList[i][3]
                //                 currentData[4]=that.ruleForm.analysisDataList[i][4]
                //                 currentData[5]=that.ruleForm.analysisDataList[i][5]
                //                 currentData[9]=that.ruleForm.analysisDataList[i][9]
                //             }else{
                //                 currentData[6]=that.ruleForm.analysisDataList[i][6]
                //                 currentData[7]=that.ruleForm.analysisDataList[i][7]
                //                 currentData[8]=that.ruleForm.analysisDataList[i][8]
                //                 currentData[9]=that.ruleForm.analysisDataList[i][9]
                //             }
                //             that.ruleForm.analysisDataList[i] = Object.assign([],res.data.analysisDataList[i],currentData)
                //         }
                //         if(that.sub==2) {
                //             if(currentIndex==0){
                //                 currentData[0]=that.ruleForm.analysisDataList[i][0]
                //                 currentData[1]=that.ruleForm.analysisDataList[i][1]
                //                 currentData[6]=that.ruleForm.analysisDataList[i][6]
                //             }else if(currentIndex==1){
                //                 currentData[2]=that.ruleForm.analysisDataList[i][2]
                //                 currentData[3]=that.ruleForm.analysisDataList[i][3]
                //                 currentData[6]=that.ruleForm.analysisDataList[i][6]
                //             }else{
                //                 currentData[4]=that.ruleForm.analysisDataList[i][4]
                //                 currentData[5]=that.ruleForm.analysisDataList[i][5]
                //                 currentData[6]=that.ruleForm.analysisDataList[i][6]
                //             }
                //             that.ruleForm.analysisDataList[i] = Object.assign([],res.data.analysisDataList[i],currentData)
                //         }
                //     }
                    
                    that.$http.put('/kappa',paramsInfo,that.headers).then((res)=>{
                        that.$Message.success(i18n.t('statistical.ats'));
                        that.ruleForm.analysisTime=new Date(res.data.analysisTime)
                        that.closePage()
                        that.$emit("open-tab","crosstab-add-"+res.data.kappaId,i18n.t('statistical.edit')+"Kappa-"+res.data.productName,"page-statistic-crosstab-add",{kappaId:res.data.kappaId});
                        that.refreshData() 
                    })
                // })
            }else {
                that.$http.post('/kappa',paramsInfo,that.headers).then((res)=>{
                    that.$Message.success(i18n.t('iqc.saveSuccess'));
                    that.ruleForm.analysisTime=new Date(res.data.analysisTime) 
                    that.closePage()
                    that.$emit("open-tab","crosstab-add-"+res.data.kappaId,i18n.t('statistical.edit')+"Kappa-"+res.data.productName,"page-statistic-crosstab-add",{kappaId:res.data.kappaId});
                    that.refreshData()
                })
            }
            // this.closePage()
            // this.$emit("open-tab","page-statistic-crosstab-add","修改Kappa{{$t('statistical.crosstab')}}","page-statistic-crosstab-add",null);
        }
    }

}
</script>
<style>
  .padding10 th{
      padding:10px!important
  }
  .padding5 td{
      height: 40px;
  }
  .kappa th{
      background-color: #eee
  }
  .center{
      text-align: center
  }
  /* .kappa td{
      background-color:red
  } */
</style>


