import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Icon from '../Icon';
import './index.less';

interface IProps extends RouteComponentProps{
  title: string;
  children: any;
  viewPath: string;
}

class DashboardCard extends React.PureComponent<IProps> {
  handleViewDetail = () => {
    this.props.history.push(this.props.viewPath);
  }

  render () {
    const { title, children } = this.props;
    return <div className="dashboard-card">
      <div className="header">
        <h3>{title}</h3>
        <Icon className="icon-zoom" icon="#iconzoom" onClick={this.handleViewDetail} />
      </div>
      <div className="content">
        {children}
      </div>
    </div>;
  }
}

export default withRouter(DashboardCard);