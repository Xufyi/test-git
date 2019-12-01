 <template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-body" style="width:800px;margin:0 auto;">
        <Row type="flex" :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('customer.custType')}}</div>
          </i-col>
          <i-col span="4">
            <div class="iqis-page-block-ctrl">
              <Cascader  :disabled="noPermsDis" v-model="add.customerTypeValue" :data="customerTypes[0].children" :render-format = "loadTypeRender"
                    change-on-select :clearable="false" style="width: 100%"></Cascader>
            </div>
          </i-col>
          <i-col span="24" v-if="add.customerId">
            <div class="iqis-page-block-label">{{$t('customer.latestReviewResults')}}</div>
          </i-col>
          <i-col span="24" v-if="add.customerId">
            <div class="iqis-page-block-ctrl">
              <i-input disabled  v-model="add.recentlyReviewGrade" :value="add.recentlyReviewGrade" style="width: 100%;"></i-input>
            </div>
          </i-col>
          <i-col span="24" v-if="add.customerId">
            <div class="iqis-page-block-label">{{$t('customer.latestRating')}}</div>
          </i-col>
          <i-col span="24" v-if="add.customerId">
            <div class="iqis-page-block-ctrl">
              <i-input disabled v-model="add.recentlyScoreGrade" :value="add.recentlyScoreGrade" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('customer.fullNameCH')}}</div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-ctrl">
              <i-input  :disabled="noPermsDis" @on-blur="onBlur(add.customerName)" v-model.trim="add.customerName" :value="add.customerName" style="width: 100%;"></i-input>
              <span class="guagliang" v-if="add.customerName!=''&&this.customerTenantId !=null"><Icon type="checkmark"></Icon>{{$t('customer.relation')}}</span>
            </div>
            <div class="NoPrompt" v-if="this.state ==true&&this.customerTenantId==null">{{$t('customer.notRelation')}}</div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('customer.fullNameEN')}}</div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-ctrl">
              <i-input  :disabled="noPermsDis" v-model="add.customerEngName" :value="add.customerEngName" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('customer.customerNo')}}</div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-ctrl">
              <i-input  :disabled="noPermsDis" v-model="add.customerNum" :value="add.customerNum" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('customer.customerShortName')}}</div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-ctrl">
              <i-input  :disabled="noPermsDis" v-model="add.customerAbbreviation" :value="add.customerAbbreviation" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('customer.contact')}}</div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-ctrl">
              <i-input  :disabled="noPermsDis" v-model="add.contacts" :value="add.contacts" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('customer.contactNumber')}}</div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-ctrl">
              <i-input  :disabled="noPermsDis" v-model="add.phone" :value="add.phone" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('customer.customerAddress')}}</div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-ctrl">
              <i-input  :disabled="noPermsDis" v-model="add.address" style="width: 100%;"></i-input>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="24">
            <div class="iqis-page-block-label">{{$t('customer.remarks')}}</div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-ctrl">
              <!-- <i-form ref="formInline" :model="formInline" :rules="ruleInline">
                <form-item prop="formInline.user"> -->
                  <i-input  :disabled="noPermsDis" type="textarea" v-model="add.remark" :value="add.remark" style="width: 100%;"></i-input>
                <!-- </form-item>
              </i-form> -->
            </div>
          </i-col>
        </Row>
      </div>
    </div>


    <IqisAffix placement="bottom" :offset="0">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button type="primary" v-if="!noPermsDis" @click="save">{{$t('customer.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('customer.cancel')}}</Button>
      </div>
    </IqisAffix>
    <!--end blocks-->
    <div class="page-end" style="padding-bottom: 65px"></div>
    <!-- <Spin size="large" fix v-if="loadStat.customerDataLoading || loadStat.selectsDataLoading"></Spin> -->
  </div>
</template>
<script>

export default {
  props:["params","tabKey"],
  data(){
    let vm = this;
    return{
      user:'',
      password:'',
      i18n:window.i18n,
      // formInline: {
      //     user: ''
      // },
      // ruleInline: {
      //     user: [
      //         { required: true, message: 'Please fill in the user name', trigger: 'blur' }
      //     ]
      // },
      loadStat:{
        selectsDataLoading:true,
        customerDataLoading:true,
        saveLoading:false
      },
      editModal:{
        dataLoading:true,
        item:{},
        show:false,
        requesting:false
      },
      state:false,
      customerTenantId:null,
      customerTypes:[],
      customerTypeId:'',
      add:{
        address:'',
        contacts:'',
        customerAbbreviation:'',
        customerTypeValue:[],
        customerEngName:'',
        customerId:'',
        customerName:'',
        customerNameAll:'',
        customerNum:'',
        customerTenantId:'',
        customerTypeId:'',
        customerTypeName:'',
        operateDate:new Date(),
        phone:'',
        recentlyReviewGrade:'',
        recentlyScoreGrade:'',
        remark:''
      },
      permsCur:[
        "UPDATE_CUSTOMER",
        "INSERT_CUSTOMER",
      ],//当前页面需要的权限名称
      permsBtn:{//控制每个权限对应按钮的禁用状态
        "UPDATE_CUSTOMER":false,
        "INSERT_CUSTOMER":false,
      },
      noPermsDis:true,

    }
  },
  created(){
    let permsAll = this.$store.state.permissions; 
    this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
    this.refreshData();
    this.state='';
  },
  methods:{
    // handleSubmit(name) {
    //     this.$refs[name].validate((valid) => {
    //         if (valid) {
    //             this.$Message.success('Success!');
    //         } else {
    //             this.$Message.error('Fail!');
    //         }
    //     })
    // },
    refreshData(){
      let that = this;
      this.loadSelectsData();//加载联动选择框
      this.add.customerId = this.$props.params && this.$props.params.customerId||'';
      // //console.log(customerId);
      if(this.add.customerId){
        this.editThis();//导入数据
      }else{
        // this.clear();
        that.add.customerTypeValue = that.$props.params && that.$props.params.customerTypeValue;
        //console.log(that.$props,'寻找传过来的类别')
      }
      if((this.add.customerId&&this.permsBtn.UPDATE_CUSTOMER)||(!this.add.customerId&&this.permsBtn.INSERT_CUSTOMER)){
        this.noPermsDis=false;
      }else{
        this.noPermsDis=true;
      }
    },
    loadTypeRender(label){//处理联动选择框的数据A/B/C为C  render-format
      if(!label || label.length == 0){
        return '-';
      }
      let result = label[label.length-1];

      if( (this.customerTypes.length > 0  && result == this.customerTypes[0].label)){
        return '-'
      }
      // return result;

      //console.log(result);
      this.add.customerTypeName= result;
      return result;
    },
    loadSelectsData(callback){//获取数据
      let that = this;
      this.$http.get("/bas/customerType",{params:{limit:99999999}}).then(function(resps){
        let root = {title:i18n.t('customer.custType'),selected: false,label:i18n.t('customer.custType'),value:0,expand:true};
        // //console.log(resps.data);
        // //console.log('===========================');
        if(resps.data){
          that.$iqis.utils.treeify(resps.data,root,"customerTypeId",function(item){
            return item.customerTypeName;
          },"parentId");
        }
        that.customerTypes = [root];
        callback && callback();
      })

    },


    save(){
      let that = this;
      if(that.add.customerTypeValue[0]==0||that.add.customerTypeValue.length<1){
        that.$Notice.warning({title: i18n.t('customer.custTypeNull')});
        return;
      }
      let params = [
        {type: 'Empty', title: i18n.t('customer.fullNameCH'), value: that.add.customerName},
        {type: 'NameCN', title: i18n.t('customer.fullNameCH'), value: that.add.customerName},
        // {type: 'Empty', title: '客户英文全称', value: that.add.customerEngName},
        {type: 'NameEN', title: i18n.t('customer.fullNameEN'), value: that.add.customerEngName},
        {type: 'Empty', title: i18n.t('customer.customerNo'), value: that.add.customerNum},
        {type: 'No', title: i18n.t('customer.customerNo'), value: that.add.customerNum},
        {type: 'Empty', title: i18n.t('customer.customerShortName'), value: that.add.customerAbbreviation},
        {type: 'Word20', title: i18n.t('customer.contact'), value: that.add.contacts},
        {type: 'Word20', title: i18n.t('customer.contactNumber'), value: that.add.phone},
        {type: 'Word100', title: i18n.t('customer.customerAddress'), value: that.add.address},
        {type: 'Word600', title: i18n.t('customer.remarks'), value: that.add.remark},
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
      
      let newData = {
        address:that.add.address,
        contacts:that.add.contacts,
        customerAbbreviation:that.add.customerAbbreviation,
        customerEngName:that.add.customerEngName,
        customerId:that.add.customerId,
        customerName:that.add.customerName,
        customerNameAll:that.add.customerNameAll,
        customerNum:that.add.customerNum,
        customerTenantId:that.customerTenantId,
        customerTypeId:that.add.customerTypeId,
        customerTypeName:that.add.customerTypeName,
        operateDate:(new Date(that.add.operateDate)).getTime(),
        phone:that.add.phone,
        recentlyReviewGrade:that.add.recentlyReviewGrade,
        recentlyScoreGrade:that.add.recentlyScoreGrade,
        remark:that.add.remark
      };
      let customerTypeId = null;
      if(that.add.customerTypeValue && that.add.customerTypeValue.length > 0){
        customerTypeId = that.add.customerTypeValue[that.add.customerTypeValue.length-1];
      }
      newData.customerTypeId = customerTypeId;
//      that.add.customerId == that.$props.params && that.$props.params.customerId;
      //console.log(newData)
      if( that.add.customerId && that.add.customerId >0 ){
        that.$http.put("/bas/customer",newData).then(function (resp) {
          that.$Message.success(i18n.t('customer.editSuccess'));
          that.closePage();
          that.$emit("close-tab",'customer-service-list');
          that.$emit("open-tab",'customer-service-list',i18n.t('customer.customerList'),'page-customer-list',{customerTypeId:that.customerTypeId});//that.add.customerTypeId原值
        })
      }else{
        that.$http.post("/bas/customer",newData).then(function(resp){
          that.$Message.success(i18n.t('customer.addSuccess'));
          that.closePage();
          that.$emit("close-tab",'customer-service-list');
          that.$emit("open-tab",'customer-service-list',i18n.t('customer.customerList'),'page-customer-list',{customerTypeId:newData.customerTypeId});
        })
      }
    },
    editThis(){//获取所有输入框数据
      let that = this;
      let customerId = that.add.customerId = that.$props.params && that.$props.params.customerId;
      that.loadSelectsData(function(){
        that.$http.get("/bas/customer/"+customerId).then(function (resp) {
          //console.log(resp)
          let item = resp.data;

          // if(userId = 12){
          //  resp.data['role'] = "auditor"
          // }
          that.$iqis.utils.deepMerge(that.add,item)
          if(item.operateDate){
            item.operateDate = new Date(item.operateDate);
          }else{
            item.operateDate = "";
          }
          let result = that.$iqis.utils.findPathInTree(that.customerTypes[0],[],item.customerTypeId,"customerTypeId");
          result = result || [];//customerTypeValue

          item.customerTypeValue = result;

          //console.log(that.customerTypes[0])
          //console.log(item);
          that.add = item;
          that.add.customerTenantId=resp.data.customerTenantId;
          if(resp.data.customerTenantId==null){
            that.state=true;
          }else{
            that.state=false;
          }
          that.onBlur(that.add.customerName);
          that.customerTypeId=resp.data.customerTypeId;

        });

      });
    },
    closePage(){
      this.$emit("close-tab",this.$props.tabKey);
    },
    onBlur(val){
      let that=this;
      let url="/tenant/tenant/?manufacturerName="
      that.$http.get(url+val).then((res)=>{
          // //console.log(res)
          if(res.data==null||res.data==''){
            that.state=true;
            that.customerTenantId=null;
            that.add.customerTenantId=null;
            
          }else {
            that.state=false;
            that.customerTenantId=res.data.tenantId;
            that.add.customerTenantId=res.data.tenantId;
          }
      })
    },
  }

}
</script>

<style scoped>
.iqis-page-block-label{
  padding:6px 1px;
}
.ivu-row-flex{
  /* margin-bottom:10px; */
  margin-top: 0;
}
.guagliang{display: inline-block;position: absolute;top: 0;right: -65px;color: forestgreen;}
.guagliang i{display: inline-block;padding-right: 5px;}
.NoPrompt{width: 100%;box-sizing: border-box;color: #418fee;}
</style>
