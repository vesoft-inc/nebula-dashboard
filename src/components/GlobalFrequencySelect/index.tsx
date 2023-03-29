import React, { useState } from 'react';

import { TIME_INTERVAL_OPTIONS } from '@/utils/dashboard';
import EventBus from '@/utils/EventBus';
import FrequencySelect from '../MetricsFilterPanel/FrequencySelect';

import styles from './index.module.less';

interface Props {
  type: string;
}

function GlobalFrequencySelect(props: Props) {

  const { type } = props;

  const [frequencyValue, setFrequencyValue] = useState<number>(0);

  const handleFrequencyChange = (value: number) => {
    setFrequencyValue(value)
    EventBus.getInstance().emit(`${type}_change`, {
      detail: {
        value
      }
    });
  }

  const handleRefresh = () => {
    EventBus.getInstance().emit(`${type}_fresh`);
  }

  return (
    <FrequencySelect
      handleRefresh={handleRefresh}
      onChange={handleFrequencyChange}
      value={frequencyValue}
    />
  )
}

export default GlobalFrequencySelect;