const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://eldorqazwe.online',
        changeOrigin: true
      },
    }
  },
})
