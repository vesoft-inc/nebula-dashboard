import React from 'react';
import FlowDetailItem from './FlowDetailItem';

class FlowDetail extends React.Component {
  render() {
    return (<div className="memory-detail detail-card">
      <FlowDetailItem></FlowDetailItem>
      <FlowDetailItem></FlowDetailItem>
      <FlowDetailItem></FlowDetailItem>
      <FlowDetailItem></FlowDetailItem>
    </div>)
  }
}

export default FlowDetail;