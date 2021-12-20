import React, { useState } from "react";
import {Layout, Menu, Breadcrumb, Typography, Row, Col, Popover, notification, Button, Divider} from "antd";
import { HomeOutlined, UserOutlined, KeyOutlined, IdcardOutlined, HddOutlined, CodeOutlined, LockOutlined, MacCommandOutlined } from '@ant-design/icons';
import API from '../services/API';
import {
  Link, useNavigate
} from "react-router-dom";
import pkg from "../../package.json";
import getEmoji from 'get-random-emoji'

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

function HomePage(props) {

  const navigate = useNavigate();
  const [popAvatar, setPopAvatar] = useState(false);
  const [emoji, setEmoji] = useState(getEmoji())

  function logout() {
    API.post(`logout`, {
      token: localStorage.getItem('token')
    }).then((res) => {
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('id');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      navigate('/login');
    }).catch((err) => {
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('id');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      notification.error({
        message: err.response.data['message']
      });
      navigate('/login');
    });
  }

  return (
    <Layout style={{ height: '100%' }}>
      <Header>
        <Row justify="space-between">
          <Col>
            <span style={{ fontSize: '2em', color: 'white' }}>Neom</span>
          </Col>
          <Col span={1}>
            <Popover
              content={
                <Row>
                  <Col style={{ textAlign: 'center' }}>
                    <Text>{localStorage.getItem('name')} - {emoji}</Text><br/>
                    <Divider style={{ marginTop: 5, marginBottom: 10 }}/>
                    <Button onClick={logout} style={{ width: '100%' }}>Logout</Button>
                  </Col>
                </Row>
              }
              trigger="click"
              visible={popAvatar}
              onVisibleChange={() => setPopAvatar(!popAvatar) }
            >
              <img style={{ width: '3em', borderRadius: 100, cursor: 'pointer' }} src={`https://avatars.dicebear.com/api/micah/${localStorage.getItem('name')}.svg?b=%231a446b`}/>
            </Popover>
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider>
          <div className="logo"/>
          <Menu theme="dark" defaultSelectedKeys={props.idx}>
            <Menu.Item key="1" icon={<HomeOutlined/>}>
              <Link to={"/dashboard"}>Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined/>}>
              <Link to={"/users"}>Users</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<IdcardOutlined/>}>
              <Link to={"/roles"}>Roles</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<KeyOutlined/>}>
              <Link to={"/permissions"}>Permissions</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<HddOutlined/>}>
              <Link to={"/olts"}>OLTs</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<CodeOutlined/>}>
              <Link to={"/scripts"}>Scripts</Link>
            </Menu.Item>
            <Menu.Item key="7" icon={<LockOutlined/>}>
              <Link to={"/script-users"}>Script Users</Link>
            </Menu.Item>
            <Menu.Item key="8" icon={<MacCommandOutlined/>}>
              <Link to={"/vendors"}>Vendors</Link>
            </Menu.Item>
          </Menu>
          <Row justify='center' style={{ position: 'absolute', bottom: 10, width: '100%' }}>
            <Col style={{ textAlign: 'center' }}>
              <Text style={{ color: 'white', fontSize: '1em'}} level={5} code>Neom - v{pkg.version}</Text><br/>
              <Text style={{ color: 'white', fontSize: '0.9em'}} level={5} code>Made with ❤️ by Ernesto Muniz</Text>
            </Col>
          </Row>
        </Sider>
        <Content style={{ padding: 20 }}>
          {props.page}
        </Content>
      </Layout>
    </Layout>
  );
}

export default HomePage;
