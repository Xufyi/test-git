<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t("pqc.basicInformation")}}
      </div>

      <div class="iqis-page-block-body">
        <Row style="margin-top:10px;">
          <!-- <i-col span="24"> -->
            检查类型&nbsp;&nbsp;
            <RadioGroup v-model="dto.pqcSpotcheckDto.lineChange" style="position:relative;top:-3px">
              <Radio :disabled="noPermsDis||userDis" :label="1">换线后检查</Radio>
              <Radio :disabled="noPermsDis||userDis" :label="0">开拉检查</Radio>
            </RadioGroup>
          <!-- </i-col> -->
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.pn")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :label="dto.pqcSpotcheckDto.productNo" filterable remote :remote-method="remoteMethod" :loading="loadingRemote" :placeholder="i18n.t('pleaseChoose')" :disabled="noPermsDis||userDis" v-model="dto.pqcSpotcheckDto.productId" @on-change="changeProductId(dto.pqcSpotcheckDto.productId)">
                <Option v-for="(data,index) in productList" :key="index" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.name")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  disabled v-model="dto.pqcSpotcheckDto.productName" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.time")}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker type="datetime" v-model="dto.pqcSpotcheckDto.spotcheckTime" format="yyyy-MM-dd HH:mm" :placeholder="i18n.t('pqc.pst')" style="width: 100%" :disabled="noPermsDis||userDis"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.inspector")}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.pqcSpotcheckDto.userId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis||userDis">
                <Option v-for="item in userList" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t("pqc.iqcNo")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input  v-model="dto.pqcSpotcheckDto.spotcheckNo" style="width: 100%;" :disabled="noPermsDis||userDis"></i-input>
            </div>
          </i-col>
          <i-col span="18">
            <div class="iqis-page-block-label">{{$t("pqc.remarks")}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.pqcSpotcheckDto.remarks" style="width: 100%;" :disabled="noPermsDis||userDis"></i-input>
            </div>
          </i-col>
        </Row>
      </div>

    </div>

    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        记录
      </div>
      <div class="iqis-page-block-body">
        <div class="iqis-page-block-tools">
          <div class="iqis-page-block-tools-primary">
            <div class="iqis-page-block-label">记录列表</div>
          </div>
          <div class="iqis-page-block-tools-second" style="margin-top: 6px;">
            <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;">{{$t('iqc.changed')}} <span
              style="color:#1b75ea">{{selectsParams}}</span> 项记录</span>
            <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
              confirm
              :title="i18n.t('iqc.confirmDelete')"
              placement="bottom-end"
              @on-ok="deleteParams">
              <Button type="ghost" icon="trash-a" :disabled="noPermsDis||userDis">{{$t('iqc.delete')}}</Button>
            </Poptip>
          </div>
        </div>
        <div class="iqis-page-block-table">
          <Table  :no-data-text="i18n.t('noData')" class="height24 noBorder" ref="paramsTable" @on-selection-change="changeSelectParams" border stripe
                  v-drag-table-column="columns" :columns="columns"
                  :data="dto.pqcSpotcheckRecordDto">
            <Button  :disabled="noPermsDis||userDis" @click="addParams" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t('product.addIqcParams')}}</Button>
          </Table>
        </div>
      </div>
    </div>

    <div class="page-end" style="padding-bottom: 65px"></div>
    <Spin size="large" fix v-if="loading"></Spin>
    <IqisAffix placement="bottom" :offset="0">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button v-if="!noPermsDis&&!userDis&&!loading" type="primary" @click="save('submit')">{{$t('product.commit')}}</Button>
        <Button v-if="!noPermsDis&&!userDis&&!loading" type="primary" @click="save('save')">{{$t('product.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('product.cancel')}}</Button>
      </div>
    </IqisAffix>

  </div>
</template>
<script>
import $ from "jquery"
export default {
  props: ["params", "tabKey"],
  data() {
    let vm = this;
    return{
      spotcheckId:null,
      headers: {"headers": {"Content-Type": "application/json; charset=UTF-8"}},
      i18n:window.i18n,
      userDis:false,
      noPermsDis:false,
      loading:true,
      loadingRemote:false,
      productList:[],
      iqcProdList:[],
      measunitList:[],
      chkdevList:[],
      userList:[],
      inspectiontypeList:[{children:[]}],
      dto:{
        pqcSpotcheckDto:{
          lineChange:1,
          productId:null,
          productNo:null,
          productName:null,
          spotcheckTime:'',
          userId:null,
          spotcheckNo:'',
          remarks:'',
        },
        pqcSpotcheckRecordDto:[],
      },
      selectsParams:0,
      columns: [
        {
          type: 'selection',
          width:40,
          align: 'center',
          minWidth:40,
          maxWidth:40,
        },
        {
          title: i18n.t('iqc.no'),
          width: 40,
          render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
          align: "center",
          minWidth: 40,
          maxWidth: 40
        },
        {
          title: '产品编号',
          width: this.$store.state.locale=='zh_CN'?85:150,
          minWidth:this.$store.state.locale=='zh_CN'?85:150,
          align: 'center',
          ellipsis:true,
          key: 'productId',
          render:
          (h, params)=>{
            let ret =  vm.$iqis.utils.tableHelper.editable.buildSelectCell2(
              vm,
              (vm)=>{
                return vm.iqcProdList
              },
              "productId",
              "no",
              this.changeSelectProduct,
              vm.noPermsDis||vm.userDis
            )
            return ret(h,params);
          }
        },
        {
          title: '产品名称',
          minWidth: 100,
          width: 100,
          align: "center",
          key:"productName"
        },
        {
          title: i18n.t('product.project'),
          minWidth: this.$store.state.locale=='zh_CN'?90:120,
          width:this.$store.state.locale=='zh_CN'?90:120,
          align: 'center',
          ellipsis:true,
          //required:true,
          key: 'inspectionTypeId',
          render:(h, params)=>{
            let ret =  vm.$iqis.utils.tableHelper.editable.buildCascaderCell2(
              vm,
              (vm)=>{
                return vm.inspectiontypeList
              },
              "inspectionTypeId",
              "name",
              null,
              this.closeInspectionType,
              vm.noPermsDis||vm.userDis,
            )
            return ret(h,params);
          },
          // render: (h, params) => {
          //   return h('div', [h
          //     ('Cascader',{
          //       props: {
          //         transfer: false,
          //         disabled:vm.noPermsDis||vm.userDis,
          //         value:params.row.inspectionTypeId,
          //         data:vm.inspectiontypeList[0].children,
          //         changeOnSelect:true,
          //         clearable:false,
          //         renderFormat:vm.typeRender
          //       },
          //       on: {
          //         'on-change':(event) => {
          //           params.row.inspectionTypeId = event
          //           this.dto.pqcSpotcheckRecordDto[params.index] = params.row;
          //         }
          //       }
          //     })
          //   ])
          // }
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
                return vm.measunitList
              },
              "measUnitId",
              "unitSymbol",
              this.changeSelectMeasUnit,
              vm.noPermsDis||vm.userDis
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
                return vm.chkdevList
              },
              "chkDevId",
              "name",
              this.changeSelectChkDev,
              vm.noPermsDis||vm.userDis
            )
            return ret(h,params);
          }
        },
        {
          title: 'SL',
          minWidth:80,
          align: 'center',
          ellipsis:true,
          key: 'sl',
          render: (h, params) => {
            return h('div', [h
              ('Input',{
                props: {
                  type: 'text',
                  disabled:vm.noPermsDis||vm.userDis,
                  value:params.row.sl
                },
                on: {
                  'on-blur':(event) => {
                    params.row.sl = event.target.value
                    params.row.usl = (Number(params.row.sl)+Number(params.row.positiveTolerance)).toFixed(this.judgeDecimal(params.row.sl,params.row.positiveTolerance))
                    params.row.lsl = (Number(params.row.sl)+Number(params.row.negativeTolerance)).toFixed(this.judgeDecimal(params.row.sl,params.row.negativeTolerance))
                    this.dto.pqcSpotcheckRecordDto[params.index] = params.row;
                  }
                }
              })
            ])
          }
        },
        {
          title: '正公差',
          minWidth:80,
          align: 'center',
          ellipsis:true,
          key: 'positiveTolerance',
          render: (h, params) => {
            return h('div', [h
              ('Input',{
                props: {
                  type: 'text',
                  disabled:vm.noPermsDis||vm.userDis,
                  value:params.row.positiveTolerance
                },
                on: {
                  'on-blur':(event) => {
                    params.row.positiveTolerance = event.target.value
                    params.row.usl = (Number(params.row.sl)+Number(params.row.positiveTolerance)).toFixed(this.judgeDecimal(params.row.sl,params.row.positiveTolerance))
                    this.dto.pqcSpotcheckRecordDto[params.index] = params.row;
                  }
                }
              })
            ])
          }
        },
        {
          title: '负公差',
          minWidth:80,
          align: 'center',
          ellipsis:true,
          key: 'negativeTolerance',
          render: (h, params) => {
            return h('div', [h
              ('Input',{
                props: {
                  type: 'text',
                  disabled:vm.noPermsDis||vm.userDis,
                  value:params.row.negativeTolerance
                },
                on: {
                  'on-blur':(event) => {
                    params.row.negativeTolerance = event.target.value
                    params.row.lsl = (Number(params.row.sl)+Number(params.row.negativeTolerance)).toFixed(this.judgeDecimal(params.row.sl,params.row.negativeTolerance))
                    this.dto.pqcSpotcheckRecordDto[params.index] = params.row;
                  }
                }
              })
            ])
          }
        },
        {
          title: 'USL',
          minWidth:80,
          align: 'center',
          ellipsis:true,
          key: 'usl',
          render: (h, params) => {
            return h('div', [h
              ('Input',{
                props: {
                  type: 'text',
                  disabled:vm.noPermsDis||vm.userDis,
                  value:params.row.usl
                },
                on: {
                  'on-blur':(event) => {
                    params.row.usl = event.target.value
                    this.dto.pqcSpotcheckRecordDto[params.index] = params.row;
                  }
                }
              })
            ])
          }
        },
        
        {
          title: 'LSL',
          minWidth:80,
          align: 'center',
          ellipsis:true,
          key: 'lsl',
          render: (h, params) => {
            return h('div', [h
              ('Input',{
                props: {
                  type: 'text',
                  disabled:vm.noPermsDis||vm.userDis,
                  value:params.row.lsl
                },
                on: {
                  'on-blur':(event) => {
                    params.row.lsl = event.target.value
                    this.dto.pqcSpotcheckRecordDto[params.index] = params.row;
                  }
                }
              })
            ])
          }
        },
        {
          title: '记录',
          minWidth:360,
          align: 'center',
          ellipsis:true,
          key: 'paramValueArray',
          render: (h, params) => {
            return h('div',
            [0,1,2,3,4].map(function(i) {//chdDevTypeList原带出检验设备列表
              return h(
                "Input",{
                  style:{
                    width:'20%',
                    background:vm.backgroundColor(params.row.paramValueArray[i],params.row.usl,params.row.lsl),
                    borderRight:i!=4?'1px solid #e9eaec':'',
                  },
                  props: {
                    value: params.row.paramValueArray[i],
                    disabled:vm.noPermsDis||vm.userDis
                  },
                  on: {
                    "on-blur": event => {
                      params.row.paramValueArray[i] = event.target.value;
                      vm.dto.pqcSpotcheckRecordDto[params.index] = params.row
                      $(event.target).parent('.ivu-input-wrapper.ivu-input-type').css('background',vm.backgroundColor(params.row.paramValueArray[i],params.row.usl,params.row.lsl,event.target))
                    }
                  }
                }
              );
            })
            )
          }
        },
      ],
      permsCur:[
        "EXPORT_ISIR",
        "UPDATE_ISIR",
        "SELECT_ISIR",
        "INSERT_ISIR",
        "DELETE_ISIR",
        "AUDIT_ISIR",
      ],//当前页面需要的权限名称
      permsBtn:{//控制每个权限对应按钮的禁用状态
        "EXPORT_ISIR":false,
        "UPDATE_ISIR":false,
        "SELECT_ISIR":false,
        "INSERT_ISIR":false,
        "DELETE_ISIR":false,
        "AUDIT_ISIR":false,
      },
    }
  },
  created() {
    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.refreshData();
    
    
  },
  methods:{
    judgeDecimal(num1,num2){
      let length1 = num1.includes('.')?num1.toString().split(".")[1].length:0
      let length2 = num2.includes('.')?num2.toString().split(".")[1].length:0
      let length = Number(length1)>Number(length2)?length1:length2
      return length
    },
    backgroundColor(val,usl,lsl,target){
      // let isNum = /^[0-9]\d*\,\d*|[0-9]\d*$/.test(val)
      // if(val&&(!isNum||isNaN(val)||val<0||val>1000000000)){
      //   this.$Notice.warning({title:"记录只能为大于0且小于1000000000的数字"})
      //   $(target).focus().select()
      //   return;
      // }
      if(val&&!isNaN(val)&&(Number(val)>Number(usl)||Number(val)<Number(lsl))){
        return 'red'
      }else{
        return 'transparent'
      }
    },
    changeSelectParams(selects){
      this.selectsParams = selects.length
    },
    changeSelectProduct(val,valName,index){
      this.dto.pqcSpotcheckRecordDto[index].productId = val
      this.$http.get('/basic/product/'+val).then(res=>{
        this.dto.pqcSpotcheckRecordDto[index].productName = res.data.name
        this.dto.pqcSpotcheckRecordDto[index].productNo = res.data.no
      })
    },
    closeInspectionType(val,valName,index,row){
      this.dto.pqcSpotcheckRecordDto[index].inspectionTypeId = val
    },
    changeSelectMeasUnit(val,valName,index){
      this.dto.pqcSpotcheckRecordDto[index].measUnitId = val
    },
    changeSelectChkDev(val,valName,index){
      this.dto.pqcSpotcheckRecordDto[index].chkDevId = val
    },
    typeRender(labels,nodes){
        if(!labels || labels.length == 0){
          return '-';
        }
        let result = labels[labels.length-1];

        if( (this.inspectiontypeList.length > 0  && result == this.inspectiontypeList[0].label)){
          return '-'
        }

        return result;
    },
    refreshData(){
      this.$http.all([
        this.$http.get('/basic/product/simple?page=1&limit=999999&useState=1&examType=1'),
        this.$http.get('/tenant/user?page=1&limit=999999'),
        this.$http.get('/basic/measunit?page=1&limit=999999'),
        this.$http.get('/basic/chkdev?useState=1&page=1&limit=999999'),
        this.$http.get("/basic/inspectiontype?page=1&limit=999999"),
      ]).then(res=>{
        this.iqcProdList = res[0].data
        this.userList = res[1].data
        this.measunitList = res[2].data
        this.chkdevList = res[3].data
        let resp = res[4];
        let root = {title:i18n.t('product.projectType'),selected: false,label:i18n.t('product.projectType'),value:0,expand:true};
        this.$iqis.utils.treeify(resp.data,root,"inspectionTypeId","name","parentId");
        this.inspectiontypeList = [root];
        this.spotcheckId = this.$props.params && this.$props.params.spotcheckId;
        if(this.spotcheckId){//修改
          console.log(this.spotcheckId);
          this.$http.get("/examinecenter/pqc/getPsr/"+this.spotcheckId).then((res) => {  
            res.data.pqcSpotcheckDto.spotcheckTime = new Date(res.data.pqcSpotcheckDto.spotcheckTime)
            this.dto = res.data
            if(this.dto.pqcSpotcheckDto.userId != this.$store.state.currentUserId||this.dto.pqcSpotcheckDto.state==1||this.dto.pqcSpotcheckDto.state==2){
              this.userDis = true
            }
          })
        }else{
          this.dto.pqcSpotcheckDto.userId = this.$store.state.currentUserId
          this.dto.pqcSpotcheckDto.spotcheckTime = new Date()
        }

        // 权限
        if(((!this.spotcheckId&&this.permsBtn.INSERT_ISIR)||(this.spotcheckId&&this.permsBtn.UPDATE_ISIR))){
          this.noPermsDis=false;
        }else{
          this.noPermsDis=true;
        }

        this.loading = false
      })
    },
    addParams(){
      var newRow = {
        "productId":null,
        "productNo":'',
        "productName":'',
        "chkDevId": null,
        "inspectionTypeId": null,
        "spotcheckId": null,
        "lsl": "",
        "measUnitId": null,
        "paramRecordId": null,
        "paramValueArray": [],
        "sl": "",
        "usl": "",
        "positiveTolerance": "",
        "negativeTolerance": "",
        rowId:this.dto.pqcSpotcheckRecordDto.length
      }
      this.dto.pqcSpotcheckRecordDto.push({...newRow});
      this.$nextTick(function(){
        $(".location .ivu-table-body").scrollTop((this.dto.pqcSpotcheckRecordDto.length-1-6)*43);
          $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');
      })
      console.log(this.dto.pqcSpotcheckRecordDto,'this.dto.pqcSpotcheckRecordDto');
      
    },
    deleteParams(){
      let selection = this.$refs.paramsTable.getSelection();
      if(selection.length > 0){
        for(let i in selection){
          for(let j in this.dto.pqcSpotcheckRecordDto){
            if(selection[i].rowId == this.dto.pqcSpotcheckRecordDto[j].rowId){
             this.dto.pqcSpotcheckRecordDto.splice(j,1);
            }
          }
        }
      }
      this.selectsParams = 0;
    },
    closePage(){
      this.$emit("close-tab",this.$props.tabKey);
    },
    changeProductId(id){
      this.$http.get('/basic/product/'+id).then(res=>{
        this.dto.pqcSpotcheckDto.productNo = res.data.productNo
        this.dto.pqcSpotcheckDto.productName = res.data.name
      })
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
        this.source(i18n.t('pqc.TerminationRequest')); 
      }
    },
    save(type){
      let dto = JSON.parse(JSON.stringify(this.dto)) 
      dto.pqcSpotcheckDto.spotcheckTime = new Date(dto.pqcSpotcheckDto.spotcheckTime).getTime()
      let params = [
        {type: 'Empty', title: '产品编号', value: dto.pqcSpotcheckDto.productId},
        {type: 'Empty', title: '检验单号', value: dto.pqcSpotcheckDto.spotcheckNo},
        {type: 'No', title: '检验单号', value: dto.pqcSpotcheckDto.spotcheckNo},
        {type: 'Word600', title: '备注', value: dto.pqcSpotcheckDto.remarks},
      ]
      let state = true;
      for (let i in params) {
        state = this.$iqis.utils.formValidate(params[i].type, params[i].title, params[i].value, (tips) => {
          this.$Notice.warning({title: tips})//,duration: 0
        })
        if (!state) {
          return;
          break;
        }
      }
      if(type=="save"){
        if(!this.spotcheckId){
          this.$http.post('/examinecenter/pqc/addPsr',dto,this.headers).then(res=>{
            this.$Message.success('添加成功')
              this.closePage();
              this.$emit("open-tab","exam-pqc-spotcheck-add-"+res.data.pqcSpotcheckDto.spotcheckId,'修改点检记录-'+res.data.pqcSpotcheckDto.productName,"page-exam-pqc-spotcheck-add",{spotcheckId:res.data.pqcSpotcheckDto.spotcheckId});

          })
        }else{
           this.$http.put('/examinecenter/pqc/updatePsr',dto,this.headers).then(res=>{
            this.$Message.success('修改成功')
          })
        }
      }else{
        this.$http.post('/examinecenter/pqc/commitPsr',dto,this.headers).then(res=>{
          this.$Message.success('提交成功')
          this.closePage();
        })
      }
    },
  }
};
</script>
