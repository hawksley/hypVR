var path = require('path');

module.exports = {
     entry: './src/js/index.js',
     output: {
         path: path.resolve(__dirname, './dist'),
         filename: 'index.bundle.js'
     },
     module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['es2017']
            }
          }
        }
      ]
    }
 };
