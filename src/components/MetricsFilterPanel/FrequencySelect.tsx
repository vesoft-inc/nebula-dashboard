import { Select } from 'antd';

import { IntervalFrequencyItem, INTERVAL_FREQUENCY_LIST } from '@/utils/service';
import Icon from '@/components/Icon';

import styles from './index.module.less';

interface Props {
  value?: number;
  onChange?: (value: number) => void;
  handleRefresh?: () => void;
  timeOptions?: IntervalFrequencyItem[];
}

function FrequencySelect(props: Props) {
  const { value, onChange, handleRefresh, timeOptions } = props;
  return (
    <div className={styles.frequency}>
      <div onClick={handleRefresh} className={styles.freshIcon}><Icon className={styles.freshIconItem} icon="#iconrefresh" /></div>
      <Select
        className={styles.frequencySelect}
        onChange={onChange}
        value={value}
      >
        {
          (timeOptions || INTERVAL_FREQUENCY_LIST).map(item => (
            <Select.Option key={item.value} value={item.value}>{item.type}</Select.Option>
          ))
        }
      </Select>
    </div>
  )
}

export default FrequencySelect;