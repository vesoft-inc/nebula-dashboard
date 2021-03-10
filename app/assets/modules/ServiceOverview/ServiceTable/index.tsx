import { Spin } from 'antd';
import React from 'react';
import './index.less';
import { IServiceMetric } from '@assets/utils/interface';
import { IRootState } from '@assets/store';
import { connect } from 'react-redux';
import OverviewCell from '../OverviewCell';
import ItemCell from '../ItemCell';
import ServiceHeader from '../ServiceHeader';
interface IProps extends ReturnType<typeof mapState>{
  title: string;
  icon: string;
  mode: string;
  data: IServiceMetric;
  viewPath: string;
}

interface IState {
  displayMode: string
}

const mapState = (state: IRootState) => {
  return {
    loading: state.loading.models.service
  };
};


class ServiceOverview extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props);
    this.state = {
      displayMode: 'wrap'
    };
  }

  changeDisplayMode = (type) => {
    this.setState({
      displayMode: type
    });
  }

  render () {
    const { title, icon, mode, data, viewPath, loading } = this.props;
    const { displayMode } = this.state;
    return (<div className="service-content">
      <ServiceHeader title={title} icon={icon} mode={mode} displayMode={displayMode} changeDisplayMode={this.changeDisplayMode} multipleMode={true} viewPath={viewPath} showViewIcon={true} />
      <Spin delay={200} spinning={!!loading}>
        <div className="service-list">
          <div className={displayMode === 'wrap' ? 'wrap' : 'grid'}>
            {data.overview && <OverviewCell mode={mode} data={data.overview} />}
            {data.data && data.data.map((item, i) => <ItemCell key={i} data={item} mode={mode} />)}
          </div>
        </div>
      </Spin>
    </div>);
  }
}
export default connect(mapState)(ServiceOverview);