import React from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import Icon from '../Icon';
import './index.less';

interface IProps extends RouteComponentProps {
  title: React.ElementRef<any>;
  children: any;
  viewPath?: string;
  onConfigPanel?: () => void;
}

function DashboardCard(props: IProps) {
  const { viewPath, title, children, onConfigPanel } = props;
  const history = useHistory();

  const handleViewDetail = () => {
    if (!viewPath) return;
    history.push(viewPath);
  };

  return (
    <div className="dashboard-card">
      <div className="inner">
        <div className="header">
          <h3>{title}</h3>
          {
            viewPath && (
              <Icon
                className="icon-watch blue"
                icon="#iconwatch"
                onClick={handleViewDetail}
              />
            )
          }
          {onConfigPanel && (
            <Icon
              className="icon-setup blue"
              icon="#iconSet_up"
              onClick={onConfigPanel}
            />
          )}
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default withRouter(DashboardCard);
