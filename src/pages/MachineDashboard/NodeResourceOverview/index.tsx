import React from 'react';
import { Table, TableColumnType } from 'antd';
import intl from 'react-intl-universal';

import { CellHealtyLevel, NodeResourceInfo, Percent_Range } from '@/utils/interface';

import styles from './index.module.less';
import { calcNodeHealty } from '@/utils';

interface IProps {
  resourceInfos: NodeResourceInfo[];
  loading: boolean;
}

function NodeResourceOverview(props: IProps) {

  const { resourceInfos, loading } = props;

  const renderCell = (text: string) => {
    let num: number;
    let level: CellHealtyLevel = CellHealtyLevel.normal ;
    if (text?.includes('%')) {
      num = parseFloat(text.slice(0, text.length - 1));
      level = calcNodeHealty(num);
    }
    return <div className={`${styles.tableCell} ${styles[level]}`}>{text}</div>
  }

  const columns: TableColumnType<NodeResourceInfo>[] = [
    {
      title: intl.get('device.nodeResource.ip'),
      dataIndex: "host",
      width: 140,
      render: (text, _) => <div title={text} className={`${styles.tableCell}`}><div className={styles.labelTag}>{text}</div></div>
    },
    {
      title: intl.get('device.nodeResource.nodeName'),
      dataIndex: "nodeName",
      render: (text, _) => <div title={text} className={styles.tableCell}>{text}</div>
    },
    {
      title: intl.get('device.nodeResource.runtime'),
      dataIndex: "runtime",
      render: (text, _) => <div title={text} className={styles.tableCell}>{text}</div>
    },
    {
      title: intl.get('device.nodeResource.cpuCore'),
      dataIndex: "cpuCore",
      render: (text, _) => <div className={styles.tableCell}>{text}</div>
    },
    {
      title: intl.get('device.nodeResource.memory'),
      dataIndex: "memory",
      render: (text, _) => <div className={styles.tableCell}>{text}</div>
    },
    {
      title: intl.get('device.nodeResource.load5s'),
      dataIndex: "load5s",
      render: (text, record) => {
        const value = (parseFloat(text) / parseInt(record.cpuCore) * 100 as any).toFixed(2);
        return renderCell(value + '%');
      }
    },
    {
      title: intl.get('device.nodeResource.cpu_utilization'),
      dataIndex: "cpuUtilization",
      render: (text, _) => renderCell(text)
    },
    {
      title: intl.get('device.nodeResource.memory_utilization'),
      dataIndex: "memoryUtilization",
      render: (text, _) => renderCell(text)
    },
    {
      title: intl.get('device.nodeResource.disk_utilization'),
      dataIndex: "diskUtilization",
      render: (text, _) => renderCell(text)
    },
    {
      title: intl.get('device.nodeResource.disk_max_read'),
      dataIndex: "diskMaxRead",
      ellipsis: true,
      render: (text, _) => renderCell(text)
    },
    {
      title: intl.get('device.nodeResource.disk_max_write'),
      dataIndex: "diskMaxWrite",
      ellipsis: true,
      render: (text, _) => renderCell(text)
    },
    {
      title: intl.get('device.nodeResource.network_in'),
      dataIndex: "networkIn",
      ellipsis: true,
      render: (text, _) => renderCell(text)
    },
    {
      title: intl.get('device.nodeResource.network_out'),
      dataIndex: "networkOut",
      ellipsis: true,
      render: (text, _) => renderCell(text)
    },
  ]

  return (
    <Table 
      dataSource={resourceInfos}
      rowKey="host"
      loading={loading}
      columns={columns}
      pagination={{
        hideOnSinglePage: true,
      }}
      className={styles.nodeResourceTable}
    />
  );
}

export default NodeResourceOverview;
