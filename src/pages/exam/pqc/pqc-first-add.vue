<template>
  <div>
    <div class="iqis-page-block-title">{{$t("pqc.cf")}}
      <RadioGroup v-model="qualityRecordId" @on-change="example">
        <Radio label="productCheck" :disabled="switch1" >
          <span>{{$t("pqc.standardRecord")}}</span>
        </Radio>
        <Radio label="devickCheck" :disabled="switch2">
          <span>{{$t("pqc.simpleRecord")}}</span>
        </Radio>
      </RadioGroup>
    </div>
    <pqcFirstRecord v-show="qualityRecordId == 'productCheck' ? true : false" :id="prop" @hidden="hidden" @off="turnOff" @closeThenOpen="closeThenOpen"></pqcFirstRecord>
    <pqcFirstRecordSimple  ref="pqcfirstrecord" v-show="qualityRecordId == 'devickCheck' ? true : false" :id="prop" @hidden="hidden" @off="turnOff"></pqcFirstRecordSimple>
  </div>
</template>

<script>
import $ from 'jquery';
import pqcFirstRecord from './pqcFirstRecord';
import pqcFirstRecordSimple from './pqcFirstRecordSimple';

export default {
  props:["params",'tabKey'],
   components: {
      pqcFirstRecord,
      pqcFirstRecordSimple,
   },
   data(){
     return{
       qualityRecordId:"productCheck",
       switch1:false,
       switch2:false,
       prop:"",
       fromChild:""
     }
   },
   created() {
     if(this.$props.params.type==1){
       this.switch2 = true
       this.prop = this.$props.params.firstRecordId
       this.qualityRecordId="productCheck"
     }
     else{
       this.switch1 = true
       this.prop =  this.$props.params.firstRecordId
       this.qualityRecordId="devickCheck"
     }
   },
   methods:{
     example() {
        //  //console.log(this.$refs.pqcfirstrecord,444)
     },
     hidden(val){
       if(val==1) {
         this.switch1=true
       }
       else{
         this.switch2=true
       } 
     },
     turnOff(o) {
       this.$emit("close-tab",this.$props.tabKey)
     },
     closeThenOpen(o){
      this.$emit("close-tab",this.$props.tabKey)
      this.$emit('open-tab',o.key,o.title,o.page,o.param)
     }
  }
}
</script>
<style>

</style>
