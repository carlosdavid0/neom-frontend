import React, { useEffect, useLayoutEffect, useState } from "react";
import { ReactDOM } from "react";
import { Layout, Menu, Breadcrumb, Typography, Row, Col, Popover } from "antd";
import { HomeOutlined, UserOutlined, KeyOutlined, IdcardOutlined, HddOutlined, CodeOutlined, LockOutlined, MacCommandOutlined } from '@ant-design/icons';
import md5 from 'crypto-js/md5';
import API from '../services/API';
import pkg from "../../package.json";
import Noty from 'noty';
import "noty/lib/noty.css";
import "noty/lib/themes/mint.css";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Link
} from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;
const emailMD5 = md5(localStorage.getItem('email'));

function HomePage(props) {

  const [popAvatar, setPopAvatar] = useState(false);
  const PageComponent = ( props ) => <div>{props.page}</div>;

  function logout() {
    API.post(`logout`, {
      token: localStorage.getItem('token')
    }).then((res) => {
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('id');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      window.location.replace('/login');
    }).catch((err) => {
      new Noty({
        type: 'error',
        text: err.response.data['message']
    }).show();
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
              content={<a onClick={logout}>Logout</a>}
              trigger="click"
              visible={popAvatar}
              onVisibleChange={() => setPopAvatar(!popAvatar) }
            >
              <img style={{ width: '3em', borderRadius: 100, cursor: 'pointer' }} src={`https://www.gravatar.com/avatar/${emailMD5}}`}/>
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
        </Sider>
        <Content style={{ padding: 20 }}>
          {props.page}
        </Content>
      </Layout>
    </Layout>
  );
}

export default HomePage;
