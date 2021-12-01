import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { createProxyMiddleware } from 'http-proxy-middleware';
import history from 'connect-history-api-fallback';
import fs from 'fs';
import path from 'path';

import config from '../config/webpack.config.dev';
import pkg from '../package.json';

const app = express();
const compiler = webpack(config);

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
  target: 'http://192.168.8.157:8090',
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
  const data = await fs.readFileSync(path.join(__dirname, '../static/custom.json'), 'utf8');
  if (data) {
    res.send({
      code: 0,
      data: JSON.parse(data)
    });
  } else {
    res.send({
      code: -1,
      data: null
    });
  }
});

app.listen(7004, function () {
  console.log('Example app listening on port 7003!\n');
});