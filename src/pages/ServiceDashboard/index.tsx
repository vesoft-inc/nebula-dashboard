import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';

import ServiceOverview from './ServiceOverview';
import { IDispatch, IRootState } from '@/store';
import Modal from '@/components/Modal';
import ServiceCardEdit from '@/components/Service/ServiceCardEdit';
import { METRIC_SERVICE_TYPES } from '@/utils/metric';
import MetricsFilterPanel from '@/components/MetricsFilterPanel';

import './index.less';
import { ServiceMetricsPanelValue } from '@/utils/interface';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetStatus: dispatch.service.asyncGetStatus,
  updateMetricsFiltervalues: dispatch.service.updateMetricsFiltervalues,
  updatePanelConfig: values =>
    dispatch.service.update({
      panelConfig: values,
    }),
});

const mapState: any = (state: IRootState) => ({
  panelConfig: state.service.panelConfig,
  aliasConfig: state.app.aliasConfig,
  instanceList: state.service.instanceList as any,
  serviceMetric: state.serviceMetric,
  metricsFilterValues: (state as any).service.metricsFilterValues as ServiceMetricsPanelValue,
});

interface IProps
  extends RouteComponentProps, ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> { 
    onView: (serviceType: string) => void;
}

function ServiceDashboard(props: IProps){

  const { panelConfig, serviceMetric, updatePanelConfig, asyncGetStatus, onView, instanceList, updateMetricsFiltervalues, metricsFilterValues } = props;

  const [editPanelType, setEditPanelType ] = useState('');
  const [editPanelIndex, setEditPanelIndex ] = useState(0)

  const history = useHistory();

  const modalHandlerRef = useRef<any>();

  const handleConfigPanel = (serviceType: string, index: number) => {
    setEditPanelIndex(index);
    setEditPanelType(serviceType);
    modalHandlerRef.current.show();
  }

  const handleModalClose = () => {
    if (modalHandlerRef.current) {
      modalHandlerRef.current.hide();
    }
  }

  const handleView = (serviceType: string) => {
      history.push(`/service/${serviceType}-metrics`);
  };

  const handleMetricsChange = (values) => {
    updateMetricsFiltervalues(values);
  }

  const handleRefreshData = (values) => {
    updateMetricsFiltervalues(values);
  }

  return (
    <>
      <div className="service-table">
        <div className='common-header' >
          <MetricsFilterPanel 
            onChange={handleMetricsChange} 
            instanceList={instanceList} 
            values={metricsFilterValues}
            onRefresh={handleRefreshData}
          />
        </div>
        {METRIC_SERVICE_TYPES.map(type => (
          <ServiceOverview
            key={type}
            serviceType={type}
            icon={`#iconnav-${type}`}
            configs={panelConfig[type]}
            getStatus={asyncGetStatus}
            onConfigPanel={handleConfigPanel}
            onView={onView ?? handleView}
          />
        ))}
        <Modal
          className="modal-show-selected"
          width="750px"
          handlerRef={handler => (modalHandlerRef.current = handler)}
          title={intl.get('service.queryCondition')}
          footer={null}
        >
          <ServiceCardEdit
            serviceMetric={serviceMetric}
            editType={editPanelType}
            editIndex={editPanelIndex}
            panelConfig={panelConfig}
            onClose={handleModalClose}
            onPanelConfigUpdate={updatePanelConfig}
          />
        </Modal>
      </div>
    </>
  );
}

export default connect(mapState, mapDispatch)(withRouter(ServiceDashboard));
