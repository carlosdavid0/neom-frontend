import React, { useEffect, useState } from "react";
import {Card, Typography, Row, Col, Table, Tag, Form, Input, Select, Button, notification} from 'antd';
import { CloseSquareOutlined, FormOutlined } from "@ant-design/icons";
import API from "../../services/API";
import {Link, useNavigate, useParams} from "react-router-dom";
import { UserOutlined, KeyOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

function UserEdit() {

    let params = useParams();
    const navigate = useNavigate();
    const [roles, setRoles] = useState([{key: '0'}]);
    const [userID, setUserID] = useState();
    const [role, setRole] = useState();
    const [form] = Form.useForm();

    useEffect(() => {
        API.get(`users/${params.id}`).then((res) => {
            setUserID(res.data['id']);
            form.setFieldsValue({ name: res.data['name']});
            form.setFieldsValue({ email: res.data['email']});
            form.setFieldsValue({ role: res.data['role_id']});
        });
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

    function editUser(values) {
        API.patch(`users/${userID}`, {
            name: values.name,
            email: values.email,
            password: values.password,
            role_id: values.role
        }).then((res) => {
            notification.success({
               message: res.data['message']
            });
            if (userID == localStorage.getItem('id')) {
                API.get(`users/${userID}`).then((res) => {
                    localStorage.setItem('name', res.data['name']);
                    localStorage.setItem('email', res.data['email']);
                    localStorage.setItem('role', res.data['role']);
                })
            }
            navigate('/users');
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        });
    }

    return (
        <Row>
            <Col span={24}>
                <Title level={2}>Edit User</Title>
                <Card>
                    <Row>
                        <Form
                            form={form}
                            layout={'inline'}
                            initialValues={{ remember: true }}
                            onFinish={editUser}
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
                                style={{ width: '45%', margin: 20}}
                            >
                                <Input.Password prefix={<KeyOutlined />} placeholder={"Password - Leave blank if you don't want change it"}/>
                            </Form.Item>
                            <Form.Item
                                name={'role'}
                                label={'Role'}
                                rules={[{required: true, message: 'Role is required'}]}
                                style={{ width: '45%', margin: 20}}
                            >
                                <Select
                                    suffixIcon={<IdcardOutlined/>}
                                    value={role}
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

export default UserEdit;