import React, { useEffect, useState } from 'react'
import { Col, Row, Input } from 'antd';
import intl from 'react-intl-universal';

import styles from './index.module.less';

interface Props {
  value?: string;
  onChange?: (values: string) => void;
}

const HostPortInput = (props: Props) => {

  const { value, onChange } = props;

  const [host, setHost] = useState<string>('');

  const [port, setPort] = useState<string>('9669');

  useEffect(() => {
    if (value && value.includes(':')) {
      const [host, port] = value.split(':');
      setHost(host);
      setPort(port);
    }
  }, [value]);

  const handleHostChange = (e) => {
    setHost(e.target.value);
  } 

  const handlePortChange = (e) => {
    setPort(e.target.value);
  }

  useEffect(() => {
    if (host && port) {
      onChange?.(`${host}:${port}`);
    }
  }, [host, port])

  return (
    <Row>
      <Col span={12}>
        <Input value={host} onChange={handleHostChange} placeholder={intl.get('common.configServer.host')} />
      </Col>
      <Col span={1}>
        <span className={styles.split}> : </span>
      </Col>
      <Col span={11}>
        <Input value={port} onChange={handlePortChange} placeholder={intl.get('common.configServer.port')} />
      </Col>
    </Row>
  )
}

export default HostPortInput;