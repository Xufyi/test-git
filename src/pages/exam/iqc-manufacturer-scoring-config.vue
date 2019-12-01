<template>
  <div class="iqis-page">
    <div class="iqis-page-block">
      <div class="iqis-page-block-title">
        {{$t('iqc.setScoreProportion')}}
      </div>
      <div class="iqis-page-block-body">
        <div style="height:120px;">
          <div class="iqc-scoring-config-item-a">
            {{$t('iqc.qualityScoreTotal')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="bv.pzTotal" style="width:50px;"></i-input> {{$t('iqc.proportion')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="bv.pzRate" style="width:50px;"></i-input> %
          </div>
          <div class="iqc-scoring-config-item-a">
            {{$t('iqc.priceScoreTotal')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="bv.jgTotal" style="width:50px;"></i-input> {{$t('iqc.proportion')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="bv.jgRate" style="width:50px;"></i-input> %
          </div>
          <div class="iqc-scoring-config-item-a">
            {{$t('iqc.periodScoreTotal')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="bv.rqTotal" style="width:50px;"></i-input> {{$t('iqc.proportion')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="bv.rqRate" style="width:50px;"></i-input> %
          </div>
          <div class="iqc-scoring-config-item-a">
            {{$t('iqc.serviceScoreTotal')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="bv.fwTotal" style="width:50px;"></i-input> {{$t('iqc.proportion')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="bv.fwRate" style="width:50px;"></i-input> %
          </div>
          <div style="clear: both;"></div>
        </div>
        <Row :gutter="24" type="flex">
          <i-col span="12">
            <div class="iqis-page-block">
              <div class="iqis-page-block-title">
                {{$t('iqc.setScoreGrade')}}
              </div>
              <div class="iqis-page-block-body">
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf1.r1s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r1e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r1t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf1.r2s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r2e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r2t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf1.r3s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r3e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r3t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf1.r4s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r4e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r4t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf1.r5s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r5e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r5t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf1.r6s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r6e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r6t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf1.r7s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r7e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r7t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf1.r8s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r8e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r8t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf1.r9s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r9e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r9t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf1.r10s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r10e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf1.r10t" style="width:150px;"></i-input> </div>
              </div>
            </div>
          </i-col>
          <i-col span="12">
            <div class="iqis-page-block">
              <div class="iqis-page-block-title">
                {{$t('iqc.setReviewGrade')}}
              </div>
              <div class="iqis-page-block-body">
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf2.r1s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r1e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r1t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf2.r2s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r2e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r2t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf2.r3s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r3e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r3t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf2.r4s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r4e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r4t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf2.r5s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r5e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r5t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf2.r6s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r6e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r6t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf2.r7s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r7e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r7t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf2.r8s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r8e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r8t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf2.r9s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r9e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r9t" style="width:150px;"></i-input> </div>
                <div class="config-item-b">{{$t('iqc.ScoreRange')}} <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" style="width:50px;" v-model="pf2.r10s"></i-input> ~ <i-input :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r10e" style="width:50px;"></i-input> {{$t('iqc.is')}} <i-input  :disabled="!permsBtn.UPDATE_STANDARD_SETTING" v-model="pf2.r10t" style="width:150px;"></i-input> </div>
              </div>
            </div>
          </i-col>
        </Row>

      </div>
    </div>
            <IqisAffix placement="bottom" :offset="0" v-if="permsBtn.UPDATE_STANDARD_SETTING">
        <div class="iqis-page-save-tool" style="background-color: #fff; border-top: 1px solid #e8e8e8;width:100%;">
	      <Button type="primary" @click="startEdit" >{{$t('iqc.save')}}</Button>
        </div>
        </IqisAffix>
    <div class="page-end" style="padding-bottom: 80px;padding-top: 30px;"></div>
  </div>
</template>
<script>
  import ICol from "iview/src/components/grid/col";

  export default {

    components: {ICol},
    data(){
      return {
      	headers:{"headers":{"Content-Type":"application/json; charset=UTF-8"}},
        bv:{
          pzTotal:'',
          pzRate:'',
          jgTotal:'',
          jgRate:'',
          rqTotal:'',
          rqRate:'',
          fwTotal:'',
          fwRate:''
        },
        pf1:{
          r1s:'',
          r1e:'',
          r1t:'',

          r2s:'',
          r2e:'',
          r2t:'',

          r3s:'',
          r3e:'',
          r3t:'',

          r4s:'',
          r4e:'',
          r4t:'',

          r5s:'',
          r5e:'',
          r5t:'',

          r6s:'',
          r6e:'',
          r6t:'',

          r7s:'',
          r7e:'',
          r7t:'',

          r8s:'',
          r8e:'',
          r8t:'',

          r9s:'',
          r9e:'',
          r9t:'',

          r10s:'',
          r10e:'',
          r10t:''
        },
        pf2:{
          r1s:'',
          r1e:'',
          r1t:'',

          r2s:'',
          r2e:'',
          r2t:'',

          r3s:'',
          r3e:'',
          r3t:'',

          r4s:'',
          r4e:'',
          r4t:'',

          r5s:'',
          r5e:'',
          r5t:'',

          r6s:'',
          r6e:'',
          r6t:'',

          r7s:'',
          r7e:'',
          r7t:'',

          r8s:'',
          r8e:'',
          r8t:'',

          r9s:'',
          r9e:'',
          r9t:'',

          r10s:'',
          r10e:'',
          r10t:''
        },
        permsCur:[
          "SELECT_STANDARD_SETTING",
          "UPDATE_STANDARD_SETTING",
        ],//当前页面需要的权限名称
        permsBtn:{//控制每个权限对应按钮的禁用状态
          "SELECT_STANDARD_SETTING":false,
          "UPDATE_STANDARD_SETTING":false,
        },
        noPermsDis:true,


      }
    },
    created(){
      let permsAll = this.$store.state.permissions; 
      this.$iqis.utils.getPermissionsAll(permsAll,this.permsCur,this.permsBtn);
      this.loadData();
    },



    methods:{
      loadData(){
        let that = this;
        this.$http.get("/basic/standardSetting").then(function (resp) {
          if(resp.data){
            let p1 = {};
            for(let i=0;i<resp.data.scoringHierarchyList.length;i++){
              let item = resp.data.scoringHierarchyList[i];
              p1["r"+(i+1)+"s"] = item.minScore;
              p1["r"+(i+1)+"e"] = item.maxScore;
              p1["r"+(i+1)+"t"] = item.hierarchyName;
            }
            that.pf1 = p1;

            let p2 = {};
            for(let i=0;i<resp.data.reviewHierarchyList.length;i++){
              let item = resp.data.reviewHierarchyList[i];
              p2["r"+(i+1)+"s"] = item.minScore;
              p2["r"+(i+1)+"e"] = item.maxScore;
              p2["r"+(i+1)+"t"] = item.hierarchyName;
            }
            that.pf2 = p2;

            if(resp.data.quantityProportionSetting){
              that.bv.pzTotal = resp.data.quantityProportionSetting.settingScore;
              that.bv.pzRate = resp.data.quantityProportionSetting.settingRate;
            }

            if(resp.data.priceProportionSetting){
              that.bv.jgTotal = resp.data.priceProportionSetting.settingScore;
              that.bv.jgRate = resp.data.priceProportionSetting.settingRate;
            }

            if(resp.data.periodProportionSetting){
              that.bv.rqTotal = resp.data.periodProportionSetting.settingScore;
              that.bv.rqRate = resp.data.periodProportionSetting.settingRate;
            }

            if(resp.data.serviceProportionSetting){
              that.bv.fwTotal = resp.data.serviceProportionSetting.settingScore;
              that.bv.fwRate = resp.data.serviceProportionSetting.settingRate;
            }
          }
        });
      },
      startEdit(){
      	let that=this;
        let prameter={
        	  "scoringHierarchyList": [
				      {
				        "hierarchyName": that.pf1.r1t,
				        "maxScore": that.pf1.r1e,
				        "minScore": that.pf1.r1s,
				        "hierarchyType": "SCORING"
				      },{
				        "hierarchyName": that.pf1.r2t,
				        "maxScore": that.pf1.r2e,
				        "minScore": that.pf1.r2s,
				        "hierarchyType": "SCORING"
				      },{
				        "hierarchyName": that.pf1.r3t,
				        "maxScore": that.pf1.r3e,
				        "minScore": that.pf1.r3s,
				        "hierarchyType": "SCORING"
				      },				      {
				        "hierarchyName": that.pf1.r4t,
				        "maxScore": that.pf1.r4e,
				        "minScore": that.pf1.r4s,
				        "hierarchyType": "SCORING"
				      },				      {
				        "hierarchyName": that.pf1.r5t,
				        "maxScore": that.pf1.r5e,
				        "minScore": that.pf1.r5s,
				        "hierarchyType": "SCORING"
				      },				      {
				        "hierarchyName": that.pf1.r6t,
				        "maxScore": that.pf1.r6e,
				        "minScore": that.pf1.r6s,
				        "hierarchyType": "SCORING"
				      },				      {
				        "hierarchyName": that.pf1.r7t,
				        "maxScore": that.pf1.r7e,
				        "minScore": that.pf1.r7s,
				        "hierarchyType": "SCORING"
				      },				      {
				        "hierarchyName": that.pf1.r8t,
				        "maxScore": that.pf1.r8e,
				        "minScore": that.pf1.r8s,
				        "hierarchyType": "SCORING"
				      },
				      				      {
				        "hierarchyName": that.pf1.r9t,
				        "maxScore": that.pf1.r9e,
				        "minScore": that.pf1.r9s,
				        "hierarchyType": "SCORING"
				      },
				      				      {
				        "hierarchyName": that.pf1.r10t,
				        "maxScore": that.pf1.r10e,
				        "minScore": that.pf1.r10s,
				        "hierarchyType": "SCORING"
				      }
				    ],
				    "reviewHierarchyList": [
				      {
				        "hierarchyName": that.pf2.r1t,
				        "maxScore": that.pf2.r1e,
				        "minScore": that.pf2.r1s,
				        "hierarchyType": "REVIEW"
				      },{
				        "hierarchyName": that.pf2.r2t,
				        "maxScore": that.pf2.r2e,
				        "minScore": that.pf2.r2s,
				        "hierarchyType": "REVIEW"
				      },{
				        "hierarchyName": that.pf2.r3t,
				        "maxScore": that.pf2.r3e,
				        "minScore": that.pf2.r3s,
				        "hierarchyType": "REVIEW"
				      },				      {
				        "hierarchyName": that.pf2.r4t,
				        "maxScore": that.pf2.r4e,
				        "minScore": that.pf2.r4s,
				        "hierarchyType": "REVIEW"
				      },				      {
				        "hierarchyName": that.pf2.r5t,
				        "maxScore": that.pf2.r5e,
				        "minScore": that.pf2.r5s,
				        "hierarchyType": "REVIEW"
				      },				      {
				        "hierarchyName": that.pf2.r6t,
				        "maxScore": that.pf2.r6e,
				        "minScore": that.pf2.r6s,
				        "hierarchyType": "REVIEW"
				      },				      {
				        "hierarchyName": that.pf1.r7t,
				        "maxScore": that.pf2.r7e,
				        "minScore": that.pf2.r7s,
				        "hierarchyType": "REVIEW"
				      },				      {
				        "hierarchyName": that.pf2.r8t,
				        "maxScore": that.pf2.r8e,
				        "minScore": that.pf2.r8s,
				        "hierarchyType": "REVIEW"
				      },
				      				      {
				        "hierarchyName": that.pf2.r9t,
				        "maxScore": that.pf2.r9e,
				        "minScore": that.pf2.r9s,
				        "hierarchyType": "REVIEW"
				      },
				      				      {
				        "hierarchyName": that.pf2.r10t,
				        "maxScore": that.pf2.r10e,
				        "minScore": that.pf2.r10s,
				        "hierarchyType": "REVIEW"
				      }
				    ],
        	    "quantityProportionSetting": {
					      "settingName": "QUALITY_SCORE",
					      "settingScore": that.bv.pzTotal,
					      "settingRate": that.bv.pzRate
					    },
					    "priceProportionSetting": {
					      "settingName": "PRICE_SCORE",
					      "settingScore":that.bv.jgTotal,
					      "settingRate":that.bv.jgRate
					    },
					    "periodProportionSetting": {
					      "settingName": "PERIOD_SCORE",
					      "settingScore":that.bv.rqTotal,
					      "settingRate":that.bv.rqRate
					    },
					    "serviceProportionSetting": {
					      "settingName": "SERVICE_SOCRE",
					      "settingScore":that.bv.fwTotal,
					      "settingRate":that.bv.fwRate
					    }
        }
				let url="/basic/standardSetting"
				that.$http.put(url,prameter,that.headers).then((res)=>{
					that.$Message.success(i18n.t('iqc.saveSuccess'));
					that.loadData();
				})
      },
      save(){

      }


    }//end methods


  }
</script>
<style scoped>
  .iqc-scoring-config-item-a{
    width: 49.9%;
    float: left;
    overflow: hidden;
    line-height: 32px;
    padding:24px 24px 0 24px;
  }

  .config-item-b{
    text-align: center;
    margin-top: 8px;
  }
</style>
