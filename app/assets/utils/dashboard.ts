import { IStatItem } from '@assets/store/models';
import { isNumber } from 'lodash';

export interface IMetric {
  time: number;
  value: number;
  type: string;
}

export const DETAIL_DEFAULT_RANGE = 60 * 60;
export const CARD_RANGE = 10 * 60;
export const CARD_POLLING_INTERVAL = 10000; 
export const CARD_STEP = 10;

export const THRESHOLDS = {
  LOW: 60,
  MEDIUM: 90,
};
export const CARD_LOW_COLORS = {
  SOLID: 'rgba(61,209,136,1)',
  TRANSPARENT: 'rgba(61,209,136,0)'
};
export const CARD_MEDIUM_COLORS = {
  SOLID: 'rgba(245,182,13,1)',
  TRANSPARENT: 'rgba(245,182,13,0)'
};
export const CARD_HIGH_COLORS = {
  SOLID: 'rgba(230,113,113,1)',
  TRANSPARENT: 'rgba(230,113,113,0)'
};

export const DETAIL_COLORS = {
  SOLID: 'rgba(67,114,255,1)',
  TRANSPARENT: 'rgba(67,114,255,1)',
};

export const getWhichColor = (value) => {
  if (value < THRESHOLDS.LOW) {
    return CARD_LOW_COLORS;
  } else if (value < THRESHOLDS.MEDIUM) {
    return CARD_MEDIUM_COLORS;
  } else {
    return CARD_HIGH_COLORS;
  }
};

export const getProperValue = (type, value) => {
  switch (type) {
    case 'disk':
      return getDiskProperSize(value);
    case 'memory':
      return getMemoryProperSize(value);
    case 'flow':
      return getAdaptiveFlowValue(value);
    default:
      return value;
  }
};

export const getAdaptiveFlowValue = (bytes) => {
  const _bytes = isNumber(bytes) ? bytes : Number(bytes);
  const mb = 1000 * 1000;
  const kb = 1000;
  const nm = _bytes / mb;
  const nk = _bytes / kb;
  if (nm >= 1) {
    return {
      value: +nm.toFixed(2),
      unit: 'Mbps',
    };
  } else if (nk >= 1) {
    return {
      value: +nk.toFixed(2),
      unit: 'Kbps',
    };
  } else {
    return {
      value: +_bytes.toFixed(2),
      unit: 'bps'
    };
  }
};

export const getMemoryProperSize = bytes => {
  const kb = 1024;
  const mb = 1024 * 1024;
  const gb = mb * 1024;
  const ng = Math.round(bytes / gb);
  const nm = Math.round(bytes / mb);
  const nk = Math.round(bytes / kb);

  if (ng >=1) {
    return `${ng}GB`;
  } else if (nm >= 1) {
    return `${nm}MB`;
  } else {
    return `${nk}KB`;
  } 
};

export const getDiskProperSize = bytes => {
  const gb = 1000 * 1000 * 1000;
  const tb = gb * 1000;
  const ng = Math.round(bytes / gb);
  const nt = Math.round(bytes / tb);

  if (nt > 1) {
    return `${nt}TB`;
  } else {
    return `${ng}GB`;
  }
};

export const getAverageStat = (data: IStatItem[], type: string) => {
  let average = [] as any;
  if (data.length) {
    average = data[0].values.map(([timestamp, _], idx) => {
      const total = data.reduce((sum, cur) => {
        sum += Number(cur.values[idx][1]);
        return sum;
      }, 0);
      const average = total / data.length;
      return {
        time: timestamp,
        value: average,
        type, 
      };
    });
  } 

  return average;
};

export const getDataByType = (data: IStatItem[], type?: string) => {
  let res = [] as IMetric[];
  switch (type) {
    case 'all':
      data.forEach(instance => {
        instance.values.forEach(([timstamps, value]) => {
          res.push({
            type: instance.metric.instance,
            value: Number(value),
            time: timstamps,
          });
        });
      });
      break;
    case 'average':
      res = getAverageStat(data, 'average');
      break;
    default:
      data.forEach(instance => {
        instance.values.forEach(([timstamps, value]) => {
          if (instance.metric.instance === type) {
            res.push({
              type: instance.metric.instance,
              value: Number(value),
              time: timstamps,
            });
          }
        });
      });
  }

  return res;
};

export const getProperTickInterval = (period) => {
  switch(period) {
    // past one hour
    case 24 * 60 * 60:
      return 2 * 60 * 60;
    case 60 * 60:
      return 5 * 60;
    default:
      return period < 60 * 60 ? 30 : 60 * 60 * 2;
  }
};