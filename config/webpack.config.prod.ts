import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack, { Configuration } from 'webpack';
// import ManifestPlugin from 'webpack-manifest-plugin';
import merge from 'webpack-merge';

import { baseConifg } from './webpack.config.base';

const publicConfig: Configuration = {
  // devtool: 'cheap-module-source-map',
  entry: path.join(__dirname, `../src/index.tsx`),
  mode: 'production',
  output: {
    path: path.join(__dirname, '../public'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: path.join(__dirname, '../public'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
    ],
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
        },
      },
    },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),

    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),

    // new ManifestPlugin({
    //   fileName: path.resolve(__dirname, '../config/manifest.json'),
    //   publicPath: '',
    // }),
  ],
};

const finalConfig = merge(baseConifg, publicConfig);

export default finalConfig;
