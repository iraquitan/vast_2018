const path = require('path')

module.exports = {
  entry: {
    // 'module/index': './src/index.js',
    'js/mc1': './src/mc1.js',
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: './[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}
