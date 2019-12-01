var calculationParameters = [
    { "GroupSize": 2, "A1": 2.659, "A2": 1.88, "B3": 0.0, "B4": 3.267, "D3": 0.0, "D4": 3.267, "d2": 1.128, "c4": 0.7979 },
    { "GroupSize": 3, "A1": 1.954, "A2": 1.023, "B3": 0.0, "B4": 2.568, "D3": 0.0, "D4": 2.575, "d2": 1.693, "c4": 0.8862 },
    { "GroupSize": 4, "A1": 1.628, "A2": 0.729, "B3": 0.0, "B4": 2.266, "D3": 0.0, "D4": 2.282, "d2": 2.059, "c4": 0.9213 },
    { "GroupSize": 5, "A1": 1.427, "A2": 0.577, "B3": 0.0, "B4": 2.089, "D3": 0.0, "D4": 2.115, "d2": 2.326, "c4": 0.9400 },
    { "GroupSize": 6, "A1": 1.287, "A2": 0.483, "B3": 0.03, "B4": 1.97, "D3": 0.0, "D4": 2.004, "d2": 2.534, "c4": 0.9515 },
    { "GroupSize": 7, "A1": 1.182, "A2": 0.419, "B3": 0.118, "B4": 1.882, "D3": 0.076, "D4": 1.924, "d2": 2.704, "c4": 0.9594 },
    { "GroupSize": 8, "A1": 1.099, "A2": 0.373, "B3": 0.185, "B4": 1.815, "D3": 0.136, "D4": 1.864, "d2": 2.847, "c4": 0.9650 },
    { "GroupSize": 9, "A1": 1.032, "A2": 0.337, "B3": 0.239, "B4": 1.761, "D3": 0.184, "D4": 1.816, "d2": 2.97, "c4": 0.9693 },
    { "GroupSize": 10, "A1": 0.975, "A2": 0.308, "B3": 0.284, "B4": 1.716, "D3": 0.223, "D4": 1.777, "d2": 3.078, "c4": 0.9727 },
    { "GroupSize": 11, "A1": 0.927, "A2": 0.285, "B3": 0.321, "B4": 1.679, "D3": 0.256, "D4": 1.744, "d2": 3.173, "c4": 0.9754 },
    { "GroupSize": 12, "A1": 0.886, "A2": 0.266, "B3": 0.354, "B4": 1.646, "D3": 0.284, "D4": 1.716, "d2": 3.258, "c4": 0.9776 },
    { "GroupSize": 13, "A1": 0.85, "A2": 0.249, "B3": 0.382, "B4": 1.618, "D3": 0.308, "D4": 1.692, "d2": 3.336, "c4": 0.9794 },
    { "GroupSize": 14, "A1": 0.817, "A2": 0.235, "B3": 0.406, "B4": 1.594, "D3": 0.329, "D4": 1.671, "d2": 3.407, "c4": 0.9810 },
    { "GroupSize": 15, "A1": 0.789, "A2": 0.223, "B3": 0.428, "B4": 1.572, "D3": 0.348, "D4": 1.652, "d2": 3.472, "c4": 0.9823 },
    { "GroupSize": 16, "A1": 0.763, "A2": 0.212, "B3": 0.448, "B4": 1.552, "D3": 0.364, "D4": 1.636, "d2": 3.532, "c4": 0.9830 },
    { "GroupSize": 17, "A1": 0.739, "A2": 0.0, "B3": 0.466, "B4": 1.534, "D3": 0.379, "D4": 1.621, "d2": 3.588, "c4": 0.9845 },
    { "GroupSize": 18, "A1": 0.718, "A2": 0.194, "B3": 0.482, "B4": 1.518, "D3": 0.392, "D4": 1.608, "d2": 3.64, "c4": 0.9854 },
    { "GroupSize": 19, "A1": 0.698, "A2": 0.187, "B3": 0.497, "B4": 1.503, "D3": 0.404, "D4": 1.596, "d2": 3.689, "c4": 0.9862 },
    { "GroupSize": 20, "A1": 0.68, "A2": 0.18, "B3": 0.51, "B4": 1.49, "D3": 0.414, "D4": 1.586, "d2": 3.735, "c4": 0.9869 },
    { "GroupSize": 21, "A1": 0.663, "A2": 0.173, "B3": 0.523, "B4": 1.477, "D3": 0.425, "D4": 1.575, "d2": 3.778, "c4": 0.9876 },
    { "GroupSize": 22, "A1": 0.647, "A2": 0.167, "B3": 0.534, "B4": 1.466, "D3": 0.434, "D4": 1.566, "d2": 3.819, "c4": 0.9882 },
    { "GroupSize": 23, "A1": 0.633, "A2": 0.162, "B3": 0.545, "B4": 1.455, "D3": 0.443, "D4": 1.557, "d2": 3.858, "c4": 0.9887 },
    { "GroupSize": 24, "A1": 0.619, "A2": 0.157, "B3": 0.555, "B4": 1.445, "D3": 0.452, "D4": 1.548, "d2": 3.895, "c4": 0.9892 },
    { "GroupSize": 25, "A1": 0.606, "A2": 0.153, "B3": 0.565, "B4": 1.435, "D3": 0.459, "D4": 1.541, "d2": 3.931, "c4": 0.9896 }];

//数组求和
// ReSharper disable once NativeTypePrototypeExtending
Array.prototype.sum = function () {
    return this.reduce(function (prev, curr, idx, arr) {
        return parseFloat(prev) + parseFloat(curr);
    });
}
// ReSharper disable once NativeTypePrototypeExtending

Array.prototype.avg = function () {
    if (this.length == 0) {
        return 0;
    }
    return (this.sum(this) / this.length);
};

// ReSharper disable once NativeTypePrototypeExtending
Array.prototype.stdev = function () {
    if (this.length == 0) {
        return 0;
    }
    var avg = this.avg();
    var sumArr = this.map(function (item) {
        return Math.pow((item - avg), 2);
    });
    return Math.sqrt((sumArr.sum() / (this.length - 1)));
};
function DataCalculate(param) {
    var xAvgs = 0;
    var rAvgs = 0;
    var sAvgs = 0;
    var outOfSpecCount = 0; //超出规格数
    var stdeva = 0;//整体标准差
    var groupStdeva = 0; //组间标准差
    var upUsl = 0, underLsl = 0, ppm = 0; //实测性能
    var groupUpUsl = 0, groupUnderLsl = 0, groupPpm = 0; //预测性能（组内）
    var totalUpUsl = 0, totalUnderLsl = 0, totalPpm = 0; //预测性能（整体）
    var groupNum = 0;

    var groupInfos = new Array();

    var totalData = new Array();

    for (var i = 0; i < param.data.length; i += param.groupSize) {
        groupNum++;
        var groupInfo = {};
        var data = param.data.slice(i, i + param.groupSize);  //按照样本容量个数选取测量数据
        // console.log(data,111111);
        // return false;
        if (data.length == param.groupSize)  //数据是否填满
        {
            totalData.push(...data);
            groupInfo.GroupMax = Math.max(...data);     //最大值
            groupInfo.GroupMin = Math.min(...data);     //最小值
            // groupInfo.GroupAvg = parseFloat(data.avg().toFixed(4)); //平均值
            groupInfo.GroupAvg = parseFloat(JSON.parse(JSON.stringify(data)).avg().toFixed(4)); //平均值
            groupInfo.GroupNum = groupNum;
            if (param.groupSize > 1)   //样本容量大于1
            {
                groupInfo.GroupRange = parseFloat((groupInfo.GroupMax - groupInfo.GroupMin).toFixed(4));          //极差值
                // groupInfo.GroupStdev = parseFloat(data.stdev().toFixed(4));      //标准差
                groupInfo.GroupStdev = parseFloat(JSON.parse(JSON.stringify(data)).stdev().toFixed(4));
            }
            else if (param.groupSize == 1)   //样本容量等于1
            {
                if (groupInfos.length > 0) {
                    groupInfo.GroupRange = parseFloat((Math.abs(groupInfos[groupInfos.length - 1].GroupMin - groupInfo.GroupMin)).toFixed(4));
                }
            }
        
            var groupDataInfoList = new Array();

            groupInfo.Status = 0;
            groupInfo.ErrMsg = "";
            data.forEach(function (i) {
                var item = {};
                item.MeasureData = i;
                if (i >= param.lsl && i <= param.usl)     //判断数据是否失控
                {
                    item.Status = 0;
                }
                else {
                    item.Status = 1;
                    groupInfo.Status = 1;
                    groupInfo.ErrMsg += "  超出规格限  ";
                }
                groupDataInfoList.push(item);
            });
            //for (var j = 0; j < data.length; j++) {
            //    var item = {};
            //    item.MeasureData = data[j];               
            //    if (data[j] >= param.lsl && data[j] <= param.usl)     //判断数据是否失控
            //    {
            //        item.Status = 0;
            //    }
            //    else {
            //        item.Status = 1;
            //        groupInfo.Status = 1;
            //        groupInfo.ErrMsg += "  超出规格限  ";
            //    }
            //    groupDataInfoList.push(item);
            //}
            groupInfo.DataInfos = groupDataInfoList;
            groupInfos.push(groupInfo);
        }

    }
    //计算参数
    var calculateParam = calculationParameters.find(function (value, index, arr) {
        return value.GroupSize == param.groupSize;
    });

    //判断属于那一类型的
    var inGroupStdeva = 0.0; //获取组内标准差
    if (param.chartType == "IMR" && param.groupSize == 1) {
        inGroupStdeva = parseFloat(totalData.stdev().toFixed(5));
        //parseFloat((groupInfos.map(function (item) { if(item.GroupRange) return item.GroupRange; else return 0; }).sum() / groupInfos.length).toFixed(5));
    }
    if (param.chartType == "XR") {
        inGroupStdeva = parseFloat((groupInfos.map(function (item) { return item.GroupRange }).sum() / groupInfos.length / calculateParam.d2).toFixed(5));
    }
    if (param.chartType == "XS") {
        inGroupStdeva = parseFloat((groupInfos.map(function (item) { return item.GroupStdev }).sum() / groupInfos.length / calculateParam.c4).toFixed(5));
    }

    if (groupInfos.length > 0) {
        xAvgs = parseFloat(groupInfos.map(function (item) { return item.GroupAvg }).avg().toFixed(4));
        rAvgs = parseFloat(groupInfos.map(function (item) { return item.GroupRange }).avg().toFixed(4));
        sAvgs = parseFloat(groupInfos.map(function (item) { return item.GroupStdev }).avg().toFixed(4));
    }

    groupInfos.forEach(function (item) {
        item.DataInfos.forEach(function (childItem) {
            if (childItem.Status == 1) {
                outOfSpecCount++;
                if (childItem.MeasureData > param.usl)
                    upUsl++;  //计算超出规格上限个数
                else
                    underLsl++;   //计算超出规格下限个数
            }
        });
    });

    stdeva = parseFloat(totalData.stdev().toFixed(5));
    if (groupInfos.length > 1)
        groupStdeva = parseFloat(groupInfos.map(function (item) { return item.GroupAvg }).stdev().toFixed(5));   //组间标准差

    if (groupInfos.length > 0) {
        //实测性能
        ppm = parseFloat((outOfSpecCount / (groupInfos.length * param.groupSize) * 1000000).toFixed(3));      //PPM Total
        upUsl = parseFloat(((upUsl / (groupInfos.length * param.groupSize)) * 1000000).toFixed(3));    //PPM > USL
        underLsl = parseFloat(((underLsl / (groupInfos.length * param.groupSize)) * 1000000).toFixed(3));   //PPM < LSL

        if (inGroupStdeva != 0) {
            //预测性能（组内）
            groupUpUsl = parseFloat(((1 - caculatePerforms((param.usl - xAvgs) / inGroupStdeva)) * 1000000).toFixed(3));
            groupUnderLsl = parseFloat(((caculatePerforms((param.lsl - xAvgs) / inGroupStdeva)) * 1000000).toFixed(3));
            groupPpm = parseFloat((groupUnderLsl + groupUpUsl).toFixed(3));
        }
    }

    var firstTarget = 0, firstUcl = 0, firstLcl = 0, secondUcl = 0, secondLcl = 0, secondTarget = 0;

    if (param.groupSize > 1)   //样本容量大于1
    {

        var A1 = calculateParam.A1;
        var A2 = calculateParam.A2;
        var D4 = calculateParam.D4;
        var D3 = calculateParam.D3;
        var B4 = calculateParam.B4;
        var B3 = calculateParam.B3;

        firstTarget = xAvgs;
        if (param.chartType == "XR") {
            firstUcl = parseFloat((xAvgs + A2 * rAvgs).toFixed(3));
            firstLcl = parseFloat((xAvgs - A2 * rAvgs).toFixed(3));
            secondUcl = parseFloat((rAvgs * D4).toFixed(3));
            secondLcl = parseFloat((rAvgs * D3).toFixed(3));
            secondTarget = rAvgs;
        }
        else if (param.chartType == "XS") {
            firstUcl = parseFloat((xAvgs + A1 * sAvgs).toFixed(3));
            firstLcl = parseFloat((xAvgs - A1 * sAvgs, 3).toFixed(3));
            secondUcl = parseFloat((sAvgs * B4, 3).toFixed(3));
            secondLcl = parseFloat((sAvgs * B3, 3).toFixed(3));
            secondTarget = sAvgs;
        }
    }
    else if (param.groupSize == 1)   //样本容量等于1
    {
        rAvgs = parseFloat(groupInfos.map(function (item) {  if(item.GroupRange != undefined){ return item.GroupRange } return 0; }).sum() / (groupInfos.length - 1).toFixed(4));
        firstUcl = parseFloat((xAvgs + 2.659 * rAvgs).toFixed(4));
        firstLcl = parseFloat((xAvgs - 2.659 * rAvgs).toFixed(4));
        firstTarget = parseFloat(((firstLcl + firstUcl) / 2).toFixed(4));
        secondUcl = (3.267 * rAvgs);
        secondLcl = 0;
        secondTarget = rAvgs;
    }

    //cpk 相关数据
    var info = {}
    info.data = totalData;
    info.LSL = param.lsl;
    info.USL = param.usl;
    info.InGroupSTDEVA = inGroupStdeva;
    info.Count = totalData.length;
    info.Average = parseFloat(totalData.avg().toFixed(4));
    info.C = parseFloat(((param.lsl + param.usl) / 2).toFixed(4));
    info.T = parseFloat((param.usl - param.lsl).toFixed(4));
    info.Mininum = Math.min(...totalData);
    info.Maxnum = Math.max(...totalData);
    info.Range = parseFloat((info.Maxnum - info.Mininum).toFixed(4));
    info.STDEV = parseFloat(totalData.stdev().toFixed(4));
    var sumArr = totalData.map(function (item) {
        return Math.pow((item - info.Average), 2);
    });
    info.Sigma = parseFloat(Math.sqrt((sumArr.sum() / totalData.length)).toFixed(4));
    info.Ca = parseFloat(Math.abs((info.Average - info.C) / (info.T / 2)).toFixed(4));
    info.Cpu = parseFloat(((info.USL - info.Average) / (3 * info.InGroupSTDEVA)).toFixed(4));
    info.Cpl = parseFloat(((info.Average - info.LSL) / (3 * info.InGroupSTDEVA)).toFixed(4));
    info.Cp = parseFloat((info.T / (6 * info.InGroupSTDEVA)).toFixed(4));
    
    info.Cpk = info.Cpu >= info.Cpl ? info.Cpl : info.Cpu;
    info.K = Math.abs(((param.usl + param.lsl) / 2) - info.Average) / ((param.usl - param.lsl) / 2)
    if (param.groupSize == 1)
        info.Cpk = parseFloat(((1 - info.K) * info.Cp).toFixed(4));
    info.AvgPlus3Sigma = parseFloat((info.Average + 3 * info.Sigma).toFixed(4));
    info.AvgMinus3Sigma = parseFloat((info.Average - 3 * info.Sigma).toFixed(4));
    info.Pp = parseFloat((info.T / (6 * info.STDEV)).toFixed(4));
    info.PPU = parseFloat((((info.USL - info.Average) / (3 * info.STDEV)).toFixed(4)));
    info.PPL = parseFloat((((info.Average - info.LSL) / (3 * info.STDEV)).toFixed(4)));
    info.Ppk = Math.min(info.PPU, info.PPL);
    info.Plus3STDEV = parseFloat((info.Average + 3 * info.InGroupSTDEVA / Math.sqrt(totalData.length)).toFixed(4));
    info.Minus3STDEV = parseFloat((info.Average - 3 * info.InGroupSTDEVA / Math.sqrt(totalData.length)).toFixed(4));

    //判异规则
    //8大判异规则
    if (param.rules)
        groupInfos = judgeRule(groupInfos, inGroupStdeva, param.rules);

    var mostPrecision = getMostPrecision(totalData);//最大精度
    var zoomMultiple = 68;//缩放倍数
    var xValue = new Array();
    var yValue = new Array();
    if (inGroupStdeva != 0)
        getXValueAndYValue(inGroupStdeva, totalData.avg(), zoomMultiple, mostPrecision, xValue, yValue);

    groupInfos.forEach(function (item) {
        if (item.GroupRange == undefined) {
            item.GroupRange = "N/A";
        }
        if (item.GroupStdev == undefined) {
            item.GroupStdev = "N/A";
        }
    });
    var result = {};
    result.Success = true;
    result.DataList = groupInfos;
    result.Num = groupInfos.length;
    result.array = totalData;
    result.GroupSize = param.groupSize;
    result.Target = param.targetValue;
    result.USL = param.usl;
    result.LSL = param.lsl;
    result.FirstUCL = firstUcl;
    result.FirstTarget = firstTarget;
    result.FirstLCL = firstLcl;
    result.SecondUCL = secondUcl;
    result.SecondTarget = secondTarget;
    result.SecondLCL = secondLcl;
    result.X_avgs = xAvgs;
    result.R_avgs = rAvgs;
    result.S_avgs = sAvgs;
    result.PPM = ppm;
    result.underLSL = underLsl;
    result.upUSL = upUsl;
    result.GroupSTDEVA = groupStdeva;
    result.GroupUpUSL = groupUpUsl;
    result.GroupUnderLSL = groupUnderLsl;
    result.GroupPPM = groupPpm;
    result.TotalUpUSL = totalUpUsl;
    result.TotalUnderLSL = totalUnderLsl;
    result.TotalPPM = totalPpm;
    result.CpkInfo = info;
    result.xValue = xValue;
    result.yValue = yValue;

    return result;

}

//计算组内/组间预性能
function caculatePerforms(b) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
    if (b === "" || b == null || b == undefined) {
        // alert('正态分布输入数据错误，为"' + String(b) + '"');
        window.parent.noData()
        throw '正态分布输入数据错误，为"' + String(b) + '"';
    }
    if (isNaN(b)) {
        // alert('正态分布输入数据错误，为"' + String(b) + '"');
        window.parent.noData()
        throw '正态分布输入数据错误，为"' + String(b) + '"';
    }

    var S = 2;
    var Q = 0;
    while (true) {
        var a = b - S;
        var M = 1, N = 1, k = 1, m = 1;
        var ep, I, h;
        ep = 0.000000000001;
        h = b - a;
        I = h * (F(a) + F(b)) / 2;
        //double[,] T = new double[5000, 5000];
        var T = new Array(1000);
        for (var ti = 0; ti < T.length; ti++) {
            T[ti] = new Array(1000);
        }
        T[1][1] = I;

        while (true) {
            N = Math.floor(Math.pow(2, m - 1));
            h = h / 2;
            I = I / 2;
            for (var i = 1; i <= N; i++)
                I = I + h * F(a + (2 * i - 1) * h);
            T[m + 1][1] = I;
            M = 2 * N;
            k = 1;
            while (M > 1) {
                T[m + 1][k + 1] = (Math.pow(4, k) * T[m + 1][k] - T[m][k]) / (Math.pow(4, k) - 1);
                M = M / 2;
                k = k + 1;
            }
            if (Math.abs(T[k][k] - T[k - 1][k - 1]) < ep)
                break;
            m = m + 1;
        }
        I = T[k][k];
        Q = Q + I;
        if (Math.abs(I) < ep)
            return Q;
        b = a; S = 2 * S;
    }
}

//CaculatePerforms函数中的引用函数
function F(x) {
    var f = Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
    return f;
}

//获取最大精度
function getMostPrecision(sampleData) {
    if (sampleData == undefined || sampleData.length == 0) {
        return 0;
    }

    var mostPrecision = 0;
    var tempValue = 0;

    sampleData.forEach(function (item) {
        var data = String(Math.abs(item));
        var dateLength = data.length;
        var dotIndex = data.indexOf(".");
        if (dotIndex > 0) {
            tempValue = dateLength - (dotIndex + 1);
        }
        if (tempValue > mostPrecision) //取更大的精度
        {
            mostPrecision = tempValue;
        }

    });
    return mostPrecision;
}

//获取x y 值信息用于描绘曲线
function getXValueAndYValue(sigma, xbar, zoomMultiple, mostPrecision, xValues, yValues) {
    try {
        var coefficient = (1 / Math.sqrt(2 * Math.PI) / sigma);//系数；如果计算需要精确，就不要四舍五入；建议：为了提高运算效率要四舍五入。
        var positiveLimit = parseInt((xbar + 6 * sigma) * zoomMultiple); //X轴的正界限
        var minusLimit = parseInt((xbar - 6 * sigma) * zoomMultiple); //X轴的负界限               
        for (var x = minusLimit; x <= positiveLimit; x++) {
            //x轴缩小zoomMultiple倍x每隔1/zoomMultiple变化曲线变平滑
            var xValue = x / zoomMultiple;
            var yValue = coefficient * Math.exp(Math.pow((xValue - xbar), 2) / (-2 * Math.pow(sigma, 2)));
            //xValue = parseFloat(xValue.toFixed(mostPrecision));
            //yValue = parseFloat(yValue.toFixed(mostPrecision));
            if (yValue > 0)//可设为yValue > 0
            {
                xValues.push(xValue);
                yValues.push(yValue);
            }
        }
        return true;
    } catch (e) {
        return false;
    }
}

//缩放倍数
function zoomMultiple(mostPrecision) {
    var zoomMultiple = Math.pow(10, mostPrecision - 1);

    if (mostPrecision <= 2) //保证精度大于二的数据序列图形的平滑
    {
        mostPrecision = 4;
        zoomMultiple = 1000;
    }

    return zoomMultiple;
}

//判异规则
function judgeRule(ginfo, sigma, roles) {
    var a = new Array();
    var strRule = roles.map(function (item) { return item.id }).join(',');
    var avg = ginfo.map(function (item) { return item.GroupAvg }).avg();
    //一倍标准差区域
    var oneSigmaHigh = avg + sigma / Math.sqrt(ginfo.length);
    var oneSigmaLow = avg - sigma / Math.sqrt(ginfo.length);
    //两倍标准差区域
    var twoSigmaHigh = avg + 2 * sigma / Math.sqrt(ginfo.length);
    var twoSigmaLow = avg - 2 * sigma / Math.sqrt(ginfo.length);
    //三倍标准差区域
    var threeSigmaHigh = avg + 3 * sigma / Math.sqrt(ginfo.length);
    var threeSigmaLow = avg - 3 * sigma / Math.sqrt(ginfo.length);

    //一个点落在A区以外 3sigma外
    if (strRule.indexOf('1') > -1) {
        ginfo.forEach(function (item) {
            if (item.GroupAvg > threeSigmaHigh || item.GroupAvg < threeSigmaLow) {
                item.ErrMsg += "  一个点落在A区以外  ";
                item.Status = 1;
            }
        });
    }

    //连续9点落在中心线同一侧
    var role;
    var i;
    var j;
    var flag;
    if (strRule.indexOf('2') > -1) {
        role = roles.find(function (item) {
            return item.id == 2;
        });

        if (ginfo.length > role.seriesCount - 1) {
            for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                j = 0;
                flag = false;
                while (j < role.seriesCount) {
                    if (ginfo[i + j].GroupAvg < avg)
                        flag = true;
                    else {
                        flag = false;
                        break;
                    }
                    j++;
                }
                if (flag) {
                    ginfo[i + role.seriesCount - 1].Status = 1;
                    ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点落在中心线同一侧  ";
                    continue;
                }

                j = 0;
                while (j < role.seriesCount) {
                    if (ginfo[i + j].GroupAvg > avg)
                        flag = true;
                    else {
                        flag = false;
                        break;
                    }
                    j++;
                }

                if (flag) {
                    ginfo[i + role.seriesCount - 1].Status = 1;
                    ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点落在中心线同一侧  ";
                }
            }
        }
    }

    //连续6点递增或递减
    if (strRule.indexOf('3') > -1) {
        role = roles.find(function (item) {
            return item.id == 3;
        });

        if (ginfo.length > role.seriesCount - 1) {
            for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                j = 0;
                flag = false;
                while (j < role.seriesCount - 1) {
                    if (ginfo[i + j].GroupAvg < ginfo[i + j + 1].GroupAvg)
                        flag = true;
                    else {
                        flag = false;
                        break;
                    }
                    j++;
                }
                if (flag) {
                    ginfo[i + role.seriesCount - 1].Status = 1;
                    ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点递增或递减  ";
                    continue;
                }

                j = 0;
                while (j < role.seriesCount - 1) {
                    if (ginfo[i + j].GroupAvg > ginfo[i + j + 1].GroupAvg)
                        flag = true;
                    else {
                        flag = false;
                        break;
                    }
                    j++;
                }
                if (flag) {
                    ginfo[i + role.seriesCount - 1].Status = 1;
                    ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点递增或递减  ";
                }
            }
        }
    }

    //连续14点中相邻点交替上下
    if (strRule.indexOf('4') > -1) {
        role = roles.find(function (item) {
            return item.id == 4;
        });

        if (ginfo.length > role.seriesCount - 1) {
            for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                j = 0;
                flag = false;
                while (j < role.seriesCount - 1) {
                    if ((j % 2 == 0) == (ginfo[i + j].GroupAvg < ginfo[i + j + 1].GroupAvg) && ginfo[i + j].GroupAvg != ginfo[i + j + 1].GroupAvg) {
                        flag = true;
                    }
                    else {
                        flag = false;
                        break;
                    }
                    j++;

                }
                if (flag) {
                    ginfo[i + role.seriesCount - 1].Status = 1;
                    ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点中相邻点交替上下  ";
                    continue;
                }

                j = 0;
                while (j < role.seriesCount - 1) {
                    if ((j % 2 == 0) == (ginfo[i + j].GroupAvg > ginfo[i + j + 1].GroupAvg) && ginfo[i + j].GroupAvg != ginfo[i + j + 1].GroupAvg) {
                        flag = true;
                    }
                    else {
                        flag = false;
                        break;
                    }
                    j++;

                }
                if (flag) {
                    ginfo[i + role.seriesCount - 1].Status = 1;
                    ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点中相邻点交替上下  ";
                }

            }
        }
    }

    //连续3点中有2点落在中心线同一侧的B区以外
    var k;
    var number;
    if (strRule.indexOf('5') > -1) {
        role = roles.find(function (item) {
            return item.id == 5;
        });

        if (ginfo.length > role.seriesCount - 1) {
            for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                j = 0;
                k = 0;
                while (j < role.seriesCount) {
                    if (ginfo[i + j].GroupAvg > twoSigmaHigh && ginfo[i + j].GroupAvg < threeSigmaHigh) {
                        k++;
                    }
                    j++;
                }
                if (k == role.insideCount) {
                    number = 0;
                    ginfo.slice(i, i + role.seriesCount).forEach(function (item, index) {
                        if (item.GroupAvg > twoSigmaHigh && item.GroupAvg < threeSigmaHigh) {
                            number = index;
                        }
                    });
                    ginfo[i + number].Status = 1;
                    ginfo[i + number].ErrMsg += "连续" + role.seriesCount + "点中有" + role.insideCount + "点落在中心线同一侧的B区以外";
                    continue;
                }
                j = 0;
                k = 0;
                while (j < role.seriesCount) {
                    if (ginfo[i + j].GroupAvg < twoSigmaLow && ginfo[i + j].GroupAvg > threeSigmaLow) {
                        k++;
                    }
                    j++;
                }
                if (k == role.insideCount) {
                    number = 0;

                    ginfo.slice(i, i + role.seriesCount).forEach(function (item, index) {
                        if (item.GroupAvg < twoSigmaLow && item.GroupAvg > threeSigmaLow) {
                            number = index;
                        }
                    });
                    ginfo[i + number].Status = 1;
                    ginfo[i + number].ErrMsg += "连续" + role.seriesCount + "点中有" + role.insideCount + "点落在中心线同一侧的B区以外";

                }
            }
        }
    }

    //连续5点中有4点落中心线同一侧的C区以外
    if (strRule.indexOf('6') > -1) {
        role = roles.find(function (item) {
            return item.id == 6;
        });

        if (ginfo.length > role.seriesCount - 1) {
            for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                j = 0;
                k = 0;
                while (j < role.seriesCount) {
                    if (ginfo[i + j].GroupAvg > oneSigmaHigh && ginfo[i + j].GroupAvg < threeSigmaHigh) {
                        k++;
                    }
                    j++;
                }
                if (k == role.insideCount) {

                    number = 0;

                    ginfo.slice(i, i + role.seriesCount).forEach(function (item, index) {
                        if (item.GroupAvg > oneSigmaHigh && item.GroupAvg < threeSigmaHigh) {
                            number = index;
                        }
                    });
                    ginfo[i + number].Status = 1;
                    ginfo[i + number].ErrMsg += "连续" + role.seriesCount + "点中有" + role.insideCount + "点落中心线同一侧的C区以外";

                    continue;
                }

                j = 0;
                k = 0;
                while (j < role.seriesCount) {
                    if (ginfo[i + j].GroupAvg < oneSigmaLow && ginfo[i + j].GroupAvg > threeSigmaLow) {
                        k++;
                    }
                    j++;
                }
                if (k == role.insideCount) {

                    number = 0;

                    ginfo.slice(i, i + role.seriesCount).forEach(function (item, index) {
                        if (item.GroupAvg < oneSigmaLow && item.GroupAvg > threeSigmaLow) {
                            number = index;
                        }
                    });
                    ginfo[i + number].Status = 1;
                    ginfo[i + number].ErrMsg += "连续" + role.seriesCount + "点中有" + role.insideCount + "点落中心线同一侧的C区以外";


                }


            }
        }
    }

    //连续15点落在中心线两侧的C区内
    if (strRule.indexOf('7') > -1) {
        role = roles.find(function (item) {
            return item.id == 7;
        });

        if (ginfo.length > role.seriesCount - 1) {
            for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                j = 0;
                flag = false;
                while (j < role.seriesCount) {
                    if (ginfo[i + j].GroupAvg > oneSigmaHigh || ginfo[i + j].GroupAvg < oneSigmaLow) {
                        flag = false;
                        break;
                    }
                    flag = true;
                    j++;
                }
                if (flag) {
                    ginfo[i + role.seriesCount - 1].Status = 1;
                    ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点落在中心线两侧的C区内  ";
                }
            }
        }
    }

    //连续8点落在中心线两侧且无一在C区内
    if (strRule.indexOf('8') > -1) {
        role = roles.find(function (item) {
            return item.id == 8;
        });

        if (ginfo.length > role.seriesCount - 1) {
            for (i = 0; i < ginfo.length - role.seriesCount + 1; i++) {
                j = 0;
                flag = false;
                while (j < role.seriesCount) {
                    if (ginfo[i + j].GroupAvg < oneSigmaHigh && ginfo[i + j].GroupAvg > oneSigmaLow) {
                        flag = false;
                        break;
                    }
                    flag = true;
                    j++;
                }
                if (flag) {
                    ginfo[i + role.seriesCount - 1].Status = 1;
                    ginfo[i + role.seriesCount - 1].ErrMsg += "  连续" + role.seriesCount + "点落在中心线两侧且无一在C区内  ";
                }
            }
        }
    }

    return ginfo;
}


