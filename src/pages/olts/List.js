import React, { useEffect, useState } from "react";
import {
  Typography,
  Row,
  Col,
  Table,
  Tag,
  Space,
  Button,
  notification,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Checkbox,
} from "antd";
import {
  CloseSquareOutlined,
  FormOutlined,
  PlusCircleOutlined,
  BranchesOutlined,
  ApiOutlined,
  FieldStringOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import API from "../../services/API";
import { useTranslation } from "react-i18next";

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
  const [vendor, setVendor] = useState();
  const [snmp, setSNMP] = useState(false);
  const [t] = useTranslation("common");

  function refreshOlts() {
    API.get("/olts")
      .then((res) => {
        setOltsList(res.data);
        setTotalItems(res.data.length);
      })
      .catch((err) => {
        notification.error({
          message: err.response.data["message"],
        });
      });
  }

  useEffect(() => {
    refreshOlts();
  }, []);

  function removeOlt(id) {
    API.delete(`/olts/${id}`)
      .then((res) => {
        notification.success({
          message: res.data["message"],
        });
        refreshOlts();
      })
      .catch((err) => {
        notification.error({
          message: err.response.data["message"],
        });
      });
  }

  function changeEnabled(id) {
    API.get(`/toggleOlt/${id}`)
      .then((res) => {
        notification.success({
          message: res.data["message"],
        });
        refreshOlts();
      })
      .catch((err) => {
        notification.error({
          message: err.response.data["message"],
        });
      });
  }

  const columns = [
    {
      title: t("tables.name"),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t("texts.port"),
      dataIndex: "port",
      key: "port",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Slots",
      dataIndex: "slots",
      key: "slots",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "PONs",
      dataIndex: "pons",
      key: "pons",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t("tables.username"),
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t("tables.enabled"),
      dataIndex: "enabled",
      key: "enabled",
      render: (enabled, olt, i) => (
        <Switch
          size="small"
          defaultChecked={enabled}
          onChange={() => changeEnabled(olt.id)}
        />
      ),
    },
    {
      title: t("tables.vendor"),
      dataIndex: "vendor",
      key: "vendor",
      filters: [
        {
          text: "Nokia",
          value: "Nokia",
        },
        {
          text: "Huawei",
          value: "Huawei",
        },
        {
          text: "Fiberhome",
          value: "Fiberhome",
        },
        {
          text: "Datacom",
          value: "Datacom",
        },
        {
          text: "ZTE",
          value: "ZTE",
        },
      ],
      onFilter: (value, record) => record.vendor.indexOf(value) === 0,
      render: (vendor) => {
        if (vendor === "Nokia") {
          return (
            <Tag color={"purple"} key={vendor}>
              {vendor}
            </Tag>
          );
        }
        if (vendor === "Huawei") {
          return (
            <Tag color={"volcano"} key={vendor}>
              {vendor}
            </Tag>
          );
        }
        if (vendor === "Fiberhome") {
          return (
            <Tag color={"gold"} key={vendor}>
              {vendor}
            </Tag>
          );
        }
        if (vendor === "Datacom") {
          return (
            <Tag color={"blue"} key={vendor}>
              {vendor}
            </Tag>
          );
        }
        if (vendor === "ZTE") {
          return (
            <Tag color={"blue"} key={vendor}>
              {vendor}
            </Tag>
          );
        }
      },
    },
    {
      title: t("tables.model"),
      dataIndex: "model",
      key: "model",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t("tables.actions"),
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            size={"small"}
            type={"primary"}
            icon={<FormOutlined />}
            onClick={() => {
              setModalEditVis(true);
              setVendor(record.vendor);
              setSNMP(record.snmp);
              FormEdit.setFieldsValue({ id: record.id });
              FormEdit.setFieldsValue({ name: record.name });
              FormEdit.setFieldsValue({ ip: record.ip });
              FormEdit.setFieldsValue({ username: record.username });
              FormEdit.setFieldsValue({ password: record.password });
              FormEdit.setFieldsValue({ vendor: record.vendor });
              FormEdit.setFieldsValue({ slots: record.slots });
              FormEdit.setFieldsValue({ pons: record.pons });
              FormEdit.setFieldsValue({ unm: record.unm });
              FormEdit.setFieldsValue({ model: record.model });
              FormEdit.setFieldsValue({ port: record.port });
              FormEdit.setFieldsValue({ community: record.community });
              FormEdit.setFieldsValue({ superpass: record.superpass });
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title={t("questions.remove_olt")}
            onConfirm={() => removeOlt(record.id)}
          >
            <Button
              size={"small"}
              type={"danger"}
              icon={<CloseSquareOutlined />}
            >
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (page) => {
    setCurrentPage(page.current);
  };

  function newOlt() {
    console.log(FormCreate.getFieldsValue());
    API.post("olts", {
      name: FormCreate.getFieldValue("name"),
      ip: FormCreate.getFieldValue("ip"),
      vendor: FormCreate.getFieldValue("vendor"),
      slots: FormCreate.getFieldValue("slots"),
      pons: FormCreate.getFieldValue("pons"),
      enabled: true,
      username: FormCreate.getFieldValue("username"),
      password: FormCreate.getFieldValue("password"),
      unm: FormCreate.getFieldValue("unm"),
      model: FormCreate.getFieldValue("model"),
      port: FormCreate.getFieldValue("port"),
      snmp: snmp,
      community: FormCreate.getFieldValue("community"),
      superpass: FormCreate.getFieldValue("superpass"),
    })
      .then((res) => {
        notification.success({
          message: t("alerts.created_olt"),
        });
        refreshOlts();
        setModalCreateVis(false);
      })
      .catch((err) => {
        notification.error({
          message: err.response.data["message"],
        });
      });
  }

  function editOlt() {
    API.patch(`olts/${FormEdit.getFieldValue("id")}`, {
      name: FormEdit.getFieldValue("name"),
      ip: FormEdit.getFieldValue("ip"),
      unm: FormEdit.getFieldValue("unm"),
      vendor: FormEdit.getFieldValue("vendor"),
      slots: FormEdit.getFieldValue("slots"),
      pons: FormEdit.getFieldValue("pons"),
      enabled: true,
      model: FormEdit.getFieldValue("model"),
      username: FormEdit.getFieldValue("username"),
      password: FormEdit.getFieldValue("password"),
      port: FormEdit.getFieldValue("port"),
      snmp: snmp,
      community: FormEdit.getFieldValue("community"),
      superpass: FormEdit.getFieldValue("superpass"),
    })
      .then((res) => {
        notification.success({
          message: res.data["message"],
        });
        refreshOlts();
        setModalEditVis(false);
      })
      .catch((err) => {
        notification.error({
          message: err.response.data["message"],
        });
      });
  }

  return (
    <Row>
      <Col span={24}>
        <Row justify={"space-between"}>
          <Col span={4}>
            <Title level={2}>OLTs</Title>
          </Col>
          <Col span={3}>
            <Button
              type={"primary"}
              style={{ marginTop: 10 }}
              icon={<PlusCircleOutlined />}
              onClick={() => setModalCreateVis(true)}
            >
              {t("actions.create_new")}
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <Table
              rowKey={"id"}
              className="ant-table-rounded ant-table-shadow"
              columns={columns}
              dataSource={oltsList}
              pagination={{
                current: currentPage,
                pageSize: 8,
                total: totalItems,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} ${t(
                    "texts.of"
                  ).toLocaleLowerCase()} ${total} ${t(
                    "texts.items"
                  ).toLocaleLowerCase()}`,
              }}
              onChange={handleTableChange}
            />
          </Col>
        </Row>
      </Col>
      <Modal
        title={`${t("actions.create")} OLT`}
        visible={modalCreateVis}
        onCancel={() => setModalCreateVis(false)}
        footer={[
          <Button key={"back"} onClick={() => setModalCreateVis(false)}>
            {t("texts.cancel")}
          </Button>,
          <Button key={"submit"} type={"primary"} onClick={newOlt}>
            {t("texts.save")}
          </Button>,
        ]}
      >
        <Form
          form={FormCreate}
          onFinish={newOlt}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name={"name"}
            label={t("texts.name")}
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input
              placeholder={t("texts.name")}
              suffix={<FieldStringOutlined />}
            />
          </Form.Item>
          <Form.Item
            name={"ip"}
            label={"IP"}
            rules={[{ required: true, message: "IP is required" }]}
          >
            <Input placeholder={"IP"} suffix={<ApiOutlined />} />
          </Form.Item>
          {vendor === "Huawei" || vendor === "Datacom" ? (
            <Form.Item name={"port"} label={t("texts.port")}>
              <InputNumber placeholder={t("texts.port")} />
            </Form.Item>
          ) : null}
          <Form.Item
            name={"slots"}
            label={"Slots"}
            rules={[{ required: true, message: "Slots is required" }]}
          >
            <Input placeholder={"Slots"} suffix={<ApiOutlined />} />
          </Form.Item>
          <Form.Item
            name={"pons"}
            label={"PONs"}
            rules={[{ required: true, message: "PONs is required" }]}
          >
            <InputNumber placeholder={"PONs"} suffix={<ApiOutlined />} />
          </Form.Item>
          <Form.Item
            name={"username"}
            label={t("texts.user")}
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input
              placeholder={t("tables.username")}
              suffix={<ApiOutlined />}
            />
          </Form.Item>
          <Form.Item
            name={"password"}
            label={t("texts.password")}
            rules={[{ required: true, message: "Password is required" }]}
          >

            <Input placeholder={t("texts.password")} suffix={<ApiOutlined />} />
          </Form.Item>
          <Form.Item
            name={"snmp"}
            label='SNMP'
            valuePropName="checked"
          >
            <Checkbox checked={snmp} onChange={value => setSNMP(value.target.checked)}/>
          </Form.Item>
          {
            snmp ? <Form.Item
              name={"community"}
              label='Community'
              rules={[{ required: true, message: "SNMP Community is required" }]}
            >
              <Input
                placeholder='SNMP Community'
                suffix={<KeyOutlined />}
              />
            </Form.Item> : null
          }
          <Form.Item
            name={"vendor"}
            label={t("tables.vendor")}
            rules={[{ required: true, message: "Vendor is required" }]}
          >
            <Select
              placeholder={t("tables.vendor")}
              suffixIcon={<BranchesOutlined />}
              onChange={(value) => setVendor(value)}
            >
              <Option key="Nokia">Nokia</Option>
              <Option key="Huawei">Huawei</Option>
              <Option key="Fiberhome">Fiberhome</Option>
              <Option key="Datacom">Datacom</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={"model"}
            label={t("tables.model")}
            rules={[{ required: true, message: "Model is required" }]}
          >
            <Select
              placeholder={t("tables.model")}
              suffixIcon={<BranchesOutlined />}
            >
              {vendor === "Fiberhome" ? (
                <>
                  <Option value="AN6001-G16">AN6001-G16</Option>
                  <Option value="AN6000-7">AN6000-7</Option>
                  <Option value="AN6000-2">AN6000-2</Option>
                  <Option value="AN6000-17">AN6000-17</Option>
                  <Option value="AN6000-15">AN6000-15</Option>
                  <Option value="AN5516-06">AN5516-06</Option>
                  <Option value="AN5516-04">AN5516-04</Option>
                  <Option value="AN5516-06B">AN5516-06B</Option>
                  <Option value="AN5116-06B">AN5116-06B</Option>
                </>
              ) : vendor === "Nokia" ? (
                <>
                  <Option value="FX-4">FX-4</Option>
                  <Option value="FX-8">FX-8</Option>
                  <Option value="FX-16">FX-16</Option>
                </>
              ) : vendor === "Huawei" ? (
                <>
                  <Option value="EA5800">EA5800</Option>
                  <Option value="EA5801">EA5801</Option>
                  <Option value="MA5600T">MA5600T</Option>
                  <Option value="MA5800">MA5800</Option>
                </>
              ) : vendor === 'Datacom' ?
                <>
                  <Option value='DM4610 4 GPON'>DM4610 4 GPON</Option>
                  <Option value='DM4610 8 GPON'>DM4610 8 GPON</Option>
                  <Option value='DM4611'>DM4611</Option>
                  <Option value='DM4612'>DM4612</Option>
                  <Option value='DM4615'>DM4615</Option>
                  <Option value='DM4618'>DM4618</Option>
                </>
                : vendor === 'ZTE' ?
                <>
                  <Option value='ZXA10 C600'>ZXA10 C600</Option>
                </> :
                null}
            </Select>
          </Form.Item>
          {vendor === "Fiberhome" ? (
            <Form.Item name={"unm"} label={"UNM IP"}>
              <Input placeholder={"UNM IP"} suffix={<ApiOutlined />} />
            </Form.Item>
          ) : null}
          {vendor === "ZTE" ? (
            <Form.Item name={"superpass"} label={"Super Pass"}>
              <Input placeholder={"Super Pass"} suffix={<ApiOutlined />} />
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
      <Modal
        title={`${t("actions.edit")} OLT`}
        visible={modalEditVis}
        onCancel={() => setModalEditVis(false)}
        footer={[
          <Button key={"back"} onClick={() => setModalEditVis(false)}>
            {t("texts.cancel")}
          </Button>,
          <Button key={"submit"} type={"primary"} onClick={editOlt}>
            {t("texts.save")}
          </Button>,
        ]}
      >
        <Form
          form={FormEdit}
          onFinish={editOlt}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item name={"id"} hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name={"name"}
            label={t("texts.name")}
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder={t("texts.name")} />
          </Form.Item>
          <Form.Item
            name={"ip"}
            label={"IP"}
            rules={[{ required: true, message: "IP is required" }]}
          >
            <Input placeholder={"IP"} suffix={<ApiOutlined />} />
          </Form.Item>
          {vendor === "Huawei" || vendor === "Datacom" ? (
            <Form.Item name={"port"} label={t("texts.port")}>
              <InputNumber placeholder={t("texts.port")} />
            </Form.Item>
          ) : null}
          <Form.Item
            name={"slots"}
            label={"Slots"}
            rules={[{ required: true, message: "Slots is required" }]}
          >
            <Input placeholder={"Slots"} suffix={<ApiOutlined />} />
          </Form.Item>
          <Form.Item
            name={"pons"}
            label={"PONs"}
            rules={[{ required: true, message: "PONs is required" }]}
          >
            <InputNumber placeholder={"PONs"} />
          </Form.Item>
          <Form.Item
            name={"username"}
            label={t("texts.user")}
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input placeholder={t("texts.user")} suffix={<ApiOutlined />} />
          </Form.Item>
          <Form.Item
            name={"password"}
            label={t("texts.password")}
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input placeholder={t("texts.password")} suffix={<ApiOutlined />} />
          </Form.Item>
          <Form.Item
            name={"snmp"}
            label='SNMP'
          >
            <Checkbox checked={snmp} onChange={value => setSNMP(value.target.checked)} />
          </Form.Item>
          {
            snmp ? <Form.Item
              name={"community"}
              label='Community'
              rules={[{ required: true, message: "SNMP Community is required" }]}
            >
              <Input
                placeholder='SNMP Community'
                suffix={<KeyOutlined />}
              />
            </Form.Item> : null
          }
          <Form.Item
            name={"vendor"}
            label={t("tables.vendor")}
            rules={[{ required: true, message: "Vendor is required" }]}
          >
            <Select
              placeholder={t("tables.vendor")}
              suffixIcon={<BranchesOutlined />}
              onChange={(value) => setVendor(value)}
            >
              <Option key="Nokia">Nokia</Option>
              <Option key="Huawei">Huawei</Option>
              <Option key="Fiberhome">Fiberhome</Option>
              <Option key="Datacom">Datacom</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={"model"}
            label={t("tables.model")}
            rules={[{ required: true, message: "Model is required" }]}
          >
            <Select
              placeholder={t("tables.model")}
              suffixIcon={<BranchesOutlined />}
            >
              {vendor === "Fiberhome" ? (
                <>
                  <Option value="AN6001-G16">AN6001-G16</Option>
                  <Option value="AN6000-7">AN6000-7</Option>
                  <Option value="AN6000-2">AN6000-2</Option>
                  <Option value="AN6000-17">AN6000-17</Option>
                  <Option value="AN6000-15">AN6000-15</Option>
                  <Option value="AN5516-06">AN5516-06</Option>
                  <Option value="AN5516-04">AN5516-04</Option>
                  <Option value="AN5516-06B">AN5516-06B</Option>
                </>
              ) : vendor === "Nokia" ? (
                <>
                  <Option value="FX-4">FX-4</Option>
                  <Option value="FX-8">FX-8</Option>
                  <Option value="FX-16">FX-16</Option>
                </>
              ) : vendor === "Huawei" ? (
                <>
                  <Option value="EA5800">EA5800</Option>
                  <Option value="EA5801">EA5801</Option>
                  <Option value="MA5600T">MA5600T</Option>
                  <Option value="MA5800">MA5800</Option>
                </>
              ) : vendor === 'Datacom' ?
                <>
                  <Option value='DM4610 4 GPON'>DM4610 4 GPON</Option>
                  <Option value='DM4610 8 GPON'>DM4610 8 GPON</Option>
                  <Option value='DM4611'>DM4611</Option>
                  <Option value='DM4612'>DM4612</Option>
                  <Option value='DM4615'>DM4615</Option>
                  <Option value='DM4618'>DM4618</Option>
                </>
                : vendor === 'ZTE' ?
                <>
                  <Option value='ZXA10 C600'>ZXA10 C600</Option>
                </> :
                null}
            </Select>
          </Form.Item>
          {vendor === "Fiberhome" ? (
            <Form.Item name={"unm"} label={"UNM IP"}>
              <Input placeholder={"UNM IP"} suffix={<ApiOutlined />} />
            </Form.Item>
          ) : null}
          {vendor === "ZTE" ? (
            <Form.Item name={"superpass"} label={"Super Pass"}>
              <Input placeholder={"Super Pass"} suffix={<ApiOutlined />} />
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </Row>
  );
}

export default OltList;
