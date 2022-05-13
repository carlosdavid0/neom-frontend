import { Card, Col, Row } from "antd";
import { LoadingOutlined } from "@ant-design/icons"
import React from "react";

export default function StatCard(props) {
  // const [amount, setAmount] = useState()
  // useEffect(() => {
  //   API.get('/stats/' + props.stat).then(res => {
  //     setAmount(res.data)
  //   })
  // }, [])
  return (
    <Card style={{ backgroundColor: 'RoyalBlue', textAlign: 'center', borderRadius: 8, boxShadow: '0px 0.1em 1em #aaa5', height: '100%' }} bodyStyle={{height: '100%'}}>
      <Row justify="center" align="middle" gutter={8} style={{height: '100%'}}>
        <Col>
          <h2 style={{ color: 'white', margin: 0 }}><b>{props.load ? <LoadingOutlined/> : props.stat} {props.text}</b></h2>
          {props.subtext ? <h3 style={{ color: 'white', margin: 0 }}>{props.load ? <LoadingOutlined/> : props.substat} {props.subtext}</h3> : null}
        </Col>
        <Col>
          {props.icon}
        </Col>
      </Row>
    </Card>
  )
}