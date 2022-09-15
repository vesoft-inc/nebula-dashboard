import path from 'path';
import { Configuration, DefinePlugin } from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import pkg from '../package.json';

const isDevEnv = () => process.env.NODE_ENV === 'development';

const useCssPlugin = () => !isDevEnv();

const baseConifg: Configuration = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                '@babel/preset-react',
              ],
              plugins: [
                [
                  'import',
                  {
                    "libraryName": "antd",
                    "style": true,   // or 'css'
                  }
                ]
              ]
            }
          }
        ],
        include: path.join(__dirname, `../src`),
      },
      {
        test: /\.css$/,
        use: [
          useCssPlugin() ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /(?<!module)\.less$/,
        use: [
          useCssPlugin() ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  'primary-color': '#4372FF',
                  'link-color': '#4372FF',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.module\.less$/,
        exclude: /node_modules/,
        use: [
          useCssPlugin() ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                exportGlobals: true,
                localIdentName: '[local]__[hash:base64:5]',
                localIdentContext: path.resolve(__dirname, '..', 'src'),
                exportLocalsConvention: 'camelCase',
              },
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
            options: { lessOptions: { javascriptEnabled: true } },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|ttf)(\?t=\d+)?$/,
        type: 'asset/resource',
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.less'],
    alias: {
      "@": path.join(__dirname, "../src"),
    }
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        DASHBOARD_VERSION: JSON.stringify(pkg.version),
        NEBULA_VERSION: JSON.stringify(pkg.nebulaVersion),
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../static/iconfont/iconfont.js'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.html'),
      title: 'Nebula Dashboard',
      favicon: path.join(__dirname, '../favicon.ico'),
      templateParameters: {
        DASHBOARD_VERSION: process.env.DASHBOARD_VERSION,
        VERSION_TYPE: 'community',
      },
    }),
  ]
};

export {
  baseConifg
};