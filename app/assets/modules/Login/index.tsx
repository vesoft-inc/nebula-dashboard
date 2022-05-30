import { Button, Form, Input } from 'antd';
// import { FormInstance, FormProps } from 'antd/lib/form/Form';
import React from 'react';
import intl from 'react-intl-universal';
import { passwordRulesFn, usernameRulesFn } from '@assets/config/rules';
import LanguageSelect from '@assets/components/LanguageSelect';
import { connect } from 'react-redux';
import './index.less';
import nebulaLogo from '@assets/static/images/nebula_logo.png';
import { RouteComponentProps } from 'react-router-dom';
import { IDispatch, IRootState } from '@assets/store';
const FormItem = Form.Item;

const fomrItemLayout = {
  wrapperCol: {
    span: 24 
  },
};

const mapState = (state: IRootState) => ({
  appVersion: state.app.version,
  connection: state.app.connection,
});


const mapDispatch = (dispatch: IDispatch) => ({
  asyncLogin: dispatch.app.asyncLogin,
  asyncGetAppInfo: dispatch.app.asyncGetAppInfo,
  asyncGetCustomConfig: dispatch.app.asyncGetCustomConfig,
});

interface IProps extends ReturnType<typeof mapState>,
  ReturnType<typeof mapDispatch>,
  RouteComponentProps{
}
class ConfigServerForm extends React.Component<IProps> {

  componentDidMount() {
    this.props.asyncGetAppInfo();
    this.props.asyncGetCustomConfig();
  }

<<<<<<< HEAD
  onConfig = async (values: any) => {
    const { connection } = this.props;
    const ok = await this.props.asyncLogin({ ip: connection.ip, port:  connection.port, ...values });
=======
  onConfig = async(values: any) => {
    const ok = await this.props.asyncLogin(values);
>>>>>>> 8b2e53a (mod: fix issue & chore nebula-stats-exporter (#55))
    if (ok) {
      this.props.history.push('/machine/overview');
    }
  };
  render(){
    const { appVersion } = this.props;
    return (
      <div className="page-login">
        <div className="right">
          <img src={nebulaLogo} className="logo" />
          <p className="title">Nebula Dashboard</p>
          <p className="form-header">{intl.get('common.account')}</p>
          <Form layout="horizontal" {...fomrItemLayout} onFinish={this.onConfig}>
            <FormItem name="username" rules={usernameRulesFn(intl)}>
              <Input placeholder={intl.get('common.username')} bordered={false}/>
            </FormItem>
            <FormItem name="password" rules={passwordRulesFn(intl)}>
              <Input type="password" placeholder={intl.get('common.password')} bordered={false}/>
            </FormItem>
            <Button className="btn-submit" type="primary" htmlType="submit">
              {intl.get('common.login')}
            </Button>
          </Form>
          <div className="footer">
            <span className="version">{intl.get('common.version')}：{appVersion}</span>
            <LanguageSelect showIcon={true} />
          </div>
        </div>
      </div>
    );
  }

};

export default connect(mapState, mapDispatch)(ConfigServerForm);
