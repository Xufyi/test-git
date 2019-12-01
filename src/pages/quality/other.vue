<template>
<div class="iqis-page">
    <div class="iqis-page-block" style="margin-bottom:80px;">
        <div class="iqis-page-block-title">{{$t('quality.qjSampling')}}</div>
        <div class="iqis-page-block-body" style="padding-top:15px;">{{$t('quality.qjExplain')}}</div>
    </div>
    <div class="iqis-page-block">
        <div class="iqis-page-block-title">{{$t('quality.bfbSampling')}}</div>
        <div class="iqis-page-block-body" style="padding-top:15px;">
            <Row>
                <i-col class="samplingInput" span="3" style="width:10%" v-for="(item,index) in samplingValue" :key="index">
                    <Input :disabled="!permsBtn.INSERT_PERCRNT_PLAN" v-model="samplingValue[index]" @on-blur="checkSampling(samplingValue[index],index)"></Input>
                </i-col>
                <i-col span="3" style="width:10%">
                    <Button v-if="permsBtn.INSERT_PERCRNT_PLAN" style="width:100%;border-radius: 0px;border-left:1px solid #418FEE!important" type="primary" icon="plus" @click="addSampling">{{$t('quality.add')}}</Button>
                </i-col>
            </Row>
        </div>
    </div>
    <IqisAffix placement="bottom" :offset="0">
      <div v-if="permsBtn.INSERT_PERCRNT_PLAN" class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="saveSampling">{{$t('quality.save')}}</Button>
      </div>
    </IqisAffix>
</div>
</template>
<script>
import Input from "iview/src/components/input";
import $ from 'jquery'

export default {
    components: {
      Input
    },
    data(){
        return{
            headers: {"headers": {"Content-Type": "application/json; charset=UTF-8"}},
            percentId:null,
            samplingValue:[],
            permsCur:[
                'INSERT_PERCRNT_PLAN',
            ],
            permsBtn:{
                "INSERT_PERCRNT_PLAN":false,
            },
        }
    },
    created(){
        this.refreshData()
        let permsAll = this.$store.state.permissions; 
        this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
        
    },
    methods:{
        refreshData(){
            let that = this;
            that.$http.get('/basic/perent').then((res)=>{
                if(res.data){
                    that.samplingValue=res.data.samplingValue.split(',')
                    that.percentId=res.data.percentId
                }
            })
        },
        addSampling(){
           let that = this;
           that.samplingValue.push('') 
        },
        checkSampling(item,index){
            let that = this;
            if(item&&(isNaN(item)||item>100||item<0.0001)){//验证数字和范围
                that.$Notice.warning({title:i18n.t('quality.num100')})
                return true;
            }
            for(var i=0;i<that.samplingValue.length;i++){
                if(item&&item===that.samplingValue[i]&&i!=index){//去重
                    that.samplingValue[index]=''
                    that.$Notice.warning({title:i18n.t('quality.numRepeat')})
                    return true;
                }
            }
        },
        saveSampling(){
            let that = this;
            
            let samplingValueCopy = []
            for(var i in that.samplingValue){
                if(that.checkSampling(that.samplingValue[i],i)){
                    return;
                }
                if(that.samplingValue[i]){//去空
                    samplingValueCopy.push(that.samplingValue[i])
                }
            }
            that.samplingValue=samplingValueCopy
            for(var i=0;i<that.samplingValue.length-1;i++){
                for(var j=0;j<that.samplingValue.length-i-1;j++){
                    if(Number(that.samplingValue[j])>Number(that.samplingValue[j+1])){
                        var x = that.samplingValue[j]
                        that.samplingValue[j]=that.samplingValue[j+1]
                           that.samplingValue[j+1]=x
                    }
                }
            }
            let data = {
                samplingValue:that.samplingValue.join(','),
                percentId:that.percentId
            }
            that.$http.post('/basic/perent',data,that.headers).then((res)=>{
                that.$Message.success(i18n.t('quality.saveSuccess'))
                that.refreshData()
            })
        }
    }
}
</script>
<style>
.samplingInput .ivu-input{
    width:100%;
    border-right:0;
    border-top:0;
    border-radius: 0;
}
.samplingInput .ivu-input:hover,.samplingInput .ivu-input:focus{
    border-color:#dddee1;
    box-shadow: 0.5px 0 0 2px rgba(45,140,240,.2)
}
.samplingInput:nth-child(-n+10) .ivu-input{
    border-top:1px solid #dddee1;
}
.samplingInput:nth-child(10n) .ivu-input{
    border-right:1px solid #dddee1;
}
</style>
