<template>
    <div>
        <div>
            <div>
                <div class="iqis-page-block-title">{{$t('statistical.basicInformation')}}</div>
            </div>
            <div>
                <Row type="flex" :gutter="24">
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.standardNumber')}}</div>
                        <i-input  :disabled="noPermsDis" style="width: 100%;" v-model="ruleForm.no"></i-input>
                    </i-col>
                    <i-col span="6">
                        <div class="iqis-page-block-label">{{$t('statistical.standardName')}}</div>
                        <i-input  :disabled="noPermsDis" style="width: 100%;" v-model="ruleForm.name"></i-input>
                    </i-col>
                </Row>
                <Row type="flex" :gutter="24">
                    <i-col span="24">
                        <div class="iqis-page-block-label">{{$t('statistical.remarks')}}</div>
                        <i-input  :disabled="noPermsDis" style="width: 100%;" v-model="ruleForm.remarks"></i-input>
                    </i-col>
                </Row>
            </div>
        </div>
        <div style="margin-bottom:80px" class="score">
            <div>
                <div class="iqis-page-block">
                    <div class="iqis-page-block-title">{{$t('statistical.ScoringCriteria')}}</div>
                    <div class="iqis-page-block-body">
                        <div class="iqis-page-block-tools">
                            <div class="iqis-page-block-tools-primary">
                                <div class="iqis-page-block-label">{{$t('statistical.severity')}}</div>
                            </div>
                        </div>
                        <div class="iqis-page-block-table">
                            <table border="1" style="width:100%;border-collapse:collapse;border:1px solid #dddee1" class="padding10 padding5">
                                <tr>
                                    <th style="width:5%">{{$t('statistical.No')}}</th>
                                    <th style="width:50%">{{$t('statistical.specification')}}</th>
                                    <th style="width:30%">{{$t('statistical.Level')}}</th>
                                    <th style="width:15%">{{$t('statistical.standard')}}</th>
                                </tr>
                                <tr style="text-align:center" v-for="(item,index) in ruleForm.severityList" :key="index">
                                    <td>{{index+1}}</td>
                                    <td><Input type="textarea" :disabled="noPermsDis" :maxlength="600" :autosize="{minRows: 1,maxRows: 4}" v-model="ruleForm.severityList[index].norm"/></td>
                                    <td><Input type="textarea" :disabled="noPermsDis" :maxlength="100" :autosize="{minRows: 1,maxRows: 4}" v-model="ruleForm.severityList[index].levelDescription"/></td>
                                    <td><input maxlength="10" :disabled="noPermsDis" v-model="ruleForm.severityList[index].standard"/></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="iqis-page-block-body">
                        <div class="iqis-page-block-tools">
                            <div class="iqis-page-block-tools-primary">
                                <div class="iqis-page-block-label">{{$t('statistical.frequency')}}</div>
                            </div>
                        </div>
                        <div class="iqis-page-block-table">
                            <table border="1" style="width:100%;border-collapse:collapse;border:1px solid #dddee1" class="padding10 padding5">
                                <tr>
                                    <th style="width:5%">{{$t('statistical.No')}}</th>
                                    <th style="width:50%">{{$t('statistical.specification')}}</th>
                                    <th style="width:30%">{{$t('statistical.Level')}}</th>
                                    <th style="width:15%">{{$t('statistical.standard')}}</th>
                                </tr>
                                <tr style="text-align:center" v-for="(item,index) in ruleForm.frequencyList" :key="index">
                                    <td>{{index+1}}</td>
                                    <td><Input type="textarea" :disabled="noPermsDis" :maxlength="600" :autosize="{minRows: 1,maxRows: 4}" v-model="ruleForm.frequencyList[index].norm"/></td>
                                    <td><Input type="textarea" :disabled="noPermsDis" :maxlength="100" :autosize="{minRows: 1,maxRows: 4}" v-model="ruleForm.frequencyList[index].levelDescription"/></td>
                                    <td><input maxlength="10" :disabled="noPermsDis" v-model="ruleForm.frequencyList[index].standard"/></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="iqis-page-block-body">
                        <div class="iqis-page-block-tools">
                            <div class="iqis-page-block-tools-primary">
                                <div class="iqis-page-block-label">{{$t('statistical.degrees')}}</div>
                            </div>
                        </div>
                        <div class="iqis-page-block-table">
                        <table border="1" style="width:100%;border-collapse:collapse;border:1px solid #dddee1" class="padding10 padding5">
                            <tr>
                                <th style="width:5%">{{$t('statistical.No')}}</th>
                                <th style="width:50%">{{$t('statistical.specification')}}</th>
                                <th style="width:30%">{{$t('statistical.Level')}}</th>
                                <th style="width:15%">{{$t('statistical.standard')}}</th>
                            </tr>
                            <tr style="text-align:center" v-for="(item,index) in ruleForm.detectionList" :key="index">
                                <td>{{index+1}}</td>
                                <td><Input type="textarea" :disabled="noPermsDis" :maxlength="600" :autosize="{minRows: 1,maxRows: 4}" v-model="ruleForm.detectionList[index].norm"/></td>
                                <td><Input type="textarea" :disabled="noPermsDis" :maxlength="100" :autosize="{minRows: 1,maxRows: 4}" v-model="ruleForm.detectionList[index].levelDescription"/></td>
                                <td><input maxlength="10" :disabled="noPermsDis" v-model="ruleForm.detectionList[index].standard"/></td>
                            </tr>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <IqisAffix placement="bottom" :offset="0">
            <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
                <Button v-if="!noPermsDis" type="primary" @click="save">{{$t('iqc.save')}}</Button>
                <Button type="ghost" @click="closePage">{{$t('iqc.cancel')}}</Button>
            </div>
        </IqisAffix>
    </div>
</template>

<script>
export default {
    props:["params","tabKey"],
    data() {
        return{
            i18n:window.i18n,
            headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
            ruleForm:{
                no:"",
                name:"",
                remarks:"",
                scoringStandardId:"",
                operatorId:"",
                operatorName:"",
                createTime: new Date(),
                severityList:[
                    {norm:"",levelDescription:"",standard:1},
                    {norm:"",levelDescription:"",standard:2},
                    {norm:"",levelDescription:"",standard:3},
                    {norm:"",levelDescription:"",standard:4},
                    {norm:"",levelDescription:"",standard:5},
                    {norm:"",levelDescription:"",standard:6},
                    {norm:"",levelDescription:"",standard:7},
                    {norm:"",levelDescription:"",standard:8},
                    {norm:"",levelDescription:"",standard:9},
                    {norm:"",levelDescription:"",standard:10}
                ],
                frequencyList:[
                    {norm:"",levelDescription:"",standard:1},
                    {norm:"",levelDescription:"",standard:2},
                    {norm:"",levelDescription:"",standard:3},
                    {norm:"",levelDescription:"",standard:4},
                    {norm:"",levelDescription:"",standard:5},
                    {norm:"",levelDescription:"",standard:6},
                    {norm:"",levelDescription:"",standard:7},
                    {norm:"",levelDescription:"",standard:8},
                    {norm:"",levelDescription:"",standard:9},
                    {norm:"",levelDescription:"",standard:10}
                ],
                detectionList:[
                    {norm:"",levelDescription:"",standard:1},
                    {norm:"",levelDescription:"",standard:2},
                    {norm:"",levelDescription:"",standard:3},
                    {norm:"",levelDescription:"",standard:4},
                    {norm:"",levelDescription:"",standard:5},
                    {norm:"",levelDescription:"",standard:6},
                    {norm:"",levelDescription:"",standard:7},
                    {norm:"",levelDescription:"",standard:8},
                    {norm:"",levelDescription:"",standard:9},
                    {norm:"",levelDescription:"",standard:10}
                ],
            },
            permsCur:[
                "INSERT_FMEA_SCORING",
                "SELECT_FMEA_SCORING",
                "UPDATE_FMEA_SCORING"
            ],
            permsBtn:{
                "SELECT_FMEA_SCORING":false,
                "UPDATE_FMEA_SCORING":false,
                "INSERT_FMEA_SCORING":false,
            },
            noPermsDis:true,
        }
    },
    created() {
        let that = this
        let permsAll = this.$store.state.permissions; 
        this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
        this.$http.get('/tenant/user/profile').then(function(resp){//调当前人员的接口
          that.ruleForm.operatorId=resp.data.userId;
          that.ruleForm.operatorName=resp.data.name
          that.refreshData()
        })
    },
    methods:{
        refreshData() {
            let that = this;
            that.ruleForm.scoringStandardId = that.$props.params && that.$props.params.scoringStandardId;
            if(that.ruleForm.scoringStandardId) {
                that.$http.get('/fmea/scoring/'+that.ruleForm.scoringStandardId).then((res)=>{
                    that.ruleForm.no=res.data.no;
                    that.ruleForm.name=res.data.name;
                    that.ruleForm.remarks=res.data.remarks;
                    that.ruleForm.detectionList=res.data.detectionList;
                    that.ruleForm.frequencyList=res.data.frequencyList;
                    that.ruleForm.severityList=res.data.severityList;
                })
            }
            if(((!that.ruleForm.scoringStandardId&&that.permsBtn.INSERT_FMEA_SCORING)||(that.ruleForm.scoringStandardId&&that.permsBtn.UPDATE_FMEA_SCORING))){
                that.noPermsDis=false;
            }else{
                that.noPermsDis=true;
            }
        },
        save() {
            let that = this
            let params = [
                {type:'Empty',title:i18n.t('statistical.standardNumber'),value:this.ruleForm.no},
                {type:'Empty',title:i18n.t('statistical.standardName'),value:this.ruleForm.name},
            ]
            let state = true;
            for(let i in params){
                state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
                    that.$Notice.warning({title:tips})
                })
                if(!state){
                    return;
                    break;
                }
            }
            that.ruleForm.createTime=new Date(that.ruleForm.createTime).getTime()
            let paramsInfo=that.ruleForm
            if(that.ruleForm.scoringStandardId) {
                that.$http.put('/fmea/scoring',paramsInfo,that.headers).then((res)=>{
                    that.$Message.success(i18n.t('statistical.ats'));
                    that.closePage()
                    that.$emit("open-tab","cfmea-score-"+res.data.scoringStandardId,i18n.t('statistical.edit')+" score-"+res.data.name,"page-statistic-fmea-score-add",{scoringStandardId:res.data.scoringStandardId});
                    that.refreshData()
                })
            }else{
                that.$http.post('/fmea/scoring',paramsInfo,that.headers).then((res)=>{
                    that.$Message.success(i18n.t('statistical.as'));
                    that.closePage()
                    that.$emit("open-tab","cfmea-score-"+res.data.scoringStandardId,i18n.t('statistical.edit')+" score-"+res.data.name,"page-statistic-fmea-score-add",{scoringStandardId:res.data.scoringStandardId});
                    that.refreshData()
                })
            }
        },
        closePage() {
            this.$emit("close-tab", this.$props.tabKey);
        }
    }
}
</script>

<style>
    .padding10 th{
        padding:10px!important
    }
    .padding5 td{
        height: 40px;
    }
    .score input{
        height:90%;
        width:100%;
        border:none;
        outline:medium;
        text-align:center
    }
    .score th{
        background-color: #eee
    }
    .score .ivu-input{
        border: none;
        /* outline:none; */
    }
    .score .ivu-input:focus {
        box-shadow:none
    }

</style>