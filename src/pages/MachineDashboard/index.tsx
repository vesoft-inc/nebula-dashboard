import DashboardCard from '@/components/DashboardCard';
import Modal from '@/components/Modal';
import BaseLineEdit from '@/components/BaseLineEdit';
import { IDispatch, IRootState } from '@/store';
import { Col, Row } from 'antd';
import { connect } from 'react-redux';
import React from 'react';
import intl from 'react-intl-universal';
import { CARD_POLLING_INTERVAL, CARD_RANGE, MACHINE_TYPE, getBaseLineByUnit } from '@/utils/dashboard';
import { SUPPORT_METRICS, VALUE_TYPE } from '@/utils/promQL';
import CPUCard from './Cards/CPUCard';
import './index.less';
import MemoryCard from './Cards/MemoryCard';
import DiskCard from './Cards/DiskCard';
import LoadCard from './Cards/LoadCard';
import NetworkOut from './Cards/NetworkOut';
import NetworkIn from './Cards/NetworkIn';

const mapDispatch: any = (dispatch: IDispatch) => {
  return {
    asyncGetCPUStatByRange: dispatch.machine.asyncGetCPUStatByRange,
    asyncGetMemoryStatByRange: dispatch.machine.asyncGetMemoryStatByRange,
    asyncGetMemorySizeStat: dispatch.machine.asyncGetMemorySizeStat,
    asyncGetDiskSizeStat: dispatch.machine.asyncGetDiskSizeStat,
    asyncGetDiskStatByRange: dispatch.machine.asyncGetDiskStatByRange,
    asyncGetLoadByRange: dispatch.machine.asyncGetLoadByRange,
    asyncGetNetworkStatByRange: dispatch.machine.asyncGetNetworkStatByRange,
    asyncUpdateBaseLine: (key, value) => dispatch.setting.update({
      [key]: value
    }),
  };
};

const mapState = (state: IRootState) => {
  return {
    cpuBaseLine: state.setting.cpuBaseLine,
    memoryBaseLine: state.setting.memoryBaseLine,
    networkOutBaseLine: state.setting.networkOutBaseLine,
    networkInBaseLine: state.setting.networkInBaseLine,
    loadBaseLine: state.setting.loadBaseLine,
  };
};

interface IProps extends ReturnType<typeof mapDispatch>,
  ReturnType<typeof mapState> {
}

interface IState {
  editPanelType: string,
}
class MachineDashboard extends React.Component<IProps, IState> {
  pollingTimer: any;
  modalHandler;
  constructor(props: IProps) {
    super(props);
    this.state = {
      editPanelType: '',
    };
  }
  componentDidMount() {
    this.props.asyncGetMemorySizeStat();
    this.props.asyncGetDiskSizeStat();

    this.getMachineStatus();
    this.pollingMachineStatus();
  }

  componentWillUnmount() {
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }
  }

  handleConfigPanel=(editPanelType: string) => {
    this.setState({
      editPanelType,
    }, this.modalHandler.show);
  }

  handleBaseLineChange= async (value) => {
    const { editPanelType } = this.state;
    const { baseLine, unit } = value;
    await this.props.asyncUpdateBaseLine(`${editPanelType}BaseLine`, getBaseLineByUnit(baseLine, unit));
    this.handleClose();
  }
  
  handleClose=() => {
    if(this.modalHandler){
      this.modalHandler.hide();
    }
  }

  getMachineStatus = () => {
    const end = Date.now();
    const start = end - CARD_RANGE;
    this.props.asyncGetCPUStatByRange({
      start,
      end,
      metric: SUPPORT_METRICS.cpu[0].metric,
    });
    this.props.asyncGetMemoryStatByRange({
      start,
      end,
      metric: SUPPORT_METRICS.memory[0].metric,
    });
    this.props.asyncGetDiskStatByRange({
      start: end - 1000,
      end,
      metric: SUPPORT_METRICS.disk[0].metric,
    });
    this.props.asyncGetLoadByRange({
      start,
      end,
      metric: SUPPORT_METRICS.load[0].metric,
    });
    this.props.asyncGetNetworkStatByRange({
      start,
      end,
      metric: SUPPORT_METRICS.network[0].metric,
      inOrOut: 'in',
    });
    this.props.asyncGetNetworkStatByRange({
      start,
      end,
      metric: SUPPORT_METRICS.network[1].metric,
      inOrOut: 'out',
    });
  }

  pollingMachineStatus = () => {
    this.pollingTimer = setTimeout(() => {
      this.getMachineStatus();
      this.pollingMachineStatus();
    }, CARD_POLLING_INTERVAL);
  }

  getValueType=(type) => {
    switch (type) {
      case MACHINE_TYPE.cpu:
      case MACHINE_TYPE.memory:
        return VALUE_TYPE.percentage;
      case MACHINE_TYPE.load:
        return VALUE_TYPE.number;
      case MACHINE_TYPE.networkOut:
      case MACHINE_TYPE.networkIn:
        return VALUE_TYPE.byteSecond;
      default:
        return VALUE_TYPE.number;
    }
  }

  render() {
    const { editPanelType } = this.state;
    return <div className="machine-dashboard">
      <Row>
        <Col span={12}>
          <DashboardCard title={intl.get('device.cpu')} viewPath="/machine/cpu" onConfigPanel={() => this.handleConfigPanel(MACHINE_TYPE.cpu)}>
            <CPUCard />
          </DashboardCard>
        </Col>
        <Col span={12}>
          <DashboardCard title={intl.get('device.memory')} viewPath="/machine/memory" onConfigPanel={() => this.handleConfigPanel(MACHINE_TYPE.memory)}>
            <MemoryCard />
          </DashboardCard>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DashboardCard title={intl.get('device.load')} viewPath="/machine/load" onConfigPanel={() => this.handleConfigPanel(MACHINE_TYPE.load)}>
            <LoadCard />
          </DashboardCard>
        </Col>
        <Col span={12}>
          <DashboardCard title={intl.get('device.disk')} viewPath="/machine/disk">
            <DiskCard />
          </DashboardCard>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <DashboardCard title={intl.get('device.networkOut')} viewPath="/machine/network" onConfigPanel={() => this.handleConfigPanel(MACHINE_TYPE.networkOut)}>
            <NetworkOut />
          </DashboardCard>
        </Col>
        <Col span={12}>
          <DashboardCard title={intl.get('device.networkIn')} viewPath="/machine/network" onConfigPanel={() => this.handleConfigPanel(MACHINE_TYPE.networkIn)}>
            <NetworkIn />
          </DashboardCard>
        </Col>
      </Row>
      <Modal
        title="empty"
        className="modal-baseLine"
        width="550px"
        handlerRef={handler => (this.modalHandler = handler)}
        footer={null}
      >
        <BaseLineEdit
          valueType={this.getValueType(editPanelType)}
          baseLine={this.props[`${editPanelType}BaseLine`]}
          onClose={this.handleClose}
          onBaseLineChange={this.handleBaseLineChange}
        />
      </Modal>
    </div>;
  }
}

export default connect(mapState, mapDispatch)(MachineDashboard);
