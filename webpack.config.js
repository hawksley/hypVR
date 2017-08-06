var path = require('path');

module.exports = {
     entry: './src/js/index.js',
     output: {
         path: path.resolve(__dirname, './dist'),
         filename: 'index.bundle.js'
     },
     devServer: {
         contentBase: path.join(__dirname, "dist"),
         compress: true,
         port: 9000
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
