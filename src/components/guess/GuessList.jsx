import React from 'react';
import { Button, Table, Tag } from 'antd';
import Fetch from '../../config/fetch';
import config from '../../config/config';
import moment from 'moment';

function Tags (props) {
    const { text } = props
    if (text === '未开始') {
        return <Tag color='warning'>{text}</Tag>
    } else if (text === '进行中') {
        return <Tag color='success'>{text}</Tag>
    } else {
        return <Tag color='error'>{text}</Tag>
    }
}

export default class GuessList extends React.Component {
    constructor () {
        super()
        this.state = {
            loading: true,
            dataSource: [],
            columns: [
                { title: '标题', dataIndex: 'topic', key: 'title' },
                { title: '竞猜活动类型', dataIndex: 'type', key: 'type'},
                { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
                { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
                { title: '截止时间', dataIndex: 'endTime', key: 'endTime' },
                { title: '状态', dataIndex: 'topicStatus', key: 'topicStatus', render:(text) => <Tags text={text}/> },
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                { title: '操作', dataIndex: 'oper', key: 'oper', render:(text, record) => <a onClick={() => this.handleDetail(record)}>详情</a>},
            ]
        }
    }

    componentDidMount () {
        Fetch({
            url: config.url_list.getGuessTopicList,
            method: "GET"
        }).then(res => {
            if (res.data.data.code === 200) {
                res.data.data.data.map(item => {
                    item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
                    item.startTime = item.startTime === null ? item.startTime : moment(item.startTime).format('YYYY-MM-DD')
                    item.endTime = item.endTime === null ? item.endTime : moment(item.endTime).format('YYYY-MM-DD')

                })
                this.setState({
                    dataSource: res.data.data.data,
                    loading: false
                })
            }
        })
    }

    handleAddGuess = () => {
        this.props.history.push('./createGuess')
    }
    handleDetail = e => {
        if (e.type === '其它活动竞猜') {
            this.props.history.push('./edit_active_guess?id='+e.id)
        } else {
            this.props.history.push('./edit_stock_guess?id='+e.id)
        }
       
    }

    render () {
        const { loading, dataSource,columns } = this.state
        return (
            <div>
                <div style={{margin: '10px', textAlign: 'right'}}><Button type="primary" onClick={this.handleAddGuess}>新增</Button></div>
                <div>
                    <Table
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    rowKey={record => record.id}
                    ></Table>
                </div>
            </div>
        )
    }
}