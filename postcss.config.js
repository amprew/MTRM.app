const { NODE_ENV } = process.env;

const IS_PRODUCTION = NODE_ENV === 'production';

module.exports = {
  plugins: [
    require('autoprefixer'),
    IS_PRODUCTION && require('cssnano')
  ]
}
