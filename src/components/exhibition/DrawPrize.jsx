import React from 'react';
import { Button, Col, Row } from 'antd';
import CONFIG from '../../config/config';
const { outer_url } = CONFIG

export default class DrawPrize extends React.Component {
    constructor () {
        super()
        this.state = {
            rounds: [
                {
                    title: '第一轮',
                    index: 1
                },
                {
                    title: '第二轮',
                    index: 2
                },
                {
                    title: '第三轮',
                    index: 3
                }
            ]
        }
    }
    render () {
        const { rounds } = this.state
        return (
            <div>
                <div style={{height:260, display:'flex',alignItems:'center',justifyContent:'center',fontSize:30}}>第七届新品展示会抽奖</div>
                <div>
                    <Row type='flex' justify='center' >
                    {
                        rounds.map(round => (
                            <Col key={round.index}>
                                <div style={{width: '50%', margin:40,}}>
                                    <Button type='primary' onClick={() => {window.open(`${outer_url}/exhibition/drawAblePrizeList?round=${round.index}`)}}>{round.title}</Button>
                                </div>
                            </Col>
                        ))
                    }
                    </Row>
                </div>
            </div>
        )
    }
}