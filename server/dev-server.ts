import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import { createProxyMiddleware } from 'http-proxy-middleware';
import history from 'connect-history-api-fallback';
import config from '../config/webpack.config.dev';
import pkg from '../package.json';

const path = require('path');
// change node config dir 
// process.env.NODE_CONFIG_DIR = path.resolve('./server') ;
// process.env.NODE_ENV= "config";
// import _config from "config";
// _config
// const port = _config.get('port');
// const nebulaServer = _config.get('nebulaServer');
// const proxy = _config.get('proxy');

const app = express();
const compiler = webpack(config);

const getTargetUrl =(target)=> {
  return target.startsWith('http') ? target : `http://${target}`
}

app.use(history());

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    index: 'index.html',
  })
);

app.use('/api-metrics/*', createProxyMiddleware({
  target: getTargetUrl(proxy.prometheus.target),
  pathRewrite: {
    '/api-metrics': '/api/v1',
  },
  changeOrigin: true,
}))

app.use('/api-nebula/*', createProxyMiddleware({
  target: getTargetUrl(proxy.gateway.target),
  pathRewrite: {
    '/api-nebula': '/api',
  },
  changeOrigin: true,
}));

app.use('/api-graph/*', createProxyMiddleware({
  target: getTargetUrl(proxy.graph.target),
  pathRewrite: {
    '/api-graph': '/',
  },
  changeOrigin: true,
}));

app.use('/api-storage/*', createProxyMiddleware({
  target: getTargetUrl(proxy.storage.target),
  pathRewrite: {
    '/api-storage': '/',
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

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!\n`);
});