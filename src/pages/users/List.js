import React, { useEffect, useState } from "react";
import {Card, Typography, Row, Col, Table, Tag, Space, Button, notification, Popconfirm, Modal, Form, Input, Select} from 'antd';
import { CloseSquareOutlined, FormOutlined, PlusCircleOutlined, UserOutlined, MailOutlined, KeyOutlined, IdcardOutlined } from "@ant-design/icons";
import API from "../../services/API";

const { Title } = Typography;
const { Option } = Select;

function UserList() {

    const [userList, setUserList] = useState([]);
    const [totalItems, setTotalItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [userRoles, setUserRoles] = useState([]);
    const [roles, setRoles] = useState([]);
    const [role, setRole] = useState();
    const [modalCreateVis, setModalCreateVis] = useState(false);
    const [modalEditVis, setModalEditVis] = useState(false);
    const [FormCreate] = Form.useForm();
    const [FormEdit] = Form.useForm();

    function refreshUsers(){
        API.get('/users').then((res) => {
            let temp = [];
            res.data.map((user, i) => {
                temp.push({
                    key: user['id'],
                    name: user['name'],
                    email: user['email'],
                    role: user['role_name'],
                    role_id: user['role_id']
                })
            });
            setUserList(temp);
            setTotalItems(res.data.length);
            let roles = [];
            res.data.map((user) => roles.push(user['role_name']))
            let filteredRoles = roles.filter((elem, i) => roles.indexOf(elem) == i);
            roles = [];
            filteredRoles.map((role) => {
                roles.push({
                    text: role,
                    value: role
                });
            });
            setRoles(roles);
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        });
    }

    useEffect(() => {
        refreshUsers();
        API.get('/roles').then((res) => {
            let temp = [];
            res.data.map((role) => {
                temp.push({
                    key: role['id'],
                    name: role['name']
                });
            });
            setUserRoles(temp);
         });
    }, [])

    function removeUser(id) {
        API.delete(`/users/${id}`).then((res) => {
            notification.success({
                message: res.data['message']
            });
            refreshUsers();
        }).catch((err) => {
           notification.error({
               message: err.response.data['message']
           });
        });
    }

    function newUser() {
        API.post('users', {
            name: FormCreate.getFieldValue('name'),
            email: FormCreate.getFieldValue('email'),
            password: FormCreate.getFieldValue('password'),
            role_id: FormCreate.getFieldValue('role')
        }).then((res) => {
            notification.success({
                message: "User created"
            });
            refreshUsers();
            setModalCreateVis(false);
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        })
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'E-Mail',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: roles,
            onFilter: (value, record) => record.role.indexOf(value) === 0,
            render: role => <Tag color={'geekblue'} key={role}>{role}</Tag>
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button size={'small'} type={'primary'} icon={<FormOutlined/>} onClick={() => {
                        setModalEditVis(true);
                        FormEdit.setFieldsValue({
                            id: record['key'],
                            name: record['name'],
                            email: record['email'],
                            role: record['role_id'],
                        });
                    }}>Edit</Button>
                    <Popconfirm
                        title={'Delete user?'}
                        onConfirm={() => removeUser(record.key)}
                    >
                        <Button size={'small'} type={'danger'} icon={<CloseSquareOutlined/>}>Remove</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const handleTableChange = (page) => {
        setCurrentPage(page.current);
    }

    function editUser() {
        API.patch(`users/${FormEdit.getFieldValue('id')}`, {
            name: FormEdit.getFieldValue('name'),
            email: FormEdit.getFieldValue('email'),
            password: FormEdit.getFieldValue('password'),
            role_id: FormEdit.getFieldValue('role')
        }).then((res) => {
            notification.success({
               message: res.data['message']
            });
            if (FormEdit.getFieldValue('id') == localStorage.getItem('id')) {
                API.get(`users/${FormEdit.getFieldValue('id')}`).then((res) => {
                    localStorage.setItem('name', res.data['name']);
                    localStorage.setItem('email', res.data['email']);
                    localStorage.setItem('role', res.data['role']);
                })
            }
            refreshUsers();
            setModalEditVis(false);
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        });
    }

    return (
        <Row>
            <Col span={24}>
                <Row justify={'space-between'}>
                    <Col span={3}>
                        <Title level={2}>Users</Title>
                    </Col>
                    <Col span={3}>
                        <Button type={'primary'} style={{ marginTop: 10}} icon={<PlusCircleOutlined />} onClick={() => setModalCreateVis(true)}>Create New</Button>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Row>
                    <Col span={24}>
                        <Table
                            columns={columns}
                            dataSource={userList}
                            pagination={{
                                current: currentPage,
                                pageSize: 5,
                                total: totalItems,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                            }}
                            onChange={handleTableChange}
                        />
                    </Col>
                </Row>
            </Col>
            <Modal
                title="Create User"
                visible={modalCreateVis}
                onCancel={() => setModalCreateVis(false)}
                footer={[
                    <Button key={'back'} onClick={() => setModalCreateVis(false)}>Cancel</Button>,
                    <Button key={'submit'} type={'primary'} onClick={newUser}>Save</Button>
                ]}
            >
                <Form
                    form={FormCreate}
                    onFinish={newUser}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Form.Item
                        name={'name'}
                        label={'Name'}
                        rules={[{required: true, message: 'Name is required'}]}
                    >
                        <Input prefix={<UserOutlined />} placeholder={"Name - The avatar will be generated based on it"}/>
                    </Form.Item>
                    <Form.Item
                        name={'email'}
                        label={'E-Mail'}
                        rules={[{required: true, message: 'E-Mail is required'}]}
                    >
                        <Input prefix={<MailOutlined />} placeholder={"E-Mail - Must be unique"}/>
                    </Form.Item>
                    <Form.Item
                        name={'password'}
                        label={'Password'}
                        rules={[{required: true, message: 'Password is required'}]}
                    >
                        <Input.Password prefix={<KeyOutlined />} placeholder={"Password - Strong please ☕️"}/>
                    </Form.Item>
                    <Form.Item
                        name={'role'}
                        label={'Role'}
                        rules={[{required: true, message: 'Role is required'}]}
                    >
                        <Select
                            suffixIcon={<IdcardOutlined/>}
                            placeholder={'Role'}
                            onChange={e => setRole(e)}
                            style={{ width: '100%' }}
                        >
                            {userRoles.map((role) => <Option value={role['key']}>{role['name']}</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Edit User"
                visible={modalEditVis}
                onCancel={() => setModalEditVis(false)}
                footer={[
                    <Button key={'back'} onClick={() => setModalEditVis(false)}>Cancel</Button>,
                    <Button key={'submit'} type={'primary'} onClick={editUser}>Save</Button>
                ]}
            >
                <Form
                    form={FormEdit}
                    onFinish={editUser}
                >
                    <Form.Item
                        name={'id'}
                        hidden
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name={'name'}
                        label={'Name'}
                        rules={[{required: true, message: 'Name is required'}]}
                    >
                        <Input prefix={<UserOutlined />} placeholder={"Name - The avatar will be generated based on it"}/>
                    </Form.Item>
                    <Form.Item
                        name={'email'}
                        label={'E-Mail'}
                        rules={[{required: true, message: 'E-Mail is required'}]}
                    >
                        <Input prefix={<MailOutlined />} placeholder={"E-Mail - Must be unique"}/>
                    </Form.Item>
                    <Form.Item
                        name={'password'}
                        label={'Password'}
                    >
                        <Input.Password prefix={<KeyOutlined />} placeholder={"Password - Leave blank if you don't want change it"}/>
                    </Form.Item>
                    <Form.Item
                        name={'role'}
                        label={'Role'}
                        rules={[{required: true, message: 'Role is required'}]}
                    >
                        <Select
                            placeholder="Role"
                            suffixIcon={<IdcardOutlined/>}
                        >
                            {userRoles.map((role) => <Option value={role['key']}>{role['name']}</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Row>
    );
}

export default UserList;