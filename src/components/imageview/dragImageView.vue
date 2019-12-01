/*
 * @Author: yaoxingpu 
 * @Date: 2019-01-14 14:00:53 
 * @Last Modified by: yaoxingpu
 * @Last Modified time: 2019-01-19 11:11:45
 */

<template>
    <div class="imgstyle" ondragstart="return false" oncopy="return false;" oncut="return false;">
        <div v-if="showImg" id="div1" >
            <span class='spIcon' @click='close'><Icon type="close-round"></Icon></span>
            <!-- 这是要做的通过鼠标控制div大小的功能 -->
            <!-- <div id="coor" v-on:mousedown.stop="mousedownWh($event)" v-on:mouseup.stop="mouseupWh()">
            </div> -->
            <div class="namestyle" v-on:mouseover="dragFun">名称: {{imgName}}</div>
            <img :src="imgUrl" width="100%" height="100%">
        </div>
        <ul v-if="imgUrlList.length!=0" style="height:60px;">
            <li v-for="(item,index) in imgUrlList" @click="showImgFun(index)">
                <img v-if="item.url.endsWith('.pdf')||item.url.endsWith('.PDF')" src='static/img/pdf.png' width="50px" height="50px">
                <img v-else :src='item.url' width="50px" height="50px">
            </li>
        </ul>
    </div>
</template>
<script>
    import $ from "jquery"
    export default {
        props:['productId'],
        name: '',
        data() {
            return {
                showImg: false,
                imgUrlList:[],
                imgUrl:'',
                imgName:'',
            }
        },
        created () {
            
        },
        mounted () {
            
        },
        watch: {
            "productId":function(){
                let productid = this.$props.productId
                if(productid){
                    this.$http.get("/basic/product/detail/"+productid).then((res) => {
                        this.imgUrlList = res.data.settings.ext
                    })
                }
                
            }
        },
        methods:{
            //关闭图片预览
            close(){
                this.showImg=false;
            },
            showImgFun(index){
                if(this.imgUrlList[index].name.endsWith('.pdf') || this.imgUrlList[index].name.endsWith('.PDF')) {
                    window.open(this.imgUrlList[index].url)
                    return
                }
                this.showImg = true;
                this.imgName = this.imgUrlList[index].name
                this.imgUrl = this.imgUrlList[index].url
            },
            //拖动功能
            dragFun(){
                var div1 = document.getElementById("div1");
                div1.onmousedown = function(ev){
                var oevent = ev || event;
                    var distanceX = oevent.clientX - div1.offsetLeft;
                    var distanceY = oevent.clientY - div1.offsetTop;
                    document.onmousemove = function(ev){
                        var oevent = ev || event;
                        div1.style.left = oevent.clientX - distanceX + 'px';
                        div1.style.top = oevent.clientY - distanceY + 'px'; 
                    };
                    document.onmouseup = function(){
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                };
            },

            //鼠标事件
            mousedownWh($event){
                let clientX = $event.clientX
                let clientY = $event.clientY
                console.log($event,"鼠标按下了")
            },
            mouseupWh(){
                $('#div1').width(500)
                $('#div1').height(500)
                console.log("鼠标抬起了")
                
            },
            //此方法暂时无用
            widthHeightFun(){
               $(function() {
                    $(document).mouseup(function(e) {
                        if (!!this.move) {
                            var callback = document.call_up || function(){};
                            callback.call(this, e);
                            $.extend(this, {
                                'move': false,
                                'move_target': null,
                                'call_down': false,
                                'call_up': false
                            });
                        }
                    });

                    var $box = $('#box').mousedown(function(e) {
                        var offset = $(this).offset();
                        
                        this.posix = {'x': e.pageX - offset.left, 'y': e.pageY - offset.top};
                        $.extend(document, {'move': true, 'move_target': this});
                    }).on('mousedown', '#coor', function(e) {
                        var posix = {
                                'w': $box.width(), 
                                'h': $box.height(), 
                                'x': e.pageX, 
                                'y': e.pageY
                            };
                        
                        $.extend(document, {'move': true, 'call_down': function(e) {
                            $box.css({
                                'width': Math.max(30, e.pageX - posix.x + posix.w),
                                'height': Math.max(30, e.pageY - posix.y + posix.h)
                            });
                        }});
                        return false;
                    });
                });
            }
        }
    }
</script>

<style>
#div1 { z-index:99999999; border-radius:10px; overflow:hidden; width: 600px; height: 400px; position: absolute; top: 10%; left: 30%; background-color: #FFF; border: none;  -webkit-box-shadow: 10px 10px 25px #ccc;-moz-box-shadow: 10px 10px 25px #ccc;box-shadow: 10px 10px 25px #ccc;}
#coor { width: 10px; height: 10px; overflow: hidden; cursor: se-resize; position: absolute; right: 0; bottom: 0; background-color: #09C; }
.imgstyle ul li{
    list-style:none;
    float:left;
    margin-right:10px;
    margin-top:20px;
    border:1px solid rgb(221, 222, 225);
    border-radius:5px;
    overflow:hidden;
    cursor:pointer;
}
.spIcon{
    background-color:rgba(255,255,255,0);
    position:absolute;
    top:10px;
    right:10px;
    cursor:pointer;
}
.namestyle{
    padding-top:10px;
    padding-left:5px;
    padding-bottom:10px;
     cursor: move;
}
</style>