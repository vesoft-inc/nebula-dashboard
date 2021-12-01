import { Chart, Util } from '@antv/g2';
import dayjs from 'dayjs';
import { getProperByteDesc } from '../dashboard';
import { VALUE_TYPE } from '../promQL';

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
  tickInterval?: number,
  sizes?: any
  valueType?: VALUE_TYPE
  isCard?: boolean,
}): Chart => {
  chartInstance
    .axis('time', {
      label: {
        formatter: time => {
          return dayjs(Number(time) * 1000).format('HH:mm');
        }
      },
      grid: options.isCard ? null : {
        line: {
          type: 'line',
          style: {
            fill: '#d9d9d9',
            opacity: 0.5,
          }
        }
      }
    })
    .legend({
      position: 'bottom',
    })
    .scale({
      time: {
        tickInterval: options.tickInterval
      },
      temperature: {
        nice: true,
      },
    })
    .line()
    .position('time*value')
    .color('type', LINE_CHART_COLORS);

  const tooltipTitle = time => {
    return dayjs(Number(time) * 1000).format('YYYY-MM-DD HH:mm:ss');
  };

  switch (options.valueType) {
    case VALUE_TYPE.percentage:
      chartInstance.axis('value', {
        label: {
          formatter: percent => `${percent}%`
        },
      });
      chartInstance.tooltip({
        customItems: items => {

          return items.map(item => {
            const value = Number(item.value).toFixed(2) + '%';
            return {
              ...item,
              value,
            };
          });
        },
        showCrosshairs: true,
        shared: true,
        title: tooltipTitle,
      });
      chartInstance.scale({
        value: {
          min: 0,
          max: 100,
          tickInterval: 25,
        }
      });
      break;
    case VALUE_TYPE.byte:
    case VALUE_TYPE.byteSecond:
      chartInstance.axis('value', {
        label: {
          formatter: bytes => {
            const { value, unit } = getProperByteDesc(bytes);
            let _unit = unit;
            if (options.valueType === VALUE_TYPE.byteSecond) {
              _unit = unit + '/s';
            }

            return value + ' ' + _unit;
          },
        }
      });
      chartInstance.tooltip({
        customItems: items => {
          return items.map(item => {
            const { value, unit } = getProperByteDesc(item.value);
            let _unit = unit;
            if (options.valueType === VALUE_TYPE.byteSecond) {
              _unit = unit + '/s';
            }
            return {
              ...item,
              value: value + ' ' + _unit,
            };
          });
        },
        showCrosshairs: true,
        shared: true,
        title: tooltipTitle
      });
      break;
    case VALUE_TYPE.number:
    case VALUE_TYPE.numberSecond:
      chartInstance.axis('value', {
        label: {
          formatter: processNum => {
            if (options.valueType === VALUE_TYPE.numberSecond) {
              return processNum + '/s';
            }
            return processNum;
          }
        }
      });
      chartInstance.tooltip({
        customItems: items => {
          return items.map(item => {
            let value = item.value;
            if (options.valueType === VALUE_TYPE.numberSecond) {
              value = value + '/s';
            }
            return {
              ...item,
              value,
            };
          });
        },
        showCrosshairs: true,
        shared: true,
        title: tooltipTitle
      });
      break;
    default:
  }

  return chartInstance;
};

export const updateDetailChart = (chartInstance: Chart, options: {
  type: string,
  tickInterval: number
  statSizes?: any
}): Chart => {
  chartInstance.scale({
    time: {
      tickInterval: options.tickInterval,
    }
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
