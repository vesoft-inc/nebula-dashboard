import React from 'react';
import { IRootState, IDispatch } from '@/store';
import intl from 'react-intl-universal'
import { connect } from 'react-redux';
import { IVersionItem, ServiceName } from '@/utils/interface';
import VersionItem from './VersionItem';
import { isCommunityVersion } from '@/utils';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetSpaces: dispatch.nebula.asyncGetSpaces,
  asyncGetServiceVersion: dispatch.nebula.asyncGetServiceVersion,
});

const mapState = (state: IRootState) => ({
  nebulaConnect: (state.nebula as any).nebulaConnect,
});

interface IProps
  extends ReturnType<typeof mapState>,
    ReturnType<typeof mapDispatch> {
  isOverview?: boolean;
}
interface IState {
  graph: IVersionItem[];
  storage: IVersionItem[];
  meta: IVersionItem[];
}

class VersionStatistic extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      graph: [],
      storage: [],
      meta: [],
    };
  }

  componentDidMount() {
    const { nebulaConnect } = this.props;
    if (isCommunityVersion() || nebulaConnect) {
      this.getVersion();
    }
  }

  componentDidUpdate(prevProps) {
    const { nebulaConnect } = this.props;
    if (nebulaConnect !== prevProps.nebulaConnect) {
      this.getVersion();
    }
  }

  componentWillUnmount() {
    this.setState = () => false;
  }

  getVersion = async () => {
    const { code } = await this.props.asyncGetSpaces();
    if (code === 0) {
      const graph = await this.props.asyncGetServiceVersion('GRAPH');
      const storage = await this.props.asyncGetServiceVersion('STORAGE');
      const meta = await this.props.asyncGetServiceVersion('META');
      this.setState({
        graph,
        storage,
        meta,
      });
    }
  };

  render() {
    const { graph, storage, meta } = this.state;
    const { isOverview } = this.props;
    return (
      <div className="version-statistics">
        <VersionItem
          isOverview={!!isOverview}
          title={`Graph ${intl.get("common.service")}`}
          icon="#iconservice-graph"
          data={graph}
          serviceType={ServiceName.GRAPHD}
        />
        <VersionItem
          isOverview={!!isOverview}
          title={`Storage ${intl.get("common.service")}`}
          icon="#iconservice-storage"
          data={storage}
          serviceType={ServiceName.STORAGED}
        />
        <VersionItem
          isOverview={!!isOverview}
          title={`Meta ${intl.get("common.service")}`}
          icon="#iconservice-meta"
          data={meta}
          serviceType={ServiceName.METAD}
        />
      </div>
    );
  }
}

//  @ts-ignore
export default connect(mapState, mapDispatch)(VersionStatistic);
