/* eslint-disable jsx-a11y/anchor-is-valid */
import { Table, Row, Col, Button, Popconfirm, Divider, Avatar, message } from 'antd';
import React from 'react';
import Fetch from '../../config/fetch';
import CONFIG from '../../config/config'
import Axios from 'axios';
import config from '../../config/config';
const { DOMAIN, url_list } = CONFIG

export default class PrizeList extends React.Component {
    constructor () {
        super()
        this.state = {
            pagination: {
                current: 1,
                pageSize: 50,
                total: 0,
                showSizeChanger: true,
                pageSizeOptions: ['30','50','100','200'],
                onShowSizeChange:(current, pageSize) => {
                    const pagination = this.state.pagination
                    pagination.pageSize = pageSize
                    this.setState({
                        pageSize,
                    })
                },
                onChange:(current, pageSize) => {
                    const pagination = this.state.pagination
                    pagination.current = current
                    pagination.pageSize = pageSize
                },
                showTotal:(total) => {
                    return(
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <p style={{paddingRight:40,fontSize:'16px'}}>奖品数量：{total}</p>
                        </div>
                    )
                },
            },
            loading: false,
            dataSource: [],
            Columns: [
                { title: '编号', dataIndex: 'prize_ser_num', key: 'prize_ser_num' },
                { title: '奖品名', dataIndex: 'prize_name', key: 'prize_name' },
                { title: '价格', dataIndex: 'price', key: 'price' },
                { title: '图片', dataIndex: 'img_url', key: 'img_url',
                    render:(text) => (
                        <Avatar src={text} shape='square' size={40}/>
                    ) },
                { title: '轮次', dataIndex: 'round', key: 'round' },
                { title: '类别', dataIndex: 'type', key: 'type',
                    render: (text) => (
                        text = text === 'scene' ? '现场奖品' : '直播间奖品'
                    ),
                    filters: [
                        {
                            text: '直播间奖品',
                            value: 'live'
                        },
                        {
                            text: '现场奖品',
                            value: 'scene'
                        }
                    ]
                },
                { title: '附加', dataIndex: 'instrct', key: 'instrct' },
                { title: '操作', dataIndex: 'oper', key: 'oper',render: (text, record) => (
                    <div>
                        <Popconfirm title='是否确定删除' onConfirm={() => this.handleDelete(record.id)}>
                            <a>删除</a>
                        </Popconfirm>
                        <Divider type='vertical'/>
                        <a onClick={() => this.handleEdit(record.id)}>编辑</a>
                    </div>
                ) }
            ]
        }
    }

    componentDidMount () {
        this.setState({loading: true})
        Fetch({
            url: url_list.getPrizeList,
            method: 'GET',
        }).then(res => {
            console.log(res)
            if(res.data.code === 200) {
                res.data.data.map(item => {
                    item.img_url = DOMAIN + '/static/upload/' + item.img_url
                })
                this.setState({
                    dataSource: res.data.data,
                    loading: false
                })
            }
        })
    }

    handleDelete = id => {
        const dataSource = [...this.state.dataSource];
        Axios({
            method: 'DELETE',
            url: config.DOMAIN + config.url_list.deletePrizeById,
            data: {
                prizeId: id
            }
        }).then(res => {
            // eslint-disable-next-line react/no-direct-mutation-state
            let filterData = dataSource.filter(item => item.id !== id)
            const pagination = this.state.pagination
            pagination.total = filterData.length
            this.setState({
                 dataSource: filterData,
                 pagination: pagination
            });
            setTimeout(() => {
                message.success('删除成功')
            })
        })
    };

    handleEdit = id => {
        this.props.history.push(`./editPrize?id=${id}`)
    }

    handleTableChange = (pagination, filter) => {
        this.setState({
            loading: true
        })
        Axios({
            method: 'GET',
            url: config.DOMAIN + config.url_list.getPrizeList,
            params: {
                filter:filter.type
            },
        }).then(res => {
            if(res.data.code === 200) {
                res.data.data.map(item => {
                    item.img_url = DOMAIN + '/static/upload/' + item.img_url
                })
                this.setState({
                    dataSource: res.data.data,
                    loading: false,
                    pagination
                })
            }
        })
    }
    render(){
        const { pagination, loading, dataSource, Columns } = this.state
        return (
            <div>
                <div>
                    <Row type='flex' justify='end' style={{marginBottom:12}}>
                        <Col>
                            <Button type='primary' onClick={() => this.props.history.push('./createPrize')}>新增</Button>
                        </Col>
                    </Row>
                </div>
                <Table
                rowKey={record => record.id}
                columns={Columns}
                scroll={{x:1300, y:window.innerHeight*0.7}}
                pagination={pagination}
                loading={loading}
                dataSource={dataSource}
                onChange={this.handleTableChange}
                ></Table>
            </div>
        )
    }
}