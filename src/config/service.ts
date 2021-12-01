import { _delete, get, post } from '../utils/http';

const execNGQL = post('/api-nebula/db/exec');

const connectDB = post('/api-nebula/db/connect');

const execPromQL = get('/api-metrics/query');

const execPromQLByRange = get('/api-metrics/query_range');

const getAppInfo = get('/api/app');
const getCustomConfig = get('/api/config/custom');
const getAnnotationLineConfig = get('/api/config/annotation_line');

export default {
  execNGQL,
  connectDB,
  getAppInfo,
  execPromQL,
  execPromQLByRange,
  getCustomConfig,
  getAnnotationLineConfig
};
