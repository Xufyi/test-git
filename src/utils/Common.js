/**
 * 通用工具库
 */
import $ from 'jquery';
import SessionStorage from '@/utils/sessionStorage'

export default {
  getPermissionsAll(permsAll,permsCur,permsBtn){
    // console.log(permsCur,'当前')

    for(let i in permsCur){
      if(permsAll.indexOf(permsCur[i])!=-1){
        permsBtn[permsCur[i]] = true;
      }else{
        permsBtn[permsCur[i]]= false;
      }
    }
    // console.log(permsBtn,'按钮')
  },
  formValidate(type,title,value,callback){//验证类型/验证提示语/值
    let that = this;
    let No = /^[a-zA-Z0-9（）(){}【】_\-/\\+.,、~#*%\s\u4e00-\u9fa5]{0,80}$/;//编号/单号/批号等，80字
    let Account = /^[a-zA-Z0-9（）(){}【】_\-/\\+.,、~#*%\s]{0,40}$/;//客户账号
    let No25 = /^[a-zA-Z0-9（）(){}【】_\-/\\+.,、~#*%\s]{0,25}$/;//编号规则25字
    let Name = /^[A-Za-z0-9（）(){}【】_\-/\\+.,、~？?#*%\s\u4e00-\u9fa5]{0,40}$/;//名称，40字
    let Num = /^[+]{0,1}(\d+)$/;//数字，正整数
    let NumAll = /^[0-9]\d*\,\d*|[0-9]\d*$/;//数字
    let PhoneNum =/^1\d{10}$///手机号
    let telNum = /^[+]{0,1}(\d+){8,13}$/;//数字，正整数
    let Email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;//邮箱
    let NameCN1 = /^[A-Za-z0-9（）()\s\u4e00-\u9fa5]{4,58}(集团|公司|会社)$/;//中文全称1
    let NameCN2= /^[A-Za-z0-9（）()\s\u4e00-\u9fa5]{5,59}(厂)$/;//中文全称2
    let NameEN = /^[a-zA-Z0-9\s.,-]{0,100}$/;//英文全称
    let Password = /^[a-zA-Z0-9（）(){}【】_\-/\\.、~#*%@!]{4,20}$/;//密码

    if(type=='Empty'&&(value===''||value==null)){
      callback && callback(title+i18n.t('Verification.Empty'))
      return false;
    }
    if(type=='Space'){
      // callback && callback(title+'不能输入空格')
      // return false;
      return true;
    }
    if(type=='EmptyLength'&&(value.length==0)){
      callback && callback(title+i18n.t('Verification.Empty'))
      return false;
    }
    if(type=='EmptyLength2'&&(value.length<2)){
      callback && callback(title+i18n.t('Verification.Empty'))
      return false;
    }
    else if(type=='Account'&&!Account.test(value)){
      callback && callback(title+i18n.t('Verification.Account'))
      return false;
    }
    else if(type=='No'&&!No.test(value)){
      callback && callback(title+i18n.t('Verification.No'))
      return false;
    }
    else if(type=='No25'&&!No25.test(value)){
      callback && callback(title+i18n.t('Verification.No25'))
      return false;
    }
    else if(type=='Name'&&!Name.test(value)){
      callback && callback(title+i18n.t('Verification.Name'))
      return false;
    }
    else if(type=='Num'&&value&&(!Num.test(value)||Number(value)>=1000000000)){
      callback && callback(title+i18n.t('Verification.Num'))
      return false;
    }
    else if(type=='NumAll'&&value&&(!NumAll.test(value)||Number(value)>=1000000000||value.split('.').length>2)){
      callback && callback(title+i18n.t('Verification.NumAll'))
      return false;
    }
    else if(type=='NumAllNot0'&&value&&(!NumAll.test(value)||Number(value)>=1000000000||Number(value)==0)){
      callback && callback(title+i18n.t('Verification.NumAllNot0'))
      return false;
    }
    else if(type=='Num999'&&(!Num.test(value)||Number(value)>=1000||Number(value)==0)){
      callback && callback(title+i18n.t('Verification.Num999'))
      return false;
    }
    else if(type=='NumNot0'&&(!Num.test(value)||Number(value)>=1000000000||Number(value)==0)){
      callback && callback(title+i18n.t('Verification.NumNot0'))
      return false;
    }
    else if(type=='Num1_10'&&value&&(!Num.test(value)||Number(value)>10||Number(value)<1)){
      callback && callback(title+i18n.t('Verification.Num1_10'))
      return false;
    }
    else if(type=='Num0_5'&&(!Num.test(value)||Number(value)>5||Number(value)<0)){
      callback && callback(title+i18n.t('Verification.Num0_5'))
      return false;
    }
    else if(type=='PhoneNum'&&value&&!PhoneNum.test(value)){
      callback && callback(i18n.t('Verification.Correct')+title)
      return false;
    }
    else if(type=='telNum'&&value&&!telNum.test(value)){
      callback && callback(i18n.t('Verification.Correct')+title)
      return false;
    }
    else if(type=='Email'&&value&&!Email.test(value)){
      callback && callback(i18n.t('Verification.Correct')+title)
      return false;
    }
    else if(type=='NameCN'&&!NameCN1.test(value)&&!NameCN2.test(value)){
      callback && callback(title+i18n.t('Verification.NameCN'))
      return false;
    }
    else if(type=='NameEN'&&!NameEN.test(value)){
      callback && callback(title+i18n.t('Verification.NameEN'))
      return false;
    }
    else if(type=='Password'&&!Password.test(value)){
      callback && callback(title+i18n.t('Verification.Password'))
      return false;
    }
    else if(type=='Word20'&&value&&value.length>20){
      callback && callback(title+i18n.t('Verification.Word20'))
      return false;
    }
    else if(type=='Word30'&&value&&value.length>30){
      callback && callback(title+i18n.t('Verification.Word30'))
      return false;
    }
    else if(type=='Word40'&&value&&value.length>40){
      callback && callback(title+i18n.t('Verification.Word40'))
      return false;
    }
    else if(type=='Word100'&&value&&value.length>100){
      callback && callback(title+i18n.t('Verification.Word100'))
      return false;

    }
    else if(type=='Word600'&&value&&value.length>600){
      callback && callback(title+i18n.t('Verification.Word600'))
      return false;

    }
    else{
      return true;
    }
  },
  getTwoDecimal(num){//去两位小数不四舍五入
    num=num.toFixed(3);
    num=num.substring(0,num.lastIndexOf('.')+3);
    return num;
  },//this.$iqis.utils.getTwoDecimal(num)
  deepMerge(obj1,obj2){//将只有obj1独有的属性赋值给obj2
    for(let key in obj1){
      if(obj1.hasOwnProperty(key)===true){
        if (typeof obj1[key] === 'object') {
          if(obj1[key]!=null){
            if(!obj2[key]){
              obj2[key] = this.clone(obj1[key]);
            }else if(obj1[key].constructor !== Array){
              this.deepMerge(obj1[key], obj2[key]);
            }
          }

        } else if(!obj2[key]){
          obj2[key] = obj1[key];
        }
      }
    }

  },
    /**
   * 给方法加上前缀
   * @param {String} objArr 对象
   * @param {String} attr 字段
   * @param {String} attrValue 值
   */
  filterObject(objArr,attr,attrValue){
    for(let i=0;i<objArr.length;i++){
      if(objArr[i][attr] == attrValue) return objArr[i]
    }
  },
  /**
   * 给方法加上前缀
   * @param {String} method 方法名
   * @param {String} prefix 前缀名
   */
  prefixMethod (method, prefix) {
    if (prefix) {
      return prefix + this.upperCaseFirstLetter(method)
    } else {
      return method
    }
  },
  /**
   * 单词首字母大写
   * @param {String} word 单词
   */
  upperCaseFirstLetter (word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1)
  },

  /**使用json深拷贝一个对象*/
  clone(obj){
    return JSON.parse(JSON.stringify( obj));
  },
  /**将一个列表数据转化为一个树形数据*/
  treeify(list,treeParent,idKey,titleKey,parentKey,childrenKey,level){

    let pk = parentKey || "parentId";
    let parentId = treeParent[idKey];
    let ck = childrenKey || "children";
    let l = level || 1;

    if(l > 99){
      return null;
    }
    let childrens = [];
    for (let i=0;i<list.length;i++){
      let item = list[i];
      let itemId = item[idKey];
      if(!itemId){
        return null;
      }
      if(item[pk] == parentId || !(item[pk] || parentId)){
        childrens.push(item);
        if(typeof titleKey === 'function'){
          item.title = titleKey(item);
        }else{
          item.title = item[titleKey];
        }

        item.label = item.title;
        item.value = item[idKey];
        item.expand = true;
        this.treeify(list,item,idKey,titleKey,pk,ck,l+1);
      }
    }
    treeParent[ck] = childrens;
  },
  /**查询权限列表父节点*/
  permissionparenttreeify(list,treeParent,idKey,titleKey,parentKey,checkedFlag,childrenKey,level,disabled){
    let pk = parentKey || "parentId";
    let ck = childrenKey || "children";
    let l = level || 1;
    let cf = checkedFlag || "checked";

    let childrens = [];
    for (let i=0;i<list.length;i++) {
      let item = list[i];
      let itemId = item[idKey];
      if (!itemId) {
        return null;
      }
      if (item[pk] == itemId) {
        childrens.push(item);
        item.title = item[titleKey];
        item.label = item[titleKey];
        item.value = item[idKey];
        item.expand = false;
        item.disabled = disabled;
        item.checked = item[cf];
        this.permissiontreeify(list,item,idKey,titleKey,pk,ck,l+1,cf,disabled);
      }
    }
    treeParent[ck] = childrens;
  },
  /**将权限表数据转化为一个树形数据*/
  permissiontreeify(list,treeParent,idKey,titleKey,parentKey,childrenKey,level,checkedFlag,disabled){

    let pk = parentKey || "parentId";
    let parentId = treeParent[idKey];
    let ck = childrenKey || "children";
    let l = level || 1;
    let cf = checkedFlag || "checked";
    let childrens = [];
    for (let i=0;i<list.length;i++){

      let item = list[i];
      let itemId = item[idKey];
      if (parentId == itemId) {
        continue;
      }
      if(!itemId){
        console.error("item do't have ID key:"+idKey);
        return null;
      }
      if(item[pk] == parentId || !(item[pk] || parentId)){
        childrens.push(item);
        if(typeof titleKey === 'function'){
          item.title = titleKey(item);
        }else{
          item.title = item[titleKey];
        }
        item.checked = item[cf];
        item.label = item.title;
        item.value = item[idKey];
        item.expand = false;
        item.disabled = disabled;

        this.permissiontreeify(list,item,idKey,titleKey,pk,ck,l+1,cf,disabled);
      }
    }
    treeParent[ck] = childrens;
  },
  findPathInTree(node,list,value,valueKey,childrenKey){

    let ck = childrenKey || "children";
    let result = this._findPathInTree(node,list,value,valueKey,ck);
    if(result){
      //result = result.reverse();
      let values = [];
      values.push(0)
      for(let i=result.length;i>=0;i--){
        if(result[i]){
          let v = result[i][valueKey];
          if(values.indexOf(v) == -1){
            if(v){
              values.push(v);
            }
          }
        }
      }
      return values;
    }
  },
  _findPathInTree(node,list,value,valueKey,childrenKey){
    if(node == null){
      return null;
    }
    if(node[valueKey] == value){
      list.push(node);
      return list;
    }
    if(node[childrenKey]){
      for(let i=0;i<node[childrenKey].length;i++){
        let item = node[childrenKey][i];
        let result = this._findPathInTree(item,list,value,valueKey,childrenKey);
        if(result != null){
          result.push(item);
          return result;
        }
      }
    }
    return null;
  },
  tableHelper:{
    defects(defects,paramValuearray,paramsVal,ParamssVal) {//生成缺陷记录
        defects=[]
        let val = 0
        for(let i in ParamssVal) {
          let item = ParamssVal[i]
          if(item.result==1) {
            let obj ={}
            obj.inspectionTypeId = item.inspectionId
            obj.inspectionTypeName = item.inspectionName
            obj.defectTypeId = 0//缺陷名称
            obj.defectRate =''
            obj.decisionResultsId = 4
            obj.rowId = val++
            defects.push(obj)
          }
        }
        for(let i in paramValuearray) {//遍历参数记录
          let item = paramValuearray[i]
          let Params = paramsVal[i]//参数记录对应的一行的信息
          let number = 0
          for(let j in item) {//字符转数值
            if(item[j]) {
              item[j]=Number(item[j])
            }
          }
          for(let i = 0;i<item.length;i++){//去掉空字符
              if(item[i]==''){
                  item.splice(i,1);
                  i=i-1;
              }
          }
          if(item.length==0) continue
          for(let i in item) {//遍历出标红数量
            if(item[i]>Params.usl || item[i]<Params.lsl) {
              number++
            }
          }
          let AS = item.sort((a, b) => a - b)
          console.log(AS,88)
          let max = Number(AS[item.length-1].toFixed(Params.scale))//最大值
          let min = Number(AS[0].toFixed(Params.scale))//最小值
          let record
          if(min>=Params.lsl&&max>Params.usl) {
            record = `规格:${Params.sl} 正${Params.positiveTolerance} 负${Params.negativeTolerance} 实测最大${max.toFixed(Params.scale)}${Params.unitSymbol}`
          }
          if(max<=Params.usl&&min<Params.lsl) {
            record = `规格:${Params.sl} 正${Params.positiveTolerance} 负${Params.negativeTolerance} 实测最小${min.toFixed(Params.scale)}${Params.unitSymbol}`
          }
          if(min<Params.lsl && max >Params.usl) {
            // if(max>=Params.usl&&min>=Params.lsl) {alert(3)
            //   record = `规格:${Params.sl} 正${Params.positiveTolerance} 负${Params.negativeTolerance} 实测最大${max.toFixed(Params.scale)}${Params.unitSymbol}`
            // }else if(max>=Params.usl&&min<=Params.lsl) {alert(4)
              record = `规格:${Params.sl} 正${Params.positiveTolerance} 负${Params.negativeTolerance} 实测最大${max.toFixed(Params.scale)}${Params.unitSymbol} 实测最小${min.toFixed(Params.scale)}${Params.unitSymbol}`
            // }else if(max<=Params.usl&&min<=Params.lsl) {alert(5)
            //   record = `规格:${Params.sl} 正${Params.positiveTolerance} 负${Params.negativeTolerance} 实测最小${min.toFixed(Params.scale)}${Params.unitSymbol}`
            // }
          }
          if(max>Params.usl || min<Params.lsl) {//新增缺陷的一行数据
            let obj = {}
            obj.inspectionTypeId = Params.inspectionTypeId//检验项目
            obj.inspectionTypeName = Params.inspectionTypeName
            obj.defectTypeId = 0//缺陷名称
            obj.sampleQuantity = Params.num//实抽样数
            obj.defectCount = Math.round((number/item.length)*Params.num)//缺陷数
            obj.defectRate = (((Math.round((number/item.length)*Params.num))/Params.num)*100).toFixed(2)+'%'///缺陷率
            obj.describe = record
            obj.decisionResultsId = 4
            obj.rowId = val++
            defects.push(obj)
          }
        }
        return defects
    },
    buildIndexColumnRender(vm){
      return function(h,data){
        let current = 1;
        let limit = 10;

        if(vm.table && vm.table.pager && vm.table.pager.current){
          current = vm.table.pager.current;
        }
        if(vm.table && vm.table.pager && vm.table.pager.limit){
          limit = vm.table.pager.limit;
        }
        return h("span",data.index+1+((current-1)*limit))};
    },buildFieldPathCell(vm){
      return function(h,data){
        let keyStr = data.column.key;
        let keyArr = keyStr.split(".");
        let curr = data.row;
        for(let i=0;i<keyArr.length;i++){
          if(curr && keyArr[i]){
            curr = curr[keyArr[i]];
          }
        }
        let str = "--"
        if(curr){
          str = curr;
        }

        return h("span",str);
      }

    },buildMapCell(vm,map){
      return function(h,data){
        let keyStr = data.column.key;
        let keyArr = keyStr.split(".");
        let curr = data.row;
        for(let i=0;i<keyArr.length;i++){
          if(curr && keyArr[i]){
            curr = curr[keyArr[i]];
          }
        }
        let str = "--"
        if(curr!=null && map[curr]){
          str = map[curr];
        }

        return h("span",{
          // DOM属性
          domProps: {
            innerHTML: str,
          }
        });
      }

    },
    editable: {
      rowIdCreateIndex : 1,
      setRowError(rows,row,error){
        for(let i=0;i<rows.length;i++){
          if(row._$_row_id == rows[i]._$_row_id){
            rows[i]._error = error;
          }
        }
      },
      getRowId(){
        return "ROWID_"+this.rowIdCreateIndex++;
      },
      rowStyle(row, index){
        if (row._error != null) {
          return 'iqis-editable-row-error';
        } else if (row._updated == true) {
          return 'iqis-editable-row-updated';
        }
        return '';
      },
      initRowData(rows,styleColumns){
        for(var i=0;i<rows.length;i++){
          let item = rows[i];
          item._$_row_id = this.getRowId();
          item.key = item._$_row_id;
          item._updated = false;
          item._error = null;
          let cellStyle = {};
          for(let j=0;j<styleColumns.length;j++){
            cellStyle[styleColumns[j]] = "editable-cell-default";
          }
          item.cellClassName = cellStyle;

        }
      },
      buildTextCell(vm,callback,disabled) {
        return function (h, data) {
          return h("EditorTextCell", {
            props: {
              "value": data.row[data.column.key],
              "field": data.column.key,
              "error":null,
              "disabled":disabled,
              "row-index": data.index,
              "height": 54,
              "required":data.column.required,
              "focus":data.column.focus,
              "row":data.row
            },
            on: {
              input: (val) => {
                callback(val, data.column.key, data.index)
              }
            }
          })
        }
      },
      buildSelectCell(vm,list,valueField,labelField,callback,disabled) {
        return function (h, data) {
          return h("EditorSelectCell", {
            props: {
              "value":data.row[data.column.key],
              "field": data.column.key,
              "row-index": data.index,
              "disabled":disabled,
              "height":54,"row":data.row,
              "list":(typeof list === 'function')?list(vm):list,
              "valueField":valueField,
              "labelField":labelField
            },
            on: {
              input: (val) => {
                callback(val, data.column.key, data.index)
              }
            }
          })
        }
      },
      buildSelectCell1(vm,list,valueField,labelField,callback) {
        return function (h, data) {
          return h("EditorSelectCell", {
            props: {
              "value":data.row[data.column.key],
              "field": data.column.key,
              "row-index": data.index,
              "disabled": true,
              "height":54,"row":data.row,
              "list":(typeof list === 'function')?list(vm):list,
              "valueField":valueField,
              "labelField":labelField
            },
            on: {
              input: (val) => {
                callback(val, data.column.key, data.index)
              }
            }
          })
        }
      },
      buildSelectCell2(vm,list,valueField,labelField,callback,disabled) {
        return function (h, data) {
          return h("EditorSelectCell", {
            props: {
              "value":data.row[data.column.key],
              "field": data.column.key,
              "row-index": data.index,
              "disabled": disabled,
              "height":54,"row":data.row,
              "list":(typeof list === 'function')?list(vm):list,
              "valueField":valueField,
              "labelField":labelField
            },
            on: {
              input: (val) => {
                if(callback){
                  callback(val, data.column.key, data.index)
                }
              }
            }
          })
        }
      },
      buildCascaderCell(vm,category,valueField,labelField,callback,disabled) {
        return function (h, data) {
          return h("EditorCascaderCell", {
            props: {
              "value":data.row[data.column.key],
              "field": data.column.key,
              "row-index": data.index,
              "height":54,
              "row":data.row,
              "category":(typeof category === 'function')?category(vm):category,
              "valueField":valueField,
              "labelField":labelField,
              'disabled':disabled,
            },
            on: {
              input: (val) => {
                callback(val, data.column.key, data.index)
              }
            }
          })
        }
      },
      buildCascaderCell2(vm,category,valueField,labelField,callback,callback2,disabled) {
        return function (h, data) {
          return h("EditorCascaderCell", {
            props: {
              "value":data.row[data.column.key],
              "field": data.column.key,
              "row-index": data.index,
              "disabled": disabled,
              "height":54,
              "row":data.row,
              "category":(typeof category === 'function')?category(vm):category,
              "valueField":valueField,
              "labelField":labelField
            },
            on: {
              input: (val,val1,val2,val3) => {
                if(callback){
                  callback(val, data.column.key, data.index, val3)
                }
              },
              onclose:(val,val1,val2,val3) =>{
                if(callback2){
                  callback2(val, data.column.key, data.index, val3)
                }
              }
            }
          })
        }
      },
      buildCascaderCell4(vm,category,valueField,labelField,callback,callback2,flag) {
        return function (h, data) {
          return h("EditorCascaderCell2", {
            props: {
              "value":data.row[data.column.key],
              "field": data.column.key,
              "row-index": data.index,
              // "disabled": vm[flag],
              "disabled": flag,
              "height":54,
              "row":data.row,
              "category":(typeof category === 'function')?category(vm):category,
              "valueField":valueField,
              "labelField":labelField
            },
            on: {
              input: (val,val1,val2,val3) => {
                if(callback){
                  callback(val, data.column.key, data.index, val3)
                }
              },
              onclose:(val,val1,val2,val3) =>{
                if(callback2){
                  callback2(val, data.column.key, data.index, val3)
                }
              }
            }
          })
        }
      }
    }

  },



  /**格式化字符串*/
  formatDate(date,fmt) { //author: meizz
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },

  date: {
    toText(date,fmt){
      return date.Format(fmt);
    },
    toDate(text){
      if(/^\d{4}-\d{2}-\d{2}/g.test(text)){ //yyyy-MM-dd
        var date = new Date(text.replace(/-/g,"/"))
        return date;
      }else{ //yyyy-MM-dd hh:mm:ss
        // var arr1 = text.split(" ");
        // var sdate = arr1[0].split('-');
        // var date = new Date(sdate[0], sdate[1]-1, sdate[2]);
        // return date;
      }
    }
  },

  /**获得指定日期的结束时间*/
  getDayEnd(day){
    var cday = day || new Date();
    var time_end = new Date(new Date(this.formatDate(cday,"yyyy/M/d")).getTime()+24*60*60*1000).getTime();
    return time_end;
  },
  getDayEnd2(day){
    var cday = day || new Date();
    var time_end = new Date(new Date(this.formatDate(cday,"yyyy/M/d")).getTime()+24*60*60*1000 - 1000).getTime();
    return time_end;
  },

  /**获得指定日期之前几天的开始时间*/
  getDayStart(days,day){
    var time_start = this.getDayEnd(day) - (days * 86400* 1000);
    return time_start;
  },

  // getDayRange(0,1){
  //   let range = [];

  // },

  get30DayStart(){
      return this.getDayStart(30);
  },

  get7DayStart(){
      return this.getDayStart(7);
  },

  get90DayStart(){
    return this.getDayStart(90);
  },

  getHourOffset(){
    return (new Date()).getTimezoneOffset()/-60;
  },

  __hour_offset: (new Date()).getTimezoneOffset()/-60 ,

  syncget(rUrl,param){
    if(process.env.API_HOST){
      rUrl = process.env.API_HOST + rUrl;
    }
    var token = SessionStorage.get("token");
    var r;
    $.ajax({
        url:rUrl
        ,headers: {
            "x-access-token": token
            ,"hours-offset":this.__hour_offset
        }
        ,type:"get"
        ,dataType:"json"
        ,data:param
        ,async: false
    }).done(function(response) {
        r = response;
    });
    return r;
  },

  printHtml(content,pageHead,csss){
    var _w = window.open("about:blank");
    if(_w){
        _w.iqis_param_pageHead = pageHead;
        var page = "<!DOCTYPE html><html><head><base href='"+window.location.href+"' /><meta charset=\"UTF-8\"><title>导出预览</title>"
        page+="<script src=\"static/js/jquery-3.2.1.min.js\"></script>";
        page+="<script src=\"static/js/jspdf.min.js\"></script>";
        page+="<script src=\"static/js/html2canvas.min.js\"></script>";
        if(csss){
            for(var css in csss){
                page+="\n" +
                    "<link rel=\"stylesheet\" type=\"text/css\" href=\""+csss[css]+"\" />";
            }
        }
        var tool = "<div class='report-print-tools' style='position: fixed;top: 2px;left: 2px;padding: 3px 12px;background: #7d666666;'><button id='saveBtn' onclick='saveAsPdf()' style='cursor: pointer;height: 32px;width: 120px;background: #007fff;color:#fff;'>下载PDF</button></div>";
        page+="</head><body>"+content+tool+"</body></html>";
        _w.document.write(page);

        return _w;
    }
  },
  //对分秒转换
  formatDegree(value) {
    value = Math.abs(value);
    var v1 = Math.floor(value);//度
    var v2 = Math.floor((value - v1) * 60);//分
    var v3 = Math.round((value - v1) * 3600 % 60);//秒
    return v1 + '°' + v2 + '\'' + v3 + '"';
}
}
