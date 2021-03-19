import React from 'react';
import { Form, Button, Input, Row, Col, Select, DatePicker, InputNumber, message, Table, Avatar } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons'
import Fetch from '../../config/fetch';
import config from '../../config/config';
import moment from 'moment';
const { url_list } = config
const { Option } = Select
const { Item } = Form



function ComponentTable(props) {

    const { dataSource, loading, pagination, parentProps } = props
    const columns = [
        { title: '姓名', dataIndex: 'userName', key: 'userName' },
        { title: '公司', dataIndex: 'company', key: 'company', width: 250 },
        { title: '答案', dataIndex: 'answer', key: 'answer', render:(text) => (
            <span style={{color: text === '涨' ? 'red':'green'}}>{text}</span>
        ) },
        { title: '竞猜时间', dataIndex: 'answerTime', key: 'answerTime', width: 160 },
        { title: '头像', dataIndex: 'avatar', key: 'avatar', render:(text, record) => (
            <Avatar src={text}/> )},
        { title: '投注元宝分', dataIndex: 'spend', key: 'spend' },
        { title: '赢取元宝分', dataIndex: 'inCome', key: 'inCome' }

    ]

    const exportExcel = () => {
        let id = parentProps.location.search.split('=')[1]
        Fetch({
            url: url_list.exportQuizAnswerListToExcel,
            method: 'GET',
            queryData: {
                id: id
            }
        }).then(res => {
            if (res.data.data.code === 200) {
                window.open(res.data.data.url)
            }
        })
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent: "space-between", margin: '10px 0'}}>
                <h3 style={{fontWeight: 600}}>竞猜统计</h3>
                <Button type="dashed" onClick={() => exportExcel()}>导出Excel</Button>
            </div>
            <Table
            columns={columns}
            rowKey={record => record.id}
            dataSource={dataSource}
            loading={loading}
            scroll={{x: 800, y: window.innerHeight*0.25}}
            pagination={pagination}
            size='small'
            ></Table>
        </div>
    )
}

export default class EditQuiz extends React.Component {

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
                period: { label: '期数', rules: [{required: false, message: ''}], disabled: true },
                title: { label: '竞猜题目', rules: [{required: false, message: ''}], disabled: true },
                correctAnswer: { label: '正确答案',rules: [{required: false, message: ''}], disabled: true },
                titleStatus: { label: '状态', rules: [{required: false, message: ''}], disabled: true },
                initScore: { label: '初始元宝分', rules: [{required: false, message: ''}], disabled: false },
                pool: { label: '总元宝分', rules: [{required: false, message: ''}], disabled: true },
                openPrice: { label: '开盘指数', rules: [{required: false, message: ''}], disabled: true },
                closePrice: { label: '收盘指数', rules: [{required: false, message: ''}], disabled: true },
                
            },
            btnDisabled: false,
            loading: true,
        }
    }

    formRef = React.createRef()

    componentDidMount() {
        let id = this.props.location.search.split('=')[1]
        Fetch({
            url: config.url_list.getQuizInfoWithAnswersById,
            method: 'GET',
            queryData: {
                id
            }
        }).then(res => {
            if (res.data.data.code === 200) {
                const data = res.data.data.data
                data.answers.map(item => {
                    item.answerTime = moment(item.answerTime).format('YYYY-MM-DD HH:mm:ss')
                })
                
                this.formRef.current.setFieldsValue({
                    titleStatus: data.titleStatus,
                    correctAnswer: data.correctAnswer,
                    title: data.title,
                    initScore: data.initScore,
                    pool: data.pool,
                    openPrice: data.openPrice,
                    closePrice: data.closePrice,
                    period: `第${data.id}期竞猜`
                })
                this.setState({
                    loading: false,
                    dataSource: data.answers,
                    labelProperty: this.transDisabled(data.titleStatus).labelProperty,
                    btnDisabled: this.transDisabled(data.titleStatus).btnDisabled
                })
            }
        })
    }

    transDisabled = status => {
        let { labelProperty, btnDisabled } = this.state
        for (let key in labelProperty) {
            if (Object.prototype.hasOwnProperty.call(labelProperty, key)) {
                if (status === '进行中') {
                    labelProperty['initScore'].disabled = false;
                    btnDisabled = false;
                } else {
                    labelProperty['initScore'].disabled = true;
                    btnDisabled = true;
                }
            }
        }
        return {
            labelProperty,
            btnDisabled
        }
    }



    onFinish = v => {
        let id = this.props.location.search.split('=')[1]
        const initScore = v.initScore
        Fetch({
            url: config.url_list.updateInitScore,
            formData: {
                initScore,
                id
            },
            method: 'PUT'
        }).then(res => {
            if (res.data.data.code === 200) {
                message.success('操作成功')
                setTimeout(() => {
                    this.props.history.goBack()
                }, 1500);
            } else {
                message.error(JSON.stringify(res.data.data))
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

    handleClickNotice = () => {
        let id = this.props.location.search.split('=')[1] - 1
        Fetch({
            url: config.url_list.sendActivityNoticeToMember,
            method: 'POST',
            formData: {
                id
            }
        }).then(res => {
            if (res.data.code === 200) {
                message.success('操作成功')
            } else {
                message.error('操作失败')
            }
        })
    }

    render() {
        const { labelProperty,  btnDisabled, loading, pagination, dataSource } = this.state
        const formItemArr = []
        const formItemLayout = {
            labelCol: {
				xs: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 16 },
			},
        }
        for (let key in labelProperty) {
            if (Object.prototype.hasOwnProperty.call(labelProperty, key)) {
                formItemArr.push(<Col key={key} span={12}><Item {...formItemLayout} label={labelProperty[key].label} name={key} rules={labelProperty[key].rules}>
                    <Input disabled={labelProperty[key].disabled}/>
                </Item></Col>)
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
                        <Button disabled={btnDisabled} style={{marginRight: 50}} type='dashed' onClick={() => this.handleClickNotice()}>提醒</Button>
                        <Button disabled={btnDisabled} style={{marginRight: 50}} type='primary' htmlType='submit'>提交</Button>
                        <Button type='default' onClick={() => this.props.history.goBack()}>返回</Button>
                    </Item>
                </Form>
                <div>
                   <ComponentTable dataSource={dataSource} loading={loading} pagination={pagination} parentProps={this.props}/>
                </div>
            </div>
        )
    }
    
}
