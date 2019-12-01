<template>
  <div class="iqis-page">
    <div class="iqis-page-tool-row" style="display:none">
    </div>
    <div class="iqis-page-context statistic-spc-page">
      <iframe src="static/spc/chart_imr.html" style="width:100%;" id="spcImrFrame" scrolling="auto" frameborder="0" ></iframe>
    </div> <!-- end iqis-page-content -->
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
  </div>
</template>

<script>
  import $ from 'jquery'
  import echarts from 'echarts'

  export default {
    data(){
      let vm = this;
      return {
        
      }//end return

    },//end  data
    methods:{
        
    },
    mounted(){
        const that = this;
        let initialHeight = $('.iqis-main-tabs').height() - 32;
        $('#spcImrFrame').height(initialHeight);

        var resizeTimer = null;
        $(window).bind('resize', function (){
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function(){
                let targetHeight = $('.iqis-main-tabs').height() - 32;
                //console.log('targetHeight',targetHeight)
                if(targetHeight == 0) return;
                $('#spcImrFrame').height(targetHeight)
            } , 200);
        });
        
    },
    watch: {
        
    },
    beforeDestroy(){
      
    }

  }
</script>
<style>
  .report-export-bth{
      padding: 0px 20px;
    margin-left: 8px;
  }
  .statistic-spc-page {
    /*margin-bottom: 10px;*/
    /*padding-bottom: 48px*/
  }
  .statistic-spc-page .ivu-line {
    padding-bottom: 3px;
  }
  .statistic-spc-page .exam-report-main{
      margin-top: 10px;
      margin-right: 10px;
      background-color: #fff;
      color: #333;
  }
  .statistic-spc-page .iqis-table-no-data{
      text-align: center;
      color: #333;
      font-size: 16px;
  }
  .statistic-spc-page .exam-report-title-table,
  .statistic-spc-page .exam-report-total-table,
  .statistic-spc-page .exam-report-datas-table,
  .statistic-spc-page .exam-report-footer{
      width: 100%;
      border: 0;
      border-collapse:collapse;
  }
  .statistic-spc-page .exam-report-border{
      border: 1px solid #666;
      margin-bottom: 0;
  }
  .statistic-spc-page .exam-report-total-border{
    border: 1px solid #666;
    margin-left: 18px;
    margin-right: 18px;
    padding: 6px 10px;
  }
  .statistic-spc-page .exam-total-item{
    margin-right: 30px;
  }
  .statistic-spc-page .total-label{
      padding-right: 8px;
  }
  .statistic-spc-page .exam-report-title-table .exam-report-date-cell{
    text-align: center; 
  }
  .statistic-spc-page .exam-report-title-table td{
    border: 0;
    vertical-align: bottom;
    line-height: 30px;
    border-collapse: collapse;
  }
  .statistic-spc-page .exam-report-title-table .exam-report-title-cell{
    font-size: 32px;
    line-height: 40px;
    text-align: center;
  }
  .statistic-spc-page .exam-report-datas-div {
    width: 100%;
    padding: 0 12px;
    margin-top: 10px;
  }
  .statistic-spc-page .exam-report-datas-table {
    border: 1px;
    border-color: #333;
  }
  .statistic-spc-page .exam-report-datas-table th,
  .statistic-spc-page .exam-report-datas-table td{
    border: 1px solid #333;
    padding: 3px;
    text-align: center;
  }
  .statistic-spc-page .exam-report-datas-table th{
    background-color: #efefef;
  }

  .statistic-spc-page .exam-report-datas-table td.table-gap,
  .statistic-spc-page .exam-report-datas-table th.table-gap{
      border-top: 0;
      border-bottom: 0;
      width: 10px;
      background-color: #fff;
  }

  .statistic-spc-page .exam-report-footer{
    margin: 10px 12px;
  }

</style>
