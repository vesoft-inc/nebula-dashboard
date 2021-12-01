import path from 'path';
import { Configuration } from 'webpack';

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
  plugins: []
};

export {
  baseConifg
};