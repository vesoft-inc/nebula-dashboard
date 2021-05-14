import React from 'react';
import { IDispatch, IRootState } from '@assets/store';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import Modal from '@assets/components/Modal';
import ServiceCardEdit from '@assets/components/Service/ServiceCardEdit';
import ServiceOverview from '@assets/components/Service/ServiceOverview';
import './index.less';

const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetStatus: dispatch.service.asyncGetStatus,
  };
};

const mapState = (state: IRootState) => {
  return {
    servicePanelConfig: state.service.servicePanelConfig
  };
};

interface IProps extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {

}

interface IState {
  editPanelType: string,
  editPanelIndex: number
}
class ServiceDashboard extends React.Component<IProps, IState> {
  pollingTimer: any;
  modalHandler;
  constructor (props: IProps) {
    super(props);
    this.state = {
      editPanelType: '',
      editPanelIndex: 0
    };
  }

  handleConfigPanel=(serviceType: string, index: number) => {
    this.setState({
      editPanelType: serviceType,
      editPanelIndex: index
    }, this.modalHandler.show);
  }

  handleModalClose = () => {
    if(this.modalHandler) {
      this.modalHandler.hide();
    }
  }
  
  render () {
    const { editPanelType, editPanelIndex } = this.state;
    const { 
      servicePanelConfig
    } = this.props;
    // TODO 配置单个面板后三个 overview 还是会触发 render
    return (
      <div className="service-table">
        <ServiceOverview 
          serviceType="graph"
          icon="#iconnav-graph" 
          configs={servicePanelConfig.graph}
          onConfigPanel={this.handleConfigPanel}
        />
        <ServiceOverview 
          serviceType="storage"
          icon="#iconnav-storage" 
          configs={servicePanelConfig.storage}
          onConfigPanel={this.handleConfigPanel}
        />
        <ServiceOverview 
          serviceType="meta"
          icon="#iconnav-meta" 
          configs={servicePanelConfig.meta}
          onConfigPanel={this.handleConfigPanel}
        />
        <Modal
          className="modal-show-selected"
          width="750px"
          handlerRef={handler => (this.modalHandler = handler)}
          title={intl.get('service.queryCondition')}
          footer={null}
        >
          <ServiceCardEdit 
            editType={editPanelType}
            editIndex={editPanelIndex}
            onClose={this.handleModalClose}
          />
        </Modal>
      </div>);
  }
}
export default connect(mapState, mapDispatch)(ServiceDashboard);
