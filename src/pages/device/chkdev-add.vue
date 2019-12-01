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
            <i-col span="6">{{$t('chkdev.deviceName')}}</i-col>
            <i-col span="6">{{$t('chkdev.spec')}}</i-col>
            <i-col span="6">{{$t('chkdev.deviceParameters')}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
            <i-col span="6"><Input :disabled="noPermsDis" :placeholder="i18n.t('chkdev.required')" v-model="editModal.no" style="width: 100%;"></Input></i-col>
            <i-col span="6"><i-input :disabled="noPermsDis" :placeholder="i18n.t('chkdev.required')" v-model="editModal.name" style="width: 100%;"></i-input></i-col>
            <!-- <i-col span="6"><Input :disabled="noPermsDis" placeholder="必填" v-model="editModal.spec" style="width: 100%;"></Input></i-col> -->
            <i-col span="6"><Input :disabled="noPermsDis"  v-model="editModal.spec" style="width: 100%;"></Input></i-col>
            <!-- <i-col span="6"><i-input :disabled="noPermsDis" placeholder="必填" v-model="editModal.param" style="width: 100%;"></i-input></i-col> -->
            <i-col span="6"><i-input :disabled="noPermsDis"  v-model="editModal.param" style="width: 100%;"></i-input></i-col>
        </Row>
        <Row type="flex" :gutter="40" style="margin-top: 20px">
            <i-col span="6">{{$t('chkdev.type')}}</i-col>
            <i-col span="6">{{$t('chkdev.serialNumber')}}</i-col>
            <i-col span="12">{{$t('chkdev.label')}}</i-col>
        </Row>
        <Row type="flex" :gutter="40" >
            <i-col span="6">
            <Cascader :disabled="noPermsDis" :transfer="false"  v-model="editModal.chkDevTypeValue" :data="category[0].children"
                                    :render-format = "loadTypeRender"
                                    change-on-select :clearable="false" style="width: 100%"></Cascader>
            </i-col>
            <i-col span="6"><Input :disabled="noPermsDis" v-model="editModal.factoryNumber" style="width: 100%;"></Input></i-col>
            <i-col span="12"><i-input :disabled="noPermsDis" v-model="editModal.factoryCard" style="width: 100%;"></i-input></i-col>
        </Row>
        <Row type="flex" :gutter="40" style="margin-top: 20px">
            <i-col span="6">{{$t('chkdev.department')}}</i-col>
            <i-col span="6">{{$t('chkdev.custodian')}}</i-col>
            <i-col span="6">{{$t('chkdev.time')}}</i-col>
            <i-col span="6">{{$t('chkdev.useState')}}</i-col>
        </Row>
        <Row type="flex" :gutter="40" >
            <i-col span="6">
            <Select :disabled="noPermsDis" v-model="editModal.departmentId" filterable :placeholder="i18n.t('chkdev.pleaseSelect')" @on-change="changeDepartment(editModal.departmentId)">
                <Option v-for="item in departmentList" :value="item.departmentId" :key="item.departmentId">{{ item.departmentName }}</Option>
            </Select>
            </i-col>
            <i-col span="6">
            <Select :disabled="noPermsDis" v-model="editModal.keeperUserId" filterable :placeholder="i18n.t('chkdev.pleaseSelect')">
                <Option v-for="item in userList" :value="item.userId" :key="item.userId">{{ item.name }}</Option>
            </Select>
            </i-col>
            <i-col span="6">
                <DatePicker :clearable="false" :disabled="noPermsDis" v-model="editModal.createTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </i-col>
            <i-col span="6">
            <Select :disabled="noPermsDis" v-model="editModal.useState" filterable :placeholder="i18n.t('quality.ps')">
                <Option :value="1">{{$t('chkdev.normal')}}</Option>
                <Option :value="2">{{$t('chkdev.limitedUse')}}</Option>
                <Option :value="3">{{$t('chkdev.notInService')}}</Option>
                <Option :value="4">{{$t('chkdev.scrapped')}}</Option>
                <Option :value="5">{{$t('chkdev.inMmaintenance')}}</Option>
                <Option :value="6">{{$t('chkdev.waitRepair')}}</Option>
                <Option :value="7">{{$t('chkdev.stop')}}</Option>
            </Select>
            </i-col>
        </Row>
        <Row type="flex" :gutter="40" style="margin-top: 20px">
            <i-col span="24">{{$t('chkdev.remarks')}}
            </i-col>
        </Row>
        <Row type="flex" :gutter="40">
            <i-col span="24"><Input :disabled="noPermsDis" :placeholder="i18n.t('chkdev.pird')" v-model="editModal.remark" type="textarea" :rows="2" style="width: 100%;"></Input>
            </i-col>
        </Row>
      </div>
    </div>
    <!-- 第二部分-校准设置 -->
    <div class="iqis-page-block" style="margin-top: 20px">
      <div class="iqis-page-block-title">
        {{$t('chkdev.setCali')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="40" style="margin-top:15px;">
            <i-col span="6">{{$t('chkdev.caliState')}}</i-col>
            <i-col span="6">{{$t('chkdev.caliMethod')}}</i-col>
            <i-col span="6">{{$t('chkdev.caliPeriod')}}</i-col>
            <i-col span="6">{{$t('chkdev.nextCaliTime')}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
            <i-col span="6">
                <Select class="hide" disabled v-model="editModal.chkCalibration.calibrationState" filterable :placeholder="i18n.t('chkdev.pleaseSelect')">
                    <Option v-for="(item,index) in calibrationStateList" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
            </i-col>
            <i-col span="6">
                <Select :disabled="noPermsDis" v-model="editModal.chkCalibration.calibrationMethod" filterable :placeholder="i18n.t('chkdev.pleaseSelect')">
                    <Option v-for="(item,index) in calibrationMethodList" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
            </i-col>
            <i-col span="6">
                <Select :disabled="noPermsDis" @on-change="changePeriod('cal')" v-model="editModal.chkCalibration.calibrationPeriod" filterable :placeholder="i18n.t('chkdev.pleaseSelect')">
                    <Option v-for="(item,index) in calibrationPeriodList" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
            </i-col>
            <i-col span="6">
                <DatePicker :clearable="false" :disabled="noPermsDis" v-model="editModal.chkCalibration.calibrationNextTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </i-col>
        </Row>
      </div>
    </div>
    <!-- 第三部分-保养设置 -->
    <div class="iqis-page-block" style="margin-top: 20px">
      <div class="iqis-page-block-title">
        {{$t('chkdev.setMaint')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="40" style="margin-top:15px;">
            <i-col span="6">{{$t('chkdev.maintState')}}</i-col>
            <i-col span="6">{{$t('chkdev.maintPeriod')}}</i-col>
            <i-col span="6">{{$t('chkdev.nextMaintTime')}}</i-col>
        </Row>
        <Row type="flex" :gutter="40">
            <i-col span="6">
                <Select class="hide" disabled v-model="editModal.chkMaintain.maintainState" filterable :placeholder="i18n.t('chkdev.pleaseSelect')">
                    <Option v-for="(item,index) in maintainStateList" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
            </i-col>
            <i-col span="6">
                <Select :disabled="noPermsDis" @on-change="changePeriod('main')" v-model="editModal.chkMaintain.maintainPeriod" filterable :placeholder="i18n.t('chkdev.pleaseSelect')">
                    <Option v-for="(item,index) in maintainPeriodList" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
            </i-col>
            <i-col span="6">
                <DatePicker :clearable="false" :disabled="noPermsDis" v-model="editModal.chkMaintain.maintainNextTime" type="datetime" format="yyyy-MM-dd HH:mm"  style="width:100%"></DatePicker>
            </i-col>
        </Row>
      </div>
    </div>
    <!-- 第三部分-自动采集设置 -->
    <div class="iqis-page-block" style="margin-top: 20px">
      <div class="iqis-page-block-title">
        {{$t('chkdev.setCollect')}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="40" style="margin-top:15px;">
            <i-col>
                {{$t('chkdev.chkDevExport')}} <InputNumber :disabled="noPermsDis" v-model="editModal.chkAutoCollect.number"></InputNumber> {{$t('chkdev.data')}}{{$t('chkdev.everyDataSplit')}}
                <Select style="width:100px;" :disabled="noPermsDis" v-model="editModal.chkAutoCollect.separatorField" filterable :placeholder="i18n.t('chkdev.pleaseSelect')">
                    <Option value=","></Option>
                    <Option value="\"></Option>
                    <Option value="/"></Option>
                    <Option value="-"></Option>
                </Select>
            </i-col>
        </Row>
        <Row v-for="(item,index) in editModal.chkAutoCollect.unitIdArr" :key="index">
            <i-col style="margin-top:15px;">
                {{$t('chkdev.No')}} {{index+1}} {{$t('chkdev.dataUnit')}}
                <Select style="width:100px;" :disabled="noPermsDis" v-model="editModal.chkAutoCollect.unitIdArr[index]" filterable :placeholder="i18n.t('chkdev.pleaseSelect')">
                    <Option v-for="(item,index) in unitList" :key="index" :value="item.measUnitId">{{item.unitSymbol}}/{{item.name}}</Option>
                </Select>
            </i-col>
        </Row>
      </div>
    </div>
    <!--end blocks-->
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
            "chkDevId": null,
            "chkDevTypeId": null,
            chkDevTypeValue:[],
            "chkDevTypeName": "",
            "createTime": new Date(),
            "departmentId": null,
            "departmentName": "",
            "factoryCard": "",
            "factoryNumber": "",
            "keeperUserId": null,
            "keeperUserName": "",
            "name": "",
            "no": "",
            "param": "",
            "remark": "",
            "spec": "",
            "useState": null,
            chkCalibration:{
                calibrationState:"QUALIFIED",
                calibrationMethod:"1",
                calibrationPeriod:6,
                calibrationNextTime:null,
                isPush:0,
            },
            chkMaintain:{
                maintainState:"NORMAL",
                maintainPeriod:6,
                maintainNextTime:null,
                isPush:0,
            },
            chkAutoCollect:{
                number:null,
                separatorField:'',
                unitIdArr:[]
            }
        },
        departmentList:[],
        userList:[],
        calibrationStateList:[
            {label:i18n.t('chkdev.qualified'),value:"QUALIFIED"},
            {label:i18n.t('chkdev.calibrated'),value:"CALIBRATED"},
            {label:i18n.t('chkdev.overdue'),value:"OVERDUE"},
            {label:i18n.t('chkdev.notInService'),value:"PAUSE"},
            {label:i18n.t('chkdev.limitedUse'),value:"LIMIT"},
            {label:i18n.t('chkdev.stop'),value:"STOP"},
        ],
        calibrationMethodList:[
            {label:i18n.t('chkdev.within'),value:"1"},
            {label:i18n.t('chkdev.outside'),value:"0"}
        ],
        calibrationPeriodList:[
            {label:"1"+i18n.t('chkdev.month'),value:1},
            {label:"3"+i18n.t('chkdev.month'),value:3},
            {label:"6"+i18n.t('chkdev.month'),value:6},
            {label:"12"+i18n.t('chkdev.month'),value:12}
        ],
        maintainStateList:[
            {label:"正常",value:"NORMAL"},
            {label:"即将保养",value:"MAINTAINED"},
            {label:"过期",value:"OVERDUE"},
            {label:"需维修",value:"REPAIR"},
        ],
        maintainPeriodList:[
            {label:"1"+i18n.t('chkdev.month'),value:1},
            {label:"3"+i18n.t('chkdev.month'),value:3},
            {label:"6"+i18n.t('chkdev.month'),value:6},
            {label:"12"+i18n.t('chkdev.month'),value:12}
        ],
        unitList:[],
        category:[{
            title: '组织架构树',
            loading: false,
            children: []
        }],
        i18n:window.i18n,
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        permsCur:[
            "INSERT_CHKDEV",
            "UPDATE_CHKDEV",
        ],
        permsBtn:{
            "UPDATE_CHKDEV":false,
            "INSERT_CHKDEV":false,
        },
        noPermsDis:false,
        chkDevId:null,
        changePeriodFlag:0,
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
            that.chkDevId = that.$props.params && that.$props.params.chkDevId;
            that.$http.all([
                this.$http.get("/systemManage/department",{params:{limit:99999999}}),
                this.$http.get("/tenant/user",{params:{limit:99999999}}),
                that.$http.get("/basic/chkdevtype",{params:{limit:99999999}}),
                that.$http.get("/basic/measunit",{params:{limit:99999999}})
            ]).then(function(resps){
                that.departmentList = resps[0].data;
                that.userList = resps[1].data;
                let root = {title:i18n.t('chkdev.chkca'),selected: false,label:i18n.t('chkdev.chkca'),value:0,expand:true};
                that.$iqis.utils.treeify(resps[2].data,root,"chkDevTypeId","chkDevTypeName","parentId");
                that.category = [root];
                that.unitList = resps[3].data

                if(!that.chkDevId){//添加
                    that.changePeriodFlag = 2;
                    that.changePeriod('cal') 
                    that.changePeriod('main') 
                }else{
                    that.$http.get('/basic/chkdev/'+that.chkDevId).then((res)=>{
                        if(!res.data.chkCalibration){
                            res.data.chkCalibration={
                                calibrationState:'QUALIFIED',
                                calibrationMethod:null,
                                calibrationPeriod:null,
                                calibrationNextTime:null,
                                isPush:0,
                            }
                        }
                        if(!res.data.chkMaintain){
                            res.data.chkMaintain={
                                maintainState:'NORMAL',
                                maintainPeriod:null,
                                maintainNextTime:null,
                                isPush:0,
                            }
                        }
                        if(!res.data.chkAutoCollect){
                            res.data.chkAutoCollect={
                                number:0,
                                separatorField:'',
                                unitIdArr:[],
                            }
                        }
                        that.editModal = res.data
                        that.newDate()
                        let result = that.$iqis.utils.findPathInTree(that.category[0],[],that.editModal.chkDevTypeId,"chkDevTypeId");
                        result = result || [];
                        that.editModal.chkDevTypeValue = result;
                    })
                }
                if(((!that.chkDevId&&that.permsBtn.INSERT_CHKDEV)||(that.chkDevId&&that.permsBtn.UPDATE_CHKDEV))){
                    that.noPermsDis=false;
                }else{
                    that.noPermsDis=true;
                }
            })
        },
        loadTypeRender(label){
            //render-format
            if(!label || label.length == 0){
            return '-';
            }
            let result = label[label.length-1];

            if( (this.category.length > 0  && result == this.category[0].label)){
            return '-'
            }

            return result;
        },
        changeDepartment(val){
            let that=this;
            if(!val){return;}
            this.$http.get("/tenant/userlist/"+val+"?limit=999999").then(function (resp) {
                that.userList=resp.data;
            })
        },
        changePeriod(type){
            if(this.changePeriodFlag<2){
                this.changePeriodFlag++;
                return;
            }
            let period = type=='cal'?this.editModal.chkCalibration.calibrationPeriod:this.editModal.chkMaintain.maintainPeriod
            if(!period){return}
            let newDate = new Date(this.editModal.createTime.getTime())//必须如此写，否则时间会叠加
            let nextTime = new Date(newDate.setMonth(newDate.getMonth()+period))
            if(type=='cal'){
                this.editModal.chkCalibration.calibrationNextTime = nextTime
            }else{
                this.editModal.chkMaintain.maintainNextTime = nextTime
            }
        },
        newDate(){
            let that = this;
            that.editModal.createTime=that.editModal.createTime?new Date(that.editModal.createTime):null
            that.editModal.chkCalibration.calibrationNextTime=that.editModal.chkCalibration.calibrationNextTime?new Date(that.editModal.chkCalibration.calibrationNextTime):null
            that.editModal.chkMaintain.maintainNextTime=that.editModal.chkMaintain.maintainNextTime?new Date(that.editModal.chkMaintain.maintainNextTime):null
        },
        save(){
            let that = this;
            this.editModal.chkDevTypeId = null;
            if(this.editModal.chkDevTypeValue && this.editModal.chkDevTypeValue.length > 0){
            let plt = this.editModal.chkDevTypeValue[this.editModal.chkDevTypeValue.length-1];
            if(plt){
                this.editModal.chkDevTypeId = plt;
            }
            }
            let params = [
                {type:'Empty',title:i18n.t('chkdev.deviceCode'),value:that.editModal.no},
                {type:'No',title:i18n.t('chkdev.deviceCode'),value:that.editModal.no},
                {type:'Empty',title:i18n.t('chkdev.deviceName'),value:that.editModal.name},
                {type:'Name',title:i18n.t('chkdev.deviceName'),value:that.editModal.name},
                // {type:'Empty',title:'规格型号',value:that.editModal.spec},
                {type:'Word600',title:i18n.t('chkdev.spec'),value:that.editModal.spec},
                // {type:'Empty',title:'设备参数',value:that.editModal.param},
                {type:'No',title:i18n.t('chkdev.deviceParameters'),value:that.editModal.param},
                {type:'Empty',title:i18n.t('chkdev.type'),value:that.editModal.chkDevTypeId},
                {type:'Word20',title:i18n.t('chkdev.serialNumber'),value:that.editModal.factoryNumber},
                {type:'Word20',title:i18n.t('chkdev.label'),value:that.editModal.factoryCard},
                {type:'Empty',title:i18n.t('chkdev.time'),value:that.editModal.createTime},
                {type:'Empty',title:i18n.t('chkdev.useState'),value:that.editModal.useState},
                {type:'Word600',title:i18n.t('chkdev.remarks'),value:that.editModal.remark},
                {type:'Empty',title:i18n.t('chkdev.caliState'),value:that.editModal.chkCalibration.calibrationState},
                {type:'Empty',title:i18n.t('chkdev.caliMethod'),value:that.editModal.chkCalibration.calibrationMethod},
                {type:'Empty',title:i18n.t('chkdev.caliPeriod'),value:that.editModal.chkCalibration.calibrationPeriod},
                // {type:'Empty',title:i18n.t('chkdev.nextCaliTime'),value:that.editModal.chkCalibration.calibrationNextTime},
                {type:'Empty',title:i18n.t('chkdev.maintState'),value:that.editModal.chkMaintain.maintainState},
                {type:'Empty',title:i18n.t('chkdev.maintPeriod'),value:that.editModal.chkMaintain.maintainPeriod},
                // {type:'Empty',title:i18n.t('chkdev.nextMaintTime'),value:that.editModal.chkMaintain.maintainNextTime},
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
            that.editModal.createTime=that.editModal.createTime.getTime()
            that.editModal.chkCalibration.calibrationNextTime=that.editModal.chkCalibration.calibrationNextTime.getTime()
            that.editModal.chkMaintain.maintainNextTime=that.editModal.chkMaintain.maintainNextTime.getTime()
            if(!that.chkDevId){
                that.$http.post("/basic/chkdev",that.editModal,that.headers).then(function (resp) {
                    that.$Message.success(i18n.t('iqc.saveSuccess'));
                    that.closePage();
                    that.chkDevId=resp.data.chkDevId;
                    that.$emit("open-tab","device-manage-chkdev-add-"+that.chkDevId,i18n.t('chkdev.modifyDevice')+"-"+that.editModal.name,"page-device-manage-chkdev-add",{chkDevId:that.chkDevId});

                }).catch((error)=>{
                    that.newDate()
                })
            }else{
                that.$http.put("/basic/chkdev",that.editModal,that.headers).then(function (resp) {
                    that.$Message.success(i18n.t('iqc.saveSuccess'));
                    that.refreshData()
                }).catch((error)=>{
                    that.newDate()
                })
            }

        },
        closePage(){
        this.$emit("close-tab",this.$props.tabKey);
        },
    },
    watch:{
        "editModal.chkAutoCollect.number":function(num){
            this.editModal.chkAutoCollect.unitIdArr.length = num
        }
    }
}
</script>
<style>
.hide .ivu-select-arrow{
    display: none;
}
</style>
