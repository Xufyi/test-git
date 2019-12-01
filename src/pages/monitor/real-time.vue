<template>
  <div class="iqis-page">
    <div class="iqis-page-tool-row" style="display:none">
      <div class="iqis-page-tool-primary">

      </div>
      <div class="iqis-page-tool-second">

      </div>
    </div>
    <div class="iqis-page-context">
      <div id="search-bar" class="search-bar">

      </div>
      <div class="iqis-real-time-page">
        <Table @on-row-dblclick="onDBClick" :no-data-text="i18n.t('noData')" border size="small" v-drag-table-column="tableColumns" :columns="tableColumns" :data="productBatchList" :height="tableHeight"></Table>
      </div>
        
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
  <!-- end iqis-page-context -->

  <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
</template>

<script>
import $ from 'jquery'
import ReportDateSelector from '../../components/reportDateSelector/ReportDateSelector'
import echarts from 'echarts'
import ICol from 'iview/src/components/grid/col'
import reportConfig from '../statistic/statisticConfig'
import numeral from 'numeral'

export default {
  data() {
    let vm = this
    return {
      i18n:window.i18n,
      spinShow:true,
      render: true,
      tableHeight: 460,
      tableColumns: [
        {
          title: i18n.t('monitor.status'),
          className:'tablePadding',
          minWidth: 50,
          width: 50,
          maxWidth: 50,
          key: 'status',
          align: 'center'
        },
        {
          title: i18n.t('monitor.prodTime'),
          className:'tablePadding',
          width: this.$store.state.locale=='zh_CN'?116:125,
          minWidth: this.$store.state.locale=='zh_CN'?116:125,
          key: 'productionDate',
          ellipsis: true,
          render: function(h, data) {
            let value = data.row.productionDate
            let str = value
              ? vm.$iqis.utils.date.toText(new Date(value), 'yyyy-MM-dd hh:mm')
              : '-'
            return h('span', str)
          }
        },
        {
          title: i18n.t('monitor.batchNo'),
          className:'tablePadding',
          width: 120,
          minWidth: 120,
          ellipsis: true,
          key: 'prodBatchNo'
        },
        {
          title: i18n.t('monitor.productName'),
          className:'tablePadding',
          width: this.$store.state.locale=='zh_CN'?103:110,
          minWidth: this.$store.state.locale=='zh_CN'?103:110,
          ellipsis: true,
          key: 'productName'
        },
        {
          title: i18n.t('monitor.specificationModel'),
          className:'tablePadding',
          width: 120,
          minWidth: 120,
          className:'tablePadding',
          ellipsis: true,
          key: 'productSpec'
        },
        {
          title: i18n.t('monitor.prodLine'),
          className:'tablePadding',
          width: 130,
          minWidth: 130,
          ellipsis: true,
          key: 'productLineName'
        },
        { 
          title: i18n.t('monitor.batchNum'),
          className:'tablePadding',
           minWidth: 60, 
           ellipsis: true, 
           key: 'batchQuantity' 
        },
        {
          title: i18n.t('monitor.putProdNum'),
          className:'tablePadding',
          minWidth: this.$store.state.locale=='zh_CN'?80:110,
          ellipsis: true,
          key: 'totalProdQuantity'
        },
        {
          title: i18n.t('monitor.badNum'),
          className:'tablePadding',
          minWidth: this.$store.state.locale=='zh_CN'?70:100,
          ellipsis: true,
          key: 'totalBadQuantity'
        },
        { title: i18n.t('monitor.fpy'),
        className:'tablePadding', minWidth:  this.$store.state.locale=='zh_CN'?70:80, ellipsis: true, key: 'rtyTip' },
        {
          title: i18n.t('monitor.fpyTarget'),
          className:'tablePadding',
          minWidth:  this.$store.state.locale=='zh_CN'?100:125,
          ellipsis: true,
          key: 'targetRtyTip'
        }
      ],
      productLineList: [],
      productBatchList: []
    } //end return
  }, //end  data
  created() {
    this.getData() //仅供测试用
    this.$store.commit('stas',true);
  },
  methods: {
    getData() {
      let that = this
      let params={
        start: that.$iqis.utils.get90DayStart(),
        end: that.$iqis.utils.getDayEnd(),
        customerId:this.$store.state.customerId||''

      }
      this.$http
        .all([
          that.$http.get('/basic/prodline', { params: { limit: 99999999 } }),
          //that.$http.get("/diagram/real-time/ProdBatch",{params:{start:that.$iqis.utils.get90DayStart(),end:that.$iqis.utils.getDayEnd()}})
          that.$http.get('/diagram/real-time/direct-rate', {params:params})
        ])
        .then(function(resps) {
          that.spinShow = false;
          that.productLineList = resps[0].data
          that.productBatchList = resps[1].data
          $.each(that.productBatchList, function function_name(index, item) {
            let rty = 100 - item.totalBadRate
            //rty=rty.substring(0,rty.lastIndexOf('.')+3); //非四舍五入
            rty = Math.floor(rty * 100) / 100
            item['rty'] = rty
            if(item.directRate < 0){
              item['rtyTip'] = '0.00%'
            }else{
              item['rtyTip'] = item.directRate + '%'
            }
            item['targetRtyTip'] = numeral(item.targetRty).format('0.00') + '%'
            let targetRty = item.targetRty || '90'
            if (rty < targetRty) {
              item['cellClassName'] = {
                rtyTip: 'danger-td',
                status: 'danger-light'
              }
            } else {
              item['cellClassName'] = {
                rtyTip: 'success-td',
                status: 'success-light'
              }
            }
          })
        }).catch(function(e){
          that.spinShow =false;
        })
    },
    refreshRealTimeTable() {},
    onDBClick(obj,index){
        this.$emit("open-tab","exam-pqc-bad-update-"+obj.directRateId,i18n.t("pqc.mtptr")+obj.productName,"page-exam-pqc-bad-update",{directRateId:obj.directRateId,proID:2})
      },
  },
  computed:{
    statS(){
      return this.$store.state.stas;
    }
  },
  mounted() {
    let that = this
    this.tableHeight = $('.iqis-context').height() - 105
    var TIMES = setInterval(function() {
      if(that.$store.state.stas){
        that.getData()
        that.render = false
      }
    }, 6000)
  },
  watch: {
    statS:function(v,ov){
      // alert(v)
      if(!v){
        clearInterval(TIMES);
      }
    }
  }
}
</script>
<style>
.iqis-real-time-page {
  padding-bottom: 54px;
}
.iqis-real-time-page .ivu-table .ivu-table-header th,
.iqis-real-time-page .ivu-table .ivu-table-body td {
  font-size: 14px;
  height: 35px !important;
}
.iqis-real-time-page .danger-td {
  background-color: #d9534f;
  color: #fff;
  font-size: 15px;
}
.iqis-real-time-page .success-td {
  background-color: #5cb85c;
  color: #fff;
  font-size: 15px;
}

.iqis-real-time-page .danger-light .ivu-table-cell {
  background-color: #d9534f;
  color: #fff;
  font-size: 15px;
  height: 20px;
  width: 20px;
  display: block !important;
  border-radius: 10px;
  border: 2px solid #fff;
  box-shadow: -1px 1px 3px #999;
  margin: 0 auto;
}

.iqis-real-time-page .success-light .ivu-table-cell {
  background-color: #5cb85c;
  color: #fff;
  font-size: 15px;
  height: 20px;
  width: 20px;
  display: block !important;
  border-radius: 10px;
  border: 2px solid #fff;
  box-shadow: -1px 1px 3px #999;
  margin: 0 auto;
}
</style>
