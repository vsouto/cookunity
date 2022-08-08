const path = require('path');

module.exports = {
  entry: './frontend/src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'frontend'),
    },
    compress: true,
    port: 9000,
  },
};