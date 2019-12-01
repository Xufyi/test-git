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
      <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
        <Button style="margin-right:8px;" type="primary" @click='refreshData'>{{$t("quality.search")}}</Button>
        <Button type="ghost" @click="table.pager.current = 1;table.selected='';search.query='';search.queryType='';refreshData();">{{$t("quality.reset")}}</Button>
      </div>
    </div>
    <div class="iqis-page-tool-row">
      <div class="iqis-page-tool-primary" style="font-size:0;">
        <!-- <Button style="margin-right:8px;" v-show="true" v-if="permsBtn.INSERT_RULE" type="ghost" icon="plus" @click="showModal">添加</Button> -->
        <Button style="margin-right:8px;" v-if="permsBtn.UPDATE_RULE" type="ghost" icon="edit" :disabled="tableEditDis" @click='editSelectRow'>{{$t("quality.modify")}}</Button>
        <!-- <Button type="ghost" icon="trash-a" disabled>删除</Button> -->
        <Poptip
          confirm
          :title="i18n.t('quality.dsi')"
          placement="bottom-start"
          :ok-text='i18n.t("quality.confirm")'
          :cancel-text='i18n.t("quality.cancel")'
          @on-ok="deleteTreeNode">
          <Button v-show="false" v-if="permsBtn.DELETE_RULE" type="ghost" :disabled="!table.selected">{{$t("quality.delete")}}</Button>
        </Poptip>
      </div>
      <div class="iqis-page-tool-second">
        <Button type="text"  icon="refresh" @click="table.pager.current = 1;table.selected='';search.query='';search.queryType='';refreshData();">{{$t("quality.refresh")}}</Button>
        <!--<Button type="primary" icon="more">自定义列表</Button>-->
        <!--<Button type="ghost" icon="share">导出报表</Button>-->
      </div>
    </div>
    <div class="iqis-page-context">
      <div class="iqis-page-type-context" style="display: -webkit-flex;display: flex;">
        <!--<div class="iqis-abnormal-type-tree" style="flex: 0 0 260px;font-size: 14px;overflow: auto; border: 1px solid #e9eaec;margin-right: 8px;padding-left: 10px;" :style="treeStyle">-->
        <!--<Tree :data="category" @on-select-change="treeSelectChange" ></Tree>-->
        <!--</div>-->
        <div class="iqis-page-table" style="flex: 1 1 100px;overflow: auto;">
          <Table ref="pageTable" class="tableCustom" @on-selection-change="tableSelectChange" @on-row-dblclick="onDBClick" v-drag-table-column="table.columns"  :loading="table.loading"  border stripe :columns="table.columns" :data="data"></Table>
          <!-- <div style="display:inline-block;"> -->
            <div style="padding: 20px 0 20px 0px;">
              <Page id="pageId" v-if="table.pager.need" :total="table.pager.total" :page-size="table.pager.limit" :current="table.pager.current"
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
    <div class="arrangement-dialog-from">
      <Modal
        :title="i18n.t('quality.agdr')"
        v-model="editModal.show"
        :mask-closable="false"
        :width="600" >
        <Row type="flex" :gutter="24" style="margin-bottom:15px">
          <i-col span="12">
           <span>{{$t("quality.ruleName")}}</span>
           <i-input :disabled="noPermsDis" v-model="ruleName" :placeholder="i18n.t('quality.pe')" style="width: 100%" ></i-input>
          </i-col>
          <i-col span="12" v-show="false">
           <span>{{$t("quality.ti")}}</span>
           <!-- <i-input placeholder="请输入" style="width: 100%" ><span slot="append">天</span></i-input> -->
           <Select  :disabled="noPermsDis" v-model="decide">
              <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          </i-col>
        </Row>
        <Row type="flex" :gutter="24" style="margin-bottom:15px">
          <i-col span="24">
           <span>{{$t("quality.remarks")}}</span>
           <i-input :disabled="noPermsDis" v-model="ruleRemark" style="width: 100%;"></i-input>
          </i-col>
        </Row>
        <!-- <Row type="flex" :gutter="24">
          <i-col span="12">
           <Checkbox :disabled="noPermsDis" v-model="isDefault2">默认判读规则</Checkbox>
          </i-col>
        </Row> -->
        <div class="ruleset">
          <Row :gutter="32">
            <Col span="24" class="demo-tabs-style1">
                <Tabs type="card">
                    <TabPane label="图形判读一">
                      <Row style="margin-bottom:10px;">
                        <Col span="24">
                        <!-- {{rule1}} -->
                          <Checkbox :disabled="true" true-value='1' false-value='0' v-model="ruleOne">
                            <span style="font-weight:800;">规则一:</span>
                            <span>有一点落在三倍标准差以外</span>
                            </Checkbox>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:10px;">
                        <Col span="24">
                          <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_SAME_SIDE.ruleEnabled">
                            <span style="font-weight:800;">规则二:</span>
                            <span>连续</span>
                            <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_SAME_SIDE.ruleItemV1" :max="999" :min="0" size='small' style="width:55px; height：20px"></InputNumber></span>
                            <span>点落在管制中心线同一侧</span>
                            </Checkbox>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:10px;">
                        <Col span="24">
                          <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_UP_OR_DOWN.ruleEnabled">
                            <span style="font-weight:800;">规则三:</span>
                            <span>连续</span>
                            <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_UP_OR_DOWN.ruleItemV1" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                            <span>点持续上升或下降</span>

                          </Checkbox>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:10px;">
                        <Col span="24">
                          <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_ALTERNATE_UP_AND_DOWN.ruleEnabled">
                            <span style="font-weight:800;">规则四:</span>
                            <span>连续</span>
                            <span><InputNumber v-model="items.DIAGRAM_ALTERNATE_UP_AND_DOWN.ruleItemV1" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                            <span>点交替上下跳动</span>
                            </Checkbox>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:10px;">
                        <Col span="24">
                          <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleEnabled">
                            <span style="font-weight:800;">规则五:</span>
                            <span>连续</span>
                            <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleItemV1" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                            <span>点中有</span>
                            <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleItemV2" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                            <span>点落在中心线同侧二倍标准差以外</span>
                            </Checkbox>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:10px;">
                        <Col span="24">
                          <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleEnabled">
                            <span style="font-weight:800;">规则六:</span>
                            <span>连续</span>
                            <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleItemV1" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                            <span>点中有</span>
                            <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleItemV2" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                            <span>点落在中心线同侧一倍标准差以外</span>
                            </Checkbox>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:10px;">
                        <Col span="24">
                          <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE.ruleEnabled">
                            <span style="font-weight:800;">规则七:</span>
                            <span>连续</span>
                            <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE.ruleItemV1" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                            <span>点落在中心线两侧的一倍标准差以内</span>
                            </Checkbox>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:10px;">
                        <Col span="24">
                          <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE.ruleEnabled">
                            <span style="font-weight:800;">规则八:</span>
                            <span>连续</span>
                            <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE.ruleItemV1" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                            <span>点落在中心线两侧但并未在一倍标准差以内</span>
                            </Checkbox>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:10px;">
                        <Col span="24">
                          <Checkbox :disabled="true" true-value='1' false-value='0' v-model="rule9">
                            <span style="font-weight:800;">规则九:</span>
                            <span>落在规格界限以外</span>
                            </Checkbox>
                        </Col>
                    </Row>
                    </TabPane>

                    <TabPane label="图形判读二" v-if="this.decide == 2 ? true : false" >
                      <Row style="margin-bottom:10px;">
                          <Col span="24">
                            <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_OUT_TRIPLE_2.ruleEnabled">
                              <span style="font-weight:800;">规则一:</span>
                              <span>有一点落在三倍标准差以外</span>
                              </Checkbox>
                          </Col>
                      </Row>
                      <Row style="margin-bottom:10px;">
                          <Col span="24">
                            <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_SAME_SIDE_2.ruleEnabled">
                              <span style="font-weight:800;">规则二:</span>
                              <span>连续</span>
                              <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_SAME_SIDE_2.ruleItemV1" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                              <span>点落在管制中心线同一侧</span>
                              </Checkbox>
                          </Col>
                      </Row>
                      <Row style="margin-bottom:10px;">
                          <Col span="24">
                            <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_UP_OR_DOWN_2.ruleEnabled">
                              <span style="font-weight:800;">规则三:</span>
                              <span>连续</span>
                              <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_UP_OR_DOWN_2.ruleItemV1" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                              <span>点持续上升或下降</span>

                            </Checkbox>
                          </Col>
                      </Row>
                      <Row style="margin-bottom:10px;">
                          <Col span="24">
                            <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_ALTERNATE_UP_AND_DOWN_2.ruleEnabled">
                              <span style="font-weight:800;">规则四:</span>
                              <span>连续</span>
                              <span><InputNumber v-model="items.DIAGRAM_ALTERNATE_UP_AND_DOWN_2.ruleItemV1" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                              <span>点交替上下跳动</span>
                              </Checkbox>
                          </Col>
                      </Row>
                      <Row style="margin-bottom:10px;">
                          <Col span="24">
                            <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2.ruleEnabled">
                              <span style="font-weight:800;">规则五:</span>
                              <span>连续</span>
                              <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2.ruleItemV1" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                              <span>点中有</span>
                              <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2.ruleItemV2" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                              <span>点落在中心线同侧二倍标准差以外</span>
                              </Checkbox>
                          </Col>
                      </Row>
                      <Row style="margin-bottom:10px;">
                          <Col span="24">
                            <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2.ruleEnabled">
                              <span style="font-weight:800;">规则六:</span>
                              <span>连续</span>
                              <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2.ruleItemV1" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                              <span>点中有</span>
                              <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2.ruleItemV2" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                              <span>点落在中心线同侧一倍标准差以外</span>
                              </Checkbox>
                          </Col>
                      </Row>
                      <Row style="margin-bottom:10px;">
                          <Col span="24">
                            <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE_2.ruleEnabled">
                              <span style="font-weight:800;">规则七:</span>
                              <span>连续</span>
                              <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE_2.ruleItemV1" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                              <span>点落在中心线两侧的一倍标准差以内</span>
                              </Checkbox>
                          </Col>
                      </Row>
                      <Row style="margin-bottom:10px;">
                          <Col span="24">
                            <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE_2.ruleEnabled">
                              <span style="font-weight:800;">规则八:</span>
                              <span>连续</span>
                              <span><InputNumber v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE_2.ruleItemV1" :max="999" :min="0" size='small' style="width:55px;"></InputNumber></span>
                              <span>点落在中心线两侧但并未在一倍标准差以内</span>
                              </Checkbox>
                          </Col>
                      </Row>
                    </TabPane>
                </Tabs>
            </Col>
          </Row>
        </div>
        <div slot="footer">
            <Button v-if="permsBtn.INSERT_RULE" type="primary" size="large" @click="modalOk">确定</Button>
            <Button type="text" size="large" @click="RankNo">取消</Button>
        </div>
        <!-- <Spin v-if="editModal.dataLoading" fix size="large"></Spin> -->

      </Modal>
    </div>
      <!-- 修改 -->
      <div class="arrangement-dialog-from">
        <Modal
          :title="i18n.t('quality.mgdr')"
          v-model="editModal.showtwo"
          :mask-closable="false"
          :width="600" >
            <Row type="flex" :gutter="24" style="margin-bottom:15px">
              <i-col span="12">
              <span>{{$t("quality.ruleName")}}</span>
              <i-input :disabled="noPermsDis" v-model="ruleName" :placeholder="i18n.t('quality.pe')" style="width: 100%" ></i-input>
              </i-col>
              <!-- ********** 注意 ************* -->
              <!-- 隐藏单双图判读规则 后期做修改只需要删除 v-show 即可-->
              <i-col span="12">
                <!-- <span>{{$t("quality.ti")}}</span>
                <Select :disabled="noPermsDis" v-model="decide">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    
                </Select> -->
                <span>{{$t("quality.remarks")}}</span>
              <i-input :disabled="noPermsDis" v-model="ruleRemark" style="width: 100%;"></i-input>
              </i-col>
            </Row>
            <!-- <Row type="flex" :gutter="24" style="margin-bottom:15px">
              <i-col span="24">
              <span>{{$t("quality.remarks")}}</span>
              <i-input :disabled="noPermsDis" v-model="ruleRemark" style="width: 100%;"></i-input>
              </i-col>
            </Row> -->
            <!-- <Row type="flex" :gutter="24">
              <i-col span="12">
              <Checkbox :disabled="noPermsDis" v-model="isDefault2">默认判读规则</Checkbox>
              </i-col>
            </Row> -->
            <div class="ruleset">
              <Row :gutter="32">
                <Col span="24" class="demo-tabs-style1">
                    <!-- <Tabs type="card">
                      <TabPane :label="i18n.t('quality.fi1')"> -->
                          <Row style="margin-bottom:10px;">
                            <Col span="24">
                              <Checkbox :disabled='true' true-value='1' false-value='0' v-model="ruleOne">
                                <span style="font-weight:800;">{{$t("quality.r1")}}:</span>
                                <span>{{$t("quality.r1txt")}}</span>
                              </Checkbox>
                            </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_SAME_SIDE.ruleEnabled">
                                  <span style="font-weight:800;">{{$t("quality.r2")}}</span>
                                  <span>{{$t("quality.rtxt1")}}</span>
                                  <span><InputNumber :max="999" :min="0" :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_SAME_SIDE.ruleItemV1" class="num" style="width:55px;" size='small'></InputNumber></span>
                                  <span>{{$t("quality.r2txt")}}</span>
                                </Checkbox>
                              </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_UP_OR_DOWN.ruleEnabled">
                                  <span style="font-weight:800;">{{$t("quality.r3")}}</span>
                                  <span>{{$t("quality.rtxt1")}}</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_UP_OR_DOWN.ruleItemV1" size='small' style="width:55px;"></InputNumber></span>
                                  <span>{{$t("quality.r3txt")}}</span>
                                </Checkbox>
                              </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_ALTERNATE_UP_AND_DOWN.ruleEnabled">
                                  <span style="font-weight:800;">{{$t("quality.r4")}}</span>
                                  <span>{{$t("quality.rtxt1")}}</span>
                                  <span><InputNumber :max="999" :min="0" v-model="items.DIAGRAM_ALTERNATE_UP_AND_DOWN.ruleItemV1" size='small' style="width:55px;"></InputNumber></span>
                                  <span>{{$t("quality.r4txt")}}</span>
                                </Checkbox>
                              </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleEnabled">
                                  <span style="font-weight:800;">{{$t("quality.r5")}}</span>
                                  <span>{{$t("quality.rtxt1")}}</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleItemV1" size='small' style="width:55px;"></InputNumber></span>
                                  <span>{{$t("quality.r5txt2")}}</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleItemV2" size='small' style="width:55px;"></InputNumber></span>
                                  <span>{{$t("quality.r5txt3")}}</span>
                                </Checkbox>
                              </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleEnabled">
                                  <span style="font-weight:800;">{{$t("quality.r6")}}</span>
                                  <span>{{$t("quality.rtxt1")}}</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleItemV1" size='small' style="width:55px;"></InputNumber></span>
                                  <span>{{$t("quality.r6txt2")}}</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleItemV2" size='small' style="width:55px;"></InputNumber></span>
                                  <span>{{$t("quality.r6txt3")}}</span>
                                </Checkbox>
                              </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE.ruleEnabled">
                                  <span style="font-weight:800;">{{$t("quality.r7")}}</span>
                                  <span>{{$t("quality.rtxt1")}}</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE.ruleItemV1" size='small' style="width:55px;"></InputNumber></span>
                                  <span>{{$t("quality.r7txt")}}</span>
                                </Checkbox>
                              </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE.ruleEnabled">
                                  <span style="font-weight:800;">{{$t("quality.r8")}}</span>
                                  <span>{{$t("quality.rtxt1")}}</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE.ruleItemV1" size='small' style="width:55px;"></InputNumber></span>
                                  <span>{{$t("quality.r8txt")}}</span>
                                </Checkbox>
                              </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="true" true-value='1' false-value='0' v-model="rule9">
                                  <span style="font-weight:800;">{{$t("quality.r9")}}</span>
                                  <span>{{$t("quality.r9txt")}}</span>
                                </Checkbox>
                              </Col>
                          </Row>
                     <!--  </TabPane>

                        <TabPane label="图形判读二" v-if="this.decide == 2 ? true : false" >
                          <Row style="margin-bottom:10px;">
                            <Col span="24">
                              <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_OUT_TRIPLE_2.ruleEnabled">
                                <span style="font-weight:800;">规则一:</span>
                                <span>有一点落在三倍标准差以外</span>
                              </Checkbox>
                            </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_SAME_SIDE_2.ruleEnabled">
                                  <span style="font-weight:800;">规则二:</span>
                                  <span>连续</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_SAME_SIDE_2.ruleItemV1" size='small' style="width:55px;"></InputNumber></span>
                                  <span>点落在管制中心线同一侧</span>
                                  </Checkbox>
                              </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_UP_OR_DOWN_2.ruleEnabled">
                                  <span style="font-weight:800;">规则三:</span>
                                  <span>连续</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_UP_OR_DOWN_2.ruleItemV1" size='small' style="width:55px;"></InputNumber></span>
                                  <span>点持续上升或下降</span>

                                </Checkbox>
                              </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_ALTERNATE_UP_AND_DOWN_2.ruleEnabled">
                                  <span style="font-weight:800;">规则四:</span>
                                  <span>连续</span>
                                  <span><InputNumber :max="999" :min="0" v-model="items.DIAGRAM_ALTERNATE_UP_AND_DOWN_2.ruleItemV1" size='small' style="width:55px;"></InputNumber></span>
                                  <span>点交替上下跳动</span>
                                  </Checkbox>
                              </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2.ruleEnabled">
                                  <span style="font-weight:800;">规则五:</span>
                                  <span>连续</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2.ruleItemV1" size='small' style="width:55px;"></InputNumber></span>
                                  <span>点中有</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2.ruleItemV2" size='small' style="width:55px;"></InputNumber></span>
                                  <span>点落在中心线同侧二倍标准差以外</span>
                                  </Checkbox>
                              </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2.ruleEnabled">
                                  <span style="font-weight:800;">规则六:</span>
                                  <span>连续</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2.ruleItemV1" size='small' style="width:55px;"></InputNumber></span>
                                  <span>点中有</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2.ruleItemV2" size='small' style="width:55px;"></InputNumber></span>
                                  <span>点落在中心线同侧一倍标准差以外</span>
                                  </Checkbox>
                              </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE_2.ruleEnabled">
                                  <span style="font-weight:800;">规则七:</span>
                                  <span>连续</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE_2.ruleItemV1" size='small' style="width:55px;"></InputNumber></span>
                                  <span>点落在中心线两侧的一倍标准差以内</span>
                                  </Checkbox>
                              </Col>
                          </Row>
                          <Row style="margin-bottom:10px;">
                              <Col span="24">
                                <Checkbox :disabled="noPermsDis" true-value='1' false-value='0' v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE_2.ruleEnabled">
                                  <span style="font-weight:800;">规则八:</span>
                                  <span>连续</span>
                                  <span><InputNumber :max="999" :min="0"  :disabled="noPermsDis" v-model="items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE_2.ruleItemV1" size='small' style="width:55px;"></InputNumber></span>
                                  <span>点落在中心线两侧但并未在一倍标准差以内</span>
                                  </Checkbox>
                              </Col>
                          </Row>
                        </TabPane>
                    </Tabs> -->
                </Col>
              </Row>
            </div>
            <div slot="footer">
              <!-- <Button type="primary" size="large">确定</Button>
              <Button type="text" size="large">取消</Button> -->
              <Button v-if="permsBtn.UPDATE_RULE" type="primary" size="large" @click="restoreDefaultRules">{{$t("quality.rdr")}}</Button>
              <Button v-if="permsBtn.UPDATE_RULE" type="primary" size="large" @click="altermodalOk">{{$t("quality.confirm")}}</Button>
              <Button type="text" size="large" @click="RankNotwo">{{$t("quality.cancel")}}</Button>
            </div>
          <!-- <Spin v-if="editModal.dataLoading" fix size="large"></Spin> -->
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
        headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        ruleOne:"1",
        rule9:'1',
        data:[
        ],
        tableEditDis:true,
        editModal:{
          dataLoading:true,
          item:{},
          show:false,
          showtwo:false,
          requesting:false
        },
        cityList: [
          {value: '1',label: '单图判读'},
          {value: '2',label: '双图判读'}
          ],
          decide:'1',
          rule1:0,
        category:[],
        table:{
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
              // width:40,
              minWidth:40,
              maxWidth:40
            },{title: i18n.t("quality.no"),
              width:50,
              className:'tablePadding',
              align: 'center',
              render:vm.$iqis.utils.tableHelper.buildIndexColumnRender(vm),
              // minWidth:80,
              // maxWidth:80
            },
            {
              title: i18n.t("quality.ruleName"),
              className:'tablePadding',
              width: 150,
              minWidth:150,
              ellipsis:true,
              key: 'ruleName'
            },{
              title:  i18n.t("quality.remarks"),
              className:'tablePadding',
              minWidth:100,
              // width:700,
              ellipsis:true,
              key: 'ruleRemark'
            }
          ]
        },
        search: {
          query: "",
          queryType: "",
          selectType:null,
          data: {
            searchTypes: [
              {
                label:  i18n.t("quality.sa"),
                value: ""
              }, {
                label:  i18n.t("quality.ruleName"),
                value: "ruleName"
              },{
                label:  i18n.t("quality.remarks"),
                value: "ruleRemark"
              }
            ]
          }
        },

         "attrs": {"DECIDE_LIMIT":'1'},
        "isDefault": '0',
        isDefault2:false,
        itemsSingle:{
          //规则一（图一）
          DIAGRAM_OUT_TRIPLE:{ruleItemKey: "DIAGRAM_OUT_TRIPLE", ruleEnabled: '1'},
          //规则二
          DIAGRAM_CONTINUOUS_SAME_SIDE:{ruleItemKey: "DIAGRAM_CONTINUOUS_SAME_SIDE", ruleEnabled: '0', ruleItemV1: 0},
          //规则三
          DIAGRAM_CONTINUOUS_UP_OR_DOWN:{ruleItemKey: "DIAGRAM_CONTINUOUS_UP_OR_DOWN", ruleEnabled: '0', ruleItemV1: 0},
          //规则四
          DIAGRAM_ALTERNATE_UP_AND_DOWN:{ruleItemKey: "DIAGRAM_ALTERNATE_UP_AND_DOWN", ruleEnabled: '0', ruleItemV1: 0},
          //规则五
          DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE", ruleEnabled: '0', ruleItemV1: 0, ruleItemV2: 0},
          //规则六
          DIAGRAM_CONTINUOUS_SOME_OUT_ONE:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_ONE", ruleEnabled: '0', ruleItemV1: 0, ruleItemV2: 0},
          //规则七
          DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE", ruleEnabled: '0', ruleItemV1: 0},
          //规则八
          DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE", ruleEnabled: '0', ruleItemV1: 0},
          //规则九
          DIAGRAM_OUT_SPECIFICATION_LIMIT:{ruleItemKey: "DIAGRAM_OUT_SPECIFICATION_LIMIT", ruleEnabled: '1'},

        },
        itemsBotn:{
          //规则一（图一）
          DIAGRAM_OUT_TRIPLE:{ruleItemKey: "DIAGRAM_OUT_TRIPLE", ruleEnabled: '1'},
          //规则二
          DIAGRAM_CONTINUOUS_SAME_SIDE:{ruleItemKey: "DIAGRAM_CONTINUOUS_SAME_SIDE", ruleEnabled: '0', ruleItemV1: 0},
          //规则三
          DIAGRAM_CONTINUOUS_UP_OR_DOWN:{ruleItemKey: "DIAGRAM_CONTINUOUS_UP_OR_DOWN", ruleEnabled: '0', ruleItemV1: 0},
          //规则四
          DIAGRAM_ALTERNATE_UP_AND_DOWN:{ruleItemKey: "DIAGRAM_ALTERNATE_UP_AND_DOWN", ruleEnabled: '0', ruleItemV1: 0},
          //规则五
          DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE", ruleEnabled: '0', ruleItemV1: 0, ruleItemV2: 0},
          //规则六
          DIAGRAM_CONTINUOUS_SOME_OUT_ONE:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_ONE", ruleEnabled: '0', ruleItemV1: 0, ruleItemV2: 0},
          //规则七
          DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE", ruleEnabled: '0', ruleItemV1: 0},
          //规则八
          DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE", ruleEnabled: '0', ruleItemV1: 0},
          //规则九
          DIAGRAM_OUT_SPECIFICATION_LIMIT:{ruleItemKey: "DIAGRAM_OUT_SPECIFICATION_LIMIT", ruleEnabled: '1'},

          //规则一（图二）
          DIAGRAM_OUT_TRIPLE_2: {ruleItemKey: "DIAGRAM_OUT_TRIPLE_2", ruleEnabled: 0},
          //规则二
          DIAGRAM_CONTINUOUS_SAME_SIDE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_SAME_SIDE_2", ruleEnabled: '0', ruleItemV1: 0},
          //规则三
          DIAGRAM_CONTINUOUS_UP_OR_DOWN_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_UP_OR_DOWN_2", ruleEnabled: '0', ruleItemV1: 0},
          //规则四
          DIAGRAM_ALTERNATE_UP_AND_DOWN_2:{ruleItemKey: "DIAGRAM_ALTERNATE_UP_AND_DOWN_2", ruleEnabled: '0', ruleItemV1: 0},
          //规则五
          DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2", ruleEnabled: '0', ruleItemV1: 0, ruleItemV2: 0},
          //规则六
          DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2", ruleEnabled: '0', ruleItemV1: 0, ruleItemV2: 0},
          //规则七
          DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE_2", ruleEnabled: '0', ruleItemV1: 0},
          //规则八
          DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE_2", ruleEnabled: '0', ruleItemV1: 0}
        },
        items: {
          //规则一（图一）
          DIAGRAM_OUT_TRIPLE:{ruleItemKey: "DIAGRAM_OUT_TRIPLE", ruleEnabled: '1'},
          //规则二
          DIAGRAM_CONTINUOUS_SAME_SIDE:{ruleItemKey: "DIAGRAM_CONTINUOUS_SAME_SIDE", ruleEnabled: '0', ruleItemV1: 0},
          //规则三
          DIAGRAM_CONTINUOUS_UP_OR_DOWN:{ruleItemKey: "DIAGRAM_CONTINUOUS_UP_OR_DOWN", ruleEnabled: '0', ruleItemV1: 0},
          //规则四
          DIAGRAM_ALTERNATE_UP_AND_DOWN:{ruleItemKey: "DIAGRAM_ALTERNATE_UP_AND_DOWN", ruleEnabled: '0', ruleItemV1: 0},
          //规则五
          DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE", ruleEnabled: '0', ruleItemV1: 0, ruleItemV2: 0},
          //规则六
          DIAGRAM_CONTINUOUS_SOME_OUT_ONE:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_ONE", ruleEnabled: '0', ruleItemV1: 0, ruleItemV2: 0},
          //规则七
          DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE", ruleEnabled: '0', ruleItemV1: 0},
          //规则八
          DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE", ruleEnabled: '0', ruleItemV1: 0},
          //规则九
          DIAGRAM_OUT_SPECIFICATION_LIMIT:{ruleItemKey: "DIAGRAM_OUT_SPECIFICATION_LIMIT", ruleEnabled: '1'},
          
          /* //规则一（图二）
          DIAGRAM_OUT_TRIPLE_2: {ruleItemKey: "DIAGRAM_OUT_TRIPLE_2", ruleEnabled: 0},
          //规则二
          DIAGRAM_CONTINUOUS_SAME_SIDE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_SAME_SIDE_2", ruleEnabled: 0, ruleItemV1: 0},
          //规则三
          DIAGRAM_CONTINUOUS_UP_OR_DOWN_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_UP_OR_DOWN_2", ruleEnabled: 0, ruleItemV1: 0},
          //规则四
          DIAGRAM_ALTERNATE_UP_AND_DOWN_2:{ruleItemKey: "DIAGRAM_ALTERNATE_UP_AND_DOWN_2", ruleEnabled: 0, ruleItemV1: 0},
          //规则五
          DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2", ruleEnabled: 0, ruleItemV1: 0, ruleItemV2: 0},
          //规则六
          DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2", ruleEnabled: 0, ruleItemV1: 0, ruleItemV2: 0},
          //规则七
          DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE_2", ruleEnabled: 0, ruleItemV1: 0},
          //规则八
          DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE_2", ruleEnabled: 0, ruleItemV1: 0} */



        },
        "itemstwo": {
          //规则一（图一）
          DIAGRAM_OUT_TRIPLE:{ruleItemKey: "DIAGRAM_OUT_TRIPLE", ruleEnabled: 0},
          //规则二
          DIAGRAM_CONTINUOUS_SAME_SIDE:{ruleItemKey: "DIAGRAM_CONTINUOUS_SAME_SIDE", ruleEnabled: 0, ruleItemV1: 0},
          //规则三
          DIAGRAM_CONTINUOUS_UP_OR_DOWN:{ruleItemKey: "DIAGRAM_CONTINUOUS_UP_OR_DOWN", ruleEnabled: 0, ruleItemV1: 0},
          //规则四
          DIAGRAM_ALTERNATE_UP_AND_DOWN:{ruleItemKey: "DIAGRAM_ALTERNATE_UP_AND_DOWN", ruleEnabled: 0, ruleItemV1: 0},
          //规则五
          DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE", ruleEnabled: 0, ruleItemV1: 0, ruleItemV2: 0},
          //规则六
          DIAGRAM_CONTINUOUS_SOME_OUT_ONE:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_ONE", ruleEnabled: 0, ruleItemV1: 0, ruleItemV2: 0},
          //规则七
          DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE", ruleEnabled: 0, ruleItemV1: 0},
          //规则八
          DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE", ruleEnabled: 0, ruleItemV1: 0},
          //规则九
          DIAGRAM_OUT_SPECIFICATION_LIMIT:{ruleItemKey: "DIAGRAM_OUT_SPECIFICATION_LIMIT", ruleEnabled: 0},

          //规则一（图二）
          DIAGRAM_OUT_TRIPLE_2: {ruleItemKey: "DIAGRAM_OUT_TRIPLE_2", ruleEnabled: 0},
          //规则二
          DIAGRAM_CONTINUOUS_SAME_SIDE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_SAME_SIDE_2", ruleEnabled: 0, ruleItemV1: 0},
          //规则三
          DIAGRAM_CONTINUOUS_UP_OR_DOWN_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_UP_OR_DOWN_2", ruleEnabled: 0, ruleItemV1: 0},
          //规则四
          DIAGRAM_ALTERNATE_UP_AND_DOWN_2:{ruleItemKey: "DIAGRAM_ALTERNATE_UP_AND_DOWN_2", ruleEnabled: 0, ruleItemV1: 0},
          //规则五
          DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2", ruleEnabled: 0, ruleItemV1: 0, ruleItemV2: 0},
          //规则六
          DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2", ruleEnabled: 0, ruleItemV1: 0, ruleItemV2: 0},
          //规则七
          DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE_2", ruleEnabled: 0, ruleItemV1: 0},
          //规则八
          DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE_2:{ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE_2", ruleEnabled: 0, ruleItemV1: 0}
        },
        "ruleId": 0,
        "ruleName": "",
        "ruleRemark": "",
        "ruleType": "DIAGRAM_DECIDE",
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
    watch: {
      
      decide(){
        let that = this;
        if(that.decide == '2'){
          //规则一（图二）
          that.items.DIAGRAM_OUT_TRIPLE_2 =  {ruleItemKey: "DIAGRAM_OUT_TRIPLE_2", ruleEnabled: '0'};
          //规则二
          that.items.DIAGRAM_CONTINUOUS_SAME_SIDE_2 = {ruleItemKey: "DIAGRAM_CONTINUOUS_SAME_SIDE_2", ruleEnabled: '0', ruleItemV1: 0};
          //规则三
          that.items.DIAGRAM_CONTINUOUS_UP_OR_DOWN_2 = {ruleItemKey: "DIAGRAM_CONTINUOUS_UP_OR_DOWN_2", ruleEnabled: '0', ruleItemV1: 0};
          //规则四
          that.items.DIAGRAM_ALTERNATE_UP_AND_DOWN_2 = {ruleItemKey: "DIAGRAM_ALTERNATE_UP_AND_DOWN_2", ruleEnabled: '0', ruleItemV1: 0};
          //规则五
          that.items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2 = {ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2", ruleEnabled: '0', ruleItemV1: 0, ruleItemV2: 0};
          //规则六
          that.items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2 = {ruleItemKey: "DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2", ruleEnabled: '0', ruleItemV1: 0, ruleItemV2: 0};
          //规则七
          that.items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE_2 = {ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE_2", ruleEnabled: '0', ruleItemV1: 0};
          //规则八
          that.items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE_2 = {ruleItemKey: "DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE_2", ruleEnabled: '0', ruleItemV1: 0}
        }
        if(that.decide == '1' && (that.items.DIAGRAM_OUT_TRIPLE_2 != '' || that.items.DIAGRAM_OUT_TRIPLE_2 != undefined || that.items.DIAGRAM_OUT_TRIPLE_2 != null)){
          delete that.items.DIAGRAM_OUT_TRIPLE_2;
          //规则二
          delete that.items.DIAGRAM_CONTINUOUS_SAME_SIDE_2;
          //规则三
          delete that.items.DIAGRAM_CONTINUOUS_UP_OR_DOWN_2;
          //规则四
          delete that.items.DIAGRAM_ALTERNATE_UP_AND_DOWN_2;
          //规则五
          delete that.items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE_2;
          //规则六
          delete that.items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE_2;
          //规则七
          delete that.items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE_2;
          //规则八
          delete that.items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE_2
        }
      }
    },
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
    },

    computed:{
      treeStyle(){
        return {
          "height":(Math.max(this.table.pager.rows,10)*40+54)+"px"
        };
      }
    },

    methods:{
      
      onPopUp(){
        let that = this;
        if((that.editModal.showtwo&&that.permsBtn.UPDATE_RULE)||(that.editModal.show&&that.permsBtn.INSERT_RULE)){
          that.noPermsDis=false;
        }else{
          that.noPermsDis=true;
        }
      },
      pageSizeChange(pageSize){
        this.table.pager.current = 1;
        this.table.pager.limit = pageSize;
        this.refreshData();

      },
      pageChange(page){
        this.table.pager.current = page;
        this.refreshData();
      },
      treeSelectChange(n){
        // console.log(n);
        if(n){
          this.search.selectType = n.inspectionTypeId;
        }else{
          this.search.selectType = null;
        }
        this.table.pager.current = 1;
        this.refreshData();

      },
      refreshData(){
        this.table.loading = true;
        let params = {page:this.table.pager.current, limit:this.table.pager.limit};

        if(this.search.selectType){
          params.parentId = this.search.selectType;
        }
        params.query = this.search.query;
        params.fieldName = this.search.queryType;
        let that = this;
        this.$http.get("/rule-DIAGRAM_DECIDE",{params:params}).then(function (resp) {
          that.data = resp.data;
          if(resp.pagerInfo){
            that.table.pager.total = resp.pagerInfo.total;
          }
          that.table.loading = false;
          that.tableEditDis=true;
        })

      },
      tableSelectChange(selection){
        this.table.selected = selection && selection.length > 0;
        if(selection.length!=1){
          this.tableEditDis=true;
        }else{
          this.tableEditDis=false;
        }
      },
       //添加
        showModal(){
        // let that = this;
        // that.editModal.show = true;
        let that = this;
        that.items=that.itemstwo
        that.ruleName = ''
        that.serialNumber = ''
        that.ruleRemark = ''
        that.isDefault2 = false
        that.decide = 0
        that.editModal.show = true;
        this.onPopUp();
        },
         RankNo(){
        this.editModal.show=false;
        },
        RankNotwo(){
          this.editModal.showtwo = false;
        },
        //添加数据
      modalOk(){
        let that = this;
        let params = [
          {type: 'Empty', title: i18n.t("quality.ruleName"), value: that.ruleName},
          {type: 'Name', title: i18n.t("quality.ruleName"), value: that.ruleName},
          {type: 'Word600', title: i18n.t("quality.remarks"), value: that.ruleRemark},
          {type: 'Num999', title: i18n.t("quality.r2"), value: that.items.DIAGRAM_CONTINUOUS_SAME_SIDE.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.r3"), value: that.items.DIAGRAM_CONTINUOUS_UP_OR_DOWN.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.r4"), value: that.items.DIAGRAM_ALTERNATE_UP_AND_DOWN.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.r5"), value: that.items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.r5"), value: that.items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleItemV2},
          {type: 'Num999', title: i18n.t("quality.r6"), value: that.items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.r6"), value: that.items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleItemV2},
          {type: 'Num999', title: i18n.t("quality.r7"), value: that.items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE.ruleItemV1},
          {type: 'Num999', title: i18n.t("quality.r8"), value: that.items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE.ruleItemV1},
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
          ruleName:that.ruleName,
          serialNumber:that.serialNumber,
          ruleRemark:that.ruleRemark,
          isDefault:that.isDefault,
          ruleType:that.ruleType,
          items:that.items,
          attrs:that.attrs
        }
        // console.log(newData,"ppppppppp");
        
        that.$http.post('/rule',newData,that.headers).then(function (reps) {
         that.$Message.success( i18n.t("quality.as"),);
          that.refreshData();
         })

        that.editModal.show = false;

      },
       //修改
       editSelectRow(e){
        let that = this;
        
        let selectedRowruleId = that.$refs.pageTable.getSelection()
        // console.log(selectedRowruleId[0].ruleId);

        if(!selectedRowruleId || selectedRowruleId.length != 1){
          that.$Notice.warning({title:  i18n.t("quality.cbm")});
          return;
        }else{
          // that.editModal.showtwo = true;
          // console.log(selectedRowruleId[0].items);
          that.$http.get("/rule/"+selectedRowruleId[0].ruleId).then(function(reqs){
            that.editModal.showtwo = true;
            that.onPopUp();
                  var selectedRow = reqs.data;
                  // console.log(selectedRow.items,6666666666);
                  
                  let a = selectedRow.items
                  for(let i in a){
                    a[i].ruleEnabled = String(a[i].ruleEnabled)
                  }
                  
                  that.items = selectedRow.items;
                  that.attrs = selectedRow.attrs;
                  that.ruleName = selectedRow.ruleName;
                  that.ruleRemark = selectedRow.ruleRemark;
                  that.isDefault = selectedRow.isDefault;
                  

          })
        }
      },
      onDBClick(o,i){
        let that = this;
        
        that.$http.get("/rule/"+o.ruleId).then(function(reqs){
            that.ruleId = o.ruleId;
            that.editModal.showtwo = true;
            that.onPopUp();
                  var selectedRow = reqs.data;
                  // console.log(selectedRow);
                  that.items = selectedRow.items;
                  that.attrs = selectedRow.attrs;
                  that.ruleName = selectedRow.ruleName;
                  that.ruleRemark = selectedRow.ruleRemark;
                  that.isDefault = selectedRow.isDefault;
          })
      },
      //恢复默认规则
      restoreDefaultRules(){
        let that = this;
        that.ruleName = i18n.t("quality.gr")
        that.decide = '1';
        that.ruleRemark = i18n.t("quality.iggr")
            that.items.DIAGRAM_CONTINUOUS_SAME_SIDE.ruleItemV1 = '9'
            that.items.DIAGRAM_CONTINUOUS_UP_OR_DOWN.ruleItemV1 = '9'
            that.items.DIAGRAM_ALTERNATE_UP_AND_DOWN.ruleItemV1 = '14'
            that.items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleItemV1 = '3'
            that.items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleItemV2 = '2'
            that.items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleItemV1 = '5'
            that.items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleItemV2 = '4'
            that.items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE.ruleItemV1 = '15'
            that.items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE.ruleItemV1 = '8'
            
            that.items.DIAGRAM_CONTINUOUS_SAME_SIDE.ruleEnabled = '0'
            that.items.DIAGRAM_CONTINUOUS_UP_OR_DOWN.ruleEnabled = '0'
            that.items.DIAGRAM_ALTERNATE_UP_AND_DOWN.ruleEnabled = '0'
            that.items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleEnabled = '0'
            that.items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleEnabled = '0'
            that.items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE.ruleEnabled = '0'
            that.items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE.ruleEnabled = '0'
        
      },
      //修改数据
      altermodalOk(){
        let that = this;
        let params = [];
          params = [
            {type: 'Empty', title: i18n.t("quality.ruleName"), value: that.ruleName},
            {type: 'Name', title: i18n.t("quality.ruleName"), value: that.ruleName},
            {type: 'Word600', title: i18n.t("quality.remarks"), value: that.ruleRemark},
            {type: 'Num999', title: i18n.t("quality.r2"), value: that.items.DIAGRAM_CONTINUOUS_SAME_SIDE.ruleItemV1},
            {type: 'Num999', title: i18n.t("quality.r3"), value: that.items.DIAGRAM_CONTINUOUS_UP_OR_DOWN.ruleItemV1},
            {type: 'Num999', title: i18n.t("quality.r4"), value: that.items.DIAGRAM_ALTERNATE_UP_AND_DOWN.ruleItemV1},
            {type: 'Num999', title: i18n.t("quality.r5"), value: that.items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleItemV1},
            {type: 'Num999', title: i18n.t("quality.r5"), value: that.items.DIAGRAM_CONTINUOUS_SOME_OUT_DOUBLE.ruleItemV2},
            {type: 'Num999', title: i18n.t("quality.r6"), value: that.items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleItemV1},
            {type: 'Num999', title: i18n.t("quality.r6"), value: that.items.DIAGRAM_CONTINUOUS_SOME_OUT_ONE.ruleItemV2},
            {type: 'Num999', title: i18n.t("quality.r7"), value: that.items.DIAGRAM_CONTINUOUS_TWO_SIDES_BY_ONE.ruleItemV1},
            {type: 'Num999', title: i18n.t("quality.r8"), value: that.items.DIAGRAM_CONTINUOUS_TWO_SIDES_OUT_ONE.ruleItemV1},
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

          let selectedRow = that.$refs.pageTable.getSelection()
          // console.log(selectedRow,8989887);
          
          var rulenewData = {
            "ruleId":that.ruleId,
            "attrs": that.attrs,
            "isDefault": that.isDefault,
            "items": that.items,
            "ruleName": that.ruleName,
            "ruleRemark": that.ruleRemark,
            "ruleType": that.ruleType,
            "serialNumber": that.serialNumber
          }
          
          that.$http.put('/rule/',rulenewData,that.headers).then(function(reqs){
            that.$Message.success(i18n.t("quality.ats"));
            that.refreshData();
            that.editModal.showtwo = false;
            that.$Message.success();

          })

      },
      //删除数据
      deleteTreeNode(){
        let that = this;

        let sns = that.$refs.pageTable.getSelection();
        if (sns.length == 0) {
            this.$Notice.warning({title: i18n.t("quality.cbm")});
            return;
        }else if(sns.length > 1){
          for (let i = 0; i < sns.length; i++) {
             that.$http.delete("/rule/"+sns[i].ruleId).then(function (resp) {

              });
          }
              that.$Message.success(i18n.t("quality.ds"));
              //删除成功后刷新数据
              that.refreshData();
        }else{
           that.$http.delete("/rule/"+sns[0].ruleId).then(function (resp) {
          that.$Message.success(i18n.t("quality.ds"));
          //删除成功后刷新数据
          that.refreshData();
          });
        }
      },
    }
  }

</script>
<style scoped>
  .ruleset{
      width: 100%;
      /* height: 20%; */
      /* background-color: rgb(235, 230, 230); */
      margin-top: 15px;
      /* padding: 0 14px; */
      box-sizing: border-box;
    }
</style>
