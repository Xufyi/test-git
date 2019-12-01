<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 210px; margin-right:8px;">
        <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" :placeholder="i18n.t('fileCenter.dateFilter')" style="width: 200px"></DatePicker>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('fileCenter.searchAll')" slot="prepend" style="width: 110px;text-align:left;">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="table.selected='';searchData()">{{$t('fileCenter.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t('fileCenter.reset')}}</Button>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 24px;text-align:right">
        <!-- <Button type="primary" @click="refreshData(parentId)">刷新</Button> -->
        <Button type="text"  icon="refresh" @click="refreshData(parentId)" style='color:#4896E4'>{{$t('fileCenter.refreshData')}}</Button>

      </div>
    </div>
    <div class="iqis-page-tool-row">
      <!-- <div class="iqis-page-tool-primary">
        <Button type="ghost"  icon="edit" @click="addUpload()" >上传</Button>
        <Button type="ghost" icon="plus"  @click="addFileBag()">添加文件夹</Button>
        <Button type="ghost"  icon="edit" :disabled="tableEditDis" @click='download'>下载</Button>
        <Button type="ghost"  icon="edit" :disabled="tableEditDis" @click="moveFile">移动</Button>
        <Button type="ghost"  icon="edit" :disabled="tableEditDis" @click='quanxian()'>权限</Button>
        <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"
          confirm
          title="确定要删除选择的项吗?"
          placement="bottom-start"
          @on-ok="deleteTableSelected">
          <Button type="ghost"  icon="trash-a" :disabled="!table.selected">删除</Button>
        </Poptip>
      </div> -->
      <!-- <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="reset">刷新</Button>
      </div> -->
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
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table class="tableCustom" ref="pageTable" v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
        </div>
      </div>
    </div>
     <Modal
      :title="i18n.t('fileCenter.addFolder')"
      v-model="addFileBagState"
      :closable="false"
      :mask-closable="false"
      :width="600" >
      <Row type="flex" :gutter="40">
          <i-col span="12">{{$t('fileCenter.folderName')}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
          <i-col span="24">
            <Input  placeholder="请输入" v-model="addFileBagName" style="width: 100%;"></Input>
          </i-col>
        </Row>
        <Row type="flex" :gutter="40" style='margin-top:30px'>
          <i-col span="12">{{$t('fileCenter.remarks')}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
          <i-col span="24">
            <Input  placeholder="请输入" v-model="remarks" type='textarea' style="width: 100%;"></Input>
          </i-col>
        </Row>
        <div slot="footer">
        <Button type="primary" size="large" @click="addFileBagsOK" >{{$t('fileCenter.confirm')}}</Button>
        <Button type="text" size="large" @click="addFileBagsCan">{{$t('fileCenter.cancel')}}</Button>
      </div>
      </Modal>
      <!-- 文件上传 -->
      <Modal
      :title="i18n.t('fileCenter.uploadFile')"
      v-model="addUploadState"
      :mask-closable="false"
      :width="'600px'"
      :closable="false"
      class='initModel'
      >
        <!-- <div class="Breadcrumb"> -->
          <!-- <div class='Breadcrumb-left'>
            <span class='' style=''>文件目录 ></span>
            <span class='' >生产管理</span>
          </div> -->

        <!-- </div> -->
        <form ref='files'>
            <input type="file" ref='inputFiles' @change="selectFilesCh" style='display:none;'>
          </form>
        <div class="filesList">
          <ul>
            <li class='tabTop fileItem' v-for="(item,index) in uploadLists">
              <div class='fileName'><img :src="'./static/fileIcon/'+item.type+'.svg'" class='initFileImg'  alt=""> {{item.name}} <span>( {{item.size}} )</span>  </div>
              <div class='fileBb' v-if='!item.uploading'>
                <span v-show='!item.changState' class='edit' @click="changeFileListItemVersion(index)"></span>
                <span v-show='!item.changState'> {{item.version}}</span>
                <input type="text" class='versionInput' v-model="item.version" :ref='"changeFileListItemVersion"+index' @blur="changeFileListItemVersionInput(index)" v-show='item.changState'>
              </div>
              <div class="fileBb" v-if='item.uploading'>
                <Progress status="active" :percent="item.uploadingNum" :stroke-width="5" />
              </div>
              <div class='fileDelete'>
                <span class='deleteUploadsList' @click='deleteFileList(index)'></span>
              </div>
            </li>
          </ul>
          <div style='width:100%;position:absolute;bottom:5px;padding:5px 0px;height:40px;'>
            <Button  class="iqis-table-footer-btn" @click="upload()" slot="footer" type="ghost" :disabled='onUploading' style="width:100%;position:absolute;bottom:0" icon="plus">{{$t('fileCenter.add')}}</Button>
          </div>
        </div>
        <div style='margin-top:20px;font-size:14px;'><span>{{$t('fileCenter.setPermission')}}</span> <div style='float:right'> <Checkbox v-model="checkAll1"  @click.prevent.native="selectAll">{{$t('fileCenter.selectAll')}}</Checkbox> </div></div>
        <div class="userList">
          <CheckboxGroup v-model="QX">
            <Checkbox v-for="(item,index) in userList" class='initCheckBox' :label="item.userId" :key="item.userId">{{item.name}}</Checkbox>
          </CheckboxGroup>
        </div>
        <Row type="flex" :gutter="40" style='margin-top:10px'>
          <i-col span="12">{{$t('fileCenter.remarks')}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
          <i-col span="24">
            <Input  placeholder="请输入" v-model="remarks" type='textarea' style="width: 100%;"></Input>
          </i-col>
        </Row>
        <div slot="footer">
        <Button type="primary" size="large" @click="uploadSQL" >{{$t('fileCenter.confirm')}}</Button>
        <Button type="text" size="large" @click="addFileBagsCan">{{$t('fileCenter.cancel')}}</Button>
      </div>
      </Modal>
      <Modal
      :closable="false"
      :title="i18n.t('fileCenter.filePerms')"
      v-model="quanxianState"
      :mask-closable="false">
            <div style='font-size:14px;'><span>{{$t('fileCenter.setPermission')}}</span> <div style='float:right'> <Checkbox v-model="checkAll1"  @click.prevent.native="selectAll">{{$t('fileCenter.selectAll')}}</Checkbox> </div></div>
        <div class="userList">
          <CheckboxGroup v-model="QX">
            <Checkbox v-for="(item,index) in userList" class='initCheckBox' :label="item.userId" :key="item.userId">{{item.name}}</Checkbox>
          </CheckboxGroup>
        </div>
        <div slot="footer">
        <Button type="primary" size="large" @click="setQX" >{{$t('fileCenter.confirm')}}</Button>
        <Button type="text" size="large" @click="addFileBagsCan">{{$t('fileCenter.cancel')}}</Button>
      </div>
      </Modal>
      <Modal
      :title="i18n.t('fileCenter.moveTo')"
      v-model="moveState"
      :mask-closable="false">
      <div style='width:100%;height:400px;overflow-y:auto;'>
        <Tree ref='fileTree' :data="treeData" class='initTreeBag'></Tree>
      </div>
        <div slot="footer">
        <Button type="primary" size="large" @click="moveFileOK" >{{$t('fileCenter.confirm')}}</Button>
        <Button type="text" size="large" @click="addFileBagsCan">{{$t('fileCenter.cancel')}}</Button>
      </div>
      </Modal>
      <Modal
      :title="i18n.t('fileCenter.fileDetail')"
      v-model="fileInfoState"
      :mask-closable="false">
        <Row type="flex" :gutter="40" style='margin-bottom:16px'>
          <i-col span="24">
            <div class='infoItem'>
              <span class='left'>{{$t('fileCenter.fileName')}}：</span><span class='right'>{{fileInfoData.name}}</span>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="40" style='margin-bottom:16px'>
          <i-col span="12">
            <div class='infoItem'>
              <span class='left'>{{$t('fileCenter.fileType')}}：</span><span class='right'>{{fileInfoData.isDirectory === 0?i18n.t('fileCenter.folder'):fileInfoData.type}}</span>
            </div>
          </i-col>
          <i-col span="12">
            <div class='infoItem'>
              <span class='left'>{{$t('fileCenter.fileSize')}}：</span><span class='right'>{{fileInfoData.size}}</span>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="40" style='margin-bottom:16px'>
          <i-col span="24">
            <div class='infoItem'>
              <span class='left'>{{$t('fileCenter.catalogues')}}：</span>
              <span v-for="(item,index) in bads">
                <span v-if="index == bads.length-1" class='right'>{{item.label}}</span>
                <span v-if="index != bads.length-1" class='right' >{{item.label}}</span>
                <span v-show="index != bads.length-1" class='right'>></span>
              </span>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="40" style='margin-bottom:16px'>
          <i-col span="12">
            <div class='infoItem'>
              <span class='left'>{{$t('fileCenter.uploadTime')}}：</span>
              <span class='right'>
                  {{ (new Date(fileInfoData.createTime).Format("yyyy-MM-dd hh:mm")) }}
              </span>
            </div>
          </i-col>
          <i-col span="12">
            <div class='infoItem'>
              <span class='left'>{{$t('fileCenter.editTime')}}：</span>
              <span class='right'>
                  {{ fileInfoData.updateTime ?(new Date(fileInfoData.updateTime).Format("yyyy-MM-dd hh:mm")):'-' }}
              </span>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="40" style='margin-bottom:30px'>
          <i-col span="12">
            <div class='infoItem'>
              <span class='left'>{{$t('fileCenter.downloadCount')}}：</span>
              <span class='right'>
                  {{ fileInfoData.downloadCount?fileInfoData.downloadCount:0 }}
              </span>
            </div>
          </i-col>
          <i-col span="12">
            <div class='infoItem'>
              <span class='left'>{{$t('fileCenter.collectCount')}}：</span>
              <span class='right'>
                  {{ fileInfoData.collectCount?fileInfoData.collectCount:0 }}
              </span>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="40" style='margin-bottom:13px'>
          <i-col span="12">
            <div class='infoItem'>
              <span class='left'>{{$t('fileCenter.remarks')}}</span>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="40">
          <i-col span="24">
            <div class='infoItem'>
              <div class='rem'>
                {{ fileInfoData.remarks}}
              </div>
            </div>
          </i-col>
        </Row>
        <div slot="footer">
        <Button type="primary" size="large" @click="moveFileOK" >{{$t('fileCenter.confirm')}}</Button>
        <Button type="text" size="large" @click="addFileBagsCan">{{$t('fileCenter.cancel')}}</Button>
      </div>
      </Modal>
  </div>
</template>
<script>
  import Input from "iview/src/components/input";
  import draggable from 'vuedraggable';
  import $ from 'jquery'
  export default {
    components: {
      Input,draggable
    },
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        headers: {
        headers: { "Content-Type": "application/json; charset=UTF-8" }
      },
      onUploading:false,
      fileInfoData:{

      },
      fileInfoState:false,
      qxPS:false,
      qxIndex:null,
      ossKey:'',
      policy:'',
      treeData:[],
      moveState:false,
      uploadLists:[],
      OSSAccessKeyId:'',
      success_action_status:'',
      signature:'',
      checkAll1:false,
        QX:[],
        userList:[],
        quanxianState:false,
        remarks:'',
        addUploadState:false,
        allBagData:[
          {
            value: '0',
            label: i18n.t('fileCenter.allFile'),
            children:[]
          }
        ],
        bads:[
          {value: 0,
          label: i18n.t('fileCenter.allFile'),}
        ],
        parentId:0,
        addFileBagState:false,
        addFileBagName:'',
        addFileBagParentId:[],
        data:[],
        tableEditDis:true,
        table:{
          selected:false,
          loading:true,
          pager:{
            rows:10,
            need:true,
            total:0,
            limit:999999,
            current:1
          },
          columns:[
            // {type: 'selection',
            //   align: 'center',
            //   className:this.$store.state.customerId?'hide':'',
            //   minWidth:this.$store.state.customerId?0:40,
            //   maxWidth:this.$store.state.customerId?0:40
            // },
            {
              title: i18n.t('fileCenter.fileName'),
              minWidth:300,
              className:'tablePadding',
              ellipsis:true,
              key: 'name',
              render: (h, params) => {
                let name = params.row.name.split('.')
                let type = '';
                let nameStr = '';
                if(params.row.isDirectory){
                  name.splice(name.length-1,1)
                  type = name[name.length-1];
                  for(let i=0;i<name.length;i++){
                    nameStr += name[i]
                  }
                }else{
                  nameStr = params.row.name;
                }
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
                            if(params.row.isDirectory === 0 && !this.data[params.index].changeState){
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
                  h('span',{
                    style:{
                      display:this.data[params.index].changeState?'none':'block'
                    }
                  },params.row.name),
                  h('input',{
                    style:{
                      width:'100%',
                      height:'100%',
                      // border:'none',
                      outline:'none',
                      background:params.index%2 === 0 ?'#fff':'#f8f8f9',
                      display:!this.data[params.index].changeState?'none':'block',
                      border:'1px solid #e9eaec'
                    },
                    domProps:{
                      value:nameStr,
                      disabled:!this.data[params.index].changeState,
                      className:'INITinput',
                      id:'filesInputID'+params.row.name+params.index
                    },
                    on:{
                      blur:(e)=>{
                        this.data[params.index].changeState = false;
                        let type = params.row.type?'.'+params.row.type:'';
                        if((e.target.value+type) !== params.row.name){
                          this.data[params.index].name = e.target.value+type
                          this.$http.put('/basic/rename/file?fileId='+params.row.fileId+'&name='+e.target.value+type).then(res=>{});
                        }
                        this.$nextTick(()=>{
                        let img = document.getElementsByClassName('initFileImg');
                          for(let i=0;i<img.length;i++){
                            img[i].onerror = function(){
                              img[i].src = './static/fileIcon/defulat.svg'
                              // img[i].onerror = null;
                            }
                          }
                        })
                      }
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
            },
            {
              title: i18n.t('fileCenter.size'),
              className:'tablePadding',
              width:80,
              minWidth:80,
              ellipsis:true,
              key: 'size'
            },{
              title: i18n.t('fileCenter.uploader'),
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
                        style:{
                          color:'#418FEE',
                          marginRight: '12px',
                          display:params.row.isDirectory === 1 ? 'inline-block' : 'none'

                        },
                        on: {
                            click: () => {
                                // this.openFileInfo(params.index)
                                this.download(params.row.fileId)
                            }
                        }
                    }, '下载')
                ]
                );
            }
            },{
              title: i18n.t('fileCenter.remarks'),
              className:'tablePadding',
              minWidth:120,
              ellipsis:true,
              key: 'remarks',
              render:(h,params)=>{
                return h('div',[
                  h('span',{
                    style:{
                      display:!this.data[params.index].changeRemarkState?'inline-block':'none',
                      height:'100%',
                      width:'100%',
                      overflow:'hidden',
                      textOverflow:"ellipsis",
                      whiteSpace: "nowrap",
                    },
                    on:{
                      click:() => {
                        this.data[params.index].changeRemarkState = true;
                        this.$nextTick(()=>{
                          document.getElementById('RemarkID'+params.row.name+params.index).children[0].focus();
                        })
                      }
                    }
                  },params.row.remarks),
                  h('Input',{
                    props:{
                      type:'textarea',
                      value:this.data[params.index].remarks,
                      autofocus:true,
                      autosize:true,
                      maxlength:600
                    },
                    domProps:{
                      id:'RemarkID'+params.row.name+params.index
                    },
                    style:{
                      display:this.data[params.index].changeRemarkState?'inline-block':'none',
                    },
                    on:{
                      'on-blur':()=>{
                        this.data[params.index].changeRemarkState = false;
                      }
                    }
                  })
                ]);
              }
            }
          ]
        },
        search: {
          dates:"",
          query: "",
          fieldName: "",
          result:"",
          status:"",
          userList:[],
          data: {
            searchTypes: [
              {
                label: i18n.t('fileCenter.searchAll'),
                value: ""
              }, {
                label: "i18n.t('fileCenter.catalogues')/i18n.t('fileCenter.fileName')",
                value: "name"
              }, {
                label: i18n.t('fileCenter.creator'),
                value: "createrName"
              }, {
                label: i18n.t('fileCenter.version'),
                value: "version"
              },
            ]
          }
        },
        //获取产品编号/名称/客户信息
        urlProduct:{
          no:[],
          name:[],
          prodTypeName:[],
          cityList:[],
          prodTypeId:'',
          customerList:[],
          dataList:[],
          index:1
        },
      }
    },//end data
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
    created(){
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
      this.spectorName();
      this.refreshData(0);
      let permsAll = this.$store.state.permissions;
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    },
    computed:{
      renderList (){
        return this.$store.state.renderExamList;
      }
    },

    methods:{
      openFileInfo(k){
        let file = this.data[k];
        this.fileInfoData = file;
        this.fileInfoState = true;
      },
      download(fileId){
        // let list = this.$refs.pageTable.getSelection();
        // for(let i=0;i<list.length;i++){
            // if(list[i].isDirectory === 0){
            //   this.$Notice.warning({
            //     title: '请不要选择文件夹',
            //   });
            //   break;
            //   return;
            // }
            this.$iqis.download('/basic/download/myfile',{fileId:fileId},'get',()=>{});
        // }
      },
      moveFileOK(){
        let treeData = [];
        let list = this.$refs.pageTable.getSelection()
        if(list.length === 0){
          return;
        }
        treeData = this.$refs.fileTree.getSelectedNodes();
        if(treeData.length === 0){
          this.$Notice.warning({
            title: i18n.t('fileCenter.selectPlace'),
          });
          return;
        }
        let parentId = treeData[0].value;
        for(let i=0;i<list.length;i++){
          list[i].parentId = parentId;
          this.$http.put('/basic/move/file',list[i],this.headers).then(res=>{
            if(i === list.length-1){
              this.refreshData(this.parentId);
              this.$Notice.success({
                title: i18n.t('fileCenter.moveSuccess'),
              });
              this.addFileBagsCan();
            }

          }).catch(err=>{
            this.addFileBagsCan();
          });
        }
      },
      moveFile(){
        let list = this.$refs.pageTable.getSelection()
        this.$http.get('/basic/directory').then(res=>{
            if(res.data){
                for(let i=0;i<res.data.length;i++){
                  res.data[i].value = res.data[i].fileId;
                  res.data[i].children = [];
                  res.data[i].label = res.data[i].name;
                  res.data[i].title = res.data[i].name;
                  res.data[i].disabled=false;
                }
                for(let i=0;i<list.length;i++){
                  for(let j=0;j<res.data.length;j++){
                    if(list[i].fileId === res.data[j].fileId){
                      res.data[j].disabled=true;
                    }
                  }
                }
            }
           let data = [{
                value: '0',
                label: i18n.t('fileCenter.allFile'),
                title: i18n.t('fileCenter.allFile'),
                children:[],
                expand: true,
                disabled:this.parentId === 0 ?true:false,
              }]
            data[0].children =  this.initTreeData(this.$iqis.utils.clone(res.data),0);
            this.treeData = data;
            this.moveState = true;
        })
      },
      uploadSQL(){
        let params = [];
        let state = false;
        for(let i=0;i<this.uploadLists.length;i++){
          let item = this.uploadLists[i]
          if(item.version === ''){
            state = true;
            this.$Notice.error({
              // title:'请填写第'+(i+1)+'个文件的版本',
              title:i18n.t('fileCenter.versionNull')
            })
            break;
          }
          let itemFile = {
            name:item.name,
            parentId:this.parentId,
            remarks:this.remarks,
            roleIds:this.QX,
            size:item.size,
            type:item.type,
            version:item.version,
            url:item.url
          }
          params.push(itemFile)
        }
        if(params.length > 0 && !state){
            this.$http.post('/basic/file',params,this.headers).then(res=>{
              this.addUploadState = false;
              this.addFileBagsCan();
              this.refreshData(this.parentId);
            }).catch(err => {
              this.addFileBagsCan();
            })
          }else{

          }
      },
      uploadSQLCan(){},
      quanxian(){
        let list = this.$refs.pageTable.getSelection()
        if(list.length != 1){
          this.$Notice.warning({
            title: i18n.t('fileCenter.selectNoData'),
          });
          return;
        }
        if(list[0].isDirectory === 0){
          this.$Notice.warning({
            title: i18n.t('fileCenter.selectFolder'),
          });
          return;
        }
        this.QX = list[0].roleIds;
        this.quanxianState = true;
      },
      clickQX(index){
        if(this.data[index].isDirectory === 1){
          this.QX = this.data[index].roleIds
          this.qxPS = true;
          this.qxIndex = index;
          this.quanxianState = true;
        }else{
          this.$Notice.warning({
            title: i18n.t('fileCenter.selectFolder2'),
          });
        }

      },
      setQX(){
        if(!this.qxPS && this.qxIndex === null){
          let list = this.$refs.pageTable.getSelection();
          // this.quanxianState = false;
          if(list.length === 1 && list[0].isDirectory === 1){
            list[0].roleIds = this.QX;
            this.$http.put('/basic/permission/file',list[0],this.headers).then(res=>{
                this.addFileBagsCan();
                this.$Notice.success({
                  title: i18n.t('fileCenter.permsSuccess'),
                });
            }).catch(err=>{
              this.addFileBagsCan();
            });
          }
        }else{
            let list = this.data[this.qxIndex];
                list.roleIds = this.QX;
            let params = [list]
            this.$http.put('/basic/permission/file',params,this.headers).then(res=>{
                this.addFileBagsCan();
                this.qxPS = false;
                this.qxIndex = null;
                this.$Notice.success({
                   title: i18n.t('fileCenter.permsSuccess'),
                });
            }).catch(err=>{
              this.addFileBagsCan();
            });
        }
      },
      upload(){
            let url  = this.$http.defaults.baseURL == undefined || this.$http.defaults.baseURL == '' || this.$http.defaults.baseURL == null? "/file/policy" : this.$http.defaults.baseURL + '/file/policy'
            this.$http.get("/file/policy").then(res=>{
                this.ossKey=res.data.dir;
                this.policy=res.data.policy;
                this.OSSAccessKeyId=res.data.accessKeyId;
                this.success_action_status=201
                this.signature=res.data.signature;
            }).catch(err=>{
            })
            return this.$refs.inputFiles.click()
      },
      conver(limit){
                var size = "";
                if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B
                    size = limit.toFixed(2) + "B";
                }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB
                    size = (limit / 1024).toFixed(2) + "KB";
                }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB
                    size = (limit / (1024 * 1024)).toFixed(2) + "MB";
                }else{
                    //其他转化成GB
                    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
                }
                var sizestr = size + "";
                var len = sizestr.indexOf("\.");
                var dec = sizestr.substr(len + 1, 2);
                if(dec == "00"){
                    //当小数点后为00时 去掉小数部分
                    return sizestr.substring(0,len) + sizestr.substr(len + 3,2);
                }
                return sizestr;
        },
        submitFile(file){
          this.onUploading =true;
          let form = new FormData();
           let that = this;
            form.append('key',this.ossKey + file.name);
            form.append('policy',this.policy);
            form.append('OSSAccessKeyId',this.OSSAccessKeyId);
            form.append('success_action_status',this.success_action_status);
            form.append('signature',this.signature);
            form.append('x-oss-object-acl','public-read');
            form.append('file',file);
            form.append('filename',file.name);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'http://iqis.oss-cn-shenzhen.aliyuncs.com');
                xhr.onload = function (res) {
                  setTimeout(function(){
                          if( that.uploadLists[that.uploadLists.length-1].uploadingNum < 100){
                            that.$Notice.error({
                              title: i18n.t('fileCenter.uploadFail')
                            });
                            that.onUploading = false;
                          }
                  },60*1000)
                    if (xhr.status === 201) {
                        let url = that.parseXML(res.target.responseText).getElementsByTagName("Location")[0].firstChild.nodeValue;
                        url=url.replace("com//","com/");
                        that.uploadLists[that.uploadLists.length-1].url = url;
                        that.onUploading = false;
                        that.$Notice.success({
                          title: i18n.t('fileCenter.uploadSuccess'),
                        });
                    } else {
                      that.uploadLists.splice(that.uploadLists.length-1,1);
                      that.$Notice.error({
                        title: i18n.t('fileCenter.uploadFail2')
                      });
                      that.onUploading = false;

                    }
                };
                xhr.upload.onprogress = function (event) {
                    if (event.lengthComputable) {
                        var percent = Math.floor(event.loaded / event.total * 100) ;
                        // 设置进度显示
                        that.uploadLists[that.uploadLists.length-1].uploadingNum = percent;
                        if(percent === 100){
                          that.uploadLists[that.uploadLists.length-1].uploading = false;
                          that.onUploading = false;
                        }

                    }
                };
                xhr.send(form);
                this.$refs.files.reset()
        },
        parseXML(xmlString){
            var xmlDoc=null;
            if(!window.DOMParser && window.ActiveXObject)
            {
                var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
                for(var i=0;i<xmlDomVersions.length;i++){
                    try
                    {
                        xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                        xmlDoc.async = false;
                        xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                        break;
                    }
                    catch(e){}
                }
            }
            else if(window.DOMParser && document.implementation && document.implementation.createDocument) {try{var domParser = new  DOMParser();xmlDoc = domParser.parseFromString(xmlString, 'text/xml'); }catch(e){}}else{return null;}
            return xmlDoc;
        },
      selectFilesCh(){
        if(!this.onUploading){
            let fileList = this.$refs.inputFiles.files;
            let error = false
            let key = '';
                for (let i=0;i<fileList.length;i++) {
                    let file = fileList[i];
                    let fileInfo = file.name.split('.');
                    // if(fileInfo[1]){
                    //   error = true;
                    //   break
                    // }
                    let item = {
                        name: file.name,
                        size: this.conver(file.size),
                        file: file,
                        type:fileInfo[fileInfo.length-1],
                        url:'',
                        version:'',
                        changState:false,
                        uploading:true,
                        uploadingNum:0,
                    }
                    this.uploadLists.push(item);
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        // this.$set(item, 'src', e.target.result)
                    }
                    reader.readAsDataURL(fileList[i])
                    this.submitFile(file);
                }
        }else{
          this.$Notice.warning({
            title:i18n.t('fileCenter.uploading')
          })
        }

                if(error){
                    return;
                }
      },
      changeFileListItemVersion(k){
        this.uploadLists[k].changState = true;
        this.$nextTick(()=>{
          this.$refs['changeFileListItemVersion'+k][0].focus();
        })
      },
      changeFileListItemVersionInput(k){
        this.uploadLists[k].changState = false;
      },
      deleteFileList(k){
        this.uploadLists.splice(k,1);
      },
      addUpload(){
        this.addUploadState = true;
      },
      initTreeData(data, parentId) {
        var temp = [],
        children = [];
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          if (item.parentId == parentId) {
            children = this.initTreeData(data, item.fileId);
            if(children.length){
              item.expand = true
            }
            item.children = children;
            temp.push(item);
          }
        }
        return temp;
      },
      addFileBag(){
        this.addFileBagName = '',
        this.addFileBagParentId = [0],
        this.$http.get('/basic/directory').then(res=>{
            if(res.data){
                for(let i=0;i<res.data.length;i++){
                  res.data[i].value = res.data[i].fileId;
                  res.data[i].children = [];
                  res.data[i].label = res.data[i].name;
                }
            }
           let data = {
                value: '0',
                label: i18n.t('fileCenter.allFile'),
                children:[],
              }
            data.children =  this.initTreeData(this.$iqis.utils.clone(res.data),0);
            this.addFileBagState = true;
        })
      },
      selectAll(){
        this.checkAll1 = !this.checkAll1;
        if(this.checkAll1){
          for(let i=0;i<this.userList.length;i++){
            this.QX.push(this.userList[i].userId);
          }
        }else{
            this.QX = [];
        }
      },
      addFileBagsOK(){
        let params = {
          // "collectCount": 0, // 收藏
          // "createTime": "2018-09-18T02:51:45.188Z",
          // "createrId": 0,//创建人id
          // "createrName": "string",
          // "downloadCount": 0,下载次数
          // "fileId": 0,主键id
          // "isDirectory": 0,是否是文件夹
          // "isHistory": 0,是否是历史
          // "locationDirectory": "string",当前目录
          // "name": "string",filename
          // "orderId": 0,制订
          // "parentId": 0,
          // "previewCount": 0,预览
          // "remarks": "string",备注
          // "roleIds": [
          //   0
          // ],权限
          // "size": "string",
          // "tenantId": 0,
          // "type": "string",
          // "updateTime": "2018-09-18T02:51:45.188Z",
          // "version": "string"版本
          name:this.addFileBagName,
          parentId:this.parentId,
          remarks: this.remarks
        }
        this.$http.post('/basic/directory',params,this.headers).then(res => {
          this.refreshData(res.data.parentId);
          this.addFileBagState = false;
          this.this.addFileBagName = '';
          this.remarks = '';
        }).catch(err=>{
        })
      },
      addFileBagsCan(){
        this.addFileBagState = false;
        this.addFileBagName = '';
        this.remarks = '';
        this.QX = [];
        this.addUploadState = false;
        this.uploadLists = [];
        this.quanxianState = false;
        this.moveState = false;
        this.fileInfoState = false;
      },
      reset(){
        this.table.selected='';
        this.search.dates=[];
        this.search.query='';
        this.search.fieldName='';
        this.refreshData(0);
      },

      tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length==0){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
      },deleteTableSelected(){
        let list = this.$refs.pageTable.getSelection()
        if(list.length === 0){
          return;
        }
        for(let i=0;i<list.length;i++){
          this.$http.delete('/basic/delete/file?fileIds[]='+list[i].fileId,this.headers).then(res=>{
            if(i === list.length-1){
              this.refreshData(this.parentId);
              this.$Message.success(i18n.t('fileCenter.deleteSuccess'));
              this.addFileBagsCan();
            }
          }).catch(err=>{
            this.addFileBagsCan();
          });
        }
      },
      loadEditData(){
        this.editModal.dataLoading = true;
        let that = this
        this.$http.get("/tenant/user",{params:{limit:99999999}}).then(function (resp) {
          if(resp.data){
            that.search.userList = resp.data;
            that.editModal.dataLoading = false;
          }
        });
      },
      spectorName() {
      let that = this;
      let url = "/tenant/user?page=1&limit=99999";
      that.$http.get(url).then((res) => {
        that.userList = res.data
      })
    },
      //数据（初始化）请求
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
        let params = {};
        let startDate = '';
        let endDate = '';
        // params.page = this.table.pager.current;
        // params.limit = this.table.pager.limit;
        params.query = this.search.query;
        // params.fieldName = this.search.fieldName;
        params.parentId = parentId;
        if(this.search.dates && this.search.dates[0]){
          startDate = this.$iqis.utils.getDayStart(1,this.search.dates[0]);
          endDate = this.$iqis.utils.getDayEnd(this.search.dates[1]);
          params.query='startDate='+startDate+'&endDate='+endDate+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }else{
          params.query='field='+that.search.fieldName+'&keyword='+that.search.query;
        }
        params.parentId = parentId;
        let url = '/tenant/user/profile'
        that.$http.get(url).then((resp) => {
        let urls = '/basic/myfile?parentId='+this.parentId;
        if(resp.data.account === 'admin'){
          urls = '/basic/file/'+this.parentId
        }
        this.$http.get(urls).then(function (res) {
          for(let i=0;i<res.data.length;i++){
            res.data[i]._checked = false;
            // res.data[i].changeState = false;
            res.data[i].changeRemarkState = false;
          }
          that.data = res.data;
          that.table.loading = false;
        }).catch(err=>{
          that.table.loading = false;
        })
        this.$store.commit("RENDER_CHANGE",false);
        })
      },
      ReplyOk(){
        this.defaultData()
      },
      searchData(){
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
        this.bads = [{value: 0,label: i18n.t('fileCenter.allFile')}];
        let that = this;
        that.table.loading = true;
        let params = {};
        let url = ''
        params.query = this.search.query;
        let startDate = '';
        let endDate = '';
        if(this.search.dates && this.search.dates[0]){
          startDate = this.$iqis.utils.getDayStart(1,this.search.dates[0]);
          endDate = this.$iqis.utils.getDayEnd(this.search.dates[1]);
          params.query='startDate='+startDate+'&endDate='+endDate+'&field='+that.search.fieldName+'&keyword='+that.search.query;
        }else{
          params.query='field='+that.search.fieldName+'&keyword='+that.search.query;
        }
        this.$http.get("/basic/search/myfile",{params}).then(function (res) {
          for(let i=0;i<res.data.length;i++){
            res.data[i]._checked = false;
            res.data[i].changeState = false;
            res.data[i].changeRemarkState = false;
          }
          that.data = res.data;
          that.table.loading = false;
        }).catch(err=>{
          that.table.loading = false;
        })
        this.$store.commit("RENDER_CHANGE",false);
      },
    },

    mounted(){
    }
  }
</script>
<style>
  .rankBox .list{width: 100%;min-height: 30px;}
  .rankBox .list_txt2{display: block;margin-top: 20px;}
  .list_txt ,.list_txt2{display:block;margin-bottom:10px;font-size:16px;color:#5C5C5C;}
  .list_no{background:#FAFAFA;}
  .list_ok .dataItem{display: inline-block;padding: 5px 10px;}
  .list_no div , .list_no span{display: inline-block;}
  .list_no span{padding: 1px 10px;font-size: 14px;}
  .list_no .X0{display: none}
  .list_no .process-item{margin-left: 10px;cursor: pointer;margin-bottom: 15px;width:auto!important;}
  .list_no .ivu-card-body{padding:0!important;border: 1px solid #418FEE;border-radius: 2px;}
  .displayNO{display: none;}
  .list_no .ivu-card-body{padding-right: 0px !important;}
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
  .filesList{
    width:100%;
    height:250px;
    position: relative;
    padding-bottom:45px;
    /* border:1px solid #e9e9e9; */
  }
  .filesList ul{
    width:100%;
    height:100%;
    overflow-y: auto;
  }
  .filesList ul .tabTop{
    display: flex;
    width:100%;
    height:53px;
    line-height: 35px;
    font-size:14px;
    border-bottom: 1px solid #EEEEEE
  }
  .background{
    background:#f2f2f2;
  }
  .filesList ul .tabTop .fileName{
    flex:1;
    height:100%;
    padding:0px 10px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    color:rgba(52,59,66,1);overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;

  }
  .filesList ul .tabTop .fileSize{
    flex:0 0 80px;
    height:100%;
    padding:0px 10px;
    text-align: center
  }
  .filesList ul .tabTop .fileBb{
    flex:0 0 160px;
    height:100%;
    padding:10px 10px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    /* text-align: center */
  }
  .filesList ul .tabTop .fileDelete{
    flex:0 0 40px;
    height:100%;
    padding:0px 10px;
    text-align: center;
    position: relative;
    line-height:60px;
  }
  .filesList .fileItem .fileName{
    padding:5px 20px 5px 40px!important;
    line-height: 42px;
    position: relative;
  }
  .filesList .fileItem .fileName img{
    position:absolute;
    display: inline-block;
    /* width:20px; */
    /* height:20px; */
    left:10px;
    top:15px;
  }
  .userList{
    width:100%;height:120px;
    /* padding:5px; */
    /* border:1px solid #e9e9e9; */
    margin-top:5px;
    overflow-y: auto;
  }
  .INITinput[disabled]{
    background: #fff;
    z-index: 0;
  }
  .INITinput:hover{
    background: #ebf7ff;
  }
  .edit{
    width:14px;
    height:14px;
    display: inline-block;
    background: url('../../assets/fileIcon/edit.svg');
    cursor: pointer;
    margin-right:11px;
  }
  .versionInput{
    width:100%;
    height:100%;
  }
  .deleteUploadsList{
    width:16px;height:16px;
    display: inline-block;
    background: url('../../assets/fileIcon/close-circle.svg');
    cursor: pointer;

  }
  .infoItem .left{
    font-size:14px;
    font-family:MicrosoftYaHei;
    color:rgba(0,0,0,0.85);
  }
  .infoItem .right{
    font-size:14px;
    font-family:MicrosoftYaHei;
    color:rgba(0,0,0,0.65);
  }
  .infoItem .rem {
    width:100%;
    height: auto;
    max-height: 200px;
    overflow-y: auto;
    min-height: 84px;
    background:rgba(255,255,255,1);
    border-radius:2px;
    border:1px solid rgba(192,192,192,1);
    padding:10px 12px;
  }
</style>
