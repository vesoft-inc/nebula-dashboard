import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import history from 'connect-history-api-fallback';
import webpackConfig from '../config/webpack.config.dev';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import startWebserver from '../startWebserver';
import pkg from '../package.json';

const compiler = webpack(webpackConfig);

function loadYamlConfig() {
  const doc = yaml.load(fs.readFileSync(path.resolve(__dirname, 'config.yaml'), 'utf8'));
  return doc;
}

const config = loadYamlConfig();

const app = express();

app.use(history());

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    index: 'index.html',
  })
);

startWebserver(app, config, pkg.version);