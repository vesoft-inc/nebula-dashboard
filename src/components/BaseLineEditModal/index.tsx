import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, InputNumber, Modal, Select } from 'antd';
import intl from 'react-intl-universal';
import { renderUnit } from '@/utils/dashboard';

import './index.less';
import ModalWrapper from '../ModalWrapper';

interface IProps {
  visible?: boolean;
  baseLine: number;
  valueType: string;
  onOk?: (values) => void;
  hide?: () => void;
  title?: string;
  onCancel?: () => void;
}

function BaseLineEditModal(props: IProps) {
  const { valueType, baseLine, onCancel, visible, hide, onOk, title } = props;
  const units = useMemo(() => renderUnit(valueType), [valueType]);
  const [curVisible, setCurVisible] = useState(visible);
  const [form] = Form.useForm();

  const getInitialValues = () => {
    const initialValues = { baseLine } as any;
    if (units.length) {
      initialValues.unit = units[0];
    }
    return initialValues;
  }

  useEffect(() => {
    setCurVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (!curVisible) {
      hide && hide();
    }
  }, [curVisible]);

  const handleCancelClick = () => {
    onCancel?.();
    setCurVisible(false);
  };

  const handleOkClick = () => {
    setCurVisible(false);
    form.validateFields().then(values => {
      onOk?.(values)
    })
  }

  return (
    <Modal
      title={title || intl.get('base.baseLineModalTitle')}
      className="baseline-modal"
      width="550px"
      footer={null}
      onOk={handleOkClick}
      maskClosable={false}
      onCancel={handleCancelClick}
      visible={curVisible}
    >
      <div className="base-line-edit">
        <Form form={form} initialValues={getInitialValues()}>
          <Form.Item
            label={intl.get('common.baseLine')}
            name="baseLine"
            hasFeedback={true}
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
            <Button htmlType="button" onClick={handleCancelClick}>
              {intl.get('common.cancel')}
            </Button>
            <Button
              type="primary"
              onClick={handleOkClick}
              data-track-category="base_line"
              data-track-action="confirm_edit"
              data-track-label={`from_${valueType}`}
            >
              {intl.get('common.confirm')}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default ModalWrapper(BaseLineEditModal);
