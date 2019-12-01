<template>
    <div class="isborder">
        <Table :columns="columns1" :id="index" :style="$props.expand ? 'height:auto' : 'height:32px'" :show-header="false" size="small" :data="bindData"></Table>
    </div>
</template>

<script>
    import $ from "jquery"
    export default {
        // name: '',
        props:['scale','sampleNum','paramsInfo','paramValuearray','isdisabled','aa','index','paramsindex','tag','expand','chkDevId','unitSymbol',"axx"],
        data() {
            return {
                // isdisabled:false,
                expandSign:true,
                indexs:'',
                disable:true,
                paramValue:[],
                sampleNumList:[], 
                severalfold:0,
                paramsData:null,
                eventData:null,
                newSmpleNum:this.$props.sampleNum,
                columns1: [
                    {
                    title: 1,
                        key:"key1",
                        render: (h, params) => {
                                var me = this;
                                return h('div', [h('Input', {
                                    style:{
                                        background:this.stylefun(params)
                                    },
                                    props: {
                                        type: 'text',
                                        value: this.data1[params.index][params.column.key],
                                        disabled:this.$props.isdisabled
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            console.log(me.$props,"$props$props$props");
                                            this.toFixed(event)
                                            let index = params.index
                                            let key = params.column.key
                                            this.data1[index][key] = event.target.value
                                            let string = event.target.value
                                            this.stringHandling(string,index,key)
                                            this.emitEvent(params.index)
                                            if(this.$props && this.$props.sampleNum){
                                                let num = this.$props.sampleNum
                                                if(num >= 10){
                                                    this.isNewRow(num,params.index);
                                                }
                                            }
                                        },
                                        "on-keydown":event=>{
                                            this.paramsCalculate()
                                        },
                                        "on-keyup":event=>{
                                            
                                            this.paramsFocus(0)
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                    title: 2,
                        key:"key2",
                        render: (h, params) => {
                                var me = this;
                                return h('div', [h('Input', {
                                    style:{
                                        background:this.stylefun(params)
                                    },
                                    props: {
                                        type: 'text',
                                        value: this.data1[params.index][params.column.key],
                                        disabled:this.$props.isdisabled
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.toFixed(event)
                                            let index = params.index
                                            let key = params.column.key
                                            this.data1[index][key] = event.target.value
                                            let string = event.target.value
                                            this.stringHandling(string,index,key)
                                            this.emitEvent(params.index)
                                            if(this.$props && this.$props.sampleNum){
                                                let num = this.$props.sampleNum
                                                if(num >= 10){
                                                    this.isNewRow(num,params.index);
                                                }
                                            }
                                        },
                                        "on-keydown":event=>{
                                            this.paramsCalculate()
                                        },
                                         "on-keyup":event=>{
                                            this.paramsFocus(0)
                                        }
                                    }

                                })
                            ])
                        }
                    },
                    {
                    title: 3,
                        key:"key3",
                        render: (h, params) => {
                                var me = this;
                                return h('div', [h('Input', {
                                    style:{
                                        background:this.stylefun(params)
                                    },
                                    props: {
                                        type: 'text',
                                        value: this.data1[params.index][params.column.key],
                                        disabled:this.$props.isdisabled
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.toFixed(event)
                                            let index = params.index
                                            let key = params.column.key
                                            this.data1[index][key] = event.target.value
                                            let string = event.target.value
                                            this.stringHandling(string,index,key)
                                            this.emitEvent(params.index)
                                            if(this.$props && this.$props.sampleNum){
                                                let num = this.$props.sampleNum
                                                if(num >= 10){
                                                    this.isNewRow(num,params.index);
                                                }
                                            }
                                        },
                                        "on-keydown":event=>{
                                            this.paramsCalculate()
                                        },
                                         "on-keyup":event=>{
                                            this.paramsFocus(0)
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                    title: 4,
                        key:"key4",
                        render: (h, params) => {
                                var me = this;
                                return h('div', [h('Input', {
                                    style:{
                                        background:this.stylefun(params)
                                    },
                                    props: {
                                        type: 'text',
                                        value: this.data1[params.index][params.column.key],
                                        disabled:this.$props.isdisabled
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.toFixed(event)
                                            let index = params.index
                                            let key = params.column.key
                                            this.data1[index][key] = event.target.value
                                            let string = event.target.value
                                            this.stringHandling(string,index,key)
                                            this.emitEvent(params.index)
                                            if(this.$props && this.$props.sampleNum){
                                                let num = this.$props.sampleNum
                                                if(num >= 10){
                                                    this.isNewRow(num,params.index);
                                                }
                                            }
                                        },
                                        "on-keydown":event=>{
                                            this.paramsCalculate()
                                        },
                                         "on-keyup":event=>{
                                            this.paramsFocus(0)
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                    title: 5,
                        key:"key5",
                        render: (h, params) => {
                                var me = this;
                                return h('div', [h('Input', {
                                    style:{
                                        background:this.stylefun(params)
                                    },
                                    props: {
                                        type: 'text',
                                        value: this.data1[params.index][params.column.key],
                                        disabled:this.$props.isdisabled
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.toFixed(event)
                                            let index = params.index
                                            let key = params.column.key
                                            this.data1[index][key] = event.target.value
                                            let string = event.target.value
                                            this.stringHandling(string,index,key)
                                            this.emitEvent(params.index)
                                            if(this.$props && this.$props.sampleNum){
                                                let num = this.$props.sampleNum
                                                if(num >= 10){
                                                    this.isNewRow(num,params.index);
                                                }
                                            }
                                        },
                                        "on-keydown":event=>{
                                            this.paramsCalculate()
                                        },
                                         "on-keyup":event=>{
                                            this.paramsFocus(0)
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                    title: 6,
                        key:"key6",
                        render: (h, params) => {
                                var me = this;
                                return h('div', [h('Input', {
                                    style:{
                                        background:this.stylefun(params)
                                    },
                                    props: {
                                        type: 'text',
                                        value: this.data1[params.index][params.column.key],
                                        disabled:this.$props.isdisabled
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.toFixed(event)
                                            let index = params.index
                                            let key = params.column.key
                                            this.data1[index][key] = event.target.value
                                            let string = event.target.value
                                            this.stringHandling(string,index,key)
                                            this.emitEvent(params.index)
                                            if(this.$props && this.$props.sampleNum){
                                                let num = this.$props.sampleNum
                                                
                                                if(num >= 10){
                                                    
                                                    this.isNewRow(num,params.index);
                                                }
                                            }
                                        },
                                        "on-keydown":event=>{
                                            this.paramsCalculate()
                                        },
                                         "on-keyup":event=>{
                                            this.paramsFocus(0)
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                    title: 7,
                        key:"key7",
                        render: (h, params) => {
                                var me = this;
                                return h('div', [h('Input', {
                                    style:{
                                        background:this.stylefun(params)
                                    },
                                    props: {
                                        type: 'text',
                                        value: this.data1[params.index][params.column.key],
                                        disabled:this.$props.isdisabled
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.toFixed(event)
                                            let index = params.index
                                            let key = params.column.key
                                            this.data1[index][key] = event.target.value
                                            let string = event.target.value
                                            this.stringHandling(string,index,key)
                                            this.emitEvent(params.index)
                                            if(this.$props && this.$props.sampleNum){
                                                let num = this.$props.sampleNum
                                                if(num >= 10){
                                                    this.isNewRow(num,params.index);
                                                }
                                            }
                                        },
                                        "on-keydown":event=>{
                                            this.paramsCalculate()
                                        },
                                         "on-keyup":event=>{
                                            this.paramsFocus(0)
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                    title: 8,
                        key:"key8",
                        render: (h, params) => {
                                var me = this;
                                return h('div', [h('Input', {
                                    style:{
                                        background:this.stylefun(params)
                                    },
                                    props: {
                                        type: 'text',
                                        value: this.data1[params.index][params.column.key],
                                        disabled:this.$props.isdisabled
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.toFixed(event)
                                            let index = params.index
                                            let key = params.column.key
                                            this.data1[index][key] = event.target.value
                                            let string = event.target.value
                                            this.stringHandling(string,index,key)
                                            this.emitEvent(params.index)
                                            if(this.$props && this.$props.sampleNum){
                                                let num = this.$props.sampleNum
                                                if(num >= 10){
                                                    this.isNewRow(num,params.index);
                                                }
                                            }
                                        },
                                        "on-keydown":event=>{
                                            this.paramsCalculate()
                                        },
                                         "on-keyup":event=>{
                                            this.paramsFocus(0)
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: 9,
                        key:"key9",
                        render: (h, params) => {
                                var me = this;
                                return h('div', [h('Input', {
                                    style:{
                                        background:this.stylefun(params)
                                    },
                                    props: {
                                        type: 'text',
                                        value: this.data1[params.index][params.column.key],
                                        disabled:this.$props.isdisabled
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.toFixed(event)
                                            let index = params.index
                                            let key = params.column.key
                                            this.data1[index][key] = event.target.value
                                            let string = event.target.value
                                            this.stringHandling(string,index,key)
                                            this.emitEvent(params.index)
                                            if(this.$props && this.$props.sampleNum){
                                                let num = this.$props.sampleNum
                                                if(num >= 10){
                                                    this.isNewRow(num,params.index);
                                                }
                                            }
                                        },
                                        "on-keydown":event=>{
                                            this.paramsCalculate()
                                        },
                                         "on-keyup":event=>{
                                            this.paramsFocus(0)
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                    title:10,
                        key:"key10",
                            render: (h, params) => {
                                var me = this;
                                return h('div', [h('Input', {
                                    style:{
                                        background:this.stylefun(params)
                                    },
                                    props: {
                                        type: 'text',
                                        value: this.data1[params.index][params.column.key],
                                        disabled:this.$props.isdisabled
                                    },
                                    on: {
                                        'on-blur': (event) => {
                                            this.toFixed(event)
                                            let index = params.index
                                            let key = params.column.key
                                            this.data1[index][key] = event.target.value
                                            let string = event.target.value
                                            this.stringHandling(string,index,key)
                                            this.emitEvent(params.index)
                                            if(this.$props && this.$props.sampleNum){
                                                let num = this.$props.sampleNum
                                                if(num >= 10){
                                                    this.isNewRow(num,params.index);
                                                }
                                            }
                                        },
                                        "on-keydown":event=>{
                                            this.paramsCalculate()
                                        },
                                         "on-keyup":event=>{
                                             let ipt = $(".isborder input")
                                            //  console.log(ipt,"ipt");
                                             
                                            this.paramsFocus(1)
                                        }
                                    }
                                })
                            ])
                        }
                    }
                ],
                data1: [] //[ {key1:,key2 ... key10} , {} ]
                ,bindData:[],
                unitSymbolArr:[],
                separatorField:"",
                paramsIndex:null,
                multiple:1,
            }
        },
        created(){
            if(this.$props.chkDevId){
                this.$http.get('/basic/chkdev/'+this.$props.chkDevId).then((res)=>{
                    if(!res.data.chkAutoCollect){return}
                    this.unitSymbolArr = res.data.chkAutoCollect.unitSymbolArr||[]
                    this.separatorField = res.data.chkAutoCollect.separatorField||null
                    let unitList = this.$iqis.objects.unitList
                    for(let x in unitList){//遍历所有单位类别
                        for(let y in this.unitSymbolArr){//遍历所选设备带出的所有单位
                            let mesUnitIndex = unitList[x].units.indexOf(this.$props.unitSymbol.toLowerCase())//after测量单位在该类别下的位置
                            let chooseUnitIndex = unitList[x].units.indexOf(this.unitSymbolArr[y].toLowerCase())//before所选设备的某个单位在该类别下的位置
                            if(mesUnitIndex!=-1&&chooseUnitIndex!=-1){//两个单位同在该类别下
                                this.paramsIndex = y//得到与测量单位相匹配的所选设备带出单位的索引
                                // 计算倍数
                                if(chooseUnitIndex>mesUnitIndex){//若是大单位转小单位，则倍数相乘
                                    for(var z = mesUnitIndex;z<chooseUnitIndex;z++){//从小单位的索引开始，到大单位的索引结束，不包括大单位的索引
                                        this.multiple = this.multiple*unitList[x].multiple[z]
                                    }
                                }else{
                                    for(var z = chooseUnitIndex;z<mesUnitIndex;z++){
                                        this.multiple = this.multiple/unitList[x].multiple[z]
                                    }
                                }
                            }
                        }
                    }
                })
            }
        },
        mounted(){
            this.indexs = this.$props.index
            this.tablefun()
            $(this.index).height(34)
            $('.ivu-table-overflowY').css('overflow', 'hidden')
            // $(".ivu-table-tbody td").attr('class','ivu-table-num')
        },
        methods:{
            paramsCalculate(){
                if(event.keyCode==13&&this.$props.chkDevId){
                    // console.log(this.$iqis.objects.unitList,'unitList')
                    if(this.separatorField&&this.unitSymbolArr){
                        let arr = event.target.value.split(this.separatorField)//设备所传值转为数组
                        event.target.value = arr[this.paramsIndex]*this.multiple
                    }
                }
            },
            paramsFocus(index){
                if(index===0&&event.keyCode==13){
                $(event.target).parents('td').next().find('input').focus()
                }else if(index==1&&event.keyCode==13){
                $(event.target).parents('.ivu-table-row').next().find('td:first-child input').focus()
                // $($(event.target).parents('.ivu-table-row').get(0)).next().find('td:first-child input').focus()
                }
            },
            //字符创处理
            stringHandling(string,index,key){
                let strings = string.replace(/，/g,",")
                let j = 0
                let stringArr = ''
                if(strings !== Number){
                    stringArr = strings.split('');//把字符串转换为数组
                    for(let i = 0; i < stringArr.length; i++){
                        if(stringArr[i] == ','){
                           j++
                        }
                    }
                    // ["12", "34", "56", ""]78°29′24″
                    if(j === 3){
                        stringArr = strings.split(',')
                        if(stringArr.length === 4){
                            stringArr.splice(1,0,'°')
                            stringArr.splice(3,0,'′')
                            stringArr.splice(6,0,'″')
                            let stringArrValue = stringArr.join("")
                            this.DegreeConvertBack(stringArrValue)
                            this.data1[index][key] = stringArrValue
                        }
                    }
                }
            },
            DegreeConvertBack(value){ //度分秒转换成为度
                var du = value.split("°")[0];
                var fen = value.split("°")[1].split("′")[0];
                var miao = value.split("°")[1].split("′")[1].split('″')[0];
                return Math.abs(du) + (Math.abs(fen)/60 + Math.abs(miao)/3600);
                
                
            },
            toFixed(event) {
                if(!event.target.value)return
                event.target.value = Number(event.target.value).toFixed(this.$props.scale)
            },
            stylefun(params){
                let background = ''
                let paramInfo = this.$props.paramsInfo
                console.log(paramInfo,"paramInfoparamInfoparamInfoparamInfoparamInfo");
                let usl = paramInfo.usl || null
                let lsl = paramInfo.lsl || null
                //判断是否为度分秒格式
                if(usl && lsl && usl.indexOf('°') != -1 && usl.indexOf('′') != -1 && usl.indexOf('″') != -1){
                    usl = this.DegreeConvertBack(usl)
                }
                if(usl && lsl && lsl.indexOf('°') != -1 && lsl.indexOf('′') != -1 && lsl.indexOf('″') != -1){
                    lsl = this.DegreeConvertBack(lsl)
                }
                usl = Number(usl)
                lsl = Number(lsl)
                //判断是否有上下限
                if(paramInfo.usl == '' || paramInfo.lsl == '') return;
                let initval = this.data1[params.index][params.column.key]
                if(initval.indexOf('°') != -1 && initval.indexOf('′') != -1 && initval.indexOf('″') != -1){
                    initval = this.DegreeConvertBack(initval)
                }
                let val = Number(initval)
                if(initval!=''&&(val > usl || val < lsl)){
                    background='red'
                }else{
                    background='transparent'
                }
            return background;
            },
            //同步参数记录到父级
            emitEvent(index){
                let istrue = null
                for(let i = 0; i < this.data1.length; i++){
                    let arr = []
                    for(let key in this.data1[i]){
                        arr.push(this.data1[i][key])
                    }    
                }
                this.paramValue = []
                for(let val = 0; val < this.data1.length; val++){
                    for(let key in this.data1[val]){
                        this.paramValue.push(this.data1[val][key])
                    }
                }
                this.$emit("paramvalue",this.paramValue)
            },
            //判断是否增加新行
            isNewRow(num,index){

                let isnewRow = true
                for(let i = 0; i < this.data1.length; i++){
                    for(let key in this.data1[i]){
                        isnewRow = isnewRow && this.data1[i][key] !== '';
                    }
                }
                //插入空行
                let maxlength = Math.ceil(num / 10) //倍数
                if(isnewRow && this.data1.length < maxlength){
                    this.data1.push({key1: '',key2: '',key3: '',key4: '',key5: '',key6: '',key7: '',key8: '',key9: '',key10:'' })
                    
                    
                    this.bindData = JSON.parse(JSON.stringify(this.data1))
                    console.log(this.data1,"this.data1");
                    console.log(this.bindData,"this.bindData");
                }
            },
            tablefun(){
                let arr = this.$props.paramValuearray
                if(this.$props.paramValuearray && arr.length >0){
                    console.log("ififififififif");
                    
                    let multiple = arr.length / 10
                    for(let j = 0; j < multiple; j++){
                        let o = {key1: '',key2: '',key3: '',key4: '',key5: '',key6: '',key7: '',key8: '',key9: '',key10:'' };
                        for(let key in o){
                            let index =Number(key.substring(3)) -1;
                            let value = arr[j*10 + index]
                            o[key] = value || ""
                        }
                        this.data1.push(o);
                    }
                }else{
                    this.data1.push({key1: '',key2: '',key3: '',key4: '',key5: '',key6: '',key7: '',key8: '',key9: '',key10:'' })
                }
                this.bindData = JSON.parse(JSON.stringify(this.data1))
                if(this.$props && this.$props.sampleNum){
                    let num = this.$props.sampleNum
                }   
            }
        },
    }
</script>

<style>
    .isborder .ivu-table-wrapper{
        border: none !important;
    } 
    .isborder .ivu-table:before {
    content: '';
    width: 100%;
    height: 0px;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color:white;
    z-index: 1;
}
.isborder .ivu-input{
    border: 0px solid red!important;
}
.isborder .ivu-table-overflowY{
    overflow: hidden;
}
.isborder .ivu-input-disabled{
    background-color: transparent !important;
}
</style>