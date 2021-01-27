import React from 'react'
import './index.less'
import OverviewCell from '../OverviewCell';
import ItemCell from '../ItemCell';
import ServiceHeader from '../ServiceHeader';

interface IProps {
  title: string;
  icon: string;
  mode: string;
  data: {
    overviewInfos: any;
    serviceList: any[];
  }
}

interface IState {
  displayMode: string
}

class ServiceOverview extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      displayMode: 'wrap'
    }
  }

  changeDisplayMode = (type) => {
    this.setState({
      displayMode: type
    })
  }

  render() {
    const { title, icon, mode, data } = this.props;
    const { displayMode } = this.state;
    return (<div className="service-content">
      <ServiceHeader title={title} icon={icon} mode={mode} displayMode={displayMode} changeDisplayMode={this.changeDisplayMode} />
      <div className="service-list">
        <div className={displayMode === 'wrap' ? 'wrap' : 'grid'}>
          <OverviewCell mode={mode} data={data.overviewInfos} />
          {data.serviceList.map((item, i) => <ItemCell key={i} data={item} mode={mode} />)}
        </div>
      </div>
    </div>)
  }
}
export default ServiceOverview