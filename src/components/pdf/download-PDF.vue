<template>
    <div class="canvas-PDF">
        <!-- <div><button @click="pdf" class="btn">下载PDF</button></div> -->
        <div style="padding-top:10px;padding-left:10px">
            <Button @click="pdf" type="primary" size="large" :loading="exportLoading">
                    
                <span v-if="!exportLoading">下载PDF</span>
                <span v-else>下载中</span>
            </Button>
        </div>
        <div class="singleChart" v-if="type!='multiple'"><img :src="img" alt=""></div>
        <div class="moreChart" v-if="type=='multiple'">
            <div class="print-page" :id="'page-'+index" v-for="(item,index) in urls" :key="index">
                <img :src="item" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    import html2canvas from 'html2canvas';
    import jsPDF from 'jspdf';
    import $ from "jquery";
    import LocalStorage from '@/utils/localStorage'
    export default {
        name: '',
        data() {
            return {
                img:'',
                urls:'',
                type:'',//multiple多图，single单图
                exportLoading:false,
            }
        },
        // inject:["doms"],
        created () {
        },
        mounted () {
            let a = this.$route.query.x
            this.img = this.$route.query.x
            this.type = this.$route.query.type
            this.urls = this.type=='multiple'?JSON.parse(this.$LocalStorage.get('grrReportUrls')):[]
        },
        watch: {
            
        },
        methods: {
            pdf(){
                let that = this;
                this.exportLoading = true;
                if(this.type=='multiple'){
                    let pdf = new jsPDF('p', 'pt', 'a4');
                    let pages = $(".print-page");
                    let cmpPages = {};
                    let cmpCount = 0;
                    setTimeout(()=>{
                        pages.each(function (index) {
                            html2canvas(document.querySelector("#page-"+index)).then(function(canvas){
                                let multiple = canvas.width / canvas.height;
                                cmpPages["page"+index] = {dataUrl:canvas.toDataURL('image/png'),multiple:multiple};
                                cmpCount++;
                                if(cmpCount == pages.length){
                                    for(let i=0;i<cmpCount;i++){
                                        let p = cmpPages["page"+(i)];
                                        if(i != 0){
                                            pdf.addPage();
                                        }
                                        pdf.addImage(p.dataUrl, 'JPEG', 0, 40, 595,595/p.multiple);
                                    }
                                    that.exportLoading = false;
                                    pdf.save('GRR分析图表.pdf');
                                }
                            });
                        });
                    },500)
                }else{
                    let pdf = new jsPDF("p","pt","a4");
                    //设置字体大小
                    // pdf.setFontSize(10);
                    pdf.setFontSize(5)
                    // return false;
                    let w = $('img').width();
                    let h = $('img').height();
                    let multiple = w / h;
                    var pageHeight = w / 592.28 * 841.89;
                    let leftHeight = h
                    let position = 0;
                    if (leftHeight < pageHeight) {
                        pdf.addImage(this.img, 'JPEG', 0, 0,  595.28,595.25/multiple);
                    } else {
                        while(leftHeight > 0) {
                            pdf.addImage(this.img, 'JPEG', 0, position, 595.28,595.25/multiple)
                            leftHeight -= pageHeight;
                            position -= 841.89;
                            //避免添加空白页
                            if(leftHeight > 0) {
                                pdf.addPage();
                            }
                        }
                        // pdf.addImage(this.img, 'JPEG', 0, 0,  595.28,595.25/multiple);
                    }
                    pdf.save('Echart.pdf');
                    that.exportLoading = false;
                }
                
            }
        }
    }
</script>

<style lang="" scoped>
    .btn{
        width: 105px;
        height: 35px;
        background-color: #418fee;
        line-height: 35px;
        text-align: center;
    }
    .print-page img{
        margin:0 auto;
        display: block;
    }
</style>