import React, { useEffect, useState } from "react";
import {Card, Typography, Row, Col, Table, Tag, Space, Button, notification, Popconfirm, Modal, Form, Input} from 'antd';
import { CloseSquareOutlined, FormOutlined, PlusCircleOutlined } from "@ant-design/icons";
import API from "../../services/API";
import { Link } from "react-router-dom";

const { Title } = Typography;

function PermissionList() {

    const [permissionList, setPermissionList] = useState([]);
    const [totalItems, setTotalItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [modalCreateVis, setModalCreateVis] = useState(false);
    const [modalEditVis, setModalEditVis] = useState(false);
    const [FormCreate] = Form.useForm();
    const [FormEdit] = Form.useForm();

    function refreshPermissions(){
        API.get('/permissions').then((res) => {
            let temp = [];
            res.data.map((permission, i) => {
                temp.push({
                    key: permission['id'],
                    name: permission['name']
                })
            });
            setPermissionList(temp);
            setTotalItems(res.data.length);
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        });
    }

    useEffect(() => {
        refreshPermissions();
    }, [])

    function removePermission(id) {
        API.delete(`/permissions/${id}`).then((res) => {
            notification.success({
                message: res.data['message']
            });
            refreshPermissions();
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
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button size={'small'} type={'primary'} icon={<FormOutlined/>} onClick={() => {
                        setModalEditVis(true);
                        FormEdit.setFieldsValue({id: record['key']});
                        FormEdit.setFieldsValue({name: record['name']});
                    }}>Edit</Button>
                    <Popconfirm
                        title={'Delete permission?'}
                        onConfirm={() => removePermission(record.key)}
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

    function newPermission() {
        API.post('permissions', {
            name: FormCreate.getFieldValue('name')
        }).then((res) => {
            notification.success({
                message: "Permission created"
            });
            refreshPermissions();
            setModalCreateVis(false);
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        })
    }

    function editPermission() {
        API.patch(`permissions/${FormEdit.getFieldValue('id')}`, {
            name: FormEdit.getFieldValue('name')
        }).then((res) => {
            notification.success({
               message: res.data['message']
            });
            refreshPermissions();
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
                            dataSource={permissionList}
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
                title="Create Permission"
                visible={modalCreateVis}
                onCancel={() => setModalCreateVis(false)}
                footer={[
                    <Button key={'back'} onClick={() => setModalCreateVis(false)}>Cancel</Button>,
                    <Button key={'submit'} type={'primary'} onClick={newPermission}>Save</Button>
                ]}
            >
                <Form
                    form={FormCreate}
                    onFinish={newPermission}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Form.Item
                        name={'name'}
                        label={'Name'}
                        rules={[{required: true, message: 'Name is required'}]}
                        style={{ width:  400, margin: 20}}
                    >
                        <Input placeholder={"Name"}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Edit Permission"
                visible={modalEditVis}
                onCancel={() => setModalEditVis(false)}
                footer={[
                    <Button key={'back'} onClick={() => setModalEditVis(false)}>Cancel</Button>,
                    <Button key={'submit'} type={'primary'} onClick={editPermission}>Save</Button>
                ]}
            >
                <Form
                    form={FormEdit}
                    onFinish={editPermission}
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
                </Form>
            </Modal>
        </Row>
    );
}

export default PermissionList;