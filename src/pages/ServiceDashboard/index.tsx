import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';

import ServiceOverview from './ServiceOverview';
import { IDispatch, IRootState } from '@/store';
import Modal from '@/components/Modal';
import ServiceCardEdit from '@/components/Service/ServiceCardEdit';
import { DEPENDENCY_PROCESS_TYPES, METRIC_PROCESS_TYPES } from '@/utils/metric';
import MetricsFilterPanel from '@/components/MetricsFilterPanel';

import './index.less';
import { ServiceMetricsPanelValue, ServiceName } from '@/utils/interface';
import { calcTimeRange } from '@/utils/dashboard';
import { shouldCheckCluster } from '@/utils';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetStatus: dispatch.service.asyncGetStatus,
  asyncGetSpaces: dispatch.serviceMetric.asyncGetSpaces,
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
  cluster: (state as any)?.cluster?.cluster,
  serviceMetric: state.serviceMetric,
  metricsFilterValues: (state as any).service.metricsFilterValues as ServiceMetricsPanelValue,
});

interface IProps
  extends RouteComponentProps, ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {
  onView: (serviceType: ServiceName) => void;
}

function ServiceDashboard(props: IProps) {

  const { panelConfig, serviceMetric, updatePanelConfig, asyncGetStatus, onView, instanceList, updateMetricsFiltervalues, metricsFilterValues, asyncGetSpaces, cluster } = props;

  const [editPanelType, setEditPanelType] = useState('');
  const [editPanelIndex, setEditPanelIndex] = useState(0)

  const history = useHistory();

  const modalHandlerRef = useRef<any>();

  useEffect(() => {
    const [start, end] = calcTimeRange(metricsFilterValues.timeRange);
    if (shouldCheckCluster()) {
      if (cluster?.id) {
        asyncGetSpaces({
          clusterID: cluster.id,
          start,
          end
        })
      }
    } else {
      asyncGetSpaces({
        start,
        end
      })
    }
  }, [metricsFilterValues.timeRange, cluster])

  const handleConfigPanel = (serviceType: ServiceName, index: number) => {
    setEditPanelIndex(index);
    setEditPanelType(serviceType);
    modalHandlerRef.current.show();
  }

  const handleModalClose = () => {
    if (modalHandlerRef.current) {
      modalHandlerRef.current.hide();
    }
  }

  const handleView = (serviceType: ServiceName) => {
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
        {METRIC_PROCESS_TYPES.map(type => (
          <ServiceOverview
            key={type}
            serviceType={type}
            // icon={`#iconnav-${type}`}
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
