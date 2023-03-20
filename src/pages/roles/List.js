import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Table, Tag, Space, Button, notification, Popconfirm, Modal, Form, Input, Select, Checkbox } from 'antd';
import { CloseSquareOutlined, FormOutlined, PlusCircleOutlined } from "@ant-design/icons";
import API from "../../services/API";
import { useTranslation } from "react-i18next";

const { Title } = Typography;
const { Option } = Select;

function RoleList() {

  const [olts, setOlts] = useState([])
  const [roleList, setRoleList] = useState([]);
  const [totalItems, setTotalItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [modalCreateVis, setModalCreateVis] = useState(false);
  const [modalEditVis, setModalEditVis] = useState(false);
  const [FormCreate] = Form.useForm();
  const [FormEdit] = Form.useForm();
  const [permissions, setPermissions] = useState([]);
  const [t] = useTranslation('common')

  function refreshRoles() {
    API.get('/roles').then((res) => {
      let temp = res.data.map((role, i) => {
        return {
          key: role['id'],
          name: role['name'],
          permissions: role['permissions'],
          olts: role['olts']
        }
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
      let temp = res.data.map((permission) => {
        return {
          id: permission['id'],
          name: permission['name']
        }
      })
      setPermissions(temp);
    });
    API.get('olts').then((res) => {
      let temp = res.data.map((permission) => {
        return {
          value: permission['id'],
          label: permission['name']
        }
      })
      setOlts(temp);
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
      title: t('tables.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('panel.permissions'),
      dataIndex: 'permissions',
      key: 'permissions',
      render: tags => (
        tags.map(tag => {
          return (
            <Tag color="blue" key={tag['id']}>
              {tag['name']}
            </Tag>
          )
        })
      )
    },
    {
      title: t('texts.action'),
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button size={'small'} type={'primary'} icon={<FormOutlined />} onClick={() => {
            setModalEditVis(true);
            let temp = record['permissions'].map((permission) => {
              return `${permission['id']}`
            })
            FormEdit.setFieldsValue({ id: record['key'] });
            FormEdit.setFieldsValue({ name: record['name'] });
            FormEdit.setFieldsValue({ permissions: temp });
            FormEdit.setFieldsValue({ olts: record.olts.map(i => i.id) });
          }}>{t('actions.edit')}</Button>
          <Popconfirm
            title={t('questions.remove_role')}
            onConfirm={() => removeRole(record.key)}
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

  function newRole() {
    API.post('roles', {
      name: FormCreate.getFieldValue('name'),
      permissions: FormCreate.getFieldValue('permissions'),
      olts: FormCreate.getFieldValue('olts')
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
      permissions: FormEdit.getFieldValue('permissions'),
      olts: FormEdit.getFieldValue('olts')
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
            <Title level={2}>{t('panel.roles')}</Title>
          </Col>
          <Col span={3}>
            <Button type={'primary'} style={{ marginTop: 10 }} icon={<PlusCircleOutlined />} onClick={() => setModalCreateVis(true)}>{t('actions.create_new')}</Button>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <Table
              className="ant-table-rounded ant-table-shadow"
              columns={columns}
              dataSource={roleList}
              pagination={{
                current: currentPage,
                pageSize: 8,
                total: totalItems,
                showTotal: (total, range) => `${range[0]}-${range[1]} ${t('texts.of').toLocaleLowerCase()} ${total} ${t('texts.items').toLocaleLowerCase()}`
              }}
              onChange={handleTableChange}
            />
          </Col>
        </Row>
      </Col>
      <Modal
        title={`${t('actions.create')} ${t('texts.role')}`}
        open={modalCreateVis}
        onCancel={() => setModalCreateVis(false)}
        footer={[
          <Button key={'back'} onClick={() => setModalCreateVis(false)}>{t('texts.cancel')}</Button>,
          <Button key={'submit'} type={'primary'} onClick={newRole}>{t('texts.save')}</Button>
        ]}
      >
        <Form
          form={FormCreate}
          initialValues={{ remember: true }}
          onFinish={newRole}
        >
          <Form.Item
            name={'name'}
            label={t('texts.name')}
            rules={[{ required: true, message: 'Name is required' }]}
            style={{ width: 400, margin: 20 }}
          >
            <Input placeholder={t('texts.name')} />
          </Form.Item>
          <Form.Item
            name={'permissions'}
            label={t('panel.permissions')}
          >
            <Select
              placeholder={t('panel.permissions')}
              mode="multiple"
            >
              {permissions.map((permission) => {
                return <Option key={permission.id}>{permission.name}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name='olts'
            label='OLTs'
            style={{ width: 300 }}
          >
            <Checkbox.Group
              options={olts}
            />
          </Form.Item>
          <Form.Item
            style={{ width: 300 }}
          >
            <Button style={{ marginRight: 8 }} onClick={() => FormCreate.setFieldsValue({ olts: olts.map(i => i.value) })}>{t('actions.select_all')}</Button>
            <Button onClick={() => FormCreate.setFieldsValue({ olts: [] })}>{t('actions.clear_selection')}</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={`${t('actions.edit')} ${t('texts.role')}`}
        open={modalEditVis}
        onCancel={() => setModalEditVis(false)}
        footer={[
          <Button key={'back'} onClick={() => setModalEditVis(false)}>{t('texts.cancel')}</Button>,
          <Button key={'submit'} type={'primary'} onClick={editRole}>{t('texts.save')}</Button>
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
            <Input />
          </Form.Item>
          <Form.Item
            name={'name'}
            label={t('texts.name')}
            rules={[{ required: true, message: 'Name is required' }]}
            style={{ width: '45%', margin: 20 }}
          >
            <Input placeholder={t('texts.name')} />
          </Form.Item>
          <Form.Item
            name='permissions'
            label={t('panel.permissions')}
            style={{ width: 300 }}
          >
            <Select
              label={t('panel.permissions')}
              mode="multiple"
            >
              {permissions.map((permission) => {
                return <Option key={permission.id}>{permission.name}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name='olts'
            label='OLTs'
            style={{ width: 300 }}
          >
            <Checkbox.Group
              options={olts}
            />
          </Form.Item>
          <Form.Item
            style={{ width: 300 }}
          >
            <Button style={{ marginRight: 8 }} onClick={() => FormEdit.setFieldsValue({ olts: olts.map(i => i.value) })}>{t('actions.select_all')}</Button>
            <Button onClick={() => FormEdit.setFieldsValue({ olts: [] })}>{t('actions.clear_selection')}</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
}

export default RoleList;