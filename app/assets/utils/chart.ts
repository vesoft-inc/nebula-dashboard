import { Chart, Util } from '@antv/g2';
import dayjs from 'dayjs';
import { sum } from 'lodash';
import { getProperValue } from './dashboard';

const _items1Fn = (options) => (items => {
  const statSizes = options.statSizes;
  const [ { data: { type }, value }] = items;
  let size = 0;
  if (type === 'average') {
    const values = Object.values(statSizes);
    size = sum(values) / values.length;
  } else {
    size = statSizes[type];
  }
  const used = getProperValue(options.type, size * Number(value) / 100);
  const capacity = getProperValue(options.type, size);
  return [
    {
      ...items[0],
      value: Number(value).toFixed(2) + '%' + ` (${used}/${capacity})`,
    }
  ];
}); 

const _items2 = items => {
  return [
    {
      ...items[0],
      value: Number(items[0].value).toFixed(2) + '%'
    }
  ];
};

export const LINE_CHART_COLORS = [
  '#4372FF',
  '#EB2F96',
  '#0EBAD2',
  '#29C377',
  '#F5B60D',
  '#E25F5F',
  '#7B9CFF',
  '#55CFDE',
  '#F16DB5',
  '#67D39E',
  '#F6CA54',
  '#EB8E8E',
  '#B4C6FF',
  '#9CE3EB',
  '#F7ACD5',
  '#A6E4C5',
  '#F8DE9B',
  '#F4BCBC',
  '#BFBFBF',
  '#595959'
];

export const configDetailChart = (chartInstance: Chart, options: {
  type: 'disk' | 'cpu' | 'flow' | 'memory'
  isPercentValue: boolean,
  tickInterval?: number,
  statSizes?: any
}): Chart => {
  chartInstance
    .axis('time', {
      label: {
        formatter: time => {
          return dayjs(Number(time) * 1000).format('HH:mm');
        }
      },
      grid: {
        line: {
          type: 'line',
          style: {
            fill: '#d9d9d9',
            opacity: 0.5,
          }
        }
      }
    })
    .tooltip({
      customItems: options.statSizes ? _items1Fn(options) : _items2,
      title: time =>  {
        return dayjs(Number(time) * 1000).format('YYYY-MM-DD HH:mm:ss');
      }
    })
    .legend({
      position: 'bottom',
    })
    .scale({
      value: options.isPercentValue ? {
        min: 0,
        max: 100,
        tickInterval: 25,
      } : {},
      time: {
        tickInterval: options.tickInterval
      }
    })
    .line()
    .position('time*value')
    .color('type', LINE_CHART_COLORS)
    .shape('smooth');

  if (options.isPercentValue) {
    chartInstance.axis('value', {
      label: {
        formatter: percent => `${percent}%`
      },
    });
  }

  return chartInstance;
};

export const updateDetailChart = (chartInstance: Chart, options: {
  type: 'disk' | 'cpu' | 'flow' | 'memory'
  tickInterval: number
  statSizes?: any
}): Chart => {
  chartInstance.scale({
    time: {
      tickInterval: options.tickInterval,
    }
  })
    .tooltip({
      customItems: options.statSizes ? _items1Fn(options) : _items2, 
    });

  return chartInstance;
};

export const renderPieChartTpl = (chartInstance: Chart, _options?): Chart => {
  chartInstance.coordinate('theta', {
    radius: 0.75,
  });
  chartInstance.tooltip({
    showMarkers: false
  });
  chartInstance.interval()
    .adjust('stack')
    .position('value')
    .color('type', PIE_CHARTS_COLORS)
    .style({ opacity: 0.4 })
    .state({
      active: {
        style: (element) => {
          const shape = element.shape;
          return {
            matrix: Util.zoom(shape, 1.1),
          };
        }
      }
    });
  chartInstance.legend({
    position: 'right-top',
    offsetX: -40,
    offsetY: 25
  }); 
  return chartInstance;
};

export const PIE_CHARTS_COLORS = [
  '#4372FF',
  '#EB2F96',
  '#0EBAD2',
  '#29C377',
  '#E25F5F',
  '#F5B60D',
  '#8C8C8C',
];
