import React from 'react';

import { RingProgress } from '@ant-design/plots';
import { calcNodeHealty } from '@/utils';
import { CellHealtyLevel } from '@/utils/interface';

interface IProps {
  percent: number;
  type: string;
  config?: any;
  contentFormatter?:(p:number)=>string;
}

const ColorMap = {
  [CellHealtyLevel.normal]: '#27AE60',
  [CellHealtyLevel.warning]: '#F2994A',
  [CellHealtyLevel.danger]: '#EB5757',
}

function RingProgressChart(props: IProps) {
  const { percent, type, config,contentFormatter } = props;
  
  const calcColor = () => {
    const level = calcNodeHealty(percent);
    return ColorMap[level];
  }

  return (
    <RingProgress
      autoFit
      percent={percent / 100}
      color={[calcColor(), '#CFE3F1']}
      innerRadius={0.75}
      radius={0.98}
      animation={false}
      statistic={
        {
          title: {
            style: {
              color: '#000',
              fontSize: '16px',
              lineHeight: '16px',
            },
            formatter: () => type,
          },
          content: {
            style: {
              color: '#000',
              fontWeight: 'bold',
              marginTop: '10px',
              fontSize: '12px',
              lineHeight: '14px',
            },
            formatter:contentFormatter
          }
        }
      }
      {...config}
    />
  );
}

export default RingProgressChart;