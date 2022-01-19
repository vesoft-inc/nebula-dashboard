const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const history = require('connect-history-api-fallback');
const fs = require('fs');
const pkg = require('../package.json');
const yaml = require('js-yaml');
let config = {};
try {
  let fileContents = fs.readFileSync('config.yaml', 'utf8');
  config = yaml.load(fileContents);
} catch (e) {
  console.log(e);
  throw new Error(e);
}

const { proxy,nebulaServer,  port = 7003 } = config;

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
  if (data) {
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