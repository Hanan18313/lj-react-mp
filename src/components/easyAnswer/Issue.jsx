import React from 'react';
import { Table, Button, Divider } from 'antd';
import Axios from 'axios';
import CONFIG from '../../config/config';
import moment from 'moment'
const { url_list, DOMAIN } = CONFIG


export default class Issue extends React.Component {
    constructor() {
        super()
        this.state = {
            columns: [
                { title: '标题', dataIndex: 'title', key: 'title',},
                { title: '创建时间', dataIndex: 'createTime', key: 'createTime',
                render:(text) => {
                    if(text) {
                        return (<div>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>)
                    }
                }},
                { title: '截止时间', dataIndex: 'deadline', key: 'deadline',
                render:(text) => {
                    if(text) {
                        return (<div>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>)
                    }
                }},
                { title: '操作', dataIndex: 'operation', key: '', render: (text, record) =>
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <div>
                        <a onClick={() => this.handleDetail(record.id) }>详情</a>
                        <Divider type="vertical"/>
                        <a onClick={() => this.handleEdit(record.id) }>编辑</a>
                    </div>
                }
            ],
            dataSource: []
        }


    }

    componentDidMount() {
        Axios({
            url: DOMAIN + url_list.getEasyAnswerTitleList,
            method: 'GET',
        }).then(res => {
            if (res.data.data.code === 200) {
                this.setState({
                    dataSource: res.data.data.data
                })
            }
        })
    }

    handleDetail = id => {
        this.props.history.push('./issueDetail?id='+id)
    }

    handleEdit = id => {
        this.props.history.push('./editIssue?id='+id)
    }

    render() {
        const { columns, dataSource } = this.state
        return (
            <div>
                <div style={{margin: "16px 0", display: 'flex', justifyContent: 'flex-end'}}>
                    <Button type="primary" onClick={() => this.props.history.push('./createIssue')}>新增</Button>
                </div>
                <div>
                    <Table
                    rowKey={record => record.id}
                    scroll={{x: 800, y: window.innerHeight*0.7}}
                    columns={columns}
                    dataSource={dataSource}
                    ></Table>
                </div>
            </div>
        )
    }
}