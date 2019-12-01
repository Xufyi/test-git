<template>
  <div class="iqis-page">

    <!-- 第一部分-基本资料 -->
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t('iqc.basicInfo')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25" style="margin-top:15px;">
          <i-col span="6">
            <div class="iqis-page-block-ctrl">
              <DatePicker :clearable="false" :disabled="basic.disabled||noPermsDis" v-model="basic.abnormalDate" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <Checkbox class="isFatal" :disabled="basic.disabled||noPermsDis" v-model="basic.isFatalSelect" @on-change="basic.isFatal=basic.isFatalSelect?1:0">{{$t('iqc.setMainAbn')}}</Checkbox>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('iqc.abnNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="basic.abnormalNo" :disabled="basic.disabled||noPermsDis"></i-input>
            </div>
          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('iqc.iqcNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="basic.disabled||noPermsDis" v-model="basic.qcNo" filterable @on-change="getProductData();getDefectRecord(basic.qcNo)" :placeholder="i18n.t('iqc.null')">
                <Option value="">{{$t('iqc.null')}}</Option>
                <Option v-for="data in qcnoList" :key="data.iqcNo" :value="data.iqcNo">{{data.iqcNo}}</Option>
              </Select>
            </div>

          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('iqc.productBatch')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" v-if='!basic.disabled && !qcNoDisabled' :disabled="basic.disabled || qcNoDisabled||noPermsDis" v-model="basic.batchNo" filterable>
                <Option v-for="(items,index) in qcnoList" :value="items.batch" :key="index" >{{ items.batch}}</Option>
              </Select>
              <i-input  v-if='basic.disabled || qcNoDisabled' v-model="basic.batchNo" disabled style="width: 100%;"></i-input>

            </div>

          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('iqc.place')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="basic.disabled||noPermsDis" v-model="basic.abnormalPlace" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">

          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('iqc.productNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :label="basic.productNo" filterable remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pleaseChoose')" v-if='!basic.disabled && !qcNoDisabled' :disabled="basic.disabled || qcNoDisabled||noPermsDis" v-model="basic.productId" @on-change="getProductName(basic.productId)">
                <Option v-for="(data,index) in productList" :key="index" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select>
              <i-input  v-if='basic.disabled || qcNoDisabled' v-model="basic.productNo" disabled style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('iqc.productName')}}</div>
            <div class="iqis-page-block-ctrl">

              <i-input disabled v-model="basic.productName" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('iqc.supplier')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select  :placeholder="i18n.t('pleaseChoose')" :disabled="basic.disabled|| qcNoDisabled||noPermsDis" v-model="basic.supplierId" filterable>
                <Option v-for="data in supplierList" :key="data.manufacturerId" :value="data.manufacturerId">{{data.manufacturerAbbreviation}}</Option>
              </Select>
            </div>

          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('iqc.customer')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="basic.disabled||noPermsDis" v-model="basic.customerId" filterable> <!-- @on-change="getName(basic.customerId)" -->
                <Option v-for="data in customerList" :key="data.customerId" :value="data.customerId">{{data.customerAbbreviation}}</Option>
              </Select>
            </div>
          </i-col>

        </Row>
        <Row :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('iqc.batchNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <InputNumber :disabled="basic.disabled" v-model="basic.batchQuantity" placeholder="" style="width: 100%;" :min="0">
              </InputNumber> -->
              <i-input :disabled="basic.disabled|| qcNoDisabled||noPermsDis" v-model="basic.batchQuantity" placeholder="" style="width: 100%;">
                <span slot="append">{{basic.productUnitName}}</span>
              </i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('iqc.qcNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="basic.disabled|| qcNoDisabled||noPermsDis" v-model="basic.sampleQuantity" placeholder="" style="width: 100%;">
                <span slot="append">{{basic.productUnitName}}</span>
              </i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('iqc.badNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="basic.disabled|| qcNoDisabled||noPermsDis" v-model="basic.badQuantity" placeholder="" style="width: 100%;">
                <span slot="append">{{basic.productUnitName}}</span>
              </i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('iqc.badRate')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="badRate" placeholder="" style="width: 100%;">
                <span slot="append">%</span>
              </i-input>
            </div>
          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('iqc.treatmentMethod')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="basic.disabled||noPermsDis" v-model="basic.treatmentMethod" filterable>
                <Option v-for="(method,index) in treatmentMethods" :key="method.value" :value="method.value">{{method.label}}</Option>
                <!-- <Option v-for="method in treatmentMethods" :key="method.value" :value="method.value">{{method.label}}</Option> -->
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('iqc.treatmentLimit')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="basic.disabled||noPermsDis" v-model="basic.treatmentTimeLimit" filterable>
                <Option v-for="time in treatmentTimeLimits" :key="time" :value="time">{{time}}H</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="12">
            <div class="iqis-page-block-label">{{$t('iqc.theme')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="basic.disabled||noPermsDis" v-model="basic.subject" placeholder="" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div>
    <div class="iqis-page-block">
      <div class="iqis-page-block-title" style="margin-bottom:15px;">
        {{$t('iqc.treatmentRecord')}}
      </div>
      <div class="iqis-page-block-body">
        <div class="blockSmall">
          <div class="titleSmall">{{$t('iqc.D1')}}</div>
          <div class="iqis-page-block-tools">
            <div class="iqis-page-block-tools-primary">
              <div class="iqis-page-block-label">{{$t('iqc.defectTable')}}</div>
            </div>
            <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
              <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('iqc.changed')}} <span style="color:#1b75ea">{{TableLength}}</span> {{$t('iqc.defects')}}</span>
              <Button v-if="!d2Description.disabled" :disabled="noPermsDis" type="ghost" icon="trash-a" @click="deleteDefect">{{$t('iqc.delete')}}</Button>
            </div>
          </div>
          <Table  :no-data-text="i18n.t('noData')" class="noBorder noHeight location defectTable" ref="defectTable" :loading="defectRecords.table.loading" @on-selection-change="getTableLength" v-drag-table-column="defectRecords.table.columns" border stripe :columns="defectRecords.table.columns" :data="defectRecords.table.data">
            <Button :disabled="noPermsDis" class="iqis-table-footer-btn" icon="plus" v-if="!d2Description.disabled" slot="footer" type="dashed" style="width:100%;margin: 16px;font-size:14px;" @click="addDefect">{{$t('iqc.addDefect')}}</Button>
          </Table>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('iqc.abnDescribe')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input :disabled="d2Description.disabled||noPermsDis" type="textarea" style="width:100%" v-model="d2Description.description"></i-input>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('iqc.auditor')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" :disabled="d2Description.disabled||noPermsDis" v-model="basic.auditorId" filterable>
                  <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6"><!-- v-if="auditTimeShow"-->
              <div class="iqis-page-block-label">{{$t('iqc.auditTime')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :clearable="false" disabled v-model="basic.auditTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
                
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('iqc.describeUser')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" :disabled="d2Description.disabled||noPermsDis" v-model="d2Description.operatorId" filterable>
                  <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('iqc.time')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :clearable="false" :disabled="d2Description.disabled||noPermsDis" v-model="d2Description.operateTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
        </div>
        <div class="blockSmall" v-if="d1TeamShow">
          <div class="titleSmall">{{$t('iqc.D2')}}</div>
          <Row :gutter="25">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('iqc.leader')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-if="basic.isInternal==1" :disabled="d1Team.disabled||noPermsDis" v-model="d1Team.leaderId" filterable>
                  <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
                <i-input v-if="basic.isInternal==0" :disabled="d1Team.disabled||noPermsDis" style="width:100%" v-model="d1Team.leaderName"></i-input>
                
              </div>
            </i-col>
            <i-col span="6" offset="6">
              <div class="iqis-page-block-label">{{$t('iqc.teamCreator')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-if="basic.isInternal==1" :disabled="d1Team.disabled||noPermsDis" v-model="d1Team.creatorId" filterable>
                  <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
                <i-input v-if="basic.isInternal==0" :disabled="d1Team.disabled||noPermsDis" style="width:100%" v-model="d1Team.creatorName"></i-input>
                
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('iqc.time')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :disabled="d1Team.disabled||noPermsDis" :clearable="false" v-model="d1Team.createTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('iqc.teamMember')}}</div>
              <div class="iqis-page-block-ctrl">
                <Button :disabled="d1Team.disabled||noPermsDis" type="primary" icon="person-stalker" v-if="d1memberBtnShow&&!d1Team.disabled" @click="d1memberInputShow=true;d1memberBtnShow=false;d1memberInputValue='';">{{$t('iqc.addMoreMember')}}</Button>
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
            <div class="titleSmall">{{$t('iqc.D3')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('iqc.shortPolicy')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d3Contain.policy" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('iqc.handleMethod')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input autocomplete="on" :disabled="DisciplineHandle.disabled||noPermsDis" style="width:100%" v-model="d3Contain.treatmentMethod"></i-input>
                </div>
              </i-col>
              <i-col span="6" offset="6">
                <div class="iqis-page-block-label">{{$t('iqc.peopleInCharge')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-if="basic.isInternal==1" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d3Contain.operatorId" filterable>
                    <Option v-for="data in memberList" :key="data.memberId" :value="data.memberId">{{data.memberName}}</Option>
                  </Select>
                  <i-input v-if="basic.isInternal==0" :disabled="DisciplineHandle.disabled||noPermsDis" style="width:100%" v-model="d3Contain.operatorName"></i-input>


                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('iqc.time')}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable="false" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d3Contain.operateTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('iqc.addAttachments')}}</div>
                <Spin size="large"  v-if="spinShow" style="text-align:left">
                  <div class="iqis-page-block-ctrl">
                    <IqisUpload ref="d3Upload" :edit="!DisciplineHandle.disabled&&!noPermsDis" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d3Contain.attachments' :chartTypeShow="false">
                    </IqisUpload>
                  </div>
                </Spin>
              </i-col>
            </Row>
          </div>

          <div class="blockSmall">
            <div class="titleSmall">{{$t('iqc.D4')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('iqc.causeIdentify')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d4Cause.causeIdentify" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('iqc.abnormalCause')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-if="basic.isInternal==1" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d4Cause.abnormalCauseId" filterable>
                    <Option v-for="data in abnormalReason" :key="data.abnormalId" :value="data.abnormalId" >{{data.name}}</Option>
                  </Select>
                  <i-input v-if="basic.isInternal==0" :disabled="DisciplineHandle.disabled||noPermsDis" style="width:100%" v-model="d4Cause.abnormalCauseName"></i-input>
                </div>
              </i-col>
              <i-col span="6" offset="6">
                <div class="iqis-page-block-label">{{$t('iqc.peopleInCharge')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-if="basic.isInternal==1" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d4Cause.operatorId" filterable>
                    <Option v-for="data in memberList" :key="data.memberId" :value="data.memberId">{{data.memberName}}</Option>
                  </Select>
                  <i-input v-if="basic.isInternal==0" :disabled="DisciplineHandle.disabled||noPermsDis" style="width:100%" v-model="d4Cause.operatorName"></i-input>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('iqc.time')}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable="false" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d4Cause.operateTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('iqc.addAttachments')}}</div>
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
            <div class="titleSmall">{{$t('iqc.D5')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('iqc.longPolicy')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d5Plan.policy" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('iqc.handleMethod')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" style="width:100%" v-model="d5Plan.treatmentMethod"></i-input>
                </div>
              </i-col>
              <i-col span="6" offset="6">
                <div class="iqis-page-block-label">{{$t('iqc.peopleInCharge')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-if="basic.isInternal==1" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d5Plan.operatorId" filterable>
                    <Option v-for="data in memberList" :key="data.memberId" :value="data.memberId">{{data.memberName}}</Option>
                  </Select>
                  <i-input v-if="basic.isInternal==0" :disabled="DisciplineHandle.disabled||noPermsDis" style="width:100%" v-model="d5Plan.operatorName"></i-input>

                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('iqc.time')}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable="false" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d5Plan.operateTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('iqc.addAttachments')}}</div>
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
            <div class="titleSmall">{{$t('iqc.D6')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('iqc.effect')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d6Effect.effect" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('iqc.verificationMethod')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" style="width:100%" v-model="d6Effect.verificationMethod"></i-input>
                </div>
              </i-col>
              <i-col span="6" offset="6">
                <div class="iqis-page-block-label">{{$t('iqc.verifier')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-if="basic.isInternal==1" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d6Effect.operatorId" filterable>
                    <Option v-for="data in memberList" :key="data.memberId" :value="data.memberId">{{data.memberName}}</Option>
                  </Select>
                  <i-input v-if="basic.isInternal==0" :disabled="DisciplineHandle.disabled||noPermsDis" style="width:100%" v-model="d6Effect.operatorName"></i-input>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('iqc.time')}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable="false" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d6Effect.operateTime" type="datetime" format="yyyy-MM-dd HH:mm" style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('iqc.addAttachments')}}</div>
                <Spin size="large"  v-if="spinShow" style="text-align:left">
                  <div class="iqis-page-block-ctrl">
                    <IqisUpload ref="d6Upload" :edit="!DisciplineHandle.disabled&&!noPermsDis" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d6Effect.attachments' :chartTypeShow="false">
                    </IqisUpload>
                  </div>
                </Spin>
              </i-col>
            </Row>

          </div>

          <div class="blockSmall">
            <div class="titleSmall">{{$t('iqc.D7')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('iqc.preventive')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d7Prevention.preventive" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="12">
                <div class="iqis-page-block-label">{{$t('iqc.addAttachments')}}</div>
                <Spin size="large"  v-if="spinShow" style="text-align:left">
                  <div class="iqis-page-block-ctrl">
                    <IqisUpload ref="d7Upload" :edit="!DisciplineHandle.disabled&&!noPermsDis" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d7Prevention.attachments' :chartTypeShow="false">
                    </IqisUpload>
                  </div>
                </Spin>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('iqc.peopleInCharge')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-if="basic.isInternal==1" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d7Prevention.operatorId" filterable>
                    <Option v-for="data in memberList" :key="data.memberId" :value="data.memberId">{{data.memberName}}</Option>
                  </Select>
                  <i-input v-if="basic.isInternal==0" :disabled="DisciplineHandle.disabled||noPermsDis" style="width:100%" v-model="d7Prevention.operatorName"></i-input>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('iqc.time')}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable="false" :disabled="DisciplineHandle.disabled||noPermsDis" v-model="d7Prevention.operateTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>

          </div>

        </div>
        <div class="blockSmall" v-if="d8Congratulation.show">
            <div class="titleSmall">{{$t('iqc.D8')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('iqc.opinion')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="d8Congratulation.disabled||noPermsDis" type="textarea" v-model="d8Congratulation.opinion" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('iqc.shareMembers')}}</div>
              <div class="iqis-page-block-ctrl">
                <Button :disabled="d8Congratulation.disabled||noPermsDis" type="primary" icon="share" v-if="d8memberBtnShow&&!d8Congratulation.disabled" @click="d8memberInputShow=true;d8memberBtnShow=false;d8memberInputValue='';">分享给更多成员</Button>
                <Select :placeholder="i18n.t('pleaseChoose')" style="width:146px" v-if="d8memberInputShow" v-model="d8Congratulation.memberId" @on-change="addMember(d8Congratulation.memberId,d8Congratulation.members)" filterable>
                    <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                  </Select>
                  <Tag :closable="!d8Congratulation.disabled||noPermsDis" v-for="(data,index) in d8Congratulation.members" type="dot" color="blue" :key="index" :name="index" @on-close="deleteMember(index,d8Congratulation.members)">{{data.memberName}}</Tag>
              </div>
            </i-col>
          </Row>
            <Row :gutter="25">
              <i-col span="6" offset="12">
                <div class="iqis-page-block-label">{{$t('iqc.endUser')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" :disabled="d8Congratulation.disabled||noPermsDis" v-model="d8Congratulation.operatorId" filterable>
                    <Option v-for="data in userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('iqc.endTime')}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable="false" :disabled="d8Congratulation.disabled||noPermsDis" v-model="d8Congratulation.operateTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>

          </div>

      </div>
    </div>

    <!--end blocks-->
    <div class="page-end" style="padding-bottom: 65px"></div>

    <IqisAffix placement="bottom" :offset="0" v-if="button.creator&&((!abnormalId&&permsBtn.INSERT_IQC_ABNORMAL)||(abnormalId&&permsBtn.UPDATE_IQC_ABNORMAL))">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <RadioGroup @on-change='changeInternal(basic.isInternal)' v-model="basic.isInternal">
          <Radio :label=0>{{$t('iqc.turnSupplier')}}</Radio>
          <Radio :label=1>{{$t('iqc.insideHandle')}}</Radio>
        </RadioGroup>
        <Button type="primary" v-if="permsBtn.UPDATE_IQC_ABNORMAL" @click="confirm('submit','addAbnormal')">{{$t('iqc.commit')}}</Button>
        <Button type="primary" @click="addAbnormal('save')">{{$t('iqc.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('iqc.cancel')}}</Button>
      </div>
    </IqisAffix>
    <IqisAffix placement="bottom" :offset="0" v-else-if="button.auditor&&permsBtn.UPDATE_IQC_ABNORMAL">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="confirm('audit','auditPass')">{{$t('iqc.auditPass')}}</Button>
        <Button type="ghost" @click="auditPass(0)">{{$t('iqc.auditReject')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('iqc.cancel')}}</Button>
      </div>
    </IqisAffix>
    <IqisAffix placement="bottom" :offset="0" v-else-if="button.handle&&permsBtn.UPDATE_IQC_ABNORMAL">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" v-if="submitHandleShow" @click="confirm('submit','saveHandle')">{{$t('iqc.submitEndPeople')}}</Button>
        <Button type="primary" @click="saveHandle('save')">{{$t('iqc.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('iqc.cancel')}}</Button>
      </div>
    </IqisAffix>
    <IqisAffix placement="bottom" :offset="0" v-else-if="button.end&&permsBtn.UPDATE_IQC_ABNORMAL">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="confirm('end','endAbnormal')">{{$t('iqc.end')}}</Button>
        <Button v-if="backTo" type="primary" @click="confirm('back','backToSupplier')">{{$t('iqc.backToSupplier')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('iqc.cancel')}}</Button>
      </div>
    </IqisAffix>
    <IqisAffix placement="bottom" :offset="0" v-else>
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="ghost" @click="closePage">{{$t('iqc.cancel')}}</Button>
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
      changeDefect:true,
      spinShow:false,
      loadStat:{
        selectsDataLoading:false,
        complaintDataLoading:false,
        saveLoading:false,
        submitLoading:false
      },
      selects:{
        defectTypeList:[],
        inspectionTypes:[],
      },
      headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
      abnormalId:'',
      userId:'',
      customerList:[],
      supplierList:[],
      userList:[],
      qcnoList:[],
      productList:[],
      abnormalReason:[],
      submitHandleShow:false,
      submitEndShow:false,
      d1memberBtnShow:true,
      d1memberInputShow:false,
      d1TeamShow:false,
      d8memberBtnShow:true,
      d8memberInputShow:false,
      // auditTimeShow:true,
      backTo:true,
      qcNoDisabled:false,
      TableLength:0,
      treatmentMethods:[
         {value:"REJECT",label:i18n.t('iqc.return')},
         {value:"REWORK",label:i18n.t('iqc.rework')},
         {value:"SCREEN",label:i18n.t('iqc.filter')},
         {value:"SPECIAL_ADOPTION",label:i18n.t('iqc.special')},
         {value:"EMERGENCY_RELEASE",label:i18n.t('iqc.release')},
         {value:"SCRAP",label:i18n.t('iqc.scrap')},
      ],
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
        auditState: 1,
        auditTime: null,
        auditorId: '',
        batchQuantity: '',
        sampleQuantity:'',
        badQuantity: '',
        batchNo: '',
        abnormalDate: new Date(),
        abnormalId: '',
        abnormalNo: '',
        abnormalPlace: '',
        // abnormalState: '',
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
        isInternal:0,
        productId: '',
        productNo: '',
        productName: '',
        productUnitName: '',
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
              maxWidth:40,
            },{
              title: i18n.t('iqc.no'),
              minWidth:30,
              maxWidth:30,
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm)
            },
            // {
            //   title: '检验项目',
            //   width:80,
            //   minWidth:80,
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
              title: i18n.t('iqc.project'),
              width:this.$store.state.locale=='zh_CN'?160:120,
              align: 'center',
              ellipsis:true,
              minWidth: this.$store.state.locale=='zh_CN'?160:120,
              key: 'inspectionTypeId',
              // render:vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(vm,(vm)=>{return vm.selects.inspectionTypes},"inspectionTypeId","name",null,this.getDefectNameList),
              render:
                (h, params)=>{
                  let ret =  vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(
                    vm,
                    (vm)=>{
                      return vm.selects.inspectionTypes
                    },
                    "inspectionTypeId",
                    "name",
                    null,
                    this.getDefectNameList,
                    vm.d2Description.disabled||vm.noPermsDis,
                  )
                  return ret(h,params);
                }
            },
            {
              title: i18n.t('iqc.defectName'),
              width:this.$store.state.locale=='zh_CN'?80:100,
              minWidth:this.$store.state.locale=='zh_CN'?80:100,
              key: 'defectTypeId',
              render: (h, params) => {
                let _this = this;
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
              }
            },{
              title: i18n.t('iqc.defectLevel'),
              width:this.$store.state.locale=='zh_CN'?80:100,
              minWidth:this.$store.state.locale=='zh_CN'?80:100,
              align: 'center',
              key: 'qualityLevelId',
              render: (h, params) => {
                let _this = this;
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
              }
            },{
              title: i18n.t('iqc.defectPosition'),
              align: 'center',
              width:100,
              minWidth:100,
              key: 'defectLocationId',
              render: (h, params) => {
                let _this = this;
                return h('Select',
                  {
                    props:{
                      value: this.defectRecords.table.data[params.index].defectLocationId,
                      disabled:this.d2Description.disabled||this.noPermsDis,
                      placeholder:i18n.t('iqc.null')
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
              }
            },{
              title: i18n.t('iqc.sampleQuantity'),
              width:this.$store.state.locale=='zh_CN'?80:120,
              minWidth:this.$store.state.locale=='zh_CN'?80:120,
              align: 'center',
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
              title: i18n.t('iqc.defectNum'),
              width:this.$store.state.locale=='zh_CN'?80:120,
              minWidth:this.$store.state.locale=='zh_CN'?80:120,
              align: 'center',
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
              title: i18n.t('iqc.defectRate'),
              width:80,
              minWidth:80,
              align: 'center',
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
              title: i18n.t('iqc.remarks'),
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
              title: i18n.t('iqc.pic'),
              align: 'center',
              key: 'attachments',
              minWidth: 250,
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
          ]
        },
        discountData:{
          rows:[{
          }],
          tableData:{
            defectLocationId: '',
            defectLocationName: '',
            defectQuantity: '',
            defectRate: '',
            defectRecordId:null,
            defectTypeId: '',
            defectTypeName: '',
            inspectionTypeId: '',
            inspectionTypeName: '',
            qualityLevelId: '',
            qualityLevelName: '',
            abnormalId: '',
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
        "abnormalId": '',
        "description": '',
        "disciplineId": '',
        "operateTime": new Date(),
        "operatorId": ''
      },
      "d1Team": {
        disabled:false,
        "abnormalId": '',
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
        "abnormalId": '',
        "disciplineId": '',
        "operateTime": '',
        "operatorId": '',
        "operatorName": '',
        "policy": '',
        "treatmentMethod": ''
      },
      "d4Cause": {
        "attachmentGroupId": '',
        "causeIdentify": '',
        "abnormalCauseId": '',
        "abnormalCauseName": '',
        "abnormalCauseTypeId": '',
        "abnormalCauseTypeName": '',
        "abnormalId": '',
        "disciplineId": '',
        "operateTime": '',
        "operatorId": '',
        "operatorName": ''
      },
      "d5Plan": {
        "attachmentId": '',
        "abnormalId": '',
        "disciplineId": '',
        "operateTime": '',
        "operatorId": '',
        "operatorName": '',
        "policy": '',
        "treatmentMethod": ''
      },
      "d6Effect": {
        "attachmentId": '',
        "abnormalId": '',
        "disciplineId": '',
        "effect": '',
        "operateTime": '',
        "operatorId": '',
        "operatorName": '',
        "verificationMethod": ''
      },
      "d7Prevention": {
        "attachmentId": '',
        "abnormalId": '',
        "disciplineId": '',
        "operateTime": '',
        "operatorId": '',
        "operatorName": '',
        "preventive": ''
      },
      "d8Congratulation": {
        "closeState": '',
        "abnormalId": '',
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
        "UPDATE_IQC_ABNORMAL",
        "INSERT_IQC_ABNORMAL"
      ],
      permsBtn:{
        "UPDATE_IQC_ABNORMAL":false,
        "INSERT_IQC_ABNORMAL":false,
      },
      noPermsDis:true,
      memberList:[],
      loadingRemote:false,
      source:null,//存放取消的请求方法
    }
  },

  created(){
    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.getInspectiontype();
    this.refreshData();
    
    
  },
  methods:{
    remoteMethod: _.debounce(function(query) {//debounce去抖
      let that = this;
      that.loadingRemote = true;
      // let fieldName = '';
      // if($("#selectNo").is(":focus")){
      //   fieldName='no'
      // }else{
      //   fieldName='name'
      // }
      if (query !== '') {
        that.cancelQuest();//在请求发出前取消上一次未完成的请求；
        //发送请求
        that.$nextTick(()=>{
          // let params ={}
          // params.page=1;
          // params.limit=999999;
          // params.examType=1;
          // params.useState=1;
          // params.fieldName='no&name';
          // params.query=query;
          that.$http.get('/basic/product/simple?page=1&limit=999999&examType=1&useState=1&fieldName=no,name&query='+query,{
            cancelToken: new this.$http.CancelToken(function executor(c) {
            that.source = c;
            })
          }).then(res =>{
            that.productList = res.data
            that.loadingRemote = false;
          })
          // .catch(err => {//此段供测试用
          //   if (this.$http.isCancel(err)) {
          //     //console.log('请求取消：'+err)
          //   } else {
          //     //console.log('请求失败：'+err)
          //   }
          // })
        })
      } else {
        that.productList = [];
        that.loadingRemote = false;
      }
    },500),
    cancelQuest(){
      if(typeof this.source ==='function'){
        this.source('终止请求'); //取消请求
      }
    },
    getInspectiontype(){//获取检验项目下拉框
      let that=this;
      let resp = that.$iqis.utils.syncget('/basic/inspectiontype?page=1&limit=99999');
      let root = {title:i18n.t('iqc.projectType'),selected: false,label:i18n.t('iqc.projectType'),value:0,expand:true};
      that.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
      that.selects.inspectionTypes = [root];
      // //console.log(that.selects.inspectionTypes,'检验项目数据')
    },
    getDefectNameList(val,key,index,o){//获取当前检验项目下的缺陷名称列表
    //console.log(val,key,index,o,'------------------------')
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

      let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+o.inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
      newRow['defectTypeList'] = resp ? resp.data||[]:[];
      that.defectRecords.table.data[index] = newRow;
      that.$set(that.defectRecords.table.data, index, newRow);
      return;
    },
    refreshData(){
      let that = this;
      that.loadStat.complaintDataLoading = true;
      let abnormalId = that.$props.params && that.$props.params.abnormalId;
      that.$http.all([
        that.$http.get("/bas/customerList",{params:{limit:99999999}}),
        that.$http.get("/bas/manufacturer/allManufacturer",{params:{limit:999999999}}),
        that.$http.get("/tenant/user",{params:{limit:999999999}}),
        // that.$http.get("/basic/product/simple",{params:{limit:999999999,examType:1, useState:1, page:1}}),
        that.$http.get("/examinecenter/iqc/iqc",{params:{limit:99999999,query:'result=0&state=1'}}),
        that.$http.get("/basic/abnormal",{params:{limit:999999999}}),
        that.$http.get("/examinecenter/iqc/iqc",{params:{limit:99999999,query:'result=0&state=2'}}),


      ]).then(function(resps){
        that.loadStat.complaintDataLoading = false;
        that.customerList = resps[0].data;
        that.supplierList = resps[1].data;
        that.userList = resps[2].data;
        // that.productList = resps[3].data;
        that.qcnoList = resps[3].data.concat(resps[5].data);
        that.abnormalReason = resps[4].data;

        that.$http.get('/tenant/user/profile').then(function(resp){
          that.userId=resp.data.userId;
          if(abnormalId){//修改
            that.abnormalId = abnormalId;
            that.changeDefect=false;
            that.getData();
          }else{//添加
            that.getDefectData();
            that.button.creator=true;
            that.d2Description.operatorId=that.userId;
            that.d1Team.creatorId=that.userId;
            // alert(that.d1Team.creatorId+'aaa')
            // alert(that.d2Description.operatorId+'bbb')
            that.loadStat.complaintDataLoading = false;
          }
          if(((!that.abnormalId&&that.permsBtn.INSERT_IQC_ABNORMAL)||(that.abnormalId&&that.permsBtn.UPDATE_IQC_ABNORMAL))){
            that.noPermsDis=false;
          }else{
            that.noPermsDis=true;
          }
          that.basic.qcNo=that.$props.params && that.$props.params.qcNo;

        })
      });
      // $('.ivu-table-header tr').append('<th rowspan="1" class=""></th>');
      
      


    },
    getData(){
      let that = this;
      that.$http.get('/examinecenter/iqc/abnormal/'+that.abnormalId).then(function(resp){
        //console.log(resp.data)
        that.loadStat.complaintDataLoading = false;
        let item=resp.data;
        // that.$iqis.utils.deepMerge(that.basic,item.basic);
        // that.$iqis.utils.deepMerge(that.d1Team,item.d1Team);
        // that.$iqis.utils.deepMerge(that.d8Congratulation,item.d8Congratulation);

        item.basic.abnormalDate=new Date(item.basic.abnormalDate);
        // //console.log(item.basic.auditTime,'审核{{$t('iqc.time')}}');
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
        // item.basic.isInternal=0;//假设是外部数据
        that.spinShow=false;
        that.basic=item.basic;
        that.d1Team=item.d1Team;
        that.d2Description=item.d2Description;
        that.defectRecords.table.data=item.defectRecords;
        if(that.defectRecords.table.data){
          for(let i in that.defectRecords.table.data){
            let inspectionTypeId = that.defectRecords.table.data[i].inspectionTypeId;
            let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
            let defectTypeList = resp ? resp.data||[] : [];
            that.defectRecords.table.data[i]['defectTypeList'] = defectTypeList;
            if(!that.defectRecords.table.data[i].defectLocationId){
              that.defectRecords.table.data[i].defectLocationId=i18n.t('iqc.null');
            }
            that.defectRecords.table.data[i]['defectNumber']=i
          }
        }
        for(var i = 0;i<that.defectRecords.table.data.length;i++){
          if(that.defectRecords.table.data[i].attachments==null){
            that.defectRecords.table.data[i].attachments=new Array();
          }
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

        that.d1Team=resp.data.d1Team;
        for(let i in resp.data.d1Team.members){
          that.memberList.push(resp.data.d1Team.members[i])
        }
        var flag= false;
        for(var i = 0;i<that.memberList.length;i++){
          if(that.memberList[i].memberId==that.d1Team.leaderId){
            flag=true;
            break;
          }
        }
        if(!flag){
          for(var i=0;i<that.userList.length;i++){
            if(that.userList[i].userId==that.d1Team.leaderId){
              let member={memberId:that.userList[i].userId,memberName:that.userList[i].name}
              that.memberList.push(member)
            }
          }
        }

        if(that.basic.isFatal==1){
          that.basic.isFatalSelect=true;
        }else{
          that.basic.isFatalSelect=false;
        }
        let state=that.basic.abnormalState;
        if(that.basic.isInternal==0&&(state==0||state==1||state==3||state==41||state==7)){
          that.d1TeamShow=false;
        }else{
          that.d1TeamShow=true;
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
      let state = that.basic.abnormalState;//当前状态
      let isInternal = that.basic.isInternal;

      // if(state == 0){//修改客诉
      //   that.button.creator=true;
      // }
      if(state == 1){//客诉待审核
        // that.auditTimeShow=false;
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
      else if(state==0 || state == 3 || state == 7){//修改客诉/客诉审核驳回/被退回
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
      else if(state == 5 ){//处理中5
        that.basic.disabled=true;
        that.d1Team.disabled=true;
        that.d2Description.disabled=true;
        that.DisciplineHandle.show=true;
        if(isInternal==1){//处理中
          that.d8Congratulation.show=true;
          that.d8Congratulation.disabled=true;
        }
        let processorIds = [];
        for(let i=0;i<that.memberList.length;i++){
          processorIds.push(that.memberList[i].memberId);
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
            that.d6Effect.operatorId=userId
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
      else if(state == 41){//待回复
        that.basic.disabled=true;
        that.d2Description.disabled=true;
        that.button.other=true;
      }
      else if(state == 6){//退回
        that.d1Team.show=true;
        that.DisciplineHandle.show=true;
        that.basic.disabled=true;
        that.d1Team.disabled=true;
        that.d2Description.disabled=true;
        that.DisciplineHandle.disabled=true;
        that.button.other=true;
      }
      else if(state == 8){//待结案

        that.DisciplineHandle.show=true;
        that.basic.disabled=true;
        that.d1Team.disabled=true;
        that.d2Description.disabled=true;
        that.DisciplineHandle.disabled=true;
        that.d8Congratulation.show=true;
        that.d8Congratulation.operateTime=that.d8Congratulation.operateTime||new Date();

        let creatorId = that.basic.creatorId;
        if(userId==creatorId){
          that.button.end=true;
          if(isInternal==1){
            that.backTo=false;
          }
        }else{
          that.d8Congratulation.disabled=true;
          that.button.other=true;
        }
      }
      else if(state == 9){//已结案
        that.DisciplineHandle.show=true;
        that.d8Congratulation.show=true;
        that.basic.disabled=true;
        that.d1Team.disabled=true;
        that.d2Description.disabled=true;
        that.DisciplineHandle.disabled=true;
        that.d8Congratulation.disabled=true;
        that.button.other=true;
      }

      // if(that.basic.disabled==true){
      //   that.qcNoDisabled=true;
      // }
    },
    getProductData(){
      let that = this;
      let tempList=that.qcnoList;
      // //console.log(tempList,'获得产品数据-----------------------')
      for(var i = 0;i<tempList.length;i++){
        if(that.basic.qcNo==""||that.basic.qcNo==i18n.t('iqc.null')){
          // that.basic.qcNo='';
          that.basic.productId='';
          that.basic.productNo='';
          that.basic.productName='';
          that.basic.customerId='';
          that.basic.batchQuantity='';
          that.basic.sampleQuantity='';
          that.basic.badQuantity='';
          that.basic.productName='';
          that.basic.batchNo='';
          that.qcNoDisabled=false;
          that.basic.supplierId='';
        }else{
          if(tempList[i].iqcNo==that.basic.qcNo){
            that.basic.productId=tempList[i].productId;
            that.basic.productNo=tempList[i].productNo;
            that.basic.productName=tempList[i].productName;
            that.basic.batchNo=tempList[i].batch;
            that.basic.batchQuantity=tempList[i].totalQuantity;
            that.basic.sampleQuantity=tempList[i].sampleQuantity;
            that.basic.badQuantity=tempList[i].badQuantity;
            that.basic.supplierId=tempList[i].manufacturerId;
            that.qcNoDisabled=true;
            that.getProductName(that.basic.productId)
          }
        }
      }
    },
    getDefectRecord(qcNo){
      let that = this ;
      if(!that.changeDefect){
        that.changeDefect=true;
        return;
      }
      if(!qcNo){that.defectRecords.table.data=[];return;}
      that.$http.get('/examinecenter/iqc/iqcdetailByIqcNo/'+qcNo).then((resp)=>{
        //console.log(resp.data.defectRecordList,'检验单号带出缺陷记录')
        let defectRecordList=resp.data.defectRecordList;
        for(let i in defectRecordList){
          if(defectRecordList[i].inspectionTypeId){
            let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+defectRecordList[i].inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
            defectRecordList[i]['defectTypeList'] = resp.data||[]
          }
          defectRecordList[i]['qualityLevelId']=defectRecordList[i].qltyLvId;
          defectRecordList[i]['defectLocationId']=defectRecordList[i].defectLocId;
          defectRecordList[i]['defectQuantity']=defectRecordList[i].defectCount;
          defectRecordList[i]['attachments']=defectRecordList[i].extInfoList||[];
          defectRecordList[i].defectRecordId=null;
          for(let j in defectRecordList[i].attachments){
            defectRecordList[i].attachments[j]['mime']=defectRecordList[i].attachments[j].defectrecordExtInfoType||'';
          }
          defectRecordList[i]['defectNumber']=i
        }
        that.defectRecords.table.data=defectRecordList;
        for(let x in that.defectRecords.table.data){
          that.defectRate(that.defectRecords.table.data[x].defectQuantity,that.defectRecords.table.data[x].sampleQuantity,x);

        }
      })
    }, 
    getProductName(productId){
      let that = this;
      if(productId){
        that.$http.get('/basic/product/detail/'+productId).then(function(resp){
          that.basic.productNo=resp.data.no;
          that.basic.productName=resp.data.name;
          that.basic.productUnitName=resp.data.prodUnitName;
        })
      }

    },
    getName(customerId){
      let that = this;
      that.$http.get('/bas/customer/'+customerId).then(function(resp){
        //console.log(resp)
        that.basic.customerName=resp.data.customerAbbreviation||'';
      })
    },
    ifNull(){
      let that = this;
      if(that.d3Contain.operateTime==null||
        that.d3Contain.operatorId==null||
        that.d3Contain.policy==null||
        that.d3Contain.treatmentMethod==null||
        that.d4Cause.causeIdentify==null||
        that.d4Cause.abnormalCauseId==null||
        that.d4Cause.operateTime==null||
        that.d4Cause.operatorId==null||
        that.d5Plan.operateTime==null||
        that.d5Plan.operatorId==null||
        that.d5Plan.policy==null||
        that.d5Plan.treatmentMethod==null||
        that.d6Effect.effect==null||
        that.d6Effect.operateTime==null||
        that.d6Effect.operatorId==null||
        that.d6Effect.verificationMethod==null||
        that.d7Prevention.operateTime==null||
        that.d7Prevention.operatorId==null||
        that.d7Prevention.preventive==null||
        that.d3Contain.operateTime==''||
        that.d3Contain.operatorId==''||
        that.d3Contain.policy==''||
        that.d3Contain.treatmentMethod==''||
        that.d4Cause.causeIdentify==''||
        that.d4Cause.abnormalCauseId==''||
        that.d4Cause.operateTime==''||
        that.d4Cause.operatorId==''||
        that.d5Plan.operateTime==''||
        that.d5Plan.operatorId==''||
        that.d5Plan.policy==''||
        that.d5Plan.treatmentMethod==''||
        that.d6Effect.effect==''||
        that.d6Effect.operateTime==''||
        that.d6Effect.operatorId==''||
        that.d6Effect.verificationMethod==''||
        that.d7Prevention.operateTime==''||
        that.d7Prevention.operatorId==''||
        that.d7Prevention.preventive==''
      ){
        that.submitHandleShow=false;
        that.submitEndShow=false;
        // alert('false')
      }else{
        if(that.basic.isInternal==1){
          that.submitHandleShow=true;
          // alert('true')
        }
        else if(that.basic.isInternal==0&&that.d1Team.creatorId==that.userId){
          that.submitEndShow=true;
        }
        else{
          that.submitEndShow=false;
          that.submitHandleShow=false;

        }
      }
    },
    changeInternal(isInternal){
      let that = this;
      if(isInternal==1){
        that.d1TeamShow=true;
        that.$Notice.warning({title: i18n.t('iqc.inputD2')});
        that.d1Team.creatorId=that.userId;
        that.d1Team.createTime=new Date();
      }else{
        that.d1TeamShow=false;
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
          that.$Notice.warning({title: i18n.t('iqc.memberExisted')});
        }
      })

    },
    deleteMember(index,part){//删除小组成员
      // //console.log(index)
      let that = this;
      part.splice(index, 1);
    },
    addAbnormal(requestMethod){//添加客诉/修改客诉/提交客诉
      let that=this;
      let state = true;
      let params = [
        {type:'Empty',title:i18n.t('iqc.happenTime'),value:that.basic.abnormalDate},
        {type:'Empty',title:i18n.t('iqc.abnNo'),value:that.basic.abnormalNo},
        {type:'No',title:i18n.t('iqc.abnNo'),value:that.basic.abnormalNo},
      ]
      if(that.basic.qcNo){
        params.push({type:'Empty',title:i18n.t('iqc.productBatch'),value:that.basic.batchNo})//产品批号可以为空
      }
      params.push(
        {type:'Empty',title:i18n.t('iqc.place'),value:that.basic.abnormalPlace},
        {type:'Word20',title:i18n.t('iqc.place'),value:that.basic.abnormalPlace},
        {type:'Empty',title:i18n.t('iqc.productNo'),value:that.basic.productId},
      )
      if(that.basic.isInternal==0){
        params.push(
          {type:'Empty',title:i18n.t('iqc.belongSupplier'),value:that.basic.supplierId},
        )
      }
      params.push(
        {type:'Empty',title:i18n.t('iqc.batchNum'),value:that.basic.batchQuantity},
        {type:'NumNot0',title:i18n.t('iqc.batchNum'),value:that.basic.batchQuantity},
        // {type:'Empty',title:i18n.t('iqc.qcNum'),value:that.basic.sampleQuantity},
        // {type:'Num',title:i18n.t('iqc.qcNum'),value:that.basic.sampleQuantity},
        {type:'Empty',title:i18n.t('iqc.badNum'),value:that.basic.badQuantity},
        {type:'Num',title:i18n.t('iqc.badNum'),value:that.basic.badQuantity},
        {type:'Empty',title:i18n.t('iqc.treatmentMethod'),value:that.basic.treatmentMethod},
        {type:'Empty',title:i18n.t('iqc.treatmentLimit'),value:that.basic.treatmentTimeLimit},
        {type:'Empty',title:i18n.t('iqc.theme'),value:that.basic.subject},
        {type:'Word20',title:i18n.t('iqc.theme'),value:that.basic.subject},
        {type:'Word600',title:i18n.t('iqc.abnDescribe'),value:that.d2Description.description},
      )


      if(requestMethod=='submit'){
        params.push(
          {type:'Empty',title:i18n.t('iqc.abnDescribe'),value:that.d2Description.description},
          {type:'Empty',title:i18n.t('iqc.auditor'),value:that.basic.auditorId},
        )
        if(that.basic.isInternal==1){
          params.push(
            {type:'Empty',title:i18n.t('iqc.leader'),value:that.d1Team.leaderId},
            {type:'EmptyLength',title:i18n.t('iqc.teamMember'),value:that.d1Team.members},
          )
        }
      }
      
      for(let i in params){
        state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
          that.$Notice.warning({title:tips})
        })
        if(!state){
          return;
          break;
        }
      }
      // let a=parseInt(that.basic.batchQuantity);
      // let b=parseInt(that.basic.sampleQuantity);
      // let c=parseInt(that.basic.badQuantity);
      // if(b>a){
      //   that.$Notice.warning({title:'检验数不能大于批量数'});
      //   return;
      // }
      // if(c>b){
      //   that.$Notice.warning({title:'不良数不能大于检验数'});
      //   return;
      // }
      for(let i=0;i<that.defectRecords.table.data.length;i++){
        that.defectRecords.table.data[i].abnormalId=that.abnormalId;
        if(that.defectRecords.table.data[i].inspectionTypeId==''||that.defectRecords.table.data[i].defectTypeId==''|| that.defectRecords.table.data[i].sampleQuantity===''|| that.defectRecords.table.data[i].defectQuantity===''){
          // if(that.defectRecords.table.data[i].inspectionTypeId==''&&that.defectRecords.table.data[i].defectTypeId==='' && that.defectRecords.table.data[i].sampleQuantity==''&& that.defectRecords.table.data[i].defectQuantity===''){
          //   that.$Notice.warning({title: '请删除第'+(i+1)+'条空白缺陷记录'});
          //   return;
          // }else{
            that.$Notice.warning({title: i18n.t('iqc.pleaseInput')+i18n.t('iqc.defectRecord')+(i+1)});
            return;
          // }
        }
        let paramsDefects = [
          {type: 'NumNot0', title: i18n.t('iqc.sampleQuantity'), value: that.defectRecords.table.data[i].sampleQuantity},
          {type: 'Num', title: i18n.t('iqc.defectNum'), value: that.defectRecords.table.data[i].defectQuantity},
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
      }
      for(let i=0;i<that.defectRecords.table.data.length;i++){
        if(that.defectRecords.table.data[i].defectLocationId==i18n.t('iqc.null')){
          that.defectRecords.table.data[i].defectLocationId='';
        }
      }
      that.basic.creatorId = that.d2Description.operatorId;


      // let memberIds=[];
      // for(let i in that.d1Team.members){
      //   memberIds.push(that.d1Team.members[i].memberId)
      // }
      // if(that.d1Team.leaderId!=''&&that.d1Team.leaderId!=null&&that.basic.isInternal==1 && memberIds.indexOf(that.d1Team.leaderId)==-1){
      //   that.$http.get('/tenant/user/'+that.d1Team.leaderId).then(function(resp){
      //     that.d1Team.members.push({memberId:that.d1Team.leaderId,memberName:resp.data.name})
      //     that.interface(requestMethod);
      //   })
      // }else{
        that.interface(requestMethod);
      // }
    },
    interface(requestMethod){
      let that =this;
      var newData={
        basic:that.basic,
        d1Team:that.d1Team,
        d2Description:that.d2Description,
        defectRecords:that.defectRecords.table.data
      };
      //console.log(newData,'newData1')
      
      newData.basic.abnormalDate=(new Date(newData.basic.abnormalDate)).getTime();
      newData.basic.auditTime=newData.basic.auditTime?(new Date(newData.basic.auditTime)).getTime():'';
      newData.basic.createTime=(new Date(newData.basic.createTime)).getTime();
      newData.d1Team.createTime=newData.d1Team.createTime?(new Date(newData.d1Team.createTime)).getTime():'';
      newData.d2Description.operateTime=(new Date(newData.d2Description.operateTime)).getTime();
      newData.basic.abnormalState=0;
      //console.log(newData,'newData2')

      
      if(requestMethod=='save'){
        that.loadStat.complaintDataLoading = true;
        if(that.abnormalId){//修改时保存
          that.$http.put('/examinecenter/iqc/abnormal?type=save',newData,that.headers).then(function(resp){
            that.$Message.success(i18n.t('iqc.editSuccess'));
            that.loadStat.complaintDataLoading = false;
            that.basic.abnormalDate=new Date(that.basic.abnormalDate);
            that.basic.auditTime=that.basic.auditTime?new Date(that.basic.auditTime):'';
            that.basic.createTime=new Date(that.basic.createTime);
            that.d1Team.createTime=new Date(that.d1Team.createTime);
            that.d2Description.operateTime=new Date(that.d2Description.operateTime);
            for(let i = 0; i<that.defectRecords.table.data.length; i++){
              if(!that.defectRecords.table.data[i].defectLocationId){
                that.defectRecords.table.data[i].defectLocationId=i18n.t('iqc.null');
              }
            }
          }).catch(function(error){
            that.loadStat.complaintDataLoading = false;
            that.basic.abnormalDate=new Date(that.basic.abnormalDate);
            that.basic.auditTime=that.basic.auditTime?new Date(that.basic.auditTime):'';
            that.basic.createTime=new Date(that.basic.createTime);
            that.d1Team.createTime=new Date(that.d1Team.createTime);
            that.d2Description.operateTime=new Date(that.d2Description.operateTime);
            for(let i = 0; i<that.defectRecords.table.data.length; i++){
              if(!that.defectRecords.table.data[i].defectLocationId){
                that.defectRecords.table.data[i].defectLocationId=i18n.t('iqc.null');
              }
            }

          })
        }else{//添加时保存
          that.$http.post('/examinecenter/iqc/abnormal?type=save',newData,that.headers).then(function(resp){
            that.$Message.success(i18n.t('iqc.saveSuccess'));
            
            that.loadStat.complaintDataLoading = false;
            that.closePage();
            that.abnormalId=resp.data.basic.abnormalId;
            that.$emit("open-tab","qc-iqc-abnormal-edit-"+that.abnormalId,i18n.t('iqc.editIqcAbn'),"page-exam-iqc-abnormal-add",{abnormalId:that.abnormalId});
            for(let i = 0; i<that.defectRecords.table.data.length; i++){
              if(!that.defectRecords.table.data[i].defectLocationId){
                that.defectRecords.table.data[i].defectLocationId=i18n.t('iqc.null');
              }
            }
          }).catch(function(error){
            that.loadStat.complaintDataLoading = false;
            that.basic.abnormalDate=new Date(that.basic.abnormalDate);
            that.basic.auditTime=that.basic.auditTime?new Date(that.basic.auditTime):'';
            that.basic.createTime=new Date(that.basic.createTime);
            that.d1Team.createTime=new Date(that.d1Team.createTime);
            that.d2Description.operateTime=new Date(that.d2Description.operateTime);
            for(let i = 0; i<that.defectRecords.table.data.length; i++){
              if(!that.defectRecords.table.data[i].defectLocationId){
                that.defectRecords.table.data[i].defectLocationId=i18n.t('iqc.null');
              }
            }
          })
        }
      }else if(requestMethod=='submit'){
        
        
        that.loadStat.complaintDataLoading = true;
        if(that.abnormalId){//修改时提交
          //console.log(newData)
          that.$http.put('/examinecenter/iqc/abnormal',newData,that.headers).then(function(resp){
            that.$http.post('/examinecenter/iqc/abnormal/apply?abnormalId='+that.abnormalId).then(function(resp){
              that.$Message.success(i18n.t('iqc.commitSuccess'));
              that.loadStat.complaintDataLoading = false;
              that.closePage();
            }).catch(function(error){
              that.loadStat.complaintDataLoading = false;
              that.basic.abnormalDate=new Date(that.basic.abnormalDate);
              that.basic.auditTime=that.basic.auditTime?new Date(that.basic.auditTime):'';
              that.basic.createTime=new Date(that.basic.createTime);
              that.d1Team.createTime=new Date(that.d1Team.createTime);
              that.d2Description.operateTime=new Date(that.d2Description.operateTime);
              for(let i = 0; i<that.defectRecords.table.data.length; i++){
                if(!that.defectRecords.table.data[i].defectLocationId){
                  that.defectRecords.table.data[i].defectLocationId=i18n.t('iqc.null');
                }
              }
            })
          }).catch(function(error){
            that.loadStat.complaintDataLoading = false;
            that.basic.abnormalDate=new Date(that.basic.abnormalDate);
            that.basic.auditTime=that.basic.auditTime?new Date(that.basic.auditTime):'';
            that.basic.createTime=new Date(that.basic.createTime);
            that.d1Team.createTime=new Date(that.d1Team.createTime);
            that.d2Description.operateTime=new Date(that.d2Description.operateTime);
            for(let i = 0; i<that.defectRecords.table.data.length; i++){
              if(!that.defectRecords.table.data[i].defectLocationId){
                that.defectRecords.table.data[i].defectLocationId=i18n.t('iqc.null');
              }
            }
          })
        }else{
          that.$http.post('/examinecenter/iqc/abnormal',newData,that.headers).then(function(resp){//添加时提交
            let abnormalId=resp.data.basic.abnormalId;
            that.$http.post('/examinecenter/iqc/abnormal/apply?abnormalId='+abnormalId).then(function(resp){
              that.$Message.success(i18n.t('iqc.commitSuccess'));
              that.loadStat.complaintDataLoading = false;
              that.closePage();
            }).catch(function(error){
              that.loadStat.complaintDataLoading = false;
              that.basic.abnormalDate=new Date(that.basic.abnormalDate);
              that.basic.auditTime=that.basic.auditTime?new Date(that.basic.auditTime):'';
              that.basic.createTime=new Date(that.basic.createTime);
              that.d1Team.createTime=new Date(that.d1Team.createTime);
              that.d2Description.operateTime=new Date(that.d2Description.operateTime);
              for(let i = 0; i<that.defectRecords.table.data.length; i++){
                if(!that.defectRecords.table.data[i].defectLocationId){
                  that.defectRecords.table.data[i].defectLocationId=i18n.t('iqc.null');
                }
              }
            })
          }).catch(function(error){
            that.loadStat.complaintDataLoading = false;
            that.basic.abnormalDate=new Date(that.basic.abnormalDate);
            that.basic.auditTime=that.basic.auditTime?new Date(that.basic.auditTime):'';
            that.basic.createTime=new Date(that.basic.createTime);
            that.d1Team.createTime=new Date(that.d1Team.createTime);
            that.d2Description.operateTime=new Date(that.d2Description.operateTime);
            for(let i = 0; i<that.defectRecords.table.data.length; i++){
              if(!that.defectRecords.table.data[i].defectLocationId){
                that.defectRecords.table.data[i].defectLocationId=i18n.t('iqc.null');
              }
            }
          })
        }
      }
    },
    auditPass(requestMethod){//审核通过/审核驳回
      let that =this;
      //console.log(requestMethod)
      that.$http.post('/examinecenter/iqc/abnormal/audit?abnormalId='+that.abnormalId+'&checked='+requestMethod).then(function(resp){
        if(requestMethod==1){
          that.$Message.success(i18n.t('iqc.auditSuccess'))
          that.closePage();
        }else{
          that.$Message.success(i18n.t('iqc.auditSuccess'))
          that.closePage();
        }
        
      })
    },
    saveHandle(requestMethod){//处理中/处理保存/处理提交
      let that=this;
      let params = [
        {type:'Word600',title:'D3-'+i18n.t('iqc.shortPolicy'),value:that.d3Contain.policy},
        {type:'Word20',title:'D3-'+i18n.t('iqc.handleMethod'),value:that.d3Contain.treatmentMethod},
        {type:'Word600',title:'D4-'+i18n.t('iqc.causeIdentify'),value:that.d4Cause.causeIdentify},
        {type:'Word600',title:'D5-'+i18n.t('iqc.longPolicy'),value:that.d5Plan.policy},
        {type:'Word20',title:'D5-'+i18n.t('iqc.handleMethod'),value:that.d5Plan.treatmentMethod},
        {type:'Word600',title:'D6-'+i18n.t('iqc.effect'),value:that.d6Effect.effect},
        {type:'Word20',title:'D6-'+i18n.t('iqc.verificationMethod'),value:that.d6Effect.verificationMethod},
        {type:'Word600',title:'D7-'+i18n.t('iqc.preventive'),value:that.d7Prevention.preventive},
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
        if(that.defectRecords.table.data[i].defectLocationId==i18n.t('iqc.null')){
          that.defectRecords.table.data[i].defectLocationId='';
        }
      }
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
      newData.basic.abnormalDate=(new Date(newData.basic.abnormalDate)).getTime();
      newData.basic.auditTime=(new Date(newData.basic.auditTime)).getTime();
      newData.basic.createTime=(new Date(newData.basic.createTime)).getTime();
      newData.d1Team.createTime=(new Date(newData.d1Team.createTime)).getTime();
      newData.d2Description.operateTime=(new Date(newData.d2Description.operateTime)).getTime();
      newData.d3Contain.operateTime=(new Date(newData.d3Contain.operateTime)).getTime();
      newData.d4Cause.operateTime=(new Date(newData.d4Cause.operateTime)).getTime();
      newData.d5Plan.operateTime=(new Date(newData.d5Plan.operateTime)).getTime();
      newData.d6Effect.operateTime=(new Date(newData.d6Effect.operateTime)).getTime();
      newData.d7Prevention.operateTime=(new Date(newData.d7Prevention.operateTime)).getTime();
      newData.basic.abnormalState=5;
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
        that.ifNull();
        that.spinShow=false;
        that.$http.get('/examinecenter/iqc/abnormal/'+that.abnormalId).then(function(resp){
          if(resp.data.basic.abnormalState==8||resp.data.basic.abnormalState==9){
            that.$Notice.warning({title:i18n.t('iqc.submitStopEdit')})
            that.refreshData();
            return;
          }
          that.$http.put('/examinecenter/iqc/abnormal',newData,that.headers).then(function(resp){
            that.$Message.success(i18n.t('iqc.saveSuccess'));
            that.basic.abnormalDate=new Date(that.basic.abnormalDate);
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
            that.spinShow=true;
          }).catch(function(error){
            that.other.spinShow=true
            that.basic.abnormalDate=new Date(that.basic.abnormalDate);
            that.basic.auditTime=new Date(that.basic.auditTime);
            that.basic.createTime=new Date(that.basic.createTime);
            that.d1Team.createTime=new Date(that.d1Team.createTime);
            that.d2Description.operateTime=new Date(that.d2Description.operateTime);
            that.d3Contain.operateTime=new Date(that.d3Contain.operateTime);
            that.d4Cause.operateTime=new Date(that.d4Cause.operateTime);
            that.d5Plan.operateTime=new Date(that.d5Plan.operateTime);
            that.d6Effect.operateTime=new Date(that.d6Effect.operateTime);
            that.d7Prevention.operateTime=new Date(that.d7Prevention.operateTime);
          })
        })
        
      }else if(requestMethod=='submit'){
        that.$http.post('/examinecenter/iqc/abnormal/apply-complete?abnormalId='+that.abnormalId).then(function(resp){
          that.$Message.success(i18n.t('iqc.commitSuccess'));
          that.closePage();
        })
      }
    },
    // submitEnd(){//提交给客户
    //   let that = this;
    //   that.$http.post('/customer/abnormal/reply?abnormalId='+that.abnormalId).then(function(resp){
    //     that.$Message.success("提交成功！");
    //     that.closePage();
    //   })
    // },
    backToSupplier(){//退回给供应商
      let that = this;
      that.$http.post("/examinecenter/iqc/abnormal/reject?abnormalId="+that.abnormalId).then(function(resp){
        that.$Message.success(i18n.t('iqc.backSuccess'));
        that.closePage();
      })
    },
    endAbnormal(){//提交结案
      let that =this ;

      let params = [
        {type:'Empty',title:i18n.t('iqc.opinion'),value:that.d8Congratulation.opinion},
        {type:'Word600',title:i18n.t('iqc.opinion'),value:that.d8Congratulation.opinion},
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
      that.d8Congratulation.operateTime=(new Date(that.d8Congratulation.operateTime)).getTime();
      that.d8Congratulation["closeState"]=1;
      that.$http.post('/examinecenter/iqc/abnormal/complete?abnormalId='+that.abnormalId,that.d8Congratulation,that.headers).then(function(resp){
        that.d8Congratulation.operateTime=new Date(that.d8Congratulation.operateTime);
        that.$Message.success(i18n.t('iqc.endSuccess'));
        that.closePage();
      }).catch(function(error){
        that.d8Congratulation.operateTime=new Date(that.d8Congratulation.operateTime);
      })
    },
    confirm(requestMethod,step){
      let that=this;
      let contentText='';
      if(requestMethod=='submit'){
        contentText=i18n.t('iqc.sureSubmit')
      }
      if(requestMethod=='audit'){
        contentText=i18n.t('iqc.sureAudit')
      }
      if(requestMethod=='end'){
        contentText=i18n.t('iqc.sureEnd')
      }
      if(requestMethod=='back'){
        contentText=i18n.t('iqc.endBack')
      }
      this.$Modal.confirm({
          title: i18n.t('iqc.tips'),
          content: contentText,
          loading:true,
          onOk: () => {
              that.remove()
              if(step=='addAbnormal'){
                that.addAbnormal('submit');
              }
              if(step=='auditPass'){
                that.auditPass(1);
              }
              if(step=='saveHandle'){
                that.saveHandle('submit');
              }
              if(step=='endAbnormal'){
                that.endAbnormal();
              }
              if(step=='backToSupplier'){
                that.backToSupplier();
              }

          },
          onCancel: () => {
              // this.$Message.info('Clicked cancel');
          }
      });
    },
    //解决弹出框中的确认按钮在快速点击的情况下执行多次的问题
      remove(){
        setTimeout(() => {
          this.$Modal.remove()
        }, 100);
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
      
      if(obj1!==''&&obj2!==''){
        let x=(obj1/obj2)*100;
        if(x > 100){
          x = "100%"
          that.defectRecords.table.data[index].defectRate= x
        }else{
          x = Math.floor(x * 100) / 100;
          that.defectRecords.table.data[index].defectRate=x+'%';
          //console.log(111111);
          
        }
        /* x = x.toFixed(2);
        that.defectRecords.table.data[index].defectRate=x+'%'; */
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
        that.defectRecords.prodBatch.DefectPosition.unshift({defectLocId:i18n.t('iqc.null'),name:i18n.t('iqc.null')});
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
      //console.log(ss,'删除选中项')
      for(let i=0;i<that.defectRecords.table.data.length;i++){
        for(let j=0;j<ss.length;j++){
          if(that.defectRecords.table.data[i].defectNumber===ss[j].defectNumber){
              that.defectRecords.table.data.splice(i,1)
          }
        }
      }
    },
    getTableLength(){
      let that = this;
      let ss = this.$refs.defectTable.getSelection();
      that.TableLength=ss.length;
    },
  },

  computed:{
    badRate(){//不良率
      if(this.basic.badQuantity!==''&&this.basic.sampleQuantity!==''){
        let x=this.basic.badQuantity/this.basic.sampleQuantity*100;
        x = Math.floor(x * 100) / 100;
        if(x>100){
          return 100;
        }else{
          return x;
        }
      }else{
        return 0;
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
.picBtnHide .ivu-upload{
  display: none;
}
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
.ivu-table-footer{
  border-top: 1px solid #e9eaec;
}
.ivu-select-input[disabled]{
  color:#666;
}
.iqis-page-block-tools{
  margin-bottom:8px;
}
.iqis-page-block-tools-second .ivu-btn-ghost:not([disabled]) {
    color:#418FEE;
    background-color: transparent;
    border-color: #418FEE;
}
</style>
