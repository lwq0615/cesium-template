const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader/dist/index')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { DefinePlugin } = require('webpack')
const dotenv = require('dotenv')

const baseConfig = dotenv.config({
  path: path.resolve(__dirname, './.env'), // 配置文件路径
  encoding: 'utf8', // 编码方式，默认utf8
  debug: false, // 是否开启debug，默认false
}).parsed

const envConfig = dotenv.config({
  path: path.resolve(__dirname, `./.env.${process.env.NODE_ENV}`), // 配置文件路径
  encoding: 'utf8', // 编码方式，默认utf8
  debug: false, // 是否开启debug，默认false
}).parsed

const config = Object.assign(baseConfig, envConfig)

const env = {}

Object.keys(config).forEach(key => {
  env['process.env.' + key] = JSON.stringify(config[key])
})

module.exports = {
  mode: process.env.NODE_ENV,
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        use: ['@open-wc/webpack-import-meta-loader', 'babel-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./public/Cesium", to: path.resolve(__dirname, "./dist/static/Cesium") },
      ]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      filename: 'index.html',
      title: "cesium"
    }),
    new VueLoaderPlugin(),
    new DefinePlugin({
      ...env,
      __VUE_OPTIONS_API__: false, // 表示是否支持 options api 的写法，默认是 true
      __VUE_PROD_DEVTOOLS__: false, // 表示生产包是否要继续支持 devtools 插件，默认是 false
      CESIUM_BASE_URL: JSON.stringify('./static/Cesium')
    })
  ],
  devServer: {
    static: path.resolve(__dirname, './public'),
    port: 3000
  }
}