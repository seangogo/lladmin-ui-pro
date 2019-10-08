import { Alert, Checkbox, Icon, Form, Input, Button } from 'antd';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

const FormItem = Form.Item;

@connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))
@Form.create()
class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'account',
    autoLogin: true,
  };

  componentWillMount() {
    console.log(222)
    this.onGetCaptcha();
  }

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      console.log('onGetCaptcha');
      const { dispatch } = this.props;
      console.log('onGetCaptcha');
      dispatch({ type: 'login/getCaptcha' })
        .then(resolve)
        .catch(reject);
    });

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: { ...values, type },
      });
    }
  };

  onTabChange = type => {
    this.setState({
      type,
    });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(['mobile'], {}, async (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;

          try {
            const success = await dispatch({
              type: 'login/getCaptcha',
              payload: values.mobile,
            });
            resolve(!!success);
          } catch (error) {
            reject(error);
          }
        }
      });
    });

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userLogin, submitting, form } = this.props;
    const { captcha } = userLogin;
    const { passwordIcon } = this.state;
    const { status, type: loginType } = userLogin;
    const { type, autoLogin } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <h3 className={styles.title} style={{ fontSize: 14 }}>
          ll-admin 后台管理员平台
        </h3>
        <Form className={styles.form}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '请输入账户名！',
                },
              ],
            })(
              <Input
                prefix={<Icon type="user" className={styles.prefixIcon} />}
                placeholder="请输入帐户名"
                maxLength={30}
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码！',
                },
              ],
            })(
              <Input
                prefix={<Icon type="key" className={styles.prefixIcon} />}
                suffix={<Icon type="eye" className={styles.prefixIcon} onClick={this.handleLook} />}
                type={passwordIcon ? 'text' : 'password'}
                theme="twoTone"
                maxLength={30}
                placeholder="请输入密码"
              />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ],
            })(
              <Input
                prefix={<Icon type="key" className={styles.prefixIcon} />}
                theme="twoTone"
                maxLength={30}
                className={styles.code}
                placeholder="请输入验证码"
              />,
            )}
            {captcha.img && (
              <img
                className={styles.captcha}
                src={`data:image/gif;base64,${captcha.img}`}
                alt=""
                onClick={this.onGetCaptcha}
              />
            )}
          </FormItem>
          <FormItem className={styles.additional}>
            <div>
              {getFieldDecorator('remember', {
                valuePropName: localStorage.getItem('REMEMBER') ? 'checked' : 'none',
                initialValue: true,
              })(
                <Checkbox onChange={this.handleRemember} style={{ font: '#8190B0' }}>
                  <span className={styles.automatic}>记住我</span>
                </Checkbox>,
              )}
            </div>
            <Button
              size="large"
              loading={userLogin.submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
              onClick={this.handleSubmit}
            >
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Login;
