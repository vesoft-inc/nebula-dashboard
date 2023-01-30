const express = require('express');
const historyApiCallback = require('connect-history-api-fallback');
const startWebserver = require('./startWebserver');

const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const pkg = require('./package.json');

function loadYamlConfig() {
  const doc = yaml.load(fs.readFileSync(path.resolve(process.cwd(), 'config.yaml'), 'utf8'));
  return doc;
}

const config = loadYamlConfig();

const app = express();

app.use(historyApiCallback());
app.use(express.static('public'));

startWebserver(app, config, pkg.version);