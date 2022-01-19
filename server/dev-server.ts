import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { createProxyMiddleware } from 'http-proxy-middleware';
import history from 'connect-history-api-fallback';
import fs from 'fs';
import path from "path";
const yaml = require('js-yaml');
import config from '../config/webpack.config.dev';
import pkg from '../package.json';

let _config = {} as any;
try {
  let fileContents = fs.readFileSync(path.join(__dirname, './config.yaml'), 'utf8');
  _config = yaml.load(fileContents);
} catch (e) {
  console.log(e);
  throw new Error();
}

const app = express();
const compiler = webpack(config);
const { nebulaServer } = _config;

app.use(history());

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    index: 'index.html',
  })
);

app.use('/api-metrics/*', createProxyMiddleware({
  target: 'http://192.168.8.157:9090',
  pathRewrite: {
    '/api-metrics': '/api/v1',
  },
  changeOrigin: true,
}))

app.use('/api-nebula/*', createProxyMiddleware({
  target: 'http://192.168.8.240:8080',
  pathRewrite: {
    '/api-nebula': '/api',
  },
  changeOrigin: true,
}));

app.get('/api/app', (_req, res) => {
  res.send({
    version: pkg.version,
  })
});

app.get('/api/config/custom', async (_req, res) => {
  if (nebulaServer) {
    res.send({
      code: 0,
      data: {
        connection: nebulaServer,
        alias: {
            "ip:port": "instance1"
        },
      }
    });
  } else {
    res.send({
      code: -1,
      data: null
    });
  }
});

app.listen(7003, function () {
  console.log('Example app listening on port 7003!\n');
});