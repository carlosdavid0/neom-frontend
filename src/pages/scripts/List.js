import React, { useEffect, useState } from "react";
import {Card, Typography, Row, Col, Table, Tag, Space, Button, notification, Popconfirm, Modal, Form, Input, Select, InputNumber} from 'antd';
import { CloseSquareOutlined, FormOutlined, PlusCircleOutlined, FieldStringOutlined, UserOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import API from "../../services/API";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

function ScriptList() {

    const [scriptList, setScriptList] = useState([]);
    const [scriptUserList, setScriptUserList] = useState([]);
    const [scriptUserModalList, setScriptUserModalList] = useState([]);
    const [totalItems, setTotalItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [modalCreateVis, setModalCreateVis] = useState(false);
    const [modalEditVis, setModalEditVis] = useState(false);
    const [FormCreate] = Form.useForm();
    const [FormEdit] = Form.useForm();
    const [fields, setFields] = useState([]);

    function refreshScript(){
        API.get('/scripts').then((res) => {
            let temp = [];
            res.data.map((script, i) => {
                temp.push({
                    key: script['id'],
                    name: script['name'],
                    protocol: script['protocol'],
                    port: script['port'],
                    script_user_id: script['script_user_id'],
                    vendor: script['vendor'],
                    steps: script['steps']
                })
            });
            setScriptList(temp);
            setTotalItems(res.data.length);
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        });
    }

    useEffect(() => {
        refreshScript();
        API.get('script-users').then((res) => {
            let temp = res.data.reduce((acc, item) => {
                acc[item['id']] = item['name'];
                return acc;
            }, {});
            setScriptUserList(temp);
            temp = [];
            res.data.map((script_user) => {
                temp.push({
                    key: script_user['id'],
                    text: script_user['name']
                });
            });
            setScriptUserModalList(temp);
        });
    }, [])

    function removeScript(id) {
        API.delete(`/permissions/${id}`).then((res) => {
            notification.success({
                message: res.data['message']
            });
            refreshScript();
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
            title: 'Protocol',
            dataIndex: 'protocol',
            key: 'protocol',
            filters: [
                {
                    text: 'SSH',
                    value: 'ssh'
                },
                {
                    text: 'TELNET',
                    value: 'telnet'
                }
            ],
            onFilter: (value, record) => record.protocol.indexOf(value) === 0,
            render: vendor => {
                if (vendor == 'ssh') {
                    return <Tag color={'purple'} key={vendor}>{vendor.toUpperCase()}</Tag>
                } 
                if (vendor == 'telnet') {
                    return <Tag color={'volcano'} key={vendor}>{vendor.toUpperCase()}</Tag>
                }
            }
        },
        {
            title: 'Port',
            dataIndex: 'port',
            key: 'port',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Script User',
            dataIndex: 'script_user_id',
            key: 'script_user_id',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (script_user) => <Tag>{scriptUserList[script_user]}</Tag>
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            key: 'vendor',
            filters: [
                {
                    text: 'Nokia',
                    value: 'Nokia'
                },
                {
                    text: 'Huawei',
                    value: 'Huawei'
                },
                {
                    text: 'Datacom',
                    value: 'Datacom'
                },
                {
                    text: 'Fiberhome',
                    value: 'Fiberhome'
                }
            ],
            onFilter: (value, record) => record.vendor.indexOf(value) === 0,
            render: vendor => {
                if (vendor == 'Nokia') {
                    return <Tag color={'purple'} key={vendor}>{vendor}</Tag>
                } 
                if (vendor == 'Huawei') {
                    return <Tag color={'volcano'} key={vendor}>{vendor}</Tag>
                }
                if (vendor == 'Datacom') {
                    return <Tag color={'blue'} key={vendor}>{vendor}</Tag>
                }
                if (vendor == 'Fiberhome') {
                    return <Tag color={'gold'} key={vendor}>{vendor}</Tag>
                }
            }
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
                        onConfirm={() => removeScript(record.key)}
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

    function newScript() {
        console.log(FormCreate.getFieldsValue());
        // API.post('script-users', {
        //     name: FormCreate.getFieldValue('name'),
        //     username: FormCreate.getFieldValue('username'),
        //     password: FormCreate.getFieldValue('password')
        // }).then((res) => {
        //     notification.success({
        //         message: "Script User created"
        //     });
        //     refreshScript();
        //     setModalCreateVis(false);
        // }).catch((err) => {
        //     notification.error({
        //         message: err.response.data['message']
        //     });
        // })
    }

    function editScript() {
        API.patch(`script-users/${FormEdit.getFieldValue('id')}`, {
            name: FormEdit.getFieldValue('name'),
            username: FormEdit.getFieldValue('username'),
            password: FormEdit.getFieldValue('password'),
        }).then((res) => {
            notification.success({
               message: res.data['message']
            });
            refreshScript();
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
                        <Title level={2}>Scripts</Title>
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
                            dataSource={scriptList}
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
                title="Create Script"
                visible={modalCreateVis}
                onCancel={() => setModalCreateVis(false)}
                footer={[
                    <Button key={'back'} onClick={() => setModalCreateVis(false)}>Cancel</Button>,
                    <Button key={'submit'} type={'primary'} onClick={newScript}>Save</Button>
                ]}
                width={'70%'}
            >
                <Form
                    form={FormCreate}
                    onFinish={newScript}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 24 }}
                >
                    <Row justify="center">
                        <Col span={16}>
                            <Form.Item
                                name={'name'}
                                label={'Name'}
                                rules={[{required: true, message: 'Name is required'}]}
                            >
                                <Input suffix={<FieldStringOutlined/>} placeholder={"Name"}/>
                            </Form.Item>
                            <Form.Item
                                name={'protocol'}
                                label={'Protocol'}
                                rules={[{required: true, message: 'Protocol is required'}]}
                            >
                                <Select
                                    placeholder='Protocol'
                                >
                                    <Option key='ssh'>SSH</Option>
                                    <Option key='telnet'>TELNET</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'port'}
                                label={'Port'}
                                rules={[{required: true, message: 'Port is required'}]}
                            >
                                <InputNumber placeholder={"Port"}/>
                            </Form.Item>
                            <Form.Item
                                name={'script_user'}
                                label={'Script User'}
                                rules={[{required: true, message: 'Port is required'}]}
                            >
                                <Select
                                    placeholder='Script User'
                                >
                                    {scriptUserModalList.map((script_user) => <Option key={script_user['key']}>{script_user['text']}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'vendor'}
                                label={'Vendor'}
                                rules={[{required: true, message: 'Vendor is required'}]}
                            >
                                <Select
                                    placeholder="Vendor"
                                >
                                    <Option key="Nokia">Nokia</Option>
                                    <Option key="Huawei">Huawei</Option>
                                    <Option key="Datacom">Datacom</Option>
                                    <Option key="Fiberhome">Fiberhome</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'variables'}
                                label={'Variables'}
                                rules={[{required: true, message: 'Variables is required'}]}
                            >
                                <Input suffix={<FieldStringOutlined/>} placeholder={"Name"}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Card title='Script Steps'>
                        <Form.List
                            name="steps"
                        >
                            {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Row key={key} style={{ marginBottom: 16 }} justify="middle">
                                    <Col span={6} style={{ marginRight: 10 }}>
                                        <Form.Item
                                        name={[name, 'first']}
                                        fieldKey={[fieldKey, 'first']}
                                        rules={[{ required: true, message: 'Missing first name' }]}
                                        style={{ margin: 0 }}
                                        >
                                            <Input placeholder="Expect" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={17} style={{ marginRight: 10 }}>
                                        <Form.Item
                                        name={[name, 'last']}
                                        fieldKey={[fieldKey, 'last']}
                                        rules={[{ required: true, message: 'Missing last name' }]}
                                        style={{ margin: 0 }}
                                        >
                                            <Input placeholder="Execute" />
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Col>
                                </Row>
                                ))}
                                <Form.Item style={{ width: '100%' }}>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ width: '100%' }}>
                                    Add Step
                                </Button>
                                </Form.Item>
                            </>
                            )}
                        </Form.List>
                    </Card>
                </Form>
            </Modal>
            <Modal
                title="Edit Script"
                visible={modalEditVis}
                onCancel={() => setModalEditVis(false)}
                footer={[
                    <Button key={'back'} onClick={() => setModalEditVis(false)}>Cancel</Button>,
                    <Button key={'submit'} type={'primary'} onClick={editScript}>Save</Button>
                ]}
            >
                <Form
                    form={FormEdit}
                    onFinish={editScript}
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

export default ScriptList;