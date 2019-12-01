<template>
<div class="iqis-page">
  <div class="iqis-page-block">



    <div class="iqis-page-block-body">
      <Row type="flex" :gutter="24">
        <i-col span="12">
          <div class="iqis-page-block-title">
            {{$t('statistical.basicInfo')}}
          </div>
          <div class="iqis-page-block-label">{{$t('statistical.analysisNo')}}</div>
          <div class="iqis-page-block-ctrl">
            <i-input :disabled="change" :maxlength="Number(20)" @on-keyup="blur" v-model="form.number" style="width: 100%;"></i-input>
          </div>
          <div class="iqis-page-block-label">{{$t('statistical.analysisItem')}}</div>
          <div class="iqis-page-block-ctrl">
            <i-input :maxlength="Number(40)" :disabled="change" v-model="form.project" style="width: 100%;" @on-blur="projectChange"></i-input>
          </div>
          <Row type="flex" :gutter="24">
            <i-col span="12">
              <div class="iqis-page-block-label">{{$t('statistical.analysisDate')}}</div>
              <div class="iqis-page-block-ctrl">
                <Date-picker  type="datetime" format="yyyy-MM-dd HH:mm" :disabled="change" v-model="form.createTime" class="dataW"></Date-picker>
              </div>
            </i-col>
            <i-col span="12">
              <div class="iqis-page-block-label">{{$t('statistical.analysisPeople')}}</div>
              <div class="iqis-page-block-ctrl">
                <i-select  :placeholder="i18n.t('pleaseChoose')" filterable :disabled="change" v-model="form.analystId">
                  <Option v-for="items in spectorNameData" :value="items.userId" :label="items.name"  :key="items.userId">{{ items.name}}</Option>
                </i-select>
              </div>
            </i-col>
          </Row>
          <div class="iqis-page-block-label">{{$t('statistical.analysisPurpose')}}</div>
          <div class="iqis-page-block-ctrl">
            <i-input type='textarea' :maxlength="Number(600)" :disabled="change" v-model="form.purpost" :autosize="{minRows: 3, maxRows:6}" style="width: 100%;"></i-input>
          </div>
          <div class="iqis-page-block-label">{{$t('statistical.analysisResult')}}</div>
          <div class="iqis-page-block-ctrl">
            <i-input type='textarea' :maxlength="Number(600)"  :disabled="change" v-model="form.result" :autosize="{minRows: 4, maxRows:6}" style="width: 100%;"></i-input>
          </div>
          <div class="iqis-page-block-label">{{$t('statistical.analysisRemarks')}}</div>
          <div class="iqis-page-block-ctrl">
            <i-input type='textarea' :maxlength="Number(600)" :disabled="change" v-model="form.remarks" :autosize="{minRows: 5, maxRows:6}" style="width: 100%;"></i-input>
          </div>
        </i-col>
        <i-col span="11" offset="1">
          <div class="iqis-page-block-title">
            {{$t('statistical.analysisStructure')}}
          </div>
          <div class="toolsTree" style='overflow:hidden'>
              <!-- <div class="iqis-page-save-tool" style="width:100%;text-align:left;background:#E9E9E9"  v-if='!change'>
                <Button :disabled="!treeDisabled" type="primary" @click='addChildren'>添加子级</Button>
                <Button :disabled="!treeDisabled || changeDisabled" type="primary" @click='changeChildren'>修改</Button>
                <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                  confirm
                  title="确定要删除选择的类别吗?"
                  placement="bottom-start"
                  @on-ok="deleteChildren">
                  <Button :disabled="!treeDisabled || changeDisabled" type="ghost">删除</Button>
                </Poptip>
              </div> -->
            <div class="iqis-page-tool-row iqis-tree-tool" style="flex: 0 0 47px;"  v-if='!change' >
              <div style="display: -webkit-flex;display: flex;justify-content:space-between;width: 100%;">
                <div class="iqis-page-tool-primary" style="padding: 12px 6px;">
                  <Button type="ghost" :disabled="!treeDisabled" @click="addChildren">{{$t('statistical.addType')}}</Button>
                </div>
                <div class="iqis-page-tool-second" style="padding: 12px 10px;">
                  <Button type="ghost"  :disabled="!treeDisabled || changeDisabled"   @click="changeChildren" >{{$t('statistical.edit')}}</Button>
                  <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                    confirm
                    title="确定要删除选择的类别吗?"
                    placement="bottom-start"
                    @on-ok="deleteChildren">
                    <Button type="ghost" :disabled="!treeDisabled || changeDisabled"  >{{$t('statistical.delete')}}</Button>
                  </Poptip>
                </div>
              </div>
            </div>
              <div style='width:100%;height:600px;overflow-y:auto;overflow-x:auto;border:1px solid #e9e9e9'>
                <Tree :empty-text="i18n.t('noData')" :data="data1" @on-select-change="treeSelectOne"></Tree>
              </div>
          </div>
          
        </i-col>
      </Row>
      </Row>
    </div>
    <!--end body-->
  </div>
  <IqisAffix placement="bottom" :offset="0" >
    <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
      <Button type="primary" @click="look" v-if="form.fishboneId && !isChangeTree">{{$t('statistical.viewChart')}}</Button>
      <Button type="primary" v-if='!change' @click='SaveS'>{{$t('statistical.save')}}</Button>
      <Button type="ghost" @click='closePage()'>{{$t('statistical.cancel')}}</Button>
    </div>
  </IqisAffix>
  <div class="page-end" style="padding-bottom: 80px;padding-top: 30px;"></div>
</div>
</template>
<script>
export default {
    props:["params", "tabKey"],
  data() {
    return {
      i18n:window.i18n,
      headers: {
        
        "headers": {
          "Content-Type": "application/json; charset=UTF-8"
        }
      },
      change:true,
      form:{
        number:'', //编号
        project:'',//项目
        purpost:'',//目的
        analystId:'',//人员
        analystName:'',//人员名
        result:'',//结果
        remarks:'',//备注
        frameworkList:[],
        fishboneId:null,
        createTime:''//时间
      },
      isChangeTree:false,
      spectorNameData:[],
      selectOne:{},
      treeDisabled:false,
      changeDisabled:false,
      data1: [],
      dataAll:[],
      value:'',
      treeItem:{
        title: '',
        orderId:1,
        parentId:0,
        selected:false,
        expand: true,
        children: []
      },
      count:1,
    }
  },
  watch:{
    'dataAll.length':function(v,ov){
      if(v!=ov){
        this.$nextTick(()=>{
          this.data1 = this.initTreeData(this.$iqis.utils.clone(this.dataAll),0);
          // console.log(this.data1)
        })
      }
    }
  },
  methods:{
    look(){
      this.$emit("open-tab","page-yugutu"+this.form.fishboneId,i18n.t('statistical.viewCausality')+"-"+this.form.project,"page-yugutu",{fishboneId:this.form.fishboneId});
    },
    projectChange(){
      if(this.form.project === ''){
        this.$Notice.error({
            title: i18n.t('statistical.analysisItemNull'),
        });
        return
      }
      if(this.data1.length == 0){
        let item = this.$iqis.utils.clone(this.treeItem);
        item.title = this.form.project;
        this.data1.push(item);
        this.dataAll.push(item);
        this.count++;
      }else{
        this.data1[0].title = this.form.project;
        this.dataAll[0].title = this.form.project;
      }
    },
    treeSelectOne(item){
      if(item && item[0]){
        if(item[0].nodeKey === 0){
          this.changeDisabled = true;
        }else{
          this.changeDisabled = false;
        }
        this.treeDisabled = true;
      }else{
        this.treeDisabled = false;
      }
      this.selectOne = item;
    },
    addChildren(){
      this.value = '';
      this.$Modal.confirm({
          render: (h) => {
              return h('Input', {
                  props: {
                      value: this.value,
                      autofocus: true,
                      placeholder: i18n.t('statistical.pleaseNewName')
                  },
                  on: {
                      input: (val) => {
                          this.value = val;           
                      }
                  }
              })
          },
          onOk:() =>{
            if(this.value === ''){
              this.$Notice.error({
                  title: i18n.t('statistical.analysisItemNull'),
              });
              return
            }
                let item = this.$iqis.utils.clone(this.treeItem);
                item.orderId = this.count;
                item.title = this.value;
                item.parentId = this.selectOne[0].orderId;
                this.dataAll.push(item);
                this.value = '';
                this.count++;
          },
      })
    },
    blur(){
　　  var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
  　　if(reg.test(this.form.number)){     
        this.$Notice.error({
            title: i18n.t('statistical.analysisNoCN'),
        });
  　　}       
    },
    changeChildren(){
      this.value = this.selectOne[0].title;
      this.$Modal.confirm({
          render: (h) => {
              return h('Input', {
                  props: {
                      value: this.value,
                      autofocus: true,
                      placeholder: i18n.t('statistical.pleaseNewName')
                  },
                  on: {
                      input: (val) => {
                        this.value = val;           
                      }
                  }
              })
          },
          onOk:() =>{
            if(this.value === ''){
              this.$Notice.error({
                  title: i18n.t('statistical.analysisItemNull'),
              });
              return
            }
            for(let i=0;i<this.dataAll.length;i++){
              if(this.dataAll[i].orderId === this.selectOne[0].orderId){
                this.dataAll[i].title = this.value;
                this.data1 = this.initTreeData(this.$iqis.utils.clone(this.dataAll),0);
                this.isChangeTree = true;
              }
            }
            this.value = '';
          },
      })
    },
    deleteChildren(){
      let index = -99;
      for(let i=0;i<this.dataAll.length;i++){
        if(this.dataAll[i].orderId === this.selectOne[0].orderId && this.selectOne[0].children.length === 0){
          index = i;
          break;        
        }
      }
      if(index != -99){
        this.dataAll.splice(index,1);
        this.data1 = this.initTreeData(this.$iqis.utils.clone(this.dataAll),0);
        this.isChangeTree = true;
      }else{
        this.$Notice.error({
            title: i18n.t('statistical.deleteItem'),
        });
      }
    },
    initTreeData(data,parentId){
      var temp = [],children=[];
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (item.parentId==parentId) {
              children = this.initTreeData(data,item.orderId);
              item.children = children;
              temp.push(item);
              // temp[temp.length]
            }
        }
      return temp;
    },
    spectorName() {
      let that = this;
      let url = "/tenant/user?page=1&limit=99999";
      that.$http.get(url).then((res) => {
        that.spectorNameData = res.data
        that.CurrentOperator();
      })
    },
    CurrentOperator() {
      let that = this
      let url = '/tenant/user/profile'
      that.$http.get(url).then(res => {
        that.form.analystId = res.data.userId
      })
    },
    closePage() {
      this.$emit("close-tab", this.$props.tabKey);
    },
    SaveS(){
      if(this.form.number){
        var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");

        //整理成统一的表单验证格式
    　　if(reg.test(this.form.number)){     
          this.$Notice.error({
              title: i18n.t('statistical.analysisNoCN'),
          });
          return;
    　　}
      }else{
        this.$Notice.error({
              title: i18n.t('statistical.analysisNoNull'),
          });
        return;
      }
      if(!this.form.project){
        this.$Notice.error({
              title: i18n.t('statistical.analysisItemNull'),
          });
        return;
      }
      if(!this.form.createTime){
        this.$Notice.error({
              title: i18n.t('statistical.analysisDateNull'),
          });
        return;
      }
      if(!this.form.analystId){
        this.$Notice.error({
              title: i18n.t('statistical.analysisPeopleNull'),
          });
        return;
      }
      
      let newData = [];
      for(let i=0;i<this.dataAll.length;i++){
        let data = this.dataAll[i];
        let item = {
          tenantId:data.tenantId || '',
          fishboneId:data.fishboneId || '',
          frameworkId:data.frameworkId || '',
          name:data.title,
          parentId:data.parentId,
          orderId:data.orderId
        }
        newData.push(item);
      }
      this.form.frameworkList = newData;
      if(!this.form.fishboneId){
        this.$http.post('/basic/fishbone',this.form,this.headers).then(res=>{
          this.$Message.success(i18n.t('statistical.addSuccess'));
          this.closePage();
        });
      }else{
        this.$http.put('/basic/fishbone',this.form,this.headers).then(res=>{
          this.$Message.success(i18n.t('statistical.editSuccess'));
          this.closePage();
        });
      }
    },
    getData(id){
      this.$http.get('/basic/fishbone/'+id).then(res=>{
        this.form = res.data;
        this.form.createTime = new Date(res.data.createTime)
        // console.log(res.data,12);
        for(let i=0;i<res.data.frameworkList.length;i++){
          res.data.frameworkList[i].title = res.data.frameworkList[i].name;
          res.data.frameworkList[i].selected = false;
           res.data.frameworkList[i].expand = true;
           res.data.frameworkList[i].children = [];
        }
        this.dataAll = res.data.frameworkList;
        this.count = res.data.frameworkList.length+1;
      });
    }
  },
  created(){
    this.spectorName();
    this.form.createTime = new Date();
    this.form.fishboneId = this.$props.params?this.$props.params.fishboneId:null;
    this.$http.get('/tenant/user/profile').then(res=>{
        if(this.form.fishboneId){
          for(let i=0;i<res.data.permissions.length;i++){
            if(res.data.permissions[i] === "UPDATE_FISHBONE"){
              this.change = false;
            }
          }
          setTimeout(() => {
            this.getData(this.form.fishboneId);
          }, 500);
        }else{
          for(let i=0;i<res.data.permissions.length;i++){
            if(res.data.permissions[i] === "INSERT_FISHBONE"){
              this.change = false;
            }
          }
        }
      });
  }
}
</script>
