import React, { useEffect, useState } from "react"
import { Card, Row, Col, Table, Tag, Image, message, Button, Input } from 'antd'
import API from "../services/API"
import {
  Link, useNavigate
} from "react-router-dom"
import { useTranslation } from "react-i18next"
import { FaIdCard, FaQuestion, FaServer, FaUser, FaBolt } from "react-icons/fa"
import { AiOutlineReload } from 'react-icons/ai'
import StatCard from "../components/StatCard"
import { SearchOutlined } from "@ant-design/icons"

function Dashboard() {

  const [list, setList] = useState([])
  const [olts, setOlts] = useState([])
  const [search, setSearch] = useState('')
  const [olt, setOlt] = useState()
  const [stats, setStats] = useState({})
  const [loadStats, setLoadStats] = useState(true)
  const [totalItems, setTotalItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [t] = useTranslation('common')
  const [loadOlts, setLoadOlts] = useState(true)
  const [loadOlt, setLoadOlt] = useState(false)
  const [loadFirmware, setLoadFirmware] = useState(false)
  const [loadCpu, setLoadCpu] = useState(false)
  const permissions = localStorage.getItem('permissions').split(',')
  const navigate = useNavigate()

  useEffect(() => {
    getOlts()
    let tempStats = {}
    API.get('/stats/olts').then(res => {
      tempStats.olts = res.data
      API.get('/stats/users').then(res => {
        tempStats.users = res.data
        API.get('/stats/roles').then(res => {
          tempStats.roles = res.data
          API.get('/log/count').then(res => {
            tempStats.actions = res.data.count
            API.get('/log/count/user').then(res => {
              tempStats.your_actions = res.data.count
              setStats(tempStats)
              setLoadStats(false)
            })
          })
        })
      })
    })
  }, [])

  const columns = [
    {
      title: t('tables.name'),
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
      title: t('tables.vendor'),
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
          text: 'Fiberhome',
          value: 'Fiberhome'
        }
      ],
      onFilter: (value, record) => record.vendor.indexOf(value) === 0,
      render: vendor => {
        if (vendor === 'Nokia') {
          return <Tag color={'purple'} key={vendor}>{vendor}</Tag>
        }
        if (vendor === 'Huawei') {
          return <Tag color={'volcano'} key={vendor}>{vendor}</Tag>
        }
        if (vendor === 'Fiberhome') {
          return <Tag color={'gold'} key={vendor}>{vendor}</Tag>
        }
      }
    },
    {
      title: t('texts.version'),
      dataIndex: 'firmware',
      key: 'firmware',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      key: 'cpu',
      sorter: (a, b) => Number(a.cpu) - Number(b.cpu),
      render: text => text != null ? text + '%' : null
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => <Link to={'/navigate/' + record.id}><Button style={{ width: '100%' }} size="small">{t('actions.access')}</Button></Link>
    },
  ]

  const getOlts = () => {
    API.get('/getOlts').then(res => {
      setList(res.data)
      setOlts(res.data)
      setTotalItems(res.data.length)
      setLoadOlts(false)
    })
  }

  const handleTableChange = (page) => {
    setCurrentPage(page.current)
  }

  const getOlt = (id) => {
    setOlt()
    setLoadOlt(true)
    API.get('/getOlts/' + id).then(res => {
      setOlt(res.data)
      setLoadOlt(false)
    })
  }

  const getFirmware = (id) => {
    setLoadFirmware(true)
    API.post(`/exec/${id}/firmware`).then(() => {
      setLoadFirmware(false)
      getOlts()
      getOlt(id)
    }).catch(err => {
      setLoadFirmware(false)
      message.error(err.response.data)
    })
  }

  const getCpu = (id) => {
    setLoadCpu(true)
    API.post(`/exec/${id}/cpu`).then(() => {
      setLoadCpu(false)
      getOlts()
      getOlt(id)
    }).catch(err => {
      setLoadCpu(false)
      message.error(err.response.data)
    })
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row gutter={8}>
          <Col span={6}>
            <StatCard icon={<FaServer color="white" size='2.5em' />} stat={stats.olts} text='OLTs' load={loadStats} />
          </Col>
          <Col span={6}>
            <StatCard icon={<FaUser color="white" size='2.5em' />} stat={stats.users} text={t('texts.users')} load={loadStats} />
          </Col>
          <Col span={6}>
            <StatCard icon={<FaIdCard color="white" size='2.5em' />} stat={stats.roles} text={t('texts.roles')} load={loadStats} />
          </Col>
          <Col span={6}>
            <StatCard icon={<FaBolt color="white" size='2.5em' />} stat={stats.actions} text={t('texts.interactions')} substat={stats.your_actions} subtext={t('texts.yours').toLowerCase()} load={loadStats} />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={16}>
          <Col span={16}>
            <Row gutter={[8, 8]} justify="space-between" align="middle">
              <Col>
                <h2 style={{margin: 0, fontWeight: 'bold'}}>OLTs</h2>
              </Col>
              <Col>
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
                  setOlts(filteredData);
                }}
                />
              </Col>
              <Col span={24}>
                <Table
                  rowKey={'id'}
                  loading={loadOlts}
                  className="ant-table-rounded ant-table-shadow"
                  columns={columns}
                  dataSource={olts}
                  pagination={{
                    current: currentPage,
                    pageSize: 12,
                    showSizeChanger: false,
                    total: totalItems,
                    showTotal: (total, range) => `${range[0]}-${range[1]} ${t('texts.of').toLocaleLowerCase()} ${total} ${t('texts.items').toLocaleLowerCase()}`
                  }}
                  onChange={handleTableChange}
                  size="small"
                  onRow={(record, idx) => {
                    return {
                      style: { cursor: 'pointer' },
                      onClick: () => getOlt(record.id),
                      onDoubleClick: () => navigate('/navigate/' + record.id)
                    }
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            {
              olt ?
                <Card title={t('texts.olt_information')} style={{ borderRadius: 8, boxShadow: '0px 0.1em 1em #aaa5' }}>
                  <Row>
                    <Col span={16}>
                      <h3><b>{t('tables.name')}:</b> {olt.name}</h3>
                      <h3><b>IP:</b> {olt.ip}</h3>
                      <h3><b>{t('texts.version')}:</b> {olt.firmware} {permissions.indexOf('edit_olts') > -1 ? <Button style={{ color: 'royalblue' }} size="small" loading={loadFirmware} onClick={() => getFirmware(olt.id)} type="text" icon={<AiOutlineReload />} /> : null}</h3>
                      <h3><b>CPU:</b> {olt.cpu != null ? olt.cpu + '%' : null} {permissions.indexOf('edit_olts') > -1 ? <Button style={{ color: 'royalblue' }} loading={loadCpu} size="small" onClick={() => getCpu(olt.id)} type="text" icon={<AiOutlineReload />} /> : null}</h3>
                    </Col>
                    <Col span={8}>
                      <Image src={require(`./../assets/img/${olt.vendor.toLowerCase()}/${olt.model}.png`)} width={'100%'} />
                    </Col>
                  </Row>
                </Card> :
                <Card loading={loadOlt} title={t('texts.olt_information')} style={{ borderRadius: 8, boxShadow: '0px 0.1em 1em #aaa5' }} bodyStyle={{ textAlign: 'center' }}>
                  <FaQuestion color="gray" size='2.5em' />
                  <h2 style={{ color: 'gray' }}>{t('texts.no_data_olt')}</h2>
                  <h3 style={{ color: 'gray' }}>{t('texts.select_olt')}</h3>
                </Card>
            }
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Dashboard
