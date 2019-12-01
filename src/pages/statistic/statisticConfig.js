import numeral from 'numeral';
import $ from 'jquery';

export default {
    "acceptance_rate":{
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.batchQuantity'),field:"total"},{label:i18n.t('statistical.approvalBatchNumber'),field:"pass"},{label:i18n.t('statistical.approvalRate')+"(%)",field:"rate"}],
        columnss:[{label:i18n.t('statistical.productNo'),field:"name"},{label:i18n.t('statistical.productSpec'),field:"prodSpec"},{label:i18n.t('statistical.batchQuantity'),field:"total"},{label:i18n.t('statistical.approvalBatchNumber'),field:"pass"},{label:i18n.t('statistical.approvalRate')+"(%)",field:"rate"}],
        title : i18n.t('statistical.approvalDataSelect'),
        reportTitle : i18n.t('statistical.approvalRate'),
        seriesName:i18n.t('statistical.approvalRate')+"(%)",
        okTxt : "",
        collect: function(rows){
            var totalItem = {label:i18n.t('statistical.batchTotal2'),value:0};
            var totalysItem = {label:i18n.t('statistical.approvalBatchNumber'),value:0};
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

                totalItem.value = total;
                totalysItem.value = total_pass;
                totalyslItem.value = rate+"%";
            }
            return [totalItem,totalysItem,totalyslItem];
        }
    },

    "return_rate":{
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.batchQuantity'),field:"total"},{label:i18n.t('statistical.rejectsBatchNumber'),field:"return"},{label:i18n.t('statistical.rejectsRate')+"(%)",field:"rate"}],
        columnss:[{label:i18n.t('statistical.productNo'),field:"name"},{label:i18n.t('statistical.productSpec'),field:"prodSpec"},{label:i18n.t('statistical.batchQuantity'),field:"total"},{label:i18n.t('statistical.rejectsBatchNumber'),field:"return"},{label:i18n.t('statistical.rejectsRate')+"(%)",field:"rate"}],
        title : i18n.t('statistical.rejectsDataSelect'),
        reportTitle : i18n.t('statistical.rejectsRate'),
        seriesName:i18n.t('statistical.rejectsRate')+"(%)",
        okTxt : "",
        collect: function(rows){
            var totalItem = {label:i18n.t('statistical.batchTotal2'),value:0};
            var totalysItem = {label:i18n.t('statistical.rejectsBatchNumber'),value:0};
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

                totalItem.value = total;
                totalysItem.value = total_pass;
                totalyslItem.value = rate+"%";
            }
            return [totalItem,totalysItem,totalyslItem];
        }
    },

    "bad_rate":{
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.inspectionQuantity'),field:"total"},{label:i18n.t('statistical.badQuantity'),field:"bad"},{label:i18n.t('statistical.badRate')+"(%)",field:"rate"}],
        columnss:[{label:i18n.t('statistical.productNo'),field:"name"},{label:i18n.t('statistical.productSpec'),field:"prodSpec"},{label:i18n.t('statistical.inspectionQuantity'),field:"total"},{label:i18n.t('statistical.badQuantity'),field:"bad"},{label:i18n.t('statistical.badRate')+"(%)",field:"rate"}],
        title : i18n.t('statistical.badDataSelect'),
        reportTitle : i18n.t('statistical.badRate'),
        seriesName:i18n.t('statistical.badRate')+"(%)",
        valueField:"rate",
        okTxt : "",
        collect: function(rows){
            var totalItem = {label:i18n.t('statistical.inspectionTotal'),value:0};
            var totalysItem = {label:i18n.t('statistical.badTotal2'),value:0};
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

                totalItem.value = total;
                totalysItem.value = total_pass;
                totalyslItem.value = rate+"%";
            }
            return [totalItem,totalysItem,totalyslItem];
        }
    },

    "abnormal_count":{
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.inspectionQuantity'),field:"total"},{label:i18n.t('statistical.abnormalQuantity2'),field:"count"},{label:i18n.t('statistical.proportion')+"(%)",field:"rate"}],
        columnss:[{label:i18n.t('statistical.productNo'),field:"name"},{label:i18n.t('statistical.productSpec'),field:"prodSpec"},{label:i18n.t('statistical.inspectionQuantity'),field:"total"},{label:i18n.t('statistical.abnormalQuantity2'),field:"count"},{label:i18n.t('statistical.proportion')+"(%)",field:"rate"}],
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
            var totalItem = {label:i18n.t('statistical.inspectionTotal'),value:0};
            var totalysItem = {label:i18n.t('statistical.abnormalTotal'),value:0};
            var totalyslItem = {label:i18n.t('statistical.totalProportion')+"(%)",value:0};
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

                totalItem.value = total;
                totalysItem.value = total_pass;
                totalyslItem.value = 100+"%";
            }
            return [totalItem,totalysItem,totalyslItem];
        }
    },

    "first_pass_yield":{
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.inputQuantity'),field:"count"},{label:i18n.t('statistical.badQuantity'),field:"bad"},{label:i18n.t('statistical.passRate')+"(%)",field:"fpy"}],
        columnss:[{label:i18n.t('statistical.productNo'),field:"name"},{label:i18n.t('statistical.productSpec'),field:"prodSpec"},{label:i18n.t('statistical.inputQuantity'),field:"count"},{label:i18n.t('statistical.badQuantity'),field:"bad"},{label:i18n.t('statistical.passRate')+"(%)",field:"fpy"}],
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
        columnss:[{label:i18n.t('statistical.productNo'),field:"name"},{label:i18n.t('statistical.productSpec'),field:"prodSpec"},{label:i18n.t('statistical.complaintQuantity'),field:"count"}],
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
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.sampleQunatity'),field:"total"},{label:i18n.t('statistical.qualifiedQuantity'),field:"yield"},{label:i18n.t('statistical.qualifiedRate')+"(%)",field:"rate"}],
        columnss:[{label:i18n.t('statistical.productNo'),field:"name"},{label:i18n.t('statistical.productSpec'),field:"prodSpec"},{label:i18n.t('statistical.sampleQunatity'),field:"total"},{label:i18n.t('statistical.qualifiedQuantity'),field:"yield"},{label:i18n.t('statistical.qualifiedRate')+"(%)",field:"rate"}],
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
        columns:[{label:i18n.t('statistical.name'),field:"name"},{label:i18n.t('statistical.sampleQunatity'),field:"total"},{label:i18n.t('statistical.defectQuantity2'),field:"count"},{label:i18n.t('statistical.proportion')+"(%)",field:"zb"}],
        columnss:[{label:i18n.t('statistical.productNo'),field:"name"},{label:i18n.t('statistical.productSpec'),field:"prodSpec"},{label:i18n.t('statistical.sampleQunatity'),field:"total"},{label:i18n.t('statistical.defectQuantity2'),field:"count"},{label:i18n.t('statistical.proportion')+"(%)",field:"zb"}],
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
          iqc:i18n.t('monitor.iqc'),pqc:i18n.t('monitor.pqc'),oqc:i18n.t('monitor.oqc'),cc:i18n.t('monitor.customerComplaint'),
          first_pass_yield:i18n.t('statistical.passRate'),acceptance_rate:i18n.t('statistical.approvalRate'),return_rate:i18n.t('statistical.rejectsRate'),bad_rate:i18n.t('statistical.badRate'),'abnormal_count':i18n.t('statistical.abnormalQuantity'),'customer_complaint_count':i18n.t('statistical.complaintQuantity'),
          byBatch:i18n.t('statistical.batch'),'byCustomer':i18n.t('statistical.customer'),byManufacturer:i18n.t('statistical.supplier'),'byClass':i18n.t('statistical.inspectionClass'),'byInspector':i18n.t('statistical.inspector'),'byProduct':i18n.t('statistical.product'),'byLine':i18n.t('statistical.productLine2'),'byProcess':i18n.t('statistical.productProcess2'),byCause:i18n.t('statistical.abnormalCause'),byHandle:i18n.t('statistical.treatmentMethod')
    },
    buzParams : {
          'iqc': {
            'acceptance_rate':  {byProduct:'',byManufacturer:''},
            'return_rate':  {byProduct:'',byManufacturer:''},
            'bad_rate':  {byProduct:'',byManufacturer:''},
            'abnormal_count': {byProduct:'',byManufacturer:'',byCause:'',byHandle:''},
          },
          'pqc': {
            'first_pass_yield':  {byBatch:'',byCustomer:'',byInspector:'',byProduct:'',byLine:'',byProcess:''},
            'acceptance_rate':  {byBatch:'',byCustomer:'',byClass:'',byInspector:'',byProduct:'',byLine:'',byProcess:''},
            'return_rate':  {byBatch:'',byCustomer:'',byClass:'',byInspector:'',byProduct:'',byLine:'',byProcess:''},
            'bad_rate':  {byBatch:'',byCustomer:'',byClass:'',byInspector:'',byProduct:'',byLine:'',byProcess:''},
            'abnormal_count': {byProduct:'',byCustomer:'',byHandle:'',byCause:''}
          },
          'oqc': {
            'acceptance_rate':  {byCustomer:'',byProduct:''},
            'return_rate':  {byCustomer:'',byProduct:''},
            'bad_rate':  {byCustomer:'',byProduct:''},
            'abnormal_count': {byCustomer:'',byProduct:'',byHandle:'',byCause:''},
          },
          'cc': {
            'customer_complaint_count':{byCustomer:'',byProduct:'',byHandle:'',byCause:''}
          }
    },
    /* colorList: ['#c23535','#ff9999','#9933cc','#cccc66','#006666'
    ,'#ff9900','#ff99cc','#669966','#33cccc','#3333ff'
    ,'#ff3366','#999933','#9999ff','#405e05','#ffff00'
    ,'#ff6600','#00ffff','#0099ff','#996600'], */
    // colorList:["#95F05D", "#C9690C", "#975FE4", "#FFD736", "#5DA0F0", "#21A4BF","#2981CC","#FA9737","#EC63F2","#FAD337","#29CCCC","#B10DB9","#F2637B","#A51E34"],
    colorList:["#4fa8f9", "#6ec71e", "#f56e6a", "#fc8b40", "#818af8", "#31c9d7", "#f35e7a", "#ab7aee", "#14d68b", "#edb00d"],
    // pieColorList: ["#95F05D", "#C9690C", "#975FE4", "#FFD736", "#5DA0F0", "#21A4BF","#2981CC","#FA9737","#EC63F2","#FAD337","#29CCCC","#B10DB9","#F2637B","#A51E34"],
    pieColorList:["#4fa8f9", "#6ec71e", "#f56e6a", "#fc8b40", "#818af8", "#31c9d7", "#f35e7a", "#ab7aee", "#14d68b", "#edb00d"],

    //yFormatter
}
