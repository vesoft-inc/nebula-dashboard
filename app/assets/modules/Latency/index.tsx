import { Button, DatePicker, Form, Tabs } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';

import service from '#assets/config/service';

import './index.less';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

interface IState {
  options: any[];
}

type IProps = FormComponentProps;

const INDEXES_TO_SHOW = ['p95', 'p99', 'p999', 'qps', 'average'];

class Latency extends React.Component<IProps, IState> {
  startTime: any;
  endTime: any;
  constructor(props) {
    super(props);

    this.startTime = moment().add(-7, 'days');
    this.endTime = moment();
    this.state = {
      options: [],
    };
  }

  componentDidMount() {
    this.getLatency({
      startTime: +this.startTime,
      endTime: +this.endTime,
    });
  }

  renderColumn = (option, index) => {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          ...option,
          chart: {
            type: 'column',
          },
          exporting: {
            showTable: true,
          },
        }}
        key={index.toString()}
      />
    );
  };

  renderLine = (option, index) => {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={option}
        key={index.toString()}
      />
    );
  };

  handleSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { startTime, endTime } = values;
        this.getLatency({
          startTime: +startTime,
          endTime: +endTime,
        });
      }
    });
  };

  getLatency = async (params: { startTime?: number; endTime?: number }) => {
    const { code, data } = (await service.getLatency(params)) as any;
    if (code === 0) {
      const groupData = _.groupBy(data, item => `${item.name}(${item.type})`);
      const options = INDEXES_TO_SHOW.map(index => {
        return {
          chart: {
            type: 'line',
          },
          title: {
            text: `每日测试 ${index}`,
          },
          xAxis: {
            type: 'datetime',
            title: {
              text: '日期',
            },
            labels: {
              formatter() {
                return Highcharts.dateFormat('%Y-%m-%d', (this as any).value);
              },
            },
          },
          yAxis: {
            title: {
              text: 'latency',
            },
          },
          plotOptions: {
            series: {
              events: {
                legendItemClick() {
                  return (this as any).visible ? 'hidden' : 'visible';
                },
              },
            },
          },
          series: Object.keys(groupData).map(name => {
            const stats = groupData[name];
            return {
              name,
              data: stats.map(d => {
                const date = moment(d.timestamp).format('YYYY-MM-DD');
                return {
                  name: d.name,
                  y: d[index],
                  x: +moment(date) + 8 * 3600 * 1000,
                };
              }),
            };
          }),
          exporting: {
            showTable: true,
          },
        };
      });

      this.setState({
        options,
      });
    }
  };

  render() {
    const { options } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className="latency-stat">
        <h3>各类情况 Latency 统计</h3>
        <Form layout="inline">
          <Form.Item label="开始时间">
            {getFieldDecorator('startTime', {
              initialValue: this.startTime,
              rules: [
                {
                  required: true,
                },
              ],
            })(<DatePicker />)}
          </Form.Item>
          <Form.Item label="结束时间">
            {getFieldDecorator('endTime', {
              initialValue: this.endTime,
              rules: [
                {
                  required: true,
                },
              ],
            })(<DatePicker />)}
          </Form.Item>
          <Form.Item>
            <Button onClick={this.handleSearch}>查询</Button>
          </Form.Item>
        </Form>
        {options.map((option, index) => (
          <div className={`stat-${index}`} key={index.toString()}>
            <Tabs>
              <Tabs.TabPane tab="折线图" key="line">
                {this.renderLine(option, index)}
              </Tabs.TabPane>
              <Tabs.TabPane tab="柱状图" key="column">
                {this.renderColumn(option, index)}
              </Tabs.TabPane>
            </Tabs>
          </div>
        ))}
      </div>
    );
  }
}

export default Form.create()(Latency);
