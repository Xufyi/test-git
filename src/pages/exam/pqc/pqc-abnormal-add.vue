<template>
  <div class="iqis-page">

    <!-- 第一部分-基本资料 -->
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t('pqc.bi')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25" style="margin-top:15px;">
          <i-col span="6">
            <div class="iqis-page-block-ctrl">
              <DatePicker :disabled="other.basicD1D2Show||noPermsDis" v-model="basic.createTime" type="datetime" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <Checkbox class="isFatal" :disabled="other.basicD1D2Show||noPermsDis" @on-change="basic.isFatal=basic.isFatalSelect?1:0" v-model="basic.isFatalSelect">{{$t('pqc.setMainAbn')}}</Checkbox>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.abnNo')}}</div>
            <i-input v-model="basic.abnormalNo" :disabled="other.basicD1D2Show||noPermsDis"></i-input>
          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t("pqc.iqcNo")}}</div>
            <div class="iqis-page-block-ctrl">
              <!--<i-input :disabled="basic.disabled" v-model="basic.qcNo" :placeholder="i18n.t('pqc.pe')" style="width: 100%;"></i-input>-->
              <Select :disabled="other.basicD1D2Show||noPermsDis" v-model="basic.qcNo" filterable :placeholder="i18n.t('pqc.pleaseChoose')" @on-change="changeOqcNo();getDefectRecord(basic.qcNo)">
                <Option :value="null" >{{$t('pqc.wu')}}</Option>
                <Option v-for="(items,index) in prodBatch.pqcList" :value="items.pqcNo" :key="index">{{ items.pqcNo}}</Option>
              </Select>
            </div>

          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t("pqc.ln")}}</div>
            <div class="iqis-page-block-ctrl">
              <!--<i-input :disabled="basic.disabled" v-model="basic.batchNo" :placeholder="i18n.t('pqc.pe')" style="width: 100%;"></i-input>-->
              <Select v-if='!other.batchNoShow' v-model="basic.batchNo" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="other.basicD1D2Show||other.batchNoShow||noPermsDis" @on-change="changeBatchNo()">
                <Option :value="null">{{$t('pqc.wu')}}</Option>
                <Option v-for="(items,index) in prodBatch.prodbatchList" :value="items.batchNo" :key="index" >{{ items.batchNo}}</Option>
              </Select>
              <i-input  :placeholder="i18n.t('pqc.pe')" v-if='other.batchNoShow' v-model="basic.batchNo" disabled style="width: 100%;"></i-input>

            </div>

          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('pqc.place')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="other.basicD1D2Show||noPermsDis" v-model="basic.abnormalPlace" :placeholder="i18n.t('pqc.pe')" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">

          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('pqc.pn')}}</div>
            <div class="iqis-page-block-ctrl">
              <!--<Select :disabled="basic.disabled" v-model="basic.customerProductNo" filterable>
                &lt;!&ndash; <Option v-for="data in customerProductNo" :key="data.customerProductNo" :value="data.customerProductNo">{{data.customerProductNo}}</Option> &ndash;&gt;
              </Select>-->

              <!-- <Select v-model="basic.productId" :disabled="other.disabled" filterable :placeholder="i18n.t('pqc.pleaseChoose')" @on-change="selectOn(basic.productId,1)">
                <Option v-for="(items,index) in prodBatch.productON" :value="items.productId" :label="items.no" :key="index">{{ items.no}}/{{ items.name}}</Option>
              </Select> -->
              <Select  :disabled="other.basicD1D2Show||noPermsDis" @on-change="getProductName(basic.productId)" :label="basic.productNo" filterable remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pleaseChoose')" v-if='!basic.batchNo' v-model="basic.productId">
                <Option v-for="(data,index) in productList" :key="index" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select>
              <i-input  :placeholder="i18n.t('pqc.pe')" v-model="basic.productNo" v-if="basic.batchNo" disabled style="width: 100%;"></i-input>

            </div>
          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t("pqc.name")}}</div>
            <div class="iqis-page-block-ctrl">
              <!--<Select :disabled="basic.disabled" v-model="basic.customerProductNo" filterable>
                &lt;!&ndash; <Option v-for="data in customerProductNo" :key="data.customerProductNo" :value="data.customerProductNo">{{data.customerProductNo}}</Option> &ndash;&gt;
              </Select>-->
              <!-- <i-input :disabled="true" v-model="ruleForm.productNames" style="width: 100%;"></i-input> -->
              <i-input v-model="basic.productName" disabled style="width: 100%;"></i-input>
              
            </div>
          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t("pqc.ac")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="basic.customerId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" v-if="!basic.batchNo" :disabled="other.basicD1D2Show||noPermsDis">
                <Option v-for="(items,index) in prodBatch.customerList" :value="items.customerId" :key="index">{{ items.customerAbbreviation}}</Option>
              </Select>
              <i-input  :placeholder="i18n.t('pqc.pe')" v-model="basic.customerName" disabled v-if="basic.batchNo" style="width: 100%;"></i-input>
            </div>

          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('pqc.belongSupplier')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="other.basicD1D2Show||noPermsDis" :placeholder="i18n.t('pqc.pleaseChoose')" v-model="basic.supplierId" filterable>
                <Option v-for="items in prodBatch.supplierList" :key="items.manufacturerAbbreviation" :value="items.manufacturerId">{{items.manufacturerAbbreviation}}</Option>
              </Select>
            </div>

          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.il')}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <InputNumber :disabled="other.disabled" v-model="basic.batchQuantity" placeholder="" style="width: 100%;"></InputNumber> -->
              <i-input :disabled="basic.batchNo||other.basicD1D2Show||noPermsDis" v-model="basic.batchQuantity" placeholder="" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.qcNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <InputNumber :disabled="other.disabled2" :max="basic.batchQuantity" :min="0" v-model="basic.inspectionQuantity" placeholder="" style="width: 100%;"></InputNumber> -->
              <i-input :disabled="other.basicD1D2Show||other.disabled2||noPermsDis" v-model="basic.inspectionQuantity" placeholder="" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.badNumber')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="other.basicD1D2Show||other.disabled2||noPermsDis" v-model="basic.badQuantity" placeholder="" style="width: 100%;"></i-input>              
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.defectRate')}}%</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="true" v-model="badRate" placeholder="" style="width: 100%;" ></i-input>
            </div>
          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.treatmentMethod')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="other.basicD1D2Show||noPermsDis" v-model="basic.treatmentMethod" filterable>
                <!-- <Option v-for="data in treatmentMethod" :key="data.treatmentMethod" :value="data.treatmentMethod">{{data.treatmentMethod}}</Option> -->
                <Option v-for="st in other.optList" :key="st.value" :value="st.value">{{st.label}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('pqc.tl')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="other.basicD1D2Show||noPermsDis" v-model="basic.treatmentTimeLimit" filterable>
                <!-- <Option v-for="data in treatmentTimeLimit" :key="data.treatmentTimeLimit" :value="data.treatmentTimeLimit">{{data.treatmentTimeLimit}}</Option> -->
                <Option v-for="st in other.timeList" :key="st.value" :value="st.value">{{st.label}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="12">
            <div class="iqis-page-block-label">{{$t('pqc.theme')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="other.basicD1D2Show||noPermsDis" v-model="basic.subject" placeholder="" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div>
    <div class="iqis-page-block">
      <div class="iqis-page-block-title" style="margin-bottom:15px;">
        {{$t('pqc.treatmentRecord')}}
      </div>
      <div class="iqis-page-block-body">


        <div class="blockSmall">
          <div class="titleSmall">{{$t("pqc.D1")}}</div>
          <div class="iqis-page-block-tools">
            <div class="iqis-page-block-tools-primary">
              <div class="iqis-page-block-label">{{$t('pqc.defectRecord')}}</div>
            </div>
            <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
              <Button :disabled="noPermsDis" v-if="!other.basicD1D2Show" type="ghost" icon="trash-a" @click="deleteDefect">{{$t('pqc.delete')}}</Button>
            </div>
          </div>
          <Table :no-data-text="i18n.t('pqc.noData')" :disabled="other.basicD1D2Show||noPermsDis" class="noBorder noHeight location defectTable" ref="defectTable" :loading="defectRecords.table.loading" v-drag-table-column="defectRecords.table.columns" border stripe :columns="defectRecords.table.columns" :data="defectRecords.table.data">
            <Button :disabled="noPermsDis" type="dashed" icon="plus" slot="footer" v-if="!other.basicD1D2Show" style="width:100%;margin: 16px;font-size:14px;" @click="addDefect">{{$t('pqc.addDefect')}}</Button>
            
          </Table>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('pqc.abnDescribe')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input type="textarea" style="width:100%" v-model="d2Description.description" :disabled="other.basicD1D2Show||noPermsDis"></i-input>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.auditor')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pqc.pleaseChoose')" v-model="basic.auditorId" filterable :disabled="other.basicD1D2Show||noPermsDis">
                  <Option v-for="data in other.userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.auditTime')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker v-model="basic.auditTime" type="datetime" :placeholder="i18n.t('pqc.auditTime')" style="width:100%" :disabled="true"></DatePicker>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.describeUser')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-model="d2Description.operatorId" filterable :disabled="other.basicD1D2Show||noPermsDis">
                  <Option v-for="data in other.userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.time')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :disabled="other.basicD1D2Show||noPermsDis"  v-model="d2Description.operateTime" type="datetime" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
        </div>



        <div class="blockSmall">
          <div class="titleSmall">{{$t("pqc.D2")}}</div>
          <Row :gutter="25">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('pqc.leader')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pqc.pleaseChoose')" v-model="d1Team.leaderId" filterable :disabled="other.basicD1D2Show||noPermsDis">
                  <!-- <Option v-for="data in array" :key="data.string" :value="data.string">{{data.string}}</Option> -->
                  <Option v-for="data in other.userList" :key="data.userId" :value="data.userId" @on-change="changeLeader()">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6" offset="6">
              <div class="iqis-page-block-label">{{$t('pqc.teamCreator')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pqc.pleaseChoose')" v-model="d1Team.creatorId" filterable :disabled="other.basicD1D2Show||noPermsDis">
                  <!-- <Option v-for="data in array" :key="data.string" :value="data.string">{{data.string}}</Option> -->
                  <Option v-for="data in other.userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t("pqc.time")}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :disabled="other.basicD1D2Show||noPermsDis" v-model="d1Team.createTime" type="datetime" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('pqc.teamMember')}}</div>
              <div class="iqis-page-block-ctrl">
                <div style="display:inline" v-if="teamAddButton1.show&&!other.basicD1D2Show">
                  <Button :disabled="noPermsDis" type="primary" icon="person-stalker" @click="changeLabel()">{{$t('pqc.addMoreMember')}}</Button>
                </div>
                <div style="display:inline">
                  <Select :placeholder="i18n.t('pqc.pleaseChoose')" v-if="teamSelect1.show" v-model="other.team" filterable style="width:253.75px" @on-change="selectTeam()" :disabled="other.basicD1D2Show||noPermsDis">
                    <Option v-for="data in other.userList" :key="data.userId" :value="data">{{data.name}}</Option>
                  </Select>
                  <Tag :closable="!other.basicD1D2Show&&!noPermsDis" v-for="(data,index) in d1Team.members" type="dot" color="blue" :key="index" :name="index"  @on-close="deleteMember(index)">{{data.memberName}}</Tag>
                </div>

              </div>
            </i-col>
          </Row>
        </div>

        <div v-if="other.D3AndD8Show">
          <div class="blockSmall">
            <div class="titleSmall">{{$t('pqc.D3')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('pqc.shortPolicy')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="other.D3D4Edit||noPermsDis" v-model="d3Contain.policy" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('pqc.handleMethod')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="other.D3D4Edit||noPermsDis" style="width:100%" v-model="d3Contain.treatmentMethod"></i-input>
                </div>
              </i-col>
              <i-col span="6" offset="6">
                <div class="iqis-page-block-label">{{$t('pqc.peopleInCharge')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pqc.pleaseChoose')" v-model="d3Contain.operatorId" filterable @on-change="changePerator()" :disabled="other.D3D4Edit||noPermsDis">
                    <Option v-for="data in other.teamList" :key="data.memberId" :value="data.memberId" >{{data.memberName}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t("pqc.time")}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :disabled="other.D3D4Edit||noPermsDis" v-model="d3Contain.operateTime" type="datetime"  :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('pqc.addAttachments')}}</div>

                  <div class="iqis-page-block-ctrl">
                    <!--<Upload  action="http://iqis.oss-cn-shenzhen.aliyuncs.com" ref="upload" :data="{'key':ossKey,'policy':policy,'OSSAccessKeyId':OSSAccessKeyId,'success_action_status':success_action_status,'signature':signature,'x-oss-object-acl' : 'public-read'}" type="drag" style="display: inline-block;width:32px;">
                      <div style="width: 32px;height:32px;line-height: 32px;">
                        <Icon type="ios-upload-outline" size="16"></Icon>
                      </div>
                    </Upload>-->
                    <Spin size="large" v-if="other.spinShow" style="text-align:left">
                      <IqisUpload ref="d3Upload" :edit="!other.D3D4Edit&&!noPermsDis" @input="d3AddFile" @del="d3DelFile"  :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d3Contain.attachments' :chartTypeShow="false">
                      </IqisUpload>
                    </Spin>
                  </div>

              </i-col>
            </Row>

          </div>

          <div class="blockSmall">
            <div class="titleSmall">{{$t('pqc.D4')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('pqc.causeIdentify')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="other.D3D4Edit||noPermsDis" v-model="d4Cause.causeIdentify" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('pqc.abnormalCause')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" :disabled="other.D3D4Edit||noPermsDis" v-model="d4Cause.abnormalCauseId" filterable @on-change="changeAbnormalCause()">
                    <!-- <Option v-for="data in array" :key="data.string" :value="data.string">{{data.string}}</Option> -->
                    <Option v-for="data in other.abnormalReason" :key="data.abnormalId" :value="data.abnormalId" >{{data.name}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6" offset="6">
                <div class="iqis-page-block-label">{{$t('pqc.peopleInCharge')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-model="d4Cause.operatorId" filterable @on-change="changeD4Perator()" :disabled="other.D3D4Edit||noPermsDis">
                    <Option v-for="data in other.teamList" :key="data.memberId" :value="data.memberId" >{{data.memberName}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t("pqc.time")}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :disabled="other.D3D4Edit||noPermsDis" v-model="d4Cause.operateTime" type="datetime"  :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('pqc.addAttachments')}}</div>
                <Spin size="large"  v-if="other.spinShow" style="text-align:left">
                  <div class="iqis-page-block-ctrl">
                      <IqisUpload ref="d4Upload" :edit="!other.D3D4Edit&&!noPermsDis" @input="d4AddFile" @del="d4DelFile"  :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d4Cause.attachments' :chartTypeShow="false">
                      </IqisUpload>
                  </div>
                </Spin>
              </i-col>
            </Row>
          </div>
          <div class="blockSmall">
            <div class="titleSmall">{{$t('pqc.D5')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('pqc.longPolicy')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="other.D3D4Edit||noPermsDis" v-model="d5Plan.policy" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('pqc.handleMethod')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="other.D3D4Edit||noPermsDis" style="width:100%" v-model="d5Plan.treatmentMethod"></i-input>
                </div>
              </i-col>
              <i-col span="6" offset="6">
                <div class="iqis-page-block-label">{{$t('pqc.peopleInCharge')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-model="d5Plan.operatorId" filterable @on-change="changeD5Perator()" :disabled="other.D3D4Edit||noPermsDis">
                    <Option v-for="data in other.teamList" :key="data.memberId" :value="data.memberId" >{{data.memberName}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t("pqc.time")}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable="false" :disabled="other.D3D4Edit||noPermsDis" v-model="d5Plan.operateTime" type="datetime"  :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('pqc.addAttachments')}}</div>
                <Spin size="large"  v-if="other.spinShow" style="text-align:left">
                  <div class="iqis-page-block-ctrl">
                      <IqisUpload ref="d5Upload" :edit="!other.D3D4Edit&&!noPermsDis" @input="d4AddFile" @del="d4DelFile"  :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d5Plan.attachments' :chartTypeShow="false">
                      </IqisUpload>
                  </div>
                </Spin>
              </i-col>
            </Row>
          </div>
          <div class="blockSmall">
            <div class="titleSmall">{{$t("pqc.D6")}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('pqc.effect')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="other.D3D4Edit||noPermsDis" v-model="d6Effect.effect" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t('pqc.verificationMethod')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="other.D3D4Edit||noPermsDis" style="width:100%" v-model="d6Effect.verificationMethod"></i-input>
                </div>
              </i-col>
              <i-col span="6" offset="6">
                <div class="iqis-page-block-label">{{$t('pqc.verifier')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-model="d6Effect.operatorId" filterable @on-change="changeD6Perator()" :disabled="other.D3D4Edit||noPermsDis">
                    <Option v-for="data in other.teamList" :key="data.memberId" :value="data.memberId" >{{data.memberName}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t("pqc.time")}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable="false" :disabled="other.D3D4Edit||noPermsDis" v-model="d6Effect.operateTime" type="datetime"  :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('pqc.addAttachments')}}</div>
                <Spin size="large"  v-if="other.spinShow" style="text-align:left">
                  <div class="iqis-page-block-ctrl">
                      <IqisUpload ref="d6Upload" :edit="!other.D3D4Edit&&!noPermsDis" @input="d4AddFile" @del="d4DelFile"  :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d6Effect.attachments' :chartTypeShow="false">
                      </IqisUpload>
                  </div>
                </Spin>
              </i-col>
            </Row>
          </div>
          <div class="blockSmall">
            <div class="titleSmall">{{$t('pqc.D7')}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('pqc.preventive')}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="other.D3D4Edit||noPermsDis" v-model="d7Prevention.preventive" type="textarea" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="12">
                <div class="iqis-page-block-label">{{$t("pqc.addAttachments")}}</div>
                <Spin size="large"  v-if="other.spinShow" style="text-align:left">
                  <div class="iqis-page-block-ctrl">
                      <IqisUpload ref="d7Upload" :edit="!other.D3D4Edit&&!noPermsDis" @input="d4AddFile" @del="d4DelFile"  :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d7Prevention.attachments' :chartTypeShow="false">
                      </IqisUpload>
                  </div>
                </Spin>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t("pqc.verifier")}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-model="d7Prevention.operatorId" filterable @on-change="changeD7Perator()" :disabled="other.D3D4Edit||noPermsDis">
                    <Option v-for="data in other.teamList" :key="data.memberId" :value="data.memberId" >{{data.memberName}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t("pqc.time")}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :clearable="false" :disabled="other.D3D4Edit||noPermsDis" v-model="d7Prevention.operateTime" type="datetime"  :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>
          </div>

          <div class="blockSmall">
            <div class="titleSmall">{{$t("pqc.D8")}}</div>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t("pqc.opinion")}}</div>
                <div class="iqis-page-block-ctrl">
                  <i-input :disabled="other.D8Edit||noPermsDis" type="textarea" v-model="d8Congratulation.opinion" style="width:100%"></i-input>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="24">
                <div class="iqis-page-block-label">{{$t('pqc.shareMembers')}}</div>
                <div class="iqis-page-block-ctrl">
                  <div style="display:inline" v-if="teamAddButton2.show&&!other.D8Edit">
                    <Button type="primary" icon="person-stalker" v-on:click="changeLabel2()" :disabled="other.D8Edit||noPermsDis">{{$t('pqc.addMoreMember')}}</Button>
                  </div>
                  <div style="display:inline">
                    <Select :placeholder="i18n.t('pleaseChoose')" v-if="teamSelect2.show" v-model="other.team2" filterable style="width:253.75px" @on-change="selectTeam2()" :disabled="other.D8Edit||noPermsDis">
                      <Option v-for="data in other.userList" :key="data.userId" :value="data">{{data.name}}</Option>
                    </Select>
                    <Tag :closable="!other.D8Edit" v-for="(data,index) in d8Congratulation.members"  type="dot" color="blue" :key="index" :name="index" @on-close="deleteMember2(index)">{{data.memberName}}</Tag>
                  </div>
                </div>
              </i-col>
            </Row>
            <Row :gutter="25">
              <i-col span="6" offset="12">
                <div class="iqis-page-block-label">{{$t('pqc.endUser')}}</div>
                <div class="iqis-page-block-ctrl">
                  <Select :placeholder="i18n.t('pleaseChoose')" v-model="d8Congratulation.operatorId" filterable :disabled="other.D8Edit||noPermsDis">
                    <Option v-for="data in other.userList" :key="data.userId" :value="data.userId" >{{data.name}}</Option>
                  </Select>
                </div>
              </i-col>
              <i-col span="6">
                <div class="iqis-page-block-label">{{$t("pqc.time")}}</div>
                <div class="iqis-page-block-ctrl">
                  <DatePicker :disabled="other.D8Edit||noPermsDis" v-model="d8Congratulation.operateTime" type="datetime" :placeholder="i18n.t('pqc.pst')" style="width:100%"></DatePicker>
                </div>
              </i-col>
            </Row>

          </div>
        </div>
      </div>
    </div>

    <!--end blocks-->
    <div class="page-end" style="padding-bottom: 65px"></div>

    <IqisAffix placement="bottom" :offset="0">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" v-if="basic.abnormalState==1&&basic.auditorId==other.currentUser.userId&&permsBtn.UPDATE_PQC_ABNORMAL" v-on:click="auditingPass()">{{$t('pqc.auditPass')}}</Button>
        <Button type="ghost" v-if="basic.abnormalState==1&&basic.auditorId==other.currentUser.userId&&permsBtn.UPDATE_PQC_ABNORMAL" v-on:click="auditingReject()">{{$t('pqc.auditReject')}}</Button>
        <Button type="primary" v-if="basic.creatorId==other.currentUser.userId&&basic.abnormalState==8&&permsBtn.UPDATE_PQC_ABNORMAL" v-on:click="confirmCloseCase()">{{$t("pqc.end")}}</Button>
        <!--<div v-if="basic.abnormalState==5?other.commitShow:true" style="display:inline">-->
        <!--<Button type="primary" v-on:click="confirmCommit()" v-if="basic.abnormalState==0||basic.abnormalState==3||basic.abnormalState==5&&basic.abnormalState!=5">提交</Button>-->
        <!--<Button type="primary" v-on:click="confirmCommit()" v-if="basic.abnormalState==0||(basic.abnormalState==3&&basic.creatorId==other.currentUser.userId)||basic.abnormalState==5">提交</Button>-->
        <Button type="primary" v-on:click="confirmCommit()" v-if="other.commitButton&&permsBtn.UPDATE_PQC_ABNORMAL">{{$t('pqc.submit')}}</Button>
        <Button type="primary" v-on:click="confirmCommit()" v-if="other.closeCaseButton&&permsBtn.UPDATE_PQC_ABNORMAL">{{$t('pqc.submitEndPeople')}}</Button>
        <!--</div>-->
        <!--<Button type="ghost" v-on:click="save()" v-if="basic.abnormalState!=1&&basic.abnormalState!=8&&basic.abnormalState!=9&&basic.abnormalState!=5">保存</Button>-->
        <!--<Button type="ghost" v-on:click="save()" v-if="basic.abnormalState!=1&&basic.abnormalState!=8&&basic.abnormalState!=9&&basic.abnormalState!=5&&(basic.abnormalState==3&&basic.creatorId==other.currentUser.userId)">保存</Button>-->
        <Button type="primary" v-on:click="save()" v-if="other.saveButton&&!noPermsDis">{{$t('pqc.save')}}</Button>
        <Button type="ghost" v-on:click="cancel()">{{$t('pqc.cancel')}}</Button>
      </div>
    </IqisAffix>
  </div>

</template>

<script>
import $ from "jquery"
  export default {
    props:["params","tabKey"],
    data(){
      let vm = this;
      return{
        i18n:window.i18n,
        changeDefect:true,
        abnormalId:'',
        isF:true,
        selects:{
          defectTypeList:[],
          inspectionTypes:[],
        },
        status:'',
        uploadData:{},
        ossKey:'',
        policy:'',
        OSSAccessKeyId:'',
        success_action_status:'',
        signature:'',
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        userList:[],
        currentUserId:'',
        currentUserDepartment:'',
        data:[],
        customerList:[],
        allDepartment:[],
        user:[],
        product:[],
        array:[],
        string:"",
        basic:{
          abnormalDate: new Date(),
          abnormalId: '',
          abnormalNo: "",
          abnormalPlace: "",
          abnormalState: 0,
          auditState: 0,
          auditTime: '',
          auditorId: 0,
          badQuantity: 0,
          batchNo: null,
          batchQuantity: 0,
          createTime: new Date(),
          creatorId: 0,
          customerId: 0,
          examType: 0,
          inspectionQuantity: 0,
          isFatal: 0,
          productId: null,
          productName:null,
          productNo:null,
          qcNo: "",
          subject: "",
          supplierId: 0,
          treatmentMethod: "",
          treatmentTimeLimit: '',
          disabled:false,
          isFatalSelect:false
        },
        d8Congratulation: {
          abnormalId: '',
          closeState: 0,
          disciplineId: '',
          members: [],
          operateTime: new Date(),
          operatorId: '',
          opinion: ""
        },
        d3Contain: {
          abnormalId: '',
          attachments: [],
          disciplineId: '',
          operateTime: new Date(),
          operatorId: '',
          operatorName: "",
          policy: "",
          treatmentMethod: ""
        },
        d4Cause: {
          abnormalCauseId: '',
          abnormalCauseName: "",
          abnormalCauseTypeId: '',
          abnormalCauseTypeName: "",
          abnormalId: '',
          attachmentGroupId: '',
          causeIdentify: "",
          disciplineId: '',
          operateTime: new Date(),
          operatorId: '',
          operatorName: "",
          attachments: [],
        },
        d5Plan: {
          abnormalId: '',
          attachmentId: '',
          disciplineId: '',
          operateTime: new Date(),
          operatorId: '',
          operatorName: "",
          policy: "",
          treatmentMethod: ""
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
        d2Description: {
          abnormalId: '',
          description: "",
          disciplineId: 0,
          operateTime: new Date(),
          operatorId: '',
        },
        d1Team: {
          abnormalId: '',
          createTime: new Date(),
          creatorId: '',
          disciplineId: '',
          leaderId: '',
          leaderName: '',
          members: []
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
                title: i18n.t('pqc.no'),
                width:50,
                align: 'center',
                render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm)
              },
              // {
              //   title: '缺陷名称',
              //   minWidth: 120,
              //   // maxWidth:50
              //   align: 'center',
              //   key: 'defectTypeId',
              //   render: (h, params) => {
              //     let _this = this;
              //     return h('Select',
              //       {
              //         props:{
              //           value: this.defectRecords.table.data[params.index].defectTypeId,
              //           disabled:this.other.basicD1D2Show,
              //           filterable:true
              //         },
              //         on:{
              //           'on-change':(value) => {
              //             this.defectRecords.table.data[params.index].defectTypeId = value;
              //             this.onDefectTypeSelectChange(this.defectRecords.table.data[params.index].defectTypeId,params.index)
              //           }
              //         }
              //       },
              //       this.defectRecords.prodBatch.DefectName.map(function(type){
              //         return h('Option', {props: {value: type.defectTypeId,label:type.name}},type);
              //       })
              //     );
              //   }
              // },
              // {
              //   title: '检验项目',
              //   key: 'inspectionTypeName',
              //   align: 'center',
              //   minWidth: 100,
              //   render: (h, params) => {
              //     let _this = this;
              //     let texts = '';
              //     //texts=params.row.inspectionTypeName
              //     return h('div', [h
              //     ('Input',{
              //       props: {
              //         type: 'text',
              //         disabled:true,
              //         value:params.row.inspectionTypeName
              //       }
              //     })
              //     ])
              //   }
              // },
              {
                title: i18n.t('pqc.inspection'),
                width:160,
                align: 'center',
                ellipsis:true,
                minWidth: 160,
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
                    vm.other.basicD1D2Show||vm.noPermsDis,
                  )
                  return ret(h,params);
                }
              },
              {
                title: i18n.t('pqc.defectName'),
                minWidth: 120,
                // maxWidth:50
                align: 'center',
                key: 'defectTypeId',
                render: (h, params) => {
                  let _this = this;
                  return h('Select',
                    {
                      props:{
                        value: this.defectRecords.table.data[params.index].defectTypeId,
                        disabled:this.other.basicD1D2Show||this.noPermsDis,
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
              },
              {
                title: i18n.t('pqc.defectGrade'),
                align: 'center',
                minWidth: 100,
                key: 'qualityLevelId',
                render: (h, params) => {
                  let _this = this;
                  return h('Select',
                    {
                      props:{
                        value: this.defectRecords.table.data[params.index].qualityLevelId,
                        disabled:this.other.basicD1D2Show||this.noPermsDis,
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
                title: i18n.t('pqc.defectPosition'),
                align: 'center',
                minWidth: 120,
                key: 'defectLocationId',
                render: (h, params) => {
                  let _this = this;
                  return h('Select',
                    {
                      props:{
                        value: this.defectRecords.table.data[params.index].defectLocationId,
                        disabled:this.other.basicD1D2Show||this.noPermsDis,
                        placeholder:i18n.t('pqc.wu')
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
              },
              {
                title: i18n.t('pqc.sampleQuantity'),
                align: 'center',
                minWidth: this.$store.state.locale=='zh_CN'?80:120,
                key: 'sampleQuantity',
                render: (h, params) => {
                  var me = this
                  return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: me.defectRecords.table.data[params.index].sampleQuantity,
                      disabled:this.other.basicD1D2Show||this.noPermsDis,
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
                title: i18n.t('pqc.dn'),
                align: 'center',
                minWidth: this.$store.state.locale=='zh_CN'?80:120,
                key: 'defectQuantity',
                render: (h, params) => {
                  var me = this
                  return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      value: me.defectRecords.table.data[params.index].defectQuantity,
                      disabled:this.other.basicD1D2Show||this.noPermsDis,
                    },
                    on: {
                      'on-blur':(event) => {
                        this.defectRecords.table.data[params.index].defectQuantity = event.target.value;
                        this.defectRate(this.defectRecords.table.data[params.index].defectQuantity,this.defectRecords.table.data[params.index].sampleQuantity,params.index)
                      }
                    }
                  })
                  ])
                }
              },{
                title: i18n.t('pqc.defectRates'),
                align: 'center',
                minWidth: this.$store.state.locale=='zh_CN'?80:120,
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
                        // alert('ok0')
                        // if(event.target.value==Infinity||event.target.value==NaN){
                        //   alert('ok1')
                        //   event.target.value=0;
                        //   this.defectRecords.table.data[params.index].defectRate=0;
                        // }
                      }
                    }
                  })
                  ])
                }
              },
              {
                title: i18n.t('pqc.remarks'),
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
                title: i18n.t('pqc.picture'),
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
              defectRecordId: '',
              defectTypeId: '',
              defectRate: '',
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
            indeV:0,
            DefectId:'',
            iqcId:'',
            ParameterDeta:false,
            selected:false,
            disabled:true,
            turrn:false,
            ShowState:false,
            TableLength:0,
            reviewProcessShow:false,
            defectNumber:0,
            AuditStatus:'',
            productON:[],
            productNames:[],
            productSpec:[],
            productTypeName:[],
            dataTable:[],
            spectorNameData:[],
            chkshiftData:[],
            DefectName:[],
            DefectGrade:[],
            DefectPosition:[],
            chkValMapData:[],
            dataTableAll:[],
            btnState:'',
            ProcessingData:[],
          }
        },
        ruleForm:{
          productId:'',
          productNames:'',
        },
        prodBatch:{
          productON:[],
          customerList:[],
          supplierList:[],
          pqcList:[],
          prodbatchList:[],
        },
        other:{
          optList:[
            {value:"REJECT",label:i18n.t('pqc.rg')},
            {value:"REWORK",label:i18n.t('pqc.rework')},
            {value:"SCREEN",label:i18n.t('pqc.filtrate')},
            {value:"SPECIAL_ADOPTION",label:i18n.t('pqc.speclelAdoption')},
            {value:"EMERGENCY_RELEASE",label:i18n.t('pqc.er')},
            {value:"SCRAP",label:i18n.t('pqc.scrap')},
          ],
          timeList:[
            {value:4,label:'4H'},
            {value:12,label:'12H'},
            {value:24,label:'24H'},
            {value:36,label:'36H'},
            {value:48,label:'48H'},
            {value:96,label:'96H'},
          ],
          disabled:false,
          userList:[],
          currentUser:{},
          D3AndD8Show:true,
          abnormalReason:[],
          basicD1D2Show:false,
          commitShow:false,
          D8Edit:true,
          D3D4Edit:false,
          closeCaseButton:false,
          saveButton:false,
          teamList:[],
          batchNoShow:false,
          disabled2:false,
          commitButton:false,
          d4Value:'',
          d4UploadShow:false,
          spinShow:false
        },
        teamAddButton1:{
          show:true,
        },
        teamSelect1:{
          show:false,
        },
        teamAddButton2:{
          show:true,
        },
        teamSelect2:{
          show:false,
        },
        memberId:'',
        team:{},
        team2:{},
        permsCur:[
          "UPDATE_PQC_ABNORMAL",
          "INSERT_PQC_ABNORMAL"
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "UPDATE_PQC_ABNORMAL":false,
          "INSERT_PQC_ABNORMAL":false,
        },
        noPermsDis:true,
        productList:[],
        loadingRemote:false,
        source:null,//存放取消的请求方法
      }
    },

    created(){
      let that = this;
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      that.initData();

      

    },
    methods:{
      getProductName(productId){
        let that = this;
        if(productId){
          that.$http.get('/basic/product/detail/'+productId).then(function(resp){
            that.basic.productNo=resp.data.no;
            that.basic.productName=resp.data.name;
          })
        }

      },
      remoteMethod: _.debounce(function(query) {//debounce去抖
        let that = this;
        that.loadingRemote = true;
        if (query !== '') {
          that.cancelQuest();//在请求发出前取消上一次未完成的请求；
          //发送请求
          that.$nextTick(()=>{
            that.$http.get('/basic/product/simple?page=1&limit=999999&examType=2&useState=1&fieldName=no,name&query='+query,{
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
          this.source(i18n.t('pqc.TerminationRequest')); //取消请求
        }
      },
      getInspectiontype(){//获取检验项目下拉框
        let that=this; 
        let resp = that.$iqis.utils.syncget('/basic/inspectiontype?page=1&limit=99999');
        let root = {title:i18n.t('pqc.projectType'),selected: false,label:i18n.t('pqc.projectType'),value:0,expand:true};
        that.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
        that.selects.inspectionTypes = [root];
        // //console.log(that.selects.inspectionTypes,'检验项目数据')
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

        let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+o.inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
        newRow['defectTypeList'] = resp ? resp.data||[]:[];
        that.defectRecords.table.data[index] = newRow;
        that.$set(that.defectRecords.table.data, index, newRow);
        return;
      },
      initData(){
        //如果是修改出货检验异常，就可以拿到id
        let that = this;
        let abnormalId = that.$props.params && that.$props.params.abnormalId;
        // this.getBlock();
        // let that = this;
        //获取检验单号等信息
        that.getOqcList();
        //获取产品类别
        that.productName();
        //获取客户
        that.getCustomerList();
        //所属供应商
        that.getSupplierList();
        //获取产品批号
        that.getProdbatchList();
        //获取缺陷
        that.getDefectData();
        //获取数据
        that.getSelectData();
        //获取异常原因
        that.getAbnormalReason();
        //获取当前登录用户
        that.getCurrentOperator();

        that.getInspectiontype();

        if(abnormalId==null){
          //只显示D1和D2
          that.other.D3AndD8Show=false;
          that.other.saveButton=true;
          that.other.commitButton=true;
        }else{
          this.abnormalId = abnormalId;
          that.changeDefect=false;
          let url="/examinecenter/pqc/pqc?page=1&limit=99999"
          that.$http.get(url).then((res)=>{
            // that.prodBatch.pqcList=res.data
            url="/examinecenter/pqc/abnormal/"+abnormalId
            that.$http.get(url).then((res)=>{
              //console.log(res,1212)
              res.data.basic.createTime=res.data.basic.createTime?new Date(res.data.basic.createTime):'';
              res.data.basic.auditTime=res.data.basic.auditTime?new Date(res.data.basic.auditTime):'';
              res.data.d2Description.operateTime=res.data.d2Description.operateTime?new Date(res.data.d2Description.operateTime):'';
              res.data.d1Team.createTime=res.data.d1Team.createTime?new Date(res.data.d1Team.createTime):'';
              res.data.d3Contain.operateTime=res.data.d3Contain.operateTime?new Date(res.data.d3Contain.operateTime):'';
              res.data.d4Cause.operateTime= res.data.d4Cause.operateTime?new Date(res.data.d4Cause.operateTime):'';
              res.data.d5Plan.operateTime= res.data.d5Plan.operateTime?new Date(res.data.d5Plan.operateTime):'';
              res.data.d6Effect.operateTime= res.data.d6Effect.operateTime?new Date(res.data.d6Effect.operateTime):'';
              res.data.d7Prevention.operateTime= res.data.d7Prevention.operateTime?new Date(res.data.d7Prevention.operateTime):'';
              res.data.d8Congratulation.operateTime=res.data.d8Congratulation.operateTime?new Date(res.data.d8Congratulation.operateTime):'';
              if(!res.data.basic.qcNo){ 
                that.isF = false;
              }
              that.basic=res.data.basic;
              // if(res.data.basic==''){
              //   that.basic.qcNo==i18n.t('pqc.wu')
              // }
              that.defectRecords.table.data=res.data.defectRecords;
              if(that.defectRecords.table.data){
                for(let i in that.defectRecords.table.data){
                  let inspectionTypeId = that.defectRecords.table.data[i].inspectionTypeId;
                  let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
                  let defectTypeList = resp ? resp.data||[] : [];
                  that.defectRecords.table.data[i]['defectTypeList'] = defectTypeList;
                  if(!that.defectRecords.table.data[i].defectLocationId){
                    that.defectRecords.table.data[i].defectLocationId=i18n.t('pqc.wu');
                  }
                  that.defectRecords.table.data[i]['defectNumber']=i
                }
              }
              for(var i = 0;i<that.defectRecords.table.data.length;i++){
                if(that.defectRecords.table.data[i].attachments==null){
                  that.defectRecords.table.data[i].attachments=new Array();
                }
              }
              that.d1Team=res.data.d1Team;
              for(var i = 0;i<res.data.d1Team.members.length;i++){
                that.other.teamList.push(res.data.d1Team.members[i])
              }
              var flag= false;
              for(var i = 0;i<that.other.teamList.length;i++){
                if(that.other.teamList[i].memberId==that.d1Team.leaderId){
                  flag=true;
                  break;
                }
              }
              if(!flag){
                for(var i=0;i<that.other.userList.length;i++){
                  if(that.other.userList[i].userId==that.d1Team.leaderId){
                    let member={memberId:that.other.userList[i].userId,memberName:that.other.userList[i].name}
                    that.other.teamList.push(member)
                  }
                }
              }

              /*var flag = false;
              for(var i = 0;i<res.data.d1Team.members.length;i++){
                for(var j = 0;j<that.other.teamList.length;j++){
                  if(res.data.d1Team.members[i].memberId==that.other.teamList[j]){
                    flag =true;
                    break
                  }
                }
                if(!flag){
                  that.other.teamList.push(res.data.d1Team.members[i].memberId)
                  flag = false;
                }
              }*/
              that.d2Description=res.data.d2Description;
              that.d3Contain=res.data.d3Contain;
              if(that.d3Contain.attachments==null){
                that.d3Contain.attachments=new Array();
              }
              that.d4Cause=res.data.d4Cause;
              if(that.d4Cause.attachments==null){
                that.d4Cause.attachments=new Array();
              }
              that.d5Plan=res.data.d5Plan;
              if(that.d5Plan.attachments==null){
                that.d5Plan.attachments=new Array();
              }
              that.d6Effect=res.data.d6Effect;
              if(that.d6Effect.attachments==null){
                that.d6Effect.attachments=new Array();
              }
              that.d7Prevention=res.data.d7Prevention;
              if(that.d7Prevention.attachments==null){
                that.d7Prevention.attachments=new Array();
              }
              that.other.spinShow=true
              /*else{
                var d4Value=JSON.stringify(that.d4Cause.attachments)
                //that.$refs.d4Upload.value=d4Value
                that.other.d4Value=d4Value
                that.other.d4UploadShow=true;
                //alert(that.$refs.d4Upload)
               // that.other.d4Value=d4Value;
                ////console.log("哈哈哈哈可以拿到",that.$refs.d4Upload.$props.value)

              }*/

              res.data.d8Congratulation.operatorId = res.data.d2Description.operatorId
              that.d8Congratulation=res.data.d8Congratulation;

              for(let x in that.defectRecords.table.data){
                that.defectRate(that.defectRecords.table.data[x].defectQuantity,that.defectRecords.table.data[x].sampleQuantity,x);
              }
              if(that.basic.isFatal==1){
                that.basic.isFatalSelect=true;
              }else{
                that.basic.isFatalSelect=false;
              }
              // that.teamAddButton1.show=false;
              // that.teamSelect1.show=true;
              // that.teamAddButton2.show=false;
              // that.teamSelect2.show=true;

              // if(that.basic.isFatal==1){
              //   that.basic.isFatal=true;
              // }else{
              //   that.basic.isFatal=false;
              // }
              let state = that.basic.abnormalState;
              //未提交
              // if(state==0){
              //   that.other.D3AndD8Show=false;
              //   that.d2Description.operatorId=that.other.currentUser.userId;
              //   that.d2Description.operateTime=new Date();
              //   that.d1Team.creatorId=that.other.currentUser.userId;
              //   that.d1Team.createTime=new Date();
              //   that.other.saveButton=true;
              //   that.other.commitButton=true;
              // }
              //待审核
              if(state==1){
                that.other.basicD1D2Show=true;
                that.other.D3AndD8Show=false;
                that.other.disabled=true;
                that.other.disabled2=true;
                that.other.batchNoShow=true;
              }
              //处理中
              if(state==5){
                that.other.disabled=true;
                that.other.basicD1D2Show=true;
                that.other.disabled2=true;
                that.other.batchNoShow=true;

                //如果是当前登录用户是小组成员，则显示保存按钮
                var temp = that.other.teamList;
                for(var i = 0;i<temp.length;i++){
                  if(temp[i].memberId==that.other.currentUser.userId){

                    //bug修复 修改后面负责人会覆盖前面负责人的问题
                    if(that.d3Contain.policy==null&&that.d3Contain.treatmentMethod==null){
                      that.d3Contain.operatorId=that.other.currentUser.userId;
                      that.d3Contain.operateTime=new Date()

                    }
                    if(that.d4Cause.causeIdentify==null&&that.d4Cause.complaintCauseId==null){
                      that.d4Cause.operatorId=that.other.currentUser.userId;
                      that.d4Cause.operateTime=new Date()
                      
                    }
                    if(!that.d5Plan.policy&&!that.d5Plan.treatmentMethod){
                      that.d5Plan.operatorId=that.other.currentUser.userId;
                      that.d5Plan.operateTime=new Date()

                    }
                    if(!that.d6Effect.effect&&!that.d6Effect.verificationMethod){
                      that.d6Effect.operatorId=that.other.currentUser.userId
                      that.d6Effect.operateTime=new Date()
                      
                    }
                    if(!that.d7Prevention.preventive){
                      that.d7Prevention.operatorId=that.other.currentUser.userId;
                      that.d7Prevention.operateTime=new Date()

                    }
                    that.other.D3D4Edit=false;
                    that.other.saveButton=true;
                    that.other.commitButton=false;
                    flag = true;
                    if(that.basic.abnormalState==5){
                      if(that.d3Contain.operateTime===''||
                        that.d3Contain.operateTime==null||
                        that.d3Contain.operatorId===''||
                        that.d3Contain.operatorId==null||
                        that.d3Contain.policy===''||
                        that.d3Contain.policy==null||
                        that.d3Contain.treatmentMethod===''||
                        that.d3Contain.treatmentMethod==null||
                        that.d4Cause.causeIdentify===''||
                        that.d4Cause.causeIdentify==null||
                        that.d4Cause.operateTime===''||
                        that.d4Cause.operateTime==null||
                        that.d4Cause.operatorId===''||
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
                        flag=false;
                      }
                      if(flag){
                        that.other.closeCaseButton=true;
                        that.other.saveButton=true;
                      }else{
                        that.other.closeCaseButton=false;

                      }
                    }
                    break
                  }
                  that.other.D3D4Edit=true;
                }

                /*let temp = that.prodBatch.customerList;
                for(var i =0;i<temp.length;i++){
                  if(that.other.currentUser.userId==temp[i].userId){
                    that.other.D3D4Edit=true;
                    break
                  }
                }*/

              }
              //审核驳回
              if(state==0||state==3){
                if(that.basic.creatorId==that.other.currentUser.userId){
                  that.other.D3AndD8Show=false;
                  // that.d2Description.operatorId=that.other.currentUser.userId;
                  that.d2Description.operateTime=new Date();
                  // that.d1Team.creatorId=that.other.currentUser.userId;
                  that.d1Team.createTime=new Date();
                  that.other.commitButton=true;
                  that.other.saveButton=true;
                }else{
                  that.other.basicD1D2Show=true;
                  that.other.D3AndD8Show=false;
                  that.other.disabled=true;
                }

              }
              //已结案
              if(state==9){
                that.other.basicD1D2Show=true;
                that.other.D3D4Edit=true;
                that.other.disabled=true;
                that.other.disabled2=true;
                that.other.batchNoShow=true;
              }
              //待结案
              if(state==8){
                that.other.basicD1D2Show=true;
                that.other.D3D4Edit=true;
                that.other.disabled=true;
                that.other.disabled2=true;
                that.other.batchNoShow=true;
                if(that.basic.creatorId!=that.other.currentUser.userId){
                  that.other.D8Edit=true;
                }else{
                  that.other.D8Edit=false;
                  that.d8Congratulation.operatorId=that.other.currentUser.userId;
                  that.d8Congratulation.operateTime=new Date();
                }
              }
            })
          })

        }
        if(((!that.abnormalId&&that.permsBtn.INSERT_PQC_ABNORMAL)||(that.abnormalId&&that.permsBtn.UPDATE_PQC_ABNORMAL))){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
        that.basic.qcNo=that.$props.params && that.$props.params.qcNo;
        if(that.basic.qcNo){
          that.changeOqcNo()
          that.changeDefect=true;
          that.getDefectRecord(that.basic.qcNo)
        }
      },

      defectRate(obj1,obj2,index){
        let that=this;
        if(obj1!==''&& obj2!==''){
          /*alert("index:"+index)
          alert("obj1:"+obj1)
          alert("obj2:"+obj2)*/
         /*  let x=obj1/obj2*100;
          x = x.toFixed(2); */
           let x=obj1/obj2*100;
           
           if(x > 100){
             that.defectRecords.table.data[index].defectRate= '100%'
           }else{
             x = Math.floor(x * 100) / 100;
             that.defectRecords.table.data[index].defectRate=x+'%';
           }
        }
      },
      //改变产品批号
      changeBatchNo(){
        let that = this;
        let tempList=that.prodBatch.prodbatchList;
        for(var i = 0;i<tempList.length;i++){
          if(that.basic.batchNo==tempList[i].batchNo){
            that.other.disabled=true;
            that.basic.productId=tempList[i].productId;
            that.basic.productNo=tempList[i].productNo;
            that.basic.productName=tempList[i].productName;
            that.basic.customerId=tempList[i].customerId;
            that.basic.customerName=tempList[i].customerName;
            that.basic.batchQuantity=tempList[i].batchQuantity;
            that.basic.batchNo=tempList[i].batchNo;
          }
        }
      },
      //确认框弹出层提示
      confirmCommit(){
        this.$Modal.confirm({
          content: i18n.t('pqc.submitNotChange'),
          loading:true,
          onOk: () => {
            this.remove()
            this.commit();
          },
          onCancel: () => {
          }
        });
      },
      //解决弹出框中的确认按钮在快速点击的情况下执行多次的问题
      remove(){
        setTimeout(() => {
          this.$Modal.remove()
        }, 100);
      },
      confirmCloseCase(){
        this.$Modal.confirm({
          content: i18n.t('pqc.endNotChange'),
          onOk: () => {
            this.closeCase();
            
          },
          onCancel: () => {
          }
        });
      },

      //计算缺陷率
      reckonDefectRate(index){

      },
      //结案
      closeCase(){
        let that=this;
        let params = [
          {type:'Empty',title:i18n.t('pqc.opinion'),value:that.d8Congratulation.opinion},
          {type:'Word600',title:i18n.t('pqc.opinion'),value:that.d8Congratulation.opinion},
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
        let url='/examinecenter/pqc/abnormal/complete?abnormalId='+that.basic.abnormalId;
        let	parmas=that.d8Congratulation

        that.$http.post(url,parmas,that.headers).then((res)=> {
          that.$Message.success(i18n.t('pqc.endSuccess'));
          this.$store.commit('RENDER_CHANGE',true)
          this.$emit("close-tab",this.$props.tabKey);
        })
      },
      // 判断D3和D4有没有填写完
      checkD3D4(){
        let that = this;
        let temp = that.d3Contain;
        if(temp.policy==''||temp.treatmentMethod==''||temp.operatorId==''||temp.operateTime==''){
          return false;
        }
      },
      // 审核通过
      auditingPass(){
        let that = this;
        let url="/examinecenter/pqc/abnormal/audit?abnormalId="+that.basic.abnormalId+"&checked="+"1"
        that.$http.post(url).then((res)=>{
          that.$Message.success(i18n.t('pqc.auditSuccess'));
          this.$store.commit('RENDER_CHANGE',true)
          this.$emit("close-tab",this.$props.tabKey);
        })
      },
      //审核驳回
      auditingReject(){
        let that = this;
        let url="/examinecenter/pqc/abnormal/audit?abnormalId="+that.basic.abnormalId+"&checked="+"0"
        that.$http.post(url).then((res)=>{
          that.$Message.success(i18n.t('pqc.auditSuccess'));
          this.$store.commit('RENDER_CHANGE',true)
          this.$emit("close-tab",this.$props.tabKey);
        })
      },
      //提交
      commit(){
        let that = this;
        let params = [
          {type:'Empty',title:i18n.t('pqc.occurrenceTime'),value:that.basic.createTime},
          {type:'Empty',title:i18n.t('pqc.abnNo'),value:that.basic.abnormalNo},
          {type:'No',title:i18n.t('pqc.abnNo'),value:that.basic.abnormalNo},
          // {type:'Empty',title:i18n.t('pqc.ln'),value:that.basic.batchNo},
          {type:'Empty',title:i18n.t('pqc.place'),value:that.basic.abnormalPlace},
          {type:'Word20',title:i18n.t('pqc.place'),value:that.basic.abnormalPlace},
          {type:'Empty',title:i18n.t('pqc.pn'),value:that.basic.productId},
          // {type:'Empty',title:i18n.t('pqc.belongSupplier'),value:that.basic.supplierId},          
          {type:'Empty',title:i18n.t('pqc.il'),value:that.basic.batchQuantity},
          {type:'NumNot0',title:i18n.t('pqc.il'),value:that.basic.batchQuantity},
          // {type:'Empty',title:i18n.t('pqc.qcNum'),value:that.basic.inspectionQuantity},
          {type:'Num',title:i18n.t('pqc.qcNum'),value:that.basic.inspectionQuantity},
          {type:'Empty',title:i18n.t('pqc.badNumber'),value:that.basic.badQuantity},
          {type:'Num',title:i18n.t('pqc.badNumber'),value:that.basic.badQuantity},
          {type:'Empty',title:i18n.t('pqc.treatmentMethod'),value:that.basic.treatmentMethod},
          {type:'Empty',title:i18n.t('pqc.tl'),value:that.basic.treatmentTimeLimit},
          {type:'Empty',title:i18n.t('pqc.theme'),value:that.basic.subject},
          {type:'Word20',title:i18n.t('pqc.theme'),value:that.basic.subject},
          {type:'Empty',title:i18n.t('pqc.abnDescribe'),value:that.d2Description.description},
          {type:'Word600',title:i18n.t('pqc.abnDescribe'),value:that.d2Description.description},
          {type:'Empty',title:i18n.t('pqc.auditor'),value:that.basic.auditorId},
          {type:'Empty',title:i18n.t('pqc.leader'),value:that.d1Team.leaderId},
          {type:'EmptyLength',title:i18n.t('pqc.teamMember'),value:that.d1Team.members},
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
        let url = '/examinecenter/pqc/abnormal/apply';
        for(let i=0;i<that.defectRecords.table.data.length;i++){
          
          if(that.defectRecords.table.data[i].inspectionTypeId==''||that.defectRecords.table.data[i].defectTypeId==''|| that.defectRecords.table.data[i].sampleQuantity===''|| that.defectRecords.table.data[i].defectQuantity===''){
              // that.$Notice.warning({title: '请填写第'+(i+1)+'条缺陷记录'});
              that.$Notice.warning({title: i18n.t('pqc.qtx')+(i+1)+i18n.t('pqc.tqx')});
              return;
          }
          let paramsDefects = [
            {type: 'Num', title: i18n.t('pqc.sampleQuantity'), value: that.defectRecords.table.data[i].sampleQuantity},
            {type: 'Num', title: i18n.t('pqc.dn'), value: that.defectRecords.table.data[i].defectQuantity},
          ]
          let state = true;
          for (let j in paramsDefects) {
            state = that.$iqis.utils.formValidate(paramsDefects[j].type, paramsDefects[j].title, paramsDefects[j].value, (tips) => {
              that.$Notice.warning({title: tips})
            })
            if(!state){return;break;}
          }
        }
        for(let i=0;i<that.defectRecords.table.data.length;i++){
          
          if(that.defectRecords.table.data[i].defectLocationId==i18n.t('pqc.wu')){
            that.defectRecords.table.data[i].defectLocationId='';
          }
        }
        if(that.basic.abnormalId){
          if(that.basic.abnormalState==0||that.basic.abnormalState==3){
            let params = {
              basic:that.basic,
              d1Team:that.d1Team,
              d2Description:that.d2Description,
              defectRecords:that.defectRecords.table.data,
            }
            /* params = {
               basic:that.basic,
               d1Team:that.d1Team,
               d2Description:that.d2Description,
               defectRecords:that.defectRecords.table.data,
             }
             //alert("呵呵呵"+that.basic.abnormalState)
             url="/examinecenter/pqc/abnormal"
             that.$http.put(url,params,that.headers).then((res)=> {*/
            // if(that.basic.abnormalState==5){
            //   //修改数据
            //   let tempData = that.defectRecords.table.data;
            //   for(var i=0;i<tempData.length;i++){
            //     tempData[i].abnormalId=that.basic.abnormalId;
            //   }
            //   params={
            //     basic:that.basic,
            //     d1Team:that.d1Team,
            //     d2Description:that.d2Description,
            //     d4Cause:that.d4Cause,
            //     d3Contain:that.d3Contain,
            //     d5Plan:that.d5Plan,
            //     d6Effect:that.d6Effect,
            //     d7Prevention:that.d7Prevention,
            //     defectRecords:that.defectRecords.table.data,
            //   }
            //   that.$http.put("/examinecenter/pqc/abnormal",params,that.headers).then((res)=> {
            //     params = {
            //       abnormalId:that.basic.abnormalId
            //     }
            //     that.$http.post(url, params).then((res) => {
            //       that.$Message.success(i18n.t('pqc.cs'));
            //       this.$store.commit('RENDER_CHANGE',true)
            //       this.$emit("close-tab", this.$props.tabKey);
            //     })
            //   })
            // }
            that.$http.put("/examinecenter/pqc/abnormal",params,that.headers).then((res)=> {
              let params = {
                abnormalId:that.basic.abnormalId
              }
              that.$http.post('/examinecenter/pqc/abnormal/apply', params).then((res) => {
                that.$Message.success(i18n.t('pqc.cs'));
                this.$store.commit('RENDER_CHANGE',true)
                this.$emit("close-tab", this.$props.tabKey);
              })
            })
            return ;
          }
          if(that.basic.abnormalState==5){
            let params={
              basic:that.basic,
              d1Team:that.d1Team,
              d2Description:that.d2Description,
              d4Cause:that.d4Cause,
              d3Contain:that.d3Contain,
              d5Plan:that.d5Plan,
              d6Effect:that.d6Effect,
              d7Prevention:that.d7Prevention,
              d8Congratulation:that.d8Congratulation,
              defectRecords:that.defectRecords.table.data,
            }
            that.$http.put("/examinecenter/pqc/abnormal",params,that.headers).then((res)=> {
              let params = {
                abnormalId:that.basic.abnormalId
              }
              that.$http.post("/examinecenter/pqc/abnormal/apply-complete", params).then((res) => {
                that.$Message.success(i18n.t('pqc.cs'));
                this.$store.commit('RENDER_CHANGE',true)
                this.$emit("close-tab", this.$props.tabKey);
              })
            })
          }
        }else{
          //如果第一次添加，用户没有点保存的情况下，直接点的提交
          url='/examinecenter/pqc/abnormal';
          that.basic.creatorId=that.other.currentUser.userId;
          let	parmas={
            basic:that.basic,
            d1Team:that.d1Team,
            d2Description:that.d2Description,
            defectRecords:that.defectRecords.table.data,
          }
          that.$http.post(url,parmas,that.headers).then((res)=> {
            url = '/examinecenter/pqc/abnormal/apply?abnormalId='+res.data.basic.abnormalId;
            that.$http.post(url,that.headers).then((res)=> {
              that.$Message.success(i18n.t('pqc.cs'));
              this.$store.commit('RENDER_CHANGE',true)
              this.$emit("close-tab",this.$props.tabKey);
            })
          })
        }

      },
      //取消
      cancel(){
        this.$store.commit('RENDER_CHANGE',true)
        this.$emit("close-tab",this.$props.tabKey);
      },
      //保存
      save(){
        let that=this;
        that.basic.creatorId=that.d2Description.operatorId;
        let params = [
          {type:'Empty',title:i18n.t('pqc.occurrenceTime'),value:that.basic.createTime},
          {type:'Empty',title:i18n.t('pqc.abnNo'),value:that.basic.abnormalNo},
          {type:'No',title:i18n.t('pqc.abnNo'),value:that.basic.abnormalNo},
          // {type:'Empty',title:i18n.t('pqc.ln'),value:that.basic.batchNo},
          {type:'Empty',title:i18n.t('pqc.place'),value:that.basic.abnormalPlace},
          {type:'Word20',title:i18n.t('pqc.place'),value:that.basic.abnormalPlace},
          {type:'Empty',title:i18n.t('pqc.pn'),value:that.basic.productId},
          // {type:'Empty',title:i18n.t('pqc.belongSupplier'),value:that.basic.supplierId},   1902 【添加过程异常】必填项判断不对；过程异常的供应商是非必填的，可以空着；
          {type:'Empty',title:i18n.t('pqc.il'),value:that.basic.batchQuantity},
          {type:'NumNot0',title:i18n.t('pqc.il'),value:that.basic.batchQuantity},
          // {type:'Empty',title:i18n.t('pqc.qcNum'),value:that.basic.inspectionQuantity},
          {type:'Num',title:i18n.t('pqc.qcNum'),value:that.basic.inspectionQuantity},
          {type:'Empty',title:i18n.t('pqc.badNumber'),value:that.basic.badQuantity},
          {type:'Num',title:i18n.t('pqc.badNumber'),value:that.basic.badQuantity},
          {type:'Empty',title:i18n.t('pqc.treatmentMethod'),value:that.basic.treatmentMethod},
          {type:'Empty',title:i18n.t('pqc.tl'),value:that.basic.treatmentTimeLimit},
          {type:'Empty',title:i18n.t('pqc.theme'),value:that.basic.subject},
          {type:'Word20',title:i18n.t('pqc.theme'),value:that.basic.subject},
          {type:'Word600',title:i18n.t('pqc.abnDescribe'),value:that.d2Description.description},

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
        let url='/examinecenter/pqc/abnormal';

        for(let i=0;i<that.defectRecords.table.data.length;i++){
          
          if(that.defectRecords.table.data[i].inspectionTypeId==''||that.defectRecords.table.data[i].defectTypeId==''|| that.defectRecords.table.data[i].sampleQuantity===''|| that.defectRecords.table.data[i].defectQuantity===''){
              that.$Notice.warning({title: i18n.t('pqc.qtx')+(i+1)+i18n.t('pqc.tqx')});
              return;
          }
          let paramsDefects = [
            {type: 'NumNot0', title: i18n.t('pqc.sampleQuantity'), value: that.defectRecords.table.data[i].sampleQuantity},
            {type: 'Num', title: i18n.t('pqc.dn'), value: that.defectRecords.table.data[i].defectQuantity},
          ]
          let state = true;
          for (let j in paramsDefects) {
            state = that.$iqis.utils.formValidate(paramsDefects[j].type, paramsDefects[j].title, paramsDefects[j].value, (tips) => {
              that.$Notice.warning({title: tips})
            })
            if(!state){return;break;}
          }
        }
        for(let i=0;i<that.defectRecords.table.data.length;i++){
          
          if(that.defectRecords.table.data[i].defectLocationId==i18n.t('pqc.wu')){
            that.defectRecords.table.data[i].defectLocationId='';
          }
        }
        let	parmas={
          basic:that.basic,
          d1Team:that.d1Team,
          d2Description:that.d2Description,
          d4Cause:that.d4Cause,
          d3Contain:that.d3Contain,
          d5Plan:that.d5Plan,
          d6Effect:that.d6Effect,
          d7Prevention:that.d7Prevention,
          d8Congratulation:that.d8Congratulation,
          defectRecords:that.defectRecords.table.data,
        }
        if(that.basic.abnormalId==''){
          that.basic.creatorId=that.other.currentUser.userId;
          parmas={
            basic:that.basic,
            d1Team:that.d1Team,
            d2Description:that.d2Description,
            defectRecords:that.defectRecords.table.data,
          }
          that.$http.post('/examinecenter/pqc/abnormal?type=save',parmas,that.headers).then((res)=> {
            that.$Message.success(i18n.t('pqc.as'));
            that.basic.abnormalId=res.data.basic.abnormalId;
            that.closePage();
            that.$emit("open-tab","exam-pqc-abnormal-update-"+that.basic.abnormalId,i18n.t('pqc.mpe')+"-"+that.basic.productNo,"page-exam-pqc-abnormal-add",{abnormalId:that.basic.abnormalId});
            for(let i = 0; i<that.defectRecords.table.data.length; i++){
              if(!that.defectRecords.table.data[i].defectLocationId){
                that.defectRecords.table.data[i].defectLocationId=i18n.t('pqc.wu');
              }
            }
          }).catch(function(error){
            that.other.spinShow=true
          })
        }else{
          //修改数据
          if(that.basic.abnormalState==5){
            let params = [
              {type:'Word600',title: i18n.t("pqc.D3"),value:that.d3Contain.policy},
              {type:'Word20',title: i18n.t("pqc.D3"),value:that.d3Contain.treatmentMethod},
              {type:'Word600',title: i18n.t("pqc.D4"),value:that.d4Cause.causeIdentify},
              {type:'Word600',title: i18n.t("pqc.D5"),value:that.d5Plan.policy},
              {type:'Word20',title: i18n.t("pqc.D5"),value:that.d5Plan.treatmentMethod},
              {type:'Word600',title: i18n.t("pqc.D6"),value:that.d6Effect.effect},
              {type:'Word20',title: i18n.t("pqc.D6"),value:that.d6Effect.verificationMethod},
              {type:'Word600',title: i18n.t("pqc.D7"),value:that.d7Prevention.preventive},
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
          }
          let tempData = that.defectRecords.table.data;
          for(var i=0;i<tempData.length;i++){
            tempData[i].abnormalId=that.basic.abnormalId;
          }
          let url="/examinecenter/pqc/abnormal"
          
          that.$http.get("/examinecenter/pqc/abnormal/"+that.basic.abnormalId).then((res)=> {
            if(res.data.basic.abnormalState==8||res.data.basic.abnormalState==9){
              that.initData();
              that.other.saveButton=false;
              if(res.data.basic.abnormalState==8){
                this.$Notice.warning({
                  title: i18n.t('pqc.submitStopEdit'),
                  desc: ''
                });
              }
              if(res.data.basic.abnormalState==9){
                this.$Notice.warning({
                  title: i18n.t('pqc.submitStopEdit'),
                  desc: ''
                });
              }

            }else {
              if(that.basic.abnormalState>=5){
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
                  let fileObj = {'url':d6File[i].url,'mime':d6File[i].url.substring(d6File[i].url.lastIndexOf(".")+1,d6File[i].url.length),'name':d6File[i].url.substring(d5File[i].url.lastIndexOf("/")+1,d6File[i].url.length)}
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

              that.$http.put('/examinecenter/pqc/abnormal?type=save',parmas,that.headers).then((res)=> {
                /*//如果状态为5 则显示提交按钮
                if(that.basic.abnormalState==5){
                  that.basic.commitShow=true;
                }*/
                //状态在处理中的时候  判断d3和d4有没有全部填写完

                that.$Message.success(i18n.t('pqc.ats'));
                for(let i = 0; i<that.defectRecords.table.data.length; i++){
                  if(!that.defectRecords.table.data[i].defectLocationId){
                    that.defectRecords.table.data[i].defectLocationId=i18n.t('pqc.wu');
                  }
                }
                if(that.basic.abnormalState==5){
                  
                  that.other.spinShow=false
                  that.$http.get(url="/examinecenter/pqc/abnormal/"+that.basic.abnormalId).then((res)=> {
                    that.d3Contain=res.data.d3Contain;
                    that.d3Contain.operateTime=new Date(that.d3Contain.operateTime);
                    that.d4Cause=res.data.d4Cause;
                    that.other.spinShow=true
                    if(that.d3Contain.attachments==null){
                      that.d3Contain.attachments=new Array();
                    }
                    if(that.d4Cause.attachments==null){
                      that.d4Cause.attachments=new Array();
                    }
                    that.d4Cause.operateTime=new Date(that.d4Cause.operateTime);
                    var flag = true;
                    if(that.basic.abnormalState==5){
                      if(that.d3Contain.operateTime===''||
                        that.d3Contain.operateTime==null||
                        that.d3Contain.operatorId===''||
                        that.d3Contain.operatorId==null||
                        that.d3Contain.policy===''||
                        that.d3Contain.policy==null||
                        that.d3Contain.treatmentMethod===''||
                        that.d3Contain.treatmentMethod==null||
                        that.d4Cause.causeIdentify===''||
                        that.d4Cause.causeIdentify==null||
                        that.d4Cause.operateTime===''||
                        that.d4Cause.operateTime==null||
                        that.d4Cause.operatorId===''||
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
                        flag=false;
                      }
                      if(flag){
                        that.other.closeCaseButton=true;
                      }else{
                        that.other.closeCaseButton=false;
                      }
                    }
                  }).catch(function(error){
                    that.other.spinShow=true
                  })
                }

              })
            }
          })

        }

      },
      //改变异常原因
      changeAbnormalCause(){
        let that = this;
        let temp = that.other.abnormalReason;
        for(var i=0;i<temp.length;i++){
          if(temp[i].abnormalId==that.d4Cause.abnormalCauseTypeId){
            that.d4Cause.abnormalCauseTypeName=temp[i].name;
            that.d4Cause.abnormalCauseId=temp[i].abnormalTypeId;
            that.d4Cause.abnormalCauseName=temp[i].abnormalCauseName;
            return ;
          }
        }
      },
      //获取异常原因
      getAbnormalReason(){
        let that = this;
        let url = '/basic/abnormal'
        that.$http.get(url).then((res)=>{
          that.other.abnormalReason=res.data;

        })
      },
      //改变小组组长时获得小组组长名称
      changeLeader(){
        let that = this;
        let temp = that.other.userList;
        for(var i=0;i<temp.length;i++){
          if(temp[i].userId==that.d1Team.leaderId){
            that.d1Team.leaderName=temp[i].name;
            return;
          }
        }
      },
      changeD7Perator(){
        let that = this;
        let temp = that.other.userList;
        for(var i=0;i<temp.length;i++){
          if(temp[i].userId==that.d7Prevention.operatorId){
            this.d7Prevention.operatorName=temp[i].name;
            return;
          }
        }
      },
      changeD6Perator(){
        let that = this;
        let temp = that.other.userList;
        for(var i=0;i<temp.length;i++){
          if(temp[i].userId==that.d6Effect.operatorId){
            this.d6Effect.operatorName=temp[i].name;
            return;
          }
        }
      },
      changeD5Perator(){
        let that = this;
        let temp = that.other.userList;
        for(var i=0;i<temp.length;i++){
          if(temp[i].userId==that.d5Plan.operatorId){
            this.d5Plan.operatorName=temp[i].name;
            return;
          }
        }
      },
      //改变D4-原因分析的负责人时获得负责人名称
      changeD4Perator(){
        let that = this;
        let temp = that.other.userList;
        for(var i=0;i<temp.length;i++){
          if(temp[i].userId==that.d3Contain.operatorId){
            this.d4Cause.operatorName=temp[i].name;
            return;
          }
        }
      },
      //改变D3-短期对策的负责人时获得负责人名称
      changePerator(){
        let that = this;
        let temp = that.other.userList;
        for(var i=0;i<temp.length;i++){
          if(temp[i].userId==that.d3Contain.operatorId){
            this.d3Contain.operatorName=temp[i].name;
            return;
          }
        }
      },
      //获取产品批号
      getProdbatchList(){
        let that=this;
        let url="/examinecenter/pqc/prodbatch?page=1&limit=9999&query=&fieldName="
        that.$http.get(url).then((res)=>{
          that.prodBatch.prodbatchList=res.data
        })
      },

      selectOn(val,index){
        let that = this;
        //that.productName(val);
        let tempData=[];
        tempData=that.prodBatch.productON;
        for(var i=0;i<tempData.length;i++){
          if(val==tempData[i].productId){
            that.ruleForm.productNames=tempData[i].name;
          }
        }
      },

      //获取当前登录人员信息 /tenant/user/profile
      getCurrentOperator(){
        let that=this;
        let url='/tenant/user/profile'
        that.$http.get(url).then((res)=>{
          that.other.currentUser=res.data;
          that.d2Description.operatorId=res.data.userId;
          that.d1Team.creatorId=res.data.userId;
          that.d3Contain.operatorId=res.data.userId;
          that.d3Contain.operatorName=res.data.name;
          that.d4Cause.operatorId=res.data.userId;
          that.d4Cause.operatorName=res.data.name;
          that.d8Congratulation.operatorId=res.data.userId;
        })
      },
      //当点击更多小组成员的时候改变标签，变成select标签
      changeLabel(){
        let that = this;
        that.teamAddButton1.show=false;
        that.teamSelect1.show=true;
      },
      //在D8结案分享当点击更多小组成员的时候改变标签，变成select标签
      changeLabel2(){
        let that = this;
        that.teamAddButton2.show=false;
        that.teamSelect2.show=true;
      },
      //选择D2成立小组里面小组成员，在后面添加小组名称
      selectTeam(){
        let that =this;
        let arr = new Array();
        for(var i = 0;i<that.d1Team.members.length;i++){
          arr.push(that.d1Team.members[i].memberId)
        }
        let member={memberId:that.other.team.userId,memberName:that.other.team.name}
        if(arr.indexOf(that.other.team.userId)==-1){
          that.d1Team.members.push(member)
        }else{
          that.$Notice.warning({title: i18n.t('pqc.memberExisted')});
        }
      },
      //选择D8结案分享里面小组成员，在后面添加小组名称
      selectTeam2(){
        let that =this;
        let arr = new Array();
        if(that.d8Congratulation.members==null){
          that.d8Congratulation.members=[];
        }
        for(var i = 0;i<that.d8Congratulation.members.length;i++){
          arr.push(that.d8Congratulation.members[i].memberId)
        }
        let member={memberId:that.other.team2.userId,memberName:that.other.team2.name}
        if(arr.indexOf(that.other.team2.userId)==-1){
          that.d8Congratulation.members.push(member)
        }else{
          that.$Notice.warning({title: i18n.t('pqc.memberExisted')});
        }

      },
      //D2成立小组-删除小组成员
      deleteMember(index){
        let that = this;
        that.d1Team.members.splice(index, 1);
      },
      //D8结案分享-删除小组成员
      deleteMember2(index){
        let that = this;
        that.d8Congratulation.members.splice(index, 1);
      },
      getSelectData(){
        let that = this;
        that.$http.all([
          //that.$http.get("/examinecenter/pqc/pqc",{params:{limit:99999999}}),
          //that.$http.get("/bas/manufacturer/allManufacturer",{params:{limit:999999999}}),
          that.$http.get("/tenant/user",{params:{limit:999999999}}),
          //that.$http.get("/basic/product",{params:{limit:999999999}})
        ]).then(function(resps){
          //that.prodBatch.pqcList= resps[0].data;
          //that.supplierList = resps[1].data;
          that.other.userList = resps[0].data;
          //that.productList = resps[3].data;
        });
      },
      // 缺陷部分-----------------------------------------------------
      getDefectData(){//获取缺陷记录
        let that=this;
        // that.$http.get('').then(function(resp){
        //   that.defectRecords.table.data=resp.data;
        that.getDefectTypeData();
        that.getDefectGradeData();
        that.getDefectPositionData();
        that.defectRecords.table.loading=false;
        // })
      },
      getDefectTypeData(){//获取缺陷名称
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
            that.defectRecords.table.data[index].qualityLevelId=that.defectRecords.prodBatch.DefectName[x].qltyLvId;//缺陷等级
            that.defectRecords.table.data[index].defectLocationId=that.defectRecords.prodBatch.DefectName[x].defectLocId;//缺陷位置
            that.getDefectGradeData(that.defectRecords.prodBatch.DefectName[x].qltyLvId,index)
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
          //console.log(res,'res------------------------------')
          that.defectRecords.prodBatch.DefectPosition=res.data
          that.defectRecords.prodBatch.DefectPosition.unshift({defectLocId:i18n.t('pqc.wu'),name:i18n.t('pqc.wu')});

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
      //改变检验单号
      changeOqcNo(){
        let that = this;
        // debugger
        let tempList=that.prodBatch.pqcList;
        //console.log(tempList,12222)
          if(!that.basic.qcNo && this.isF){
            //that.basic.qcNo=" ";
            that.basic.productId='';
            that.basic.productNo='';
            that.basic.productName='';
            that.basic.customerName='';
            that.basic.batchQuantity='';
            that.basic.inspectionQuantity='';
            that.basic.badQuantity='';
            that.other.disabled=false;
            that.ruleForm.productNames='';
            that.other.disabled2=false;
            that.other.batchNoShow=false;
            that.basic.batchNo=null;
          }else{
              for(var i = 0;i<tempList.length;i++){
                if(tempList[i].pqcNo==that.basic.qcNo){
                  that.other.disabled=true;
                  that.basic.productId=tempList[i].productId;
                  that.basic.productNo=tempList[i].productNo;
                  that.basic.productName=tempList[i].productName;
                  that.basic.customerId=tempList[i].customerId;
                  that.basic.batchQuantity=tempList[i].batchQuantity;
                  that.basic.inspectionQuantity=tempList[i].sampleQuantity;
                  that.basic.badQuantity=tempList[i].badQuantity;
                  that.basic.batchNo=tempList[i].batchNo;
                  that.other.disabled2=true;
                  that.other.batchNoShow=true;
                  that.changeBatchNo();
                  break
                }
            if(!this.isF){
              //console.log(tempList,'tempList')
              for(var i = 0;i<tempList.length;i++){
                if(tempList[i].batchNo==that.basic.batchNo){
                  that.other.disabled=true;
                  that.basic.productId=tempList[i].productId;
                  that.basic.productNo=tempList[i].productNo;
                  that.basic.productName=tempList[i].productName;
                  that.basic.customerId=tempList[i].customerId;
                  that.basic.batchQuantity=tempList[i].batchQuantity;
                  that.basic.inspectionQuantity=tempList[i].sampleQuantity;
                  that.basic.badQuantity=tempList[i].badQuantity;
                  that.basic.batchNo=tempList[i].batchNo;
                  that.other.disabled2=true;
                  that.other.batchNoShow=true;
                  that.changeBatchNo();
                  break
                }
              }
              if(!that.basic.qcNo ||that.basic.qcNo=="" ){
                that.other.disabled2=false;
                that.other.batchNoShow=false;
                that.other.disabled=false;

              }
              this.isF = true;
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
        if(!qcNo||qcNo==i18n.t('pqc.wu')){that.defectRecords.table.data=[];return;}
        that.$http.get('/examinecenter/pqc/pqcdetailByPqcNo/'+qcNo).then((resp)=>{
          //console.log(resp.data.defectRecordList,'检验单号带出缺陷记录')
          let defectRecordList=resp.data.defectRecordList;
          if(!defectRecordList){return;}
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
      //获取产品信息
      productName(){
        let that=this;
        let idValueMap = [];
        let url_product="/basic/product?examType=2&page=1&limit=9999&useState=1";
        that.$http.get(url_product).then((res)=>{
          let productData=res.data
          productData.forEach(e => {
            let productId=e.productId;
            let no=e.no;
            let name=e.name;
            let typeName=e.prodTypeName;
            let spec=e.spec;
            let boxOn={no,productId,name};
            let boxName={name,productId};
            let boxSpec={spec,productId};
            for(var i=0;i<idValueMap.length;i++){
              if(idValueMap[i].name != e.name){
                idValueMap[i].no.push(boxOn);
                idValueMap[i].name.push(boxName);
                idValueMap[i].spec.push(boxSpec);
                return;
              }
            }
            idValueMap.push({
              no:[boxOn],
              name:[boxName],
              spec:[boxSpec],
            })
          });
          /*for(var index in productData){
            if(val===productData[index].productId){
              that.ruleForm.prodUnitName=productData[index].prodUnitName
              that.basicCategory(productData[index].prodTypeName)
            }
          }*/
          that.prodBatch.productON=idValueMap[0].no;
          /*that.prodBatch.productNames=idValueMap[0].name;
          that.prodBatch.productSpec=idValueMap[0].spec;*/
        })
      },
      //获取所属客户
      getCustomerList(){
        let that=this;
        let url="/bas/customerList?page=1&limit=9999&query=&fieldName="
        that.$http.get(url).then((res)=>{
          that.prodBatch.customerList=res.data
        })
      },
      //获取所属供应商
      getSupplierList(){
        let that = this;
        let url="/bas/manufacturer?page=1&limit=9999"
        that.$http.get(url).then((res)=>{
          that.prodBatch.supplierList=res.data
        })
      },
      //查询出货检验---》检验单号
      getOqcList(){
        let that = this;
        let url="/examinecenter/pqc/pqc?limit=99999999&query=result%3D0%26state%3D1"
        let res = that.$iqis.utils.syncget(url);
        let url2="/examinecenter/pqc/pqc?limit=99999999&query=result%3D0%26state%3D2"
        let res2 = that.$iqis.utils.syncget(url2);
        that.prodBatch.pqcList=res.data.concat(res2.data)
        // //console.log(that.prodBatch.pqcList,'that.prodBatch.pqcList-------------------')
      },
      //D3附件添加
      d3AddFile(data){
        let that = this;
        try{
          that.d3Contain.attachments.length
        }catch (error){
          that.d3Contain.attachments=new Array();
        }
        ////console.log('=====h>',this.$refs.d3Upload.myUploadList)
        //that.other.spinShow=false;
        //that.d3Contain.attachments.push(data[0]);
        /*clearTimeout(temp)
        var temp = setTimeout(function () {
          that.other.spinShow=true;
        },10)*/


      },
      //D3附件删除
      d3DelFile(index){
        let that = this;
        /*that.other.spinShow=false;
        that.d3Contain.attachments.splice(index,1)
        clearTimeout(temp)
        var temp = setTimeout(function () {
          that.other.spinShow=true;
        },10)*/
      },
      //D4附件添加
      d4AddFile(data){
        let that = this;
        try{
          that.d4Cause.attachments.length
        }catch (error){
          that.d4Cause.attachments=new Array();
        }
        //that.d4Cause.attachments.push(data[0]);
        //that.d4Cause.attachments.$push(data[0]);
      },
      //D4附件删除
      d4DelFile(index){
        let that = this;
        //that.d4Cause.attachments.splice(index,1)
        //that.d4Cause.attachments.$delete(index)
      },
      closePage(){
        this.$emit("close-tab",this.$props.tabKey);
      },
    },
    computed:{
      //计算不良率
      badRate(){
        if(this.basic.badQuantity!==''&&this.basic.inspectionQuantity!==''){
          if(this.basic.badQuantity==0&&this.basic.inspectionQuantity==0){
            return "0%";
          }else if(this.basic.badQuantity==null&&this.basic.inspectionQuantity==null){
            return "";
          }else{
            let x=Math.floor(this.basic.badQuantity/this.basic.inspectionQuantity*10000) / 100;
            if(x>100){
              return '100%';
            }else{
              return x+'%';
            }
          }
        }
      },
      picBtnShow(){
        if(!this.other.basicD1D2Show&&!this.noPermsDis){
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
  .ivu-spin{
    text-align: none;
  }
  .picBtnHide .ivu-upload{
    display: none;
  }
</style>
