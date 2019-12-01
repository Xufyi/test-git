
String.prototype.replaceAll = function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);
}

function resizeImage(){
    var imgId = window.iqis_param_imgId;
    var img = document.getElementById(imgId);

    var pwidth = 1164;

    if(img && img.naturalWidth){
        var naturalWidth = img.naturalWidth;
        var naturalHeight = img.naturalHeight;
        img.style.width = pwidth+"px";
        // alert(img.style.width)
        img.style.marginLeft = "18px";
        img.style.height = ( naturalHeight* (pwidth*1.0/naturalWidth) )+"px";
        // alert(img.style.height)
        console.log(naturalWidth,'x')
        console.log(naturalHeight,'y')
        if(naturalWidth == 633 && naturalHeight == 420){
            img.style.width = 411+"px";
            img.style.height = 400+"px";
        }
        window.iqis_print_image1_rr = naturalWidth/naturalHeight;

        // setTimeout(splitPage,100);

    }else{
        console.log("ops!");
        setTimeout(resizeImage,100);
    }
}

function initPrint(){
    // var imgId = window.iqis_param_imgId;
    var dataUrl = window.iqis_param_imgDataUrl;
    var chartId = window.iqis_param_chartId || "exam-report-chart";

    console.log(chartId);

    var erc = document.getElementById(chartId);
    var nerc = document.createElement("div");
    // var ncimg = document.createElement("img");
    var div = document.createElement("div");
    var divFooter = document.createElement("div");
    var divFooterSpan = document.createElement("span");
    divFooterSpan.innerHTML='<table class="exam-report-footer"><tbody><tr><td width="200px">确认：</td> <td width="200px">复审：</td> <td width="200px">制表：</td> <td></td> <td></td></tr></tbody></table>'
    divFooter.appendChild(divFooterSpan);
    var innerHtml = document.getElementById('htmls').innerHTML
    div.innerHTML = innerHtml
    // ncimg.id = imgId;
    // ncimg.src = dataUrl;
    // nerc.appendChild(ncimg);
    nerc.appendChild(div);
    nerc.appendChild(divFooter);

    erc.parentElement.replaceChild(nerc,erc);

    setTimeout(resizeImage,1);
}

setTimeout(initPrint,500);

var specialElementHandlers = {
    '#editor': function(element, renderer){
        return true;
    }
};

function saveAsPdf(){
    $("#saveBtn").hide();
    $("#saveBtn").parent().append("<span class='tip-text'>下载中...</span>");
    // var doc = new jsPDF('landscape');
    var doc = new jsPDF('p', 'pt', 'a4');
    var pages = $(".print-page");
    var cmpPages = {};
    var cmpCount = 0;

    var reportDate = $(".report-title-date-txt").text()+"";
    // reportDate = reportDate || (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        reportDate = reportDate
    reportDate = reportDate.replaceAll(":","").replaceAll("-","").replaceAll(" ","");

    pages.each(function (index,pageEl) {
        html2canvas(document.querySelector("#page-"+(index+1)),{scale:1.5}).then(function(canvas){
            var rrr = canvas.width*1.0 / canvas.height;
            console.log(rrr);
            cmpPages["page"+index] = {dataUrl:canvas.toDataURL('image/png'),rr:rrr};
            cmpCount++;
            if(cmpCount == pages.length){
                for(var i=0;i<cmpCount;i++){
                    var p = cmpPages["page"+(i)];
                    if(i != 0){
                        doc.addPage();
                    }
                    doc.addImage(p.dataUrl, 'JPEG', 10, 10, 575, 575/p.rr);
                }
                doc.save('report-'+reportDate+'.pdf');
                $("#saveBtn").show();
                $("#saveBtn").parent().find(".tip-text").remove();
            }
        });
    });



    //
    // doc.fromHTML($('#'+contentId).get(0), 15, 15, {
    //     'width': 170,
    //     'elementHandlers': specialElementHandlers
    // });
    // 1.418
    //doc.addImage(window.iqis_param_imgDataUrl, 'JPEG', 1, 1, 295, 295/window.iqis_print_image1_rr);
    //doc.save('Test.pdf');
}

function splitPage(){
    var cArr = $("#exam-report").children();
    var pageIndex = 1;
    var currHeight = 0;
    var page = $("<div class='print-page' id='page-"+pageIndex+"'></div>");

    for(var i=0;i<3;i++){
        currHeight += $(cArr[i]).height();
        page.append(cArr[i]);
    }
    var maxPageHeight = 736;//846-110
    //846

    var footerClass = window.iqis_param_footer || ".exam-report-footer";
    var tableClass = window.iqis_param_table || ".exam-report-datas-table";

    var pageFoot = $(footerClass);
    var footerHeight = pageFoot.height();

    var table = $(tableClass);



    $("#exam-report").append(page);

    if(table.is(":visible")){
        var trs = table.find("tr");
        console.log(trs.length);
        var thead = trs[0].outerHTML;
        trs[0].remove();
        var subTable = $("<table class='exam-report-datas-table'>"+thead+"</table>");
        var r=1;
        if(trs.length > r){
            page.append(subTable);
        }
        for(;r<trs.length;r++){
            var tr = $(trs[r]);
            console.log(r);
            console.log(trs.length);
            currHeight += tr.height();
            if(currHeight < maxPageHeight){
                subTable.append(tr);
                console.log("add to page");
            }else{
                pageIndex++;
                page = $("<div class='print-page' id='page-"+pageIndex+"'></div>");
                $("#exam-report").append("<div class='print-page-gap'></div><div class='page-break'></div>")
                $("#exam-report").append(page);
                page.append($(window.iqis_param_pageHead));
                subTable = $("<table class='exam-report-datas-table'>"+thead+"</table>");
                subTable.append(tr);
                page.append(subTable);
                currHeight = page.height();
                console.log("new height:"+currHeight);
            }
        }
    }

    var pagerSpans = $(".report-title-pager-txt");
    pagerSpans.each(function(index,span){
        $(span).text((index+1)+"/"+pagerSpans.length);
    })

    page.append(pageFoot);

    $("#saveBtn").show();
}