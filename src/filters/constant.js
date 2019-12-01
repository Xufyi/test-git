import _ from 'lodash'
/**
 * 通过标签名获取值
 * @param {*} label 标签名
 * @param {*} constants 常量数组
 */
function getValueByLabel (label, constants) {
  if (label === undefined || label === '' || !constants || constants.length === 0) {
    return ''
  }
  for (let i = 0; i < constants.length; i++) {
    let constant = constants[i]
    if (constant.label === label) {
      return constant.value
    }
  }
  return ''
}

/**
 * 通过标签数组获取值数组
 * @param {*} labels 标签数组
 * @param {*} constants 常量数组
 */
function getValuesByLabels (labels, constants) {
  if (labels === undefined || labels.length === 0 || !constants || constants.length === 0) {
    return []
  }
  // 形成对象，方便查找
  let _constants = {}
  constants.forEach((element) => {
    _constants[element.label] = element.value
  }, this)
  // 查找相应的值
  let result = []
  for (let i = 0; i < labels.length; i++) {
    result.push(_constants[labels[i]])
  }
  return result
}

/**
 * 通过常量值获取标签名
 * @param {*} value 常量值
 * @param {*} constants 常量数组
 */
function getLabelByValue (value, constants) {
  if (value === undefined || value === '' || !constants || constants.length === 0) {
    return ''
  }
  for (let i = 0; i < constants.length; i++) {
    let constant = constants[i]
    if (constant.value === value) {
      return constant.label
    }
  }
  return ''
}

/**
 * 通过常量值数组获取常量标签名数组
 * @param {*} values 常量值数组
 * @param {*} constants 常量数组
 */
function getLabelsByValues (values, constants) {
  if (values === undefined || values.length === 0 || !constants || constants.length === 0) {
    return []
  }
  // 形成对象，方便查找
  let _constants = {}
  constants.forEach((element) => {
    _constants[element.value] = element.label
  }, this)
  // 查找相应的值
  let result = []
  for (let i = 0; i < values.length; i++) {
    result.push(_constants[values[i]])
  }
  return result
}

/**
 * 常量过滤器
 * 支持模式：
 * 【v2l】值转标签
 * 【l2v】标签转值
 * 【b2l】二进制转法转标签
 * 【b2v】二进制转法转值
 */
export default (value, constants, type, join, separator) => {
  let values = []
  switch (type) {
    // 值 => 标签
    case 'v2l':
      if (_.isArray(value)) {
        // 数组
        return join ? getLabelsByValues(value, constants).join(separator || ' ') : getLabelsByValues(value, constants)
      } else {
        // 非数组
        return getLabelByValue(value, constants)
      }
    // 标签 => 值
    case 'l2v':
      if (_.isArray(value)) {
        // 数组
        return join ? getValuesByLabels(value, constants).join(separator || ' ') : getValuesByLabels(value, constants)
      } else {
        // 非数组
        return getValueByLabel(value, constants)
      }
    // 二进制 => 标签
    case 'b2l':
      constants.forEach((element) => {
        if (parseInt(element.value) & parseInt(value)) {
          values.push(element.value)
        }
      }, this)
      return join ? getLabelsByValues(values, constants).join(separator || ' ') : getLabelsByValues(values, constants)
    // 二进制 => 值
    case 'b2v':
      constants.forEach((element) => {
        if (parseInt(element.value) & parseInt(value)) {
          values.push(element.value)
        }
      }, this)
      return join ? values.join(separator || ' ') : values
    case 'l2b':
      if (_.isArray(value)) {
        // 数组
        let result = 0
        values = getValuesByLabels(value, constants)
        values.forEach((element) => {
          result ^= parseInt(element)
        }, this)
        return result
      } else {
        return getValueByLabel(value, constants)
      }
    case 'v2b':
      if (_.isArray(value)) {
        // 数组
        let result = 0
        value.forEach((element) => {
          result ^= parseInt(element)
        }, this)
        return result
      } else {
        return value
      }
  }
}
