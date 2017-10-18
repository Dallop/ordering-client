module.exports = function (storybookBaseConfig, configType) {
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.
  // Make whatever fine-grained changes you need
  storybookBaseConfig.resolve.extensions.concat([ '.js', '.css' ])
  storybookBaseConfig.resolve.modules = [
    'src',
    'shared',
    'node_modules',
    'public'
  ]
  storybookBaseConfig.module.rules.push({
    test: /\.css$/,
    exclude: '/node_modules/',
    use: [ 'style-loader', 'css-loader' ]
  })
  storybookBaseConfig.module.rules.push({
    test: /\.(jpe?g|png|gif|svg)$/i,
    loaders: [
      'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
      'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
    ]
  })

  // Return the altered config
  return storybookBaseConfig
}
