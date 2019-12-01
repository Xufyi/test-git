<template>
    <div class="iqis-profile-box" v-clickoutside="handleClose">
        <!-- <div class="" ref="reference" @click="toggleVisible">
            <i class="header-icon remind-icon">
                <Icon type="ios-person"></Icon>
            </i>
            <span class="cus-info">{{user.name}}</span>
        </div> -->
        <div class="" ref="reference" id='userBOX'>
            <span class="profile-count" style="float:left;margin-right:10px;">
                <i class="header-icon remind-icon">
                  <Badge>
                    <!-- <Icon type="ios-person"></Icon> -->
                    <img src="../../../static/img/person.svg" alt="" width="20px" height='20px'><!--iqis_user.png-->              
                  </Badge>
                </i>
            </span>
            <!-- <span class="cus-info" style="display:inline-block;width:6em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{user.name}}<img id="iconDown" style="margin-left:5px;position:relative;top:-1px;" src="../../assets/down.svg"/></span> -->
            <div class="cus-info" style="display:inline-block;width:101px;"><span style="float:left;max-width:6em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{user.name}}</span><img id="iconDown" style="margin-left:5px;position:relative;top:-1px;" src="../../assets/down.svg"/></div>
        <transition name="transition-drop">
          <Drop
              v-show="visible"
              @click.native="handleTransferClick"
              :class="{ [prefixCls + '-transfer']: transfer }"
              class-name="ivu-transfer-no-max-height"
              :placement="placement"
              ref="drop"
              :data-transfer="transfer"
              v-transfer-dom>
              <div class="message-div message-div2">
                  <div style="line-height: normal;text-align: center; display:tabble;">
                    <div style="line-height: 60px;display:inline-block;">
                      <div style="display:table-cell;vertical-align:middle;">
                        <Avatar style="background-color: #69b0ff" icon="person" size="large"/>
                      </div>
                      <div style="display:table-cell;vertical-align:middle; line-height:18px;padding: 0 32px 0 8px;text-align:left;">
                        <div style="color:#262626;font-size:18px;margin-bottom:8px;">{{user.name}}</div>
                        <div style='font-size:14px'>{{user.job}}</div>
                      </div>
                    </div>
                  </div>
                  <div class="message-list-div">
                      <!-- <template v-for="(item,index) in messageList">
                        <a href="#" :key="index" class="list-group-item" @click="onEnter">
                            <div class="iqis-message-time">
                                <span class="">{{item.title}}</span>
                            </div>
                        </a>
                      </template> -->
                      <template>
                        <a href="#" class="list-group-item">
                            <div class="iqis-message-time" @click = "infoModalShow">
                                <span class="">{{$t("message.pd")}}</span>
                            </div>
                        </a>
                        <a href="#" class="list-group-item">
                            <div class="iqis-message-time" @click="showModal">
                                <span class="" >{{$t("message.cp")}}</span>
                            </div>
                        </a>
                        <a href="#" class="list-group-item" @click="toOperationGuide">
                            <div class="iqis-message-time">
                                <span class="">{{$t("message.ow")}}</span>
                                <!-- operationGuide -->
                            </div>
                        </a>
                        <a href="http://www.wuqc.cn/h-col-150.html" target="_blank" class="list-group-item">
                            <div class="iqis-message-time">
                                <span class="">{{$t("message.vc")}}</span>
                            </div>
                        </a>
                        
                        
                        <a href="http://www.wuqc.cn/h-col-135.html" target="_blank" class="list-group-item">
                            <div class="iqis-message-time">
                                <span class="">{{$t("message.us")}}</span>
                            </div>
                        </a>
                        <a href="http://www.wuqc.cn/h-col-101.html" target="_blank" class="list-group-item">
                            <div class="iqis-message-time">
                                <span class="">{{$t("message.au")}}</span>
                            </div>
                        </a>
                        
                        <!-- <a v-if="account=='admin'||jobName=='管理员'" href="http://www.wuqc.cn/h-pd-4.html#_pp=114_785" class="list-group-item" target='_blank'>
                            <div class="iqis-message-time">
                                <span class="">立即购买</span>
                            </div>
                        </a> -->
                        <!-- <router-link to="/page">
                          <div class="iqis-message-time">
                                <span class="">操作向导</span>
                            </div>
                        </router-link> -->
                        <a class="list-group-item" @click="logout">
                            <div class="iqis-message-time">
                                <span class="">{{$t("message.se")}}</span>
                            </div>
                        </a>
                      </template>
                  </div>
              </div>
          </Drop>
        </transition>
        </div>

        <Modal
            :title="i18n.t('message.cp')"
            v-model="modalShow"
            class="rankBox"
            :mask-closable="false"
            :width="600"
						@on-cancel="cancel" >
						<Form :model="formLeft" label-position="left" ref="formCustom">
							<FormItem :label="i18n.t('message.un')">
									<Input v-model="user.name"  :disabled="true"></Input>
							</FormItem>
							<FormItem :label="i18n.t('message.opd')" prop="password">
									<Input v-model="formLeft.password" type='password' :placeholder="i18n.t('message.pio')"></Input>
							</FormItem>
							<FormItem :label="i18n.t('message.np')" prop="newPassword">
									<Input type='password' v-model="formLeft.newPassword" :placeholder="i18n.t('message.pea')"></Input>
							</FormItem>
							<FormItem :label="i18n.t('message.pr')" prop="confirmNewPassword">
									<Input type='password' v-model="formLeft.confirmNewPassword" :placeholder="i18n.t('message.pea')"></Input>
							</FormItem>
						</Form>
							<div slot="footer">
							<Button type="primary" size="large" @click = "submits">{{$t("message.cm")}}</Button>
							<Button type="text" size="large" @click = "cancel" >{{$t("message.ce")}}</Button>
            </div>
        </Modal>
				<Modal
            :title="i18n.t('message.pd')"
            v-model="infoModal"
            class="rankBox"
            :mask-closable="false"
            :width="600"
						@on-cancel="infoCancel" >
						<Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
							<FormItem :label="i18n.t('message.ua')" prop="account">
								<Input v-model="formValidate.account" :disabled = "true" ></Input>
							</FormItem>
							<FormItem :label="i18n.t('message.um')" prop="name">
									<Input :disabled='true' v-model="formValidate.name" ></Input>
							</FormItem>
							<FormItem :label="i18n.t('message.cn')" prop="companyName">
									<Input :disabled='true' v-model="formValidate.companyName" ></Input>
							</FormItem>
							<FormItem :label="i18n.t('message.dt')" prop="departmentName">
									<Select :placeholder="i18n.t('message.ps')" :disabled='true' v-model="formValidate.departmentId">
											<Option v-for="item in departmentNameList" :value="item.departmentId" :key="item.departmentId">{{ item.departmentName }}</Option>
									</Select>
							</FormItem>
							<FormItem :label="i18n.t('message.sr')" prop="jobId">
									<Select :placeholder="i18n.t('message.ps')" :disabled='true' v-model="formValidate.jobId">
											<Option v-for="item in jobList" :value="item.jobId" :key="item.jobId">{{ item.jobName }}</Option>
									</Select>
							</FormItem>
							<FormItem :label="i18n.t('message.ci')" prop="phoneNum">
									<Input :disabled='!updateInfo' v-model="formValidate.phoneNum"></Input>
							</FormItem>
							<FormItem :label="i18n.t('message.ea')" prop="email">
									<Input :disabled='!updateInfo' v-model="formValidate.email"></Input>
							</FormItem>
							<FormItem :label="i18n.t('message.re')" prop="remark">
									<Input :disabled='true' v-model="formValidate.remark"></Input>
							</FormItem>
						</Form>
						<div slot="footer">
							<Button type="primary" size="large" v-if='updateInfo' @click="submitInfo">{{$t("message.cm")}}</Button>
							<Button type="primary" size="large" v-if='!updateInfo' @click=" clickUpdate">{{$t("message.md")}}</Button>
							<Button type="text" size="large" @click = "infoCancel" >{{$t("message.ce")}}</Button>
            </div>
				</Modal>
    </div>
</template>
<script>
import $ from "jquery";
import Vue from "vue";
import clickoutside from "iview/src/directives/clickoutside";
import TransferDom from "iview/src/directives/transfer-dom";
import { oneOf } from "iview/src/utils/assist";
import Drop from "iview/src/components/select/dropdown.vue";
import md5 from "js-md5";

const prefixCls = "ivu-color-picker";
export default {
  components: { Drop },
  directives: { clickoutside, TransferDom },
  props: {
    open: {
      type: Boolean
    },
    transfer: {
      type: Boolean,
      default: false
    },
    placement: {
      validator(value) {
        return oneOf(value, [
          "top",
          "top-start",
          "top-end",
          "bottom",
          "bottom-start",
          "bottom-end",
          "left",
          "left-start",
          "left-end",
          "right",
          "right-start",
          "right-end"
        ]);
      },
      default: "bottom"
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(i18n.t("message.pey")));
      } else {
        callback();
      }
    };
    const validateNewPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(i18n.t("message.pia")));
      } else {
        if (this.formLeft.newPassword !== "") {
          // 对第二个密码框单独验证
          // this.$refs.formCustom.validateField("confirmNewPassword");
        }
        callback();
      }
    };

    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(i18n.t("message.pia")));
      } else if (value !== this.formLeft.newPassword) {
        callback(new Error(i18n.t("message.tt")));
      } else {
        callback();
      }
    };

    return {
      i18n:window.i18n,
			updateInfo: false,
      infoModal: false,
      disableCloseUnderTransfer: false, // transfer 模式下，点击Drop也会触发关闭
      visible: false,
      modalShow: false,
      prefixCls: prefixCls,
      messageList: [
        { title: i18n.t("message.pd") },
        { title: i18n.t("message.cp") },
        { title: i18n.t("message.he") },
        { title: i18n.t("message.au") },
        { title: i18n.t("message.se") }
      ],
      user: {
        name: '',
        job: '',
        userId: ''
      },
      formValidate: {
				userId:'',
        name: '',
        email: '',
				account: '',
				companyName: '',
				departmentName: '',
				jobName: '',
				phoneNum: '',
				remark:'',
				departmentId:'',
				jobId:'',
				createTime:'',
        mobile:''
			},
			departmentNameList:[],
			jobList:[],
			ruleValidate:{

			},
      formLeft: {
        password: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      ruleCustom: {
        password: [{ validator: validatePass, trigger: "blur" }],
        newPassword: [{ validator: validateNewPass, trigger: "blur" }],
        confirmNewPassword: [{ validator: validatePassCheck, trigger: "blur" }]
      },
      account:'',
      jobName:''
    };
  },
  
  watch: {
    visible:function(val) {
      if (val) {
        this.$refs.drop.update();
      } else {
        this.$refs.drop.destroy();
      }
    }
  },
  created() {
    let that = this;
    that.getName();
    that.$http.get("/tenant/user/profile").then(function (resp) {
      that.account = resp.data.account;
      that.jobName = resp.data.jobName;

    })
  },
  methods: {
    toOperationGuide(){
      const {href} = this.$router.resolve({ 
        name: 'operationGuide',
      }); 
      window.open(href, '_blank');
    },
		/**
		 * 获取工作名称列表
		 */
		getJobList (){
			let that = this;
			this.$http.get('/systemManage/job').then((res)=>{
				that.jobList = res.data;
				// //console.log(that.jobList ,'22sss')
			});
		},
		/*
			获取部门名称列表
		*/
		getDepartmentList(){
			let that = this;
			this.$http.get('/systemManage/department').then((res)=>{
				that.departmentNameList = res.data;
			});
		},
		/**修改资料时提交 */
		submitInfo(){
      let that = this;
      if(!that.formValidate.phoneNum||that.formValidate.phoneNum.length>11||isNaN(that.formValidate.phoneNum)){
        that.$Notice.warning({title:i18n.t("message.pen")})
        return;
      }
      var email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if(!email.test(that.formValidate.email)){
        that.$Notice.warning({title:i18n.t("message.pee")})
        return;
      }
			if(!this.updateInfo){
				// //console.log("write: ==========>>>>>>>>>   不是在修改资料状态");
				return;
			}
			that.formValidate.mobile=that.formValidate.phoneNum;
			this.$http.put('/tenant/user/userInfo',that.formValidate).then((res) => {
					that.$Message.success(i18n.t("message.dm"));
					that.updateInfo = false;
			});
		},

		/**修改资料 取消 */
		infoCancel(){
			this.updateInfo = false;
			this.infoModal = false;
		},

		/**点击修改资料 取消 */
		clickUpdate(){
			this.updateInfo = true;
		},
		infoModalShow () {
			this.infoModal  = true;
			this.getDepartmentList();
			this.getJobList();
		},

		/**修改密码时提交 */
    submits() {
      let that = this;
      if (
        this.formLeft.password === "" ||
        this.formLeft.newPassword === "" ||
        this.formLeft.confirmNewPassword === ""
      ) {
        this.$Notice.warning({
          title: i18n.t("message.pia")
        });
        return;
      }
      if (this.formLeft.password == this.formLeft.newPassword) {
        this.$Notice.warning({
          title: i18n.t("message.an")
        });
        return;
      }
      let params = [
        {type:'Password',title:i18n.t("message.np"),value:that.formLeft.newPassword},
      ]
      let state = true;      
      for(let i in params){
        state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
          that.$Notice.warning({title:tips})
        })
        if(!state){
          return;
          break;
        }
      }
      
      if (this.formLeft.newPassword != this.formLeft.confirmNewPassword) {
        this.$Notice.warning({
          title: i18n.t("message.tt")
        });
        return;
      }
      
      let config = {
        originalPassword: md5(this.formLeft.password),
        newPassword: md5(this.formLeft.newPassword),
        repeatedPassword: md5(this.formLeft.confirmNewPassword)
      };
      this.$http.put("/tenant/user/password", config).then(res => {
        this.$Notice.success({
          title: i18n.t("message.my"),
          desc: i18n.t("message.pcs"),
          duration: 2,
          onClose: () => {
            that.$router.push({ path: "/" });
          }
        });
      });
		},

		/**修改密码 取消 */
    cancel() {
      this.formLeft.password = "";
      this.formLeft.newPassword = "";
      this.formLeft.confirmNewPassword = "";
      this.modalShow = false;
    },
    showModal() {
      this.modalShow = true;
    },
    handleTransferClick() {
      if (this.transfer) this.disableCloseUnderTransfer = true;
    },
    handleClose() {
      if (this.disableCloseUnderTransfer) {
        this.disableCloseUnderTransfer = false;
        return false;
      }
      this.visible = false;
    },
    toggleVisible() {
      this.visible = !this.visible;
    },
    onEnter: function(argument) {
      // //console.log(new Date().getTime() + "====>enter message: ");
      this.$emit(
        "open-tab",
        "product-list-add",
        i18n.t("message.ap"),
        "page-product-add",
        null
      );
    },
    logout() {
      this.$emit("logout");
    },
    refreshMessageList: function(page) {},
    getName() {
      let that = this;
      this.$http.get("/tenant/user/profile").then(function(resp) {
        that.user.name = resp.data.name;
        that.user.job = resp.data.jobName;
        that.user.userId = resp.data.userId;
        that.getInfo(resp.data.userId);
      });
    },
    getInfo(userId) {
			let that = this;
      this.$http.get("/tenant/user/" + userId).then(res => {
				that.formValidate.userId = userId;
				that.formValidate.account = res.data.account;
				that.formValidate.name = res.data.name;
				that.formValidate.email = res.data.email;
				that.formValidate.companyName = res.data.companyName;
				that.formValidate.departmentId = res.data.departmentId  ;
				that.formValidate.jobId  = res.data.jobId ;
				that.formValidate.phoneNum = res.data.phoneNum;
				that.formValidate.remark = res.data.remark;
				that.formValidate.createTime = res.data.createTime
				that.formValidate.departmentName = res.data.departmentName;
				that.formValidate.jobName = res.data.jobName;
      });
    }
  },
  computed: {
    transition() {
      if (
        this.placement === "bottom-start" ||
        this.placement === "bottom" ||
        this.placement === "bottom-end"
      ) {
        return "slide-up";
      } else {
        return "fade";
      }
    }
	},

  mounted() {
    let that = this;
    // //console.log(new Date().getTime() + "====>ProfileBox: mounted");
    this.refreshMessageList(1);
    $('#userBOX').hover(function(){
      that.visible = true;
      // $('#iconDown').animate({transform:"rotate(180deg)"})
      $('#iconDown').css('transform','rotate(180deg)')

      that.refreshMessageList(1);
    },function(){
      that.visible = false;
      // $('#iconDown').animate({transform:"rotate(0deg)"})   
      $('#iconDown').css('transform','rotate(0deg)')

    })
  }
};
</script>
<style>

.iqis-profile-box .profile-count {
  background-size: 32px 32px;
  background-repeat: no-repeat;
}
.profile-count .ivu-badge-dot{
  background:transparent;
}
.iqis-profile-box .ivu-tabs-bar {
  border-bottom: 0px solid #dddee1;
  margin-bottom: 0px;
}
.iqis-profile-box .ivu-tabs-tab.ivu-tabs-tab-disabled {
  color: #262626;
}
.iqis-profile-box .ivu-tabs-nav-container {
  line-height: 30px;
}
.iqis-profile-box .message-div {
  display: block;
  width: 280px;
  height: 351px;
  background: #fff;
  font-size: 14px;
  color: #5c5c5c;
  font-style: normal;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
  /* overflow: scroll; */
}
.iqis-profile-box .message-list-div .list-group-item {
  padding-bottom: 1px;
  position: relative;
  display: block;
  padding: 14px 14px;
  margin-bottom: -1px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  color: #333;
}
.iqis-profile-box .message-list-div .list-group-item {
  line-height: 18px;
  text-align: center;
}
.iqis-profile-box .message-list-div .iqis-message-link {
  display: none;
}
.iqis-profile-box .message-list-div .iqis-message-link {
  display: inline-block;
  margin: 0 6px;
  color: #003eff;
  padding: 0 6px;
  cursor: pointer;
  background: #eee;
}

.iqis-profile-box .message-list-div .iqis-message-time {
  font-size: 14px;
  color: #5c5c5c;
}
.iqis-profile-box .message-list-div .iqis-message-unread-span {
  color: #418fee;
}
.iqis-profile-box .message-list-div .iqis-message-time-span {
  float: right;
}
.iqis-profile-box .message-list-div .iqis-message-text {
  max-height: 1.4em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #5c5c5c;
}

.iqis-profile-box .message-list-div .iqis-message-expand {
  max-height: none;
  white-space: normal;
}

.iqis-profile-box .ivu-radio-group-button .ivu-radio-wrapper {
  padding: 0 6px;
  border: 0px solid #dddee1;
}
.cus-info {
  font-size: 14px;
  font-style: normal;
  /* position: relative;
  top: -3px; */
  cursor: pointer;
}
.ivu-input[disabled], fieldset[disabled] .ivu-input{
	color:#666
}
.ivu-select-disabled .ivu-select-selection{
	color:#666
}
.header-icon.remind-icon{
  height: inherit!important;
}
.iqis-profile-box{
  height:inherit;
}
.iqis-profile-box .message-div{
  height:auto!important;
}
.iqis-profile-box .message-div{
  overflow: hidden;
}
.message-div2>div:first-child{
  height:60px;
}
.ivu-select-dropdown.ivu-transfer-no-max-height{
  top:43px!important;
}
</style>
