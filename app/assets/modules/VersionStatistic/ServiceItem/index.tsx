import { Table } from 'antd';
import React from 'react';
import intl from 'react-intl-universal';

import './index.less';
import PieChart from '@assets/components/Charts/PieChart';
import ServiceHeader from '../../ServiceOverview/ServiceHeader';

interface IProps {
  title: string;
  icon: string;
  mode: string;
}

interface IState {
}

class ServiceOverview extends React.PureComponent<IProps, IState> {

  render () {
    const { title, icon, mode } = this.props;
    const columns = [{
      title: intl.get('common.service'),
      dataIndex: 'name',
    },{
      title: intl.get('common.version'),
      dataIndex: 'version',
    }];
    const data = [{
      name: 'graph-db-0',
      version: '1.4.0'
    },{
      name: 'graph-db-1',
      version: '1.4.0'
    },{
      name: 'graph-db-2',
      version: '1.4.0'
    },{
      name: 'graph-db-0',
      version: '1.4.0'
    },{
      name: 'graph-db-1',
      version: '1.4.0'
    },{
      name: 'graph-db-2',
      version: '1.4.0'
    }];
    return (<div className="version-statistic-item">
      <ServiceHeader title={title} icon={icon} mode={mode}  multipleMode={false} />
      <div className="version-content">
        <PieChart />
        <Table
          className="service-table"
          columns={columns} 
          dataSource={data} 
          bordered={true}
          pagination={false}
          size={'small'}
          rowKey="id"
        />
      </div>
    </div>);
  }
}
export default ServiceOverview;