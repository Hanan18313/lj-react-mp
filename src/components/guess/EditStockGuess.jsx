import React from 'react';
import { Form, Button, Input, Row, Col, Select, DatePicker, InputNumber, message, Table, Avatar } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons'
import Fetch from '../../config/fetch';
import config from '../../config/config';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
const { Option } = Select
const { Item } = Form



function ComponentTable(props) {
    const { titles, loading, pagination } = props

    const expandedRowRender = () => {
        const columns = [
            { title: '答案', dataIndex: 'answer', key: 'answer' },
            { title: '提交时间', dataIndex: 'answerTime', key: 'answerTime' },
            { title: '姓名', dataIndex: 'userName', key: 'userName' },
            { title: '电话', dataIndex: 'phone', key: 'phone' },
            { title: '公司', dataIndex: 'company', key: 'company' },
            { title: '头像', dataIndex: 'avatar', key: 'avatar', render:(text, record) => (
                <Avatar src={text}/> )},
            { title: '投注分', dataIndex: 'spend', key: 'spend' },
            { title: '赢取分', dataIndex: 'inCome', key: 'inCome' }

        ]
        const data = []
        for (let i = 0; i < 33; ++i) {
            data.push({
              key: i,
              answer: '涨',
              answerTime: '2020-12-10 15:22:22',
              userName: '韩维龙',
              phone: '17328867149',
              company: '杭州朗杰',
              avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/7t7xrUArib83fsxRPtgRJTTL6BI9rkLAeX4OhzymeTsEicJZaVRGl2amtXcXLAKo3CCQq4wL8uXiaVPmiaSaabuKUw/132',
              spend: '20',
              inCome: '0'
            });
          }
        return <Table columns={columns} dataSource={data} pagination={false}/>
    }



    const columns = [
        { title: '竞猜题目', dataIndex: 'title', key: 'title', width: 220 },
        { title: '涨跌结果', dataIndex: 'solution', key: 'solution' },
        { title: '状态', dataIndex: 'titleStatus', key: 'titleStatus' },
        { title: '开市价格', dataIndex: 'openPrice', key: 'openPrice' },
        { title: '闭市价格', dataIndex: 'closePrice', key: 'closePrice' },
        { title: '奖品池', dataIndex: 'pool', key: 'pool' },
        { title: '参加人数', dataIndex: 'total', key: 'total' }
    
    ]

    return (
        <div>
            <h3 style={{fontWeight: 600}}>竞猜统计</h3>
            <Table
            columns={columns}
            rowKey={record => record.id}
            dataSource={titles}
            loading={loading}
            scroll={{x: 800, y: window.innerHeight*0.4}}
            pagination={pagination}
            expandable={{expandedRowRender}}
            ></Table>
        </div>
    )
}

export default class CreateGuess extends React.Component {

    constructor() {
        super()
        this.state = {
            pagination: {
                current: 1,
                pageSize: 500,
                total: 0,
                showTotal:(total) => {
                    return(
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <p style={{paddingRight:40,fontSize:'16px'}}>总数：{total}</p>
                        </div>
                    )
                },
            },
            labelProperty: {
                topic: { label: '标题', rules: [{required: true, message: '请输入标题'}], disabled: false },
                topicStatus: { label: '状态', rules: [{required: true, message: ''}], disabled: true },
                type: { label: '竞猜题目类型', rules: [{required: true, message: '请选择竞猜题目类型'}], disabled: true },
                createTime: { label: '创建时间', rules: [{required: true, message: ''}], disabled: true },
                noGuessLatestScore: { label: '免猜最低分', rules: [{required: true, message: '请输入最低分数'}], disabled: false },
                openMemType: { label: '竞猜会员类型', rules: [{required: true, message: '请选择竞猜类型'}], disabled: false },
                startTime: { label: '开始时间', rules: [{required: true, message: '请选择时间'}], disabled: false },
                endTime: { label: '截止时间', rules: [{required: true, message: '请选择时间'}], disabled: false },
                rule: { label: '竞猜规则', rules: [{required: true, message: '请输入竞猜规则'}], disabled: false },
                instruct: { label: '备注', rules: [{required: true, message: ''}], disabled: false },
                
            },
            nextStatus: [],
            btnDisabled: false,
            loading: true,
            titles: []
        }
    }

    formRef = React.createRef()

    componentDidMount() {
        let id = this.props.location.search.split('=')[1]
        Fetch({
            url: config.url_list.getStockGuessTopicAndTitles,
            method: 'GET',
            queryData: {
                id
            }
        }).then(res => {
            console.log(res)
            if (res.data.data.code === 200) {
                const data = res.data.data.data
                const titles = data.stockGuessTitle

                this.formRef.current.setFieldsValue({
                    topicStatus: data.topicStatus,
                    type: data.type,
                    openMemType: data.openMemType,
                    createTime: moment(data.createTime, 'YYYY-MM-DD'),
                    startTime: data.startTime === null ? data.startTime : moment(data.startTime, 'YYYY-MM-DD'),
                    endTime: data.endTime === null ? data.endTime : moment(data.endTime, 'YYYY-MM-DD'),
                    topic: data.topic,
                    noGuessLatestScore: data.noGuessLatestScore,
                    rule: data.rule,
                })
                this.setState({
                    nextStatus: this.changedStatus(data.topicStatus),
                    labelProperty: this.disabledDis(data.topicStatus).labelProperty,
                    btnDisabled: this.disabledDis(data.topicStatus).btnDisabled,
                    titles: titles,
                    loading: false
                })
            }
        })
    }

    disabledDis = status => {
        let { labelProperty, btnDisabled } = this.state
        for (let key in labelProperty) {
            if (Object.prototype.hasOwnProperty.call(labelProperty, key)) {
                if (status === '进行中') {
                    if (key === 'correctAnswer') {
                        labelProperty[key].disabled = false
                    } else {
                        labelProperty[key].disabled = true
                    }
                } else if (status === '已结束') {
                    labelProperty[key].disabled = true
                    btnDisabled = true
                }
            }
        }
        return {
            labelProperty,
            btnDisabled
        }
    }


    changedStatus = status => {
        let nextStatus = ''
        if (status === '未开始') {
            nextStatus = '进行中'
        } else if (status === '进行中') {
            nextStatus = '已结束'
        } else {
            nextStatus = '已结束'
        }
        return nextStatus
    }

    onFinish = v => {
        console.log(v)
        let id = this.props.location.search.split('=')[1]
        v.id = id
        Fetch({
            url: config.url_list.updateStockGuessTopicInfo,
            formData: v,
            method: 'PUT'
        }).then(res => {
            if (res.data.data.code === 200) {
                message.success('操作成功')
                setTimeout(() => {
                    this.props.history.goBack()
                }, 1500);
            } else {
                message.error('缺少参数')
            }
        })
    }

    handleDeleteTitle = () => {
        let id = this.props.location.search.split('=')[1]
        Fetch({
            url: config.url_list.deleteGuessTopicById,
            method: 'DELETE',
            formData: {
                id
            }
        }).then(res => {
            if (res.data.data.code === 200) {
                message.success('删除成功')
                setTimeout(() => {
                    this.props.history.goBack()
                },1500)
            }
        })
    }

    handleChangeNextStatus = () => {
        let id = this.props.location.search.split('=')[1]
        const nextStatus = this.state.nextStatus
        Fetch({
            url: config.url_list.changeGuessTopicStatus,
            method: 'PUT',
            formData: {
                nextStatus,
                id
            }
        }).then(res => {
            if (res.data.data.code === 200) {
                this.setState({
                    nextStatus: res.data.data.data.currentStatus,
                    labelProperty: this.disabledDis(nextStatus).labelProperty
                })
                message.success('切换成功')
                setTimeout(() => {
                    this.props.history.goBack()
                }, 1500)
            }
        })
    }

    render() {
        const { labelProperty, nextStatus, btnDisabled, loading, pagination, titles } = this.state
        const formItemArr = []
        const formItemLayout = {
            labelCol: {
				xs: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 16 },
			},
        }
        const formItemLayout1 = {
            labelCol: {
                xs: {span: 4}
            },
            wrapperCol: {
				xs: { span: 20 },
			},
        }
        for (let key in labelProperty) {
            if (Object.prototype.hasOwnProperty.call(labelProperty, key)) {
                if (key === 'topicStatus') {
                    formItemArr.push(<Col key={key} span={12}><Item {...formItemLayout} label={labelProperty[key].label} name={key} rules={labelProperty[key].rules}>
                        <Input disabled={labelProperty[key].disabled}/>
                    </Item></Col>)
                } else if (key === 'openMemType') {
                    formItemArr.push(<Col key={key} span={12}><Item {...formItemLayout} label={labelProperty[key].label} name={key} rules={labelProperty[key].rules}>
                        <Select style={{width: 120}} disabled={labelProperty[key].disabled}>
                            <Option value='所有会员'>所有会员</Option>
                            <Option value='商务会员'>商务会员</Option>
                        </Select>
                    </Item></Col>)
                    
                } else if (key === 'type') {
                    formItemArr.push(<Col key={key} span={12}><Item {...formItemLayout} label={labelProperty[key].label} name={key} rules={labelProperty[key].rules}>
                        <Select style={{width: 160}} disabled={labelProperty[key].disabled}>
                            <Option value='其它活动竞猜'>其它活动竞猜</Option>
                            <Option value='股票每日竞猜'>股票每日竞猜</Option>
                        </Select>
                    </Item></Col>)
                } else if (key === 'createTime' || key === 'startTime' || key === 'endTime') {
                    formItemArr.push(<Col key={key} span={12}>
                        <Item {...formItemLayout} label={labelProperty[key].label} name={key} rules={labelProperty[key].rules}>
                            <DatePicker disabled={labelProperty[key].disabled} format={'YYYY-MM-DD'} />
                        </Item>
                    </Col>)
                } else if (key === 'topic') {
                    formItemArr.push(<Col key={key} span={12}><Item {...formItemLayout} label={labelProperty[key].label} name={key} rules={labelProperty[key].rules}>
                        <Input disabled={labelProperty[key].disabled}/>
                    </Item></Col>)
                }else if (key === 'noGuessLatestScore') {
                    formItemArr.push(<Col key={key} span={12}>
                        <Item {...formItemLayout} label={labelProperty[key].label} name={key} rules={labelProperty[key].rules}>
                            <InputNumber min={0} disabled={labelProperty[key].disabled}/>
                        </Item>
                    </Col>)
                } else if (key === 'rule') {
                    formItemArr.push(<Col key={key} span={24}>
                        <Item {...formItemLayout1} label={labelProperty[key].label} name={key} rules={labelProperty[key].rules} tooltip={{title: '每条规则间用中文句号隔开。', icon: <InfoCircleOutlined/>}}> 
                            <TextArea disabled={labelProperty[key].disabled} />
                        </Item>
                    </Col>)
                }
            }
        }
        return (
            <div>
                <Form
                ref={this.formRef}
                onFinish={this.onFinish}
                >
                    <Row>{formItemArr}</Row>
                    <Item style={{textAlign: "center", paddingTop: 20}}>
                        <Button disabled={btnDisabled} style={{marginRight: 30}} type='primary' htmlType='submit'>提交</Button>
                        <Button style={{marginRight: 30}} type='default' onClick={() => this.props.history.goBack()}>返回</Button>
                        <Button disabled={btnDisabled} style={{marginRight: 30}} type='dashed' onClick={this.handleChangeNextStatus}>切换下一状态（{nextStatus}）</Button>
                        <Button type='primary' danger onClick={this.handleDeleteTitle}>删除</Button>
                    </Item>
                </Form>
                <div>
                   <ComponentTable titles={titles} loading={loading} pagination={pagination}/>
                </div>
            </div>
        )
    }
    
}
