const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const { NODE_ENV } = process.env;

const IS_PRODUCTION = NODE_ENV === 'production';

module.exports = {
  mode: IS_PRODUCTION ? 'production' : 'development',
  devtool: IS_PRODUCTION ? false : 'eval-source-map',
  entry: {
    main: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: false,
        parallel: true,
        cache: !IS_PRODUCTION,
        terserOptions: {
          mangle: true,
          output: {
            beautify: false,
            comments: false
          },
          compress: true,
          warnings: false
        }
      })
    ],
  }
}
