<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-body">
        <div class="main-box">
            <Row type="flex" :gutter="24">
            <i-col  class="magTOp boxs">

                <i-col :span="manufacturerId?8:24">
                <div class="fl nameWidth marginLF"><span>{{$t('iqc.supplierType')}}</span></div>
                <div class="marginLF">
                <Select :placeholder="i18n.t('pleaseChoose')" :disabled="noPermsDis" v-model="ruleForm.manufacturerTypeId" filterable class="Wout">
                    <Option v-for="(items,index) in prodBatch.dataTable" :value="items.manufacturerTypeId" :label="items.manufacturerTypeName"  :key="index">{{items.manufacturerTypeNum}}/{{ items.manufacturerTypeName}}</Option>
                </Select>
                </div>
                </i-col>
                <i-col :span="manufacturerId?8:24" v-if="manufacturerId">
                <div class="fl nameWidth marginLF"><span>{{$t('iqc.reviewResult')}}</span></div>
                    <div class="marginLF">
                    <i-input v-model.trim="ruleForm.scoringLevel" :placeholder="i18n.t('iqc.notReview')" style="width: 100%"  :disabled="prodBatch.disabled"></i-input>
                    </div>
                </i-col>
                <i-col :span="manufacturerId?8:24" v-if="manufacturerId">
                    <div class="fl nameWidth marginLF"><span>{{$t('iqc.reviewGrade')}}</span></div>
                    <div class="marginLF">
                    <i-input v-model.trim="ruleForm.reviewLevel" :placeholder="i18n.t('iqc.notReview')" style="width: 100%"  :disabled="prodBatch.disabled"></i-input>
                    </div>
                </i-col>
            </i-col>
            <i-col span="24"  class="magTOp">
                <div class="fl nameWidth marginLF"><span>{{$t('iqc.supplierFullNameCH')}}</span></div>
                <div class="marginLF gPosition">
                    <i-input :disabled="noPermsDis" ref='inputs' v-model.trim="ruleForm.manufacturerName" style="width: 100%" @on-blur="onBlur(ruleForm.manufacturerName)"></i-input>
                    <span class="guagliang" v-if="ruleForm.manufacturerName !=''&&this.prodBatch.supplierTenantId !=null"><Icon type="checkmark"></Icon>{{$t('iqc.haveRelation')}}</span>
                </div>
            </i-col>
            <div class="NoPrompt" v-if="this.prodBatch.state ==false&&this.prodBatch.supplierTenantId==null">{{$t('iqc.notHaveRelation')}}</div>
                        <i-col span="24"  class="magTOp">
                <div class="fl nameWidth marginLF"><span>{{$t('iqc.supplierFullNameEN')}}</span></div>
                <div class="marginLF">
                    <i-input :disabled="noPermsDis" v-model.trim="ruleForm.manufacturerEngName" style="width: 100%" ></i-input>
                </div>
            </i-col>
                        <i-col span="24"  class="magTOp">
                <div class="fl nameWidth marginLF"><span>{{$t('iqc.supplierNo')}}</span></div>
                <div class="marginLF">
                    <i-input :disabled="noPermsDis" v-model.trim="ruleForm.manufacturerNum" style="width: 100%" ></i-input>
                </div>
            </i-col>
                        <i-col span="24"  class="magTOp">
                <div class="fl nameWidth marginLF"><span>{{$t('iqc.supplierAbbr')}}</span></div>
                <div class="marginLF">
                    <i-input :disabled="noPermsDis" v-model.trim="ruleForm.manufacturerAbbreviation" style="width: 100%" ></i-input>
                </div>
            </i-col>
                        <i-col span="24"  class="magTOp">
                <div class="fl nameWidth marginLF"><span>{{$t('iqc.contact')}}</span></div>
                <div class="marginLF">
                    <i-input :disabled="noPermsDis" v-model.trim="ruleForm.contacts" style="width: 100%" ></i-input>
                </div>
            </i-col>
                        <i-col span="24"  class="magTOp">
                <div class="fl nameWidth marginLF"><span>{{$t('iqc.phone')}}</span></div>
                <div class="marginLF">
                    <i-input :disabled="noPermsDis" v-model.trim="ruleForm.phone" style="width: 100%" ></i-input>
                </div>
            </i-col>
                    <i-col span="24"  class="magTOp">
                <div class="fl nameWidth marginLF"><span>{{$t('iqc.supplieraddress')}}</span></div>
                <div class="marginLF">
                    <i-input :disabled="noPermsDis" v-model.trim="ruleForm.address" style="width: 100%" ></i-input>
                </div>
            </i-col>
                <i-col span="24" class="magTOp">
                <div class="fl nameWidth marginLF"><span>{{$t('iqc.remarks')}}</span></div>
                <div class="marginLF">
                    <i-input :disabled="noPermsDis" type="textarea" v-model.trim="ruleForm.remark" style="width: 100%" ></i-input>
                </div>
            </i-col>
            </Row>

        </div>
        <IqisAffix placement="bottom" :offset="0">
        <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
            <Button type="primary" v-if='!noPermsDis' @click="save" :loading="prodBatch.saveLoading">{{$t('iqc.save')}}</Button>
            <Button type="ghost" @click="closePage">{{$t('iqc.cancel')}}</Button>
        </div>
        </IqisAffix>
        <div class="page-end" style="padding-bottom: 65px"></div>
      <!--end body-->
      </div>
    </div>




  </div>
</template>
<script>
  import ICol from "iview/src/components/grid/col";

  export default {
    components: {ICol},
    props:["params","tabKey"],
    data(){
      let vm = this;
      return {
        i18n:window.i18n,
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        prodBatch:{
        dataTable:[],
        manufacturerId:'',
        manufacturerTypeId:'',
        saveLoading:false,
        disabled:false,
        btnState:'',
        supplierTenantId:null,

        state:false,
        },
        ruleForm:{
            scoringLevel:'',
            reviewLevel:'',
            manufacturerName:'',
            manufacturerEngName:'',
            manufacturerNum:'',
            manufacturerAbbreviation:'',
            contacts:'',
            phone:'',
            address:'',
            remark:'',
            supplierTenantId:''
        },
        permsCur:[
          "UPDATE_SUPPLIER",
          "INSERT_SUPPLIER"
        ],
        permsBtn:{
          "UPDATE_SUPPLIER":false,
          "INSERT_SUPPLIER":false,
        },
        noPermsDis:true,
      }
    },
   created(){
      let that=this;
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      that.prodBatch.state=true
      let manufacturerId = this.$props.params && this.$props.params.manufacturerId;
      that.manufacturerId=manufacturerId;
      if(manufacturerId){
          that.prodBatch.disabled=true
          that.refreshData(manufacturerId)
          that.basicCategory()
          that.prodBatch.btnState="put"
      }else{
          that.basicCategory()
          that.ruleForm={}
          that.prodBatch.disabled=true
          that.prodBatch.btnState="post"
          that.ruleForm.manufacturerTypeId = that.$props.params && that.$props.params.manufacturerTypeId;
          //console.log(that.$props,'传过来的供应商类别')
      }
      if((!that.manufacturerId&&that.permsBtn.INSERT_SUPPLIER)||(that.manufacturerId&&that.permsBtn.UPDATE_SUPPLIER)){
          that.noPermsDis=false;
      }else{
          that.noPermsDis=true;
      }
   },
   mounted(){
       //console.log(this.ruleForm.manufacturerName,111)
    //    this.onBlur(this.ruleForm.manufacturerName);
   },
    methods:{
    refreshData(obj){
     let that=this;
     let url="/bas/manufacturer/"
     
     that.$http.get(url+obj).then((res)=>{
        that.ruleForm={
            manufacturerId:obj,
            manufacturerTypeId:res.data.manufacturerTypeId,
            scoringLevel:res.data.scoringLevel,
            reviewLevel:res.data.reviewLevel,
            manufacturerName:res.data.manufacturerName,
            manufacturerEngName:res.data.manufacturerEngName,
            manufacturerNum:res.data.manufacturerNum,
            manufacturerAbbreviation:res.data.manufacturerAbbreviation,
            contacts:res.data.contacts,
            phone:res.data.phone,
            address:res.data.address,
            remark:res.data.remark,
        }
        that.manufacturerTypeId=res.data.manufacturerTypeId//储存原类别，修改后跳转到原类别id
        that.prodBatch.supplierTenantId=res.data.supplierTenantId
        that.onBlur(that.ruleForm.manufacturerName);
        if(res.data.supplierTenantId==null||res.data.supplierTenantId==''){
            that.prodBatch.state=true
        }else{
            that.prodBatch.state=false;
        }
     })
    },
      //获取商品类别
      basicCategory(){
       let idValueMap = [];
       let url_prodtype="/bas/manufacturerType?page=1&limit=99999"
        this.$http.get(url_prodtype).then((res)=>{
          let urlProduct=res.data
           urlProduct.forEach(e => {
            let manufacturerTypeId=e.manufacturerTypeId
            let manufacturerTypeNum=e.manufacturerTypeNum;
            let manufacturerTypeName=e.manufacturerTypeName;
            let boxName={manufacturerTypeId,manufacturerTypeNum,manufacturerTypeName}
           for(var i=0;i<idValueMap.length;i++){
            if(idValueMap[i].manufacturerTypeId != e.manufacturerTypeId){
               idValueMap[i].name.push(boxName);
              return;
             }}
             idValueMap.push({
                name:[boxName]
              });
              });
             this.prodBatch.dataTable=idValueMap[0].name;
        })
      },
      //离开焦点数据查询
      onBlur(val){
          let that=this;
          if(!val){
              that.prodBatch.state=true
              return;
          }
        let url="/tenant/tenant/?manufacturerName="
        that.$http.get(url+val).then((res)=>{
            if(res.data){
                that.prodBatch.state=true
                that.prodBatch.supplierTenantId=res.data.tenantId
                that.ruleForm.supplierTenantId = res.data.tenantId

            }else {
                that.prodBatch.state=false
              that.prodBatch.supplierTenantId=null
            }
        })
      },
    //保存
    save(){
     let that=this;
     let state=true;
     let params = [
        {type:'Empty',title:i18n.t('iqc.supplierType'),value:that.ruleForm.manufacturerTypeId},
        {type:'Empty',title:i18n.t('iqc.supplierFullNameCH'),value:that.ruleForm.manufacturerName},
        {type:'NameCN',title:i18n.t('iqc.supplierFullNameCH'),value:that.ruleForm.manufacturerName},
        // {type:'Empty',title:'供应商英文全称',value:that.ruleForm.manufacturerEngName},
        {type:'NameEN',title:i18n.t('iqc.supplierFullNameEN'),value:that.ruleForm.manufacturerEngName},
        {type:'Empty',title:i18n.t('iqc.supplierNo'),value:that.ruleForm.manufacturerNum},
        {type:'No',title:i18n.t('iqc.supplierNo'),value:that.ruleForm.manufacturerNum},
        {type:'Empty',title:i18n.t('iqc.supplierAbbr'),value:that.ruleForm.manufacturerAbbreviation},
        {type:'Name',title:i18n.t('iqc.supplierAbbr'),value:that.ruleForm.manufacturerAbbreviation},
        {type:'Word100',title:i18n.t('iqc.contact'),value:that.ruleForm.contacts},
        {type:'Word100',title:i18n.t('iqc.phone'),value:that.ruleForm.phone},
        {type:'Word100',title:i18n.t('iqc.supplieraddress'),value:that.ruleForm.address},
        {type:'Word600',title:i18n.t('iqc.remarks'),value:that.ruleForm.remark},
      ]
      
      for(let i in params){
        state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
          that.$Notice.warning({title:tips})//,duration: 0
        })
        if(!state){
          return;
          break;
        }
      }
    //  let index=false
     let index=true;
     let url="/bas/manufacturer"
        // let manufacturerTypeId=that.ruleForm.manufacturerTypeId;
        // let scoringLevel=that.ruleForm.scoringLevel;
        // let reviewLevel=that.ruleForm.reviewLevel;
        // let manufacturerName=that.ruleForm.manufacturerName;
        // let manufacturerEngName=that.ruleForm.manufacturerEngName;
        // let manufacturerNum=that.ruleForm.manufacturerNum;
        // let manufacturerAbbreviation=that.ruleForm.manufacturerAbbreviation;
        // let contacts=that.ruleForm.contacts;
        // let phone=that.ruleForm.phone;
        // let address=that.ruleForm.address;
        // if(manufacturerTypeId==''||manufacturerTypeId==undefined||manufacturerName==''||manufacturerName==undefined||manufacturerNum==''||manufacturerNum==undefined||manufacturerEngName==''||manufacturerEngName==undefined||manufacturerAbbreviation==''||manufacturerAbbreviation==undefined||contacts==''||contacts==undefined||phone==''||phone==undefined||address==''||address==undefined){
        //     this.$Notice.warning({
        //     title: '请完善列表信息',desc: ''});
        //     return;
        // }else{
        //     index=true;
        // }
        if(index==true){
            if(that.prodBatch.btnState=='post'){
                that.manufacturerTypeId=that.ruleForm.manufacturerTypeId;//添加后跳转到新的分类
                that.$http.post(url,that.ruleForm,that.headers).then((res)=>{
                    that.$Message.success(i18n.t('iqc.addSuccess'));
                    that.$emit("close-tab",this.$props.tabKey);
                    that.$emit("close-tab",'qc-iqc-suppliers-list'); 
                    that.$emit("open-tab",'qc-iqc-suppliers-list',i18n.t('iqc.supplierList'),'page-exam-iqc-Supplier-list',{manufacturerTypeId:that.manufacturerTypeId});
                    that.$store.commit('RENDER_CHANGE',true)
                })
            }else if(that.prodBatch.btnState=='put'){

                that.$http.put(url,that.ruleForm,that.headers).then((res)=>{
                    that.$Message.success(i18n.t('iqc.editSuccess'));
                    that.$emit("close-tab",'qc-iqc-suppliers-list'); 
                    
                    that.$emit("close-tab",this.$props.tabKey); 
                    that.$emit("open-tab",'qc-iqc-suppliers-list',i18n.t('iqc.supplierList'),'page-exam-iqc-Supplier-list',{manufacturerTypeId:that.manufacturerTypeId});
                    that.$store.commit('RENDER_CHANGE',true)
                })
            }
        }
    },
    //取消
    closePage(){
		this.$emit("close-tab",this.$props.tabKey);
    },
    },//end methods
  }
</script>
<style scoped>
    .fl{float: left}
    .Wout{width: auto;}
    .magTOp{margin: 5px 0;line-height: 30px;}
    .nameWidth{width: 100%;/* text-align: center; */box-sizing: border-box;padding-right: 10px;}
    .marginLF{/* margin-left: 115px */margin-left: 0px}
    .main-box{margin: 0 130px;}
    .boxs{padding-left:0!important;padding-right: 0!important;}
    .gPosition{position: relative}
    .guagliang{display: inline-block;position: absolute;top: 0;right: -65px;color: forestgreen;}
    .guagliang i{display: inline-block;padding-right: 5px;}
    .NoPrompt{width: 100%;box-sizing: border-box;/* padding-left: 129px; */padding-left: 12px;color: #418fee;}
</style>

