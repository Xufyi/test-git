'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST:'"http://192.168.100.200:88"',
  // API_HOST:'"http://192.168.100.133:8088"',//陈家
	// API_HOST:'"http://192.168.100.188:8088"',//刘虹弟
	//API_HOST:'"http://192.168.100.172:8082"',//慧平哥
  // API_HOST:'"http://192.168.100.95:8082"'WX_HOST
  // WX_HOST:'"http://192.168.100.200:8088/iqis-ws"'
})
