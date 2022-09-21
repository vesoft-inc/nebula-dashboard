import { Button, Form, Input, Select } from 'antd';
// import { FormInstance, FormProps } from 'antd/lib/form/Form';
import React from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  passwordRulesFn,
  usernameRulesFn,
  versionRulesFn,
} from '@/config/rules';
import LanguageSelect from '@/components/LanguageSelect';
import { VERSIONS } from '@/utils/dashboard';
import './index.less';
import nebulaLogo from '@/static/images/nebula_logo.png';
import { IDispatch, IRootState } from '@/store';
import { LanguageContext } from '@/context';
import { SessionStorageUtil } from '@/utils';

const FormItem = Form.Item;

const fomrItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

const mapState = (state: IRootState) => ({
  appVersion: state.app.version,
  connection: state.app.connection,
});

const mapDispatch: any = (dispatch: IDispatch) => ({
  asyncLogin: dispatch.app.asyncLogin,
  asyncGetAppInfo: dispatch.app.asyncGetAppInfo,
  asyncGetCustomConfig: dispatch.app.asyncGetCustomConfig,
  updateVersion: values =>
    dispatch.nebula.update({
      version: values,
    }),
});

interface IProps
  extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>,
  RouteComponentProps {}
class ConfigServerForm extends React.Component<IProps> {
  componentDidMount() {
    this.props.asyncGetAppInfo();
    this.props.asyncGetCustomConfig();
  }

  onConfig = async (values: any) => {
    const { connection } = this.props;
    const ok = await this.props.asyncLogin({
      ip: connection.ip,
      port: connection.port,
      ...values,
    });
    if (ok) {
      SessionStorageUtil.setItem('version', values.version)
      this.props.updateVersion(values.version);
      this.props.history.push('/machine/overview');
    }
  };

  render() {
    const { appVersion } = this.props;
    return (
      <div className="page-login">
        <div className="right">
          <img src={nebulaLogo} className="logo" />
          <p className="title">Nebula Dashboard</p>
          <p className="form-header">{intl.get('common.account')}</p>
          <Form
            layout="horizontal"
            {...fomrItemLayout}
            onFinish={this.onConfig}
          >
            <FormItem name="username" rules={usernameRulesFn(intl)}>
              <Input
                placeholder={intl.get('common.username')}
                bordered={false}
              />
            </FormItem>
            <FormItem name="password" rules={passwordRulesFn(intl)}>
              <Input
                type="password"
                placeholder={intl.get('common.password')}
                bordered={false}
              />
            </FormItem>
            <FormItem name="version" rules={versionRulesFn(intl)}>
              <Select>
                {VERSIONS.map(version => (
                  <Select.Option value={version} key={version}>
                    {version}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
            <Button className="btn-submit" type="primary" htmlType="submit">
              {intl.get('common.login')}
            </Button>
          </Form>
          <div className="footer">
            <div className="version">
              {intl.get('common.version')}：{appVersion}
            </div>
            <LanguageContext.Consumer>
              {({ currentLocale, toggleLanguage }) => (
                <LanguageSelect
                  showIcon={true}
                  currentLocale={currentLocale}
                  toggleLanguage={toggleLanguage}
                />
              )}
            </LanguageContext.Consumer>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(ConfigServerForm);
