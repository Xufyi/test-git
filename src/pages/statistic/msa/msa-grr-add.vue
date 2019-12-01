<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t('statistical.basicInfo')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.analTime')}}</div>
            <div class="iqis-page-block-ctrl">
              <DatePicker :clearable="false" :disabled="basic.disabled||noPermsDis" v-model="basic.analysisTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.analysisPeople')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-if="!grrId" @on-change="v=>changeAnalysisUserId(v)" :label-in-value="true" :disabled="basic.disabled||noPermsDis" v-model="basic.analysisUserId" filterable>
                <Option v-for="(item,index) in userList" :key="index" :value="item.userId" :label="item.name">{{item.name}}</Option>
              </Select>
              <i-input v-if="grrId" disabled v-model="basic.analysisUserName" style="width: 100%;"></i-input>              
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.analNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input :disabled="basic.disabled||noPermsDis" v-model="basic.no" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.open')}}</div>
            <div class="iqis-page-block-ctrl">
              <RadioGroup v-model="basic.prodExamType" @on-change="changeProdExamType(basic.prodExamType)">
                <Radio :disabled="basic.disabled||noPermsDis" :label="1">{{$t('statistical.iqc')}}</Radio>
                <Radio :disabled="basic.disabled||noPermsDis" :label="2">{{$t('statistical.pqc')}}</Radio>
                <Radio :disabled="basic.disabled||noPermsDis" :label="4">{{$t('statistical.oqc')}}</Radio>
              </RadioGroup>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.productNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-if='!grrId' :label="basic.productNo" filterable remote :remote-method="remoteMethod" :loading="loadingRemote" :disabled="basic.disabled||noPermsDis" v-model="basic.productId" @on-change="changeProductId(basic.productId)">
                <Option v-for="(data,index) in productList" :key="index" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
              </Select>
              <i-input  v-if='grrId' v-model="basic.productNo" disabled style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.productName')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.productName" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6" v-if="basic.prodExamType==2">
            <div class="iqis-page-block-label">{{$t('statistical.prodProcess')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :placeholder="i18n.t('statistical.Unlimited')" v-if="!grrId" @on-change="changeProdProcessId(basic.prodProcessId)" :disabled="basic.disabled||noPermsDis||prodProcessDis" v-model="basic.prodProcessId">
                <Option v-for="(item,index) in prodProcessList" :key="index" :value="item.prodProcessId">{{item.prodProcessName}}</Option>
              </Select>
              <i-input v-if="grrId" disabled v-model="basic.prodProcessName" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.project')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-if="!grrId" @on-change="changeInspectionTypeId(basic.inspectionTypeId)" :disabled="basic.disabled||noPermsDis" v-model="basic.inspectionTypeId">
                <Option v-for="(item,index) in inspectionTypeList" :key="index" :value="item.inspectionTypeId">{{item.inspectionTypeName}}</Option>
              </Select>
              <i-input v-if="grrId" disabled v-model="basic.inspectionTypeName" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.chkDevNo')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select v-if="!grrId" @on-change="changeChkDevId(basic.chkDevId)" :disabled="basic.disabled||noPermsDis" v-model="basic.chkDevId">
                <Option v-for="(item,index) in chkDevList" :key="index" :value="item.chkDevId">{{item.name}}</Option>
              </Select>
              <i-input v-if="grrId" disabled v-model="basic.chkDevNo" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.chkDevName')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.chkDevName" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.usl')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.usl" style="width: 100%;"></i-input>

            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.lsl')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="basic.lsl" style="width: 100%;"></i-input>

            </div>
          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.measUserNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="basic.disabled||noPermsDis" v-model="basic.measUserNum" filterable>
                <Option :value="2"></Option>
                <Option :value="3"></Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.productNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="basic.disabled||noPermsDis" v-model="basic.productNum" filterable>
                <Option :value="5"></Option>
                <Option :value="10"></Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.measNum')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="basic.disabled||noPermsDis" v-model="basic.measNum" filterable>
                <Option :value="2"></Option>
                <Option :value="3"></Option>
              </Select>          </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">{{$t('statistical.measPrecision')}}</div>
            <div class="iqis-page-block-ctrl">
              <Select :disabled="basic.disabled||noPermsDis" v-model="basic.measPrecision" filterable>
                <Option :value="1"></Option>
                <Option :value="2"></Option>
                <Option :value="3"></Option>
                <Option :value="4"></Option>
                <Option :value="5"></Option>
              </Select>
            </div>
          </i-col>
        </Row>
        <Row :gutter="25">

          <i-col v-for="(item,index) in basic.inspectorList" :key="index" span="6">
            <div class="iqis-page-block-label">{{$t('statistical.inspector')}}{{index+1}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-if="!grrId&&index==0" disabled v-model="basic.inspectorList[index].memberName" style="width: 100%;"></i-input>
              <Select v-if="!grrId&&index!=0" label-in-value  @on-change="v=>changeInspectorList(v,index)" :disabled="basic.disabled||noPermsDis" v-model="basic.inspectorList[index].memberId" filterable>
                <Option v-for="(item,index) in userList" :key="index" :value="item.userId">{{item.name}}</Option>
              </Select>
              <i-input v-if="grrId" disabled v-model="basic.inspectorList[index].memberName" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('statistical.analysisRemarks')}}</div>
            <div class="iqis-page-block-ctrl">
              <i-input type="textarea" :disabled="basic.disabled||noPermsDis" v-model="basic.remarks" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
      </div>
    </div>
    <div class="iqis-page-block" style="margin-top:10px;">
      <div class="iqis-page-block-title">
        {{$t('statistical.analyticalRecord')}}
      </div>
      <div class="iqis-page-block-body">
          <Table  :no-data-text="i18n.t('noData')" class="noBorder" ref="analysisTable" border stripe
                 :loading="tableLoading" :columns="tableColumns"
                 :data="basic.grrAnalysisDataDtos">
          </Table>
      </div>
    </div>
    <div class="iqis-page-block" style="margin-top:10px;">
      <div class="iqis-page-block-title">
        {{$t('statistical.analysisResult')}}
      </div>
      <div class="iqis-page-block-body">
        <Row :gutter="25" class="analysisResult">
          <i-col span="5" style="width:20%"><span>EV</span><i-input disabled v-model="basic.grrAnalysisResultDto.ev"></i-input></i-col>
          <i-col span="5" style="width:20%"><span>%EV</span><i-input disabled v-model="basic.grrAnalysisResultDto.evProbability"></i-input></i-col>
          <i-col span="5" style="width:20%"><span>PV</span><i-input disabled v-model="basic.grrAnalysisResultDto.pv"></i-input></i-col>
          <i-col span="5" style="width:20%"><span>Xdiff</span><i-input disabled v-model="basic.grrAnalysisResultDto.xdiff"></i-input></i-col>
          <i-col span="5" style="width:20%">
            <span>GRR{{$t('statistical.judge')}}</span>
            <i-input disabled :value="basic.grrAnalysisResultDto.grrResult==0?i18n.t('statistical.acceptable'):basic.grrAnalysisResultDto.grrResult==1?i18n.t('statistical.acceptReluctantly'):i18n.t('statistical.unacceptable')"></i-input>
          </i-col>
          <i-col span="5" style="width:20%"><span>AV</span><i-input disabled v-model="basic.grrAnalysisResultDto.av"></i-input></i-col>
          <i-col span="5" style="width:20%"><span>%AV</span><i-input disabled v-model="basic.grrAnalysisResultDto.avProbability"></i-input></i-col>
          <i-col span="5" style="width:20%"><span>%PV</span><i-input disabled v-model="basic.grrAnalysisResultDto.pvProbability"></i-input></i-col>
          <i-col span="5" style="width:20%"><span>Rp</span><i-input disabled v-model="basic.grrAnalysisResultDto.rp"></i-input></i-col>
          <i-col span="5" style="width:20%">
            <span>ndc{{$t('statistical.judge')}}</span>
            <i-input disabled :value="basic.grrAnalysisResultDto.ndcResult==0?i18n.t('statistical.acceptable'):i18n.t('statistical.unacceptable')"></i-input>
          </i-col>
          <i-col span="5" style="width:20%"><span>TV</span><i-input disabled v-model="basic.grrAnalysisResultDto.tv"></i-input></i-col>
          <i-col span="5" style="width:20%"><span>GRR</span><i-input disabled v-model="basic.grrAnalysisResultDto.grr"></i-input></i-col>
          <i-col span="5" style="width:20%"><span>%GRR</span><i-input disabled v-model="basic.grrAnalysisResultDto.grrProbability"></i-input></i-col>
          <i-col span="5" style="width:20%"><span>ndc</span><i-input disabled v-model="basic.grrAnalysisResultDto.ndc"></i-input></i-col>
          <i-col span="5" style="width:20%">
            <span>{{$t('statistical.overallJudge')}}</span>
            <i-input disabled :value="basic.grrAnalysisResultDto.overallResult==0?i18n.t('statistical.acceptable'):basic.grrAnalysisResultDto.overallResult==1?i18n.t('statistical.acceptReluctantly'):i18n.t('statistical.unacceptable')"></i-input>
          </i-col>
        </Row>
      </div>
    </div>
    <div class="page-end" style="padding-bottom: 65px"></div>

    <IqisAffix placement="bottom" :offset="0">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button v-if="basic.grrAnalysisResultDto.ev&&permsBtn.QUERY_GRR" type="primary" @click="seeGRR">{{$t('statistical.viewChart')}}</Button>
        <Button type="primary" @click="saveGRR" v-if="!noPermsDis">{{$t('statistical.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('statistical.cancel')}}</Button>
      </div>
    </IqisAffix>
  </div>
</template>
<script>
export default {
  props:["params","tabKey"],
  data(){
    let vm = this;
    return{
      grrId:null,
      i18n:window.i18n,
      dataDis:{
        measValueDis0:false,
        measValueDis1:true,
        measValueDis2:true,
      },
      headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
      basic:{
        grrId:null,
        disabled:false,
        analysisTime:new Date(),
        analysisUserId:null,
        analysisUserName:null,
        no:null,
        prodExamType:1,
        productId:null,
        productNo:null,
        productName:null,
        prodProcessId:null,
        prodProcessName:null,
        chkDevId:null,
        chkDevNo:null,
        chkDevName:null,
        inspectionTypeId:null,
        inspectionTypeName:null,
        usl:null,
        lsl:null,
        measUserNum:3,
        productNum:5,
        measNum:3,
        measPrecision:3,
        remarks:null,
        inspectorList:[
          {memberId:null,memberName:null},
          {memberId:null,memberName:null},
          {memberId:null,memberName:null}
        ],
        grrAnalysisDataDtos:[],
        grrAnalysisResultDto:{
          ev:null,
          evProbability:null,
          pv:null,
          xdiff:null,
          grrResult:null,
          av:null,
          avProbability:null,
          pvProbability:null,
          rp:null,
          ndcResult:null,
          tv:null,
          grr:null,
          grrProbability:null,
          ndc:null,
          overallResult:null
        },
      },
      prodProcessDis:false,

      userList:null,
      productList:null,
      prodProcessList:null,
      inspectionTypeList:null,
      inspectionTypeListCopy:null,
      chkDevList:null,

      loadingRemote:false,
      source:null,

      tableLoading:false,

      permsCur:[
        "INSERT_GRR",
        "SELECT_GRR",
        "UPDATE_GRR",
        "DELETE_GRR",
        "QUERY_GRR",
      ],
      permsBtn:{
        "DELETE_GRR":false,
        "SELECT_GRR":false,
        "UPDATE_GRR":false,
        "INSERT_GRR":false,
        "QUERY_GRR":false,
      },
      noPermsDis:false,
    }
  },
  created(){
    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.refreshData()
  },
  watch:{
    "basic.inspectorList":function(data){
      let currentUserId = this.$store.state.currentUserId
      for(let i in data){
        if(data[i].memberId==currentUserId){
          this.dataDis['measValueDis'+i]=false
        }else{
          this.dataDis['measValueDis'+i]=true
        }
      }
    },
    "basic.measUserNum":function(num){
      let inspectorList=[
        {memberId:this.basic.analysisUserId,memberName:this.basic.analysisUserName},
      ]
      for(let i=1;i<num;i++){
        inspectorList.push({memberId:null,memberName:null})
      }
      this.basic.inspectorList = inspectorList
    },
    "basic.analysisUserId":function(id){
      this.basic.inspectorList[0].memberId=id
    },
    "basic.analysisUserName":function(name){
      this.basic.inspectorList[0].memberName=name
    },
    "grrAnalysisDataDtos":function(data){
      if(!this.grrId){
        this.basic.grrAnalysisDataDtos=JSON.parse(JSON.stringify(data))
      }
    },
  },
  computed:{
    grrAnalysisDataDtos(){
      let that = this;
      let measValue = []
      for(let j=0;j<that.basic.measNum;j++){
        measValue.push('')
      }
      let product = {}
      for(let i=0;i<that.basic.measUserNum;i++){
        product['measValue'+i]=measValue
      }
      let data = []
      for(let x=0;x<that.basic.productNum;x++){
        data.push(product)
      }
      console.log(data,'data')
      return data
    },
    tableColumns(){
      let that = this;
      let columns = [
        {
          title: '/',
          width: 100,
          children: [
            {
              title:i18n.t('statistical.prodOrderNum'),
              key:'prodOrderNum',
              minWidth:100,
              render:this.$iqis.utils.tableHelper.buildIndexColumnRender(this)
            }
          ]
        },
      ]
      for(let i=0;i<that.basic.measUserNum;i++){
        let children = []
        for(let j=0;j<that.basic.measNum;j++){
          children.push({
            title:j+1+i18n.t('statistical.measTime'),
            key:'measValue',
            minWidth:100,
            render: (h, params) => {
              return h('div', [h
                ('Input',{
                  props: {
                    type: 'text',
                    value: that.basic.grrAnalysisDataDtos[params.index]['measValue'+i][j],
                    disabled:that.dataDis['measValueDis'+i]||that.noPermsDis
                  },
                  on: {
                    'on-blur':(event) => {
                      that.basic.grrAnalysisDataDtos[params.index]['measValue'+i][j] = event.target.value;
                    }
                  }
                })
              ])
            }
          })
        }
        columns.push(
          {
            title:that.basic.inspectorList[i].memberName||'',
            children:children
          }
        )
      }
      return columns
    }
  },
  methods:{
    refreshData(){
      let that = this;
      that.grrId = that.$props.params && that.$props.params.grrId;
      if(!that.grrId){
        that.$http.get("/tenant/user",{params:{limit:99999}}).then((res)=>{
          that.userList = res.data
        })
        let currentUserId = that.$store.state.currentUserId
        that.basic.analysisUserId = currentUserId
        that.$http.get('/tenant/user/'+currentUserId).then((res)=>{
          that.basic.analysisUserName = res.data.name
        })
        that.basic.grrAnalysisDataDtos=JSON.parse(JSON.stringify(that.grrAnalysisDataDtos))
      }else{
        that.basic.disabled=true;
        that.$http.get('/basic/grr/'+that.grrId).then((res)=>{
          that.basic.grrId=res.data.grrId
          that.basic.analysisTime=new Date(res.data.analysisTime)
          that.basic.analysisUserId=res.data.analysisUserId
          that.basic.analysisUserName=res.data.analysisUserName
          that.basic.no=res.data.no
          that.basic.prodExamType=res.data.prodExamType
          that.basic.productId=res.data.productId
          that.basic.productNo=res.data.productNo
          that.basic.productName=res.data.productName
          that.basic.prodProcessId=res.data.prodProcessId
          that.basic.prodProcessName=res.data.prodProcessName
          that.basic.inspectionTypeId=res.data.inspectionTypeId
          that.basic.inspectionTypeName=res.data.inspectionTypeName
          that.basic.chkDevId=res.data.chkDevId
          that.basic.chkDevNo=res.data.chkDevNo
          that.basic.chkDevName=res.data.chkDevName
          that.basic.usl=res.data.usl
          that.basic.lsl=res.data.lsl
          that.basic.measUserNum=res.data.measUserNum
          that.basic.productNum=res.data.productNum
          that.basic.measNum=res.data.measNum
          that.basic.measPrecision=res.data.measPrecision
          that.basic.inspectorList=res.data.inspectorList
          that.basic.remarks=res.data.remarks
          let grrAnalysisDataDtos=res.data.grrAnalysisDataDtos
          let arr = []
          let newData=[]
          for(let i in grrAnalysisDataDtos){
            for(let j in grrAnalysisDataDtos[i]){
              arr.push(grrAnalysisDataDtos[i][j].measValue.split(','))
            }
          }
          for(let x=0;x<that.basic.productNum;x++){
            let product = {}
            for(let y=0;y<that.basic.measUserNum;y++){
              product['measValue'+y]=grrAnalysisDataDtos[y][x].measValue.split(',')
            }
            newData.push(product)
          }
          that.basic.grrAnalysisDataDtos = JSON.parse(JSON.stringify(newData))
          
          let grrAnalysisResultDto = {
            ev:null,
            evProbability:null,
            pv:null,
            xdiff:null,
            grrResult:null,
            av:null,
            avProbability:null,
            pvProbability:null,
            rp:null,
            ndcResult:null,
            tv:null,
            grr:null,
            grrProbability:null,
            ndc:null,
            overallResult:null
          }
          that.basic.grrAnalysisResultDto=res.data.grrAnalysisResultDto||grrAnalysisResultDto
          
        })
      }
      if(((!that.grrId&&that.permsBtn.INSERT_GRR)||(that.grrId&&that.permsBtn.UPDATE_GRR))){
        that.noPermsDis=false;
      }else{
        that.noPermsDis=true;
      }
    },
    changeAnalysisUserId(item){
      this.basic.analysisUserName = item.label
    },
    changeInspectorList(item,index){
      // let that = this;
      // let inspectorList = JSON.parse(JSON.stringify(that.basic.inspectorList))
      // for(let i in that.basic.inspectorList){
      //   if(that.basic.inspectorList[i].memberId&&i!=index&&item.value==that.basic.inspectorList[i].memberId){
      //     inspectorList[index].memberId = null
      //     inspectorList[index].memberName = null
      //     that.$Notice.warning({title:'检验员不能重复'})
      //     that.basic.inspectorList = inspectorList
      //     console.log(that.basic.inspectorList)
      //     return;
      //   }
      // }
      this.basic.inspectorList[index].memberName = item.label
    },
    changeProdExamType(value){
      let that = this;
      that.basic.productId = null
      that.basic.productNo = null
      that.basic.productName = null
    },
    remoteMethod: _.debounce(function(query) {
      let that = this;
      that.loadingRemote = true;
      if (query !== '') {
        that.cancelQuest();
        that.$nextTick(()=>{
          that.$http.get('/basic/product/simple?page=1&limit=999999&examType='+that.basic.prodExamType+'&useState=1&fieldName=no,name&query='+query,{
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
    changeProductId(value){
      let that = this;
      that.basic.prodProcessId=null;
      that.basic.inspectionTypeId=null;
      if(value){
        that.$http.get('/basic/product/detail/'+value).then((res)=>{
          that.basic.productNo=res.data.no;
          that.basic.productName=res.data.name;
          if(that.basic.prodExamType==1){
            that.inspectionTypeList = res.data.settings.qc.iqc.params
          }else if(that.basic.prodExamType==2){
            that.$http.get('/basic/prod-task/'+res.data.settings.qc.pqc.aql.prodFlowId).then((res)=>{
              that.prodProcessList = res.data.prodTaskItems
              that.prodProcessList.unshift({prodProcessId:null,prodProcessName:i18n.t('Unlimited')})
            })
            that.inspectionTypeList = res.data.settings.qc.pqc.params
          }else{
            that.inspectionTypeList = res.data.settings.qc.oqc.params
          }
          that.inspectionTypeListCopy = JSON.parse(JSON.stringify(that.inspectionTypeList)) 
        })
      }else{
        that.prodProcessList=null
        that.inspectionTypeList=null
      }
    },
    changeProdProcessId(value){
      let that = this;
      that.basic.inspectionTypeId=null
      if(value){
        let newList = []
        for(let i in that.inspectionTypeListCopy){
          if(that.inspectionTypeListCopy[i].prodStageId==value){
            newList.push(that.inspectionTypeListCopy[i])
          }
        }
        that.inspectionTypeList = newList
      }else{
        that.inspectionTypeList = that.inspectionTypeListCopy
      }
    },
    changeInspectionTypeId(value){
      let that = this;
      that.basic.chkDevId = null
      that.basic.chkDevNo = null
      that.basic.chkDevName = null
      that.basic.usl = null
      that.basic.lsl = null
      if(value){
        let chkDevTypeIds = []
        for(let i in that.inspectionTypeList){
          if(that.inspectionTypeList[i].inspectionTypeId==value){
            chkDevTypeIds[0] = that.inspectionTypeList[i].chkDevTypeId.replace(/\,/g,'_')
            that.basic.usl = that.inspectionTypeList[i].usl
            that.basic.lsl = that.inspectionTypeList[i].lsl
            break;
          }
        }
        that.$http.get('/basic/chkdevListByIds?chkDevTypeIds[]='+chkDevTypeIds,{page:1,limit:99999,useState:1}).then((res)=>{
          that.chkDevList = res.data[0]
        })
      }else{
        that.chkDevList = []
      }
    },
    changeChkDevId(value){
      let that = this;
      if(value){
        that.$http.get('/basic/chkdev/'+value).then((res)=>{
          that.basic.chkDevName = res.data.name
          that.basic.chkDevNo = res.data.no
        })
      }
    },
    seeGRR(){
      this.$emit("open-tab","msa-grr-chart-"+this.grrId,i18n.t('statistical.grrChart'),"page-statistic-msa-grr-chart",{grrId:this.grrId});
    },
    saveGRR(){
      let that = this;
      let data = JSON.parse(JSON.stringify(that.basic))
      let params = [
        {type:'Empty',title:i18n.t('statistical.analNo'),value:data.no},
        {type:'No',title:i18n.t('statistical.analNo'),value:data.no},
        {type:'Empty',title:i18n.t('statistical.productNo'),value:data.productId},
        {type:'Empty',title:i18n.t('statistical.project'),value:data.inspectionTypeId},
        {type:'Empty',title:i18n.t('statistical.chkDevNo'),value:data.chkDevId},
      ]
      for(let i in data.inspectorList){
        params.push(
          {type:'Empty',title:i18n.t('statistical.inspector')+(Number(i)+1),value:data.inspectorList[i].memberId},
        )
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
      for(let x in data.inspectorList){
        for(let y in data.inspectorList){
          if(x!=y&&data.inspectorList[x].memberId==data.inspectorList[y].memberId){
            that.$Notice.warning({title:i18n.t('statistical.inspectorRepeat')})
            return;
          }
        }
      }
      for(let i in data.grrAnalysisDataDtos){
        for(let j in data.grrAnalysisDataDtos[i]["measValue"+i]){
          if(isNaN(data.grrAnalysisDataDtos[i]["measValue"+i][j])){
            that.$Notice.warning({title:i18n.t('statistical.analDataNum')})
            return;
          }
        }
      }
      let grrAnalysisDataDtos = data.grrAnalysisDataDtos
      let arr = []
      let newData = []
      for(let i in grrAnalysisDataDtos){
        for(let j in grrAnalysisDataDtos[i]){
          let measValue = grrAnalysisDataDtos[i][j].join(',')
          arr.push(measValue)
        }
      }
      for(let x=0;x<data.measUserNum;x++){
        let user = []
        for(let y=x;y<arr.length;y++){
          user.push({measValue:arr[y]})
          y=y+data.measUserNum-1
          if(y>arr.length){
            break
          }
        }
        newData.push(user)
      }
      for(let a in newData){
        for(let b in newData[a]){
          newData[a][b]['prodOrderNum']=Number(b)+1
        }
      }
      data.grrAnalysisDataDtos = newData
      data.analysisTime=new Date(data.analysisTime).getTime()
      if(!that.grrId){
        that.$http.post('/basic/grr',data,that.headers).then((res)=>{
          that.$Message.success(i18n.t('statistical.saveSuccess')); 
          that.closePage()
          that.$emit("open-tab","msa-grr-add-"+res.data.grrId,i18n.t('statistical.editGrr')+"-"+data.productName,"page-statistic-msa-grr-add",{grrId:res.data.grrId});
        })
      }else{
        // 修改前查询他人已填数据并合并当前已填数据
        that.$http.get('/basic/grr/'+that.grrId).then((resp)=>{
          let currentData = []
          let currentIndex = data.inspectorList.findIndex((val,index,arr)=>{
            return val.memberId==that.$store.state.currentUserId
          })
          currentData[currentIndex] = data.grrAnalysisDataDtos[currentIndex]
          data.grrAnalysisDataDtos = Object.assign([],resp.data.grrAnalysisDataDtos,currentData) 
          
          that.$http.put('/basic/grr',data,that.headers).then((res)=>{
            that.$Message.success(i18n.t('statistical.saveSuccess')); 
            that.refreshData()
          })
        })
      }
    },
    closePage(){
      this.$emit("close-tab",this.$props.tabKey);
    },
  }
}
</script>
<style>
.analysisResult{
  background:rgb(250, 250, 250);
  margin:20px 0;
  padding-top:15px;
}
.analysisResult .ivu-col{
  display: flex;
  padding-bottom: 15px;
}
.analysisResult .ivu-col>span{
  width: 65px;
  text-align: right;
  margin-right: 10px;
}
.analysisResult .ivu-col>div{
  flex:1;
}
</style>