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
    const { answerList, loading, pagination } = props
    const columns = [
        { title: '姓名', dataIndex: 'userName', key: 'userName' },
        { title: '公司', dataIndex: 'company', key: 'company' },
        { title: '电话', dataIndex: 'phone', key: 'phone' },
        { title: '头像', dataIndex: 'avatar', key: 'avatar', render:(text, record) => (
            <Avatar src={text}/>
        )},
        { title: '地址', dataIndex: 'address', key: 'address'},
        { title: '状态', dataIndex: 'answerStatus', key: 'answerStatus' },
        { title: '所选选项', dataIndex: 'answer', key: 'answer' },
        { title: '选择时间', dataIndex: 'answerTime', key: 'answerTime', render:(text) => {
            if(text) return (<div>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>)
        }},
        { title: '所选奖品', dataIndex: 'selectedReward', key: 'selectedReward' },
        { title: '快递单号', dataIndex: 'expressNo', key: 'expressNo' },
        { title: '操作', dataIndex: 'oper', key: 'oper', render:() => (<a>编辑</a>) }
    
    ]

    return (
        <div>
            <h3 style={{fontWeight: 600}}>竞猜统计</h3>
            <Table
            columns={columns}
            rowKey={record => record.id}
            dataSource={answerList}
            loading={loading}
            scroll={{x: 1200, y: window.innerHeight*0.5}}
            pagination={pagination}
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
                            <p style={{paddingRight:40,fontSize:'16px'}}>人数：{total}</p>
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
                title: { label: '竞猜题目', rules: [{required: true, message: '请输入竞猜题目'}], disabled: false },
                options: { label: '可选选项', rules: [{required: true, message: '请输入可选项'}], disabled: false },
                reward: { label: '奖励（选择其一）', rules: [{required: true, message: '请输入奖励'}], disabled: false },
                correctAnswer: { label: '正确答案', rules: [{required: false, message: '请选择正确答案'}], disabled: false },
                rule: { label: '竞猜规则', rules: [{required: true, message: '请输入竞猜规则'}], disabled: false },
                instruct: { label: '备注', rules: [{required: true, message: ''}], disabled: false },
                
            },
            availOptions: [],
            nextStatus: [],
            btnDisabled: false,
            answerList: [],
            loading: true
        }
    }

    formRef = React.createRef()

    componentDidMount() {
        let id = this.props.location.search.split('=')[1]
        Fetch({
            url: config.url_list.getActiveGuessTopicInfoById,
            method: 'GET',
            queryData: {
                id
            }
        }).then(res => {
            console.log(res)
            if (res.data.data.code === 200) {
                const data = res.data.data.data[0]
                const titleInfo = data.activeGuessTitle[0]
                const answerList = titleInfo.activeAnswers
                const options = titleInfo.options === null ? [] : typeof titleInfo.options === 'string' ? JSON.parse(titleInfo.options) : titleInfo.options
                const reward = titleInfo.reward === null ? [] : typeof titleInfo.reward === 'string' ? JSON.parse(titleInfo.reward) : titleInfo.reward
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

                    title: titleInfo.title,
                    options: options,
                    correctAnswer: titleInfo.correctAnswer,
                    reward: reward,
                })
                this.setState({
                    availOptions: options,
                    nextStatus: this.changedStatus(data.topicStatus),
                    labelProperty: this.disabledDis(data.topicStatus).labelProperty,
                    btnDisabled: this.disabledDis(data.topicStatus).btnDisabled,
                    answerList: answerList,
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

        let id = this.props.location.search.split('=')[1]
        v.id = id
        Fetch({
            url: config.url_list.updateActiveGuessTopicInfo,
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
        const { labelProperty, availOptions, nextStatus, btnDisabled, answerList, loading, pagination } = this.state
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
                xs: {span: 6}
            },
            wrapperCol: {
				xs: { span: 12 },
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
                } else if (key === 'options') {
                    formItemArr.push(<Col key={key} span={24}>
                        <Item {...formItemLayout1} label={labelProperty[key].label} name={key} rules={labelProperty[key].rules}>
                            <Select disabled={labelProperty[key].disabled} mode='tags' onChange={this.handleOnChangeOptions} tokenSeparators={[',']}></Select>
                        </Item>
                    </Col>)
                } else if (key === 'noGuessLatestScore') {
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
                } else if (key === 'correctAnswer') {
                    formItemArr.push(<Col key={key} span={24}>
                        <Item {...formItemLayout1} label={labelProperty[key].label} name={key} rules={labelProperty[key].rules}>
                            <Select disabled={labelProperty[key].disabled} style={{width: 200}}>{availOptions.map((item, index) => <Option key={index} value={item}>{item}</Option>)}</Select>
                        </Item>
                    </Col>)
                } else if (key === 'reward') {
                    formItemArr.push(<Col key={key} span={24}>
                        <Item {...formItemLayout1} label={labelProperty[key].label} name={key} rules={labelProperty[key].rules}>
                            <Select mode='tags' disabled={labelProperty[key].disabled}></Select>
                        </Item>
                    </Col>)
                } else if (key === 'title') {
                    formItemArr.push(<Col key={key} span={24}><Item {...formItemLayout1} label={labelProperty[key].label} name={key} rules={labelProperty[key].rules}>
                        <Input disabled={labelProperty[key].disabled}/>
                    </Item></Col>)
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
                   <ComponentTable answerList={answerList} loading={loading} pagination={pagination}/>
                </div>
            </div>
        )
    }
    
}
