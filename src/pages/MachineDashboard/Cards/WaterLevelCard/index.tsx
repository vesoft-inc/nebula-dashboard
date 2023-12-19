import intl from 'react-intl-universal';


import { NodeResourceInfo } from '@/utils/interface';

import styles from './index.module.less';
import RingProgressChart from '@/components/Charts/RingProgressChart';

interface IProps {
  nodeResource?: NodeResourceInfo
}

function WaterLevelCard(props: IProps) {

  const { nodeResource } = props;

  const getResourceData = (text?: string) => {
    if (!text) {
      return 0;
    }
    let num: number = 0;
    if (text.includes('%')) {
      num = parseFloat(text.slice(0, text.length - 1));
    }
    return num;
  }

  return (
    <div className={styles.waterLevelContent}>
    <div className={styles.waterLevelItem}>
      <RingProgressChart config={{height: 180}} type={intl.get('device.nodeResource.cpu_utilization')} percent={getResourceData(nodeResource?.cpuUtilization)} />
      <div className={styles.infoItem}>{nodeResource?.cpuCore}{intl.get('device.nodeResource.core')}</div>
    </div>
    <div className={styles.waterLevelItem}>
      <RingProgressChart config={{height: 180}} type={intl.get('device.nodeResource.memory_utilization')} percent={getResourceData(nodeResource?.memoryUtilization)} />
      <div className={styles.infoItem}>{nodeResource?.memoryUsed} / {nodeResource?.memory}</div>
    </div>
    <div className={styles.waterLevelItem}>
    <RingProgressChart config={{height: 180}} type={intl.get('device.nodeResource.disk_utilization')} percent={getResourceData(nodeResource?.diskUtilization)} />
      <div className={styles.infoItem}>{nodeResource?.diskUsed} / {nodeResource?.disk}</div>
    </div>
  </div>
  )
}

export default WaterLevelCard;