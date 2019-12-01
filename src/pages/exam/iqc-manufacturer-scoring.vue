<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
          <Date-picker type="daterange" format="yyyy-MM-dd" v-model="search.dates" :placeholder="i18n.t('iqc.dateFilter')" style="width: 210px"></Date-picker>
        <!-- <DatePicker type="daterange" v-model="search.dates" placement="bottom-start" placeholder="操作日期过滤" style="width: 200px"></DatePicker> -->
      </div>

      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model.trim="search.query" clearable style="width: 280px">
          <Select v-model="search.fieldName" :placeholder="i18n.t('iqc.searchAll')" slot="prepend" style="width: 110px;text-align: left">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="refreshData">{{$t('iqc.search')}}</Button>
        <Button type="ghost" @click="reset">{{$t('iqc.reset')}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <!-- <Button type="ghost" icon="refresh" @click="refreshData">刷新</Button> -->
        <Button v-if="permsBtn.INSERT_SUPPLIER_SCORE" type="ghost" icon="plus" @click="addIqc">{{$t('iqc.add')}}</Button>
        <Button style="margin:0 8px;" v-if="permsBtn.UPDATE_SUPPLIER_SCORE" type="ghost" icon="edit" :disabled="tableEditDis" @click="editSelectRow">{{$t('iqc.edit')}}</Button>
        <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
          confirm
          :title="i18n.t('iqc.confirmDelete')"
          placement="bottom-start"
          @on-ok="deleteTableSelected">
          <Button v-if="permsBtn.DELETE_SUPPLIER_SCORE" type="ghost" icon="trash-a" :disabled="!table.selected">{{$t('iqc.delete')}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="reset">{{$t('iqc.refreshData')}}</Button>

        <!-- <Button type="primary" icon="more"  @click="rank">自定义列表</Button> -->
        <!--<Button type="ghost" icon="share">导出报表</Button>-->
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table ref="pageTable"  class="tableCustom" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" :loading="table.loading" @on-selection-change="tableSelectChange" border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display:inline-block;"> -->
            <div style="padding: 20px 0 20px 0px;">
              <Page v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
                    :page-size-opts="[10,20,50,100]"
                    @on-change="pageChange" @on-page-size-change="pageSizeChange"
                    size="small" show-total show-elevator show-sizer></Page>
            </div>
          <!-- </div>
          <div style="display:inline-block;">
            <div style="float: left;margin: 4px;line-height: 24px;">
                <Button type="primary" size="small" @click="goElevatorPage">跳转</Button>
            </div>
          </div> -->
        </div>
      </div>

    </div>
     <div class="arrangement-dialog">
      <Modal
      :title="i18n.t('iqc.customList')"
      v-model="arrangement.state"
      class="rankBox"
      :mask-closable="false"
      :width="600" >
      <span class="list_txt">{{$t('iqc.select')}}</span>
       <div class="list_ok list">
        <div v-for="(item,index) in arrangement.data1" class="dataItem" :class="'check'+index"  :key="index">
          <input type="checkbox"   :value="item"  v-model="arrangement.data" >
           <span >{{item.title}}</span>
         </div>
       </div>
       <span class="list_txt2">{{$t('iqc.selected')}}</span>
       <div class="list_no list">
       <draggable style="padding: 8px 0; overflow-y:auto;width: 100%;display: -webkit-flex;display: flex;flex-wrap:wrap;align-items: flex-start;" v-model="arrangement.data" :options="{group:'people'}" @start="drag=true" @end="drag=false">
            <Card class="process-item" v-for="(element,index) in arrangement.data" :key="index" :class="element.title==null?'displayNO':''">
              <div style="text-align:left">
                <span>{{element.title}}</span>
              </div>
            </Card>
        </draggable>
       </div>
        <div slot="footer">
        <Button type="primary" size="large" @click="ReplyOk" >{{$t('iqc.restore')}}</Button>
        <Button type="primary" size="large" @click="RankOk" >{{$t('iqc.confirm')}}</Button>
        <Button type="text" size="large" @click="RankNo">{{$t('iqc.cancel')}}</Button>
      </div>
      </Modal>
    </div>

      <div class="arrangement-dialog-from">
      <Modal
      :title="i18n.t('iqc.supplierScore')"
      v-model="prodBatch.state"
      :mask-closable="false"
      @on-cancel="cancel"
      :width="600" >
        <Row type="flex" :gutter="24" style="margin-bottom:15px">
          <i-col span="12">
            <div class="fl nameWidth" style="padding-right: 5px; width:100%;"><span>{{$t('iqc.scoreTime')}}</span></div>
            <div class="marginLF">
                <Date-picker style="width: 100%" :disabled="noPermsDis" type="datetime" :placeholder="i18n.t('pleaseChoose')" format="yyyy-MM-dd HH:mm" v-model="ruleForm.scoringDate" ></Date-picker>
             </div>
          </i-col>
          <i-col span="12">
            <div class="fl nameWidth" style="padding-right: 5px; width:100%;"><span>评分周期</span></div>
            <div class="marginLF">
              <Select v-model="ruleForm.cycle">
                <Option v-for="item in cycleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
             </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24" style="margin-bottom:15px">
          <i-col span="12">
            <div class="fl nameWidth marginLF"><span>{{$t('iqc.supplierNo')}}</span></div>
            <div class="marginLF">
                <!-- <i-input v-model.trim="ruleForm.manufacturerNum" style="width: 100%" ></i-input> -->
                <Select style="width:100%;" :placeholder="i18n.t('pleaseChoose')" :disabled="noPermsDis" v-model="ruleForm.manufacturerId" filterable class="Wout"  @on-change="selectOn(ruleForm.manufacturerId,3);isRelation(ruleForm.manufacturerId)">
                <Option v-for="(items,index) in prodBatch.dataTable" :value="items.manufacturerId" :label="items.manufacturerNum"  :key="index">{{ items.manufacturerNum}}/{{ items.manufacturerName}}</Option>
                </Select>
             </div>
          </i-col>
          <i-col span="12">
           <div class="fl nameWidth marginLF"><span>{{$t('iqc.supplierAbbr')}}</span></div>
            <div class="marginLF">
                <!-- <i-input v-model.trim="ruleForm.manufacturerName" style="width: 100%" ></i-input> -->
                <Select style="width:100%;" :placeholder="i18n.t('pleaseChoose')" v-model="ruleForm.manufacturerId" filterable class="Wout" :disabled="prodBatch.disabled">
                <Option v-for="(items,index) in prodBatch.dataTable" :value="items.manufacturerId" :label="items.manufacturerName"  :key="index">{{ items.manufacturerName}}</Option>
                </Select>
             </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24" style="margin-bottom:15px">
          <i-col span="6">
            <div class="fl nameWidth marginLF"><span>{{$t('iqc.qualityScore')}}</span></div>
            <div class="marginLF">
                <!-- <i-input v-model.trim="ruleForm.qualityScore" style="width: 100%" ></i-input> -->
                <InputNumber :disabled="noPermsDis" v-model.trim="ruleForm.qualityScore" style="width: 100%" :min="0" :max="quantityMaxScore"></InputNumber>
             </div>
          </i-col>
          <i-col span="6">
            <div class="fl nameWidth marginLF"><span>{{$t('iqc.priceScore')}}</span></div>
            <div class="marginLF">
                <!-- <i-input v-model.trim="ruleForm.priceScore" style="width: 100%" ></i-input> -->
                <InputNumber :disabled="noPermsDis" v-model.trim="ruleForm.priceScore" style="width: 100%" :min="0" :max="priceMaxScore"></InputNumber>                
             </div>
          </i-col>
          <i-col span="6">
           <div class="fl nameWidth marginLF"><span>{{$t('iqc.periodScore')}}</span></div>
            <div class="marginLF">
                <!-- <i-input v-model.trim="ruleForm.periodScore" style="width: 100%" ></i-input> -->
                <InputNumber :disabled="noPermsDis" v-model.trim="ruleForm.periodScore" style="width: 100%" :min="0" :max="periodMaxScore"></InputNumber>
             </div>
          </i-col>
          <i-col span="6">
           <div class="fl nameWidth marginLF"><span>{{$t('iqc.serviceScore')}}</span></div>
            <div class="marginLF">
                <!-- <i-input v-model.trim="ruleForm.serviceScore" style="width: 100%" ></i-input> -->
                <InputNumber :disabled="noPermsDis" v-model.trim="ruleForm.serviceScore" style="width: 100%" :min="0" :max="serviceMaxScore"></InputNumber>                
                
             </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24" style="margin-bottom:15px">
          <i-col span="24">
           <div class="fl nameWidth marginLF"><span>备注</span></div>
            <div class="marginLF">
                <Input v-model="ruleForm.remarks" placeholder="请输入"></Input>    
             </div>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24" style="margin-bottom:15px">
          <i-col span="24">
            <div class="fl nameWidth marginLF"><span>{{$t('iqc.addFile')}}</span></div>
          </i-col>
          <i-col span="24">
            <Spin size="large"  v-if="spinShow" style="text-align:left">
              <div class="marginLF">
                  <IqisUpload ref="d3Upload" class="aa" :edit="true" :size="32" :max-size="10240" :fileType="['jpg','jpeg','png','docx','doc','xls','xlsx','pdf','pptx','ppt']" :fileCount="5" :value='uploadValue' :chartTypeShow="false">
                  </IqisUpload>
              </div>
            </Spin>
          </i-col>
        </Row>
          <Row type="flex" :gutter="24" >
          <i-col span="24">
            <div class="fl" style="margin-right:20px"><span>{{$t('iqc.isSend')}}</span></div>
            <div >
                <div class="fl" style="margin-right:30px">
                  <Radio-group v-model="ruleForm.pushFlag">
                        <Radio :disabled="pushFlagDis||noPermsDis" :label="1">{{$t('iqc.yes')}}</Radio>
                        <Radio :disabled="pushFlagDis||noPermsDis" :label="0">{{$t('iqc.not')}}</Radio>
                    </Radio-group>
                 </div>
             </div>
          </i-col>
        </Row>
        <div slot="footer">
        <Button v-if="!noPermsDis" type="primary" size="large" @click="FormOk" >{{$t('iqc.confirm')}}</Button>
        <Button type="text" size="large" @click="FormNo">{{$t('iqc.cancel')}}</Button>
      </div>
      </Modal>
    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->



  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import draggable from 'vuedraggable';
  import $ from 'jquery'
  export default {
    components: {
      Input,draggable
    },
    data: function () {
      let vm = this;
      return {
        uploadValue:[],
        spinShow:false,
        manufacturerScoringExtInfoDtos:[],
        i18n:window.i18n,
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        prodBatch:{state:false,btnState:'',dataTable:[],disabled:true,supplierTenantId:false},
        data:[
        ],
        pushFlagDis:false,
        tableEditDis:true,
        cycleList:[
          {
            value: 'MONTH',
            label: '月度'
          },
          {
            value: 'SEASON',
            label: '季度'
          },
          {
            value: 'YEAR',
            label: '年度'
          },
        ],
        table:{
          selected:false,
          loading:true,
          pager:{
            rows:10,
            need:true,
            total:0,
            limit:10,
            current:1
          },
          columns:[
            {type: 'selection',
              align: 'center',
              width:40,
              minWidth:40,
              maxWidth:40
            },
            {
              title: i18n.t('iqc.scoreDate'),
              className:'tablePadding',
              width:136,
              minWidth:136,
              align: 'center',
              ellipsis:true,
              key: 'scoringDate',
              render:function(h,data){
                let value = data.row[data.column.key];
                let str = "-"
                if(value){
                  var unixTimestamp = new Date(value);
                  str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                }
                return h("span",str);
              }
            },
            {
              title: i18n.t('iqc.supplierNo'),
              className:'tablePadding',
              width:160,
              minWidth:160,
              ellipsis:true,
              key: 'manufacturerNum'
            },{
              title: i18n.t('iqc.supplierName'),
              className:'tablePadding',
              width:160,
              minWidth:160,
              ellipsis:true,
              key: 'manufacturerName'
            },
            {
              title: "评分周期",
              className:'tablePadding',
              width:160,
              minWidth:160,
              ellipsis:true,
              key: 'cycle',
              render:function(h,data){
              return h("span",data.row["cycle"]=="MONTH"? "月度":data.row["cycle"]=="SEASON" ? "季度": data.row["cycle"]=="YEAR"?"年度": "")
            }
            },
            {
              title: i18n.t('iqc.scoreGrade'),
              className:'tablePadding',
              minWidth:80,
              ellipsis:true,
              key: 'scoringLevel'
            },{
              title: i18n.t('iqc.comprehensiveScore'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:110,
              ellipsis:true,
              key: 'comprehensiveScore'
            },{
              title: i18n.t('iqc.qualityScore'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:100,
              ellipsis:true,
              key: 'qualityScore'
            },{
              title: i18n.t('iqc.periodScore'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:100,
              ellipsis:true,
              key: 'periodScore'
            },{
              title: i18n.t('iqc.priceScore'),
              className:'tablePadding',
              minWidth:80,
              ellipsis:true,
              key: 'priceScore'
            },{
              title: i18n.t('iqc.serviceScore'),
              className:'tablePadding',
              minWidth:this.$store.state.locale=='zh_CN'?80:100,
              ellipsis:true,
              key: 'serviceScore'
            },{
              title: i18n.t('iqc.scoreUser'),
              className:'tablePadding',
              width:110,
              minWidth:110,
              ellipsis:true,
              key: 'userName'
            },
            {
              title: "备注",
              className:'tablePadding',
              minWidth:100,
              ellipsis:true,
              key: 'remarks'
            },
          ]
        },
        ruleForm:{
          cycle:'MONTH',
          btnState:'',
          manufacturerId:'',
          qualityScore:'',
          periodScore:'',
          priceScore:'',
          serviceScore:'',
          pushFlag:'',
          scoringDate:'',
          remarks:''
        },
        search: {
          query: "",
          fieldName: "",
          result:"",
          status:"",
          userList:[],
          dates:[],
          tos:[
            {value:"",label:i18n.t('iqc.all')},
            {value:"1",label:i18n.t('iqc.insideHandle')},
            {value:"2",label:i18n.t('iqc.supplier')}
          ],
          optList:[
            {value:"",label:i18n.t('iqc.all')},
            {value:i18n.t('iqc.special'),label:i18n.t('iqc.special')},
            {value:i18n.t('iqc.release'),label:i18n.t('iqc.release')},
            {value:i18n.t('iqc.rework'),label:i18n.t('iqc.rework')},
            {value:i18n.t('iqc.filter'),label:i18n.t('iqc.filter')},
            {value:i18n.t('iqc.return'),label:i18n.t('iqc.return')},
            {value:i18n.t('iqc.scrap'),label:i18n.t('iqc.scrap')}
          ],
          data: {
            searchTypes: [
              {
                label: i18n.t('iqc.searchAll'),
                value: ""
              }, {
                label: i18n.t('iqc.supplierNo'),
                value: "manufacturerNum"
              }, {
                label: i18n.t('iqc.supplierName'),
                value: "manufacturerName"
              }
            ]
          }
        },
         //排序
        arrangement:{
          state:false,
          data:[],
          data1:[],
        },
        urlProduct:{
          no:[],
          name:[],
          prodTypeName:[],
          cityList:[],
          prodTypeId:'',
          customerList:[],
          dataList:[],
          index:1
        },
        rankData:[       
          {
            title: i18n.t('iqc.supplierNo'),
            width:160,
            minWidth:160,
            ellipsis:true,
            key: 'manufacturerNum'
          },{
            title: i18n.t('iqc.supplierName'),
            width:160,
            minWidth:160,
            ellipsis:true,
            key: 'manufacturerName'
          },{
            title: i18n.t('iqc.scoreGrade'),
            minWidth:80,
            ellipsis:true,
            key: 'scoringLevel'
          },{
            title: i18n.t('iqc.comprehensiveScore'),
            minWidth:80,
            ellipsis:true,
            key: 'comprehensiveScore'
          },{
            title: i18n.t('iqc.qualityScore'),
            minWidth:80,
            ellipsis:true,
            key: 'qualityScore'
          },{
            title: i18n.t('iqc.periodScore'),
            minWidth:80,
            ellipsis:true,
            key: 'periodScore'
          },{
            title: i18n.t('iqc.priceScore'),
            minWidth:80,
            ellipsis:true,
            key: 'priceScore'
          },{
            title: i18n.t('iqc.serviceScore'),
            minWidth:80,
            ellipsis:true,
            key: 'serviceScore'
          },{
            title: i18n.t('iqc.scoreDate'),
            width:90,
            minWidth:90,
            align: 'center',
            ellipsis:true,
            key: 'scoringDate',
            render:function(h,data){
              let value = data.row[data.column.key];
              let str = "-"
              if(value){
                var unixTimestamp = new Date(value);
                str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
              }
              return h("span",str);
            }
          },{
            title: i18n.t('iqc.scoreUser'),
            width:110,
            minWidth:110,
            ellipsis:true,
            key: 'userName'
          }
        ],
        permsCur:[
          "DELETE_SUPPLIER_SCORE",
          "INSERT_SUPPLIER_SCORE",
          "UPDATE_SUPPLIER_SCORE",
          "SELECT_SUPPLIER_SCORE",

        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "DELETE_SUPPLIER_SCORE":false,
          "INSERT_SUPPLIER_SCORE":false,
          "UPDATE_SUPPLIER_SCORE":false,
          "SELECT_SUPPLIER_SCORE":false,
        },
        noPermsDis:true,
        quantityMaxScore:'',
        priceMaxScore:'',
        periodMaxScore:'',
        serviceMaxScore:''


      }
    },//end data

    created(){
      this.refreshData();
      this.ruleForm.scoringDate = new Date()
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })

    },
    computed:{

    },

    methods:{
      onPopUp(){
        if((this.prodBatch.btnState=='post'&&this.permsBtn.INSERT_SUPPLIER_SCORE)||(this.prodBatch.btnState=='put'&&this.permsBtn.UPDATE_SUPPLIER_SCORE)){
          this.noPermsDis=false;
        }else{
          this.noPermsDis=true;
        }
      },
      // //点击跳转到输入的页码
      // goElevatorPage(){
      //   var evtObj;
      //   var thisPage=document.getElementById('pageId');
      //   //console.log(thisPage);
      //   var elevatorDiv=thisPage.getElementsByClassName("ivu-page-options-elevator");
      //   if(elevatorDiv && elevatorDiv.length>0){
      //       var pageInput = elevatorDiv[0].getElementsByTagName("input")[0];
      //           if (window.KeyEvent) {//firefox 浏览器下模拟事件
      //               evtObj = document.createEvent('KeyEvents');
      //               evtObj.initKeyEvent("keyup", true, true, window, true, false, false, false, 13, 0);
      //           } else {//chrome 浏览器下模拟事件
      //               evtObj = document.createEvent('UIEvents');
      //               evtObj.initUIEvent("keyup", true, true, window, 1);
      //               delete evtObj.keyCode;
      //               if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
      //                   Object.defineProperty(evtObj, "keyCode", { value: 13 });                       
      //               } else {
      //                   evtObj.key = String.fromCharCode(13);
      //               }
      //           }
      //           pageInput.dispatchEvent(evtObj);
      //   }
      // },
      reset(){
        this.table.selected='';
        this.search.fieldName='';
        this.search.query='';
        this.search.dates=[];
        this.tableEditDis=true;
        this.refreshData(1);
        this.pageChange(1)
      },
      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        this.refreshData();
      },
      pageChange(page){
        this.table.pager.current = page;
        this.refreshData();
      },modalOk(){
        //console.log(this.editModal.item);
        this.editModal.requesting = true;
        // this.editModal.item.prodLineTypeId = null;
        // if(this.editModal.item.prodLineTypeValue && this.editModal.item.prodLineTypeValue.length > 0){
        //   let plt = this.editModal.item.prodLineTypeValue[this.editModal.item.prodLineTypeValue.length-1];
        //   if(plt){
        //     this.editModal.item.prodLineTypeId = plt;
        //   }
        // }

        if(!this.editModal.item.name || !this.editModal.item.judgeId
          //|| !this.editModal.item.reviewer1Id || !this.editModal.item.reviewer2Id
          //|| !this.editModal.item.reviewer3Id || !this.editModal.item.reviewer4Id
          || !this.editModal.item.auditorId){
          this.$Notice.warning({
            title: '必须录入名称和所有参与人员',
            desc: ''
          });
          this.editModal.requesting = false;
          return;
        }
        let that = this;
        if(this.editModal.item.prodLineId){
          that.$http.put("/basic/reviewprocess",that.editModal.item).then(function (resp) {
            that.reset();
            that.$Message.success(i18n.t('iqc.editSuccess'));
            that.editModal.show = false;
          });
        }else{
          that.$http.post("/basic/reviewprocess",that.editModal.item).then(function (resp) {
            that.reset();
            that.$Message.success(i18n.t('iqc.addSuccess'));
            that.editModal.show = false;
          });
        }

        //this.editModal = true;
      }
      ,
      addIqc(){
        // $(".aa .iqis-upload-list").css("display","none")
       let that=this;
       if (this.$refs.d3Upload&&this.$refs.d3Upload.myUploadList) {
         this.$refs.d3Upload.myUploadList=[]
       }
       if (this.$refs.d3Upload&&this.$refs.d3Upload.uploadList) {
         this.$refs.d3Upload.uploadList=[]
       }
       that.spinShow=false;
       that.uploadValue=[]
       that.spinShow=true;
       that.prodBatch.state=true;
       that.prodBatch.btnState="post"
      //  that.ruleForm={}
       that.dataTable();
       that.pushFlagDis=true;
        that.ruleForm.pushFlag='';
       that.ruleForm.manufacturerId=''
       that.ruleForm.qualityScore=''
       that.ruleForm.periodScore=''
       that.ruleForm.priceScore=''
       that.ruleForm.scoringDate=new Date()
       that.onPopUp();
      },
      editSelectRow(e){
       let that=this;
        let selectedRow = this.$refs.pageTable.getSelection()
        if(!selectedRow || selectedRow.length != 1){
          // this.$Notice.warning({
          //   title: '必须选择一条记录后才可以进行修改',
          //   desc: ''
          // });
          return;
        }
        that.prodBatch.btnState="put"
        that.onPopUp();

        that.dataTable();
        let scoringId=selectedRow[0].scoringId
        let url="/iqc/manufacturer/scoring/"
        that.$http.get(url+scoringId).then((res)=>{
          that.ruleForm={
          scoringId:scoringId,
          cycle:res.data.cycle,
          manufacturerId:res.data.manufacturerId,
          qualityScore:res.data.qualityScore,
          periodScore:res.data.periodScore,
          priceScore:res.data.priceScore,
          scoringDate:new Date(res.data.scoringDate),
          serviceScore:res.data.serviceScore,
          pushFlag:res.data.pushFlag?"1":"0",
        }
         that.prodBatch.state=true;
        })
        //
        // this.$emit("open-tab","exam-iqc-update-"+selectedRow[0].iqcId,"添加来料检验","page-exam-iqc-add",{iqcId:selectedRow[0].iqcId});
        // this.showModal(selectedRow[0]);
      },
      onDBClick(obj,index){
        let that = this;
        that.prodBatch.btnState="put"
        that.onPopUp();

        that.dataTable();
        let scoringId=obj.scoringId
        let url="/iqc/manufacturer/scoring/"
        that.spinShow =  false;
        that.$http.get(url+scoringId).then((res)=>{
          that.ruleForm={
          scoringId:scoringId,
          manufacturerId:res.data.manufacturerId,
          qualityScore:res.data.qualityScore,
          periodScore:res.data.periodScore,
          priceScore:res.data.priceScore,
          scoringDate:new Date(res.data.scoringDate),
          serviceScore:res.data.serviceScore,
          pushFlag:res.data.pushFlag?"1":"0",
        }
         that.uploadValue=res.data.manufacturerScoringExtInfoDtos
         that.spinShow =  true;
         that.prodBatch.state=true;
        })
      },
      tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
      },deleteTableSelected(){
        let ss = this.$refs.pageTable.getSelection();
        let that = this;
        if(ss && ss.length > 0){
          let delArr = [];
          for(let i=0;i<ss.length;i++){
            delArr.push(this.$http.delete("/iqc/manufacturer/scoring/"+ss[i].scoringId));
          }

          if(delArr.length > 0){
            this.$http.all(delArr).then(function (resps) {
              that.$Message.success(i18n.t('iqc.deleteSuccess'));
              that.refreshData();
            });
          }
        }

      },
      loadEditData(){
        this.editModal.dataLoading = true;

        let that = this
        this.$http.get("/tenant/user",{params:{limit:99999999}}).then(function (resp) {
          if(resp.data){
            that.search.userList = resp.data;
            that.editModal.dataLoading = false;
          }
        });
      },
      refreshData(){
        let that = this;
        that.$http.get('/basic/standardSetting').then(function(resp){
          that.quantityMaxScore=resp.data.quantityProportionSetting.settingScore;
          that.priceMaxScore=resp.data.priceProportionSetting.settingScore;
          that.periodMaxScore=resp.data.periodProportionSetting.settingScore;
          that.serviceMaxScore=resp.data.serviceProportionSetting.settingScore;
        })
        that.table.loading = true;
        let params = {};
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;
        let date=that.search.dates;
        if(date[0] !=undefined&&date[0] !=''){
        let startDate= (new Date(date[0])).getTime();
        let endDate=(new Date(date[1])).getTime();
        params.startDate = startDate;
        params.endDate = endDate;
        }

        this.$http.get("/iqc/manufacturer/scoring",{params:params}).then(function (resp) {
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount =  resp.data? resp.data.length:10;
          that.table.pager.rows = Math.max(rowCount,6);
          that.table.loading = false;
        })
      },
      //加载
      dataTable(){
        let that=this;
        let idValueMap = [];
        let url="/bas/manufacturer?page=1&limit=999"
        that.$http.get(url).then((res)=>{
          let urlProduct=res.data
          urlProduct.forEach(e => {
            let manufacturerId=e.manufacturerId;
            let manufacturerName=e.manufacturerAbbreviation;
            let manufacturerNum=e.manufacturerNum;
            let supplierTenantId=e.supplierTenantId
            let boxOn={manufacturerId,manufacturerNum,manufacturerName,supplierTenantId};
           for(var i=0;i<idValueMap.length;i++){
            if(idValueMap[i].manufacturerName != e.manufacturerName){
               idValueMap[i].no.push(boxOn);
              return;
             }
              }
           idValueMap.push({
                no:[boxOn],
              })
          });
           that.prodBatch.dataTable=idValueMap[0].no;
        })
      },
      selectOn(obj){
        for(var index in this.prodBatch.dataTable){
          if(obj===this.prodBatch.dataTable[index].manufacturerId){
            if(this.prodBatch.dataTable[index].supplierTenantId===null){
               this.prodBatch.supplierTenantId=true
            }else{
               this.prodBatch.supplierTenantId=false
            }
          }
         }
      },
 //自定义排序
       rank(){
        let that=this;
        if(that.urlProduct.index===1){
            that.defaultData()
        }else{
           that.arrangement.data=that.arrangement.data;
        }
        that.arrangement.data1=that.rankData;
        that.arrangement.state=true;
      },
      ReplyOk(){
        this.defaultData()
      },
      //默认排序
      defaultData(){
        let that=this;
        that.urlProduct.index=1;
        that.urlProduct.dataList=that.rankData.concat();
        that.arrangement.data=that.urlProduct.dataList;
      },
      //排序确定
      RankOk(){
        if(this.arrangement.data.length===0){
         this.$Notice.warning({
            title: i18n.t('iqc.listNull'),
            desc: ''
          });
          return;
        }
        let data=[{type: 'selection',align: 'center',width:40,minWidth:40,maxWidth:40}]
        let dataList=data.concat(this.arrangement.data)
        this.table.columns=dataList;
        this.urlProduct.index=2;
        this.arrangement.state=false;
      },
      // 默认数据显示
      RankNo(){
        this.arrangement.state=false;
      },
      //编辑数据
      FormOk(){
       let that=this;
       let d3Arr = []
       if(this.$refs.d3Upload){
         let d3File = this.$refs.d3Upload.myUploadList
        // d3Arr = [];
        for(var i = 0;i<d3File.length;i++){
          let fileObj = {'url':d3File[i].url,'extInfoType':d3File[i].url.substring(d3File[i].url.lastIndexOf(".")+1,d3File[i].url.length),'extInfoName':d3File[i].url.substring(d3File[i].url.lastIndexOf("/")+1,d3File[i].url.length)}
          d3Arr.push(fileObj)
        }
       }
        that.uploadValue=d3Arr
        that.ruleForm.manufacturerScoringExtInfoDtos=d3Arr
       let state = true;
       let params = [
        {type:'Empty',title:"评分时间",value:that.ruleForm.scoringDate},
        /* {type:'Empty',title:i18n.t('iqc.supplierNo'),value:that.ruleForm.manufacturerId},
        {type:'Empty',title:i18n.t('iqc.qualityScore'),value:that.ruleForm.qualityScore},
        {type:'Empty',title:i18n.t('iqc.periodScore'),value:that.ruleForm.periodScore},
        {type:'Empty',title:i18n.t('iqc.priceScore'),value:that.ruleForm.priceScore},
        {type:'Empty',title:i18n.t('iqc.serviceScore'),value:that.ruleForm.serviceScore}, */

        
       ]
       for(let i in params){
        state = that.$iqis.utils.formValidate(params[i].type,params[i].title,params[i].value,(tips)=>{
          that.$Notice.warning({title:tips})//,duration: 0
        })
        if(!state){
          return;
          break;
        }
       }
       let index=true;
       
      //  let index=false;
      //     let manufacturerId=that.ruleForm.manufacturerId;
      //     let qualityScore=that.ruleForm.qualityScore;
      //     let periodScore=that.ruleForm.periodScore;
      //     let priceScore=that.ruleForm.priceScore;
      //     let serviceScore=that.ruleForm.serviceScore;
      //     if(manufacturerId==''||qualityScore==''||periodScore==''||priceScore==''||serviceScore==''||manufacturerId==undefined||qualityScore==undefined||periodScore==undefined||priceScore==undefined||serviceScore==undefined){
      //          this.$Notice.warning({
      //         title: '请完善评分信息',desc: ''});
      //         return;
      //      }else{
      //          index=true;
      //      }
  // // /^(\d{1,2}|100|NA)$/ 数字
      // let rut=/^(\d{1,2}|100|)$/
      // if(rut.test(qualityScore)&&rut.test(periodScore)&&rut.test(priceScore)&&rut.test(serviceScore)){
      //   index=true;
      // }else{
      //   this.$Notice.warning({
      //   title: '得分不能大于100，不能为负数；',desc: ''});
      //   return;
      // }
      if(index==true){
       if(that.prodBatch.btnState=='post'){
         let url="/iqc/manufacturer/scoring"
         that.ruleForm.scoringId=""
         that.$http.post(url,that.ruleForm,that.headers).then((res)=>{
            that.$Message.success(i18n.t('iqc.addSuccess'));
            that.prodBatch.state=false;
            this.refreshData();
         })
       }else if(that.prodBatch.btnState=='put'){
         let url="/iqc/manufacturer/scoring"
         that.$http.put(url,that.ruleForm,that.headers).then((res)=>{
            that.$Message.success(i18n.t('iqc.editSuccess'));
            that.prodBatch.state=false;
            this.refreshData();
         })
       }
      }
      //  that.prodBatch.state=false;
      },
      cancel(){
      	this.ruleForm={}
      },
      //修改数据
      FormNo(){
       let that=this;
      //  that.ruleForm={}
       that.prodBatch.state=false;
      },
      isRelation(val){
        let that=this;
        if(val == null) return false;
        that.$http.get('/bas/manufacturer/'+val).then(function(resp){        
          let name = resp.data.manufacturerName;
          let url="/tenant/tenant/?manufacturerName="
          that.$http.get(url+name).then((res)=>{
              if(res.data==null||res.data==''){
                that.pushFlagDis=true;
                that.ruleForm.pushFlag=0;
              }else{
                that.pushFlagDis=false;   
                that.ruleForm.pushFlag=1;
              }
          })
        })
        
      },


    }//end methods




  }

</script>
<style scoped>
  .rankBox .list{width: 100%;min-height: 30px;}
  .rankBox .list_txt2{display: block;margin-top: 20px;}
  /* .rankBox .check0{display: none;} */
  .list_txt ,.list_txt2{display:block;margin-bottom:10px;font-size:16px;color:#5C5C5C;}
  .list_no{background:#FAFAFA;}
  .list_ok .dataItem{display: inline-block;padding: 5px 10px;}
  .list_no div , .list_no span{display: inline-block;}
  .list_no span{padding: 1px 10px;font-size: 14px;}
  .list_no .X0{display: none}
  .list_no .process-item{margin-left: 10px;cursor: pointer;margin-bottom: 15px;width:auto!important;}
  .list_no .ivu-card-body{padding:0!important;border: 1px solid #418FEE;border-radius: 2px;}
  .displayNO{display: none;}
  .list_no .ivu-card-body{padding-right: 0x !important;}
  .fl{float: left}
  .Wout{width: auto;}
  .magTOp{margin: 15px 0;line-height: 30px;}
  .nameWidth{width: 80px;/* text-align: center; */box-sizing: border-box;padding-right: 10px;height: 30px;
    line-height: 32px;}
  .marginLF{margin-left:0px}
</style>
