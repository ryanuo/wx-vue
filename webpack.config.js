const path = require('path')
// 导入html-webpack-plugin 
const HtmlPlugin = require('html-webpack-plugin')
// 创建插件的实例对象
const html = new HtmlPlugin({
  // 指定复制的页面
  template: './src/index.html',
  // 指定复制出来的文件名和存档路径
  filename: './index.html'
})
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  devtool: 'nosources-source-map', // eval-source-map
  mode: 'development', //productions,
  entry: path.join(__dirname, './src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/main.js'
  },
  plugins: [html, new CleanWebpackPlugin()],
  devServer: {
    open: true,
    port: 9090,  //自定义端口号
    host: '127.0.0.1' // 指定打开地址
  },
  module: {
    rules: [
      {
        test: /\.css$/, use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/, use: 'url-loader?limit=447&outputPath=images'
      },
      // 处理高级的js语法
      {
        test: /\.js$/, use: 'babel-loader', exclude: '/node_modules/'
      }
    ]
  },
  resolve: {
    alias: {
      "@": path.join(__dirname, './src/'),
      "vue": './node_modules/vue/dist/vue.js'
    }
  }
}