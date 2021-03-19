import React from 'react';
import { Table, Button, Divider, Tag } from 'antd';
import Axios from 'axios';
import CONFIG from '../../config/config';
import moment from 'moment'
import Fetch from '../../config/fetch';
import config from '../../config/config';
const { url_list, DOMAIN } = CONFIG


export default class Issue extends React.Component {
    constructor() {
        super()
        this.state = {
            pagination: {
                current: 1,
                pageSize: 10,
                pageSizeOptions: [10, 30, 50, 100],
                showSizeChanger: true,
                total: 0,
                onChange: this.handleChangePage,
                onShowSizeChange: this.handleChangePageSize
            },
            columns: [
                { title: '标题', dataIndex: 'title', key: 'title',},
                { title: '创建时间', dataIndex: 'createTime', key: 'createTime',
                render:(text) => {
                    if(text) {
                        return (<div>{moment(text).format('YYYY-MM-DD')}</div>)
                    }
                }},
                { title: '截止时间', dataIndex: 'deadline', key: 'deadline',
                    render:(text) => {
                        if(text) {
                            return (<div>{moment(text).format('YYYY-MM-DD')}</div>)
                        }
                    }
                },
                { title: '进行状态', dataIndex: 'status', key: 'status',
                    render:(text) => {
                        if (text === '未开始') {
                            return (<Tag color="orange">{text}</Tag>)
                        } else if (text === '进行中') {
                            return (<Tag color="green">{text}</Tag>)
                        } else {
                            return (<Tag color="red">{text}</Tag>)
                        }
                    }
                },
                { title: '操作', dataIndex: 'operation', key: '', render: (text, record) =>
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <div>
                        {/* <a onClick={() => this.handleDetail(record.id) }>详情</a>
                        <Divider type="vertical"/> */}
                        <a onClick={() => this.handleEdit(record.id) }>详情</a>
                    </div>
                }
            ],
            dataSource: []
        }


    }

    componentDidMount() {
        // Axios({
        //     url: DOMAIN + url_list.getEasyAnswerTitleList,
        //     method: 'GET',
        // }).then(res => {
        //     if (res.data.data.code === 200) {
        //         this.setState({
        //             dataSource: res.data.data.data
        //         })
        //     }
        // })
        const { pagination } = this.state
        Fetch({
            url: config.url_list.getEasyAnswerTitleList,
            method: 'GET',
            queryData: {
                page: pagination.current,
                pageSize: pagination.pageSize
            }
        }).then(res => {
            if (res.data.data.code === 200) {
                pagination.total = res.data.data.data[1]
                this.setState({
                    dataSource: res.data.data.data[0],
                    pagination
                })
            }
        })
    }

    handleChangePage = (page, pageSize) => {
        const { pagination } = this.state
        pagination.current = page
        pagination.pageSize = pageSize
        this.setState({
            pagination
        })
        this.changeFetch({
            page,
            pageSize
        })
    }

    handleChangePageSize = (current, size) => {
        const { pagination } = this.state
        pagination.current = current
        pagination.pageSize = size
        this.setState({
            pagination
        })
        this.changeFetch({
            page: current,
            pageSize: size
        })
    }

    changeFetch(param) {
        const { pagination } = this.state
        Fetch({
            url: config.url_list.getEasyAnswerTitleList,
            method: 'GET',
            queryData: param
        }).then(res => {
            if (res.data.data.code === 200) {
                pagination.total = res.data.data.data[1]
                this.setState({
                    dataSource: res.data.data.data[0],
                    pagination
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
        const { columns, dataSource, pagination } = this.state
        return (
            <div>
                <div style={{margin: "16px 0", display: 'flex', justifyContent: 'flex-end'}}>
                    <Button type="primary" onClick={() => this.props.history.push('./createIssue')}>新增</Button>
                </div>
                <div>
                    <Table
                    rowKey={record => record.id}
                    scroll={{x: 800, y: window.innerHeight*0.6}}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    ></Table>
                </div>
            </div>
        )
    }
}