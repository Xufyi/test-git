<template>
  <Cascader  class="editor-table-cascader-cell" :disabled="$props.disabled" :transfer="false" v-model="typeValue" :data="$props.category[0].children"
            :render-format = "typeRender" @on-change="onchange" @on-visible-change="onvisiblechange"
            :change-on-select ="$props.changeOnSelect != false" :clearable="false" style="width: 100%"></Cascader>
</template>
<script>
  export default {
    props:["value","field","row-index","height","row","category","valueField","labelField","labelRender","change-on-select",'disabled'],
    data(){
      // //console.log("EditorCascaderCell: got value:"+this.$props.value);
      let result = this.$iqis.utils.findPathInTree(this.$props.category[0],[],this.$props.value,this.$props.valueField);
      result = result || [];
      // //console.log("EditorCascaderCell: call path:"+result.join(","));
      return {
        inputValue:this.$props.value,
        typeValue:result,
        val:[],
        s:[]
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
      typeRender(labels,nodes){
        if(!labels || labels.length == 0){
          return '-';
        }
        
        let result = labels[labels.length-1];

        if( (this.$props.category.length > 0  && result == this.$props.category[0].label)){
          return '-'
        }

        if(this.$props.labelRender){
          result = this.$props.labelRender(labels,nodes);
        }

        return result;
        // if(labels.length<=2) {
        //   labels= labels
        // }else {
        //   labels=labels.slice(-2)
        // }
        // let result=labels.join(" / ")
        // return result;
      },
      onchange(val,s){
        this.val = val;
        this.s = s;
        // //console.log('EditorCascaderCell onchange:')
        // //console.log('EditorCascaderCell iarg1(full path id-value)=',val)
        // //console.log('EditorCascaderCell iarg2(full path obj-value))=',s)
        let o = s[s.length-1];
        let v = 0;
        if(val && val.length>0){
          v = val[val.length-1];
        }
        this.inputValue = v;
        // //console.log('EditorCascaderCell original data=',this.$props.category)
        // //console.log('EditorCascaderCell oarg1(selected value id)=',v)
        // //console.log('EditorCascaderCell oarg2(rowIndex)=',this.$props.rowIndex)
        // //console.log('EditorCascaderCell field(field)=',this.$props.field)
        this.$emit("input",v,this.$props.rowIndex,this.$props.field,o);
      },
      onvisiblechange(visible){
        // //console.log('EditorCascaderCell onvisiblechange: visible=',visible)
        let o = this.s[this.s.length-1] || {};
        let v = 0;//id
        if(this.val && this.val.length>0){
          v = this.val[this.val.length-1];
        }
        this.inputValue = v;
        // //console.log(v,this.$props.rowIndex,this.$props.field,o,'onvisiblechange---------------------------------------')
        if(!visible){
          this.$emit("onclose",v,this.$props.rowIndex,this.$props.field,o);
        }
      }

    }
  }

</script>

