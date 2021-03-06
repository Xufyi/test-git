import utils from '@/utils/Common'

export default {
  samplingPlans:{
    "105E":{
      "level":[
        {
          label:"一般检验水准Ⅰ",
          key:1,
          value:"1"
        },{
          label:"一般检验水准Ⅱ",
          key:2,
          value:"2"
        },{
          label:"一般检验水准Ⅲ",
          key:3,
          value:"3"
        },{
          label:"特殊检验水准S1",
          key:4,
          value:"101"
        },{
          label:"特殊检验水准S2",
          key:5,
          value:"102"
        },{
          label:"特殊检验水准S3",
          key:6,
          value:"103"
        }, {
          label: "特殊检验水准S4",
          key:7,
          value: "104"
        }
      ],
      "tolerance":[
        {
          "label":"一般",
          "value":"normal"
        },
        {
          "label":"加严",
          "value":"stricter"
        },
        {
          "label":"减量",
          "value":"soften"
        }
      ],
      "aql":[
        "0.010",
        "0.015",
        "0.025",
        "0.040",
        "0.065",
        "0.10",
        "0.15",
        "0.25",
        "0.40",
        "0.65",
        "1.0",
        "1.5",
        "2.5",
        "4.0",
        "6.5",
        "10",
        "15",
        "25",
        "40",
        "65",
        "100",
        "150",
        "250",
        "400",
        "650",
        "1000"
      ]
    }
    ,"Z1-4":{
      "level":[
        {
          label:"一般检验水准Ⅰ",
          key:8,
          value:"1"
        },{
          label:"一般检验水准Ⅱ",
          key:9,
          value:"2"
        },{
          label:"一般检验水准Ⅲ",
          key:10,
          value:"3"
        }
      ],
      "tolerance":[
        {
          "label":"一般",
          "value":"normal"
        },
        {
          "label":"加严",
          "value":"stricter"
        },
        {
          "label":"减量",
          "value":"soften"
        }
      ],
      "aql":[
        "0.010",
        "0.015",
        "0.025",
        "0.040",
        "0.065",
        "0.10",
        "0.15",
        "0.25",
        "0.40",
        "0.65",
        "1.0",
        "1.5",
        "2.5",
        "4.0",
        "6.5",
        "10"
      ]
    }
    ,"0D":{
      "level":[
        {
          label:"零缺陷",
          key:11,
          value:"1"
        }
      ],
      "tolerance":[
        {
          "label":"零缺陷",
          "value":"normal"
        }
      ],
      "aql":[
        "0.010",
        "0.015",
        "0.025",
        "0.040",
        "0.065",
        "0.10",
        "0.15",
        "0.25",
        "0.40",
        "0.65",
        "1.0",
        "1.5",
        "2.5",
        "4.0",
        "6.5",
        "10"
      ]
    },"GB/T2828.1-2012":{
      "level":[
        {
          label:"一般检验水准Ⅰ",
          key:1,
          value:"1"
        },{
          label:"一般检验水准Ⅱ",
          key:2,
          value:"2"
        },{
          label:"一般检验水准Ⅲ",
          key:3,
          value:"3"
        },{
          label:"特殊检验水准S1",
          key:4,
          value:"101"
        },{
          label:"特殊检验水准S2",
          key:5,
          value:"102"
        },{
          label:"特殊检验水准S3",
          key:6,
          value:"103"
        }, {
          label: "特殊检验水准S4",
          key:7,
          value: "104"
        }
      ],
      "tolerance":[
        {
          "label":"一般",
          "value":"normal"
        },
        {
          "label":"加严",
          "value":"stricter"
        },
        {
          "label":"减量",
          "value":"soften"
        }
      ],
      "aql":[
        "0.010",
        "0.015",
        "0.025",
        "0.040",
        "0.065",
        "0.10",
        "0.15",
        "0.25",
        "0.40",
        "0.65",
        "1.0",
        "1.5",
        "2.5",
        "4.0",
        "6.5",
        "10",
        "15",
        "25",
        "40",
        "65",
        "100",
        "150",
        "250",
        "400",
        "650",
        "1000"
      ]
    }
  },
  dataShortcuts:{
    common:[
      {
        text: '今天',
        value() {
          const end = utils.getDayEnd();
          const start = utils.getDayStart(1);
          return [start, end];
        }
      },{
        text: '昨天',
        value() {
          const end = utils.getDayStart(1)-1;
          const start = utils.getDayStart(2);
          return [start, end];
        }
      },{
        text: '近7天',
        value() {
          const end = utils.getDayEnd();
          const start = utils.getDayStart(7);
          return [start, end];
        }
      },
      {
        text: '近14天',
        value() {
          const end = utils.getDayEnd();
          const start = utils.getDayStart(14);
          return [start, end];
        }
      },
      {
        text: '近30天',
        value() {
          const end = utils.getDayEnd();
          const start = utils.getDayStart(30);
          return [start, end];
        }
      },
      {
        text: '近90天',
        value() {
          const end = utils.getDayEnd();
          const start = utils.getDayStart(90);
          return [start, end];
        }
      }

    ]
  },
  permissions:[
    "home",
    "home.shortcut",
    "home.profile",
    "home.change_password",
    "home.message",
    "home.rty",
    "monitor",
    "monitor.read",
    "monitor.export",
    "quality_plan",
    "quality_plan.inspection",
    "quality_plan.inspection.product_type",
    "quality_plan.inspection.product_type.read",
    "quality_plan.inspection.product_type.create",
    "quality_plan.inspection.product_type.update",
    "quality_plan.inspection.product_type.delete",
    "quality_plan.inspection.product_type.export",
    "quality_plan.inspection.product_unit",
    "quality_plan.inspection.product_unit.read",
    "quality_plan.inspection.product_unit.create",
    "quality_plan.inspection.product_unit.update",
    "quality_plan.inspection.product_unit.delete",
    "quality_plan.inspection.product_unit.export",
    "quality_plan.inspection.product_line",
    "quality_plan.inspection.product_line.read",
    "quality_plan.inspection.product_line.create",
    "quality_plan.inspection.product_line.update",
    "quality_plan.inspection.product_line.delete",
    "quality_plan.inspection.product_line.export",
    "quality_plan.inspection.meas_unit",
    "quality_plan.inspection.meas_unit.read",
    "quality_plan.inspection.meas_unit.create",
    "quality_plan.inspection.meas_unit.update",
    "quality_plan.inspection.meas_unit.delete",
    "quality_plan.inspection.meas_unit.export",
    "quality_plan.inspection.device",
    "quality_plan.inspection.device.read",
    "quality_plan.inspection.device.create",
    "quality_plan.inspection.device.update",
    "quality_plan.inspection.device.delete",
    "quality_plan.inspection.device.export",
    "quality_plan.inspection.shift",
    "quality_plan.inspection.shift.read",
    "quality_plan.inspection.shift.create",
    "quality_plan.inspection.shift.update",
    "quality_plan.inspection.shift.delete",
    "quality_plan.inspection.shift.export",
    "quality_plan.defect",
    "quality_plan.defect.inspection_type",
    "quality_plan.defect.inspection_type.read",
    "quality_plan.defect.inspection_type.create",
    "quality_plan.defect.inspection_type.update",
    "quality_plan.defect.inspection_type.delete",
    "quality_plan.defect.inspection_type.export",
    "quality_plan.defect.defect_type",
    "quality_plan.defect.defect_type.read",
    "quality_plan.defect.defect_type.create",
    "quality_plan.defect.defect_type.update",
    "quality_plan.defect.defect_type.delete",
    "quality_plan.defect.defect_type.export",
    "quality_plan.defect.location",
    "quality_plan.defect.location.read",
    "quality_plan.defect.location.create",
    "quality_plan.defect.location.update",
    "quality_plan.defect.location.delete",
    "quality_plan.defect.location.export",
    "quality_plan.defect.review",
    "quality_plan.defect.review.read",
    "quality_plan.defect.review.create",
    "quality_plan.defect.review.update",
    "quality_plan.defect.review.delete",
    "quality_plan.defect.review.export",
    "quality_plan.defect.abnormal_cause",
    "quality_plan.defect.abnormal_cause.read",
    "quality_plan.defect.abnormal_cause.create",
    "quality_plan.defect.abnormal_cause.update",
    "quality_plan.defect.abnormal_cause.delete",
    "quality_plan.defect.abnormal_cause.export",
    "quality_plan.defect.solution",
    "quality_plan.defect.solution.read",
    "quality_plan.defect.solution.create",
    "quality_plan.defect.solution.update",
    "quality_plan.defect.solution.delete",
    "quality_plan.defect.solution.export",
    "quality_plan.defect.quality_level",
    "quality_plan.defect.quality_level.read",
    "quality_plan.defect.quality_level.create",
    "quality_plan.defect.quality_level.update",
    "quality_plan.defect.quality_level.delete",
    "quality_plan.defect.quality_level.export",
    "quality_plan.process",
    "quality_plan.process.product_process",
    "quality_plan.process.product_process.read",
    "quality_plan.process.product_process.create",
    "quality_plan.process.product_process.update",
    "quality_plan.process.product_process.delete",
    "quality_plan.process.product_process.export",
    "quality_plan.process.product_task",
    "quality_plan.process.product_task.read",
    "quality_plan.process.product_task.create",
    "quality_plan.process.product_task.update",
    "quality_plan.process.product_task.delete",
    "quality_plan.process.product_task.export",
    "quality_plan.sample_plan",
    "quality_plan.image_rule",
    "quality_plan.image_rule.read",
    "quality_plan.image_rule.create",
    "quality_plan.image_rule.update",
    "quality_plan.image_rule.delete",
    "quality_plan.image_rule.export",
    "quality_plan.strict_rule",
    "quality_plan.strict_rule.read",
    "quality_plan.strict_rule.create",
    "quality_plan.strict_rule.update",
    "quality_plan.strict_rule.delete",
    "quality_plan.strict_rule.export",
    "base",
    "base.product",
    "base.product.read",
    "base.product.create",
    "base.product.update",
    "base.product.delete",
    "base.product.export",
    "base.customer",
    "base.customer.customer_type",
    "base.customer.customer_type.read",
    "base.customer.customer_type.create",
    "base.customer.customer_type.update",
    "base.customer.customer_type.delete",
    "base.customer.customer_type.export",
    "base.customer.customers",
    "base.customer.customers.read",
    "base.customer.customers.create",
    "base.customer.customers.update",
    "base.customer.customers.delete",
    "base.customer.customers.export",
    "base.manufacturer",
    "base.manufacturer.manufacturer_type",
    "base.manufacturer.manufacturer_type.read",
    "base.manufacturer.manufacturer_type.create",
    "base.manufacturer.manufacturer_type.update",
    "base.manufacturer.manufacturer_type.delete",
    "base.manufacturer.manufacturer_type.export",
    "base.manufacturer.manufacturers",
    "base.manufacturer.manufacturers.read",
    "base.manufacturer.manufacturers.create",
    "base.manufacturer.manufacturers.update",
    "base.manufacturer.manufacturers.delete",
    "base.manufacturer.manufacturers.export",
    "base.manufacturer.reviewmanagement",
    "base.manufacturer.reviewmanagement.read",
    "base.manufacturer.reviewmanagement.create",
    "base.manufacturer.reviewmanagement.update",
    "base.manufacturer.reviewmanagement.delete",
    "base.manufacturer.reviewmanagement.export",
    "base.manufacturer.scoremanagement",
    "base.manufacturer.scoremanagement.read",
    "base.manufacturer.scoremanagement.create",
    "base.manufacturer.scoremanagement.update",
    "base.manufacturer.scoremanagement.delete",
    "base.manufacturer.scoremanagement.export",
    "base.manufacturer.standardsetting",
    "base.manufacturer.standardsetting.read",
    "base.manufacturer.standardsetting.update",
    "exam",
    "exam.pqc",
    "exam.pqc.batch",
    "exam.pqc.batch.read",
    "exam.pqc.batch.create",
    "exam.pqc.batch.update",
    "exam.pqc.batch.delete",
    "exam.pqc.batch.export",
    "exam.pqc.pqc",
    "exam.pqc.pqc.read",
    "exam.pqc.pqc.create",
    "exam.pqc.pqc.update",
    "exam.pqc.pqc.delete",
    "exam.pqc.pqc.export",
    "exam.pqc.pqc.check",
    "exam.pqc.bad_record",
    "exam.pqc.bad_record.read",
    "exam.pqc.bad_record.create",
    "exam.pqc.bad_record.update",
    "exam.pqc.bad_record.delete",
    "exam.pqc.bad_record.export",
    "exam.pqc.inspection_record",
    "exam.pqc.inspection_record.read",
    "exam.pqc.inspection_record.create",
    "exam.pqc.inspection_record.update",
    "exam.pqc.inspection_record.delete",
    "exam.pqc.inspection_record.export",
    "exam.pqc.data_record",
    "exam.pqc.data_record.read",
    "exam.pqc.data_record.create",
    "exam.pqc.data_record.update",
    "exam.pqc.data_record.delete",
    "exam.pqc.data_record.export",
    "exam.iqc",
    "exam.iqc.read",
    "exam.iqc.create",
    "exam.iqc.update",
    "exam.iqc.delete",
    "exam.iqc.export",
    "exam.iqc.check",
    "exam.oqc",
    "exam.oqc.read",
    "exam.oqc.create",
    "exam.oqc.update",
    "exam.oqc.delete",
    "exam.oqc.export",
    "exam.oqc.check",
    "exam.abnormal_list",
    "exam.abnormal_list.read",
    "exam.abnormal_list.create",
    "exam.abnormal_list.update",
    "exam.abnormal_list.delete",
    "exam.abnormal_list.export",
    "exam.abnormal_list.handle",
    "exam.complaint",
    "exam.complaint.read",
    "exam.complaint.create",
    "exam.complaint.update",
    "exam.complaint.delete",
    "exam.complaint.export",
    "system",
    "system.company",
    "system.company.desccription",
    "system.company.desccription.read",
    "system.company.desccription.update",
    "system.company.user",
    "system.company.user.read",
    "system.company.user.create",
    "system.company.user.update",
    "system.company.user.delete",
    "system.company.user.export",
    "system.company.user.reset_password",
    "system.company.role",
    "system.company.role.read",
    "system.company.role.create",
    "system.company.role.update",
    "system.company.role.delete",
    "system.company.role.export",
    "system.company.role.permission",
    "system.company.role.permission.read",
    "system.company.role.permission.create",
    "system.company.department",
    "system.company.department.read",
    "system.company.department.create",
    "system.company.department.update",
    "system.company.department.delete",
    "system.company.department.export",
    "system.system",
    "system.system.module",
    "system.system.log",
    "help"
  ],
  unitList:[
    {
      type:'尺寸',
      units:['mm','cm','dm','m','km'],
      multiple:[10,10,10,100]
    },
    {
      type:'重量',
      units:['mg','g','kg'],
      multiple:[1000,1000]
    },
    {
      type:'电感',
      units:['uh','mh','h'],
      multiple:[1000,1000]
    },
    {
      type:'电容',
      units:['pf','nf','uf','f'],
      multiple:[1000,1000,1000000]
    }
  ]
}
