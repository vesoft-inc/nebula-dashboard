import React from 'react';
import { IDispatch, IRootState } from '@assets/store';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import Modal from '@assets/components/Modal';
import ServiceCardEdit from '@assets/components/Service/ServiceCardEdit';
import { METRIC_SERVICE_TYPES } from '@assets/utils/metric';
import ServiceOverview from './ServiceOverview';
import './index.less';

const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetStatus: dispatch.service.asyncGetStatus,
    updatePanelConfig: (values) => dispatch.service.update({
      panelConfig: values
    }),
  };
};

const mapState = (state: IRootState) => {
  return {
<<<<<<< HEAD
    panelConfig: state.service.panelConfig,
    aliasConfig: state.app.aliasConfig,
=======
    servicePanelConfig: state.service.servicePanelConfig,
    annotationLine: state.app.annotationLine,
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
  };
};

interface IProps extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {

}

interface IState {
  editPanelType: string,
  editPanelIndex: number,
}
class ServiceDashboard extends React.Component<IProps, IState> {
  pollingTimer: any;
  modalHandler;
  constructor(props: IProps) {
    super(props);
    this.state = {
      editPanelType: '',
      editPanelIndex: 0,
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
  
  render() {
    const { editPanelType, editPanelIndex } = this.state;
    const { 
<<<<<<< HEAD
      panelConfig,
      updatePanelConfig,
      asyncGetStatus,
=======
      servicePanelConfig,
      annotationLine
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
    } = this.props;
    // TODO: Use hooks to resolve situations where render is jamming
    return (
      <div className="service-table">
<<<<<<< HEAD
        {METRIC_SERVICE_TYPES.map(type => <ServiceOverview 
          key={type}
          serviceType={type}
          icon={`#iconnav-${type}`}
          configs={panelConfig[type]}
          getStatus={asyncGetStatus}
          onConfigPanel={this.handleConfigPanel}
        />)}
=======
        <ServiceOverview 
          serviceType="graph"
          icon="#iconnav-graph"
          baseLineNum={annotationLine.graph}
          configs={servicePanelConfig.graph}
          onConfigPanel={this.handleConfigPanel}
        />
        <ServiceOverview 
          serviceType="storage"
          icon="#iconnav-storage" 
          baseLineNum={annotationLine.storage}
          configs={servicePanelConfig.storage}
          onConfigPanel={this.handleConfigPanel}
        />
        <ServiceOverview 
          serviceType="meta"
          icon="#iconnav-meta"
          baseLineNum={annotationLine.meta}
          configs={servicePanelConfig.meta}
          onConfigPanel={this.handleConfigPanel}
        />
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
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
            panelConfig={panelConfig}
            onClose={this.handleModalClose}
            onPanelConfigUpdate={updatePanelConfig}
          />
        </Modal>
      </div>);
  }
}
export default connect(mapState, mapDispatch)(ServiceDashboard);
