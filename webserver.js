const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const history = require('connect-history-api-fallback');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const pkg = require('./package.json');

function loadYamlConfig() {
  const doc = yaml.load(fs.readFileSync(path.resolve(process.cwd(), 'config.yaml'), 'utf8'));
  return doc;
}

const config = loadYamlConfig();

function INFO(...info) {
  console.log(chalk.green(info.join(' ')))
}

function getFullUrl({ https, host, port }) {
  const protocol = https ? 'https' : 'http';
  return `${protocol}://${host}:${port}`;
}

function getServiceTarget(type) {
  const service = config['nebula-cluster'];
  if (!service) {
    throw new Error(`nebula cluster should have at least one ${type} service`);
  }
  const { endpointIP, port } = service[type][0];
  if (endpointIP.startsWith('http')) {
    throw new Error(`endpointIP should not start with http, got ${endpointIP}`);
  }
  return `http://${endpointIP}:${port}`;
}

function startWebserver() {
  const app = express();

  app.use(history());

  app.use(express.static('public'));

  app.use('/api-metrics/*', createProxyMiddleware({
    target: getFullUrl(config.prometheus),
    pathRewrite: {
      '/api-metrics': '/api/v1',
    },
    changeOrigin: true,
  }))

  app.use('/api-nebula/*', createProxyMiddleware({
    target: getFullUrl(config.gateway),
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

  app.use('/api-graph/*', createProxyMiddleware({
    target: getServiceTarget('graphd'),
    pathRewrite: {
      '/api-graph': '/',
    },
    changeOrigin: true,
  }));

  app.use('/api-storage/*', createProxyMiddleware({
    target: getServiceTarget('storaged'),
    pathRewrite: {
      '/api-storage': '/',
    },
    changeOrigin: true,
  }));

  app.get('/api/config/custom', async (_req, res) => {
    res.send({
      code: 0,
      data: {
        connection: {
          ip: config['nebula-cluster'].graphd[0].endpointIP,
          port: config['nebula-cluster'].graphd[0].port
        },
        alias: {
          "ip:port": getServiceTarget('graphd')
        },
      }
    });
  });

  app.listen(config.port, function () {
    INFO(`Welcome to Nebula Dashboard!\r\nthe app is listening on port ${config.port}!\n`);
  });
}

startWebserver();