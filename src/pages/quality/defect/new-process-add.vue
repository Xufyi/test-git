<template>
  <div class="iqis-page new-process">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t("pqc.basicInformation")}}
      </div>
      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">流程名称</div>
            <div class="iqis-page-block-ctrl">
              <i-input v-model="dto.name" style="width: 100%;" :disabled="noPermsDis"></i-input>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">适用部门</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.departmentId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in departmentList" :value="item.departmentId" :key="index">{{ item.departmentName }}</Option>
              </Select>
            </div>
          </i-col>
        </Row>
      </div>
    </div>
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        编辑流程
      </div>

      <div class="iqis-page-block-body">
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">审核人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.auditorId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">评审团1</div>
            <div class="iqis-page-block-ctrl">
              <Button :disabled="noPermsDis" type="primary" icon="person-stalker" v-if="reviewer1Btn&&!noPermsDis" @click="reviewer1Btn=false;">{{$t('customer.addMoreMember')}}</Button>
              <Select :placeholder="i18n.t('pleaseChoose')" style="width:146px" v-else v-model="reviewer1Id" @on-change="addMember(reviewer1Id,dto.reviewers1)" filterable>
                <Option v-for="(item,index) in userList" :key="index" :value="item.userId">{{item.name}}</Option>
              </Select>
              <draggable style="display:inline-block" v-model="dto.reviewers1" :options="{group:'people'}" @start="drag=true" @end="drag=false;">
                <Tag :closable="!noPermsDis" v-for="(item,index) in dto.reviewers1" type="dot" color="blue" :key="index" :name="index" @on-close="deleteMember(index,dto.reviewers1)">{{item.reviewerName}}</Tag>
              </draggable>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">判定人1</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.judge1Id" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">上诉人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.appellantId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="24">
            <div class="iqis-page-block-label">评审团2</div>
            <div class="iqis-page-block-ctrl">
              <Button :disabled="noPermsDis" type="primary" icon="person-stalker" v-if="reviewer2Btn&&!noPermsDis" @click="reviewer2Btn=false;">{{$t('customer.addMoreMember')}}</Button>
              <Select :placeholder="i18n.t('pleaseChoose')" style="width:146px" v-else v-model="reviewer2Id" @on-change="addMember(reviewer2Id,dto.reviewers2)" filterable>
                <Option v-for="(item,index) in userList" :key="index" :value="item.userId">{{item.name}}</Option>
              </Select>
              <draggable style="display:inline-block" v-model="dto.reviewers2" :options="{group:'people'}" @start="drag=true" @end="drag=false;">
                <Tag :closable="!noPermsDis" v-for="(item,index) in dto.reviewers2" type="dot" color="blue" :key="index" :name="index" @on-close="deleteMember(index,dto.reviewers2)">{{item.reviewerName}}</Tag>
              </draggable>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">判定人2</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.judge2Id" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">重工处理通知人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.notifierId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">重工发起人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.initiatorId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">填写重工方法人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.writerId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">IQC确认人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.iqcConfId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">SQA确认人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.sqaConfId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">生产部确认人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.prodDepaConfId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">资材部确认人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.matDepaConfId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">重工执行人（制表人）</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.enforcerId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">审核人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.reAuditorId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">核准人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.approverId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">品管确认人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.qualManageConfId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">生管确认人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.prodManageConfId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="25">
          <i-col span="6">
            <div class="iqis-page-block-label">采购签核人</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.purchaseAuditorId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
          <i-col span="6">
            <div class="iqis-page-block-label">经理签核</div>
            <div class="iqis-page-block-ctrl">
              <Select v-model="dto.managerAuditorId" filterable :placeholder="i18n.t('pqc.pleaseChoose')" :disabled="noPermsDis">
                <Option v-for="(item,index) in userList" :value="item.userId" :key="index">{{ item.name }}</Option>
              </Select>
            </div>
          </i-col>
        </Row>
      </div>
    </div>


    <div class="page-end" style="padding-bottom: 65px"></div>
    <Spin size="large" fix v-if="loading"></Spin>
    <IqisAffix placement="bottom" :offset="0">
      <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
        <Button v-if="!noPermsDis&&!loading" type="primary" @click="save">{{$t('product.save')}}</Button>
        <Button type="ghost" @click="closePage">{{$t('product.cancel')}}</Button>
      </div>
    </IqisAffix>

  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: ["params", "tabKey"],
  data(){
    return{
      reviewProcessId:null,
      reviewer1Btn:true,
      reviewer1Id:null,
      reviewer2Btn:true,
      reviewer2Id:null,
      noPermsDis:null,
      loading:false,
      i18n:window.i18n,
      departmentList:[],
      userList:[],
      dto:{
        reviewProcessId:null,
        name:"",//流程名称
        departmentId:null,//适用部门
        auditorId:null,//审核人
        reviewers1:[//评审团1
          // {
          //   reviewerId:null,
          //   reviewerName:''
          // }
        ],
        judge1Id:null,//判定人1
        appellantId:null,//上诉人
        reviewers2:[//评审团2
          // {
          //   reviewerId:null,
          //   reviewerName:''
          // }
        ],
        judge2Id:null,//判定人2
        notifierId:null,//重工处理通知人
        initiatorId:null,//重工发起人
        writerId:null,//填写重工方法人
        iqcConfId:null,//IQC确认人
        sqaConfId:null,//SQA确认人
        prodDepaConfId:null,//生产部确认人
        matDepaConfId:null,//资材部确认人
        enforcerId:null,//重工执行人
        reAuditorId:null,//（重工）审核人
        approverId:null,//核准人
        qualManageConfId:null,//品管确认人
        prodManageConfId:null,//生管确认人
        purchaseAuditorId:null,//采购签核人
        managerAuditorId:null,//经理签核
      }
    }
  },
  created(){
    this.refreshData()
  },
  methods:{
    refreshData(){
      this.reviewProcessId = this.$props.params && this.$props.params.reviewProcessId;
      this.$http.all([
        this.$http.get('/tenant/user',{params:{limit:999999}}),
        this.$http.get('/systemManage/allDepartment'),
      ]).then(res=>{
        this.userList = res[0].data
        this.departmentList = res[1].data
        if(this.reviewProcessId){
          this.$http.get('/basic/reviewprocess/'+this.reviewProcessId).then(res=>{
            this.dto = res.data
          })
        }
      })
    },
    addMember(id,part){//添加小组成员
      let that = this;
      let array=[];
      for(let i=0;i<part.length;i++){
        array.push(part[i].reviewerId);
      }
      that.$http.get('/tenant/user/'+id).then(function(resp){
        let name=resp.data.name;
        if(array.indexOf(id)==-1){
          part.push({
            reviewerId:id,
            reviewerName:name
          });
        }else{
          that.$Notice.warning({title: i18n.t('customer.memberExisted')});
        }
      })
    },
    deleteMember(index,part){//删除小组成员
      let that = this;
      part.splice(index, 1);
    },
    save(){
      let dto = JSON.parse(JSON.stringify(this.dto))
      console.log(dto);
      let params = [
        {type: 'Empty', title: '流程名称', value: dto.name},
        {type: 'Name', title: '流程名称', value: dto.name},
        {type: 'Empty', title: '适用部门', value: dto.departmentId},
        {type: 'Empty', title: '审核人', value: dto.auditorId},
        {type: 'EmptyLength', title: '评审团1', value: dto.reviewers1},
        {type: 'Empty', title: '判定人1', value: dto.judge1Id},
        {type: 'Empty', title: '上诉人', value: dto.appellantId},
        {type: 'EmptyLength', title: '评审团2', value: dto.reviewers2},
        {type: 'Empty', title: '判定人2', value: dto.judge2Id},
        {type: 'Empty', title: '重工处理通知人', value: dto.notifierId},
        {type: 'Empty', title: '重工发起人', value: dto.initiatorId},
        {type: 'Empty', title: '填写重工方法人', value: dto.writerId},
        {type: 'Empty', title: 'IQC确认人', value: dto.iqcConfId},
        {type: 'Empty', title: 'SQA确认人', value: dto.sqaConfId},
        {type: 'Empty', title: '生产部确认人', value: dto.prodDepaConfId},
        {type: 'Empty', title: '资材部确认人', value: dto.matDepaConfId},
        {type: 'Empty', title: '重工执行人', value: dto.enforcerId},
        {type: 'Empty', title: '（重工）审核人', value: dto.reAuditorId},
        {type: 'Empty', title: '核准人', value: dto.approverId},
        {type: 'Empty', title: '品管确认人', value: dto.qualManageConfId},
        {type: 'Empty', title: '生管确认人', value: dto.prodManageConfId},
        {type: 'Empty', title: '采购签核人', value: dto.purchaseAuditorId},
        {type: 'Empty', title: '经理签核', value: dto.managerAuditorId},
      ]
      let state = true;
      for (let i in params) {
        state = this.$iqis.utils.formValidate(params[i].type, params[i].title, params[i].value, (tips) => {
          this.$Notice.warning({title: tips})//,duration: 0
        })
        if (!state) {
          return;
          break;
        }
      }
      dto['reviewer1'] = []
      for(let i in dto.reviewers1){
        dto['reviewer1'].push(dto.reviewers1[i].reviewerId)
      }
      dto.reviewer1 = dto.reviewer1.length==1?dto.reviewer1[0]:dto.reviewer1.join(',')
      dto['reviewer2'] = []
      for(let i in dto.reviewers2){
        dto['reviewer2'].push(dto.reviewers2[i].reviewerId)
      }
      dto.reviewer2 = dto.reviewer2.length==1?dto.reviewer2[0]:dto.reviewer2.join(',')
      let dto2 = {
        reviewProcessId:dto.reviewProcessId,
        name:dto.name,
        departmentId:dto.departmentId,
        auditorId:dto.auditorId,
        judge1Id:dto.judge1Id,
        appellantId:dto.appellantId,
        judge2Id:dto.judge2Id,
        notifierId:dto.notifierId,
        initiatorId:dto.initiatorId,
        writerId:dto.writerId,
        iqcConfId:dto.iqcConfId,
        sqaConfId:dto.sqaConfId,
        prodDepaConfId:dto.prodDepaConfId,
        matDepaConfId:dto.matDepaConfId,
        enforcerId:dto.enforcerId,
        reAuditorId:dto.reAuditorId,
        approverId:dto.approverId,
        qualManageConfId:dto.qualManageConfId,
        prodManageConfId:dto.prodManageConfId,
        purchaseAuditorId:dto.purchaseAuditorId,
        managerAuditorId:dto.managerAuditorId,
        reviewer1:dto.reviewer1,
        reviewer2:dto.reviewer2,
      }
      if(!this.reviewProcessId){
        this.$http.post('/basic/reviewprocess',dto2).then(res=>{
          this.$Message.success('添加成功')
          this.closePage()
        })
      }else{
        this.$http.put('/basic/reviewprocess',dto2).then(res=>{
          this.$Message.success('保存成功')
        })
      }
    },
    closePage(){
      this.$emit("close-tab",this.$props.tabKey);
    },
  }
}
</script>

<style>
.new-process .ivu-col-span-6{
  width:20%!important;
}
</style>
