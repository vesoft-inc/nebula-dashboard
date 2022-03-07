import React from 'react';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import ServiceOverview from './ServiceOverview';
import { IDispatch, IRootState } from '@/store';
import Modal from '@/components/Modal';
import ServiceCardEdit from '@/components/Service/ServiceCardEdit';
import { METRIC_SERVICE_TYPES } from '@/utils/metric';
import './index.less';

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetStatus: dispatch.service.asyncGetStatus,
  updatePanelConfig: values =>
    dispatch.service.update({
      panelConfig: values,
    }),
});

const mapState = (state: IRootState) => ({
  panelConfig: state.service.panelConfig,
  aliasConfig: state.app.aliasConfig,
  serviceMetric: state.serviceMetric,
});

interface IProps
  extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {}

interface IState {
  editPanelType: string;
  editPanelIndex: number;
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

  handleConfigPanel = (serviceType: string, index: number) => {
    this.setState(
      {
        editPanelType: serviceType,
        editPanelIndex: index,
      },
      this.modalHandler.show,
    );
  };

  handleModalClose = () => {
    if (this.modalHandler) {
      this.modalHandler.hide();
    }
  };

  render() {
    const { editPanelType, editPanelIndex } = this.state;
    const { panelConfig, serviceMetric, updatePanelConfig, asyncGetStatus } =
      this.props;
    // TODO: Use hooks to resolve situations where render is jamming
    return (
      <div className="service-table">
        {METRIC_SERVICE_TYPES.map(type => (
          <ServiceOverview
            key={type}
            serviceType={type}
            icon={`#iconnav-${type}`}
            configs={panelConfig[type]}
            getStatus={asyncGetStatus}
            onConfigPanel={this.handleConfigPanel}
          />
        ))}
        <Modal
          className="modal-show-selected"
          width="750px"
          handlerRef={handler => (this.modalHandler = handler)}
          title={intl.get('service.queryCondition')}
          footer={null}
        >
          <ServiceCardEdit
            serviceMetric={serviceMetric}
            editType={editPanelType}
            editIndex={editPanelIndex}
            panelConfig={panelConfig}
            onClose={this.handleModalClose}
            onPanelConfigUpdate={updatePanelConfig}
          />
        </Modal>
      </div>
    );
  }
}
export default connect(mapState, mapDispatch)(ServiceDashboard);
