<template>
  <div class="iqis-page productAdd">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        <!-- 基本资料 -->
        {{$t('product.basicInfo')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('product.createTime')}}</div>
            <div class="iqis-page-block-ctrl">
               <!-- noPermsDis:true,//控制所有输入框的禁用状态 -->
               <!-- transfer	是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果 -->
              <DatePicker :disabled="noPermsDis" type="datetime" v-model="product.updateTime" :transfer="true" format="yyyy-MM-dd HH:mm" style="width: 100%"></DatePicker>
            </div>

            <!-- 产品类别 -->
            <div class="iqis-page-block-label">{{$t('product.prodType')}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- 
                change-on-select 点任何一级都可以选择。 
                clearable="false"：是否支持清除
                render-format：选择后展示的函数，用于自定义显示选择项目的格式 如：西湖-13
                clearable：选择后出现清除按钮
                -->
              <Cascader  :disabled="noPermsDis"  v-model="product.productTypeValue" :data="selects.prodTypes[0].children"
                        :render-format = "productTreeSelectRender"
                        change-on-select :clearable="false" style="width: 100%"></Cascader>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('product.productNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="noPermsDis" id="test001" v-model="product.no" style="width: 100%;"></i-input>
            </div> 
            <div class="iqis-page-block-label">{{$t('product.productUnit')}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- filterable  	是否支持搜索-->
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="noPermsDis" v-model="product.prodUnitId" filterable>
                <Option v-for="item in selects.prodUnits" :value="item.prodUnitId" :key="item.prodUnitId">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <!-- 产品名称 -->
            <div class="iqis-page-block-label">{{$t('product.productName')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  :disabled="noPermsDis" v-model="product.name" style="width: 100%;"></i-input>
            </div>
            <!-- 使用状态 -->
            <div class="iqis-page-block-label">{{$t('product.useState')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis" v-model="product.useState" filterable>
                <Option v-for="item in selects.useStates" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            
          </i-col>
          <i-col span="6">
            <!-- 规格型号 -->
            <div class="iqis-page-block-label">{{$t('product.productSpec')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  :disabled="noPermsDis" v-model="product.spec" style="width: 100%;"></i-input>
            </div>
            <!-- 版本 -->
            <div class="iqis-page-block-label">{{$t('product.version')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  
              :disabled="noPermsDis" 
              v-model="product.userVersion" 
              style="width: 100%;" 
              :maxlength='40'
              >
              </i-input>
            </div>
            <div class="iqis-page-block-label">{{$t('product.version')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  :disabled="noPermsDis" v-model="product.userVersion" style="width: 100%;" 
              :maxlength=40></i-input>
            </div> 
          </i-col>
        </Row>
        <div class="iqis-page-ctrl-row">
          <!-- 启用检验 -->
          <CheckboxGroup style="line-height: 24px;">
            <span style="margin-right: 24px;">{{$t('product.startInspection')}}</span>
            <Checkbox :disabled="noPermsDis" v-model="product.settings.qc.iqc.aql.useState" class="iqis-page-product-add-checkbox" label="iqc">{{$t('product.iqc')}}</Checkbox>
            <Checkbox :disabled="noPermsDis" v-model="product.settings.qc.pqc.aql.useState" class="iqis-page-product-add-checkbox" label="pqc">{{$t('product.pqc')}}</Checkbox>
            <Checkbox :disabled="noPermsDis" v-model="product.settings.qc.oqc.aql.useState" class="iqis-page-product-add-checkbox" label="oqc">{{$t('product.oqc')}}</Checkbox>
          </CheckboxGroup>
        </div>
      </div>
    </div>
    <!-- 来料检验 -->
    <transition name="fade">
    <div v-if="product.settings.qc.iqc.aql.useState" class="iqis-page-block  iqis-product-qc-block">
      <div class="iqis-page-block-title">
        {{$t('product.iqc')}}
      </div>
      <div class="iqis-page-block-body">
        <!-- 启用检验方案 -->
        <Row style="margin-top:10px;">
          <i-col span="24">
            <RadioGroup v-model="product.settings.qc.iqc.aql.samplingPlanType" @on-change="changeSamplingPlanType(product.settings.qc.iqc.aql.samplingPlanType,'iqc')">
              <Radio :label="1">{{$t('product.inspectionItems')}}</Radio>
              <Radio :label="0">{{$t('product.productSampling')}}</Radio>
            </RadioGroup>
          </i-col>
        </Row>
        <!-- 宽转严规则 -->
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('product.transRule')}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- 判断是否选择了检验或是设置了不禁用选择选择框 -->
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="noermsDis||product.settings.qc.iqc.fullDis||product.settings.qc.iqc.percentDis" v-model="product.settings.qc.iqc.aql.transRuleId" filterable>
                <Option v-for="item in selects.transRules" :value="item.ruleId" :key="item.ruleId">{{ item.ruleName }}</Option>
              </Select>
            </div>
            <!-- 选择抽样，显示内容 -->
            <div v-if="product.settings.qc.iqc.aql.samplingPlanType===0" class="iqis-page-block-label">{{$t('product.critical')}}</div>
            <div v-if="product.settings.qc.iqc.aql.samplingPlanType===0" class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis||product.settings.qc.iqc.fullDis||product.settings.qc.iqc.percentDis" v-model="product.settings.qc.iqc.aql.crAql" filterable>
                <Option v-for="item in selects.iqc.aql" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </div>
          </i-col>
          
          <i-col span="6" v-if="product.settings.qc.iqc.aql.samplingPlanType===0">
            <div class="iqis-page-block-label">{{$t('product.samplingPlan')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis" v-model="product.settings.qc.iqc.aql.samplingPlanCode" filterable @on-change="changeInspStan('iqc',product.settings.qc.iqc.aql.samplingPlanCode)">
                <Option v-for="item in selects.samplingPlans" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="iqis-page-block-label">{{$t('product.major')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis||product.settings.qc.iqc.fullDis||product.settings.qc.iqc.percentDis" v-model="product.settings.qc.iqc.aql.majAql" filterable>
                <Option v-for="item in selects.iqc.aql" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6" v-if="product.settings.qc.iqc.aql.samplingPlanType===0">
            <div class="iqis-page-block-label">{{$t('product.inspectionStandard')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-if="product.settings.qc.iqc.aql.samplingPlanCode!='percent'" :disabled="noPermsDis||product.settings.qc.iqc.fullDis" v-model="product.settings.qc.iqc.aql.inspectionStandard" filterable>
                <Option v-for="item in selects.iqc.samplingLevel" :value="item.value" :key="item.key">{{ item.label }}</Option>
              </Select>
              <Select v-else :disabled="noPermsDis||product.settings.qc.iqc.fullDis" v-model="product.settings.qc.iqc.aql.inspectionStandard" filterable>
                <Option v-for="item in selects.iqc.samplingLevel" :value="item" :key="item"></Option>
              </Select>
            </div>
            <div class="iqis-page-block-label">{{$t('product.minor')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis||product.settings.qc.iqc.fullDis||product.settings.qc.iqc.percentDis" v-model="product.settings.qc.iqc.aql.minAql" filterable>
                <Option v-for="item in selects.iqc.aql" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
          </i-col>
        </Row>
        <!-- 参数设置 -->
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label">{{$t('product.setParams')}}</div>
          </div>
          <div class="iqis-page-block-tools-second">
            <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('product.changed')}} {{table.iqc.params.selected.length}} {{$t('product.params')}}</span>
            <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
              confirm
              :title="i18n.t('product.confirmDelete')"
              @on-ok="deleteParams('xTable_iqc_params')"
              placement="bottom-end">
              <!--旧版本表格@on-ok="deleteIqcParams"-->
              <!-- 删除按钮 -->
              <Button type="ghost" icon="trash-a" :disabled="noPermsDis">{{$t('product.delete')}}</Button>
            </Poptip>
          </div>
        </div>
        <div class="iqis-page-block-table">
          <!--旧版本表格-->
          <!-- <Table  :no-data-text="i18n.t('noData')" v-drag-table-column="table.iqc.columns" ref="iqcParamTable" class="iqis-inline-editor-table noBorder location noHeight"  @on-selection-change="iqcTableSelectChange" border stripe
                 :loading="table.iqc.loading" :columns="table.iqc.columns" :data="product.settings.qc.iqc.params" >
            <Button  :disabled="noPermsDis" @click="iqcAddParams" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t('product.addIqcParams')}}</Button>
          </Table> -->
          <!-- 来料-新版本表格vxe --><!-- 来料检验参数设置表格 -->
          <vxe-table
            border
            resizable
            highlight-hover-row
            row-id="_$_row_id"
            class="vxe-table-iview"
            id="xTable_iqc_params"
            ref="xTable_iqc_params"
            max-height="262"
            size="small"
            show-overflow
            :data.sync="product.settings.qc.iqc.params"
            :edit-config="{key:'_$_row_id' , trigger: 'click', mode: 'row',showIcon:false}"
            @cell-click="cellClick"
            @edit-closed="editClosed"
          >
            <vxe-table-column type="selection" width="40"></vxe-table-column>
            <vxe-table-column type="index" :label="i18n.t('product.no')" :width="this.$store.state.locale=='zh_CN'?50:120"></vxe-table-column>
            <!-- 检验项目 -->
            <vxe-table-column 
              field="inspectionTypeId" 
              :label="i18n.t('product.project')" 
              :min-width="this.$store.state.locale=='zh_CN'?90:120" 
              :edit-render="{
                  name: 'Cascader', 
                  props: {
                    data: selects.inspectionTypes[0].children,
                    changeOnSelect:true,
                    transfer:true,
                    renderFormat:typeRender
                    },
                  events:{
                    'on-change':changeInspectionTypeId}
                  }" 
              :formatter="formatInspectionType"
            >
            </vxe-table-column>
            <vxe-table-column 
              field="measUnitId" 
              :label="i18n.t('product.measUnit')" 
              :min-width="this.$store.state.locale=='zh_CN'?85:150" 
              :edit-render="{type: 'default'}"
            >
              <template v-slot:edit="{ row }">
                <Select 
                  v-model="row.measUnitId" 
                  :transfer="true" 
                  :placeholder="i18n.t('Unlimited')"
                >
                  <Option :value="null">{{$t("Unlimited")}}</Option>
                  <Option v-for="item in row.measUnitList" :value="item.measUnitId" :key="item.measUnitId">{{ item.unitSymbol }}</Option>
                </Select>
              </template>
              <template v-slot="{ row }">{{ getSelectLabel(row.measUnitId, row.measUnitList,'measUnitId','unitSymbol') }}</template>
            </vxe-table-column>
            <vxe-table-column field="chkDevId" :label="i18n.t('iqc.chkDev')" :min-width="this.$store.state.locale=='zh_CN'?120:220" :edit-render="{type: 'default'}">
              <template v-slot:edit="{ row }">
                <Select v-model="row.chkDevId" :transfer="true" :placeholder="i18n.t('Unlimited')">
                  <Option :value="null">{{$t("Unlimited")}}</Option>
                  <Option v-for="item in selects.equipment" :value="item.chkDevId" :key="item.chkDevId">{{ item.name }}</Option>
                </Select>
              </template>
              <template v-slot="{ row }">{{ getSelectLabel(row.chkDevId, selects.equipment,'chkDevId','name') }}</template>
            </vxe-table-column>
            <vxe-table-column 
              field="sl" 
              label="SL" 
              width="80" 
              :edit-render="{
                name: 'Input',
                events:{
                  'on-blur':changeSl
                }}"
            >
            </vxe-table-column>
            <vxe-table-column field="positiveTolerance" :label="i18n.t('product.positiveTolerance')" :width="this.$store.state.locale=='zh_CN'?80:100" :edit-render="{name: 'Input',events:{'on-blur':changePt}}"></vxe-table-column>
            <vxe-table-column field="negativeTolerance" :label="i18n.t('product.negativeTolerance')" :width="this.$store.state.locale=='zh_CN'?80:100" :edit-render="{name: 'Input',events:{'on-blur':changeNt}}"></vxe-table-column>
            <vxe-table-column field="usl" label="USL" width="80" :edit-render="{name: 'Input'}"></vxe-table-column>
            <vxe-table-column field="lsl" label="LSL" width="80" :edit-render="{name: 'Input'}"></vxe-table-column>
            <vxe-table-column field="samplingPlanCode" :label="i18n.t('iqc.samplingPlan')" :min-width="this.$store.state.locale=='zh_CN'?120:220" :formatter="formatSamplingPlanCode"></vxe-table-column>
            <vxe-table-column field="inspectionStandard" :label="i18n.t('product.inspectionStandard')" :min-width="this.$store.state.locale=='zh_CN'?120:220" :formatter="formatInspectionStandard"></vxe-table-column>
            <vxe-table-column field="aql" label="AQL" width="80"></vxe-table-column>
            <vxe-table-column field="scale" :label="i18n.t('product.scale')" width="80" :edit-render="{name: 'Select', options:scaleList , props: {transfer:true}}"></vxe-table-column>
          </vxe-table>
          <!-- 添加来料检验参数按钮 -->
          <div class="vxe-button">
            <Button  :disabled="noPermsDis" @click="addParams('iqc')" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;" icon="plus">{{$t('product.addIqcParams')}}</Button>
          </div>
          <!-- 新版本表格vxe -->
        </div>

        <!-- 来料检验属性设置 -->
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <!-- <div class="iqis-page-block-label">{{$t('product.setParams')}}</div> -->
            <div class="iqis-page-block-label">{{$t('product.attributeSet')}}</div>
          </div>
          <div class="iqis-page-block-tools-second">
            <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('product.changed')}} {{table.iqc.paramss.selected.length}} {{$t('product.params')}}</span>
            <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
              confirm
              :title="i18n.t('product.confirmDelete')"
              @on-ok="deleteIqcParamss"
              placement="bottom-end">
              <Button type="ghost" icon="trash-a" :disabled="table.iqc.paramss.selected.length==0||noPermsDis">{{$t('product.delete')}}</Button>
            </Poptip>
          </div>
        </div>
        <div class="iqis-page-block-table">
          <Table :columns="table.iqc.columnss" border v-drag-table-column="table.iqc.columnss" :data="product.settings.qc.iqc.property" class="iqis-inline-editor-table location noHeight noBorder" @on-selection-change="iqcTableSelectChanges"
          :no-data-text="i18n.t('noData')" :loading="table.iqc.loading" ref="iqcParamTables">
            <Button  :disabled="noPermsDis" @click="iqcAddParamss" slot="footer" class="iqis-table-footer-btn" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t('product.addIncomingAttributes')}}</Button>
          </Table>
        </div>
      </div>
    </div>
    </transition>
    <transition name="fade">
    <div v-if="product.settings.qc.pqc.aql.useState" class="iqis-page-block  iqis-product-qc-block">
      <div class="iqis-page-block-title">
        {{$t('product.pqc')}}
      </div>
      <div class="iqis-page-block-body">
        <Row style="margin-top:10px;">
          <i-col span="24">
            <RadioGroup v-model="product.settings.qc.pqc.aql.samplingPlanType" @on-change="changeSamplingPlanType(product.settings.qc.pqc.aql.samplingPlanType,'pqc')">
              <Radio :label="1">{{$t('product.inspectionItems')}}</Radio>
              <Radio :label="0">{{$t('product.productSampling')}}</Radio>
            </RadioGroup>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('product.transRule')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="noPermsDis||product.settings.qc.pqc.fullDis||product.settings.qc.pqc.percentDis" v-model="product.settings.qc.pqc.aql.transRuleId" filterable>
                <Option v-for="item in selects.transRules" :value="item.ruleId" :key="item.ruleId">{{ item.ruleName }}</Option>
              </Select>
            </div>
            <div v-if="product.settings.qc.pqc.aql.samplingPlanType===0">
              <div class="iqis-page-block-label">{{$t('product.critical')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :disabled="noPermsDis||product.settings.qc.pqc.fullDis||product.settings.qc.pqc.percentDis" v-model="product.settings.qc.pqc.aql.crAql" filterable>
                  <Option v-for="item in selects.pqc.aql" :value="item" :key="item">{{ item }}</Option>
                </Select>
              </div>
              <div class="iqis-page-block-label">{{$t('product.prodFlow')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :placeholder="i18n.t('pleaseChoose')" :disabled="noPermsDis" v-model="product.settings.qc.pqc.aql.prodFlowId" filterable>
                  <Option v-for="item in selects.prodFlows" :value="item.prodTaskId" :key="item.prodTaskId">{{ item.prodTaskName }}</Option>
                </Select>
              </div>
            </div>
            </i-col>
          <i-col span="6" v-if="product.settings.qc.pqc.aql.samplingPlanType===1">
            <div class="iqis-page-block-label">{{$t('product.prodFlow')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="noPermsDis" v-model="product.settings.qc.pqc.aql.prodFlowId" filterable>
                <Option v-for="item in selects.prodFlows" :value="item.prodTaskId" :key="item.prodTaskId">{{ item.prodTaskName }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div v-if="product.settings.qc.pqc.aql.samplingPlanType===0">
              <div class="iqis-page-block-label">{{$t('product.samplingPlan')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :disabled="noPermsDis" v-model="product.settings.qc.pqc.aql.samplingPlanCode" filterable @on-change="changeInspStan('pqc',product.settings.qc.pqc.aql.samplingPlanCode)">
                  <Option v-for="item in selects.samplingPlans" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </div>
              <div class="iqis-page-block-label">{{$t('product.major')}}</div>
              <div class="iqis-page-block-ctrl">
                <Select :disabled="noPermsDis||product.settings.qc.pqc.fullDis||product.settings.qc.pqc.percentDis" v-model="product.settings.qc.pqc.aql.majAql" filterable>
                  <Option v-for="item in selects.pqc.aql" :value="item" :key="item">{{ item }}</Option>
                </Select>
              </div>
            </div>
            <div class="iqis-page-block-label">{{$t('product.fpyTarget')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  :disabled="noPermsDis" v-model="product.settings.qc.pqc.aql.targetRty" placeholder="0~100" style="width: 100%;"><span slot="append">%</span></i-input>
            </div>
          </i-col>
          <i-col span="6" v-if="product.settings.qc.pqc.aql.samplingPlanType===0">
            <div class="iqis-page-block-label">{{$t('product.inspectionStandard')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-if="product.settings.qc.pqc.aql.samplingPlanCode!='percent'" :disabled="noPermsDis||product.settings.qc.pqc.fullDis" v-model="product.settings.qc.pqc.aql.inspectionStandard" filterable>
                <Option v-for="item in selects.pqc.samplingLevel" :value="item.value" :key="item.key">{{ item.label }}</Option>
              </Select>
              <Select v-else :disabled="noPermsDis||product.settings.qc.pqc.fullDis" v-model="product.settings.qc.pqc.aql.inspectionStandard" filterable>
                <Option v-for="item in selects.pqc.samplingLevel" :value="item" :key="item"></Option>
              </Select>
            </div>
            <div class="iqis-page-block-label">{{$t('product.minor')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis||product.settings.qc.pqc.fullDis||product.settings.qc.pqc.percentDis" v-model="product.settings.qc.pqc.aql.minAql" filterable>
                <Option v-for="item in selects.pqc.aql" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
          </i-col>
        </Row>
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label">{{$t('product.setParams')}}</div>
          </div>
          <div class="iqis-page-block-tools-second">
            <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('product.changed')}} {{table.pqc.params.selected.length}} {{$t('product.params')}}</span>
            <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
              confirm
              :title="i18n.t('product.confirmDelete')"
              @on-ok="deleteParams('xTable_pqc_params')"
              placement="bottom-end">
              <Button type="ghost" icon="trash-a" :disabled="noPermsDis">{{$t('product.delete')}}</Button>
            </Poptip>
          </div>
        </div>
        <div class="iqis-page-block-table">
          <!-- <Table  :no-data-text="i18n.t('noData')" v-drag-table-column="table.pqc.columns" ref="pqcParamTable" class="iqis-inline-editor-table noBorder noHeight location"  @on-selection-change="pqcTableSelectChange" border stripe
                 :loading="table.pqc.loading" :columns="table.pqc.columns" :data="product.settings.qc.pqc.params" >
            <Button  :disabled="noPermsDis" @click="pqcAddParams" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t('product.addPqcParams')}}</Button>
          </Table> -->
          <!-- 过程-新版本表格vxe -->
          <vxe-table
            border
            resizable
            highlight-hover-row
            row-id="_$_row_id"
            class="vxe-table-iview"
            id="xTable_pqc_params"
            ref="xTable_pqc_params"
            max-height="262"
            size="small"
            show-overflow
            :data.sync="product.settings.qc.pqc.params"
            :edit-config="{key:'_$_row_id' , trigger: 'click', mode: 'row',showIcon:false}"
            @cell-click="cellClick"
            @edit-closed="editClosed"
            >
            <vxe-table-column type="selection" width="40"></vxe-table-column>
            <vxe-table-column type="index" :label="i18n.t('product.no')" :width="this.$store.state.locale=='zh_CN'?50:120"></vxe-table-column>
            <vxe-table-column field="prodStageId" :title="i18n.t('product.prodStage')" :min-width="this.$store.state.locale=='zh_CN'?100:180" :edit-render="{name: 'Select', options: selects.prodProcessList,optionProps:{ value: 'prodProcessId', label: 'prodProcessName' },props:{transfer:true}}"></vxe-table-column>
            <vxe-table-column field="inspectionTypeId" :label="i18n.t('product.project')" :min-width="this.$store.state.locale=='zh_CN'?90:120" :edit-render="{name: 'Cascader', props: {data: selects.inspectionTypes[0].children,changeOnSelect:true,transfer:true,renderFormat:typeRender},events:{'on-change':changeInspectionTypeId}}" :formatter="formatInspectionType"></vxe-table-column>
            <vxe-table-column field="measUnitId" :label="i18n.t('product.measUnit')" :min-width="this.$store.state.locale=='zh_CN'?85:150" :edit-render="{type: 'default'}">
              <template v-slot:edit="{ row }">
                <Select v-model="row.measUnitId" :transfer="true" :placeholder="i18n.t('Unlimited')">
                  <Option :value="null">{{$t("Unlimited")}}</Option>
                  <Option v-for="item in row.measUnitList" :value="item.measUnitId" :key="item.measUnitId">{{ item.unitSymbol }}</Option>
                </Select>
              </template>
              <template v-slot="{ row }">{{ getSelectLabel(row.measUnitId, row.measUnitList,'measUnitId','unitSymbol') }}</template>
            </vxe-table-column>
            <vxe-table-column field="chkDevId" :label="i18n.t('iqc.chkDev')" :min-width="this.$store.state.locale=='zh_CN'?120:220" :edit-render="{type: 'default'}">
              <template v-slot:edit="{ row }">
                <Select v-model="row.chkDevId" :transfer="true" :placeholder="i18n.t('Unlimited')">
                  <Option :value="null">{{$t("Unlimited")}}</Option>
                  <Option v-for="item in selects.equipment" :value="item.chkDevId" :key="item.chkDevId">{{ item.name }}</Option>
                </Select>
              </template>
              <template v-slot="{ row }">{{ getSelectLabel(row.chkDevId, selects.equipment,'chkDevId','name') }}</template>
            </vxe-table-column>
            <vxe-table-column field="sl" label="SL" width="80" :edit-render="{name: 'Input',events:{'on-blur':changeSl}}"></vxe-table-column>
            <vxe-table-column field="positiveTolerance" :label="i18n.t('product.positiveTolerance')" :width="this.$store.state.locale=='zh_CN'?80:100" :edit-render="{name: 'Input',events:{'on-blur':changePt}}"></vxe-table-column>
            <vxe-table-column field="negativeTolerance" :label="i18n.t('product.negativeTolerance')" :width="this.$store.state.locale=='zh_CN'?80:100" :edit-render="{name: 'Input',events:{'on-blur':changeNt}}"></vxe-table-column>
            <vxe-table-column field="usl" label="USL" width="80" :edit-render="{name: 'Input'}"></vxe-table-column>
            <vxe-table-column field="lsl" label="LSL" width="80" :edit-render="{name: 'Input'}"></vxe-table-column>
            <vxe-table-column field="samplingPlanCode" :label="i18n.t('iqc.samplingPlan')" :min-width="this.$store.state.locale=='zh_CN'?120:220" :formatter="formatSamplingPlanCode"></vxe-table-column>
            <vxe-table-column field="inspectionStandard" :label="i18n.t('product.inspectionStandard')" :min-width="this.$store.state.locale=='zh_CN'?120:220" :formatter="formatInspectionStandard"></vxe-table-column>
            <vxe-table-column field="aql" label="AQL" width="80"></vxe-table-column>
            <vxe-table-column field="scale" :label="i18n.t('product.scale')" width="80" :edit-render="{name: 'Select', options:scaleList , props: {transfer:true}}"></vxe-table-column>
          </vxe-table>
          <div class="vxe-button">
            <Button  :disabled="noPermsDis" @click="addParams('pqc')" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;" icon="plus">{{$t('product.addIqcParams')}}</Button>
          </div>
          <!-- 新版本表格vxe -->
        </div>

        <!-- 过程属性设置 -->
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <!-- <div class="iqis-page-block-label">{{$t('product.setParams')}}</div> -->
            <div class="iqis-page-block-label">{{$t('product.attributeSet')}}</div>
          </div>
          <div class="iqis-page-block-tools-second">
            <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('product.changed')}} {{table.pqc.paramss.selected.length}} {{$t('product.params')}}</span>
            <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
              confirm
              :title="i18n.t('product.confirmDelete')"
              @on-ok="deleteIqcParamspqc"
              placement="bottom-end">
              <Button type="ghost" icon="trash-a" :disabled="table.pqc.paramss.selected.length==0||noPermsDis">{{$t('product.delete')}}</Button>
            </Poptip>
          </div>
        </div>
        <div class="iqis-page-block-table">
          <Table :columns="table.pqc.pqcColumns" border class="location iqis-inline-editor-table noHeight noBorder" v-drag-table-column="table.pqc.pqcColumns" :data="product.settings.qc.pqc.property" @on-selection-change="pqcTableSelectChanges"
          :no-data-text="i18n.t('noData')" :loading="table.iqc.loading" ref="pqcParamTables">
            <Button  :disabled="noPermsDis" @click="pqcAddParamss" slot="footer" class="iqis-table-footer-btn" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t('product.addProcedureAttribute')}}</Button>
          </Table>
        </div>

      </div>
    </div>
    </transition>


    <!-- 选择出货检验下面的项目 -->
    <transition name="fade">
    <div v-if="product.settings.qc.oqc.aql.useState" class="iqis-page-block  iqis-product-qc-block">
      <div class="iqis-page-block-title">
        {{$t('product.oqc')}}
      </div>
      <div class="iqis-page-block-body">
        <Row style="margin-top:10px;">
          <i-col span="24">
            <RadioGroup v-model="product.settings.qc.oqc.aql.samplingPlanType" @on-change="changeSamplingPlanType(product.settings.qc.oqc.aql.samplingPlanType,'oqc')">
              <Radio :label="1">{{$t('product.inspectionItems')}}</Radio>
              <Radio :label="0">{{$t('product.productSampling')}}</Radio>
            </RadioGroup>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('product.transRule')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('pleaseChoose')" :disabled="noPermsDis||product.settings.qc.oqc.fullDis||product.settings.qc.oqc.percentDis" v-model="product.settings.qc.oqc.aql.transRuleId" filterable>
                <Option v-for="item in selects.transRules" :value="item.ruleId" :key="item.ruleId">{{ item.ruleName }}</Option>
              </Select>
            </div>
            <div v-if="product.settings.qc.oqc.aql.samplingPlanType===0" class="iqis-page-block-label">{{$t('product.critical')}}</div>
            <div v-if="product.settings.qc.oqc.aql.samplingPlanType===0" class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis||product.settings.qc.oqc.fullDis||product.settings.qc.oqc.percentDis" v-model="product.settings.qc.oqc.aql.crAql" filterable>
                <Option v-for="item in selects.oqc.aql" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6" v-if="product.settings.qc.oqc.aql.samplingPlanType===0">
            <div class="iqis-page-block-label">{{$t('product.samplingPlan')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis" v-model="product.settings.qc.oqc.aql.samplingPlanCode" filterable @on-change="changeInspStan('oqc',product.settings.qc.oqc.aql.samplingPlanCode)">
                <Option v-for="item in selects.samplingPlans" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="iqis-page-block-label">{{$t('product.major')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis||product.settings.qc.oqc.fullDis||product.settings.qc.oqc.percentDis" v-model="product.settings.qc.oqc.aql.majAql" filterable>
                <Option v-for="item in selects.oqc.aql" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6" v-if="product.settings.qc.oqc.aql.samplingPlanType===0">
            <div class="iqis-page-block-label">{{$t('product.inspectionStandard')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-if="product.settings.qc.oqc.aql.samplingPlanCode!='percent'" :disabled="noPermsDis||product.settings.qc.oqc.fullDis" v-model="product.settings.qc.oqc.aql.inspectionStandard" filterable>
                <Option v-for="item in selects.oqc.samplingLevel" :value="item.value" :key="item.key">{{ item.label }}</Option>
              </Select>
              <Select v-else :disabled="noPermsDis||product.settings.qc.oqc.fullDis" v-model="product.settings.qc.oqc.aql.inspectionStandard" filterable>
                <Option v-for="item in selects.oqc.samplingLevel" :value="item" :key="item"></Option>
              </Select>
            </div>

            <div class="iqis-page-block-label">{{$t('product.minor')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="noPermsDis||product.settings.qc.oqc.fullDis||product.settings.qc.oqc.percentDis" v-model="product.settings.qc.oqc.aql.minAql" filterable>
                <Option v-for="item in selects.oqc.aql" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
          </i-col>
        </Row>
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label">{{$t('product.setParams')}}</div>
          </div>
          <div class="iqis-page-block-tools-second">
            <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('product.changed')}} {{table.oqc.params.selected.length}} {{$t('product.params')}}</span>
            <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
              confirm
              :title="i18n.t('product.confirmDelete')"
              @on-ok="deleteParams('xTable_oqc_params')"
              placement="bottom-end">
              <Button type="ghost" icon="trash-a" :disabled="noPermsDis">{{$t('product.delete')}}</Button>
            </Poptip>
          </div>
        </div>
        <div class="iqis-page-block-table">
          <!-- <Table  :no-data-text="i18n.t('noData')" v-drag-table-column="table.oqc.columns" ref="oqcParamTable" class="iqis-inline-editor-table noBorder noHeight location"  @on-selection-change="oqcTableSelectChange" border stripe
                 :loading="table.oqc.loading" :columns="table.oqc.columns" :data="product.settings.qc.oqc.params" >
            <Button :disabled="noPermsDis" @click="oqcAddParams" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t('product.addOqcParams')}}</Button>
          </Table> -->
          <!-- 出货-新版本表格vxe -->
          <vxe-table
            border
            resizable
            highlight-hover-row
            row-id="_$_row_id"
            class="vxe-table-iview"
            id="xTable_oqc_params"
            ref="xTable_oqc_params"
            max-height="262"
            size="small"
            show-overflow
            :data.sync="product.settings.qc.oqc.params"
            :edit-config="{key:'_$_row_id' , trigger: 'click', mode: 'row',showIcon:false}"
            @cell-click="cellClick"
            @edit-closed="editClosed"
            >
            <vxe-table-column type="selection" width="40"></vxe-table-column>
            <vxe-table-column type="index" :label="i18n.t('product.no')" :width="this.$store.state.locale=='zh_CN'?50:120"></vxe-table-column>
            <vxe-table-column field="inspectionTypeId" :label="i18n.t('product.project')" :min-width="this.$store.state.locale=='zh_CN'?90:120" :edit-render="{name: 'Cascader', props: {data: selects.inspectionTypes[0].children,changeOnSelect:true,transfer:true,renderFormat:typeRender},events:{'on-change':changeInspectionTypeId}}" :formatter="formatInspectionType"></vxe-table-column>
            <vxe-table-column field="measUnitId" :label="i18n.t('product.measUnit')" :min-width="this.$store.state.locale=='zh_CN'?85:150" :edit-render="{type: 'default'}">
              <template v-slot:edit="{ row }">
                <Select v-model="row.measUnitId" :transfer="true" :placeholder="i18n.t('Unlimited')">
                  <Option :value="null">{{$t("Unlimited")}}</Option>
                  <Option v-for="item in row.measUnitList" :value="item.measUnitId" :key="item.measUnitId">{{ item.unitSymbol }}</Option>
                </Select>
              </template>
              <template v-slot="{ row }">{{ getSelectLabel(row.measUnitId, row.measUnitList,'measUnitId','unitSymbol') }}</template>
            </vxe-table-column>
            <vxe-table-column field="chkDevId" :label="i18n.t('iqc.chkDev')" :min-width="this.$store.state.locale=='zh_CN'?120:220" :edit-render="{type: 'default'}">
              <template v-slot:edit="{ row }">
                <Select v-model="row.chkDevId" :transfer="true" :placeholder="i18n.t('Unlimited')">
                  <Option :value="null">{{$t("Unlimited")}}</Option>
                  <Option v-for="item in selects.equipment" :value="item.chkDevId" :key="item.chkDevId">{{ item.name }}</Option>
                </Select>
              </template>
              <template v-slot="{ row }">{{ getSelectLabel(row.chkDevId, selects.equipment,'chkDevId','name') }}</template>
            </vxe-table-column>
            <vxe-table-column field="sl" label="SL" width="80" :edit-render="{name: 'Input',events:{'on-blur':changeSl}}"></vxe-table-column>
            <vxe-table-column field="positiveTolerance" :label="i18n.t('product.positiveTolerance')" :width="this.$store.state.locale=='zh_CN'?80:100" :edit-render="{name: 'Input',events:{'on-blur':changePt}}"></vxe-table-column>
            <vxe-table-column field="negativeTolerance" :label="i18n.t('product.negativeTolerance')" :width="this.$store.state.locale=='zh_CN'?80:100" :edit-render="{name: 'Input',events:{'on-blur':changeNt}}"></vxe-table-column>
            <vxe-table-column field="usl" label="USL" width="80" :edit-render="{name: 'Input'}"></vxe-table-column>
            <vxe-table-column field="lsl" label="LSL" width="80" :edit-render="{name: 'Input'}"></vxe-table-column>
            <vxe-table-column field="samplingPlanCode" :label="i18n.t('iqc.samplingPlan')" :min-width="this.$store.state.locale=='zh_CN'?120:220" :formatter="formatSamplingPlanCode"></vxe-table-column>
            <vxe-table-column field="inspectionStandard" :label="i18n.t('product.inspectionStandard')" :min-width="this.$store.state.locale=='zh_CN'?120:220" :formatter="formatInspectionStandard"></vxe-table-column>
            <vxe-table-column field="aql" label="AQL" width="80"></vxe-table-column>
            <vxe-table-column field="scale" :label="i18n.t('product.scale')" width="80" :edit-render="{name: 'Select', options:scaleList , props: {transfer:true}}"></vxe-table-column>
          </vxe-table>
          <div class="vxe-button">
            <Button  :disabled="noPermsDis" @click="addParams('oqc')" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;" icon="plus">{{$t('product.addIqcParams')}}</Button>
          </div>
          <!-- 新版本表格vxe -->
        </div>

        <!-- 出货检验属性设置 -->
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <!-- <div class="iqis-page-block-label">{{$t('product.setParams')}}</div> -->
            <div class="iqis-page-block-label">{{$t('product.attributeSet')}}</div>
          </div>
          <div class="iqis-page-block-tools-second">
            <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('product.changed')}} {{table.oqc.paramss.selected.length}} {{$t('product.params')}}</span>
            <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
              confirm
              :title="i18n.t('product.confirmDelete')"
              @on-ok="deleteIqcParamsoqc"
              placement="bottom-end">
              <Button type="ghost" icon="trash-a" :disabled="table.oqc.paramss.selected.length==0||noPermsDis">{{$t('product.delete')}}</Button>
            </Poptip>
          </div>
        </div>
        <div class="iqis-page-block-table">
          <Table :columns="table.oqc.oqcColumns" border class="iqis-inline-editor-table location noHeight noBorder" v-drag-table-column="table.oqc.oqcColumns" :data="product.settings.qc.oqc.property" @on-selection-change="oqcTableSelectChanges"
          :no-data-text="i18n.t('noData')" :loading="table.iqc.loading" ref="oqcParamTables">
            <Button  :disabled="noPermsDis" @click="oqcAddParamss" slot="footer" class="iqis-table-footer-btn" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t('product.addShippingAttribute')}}</Button>
          </Table>
        </div>

      </div>
    </div>
    </transition>


  <!-- 上传附件 -->
    <div class="iqis-page-block  iqis-product-qc-block">
      <div class="iqis-page-block-title">
        {{$t('product.ext')}}
        <div style="float:right;"><Button type="ghost" :disabled="noPermsDis" @click="switchs.fileEdit = !switchs.fileEdit" >{{switchs.fileEdit?i18n.t('product.edit'):i18n.t('product.complete')}}</Button></div>
      </div>
      <!--<div class="iqis-page-block-body" style="padding-top: 3px;">
        <IqisUpload :size="54" :edit="switchs.fileEdit" v-model="product.settings.ext" :fileType="['jpg','jpeg','png']"></IqisUpload>
        &lt;!&ndash; "value":data.row[data.column.key],
        "size": 32,
        "row-index": data.index,
        "row":data.row,
        "edit":!vm.other.basicD1D2Show,
        "maxSize":10240,
        "fileType":['jpg','jpeg','png'],
        "fileCount":5, &ndash;&gt;
      </div>-->
      <Spin size="large"  v-if="spinShow" style="text-align:left">
        <div class="iqis-page-block-ctrl" style="display:grid;grid-template-columns: 80px 1fr;">
          <!-- 
            isProdPage
            edit
            fileType
           -->
          <IqisUpload v-on:getPictureUrls="getPictureUrls" ref="upload" :isProdPage="true" :edit="!switchs.fileEdit&&!noPermsDis" :size="64" :max-size="20480" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="20" :value='product.settings.ext' :chartTypeShow="false">
          </IqisUpload>
          <div class="inspectionTypes">
            <div style="display:grid;grid-template-columns: 1fr 80px" v-for="(item,index) in pictureUrls" :key="index">
              <div @click="openBind(item)">
                <div>来料检验项目：<span v-for="(it,ind) in product.settings.qc.iqc.params" :key="ind" v-if="it.pictureUrl==item">{{it.inspectionTypeName}}</span></div>
                <div>过程检验项目：<span v-for="(it,ind) in product.settings.qc.pqc.params" :key="ind" v-if="it.pictureUrl==item">{{it.inspectionTypeName}}</span></div>
                <div>出货检验项目：<span v-for="(it,ind) in product.settings.qc.oqc.params" :key="ind" v-if="it.pictureUrl==item">{{it.inspectionTypeName}}</span></div>
              </div>
              <Button type="primary">删除</Button>
            </div>
          </div>
        </div>
      
      </Spin>
      <Modal
          v-model="bindInspectionsModal"
          title="绑定检验项目"
          :mask-closable="false"
          @on-ok="bindOk"
          @on-cancel="bindCancel">
          <p style="padding:10px 0 5px">来料检验项目：</p>
          <div style="padding:5px 10px 30px;border:1px solid #d2d2d2">
              <div>
                  <CheckboxGroup v-model="bindIqcInspections">
                      <Checkbox :disabled="item.pictureUrl&&item.pictureUrl!=bindImg" :label="item.inspectionTypeId[item.inspectionTypeId.length-1]" v-for="(item,index) in product.settings.qc.iqc.params" :key="index">{{item.inspectionTypeName}}</Checkbox>
                  </CheckboxGroup>
              </div>
          </div>
          <p style="padding:10px 0 5px">过程检验项目：</p>
          <div style="padding:5px 10px 30px;border:1px solid #d2d2d2"><div>
                  <CheckboxGroup v-model="bindPqcInspections">
                      <Checkbox :disabled="item.pictureUrl&&item.pictureUrl!=bindImg" :label="item.inspectionTypeId[item.inspectionTypeId.length-1]" v-for="(item,index) in product.settings.qc.pqc.params" :key="index">{{item.inspectionTypeName}}</Checkbox>
                  </CheckboxGroup>
              </div>
          </div>
          <p style="padding:10px 0 5px">出货检验项目：</p>
          <div style="padding:5px 10px 30px;border:1px solid #d2d2d2"><div>
                  <CheckboxGroup v-model="bindOqcInspections">
                      <Checkbox :disabled="item.pictureUrl&&item.pictureUrl!=bindImg" :label="item.inspectionTypeId[item.inspectionTypeId.length-1]" v-for="(item,index) in product.settings.qc.oqc.params" :key="index">{{item.inspectionTypeName}}</Checkbox>
                  </CheckboxGroup>
              </div>
          </div>
      </Modal>
    </div>

    <div class="iqis-page-block ">
      <div class="iqis-page-block-label">{{$t('product.remarks')}}</div>
      <div class="iqis-page-block-ctrl">
        <i-input :disabled="noPermsDis" type="textarea" :row="4"  v-model="product.remark" style="width: 100%;"></i-input>
      </div>
    </div>


    <IqisAffix placement="bottom" :offset="0">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button v-if="!noPermsDis" type="primary" @click="save" :loading="loadStat.saveLoading">{{$t('product.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('product.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!--end blocks-->
    <div class="page-end" style="padding-bottom: 65px"></div>
    <Spin size="large" fix v-if="loadStat.productDataLoading || loadStat.selectsDataLoading"></Spin>
  </div>
</template>
<script>
import ICol from "iview/src/components/grid/col";
import $ from 'jquery';
import Affix from "iview/src/components/affix/affix";
import Cascader from "iview/src/components/cascader/cascader";///components/cascader/cascader.vue
import Vue from 'vue'
import VXETable from 'vxe-table'
import VXETablePluginIView from 'vxe-table-plugin-iview'
// import 'vxe-table-plugin-iview/dist/style.css'
import 'vxe-table/lib/index.css'

import XEUtils from 'xe-utils'
Vue.use(VXETable, XEUtils)
VXETable.use(VXETablePluginIView)

export default {
  components: {ICol,Affix,Cascader},
  props:["params","tabKey"],
  data(){
    let vm = this;
    return{
      scaleList:[
        {value:0,label:0},
        {value:1,label:1},
        {value:2,label:2},
        {value:3,label:3},
        {value:4,label:4},
        {value:5,label:5},
      ],
      measUnitList:[],
      samplingValue:[],
      i18n:window.i18n,
      spinShow:false,
      prodTypeId:'',
      copy:'',
      mea:[],
      fullDis:false,
      percentDis:false,
      loadStat:{
        selectsDataLoading:true,
        productDataLoading:true,
        saveLoading:false
      },
      switchs:{
        fileEdit:false
      },
      selects:{
        prodTypes:[{children:[]}],
        prodUnits:[],
        inspectionTypes:[{children:[]}],
        iqcMeasureUnits:[],
        pqcMeasureUnits:{},
        oqcMeasureUnits:{},
        prodProcessList:[],
        equipment:[],
        samplingStandards:[
          {label:i18n.t('product.cn'),value:'CN'},
          {label:i18n.t('product.us'),value:'US'}
        ],
        useStates:[
          {label:i18n.t('product.using'),value:1},
          {label:i18n.t('product.stopUsing'),value:0}
        ],
        transRules:[],
        samplingPlans:[{
          value:"105E",
          label:i18n.t('product.105E')
        },{
          value:"Z1-4",
          label:i18n.t('product.Z1-4')
        },{
          value:"0D",
          label:i18n.t('product.0D')
        },{
          value:"GB/T2828.1-2012",
          label:i18n.t('product.GB')
        },
        {
          value:"full",
          label:i18n.t('product.fullSampling')
        },{
          value:"percent",
          label:i18n.t('product.percentSampling')
        }
        ],
        iqc:{
          samplingLevel:[],
          aql:[]
        },
        pqc:{
          samplingLevel:[],
          aql:[]
        },
        oqc:{
          samplingLevel:[],
          aql:[]
        }

      },
      _product:{},
      product: {
        "userVersion":"",
        "name": "",
        "no": "",
        productTypeValue:[],
        "prodTypeId": 0,
        "prodUnitId": 0,
        "productId": 0,
        "remark": "",
        "settings": {
          'samplingStandard':'CN',
          "ext":[],
          "qc": {
            // scaleList:[
            //   {value:0,label:0},
            //   {value:1,label:1},
            //   {value:2,label:2}
            // ],
            "iqc": {
              fullDis:false,
              percentDis:false,
              "aql": {
                "samplingPlanType":1,
                "crAql": "0.10",
                "inspectionStandard": "2",
                "majAql": "0.40",
                "minAql": "0.65",
                "samplingPlanCode": '105E',
                "transRuleId": '',
                "useState": false
              },
              newData:[],
              newDatas:[],
              "params": [
                // {
                //   "chkDevId": 0,
                //   "name": "string",
                //   "inspectionTypeId": 0,
                //   "inspectionTypeName": "string",
                //   "lsl": "string",
                //   "measUnitId": 0,
                //   "measUnitName": "string",
                //   "no": "string",
                //   "prodChkParamId": 0,
                //   "prodStageId": 0,
                //   "productId": 0,
                //   "sampleFq": 0,
                //   "sampleNum": 0,
                //   "scale": 0,
                //   "sl": "string",
                //   "usl": "string",
                //   "negativeTolerance": "string",
                //   "positiveTolerance": "string"
                // }
              ],
               "property": [
                  // {
                  //   "examType": 0,
                  //   "inspectionId": 0,
                  //   "inspectionLevel": "",
                  //   "productId": 0,
                  // }
                ]
            },
            "oqc": {
              fullDis:false,
              percentDis:false,
              "aql": {
                "samplingPlanType":1,
                "crAql": "0.10",
                "inspectionStandard": "2",
                "majAql": "0.40",
                "minAql": "0.65",
                "samplingPlanCode": "105E",
                "transRuleId": '',
                "useState": false
              },
              newData:[],
              newDatas:[],
              "params": [
                // {
                //   "chkDevId": 0,
                //   "name": "string",
                //   "inspectionTypeId": 0,
                //   "inspectionTypeName": "string",
                //   "lsl": "string",
                //   "measUnitId": 0,
                //   "measUnitName": "string",
                //   "no": "string",
                //   "prodChkParamId": 0,
                //   "prodStageId": 0,
                //   "productId": 0,
                //   "sampleFq": 0,
                //   "sampleNum": 0,
                //   "scale": 0,
                //   "sl": "string",
                //   "usl": "string",
                //   "negativeTolerance": "string",
                //   "positiveTolerance": "string"
                // }
              ],
               "property": [
                  // {
                  //   "examType": 0,
                  //   "inspectionId": 0,
                  //   "inspectionLevel": "",
                  //   "productId": 0,
                  // }
                ]
            },
            "pqc": {
              fullDis:false,
              percentDis:false,
              "aql": {
                "samplingPlanType":1,
                "chkDevId": '',
                "crAql": "0.10",
                "inspectionStandard": "2",
                "majAql": "0.40",
                "minAql": "0.65",
                "prodFlowId": '',
                "productId": '',
                "samplingPlanCode": "105E",
                "targetRty": "",
                "transRuleId": '',
                "useState": false
              },
              newData:[],
              newDatas:[],
              "params": [
                // {
                //   "chkDevId": 0,
                //   "name": "string",
                //   "inspectionTypeId": 0,
                //   "inspectionTypeName": "string",
                //   "lsl": "string",
                //   "measUnitId": 0,
                //   "measUnitName": "string",
                //   "no": "string",
                //   "prodChkParamId": 0,
                //   "prodStageId": 0,
                //   "productId": 0,
                //   "sampleFq": 0,
                //   "sampleNum": 0,
                //   "scale": 0,
                //   "sl": "string",
                //   "usl": "string",
                //   "negativeTolerance": "string",
                //   "positiveTolerance": "string"
                // }
              ],
               "property": [
                  // {
                  //   "examType": 0,
                  //   "inspectionId": 0,
                  //   "inspectionLevel": "",
                  //   "productId": 0,
                  // }
                ]
            }
          }
        },
        "spec": "",
        "updateTime": new Date(),
        "useState": 1,
        "version": '',
      },
      table:{
        iqc:{
          loading:false,
          params:{
            selected:[]
          },
          paramss:{
            selected:[]
          },
          columns:[
            {type: 'selection',
              align: 'center',
              minWidth:40,
              maxWidth:40
            },
            {title: i18n.t('product.no'),
              // width:80,
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align:"center",
              minWidth:this.$store.state.locale=='zh_CN'?50:120,
              maxWidth:this.$store.state.locale=='zh_CN'?50:120
            },
            {
              title: i18n.t('product.project'),
              minWidth: this.$store.state.locale=='zh_CN'?90:120,
              width:this.$store.state.locale=='zh_CN'?90:120,
              align: 'center',
              ellipsis:true,
              //required:true,
              key: 'inspectionTypeId',
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
                  this.iqcParamsInspectionSelectorClose,
                  vm.noPermsDis,
                )
                return ret(h,params);
              }
            },
            {
              title: i18n.t('product.measUnit'),
              width: this.$store.state.locale=='zh_CN'?85:150,
              minWidth:this.$store.state.locale=='zh_CN'?85:150,
              align: 'center',
              ellipsis:true,

              key: 'measUnitId',
              render:
              (h, params)=>{
                let ret =  vm.$iqis.utils.tableHelper.editable.buildSelectCell2(
                  vm,
                  (vm)=>{
                    let rowData = vm.product.settings.qc.iqc.params[params.index];
                    return rowData['measUnitList'];
                  },
                  "measUnitId",
                  "unitSymbol",
                  this.iqcParamsMeasUnitSelectorChange,
                  vm.noPermsDis
                )
                return ret(h,params);
              }

            },
            {
              title: i18n.t('iqc.chkDev'),
              width: this.$store.state.locale=='zh_CN'?120:220,
              minWidth:this.$store.state.locale=='zh_CN'?120:220,
              align: 'center',
              ellipsis:true,
              key: 'chkDevId',
              render:
              (h, params)=>{
                let ret =  vm.$iqis.utils.tableHelper.editable.buildSelectCell2(
                  vm,
                  (vm)=>{
                    let rowData = vm.product.settings.qc.iqc.params[params.index];
                    return rowData['chkDevList'];
                  },
                  "chkDevId",
                  "name",
                  this.iqcParamsMeasUnitSelectorChange,
                  vm.noPermsDis
                )
                return ret(h,params);
              }
            },
            {
              title: 'SL',
              minWidth:80,
              width:80,
              align: 'center',
              ellipsis:true,
              key: 'sl',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellIqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:me.noPermsDis,
                      // value:me.product.settings.qc.iqc.params[params.index].sl
                      value:params.row.sl
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.sl = event.target.value;
                        params.row.usl = (Number(event.target.value)+Number(params.row.positiveTolerance)).toFixed(2)
                        params.row.lsl = Number(event.target.value)-Number(params.row.negativeTolerance)
                        this.product.settings.qc.iqc.params[params.index] = params.row;
                        // this.product.settings.qc.iqc.params[params.index].sl = event.target.value;
                         let index = params.index
                        let key = params.column.key
                        let string = event.target.value
                        this.stringHandling(string,index,key,'iqc')
                        // //console.log(this.product.settings.qc.iqc.params,'所有数据')
                      }
                    }
                  })
                ])
              }
            },
            {
              title: i18n.t('product.positiveTolerance'),
              minWidth:80,
              width: this.$store.state.locale=='zh_CN'?80:100,
              align: 'center',
              ellipsis:true,
              key: 'positiveTolerance',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellIqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:me.noPermsDis,
                      value:params.row.positiveTolerance
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.positiveTolerance = event.target.value;
                        params.row.usl = (Number(params.row.sl)+Number(event.target.value)).toFixed(2);
                        // this.product.settings.qc.iqc.params[params.index].row = params.row.positiveTolerance;
                        this.product.settings.qc.iqc.params[params.index] = params.row;
                      }
                    }
                  })
                ])
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellIqcEditorEnd,vm.noPermsDis),
              /* render:
              (h, params)=>{
                let ret =  vm.$iqis.utils.tableHelper.editable.buildTextCell(
                  vm,
                  vm.cellIqcEditorEnd,
                  vm.noPermsDis
                )
                return ret(h,params); */
              }
            },
            {
              title: i18n.t('product.negativeTolerance'),
              minWidth:80,
              width: this.$store.state.locale=='zh_CN'?80:100,
              align: 'center',
              ellipsis:true,

              key: 'negativeTolerance',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellIqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:me.noPermsDis,
                      value:params.row.negativeTolerance
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.negativeTolerance = event.target.value
                        params.row.lsl = params.row.sl-event.target.value;
                        this.product.settings.qc.iqc.params[params.index] = params.row;
                      }
                    }
                  })
                ])
              }
            },
            
            {
              title: 'USL',
              minWidth:80,
              width:80,
              align: 'center',
              ellipsis:true,
              focus:true,
              key: 'usl',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellIqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:me.noPermsDis,
                      // value:me.product.settings.qc.iqc.params[params.index].usl//product.settings.qc.iqc.params
                      value:params.row.usl//product.settings.qc.iqc.params
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.usl = (event.target.value).toFixed(2);
                        console.log(params.row.positiveTolerance);
                        this.product.settings.qc.iqc.params[params.index] = params.row;
                        // this.product.settings.qc.iqc.params[params.index].usl = event.target.value;
                        let index = params.index
                        let key = params.column.key
                        let string = event.target.value
                        this.stringHandling(string,index,key,'iqc')
                        // this.product.settings.qc.iqc.params[params.index].positiveTolerance = this.product.settings.qc.iqc.params[params.index].usl;
                      }
                    }
                  })
                ])
              }
            },
            
            {
              title: 'LSL',
              minWidth:80,
              width:80,
              align: 'center',
              ellipsis:true,
              key: 'lsl',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellIqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:me.noPermsDis,
                      // value:me.product.settings.qc.iqc.params[params.index].lsl
                      value:params.row.lsl
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.lsl = event.target.value;
                        this.product.settings.qc.iqc.params[params.index] = params.row;
                        // this.product.settings.qc.iqc.params[params.index].lsl = event.target.value;
                         let index = params.index
                        let key = params.column.key
                        let string = event.target.value
                        this.stringHandling(string,index,key,"iqc")
                        // this.product.settings.qc.iqc.params[params.index].negativeTolerance = this.product.settings.qc.iqc.params[params.index].lsl;

                      }
                    }
                  })
                ])
              }
            },
            // {
            //   title: i18n.t('product.sampleNum'),
            //   width: this.$store.state.locale=='zh_CN'?68:120,
            //   minWidth:this.$store.state.locale=='zh_CN'?68:120,
            //   align: 'center',
            //   ellipsis:true,
            //   key: 'sampleNum',
            //   // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellIqcEditorEnd),
            //   render: (h, params) => {
            //     var me = this
            //     return h('div', [h
            //       ('Input',{
            //         props: {
            //           type: 'text',
            //           placeholder:'1~10',
            //           disabled:me.noPermsDis,
            //           value:me.product.settings.qc.iqc.params[params.index].sampleNum
            //         },
            //         on: {
            //           'on-blur':(event) => {
            //             this.product.settings.qc.iqc.params[params.index].sampleNum = event.target.value;

            //           }
            //         }
            //       })
            //     ])
            //   }
             
            // },
            
            {
              title: i18n.t('iqc.samplingPlan'),
              width: this.$store.state.locale=='zh_CN'?120:220,
              minWidth:this.$store.state.locale=='zh_CN'?120:220,
              align: 'center',
              key: 'samplingPlanCode',
              render:(h, params)=> {
                if(vm.product.settings.qc.iqc.aql.samplingPlanType===0){
                  return h('div','--')
                  return;
                }
                let ret = vm.$iqis.utils.tableHelper.buildMapCell(
                  vm,{
                    "105E":i18n.t('iqc.105E'),
                    "Z1-4":i18n.t('iqc.Z1-4'),
                    "0D":i18n.t('oqc.0DInspection'),
                    "GB/T2828.1-2012":i18n.t('iqc.GB'),
                    "full":i18n.t('product.fullSampling'),
                    "percent":i18n.t('product.percentSampling'),
                  }
                )
                return ret(h,params)
              }
              // render:(h,params)=>{
              //   var me = this;
              //   return h('Poptip',[
              //     h('span',{
              //       style:{
              //         color:'#2d8cf0'
              //       }
              //     },me.product.settings.qc.iqc.params[params.index].samplingPlanCode),
              //     h('div',{
              //       props:{
              //         class:"api1"
              //       },
              //       slot:"title",
              //     },'1111'),
              //     h('div',{
              //       props:{
              //         class:"api"
              //       },
              //       slot:"content",
              //     },
              //       [
              //         h('div',{},'检验水准：'+me.product.settings.qc.iqc.params[params.index].inspectionStandard),
              //         h('div',{},'严重AQL：'+me.product.settings.qc.iqc.params[params.index].crAql),
              //         h('div',{},'主要AQL：'+me.product.settings.qc.iqc.params[params.index].majAql),
              //         h('div',{},'轻微AQL：'+me.product.settings.qc.iqc.params[params.index].minAql),
              //       ]
              //     )
              //   ])
              // }
            },
            {
              title: i18n.t('product.inspectionStandard'),
              // width: this.$store.state.locale=='zh_CN'?120:220,
              minWidth:this.$store.state.locale=='zh_CN'?120:220,
              align: 'center',
              key: 'inspectionStandard',
              render:(h, params)=> {
                if(vm.product.settings.qc.iqc.aql.samplingPlanType===0){
                  return h('div','--')
                  return;
                }
                if(params.row.samplingPlanCode=='percent'){
                  return h('div',params.row.inspectionStandard)
                }else if(params.row.samplingPlanCode=='full'){
                  return h('div','--')
                }else if(params.row.samplingPlanCode=='0D'){
                  return h('div',i18n.t('iqc.0DInspection'))
                }else{
                  let ret =  vm.$iqis.utils.tableHelper.buildMapCell(
                    vm,{
                      "1":i18n.t('iqc.normalInspection')+'Ⅰ',
                      "2":i18n.t('iqc.normalInspection')+'Ⅱ',
                      "3":i18n.t('iqc.normalInspection')+'Ⅲ',
                      "101":i18n.t('iqc.specialInspection')+'S1',
                      "102":i18n.t('iqc.specialInspection')+'S2',
                      "103":i18n.t('iqc.specialInspection')+'S3',
                      "104":i18n.t('iqc.specialInspection')+'S4',
                    }
                  )
                  return ret(h,params);
                }
              }
            },
            {
              title: 'AQL',
              width: this.$store.state.locale=='zh_CN'?120:220,
              minWidth:this.$store.state.locale=='zh_CN'?120:220,
              align: 'center',
              ellipsis:true,
              key: 'aql',
              render:(h,params)=>{
                if(vm.product.settings.qc.iqc.aql.samplingPlanType===0){
                  return h('div','--')
                  return;
                }
                if(!params.row.aql||params.row.aql==''){
                  return h('div','--')
                }else{
                  return h('div',params.row.aql)
                }
              }
            },
            {
              title: i18n.t('product.scale'),
              width: 60,
              align: 'center',
              ellipsis:true,

              key: 'scale',

              // render: (h, params) => {
              //   var me = this
              //   return h('div', [h
              //     ('Input',{
              //       props: {
              //         type: 'text',
              //         placeholder:'0~5',
              //         disabled:me.noPermsDis,
              //         value:me.product.settings.qc.iqc.params[params.index].scale
              //       },
              //       on: {
              //         'on-blur':(event) => {
              //           this.product.settings.qc.iqc.params[params.index].scale = event.target.value;

              //         }
              //       }
              //     })
              //   ])
              // }
              
             render: (h, params) => {
                var me = this
                  return h('Select', {
                      style:{
                        // width:'85px'
                      },
                      props:{
                        value:me.product.settings.qc.iqc.params[params.index].scale,
                        // value:me.data[params.index].scale,
                      },
                  on: {
                        'on-change':(event) => {
                          this.product.settings.qc.iqc.params[params.index].scale = event;
                          // //console.log(params)
                          
                        } 
                    },
                    },
                  [
                    h('Option',{
                        props: {
                            value: 0
                        }
                    },'0'),
                      h('Option',{
                          props: {
                              value: 1
                          }
                      },'1'),
                      h('Option',{
                          props: {
                              value: 2
                          }
                      },'2'),
                      h('Option',{
                          props: {
                              value: 3
                          }
                      },'3'),
                      h('Option',{
                          props: {
                              value: 4
                          }
                      },'4'),
                      h('Option',{
                          props: {
                              value: 5
                          }
                      },'5')
                ]);
              },
            }
          ],
          columnss:[
            {type: 'selection',
              align: 'center',
              minWidth:40,
              maxWidth:40,
              width:40
            },
            {title: i18n.t('product.no'),
              width:80,
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align:"center",
              minWidth:this.$store.state.locale=='zh_CN'?50:120,
              maxWidth:this.$store.state.locale=='zh_CN'?50:120
            },
            {
              title: i18n.t('product.project'),
              minWidth: this.$store.state.locale=='zh_CN'?90:120,
              width:this.$store.state.locale=='zh_CN'?90:120,
              align: 'center',
              ellipsis:true,
              //required:true,
              key: 'inspectionId',
              // key:"inspectionTypeId",
              render: (h, params)=>{
                let ret =  vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(vm,(vm)=>{
                    return vm.selects.inspectionTypes
                  },
                  "inspectionTypeId",
                  "name",
                  null,
                  this.iqcParamsInspectionSelectorCloses,
                  vm.noPermsDis,
                )
                return ret(h,params);
              }
            },
            {
              title:i18n.t('product._inspectionStandard'),
              minWidth:200,
              align:'center',
              key:'inspectionLevel',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'textarea',
                      disabled:me.noPermsDis,
                      autosize:{
                          minRows:1,
                          maxRows:4
                      },
                      maxlength:600,
                      size:"small",
                      value:me.product.settings.qc.iqc.property[params.index].inspectionLevel
                    },
                    on:{
                      "on-blur":function(event){
                        console.log(event,666);
                        me.product.settings.qc.iqc.property[params.index].inspectionLevel = event.target.value
                        
                      }
                    }
                    
                  })
                ])
              }
            },

          ]
          
        },
        pqc:{
          loading:false,
          params:{
            selected:[]
          },
          paramss:{
            selected:[]
          },
          columns:[
            {type: 'selection',
              width:40,
              align: 'center',
              minWidth:40,
              maxWidth:40,
            },
            {title: i18n.t('product.no'),
              width:this.$store.state.locale=='zh_CN'?50:120,
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align:"center",
              minWidth:this.$store.state.locale=='zh_CN'?50:120,
            },{
              title: i18n.t('product.prodStage'),
              width: this.$store.state.locale=='zh_CN'?85:180,
              minWidth:this.$store.state.locale=='zh_CN'?85:180,
              align: 'center',
              ellipsis:true,

              key: 'prodStageId',
              // render:vm.$iqis.utils.tableHelper.editable.buildSelectCell(vm,(vm)=>{return vm.selects.prodProcessList},"prodProcessId","prodProcessName",vm.cellPqcEditorEnd),
              render:
              (h, params)=>{
                let ret =  vm.$iqis.utils.tableHelper.editable.buildSelectCell(
                  vm,
                  (vm)=>{
                    return vm.selects.prodProcessList
                  },
                  "prodProcessId",
                  "prodProcessName",
                  vm.cellPqcEditorEnd,
                  vm.noPermsDis,
                )
                return ret(h,params);
              }
            },
            {
              title: i18n.t('product.project'),
              width: this.$store.state.locale=='zh_CN'?85:120,
              minWidth:this.$store.state.locale=='zh_CN'?85:120,
              align: 'center',
              ellipsis:true,
              //required:true,
              key: 'inspectionTypeId',
              // render:vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(vm,(vm)=>{return vm.selects.inspectionTypes},"inspectionTypeId","name",null,this.pqcParamsInspectionSelectorClose),
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
                  vm.pqcParamsInspectionSelectorClose,
                  vm.noPermsDis,
                )
                return ret(h,params);
              }
            },
            {
              title: i18n.t('product.measUnit'),
              width: this.$store.state.locale=='zh_CN'?84:170,
              minWidth:this.$store.state.locale=='zh_CN'?84:170,
              align: 'center',
              ellipsis:true,

              key: 'measUnitId',
              render:
              (h, params)=>{
                let ret =  vm.$iqis.utils.tableHelper.editable.buildSelectCell2(
                  vm,
                  (vm)=>{
                    let rowData = vm.product.settings.qc.pqc.params[params.index];
                    return rowData['measUnitList'];
                  },
                  "measUnitId",
                  "unitSymbol",
                  this.pqcParamsMeasUnitSelectorChange,
                  this.noPermsDis
                )
                return ret(h,params);
              }
            },
            {
              title: i18n.t('iqc.chkDev'),
              width: this.$store.state.locale=='zh_CN'?120:220,
              minWidth:this.$store.state.locale=='zh_CN'?120:220,
              align: 'center',
              ellipsis:true,
              key: 'chkDevId',
              render:
              (h, params)=>{
                let ret =  vm.$iqis.utils.tableHelper.editable.buildSelectCell2(
                  vm,
                  (vm)=>{
                    let rowData = vm.product.settings.qc.pqc.params[params.index];
                    return rowData['chkDevList'];
                  },
                  "chkDevId",
                  "name",
                  this.pqcParamsMeasUnitSelectorChange,
                  vm.noPermsDis
                )
                return ret(h,params);
              }

            },
            {
              title: 'SL',
              minWidth: 80,
              width:80,
              align: 'center',
              ellipsis:true,

              key: 'sl',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellPqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:me.noPermsDis,
                      value:params.row.sl
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.sl = event.target.value;
                        params.row.usl = Number(event.target.value)+Number(params.row.positiveTolerance)
                        params.row.lsl = Number(event.target.value)-Number(params.row.negativeTolerance)
                        // this.product.settings.qc.pqc.params[params.index].sl = event.target.value;
                        this.product.settings.qc.pqc.params[params.index] = params.row;
                         let index = params.index
                        let key = params.column.key
                        let string = event.target.value
                        this.stringHandling(string,index,key,'pqc')
                        // //console.log(this.product.settings.qc.pqc.params,'所有数据')
                      }
                    }
                  })
                ])
              }
            },
            {
              title: i18n.t('product.positiveTolerance'),
              minWidth:80,
              width: this.$store.state.locale=='zh_CN'?80:100,
              align: 'center',
              ellipsis:true,

              key: 'positiveTolerance',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellPqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:this.noPermsDis,
                      value:params.row.positiveTolerance
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.positiveTolerance = event.target.value;
                        params.row.usl = Number(params.row.sl)+Number(event.target.value);
                        // this.product.settings.qc.pqc.params[params.index].positiveTolerance = event.target.value;
                        this.product.settings.qc.pqc.params[params.index] = params.row;
                      }
                    }
                  })
                ])
              }
            },
            {
              title: i18n.t('product.negativeTolerance'),
              minWidth:80,
              width: this.$store.state.locale=='zh_CN'?80:100,
              align: 'center',
              ellipsis:true,

              key: 'negativeTolerance',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellPqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:this.noPermsDis,
                      value:params.row.negativeTolerance
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.negativeTolerance = event.target.value;
                        params.row.lsl = params.row.sl-event.target.value;
                        // this.product.settings.qc.pqc.params[params.index].negativeTolerance = event.target.value;
                        this.product.settings.qc.pqc.params[params.index] = params.row;
                      }
                    }
                  })
                ])
              }
            },
            {
              title: 'USL',
              minWidth: 80,
              width:80,
              focus:true,
              align: 'center',
              ellipsis:true,

              key: 'usl',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellPqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:me.noPermsDis,
                      // value:me.product.settings.qc.pqc.params[params.index].usl
                      value:params.row.usl
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.usl = event.target.value;
                        params.row.positiveTolerance = event.target.value;
                        this.product.settings.qc.pqc.params[params.index] = params.row;
                        // this.product.settings.qc.pqc.params[params.index].usl = event.target.value;
                         let index = params.index
                        let key = params.column.key
                        let string = event.target.value
                        this.stringHandling(string,index,key,'pqc')
                        // this.product.settings.qc.pqc.params[params.index].positiveTolerance = this.product.settings.qc.pqc.params[params.index].usl;
                      }
                    }
                  })
                ])
              }
            },
            
            {
              title: 'LSL',
              minWidth: 80,
              width:80,
              align: 'center',
              ellipsis:true,

              key: 'lsl',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellPqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:me.noPermsDis,
                      value:params.row.lsl
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.lsl = event.target.value;
                        params.row.negativeTolerance = event.target.value;
                        // this.product.settings.qc.pqc.params[params.index].lsl = event.target.value;
                        this.product.settings.qc.pqc.params[params.index] = params.row;
                         let index = params.index
                        let key = params.column.key
                        let string = event.target.value
                        this.stringHandling(string,index,key,'pqc')
                        // this.product.settings.qc.pqc.params[params.index].negativeTolerance = this.product.settings.qc.pqc.params[params.index].lsl;
                      }
                    }
                  })
                ])
              }
            },
            
            
            {
              title: i18n.t('product.samplingPlan'),
              width: this.$store.state.locale=='zh_CN'?120:220,
              minWidth:this.$store.state.locale=='zh_CN'?120:220,
              align: 'center',
              key: 'samplingPlanCode',
              render:(h, params)=> {
                if(vm.product.settings.qc.pqc.aql.samplingPlanType===0){
                  return h('div','--')
                  return;
                }
                let ret = vm.$iqis.utils.tableHelper.buildMapCell(
                  vm,{
                    "105E":i18n.t('iqc.105E'),
                    "Z1-4":i18n.t('iqc.Z1-4'),
                    "0D":i18n.t('oqc.0DInspection'),
                    "GB/T2828.1-2012":i18n.t('iqc.GB'),
                    "full":i18n.t('product.fullSampling'),
                    "percent":i18n.t('product.percentSampling'),
                  }
                )
                return ret(h,params)
              }
            },
            {
              title: i18n.t('product.inspectionStandard'),
              // width: this.$store.state.locale=='zh_CN'?120:220,
              minWidth:this.$store.state.locale=='zh_CN'?120:220,
              align: 'center',
              key: 'inspectionStandard',
              render:(h, params)=> {
                if(vm.product.settings.qc.pqc.aql.samplingPlanType===0){
                  return h('div','--')
                  return;
                }
                if(params.row.samplingPlanCode=='percent'){
                  return h('div',params.row.inspectionStandard)
                }else if(params.row.samplingPlanCode=='full'){
                  return h('div','--')
                }else if(params.row.samplingPlanCode=='0D'){
                  return h('div',i18n.t('iqc.0DInspection'))
                }else{
                  let ret =  vm.$iqis.utils.tableHelper.buildMapCell(
                    vm,{
                      "1":i18n.t('iqc.normalInspection')+'Ⅰ',
                      "2":i18n.t('iqc.normalInspection')+'Ⅱ',
                      "3":i18n.t('iqc.normalInspection')+'Ⅲ',
                      "101":i18n.t('iqc.specialInspection')+'S1',
                      "102":i18n.t('iqc.specialInspection')+'S2',
                      "103":i18n.t('iqc.specialInspection')+'S3',
                      "104":i18n.t('iqc.specialInspection')+'S4',
                    }
                  )
                  return ret(h,params);
                }
              }
            },
            {
              title: 'AQL',
              width: this.$store.state.locale=='zh_CN'?80:220,
              minWidth:this.$store.state.locale=='zh_CN'?80:220,
              align: 'center',
              ellipsis:true,
              key: 'aql',
              render:(h,params)=>{
                if(vm.product.settings.qc.pqc.aql.samplingPlanType===0){
                  return h('div','--')
                  return;
                }
                if(!params.row.aql||params.row.aql==''){
                  return h('div','--')
                }else{
                  return h('div',params.row.aql)
                }
              }
            },
            {
              title: i18n.t('product.scale'),
              width: 60,
              align: 'center',
              ellipsis:true,

              key: 'scale',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellPqcEditorEnd),
              // render: (h, params) => {
              //   var me = this
              //   return h('div', [h
              //     ('Input',{
              //       props: {
              //         type: 'text',
              //         disabled:this.noPermsDis,
              //         value:me.product.settings.qc.pqc.params[params.index].scale
              //       },
              //       on: {
              //         'on-blur':(event) => {
              //           this.product.settings.qc.pqc.params[params.index].scale = event.target.value;
              //         }
              //       }
              //     })
              //   ])
              // }
              render: (h, params) => {
                var me = this
                  return h('Select', {
                      style:{
                        // width:'85px'
                      },
                      props:{
                        value:me.product.settings.qc.pqc.params[params.index].scale,
                        // value:me.data[params.index].scale,
                      },
                  on: {
                        'on-change':(event) => {
                          this.product.settings.qc.pqc.params[params.index].scale = event;
                          // //console.log(params)
                          
                        } 
                    },
                    },
                  [
                    h('Option',{
                        props: {
                            value: 0
                        }
                    },'0'),
                      h('Option',{
                          props: {
                              value: 1
                          }
                      },'1'),
                      h('Option',{
                          props: {
                              value: 2
                          }
                      },'2'),
                      h('Option',{
                          props: {
                              value: 3
                          }
                      },'3'),
                      h('Option',{
                          props: {
                              value: 4
                          }
                      },'4'),
                      h('Option',{
                          props: {
                              value: 5
                          }
                      },'5')
                ]);
              },
            }

          ],
          pqcColumns:[
            {type: 'selection',
              align: 'center',
              minWidth:40,
              maxWidth:40,
              width:40
            },
            {title: i18n.t('product.no'),
              width:80,
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align:"center",
              minWidth:this.$store.state.locale=='zh_CN'?50:120,
              maxWidth:this.$store.state.locale=='zh_CN'?50:120
            },
            {
              title: i18n.t('product.prodStage'),
              width: this.$store.state.locale=='zh_CN'?85:180,
              minWidth:this.$store.state.locale=='zh_CN'?85:180,
              align: 'center',
              ellipsis:true,

              key: 'prodStageId',
              // render:vm.$iqis.utils.tableHelper.editable.buildSelectCell(vm,(vm)=>{return vm.selects.prodProcessList},"prodProcessId","prodProcessName",vm.cellPqcEditorEnd),
              render:
              (h, params)=>{
                let ret =  vm.$iqis.utils.tableHelper.editable.buildSelectCell(
                  vm,
                  (vm)=>{
                    return vm.selects.prodProcessList
                  },
                  "prodProcessId",
                  "prodProcessName",
                  vm.cellPqcEditorEnd2,
                  vm.noPermsDis,
                )
                return ret(h,params);
              }
              // render: (h, params) => {
              //   let _this = this;
              //   return h('Select', {
              //       props: {
              //         filterable: true,
              //         value: this.iqcDefects[params.index].defectTypeId,
              //         disabled: this.inputDisbale||this.noPermsDis,
              //       },
              //       style: {
              //         border: '0px'
              //       },
              //       on: {
              //         'on-change': (event) => {
              //           this.iqcDefects[params.index].defectTypeId = event;

              //           this.TesySynthesis(this.iqcDefects[params.index].defectTypeId, params.index)
              //         }
              //       },
              //     },
              //     this.iqcDefects[params.index].defectTypeList.map(function (type) {
              //       return h('Option', {
              //         props: {value: type.defectTypeId, label: type.name}
              //       }, type);
              //     })
              //   );
              // }
            },
            
            {
              title: i18n.t('product.project'),
              minWidth: this.$store.state.locale=='zh_CN'?90:120,
              width:this.$store.state.locale=='zh_CN'?90:120,
              align: 'center',
              ellipsis:true,
              //required:true,
              key: 'inspectionId',
              // key:"inspectionTypeId",
              render:
              (h, params)=>{
                let ret =  vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(vm,(vm)=>{
                    return vm.selects.inspectionTypes
                  },
                  "inspectionTypeId",
                  "name",
                  null,
                  this.pqcParamsInspectionSelectorCloses,
                  vm.noPermsDis,
                )
                return ret(h,params);
              }
            },
            {
              title:i18n.t('product._inspectionStandard'),
              minWidth:200,
              align:'center',
              key:'inspectionLevel',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'textarea',
                      disabled:me.noPermsDis,
                      size:"small",
                      autosize:{
                          minRows:1,
                          maxRows:4
                      },
                      maxlength:600,
                      value:me.product.settings.qc.pqc.property[params.index].inspectionLevel
                    },
                    on:{
                      "on-blur":function(event){
                        console.log(event,666);
                        me.product.settings.qc.pqc.property[params.index].inspectionLevel = event.target.value
                        
                      }
                    }
                    
                  })
                ])
              }
            },

          ]
        },
        oqc:{
          loading:false,
          params:{
            selected:[]
          },
          paramss:{
            selected:[]
          },
          columns:[
            {type: 'selection',
              align: 'center',
              minWidth:40,
              maxWidth:40
            },
            {title: i18n.t('product.no'),
              width:this.$store.state.locale=='zh_CN'?50:100,
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align:"center",
              minWidth:this.$store.state.locale=='zh_CN'?50:100,
              maxWidth:this.$store.state.locale=='zh_CN'?50:100
            },
            {
              title: i18n.t('product.project'),
              width: this.$store.state.locale=='zh_CN'?85:120,
              minWidth:this.$store.state.locale=='zh_CN'?85:120,
              align: 'center',
              // minWidth:40,
              ellipsis:true,
              key: 'inspectionTypeId',
              // render:vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(vm,(vm)=>{return vm.selects.inspectionTypes},"inspectionTypeId","name",null,this.oqcParamsInspectionSelectorClose),
              render:
              (h, params)=>{console.log(this.product.settings.qc.oqc.params,123)
                let ret =  vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(
                  vm,
                  (vm)=>{return vm.selects.inspectionTypes},
                  "inspectionTypeId",
                  "name",
                  null,
                  this.oqcParamsInspectionSelectorClose,
                  vm.noPermsDis
                )
                return ret(h,params);
              }
            },
            {
              title: i18n.t('product.measUnit'),
              width: this.$store.state.locale=='zh_CN'?85:150,
              minWidth:this.$store.state.locale=='zh_CN'?85:150,
              align: 'center',
              ellipsis:true,

              key: 'measUnitId',
              render:
              (h, params)=>{
                let ret =  vm.$iqis.utils.tableHelper.editable.buildSelectCell2(
                  vm,
                  (vm)=>{
                    let rowData = vm.product.settings.qc.oqc.params[params.index];
                    return rowData['measUnitList'];
                  },
                  "measUnitId",
                  "unitSymbol",
                  this.oqcParamsMeasUnitSelectorChange,
                  this.noPermsDis
                )
                return ret(h,params);
              }
            },
            {
              title: i18n.t('iqc.chkDev'),
              width: this.$store.state.locale=='zh_CN'?120:220,
              minWidth:this.$store.state.locale=='zh_CN'?120:220,
              align: 'center',
              ellipsis:true,
              key: 'chkDevId',
              render:
              (h, params)=>{
                let ret =  vm.$iqis.utils.tableHelper.editable.buildSelectCell2(
                  vm,
                  (vm)=>{
                    let rowData = vm.product.settings.qc.oqc.params[params.index];
                    return rowData['chkDevList'];
                  },
                  "chkDevId",
                  "name",
                  vm.oqcParamsMeasUnitSelectorChange,
                  vm.noPermsDis
                )
                return ret(h,params);
              }
              
            },
            {
              title: i18n.t('product.positiveTolerance'),
              minWidth:80,
              width: this.$store.state.locale=='zh_CN'?80:100,
              align: 'center',
              ellipsis:true,
              key: 'positiveTolerance',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellOqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:this.noPermsDis,
                      value:params.row.positiveTolerance
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.positiveTolerance = event.target.value;
                        params.row.usl = Number(params.row.sl)+Number(event.target.value);
                        this.product.settings.qc.oqc.params[params.index] = params.row;
                      }
                    }
                  })
                ])
              }
            },
            {
              title: i18n.t('product.negativeTolerance'),
              minWidth:80,
              width: this.$store.state.locale=='zh_CN'?80:100,
              align: 'center',
              ellipsis:true,

              key: 'negativeTolerance',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellOqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:this.noPermsDis,
                      value:params.row.negativeTolerance
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.negativeTolerance = event.target.value;
                        params.row.lsl = params.row.sl-event.target.value;
                        this.product.settings.qc.oqc.params[params.index] = params.row;
                      }
                    }
                  })
                ])
              }
            },
            {
              title: 'USL',
              minWidth:80,
              width:80,
              align: 'center',
              ellipsis:true,
              focus:true,
              key: 'usl',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellOqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:this.noPermsDis,
                      value:params.row.usl
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.usl = event.target.value;
                        // this.product.settings.qc.oqc.params[params.index].usl = event.target.value;
                        this.product.settings.qc.oqc.params[params.index] = params.row;
                        let index = params.index
                        let key = params.column.key
                        let string = event.target.value
                        this.stringHandling(string,index,key,'oqc')
                        // this.product.settings.qc.oqc.params[params.index].positiveTolerance = this.product.settings.qc.oqc.params[params.index].usl;
                      }
                    }
                  })
                ])
              }
            },
            {
              title: 'SL',
              minWidth: 80,
              width:80,
              align: 'center',
              ellipsis:true,

              key: 'sl',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellOqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:this.noPermsDis,
                      value:params.row.sl
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.sl = event.target.value
                        params.row.usl = Number(event.target.value)+Number(params.row.positiveTolerance)
                        params.row.lsl = Number(event.target.value)-Number(params.row.negativeTolerance)
                        // this.product.settings.qc.oqc.params[params.index].sl = event.target.value;
                        this.product.settings.qc.oqc.params[params.index] = params.row;
                         let index = params.index
                        let key = params.column.key
                        let string = event.target.value
                        this.stringHandling(string,index,key,'oqc')
                        // //console.log(this.product.settings.qc.oqc.params,'所有数据')
                      }
                    }
                  })
                ])
              }
            },
            {
              title: 'LSL',
              minWidth: 80,
              width:80,
              align: 'center',
              ellipsis:true,

              key: 'lsl',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellOqcEditorEnd),
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'text',
                      disabled:this.noPermsDis,
                      value:params.row.lsl
                    },
                    on: {
                      'on-blur':(event) => {
                        params.row.lsl = event.target.value;
                        // this.product.settings.qc.oqc.params[params.index].lsl = event.target.value;
                        this.product.settings.qc.oqc.params[params.index] = params.row;
                         let index = params.index
                        let key = params.column.key
                        let string = event.target.value
                        this.stringHandling(string,index,key,'oqc')
                        // this.product.settings.qc.oqc.params[params.index].negativeTolerance = this.product.settings.qc.oqc.params[params.index].lsl;
                      }
                    }
                  })
                ])
              }
            },
            // {
            //   title: i18n.t('product.sampleNum'),
            //   minWidth: this.$store.state.locale=='zh_CN'?68:110,
            //   align: 'center',
            //   ellipsis:true,
            //   key: 'sampleNum',
            //   // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellOqcEditorEnd),
            //   render: (h, params) => {
            //     var me = this
            //     return h('div', [h
            //       ('Input',{
            //         props: {
            //           type: 'text',
            //           placeholder:'1~10',
            //           disabled:this.noPermsDis,
            //           value:me.product.settings.qc.oqc.params[params.index].sampleNum
            //         },
            //         on: {
            //           'on-blur':(event) => {
            //             this.product.settings.qc.oqc.params[params.index].sampleNum = event.target.value;
            //           }
            //         }
            //       })
            //     ])
            //   }
            // },
            
            
            {
              title: i18n.t('product.samplingPlan'),
              width: this.$store.state.locale=='zh_CN'?120:220,
              minWidth:this.$store.state.locale=='zh_CN'?120:220,
              align: 'center',
              key: 'samplingPlanCode',
              render:(h, params)=> {
                if(vm.product.settings.qc.oqc.aql.samplingPlanType===0){
                  return h('div','--')
                  return;
                }
                let ret = vm.$iqis.utils.tableHelper.buildMapCell(
                  vm,{
                    "105E":i18n.t('iqc.105E'),
                    "Z1-4":i18n.t('iqc.Z1-4'),
                    "0D":i18n.t('oqc.0DInspection'),
                    "GB/T2828.1-2012":i18n.t('iqc.GB'),
                    "full":i18n.t('product.fullSampling'),
                    "percent":i18n.t('product.percentSampling'),
                  }
                )
                return ret(h,params)
              }
            },
            {
              title: i18n.t('product.inspectionStandard'),
              // width: this.$store.state.locale=='zh_CN'?120:220,
              minWidth:this.$store.state.locale=='zh_CN'?120:220,
              align: 'center',
              key: 'inspectionStandard',
              render:(h, params)=> {
                if(vm.product.settings.qc.oqc.aql.samplingPlanType===0){
                  return h('div','--')
                  return;
                }
                if(params.row.samplingPlanCode=='percent'){
                  return h('div',params.row.inspectionStandard)
                }else if(params.row.samplingPlanCode=='full'){
                  return h('div','--')
                }else if(params.row.samplingPlanCode=='0D'){
                  return h('div',i18n.t('iqc.0DInspection'))
                }else{
                  let ret =  vm.$iqis.utils.tableHelper.buildMapCell(
                    vm,{
                      "1":i18n.t('iqc.normalInspection')+'Ⅰ',
                      "2":i18n.t('iqc.normalInspection')+'Ⅱ',
                      "3":i18n.t('iqc.normalInspection')+'Ⅲ',
                      "101":i18n.t('iqc.specialInspection')+'S1',
                      "102":i18n.t('iqc.specialInspection')+'S2',
                      "103":i18n.t('iqc.specialInspection')+'S3',
                      "104":i18n.t('iqc.specialInspection')+'S4',
                    }
                  )
                  return ret(h,params);
                }
              }
            },
            {
              title: 'AQL',
              width: this.$store.state.locale=='zh_CN'?120:220,
              minWidth:this.$store.state.locale=='zh_CN'?120:220,
              align: 'center',
              ellipsis:true,
              key: 'aql',
              render:(h,params)=>{
                if(vm.product.settings.qc.oqc.aql.samplingPlanType===0){
                  return h('div','--')
                  return;
                }
                if(!params.row.aql||params.row.aql==''){
                  return h('div','--')
                }else{
                  return h('div',params.row.aql)
                }
              }
            },
            {
              title: i18n.t('product.scale'),
              width: 60,
              align: 'center',
              ellipsis:true,

              key: 'scale',
              // render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellOqcEditorEnd),
              // render: (h, params) => {
              //   var me = this
              //   return h('div', [h
              //     ('Input',{
              //       props: {
              //         type: 'text',
              //         disabled:this.noPermsDis,
              //         value:me.product.settings.qc.oqc.params[params.index].scale
              //       },
              //       on: {
              //         'on-blur':(event) => {
              //           this.product.settings.qc.oqc.params[params.index].scale = event.target.value;
              //         }
              //       }
              //     })
              //   ])
              // }
              render: (h, params) => {
                var me = this
                  return h('Select', {
                      style:{
                        // width:'85px'
                      },
                      props:{
                        value:me.product.settings.qc.oqc.params[params.index].scale,
                        // value:me.data[params.index].scale,
                      },
                  on: {
                        'on-change':(event) => {
                          this.product.settings.qc.oqc.params[params.index].scale = event;
                          // //console.log(params)
                          
                        } 
                    },
                    },
                  [
                    h('Option',{
                        props: {
                            value: 0
                        }
                    },'0'),
                      h('Option',{
                          props: {
                              value: 1
                          }
                      },'1'),
                      h('Option',{
                          props: {
                              value: 2
                          }
                      },'2'),
                      h('Option',{
                          props: {
                              value: 3
                          }
                      },'3'),
                      h('Option',{
                          props: {
                              value: 4
                          }
                      },'4'),
                      h('Option',{
                          props: {
                              value: 5
                          }
                      },'5')
                ]);
              },
            }

          ],
          oqcColumns:[
            {type: 'selection',
              align: 'center',
              minWidth:40,
              maxWidth:40,
              width:40
            },
            {title: i18n.t('product.no'),
              width:80,
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align:"center",
              minWidth:this.$store.state.locale=='zh_CN'?50:120,
              maxWidth:this.$store.state.locale=='zh_CN'?50:120
            },
            {
              title: i18n.t('product.project'),
              minWidth: this.$store.state.locale=='zh_CN'?90:120,
              width:this.$store.state.locale=='zh_CN'?90:120,
              align: 'center',
              ellipsis:true,
              //required:true,
              key: 'inspectionId',
              // key:"inspectionTypeId",
              render:
              (h, params)=>{
                let ret =  vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(vm,(vm)=>{
                    return vm.selects.inspectionTypes
                  },
                  "inspectionTypeId",
                  "name",
                  null,
                  this.oqcParamsInspectionSelectorCloses,
                  vm.noPermsDis,
                )
                return ret(h,params);
              }
            },
            {
              title:i18n.t('product._inspectionStandard'),
              minWidth:200,
              align:'center',
              key:'inspectionLevel',
              render: (h, params) => {
                var me = this
                return h('div', [h
                  ('Input',{
                    props: {
                      type: 'textarea',
                      disabled:me.noPermsDis,
                      size:"small",
                      autosize:{
                          minRows:1,
                          maxRows:4
                      },
                      maxlength:600,
                      value:me.product.settings.qc.oqc.property[params.index].inspectionLevel
                    },
                    on:{
                      "on-blur":function(event){
                        me.product.settings.qc.oqc.property[params.index].inspectionLevel = event.target.value
                        console.log(me.product.settings.qc.oqc.property,666);
                        
                      }
                    }
                    
                  })
                ])
              }
            },

          ]
        }
      },
      permsCur:[
        'UPDATE_PRODUCT',
        'INSERT_PRODUCT'
      ],//当前页面需要的权限名称
      permsBtn:{//控制每个权限对应按钮的显隐状态
        "UPDATE_PRODUCT":false,
        'INSERT_PRODUCT':false
      },
      noPermsDis:true,//控制所有输入框的禁用状态
      productId:'',
      pictureUrls:[],
      bindImg:'',
      bindInspectionsModal:false,
      bindIqcInspections:[],
      bindPqcInspections:[],
      bindOqcInspections:[],
      bindIqcInspectionsInit:[],
      bindPqcInspectionsInit:[],
      bindOqcInspectionsInit:[],
    }
    
  },

  watch:{
    pictureUrls:{
      handler(url){
        console.log(url,'url')
      },
      deep:true,
      immediate: true
    },
    "product.settings.qc.iqc.aql.samplingPlanCode":function(){
      if(this.product.settings.qc.iqc.aql!=null){
        if(this.product.settings.qc.iqc.aql.samplingPlanCode){
          if(this.product.settings.qc.iqc.aql.samplingPlanCode=='full'){
            this.selects.iqc.samplingLevel=null
          }else if(this.product.settings.qc.iqc.aql.samplingPlanCode=='percent'){
            // //console.log(this.samplingValue,'2145435646')
            this.selects.iqc.samplingLevel=this.samplingValue
          }else{
            this.selects.iqc.samplingLevel = this.$iqis.objects.samplingPlans
              [this.product.settings.qc.iqc.aql.samplingPlanCode].level;
            this.selects.iqc.aql = this.$iqis.objects.samplingPlans
              [this.product.settings.qc.iqc.aql.samplingPlanCode].aql;

          }
        }
      }

    },
    "product.settings.qc.pqc.aql.samplingPlanCode":function(){
      if(this.product.settings.qc.pqc.aql!=null){
        if(this.product.settings.qc.pqc.aql.samplingPlanCode){
          if(this.product.settings.qc.pqc.aql.samplingPlanCode=='full'){
            this.selects.pqc.samplingLevel=null
          }else if(this.product.settings.qc.pqc.aql.samplingPlanCode=='percent'){
            this.selects.pqc.samplingLevel=this.samplingValue
          }else{
            this.selects.pqc.samplingLevel = this.$iqis.objects.samplingPlans
              [this.product.settings.qc.pqc.aql.samplingPlanCode].level;
            this.selects.pqc.aql = this.$iqis.objects.samplingPlans
              [this.product.settings.qc.pqc.aql.samplingPlanCode].aql;
          }
        }
      }

    },
    "product.settings.qc.oqc.aql.samplingPlanCode":function(){
      if(this.product.settings.qc.oqc.aql!=null){
        if(this.product.settings.qc.oqc.aql.samplingPlanCode){
          if(this.product.settings.qc.oqc.aql.samplingPlanCode=='full'){
            this.selects.oqc.samplingLevel=null
          }else if(this.product.settings.qc.oqc.aql.samplingPlanCode=='percent'){
            this.selects.oqc.samplingLevel=this.samplingValue
          }else{
            this.selects.oqc.samplingLevel = this.$iqis.objects.samplingPlans
              [this.product.settings.qc.oqc.aql.samplingPlanCode].level;
            this.selects.oqc.aql = this.$iqis.objects.samplingPlans
              [this.product.settings.qc.oqc.aql.samplingPlanCode].aql;
          }
        }
      }

    },
    "product.settings.qc.pqc.aql.prodFlowId":function(){
      if(this.product.settings.qc.pqc.aql!=null){
        if(this.product.settings.qc.pqc.aql.prodFlowId){
          //prodTaskItems
          for(let i=0;i<this.selects.prodFlows.length;i++){
            let pf = this.selects.prodFlows[i];
            if(pf.prodTaskId == this.product.settings.qc.pqc.aql.prodFlowId){
              this.selects.prodProcessList = pf.prodTaskItems;
              // //console.log("change prodProcessList:")
              // //console.log(this.selects.prodProcessList)
              return;
            }
          }
        }
      }

    }

  },
  mounted(){
      // $('.ivu-input').attr('disabled','true')
      // $('.ivu-input').addClass('ivu-input-disable')
  },
  created(){
    this.selects.iqc.aql = this.$iqis.objects.samplingPlans['105E'].aql;
    this.selects.iqc.samplingLevel = this.$iqis.objects.samplingPlans['105E'].level;
    this.selects.oqc.aql = this.$iqis.objects.samplingPlans['105E'].aql;
    this.selects.oqc.samplingLevel = this.$iqis.objects.samplingPlans['105E'].level;
    this.selects.pqc.aql = this.$iqis.objects.samplingPlans['105E'].aql;
    this.selects.pqc.samplingLevel = this.$iqis.objects.samplingPlans['105E'].level;
    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.refreshData();
    this.$http.get('/basic/perent').then((res)=>{
        this.samplingValue=res.data.samplingValue.split(',')||[]
        // //console.log(this.samplingValue,'11111')
    })
  },
  methods:{
    openBind(bindImg){
      this.bindImg = bindImg
      this.bindIqcInspections = []
      this.bindPqcInspections = []
      this.bindOqcInspections = []
      for(let i in this.product.settings.qc.iqc.params){
        let iqcParam = this.product.settings.qc.iqc.params[i]
        if(iqcParam.pictureUrl==bindImg){
          this.bindIqcInspections.push(iqcParam.inspectionTypeId[iqcParam.inspectionTypeId.length-1])
        }
      }
      for(let i in this.product.settings.qc.pqc.params){
        let pqcParam = this.product.settings.qc.pqc.params[i]
        if(pqcParam.pictureUrl==bindImg){
          this.bindPqcInspections.push(pqcParam.inspectionTypeId[pqcParam.inspectionTypeId.length-1])
        }
      }
      for(let i in this.product.settings.qc.oqc.params){
        let oqcParam = this.product.settings.qc.oqc.params[i]
        if(oqcParam.pictureUrl==bindImg){
          this.bindOqcInspections.push(oqcParam.inspectionTypeId[oqcParam.inspectionTypeId.length-1])
        }
      }
      this.bindIqcInspectionsInit = JSON.parse(JSON.stringify(this.bindIqcInspections))
      this.bindPqcInspectionsInit = JSON.parse(JSON.stringify(this.bindPqcInspections))
      this.bindOqcInspectionsInit = JSON.parse(JSON.stringify(this.bindOqcInspections))
      this.bindInspectionsModal=true
    },
    bindOk(){
      console.log(this.product.settings.qc,'qc');
      
      for(let i in this.product.settings.qc.iqc.params){
        let iqcParam = this.product.settings.qc.iqc.params[i]
        if(this.bindIqcInspections.includes(iqcParam.inspectionTypeId[iqcParam.inspectionTypeId.length-1])){
          iqcParam.pictureUrl = this.bindImg
        }
        if(this.bindIqcInspectionsInit.includes(iqcParam.inspectionTypeId[iqcParam.inspectionTypeId.length-1])
        &&!this.bindIqcInspections.includes(iqcParam.inspectionTypeId[iqcParam.inspectionTypeId.length-1])){
          iqcParam.pictureUrl = null
        }
      }
      for(let i in this.product.settings.qc.pqc.params){
        let pqcParam = this.product.settings.qc.pqc.params[i]
        if(this.bindPqcInspections.includes(pqcParam.inspectionTypeId[pqcParam.inspectionTypeId.length-1])){
          pqcParam.pictureUrl = this.bindImg
        }
        if(this.bindPqcInspectionsInit.includes(pqcParam.inspectionTypeId[pqcParam.inspectionTypeId.length-1])
        &&!this.bindPqcInspections.includes(pqcParam.inspectionTypeId[pqcParam.inspectionTypeId.length-1])){
          pqcParam.pictureUrl = null
        }
      }
      for(let i in this.product.settings.qc.oqc.params){
        let oqcParam = this.product.settings.qc.oqc.params[i]
        if(this.bindOqcInspections.includes(oqcParam.inspectionTypeId[oqcParam.inspectionTypeId.length-1])){
          oqcParam.pictureUrl = this.bindImg
        }
        if(this.bindOqcInspectionsInit.includes(oqcParam.inspectionTypeId[oqcParam.inspectionTypeId.length-1])
        &&!this.bindOqcInspections.includes(oqcParam.inspectionTypeId[oqcParam.inspectionTypeId.length-1])){
          oqcParam.pictureUrl = null
        }
      }
      
      this.bindInspectionsModal=false
    },
    bindCancel(){
      
    },
    getPictureUrls(urls){
      console.log(urls,'aaaaa');
      
      let pictureUrls = []
      for(let i in urls){
        if(urls[i]){
          pictureUrls.push(i)
        }else{
          pictureUrls.push('')
        }
      }
      this.pictureUrls = pictureUrls
    },
    // 新版本表格相关函数开始
    addParams(qcType){//添加检验参数
      // console.log("====>add before: " + this.product.settings.qc[qcType].params.length)
      let newIndex = this.product.settings.qc[qcType].params.length.toString()
      let record = {
        "chkDevId": '',
        "name":'',
        "inspectionTypeId": [],
        "inspectionTypeName": '',
        "lsl": '',
        "measUnitId": '',
        "measUnitName": '',
        "no": '',
        "prodChkParamId": '',
        "prodStageId": '',
        "productId": '',
        "sampleFq": '',
        "sampleNum": 5,
        "scale": 2,
        "sl": '',
        "usl": '',
        "wll": '',
        "wul": '',
        "measUnitList":[],
        "_$_row_id":newIndex
      }
      if(qcType == 'pqc'){
        for(let i in this.selects.prodProcessList){
          if(this.selects.prodProcessList[i].prodProcessName==i18n.t('product.finalInspection')&&!record.prodStageId){
            record.prodStageId=this.selects.prodProcessList[i].prodProcessId;
          } 
        }
      }
      // 新增速度太快会导致editClosed事件淹没掉，
      // 解决方案： 在该方法里就直接把新增行放入 this.product.settings.qc[qcType].params
      // editClosed这里的数据用来同步编辑后的更改 
      // by dhp 
      this.product.settings.qc[qcType].params.push(record) //add by dhp

      this.$refs['xTable_'+qcType+'_params'].insertAt(record,-1).then(({ row }) => {
        this.$refs['xTable_'+qcType+'_params'].setActiveRow(row)//设置新增行为激活
        $("#xTable_"+qcType+"_params .vxe-table--body-wrapper.body--wrapper").scrollTop((newIndex-4)*40);
        // $(".vxe-table--body-wrapper.body--wrapper .vxe-body--row").removeClass('row--hover');
        // $(".vxe-table--body-wrapper.body--wrapper .vxe-body--row:last-child").addClass('row--hover');
        // $(".vxe-table--body-wrapper.body--wrapper .vxe-body--row:last-child").hover()
      })
    },
    deleteParams(ref){
      let qcType = ref.split('_')[1]
      let selects = this.$refs[ref].getSelectRecords()
      this.$refs[ref].removeSelecteds();
      for (let i in this.product.settings.qc[qcType].params) {
        for (let j in selects) {
          if (this.product.settings.qc[qcType].params[i]._$_row_id === selects[j]._$_row_id) {
            this.product.settings.qc[qcType].params.splice(i, 1)
          }
        }
      }
    },
    judgeQcType(id,cell){// 判断是在操作哪个qc
      if(id){//通过refs判断
        return id.split('_')[1]
      }else{//通过id判断
        if($(cell).parents('#xTable_iqc_params').length==1){
          return 'iqc'
        }else if($(cell).parents('#xTable_pqc_params').length==1){
          return 'pqc'
        }else if($(cell).parents('#xTable_oqc_params').length==1){
          return 'oqc'
        }else{
          return null
        }
      }
    },
    cellClick(params,event){//点击时获取下拉框
      if(params.column.property=="measUnitId"){
        let measUnitTypeId = params.row.measUnitTypeId
        if(!measUnitTypeId)return
        this.$http.get('/basic/measunitlist/'+measUnitTypeId,{page:1,limit:99999}).then(res=>{
          params.row.measUnitList = res.data
        })
      }
      // if(params.column.property=="chkDevId"){
      //   let chkDevTypeIds = []
      //   chkDevTypeIds[0] = params.row.chkDevTypeId.includes(',')?params.row.chkDevTypeId.replace(/\,/,'_'):params.row.chkDevTypeId
      //   let res = this.$iqis.utils.syncget('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{page:1,limit:99999,useState:1});
      //   params.row.chkDevList = res?res.data[0]||[]:[];
      // }
    },
    editClosed(params,event){//关闭编辑时整行赋值
      let qcType = this.judgeQcType(null,params.cell)//直接添加多行时会出现没有$table,因此采用单元格来判断表格的id从而得到qcType
      this.product.settings.qc[qcType].params[params.row._$_row_id] = params.row

      // 新增速度太快会导致editClosed事件淹没掉，
      // 解决方案： 在aadParams方法里就直接把新增行放入 this.product.settings.qc[qcType].params
      // 这里的数据用来同步编辑后的更改

    },
    typeRender(labels,nodes){
      if(!labels || labels.length == 0){
        return '-';
      }
      let result = label[label.length-1];
      // if( (this.customerTypes.length > 0  && result == this.customerTypes[0].label)){
      //   return '-'
      // }
      return result;
    },
    formatInspectionType(params,event){//格式化检验项目
      if(params.row.inspectionTypeId.length!=0){
        return params.row.currentAndParentName
      }else{
        return ''
      }
    },
    formatSamplingPlanCode(params,event){//格式化抽样方案
      let qcType = this.judgeQcType(params.$table.$attrs.id,null)
      if(this.product.settings.qc[qcType].aql.samplingPlanType===0){
        return '--'
      }
      let format = {
        "105E":i18n.t('iqc.105E'),
        "Z1-4":i18n.t('iqc.Z1-4'),
        "0D":i18n.t('oqc.0DInspection'),
        "GB/T2828.1-2012":i18n.t('iqc.GB'),
        "full":i18n.t('product.fullSampling'),
        "percent":i18n.t('product.percentSampling'),
      }
      for(let key in format){
        if(params.cellValue==key){
          return format[key]
        }
      }
    },
    formatInspectionStandard(params,event){//格式化检验水准
      let qcType = this.judgeQcType(params.$table.$attrs.id,null)
      if(this.product.settings.qc[qcType].aql.samplingPlanType===0){
        return '--'
      }
      if(params.row.samplingPlanCode=='percent'){
        return params.row.inspectionStandard
      }else if(params.row.samplingPlanCode=='full'){
        return '--'
      }else if(params.row.samplingPlanCode=='0D'){
        return i18n.t('iqc.0DInspection')
      }else{
        let format = {
          "1":i18n.t('iqc.normalInspection')+'Ⅰ',
          "2":i18n.t('iqc.normalInspection')+'Ⅱ',
          "3":i18n.t('iqc.normalInspection')+'Ⅲ',
          "101":i18n.t('iqc.specialInspection')+'S1',
          "102":i18n.t('iqc.specialInspection')+'S2',
          "103":i18n.t('iqc.specialInspection')+'S3',
          "104":i18n.t('iqc.specialInspection')+'S4',
        }
        for(let key in format){
          if(params.cellValue==key){
            return format[key]
          }
        }
      }
    },
    getSelectLabel (value, list, valueProp, labelField) {//获得select的label
      let item = XEUtils.find(list, item => item[valueProp] === value)
      return item ? item[labelField] : null
    },
    changeInspectionTypeId(params,...data){//改变检验项目后带出测量单位列表、设备类别名称、抽样方案和检验水准和aql
      let row = data[data.length-1]
// <<<<<<< HEAD
      params.row.inspectionTypeName = row.name
// =======
      params.row.currentAndParentName = row.parentName?row.parentName+'/'+row.name:row.name
      //此处currentAndParentName是反的，只能如此取值>>>>>>> 71953e15b315891e1e2db1277dd2f7853b190589
      params.row.chkDevTypeName = row.chkDevTypeName
      params.row.samplingPlanCode = row.samplingPlanCode
      params.row.inspectionStandard = row.inspectionStandard
      params.row.aql = row.aql

      params.row.measUnitTypeId = row.measUnitTypeId
      if(params.row.measUnitTypeId){
        this.$http.get('/basic/measunitlist/'+params.row.measUnitTypeId,{page:1,limit:99999}).then(res=>{
          params.row.measUnitList = res.data
        })
      }
      // params.row.chkDevTypeId = row.chkDevTypeId
      // if(params.row.chkDevTypeId){
      //   let chkDevTypeIds = []
      //   chkDevTypeIds[0] = params.row.chkDevTypeId.includes(',')?params.row.chkDevTypeId.replace(/\,/,'_'):params.row.chkDevTypeId
      //   let res = this.$iqis.utils.syncget('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{page:1,limit:99999,useState:1});
      //   params.row.chkDevList = res?res.data[0]||[]:[];
      // }
      
    },
    // 判断小数位
    judgeDecimal(num1,num2){
      let length1 = num1.includes('.')?num1.toString().split(".")[1].length:0
      let length2 = num2.includes('.')?num2.toString().split(".")[1].length:0
      let length = Number(length1)>Number(length2)?length1:length2
      return length
    },
    changeSl(params){
      params.row.usl = (Number(params.row.sl)+Number(params.row.positiveTolerance)).toFixed(this.judgeDecimal(params.row.sl,params.row.positiveTolerance))
      params.row.lsl = (Number(params.row.sl)+Number(params.row.negativeTolerance)).toFixed(this.judgeDecimal(params.row.sl,params.row.negativeTolerance))
    },
    changePt(params){
      params.row.usl = (Number(params.row.sl)+Number(params.row.positiveTolerance)).toFixed(this.judgeDecimal(params.row.sl,params.row.positiveTolerance))
    },
    changeNt(params){
      params.row.lsl = (Number(params.row.sl)+Number(params.row.negativeTolerance)).toFixed(this.judgeDecimal(params.row.sl,params.row.negativeTolerance))
    },
    // 新版本表格相关函数结束
    //字符创处理
    stringHandling(string,index,key,xqc){
      let strings = string.replace(/，/g,",")
        let j = 0
        let stringArr = ''
        if(strings !== Number){
            
            stringArr = strings.split('');//把字符串转换为数组
            for(let i = 0; i < stringArr.length; i++){
                if(stringArr[i] == ','){
                    j++
                }
            }
            if(j === 3){
                stringArr = strings.split(',')
                if(stringArr.length === 4){
                    stringArr.splice(1,0,'°')
                    stringArr.splice(3,0,'′')
                    stringArr.splice(6,0,'″')
                    if(xqc == 'iqc'){
                      this.product.settings.qc.iqc.params[index][key] = stringArr.join("")
                    }
                    if(xqc == 'pqc'){
                      this.product.settings.qc.pqc.params[index][key] = stringArr.join("")
                    }
                    if(xqc == 'oqc'){
                      this.product.settings.qc.oqc.params[index][key] = stringArr.join("")
                    }
                }
            }
        }
    },
    changeSamplingPlanType(type,qc){
      let that = this;
      let params = []
      if(qc=='iqc'){params=that.product.settings.qc.iqc.params}
      else if(qc=='pqc'){params=that.product.settings.qc.pqc.params}
      else if(qc=='oqc'){params=that.product.settings.qc.oqc.params}
      else{return}
      if(type===1){
        let ids = []
        for(let i in params){
          ids.push(params[i].inspectionTypeId[params[i].inspectionTypeId.length-1])
        }
        // console.log(ids,'2354')
        
        that.$http.get('/basic/manyInspectiontype?inspectionTypeIds[]='+ids).then(function(res){
          // console.log(res.data,'2351')
          for(let i in params){
            params[i].samplingPlanCode=res.data[i].samplingPlanCode
            params[i].inspectionStandard=res.data[i].inspectionStandard
            params[i].aql=res.data[i].aql
          }
        })
      }else{
        for(let i in params){
          params[i].samplingPlanCode='--'
          params[i].inspectionStandard='--'
          params[i].aql='--'
        }
      }

      // params=data
    },
    refreshData(){
      let that = this;
      let copy = that.$props && that.$props.tabKey;
      that.copy = copy.split('-')[2];
      let productId = that.$props.params && that.$props.params.productId;
      let productTypeValue = that.$props.params && that.$props.params.productTypeValue;
      // //console.log(productTypeValue);
      this.loadSelectsData(function(){
        if(productId){
          that.productId=productId;
          that.loadStat.productDataLoading = true;
          that.$http.get("/basic/product/detail/"+productId).then(function (resp) {
            console.log(resp.data,1111111111);
            
            that.loadStat.productDataLoading = false;
            let item = resp.data;
            // that.product = resp.data
            that.product.settings.ext=item.settings.ext;
            that.spinShow=true;
            // //console.log('get product detail<====',item);
            that.$iqis.utils.deepMerge(item,that.product)
            if(item.updateTime){
              item.updateTime = new Date(item.updateTime);
            }else{
              item.updateTime = "";
            }
            if(item.settings.qc.iqc.aql!=null){
              item.settings.qc.iqc.aql.useState = item.settings.qc.iqc.aql.useState == 1;
              let data = item.settings.qc.iqc
              if(data.aql.samplingPlanCode=='full'){
                data['fullDis']=true;
                data['percentDis']=false;
              }else if(data.aql.samplingPlanCode=='percent'){
                data['fullDis']=false;
                data['percentDis']=true;
              }else{
                data['fullDis']=false;
                data['percentDis']=false;
              }
            }
            if(item.settings.qc.pqc.aql!=null){
              item.settings.qc.pqc.aql.useState = item.settings.qc.pqc.aql.useState == 1;
              let data = item.settings.qc.pqc
              if(data.aql.samplingPlanCode=='full'){
                data['fullDis']=true;
                data['percentDis']=false;
              }else if(data.aql.samplingPlanCode=='percent'){
                data['fullDis']=false;
                data['percentDis']=true;
              }else{
                data['fullDis']=false;
                data['percentDis']=false;
              }
            }
            if(item.settings.qc.oqc.aql!=null){
              item.settings.qc.oqc.aql.useState = item.settings.qc.oqc.aql.useState == 1;
              let data = item.settings.qc.oqc
              if(data.aql.samplingPlanCode=='full'){
                data['fullDis']=true;
                data['percentDis']=false;
              }else if(data.aql.samplingPlanCode=='percent'){
                data['fullDis']=false;
                data['percentDis']=true;
              }else{
                data['fullDis']=false;
                data['percentDis']=false;
              }
            }
            that.prodTypeId=item.prodTypeId;//如果是修改，则类别跳转到原分类
            let result = that.$iqis.utils.findPathInTree(that.selects.prodTypes[0],[],item.prodTypeId,"prodTypeId");
            result = result || [];//productTypeValue

            item.productTypeValue = result;
            if(item.settings.qc.iqc.params!=null){
              let iqcParams = item.settings.qc.iqc.params;
              if(iqcParams){
                let measUnitTypeIds = []
                for(let i in iqcParams){
                  iqcParams[i]['_$_row_id']=i;
                  if(!iqcParams[i].measUnitTypeId){iqcParams[i].measUnitTypeId=-1}
                  measUnitTypeIds.push(iqcParams[i].measUnitTypeId)
                }
                console.log(measUnitTypeIds,'measUnitTypeIds')
                let resp =measUnitTypeIds?that.$iqis.utils.syncget('/basic/measunitListByIds?measUnitTypeIds[]='+measUnitTypeIds):null;
                console.log(resp.data,'resp.data')
                for(let i in iqcParams){
                  let measUnitList = resp ? resp.data[i]||[] : [];
                  measUnitList.unshift({measUnitId:null,unitSymbol:i18n.t("Unlimited")});
                  iqcParams[i]['measUnitList'] = measUnitList;

                  let chkDevTypeId=[]
                  if(iqcParams[i].chkDevTypeId){
                    chkDevTypeId = iqcParams[i].chkDevTypeId.split(',')||iqcParams[i].chkDevTypeId.toString();
                  }
                  let chkDevList = []
                  iqcParams[i]['chkDevList'] = []
                  for(let i in chkDevTypeId){
                    let resp2 = that.$iqis.utils.syncget('/basic/chkdevlist/'+chkDevTypeId[i]);
                    chkDevList=chkDevList.concat(resp2 ? resp2.data||[] : []) 
                  }
                  chkDevList.unshift({chkDevId:null,name:i18n.t("Unlimited")});
                  iqcParams[i]['chkDevList'] = chkDevList
                  
                  let id = that.$iqis.utils.findPathInTree(that.selects.inspectionTypes[0],[],iqcParams[i].inspectionTypeId,'inspectionTypeId');
                  if(id&&id.length>1){id.splice(0,1)}else{id = []}
                  iqcParams[i].inspectionTypeId = id
                }
                // for(let i in iqcParams){
                //   let measUnitTypeId = iqcParams[i].measUnitTypeId;
                //   let resp =measUnitTypeId?that.$iqis.utils.syncget('/basic/measunitlist/'+measUnitTypeId):null;
                //   let measUnitList = resp ? resp.data||[] : [];
                //   measUnitList.unshift({measUnitId:null,unitSymbol:i18n.t("Unlimited")});
                //   iqcParams[i]['measUnitList'] = measUnitList;
                //   iqcParams[i]['_$_row_id']=i;
                //   let chkDevTypeId=[]
                //   if(iqcParams[i].chkDevTypeId){
                //     chkDevTypeId = iqcParams[i].chkDevTypeId.split(',')||iqcParams[i].chkDevTypeId.toString();
                //   }
                //   let chkDevList = []
                //   iqcParams[i]['chkDevList'] = []
                //   for(let i in chkDevTypeId){
                //     let resp2 = that.$iqis.utils.syncget('/basic/chkdevlist/'+chkDevTypeId[i]);
                //     chkDevList=chkDevList.concat(resp2 ? resp2.data||[] : []) 
                //   }
                //   chkDevList.unshift({chkDevId:null,name:i18n.t("Unlimited")});
                //   iqcParams[i]['chkDevList'] = chkDevList
                // }
              }
            }

            if(item.settings.qc.pqc.params!=null){
              let pqcParams = item.settings.qc.pqc.params;
              if(pqcParams){
                let measUnitTypeIds = []
                for(let i in pqcParams){
                  pqcParams[i]['_$_row_id']=i;
                  measUnitTypeIds.push(pqcParams[i].measUnitTypeId)
                }
                let resp =measUnitTypeIds?that.$iqis.utils.syncget('/basic/measunitListByIds?measUnitTypeIds[]='+measUnitTypeIds):null;
                for(let i in pqcParams){
                  let measUnitList = resp ? resp.data[i]||[] : [];
                  measUnitList.unshift({measUnitId:null,unitSymbol:i18n.t("Unlimited")});
                  pqcParams[i]['measUnitList'] = measUnitList;

                  let chkDevTypeId=[]
                  if(pqcParams[i].chkDevTypeId){
                    chkDevTypeId = pqcParams[i].chkDevTypeId.split(',')||pqcParams[i].chkDevTypeId.toString();
                  }
                  let chkDevList = []
                  pqcParams[i]['chkDevList'] = []
                  for(let i in chkDevTypeId){
                    let resp2 = that.$iqis.utils.syncget('/basic/chkdevlist/'+chkDevTypeId[i]);
                    chkDevList=chkDevList.concat(resp2 ? resp2.data||[] : []) 
                  }
                  chkDevList.unshift({chkDevId:null,name:i18n.t("Unlimited")});
                  pqcParams[i]['chkDevList'] = chkDevList

                  let id = that.$iqis.utils.findPathInTree(that.selects.inspectionTypes[0],[],pqcParams[i].inspectionTypeId,'inspectionTypeId');
                  if(id&&id.length>1){id.splice(0,1)}else{id = []}
                  pqcParams[i].inspectionTypeId = id
                }
              }
            }

            if(item.settings.qc.oqc.params!=null){
              let oqcParams = item.settings.qc.oqc.params;
              if(oqcParams){
                let measUnitTypeIds = []
                for(let i in oqcParams){
                  oqcParams[i]['_$_row_id']=i;
                  measUnitTypeIds.push(oqcParams[i].measUnitTypeId)
                }
                let resp =measUnitTypeIds?that.$iqis.utils.syncget('/basic/measunitListByIds?measUnitTypeIds[]='+measUnitTypeIds):null;
                for(let i in oqcParams){
                  let measUnitList = resp ? resp.data[i]||[] : [];
                  measUnitList.unshift({measUnitId:null,unitSymbol:i18n.t("Unlimited")});
                  oqcParams[i]['measUnitList'] = measUnitList;

                  let chkDevTypeId=[]
                  if(oqcParams[i].chkDevTypeId){
                    chkDevTypeId = oqcParams[i].chkDevTypeId.split(',')||oqcParams[i].chkDevTypeId.toString();
                  }
                  let chkDevList = []
                  oqcParams[i]['chkDevList'] = []
                  for(let i in chkDevTypeId){
                    let resp2 = that.$iqis.utils.syncget('/basic/chkdevlist/'+chkDevTypeId[i]);
                    chkDevList=chkDevList.concat(resp2 ? resp2.data||[] : []) 
                  }
                  chkDevList.unshift({chkDevId:null,name:i18n.t("Unlimited")});
                  oqcParams[i]['chkDevList'] = chkDevList
                  
                  let id = that.$iqis.utils.findPathInTree(that.selects.inspectionTypes[0],[],oqcParams[i].inspectionTypeId,'inspectionTypeId');
                  if(id&&id.length>1){id.splice(0,1)}else{id = []}
                  oqcParams[i].inspectionTypeId = id
                }
              }
            }
           if(item.settings.qc.oqc.aql!=null&&item.settings.qc.iqc.aql!=null&&item.settings.qc.pqc.aql!=null){
              that.product = item;
           }else{
             that.product.productTypeValue=item.productTypeValue
           }

            // //console.log(that.product,'产品数据合并后-----------------------------------')
            that._product=JSON.parse(JSON.stringify(that.product));


          });

        }else{
          let item = {};
          that.product.productTypeValue = productTypeValue;
          that.loadStat.productDataLoading = false;
          that.spinShow=true;
        }
        if((that.productId&&that.permsBtn.UPDATE_PRODUCT)||(!that.productId&&that.permsBtn.INSERT_PRODUCT)){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
        
      });
    },
    changeInspStan(type,code){
      let that = this;
      let data='';
      if(type=='iqc'){
        data = that.product.settings.qc.iqc
      }else if(type == 'pqc'){
        data = that.product.settings.qc.pqc        
      }else if(type == 'oqc'){
        data = that.product.settings.qc.oqc        
      }
      data.aql.inspectionStandard='';
      if(data.aql.samplingPlanCode=='full'){
        data['fullDis']=true;
        data['percentDis']=false;
        data.aql.transRuleId=null
        data.aql.crAql=null
        data.aql.majAql=null
        data.aql.minAql=null
      }else if(data.aql.samplingPlanCode=='percent'){
        data['fullDis']=false;
        data['percentDis']=true;
        data.aql.transRuleId=null
        data.aql.crAql=null
        data.aql.majAql=null
        data.aql.minAql=null
      }else{
        data['fullDis']=false;
        data['percentDis']=false;
        // data.aql.transRuleId=null
        let index = -1;
        for(let i = 0;i<that.selects.transRules.length;i++){
          if(that.selects.transRules[i].isDefault === 1){
            index = i;
            break;
          }
        }
        if(index != -1){
          data.aql.transRuleId = that.selects.transRules[index].ruleId
        }
        data.aql.crAql='0.10'
        data.aql.majAql='0.40'
        data.aql.minAql='0.65'
      }
    },
    iqcTableSelectChange(selection){
      this.table.iqc.params.selected = selection;
    },
    iqcTableSelectChanges(selection){
      this.table.iqc.paramss.selected = selection;
    },
    pqcTableSelectChange(selection){
      this.table.pqc.params.selected = selection;
    },
    pqcTableSelectChanges(selection){
      this.table.pqc.paramss.selected = selection;
    },
    oqcTableSelectChange(selection){
      this.table.oqc.params.selected = selection;
    },
    oqcTableSelectChanges(selection){
      this.table.oqc.paramss.selected = selection;
    },
    cellEditorEnd(val,field,index){
      // //console.log(arguments)
    },
    commitIqcEditorData(){
      for(let k in this.product.settings.qc.iqc.newData){
        this.product.settings.qc.iqc.params.splice(k, 1, this.product.settings.qc.iqc.newData[k]);
      }
      this.product.settings.qc.iqc.newData = [];
    },
    /* commitIqcEditorDatas(){
      for(let k in this.product.settings.qc.iqc.newDatas){
        this.product.settings.qc.iqc.property.splice(k, 1, this.product.settings.qc.iqc.newDatas[k]);
      }
      this.product.settings.qc.iqc.newDatas = [];
    }, */
    cellIqcEditorEnd(val,key,index){
      // //console.log('cellIqcEditorEnd',arguments);
      // //console.log('cellIqcEditorEnd row data=',this.product.settings.qc.iqc.params)
      // //console.log('cellIqcEditorEnd cur row=',this.product.settings.qc.iqc.params[index])
      //page.data[rowIndex][field] = val;

      let newRow = this.product.settings.qc.iqc.newData[index];

      // //console.log(newRow,'-----------------------------------------')
      if(!newRow && this.product.settings.qc.iqc.params[index]){
        newRow =  JSON.parse(JSON.stringify(this.product.settings.qc.iqc.params[index]));
      }
      if(!newRow){
        return;
      }
      var oldV = newRow[key];
      newRow[key] = val;
      this.product.settings.qc.iqc.newData[index] = newRow;

      if(oldV != val){
        newRow._updated = true;
        //this.saveRow(newRow,index);
      }
      // //console.log(this.product.settings.qc.iqc.params,'所有数据')

    },

    iqcParamsInspectionSelectorClose(val,key,index,o){
      if(o == null || Object.keys(o).length == 0){
        return;
      }
      let that = this;
      this.product.settings.qc.iqc.newDatas = this.product.settings.qc.iqc.newDatas ||[];
      let newRows = this.product.settings.qc.iqc.newDatas[index];
      if(!newRows && this.product.settings.qc.iqc.params[index]){
        newRows =  JSON.parse(JSON.stringify(this.product.settings.qc.iqc.params[index]));
      }
      if(!newRows){
        return;
      }
      var oldV = newRows[key]; //old inspectionTypeId
      newRows[key] = val; //new inspectionTypeId
      newRows['inspectionTypeName'] = o.name;
      newRows['inspectionTypeId'] = o.inspectionTypeId;
      newRows['chkDevTypeId'] =o.chkDevTypeId?o.chkDevTypeId.split(','):null;
      newRows['chkDevTypeName'] = o.chkDevTypeName;
      newRows['measUnitTypeId'] = o.measUnitTypeId;
      if(this.product.settings.qc.iqc.aql.samplingPlanType===1){
        newRows['samplingPlanCode'] = o.samplingPlanCode;
        newRows['inspectionStandard'] = o.inspectionStandard;
        newRows['aql'] = o.aql;
      }else{
        newRows['samplingPlanCode'] = '-'
        newRows['inspectionStandard'] = '-'
        newRows['aql'] = '-'
      }
      // console.log(newRows,'newRows-----------')

      let resp = this.$iqis.utils.syncget('/basic/measunitlist/'+o.measUnitTypeId);
      newRows['measUnitList'] = resp ? resp.data||[] : [];
      newRows['measUnitList'].unshift({measUnitId:null,unitSymbol:i18n.t("Unlimited")});

      newRows['chkDevList'] = []
      for(let i in newRows['chkDevTypeId']){
        let resp2 = this.$iqis.utils.syncget('/basic/chkdevlist/'+newRows['chkDevTypeId'][i]);
        newRows['chkDevList']=newRows['chkDevList'].concat(resp2 ? resp2.data||[] : []) 
      }
      newRows['chkDevList'].unshift({chkDevId:null,name:i18n.t('iqc.null')});
      this.product.settings.qc.iqc.newDatas[index] = newRows;
      this.$set(this.product.settings.qc.iqc.params, index, newRows);

    },
    //来料
    iqcParamsInspectionSelectorCloses(val,key,index,o){console.log(o,666)
        this.product.settings.qc.iqc.property[index][key] = val
        this.product.settings.qc.iqc.property[index].inspectionId = val || ''
        this.product.settings.qc.iqc.property[index].examType = 1
        this.$http.get("/basic/inspectiontype/?limit=999999").then((res) => {
        for(let i in res.data) {
          if(o.name==res.data[i].name) {
            // this.product.settings.qc.iqc.property[index].inspectionLevel=res.data[i].remark
            if(res.data[i].remark) {
              this.product.settings.qc.iqc.property[index].inspectionLevel=res.data[i].remark
              return
            }
            else{
              this.product.settings.qc.iqc.property[index].inspectionLevel=""
            }
          }
          else{
            this.product.settings.qc.iqc.property[index].inspectionLevel=""
          }
        }
      }) 
    },
    
    //过程
    pqcParamsInspectionSelectorCloses(val,key,index,o){
      this.product.settings.qc.pqc.property[index][key] = val
      this.product.settings.qc.pqc.property[index].inspectionId = val || ''
      this.product.settings.qc.pqc.property[index].examType = 0
      this.$http.get("/basic/inspectiontype/").then((res) => {
        for(let i in res.data) {
          if(o.name==res.data[i].name) {
            // this.product.settings.qc.iqc.property[index].inspectionLevel=res.data[i].remark
            if(res.data[i].remark) {
              this.product.settings.qc.pqc.property[index].inspectionLevel=res.data[i].remark
              return
            }
            else{
              this.product.settings.qc.pqc.property[index].inspectionLevel=""
            }
          }
          else{
            this.product.settings.qc.pqc.property[index].inspectionLevel=""
          }
        }
      })
    },
    //出货
    oqcParamsInspectionSelectorCloses(val,key,index,o){
      this.product.settings.qc.oqc.property[index][key] = val
      this.product.settings.qc.oqc.property[index].inspectionId = val || ''
      this.product.settings.qc.oqc.property[index].examType = 2
      this.$http.get("/basic/inspectiontype/").then((res) => {
      for(let i in res.data) {
          if(o.name==res.data[i].name) {
            // this.product.settings.qc.iqc.property[index].inspectionLevel=res.data[i].remark
            if(res.data[i].remark) {
              this.product.settings.qc.oqc.property[index].inspectionLevel=res.data[i].remark
              return
            }
            else{
              this.product.settings.qc.oqc.property[index].inspectionLevel=""
            }
          }
          else{
            this.product.settings.qc.oqc.property[index].inspectionLevel=""
          }
        }
    })
    },
    /* iqcParamsInspectionSelectorCloses(val,key,index,o){
      if(o == null || Object.keys(o).length == 0){
      
        return;
      }
      let that = this;
      this.product.settings.qc.iqc.newDatas = this.product.settings.qc.iqc.newDatas ||[];
      console.log(this.product,123);
      let newRow = this.product.settings.qc.iqc.newDatas[index];

      
      if(!newRow && this.product.settings.qc.iqc.params[index]){
        newRow =  JSON.parse(JSON.stringify(this.product.settings.qc.iqc.params[index]));
      }
      if(!newRow){
        return;
      }
      var oldV = newRow[key]; //old inspectionTypeId
      newRow[key] = val; //new inspectionTypeId
      newRow['inspectionTypeName'] = o.name;
      newRow['inspectionTypeId'] = o.inspectionTypeId;
      newRow['chkDevTypeId'] = o.chkDevTypeId.split(',')||o.chkDevTypeId.toString();
      newRow['chkDevTypeName'] = o.chkDevTypeName;
      newRow['measUnitTypeId'] = o.measUnitTypeId;
      if(this.product.settings.qc.iqc.aql.samplingPlanType===1){
        newRow['samplingPlanCode'] = o.samplingPlanCode;
        newRow['inspectionStandard'] = o.inspectionStandard;
        newRow['aql'] = o.aql;
      }else{
        newRow['samplingPlanCode'] = '-'
        newRow['inspectionStandard'] = '-'
        newRow['aql'] = '-'
      }
      // console.log(newRow,'newRow-----------')
      let resp = this.$iqis.utils.syncget('/basic/measunitlist/'+o.measUnitTypeId);
      newRow['measUnitList'] = resp ? resp.data||[] : [];
      newRow['chkDevList'] = []
      for(let i in newRow['chkDevTypeId']){
        let resp2 = this.$iqis.utils.syncget('/basic/chkdevlist/'+newRow['chkDevTypeId'][i]);
        newRow['chkDevList']=newRow['chkDevList'].concat(resp2 ? resp2.data||[] : []) 
      }

      this.product.settings.qc.iqc.newDatas[index] = newRow;
      this.$set(this.product.settings.qc.iqc.params, index, newRow);

    }, */
    iqcParamsMeasUnitSelectorChange(val, fieldName, rowIndex){
      let rowData = this.product.settings.qc.iqc.params[rowIndex];
      rowData[fieldName] = val;
    },
    deleteIqcParams(){
      let selection = this.$refs.iqcParamTable.getSelection();
      // //console.log(selection,7788990);
      let rowIdArr = [];
      for(let i=0;i<selection.length;i++){
        rowIdArr.push(selection[i]._$_row_id);
      }

      // //console.log(rowIdArr);

      this.commitIqcEditorData();
      let deleteRows = [];
      for(let i=0;i<rowIdArr.length;i++){
        for(let j=0;j<this.product.settings.qc.iqc.params.length;j++){
          if(this.product.settings.qc.iqc.params[j]._$_row_id == rowIdArr[i]){
            deleteRows.push(this.product.settings.qc.iqc.params[j]);
          }
        }
      }
      for(let i=0;i<deleteRows.length;i++){
        let item = deleteRows[i];
        let itemIndex = this.product.settings.qc.iqc.params.indexOf(item);
        if(itemIndex >=0){
          this.product.settings.qc.iqc.params.splice(itemIndex,1);
        }
      }

      this.table.iqc.params.selected = [];

    },
    deleteIqcParamss(){
      let selection = this.$refs.iqcParamTables.getSelection();
      // //console.log(selection,7788990);
      /* let rowIdArr = [];
      for(let i=0;i<selection.length;i++){
        rowIdArr.push(selection[i]._$_row_id);
      }
      // //console.log(rowIdArr);
      // this.commitIqcEditorDatas();
      let deleteRows = [];
      for(let i=0;i<rowIdArr.length;i++){
        for(let j=0;j<this.product.settings.qc.iqc.property.length;j++){
          if(this.product.settings.qc.iqc.property[j]._$_row_id == rowIdArr[i]){
            deleteRows.push(this.product.settings.qc.iqc.property[j]);
          }
        }
      }
      for(let i=0;i<deleteRows.length;i++){
        let item = deleteRows[i];
        let itemIndex = this.product.settings.qc.iqc.property.indexOf(item);
        if(itemIndex >=0){
          this.product.settings.qc.iqc.property.splice(itemIndex,1);
        }
      } */
      if(selection.length > 0){
        for(let i in selection){
          for(let j in this.product.settings.qc.iqc.property){
            if(selection[i].propertyId == this.product.settings.qc.iqc.property[j].propertyId){
             this.product.settings.qc.iqc.property.splice(j,1);
            }
          }
        }
      }
      this.table.iqc.paramss.selected = [];
    },
    deleteIqcParamspqc(){
      let selection = this.$refs.pqcParamTables.getSelection();
      // //console.log(selection,7788990);
      /* let rowIdArr = [];
      for(let i=0;i<selection.length;i++){
        rowIdArr.push(selection[i]._$_row_id);
      }

      // //console.log(rowIdArr);

      // this.commitIqcEditorDatas();
      let deleteRows = [];
      for(let i=0;i<rowIdArr.length;i++){
        for(let j=0;j<this.product.settings.qc.pqc.property.length;j++){
          if(this.product.settings.qc.pqc.property[j]._$_row_id == rowIdArr[i]){
            deleteRows.push(this.product.settings.qc.pqc.property[j]);
          }
        }
      }
      for(let i=0;i<deleteRows.length;i++){
        let item = deleteRows[i];
        let itemIndex = this.product.settings.qc.pqc.property.indexOf(item);
        if(itemIndex >=0){
          this.product.settings.qc.pqc.property.splice(itemIndex,1);
        }
      } */
      if(selection.length > 0){
        for(let i in selection){
          for(let j in this.product.settings.qc.pqc.property){
            if(selection[i].propertyId == this.product.settings.qc.pqc.property[j].propertyId){
             this.product.settings.qc.pqc.property.splice(j,1);
            }
          }
        }
      }

      this.table.pqc.paramss.selected = [];

    },
    deleteIqcParamsoqc(){
      let selection = this.$refs.oqcParamTables.getSelection();//获取到选择后的数据   []
      /* 
      console.log(selection,"selection");
      console.log(this.product.settings.qc.oqc.property,"product.settings.qc.oqc.property");
      return; */
      /* 
      let rowIdArr = [];
      for(let i=0;i<selection.length;i++){
        rowIdArr.push(selection[i]._$_row_id);
      }

      // //console.log(rowIdArr);

      // this.commitIqcEditorDatas();
      let deleteRows = [];
      for(let i=0;i<rowIdArr.length;i++){
        for(let j=0;j<this.product.settings.qc.oqc.property.length;j++){
          if(this.product.settings.qc.oqc.property[j]._$_row_id == rowIdArr[i]){
            deleteRows.push(this.product.settings.qc.oqc.property[j]);
          }
        }
      }
      for(let i=0;i<deleteRows.length;i++){
        let item = deleteRows[i];
        let itemIndex = this.product.settings.qc.oqc.property.indexOf(item);
        if(itemIndex >=0){
          this.product.settings.qc.oqc.property.splice(itemIndex,1);
        }
      } */
      if(selection.length > 0){
        for(let i in selection){
          for(let j in this.product.settings.qc.oqc.property){
            if(selection[i].propertyId == this.product.settings.qc.oqc.property[j].propertyId){
             this.product.settings.qc.oqc.property.splice(j,1);
            }
          }
        }
      }
      this.table.oqc.paramss.selected = [];
    },
    iqcAddParams(){
      var newRow ={
        "chkDevId": '',
        "name":'',
        "inspectionTypeId": '',
        "inspectionTypeName": '',
        "lsl": '',
        "measUnitId": '',
        "measUnitName": '',
        "no": '',
        "prodChkParamId": '',
        "prodStageId": '',
        "productId": '',
        "sampleFq": '',
        "sampleNum": 5,
        "scale": 2,
        "sl": '',
        "usl": '',
        "negativeTolerance": '',
        "positiveTolerance": '',
        "measUnitList":[]
      };
      console.log(this.product.settings.qc.iqc.params,444);
      this.$iqis.utils.tableHelper.editable.initRowData([newRow],[]);
      this.commitIqcEditorData();
      this.product.settings.qc.iqc.params.push(newRow);
      let index = this.product.settings.qc.iqc.params.length
      for(let i in this.product.settings.qc.iqc.params){
        this.product.settings.qc.iqc.params[i]['_$_row_id']=i;
      }
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((index-5)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');

      })
    },

    //来料属性设置添加按钮
    iqcAddParamss(){
      console.log(this.product.settings.qc.iqc.property,777);
      
      var newRows ={
        "inspectionId": '',
        "inspectionLevel":'',
      };

      this.$iqis.utils.tableHelper.editable.initRowData([newRows],[]);

      // this.commitIqcEditorDatas();

      this.product.settings.qc.iqc.property.push(newRows);

      let index = this.product.settings.qc.iqc.property.length
      for(let i in this.product.settings.qc.iqc.property){
        this.product.settings.qc.iqc.property[i]['_$_row_id']=i;
      }
      console.log(this.product.settings.qc.iqc.property,888);
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((index-5)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');
      })
    },
    //过程属性设置添加按钮
    pqcAddParamss(){
      var newRows ={
        "inspectionId": '',
        "inspectionLevel":'',
        "prodStageId":""
      };
      for(let i in this.selects.prodProcessList){
        if(this.selects.prodProcessList[i].prodProcessName==i18n.t('product.finalInspection')&&!newRows.prodStageId){
          newRows.prodStageId=this.selects.prodProcessList[i].prodProcessId;
        } 
      }
      this.$iqis.utils.tableHelper.editable.initRowData([newRows],[]);

      // this.commitIqcEditorDatas();

      this.product.settings.qc.pqc.property.push(newRows);

      let index = this.product.settings.qc.pqc.property.length
      for(let i in this.product.settings.qc.pqc.property){
        this.product.settings.qc.pqc.property[i]['_$_row_id']=i;
      }
      console.log(this.product.settings.qc.pqc.property,888);
      this.$nextTick(function(){
        $(".iqis-inline-editor-table .ivu-table-body").scrollTop((index-5)*43);
          // $(".iqis-inline-editor-table .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');
      })
    },
    //过程属性设置添加按钮
    oqcAddParamss(){
      var newRows ={
        "inspectionId": '',
        "inspectionLevel":'',
      };

      this.$iqis.utils.tableHelper.editable.initRowData([newRows],[]);

      // this.commitIqcEditorDatas();

      this.product.settings.qc.oqc.property.push(newRows);

      let index = this.product.settings.qc.oqc.property.length
      for(let i in this.product.settings.qc.oqc.property){
        this.product.settings.qc.oqc.property[i]['_$_row_id']=i;
      }
      console.log(this.product.settings.qc.oqc.property,888);
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((index-5)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');
      })
      $('.help-gundongtiao').scrollTop($('.help-gundongtiao')[0].scrollHeight);
    },
    commitPqcEditorData(){ 
      for(let k in this.product.settings.qc.pqc.newData){
        this.product.settings.qc.pqc.params.splice(k, 1, this.product.settings.qc.pqc.newData[k]);
      }
      this.product.settings.qc.pqc.newData = [];
    },
    cellPqcEditorEnd(val,key,index){
      
      //page.data[rowIndex][field] = val;
      let newRow = this.product.settings.qc.pqc.params[index];
      if(!newRow && this.product.settings.qc.pqc.params[index]){
        newRow =  JSON.parse(JSON.stringify(this.product.settings.qc.pqc.params[index]));
      }
      if(!newRow){
        return;
      }
      var oldV = newRow[key];
      newRow[key] = val;
      this.product.settings.qc.pqc.params[index] = newRow;

      if(oldV != val){
        newRow._updated = true;
        //this.saveRow(newRow,index);
      }
    },
    cellPqcEditorEnd2(val,key,index){
      console.log(val,key,index,'-----------------------');
      
      //page.data[rowIndex][field] = val;
      let newRow = this.product.settings.qc.pqc.property[index];
      if(!newRow && this.product.settings.qc.pqc.property[index]){
        newRow =  JSON.parse(JSON.stringify(this.product.settings.qc.pqc.property[index]));
      }
      if(!newRow){
        return;
      }
      var oldV = newRow[key];
      newRow[key] = val;
      this.product.settings.qc.pqc.property[index] = newRow;

      if(oldV != val){
        newRow._updated = true;
        //this.saveRow(newRow,index);
      }
    },
    pqcParamsInspectionSelectorClose(val,key,index,o){
      if(o == null || Object.keys(o).length == 0){
        return;
      }
      // //console.log('pqcParamsInspectionSelectorClose iargs=',val,key,index,o);
      let that = this;
      this.product.settings.qc.pqc.newDatas = this.product.settings.qc.pqc.newDatas ||[];
      let newRow = this.product.settings.qc.pqc.newDatas[index];
      if(!newRow && this.product.settings.qc.pqc.params[index]){
        newRow =  JSON.parse(JSON.stringify(this.product.settings.qc.pqc.params[index]));
      }
      if(!newRow){
        return;
      }
      var oldV = newRow[key]; //old inspectionTypeId
      newRow[key] = val; //new inspectionTypeId
      newRow['inspectionTypeName'] = o.name;
      newRow['inspectionTypeId'] = o.inspectionTypeId;
      newRow['chkDevTypeId'] = o.chkDevTypeId?o.chkDevTypeId.split(','):null;
      newRow['chkDevTypeName'] = o.chkDevTypeName;
      newRow['measUnitTypeId'] = o.measUnitTypeId;
      if(this.product.settings.qc.iqc.aql.samplingPlanType===1){
        newRow['samplingPlanCode'] = o.samplingPlanCode;
        newRow['inspectionStandard'] = o.inspectionStandard;
        newRow['aql'] = o.aql;
      }else{
        newRow['samplingPlanCode'] = '-'
        newRow['inspectionStandard'] = '-'
        newRow['aql'] = '-'
      }

      let resp = this.$iqis.utils.syncget('/basic/measunitlist/'+o.measUnitTypeId);
      newRow['measUnitList'] = resp ? resp.data||[] : [];
      newRow['measUnitList'].unshift({measUnitId:null,unitSymbol:i18n.t("Unlimited")});

      newRow['chkDevList'] = []
      for(let i in newRow['chkDevTypeId']){
        let resp2 = this.$iqis.utils.syncget('/basic/chkdevlist/'+newRow['chkDevTypeId'][i]);
        newRow['chkDevList']=newRow['chkDevList'].concat(resp2 ? resp2.data||[] : []) 
      }
      newRow['chkDevList'].unshift({chkDevId:null,name:i18n.t('iqc.null')});
      // //console.log('pqcParamsInspectionSelectorClose pqc.newData=',this.product.settings.qc.pqc.newData);
      // //console.log('pqcParamsInspectionSelectorClose pqc.params=',this.product.settings.qc.pqc.params);
      this.product.settings.qc.pqc.newDatas[index] = newRow;
      this.$set(this.product.settings.qc.pqc.params, index, newRow);
    },
    pqcParamsMeasUnitSelectorChange(val, fieldName, rowIndex){
      let rowData = this.product.settings.qc.pqc.params[rowIndex];
      rowData[fieldName] = val;
    },
    deletePqcParams(){
      let selection = this.$refs.pqcParamTable.getSelection();
      // //console.log(selection);
      let rowIdArr = [];
      for(let i=0;i<selection.length;i++){
        rowIdArr.push(selection[i]._$_row_id);
      }

      // //console.log(rowIdArr);

      this.commitPqcEditorData();
      let deleteRows = [];
      for(let i=0;i<rowIdArr.length;i++){
        for(let j=0;j<this.product.settings.qc.pqc.params.length;j++){
          if(this.product.settings.qc.pqc.params[j]._$_row_id == rowIdArr[i]){
            deleteRows.push(this.product.settings.qc.pqc.params[j]);
          }
        }
      }
      for(let i=0;i<deleteRows.length;i++){
        let item = deleteRows[i];
        let itemIndex = this.product.settings.qc.pqc.params.indexOf(item);
        if(itemIndex >=0){
          this.product.settings.qc.pqc.params.splice(itemIndex,1);
        }
      }

      this.table.pqc.params.selected = [];

    },
    pqcAddParams(){
      var newRow = {
          "chkDevId": '',
          "name": '',
          "inspectionTypeId": '',
          "inspectionTypeName": '',
          "lsl": '',
          "measUnitId": '',
          "measUnitName": '',
          "no": '',
          "prodChkParamId": '',
          "prodStageId": '',
          "productId": '',
          "sampleFq": '',
          "sampleNum": 5,
          "scale": 2,
          "sl": '',
          "usl": '',
          "negativeTolerance": '',
          "positiveTolerance": ''
        }
      // //console.log(this.selects.prodProcessList,'生产工序站点列表')
      for(let i in this.selects.prodProcessList){
        if(this.selects.prodProcessList[i].prodProcessName==i18n.t('product.finalInspection')&&!newRow.prodStageId){
          newRow.prodStageId=this.selects.prodProcessList[i].prodProcessId;
        } 
      }

      this.$iqis.utils.tableHelper.editable.initRowData([newRow],[]);

      this.commitPqcEditorData();

      this.product.settings.qc.pqc.params.push(newRow);
      let index = this.product.settings.qc.pqc.params.length
      for(let i in this.product.settings.qc.pqc.params){
        this.product.settings.qc.pqc.params[i]['_$_row_id']=i;
      }
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((index-5)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');

      })
    },

    oqcAddParams(){
      var newRow ={
        "chkDevId": '',
        "name":'',
        "inspectionTypeId": '',
        "inspectionTypeName": '',
        "lsl": '',
        "measUnitId": '',
        "measUnitName": '',
        "no": '',
        "prodChkParamId": '',
        "prodStageId": '',
        "productId": '',
        "sampleFq": '',
        "sampleNum": 5,
        "scale": 2,
        "sl": '',
        "usl": '',
        "negativeTolerance": '',
        "positiveTolerance": ''
      };

      this.$iqis.utils.tableHelper.editable.initRowData([newRow],[]);

      this.commitOqcEditorData();

      this.product.settings.qc.oqc.params.push(newRow);
      let index = this.product.settings.qc.oqc.params.length
      for(let i in this.product.settings.qc.oqc.params){
        this.product.settings.qc.oqc.params[i]['_$_row_id']=i;
      }
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((index-5)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');

      })
    },commitOqcEditorData(){
      for(let k in this.product.settings.qc.oqc.newData){
        this.product.settings.qc.oqc.params.splice(k, 1, this.product.settings.qc.oqc.newData[k]);
      }
      this.product.settings.qc.oqc.newData = [];
    },
    cellOqcEditorEnd(val,key,index){
      // //console.log("oqc edit");
      // //console.log(this.product.settings.qc.oqc);
      //page.data[rowIndex][field] = val;
      let newRow = this.product.settings.qc.oqc.newData[index];

      if(!newRow && this.product.settings.qc.oqc.params[index]){
        newRow =  JSON.parse(JSON.stringify(this.product.settings.qc.oqc.params[index]));
      }
      if(!newRow){
        return;
      }
      var oldV = newRow[key];
      newRow[key] = val;
      this.product.settings.qc.oqc.newData[index] = newRow;

      if(oldV != val){
        newRow._updated = true;
        //this.saveRow(newRow,index);
      }
    },
    oqcParamsInspectionSelectorClose(val,key,index,o){
      if(o == null || Object.keys(o).length == 0){
        return;
      }
      // //console.log('oqcParamsInspectionSelectorClose iargs=',val,key,index,o);
      let that = this;
      this.product.settings.qc.oqc.newDatas = this.product.settings.qc.oqc.newDatas ||[];
      let newRow = this.product.settings.qc.oqc.newDatas[index];
      if(!newRow && this.product.settings.qc.oqc.params[index]){
        newRow =  JSON.parse(JSON.stringify(this.product.settings.qc.oqc.params[index]));
      }
      if(!newRow){
        return;
      }
      var oldV = newRow[key]; //old inspectionTypeId
      newRow[key] = val; //new inspectionTypeId
      newRow['inspectionTypeName'] = o.name;
      newRow['inspectionTypeId'] = o.inspectionTypeId;
      newRow['chkDevTypeId'] = o.chkDevTypeId?o.chkDevTypeId.split(','):null;
      newRow['chkDevTypeName'] = o.chkDevTypeName;
      newRow['measUnitTypeId'] = o.measUnitTypeId;
      if(this.product.settings.qc.iqc.aql.samplingPlanType===1){
        newRow['samplingPlanCode'] = o.samplingPlanCode;
        newRow['inspectionStandard'] = o.inspectionStandard;
        newRow['aql'] = o.aql;
      }else{
        newRow['samplingPlanCode'] = '-'
        newRow['inspectionStandard'] = '-'
        newRow['aql'] = '-'
      }

      let resp = this.$iqis.utils.syncget('/basic/measunitlist/'+o.measUnitTypeId);
      newRow['measUnitList'] = resp ? resp.data||[] : [];
      newRow['measUnitList'].unshift({measUnitId:null,unitSymbol:i18n.t("Unlimited")});

      newRow['chkDevList'] = []
      for(let i in newRow['chkDevTypeId']){
        let resp2 = this.$iqis.utils.syncget('/basic/chkdevlist/'+newRow['chkDevTypeId'][i]);
        newRow['chkDevList']=newRow['chkDevList'].concat(resp2 ? resp2.data||[] : []) 
      }
      newRow['chkDevList'].unshift({chkDevId:null,name:i18n.t('iqc.null')});
      // //console.log('oqcParamsInspectionSelectorClose oqc.newData=',this.product.settings.qc.oqc.newData);
      // //console.log('oqcParamsInspectionSelectorClose oqc.params=',this.product.settings.qc.oqc.params);
      this.product.settings.qc.oqc.newDatas[index] = newRow;
      this.$set(this.product.settings.qc.oqc.params, index, newRow);
    },
    oqcParamsMeasUnitSelectorChange(val, fieldName, rowIndex){
      let rowData = this.product.settings.qc.oqc.params[rowIndex];
      rowData[fieldName] = val;
    },
    deleteOqcParams(){
      let selection = this.$refs.oqcParamTable.getSelection();
      // //console.log(selection);
      let rowIdArr = [];
      for(let i=0;i<selection.length;i++){
        rowIdArr.push(selection[i]._$_row_id);
      }

      // //console.log(rowIdArr);

      this.commitOqcEditorData();
      let deleteRows = [];
      for(let i=0;i<rowIdArr.length;i++){
        for(let j=0;j<this.product.settings.qc.oqc.params.length;j++){
          if(this.product.settings.qc.oqc.params[j]._$_row_id == rowIdArr[i]){
            deleteRows.push(this.product.settings.qc.oqc.params[j]);
          }
        }
      }
      for(let i=0;i<deleteRows.length;i++){
        let item = deleteRows[i];
        let itemIndex = this.product.settings.qc.oqc.params.indexOf(item);
        if(itemIndex >=0){
          this.product.settings.qc.oqc.params.splice(itemIndex,1);
        }
      }

      this.table.oqc.params.selected = [];

    },
    productTreeSelectRender(labels,nodes){
      //render-format
      if(!labels || labels.length == 0){
        return '-';
      }
      let result = labels[labels.length-1];

      if( (this.selects.prodTypes.length > 0  && result == this.selects.prodTypes[0].label)){
        return '-'
      }

      return result;
      //"[{{item.prodTypeCode}}]{{ item.name }}"
    },
    loadSelectsData(callback){
      let that = this;
      that.loadStat.selectsDataLoading = true;
      this.$http.all([
        this.$http.get("/basic/prodtype",{params:{limit:99999999}}),
        this.$http.get("/basic/produnit",{params:{limit:999999999}}),
        this.$http.get("/rule-LENIENT_TRANSFER",{params:{limit:999999999}}),
        this.$http.get("/basic/inspectiontype",{params:{limit:99999999}}),
        this.$http.get("/basic/measunit",{params:{limit:99999999}}),
        this.$http.get("/basic/prod-task",{params:{limit:99999999}}),
        this.$http.get("/basic/chkdev",{params:{limit:99999999}})
      ]).then(function(resps){
        that.loadStat.selectsDataLoading = false;
        if(resps[0]){
          let resp = resps[0];
          let root = {title:i18n.t('product.prodType'),selected: false,label:i18n.t('product.prodType'),value:0,expand:true};
          if(resp.data){
            that.$iqis.utils.treeify(resp.data,root,"prodTypeId",function(item){
              // return "["+item.prodTypeCode+"]"+item.name;
              return item.name;
            },"parentId");
          }
          that.selects.prodTypes = [root];
        }

        if(resps[1]){
          let resp = resps[1];
          that.selects.prodUnits = resp.data;
        }
/////////////////////
        if(resps[2]){
          let resp = resps[2];
          let index = -1;
          that.selects.transRules = resp.data;
          for(let i = 0;i<resp.data.length;i++){
            if(resp.data[i].isDefault === 1){
              index = i;
              break;
            }
          }
          if(index != -1){
            that.product.settings.qc.iqc.aql.transRuleId = resp.data[index].ruleId
            that.product.settings.qc.pqc.aql.transRuleId = resp.data[index].ruleId
            that.product.settings.qc.oqc.aql.transRuleId = resp.data[index].ruleId
          }
        }
/////////////////////
        if(resps[3]){
          let resp = resps[3];
          let root = {title:i18n.t('product.projectType'),selected: false,label:i18n.t('product.projectType'),value:0,expand:true};
          that.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
          that.selects.inspectionTypes = [root];
        }
/////////////////////
        if(resps[4]){
          let resp = resps[4];
          that.mea = resp.data
          that.selects.measureUnits = resp.data;
          // //console.log(resp.data);
          // //console.log(that.selects.measureUnits,'全部测量单位')
        }
        /////////////////////prodFlows
        if(resps[5]){
          let resp = resps[5];
          that.selects.prodFlows = resp.data;
          for(let i in that.selects.prodFlows){
            if(that.selects.prodFlows[i].prodTaskName==i18n.t('product.commonProcess')&&!that.product.settings.qc.pqc.aql.prodFlowId){
              that.product.settings.qc.pqc.aql.prodFlowId=that.selects.prodFlows[i].prodTaskId;
            }
          }
        }       /////////////////////prodFlows
        if(resps[6]){
          let resp = resps[6];
          that.selects.equipment = resp.data;
        }


        callback && callback();
      })
      ///

      ///

    },
    // 保存
    save(){
      let that = this;
      // //console.log(that.product.settings.qc,'三个检验的数据------------')
      // console.log(that.$refs.xTable_iqc_params.getRecords(),'getRecords');
      console.log(that.product.settings.qc.iqc.params,'params');
      
      // return;
      //如果生产流程被删除则清空值
      let prodFlows=[]
      for(let i in that.selects.prodFlows){
        prodFlows.push(that.selects.prodFlows[i].prodTaskId)
      }
      if(prodFlows.indexOf(that.product.settings.qc.pqc.aql.prodFlowId)==-1){
        that.product.settings.qc.pqc.aql.prodFlowId=null;
      }

      that.loadStat.saveLoading = false;
      that.commitIqcEditorData();
      // that.commitIqcEditorDatas();
      that.commitOqcEditorData();
      that.commitPqcEditorData();
      // //console.log(that.product.settings.qc.pqc.aql,)
      let params = [
        {type:'Empty',title:i18n.t('product.createTime'),value:that.product.updateTime},
        {type:'Empty',title:i18n.t('product.productNo'),value:that.product.no},
        {type:'No',title:i18n.t('product.productNo'),value:that.product.no},
        // {type:'Empty',title:i18n.t('product.productName'),value:that.product.name},
        // {type:'Name',title:i18n.t('product.productName'),value:that.product.name},
        {type:'Empty',title:i18n.t('product.productSpec'),value:that.product.spec},
        {type:'Word600',title:i18n.t('product.productSpec'),value:that.product.spec},
        // {type:'EmptyLength2',title:i18n.t('product.prodType'),value:that.product.productTypeValue},
        {type:'Empty',title:i18n.t('product.productUnit'),value:that.product.prodUnitId},
        // {type:'Empty',title:i18n.t('product.version'),value:that.product.userVersion},
        {type:'No',title:i18n.t('product.version'),value:that.product.userVersion},
      ]
      if(that.product.productTypeValue.lnegth < 1){
        that.$Notice.warning({title: i18n.t('product.prodType')});
      }
      if(that.product.settings.qc.iqc.aql.useState&&that.product.settings.qc.pqc.aql.samplingPlanType===0&&that.product.settings.qc.iqc.aql.samplingPlanCode!='full'){
        params.push({type:'Empty',title:i18n.t('product.incoming')+i18n.t('product.inspectionStandard'),value:that.product.settings.qc.iqc.aql.inspectionStandard})
      }
      if(that.product.settings.qc.pqc.aql.useState&&that.product.settings.qc.pqc.aql.samplingPlanType===0){
        if(that.product.settings.qc.pqc.aql.samplingPlanCode!='full'){
          params.push({type:'Empty',title:i18n.t('product.process')+i18n.t('product.inspectionStandard'),value:that.product.settings.qc.pqc.aql.inspectionStandard})
        }
        params.push({type:'Empty',title:i18n.t('product.process')+i18n.t('product.prodFlow'),value:that.product.settings.qc.pqc.aql.prodFlowId})
        params.push({type:'Empty',title:i18n.t('product.process')+i18n.t('product.fpyTarget'),value:that.product.settings.qc.pqc.aql.targetRty})
        params.push({type:'Num',title:i18n.t('product.process')+i18n.t('product.fpyTarget'),value:that.product.settings.qc.pqc.aql.targetRty})
      }
      if(that.product.settings.qc.oqc.aql.useState&&that.product.settings.qc.pqc.aql.samplingPlanType===0&&that.product.settings.qc.oqc.aql.samplingPlanCode!='full'){
        params.push({type:'Empty',title:i18n.t('product.outgoing')+i18n.t('product.inspectionStandard'),value:that.product.settings.qc.oqc.aql.inspectionStandard})
      }
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
      if(that.product.settings.qc.iqc.aql.useState){
        for(let i in that.product.settings.qc.iqc.params){
          if(
            that.product.settings.qc.iqc.params[i].inspectionTypeId===''||
            that.product.settings.qc.iqc.params[i].measUnitId===''||
            // that.product.settings.qc.iqc.params[i].usl===''||
            // that.product.settings.qc.iqc.params[i].sl===''||
            // that.product.settings.qc.iqc.params[i].lsl===''||
            that.product.settings.qc.iqc.params[i].sampleNum===''||
            // that.product.settings.qc.iqc.params[i].positiveTolerance===''||
            // that.product.settings.qc.iqc.params[i].negativeTolerance===''||
            that.product.settings.qc.iqc.params[i].scale===''
          ){
            i++
            that.$Notice.warning({title:i18n.t('product.pleaseInput')+i18n.t('product.incoming')+i18n.t('product.setParams')+'<第'+i+'行>'})
            return;
          }
          let paramsIqc = [
            // {type:'NumAll',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-USL',value:that.product.settings.qc.iqc.params[i].usl},
            // {type:'NumAll',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-SL',value:that.product.settings.qc.iqc.params[i].sl},
            // {type:'NumAll',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-LSL',value:that.product.settings.qc.iqc.params[i].lsl},
            {type:'Num1_10',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-'+i18n.t('product.sampleNum'),value:that.product.settings.qc.iqc.params[i].sampleNum},
            // {type:'NumAll',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-'+i18n.t('product.positiveTolerance'),value:that.product.settings.qc.iqc.params[i].positiveTolerance},
            // {type:'NumAll',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-'+i18n.t('product.negativeTolerance'),value:that.product.settings.qc.iqc.params[i].negativeTolerance},
            {type:'Num0_5',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-'+i18n.t('product.scale'),value:that.product.settings.qc.iqc.params[i].scale},
          ]
          let state1 = true;
          for(let j in paramsIqc){
            state1 = that.$iqis.utils.formValidate(paramsIqc[j].type,paramsIqc[j].title,paramsIqc[j].value,(tips)=>{
              that.$Notice.warning({title:tips})//,duration: 0
            })
            if(!state1){
              return;
              break;
            }
          }
        }
      }if(that.product.settings.qc.pqc.aql.useState){
        for(let i in that.product.settings.qc.pqc.params){
          if(
            that.product.settings.qc.pqc.params[i].prodStageId===''||
            that.product.settings.qc.pqc.params[i].inspectionTypeId===''||
            that.product.settings.qc.pqc.params[i].measUnitId===''||
            // that.product.settings.qc.pqc.params[i].usl===''||
            // that.product.settings.qc.pqc.params[i].sl===''||
            // that.product.settings.qc.pqc.params[i].lsl===''||
            that.product.settings.qc.pqc.params[i].sampleNum===''||
            // that.product.settings.qc.pqc.params[i].sampleFq===''||
            // that.product.settings.qc.pqc.params[i].positiveTolerance===''||
            // that.product.settings.qc.pqc.params[i].negativeTolerance===''||
            that.product.settings.qc.pqc.params[i].scale===''
          ){
            i++
            that.$Notice.warning({title:i18n.t('product.pleaseInput')+i18n.t('product.process')+i18n.t('product.setParams')+'<第'+i+'行>'})
            return;
          }
          let paramsPqc = [
            // {type:'NumAll',title:i18n.t('product.process')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-USL',value:that.product.settings.qc.pqc.params[i].usl},
            // {type:'NumAll',title:i18n.t('product.process')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-SL',value:that.product.settings.qc.pqc.params[i].sl},
            // {type:'NumAll',title:i18n.t('product.process')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-LSL',value:that.product.settings.qc.pqc.params[i].lsl},
            {type:'Num1_10',title:i18n.t('product.process')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-'+i18n.t('product.sampleNum'),value:that.product.settings.qc.pqc.params[i].sampleNum},
            // {type:'Num',title:i18n.t('product.process')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-'+i18n.t('product.sampleFq'),value:that.product.settings.qc.pqc.params[i].sampleFq},
            // {type:'NumAll',title:i18n.t('product.process')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-'+i18n.t('product.positiveTolerance'),value:that.product.settings.qc.pqc.params[i].positiveTolerance},
            // {type:'NumAll',title:i18n.t('product.process')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-'+i18n.t('product.negativeTolerance'),value:that.product.settings.qc.pqc.params[i].negativeTolerance},
            {type:'Num0_5',title:i18n.t('product.process')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-'+i18n.t('product.scale'),value:that.product.settings.qc.pqc.params[i].scale},
          ]
          let state2 = true;
          for(let j in paramsPqc){
            state2 = that.$iqis.utils.formValidate(paramsPqc[j].type,paramsPqc[j].title,paramsPqc[j].value,(tips)=>{
              that.$Notice.warning({title:tips})//,duration: 0
            })
            if(!state2){
              return;
              break;
            }
          }
        }
      }if(that.product.settings.qc.oqc.aql.useState){
        for(let i in that.product.settings.qc.oqc.params){
          if(
            that.product.settings.qc.oqc.params[i].inspectionTypeId===''||
            that.product.settings.qc.oqc.params[i].measUnitId===''||
            // that.product.settings.qc.oqc.params[i].usl===''||
            // that.product.settings.qc.oqc.params[i].sl===''||
            // that.product.settings.qc.oqc.params[i].lsl===''||
            that.product.settings.qc.oqc.params[i].sampleNum===''||
            // that.product.settings.qc.oqc.params[i].positiveTolerance===''||
            // that.product.settings.qc.oqc.params[i].negativeTolerance===''||
            that.product.settings.qc.oqc.params[i].scale===''
          ){
            i++
            that.$Notice.warning({title:i18n.t('product.pleaseInput')+i18n.t('product.outgoing')+i18n.t('product.setParams')+'<第'+i+'行>'})
            return;
          }
          let paramsOqc = [
            // {type:'NumAll',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-USL',value:that.product.settings.qc.oqc.params[i].usl},
            // {type:'NumAll',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-SL',value:that.product.settings.qc.oqc.params[i].sl},
            // {type:'NumAll',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-LSL',value:that.product.settings.qc.oqc.params[i].lsl},
            {type:'Num1_10',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-'+i18n.t('product.sampleNum'),value:that.product.settings.qc.oqc.params[i].sampleNum},
            // {type:'NumAll',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-'+i18n.t('product.positiveTolerance'),value:that.product.settings.qc.oqc.params[i].positiveTolerance},
            // {type:'NumAll',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-'+i18n.t('product.negativeTolerance'),value:that.product.settings.qc.oqc.params[i].negativeTolerance},
            {type:'Num0_5',title:i18n.t('product.incoming')+i18n.t('product.setParams')+(Number(i)+Number(1))+'-'+i18n.t('product.scale'),value:that.product.settings.qc.oqc.params[i].scale},
          ]
          let state3 = true;
          for(let j in paramsOqc){
            state3 = that.$iqis.utils.formValidate(paramsOqc[j].type,paramsOqc[j].title,paramsOqc[j].value,(tips)=>{
              that.$Notice.warning({title:tips})//,duration: 0
            })
            if(!state3){
              return;
              break;
            }
          }
        }
      }
      if(!that.product.settings.qc.iqc.aql.useState){
        that.product.settings.qc.iqc.params=[]
      }
      if(!that.product.settings.qc.pqc.aql.useState){
        that.product.settings.qc.pqc.params=[]
      }
      if(!that.product.settings.qc.oqc.aql.useState){
        that.product.settings.qc.oqc.params=[]
      }
      console.log("=====>before",this.product)
      let productObj = this.$iqis.utils.clone(this.product);
      console.log("=====>after",productObj)

      console.log("=====>length before: "+ this.product.settings.qc.oqc.params.length)
      console.log("=====>length after: "+productObj.settings.qc.oqc.params.length)


      let prodTypeId = null;
      if(productObj.productTypeValue && productObj.productTypeValue.length > 0){
        prodTypeId = productObj.productTypeValue[productObj.productTypeValue.length-1];
      }
      productObj.prodTypeId = prodTypeId;
      if(!productObj.productId){//如果是添加，则类别跳转到最新分类
        that.prodTypeId = productObj.prodTypeId;
      }

      if(productObj.settings.qc.iqc.aql){
        productObj.settings.qc.iqc.aql.useState=productObj.settings.qc.iqc.aql.useState?1:0;
      }
      if(productObj.settings.qc.pqc.aql){
        productObj.settings.qc.pqc.aql.useState=productObj.settings.qc.pqc.aql.useState?1:0;
      }
      if(productObj.settings.qc.oqc.aql){
        productObj.settings.qc.oqc.aql.useState=productObj.settings.qc.oqc.aql.useState?1:0;
      }
      if(productObj.settings.qc.iqc.params){
        
        for(let i in productObj.settings.qc.iqc.params){
          let item = productObj.settings.qc.iqc.params[i]
          if(item.chkDevTypeId){
            item.chkDevTypeId=item.chkDevTypeId.toString()
          }
          item.inspectionTypeId = item.inspectionTypeId[item.inspectionTypeId.length-1]
        }
      }
      if(productObj.settings.qc.pqc.params){
        for(let i in productObj.settings.qc.pqc.params){
          let item = productObj.settings.qc.pqc.params[i]
          if(item.chkDevTypeId){
            item.chkDevTypeId=item.chkDevTypeId.toString()
          }
          item.inspectionTypeId = item.inspectionTypeId[item.inspectionTypeId.length-1]
        }
      }
      if(productObj.settings.qc.oqc.params){
        for(let i in productObj.settings.qc.oqc.params){
          let item = productObj.settings.qc.oqc.params[i]
          if(item.chkDevTypeId){
            item.chkDevTypeId=item.chkDevTypeId.toString()
          }
          item.inspectionTypeId = item.inspectionTypeId[item.inspectionTypeId.length-1]
        }
      }

      if(productObj.settings.qc.iqc.property){
        
        for(let i in productObj.settings.qc.iqc.property){
          let item = productObj.settings.qc.iqc.property[i]
          if(item.propertyId){
            item.propertyId=null
          }
        }
      }
      if(productObj.settings.qc.pqc.property){
        for(let i in productObj.settings.qc.pqc.property){
          let item = productObj.settings.qc.pqc.property[i]
          if(item.propertyId){
            item.propertyId=null
          }
        }
      }
      if(productObj.settings.qc.oqc.property){
        for(let i in productObj.settings.qc.oqc.property){
          let item = productObj.settings.qc.oqc.property[i]
          if(item.propertyId){
            item.propertyId=null
          }
        }
      }
      productObj.updateTime = this.product?this.product.updateTime.getTime():(new Date()).getTime();
      if(that.copy=='copy'){
        productObj.productId=null;
      }
      // //console.log(productObj);
      let file = this.$refs.upload.myUploadList
      let arr = [];
      for(var i = 0;i<file.length;i++){
        let fileObj = {'url':file[i].url,'type':file[i].url.substring(file[i].url.lastIndexOf(".")+1,file[i].url.length),'name':file[i].url.substring(file[i].url.lastIndexOf("/")+1,file[i].url.length)}
        arr.push(fileObj)
      }
      productObj.settings.ext=arr
      that.spinShow=false;
      // //console.log(productObj,1)
      if(productObj.productId){
        that.$http.put("/basic/product",productObj,{"headers":{"Content-Type":"application/json; charset=UTF-8"}}).then(function (resp) {
          // that.product = resp.data
          /* thata.product.settings.qc.iqc.property = resp.data.settings.qc.iqc.property
          thata.product.settings.qc.pqc.property = resp.data.settings.qc.pqc.property
          thata.product.settings.qc.oqc.property = resp.data.settings.qc.oqc.property */
          that.$Message.success(i18n.t('product.editSuccess'));
          // //console.log(productObj,77689);
          that.loadStat.saveLoading = false;
          that.refreshData();
        }).catch(function(error){
          // //console.log(error)
          that.loadStat.saveLoading = false;
          that.spinShow=true;
        })
      }else{
        console.log(productObj,'productObj============');
        
        that.$http.post("/basic/product",productObj,{"headers":{"Content-Type":"application/json; charset=UTF-8"}})
        .then(function (resp) {
          // //console.log(resp.data.productId);
          that.$Message.success(i18n.t('product.saveSuccess'));
          that.loadStat.saveLoading = false;
          that.closePage();
          that.$emit("open-tab","product-list-update-"+resp.data.productId,i18n.t('product.editProduct'),"page-product-add",{productId:resp.data.productId});
          
          that.refreshData();
        }).catch(function(error){
          // //console.log(error)
          that.loadStat.saveLoading = false;
          that.spinShow=true;
        })
      }

    },
    // 取消保存
    closePage(){
      let that = this;
      that.$emit("close-tab",that.$props.tabKey);
      that.$emit("close-tab",'product-list');
      that.$emit("open-tab",'product-list',i18n.t('product.productLibrary'),'page-product-list',{prodTypeId:that.prodTypeId});
    },



  }//end methods

}
</script>
<style>
.productAdd .iqis-upload-list{
  display: block!important;
}
</style>
