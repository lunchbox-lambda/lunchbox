const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const serverHost = 'http://localhost:8090';

module.exports = {

  mode: 'development',

  entry: './src/index.tsx',

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[hash].js',
  },

  resolve: {
    modules: [
      path.resolve(__dirname),
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '..', 'node_modules'),
    ],
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/, loader: 'awesome-typescript-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|woff|woff2|eot|ttf|otf|md)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'assets/',
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      favicon: 'assets/favicon.png',
    }),
    new MiniCssExtractPlugin({ filename: '[contenthash].css' }),
  ],

  devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': {
        target: serverHost,
        secure: false,
      },
      '/socket': {
        target: serverHost,
        secure: false,
        ws: true,
      },
      '/red': {
        target: serverHost,
        secure: false,
      },
      '/red/comms': {
        target: serverHost,
        secure: false,
        ws: true,
      },
      '/red/dashboard': {
        target: serverHost,
        secure: false,
      },
    },
    historyApiFallback: true,
    disableHostCheck: true,
    inline: false,
  },

};
