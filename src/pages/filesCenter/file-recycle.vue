<template>
  <div class="iqis-page">

    <div class="iqis-page-context">
      <div class="iqis-bus-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-bus-table" style="flex: 1 1 100px;overflow: auto;">

          <div class="iqis-page-search-row" style="margin-bottom:10px; margin-right:8px;">
            <div class="iqis-page-search-bar-item" style="flex:0 0 210px;">
                <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('fileCenter.dateFilter')" style="width: 205px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
              <i-input v-model="search.query" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('fileCenter.searchAll')" slot="prepend" style="width: 120px;text-align: left">
                  <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
                </Select>
              </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px;">
              <Button style="margin-right:8px;" type="primary" @click="table.selected='';searchFile();">{{$t('fileCenter.search')}}</Button>
              <Button type="ghost" @click="reset">{{$t('fileCenter.reset')}}</Button>
            </div>
          </div>
          <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
              <!-- <Button v-if="permsBtn.DELETE_RECOVERY_FILE" type="ghost" icon="trash-a" @click='clear'>清空回收站</Button> -->
              <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"
                confirm
                :title="i18n.t('fileCenter.emptyRecyle')"
                placement="bottom-start"
                @on-ok="clear">
                <Button v-if="permsBtn.DELETE_RECOVERY_FILE" type="ghost" icon="trash-a" >{{$t('fileCenter.emptyTrash')}}</Button>
              </Poptip>
              <Button style="margin-left:8px;" v-if="permsBtn.INSERT_RECOVERY_FILE"  type="ghost" icon="reply" :disabled="!table.selected" @click="restore('no')">{{$t('fileCenter.reduction')}}</Button>
            </div>
            <div class="iqis-page-tool-second">
              <Button type="text"  icon="refresh" style="margin-right:2px;" @click="reset">{{$t('fileCenter.refreshData')}}</Button>
            </div>
          </div>
          <div class="Breadcrumb">
            <div class='Breadcrumb-left'>
              <span v-for="(item,index) in bads">
                <span v-if="index == bads.length-1" :class='index == bads.length-1 ?"":"clickSpan"'>{{item.label}}</span>
                <span v-if="index != bads.length-1" :class='index == bads.length-1 ?"":"clickSpan"' @click="refreshData(item.value)">{{item.label}}</span>
                <span v-show="index != bads.length-1" class='clickSpan'>></span>
              </span>
            </div>
            <div class='Breadcrumb-right'>{{$t('fileCenter.fullyLoaded')}}{{data.length}}{{$t('fileCenter.num')}}</div>
          </div>



          <Table ref="pageTable" class="tableCustom recycle" v-drag-table-column="table.columns" @on-selection-change="tableSelectChange" :loading="table.loading" border stripe :columns="table.columns" :data="data"></Table>
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
        data:[
        ],
        i18n:window.i18n,
        parentId:0,
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
            {type: 'selection',
              align: 'center',
              className:this.$store.state.customerId?'hide':'',
              minWidth:this.$store.state.customerId?0:40,
              maxWidth:this.$store.state.customerId?0:40
            },
            {
              title: i18n.t('fileCenter.fileN'),
              minWidth:300,
              className:'tablePadding',
              ellipsis:true,
              key: 'name',
              render: (h, params) => {
                //console.log(params)
                let imgUrl = './static/fileIcon/folder-fill.svg';
                if(params.row.fileDto.isDirectory){
                  imgUrl = './static/fileIcon/'+params.row.fileDto.type+'.svg'
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
                            if(params.row.fileDto.isDirectory === 0){
                              // this.refreshData(params.row.fileId)
                              // this.bads.push({value:params.row.fileDto.fileId,label:params.row.fileDto.name});
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
                  h('span',{
                    style:{
                      width:'100%',
                      height:'100%',
                      border:'none',
                      outline:'none',
                      // background:params.index%2 === 0 ?'#fff':'#f8f8f9'
                    },
                    domProps:{
                      value:params.row.name,
                      disabled:!params.row.changeState,
                      // className:'INITinput'
                    }
                  },params.row.fileDto.name)
                ])
              }
            },{
              title: i18n.t('fileCenter.version'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'version',
              render:(h,params)=>{
                return h('span',params.row.fileDto.version)
              }
            },{
              title: i18n.t('fileCenter.size'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'size',
              render:(h,params)=>{
                return h('span',params.row.fileDto.size)
              }
            },{
              title: i18n.t('fileCenter.originalLocation'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'directory',
            },{
              title: i18n.t('fileCenter.deletingPerson'),
              className:'tablePadding',
              width:103,
              minWidth:103,
              ellipsis:true,
              key: 'delUserName',
              render:(h,params)=>{
                return h('span',params.row.fileDto.delUserName)
              }
            },{
              title: i18n.t('fileCenter.deletingTime'),
              className:'tablePadding',
              width:130,
              minWidth:130,
              ellipsis:true,
              key: 'delTime',
              render:function(h,data){
                let value = data.row.fileDto.delTime;
                let str = "-"
                if(value){
                  var unixTimestamp = new Date(value);
                  str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                }
                return h("span",str);
              }
            },{
              title: i18n.t('fileCenter.remarks'),
              className:'tablePadding',
              minWidth:120,
              ellipsis:true,
              key: 'remarks',
              render:(h,params)=>{
                return h('span',params.row.fileDto.remarks)
              }
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
                label: i18n.t('fileCenter.deletingPerson'),
                value: "delUserName"
              }, {
                label: i18n.t('fileCenter.version'),
                value: "version"
              }
            ]
          }
        },
        permsCur:[
          "DELETE_RECOVERY_FILE",
          "INSERT_RECOVERY_FILE",
        ],
        permsBtn:{
          "INSERT_RECOVERY_FILE":false,
          "DELETE_RECOVERY_FILE":false,
        },
        noPermsDis:true,

      }
    },//end data

    created(){
      let permsAll = this.$store.state.permissions;
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.recycle .ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">列表暂无数据</div><div style="color:rgb(139, 139, 139);font-size:18px;margin-top:10px;">回收站为你保留30天内删除的文件</div>'
        $('.recycle .ivu-table-tip td').html(noData)
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
      restore(confirm){
        let that = this;
        let list = that.$refs.pageTable.getSelection();
        //console.log(list)
        let url = ''
        for(let i=0; i<list.length; i++){
            if(confirm=='no'){
              url = '/basic/recovery/file?id='+list[i].id
            }else{
              url = '/basic/recovery/file?id='+list[i].id+'&replaceFlag=true'
            }
            that.$http.post(url).then(res => {
              if(!res.data){
                that.$Message.success(i18n.t('fileCenter.reductionSuccess'))
                that.refreshData(0);
              }else{
                that.$Modal.confirm({
                    title: i18n.t('fileCenter.tips'),
                    content: i18n.t('fileCenter.existingDirectory')+list[i].fileDto.name+i18n.t('fileCenter.isReplace'),
                    onOk: () => {
                        that.restore('yes')
                    },
                    onCancel: () => {

                    }
                });
              }
            });
        }
      },
      clear(){
        this.$http.delete('/basic/recovery/file').then(res=>{
          this.$Message.success(i18n.t('fileCenter.clearanceSuccess'));
          this.refreshData(0)
        }).catch(err =>{

        })
      },
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
        this.$http.get("/basic/search/recovery/file",{params:params}).then(function (res) {
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
        this.$http.get("/basic/recovery/file").then(function (res) {
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
      tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
      }
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
  .INITinput[disabled]{
    background: #fff;
    z-index: 0;
  }
  .INITinput:hover{
    background: #ebf7ff;
  }
</style>
