<template>
    <div class="iqis-page">
        <div class="iqis-page-block-title">{{$t("pqc.basicInformation")}}</div>
        <Row type="flex" :gutter="25">
            <!-- 模板编号 -->
            <i-col span="6">
                <div class="iqis-page-block-label">{{$t('pqc.templateID')}}</div>
                <div class="iqis-page-block-ctrl">
                <i-input style="width: 100%;" :placeholder="i18n.t('pqc.pe')" v-model="templateNumber"></i-input>
                </div>
            </i-col>
            <!-- 模板名称 -->
            <i-col span="6">
                <div class="iqis-page-block-label">{{$t("pqc.templateName")}}</div>
                <div class="iqis-page-block-ctrl">
                <i-input style="width: 100%;" :placeholder="i18n.t('pqc.pe')" v-model="templateName"></i-input>
                </div>
            </i-col>
            <!-- 备注 -->
            <i-col span="6">  
                <div class="iqis-page-block-label">{{$t('pqc.remarks')}}</div>
                <div class="iqis-page-block-ctrl">
                <i-input style="width: 100%;" :placeholder="i18n.t('pqc.pe')" v-model="remarks"></i-input>
                </div>
            </i-col>
            <i-col span="6">  
                <div class="iqis-page-block-label">{{$t('pqc.sn')}}</div>
                <div class="iqis-page-block-ctrl">
                <i-input @on-change="onBlueInput" style="width: 100%;" :placeholder="i18n.t('pqc.pe')" v-model="sampleQuantity"></i-input>
                </div>
            </i-col>
            <i-col span="24">  
                <div class="iqis-page-block-label">{{$t('pqc.SetInspectionPeriod')}}</div>
                <div class="iqis-page-block-ctrl">
                    <div v-for="(item,index) in timeIntervalArray" :key="index" class="timeIntervalItem" style="display:inline-block;width:120px;position:relative;">
                        <TimePicker format="HH:mm" type="timerange" placement="top-end" v-model="timeIntervalArray[index]" :transfer="true" :clearable="false"></TimePicker>
                        <Button @click="timeIntervalArray.splice(index,1)" type="text" size="small" icon="close" style="position:absolute;right:3px;top:4px;font-size:12px;color:#ccc"></Button>
                    </div>
                    <Button type="primary" :disabled="timeIntervalArray.length >= 6 ? true : false" @click="timeIntervalArray.push(['',''])">添加</Button>
                </div>
            </i-col>
        </Row>

        <div class="iqis-page-block-title">
            <div class="iqis-page-block-tools">
                <div class="iqis-page-block-tools-primary" style="line-height:35px;">{{$t('pqc.EditTemplate')}}</div>
                <div class="iqis-page-block-tools-second">
                <Poptip confirm
                :title="i18n.t('pqc.dsi')"
                :ok-text='i18n.t("pqc.confirm")'
                :cancel-text='i18n.t("pqc.cancel")'
                placement="bottom-end"
                @on-ok="deleteTableSelected">
                <Button type="ghost" icon="trash-a">{{$t("pqc.delete")}}</Button>
                </Poptip>
                </div>
            </div>
        </div>
        <div class="iqis-page-block-title"></div>
        <div class="iqis-page-block-table removeBorder">
          <Table :no-data-text="i18n.t('pqc.noData')"  class="noBorder noHeight location" ref="paramTable"  id='styleTable' border stripe 
                 v-drag-table-column="table.columns" :columns="table.columns" :data="data">
                 <Button class="iqis-table-footer-btn" @click="add" slot="footer" type="ghost" style="width:100%;margin: 16px;" icon="plus"></Button>
          </Table>
          <!-- <Table class="tableCustom"  ref="pageTable" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" :loading="table.loading"
           @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table> -->
        </div>

        <IqisAffix placement="bottom" :offset="0">
            <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
                <Button type="primary" @click="save" >{{$t("pqc.save")}}</Button>
                <Button type="ghost" @click="closePage">{{$t("pqc.cancel")}}</Button>
            </div>
        </IqisAffix>
        <div class="page-end" style="padding-bottom: 40px;padding-top: 30px;"></div>


    </div>
</template>
<script>
  import draggable from 'vuedraggable';
  import $ from "jquery"

   export default {
       props: ["params", "tabKey"],
       data() {
           return{
                i18n:window.i18n,
                templateName:"",//模板名稱
                templateNumber:"",//模板編號
                remarks:"",//備注
                sampleQuantity:"",
                timeIntervalArray:[],
                btnState: "post",
                templateId:"",
                headers: {
                    headers: { "Content-Type": "application/json; charset=UTF-8" }
                },
                unitNameList:[],
                resultList: [//	检验结果类型的下拉列表
                    /* { value: 0, label: "OK/NG" },
                    { value: 1, label: "是/否" },
                    { value: 2, label: "有/无" },
                    { value: 3, label: "录入" } */
                    { value: 0, label: "OK/NG" },
                    { value: 1, label: i18n.t("pqc.y_n") },
                    { value: 2, label: i18n.t("pqc.y_n") },
                    { value: 3, label: i18n.t("pqc.theInput") }
                ],
                data:[],
                table:{
                  columns:[
                        {
                            type:"selection",
                            width:40,
                            minWidth:40,
                            maxWidth:40,
                            align: 'center',
                            
                        },
                        {
                            // title: "序号",
                            title: i18n.t('pqc.no'),
                            key:"no",
                            minWidth: 50,
                            maxWidth: 50,
                            
                            
                            render: this.$iqis.utils.tableHelper.buildIndexColumnRender(this),
                        },
                        {
                            // title: "项目",
                            title: i18n.t('pqc.project'),
                            key:"item",
                            minWidth: 200,
                            width:200,
                            
                            
                            render: (h, params) => {
                                return h("div", [
                                    h("Input", {
                                        props: {
                                            type: "textarea",
                                            value:this.data[params.index].item,
                                            autosize:{
                                                // minRows:1,
                                                maxRows:4
                                            },
                                            rows:4,
                                            maxlength:600,
                                        },
                                        style: {  
                                            borderTop:"hidden"
                                        },  
                                        on: {
                                            "on-blur": event => {
                                                this.data[params.index].item =event.target.value;
                                            }
                                        }
                                    })
                                ]);
                            }
                        },
                        // {
                        //     title: i18n.t('pqc.Subproject'),
                        //     key:"subItem",
                        //     minWidth: 200,
                        //     width:200,
                            
                            
                        //     render: (h, params) => {
                        //         return h("div", [
                        //             h("Input", {
                        //                 props: {
                        //                     type: "textarea",
                        //                     value:this.data[params.index].subItem,
                        //                     autosize:{
                        //                         // minRows:1,
                        //                         maxRows:4
                        //                     },
                        //                     rows:4,
                        //                     maxlength:600,
                        //                 },
                        //                 on: {
                        //                     "on-blur": event => {
                        //                         this.data[params.index].subItem =event.target.value;
                        //                     }
                        //                 }
                        //             })
                        //         ]);
                        //     }
                        // },
                        {
                            // title: "检验标准",
                            title: i18n.t("pqc.InspectionStandards"),
                            key:"inspectionStandard",
                            minWidth: 350,
                            width:350,
                            render: (h, params) => {
                                return h("div", [
                                    h("Input", {
                                        props: {
                                            type: "textarea",
                                            value:this.data[params.index].inspectionStandard,
                                            autosize:{
                                                // minRows:1,
                                                maxRows:4
                                            },
                                            rows:4,
                                            maxlength:600,
                                        },
                                        on: {
                                            "on-blur": event => {
                                                this.data[params.index].inspectionStandard =event.target.value;
                                            }
                                        }
                                    })
                                ]);
                            }
                        },
                        {
                            title: i18n.t("pqc.TestResultType"),
                            key:"result",
                            minWidth:110,
                            
                            
                            render: (h, params) => {
                                return h("div", [
                                    h("Select", {
                                        props: {
                                            value:this.data[params.index].result
                                        },
                                        on: {
                                            "on-change": event => {
                                                this.data[params.index].result =event;
                                            }
                                        }
                                    },
                                    this.resultList.map(function(type) {
                                        return h(
                                        "Option",
                                        {
                                            props: { value: type.value, label: type.label }
                                        },
                                        type
                                        );
                                    })
                                  )
                                ]);
                            }
                        },
                        {
                            title: "SL",
                            key:"sl",
                            
                            minWidth:50,

                            
                            render: (h, params) => {
                                return h("div", [
                                    h("Input", {
                                        props: {
                                            type: "text",
                                            value:this.data[params.index].sl
                                        },
                                        on: {
                                            "on-blur": event => {
                                                this.data[params.index].sl =event.target.value;
                                                this.data[params.index].usl=Number(event.target.value)+Number(this.data[params.index].positiveTolerance)
                                                this.data[params.index].lsl=Number(event.target.value)-Number(this.data[params.index].negativeTolerance)
                                            }
                                        }
                                    })
                                ]);
                            }
                        },
                        {
                            title: i18n.t("product.positiveTolerance"),
                            key:"positiveTolerance",
                            
                            minWidth:50,

                            
                            render: (h, params) => {
                                return h("div", [
                                    h("Input", {
                                        props: {
                                            type: "text",
                                            value:this.data[params.index].positiveTolerance
                                        },
                                        on: {
                                            "on-blur": event => {
                                                this.data[params.index].positiveTolerance =event.target.value;
                                                this.data[params.index].usl=Number(this.data[params.index].sl)+Number(event.target.value);
                                            }
                                        }
                                    })
                                ]);
                            }
                        },
                        {
                            title: i18n.t("product.negativeTolerance"),
                            key:"negativeTolerance",
                            
                            minWidth:50,

                            
                            render: (h, params) => {
                                return h("div", [
                                    h("Input", {
                                        props: {
                                            type: "text",
                                            value:this.data[params.index].negativeTolerance
                                        },
                                        on: {
                                            "on-blur": event => {
                                                this.data[params.index].negativeTolerance =event.target.value;
                                                this.data[params.index].lsl=Number(this.data[params.index].sl)-Number(event.target.value);

                                            }
                                        }
                                    })
                                ]);
                            }
                        },
                        {
                            title: "USL",
                            key:"usl",
                            
                            minWidth:50,

                            
                            render: (h, params) => {
                                return h("div", [
                                    h("Input", {
                                        props: {
                                            type: "text",
                                            value:this.data[params.index].usl
                                        },
                                        on: {
                                            "on-blur": event => {
                                                this.data[params.index].usl =event.target.value;
                                            }
                                        }
                                    })
                                ]);
                            }
                        },
                        {
                            title: "LSL",
                            key:"lsl",
                            
                            minWidth:50,

                            
                            render: (h, params) => {
                                return h("div", [
                                    h("Input", {
                                        props: {
                                            type: "text",
                                            value:this.data[params.index].lsl
                                        },
                                        on: {
                                            "on-blur": event => {
                                                this.data[params.index].lsl =event.target.value;
                                            }
                                        }
                                    })
                                ]);
                            }
                        },
                        {
                            title: i18n.t("pqc.unit"),
                            key:"unitSymbol",
                            minWidth: 70,
                            width:70,
                            
                            
                            render: (h, params) => {
                                return h("div", [
                                    h("Select", {
                                        props: {
                                            value:this.data[params.index].unitId,
                                            placeholder:i18n.t("Unlimited")
                                        },
                                        on: {
                                            "on-change": event => {
                                                this.data[params.index].unitId =event;
                                            }
                                        }
                                    },
                                    this.unitNameList.map(function(type) {
                                        return h(
                                        "Option",
                                        {
                                            props: { value: type.measUnitId, label: type.unitSymbol }
                                        },
                                        type
                                        );
                                    })
                                  )
                                ]);
                            }
                        },
                        // {
                        //     title: i18n.t("pqc.sn"),
                        //     key:"sampleQuantity",
                        //     minWidth: 110,
                            
                            
                        //     render: (h, params) => {
                        //         return h("div", [
                        //             h("Input", {
                        //                 props: {
                        //                     type: "text",
                        //                     value:this.data[params.index].sampleQuantity
                        //                 },
                        //                 on: {
                        //                     "on-blur": event => {
                        //                         this.data[params.index].sampleQuantity =event.target.value;
                        //                     }
                        //                 }
                        //             })
                        //         ]);
                        //     }
                        // },
                        // {
                        //     // title: "设置检验时段",
                        //     title: i18n.t("pqc.SetInspectionPeriod"),
                        //     key:"timeIntervalArray",
                            
                        //     minWidth: 385,
                        //     width:385,
                        //     render: (h, params) => {
                        //         let that = this;
                        //         let value = '';
                        //         return h("div",[
                        //             params.row.timeIntervalArray.map(function(item,index,data){
                        //                 return h("div",{
                        //                     class: ['timeIntervalItem'],
                        //                     style:{
                        //                         display:"inline-block",
                        //                         width:"120px",
                        //                         position: "relative"
                        //                     }
                        //                 },[
                        //                     h("TimePicker", {
                        //                         props: {
                        //                             format: "HH:mm",
                        //                             type:"timerange",
                        //                             placement:"top-end",
                        //                             value:item,
                        //                             transfer:true,
                        //                             clearable:false
                        //                         },
                        //                         on: {
                        //                             "on-change":event=>{
                        //                                 value=event;
                        //                             },
                        //                             "on-open-change": event => {
                        //                                 if(!event&&value){
                        //                                     that.data[params.index].timeIntervalArray[index]=value
                        //                                 }
                        //                             },
                        //                         }
                        //                     }),
                        //                     h("Button",{//删除
                        //                         props:{
                        //                             type:"text",
                        //                             size:"small",
                        //                             icon:"close"
                        //                         },
                        //                         style:{
                        //                             position:"absolute",
                        //                             right:"3px",
                        //                             top:"4px",
                        //                             fontSize:"12px",
                        //                             color:"#ccc",
                        //                         },
                        //                         on:{
                        //                             "click":event=>{
                        //                                 that.data[params.index].timeIntervalArray.splice(index,1)
                        //                             }
                        //                         }
                        //                     },'')
                        //                 ])
                        //             }),
                        //             h("Button",{//添加
                        //                 props:{
                        //                     type:"text",
                        //                     size:"small"
                        //                 },
                        //                 on:{
                        //                     "click":event=>{
                        //                         that.data[params.index].timeIntervalArray.push(['',''])
                        //                     }
                        //                 }
                        //             },'+')
                                    
                        //         ]);
                        //     }
                        // },
                  ] 
               },
                discountData: {
                    rows: [{}],
                    tableData: 
                        {
                            item: "",
                            subItem: "",//子項目
                            inspectionStandard: "",//檢驗標準
                            result: "",//檢驗結果類型
                            usl: "",
                            lsl: "",
                            unitId: "",//單位
                            sampleQuantity: "",//樣本數
                            timeIntervalArray: []//時間間隔
                        }
                    
                },
           }
       },
       created() {
           this.refreshData()
       },
       watch: {
        // "sampleQuantity":function(newVal,oldVal){
        //     let that = this;
        //     if (newVal > 4) {
        //         that.$Notice.warning({title:"样本数不能大于3"})
        //         setTimeout(() => {
        //             that.sampleQuantity = 3
        //         }, 1500);
                
        //     }
        // }  
       },
       methods:{
           onBlueInput(event){
               let that = this;
               if (that.sampleQuantity > 3) {
                that.$Notice.warning({title:"样本数不能大于3"})
                setTimeout(() => {
                    that.sampleQuantity = 3
                }, 1500);
                
            }
           },
           add() {
               let obj = JSON.parse(JSON.stringify(this.discountData.tableData));
               this.data.push(obj);
               let index=this.data.length
               this.data[index-1].dataNumber=index-1
               this.$nextTick(function(){
                    $(".location .ivu-table-body").scrollTop((index-5)*43);
                    $(".location .ivu-table-tbody .ivu-table-row:last-child").addClass('ivu-table-row-hover');

                })
           },
            deleteTableSelected() {
                let that = this;
                let ss = this.$refs.paramTable.getSelection();
                for (let i = 0; i < that.data.length; i++) {
                    for (let j = 0; j < ss.length; j++) {
                        if (that.data[i].dataNumber === ss[j].dataNumber) {
                            that.data.splice(i, 1);
                        }
                    }
                }
            },
           save() {
               let that = this;
               let data = JSON.parse(JSON.stringify(that.data))
               for(let i in data){
                   let timeIntervalArray = []
                   for(let j in data[i].timeIntervalArray){
                       if(data[i].timeIntervalArray[j][0]){
                           timeIntervalArray.push(data[i].timeIntervalArray[j])
                       }
                   }
                   that.data[i].timeIntervalArray = timeIntervalArray
               }
            //    console.log(that.data)
                let params = [
                    {type:'Empty',title:i18n.t("pqc.templateID"),value:this.templateNumber},
                    {type:'Empty',title:i18n.t("pqc.templateName"),value:this.templateName},
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
                for(let i in that.data){
                    let paramsTable = [
                        {type:'Empty',title:i18n.t("pqc.TemplateLine")+ (Number(i)+Number(1)) +i18n.t("pqc.InspectionStandard"),value:that.data[i].inspectionStandard},
                        {type:'Word600',title:i18n.t("pqc.TemplateLine")+(Number(i)+Number(1))+i18n.t("pqc.InspectionStandard"),value:that.data[i].inspectionStandard},
                        {type:'Empty',title:i18n.t("pqc.TemplateLine")+(Number(i)+Number(1))+i18n.t("pqc.testResultType"),value:that.data[i].result},
                        // {type:'Empty',title:"模板第"+(Number(i)+Number(1))+"行单位",value:that.data[i].unitId},
                        {type:'Num',title:i18n.t("pqc.NumberOfSamplesInThe")+(Number(i)+Number(1))+i18n.t("pqc.lineOfTheTemplate"),value:that.data[i].sampleQuantity},
                        // {type:'EmptyLength',title:i18n.t("pqc.le")+ (Number(i)+Number(1)) +i18n.t("pqc.ofPeriod"),value:that.data[i].timeIntervalArray},
                    ]
                    let state2 = true;
                    for(let j in paramsTable){
                        state2 = that.$iqis.utils.formValidate(paramsTable[j].type,paramsTable[j].title,paramsTable[j].value,(tips)=>{
                            that.$Notice.warning({title:tips})//,duration: 0
                        })
                        if(!state2){
                            return;
                            break;
                        }
                    }
                }
                
               let url="/inspectionTemplate"
               let parmas={
                   inspectionTemplateDetailDtoList:that.data,
                   templateName:this.templateName,
                   templateNumber:this.templateNumber,
                   remarks:this.remarks,
                   sampleQuantity:this.sampleQuantity,
                   timeIntervalArray:this.timeIntervalArray,
                   templateId:this.templateId
               }
               if(this.btnState=="post") {
                   this.$http.post(url, parmas,this.headers).then(res => {
                       this.$Message.success(i18n.t("pqc.addSuccess"))
                       this.closePage()
                       this.$emit("open-tab","qc-pqc-first-update-"+res.data.templateId,i18n.t("pqc.ModifyTemplate")+"-"+res.data.templateName,"page-exam-pqc-inspectrecord-template-add",{templateId:res.data.templateId});
                   })
               }
               if(this.btnState=="put") {
                   this.$http.put(url,parmas,this.headers).then(res => {
                       this.$Message.success(i18n.t("product.editSuccess"))
                   })
               }
           },
           closePage() {
               this.$emit("close-tab",this.$props.tabKey);
           },
           getunitNameList() {//获取单位的下拉列表
               let url = "/basic/measunit"
               this.$http.get(url).then(res => {
                   this.unitNameList = res.data
                   this.unitNameList.unshift({measUnitId:null,unitSymbol:i18n.t("Unlimited")});
               })
           },
           refreshData() {
               let that = this
               that.getunitNameList()//获取单位的下拉列表
               let templateId=this.$props.params&&this.$props.params.templateId
               if(templateId){
                   that.templateId=templateId
                   this.btnState="put"
                   let url = "/inspectionTemplate/";
                   this.$http.get(url + templateId).then(res => {
                       this.templateNumber=res.data.templateNumber
                       this.templateName=res.data.templateName
                       this.remarks=res.data.remarks
                       this.sampleQuantity = res.data.sampleQuantity
                       this.timeIntervalArray = res.data.timeIntervalArray || []
                       this.data=res.data.inspectionTemplateDetailDtoList
                       for(let i in this.data){
                            this.data[i]['dataNumber']=i
                       }
                   })
               }
           },
           
      }
   }
  
</script>
<style>
.removeBorder .ivu-input {
  border: 0px solid red!important;
}
.ivu-time-picker-cells-list:nth-child(2){
    /* display: none; */
}
.ivu-time-picker-with-range .ivu-picker-panel-body{
    min-width:114px; 
}

.timeIntervalItem{
    width:120px;
    margin:0 5px 5px 0;
}
.timeIntervalItem:nth-child(-n+3){
    margin-top:5px;
}
.timeIntervalItem:nth-child(3n+1){
    margin-left:3px;
}
.timeIntervalItem .ivu-btn-small{
    padding-right:0;
}
.ivu-time-picker-header{
    display:none;
}
.ivu-time-picker-cells{
    /* min-width:56px; */
}
.timeIntervalItem .ivu-date-picker-rel input{
    background:#f5f5f5;
    padding-right:24px!important;
}
.ivu-date-picker-rel .ivu-icon{
    display: none;
}
.noHeight td{
    height:43px;
}
</style>
