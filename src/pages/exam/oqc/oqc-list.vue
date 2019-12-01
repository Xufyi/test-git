<template>
  <div class="iqis-page">
    <div class="iqis-page-search-row">
      <div class="iqis-page-search-bar-item" style="flex:0 0 210px; margin-right:8px;">
        <DatePicker
          type="daterange"
          v-model="search.dates"
          placement="bottom-start"
          :placeholder="i18n.t('oqc.dateFilter')"
          style="width: 200px"
        ></DatePicker>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select
          v-model="search.result"
          :placeholder="i18n.t('oqc.result')"
          clearable
          style="width: 100px;"
        >
          <Option v-for="st in search.resultStats" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item lineheight34" style="flex:0 0 108px;">
        <Select
          v-model="search.status"
          :placeholder="i18n.t('oqc.status')"
          clearable
          style="width: 100px;"
        >
          <Option v-for="st in search.statusList" :key="st.value" :value="st.value">{{st.label}}</Option>
        </Select>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
        <i-input class="lineheight34" v-model="search.query" clearable style="width: 280px">
          <Select
            v-model="search.fieldName"
            :placeholder="i18n.t('oqc.searchAll')"
            slot="prepend"
            style="width: 110px;text-align:left;"
          >
            <Option
              v-for="st in search.data.searchTypes"
              :key="st.value"
              :value="st.value"
            >{{st.label}}</Option>
          </Select>
        </i-input>
      </div>
      <div class="iqis-page-search-bar-item" style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click="refreshData()">{{$t('oqc.search')}}</Button>
        <!--<Button type="ghost" @click="search.fieldName='';search.resultStats=[];search.query='';refreshData()">重置</Button>-->
        <Button type="ghost" @click="reset">{{$t('oqc.reset')}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <!--<Button type="ghost" icon="refresh" @click="refreshData">刷新</Button>-->
        <Button
          type="ghost"
          v-if="permsBtn.INSERT_OQC"
          icon="plus"
          @click="addOqc"
        >{{$t('oqc.add')}}</Button>
        <Button
          style="margin:0 8px;"
          type="ghost"
          v-if="permsBtn.UPDATE_OQC"
          icon="edit"
          @click="editSelectRow"
          :disabled="tableEditDis"
        >{{$t('oqc.edit')}}</Button>
        <Poptip
          :ok-text="i18n.t('confirm')"
          :cancel-text="i18n.t('cancel')"
          confirm
          :title="i18n.t('oqc.confirmDelete')"
          placement="bottom-start"
          @on-ok="deleteTableSelected"
        >
          <Button
            v-if="permsBtn.DELETE_OQC"
            type="ghost"
            icon="trash-a"
            :disabled="!table.selected"
          >{{$t('oqc.delete')}}</Button>
        </Poptip>
        <Button
          style="margin:0 8px;"
          type="ghost"
          v-if="permsBtn.AUDIT_OQC"
          @click="Toexamine"
          :disabled="!table.selectedAuditing"
        >{{$t('oqc.audit')}}</Button>
        <Button
          type="ghost"
          v-if="permsBtn.INSERT_OQC_ABNORMAL"
          @click="createAbnormal"
          :disabled="tableEditDis"
          icon="android-alert"
        >{{$t('oqc.startAbn')}}</Button>
        <Button
          style="margin-left:8px;"
          type="ghost"
          icon="ios-copy"
          v-if="permsBtn.INSERT_OQC"
          :disabled="tableEditDis"
          @click="copySelectRow"
        >{{$t('product.copy')}}</Button>
      </div>
      <div class="iqis-page-tool-second" style="font-size:0;">
        <Button type="text" icon="refresh" @click="reset">{{$t('oqc.refreshData')}}</Button>
        <Button type="primary" @click="rank">{{$t('oqc.customList')}}</Button>
        <Dropdown style="margin-left: 8px" v-if="permsBtn.EXPORT_OQC">
          <Button type="ghost">
            {{$t('oqc.export')}}
            <Icon style="margin-left:10px;" type="arrow-down-b"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem>
              <Button type="text" @click="exportStatement(1)">{{$t('oqc.thisPage')}}</Button>
            </DropdownItem>
            <DropdownItem>
              <Button type="text" @click="exportStatement(3)">{{$t('oqc.allTheData')}}</Button>
            </DropdownItem>
            <DropdownItem>
              <Button type="text" @click="exportStatement(2)">{{$t('oqc.inspectReport')}}</Button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-prod-line-context" style="display: -webkit-flex;display: flex;">
        <div class="iqis-prod-line-table" style="flex: 1 1 100px;overflow: auto;">
          <Table
            ref="pageTable"
            class="tableCustom"
            @on-row-dblclick="onDBClick"
            v-drag-table-column="table.columns"
            :loading="table.loading"
            @on-selection-change="tableSelectChange"
            border
            stripe
            :columns="table.columns"
            :data="data"
          ></Table>
          <div style="padding: 20px 0 20px 0px;">
            <Page
              v-if="table.pager.need"
              :total="table.pager.total"
              :page-size="table.pager.limit"
              :current="table.pager.current"
              :page-size-opts="[10,20,50,100]"
              @on-change="pageChange"
              @on-page-size-change="pageSizeChange"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </div>
        </div>
      </div>
    </div>
    <div class="arrangement-dialog">
      <Modal
        :title="i18n.t('oqc.customList')"
        v-model="arrangement.state"
        class="rankBox"
        :mask-closable="false"
        :width="600"
      >
        <span class="list_txt">{{$t('oqc.select')}}</span>
        <div class="list_ok list">
          <div
            v-for="(item,index) in arrangement.data1"
            class="dataItem"
            :class="'check'+index"
            :key="index"
          >
            <input type="checkbox" :value="item" v-model="arrangement.data">
            <span>{{item.title}}</span>
          </div>
        </div>
        <span class="list_txt2">{{$t('oqc.selected')}}</span>
        <div class="list_no list">
          <draggable
            style="padding: 8px 0; overflow-y:auto;width: 100%;display: -webkit-flex;display: flex;flex-wrap:wrap;align-items: flex-start;"
            v-model="arrangement.data"
            :options="{group:'people'}"
            @start="drag=true"
            @end="drag=false"
          >
            <Card
              class="process-item"
              v-for="(element,index) in arrangement.data"
              :key="index"
              :class="element.title==null?'displayNO':''"
            >
              <div style="text-align:left">
                <span>{{element.title}}</span>
              </div>
            </Card>
          </draggable>
        </div>
        <div slot="footer">
          <Button type="primary" size="large" @click="ReplyOk">{{$t('oqc.restore')}}</Button>
          <Button type="primary" size="large" @click="RankOk">{{$t('oqc.confirm')}}</Button>
          <Button type="text" size="large" @click="RankNo">{{$t('oqc.cancel')}}</Button>
        </div>
      </Modal>
    </div>
    <div class="Toexamine">
      <Modal
        :title="i18n.t('oqc.audit')"
        v-model="Audit.status"
        :mask-closable="false"
        :width="300"
      >
        <Select v-model="Audit.fieldName" style="width:200px">
          <Option
            v-for="(item,index) in Audit.resultStats"
            :value="item.value"
            :key="index"
          >{{ item.label }}</Option>
        </Select>
        <div slot="footer">
          <Button type="primary" size="large" @click="AuditOk">{{$t('oqc.confirm')}}</Button>
          <Button type="text" size="large" @click="AuditNo">{{$t('oqc.cancel')}}</Button>
        </div>
      </Modal>
    </div>
    <!--<div class="page-end" style="padding-bottom: 12px"></div>-->
  </div>
</template>
<script>
import Input from "iview/src/components/input";
import draggable from "vuedraggable";
import $ from "jquery";
export default {
  components: {
    Input,
    draggable
  },
  data: function() {
    let vm = this;
    return {
      i18n: window.i18n,
      headers: {
        headers: { "Content-Type": "application/json; charset=UTF-8" }
      },
      data: [],
      tableEditDis: true,
      table: {
        selectedAuditing: false,
        selected: false,
        loading: true,
        pager: {
          rows: 10,
          need: true,
          total: 0,
          limit: 10,
          current: 1
        },
        columns: [
          {
            type: "selection",
            align: "center",
            className: this.$store.state.customerId ? "hide" : "",
            minWidth: this.$store.state.customerId ? 0 : 40,
            maxWidth: this.$store.state.customerId ? 0 : 40
          },
          // {title: '序号',
          //   width:80,
          //   render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
          //   align: 'center',
          //   minWidth:80,
          //   maxWidth:80
          // },
          {
            title: i18n.t("oqc.inspectTime"),
            className: "tablePadding",
            width: 106,
            minWidth: 106,
            // align: 'center',
            ellipsis: true,
            key: "createTime",
            render: function(h, data) {
              let value = data.row.createTime;
              let str = "-";
              if (value) {
                var unixTimestamp = new Date(value);
                str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
              }
              return h("span", str);
            }
          },
          {
            title: i18n.t("oqc.customer"),
            className: "tablePadding",
            width: 80,
            minWidth: 80,
            ellipsis: true,
            key: "customerName"
          },
          {
            title: i18n.t("oqc.productNo"),
            className: "tablePadding",
            width: 80,
            minWidth: 80,
            ellipsis: true,
            key: "productInfo.no",
            render: vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: i18n.t("oqc.productName"),
            className: "tablePadding",
            width: 80,
            minWidth: 80,
            ellipsis: true,
            key: "productInfo.name",
            render: vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: i18n.t("oqc.productSpec"),
            className: "tablePadding",
            width: 80,
            minWidth: 80,
            ellipsis: true,
            key: "productInfo.spec",
            render: vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: i18n.t("oqc.productUnit"),
            className: "tablePadding",
            // width:60,
            maxWidth: 60,
            minWidth: 60,
            ellipsis: true,
            key: "productInfo.prodUnitName",
            render: vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
          },
          {
            title: i18n.t("oqc.quantity"),
            className: "tablePadding",
            minWidth: this.$store.state.locale == "zh_CN" ? 80 : 125,
            // width:80,
            ellipsis: true,
            key: "oqcQuantity"
          },
          {
            title: i18n.t("oqc.result"),
            className: "tablePadding",
            minWidth: 80,
            // width:80,
            ellipsis: true,
            key: "result",
            render: vm.$iqis.utils.tableHelper.buildMapCell(vm, {
              0:
                "<span style='color:red;'>" +
                i18n.t("oqc.unqualified") +
                "</span>",
              1:
                "<span style='color:green;'>" +
                i18n.t("oqc.qualified") +
                "</span>"
            })
          },
          {
            title: i18n.t("oqc.sampleNum"),
            className: "tablePadding",
            minWidth: this.$store.state.locale == "zh_CN" ? 90 : 110,
            // width:80,
            ellipsis: true,
            key: "sampleQuantity"
          },
          {
            title: i18n.t("oqc.badNum"),
            className: "tablePadding",
            minWidth: this.$store.state.locale == "zh_CN" ? 80 : 100,
            // width:80,
            ellipsis: true,
            key: "badQuantity"
          },
          {
            title: i18n.t("oqc.badRate"),
            className: "tablePadding",
            minWidth: 80,
            // width:80,
            ellipsis: true,
            key: "badRate"
          },
          {
            title: i18n.t("oqc.status"),
            className: "tablePadding",
            minWidth: 80,
            // width:80,
            ellipsis: true,
            key: "state",
            //0检验中（没有提交审核）、1待审核（已提交审核）、2审核通过（通过审核按钮由有相应权限人员操作），3审核驳回（当审核不通过时，可重新点审核改变审核结果，也可以再次编辑后提交，状
            render: vm.$iqis.utils.tableHelper.buildMapCell(vm, {
              0: i18n.t("oqc.inspecting"),
              1: i18n.t("oqc.unaudited"),
              2:
                "<span style='color:green;'>" +
                i18n.t("oqc.auditPass") +
                "</span>",
              3:
                "<span style='color:red;'>" +
                i18n.t("oqc.auditReject") +
                "</span>"
            })
          },
          {
            title: i18n.t("oqc.reviewState"),
            className: "tablePadding",
            minWidth: this.$store.state.locale == "zh_CN" ? 70 : 115,
            ellipsis: true,
            key: "reviewState",
            // render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('oqc.unaudited'),1:i18n.t('oqc.unReview'),2:i18n.t('oqc.judged'),3:i18n.t('oqc.notClosed'),4:i18n.t('oqc.closed')})
            render: (h, params) => {
              if (params.row.state === 3 || params.row.state === 0) {
                params.row.reviewState = null;
              }
              let ret = vm.$iqis.utils.tableHelper.buildMapCell(vm, {
                0: i18n.t("oqc.unaudited"),
                1: i18n.t("oqc.unReview"),
                2: i18n.t("oqc.judged"),
                3: i18n.t("oqc.notClosed"),
                4: i18n.t("oqc.closed"),
                5:i18n.t('review')
              });
              return ret(h, params);
            }
          },
          {
            title: i18n.t("oqc.productBatch"),
            className: "tablePadding",
            width: this.$store.state.locale == "zh_CN" ? 80 : 100,
            minWidth: this.$store.state.locale == "zh_CN" ? 80 : 100,
            ellipsis: true,
            key: "batchNo"
          },
          {
            title: i18n.t("oqc.oqcNo"),
            className: "tablePadding",
            width: this.$store.state.locale == "zh_CN" ? 80 : 100,
            minWidth: this.$store.state.locale == "zh_CN" ? 80 : 100,
            ellipsis: true,
            key: "oqcNo"
          },
          {
            title: i18n.t("oqc.inspector"),
            className: "tablePadding",
            minWidth: 80,
            // width:80,
            ellipsis: true,
            key: "inspectorName"
          },
          {
            title: i18n.t("oqc.auditor"),
            className: "tablePadding",
            minWidth: 80,
            // width:80,
            ellipsis: true,
            key: "auditorName"
          }
        ]
      },
      search: {
        query: "",
        fieldName: "",
        result: "",
        status: "",
        userList: [],
        resultStats: [
          { value: "", label: i18n.t("oqc.all") },
          { value: "1", label: i18n.t("oqc.qualified") },
          { value: "0", label: i18n.t("oqc.unqualified") }
        ],
        statusList: [
          { value: "", label: i18n.t("oqc.all") },
          { value: "0", label: i18n.t("oqc.inspecting") },
          { value: "1", label: i18n.t("oqc.unaudited") },
          { value: "2", label: i18n.t("oqc.auditPass") },
          { value: "3", label: i18n.t("oqc.auditReject") }
        ],
        data: {
          searchTypes: [
            {
              label: i18n.t("oqc.searchAll"),
              value: ""
            },
            {
              label: i18n.t("oqc.customer"),
              value: "customerName"
            },
            {
              label: i18n.t("oqc.oqcNo"),
              value: "oqcNo"
            },
            {
              label: i18n.t("oqc.productNo"),
              value: "productNum"
            },
            {
              label: i18n.t("oqc.productName"),
              value: "productName"
            },
            {
              label: i18n.t("oqc.productSpec"),
              value: "spec"
            },
            {
              label: i18n.t("oqc.productUnit"),
              value: "prodUnitName"
            },
            {
              label: i18n.t("oqc.prodType"),
              value: "prodTypeName"
            },
            {
              label: i18n.t("oqc.inspector"),
              value: "inspectorName"
            },
            {
              label: i18n.t("oqc.auditor"),
              value: "auditorName"
            }
          ]
        }
      },
      Audit: {
        //审核状态
        status: false,
        resultStats: [
          { value: "2", label: i18n.t("oqc.auditPass") },
          { value: "3", label: i18n.t("oqc.auditReject") }
        ],
        fieldName: "2"
      },
      //排序
      arrangement: {
        state: false,
        data: [],
        data1: []
      },
      urlProduct: {
        no: [],
        name: [],
        prodTypeName: [],
        cityList: [],
        prodTypeId: "",
        customerList: [],
        dataList: [],
        index: 1
      },
      rankData: [
        {
          title: i18n.t("oqc.inspectTime"),
          className: "tablePadding",
          width: 106,
          minWidth: 106,
          // align: 'center',
          ellipsis: true,
          key: "createTime",
          render: function(h, data) {
            let value = data.row.createTime;
            let str = "-";
            if (value) {
              var unixTimestamp = new Date(value);
              str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
            }
            return h("span", str);
          }
        },
        {
          title: i18n.t("oqc.customer"),
          className: "tablePadding",
          width: 80,
          minWidth: 80,
          ellipsis: true,
          key: "customerName"
        },
        {
          title: i18n.t("oqc.productNo"),
          className: "tablePadding",
          width: 80,
          minWidth: 80,
          ellipsis: true,
          key: "productInfo.no",
          render: vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
        {
          title: i18n.t("oqc.productName"),
          className: "tablePadding",
          width: 80,
          minWidth: 80,
          ellipsis: true,
          key: "productInfo.name",
          render: vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
        {
          title: i18n.t("oqc.productSpec"),
          className: "tablePadding",
          width: 80,
          minWidth: 80,
          ellipsis: true,
          key: "productInfo.spec",
          render: vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
        {
          title: i18n.t("oqc.productUnit"),
          className: "tablePadding",
          // width:60,
          maxWidth: 60,
          minWidth: 60,
          ellipsis: true,
          key: "productInfo.prodUnitName",
          render: vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
        {
          title: i18n.t("oqc.quantity"),
          className: "tablePadding",
          minWidth: this.$store.state.locale == "zh_CN" ? 80 : 150,
          // width:80,
          ellipsis: true,
          key: "oqcQuantity"
        },
        {
          title: i18n.t("oqc.result"),
          className: "tablePadding",
          minWidth: 80,
          // width:80,
          ellipsis: true,
          key: "result",
          render: vm.$iqis.utils.tableHelper.buildMapCell(vm, {
            0:
              "<span style='color:red;'>" +
              i18n.t("oqc.unqualified") +
              "</span>",
            1:
              "<span style='color:green;'>" +
              i18n.t("oqc.qualified") +
              "</span>"
          })
        },
        {
          title: i18n.t("oqc.sampleNum"),
          className: "tablePadding",
          minWidth: this.$store.state.locale == "zh_CN" ? 80 : 120,
          // width:this.$store.state.locale=='zh_CN'?80:120,
          ellipsis: true,
          key: "sampleQuantity"
        },
        {
          title: i18n.t("oqc.badNum"),
          className: "tablePadding",
          minWidth: this.$store.state.locale == "zh_CN" ? 80 : 120,
          // width:80,
          ellipsis: true,
          key: "badQuantity"
        },
        {
          title: i18n.t("oqc.badRate"),
          className: "tablePadding",
          minWidth: 80,
          // width:80,
          ellipsis: true,
          key: "badRate"
        },
        {
          title: i18n.t("oqc.status"),
          className: "tablePadding",
          minWidth: 80,
          // width:80,
          ellipsis: true,
          key: "state",
          //0检验中（没有提交审核）、1待审核（已提交审核）、2审核通过（通过审核按钮由有相应权限人员操作），3审核驳回（当审核不通过时，可重新点审核改变审核结果，也可以再次编辑后提交，状
          render: vm.$iqis.utils.tableHelper.buildMapCell(vm, {
            0: i18n.t("oqc.inspecting"),
            1: i18n.t("oqc.unaudited"),
            2:
              "<span style='color:green;'>" +
              i18n.t("oqc.auditPass") +
              "</span>",
            3:
              "<span style='color:red;'>" +
              i18n.t("oqc.auditReject") +
              "</span>"
          })
        },
        {
          title: i18n.t("oqc.reviewState"),
          className: "tablePadding",
          minWidth: this.$store.state.locale == "zh_CN" ? 70 : 115,
          ellipsis: true,
          key: "reviewState",
          // render:vm.$iqis.utils.tableHelper.buildMapCell(vm,{0:i18n.t('oqc.unaudited'),1:i18n.t('oqc.unReview'),2:i18n.t('oqc.judged'),3:i18n.t('oqc.notClosed'),4:i18n.t('oqc.closed')})
          render: (h, params) => {
            if (params.row.state === 3 || params.row.state === 0) {
              params.row.reviewState = null;
            }
            let ret = vm.$iqis.utils.tableHelper.buildMapCell(vm, {
              0: i18n.t("oqc.unaudited"),
              1: i18n.t("oqc.unReview"),
              2: i18n.t("oqc.judged"),
              3: i18n.t("oqc.notClosed"),
              4: i18n.t("oqc.closed"),
              5:i18n.t('review')
            });
            return ret(h, params);
          }
        },
        {
          title: i18n.t("oqc.productBatch"),
          className: "tablePadding",
          width: this.$store.state.locale == "zh_CN" ? 80 : 120,
          minWidth: this.$store.state.locale == "zh_CN" ? 80 : 120,
          ellipsis: true,
          key: "batchNo"
        },
        {
          title: i18n.t("oqc.oqcNo"),
          className: "tablePadding",
          width: this.$store.state.locale == "zh_CN" ? 80 : 120,
          minWidth: this.$store.state.locale == "zh_CN" ? 80 : 120,
          ellipsis: true,
          key: "oqcNo"
        },
        {
          title: i18n.t("oqc.inspector"),
          className: "tablePadding",
          minWidth: 80,
          // width:80,
          ellipsis: true,
          key: "inspectorName"
        },
        {
          title: i18n.t("oqc.auditor"),
          className: "tablePadding",
          minWidth: 80,
          // width:80,
          ellipsis: true,
          key: "auditorName"
        },

        {
          title: i18n.t("oqc.prodType"),
          className: "tablePadding",
          width: this.$store.state.locale == "zh_CN" ? 80 : 140,
          minWidth: this.$store.state.locale == "zh_CN" ? 80 : 140,
          ellipsis: true,
          key: "productInfo.prodTypeName",
          render: vm.$iqis.utils.tableHelper.buildFieldPathCell(vm)
        },
        {
          title: i18n.t("oqc.customerProdNo"),
          className: "tablePadding",
          width: this.$store.state.locale == "zh_CN" ? 103 : 150,
          minWidth: this.$store.state.locale == "zh_CN" ? 103 : 150,
          ellipsis: true,
          key: "customerProductNo"
        }
      ],
      permsCur: [
        "UPDATE_OQC",
        "SELECT_OQC",
        "INSERT_OQC",
        "DELETE_OQC",
        "EXPORT_OQC",
        "AUDIT_OQC",
        "INSERT_OQC_ABNORMAL"
      ], //当前页面需要的权限名称
      permsBtn: {
        //控制每个权限对应按钮的禁用状态
        INSERT_OQC: false,
        SELECT_OQC: false,
        UPDATE_OQC: false,
        DELETE_OQC: false,
        EXPORT_OQC: false,
        AUDIT_OQC: false,
        INSERT_OQC_ABNORMAL: false
      }
    };
  }, //end data

  created() {
    this.refreshData();
    let permsAll = this.$store.state.permissions;
    this.$iqis.utils.getPermissionsAll(permsAll, this.permsCur, this.permsBtn);
    this.$nextTick(function() {
      $(".ivu-table-tip table").height(
        $(".ivu-table-tip")
          .parents(".ivu-table-wrapper")
          .height() - 43
      );
      var noData =
        '<img style="position:relative;left:-13px;" src="static/img/list-empty.png"><div style="font-size:18px;line-height:24px;margin-top:27px;">' +
        i18n.t("noDataAddData") +
        "</div>";
      $(".ivu-table-tip td").html(noData);
    });
  },
  watch: {
    renderList: function(a, b) {
      if (a) {
        this.reset();
      }
    }
  },
  computed: {
    renderList() {
      return this.$store.state.renderExamList;
    }
  },
  methods: {
    copySelectRow() {
      let selectedRow = this.$refs.pageTable.getSelection();
      //console.log(selectedRow);
      if (!selectedRow || selectedRow.length != 1) {
        this.$Notice.warning({
          title: i18n.t('stopCopy'),
          desc: ""
        });
        return;
      }
      this.$emit(
        "open-tab",
        "exam-oqc-copy-" + selectedRow[0].oqcId,
        i18n.t("product.copy") + "-" + selectedRow[0].productInfo.name,
        "page-exam-oqc-add-update",
        { oqcId: selectedRow[0].oqcId }
      );
    },
    createAbnormal() {
      let that = this;
      let selectedRow = that.$refs.pageTable.getSelection();
      if (selectedRow[0].state == 0 || selectedRow[0].state == 3) {
        that.$Notice.warning({ title: i18n.t("oqc.stateStopAbn") });
        return;
      }
      if (selectedRow[0].result == 1) {
        that.$Notice.warning({ title: i18n.t("oqc.resultStopAbn") });
        return;
      }
      that.$http
        .get("/examinecenter/oqc/abnormal", { page: 1, limit: 999999 })
        .then(function(resp) {
          for (let i in resp.data) {
            if (resp.data[i].qcNo == selectedRow[0].oqcNo) {
              that.$Notice.warning({ title: i18n.t("oqc.haveAbnStopAbn") });
              return;
            }
          }
          that.$emit(
            "open-tab",
            "exam-oqc-abnormal-add",
            i18n.t("oqc.addOqcAbn"),
            "page-exam-oqc-abnormal-add",
            { qcNo: selectedRow[0].oqcNo }
          );
        });
    },
    reset() {
      this.pageChange(1);
      this.table.selected = "";
      this.search.result = "";
      this.search.status = "";
      this.search.dates = "";
      this.search.fieldName = "";
      this.search.query = "";
      this.refreshData();
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
    /**
     * 导出报表
     * index 为 1 时为导出当前条件列表
     * index 为 2 时为导出检验报告
     */
    exportStatement(index) {
      //console.log(index,'index');
      let url = "";
      let methods = "get";
      let params = {}; //搜索条件
      if (index == 1) {
        url = "/examinecenter/oqc/export/list";
        params.page = this.table.pager.current;
        params.limit = this.table.pager.limit;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;
        params.result = this.search.result;
        params.state = this.search.state;
        if (this.search.dates && this.search.dates[0]) {
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];
          params.startDate = this.$iqis.utils.getDayStart(1, sdate);
          params.endDate = this.$iqis.utils.getDayEnd(edate);
        }
      }
      if (index == 3) {
        url = "/examinecenter/oqc/export/list";
        params.page = 1;
        params.limit = this.table.pager.total;
        params.query = this.search.query;
        params.fieldName = this.search.fieldName;
        params.result = this.search.result;
        params.state = this.search.state;
        if (this.search.dates && this.search.dates[0]) {
          let sdate = this.search.dates[0];
          let edate = this.search.dates[1];
          params.startDate = this.$iqis.utils.getDayStart(1, sdate);
          params.endDate = this.$iqis.utils.getDayEnd(edate);
        }
      }
      if (index == 2) {
        url = "/examinecenter/oqc/export/report";
        let reviewList = this.$refs.pageTable.getSelection();
        if (reviewList.length != 1) {
          this.$Notice.warning({
            title: i18n.t("oqc.exportChooseOne")
          });
          return;
        }
        params.oqcId = reviewList[0].oqcId;
      }

      this.$iqis.download(url, params, methods, () => {}); //下载文件
    },
    modalOk() {
      //console.log(this.editModal.item);
      this.editModal.requesting = true;
      // this.editModal.item.prodLineTypeId = null;
      // if(this.editModal.item.prodLineTypeValue && this.editModal.item.prodLineTypeValue.length > 0){
      //   let plt = this.editModal.item.prodLineTypeValue[this.editModal.item.prodLineTypeValue.length-1];
      //   if(plt){
      //     this.editModal.item.prodLineTypeId = plt;
      //   }
      // }

      if (
        !this.editModal.item.name ||
        !this.editModal.item.judgeId ||
        //|| !this.editModal.item.reviewer1Id || !this.editModal.item.reviewer2Id
        //|| !this.editModal.item.reviewer3Id || !this.editModal.item.reviewer4Id
        !this.editModal.item.auditorId
      ) {
        this.$Notice.warning({
          title: "必须录入名称和所有参与人员",
          desc: ""
        });
        this.editModal.requesting = false;
        return;
      }
      let that = this;
      if (this.editModal.item.prodLineId) {
        that.$http
          .put("/basic/reviewprocess", that.editModal.item)
          .then(function(resp) {
            that.refreshData();
            that.$Message.success(i18n.t("oqc.editSuccess"));
            that.editModal.show = false;
          });
      } else {
        that.$http
          .post("/basic/reviewprocess", that.editModal.item)
          .then(function(resp) {
            that.refreshData();
            that.$Message.success(i18n.t("oqc.addSuccess"));
            that.editModal.show = false;
          });
      }

      //this.editModal = true;
    },
    addOqc() {
      this.$emit(
        "open-tab",
        "exam-oqc-abnormal-1",
        i18n.t("oqc.addOqc"),
        "page-exam-oqc-add-update",
        null
      );
    },
    editSelectRow(e) {
      let selectedRow = this.$refs.pageTable.getSelection();
      //console.log(selectedRow,999);
      if (!selectedRow || selectedRow.length != 1) {
        // this.$Notice.warning({
        //   title: '必须选择一条记录后才可以进行修改',
        //   desc: ''
        // });
        return;
      }

      this.$emit(
        "open-tab",
        "exam-oqc-abnormal-" + selectedRow[0].oqcId,
        i18n.t("oqc.editOqc") + "-" + selectedRow[0].productInfo.name,
        "page-exam-oqc-add-update",
        { oqcId: selectedRow[0].oqcId }
      );
      // this.showModal(selectedRow[0]);
    },
    onDBClick(obj, index) {
      this.$emit(
        "open-tab",
        "exam-oqc-abnormal-" + obj.oqcId,
        i18n.t("oqc.editOqc") + "-" + obj.productInfo.name,
        "page-exam-oqc-add-update",
        { oqcId: obj.oqcId }
      );
    },
    //评审
    Toexamine() {
      let that = this;
      let reviewList = this.$refs.pageTable.getSelection();
      if (reviewList.length == 0) {
        this.$Notice.warning({
          title: i18n.t("oqc.auditChooseOne"),
          desc: ""
        });
        return;
      } else {
        that.Audit.status = true;
      }
    },
    AuditOk() {
      let that = this;
      let url = "/examinecenter/oqc/oqc/audit?oqcId=";
      let AuditRwo = this.$refs.pageTable.getSelection();
      for (let i = 0; i < AuditRwo.length; i++) {
        that.$http
          .post(
            url + AuditRwo[i].oqcId + "&state=" + that.Audit.fieldName,
            that.headers
          )
          .then(res => {
            that.$Message.success(i18n.t("oqc.auditSuccess"));
            that.Audit.status = false;
            that.refreshData();
          });
      }
    },
    AuditNo() {
      let that = this;
      that.Audit.status = false;
    },
    tableSelectChange(selection) {
      let ss = this.$refs.pageTable.getSelection();
      this.table.selected = selection && selection.length > 0;
      if (selection.length != 1) {
        this.tableEditDis = true;
      } else {
        this.tableEditDis = false;
      }
      this.table.selectedAuditing =
        selection && selection.length > 0 && ss[0].stat != 0;
      //console.log(this.table.selected)
      //console.log(selection)
    },
    deleteTableSelected() {
      let ss = this.$refs.pageTable.getSelection();
      let that = this;
      if (ss && ss.length > 0) {
        let delArr = [];
        for (let i = 0; i < ss.length; i++) {
          delArr.push(
            this.$http.delete("/examinecenter/oqc/oqc/" + ss[i].oqcId)
          );
        }

        if (delArr.length > 0) {
          this.$http.all(delArr).then(function(resps) {
            that.$Message.success(i18n.t("oqc.deleteSuccess"));
            that.refreshData();
          });
        }
      }
    },
    loadEditData() {
      this.editModal.dataLoading = true;

      let that = this;
      this.$http
        .get("/tenant/user", { params: { limit: 99999999 } })
        .then(function(resp) {
          if (resp.data) {
            that.search.userList = resp.data;
            that.editModal.dataLoading = false;
          }
        });
    },

    refreshData() {
      let that = this;
      that.table.loading = true;
      let params = {};
      let startDate = "";
      let endDate = "";
      let customerId = this.$store.state.customerId || "";
      params.page = this.table.pager.current;
      params.limit = this.table.pager.limit;
      /*params.query = this.search.query;
        params.fieldName = this.search.fieldName;*/

      // params.page = this.table.pager.current;
      // params.limit = this.table.pager.limit;
      // params.query = this.search.query;
      // params.fieldName = this.search.fieldName;
      // params.result = this.search.result;
      // params.state = this.search.status;
      // if(this.search.dates && this.search.dates[0]){
      //   let sdate = this.search.dates[0];
      //   let edate = this.search.dates[1];

      //   params.startDate = this.$iqis.utils.getDayStart(1,sdate);
      //   params.endDate = this.$iqis.utils.getDayEnd(edate);
      // }

      if (this.search.dates && this.search.dates[0]) {
        startDate = this.$iqis.utils.getDayStart(1, this.search.dates[0]);
        endDate = this.$iqis.utils.getDayEnd(this.search.dates[1]);
        params.query =
          "startDate=" +
          startDate +
          "&endDate=" +
          endDate +
          "&result=" +
          that.search.result +
          "&state=" +
          that.search.status +
          "&field=" +
          that.search.fieldName +
          "&keyword=" +
          that.search.query +
          "&customerId=" +
          customerId;
      } else {
        params.query =
          "result=" +
          that.search.result +
          "&state=" +
          that.search.status +
          "&field=" +
          that.search.fieldName +
          "&keyword=" +
          that.search.query +
          "&customerId=" +
          customerId;
      }
      this.$http
        .get("/examinecenter/oqc/oqc", { params: params })
        .then(function(resp) {
          for (var i = 0; i < resp.data.length; i++) {
            let x =
              (resp.data[i].badQuantity / resp.data[i].sampleQuantity) * 100;
            /*  if(resp.data[i].badQuantity!=null&&resp.data[i].sampleQuantity!=null){
              if(x > 100){
                resp.data[i].badRate = '100'
              }else{

                resp.data[i].badRate = Math.floor(x * 100) / 100;
              }
              // resp.data[i].badRate=(resp.data[i].badQuantity/resp.data[i].sampleQuantity*100).toFixed(2)
            }else{
              resp.data[i].badRate=""
            } */
            if (isNaN(x)) {
              resp.data[i].badRate = 0;
            } else if (x == Infinity) {
              resp.data[i].badRate = 100;
            } else {
              resp.data[i].badRate = Math.floor(x * 100) / 100;
            }
          }
          that.data = resp.data;
          that.table.pager.total = resp.pagerInfo.total;
          let rowCount = resp.data ? resp.data.length : 10;
          that.table.pager.rows = Math.max(rowCount, 6);
          that.table.loading = false;
        });
      this.$store.commit("RENDER_CHANGE", false);
    },
    //自定义排序
    rank() {
      let that = this;
      if (that.urlProduct.index === 1) {
        that.defaultData();
      } else {
        that.arrangement.data = that.arrangement.data;
      }
      that.arrangement.data1 = that.rankData;
      that.arrangement.state = true;
    },
    ReplyOk() {
      this.defaultData();
    },
    //默认排序
    defaultData() {
      let that = this;
      that.urlProduct.index = 1;
      that.urlProduct.dataList = that.rankData.concat();
      that.urlProduct.dataList.splice(-2, 2);
      that.arrangement.data = that.urlProduct.dataList;
    },
    //排序确定
    RankOk() {
      if (this.arrangement.data.length === 0) {
        this.$Notice.warning({
          title: i18n.t("oqc.listNull"),
          desc: ""
        });
        return;
      }
      let data = [
        {
          type: "selection",
          align: "center",
          width: 40,
          minWidth: 40,
          maxWidth: 40
        }
      ];
      let dataList = data.concat(this.arrangement.data);
      this.table.columns = dataList;
      this.urlProduct.index = 2;
      this.arrangement.state = false;
    },
    // 默认数据显示
    RankNo() {
      this.arrangement.state = false;
    }
  } //end methods
};
</script>
<style>
.rankBox .list {
  width: 100%;
  min-height: 30px;
}
.rankBox .list_txt2 {
  display: block;
  margin-top: 20px;
}
/* .rankBox .check0{display: none;} */
.list_txt,
.list_txt2 {
  display: block;
  margin-bottom: 10px;
  font-size: 16px;
  color: #5c5c5c;
}
.list_no {
  background: #fafafa;
}
.list_ok .dataItem {
  display: inline-block;
  padding: 5px 10px;
}
.list_no div,
.list_no span {
  display: inline-block;
}
.list_no span {
  padding: 1px 10px;
  font-size: 14px;
}
.list_no .X0 {
  display: none;
}
.list_no .process-item {
  margin-left: 10px;
  cursor: pointer;
  margin-bottom: 15px;
  width: auto !important;
}
.list_no .ivu-card-body {
  padding: 0 !important;
  border: 1px solid #418fee;
  border-radius: 2px;
}
.displayNO {
  display: none;
}
.list_no .ivu-card-body {
  padding-right: 0x !important;
}
</style>
