const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (args = {}) => {
  const isDev = !!args.development;

  return {
    mode: isDev ? 'development' : 'production',
    entry: './src/index.ts',
    devtool: isDev ? 'eval-cheap-module-source-map' : undefined,
    module: {
      rules: [
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        { test: /\.(js|ts)x?$/, use: 'babel-loader', exclude: /node_modules/ },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({ template: 'template.html' }),
      new ForkTsCheckerWebpackPlugin(),
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.css'],
    },
    output: {
      filename: '[name].[contenthash].bundle.js',
      publicPath: '/',
      path: path.resolve(__dirname, './dist'),
    },
    devServer: {
      historyApiFallback: true,
      contentBase: path.resolve(__dirname, './dist'),
      open: false,
      compress: true,
      port: 3000,
    },
    optimization: { splitChunks: { chunks: 'all' } },
    stats: {
      errorDetails: true,
    },
  };
};
