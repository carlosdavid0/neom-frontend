import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Table, Space, Button, notification, Popconfirm, Modal, Form, Input } from 'antd';
import { CloseSquareOutlined, FormOutlined, PlusCircleOutlined } from "@ant-design/icons";
import API from "../../services/API";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

function PermissionList() {

  const [permissionList, setPermissionList] = useState([]);
  const [totalItems, setTotalItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [modalCreateVis, setModalCreateVis] = useState(false);
  const [modalEditVis, setModalEditVis] = useState(false);
  const [FormCreate] = Form.useForm();
  const [FormEdit] = Form.useForm();
  const [t] = useTranslation('common')

  function refreshPermissions() {
    API.get('/permissions').then((res) => {
      let temp = res.data.map((permission, i) => {
        return {
          key: permission['id'],
          name: permission['name']
        }
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
      title: t('tables.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('tables.actions'),
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button size={'small'} type={'primary'} icon={<FormOutlined />} onClick={() => {
            setModalEditVis(true);
            FormEdit.setFieldsValue({ id: record['key'] });
            FormEdit.setFieldsValue({ name: record['name'] });
          }}>{t('actions.edit')}</Button>
          <Popconfirm
            title={t('questions.remove_permission')}
            onConfirm={() => removePermission(record.key)}
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
            <Title level={2}>{t('panel.permissions')}</Title>
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
              dataSource={permissionList}
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
        title={`${t('actions.create')} ${t('texts.permission')}`}
        visible={modalCreateVis}
        onCancel={() => setModalCreateVis(false)}
        footer={[
          <Button key={'back'} onClick={() => setModalCreateVis(false)}>{t('texts.cancel')}</Button>,
          <Button key={'submit'} type={'primary'} onClick={newPermission}>{t('texts.save')}</Button>
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
            label={t('tables.name')}
            rules={[{ required: true, message: 'Name is required' }]}
            style={{ width: 400, margin: 20 }}
          >
            <Input placeholder={t('tables.name')} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={`${t('actions.edit')} ${t('texts.permission')}`}
        visible={modalEditVis}
        onCancel={() => setModalEditVis(false)}
        footer={[
          <Button key={'back'} onClick={() => setModalEditVis(false)}>{t('texts.cancel')}</Button>,
          <Button key={'submit'} type={'primary'} onClick={editPermission}>{t('texts.save')}</Button>
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
            <Input />
          </Form.Item>
          <Form.Item
            name={'name'}
            label={t('tables.name')}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder={t('tables.name')} />
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
}

export default PermissionList;