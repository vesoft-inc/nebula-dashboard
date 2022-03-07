import React from 'react';
import { connect } from 'react-redux';
import VersionItem from './VersionItem';
import { IDispatch } from '@/store';
import { IVersionItem } from '@/utils/interface';

const mapDispatch = (dispatch: IDispatch) => ({
  asyncGetServiceVersion: dispatch.nebula.asyncGetServiceVersion,
});

const mapState = () => ({});

interface IProps extends ReturnType<typeof mapDispatch> {}

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
    this.getVersion();
  }

  getVersion = async () => {
    const graph = await this.props.asyncGetServiceVersion('GRAPH');
    const storage = await this.props.asyncGetServiceVersion('STORAGE');
    const meta = await this.props.asyncGetServiceVersion('META');
    this.setState({
      graph,
      storage,
      meta,
    });
  };

  render() {
    const { graph, storage, meta } = this.state;
    return (
      <div className="version-statistics">
        <VersionItem
          title="Graph Service"
          icon="#iconservice-graph"
          mode="blue"
          data={graph}
        />
        <VersionItem
          title="Storage Service"
          icon="#iconservice-storage"
          mode="pink"
          data={storage}
        />
        <VersionItem
          title="Meta Service"
          icon="#iconservice-meta"
          mode="skyblue"
          data={meta}
        />
      </div>
    );
  }
}
export default connect(mapState, mapDispatch)(VersionStatistic);
