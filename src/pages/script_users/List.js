import React, { useEffect, useState } from "react";
import {Card, Typography, Row, Col, Table, Tag, Space, Button, notification, Popconfirm, Modal, Form, Input} from 'antd';
import { CloseSquareOutlined, FormOutlined, PlusCircleOutlined, FieldStringOutlined, UserOutlined, KeyOutlined } from "@ant-design/icons";
import API from "../../services/API";
import { Link } from "react-router-dom";

const { Title } = Typography;

function ScriptUserList() {

    const [scriptUserList, setScriptUserList] = useState([]);
    const [totalItems, setTotalItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [modalCreateVis, setModalCreateVis] = useState(false);
    const [modalEditVis, setModalEditVis] = useState(false);
    const [FormCreate] = Form.useForm();
    const [FormEdit] = Form.useForm();

    function refreshScriptUSers(){
        API.get('/script-users').then((res) => {
            let temp = [];
            res.data.map((permission, i) => {
                temp.push({
                    key: permission['id'],
                    name: permission['name'],
                    username: permission['username']
                })
            });
            setScriptUserList(temp);
            setTotalItems(res.data.length);
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        });
    }

    useEffect(() => {
        refreshScriptUSers();
    }, [])

    function removeScriptUser(id) {
        API.delete(`/permissions/${id}`).then((res) => {
            notification.success({
                message: res.data['message']
            });
            refreshScriptUSers();
        }).catch((err) => {
           notification.error({
               message: err.response.data['message']
           });
        });
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button size={'small'} type={'primary'} icon={<FormOutlined/>} onClick={() => {
                        setModalEditVis(true);
                        FormEdit.setFieldsValue({id: record['key']});
                        FormEdit.setFieldsValue({name: record['name']});
                        FormEdit.setFieldsValue({username: record['username']});
                        FormEdit.setFieldsValue({password: record['password']});
                    }}>Edit</Button>
                    <Popconfirm
                        title={'Delete Script User?'}
                        onConfirm={() => removeScriptUser(record.key)}
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

    function newScriptUser() {
        API.post('script-users', {
            name: FormCreate.getFieldValue('name'),
            username: FormCreate.getFieldValue('username'),
            password: FormCreate.getFieldValue('password')
        }).then((res) => {
            notification.success({
                message: "Script User created"
            });
            refreshScriptUSers();
            setModalCreateVis(false);
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        })
    }

    function editScriptUser() {
        API.patch(`script-users/${FormEdit.getFieldValue('id')}`, {
            name: FormEdit.getFieldValue('name'),
            username: FormEdit.getFieldValue('username'),
            password: FormEdit.getFieldValue('password'),
        }).then((res) => {
            notification.success({
               message: res.data['message']
            });
            refreshScriptUSers();
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
                    <Col span={4}>
                        <Title level={2}>Permissions</Title>
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
                            dataSource={scriptUserList}
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
                title="Create Script User"
                visible={modalCreateVis}
                onCancel={() => setModalCreateVis(false)}
                footer={[
                    <Button key={'back'} onClick={() => setModalCreateVis(false)}>Cancel</Button>,
                    <Button key={'submit'} type={'primary'} onClick={newScriptUser}>Save</Button>
                ]}
            >
                <Form
                    form={FormCreate}
                    onFinish={newScriptUser}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Form.Item
                        name={'name'}
                        label={'Name'}
                        rules={[{required: true, message: 'Name is required'}]}
                    >
                        <Input suffix={<FieldStringOutlined/>} placeholder={"Name"}/>
                    </Form.Item>
                    <Form.Item
                        name={'username'}
                        label={'Username'}
                        rules={[{required: true, message: 'Username is required'}]}
                    >
                        <Input suffix={<UserOutlined/>} placeholder={"Username"}/>
                    </Form.Item>
                    <Form.Item
                        name={'password'}
                        label={'Password'}
                        rules={[{required: true, message: 'Password is required'}]}
                    >
                        <Input.Password placeholder={"Password"}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Edit Script User"
                visible={modalEditVis}
                onCancel={() => setModalEditVis(false)}
                footer={[
                    <Button key={'back'} onClick={() => setModalEditVis(false)}>Cancel</Button>,
                    <Button key={'submit'} type={'primary'} onClick={editScriptUser}>Save</Button>
                ]}
            >
                <Form
                    form={FormEdit}
                    onFinish={editScriptUser}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
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
                        <Input placeholder={"Name"}/>
                    </Form.Item>
                    <Form.Item
                        name={'username'}
                        label={'Username'}
                        rules={[{required: true, message: 'Username is required'}]}
                    >
                        <Input suffix={<UserOutlined/>} placeholder={"Username"}/>
                    </Form.Item>
                    <Form.Item
                        name={'password'}
                        label={'Password'}
                        rules={[{required: true, message: 'Password is required'}]}
                    >
                        <Input.Password placeholder={"Password"}/>
                    </Form.Item>
                </Form>
            </Modal>
        </Row>
    );
}

export default ScriptUserList;