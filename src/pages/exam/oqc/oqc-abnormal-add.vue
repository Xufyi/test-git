<template>
  <div class="iqis-page">

    <!-- 第一部分-基本资料 -->
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t('oqc.basicInfo')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25" style="margin-top:15px;">
          <i-col span="6">
            <div class="iqis-page-block-ctrl">
              <DatePicker :disabled="other.basicD1D2Show||noPermsDis" v-model="basic.createTime" type="datetime" format="yyyy-MM-dd HH:mm" style="width:100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <Checkbox class="isFatal" :disabled="other.basicD1D2Show||noPermsDis" @on-change="basic.isFatal=basic.isFatalSelect?1:0" v-model="basic.isFatalSelect">{{$t('oqc.setMainAbn')}}</Checkbox>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.abnNo')}}</div>
            <i-input v-model="basic.abnormalNo" :disabled="other.basicD1D2Show||noPermsDis"></i-input>

          </i-col>
          <i-col span="6">
            <!-- 检验单号 -->
            <div class="iqis-page-block-label">{{$t('oqc.oqcNo')}}</div>
            <div class="iqis-page-block-ctrl">

              <!--<i-input :disabled="basic.disabled" v-model="basic.qcNo" style="width: 100%;"></i-input>-->
              <Select :disabled="other.basicD1D2Show||noPermsDis" v-model="basic.qcNo" filterable :placeholder="i18n.t('oqc.null')" @on-change="changeOqcNo();getDefectRecord(basic.qcNo)">
                <Option value="" >{{$t('oqc.null')}}</Option>
                <Option v-for="(items,index) in prodBatch.oqcList" :value="items.oqcNo" :key="index">{{ items.oqcNo}}</Option>
              </Select>
            </div>

          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('oqc.productBatch')}}</div>
            <div class="iqis-page-block-ctrl">
              <!--<i-input :disabled="basic.disabled" v-model="basic.batchNo" style="width: 100%;"></i-input>-->
              <Select :placeholder="i18n.t('pleaseChoose')" v-if='!other.disabled' v-model="basic.batchNo" filterable :disabled="other.disabled||noPermsDis">
                <Option v-for="(items,index) in prodBatch.prodbatchList" :value="items.batchNo" :key="index" >{{ items.batchNo}}</Option>
              </Select>
              <i-input  v-if='other.disabled' v-model="basic.batchNo"  :disabled="other.disabled||noPermsDis" style="width: 100%;"></i-input>

            </div>

          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('oqc.place')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="other.basicD1D2Show||noPermsDis" v-model="basic.abnormalPlace" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">

          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('oqc.productNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <!--<Select :disabled="basic.disabled" v-model="basic.customerProductNo" filterable>
                &lt;!&ndash; <Option v-for="data in customerProductNo" :key="data.customerProductNo" :value="data.customerProductNo">{{data.customerProductNo}}</Option> &ndash;&gt;
              </Select>-->

              <Select :label="basic.productNo" remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pleaseChoose')" v-if='!other.disabled' v-model="basic.productId" :disabled="other.disabled||noPermsDis" filterable @on-change="selectOn(basic.productId,1)">
                <Option v-for="(items,index) in productList" :value="items.productId" :label="items.no" :key="index">{{ items.no}}/{{ items.name}}</Option>
              </Select>
              <i-input  v-if='other.disabled' v-model="basic.productNo" :disabled="other.disabled||noPermsDis" style="width: 100%;"></i-input>

            </div>
          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('oqc.productName')}}</div>
            <div class="iqis-page-block-ctrl">
              <!--<Select :disabled="basic.disabled" v-model="basic.customerProductNo" filterable>
                &lt;!&ndash; <Option v-for="data in customerProductNo" :key="data.customerProductNo" :value="data.customerProductNo">{{data.customerProductNo}}</Option> &ndash;&gt;
              </Select>-->
              <!-- <i-input :disabled="true" v-model="ruleForm.productNames" style="width: 100%;"></i-input> -->
              <i-input disabled v-model="basic.productName" style="width: 100%;"></i-input>

            </div>
          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('oqc.customer')}}</div>
            <div class="iqis-page-block-ctrl">
              <!--<Select :disabled="basic.disabled" v-model="basic.customerProductNo" filterable>
                &lt;!&ndash; <Option v-for="data in customerProductNo" :key="data.customerProductNo" :value="data.customerProductNo">{{data.customerProductNo}}</Option> &ndash;&gt;
              </Select>-->

              <Select :placeholder="i18n.t('pleaseChoose')" v-model="basic.customerId" filterable :disabled="other.disabled||noPermsDis">
                <Option v-for="(items,index) in prodBatch.customerList" :value="items.customerId" :key="index">{{ items.customerAbbreviation}}</Option>
              </Select>
            </div>

          </i-col>
          <i-col span="6">

            <div class="iqis-page-block-label">{{$t('oqc.belongSupplier')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="other.basicD1D2Show||noPermsDis" v-model="basic.supplierId" filterable>
                <Option v-for="items in prodBatch.supplierList" :key="items.manufacturerAbbreviation" :value="items.manufacturerId">{{items.manufacturerAbbreviation}}</Option>
              </Select>
            </div>

          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.quantity')}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <InputNumber :disabled="other.disabled" v-model="basic.batchQuantity" placeholder="" style="width: 100%;"></InputNumber> -->
              <i-input :disabled="other.disabled||noPermsDis" v-model="basic.batchQuantity" placeholder="" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.qcNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <InputNumber :disabled="other.disabled" :max="basic.batchQuantity" :min="0" v-model="basic.inspectionQuantity" placeholder="" style="width: 100%;"></InputNumber> -->
              <i-input :disabled="other.disabled||noPermsDis" v-model="basic.inspectionQuantity" placeholder="" style="width: 100%;"></i-input>

            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.badNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <InputNumber :disabled="other.disabled" :max="basic.inspectionQuantity" :min="0" v-model="basic.badQuantity" style="width: 100%;"></InputNumber> -->
              <i-input :disabled="other.disabled||noPermsDis" v-model="basic.badQuantity" style="width: 100%;"></i-input>
              
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.badRate')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="true" v-model="badRate" placeholder="" style="width: 100%;" ></i-input>
            </div>
          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.treatmentMethod')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="other.basicD1D2Show||noPermsDis" v-model="basic.treatmentMethod" filterable>
                <!-- <Option v-for="data in treatmentMethod" :key="data.treatmentMethod" :value="data.treatmentMethod">{{data.treatmentMethod}}</Option> -->
                <Option v-for="st in other.optList" :key="st.value" :value="st.value">{{st.label}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('oqc.treatmentLimit')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="other.basicD1D2Show||noPermsDis" v-model="basic.treatmentTimeLimit" filterable>
                <!-- <Option v-for="data in treatmentTimeLimit" :key="data.treatmentTimeLimit" :value="data.treatmentTimeLimit">{{data.treatmentTimeLimit}}</Option> -->
                <Option v-for="st in other.timeList" :key="st.value" :value="st.value">{{st.label}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="12">
            <div class="iqis-page-block-label">{{$t('oqc.theme')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="other.basicD1D2Show||noPermsDis" v-model="basic.subject" placeholder="" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div>
    <div class="iqis-page-block">
      <div class="iqis-page-block-title" style="margin-bottom:15px;">
        {{$t('oqc.treatmentRecord')}}
      </div>
      <div class="iqis-page-block-body">


        <div class="blockSmall">
          <div class="titleSmall">{{$t('oqc.D1')}}</div>
          <div class="iqis-page-block-tools">
            <div class="iqis-page-block-tools-primary">
              <div class="iqis-page-block-label">{{$t('oqc.defectRecord')}}</div>
            </div>
            <div class="iqis-page-block-tools-second" style="margin-top: 6px;">

              <Button v-if="!other.basicD1D2Show" type="ghost" icon="trash-a" @click="deleteDefect">{{$t('oqc.delete')}}</Button>
            </div>
          </div>
          <Table  :no-data-text="i18n.t('noData')" :disabled="other.basicD1D2Show||noPermsDis" class="noBorder noHeight location defectTable" ref="defectTable" :loading="defectRecords.table.loading" v-drag-table-column="defectRecords.table.columns" border stripe :columns="defectRecords.table.columns" :data="defectRecords.table.data">
              <Button v-if='!other.basicD1D2Show' @click="addDefect" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t('oqc.addDefect')}}</Button>
          </Table>
          <!-- <Button :disabled="other.basicD1D2Show" type="dashed" style="width:100%;margin-top:15px;" @click="addDefect">添加</Button> -->
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.abnDescribe')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input type="textarea" style="width:100%" v-model="d2Description.description" :disabled="other.basicD1D2Show||noPermsDis"></i-input>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.auditor')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-model="basic.auditorId" filterable :disabled="other.basicD1D2Show||noPermsDis">
                  <Option v-for="data in other.userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.auditTime')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker v-model="basic.auditTime" type="datetime" style="width:100%" :disabled="true"></DatePicker>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.describeUser')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-model="d2Description.operatorId" filterable :disabled="other.basicD1D2Show||noPermsDis">
                  <Option v-for="data in other.userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.time')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :disabled="other.basicD1D2Show||noPermsDis" v-model="d2Description.operateTime" type="datetime" placeholder="请选择时间" style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
        </div>



        <div class="blockSmall">
          <div class="titleSmall">{{$t('oqc.D2')}}</div>
          <Row :gutter="25">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.leader')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-model="d1Team.leaderId" filterable :disabled="other.basicD1D2Show||noPermsDis">
                  <!-- <Option v-for="data in array" :key="data.string" :value="data.string">{{data.string}}</Option> -->
                  <Option v-for="data in other.userList" :key="data.userId" :value="data.userId" @on-change="changeLeader()">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6" offset="6">
              <div class="iqis-page-block-label">{{$t('oqc.teamCreator')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-model="d1Team.creatorId" filterable :disabled="other.basicD1D2Show||noPermsDis">
                  <!-- <Option v-for="data in array" :key="data.string" :value="data.string">{{data.string}}</Option> -->
                  <Option v-for="data in other.userList" :key="data.userId" :value="data.userId">{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.time')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :disabled="other.basicD1D2Show||noPermsDis" v-model="d1Team.createTime" type="datetime" style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.teamMember')}}</div>
              <div class="iqis-page-block-ctrl">
                <div style="display:inline" v-if="teamAddButton1.show&&!other.basicD1D2Show">
                  <Button type="primary" icon="person-stalker" v-on:click="changeLabel()">{{$t('oqc.addMoreMember')}}</Button>
                </div>
                <div style="display:inline">
                    <Select :placeholder="i18n.t('pleaseChoose')" v-if="teamSelect1.show" v-model="other.team" filterable style="width:253.75px" @on-change="selectTeam()" :disabled="other.basicD1D2Show||noPermsDis">
                      <Option v-for="data in other.userList" :key="data.userId" :value="data">{{data.name}}</Option>
                    </Select>
                  <Tag :closable="!other.basicD1D2Show" v-for="(data,index) in d1Team.members" type="dot" color="blue" :key="index" :name="index"  @on-close="deleteMember(index)">{{data.memberName}}</Tag>
                </div>

              </div>
            </i-col>
          </Row>
        </div>

      <div v-if="other.D3AndD8Show">
        <div class="blockSmall">
          <div class="titleSmall">{{$t('oqc.D3')}}</div>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.shortPolicy')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input :disabled="other.D3D4Edit||noPermsDis" v-model="d3Contain.policy" type="textarea" style="width:100%"></i-input>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.handleMethod')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input :disabled="other.D3D4Edit||noPermsDis" style="width:100%" v-model="d3Contain.treatmentMethod"></i-input>
              </div>
            </i-col>
            <i-col span="6" offset="6">
              <div class="iqis-page-block-label">{{$t('oqc.peopleInCharge')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-model="d3Contain.operatorId" filterable @on-change="changePerator()" :disabled="other.D3D4Edit||noPermsDis">
                  <Option v-for="data in other.teamList" :key="data.memberId" :value="data.memberId" >{{data.memberName}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.time')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :disabled="other.D3D4Edit||noPermsDis" v-model="d3Contain.operateTime" type="datetime" style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.addAttachments')}}</div>
              <Spin size="large" v-if="other.spinShow" style="text-align:left">
                <div class="iqis-page-block-ctrl">
                  <IqisUpload ref="d3Upload" :edit="!other.D3D4Edit||noPermsDis"  :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d3Contain.attachments' :cameraShow="false" :outlineShow="true">
                  </IqisUpload>
                </div>
              </Spin>
              <div class="iqis-page-block-ctrl">
              </div>
            </i-col>
          </Row>

        </div>

        <div class="blockSmall">
          <div class="titleSmall">{{$t('oqc.D4')}}</div>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.causeIdentify')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input :disabled="other.D3D4Edit||noPermsDis" v-model="d4Cause.causeIdentify" type="textarea" style="width:100%"></i-input>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.abnormalCause')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" :disabled="other.D3D4Edit||noPermsDis" v-model="d4Cause.abnormalCauseId" filterable @on-change="changeAbnormalCause()">
                  <!-- <Option v-for="data in array" :key="data.string" :value="data.string">{{data.string}}</Option> -->
                  <Option v-for="data in other.abnormalReason" :key="data.abnormalId" :value="data.abnormalId" >{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6" offset="6">
              <div class="iqis-page-block-label">{{$t('oqc.peopleInCharge')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-model="d4Cause.operatorId" filterable @on-change="changeD4Perator()" :disabled="other.D3D4Edit||noPermsDis">
                  <Option v-for="data in other.teamList" :key="data.memberId" :value="data.memberId" >{{data.memberName}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.time')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :disabled="other.D3D4Edit||noPermsDis" v-model="d4Cause.operateTime" type="datetime" style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.addAttachments')}}</div>
              <Spin size="large"  v-if="other.spinShow" style="text-align:left">
                <div class="iqis-page-block-ctrl">
                  <IqisUpload ref="d4Upload" :edit="!other.D3D4Edit||noPermsDis"   :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d4Cause.attachments' :cameraShow="false" :outlineShow="true">
                  </IqisUpload>
                </div>
              </Spin>
            </i-col>
          </Row>
        </div>

        <div class="blockSmall">
          <div class="titleSmall">{{$t('oqc.D5')}}</div>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.longPolicy')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input :disabled="other.D3D4Edit||noPermsDis" v-model="d5Plan.policy" type="textarea" style="width:100%"></i-input>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.handleMethod')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input :disabled="other.D3D4Edit||noPermsDis" style="width:100%" v-model="d5Plan.treatmentMethod"></i-input>
              </div>
            </i-col>
            <i-col span="6" offset="6">
              <div class="iqis-page-block-label">{{$t('oqc.peopleInCharge')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-model="d5Plan.operatorId" filterable @on-change="changeD5Perator()" :disabled="other.D3D4Edit||noPermsDis">
                  <Option v-for="data in other.teamList" :key="data.memberId" :value="data.memberId" >{{data.memberName}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.time')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :clearable="false" :disabled="other.D3D4Edit||noPermsDis" v-model="d5Plan.operateTime" type="datetime"  placeholder="请选择时间" style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.addAttachments')}}</div>
              <Spin size="large"  v-if="other.spinShow" style="text-align:left">
                <div class="iqis-page-block-ctrl">
                    <IqisUpload ref="d5Upload" :edit="!other.D3D4Edit&&!noPermsDis"  :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d5Plan.attachments' :chartTypeShow="false">
                    </IqisUpload>
                </div>
              </Spin>
            </i-col>
          </Row>
        </div>
        <div class="blockSmall">
          <div class="titleSmall">{{$t('oqc.D6')}}</div>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.effect')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input :disabled="other.D3D4Edit||noPermsDis" v-model="d6Effect.effect" type="textarea" style="width:100%"></i-input>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.verificationMethod')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input :disabled="other.D3D4Edit||noPermsDis" style="width:100%" v-model="d6Effect.verificationMethod"></i-input>
              </div>
            </i-col>
            <i-col span="6" offset="6">
              <div class="iqis-page-block-label">{{$t('oqc.verifier')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-model="d6Effect.operatorId" filterable @on-change="changeD6Perator()" :disabled="other.D3D4Edit||noPermsDis">
                  <Option v-for="data in other.teamList" :key="data.memberId" :value="data.memberId" >{{data.memberName}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.time')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :clearable="false" :disabled="other.D3D4Edit||noPermsDis" v-model="d6Effect.operateTime" type="datetime"  placeholder="请选择时间" style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.addAttachments')}}</div>
              <Spin size="large"  v-if="other.spinShow" style="text-align:left">
                <div class="iqis-page-block-ctrl">
                    <IqisUpload ref="d6Upload" :edit="!other.D3D4Edit&&!noPermsDis"  :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d6Effect.attachments' :chartTypeShow="false">
                    </IqisUpload>
                </div>
              </Spin>
            </i-col>
          </Row>
        </div>
        <div class="blockSmall">
          <div class="titleSmall">{{$t('oqc.D7')}}</div>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.preventive')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input :disabled="other.D3D4Edit||noPermsDis" v-model="d7Prevention.preventive" type="textarea" style="width:100%"></i-input>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="12">
              <div class="iqis-page-block-label">{{$t('oqc.addAttachments')}}</div>
              <Spin size="large"  v-if="other.spinShow" style="text-align:left">
                <div class="iqis-page-block-ctrl">
                    <IqisUpload ref="d7Upload" :edit="!other.D3D4Edit&&!noPermsDis"  :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='d7Prevention.attachments' :chartTypeShow="false">
                    </IqisUpload>
                </div>
              </Spin>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.verifier')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-model="d7Prevention.operatorId" filterable @on-change="changeD7Perator()" :disabled="other.D3D4Edit||noPermsDis">
                  <Option v-for="data in other.teamList" :key="data.memberId" :value="data.memberId" >{{data.memberName}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.time')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :clearable="false" :disabled="other.D3D4Edit||noPermsDis" v-model="d7Prevention.operateTime" type="datetime"  placeholder="请选择时间" style="width:100%"></DatePicker>
              </div>
            </i-col>
          </Row>
        </div>

        <div class="blockSmall">
          <div class="titleSmall">{{$t('oqc.D8')}}</div>

          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('pqc.opinion')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-input :disabled="other.D8Edit||noPermsDis" type="textarea" v-model="d8Congratulation.opinion" style="width:100%"></i-input>
              </div>
            </i-col>
          </Row>
          <Row :gutter="25">
            <i-col span="24">
              <div class="iqis-page-block-label">{{$t('oqc.shareMembers')}}</div>
              <div class="iqis-page-block-ctrl">
                <div style="display:inline" v-if="teamAddButton2.show&&!other.D8Edit">
                  <Button type="primary" icon="person-stalker" v-on:click="changeLabel2()" :disabled="other.D8Edit||noPermsDis">{{$t('oqc.addMoreMember')}}</Button>
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
              <div class="iqis-page-block-label">{{$t('oqc.endUser')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" v-model="d8Congratulation.operatorId" filterable :disabled="other.D8Edit||noPermsDis">
                  <Option v-for="data in other.userList" :key="data.userId" :value="data.userId" >{{data.name}}</Option>
                </Select>
              </div>
            </i-col>
            <i-col span="6">
              <div class="iqis-page-block-label">{{$t('oqc.time')}}</div>
              <div class="iqis-page-block-ctrl">
                <DatePicker :disabled="other.D8Edit||noPermsDis" v-model="d8Congratulation.operateTime" type="datetime" style="width:100%"></DatePicker>
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
        <Button type="primary" v-if="basic.abnormalState==1&&basic.auditorId==other.currentUser.userId&&permsBtn.UPDATE_OQC_ABNORMAL" v-on:click="auditingPass()">{{$t('oqc.auditPass')}}</Button>
        <Button type="ghost" v-if="basic.abnormalState==1&&basic.auditorId==other.currentUser.userId&&permsBtn.UPDATE_OQC_ABNORMAL" v-on:click="auditingReject()">{{$t('oqc.auditReject')}}</Button>
        <Button type="primary" v-if="basic.creatorId==other.currentUser.userId&&basic.abnormalState==8&&permsBtn.UPDATE_OQC_ABNORMAL" v-on:click="confirmCloseCase()">{{$t('oqc.end')}}</Button>
        <!--<div v-if="basic.abnormalState==5?other.commitShow:true" style="display:inline">-->
        <!--<Button type="primary" v-on:click="confirmCommit()" v-if="basic.abnormalState==0||(basic.abnormalState==3&&basic.creatorId==other.currentUser.userId)||basic.abnormalState==5">提交</Button>-->
        <Button type="primary" v-on:click="confirmCommit()" v-if="other.commitButton&&permsBtn.UPDATE_OQC_ABNORMAL">{{$t('oqc.commit')}}</Button>
        <Button type="primary" v-on:click="confirmCommit()" v-if="other.closeCaseButton&&permsBtn.UPDATE_OQC_ABNORMAL">{{$t('oqc.submitEndPeople')}}</Button>
        <!--</div>-->

        <Button type="primary" v-on:click="save()" v-if="other.saveButton&&!noPermsDis">{{$t('oqc.save')}}</Button>
        <Button type="ghost" v-on:click="cancel()">{{$t('oqc.cancel')}}</Button>
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
      abnormalId:'',
      btnsave:false,
      status:'',
      headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
      selects:{
        defectTypeList:[],
        inspectionTypes:[],
      },
      ossKey:'',
      policy:'',
      OSSAccessKeyId:'',
      success_action_status:'',
      signature:'',

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
        auditorId: '',
        badQuantity: '',
        batchNo: "",
        batchQuantity: '',
        createTime: new Date(),
        creatorId: '',
        customerId: '',
        examType: 0,
        inspectionQuantity: '',
        isFatal: 0,
        productId: '',
        productNo: '',
        productName: '',
        qcNo: "",
        subject: "",
        supplierId: '',
        treatmentMethod: "",
        treatmentTimeLimit: "",
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
        attachmentId: 0,
        disciplineId: '',
        operateTime: new Date(),
        operatorId: '',
        operatorName: "",
        policy: "",
        treatmentMethod: "",
        attachments:[]
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
        attachments:[]
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
              minWidth:40,
              maxWidth:40
            },{
              title: i18n.t('oqc.no'),
              minWidth:60,
              maxWidth:60,
              align:'center',
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm)
            },
            // {
            //   title: i18n.t('oqc.project'),
            //   width:132,
            //   minWidth:132,
            //   align:'center',
            //   key: 'inspectionTypeName',
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
              title: i18n.t('oqc.project'),
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
                    this.other.basicD1D2Show||this.noPermsDis,
                  )
                  return ret(h,params);
                }
            },{
              title: i18n.t('oqc.defectName'),
              width:120,
              minWidth:120,
              align:'center',
              // maxWidth:120,
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
            },{
              title: i18n.t('oqc.defectLevel'),
              windth:120,
              minWidth:120,
              align:'center',
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
              title: i18n.t('oqc.defectPosition'),
              windth:140,
              minWidth:140,
              align:'center',
              key: 'defectLocationId',
              render: (h, params) => {
                let _this = this;
                return h('Select',
                  {
                    props:{
                      value: this.defectRecords.table.data[params.index].defectLocationId,
                      disabled:this.other.basicD1D2Show||this.noPermsDis,
                      placeholder:i18n.t('oqc.null')
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
              align:'center',
              title: i18n.t('oqc.sampleQuantity'),
              width:106,
              minWidth:106,
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
                      this.getDefectRate(this.defectRecords.table.data[params.index].defectQuantity,this.defectRecords.table.data[params.index].sampleQuantity,params.index)
                      // if(parseInt(event.target.value) > parseInt(this.basic.inspectionQuantity)) {
                      //   this.$Notice.warning({title:'实抽样数不能大于检验数，请重输！'});
                      //   this.btnsave = true;
                      // }else{
                      //   this.btnsave = false;
                      // }
                     
                    }
                  }
                })
                ])
              }
            },
            {
              title: i18n.t('oqc.defectNum'),
              width:106,
              minWidth:106,
              align:'center',
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
                      this.getDefectRate(this.defectRecords.table.data[params.index].defectQuantity,this.defectRecords.table.data[params.index].sampleQuantity,params.index)
                    }
                  }
                })
                ])
              }
            },


            {
              title: i18n.t('oqc.defectRate'),
              width:106,
              minWidth:106,
              align:'center',
              key: 'defectRate',
              render: (h, params) => {
                var me = this
                return h('div', [h
                ('Input',{
                  props: {
                    type: 'text',
                    value: me.defectRecords.table.data[params.index].defectRate,//me.defectRecords.table.data[params.index].defectQuantity/me.defectRecords.table.data[params.index].sampleQuantity*100+'%',//me.defectRate(me.defectRecords.table.data[params.index].defectQuantity,me.defectRecords.table.data[params.index].sampleQuantity),
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
              title: i18n.t('oqc.remarks'),
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
              title: i18n.t('oqc.pic'),
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
            defectRate: '',
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
          indeV:0,
          DefectId:'',
          oqcId:'',
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
        oqcList:[],
        prodbatchList:[],
      },
      other:{
        optList:[
         {value:"REJECT",label:i18n.t('oqc.return')},
         {value:"REWORK",label:i18n.t('oqc.rework')},
         {value:"SCREEN",label:i18n.t('oqc.filter')},
         {value:"SPECIAL_ADOPTION",label:i18n.t('oqc.special')},
         {value:"EMERGENCY_RELEASE",label:i18n.t('oqc.release')},
         {value:"SCRAP",label:i18n.t('oqc.scrap')},
         {value:"SUPPLY_AGAIN",label:"补发"},//后期做国际化
         {value:"REDUCE_ACCOUT",label:"减账"},//后期做国际化
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
        commitButton:false,
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
      teamArr:[],
      team2:{},
      team2Arr:[],
      permsCur:[
        "UPDATE_OQC_ABNORMAL",
        "INSERT_OQC_ABNORMAL",
      ],//当前页面需要的权限名称
      permsBtn:{//控制每个权限对应按钮的禁用状态
        "UPDATE_OQC_ABNORMAL":false,
        "INSERT_OQC_ABNORMAL":false,

      },
      noPermsDis:true,
      isF:true,
      changeDefect:true,
      productList:[],
      loadingRemote:false,
      source:null,
    }
  },

  created(){

    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.initData()
    
    // that.d8edit();
    // this.handleBeforeUpload();
  },
  methods:{
    remoteMethod: _.debounce(function(query) {
      let that = this;
      that.loadingRemote = true;

      if (query !== '') {
        that.cancelQuest();
        that.$nextTick(()=>{

          that.$http.get('/basic/product/simple?page=1&limit=999999&examType=4&useState=1&fieldName=no,name&query='+query,{
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
      let resp = that.$iqis.utils.syncget('/basic/inspectiontype?page=1&limit=99999');
      // that.$http.get("/basic/inspectiontype",{params:{limit:99999999}}).then(function(resp){
        let root = {title:i18n.t('oqc.projectType'),selected: false,label:i18n.t('oqc.projectType'),value:0,expand:true};
        that.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
        that.selects.inspectionTypes = [root];
        // //console.log(that.selects.inspectionTypes,'检验项目数据')
      // })
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
      that.abnormalId=abnormalId;
      that.changeDefect=false;
      let url="/examinecenter/oqc/oqc?page=1&limit=99999"
      that.$http.get(url).then((res)=>{
        // that.prodBatch.oqcList=res.data
        url="/examinecenter/oqc/abnormal/"+abnormalId
        that.$http.get(url).then((res)=>{
          if(res.data.basic.qcNo==i18n.t('oqc.null')){that.isF=false;}//如果为无，则阻止执行清空操作
          res.data.basic.createTime=new Date(res.data.basic.createTime);
          res.data.basic.auditTime=res.data.basic.auditTime?new Date(res.data.basic.auditTime):'';
          res.data.d2Description.operateTime=res.data.d2Description.operateTime?new Date(res.data.d2Description.operateTime):'';
          res.data.d1Team.createTime=res.data.d1Team.createTime?new Date(res.data.d1Team.createTime):'';
          res.data.d3Contain.operateTime=res.data.d3Contain.operateTime?new Date(res.data.d3Contain.operateTime):'';
          res.data.d4Cause.operateTime= res.data.d4Cause.operateTime?new Date(res.data.d4Cause.operateTime):'';
          res.data.d5Plan.operateTime= res.data.d5Plan.operateTime?new Date(res.data.d5Plan.operateTime):'';
          res.data.d6Effect.operateTime= res.data.d6Effect.operateTime?new Date(res.data.d6Effect.operateTime):'';
          res.data.d7Prevention.operateTime= res.data.d7Prevention.operateTime?new Date(res.data.d7Prevention.operateTime):'';
          res.data.d8Congratulation.operateTime=res.data.d8Congratulation.operateTime?new Date(res.data.d8Congratulation.operateTime):'';


          that.basic=res.data.basic;
          that.selectOn(that.basic.productId)

          that.defectRecords.table.data=res.data.defectRecords;
          if(that.defectRecords.table.data){
            for(let i in that.defectRecords.table.data){
              let inspectionTypeId = that.defectRecords.table.data[i].inspectionTypeId;
              let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
              let defectTypeList = resp ? resp.data||[] : [];
              that.defectRecords.table.data[i]['defectTypeList'] = defectTypeList;
              if(!that.defectRecords.table.data[i].defectLocationId){
                that.defectRecords.table.data[i].defectLocationId=i18n.t('oqc.null');
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
          that.d8Congratulation=res.data.d8Congratulation;
          that.other.spinShow=true;
          for(let x in that.defectRecords.table.data){
            that.getDefectRate(that.defectRecords.table.data[x].defectQuantity,that.defectRecords.table.data[x].sampleQuantity,x);
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
          }
          //处理中
          if(state==5){
            that.other.disabled=true;
            that.other.basicD1D2Show=true; //基本资料 D1 D2 信息都不可编辑
            that.d8Congratulation.operatorId=that.d2Description.operatorId //在处理中时带出D8中的负责人
            //如果是当前登录用户是小组成员，则显示保存按钮
            var temp = that.other.teamList;



            for(var i = 0;i<temp.length;i++){
              if(temp[i].memberId==that.other.currentUser.userId){

                // if (that.other.currentUser.userId != '') {
                //   alert(4676567456)
                //   that.d4Cause.operatorId=that.other.currentUser.userId;
                //   that.d3Contain.operatorId=that.other.currentUser.userId;
                // }
                // that.d4Cause.operatorId=that.other.currentUser.userId;
                // that.d3Contain.operatorId=that.other.currentUser.userId;

                // that.d3Contain=res.data.d3Contain;
                // that.d4Cause=res.data.d4Cause;

                //bug修复 修改后面负责人会覆盖前面负责人的问题
                // if ((res.data.d3Contain.operatorId != null) && ( res.data.d4Cause.operatorId != null)) {
                //   // that.d3Contain.operatorId = res.data.d3Contain.operatorId;
                //   that.d4Cause.operatorId = res.data.d4Cause.operatorId
                // }else{
                //   that.d4Cause.operatorId=that.other.currentUser.userId;
                //   that.d3Contain.operatorId=that.other.currentUser.userId;
                // }
                // if(res.data.d3Contain.operatorId == null){
                //     that.d3Contain.operatorId=that.other.currentUser.userId;
                // }

                // if(res.data.d4Cause.operatorId == null){
                //     that.d4Cause.operatorId=that.other.currentUser.userId;
                // }
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


                that.d4Cause.operateTime=new Date();
                that.d3Contain.operateTime=new Date();
                that.other.D3D4Edit=false;
                that.other.saveButton=true;
                that.other.commitButton=false;//隐藏提交按钮
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
                  )
                  {
                    flag=false;
                  }
                  if(flag){
                    that.other.closeCaseButton=true;
                    // that.other.saveButton=false;
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
          }
          //待结案
          if(state==8){
              that.other.basicD1D2Show=true;
              that.other.D3D4Edit=true;
              that.other.disabled=true;

              // if(that.basic.creatorId!=that.other.currentUser.userId){
              if(that.d8Congratulation.operatorId!=that.other.currentUser.userId){
                that.other.D8Edit=true;
                // that.d8Congratulation.operatorId = that.d8Congratulation.operatorId=that.d2Description.operatorId
              }else{
                that.other.D8Edit=false;
                // that.d8Congratulation.operatorId=that.other.currentUser.userId;
                // that.d8Congratulation.operatorId=that.d2Description.operatorId
                that.d8Congratulation.operateTime=new Date();
              }
          }
        })
      })

    }
    if(((!that.abnormalId&&that.permsBtn.INSERT_OQC_ABNORMAL)||(that.abnormalId&&that.permsBtn.UPDATE_OQC_ABNORMAL))){
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
    // d8edit(){
    //   let that = this;
    //   that.d8Congratulation.operatorId = that.d8Congratulation.operatorId=that.d2Description.operatorId
    // },


    getDefectRate(obj1,obj2,index){
      let that=this;
      if(obj1!==''&& obj2!==''){
        /*alert("index:"+index)
        alert("obj1:"+obj1)
        alert("obj2:"+obj2)*/
        if(obj1 == 0 || obj2 == 0){
          that.defectRecords.table.data[index].defectRate='0.00%';
        }else{
          let x=obj1/obj2*100;
          x = Math.floor(x * 100) / 100;
          if(x > 100){
            that.defectRecords.table.data[index].defectRate='100.00%';
          }else{
            that.defectRecords.table.data[index].defectRate=x+'%';
          }
        }
        
      }
    },
    //确认框弹出层提示
    confirmCommit(){
      this.$Modal.confirm({
        content: i18n.t('oqc.submitNotChange'),
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
        content: i18n.t('oqc.endNotChange'),
        onOk: () => {
          this.closeCase();
        },
        onCancel: () => {
        }
      });
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
      let url='/examinecenter/oqc/abnormal/complete?abnormalId='+that.basic.abnormalId;
      let	parmas=that.d8Congratulation

      that.$http.post(url,parmas,that.headers).then((res)=> {
          that.$Message.success(i18n.t('oqc.endSuccess'));
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
      let url="/examinecenter/oqc/abnormal/audit?abnormalId="+that.basic.abnormalId+"&checked="+"1"
      that.$http.post(url).then((res)=>{
        that.$Message.success(i18n.t('oqc.auditSuccess'));
        this.$store.commit('RENDER_CHANGE',true)
        this.$emit("close-tab",this.$props.tabKey);
      })
    },
    //审核驳回
    auditingReject(){
      let that = this;
      let url="/examinecenter/oqc/abnormal/audit?abnormalId="+that.basic.abnormalId+"&checked="+"0"
      that.$http.post(url).then((res)=>{
        that.$Message.success(i18n.t('oqc.auditSuccess'));
        this.$store.commit('RENDER_CHANGE',true)
        this.$emit("close-tab",this.$props.tabKey);
      })
    },
    //提交
    commit(){
      let that = this;
      let params = [
        {type:'Empty',title:i18n.t('oqc.happenTime'),value:that.basic.createTime},
        {type:'Empty',title:i18n.t('oqc.abnNo'),value:that.basic.abnormalNo},
        {type:'No',title:i18n.t('oqc.abnNo'),value:that.basic.abnormalNo},
      ]
        /* if(that.basic.qcNo){
          params.push({type:'Empty',title:i18n.t('oqc.productBatch'),value:that.basic.batchNo}) 
        } */
       params = [
         {type:'Empty',title:i18n.t('oqc.place'),value:that.basic.abnormalPlace},
          {type:'Word20',title:i18n.t('oqc.place'),value:that.basic.abnormalPlace},
          {type:'Empty',title:i18n.t('oqc.productNo'),value:that.basic.productId},
          // {type:'Empty',title:'所属供应商',value:that.basic.supplierId},          
          {type:'Empty',title:i18n.t('oqc.quantity'),value:that.basic.batchQuantity},
          {type:'NumNot0',title:i18n.t('oqc.quantity'),value:that.basic.batchQuantity},
          // {type:'Empty',title:i18n.t('oqc.qcNum'),value:that.basic.inspectionQuantity},
          {type:'Num',title:i18n.t('oqc.qcNum'),value:that.basic.inspectionQuantity},
          {type:'Empty',title:i18n.t('oqc.badNum'),value:that.basic.badQuantity},
          {type:'Num',title:i18n.t('oqc.badNum'),value:that.basic.badQuantity},
          {type:'Empty',title:i18n.t('oqc.treatmentMethod'),value:that.basic.treatmentMethod},
          {type:'Empty',title:i18n.t('oqc.treatmentLimit'),value:that.basic.treatmentTimeLimit},
          {type:'Empty',title:i18n.t('oqc.theme'),value:that.basic.subject},
          {type:'Word20',title:i18n.t('oqc.theme'),value:that.basic.subject},
          {type:'Empty',title:i18n.t('oqc.abnDescribe'),value:that.d2Description.description},
          {type:'Word600',title:i18n.t('oqc.abnDescribe'),value:that.d2Description.description},
          {type:'Empty',title:i18n.t('oqc.auditor'),value:that.basic.auditorId},
          {type:'Empty',title:i18n.t('oqc.leader'),value:that.d1Team.leaderId},
          {type:'EmptyLength',title:i18n.t('oqc.teamMember'),value:that.d1Team.members},
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
      // let a=parseInt(that.basic.batchQuantity);
      // let b=parseInt(that.basic.inspectionQuantity);
      // let c=parseInt(that.basic.badQuantity);
      // if(b>a){
      //   that.$Notice.warning({title:'检验数不能大于出货数'});
      //   return;
      // }
      // if(c>b){
      //   that.$Notice.warning({title:'不良数不能大于检验数'});
      //   return;
      // }
      
      for(let i=0;i<that.defectRecords.table.data.length;i++){
          
        if(that.defectRecords.table.data[i].inspectionTypeId==''||that.defectRecords.table.data[i].defectTypeId==''|| that.defectRecords.table.data[i].sampleQuantity===''|| that.defectRecords.table.data[i].defectQuantity===''){
            that.$Notice.warning({title: i18n.t('oqc.pleaseInput')+i18n.t('oqc.defectRecord')+(i+1)});
            return;
        }
        let paramsDefects = [
          {type: 'NumNot0', title: i18n.t('oqc.sampleQuantity'), value: that.defectRecords.table.data[i].sampleQuantity},
          {type: 'Num', title: i18n.t('oqc.defectNum'), value: that.defectRecords.table.data[i].defectQuantity},
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
        if(that.defectRecords.table.data[i].defectLocationId==i18n.t('oqc.null')){
          that.defectRecords.table.data[i].defectLocationId='';
        }
      }
      if(that.basic.abnormalId!=""){
        if(that.basic.abnormalState==0||that.basic.abnormalState==3){
            let params={
              basic:that.basic,
              d1Team:that.d1Team,
              d2Description:that.d2Description,
              defectRecords:that.defectRecords.table.data,
            }
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
            //   that.$http.put("/examinecenter/oqc/abnormal",params,that.headers).then((res)=> {
            //     params = {
            //       abnormalId:that.basic.abnormalId
            //     }
            //     that.$http.post(url, params).then((res) => {
            //       that.$Message.success(i18n.t('oqc.commit'));
            //       this.$store.commit('RENDER_CHANGE',true)
            //       this.$emit("close-tab", this.$props.tabKey);
            //     })
            //   })
            // }
          that.$http.put("/examinecenter/oqc/abnormal",params,that.headers).then((res)=> {
            let params = {
              abnormalId:that.basic.abnormalId
            }
            that.$http.post('/examinecenter/oqc/abnormal/apply',params).then((res) => {
              that.$Message.success(i18n.t('oqc.commit'));
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
          that.$http.put("/examinecenter/oqc/abnormal",params,that.headers).then((res)=> {
            let params = {
              abnormalId:that.basic.abnormalId
            }
            that.$http.post("/examinecenter/oqc/abnormal/apply-complete", params).then((res) => {
              that.$Message.success(i18n.t('oqc.commit'));
              this.$store.commit('RENDER_CHANGE',true)
              this.$emit("close-tab", this.$props.tabKey);
            })
          })
        }
      }else{
        //如果第一次添加，用户没有点保存的情况下，直接点的提交
        url='/examinecenter/oqc/abnormal';
        // that.basic.creatorId=that.other.currentUser.userId;
        that.basic.creatorId=that.d2Description.operatorId
        // alert(that.basic.creatorId)
        let	parmas={
          basic:that.basic,
          d1Team:that.d1Team,
          d2Description:that.d2Description,
          defectRecords:that.defectRecords.table.data,
        }
        that.$http.post(url,parmas,that.headers).then((res)=> {
          url = '/examinecenter/oqc/abnormal/apply?abnormalId='+res.data.basic.abnormalId;
          that.$http.post(url,that.headers).then((res)=> {
            that.$Message.success(i18n.t('oqc.commit'));
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
      that.basic.creatorId=that.d2Description.operatorId
      let params = [
        {type:'Empty',title:i18n.t('oqc.happenTime'),value:that.basic.createTime},
        {type:'Empty',title:i18n.t('oqc.abnNo'),value:that.basic.abnormalNo},
        {type:'No',title:i18n.t('oqc.abnNo'),value:that.basic.abnormalNo},
        // {type:'Empty',title:i18n.t('oqc.productBatch'),value:that.basic.batchNo},
        {type:'Empty',title:i18n.t('oqc.place'),value:that.basic.abnormalPlace},
        {type:'Word20',title:i18n.t('oqc.place'),value:that.basic.abnormalPlace},
        {type:'Empty',title:i18n.t('oqc.productNo'),value:that.basic.productId},
        // {type:'Empty',title:i18n.t('oqc.customer'),value:that.basic.customerId},          
        // {type:'Empty',title:'所属供应商',value:that.basic.supplierId},          
        {type:'Empty',title:i18n.t('oqc.quantity'),value:that.basic.batchQuantity},
        {type:'NumNot0',title:i18n.t('oqc.quantity'),value:that.basic.batchQuantity},
        // {type:'Empty',title:i18n.t('oqc.qcNum'),value:that.basic.inspectionQuantity},
        {type:'Num',title:i18n.t('oqc.qcNum'),value:that.basic.inspectionQuantity},
        {type:'Empty',title:i18n.t('oqc.badNum'),value:that.basic.badQuantity},
        {type:'Num',title:i18n.t('oqc.badNum'),value:that.basic.badQuantity},
        {type:'Empty',title:i18n.t('oqc.treatmentMethod'),value:that.basic.treatmentMethod},
        {type:'Empty',title:i18n.t('oqc.treatmentLimit'),value:that.basic.treatmentTimeLimit},
        {type:'Empty',title:i18n.t('oqc.theme'),value:that.basic.subject},
        {type:'Word20',title:i18n.t('oqc.theme'),value:that.basic.subject},
        {type:'Word600',title:i18n.t('oqc.abnDescribe'),value:that.d2Description.description},

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

      let url='/examinecenter/oqc/abnormal';
      for(let i=0;i<that.defectRecords.table.data.length;i++){
          
        if(that.defectRecords.table.data[i].inspectionTypeId==''||that.defectRecords.table.data[i].defectTypeId==''|| that.defectRecords.table.data[i].sampleQuantity===''|| that.defectRecords.table.data[i].defectQuantity===''){
            that.$Notice.warning({title: i18n.t('oqc.pleaseInput')+i18n.t('oqc.defectRecord')+(i+1)});
            return;
        }
        let paramsDefects = [
          {type: 'NumNot0', title: i18n.t('oqc.sampleQuantity'), value: that.defectRecords.table.data[i].sampleQuantity},
          {type: 'Num', title: i18n.t('oqc.defectNum'), value: that.defectRecords.table.data[i].defectQuantity},
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
        if(that.defectRecords.table.data[i].defectLocationId==i18n.t('oqc.null')){
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
        // that.basic.creatorId=that.other.currentUser.userId;

        parmas={
          basic:that.basic,
          d1Team:that.d1Team,
          d2Description:that.d2Description,
          defectRecords:that.defectRecords.table.data,
        }
        that.$http.post('/examinecenter/oqc/abnormal?type=save',parmas,that.headers).then((res)=> {
          that.closePage();
          that.basic.abnormalId=res.data.basic.abnormalId;
          that.$emit("open-tab","qc-oqc-abnormal-edit-"+that.basic.abnormalId,i18n.t('oqc.editOqcAbn')+'-'+that.basic.productNo,"page-exam-oqc-abnormal-add",{abnormalId:that.basic.abnormalId});
          that.$Message.success(i18n.t('oqc.addSuccess'));
          for(let i = 0; i<that.defectRecords.table.data.length; i++){
            if(!that.defectRecords.table.data[i].defectLocationId){
              that.defectRecords.table.data[i].defectLocationId=i18n.t('oqc.null');
            }
          }
        })
      }else{
        //修改数据
        if(that.basic.abnormalState==5){
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
        }
        let tempData = that.defectRecords.table.data;
        for(var i=0;i<tempData.length;i++){
          tempData[i].abnormalId=that.basic.abnormalId;
        }
        let url="/examinecenter/oqc/abnormal?type=save"

        that.$http.get("/examinecenter/oqc/abnormal/"+that.basic.abnormalId).then((res)=> {
          // alert(res.data.basic.abnormalState)
          if(res.data.basic.abnormalState==8||res.data.basic.abnormalState==9){
              that.initData();
              that.other.saveButton=false;
              if(res.data.basic.abnormalState==8){
                this.$Notice.warning({
                  title: i18n.t('oqc.submitStopEdit'),
                  desc: ''
                });
              }
              if(res.data.basic.abnormalState==9){
                this.$Notice.warning({
                  title: i18n.t('oqc.endStopEdit'),
                  desc: ''
                });
              }

            }else{
              // debugger
              
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
              that.$http.put(url,parmas,that.headers).then((res)=> {
                /*//如果状态为5 则显示提交按钮
                if(that.basic.abnormalState==5){
                  that.basic.commitShow=true;
                }*/
                //状态在处理中的时候  判断d3和d4有没有全部填写完


                that.$Message.success(i18n.t('oqc.editSuccess'));
                for(let i = 0; i<that.defectRecords.table.data.length; i++){
                  if(!that.defectRecords.table.data[i].defectLocationId){
                    that.defectRecords.table.data[i].defectLocationId=i18n.t('oqc.null');
                  }
                }
                if(that.basic.abnormalState==5){
                  that.other.spinShow=false
                  that.$http.get(url="/examinecenter/oqc/abnormal/"+that.basic.abnormalId).then((res)=> {
                    that.d3Contain=res.data.d3Contain;
                    that.d3Contain.operateTime=new Date(that.d3Contain.operateTime);
                    that.d4Cause=res.data.d4Cause;
                    if(that.d3Contain.attachments==null){
                      that.d3Contain.attachments=new Array();
                    }
                    if(that.d4Cause.attachments==null){
                      that.d4Cause.attachments=new Array();
                    }
                    that.other.spinShow=true
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
      if(!val){return;}
      that.$http.get('/basic/product/detail/'+val).then(res=>{
        that.basic.productName=res.data.name
        that.basic.productNo=res.data.no
      })
      return;
      //that.productName(val);

    },

    //获取当前登录人员信息 /tenant/user/profile
    getCurrentOperator(){
      let that=this;
      let url='/tenant/user/profile'
      that.$http.get(url).then((res)=>{
        //console.log(res,11111111111111)
          that.other.currentUser=res.data;
          that.d2Description.operatorId=res.data.userId;
          that.d1Team.creatorId=res.data.userId;
          that.d3Contain.operatorId=res.data.userId;
          that.d3Contain.operatorName=res.data.name;
          that.d4Cause.operatorId=res.data.userId;
          that.d4Cause.operatorName=res.data.name;
          that.d8Congratulation.operatorId=res.data.userId;
          //console.log(res.data,9999);

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
        that.$Notice.warning({title: i18n.t('oqc.memberExisted')});
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
        that.$Notice.warning({title: i18n.t('oqc.memberExisted')});
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
        //that.$http.get("/examinecenter/oqc/oqc",{params:{limit:99999999}}),
        //that.$http.get("/bas/manufacturer/allManufacturer",{params:{limit:999999999}}),
        that.$http.get("/tenant/user",{params:{limit:999999999}}),
        //that.$http.get("/basic/product",{params:{limit:999999999}})
      ]).then(function(resps){
        //that.prodBatch.oqcList= resps[0].data;
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
        that.defectRecords.prodBatch.DefectPosition=res.data
        that.defectRecords.prodBatch.DefectPosition.unshift({defectLocId:i18n.t('oqc.null'),name:i18n.t('oqc.null')});
      })
    },
    addDefect(){//添加缺陷
      let that=this;
      let obj = JSON.parse(JSON.stringify(that.defectRecords.discountData.tableData))
      //console.log(obj,695678);

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
        let tempList=that.prodBatch.oqcList;
        for(var i = 0;i<tempList.length;i++){
          if(that.basic.qcNo==""||that.basic.qcNo==i18n.t('oqc.null')){
            if(!that.isF){
              that.isF=true;
              return;
            }
            // that.basic.qcNo="";
            that.basic.batchNo='';
            that.basic.productId='';
            that.basic.productNo='';
            that.basic.productName='';
            that.basic.customerId='';
            that.basic.batchQuantity='';
            that.basic.inspectionQuantity='';
            that.basic.badQuantity='';
            that.other.disabled=false;
            that.ruleForm.productNames='';
          }else{
            if(tempList[i].oqcNo==that.basic.qcNo){
              that.other.disabled=true;
              that.basic.productId=tempList[i].productId;
              that.basic.productNo=tempList[i].productInfo.no;
              that.basic.productName=tempList[i].productInfo.name;
              that.basic.customerId=tempList[i].customerId;
              that.basic.batchQuantity=tempList[i].oqcQuantity;
              that.basic.inspectionQuantity=tempList[i].sampleQuantity;
              that.basic.badQuantity=tempList[i].badQuantity;
              that.basic.batchNo=tempList[i].batchNo;   
              // that.selectOn(that.basic.productId)
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
      if(!qcNo||qcNo==i18n.t('oqc.null')){that.defectRecords.table.data=[];return;}
      that.$http.get('/examinecenter/oqc/oqcdetailByOqcNo/'+qcNo).then((resp)=>{
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
          that.getDefectRate(that.defectRecords.table.data[x].defectQuantity,that.defectRecords.table.data[x].sampleQuantity,x);

        }
      })
    }, 
    //获取产品信息
    productName(){
      return;
      let that=this;
      let idValueMap = [];
      let url_product="/basic/product?examType=4&page=1&limit=9999";
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
      let url="/examinecenter/oqc/oqc?limit=99999999&query=result%3D0%26state%3D1"
      let res = that.$iqis.utils.syncget(url);//带出缺陷名称列表
      let url2="/examinecenter/oqc/oqc?limit=99999999&query=result%3D0%26state%3D2"
      let res2 = that.$iqis.utils.syncget(url2);
      that.prodBatch.oqcList=res.data.concat(res2.data)
      //console.log(that.prodBatch.oqcList,'111111111111111111111111111111')
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
<style scoped>
.titleSmall {
  color: #418fee;
  font-size: 16px;
}
.blockSmall {
  margin-bottom: 30px;
  border-bottom: 1px dashed #ddd;
  padding-bottom: 20px;
}
.picBtnHide .ivu-upload{
  display: none;
}
</style>




