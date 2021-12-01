import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { trackPageView } from '@/utils/stat';
import Icon from '../Icon';
import './index.less';

interface IProps extends RouteComponentProps {
  title: string;
  children: any;
  viewPath: string;
  type?: string;
  onConfigPanel?: () => void;
}

class DashboardCard extends React.PureComponent<IProps> {
  handleViewDetail = () => {
    const { viewPath, type } = this.props;
    if (type) {
      localStorage.setItem('detailType', type);
    }
    trackPageView(viewPath);
    this.props.history.push(viewPath);
  };

  render() {
    const { title, children, onConfigPanel } = this.props;
    return (
      <div className="dashboard-card">
        <div className="inner">
          <div className="header">
            <h3>{title}</h3>
            <Icon
              className="icon-watch blue"
              icon="#iconwatch"
              onClick={this.handleViewDetail}
            />
            {onConfigPanel && (
              <Icon
                className="icon-setup blue"
                icon="#iconSetup"
                onClick={onConfigPanel}
              />
            )}
          </div>
          <div className="content">{children}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(DashboardCard);
