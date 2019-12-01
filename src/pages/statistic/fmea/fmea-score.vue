<template>
    <div>
        <div class="iqis-page-tool-row">
            <div class="iqis-page-tool-primary" style="font-size:0;">
                <Button  v-if="permsBtn.INSERT_FMEA_SCORING" style="margin-right:8px;" type="ghost" @click="add" icon="plus">{{$t('iqc.add')}}</Button>
                <Button  v-if="permsBtn.UPDATE_FMEA_SCORING" style="margin-right:8px;" :disabled="tableEditDis" type="ghost" @click="edit" icon="edit">{{$t('iqc.edit')}}</Button>
                <Poptip  :ok-text="i18n.t('confirm')" :cancel-text="i18n.t('cancel')" 
                confirm
                :title="i18n.t('iqc.confirmDelete')"
                placement="bottom-start"
                @on-ok="deleteScore">
                <Button  v-if="permsBtn.DELETE_FMEA_SCORING" type="ghost" :disabled="sub" icon="trash-a">{{$t('iqc.delete')}}</Button>
                </Poptip>
            </div>
            <div class="iqis-page-tool-second">
              <Button type="text"  icon="refresh" @click="reset" >{{$t('customer.refreshData')}}</Button>
            </div>
        </div>
        <div>
            <Table ref="pageTable" :loading="search.loading" :columns="columns1" :data="data1"  border v-drag-table-column="columns1" @on-selection-change="tableSelectChange" @on-row-dblclick="onDBClick" class="tableCustom"></Table>
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
            search:{
                query: "",
                loading:true,
                fieldName: "",
                data: {
                    searchTypes: [
                        // {label: "搜索全部",value: ""},  
                        // {label: "标准编号",value: "no"},
                        // {label: "标准名称",value: "name"},
                        // {label: "操作人",value: "operatorName"},
                        // {label: "备注",value: "remarks"},
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
                },
                {
                    title:i18n.t('statistical.standardNumber'),
                    align: 'center',
                    width:300,
                    minWidth:300,
                    maxWidth:360,
                    ellipsis:true,
                    key:"no"
                },
                {
                    title:i18n.t('statistical.standardName'),
                    align: 'center',
                    width:300,
                    minWidth:300,
                    maxWidth:360,
                    ellipsis:true,
                    key:"name"
                },
                {
                    title:i18n.t('statistical.operator'),
                    align: 'center',
                    width:200,
                    minWidth:200,
                    maxWidth:220,
                    ellipsis:true,
                    key:"operatorName"
                },
                {
                    title:i18n.t('statistical.operatTime'),
                    align: 'center',
                    width:220,
                    minWidth:220,
                    maxWidth:240,
                    ellipsis:true,
                    key:"createTime",
                    render:function(h,data){
                        let value = data.row.createTime;
                        let str = "-"
                        if(value){
                            var unixTimestamp = new Date(value);
                            str = unixTimestamp.Format("yyyy-MM-dd hh:mm");
                        }
                        return h("span",str);
                    }
                },
                {
                    title:i18n.t('statistical.remarks'),
                    align: 'center',
                    minWidth:200,
                    ellipsis:true,
                    key:"remarks"
                }
            ],
            permsCur:[
                "INSERT_FMEA_SCORING",
                "SELECT_FMEA_SCORING",
                "UPDATE_FMEA_SCORING",
                "DELETE_FMEA_SCORING",
            ],
            permsBtn:{
                "DELETE_FMEA_SCORING":false,
                "SELECT_FMEA_SCORING":false,
                "UPDATE_FMEA_SCORING":false,
                "INSERT_FMEA_SCORING":false,
            },
            noPermsDis:true,
        }
    },
    created() {
        let permsAll = this.$store.state.permissions; 
        this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
        this.refreshData()
    },
    methods:{
        add() {
            this.$emit("open-tab","page-statistic-fmea-score-add",i18n.t('statistical.addScoringCriteria'),"page-statistic-fmea-score-add",null);
        },
        edit() {
            let selectedRow = this.$refs.pageTable.getSelection()
            this.$emit("open-tab","cfmea-score-"+selectedRow[0].scoringStandardId,i18n.t('statistical.edit')+" score-"+selectedRow[0].name,"page-statistic-fmea-score-add",{scoringStandardId:selectedRow[0].scoringStandardId});
        },
        onDBClick(obj){
            this.$emit("open-tab","cfmea-score-"+obj.scoringStandardId,i18n.t('statistical.edit')+" score-"+obj.name,"page-statistic-fmea-score-add",{scoringStandardId:obj.scoringStandardId});
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
        deleteScore() {
            let that = this
            let ss = this.$refs.pageTable.getSelection();
            if(ss && ss.length > 0){
                let delArr = [];
                for(let i=0;i<ss.length;i++){
                    delArr.push(this.$http.delete("/fmea/scoring/"+ss[i].scoringStandardId));
                }
                if(delArr.length > 0){
                    this.$http.all(delArr).then(function (resps) {
                        that.$Message.success(i18n.t('customer.deleteSuccess'));
                        that.reset();
                    });
                }
            }
            that.sub=true
            that.tableEditDis=true;
        },
        refreshData() {
            let that=this
            that.search.loading = true;
            let params = {};
            params.page = this.page.current;
            params.limit = this.page.limit;
            params.query='field='+that.search.fieldName+'&keyword='+that.search.query;
            this.$http.get("/fmea/scoring",{params:params}).then(function (resp) {
                that.search.loading = false;
                that.data1 = resp.data;
                that.page.total=resp.pagerInfo.total
            })
        },
        reset() {
            this.search.query="";
            this.search.fieldName="";
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

<style>

</style>
