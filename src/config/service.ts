import { _delete, get, post } from '../utils/http';

const execNGQL = post('/api-nebula/db/exec');

const connectDB = post('/api-nebula/db/connect');

const getSpaces = get('/api-metrics/label/space/values');

const getDevices = get('/api-metrics/label/device/values');

const getMetrics = get('/api-metrics/label/__name__/values');

const execPromQL = get('/api-metrics/query');

const execPromQLByRange = get('/api-metrics/query_range');

const getAppInfo = get('/api/app');
const getCustomConfig = get('/api/config/custom');
const getAnnotationLineConfig = get('/api/config/annotation_line');

const getGraphConfig = get(`/api-graph/flags`);
const getStorageConfig = get(`/api-storage/flags`);

export default {
  execNGQL,
  connectDB,
  getSpaces,
  getDevices,
  getMetrics,
  getAppInfo,
  execPromQL,
  execPromQLByRange,
  getCustomConfig,
  getGraphConfig,
  getStorageConfig,
  getAnnotationLineConfig,
};
