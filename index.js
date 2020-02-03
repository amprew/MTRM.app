require('core-js');
require('regenerator-runtime');
const fs = require('fs');
const babelrc = JSON.parse(fs.readFileSync('./.babelrc'));
require('@babel/register')(babelrc);

require('./server.js');
