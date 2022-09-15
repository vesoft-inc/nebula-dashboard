import React from 'react';
import { IRootState, IDispatch } from '@/store';
import { connect } from 'react-redux';
import { IVersionItem } from '@/utils/interface';
import VersionItem from './VersionItem';
import { isCommunityVersion } from '@/utils';

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncGetSpaces: dispatch.nebula.asyncGetSpaces,
  asyncGetServiceVersion: dispatch.nebula.asyncGetServiceVersion,
});

const mapState = (state: IRootState) => ({
  address: (state.nebula as any).address,
  port: (state.nebula as any).port,
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
    const { address, port } = this.props;
    if (isCommunityVersion() || (address && port)) {
      this.getVersion();
    }
  }

  componentDidUpdate(prevProps) {
    const { address, port } = this.props;
    if (address !== prevProps.address && port !== prevProps.port) {
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
          title="Graph Service"
          icon="#iconservice-graph"
          data={graph}
        />
        <VersionItem
          isOverview={!!isOverview}
          title="Storage Service"
          icon="#iconservice-storage"
          data={storage}
        />
        <VersionItem
          isOverview={!!isOverview}
          title="Meta Service"
          icon="#iconservice-meta"
          data={meta}
        />
      </div>
    );
  }
}
export default connect(mapState, mapDispatch)(VersionStatistic);
