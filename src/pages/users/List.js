import React, { useEffect, useState } from "react";
import {Card, Typography, Row, Col, Table, Tag, Space, Button, notification, Popconfirm} from 'antd';
import { CloseSquareOutlined, FormOutlined, PlusCircleOutlined } from "@ant-design/icons";
import API from "../../services/API";
import { Link } from "react-router-dom";

const { Title } = Typography;

function UserList() {

    const [userList, setUserList] = useState([]);
    const [totalItems, setTotalItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [roles, setRoles] = useState([]);

    function refreshUsers(){
        API.get('/users').then((res) => {
            let temp = [];
            res.data.map((user, i) => {
                temp.push({
                    key: user['id'],
                    name: user['name'],
                    email: user['email'],
                    role: user['role_name']
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
                    <Link to={`/users/${record.key}`}><Button size={'small'} type={'primary'} icon={<FormOutlined/>}>Edit</Button></Link>
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

    return (
        <Row>
            <Col span={24}>
                <Row justify={'space-between'}>
                    <Col span={3}>
                        <Title level={2}>Users</Title>
                    </Col>
                    <Col span={3}>
                        <Link to={'/users/create'}><Button type={'primary'} style={{ marginTop: 10}} icon={<PlusCircleOutlined />}>Create New</Button></Link>
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
                                total: totalItems
                            }}
                            onChange={handleTableChange}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default UserList;