/*
 * @Author: yaoxingpu 
 * @Date: 2019-03-13 14:47:33 
 * @Last Modified by: yaoxingpu
 * @Last Modified time: 2019-04-28 17:34:42
 */
<template id="kanban">
    <!-- <div class="iqis-page" style="height:100%"> -->
    <div class="iqis-page">
        <!-- <div class="iqis-page-block" style="height:100%;"> -->
        <div class="iqis-page-block">
            <!-- 头部 -->
            <div class="iqis-header" v-if="trowIn">
                <div class="iqis-header-item-left iqis-logo-area">
                    <img class="iqis-logo" src="../../../../../static/img/new-head-logo.png" alt="" style="margin-left: 8px;height: 32px;margin-top: 8px"></img>
                </div>
                <div class="iqis-header-item-left iqis-logo-area" style="font-size:18px;color:#fff;line-height:44px;">
                    <span style="margin:12px 30px 0;color:#519CF9;background:#519CF9;width:2px;height:24px;float:left;"></span>
                    <span style="font-family:'微软雅黑'"><span>{{cpName}}</span> <span style="font-weight: normal;"> - </span> <span style="font-size:24px;font-weight: bold;">{{boardName}}</span></span>
                </div>
                <div style="float:right;height:100%;cursor:pointer" class="languageSelectBox">
                    <span style="line-height: 44px;margin: 0 20px 0 10px;color: #fff;"></span>
                </div>
                <span class="date-style">2019-04-01 00:00:00</span>
            </div>
            <div class="kanban-1" v-if="kanban1">
                <div class="kanban-son-1 item-son-1 borderStyle autoXY padding-0-10" :style="{'height':kanbanSonHeight+'px'}">
                    <!-- iconFun中的4个参数分别表示 1：event；2：name；3：依据层级关系最外层的父元素的class 'kanban-n'的序号(n = 此时的参数1)；4：父元素的class 'item-son-n'n同上 -->
                    <div class="i-11" @click="iconFun($event,'center',1,1)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-11">
                        <div class="text-all text-all-11">
                            <div class="txt"><span class="txt_11"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,11)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date11">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                        <div ref="chart11" :style="{'width': '100%','height': (kanbanSonHeight-120)+'px'}"></div>
                    </div>
                </div>
            </div>
            <div class="kanban-2" v-if="kanban2">
                <div class="kanban-son-2 item-son-1 borderStyle autoXY padding-0-10" :style="{'height':kanbanSonHeight+'px'}">
                    <div class="i-21" @click="iconFun($event,'left_1',2,1)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-21" id="txt21">
                        <div class="text-all text-all-21">
                            <div class="txt"><span class="txt_21"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,21)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date21">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart21" :style="{'width': '100%','height': (kanbanSonHeight-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-2 item-son-2 borderStyle autoXY padding-0-10" :style="{'height':kanbanSonHeight+'px'}">
                    <div class="i-22" @click="iconFun($event,'left_2',2,2)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-22">
                        <div class="text-all text-all-22">
                            <div class="txt"><span class="txt_22"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,22)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date22">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart22" :style="{'width': '100%','height': (kanbanSonHeight-120)+'px'}"></div>
                    </div>
                </div>
            </div>
            <div class="kanban-3" v-if="kanban3" :style="{'height':kanbanSonHeight+'px','margin-bottom':'66px'}">
                <div class="kanban-son-3 item-son-1 borderStyle autoXY padding-0-10">
                    <div class="i-31" @click="iconFun($event,'top_1',3,1)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-31">
                        <div class="text-all text-all-31">
                            <div class="txt"><span class="txt_31"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,31)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date31">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                        <div ref="chart31" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-3 item-son-2 borderStyle autoXY padding-0-10">
                    <div class="i-32" @click="iconFun($event,'top_2',3,2)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-32">
                        <div class="text-all text-all-32">
                            <div class="txt"><span class="txt_32"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,32)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date32">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart32" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
            </div>
            <div class="kanban-4" v-if="kanban4" :style="{'height':kanbanSonHeight+'px','margin-bottom':'66px'}">
                <div class="kanban-son-4 item-son-1 borderStyle autoXY padding-0-10">
                    <div class="i-41" @click="iconFun($event,'top_1',4,1)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-41">
                        <div class="text-all text-all-41">
                            <div class="txt"><span class="txt_41"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,41)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date41">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart41" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                         
                    </div>
                </div>
                <div class="kanban-son-4 item-son-2 borderStyle autoXY padding-0-10">
                    <div class="i-42" @click="iconFun($event,'top_2_1',4,2)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-42">
                        <div class="text-all text-all-42">
                            <div class="txt"><span class="txt_42"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,42)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date42">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart42" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-4 item-son-3 borderStyle autoXY padding-0-10">
                    <div class="i-43" @click="iconFun($event,'top_2_2',4,3)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-43">
                        <div class="text-all text-all-43">
                            <div class="txt"><span class="txt_43"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,43)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date43">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart43" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                        
                    </div>
                </div>
            </div>
            <div class="kanban-5" v-if="kanban5" :style="{'height':kanbanSonHeight+'px','margin-bottom':'66px'}">
                <div class="kanban-son-5 item-son-1 borderStyle autoXY padding-0-10">
                    <div class="i-51" @click="iconFun($event,'top_1_1',5,1)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-51">
                        <div class="text-all text-all-51">
                            <div class="txt"><span class="txt_51"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,51)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date51">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart51" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-5 item-son-2 borderStyle autoXY padding-0-10">
                    <div class="i-52" @click="iconFun($event,'top_1_2',5,2)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-52">
                        <div class="text-all text-all-52">
                            <div class="txt"><span class="txt_52"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,52)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date52">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart52" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                
                </div>
                <div class="kanban-son-5 item-son-3 borderStyle autoXY padding-0-10">
                    <div class="i-53" @click="iconFun($event,'top_2',5,3)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-53">
                        <div class="text-all text-all-53">
                            <div class="txt"><span class="txt_53"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,53)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date53">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart53" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
            </div>
            <div class="kanban-6" v-if="kanban6" :style="{'height':kanbanSonHeight+'px','margin-bottom':'66px'}">
                <div class="kanban-son-6 item-son-1 borderStyle autoXY padding-0-10">
                    <div class="i-61" @click="iconFun($event,'left_1',6,1)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-61">
                        <div class="text-all text-all-61">
                            <div class="txt"><span class="txt_61"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,61)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date61">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart61" :style="{'width': '100%','height': (kanbanSonHeight-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-6 item-son-2 borderStyle autoXY padding-0-10">
                    <div class="i-62" @click="iconFun($event,'left_2_1',6,2)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-62">
                        <div class="text-all text-all-62">
                            <div class="txt"><span class="txt_62"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,62)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date62">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart62" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-6 item-son-3 borderStyle autoXY padding-0-10">
                    <div class="i-63" @click="iconFun($event,'left_2_2',6,3)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-63">
                        <div class="text-all text-all-63">
                            <div class="txt"><span class="txt_63"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,63)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date63">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart63" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
            </div>
            <div class="kanban-7" v-if="kanban7" :style="{'height':kanbanSonHeight+'px','margin-bottom':'66px'}">
                <div class="kanban-son-7 item-son-1 borderStyle autoXY padding-0-10">
                    <div class="i-71" @click="iconFun($event,'left_1_1',7,1)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-71">
                        <div class="text-all text-all-71">
                            <div class="txt"><span class="txt_71"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,71)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date71">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart71" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-7 item-son-2 borderStyle autoXY padding-0-10">
                    <div class="i-72" @click="iconFun($event,'left_1_2',7,2)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-72">
                        <div class="text-all text-all-72">
                            <div class="txt"><span class="txt_72"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,72)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date72">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart72" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-7 item-son-3 borderStyle autoXY padding-0-10">
                    <div class="i-73" @click="iconFun($event,'left_2',7,3)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-73">
                        <div class="text-all text-all-73">
                            <div class="txt"><span class="txt_73"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,73)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date73">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart73" :style="{'width': '100%','height': (kanbanSonHeight-120)+'px'}"></div>
                    </div>
                </div>
            </div>
            <div class="kanban-8" v-if="kanban8" :style="{'height':kanbanSonHeight+'px','margin-bottom':'66px'}">
                <div class="kanban-son-8 item-son-1 borderStyle autoXY padding-0-10">
                    <div class="i-81" @click="iconFun($event,'left_1_1',8,1)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-81">
                        <div class="text-all text-all-81">
                            <div class="txt"><span class="txt_81"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,81)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date81">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart81" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-8 item-son-2 borderStyle autoXY padding-0-10">
                    <div class="i-82" @click="iconFun($event,'left_1_2',8,2)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-82">
                        <div class="text-all text-all-82">
                            <div class="txt"><span class="txt_82"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,82)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date82">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart82" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-8 item-son-3 borderStyle autoXY padding-0-10">
                    <div class="i-83" @click="iconFun($event,'left_2_1',8,3)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-83">
                        <div class="text-all text-all-83">
                            <div class="txt"><span class="txt_83"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,83)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date83">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart83" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-8 item-son-4 borderStyle autoXY padding-0-10">
                    <div class="i-84" @click="iconFun($event,'left_2_2',8,4)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-84">
                        <div class="text-all text-all-84">
                            <div class="txt"><span class="txt_84"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,84)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date84">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart84" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
            </div>
            <div class="kanban-9" v-if="kanban9" :style="{'height':kanbanSonHeight+'px','margin-bottom':'66px'}">
                <div class="kanban-son-9 item-son-1 borderStyle autoXY padding-0-10">
                    <div class="i-91" @click="iconFun($event,'left_1_1',9,1)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-91">
                        <div class="text-all text-all-91">
                            <div class="txt"><span class="txt_91"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,91)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date91">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart91" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-9 item-son-2 borderStyle autoXY padding-0-10">
                    <div class="i-92" @click="iconFun($event,'left_1_2',9,2)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-92">
                        <div class="text-all text-all-92">
                            <div class="txt"><span class="txt_92"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,92)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date92">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart92" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-9 item-son-3 borderStyle autoXY padding-0-10">
                    <div class="i-93" @click="iconFun($event,'left_1_3',9,3)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-93">
                        <div class="text-all text-all-93">
                            <div class="txt"><span class="txt_93"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,93)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date93">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart93" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-9 item-son-4 borderStyle autoXY padding-0-10">
                    <div class="i-94" @click="iconFun($event,'left_2_1',9,4)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-94">
                        <div class="text-all text-all-94">
                            <div class="txt"><span class="txt_94"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,94)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date94">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart94" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-9 item-son-5 borderStyle autoXY padding-0-10">
                    <div class="i-95" @click="iconFun($event,'left_2_2',9,5)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-95">
                        <div class="text-all text-all-95">
                            <div class="txt"><span class="txt_95"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,95)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date95">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart95" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-9 item-son-6 borderStyle autoXY padding-0-10">
                    <div class="i-96" @click="iconFun($event,'left_2_3',9,6)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-96">
                        <div class="text-all text-all-96">
                            <div class="txt"><span class="txt_96"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="large" @click="modification(false,96)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date96">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart96" :style="{'width': '100%','height': (kanbanSonHeight/2-120)+'px'}"></div>
                    </div>
                </div>
            </div>
            <div class="kanban-10" v-if="kanban10" :style="{'height':kanbanSonHeight+'px','margin-bottom':'66px'}">
                <div class="kanban-son-10 item-son-1 borderStyle autoXY padding-0-10">
                    <div class="i-101" @click="iconFun($event,'left_1_1',10,1)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-101">
                        <div class="text-all text-all-101">
                            <div class="txt"><span class="txt_101"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="small" @click="modification(false,101)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date101">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart101" :style="{'width': '100%','height': (kanbanSonHeight/3-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-10 item-son-2 borderStyle autoXY padding-0-10">
                    <div class="i-102" @click="iconFun($event,'left_1_2',10,2)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-102">
                        <div class="text-all text-all-102">
                            <div class="txt"><span class="txt_102"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="small" @click="modification(false,102)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date102">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart102" :style="{'width': '100%','height': (kanbanSonHeight/3-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-10 item-son-3 borderStyle autoXY padding-0-10">
                    <div class="i-103" @click="iconFun($event,'left_2_1',10,3)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-103">
                        <div class="text-all text-all-103">
                            <div class="txt"><span class="txt_103"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="small" @click="modification(false,103)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date103">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart103" :style="{'width': '100%','height': (kanbanSonHeight/3-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-10 item-son-4 borderStyle autoXY padding-0-10">
                    <div class="i-104" @click="iconFun($event,'left_2_2',10,4)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-104">
                        <div class="text-all text-all-104">
                            <div class="txt"><span class="txt_104"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="small" @click="modification(false,104)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date104">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart104" :style="{'width': '100%','height': (kanbanSonHeight/3-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-10 item-son-5 borderStyle autoXY padding-0-10">
                    <div class="i-105" @click="iconFun($event,'left_3_1',10,5)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-105">
                        <div class="text-all text-all-105">
                            <div class="txt"><span class="txt_105"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="small" @click="modification(false,105)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date105">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart105" :style="{'width': '100%','height': (kanbanSonHeight/3-120)+'px'}"></div>
                    </div>
                </div>
                <div class="kanban-son-10 item-son-6 borderStyle autoXY padding-0-10">
                    <div class="i-106" @click="iconFun($event,'left_3_2',10,6)"><Icon type="plus" size="80"></Icon></div>
                    <div class="txt-106">
                        <div class="text-all text-all-106">
                            <div class="txt"><span class="txt_106"></span><Button v-if="trowIn_btn" class="txt-son-btn" type="primary" size="small" @click="modification(false,106)">{{$t('monitor.modify')}}</Button></div>
                            <div class="txt-date106">{{$t('monitor.dateRange')}}</div>
                            <!-- <div class="txt-tex">{{$t('monitor.relatedData')}}</div> -->
                        </div>
                        <!-- 图表 -->
                         <div ref="chart106" :style="{'width': '100%','height': (kanbanSonHeight/3-120)+'px'}"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="iqis-page-dialog">
            <Modal :title='i18n.t("monitor.AddCondition")' v-model="modelShow" :mask-closable="false" width="600" >
                <div>
                    <Row type="flex" :gutter="40">
                        <Col span="12">{{$t('monitor.timeInterval')}}</Col>
                    </Row>
                    <Row type="flex" :gutter="40">
                        <Col span="12">
                            <Select v-model="modelData.timeInterval">
                                <Option v-for="item in timeIntervalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>
                <div class="margintop20">
                    <Row type="flex" :gutter="40">
                        <Col span="12">{{$t('monitor.statisticalCharts')}}</Col>
                        <Col span="12">{{$t('monitor.businessStatistics')}}</Col>
                    </Row>
                    <Row type="flex" :gutter="40">
                        <Col span="12">
                            <Select v-model="modelData.chartName">
                                <Option v-for="item in statisticalChartList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="12">
                            <Select v-model="modelData.businessType">
                                <Option v-for="item in businessStatisticsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>
                <div class="margintop20" v-show="allShow">
                    <Row type="flex" :gutter="40">
                        <Col span="12" v-show="businessType">
                            <div class="businessType">{{$t('monitor.businessTypes')}}</div>
                            <Select v-model="modelData.business">
                                <Option v-for="item in businessTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="12" v-show="statisticalModeShow">
                            <div class="statistical">{{$t('monitor.statisticalMethods')}}</div>
                            <Select v-model="modelData.byMethod">
                                <Option v-for="item in statisticalModeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>
                <div class="margintop20" v-if="comparisonShow">
                    <span style="font-size:16px;">{{$t('monitor.comparisonConditions')}}</span>
                </div>
                <div class="margintop20" v-if="comparisonShow">
                    <Row type="flex" :gutter="40">
                        <Col span="24" v-if="cf_cpbh">
                            <div>{{$t('monitor.productNumber')}}</div>
                            <Select multiple v-model="modelDataList.productId">
                                <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.no }}</Option>
                            </Select>
                        </Col>
                        <Col span="24" v-if="cf_gysmc">
                            <div>{{$t('monitor.supplierName')}}</div>
                            <Select multiple v-model="modelDataList.manufacturerId">
                                <Option v-for="(item,index) in supplierNameList" :value="item.manufacturerId" :key="item.index">{{ item.manufacturerAbbreviation }}</Option>
                            </Select>
                        </Col>
                        <Col span="24" v-if="cf_cplb">
                            <div>{{$t('monitor.productCategory')}}</div>
                            <Select multiple v-model="modelDataList.prodTypeId">
                                <Option v-for="item in productClassList" :value="item.prodTypeId" :key="item.index">{{ item.name }}</Option>
                            </Select>
                        </Col>
                        <Col span="24" v-if="cf_ycyy">
                            <div>{{$t('monitor.abnormalReason')}}</div>
                            <Select multiple v-model="modelDataList.abnormalId">
                                <Option v-for="(item,index) in abnormalList" :value="item.abnormalId" :key="item.index">{{ item.name }}</Option>
                            </Select>
                        </Col>
                        <Col span="24" v-if="cf_clfs">
                            <div>{{$t('monitor.handling')}}</div>
                            <Select multiple v-model="modelDataList.treatmentMethodList">
                                <Option v-for="item in optList" :value="item.value" :key="item.index">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="24" v-if="cf_cpph">
                            <div>{{$t('monitor.ProductBatchNumber')}}</div>
                            <Select multiple v-model="modelDataList.prodBatchId">
                                <Option v-for="(item,index) in prodbatchList" :value="item.prodBatchId" :key="item.index">{{ item.batchNo }}</Option>
                            </Select>
                        </Col>
                        <Col span="24" v-if="cf_khmc">
                            <div>{{$t('monitor.customerName')}}</div>
                            <Select multiple v-model="modelDataList.customerId">
                                <Option v-for="(item,index) in complaintList" :value="item.customerId" :key="item.index">{{ item.customerName }}</Option>
                            </Select>
                        </Col>
                        <Col span="24" v-if="cf_jybb">
                            <div>{{$t('monitor.class')}}</div>
                            <Select multiple v-model="modelDataList.chkShiftId">
                                <Option v-for="(item,index) in chkshiftList" :value="item.chkShiftId" :key="item.index">{{ item.name }}</Option>
                            </Select>
                        </Col>
                        <Col span="24" v-if="cf_jyy">
                            <div>{{$t('monitor.inspector')}}</div>
                            <Select multiple v-model="modelDataList.userId">
                                <Option v-for="(item,index) in userNameList" :value="item.userId" :key="item.index">{{ item.name }}</Option>
                            </Select>
                        </Col>
                        <Col span="24" v-if="cf_gx">
                            <div>{{$t('monitor.process')}}</div>
                            <Select multiple v-model="modelDataList.prodProcessId">
                                <Option v-for="(item,index) in prodProcessList" :value="item.prodProcessId" :key="item.index">{{ item.prodProcessName }}</Option>
                            </Select>
                        </Col>
                        <Col span="24" v-if="cf_xb">
                            <div>{{$t('monitor.Line')}}</div>
                            <Select multiple v-model="modelDataList.prodLineId">
                                <Option v-for="(item,index) in prodLineTypeList" :value="item.prodLineId" :key="item.index">{{ item.prodLineType }}</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>
                <div class="margintop20">
                    <span style="font-size:16px;">{{$t('monitor.filtrationConditions')}}</span>
                </div>
                <!-- 柱状图/饼状图/趋势图时显示此条件组 -->
                <div v-show="hm">
                    <div class="margintop20">
                        <Row type="flex" :gutter="40">
                            <Col span="12">
                                <div>{{$t('monitor.productCategory')}}</div>
                                <Select v-model="modelData.productTypeId">
                                    <Option v-for="item in productClassList" :value="item.prodTypeId" :key="item.index">{{ item.name }}</Option>
                                </Select>
                            </Col>
                            <Col span="12">
                                <div>{{$t('monitor.productNumber')}}</div>
                                <Select v-model="modelData.productId">
                                    <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.no }}</Option>
                                </Select>
                            </Col>
                        </Row>
                    </div>
                    <div class="margintop20">
                        <Row type="flex" :gutter="40">
                            <Col span="12">
                                <div>{{$t('monitor.specifications')}}</div>
                                <Select v-model="modelData.productId" disabled>
                                    <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.spec }}</Option>
                                </Select>
                            </Col>
                            <!-- <span v-if="hm_gyx_xb_Show"> -->
                            <Col span="12" v-if="hm_pqc_gys_Show">
                                <div>{{$t('monitor.supplierName')}}</div>
                                <Select v-model="modelData.manufacturerId">
                                    <Option v-for="(item,index) in supplierNameList" :value="item.manufacturerId" :key="item.index">{{ item.manufacturerAbbreviation }}</Option>
                                </Select>
                            </Col>
                            <Col span="12" v-if="hm_pqc_prodLine_Show">
                                <div>{{$t('monitor.productionLine')}}</div>
                                <Select v-model="modelData.prodLineId">
                                    <Option v-for="(item,index) in prodLineTypeList" :value="item.prodLineId" :key="item.index">{{ item.prodLineType }}</Option>
                                </Select>
                            </Col>
                            <!-- </span> -->
                            <!-- <Col span="12" v-else> -->
                            <Col span="12" v-if="hm_oqc_usn_Show">
                                <div>{{$t('monitor.customerName')}}</div>
                                <Select v-model="modelData.customerId">
                                    <Option v-for="(item,index) in complaintList" :value="item.customerId" :key="item.index">{{ item.customerName }}</Option>
                                </Select>
                            </Col>
                        </Row>
                    </div>
                    <span v-if="hm_gyx_xb_Show">
                        <div class="margintop20" v-show="!hm_pqc_gys_Show">
                            <Row type="flex" :gutter="40">
                                <Col span="12">
                                    <div>{{$t('monitor.productProcess')}}</div>
                                    <Select v-model="modelData.prodProcessId">
                                        <Option v-for="(item,index) in prodProcessList" :value="item.prodProcessId" :key="item.index">{{ item.prodProcessName }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                    </span>
                </div>
                <!-- 对比图时显示此条件组 -->
                <div v-show="cf">
                    <div class="margintop20" v-if="cf_TypeNameShow">
                        <Row type="flex" :gutter="40">
                            <Col span="12" v-if="cf_cplb ? false : true">
                                <div>{{$t('monitor.productCategory')}}</div>
                                <Select v-model="modelData.productTypeId">
                                    <Option v-for="item in productClassList" :value="item.prodTypeId" :key="item.index">{{ item.name }}</Option>
                                </Select>
                            </Col>
                            <Col span="12" v-if="cf_gysmc ? false : true">
                                <div>{{$t('monitor.supplierName')}}</div>
                                <Select v-model="modelData.manufacturerId">
                                    <Option v-for="(item,index) in supplierNameList" :value="item.manufacturerId" :key="item.index">{{ item.manufacturerAbbreviation }}</Option>
                                </Select>
                            </Col>
                            <Col span="12" v-if="cf_cpbh ? false : true">
                                <div>{{$t('monitor.productNumber')}}</div>
                                <Select v-model="modelData.productId">
                                    <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.no }}</Option>
                                </Select>
                            </Col>
                        </Row>
                    </div>
                    <span v-if="cf_all">
                        <div class="margintop20">
                            <Row type="flex" :gutter="40">
                                <Col span="12" v-if="cf_cplb ? false : true">
                                    <div>{{$t('monitor.productCategory')}}</div>
                                    <Select v-model="modelData.productTypeId">
                                        <Option v-for="item in productClassList" :value="item.prodTypeId" :key="item.index">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                                <Col span="12" v-if="cf_cpph ? false : true">
                                    <div>{{$t('monitor.ProductBatchNumber')}}</div>
                                    <Select v-model="modelData.prodBatchId">
                                        <Option v-for="(item,index) in prodbatchList" :value="item.prodBatchId" :key="item.index">{{ item.batchNo }}</Option>
                                    </Select>
                                </Col>
                                <Col span="12" 
                                v-show="cf_khmc ? false : cf_jybb ? false : cf_jyy ? false : cf_xb ? false : cf_gx ? false : true" 
                                v-if="cf_cpbh ? false : true">
                                    <div>{{$t('monitor.productNumber')}}</div>
                                    <Select v-model="modelData.productId">
                                        <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.no }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                        <div class="margintop20">
                            <Row type="flex" :gutter="40">
                                <Col span="12" v-if="cf_xb ? false : true">
                                    <div>{{$t('monitor.productionLine')}}</div>
                                    <Select v-model="modelData.prodLineId">
                                        <Option v-for="(item,index) in prodLineTypeList" :value="item.prodLineId" :key="item.index">{{ item.prodLineType }}</Option>
                                    </Select>
                                </Col>
                                <Col span="12"v-else>
                                    <div>{{$t('monitor.productNumber')}}</div>
                                    <Select v-model="modelData.productId">
                                        <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.no }}</Option>
                                    </Select>
                                </Col>
                                <Col span="12" v-if="cf_gx ? false : true">
                                    <div>{{$t('monitor.productProcess')}}</div>
                                    <Select v-model="modelData.prodProcessId">
                                        <Option v-for="(item,index) in prodProcessList" :value="item.prodProcessId" :key="item.index">{{ item.prodProcessName }}</Option>
                                    </Select>
                                </Col>
                                <Col span="12"v-else>
                                    <div>{{$t('monitor.productNumber')}}</div>
                                    <Select v-model="modelData.productId">
                                        <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.no }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                        <div class="margintop20">
                            <Row type="flex" :gutter="40">
                                <Col span="12" v-if="cf_khmc ? false : true">
                                    <div>{{$t('monitor.customerName')}}</div>
                                    <Select v-model="modelData.customerId">
                                        <Option v-for="(item,index) in complaintList" :value="item.customerId" :key="item.index">{{ item.customerName }}</Option>
                                    </Select>
                                </Col>
                                <Col span="12" v-show="cf_khmc ? true : false">
                                    <div>{{$t('monitor.productNumber')}}</div>
                                    <Select v-model="modelData.productId">
                                        <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.no }}</Option>
                                    </Select>
                                </Col>
                                <Col span="12" v-if="cf_jyy ? false : true">
                                    <div>{{$t('monitor.inspector')}}</div>
                                    <Select v-model="modelData.userId">
                                        <Option v-for="(item,index) in userNameList" :value="item.userId" :key="item.index">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                                <Col span="12" v-if="cf_jyy ? true : false">
                                    <div>{{$t('monitor.productNumber')}}</div>
                                    <Select v-model="modelData.productId">
                                        <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.no }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                        <div class="margintop20">
                            <Row type="flex" :gutter="40">
                                <Col span="12" v-if="cf_jybb ? false : true">
                                    <div>{{$t('monitor.class')}}</div>
                                    <Select v-model="modelData.chkShiftId">
                                        <Option v-for="(item,index) in chkshiftList" :value="item.chkShiftId" :key="item.index">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                                 <Col span="12" v-if="cf_jybb ? true : false">
                                    <div>{{$t('monitor.productNumber')}}</div>
                                    <Select v-model="modelData.productId">
                                        <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.no }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                    </span>
                    <div class="margintop20" v-if="cf_oqc_classNameShow">
                        <Row type="flex" :gutter="40">
                            <Col span="12" v-if="cf_cplb ? false : true">
                                <div>{{$t('monitor.productCategory')}}</div>
                                <Select v-model="modelData.productTypeId">
                                    <Option v-for="item in productClassList" :value="item.prodTypeId" :key="item.index">{{ item.name }}</Option>
                                </Select>
                            </Col>
                            <Col span="12" v-if="cf_cpbh ? false : true">
                                <div>{{$t('monitor.productNumber')}}</div>
                                <Select v-model="modelData.productId">
                                    <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.no }}</Option>
                                </Select>
                            </Col>
                            <Col span="12" v-if="cf_khmc ? false : true">
                                <div>{{$t('monitor.customerName')}}</div>
                                <Select v-model="modelData.customerId">
                                    <Option v-for="(item,index) in complaintList" :value="item.customerId" :key="item.index">{{ item.customerName }}</Option>
                                </Select>
                            </Col>
                        </Row>
                    </div>
                    <span v-if="cf_cc">
                        <div class="margintop20">
                            <Row type="flex" :gutter="40">
                                <Col span="12" v-if="cf_cplb ? false : true">
                                    <div>{{$t('monitor.productCategory')}}</div>
                                    <Select v-model="modelData.productTypeId">
                                        <Option v-for="item in productClassList" :value="item.prodTypeId" :key="item.index">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                                <Col span="12" v-if="cf_cpbh ? false : cf_khmc ? false : cf_clfs ? false : true">
                                    <div>{{$t('monitor.productNumber')}}</div>
                                    <Select v-model="modelData.productId">
                                        <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.no }}</Option>
                                    </Select>
                                </Col>
                                <Col span="12" v-if="cf_ycyy ? false : true">
                                    <div>{{$t('monitor.abnormalReason')}}</div>
                                    <Select v-model="modelData.abnormalId">
                                        <Option v-for="(item,index) in abnormalList" :value="item.abnormalId" :key="item.index">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                        <div class="margintop20">
                            <Row type="flex" :gutter="40">
                                <Col span="12" v-if="cf_clfs ? false : true">
                                    <div>{{$t('monitor.handling')}}</div>
                                    <Select v-model="modelData.treatmentMethod">
                                        <Option v-for="item in optList" :value="item.value" :key="item.index">{{ item.label }}</Option>
                                    </Select>
                                </Col>
                                <Col span="12" v-else>
                                    <div>{{$t('monitor.productNumber')}}</div>
                                    <Select v-model="modelData.productId">
                                        <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.no }}</Option>
                                    </Select>
                                </Col>
                                <Col span="12" v-if="cf_khmc ? false : true">
                                    <div>{{$t('monitor.customerName')}}</div>
                                    <Select v-model="modelData.customerId">
                                        <Option v-for="(item,index) in complaintList" :value="item.customerId" :key="item.index">{{ item.customerName }}</Option>
                                    </Select>
                                </Col>
                                <Col span="12" v-else>
                                    <div>{{$t('monitor.productNumber')}}</div>
                                    <Select v-model="modelData.productId">
                                        <Option v-for="item in productNoList" :value="item.productId" :key="item.index">{{ item.no }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                    </span>
                    
                </div>
                <!-- 排列图时显示此条件组 -->
                <!-- <div v-show="pct">
                    
                </div> -->
                <div slot="footer">
                    <Button type="primary" size="large" @click="modalSaveFun()">{{$t('monitor.save')}}</Button>
                    <Button type="text" size="large" @click="modalResetFun()">{{$t('monitor.reset')}}</Button>
                    <Button type="text" size="large" @click="modalCancelFun()">{{$t('monitor.cancel')}}</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    import echart from 'echarts'
    import reportConfig from '../../../statistic/statisticConfig.js';
    import conditionData from './conditionConfig.js'
    import numeral from 'numeral';
    export default {
        name: 'kanban',
        props:['shwoSerialNumber','kanbanList','whetherSave','boardId','discerns'],
        data() {
            return {
                i18n:window.i18n,
                isShow:'',
                cpName:'',
                boardName:'',
                trowIn:false,
                trowIn_btn:true,
                sign:'',//list中的判断
                headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
                hm:true,//柱状图条件组
                pc:false,//饼状图
                tc:false,//趋势图
                cf:false,//对比图
                pct:false,//排列图

                cf_cpbh:false,
                cf_gysmc:false,
                cf_cplb:false,
                cf_ycyy:false,
                cf_clfs:false,
                cf_cpph:false,
                cf_khmc:false,
                cf_jybb:false,
                cf_jyy:false,
                cf_gx:false,
                cf_xb:false,

                hm_pqc_gys_Show:false,
                hm_pqc_prodLine_Show:false,
                hm_oqc_usn_Show:false,
                hm_gyx_xb_Show: true,
                pc_pqc_gys_Show:false,
                pc_gyx_xb_Show: true,
                cf_TypeNameShow:true,//对比图的类别名称
                cf_oqc_classNameShow:false,//对比图的类别客户名称
                cf_cc:false,//客诉
                cf_all:false,
                // hm_pqc_xb_Show:true,
                
                product_pupplierName:false,
                allShow:true,
                comparisonShow:false,//对比条件
                cf_iqc_bh_show:true,
                businessType:true,//业务类型
                statisticalModeShow:true,//统计方式

                operationTime:0,
                kanbanInfo:{
                    boardDetailDtos: [],
                    boardName: "",//看板名称
                    boardNo: "",//看板编号
                    boardTypeId: 0,//看板类别
                    operationId: 0,//操作人
                    operationName: "",//
                    operationTime: "",//操作时间
                    remark: "",//备注
                    style:1,
                },
                kanbanStyleNo:'',//看板样式序号
                itemSonN:'',
                kanbanSonHeight:'',
                combinationNo:0,
                classNameList:[],
                // :style="{'width': '100%','height': (kanbanSonHeight-120)+'px'}"
                chartHeight:{
                    width:'100%',
                    height:(this.kanbanSonHeight-120)+'px'
                },
                kanban1:true,
                kanban2:false,
                kanban3:false,
                kanban4:false,
                kanban5:false,
                kanban6:false,
                kanban7:false,
                kanban8:false,
                kanban9:false,
                kanban10:false,

                modelShow:false,//控制对话框显示及隐藏
                modelDataList:{
                    productId:[],
                    manufacturerId:[],
                    prodTypeId:[],
                    abnormalId:[],
                    treatmentMethod:[],//处理方式
                    prodBatchId:[],
                    customerId:[],
                    chkShiftId:[],
                    userId:[],
                    prodProcessId:[],
                    prodLineId:[],
                },
                start:'',
                end:'',
                modelData:{
                    // 时间区间
                    timeInterval:'4',
                    // 统计图表
                    chartName:'',
                    // 统计业务
                    businessType:'',
                    // 业务类型
                    business:'',
                    // 统计方式
                    byMethod:'',
                    // 产品类别
                    productTypeId:'',
                    // 产品编号
                    productId:'',
                    // 生产线别
                    prodLineId:'',
                    //供应商名称
                    manufacturerId:'',
                    //客户名称
                    customerId:'',
                    // 生产工序
                    prodProcessId:'',
                    // 检验项目
                    inspectionTypeId:'',
                    //检验员
                    userId:'',
                    //生产班别
                    chkShiftId:'',
                    //异常原因
                    abnormalId:'',
                    //处理方式
                    treatmentMethod:'',
                    combinationNo:'',//组合序号
                    //图表名称
                    name:'',
                    url:'',
                },
                // 时间区间
                timeIntervalList:[
                    {value:'1',label:i18n.t('monitor.InTheDay')},
                    {value:'2',label:i18n.t('monitor.yesterday')},
                    {value:'3',label:i18n.t('monitor.inSevenDays')},
                    {value:'4',label:i18n.t('monitor.nearlyThirtyDays')},
                    {value:'5',label:i18n.t('monitor.nearlyThreeMonths')},
                    {value:'6',label:i18n.t('monitor.nearlySixMonths')},
                    {value:'7',label:i18n.t('monitor.nearly12Months')},
                ],
                // 统计图表(此条件不变)
                statisticalChartList:[
                    {value:'HISTOGRAM',label:i18n.t('monitor.histogram')},
                    {value:'PIE_CHART',label:i18n.t('monitor.pie')},
                    {value:'TENDENCY_CHART',label:i18n.t('monitor.trend')},
                    {value:'CONTRAST_FIGURE',label:i18n.t('monitor.contrastFigure')},
                    {value:'PARETO_CHART',label:i18n.t('monitor.pareto')},
                    // {value:'SPC',label:'控制图'},
                ],
                // 统计业务(此条件不变)
                businessStatisticsList:[
                    {value:'iqc',label:i18n.t('monitor.incoming')},
                    {value:'pqc',label:i18n.t('monitor._process')},
                    {value:'oqc',label:i18n.t('monitor.shipment')},
                    {value:'cc',label:i18n.t('monitor._customerComplaint')},
                ],
                // 业务类型
                businessTypeList:[],
                // 统计方式
                statisticalModeList:[],
                // 产品类别
                productClassList:[],
                // 产品编号
                productNoList:[],
                // 生产线别
                prodLineTypeList:[],
                // 生产工序
                prodProcessList:[],
                // 检验项目
                inspectionTypeList:[],
                //供应商名称
                supplierNameList:[],
                //客户名称
                complaintList:[],
                //产品批号
                prodbatchList:[],
                //检验员
                userNameList:[],
                // 检验班别
                chkshiftList:[],
                //异常原因
                abnormalList:[],
                //处理方式
                optList:[
                    {value:"REJECT",label:i18n.t('pqc.rg')},
                    {value:"REWORK",label:i18n.t('pqc.rework')},
                    {value:"SCREEN",label:i18n.t('pqc.filtrate')},
                    {value:"SPECIAL_ADOPTION",label:i18n.t('pqc.speclelAdoption')},
                    {value:"EMERGENCY_RELEASE",label:i18n.t('pqc.er')},
                    {value:"SCRAP",label:i18n.t('pqc.scrap')},
                ],

                histogramChart:'',//柱状图
                histogramoption:{},
                histogramXAxisData:[],
                histogramSeriesData:[],

                pieChart:'',//饼图
                picoption:{},
                pieXAxisData:[],
                pieSeriesData:[],

                tendencyChart:'',//趋势图
                tendencyoption:{},
                tendencyXAxisData:[],
                tendencySeriesData:[],

                areaChart:'',//对比图
                areaoption:{},
                areaXAxisData:[],
                areaSeriesData:[],

                paretoChart:'',//排列图
                paretooption:{},
                paretoXAxisData:[],
                paretoSeriesData:[],

                controlChart:'',//控制图
                controloption:{},
                controlXAxisData:[],
                controlSeriesData:[],

                echartNameList:[],//所添加的图表类型名称

                chartname:'',//图标名称

                formatterValue:'',//柱状图y轴动态定义显示样式
                qst_formatterValue:'',//趋势图y轴动态定义显示样式
                dataMax:'dataMax',

                modificationDataList:null,//修改时的数据
                oldValChartName:'',
            }
        },
        inject:['kanbanStyle'],//跨组件同信
        created () {
            if((this.$route.params && this.$route.params.id)){
                this.trowIn = true;
                this.$nextTick(function(){
                    $('.i-11').css('display','none')
                    // $('.txt-son-btn').css('display','none')
                })
            }
            this.$http.defaults.headers["x-access-token"] = this.$SessionStorage.get('token')
            // 业务类型data
            this.businessTypeList = conditionData.HISTOGRAM.iqc_businessTypeList;
            // 统计方式data
            this.statisticalModeList = conditionData.HISTOGRAM.iqc_statisticalModeList;
            // 产品类别data
            this.$http.get("/basic/prodtype",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    console.log(res.data,"产品类别Data");
                    this.productClassList = res.data;
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
            // 产品编号data
            this.$http.get("/basic/product/simple",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    this.productNoList = res.data;
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
            // 生产线别data
            this.$http.get("/basic/prodline",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    this.prodLineTypeList = res.data;
                    console.log(this.prodLineTypeList,'生产线别data');
                    
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
            // 生产工序data
            this.$http.get("/basic/prod-process",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    this.prodProcessList = res.data;
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
            // 检验项目data 
            this.$http.get("/basic/inspectiontype",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    this.inspectionTypeList = res.data;
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
             // 供应商名称data 
            this.$http.get("/bas/manufacturer/allManufacturer",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    if(res.data){
                        this.supplierNameList = res.data
                    }
                    console.log(res,"resresres");
                    
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
            //客户名称
             this.$http.get("/customer/complaint",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    if(res.data){
                        this.complaintList = res.data
                    }
                    console.log(res,"客户名称");
                    
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
            //生产批号
            this.$http.get("/examinecenter/pqc/prodbatch",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    if(res.data){
                        this.prodbatchList = res.data
                    }
                    console.log(res,"生产批号");
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
            //检验员
            this.$http.get("/tenant/user",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    if(res.data){
                        this.userNameList = res.data
                    }
                    console.log(res,"检验员");
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
            //检验班别
            this.$http.get("/basic/chkshift",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    if(res.data){
                        this.chkshiftList = res.data
                    }
                    console.log(res,"检验班别");
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
            //异常原因
            this.$http.get("/basic/abnormal",{params:{page:1,limit:999999}}).then((res) => {
                if(res.data){
                    if(res.data){
                        this.abnormalList = res.data
                    }
                    console.log(res,"异常原因");
                }
            }).catch((error) => {
                console.log("连接服务器失败，失败信息："+error);
            });
            this.$http.get("/tenant/user/profile").then((res) => {
                console.log(res.data,'res.data');
                
                this.cpName = res.data.companyName
            })
        },
        mounted () {
            if((this.$route.params && this.$route.params.id)){
                this.$nextTick(function(){
                    this.trowIn_btn = false;
                })
            }
            // 计算图表数据展示中div的可视高度
            let that = this;
            this.$nextTick(function(){
                // console.log(that.kanbanStyle,'kanbanStyle');
                let style = '';
                try {
                    style = that.kanbanStyle.styles && that.kanbanStyle;
                } catch (error) {
                    style = null
                }
                if(style){
                    let no = this.kanbanStyle.styles;
                    let windowHeight = $(window).height();
                    let kanbanHeight = $(".kanban-"+no).offset().top
                    this.kanbanSonHeight = windowHeight - (66+kanbanHeight) 
                    $('.kanban-'+no+'>.kanban-son-1').height(this.kanbanSonHeight)
                }else if(this.$route.params && this.$route.params.id){
                    let windowHeight = $(window).height();
                    let kanbanHeight = $(".kanban-1").offset().top
                    this.kanbanSonHeight = windowHeight - (kanbanHeight) 
                    $('.kanban-1>.kanban-son-1').height(this.kanbanSonHeight)
                }else{
                    let windowHeight = $(window).height();
                    let kanbanHeight = $(".kanban-1").offset().top
                    this.kanbanSonHeight = windowHeight - (66+kanbanHeight) 
                    $('.kanban-1>.kanban-son-1').height(this.kanbanSonHeight)
                }
                if((that.kanbanStyle && that.kanbanStyle.styles) || (this.$route.params && this.$route.params.id)){
                    setInterval(function(){
                        $('.date-style').text(new Date().Format('yyyy-MM-dd hh:mm:ss'))
                    },500)
                    let boardId = this.$route.params.id || this.kanbanStyle.boardId
                    this.$http.get('/board/'+boardId).then(function(res){
                        that.boardName = res.data.boardName;
                        that.kanbanInfo = res.data
                        that.kanban1 = false;
                        let kb_name = 'kanban'+res.data.style;
                        that[kb_name] = true;
                        $('.i-11').css('display','none')
                        // 图表数据
                        for(let i = 0; i < that.kanbanInfo.boardDetailDtos.length; i++){
                            let Url = '';
                            let a = []
                            let b = []
                            let info = that.kanbanInfo.boardDetailDtos;
                            that.$nextTick(function(){
                                $('.txt_'+info[i].combinationNo).text(info[i].name)
                                $('.i-'+info[i].combinationNo).css('display','none')
                            })
                            switch (info[i].chartName) {
                                case 'HISTOGRAM'://柱状图             
                                    Url = info[i].url
                                    that.echartNameList.push({resizeName:'histogramChart',funName:'histogerFun',combinationNo:info[i].combinationNo})
                                    that.$http.get(Url).then(function(res){
                                        $('.txt-'+info[i].combinationNo).css('display',"inline-block")
                                        $('.txt-date'+info[i].combinationNo).text(i18n.t("statistical.dateInterval")+"："+that.dateIntervalFun())
                                        if(!res.data || !res.data.list){
                                            a = ['-','-','-','-','-']
                                            b = [0,0,0,0,0]
                                            if(that.modelData.business === 'abnormal_count'){//动态调整y轴显示样式
                                                that.formatterValue = '{value}'
                                            }else{
                                                that.formatterValue = '{value} %'
                                            }
                                            that.dataMax = 1
                                        }else{
                                            that.dataMax = 'dataMax'
                                            let datalist = res.data.list
                                            for (let i = 0; i < datalist.length; i++) {
                                                a.push(datalist[i].name)
                                                if(that.modelData.businessType === 'iqc' || that.modelData.businessType === 'pqc' || that.modelData.businessType === 'oqc'){
                                                    if(that.modelData.business === 'first_pass_yield'){
                                                        b.push(Number(datalist[i].fpy));
                                                    }else{
                                                        b.push(Number(datalist[i].rate));
                                                    }
                                                    if(that.modelData.business === 'abnormal_count'){//动态调整y轴显示样式
                                                        that.formatterValue = '{value}'
                                                    }else{
                                                        that.formatterValue = '{value} %'
                                                    }
                                                } else{
                                                    b.push(Number(datalist[i].count));
                                                    that.formatterValue = '{value}'
                                                } 
                                            } 
                                        }
                                        window.addEventListener('resize', () => {
                                            that.histogramChart.resize();  //此功能主要是做图表自适应
                                        });
                                        // histogerFun(xAxisData=[],seriesData=[],idName)
                                        // 参数表示 xAxisData：xAxis的data；seriesData：series的data；idName：表示渲染图表的id名称后面的序号
                                        that.histogerFun(a,b,info[i].combinationNo)
                                    })
                                    break;
                                case 'PIE_CHART'://饼状图    
                                    Url = info[i].url
                                    that.echartNameList.push({resizeName:'pieChart',funName:'pieFun',combinationNo:info[i].combinationNo})
                                    that.$http.get(Url).then(function(res){
                                        $('.txt-'+info[i].combinationNo).css('display',"inline-block")
                                        $('.txt-date'+info[i].combinationNo).text(i18n.t("statistical.dateInterval")+"："+that.dateIntervalFun())
                                        if(!res.data.list){
                                            a = [{value:1,naem:'-'},{value:1,naem:'-'},,{value:1,naem:'-'},{value:1,naem:'-'},{value:1,naem:'-'}]
                                            b = [{value:1,naem:'-'},{value:1,naem:'-'},,{value:1,naem:'-'},{value:1,naem:'-'},{value:1,naem:'-'}]
                                        }else{
                                            let datalist = res.data.list
                                            for (let i = 0; i < datalist.length; i++) {
                                                a.push(datalist[i].name)
                                                if(that.modelData.businessType === 'pqc' && that.modelData.business === 'first_pass_yield'){
                                                    b.push({value:datalist[i].fpy,name:datalist[i].name})
                                                }else if(that.modelData.businessType === 'cc' && that.modelData.business === 'customer_complaint_count'){
                                                    b.push({value:datalist[i].count,name:datalist[i].name})
                                                }else{
                                                    b.push({value:datalist[i].rate,name:datalist[i].name})
                                                }
                                            }
                                        }
                                        window.addEventListener('resize', () => {
                                            that.pieChart.resize();  // 多个图表，第一个图表
                                            // this.homePie.resize();  // 多个图表，第二个图表
                                        });
                                        that.pieFun(a,b,info[i].combinationNo)
                                    })
                                    break;
                                case 'TENDENCY_CHART'://趋势图
                                    /* $('.txt_'+this.combinationNo).text('【'+n1+n2+'趋势图'+'】')
                                    this.chartname = '【'+n1+n2+'趋势图'+'】' */
                                    /* 
                                        注意：缺少defectTypeId参数
                                    */
                                    Url = info[i].url
                                    that.echartNameList.push({resizeName:'tendencyChart',funName:'tendencyFun',combinationNo:info[i].combinationNo})
                                    that.$http.get(Url).then(function(res){
                                        console.log(res,'趋势图');
                                        $('.txt-'+info[i].combinationNo).css('display',"inline-block")
                                        $('.txt-date'+info[i].combinationNo).text(i18n.t("statistical.dateInterval")+"："+that.dateIntervalFun())
                                        if(!res.data.list){
                                            a = ['-','-','-','-','-']
                                            b = [0,0,0,0,0]
                                            if(that.modelData.business === 'defect' || that.modelData.business === 'abnormal_count'){//动态调整y轴显示样式
                                                that.qst_formatterValue = '{value}'
                                            }else{
                                                that.qst_formatterValue = '{value} %'
                                            }
                                        }else{
                                            if(that.modelData.business === 'defect' || that.modelData.business === 'abnormal_count'){//动态调整y轴显示样式
                                                that.qst_formatterValue = '{value}'
                                            }else{
                                                that.qst_formatterValue = '{value} %'
                                            }
                                            let datalist = res.data.list
                                            for (let i = 0; i < datalist.length; i++) {
                                                a.push(datalist[i].name)
                                                if(that.modelData.businessType !== 'pqc'){
                                                    if(that.modelData.business === 'defect' || that.modelData.business === 'abnormal_count' || that.modelData.businessType === 'cc'){
                                                        that.qst_formatterValue = '{value}'
                                                        b.push(datalist[i].count)
                                                    }else{
                                                        that.qst_formatterValue = '{value}'
                                                        b.push(datalist[i].rate)
                                                    }
                                                }else{
                                                    that.qst_formatterValue = '{value} %'
                                                    b.push(datalist[i].fpy)
                                                }
                                            }
                                        }
                                        
                                        window.addEventListener('resize', () => {
                                            that.tendencyChart.resize();  //此功能主要是做图表自适应
                                        });
                                        that.tendencyFun(a,b,info[i].combinationNo)
                                    })
                                    break;
                                case 'CONTRAST_FIGURE'://对比图
                                    /* $('.txt_'+this.combinationNo).text('【'+n1+n2+'对比图'+'】')
                                    this.chartname = '【'+n1+n2+'对比图'+'】' */
                                    that.echartNameList.push({resizeName:'areaChart',funName:'areaFun',combinationNo:info[i].combinationNo})
                                    let urlList = (info[i].url).split('-')
                                    let params = JSON.parse(urlList[1])
                                    console.log(params,"urlList");
                                    // Url="对比图接口还没对接"
                                    that.$http.get("/diagram/report/" + urlList[0] + "/collation", {params}).then(function(res){
                                       $('.txt-'+info[i].combinationNo).css('display',"inline-block")
                                        $('.txt-date'+info[i].combinationNo).text(i18n.t("statistical.dateInterval")+"："+that.dateIntervalFun())
                                        let datalist = res.data
                                        a = datalist
                                        window.addEventListener('resize', () => {
                                            that.areaChart.resize();  //此功能主要是做图表自适应
                                        });
                                        that.areaFun(a,b,info[i].combinationNo)
                                    })
                                    break;
                                case 'PARETO_CHART'://排列图
                                    Url = info[i].url;
                                    that.echartNameList.push({resizeName:'paretoChart',funName:'paretoFun',combinationNo:info[i].combinationNo})
                                    that.$http.get(Url).then(function(res){
                                        console.log(res,'排列图');
                                        $('.txt-'+info[i].combinationNo).css('display',"inline-block")
                                        $('.txt-date'+info[i].combinationNo).text(i18n.t("statistical.dateInterval")+"："+that.dateIntervalFun())
                                        let dataList = res.data.list
                                        for(let i = 0; i < dataList.length; i++){
                                            a.push(dataList[i].name)
                                            b.push(dataList[i].count)
                                        }
                                        window.addEventListener('resize',() => {
                                            that.paretoChart.resize()
                                        })
                                        that.paretoFun(a,b,info[i].combinationNo)
                                    })
                                    break;
                                case 'SPC'://控制图
                                    that.echartNameList.push({resizeName:'controlChart',funName:'controlFun',combinationNo:that.combinationNo})
                                    that.controlFun(a,b,that.combinationNo)
                                    break;
                                default:
                                    break;
                            }
                        }

                    })
                }
            })
            //添加条件对话框中默认选中的值
            this.modelData.chartName = 'HISTOGRAM'// 统计图表
            this.modelData.businessType = 'iqc'//统计业务
            this.modelData.business = 'acceptance_rate'//业务类型
            this.modelData.byMethod = 'byProduct'//统计方式
        },
        watch: {
            "discerns":function(newVal,oldVal){
                this.sign = newVal;
                // alert(newVal)
            },
            /* 
            此方法的功能主要是做图表的销毁处理；当点击看板样式按钮时，
            在切换布局后需要重新刷新图表视图，否则切换图表按钮后，
            之前渲染的图表若和此时选的图表类型一样时，图表会直接加载，
            会影响后面布局
            */
            'shwoSerialNumber':function(newValue,oldValue){
                let a = [];
                let b = [];
                let funName = '';
                let resizeName = '';
                let combinationNo = '';
                switch (oldValue) {
                    case 1:
                        for (let i = 0; i < this.echartNameList.length; i++) {
                            funName = this.echartNameList[i].funName;
                            resizeName = this.echartNameList[i].resizeName;
                            combinationNo = this.echartNameList[i].combinationNo;
                            this[funName](a,b,combinationNo)//先传入空数据，渲染图表
                            try {
                                this[resizeName].dispose()// 在销毁此表
                            } catch (error) {
                                
                            }
                        }
                        this.echartNameList = [];//只要切换就清空
                        
                        break;
                    case 2:
                        for (let i = 0; i < this.echartNameList.length; i++) {
                            funName = this.echartNameList[i].funName;
                            resizeName = this.echartNameList[i].resizeName;
                            combinationNo = this.echartNameList[i].combinationNo;
                            this[funName](a,b,combinationNo)
                            try {
                                this[resizeName].dispose()
                            } catch (error) {
                                
                            }
                        }
                        this.echartNameList = [];//只要切换就清空
                        
                        break;
                    case 3:
                        for (let i = 0; i < this.echartNameList.length; i++) {
                            funName = this.echartNameList[i].funName;
                            resizeName = this.echartNameList[i].resizeName;
                            combinationNo = this.echartNameList[i].combinationNo;
                            this[funName](a,b,combinationNo)
                            try {
                                this[resizeName].dispose()
                            } catch (error) {
                                
                            }
                        }
                        this.echartNameList = [];//只要切换就清空
                        
                        break;
                    case 4:
                        for (let i = 0; i < this.echartNameList.length; i++) {
                            funName = this.echartNameList[i].funName;
                            resizeName = this.echartNameList[i].resizeName;
                            combinationNo = this.echartNameList[i].combinationNo;
                            this[funName](a,b,combinationNo)
                            try {
                                this[resizeName].dispose()
                            } catch (error) {
                                
                            }
                        }
                        this.echartNameList = [];//只要切换就清空
                        
                        break;
                    case 5:
                        for (let i = 0; i < this.echartNameList.length; i++) {
                            funName = this.echartNameList[i].funName;
                            resizeName = this.echartNameList[i].resizeName;
                            combinationNo = this.echartNameList[i].combinationNo;
                            this[funName](a,b,combinationNo)
                            try {
                                this[resizeName].dispose()
                            } catch (error) {
                                
                            }
                        }
                        this.echartNameList = [];//只要切换就清空
                        
                        break;
                    case 6:
                        for (let i = 0; i < this.echartNameList.length; i++) {
                            funName = this.echartNameList[i].funName;
                            resizeName = this.echartNameList[i].resizeName;
                            combinationNo = this.echartNameList[i].combinationNo;
                            this[funName](a,b,combinationNo)
                            try {
                                this[resizeName].dispose()
                            } catch (error) {
                                
                            }
                        }
                        this.echartNameList = [];//只要切换就清空
                        
                        break;
                    case 7:
                        for (let i = 0; i < this.echartNameList.length; i++) {
                            funName = this.echartNameList[i].funName;
                            resizeName = this.echartNameList[i].resizeName;
                            combinationNo = this.echartNameList[i].combinationNo;
                            this[funName](a,b,combinationNo)
                            try {
                                this[resizeName].dispose()
                            } catch (error) {
                                
                            }
                        }
                        this.echartNameList = [];//只要切换就清空
                        
                        break;
                    case 8:
                        for (let i = 0; i < this.echartNameList.length; i++) {
                            funName = this.echartNameList[i].funName;
                            resizeName = this.echartNameList[i].resizeName;
                            combinationNo = this.echartNameList[i].combinationNo;
                            this[funName](a,b,combinationNo)
                            try {
                                this[resizeName].dispose()
                            } catch (error) {
                                
                            }
                        }
                        this.echartNameList = [];//只要切换就清空
                        
                        break;
                    case 9:
                        for (let i = 0; i < this.echartNameList.length; i++) {
                            funName = this.echartNameList[i].funName;
                            resizeName = this.echartNameList[i].resizeName;
                            combinationNo = this.echartNameList[i].combinationNo;
                            this[funName](a,b,combinationNo)
                            try {
                                this[resizeName].dispose()
                            } catch (error) {
                                
                            }
                        }
                        this.echartNameList = [];//只要切换就清空
                        
                        break;
                    case 10:
                        for (let i = 0; i < this.echartNameList.length; i++) {
                            funName = this.echartNameList[i].funName;
                            resizeName = this.echartNameList[i].resizeName;
                            combinationNo = this.echartNameList[i].combinationNo;
                            this[funName](a,b,combinationNo)
                            try {
                                this[resizeName].dispose()
                            } catch (error) {
                                
                            }
                        }
                        this.echartNameList = [];//只要切换就清空
                        
                        break;
                    default:
                        break;
                }
                // 此功能主要操作编辑展示数据中“+”按钮的显示及隐藏
                switch (newValue) {
                    case 1:
                        for(let i = 0; i < 1; i++){
                            this.$nextTick(function(){
                                $('.i-'+String(1)+String(i+1)).css('display','block')
                                $('.txt-'+String(1)+String(i+1)).css('display',"none")
                            })
                        }
                        this.kanbanInfo.boardDetailDtos = []
                        break;
                    case 2:
                        for(let i = 0; i < 2; i++){
                            this.$nextTick(function(){
                                $('.i-'+String(2)+String(i+1)).css('display','inline-block')
                                $('.txt-'+String(2)+String(i+1)).css('display',"none")
                            })
                        }
                        this.kanbanInfo.boardDetailDtos = []
                        break;
                    case 3:
                        for(let i = 0; i < 3; i++){
                            this.$nextTick(function(){
                                $('.i-'+String(3)+String(i+1)).css('display','block')
                                // $('.i-31').css('display','block')
                                // $('.txt-'+String(2)+String(i+1)).css('display','none')
                                $('.txt-'+String(3)+String(i+1)).css('display',"none")
                            })
                        }
                        this.kanbanInfo.boardDetailDtos = []
                        break;
                    case 4:
                        for(let i = 0; i < 4; i++){
                            this.$nextTick(function(){
                                $('.i-'+String(4)+String(i+1)).css('display','block')
                                $('.txt-'+String(4)+String(i+1)).css('display','none')
                            })
                        }
                        this.kanbanInfo.boardDetailDtos = []
                        break;
                    case 5:
                        for(let i = 0; i < 5; i++){
                            this.$nextTick(function(){
                                $('.i-'+String(5)+String(i+1)).show()
                                $('.txt-'+String(5)+String(i+1)).css('display','none')
                            })
                        }
                        this.kanbanInfo.boardDetailDtos = []
                        break;
                    case 6:
                        for(let i = 0; i < 6; i++){
                            this.$nextTick(function(){
                                $('.i-'+String(6)+String(i+1)).show()
                                $('.txt-'+String(6)+String(i+1)).css('display','none')
                            })
                        }
                        this.kanbanInfo.boardDetailDtos = []
                        break;
                    case 7:
                        for(let i = 0; i < 7; i++){
                            this.$nextTick(function(){
                                $('.i-'+String(7)+String(i+1)).show()
                                $('.txt-'+String(7)+String(i+1)).css('display','none')
                            })
                        }
                        this.kanbanInfo.boardDetailDtos = []
                        break;
                    case 8:
                        for(let i = 0; i < 8; i++){
                            this.$nextTick(function(){
                                $('.i-'+String(8)+String(i+1)).show()
                                $('.txt-'+String(8)+String(i+1)).css('display','none')
                            })
                        }
                        this.kanbanInfo.boardDetailDtos = []
                        break;
                    case 9:
                        for(let i = 0; i < 9; i++){
                            this.$nextTick(function(){
                                $('.i-'+String(9)+String(i+1)).show()
                                $('.txt-'+String(9)+String(i+1)).css('display','none')
                            })
                        }
                        this.kanbanInfo.boardDetailDtos = []
                        break;
                    case 10:
                        for(let i = 0; i < 10; i++){
                            this.$nextTick(function(){
                                $('.i-'+String(10)+String(i+1)).show()
                                $('.txt-'+String(10)+String(i+1)).css('display','none')
                            })
                        }
                        this.kanbanInfo.boardDetailDtos = []
                        break;
                    default:
                        break;
                }
                if(oldValue){
                    this["kanban"+oldValue] = false;
                    this["kanban"+newValue] = true;
                }else{
                    try {
                    this.$nextTick(function(){
                        for(let i = 0; i < newValue; i++){
                            try{
                                this.histogramChart.dispose()
                            }catch(error){
                                
                            }
                        }
                    })
                } catch (error) {
                    
                }
                    this.kanban1 = false;
                    this["kanban"+newValue] = true;
                }
            },
            kanbanList:{
                deep:true,
                handler:function(newValue,oldValue){
                    this.kanbanInfo.boardName = newValue.boardName;//看板名称
                    this.kanbanInfo.boardNo = newValue.boardNo;//看板编号
                    this.kanbanInfo.boardTypeId = newValue.boardTypeId;//看板类别
                    this.kanbanInfo.operationId = newValue.operationId;//操作人
                    this.kanbanInfo.operationTime = (new Date()).getTime();//操作时间
                    this.kanbanInfo.remark = newValue.remark;//备注
                    this.kanbanInfo.style =newValue.style;//看板样式按钮序号
                }
            },
            //监听统计图表下拉框变化后各下拉框的具体显示
            'modelData.chartName':function(newVal,oldVal){

                let chartName = this.modelData.chartName
                let businessType = this.modelData.businessType//统计业务
                if(newVal === 'HISTOGRAM' && businessType === 'pqc'){
                    this.hm_pqc_prodLine_Show = true;
                }else{
                    this.hm_pqc_prodLine_Show = false;
                }
                if(newVal === 'HISTOGRAM' && (businessType === 'oqc' || businessType === 'cc')){
                    this.hm_oqc_usn_Show = true;
                }else{
                    this.hm_oqc_usn_Show = false;
                }
                if((newVal === 'HISTOGRAM' || newVal === 'PIE_CHART' || newVal === 'TENDENCY_CHART'|| newVal === 'PARETO_CHART') && businessType === 'iqc'){
                    this.hm_pqc_gys_Show = true;
                }else{
                    this.hm_pqc_gys_Show = false;
                }
                if((newVal === 'HISTOGRAM' || newVal === 'PIE_CHART' || newVal === 'TENDENCY_CHART'|| newVal === 'PARETO_CHART') && (businessType === 'oqc' || businessType === 'cc')){
                    this.hm_gyx_xb_Show = false;
                }else{
                    this.hm_gyx_xb_Show = true;
                }

                if(newVal === 'CONTRAST_FIGURE' && businessType === 'iqc'){
                    this.cf_TypeNameShow = true;
                }else{
                    this.cf_TypeNameShow = false;
                }

                if(newVal === 'CONTRAST_FIGURE' && businessType === 'pqc'){
                    this.cf_all = true;
                }else{
                    this.cf_all = false;
                }
                if(newVal === 'CONTRAST_FIGURE' && businessType === 'oqc'){
                    this.cf_oqc_classNameShow = true;
                }else{
                    this.cf_oqc_classNameShow = false;
                }

                if(newVal === 'CONTRAST_FIGURE' && businessType === 'cc'){
                    this.cf_cc = true;
                }else{
                    this.cf_cc = false;
                }
                if(newVal === 'CONTRAST_FIGURE' && businessType === 'iqc'){
                    this.cf_iqc_bh_show = true;
                }else{
                    this.cf_iqc_bh_show = false;
                }

                if(newVal === 'CONTRAST_FIGURE'){
                    let byMethod = this.modelData.byMethod;
                    if (byMethod === 'byProduct') {this.cf_cpbh = true}else{this.cf_cpbh = false;};//产品编号
                    if (byMethod === 'byManufacturer') {this.cf_gysmc = true}else{this.cf_gysmc = false;};//供应商名称
                    if (byMethod === 'byProductType') {this.cf_cplb = true}else{this.cf_cplb = false;};//产品类别
                    if (byMethod === 'byCause') {this.cf_ycyy = true}else{this.cf_ycyy = false;};//异常原因
                    if (byMethod === 'byHandle') {this.cf_clfs = true}else{this.cf_clfs = false;};//处理方式
                    if (byMethod === 'byBatch') {this.cf_cpph = true}else{this.cf_cpph = false;};//产品批号
                    if (byMethod === 'byCustomer') {this.cf_khmc = true}else{this.cf_khmc = false;};//客户名称
                    if (byMethod === 'byClass') {this.cf_jybb = true}else{this.cf_jybb = false;};//检验班别
                    if (byMethod === 'byInspector') {this.cf_jyy = true}else{this.cf_jyy = false;};//检验员
                    if (byMethod === 'byProcess') {this.cf_gx = true}else{this.cf_gx = false;};//工序
                    if (byMethod === 'byLine') {this.cf_xb = true}else{this.cf_xb = false;};//线别
                }
                

                if(newVal === 'HISTOGRAM' || newVal === 'PIE_CHART' || newVal === 'TENDENCY_CHART' || newVal === 'PARETO_CHART'){this.hm = true}else{this.hm = false};//柱状图
                // if(newVal === 'PIE_CHART'){this.pc = true}else{this.pc = false};//饼状图
                // if(newVal === 'TENDENCY_CHART'){this.tc = true}else{this.tc = false};//趋势图
                if(newVal === 'CONTRAST_FIGURE'){this.cf = true}else{this.cf = false};//对比图
                // if(newVal === 'PARETO_CHART'){this.pct = true}else{this.pct = false};//排列图
                
                //柱状图
                if(newVal === 'HISTOGRAM'){
                    this.businessTypeList = conditionData[newVal].iqc_businessTypeList;//业务类型
                    this.statisticalModeList = conditionData[newVal].iqc_statisticalModeList;//统计方式
                    this.oldValChartName = 'histogramChart'
                    $('.statistical').text('统计方式')

                    //添加条件对话框中默认选中的值
                    this.modelData.businessType = 'iqc'//统计业务
                    this.modelData.business = 'acceptance_rate'//业务类型
                    this.modelData.byMethod = 'byProduct'//统计方式

                    this.allShow = true;
                    this.comparisonShow = false;
                    this.businessType = true;
                    this.statisticalModeShow = true;
                    this.product_pupplierName = false;
                    
                }
                //饼状图
                if(newVal === 'PIE_CHART'){
                    this.businessTypeList = conditionData[newVal].iqc_businessTypeList;//业务类型
                    this.statisticalModeList = conditionData[newVal].iqc_statisticalModeList;//统计方式
                    this.oldValChartName = 'pieChart'
                   



                    $('.statistical').text('统计方式')

                    //添加条件对话框中默认选中的值
                    this.modelData.businessType = 'iqc'//统计业务
                    this.modelData.business = 'acceptance_rate'//业务类型
                    this.modelData.byMethod = 'byProduct'//统计方式

                    this.allShow = true;
                    this.comparisonShow = false;
                    this.businessType = true;
                    this.statisticalModeShow = true;
                    this.product_pupplierName = false;
                    
                }
                //趋势图
                if(newVal === 'TENDENCY_CHART'){
                    this.businessTypeList = conditionData[newVal].iqc_businessTypeList;//业务类型
                    this.statisticalModeList = [];//统计方式
                     this.oldValChartName = 'tendencyChart'
                    $('.statistical').text(i18n.t("statistical.statisticalMethod"))

                    //添加条件对话框中默认选中的值
                    this.modelData.businessType = 'iqc'//统计业务
                    this.modelData.business = 'acceptance_rate'//业务类型

                    this.allShow = true;
                    this.comparisonShow = false;
                    this.businessType = true;

                    this.statisticalModeShow = false;//趋势图中没有统计方式判断条件，所以隐藏！
                    this.modelData.byMethod = ''

                    this.product_pupplierName = false;
                    
                }
                //对比图
                if(newVal === 'CONTRAST_FIGURE'){
                    this.businessTypeList = conditionData[newVal].iqc_businessTypeList;//业务类型
                    this.statisticalModeList = conditionData[newVal].iqc_statisticalModeList;//对比方式
                    this.oldValChartName = 'areaChart'
                    $('.statistical').text('对比方式')

                    //添加条件对话框中默认选中的值
                    this.modelData.businessType = 'iqc'//统计业务
                    this.modelData.business = 'acceptance_rate'//业务类型
                    this.modelData.byMethod = 'byProduct'//统计方式

                    this.allShow = true;
                    this.comparisonShow = true;//显示对比条件
                    this.businessType = true;
                    this.statisticalModeShow = true;
                    this.product_pupplierName = true;
                    

                }
                //排列图
                if(newVal === 'PARETO_CHART'){
                    //排列图没有统计方式和过滤条件
                    this.businessTypeList = conditionData[newVal].iqc_businessTypeList;//业务类型
                    this.statisticalModeList = [];//统计方式
                    this.oldValChartName = 'paretoChart'
                    //添加条件对话框中默认选中的值
                    this.modelData.businessType = 'iqc'//统计业务
                    
                    this.allShow = false;
                    this.comparisonShow = false;
                    this.businessType = false;
                    this.modelData.business = '';
                    this.modelData.business = '';
                    this.statisticalModeShow = false;//趋势图中没有统计方式判断条件，所以隐藏！
                    this.modelData.byMethod = '';


                    this.product_pupplierName = false;
                    
                }
            },
            
            //监听统计业务
            'modelData.businessType':function(newVal,oldVal){
                let chartName = this.modelData.chartName
                let business = this.modelData.business
                if(chartName === 'HISTOGRAM' || chartName === 'PIE_CHART' || chartName === 'CONTRAST_FIGURE'){
                    this.businessTypeList = conditionData[chartName][newVal+'_businessTypeList'];//业务类型
                    this.statisticalModeList = conditionData[chartName][newVal+'_statisticalModeList'];//统计方式
                }else if(chartName === 'TENDENCY_CHART'){//趋势图
                    this.businessTypeList = conditionData[chartName][newVal+'_businessTypeList'];//业务类型
                    this.statisticalModeList = [];//统计方式
                }else{//排列图
                    this.businessTypeList = [];//业务类型
                    this.statisticalModeList = [];//统计方式
                }
                if(chartName === 'HISTOGRAM' && newVal === 'pqc'){
                    this.hm_pqc_prodLine_Show = true;
                }else{
                    this.hm_pqc_prodLine_Show = false;
                }
                if(chartName === 'HISTOGRAM' && (newVal === 'oqc' || newVal === 'cc')){
                    this.hm_oqc_usn_Show = true;
                }else{
                    this.hm_oqc_usn_Show = false;
                }
                if(chartName === 'HISTOGRAM' && newVal === 'iqc' && business === 'abnormal_count'){//柱状图-->来料-->异常次数
                    this.statisticalModeList = conditionData.hm_iqc_ac
                }

                if(chartName === 'HISTOGRAM' && newVal === 'pqc' && business === 'acceptance_rate'){//柱状图-->过程-->允收率
                    this.statisticalModeList = conditionData.hm_pqc_ar
                }

                if(chartName === 'HISTOGRAM' && newVal === 'pqc' && business === 'abnormal_count'){//柱状图-->过程-->异常次数
                    this.statisticalModeList = conditionData.hm_pqc_ac
                }

                if(chartName === 'HISTOGRAM' && newVal === 'oqc' && business === 'abnormal_count'){//柱状图-->出货-->异常次数
                    this.statisticalModeList = conditionData.hm_oqc_ac
                }

                if(chartName === 'PIE_CHART' && newVal === 'iqc' && business === 'abnormal_count'){//饼状图--来料--异常次数
                    this.statisticalModeList = conditionData.pc_iqc_ac
                }

                if(chartName === 'PIE_CHART' && newVal === 'iqc' &&  (business === 'acceptance_rate' || business === 'return_rate' || business === 'bad_rate')){//饼状图--来料--允收率/批退率/不良率
                    this.statisticalModeList = conditionData.pc_iqc_ar
                }

                if(chartName === 'PIE_CHART' && newVal === 'pqc' && business === 'first_pass_yield'){//饼状图--过程--直通率
                    this.statisticalModeList = conditionData.pc_pqc_fpy
                }

                if(chartName === 'PIE_CHART' && newVal === 'pqc' && (business === 'acceptance_rate' || business === 'return_rate' || business === 'bad_rate')){//饼状图--过程--允收率/批退率/不良率
                    this.statisticalModeList = conditionData.pc_pqc_ar
                }

                if(chartName === 'PIE_CHART' && newVal === 'pqc' && business === 'abnormal_count'){//饼状图--过程--异常次数
                    this.statisticalModeList = conditionData.pc_pqc_ac
                }

                if(chartName === 'PIE_CHART' && newVal === 'oqc' && business === 'abnormal_count'){//饼状图--出货--异常次数
                    this.statisticalModeList = conditionData.pc_oqc_ac
                }
                if(chartName === 'PIE_CHART' && newVal === 'oqc' && (business === 'acceptance_rate' || newVal === 'return_rate' || newVal === 'bad_rate')){//饼状图--出货--允收率/批退率/不良率
                    this.statisticalModeList = conditionData.pc_oqc_all3
                }
                
                if((chartName === 'HISTOGRAM' || chartName === 'PIE_CHART' || chartName === 'TENDENCY_CHART' || chartName === 'PARETO_CHART') && newVal === 'iqc'){
                    this.hm_pqc_gys_Show = true;
                }else{
                    this.hm_pqc_gys_Show = false;
                }

                if((chartName === 'HISTOGRAM' || chartName === 'PIE_CHART' || chartName === 'TENDENCY_CHART' || chartName === 'PARETO_CHART') && (newVal === 'oqc' || newVal === 'cc')){
                    this.hm_gyx_xb_Show = false;
                }else{
                    this.hm_gyx_xb_Show = true;
                }

                if(chartName === 'CONTRAST_FIGURE' && newVal === 'iqc'){
                    this.cf_TypeNameShow = true;
                }else{
                    this.cf_TypeNameShow = false;
                }

                if(chartName === 'CONTRAST_FIGURE' && newVal === 'pqc'){
                    this.cf_all = true;
                }else{
                    this.cf_all = false;
                }

                if(chartName === 'CONTRAST_FIGURE' && newVal === 'oqc'){
                    this.cf_oqc_classNameShow = true;
                }else{
                    this.cf_oqc_classNameShow = false;
                }

                if(chartName === 'CONTRAST_FIGURE' && newVal === 'cc'){
                    this.cf_cc= true;
                }else{
                    this.cf_cc = false;
                }
                
                let byMethod = this.modelData.byMethod;
                if (byMethod === 'byProduct') {this.cf_cpbh = true}else{this.cf_cpbh = false;};//产品编号
                if (byMethod === 'byManufacturer') {this.cf_gysmc = true}else{this.cf_gysmc = false;};//供应商名称
                if (byMethod === 'byProductType') {this.cf_cplb = true}else{this.cf_cplb = false;};//产品类别
                if (byMethod === 'byCause') {this.cf_ycyy = true}else{this.cf_ycyy = false;};//异常原因
                if (byMethod === 'byHandle') {this.cf_clfs = true}else{this.cf_clfs = false;};//处理方式
                if (byMethod === 'byBatch') {this.cf_cpph = true}else{this.cf_cpph = false;};//产品批号
                if (byMethod === 'byCustomer') {this.cf_khmc = true}else{this.cf_khmc = false;};//客户名称
                if (byMethod === 'byClass') {this.cf_jybb = true}else{this.cf_jybb = false;};//检验班别
                if (byMethod === 'byInspector') {this.cf_jyy = true}else{this.cf_jyy = false;};//检验员
                if (byMethod === 'byProcess') {this.cf_gx = true}else{this.cf_gx = false;};//工序
                if (byMethod === 'byLine') {this.cf_xb = true}else{this.cf_xb = false;};//线别
            },
            //监听业务类型改变统计方式
            'modelData.business':function(newVal,oldVal){
                let chartName = this.modelData.chartName//统计图表
                let businessType = this.modelData.businessType//统计业务
                console.log(chartName,businessType,newVal);
                // alert(chartName+'-'+newVal+'-'+businessType)
                if(chartName === 'HISTOGRAM' && businessType === 'iqc' && newVal === 'abnormal_count'){//柱状图-->来料-->异常次数
                    this.statisticalModeList = conditionData.hm_iqc_ac
                }
                if(chartName === 'HISTOGRAM' && businessType === 'pqc' && newVal === 'acceptance_rate'){//柱状图-->过程-->允收率
                    this.statisticalModeList = conditionData.hm_pqc_ar
                }
                if(chartName === 'HISTOGRAM' && businessType === 'pqc' && newVal === 'abnormal_count'){//柱状图-->过程-->异常次数
                    this.statisticalModeList = conditionData.hm_pqc_ac
                }
                if(chartName === 'HISTOGRAM' && businessType === 'oqc' && newVal === 'abnormal_count'){//柱状图-->出货-->异常次数
                    this.statisticalModeList = conditionData.hm_oqc_ac
                }
                
                if(chartName === 'PIE_CHART' && businessType === 'iqc' && newVal === 'abnormal_count'){//饼状图--来料--异常次数
                    this.statisticalModeList = conditionData.pc_iqc_ac
                }

                if(chartName === 'PIE_CHART' && businessType === 'iqc' &&  (newVal === 'acceptance_rate' || newVal === 'return_rate' || newVal === 'bad_rate')){//饼状图--来料--允收率/批退率/不良率
                    this.statisticalModeList = conditionData.pc_iqc_ar
                }

                if(chartName === 'PIE_CHART' && businessType === 'pqc' && newVal === 'first_pass_yield'){//饼状图--过程--直通率
                    this.statisticalModeList = conditionData.pc_pqc_fpy
                }

                if(chartName === 'PIE_CHART' && businessType === 'pqc' && (newVal === 'acceptance_rate' || newVal === 'return_rate' || newVal === 'bad_rate')){//饼状图--过程--允收率/批退率/不良率
                    this.statisticalModeList = conditionData.pc_pqc_ar
                }

                if(chartName === 'PIE_CHART' && businessType === 'pqc' && newVal === 'abnormal_count'){//饼状图--过程--异常次数
                    this.statisticalModeList = conditionData.pc_pqc_ac
                }

                if(chartName === 'PIE_CHART' && businessType === 'oqc' && newVal === 'abnormal_count'){//饼状图--出货--异常次数
                    this.statisticalModeList = conditionData.pc_oqc_ac
                }
                if(chartName === 'PIE_CHART' && businessType === 'oqc' && (newVal === 'acceptance_rate' || newVal === 'return_rate' || newVal === 'bad_rate')){//饼状图--出货--允收率/批退率/不良率
                    this.statisticalModeList = conditionData.pc_oqc_all3
                }

            },
            //监听统计方式/对比变化
            'modelData.byMethod':function(newVal, oldVal){
                /*
                cf_cpbh:false,
                cf_gysmc:false,
                cf_cplb:false,
                cf_ycyy:false,
                cf_clfs:false,
                cf_cpph:false,
                cf_khmc:false,
                cf_jybb:false,
                cf_jyy:false,
                cf_gx:false,
                cf_xb:false, 
                */
                
                if (newVal === 'byProduct') {this.cf_cpbh = true}else{this.cf_cpbh = false;};//产品编号
                if (newVal === 'byManufacturer') {this.cf_gysmc = true}else{this.cf_gysmc = false;};//供应商名称
                if (newVal === 'byProductType') {this.cf_cplb = true}else{this.cf_cplb = false;};//产品类别
                if (newVal === 'byCause') {this.cf_ycyy = true}else{this.cf_ycyy = false;};//异常原因
                if (newVal === 'byHandle') {this.cf_clfs = true}else{this.cf_clfs = false;};//处理方式
                if (newVal === 'byBatch') {this.cf_cpph = true}else{this.cf_cpph = false;};//产品批号
                if (newVal === 'byCustomer') {this.cf_khmc = true}else{this.cf_khmc = false;};//客户名称
                if (newVal === 'byClass') {this.cf_jybb = true}else{this.cf_jybb = false;};//检验班别
                if (newVal === 'byInspector') {this.cf_jyy = true}else{this.cf_jyy = false;};//检验员
                if (newVal === 'byProcess') {this.cf_gx = true}else{this.cf_gx = false;};//工序
                if (newVal === 'byLine') {this.cf_xb = true}else{this.cf_xb = false;};//线别
            },
            // 监听父组件是否点击了保存按钮
            'whetherSave':function(newVal,oldVal){
                
                this.fatherSaveFun()
            }
        },
        computed: {
            winwidth:function(){
                let width = $('.iqis-page').width()
                console.log(width);
                return width;
            }
        },
        methods: {
            // + 按钮
            iconFun(e,name,no,n){
                this.kanbanStyleNo = no;
                this.itemSonN = n;
                this.modelShow = true;
                this.combinationNo = String(no)+String(n)
            },
            // modal按钮：保存
            modalSaveFun(){
                let that = this;
                that.modelShow = false;
                let Url = '';
                $('.i-'+this.combinationNo).css('display','none')
                this.dateIntervalFun()
                let n1 = '';
                let n2 = '';
                /* if(that.modelData.businessType === 'iqc') n1 = '来料';
                if(that.modelData.businessType === 'pqc') n1 = '过程';
                if(that.modelData.businessType === 'oqc') n1 = '出货';
                if(that.modelData.businessType === 'cc') n1 = '客诉'; */
                if(that.modelData.businessType === 'iqc') n1 = i18n.t("monitor.incoming");
                if(that.modelData.businessType === 'pqc') n1 = i18n.t("monitor._process");
                if(that.modelData.businessType === 'oqc') n1 = i18n.t("monitor.shipment");
                if(that.modelData.businessType === 'cc') n1 = i18n.t("monitor._customerComplaint");
                for(let i = 0; i < conditionData.businessArr.length; i++){
                    if(conditionData.businessArr[i] === this.modelData.business){
                        n2 = conditionData.businessTypeNameList[i]
                    }
                }
                let a = []
                let b = []
                //判断是那种图表的类型，（6中类型分别封装成方法），调取方法，将图表数据传过去包括div的id
                switch (that.modelData.chartName) {
                    case 'HISTOGRAM'://柱状图
                        $('.txt_'+this.combinationNo).text('【'+n1+n2+i18n.t('monitor.histogram')+'】')
                        this.chartname = '【'+n1+n2+ i18n.t('monitor.histogram')+'】'
                                                /* iqc oqc pqc cc */                  /*    业     务     类     型    */  /*   统    计    方    式   */                                                      /*  产       品       类      别      Id */    /*  产      品      编      号  Id  */  /* 供      应      商      名      称     Id */     /*   客    户    名    称    Id   */    /*  生     产     线    别   Id   */        /* 生      产      工      序      Id */
                        Url = "/diagram/report/"+that.modelData.businessType+"/dispatcher?business="+that.modelData.business+"&by="+that.modelData.byMethod+"&hourOffset=8&start="+that.start+"&end="+that.end+"&productTypeId="+that.modelData.productTypeId+"&productId="+that.modelData.productId+"&manufacturerId="+that.modelData.manufacturerId+"&customerId="+that.modelData.customerId+"&prodLineId="+that.modelData.prodLineId+"&prodProcessId="+that.modelData.prodProcessId;
                        that.echartNameList.push({resizeName:'histogramChart',funName:'histogerFun',combinationNo:that.combinationNo})
                        that.$http.get(Url).then(function(res){
                            $('.txt-'+that.combinationNo).css('display',"inline-block")
                            if(!res.data || !res.data.list){
                                a = ['-','-','-','-','-']
                                b = [0,0,0,0,0]
                                if(that.modelData.business === 'abnormal_count'){//动态调整y轴显示样式
                                    that.formatterValue = '{value}'
                                }else{
                                    that.formatterValue = '{value} %'
                                }
                                that.dataMax = 1
                            }else{
                                that.dataMax = 'dataMax'
                                let datalist = res.data.list
                                for (let i = 0; i < datalist.length; i++) {
                                    a.push(datalist[i].name)
                                    if(that.modelData.businessType === 'iqc' || that.modelData.businessType === 'pqc' || that.modelData.businessType === 'oqc'){
                                        if(that.modelData.business === 'first_pass_yield'){
                                            b.push(Number(datalist[i].fpy));
                                        }else{
                                            b.push(Number(datalist[i].rate));
                                        }
                                        if(that.modelData.business === 'abnormal_count'){//动态调整y轴显示样式
                                            that.formatterValue = '{value}'
                                        }else{
                                            that.formatterValue = '{value} %'
                                        }
                                    } else{
                                        b.push(Number(datalist[i].count));
                                        that.formatterValue = '{value}'
                                    } 
                                } 
                            }
                            window.addEventListener('resize', () => {
                                that.histogramChart.resize();  //此功能主要是做图表自适应
                            });
                            // histogerFun(xAxisData=[],seriesData=[],idName)
                            // 参数表示 xAxisData：xAxis的data；seriesData：series的data；idName：表示渲染图表的id名称后面的序号
                            that.histogerFun(a,b,that.combinationNo)
                        })
                        break;
                    case 'PIE_CHART'://饼状图    //调用 .resize()的对象名称  对应图表方法名称  div类名“-”后面的编号
                        $('.txt_'+this.combinationNo).text('【'+n1+n2+i18n.t("monitor.pie")+'】')
                        this.chartname = '【'+n1+n2+i18n.t("monitor.pie")+'】'
                        Url = "/diagram/report/"+that.modelData.businessType+"/dispatcher?business="+that.modelData.business+"&by="+that.modelData.byMethod+"&hourOffset=8&start="+that.start+"&end="+that.end+"&productTypeId="+that.modelData.productTypeId+"&productId="+that.modelData.productId+"&manufacturerId="+that.modelData.manufacturerId+"&customerId="+that.modelData.customerId+"&prodLineId="+that.modelData.prodLineId+"&prodProcessId="+that.modelData.prodProcessId;
                        that.echartNameList.push({resizeName:'pieChart',funName:'pieFun',combinationNo:that.combinationNo})
                        that.$http.get(Url).then(function(res){
                            $('.txt-'+that.combinationNo).css('display',"inline-block")
                            if(!res.data.list){
                                a = [{value:1,naem:'-'},{value:1,naem:'-'},,{value:1,naem:'-'},{value:1,naem:'-'},{value:1,naem:'-'}]
                                b = [{value:1,naem:'-'},{value:1,naem:'-'},,{value:1,naem:'-'},{value:1,naem:'-'},{value:1,naem:'-'}]
                            }else{
                                let datalist = res.data.list
                                for (let i = 0; i < datalist.length; i++) {
                                    a.push(datalist[i].name)
                                    if(that.modelData.businessType === 'pqc' && that.modelData.business === 'first_pass_yield'){
                                        b.push({value:datalist[i].fpy,name:datalist[i].name})
                                    }else if(that.modelData.businessType === 'cc' && that.modelData.business === 'customer_complaint_count'){
                                        b.push({value:datalist[i].count,name:datalist[i].name})
                                    }else{
                                         b.push({value:datalist[i].rate,name:datalist[i].name})
                                    }
                                }
                            }
                            window.addEventListener('resize', () => {
                                that.pieChart.resize();  // 多个图表，第一个图表
                                // this.homePie.resize();  // 多个图表，第二个图表
                            });
                            that.pieFun(a,b,that.combinationNo)
                        })
                        break;
                    case 'TENDENCY_CHART'://趋势图
                        $('.txt_'+this.combinationNo).text('【'+n1+n2+i18n.t('monitor.trend')+'】')
                        this.chartname = '【'+n1+n2+i18n.t('monitor.trend')+'】'
                        /* 
                            注意：缺少defectTypeId参数
                        */
                        Url = "/diagram/report/"+that.modelData.businessType+"/dispatcher?business="+that.modelData.business+"&by=byTime&hourOffset=8&start="+that.start+"&end="+that.end+"&productTypeId="+that.modelData.productTypeId+"&productId="+that.modelData.productId+"&manufacturerId="+that.modelData.manufacturerId+"&prodLineId="+that.modelData.prodLineId+"&prodProcessId="+that.modelData.prodProcessId+"&customerId="+that.modelData.customerId+"&defectTypeId=&inspectionTypeId="+that.modelData.inspectionTypeId
                        that.echartNameList.push({resizeName:'tendencyChart',funName:'tendencyFun',combinationNo:that.combinationNo})
                        that.$http.get(Url).then(function(res){
                            console.log(res,'趋势图');
                            $('.txt-'+that.combinationNo).css('display',"inline-block")
                            if(!res.data.list){
                                a = ['-','-','-','-','-']
                                b = [0,0,0,0,0]
                                if(that.modelData.business === 'defect' || that.modelData.business === 'abnormal_count'){//动态调整y轴显示样式
                                    that.qst_formatterValue = '{value}'
                                }else{
                                    that.qst_formatterValue = '{value} %'
                                }
                            }else{
                                if(that.modelData.business === 'defect' || that.modelData.business === 'abnormal_count'){//动态调整y轴显示样式
                                    that.qst_formatterValue = '{value}'
                                }else{
                                    that.qst_formatterValue = '{value} %'
                                }
                                let datalist = res.data.list
                                for (let i = 0; i < datalist.length; i++) {
                                    a.push(datalist[i].name)
                                    if(that.modelData.businessType !== 'pqc'){
                                        if(that.modelData.business === 'defect' || that.modelData.business === 'abnormal_count' || that.modelData.businessType === 'cc'){
                                            that.qst_formatterValue = '{value}'
                                            b.push(datalist[i].count)
                                        }else{
                                            that.qst_formatterValue = '{value}'
                                            b.push(datalist[i].rate)
                                        }
                                    }else{
                                        that.qst_formatterValue = '{value} %'
                                        b.push(datalist[i].fpy)
                                    }
                                }
                            }
                            
                            window.addEventListener('resize', () => {
                                that.tendencyChart.resize();  //此功能主要是做图表自适应
                            });
                            that.tendencyFun(a,b,that.combinationNo)
                        })
                        break;
                    case 'CONTRAST_FIGURE'://对比图
                        $('.txt_'+this.combinationNo).text('【'+n1+n2+i18n.t('monitor.contrastFigure')+'】')
                        this.chartname = '【'+n1+n2+i18n.t('monitor.contrastFigure')+'】'
                        that.echartNameList.push({resizeName:'areaChart',funName:'areaFun',combinationNo:that.combinationNo})
                        let params = {"business": that.modelData.business, "by": that.modelData.byMethod, hourOffset: 8, start: that.start, end: that.end};
                        let obj3 = $.extend({}, that.modelDat, that.modelDataList)
                        $.each(obj3, function (key, value) {
                            params[key] = value ? value : '';
                        })
                        // Url="/diagram/report/"+that.modelData.businessType+"/collation,"+params
                        let arr = JSON.stringify(params)
                        Url=that.modelData.businessType+"-"+arr
                        // return false;
                        that.$http.get("/diagram/report/" + that.modelData.businessType + "/collation", {params}).then(function(res){
                            $('.txt-'+that.combinationNo).css('display',"inline-block")
                            console.log(res,'resresresresresresresres');
                            //  return false;
                            if(res.data){
                                 /* {
                                    name:'联盟广告',
                                    type:'line',
                                    stack: '总量',
                                    data:[220, 182, 191, 234, 290, 330, 310]
                                }, */
                                let datalist = res.data
                                a = datalist
                            }
                            
                            /* alert(1)
                            console.log(a);
                            console.log(b);
                            alert(2) */
                            window.addEventListener('resize', () => {
                                that.areaChart.resize();  //此功能主要是做图表自适应
                            });
                            that.areaFun(a,b,that.combinationNo)
                        })
                        break;
                    case 'PARETO_CHART'://排列图
                        $('.txt_'+this.combinationNo).text('【'+n1+n2+i18n.t("monitor.pareto")+'】')
                        this.chartname = '【'+n1+n2+i18n.t("monitor.pareto")+'】'
                        /* 
                            注意缺少defectTypeId
                        */
                        Url = "/diagram/report/"+that.modelData.businessType+"/dispatcher?business=defect&by=byDefect&hourOffset=8&start="+that.start+"&end="+that.end+"&productTypeId="+that.modelData.productTypeId+"&productId="+that.modelData.productId+"&manufacturerId="+that.modelData.manufacturerId+"&prodLineId="+that.modelData.prodLineId+"&prodProcessId="+that.modelData.prodProcessId+"&customerId="+that.modelData.customerId+"&defectTypeId=&inspectionTypeId="+that.modelData.inspectionTypeId
                        that.echartNameList.push({resizeName:'paretoChart',funName:'paretoFun',combinationNo:that.combinationNo})
                        that.$http.get(Url).then(function(res){
                            console.log(res,'排列图');
                            $('.txt-'+that.combinationNo).css('display',"inline-block")
                            let dataList = res.data.list
                            for(let i = 0; i < dataList.length; i++){
                                a.push(dataList[i].name)
                                b.push(dataList[i].count)
                            }
                            window.addEventListener('resize',() => {
                                that.paretoChart.resize()
                            })
                            that.paretoFun(a,b,that.combinationNo)
                        })
                        break;
                    case 'SPC'://控制图
                        that.echartNameList.push({resizeName:'controlChart',funName:'controlFun',combinationNo:that.combinationNo})
                        that.controlFun(a,b,that.combinationNo)
                        break;
                    default:
                        break;
                }
                // that.modelData.name = '【'+n1+n2+'柱状图'+'】'
                that.modelData.name = this.chartname
                that.modelData.url = Url
                that.modelData.combinationNo = that.combinationNo;
                let data = new Object();
                data = that.modelData;
                that.kanbanInfo.boardDetailDtos.push(JSON.parse(JSON.stringify(data)))//解决引用类型赋值问题！
                $(".txt-date"+this.combinationNo).text(i18n.t('monitor.dateRange')+"："+this.dateIntervalFun())
                console.log(that.kanbanInfo.boardDetailDtos,"that.kanbanInfo.boardDetailDtos");
            },
            // 获取前后几个月的日期
            Month(month) {
                var time = new Date();
                time.setDate(time.getDate());//获取Day天后的日期 
                var y = time.getFullYear();
                var m;
                if (time.getMonth() + month + 1>12){
                    y = y+1;
                    m = time.getMonth() + month - 11;//获取当前月份的日期 d
                }else{
                    m = time.getMonth() + month + 1;//获取当前月份的日期 d
                }
                var d = time.getDate();
                return y + "-" + m + "-" + d +" "+"00:00:00";
            },
            //计算日期区间
            dateIntervalFun(){
                let startDate = '';
                let dateClosed = '';
                let start = '';
                let closed = '';
                let dates = '';
                if(this.modelData.timeInterval === '1'){//当天
                    // 获得指定日期之前几天的开始时间 getDayStart(day)
                    start = this.$iqis.utils.getDayStart(1);
                    closed = this.$iqis.utils.getDayStart(0);
                    console.log(new Date(start),"---",new Date(closed-1));
                    this.start = new Date(start).getTime()
                    this.end = new Date(closed-1).getTime()
                    startDate = new Date(start).Format('yyyy-MM-dd hh:mm:ss')
                    dateClosed = new Date(closed-1).Format('yyyy-MM-dd hh:mm:ss')
                    dates = startDate+" ~ "+dateClosed;
                }
                if(this.modelData.timeInterval === '2'){//昨天
                    start = this.$iqis.utils.getDayStart(2);
                    closed = this.$iqis.utils.getDayStart(1);
                    this.start = new Date(start).getTime()
                    this.end = new Date(closed-1).getTime()
                    startDate = new Date(start).Format('yyyy-MM-dd hh:mm:ss')
                    dateClosed = new Date(closed-1).Format('yyyy-MM-dd hh:mm:ss')
                    dates = startDate+" ~ "+dateClosed;
                }
                if(this.modelData.timeInterval === '3'){//近七天
                    start = this.$iqis.utils.getDayStart(7);
                    closed = this.$iqis.utils.getDayStart(0);
                    this.start = new Date(start).getTime()
                    this.end = new Date(closed-1).getTime()
                    startDate = new Date(start).Format('yyyy-MM-dd hh:mm:ss')
                    dateClosed = new Date(closed-1).Format('yyyy-MM-dd hh:mm:ss')
                    dates = startDate+" ~ "+dateClosed;
                }
                if(this.modelData.timeInterval === '4'){//近三十天
                    start = this.$iqis.utils.getDayStart(30);
                    closed = this.$iqis.utils.getDayStart(0);
                    this.start = new Date(start).getTime()
                    this.end = new Date(closed-1).getTime()
                    startDate = new Date(start).Format('yyyy-MM-dd hh:mm:ss')
                    dateClosed = new Date(closed-1).Format('yyyy-MM-dd hh:mm:ss')
                    dates = startDate+" ~ "+dateClosed;
                }
                if(this.modelData.timeInterval === '5'){//近三个月
                    closed = this.$iqis.utils.getDayStart(0);
                    dateClosed = new Date(closed-1).Format('yyyy-MM-dd hh:mm:ss')

                    let date = new Date();
                    let d = date.setMonth(date.getMonth()-3);

                    //此操作将拼接好的日期格式转化后传给后台
                    let a = new Date(d).Format('yyyy/MM/dd')+" 00:00:00"
                    this.start = new Date(a).getTime()
                    this.end = new Date(closed-1).getTime()
                    // alert(this.start+"---"+this.end)
                    d = new Date(d).Format('yyyy-MM-dd')+" 00:00:00"
                    dates = d +" ~ "+dateClosed
                }
                if(this.modelData.timeInterval === '6'){//近六个月
                    closed = this.$iqis.utils.getDayStart(0);
                    dateClosed = new Date(closed-1).Format('yyyy-MM-dd hh:mm:ss')

                    let date = new Date();
                    let d = date.setMonth(date.getMonth()-6);

                    //此操作将拼接好的日期格式转化后传给后台
                    let a = new Date(d).Format('yyyy/MM/dd')+" 00:00:00"
                    this.start = new Date(a).getTime()
                    this.end = new Date(closed-1).getTime()


                    d = new Date(d).Format('yyyy-MM-dd')+" 00:00:00"
                    dates = d +" ~ "+dateClosed
                }
                if(this.modelData.timeInterval === '7'){//近十二个月
                    closed = this.$iqis.utils.getDayStart(0);
                    dateClosed = new Date(closed-1).Format('yyyy-MM-dd hh:mm:ss')

                    let date = new Date();
                    let d = date.setMonth(date.getMonth()-12);

                    //此操作将拼接好的日期格式转化后传给后台
                    let a = new Date(d).Format('yyyy/MM/dd')+" 00:00:00"
                    this.start = new Date(a).getTime()
                    this.end = new Date(closed-1).getTime()


                    d = new Date(d).Format('yyyy-MM-dd')+" 00:00:00"
                    dates = d +" ~ "+dateClosed
                }
                return dates;
            },
            // modal按钮：重置
            modalResetFun(){
                //  console.log(this.dateIntervalFun());
                //  this.handleHelp()
                // $('.i-'+this.combinationNo).show()
            },
            handleHelp () {
                
                const {href} = this.$router.resolve({ 
                name: 'kanban',
                }); 
                window.open(href, '_blank');
            },
            // modal按钮：取消
            modalCancelFun(){
                if(!this.isShow && this.kanbanInfo.boardDetailDtos.length != 0){
                    $('.i-'+this.combinationNo).hide()
                }else{
                    $('.i-'+this.combinationNo).show()
                }
                // a表示类名为' .kanbna-a'后面的a（即序号）
                let a = this.kanbanStyleNo
                // b同上 ‘ .item-son-b’
                let b = this.itemSonN
                this.modelShow = false;
            },
            // modal 修改按钮
            modification(isShow,nomber1){
                let that = this;
                that.isShow = isShow
                /* let name = that.oldValChartName;
                    try {
                        that[name]()//先传入空数据，渲染图表
                        that[name].dispose()
                    } catch (error) {
                        
                    } */
                that.modelShow = true;
                that.combinationNo = nomber1
                
            },
            //父组件中点击保存按钮时执行此方法
            fatherSaveFun(){
                console.log(this.kanbanList,'kanbanList');
                let that = this;
                // 父组件相关数据
                that.kanbanInfo.boardName = that.kanbanList.boardName;//看板名称
                that.kanbanInfo.boardNo = that.kanbanList.boardNo;//看板编号
                that.kanbanInfo.boardTypeId = that.kanbanList.boardTypeId;//看板类别
                that.kanbanInfo.operationId = that.kanbanList.operationId;//操作人
                that.kanbanInfo.operationTime = (new Date()).getTime();//操作时间
                that.kanbanInfo.remark = that.kanbanList.remark;//备注
                that.kanbanInfo.style =that.kanbanList.style;//看板样式按钮序号
                // that.kanbanInfo.combinationNo = this.combinationNo;
                if(!that.kanbanInfo.boardNo){
                    that.$Notice.warning({title:i18n.t('monitor.numCannotBeEmpty')})
                    return false;
                }
                if(!that.kanbanInfo.boardName){
                    that.$Notice.warning({title:i18n.t('monitor.nameCannotBeEmpty')})
                    return false;
                }
                if(!that.kanbanInfo.boardTypeId){
                    that.$Notice.warning({title:i18n.t('monitor.categoryCannotBeEmpty')})
                    return false;
                }
                if(that.kanbanInfo.boardDetailDtos.length == 0){
                    that.$Notice.warning({title:i18n.t('monitor.addKanbanStyles')})
                    return false;
                }
                if(that.kanbanList.style === null){
                    that.kanbanList.style = 1;
                }
                let dataInfo = that.kanbanInfo
                if(that.sign == 1){//{{$t('monitor.modify')}}
                    that.$http.put('/board',dataInfo,that.headers).then((res) => {
                       console.log(res);
                       that.$emit("close")
                    })
                }else{//新增
                    that.$http.post('/board',dataInfo,that.headers).then(function(res){
                        that.$emit("close")
                        // that.$Message.success("保存成功");
                        // that.$emit("open-tab","monitoring-center-quality-Kanban","质量看板","page-monitor-quality-Kanban-list",'');

                    })
                }
            },
            // 柱状图
            histogerFun(xAxisData=[],seriesData=[],idName = ''){
                console.log(idName,'idName');
                
                if(idName){
                    
                    this.histogramChart = echart.init(this.$refs['chart'+idName]); 
                    this.histogramoption = {
                        tooltip: {},
                        grid: {
                            left: '10px',
                            right: '0px',
                            bottom: '5px',
                            top: '10px',
                            containLabel: true
                        },
                        xAxis: {
                            type:'category',
                            data:xAxisData,
                        },
                        yAxis: {
                            max:this.dataMax,
                            axisLabel:{    //刻度标签的内容格式器，支持字符串模板和回调函数两种形式。
                                formatter:this.formatterValue
                            },
                        },
                        series: [{
                            type: 'bar',
                            barMaxWidth:50,//柱条的最大宽度，不设时自适应。支持设置成相对于类目宽度的百分比。
                            //配置样式
                            itemStyle: {
                            //通常情况下:
                            normal: {
                                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                    color: function (params) {
                                        return reportConfig.colorList[params.dataIndex % reportConfig.colorList.length];
                                    }
                                }
                            },
                            data:seriesData
                        }]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    this.histogramChart.clear();//此方法作用是在重新渲染画布时,清空上一次绘制的画布,避免画布错乱!
                    this.histogramChart.setOption(this.histogramoption);
                    window.addEventListener('resize', () => {
                        this.histogramChart.resize();  // 多个图表，第一个图表
                        // this.homePie.resize();  // 多个图表，第二个图表
                    });
                }
            },
            //饼图
            pieFun(xAxisData=[],seriesData=[],idName = ''){
                if(idName){
                    this.pieChart = echart.init(this.$refs['chart'+idName]); 
                    this.picoption = {
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)",
                            show: true
                        },
                        legend: {
                            type: 'scroll',
                            orient: 'vertical',
                            right: 10,
                            top: 20,
                            bottom: 20,
                            formatter: function (name) {//自定义图形图例文字太长的问题
                                if (!name) return '';
                                if (name.length > 9) {
                                    name =  name.slice(0,9) + '...';
                                }
                                return name;
                            },
                            data: xAxisData,
                        },
                        series : [
                            {
                                // name: '占比',
                                type: 'pie',
                                radius : '55%',
                                center: ['40%', '50%'],
                                data: seriesData,
                                //配置样式
                                itemStyle: {
                                //通常情况下:
                                normal: {
                                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                    color: function (params) {
                                        return reportConfig.colorList[params.dataIndex % reportConfig.colorList.length];
                                        }
                                    }
                                },
                            }
                        ],
                        /* series: [{
                            name: '销量',
                            type: 'bar',
                            barMaxWidth:50,//柱条的最大宽度，不设时自适应。支持设置成相对于类目宽度的百分比。
                            //配置样式
                            itemStyle: {
                            //通常情况下:
                            normal: {
                                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                    color: function (params) {
                                        return reportConfig.colorList[params.dataIndex % reportConfig.colorList.length];
                                    }
                                }
                            },
                            data:seriesData
                        }] */
                    };
                    this.pieChart.clear();
                    // 使用刚指定的配置项和数据显示图表。
                    this.pieChart.setOption(this.picoption);
                        window.addEventListener('resize', () => {
                        this.pieChart.resize();  // 多个图表，第一个图表
                        // this.homePie.resize();  // 多个图表，第二个图表
                    });
                }
            },
            //趋势图
            tendencyFun(xAxisData=[],seriesData=[],idName = ''){
                if(idName){
                    this.tendencyChart = echart.init(this.$refs['chart'+idName]); 
                    this.tendencyoption = {
                        tooltip: {},
                        grid: {
                            left: '0px',
                            right: '0px',
                            bottom: '5px',
                            top: '10px',
                            containLabel: true
                        },
                        xAxis: {
                            type:'category',
                            // data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                            data:xAxisData,
                        },
                        yAxis: {
                            max:"dataMax",
                            axisLabel:{    //刻度标签的内容格式器，支持字符串模板和回调函数两种形式。
                                formatter:this.qst_formatterValue
                            },
                        },
                        series: [{
                            // name: 'O(∩_∩)O哈哈~',
                            type: 'line',//趋势图（折线）
                            color:'#418FEE',
                            // barMaxWidth:50,//柱条的最大宽度，不设时自适应。支持设置成相对于类目宽度的百分比。
                            data:seriesData
                        }]
                    };
                    this.tendencyChart.clear();
                    // 使用刚指定的配置项和数据显示图表。
                    this.tendencyChart.setOption(this.tendencyoption);
                    window.addEventListener('resize', () => {
                        this.tendencyChart.resize();  // 多个图表，第一个图表
                        // this.homePie.resize();  // 多个图表，第二个图表
                    });
                }
            },
            //对比图
            areaFun(xAxisData=[],seriesData=[],idName = ''){
                let that = this;
                if(idName){
                    let c = [];
                    this.areaChart = echart.init(this.$refs['chart'+idName]); 

                    var xLabels = [];
                    var series = [];
                    var minY = 100;
                    var pac_totalCount = 0;
                    var pac_totalBad = 0;
                    var initLabelFlag = false;
                    $(xAxisData).each(function (index, dataItem) {
                    if (!initLabelFlag) {
                        initLabelFlag = true;
                        for (var i = 0; i < dataItem.list.length; i++) {
                        xLabels.push(dataItem.list[i].date);
                        }
                    }
                    pac_totalCount += dataItem.count;
                    pac_totalBad += dataItem.bad;

                    var lineSeries = {
                        name: dataItem.name,
                        type: 'line',
                        data: []
                    };
                    for (var j = 0; j < dataItem.list.length; j++) {
                        var fpy = dataItem.list[j].dataList;
                        if (fpy != 0) {
                        minY = Math.min(fpy, minY);
                        // alert(minY)
                        }
                        if (fpy < 0) {
                        fpy = 0;
                        }
                        lineSeries.data.push(fpy);

                    }
                    series.push(lineSeries);
                    });
                    if (minY == 100) {
                    minY = 0;
                    } else {
                    minY = Math.floor(minY / 10.0) * 10 - 10;
                    minY = Math.max(0, minY);
                    }

                    $(series).each(function (a, b) {
                    for (var i = 0; i < b.data.length; i++) {
                        if (b.data[i] == 0) {
                        b.data[i] = minY;
                        }
                    }
                    });
                    this.areaoption = {
                        /* tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data:xAxisData
                        },
                        grid: {
                            left: '0px',
                            right: '10px',
                            bottom: '5px',
                            top: '10px',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: c
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: seriesData */
                        tooltip: {
                            trigger: 'axis',
                            formatter: function (params, ticket, callback) {
                            var showHtm = "";
                            for (var i = 0; i < params.length; i++) {
                                //x轴名称
                                var name = params[i].axisValueLabel;
                                //名称
                                var text = params[i].seriesName;
                                //值
                                var value = params[i].data;
                                
                                if(value > 100){
                                value = '100.00'
                                }

                                if (i == 0) {
                                showHtm += name + '<br />';
                                }
                                if (value == minY) {
                                showHtm += text + ' ： 0<br />';
                                } else {
                                if(that.modelData.business == 'abnormal_count' || that.modelData.businessType == 'cc'){
                                    showHtm += text + ' ： ' + value + '<br />';
                                }else{
                                showHtm += text + ' ： ' + value + '%' + '<br />';
                                }
                                }


                            }
                            return showHtm;
                            }
                        }//'{b}<br/>{a}:{c}%'
                        ,
                        grid: {
                            left: '15px',
                            right: '45px',
                            bottom: '3px',
                            top: '55px',
                            containLabel: true
                        },
                        legend: {
                            type: 'scroll',
                            orient: 'horizontal',
                            left: 10,
                            right: 10,
                            top: 10
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: xLabels
                        },
                        yAxis: {
                            type: 'value',
                            scale: true,
                            min: minY,
                            max: 100,
                            axisLabel: {
                            formatter: function (value, index) {
                                if(that.modelData.business == 'abnormal_count' || that.modelData.businessType == 'cc'){
                                if (index == 0) {
                                    return 0;
                                } else {
                                    return value;
                                }
                                }else{
                                if (index == 0) {
                                    return "0%";
                                } else {
                                    return value + '%';
                                }
                                }
                                
                            }
                            }
                        },
                        // color: pieColorList,
                        series: series
                    };
                    this.areaChart.clear();
                    // 使用刚指定的配置项和数据显示图表。
                    this.areaChart.setOption(this.areaoption);
                    window.addEventListener('resize', () => {
                        this.areaChart.resize();
                    });
                }
            },
            //排列图
            paretoFun(xAxisData=[],seriesData=[],idName = ''){
                console.log(xAxisData,'xAxisData');
                console.log(seriesData,'seriesData');
                
                /* seriesData.sort(function(a,b){
                    return b-a;
                }) */
                // 计算总数
                let data2  = []
                let total = 0
                let growing = 0
                for (let i = 0; i < seriesData.length; i++) {
                    total += seriesData[i]
                }
                for (let i = 0; i < seriesData.length; i++) {
                    growing += seriesData[i]
                    let d2 = growing / total * 100
                    // d2 = d2.format("0.00")
                    data2.push(d2.toFixed(2))
                }
                if(idName){
                    this.paretoChart = echart.init(this.$refs['chart'+idName]); 
                    this.paretooption = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        grid: {
                            left: '0px',
                            right: '0px',
                            bottom: '1px',
                            top: '10px',
                            containLabel: true
                        },
                        xAxis: {
                            type:'category',
                            /* axisLabel: {
                                interval: 0,
                                rotate: 45
                            }, */
                            // data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                            data:xAxisData,
                        },
                        yAxis: [{
                            type: 'value',
                            /* interval: total_defect / 10.0, */
                            /* axisLabel: {
                            formatter: function (value, index) {
                                if (total_defect > 200) {
                                return parseInt(value + "");
                                }
                                return Math.round(value * 10) / 10;
                            }
                            }, */
                            splitLine: {
                            show: false
                            },
                            max: 'dataMax'
                        },
                            {
                            type: 'value',
                            max: 100,
                            // position: 'right',
                            interval: 10,
                            axisLabel: {
                                formatter:'{value} %'
                            }
                            }
                        ],
                        /* yAxis: {
                            // max:"dataMax",
                            axisLabel:{    //刻度标签的内容格式器，支持字符串模板和回调函数两种形式。
                                formatter:'{value} %'
                            },
                        }, */
                        series: [{
                            // name: '销量',
                            type: 'bar',
                            barMaxWidth:50,//柱条的最大宽度，不设时自适应。支持设置成相对于类目宽度的百分比。
                            //配置样式
                            itemStyle: {
                            //通常情况下:
                            normal: {
                                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                    color: function (params) {
                                        return reportConfig.colorList[params.dataIndex % reportConfig.colorList.length];
                                    }
                                }
                            },
                            data:seriesData
                        },{
                            // name: '%%',
                            yAxisIndex: 1,
                            type: 'line',
                            color:'#418FEE',
                            data: data2
                        }]
                    };
                    this.paretoChart.clear();
                    // 使用刚指定的配置项和数据显示图表。
                    this.paretoChart.setOption(this.paretooption);
                    window.addEventListener('resize', () => {
                        this.paretoChart.resize();
                    });
                }
            },
            controlFun(xAxisData=[],seriesData=[],idName = ''){

            },

        }
    }
</script>

<style scoped>
    /* @media only screen and (min-width: 320px){
        html {
            font-size: 62.5% !important;
        }
    }
    @media only screen and (min-width: 640px){
        html {
            font-size: 150% !important;
        }
    }
    @media only screen and (min-width: 750px){
        html {
            font-size: 187.5% !important;
        }
    }
    @media only screen and (min-width: 1242px){
        html {
            font-size: 200% !important;
        }
    } */
      .iqis-header{
        flex:0 0 48px;
        height: 48px;
        background: #418FEE;
    }
    .iqis-header-item-left{
        float: left;
    }
    .date-style{
        float: right;
        display: block;
        height: 48px;
        line-height: 48px;
        font-size: 24px;
        color: #fff;
        font-weight: bold;
    }
    .text-all{
        /* font-size: 1.2rem; */
        width: 100%;
        text-align: center;
        display: grid;
        grid-template-rows: 1fr 30px 30px; 
        font-family:MicrosoftYaHei;
    }
    .txt{
        width: 100%;
        font-size: 0.8rem;
        position: relative;
        color: #333;
    }
    .txt-son-btn{
        position: absolute;
        top: 10px;
        right: 0;
    }
    .txt-date{
        width: 100%;
        /* border: 1px solid #e9e9e9; */
        line-height: 30px;
    }
    .txt-tex{
        border: 1px solid #e9e9e9;
        text-align: left;
        line-height: 30px;

    }
    .margintop20{
        margin-top: 20px;
    }
    .autoXY{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .autoXY i{
        color: rgb(201, 201, 201);
    }
    .autoXY i:hover{
        color: rgb(65, 143, 238);
        cursor: pointer;
    }
    .kanban-1{
        display: grid;
        width: 100%;
    }
    .padding-0-10{
        padding: 0 10px;
    }
    /* .kanban-son-1{
        padding: 0 10px;
    } */
    .borderStyle{
        border: 1px solid #e9e9e9;
    }
    .kanban-2{
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 25px;
    }
    .kanban-3{
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-rows: 1fr 1fr;
        grid-row-gap: 25px;
    }
    .kanban-4{
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
        grid-row-gap: 25px;
        grid-column-gap: 25px;
    }
    .kanban-4 .item-son-1{
        grid-column-start: 1;
        grid-column-end: 3;
    }
    .kanban-5{
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
        grid-row-gap: 25px;
        grid-column-gap: 25px;
    }
    .kanban-5 .item-son-3{
        grid-column-start: 1;
        grid-column-end: 3;
    }
    .kanban-6{
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
        grid-row-gap: 25px;
        grid-column-gap: 25px;
    }
    .kanban-6 .item-son-1{
        grid-row-start: 1;
        grid-row-end: 3;
    }
    .kanban-7{
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
        grid-row-gap: 25px;
        grid-column-gap: 25px;
    }
    .kanban-7 .item-son-3{
        grid-column-start: 2;
        grid-column-end: 3;
        grid-row-start: 1;
        grid-row-end: 3;
    }
    .kanban-8{
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-column-gap: 25px;
        grid-row-gap: 25px;
    }
    .kanban-9{
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-column-gap: 25px;
        grid-row-gap: 25px;
    }
    .kanban-10{
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        grid-column-gap: 25px;
        grid-row-gap: 25px;
    }
    .txt-11,.txt-21,.txt-22,.txt-31,.txt-32,.txt-41,.txt-42,.txt-43,.txt-51,.txt-52,.txt-53,.txt-61,.txt-62,.txt-63,.txt-71,.txt-72,.txt-73,.txt-81,.txt-82,.txt-83,.txt-84,.txt-91,.txt-92,.txt-93,.txt-94,.txt-95,.txt-96,.txt-101,.txt-102,.txt-103,.txt-104,.txt-105,.txt-106{
        width: 100%;
        height: 100%;
        display: none;
    }

    
</style>