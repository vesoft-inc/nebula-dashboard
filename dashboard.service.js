
const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const execSync = require("child_process").execSync;
const chalk = require('chalk');

const pkg = require('./package.json');

const config = loadYamlConfig();

const program = new Command();

const COMPONETS = {
  GATEWAY: 'gateway',
  PROMETHEUS: 'prometheus',
  STATS_EXPORTER: 'stats-exporter',
  WEBSERVER: 'webserver'
}

program.version(`NebulaGraph Dashboard Community v${pkg.version}`, '-v --version', 'NebulaGraph Dashboard version');

program
  .name('dashboard');

program
  .command('start')
  .argument('<service>', 'service type')
  .description(`start service, all|${COMPONETS.GATEWAY}|${COMPONETS.STATS_EXPORTER}|${COMPONETS.PROMETHEUS}|${COMPONETS.WEBSERVER}`)
  .action((service) => {
    checkAndUpdateConfig();
    startServices(service);
  });

program
  .command('stop')
  .argument('<service>', 'service type')
  .description(`stop service, all|${COMPONETS.GATEWAY}|${COMPONETS.STATS_EXPORTER}|${COMPONETS.PROMETHEUS}|${COMPONETS.WEBSERVER}`)
  .action((service) => {
    stopServices(service);
  })

program
  .command('status')
  .argument('<service>', 'service type')
  .description(`status service, all|${COMPONETS.GATEWAY}|${COMPONETS.STATS_EXPORTER}|${COMPONETS.PROMETHEUS}|${COMPONETS.WEBSERVER}`)
  .action((service) => {
    statusServices(service)
  })

program
  .command('restart')
  .argument('<service>', 'service type')
  .description(`restart service, all|${COMPONETS.GATEWAY}|${COMPONETS.STATS_EXPORTER}|${COMPONETS.PROMETHEUS}|${COMPONETS.WEBSERVER}`)
  .action((service) => {
    restartServices(service)
  })

program.parse();

function loadYamlConfig() {
  const doc = yaml.load(fs.readFileSync(path.resolve(process.cwd(), 'config.yaml'), 'utf8'));
  return doc;
}

function INFO(...info) {
  console.log(chalk.green(info.join(' ')))
}

function ERROR(...info) {
  console.log(chalk.red(info.join(' ')))
}

function checkConfig(config) {
  if (!config.port) {
    throw new Error('port is required, no port info found in config.yaml');
  }
  if (!config['stats-exporter']) {
    throw new Error('stats-exporter is required, no stats-exporter info found in config.yaml');
  }
  if (!config.gateway) {
    throw new Error('gateway is required, no gateway info found in config.yaml');
  }
  if (!(config.prometheus)) {
    throw new Error('prometheus is required, no prometheus info found in config.yaml');
  }
  return true;
}

async function updateGatewayConfig() {
  const gatewayConfig = config.gateway;
  const gatewayPath = path.resolve(process.cwd(), 'vendors/nebula-http-gateway/conf/app.conf');
  fs.readFile(gatewayPath, 'utf8', function (err, data) {
    if (err) {
      return INFO(err);
    }
    let result = data.replace(/httpport = \S*/g, `httpport = ${gatewayConfig.port}`);
    result = result.replace(/runmode = \S*/g, `runmode = ${gatewayConfig.runmode}`);
    fs.writeFileSync(gatewayPath, result, 'utf8');
  });
}

function updateStatsExporterConfig() {
  const statsExporterPath = path.resolve(process.cwd(), 'vendors/nebula-stats-exporter/config.yaml');
  const statsExporterConfig = config['nebula-cluster'];
  const content = {
    clusters: [
      {
        name: statsExporterConfig.name,
        instances: []
      }
    ]
  };
  ['metad', 'storaged', 'graphd'].forEach((type) => {
    statsExporterConfig[type].forEach(item => {
      content.clusters[0].instances.push({
        name: item.name,
        endpointIP: item.endpointIP,
        endpointPort: item.endpointPort,
        componentType: type
      })
    })
  });
  const result = yaml.dump(content);
  fs.writeFileSync(statsExporterPath, result, 'utf8', function (err) {
    if (err) return INFO(err);
  });
}

function updatePrometheusConfig() {
  const prometheusConfig = config.prometheus;
  const prometheusPath = path.resolve(process.cwd(), 'vendors/prometheus/prometheus.yml');
  const content = {
    global: {
      scrape_interval: prometheusConfig.scrape_interval,
      evaluation_interval: prometheusConfig.evaluation_interval
    },
    scrape_configs: [
      {
        job_name: 'node-exporter',
        static_configs: [
          {
            targets: config['node-exporter'].map(item => `${item.ip}:${item.port}`)
          }
        ]
      },
      {
        job_name: 'nebula-stats-exporter',
        static_configs: [
          {
            targets: [`${config['stats-exporter'].ip}:${config['stats-exporter'].nebulaPort}`]
          }
        ]
      }
    ]
  };
  const result = yaml.dump(content);
  fs.writeFileSync(prometheusPath, result, 'utf8', function (err) {
    if (err) return INFO(err);
  });
}

function startServices(type) {
  try {
    const dashoardShFile = path.resolve(process.cwd(), 'scripts/dashboard.sh');
    execSync(`bash ${dashoardShFile} start ${type}`, {stdio: 'inherit'})
  } catch (error) {
    ERROR(error)
  }
}

function restartServices(type) {
  try {
    const dashoardShFile = path.resolve(process.cwd(), 'scripts/dashboard.sh');
    execSync(`bash ${dashoardShFile} restart ${type}`, {stdio: 'inherit'})
  } catch (error) {
    ERROR(error)
  }
}

function stopServices(type) {
  try {
    const dashoardShFile = path.resolve(process.cwd(), 'scripts/dashboard.sh');
    execSync(`bash ${dashoardShFile} stop ${type}`, {stdio: 'inherit'})
  } catch (error) {
    ERROR(error)
  }
}

function statusServices(type) {
  try {
    const dashoardShFile = path.resolve(process.cwd(), 'scripts/dashboard.sh');
    execSync(`bash ${dashoardShFile} status ${type}`, {stdio: 'inherit'})
  } catch (error) {
    ERROR(error)
  }
}

function checkAndUpdateConfig() {
  if (!checkConfig(config)) {
    return;
  }

  // update gawteway config
  updateGatewayConfig();

  // update stats exporter config
  updateStatsExporterConfig()

  // update prometheus config
  updatePrometheusConfig();

}