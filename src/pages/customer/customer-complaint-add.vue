<template>
  <div class="iqis-page">

    <!-- 第一部分-基本资料 -->
    <div class="iqis-page-block" v-if="basic.isInternal==1">
      <div class="iqis-page-block-title">
        {{$t('customer.basicInfo')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25" style="margin-top:15px;">
          <i-col span="6">
            <div class="iqis-page-block-ctrl">
              <DatePicker :clearable='false' :disabled="basic.disabled||noPermsDis" v-model="basic.complaintDate" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <Checkbox class="isFatal" :disabled="basic.disabled||noPermsDis" v-model="basic.isFatalSelect" @on-change="basic.isFatal=basic.isFatalSelect?1:0">{{$t('customer.setMainAbn')}}</Checkbox>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.abnNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="basic.complaintNo" :placeholder="i18n.t('fileCenter.pe')" :disabled="basic.disabled||noPermsDis"></i-input>
            </div>
          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('customer.qcNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="basic.disabled||noPermsDis" v-model="basic.qcNo" :placeholder="i18n.t('fileCenter.pe')" style="width: 100%;"></i-input>
            </div>

          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('customer.productBatchNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="basic.disabled||noPermsDis" v-model="basic.batchNo" :placeholder="i18n.t('fileCenter.pe')" style="width: 100%;"></i-input>
            </div>

          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('customer.place')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="basic.disabled||noPermsDis" v-model="basic.complaintPlace" :placeholder="i18n.t('fileCenter.pe')" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">

          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('customer.productNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select  :label="basic.productNo" remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pleaseChoose')" :disabled="basic.disabled||noPermsDis" v-model="basic.productId" filterable @on-change="getProductData(basic.productId)">
                <Option v-for="data in productList" :key="data.productId" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('customer.productName')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.productName" :placeholder="i18n.t('fileCenter.pe')" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('customer.customer')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="basic.disabled||noPermsDis" v-model="basic.customerId" @on-change="getName(basic.customerId)" filterable>
                <Option v-for="data in customerList" :key="data.customerId" :value="data.customerId">{{data.customerAbbreviation}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('customer.supplier')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="basic.disabled||noPermsDis" v-model="basic.supplierId" filterable>
                <Option v-for="data in supplierList" :key="data.manufacturerId" :value="data.manufacturerId">{{data.manufacturerAbbreviation}}</Option>
              </Select>
            </div>

          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.il')}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <InputNumber :disabled="basic.disabled" v-model="basic.batchQuantity" placeholder="" style="width: 100%;" :min="0">
              </InputNumber> -->
              <i-input :disabled="basic.disabled||noPermsDis" v-model="basic.batchQuantity" placeholder="" style="width: 100%;">
                <span slot="append">{{basic.productUnitName}}</span>
              </i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.qcNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <InputNumber :disabled="basic.disabled" v-model="basic.inspectionQuantity" placeholder="" style="width: 100%;" :max="basic.batchQuantity" :min="0">
              </InputNumber> -->
              <i-input :disabled="basic.disabled||noPermsDis" v-model="basic.inspectionQuantity" placeholder="" style="width: 100%;">
                <span slot="append">{{basic.productUnitName}}</span>
              </i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.badNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <InputNumber :disabled="basic.disabled" v-model="basic.badQuantity" placeholder="" style="width: 100%;" :max="basic.inspectionQuantity" :min="0">
              </InputNumber> -->
              <i-input :disabled="basic.disabled||noPermsDis" v-model="basic.badQuantity" placeholder="" style="width: 100%;">
                <span slot="append">{{basic.productUnitName}}</span>
              </i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.badRate')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="badRate" placeholder="" style="width: 100%;">
                <span slot="append">%</span>
              </i-input>
            </div>
          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.treatmentMethod')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="basic.disabled||noPermsDis" v-model="basic.treatmentMethod" filterable>
                <Option v-for="(method,index) in treatmentMethods" :key="method.value" :value="method.value">{{method.label}}</Option>
                <!-- <Option v-for="method in treatmentMethods" :key="method.value" :value="method.value">{{method.label}}</Option> -->
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.treatmentLimit')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="basic.disabled||noPermsDis" v-model="basic.treatmentTimeLimit" filterable>
                <Option v-for="time in treatmentTimeLimits" :key="time" :value="time">{{time}}H</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="12">
            <div class="iqis-page-block-label">{{$t('customer.theme')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="basic.disabled||noPermsDis" v-model="basic.subject" placeholder="" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div>
    <div class="iqis-page-block" v-if="basic.isInternal==0">
      <div class="iqis-page-block-title">
        {{$t('customer.complaintBasic')}}
      </div>
      <div class="iqis-page-block-body basicList">
        <Row class="">
          <i-col span="6">
            <p>{{$t('customer.theme')}}：<span>{{basic.subject}}</span></p>
            <p>{{$t('customer.abnNo')}}：<span>{{basic.complaintNo}}</span></p>
            <p>{{$t('customer.productNo')}}：<span>{{basic.customerProductNo}}</span></p>
            <p>{{$t('customer.qcNum')}}：<span>{{basic.inspectionQuantity}}</span></p>
            <p>{{$t('customer.place')}}：<span>{{basic.complaintPlace}}</span></p>
          </i-col>
          <i-col span="6">
            <p>{{$t('customer.happenTime')}}：<span>{{new Date(basic.createTime).Format("yyyy-MM-dd hh:mm")}}</span></p>
            <p>{{$t('customer.qcNo')}}：<span>{{basic.qcNo}}</span></p>
            <p>{{$t('customer.productName')}}：<span>{{basic.customerProductName}}</span></p>
            <p>{{$t('customer.badNum')}}：<span>{{basic.badQuantity}}</span></p>
            <p>{{$t('customer.treatmentMethod')}}：
              <span v-if="basic.treatmentMethod=='REJECT'">{{$t('customer.return')}}</span>
              <span v-else-if="basic.treatmentMethod=='REWORK'">{{$t('customer.rework')}}</span>
              <span v-else-if="basic.treatmentMethod=='SCREEN'">{{$t('customer.filter')}}</span>
              <span v-else-if="basic.treatmentMethod=='EMERGENCY_RELEASE'">{{$t('customer.release')}}</span>
              <span v-else-if="basic.treatmentMethod=='SCRAP'">{{$t('customer.scrap')}}</span>
              <span v-else-if="basic.treatmentMethod=='SPECIAL_ADOPTION'">{{$t('customer.special')}}</span>
            </p>
          </i-col>
          <i-col span="6">
            <p><span v-if="basic.isFatal==1">{{$t('customer.already')}}</span><span v-else-if="basic.isFatal==0">{{$t('customer.notYet')}}</span>{{$t('customer.setMainAbn')}}
            </p>
            <p>{{$t('customer.productBatchNo')}}：<span>{{basic.batchNo}}</span></p>
            <p>{{$t('customer.productUnit')}}：<span>{{basic.customerProductUnitName}}</span></p>
            <p>{{$t('customer.badRate')}}：<span>{{(basic.badQuantity/basic.inspectionQuantity*100).toFixed(2)}}%</span></p>
          </i-col>
          <i-col span="6">
            <p>{{$t('customer.treatmentLimit')}}：<span>{{basic.treatmentTimeLimit}}H</span></p>
            <p>{{$t('customer.customer')}}：<span>{{basic.customerName}}</span></p>
            <p>{{$t('customer.batchNum')}}：<span>{{basic.batchQuantity}}</span></p>
          </i-col>
        </Row>
      </div>
    </div>
    <div class="iqis-page-block" v-if="basic.isInternal==0">
      <div class="iqis-page-block-title">
        {{$t('customer.internalInfo')}}
      </div>
      <div class="iqis-page-block-body">
        <Row class="" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.productNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :label="basic.productNo" remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pleaseChoose')" :disabled="proDisabled||noPermsDis" v-model="basic.productId" filterable @on-change="basic.productId?getProductData(basic.productId):''">
                <Option v-for="data in productList" :key="data.productId" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('customer.productName')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.productName" :placeholder="i18n.t('fileCenter.pe')" style="width: 100%;"></i-input>
            </div>
          </i-col>

        </Row>
      </div>
    </div>
    <div class="iqis-page-block">
      <div class="iqis-page-block-title" style="margin-bottom:15px;">
        {{$t('customer.treatmentRecord')}}
      </div>
      <div class="iqis-page-block-body">

        <div class="blockSmall">
          <div class="titleSmall">{{$t('customer.D1')}}</div>
          <div class="iqis-page-block-tools">
            <div class="iqis-page-block-tools-primary">
              <div class="iqis-page-block-label">{{$t('customer.defectTable')}}</div>
            </div>
            <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
              <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('customer.changed')}} <span style="color:#1b75ea">{{TableLength}}</span> {{$t('customer.defects')}}</span>
              <Button v-if="!d2Description.disabled" type="ghost" icon="trash-a" @click="deleteDefect">{{$t('customer.delete')}}</Button>
            </div>
          </div>
          <Table  :no-data-text="i18n.t('noData')"class="noBorder noHeight location defectTable" ref="defectTable" :loading="defectRecords.table.loading" @on-selection-change="getTableLength" v-drag-table-column="defectRecords.table.columns" border stripe :columns="defectRecords.table.columns" :data="defectRecords.table.data">
            <Button :disabled="noPermsDis" class="iqis-table-footer-btn" v-if="!d2Description.disabled" icon="plus" slot="footer" type="dashed" style="width:100%;margin: 16px;" @click="addDefect">{{$t('customer.addDefect')}}</Button>
          </Table>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('customer.abnDescribe')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input :disabled="d2Description.disabled||noPermsDis" type="textarea" style="width:100%" v-model="d2Description.description"></i-input>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('customer.auditor')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-if="basic.isInternal==1" :disabled="d2Description.disabled||noPermsDis" v-model="basic.auditorId" filterable>
                  <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
                <i-input v-else-if="basic.isInternal==0"  :disabled="d2Description.disabled" style="width:100%" v-model="basic.auditorName"></i-input>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('customer.reviewTime')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :clearable='false' disabled v-model="basic.auditTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.reviewTime')" style="width:100%"></DatePicker>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('customer.describeUser')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-if="basic.isInternal==1" :disabled="d2Description.disabled||noPermsDis" v-model="d2Description.operatorId" filterable>
                  <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
                <i-input v-else-if="basic.isInternal==0"  :disabled="d2Description.disabled" style="width:100%" v-model="d2Description.operatorName"></i-input>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('customer.time')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :clearable='false' :disabled="d2Description.disabled||noPermsDis" v-model="d2Description.operateTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
        </div>
        <div class="blockSmall">
          <div class="titleSmall">{{$t('customer.D2')}}</div>
          <Row :gutter="25">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('customer.leader')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" :disabled="d1Team.disabled||noPermsDis" v-model="d1Team.leaderId" filterable>
                  <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6" offset="6">
              <div class="iqis-page-block-label">{{$t('customer.teamCreator')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" :disabled="d1Team.disabled||noPermsDis" v-model="d1Team.creatorId" filterable>
                  <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('customer.time')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :clearable='false' :disabled="d1Team.disabled||noPermsDis" v-model="d1Team.createTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('customer.teamMember')}}</div>
              <div class="iqis-page-block-ctrl">
                <Button :disabled="d1Team.disabled||noPermsDis" type="primary" icon="person-stalker" v-if="d1memberBtnShow" @click="d1memberInputShow=true;d1memberBtnShow=false;d1memberInputValue='';">{{$t('customer.addMoreMember')}}</Button>
                <Select :placeholder="i18n.t('pleaseChoose')" style="width:146px" v-if="d1memberInputShow" v-model="d1Team.memberId" @on-change="addMember(d1Team.memberId,d1Team.members)" filterable>
                    <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                  </Select>
                  <Tag :closable="!d1Team.disabled&&!noPermsDis" v-for="(data,index) in d1Team.members" type="dot" color="blue" :key="index" :name="index" @on-close="deleteMember(index,d1Team.members)">{{data.memberName}}</Tag>
              </div>
            </i-col>
          </Row>
        </div>
        <div v-if="DisciplineHandle.show">

          <div class="blockSmall">
            <div class="titleSmall">{{$t('customer.D3')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('customer.shortPolicy')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d3Contain.policy" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('customer.handleMethod')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input autocomplete="on" :disabled="DisciplineHandle.disabled||noPermsDis" style="width:100%" v-model="d3Contain.treatmentMethod"></i-input>
                </div>
              </i-col>
              <i-col span="6" offset="6">
                <div class="iqis-page-block-label">{{$t('customer.peopleInCharge')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d3Contain.operatorId" filterable>
                    <Option v-for="data in d1Team.members" :key="data.memberId" :value="data.memberId">{{data.memberName}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('customer.time')}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable='false' :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d3Contain.operateTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('customer.addAttachments')}}</div>
                <Spin size="large"  v-if="spinShow" style="text-align:left">
                  <div class="iqis-page-block-ctrl">
                    <IqisUpload ref="d3Upload" :edit="!DisciplineHandle.disabled||noPermsDis" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d3Contain.attachments' :chartTypeShow="false">
                    </IqisUpload>
                  </div>
                </Spin>
              </i-col>
            </Row>
          </div>

          <div class="blockSmall">
            <div class="titleSmall">{{$t('customer.D4')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('customer.causeIdentify')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d4Cause.causeIdentify" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('customer.abnormalCause')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" :disabled="DisciplineHandle.disabled" v-model="d4Cause.complaintCauseId" filterable>
                    <Option v-for="data in abnormalReason" :key="data.abnormalId" :value="data.abnormalId">{{data.name}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6" offset="6">
                <div class="iqis-page-block-label">{{$t('customer.peopleInCharge')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d4Cause.operatorId" filterable>
                    <Option v-for="data in d1Team.members" :key="data.memberId" :value="data.memberId">{{data.memberName}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('customer.time')}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable='false' :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d4Cause.operateTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('customer.addAttachments')}}</div>
                <Spin size="large"  v-if="spinShow" style="text-align:left">
                  <div class="iqis-page-block-ctrl">
                    <IqisUpload ref="d4Upload" :edit="!DisciplineHandle.disabled&&!noPermsDis" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d4Cause.attachments' :chartTypeShow="false">
                    </IqisUpload>
                  </div>
                </Spin>
              </i-col>
            </Row>
          </div>

          <div class="blockSmall">
            <div class="titleSmall">{{$t('customer.D5')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('customer.longPolicy')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d5Plan.policy" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('customer.handleMethod')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" style="width:100%" v-model="d5Plan.treatmentMethod"></i-input>
                </div>
              </i-col>
              <i-col span="6" offset="6">
                <div class="iqis-page-block-label">{{$t('customer.peopleInCharge')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d5Plan.operatorId" filterable>
                    <Option v-for="data in d1Team.members" :key="data.memberId" :value="data.memberId">{{data.memberName}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('customer.time')}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable='false' :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d5Plan.operateTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('customer.addAttachments')}}</div>
                <Spin size="large"  v-if="spinShow" style="text-align:left">
                  <div class="iqis-page-block-ctrl">
                    <IqisUpload ref="d5Upload" :edit="!DisciplineHandle.disabled&&!noPermsDis" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d5Plan.attachments' :chartTypeShow="false">
                    </IqisUpload>
                  </div>
                </Spin>
              </i-col>
            </Row>
          </div>

          <div class="blockSmall">
            <div class="titleSmall">{{$t('customer.D6')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('customer.effect')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d6Effect.effect" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('customer.verificationMethod')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" style="width:100%" v-model="d6Effect.verificationMethod"></i-input>
                </div>
              </i-col>
              <i-col span="6" offset="6">
                <div class="iqis-page-block-label">{{$t('customer.verifier')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d6Effect.operatorId" filterable>
                    <Option v-for="data in d1Team.members" :key="data.memberId" :value="data.memberId">{{data.memberName}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('customer.time')}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable='false' :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d6Effect.operateTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('customer.addAttachments')}}</div>
                <Spin size="large"  v-if="spinShow" style="text-align:left">
                  <div class="iqis-page-block-ctrl">
                    <IqisUpload ref="d6Upload" :edit="!DisciplineHandle.disabled||noPermsDis" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d6Effect.attachments' :chartTypeShow="false">
                    </IqisUpload>
                  </div>
                </Spin>
              </i-col>
            </Row>

          </div>

          <div class="blockSmall">
            <div class="titleSmall">{{$t('customer.D7')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('customer.preventive')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d7Prevention.preventive" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="12">
                <div class="iqis-page-block-label">{{$t('customer.addAttachments')}}</div>
                <Spin size="large"  v-if="spinShow" style="text-align:left">
                  <div class="iqis-page-block-ctrl">
                    <IqisUpload ref="d7Upload" :edit="!DisciplineHandle.disabled||noPermsDis" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d7Prevention.attachments' :chartTypeShow="false">
                    </IqisUpload>
                  </div>
                </Spin>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('customer.peopleInCharge')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d7Prevention.operatorId" filterable>
                    <Option v-for="data in d1Team.members" :key="data.memberId" :value="data.memberId">{{data.memberName}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('customer.time')}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable='false' :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d7Prevention.operateTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>

          </div>

        </div>
        <div class="blockSmall" v-if="d8Congratulation.show">
            <div class="titleSmall">{{$t('customer.D8')}}</div>
            <!-- <Row :gutter="25" style="padding-top:12px;">
              <i-col span="6">
                是否结案<Checkbox v-model="d8Congratulation.closeState">是</Checkbox>
              </i-col>
            </Row> -->
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('customer.opinion')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="d8Congratulation.disabled||noPermsDis" type="textarea" v-model="d8Congratulation.opinion" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('customer.shareMembers')}}</div>
              <div class="iqis-page-block-ctrl">
                <Button :disabled="d8Congratulation.disabled||noPermsDis" type="primary" icon="share" v-if="d8memberBtnShow" @click="d8memberInputShow=true;d8memberBtnShow=false;d8memberInputValue='';">{{$t('customer.shareMoreMember')}}</Button>
                <Select :placeholder="i18n.t('pleaseChoose')" style="width:146px" v-if="d8memberInputShow" v-model="d8Congratulation.memberId" @on-change="addMember(d8Congratulation.memberId,d8Congratulation.members)" filterable>
                    <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                  </Select>
                  <Tag :closable="!d8Congratulation.disabled||noPermsDis" v-for="(data,index) in d8Congratulation.members" type="dot" color="blue" :key="index" :name="index" @on-close="deleteMember(index,d8Congratulation.members)">{{data.memberName}}</Tag>
              </div>
            </i-col>
          </Row>
            <Row :gutter="25">
              <i-col span="6" offset="12">
                <div class="iqis-page-block-label">{{$t('customer.endUser')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-if="basic.isInternal==1" :disabled="d8Congratulation.disabled||noPermsDis" v-model="d8Congratulation.operatorId" filterable>
                    <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                  </Select>
                  <i-input v-else-if="basic.isInternal==0" :disabled="d8Congratulation.disabled||noPermsDis" v-model="d8Congratulation.operatorName" style="width:100%"></i-input>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('customer.endCaseTime')}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable='false' :disabled="d8Congratulation.disabled||noPermsDis" v-model="d8Congratulation.operateTime" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('customer.pleaseTime')" style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>

          </div>

      </div>
    </div>

    <!--end blocks-->
    <div class="page-end" style="padding-bottom: 65px"></div>

    <IqisAffix placement="bottom" :offset="0" v-if="button.creator&&!noPermsDis">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <!-- <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"confirm title="提示：提交之后以上数据将不可修改，是否确定？" placement="bottom-end" @on-ok="addComplain('submit')" :loading="loadStat.saveLoading">
          <Button type="primary" :loading="loadStat.submitLoading">提交</Button>
        </Poptip> -->
        <Button type="primary" v-if="permsBtn.UPDATE_CUSTOMER_COMPLAINT" @click="confirm('submit','addComplain')" :loading="loadStat.saveLoading">{{$t('customer.commit')}}</Button>
        <Button type="primary" @click="addComplain('save')" :loading="loadStat.saveLoading">{{$t('customer.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('customer.cancel')}}</Button>
      </div>
    </IqisAffix>
    <IqisAffix placement="bottom" :offset="0" v-else-if="button.auditor&&permsBtn.UPDATE_CUSTOMER_COMPLAINT">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <!-- <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"confirm title="提示：审核提交之后以上数据将不可修改，是否确定？" placement="bottom-end" @on-ok="auditPass(1)">
          <Button type="primary">审核通过</Button>
        </Poptip> -->
        <Button type="primary" @click="confirm('audit','auditPass')">{{$t('customer.auditPass')}}</Button>

        <Button type="ghost" @click="auditPass(0)">{{$t('customer.auditReject')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('customer.cancel')}}</Button>
      </div>
    </IqisAffix>
    <IqisAffix placement="bottom" :offset="0" v-else-if="button.handle&&permsBtn.UPDATE_CUSTOMER_COMPLAINT">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <!-- <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"v-if="submitHandleShow" confirm title="提示：提交之后以上数据将不可修改，是否确定？" placement="bottom-end" @on-ok="saveHandle('submit')">
          <Button type="primary" :loading="loadStat.submitLoading">提交给结案人</Button>
        </Poptip>
        <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"v-if="submitEndShow" confirm title="提示：提交之后以上数据将不可修改，是否确定？" placement="bottom-end" @on-ok="saveHandle('toCustomer')">
          <Button type="primary" :loading="loadStat.submitLoading">提交给客户</Button>
        </Poptip> -->
        <Button v-if="submitHandleShow" type="primary" @click="confirm('submit','saveHandle')" :loading="loadStat.submitLoading">{{$t('customer.commitToEnd')}}</Button>
        <Button v-if="submitEndShow" type="primary" @click="confirm('submit','saveHandleToCustomer')" :loading="loadStat.submitLoading">{{$t('customer.commitToCustomer')}}</Button>

        <Button type="primary" @click="saveHandle('save')" v-if="saveHandleShow" :loading="loadStat.saveLoading">{{$t('customer.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('customer.cancel')}}</Button>
      </div>
    </IqisAffix>
    <IqisAffix placement="bottom" :offset="0" v-else-if="button.end&&permsBtn.UPDATE_CUSTOMER_COMPLAINT">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <!-- <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"confirm title="提示：结案之后以上数据将不可修改，是否确定？" placement="bottom-end" @on-ok="endComplain">
          <Button type="primary" :loading="loadStat.submitLoading" >结案</Button>
        </Poptip> -->
        <Button type="primary" @click="confirm('end','endComplain')" :loading="loadStat.submitLoading">{{$t('customer.end')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('customer.cancel')}}</Button>
      </div>
    </IqisAffix>
    <IqisAffix placement="bottom" :offset="0" v-else>
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="closePage">{{$t('customer.cancel')}}</Button>
      </div>
    </IqisAffix>
    <IqisAffix placement="bottom" :offset="0" v-if="button.waitReply&&permsBtn.UPDATE_CUSTOMER_COMPLAINT">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <!-- <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"confirm title="提示：退回之后以上数据将被清空，是否确定？" placement="bottom-end" @on-ok="saveReply('return')">
          <Button type="primary" :loading="loadStat.saveLoading">退回给客户</Button>
        </Poptip>
        <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"confirm title="提示：提交之后以上数据将不可修改，是否确定？" placement="bottom-end" @on-ok="saveReply('submit')">
          <Button type="primary" :loading="loadStat.submitLoading">提交</Button>
        </Poptip> -->
        <Button type="primary" :loading="loadStat.saveLoading" @click="confirm('back','saveReplyReturn')">{{$t('customer.back')}}</Button>
        <Button type="primary" :loading="loadStat.submitLoading" @click="confirm('submit','saveReplySubmit')">{{$t('customer.commit')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('customer.cancel')}}</Button>
      </div>
    </IqisAffix>
    <Spin size="large" fix v-if="loadStat.complaintDataLoading || loadStat.selectsDataLoading"></Spin>
  </div>

</template>

<script>
import $ from 'jquery'
export default {
  props:["params","tabKey"],
  data(){
    let vm = this;
    return{
      i18n:window.i18n,
      spinShow:false,
      loadStat:{
        selectsDataLoading:true,
        complaintDataLoading:true,
        saveLoading:false,
        submitLoading:false
      },
      selects:{
        defectTypeList:[],
        inspectionTypes:[],
      },
      TableLength:0,
      headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
      complaintId:'',
      userId:'',
      customerList:[],
      supplierList:[],
      userList:[],
      productList:[],
      abnormalReason:[],
      submitHandleShow:false,
      saveHandleShow:true,
      submitEndShow:false,
      d1memberBtnShow:true,
      d1memberInputShow:false,
      d8memberBtnShow:true,
      d8memberInputShow:false,
      proDisabled:false,
      treatmentMethods: [
        {value:"REJECT",label:i18n.t('customer.return')},
        {value:"REWORK",label:i18n.t('customer.rework')},
        {value:"SCREEN",label:i18n.t('customer.filter')},
        {value:"SPECIAL_ADOPTION",label:i18n.t('customer.special')},
        {value:"EMERGENCY_RELEASE",label:i18n.t('customer.release')},
        {value:"SCRAP",label:i18n.t('customer.scrap')},
        {value:"SUPPLY_AGAIN",label:"补发"},//后期做国际化
        {value:"REDUCE_ACCOUT",label:"减账"},//后期做国际化
      ],
      // treatmentMethods:[
      //   {value:"0",label:"退货"},
      //   {value:"1",label:"返工"},
      //   {value:"2",label:"筛选"},
      //   {value:"5",label:"特采"},
      //   {value:"3",label:"紧急放行"},
      //   {value:"4",label:"报废"},
      // ],
      treatmentTimeLimits:[4,12,24,36,48,96],
      array:[],
      string:"",
      button:{
        creator:false,
        auditor:false,
        handle:false,
        end:false,
        other:false,
        waitReply:false
      },
      "basic":{
        disabled:false,
        abnormalId: '',
        auditState: 1,
        auditTime: '',
        auditorId: '',
        batchQuantity: '',
        inspectionQuantity: '',
        badQuantity: '',
        batchNo: '',
        complaintDate: new Date(),
        complaintId: '',
        complaintNo: '',
        complaintPlace: '',
        complaintState: '',
        createTime: new Date(),
        creatorId:'',
        customerId: '',
        customerName:'',
        customerProductName: '',
        customerProductNo: '',
        customerProductUnitName: '',
        examType: 0,
        isFatal:0,
        isFatalSelect:false,
        isInternal:'',
        productId: '',
        productNo: '',
        productName: '',
        productUnitName: '',
        productSpec:'',
        prodTypeName:'',
        qcNo: '',
        subject: '',
        supplierId: '',
        treatmentMethod: '',
        treatmentMethodTips: '',
        treatmentTimeLimit: '',
      },
      defectRecords:{
        table:{
          loading:false,
          selected:false,
          data:[],
          pager:{
            rows:10,
            need:true,
            total:100,
            limit:10,
            current:1
          },
          columns:[
            {type: 'selection',
              align: 'center',
              width:40,
              minWidth:40,
              maxWidth:40
            },{
              title: i18n.t('customer.no'),
              width:40,
              minWidth:40,
              maxWWidth:40,
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm)
            },
            // {
            //   title: i18n.t('customer.project'),
            //   width:100,
            //   minWidth:100,
            //   key: 'inspectionTypeName',
            //   render: (h, params) => {
            //     let _this = this;
            //     let texts = '';
            //     texts=params.row.inspectionTypeName
            //     return h('div', {
            //         props: {
            //           type: 'text',
            //           disabled:true,
            //           value:params.row.inspectionTypeName
            //         },
            //     },texts)
            //   }
            // },
            {
              title: i18n.t('customer.project'),
              width:this.$store.state.locale=='zh_CN'?103:120,
              align: 'center',
              ellipsis:true,
              minWidth:this.$store.state.locale=='zh_CN'?103:120,
              key: 'inspectionTypeId',
              render:(h, params)=>{
                if(vm.basic.isInternal==1){
                  let ret =  vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(
                    vm,
                    (vm)=>{
                      return vm.selects.inspectionTypes
                    },
                    "inspectionTypeId",
                    "name",
                    null,
                    this.getDefectNameList,
                    this.d2Description.disabled||this.noPermsDis,
                  )
                  return ret(h,params);
                }else{
                  let texts = '';
                  texts=params.row.inspectionTypeName
                  return h('div', {
                      props: {
                        type: 'text',
                        disabled:true,
                        value:params.row.inspectionTypeName
                      },
                  },texts)
                }
              }
              // vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(vm,(vm)=>{return vm.selects.inspectionTypes},"inspectionTypeId","name",null,this.getDefectNameList),
            },
            {
              title: i18n.t('customer.defectName'),
              width:120,
              minWidth:120,
              key: 'defectTypeId',
              render: (h, params) => {
                let vm = this;
                if(vm.basic.isInternal==1){
                  return h('Select',
                    {
                      props:{
                        value: this.defectRecords.table.data[params.index].defectTypeId,
                        disabled:this.d2Description.disabled||this.noPermsDis,
                        filterable:true
                      },
                      on:{
                        'on-change':(value) => {
                          this.defectRecords.table.data[params.index].defectTypeId = value;
                          this.onDefectTypeSelectChange(this.defectRecords.table.data[params.index].defectTypeId,params.index)
                        }
                      }
                    },
                    this.defectRecords.table.data[params.index].defectTypeList.map(function(type){
                      return h('Option', {props: {value: type.defectTypeId,label:type.name}},type);
                    })
                  );
                }else{
                  let texts = '';
                  texts=params.row.defectTypeName
                  return h('div', {
                      props: {
                        type: 'text',
                        disabled:true,
                        value:params.row.defectTypeName
                      },
                  },texts)
                }

              }
            },
            {
              title: i18n.t('customer.defectLevel'),
              align: 'center',
              width:this.$store.state.locale=='zh_CN'?80:100,
              minWidth:this.$store.state.locale=='zh_CN'?80:100,
              key: 'qualityLevelId',
              render: (h, params) => {
                let vm = this;
                if(vm.basic.isInternal==1){
                  return h('Select',
                    {
                      props:{
                        value: this.defectRecords.table.data[params.index].qualityLevelId,
                        disabled:this.d2Description.disabled||this.noPermsDis
                      },
                      on: {
                        'on-change':(event) => {
                          this.defectRecords.table.data[params.index].qualityLevelId = event;
                        }
                      },
                    },
                    this.defectRecords.prodBatch.DefectGrade.map(function(type){
                        return h('Option', {
                            props: {value: type.qltyLvId,label:type.name}
                        }, type);
                    })
                  );
                }else{
                  let texts = '';
                  texts=params.row.qualityLevelName
                  return h('div', {
                      props: {
                        type: 'text',
                        disabled:true,
                        value:params.row.qualityLevelName
                      },
                  },texts)
                }
              }
            },{
              title: i18n.t('customer.defectPosition'),
              width:120,
              minWidth:120,
              key: 'defectLocationId',
              render: (h, params) => {
                let vm = this;
                if(vm.basic.isInternal){
                  return h('Select',
                    {
                      props:{
                        value: this.defectRecords.table.data[params.index].defectLocationId,
                        disabled:this.d2Description.disabled||this.noPermsDis
                      },
                      on: {
                        'on-change':(event) => {
                          this.defectRecords.table.data[params.index].defectLocationId = event;
                        }
                      },
                    },
                    this.defectRecords.prodBatch.DefectPosition.map(function(type){
                      return h('Option', {
                        props: {value: type.defectLocId,label:type.name}
                      }, type);
                    })
                  );
                }else{
                  let texts = '';
                  texts=params.row.defectLocationName
                  return h('div', {
                      props: {
                        type: 'text',
                        disabled:true,
                        value:params.row.defectLocationName
                      },
                  },texts)
                }

              }
            },{
              title: i18n.t('customer.sampleQuantity'),
              align: 'center',
              width:this.$store.state.locale=='zh_CN'?60:120,
              minWidth:this.$store.state.locale=='zh_CN'?60:120,
              key: 'sampleQuantity',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: me.defectRecords.table.data[params.index].sampleQuantity,
                      disabled:this.d2Description.disabled||this.noPermsDis
                    },
                    on: {
                      'on-blur':(event) => {
                        this.defectRecords.table.data[params.index].sampleQuantity = event.target.value;
                        this.defectRate(this.defectRecords.table.data[params.index].defectQuantity,this.defectRecords.table.data[params.index].sampleQuantity,params.index)
                      }
                    }
                  })
                ])
              }
            },{
              title: i18n.t('customer.defectNum'),
              align: 'center',
              width:this.$store.state.locale=='zh_CN'?60:120,
              minWidth:this.$store.state.locale=='zh_CN'?60:120,
              key: 'defectQuantity',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: me.defectRecords.table.data[params.index].defectQuantity,
                      disabled:this.d2Description.disabled||this.noPermsDis
                    },
                    on: {
                      'on-blur':(event) => {
                        this.defectRecords.table.data[params.index].defectQuantity = event.target.value
                        this.defectRate(this.defectRecords.table.data[params.index].defectQuantity,this.defectRecords.table.data[params.index].sampleQuantity,params.index)
                      }
                    }
                  })
                ])
              }
            },{
              title: i18n.t('customer.defectRate'),
              align: 'center',
              width:this.$store.state.locale=='zh_CN'?70:90,
              minWidth:this.$store.state.locale=='zh_CN'?70:90,
              key: 'defectRate',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: this.defectRecords.table.data[params.index].defectRate,//me.defectRecords.table.data[params.index].defectQuantity/me.defectRecords.table.data[params.index].sampleQuantity*100+'%',//me.defectRate(me.defectRecords.table.data[params.index].defectQuantity,me.defectRecords.table.data[params.index].sampleQuantity),
                      disabled:true//this.d2Description.disabled
                    },
                    on: {
                      'on-change':(event) => {
                        //console.log(event)
                      }
                    }
                  })
                ])
              }
            },
            {
              title: i18n.t('customer.remarks'),
              key:"remark",
              minWidth: 200,
              width:200,
              render: (h, params) => {
                return h("div", [
                  h("Input", {
                    props: {
                      type: "textarea",
                      value:params.row.remark,
                      autosize:{
                          // minRows:1,
                          maxRows:4
                      },
                      rows:4,
                      maxlength:600,
                    },
                    on: {
                      "on-blur": event => {
                        params.row.remark = event.target.value
                        this.defectRecords.table.data[params.index] = params.row
                      }
                    }
                  })
                ]);
              }
            },
            {
              title: i18n.t('customer.pic'),
              align: 'center',
              key: 'attachments',
              minWidth: 230,
              render:function (h, data) {
                try{
                  vm.defectRecords.table.data[data.index].attachments.length
                }catch(err) {
                  vm.defectRecords.table.data[data.index].attachments=[]
                }

                return h("IqisUpload", {
                  props: {//:size="54" :edit="switchs.fileEdit" v-model="product.settings.ext"
                    "value":data.row[data.column.key],
                    "size": 32,
                    "row-index": data.index,
                    "row":data.row,
                    "edit":vm.picBtnShow,
                    "maxSize":10240,
                    "fileType":['jpg','jpeg','png'],
                    "fileCount":5,
                    'chartTypeShow':"true",
                    //disabled:this.other.basicD1D2Show,
                  },
                  on: {
                    input: (val) => {
                      vm.defectRecords.table.data[data.index].attachments.push(val[0]);
                      //vm.cellDefectEditorEnd(val, data.column.key, data.index)
                    },
                    del: (val) => {
                      vm.defectRecords.table.data[data.index].attachments.splice(val,1);
                      //vm.cellDefectEditorEnd(val, data.column.key, data.index)
                    }
                  }
                })
              }
            }
            /*{
              title: '附件',
              align: 'center',
              minWidth:200,
              key: '',
              render:function (h, data) {
                return h("IqisUpload", {
                  props: {//:size="54" :edit="switchs.fileEdit" v-model="product.settings.ext"
                    "value":data.row[data.column.key],
                    "size": 32,
                    "row-index": data.index,
                    "row":data.row,
                    // disabled:this.defectRecords.disabled
                  },
                  on: {
                    input: (val) => {
                      //vm.cellDefectEditorEnd(val, data.column.key, data.index)
                    }
                  }
                })
              }
            }*/
          ]
        },
        discountData:{
          rows:[{
          }],
          tableData:{
            defectLocationId: '',
            defectLocationName: '',
            sampleQuantity:'',
            defectQuantity: '',
            defectRate: '',
            defectRecordId: null,
            defectTypeId: '',
            defectTypeName: '',
            inspectionTypeId: '',
            inspectionTypeName: '',
            qualityLevelId: '',
            qualityLevelName: '',
            complaintId: '',
            treatmentDescription: '',
            treatmentHours: ''
          },
        },
        prodBatch:{
          selected:false,
          disabled:true,
          defectNumber:0,
          dataTable:[],
          DefectName:[],
          DefectGrade:[],
          DefectPosition:[]
        }
      },
      "d2Description": {
        disabled:false,
        "complaintId": '',
        "description": '',
        "disciplineId": '',
        "operateTime": new Date(),
        "operatorId": ''
      },
      "d1Team": {
        disabled:false,
        "complaintId": '',
        "createTime":new Date(),
        "creatorId": '',
        "disciplineId": '',
        "leaderId": '',
        "leaderName": '',

        memberId:'',
        "members": [
        ]
      },
      DisciplineHandle:{
        show:false,
        disabled:false
      },
      "d3Contain": {
        "attachmentId": '',
        "complaintId": '',
        "disciplineId": '',
        "operateTime": new Date(),
        "operatorId": '',
        "operatorName": '',
        "policy": '',
        "treatmentMethod": ''
      },
      "d4Cause": {
        "attachmentGroupId": '',
        "causeIdentify": '',
        "complaintCauseId": '',
        "complaintCauseName": '',
        "complaintCauseTypeId": '',
        "complaintCauseTypeName": '',
        "complaintId": '',
        "disciplineId": '',
        "operateTime": '',
        "operatorId": '',
        "operatorName": ''
      },
      "d5Plan": {
        "attachmentId": '',
        "complaintId": '',
        "disciplineId": '',
        "operateTime": '',
        "operatorId": '',
        "operatorName": '',
        "policy": '',
        "treatmentMethod": ''
      },
      "d6Effect": {
        "attachmentId": '',
        "complaintId": '',
        "disciplineId": '',
        "effect": '',
        "operateTime": '',
        "operatorId": '',
        "operatorName": '',
        "verificationMethod": ''
      },
      "d7Prevention": {
        "attachmentId": '',
        "complaintId": '',
        "disciplineId": '',
        "operateTime": '',
        "operatorId": '',
        "operatorName": '',
        "preventive": ''
      },
      "d8Congratulation": {
        "closeState": '',
        "complaintId": '',
        "disciplineId": '',
        "members": [],
        "operateTime": '',
        "operatorId": '',
        "opinion": '',
        memberId:'',
        show:false,
        disabled:false
      },
      permsCur:[
        "INSERT_CUSTOMER_COMPLAINT",
        "UPDATE_CUSTOMER_COMPLAINT",
      ],
      permsBtn:{
        "UPDATE_CUSTOMER_COMPLAINT":false,
        "INSERT_CUSTOMER_COMPLAINT":false
      },
      noPermsDis:true,
      loadingRemote:false,
      source:null,
    }
  },

  created(){
    let permsAll = this.$store.state.permissions;
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.refreshData();
  },
  methods:{
    remoteMethod: _.debounce(function(query) {
      let that = this;
      that.loadingRemote = true;

      if (query !== '') {
        that.cancelQuest();
        that.$nextTick(()=>{

          that.$http.get('/basic/product/simple?page=1&limit=999999&useState=1&fieldName=no,name&query='+query,{
            cancelToken: new this.$http.CancelToken(function executor(c) {
            that.source = c;
            })
          }).then(res =>{
            that.productList = res.data
            that.loadingRemote = false;
          })

        })
      } else {
        that.productList = [];
        that.loadingRemote = false;
      }
    },500),
    cancelQuest(){
      if(typeof this.source ==='function'){
        this.source('终止请求'); 
      }
    },
    getInspectiontype(){//获取检验项目下拉框
      let that=this;
      that.$http.get("/basic/inspectiontype",{params:{limit:99999999}}).then(function(resp){
        let root = {title:i18n.t('customer.projectType'),selected: false,label:i18n.t('customer.projectType'),value:0,expand:true};
        that.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
        that.selects.inspectionTypes = [root];
        // //console.log(that.selects.inspectionTypes,'检验项目数据')
      })
    },
    getDefectNameList(val,key,index,o){//获取当前检验项目下的缺陷名称列表
      if(o == null || Object.keys(o).length == 0){
        return;
      }
      //console.log('获取缺陷名称列表的参数',val,key,index,o);
      let that = this;
      this.defectRecords.table.data = this.defectRecords.table.data ||[];
      let newRow = this.defectRecords.table.data[index];
      if(!newRow && this.defectRecords.table.data[index]){
        newRow =  JSON.parse(JSON.stringify(this.defectRecords.table.data[index]));
      }
      if(!newRow){return;}
      newRow[key] = val;
      newRow['inspectionTypeName'] = o.name;
      newRow['inspectionTypeId'] = o.inspectionTypeId;
      newRow['chkDevTypeId'] = o.chkDevTypeId;
      newRow['chkDevTypeName'] = o.chkDevTypeName;
      let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+o.inspectionTypeId);//带出缺陷名称列表
      newRow['defectTypeList'] = resp ? resp.data||[]:[];
      that.defectRecords.table.data[index] = newRow;
      that.$set(that.defectRecords.table.data, index, newRow);
      return;
    },
    refreshData(){
      // debugger
      let that = this;
      that.loadStat.complaintDataLoading = true;
      let complaintId = that.$props.params && that.$props.params.complaintId;
      // that.getSelectData();
      that.loadStat.selectsDataLoading = true;
      that.$http.all([
        that.$http.get("/bas/customerList",{params:{limit:99999999}}),
        that.$http.get("/bas/manufacturer/allManufacturer",{params:{limit:999999999}}),
        that.$http.get("/tenant/user",{params:{limit:999999999}}),
        // that.$http.get("/basic/product",{params:{limit:999999999, useState:1, page:1}}),
        that.$http.get("/basic/abnormal",{params:{limit:999999999}})
      ]).then(function(resps){
        that.loadStat.selectsDataLoading = false;
        that.customerList = resps[0].data;
        that.supplierList = resps[1].data;
        that.userList = resps[2].data;
        // that.productList = resps[3].data;
        that.abnormalReason = resps[3].data;
        that.getInspectiontype();
        that.$http.get('/tenant/user/profile').then(function(resp){
          that.userId=resp.data.userId;
          that.d1Team.creatorId=that.userId;
          that.d2Description.operatorId=that.userId;
          if(complaintId){//修改
            that.complaintId = complaintId;
            that.getData();

          }else{//添加
            that.getDefectData();
            that.button.creator=true;
            that.basic.isInternal=1;
            that.loadStat.complaintDataLoading = false;
          }
          if((!that.complaintId&&that.permsBtn.INSERT_CUSTOMER_COMPLAINT)||(that.complaintId&&that.permsBtn.UPDATE_CUSTOMER_COMPLAINT)){
            that.noPermsDis=false;
          }else{
            that.noPermsDis=true;
          }
        })
      });



    },
    getData(){
      let that = this;
      that.$http.get('/customer/complaint/'+that.complaintId).then(function(resp){
        //console.log(resp.data)
        that.loadStat.complaintDataLoading = false;
        let item=resp.data;
        // that.$iqis.utils.deepMerge(that.basic,item.basic);
        // that.$iqis.utils.deepMerge(that.d1Team,item.d1Team);
        // that.$iqis.utils.deepMerge(that.d8Congratulation,item.d8Congratulation);
        that.spinShow=false;
        item.basic.complaintDate=new Date(item.basic.complaintDate);
        item.basic.auditTime=item.basic.auditTime?new Date(item.basic.auditTime):'';
        item.basic.createTime=new Date(item.basic.createTime);
        item.d1Team.createTime=item.d1Team.createTime?new Date(item.d1Team.createTime):'';
        item.d2Description.operateTime=new Date(item.d2Description.operateTime);
        item.d3Contain.operateTime=new Date(item.d3Contain.operateTime);
        item.d4Cause.operateTime=new Date(item.d4Cause.operateTime);
        item.d5Plan.operateTime=new Date(item.d5Plan.operateTime);
        item.d6Effect.operateTime=new Date(item.d6Effect.operateTime);
        item.d7Prevention.operateTime=new Date(item.d7Prevention.operateTime);
        item.d8Congratulation.operateTime=item.d8Congratulation.operateTime?new Date(item.d8Congratulation.operateTime):'';
        that.basic=item.basic;
        that.d1Team=item.d1Team;
        that.d2Description=item.d2Description;
        that.defectRecords.table.data=item.defectRecords;
        if(that.defectRecords.table.data){
          for(let i in that.defectRecords.table.data){
            let inspectionTypeId = that.defectRecords.table.data[i].inspectionTypeId;
            if(inspectionTypeId){
              let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+inspectionTypeId);//带出缺陷名称列表
              let defectTypeList = resp ? resp.data||[] : [];
              that.defectRecords.table.data[i]['defectTypeList'] = defectTypeList;
            }

            if(that.basic.isInternal==1&&!that.defectRecords.table.data[i].defectLocationId){
              that.defectRecords.table.data[i].defectLocationId=i18n.t('customer.null');
            }
          }
        }
        for(var i = 0;i<that.defectRecords.table.data.length;i++){
          if(that.defectRecords.table.data[i].attachments==null){
            that.defectRecords.table.data[i].attachments=new Array();
          }
          that.defectRecords.table.data[i].defectNumber=i

        }
        that.d3Contain=item.d3Contain;
        if(that.d3Contain.attachments==null){
          that.d3Contain.attachments=new Array();
        }
        that.d4Cause=item.d4Cause;
        if(that.d4Cause.attachments==null){
          that.d4Cause.attachments=new Array();
        }
        that.d5Plan=item.d5Plan;
        if(that.d5Plan.attachments==null){
          that.d5Plan.attachments=new Array();
        }
        that.d6Effect=item.d6Effect;
        if(that.d6Effect.attachments==null){
          that.d6Effect.attachments=new Array();
        }
        that.d7Prevention=item.d7Prevention;
        if(that.d7Prevention.attachments==null){
          that.d7Prevention.attachments=new Array();
        }
        that.spinShow=true;
        that.d8Congratulation=item.d8Congratulation;
        that.d1Team.members=item.d1Team.members||[];
        that.d8Congratulation.members=item.d8Congratulation.members||[];

        // if(item.d8Congratulation.members){
        //   that.d8Congratulation.members=item.d8Congratulation.members;
        // }else{
        //   that.d8Congratulation.members=that.d1Team.members;
        // }
        that.d8Congratulation.operatorId = that.d2Description.operatorId;

        if(that.basic.isFatal==1){
          that.basic.isFatalSelect=true;
        }else{
          that.basic.isFatalSelect=false;
        }
        that.getBlock();
        that.getDefectData();

        for(let x in that.defectRecords.table.data){
          that.defectRate(that.defectRecords.table.data[x].defectQuantity,that.defectRecords.table.data[x].sampleQuantity,x);
        }
      })
    },
    getBlock(){
      let that = this;
      let userId = that.userId;
      let state = that.basic.complaintState;//当前状态
      let isInternal = that.basic.isInternal;

      if(state == 0){//添加/修改客诉
        if(that.complaintId){
          let creatorId = that.basic.creatorId;
          if(userId==creatorId){
            that.button.creator=true;
          }else{
            that.button.other=true;
            that.basic.disabled=true;
            that.d1Team.disabled=true;
            that.d2Description.disabled=true;
          }
        }else{
          that.button.creator=true;
        }
      }
      else if(state == 1){//客诉待审核'UNCHECKED'
        that.basic.disabled=true;
        that.d1Team.disabled=true;
        that.d2Description.disabled=true;
        let auditorId = that.basic.auditorId;
        if(userId==auditorId){
          that.button.auditor=true;
        }else{
          that.button.other=true;
        }
      }
      else if(state == 3){//客诉审核驳回'CHECKED_NOTPASS'
        let creatorId = that.basic.creatorId;
        if(userId==creatorId){
          that.button.creator=true;
        }else{
          that.button.other=true;
          that.basic.disabled=true;
          that.d1Team.disabled=true;
          that.d2Description.disabled=true;
        }
      }
      else if(state == 41){//待回复
        that.basic.disabled=true;
        that.d2Description.disabled=true;
        that.button.waitReply=true;
        that.d1Team.creatorId=that.userId;
        that.d1Team.createTime=new Date();
      }
      else if(state == 6){//退回给客户'REJECT'
        that.proDisabled=true;
        that.d1Team.disabled=true;
        that.d2Description.disabled=true;
        that.button.other=true;
      }
      else if(state == 5 || state == 51 || state == 7){//处理中'PROCESSING'/回复中'REPLYING'/被退回'REJECTED'
        that.basic.disabled=true;
        that.d1Team.disabled=true;
        that.d2Description.disabled=true;
        that.DisciplineHandle.show=true;
        that.proDisabled=true;
        if(isInternal==1){//处理中
          that.d8Congratulation.show=true;
          that.d8Congratulation.disabled=true;
        }
        let processorIds = [];
        for(let i=0;i<that.d1Team.members.length;i++){
          processorIds.push(that.d1Team.members[i].memberId);
        }
        if(processorIds.indexOf(userId)!==-1){
          that.button.handle=true;

          if(that.d3Contain.policy==null&&that.d3Contain.treatmentMethod==null){
            that.d3Contain.operatorId=userId;
            that.d3Contain.operateTime=new Date()
          }
          if(that.d4Cause.causeIdentify==null&&that.d4Cause.complaintCauseId==null){
            that.d4Cause.operatorId=userId;
            that.d4Cause.operateTime=new Date()

          }
          if(that.d5Plan.policy==null&&that.d5Plan.treatmentMethod==null){
            that.d5Plan.operatorId=userId;
            that.d5Plan.operateTime=new Date()

          }
          if(that.d6Effect.effect==null&&that.d6Effect.verificationMethod==null){
            that.d6Effect.operatorId=userId;
            that.d6Effect.operateTime=new Date()

          }
          if(that.d7Prevention.preventive==null){
            that.d7Prevention.operatorId=userId;
            that.d7Prevention.operateTime=new Date()

          }

        }else{
          that.button.other=true;
          that.DisciplineHandle.disabled=true;
        }
        that.ifNull();
      }
      else if(state == 8){//待结案'WAIT_COMPLETE'

        that.DisciplineHandle.show=true;
        that.basic.disabled=true;
        that.d1Team.disabled=true;
        that.d2Description.disabled=true;
        that.DisciplineHandle.disabled=true;
        that.proDisabled=true;
        that.d8Congratulation.operateTime=that.d8Congratulation.operateTime||new Date();

        if(isInternal==1){//内部
          that.d8Congratulation.show=true;
          let creatorId = that.basic.creatorId;
          if(userId==creatorId){
            that.button.end=true;
          }else{
            that.d8Congratulation.disabled=true;
            that.button.other=true;
          }
        }
        else{//外部
          that.button.other=true;
        }
      }
      else if(state == 9){//已结案'COMPLETE'
        that.DisciplineHandle.show=true;
        that.d8Congratulation.show=true;
        that.basic.disabled=true;
        that.d1Team.disabled=true;
        that.d2Description.disabled=true;
        that.DisciplineHandle.disabled=true;
        that.d8Congratulation.disabled=true;
        that.proDisabled=true;
        that.button.other=true;
      }
    },
    getSelectData(){//获取下拉框数据
      let that = this;

    },
    getProductData(productId){//获取产品相关
      let that = this;
      that.$http.get('/basic/product/detail/'+productId).then(function(resp){
        that.basic.productNo=resp.data.no;
        that.basic.productName=resp.data.name;
        that.basic.productUnitName=resp.data.prodUnitName;
        that.basic.productSpec=resp.data.spec;
        that.basic.prodTypeName=resp.data.prodTypeName;
        // //console.log(resp.data,"获取产品相关")
      })
    },
    getName(customerId){
      let that = this;
      that.$http.get('/bas/customer/'+customerId).then(function(resp){
        //console.log(resp)
        that.basic.customerName=resp.data.customerName||'';
      })
    },
    ifNull(){
      let that = this;
      if(
        that.d3Contain.operateTime==null||
        that.d3Contain.operateTime==''||
        that.d3Contain.operatorId==null||
        that.d3Contain.operatorId==''||
        that.d3Contain.policy==null||
        that.d3Contain.policy==''||
        that.d3Contain.treatmentMethod==null||
        that.d3Contain.treatmentMethod==''||
        that.d4Cause.causeIdentify==null||
        that.d4Cause.causeIdentify==''||
        that.d4Cause.complaintCauseId==null||
        that.d4Cause.complaintCauseId==''||
        that.d4Cause.operateTime==null||
        that.d4Cause.operateTime==''||
        that.d4Cause.operatorId==null||
        that.d4Cause.operatorId==''||
        that.d5Plan.operateTime==null||
        that.d5Plan.operateTime==''||
        that.d5Plan.operatorId==null||
        that.d5Plan.operatorId==''||
        that.d5Plan.policy==null||
        that.d5Plan.policy==''||
        that.d5Plan.treatmentMethod==null||
        that.d5Plan.treatmentMethod==''||
        that.d6Effect.effect==null||
        that.d6Effect.effect==''||
        that.d6Effect.operateTime==null||
        that.d6Effect.operateTime==''||
        that.d6Effect.operatorId==null||
        that.d6Effect.operatorId==''||
        that.d6Effect.verificationMethod==null||
        that.d6Effect.verificationMethod==''||
        that.d7Prevention.operateTime==null||
        that.d7Prevention.operateTime==''||
        that.d7Prevention.operatorId==null||
        that.d7Prevention.operatorId==''||
        that.d7Prevention.preventive==null||
        that.d7Prevention.preventive==''
      ){
        that.submitHandleShow=false;
        that.submitEndShow=false;
      }else{
        if(that.basic.isInternal==1){
          that.submitHandleShow=true;

        }
        else if(that.basic.isInternal==0&&that.d1Team.creatorId==that.userId){
          that.submitEndShow=true;
          let processorIds = [];
          for(let i=0;i<that.d1Team.members.length;i++){
            processorIds.push(that.d1Team.members[i].memberId);
          }
          if(processorIds.indexOf(that.userId)==-1){
            that.button.other=false;
            that.button.handle=true;
            that.saveHandleShow=false;

          }
        }
        else{
          that.submitEndShow=false;
          that.submitHandleShow=false;
        }
      }
    },
    addMember(id,part){//添加小组成员
      let that = this;
      let array=[];
      for(let i=0;i<part.length;i++){
        array.push(part[i].memberId);
      }
      that.$http.get('/tenant/user/'+id).then(function(resp){
        let name=resp.data.name;
        if(array.indexOf(id)==-1){
          part.push({
            memberId:id,
            memberName:name
          });
        }else{
          that.$Notice.warning({title: i18n.t('customer.memberExisted')});
        }
      })
    },
    deleteMember(index,part){//删除小组成员
      // //console.log(index)
      let that = this;
      part.splice(index, 1);
    },
    addComplain(requestMethod){//添加客诉/修改客诉/提交客诉
      let that=this;
      let params = [
        {type:'Empty',title:i18n.t('customer.happenTime'),value:that.basic.complaintDate},
        {type:'Empty',title:i18n.t('customer.abnNo'),value:that.basic.complaintNo},
        {type:'No',title:i18n.t('customer.abnNo'),value:that.basic.complaintNo},
        // {type:'Empty',title:i18n.t('customer.qcNo'),value:that.basic.qcNo},
        {type:'No',title:i18n.t('customer.qcNo'),value:that.basic.qcNo},
        // {type:'Empty',title:i18n.t('customer.productBatchNo'),value:that.basic.batchNo},
        // {type:'Empty',title:i18n.t('customer.place'),value:that.basic.complaintPlace},
        {type:'Word20',title:i18n.t('customer.place'),value:that.basic.complaintPlace},
        {type:'Empty',title:i18n.t('customer.productNo'),value:that.basic.productId},
        {type:'Empty',title:i18n.t('customer.customer'),value:that.basic.customerId},
        {type:'Empty',title:i18n.t('customer.batchNum'),value:that.basic.batchQuantity},
        {type:'NumNot0',title:i18n.t('customer.batchNum'),value:that.basic.batchQuantity},
        {type:'Empty',title:i18n.t('customer.qcNum'),value:that.basic.inspectionQuantity},
        {type:'NumNot0',title:i18n.t('customer.qcNum'),value:that.basic.inspectionQuantity},
        {type:'Empty',title:i18n.t('customer.badNum'),value:that.basic.badQuantity},
        {type:'Num',title:i18n.t('customer.badNum'),value:that.basic.badQuantity},
        {type:'Empty',title:i18n.t('customer.treatmentMethod'),value:that.basic.treatmentMethod},
        {type:'Empty',title:i18n.t('customer.treatmentLimit'),value:that.basic.treatmentTimeLimit},
        {type:'Empty',title:i18n.t('customer.theme'),value:that.basic.subject},
        {type:'Word20',title:i18n.t('customer.theme'),value:that.basic.subject},
        {type:'Word600',title:i18n.t('customer.abnDescribe'),value:that.d2Description.description},
      ]
      if(requestMethod=='submit'){
        params.push(
          {type:'Empty',title:i18n.t('customer.abnDescribe'),value:that.d2Description.description},
          {type:'Empty',title:i18n.t('customer.auditor'),value:that.basic.auditorId},
        )
        if(that.basic.isInternal==1){
          params.push(
            {type:'Empty',title:i18n.t('customer.leader'),value:that.d1Team.leaderId},
            {type:'EmptyLength',title:i18n.t('customer.teamMember'),value:that.d1Team.members},
          )
        }
      }
      let state = true;
      for(let i in params){
        state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
          that.$Notice.warning({title:tips})
        })
        if(!state){
          return;
          break;
        }
      }
      let a=parseInt(that.basic.batchQuantity);
      let b=parseInt(that.basic.inspectionQuantity);
      let c=parseInt(that.basic.badQuantity);
      // if(b>a){
      //   that.$Notice.warning({title:'检验数不能大于批量数'});
      //   return;
      // }
      // if(c>b){
      //   that.$Notice.warning({title:'不良数不能大于检验数'});
      //   return;
      // }
      for(let i=0;i<that.defectRecords.table.data.length;i++){
        that.defectRecords.table.data[i].complaintId=that.complaintId;
        if(that.defectRecords.table.data[i].defectTypeId=='' || that.defectRecords.table.data[i].qualityLevelId==''  ||  that.defectRecords.table.data[i].defectLocationId==''|| that.defectRecords.table.data[i].sampleQuantity===''|| that.defectRecords.table.data[i].defectQuantity===''){
          // if(that.defectRecords.table.data[i].defectTypeId==='' && that.defectRecords.table.data[i].qualityLevelId===''  &&  that.defectRecords.table.data[i].defectLocationId===''&& that.defectRecords.table.data[i].sampleQuantity===''&& that.defectRecords.table.data[i].defectQuantity===''){
          //   that.$Notice.warning({title: '请删除空白缺陷记录'});
          //   return;
          // }else{
            that.$Notice.warning({title: i18n.t('customer.pleaseInput')+i18n.t('customer.defectRecord') +( i + 1 ) });
            return;
          // }
        }
        let paramsDefects = [
          {type: 'NumNot0', title: i18n.t('customer.sampleQuantity'), value: that.defectRecords.table.data[i].sampleQuantity},
          {type: 'Num', title: i18n.t('customer.defectNum'), value: that.defectRecords.table.data[i].defectQuantity},
        ]
        let state = true;
        for (let j in paramsDefects) {
          state = that.$iqis.utils.formValidate(paramsDefects[j].type, paramsDefects[j].title, paramsDefects[j].value, (tips) => {
            that.$Notice.warning({title: tips})//,duration: 0
          })
          if (!state) {
            return;
            break;
          }
        }
        if(that.defectRecords.table.data[i].defectLocationId==i18n.t('customer.null')){
          that.defectRecords.table.data[i].defectLocationId='';
        }
      }

      that.basic.creatorId = that.d2Description.operatorId;

      for(let i=0;i<that.defectRecords.table.data.length;i++){
          that.defectRecords.table.data[i].complaintId=that.complaintId;
      }

      let memberIds=[];
      for(let i in that.d1Team.members){
        memberIds.push(that.d1Team.members[i].memberId)
      }
      // if(memberIds.indexOf(that.d1Team.leaderId)==-1){
      //   that.$http.get('/tenant/user/'+that.d1Team.leaderId).then(function(resp){
      //     that.d1Team.members.push({memberId:that.d1Team.leaderId,memberName:resp.data.name})
      //     that.interface(requestMethod);
      //   })
      // }else{
          that.interface(requestMethod);
      // }
    },
    interface(requestMethod){
      let that = this;
      var newData={
        basic:that.basic,
        d1Team:that.d1Team,
        d2Description:that.d2Description,
        defectRecords:that.defectRecords.table.data
      };

      newData.basic.complaintDate=(new Date(newData.basic.complaintDate)).getTime();
      newData.basic.auditTime=(new Date(newData.basic.auditTime)).getTime();
      newData.basic.createTime=(new Date(newData.basic.createTime)).getTime();
      newData.d1Team.createTime=(new Date(newData.d1Team.createTime)).getTime();
      newData.d2Description.operateTime=(new Date(newData.d2Description.operateTime)).getTime();
      newData.basic.complaintState=0;

      if(requestMethod=='save'){
        // that.loadStat.saveLoading = true;
        // that.loadStat.complaintDataLoading = true;
        if(that.complaintId){//修改时保存
          that.$http.put('/customer/complaint/'+that.complaintId+'?type=save',newData,that.headers).then(function(resp){
            that.$Message.success(i18n.t('customer.editSuccess'));
            that.basic.complaintDate=new Date(that.basic.complaintDate);
            that.basic.auditTime=new Date(that.basic.auditTime);
            that.basic.createTime=new Date(that.basic.createTime);
            that.d1Team.createTime=new Date(that.d1Team.createTime);
            that.d2Description.operateTime=new Date(that.d2Description.operateTime);
            // that.loadStat.saveLoading = false;
            // that.loadStat.complaintDataLoading = false;
            for(let i = 0; i<that.defectRecords.table.data.length; i++){
              if(!that.defectRecords.table.data[i].defectLocationId){
                that.defectRecords.table.data[i].defectLocationId=i18n.t('customer.null');
              }
            }

          })
        }else{//添加时保存
          that.$http.post('/customer/complaint?type=save',newData,that.headers).then(function(resp){
            //console.log(resp.data);
            // that.loadStat.saveLoading = false;
            // that.loadStat.complaintDataLoading = false;

            that.$Message.success(i18n.t('customer.saveSuccess'));
            that.closePage();
            that.$emit("open-tab","customer-customer-complaint-edit-"+resp.data.basic.complaintId,i18n.t('customer.editComplaint'),"page-customer-complaint-add",{complaintId:resp.data.basic.complaintId});
            for(let i = 0; i<that.defectRecords.table.data.length; i++){
              if(!that.defectRecords.table.data[i].defectLocationId){
                that.defectRecords.table.data[i].defectLocationId=i18n.t('customer.null');
              }
            }
          })
        }
      }else if(requestMethod=='submit'){//修改时提交
        // that.loadStat.submitLoading = true;
        // that.loadStat.complaintDataLoading = true;
        if(that.complaintId){
          that.$http.put('/customer/complaint/'+that.complaintId+'?type=submit',newData,that.headers).then(function(resp){
            that.$http.post('/customer/complaint/apply?complaintId='+that.complaintId).then(function(resp){
              // that.loadStat.submitLoading = false;
              // that.loadStat.complaintDataLoading = false;
              that.$Message.success(i18n.t('customer.commitSuccess'));
              that.closePage();
            })
          })
        }else{
          that.$http.post('/customer/complaint?type=submit',newData,that.headers).then(function(resp){//添加时提交
            let complaintId=resp.data.basic.complaintId;
            that.$http.post('/customer/complaint/apply?complaintId='+complaintId).then(function(resp){
              // that.loadStat.submitLoading = false;
              // that.loadStat.complaintDataLoading = false;
              that.$Message.success(i18n.t('customer.commitSuccess'));
              that.closePage();
            })
          })
        }
      }
    },
    auditPass(requestMethod){//审核通过/审核驳回
      let that =this;
      //console.log(requestMethod)
      that.$http.post('/customer/complaint/audit?complaintId='+that.complaintId+'&checked='+requestMethod).then(function(resp){
        if(requestMethod==1){
          that.$Message.success(i18n.t('customer.auditSuccess'))
          that.closePage();
        }else{
          that.$Message.success(i18n.t('customer.auditSuccess'))
          that.closePage();
        }
      })
    },
    saveReply(requestMethod){//待回复
      let that = this;

      if(requestMethod=='return'){
        // that.loadStat.complaintDataLoading = true;
        // that.loadStat.saveLoading = true;
        that.$http.post('/customer/complaint/reject?complaintId='+that.complaintId).then(function(resp){
          that.$Message.success(i18n.t('customer.backSuccess'));
          // that.loadStat.complaintDataLoading = false;
          // that.loadStat.saveLoading = false;
          that.closePage();
        })
      }else if(requestMethod=='submit'){
        // if(that.basic.productId==null){
        //   that.$Notice.warning({title:'产品编号不能为空'});
        //   return;
        // }
        // if(that.d1Team.leaderId==null){
        //   that.$Notice.warning({title:'小组组长不能为空'});
        //   return;
        // }
        // if(that.d1Team.members==''){
        //   that.$Notice.warning({title:'小组成员不能为空'});
        //   return;
        // }
        let params = [
          {type:'Empty',title:i18n.t('customer.productNo'),value:that.basic.productId},
          {type:'Empty',title:i18n.t('customer.leader'),value:that.d1Team.leaderId},
          {type:'EmptyLength',title:i18n.t('customer.teamMember'),value:that.d1Team.members}
        ]
        let state = true;      
        for(let i in params){
          state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
            that.$Notice.warning({title:tips})
          })
          if(!state){
            return;
            break;
          }
        }
        let memberIds=[];
        for(let i in that.d1Team.members){
          memberIds.push(that.d1Team.members[i].memberId)
        }
        if(memberIds.indexOf(that.d1Team.leaderId)==-1){
          that.$http.get('/tenant/user/'+that.d1Team.leaderId).then(function(resp){
            that.d1Team.members.push({memberId:that.d1Team.leaderId,memberName:resp.data.name})
            that.interface2(requestMethod);
          })
        }else{
          that.interface2(requestMethod);
        }
      }
    },
    interface2(){
      let that = this;
      // that.loadStat.complaintDataLoading = true;
      // that.loadStat.submitLoading = true;
      var newData={
        basic:that.basic,
        d1Team:that.d1Team,
        d2Description:that.d2Description,
        defectRecords:that.defectRecords.table.data
      };
      that.$http.put('/customer/complaint/'+that.complaintId,newData,that.headers).then(function(resp){
        // that.loadStat.submitLoading = false;
        // that.loadStat.complaintDataLoading = false;
        that.$Message.success(i18n.t('customer.commitSuccess'))
        that.closePage();
      })
    },
    saveHandle(requestMethod){//处理中/处理保存/处理提交
      let that=this;
      let params = [
        {type:'Word600',title:'D3-'+i18n.t('customer.shortPolicy'),value:that.d3Contain.policy},
        {type:'Word20',title:'D3-'+i18n.t('customer.handleMethod'),value:that.d3Contain.treatmentMethod},
        {type:'Word600',title:'D4-'+i18n.t('customer.causeIdentify'),value:that.d4Cause.causeIdentify},
        {type:'Word600',title:'D5-'+i18n.t('customer.longPolicy'),value:that.d5Plan.policy},
        {type:'Word20',title:'D5-'+i18n.t('customer.handleMethod'),value:that.d5Plan.treatmentMethod},
        {type:'Word600',title:'D6-'+i18n.t('customer.effect'),value:that.d6Effect.effect},
        {type:'Word20',title:'D6-'+i18n.t('customer.verificationMethod'),value:that.d6Effect.verificationMethod},
        {type:'Word600',title:'D6-'+i18n.t('customer.preventive'),value:that.d7Prevention.preventive},
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
      for(let i=0;i<that.defectRecords.table.data.length;i++){
        if(that.defectRecords.table.data[i].defectLocationId==i18n.t('customer.null')){
          that.defectRecords.table.data[i].defectLocationId='';
        }
      }
      // that.loadStat.complaintDataLoading = true;

      var newData={
        basic:that.basic,
        d1Team:that.d1Team,
        d2Description:that.d2Description,
        defectRecords:that.defectRecords.table.data,
        d3Contain:that.d3Contain,
        d4Cause:that.d4Cause,
        d5Plan:that.d5Plan,
        d6Effect:that.d6Effect,
        d7Prevention:that.d7Prevention
      };
      newData.basic.complaintDate=(new Date(newData.basic.complaintDate)).getTime();
      newData.basic.auditTime=(new Date(newData.basic.auditTime)).getTime();
      newData.basic.createTime=(new Date(newData.basic.createTime)).getTime();
      newData.d1Team.createTime=(new Date(newData.d1Team.createTime)).getTime();
      newData.d2Description.operateTime=(new Date(newData.d2Description.operateTime)).getTime();
      newData.d3Contain.operateTime=(new Date(newData.d3Contain.operateTime)).getTime();
      newData.d4Cause.operateTime=(new Date(newData.d4Cause.operateTime)).getTime();
      newData.d5Plan.operateTime=(new Date(newData.d5Plan.operateTime)).getTime();
      newData.d6Effect.operateTime=(new Date(newData.d6Effect.operateTime)).getTime();
      newData.d7Prevention.operateTime=(new Date(newData.d7Prevention.operateTime)).getTime();
      // newData.basic.complaintState=4;
      if(requestMethod=='save'){
        if(newData.basic.abnormalState!=0){
          let d3File = this.$refs.d3Upload.myUploadList
          let d3Arr = [];
          for(var i = 0;i<d3File.length;i++){
            let fileObj = {'url':d3File[i].url,'mime':d3File[i].url.substring(d3File[i].url.lastIndexOf(".")+1,d3File[i].url.length),'name':d3File[i].url.substring(d3File[i].url.lastIndexOf("/")+1,d3File[i].url.length)}
            d3Arr.push(fileObj)
          }
          that.d3Contain.attachments=d3Arr

          let d4File = this.$refs.d4Upload.myUploadList
          let d4Arr = [];
          for(var i = 0;i<d4File.length;i++){
            let fileObj = {'url':d4File[i].url,'mime':d4File[i].url.substring(d4File[i].url.lastIndexOf(".")+1,d4File[i].url.length),'name':d4File[i].url.substring(d4File[i].url.lastIndexOf("/")+1,d4File[i].url.length)}
            d4Arr.push(fileObj)
          }
          that.d4Cause.attachments=d4Arr

          let d5File = this.$refs.d5Upload.myUploadList
          let d5Arr = [];
          for(var i = 0;i<d5File.length;i++){
            let fileObj = {'url':d5File[i].url,'mime':d5File[i].url.substring(d5File[i].url.lastIndexOf(".")+1,d5File[i].url.length),'name':d5File[i].url.substring(d5File[i].url.lastIndexOf("/")+1,d5File[i].url.length)}
            d5Arr.push(fileObj)
          }
          that.d5Plan.attachments=d5Arr

          let d6File = this.$refs.d6Upload.myUploadList
          let d6Arr = [];
          for(var i = 0;i<d6File.length;i++){
            let fileObj = {'url':d6File[i].url,'mime':d6File[i].url.substring(d6File[i].url.lastIndexOf(".")+1,d6File[i].url.length),'name':d6File[i].url.substring(d6File[i].url.lastIndexOf("/")+1,d6File[i].url.length)}
            d6Arr.push(fileObj)
          }
          that.d6Effect.attachments=d6Arr

          let d7File = this.$refs.d7Upload.myUploadList
          let d7Arr = [];
          for(var i = 0;i<d7File.length;i++){
            let fileObj = {'url':d7File[i].url,'mime':d7File[i].url.substring(d7File[i].url.lastIndexOf(".")+1,d7File[i].url.length),'name':d7File[i].url.substring(d7File[i].url.lastIndexOf("/")+1,d7File[i].url.length)}
            d7Arr.push(fileObj)
          }
          that.d7Prevention.attachments=d7Arr
        }
        // that.loadStat.saveLoading = true;
        that.ifNull();
        that.spinShow=false;
        that.$http.put('/customer/complaint/'+that.complaintId,newData,that.headers).then(function(resp){
          // that.loadStat.saveLoading = false;
          // that.loadStat.complaintDataLoading = false;

          that.$Message.success(i18n.t('customer.saveSuccess'));
          that.basic.complaintDate=new Date(that.basic.complaintDate);
          that.basic.auditTime=new Date(that.basic.auditTime);
          that.basic.createTime=new Date(that.basic.createTime);
          that.d1Team.createTime=new Date(that.d1Team.createTime);
          that.d2Description.operateTime=new Date(that.d2Description.operateTime);
          that.d3Contain.operateTime=new Date(that.d3Contain.operateTime);
          that.d4Cause.operateTime=new Date(that.d4Cause.operateTime);
          that.d5Plan.operateTime=new Date(that.d5Plan.operateTime);
          that.d6Effect.operateTime=new Date(that.d6Effect.operateTime);
          that.d7Prevention.operateTime=new Date(that.d7Prevention.operateTime);

          that.refreshData();
        })
      }else if(requestMethod=='submit'){//提交给结案人
        // that.loadStat.submitLoading = true;
        that.$http.put('/customer/complaint/'+that.complaintId,newData,that.headers).then(function(resp){
          that.$http.post('/customer/complaint/apply-complete?complaintId='+that.complaintId).then(function(resp){
          // that.loadStat.submitLoading = false;
          // that.loadStat.complaintDataLoading = false;
            that.$Message.success(i18n.t('customer.commitSuccess'));
            that.closePage();
          })
        })
      }else if(requestMethod=='toCustomer'){
        that.loadStat.submitLoading = true;
        that.$http.put('/customer/complaint/'+that.complaintId,newData,that.headers).then(function(resp){
          that.$http.post('/customer/complaint/reply?complaintId='+that.complaintId).then(function(resp){//提交给客户
            // that.loadStat.submitLoading = false;
            // that.loadStat.complaintDataLoading = false;

            that.$Message.success(i18n.t('customer.commitSuccess'));
            that.closePage();
          })
        })
      }
    },
    endComplain(){//结案
      let that =this ;
      let params = [
        {type:'Empty',title:i18n.t('customer.opinion'),value:that.d8Congratulation.opinion},
        {type:'Word600',title:i18n.t('customer.opinion'),value:that.d8Congratulation.opinion},
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
      // that.loadStat.submitLoading = true;
      // that.loadStat.complaintDataLoading = true;

      that.d8Congratulation.operateTime=(new Date(that.d8Congratulation.operateTime)).getTime();
      that.d8Congratulation["closeState"]=1;
      that.$http.post('/customer/complaint/complete?complaintId='+that.complaintId,that.d8Congratulation,that.headers).then(function(resp){
        // that.loadStat.submitLoading = false;
        // that.loadStat.complaintDataLoading = false;

        that.d8Congratulation.operateTime=new Date(that.d8Congratulation.operateTime);
        that.$Message.success(i18n.t("customer.endSuccess"));
        that.closePage();
      })
    },
    closePage(){
      this.$emit("close-tab",this.$props.tabKey);
    },
    // 缺陷部分-----------------------------------------------------
    getDefectData(){//获取缺陷记录
      let that=this;
      that.getDefectTypeData();
      that.getDefectGradeData();
      that.getDefectPositionData();

      that.defectRecords.table.loading=false;
    },
    getDefectTypeData(){//获取缺陷数据
      let that=this;
      let idValueMap = [];
      let url="/basic/defecttype?page=1&limit=9999"
      that.$http.get(url).then((res)=>{
        let urlProduct=res.data;
        that.defectRecords.prodBatch.DefectName=res.data;
      })
    },
    onDefectTypeSelectChange(obj,index){
      let that=this;
      for(let x in that.defectRecords.prodBatch.DefectName){
        if(obj==that.defectRecords.prodBatch.DefectName[x].defectTypeId){
          that.defectRecords.table.data[index].inspectionTypeId=that.defectRecords.prodBatch.DefectName[x].inspectionTypeId;//检验项目
          that.defectRecords.table.data[index].inspectionTypeName=that.defectRecords.prodBatch.DefectName[x].inspectionTypeName;//检验项目
          that.defectRecords.table.data[index].qualityLevelId=that.defectRecords.prodBatch.DefectName[x].qltyLvId;//缺陷等级          that.getDefectGradeData(that.defectRecords.prodBatch.DefectName[x].qltyLvId,index)
        }
      }
    },
    defectRate(obj1,obj2,index){
      let that=this;
      if(obj1!=''&& obj2!=''){
        // let x=obj1/obj2*100;
        // x = x.toFixed(2);
        let x=obj1/obj2*100;
        if(x > 100){
         that.defectRecords.table.data[index].defectRate= '100%'
        }else{

          x = Math.floor(x * 100) / 100;
          that.defectRecords.table.data[index].defectRate=x+'%';
        }

      }
    },
    getDefectGradeData(Lvid,index){//缺陷等级
      let that=this;
      let idValueMap = [];
      let url="/basic/qltylv?page=1&limit=99999"
      that.$http.get(url).then((res)=>{
        let urlProduct=res.data
        that.defectRecords.prodBatch.DefectGrade=urlProduct;
        for(let x in that.defectRecords.prodBatch.DefectGrade){
          if(Lvid==that.defectRecords.prodBatch.DefectGrade[x].qltyLvId){
            that.defectRecords.table.data[index].qualityLevelName=that.defectRecords.prodBatch.DefectGrade[x].name;
          }
        }
      })
    },
    getDefectPositionData(){//缺陷位置
      let that=this;
      let url="/basic/defectloc?page=1&limit=99999"
      that.$http.get(url).then((res)=>{
        that.defectRecords.prodBatch.DefectPosition=res.data
        that.defectRecords.prodBatch.DefectPosition.unshift({defectLocId:i18n.t('customer.null'),name:i18n.t('customer.null')});
      })
    },
    addDefect(){//添加缺陷
      let that=this;
      let obj = JSON.parse(JSON.stringify(that.defectRecords.discountData.tableData))
      that.defectRecords.table.data.push(obj)
      let index=that.defectRecords.table.data.length
      that.defectRecords.table.data[index-1].defectNumber=index-1
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((index-5)*43);
        $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');

      })
    },
    deleteDefect(){//删除缺陷
      let that = this;
      let ss = this.$refs.defectTable.getSelection();
      for(let i=0;i<that.defectRecords.table.data.length;i++){
        for(let j=0;j<ss.length;j++){
          if(that.defectRecords.table.data[i].defectNumber===ss[j].defectNumber){
              that.defectRecords.table.data.splice(i,1)
          }
        }
      }
    },
    maxNum(){
      let that = this;

    },
    confirm(requestMethod,step){
      let that=this;
      let contentText='';
      if(requestMethod=='submit'){
        contentText=i18n.t('customer.sureSubmit')
      }
      if(requestMethod=='audit'){
        contentText=i18n.t('customer.sureAudit')
      }
      if(requestMethod=='end'){
        contentText=i18n.t('customer.sureEnd')
      }
      if(requestMethod=='back'){
        contentText=i18n.t('customer.endBack')
      }
      this.$Modal.confirm({
          title: i18n.t("customer.prompt"),
          content: contentText,
          loading:true,
          onOk: () => {
              this.remove()
              if(step=='addComplain'){
                that.addComplain('submit');
              }
              if(step=='auditPass'){
                that.auditPass(1);
              }
              if(step=='saveHandle'){
                that.saveHandle('submit');
              }
              if(step=='saveHandleToCustomer'){
                that.saveHandle('toCustomer');
              }
              if(step=='endComplain'){
                that.endComplain();
              }
              if(step=='backToSupplier'){
                that.backToSupplier();
              }
              if(step=='saveReplyReturn'){
                that.saveReply('return');
              }
              if(step=='saveReplySubmit'){
                that.saveReply('submit')
              }
          },
          onCancel: () => {
              // this.$Message.info('Clicked cancel');
          }
      });
    },
    getTableLength(){
      let that = this;
      let ss = this.$refs.defectTable.getSelection();
      that.TableLength=ss.length;
    },
    //解决弹出框中的确认按钮在快速点击的情况下执行多次的问题
      remove(){
        setTimeout(() => {
          this.$Modal.remove()
        }, 100);
      },

  },
  computed:{
    badRate(){//不良率
      if(this.basic.badQuantity!==''&&this.basic.inspectionQuantity!==''){
        let x=this.basic.badQuantity/this.basic.inspectionQuantity*100;
        if(x > 100){
          x = 100
          return x;
        }else{
          x = Math.floor(x * 100) / 100;
          return x;
        }

      }else{
        return 0.00;
      }
    },
    picBtnShow(){
      if(!this.d2Description.disabled&&!this.noPermsDis){
        return true
      }else{
        return false
      }
    }
  },
  watch:{
    "picBtnShow":function(flag){
      if(!flag){
        $('.defectTable').addClass('picBtnHide')
      }else{
        $('.defectTable').removeClass('picBtnHide')
      }
    }
  }
}
</script>
<style>
.titleSmall{color:#418FEE;font-size:16px;}
.blockSmall{margin-bottom:30px;border-bottom:1px dashed #ddd;padding-bottom:20px;}
.noBorder .ivu-select-selection,
.noBorder .ivu-select:focus .ivu-select-selection,
.noBorder .ivu-input
{
  border:0!important;
  border-color:transparent!important;
  box-shadow:0 none!important;
  outline: none!important;
}
.basicList{
  padding:24px;
  background:#FAFAFA;
  margin-top:15px;
}
.basicList p{
  padding:0;
  margin-top:14px;
  font-size: 14px;
  color: #262626;
}
.basicList p:first-child{
  margin-top: 0;
}
.ivu-input-group-append{
  background:#fff!important;
}
.ivu-poptip-confirm .ivu-poptip-body .ivu-icon{
  left: 16px;
}
</style>
