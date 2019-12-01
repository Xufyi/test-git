<template>
    <Table class="inspectionPeriod noBorder" :columns="columns" size="small" :data="data"></Table>
</template>

<script>
    import $ from "jquery"
    export default {
        // name: '',
        props:['timeIntervalArray',"paramsInfo"],
        data() {
            return {
                columns: [
                    {
                        title: '08:00~09:00',
                        key:"08:00~09:00",
                        width:81
                    },
                    {
                        title: '09:00~10:00',
                        key:'09:00~10:00',
                        width:81
                    }
                ],
                data:[
                    {
                        "08:00~09:00":'1',
                        "09:00~10:00":'1',
                    }
                ],
            }
        },
        watch:{
        },
        created(){
            this.data[0] = this.$props.timeIntervalArray
            // console.log('timeIntervalArray===>',this.data)
            let columns = []
            for(let key in this.data[0]){
                let value = this.data[0][key]
                columns.push({
                    title:key,
                    key:key,
                    width:81,
                    render:(h,params)=>{
                        return h("div", [
                            h("Input", {
                                /* style:{
                                        background:this.stylefun(params)
                                    }, */
                                props: {
                                    type: "text",
                                    value:this.data[0][key]
                                },
                                on: {
                                    "on-blur": event => {
                                        this.data[0][key] = event.target.value;
                                        this.saveRow()

                                        let index = params.index
                                        let keys = params.column.key
                                        let string = event.target.value
                                        this.stringHandling(string,index,keys)
                                        // this.stylefun(params)

                                    }
                                }
                            })
                        ]);
                    }
                })
            }
            this.columns=columns
            
        },
        methods:{
            //标红处理
            stylefun(params){
                let background = ''
                let paramInfo = this.$props.paramsInfo.row
                let usl = paramInfo.usl
                let lsl = paramInfo.lsl
                //判断是否为度分秒格式
                if(usl.indexOf('°') != -1 && usl.indexOf('′') != -1 && usl.indexOf('″') != -1){
                    usl = this.DegreeConvertBack(usl)
                }
                if(lsl.indexOf('°') != -1 && lsl.indexOf('′') != -1 && lsl.indexOf('″') != -1){
                    lsl = this.DegreeConvertBack(lsl)
                }
                usl = Number(usl)
                lsl = Number(lsl)
                //判断是否有上下限
                if(paramInfo.usl == '' || paramInfo.lsl == '') return;
                let initval = this.data[params.index][params.column.key]
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
            DegreeConvertBack(value){ //度分秒转换成为度
                var du = value.split("°")[0];
                var fen = value.split("°")[1].split("′")[0];
                var miao = value.split("°")[1].split("′")[1].split('″')[0];
                return Math.abs(du) + (Math.abs(fen)/60 + Math.abs(miao)/3600);
            },
            //将“1,2,3，” 格式字符串转换为度分秒
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
                            this.data[index][key] = stringArrValue
                        }
                    }
                }
            },
            saveRow(){
                this.$emit('saveRow',this.data[0])
            }
        },

    }
</script>

<style>
.inspectionPeriod {
    border: 0!important;
    width:100%;
}
.inspectionPeriod th{
    height:24px!important;
}
.inspectionPeriod td{
    height:20px!important;
}
.inspectionPeriod input{
    border:0!important;
}
</style>