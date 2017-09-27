var path = require('path')
var appPath = path.resolve(__dirname, 'src')
var buildPath = path.resolve(__dirname, 'public')
var getConfig = require('prepacked')
var html = require('./html.js')
var isDev = process.env.NODE_ENV !== 'production'

var config = getConfig({
  isDev: isDev,
  src: appPath,
  out: buildPath,
  resolves: [ 'shared' ],
  featureFlags: { __DEV__: isDev, __PROD__: !isDev },
  devServer: { contentBase: buildPath },
  html: isDev ? html.dev : html.prod
})

config.module.rules.push({
  test: /\.(jpe?g|png|gif|svg)$/i,
  loaders: [
    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
    'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
  ]
})

module.exports = config
