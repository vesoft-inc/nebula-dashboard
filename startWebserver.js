const { createProxyMiddleware } = require('http-proxy-middleware');
const chalk = require('chalk');

function INFO(...info) {
  console.log(chalk.green(info.join(' ')))
}

function getFullUrl({ https, ip, port }) {
  const protocol = https ? 'https' : 'http';
  return `${protocol}://${ip}:${port}`;
}

function getPrometheusUrl({https, ip, prometheusPort}) {
  const protocol = https ? 'https' : 'http';
  return `${protocol}://${ip}:${prometheusPort}`;
}

function getServiceTarget(type, config) {
  const service = config['nebula-cluster'];
  if (!service) {
    throw new Error(`nebula cluster should have at least one ${type} service`);
  }
  const { endpointIP, endpointPort } = service[type][0];
  if (endpointIP.startsWith('http')) {
    throw new Error(`endpointIP should not start with http, got ${endpointIP}`);
  }
  return `http://${endpointIP}:${endpointPort}`;
}

function startWebserver(app, config, version) {

  app.use('/api-metrics/*', createProxyMiddleware({
    target: getPrometheusUrl(config.prometheus),
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
      version,
    })
  });

  ['graphd', 'storaged', 'metad'].forEach((type) => {
    app.use(`/api-${type}/*`, createProxyMiddleware({
      target: getServiceTarget(type, config),
      pathRewrite: {
        [`/api-${type}`]: '/',
      },
      changeOrigin: true,
    }));
  })

  app.get('/api/config/custom', async (_req, res) => {
    res.send({
      code: 0,
      data: {
        connection: {
          ip: config['nebula-cluster'].graphd[0].endpointIP,
          port: config['nebula-cluster'].graphd[0].port
        },
        alias: {
          "ip:port": getServiceTarget('graphd', config)
        },
      }
    });
  });

  app.listen(config.port, function () {
    INFO(`Welcome to Nebula Dashboard!\r\nthe app is listening on port ${config.port}!\n`);
  });
}

module.exports = startWebserver;