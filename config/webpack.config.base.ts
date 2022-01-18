import path from 'path';
import { Configuration } from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// import pkg from '../package.json';

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
        test: /\.less/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // url: true,
            }
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  'primary-color': '#4372FF',
                },
                javascriptEnabled: true,
              },
            },
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
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     DASHBOARD_VERSION: JSON.stringify(pkg.version),
    //   },
    // }),
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
      },
    }),
  ]
};

export {
  baseConifg
};