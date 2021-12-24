import React, { useEffect, useState } from "react";
import {Card, Typography, Row, Col, Table, Tag, Space, Button, notification, Popconfirm, Modal, Form, Input, Select, InputNumber} from 'antd';
import { CloseSquareOutlined, FormOutlined, PlusCircleOutlined, BranchesOutlined, ApiOutlined, FieldStringOutlined } from "@ant-design/icons";
import API from "../../services/API";

const { Title } = Typography;
const { Option } = Select;

function OltList() {

    const [oltsList, setOltsList] = useState([]);
    const [totalItems, setTotalItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [modalCreateVis, setModalCreateVis] = useState(false);
    const [modalEditVis, setModalEditVis] = useState(false);
    const [FormCreate] = Form.useForm();
    const [FormEdit] = Form.useForm();

    function refreshOlts(){
        API.get('/olts').then((res) => {
            let temp = [];
            res.data.map((olt, i) => {
                temp.push({
                    key: olt['id'],
                    name: olt['name'],
                    ip: olt['ip'],
                    vendor: olt['vendor'],
                    slots: olt['slots'],
                    pons: olt['pons']
                })
            });
            setOltsList(temp);
            setTotalItems(res.data.length);
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        });
    }

    useEffect(() => {
        refreshOlts();
    }, [])

    function removeOlt(id) {
        API.delete(`/olts/${id}`).then((res) => {
            notification.success({
                message: res.data['message']
            });
            refreshOlts();
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
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Slots',
            dataIndex: 'slots',
            key: 'slots',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'PONs',
            dataIndex: 'pons',
            key: 'pons',
            sorter: (a, b) => a.name.localeCompare(b.name),
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
                        FormEdit.setFieldsValue({ip: record['ip']});
                        FormEdit.setFieldsValue({vendor: record['vendor']});
                        FormEdit.setFieldsValue({slots: record['slots']});
                        FormEdit.setFieldsValue({pons: record['pons']});
                    }}>Edit</Button>
                    <Popconfirm
                        title={'Delete OLT?'}
                        onConfirm={() => removeOlt(record.key)}
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

    function newOlt() {
        API.post('olts', {
            name: FormCreate.getFieldValue('name'),
            ip: FormCreate.getFieldValue('ip'),
            vendor: FormCreate.getFieldValue('vendor'),
            slots: FormCreate.getFieldValue('slots'),
            pons: FormCreate.getFieldValue('pons'),
        }).then((res) => {
            notification.success({
                message: "OLT created"
            });
            refreshOlts();
            setModalCreateVis(false);
        }).catch((err) => {
            notification.error({
                message: err.response.data['message']
            });
        })
    }

    function editOlt() {
        API.patch(`olts/${FormEdit.getFieldValue('id')}`, {
            name: FormEdit.getFieldValue('name'),
            ip: FormEdit.getFieldValue('ip'),
            vendor: FormEdit.getFieldValue('vendor'),
            slots: FormEdit.getFieldValue('slots'),
            pons: FormEdit.getFieldValue('pons'),
        }).then((res) => {
            notification.success({
               message: res.data['message']
            });
            refreshOlts();
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
                        <Title level={2}>OLTs</Title>
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
                            dataSource={oltsList}
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
                title="Create OLT"
                visible={modalCreateVis}
                onCancel={() => setModalCreateVis(false)}
                footer={[
                    <Button key={'back'} onClick={() => setModalCreateVis(false)}>Cancel</Button>,
                    <Button key={'submit'} type={'primary'} onClick={newOlt}>Save</Button>
                ]}
            >
                <Form
                    form={FormCreate}
                    onFinish={newOlt}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Form.Item
                        name={'name'}
                        label={'Name'}
                        rules={[{required: true, message: 'Name is required'}]}
                    >
                        <Input placeholder={"Name"} suffix={<FieldStringOutlined />}/>
                    </Form.Item>
                    <Form.Item
                        name={'ip'}
                        label={'IP'}
                        rules={[{required: true, message: 'IP is required'}]}
                    >
                        <Input placeholder={"IP"} suffix={<ApiOutlined />}/>
                    </Form.Item>
                    <Form.Item
                        name={'slots'}
                        label={'Slots'}
                        rules={[{required: true, message: 'Slots is required'}]}
                    >
                        <InputNumber placeholder={"Slots"} suffix={<ApiOutlined />}/>
                    </Form.Item>
                    <Form.Item
                        name={'pons'}
                        label={'PONs'}
                        rules={[{required: true, message: 'PONs is required'}]}
                    >
                        <InputNumber placeholder={"PONs"} suffix={<ApiOutlined />}/>
                    </Form.Item>
                    <Form.Item
                        name={'vendor'}
                        label={'Vendor'}
                        rules={[{required: true, message: 'Vendor is required'}]}
                    >
                        <Select
                            placeholder="Vendor"
                            suffixIcon={<BranchesOutlined />}
                        >
                            <Option key="Nokia">Nokia</Option>
                            <Option key="Huawei">Huawei</Option>
                            <Option key="Datacom">Datacom</Option>
                            <Option key="Fiberhome">Fiberhome</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Edit OLT"
                visible={modalEditVis}
                onCancel={() => setModalEditVis(false)}
                footer={[
                    <Button key={'back'} onClick={() => setModalEditVis(false)}>Cancel</Button>,
                    <Button key={'submit'} type={'primary'} onClick={editOlt}>Save</Button>
                ]}
            >
                <Form
                    form={FormEdit}
                    onFinish={editOlt}
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
                        name={'ip'}
                        label={'IP'}
                        rules={[{required: true, message: 'IP is required'}]}
                    >
                        <Input placeholder={"IP"} suffix={<ApiOutlined />}/>
                    </Form.Item>
                    <Form.Item
                        name={'slots'}
                        label={'Slots'}
                        rules={[{required: true, message: 'Slots is required'}]}
                    >
                        <InputNumber placeholder={"Slots"} suffix={<ApiOutlined />}/>
                    </Form.Item>
                    <Form.Item
                        name={'pons'}
                        label={'PONs'}
                        rules={[{required: true, message: 'PONs is required'}]}
                    >
                        <InputNumber placeholder={"PONs"} suffix={<ApiOutlined />}/>
                    </Form.Item>
                    <Form.Item
                        name={'vendor'}
                        label={'Vendor'}
                        rules={[{required: true, message: 'Vendor is required'}]}
                    >
                        <Select
                            placeholder="Vendor"
                            suffixIcon={<BranchesOutlined />}
                        >
                            <Option key="Nokia">Nokia</Option>
                            <Option key="Huawei">Huawei</Option>
                            <Option key="Datacom">Datacom</Option>
                            <Option key="Fiberhome">Fiberhome</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Row>
    );
}

export default OltList;