import React, { useState, useLayoutEffect } from "react"
import { Row, Col, Card, Form, Input, Button, notification, Modal, message } from 'antd'
import { MailOutlined, KeyOutlined } from '@ant-design/icons'
import pkg from '../../package.json'
import API from "../services/API"
import { useNavigate } from "react-router-dom"
import BgLogin from "../assets/blobs/bg-login.svg"
import LogoSVG from "../assets/svgs/Logo"
import TypoSVG from "../assets/svgs/Typo"
import { useTranslation } from "react-i18next"
import { useForm } from "antd/lib/form/Form"

function LoginPage() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [modalRecoverVis, setModalRecoverVis] = useState(false)
  const [FormRecover] = useForm()
  const [FormLogin] = useForm()
  const navigate = useNavigate()
  const [t] = useTranslation('common')
  const [loadRecover, setLoadRecover] = useState(false)

  useLayoutEffect(() => {
    if (localStorage.getItem('token') != null) {
      navigate('/dashboard')
    }
  }, [navigate])

  function login() {
    API.post(`login`, FormLogin.getFieldsValue()).then((res) => {
      localStorage.setItem('name', res.data['name'])
      localStorage.setItem('email', res.data['email'])
      localStorage.setItem('id', res.data['id'])
      localStorage.setItem('role', res.data['role'])
      localStorage.setItem('token', res.data['token'])
      localStorage.setItem('permissions', res.data['permissions'])
      window.location.replace('/dashboard')
    }).catch((err) => {
      notification.error({
        message: err.response.data['message']
      })
    })
  }

  const recoverPassword = () => {
    setLoadRecover(true)
    API.post('recover-password', {
      'email': FormRecover.getFieldValue('email_recover')
    }).then(res => {
      setModalRecoverVis(false)
      message.success(t('alerts.email_sent'))
      setLoadRecover(false)
    }).catch(err => {
      setLoadRecover(false)
      message.error(err.response.data.message)
    })
  }

  return (
    <Row justify="center" align="middle" style={{ height: '100%', backgroundImage: `url(${BgLogin})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <Col span={6}>
        <Row align="center" style={{ marginBottom: 10 }}>
          <Col>
            <LogoSVG fill="#fff" style={{ marginRight: 15 }} />
            <TypoSVG fill="#fff" />
          </Col>
        </Row>
        <Card>
          <Form
            form={FormLogin}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'This field is required' }]}
            >
              <Input value={email} onChange={e => setEmail(e.target.value)} size="large" placeholder="E-Mail" prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'This field is required' }]}
            >
              <Input.Password value={password} onChange={e => setPassword(e.target.value)} size="large" placeholder={t('texts.password')} prefix={<KeyOutlined />} />
            </Form.Item>
            <Form.Item>
              <Row justify="space-between">
                <Button onClick={() => setModalRecoverVis(true)} type="link">{t('questions.forgot_password')}</Button>
                <Button type="primary" htmlType="submit" onClick={login}>
                  {t('actions.login')}
                </Button>
              </Row>
            </Form.Item>
          </Form>
        </Card>
        <Row justify="center" style={{ marginTop: 10, color: 'white' }}>
          <p><b>Neom - v{pkg.version}</b></p>
        </Row>
      </Col>
      <Col>

      </Col>
      <Modal
        title={t('texts.recover_password')}
        open={modalRecoverVis}
        onCancel={() => setModalRecoverVis(false)}
        footer={false}
      >
        <Form
          form={FormRecover}
          onFinish={recoverPassword}
        >
          <Form.Item
            name={'email_recover'}
            rules={[{ required: true, message: t('alerts.required_field') }]}
          >
            <Input placeholder='E-Mail'/>
          </Form.Item>
          <Form.Item>
            <Button loading={loadRecover} htmlType="submit" type="primary">{t('actions.recover')}</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  )
}

export default LoginPage
