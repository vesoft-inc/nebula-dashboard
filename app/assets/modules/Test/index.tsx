import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import './index.less';
import { IDispatch } from '@assets/store';

interface IState {
  options: any[];
}


const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetDiskUsageRate: dispatch.machine.asyncGetDiskUsageRate,
  }
}

const mapState = () => ({})

interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch> {

}

class Test extends React.Component<IProps, IState> {
  componentDidMount() {
    this.props.asyncGetDiskUsageRate();
  }

  render() {
    return (
      <div className="test">
        test
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(Test)
