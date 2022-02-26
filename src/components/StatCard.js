import { Card, Col, Row } from "antd";
import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import API from "../services/API";

export default function StatCard(props) {
  const [amount, setAmount] = useState()
  useEffect(() => {
    API.get('/stats/' + props.stat).then(res => {
      setAmount(res.data)
    })
  }, [])
  return (
    <Card style={{ backgroundColor: 'RoyalBlue', textAlign: 'center', borderRadius: 8, boxShadow: '0px 0.1em 1em #aaa5' }}>
      <Row justify="center" align="middle" gutter={8}>
        <Col>
          <h2 style={{ color: 'white', margin: 0 }}><b>{amount} {props.text}</b></h2>
        </Col>
        <Col>
          {props.icon}
        </Col>
      </Row>
    </Card>
  )
}