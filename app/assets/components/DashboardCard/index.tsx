import React from 'react';
import Icon from '../Icon';
import Modal from '../Modal';
import './index.less';

interface IProps {
  title: string;
  children: any;
}

class DashboardCard extends React.Component<IProps> {
  modalHandler: any;
  handleFullScreen = () => {
    if (this.modalHandler) {
      this.modalHandler.show();
    }
  }

  handleCancelFullScreen = () => {
    if (this.modalHandler) {
      this.modalHandler.hide();
    }
  }

  render() {
    const { title, children } = this.props;
    return <div className="dashboard-card">
      <div className="header">
        <h3>{title}</h3>
        <Icon className="icon-zoom" icon="#iconzoom" onClick={this.handleFullScreen}></Icon>
      </div>
      <div className="content">
        {children}
      </div>
      <Modal className="dashboard-card-fullscreen" handlerRef={handler => this.modalHandler=handler} footer={null}>
        <div className="header">
          <h3>{title}</h3>
        </div>
        <div className="content">
          {children}
        </div>
      </Modal>
    </div>
  }
}

export default DashboardCard;