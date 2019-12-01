/*
 * @Author: yaoxingpu 
 * @Date: 2019-03-25 10:34:10 
 * @Last Modified by: yaoxingpu
 * @Last Modified time: 2019-04-26 17:23:20
 */
import $ from 'jquery'
const i18n = window.i18n;
export default {
    businessArr:[
        'acceptance_rate','first_pass_yield','return_rate','bad_rate','abnormal_count','customer_complaint_count','defect',
    ],
    businessTypeNameList:[
        i18n.t("monitor.allowYield"),
        i18n.t("statistical.passRate"),
        i18n.t("statistical.rejectsRate"),
        i18n.t("statistical.badRate"),
        i18n.t("statistical.abnormalQuantity"),
        i18n.t("statistical.complaintQuantity"),
        i18n.t("statistical.defectQuantity2")
        /* {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
        {value:'first_pass_yield',label:'直通率'},
        {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
        {value:'bad_rate',label:i18n.t("statistical.badRate")},
        {value:'abnormal_count',label:i18n.t("statistical.abnormalQuantity")},
        {value:'customer_complaint_count',label:i18n.t("statistical.complaintQuantity")},
        {value:'defect',label:i18n.t("statistical.defectQuantity2")}, */
    ],
    //柱状图
    HISTOGRAM:{
        // 柱状图--> iqc业务类型
        iqc_businessTypeList:[
            {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
            {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
            {value:'bad_rate',label:i18n.t("statistical.badRate")},
            {value:'abnormal_count',label:i18n.t("statistical.abnormalQuantity")},
        ],
        // 柱状图 --> iqc统计方式
        iqc_statisticalModeList:[
            {value:'byProduct',label:i18n.t("statistical.product")},
            {value:'byManufacturer',label:i18n.t("statistical.supplier")},
        ],

        // 柱状图--> pqc业务类型
        pqc_businessTypeList:[
            {value:'first_pass_yield',label:i18n.t("statistical.passRate")},
            {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
            {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
            {value:'bad_rate',label:i18n.t("statistical.badRate")},
            {value:'abnormal_count',label:i18n.t("statistical.abnormalQuantity")},
        ],
        // 柱状图 --> pqc统计方式
        pqc_statisticalModeList:[
            {value:'byBatch',label:i18n.t("statistical.batch")},
            {value:'byCustomer',label:i18n.t("statistical.customer")},
            {value:'byInspector',label:i18n.t("statistical.inspector")},
            {value:'byProduct',label:i18n.t("statistical.product")},
            {value:'byLine',label:i18n.t("statistical.productLine2")},
            {value:'byProcess',label:i18n.t("statistical.productProcess2")},
        ],

         // 柱状图--> oqc业务类型
         oqc_businessTypeList:[
            {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
            {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
            {value:'bad_rate',label:i18n.t("statistical.badRate")},
            {value:'abnormal_count',label:i18n.t("statistical.abnormalQuantity")},
        ],
        // 柱状图 --> oqc统计方式
        oqc_statisticalModeList:[
            {value:'byCustomer',label:i18n.t("statistical.customer")},
            {value:'byProduct',label:i18n.t("statistical.product")},
        ],

        // 柱状图--> cc业务类型
        cc_businessTypeList:[
            {value:'customer_complaint_count',label:i18n.t("statistical.complaintQuantity")},
        ],
        // 柱状图 --> cc统计方式
        cc_statisticalModeList:[
            {value:'byCustomer',label:i18n.t("statistical.customer")},
            {value:'byProduct',label:i18n.t("statistical.product")},
            {value:'byHandle',label:i18n.t("statistical.treatmentMethod")},
            {value:'byCause',label:i18n.t("statistical.abnormalCause")},
        ],
    },

    // 饼状图
    PIE_CHART:{
        // 饼状图--> iqc业务类型
        iqc_businessTypeList:[
            {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
            {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
            {value:'bad_rate',label:i18n.t("statistical.badRate")},
            {value:'abnormal_count',label:i18n.t("statistical.abnormalQuantity")},
        ],
        // 饼状图 --> iqc统计方式
        iqc_statisticalModeList:[
            {value:'byProduct',label:i18n.t("statistical.product")},
            {value:'byManufacturer',label:i18n.t("statistical.supplier")},
        ],

        // 饼状图--> pqc业务类型
        pqc_businessTypeList:[
            {value:'first_pass_yield',label:i18n.t("statistical.passRate")},
            {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
            {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
            {value:'bad_rate',label:i18n.t("statistical.badRate")},
            {value:'abnormal_count',label:i18n.t("statistical.abnormalQuantity")},
        ],
        // 饼状图 --> pqc统计方式
        pqc_statisticalModeList:[
            {value:'byBatch',label:i18n.t("statistical.batch")},
            {value:'byCustomer',label:i18n.t("statistical.customer")},
            {value:'byInspector',label:i18n.t("statistical.inspector")},
            {value:'byProduct',label:i18n.t("statistical.product")},
            {value:'byLine',label:i18n.t("statistical.productLine2")},
            {value:'byProcess',label:i18n.t("statistical.productProcess2")},
        ],
        // 饼状图--> oqc业务类型
        oqc_businessTypeList:[
            {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
            {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
            {value:'bad_rate',label:i18n.t("statistical.badRate")},
            {value:'abnormal_count',label:i18n.t("statistical.abnormalQuantity")},
        ],
        // 饼状图 --> oqc统计方式
        oqc_statisticalModeList:[
            // {value:'byBatch',label:i18n.t("statistical.batch")},
            {value:'byCustomer',label:i18n.t("statistical.customer")},
            // {value:'byInspector',label:i18n.t("statistical.inspector")},
            {value:'byProduct',label:i18n.t("statistical.product")},
            // {value:'byLine',label:i18n.t("statistical.productLine2")},
            // {value:'byProcess',label:i18n.t("statistical.productProcess2")},
        ],

        // 饼状图--> cc业务类型
        cc_businessTypeList:[
            {value:'customer_complaint_count',label:i18n.t("statistical.complaintQuantity")},
        ],
        // 饼状图 --> cc统计方式
        cc_statisticalModeList:[
            // {value:'byBatch',label:i18n.t("statistical.batch")},
            {value:'byCustomer',label:i18n.t("statistical.customer")},
            // {value:'byInspector',label:i18n.t("statistical.inspector")},
            {value:'byProduct',label:i18n.t("statistical.product")},
            {value:'byHandle',label:i18n.t("statistical.treatmentMethod")},
            {value:'byCause',label:i18n.t("statistical.abnormalCause")},
            // {value:'byLine',label:i18n.t("statistical.productLine2")},
            // {value:'byProcess',label:i18n.t("statistical.productProcess2")},
        ],

    },
    //趋势图
    TENDENCY_CHART:{
        // 趋势图--> iqc业务类型
        iqc_businessTypeList:[
            {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
            {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
            {value:'bad_rate',label:i18n.t("statistical.badRate")},
            {value:'abnormal_count',label:i18n.t("statistical.abnormalQuantity")},
            {value:'defect',label:i18n.t("statistical.defectQuantity2")},
        ],
        // 趋势图--> pqc业务类型
        pqc_businessTypeList:[
            {value:'first_pass_yield',label:i18n.t("statistical.passRate")},
            {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
            {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
            {value:'bad_rate',label:i18n.t("statistical.badRate")},
            {value:'abnormal_count',label:i18n.t("statistical.abnormalQuantity")},
            {value:'defect',label:i18n.t("statistical.defectQuantity2")},
        ],
        // 趋势图--> oqc业务类型
        oqc_businessTypeList:[
            {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
            {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
            {value:'bad_rate',label:i18n.t("statistical.badRate")},
            {value:'abnormal_count',label:i18n.t("statistical.abnormalQuantity")},
            {value:'defect',label:i18n.t("statistical.defectQuantity2")},
        ],
        // 趋势图--> cc业务类型
        cc_businessTypeList:[
            {value:'customer_complaint_count',label:i18n.t("statistical.complaintQuantity")},
            {value:'defect',label:i18n.t("statistical.defectQuantity2")},
        ],
    },
    //对比图
    CONTRAST_FIGURE:{
        // 对比图--> iqc业务类型
        iqc_businessTypeList:[
            {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
            {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
            {value:'bad_rate',label:i18n.t("statistical.badRate")},
            {value:'abnormal_count',label:i18n.t("statistical.abnormalQuantity")},
        ],
        // 饼状图 --> iqc对比方式
        iqc_statisticalModeList:[
            {value:'byProduct',label:i18n.t("statistical.productNo")},
            {value:'byManufacturer',label:i18n.t("statistical.supplier")},
            {value:'byProductType',label:i18n.t("statistical.productType")},
        ],

        // 对比图--> pqc业务类型
        pqc_businessTypeList:[
            {value:'first_pass_yield',label:i18n.t("statistical.passRate")},
            {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
            {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
            {value:'bad_rate',label:i18n.t("statistical.badRate")},
            {value:'abnormal_count',label:i18n.t("statistical.abnormalQuantity")},
        ],
        // 饼状图 --> pqc对比方式
        pqc_statisticalModeList:[
            {value:'byProductType',label:i18n.t("statistical.productType")},
            {value:'byBatch',label:i18n.t("statistical.batch")},
            {value:'byCustomer',label:i18n.t("statistical.customer")},
            {value:'byClass',label:i18n.t("statistical.inspectionClass")},
            {value:'byInspector',label:i18n.t("statistical.inspector")},
            {value:'byProduct',label:i18n.t("statistical.productNo")},
            {value:'byLine',label:i18n.t("statistical.productLine2")},
            {value:'byProcess',label:i18n.t("statistical.productProcess2")},
        ],

        // 对比图--> oqc业务类型
        oqc_businessTypeList:[
            {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
            {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
            {value:'bad_rate',label:i18n.t("statistical.badRate")},
            {value:'abnormal_count',label:i18n.t("statistical.abnormalQuantity")},
        ],
        // 饼状图 --> oqc对比方式
        oqc_statisticalModeList:[
            {value:'byProductType',label:i18n.t("statistical.productType")},
            {value:'byCustomer',label:i18n.t("statistical.customer")},
            {value:'byProduct',label:i18n.t("statistical.productNo")},
        ],
        // 对比图--> cc业务类型
        cc_businessTypeList:[
            {value:'customer_complaint_count',label:i18n.t("statistical.complaintQuantity")},
        ],
        // 饼状图 --> cc对比方式
        cc_statisticalModeList:[
            {value:'byProductType',label:i18n.t("statistical.productType")},
            {value:'byCustomer',label:i18n.t("statistical.customer")},
            {value:'byProduct',label:i18n.t("statistical.productNo")},
            {value:'byHandle',label:i18n.t("statistical.treatmentMethod")},
            {value:'byCause',label:i18n.t("statistical.abnormalCause")},
        ],
    },
    //排列图
    PARETO_CHART:[
        {iqc_businessTypeList:[]}
    ],

    
    // 以简称明命
    hm_iqc_ac:[
        {value:'byProduct',label:i18n.t("statistical.product")},
        {value:'byManufacturer',label:i18n.t("statistical.supplier")},
        {value:'byCause',label:i18n.t("statistical.abnormalCause")},
        {value:'byHandle',label:i18n.t("statistical.treatmentMethod")},
    ],
    hm_pqc_ar:[//柱状图-->过程--
        {value:'byBatch',label:i18n.t("statistical.batch")},
        {value:'byCustomer',label:i18n.t("statistical.customer")},
        {value:'byClass',label:i18n.t("statistical.inspectionClass")},
        {value:'byInspector',label:i18n.t("statistical.inspector")},
        {value:'byProductType',label:i18n.t("statistical.productType")},
        {value:'byProduct',label:i18n.t("statistical.product")},
        {value:'byLine',label:i18n.t("statistical.productLine2")},
        {value:'byProcess',label:i18n.t("statistical.productProcess2")},
    ],

    hm_pqc_ac:[//柱状图-->过程-->异常次数
        {value:'byProduct',label:i18n.t("statistical.product")},
        {value:'byCustomer',label:i18n.t("statistical.customer")},
        {value:'byHandle',label:i18n.t("statistical.treatmentMethod")},
        {value:'byCause',label:i18n.t("statistical.abnormalCause")},
    ],

    hm_oqc_ac:[//柱状图-->出货-->异常次数
        {value:'acceptance_rate',label:i18n.t("monitor.allowYield")},
        {value:'return_rate',label:i18n.t("statistical.rejectsRate")},
        {value:'byHandle',label:i18n.t("statistical.treatmentMethod")},
        {value:'byCause',label:i18n.t("statistical.abnormalCause")},
    ],
    pc_iqc_ac:[
        {value:'byProduct',label:i18n.t("statistical.product")},
        {value:'byManufacturer',label:i18n.t("statistical.supplier")},
        {value:'byCause',label:i18n.t("statistical.abnormalCause")},
        {value:'byHandle',label:i18n.t("statistical.treatmentMethod")},
    ],
    pc_iqc_ar:[
        {value:'byProduct',label:i18n.t("statistical.product")},
        {value:'byManufacturer',label:i18n.t("statistical.supplier")},
    ],
    pc_pqc_fpy:[//饼状图-->过程-->直通率
        {value:'byBatch',label:i18n.t("statistical.batch")},
        {value:'byCustomer',label:i18n.t("statistical.customer")},
        {value:'byInspector',label:i18n.t("statistical.inspector")},
        {value:'byProduct',label:i18n.t("statistical.product")},
        {value:'byLine',label:i18n.t("statistical.productLine2")},
        {value:'byProcess',label:i18n.t("statistical.productProcess2")},
    ],

    pc_pqc_ar:[//饼状图-->过程-->允收率
        {value:'byBatch',label:i18n.t("statistical.batch")},
        {value:'byCustomer',label:i18n.t("statistical.customer")},
        {value:'byClass',label:i18n.t("statistical.inspectionClass")},
        {value:'byInspector',label:i18n.t("statistical.inspector")},
        {value:'byProduct',label:i18n.t("statistical.product")},
        {value:'byLine',label:i18n.t("statistical.productLine2")},
        {value:'byProcess',label:i18n.t("statistical.productProcess2")},
    ],
    pc_pqc_ac:[//饼状图-->过程-->异常次数
        {value:'byProduct',label:i18n.t("statistical.product")},
        {value:'byCustomer',label:i18n.t("statistical.customer")},
        {value:'byHandle',label:i18n.t("statistical.treatmentMethod")},
        {value:'byCause',label:i18n.t("statistical.abnormalCause")},
    ],
    pc_oqc_ac:[//饼状图--出货--异常次数
        {value:'byCustomer',label:i18n.t("statistical.customer")},
        {value:'byProduct',label:i18n.t("statistical.product")},
        {value:'byHandle',label:i18n.t("statistical.treatmentMethod")},
        {value:'byCause',label:i18n.t("statistical.abnormalCause")},
    ],
    pc_oqc_all3:[//饼状图--出货--允收率/批退率/不良率
        {value:'byProduct',label:i18n.t("statistical.product")},
        {value:'byManufacturer',label:i18n.t("statistical.supplier")},
    ]


}