import { Button, Card, Col, Form, Input, message, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import LogoSVG from "../assets/svgs/Logo";
import TypoSVG from "../assets/svgs/Typo";
import BgLogin from "../assets/blobs/bg-login.svg"
import { KeyOutlined } from "@ant-design/icons";
import pkg from '../../package.json'
import { useTranslation } from "react-i18next";
import API from "../services/API";
import { useNavigate, useParams } from "react-router-dom";

export default function PasswordRecover() {
  const [FormReset] = useForm()
  const [t] = useTranslation('common')
  let params = useParams()
  const navigate = useNavigate()

  const recover = () => {
    if (FormReset.getFieldValue('password') === FormReset.getFieldValue('repeat-password')) {
      API.post('change-password', {
        'token': params.token,
        'password': FormReset.getFieldValue('password')
      }).then(res => {
        message.success(t('alerts.password_reseted'))
        navigate('/login')
      }).catch(err => {
        message.error(err.response.data.message)
      })
    } else {
      message.error(t('alerts.passwords_dont_match'))
    }
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
            form={FormReset}
          >
            <Form.Item
              name="password"
              rules={[{ required: true, message: t('alerts.required_field') }]}
            >
              <Input.Password size="large" placeholder={t('placeholder.new_password')} prefix={<KeyOutlined />} />
            </Form.Item>
            <Form.Item
              name="repeat-password"
              rules={[{ required: true, message: t('alerts.required_field') }]}
            >
              <Input.Password size="large" placeholder={t('placeholder.repeat_password')} prefix={<KeyOutlined />} />
            </Form.Item>
            <Form.Item>
              <Row justify="center">
                <Button type="primary" htmlType="submit" onClick={recover}>
                  {t('actions.recover')}
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
    </Row>
  )
}