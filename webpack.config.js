const path = require('path');
const MonacoPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: './src/index.js', // ваш вихідний файл, де буде код парсингу
  output: {
    filename: 'bundle.js', // ім'я вихідного файлу
    path: path.resolve(__dirname, 'dist'), // шлях для зберігання зібраного коду
    libraryTarget: 'var',
    library: 'YourLibraryName', // Ім'я бібліотеки (необов'язково)
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
    ]
  },
  plugins: [new MonacoPlugin({languages: []})]
};
