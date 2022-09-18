const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  outputDir: 'dist',
  assetsDir:'static',
  devServer: {
    port:9000
  }
})
