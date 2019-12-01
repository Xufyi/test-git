<template>
    <div>
        <div class="iqis-page-search-row">
            <div class="iqis-page-search-bar-item" style="flex:0 0 220px;">
                <DatePicker type="daterange" v-model="search.dates" :placeholder="i18n.t('statistical.dateFilter')" style="width: 210px"></DatePicker>
            </div>
            <div class="iqis-page-search-bar-item" style="flex:0 0 280px;">
                <i-input v-model="search.query" class="lineheight34" clearable style="width: 280px">
                <Select v-model="search.fieldName" :placeholder="i18n.t('statistical.searchAll')" slot="prepend" style="width: 110px;text-align: left">
                    <Option v-for="(item,index) in search.data.searchTypes" :key="index" :value="item.value">{{item.label}}</Option>
                </Select>
                </i-input>
            </div>
            <div class="iqis-page-search-bar-item"  style="flex:1;padding-left: 8px; font-size:0;">
                <Button style="margin-right:8px;" @click="refreshData" type="primary">{{$t('statistical.search')}}</Button>
                <Button type="ghost" @click="reset">{{$t('statistical.reset')}}</Button>
            </div>
        </div>
        <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
                <Button style="margin-right:8px;" type="ghost" @click="add" icon="plus">{{$t('statistical.add')}}</Button>
                <Button style="margin-right:8px;" :disabled="tableEditDis" type="ghost" @click="edit" icon="edit">{{$t('statistical.edit')}}</Button>
                <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                confirm
                :title="i18n.t('statistical.confirmDelete')"
                placement="bottom-start"
                @on-ok="deleteKappa">
                <Button type="ghost" :disabled="sub" icon="trash-a">{{$t('statistical.delete')}}</Button>
                </Poptip>
            </div>
            <div class="iqis-page-tool-second">
              <Button type="text"  icon="refresh" @click="reset">{{$t('statistical.refreshData')}}</Button>
            </div>
        </div>
        <div>
            <Table ref="pageTable" :columns="columns1" :data="data1" :loading="search.loading" border v-drag-table-column="columns1" @on-selection-change="tableSelectChange" @on-row-dblclick="onDBClick" class="tableCustom"></Table>
            <div style="padding: 20px 0 20px 0px;">
              <Page id="pageId" :total="page.total" :current="page.current" :page-size="page.limit" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return{
            i18n:window.i18n,
            tableEditDis:true,
            sub:true,
            page:{
                total:0,
                limit:10,
                current:1,
            },
            search: {
                query: "",
                loading:true,
                fieldName: "",
                dates:[],
                data: {
                    searchTypes: [
                        {label: i18n.t('statistical.searchAll'),value: ""},  
                        {label: i18n.t('statistical.analysisNum'),value: "no"},
                        {label: i18n.t('statistical.deviceCode'),value: "chkDevNo"},
                        {label: i18n.t('statistical.deviceName'),value: "chkDevName"},
                        {label: i18n.t('statistical.ProdQuantity'),value: "productNum"},
                        {label: i18n.t('statistical.A'),value: "reviewer1Name"},
                        {label: i18n.t('statistical.B'),value: "reviewer2Name"},
                        {label: i18n.t('statistical.C'),value: "reviewer3Name"},
                        {label: i18n.t('statistical.causeIdentify'),value: "causeAnalysis"},
                    ]
                }
            },
            data1:[],
            columns1:[
                {
                    type: 'selection',
                    align: 'center',
                    width:40,
                    minWidth:40,
                    maxWidth:60,
                    ellipsis:true,
                    fixed: 'left'
                },
                {
                    title:i18n.t('statistical.analysisTime'),
                    align: 'center',
                    width:130,
                    minWidth:100,
                    maxWidth:150,
                    ellipsis:true,
                    key:'analysisTime',
                    fixed: 'left',
                    render:function(h,data){
                        let value = data.row.analysisTime;
                        let str = "-"
                        if(value){
                            var unixTimestamp = new Date(value);
                            str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                        }
                        return h("span",str);
                    }
                },
                {
                    title:i18n.t('statistical.analysisNum'),
                    align: 'center',
                    width:100,
                    minWidth:100,
                    maxWidth:150,
                    ellipsis:true,
                    key:'no',
                    fixed: 'left'
                },
                {
                    title:i18n.t('statistical.deviceCode'),
                    align: 'center',
                    width:100,
                    minWidth:100,
                    maxWidth:150,
                    ellipsis:true,
                    key:'chkDevNo',
                    fixed: 'left'
                },
                {
                    title:i18n.t('statistical.deviceName'),
                    align: 'center',
                    width:100,
                    minWidth:100,
                    maxWidth:150,
                    ellipsis:true,
                    key:'chkDevName',
                    fixed: 'left'
                },
                // {
                //     title:"工序站点",
                //     align: 'center',
                //     width:80,
                //     minWidth:80,
                //     maxWidth:150,
                //     ellipsis:true,
                // },
                {
                    title:i18n.t('statistical.ProdQuantity'),
                    align: 'center',
                    width:80,
                    minWidth:80,
                    maxWidth:150,
                    ellipsis:true,
                    key:'productNum',
                    fixed: 'left'
                },
                {
                    title:"AB-Kappa",
                    align: 'center',
                    width:80,
                    minWidth:80,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.a_b_kappa',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:"BC-Kappa",
                    align: 'center',
                    width:80,
                    minWidth:80,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.b_c_kappa',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:"AC-Kappa",
                    align: 'center',
                    width:80,
                    minWidth:80,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.a_c_kappa',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:"A-Kappa",
                    align: 'center',
                    width:80,
                    minWidth:80,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.a_standard_kappa',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:"B-Kappa",
                    align: 'center',
                    width:80,
                    minWidth:80,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.b_standard_kappa',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:"C-Kappa",
                    align: 'center',
                    width:80,
                    minWidth:80,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.c_standard_kappa',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:i18n.t('statistical.judgeA'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?80:100,
                    minWidth:this.$store.state.locale=='zh_CN'?80:100,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.a_result',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:i18n.t('statistical.judgeB'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?80:100,
                    minWidth:this.$store.state.locale=='zh_CN'?80:100,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.b_result',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:i18n.t('statistical.judgeC'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?80:100,
                    minWidth:this.$store.state.locale=='zh_CN'?80:100,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.c_result',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:i18n.t('statistical.A'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?80:100,
                    minWidth:this.$store.state.locale=='zh_CN'?80:100,
                    maxWidth:150,
                    ellipsis:true,
                    key:'reviewer1Name'
                },
                {
                    title:i18n.t('statistical.B'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?80:100,
                    minWidth:this.$store.state.locale=='zh_CN'?80:100,
                    maxWidth:150,
                    ellipsis:true,
                    key:'reviewer2Name'
                },
                {
                    title:i18n.t('statistical.C'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?80:100,
                    minWidth:this.$store.state.locale=='zh_CN'?80:100,
                    maxWidth:150,
                    ellipsis:true,
                    key:'reviewer3Name'
                },
                {
                    title:i18n.t('statistical.validityA'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?80:100,
                    minWidth:this.$store.state.locale=='zh_CN'?80:100,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.a_validity',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:i18n.t('statistical.alarmFailureRateA'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?100:150,
                    minWidth:this.$store.state.locale=='zh_CN'?100:150,
                    maxWidth:180,
                    ellipsis:true,
                    key:'paramsMap.a_miss',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:i18n.t('statistical.alarmFalseRateA'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?100:150,
                    minWidth:this.$store.state.locale=='zh_CN'?100:150,
                    maxWidth:180,
                    ellipsis:true,
                    key:'paramsMap.a_wrong',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:i18n.t('statistical.validityB'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?80:100,
                    minWidth:this.$store.state.locale=='zh_CN'?80:100,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.b_validity',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:i18n.t('statistical.alarmFailureRateB'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?100:150,
                    minWidth:this.$store.state.locale=='zh_CN'?100:150,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.b_miss',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:i18n.t('statistical.alarmFalseRateB'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?100:150,
                    minWidth:this.$store.state.locale=='zh_CN'?100:150,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.b_wrong',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:i18n.t('statistical.validityC'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?80:100,
                    minWidth:this.$store.state.locale=='zh_CN'?80:100,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.c_validity',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:i18n.t('statistical.alarmFailureRateC'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?100:150,
                    minWidth:this.$store.state.locale=='zh_CN'?100:150,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.c_miss',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:i18n.t('statistical.alarmFalseRateC'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?100:150,
                    minWidth:this.$store.state.locale=='zh_CN'?100:150,
                    maxWidth:150,
                    ellipsis:true,
                    key:'paramsMap.c_wrong',
                    render:this.$iqis.utils.tableHelper.buildFieldPathCell(this)
                },
                {
                    title:i18n.t('statistical.causeIdentify'),
                    align: 'center',
                    width:this.$store.state.locale=='zh_CN'?100:150,
                    minWidth:this.$store.state.locale=='zh_CN'?100:150,
                    maxWidth:150,
                    ellipsis:true,
                    key:'causeAnalysis',
                },
            ]
        }
    },
    created() {
        this.refreshData();
    },
    methods:{
        add() {
            this.$emit("open-tab","page-statistic-crosstab-add",i18n.t('statistical.addKappaCrosstab'),"page-statistic-crosstab-add",null);
        },
        edit() {
            let selectedRow = this.$refs.pageTable.getSelection()
            this.$emit("open-tab","crosstab-add-"+selectedRow[0].kappaId,i18n.t('statistical.modifyKappa')+"-"+selectedRow[0].productName,"page-statistic-crosstab-add",{kappaId:selectedRow[0].kappaId});
        },
        onDBClick(obj){
            this.$emit("open-tab","crosstab-add-"+obj.kappaId,i18n.t('statistical.modifyKappa')+"-"+obj.productName,"page-statistic-crosstab-add",{kappaId:obj.kappaId});
        },
        tableSelectChange(selection) {
            if(selection.length==1) {
                this.tableEditDis=false;
            }else {
                this.tableEditDis=true;
            }
            if(selection.length>=1) {
                this.sub=false
            }else {
                this.sub=true
            }
        },
        deleteKappa() {
            let that = this
            let ss = this.$refs.pageTable.getSelection();
            if(ss && ss.length > 0){
                let delArr = [];
                for(let i=0;i<ss.length;i++){
                    delArr.push(this.$http.delete("/kappa/"+ss[i].kappaId));
                }
                if(delArr.length > 0){
                    this.$http.all(delArr).then(function (resps) {
                        that.$Message.success(i18n.t('customer.deleteSuccess'));
                        that.reset();
                    });
                }
            }
            that.sub=true
        },
        refreshData() {
            let that = this
            that.search.loading = true;
            let params = {};
            let startDate = '';
            let endDate = '';
            params.page = this.page.current;
            params.limit = this.page.limit;
            if(this.search.dates && this.search.dates[0]){
                startDate = this.$iqis.utils.getDayStart(1,this.search.dates[0]);
                endDate = this.$iqis.utils.getDayEnd(this.search.dates[1]);
                params.query='startDate='+startDate+'&endDate='+endDate+'&field='+that.search.fieldName+'&keyword='+that.search.query;
            }else{
                params.query='field='+that.search.fieldName+'&keyword='+that.search.query;
            }
            this.$http.get("/kappa",{params:params}).then(function (resp) {
                that.search.loading = false;
                that.data1 = resp.data;
                that.page.total=resp.pagerInfo.total
            })
        },
        reset() {
            this.search.query="";
            this.search.fieldName="";
            this.search.dates=[];
            this.refreshData();
            this.pageChange(1);
        },
        pageChange(page) {
            this.page.current = page;
            this.refreshData();
        },
        pageSizeChange(pageSize) {
            this.page.current = 1;
            this.page.limit = pageSize;
            this.refreshData();
        },
    }
}
</script>

