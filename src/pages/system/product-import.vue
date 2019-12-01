<template>
    <div>
      <Input v-model="data" type="textarea" autosize="true"></Input>
      <Button type="primary" @click="submit">提交</Button>
    </div>
</template>

<script>
    export default {
        name: "product-import",
        data () {
            return {
              data:'',
            }
      },
      methods:{
        submit(){
          let that = this;
          let param={
            data:that.data,
          }
          that.$http.post("/basic/product/import",param).then((res)=>{
            that.$Message.success('导入成功');
          });
        }
      }
    }

</script>

