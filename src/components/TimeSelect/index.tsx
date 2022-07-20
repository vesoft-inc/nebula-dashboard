import React, { useState, useEffect } from 'react';
import { DatePicker, Radio } from 'antd';
import intl from 'react-intl-universal';
import dayjs from 'dayjs';

import {
  TIMEOPTIONS, TIME_OPTION_TYPE,
} from '@/utils/dashboard';

import styles from './index.module.less';

interface IProps {
  value?: TIME_OPTION_TYPE | number[];
  onChange?: (value: any) => void;
}

const TimeSelect = (props: IProps) => {

  const { value, onChange } = props;

  const [curTimeOption, setCurTimeOption ] = useState<TIME_OPTION_TYPE>();

  const [cusTimeRange, setCusTimeRange] = useState<number[]>();

  useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
        setCurTimeOption(value)
      } else if (Array.isArray(value)) {
        const [startTime, endTime] = value;
        setCusTimeRange([startTime, endTime]);
      }
    }
  }, [value])

  const disabledDate = (current) => {
    return (
      current < dayjs().subtract(14, 'days').endOf('day') ||
      current > dayjs().endOf('day')
    );
  }

  const handleTimeButtonClick = (e) => {
    setCusTimeRange(undefined);
    const timeOption = e.target.value;
    setCurTimeOption(timeOption);
    onChange?.(timeOption);
  }

  const handleDataPickerChange = (date) => {
    setCurTimeOption(undefined);
    const timeRange = [date[0].valueOf(), date[1].valueOf()];
    setCusTimeRange(timeRange);
    onChange?.(timeRange)
  }

  return (
    <div className={styles.timeSelect}>
      <Radio.Group
        size="small"
        onChange={handleTimeButtonClick}
        value={curTimeOption}
      >
        {TIMEOPTIONS.map(option => (
          <Radio.Button key={option.value} value={option.name}>
            {intl.get(`component.dashboardDetail.${option.name}`)}
          </Radio.Button>
        ))}
      </Radio.Group>
      <DatePicker.RangePicker
        disabledDate={disabledDate}
        size="small"
        format="YYYY-MM-DD HH:mm"
        showTime={true}
        value={cusTimeRange ? [dayjs(cusTimeRange[0]), dayjs(cusTimeRange[1])] as any : undefined}
        onChange={handleDataPickerChange}
        allowClear={false}
      />

    </div>
  )
}

export default TimeSelect;