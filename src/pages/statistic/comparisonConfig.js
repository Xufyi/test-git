import numeral from 'numeral';
import $ from 'jquery';

export default {
    "acceptance_rate":{
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.batchQuantity'),field:"total"},
            {label:i18n.t('statistical.approvalBatchNumber'),field:"pass"},{label:i18n.t('statistical.approvalRate')+"(%)",field:"rate"}],
        title : i18n.t('statistical.approvalDataSelect'),
        reportTitle : i18n.t('statistical.approvalRate'),
        seriesName:i18n.t('statistical.approvalRate')+"(%)",
        okTxt : "",
        collect: function(rows){
            // var totalItem = {label:"总批数",value:0};
            // var totalysItem = {label:i18n.t('statistical.approvalBatchNumber'),value:0};
            var totalyslItem = {label:i18n.t('statistical.approvalRateTotal'),value:0};
            var total = 0;
            var total_pass = 0;
            var rate = 0;
            if(rows){
                $(rows).each(function (index, item) {
                    total += item.total;
                    total_pass += item.pass;
                });

                rate = numeral(total_pass/total*100.0).format('0.00');

                // totalItem.value = total;
                // totalysItem.value = total_pass;
                totalyslItem.value = rate+"%";
            }
            return [totalyslItem];
        }
    },

    "return_rate":{
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.batchQuantity'),field:"total"},
            {label:i18n.t('statistical.rejectsBatchNumber'),field:"return"},{label:i18n.t('statistical.rejectsRate')+"(%)",field:"rate"}],
        title : i18n.t('statistical.rejectsDataSelect'),
        reportTitle : i18n.t('statistical.rejectsRate'),
        seriesName:i18n.t('statistical.rejectsRate')+"(%)",
        okTxt : "",
        collect: function(rows){
            // console.log(rows,33333);
            
            /* var totalItem = {label:"总批数",value:0};
            var totalysItem = {label:i18n.t('statistical.rejectsBatchNumber'),value:0}; */
            var totalyslItem = {label:i18n.t('statistical.rejectsRateTotal'),value:0};
            var total = 0;
            var total_pass = 0;
            var rate = 0;
            if(rows){
                $(rows).each(function (index, item) {
                    total += item.total;
                    total_pass += item["return"];
                });

                rate = numeral(total_pass/total*100.0).format('0.00');

                /* totalItem.value = total;
                totalysItem.value = total_pass; */
                totalyslItem.value = rate+"%";
            }
            return [/* totalItem,totalysItem, */totalyslItem];
        }
    },

    "bad_rate":{
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.inspectionQuantity'),field:"total"},
            {label:i18n.t('statistical.badQuantity'),field:"bad"},{label:i18n.t('statistical.badRate')+"(%)",field:"rate"}],
        title : "不良率数据选择",
        reportTitle : i18n.t('statistical.badRate'),
        seriesName:i18n.t('statistical.badRate')+"(%)",
        valueField:"rate",
        okTxt : "",
        collect: function(rows){
            /* var totalItem = {label:"总检验数",value:0};
            var totalysItem = {label:"总不良数",value:0}; */
            var totalyslItem = {label:i18n.t('statistical.badRateTotal'),value:0};
            var total = 0;
            var total_pass = 0;
            var rate = 0;
            if(rows){
                $(rows).each(function (index, item) {
                    total += item.total;
                    total_pass += item["bad"];
                });

                rate = numeral(total_pass/total*100.0).format('0.00');

               /*  totalItem.value = total;
                totalysItem.value = total_pass; */
                totalyslItem.value = rate+"%";
            }
            return [/* totalItem,totalysItem, */totalyslItem];
        }
    },

    "abnormal_count":{
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.inspectionQuantity'),field:"total"},
            {label:i18n.t('statistical.abnormalQuantity'),field:"count"},{label:i18n.t('statistical.proportion')+"(%)",field:"rate"}],
        title : i18n.t('statistical.abnormalDataSelect'),
        reportTitle : i18n.t('statistical.abnormalQuantity'),
        seriesName:i18n.t('statistical.abnormalQuantity'),
        valueField:"count",
        okTxt : "",
        yFormatter:function (value, index) {
            if(index == 0){
                return "0";
            }else{
                return value;
            }
        },
        collect: function(rows){
           /*  var totalItem = {label:"总检验数",value:0};
            var totalysItem = {label:"总异常数",value:0}; */
            var totalyslItem = {label:i18n.t('statistical.proportionTotal')+"(%)",value:0};
            var total = 0;
            var total_pass = 0;
            var rate = 0;
            if(rows){
                $(rows).each(function (index, item) {
                //   console.log(rows,"11111");
                    total += item.total;
                    total_pass += item["count"];
                });

                rate = numeral(total_pass/total*100.0).format('0.00');

               /*  totalItem.value = total;
                totalysItem.value = total_pass; */
                totalyslItem.value = 100+"%";
            }
            return [/* totalItem,totalysItem, */totalyslItem];
        }
    },

    "first_pass_yield":{
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.inputQuantity'),field:"count"},
            {label:i18n.t('statistical.badQuantity'),field:"bad"},{label:i18n.t('statistical.passRate')+"(%)",field:"fpy"}],
        title : i18n.t('statistical.passDataSelect'),
        reportTitle : i18n.t('statistical.passRate'),
        seriesName:i18n.t('statistical.passRate')+"(%)",
        valueField:"fpy",
        okTxt : "",
        yFormatter:function (value, index) {
            if(index == 0){
                return "0%";
            }else{
                return value+"%";
            }
        },
        collect: function(rows){
            var totalItem = {label:i18n.t('statistical.inputTotal'),value:0};
            var totalysItem = {label:i18n.t('statistical.badTotal2'),value:0};
            var totalyslItem = {label:i18n.t('statistical.passRateTotal')+"(%)",value:0};
            var total = 0;
            var total_pass = 0;
            var rate = 0;
            if(rows){
                $(rows).each(function (index, item) {
                    total += item.count;
                    total_pass += item["bad"];
                });

                rate = numeral(100-total_pass/total*100.0).format('0.00');
                if(rate < 0){
                  rate = 0;
                }

                totalItem.value = total;
                totalysItem.value = total_pass;
                totalyslItem.value = rate+"%";
            }
            return [totalItem,totalysItem,totalyslItem];
        }
    },

    "customer_complaint_count":{
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.complaintQuantity'),field:"count"}],
        title : i18n.t('statistical.complaintDataSelect'),
        reportTitle : i18n.t('statistical.complaintQuantity'),
        seriesName:i18n.t('statistical.complaintQuantity'),
        valueField:"count",
        okTxt : "",
        yFormatter:function (value, index) {
            if(index == 0){
                return "0";
            }else{
                return value+"";
            }
        },
        collect: function(rows){
            var totalItem = {label:i18n.t('statistical.complaintTotal2'),value:0};
            var total = 0;
            if(rows){
                $(rows).each(function (index, item) {
                    total += item.count;
                });
                totalItem.value = total;
            }
            return [totalItem];
        }
    },

    "yield_rate":{
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.sampleQunatity'),field:"total"},
            {label:i18n.t('statistical.qualifiedQuantity'),field:"yield"},{label:i18n.t('statistical.qualifiedRate')+"(%)",field:"rate"}],
        title : i18n.t('statistical.qualifiedDataSelect'),
        reportTitle : i18n.t('statistical.qualifiedRate'),
        seriesName:i18n.t('statistical.qualifiedRate')+"(%)",
        valueField:"rate",
        okTxt : "",
        collect: function(rows){
            var totalItem = {label:i18n.t('statistical.sampleTotal'),value:0};
            var totalysItem = {label:i18n.t('statistical.qualifiedTotal'),value:0};
            var totalyslItem = {label:i18n.t('statistical.qualifiedRateTotal'),value:0};
            var total = 0;
            var total_pass = 0;
            var rate = 0;
            if(rows){
                $(rows).each(function (index, item) {
                    total += item.total;
                    total_pass += item["yield"];
                });

                rate = numeral(total_pass/total*100.0).format('0.00');

                totalItem.value = total;
                totalysItem.value = total_pass;
                totalyslItem.value = rate+"%";
            }
            return [totalItem,totalysItem,totalyslItem];
        }
    },

    "defect":{
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.sampleQunatity'),field:"total"},
            {label:i18n.t('statistical.defectQuantity2'),field:"count"},{label:"占比(%)",field:"zb"}],
        title : i18n.t('statistical.defectDataSelect'),
        reportTitle : i18n.t('statistical.defectQuantity2'),
        seriesName:i18n.t('statistical.defectQuantity2'),
        valueField:"count",
        okTxt : "",
        collect: function(rows){
            var totalItem = {label:i18n.t('statistical.sampleTotal'),value:0};
            var totalysItem = {label:i18n.t('statistical.defectQuantity2'),value:0};
            var total = 0;
            var total_pass = 0;
            var rate = 0;
            if(rows){
                $(rows).each(function (index, item) {
                    total += item.total;
                    total_pass += item["count"];
                });

                //rate = numeral(total_pass/total*100.0).format('0.00');

                totalItem.value = total;
                totalysItem.value = total_pass;
            }
            return [totalItem,totalysItem];
        }
    },


    buzNameMap: {
          iqc:i18n.t('statistical.incoming'),pqc:i18n.t('statistical.process'),oqc:i18n.t('statistical.outgoing'),cc:i18n.t('statistical.complaint'),
          first_pass_yield:i18n.t('statistical.passRate'),acceptance_rate:i18n.t('statistical.approvalRate'),return_rate:i18n.t('statistical.rejectsRate'),bad_rate:i18n.t('statistical.badRate'),'abnormal_count':i18n.t('statistical.abnormalQuantity'),'customer_complaint_count':i18n.t('statistical.complaintQuantity'),
          byBatch:i18n.t('statistical.batch'),'byCustomer':i18n.t('statistical.customer'),byManufacturer:i18n.t('statistical.supplier'),'byClass':i18n.t('statistical.inspectionClass'),'byInspector':i18n.t('statistical.inspector'),'byProduct':i18n.t('statistical.productNo'),'byProductType':i18n.t('statistical.productType'),'byLine':i18n.t('statistical.productLine2'),'byProcess':i18n.t('statistical.productProcess2'),byCause:i18n.t('statistical.abnormalCause'),byHandle:i18n.t('statistical.treatmentMethod')
    },
    buzParams : {
          'iqc': {
            'acceptance_rate':  {byProduct:'',byManufacturer:'',byProductType:''},
            'return_rate':  {byProduct:'',byManufacturer:'',byProductType:''},
            'bad_rate':  {byProduct:'',byManufacturer:'',byProductType:''},
            'abnormal_count': {byProduct:'',byManufacturer:'',byCause:'',byHandle:'',byProductType:''},
          },
          'pqc': {
            'first_pass_yield':  {byProductType:'',byBatch:'',byCustomer:'',byInspector:'',byProduct:'',byLine:'',byProcess:''},
            'acceptance_rate':  {byProductType:'',byBatch:'',byCustomer:'',byClass:'',byInspector:'',byProduct:'',byLine:'',byProcess:''},
            'return_rate':  {byProductType:'',byBatch:'',byCustomer:'',byClass:'',byInspector:'',byProduct:'',byLine:'',byProcess:''},
            'bad_rate':  {byProductType:'',byBatch:'',byCustomer:'',byClass:'',byInspector:'',byProduct:'',byLine:'',byProcess:''},
            'abnormal_count': {byProductType:'',byProduct:'',byCustomer:'',byHandle:'',byCause:'',byProcess:'',byLine:''}
          },
          'oqc': {
            'acceptance_rate':  {byProductType:'',byCustomer:'',byProduct:''},
            'return_rate':  {byProductType:'',byCustomer:'',byProduct:''},
            'bad_rate':  {byProductType:'',byCustomer:'',byProduct:''},
            'abnormal_count': {byProductType:'',byCustomer:'',byProduct:'',byHandle:'',byCause:''},
          },
          'cc': {
            'customer_complaint_count':{byProductType:'',byCustomer:'',byProduct:'',byHandle:'',byCause:''}
          }
    },
    /* colorList: ['#c23535','#ff9999','#9933cc','#cccc66','#006666'
    ,'#ff9900','#ff99cc','#669966','#33cccc','#3333ff'
    ,'#ff3366','#999933','#9999ff','#405e05','#ffff00'
    ,'#ff6600','#00ffff','#0099ff','#996600'], */
    colorList:["#95F05D", "#C9690C", "#975FE4", "#FFD736", "#5DA0F0", "#21A4BF","#2981CC","#FA9737","#EC63F2","#FAD337","#29CCCC","#B10DB9","#F2637B","#A51E34"],
    pieColorList: ["#95F05D", "#C9690C", "#975FE4", "#FFD736", "#5DA0F0", "#21A4BF","#2981CC","#FA9737","#EC63F2","#FAD337","#29CCCC","#B10DB9","#F2637B","#A51E34"],

    //yFormatter
}