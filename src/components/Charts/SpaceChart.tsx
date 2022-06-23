import React, { useEffect, useMemo, useRef, useState } from 'react';
// import intl from 'react-intl-universal';
import { getProperByteDesc, getWhichColor } from '@/utils/dashboard';
import { DiskMetricInfo } from '@/utils/interface';
import './SpaceChart.less';
import _ from 'lodash';
import { LINE_CHART_COLORS } from '@/utils/chart/chart';

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
      return (
        <div key={name} className='space-instance' style={{ borderLeft: `2px solid ${color}` }}>
          <div className="space-instance-description">
            <span>{name}</span>
          </div>
          {
            displayInfos.map((displayInfo, i) => (
              <div key={i} className="space-bar">
                <p className="description">
                  <span>{displayInfo.device}({displayInfo.mountpoint})</span>
                  <span>
                    {displayInfo.usedDesc}/{displayInfo.sizeDesc}
                  </span>
                </p>
                <div className="wrap">
                  <div className="bar-item" style={{ width: `${displayInfo.percent}%` }}>
                    <div className="left" style={{ backgroundColor: displayInfo.color }}>

                    </div>
                    <div className="right" style={{ backgroundColor: displayInfo.color }} />
                  </div>
                  <div className="empty" />
                  <p>{displayInfo.percent}%</p>
                </div>
              </div>
            ))
          }
        </div>
      )
    })
  }

  return (
    <div className="nebula-chart nebula-chart-space">
      {
        renderDiskInfo()
      }
      <div className="instance-type">
        {
          curInstances.map((instance) => (
            <div key={instance.name} className='instance-item' onClick={handleInstanceShow(instance)}>
              <div className={`instance-label ${instance.show ? '' : 'instance-label-hidden'}`} style={{ background: instance.color }} />
              <div className={`instance-name ${instance.show ? '' : 'instance-name-hidden'}`}>{instance.name}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default SpaceChart;
