export default {
  filterObject(objArr,attr,attrValue){
    for(let i=0;i<objArr.length;i++){
      if(objArr[i][attr] == attrValue) return objArr[i]
    }
  }
}
