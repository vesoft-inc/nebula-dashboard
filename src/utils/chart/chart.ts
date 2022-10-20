import { Chart, Util } from '@antv/g2';
// import dayjs from 'dayjs';
// import { getProperByteDesc } from '../dashboard';
// import { VALUE_TYPE } from '../promQL';

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
  '#595959',
];

export const renderPieChartTpl = (chartInstance: Chart, _options?): Chart => {
  chartInstance.coordinate('theta', {
    radius: 0.75,
  });
  chartInstance.tooltip({
    showMarkers: false,
  });
  chartInstance
    .interval()
    .adjust('stack')
    .position('value')
    .color('type', PIE_CHARTS_COLORS)
    .style({ opacity: 0.4 })
    .state({
      active: {
        style: element => {
          const shape = element.shape;
          return {
            matrix: Util.zoom(shape, 1.1),
          };
        },
      },
    });
  chartInstance.legend({
    position: 'right-top',
    offsetX: -40,
    offsetY: 25,
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
