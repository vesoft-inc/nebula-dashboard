import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DatePicker, Radio } from 'antd';
import intl from 'react-intl-universal';
import dayjs from 'dayjs';

import {
  MetricTIMEOPTIONS, TIME_OPTION_TYPE,
} from '@/utils/dashboard';

import styles from './index.module.less';

interface IProps {
  value?: TIME_OPTION_TYPE | number[];
  onChange?: (value: any) => void;
  timeOptions?: any[];
}

const TimeSelect = (props: IProps) => {

  const { value, timeOptions, onChange } = props;

  const [curTimeOption, setCurTimeOption] = useState<TIME_OPTION_TYPE>();

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
    return current > dayjs().endOf('day');
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

  const timeRangeByOption = useMemo(() => {
    if (curTimeOption) {
      const now = new Date().getTime();
      const nowPeriod = (timeOptions || MetricTIMEOPTIONS).find(option => option.name === curTimeOption);
      if (nowPeriod) {
        return [dayjs(now - nowPeriod.value), dayjs(now)];
      }
      return undefined
    }
  }, [curTimeOption]);


  return (
    <div className={styles.timeSelect}>
      <Radio.Group
        size="small"
        onChange={handleTimeButtonClick}
        value={curTimeOption}
      >
        {(timeOptions || MetricTIMEOPTIONS).map(option => (
          <Radio.Button key={option.value} value={option.name}>
            {intl.get(`component.dashboardDetail.${option.name}`)}
          </Radio.Button>
        ))}
      </Radio.Group>
      <DatePicker.RangePicker
        disabledDate={disabledDate}
        size="small"
        format="YYYY-MM-DD HH:mm"
        getPopupContainer={trigger => trigger.parentNode}
        showTime={true}
        value={cusTimeRange ? [dayjs(cusTimeRange[0]), dayjs(cusTimeRange[1])] as any : timeRangeByOption}
        onChange={handleDataPickerChange}
        allowClear={false}
      />

    </div>
  )
}

export default TimeSelect;