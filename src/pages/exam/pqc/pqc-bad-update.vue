<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t("pqc.bi")}}
      </div>
      <div class="iqis-page-block-body">
        <Row style="margin-top:10px;">
          <i-col span="24">
            <RadioGroup v-model="createBatchNo" @on-change="changeCreateBatchNo()">
              <Radio :disabled="createBatchNoDis" :label="1">{{$t('pqc.npbn')}}</Radio>
              <Radio :disabled="createBatchNoDis" :label="0">{{$t('pqc.selectBatch')}}</Radio>
            </RadioGroup> 
          </i-col>
        </Row>
        <Row type="flex" :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.ln")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-show="createBatchNo===1" v-model="prodBatch.batchNo" :disabled='noPermsDis' style="width: 100%;"></i-input>
              <Select v-show="createBatchNo===0" :disabled="noPermsDis" v-model="prodBatch.prodBatchId" filterable :placeholder="i18n.t('pleaseChoose')" @on-change="initBasic(prodBatch.prodBatchId)">
                <Option v-for="items in ruleForm.batchList" :value="items.prodBatchId" :key="items.prodBatchId">{{items.batchNo}}
                </Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.bn")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model.trim="prodBatch.batchQuantity" :disabled="createBatchNo===0||noPermsDis" style="width: 100%">
                <span slot="append">{{prodBatch.prodUnitName}}</span>
              </i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.pt")}}</div>
            <div class="iqis-page-block-ctrl">
              <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" v-model="prodBatch.date" style="width: 100%"></Date-picker>
            </div>
          </i-col>
          <i-col span="6">
            <!-- <div class="iqis-page-block-label"></div>
            <div class="iqis-page-block-ctrl" style="margin-top: 28px" v-if="prodBatch.prodBatchId!=''">
                {{prodBatch.productionState?i18n.t("pqc.cp"):i18n.t("pqc.up")}}
            </div> -->
            <div class="iqis-page-block-label">{{$t("pqc.ac")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="createBatchNo===0" v-model="prodBatch.customerId" filterable :placeholder="i18n.t('pqc.pleaseChoose')">
		            <Option v-for="(items,index) in ruleForm.customerList" :value="items.customerId" :key="index">{{items.customerAbbreviation}}</Option>
		          </Select>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.pn")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :label="prodBatch.productNo" filterable remote :remote-method="remoteMethod" :loading="loadingRemote" v-model="prodBatch.productId" :placeholder="i18n.t('pqc.pleaseChoose')" filterable @on-change="selectOn(prodBatch.productId,1)">
                <Option v-for="(items,index) in productList" :value="items.productId" :label="items.no" :key="index">{{ items.no}}/{{ items.name}}
                </Option>
              </Select>
              <!-- <i-input v-model="prodBatch.productNo" disabled></i-input> -->
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.name")}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <Select v-model="prodBatch.productId" :placeholder="i18n.t('pqc.pleaseChoose')" disabled>
                <Option v-for="(items,index) in ruleForm.productNames" :value="items.productId" :label="items.name" :key="index">{{ items.name}}
                </Option>
              </Select> -->
              <i-input v-model="prodBatch.productName" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.specifications")}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <Select v-model="prodBatch.productId" :placeholder="i18n.t('pqc.pleaseChoose')" disabled>
                <Option v-for="(items,index) in ruleForm.productSpec" :value="items.productId" :label="items.spec" :key="index">{{ items.spec}}
                </Option>
              </Select> -->
              <i-input v-model="prodBatch.productSpec" disabled></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.pc")}}</div>
            <div class="iqis-page-block-ctrl">
              <!-- <Select v-model="prodBatch.prodTypeId" :placeholder="i18n.t('pqc.pleaseChoose')" disabled>
                <Option v-for="(items,index) in ruleForm.productTypeName" :value="items.prodTypeId" :key="index">
                  {{ items.name}}
                </Option>
              </Select> -->
              <i-input v-model="prodBatch.prodTypeName" disabled></i-input>
            </div>
          </i-col>
        </Row>
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label">{{$t("pqc.br")}}</div>
          </div>
          <div class="iqis-page-block-tools-second">
            <!--<span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">已选择 {{table.bad.selected.length}} 项参数设置</span>-->
            <!-- <Button type="ghost" icon="plus" @click="addPqcBad();title=false;" :disabled="!prodBatch.prodBatchId||noPermsDis">添加</Button> -->
            <Button type="ghost" icon="edit" @click="editSelectRow();title=true;" :disabled="!ruleForm.selected||noPermsDis">{{$t("pqc.modify")}}</Button>
            <Poptip confirm
              :title="i18n.t('pqc.dsi')"
              :ok-text='i18n.t("pqc.confirm")'
              :cancel-text='i18n.t("pqc.cancel")'
              placement="bottom-end"
               @on-ok="deleteTableSelected">
              <Button type="ghost" icon="trash-a" :disabled="!ruleForm.selected||noPermsDis">{{$t("pqc.delete")}}</Button>
            </Poptip>
          </div>
        </div>
        <div class="iqis-page-block-table">
          <!-- 不良记录 -->
          <Table ref="badTable" class='initColor noHeight' @on-selection-change="pqcBadTableSelectChange" :no-data-text="i18n.t('pqc.noData')" border stripe :loading="table.bad.loading" :columns="table.bad.columns" :data="bads">
              <Button :disabled="noPermsDis"  @click="addPqcBad();title=false;" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t("pqc.abr")}}</Button>

          </Table>
        </div>

        <Row type="flex" :gutter="24" style='margin-top:20px'>
          <i-col span="5">
            <div class="hoverClassThree">
            <div class="iqis-page-block-label">{{$t("pqc.qp")}}</div>
            <div class="iqis-page-block-ctrl"  style='color:#5C5C5C;font-size:18px'>
              <span style="margin-right:30px" v-if="prodBatch.productId!=''">  {{ruleForm.allProduction?ruleForm.allProduction:'0'}}&nbsp;</span>{{prodBatch.prodUnitName}}

            </div>
            </div>
          </i-col>
          <i-col span="5">
            <div class="hoverClassThree">
            <div class="iqis-page-block-label">{{$t("pqc.badQuantity")}}</div>
            <div class="iqis-page-block-ctrl" style='color:#5C5C5C;font-size:18px'>
              <span style="margin-right:30px" v-if="prodBatch.productId!=''"> {{ruleForm.allproRejects?ruleForm.allproRejects:'0'}}&nbsp;</span>{{prodBatch.prodUnitName}}

            </div>
            </div>
          </i-col>
          <i-col span="5">
            <div class="hoverClassThree">
            <div class="iqis-page-block-label">{{$t("pqc.dr")}}</div>
            <div class="iqis-page-block-ctrl"  style='color:#5C5C5C;font-size:18px'>
              <span>
                <!-- {{(Math.round((((ruleForm.allProduction - ruleForm.allproRejects) / ruleForm.allProduction) * 100) * 100) / 100)}}% -->
                {{this.$iqis.utils.getTwoDecimal((1-ruleForm.allproRejects / ruleForm.allProduction) * 100) >=0 ? this.$iqis.utils.getTwoDecimal((1-ruleForm.allproRejects / ruleForm.allProduction) * 100) : 0}}%
              </span> &nbsp;
            </div>
            </div>
          </i-col>
          <i-col span="9">

          </i-col>
        </Row>

        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label">{{$t("pqc.defectRecord")}}</div>
          </div>
          <div class="iqis-page-block-tools-second">
            <!--<span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">已选择 {{table.bad.selected.length}} 项参数设置</span>-->
            <Button type="ghost" icon="search" @click="seeAll" :disabled="allList.length == 0">{{$t("pqc.cad")}}</Button>

          </div>
        </div>
        <div class="iqis-page-block-table" ref="maodian" id='MSd'>
          <Table class='initColor noHeight' v-drag-table-column="table.defect.columns" ref="defectTable" :no-data-text="i18n.t('pqc.noData')" @on-selection-change="pqcDefectTableSelectChange" border stripe :loading="table.defect.loading" :columns="table.defect.columns" :data="totalDefect">
          </Table>
        </div>

        <div class="pqc-defect-report-body" style='padding-top:40px' >
         <div style="height:20px;font-size:20px;font-family:MicrosoftYaHei;color:rgba(38,38,38,1);line-height:20px;margin-bottom:20px"><span> {{$t("pqc.dnpd")}}</span> <span></span> </div>
          <div style="width:100%;margin-bottom: 24px;" ref="defectEchart"></div>
        </div>
        <div class="page-end" style="padding-bottom: 65px"></div>
      </div>
      <!--end body-->
    </div>
    <div class="arrangement-dialog">
      <Modal :title="title?i18n.t('pqc.mbr'):i18n.t('pqc.abr')" v-model="ruleForm.state" class="rankBox" :mask-closable="false" width="1024">
        <Row type="flex" :gutter="40">

          <i-col span="6">{{$t("pqc.time")}}</i-col>
          <i-col span="6">{{$t("pqc.inspector")}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
          <i-col span="6">
            <Date-picker type="datetime" format="yyyy-MM-dd HH:mm" v-model="ruleForm.item.date"></Date-picker>
          </i-col>
          <i-col span="6">
            <Select v-model="ruleForm.item.createUserId" filterable :placeholder="i18n.t('pqc.pe')">
              <Option v-for="items in ruleForm.userList" :value="items.userId" :label="items.name" :key="items.userId">
                {{ items.name}}
              </Option>
            </Select>
          </i-col>
        </Row>
        <Row type="flex" :gutter="40" style="margin-top:20px">
          <i-col span="6">{{$t("pqc.pl")}}</i-col>
          <i-col span="6">{{$t("pqc.pps")}}</i-col>
          <i-col span="6">{{$t("pqc.qp")}}</i-col>
          <i-col span="6">{{$t("pqc.badNumber")}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
          <i-col span="6">
            <Select v-model="ruleForm.item.prodLineId" filterable :placeholder="i18n.t('pqc.pe')">
              <Option v-for="items in ruleForm.lineList" :value="items.prodLineId" :label="items.name" :key="items.prodLineId">{{ items.name}}
              </Option>
            </Select>
          </i-col>
          <i-col span="6">
            <Select v-model="ruleForm.item.prodProcessId" filterable :placeholder="i18n.t('pqc.pe')">
              <Option v-for="items in ruleForm.processList" :value="items.prodProcessId" :label="items.prodProcessName" :key="items.prodProcessId">{{ items.prodProcessName}}
              </Option>
            </Select>
          </i-col>
          <i-col span="6">
            <i-input v-model.trim="ruleForm.item.prodQuantity" :placeholder="i18n.t('pqc.pe')" style="width: 100%" on-blur="oNbBlur"></i-input>
          </i-col>
          <i-col span="6">
            <i-input v-model.trim="ruleForm.item.badQuantity" :placeholder="i18n.t('pqc.pe')" style="width: 100%" on-blur="oNbBlur"></i-input>
          </i-col>
        </Row>
        <Row :gutter="25" class="ss">
          <i-col span="24">
            <div class="iqis-page-block-label"></div>
            <div class="iqis-page-block-label"></div>
            <div class="iqis-page-block-ctrl">
              <div style="display:inline" v-if="sub1">
                <Button  type="primary" icon="person-stalker" @click="changeLabel()">{{$t('pqc.AddStaff')}}</Button>
              </div>
              <div style="display:inline">
                <Select :placeholder="i18n.t('pqc.pleaseChoose')" v-if="sub2" v-model="team" filterable style="width:216.75px" @on-change="selectTeam(team)">
                  <Option v-for="item in ruleForm.userList" :key="item.userId" :value="item">{{item.name}}</Option>
                </Select>
                <Tag closable v-for="(item,index) in members" type="dot" color="blue" :key="index" :name="index"  @on-close="deleteMember(item)">{{item.memberName}}</Tag>
              </div>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="40" style="margin-top:30px">
          <i-col span="24">{{$t("pqc.defectRecord")}}</i-col>
        </Row>
        <Row type="flex" :gutter="5" style="margin-top:30px">
          <i-col span="24">
            <Table class='noBorder noHeight location' v-drag-table-column="ruleForm.tableColumns" ref="ruleFormTable" border stripe :loading="table.defect.loading" :columns="ruleForm.tableColumns" :data="discountData.rows">
              <Button @click="addNewData" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t("pqc.addDefect")}}
              </Button>
            </Table>
          </i-col>
        </Row>
        <div slot="footer">
          <Button type="primary" size="large" @click="ModalOk">{{$t("pqc.confirm")}}</Button>
          <Button type="text" size="large" @click="ruleForm.state=false">{{$t("pqc.cancel")}}</Button>
        </div>
      </Modal>
    </div>
    <Modal
        v-model="closeModal"
        :title="i18n.t('pqc.tips')"
       >
        <!-- <Alert type="warning" show-icon>
            <template slot="desc"> -->
             <!-- 关闭将不保存刚刚录入的数据，是否确定关闭 -->
             {{$t("pqc.cwn")}}
            <!-- </template>
        </Alert> -->
        <div slot="footer">
          <Button type="primary" size="large" @click="closePage">{{$t("pqc.confirm")}}</Button>
          <Button type="text" size="large" @click="closeModal=false">{{$t("pqc.cancel")}}</Button>
        </div>
    </Modal>
    <Modal v-model="lookpicture" :title="i18n.t('pqc.vti')">
        <div class="lookPictureBody">
          <div class='lookitem' v-for="(item,index) in pictureList">
            <img :src="item.url" alt="" style='width:100%;height:100%'>
            <div class="bigIMG">
              <img :src="item.url">
            </div>
          </div> 
        </div>
        <div slot="footer">
          <Button type="text" size="large" @click=" lookpicture=false;">{{$t("pqc.cancel")}}</Button>
        </div>
    </Modal>
    <Modal v-model="bigPicture" :title="i18n.t('pqc.vti')">
        <img :src="bigPictures" alt="" style='width:100%;height:100%'>
        <div slot="footer">
          <Button type="text" size="large" @click=" bigPicture=false;">{{$t("pqc.cancel")}}</Button>
        </div>
    </Modal>
    <IqisAffix placement="bottom" :offset="0">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" v-if="!noPermsDis" @click="save">{{$t("pqc.save")}}</Button>
        <Button type="ghost" @click="showCloseModal">{{$t("pqc.cancel")}}</Button>
      </div>
    </IqisAffix>
  </div>
</template>
<script>
import ICol from 'iview/src/components/grid/col'
import $ from 'jquery';
import echarts from 'echarts'
import SessionStorage from '@/utils/sessionStorage'
import reportConfig from '../../statistic/statisticConfig.js';
export default {
  components: { ICol },
  props: ['params', 'tabKey'],
  data() {
    let vm = this
    return {
      nums:0,
      badRecordLists:[],
      sub1:true,
      sub2:false,
      team:"",
      batchList:[],
      productList:[],
      loadingRemote:false,
      source:null,
      createBatchNo:1,
      createBatchNoDis:false,
      newDate:new Date().getFullYear().toString()+(new Date().getMonth()+1).toString()+new Date().getDate().toString(),
      i18n:window.i18n,
      locale : 'zh_CN',
      lookpicture:false,
      pictureList:[],
      title:false,
      closeModal:false,
      myChart:null,
      propsParams:'',
      eCahrtsData:[],
      allList: [],
      members:[],
      memberIds:[],
      // memberList:[],
      selects:{
        inspectionTypes:[]
      },
      headers: {
        headers: { 'Content-Type': 'application/json; charset=UTF-8' }
      },
      bigPicture:false,
      bigPictures:'',
      prodBatch: {
        directRateId: '',
        prodBatchId: '',
        customerId:'',
        productionState: false,
        prodTypeId: '',
        productId: '',
        productNo: '',
        productName: '',
        productSpec: '',
        prodTypeName: '',
        productTypeId: '',
        DefectNameList: [],
        DefectGradeList: [],
        DefectLocList: []
      },
      discountData: {
        rows: [
          {
            defectTypeId: '',
            qltyLvId: '',
            inspectionTypeId: '',
            defectLocId: '',
            defectNumber: '',
            extInfoList:[]
          }
        ],
        tableData: {
          defectTypeId: '',
          qltyLvId: '',
          inspectionTypeId: '',
          defectLocId: '',
          defectNumber: '',
          extInfoList:[]
        }
      },
      prodLines: [],
      prodProcessList: [],
      ruleForm: {
        batchNo:new Date().getFullYear().toString()+(new Date().getMonth()+1).toString()+new Date().getDate().toString(),
        state: false,
        selected: false,
        tableID: 0,
        selectCategory: '', //获取选择类别
        item: {
          memberList:[]
        },
        userId: '',
        ProductData: {
          name: []
        },
        customerList:[],
        productON: [],
        userList: [],
        lineList: [],
        processList: [],
        batchList: [],
        productNames: [],
        productSpec: [],
        productTypeName: [],
        DefectsMap: [],
        dataDefects: [],
        deleteTable: [],
        mapData: [],
        tableColumns: [
          {
            type: 'index',
            width: this.$store.state.locale=='zh_CN'?40:70,
            align: 'center',
            title: i18n.t("pqc.number")
          },
          //            {
          //              key: 'defectName',
          //              align: 'center',
          //              title: '缺陷名称',
          //              render: (h, params) => {
          //                var me = this
          //                return h('div', [h('Input',
          //                  {
          //                    props: {
          //                      type: 'text',
          //                      value: me.discountData.rows[params.index].defectName,
          //                    },
          //                    on: {
          //                      'on-blur': (event) => {
          //                        this.discountData.rows[params.index].defectName = event.target.value
          //                      }
          //                    }
          //                  })
          //                ])
          //              }
          //            },
          {
            title: i18n.t("pqc.inspection"),
            width:103,
            align: 'center',
            ellipsis:true,
            minWidth: 103,
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
                this.getDefectNameList,
              )
              return ret(h,params);
            }
          },
          {
            key: 'defectTypeId',
            width: 130,
            align: 'center',
            title: i18n.t("pqc.defectName"),
            render: (h, params) => {
              var me = this
              return h(
                'Select',
                {
                  props: {
                    value: me.discountData.rows[params.index].defectTypeId,
                    filterable: true
                  },
                  on: {
                    'on-change': value => {
                      ;(this.discountData.rows[params.index].defectTypeId = value),
                        this.changeDefectInfo(
                          this.discountData.rows[params.index].defectTypeId,
                          params.index
                        )
                    }
                  }
                },
                this.discountData.rows[params.index].defectTypeList.map(function(type) {
                  return h(
                    'Option',
                    { props: { value: type.defectTypeId, label: type.name } },
                    type
                  )
                })
              )
            }
          },
          // {
          //   key: 'inspectionTypeName',
          //   align: 'center',
          //   title: '检验项目',
          //   render: (h, params) => {
          //     let _this = this
          //     let texts = ''
          //     texts = params.row.inspectionTypeName
          //     return h(
          //       'div',
          //       {
          //         props: {
          //           type: 'text',
          //           disabled: true,
          //           value: params.row.inspectionTypeName
          //         }
          //       },
          //       texts
          //     )
          //   }
          // },
          {
            key: 'qltyLvId',
            width: 130,
            align: 'center',
            title: i18n.t("pqc.defectGrade"),
            render: (h, params) => {
              var me = this
              return h(
                'Select',
                {
                  props: {
                    value: me.discountData.rows[params.index].qltyLvId
                  },
                  on: {
                    'on-change': event => {
                      this.discountData.rows[params.index].qltyLvId = event
                    }
                  }
                },
                this.prodBatch.DefectGradeList.map(function(type) {
                  return h(
                    'Option',
                    {
                      props: { value: type.qltyLvId, label: type.name }
                    },
                    type
                  )
                })
              )
            }
          },
          {
            width: 130,
            key: 'defectLocId',
            align: 'center',
            title: i18n.t("pqc.defectPosition"),
            render: (h, params) => {
              var me = this
              return h(
                'Select',
                {
                  props: {
                    value: me.discountData.rows[params.index].defectLocId,
                    labelInValue:true
                  },
                  on: {
                    'on-change': event => {
                      this.discountData.rows[params.index].defectLocId = event.value
                      this.discountData.rows[params.index].defectLocName = event.label
                    }
                  }
                },
                this.prodBatch.DefectLocList.map(function(type) {
                  return h(
                    'Option',
                    {
                      props: { value: type.defectLocId, label: type.name }
                    },
                    type
                  )
                })
              )
            }
          },
          {
            key: 'defectNumber',
            align: 'center',
            width: 130,
            title: i18n.t("pqc.defectQty"),
            render: (h, params) => {
              var me = this
              return h('div', [
                h('Input', {
                  props: {
                    type: 'text',
                    value: me.discountData.rows[params.index].defectNumber
                  },
                  on: {
                    'on-blur': event => {
                      this.discountData.rows[params.index].defectNumber =
                        event.target.value
                    }
                  }
                })
              ])
            }
          },
          {
            key: 'extInfoList',
            // align: 'center',
            title: i18n.t("pqc.picture"),
            minWidth: 262,
            render: (h, data) => {
                //console.log(data)
                  //console.log(vm.discountData.rows,'rows1')
                  return h("IqisUpload", {
                    props: {
                      "value": data.row[data.column.key],
                      "size": 32,
                      "row-index": data.index,
                      "row":data.row,
                      "edit":true,
                      "maxSize":10240,
                      "fileType":['jpg','jpeg','png'],
                      "fileCount":5,
                      'chartTypeShow':"true",
                    },
                    on: {
                      input: (val) => {
                        //console.log(vm.discountData.rows,'rows2')
                        //console.log(data.rows,'rows23')
                        var obj = {
                          'defectrecordExtInfoName': val[0].name,
                          'defectrecordExtInfoType': val[0].mime,
                          'url': val[0].url
                        };
                        vm.discountData.rows[data.index].extInfoList.push(obj);
                        //console.log(vm.discountData.rows,'rows3')

                      },
                      del: (val) => {
                        vm.discountData.rows[data.index].extInfoList.splice(val, 1);
                        //console.log(vm.discountData.rows[data.index].extInfoList,'del')
                      }
                    }
                  })
            }
          },
          {
            key: 'operation',
            align: 'center',
            width: 130,
            title: i18n.t("pqc.operation"),
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.remove(params.index, 'discountData')
                      }
                    }
                  },
                  i18n.t("pqc.delete")
                )
              ])
            }
          }
        ],
        allProduction: 0,
        allproRejects: 0
      },
      bads: [],
      totalDefect: [],
      table: {
        defect: {
          selected: [],
          loading: false,
          columns: [
            {
              title: i18n.t("pqc.no"),
              width: 45,
              render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align: 'center',
              minWidth: 80,
              maxWidth: 80
            },
            {
              title: i18n.t("pqc.defectName"),
              minWidth: 80,
              ellipsis: true,
              key: 'defectTypeName',
              // render: vm.$iqis.utils.tableHelper.editable.buildSelectCell1(
              //   vm,
              //   vm => {
              //     return vm.prodBatch.DefectNameList
              //   },
              //   'defectTypeId',
              //   'name',
              //   vm.cellIqcEditorEnd
              // )
            },
            {
              title: i18n.t("pqc.inspection"),
              minWidth: 80,
              width: 120,
              ellipsis: true,
              key: 'inspectionTypeName',
              // render: vm.$iqis.utils.tableHelper.editable.buildSelectCell1(
              //   vm,
              //   vm => {
              //     return vm.prodBatch.DefectNameList
              //   },
              //   'inspectionTypeId',
              //   'inspectionTypeName',
              //   vm.cellIqcEditorEnd
              // )
            },
            {
              title: i18n.t("pqc.defectGrade"),
              minWidth: 80,
              ellipsis: true,
              key: 'qltyLvName',
              // render: vm.$iqis.utils.tableHelper.editable.buildSelectCell1(
              //   vm,
              //   vm => {
              //     return vm.prodBatch.DefectNameList
              //   },
              //   'qltyLvId',
              //   'qltyLvName',
              //   vm.cellIqcEditorEnd
              // )
            },
            {
              title: i18n.t("pqc.defectPosition"),
              minWidth: 80,
              ellipsis: true,
              key: 'defectLocName',
              // render: vm.$iqis.utils.tableHelper.editable.buildSelectCell1(
              //   vm,
              //   vm => {
              //     return vm.prodBatch.DefectLocList
              //   },
              //   'defectLocId',
              //   'name',
              //   vm.cellIqcEditorEnd
              // )
            },
            {
              title: i18n.t("pqc.defectQty"),
              minWidth: 80,
              ellipsis: true,
              key: 'defectNumber'
            },{
              title:i18n.t("pqc.picture"),
              minWidth:280,
              key:'extInfoList',
              render:(h,data) => {
                let value = this.totalDefect[data.index].extInfoList?this.totalDefect[data.index].extInfoList:[]
                //console.log(value,'value');
                return h('div',{style:'width:100%;height:100%;padding-right:80px;position:relative'},
                  // value.map(function(i){
                [
                    h('img',{
                      style:value[0]?'display:inlin-block;width:31px;height:31px;margin-left:5px;':'display:none',
                      domProps:{
                        src:value[0]?value[0].url:''
                      },
                      on:{
                        click:(e)=>{
                          this.bigPictures = value[0].url;
                          this.bigPicture = true;
                        }
                      }
                    }),
                    h('img',{
                      style:value[1]?'display:inlin-block;width:31px;height:31px;margin-left:5px;':'display:none',
                      domProps:{
                        src:value[1]?value[1].url:''
                      },
                      on:{
                        click:(e)=>{
                          this.bigPictures = value[1].url;
                          this.bigPicture = true;
                        }
                      }
                    }),
                    h('img',{
                      style:value[2]?'display:inlin-block;width:31px;height:31px;margin-left:5px;':'display:none',
                      domProps:{
                        src:value[2]?value[2].url:''
                      },
                      on:{
                        click:(e)=>{
                          this.bigPictures = value[2].url;
                          this.bigPicture = true;
                        }
                      }
                    }),
                    h('img',{
                      style:value[3]?'display:inlin-block;width:31px;height:31px;margin-left:5px;':'display:none',
                      domProps:{
                        src:value[3]?value[3].url:''
                      },
                      on:{
                        click:(e)=>{
                          this.bigPictures = value[3].url;
                          this.bigPicture = true;
                        }
                      }
                    }),h('img',{
                      style:value[4]?'display:inlin-block;width:31px;height:31px;margin-left:5px;':'display:none',
                      domProps:{
                        src:value[4]?value[4].url:''
                      },
                      on:{
                        click:(e)=>{
                          this.bigPictures = value[4].url;
                          this.bigPicture = true;
                        }
                      }
                    }),
                    h('span',{
                      style:'color:#2d8cf0;position:absolute;right:10px;top:10px;cursor:pointer',
                      on:{
                        click:(e)=>{
                          this.lookpicture = true;
                          this.pictureList = this.totalDefect[data.index].extInfoList;
                        }
                      }
                    },i18n.t("pqc.lam"))
                ])
              }
            }
          ]
        },
        bad: {
          selected: [],
          loading: false,
          columns: [
            {
              type: 'selection',
              align: 'center',
              width: 40,
              minWidth: 40,
              maxWidth: 40
            },
            {
              title: i18n.t("pqc.no"),
              width: 45,
              render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              align: 'center',
              minWidth: 80,
              maxWidth: 80
            },
            {
              title: i18n.t("pqc.occurrenceTime"),
              minWidth: this.$store.state.locale=='zh_CN'?90:120,
              align: 'center',
              ellipsis: true,
              key: 'date',
              render: function(h, data) {
                let value = data.row[data.column.key]
                let str = '-'
                if (value) {
                  var unixTimestamp = new Date(value)
                  str = unixTimestamp.Format('yyyy-MM-dd hh:mm')
                }
                return h('span', str)
              }
            },
            {
              title: i18n.t("pqc.pl"),
              minWidth: this.$store.state.locale=='zh_CN'?80:130,
              ellipsis: true,
              key: 'prodLineId',
              render: vm.$iqis.utils.tableHelper.editable.buildSelectCell1(
                vm,
                vm => {
                  return vm.prodLines
                },
                'prodLineId',
                'name',
                vm.cellIqcEditorEnd
              )
            },
            {
              title: i18n.t("pqc.pps"),
              minWidth: this.$store.state.locale=='zh_CN'?80:150,
              ellipsis: true,
              key: 'prodProcessId',
              render: vm.$iqis.utils.tableHelper.editable.buildSelectCell1(
                vm,
                vm => {
                  return vm.prodProcessList
                },
                'prodProcessId',
                'prodProcessName',
                vm.cellIqcEditorEnd
              )
            },
            {
              title: i18n.t("pqc.pq"),
              minWidth: this.$store.state.locale=='zh_CN'?80:140,
              ellipsis: true,
              key: 'prodQuantity'
            },
            {
              title: i18n.t("pqc.badQuantity"),
              minWidth: this.$store.state.locale=='zh_CN'?80:120,
              ellipsis: true,
              key: 'badQuantity'
            },
            {
              title: i18n.t("pqc.defectQty"),
              minWidth: 80,
              ellipsis: true,
              key: 'defectNumber'
            },
            {
              title: i18n.t("pqc.inspector"),
              minWidth: 80,
              ellipsis: true,
              key: 'createUserId',
              render: vm.$iqis.utils.tableHelper.editable.buildSelectCell1(
                vm,
                vm => {
                  return vm.ruleForm.userList
                },
                'userId',
                'name',
                vm.cellIqcEditorEnd
              )
            },
            {
              title: i18n.t("pqc.dd"),
              minWidth: this.$store.state.locale=='zh_CN'?80:120,
              ellipsis: true,
              key: 'info',
              render: (h, params) => {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.seeAdd(params.index, params)
                        }
                      }
                    },
                    i18n.t("pqc.examine")
                  )
                ])
              }
            }
          ]
        }
      },
      permsCur:[
        "UPDATE_DIRECT_RATE",
        "INSERT_DIRECT_RATE"
      ],//当前页面需要的权限名称
      permsBtn:{//控制每个权限对应按钮的禁用状态
        "UPDATE_DIRECT_RATE":false,
        "INSERT_DIRECT_RATE":false,
      },
      noPermsDis:true,
    }
  },
  watch:{
    eChartsDataFun(val,oldVal){
      let that = this;
      let obj = this.$refs.defectEchart
      if(that.allList.length>0){
        obj.parentNode.style.display="block"
        obj.style.height="400px";
      }else{
        obj.style.height="0px";
        obj.parentNode.style.display="none"
      }
      let objs = this.$refs.defectEchart

    this.myChart = echarts.init(objs)
    let temp = null;
    let vals = JSON.parse(JSON.stringify(val))
      for(let i=0;i<vals.length;i++){
        for(let j=i;j<vals.length;j++){
          if(Number(vals[i].defectNumber) < Number(vals[j].defectNumber)){
            temp = vals[j];
            vals[j] = vals[i]
            vals[i] = temp
          }
        }
      }
    window.onresize = function(){
        that.myChart.resize();
    }
      let xData = [];
      let x = [];
      let url = '/basic/defecttype?del=1&page=1&limit=9999'
            let options={
        title: {
          textStyle: {
            color: '#262626',
            fontSize: 20
          },
          // subtext: '总抽样数:69000' + '  ' + '缺陷数:60',
          // subtextStyle: {
          //   fontSize: 14,
          //   color: '#5C5C5C',
          //   align: 'right'
          // }
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {} //是否保存图片
          }
        },
        tooltip:{
          trigger: 'axis',
            formatter:function (params, ticket, callback) {
                var showHtm="";
                for(var i=0;i<params.length;i++){
                    //x轴名称
                    var name = params[i].axisValueLabel;
                    //名称
                    var text = params[i].seriesName;
                    //值
                    var value = params[i].data;
                    if(i==1){
                      showHtm += name+ '<br />' + text + ' ： ' + value+'' ;
                    }else{
                      showHtm += name+ '<br />' + text + ' ： ' + value+'--' ;
                    }
                }
                return showHtm;
            }
        },
        xAxis: [
          {
            type: 'category', //X轴均为category，Y轴均为value   //设置为类目轴
            data: []
          }
        ],
        grid:{
						top:30,
						bottom:20,
						left:50,
						right:45
					},
        yAxis: [
          {
            type: 'value',
            name: i18n.t("pqc.nb"),
            /* axisLabel: {
              formatter: '{value}'
            }, */
            splitLine:{
              show:false
            },
            max: 'dataMax'
          },
          {
            type: 'value',
            name: i18n.t('pqc.percentage'),
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        color: ['#418FEE'],
        series: [
          {
            name: i18n.t("pqc.nbr"),
            smooth: true,
            type: 'bar',
            barMaxWidth: '50',
            data: [],
            label:{
              show:true,
              position:'top',
            },
            //配置样式
            itemStyle: {
              //通常情况下:
              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function (params) {
                  return reportConfig.colorList[params.dataIndex % reportConfig.colorList.length];
                }
              }
            },
            /* itemStyle: {
                normal: {
                    color: function(params) {
                        // build a color map as your need.
                        var colorList = [
                        '#2981CC','#95F05D','#21A4BF','#5DA0F0','#FFD736','#975FE4','#C9690C',
                        '#46D2D4','#EE7AF4','#FBD955','#F47A8F','#75AEF2','#FBA655','#A677E8','#A51E34','#F2637B','#B10DB9','#29CCCC','#FAD337','#EC63F2','#FA9737'
                        ];
                        return colorList[params.dataIndex]
                    }
                }
            } */
          },
          {
            name: i18n.t("pqc.cdp"),
            type: 'line',
            data: [],
            yAxisIndex: 1,
          }
        ]
      }
      that.$http.get(url).then(res => {
        //console.log(res.data,'res.data');
        // that.prodBatch.DefectNameList = res.data
          let allNum = 0;
          for(let i =0;i<vals.length;i++){
            let state = false;
            for(let k = 0;k<res.data.length;k++){
              if(vals[i].defectTypeId == res.data[k].defectTypeId){
                x.push(res.data[k].name)
              }else{
                state = true;
              }
            }
            xData.push(Number(vals[i].defectNumber));
            allNum += Number(vals[i].defectNumber);
          }
          let lineData = [];
          let lineAll = 0;
          for(let i = 0;i<xData.length;i++){
              lineAll = lineAll + Number(xData[i]);
            lineData.push(Number((lineAll)/allNum*100).toFixed(2));
          }
      let allList = JSON.parse(JSON.stringify(xData))
      allList.sort(function(a,b){
        return a - b;
      });
      // options.yAxis[0].max = lineAll
      // options.yAxis[0].interval = lineAll
      options.xAxis[0].data = x;
      // //console.log(lineAll,'xxxx')
      options.series[0].data = xData;
      options.series[1].data = lineData;
      this.myChart.setOption(options)


      })

    },
    "ruleForm.allProduction":function(num){
      if(this.prodBatch.batchQuantity<num){
        this.prodBatch.batchQuantity=num;
      }
    }
  },
  computed:{
    eChartsDataFun(){
      return this.eCahrtsData;
    }
  },
  created() {
    this.locale = SessionStorage.get("language-main");
    let that = this
    var y = new Date().getFullYear().toString()
    var m = new Date().getMonth()>8?(new Date().getMonth()+1).toString():'0'+(new Date().getMonth()+1).toString()
    var d = new Date().getDate()>9?new Date().getDate().toString():'0'+new Date().getDate().toString()
    // this.newDate=new Date().getFullYear().toString()+new Date().getMonth()>8?(new Date().getMonth()+1).toString():'0'+(new Date().getMonth()+1).toString()+new Date().getDate()>9?new Date().getDate().toString():'0'+new Date().getDate().toString(),
    this.newDate = y+m+d
    let permsAll = this.$store.state.permissions;
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    that.getDefectTypeData()
    that.getdefectLocIdData()
    that.initProdBatchList()
    that.$http.get("/basic/prodline", {params: { limit: 99999999 }}).then(function(res){
      that.ruleForm.lineList=res.data
    })
    let url = "/bas/customerList?page=1&limit=9999&query=&fieldName="
    that.$http.get(url).then((res) => {
      that.ruleForm.customerList=res.data
    })
    let directRateId = this.$props.params && this.$props.params.directRateId
    that.propsParams = this.$props.params && this.$props.params.directRateId
    if (directRateId) {
      that.refreshData(directRateId)
      that.prodBatch.disabled = true
    } else {
      that.prodBatch.disabled = false
    }
    that.productName()
    that.basicCategory()
    that.initUserSelector()
    that.CurrentOperator()
    that.initBadRateTableSelector()
    that.getDefectGradeData()
    that.getInspectiontype()
      // 使用刚指定的配置项和数据显示图表。
    if((!this.propsParams&&this.permsBtn.INSERT_DIRECT_RATE)||(this.propsParams&&this.permsBtn.UPDATE_DIRECT_RATE)){
      this.noPermsDis=false;
    }else{
      this.noPermsDis=true;
    }
  },
  mounted(){

  },
  methods: {
    selectTeam(val) {
      let that = this
      if(that.memberIds.indexOf(val.userId)==-1) {
        that.memberIds.push(val.userId)
      }else {
        that.$Notice.warning({title: i18n.t('pqc.memberExisted')});
        return
      }
      let member ={memberId:val.userId,memberName:val.name}
      that.ruleForm.item.memberList.push(member)
      that.members.push(member)
    },
    deleteMember (val) {
      let index = this.members.indexOf(val)
      let idIndex = this.memberIds.indexOf(val.memberId)
      let s = this.ruleForm.item.memberList.indexOf(val)
      this.members.splice(index,1)
      this.memberIds.splice(idIndex,1)
      this.ruleForm.item.memberList.splice(s,1)
    },
    changeLabel() {
      this.sub1=false
      this.sub2=true
    },
    changeCreateBatchNo(){
      let that = this;
      if(that.createBatchNo==1){
        that.prodBatch.prodBatchId=''
        that.prodBatch.productId=''
        that.prodBatch.productName=''
        that.prodBatch.productSpec=''
        that.prodBatch.prodTypeName=''
        that.prodBatch.batchQuantity=''
        that.ruleForm.batchList=that.batchList
      }
    },
    remoteMethod: _.debounce(function(query) {
      let that = this;
      that.loadingRemote = true;

      if (query !== '') {
        that.cancelQuest();
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
        this.source('终止请求'); 
      }
    },
    oNbBlur(){

    },
    getInspectiontype(){//获取检验项目下拉框
      let that=this;
      that.$http.get("/basic/inspectiontype",{params:{limit:99999999}}).then(function(resp){
        let root = {title:i18n.t("pqc.projectType"),selected: false,label:i18n.t("pqc.projectType"),value:0,expand:true};
        that.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
        that.selects.inspectionTypes = [root];
      })
    },
    getDefectNameList(val,key,index,o){//获取当前检验项目下的缺陷名称列表
      if(o == null || Object.keys(o).length == 0){
        return;
      }
      let that = this;
      this.discountData.rows = this.discountData.rows ||[];
      let newRow = this.discountData.rows[index];
      if(!newRow && this.discountData.rows[index]){
        newRow =  JSON.parse(JSON.stringify(this.discountData.rows[index]));
      }
      if(!newRow){return;}
      newRow[key] = val;
      newRow['inspectionTypeName'] = o.name;
      newRow['inspectionTypeId'] = o.inspectionTypeId;
      newRow['chkDevTypeId'] = o.chkDevTypeId;
      newRow['chkDevTypeName'] = o.chkDevTypeName;

      let resp = that.$iqis.utils.syncget('/basic/defecttypelist/'+o.inspectionTypeId+'?page=1&limit=99999');//带出缺陷名称列表
      newRow['defectTypeList'] = resp ? resp.data||[]:[];
      that.discountData.rows[index] = newRow;
      that.$set(that.discountData.rows, index, newRow);
      return;
    },
    pqcBadTableSelectChange(selection) {
      this.ruleForm.selected = selection && selection.length > 0
    },
    pqcDefectTableSelectChange(selection) {},

    //数据(初始化)请求
    refreshData(obj) {
      let that = this
      let url = '/examinecenter/pqc/directRate/'
      that.$http.get(url + obj).then(res => {
        that.prodBatch.directRateId = obj
        that.prodBatch.prodBatchId = res.data.prodBatchId
        that.prodBatch.batchNo = res.data.prodBatchNo
        that.prodBatch.batchQuantity = res.data.batchQuantity
        that.prodBatch.date = new Date(res.data.createTime)
        that.prodBatch.productId = res.data.productId
        that.prodBatch.productTypeId = res.data.productTypeId
        that.ruleForm.allProduction = res.data.totalProdQuantity
        that.ruleForm.allproRejects = res.data.totalBadQuantity
        //生成不良记录
        let badRecordList = res.data.badRecordList
        that.bads = []
        that.totalDefect = []
        for (var i = 0; i < badRecordList.length; i++) {
          // that.badRecordLists[i]=badRecordList[i].memberList
          // that.members[i]=badRecordList[i].memberList
          let item = {}
          let rows = []
          let defectRecordList = res.data.badRecordList[i].defectRecordList

          let badRecord = {
            memberList: badRecordList[i].memberList,
            badRecordId: badRecordList[i].badRecordId,
            BadsID: i + 1000,
            tableid: i + 1000,
            date: new Date(badRecordList[i].createTime),
            defectNumber: 1,
            prodLineId: badRecordList[i].prodLineId,
            prodQuantity: badRecordList[i].prodQuantity,
            badQuantity: badRecordList[i].badQuantity,
            prodProcessId: badRecordList[i].prodProcessId,
            createUserId: badRecordList[i].createUserId,
            indexArr: [i]
          }
          // that.bads.push(badRecord);
          for (var r = 0; r < defectRecordList.length; r++) {
            if(!defectRecordList[r].defectLocId){
              defectRecordList[r].defectLocId=i18n.t("pqc.nothing");
            }
            let defect = {
              badRecordId:defectRecordList[r].badRecordId,
              extInfoList:defectRecordList[r].extInfoList,
              defectLocName:defectRecordList[r].defectLoc,
              defectLocId:defectRecordList[r].defectLocId,
              defectQuantity:defectRecordList[r].defectQuantity,
              defectRecordId:defectRecordList[r].defectRecordId,
              qltyLvName:defectRecordList[r].qltyLv,
              tenantId:defectRecordList[r].qltyLv,
              defectNumber: defectRecordList[r].defectQuantity,
              qltyLvId: defectRecordList[r].qltyLvId,
              defectTypeId: defectRecordList[r].defectTypeId,
              defectTypeName: defectRecordList[r].defectType,
              inspectionTypeName:defectRecordList[r].inspectionType,
              inspectionTypeId: defectRecordList[r].inspectionTypeId,
              rowsIndex: r,
              listIndex: i
            }
            rows.push(defect)
          }
          item = {
            bads: badRecord,
            rows: rows
          }
          that.allList.push(item)
        }
        that.resetAll();
        that.getInspectiontype();

        //判断产品批次Id是否在批次列表中，若不在，将这个产品批次push到批次列表中
        // var isProdBatchExist = 1;
        // if(that.ruleForm.batchList.length > 0){

        //   for(var i=0;i<that.ruleForm.batchList.length;i++){
        //     if(that.prodBatch.prodBatchId == that.ruleForm.batchList[i].prodBatchId){
        //       isProdBatchExist = 0;
        //       break;
        //     }
        //   }
        //   if(isProdBatchExist == 1){
        //     var batch = {
        //       prodBatchId:that.prodBatch.prodBatchId,
        //       batchNo:that.prodBatch.batchNo
        //     }
        //     that.prodBatch.prodBatchId = null;
        //     that.$set(this.ruleForm.batchList,this.ruleForm.batchList.length,batch);
        //     that.prodBatch.prodBatchId = res.data.prodBatchId;
        //   }
        // }
      })
    },
    selectOn(val, index) {
      let that = this;
      if(!val){
        that.ruleForm.processList=[]
        return;
      }
      that.$http.get('/basic/product/detail/'+val).then(res=>{
        that.prodBatch.productName=res.data.name
        that.prodBatch.productNo=res.data.no
        that.prodBatch.prodTypeName=res.data.prodTypeName
        that.prodBatch.productSpec=res.data.spec
        that.$http.get('/basic/prod-task/' + res.data.settings.qc.pqc.aql.prodFlowId)
        .then(res2 => {
          that.ruleForm.processList = res2.data.prodTaskItems;
        })

      })
      that.$http.get('/examinecenter/pqc/prodbatch/byProduct/'+val).then(function(resp){
        that.ruleForm.batchList=resp.data;
      })
    },
    //获取产品信息
    productName(val) {
      return;//以下接口数据量过大，避免使用
      let that = this
      let idValueMap = []
      let url_product = '/basic/product?page=1&limit=99999'

      that.$http.get(url_product).then(res => {
        let urlProduct = res.data
        urlProduct.forEach(e => {
          let productId = e.productId
          let no = e.no
          let name = e.name
          let typeName = e.prodTypeName
          let spec = e.spec
          let boxOn = { no, productId, name }
          let boxName = { name, productId }
          let boxSpec = { spec, productId }
          for (var i = 0; i < idValueMap.length; i++) {
            if (idValueMap[i].name != e.name) {
              idValueMap[i].no.push(boxOn)
              idValueMap[i].name.push(boxName)
              idValueMap[i].spec.push(boxSpec)
              return
            }
          }
          idValueMap.push({
            no: [boxOn],
            name: [boxName],
            spec: [boxSpec]
          })
        })
        for (var index in urlProduct) {
          if (val === urlProduct[index].productId) {
            that.basicCategory(urlProduct[index].prodTypeName)
          }
        }
        that.ruleForm.productON = idValueMap[0].no
        that.ruleForm.productNames = idValueMap[0].name
        that.ruleForm.productSpec = idValueMap[0].spec
      })
    },
    //获取缺陷数据
     getDefectTypeData() {
      let that = this
      let idValueMap = []
      let url = '/basic/defecttype?del=1&page=1&limit=9999'
      that.$http.get(url).then(res => {
        that.prodBatch.DefectNameList = res.data
      })
    },
    getdefectLocIdData() {
      //缺陷位置
      let that = this
      let url = '/basic/defectloc?page=1&limit=99999'
      that.$http.get(url).then(res => {
        // res.data.unshift({defectLocId:'',name:"请选择",remark:"",serialNumber:""})
        that.prodBatch.DefectLocList = res.data
        that.prodBatch.DefectLocList.unshift({defectLocId:i18n.t("pqc.nothing"),name:i18n.t("pqc.nothing")});
      })
    },
    getDefectGradeData(Lvid, index) {
      //缺陷等级
      let that = this
      let idValueMap = []
      let url = '/basic/qltylv?page=1&limit=99999'
      that.$http.get(url).then(res => {
        let urlProduct = res.data
        //console.log(res.data,'i18n.t("pqc.defectGrade")')
        that.prodBatch.DefectGradeList = urlProduct
        for (let x in that.prodBatch.DefectGradeList) {
          if (Lvid == that.prodBatch.DefectGradeList[x].qltyLvId) {
            that.discountData.rows[index].qltyLvName =
              that.prodBatch.DefectGradeList[x].name
          }
        }
      })
    },
    //选择缺陷带出其他缺陷信息
    changeDefectInfo(obj, index) {
      let that = this
      for (let x in that.prodBatch.DefectNameList) {
        if (obj == that.prodBatch.DefectNameList[x].defectTypeId) {
          // that.discountData.rows[index].inspectionTypeId =
          //   that.prodBatch.DefectNameList[x].inspectionTypeId //检验项目
          // that.discountData.rows[index].inspectionTypeName =
          //   that.prodBatch.DefectNameList[x].inspectionTypeName //检验项目
          that.discountData.rows[index].defectTypeName = 
          that.prodBatch.DefectNameList[x].name
          that.discountData.rows[index].qltyLvId =
            that.prodBatch.DefectNameList[x].qltyLvId //缺陷等级
          that.discountData.rows[index].qltyLvName =
            that.prodBatch.DefectNameList[x].qltyLvName //缺陷等级
        }
      }
    },
    //选择产品批号带出所有基本信息
    initBasic(prodBatchId) {
      let that = this;
      if(prodBatchId == ""){
        that.ruleForm.processList=[]
        return;
      }
      if (prodBatchId) {
        this.$http
          .get('/examinecenter/pqc/prodbatch/' + prodBatchId)
          .then(res => {
            that.prodBatch.batchQuantity = res.data.batchQuantity
            that.prodBatch.productId = res.data.productId
            that.prodBatch.customerId = res.data.customerId
            that.selectOn(that.prodBatch.productId)
            that.prodBatch.date = new Date(res.data.productionDate)
            that.prodBatch.productionState = res.data.productionState == 2 ? true : false
            // that.ruleForm.lineList =res.data.prodLines;
            this.$http
              .get('/basic/product/detail/' + that.prodBatch.productId)
              .then(resp => {
                that.prodBatch.prodUnitName = resp.data.prodUnitName;
                // that.ruleForm.processList = [];
                let pqcParam = resp.data.settings.qc.pqc.aql.prodFlowId
                if (pqcParam != null) {
                  that.$http.get('/basic/prod-task/' + pqcParam)
                    .then(resps => {
                      that.ruleForm.processList = resps.data.prodTaskItems;
                    })
                }
              })
              // let directRateId = this.$props.params && this.$props.params.directRateId
              this.$http.get('/examinecenter/pqc/directRate/by-batch-id?batchId='+prodBatchId).then((res)=>{

                if(res.data){
                  if(res.data.directRateId == that.propsParams){
                  }else{
                    that.refreshData(res.data.directRateId);
                    that.propsParams = null
                  }
                }else{
                  that.allList = [];
                  that.resetAll();
                  that.prodBatch.directRateId = null;
                  that.propsParams = null
                }
              });
          })
      }
    },
    //获取产品类别
    basicCategory(obj) {
      let idValueMap = []
      let url_prodtype = '/basic/prodtype?limit=99999999'
      this.$http.get(url_prodtype).then(res => {
        let urlProduct = res.data
        for (var index in urlProduct) {
          if (obj === urlProduct[index].name) {
            this.prodBatch.prodTypeId = urlProduct[index].prodTypeId
          }
        }
        this.ruleForm.productTypeName = urlProduct
      })
    },
    //产品批次下拉菜单
    initProdBatchList() {
      let that = this;
      let res = that.$iqis.utils.syncget('/examinecenter/pqc/prodbatch',{ limit: 99999999});//,query:"query=&productionState=1"
      that.ruleForm.batchList = res.data;
      that.batchList=res.data;
      if(that.$props.params && that.$props.params.directRateId){//如果是修改，产品批号类型无法修改
        that.createBatchNo=0;
        that.createBatchNoDis=true;
      }else{//如果是添加
        for(let i in that.ruleForm.batchList){
          let item = that.ruleForm.batchList[i];
          if(item.batchNo==Number(that.newDate)){//如果当天日期的产品批号已存在
            that.createBatchNo=0;//则产品批号类型为选择已有
            that.prodBatch.prodBatchId=item.prodBatchId//且选中该产品批号
            break;
          }else{//如果不存在
            that.createBatchNo=1;//则产品批号类型为新建
            that.prodBatch.batchNo=Number(that.newDate)//且自动生成当天日期的产品批号
          }
        }
        that.initBasic(that.prodBatch.prodBatchId)
      }
    },
    //获取当前登录人员信息 /tenant/user/profile
    CurrentOperator() {
      let that = this
      let url = '/tenant/user/profile'
      that.$http.get(url).then(res => {
        that.ruleForm.createUserId = res.data.userId
      })
    },
    //用户下拉菜单
    initUserSelector() {
      let that = this
      that.$http.get('/tenant/user?limit=99999999').then(res => {
        that.ruleForm.userList = res.data
      })
    },
    //生产线别/生产工序下拉菜单
    initBadRateTableSelector() {
      let that = this
      this.$http.get('/basic/prodline?limit=99999999').then(res => {
        that.prodLines = res.data
      })
      this.$http.get('/basic/prod-process?limit=99999999').then(res => {
        that.prodProcessList = res.data
      })
    },

    //添加
    addPqcBad() {
      let that = this
      that.$http.get('/tenant/user?limit=99999999').then(res => {
        that.ruleForm.userList = res.data
      })
      $('.ss').css("display","block")
      that.sub1 = true
      that.sub2 = false
      // that.memberList=[]
      that.memberIds=[]
      that.members=[]
      that.ruleForm.selectCategory = i18n.t("pqc.add")
      that.ruleForm.item = {}
      that.ruleForm.item.memberList=[]
      that.ruleForm.item.date = new Date()
      that.ruleForm.item.createUserId = that.ruleForm.createUserId
      that.discountData.rows = [
        {
          defectTypeId: '',
          qltyLvId: '',
          inspectionTypeId: '',
          defectLocId: '',
          defectNumber: '',
          extInfoList:[]
        }
      ]
      that.ruleForm.tableID = that.ruleForm.tableID + 1
      that.ruleForm.state = true
    },
    isIntNum(val) {
      var regPos = / ^\d+$/ // 非负整数
      var regNeg = /^\-[1-9][0-9]*$/ // 负整数
      if (regPos.test(val) || regNeg.test(val)) {
        return true
      } else {
        return false
      }
    },
    // 修改
    editSelectRow() {
      let that = this
      $('.ss').css("display","none")
      that.ruleForm.selectCategory = i18n.t("pqc.modify")
      let delArr = that.$refs.badTable.getSelection()
      if (delArr.length == 1) {
        that.ruleForm.state = true
        that.ruleForm.item.createUserId = that.ruleForm.createUserId
        that.ruleForm.item.date = new Date(delArr[0].date)
        that.ruleForm.item.prodLineId = delArr[0].prodLineId
        that.ruleForm.item.prodProcessId = delArr[0].prodProcessId
        that.ruleForm.item.prodQuantity = delArr[0].prodQuantity
        that.ruleForm.item.badQuantity = delArr[0].badQuantity
        that.members = delArr[0].memberList
        if(that.ruleForm.item.memberList==undefined) {
          that.ruleForm.item.memberList=[]
        }
        let list = []
        let indexArr = delArr[0].indexArr
        let allList = this.$iqis.utils.clone(this.allList);
        for (let i = 0; i < indexArr.length; i++) {
            for (let k = 0; k < allList[indexArr[i]].rows.length; k++) {
              // allList[indexArr[i]].rows[k].inspectionTypeName = allList[indexArr[i]].rows[k].inspectionType
              list.push(allList[indexArr[i]].rows[k])
            }
        }
        // inspectionTypeId
        for(let i=0;i<list.length;i++){
          list[i].defectTypeList = this.getDefectNameLists(list[i].inspectionTypeId);
        }
        that.discountData.rows = list
      } else {
        this.$Notice.warning({
          title: i18n.t("pqc.psr"),
          desc: ''
        })
        return
      }
    },

    getDefectNameLists(val){
        let resp = this.$iqis.utils.syncget('/basic/defecttypelist/'+val+'?page=1&limit=99999');//带出缺陷名称列表
        return resp.data;
	  },
    //删除
    deleteTableSelected() {
      
      let allList = JSON.parse(JSON.stringify(this.allList))
      let that = this
      let delArr = that.$refs.badTable.getSelection()
      let newArr = []
      if (delArr.length < 1) {
        return
      }
      
      let indexArr = delArr[0].indexArr
      for(let i=1;i<delArr.length;i++){
        for(let k=0;k<delArr[i].indexArr.length;k++){
          indexArr.push(delArr[i].indexArr[k]);  
        }
      }
      for (let k = 0; k < allList.length; k++) {
        if (that.$iqis.arrFun.inArray(indexArr, k, 1, () => {})) {
        } else {
          newArr.push(allList[k])
        }
      }
      that.allList = []
      that.allList = newArr

      that.resetAll()
    },
    // 确定
    ModalOk() {
      let that = this
      // badRecordList[0].memberList=that.memberList
      // that.badRecordLists[that.nums]=JSON.parse(JSON.stringify(that.memberList))
      // that.memberList.length=0
      // that.nums++
      
      // if(Number(this.ruleForm.item.prodQuantity) < Number(this.ruleForm.item.badQuantity)){
      //   that.$Notice.warning({title:'不良数不能大于已投产数'})
      //   return;
      // }
      let params = [
        /* {type:'Empty',title:'生产线别',value:that.ruleForm.item.prodLineId},
        {type:'Empty',title:'生产工序',value:that.ruleForm.item.prodProcessId},
        {type:'Empty',title:'投产数量',value:that.ruleForm.item.prodQuantity},
        {type:'NumNot0',title:'投产数量',value:that.ruleForm.item.prodQuantity},
        {type:'Empty',title:'不良数',value:that.ruleForm.item.badQuantity},
        {type:'Num',title:'不良数',value:that.ruleForm.item.badQuantity}, */
        {type:'Empty',title:i18n.t("pqc.pl"),value:that.ruleForm.item.prodLineId},
        {type:'Empty',title:i18n.t("pqc.pp"),value:that.ruleForm.item.prodProcessId},
        {type:'Empty',title:i18n.t("pqc.putProdNum"),value:that.ruleForm.item.prodQuantity},
        {type:'NumNot0',title:i18n.t("pqc.putProdNum"),value:that.ruleForm.item.prodQuantity},
        {type:'Empty',title:i18n.t("pqc.badNumber"),value:that.ruleForm.item.badQuantity},
        {type:'Num',title:i18n.t("pqc.badNumber"),value:that.ruleForm.item.badQuantity},

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

      let n = [];
      for (let i = 0; i < that.discountData.rows.length; i++) {
        let item = that.discountData.rows[i]
        if (item.defectNumber == '' && item.defectTypeId =='' && item.inspectionTypeId =='' && item.qltyLvId == '') {
          n.push(i)
        }
        // if(item.defectNumber == ''){
        //   item.defectNumber = 0
        // }

        // if( (item.defectNumber != 0 &&item.defectNumber != '') || item.defectTypeId !='' || item.inspectionTypeId !='' || item.qltyLvId != ''){
          if(item.defectNumber ===''|| item.defectTypeId =='' || item.inspectionTypeId =='' || item.qltyLvId == ''){
              that.$Notice.warning({title:i18n.t("pqc.qtxd")+(i+1)+i18n.t("pqc.tqxj")})
            return;
          }
        // }
        let paramsDefects = [
          {type: 'Num', title: i18n.t("pqc.defectQty"), value: item.defectNumber},
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
      for(let i=0;i<n.length;i++){
        that.discountData.rows.splice(n[i],1)
      }
      let dataTable = []
      let turnoverArrey = []
      let turnoverAll
      let tableAll = {}
      let tabeData = []
      let insx
      tableAll = that.discountData.rows.concat()
      if (that.ruleForm.selectCategory == i18n.t("pqc.add")) {
        let oldTime = new Date(that.ruleForm.item.date).getTime() //得到毫秒数
        that.ruleForm.item.date = oldTime
        tableAll.forEach((e, index) => {
          e.tableid = that.ruleForm.tableID
          e.date = that.ruleForm.item.date
          e.prodLineId = that.ruleForm.item.prodLineId
          e.prodProcessId = that.ruleForm.item.prodProcessId
          e.badQuantity = that.ruleForm.item.badQuantity
          e.prodQuantity = that.ruleForm.item.prodQuantity
          e.listIndex = that.allList.length == 0 ? 0 : that.allList.length
          e.rowsIndex = index
        })
        // tabeData = tabeData.concat(tableAll)
        tabeData = JSON.parse(JSON.stringify(tableAll));
        let num = 0
        for (let i = 0; i < tabeData.length; i++) {
          num += parseInt(tabeData[i].defectNumber)
        }

        //缺陷数量合并
        that.ruleForm.item.tableid = that.ruleForm.tableID
        that.ruleForm.item.defectNumber = num
        that.ruleForm.item.indexArr = [
          that.allList.length == 0 ? 0 : that.allList.length
        ]
        dataTable.push(that.ruleForm.item)
        let list = {
          bads: dataTable[0],
          rows: that.rowsFun(tabeData)
        }
        that.allList.push(list)
        that.ruleForm.mapData = that.ruleForm.mapData.concat(tabeData)
        that.resetAll()
        // that.totalDefect = that.totalDefect.concat(tabeData)
        that.ruleForm.item = {}
        that.discountData.rows = [
          {
            defectTypeId: '',
            qltyLvId: '',
            inspectionTypeId: '',
            defectLocId: '',
            defectNumber: '',
            extInfoList:[],
          }
        ]

        //          that.EqualDataAll()
        that.ruleForm.state = false
      } else if (that.ruleForm.selectCategory == i18n.t('pqc.modify')) {
        //缺陷数量合并
        let that = this
        let delArr = that.$refs.badTable.getSelection()
        if (delArr.length != 1) {
          return
        }
        let indexArr = delArr[0].indexArr
        let rowsIndex = that.allList[indexArr[0]].rows.length == 0 ? 0 : that.allList[indexArr[0]].rows.length
        let num = 0
        tableAll.forEach((e, index) => {
          e.tableid = that.ruleForm.tableID
          e.date = new Date(that.ruleForm.item.date).getTime()
          e.prodLineId = tableAll[index].hasOwnProperty('prodLineId')
            ? e.prodLineId
            : that.ruleForm.item.prodLineId
          e.prodProcessId = tableAll[index].hasOwnProperty('prodProcessId')
            ? e.prodProcessId
            : that.ruleForm.item.prodProcessId
          e.badQuantity = tableAll[index].hasOwnProperty('badQuantity')
            ? e.badQuantity
            : that.ruleForm.item.badQuantity
          e.prodQuantity = tableAll[index].hasOwnProperty('prodQuantity')
            ? e.prodQuantity
            : that.ruleForm.item.prodQuantity
          e.listIndex = tableAll[index].hasOwnProperty('listIndex')
            ? e.listIndex
            : indexArr[0]
            if(tableAll[index].hasOwnProperty('rowsIndex')){
              e.rowsIndex = e.rowsIndex
            }else{
              e.rowsIndex = rowsIndex
              rowsIndex++;
            }
        })

        for (let o = 0; o < tableAll.length; o++) {
          num = num + parseInt(tableAll[o].defectNumber)
        }

        for (let i = 0; i < indexArr.length; i++) {
          if (i == 0) {
            that.allList[indexArr[i]].bads.createUserId =
              that.ruleForm.item.createUserId
            that.allList[indexArr[i]].bads.date = new Date().getTime()
            that.allList[indexArr[i]].bads.prodLineId =
              that.ruleForm.item.prodLineId
            that.allList[indexArr[i]].bads.prodProcessId =
              that.ruleForm.item.prodProcessId
            that.allList[indexArr[i]].bads.prodQuantity = parseInt(that.ruleForm.item.prodQuantity)
            that.allList[indexArr[i]].bads.badQuantity = parseInt(that.ruleForm.item.badQuantity)
            that.allList[indexArr[i]].bads.defectNumber = num
          } else {
            that.allList[indexArr[i]].bads.createUserId =
              that.ruleForm.item.createUserId
            that.allList[indexArr[i]].bads.date = new Date(that.ruleForm.item.date).getTime()
            that.allList[indexArr[i]].bads.prodLineId =
              that.ruleForm.item.prodLineId
            that.allList[indexArr[i]].bads.prodProcessId =
              that.ruleForm.item.prodProcessId
            that.allList[indexArr[i]].bads.prodQuantity = 0
            that.allList[indexArr[i]].bads.badQuantity = 0
            that.allList[indexArr[i]].bads.defectNumber = 0
          }
        }
        let isf = false;
        for (let k = 0; k < tableAll.length; k++) {
          let lengths = that.allList[tableAll[k].listIndex].rows.length
          if(that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex]){
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].badQuantity =
                  tableAll[k].badQuantity
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].extInfoList =
                  tableAll[k].extInfoList
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].date =
                  tableAll[k].date
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].defectLocId =
                  tableAll[k].defectLocId
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].defectNumber =
                  tableAll[k].defectNumber
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].defectTypeId =
                  tableAll[k].defectTypeId
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].inspectionTypeId =
                  tableAll[k].inspectionTypeId
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].inspectionTypeName =
                  tableAll[k].inspectionTypeName
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].prodLineId =
                  tableAll[k].prodLineId
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].prodProcessId =
                  tableAll[k].prodProcessId
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].prodQuantity =
                  tableAll[k].prodQuantity
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].qltyLvId =
                  tableAll[k].qltyLvId
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].qltyLvName =
                  tableAll[k].qltyLvName
                that.allList[tableAll[k].listIndex].rows[tableAll[k].rowsIndex].tableid =
                  tableAll[k].tableid
          }else{
            that.allList[tableAll[k].listIndex].rows.push(tableAll[k])
          }
        }
        that.ruleForm.state = false
        //console.log(that.allList)
        that.resetAll()
      }
    },
    showCloseModal(){
      this.closeModal = true;
    },
    resetAll() {
      let that = this
      let bads = []
      let totalDefect = []
      for (let i = 0; i < that.allList.length; i++) {
        let p = JSON.parse(JSON.stringify(that.allList[i].bads));
        bads.push(p)
        bads[i].indexArr = [i]
        for (let j = 0; j < that.allList[i].rows.length; j++) {
          let newArr = JSON.parse(JSON.stringify(that.allList[i].rows[j]));
          totalDefect.push(newArr)
        }
      }
      that.totalDefect = that.rowsFun(totalDefect);
      that.bads = that.topsFun(bads);
      that.eCahrtsData =  that.totalDefect;
      for(let x = 0;x<that.bads.length;x++){
        let num = 0;
        let item = that.bads[x];
        for(let k =0;k<item.indexArr.length;k++){
          let itemArr = item.indexArr[k];
          for(let s = 0;s<that.allList[itemArr].rows.length;s++){
            let row = that.allList[itemArr].rows[s];
            num += parseInt(row.defectNumber);
          }
        }
        that.bads[x].defectNumber = num;
      }
      that.combineData(that.bads);
    },
    addTotalDefect(index, id) {
      let that = this
      let tableAll = {}
      let tabeData = []
      let oldTime = new Date(that.ruleForm.item.date).getTime()
      tableAll = that.discountData.rows.concat()
      tableAll.forEach(e => {
        e.tableid = that.ruleForm.tableID
        e.date = oldTime
        e.prodLineId = that.ruleForm.item.prodLineId
        e.prodProcessId = that.ruleForm.item.prodProcessId
        e.badQuantity = that.ruleForm.item.badQuantity
        e.prodQuantity = that.ruleForm.item.prodQuantity
      })

      for (let x in that.discountData.rows) {
        that.totalDefect.splice(index, 0, that.discountData.rows[x])
      }
      //        that.EqualDataAll()
      that.ruleForm.state = false
    },

    //计算投产数量、不良数量以及不良率
    combineData(obj) {
      let that = this
      let tableDatas = obj
      let idValueMap = []
      tableDatas.forEach(function(e) {
        for (var i = 0; i < idValueMap.length; i++) {
          if (
            idValueMap[i].prodProcessId === e.prodProcessId &&
            idValueMap[i].prodLineId === e.prodLineId
          ) {
            idValueMap[i].amountList.push(e)
            return
          }
        }
        idValueMap.push({
          prodLineId: e.prodLineId,
          prodProcessId: e.prodProcessId,
          amountList: [e]
        })
      })
      let dataMap = []
      obj.forEach(e => {
        for (var j = 0; j < dataMap.length; j++) {
          if (
            idValueMap[j].prodLineId == e.prodLineId &&
            idValueMap[j].prodProcessId == e.prodProcessId
          ) {
            dataMap[j].allProduction.push(e.prodQuantity)
            dataMap[j].allproRejects.push(e.badQuantity)
            return
          }
        }
        dataMap.push({
          allProduction: [e.prodQuantity],
          allproRejects: [e.badQuantity]
        })
      })

      //获取总投产数和不良数/直通率
      // let allProduction = JSON.parse('[' + String(dataMap[0].allProduction) + ']')
      // allProduction = allProduction.reduce(that.getSum);
      // that.ruleForm.allProduction = allProduction;
      // let allproRejects = JSON.parse('[' + String(dataMap[0].allproRejects) + ']')
      // allproRejects = allproRejects.reduce(that.getSum);
      // that.ruleForm.allproRejects = allproRejects;
      that.ruleForm.allProduction = 0
      that.ruleForm.allproRejects = 0
      for (let i = 0; i < that.bads.length; i++) {
        // that.ruleForm.allProduction =
        //   parseInt(that.ruleForm.allProduction) +
        //   parseInt(that.bads[i].prodQuantity)
        that.ruleForm.allproRejects =
          parseInt(that.ruleForm.allproRejects) +
          parseInt(that.bads[i].badQuantity)
      }
      let arrs = this.getLikeArr(that.bads);
      let allProduction = 0;
      for(let i=0;i<arrs.length;i++){
        let item = arrs[i]
        let length = arrs[i].length
        item.sort(function(a,b){
          return a - b;
        })
        allProduction += parseInt(item[length-1]);
      }
      that.ruleForm.allProduction = allProduction;
    },
    getLikeArr(arr){
      let param = JSON.parse(JSON.stringify(arr))
      let length = param.length;
      let temp = [];
      let all = [];
      let allLike = [];
      let flag = false;
      for(let i = 0; i<length; i++){
        all.push(param[i].prodLineId);
      }
      all = this.distArr(all);
      for(let k=0;k<all.length;k++){
        let item = [];
        for(let j =0;j<length;j++){
          if(all[k] == param[j].prodLineId){
            item.push(param[j].prodQuantity)
          }
        }
        allLike.push(item);
      }
      return allLike;
    },
    distArr(arr){
      let len = arr.length;
        //对数组进行排序才能方便比较
      arr.sort(function(a,b){
        return a - b;
      })
      function loop(index){
        if(index >= 1){
        if(arr[index] === arr[index-1]){
          arr.splice(index,1);
        }
        loop(index - 1); //递归loop函数进行去重
        }
      }
      loop(len-1);
      return arr;
    },
    //不良记录
    seeAdd(val, obj) {
      this.totalDefect = []
      let list = []
      let indexArr = []
      indexArr = this.bads[val].indexArr
      for (let i = 0; i < indexArr.length; i++) {
        for (let k = 0; k < this.allList[indexArr[i]].rows.length; k++) {
          list.push(this.allList[indexArr[i]].rows[k])
        }
      }
      this.totalDefect = this.$iqis.utils.clone(this.rowsFun(list));
      this.eCahrtsData =  this.$iqis.utils.clone(this.rowsFun(list));
      document.getElementById('MSd').scrollIntoView()
    },
    seeAll() {
      let list = []
      for (let i = 0; i < this.allList.length; i++) {
          for (let k = 0; k < this.allList[i].rows.length; k++) {
            list.push(this.allList[i].rows[k])
          }
      }
      this.totalDefect = []
      this.totalDefect = this.rowsFun(list)
      this.eCahrtsData =  this.totalDefect;
    },
    //查看全部缺陷
    seeAllTable() {
      let that = this
      that.totalDefect = that.ruleForm.mapData
    },
    //公共方法集合
    pubicMethod(item, indexs) {
      let that = this
      let idValueMap = []
      let dataDefect = []
      if (indexs == 1) {
        let dataMap = that.ruleForm.mapData
        for (let x in dataMap) {
          if (dataMap[x].tableid == item.tableid) {
            idValueMap.push(dataMap[x])
          }
        }
        that.totalDefect = idValueMap
      }

      //不良数据修改
      if (indexs == 3) {
        for (let index in that.ruleForm.mapData) {
          if (that.ruleForm.mapData[index].tableid == item.tableid) {
            dataDefect.push(that.ruleForm.mapData[index])
          }
        }
        that.ruleForm.dataDefects = dataDefect
        that.ruleForm.item.date = new Date(dataDefect[0].date)
        that.ruleForm.item.defectLocId = dataDefect[0].defectLocId
        that.ruleForm.item.prodLineId = dataDefect[0].prodLineId
        that.ruleForm.item.prodProcessId = dataDefect[0].prodProcessId
        that.ruleForm.item.badQuantity = dataDefect[0].badQuantity
        that.ruleForm.item.prodQuantity = dataDefect[0].prodQuantity
        that.discountData.rows = dataDefect
      }
    },
    topsFun(arr) {
      let that = this
      let s = this.$iqis.utils.clone(arr)
      let length = s.length
      var temp = []
      let newArr = []
      var flag = false
      if (s && length > 0) {
        for (let i = 0; i < length; i++) {
          for (var k = 0; k < temp.length; k++) {
            if (temp[k] == i) {
              flag = true
              break
            }
          }
          if (!flag) {
            for (let j = i + 1; j < length; j++) {
              if ( s[i].prodLineId == s[j].prodLineId && s[i].prodProcessId == s[j].prodProcessId ){
                s[i].prodQuantity = parseInt(s[i].prodQuantity) + parseInt(s[j].prodQuantity)
                s[i].badQuantity = parseInt(s[i].badQuantity) + parseInt(s[j].badQuantity)
                s[i].defectNumber = parseInt(s[i].defectNumber) + parseInt(s[j].defectNumber)
                temp.push(j)
                if (!that.$iqis.arrFun.inArray( s[i].indexArr, s[j].indexArr[0], 1, () => {} ) ) {
                  s[i].indexArr.push(s[j].indexArr[0])
                }
              }
            }
          }
          flag = false
        }
      }
      for (let y = 0; y < length; y++) {
        if (temp.length > 0) {
          if (that.$iqis.arrFun.inArray(temp, y, 1, () => {})) {
          } else {
            newArr.push(s[y])
          }
        } else {
          newArr = s
        }
      }
      return newArr
    },
    rowsFun(arr) {
      let that = this
      let s = this.$iqis.utils.clone(arr)
      let length = s.length
      var temp = []
      let newArr = []
      var flag = false
      if (s && length > 0) {
        for (let i = 0; i < length; i++) {
          for (var k = 0; k < temp.length; k++) {
            if (temp[k] == i) {
              flag = true
              break
            }
          }
          if (!flag) {
            for (let j = i + 1; j < length; j++) {
              if (
                s[i].defectLocId == s[j].defectLocId &&
                s[i].defectTypeId == s[j].defectTypeId &&
                s[i].inspectionTypeId == s[j].inspectionTypeId &&
                s[i].qltyLvId == s[j].qltyLvId
              ) {
                s[i].defectNumber =
                  parseInt(s[i].defectNumber) + parseInt(s[j].defectNumber)
                  for(let o=0;o<s[j].extInfoList.length;o++){
                    s[i].extInfoList.push(s[j].extInfoList[o]);
                  }
                temp.push(j)
              }
            }
          }
        }
        flag = false
      }
      for (let y = 0; y < length; y++) {
        if (temp.length > 0) {
          if (that.$iqis.arrFun.inArray(temp, y, 1, () => {})) {
          } else {
            newArr.push(s[y])
          }
        } else {
          newArr = s
        }
      }
      return this.$iqis.utils.clone(newArr)
    },
    timetrans(date) {
      var date = new Date(date * 1000) //如果date为10位不需要乘1000
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
      var s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m
    },
    BadRecord(BadsValueMap) {
      let that = this
      let BadsMap = {}
      let BadsArr = []
      let map = {}
      let arr = []
      for (let i = 0; i < BadsValueMap.length; i++) {
        for (let j = 0; j < BadsValueMap[i].datas.length; j++) {
          BadsValueMap[i].datas[j].prodQuantity = parseInt(
            BadsValueMap[i].datas[j].prodQuantity
          )
          BadsValueMap[i].datas[j].badQuantity = parseInt(
            BadsValueMap[i].datas[j].badQuantity
          )
          var di = BadsValueMap[i].datas[j]
          var n = di.BadsID
          if (!map[n]) {
            map[n] = di.defectNumber
            arr.push(di)
          } else {
            for (var j = 0; j < arr.length; j++) {
              var aj = arr[j]
              if (aj.BadsID == n) {
                aj.BadsID = di.BadsID
                aj.tableid = di.tableid
                aj.date = di.date
                aj.prodLineId = di.prodLineId
                aj.prodProcessId = di.prodProcessId
                aj.prodQuantity += parseInt(di.prodQuantity)
                aj.badQuantity += parseInt(di.badQuantity)
                aj.defectNumber += parseInt(di.defectNumber)
                break
              }
            }
          }

          //						  var BadsData = BadsValueMap[i].datas[j];
          //					    var n = BadsData.BadsID;
          //					    if(!BadsMap[n]){
          //					        BadsMap[n] = BadsData.defectNumber;
          //					        BadsArr.push(BadsData);
          //					    }else{
          //		        for(var x = 0; x < BadsArr.length; x++){
          //		            var aj = BadsArr[x];
          //		            if(aj.BadsData == n){
          //		                aj.BadsID=BadsData.BadsID;
          //		                aj.data=BadsData.data;
          //		                aj.name=BadsData.name;
          //		                aj.prodLineId=BadsData.prodLineId;
          //		                aj.prodProcessId=BadsData.prodProcessId;
          //		                aj.tableid=BadsData.tableid;
          //		                aj.defectNumber += BadsData.defectNumber;
          //		                aj.badQuantity += BadsData.badQuantity;
          //		                aj.prodQuantity += BadsData.prodQuantity;
          //		                break;
          //		            }
          //		        }
          //		   		 }
        }
      }
    },
    DefectRecord(DefectValueMap) {
      let that = this
      let defectMap = {}
      let defectArr = []
    },
    //数据合并（reduce）
    getSum(total, num) {
      return total + num
    },
    addNewData() {
      let that = this
      var obj = JSON.parse(JSON.stringify(that.discountData.tableData))
      that.discountData.rows.push(obj)
      let index = that.discountData.rows.length
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((index-5)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');

      })
    },
    remove(index, value) {
      let indexList = this.discountData.rows[index].listIndex
      let rowsIndex = this.discountData.rows[index].rowsIndex
      this.discountData.rows.splice(index, 1)
      this.allList[indexList].rows.splice(rowsIndex, 1)
      // this.allList[indexList].rows.splice(rowsIndex,1);
      this.resetAll()
    },

    //保存
    save() {
      let that = this;
      //判断产品批次Id是否被删除，若删除则无法保存
      that.$http.get('/examinecenter/pqc/prodbatch',{ params: { limit: 99999999,query:"query="} }).then(res => {
        var isProdBatchExist = 1;
        if (res.data.length > 0) {
          for (var i=0;i<res.data.length;i++) {
            if(that.prodBatch.prodBatchId == res.data[i].prodBatchId){
              isProdBatchExist = 0;
              break;
            }
          }
          if (isProdBatchExist == 1&&that.propsParams){
            that.$Notice.warning({title:i18n.t("pqc.tpb")});
            return;
          }
        }
      let params=[]
      if(that.createBatchNo===1){
        params.push(
          {type:'Empty',title:i18n.t("pqc.ln"),value:that.prodBatch.batchNo}
        )
      }else{
        params.push(
          {type:'Empty',title:i18n.t("pqc.ln"),value:that.prodBatch.prodBatchId}
        )
      }
      params.push(
        {type:'Empty',title:i18n.t('pqc.pn'),value:that.prodBatch.productId},
        // {type:'NumNot0',title:i18n.t('pqc.qp'),value:that.ruleForm.allProduction},
      )
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
      // if(Number(that.prodBatch.batchQuantity)<Number(that.ruleForm.allProduction)){
      //   that.$Notice.warning({title:'已投产数量不能大于批量数'})
      //   return;
      // }
      let defectList = that.totalDefect
      let badList = that.bads
      let badRecordList = []
      let defectRecordList = []
      for (let x = 0; x < that.allList.length; x++) {
        let totalDefectQuantity = 0;
        let item = that.allList[x]
        let rows = []
        for (let j = 0; j < item.rows.length; j++) {
          totalDefectQuantity += parseInt(item.rows[j].defectNumber)
          let defect = {
            defectLocId: item.rows[j].defectLocId,
            qltyLvId: item.rows[j].qltyLvId,
            defectTypeId: item.rows[j].defectTypeId,
            defectQuantity: item.rows[j].defectNumber,
            inspectionTypeId:item.rows[j].inspectionTypeId,
            extInfoList:item.rows[j].extInfoList
          }
          rows.push(defect)
          if(rows[j].defectLocId==i18n.t('null')){
            rows[j].defectLocId='';
          }
        }
        let badRecord = {
          badRecordId:item.bads.badRecordId,
          memberList: item.bads.memberList,
          createUserId: item.bads.createUserId,
          createTime: item.bads.date,
          badQuantity: item.bads.badQuantity,
          prodLineId: item.bads.prodLineId,
          prodProcessId: item.bads.prodProcessId,
          prodQuantity: item.bads.prodQuantity,
          defectRecordList: rows,
          totalDefectQuantity
        }
        badRecordList.push(badRecord)
      }
      
      let param = {
        productId:that.prodBatch.productId,
        prodBatchId: that.prodBatch.prodBatchId,
        prodBatchNo:that.prodBatch.batchNo,
        customerId:that.prodBatch.customerId,
        totalProdQuantity: that.ruleForm.allProduction,
        totalBadQuantity: that.ruleForm.allproRejects,
        batchQuantity:that.prodBatch.batchQuantity,
        // totalDefectQuantity:totalDefectQuantity,
        directRate:this.$iqis.utils.getTwoDecimal((1-this.ruleForm.allproRejects / this.ruleForm.allProduction) * 100) >=0 ? this.$iqis.utils.getTwoDecimal((1-this.ruleForm.allproRejects / this.ruleForm.allProduction) * 100) : 0,
        badRecordList: badRecordList,
        createTime: new Date(this.prodBatch.date).getTime()
      }

      if (!that.prodBatch.directRateId) {
        that.$http
          .post('/examinecenter/pqc/directRate', param, that.headers)
          .then(res => {
            that.prodBatch.directRateId = res.data.directRateId
            that.$Message.success(i18n.t("pqc.as"))
            that.closePage()
            this.$emit(
              'open-tab',
              'exam-pqc-bad-update-' + res.data.directRateId,
              i18n.t("pqc.mdpr"),
              'page-exam-pqc-bad-update',
              { directRateId: res.data.directRateId }
            )
          })
      } else {
        param.directRateId = that.prodBatch.directRateId
        that.$http
          .put('/examinecenter/pqc/directRate', param, that.headers)
          .then(res => {
            let a=new Date().getSeconds()
            that.$Message.success(i18n.t('pqc.ats'))
            that.closePage()
            that.$emit(
              'open-tab',
              'exam-pqc-bad-update-'+a + that.prodBatch.directRateId,
              i18n.t("pqc.mdpr")+that.prodBatch.productName,
              'page-exam-pqc-bad-update',
              { directRateId: that.prodBatch.directRateId }
            )
          })
      }
      })
    },
    //取消
    closePage() {
      this.$emit('close-tab', this.$props.tabKey)
    },

  } //end methods
}
</script>
<style>
.hoverClassThree{
  height:94px;background:rgba(255,255,255,1);border-radius:2px;border:1px solid rgba(233,233,233,1);padding-left:24px;
  transition:all 0.8s;
}
.hoverClassThree:hover{
  border-color: #418FEE;
}
.lookPictureBody{
  width:100%;
  min-height:300px;
}
.lookPictureBody .lookitem{
  width:45px;
  height:45px;
  display:inline-block;
  padding:5px;
  transition:all 0.3s;
  position: relative;
}
.lookPictureBody .lookitem:hover{
  box-shadow:-3px 0 3px #e3e3e3, /*左边阴影*/
	3px 0 3px #e3e3e3, /*右边阴影*/
	0 -3px 3px #e3e3e3, /*顶部阴影*/
	0 3px 3px #e3e3e3; /*底边阴影*/
}
.lookPictureBody .lookitem:hover .bigIMG{
  display: block
}

.lookPictureBody .lookitem img{
  /* width:100%; */
  /* height:100%; */
} 
.lookPictureBody .lookitem .bigIMG{
  display: none;
  position: absolute;
  width: 300px;
  height:300px; 
  bottom:-310px;
  right:-310px;
}
.lookPictureBody .lookitem .bigIMG img{
  max-height:500px; 
  max-width:500px;
}
</style>
