<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select v-model="search.queryType" :placeholder="i18n.t('quality.sa')" slot="prepend" style="width: 120px;text-align: left">
            <Option v-for="st in search.data.searchTypes" :key="st.value" :value="st.value">{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click='refreshData'>{{$t("quality.search")}}</Button>
        <Button type="ghost"
                @click="table.pager.current = 1;table.selected='';search.query='';search.queryType='';refreshData();">{{$t("quality.reset")}}
        </Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <Button style="margin-right:8px;" v-if="permsBtn.INSERT_RULE" type="ghost" icon="plus"  @click="showModal">{{$t("quality.add")}}</Button>
        <Button style="margin-right:8px;" v-if="permsBtn.UPDATE_RULE" type="ghost" icon="edit" :disabled="tableEditDis" @click='editSelectRow'>{{$t("quality.modify")}}</Button>
        <!-- <Button type="ghost" icon="trash-a">删除</Button> -->
        <Poptip
          confirm
          :title="i18n.t('quality.dsi')"
          placement="bottom-start"
          :ok-text='i18n.t("quality.confirm")'
          :cancel-text='i18n.t("quality.cancel")'
          @on-ok="deleteTreeNode">
          <Button v-if="permsBtn.DELETE_RULE" type="ghost" :disabled="!table.selected">{{$t("quality.delete")}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second">
        <!--<Button type="primary" icon="more">自定义列表</Button>-->
        <!--<Button type="ghost" icon="share">导出报表</Button>-->
        <Button type="text" icon="refresh"
                @click="table.pager.current = 1;table.selected='';search.query='';search.queryType='';refreshData();">{{$t("quality.refresh")}}
        </Button>
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-page-type-context" style="display: -webkit-flex;display: flex;">
        <!--<div class="iqis-abnormal-type-tree" style="flex: 0 0 260px;font-size: 14px;overflow: auto; border: 1px solid #e9eaec;margin-right: 8px;padding-left: 10px;" :style="treeStyle">-->
        <!--<Tree :data="category" @on-select-change="treeSelectChange" ></Tree>-->
        <!--</div>-->
        <div class="iqis-page-table" style="flex: 1 1 100px;overflow: auto;">

          <Table ref="pageTable" class="tableCustom" @on-selection-change="tableSelectChange"
                 @on-row-dblclick="onDBClick" v-drag-table-column="table.columns" :loading="table.loading"
                 border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display:inline-block"> -->
          <div style="padding: 20px 0 20px 0px;">
            <Page id="pageId" v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit"
                  :current="table.pager.current"
                  :page-size-opts="[10,20,50,100]"
                  @on-change="pageChange" @on-page-size-change="pageSizeChange"
                  size="small" show-total show-elevator show-sizer></Page>
          </div>
          <!-- </div> -->
          <!-- <div style="display: inline-block;">
            <div style="float: left;margin: 4px;line-height: 24px;">
                <Button type="primary" size="small" @click="goElevatorPage">跳转</Button>
            </div>
          </div> -->


        </div>
      </div>

    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
    <!-- 添加宽严转移规则 -->
    <div class="arrangement-dialog-from">
      <Modal
        :title="i18n.t('quality.astr')"
        v-model="editModal.show"
        :mask-closable="false"
        :width="600">
        <Row type="flex" :gutter="24" style="margin-bottom:15px">
          <i-col span="12">
            <span>{{$t("quality.ruleName")}}</span>
            <i-input v-model="ruleName" :placeholder="i18n.t('quality.pird')" style="width: 100%"></i-input>
          </i-col>
          <i-col span="12">
            <span>{{$t("quality.ip")}}</span>
            <inputNumber v-model="attrs.LENIENT_TRANSFER" :min="1" style="width: 100%"></inputNumber>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24" style="margin-bottom:15px">
          <i-col span="24">
            <span>{{$t("quality.remarks")}}</span>
            <i-input v-model="ruleRemark" :placeholder="i18n.t('quality.pird')" type="textarea" style="width: 100%;"></i-input>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24">
          <i-col span="12">
            <Checkbox true-value='1' false-value='0' v-model="isDefault">{{$t("quality.dir")}}</Checkbox>
          </i-col>
        </Row>
        <div class="ruleset">
          <Row>
            <i-col span="24">
              <div class="marignbottom">
                <div class="fl nameWidth2"><span class="splineheight30">( 1 )</span></div>
                <div class="marginLF2">
                  <span>{{$t("quality.rule1")}}</span>&nbsp;
                  <span><InputNumber  :disabled="noPermsDis" v-model="items.NORMAL_TO_LENIENT.ruleItemV1" :min="1"></InputNumber>&nbsp;
                  </span><span>{{$t("quality.rule11")}}</span>
                </div>
              </div>
              <div class="marignbottom">
                <div class="fl nameWidth2"><span class="splineheight30">( 2 )</span></div>
                <div class="marginLF2">
                  <span>{{$t("quality.rule2")}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span><InputNumber :disabled="noPermsDis" v-model="items.LENIENT_TO_EXEMPTED.ruleItemV1" :min="1"></InputNumber>&nbsp;
                  </span><span>{{$t("quality.rule22")}}</span>
                </div>
              </div>
              <div class="marignbottom">
                <div class="fl nameWidth2"><span class="splineheight30">( 3 )</span></div>
                <div class="marginLF2">
                  <span>{{$t("quality.rule3")}}</span>&nbsp;
                  <span><InputNumber :disabled="noPermsDis" v-model="items.LENIENT_TO_NORMAL.ruleItemV1" :min="1"></InputNumber>&nbsp;
                  </span><span>{{$t("quality.rule33")}}</span>
                </div>
              </div>
              <div class="marignbottom">
                <div class="fl nameWidth2"><span class="splineheight30">( 4 )</span></div>
                <div class="marginLF2">
                  <span>{{$t("quality.rule4")}}</span>&nbsp;
                  <span><InputNumber :disabled="noPermsDis" v-model="items.NORMAL_TO_STRICT.ruleItemV1" :min="1"></InputNumber>&nbsp;
                  </span><span>{{$t("quality.rule44")}}</span>
                </div>
              </div>
              <div class="marignbottom">
                <div class="fl nameWidth2"><span class="splineheight30">( 5 )</span></div>
                <div class="marginLF2">
                  <span>{{$t("quality.rule5")}}</span>&nbsp;
                  <span><InputNumber :disabled="noPermsDis" v-model="items.STRICT_TO_STOP.ruleItemV1" :min="1"></InputNumber>&nbsp;
                  </span><span>{{$t("quality.rule55")}}</span>
                </div>
              </div>
              <div class="fl nameWidth2"><span class="splineheight30">( 6 )</span></div>
              <div class="marginLF2">
                <span>{{$t("quality.rule6")}}</span>&nbsp;
                <span><InputNumber :disabled="noPermsDis" v-model="items.STRICT_TO_NORMAL.ruleItemV1" :min="1"></InputNumber>&nbsp;
                  </span><span>{{$t("quality.rule66")}}</span>
              </div>
            </i-col>
          </Row>
        </div>
        <div slot="footer">
            <Button v-if="permsBtn.INSERT_RULE" type="primary" size="large" @click="modalOk">{{$t("quality.confirm")}}</Button>
            <Button type="text" size="large" @click="RankNo">{{$t("quality.cancel")}}</Button>
        </div>
      </Modal>
    </div>

    <!-- 修改宽严转移规则 -->
    <div class="arrangement-dialog-from">
      <Modal
        :title="i18n.t('quality.asstr')"
        v-model="editModal.showtwo"
        :mask-closable="false"
        :width="600">
        <Row type="flex" :gutter="24" style="margin-bottom:15px">
          <i-col span="12">
           <span>{{$t("quality.ruleName")}}</span>
           <i-input :disabled="noPermsDis" v-model="ruleName" :placeholder="i18n.t('quality.pird')" style="width: 100%" ></i-input>
          </i-col>
          <i-col span="12">
           <span>{{$t("quality.ip")}}</span>
           <inputNumber :disabled="noPermsDis" v-model="attrs.LENIENT_TRANSFER" :min="1" style="width: 100%" ></inputNumber>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24" style="margin-bottom:15px">
          <i-col span="24">
           <span>{{$t("quality.remarks")}}</span>
           <i-input :disabled="noPermsDis" v-model="ruleRemark" :placeholder="i18n.t('quality.pird')" type="textarea" style="width: 100%;"></i-input>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24">
          <i-col span="12">
           <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="isDefault">{{$t("quality.dir")}}</Checkbox>
          </i-col>
        </Row>
        <div class="ruleset">
          <Row>
            <i-col span="24">
              <div class="marignbottom">
                <div class="fl nameWidth2"><span class="splineheight30">( 1 )</span></div>
                <div class="marginLF2">
                  <span>{{$t("quality.rule1")}}</span>&nbsp;
                  <span><InputNumber :disabled="noPermsDis"  v-model="items.NORMAL_TO_LENIENT.ruleItemV1" :min="1"></InputNumber>&nbsp;
                  </span><span>{{$t("quality.rule11")}}</span>
                </div>
              </div>
              <div class="marignbottom">
                <div class="fl nameWidth2"><span class="splineheight30">( 2 )</span></div>
                <div class="marginLF2">
                  <span>{{$t("quality.rule2")}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span><InputNumber :disabled="noPermsDis"  v-model="items.LENIENT_TO_EXEMPTED.ruleItemV1" :min="1"></InputNumber>&nbsp;
                  </span><span>{{$t("quality.rule22")}}</span>
                </div>
              </div>
              <div class="marignbottom">
                <div class="fl nameWidth2"><span class="splineheight30">( 3 )</span></div>
                <div class="marginLF2">
                  <span>{{$t("quality.rule3")}}</span>&nbsp;
                  <span><InputNumber :disabled="noPermsDis"  v-model="items.LENIENT_TO_NORMAL.ruleItemV1" :min="1"></InputNumber>&nbsp;
                  </span><span>{{$t("quality.rule33")}}</span>
                </div>
              </div>
              <div class="marignbottom">
                <div class="fl nameWidth2"><span class="splineheight30">( 4 )</span></div>
                <div class="marginLF2">
                  <span>{{$t("quality.rule4")}}</span>&nbsp;
                  <span><InputNumber :disabled="noPermsDis" v-model="items.NORMAL_TO_STRICT.ruleItemV1" :min="1"></InputNumber>&nbsp;
                  </span><span>{{$t("quality.rule44")}}</span>
                </div>
              </div>
              <div class="marignbottom">
                <div class="fl nameWidth2"><span class="splineheight30">( 5 )</span></div>
                <div class="marginLF2">
                  <span>{{$t("quality.rule5")}}</span>&nbsp;
                  <span><InputNumber :disabled="noPermsDis" v-model="items.STRICT_TO_STOP.ruleItemV1" :min="1"></InputNumber>&nbsp;
                  </span><span>{{$t("quality.rule55")}}</span>
                </div>
              </div>

              <div class="fl nameWidth2"><span class="splineheight30">( 6 )</span></div>
              <div class="marginLF2">
                <span>{{$t("quality.rule6")}}</span>&nbsp;
                <span><InputNumber :disabled="noPermsDis" v-model="items.STRICT_TO_NORMAL.ruleItemV1" :min="1"></InputNumber>&nbsp;
                  </span><span>{{$t("quality.rule66")}}</span>
              </div>
            </i-col>
          </Row>
        </div>
        <div slot="footer">
            <Button v-if="permsBtn.UPDATE_RULE" type="primary" size="large" @click="altermodalOk">{{$t("quality.confirm")}}</Button>
            <Button type="text" size="large" @click="RankNotwo">{{$t("quality.cancel")}}</Button>
        </div>
      </Modal>
    </div>
  </div>

</template>
<script>
  import Input from "iview/src/components/input";
  import $ from "jquery"

  export default {
    components: {
      Input
    },
    data: function () {
      let vm = this;
      return {
        i18n:window.i18n,
        headers: {"headers": {"Content-Type": "application/json; charset=UTF-8"}},
        data: [],
        tableEditDis: true,
        editModal: {
          dataLoading: true,
          item: {},
          show: false,
          showtwo: false,
          requesting: false
        },
        category: [],
        table: {
          loading: true,
          selected: false,
          pager: {
            rows: 10,
            need: true,
            total: 0,
            limit: 10,
            current: 1   //当前页码
          },
          columns: [
            {
              type: 'selection',
              align: 'center',
              // width:40,
              minWidth: 40,
              maxWidth: 40
            }, {
              title: i18n.t("quality.no"),
              // width:80,
              align: 'center',
              className:'tablePadding',
              render: vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              // minWidth: 50,
              maxWidth: 50
            },
            {
              title: i18n.t("quality.ruleName"),
              className:'tablePadding',
              width: 150,
              minWidth: 150,
              // maxWidth:150,
              ellipsis: true,
              key: 'ruleName'
            },{
              title: i18n.t("quality.ip"),
              className:'tablePadding',
              width: 150,
              minWidth: 150,
              // maxWidth:150,
              ellipsis: true,
              key: 'LENIENT_TRANSFER'
            }, {
              title: i18n.t("quality.remarks"),
              className:'tablePadding',
              minWidth: 100,
              // width:700,
              ellipsis: true,
              key: 'ruleRemark'
            }
          ]
        },
        search: {
          query: "",
          queryType: "",
          selectType: null,
          data: {
            searchTypes: [
              {
                label: i18n.t("quality.sa"),
                value: ""
              }, {
                label: i18n.t("quality.ruleName"),
                value: "ruleName"
              },{
                label: i18n.t("quality.remarks"),
                value: "ruleRemark"
              }
            ]
          }
        },
        "attrs": {
          "LENIENT_TRANSFER": null
        },
        "isDefault": '0',

        "items": {
          // //1 正常检验转为放宽检验
          // NORMAL_TO_LENIENT:{ruleItemKey: "NORMAL_TO_LENIENT", ruleEnabled: 0, ruleItemV1: "0"},
          // //2放宽检验转为免检
          // LENIENT_TO_EXEMPTED:{ruleItemKey: "LENIENT_TO_EXEMPTED", ruleEnabled: 0, ruleItemV1: "0"},
          // //3放宽检验转为正常检验
          // LENIENT_TO_NORMAL:{ruleItemKey: "LENIENT_TO_NORMAL", ruleEnabled: 0, ruleItemV1: "0"},
          // //4 正常检验转为加严检验
          // NORMAL_TO_STRICT:{ruleItemKey: "NORMAL_TO_STRICT", ruleEnabled: 0, ruleItemV1: "0"},
          // //5加严检验转为停产整顿
          // STRICT_TO_STOP:{ruleItemKey: "NORMAL_TO_STOP", ruleEnabled: 0, ruleItemV1: "0"},
          // //6加严检验转为正常检验
          // STRICT_TO_NORMAL:{ruleItemKey: "STRICT_TO_NORMAL", ruleEnabled: 0, ruleItemV1: "0"},

          //1 正常检验转为放宽检验
          NORMAL_TO_LENIENT: {
            ruleEnabled: 0,
            ruleId: '',
            ruleItemId: '',
            ruleItemKey: "NORMAL_TO_LENIENT",
            ruleItemType: "",
            ruleItemV1: null,
            ruleItemV2: null,
            ruleItemV3: null,
            ruleItemV4: null,
            ruleItemV5: null,
          },
          //2放宽检验转为免检
          LENIENT_TO_EXEMPTED: {
            ruleEnabled: 0,
            ruleId: '',
            ruleItemId: '',
            ruleItemKey: "LENIENT_TO_EXEMPTED",
            ruleItemType: "",
            ruleItemV1: null,
            ruleItemV2: null,
            ruleItemV3: null,
            ruleItemV4: null,
            ruleItemV5: null,
          },
          //3放宽检验转为正常检验
          LENIENT_TO_NORMAL: {
            ruleEnabled: 0,
            ruleId: '',
            ruleItemId: '',
            ruleItemKey: "LENIENT_TO_NORMAL",
            ruleItemType: "",
            ruleItemV1: null,
            ruleItemV2: null,
            ruleItemV3: null,
            ruleItemV4: null,
            ruleItemV5: null,
          },
          //4 正常检验转为加严检验
          NORMAL_TO_STRICT: {
            ruleEnabled: 0,
            ruleId: '',
            ruleItemId: '',
            ruleItemKey: "NORMAL_TO_STRICT",
            ruleItemType: "",
            ruleItemV1: null,
            ruleItemV2: null,
            ruleItemV3: null,
            ruleItemV4: null,
            ruleItemV5: null,
          },
          //5加严检验转为停产整顿
          STRICT_TO_STOP: {
            ruleEnabled: 0,
            ruleId: '',
            ruleItemId: '',
            ruleItemKey: "STRICT_TO_STOP",
            ruleItemType: "",
            ruleItemV1: null,
            ruleItemV2: null,
            ruleItemV3: null,
            ruleItemV4: null,
            ruleItemV5: null,
          },
          //6加严检验转为正常检验
          STRICT_TO_NORMAL: {
            ruleEnabled: 0,
            ruleId: '',
            ruleItemId: '',
            ruleItemKey: "STRICT_TO_NORMAL",
            ruleItemType: "",
            ruleItemV1: null,
            ruleItemV2: null,
            ruleItemV3: null,
            ruleItemV4: null,
            ruleItemV5: null,
          }


        },

        "ruleId": 0,
        "ruleName": "",
        "ruleRemark": "",
        "ruleType": "LENIENT_TRANSFER",
        "serialNumber": '',
        "tenantId": 0,

        "message": "string",
        "pagerInfo": {
          "limit": 0,
          "page": 0,
          "total": 0,
          "totalPages": 0
        },
        permsCur:[
          "SELECT_RULE",
          "UPDATE_RULE",
          "DELETE_RULE",
          "INSERT_RULE",
        ],
        permsBtn:{
          "DELETE_RULE":false,
          "SELECT_RULE":false,
          "UPDATE_RULE":false,
          "INSERT_RULE":false,
        },
        noPermsDis:true,

      }
    },//end data

    created(){
      let permsAll = this.$store.state.permissions;
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.$nextTick(function(){
        $('.ivu-table-tip table').height($('.ivu-table-tip').parents('.ivu-table-wrapper').height()-43)
        var noData='<img style="position:relative;left:-13px;" src="static/img/list-empty.png" alt="暂无数据"><div style="font-size:18px;line-height:24px;margin-top:27px;">'+i18n.t('noDataAddData')+'</div>'
        $('.ivu-table-tip td').html(noData)
      })
      // this.refreshTree();
      this.table.pager.current = 1;
      this.refreshData();
      // this.getstatusdata();
    },

    computed: {
      treeStyle() {
        return {
          "height": (Math.max(this.table.pager.rows, 10) * 40 + 54) + "px"
        };
      }
    },

    methods:{
      onPopDUp(){
        let that = this;
        if((that.permsBtn.UPDATE_RULE&&that.editModal.showtwo)||(that.permsBtn.INSERT_RULE&&that.editModal.show)){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
      },
      
      pageSizeChange(pageSize) {
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        this.refreshData();

      },
      pageChange(page) {
        this.table.pager.current = page;
        this.refreshData();
      },
      treeSelectChange(n) {
        if (n) {
          this.search.selectType = n.inspectionTypeId;
        } else {
          this.search.selectType = null;
        }
        this.table.pager.current = 1;
        this.refreshData();

      },
      tableSelectChange(selection) {
        this.table.selected = selection && selection.length > 0;
        if (selection.length != 1) {
          this.tableEditDis = true;
        } else {
          this.tableEditDis = false;
        }
      },
      refreshData() {
        this.table.loading = true;
        
        // let params = {page: this.table.pager.current, limit: this.table.pager.limit};
        let params = {page: this.table.pager.current, limit: this.table.pager.limit};
        params.query = this.search.query;
        params.fieldName = this.search.queryType;
        if (this.search.selectType) {
          params.parentId = this.search.selectType;
        }
        let that = this;
        this.$http.get("/rule-LENIENT_TRANSFER", {params: params}).then(function (resp) {
          // console.log(resp.data,444444444);
          that.data = [];
          if(resp.data){
            for(let i = 0; i < resp.data.length; i++){
              let obj = {};
              obj.LENIENT_TRANSFER = resp.data[i].attrs.LENIENT_TRANSFER
              obj.ruleName = resp.data[i].ruleName;
              obj.ruleRemark = resp.data[i].ruleRemark;
              obj.ruleId = resp.data[i].ruleId;
              that.data.push(obj)
              
            }
          }
         
          
          // that.data = resp.data;
          if (resp.pagerInfo) {
            that.table.pager.total = resp.pagerInfo.total;
          }
          that.table.loading = false;
          that.tableEditDis=true;
          that.table.selected=false;

        })

      },

      RankNo() {
        this.editModal.show = false;
      },
      RankNotwo() {
        this.editModal.showtwo = false;
      },

      //添加
      showModal() {
        let that = this;

        that.ruleId = '';
        that.ruleName = '';
        that.serialNumber = '';
        that.attrs.LENIENT_TRANSFER = null;
        that.ruleRemark = '';
        that.isDefault = '0';
        that.items.NORMAL_TO_LENIENT.ruleItemV1 = null;
        that.items.LENIENT_TO_EXEMPTED.ruleItemV1 = null;
        that.items.LENIENT_TO_NORMAL.ruleItemV1 = null;
        that.items.NORMAL_TO_STRICT.ruleItemV1 = null;
        that.items.STRICT_TO_STOP.ruleItemV1 = null;
        that.items.STRICT_TO_NORMAL.ruleItemV1 = null;
        // that.items = that.itemstwo
        that.editModal.show = true;
        that.onPopDUp()
      },
      //修改
      editSelectRow() {
        let that = this;

        let selectedRow = that.$refs.pageTable.getSelection();
        if (!selectedRow || selectedRow.length != 1) {
          that.$Notice.warning({title: i18n.t("quality.cbm")});
          return;
        } else {
          that.editModal.showtwo = true;
          that.$http.get("/rule/" + selectedRow[0].ruleId).then(function (reqs) {
            that.editModal.showtwo = true;
            var selectedRow = reqs.data;
            that.ruleId = selectedRow.ruleId;
            that.items = selectedRow.items;
            that.attrs.LENIENT_TRANSFER = parseInt(selectedRow.attrs.LENIENT_TRANSFER);
            that.ruleName = selectedRow.ruleName;
            that.ruleRemark = selectedRow.ruleRemark;
            that.isDefault = selectedRow.isDefault == 1 ? '1' : '0';

            that.items.NORMAL_TO_LENIENT.ruleItemV1 = parseInt(selectedRow.items.NORMAL_TO_LENIENT.ruleItemV1);
            that.items.LENIENT_TO_EXEMPTED.ruleItemV1 = parseInt(selectedRow.items.LENIENT_TO_EXEMPTED.ruleItemV1);
            that.items.LENIENT_TO_NORMAL.ruleItemV1 = parseInt(selectedRow.items.LENIENT_TO_NORMAL.ruleItemV1);
            that.items.NORMAL_TO_STRICT.ruleItemV1 = parseInt(selectedRow.items.NORMAL_TO_STRICT.ruleItemV1);
            that.items.STRICT_TO_STOP.ruleItemV1 = parseInt(selectedRow.items.STRICT_TO_STOP.ruleItemV1);
            that.items.STRICT_TO_NORMAL.ruleItemV1 = parseInt(selectedRow.items.STRICT_TO_NORMAL.ruleItemV1);
            that.onPopDUp()

          })
        }


      },
      onDBClick(o, i) {
        // console.log(i,5555555555);
        
        let that = this;
        that.editModal.showtwo = true;
        that.$http.get("/rule/" + o.ruleId).then(function (reqs) {
          that.editModal.showtwo = true;
          that.onPopDUp()
          var selectedRow = reqs.data;
          that.ruleId = selectedRow.ruleId;
          that.items = selectedRow.items;
          that.attrs.LENIENT_TRANSFER = parseInt(selectedRow.attrs.LENIENT_TRANSFER);
          that.ruleName = selectedRow.ruleName;
          that.ruleRemark = selectedRow.ruleRemark;
          that.isDefault = selectedRow.isDefault == 1 ? '1' : '0';

          that.items.NORMAL_TO_LENIENT.ruleItemV1 = parseInt(selectedRow.items.NORMAL_TO_LENIENT.ruleItemV1);
          that.items.LENIENT_TO_EXEMPTED.ruleItemV1 = parseInt(selectedRow.items.LENIENT_TO_EXEMPTED.ruleItemV1);
          that.items.LENIENT_TO_NORMAL.ruleItemV1 = parseInt(selectedRow.items.LENIENT_TO_NORMAL.ruleItemV1);
          that.items.NORMAL_TO_STRICT.ruleItemV1 = parseInt(selectedRow.items.NORMAL_TO_STRICT.ruleItemV1);
          that.items.STRICT_TO_STOP.ruleItemV1 = parseInt(selectedRow.items.STRICT_TO_STOP.ruleItemV1);
          that.items.STRICT_TO_NORMAL.ruleItemV1 = parseInt(selectedRow.items.STRICT_TO_NORMAL.ruleItemV1);


        })
      },
      //删除数据
      deleteTreeNode() {
        let that = this;

        let sns = that.$refs.pageTable.getSelection();
        if (sns.length == 0) {
          this.$Notice.warning({title:i18n.t("quality.cbm")});
          return;
        } else if (sns.length > 1) {
          for (let i = 0; i < sns.length; i++) {
            that.$http.delete("/rule/" + sns[i].ruleId).then(function (resp) {
              //删除成功后刷新数据
              that.refreshData();
            });
          }
          that.$Message.success(i18n.t("quality.ds"));
        } else {
          that.$http.delete("/rule/" + sns[0].ruleId).then(function (resp) {
            //删除成功后刷新数据
            that.refreshData();
          });
          that.$Message.success(i18n.t("quality.ds"));
        }
      },

      //添加数据
      modalOk() {
        let that = this;
        let params = [
          {type: 'Empty', title: i18n.t("quality.ruleName"), value: that.ruleName},
          {type: 'Name', title: i18n.t("quality.ruleName"), value: that.ruleName},
          {type: 'Empty', title: i18n.t("quality.ip"), value: that.attrs.LENIENT_TRANSFER},
          {type: 'Num999', title: i18n.t("quality.ip"), value: that.attrs.LENIENT_TRANSFER},
          {type: 'Num999', title: i18n.t("quality.ip"), value: that.attrs.LENIENT_TRANSFER},
          {type: 'Word600', title: i18n.t("quality.remarks"), value: that.ruleRemark},
          {type: 'Num999', title: i18n.t("quality.jc"), value: that.items.NORMAL_TO_LENIENT.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.jc"), value: that.items.LENIENT_TO_EXEMPTED.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.jc"), value: that.items.LENIENT_TO_NORMAL.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.jc"), value: that.items.NORMAL_TO_STRICT.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.jc"), value: that.items.STRICT_TO_STOP.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.jc"), value: that.items.STRICT_TO_NORMAL.ruleItemV1},
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
        var newData = {
          ruleName: that.ruleName,
          serialNumber: that.serialNumber,
          ruleRemark: that.ruleRemark,
          isDefault: that.isDefault,
          ruleType: that.ruleType,
          items: that.items,
          attrs: that.attrs
        }

        that.$http.post('/rule', newData, that.headers).then(function (reps) {
          that.refreshData();
          that.$Message.success(i18n.t("quality.as"));
          that.editModal.show = false;
        })


      },
      //修改数据
      altermodalOk() {
        let that = this;
        let params = [
          {type: 'Empty', title: i18n.t("quality.ruleName"), value: that.ruleName},
          {type: 'Name', title: i18n.t("quality.ruleName"), value: that.ruleName},
          {type: 'Empty', title: i18n.t("quality.ip"), value: that.attrs.LENIENT_TRANSFER},
          {type: 'Num999', title: i18n.t("quality.ip"), value: that.attrs.LENIENT_TRANSFER},
          {type: 'Num999', title: i18n.t("quality.ip"), value: that.attrs.LENIENT_TRANSFER},
          {type: 'Word600', title: i18n.t("quality.remarks"), value: that.ruleRemark},
          {type: 'Num999', title: i18n.t("quality.jc"), value: that.items.NORMAL_TO_LENIENT.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.jc"), value: that.items.LENIENT_TO_EXEMPTED.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.jc"), value: that.items.LENIENT_TO_NORMAL.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.jc"), value: that.items.NORMAL_TO_STRICT.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.jc"), value: that.items.STRICT_TO_STOP.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.jc"), value: that.items.STRICT_TO_NORMAL.ruleItemV1},
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

        var rulenewData = {
          "ruleId": that.ruleId,
          "attrs": that.attrs,
          "isDefault": that.isDefault,
          "items": that.items,
          "ruleName": that.ruleName,
          "ruleRemark": that.ruleRemark,
          "ruleType": that.ruleType,
          "serialNumber": that.serialNumber
        }
        that.$http.put('/rule/', rulenewData, that.headers).then(function (reqs) {
          that.showtwo = false;
          that.refreshData();
          that.editModal.showtwo = false;
          that.$Message.success(i18n.t("quality.ats"));
        })
      }
    }
  }

</script>
<style scoped>

  .fl {
    float: left
  }

  .nameWidth {
    width: 80px;
    text-align: center;
    box-sizing: border-box;
    padding-right: 10px;
    height: 30px;
    line-height: 32px;
  }

  .marginLF {
    margin-left: 80px
  }

  .nameWidth2 {
    width: 40px;
    text-align: center;
    box-sizing: border-box;
    height: 30px;
    line-height: 20px;
  }

  .marginLF2 {
    margin-left: 50px
  }

  .ruleset {
    width: 100%;
    /* height: 20%; */
    /* background-color: rgb(235, 230, 230); */
    border: 1px solid #dddee1;
    margin-top: 15px;
    padding: 10px;
  }

  .marignbottom {
    margin-bottom: 10px
  }
  .splineheight30{
    line-height: 30px;
  }
</style>
