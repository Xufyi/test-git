<template>
  <input ref="text" class="iqis-editor-text" :disabled= $props.disabled :style="{height:this.$props.height+'px'}" style="background-color: transparent !important;;border: 0 !important;" v-model="inputValue" :placeholder="this.$props.required?'必填':''" v-on:blur="textChange" />
</template>
<script>
  export default {
    props:["value","field","row-index","height","row","required","focus","disabled"],
    data(){
      return {
        inputValue:this.$props.value
      }
    },
    watch:{
      "$props.row":function (val) {

      }
    },
    mounted(){
      if((this.$props.required || this.$props.focus) && !this.inputValue){
        this.$refs.text.focus();
      }
    },
    methods:{
      textChange(){
        this.$emit("input",this.inputValue,this.$props.rowIndex,this.$props.field);
      }
    }

  }
</script>
<style scoped>
  .iqis-editor-text{
    width: 100%;
    outline: none;
    color: #5C5C5C;
  }

</style>
