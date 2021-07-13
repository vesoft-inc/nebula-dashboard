import fs from 'fs';
import * as path from 'path';
import { Controller } from 'egg';

import manifestMap from '../../config/manifest.json';
import pkg from '../../package.json';

export default class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html', {
      Env: ctx.app.env,
      ManifestMap: manifestMap,
    });
  }

  async getAppInfo() {
    const { ctx } = this;

    ctx.response.body = {
      version: pkg.version,
    };
  }

  async getCustomizeConfig() {
    const { ctx } = this;
    const data = await fs.readFileSync(path.join(__dirname, '../../static/custom.json'), 'utf8');
    if(data) {
      ctx.response.body = {
        code: 0,
        data: JSON.parse(data)
      };
    } else {
      ctx.response.body = {
        code: -1,
        data: null
      };
    }
  }

  async getAnnotationLineConfig() {
    const { ctx } = this;
    const data = await fs.readFileSync(path.join(__dirname, '../../static/annotationLine.json'), 'utf8');
    if(data) {
      ctx.response.body = {
        code: 0,
        data: JSON.parse(data)
      };
    } else {
      ctx.response.body = {
        code: -1,
        data: null
      };
    }
  }
}
