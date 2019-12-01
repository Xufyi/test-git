<template>
<div class="iqis-page">
  <div class="iqis-page-block">
    <div class="iqis-page-block-title">
     {{$t("pqc.basicInformation")}}
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
          <div class="iqis-page-block-label">{{$t("pqc.rn")}}</div>
          <div class="iqis-page-block-ctrl">
            <i-input :disabled="noPermsDis" :placeholder="i18n.t('pqc.pe')" v-model="ruleForm.recordNum" style="width: 100%;"></i-input>
          </div>
          <div class="iqis-page-block-label">{{$t("pqc.ln")}}</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-show="createBatchNo===1" v-model="ruleForm.batchNo" :disabled='noPermsDis' style="width: 100%;"></i-input>
            <i-select v-show="createBatchNo===0" :disabled="noPermsDis" v-model="ruleForm.prodBatchId" filterable :placeholder="i18n.t('Unlimited')" @on-change="changeProdBatchId(ruleForm.prodBatchId)">
              <Option v-for="(items,index) in prodBatch.BatchNumber" :value="items.prodBatchId" :key="items.prodBatchId">{{ items.batchNo}}</Option>
            </i-select>
          </div>
          <div class="iqis-page-block-label">{{$t("pqc.pn")}}</div>
          <div class="iqis-page-block-ctrl">
            <Select :label="ruleForm.productNo" filterable remote :remote-method="remoteMethod" :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.productId" @on-change="changeProductId(ruleForm.productId)">
              <Option v-for="(data,index) in productList" :key="index" :label="data.no" :value="data.productId">{{data.no}}/{{data.name}}</Option>
            </Select>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">{{$t("pqc.time")}}</div>
          <div class="iqis-page-block-ctrl">
            <Date-picker :disabled="noPermsDis" type="datetime" format="yyyy-MM-dd HH:mm" v-model="ruleForm.createTime" class="dataW"></Date-picker>
          </div>
          <div class="iqis-page-block-label">{{$t("pqc.bq")}}</div>
          <div class="iqis-page-block-ctrl">
            <i-input placeholder="-" v-model="ruleForm.batchQuantity" :disabled="noPermsDis||createBatchNo===0" style="width: 100%;"></i-input>
          </div>
          <div class="iqis-page-block-label">{{$t("pqc.name")}}</div>
          <div class="iqis-page-block-ctrl">
            <!-- <Select v-model="ruleForm.productId" :placeholder="i18n.t('pqc.pleaseChoose')" disabled>
	                <Option v-for="(items,index) in prodBatch.productNames" :value="items.productId" :label="items.name" :key="index">{{ items.name}}</Option>
	            </Select> -->
              <i-input placeholder="-" v-model="ruleForm.productName" disabled style="width: 100%;"></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">{{$t("pqc.inspector")}}</div>
          <div class="iqis-page-block-ctrl">
            <Select :disabled="noPermsDis" v-model="ruleForm.operatorId" filterable :placeholder="i18n.t('pqc.pleaseChoose')">
                <Option v-for="(items,index) in prodBatch.spectorNameData" :value="items.userId" :label="items.name"  :key="index">{{ items.name}}</Option>
            </Select>
          </div>
          <div class="iqis-page-block-label">{{$t("pqc.ac")}}</div>
          <div class="iqis-page-block-ctrl">
            <Select v-model="ruleForm.customerId" :disabled="createBatchNo===0" filterable :placeholder="i18n.t('pqc.pleaseChoose')">
		            <Option v-for="(items,index) in prodBatch.customerList" :value="items.customerId" :key="index">{{ items.name}}</Option>
		          </Select>
          </div>
          <div class="iqis-page-block-label">{{$t("pqc.specifications")}}</div>
          <div class="iqis-page-block-ctrl">
            <!-- <Select v-model="ruleForm.productId" :placeholder="i18n.t('pqc.pleaseChoose')" disabled>
                <Option v-for="(items,index) in prodBatch.productSpec" :value="items.productId" :label="items.spec" :key="index">{{ items.spec}}</Option>
            </Select> -->
            <i-input placeholder="-" v-model="ruleForm.productSpec" disabled style="width: 100%;"></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">&nbsp;</div>
          <div class="iqis-page-block-ctrl">
            <div style="height: 32px;">&nbsp;</div>
          </div>
          <div class="iqis-page-block-label">&nbsp;</div>
          <div class="iqis-page-block-ctrl">
            <div style="height: 32px;">&nbsp;</div>
          </div>
          <div class="iqis-page-block-label">{{$t("pqc.pc")}}</div>
          <div class="iqis-page-block-ctrl">
            <!-- <Select v-model="ruleForm.prodTypeId" :placeholder="i18n.t('pqc.pleaseChoose')" disabled>
                <Option v-for="(items,index) in prodBatch.productTypeName" :value="items.prodTypeId"  :key="index">{{ items.name}}</Option>
            </Select> -->
            <i-input placeholder="-" v-model="ruleForm.prodTypeName" disabled style="width: 100%;"></i-input>
          </div>
        </i-col>
      </Row>

      <Row type="flex" :gutter="24">
        <i-col span="6">
          <div class="iqis-page-block-label">{{$t("pqc.pl")}}</div>
          <div class="iqis-page-block-ctrl">
            <i-select v-model="ruleForm.prodLineId" filterable :placeholder="i18n.t('Unlimited')" :disabled="noPermsDis">
              <Option value=" ">{{$t('Unlimited')}}</Option>
              <Option v-for="(items,index) in LineData" :value="items.prodLineId" :key="items.prodLineId">{{items.name}}</Option>
            </i-select>
          </div>
          <div class="iqis-page-block-label">{{$t("pqc.inspection")}}</div>
          <div class="iqis-page-block-ctrl">
            <Select v-model="ruleForm.prodChkParamId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis" @on-change="changeProdChkParamId(ruleForm.prodChkParamId)">
                <Option v-for="(items,index) in prodBatch.ProjectData" :value="items.prodChkParamId"  :key="items.prodChkParamId">{{ items.inspectionTypeName}}</Option>
            </Select>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">{{$t("pqc.pps")}}</div>
          <div class="iqis-page-block-ctrl">
            <Select v-model="ruleForm.prodProcessId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis" @on-change="changeProdProcessId(ruleForm.prodProcessId)">
                <Option v-for="(items,index) in prodBatch.ProcessData" :value="items.prodProcessId"  :key="items.prodProcessId">{{ items.prodProcessName}}</Option>
            </Select>
          </div>
          <div class="iqis-page-block-label">{{$t("pqc.toi")}}</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="ruleForm.chkDevId" disabled placeholder="-"></i-input>
          </div>
        </i-col>
        <i-col span="6">
          <div class="iqis-page-block-label">{{$t("pqc.sn")}}</div>
          <div class="iqis-page-block-ctrl">
            <i-input placeholder="-" v-model="ruleForm.sampleQuantity" disabled style="width: 100%;"></i-input>
          </div>
          <div class="iqis-page-block-label">{{$t("pqc.unitSymbol")}}</div>
          <div class="iqis-page-block-ctrl">
            <i-input v-model="ruleForm.unitSymbol" disabled placeholder="-"></i-input>
          </div>
        </i-col>
        <i-col span="6">
        </i-col>
      </Row>
      <Row type="flex" :gutter="24">
            <i-col span="3">
              <div class="iqis-page-block-label">USL</div>
              <div class="iqis-page-block-ctrl">
                <i-input placeholder="-" disabled v-model="ruleForm.usl" style="width: 100%;"></i-input>
              </div>
            </i-col>
            <i-col span="3">
              <div class="iqis-page-block-label">SL</div>
              <div class="iqis-page-block-ctrl">
                <i-input placeholder="-" disabled v-model="ruleForm.sl" style="width: 100%;"></i-input>
              </div>
            </i-col>
            <i-col span="3">
              <div class="iqis-page-block-label">LSL</div>
              <div class="iqis-page-block-ctrl">
                <i-input placeholder="-" disabled v-model="ruleForm.lsl" style="width: 100%;"></i-input>
              </div>
            </i-col>
            <i-col span="3">
              <div class="iqis-page-block-label">CPK</div>
              <div class="iqis-page-block-ctrl">
                <i-input placeholder="-" disabled v-model="ruleForm.cpk" style="width: 100%;"></i-input>
              </div>
            </i-col>
            <!-- <i-col span="6">
                <div class="iqis-page-block-label">CA</div>
                <div class="iqis-page-block-ctrl">
                  <i-input placeholder="-" disabled v-model="ruleForm.ca" style="width: 100%;"></i-input>
                </div>
              </i-col> -->
            <i-col span="3">
              <div class="iqis-page-block-label">CP</div>
              <div class="iqis-page-block-ctrl">
                <i-input placeholder="-" disabled v-model="ruleForm.cp" style="width: 100%;"></i-input>
              </div>
            </i-col>
            <!-- <i-col span="3">
              <div class="iqis-page-block-label">PPK</div>
                <div class="iqis-page-block-ctrl">
                  <i-input placeholder="-" disabled v-model="ruleForm.ppk" style="width: 100%;"></i-input>
                </div>
            </i-col> -->
            <i-col span="3">
              <div class="iqis-page-block-label">MAX</div>
              <div class="iqis-page-block-ctrl">
                <!-- <i-input placeholder="-"  v-model="ruleForm.max" @on-blur="dataWarning(datas,true)" style="width: 100%;"></i-input> -->
                <i-input placeholder="-" disabled v-model="max" style="width: 100%;"></i-input>
              </div>
            </i-col>
            <i-col span="3">
              <div class="iqis-page-block-label">MIN</div>
              <div class="iqis-page-block-ctrl">
                <!-- <i-input placeholder="-"  v-model="ruleForm.min" @on-blur="dataWarning(datas,true)" style="width: 100%;"></i-input> -->
                <i-input placeholder="-" disabled v-model="min" style="width: 100%;"></i-input>
              </div>
            </i-col>
          </Row>
        </i-col>
      </Row>
    </div>
    <!--end body-->
  </div>

  <div class="iqis-page-block">
    <div class="iqis-page-block-title">
      {{$t("pqc.dataRecord")}}
    </div>
    <div class="iqis-page-block-body">
      <div class="iqis-page-block-tools" style="margin:15px 0;">
        <div class="iqis-page-block-tools-primary">
          <div class="iqis-page-block-label">&nbsp;</div>
        </div>
        <div class="iqis-page-block-tools-second">
          <!-- <span class="iqis-page-block-table-tip" style="margin-right: 24px;line-height: 32px;"></span> -->
          <form ref='files'>
            <input type="file" style='display:none' @change="ReadExcel($event)" ref='inputFile' accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
          </form>
          <Button type="ghost" icon="ios-download" @click='selectFile'>{{$t("pqc.importData")}}</Button>
          <Poptip :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')"confirm @on-ok="reset100" :title="i18n.t('pqc.ays')" placement="bottom-end">
            <Button :disabled="noPermsDis" type="ghost" icon="trash-a">{{$t('pqc.empty')}}</Button>
          </Poptip>
        </div>
      </div>
      <div class="iqis-page-block-table">
        <!-- <Form>
          <div style="flex: 1 1 100px;overflow: auto">
            <Table ref="dataTable" id='styleTableCpk' :loading="loading" class="iqis-inline-editor-table noBorder cpkData" border stripe  :columns="table.columns" :data="datas">
              <Button :disabled="noPermsDis" @click="addRow" class="iqis-table-footer-btn" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus">{{$t("pqc.aal")}}
              </Button>
            </Table>
          </div>
        </Form> -->
        <Row>
            <i-col class="cpkDataInput" span="3" style="width:10%" v-for="(item,index) in valueText" :key="index">
                <Input @on-enter="paramsFocus(index)" v-model="valueText[index]" :class="valueText[index]&&(Number(valueText[index])>Number(ruleForm.usl)||Number(valueText[index]))<Number(ruleForm.lsl)?'red':''"></Input>
            </i-col>
            <i-col span="24">
                <Button @click="addDataRow" style="width:100%;border-radius: 0px;" type="dashed" icon="plus">{{$t('pqc.add')}}</Button>
            </i-col>
        </Row>
        <!--<Button type="ghost" @click="addColumn" icon="plus" style="flex: 0 0 48px;width: 48px;" ></Button>-->
      </div>
    </div>
  </div>


  <IqisAffix placement="bottom" :offset="0">
    <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
      <!--<Button type="primary"  :loading="loadStat.saveLoading">提交</Button>-->
      <Button type="primary" v-if="!noPermsDis" @click="save" :loading="saveLoading">{{$t("pqc.save")}}</Button>
      <Button type="ghost" @click="closePage">{{$t("pqc.cancel")}}</Button>
    </div>
  </IqisAffix>
  <!--end blocks-->
  <div class="page-end" style="padding-bottom: 80px;padding-top: 30px;"></div>
</div>
</template>
<script>
import $ from 'jquery';
export default {
  props: ["params", "tabKey"],
  data() {
    let vm = this;
    return {
      newDate:new Date().getFullYear().toString()+(new Date().getMonth()+1).toString()+new Date().getDate().toString(),
      createBatchNo:1,
      createBatchNoDis:false,
      max:'',
      min:'',
      valueText:[],
      productList: [],
      selectOnFlag:2,
      selectIDNum:0,
      selectIDFlag:2,
      onSelectNum:0,
      i18n:window.i18n,
      headers: {
        "headers": {
          "Content-Type": "application/json; charset=UTF-8"
        }
      },
      loading:false,
      pqc: {},
      ProjectData: [],
      prodChkParamDisabled: true,
      datasDisabled: true,
      datas2: [],
      datas: [],
      selects: {},
      valueList: [],
      saveLoading: false,
      file:null,
      LineData: [],
      prodBatch: {
        disabled: false,
        btnState: '',
        basicDisabled: true,
        tableLength: 0,
        spectorNameData: [],
        productON: [],
        productNames: [],
        productTypeName: [],
        productSpec: [],
        departmentNameData: [],
        LineData: [],
        ProcessData: [],
        customerList: [],
        ProjectData: [],
        EquipmentData: [],
        UnitData: [],
        BatchNumber: [],
        QuantityNumber: [],
        CustomerName: [],
        batchDatatable: []
      },
      ruleForm: {
        valueText:[],
        createTime: vm.timetrans(new Date() / 1000),
        recordNum: '',
        prodBatchId:'',
        batchNo: '',
        productId: '',
        productName:'',
        productNo:"",
        prodTypeName:"",
        productSpec:"",
        batchQuantity: '',
        operatorId: '',
        customerId: '',
        prodLineId: '',
        inspectionTypeId: '',
        prodProcessId: '',
        chkDevId: '',
        sampleQuantity: '',
        measUnitId: '',
        prodChkParamId: '',
        sl: '',
        usl: '',
        lsl: '',
        ca: '',
        cp: '',
        cpk: '',
        ppk: '',
        max:'',
        min:'',
        valueArray: [],
        

      },
      rul: {},
      permsCur: [
        "UPDATE_DATA_RECORD",
        "INSERT_DATA_RECORD",
      ], //当前页面需要的权限名称
      permsBtn: { //控制每个权限对应按钮的禁用状态
        "UPDATE_DATA_RECORD": false,
        "INSERT_DATA_RECORD": false,
      },
      noPermsDis: true,
      date:null,
      BatchNumber:[],
      finalPorcessId:null
    }
  }, //end data

  created() {
    let that = this;
    var y = new Date().getFullYear().toString()
    var m = new Date().getMonth()>8?(new Date().getMonth()+1).toString():'0'+(new Date().getMonth()+1).toString()
    var d = new Date().getDate()>9?new Date().getDate().toString():'0'+new Date().getDate().toString()
    // this.newDate=new Date().getFullYear().toString()+new Date().getMonth()>8?(new Date().getMonth()+1).toString():'0'+(new Date().getMonth()+1).toString()+new Date().getDate()>9?new Date().getDate().toString():'0'+new Date().getDate().toString(),
    this.newDate = y+m+d
    this.date = (new Date()).getTime()+'S';
    let permsAll = this.$store.state.permissions;
    this.$iqis.utils.getPermissionsAll(permsAll, this.permsCur, this.permsBtn);
    let dataRecordId = this.$props.params && this.$props.params.dataRecordId;
    that.ProductionLP();
    if (dataRecordId) {
      that.selectOnFlag=0;
      that.selectIDFlag=0;
      that.refreshData(dataRecordId);
      that.prodBatch.btnState = "put";
    } else {
      that.ruleForm.batchNo=new Date().getFullYear().toString()+(new Date().getMonth()+1).toString()+new Date().getDate().toString()
      this.reset100()
      that.prodBatch.btnState = "post"
      that.productName();
      that.datasDisabled = false;
    }
    that.prodbatchAdd();
    that.spectorName();
    that.CurrentOperator();
    that.customerList();
    that.InspectionEquipment();
    that.basicCategory();
    if ((that.prodBatch.btnState == 'post' && that.permsBtn.INSERT_DATA_RECORD) || (that.prodBatch.btnState == 'put' && that.permsBtn.UPDATE_DATA_RECORD)) {
      that.noPermsDis = false;
    } else {
      that.noPermsDis = true;
    }
  },
  methods: {
    //按enter光标聚焦到下一个
    paramsFocus(index){
      let inputarr = []
      $(".cpkDataInput input[type=text]").each(function (index,element) {
        inputarr.push(element)
      })
      $(inputarr[index+1]).focus()
    },
    changeCreateBatchNo(){
      let that = this;
      if(that.createBatchNo==1){
        that.ruleForm.prodBatchId=''
        that.prodBatch.BatchNumber=that.BatchNumber
        that.ruleForm.productId=''
        that.ruleForm.productName=''
        that.ruleForm.productSpec=''
        that.ruleForm.prodTypeName=''
        that.prodBatch.ProcessData=[]
        that.ruleForm.cpk=''
        that.ruleForm.cp=''
        that.max=''
        that.min=''
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
        this.source(i18n.t('pqc.TerminationRequest')); 
      }
    },
    reset100(){//重置100个格子
      this.valueText=[]
      for (var i=0;i<100;i++){
        this.valueText.push('')
      }
    },
    getValueText(valueText){//回显或导入数据
      if(valueText.length<=100){
        for(let i in valueText){
          this.valueText[i]=valueText[i]
        }
      }else{
        let num = 10-(valueText.length-100)%10//需要补充的格子数量
        this.valueText=valueText;
        if(num==10){return;}
        for(var i=0;i<num;i++){
          this.valueText.push('')//补充格子
        }
      }
    },
    selectFile() {
      return this.$refs.inputFile.click();
    },
    ReadExcel(event) {
      let _this = this;
      let inputDOM = this.$refs.inputFile;
      if(inputDOM.value === ''){
        return;
      }
      _this.loading = true;
      // 通过DOM取文件数据
      this.file = event.currentTarget.files[0];
      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;
      var reader = new FileReader();
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require('xlsx');
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
              type: 'base64'
            });
          } else {
            wb = XLSX.read(binary, {
              type: 'binary'
            });
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          let valueText=[]
          for(let key in outdata[0]){//把第一行json数据的key作为data数据的第一行
            valueText.push(key)
          }
          for(let i in outdata){//push剩余行的data数据
            for(let key in outdata[i]){
              valueText.push(outdata[i][key])
            }
          }
          _this.getValueText(valueText)
          // _this.emptys();
          try{
            _this.$refs.files.reset()
            let data = [];
            for(let i=0;i<outdata.length;i++){
                let item = _.values(outdata[i]);
                for(let k=0;k<item.length;k++){
                  let value = item[k]
                  if(_this.isNumber(value)){
                    data.push(Number(value));
                  }
                }
            }
            let rows = parseInt(data.length/10);
            let yY = data.length % 10;
            if(yY !== 0){
              rows++
            }
            let k = 0;
            for(let i=0;i<rows;i++){
              if(i >=10){
                // _this.addRow()
              }
              for(let j=0;j<10;j++){
                _this.datas[i]['line'+j] = data[k];
                _this.datas2[i]['line'+j] = data[k];
                k++;
              }
            }
            // _this.comput();
            _this.loading = false;
          }catch(err){
            _this.loading = false;
          }
          
        }
        reader.readAsArrayBuffer(f);
      }
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    isNumber(val){
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(val) || regNeg.test(val)){
            return true;
        }else{
            return false;
        }

    },
    //数据初始化请求
    refreshData(obj) {
      let that = this;
      let idValueMap = [];
      let url = "/examinecenter/pqc/datarecord/";
      that.$http.get(url + obj, that.headers).then((res) => {
        //console.log(res)
        that.ruleForm = {
          dataRecordId: res.data.dataRecordId,
          createTime: new Date(res.data.createTime),
          prodBatchId:res.data.prodBatchId,
          recordNum: res.data.recordNum,
          productId: res.data.productId,
          batchNo: res.data.batchNo,
          operatorId: res.data.operatorId,
          prodLineId: res.data.prodLineId,
          customerId: res.data.customerId,
          inspectionTypeId: '',
          prodProcessId: res.data.prodProcessId,
          chkDevId: res.data.chkDevId,
          sampleQuantity: res.data.sampleQuantity,
          measUnitId: res.data.measUnitId,
          prodChkParamId: res.data.prodChkParamId,
          unitSymbol: res.data.unitSymbol,
          sl: res.data.sl,
          usl: res.data.usl,
          lsl: res.data.lsl,
          ca: res.data.ca,
          cp: res.data.cp,
          cpk: res.data.cpk,
          ppk: res.data.ppk,
          max: res.data.max,
          min: res.data.min,
          batchQuantity: res.data.batchQuantity,
          valueArray: res.data.valueArray
        }
        this.reset100()
        let valueText = res.data.valueText.split(',')
        this.getValueText(valueText)
        that.productName(that.ruleForm.productId, res.data.prodChkParamId, that.changeProdChkParam);
        that.ruleForm.inspectionTypeId=res.data.inspectionTypeId;


        let url = "/examinecenter/pqc/prodbatch?page=1&limit=9999999"
        that .$http.get(url).then((resp) => {
          let urlProduct = resp.data;
          urlProduct.forEach(e => {
            let productId = e.productId;
            let prodBatchId = e.prodBatchId;
            let batchNo = e.batchNo;
            let batchQuantity = e.batchQuantity;
            let prodLineList = e.prodLineList;
            let customerId = e.customerId;
            let boxOn = {
              batchNo,
              productId,
              customerId
            };
            let boxCustomer = {
              customerId,
              productId
            };
            let boxQuantity = {
              batchQuantity,
              productId
            };
            for (var i = 0; i < idValueMap.length; i++) {
              if (idValueMap[i].prodBatchId != e.prodBatchId) {
                idValueMap[i].no.push(boxOn);
                idValueMap[i].Quantity.push(boxQuantity);
                idValueMap[i].Customer.push(boxCustomer);
                return;
              }
            }
            idValueMap.push({
              prodBatchId: e.prodBatchId,
              no: [boxOn],
              Quantity: [boxQuantity],
              Customer: [boxCustomer],
            })
          })
          // that.prodBatch.batchDatatable = urlProduct
          for (var index in urlProduct) {
            if (res.data.batchNo === urlProduct[index].batchNo) {
              // that.LineData = [];
              // that.$http.get("/examinecenter/pqc/prodbatch/" + urlProduct[index].prodBatchId).then((resps) => {
              //   let urlProduct = resps.data.prodLineList;
              //   if (urlProduct.length > 0) {
              //     for (let index = 0; index < urlProduct.length; index++) {
              //       that.$http.get('/basic/prodline/' + urlProduct[index]).then(function(resp2) {
              //         if (resp2.data !== null) {
              //           that.LineData.push(resp2.data);
              //           that.ruleForm.prodLineId = res.data.prodLineId
              //         }
              //       })
              //     }
              //   }
              // })
              //  that.initLineSelectors(urlProduct[index].prodBatchId);
            }
          }
        })
        that.datasDisabled = false;
        
      })
    },
    //获取生产批号
    prodbatchAdd() {
      let that = this;
      let idValueMap = [];
      let urlProductNew = [];
      let url = "/examinecenter/pqc/prodbatch"
      // that.$http.get(url, {
      //   params: {
      //     limit: 99999999,
      //     query: "query=&productionState=0"
      //   }
      // }).then(function(res) {
      //   urlProductNew = res.data
      // })
      that.$http.get(url, {
        params: {
          limit: 99999999,
        }
      }).then((res) => {
        that.prodBatch.BatchNumber = res.data;
        that.BatchNumber = res.data;
        // let urlProduct = res.data;
        // for (var i in urlProductNew) {
        //   urlProduct.push(urlProductNew[i]);
        // }
        // urlProduct.forEach(e => {
        //   let productId = e.productId;
        //   let prodBatchId = e.prodBatchId;
        //   let batchNo = e.batchNo;
        //   let batchQuantity = e.batchQuantity;
        //   let prodLineList = e.prodLineList;
        //   let customerId = e.customerId;
        //   let boxOn = {
        //     batchNo,
        //     productId,
        //     customerId
        //   };
        //   let boxCustomer = {
        //     customerId,
        //     productId
        //   };
        //   let boxQuantity = {
        //     batchQuantity,
        //     productId
        //   };
        //   for (var i = 0; i < idValueMap.length; i++) {
        //     if (idValueMap[i].prodBatchId != e.prodBatchId) {
        //       idValueMap[i].no.push(boxOn);
        //       idValueMap[i].Quantity.push(boxQuantity);
        //       idValueMap[i].Customer.push(boxCustomer);
        //       return;
        //     }
        //   }
        //   idValueMap.push({
        //     prodBatchId: e.prodBatchId,
        //     no: [boxOn],
        //     Quantity: [boxQuantity],
        //     Customer: [boxCustomer],
        //   })
        // })
        // that.prodBatch.batchDatatable = urlProduct
        // that.prodBatch.BatchNumber = idValueMap[0].no;
        // that.prodBatch.QuantityNumber = idValueMap[0].Quantity;
        // that.prodBatch.CustomerName = idValueMap[0].Customer;
        if(this.$props.params && this.$props.params.dataRecordId){//如果是修改，产品批号类型无法修改
          that.createBatchNo=0;
          that.createBatchNoDis=true;
        }else{
          for(let i in that.prodBatch.BatchNumber){
            let item = that.prodBatch.BatchNumber[i];
            if(item.batchNo==Number(that.newDate)){
              that.createBatchNo=0;
              that.ruleForm.prodBatchId=item.prodBatchId
              break;
            }else{
              that.createBatchNo=1;
              that.ruleForm.batchNo=Number(that.newDate)
            }
          }
        }
      })
    },
    //获取检验员
    spectorName() {
      let that = this;
      let url = "/tenant/user?page=1&limit=99999";
      that.$http.get(url).then((res) => {
        that.prodBatch.spectorNameData = res.data
      })
    },
    //select选中
    changeProdBatchId(val) {
      
      let that = this;
      // that.ruleForm.prodLineId = null;
      that.LineData = [];
      that.ProductionLP();
      that.prodBatch.basicDisabled = false;
      if(that.selectOnFlag<1){
        that.selectOnFlag++;
      }else{
        if(val===''||val==null){
          that.ruleForm.batchQuantity=''
          that.ruleForm.customerId=''
        }else{
          that.$http.get("/examinecenter/pqc/prodbatch/" + val).then(function(resp) {
            that.productName(resp.data.productId);
            that.ruleForm.productId = resp.data.productId
            that.ruleForm.batchQuantity = resp.data.batchQuantity;
            that.ruleForm.customerId = resp.data.customerId;
            // that.initLineSelectors(val);
            that.changeProductId(that.ruleForm.productId)  

          });
          // for (var index in that.prodBatch.batchDatatable) {
          //   if (val === that.prodBatch.batchDatatable[index].batchNo) {
          //     that.productName(that.prodBatch.batchDatatable[index].productId);
          //     that.ruleForm.productId = that.prodBatch.batchDatatable[index].productId;
          //     that.ruleForm.batchQuantity = that.prodBatch.batchDatatable[index].batchQuantity;
          //     that.ruleForm.customerId = that.prodBatch.batchDatatable[index].customerId;
          //     that.initLineSelectors(that.prodBatch.batchDatatable[index].prodBatchId);
          //     that.ruleForm.prodBatchId = that.prodBatch.batchDatatable[index].prodBatchId;
    
          //   }
          // }
        }

      }

    },
    changeProductId(val) {
      if(!val){return;}
      let that = this
      that.$http.get('/examinecenter/pqc/prodbatch/byProduct/'+val).then(function(resp){
        that.prodBatch.BatchNumber=resp.data;
      })
      that.$http.get('/basic/product/detail/'+val).then(res=>{
        that.ruleForm.productName=res.data.name
        that.ruleForm.productNo=res.data.no
        that.ruleForm.prodTypeName=res.data.prodTypeName
        that.ruleForm.productSpec=res.data.spec
        let pqcParam = res.data.settings.qc.pqc.aql.prodFlowId
        if (pqcParam) {
          that.$http.get('/basic/prod-task/' + pqcParam)
            .then(resps => {
              that.prodBatch.ProcessData = resps.data.prodTaskItems;
              if(that.selectIDNum===0&&that.prodBatch.btnState == "put"){
                that.selectIDNum++
              }else{
                that.ruleForm.prodProcessId=''
                for(let i in resps.data.prodTaskItems){
                  if(resps.data.prodTaskItems[i].prodProcessName== i18n.t('pqc.finalInspection')&&!that.ruleForm.prodProcessId){
                    that.finalPorcessId = JSON.parse(JSON.stringify(resps.data.prodTaskItems[i].prodProcessId))
                    that.ruleForm.prodProcessId=resps.data.prodTaskItems[i].prodProcessId;
                  } 
                }
                that.ruleForm.prodChkParamId=''
              }
            })
        }else{
          that.prodBatch.ProcessData = [];
        }
        let urlProduct = res.data.settings.qc.pqc.params;
        let idValueMap=[]
        let procValueMap=[]
        let unitValueMap=[]
        urlProduct.forEach(e => {
          let name = e.inspectionTypeName;
          let prodChkParamId = e.prodChkParamId;
          let prodProcessName = e.prodProcessName;
          let unitSymbol = e.unitSymbol;

          let boxName = {
            name,
            prodChkParamId
          };
          let procName = {
            prodProcessName,
            prodChkParamId
          };
          let unitName = {
            unitSymbol,
            prodChkParamId
          }
          for (var i = 0; i < idValueMap.length; i++) {
            if (idValueMap[i].name != e.name) {
              idValueMap[i].name.push(boxName);
              procValueMap[i].name.push(procName);
              unitValueMap[i].name.push(unitName);
              return;
            }
          }
          idValueMap.push({
            name: [boxName]
          });
          procValueMap.push({
            name: [procName]
          });
          unitValueMap.push({
            name: [unitName]
          });
        });
        that.prodBatch.ProjectData = that.$iqis.utils.clone(urlProduct)
        that.ProjectData = that.$iqis.utils.clone(urlProduct)

      })
      // that.productName(val)
    },
    //获取产品信息
    productName(val, params, callback) {
      return;//以下接口数据量过大，避免使用
      let that = this;
      let idValueMap = [];
      let url_product = "/basic/product?page=1&limit=99999";
      that.$http.get(url_product).then((res) => {
        let urlProduct = res.data
        urlProduct.forEach(e => {
          let productId = e.productId;
          let no = e.no;
          let name = e.name;
          let typeName = e.prodTypeName;
          let spec = e.spec;
          let boxOn = {
            no,
            productId,
            name
          };
          let boxName = {
            name,
            productId,
            name
          };
          let boxSpec = {
            spec,
            productId
          };
          for (var i = 0; i < idValueMap.length; i++) {
            if (idValueMap[i].name != e.name) {
              idValueMap[i].no.push(boxOn);
              idValueMap[i].name.push(boxName);
              idValueMap[i].spec.push(boxSpec);
              return;
            }
          }
          idValueMap.push({
            no: [boxOn],
            name: [boxName],
            spec: [boxSpec],
          })
        });
        for (var index in urlProduct) {
          if (val === urlProduct[index].productId) {
            that.basicCategory(urlProduct[index].prodTypeName)
          }
        }
        that.prodBatch.productON = idValueMap[0].no;
        that.prodBatch.productNames = idValueMap[0].name;
        that.prodBatch.productSpec = idValueMap[0].spec;
      })
      if (val) {
        let idValueMap = [];
        let procValueMap = [];
        let unitValueMap = [];
        that.$http.get("/basic/product/detail/" + val).then((res) => {
          if (res.data.settings.qc.pqc.params) {
            let urlProduct = res.data.settings.qc.pqc.params;
            let pqcParam = res.data.settings.qc.pqc.aql.prodFlowId
            if (pqcParam != null) {
              that.$http.get('/basic/prod-task/' + pqcParam)
                .then(resps => {
                  that.prodBatch.ProcessData = resps.data.prodTaskItems;
                })
            }else{
              that.prodBatch.ProcessData = [];
            }
            urlProduct.forEach(e => {
              let name = e.inspectionTypeName;
              let prodChkParamId = e.prodChkParamId;
              let prodProcessName = e.prodProcessName;
              let unitSymbol = e.unitSymbol;

              let boxName = {
                name,
                prodChkParamId
              };
              let procName = {
                prodProcessName,
                prodChkParamId
              };
              let unitName = {
                unitSymbol,
                prodChkParamId
              }
              for (var i = 0; i < idValueMap.length; i++) {
                if (idValueMap[i].name != e.name) {
                  idValueMap[i].name.push(boxName);
                  procValueMap[i].name.push(procName);
                  unitValueMap[i].name.push(unitName);
                  return;
                }
              }
              idValueMap.push({
                name: [boxName]
              });
              procValueMap.push({
                name: [procName]
              });
              unitValueMap.push({
                name: [unitName]
              });
            });
            that.prodBatch.ProjectData = that.$iqis.utils.clone(urlProduct)
            that.ProjectData = that.$iqis.utils.clone(urlProduct)

            // that.prodBatch.ProjectData = idValueMap[0].name;
            // that.prodBatch.ProcessData=procValueMap[0].name;
            // that.prodBatch.UnitData = unitValueMap[0].name;
            if (params && callback) {
              callback(params)
            }
          }
        })
      }
    },
    changeProdProcessId(val) {
      let that = this;
      let newArray = [];
      if(that.onSelectNum===0&&that.prodBatch.btnState == "put"){
        that.onSelectNum++
      }else{
        this.ruleForm.prodChkParamId = null;
      }
      if (val) {
        for (let index in that.ProjectData) {
          let item = that.$iqis.utils.clone(that.ProjectData[index]);
          if (item.prodStageId == val) {
            newArray.push(item)
          }
        }
      }
      if(val == that.finalPorcessId){
        this.prodBatch.ProjectData = that.ProjectData
      }else{
        this.prodBatch.ProjectData = that.$iqis.utils.clone(newArray);
      }
      this.prodChkParamDisabled = false;
    },
    changeProdChkParamId(val) {
      let that = this;
      if (val) {
        setTimeout(function(){//带不出检验设备类别，带出延迟
          for (let index in that.prodBatch.ProjectData) {
            let item = that.prodBatch.ProjectData[index]
            if (item.prodChkParamId == val) {
              that.ruleForm.chkDevId = item.chkDevTypeName;
              that.ruleForm.sl = item.sl;
              that.ruleForm.usl = item.usl;
              that.ruleForm.wll = item.wll;
              that.ruleForm.wul = item.wul;
              that.ruleForm.lsl = item.lsl;
              that.ruleForm.scale = item.scale;
              that.ruleForm.inspectionTypeId = item.inspectionTypeId;
              // that.ruleForm.prodProcessId = item.prodStageId
              // that.ruleForm.sampleQuantity = item.sampleNum;
              that.ruleForm.unitSymbol = item.unitSymbol;
              that.rul = item;
              that.datasDisabled = false;
            }
          }
        },800)
      }else{
        that.ruleForm.chkDevId = ''
        that.ruleForm.sl = ''
        that.ruleForm.usl = ''
        that.ruleForm.wll = ''
        that.ruleForm.wul =''
        that.ruleForm.lsl =''
        that.ruleForm.scale = ''
        that.ruleForm.inspectionTypeId = ''
        // that.ruleForm.prodProcessId = ''
        that.ruleForm.unitSymbol = ''
      }
    },
    //根据产品批次Id生成生产线别下拉菜单
    initLineSelectors(val) {
      let that = this;
      // this.ruleForm.prodLineId = null
      that.$http.get("/examinecenter/pqc/prodbatch/" + val).then((res) => {
        that.LineData = res.data.prodLines;
      })
    },
    //获取产品类别
    basicCategory(obj) {
      let idValueMap = [];
      let url_prodtype = "/basic/prodtype?limit=99999999"
      this.$http.get(url_prodtype).then((res) => {
        let urlProduct = res.data;
        urlProduct.forEach(e => {
          let prodTypeId = e.prodTypeId;
          let name = e.name;
          let boxName = {
            name,
            prodTypeId
          }
          for (var i = 0; i < idValueMap.length; i++) {
            if (idValueMap[i].name != e.name) {
              idValueMap[i].name.push(boxName);
              return;
            }
          }
          idValueMap.push({
            name: [boxName]
          });
        });
        for (var index in urlProduct) {
          if (obj === urlProduct[index].name) {
            this.ruleForm.prodTypeId = urlProduct[index].prodTypeId
          }
        }
        this.prodBatch.productTypeName = idValueMap[0].name;
      })
    },
    //获取生产线别
    ProductionLP() {
      let that = this;
      let urlLine = "/basic/prodline?page=1&limit=99999";
      let urlProcess = "/basic/prod-process?page=1&limit=99999";
      let res = that.$iqis.utils.syncget(urlLine);
      // that.$http.get(urlLine).then((res) => {
        let idValueMap = [];
        let urlProduct = res.data
        urlProduct.forEach(e => {
          let prodLineId = e.prodLineId;
          let name = e.name;
          let boxName = {
            prodLineId,
            name
          }
          for (var i = 0; i < idValueMap.length; i++) {
            if (idValueMap[i].name != e.name) {
              idValueMap[i].name.push(boxName);
              return;
            }
          }
          idValueMap.push({
            name: [boxName]
          });
        });
        that.LineData = idValueMap[0].name
        console.log(that.LineData,'22222')
      // })
    },
    //获取客户信息数据
    customerList() {
      let that = this;
      let idValueMap = [];
      let url = "/bas/customerList?page=1&limit=9999&query=&fieldName="
      that.$http.get(url).then((res) => {
        let urlProduct = res.data;
        urlProduct.forEach(e => {
          let customerId = e.customerId;
          let name = e.customerAbbreviation;
          let boxName = {
            name,
            customerId
          }
          for (var i = 0; i < idValueMap.length; i++) {
            if (idValueMap[i].name != e.name) {
              idValueMap[i].name.push(boxName);
              return;
            }
          }
          idValueMap.push({
            name: [boxName]
          });
        });
        that.prodBatch.customerList = idValueMap[0].name;
      })
    },
    //检验项目
    //      InspectionProject(){
    //        let that=this;
    //        let idValueMap = [];
    //        let url="/basic/inspectiontype?page=1&limit=99999"
    //        that.$http.get(url).then((res)=>{
    //          let urlProduct=res.data;
    //          urlProduct.forEach(e => {
    //            let inspectionTypeId=e.inspectionTypeId;
    //            let name=e.name;
    //            let boxName={name,inspectionTypeId};
    //            for(var i=0;i<idValueMap.length;i++){
    //              if(idValueMap[i].name != e.name){
    //                idValueMap[i].name.push(boxName);
    //                return;
    //              }
    //            }
    //            idValueMap.push({
    //              name:[boxName]
    //            });
    //          });
    //          that.prodBatch.ProjectData=idValueMap[0].name;
    //        })
    //      },
    //检验设备
    InspectionEquipment() {
      let that = this;
      let idValueMap = [];
      let url = "/basic/chkdev?page=1&limit=88888"
      that.$http.get(url).then((res) => {
        that.prodBatch.EquipmentData = res.data
      })
    },
    //测量单位
    //      MeasuringUnit(){
    //      	let that=this;
    //        let idValueMap = [];
    //        let url="/basic/measunit?page=1&limit=99999"
    //        that.$http.get(url).then((res)=>{
    //					that.prodBatch.UnitData=res.data
    //        })
    //      },
    initDatas() {
      this.datas = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    },
    //      initColumns(){
    //        let newColumns = [];
    //        let vm = this;
    //        for(let i=1;i<=this.table.columnCount;i++){
    //          newColumns.push({
    //            title: ''+i,
    //            width: 100,
    //            align: 'center',
    //            ellipsis:true,
    //            key: 'd'+i,
    //            render:vm.$iqis.utils.tableHelper.editable.buildTextCell(vm,vm.cellEditorEnd),
    ////            render: (h, params) => {
    ////              var me = this
    ////              return h('div', [h('Input',
    ////                {
    ////                  props: {
    ////                    type: 'text',
    ////                    value: me.pqcInspection[params.index].usl,
    ////
    ////                  },
    ////                  on: {
    ////                    'on-blur': (event) => {
    ////                      this.pqcInspection[params.index].usl = event.target.value
    ////                    }
    ////                  }
    ////                })
    ////              ])
    ////            }
    //          })
    //        }
    //
    //        if(newColumns.length > 0){
    //          //newColumns[0].focus = true;
    //        }
    //        this.table.columns.splice(1,this.table.columns.length-1,...newColumns);
    //
    //      },
    addDataRow(){
      let that = this;
      //console.log(that.valueText)
      that.valueText.push('','','','','','','','','','')
    },
    addColumn() {
      this.table.columnCount++;
    },

    cellEditorEnd() {

    },
    timetrans(date) {
      var date = new Date(date * 1000); //如果date为10位不需要乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return Y + M + D + h + m;
    },
    //保存
    save() {
      // debugger
      let that = this;
      let params = [{
          type: 'Empty',
          title: i18n.t('pqc.rn'),
          value: that.ruleForm.recordNum
        },
        {
          type: 'No',
          title: i18n.t('pqc.rn'),
          value: that.ruleForm.recordNum
        },
      ]
      /* if(that.createBatchNo===1){
        params.push(
          {type:'Empty',title:i18n.t("pqc.ln"),value:that.ruleForm.batchNo}
        )
      }else{
        params.push(
          {type:'Empty',title:i18n.t("pqc.ln"),value:that.ruleForm.prodBatchId}
        )
      } */
      params.push(
        {
          type: 'Empty',
          title: i18n.t('pqc.pn'),
          value: that.ruleForm.productId
        },
        /* {
          type: 'Empty',
          title: '生产线别',
          value: that.ruleForm.prodLineId
        }, */
        {
          type: 'Empty',
          title: i18n.t('pqc.pp'),
          value: that.ruleForm.prodProcessId
        },
        {
          type: 'Empty',
          title: i18n.t('pqc.inspection'),
          value: that.ruleForm.prodChkParamId
        },
      )
      let state = true;
      for (let i in params) {
        state = that.$iqis.utils.formValidate(params[i].type, params[i].title, params[i].value, (tips) => {
          that.$Notice.warning({
            title: tips
          }) //,duration: 0
        })
        if (!state) {
          return;
          break;
        }
      }
      if (that.ruleForm.createTime == '') {
        this.$Notice.warning({
          title: i18n.t("pqc.tcn"),
        });
        return;
      }

      for (let index in that.LineData) {
        if (that.LineData[index].prodLineId == that.ruleForm.prodLineId) {
          that.ruleForm.prodLineName = that.LineData[index].name;
        }
      }
      that.ruleForm.prodChkParamId = that.rul.prodChkParamId
      // that.ruleForm.prodProcessId = that.rul.prodProcessId
      that.ruleForm.chkDevTypeId = that.rul.chkDevTypeId
      that.ruleForm.chkDevId = that.rul.chkDevId;
      that.ruleForm.chkDevTypeName = that.rul.chkDevTypeName
      that.ruleForm.measUnitId = that.rul.measUnitId
      let valueText = []
      for(var i in that.valueText){
          // if(this.checkCpkData(that.valueText[i]),i){return}//表单验证
          if(that.valueText[i]){//去空
              valueText.push(that.valueText[i])
          }
      }
      if(!that.ruleForm.batchNo){
        that.ruleForm.prodBatchId=''
      }
      that.ruleForm.valueText=valueText.join(',')
      let params2 = this.$iqis.utils.clone(that.ruleForm);
      let url = "/examinecenter/pqc/datarecord";
      if (!that.ruleForm.dataRecordId) {
        that.$http.post(url, params2, that.headers).then((res) => {
          that.closePage();
          // this.$emit("open-tab", "exam-pqc-cpk-add-" + res.data.dataRecordId, "修改检测数据CPK", "page-exam-pqc-cpk-add", {dataRecordId: res.data.dataRecordId});
          that.$Message.success(i18n.t("pqc.as"));
        })
      } else {

        that.$http.put(url, params2, that.headers).then((res) => {
          that.refreshData(params2.dataRecordId);
          that.$Message.success(i18n.t("pqc.ats"));
          that.closePage();
        })
      }
    },
    closePage() {
      this.$emit("close-tab", this.$props.tabKey);
    },
    //获取当前登录人员信息 /tenant/user/profile
    CurrentOperator() {
      let that = this
      let url = '/tenant/user/profile'
      that.$http.get(url).then(res => {
        that.ruleForm.operatorId = res.data.userId
      })
    },
    clearNoNum(obj, num) {
      obj.value = obj.value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符  
      obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
      obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      let allRep = '';
      for (let i = 0; i < num; i++) {
        let rep = '\\d';
        allRep += rep;
      }
      let replaces = new RegExp('(\\-)*(\\d+)\.(' + allRep + ').*', );
      obj.value = obj.value.replace(replaces, '$1$2.$3'); //只能输入两个小数  
      if (obj.value.indexOf(".") < 0 && obj.value != "") { //以上已经过滤，此处控制的是如果没有小数点 
        obj.value = parseFloat(obj.value);
      }
    },
    checkCpkData(item,index){
      let that = this;
      if(item&&(isNaN(item)||item>100||item<0.0001)){//验证数字和范围
          that.$Notice.warning({title:i18n.t('quality.num100')})
          let j = Number(index)+Number(1)
          //console.log(j)
          $(".cpkDataInput:nth-child("+Number(j)+")").find("input").focus()
          return true;
      }
    }
  }, //end methods
  watch: {
    prodLineID: function(a) {
    },
    "LineData":function(data){
      console.log('实时监控LineData=======》',data)
    },
    "valueText":function(data){
      if(!data){return;}
      let valueText=[]
      for(var i in data){
          // if(this.checkCpkData(data[i]),i){return}//表单验证
          if(data[i]){//去空
              valueText.push(data[i])
          }
      }
      for(var i=0;i<valueText.length-1;i++){//排序取最大小值
          for(var j=0;j<valueText.length-i-1;j++){
              if(Number(valueText[j])>Number(valueText[j+1])){
                  var x = valueText[j]
                  valueText[j]=valueText[j+1]
                      valueText[j+1]=x
              }
          }
      }
      this.max=valueText[valueText.length-1]
      this.min=valueText[0]
      this.ruleForm.sampleQuantity = valueText.length
      // debugger
      let all = 0; //所有个数
      let newArr = JSON.parse(JSON.stringify(valueText)); //所有组起来的数组
      let min = 0;
      let max = 0;
      let cpk = 0;
      let sd = 0; //标准偏差
      let cp = 0;
      let avg = 0; //平均
      let length = newArr.length
      let sum = function(x, y) {
        return x + y;
      };　　 //求和函数
      let square = function(x) {
        return x * x;
      };　　 //数组中每个元素求它的平方
      all = newArr.length;
      if (!all) {
        return;
      }
      // newArr.sort((a, b) => {
      //   return a - b;
      // });
      // min = newArr[0];
      // max = newArr[all - 1];
      let sumAll = 0;
      for (let i = 0; i < all; i++) {
        sumAll += Number(newArr[i])
      }
      avg = (sumAll / all);
      let deviations = newArr.map(function(x) {
        return x - avg;
      });
      sd = Math.sqrt(deviations.map(square).reduce(sum) / (newArr.length - 1)) ? Math.sqrt(deviations.map(square).reduce(sum) / (newArr.length - 1)) : 0;
      // sd = sd.toFixed(2);

      if (this.ruleForm.lsl && this.ruleForm.usl) {
        // (F39-F38)/(6*C42)
        cp = ((Number(this.ruleForm.usl) - Number(this.ruleForm.lsl)) / (6 * sd));
      }
      // ABS(0.5*(F39+F38)-C41)/(0.5*(F39-F38))

      let AD372 = Math.abs((0.5 * (Number(this.ruleForm.lsl) + Number(this.ruleForm.usl)) - avg) / (0.5 * (Number(this.ruleForm.usl) - Number(this.ruleForm.lsl))))

      let AD373 = (1 - AD372) * cp
      cpk = AD372 >= 1 ? 0 : AD373;
      avg = avg.toFixed(2);
      AD372 = AD372.toFixed(2);
      cp = cp == 'Infinity' ? 0.00 : cp.toFixed(2);
      AD373 = AD373.toFixed(2);
      sd = sd.toFixed(2);
      cpk = cpk == 'Infinity' ? 0 : cpk.toFixed(2);
      let params = {
        newArr,
        min,
        max,
        AD372,
        AD373,
        cpk,
        sd,
        cp,
        avg
      }
      this.ruleForm.cpk = cpk;
      this.ruleForm.cp = cp;
    }
  },
  computed: {
    prodLineID() {
      return this.ruleForm.prodLineId;
    },
  }
}
</script>
<style>
.dataW {
  width: 100%!important;
}
.cpkData .ivu-table-cell.ivu-table-cell-ellipsis,.cpkData .ivu-table-cell.ivu-table-cell-ellipsis div,.cpkData .ivu-table-cell.ivu-table-cell-ellipsis input{
  height:inherit;
}
.cpkDataInput .ivu-input{
    width:100%;
    border-right:0;
    border-top:0;
    border-radius: 0;
}
.cpkDataInput .ivu-input:hover,.cpkDataInput .ivu-input:focus{
    border-color:#dddee1;
    box-shadow: 0.5px 0 0 2px rgba(45,140,240,.2)
}
.cpkDataInput:nth-child(-n+10) .ivu-input{
    border-top:1px solid #dddee1;
}
.cpkDataInput:nth-child(10n) .ivu-input{
    border-right:1px solid #dddee1;
}
.cpkDataInput .red input{
  background:red;
  color:#fff;
}
</style>
