import React, {useState, useEffect} from 'react';
import { Form, Input, Button, DatePicker, Icon, Row, Col, Select, message, Table, Avatar } from 'antd';
import Fetch from '../../config/fetch';
import CONFIG from '../../config/config'
import Axios from 'axios';
import moment from 'moment'
const { url_list, DOMAIN } = CONFIG

const { Option } = Select
const FormItem = Form.Item


class AppendIssueItems extends React.Component {
    constructor () {
        super()
        this.state = {
            issues: []
        }
    }
    componentWillReceiveProps(parentProps){
        this.setState({
            issues: parentProps.issues
        })
    }

    componentDidMount() {
        this.props.onRef(this)
    }


    render() {

        const { issues } = this.state
        const renderIssueArr = [];
        
        issues.map((issue, index) => {
            const issueItem = [];
            for (let key in issue) {
                if (key === 'topic') {
                    issueItem.push(
                        <div key={key} className="topic">
                            <Row style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                                <Col style={{display:'flex', justifyContent: 'flex-end'}} span={6}>问题：</Col>
                                <Col span={18}><Input disabled={true} defaultValue={issue[key]} onChange={(v) => this.handleInputTopic(v,index) } /></Col>
                            </Row>
                        </div> 
                    )
                } else if (key === 'options') {
                    const optionArr = []
                    const EN_LETTER = ['A','B','C','D']
                    issue[key].map((item, idx) => {
                        optionArr.push(
                            <div key={idx} className="option">
                                <Row style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                                    <Col style={{display:'flex', justifyContent: 'flex-end'}} span={6}>{EN_LETTER[idx]}选项：</Col>
                                    <Col span={18}><Input disabled={true} defaultValue={item} onChange={(v) => this.handleInputOption(v, index, idx)} /></Col>
                                </Row>
                            </div> 
                        )
                    })
                    issueItem.push(<div className="options" key={key}>{optionArr}</div>)
                } else  {
                    issueItem.push(
                        <div key={key} className="solution">
                            <Row style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                                <Col style={{display:'flex', justifyContent: 'flex-end'}} span={6}>正确答案：</Col>
                                <Col span={18}>
                                <Select defaultValue={issue[key]} onChange={(e) => this.handleSelectSolution(e,index)} disabled={true}>
                                    <Option value="A">A</Option>
                                    <Option value="B">B</Option>
                                    <Option value="C">C</Option>
                                    <Option value="D">D</Option>
                                </Select>
                                </Col>
                            </Row>
                        </div>
                    )
                }
            }
            renderIssueArr.push(
                <div key={index} style={{width: '50%'}}>
                    <div className="issueItem" >{issueItem}</div>
                </div>
            
            )
        })
        return (
            <div style={{paddingBottom: 50}}>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {renderIssueArr}
                </div>
            </div>
        )
    }
}


const column = [
    { title: '姓名', dataIndex: 'userName', key: 'userName' },
    { title: '公司', dataIndex: 'company', key: 'company', width: 250 },
    { title: '电话', dataIndex: 'phone', key: 'phone' },
    { title: '头像', dataIndex: 'avatar', key: 'avatar', render:(text, record) => (
        <Avatar src={text}/>
    )},
    { title: '答案', dataIndex: 'answer', key: 'answer', render:(text) => {
        if(text) return (<div>{JSON.parse(text).join(',')}</div>)
    }},
    { title: '答对个数', dataIndex: 'score', key: 'score' },
    { title: '作答时间', dataIndex: 'answerTime', key: 'answerTime', render:(text) => {
        if(text) return (<div>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>)
    }},

]

class IssueDetailForm extends React.Component {
    constructor() {
        super()
        this.state = {
            labelProperty: {
                title: { label: '标题', rules: [{required: true, message: '请输入奖品名称'}]},
                deadline: { label: '截止时间', rules: [{type: 'object',required: true, message: '请选择时间'}] }
            },
            issues: [],
            dataSource: [],
            column: column,
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
        }
    }

    componentDidMount() {
        let id = this.props.location.search.split('=')[1]
        Axios({
            url: DOMAIN + url_list.getEasyAnswerTitleByIdWithAnswerList,
            method: "GET",
            params: {
                id: id
            }
        }).then(res => {
            if (res.data.data.code === 200) {
                const data = res.data.data.data[0]
                this.props.form.setFieldsValue({
                    title: data.title,
                    deadline: moment(data.deadline, 'YYYY-MM-DD'),
                })
                this.setState({
                    issues: data.issue,
                    dataSource: data.answer
                })
            }
            
        })
    }

    exportExcel = () => {
        let id = this.props.location.search.split('=')[1]
        Axios({
            url: DOMAIN + url_list.exportAnswerInfoListToExcel,
            method: 'GET',
            params: {
                id: id
            }
        }).then(res => {
            if (res.data.data.code === 200) {
                window.open(res.data.data.url)
            }
        })
    }

    render() {
        const formItem = [];
        const { labelProperty, issues, column, dataSource, pagination } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
			labelCol: {
				xs: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 12 },
			},
	    };
        for (let key in labelProperty) {
            if (key === 'deadline') {
                formItem.push(<FormItem {...formItemLayout} label={labelProperty[key].label} >
                    {getFieldDecorator(key, {
                            rules: labelProperty[key].rules
                        })(
                            <DatePicker disabled={true} format={'YYYY-MM-DD'} />
                        )}
                </FormItem>)
            } else {
                formItem.push(<FormItem {...formItemLayout} label={labelProperty[key].label} >
                    {getFieldDecorator(key, {
                            rules: labelProperty[key].rules
                        })(
                            <Input disabled={true} name="" />
                        )}
                </FormItem>)
            }
            
        }
        return (
            <div style={{height: '100%', overflow: 'auto'}}>
                <Form onSubmit={this.handleSubmitForm}>
                    {formItem.map((item, index) => <div key={index}>{item}</div>)}
                    <AppendIssueItems onRef={(ref) => this.child = ref} issues={issues}></AppendIssueItems>
                </Form>
                <div className="table">
                    <div style={{display: 'flex', justifyContent: "space-between", margin: '10px 0'}}>
                        <h3 style={{fontWeight: 600}}>问答统计</h3>
                        <Button type="dashed" onClick={() => this.exportExcel()}>导出Excel</Button>
                    </div>
                    <Table
                    rowKey={record => record.id}
                    columns={column}
                    dataSource={dataSource}
                    scroll={{x: 1000, y: window.innerHeight*0.3}}
                    size="small"
                    pagination={pagination}
                    ></Table>
                </div>
            </div>
        )
    }
}

const IssueDetail= Form.create()(IssueDetailForm)
export default IssueDetail

