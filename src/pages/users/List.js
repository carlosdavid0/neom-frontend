import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Table, Tag, Space, Button, notification, Popconfirm, Modal, Form, Input, Select } from 'antd';
import { CloseSquareOutlined, FormOutlined, PlusCircleOutlined, UserOutlined, MailOutlined, KeyOutlined, IdcardOutlined, SearchOutlined } from "@ant-design/icons";
import API from "../../services/API";
import { useTranslation } from "react-i18next";

const { Title } = Typography;
const { Option } = Select;

function UserList() {

  const [list, setList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [totalItems, setTotalItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [userRoles, setUserRoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalCreateVis, setModalCreateVis] = useState(false);
  const [modalEditVis, setModalEditVis] = useState(false);
  const [FormCreate] = Form.useForm();
  const [FormEdit] = Form.useForm();
  const [tableLoad, setTableLoad] = useState(true)
  const [search, setSearch] = useState('')
  const [t] = useTranslation('common')

  function refreshUsers() {
    setTableLoad(true)
    API.get('/users').then((res) => {
      setList(res.data);
      setUserList(res.data);
      setTotalItems(res.data.length);
      let roles = [];
      res.data.map((user) => roles.push(user['role_name']))
      let filteredRoles = roles.filter((elem, i) => roles.indexOf(elem) === i);
      roles = filteredRoles.map((role) => {
        return {
          text: role,
          value: role
        }
      });
      setRoles(roles);
      setTableLoad(false)
    }).catch((err) => {
      notification.error({
        message: err.response.data['message']
      });
      setTableLoad(false)
    });
  }

  useEffect(() => {
    refreshUsers();
    API.get('/roles').then((res) => {
      let temp = res.data.map((role) => {
        return {
          key: role['id'],
          name: role['name']
        }
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
      title: t('texts.name'),
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
      title: t('texts.role'),
      dataIndex: 'role_name',
      key: 'role_name',
      filters: roles,
      onFilter: (value, record) => record.role.indexOf(value) === 0,
      render: role => <Tag color={'geekblue'} key={role}>{role}</Tag>
    },
    {
      title: t('texts.action'),
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button size={'small'} type={'primary'} icon={<FormOutlined />} onClick={() => {
            setModalEditVis(true);
            FormEdit.setFieldsValue({
              id: record['id'],
              name: record['name'],
              email: record['email'],
              role: record['role_id'],
            });
          }}>{t('actions.edit')}</Button>
          <Popconfirm
            title={t('questions.remove_user')}
            onConfirm={() => removeUser(record.id)}
          >
            <Button size={'small'} type={'danger'} icon={<CloseSquareOutlined />}>{t('actions.remove')}</Button>
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
      if (FormEdit.getFieldValue('id') === localStorage.getItem('id')) {
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
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row justify={'space-between'} align='middle'>
          <Col span={3}>
            <Title style={{ margin: 0 }} level={2}>{t('panel.users')}</Title>
          </Col>
          <Col span={10}>
            <Row align="middle" gutter={16} style={{ width: '100%' }}>
              <Col span={16}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder={t('actions.search')}
                  value={search}
                  onChange={e => {
                    const currValue = e.target.value;
                    setSearch(currValue);
                    const filteredData = list.filter(entry =>
                      entry.name.toLowerCase().includes(currValue.toLowerCase())
                    );
                    setUserList(filteredData);
                  }}
                />
              </Col>
              <Col span={8}>
                <Button style={{ width: '100%' }} type={'primary'} icon={<PlusCircleOutlined />} onClick={() => setModalCreateVis(true)}>{t('actions.create_new')}</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <Table
              rowKey={'id'}
              className="ant-table-rounded ant-table-shadow"
              columns={columns}
              dataSource={userList}
              loading={tableLoad}
              pagination={{
                current: currentPage,
                pageSize: 10,
                total: totalItems,
                showTotal: (total, range) => `${range[0]}-${range[1]} ${t('texts.of').toLocaleLowerCase()} ${total} ${t('texts.items').toLocaleLowerCase()}`
              }}
              onChange={handleTableChange}
            />
          </Col>
        </Row>
      </Col>
      <Modal
        title={`${t('actions.create')} ${t('texts.user')}`}
        visible={modalCreateVis}
        onCancel={() => setModalCreateVis(false)}
        footer={[
          <Button key={'back'} onClick={() => setModalCreateVis(false)}>{t('texts.cancel')}</Button>,
          <Button key={'submit'} type={'primary'} onClick={newUser}>{t('texts.save')}</Button>
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
            label={t('texts.name')}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input prefix={<UserOutlined />} placeholder={t('placeholder.name')} />
          </Form.Item>
          <Form.Item
            name={'email'}
            label={'E-Mail'}
            rules={[{ required: true, message: 'E-Mail is required' }]}
          >
            <Input prefix={<MailOutlined />} placeholder={t('placeholder.email')} />
          </Form.Item>
          <Form.Item
            name={'password'}
            label={t('texts.password')}
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder={t('placeholder.password')} />
          </Form.Item>
          <Form.Item
            name={'role'}
            label={t('texts.role')}
            rules={[{ required: true, message: 'Role is required' }]}
          >
            <Select
              suffixIcon={<IdcardOutlined />}
              placeholder={t('texts.role')}
              style={{ width: '100%' }}
            >
              {userRoles.map((role) => <Option key={role.key} value={role['key']}>{role['name']}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={`${t('actions.edit')} ${t('texts.user')}`}
        visible={modalEditVis}
        onCancel={() => setModalEditVis(false)}
        footer={[
          <Button key={'back'} onClick={() => setModalEditVis(false)}>{t('texts.cancel')}</Button>,
          <Button key={'submit'} type={'primary'} onClick={editUser}>{t('texts.save')}</Button>
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
            <Input />
          </Form.Item>
          <Form.Item
            name={'name'}
            label={t('texts.name')}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input prefix={<UserOutlined />} placeholder={t('placeholder.name')} />
          </Form.Item>
          <Form.Item
            name={'email'}
            label={'E-Mail'}
            rules={[{ required: true, message: 'E-Mail is required' }]}
          >
            <Input prefix={<MailOutlined />} placeholder={t('placeholder.email')} />
          </Form.Item>
          <Form.Item
            name={'password'}
            label={t('texts.password')}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder={t('placeholder.password_edit')} />
          </Form.Item>
          <Form.Item
            name={'role'}
            label={t('texts.role')}
            rules={[{ required: true, message: 'Role is required' }]}
          >
            <Select
              placeholder="Role"
              suffixIcon={<IdcardOutlined />}
            >
              {userRoles.map((role) => <Option key={role.key} value={role['key']}>{role['name']}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
}

export default UserList;