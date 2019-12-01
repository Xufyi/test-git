<template>
  <div class="iqis-page">

    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">

          <div class="iqis-page-search-row" style="margin-bottom:10px;">
            <div class="iqis-page-search-bar-item" style="flex:0 0 210px; margin-right:8px;">
                <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('customer.dateFilter')" style="width: 205px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('customer.searchAll')" slot="prepend" style="width: 120px;text-align: left">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
              <Button style="margin-right:8px;" type="primary" @click="searchFile();table.selected='';">{{$t('customer.search')}}</Button>
              <Button type="ghost" @click="reset">{{$t('customer.reset')}}</Button>
            </div>
              <Button type="text"  icon="refresh" style="margin-right:2px;color:#4896E4" @click="reset">{{$t('customer.refreshData')}}</Button>
          </div>
          <div class="Breadcrumb">
            <div class='Breadcrumb-left'>
              <span v-for="(item,index) in bads">
                <span v-if="index == bads.length-1" :class='index == bads.length-1 ?"":"clickSpan"'>{{item.label}}</span>
                <span v-if="index != bads.length-1" :class='index == bads.length-1 ?"":"clickSpan"' @click="refreshData(item.value)">{{item.label}}</span>
                <span v-show="index != bads.length-1" class='clickSpan'>></span>
              </span>
            </div>
            <div class='Breadcrumb-right'>{{$t('fileCenter.loadAll')}}{{data.length}}{{$t('fileCenter.num')}}</div>
          </div>



          <Table ref="pageTable" class="tableCustom" v-drag-table-column="table.columns" :loading="table.loading" border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display:inline-block"> -->
            <div style="padding: 20px 0 20px 0px;">
            </div>
          <!-- </div> -->
          <!-- <div style="display: inline-block;">
            <div style="float: left;margin: 4px;line-height: 24px;">
                <Button type="primary" size="small" @click="goElevatorPage">跳转</Button>
            </div>
          </div> -->


        </div>
      </div>

    </div>
  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import ICol from "iview/src/components/grid/col";
  import $ from "jquery"
  export default {
    components: {
      ICol,
      Input
    },
    data: function () {
      let vm = this;
      return {
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        parentId:0,
        i18n:window.i18n,
        data:[],
        bads:[
          {value: 0,
          label: i18n.t('fileCenter.allFile'),}
        ],
        table:{
          selected:false,
          loading:true,
          pager:{
            rows:10,
            need:true,
            total:100,
            limit:10,
            current:1
          },
          columns:[
            {
              title: i18n.t('fileCenter.fileN'),
              minWidth:300,
              className:'tablePadding',
              ellipsis:true,
              key: 'name',
              render: (h, params) => {
                //console.log(params)
                let imgUrl = './static/fileIcon/folder-fill.svg';
                if(params.row.isDirectory){
                  imgUrl = './static/fileIcon/'+params.row.type+'.svg'
                }
                return h('div',{
                  style: {
                          width:'100%',
                          heihgt:'100%',
                          paddingLeft:'40px',
                          position:'relative',
                          cursor:'pointer'
                        },
                        on:{
                          click:()=>{
                            if(params.row.isDirectory === 0){
                              this.refreshData(params.row.fileId)
                              this.bads.push({value:params.row.fileId,label:params.row.name});
                            }
                          }
                        }
                      },
                [
                  h('img',{
                    style: {
                        // width:'20px',
                        // heihgt:'17px',
                        display:'inline-block',
                        position:'absolute',
                        top:'0px',
                        left:'8px'
                      },
                      domProps:{
                        src:imgUrl,
                        className:'initFileImg'
                      }
                  }),
                  h('input',{
                    style:{
                      width:'100%',
                      height:'100%',
                      border:'none',
                      outline:'none',
                      background:'transparent'
                    },
                    domProps:{
                      value:params.row.name,
                      disabled:!params.row.changeState,
                      className:'INITinput'
                    }
                  })
                ])
              }
            },{
              title: i18n.t('fileCenter.version'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'version'
            },{
              title: i18n.t('fileCenter.size'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'size'
            },{
              title: i18n.t('fileCenter.creator'),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'createrName'
            },{
              title: i18n.t('fileCenter.uploadTime'),
              className:'tablePadding',
              width:130,
              minWidth:130,
              ellipsis:true,
              key: 'createTime',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = "-"
                if(value){
                  var unixTimestamp = new Date(value);
                  str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                }
                return h("span",str);
              }
            },{
              title: i18n.t('fileCenter.action'),
              className:'tablePadding',
              width:220,
              ellipsis:true,
              key: 'action',
              render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {
                            type: 'text',
                            size: 'small'
                        },
                        style: {
                          color:'#418FEE',
                            marginRight: '12px',
                            display:this.permsBtn.DELETE_HISTORICAL_FILE ? 'inline-block' : 'none'
                        },
                        on: {
                            click: () => {
                              let that = this;
                                that.$http.delete('/basic/historicalFile?fileIds[]='+params.row.fileId).then(function(resp){
                                  that.$Message.success(i18n.t('fileCenter.deleteSuccess'));
                                  that.refreshData()
                                })
                            }
                        }
                    }, i18n.t('fileCenter.delete')),
                ]);
            }
            },{
              title: i18n.t('fileCenter.remarks'),
              className:'tablePadding',
              minWidth:120,
              ellipsis:true,
              key: 'remarks'
            }
          ]
        },
        search: {
          query: "",
          fieldName: "",
          typeDataLoading:false,
          data: {
            searchTypes: [
              {
                label: i18n.t('fileCenter.searchAll'),
                value: ""
              }, {
                label: i18n.t('fileCenter.catalogFileName'),
                value: "name"
              }, {
                label: i18n.t('fileCenter.creator'),
                value: "createrName"
              }, {
                label: i18n.t('fileCenter.version'),
                value: "version"
              }
            ]
          }
        },
        permsCur:[
          "DELETE_HISTORICAL_FILE",
        ],
        permsBtn:{
          "DELETE_HISTORICAL_FILE":false,
        },
        noPermsDis:true,

      }
    },//end data

    created(){
      let permsAll = this.$store.state.permissions;
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
      this.refreshData(0);
    },
    watch:{
      renderList:function(a,b){
        if(a){
          this.reset();
        }
      },
      data:{
        handler: function (val, oldVal) {
          this.$nextTick(()=>{
            let img = document.getElementsByClassName('initFileImg');
              for(let i=0;i<img.length;i++){
                img[i].onerror = function(){
                  img[i].src = './static/fileIcon/defulat.svg'
                  // img[i].onerror = null;
                }
              }
          })
         },
        deep: true
      },
    },
    methods:{
      reset(){
        this.search.dates=[];
        this.table.selected='';
        this.search.query='';
        this.search.fieldName='';
        this.refreshData(0);
        this.pageChange(1)
      },
      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;

      },
      pageChange(page){
        this.table.pager.current = page;
      },
      searchFile(){
        let that = this;
        let params = {};
        let startDate = '';
        let endDate = '';
        if(this.search.dates && this.search.dates[0]){
          startDate = this.$iqis.utils.getDayStart(1,this.search.dates[0]);
          endDate = this.$iqis.utils.getDayEnd(this.search.dates[1]);
          params.query='startDate='+startDate+'&endDate='+endDate+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }else{
          params.query='field='+that.search.fieldName+'&keyword='+that.search.query;
        }
        this.$http.get("/basic/search/history/file",{params:params}).then(function (res) {
          for(let i=0;i<res.data.length;i++){
            res.data[i]._checked = false;
            res.data[i].changeState = false;
          }
          that.data = res.data;
          that.table.loading = false;

        }).catch(err=>{
          that.table.loading = false;
        })
      },
      refreshData(parentId){
        this.parentId = parentId;
        let index = 0;
        let length = this.bads.length;
        for(let i=0;i<this.bads.length;i++){
          if(this.parentId != 0){
            if(this.bads[i].value == this.parentId){
              index = i;
              break
            }
          }
        }
        if(this.parentId === 0){
          this.bads = [{value: 0,label: i18n.t('fileCenter.allFile')}];
          index = 0;
        }
        if(index){
          let len = length - index;
          this.bads.splice(index+1,len);
        }
        let that = this;
        that.table.loading = true;
        let params = {};
        if(this.search.dates && this.search.dates[0]){
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];

          params.startDate = this.$iqis.utils.getDayStart(1,sdate);
          params.endDate = this.$iqis.utils.getDayEnd(edate);
        }
        params.parentId = parentId;
        params.customerId = this.$store.state.customerId||'';
        this.$http.get("/basic/historicalFile").then(function (res) {
          for(let i=0;i<res.data.length;i++){
            res.data[i]._checked = false;
            res.data[i].changeState = false;
          }
          that.data = res.data;
          that.table.loading = false;

        }).catch(err=>{
          that.table.loading = false;
        })
        this.$store.commit("RENDER_CHANGE",false);
      },
    }
  }

</script>
<style>
.Breadcrumb{
    width:100%;
    height:25px;
  }
  .Breadcrumb-left{
    float:left;
  }
  .Breadcrumb-left .clickSpan{
    color:#418FEE;
    cursor: pointer;
  }
  .Breadcrumb-right{
    float:right;
  }
</style>
