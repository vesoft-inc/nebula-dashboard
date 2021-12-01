import React from 'react';
import { Button, Form, InputNumber, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import intl from 'react-intl-universal';
import { renderUnit } from '@/utils/dashboard';

import './index.less';

interface IProps {
  baseLine: number;
  valueType: string;
  onClose: () => void;
  onBaseLineChange: (values) => void;
}

class BaseLineEdit extends React.Component<IProps> {
  formRef = React.createRef<FormInstance>();

  render() {
    const { valueType, baseLine, onClose, onBaseLineChange } = this.props;
    const units = renderUnit(valueType);
    const initialValues = { baseLine } as any;
    if (units.length) {
      initialValues.unit = units[0];
    }

    return (
      <div className="base-line-edit">
        <Form initialValues={initialValues} onFinish={onBaseLineChange}>
          <Form.Item
            label={intl.get('common.baseLine')}
            name="baseLine"
            hasFeedback
            rules={[
              { required: true, message: intl.get('common.baseLineTip') },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          {units.length !== 0 && (
            <Form.Item
              rules={[{ required: true }]}
              label={intl.get('common.unit')}
              name="unit"
            >
              <Select>
                {units.map(value => (
                  <Select.Option value={value} key={value}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <div className="footer-btns">
            <Button htmlType="button" onClick={onClose}>
              {intl.get('common.cancel')}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              data-track-category="base_line"
              data-track-action="confirm_edit"
              data-track-label={`from_${valueType}`}
            >
              {intl.get('common.confirm')}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default BaseLineEdit;
