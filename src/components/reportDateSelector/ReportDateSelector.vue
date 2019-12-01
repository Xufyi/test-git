<template>
  <div  class="iqis-rds-text-btn">
    <Button @click="setDay(0)" :type="selectedDay==0?'primary':'text'">{{$t("dateField.today")}}</Button>
    <Button @click="setDay(1)" v-if="isShow" :type="selectedDay==1?'primary':'text'">{{$t("dateField.yesterday")}}</Button>
    <Button @click="setDay(7)" :type="selectedDay==7?'primary':'text'">{{$t("dateField.dsay7")}}</Button>
    <Button @click="setDay(14)" v-if="isShow" :type="selectedDay==14?'primary':'text'">{{$t("dateField.dsay14")}}</Button>
    <Button @click="setDay(30)" :type="selectedDay==30?'primary':'text'">{{$t("dateField.dsay30")}}</Button>
  </div>
</template>
<script>
  export default {
    props:["value","intShow"],
    components: {},
    data() {
      return {
        selectedDay: this.value||7,
        isShow:true,
      }
    },
    created() {
    },
    mounted () {
        this.isShow = this.intShow
    },
    methods:{
      setDay(day) {
        this.selectedDay = day;
        this.$emit('changed',this.selectedDay);
        this.$emit('input', this.selectedDay)
      }
    }

  }

</script>
<style scoped>
  .iqis-rds-text-btn button{
    box-shadow:none !important;
  }
  .iqis-rds-text-btn .ivu-btn-primary{
    color: #418FEE !important;
    background-color: #fff !important;
    border-color: #fff !important;
  }
  .iqis-rds-text-btn .ivu-btn-text{
  }
</style>
