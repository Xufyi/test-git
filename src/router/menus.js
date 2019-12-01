import Vue from 'vue'
import VueI18n from "vue-i18n"
import en_US from 'iview/dist/locale/en-US';
import zh_CN from 'iview/dist/locale/zh-CN';
import SessionStorage from '@/utils/sessionStorage';

let locale = SessionStorage.get("language-main");
if(locale == null){
  locale = 'zh_CN'
}
Vue.use(VueI18n);

Vue.locale = () => {};
const i18n = new VueI18n({
  locale:locale,
  messages:{
    'zh_CN': Object.assign(require('@/assets/languages/zh.json'), zh_CN),
    'en_US': Object.assign(require('@/assets/languages/en.json'), en_US),
    // 'zh_CN': require('@/assets/languages/zh.json'),
    // 'en_US': require('@/assets/languages/en.json'),

  }
})
new Vue({ i18n }).$mount('#app');
window.i18n = i18n;
/**注册全局页面*/
Vue.component('page-welcome', resolve => require(['@/pages/Welcome'], resolve))
Vue.component('page-coming-soon', resolve => require(['@/pages/ComingSoon'], resolve))
Vue.component('page-resume-profile', resolve => require(['@/pages/statistic/resume-list'], resolve))
// Vue.component('resume-details', resolve => require(['@/pages/statistic/resume-details'], resolve))
/**质量规划*/
//生产线别
Vue.component('page-quality-prod-line-list', resolve => require(['@/pages/quality/prod-line'], resolve))
Vue.component('page-quality-product-unit-list', resolve => require(['@/pages/quality/product-unit'], resolve))
Vue.component('page-quality-sampling-as', resolve => require(['@/pages/quality/sampling-as'], resolve))
Vue.component('page-quality-national-standard', resolve => require(['@/pages/quality/national-standard'], resolve))
Vue.component('page-quality-other', resolve => require(['@/pages/quality/other'], resolve))
//测量单位
Vue.component('page-measure-unit-list', resolve => require(['@/pages/quality/measure-unit'], resolve))
Vue.component('page-exam-class-list', resolve => require(['@/pages/quality/exam-class'], resolve))

Vue.component('page-defect-level-list', resolve => require(['@/pages/quality/defect/defect-level'], resolve))
Vue.component('page-defect-location-list', resolve => require(['@/pages/quality/defect/defect-location'], resolve))
//异常评审流程
Vue.component('page-new-process-list', resolve => require(['@/pages/quality/defect/new-process-list'], resolve))
Vue.component('page-new-process-add', resolve => require(['@/pages/quality/defect/new-process-add'], resolve))
//检验项目
Vue.component('page-inspection-type-list', resolve => require(['@/pages/quality/inspection-type'], resolve))
//缺陷名称
Vue.component('page-defect-list', resolve => require(['@/pages/quality/defect/defect'], resolve))
//异常原因
Vue.component('page-defect-abnormal-list', resolve => require(['@/pages/quality/defect/abnormal'], resolve))
//工序设置
Vue.component('page-process-process-list', resolve => require(['@/pages/quality/process/process'], resolve))
//流程设置
Vue.component('page-process-task-list', resolve => require(['@/pages/quality/process/task'], resolve))

//宽严转移规则
Vue.component('page-rule-lt-list', resolve => require(['@/pages/quality/rules/lenient-transfer'], resolve))
//图形判定规则
Vue.component('page-rule-dd-list', resolve => require(['@/pages/quality/rules/diagram-decide'], resolve))
Vue.component('page-rule-number-rule', resolve => require(['@/pages/quality/rules/number-rule'], resolve))






Vue.component('page-product-list', resolve => require(['@/pages/product/product-list'], resolve))//产品库
Vue.component('page-product-add', resolve => require(['@/pages/product/product-add'], resolve))




Vue.component('page-exam-iqc-isir-list', resolve => require(['@/pages/exam/iqc-isir-list'], resolve))
Vue.component('page-exam-iqc-first-add', resolve => require(['@/pages/exam/iqc-first-add'], resolve))

Vue.component('page-exam-iqc-list', resolve => require(['@/pages/exam/iqc-list'], resolve))
Vue.component('page-exam-iqc-add', resolve => require(['@/pages/exam/iqc-add'], resolve))
Vue.component('page-exam-iqc-abnormal-list', resolve => require(['@/pages/exam/iqc-abnormal'], resolve))
Vue.component('page-exam-iqc-abnormal-add', resolve => require(['@/pages/exam/iqc-abnormal-add'], resolve))
Vue.component('page-exam-iqc-manufacturer-list', resolve => require(['@/pages/exam/iqc-manufacturer'], resolve))
Vue.component('page-exam-iqc-Supplier-list', resolve => require(['@/pages/exam/iqc-Supplier'], resolve))
Vue.component('page-exam-iqc-Supplier-update', resolve => require(['@/pages/exam/iqc-Supplier-update'], resolve))
Vue.component('page-exam-iqc-manufacturer-scoring-list', resolve => require(['@/pages/exam/iqc-manufacturer-scoring'], resolve))
//供应商评审
Vue.component('page-exam-iqc-manufacturer-review-list', resolve => require(['@/pages/exam/iqc-manufacturer-review'], resolve))
Vue.component('page-exam-iqc-manufacturer-scoring-config', resolve => require(['@/pages/exam/iqc-manufacturer-scoring-config'], resolve))



//产品批次
Vue.component('page-exam-pqc-batch-list', resolve => require(['@/pages/exam/pqc/pqc-batch-list'], resolve))
Vue.component('page-exam-pqc-bad-list', resolve => require(['@/pages/exam/pqc/pqc-bad-list'], resolve))
Vue.component('page-exam-pqc-bad-update', resolve => require(['@/pages/exam/pqc/pqc-bad-update'], resolve))
//综合检验
Vue.component('page-exam-pqc-list', resolve => require(['@/pages/exam/pqc/pqc-list'], resolve))
Vue.component('page-exam-pqc-add', resolve => require(['@/pages/exam/pqc/pqc-add'], resolve))
Vue.component('page-exam-pqc-cpk-list', resolve => require(['@/pages/exam/pqc/pqc-cpk-list'], resolve))
Vue.component('page-exam-pqc-cpk-add', resolve => require(['@/pages/exam/pqc/pqc-cpk-add'], resolve))

Vue.component('page-exam-pqc-inspectrecord-list', resolve => require(['@/pages/exam/pqc/pqc-inspectrecord-list'], resolve))
Vue.component('page-exam-pqc-inspectrecord-template', resolve => require(['@/pages/exam/pqc/pqc-inspectrecord-template'], resolve))
Vue.component('page-exam-pqc-inspectrecord-template-add', resolve => require(['@/pages/exam/pqc/pqc-inspectrecord-template-add'], resolve))
Vue.component('page-exam-pqc-inspectrecord-update', resolve => require(['@/pages/exam/pqc/pqc-inspectrecord-update'], resolve))
Vue.component('page-exam-pqc-new-inspectrecord-list', resolve => require(['@/pages/exam/pqc/pqc-new-inspectrecord-list'], resolve))
Vue.component('page-exam-pqc-new-inspectrecord-add', resolve => require(['@/pages/exam/pqc/pqc-new-inspectrecord-add'], resolve))
Vue.component('page-exam-pqc-spotcheck-list', resolve => require(['@/pages/exam/pqc/pqc-spotcheck-list'], resolve))
Vue.component('page-exam-pqc-spotcheck-add', resolve => require(['@/pages/exam/pqc/pqc-spotcheck-add'], resolve))
Vue.component('page-exam-pqc-abnormal-list', resolve => require(['@/pages/exam/pqc/pqc-abnormal'], resolve))
Vue.component('page-exam-pqc-abnormal-add', resolve => require(['@/pages/exam/pqc/pqc-abnormal-add'], resolve))
Vue.component('page-exam-pqc-trialProd-list', resolve => require(['@/pages/exam/pqc/pqc-trialProd-list'], resolve))
Vue.component('page-exam-pqc-trialProd-add', resolve => require(['@/pages/exam/pqc/pqc-trialProd-add'], resolve))
Vue.component('page-exam-pqc-first-list', resolve => require(['@/pages/exam/pqc/pqc-first-list'], resolve))
Vue.component('page-exam-pqc-first-add', resolve => require(['@/pages/exam/pqc/pqc-first-add'], resolve))

Vue.component('page-exam-pqc-qr-list', resolve => require(['@/pages/exam/pqc/pqc-qr-list'], resolve))//品质记录
Vue.component('page-exam-pqc-qr-add', resolve => require(['@/pages/exam/pqc/pqc-qr-add'], resolve))//品质记录




Vue.component('page-exam-oqc-list', resolve => require(['@/pages/exam/oqc/oqc-list'], resolve))
Vue.component('page-exam-oqc-add-update', resolve => require(['@/pages/exam/oqc/oqc-add-update'], resolve))
Vue.component('page-exam-oqc-abnormal-add', resolve => require(['@/pages/exam/oqc/oqc-abnormal-add'], resolve))
Vue.component('page-exam-oqc-abnormal-list', resolve => require(['@/pages/exam/oqc/oqc-abnormal-list'], resolve))

// 客服中心
Vue.component('page-customer-list', resolve => require(['@/pages/customer/customer-list'], resolve))
Vue.component('page-customer-add', resolve => require(['@/pages/customer/customer-add'], resolve))
Vue.component('page-customer-return', resolve => require(['@/pages/customer/customer-return'], resolve))
Vue.component('page-customer-return-add', resolve => require(['@/pages/customer/customer-return-add'], resolve))
Vue.component('page-customer-complaint', resolve => require(['@/pages/customer/customer-complaint'], resolve))
Vue.component('page-customer-complaint-add', resolve => require(['@/pages/customer/customer-complaint-add'], resolve))
// Vue.component('page-customer-complaint-edit', resolve => require(['@/pages/customer/customer-complaint-edit'], resolve))
Vue.component('page-customer-appraise-appraisal', resolve => require(['@/pages/customer/customer-appraise/customer-appraisal'], resolve))
Vue.component('page-customer-appraise-grade', resolve => require(['@/pages/customer/customer-appraise/customer-grade'], resolve))

/** 统计分析 statistics */
Vue.component('page-statistic-histogram', resolve => require(['@/pages/statistic/statistic-histogram'], resolve))
Vue.component('page-statistic-preGiaph', resolve => require(['@/pages/statistic/statistic-preGiaph'], resolve))//饼状图
Vue.component('page-statistic-yugutu', resolve => require(['@/pages/statistic/statistic-yugutu'], resolve))//鱼骨图
Vue.component('page-yugutu-change', resolve => require(['@/pages/statistic/statistic-yugutu-change'], resolve))//鱼骨图add-update
Vue.component('page-yugutu', resolve => require(['@/pages/statistic/yugutu'], resolve))//鱼骨图add-update

Vue.component('page-statistic-tendency', resolve => require(['@/pages/statistic/statistic-tendency'], resolve))
Vue.component('page-statistic-comparison', resolve => require(['@/pages/statistic/statistic-comparison'], resolve))//对比图

Vue.component('page-statistic-pareto', resolve => require(['@/pages/statistic/statistic-pareto'], resolve))
Vue.component('page-statistic-spc', resolve => require(['@/pages/statistic/statistic-spc'], resolve))
Vue.component('page-attribute-control-charts', resolve => require(['@/pages/statistic/attribute-control-charts'], resolve))



//msa-grr
Vue.component('page-statistic-msa-grr', resolve => require(['@/pages/statistic/msa/msa-grr'], resolve))
Vue.component('page-statistic-msa-grr-add', resolve => require(['@/pages/statistic/msa/msa-grr-add'], resolve))
Vue.component('page-statistic-msa-grr-chart', resolve => require(['@/pages/statistic/msa/msa-grr-chart'], resolve))
//msa-kappa
Vue.component('page-statistic-crosstab-add', resolve => require(['@/pages/statistic/kappa/crosstab-add'], resolve))
Vue.component('page-statistic-crosstab-list', resolve => require(['@/pages/statistic/kappa/crosstab-list'], resolve))

//FMEA-评分标准
Vue.component('page-statistic-fmea-score', resolve => require(['@/pages/statistic/fmea/fmea-score'], resolve))
Vue.component('page-statistic-fmea-score-add', resolve => require(['@/pages/statistic/fmea/fmea-score-add'], resolve))
//FMEA-分析表格
Vue.component('page-statistic-fmea-table', resolve => require(['@/pages/statistic/fmea/fmea-table'], resolve))
Vue.component('page-statistic-fmea-table-add', resolve => require(['@/pages/statistic/fmea/fmea-table-add'], resolve))
//FMEA-项目追溯
Vue.component('page-statistic-fmea-history', resolve => require(['@/pages/statistic/fmea/fmea-history'], resolve))
Vue.component('page-statistic-fmea-history-add', resolve => require(['@/pages/statistic/fmea/fmea-history-add'], resolve))

/** 监控中心 */
Vue.component('page-monitor-real-time', resolve => require(['@/pages/monitor/real-time'], resolve))
Vue.component('page-monitor-quality-report', resolve => require(['@/pages/monitor/quality-report'], resolve))
Vue.component('page-monitor-quality-Kanban-list', resolve => require(['@/pages/monitor/qualityKanban/quality-kanban-list'], resolve))
Vue.component('page-monitor-quality-Kanban-add', resolve => require(['@/pages/monitor/qualityKanban/quality-kanban-add'], resolve))


/** 系统设置 */
Vue.component('page-system-management-company-info', resolve => require(['@/pages/system/company-info'], resolve))
//员工管理
Vue.component('page-system-management-user-list', resolve => require(['@/pages/system/user-list'], resolve))
//批量导入产品
Vue.component('page-system-management-product-import', resolve => require(['@/pages/system/product-import'], resolve))
//权限管理
Vue.component('page-system-management-permission', resolve => require(['@/pages/system/permission'], resolve))
Vue.component('page-system-management-operation-log', resolve => require(['@/pages/system/operation-log'], resolve))

/*设备维护 */
Vue.component('page-device-manage-chkdev', resolve => require(['@/pages/device/chkdev'], resolve))
Vue.component('page-device-manage-chkdev-add', resolve => require(['@/pages/device/chkdev-add'], resolve))
Vue.component('page-device-manage-calibration-plan', resolve => require(['@/pages/device/calibration-plan'], resolve))
Vue.component('page-device-manage-calibration-history', resolve => require(['@/pages/device/calibration-history'], resolve))
Vue.component('page-device-manage-maintain-plan', resolve => require(['@/pages/device/maintain-plan'], resolve))
Vue.component('page-device-manage-maintain-history', resolve => require(['@/pages/device/maintain-history'], resolve))
Vue.component('page-device-manage-repair-record', resolve => require(['@/pages/device/repair-record'], resolve))
Vue.component('page-device-manage-repair-add', resolve => require(['@/pages/device/repair-add'], resolve))
Vue.component('page-device-manage-borrow-record', resolve => require(['@/pages/device/borrow-record'], resolve))
Vue.component('page-device-manage-transfer-record', resolve => require(['@/pages/device/transfer-record'], resolve))

/*消息*/
Vue.component('page-message-personal-data', resolve => require(['@/pages/message/personal-data'], resolve))
Vue.component('page-message-message-list', resolve => require(['@/pages/message/message-list'], resolve))
Vue.component('page-message-task-list', resolve => require(['@/pages/message/task-list'], resolve))

// 查看供应商
// Vue.component('page-toSupplier-product', resolve => require(['@/pages/toSupplier/product'], resolve))
// Vue.component('page-toSupplier-histogram', resolve => require(['@/pages/toSupplier/histogram'], resolve))
// Vue.component('page-toSupplier-oqc-abnormal', resolve => require(['@/pages/toSupplier/oqc-abnormal'], resolve))
// Vue.component('page-toSupplier-oqc', resolve => require(['@/pages/toSupplier/oqc'], resolve))
// Vue.component('page-toSupplier-pareto', resolve => require(['@/pages/toSupplier/pareto'], resolve))
// Vue.component('page-toSupplier-pqc-abnormal', resolve => require(['@/pages/toSupplier/pqc-abnormal'], resolve))
// Vue.component('page-toSupplier-pqc-bad', resolve => require(['@/pages/toSupplier/pqc-bad'], resolve))
// Vue.component('page-toSupplier-pqc-cpk', resolve => require(['@/pages/toSupplier/pqc-cpk'], resolve))
// Vue.component('page-toSupplier-pqc', resolve => require(['@/pages/toSupplier/pqc'], resolve))
// Vue.component('page-toSupplier-product-resume', resolve => require(['@/pages/toSupplier/product-resume'], resolve))
// Vue.component('page-toSupplier-real-time', resolve => require(['@/pages/toSupplier/real-time'], resolve))
// Vue.component('page-toSupplier-tendency', resolve => require(['@/pages/toSupplier/tendency'], resolve))
//文控中心
Vue.component('page-my-files', resolve => require(['@/pages/filesCenter/my-files'], resolve)) //我的文件
Vue.component('page-files-center', resolve => require(['@/pages/filesCenter/file-store'], resolve)) //文件库
Vue.component('page-files-permission', resolve => require(['@/pages/filesCenter/file-permission'], resolve)) 
Vue.component('page-files-history', resolve => require(['@/pages/filesCenter/file-history'], resolve)) 
Vue.component('page-files-recycle', resolve => require(['@/pages/filesCenter/file-recycle'], resolve)) 


/*定义菜单*/
// {
//   title:"首页",
//   key:"welcome",
//   page:"page-welcome"
// }

export default [
  {
    // 监控中心
    title: i18n.t('menus.monitor'),
    tabtitle: i18n.t('menus.monitor'),
    show: true,
    key: "monitoring-center",
    icon: "monitoring-center",
    permission: ['MONITOR','REPORT','BOARD'],
    children: [
      {
        // 实时监控
        title: i18n.t('menus.realTime'),
        tabTitle: i18n.t('menus.realTime'),
        show: true,
        permission:['MONITOR'],
        key: "monitoring-center-real-time",
        page: "page-monitor-real-time"
      }, {
        /* title: "质量报表",
        tabTitle: "质量报表", */
        title: i18n.t('menus.report'),
        tabTitle: i18n.t('menus.report'),
        show: true,
        permission:['QUALITY_REPORT'],
        key: "monitoring-center-report",
        page: "page-monitor-quality-report"
      },
      {
        //质量看板
        title: i18n.t('menus.qualityKanban'),
        tabTitle: i18n.t('menus.qualityKanban'),
        show: true,
        permission: ['BOARD'],
        key: "monitoring-center-quality-Kanban",
        // developing:true,
        page: "page-monitor-quality-Kanban-list"
      },
    ]
  },
  {
    /* title: "质量规划",
    tabTitle: "质量规划", */
    title: i18n.t('menus.qualityPlan'),
    tabTitle: i18n.t('menus.qualityPlan'),
    show: true,
    key: "quality-planning",
    icon: "quality",
    permission: ['USA_STANDARD',"CN_STANDARD",'PERCRNT_PLAN','PROD_LINE','PROD_UNIT','MEAS_UNIT','CHK_SHIFT','INSPECTION_TYPE','DEFECT_LEVEL','DEFECT_TYPE','DEFECT_LOC','REVIEW_PROCESS','ABNORMAL_CAUSE','PROD_PROCESS','PROD_TASK','RULE'],
    children: [
      {
        /* title: "检验设置",
        tabTitle: "检验设置", */
        title: i18n.t('menus.testSetup'),
        tabTitle: i18n.t('menus.testSetup'),
        
        show: true,
        permission: ['PROD_LINE','PROD_UNIT','MEAS_UNIT','CHK_SHIFT','INSPECTION_TYPE'],
        key: "quality-planning-config",
        children: [
          {
            /* title: "生产线别",
            tabTitle: "生产线别", */
            title: i18n.t('menus.productionLine'),
            tabTitle: i18n.t('menus.productionLine'),
            
            show: true,
            permission: ['PROD_LINE'],
            key: "quality-planning-line",
            page: "page-quality-prod-line-list"
          }, {
            /* title: "产品单位",
            tabTitle: "产品单位", */
            title: i18n.t('menus.productUnit'),
            tabTitle: i18n.t('menus.productUnit'),
            
            show: true,
            permission:['PROD_UNIT'],
            key: "quality-planning-product-unit",
            page: "page-quality-product-unit-list"
          }, {
            /* title: "测量单位",
            tabTitle: "测量单位", */
            title: i18n.t('menus.unitSymbol'),
            tabTitle: i18n.t('menus.unitSymbol'),
            
            show: true,
            permission:['MEAS_UNIT'],
            key: "quality-planning-measure-unit",
            page: "page-measure-unit-list"
          }, {
            /* title: "检验班别",
            tabTitle: "检验班别", */
            title: i18n.t('menus.workTime'),
            tabTitle: i18n.t('menus.workTime'),
            
            show: true,
            permission:['CHK_SHIFT'],
            key: "quality-planning-class",
            page: "page-exam-class-list"
          }, {
            /* title: "检验项目",
            tabTitle: "检验项目", */
            title: i18n.t('menus.project'),
            tabTitle: i18n.t('menus.project'),
            show: true,
            permission:['INSPECTION_TYPE'],
            key: "quality-planning-project",
            page: "page-inspection-type-list"
          }
        ]
      }, {
        /* title: "缺陷设置",
        tabTitle: "缺陷设置", */
        title: i18n.t('menus.defectSetup'),
        tabTitle: i18n.t('menus.defectSetup'),
        
        show: true,
        permission: ['DEFECT_LEVEL','DEFECT_TYPE','DEFECT_LOC','REVIEW_PROCESS','ABNORMAL_CAUSE'],
        key: "quality-planning-defect-config",
        children: [
          {
            /* title: "缺陷等级",
            tabTitle: "缺陷等级", */
            title: i18n.t('menus.defectGrade'),
            tabTitle: i18n.t('menus.defectGrade'),
            
            show: true,
            permission:['DEFECT_LEVEL'],
            key: "quality-planning-defect-level",
            page: "page-defect-level-list"
          }, {
            /* title: "缺陷名称",
            tabTitle: "缺陷名称", */
            title: i18n.t('menus.defectName'),
            tabTitle: i18n.t('menus.defectName'),
            
            show: true,
            permission: ['DEFECT_TYPE'],
            key: "quality-planning-defect-name",
            page: "page-defect-list"
          }, {
            /* title: "缺陷位置",
            tabTitle: "缺陷位置", */
            title: i18n.t('menus.defectPosition'),
            tabTitle: i18n.t('menus.defectPosition'),
            
            show: true,
            permission: ['DEFECT_LOC'],
            key: "quality-planning-defect-location",
            page: "page-defect-location-list"
          }, {
            /* title: "异常评审流程",
            tabTitle: "异常评审流程", */
            title: i18n.t('menus.reviewTeam'),
            tabTitle: i18n.t('menus.reviewTeam'),
            
            show: true,
            permission:['REVIEW_PROCESS'],
            key: "quality-planning-abnormal-review-process",
            page: "page-new-process-list"
          }, {
            /* title: "异常原因",
            tabTitle: "异常原因", */
            title: i18n.t('menus.abnormalCause'),
            tabTitle: i18n.t('menus.abnormalCause'),
            
            show: true,
            permission: ['ABNORMAL_CAUSE'],
            key: "quality-planning-abnormal-cause",
            page: "page-defect-abnormal-list"
          }
        ]
      }, {
        /* title: "工艺流程设置",
        tabTitle: "工艺流程设置", */
        title: i18n.t('menus.processFow'),
        tabTitle: i18n.t('menus.processFow'),
        
        show: true,
        permission: ['PROD_PROCESS','PROD_TASK'],
        key: "quality-planning-process-config",
        children: [
          {
            /* title: "工序站点设置",
            tabTitle: "工序站点设置", */
            title: i18n.t('menus.operationSetup'),
            tabTitle: i18n.t('menus.operationSetup'),
            
            show: true,
            permission:['PROD_PROCESS'],
            key: "quality-planning-process",
            page: "page-process-process-list"
          }, {
            /* title: "流程设置",
            tabTitle: "流程设置", */
            title: i18n.t('menus.processSetup'),
            tabTitle: i18n.t('menus.processSetup'),
            
            show: true,
            permission: ['PROD_TASK'],
            key: "quality-planning-task",
            page: "page-process-task-list"
          }
        ]
      }, {
        /* title: "抽样计划管理",
        tabTitle: "抽样计划管理", */
        title: i18n.t('menus.samplingPlan'),
        tabTitle: i18n.t('menus.samplingPlan'),
        
        show: true,
        permission: ['USA_STANDARD',"CN_STANDARD","PERCRNT_PLAN"],
        key: "quality-planning-sampling-config",
        children: [
          {
            /* title: "美标",
            tabTitle: "美标", */
            title: i18n.t('menus.usaStandard'),
            tabTitle: i18n.t('menus.usaStandard'),
            
            show: true,
            permission:['USA_STANDARD'],
            key: "quality-planning-aql-as",
            page: "page-quality-sampling-as"
          },
          {
            /* title: "国标",
            tabTitle: "国标", */
            title: i18n.t('menus.cnStandard'),
            tabTitle: i18n.t('menus.cnStandard'),
            
            show: true,
            permission: ["CN_STANDARD"],
            key: "quality-planning-national-standard",
            page: "page-quality-national-standard"
          },
          {
            /* title: "其它",
            tabTitle: "其它", */
            title: i18n.t('menus.other'),
            tabTitle: i18n.t('menus.other'),
            
            show: true,
            permission:["PERCRNT_PLAN"],
            key: "quality-planning-other",
            page: "page-quality-other"
          }
        ]
      },
      // 注意下面的注释内容不能删除，只是暂时隐藏

       {
        /* title: "宽严转移规则",
        tabTitle: "宽严转移规则", */
        title: i18n.t('menus.statusTransferRule'),
        tabTitle: i18n.t('menus.statusTransferRule'),
        
        show: true,
        permission:['RULE'],
        key: "quality-planning-lenient-transfer",
        page: "page-rule-lt-list"
      },
      {
        /* title: "图形判定规则",
        tabTitle: "图形判定规则", */
        title: i18n.t('menus.chartJudgeRule'),
        tabTitle: i18n.t('menus.chartJudgeRule'),
        
        show: true,
        permission: ['RULE'],
        key: "quality-planning-diagram-decide",
        page: "page-rule-dd-list"
      },
      {
        /* title: "编号规则",
        tabTitle: "编号规则", */
        title: i18n.t('menus.numberingRule'),
        tabTitle: i18n.t('menus.numberingRule'),
        
        show: true,
        permission: ['NUMBER_SEQUENCE'],
        key: "quality-planning-numner-rule",
        page: "page-rule-number-rule"
      }
    ]
  },
  {
    /* title:"产品资料",
    tabTitle: "产品资料", */
    title: i18n.t('menus.product'),
    tabTitle: i18n.t('menus.product'),
    show: true,
    key: "product",
    icon: "product",
    permission: ['PRODUCT'],
    children: [
      {
        /* title: "产品库",
        tabTitle: "产品库", */
        title: i18n.t('menus.productLibrary'),
        tabTitle: i18n.t('menus.productLibrary'),
        
        show: true,
        permission:['PRODUCT'],
        key: "product-list",
        page: "page-product-list"
      }
     ]
  },

  {
    /* title: "来料控制",
    tabTitle: "来料控制", */
    title: i18n.t('menus.iqc'),
    tabTitle: i18n.t('menus.iqc'),
    show: true,
    key: "qc-iqc",
    icon: "iqc",
    permission: ['IQC','IQC_ABNORMAL','SUPPLIER','SUPPLIER_REVIEW','SUPPLIER_SCORE','STANDARD_SETTING'],
    children: [
      {
        title: "初样检验",
        tabTitle: "初样检验",
        show: true,
        key: "qc-iqc-isir",
        page: "page-exam-iqc-isir-list"
      },
      {
        /* title: "来料检验",
        tabTitle: "来料检验", */
        title: i18n.t('menus.iqcUnusual'),
        tabTitle: i18n.t('menus.iqcUnusual'),
        show: true,
        permission: ['IQC'],
        key: "qc-iqc-list",
        page: "page-exam-iqc-list"
      }, {
        /* title: "来料异常",
        tabTitle: "来料异常", */
        title: i18n.t('menus.incomingAbnormal'),
        tabTitle: i18n.t('menus.incomingAbnormal'),
        
        show: true,
        permission: ['IQC_ABNORMAL'],
        key: "qc-iqc-abnormal",
        page: "page-exam-iqc-abnormal-list"
      }, {
        /* title: "供应商管理",
        tabTitle: "供应商管理", */
        title: i18n.t('menus.supplier'),
        tabTitle: i18n.t('menus.supplier'),
        
        show: true,
        permission: ['SUPPLIER','SUPPLIER_REVIEW','SUPPLIER_SCORE','STANDARD_SETTING'],
        key: "qc-iqc-supplier",
        children: [
          // {
          //   title: "供应商分类",
          //   tabTitle: "供应商分类",
          //   show: true,
          //   permission: [],
          //   key: "qc-iqc-supplier-type",
          //   page: "page-exam-iqc-manufacturer-list"
          // },
//        {
//          title: "供应商分类",
//          tabTitle: "供应商分类",
//          show: true,
//          permission: [],
//          key: "qc-iqc-supplier-list",
//          page: "page-exam-iqc-manufacturer-list"
//        },
          {
            /* title: "供应商列表",
            tabTitle: "供应商列表", */
            title: i18n.t('menus.supplierList'),
            tabTitle: i18n.t('menus.supplierList'),
            
            show: true,
            permission: ['SUPPLIER'],
            key: "qc-iqc-suppliers-list",
            page: "page-exam-iqc-Supplier-list"
          },
           {
            /* title: "供应商评审",
            tabTitle: "供应商评审", */
            title: i18n.t('menus.supplierReview'),
            tabTitle: i18n.t('menus.supplierReview'),
            
            show: true,
            permission: ['SUPPLIER_REVIEW'],
            key: "qc-iqc-supplier-appraisal",
            page: "page-exam-iqc-manufacturer-review-list"
          },{
            /* title: "供应商评分",
            tabTitle: "供应商评分", */
            title: i18n.t('menus.supplierRating'),
            tabTitle: i18n.t('menus.supplierRating'),
            
            show: true,
            permission: ['SUPPLIER_SCORE'],
            key: "qc-iqc-supplier-grade",
            page: "page-exam-iqc-manufacturer-scoring-list"
          }, {
            /* title: "标准设置",
            tabTitle: "标准设置", */
            title: i18n.t('menus.standardSetup'),
            tabTitle: i18n.t('menus.standardSetup'),
            
            show: true,
            permission: ['STANDARD_SETTING'],
            key: "qc-iqc-supplier-standard-config",
            page: "page-exam-iqc-manufacturer-scoring-config"
          }
        ]
      }
    ]
  },
  {
    /* title: "过程控制",
    tabTitle: "过程控制", */
    title: i18n.t('menus.pqc'),
    tabTitle: i18n.t('menus.pqc'),
    show: true,
    key: "qc-pqc",
    icon: "pqc",
    permission: ['PROD_BATCH','PQC','DIRECT_RATE','DATA_RECORD','INSPECTION_RECORD','PQC_ABNORMAL','TRIAL_PROD','FIRST_RECORD','QUALITY_RECORD'],
    children: [
      {
        /* title: "产品批次",
        tabTitle: "产品批次", */
        title: i18n.t('menus.productBatch'),
        tabTitle: i18n.t('menus.productBatch'),
        
        show: true,
        permission: ['PROD_BATCH'],
        key: "qc-pqc-prod-batch",
        page: "page-exam-pqc-batch-list"
      }, {
        /* title: "过程检验",
        tabTitle: "过程检验", */
        title: i18n.t('menus.pqcCheckout'),
        tabTitle: i18n.t('menus.pqcCheckout'),
        
        show: true,
        permission: ['PQC','DIRECT_RATE','DATA_RECORD','INSPECTION_RECORD'],
        key: "qc-pqc-list",
        children: [
          {
            /* title: "过程直通率",
            tabTitle: "过程直通率", */
            title: i18n.t('menus.passRate'),
            tabTitle: i18n.t('menus.passRate'),
            
            show: true,
            permission: ['DIRECT_RATE'],
            key: "qc-pqc-bad-ratio",
            page: "page-exam-pqc-bad-list"
          }, {
            /* title: "综合检验",
            tabTitle: "综合检验", */
            title: i18n.t('menus.pqczh'),
            tabTitle: i18n.t('menus.pqczh'),
            
            show: true,
            permission: ['PQC'],
            key: "qc-pqc-examine",
            page: "page-exam-pqc-list"
          }, {
            /* title: "检测数据CPK",
            tabTitle: "检测数据CPK", */
            title: i18n.t('menus.cpk'),
            tabTitle: i18n.t('menus.cpk'),
            show: true,
            permission: ['DATA_RECORD'],
            key: "qc-pqc-cpk",
            page: "page-exam-pqc-cpk-list"
          } ,
          {
            /* title:"巡检记录",
            tabTitle:"巡检记录", */
            title:i18n.t("pqc.InspectionRecord"),
            tabTitle:i18n.t("pqc.InspectionRecord"),
            show: true,
            key:"exam-pqc-new-inspectrecord-list",
            page: "page-exam-pqc-new-inspectrecord-list"
          },
          {
            title:"点检记录",
            tabTitle:"点检记录",
            // title:i18n.t("pqc.InspectionRecord"),
            // tabTitle:i18n.t("pqc.InspectionRecord"),
            show: true,
            key:"exam-pqc-spotcheck-list",
            page: "page-exam-pqc-spotcheck-list"
          },
        ]
      }, 
      // {
      //   /* title: "巡检记录",
      //   tabTitle: "巡检记录", */
      //   title: i18n.t('menus.patrolInspection'),
      //   tabTitle: i18n.t('menus.patrolInspection'),
      //   show: true,
      //   permission: ['INSPECTION_RECORD'],
      //   key: "qc-pqc-inspection",
      //   children:[
      //     {
      //       /* title:"巡检记录",
      //       tabTitle:"巡检记录", */
      //       title:i18n.t("pqc.InspectionRecord"),
      //       tabTitle:i18n.t("pqc.InspectionRecord"),
      //       show: true,
      //       key:"qc-pqc-inspection-record",
      //       page: "page-exam-pqc-inspectrecord-list"
      //     },
      //     {
      //       /* title:"巡检表模板",
      //       tabTitle:"巡检表模板", */
      //       title:i18n.t("pqc.PatrolFormTemplate"),
      //       tabTitle:i18n.t("pqc.PatrolFormTemplate"),
      //       show: true,
      //       key:"qc-pqc-inspection-template",
      //       page: "page-exam-pqc-inspectrecord-template"
      //     }
      //   ]
      // },
      {
        /* title: "过程异常",
        tabTitle: "过程异常", */
        title: i18n.t('menus.processAbnormal'),
        tabTitle: i18n.t('menus.processAbnormal'),
        
        show: true,
        permission: ['PQC_ABNORMAL'],
        key: "qc-pqc-abnormal",
        page: "page-exam-pqc-abnormal-list"
      }, {
        /* title: "试产管理",
        tabTitle: "试产管理", */
        title: i18n.t('menus.trialProduction'),
        tabTitle: i18n.t('menus.trialProduction'),
        
        show: true,
        permission: ['TRIAL_PROD'],
        key: "qc-pqc-trialProd",
        page: "page-exam-pqc-trialProd-list"
      }, {
        /* title: "首件记录",
        tabTitle: "首件记录", */
        title: i18n.t('menus.sampleRecord'),
        tabTitle: i18n.t('menus.sampleRecord'),
        show: true,
        permission: ['FIRST_RECORD'],
        key: "qc-pqc-first",
        page: "page-exam-pqc-first-list"
      }, 
      {
        /* title: "品质记录",
        tabTitle: "品质记录", */
        title: i18n.t('menus.qualityRecord'),
        tabTitle: i18n.t('menus.qualityRecord'),
        
        show: true,
        permission: ['QUALITY_RECORD'],
        key: "qc-pqc-qr",
        page: "page-exam-pqc-qr-list"
      } 
    ]
  },
  {
    /* title: "出货控制",
    tabTitle: "出货控制", */
    title: i18n.t('menus.oqc'),
        tabTitle: i18n.t('menus.oqc'),
    show: true,
    key: "qc-oqc",
    icon: "oqc",
    permission: ['OQC','OQC_ABNORMAL'],
    children: [
      {
        /* title: "出货检验",
        tabTitle: "出货检验", */
        title: i18n.t('menus.oqcCheckout'),
        tabTitle: i18n.t('menus.oqcCheckout'),
        show: true,
        permission: ['OQC'],
        key: "qc-oqc-examine",
        page: "page-exam-oqc-list"
      }, {
        /* title: "出货异常",
        tabTitle: "出货异常", */
        title: i18n.t('menus.shipmentsAbnormal'),
        tabTitle: i18n.t('menus.shipmentsAbnormal'),
        
        show: true,
        permission: ['OQC_ABNORMAL'],
        key: "qc-oqc-abnormal",
        page: "page-exam-oqc-abnormal-list"
      }
    ]
  },
  {
    /* title: "客服中心",
    tabTitle: "客服中心", */
    title: i18n.t('menus.csm'),
    tabTitle: i18n.t('menus.csm'),
    show: true,
    key: "customer-service",
    icon: "customer",
    permission: ['CUSTOMER','CUSTOMER_COMPLAINT','CUSTOMER_REFUND','CUSTOMER_REVIEW','CUSTOMER_SCORE'],
    children: [
      {
        /* title: "客户列表",
        tabTitle: "客户列表", */
        title: i18n.t('menus.clientList'),
        tabTitle: i18n.t('menus.clientList'),
        
        show: true,
        permission: ['CUSTOMER'],
        key: "customer-service-list",
        page: "page-customer-list"
      }, {
        /* title: "客诉管理",
        tabTitle: "客诉管理", */
        title: i18n.t('menus.customerComplain'),
        tabTitle: i18n.t('menus.customerComplain'),
        
        show: true,
        permission: ['CUSTOMER_COMPLAINT'],
        key: "customer-service-customer-complaint",
        page: "page-customer-complaint"
      }, {
        /* title: "客退管理",
        tabTitle: "客退管理", */
        title: i18n.t('menus.returns'),
        tabTitle: i18n.t('menus.returns'),
        
        show: true,
        permission: ['CUSTOMER_REFUND'],
        key: "customer-service-customer-return",
        page: "page-customer-return"
      },{
        /* title: "客户评价",
        tabTitle: "客户评价", */
        title: i18n.t('menus.customerEvaluation'),
        tabTitle: i18n.t('menus.customerEvaluation'),
        
        show: true,
        permission: ['CUSTOMER_REVIEW','CUSTOMER_SCORE'],
        key: "customer-service-appraise",
        children: [
          {
            /* title: "客户评审",
            tabTitle: "客户评审", */
            title: i18n.t('menus.customerReview'),
            tabTitle: i18n.t('menus.customerReview'),
            show: true,
            permission: ['CUSTOMER_REVIEW'],
            key: "customer-service-appraise-appraisal",
            page: "page-customer-appraise-appraisal"
          }, {
            /* title: "客户评分",
            tabTitle: "客户评分", */
            title: i18n.t('menus.customerRating'),
            tabTitle: i18n.t('menus.customerRating'),
            
            show: true,
            permission: ['CUSTOMER_SCORE'],
            key: "customer-service-appraise-grade",
            page: "page-customer-appraise-grade"
          }
        ]
      }
    ]
  },
  {
    /* title: "统计分析",
    tabTitle: "统计分析", */
    title: i18n.t('menus.statistical'),
    tabTitle: i18n.t('menus.statistical'),
    
    show: true,
    key: "statistic-analysis",
    icon: "statistic",
    permission: ['PRODUCT_PROFILE','HISTOGRAM','PIE_CHART','TENDENCY_CHART','FISHBONE','COMPARISON_CHART','PARETO_CHART','CONTROL_CHART','COUNT_CONTROL_CHART','GRR','KAPPA','FMEA_SCORING','FMEA_ANALYSIS_TABLE','FMEA_HISTORY_ANALYSIS_TABLE'],
    children: [
      {
        /* title: "产品履历",
        tabTitle: "产品履历", */
        title: i18n.t('menus.productCV'),
        tabTitle: i18n.t('menus.productCV'),
        
        show: true,
        permission: ['PRODUCT_PROFILE'],
        key: "statistic-analysis-product-resume",
        page: "page-resume-profile"
      },
      {
        // 统计图Chart
        title: i18n.t('menus.statisticaChart'),
        tabTitle: i18n.t('menus.statisticaChart'),
        show: true,
        permission: ['HISTOGRAM','PIE_CHART','TENDENCY_CHART','FISHBONE','COMPARISON_CHART','PARETO_CHART','CONTROL_CHART'],
        key: "statistic-analysis-diagram",
        children: [
          {
            /* title: "柱状图",
            tabTitle: "柱状图", */
            title: i18n.t('menus.histogram'),
            tabTitle: i18n.t('menus.histogram'),
            
            show: true,
            permission: ['HISTOGRAM'],
            key: "statistic-analysis-diagram-histogram",
            page: "page-statistic-histogram"
          }, {
            /* title: "饼状图",
            tabTitle: "饼状图", */
            title: i18n.t('menus.pieChart'),
            tabTitle: i18n.t('menus.pieChart'),
            
            show: true,
            permission: ['PIE_CHART'],
            key: "statistic-analysis-diagram-preGiaph",
            page: "page-statistic-preGiaph"
          },  {
            


            /* title: "趋势图",
            tabTitle: "趋势图", */
            title: i18n.t('menus.trendMap'),
            tabTitle: i18n.t('menus.trendMap'),
            show: true,
            permission: ['TENDENCY_CHART'],
            key: "statistic-analysis-diagram-tendency",
            page: "page-statistic-tendency"
          },
          {
            /* title: "因果图",
            tabTitle: "因果图", */
            title: i18n.t('menus.tendencyChart'),
            tabTitle: i18n.t('menus.tendencyChart'),
            show: true,
            permission: ['FISHBONE'],
            key: "statistic-analysis-diagram-yugutu",
            page: "page-statistic-yugutu"
          }, {
            /* title: "对比图",
            tabTitle: "对比图", */
            title: i18n.t('menus.contrastFigure'),
            tabTitle: i18n.t('menus.contrastFigure'),
            show: true,
            permission: ['COMPARISON_CHART'],
            key: "statistic-analysis-diagram-comparison",
            page: "page-statistic-comparison"
          },  {
            /* title: "排列图",
            tabTitle: "排列图", */
            title: i18n.t('menus.paretoChart'),
            tabTitle: i18n.t('menus.paretoChart'),
            show: true,
            permission: ['PARETO_CHART'],
            key: "statistic-analysis-diagram-pareto",
            page: "page-statistic-pareto"
          }, 
          // {
          //   title: "履历",
          //   tabTitle: "履历",
          //   show: true,
          //   permission: [],
          //   key: "statistic-analysis-product-resume",
          //   page: "page-coming-soon"
          // },
        ]
      },{
        // 控制图SPC
        title:i18n.t('menus.controlChart'),
        tabTitle: i18n.t('menus.controlChart'),
        show: true,
        permission: ['CONTROL_CHART','COUNT_CONTROL_CHART'],
        key: "statistic-spcs",
        children: [
          {
            // 计量控制图
            title: i18n.t('menus.measurement'),
            tabTitle: i18n.t('menus.measurement'),
            show: true,
            permission: ['CONTROL_CHART'],
            key: "statistic-spc",
            page: "page-statistic-spc"
          }, {
            // 计数控制图
            title: i18n.t('menus.countingControlChart'),
            tabTitle:i18n.t('menus.countingControlChart'),
            show: true,
            permission: ['COUNT_CONTROL_CHART'],
            // developing:true,   
            key:'statistic-attribute-control-charts',
            page:'page-attribute-control-charts'   
          }
        ]
      },
      {
        // 测量分析MSA
        title:i18n.t('menus.MeasurementAnalysis'),
        tabTitle: i18n.t('menus.MeasurementAnalysis'),
        show: true,
        permission: ['GRR','KAPPA'],
        key: "statistic-measure",
        children: [
          {
            // 计量值GRR
            title: i18n.t('menus._measurement'),
            tabTitle:i18n.t('menus._measurement'),
            show: true,
            permission: ['GRR'],
            key:"statistic-msa-grr",  
            page:"page-statistic-msa-grr",  
          },
          {
            // Kappa交叉表
            title: i18n.t('menus.crosstab'),
            tabTitle:i18n.t('menus.crosstab'),
            show: true,
            permission: ['KAPPA'],
            // developing:true,            
            key:"statistic-crosstab-list",  
            page:"page-statistic-crosstab-list", 
          },
        ]
      },
      {
        // 效应分析FMEA
        title:i18n.t('menus.FMEA'),
        tabTitle: i18n.t('menus.FMEA'),
        show: true,
        permission: ['FMEA_SCORING','FMEA_ANALYSIS_TABLE','FMEA_HISTORY_ANALYSIS_TABLE'],
        key: "statistic-fmea",
        children: [
          {
            // 评分标准
            title: i18n.t('menus.ScoringCriteria'),
            tabTitle:i18n.t('menus.ScoringCriteria'),
            show: true,
            permission: ['FMEA_SCORING'],     
            key:"statistic-fmea-score",  
            page:"page-statistic-fmea-score",     
          },
          {
            // 分析表格
            title: i18n.t('menus.analysisForm'),
            tabTitle:i18n.t('menus.analysisForm'),
            show: true,
            permission: ['FMEA_ANALYSIS_TABLE'],     
            key:"statistic-fmea-table",  
            page:"page-statistic-fmea-table", 
          },
          {
            // 项目追溯
            title: i18n.t('menus.projectBack'),
            tabTitle:i18n.t('menus.projectBack'),
            show: true,
            permission: ['FMEA_HISTORY_ANALYSIS_TABLE'],     
            key:"statistic-fmea-history",  
            page:"page-statistic-fmea-history", 
          },
        ]
      }
    ]
  },
  {
   /*  title: "设备管理",
    tabTitle: "设备管理", */
    title: i18n.t('menus.equipment'),
    tabTitle: i18n.t('menus.equipment'),
    show: true,
    key: "device-manage",
    icon: "equipment",
    permission: ['CHKDEV','CALIBRATION','MAINTAIN','REPAIRRECORD','BORROWRECORD','TRANSFERRECORD'],
    children: [
      {
        /* title: "设备台账",
        tabTitle: "设备台账", */
        title: i18n.t('menus.equipmentLedger'),
        tabTitle: i18n.t('menus.equipmentLedger'),
        
        show: true,
        permission: ['CHKDEV'],
        key: "device-manage-chkdev",
        page: "page-device-manage-chkdev"
      },
      {
        // 校准计划
        title: i18n.t('menus.calibrationPlan'),
        tabTitle: i18n.t('menus.calibrationPlan'),
        show: true,
        permission: ['CALIBRATION'],
        key: "device-manage-calibration-plan",
        page: "page-device-manage-calibration-plan"
      },
      {
        // 保养计划
        title: i18n.t('menus.maintenancePlan'),
        tabTitle: i18n.t('menus.maintenancePlan'),
        show: true,
        permission: ['MAINTAIN'],
        key: "device-manage-maintain-plan",
        page: "page-device-manage-maintain-plan"
      },
      {
        // 维修记录
        title: i18n.t('menus.maintenanceRecord'),
        tabTitle: i18n.t('menus.maintenanceRecord'),
        show: true,
        permission: ['REPAIRRECORD'],
        key: "device-manage-repair-record",
        page: "page-device-manage-repair-record"
      },
      {
        // 借还记录
        title: i18n.t('menus.borrowedRecord'),
        tabTitle: i18n.t('menus.borrowedRecord'),
        show: true,
        permission: ['BORROWRECORD'],
        key: "device-manage-borrow-record",
        page: "page-device-manage-borrow-record"
      },
      {
        // 转移记录
        title: i18n.t('menus.transferRecord'),
        tabTitle: i18n.t('menus.transferRecord'),
        show: true,
        permission: ['TRANSFERRECORD'],
        key: "device-manage-transfer-record",
        page: "page-device-manage-transfer-record"
      }
    ]
  },
  // 文控中心
  {
    title: i18n.t('menus.documents'),
    tabTitle: i18n.t('menus.documents'),
    show: true,
    key: "files-center",
    icon: "files",
    permission: ["MY_FILE","FILE","DIRECTORY","FILE_REMARK","MOVE_FILE","RENAME_FILE","FILE_PERMISSION","HISTORY_FILE","RECOVERY_FILE"],
    children: [
      //我的文件
      {
        title: i18n.t('menus.myFiles'),
        tabTitle: i18n.t('menus.myFiles'),
        show: true,
        permission: ["MY_FILE"],
        key: "my-files",
        page: "page-my-files"
      },
      {
        title: i18n.t('menus.documentsManage'),
        tabTitle: i18n.t('menus.documentsManage'),
        show: true,
        permission: ["FILE","DIRECTORY","FILE_REMARK","MOVE_FILE","RENAME_FILE","FILE_PERMISSION","HISTORY_FILE","RECOVERY_FILE"],
        key: "files-center",
        children:[
          //文件库
          {
            title: i18n.t('menus.fileLibrary'),
            tabTitle: i18n.t('menus.fileLibrary'),
            show: true,
            permission: ["FILE","DIRECTORY","FILE_REMARK","MOVE_FILE","RENAME_FILE","FILE_PERMISSION"],
            key: "files-center",
            page: "page-files-center"
          },
          //历史版本
          {
            title: i18n.t('menus.historicalVersion'),
            tabTitle: i18n.t('menus.historicalVersion'),
            show: true,
            permission: ["HISTORY_FILE"],
            key: "files-history",
            page: "page-files-history"
          },
          //回收站
          {
            title: i18n.t('menus.recycleBin'),
            tabTitle: i18n.t('menus.recycleBin'),
            show: true,
            permission: ["RECOVERY_FILE"],
            key: "files-recycle",
            page: "page-files-recycle"
          },
        ]
      },
      
    ]
  },
  {
    /* title: "系统设置",
    tabTitle: "系统设置", */
    title: i18n.t('menus.systemSetup'),
    tabTitle: i18n.t('menus.systemSetup'),
    
    show: true,
    key: "system-management",
    icon: "system",
    permission: ['COMPANY','PERMISSION','ROLE','DEPARTMENT','USER'],
    children: [
      {
        /* title: "公司信息",
        tabTitle: "公司信息", */
        title: i18n.t('menus.companyProfile'),
        tabTitle: i18n.t('menus.companyProfile'),
        show: true,
        permission: ['COMPANY'],
        key: "system-management-company-info",
        page: "page-system-management-company-info"
      }, {
        /* title: "权限管理",
        tabTitle: "权限管理", */
        title: i18n.t('menus.authorityControl'),
        tabTitle: i18n.t('menus.authorityControl'),
        show: true,
        permission: ['PERMISSION','ROLE'],
        key: "system-management-permission",
        page: "page-system-management-permission"
      }, {
        /* title: "员工管理",
        tabTitle: "员工管理", */
        title: i18n.t('menus.employeeManage'),
        tabTitle: i18n.t('menus.employeeManage'),
        show: true,
        permission: ['DEPARTMENT','USER'],
        key: "system-management-user-list",
        page: "page-system-management-user-list"
      },
      /*{
        title: "导入产品",
        tabTitle: "导入产品",
        show: true,
        permission: [],
        key: "system-management-product-import",
        page: "page-system-management-product-import"
      },*/
      /* {
        title: "操作日志",
        tabTitle: "操作日志",
        show: true,
        permission: [],
        key: "system-management-operation-log",
        page: "page-system-management-operation-log"
      }*/
    ]
  }
]
