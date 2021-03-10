import React from 'react';
import Icon from '@assets/components/Icon';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './index.less';
interface IProps extends RouteComponentProps{
  title: string;
  viewPath?: string;
  showViewIcon?: boolean;
  icon: string;
  mode: string;
  multipleMode: boolean;
  displayMode?: string;
  changeDisplayMode?: (type: string) => void
}
class ServiceHeader extends React.PureComponent<IProps> {
  handleClick = (value) => {
    if(this.props.changeDisplayMode) {
      this.props.changeDisplayMode(value);
    }
  }
  handleView = () => {
    const { viewPath } = this.props;
    this.props.history.push(viewPath!);
  }

  render () {
    const { title, icon, mode, displayMode, multipleMode, showViewIcon } = this.props;
    return (
      <div className="content-header">
        <div className="left">
          <Icon className={`icon-graph ${mode}`} icon={icon} />
          <span className="title">{title}</span>
        </div>
        <div className="right">
          {multipleMode && <>
            <Icon className={displayMode === 'wrap' ? `btn-overview ${mode} active bg-${mode}` : `btn-overview ${mode}`} icon="#iconservice-slide-a" onClick={() => this.handleClick('wrap')} />
            <Icon className={displayMode === 'grid' ? `btn-display ${mode} active bg-${mode}` : `btn-display ${mode}`} icon="#iconservice-arrange-a" onClick={() => this.handleClick('grid')}  />
          </>}
          {showViewIcon && <Icon className={`btn-enlarge ${mode}`} icon="#iconwatch" onClick={this.handleView} />}
        </div>
      </div>
    );
  }
}

export default withRouter(ServiceHeader);