const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: process.env.NODE_ENV === 'production' ? '/var/www/mokit.eldorqazwe.ru' : 'mokit.eldorqazwe.ru',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://eldorqazwe.online',
        changeOrigin: true
      },
    }
  },
})
