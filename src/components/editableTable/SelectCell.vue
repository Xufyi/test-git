<template>
  <Select ref="select" class="editor-table-select-cell" :transfer="true" :disabled= $props.disabled @on-change="textChange"  style="width: 100%;" v-model="inputValue" filterable>
    <Option v-for="(item, index) in $props.list" :value="item[$props.valueField]" :key="item[$props.valueField]+'-'+index">{{ item[$props.labelField] }}</Option>
  </Select>
</template>
<script>
  export default {
    props:["value","field","row-index","height","disabled","row","list","valueField","labelField"],
    data(){
      return {
        inputValue:this.$props.value
      }
    },
    computed:{
      options(){

      }
    },
    watch:{
      "$props.row":function (val) {

      }
    },
    mounted(){

    },
    methods:{
      textChange(val){
        this.$emit("input",this.inputValue,this.$props.rowIndex,this.$props.field);
      }
    }
  }

</script>

