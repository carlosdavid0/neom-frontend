import React, { useState, useLayoutEffect } from "react";
import {Row, Col, Card, Form, Input, Button, Typography, notification} from 'antd';
import { MailOutlined, KeyOutlined, LoadingOutlined } from '@ant-design/icons';
import pkg from '../../package.json';
import API from "../services/API";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (localStorage.getItem('token') != null) {
          navigate('/dashboard');
        }
      }, []);

    function login() {
        API.post(`login`, {
            email: email,
            password: password
        }).then((res) => {
            localStorage.setItem('name', res.data['name']);
            localStorage.setItem('email', res.data['email']);
            localStorage.setItem('id', res.data['id']);
            localStorage.setItem('role', res.data['role']);
            localStorage.setItem('token', res.data['token']);
            window.location.replace('/dashboard');
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        })
    }

    return (
        <Row justify="center" align="middle" style={{ height: '100%', backgroundColor: '#f1f4f8' }}>
            <Col span={6}>
                <Card title="Neom - Login">
                    <Form
                        name="login"
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'This field is required'}]}
                        >
                            <Input value={email} onChange={e => setEmail(e.target.value)} size="large" placeholder="E-Mail" prefix={<MailOutlined />}/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'This field is required'}]}
                        >
                            <Input.Password value={password} onChange={e => setPassword(e.target.value)} size="large" placeholder="Password" prefix={<KeyOutlined />}/>
                        </Form.Item>
                        <Form.Item>
                            <Row justify="space-between">
                                <a href="#">Forgot your password?</a>
                                <Button type="primary" htmlType="submit" onClick={login}>
                                    Login
                                </Button>
                            </Row>
                        </Form.Item>
                    </Form>
                </Card>
                <Row justify="center" style={{ marginTop: 10 }}>
                    <p><b>Made with ❤️ by Ernesto Muniz - v{pkg.version}</b></p>
                </Row>
            </Col>
        </Row>
    );
}

export default LoginPage;
