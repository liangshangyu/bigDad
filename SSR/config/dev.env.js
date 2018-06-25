/**
 * Created by 17073565 on 2018/5/9.
 */
'use strict'
const mergr = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = mergr(prodEnv, {
    NODE_ENV: '"development"'
})