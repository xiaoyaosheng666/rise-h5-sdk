const path = require('path');

const isModule = false;

let filename = 'index.js';
let libraryTarget = 'umd';

if (isModule) {
  // 模块化
} else {
  // 浏览器环境
  filename = 'rise-h5-sdk.js';
  libraryTarget = 'window';
}

module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename,
    libraryTarget
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};