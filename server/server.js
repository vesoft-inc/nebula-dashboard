const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const history = require('connect-history-api-fallback');
const pkg = require('../package.json');
const path = require('path');

// change node config dir 
process.env.NODE_CONFIG_DIR = path.resolve('') ;
process.env.NODE_ENV= "config";
const _config = require("config");
const port = _config.get('port');
const nebulaServer = _config.get('nebulaServer');
const proxy = _config.get('proxy');

if (!proxy) {
  throw new Error('no proxy found in config.yaml');
}

if (!port) {
  throw new Error('no port found in config.yaml');
}

const getTargetUrl =(target)=> {
  return target.startsWith('http') ? target : `http://${target}`
}

const app = express();

app.use(history());

app.use(express.static('public'));

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
  console.log(`Welcome to Nebula Dashboard!\r\nthe app is listening on port ${port}!\n`);
});