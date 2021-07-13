import fs from 'fs';
import * as path from 'path';
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;
  // path: /.../nebula-dashboard/static
  config.configPath = __dirname.substr(0, __dirname.length - 6) + '/static';
if (!fs.existsSync(config.configPath)) {
  fs.mkdirSync(config.configPath, { recursive: true });
}
const file = path.join(config.configPath, 'custom.json')
fs.access(file, fs.constants.F_OK, (err) => {
  if(err) {
    const content = JSON.stringify({
      "ip:port":"your alias"
    })
    fs.writeFile(file, content, err => {
      if(err) {
        return err
      }
    })
  }
})

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1544867050896_3341';

  // add your egg config in here
  config.middleware = [];

  config.view = {
    root: path.join(appInfo.baseDir, 'app/assets'),
    mapping: {
      '.html': 'assets',
    },
  };

  config.assets = {
    publicPath: '/public/',
    templatePath: path.join(appInfo.baseDir, 'app/assets/index.html'),
    templateViewEngine: 'nunjucks',
    devServer: {
      debug: false,
      command:
        'webpack-dev-server --config config/webpack.dev.ts --mode development --color --progress --hot',
      port: 7777,
      env: {
        PUBLIC_PATH: 'http://127.0.0.1:7777',
      },
    },
  };

  config.cluster = {
    listen: {
      port: 7003,
      hostname: '0.0.0.0',
    },
  };

  config.multipart = {
    fileSize: '100mb',
    mode: 'stream',
    fileModeMatch: /^\/upload_file$/,
    whitelist: ['.csv'],
  };

  config.security = {
    csrf: false,
  };

  config.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(__dirname, '../favicon.ico'))
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
