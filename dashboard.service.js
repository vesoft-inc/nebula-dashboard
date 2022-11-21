
const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const execSync = require("child_process").execSync;
const spawn = require("child_process").spawn;
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
    // result = result.replace(/httpaddr = \S*/g, `httpaddr = ${gatewayConfig.host}`);
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
  const prometheusPath = path.resolve(process.cwd(), 'vendors/prometheus/prometheus.yaml');
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
            targets: config['node-exporter'].map(item => `${item.host}:${item.port}`)
          }
        ]
      },
      {
        job_name: 'nebula-stats-exporter',
        static_configs: [
          {
            targets: [`${config['stats-exporter'].host}:${config['stats-exporter'].port}`]
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


function spawnCmd(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, options);
    child.stdout.on('data', (data) => {
      console.log(`${data}`);
    });
    child.stderr.on('data', (data) => {
      reject(data);
    });
    child.on('close', (code) => {
      resolve(code);
    });
  })
}

function startService(type) {
  const LOG_DIR = makeDirIfAbsent('logs');
  // const PID_DIR = makeDirIfAbsent('pids');
  let command = '';
  INFO("Starting", type)
  let cwd = '';
  let mainCmd = '';
  switch (type) {
    case COMPONETS.GATEWAY:
      cwd = path.resolve(process.cwd(), 'vendors/nebula-http-gateway');
      mainCmd = `${cwd}/nebula-httpd`;
      command = `nohup ${mainCmd} > ${LOG_DIR}/nebula-http.log 2>&1 &`;
      break;
    case COMPONETS.STATS_EXPORTER:
      cwd = path.resolve(process.cwd(), 'vendors/nebula-stats-exporter');
      mainCmd = `${cwd}/nebula-stats-exporter`;
      command = `nohup ${mainCmd} --listen-address=":${config['stats-exporter'].port}" --bare-metal --bare-metal-config=${cwd}/config.yaml > ${LOG_DIR}/start-exporter.log 2>&1 &`
      break;
    case COMPONETS.PROMETHEUS:
      cwd = path.resolve(process.cwd(), 'vendors/prometheus');
      mainCmd = `${cwd}/prometheus`;
      command = `nohup ${mainCmd} --config.file ${cwd}/prometheus.yaml --web.listen-address=:${config.prometheus.port} > ${LOG_DIR}/prometheus.log 2>&1 &`
      break;
    case COMPONETS.WEBSERVER:
      cwd = path.resolve(process.cwd(), 'bin');
      mainCmd = `${cwd}/webserver`;
      command = `nohup ${mainCmd} > ${LOG_DIR}/webserver.log 2>&1 &`
      break;
  }
  try {
    spawnCmd(`(${command})`, [], { shell: true, detached: true }).then((code) => {
      if (code === 0) {
        INFO(type, 'started')
      }
    }).catch(err => {
      ERROR(type, 'started failed, caused by', err)
    })
  } catch (error) {
    ERROR(error)
  }
}

function stopService(type) {
  makeDirIfAbsent('logs')
  try {
    switch (type) {
      case COMPONETS.GATEWAY:
        execSync(`kill -9 $(lsof -i:${config.gateway.port} -t)`)
        break;
      case COMPONETS.STATS_EXPORTER:
        execSync(`kill -9 $(lsof -i:${config['stats-exporter'].port} -t)`)
        break;
      case COMPONETS.PROMETHEUS:
        execSync(`kill -9 $(lsof -i:${config.prometheus.port} -t)`)
        break;
      case COMPONETS.WEBSERVER:
        execSync(`kill -9 $(lsof -i:${config.port} -t)`)
        break;
    }
  } catch (error) {
    // ERROR(`${type} service is exited already`)
  }
}

function makeDirIfAbsent(dir) {
  const dirPath = path.resolve(process.cwd(), dir)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  }
  return dirPath;
}

function startServices(type) {
  if (type === 'all') {
    startService(COMPONETS.GATEWAY);
    startService(COMPONETS.STATS_EXPORTER);
    startService(COMPONETS.PROMETHEUS);
    startService(COMPONETS.WEBSERVER);
  } else {
    startService(type);
  }
}

function stopServices(type) {
  if (type === 'all') {
    stopService(COMPONETS.GATEWAY);
    stopService(COMPONETS.STATS_EXPORTER);
    stopService(COMPONETS.PROMETHEUS);
    stopService(COMPONETS.WEBSERVER);
  } else {
    stopService(type);
  }
}

function statusService(type) {
  let command = ''
  switch (type) {
    case COMPONETS.GATEWAY:
      command = `lsof -i:${config.gateway.port} -t`
      break;
    case COMPONETS.STATS_EXPORTER:
      command = `lsof -i:${config['stats-exporter'].port} -t`
      break;
    case COMPONETS.PROMETHEUS:
      command = `lsof -i:${config.prometheus.port} -t`
      break;
    case COMPONETS.WEBSERVER:
      command = `lsof -i:${config.port} -t`
      break;
  }
  try {
    const result = execSync(command, { encoding: 'utf-8' });
    INFO(type, 'service is running in', result)
  } catch (error) {
    ERROR(type, 'is exited')
  }
}

function statusServices(type) {
  if (type === 'all') {
    statusService(COMPONETS.GATEWAY);
    statusService(COMPONETS.STATS_EXPORTER);
    statusService(COMPONETS.PROMETHEUS);
    statusService(COMPONETS.WEBSERVER);
  } else {
    statusService(type);
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

// main();