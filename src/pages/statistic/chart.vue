<template>
    <div id="spcChart">
        <Tabs value="spcType1" style="width:100%;">
            <TabPane :label="i18n.t('statistical.meanChart')" name="spcType1">
                <div id="firstControlChart" style="width:100%;height:400px"></div>
            </TabPane>
            <TabPane :label="analysisData.chartType=='IMR'?i18n.t('statistical.MovingRange'):analysisData.chartType=='XR'?i18n.t('statistical.rangeChart'):i18n.t('statistical.stdevChart')" name="spcType2">
                <div id="secondControlChart" style="width:100%;height:400px"></div>
            </TabPane>
            <TabPane :label="i18n.t('statistical.cpkAnalysisChart')" name="spcType3">
                <div style="display:flex;">
                    <div id="CPK" style="flex:2;height:400px"></div>
                    <Row id="cpkNote" style="flex:3;height:400px" :gutter="24">
                        <Col span="6">
                            <Card dis-hover>
                                <p slot="title">{{$t('statistical.statisticalValue')}}</p>
                                <p>{{$t('statistical.sampleNum')}}:{{cpk.sampleNum}}</p>
                                <p>{{$t('statistical.average')}}:{{cpk.avgs}}</p>
                                <p>{{$t('statistical.maximum')}}:{{cpk.max}}</p>
                                <p>{{$t('statistical.minimum')}}:{{cpk.min}}</p>
                            </Card>
                        </Col>
                        <Col span="6">
                            <Card dis-hover>
                                <p slot="title">{{$t('statistical.constant')}}</p>
                                <p>{{$t('statistical.subgroupSize')}}:{{cpk.groupSize}}</p>
                                <p>{{$t('statistical.usl')}}:{{cpk.usl}}</p>
                                <p>{{$t('statistical.targetValue')}}:{{cpk.target}}</p>
                                <p>{{$t('statistical.lsl')}}:{{cpk.lsl}}</p>
                            </Card>
                        </Col>
                        <Col span="12">
                            <Card dis-hover style="height:133px;">
                                <p slot="title">{{$t('statistical.calculatedValue')}}</p>
                                <Row>
                                    <Col span="12">{{$t('statistical.stdevGroup')}}:{{cpk.groupStdeva}}</Col>
                                    <Col span="12">{{$t('statistical.stdevInGroup')}}:{{cpk.inGroupStdeva}}</Col>
                                </Row>
                                <p>{{$t('statistical.stdevWhole')}}:{{cpk.wholeStdeva}}</p>
                                <Row>
                                    <Col span="12">{{$t('statistical.positiveTripleStdev')}}:{{cpk.plus3stdeva}}</Col>
                                    <Col span="12">{{$t('statistical.negativeTripleStdev')}}:{{cpk.minus3stdeva}}</Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span="10">
                            <Card dis-hover>
                                <p slot="title">{{$t('statistical.processCapabilityInGroup')}}</p>
                                <Row>
                                    <Col span="12">CPK：{{cpk.cpk}}</Col>
                                    <Col span="12">CP：{{cpk.cp}}</Col>
                                </Row>
                                <Row>
                                    <Col span="12">CPL：{{cpk.cpl}}</Col>
                                    <Col span="12">CPU：{{cpk.cpu}}</Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span="10">
                            <Card dis-hover>
                                <p slot="title">{{$t('statistical.processCapabilityWhole')}}</p>
                                <Row>
                                    <Col span="12">PPK：{{cpk.ppk}}</Col>
                                    <Col span="12">PP：{{cpk.pp}}</Col>
                                </Row>
                                <Row>
                                    <Col span="12">PPL：{{cpk.ppl}}</Col>
                                    <Col span="12">PPU：{{cpk.ppu}}</Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span="4">
                            <Card dis-hover style="height:89px;">
                                <p slot="title">{{$t('statistical.otherValues')}}</p>
                                <p>CA：{{cpk.ca}}</p>
                            </Card>
                        </Col>
                        <Col span="8">
                            <Card dis-hover>
                                <p slot="title">{{$t('statistical.measuredPerformance')}}</p>
                                <p>PPM&lt;LSL：{{cpk.actualLsl}}</p>
                                <p>PPM&gt;USL：{{cpk.actualUsl}}</p>
                                <p>PPM Total：{{cpk.actualTotal}}</p>
                            </Card>
                        </Col>
                        <Col span="8">
                            <Card dis-hover>
                                <p slot="title">{{$t('statistical.expectedPerformanceInGroup')}}</p>
                                <p>PPM&lt;LSL：{{cpk.groupLsl}}</p>
                                <p>PPM&gt;USL：{{cpk.groupUsl}}</p>
                                <p>PPM Total：{{cpk.groupTotal}}</p>
                            </Card>
                        </Col>
                        <Col span="8">
                            <Card dis-hover>
                                <p slot="title">{{$t('statistical.expectedPerformanceWhole')}}</p>
                                <p>PPM&lt;LSL：{{cpk.wholeLsl}}</p>
                                <p>PPM&gt;USL：{{cpk.wholeUsl}}</p>
                                <p>PPM Total：{{cpk.wholeTotal}}</p>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </TabPane>
            <TabPane :label="i18n.t('statistical.sampleRun')" name="spcType4">
                <div id="sampleRunChart" style="width:100%;height:400px"></div>
            </TabPane>
            <TabPane :label="i18n.t('statistical.avgRun')" name="spcType5">
                <div id="avgRunChart" style="width:100%;height:400px"></div>
            </TabPane>
            <TabPane :label="i18n.t('statistical.passRateRun')" name="spcType7">
                <div id="passRateRunChart" style="width:100%;height:400px"></div>
            </TabPane>
        </Tabs>
        <div id="chartNote" class = "chartNote" style="text-align:center;color:#999;position:relative;top:-35px;">
            <span>Total:</span><em>{{chartNote.Total}}</em>
            <span>SampleSize:</span><em>{{chartNote.GroupSize}}</em>
            <span>Group:</span><em>{{chartNote.Group}}</em>
            <span>Max:</span><em>{{chartNote.Max}}</em>
            <span>Min:</span><em>{{chartNote.Min}}</em>
            <span>Mean:</span><em>{{chartNote.X_Avgs}}</em>
            <span>Dev:</span><em>{{chartNote.S_Avgs}}</em>
            <span>CPK:</span><em>{{chartNote.Cpk}}</em>
            <span>PPK:</span><em>{{chartNote.Ppk}}</em>
            <span>Ca:</span><em>{{chartNote.Ca}}</em>
            <span>Cp:</span><em>{{chartNote.Cp}}</em>
            <span>Pp:</span><em>{{chartNote.Pp}}</em>
        </div>
        <Table id="chartTable" v-drag-table-column="tableColumn" border stripe :data="tableData" :columns="tableColumn"></Table>
    </div>

</template>
<script>
    import $ from "jquery"
    // import echarts from 'echarts';因本页面统计图为echarts2.0版本所绘，遂在index.html页面引用2.0版本，此处不需要引用
    import ecStat from "echarts-stat";
    import Highcharts from 'highcharts/highstock';
    //必须有下面两行，才能实现cpk的直方图
    import HistogramBellcurve from 'highcharts/modules/histogram-bellcurve';
    HistogramBellcurve(Highcharts)

    export default {
        props:['parent','newDate'], 
        data(){
            return {
                i18n:window.i18n,
                data:[],
                calculationParameters:[
                    { "GroupSize": 2, "A1": 2.659, "A2": 1.88, "B3": 0.0, "B4": 3.267, "D3": 0.0, "D4": 3.267, "d2": 1.128, "c4": 0.7979 },
                    { "GroupSize": 3, "A1": 1.954, "A2": 1.023, "B3": 0.0, "B4": 2.568, "D3": 0.0, "D4": 2.575, "d2": 1.693, "c4": 0.8862 },
                    { "GroupSize": 4, "A1": 1.628, "A2": 0.729, "B3": 0.0, "B4": 2.266, "D3": 0.0, "D4": 2.282, "d2": 2.059, "c4": 0.9213 },
                    { "GroupSize": 5, "A1": 1.427, "A2": 0.577, "B3": 0.0, "B4": 2.089, "D3": 0.0, "D4": 2.115, "d2": 2.326, "c4": 0.9400 },
                    { "GroupSize": 6, "A1": 1.287, "A2": 0.483, "B3": 0.03, "B4": 1.97, "D3": 0.0, "D4": 2.004, "d2": 2.534, "c4": 0.9515 },
                    { "GroupSize": 7, "A1": 1.182, "A2": 0.419, "B3": 0.118, "B4": 1.882, "D3": 0.076, "D4": 1.924, "d2": 2.704, "c4": 0.9594 },
                    { "GroupSize": 8, "A1": 1.099, "A2": 0.373, "B3": 0.185, "B4": 1.815, "D3": 0.136, "D4": 1.864, "d2": 2.847, "c4": 0.9650 },
                    { "GroupSize": 9, "A1": 1.032, "A2": 0.337, "B3": 0.239, "B4": 1.761, "D3": 0.184, "D4": 1.816, "d2": 2.97, "c4": 0.9693 },
                    { "GroupSize": 10, "A1": 0.975, "A2": 0.308, "B3": 0.284, "B4": 1.716, "D3": 0.223, "D4": 1.777, "d2": 3.078, "c4": 0.9727 },
                    { "GroupSize": 11, "A1": 0.927, "A2": 0.285, "B3": 0.321, "B4": 1.679, "D3": 0.256, "D4": 1.744, "d2": 3.173, "c4": 0.9754 },
                    { "GroupSize": 12, "A1": 0.886, "A2": 0.266, "B3": 0.354, "B4": 1.646, "D3": 0.284, "D4": 1.716, "d2": 3.258, "c4": 0.9776 },
                    { "GroupSize": 13, "A1": 0.85, "A2": 0.249, "B3": 0.382, "B4": 1.618, "D3": 0.308, "D4": 1.692, "d2": 3.336, "c4": 0.9794 },
                    { "GroupSize": 14, "A1": 0.817, "A2": 0.235, "B3": 0.406, "B4": 1.594, "D3": 0.329, "D4": 1.671, "d2": 3.407, "c4": 0.9810 },
                    { "GroupSize": 15, "A1": 0.789, "A2": 0.223, "B3": 0.428, "B4": 1.572, "D3": 0.348, "D4": 1.652, "d2": 3.472, "c4": 0.9823 },
                    { "GroupSize": 16, "A1": 0.763, "A2": 0.212, "B3": 0.448, "B4": 1.552, "D3": 0.364, "D4": 1.636, "d2": 3.532, "c4": 0.9830 },
                    { "GroupSize": 17, "A1": 0.739, "A2": 0.0, "B3": 0.466, "B4": 1.534, "D3": 0.379, "D4": 1.621, "d2": 3.588, "c4": 0.9845 },
                    { "GroupSize": 18, "A1": 0.718, "A2": 0.194, "B3": 0.482, "B4": 1.518, "D3": 0.392, "D4": 1.608, "d2": 3.64, "c4": 0.9854 },
                    { "GroupSize": 19, "A1": 0.698, "A2": 0.187, "B3": 0.497, "B4": 1.503, "D3": 0.404, "D4": 1.596, "d2": 3.689, "c4": 0.9862 },
                    { "GroupSize": 20, "A1": 0.68, "A2": 0.18, "B3": 0.51, "B4": 1.49, "D3": 0.414, "D4": 1.586, "d2": 3.735, "c4": 0.9869 },
                    { "GroupSize": 21, "A1": 0.663, "A2": 0.173, "B3": 0.523, "B4": 1.477, "D3": 0.425, "D4": 1.575, "d2": 3.778, "c4": 0.9876 },
                    { "GroupSize": 22, "A1": 0.647, "A2": 0.167, "B3": 0.534, "B4": 1.466, "D3": 0.434, "D4": 1.566, "d2": 3.819, "c4": 0.9882 },
                    { "GroupSize": 23, "A1": 0.633, "A2": 0.162, "B3": 0.545, "B4": 1.455, "D3": 0.443, "D4": 1.557, "d2": 3.858, "c4": 0.9887 },
                    { "GroupSize": 24, "A1": 0.619, "A2": 0.157, "B3": 0.555, "B4": 1.445, "D3": 0.452, "D4": 1.548, "d2": 3.895, "c4": 0.9892 },
                    { "GroupSize": 25, "A1": 0.606, "A2": 0.153, "B3": 0.565, "B4": 1.435, "D3": 0.459, "D4": 1.541, "d2": 3.931, "c4": 0.9896 }
                ],
                spcType:"spcType1",
                tableData:[],   
                tableColumn:[
                    {
                        title:i18n.t('statistical.groupSize'),
                        minWidth:50,
                        maxWidth:50,
                        align:"center",
                        key:"GroupNum",
                        fixed: 'left'
                    },{
                        title:i18n.t('statistical.state'),
                        minWidth:60,
                        align:"center",
                        // key:"Status",   
                        fixed: 'left',
                        render:function(h,params){
                            if(params.row.Status===0){
                                return h('div',{style:{color:"green"}},i18n.t('statistical.normal'))
                            }else if(params.row.Status===1){
                                /* return h('Button',{
                                    style:{
                                        color:"red"
                                    },
                                    props:{
                                        type:"text"
                                    },
                                    on:{
                                        'on-click':(event) => {
                                            alert(params.row.ErrMsg)
                                        }
                                    }
                                },'失控') */
                                return h('div',{style:{color:"red"}},i18n.t('statistical.outOfControl'))
                            }else{
                                return h('div',{style:{color:"blue"}},i18n.t('statistical.processed'))
                            }
                        }
                    },{
                        title:i18n.t('statistical.average'),
                        minWidth:60,
                        align:"center",
                        key:"GroupAvg",
                        fixed: 'left'
                    },{
                        title:i18n.t('statistical.range'),
                        minWidth:60,
                        align:"center",
                        key:"GroupRange",
                        fixed: 'left'
                    },{
                        title:i18n.t('statistical.stdev'),
                        minWidth:60,
                        align:"center",
                        key:"GroupStdev",
                        fixed: 'left'
                    },{
                        title:i18n.t('statistical.maximum'),
                        minWidth:60,
                        align:"center",
                        key:"GroupMax",
                        fixed: 'left'
                    },{
                        title:i18n.t('statistical.minimum'),
                        minWidth:60,
                        align:"center",
                        key:"GroupMin",
                        fixed: 'left'
                    }
                ],
                analysisData:{
                    data: [
                        0.48,
                        0.49,
                        0.49,
                        0.49,
                        0.5,
                        0.52,
                        0.51,
                        0.51,
                        0.51,
                        0.51,
                        0.5,
                        0.51,
                        0.51,
                        0.5,
                        0.5,
                        0.49,
                        0.49,
                        0.49,
                        0.5,
                        0.5,
                        0.49,
                        0.51,
                        0.5,
                        0.5,
                        0.52,
                        0.51,
                        0.51,
                        0.51,
                        0.51,
                        0.49
                    ], //测量数据
                    groupSize: 1, //每一组的容量大小
                    targetValue: 0.5, // 目标值
                    usl: 0.55, //上限
                    lsl: 0.45, //下限
                    chartType: 'IMR', //只支持三种XR(均值极差图)，XS(均值标准差图)，IMR(移动极差图)  类型图
                    // rules: [{id: 1}, {id: 2,seriesCount: 5}, {id: 5,seriesCount: 9,insideCount: 5}],
                    rules:[],
                    isConvert:0,
                    //id 是规则的id  seriesCount是连续数目参数  insideCount是存在数目参数
                    //8大判异规则说明 https://wenku.baidu.com/view/f1f7a88e680203d8ce2f2412.html
                    // 1    1个点在A区以外
                    // 2    连续9点落在中心线同一侧
                    // 3    连续6点递增或递减
                    // 4    连续14点中相邻点交替上下
                    // 5    连续3点中有2点落在中心线同一侧的B区以外
                    // 6    连续5点中有4点落中心线同一侧的C区以外
                    // 7    连续15点落在中心线两侧的C区内
                    // 8    连续8点落在中心线两侧且无一在C区内
                },
                cpk:{
                    sampleNum:null,
                    avgs:null,
                    max:null,
                    min:null,

                    groupSize:null,
                    usl:null,
                    target:null,
                    lsl:null,

                    groupStdeva:null,
                    inGroupStdeva:null,
                    wholeStdeva:null,
                    plus3stdeva:null,
                    minus3stdeva:null,

                    cpk:null,
                    cp:null,
                    cpl:null,
                    cpu:null,

                    ppk:null,
                    pp:null,
                    ppl:null,
                    ppu:null,

                    ca:null,

                    actualLsl:null,
                    actualUsl:null,
                    actualTotal:null,

                    groupLsl:null,
                    groupUsl:null,
                    groupTotal:null,

                    wholeLsl:null,
                    wholeUsl:null,
                    wholeTotal:null
                    
                },
                chartNote:{
                    Total:null,
                    SampleSize:null,
                    Group:null,
                    Max:null,
                    Min:null,
                    X_Avgs:null,
                    S_Avgs:null,
                    Cpk:null,
                    Ppk:null,
                    Ca:null,
                    Cp:null,
                    Pp:null,
                },
                // 平均值图
                firstControlChartOption:{
                    title: {
                        text: i18n.t('statistical.meanChart'),
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 50,
                        bottom: 20,
                        left: 80,
                        right: 120
                    },

                    calculable: true,

                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        name: i18n.t('statistical.average'),
                        scale: true,
                        nameLocation: 'middle',
                        nameGap: 50
                    },
                    series: [{
                       // clickable: true,
                        name: i18n.t('statistical.average'),
                        type: 'line',
                        //symbol: 'circle',
                        //symbolSize: 8,
                        itemStyle: {
                            normal: {
                                color: '#418FEE'
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: '#3398DB'
                            }
                        },
                        radius: '90%',
                        data: [],
                        markPoint: {
                            data: [{
                                    type: 'max',
                                    name: i18n.t('statistical.maximum')
                                },
                                {
                                    type: 'min',
                                    name: i18n.t('statistical.minimum')
                                }
                            ]
                        },
                        markLine: {
                            precision: 5,
                            data: [{
                                    name: 'UCL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: 'UCL {c}'
                                            }
                                        }
                                    },
                                    // lineStyle:{
                                    //     color: '#64A600',
                                    // },
                                    // label:{
                                    //     formatter:'UCL {c}'
                                    // }
                                },
                                {
                                    name: 'LCL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: 'LCL  {c}'
                                            }
                                        }
                                    }
                                },
                                {
                                    name: 'CL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: 'CL  {c}'
                                            }
                                        }
                                    },
                                    lineStyle: {
                                        normal: {
                                            type: 'solid'
                                        }
                                    }
                                },
                                {
                                    name: 'USL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#dd3300',
                                            label: {
                                                formatter: 'USL {c}'
                                            }
                                        }
                                    }
                                },
                                {
                                    name: 'LSL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#dd3300',
                                            label: {
                                                formatter: 'LSL  {c}'
                                            }
                                        }
                                    }
                                },
                                {
                                    name: 'SL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#dd3300',
                                            label: {
                                                formatter: 'SL  {c}'
                                            }
                                        }
                                    },
                                    lineStyle: {
                                        normal: {
                                            type: 'solid'
                                        }
                                    }
                                }
                            ]
                        }
                    }]
                },
                // 极差值图
                secondControlChartOption:{
                    title: {
                        text: i18n.t('statistical.rangeChart'),
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 50,
                        bottom: 20,
                        left: 80,
                        right: 120
                    },

                    //legend: {
                    //    left: 'right',
                    //    data: ['极差值']
                    //},
                    calculable: true,

                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        name: i18n.t('statistical.range'),
                        scale: true,
                        nameLocation: 'middle',
                        nameGap: 50
                    },
                    series: [{
                        name: i18n.t('statistical.range'),
                        type: 'line',
                        //symbol: 'circle',
                        //symbolSize: 8,
                        itemStyle: {
                            normal: {
                                color: '#418FEE'
                            }
                        },
                        data: [],
                        markPoint: {
                            data: [{
                                    type: 'max',
                                    name: i18n.t('statistical.maximum')
                                },
                                {
                                    type: 'min',
                                    name: i18n.t('statistical.minimum')
                                }
                            ]
                        },
                        markLine: {
                            precision: 5,
                            data: [{
                                    name: 'CL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: 'CL  {c}'
                                            }
                                        },
                                        precision: 4
                                    },
                                    lineStyle: {
                                        normal: {
                                            type: 'solid'
                                        }
                                    }
                                },
                                {
                                    name: 'UCL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: 'UCL {c}'
                                            }
                                        }
                                    }
                                },
                                {
                                    name: 'LCL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: 'LCL  {c}'
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }]
                },
                // 移动极差值
                MovingRangeControlChartOption:{
                    title: {
                        text: i18n.t('statistical.MovingRange'),
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 50,
                        bottom: 20,
                        left: 80,
                        right: 120
                    },

                    //legend: {
                    //    left: 'right',
                    //    data: ['极差值']
                    //},
                    calculable: true,

                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        name: i18n.t('statistical.movingRangeValue'),
                        scale: true,
                        nameLocation: 'middle',
                        nameGap: 50
                    },
                    series: [{
                        name: i18n.t('statistical.movingRangeValue'),
                        type: 'line',
                        //symbol: 'circle',
                        //symbolSize: 8,
                        itemStyle: {
                            normal: {
                                color: '#418FEE'
                            }
                        },
                        data: [],
                        markPoint: {
                            data: [{
                                    type: 'max',
                                    name: i18n.t('statistical.maximum')
                                },
                                {
                                    type: 'min',
                                    name: i18n.t('statistical.minimum')
                                }
                            ]
                        },
                        markLine: {
                            precision: 5,
                            data: [{
                                    name: 'CL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: 'CL  {c}'
                                            }
                                        },
                                        precision: 4
                                    },
                                    lineStyle: {
                                        normal: {
                                            type: 'solid'
                                        }
                                    }
                                },
                                {
                                    name: 'UCL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: 'UCL {c}'
                                            }
                                        }
                                    }
                                },
                                {
                                    name: 'LCL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: 'LCL  {c}'
                                            }
                                        }
                                    }
                                }
                                //{ name: '目标值', yAxis: 0.90 }
                            ]
                        }
                    }]
                },
                //标准差值
                stdevControlChartOption:{
                    title: {
                        text: i18n.t('statistical.stdevChart'),
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 50,
                        bottom: 20,
                        left: 80,
                        right: 120
                    },
                    calculable: true,

                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        name: i18n.t('statistical.stdev'),
                        scale: true,
                        nameLocation: 'middle',
                        nameGap: 50
                    },
                    series: [{
                        name: i18n.t('statistical.stdev'),
                        type: 'line',
                        //symbol: 'circle',
                        //symbolSize: 8,
                        itemStyle: {
                            normal: {
                                color: '#418FEE'
                            }
                        },
                        data: [],
                        markPoint: {
                            data: [{
                                    type: 'max',
                                    name: i18n.t('statistical.maximum')
                                },
                                {
                                    type: 'min',
                                    name: i18n.t('statistical.minimum')
                                }
                            ]
                        },
                        markLine: {
                            precision: 5,
                            data: [{
                                    name: 'CL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: 'CL  {c}'
                                            }
                                        },
                                        precision: 4
                                    },
                                    lineStyle: {
                                        normal: {
                                            type: 'solid'
                                        }
                                    }
                                },
                                {
                                    name: 'UCL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: 'UCL {c}'
                                            }
                                        }
                                    }
                                },
                                {
                                    name: 'LCL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: 'LCL  {c}'
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }]
                },
                //CPK分析图
                cpkChartOption:{},
                //样品运行图
                sampleRunChartOption:{
                    title: {
                        text: i18n.t('statistical.sampleRun'),
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: 80,
                        right: 120
                    },
                    //legend: {
                    //    left:'right',
                    //    data: ['平均值']
                    //},
                    calculable: true,

                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        axisLabel: {
                            interval: 0, //横轴信息全部显示
                            rotate: 45 //60度角倾斜显示
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: i18n.t('statistical.sampleValue'),
                        scale: true,
                        nameLocation: 'middle',
                        nameGap: 50
                    },
                    series: [{
                        name: i18n.t('statistical.sampleValue'),
                        type: 'line',
                        //symbol: 'circle',
                        //symbolSize: 8,
                        itemStyle: {
                            normal: {
                                color: '#418FEE'
                            }
                        },
                        data: [],
                        markPoint: {
                            data: [{
                                    type: 'max',
                                    name: i18n.t('statistical.maximum')
                                },
                                {
                                    type: 'min',
                                    name: i18n.t('statistical.minimum')
                                }
                            ]
                        },
                        markLine: {
                            precision: 3,
                            data: [{
                                    name: 'SL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#dd3300',
                                            label: {
                                                formatter: 'SL  {c}'
                                            }
                                        },
                                        precision: 4
                                    },
                                    lineStyle: {
                                        normal: {
                                            type: 'solid'
                                        }
                                    }
                                },
                                {
                                    name: 'USL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#dd3300',
                                            label: {
                                                formatter: 'USL {c}'
                                            }
                                        }
                                    }
                                },
                                {
                                    name: 'LSL',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#dd3300',
                                            label: {
                                                formatter: 'LSL  {c}'
                                            }
                                        }
                                    }
                                }

                                //{ name: '目标值', yAxis: 0.90 }
                            ]
                        }
                    }]
                },
                //平均值运行图
                avgRunChartOption:{
                    title: {
                        text: i18n.t('statistical.avgRun'),
                        subtext: ''
                    },
                    grid: {
                        left: 80,
                        right: 120
                    },
                    tooltip: {
                        trigger: 'item',
                        showDelay: 0,
                        formatter: function (params) {
                            if (params.value.length > 1) {
                                return params.name + '<br/>' +
                                    params.seriesName + ':<br/>' +
                                    params.value[1];
                            } else {
                                return params.name + '<br/>' +
                                    params.seriesName + ':<br/>' +
                                    params.value;
                            }
                        }
                    },
                    legend: {
                        left: 'center',
                        data: [i18n.t('statistical.average'), i18n.t('statistical.sampleValue')]
                    },
                    calculable: true,

                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        name: i18n.t('statistical.average'),
                        scale: true,
                        nameLocation: 'middle',
                        nameGap: 50
                    },
                    series: [{
                            name: i18n.t('statistical.average'),
                            type: 'line',
                            //symbol: 'circle',
                            //symbolSize: 8,
                            itemStyle: {
                                normal: {
                                    color: '#418FEE'
                                }
                            },
                            data: [],
                            markPoint: {
                                data: [{
                                        type: 'max',
                                        name: i18n.t('statistical.maximum')
                                    },
                                    {
                                        type: 'min',
                                        name: i18n.t('statistical.minimum')
                                    }
                                ]
                            },
                            markLine: {
                                precision: 5,
                                data: [{
                                        name: 'SL',
                                        yAxis: 0,
                                        itemStyle: {
                                            normal: {
                                                color: '#dd3300',
                                                label: {
                                                    formatter: 'SL  {c}'
                                                }
                                            },
                                            precision: 4
                                        },
                                        lineStyle: {
                                            normal: {
                                                type: 'solid'
                                            }
                                        }
                                    },
                                    {
                                        name: 'USL',
                                        yAxis: 0,
                                        itemStyle: {
                                            normal: {
                                                color: '#dd3300',
                                                label: {
                                                    formatter: 'USL {c}'
                                                }
                                            }
                                        }
                                    },
                                    {
                                        name: 'LSL',
                                        yAxis: 0,
                                        itemStyle: {
                                            normal: {
                                                color: '#dd3300',
                                                label: {
                                                    formatter: 'LSL  {c}'
                                                }
                                            }
                                        }
                                    }

                                    //{ name: '目标值', yAxis: 0.90 }
                                ]
                            }
                        },
                        {
                            name: i18n.t('statistical.sampleValue'),
                            type: 'scatter',

                            symbolSize: 7,
                            itemStyle: {
                                normal: {
                                    color: '#ADADAD'
                                }
                            },
                            data: []
                        }
                    ]
                },
                //合格率趋势图
                passRateRunChartOption:{
                    title: {
                        text: i18n.t('statistical.passRateRun'),
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: 80,
                        right: 120
                    },
                    //legend: {
                    //    left:'right',
                    //    data: ['平均值']
                    //},
                    calculable: true,

                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        name: i18n.t('statistical.qualifiedRate'),
                        scale: true,
                        nameLocation: 'middle',
                        nameGap: 50,
                        max: 1

                    },
                    series: [{
                        name: i18n.t('statistical.qualifiedRate'),
                        type: 'line',
                        //symbol: 'circle',
                        //symbolSize: 8,
                        itemStyle: {
                            normal: {
                                color: '#418FEE'
                            }
                        },
                        data: [],
                        markPoint: {
                            data: [{
                                    type: 'max',
                                    name: i18n.t('statistical.maximum'),
                                },
                                {
                                    type: 'min',
                                    name: i18n.t('statistical.minimum'),
                                }
                            ]
                        },
                        markLine: {
                            precision: 3,
                            data: [{
                                    //name: '合格率',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: i18n.t('statistical.qualifiedRate')+' 100%'
                                            }
                                        },
                                        precision: 4
                                    },
                                    lineStyle: {
                                        normal: {
                                            type: 'solid'
                                        }
                                    }
                                },
                                {
                                    //name: '合格率',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#64A600',
                                            label: {
                                                formatter: i18n.t('statistical.qualifiedRate')+' 90%'
                                            }
                                        }
                                    },
                                    lineStyle: {
                                        normal: {
                                            type: 'solid'
                                        }
                                    }
                                },
                                {
                                    //name: '合格率',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#0072E3',
                                            label: {
                                                formatter: i18n.t('statistical.qualifiedRate')+' 80%'
                                            }
                                        }
                                    },
                                    lineStyle: {
                                        normal: {
                                            type: 'solid'
                                        }
                                    }
                                },
                                {
                                    //name: '合格率',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#B87070',
                                            label: {
                                                formatter: i18n.t('statistical.qualifiedRate')+' 70%'
                                            }
                                        }
                                    }
                                },
                                {
                                    //name: '合格率',
                                    yAxis: 0,
                                    itemStyle: {
                                        normal: {
                                            color: '#FF2D2D',
                                            label: {
                                                formatter: i18n.t('statistical.qualifiedRate')+' 60%'
                                            }
                                        }
                                    }
                                }

                                //{ name: '目标值', yAxis: 0.90 }
                            ]
                        }
                    }]
                },
                
                firstControlChart:null,
                secondControlChart:null,
                MovingRangeControlChart:null,
                stdevControlChart:null,
                sampleRunChart:null,
                avgRunChart:null,
                passRateRunChart:null,


                
            }
        },
        mounted () {
            let that = this
            window.onresize = () => {
                return (() => {
                    let tabs_width = $('#spcChart .ivu-tabs').width();
                    $("#firstControlChart").css('width', tabs_width);
                    $("#secondControlChart").css('width', tabs_width);
                    $("#sampleRunChart").css('width', tabs_width);
                    $("#avgRunChart").css('width', tabs_width);
                    $("#passRateRunChart").css('width', tabs_width);
                    this.firstControlChart.resize();
                    this.secondControlChart.resize();
                    this.sampleRunChart.resize();
                    this.avgRunChart.resize();
                    this.passRateRunChart.resize();
                })()
            }
        },
        watch:{
            newDate:function(newDate){
                this.analysisData = this.parent;
                let analysisData = this.parent;
                this.firstControlChart = echarts.init(document.getElementById("firstControlChart"));
                this.secondControlChart = echarts.init(document.getElementById("secondControlChart"));                
                this.sampleRunChart = echarts.init(document.getElementById("sampleRunChart"));
                this.avgRunChart = echarts.init(document.getElementById("avgRunChart"));
                this.passRateRunChart = echarts.init(document.getElementById("passRateRunChart"));

                this.firstControlChart.setOption(this.firstControlChartOption);
                if (analysisData.chartType == "XR") {
                    this.secondControlChart.setOption(this.secondControlChartOption);
                }
                if (analysisData.chartType == "IMR") {
                    this.secondControlChart.setOption(this.MovingRangeControlChartOption);
                }
                if (analysisData.chartType == "XS") {
                    this.secondControlChart.setOption(this.stdevControlChartOption);
                }
                this.sampleRunChart.setOption(this.sampleRunChartOption);
                this.avgRunChart.setOption(this.avgRunChartOption);
                this.passRateRunChart.setOption(this.passRateRunChartOption);
                // return;
                this.drawChart()
            },
            // parent:{
            //     deep:true,
            //     handler:function(newValue,oldValue){
            //         console.log(newValue,"newValue");
            //     }
            // }
            
        },
        methods:{
            sum(arr){
                return arr.reduce(function (prev, curr, idx, arr) {
                    return parseFloat(prev) + parseFloat(curr);
                });
            },
            avg(arr){
                if (arr.length == 0) {
                    return 0;
                }
                return (this.sum(arr) / arr.length);
            },
            stdev(arr){
                if (arr.length == 0) {
                    return 0;
                }
                var avg = this.avg(arr);
                var sumArr = arr.map(function (item) {
                    return Math.pow((item - avg), 2);
                });
                return Math.sqrt((this.sum(sumArr) / (arr.length - 1)));
            },
            drawChart(){
                let analysisData = this.analysisData
                let data = this.DataCalculate(analysisData)//计算数据
                this.data = this.DataCalculate(analysisData)//计算数据
                if (data.Success) {
                    //样品运行图
                    var a = [];
                    var b = [];
                    var c = [];
                    var max, min;
                    this.sampleRunChartOption.series[0].data = []; //    清空折线数据
                    for (var i = 0; i < data.Num; i++) {
                        for (var j = 0; j < data.GroupSize; j++) {
                            a.push((i + 1).toString());
                        }
                    }
                    for (var i = 0; i < data.array.length; i++)
                        b.push(data.array[i]);
                    this.sampleRunChartOption.xAxis.data = a;

                    //判断是否超出界限 超出设置图标样式
                    for (var i = 0; i < data.array.length; i++) {
                        var boxNum = [];
                        if (b[i] > data.USL || b[i] < data.LSL) {
                            boxNum = {
                                value: b[i],
                                itemStyle: {
                                    normal: {
                                        color: 'red'
                                    }
                                },
                                symbolSize: 10
                            };
                            this.sampleRunChartOption.series[0].data.push(boxNum);
                        } else
                            this.sampleRunChartOption.series[0].data.push(b[i]);
                    }
                    //图表可视范围
                    max = Math.max.apply(Math, b);
                    min = Math.min.apply(Math, b);
                    max = max > data.USL ? max : data.USL;
                    min = max < data.LSL ? min : data.LSL;
                    this.sampleRunChartOption.yAxis.max = max;
                    this.sampleRunChartOption.yAxis.min = min;
                    this.sampleRunChartOption.series[0].markLine.data[0].yAxis = data.Target;
                    this.sampleRunChartOption.series[0].markLine.data[1].yAxis = data.USL;
                    this.sampleRunChartOption.series[0].markLine.data[2].yAxis = data.LSL;
                    this.sampleRunChart.setOption(this.sampleRunChartOption);


                    //平均值运行图
                    a = [];
                    b = [];
                    c = [];
                    var max, min;
                    this.avgRunChartOption.series[0].data = []; //    清空折线数据
                    for (var i = 0; i < data.Num; i++) {
                        a.push(i + 1);
                        b.push(data.DataList[i].GroupAvg);
                    }
                    for (var i = 0; i < data.Num; i++) //散点图数据
                    {
                        for (var j = 0; j < data.GroupSize; j++) {
                            c[i * data.GroupSize + j] = [i, data.array[i * data.GroupSize + j]];
                        }
                    }
                    this.avgRunChartOption.xAxis.data = a;
                    this.avgRunChartOption.series[1].data = c;

                    //判断是否超出界限 超出设置图标样式
                    for (var i = 0; i < data.Num; i++) {
                        var boxNum = [];
                        if (b[i] > data.USL || b[i] < data.LSL) {
                            boxNum = {
                                value: b[i],
                                itemStyle: {
                                    normal: {
                                        color: 'red'
                                    }
                                },
                                symbolSize: 10
                            };
                            this.avgRunChartOption.series[0].data.push(boxNum);
                        } else
                            this.avgRunChartOption.series[0].data.push(b[i]);
                    }

                    //图表可视范围
                    max = Math.max.apply(Math, b);
                    min = Math.min.apply(Math, b);
                    max = max > data.USL ? max : data.USL;
                    min = max < data.LSL ? min : data.LSL;
                    this.avgRunChartOption.yAxis.max = max;
                    this.avgRunChartOption.yAxis.min = min;

                    this.avgRunChartOption.series[0].markLine.data[0].yAxis = data.Target;
                    this.avgRunChartOption.series[0].markLine.data[1].yAxis = data.USL;
                    this.avgRunChartOption.series[0].markLine.data[2].yAxis = data.LSL;

                    this.avgRunChart.setOption(this.avgRunChartOption);

                    //控制图Frist
                    if (analysisData.chartType == "XS" || analysisData.chartType == "XR" || analysisData.chartType ==
                        "IMR") {
                        var a = [];
                        var b = [];
                        var max, min;
                        for (var i = 0; i < data.Num; i++) {
                            a.push((i + 1).toString());
                            b.push(data.DataList[i].GroupAvg);
                        }
                        this.firstControlChartOption.xAxis.data = a;
                        this.firstControlChartOption.series[0].markLine.data[0].yAxis = data.FirstUCL;
                        this.firstControlChartOption.series[0].markLine.data[1].yAxis = data.FirstLCL;
                        this.firstControlChartOption.series[0].markLine.data[2].yAxis = data.FirstTarget;
                        this.firstControlChartOption.series[0].markLine.data[3].yAxis = data.USL;
                        this.firstControlChartOption.series[0].markLine.data[4].yAxis = data.LSL;
                        this.firstControlChartOption.series[0].markLine.data[5].yAxis = data.Target;
                        //this.firstControlChartOption.series[0].markLine.data[6].yAxis = data.X_avgs;

                        //图表可视范围
                        max = Math.max.apply(Math, b);
                        min = Math.min.apply(Math, b);
                        max = (max > data.USL ? max : data.USL) > data.FirstUCL ? (max > data.USL ? max :
                            data.USL) : data.FirstUCL;
                        min = (min < data.LSL ? min : data.LSL) < data.FirstLCL ? (min < data.LSL ? min :
                            data.LSL) : data.FirstLCL;
                        this.firstControlChartOption.yAxis.max = max;
                        this.firstControlChartOption.yAxis.min = min;


                        this.firstControlChartOption.series[0].data = [];
                        for (var i = 0; i < data.Num; i++) {
                            var boxNum = [],
                                flag = 0;
                            for (var j = 0; j < data.GroupSize; j++) {
                                if (data.DataList[i].Status == 1) {
                                    boxNum = {
                                        value: b[i],
                                        itemStyle: {
                                            normal: {
                                                color: 'red'
                                            }
                                        },
                                        //symbolSize: 10
                                    };
                                    flag = 1;
                                }

                            }
                            if (flag == 1)
                                this.firstControlChartOption.series[0].data.push(boxNum);
                            else
                                this.firstControlChartOption.series[0].data.push(b[i]);
                        }

                        this.firstControlChart.setOption(this.firstControlChartOption);
                    }

                    this.chartNote.Total = data.array.length
                    this.chartNote.GroupSize = data.GroupSize
                    this.chartNote.Group = data.Num
                    this.chartNote.Max = data.CpkInfo.Maxnum
                    this.chartNote.Min = data.CpkInfo.Mininum
                    this.chartNote.X_Avgs = data.X_avgs
                    this.chartNote.S_Avgs = data.CpkInfo.STDEV
                    this.chartNote.Cpk = data.CpkInfo.Cpk
                    this.chartNote.Ppk = data.CpkInfo.Ppk
                    this.chartNote.Ca = data.CpkInfo.Ca
                    this.chartNote.Cp = data.CpkInfo.Cp
                    this.chartNote.Pp = data.CpkInfo.Pp
            


                    //控制图Second-极差控制图
                    if (analysisData.chartType == "XR") {
                        var a = [];
                        var d = [];
                        this.secondControlChartOption.series[0].data = []; //    清空折线数据
                        var max, min;

                        for (var i = 0; i < data.Num; i++) {
                            a.push((i + 1).toString());
                            d.push(data.DataList[i].GroupRange);
                        }

                        this.secondControlChartOption.xAxis.data = a;
                        //RangeOption.series[0].data = c;
                        if (analysisData.groupSize != 1) {
                            for (var i = 0; i < data.Num; i++) {
                                var boxNum = [];
                                if (d[i] > data.SecondUCL || d[i] < data.SecondLCL) {
                                    boxNum = {
                                        value: d[i],
                                        itemStyle: {
                                            normal: {
                                                color: 'red'
                                            }
                                        },
                                        //symbolSize: 10
                                    }
                                    this.secondControlChartOption.series[0].data.push(boxNum);
                                } else
                                    this.secondControlChartOption.series[0].data.push(d[i]);
                            }
                        }
                        //若样本容量=1，则是移动极差
                        else if (analysisData.groupSize == 1) {
                            for (var i = 0; i < data.Num; i++) {
                                var boxNum = [];
                                if (d[i] > data.SecondUCL || d[i] < data.SecondLCL) {
                                    boxNum = {
                                        value: d[i],
                                        itemStyle: {
                                            normal: {
                                                color: 'red'
                                            }
                                        },
                                        //symbolSize: 10
                                    }
                                    if (i == 0)
                                        this.secondControlChartOption.series[0].data.push("");
                                    else
                                        this.secondControlChartOption.series[0].data.push(boxNum);
                                } else
                                if (i == 0)
                                    this.secondControlChartOption.series[0].data.push("");
                                else
                                    this.secondControlChartOption.series[0].data.push(d[i]);
                            }
                        }

                        //图表可视范围
                        max = Math.max.apply(Math, d);
                        min = Math.min.apply(Math, d);
                        max = max > data.SecondUCL ? max : data.SecondUCL;
                        min = min < data.SecondLCL ? min : data.SecondLCL;
                        this.secondControlChartOption.yAxis.max = max;
                        this.secondControlChartOption.yAxis.min = min;

                        this.secondControlChartOption.series[0].markLine.data[0].yAxis = data.SecondTarget
                        this.secondControlChartOption.series[0].markLine.data[1].yAxis = data.SecondUCL;
                        this.secondControlChartOption.series[0].markLine.data[2].yAxis = data.SecondLCL;
                        // this.secondControlChartOption.series[0].markLine.data[3].yAxis = data.R_avgs;

                        this.secondControlChart.setOption(this.secondControlChartOption);
                    }

                    //控制图-移动极差控制图
                    if (analysisData.chartType == "IMR") {
                        var a = [];
                        var b = [];
                        var max, min;

                        for (var i = 0; i < data.Num; i++) {
                            a.push((i + 1).toString());
                            b.push(data.DataList[i].GroupRange);
                        }
                        this.MovingRangeControlChartOption.xAxis.data = a;
                        //RangeOption.series[0].data = c;

                        this.MovingRangeControlChartOption.series[0].data = [];

                        for (var i = 0; i < data.Num; i++) {
                            var boxNum = [];
                            if (b[i] > data.SecondUCL || b[i] < data.SecondLCL) {
                                boxNum = {
                                    value: b[i],
                                    itemStyle: {
                                        normal: {
                                            color: 'red'
                                        }
                                    },
                                    //symbolSize: 10
                                }
                                if (i == 0)
                                    this.MovingRangeControlChartOption.series[0].data.push("");
                                else
                                    this.MovingRangeControlChartOption.series[0].data.push(boxNum);
                            } else
                            if (i == 0)
                                this.MovingRangeControlChartOption.series[0].data.push("");
                            else
                                this.MovingRangeControlChartOption.series[0].data.push(b[i]);
                        }

                        //图表可是范围
                        let bCopy = []//去除b中的非数字，方便下一步取最大最小值
                        for(let i in b){
                            if(!isNaN(b[i])){bCopy.push(b[i])}
                        }
                        max = Math.max.apply(Math, bCopy);
                        min = Math.min.apply(Math, bCopy);
                        max = max > data.SecondUCL ? max : data.SecondUCL;
                        min = max < data.SecondLCL ? min : data.SecondLCL;
                        this.MovingRangeControlChartOption.yAxis.max =  parseFloat(max).toFixed(4);
                        this.MovingRangeControlChartOption.yAxis.min = parseFloat(min).toFixed(4);

                        this.MovingRangeControlChartOption.series[0].markLine.data[0].yAxis = data.SecondTarget
                        this.MovingRangeControlChartOption.series[0].markLine.data[1].yAxis = data.SecondUCL;
                        this.MovingRangeControlChartOption.series[0].markLine.data[2].yAxis = data.SecondLCL;
                        //this.MovingRangeControlChartOption.series[0].markLine.data[3].yAxis = data.R_avgs;


                        this.secondControlChart.setOption(this.MovingRangeControlChartOption);
                    }

                    //控制图-标准差
                    if (analysisData.chartType == "XS") {
                        var a = [];
                        var b = [];
                        var max, min;

                        for (var i = 0; i < data.Num; i++) {
                            a.push((i + 1).toString());
                            b.push(data.DataList[i].GroupStdev);
                        }
                        this.stdevControlChartOption.xAxis.data = a;
                        this.stdevControlChartOption.series[0].data = [];

                        for (var i = 0; i < data.Num; i++) {
                            var boxNum = [];
                            if (b[i] > data.SecondUCL || b[i] < data.SecondLCL) {
                                boxNum = {
                                    value: b[i],
                                    itemStyle: {
                                        normal: {
                                            color: 'red'
                                        }
                                    },
                                    //symbolSize: 10
                                };
                                this.stdevControlChartOption.series[0].data.push(boxNum);
                            } else
                                this.stdevControlChartOption.series[0].data.push(b[i]);
                        }

                        //图表可是范围
                        max = Math.max.apply(Math, b);
                        min = Math.min.apply(Math, b);
                        max = max > data.SecondUCL ? max : data.SecondUCL;
                        min = max < data.SecondLCL ? min : data.SecondLCL;
                        this.stdevControlChartOption.yAxis.max = max;
                        this.stdevControlChartOption.yAxis.min = min;
                        this.stdevControlChartOption.series[0].markLine.data[0].yAxis = data.SecondTarget;
                        this.stdevControlChartOption.series[0].markLine.data[1].yAxis = data.SecondUCL;
                        this.stdevControlChartOption.series[0].markLine.data[2].yAxis = data.SecondLCL;
                        this.secondControlChart.setOption(this.stdevControlChartOption);
                    }


                    //合格率趋势图
                    var a = [];
                    var b = [];
                    var c = [];
                    this.passRateRunChartOption.series[0].data = []; //    清空折线数据
                    for (var i = 0; i < data.Num; i++) {
                        a.push(i + 1);
                        var flag = 0;
                        for (var j = 0; j < data.GroupSize; j++) {
                            if (data.DataList[i].DataInfos[j].Status == 1)
                                flag++;

                        }
                        b[i] = (data.GroupSize - flag) / data.GroupSize;
                    }
                    this.passRateRunChartOption.xAxis.data = a;
                    this.passRateRunChartOption.series[0].data = b;
                    this.passRateRunChartOption.series[0].markLine.data[0].yAxis = 1;
                    this.passRateRunChartOption.series[0].markLine.data[1].yAxis = 0.9;
                    this.passRateRunChartOption.series[0].markLine.data[2].yAxis = 0.8;
                    this.passRateRunChartOption.series[0].markLine.data[3].yAxis = 0.7;
                    this.passRateRunChartOption.series[0].markLine.data[4].yAxis = 0.6;
                    this.passRateRunChart.setOption(this.passRateRunChartOption);

                    //设置CPK系列参数
                    this.cpk.sampleNum = data.array.length
                    this.cpk.avgs = data.X_avgs
                    this.cpk.max = data.CpkInfo.Maxnum
                    this.cpk.min = data.CpkInfo.Mininum

                    this.cpk.groupSize = data.GroupSize
                    this.cpk.usl = data.USL
                    this.cpk.target = data.Target
                    this.cpk.lsl = data.LSL

                    this.cpk.groupStdeva = data.GroupSTDEVA
                    this.cpk.inGroupStdeva = data.CpkInfo.InGroupSTDEVA
                    this.cpk.wholeStdeva = data.CpkInfo.STDEV
                    this.cpk.plus3stdeva = data.CpkInfo.Plus3STDEV
                    this.cpk.minus3stdeva = data.CpkInfo.Minus3STDEV

                    this.cpk.cpk = data.CpkInfo.Cpk
                    this.cpk.cp = data.CpkInfo.Cp
                    this.cpk.cpl = data.CpkInfo.Cpl
                    this.cpk.cpu = data.CpkInfo.Cpu

                    this.cpk.ppk = data.CpkInfo.Ppk
                    this.cpk.pp = data.CpkInfo.Pp
                    this.cpk.ppl = data.CpkInfo.PPL
                    this.cpk.ppu = data.CpkInfo.PPU

                    this.cpk.ca = data.CpkInfo.Ca

                    this.cpk.actualLsl = data.underLSL
                    this.cpk.actualUsl = data.upUSL
                    this.cpk.actualTotal = data.PPM

                    this.cpk.groupLsl = data.GroupUnderLSL
                    this.cpk.groupUsl = data.GroupUpUSL
                    this.cpk.groupTotal = data.GroupPPM

                    this.cpk.wholeLsl = data.TotalUnderLSL
                    this.cpk.wholeUsl = data.TotalUpUSL
                    this.cpk.wholeTotal = data.TotalPPM


                    //加载表格
                    this.loadTable(data.DataList, analysisData.groupSize);

                    //CPK分析图
                    this.setCPK(data);
                }
            },
            loadTable(data, groupSize){
                let tableColumn =[
                    {
                        title:i18n.t('statistical.groupSize'),
                        minWidth:50,
                        maxWidth:50,
                        align:"center",
                        key:"GroupNum",
                        fixed: 'left'
                    },{
                        title:i18n.t('statistical.state'),
                        minWidth:60,
                        align:"center",
                        // key:"Status",   
                        fixed: 'left',
                        render:function(h,params){
                            if(params.row.Status===0){
                                return h('div',{style:{color:"green"}},i18n.t('statistical.normal'))
                            }else if(params.row.Status===1){
                                /* return h('Button',{
                                    style:{
                                        color:"red"
                                    },
                                    props:{
                                        type:"text"
                                    },
                                    on:{
                                        'on-click':(event) => {
                                            alert(params.row.ErrMsg)
                                        }
                                    }
                                },'失控') */
                                return h('div',{style:{color:"red"}},i18n.t('statistical.outOfControl'))
                            }else{
                                return h('div',{style:{color:"blue"}},i18n.t('statistical.processed'))
                            }
                        }
                    },{
                        title:i18n.t('statistical.average'),
                        minWidth:60,
                        align:"center",
                        key:"GroupAvg",
                        fixed: 'left'
                    },{
                        title:i18n.t('statistical.range'),
                        minWidth:60,
                        align:"center",
                        key:"GroupRange",
                        fixed: 'left'
                    },{
                        title:i18n.t('statistical.stdev'),
                        minWidth:60,
                        align:"center",
                        key:"GroupStdev",
                        fixed: 'left'
                    },{
                        title:i18n.t('statistical.maximum'),
                        minWidth:60,
                        align:"center",
                        key:"GroupMax",
                        fixed: 'left'
                    },{
                        title:i18n.t('statistical.minimum'),
                        minWidth:60,
                        align:"center",
                        key:"GroupMin",
                        fixed: 'left'
                    }
                ]
                for(let i=0;i<groupSize;i++){
                    let j = Number(i)+Number(1)
                    tableColumn.push({
                        title:i18n.t('statistical.sample')+j,
                        minWidth:60,
                        align:"center",
                        key:"DataInfos",
                        render:(h,params)=>{
                        return h('span',params.row.DataInfos[i].MeasureData)
                        }
                    })
                }
                this.tableColumn = tableColumn
                this.tableData = data
            },
            //设置正态分布图
            setCPK(info) {
                // let state = true;
                // for(let i=0;i<info.array;i++){
                // if(info.array[i] != 0){
                // state = false;
                // break
                // }
                // }
                // if(state){
                // // window.parent.noData()
                // return;
                // }
                var girth = [];
                var i;
                girth.push(...info.array);
                //插入曲线图数据
                var lineData = [];
                for (i = 0; i < info.xValue.length; i++) {
                    lineData.push([info.xValue[i], info.yValue[i]]);
                }


                // See https://github.com/ecomfe/echarts-stat
                if (girth.length < 5)
                    return;
                var bins = ecStat.histogram(girth);

                var interval;
                var min = Infinity;
                var max = -Infinity;

                this.data = echarts.util.map(bins.data, function (item, index) {
                    var x0 = bins.bins[index].x0;
                    var x1 = bins.bins[index].x1;
                    interval = x1 - x0;
                    min = Math.min(min, x0);
                    max = Math.max(max, x1);
                    return [x0, x1, item[1]];
                });
                min = min >= info.CpkInfo.LSL ? info.CpkInfo.LSL : min - interval;

                max = max >= info.CpkInfo.USL ? max + interval : info.CpkInfo.USL;

                min = min >= info.CpkInfo.AvgMinus3Sigma ? parseFloat(info.CpkInfo.AvgMinus3Sigma.toFixed(2)) : min;
                max = max >= info.CpkInfo.AvgPlus3Sigma ? max : parseFloat(info.CpkInfo.AvgPlus3Sigma.toFixed(2));
                Highcharts.chart('CPK', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: i18n.t('statistical.cpkAnalysisChart'),
                        align:"left",
                        style:{
                            fontWeight:"bold"
                        }
                    },
                    exporting: {
                        enabled:false,
                    },
                    xAxis: {
                        labels: {
                            // enabled: false
                            y:20,
                            step:1,
                            style:{
                                "font-size": "12px", 
                            }
                        },
                        min: min,
                        max: max,
                        plotLines: [
                            {
                                color: '#418FEE',
                                width: 2,
                                dashStyle: 'Dot', //Dash,Dot,Solid,默认Solid
                                value: parseFloat(info.Target),
                                label: {
                                    text: 'M  ' + info.Target,
                                    align: 'left',  // 决定定位点
                                    y: 0
                                },
                                zIndex: 5
                            },
                            {
                                color: '#418FEE',
                                width: 2,
                                dashStyle: 'Dot', //Dash,Dot,Solid,默认Solid
                                label: {
                                    text: 'USL  ' + info.CpkInfo.USL,
                                    align: 'left',  // 决定定位点
                                    y: 0
                                },
                                value: info.CpkInfo.USL,  //x轴显示位置，一个标记为1
                                zIndex: 5
                            },
                            {
                                color: '#418FEE',
                                width: 2,
                                dashStyle: 'Dot', //Dash,Dot,Solid,默认Solid
                                label: {
                                    text: 'LSL  ' + info.CpkInfo.LSL,
                                    align: 'left',  // 决定定位点
                                    y: 0
                                },
                                value: info.CpkInfo.LSL,  //x轴显示位置，一个标记为1
                                zIndex: 5
                            }

                        ]
                    },
                    yAxis: [
                        {
                            title: {
                                text: ''
                            },
                            labels: {
                                enabled: false
                            }   
                        },
                        {
                            title: {
                                text: ''
                            },
                            labels: {
                                enabled: false
                            }   
                            //opposite: true
                        },
                        {
                            labels: {
                                enabled: false
                            },   
                            title: {
                                text: ''
                            }

                            //opposite: true
                        }
                    ],
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        spline: {
                            marker: {
                                enabled: false
                                //radius: 10
                            }
                        }
                    },
                    series: [
                        {
                            name: '直方图',
                            type: 'histogram',
                            baseSeries: 's1',
                            zIndex: -1,
                        },
                        {
                            name: '正态分布曲线',
                            type: 'spline',
                            color: '#FFBA31',
                            data: lineData,
                            yAxis: 1
                        },
                        {
                            name: 'Data',
                            type: 'scatter',
                            data: girth,
                            id: 's1',
                            yAxis: 2,
                            marker: {
                                radius: 0
                            }
                        }
                    ],
                });
            },
            DataCalculate(param) {
                var xAvgs = 0;
                var rAvgs = 0;
                var sAvgs = 0;
                var outOfSpecCount = 0; //超出规格数
                var stdeva = 0;//整体标准差
                var groupStdeva = 0; //组间标准差
                var upUsl = 0, underLsl = 0, ppm = 0; //实测性能
                var groupUpUsl = 0, groupUnderLsl = 0, groupPpm = 0; //预测性能（组内）
                var totalUpUsl = 0, totalUnderLsl = 0, totalPpm = 0; //预测性能（整体）
                var groupNum = 0;

                var groupInfos = new Array();

                var totalData = new Array();

                for (var i = 0; i < param.data.length; i += param.groupSize) {
                    groupNum++;
                    var groupInfo = {};
                    var data = param.data.slice(i, i + param.groupSize);  //按照样本容量个数选取测量数据
                    // console.log(data,111111);
                    // return false;
                    if (data.length == param.groupSize)  //数据是否填满
                    {
                        totalData.push(...data);
                        groupInfo.GroupMax = Math.max(...data);     //最大值
                        groupInfo.GroupMin = Math.min(...data);     //最小值
                        // groupInfo.GroupAvg = parseFloat(data.avg().toFixed(4)); //平均值
                        groupInfo.GroupAvg = parseFloat(JSON.parse(JSON.stringify(this.avg(data))).toFixed(4)); //平均值
                        groupInfo.GroupNum = groupNum;
                        if (param.groupSize > 1)   //样本容量大于1
                        {
                            groupInfo.GroupRange = parseFloat((groupInfo.GroupMax - groupInfo.GroupMin).toFixed(4));          //极差值
                            // groupInfo.GroupStdev = parseFloat(data.stdev().toFixed(4));      //标准差
                            groupInfo.GroupStdev = parseFloat(this.stdev(JSON.parse(JSON.stringify(data))).toFixed(4));
                        }
                        else if (param.groupSize == 1)   //样本容量等于1
                        {
                            if (groupInfos.length > 0) {
                                groupInfo.GroupRange = parseFloat((Math.abs(groupInfos[groupInfos.length - 1].GroupMin - groupInfo.GroupMin)).toFixed(4));
                            }
                        }
                    
                        var groupDataInfoList = new Array();

                        groupInfo.Status = 0;
                        groupInfo.ErrMsg = "";
                        data.forEach(function (i) {
                            var item = {};
                            item.MeasureData = i;
                            if (i >= param.lsl && i <= param.usl)     //判断数据是否失控
                            {
                                item.Status = 0;
                            }
                            else {
                                item.Status = 1;
                                groupInfo.Status = 1;
                                groupInfo.ErrMsg += "  超出规格限  ";
                            }
                            groupDataInfoList.push(item);
                        });
                        //for (var j = 0; j < data.length; j++) {
                        //    var item = {};
                        //    item.MeasureData = data[j];               
                        //    if (data[j] >= param.lsl && data[j] <= param.usl)     //判断数据是否失控
                        //    {
                        //        item.Status = 0;
                        //    }
                        //    else {
                        //        item.Status = 1;
                        //        groupInfo.Status = 1;
                        //        groupInfo.ErrMsg += "  超出规格限  ";
                        //    }
                        //    groupDataInfoList.push(item);
                        //}
                        groupInfo.DataInfos = groupDataInfoList;
                        groupInfos.push(groupInfo);
                    }

                }
                //计算参数
                var calculateParam = this.calculationParameters.find(function (value, index, arr) {
                    return value.GroupSize == param.groupSize;
                });

                //判断属于那一类型的
                var inGroupStdeva = 0.0; //获取组内标准差
                if (param.chartType == "IMR" && param.groupSize == 1) {
                    inGroupStdeva = parseFloat(this.stdev(totalData).toFixed(5));
                    //parseFloat((groupInfos.map(function (item) { if(item.GroupRange) return item.GroupRange; else return 0; }).sum() / groupInfos.length).toFixed(5));
                }
                if (param.chartType == "XR") {
                    inGroupStdeva = parseFloat((this.sum(groupInfos.map(function (item) { return item.GroupRange })) / groupInfos.length / calculateParam.d2).toFixed(5));
                }
                if (param.chartType == "XS") {
                    inGroupStdeva = parseFloat((this.sum(groupInfos.map(function (item) { return item.GroupStdev })) / groupInfos.length / calculateParam.c4).toFixed(5));
                }

                if (groupInfos.length > 0) {
                    xAvgs = parseFloat(this.avg(groupInfos.map(function (item) { return item.GroupAvg })).toFixed(4));
                    rAvgs = parseFloat(this.avg(groupInfos.map(function (item) { return item.GroupRange })).toFixed(4));
                    sAvgs = parseFloat(this.avg(groupInfos.map(function (item) { return item.GroupStdev })).toFixed(4));
                }

                groupInfos.forEach(function (item) {
                    item.DataInfos.forEach(function (childItem) {
                        if (childItem.Status == 1) {
                            outOfSpecCount++;
                            if (childItem.MeasureData > param.usl)
                                upUsl++;  //计算超出规格上限个数
                            else
                                underLsl++;   //计算超出规格下限个数
                        }
                    });
                });

                stdeva = parseFloat(this.stdev(totalData).toFixed(5));
                if (groupInfos.length > 1)
                    groupStdeva = parseFloat(this.stdev(groupInfos.map(function (item) { return item.GroupAvg })).toFixed(5));   //组间标准差

                if (groupInfos.length > 0) {
                    //实测性能
                    ppm = parseFloat((outOfSpecCount / (groupInfos.length * param.groupSize) * 1000000).toFixed(3));      //PPM Total
                    upUsl = parseFloat(((upUsl / (groupInfos.length * param.groupSize)) * 1000000).toFixed(3));    //PPM > USL
                    underLsl = parseFloat(((underLsl / (groupInfos.length * param.groupSize)) * 1000000).toFixed(3));   //PPM < LSL

                    if (inGroupStdeva != 0) {
                        //预测性能（组内）
                        groupUpUsl = parseFloat(((1 - this.caculatePerforms((param.usl - xAvgs) / inGroupStdeva)) * 1000000).toFixed(3));
                        groupUnderLsl = parseFloat(((this.caculatePerforms((param.lsl - xAvgs) / inGroupStdeva)) * 1000000).toFixed(3));
                        groupPpm = parseFloat((groupUnderLsl + groupUpUsl).toFixed(3));
                    }
                }

                var firstTarget = 0, firstUcl = 0, firstLcl = 0, secondUcl = 0, secondLcl = 0, secondTarget = 0;

                if (param.groupSize > 1)   //样本容量大于1
                {

                    var A1 = calculateParam.A1;
                    var A2 = calculateParam.A2;
                    var D4 = calculateParam.D4;
                    var D3 = calculateParam.D3;
                    var B4 = calculateParam.B4;
                    var B3 = calculateParam.B3;

                    firstTarget = xAvgs;
                    if (param.chartType == "XR") {
                        firstUcl = parseFloat((xAvgs + A2 * rAvgs).toFixed(3));
                        firstLcl = parseFloat((xAvgs - A2 * rAvgs).toFixed(3));
                        secondUcl = parseFloat((rAvgs * D4).toFixed(3));
                        secondLcl = parseFloat((rAvgs * D3).toFixed(3));
                        secondTarget = rAvgs;
                    }
                    else if (param.chartType == "XS") {
                        firstUcl = parseFloat((xAvgs + A1 * sAvgs).toFixed(3));
                        firstLcl = parseFloat((xAvgs - A1 * sAvgs).toFixed(3));
                        secondUcl = parseFloat((sAvgs * B4).toFixed(3));
                        secondLcl = parseFloat((sAvgs * B3).toFixed(3));
                        secondTarget = sAvgs;
                    }
                }
                else if (param.groupSize == 1)   //样本容量等于1
                {
                    rAvgs = parseFloat(this.sum(groupInfos.map(function (item) {  if(item.GroupRange != undefined){ return item.GroupRange } return 0; })) / (groupInfos.length - 1).toFixed(4));
                    firstUcl = parseFloat((xAvgs + 2.659 * rAvgs).toFixed(4));
                    firstLcl = parseFloat((xAvgs - 2.659 * rAvgs).toFixed(4));
                    firstTarget = parseFloat(((firstLcl + firstUcl) / 2).toFixed(4));
                    secondUcl = (3.267 * rAvgs);
                    secondLcl = 0;
                    secondTarget = rAvgs;
                }

                //cpk 相关数据
                var info = {}
                info.data = totalData;
                info.LSL = param.lsl;
                info.USL = param.usl;
                info.InGroupSTDEVA = inGroupStdeva;
                info.Count = totalData.length;
                info.Average = parseFloat(this.avg(totalData).toFixed(4));
                info.C = parseFloat(((param.lsl + param.usl) / 2).toFixed(4));
                info.T = parseFloat((param.usl - param.lsl).toFixed(4));
                info.Mininum = Math.min(...totalData);
                info.Maxnum = Math.max(...totalData);
                info.Range = parseFloat((info.Maxnum - info.Mininum).toFixed(4));
                info.STDEV = parseFloat(this.stdev(totalData).toFixed(4));
                var sumArr = totalData.map(function (item) {
                    return Math.pow((item - info.Average), 2);
                });
                info.Sigma = parseFloat(Math.sqrt((this.sum(sumArr) / totalData.length)).toFixed(4));
                info.Ca = parseFloat(Math.abs((info.Average - info.C) / (info.T / 2)).toFixed(4));
                info.Cpu = parseFloat(((info.USL - info.Average) / (3 * info.InGroupSTDEVA)).toFixed(4));
                info.Cpl = parseFloat(((info.Average - info.LSL) / (3 * info.InGroupSTDEVA)).toFixed(4));
                info.Cp = parseFloat((info.T / (6 * info.InGroupSTDEVA)).toFixed(4));
                
                info.Cpk = info.Cpu >= info.Cpl ? info.Cpl : info.Cpu;
                info.K = Math.abs(((param.usl + param.lsl) / 2) - info.Average) / ((param.usl - param.lsl) / 2)
                if (param.groupSize == 1)
                    info.Cpk = parseFloat(((1 - info.K) * info.Cp).toFixed(4));
                info.AvgPlus3Sigma = parseFloat((info.Average + 3 * info.Sigma).toFixed(4));
                info.AvgMinus3Sigma = parseFloat((info.Average - 3 * info.Sigma).toFixed(4));
                info.Pp = parseFloat((info.T / (6 * info.STDEV)).toFixed(4));
                info.PPU = parseFloat((((info.USL - info.Average) / (3 * info.STDEV)).toFixed(4)));
                info.PPL = parseFloat((((info.Average - info.LSL) / (3 * info.STDEV)).toFixed(4)));
                info.Ppk = Math.min(info.PPU, info.PPL);
                info.Plus3STDEV = parseFloat((info.Average + 3 * info.InGroupSTDEVA / Math.sqrt(totalData.length)).toFixed(4));
                info.Minus3STDEV = parseFloat((info.Average - 3 * info.InGroupSTDEVA / Math.sqrt(totalData.length)).toFixed(4));

                //判异规则
                //8大判异规则
                if (param.rules)
                    groupInfos = this.judgeRule(groupInfos, inGroupStdeva, param.rules);

                var mostPrecision = this.getMostPrecision(totalData);//最大精度
                var zoomMultiple = 10;//缩放倍数
                var xValue = new Array();
                var yValue = new Array();
                if (inGroupStdeva != 0)
                    this.getXValueAndYValue(inGroupStdeva, this.avg(totalData), zoomMultiple, mostPrecision, xValue, yValue);

                groupInfos.forEach(function (item) {
                    if (item.GroupRange == undefined) {
                        item.GroupRange = "N/A";
                    }
                    if (item.GroupStdev == undefined) {
                        item.GroupStdev = "N/A";
                    }
                });
                var result = {};
                result.Success = true;
                result.DataList = groupInfos;
                result.Num = groupInfos.length;
                result.array = totalData;
                result.GroupSize = param.groupSize;
                result.Target = param.targetValue;
                result.USL = param.usl;
                result.LSL = param.lsl;
                result.FirstUCL = firstUcl;
                result.FirstTarget = firstTarget;
                result.FirstLCL = firstLcl;
                result.SecondUCL = secondUcl;
                result.SecondTarget = secondTarget;
                result.SecondLCL = secondLcl;
                result.X_avgs = xAvgs;
                result.R_avgs = rAvgs;
                result.S_avgs = sAvgs;
                result.PPM = ppm;
                result.underLSL = underLsl;
                result.upUSL = upUsl;
                result.GroupSTDEVA = groupStdeva;
                result.GroupUpUSL = groupUpUsl;
                result.GroupUnderLSL = groupUnderLsl;
                result.GroupPPM = groupPpm;
                result.TotalUpUSL = totalUpUsl;
                result.TotalUnderLSL = totalUnderLsl;
                result.TotalPPM = totalPpm;
                result.CpkInfo = info;
                result.xValue = xValue;
                result.yValue = yValue;
                
                return result;

            },
            //计算组内/组间预性能
            caculatePerforms(b) {
                // // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
                // if (b === "" || b == null || b == undefined) {
                //     // alert('正态分布输入数据错误，为"' + String(b) + '"');
                //     window.parent.noData()
                //     throw '正态分布输入数据错误，为"' + String(b) + '"';
                // }
                // if (isNaN(b)) {
                //     // alert('正态分布输入数据错误，为"' + String(b) + '"');
                //     window.parent.noData()
                //     throw '正态分布输入数据错误，为"' + String(b) + '"';
                // }

                var S = 2;
                var Q = 0;
                while (true) {
                    var a = b - S;
                    var M = 1, N = 1, k = 1, m = 1;
                    var ep, I, h;
                    ep = 0.000000000001;
                    h = b - a;
                    I = h * (this.F(a) + this.F(b)) / 2;
                    //double[,] T = new double[5000, 5000];
                    var T = new Array(1000);
                    for (var ti = 0; ti < T.length; ti++) {
                        T[ti] = new Array(1000);
                    }
                    T[1][1] = I;

                    while (true) {
                        N = Math.floor(Math.pow(2, m - 1));
                        h = h / 2;
                        I = I / 2;
                        for (var i = 1; i <= N; i++)
                            I = I + h * this.F(a + (2 * i - 1) * h);
                        T[m + 1][1] = I;
                        M = 2 * N;
                        k = 1;
                        while (M > 1) {
                            T[m + 1][k + 1] = (Math.pow(4, k) * T[m + 1][k] - T[m][k]) / (Math.pow(4, k) - 1);
                            M = M / 2;
                            k = k + 1;
                        }
                        if (Math.abs(T[k][k] - T[k - 1][k - 1]) < ep)
                            break;
                        m = m + 1;
                    }
                    I = T[k][k];
                    Q = Q + I;
                    if (Math.abs(I) < ep)
                        return Q;
                    b = a; S = 2 * S;
                }
            },
            //CaculatePerforms函数中的引用函数
            F(x) {
                var f = Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
                return f;
            },
            //获取最大精度
            getMostPrecision(sampleData) {
                if (sampleData == undefined || sampleData.length == 0) {
                    return 0;
                }

                var mostPrecision = 0;
                var tempValue = 0;

                sampleData.forEach(function (item) {
                    var data = String(Math.abs(item));
                    var dateLength = data.length;
                    var dotIndex = data.indexOf(".");
                    if (dotIndex > 0) {
                        tempValue = dateLength - (dotIndex + 1);
                    }
                    if (tempValue > mostPrecision) //取更大的精度
                    {
                        mostPrecision = tempValue;
                    }

                });
                return mostPrecision;
            },
            //获取x y 值信息用于描绘曲线
            getXValueAndYValue(sigma, xbar, zoomMultiple, mostPrecision, xValues, yValues) {
                try {
                    var coefficient = (1 / Math.sqrt(2 * Math.PI) / sigma);//系数；如果计算需要精确，就不要四舍五入；建议：为了提高运算效率要四舍五入。
                    var positiveLimit = parseInt((xbar + 6 * sigma) * zoomMultiple); //X轴的正界限
                    var minusLimit = parseInt((xbar - 6 * sigma) * zoomMultiple); //X轴的负界限               
                    for (var x = minusLimit; x <= positiveLimit; x++) {
                        //x轴缩小zoomMultiple倍x每隔1/zoomMultiple变化曲线变平滑
                        var xValue = x / zoomMultiple;
                        var yValue = coefficient * Math.exp(Math.pow((xValue - xbar), 2) / (-2 * Math.pow(sigma, 2)));
                        //xValue = parseFloat(xValue.toFixed(mostPrecision));
                        //yValue = parseFloat(yValue.toFixed(mostPrecision));
                        if (yValue > 0)//可设为yValue > 0
                        {
                            xValues.push(xValue);
                            yValues.push(yValue);
                        }
                    }
                    return true;
                } catch (e) {
                    return false;
                }
            },
            //缩放倍数
            zoomMultiple(mostPrecision) {
                var zoomMultiple = Math.pow(10, mostPrecision - 1);

                if (mostPrecision <= 2) //保证精度大于二的数据序列图形的平滑
                {
                    mostPrecision = 4;
                    zoomMultiple = 1000;
                }

                return zoomMultiple;
            },
            //判异规则
            judgeRule(ginfo, sigma, roles) {
                var a = new Array();
                var strRule = roles.map(function (item) { return item.id }).join(',');
                var avg = this.avg(ginfo.map(function (item) { return item.GroupAvg }));
                //一倍标准差区域
                var oneSigmaHigh = avg + sigma / Math.sqrt(ginfo.length);
                var oneSigmaLow = avg - sigma / Math.sqrt(ginfo.length);
                //两倍标准差区域
                var twoSigmaHigh = avg + 2 * sigma / Math.sqrt(ginfo.length);
                var twoSigmaLow = avg - 2 * sigma / Math.sqrt(ginfo.length);
                //三倍标准差区域
                var threeSigmaHigh = avg + 3 * sigma / Math.sqrt(ginfo.length);
                var threeSigmaLow = avg - 3 * sigma / Math.sqrt(ginfo.length);

                //一个点落在A区以外 3sigma外
                if (strRule.indexOf('1') > -1) {
                    ginfo.forEach(function (item) {
                        if (item.GroupAvg > threeSigmaHigh || item.GroupAvg < threeSigmaLow) {
                            item.ErrMsg += "  一个点落在A区以外  ";
                            item.Status = 1;
                        }
                    });
                }

                //连续9点落在中心线同一侧
                var role;
                var i;
                var j;
                var flag;
                if (strRule.indexOf('2') > -1) {
                    role = roles.find(function (item) {
                        return item.id == 2;
                    });

                    if (ginfo.length > role.seriesCount - 1) {
                        for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                            j = 0;
                            flag = false;
                            while (j < role.seriesCount) {
                                if (ginfo[i + j].GroupAvg < avg)
                                    flag = true;
                                else {
                                    flag = false;
                                    break;
                                }
                                j++;
                            }
                            if (flag) {
                                ginfo[i + role.seriesCount - 1].Status = 1;
                                ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点落在中心线同一侧  ";
                                continue;
                            }

                            j = 0;
                            while (j < role.seriesCount) {
                                if (ginfo[i + j].GroupAvg > avg)
                                    flag = true;
                                else {
                                    flag = false;
                                    break;
                                }
                                j++;
                            }

                            if (flag) {
                                ginfo[i + role.seriesCount - 1].Status = 1;
                                ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点落在中心线同一侧  ";
                            }
                        }
                    }
                }

                //连续6点递增或递减
                if (strRule.indexOf('3') > -1) {
                    role = roles.find(function (item) {
                        return item.id == 3;
                    });

                    if (ginfo.length > role.seriesCount - 1) {
                        for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                            j = 0;
                            flag = false;
                            while (j < role.seriesCount - 1) {
                                if (ginfo[i + j].GroupAvg < ginfo[i + j + 1].GroupAvg)
                                    flag = true;
                                else {
                                    flag = false;
                                    break;
                                }
                                j++;
                            }
                            if (flag) {
                                ginfo[i + role.seriesCount - 1].Status = 1;
                                ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点递增或递减  ";
                                continue;
                            }

                            j = 0;
                            while (j < role.seriesCount - 1) {
                                if (ginfo[i + j].GroupAvg > ginfo[i + j + 1].GroupAvg)
                                    flag = true;
                                else {
                                    flag = false;
                                    break;
                                }
                                j++;
                            }
                            if (flag) {
                                ginfo[i + role.seriesCount - 1].Status = 1;
                                ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点递增或递减  ";
                            }
                        }
                    }
                }

                //连续14点中相邻点交替上下
                if (strRule.indexOf('4') > -1) {
                    role = roles.find(function (item) {
                        return item.id == 4;
                    });

                    if (ginfo.length > role.seriesCount - 1) {
                        for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                            j = 0;
                            flag = false;
                            while (j < role.seriesCount - 1) {
                                if ((j % 2 == 0) == (ginfo[i + j].GroupAvg < ginfo[i + j + 1].GroupAvg) && ginfo[i + j].GroupAvg != ginfo[i + j + 1].GroupAvg) {
                                    flag = true;
                                }
                                else {
                                    flag = false;
                                    break;
                                }
                                j++;

                            }
                            if (flag) {
                                ginfo[i + role.seriesCount - 1].Status = 1;
                                ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点中相邻点交替上下  ";
                                continue;
                            }

                            j = 0;
                            while (j < role.seriesCount - 1) {
                                if ((j % 2 == 0) == (ginfo[i + j].GroupAvg > ginfo[i + j + 1].GroupAvg) && ginfo[i + j].GroupAvg != ginfo[i + j + 1].GroupAvg) {
                                    flag = true;
                                }
                                else {
                                    flag = false;
                                    break;
                                }
                                j++;

                            }
                            if (flag) {
                                ginfo[i + role.seriesCount - 1].Status = 1;
                                ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点中相邻点交替上下  ";
                            }

                        }
                    }
                }

                //连续3点中有2点落在中心线同一侧的B区以外
                var k;
                var number;
                if (strRule.indexOf('5') > -1) {
                    role = roles.find(function (item) {
                        return item.id == 5;
                    });

                    if (ginfo.length > role.seriesCount - 1) {
                        for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                            j = 0;
                            k = 0;
                            while (j < role.seriesCount) {
                                if (ginfo[i + j].GroupAvg > twoSigmaHigh && ginfo[i + j].GroupAvg < threeSigmaHigh) {
                                    k++;
                                }
                                j++;
                            }
                            if (k == role.insideCount) {
                                number = 0;
                                ginfo.slice(i, i + role.seriesCount).forEach(function (item, index) {
                                    if (item.GroupAvg > twoSigmaHigh && item.GroupAvg < threeSigmaHigh) {
                                        number = index;
                                    }
                                });
                                ginfo[i + number].Status = 1;
                                ginfo[i + number].ErrMsg += "连续" + role.seriesCount + "点中有" + role.insideCount + "点落在中心线同一侧的B区以外";
                                continue;
                            }
                            j = 0;
                            k = 0;
                            while (j < role.seriesCount) {
                                if (ginfo[i + j].GroupAvg < twoSigmaLow && ginfo[i + j].GroupAvg > threeSigmaLow) {
                                    k++;
                                }
                                j++;
                            }
                            if (k == role.insideCount) {
                                number = 0;

                                ginfo.slice(i, i + role.seriesCount).forEach(function (item, index) {
                                    if (item.GroupAvg < twoSigmaLow && item.GroupAvg > threeSigmaLow) {
                                        number = index;
                                    }
                                });
                                ginfo[i + number].Status = 1;
                                ginfo[i + number].ErrMsg += "连续" + role.seriesCount + "点中有" + role.insideCount + "点落在中心线同一侧的B区以外";

                            }
                        }
                    }
                }

                //连续5点中有4点落中心线同一侧的C区以外
                if (strRule.indexOf('6') > -1) {
                    role = roles.find(function (item) {
                        return item.id == 6;
                    });

                    if (ginfo.length > role.seriesCount - 1) {
                        for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                            j = 0;
                            k = 0;
                            while (j < role.seriesCount) {
                                if (ginfo[i + j].GroupAvg > oneSigmaHigh && ginfo[i + j].GroupAvg < threeSigmaHigh) {
                                    k++;
                                }
                                j++;
                            }
                            if (k == role.insideCount) {

                                number = 0;

                                ginfo.slice(i, i + role.seriesCount).forEach(function (item, index) {
                                    if (item.GroupAvg > oneSigmaHigh && item.GroupAvg < threeSigmaHigh) {
                                        number = index;
                                    }
                                });
                                ginfo[i + number].Status = 1;
                                ginfo[i + number].ErrMsg += "连续" + role.seriesCount + "点中有" + role.insideCount + "点落中心线同一侧的C区以外";

                                continue;
                            }

                            j = 0;
                            k = 0;
                            while (j < role.seriesCount) {
                                if (ginfo[i + j].GroupAvg < oneSigmaLow && ginfo[i + j].GroupAvg > threeSigmaLow) {
                                    k++;
                                }
                                j++;
                            }
                            if (k == role.insideCount) {

                                number = 0;

                                ginfo.slice(i, i + role.seriesCount).forEach(function (item, index) {
                                    if (item.GroupAvg < oneSigmaLow && item.GroupAvg > threeSigmaLow) {
                                        number = index;
                                    }
                                });
                                ginfo[i + number].Status = 1;
                                ginfo[i + number].ErrMsg += "连续" + role.seriesCount + "点中有" + role.insideCount + "点落中心线同一侧的C区以外";


                            }


                        }
                    }
                }

                //连续15点落在中心线两侧的C区内
                if (strRule.indexOf('7') > -1) {
                    role = roles.find(function (item) {
                        return item.id == 7;
                    });

                    if (ginfo.length > role.seriesCount - 1) {
                        for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                            j = 0;
                            flag = false;
                            while (j < role.seriesCount) {
                                if (ginfo[i + j].GroupAvg > oneSigmaHigh || ginfo[i + j].GroupAvg < oneSigmaLow) {
                                    flag = false;
                                    break;
                                }
                                flag = true;
                                j++;
                            }
                            if (flag) {
                                ginfo[i + role.seriesCount - 1].Status = 1;
                                ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点落在中心线两侧的C区内  ";
                            }
                        }
                    }
                }

                //连续8点落在中心线两侧且无一在C区内
                if (strRule.indexOf('8') > -1) {
                    role = roles.find(function (item) {
                        return item.id == 8;
                    });

                    if (ginfo.length > role.seriesCount - 1) {
                        for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                            j = 0;
                            flag = false;
                            while (j < role.seriesCount) {
                                if (ginfo[i + j].GroupAvg < oneSigmaHigh && ginfo[i + j].GroupAvg > oneSigmaLow) {
                                    flag = false;
                                    break;
                                }
                                flag = true;
                                j++;
                            }
                            if (flag) {
                                ginfo[i + role.seriesCount - 1].Status = 1;
                                ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点落在中心线两侧且无一在C区内  ";
                            }
                        }
                    }
                }

                return ginfo;
            },
        }
    }
</script>
<style>
#spcChart .ivu-tabs-content.ivu-tabs-content-animated {
    flex: 0 1 auto;
    padding: 0px;
    overflow: visible;
}
#spcChart .ivu-tabs{
    height:500px!important;
}
#spcChart p{
    padding:0;
}
#spcChart .ivu-card-head p{
    font-weight: normal;
    color:#5C5C5C
}
#spcChart .ivu-card-head{
    padding:5px 0;
    text-align: center;
}
#spcChart .ivu-card-body{
    font-size:12px;
    color:#8B8B8B;
    line-height: 22px;

}
#spcChart .ivu-col .ivu-col{
    padding:0!important
}
#spcChart .ivu-card{
    margin-bottom:24px;
}
#spcChart .chartNote span{
    margin-right:10px;
    font-size:12px;
}
#spcChart .chartNote em{
    font-style:normal;
    margin-right:10px;
    font-size:12px;
}
#spcChart .ivu-tabs-nav-scroll{
    text-align:center;
}
#spcChart .nav-text.ivu-tabs-nav{
    float:none;
    display: inline-block;
}
#spcChart .ivu-tabs-bar{
    margin-right:0!important;
    margin-bottom:25px;
}
</style>