/*
 * @Author: yaoxingpu 
 * @Date: 2019-03-11 10:38:25 
 * @Last Modified by: yaoxingpu
 * @Last Modified time: 2019-04-01 10:27:23
 */
<template>
    <!-- 质量看板添加\修改页 -->
    <div class="iqis-page" style="height:100%;">
        <div class="iqis-page-block">
            <div class="iqis-page-block-title">
                {{$t('iqc.basicInfo')}}
            </div>
        </div>
        <!-- 输入相关 -->
        <div class="iqis-page-block-body">
            <Row type="flex" :gutter="25">
                <Col span="4">
                    <div class="iqis-page-block-label">{{$t('monitor.KanbanNumber')}}</div>
                    <div class="iqis-page-block-ctrl">
                        <Input v-model="kanbanData.boardNo" :placeholder="i18n.t('monitor.pleaseEnter')"></Input>
                    </div>
                </Col>
                <Col span="4">
                    <div class="iqis-page-block-label">{{$t('monitor.nameKanban')}}</div>
                    <div class="iqis-page-block-ctrl">
                        <Input v-model="kanbanData.boardName" :placeholder="i18n.t('monitor.pleaseEnter')"></Input>
                    </div>
                </Col>
                <Col span="4">
                    <div class="iqis-page-block-label">{{$t('monitor.categoryBelongs')}}</div>
                    <div class="iqis-page-block-ctrl">
                        <Select v-model="kanbanData.boardTypeId" style="width:200px">
                            <Option v-for="item in className" :value="item.boardTypeId" :key="item.boardTypeId">{{ item.boardTypeName }}</Option>
                        </Select>
                    </div>
                </Col>
            </Row>
            <Row type="flex" :gutter="25">
                <Col span="24">
                    <div class="iqis-page-block-label">{{$t('monitor.note')}}</div>
                    <div class="iqis-page-block-ctrl">
                        <Input v-model="kanbanData.remark" :placeholder="i18n.t('monitor.pleaseEnter')"></Input>
                    </div>
                </Col>
            </Row>
        </div>

        <div class="iqis-page-block-body">
            <div class="iqis-page-block">
                <div class="iqis-page-block-title">{{$t('monitor.kanbanStyle')}}</div>
                <div class="gridcss">
                    <span class="gricss-son1" @click="kanbanFun('container1',1)">
                        <div class="container1">
                            <div class="item1 item-1"></div>
                        </div>
                    </span>
                    <span class="gricss-son1">
                        <div class="container2" @click="kanbanFun('container2',2)">
                            <div class="item2 item-1"></div>
                            <div class="item2 item-2"></div>
                        </div>
                    </span>
                    <span class="gricss-son1">
                        <div class="container3" @click="kanbanFun('container3',3)">
                            <div class="item3 item-1"></div>
                            <div class="item3 item-2"></div>
                        </div>
                    </span>
                    <span class="gricss-son1">
                        <div class="container4" @click="kanbanFun('container4',4)">
                            <div class="item4 item-1"></div>
                            <div class="item4 item-2"></div>
                            <div class="item4 item-3"></div>
                        </div>
                    </span>
                    <span class="gricss-son1">
                        <div class="container5" @click="kanbanFun('container5',5)">
                            <div class="item5 item-1"></div>
                            <div class="item5 item-2"></div>
                            <div class="item5 item-3"></div>
                        </div>
                    </span>
                    <span class="gricss-son1">
                        <div class="container6" @click="kanbanFun('container6',6)">
                            <div class="item6 item-1"></div>
                            <div class="item6 item-2"></div>
                            <div class="item6 item-3"></div>
                        </div>
                    </span>
                    <span class="gricss-son1">
                        <div class="container7" @click="kanbanFun('container7',7)">
                            <div class="item7 item-1"></div>
                            <div class="item7 item-2"></div>
                            <div class="item7 item-3"></div>
                        </div>
                    </span>
                    <span class="gricss-son1">
                        <div class="container8" @click="kanbanFun('container8',8)">
                            <div class="item8 item-1"></div>
                            <div class="item8 item-2"></div>
                            <div class="item8 item-3"></div>
                            <div class="item8 item-4"></div>
                        </div>
                    </span>
                    <span class="gricss-son1">
                        <div class="container9" @click="kanbanFun('container9',9)">
                            <div class="item9 item-1"></div>
                            <div class="item9 item-2"></div>
                            <div class="item9 item-3"></div>
                            <div class="item9 item-4"></div>
                            <div class="item9 item-5"></div>
                            <div class="item9 item-6"></div>
                        </div>
                    </span>
                    <span class="gricss-son1">
                        <div class="container10" @click="kanbanFun('container10',10)">
                            <div class="item10 item-1"></div>
                            <div class="item10 item-2"></div>
                            <div class="item10 item-3"></div>
                            <div class="item10 item-4"></div>
                            <div class="item10 item-5"></div>
                            <div class="item10 item-6"></div>
                        </div>
                    </span>
                </div>
            </div>
        </div>

        <div class="iqis-page-block-body" style="width:100%;height:100%;">
            <div class="iqis-page-block">
                <div class="iqis-page-block-title">{{$t('monitor.editData')}}</div>
            </div>
            <div class="kanban-display-1">
                <kanban-module :boardIds="boardId" :discerns="discern" :shwoSerialNumber='kanbanNumber' :kanbanList='kanbanData' :whetherSave='saveVal' @close="closeTabFun()"></kanban-module>
            </div>
        </div>
        <!-- 尾部按钮 -->
        <IqisAffix placement="bottom" :offset="0">
            <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
                <Button type="primary" @click="saveFun()">{{$t('iqc.save')}}</Button>
                <Button type="ghost" @click="cancelFun()">{{$t('iqc.cancel')}}</Button>
            </div>
        </IqisAffix>
    </div>
</template>

<script>
    import $ from 'jquery';
    import kanbanModule from './kanbanModule/quality-kanban-projectionScreen.vue'
    export default {
        props:['params'],
        components: {kanbanModule},
        name: '',
        data() {
            return {
                userIds:null,
                saveVal:0,
                i18n:window.i18n,
                container:'',//看板监听变量(watch)
                kanbanNumber:null,
                kanbanData:{
                    boardNo:null,
                    boardName:null,
                    operationId:null,
                    remark:null,
                    style:1,
                    // boardTypeId:null,
                },
                className: [],
                boardId:'',
                discern:'',
            }
        },
        provide(){
            return {
                kanbanStyle:{styles:this.$props.params ? this.$props.params.query.style : undefined,boardId:this.$props.params ? this.$props.params.query.boardId : undefined}
            }
        },
        created () {
            let that = this;
            // 获取当前登录人员的信息
            this.$http.get('/tenant/user/profile').then(function(res){
                that.userIds = res.data.userId
                that.kanbanData.operationId = res.data.userId
            })
            // 获取所属类别
            this.$http.get('/boardType').then(function(res){
                that.className = res.data
            })
            if(this.$props.params && this.$props.params.query){
                console.log(this.$props.params,1232456);

                let amendInfo = this.$props.params.query
                that.kanbanData.boardNo = amendInfo.boardNo
                that.kanbanData.boardName = amendInfo.boardName
                that.kanbanData.boardTypeId = amendInfo.boardTypeId
                that.kanbanData.remark = amendInfo.remark
                that.kanbanData.style = amendInfo.style
                that.boardId = amendInfo.boardId
            }
        },
        mounted () {
            if(this.$props.params){
                this.discern =this.$props && this.$props.params.discern
            }
            $(".container1>div").addClass('kanbanStyle')
            // this.container = 'container'+this.kanbanData.style
            if(this.$props.params && this.$props.params.query.style && this.$props.params.query.style != 1){
                this.kanbanFun('container'+this.kanbanData.style,this.kanbanData.style)
            }
        },
        watch: {
            // 监听选中值的变化，改变点击之后的样式(互斥)
            'container':(newValue,oldValue) => {
                if(oldValue){
                    $("."+oldValue+">div").removeClass("kanbanStyle")
                }else{
                    $(".container1>div").removeClass('kanbanStyle')
                }
            },
        },
        methods: {
            // 看板样式按钮事件
            kanbanFun(container,numbers){
                this.container = container;
                this.kanbanNumber = numbers;
                // alert(this.numbers)
                this.kanbanData.style = numbers;//看板样式按钮序号
                $("."+container+">div").addClass('kanbanStyle');
            },
            //保存
            saveFun(){
                let sign = new Date()
                this.saveVal = sign.getTime()
            },
            // /diagram/report/oqc/dispatcher?business=return_rate&by=byProduct&hourOffset=8&start=1550678400000&end=1553270399000&toSupplierCustomerId=&productTypeId=156&productId=283549&manufacturerId=&customerId=&prodLineId=&prodProcessId=
            // 取消
            closeTabFun(){
                this.cancelFun();
                this.$Message.success("保存成功");
            },
            cancelFun(){
                this.$emit("close-tab",'quality-Kanban-add');
                this.$emit("open-tab","monitoring-center-quality-Kanban","质量看板","page-monitor-quality-Kanban-list",null);
            }
        }
    }
</script>

<style scoped>
   .borderStyle{
       border: 1px solid #e9e9e9;
   } 
   .kanbanStyle{
       border: 2px solid rgb(65, 143, 238)!important;
   }
   .gridcss{
       width: 100%;
       margin-top: 10px;
       display: flex;
       justify-content: space-around;
   }
   .gricss-son{
       display: inline-block;
       width: 70px;
       height: 40px;
       border: 2px solid #e9e9e9;
       box-sizing: border-box;
       cursor: pointer;
       margin-right: 5px;
   }
   .gridcss .gricss-son:hover{
       border: 2px solid rgb(65, 143, 238);
   } 
   .gricss-son1{
       display: inline-block;
       width: 70px;
       height: 40px;
       box-sizing: border-box;
       cursor: pointer;
       margin-right: 10px;
   }
   .container1{
       width: 100%;
       height: 100%;
       display: grid;
       grid-template-columns: 1fr;
   }
   .item1{
       width: 100%;
       height: 100%;
       border: 2px solid #e9e9e9;
   }
   .container1:hover>div{
       border: 2px solid rgb(65, 143, 238);
   }
   .container2{
       width: 100%;
       height: 100%;
       display: grid;
       grid-template-columns: 1fr 1fr;
       grid-column-gap: 1px;
       grid-row-gap: 1px;
   }
   .item2{
       width: 100%;
       height: 100%;
       border: 2px solid #e9e9e9;
   }
   .container2:hover>div{
       border: 2px solid rgb(65, 143, 238);
   }
   .container3{
       width: 100%;
       height: 100%;
       display: grid;
       grid-template-rows: 1fr 1fr;
       grid-column-gap: 1px;
       grid-row-gap: 1px;
   }
   .item3{
       width: 100%;
       height: 100%;
       border: 2px solid #e9e9e9;
   }
   .container3:hover>div{
       border: 2px solid rgb(65, 143, 238);
   }
   .container4{
       width: 100%;
       height: 100%;
       display: grid;
       grid-template-columns: 1fr 1fr;
       grid-template-rows: 1fr 1fr;
       grid-column-gap: 1px;
       grid-row-gap: 1px;
   }
   .container4 .item-1{
       grid-column-start: 1; 
       grid-column-end: 3;
   }
   .item4{
       width: 100%;
       height: 100%;
       border: 2px solid #e9e9e9;
   }
   .container4:hover>div{
       border: 2px solid rgb(65, 143, 238);
   }
   .container5{
       width: 100%;
       height: 100%;
       display: grid;
       grid-template-columns: 1fr 1fr;
       grid-template-rows: 1fr 1fr;
       grid-column-gap: 1px;
       grid-row-gap: 1px;
   }
   .container5 .item-3{
       grid-column-start: 1; 
       grid-column-end: 3;
   }
   .item5{
       width: 100%;
       height: 100%;
       border: 2px solid #e9e9e9;
   }
   .container5:hover>div{
       border: 2px solid rgb(65, 143, 238);
   }
   .container6{
       width: 100%;
       height: 100%;
       display: grid;
       grid-template-columns: 1fr 1fr;
       grid-template-rows: 1fr 1fr;
       grid-column-gap: 1px;
       grid-row-gap: 1px;
   }
   .container6 .item-1{
       grid-row-start: 1;
       grid-row-end: 3;
   }
   .item6{
       width: 100%;
       height: 100%;
       border: 2px solid #e9e9e9;
   }
   .container6:hover>div{
       border: 2px solid rgb(65, 143, 238);
   }
   .container7{
       width: 100%;
       height: 100%;
       display: grid;
       grid-template-columns: 1fr 1fr;
       grid-template-rows: 1fr 1fr;
       grid-column-gap: 1px;
       grid-row-gap: 1px;
   }
   .container7 .item-2{
       grid-column-start: 2;
       grid-column-end: 3;
       grid-row-start: 1;
       grid-row-end: 3;
   }
   .item7{
       width: 100%;
       height: 100%;
       border: 2px solid #e9e9e9;
   }
   .container7:hover>div{
       border: 2px solid rgb(65, 143, 238);
   }
   .container8{
       width: 100%;
       height: 100%;
       display: grid;
       grid-template-columns: 1fr 1fr;
       grid-column-gap: 1px;
       grid-row-gap: 1px;
       /* background-color: #000; */
   }
   .item8{
       width: 100%;
       height: 100%;
       border: 2px solid #e9e9e9;
       color: #000;
       text-align: center;
   }
   .container8:hover>div{
       border: 2px solid rgb(65, 143, 238);
   }
   .container9{
       width: 100%;
       height: 100%;
       display: grid;
       grid-template-columns: 1fr 1fr 1fr;
       grid-column-gap: 1px;
       grid-row-gap: 1px;
   }
   .item9{
       width: 100%;
       height: 100%;
       border: 2px solid #e9e9e9;
       color: #000;
       text-align: center;
   }
   .container9:hover>div{
       border: 2px solid rgb(65, 143, 238);
   }

   .container10{
       width: 100%;
       height: 100%;
       display: grid;
       grid-template-columns: 1fr 1fr;
       grid-column-gap: 1px;
       grid-row-gap: 1px;
   }
   .item10{
       width: 100%;
       height: 100%;
       border: 2px solid #e9e9e9;
       color: #000;
       text-align: center;
   }
   .container10:hover>div{
       border: 2px solid rgb(65, 143, 238);
   }
   /* 看板展示样式 */
   .kanban-display-1{
       margin-top: 10px;
       width: 100%;
       height: 100%;
   }
</style>