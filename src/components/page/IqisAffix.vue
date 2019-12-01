<template>
  <div class="iqis-affix-warp" :style="warpStyle">
    <slot></slot>
  </div>
</template>
<script>
import SessionStorage from '@/utils/sessionStorage'
  export default {
    props:["placement","offset"],
    data(){
      return {
        warpWidth:0,
        
      }
    },
    mounted(){
      this.resize();
    },
    computed:{
      warpStyle(){
        //console.log("exec warpStyle");
        //console.log(this.warpWidth,'wwwwwwwww')
        let locale=SessionStorage.get("language-main")
        let width='';
        if(locale=='en_US'&&this.$store.state.showNavFlag){
          width = this.warpWidth-54;
        }else{
          width=this.warpWidth;
        }
        let style = {
          width:width+"px"
        };
        if(this.$props.placement == "top"){
          style["top"] = this.$props.offset+"px";
        }else{
          style["bottom"] = this.$props.offset+"px";
        }
        //console.log(style);
        return style;
      }
    },
    watch:{
      '$store.getters.pageWidth':'resize'
    },
    methods:{
      resize(){
        let itemWidth = (this.$store.getters.pageWidth)
        //console.log("exec resize,itemWidth="+itemWidth);
        this.warpWidth = itemWidth;
        
      }
    }
  }
</script>
<style>
  .iqis-affix-warp{
    position: fixed;
    z-index: 10;
  }

</style>
