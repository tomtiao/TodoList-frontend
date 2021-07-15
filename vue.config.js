module.exports = {
  devServer: {
    proxy: 'http://localhost:2333'
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}
