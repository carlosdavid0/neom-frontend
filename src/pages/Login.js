import React, { useState, useLayoutEffect } from "react";
import { Row, Col, Card, Form, Input, Button, Typography, notification } from 'antd';
import { MailOutlined, KeyOutlined } from '@ant-design/icons';
import pkg from '../../package.json';
import API from "../services/API";
import { useNavigate } from "react-router-dom";
import BgLogin from "../assets/blobs/bg-login.svg"
import LogoSVG from "../assets/svgs/Logo";
import TypoSVG from "../assets/svgs/Typo";

function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (localStorage.getItem('token') != null) {
            navigate('/dashboard');
        }
    }, [navigate]);

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
            localStorage.setItem('permissions', res.data['permissions']);
            window.location.replace('/dashboard');
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        })
    }

    return (
        <Row justify="center" align="middle" style={{ height: '100%', backgroundImage: `url(${BgLogin})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            <Col span={6}>
                <Row align="center" style={{marginBottom: 10}}>
                    <Col>
                        <LogoSVG fill="#fff" style={{marginRight: 15}}/>
                        <TypoSVG fill="#fff"/>
                    </Col>
                </Row>
                <Card>
                    <Form
                        name="login"
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
                            <Input.Password value={password} onChange={e => setPassword(e.target.value)} size="large" placeholder="Password" prefix={<KeyOutlined />} />
                        </Form.Item>
                        <Form.Item>
                            <Row justify="space-between">
                                <Button type="link">Forgot your password?</Button>
                                <Button type="primary" htmlType="submit" onClick={login}>
                                    Login
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
    );
}

export default LoginPage;
