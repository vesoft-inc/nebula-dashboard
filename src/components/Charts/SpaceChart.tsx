import React, { useEffect, useMemo, useRef, useState } from 'react';
// import intl from 'react-intl-universal';
import { getProperByteDesc, getWhichColor } from '@/utils/dashboard';
import { DiskMetricInfo } from '@/utils/interface';
import './SpaceChart.less';
import _ from 'lodash';
import { LINE_CHART_COLORS } from '@/utils/chart/chart';
import { Table } from 'antd';

interface IProps {
  diskInfos: DiskMetricInfo[];
}

interface IInstanceShow {
  name: string;
  show: boolean;
  color: string;
}

function SpaceChart(props: IProps) {
  const { diskInfos } = props;

  const [curInstances, setCurInstances] = useState<IInstanceShow[]>([]);

  const diskInfoMap = useMemo(() => _.groupBy(diskInfos, 'name'), [diskInfos])

  const instances: IInstanceShow[] = useMemo(() => Object.keys(diskInfoMap).map((name, i) => ({
    name,
    show: true,
    color: LINE_CHART_COLORS[i % LINE_CHART_COLORS.length],
  })), [diskInfoMap])

  useEffect(() => {
    setCurInstances(instances);
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

  const handleInstanceShow = (instance: IInstanceShow) => () => {
    instance.show = !instance.show;
    setCurInstances([...curInstances]);
  }

  const renderDiskInfo = () => {
    return curInstances.filter(item => item.show).map(item => {
      const { name, color } = item;
      const displayInfos = getDisplayInfos(diskInfoMap[name] || []);
      console.log('displayInfos', displayInfos)
      return (
        <div key={name} className="disk-tr">
          <div className='disk-tr-item disk-name'>{name}</div>
          <div className='disk-tr-item'>
            {
              displayInfos.map(i => i.device).map((device, i) => (
                <div key={i} className='disk-tr-item-info'>{device}</div>
              ))
            }
          </div>
          <div className='disk-tr-item'>
            {
              displayInfos.map(i => i.mountpoint).map((mountpoint, i) => (
                <div key={i} className='disk-tr-item-info'>{mountpoint}</div>
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
            <div>instance</div>
            <div>Disk Name</div>
            <div>Mount Point</div>
            <div>Disk Used</div>
          </div>
        </div>
        {renderDiskInfo()}
      </div>
      {/* <div className="instance-type">
        {
          curInstances.map((instance) => (
            <div key={instance.name} className='instance-item' onClick={handleInstanceShow(instance)}>
              <div className={`instance-label ${instance.show ? '' : 'instance-label-hidden'}`} style={{ background: instance.color }} />
              <div className={`instance-name ${instance.show ? '' : 'instance-name-hidden'}`}>{instance.name}</div>
            </div>
          ))
        }
      </div> */}
    </div>
  );
}

export default SpaceChart;
