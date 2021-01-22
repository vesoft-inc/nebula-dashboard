import { Button, Checkbox, Form, Input } from 'antd';
// import { FormInstance, FormProps } from 'antd/lib/form/Form';
import React from 'react';
import intl from 'react-intl-universal';
import { passwordRulesFn, usernameRulesFn } from '@assets/config/rules';
import LanguageSelect from '@assets/components/LanguageSelect'
import './index.less';
import nebulaLogo from '@assets/static/images/nebula_logo.png'
const FormItem = Form.Item;

const fomrItemLayout = {
  wrapperCol: { span: 24 },
};

// interface IProps {
//   onConfig: (form: FormInstance) => void;
// }
// interface IProps extends FormProps {
//   onConfig: (form: FormInstance) => void;
// }

const ConfigServerForm = () => {
  const onConfig = (values: any) => {
    console.log('success', values)
  }
  return (
    <div className="page-login">
      <div className="right">
        <img src={nebulaLogo} className="logo" />
        <p className="title">Nebula Dashboard</p>
        <p className="form-header">{intl.get('common.account')}</p>
        <Form layout="horizontal" {...fomrItemLayout} onFinish={onConfig}>
          <FormItem name="username" rules={usernameRulesFn(intl)}>
            <Input placeholder={intl.get('common.username')} bordered={false} />
          </FormItem>
          <FormItem name="password" rules={passwordRulesFn(intl)}>
            <Input placeholder={intl.get('common.password')} bordered={false} />
          </FormItem>
          <Form.Item name="remember" valuePropName="checked" className="btn-remember">
            <Checkbox>{intl.get('common.rememberPassword')}</Checkbox>
          </Form.Item>
          <Button className="btn-submit" type="primary" htmlType="submit">
            {intl.get('common.login')}
          </Button>
        </Form>
        <div className="footer">
          <span className="version">{intl.get('common.version')}：v1.1.0</span>
          <LanguageSelect />
        </div>
      </div>
    </div>
  );
};

export default ConfigServerForm;
