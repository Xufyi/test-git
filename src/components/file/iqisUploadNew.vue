<template>
  <div style="padding: 2px 0 2px 10px">
    <div v-for="(item,index) in myUploadList" :key="index" style="display:flex">
        <div class="iqis-upload-list"  :style="{width:($props.size)+'px',height:($props.size)+'px'}">
            <template v-if="item.status === 'finished'">
                <img class="fileImg" :title="item.name" :src="item.imgSrc" :style="{width:($props.size-2)+'px',height:($props.size-2)+'px'}">
                <div class="iqis-upload-list-cover" :style="{width:($props.size-1)+'px',height:($props.size-1)+'px'}">
                <Icon v-if="$props.edit" style="color: red;font-size: 10px;position: absolute;top: 0;right: 0;z-index:2" type="close-circled" @click.native="handleRemove(item,$event)"></Icon>
                <Icon type="ios-eye-outline" style="width:100%;height:100%;opacity: 0.05" @click.native="handleView(item,$event)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress  :style="{width:$props.size+'px',height:$props.size+'px'}" v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <div @click="showInspection" v-if="allInspections[index]">
            <h4>来料检验项目:<span>{{allInspections[index][0].iqcInspections}}</span></h4>
            <h4>过程检验项目:<span>{{allInspections[index][1].pqcInspections}}</span></h4>
            <h4>出货检验项目:<span>{{allInspections[index][2].oqcInspections}}</span></h4>
        </div>
        <div v-else @click="showInspection">+ 绑定检验项目</div>
    </div>
    <Modal
        v-model="modal1"
        title="绑定检验项目"
        :mask-closable="false"
        @on-ok="ok"
        @on-cancel="cancel">
        <p style="padding:10px 0 5px">来料检验项目：</p>
        <div style="padding:5px 10px 30px;border:1px solid #d2d2d2">
            <div>
                <CheckboxGroup v-model="iqcInspections" @on-change="checkAllGroupChange">
                    <Checkbox :label="item" v-for="(item,index) in iqcInspection" :key="index"></Checkbox>
                </CheckboxGroup>
            </div>
        </div>
        <p style="padding:10px 0 5px">过程检验项目：</p>
        <div style="padding:5px 10px 30px;border:1px solid #d2d2d2"><div>
                <CheckboxGroup v-model="pqcInspections" @on-change="checkAllGroupChange">
                    <Checkbox :label="item" v-for="(item,index) in pqcInspection" :key="index"></Checkbox>
                </CheckboxGroup>
            </div></div>
        <p style="padding:10px 0 5px">出货检验项目：</p>
        <div style="padding:5px 10px 30px;border:1px solid #d2d2d2"><div>
                <CheckboxGroup v-model="oqcInspections" @on-change="checkAllGroupChange">
                    <Checkbox :label="item" v-for="(item,index) in oqcInspection" :key="index"></Checkbox>
                </CheckboxGroup>
            </div></div>
    </Modal>
    <Upload
      ref="upload"
      :data="{'key':ossKey,'policy':policy,'OSSAccessKeyId':OSSAccessKeyId,'success_action_status':success_action_status,'signature':signature,'x-oss-object-acl' : 'public-read'}"
      :show-upload-list="false"
      :default-file-list="$props.value"
      :on-success="handleSuccess"
      :format="$props.fileType"
      :max-size="$props.maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :style="{width:($props.size)+'px'}"
      multiple
      type="drag"
      :action="action"
      :headers="{'x-access-token':$SessionStorage.get('token')}"
      style="display: inline-block;margin-left: -3px;">
      <div :style="{width:($props.size-2)+'px',height:$props.size+'px',lineHeight:$props.size+'px'}">
        <Icon v-if="chartTypeShow" type="camera" size="20"></Icon>
        <Icon v-else="chartTypeShow" type="ios-upload-outline" size="16"></Icon>
      </div>
    </Upload>
    <Modal :title="imgName" v-model="visible">
      <img :src="imgUrl" v-if="!file" style="width: 100%">
      <a v-if="file&&imgUrl.endsWith('.pdf')" :href="imgUrl" target="_blank" @click="visible=false">{{$t('iqisUpload.onlineView')}}</a>
      <span v-if="file&&!imgUrl.endsWith('.pdf')">该文件不支持在线预览</span>
      <div slot="footer">
        <Button type="primary" v-if="file" size="large" @click="download(imgUrl)">{{$t('iqisUpload.download')}}</Button>
        <!-- <Button type="primary" v-if="file" size="large" @click="fileOnline(imgUrl)">在线预览</Button> -->
        <Button type="text" size="large" @click="visible=false">{{$t('iqisUpload.cancel')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<!--<script src="./node_modules/Jquery/dist/jquery.js"></script>-->
<!--<script src="/web1.2/node_modules/Jquery/dist/jquery.js"></script>-->
<script>
  import $  from 'jquery'
  export default {
    props:{
      "parmas":Object,
      "size":{
        type: Number,
        default: 32
      },
      "value":Array,
      "edit":Boolean,
      "maxSize":Number,
      "fileType":Array,
      "fileCount":Number,
      "cameraShow":true,
      "outlineShow":false,
      'chartTypeShow':true,
      'fullScreen':false,
       'pr':String,
       "divimgid":String,
    },
    data () {
      return {
        i18n:window.i18n,
        action:'',
        iqcInspection:[],
        iqcInspections:[],
        pqcInspection:[],
        pqcInspections:[],
        oqcInspection:[],
        oqcInspections:[],
        checkAllGroup: [],
        allInspections:[],
        modal1:false,
        headers:{'x-access-token':this.$SessionStorage.get('token')},
        // defaultList: this.$props.value
        //   [
        // {
        //   "createTime": "2018-04-28T02:46:35.379Z",
        //   "name": "string",
        //   "no": "string",
        //   "prodExtInfoId": 0,
        //   "productId": 0,
        //   "type": "string",
        //   "url": "string"
        // }
        // ]
        // ,
        imgName: '',
        imgUrl: '',
        visible: false,
        uploadList: [],
        ossKey:'',
        policy:'',
        OSSAccessKeyId:'',
        success_action_status:'',
        signature:'',
        uploadFileList:[],
        myUploadList:[],
        file:false,
      }
    },
    watch:{
      'uploadFileList': function(newVal,oldVal){
        this.$emit('input',this.uploadFileList)
      },
    },
    created(){
      let that = this;
      this.myUploadList=this.$props.value
      this.uploadList=this.$props.value
      if(this.myUploadList.length>0){
        for(let i in this.myUploadList){
          that.imgSrc(i)
        }
        this.activeImg(0);
      }
    },
    methods: {
      showInspection() {
          console.log(this.myUploadList,5678)
        //   this.iqcInspections=[]
        //   this.pqcInspections=[]
        //   this.oqcInspections=[]
          for(let i in this.$props.parmas.qc.iqc.params) {//遍历出来料中的检验项目
              let item = this.$props.parmas.qc.iqc.params[i]
              if(this.iqcInspection.indexOf(item.currentAndParentName)==-1) {
                  this.iqcInspection.push(item.currentAndParentName)
              }
          }
          for(let i in this.$props.parmas.qc.pqc.params) {//遍历出过程中的检验项目
              let item = this.$props.parmas.qc.pqc.params[i]
              if(this.pqcInspection.indexOf(item.currentAndParentName)==-1) {
                  this.pqcInspection.push(item.currentAndParentName)
              }
          }
          for(let i in this.$props.parmas.qc.oqc.params) {//遍历出出货中的检验项目
              let item = this.$props.parmas.qc.oqc.params[i]
              if(this.oqcInspection.indexOf(item.currentAndParentName)==-1) {
                  this.oqcInspection.push(item.currentAndParentName)
              }
          }
          this.modal1=true
      },
      handleView (item,event) {
        //console.log(this.$props,138);
        //console.log(item,i18n.t("iqisUpload.currentoptions")+'---------')
        if(!this.$props.fullScreen){
          this.imgName = item.name;
          this.imgUrl =  this.$http.defaults.baseURL == undefined|| this.$http.defaults.baseURL == ''|| this.$http.defaults.baseURL == null?item.url:this.$http.defaults.baseURL+item.url;
          this.visible = true;
          let type = item.url.substring(item.url.lastIndexOf(".")+1,item.url.length)
          //console.log(type)
          if(type=='jpg'||type=='jpeg'||type=='png'){
            this.file=false;
          }else{
            this.file=true;
          }
          
        }else{
          var html = '<img src="'+item.url+'"alt="" style="width:100%">'
          this.$emit('childByValue',item.url)
          if(this.$props.pr == 'pr'){
             $('#watchPicpr').html(html)
             $('#watchPicpr1').html(html)
             $('#watchPicpr2').html(html)
          }else{
            $('#watchPic').html(html)
          }
        }
        $(event.target).parents('.iqis-upload-list').addClass('iqis-upload-list-active')
        $(event.target).parents('.iqis-upload-list').siblings().removeClass('iqis-upload-list-active')
      },
      handleRemove (file,event) {
        const fileList = this.$refs.upload.fileList;
        let index = $('.iqis-upload-list-active').index()
        let del = fileList.indexOf(file);

        // //console.log(index,'选中的索引')
        // //console.log(del,'删掉的索引')
        // //console.log(file,'file------------')
        // //console.log(event,'event------------')
        // //console.log(fileList,'fileList------------')
        this.$emit('del',fileList.indexOf(file))
        //this.uploadFileList.splice(fileList.indexOf(file),1)
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        this.myUploadList=this.$refs.upload.fileList
        //this.myUploadList.splice(fileList.indexOf(file),1)

        if($(event.target).parents('.iqis-upload-list').hasClass('iqis-upload-list-active')){//若删除当前，则选中第一
          this.activeImg(0);
        }else if(del<index){//若删除选中之前，为保持选中需index-1防止位移
          this.activeImg(index-1);
        }

        if(this.myUploadList.length==0){//若清空图片，则清除预览
          if(this.$props.pr == 'pr'){
            $('#watchPicpr').html('')
            $('#watchPicpr1').html('')
            $('#watchPicpr2').html('')
          }else{
            $('#watchPic').html('')
          }
        }
      },
      handleSuccess (res, file) {
        let that = this;
        file.url = that.parseXML(res).getElementsByTagName("Location")[0].firstChild.nodeValue;
        file.url=file.url.replace("com//","com/");
        file.name = that.imgName;
        let obj = {'url':file.url,'mime':file.name.substring(file.name.lastIndexOf(".")+1,file.name.length),'name':file.name}
        //that.myUploadList.push(obj);
        that.uploadFileList=[]
        that.uploadFileList.push(obj)
        that.myUploadList=this.$refs.upload.fileList
        ////console.log("------",that.myUploadList)
        //that.uploadList.push(obj)
        let i = that.myUploadList.length-1
        that.imgSrc(i)
      },
      imgSrc(i){//上传附件显示对应格式的图标
        let that = this;
        let type = that.myUploadList[i].url.substring(that.myUploadList[i].url.lastIndexOf('.')+1,that.myUploadList[i].url.length)
        if(type=='jpg'||type=='jpeg'||type=='png'){
          that.myUploadList[i]['imgSrc']=that.$http.defaults.baseURL == undefined|| that.$http.defaults.baseURL == ''|| that.$http.defaults.baseURL == null?that.myUploadList[i].url:that.$http.defaults.baseURL+that.myUploadList[i].url
        }else if(type=='docx'||type=='doc'||type=='xls'||type=='xlsx'||type=='ppt'||type=='pptx'||type=='pdf'){
          that.myUploadList[i]['imgSrc']='./static/fileIcon/'+type+'.svg'
        }else{
          that.myUploadList[i]['imgSrc']='./static/fileIcon/defulat.svg'
        }
      },
      activeImg(i){//激活哪一张
        if(!this.$props.fullScreen||this.myUploadList.length==0){
          return;
        }
        this.$nextTick(()=>{
          let j = i+1
          $('.iqis-upload-list:nth-child('+j+')').addClass('iqis-upload-list-active').siblings().removeClass('iqis-upload-list-active')
          var html = '<img src="'+this.myUploadList[i].url+'" style="width:100%">'
          if(this.$props.pr == 'pr'){
            $('#watchPicpr').html(html)
            $('#watchPicpr1').html(html)
            $('#watchPicpr2').html(html)
          }else{
            $('#watchPic').html(html)
          }
        })
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: i18n.t('iqisUpload.fileFormatError'),
          desc: i18n.t("iqisUpload.fileFormat")+this.$props.fileType
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: i18n.t("iqisUpload.fileSizeError"),
          desc: file.name + i18n.t("iqisUpload.moreMaxFile")+this.$props.maxSize/1024+i18n.t('iqisUpload.mega')
        });
      },
      handleBeforeUpload (file) {
        if(!this.$props.edit){
          this.$Notice.warning({
            title: i18n.t("iqisUpload.uploadError"),
            desc: i18n.t('iqisUpload.canNotUpload')
          });
          return false
        }
        let that = this;
        if(that.uploadList.length>=this.$props.fileCount){
          this.$Notice.warning({
            title: i18n.t('iqisUpload.FileNumberError'),
            desc: i18n.t('iqisUpload.maxMum')+this.$props.fileCount
          });
          return false;
        }
        /*that.$http.get("/file/policy").then(function(res){
          that.imgName=file.name
          that.ossKey=res.data.dir + file.name;
          that.policy=res.data.policy
          that.OSSAccessKeyId=res.data.accessKeyId
          that.success_action_status=201
          that.signature=res.data.signature
          alert(that.ossKey);
          return true;
        })*/
        let url  = that.$http.defaults.baseURL == undefined
        || that.$http.defaults.baseURL == ''
        || that.$http.defaults.baseURL == null? "/file/policy" : that.$http.defaults.baseURL + '/file/policy'
        $.ajax({
          url: url,
          async: false,
          type:'GET',
          headers:{
            'x-access-token':that.$SessionStorage.get('token')
          },
          success: function(res){
            that.imgName=file.name
            that.ossKey=res.data.dir + file.name;
            that.policy=res.data.policy
            that.OSSAccessKeyId=res.data.accessKeyId
            that.success_action_status=201
            that.signature=res.data.signature
            if(res.data.action !== "" && res.data.action.indexOf('/') == 0 ){
              that.action = process.env.API_HOST+res.data.action
            }else{
              that.action = res.data.action;
            }
            
          }
        });

        let promise = new Promise((resolve) => {
          this.$nextTick(function () {
            resolve(true);
          });
        });
        return promise; //通过返回一个promis对象解决
      },

      //js解析xml
      parseXML(xmlString){
        var xmlDoc=null;
        if(!window.DOMParser && window.ActiveXObject)
        {
          var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
          for(var i=0;i<xmlDomVersions.length;i++)
          {
            try
            {
              xmlDoc = new ActiveXObject(xmlDomVersions[i]);
              xmlDoc.async = false;
              xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
              break;
            }
            catch(e)
            {
            }
          }
        }
        else if(window.DOMParser && document.implementation && document.implementation.createDocument)
        {
          try
          {
            var domParser = new  DOMParser();
            xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
          }
          catch(e)
          {
          }
        }
        else
        {
          return null;
        }
        return xmlDoc;
      },
      download(url){
        window.open(url)
        this.visible=false;
      },
      checkAllGroupChange() {alert(1)

      },
      ok() {
        //   this.allInspections
        //   this.iqcInspections
          let inspectionsItem = [
              {iqcInspections:this.iqcInspections.join(',')},
              {pqcInspections:this.pqcInspections.join(',')},
              {oqcInspections:this.oqcInspections.join(',')}
          ]
          this.allInspections.push(inspectionsItem)
          console.log(this.allInspections,"this.allInspections")
      },
      cancel() {alert(2)

      }
      // fileOnline(url){
      //   window.open('http://view.officeapps.live.com/op/view.aspx?src='+url)
      // }
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList;
      // this.myUploadList=this.$props.value
    },

  }
</script>
<style>
  .iqis-upload-list{
    /* display: inline-block; */
    text-align: center;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 8px;
  }
  .iqis-upload-list-active{
      border: 2px solid #2d8cf0;
  }
  .iqis-upload-list img{
    width: 100%;
    height: 100%;
  }
  .iqis-upload-list-cover{
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .iqis-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
