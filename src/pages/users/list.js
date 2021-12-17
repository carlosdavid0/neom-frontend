import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Table, Tag, Space } from 'antd';
import { CloseSquareOutlined, FormOutlined } from "@ant-design/icons";
import API from "../../services/API";
import { Link } from "react-router-dom";

const { Title } = Typography;

function UserList() {

    const [userList, setUserList] = useState([]);

    useEffect(() => {
        API.get('/users').then((res) => {
            let temp = [];
            res.data.map((user, i) => {
                temp.push({
                    key: i,
                    name: user['name'],
                    email: user['email'],
                    role: user['role_name']
                })
            });
            setUserList(temp);
        });
    }, [])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'E-Mail',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: role => <Tag color={'geekblue'} key={role}>{role}</Tag>
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Link to={'#'}><Tag color={'purple'} icon={<FormOutlined/>}>Edit</Tag></Link>
                    <Link to={'#'}><Tag color={'red'} icon={<CloseSquareOutlined/>}> Remove</Tag></Link>
                </Space>
            )
        }
    ];

    return (
        <Row>
            <Col span={24}>
                <Title level={2}>Users</Title>
                <Table columns={columns} dataSource={userList}/>
            </Col>
        </Row>
    );
}

export default UserList;