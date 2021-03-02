import { createModel } from '@rematch/core';
import _ from 'lodash';
import serviceApi from '@assets/config/service';
import { IServiceMetric, IStatRangeItem, IStatSingleItem } from '@assets/utils/interface';
import { getStatus } from '@assets/utils/service';

interface IState {
  graphMetric: IServiceMetric
}

export const service = createModel({
  state: {
    graphMetric: {} as IServiceMetric,
  },
  reducers: {
    update: (state: IState, payload: any) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: (dispatch: any) => ({
    // graph metric
    async asyncGetGraphMetrics (payload: {
      end: number,
      interval: number,
      step: number
    }) {
      const { end, interval, step } = payload;
      const graphQpsRange = await dispatch.service.asyncGetGraphQPS({
        start: end - interval,
        end,
        step
      });
      const graphLatency = await dispatch.service.asyncGetGraphLatency({
        time: end
      });
      const graphErrors = await dispatch.service.asyncGetGraphErrors({
        time: end
      });
      const graphVersion = await dispatch.nebula.asyncGetServiceVersion('GRAPH');
      const data = graphQpsRange.map((item: IStatRangeItem) => {
        const name = item.metric.instanceName;
        const qpsStatistics = item.values.map(v => ({
          time: v[0],
          value: Number((v[1] / 60).toFixed(2))
        }));
        const qps = qpsStatistics[qpsStatistics.length - 1].value;
        let latency = '0 ms';
        let _graph = (graphLatency.filter((item: IStatSingleItem) => item.metric.instanceName === name)) as IStatSingleItem[];
        if(_graph[0] !== undefined) {
          latency = _graph[0].value[1] / 1000 + ' ms';
        }
        let error = '0';
        _graph = (graphErrors.filter((item: IStatSingleItem) => item.metric.instanceName === name)) as IStatSingleItem[];
        if(_graph[0] !== undefined) {
          error = _graph[0].value[1];
        }
        // TODO ger version bug need to be fixed
        let version = 'latest';
        const _graphVersion = graphVersion.filter(item => item.name === name)[0];
        if(_graphVersion) {
          version = _graphVersion.version;
        }
        return {
          name,
          qps,
          qpsStatistics,
          latency,
          error,
          version,
          status: getStatus(qps)
        };
      });
      const overview = data.reduce((res, item) => {
        const status = item.status.toLowerCase();
        item.qpsStatistics.forEach(metric => {
          const _item = res.qpsStatistics.filter(i => i.time === metric.time);
          if(_item.length > 0) {
            _item[0].value += metric.value;
          } else {
            res.qpsStatistics.push(metric);
          }
        });
        res[status]++;
        res.qps += item.qps;
        return res;
      }, {
        normal: 0,
        overload: 0,
        abnormal: 0,
        qps: 0,
        qpsStatistics: [] as any
      });
      const graphMetric = {
        overview,
        data
      };
      this.update({
        graphMetric
      });
    },

    async asyncGetGraphQPS (payload: {
      start: number,
      end: number,
      step: number
    }) {
      const { start, end, step } = payload;
      const promQL = `nebula_graphd_num_queries_sum_600`;
      const { code, data } = (await serviceApi.execPromQLByRange({
        query: promQL,
        start,
        end,
        step,
      })) as any;
      let graphQpsRange = [];
      if (code === 0) {
        graphQpsRange = data.result;
      }
      return graphQpsRange;
    },

    async asyncGetGraphLatency (payload: {
      time: number,
    }) {
      const { time } = payload;
      const promQL = `nebula_graphd_query_latency_us_avg_600`;
      const { code, data } = (await serviceApi.execPromQL({
        query: promQL,
        time
      })) as any;
      let graphLatency = [];
      if (code === 0) {
        graphLatency = data.result;
      }
      return graphLatency;
    },

    async asyncGetGraphErrors (payload: {
      time: number,
    }) {
      const { time } = payload;
      const promQL = `nebula_graphd_num_query_errors_sum_600`;
      const { code, data } = (await serviceApi.execPromQL({
        query: promQL,
        time
      })) as any;
      let graphErrors = [];
      if (code === 0) {
        graphErrors = data.result;
      }
      return graphErrors;
    },
    // storage metric
    // meta metric
  }),
});
