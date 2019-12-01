<template>
  <div style="position:relative;" class="divPadding16" :id="treeData.typeId">
    <!--树的收起和展开按钮-->
    <Tooltip class="treeToggleIcon" :content="tree.toggleText" placement="right">
      <div @click="treeToggle"><img v-if="tree.open" src="../../assets/img/close.png"><img v-else src="../../assets/img/open.png"></div>
    </Tooltip>
    <div class="iqis-bus-tree treeCustom" style="height:600px">
      <div class="iqis-page-tool-row iqis-tree-tool">
        <div style="display: -webkit-flex;display: flex;justify-content:space-between;width: 100%;">
          <div class="iqis-page-tool-primary" style="padding:5px 6px 0px 6px;">
            <!-- 添加 -->
            <Poptip
              class="amendStyle"
              v-model="tree.add"
              :title='i18n.t("quality.pecn")'
              @on-popper-show="treeAddInit"
              placement="bottom-start">
              <Button type="text" :title='i18n.t("quality.al")'><Icon style="font-size:18px;" type="plus"></Icon></Button>
              <div class="iqis-poptip-content" slot="content">
                <div>分类名称</div>
                <Input :autofocus="true" ref="addTxt" v-on:focus.native="selectAll" type="text" v-model="dto.nodeName"/>
                <div style="margin-top:10px;">所属分类</div>
                <Cascader :data="category" v-model="dto.nodeTypeValue" change-on-select></Cascader>
                <Button type="primary" long style="margin-top:10px;" @click="addNode">确定</Button>
              </div>
            </Poptip>
          </div>
          <div class="iqis-page-tool-second" style="padding: 5px 10px 0px 10px;">
          <!-- 修改 -->
            <Poptip
              v-model="tree.edit"
              :title='i18n.t("quality.pen")'
              @on-popper-show="treeEditInit"
              placement="bottom-start">
              <Button type="text" :disabled="!tree.selected"><Icon style="font-size:18px;" type="edit"></Icon></Button>
              <div class="iqis-poptip-content" slot="content">
                <div>分类名称</div>
                <Input :autofocus="true" ref="editTxt" v-on:focus.native="selectAll" type="text" v-model="dto.nodeName"/>
                <div style="margin-top:10px;">所属分类</div>
                <Cascader :data="category" v-model="dto.nodeTypeValue" change-on-select></Cascader>
                <Button type="primary" size="large" long style="margin-top:10px;" @click="editNode">确定</Button>
              </div>
            </Poptip>
            <!-- 删除 -->
            <Poptip
              confirm
              :title='i18n.t("quality.ay")'
              placement="bottom-start"
              @on-ok="deleteNode"
              :ok-text='i18n.t("quality.confirm")'
              :cancel-text='i18n.t("quality.cancel")'>
              <Button type="text" :disabled="!tree.selected"><Icon style="font-size:18px;" type="trash-a"></Icon></Button>
            </Poptip>
          </div>
        </div>
      </div>
      <div class="iqis-tree-content" style="">
        <Tree ref="tree" :data="category" :multiple="false" @on-select-change="treeSelectChange"></Tree>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'

export default {
  props:['treeData'],
  data: function () {
    let vm = this;
    return {
      // treeData:this.$props.treeData,
      i18n:window.i18n,
      str:null,
      category:[{
        title: '组织架构树',
        loading: false,
        children: []
      }],
      tree:{
        add:false,
        edit:false,
        selected:false,
        open:true,
        toggleText:'收起分类',
        toggleImgUrl:'../../assets/img/close.png'
      },
      dto:{
        nodeName:null,
        nodeId:null,
        nodeTypeValue:[],
        nodeTypeId:null,
      }
    }
  },
  created(){
    console.log(this.treeData,'treeData');
    this.refreshTypeTree()
    
  },
  mounted () {
    this.snss();
  },
  methods:{
    treeToggle(){//树的收起和展开
      if(!this.tree.open){
        this.tree.open = true
        this.tree.toggleText = '收起分类'
        this.tree.toggleImgUrl = '../../assets/img/close.png'
        $('#'+this.treeData.typeId+' .iqis-tree-tool,#'+this.treeData.typeId+' .iqis-tree-content').show()
        $('#'+this.treeData.typeId+' .iqis-bus-tree').animate({width:'185px'},"fast")
        $('.divPadding16').css("padding-right","16px")  
        $('.divPadding16 .iqis-bus-tree').css('border','1px solid #e9eaec')
        $('.treeToggleIcon').css('left','-1px')
      }else{
        this.tree.open = false
        this.tree.toggleText = '展开分类'
        this.tree.toggleImgUrl = '../../assets/img/open.png'
        $('#'+this.treeData.typeId+' .iqis-bus-tree').animate({width:'0'},"fast");
        $('.divPadding16').css("padding-right","0px")
        $('.divPadding16 .iqis-bus-tree').css('border','none')
        $('.treeToggleIcon').css('left','-6px')
          setTimeout(()=>{
            $('#'+this.treeData.typeId+' .iqis-tree-tool,#'+this.treeData.typeId+' .iqis-tree-content').hide()
          },200)
      }
    },
    //使其在父组件中能够获取到tree 的相关数据;解决影响父组件中因改变树组而导致的添加等问题
    snss(){
      let that = this;
      that.str=that.$refs.tree.getSelectedNodes();
    },
    refreshTypeTree(selectValue){//刷新树的数据来源
      let that = this;
      that.tree.selected = false;
      this.$http.get(that.treeData.treeListUrl,{params:{page:1,limit:99999}}).then(function(resp){
        let root = {title:that.treeData.treeTitle,selected: false,label:that.treeData.treeTitle,value:0,expand:true};
        if(!selectValue){
          root.selected = true;
          that.$parent.refreshData();
        }
        if(resp.data){
          that.$iqis.utils.treeify(resp.data,root,that.treeData.typeId,that.treeData.typeName,"parentId");
        }
        that.category = [root];
      });
    },
    treeSelectChange(item,current,limit){//根据‘选中的树元素’、‘当前页’和‘每页条数’获取列表数据
      let that=this;
      if(!item){//如果是‘翻页’或‘调整每页条数’时，将在父组件调用该子组件的该方法，利用$refs获得当前选中项，并且‘当前页’和‘每页条数’取父组件传入该方法的参数
        item = this.$refs.tree.getSelectedNodes()
        that.treeData.pager.current = current
        that.treeData.pager.limit = limit
      }
      if(item.length==0||item[0].title==that.treeData.treeTitle){
        that.tree.selected=false;
        that.$parent.refreshData()
      }
      else{
        let params = {}
        params.page = that.treeData.pager.current;
        params.limit = that.treeData.pager.limit;
        that.tree.selected = true;
        that.$http.get(that.treeData.chooseNodeUrl + item[0][that.treeData.typeId], {params: params}).then((resp) => {
          that.$emit('changeTreeNode',resp,item)
          
        });
      }
    },
    treeAddInit(e){//点击树添加
      let s_item = this.category[0];
      let sns = this.$refs.tree.getSelectedNodes();
      if(sns && sns.length == 1){
        s_item = sns[0];
      }
      this.dto.nodeTypeValue = this.$iqis.utils.findPathInTree(this.category[0],[],s_item[this.treeData.typeId],this.treeData.typeId)||[];
      this.dto.nodeName = "";
      this.$nextTick(function () {
        this.$refs.addTxt.focus();
      });
    },
    treeEditInit(e){//点击树编辑
      let s_item = null;
      let sns = this.$refs.tree.getSelectedNodes();
      if(sns && sns.length == 1){
        s_item = sns[0];
      }
      console.log(s_item,'s_item');
      this.dto.nodeTypeValue = this.$iqis.utils.findPathInTree(this.category[0],[],s_item.parentId,this.treeData.typeId)||[0];
      this.dto.nodeName = s_item.label;
      this.dto.nodeId = s_item[this.treeData.typeId]
      this.$nextTick(function () {
        this.$refs.editTxt.focus();
      });
    },
    addNode(){//保存树添加
      let that = this;
      that.dto.nodeTypeId = that.dto.nodeTypeValue[that.dto.nodeTypeValue.length-1]
      let params = [
        {type: 'Empty', title: this.treeData.treeTitle, value: that.dto.nodeName},
        {type: 'Name', title: this.treeData.treeTitle, value: that.dto.nodeName},
        {type: 'Empty', title:"所属分类", value: that.dto.nodeTypeId},
      ]
      let state = true;
      for (let i in params) {
        state = that.$iqis.utils.formValidate(params[i].type, params[i].title, params[i].value, (tips) => {
          that.$Notice.warning({title: tips})
        })
        if (!state) {
          return;
          break;
        }
      }
      if(that.dto.nodeName == this.treeData.treeTitle){
        that.$Notice.warning({title:'类别名称不能为'+this.treeData.treeTitle})
        return;
      }
      let dto = {
        [that.treeData.typeName] : that.dto.nodeName,
        parentId : that.dto.nodeTypeId
      };
      that.$http.post(that.treeData.addTreeUrl,dto).then(function (resp) {
        that.$Message.success(i18n.t("quality.sas"));
        that.tree.add = false;
        that.refreshTypeTree(that.dto.nodeTypeId);
        that.dto.nodeName = "";
      })
    },
    editNode(){//保存树编辑
      let that = this;
      that.dto.nodeTypeId = that.dto.nodeTypeValue[that.dto.nodeTypeValue.length-1]
      let params = [
        {type: 'Empty', title: this.treeData.treeTitle, value: that.dto.nodeName},
        {type: 'Name', title: this.treeData.treeTitle, value: that.dto.nodeName},
        {type: 'Empty', title:"所属分类", value: that.dto.nodeTypeId},
      ]
      let state = true;
      for (let i in params) {
        state = that.$iqis.utils.formValidate(params[i].type, params[i].title, params[i].value, (tips) => {
          that.$Notice.warning({title: tips})
        })
        if (!state) {
          return;
          break;
        }
      }
      if(that.dto.nodeName == this.treeData.treeTitle){
        that.$Notice.warning({title:'类别名称不能为'+this.treeData.treeTitle})
        return;
      }
      let dto = {
        [this.treeData.typeId]:this.dto.nodeId,
        [this.treeData.typeName] : this.dto.nodeName,
        parentId : that.dto.nodeTypeId
      };
      this.$http.put(this.treeData.editTreeUrl,dto).then(function (resp) {
        that.$Message.success(i18n.t("quality.ats"));
        that.tree.edit = false;
        that.refreshTypeTree(that.dto.nodeTypeId);
        that.dto.nodeName = "";
      })
    },
    deleteNode(){//删除树元素
      let s_item = null;
      let sns = this.$refs.tree.getSelectedNodes();
      if(sns && sns.length == 1){
        s_item = sns[0];
      }

      if(s_item){
        let that = this;
        this.$http.delete(this.treeData.deleteTreeUrl+s_item.value).then(function (resp) {
          that.$Message.success(i18n.t("quality.ds"));
          that.refreshTypeTree(null);
        });
      }

    },
  }
}
</script>

<style>
.treeToggleIcon{
    position: absolute;
    left:-1px;
    top: 50%;
    transform: translate(0,-50%);
    z-index: 999;
    width: 18px !important;
    height: 34px !important;
    line-height: 34px;
    border: 1px solid #e9eaec;
    text-align: center;
    border-top-right-radius:3px;
    border-bottom-right-radius:3px;
    cursor: pointer;
}
.divPadding16{
  padding-right:16px;
}
.amendStyle .ivu-poptip-body{
  padding: 8px 5px 0 5px!important;
}
.amendStyle .ivu-btn-long{
  height: 35px;
}
</style>
