import React, { useState } from 'react';
import { Tag, Table, Button, Drawer, Calendar, message } from 'antd';
import Fetch from '../../config/fetch';
import config from '../../config/config';
import locale from 'antd/lib/calendar/locale/zh_CN';
import moment from 'moment'


function Tags (props) {
    const { text } = props
    if (text === '已揭晓') {
        return <Tag color='error' >{text}</Tag>
    } else if (text === '进行中') {
        return <Tag color='success'>{text}</Tag>
    } else if (text === '等待结果中'){
        return <Tag >{text}</Tag>
    }
}

function DrawerComponent() {
    const [ visible, setVisible ] = useState(false)
    const [ data, setData ] = useState([])

    const onClose = () => {
        setVisible(false)
        
    }
    const handleOpenCalendar = () => {
        setVisible(true)
        const dateArr = []
        Fetch({
            url: config.url_list.getQuizPlan,
            method: 'GET'
        }).then(res => {
            res.data.data.data.map(item => {
                item.date = moment(item.date).format('YYYY-MM-DD')
                dateArr.push(item.date)
            })
            setData(dateArr)
        })
    }
    const handleSelectDate = (e) => {
        const date = moment(e).format('YYYY-MM-DD')
        if (data.indexOf(date) !== -1) {
            data.splice(data.indexOf(date), 1)
        } else {
            data.push(date)
        }
        setData(data)
        Fetch({
            url: config.url_list.createQuizPlan,
            method: 'POST',
            formData: {
                date: date,
                type: 'quiz',
            }
        }).then(res => {
            if (res.data.data.code === 200) {
                message.success('操作成功')
            }
            
        })

    }
    const handleChangePanel = (e) => {}
    const handleChangeDate = (e) => {}

    const dateCellRender = (e) => {
        return(
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{data.map((item, index) => {
                if (item === moment(e).format('YYYY-MM-DD')) {
                   return(<li key={index} >竞猜</li>)
                }
            })}</div>
        )
    }
    

    return(
        <div>
             <div style={{margin: '10px', textAlign: 'right'}}><Button type="primary" onClick={handleOpenCalendar}>竞猜日历</Button></div>
            <Drawer
            title=""
            closable={false}
            onClose={onClose}
            visible={visible}
            getContainer={false}
            width={680}
            >
                <Calendar dateCellRender={dateCellRender}  onSelect={handleSelectDate} onPanelChange={handleChangePanel} onChange={handleChangeDate} fullscreen={true} locale={locale} />
            </Drawer>
        </div>
    )
}
export default class QuizList extends React.Component {
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
                { title : '期数', dataIndex: 'id', key: 'id', render:(text) => <span>第{text}期竞猜</span>},
                { title: '竞猜题目', dataIndex: 'title', key: 'title', width: 220 },
                { title: '结果', dataIndex: 'correctAnswer', key: 'correctAnswer', render:(text) => (
                    <span style={{color: text === '涨' ? 'red' : 'green'}}>{text}</span>
                ) },
                { title: '开盘指数', dataIndex: 'openPrice', key: 'openPrice' },
                { title: '收盘指数', dataIndex: 'closePrice', key: 'closePrice' },
                { title: '初始元宝分', dataIndex: 'initScore', key: 'initScore' },
                { title: '总元宝分', dataIndex: 'pool', key: 'pool' },
                { title: '状态', dataIndex: 'titleStatus', key: 'titleStatus', render:(text) => <Tags text={text}/> },
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                { title: '操作', dataIndex: 'oper', key: 'oper', render:(text, record) => <a onClick={() => this.handleDetail(record)}>详情</a>},
            ],
            dataSource: []
        }
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
            url: config.url_list.getQuizList,
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



    componentDidMount() {
        const { pagination } = this.state
        const param = {
            page: pagination.current,
            pageSize: pagination.pageSize
        }
        Fetch({
            url: config.url_list.getQuizList,
            method: 'GET',
            queryData: param
        }).then(res => {
            if (res.data.data.code === 200) {
                pagination.total = res.data.data.data[1]
                this.setState({
                    dataSource: res.data.data.data[0]
                })
            }
        })
    }

    handleDetail = e => {
        const id = e.id 
        this.props.history.push('./edit?id='+id)
    }

   

    render() {
        const { columns, dataSource, pagination } = this.state
        return (
            <div>
                <div><DrawerComponent/></div>
                <Table
                rowKey={record => record.id}
                columns={columns}
                scroll={{x: 1200, y: window.innerHeight*0.6}}
                dataSource={dataSource}
                pagination={pagination}
                ></Table>
            </div>
        )
    }
}