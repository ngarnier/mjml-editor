require('babel-register')
require('babel-polyfill')
require('ignore-styles')

require('dotenv').config()

const globals = require('./src/globals')

Object.keys(globals).forEach(key => global[key] = globals[key])

require('./src/server')
