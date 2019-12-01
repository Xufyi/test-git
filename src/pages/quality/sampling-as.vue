<template>
  <div class="iqis-page">
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary iqis-sampling-search-bar">
        <Select v-model="search.plan" style="width:160px">
          <Option v-for="item in selects.plan" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="search.level" style="width:160px">
          <Option v-for="item in selects.level" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="search.tolerance" style="width:160px">
          <Option v-for="item in selects.tolerance" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

      </div>
      <div class="iqis-page-tool-second">

      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-product-unit-table " style="flex: 1 1 100px;">
        <!--v-drag-table-column="table.columns"-->
        <Table class="sampling-table" border stripe highlight-row :height="490" :columns="table.columns" :loading="table.loading" :data="data">

        </Table>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        search:{
          plan:"105E",
          level:1,
          tolerance:"normal"
        },
        selects:{
          plan:[
            {
              value:"105E",
              label:i18n.t("quality.sp")
            },{
              value:"Z1-4",
              label:i18n.t("quality.zsp")
            },{
              value:"0D",
              label:i18n.t("quality.zdsp")
            }
          ],
          level:[],
          tolerance:[]
        },
        samplingData:{
          "105E":{
            "level":[
              {
                label:i18n.t("quality.gl1"),
                value:1
              },{
                label:i18n.t("quality.gl2"),
                value:2
              },{
                label:i18n.t("quality.gl3"),
                value:3
              },{
                label:i18n.t("quality.sl1"),
                value:101
              },{
                label:i18n.t("quality.sl2"),
                value:102
              },{
                label:i18n.t("quality.sl3"),
                value:103
              }, {
                label:i18n.t("quality.sl4"),
                value: 104
              }
            ],
            "tolerance":[
              {
                "label":i18n.t("quality.normal"),
                "value":"normal"
              },
              {
                "label":i18n.t("quality.stricter"),
                "value":"stricter"
              },
              {
                "label":i18n.t("quality.soften"),
                "value":"soften"
              }
            ],
            "aql":[
              "0.010",
              "0.015",
              "0.025",
              "0.040",
              "0.065",
              "0.10",
              "0.15",
              "0.25",
              "0.40",
              "0.65",
              "1.0",
              "1.5",
              "2.5",
              "4.0",
              "6.5",
              "10",
              "15",
              "25",
              "40",
              "65",
              "100",
              "150",
              "250",
              "400",
              "650",
              "1000"
            ]
          }
          ,"Z1-4":{
            "level":[
              {
                label:i18n.t("quality.gl1"),
                value:1
              },{
                label:i18n.t("quality.gl2"),
                value:2
              },{
                label:i18n.t("quality.gl3"),
                value:3
              }
            ],
            "tolerance":[
              {
                "label":i18n.t("quality.normal"),
                "value":"normal"
              },
              {
                "label":i18n.t("quality.stricter"),
                "value":"stricter"
              },
              {
                "label":i18n.t("quality.soften"),
                "value":"soften"
              }
            ],
            "aql":[
              "0.010",
              "0.015",
              "0.025",
              "0.040",
              "0.065",
              "0.10",
              "0.15",
              "0.25",
              "0.40",
              "0.65",
              "1.0",
              "1.5",
              "2.5",
              "4.0",
              "6.5",
              "10"
            ]
          }
          ,"0D":{
            "level":[
              {
                label:i18n.t("quality.zd"),
                value:1
              }
            ],
            "tolerance":[
              {
                "label":i18n.t("quality.zd"),
                "value":"normal"
              }
            ],
            "aql":[
              "0.010",
              "0.015",
              "0.025",
              "0.040",
              "0.065",
              "0.10",
              "0.15",
              "0.25",
              "0.40",
              "0.65",
              "1.0",
              "1.5",
              "2.5",
              "4.0",
              "6.5",
              "10"
            ]
          }
        },

        data:[],
        tableEditDis:true,
        table:{
          loading:true,
          columns:[
            {
              title:"loading"
            }
          ]
        }
      };
    },
    created(){
      this.updatePlan();
    },
    watch:{
      "search.plan":"updatePlan",
      "search.level":"updateData",
      "search.tolerance":"updateData",
    },
    methods:{
      updatePlan(){
        this.selects.level = this.samplingData[this.search.plan].level;
        this.search.level = this.selects.level[0].value;

        this.selects.tolerance = this.samplingData[this.search.plan].tolerance;
        this.search.tolerance = this.selects.tolerance[0].value;

        this.updateData();
      },
      updateData(){
        let that = this;
        let type = this.search.plan;
        this.table.loading = true;

        this.$http.get("/sampling-plan/table/"+this.search.plan,{params:{"level":this.search.level,"tolerance":this.search.tolerance,"type":0}})
          .then(function (resp) {
            let columns = [
              {
                "key":"batchStart",
                "minWidth":that.$store.state.locale=='zh_CN'?65:90,
                fixed:"left",
                "title":i18n.t("quality.ib")
              },{
                "key":"batchEnd",
                "minWidth":that.$store.state.locale=='zh_CN'?75:100,
                fixed:"left",
                "title":i18n.t("quality.btd")
              },{
                "key":"lineCode",
                "minWidth":that.$store.state.locale=='zh_CN'?50:90,
                fixed:"left",
                "title":i18n.t("quality.cn")
              },{
                "key":"num",
                "minWidth":that.$store.state.locale=='zh_CN'?60:120,
                "align":"center",
                fixed:"left",
                "title":i18n.t("quality.sn")
              }
            ];
            var addStr = "";
            if(type == "0D"){
              columns = [
                {
                  "key":"batchStart",
                  "minWidth":65,
                  //fixed:"left",
                  "title":i18n.t("quality.ib")
                },{
                  "key":"batchEnd",
                  "minWidth":65,
                  //fixed:"left",
                  "title":i18n.t("quality.btd")
                }
              ];

              for(var i=0;i<resp.data.rows.length;i++){
                var row = resp.data.rows[i];
                for(var f in row){
                  if(f.indexOf("aql_") == 0){
                    row[f] = row[f].replace(",1","");
                  }
                }
              }
            }else{
              //addStr = "<br />AC,RE";
            }

            for (var i=0;i<resp.data.aqls.length;i++){
              let aql = resp.data.aqls[i];
              columns.push({
                "key":"aql_"+aql,
                "minWidth":60,
                "align":"center",
                "title":aql+addStr,
                render: (h,params) => {
                  let that = this;
                  return h('div',{
                    attrs:{
                      title:'样本数：'+params.row["realSampleNum_"+aql],
                    },
                    style:{
                      cursor:"pointer"
                    },
                  },params.row["aql_"+aql])
                }
              });
            }

            that.table.columns = columns;
            that.data = resp.data.rows;
            that.table.loading = false;

          });




      }

      //////
    }

  }

</script>
<style scoped>
  .iqis-sampling-search-bar .ivu-select{
    margin-right: 12px;
  }
</style>
<style>
  .sampling-table .ivu-table-cell{
    padding: 3px !important;
  }
</style>
