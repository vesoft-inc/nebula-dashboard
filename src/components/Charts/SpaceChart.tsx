import React, { useEffect, useMemo, useRef, useState } from 'react';
import intl from 'react-intl-universal';

import { getProperByteDesc, getWhichColor } from '@/utils/dashboard';
import { DiskMetricInfo } from '@/utils/interface';
import './SpaceChart.less';
import _ from 'lodash';
import { Popover, Select, Table } from 'antd';
import Icon from '../Icon';

interface IProps {
  diskInfos: DiskMetricInfo[];
}


function SpaceChart(props: IProps) {
  const { diskInfos } = props;

  const diskInfoMap = useMemo(() => _.groupBy(diskInfos, 'name'), [diskInfos])
  
  const instances: string[] = useMemo(() => Object.keys(diskInfoMap), [diskInfoMap])
  
  const [curInstances, setCurInstances] = useState<string[]>([]);

  const [ seletedInstance, setSeletedInstance ] = useState<string>('all');

  useEffect(() => {
    setCurInstances(instances);
    setSeletedInstance('all');
  }, [instances])

  const getDisplayInfos = (infos: DiskMetricInfo[]) => {
    return infos.map((info) => {
      const { used, size: bytes, device, mountpoint, name } = info;
      const percent = Math.round((used / bytes) * 100);
      const { desc: sizeDesc } = getProperByteDesc(bytes, 1024);
      const { desc: usedDesc } = getProperByteDesc(used, 1024);
      return {
        percent: percent < 1 ? Number(percent.toFixed(2)) : percent,
        device,
        mountpoint,
        sizeDesc,
        usedDesc,
        name,
        color: getWhichColor(percent)
      }
    })
  }

  const handleInstanceShow = (instance: string | 'all') => {
    if (instance === 'all') {
      setCurInstances(instances);
    } else {
      setCurInstances([instance]);
      setSeletedInstance(instance);
    }
  }

  const renderDiskInfo = () => {
    return curInstances.map(instance => {
      const displayInfos = getDisplayInfos(diskInfoMap[instance] || []);
      return (
        <div key={instance} className="disk-tr">
          <div className='disk-tr-item disk-name'>{instance}</div>
          <div className='disk-tr-item'>
            {
              displayInfos.map(i => i.device).map((device, i) => (
                <Popover
                  key={i} 
                  content={device}
                  placement='topLeft'
                >
                  <div className='disk-tr-item-info text-overflow'>{device}</div>
                </Popover>
              ))
            }
          </div>
          <div className='disk-tr-item'>
            {
              displayInfos.map(i => i.mountpoint).map((mountpoint, i) => (
                <Popover
                  key={i} 
                  content={mountpoint}
                  placement='top'
                >
                  <div className='disk-tr-item-info text-overflow'>{mountpoint}</div>
                </Popover>
              ))
            }
          </div>
          <div className='disk-tr-item'>
            {
              displayInfos.map((displayInfo, i) => (
                <div className='disk-usage'>
                  <div key={i} className='disk-tr-item-info disk-usage-detail' >{displayInfo.usedDesc}/{displayInfo.sizeDesc}</div>
                  <div className="wrap">
                    <div className="bar-item" style={{ width: `${displayInfo.percent}%` }}>
                      <div className="left" style={{ backgroundColor: displayInfo.color }} />
                      <div className="right" style={{ backgroundColor: displayInfo.color }} />
                    </div>
                    <div className="empty" />
                    <p className='disk-usage-percent'>{displayInfo.percent}%</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )
    })
  }

  return (
    <div className="nebula-chart nebula-chart-space">
      <div className='space-instance'>
        <div className="disk-info-content">
          <div className="disk-th">
            <div>{intl.get('base.spaceChartInstance')}</div>
            <div>{intl.get('base.spaceChartDiskname')}</div>
            <div>{intl.get('base.spaceChartMountpoint')}</div>
            <div>{intl.get('base.spaceChartDiskused')}</div>
          </div>
        </div>
        {renderDiskInfo()}
      </div>
      <Select 
        className="instance-select" 
        bordered={false}
        value={seletedInstance}
        onSelect={(value: any) => handleInstanceShow(value)}
        dropdownMatchSelectWidth={200}
        suffixIcon={<Icon className="select-icon" icon="#iconnav-foldTriangle" />}
      >
        <Select.Option key='all' value='all'>{intl.get('base.spaceChartAllInstance')}</Select.Option>
        {
          instances.map((instance) => (
            <Select.Option key={instance} value={instance}>{instance}</Select.Option>
          ))
        }
      </Select>
    </div>
  );
}

export default SpaceChart;
