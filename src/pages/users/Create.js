import React, { useEffect, useState } from "react";
import {Card, Typography, Row, Col, Table, Tag, Form, Input, Select, Button, notification} from 'antd';
import { CloseSquareOutlined, FormOutlined } from "@ant-design/icons";
import API from "../../services/API";
import {Link, useNavigate} from "react-router-dom";
import { UserOutlined, KeyOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

function UserCreate(props) {

    const [roles, setRoles] = useState([{key: '0'}]);
    const [role, setRole] = useState();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    useEffect(() => {
        API.get('/roles').then((res) => {
           let temp = [];
           res.data.map((role) => {
               temp.push({
                   key: role['id'],
                   name: role['name']
               });
           });
           setRoles(temp);
        });
    }, [])

    function newUser(values) {
        API.post('users', {
            name: values.name,
            email: values.email,
            password: values.password,
            role_id: values.role
        }).then((res) => {
            notification.success({
                message: "User created"
            });
            navigate('/users');
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        })
    }

    return (
        <Row>
            <Col span={24}>
                <Title level={2}>Create User</Title>
                <Card>
                    <Row>
                        <Form
                            form={form}
                            layout={'inline'}
                            initialValues={{ remember: true }}
                            onFinish={newUser}
                        >
                            <Form.Item
                                name={'name'}
                                label={'Name'}
                                rules={[{required: true, message: 'Name is required'}]}
                                style={{ width: '45%', margin: 20}}
                            >
                                <Input prefix={<UserOutlined />} placeholder={"Name - The avatar will be generated based on it"}/>
                            </Form.Item>
                            <Form.Item
                                name={'email'}
                                label={'E-Mail'}
                                rules={[{required: true, message: 'E-Mail is required'}]}
                                style={{ width: '45%', margin: 20}}
                            >
                                <Input prefix={<MailOutlined />} placeholder={"E-Mail - Must be unique"}/>
                            </Form.Item>
                            <Form.Item
                                name={'password'}
                                label={'Password'}
                                rules={[{required: true, message: 'Password is required'}]}
                                style={{ width: '45%', margin: 20}}
                            >
                                <Input.Password prefix={<KeyOutlined />} placeholder={"Password - Strong please ☕️"}/>
                            </Form.Item>
                            <Form.Item
                                name={'role'}
                                label={'Role'}
                                rules={[{required: true, message: 'Role is required'}]}
                                style={{ width: '45%', margin: 20}}
                            >
                                <Select
                                    suffixIcon={<IdcardOutlined/>}
                                    placeholder={'Role'}
                                    onChange={e => setRole(e)}
                                    style={{ width: '100%' }}
                                >
                                    {roles.map((role) => <Option value={role['key']}>{role['name']}</Option>)}
                                </Select>
                            </Form.Item>
                            <Row style={{ width: '100%'}} justify={'end'}>
                                <Col span={5}>
                                    <Form.Item>
                                        <Link to={'/users'}><Button>Cancel</Button></Link>
                                        <Button type={'primary'} style={{ margin: 20 }} htmlType={'submit'}>Save</Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
}

export default UserCreate;