<template>
  <div class="iqis-page">

    <!-- 第一部分-设备信息 -->
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t('chkdev.deviceInfo')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="40" style="margin-top:15px;">
            <i-col span="6">{{$t('chkdev.deviceCode')}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
            <i-col span="6">
                <Select :disabled="noPermsDis" v-model="editModal.chkDevId" filterable :placeholder="i18n.t('chkdev.pleaseSelect')" @on-change="changeChkDev">
                    <Option v-for="(item,index) in chkDevList" :value="item.chkDevId" :key="index" :label="item.no">{{item.no}}/{{item.name}}</Option>
                </Select>
            </i-col>
        </Row>
        <Row type="flex" :gutter="40" class="tableFormat" style="margin-top:15px;">
            <i-col span="6">{{$t('chkdev.deviceName')}}：{{chkDev.name}}</i-col>
            <i-col span="6">{{$t('chkdev.spec')}}：{{chkDev.spec}}</i-col>
            <i-col span="12">{{$t('chkdev.deviceParameters')}}：{{chkDev.param}}</i-col>
            <i-col span="6">{{$t('chkdev.type')}}：{{chkDev.chkDevTypeName}}</i-col>
            <i-col span="6">{{$t('chkdev.serialNumber')}}：{{chkDev.factoryNumber}}</i-col>
            <i-col span="12">{{$t('chkdev.label')}}：{{chkDev.factoryCard}}</i-col>
            <i-col span="6">{{$t('chkdev.department')}}：{{chkDev.departmentName}}</i-col>
            <i-col span="6">{{$t('chkdev.custodian')}}：{{chkDev.keeperUserName}}</i-col>
            <i-col span="6">{{$t('chkdev.time')}}：{{chkDev.createTime?new Date(chkDev.createTime).Format("yyyy-M-d h:m"):''}}</i-col>
            <i-col span="6">{{$t('chkdev.useState')}}：
            <span v-if="chkDev.useState==1">{{$t('chkdev.normal')}}</span>
            <span v-if="chkDev.useState==2">{{$t('chkdev.limitedUse')}}</span>
            <span v-if="chkDev.useState==3">{{$t('chkdev.notInService')}}</span>
            <span v-if="chkDev.useState==4">{{$t('chkdev.scrap')}}</span>
            <span v-if="chkDev.useState==5">{{$t('chkdev.inMmaintenance')}}</span>
            <span v-if="chkDev.useState==6">{{$t('chkdev.waitRepair')}}</span>
            </i-col>
            <i-col span="24" style="margin-bottom:0;">{{$t('chkdev.remarks')}}：{{chkDev.remark}}</i-col>
        </Row>
        <Row type="flex" :gutter="40" style="margin-top: 20px">
            <i-col span="24">{{$t('chkdev.faultDescription')}}
            </i-col>
        </Row>
        <Row type="flex" :gutter="40">
            <i-col span="24"><Input :disabled="noPermsDis" :placeholder="i18n.t('chkdev.pird')" v-model="editModal.faultDescription" type="textarea" :rows="2" style="width: 100%;"></Input>
            </i-col>
        </Row>
        <Row type="flex" :gutter="40" style="margin-top: 20px">
            <i-col span="24">{{$t('chkdev.causeAnalsis')}}
            </i-col>
        </Row>
        <Row type="flex" :gutter="40">
            <i-col span="24"><Input :disabled="noPermsDis" :placeholder="i18n.t('chkdev.pird')" v-model="editModal.causeAnalsis" type="textarea" :rows="2" style="width: 100%;"></Input>
            </i-col>
        </Row>
        <Row type="flex" :gutter="40" style="margin-top: 20px">
            <i-col span="24">{{$t('chkdev.repairRecord')}}
            </i-col>
        </Row>
        <Row type="flex" :gutter="40">
            <i-col span="24"><Input :disabled="noPermsDis" :placeholder="i18n.t('chkdev.pird')" v-model="editModal.repairRecord" type="textarea" :rows="2" style="width: 100%;"></Input>
            </i-col>
        </Row>
        <Row type="flex" :gutter="40" style="margin-top:15px;">
            <i-col span="6">{{$t('chkdev.repairNo')}}</i-col>
            <i-col span="6">{{$t('chkdev.repairResult')}}</i-col>
            <i-col span="6">{{$t('chkdev.repairTime')}}</i-col>
            <i-col span="6">{{$t('chkdev.repairMan')}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
            <i-col span="6">
                <i-input :disabled="noPermsDis" v-model="editModal.repairNo" style="width: 100%;"></i-input>
            </i-col>
            <i-col span="6">
                <Select :disabled="noPermsDis" v-model="editModal.repairResult" filterable :placeholder="i18n.t('chkdev.pleaseSelect')">
                    <Option v-for="(item,index) in repairResultList" :value="item.value" :key="index">{{item.label}}</Option>
                </Select>
            </i-col>
            <i-col span="6">
                <DatePicker :clearable="false" :disabled="noPermsDis" v-model="editModal.repairTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </i-col>
            <i-col span="6">
                <Select :disabled="noPermsDis" v-model="editModal.repairUserId" filterable :placeholder="i18n.t('chkdev.pleaseSelect')">
                    <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{item.name}}</Option>
                </Select>
            </i-col>
        </Row>
      </div>
    </div>
    <div class="page-end" style="padding-bottom: 65px"></div>

    <IqisAffix placement="bottom" :offset="0">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" @click="save" v-if="!noPermsDis">{{$t('iqc.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('iqc.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!-- <Spin size="large" fix v-if="loadStat.complaintDataLoading || loadStat.selectsDataLoading"></Spin> -->
  </div>

</template>

<script>
import $ from 'jquery'
export default {
    props:["params","tabKey"],
    data(){
        let vm = this;
        return{
        editModal:{
            "causeAnalsis": null,
            "chkDevId": null,
            "chkDevName": null,
            "chkDevNo": null,
            "chkDevSpec": null,
            "faultDescription": null,
            "repairNo": null,
            "repairRecord": null,
            "repairRecordId": null,
            "repairResult": null,
            "repairTime": new Date(),
            "repairUserId": null,
            "repairUserName": null,
            "tenantId": null
        },
        chkDev:{
            name:null,
            no:null,
            spec:null,
            param:null,
            chkDevTypeName:null,
            factoryNumber:null,
            factoryCard:null,
            departmentName:null,
            keeperUserName:null,
            createTime:null,
            useState:null,
            remark:null,
        },
        repairRecordId:null,
        userList:[],
        chkDevList:[],
        repairResultList:[
            {label:i18n.t('chkdev.qualified'),value:0},
            {label:i18n.t('chkdev.scrap'),value:1},
        ],
        i18n:window.i18n,
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        permsCur:[
            "SELECT_REPAIRRECORD",
            "UPDATE_REPAIRRECORD",
            "DELETE_REPAIRRECORD",
            "INSERT_REPAIRRECORD",
        ],
        permsBtn:{
            "DELETE_REPAIRRECORD":false,
            "SELECT_REPAIRRECORD":false,
            "UPDATE_REPAIRRECORD":false,
            "INSERT_REPAIRRECORD":false,
        },
        noPermsDis:false,
        }
    },

    created(){
        let permsAll = this.$store.state.permissions; 
        this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
        this.refreshData();
    },
    methods:{
        refreshData(){
            let that = this;
            that.repairRecordId = that.$props.params && that.$props.params.repairRecordId;
            that.$http.all([
                that.$http.get('/basic/chkdev',{params:{limit:999999}}),
                that.$http.get("/tenant/user",{params:{limit:99999999}})
            ]).then((resps)=>{
                that.chkDevList = resps[0].data
                that.userList = resps[1].data
                if(that.repairRecordId){
                    that.$http.get('/basic/repairRecord/'+that.repairRecordId).then((res)=>{
                        that.editModal = res.data
                        that.editModal.repairTime = new Date(that.editModal.repairTime)
                    })
                }else{
                    that.editModal.repairUserId=that.$store.state.currentUserId
                }
                if(((!that.repairRecordId&&that.permsBtn.INSERT_REPAIRRECORD)||(that.repairRecordId&&that.permsBtn.UPDATE_REPAIRRECORD))){
                    that.noPermsDis=false;
                }else{
                    that.noPermsDis=true;
                }
            })
        },
        changeChkDev(){
            let that = this;
            that.$http.get('/basic/chkdev/'+that.editModal.chkDevId).then((res)=>{
                that.chkDev = res.data
            })
        },
        save(){
            let that = this;
            let params = [
                {type:'Empty',title:i18n.t('chkdev.deviceCode'),value:that.editModal.chkDevId},
                {type:'Empty',title:i18n.t('chkdev.repairNo'),value:that.editModal.repairNo},
                {type:'No',title:i18n.t('chkdev.repairNo'),value:that.editModal.repairNo},
                {type:'Word600',title:i18n.t('chkdev.faultDescription'),value:that.editModal.faultDescription},
                {type:'Word600',title:i18n.t('chkdev.causeAnalsis'),value:that.editModal.causeAnalsis},
                {type:'Word600',title:i18n.t('chkdev.repairRecord'),value:that.editModal.repairRecord},
                {type:'Empty',title:i18n.t('chkdev.repairResult'),value:that.editModal.repairResult},
                {type:'Empty',title:i18n.t('chkdev.repairTime'),value:that.editModal.repairTime},
                {type:'Empty',title:i18n.t('chkdev.repairMan'),value:that.editModal.repairUserId},
            ]
            let state = true;
            for(let i in params){
                state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
                    that.$Notice.warning({title:tips})//,duration: 0
                })
                if(!state){
                    return;
                    break;
                }
            }
            that.editModal.repairTime = that.editModal.repairTime.getTime()
            if(!that.repairRecordId){
                that.$http.post('/basic/repairRecord',that.editModal,that.headers).then((res)=>{
                    that.editModal.repairTime = new Date(that.editModal.repairTime)
                    that.$Message.success(i18n.t('iqc.saveSuccess'));
                    that.closePage()
                    that.$emit("open-tab","device-manage-repair-add-"+res.data.repairRecordId,i18n.t('chkdev.editRepairRecord')+"-"+res.data.chkDevName,"page-device-manage-repair-add",{repairRecordId:res.data.repairRecordId});
                }).catch((err)=>{
                    that.editModal.repairTime = new Date(that.editModal.repairTime)
                })
            }else{
                that.$http.put('/basic/repairRecord',that.editModal,that.headers).then((res)=>{
                    that.editModal.repairTime = new Date(that.editModal.repairTime)
                    that.$Message.success(i18n.t('iqc.saveSuccess'));
                }).catch((err)=>{
                    that.editModal.repairTime = new Date(that.editModal.repairTime)
                })
            }
        },
        closePage(){
            this.$emit("close-tab",this.$props.tabKey);
        },
    },
}
</script>
<style>
.tableFormat{
    background: rgba(247, 247, 247, 1);
    padding: 15px 0 15px 20px;
}
.tableFormat .ivu-col{
  margin-bottom:10px;
}
</style>
