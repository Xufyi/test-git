<template>
  <div class="iqis-page">
    <div class="wrapper-content">
      <div class="wapperContebt-header">
        <div class='headerLeft'></div>
        <div class='headerCenter'>
          <div class="CenterTop">
            <h1>【因果图】</h1>
          </div>
        </div>
        <div class='headerRight'>
          <div class="CenterTop">
            	制表日期：{{timetrans()}}
          </div>
          <div class="CenterTop" >
            	页数：1 / 1
          </div>
        </div>
      </div>
      <div class="yuguInfo">
        <div class='infoLeft'>
          <span>分析编号：{{dataInfo.number}}</span>
          <span style='padding:0px 20px'>分析项目：{{dataInfo.project}}</span>                   
        </div>
        <div class='infoRight'>
          <span style='padding:0px 20px'>分析日期：{{timetrans(dataInfo.createTime)}}</span>
          <span>分析人员：{{dataInfo.analystName}}</span>
        </div>
      </div>
      <div id='charttttts' style='width:100%;height:600px;margin:0 auto'></div>
      <div class="wapperFooter">
        <div class="floatDiv">
          确认：
        </div>
        <div class="floatDiv">
          复审：
        </div>
        <div class="floatDiv">
          制表：
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.wapperFooter{
  width:100%;
  height:40px;
  line-height: 40px;
}
.wapperFooter .floatDiv{
  float: left;
  width:150px;
  height:40px;
}

.yuguInfo{
  width:100%;
  height:40px;
  line-height: 40px;
  border:1px solid #666;
  display:flex;
  padding:0px 10px
}
.yuguInfo .infoLeft{
  flex:1;
  height:100%;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.yuguInfo .infoRight{
  flex:1;
  height:100%;
  text-align: right
}
.wapperContebt-header{
  display: flex;
  width:100%;
  height:60px;
  padding:10px 0px;
}
.wapperContebt-header .headerLeft,.wapperContebt-header .headerRight{
  flex:1
}
.wapperContebt-header .headerRight{
  text-align: right
}
.wapperContebt-header .headerCenter{
  flex:2;
  text-align:center
}
.CenterTop{
  width:100%;
  height:50%;
}
.h1Title{
  padding:10px 30px;
  text-align: center
}

</style>
<script>
  import $ from 'jquery'
  export default {
    props: ['params', "tabKey"],
  
    data() {
      let vm = this;
      return {
        data: [],
        fishboneId: null,
        dataInfo:{},
      }
    },
    created() {},
    methods: {
      getData(id) {
        
        this.$http.get('/basic/fishbone/' + id).then(res => {
          this.dataInfo = res.data;
          for (let i = 0; i < res.data.frameworkList.length; i++) {
  
            res.data.frameworkList[i].title = res.data.frameworkList[i].name;
  
            res.data.frameworkList[i].selected = false;
  
            res.data.frameworkList[i].expand = true;
  
            res.data.frameworkList[i].children = [];
  
          }
  
          let data = res.data.frameworkList;
  
          this.data = this.initTreeData(this.$iqis.utils.clone(data), 0);
  
          this.initCharts(this.data);
  
        });
  
      },
      timetrans(time){
        var date = time?new Date(time):new Date();//如果date为10位不需要乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s;
      },
      initTreeData(data, parentId) {
  
        var temp = [],
  
          children = [];
  
        for (var i = 0; i < data.length; i++) {
  
          var item = data[i];
  
          if (item.parentId == parentId) {
  
            children = this.initTreeData(data, item.orderId);
  
            item.children = children;
  
            temp.push(item);
  
          }
  
        }
  
        return temp;
  
      },
  
      initCharts(data) {
  
        let that = this;
  
        // console.log(data[0]);
  
        // console.log($('#charttttts').width())
  
        $.when(
  
          $.ajax({
  
            type: "get",
  
            cache: true,
  
            url: "./static/d3.js",
  
            dataType: "script"
  
          })
  
        ).done(function(resp1) {
  
          $.when(
  
            $.ajax({
  
              type: "get",
  
              cache: true,
  
              url: "./static/d3.fishbone.js",
  
              dataType: "script"
  
            })).done(function(res) {
  
            var fishbone = d3.fishbone();
  
            var size = (function() {
  
                return {
  
                  width: $('#charttttts').width(),
  
                  height: 600
  
                };
  
              }),
  
              svg = d3.select("body #charttttts")
  
              .append("svg")
  
              .attr(size())
  
              .datum(data[0])
  
              .call(fishbone.defaultArrow)
  
              .call(fishbone);
  
            fishbone.force().size([size().width, size().height]).start();
  
            d3.select(window).on("resize", function() {
  
              fishbone.force()
  
                .size([size().width, size().height])
  
                .start();
  
              svg.attr(size())
  
            });
  
          });
  
        })
  
      }
  
    },
  
    mounted() {
  
      this.fishboneId = this.$props.params.fishboneId;
  
      this.getData(this.fishboneId);
  
    },
  
    watch: {
  
  
  
    },
  
    beforeDestroy() {
  
  
  
    }
  
  
  
  }
</script>
<style>
  .statistic-tendency-page {
  
    margin-bottom: 10px;
  
    padding-bottom: 48px
  
  }
  
  
  
  .statistic-tendency-page .ivu-line {
  
    padding-bottom: 3px;
  
  }
  
  
  
  .statistic-tendency-page .exam-report-main {
  
    margin-top: 10px;
  
    margin-right: 10px;
  
    background-color: #fff;
  
    color: #333;
  
  }
  
  
  
  .statistic-tendency-page .iqis-table-no-data {
  
    text-align: center;
  
    color: #333;
  
    font-size: 16px;
  
  }
  
  
  
  .statistic-tendency-page .exam-report-title-table,
  
  .statistic-tendency-page .exam-report-total-table,
  
  .statistic-tendency-page .exam-report-datas-table,
  
  .statistic-tendency-page .exam-report-footer {
  
    width: 100%;
  
    border: 0;
  
    border-collapse: collapse;
  
  }
  
  
  
  .statistic-tendency-page .exam-report-border {
  
    border: 1px solid #666;
  
    margin-bottom: 0;
  
  }
  
  
  
  .statistic-tendency-page .exam-report-total-border {
  
    border: 1px solid #666;
  
    margin-left: 18px;
  
    margin-right: 18px;
  
    padding: 6px 10px;
  
  }
  
  
  
  .statistic-tendency-page .exam-total-item {
  
    margin-right: 30px;
  
  }
  
  
  
  .statistic-tendency-page .total-label {
  
    padding-right: 8px;
  
  }
  
  
  
  .statistic-tendency-page .exam-report-title-table .exam-report-date-cell {
  
    text-align: center;
  
  }
  
  
  
  .statistic-tendency-page .exam-report-title-table td {
  
    border: 0;
  
    vertical-align: bottom;
  
    line-height: 30px;
  
    border-collapse: collapse;
  
  }
  
  
  
  .statistic-tendency-page .exam-report-title-table .exam-report-title-cell {
  
    font-size: 32px;
  
    line-height: 40px;
  
    text-align: center;
  
  }
  
  
  
  .statistic-tendency-page .exam-report-datas-div {
  
    width: 100%;
  
    padding: 0 12px;
  
    margin-top: 10px;
  
  }
  
  
  
  .statistic-tendency-page .exam-report-datas-table {
  
    border: 1px;
  
    border-color: #333;
  
  }
  
  
  
  .statistic-tendency-page .exam-report-datas-table th,
  
  .statistic-tendency-page .exam-report-datas-table td {
  
    border: 1px solid #333;
  
    padding: 3px;
  
    text-align: center;
  
  }
  
  
  
  .statistic-tendency-page .exam-report-datas-table th {
  
    background-color: #efefef;
  
  }
  
  
  
  .statistic-tendency-page .exam-report-datas-table td.table-gap,
  
  .statistic-tendency-page .exam-report-datas-table th.table-gap {
  
    border-top: 0;
  
    border-bottom: 0;
  
    width: 10px;
  
    background-color: #fff;
  
  }
  
  
  
  .statistic-tendency-page .exam-report-footer {
  
    margin: 10px 12px;
  
  }
  
  
  
  .label-0 {
  
    font-size: 2em;
  
  }
  
  
  
  .label-1 {
  
    font-size: 1.5em;
  
    fill: #111;
  
  }
  
  
  
  .label-2 {
  
    font-size: 1em;
  
    fill: #444;
  
  }
  
  
  
  .label-3 {
  
    font-size: .9em;
  
    fill: #888;
  
  }
  
  
  
  .label-4 {
  
    font-size: .8em;
  
    fill: #aaa;
  
  }
  
  
  
  .link-0 {
  
    stroke: #000;
  
    stroke-width: 2px
  
  }
  
  
  
  .link-1 {
  
    stroke: #333;
  
    stroke-width: 1px
  
  }
  
  
  
  .link-2,
  
  .link-3,
  
  .link-4 {
  
    stroke: #666;
  
    stroke-width: .5px;
  
  }
  .wrapper-content{
    width:100%;
    height:auto;
    min-height:600px;
    border:1px solid #666;
    padding:0px 20px
  }
</style>
