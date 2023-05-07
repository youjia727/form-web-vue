'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  VUE_BASE_API:'"http://127.0.0.1:7001"',
  VUE_RANDOM:'"QWERTYUIOP"',
  NODE_ENV: '"development"'
})
