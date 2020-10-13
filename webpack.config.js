const path = require('path');
const package = require('./package.json');

const isModule = false;

let filename = '';
let libraryTarget = '';

if (isModule) {
  // 模块化
  filename = 'index.js';
  libraryTarget = 'umd';
} else {
  // 浏览器环境
  filename = `${package.name}.js`;
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