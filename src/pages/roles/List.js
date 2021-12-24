import React, { useEffect, useState } from "react";
import {Card, Typography, Row, Col, Table, Tag, Space, Button, notification, Popconfirm, Modal, Form, Input, Select} from 'antd';
import { CloseSquareOutlined, FormOutlined, PlusCircleOutlined } from "@ant-design/icons";
import API from "../../services/API";

const { Title } = Typography;
const { Option } = Select;

function RoleList() {

    const [roleList, setRoleList] = useState([]);
    const [totalItems, setTotalItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [modalCreateVis, setModalCreateVis] = useState(false);
    const [modalEditVis, setModalEditVis] = useState(false);
    const [FormCreate] = Form.useForm();
    const [FormEdit] = Form.useForm();
    const [permissions, setPermissions] = useState([]);

    function refreshRoles(){
        API.get('/roles').then((res) => {
            let temp = [];
            res.data.map((role, i) => {
                temp.push({
                    key: role['id'],
                    name: role['name'],
                    permissions: role['permissions']
                })
            });
            setRoleList(temp);
            setTotalItems(res.data.length);
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        });
    }

    useEffect(() => {
        refreshRoles();
        API.get('permissions').then((res) => {
            let temp = [];
            res.data.map((permission) => {
                temp.push({
                    id: permission['id'],
                    name: permission['name']
                });
            })
            setPermissions(temp);
        });
    }, [])

    function removeRole(id) {
        API.delete(`/roles/${id}`).then((res) => {
            notification.success({
                message: res.data['message']
            });
            refreshRoles();
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
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            render: tags => (
                tags.map(tag => {
                    return(
                        <Tag color="blue" key={tag['id']}>
                            {tag['name']}
                        </Tag>
                    )
                })
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button size={'small'} type={'primary'} icon={<FormOutlined/>} onClick={() => {
                        setModalEditVis(true);
                        let temp = [];
                        record['permissions'].map((permission) => {
                            temp.push(`${permission['id']}`);
                        })
                        FormEdit.setFieldsValue({id: record['key']});
                        FormEdit.setFieldsValue({name: record['name']});
                        FormEdit.setFieldsValue({permissions: temp});
                    }}>Edit</Button>
                    <Popconfirm
                        title={'Delete role?'}
                        onConfirm={() => removeRole(record.key)}
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

    function newRole() {
        API.post('roles', {
            name: FormCreate.getFieldValue('name'),
            permissions: FormCreate.getFieldValue('permissions')
        }).then((res) => {
            notification.success({
                message: "Role created"
            });
            refreshRoles();
            setModalCreateVis(false);
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        })
    }

    function editRole() {
        API.patch(`roles/${FormEdit.getFieldValue('id')}`, {
            name: FormEdit.getFieldValue('name'),
            permissions: FormEdit.getFieldValue('permissions')
        }).then((res) => {
            notification.success({
               message: res.data['message']
            });
            refreshRoles();
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
                        <Title level={2}>Roles</Title>
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
                            dataSource={roleList}
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
                title="Create Role"
                visible={modalCreateVis}
                onCancel={() => setModalCreateVis(false)}
                footer={[
                    <Button key={'back'} onClick={() => setModalCreateVis(false)}>Cancel</Button>,
                    <Button key={'submit'} type={'primary'} onClick={newRole}>Save</Button>
                ]}
            >
                <Form
                    form={FormCreate}
                    initialValues={{ remember: true }}
                    onFinish={newRole}
                >
                    <Form.Item
                        name={'name'}
                        label={'Name'}
                        rules={[{required: true, message: 'Name is required'}]}
                        style={{ width:  400, margin: 20}}
                    >
                        <Input placeholder={"Name"}/>
                    </Form.Item>
                    <Form.Item
                        name={'permissions'}
                        label='Permissions'
                    >
                        <Select
                            placeholder='Permissions'
                            mode="multiple"
                        >
                            {permissions.map((permission) => {
                                return <Option key={permission.id}>{permission.name}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Edit Role"
                visible={modalEditVis}
                onCancel={() => setModalEditVis(false)}
                footer={[
                    <Button key={'back'} onClick={() => setModalEditVis(false)}>Cancel</Button>,
                    <Button key={'submit'} type={'primary'} onClick={editRole}>Save</Button>
                ]}
            >
                <Form
                    form={FormEdit}
                    layout={'inline'}
                    initialValues={{ remember: true }}
                    onFinish={editRole}
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
                        style={{ width: '45%', margin: 20}}
                    >
                        <Input placeholder={"Name"}/>
                    </Form.Item>
                    <Form.Item
                        name='permissions'
                        label='Permissions'
                        style={{ width: 300 }}
                    >
                        <Select
                            placeholder='Permissions'
                            mode="multiple"
                        >
                            {permissions.map((permission) => {
                                return <Option key={permission.id}>{permission.name}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Row>
    );
}

export default RoleList;