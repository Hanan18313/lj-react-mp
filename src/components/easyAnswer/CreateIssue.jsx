import React, {useState, useEffect} from 'react';
import { Form, Input, Button, DatePicker, Row, Col, Select, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons'
import Fetch from '../../config/fetch';
import CONFIG from '../../config/config'
import Axios from 'axios';
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

    componentDidMount() {
        this.props.onRef(this)
    }
    handleAddIssue = () => {
        const appendIssue = {
            topic: '',
            options: ['','','',''],
            correctResult: 'A'
        };
        const issues = this.state.issues
        issues.push(appendIssue)
        this.setState({
            issues: issues
        })

    }

    handleDeleteIssue = (e) => {

        const issues = this.state.issues
        issues.splice(e, 1)
        this.setState({
            issues
        })
    }

    handleInputTopic = (e, k) => {
        const { issues } = this.state
        issues[k].topic = e.target.value
        this.setState({
            issues
        })

    }
    handleInputOption = (e, i, k) => {

        const { issues } = this.state
        issues[i].options[k] = e.target.value
        this.setState({
            issues
        })

    }
    handleSelectSolution = (e, k) => {
       // console.log(e)
        const { issues } = this.state
        issues[k].correctResult = e
        this.setState({
            issues
        })
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
                                <Col span={18}><Input defaultValue={issue[key]} onChange={(v) => this.handleInputTopic(v,index) } /></Col>
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
                                    <Col span={18}><Input defaultValue={item} onChange={(v) => this.handleInputOption(v, index, idx)} /></Col>
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
                                <Select defaultValue="A" onChange={(e) => this.handleSelectSolution(e,index)}>
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
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}><Button type="primary" type="link" icon="close" onClick={() => this.handleDeleteIssue(index)}></Button></div>
                    <div className="issueItem" >{issueItem}</div>
                </div>
            
            )
        })
        return (
            <div style={{paddingBottom: 50}}>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {renderIssueArr}
                    <div style={{width:'50%'}}>
                        <Row style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                            <Col style={{display:'flex', justifyContent: 'flex-end'}} span={6}></Col>
                            <Col span={18}>
                                <Button type="dashed" onClick={() => this.handleAddIssue()} icon={PlusCircleOutlined}>
                                添加问题
                            </Button></Col>
                        </Row>
                    </div>    
                </div>
                
            </div>
        )
    }
}




class CreateIssue extends React.Component {
    constructor() {
        super()
        this.state = {
            labelProperty: {
                title: { label: '标题', rules: [{required: true, message: '请输入奖品名称'}]},
                deadline: { label: '截止时间', rules: [{required: true, message: '请选择时间'}] }
            },
        }
    }

    componentDidMount() {}

    handleSubmitForm = (e) => {
        e.preventDefault()
        const { issues } = this.child.state
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(err){
                console.log(err)
            }else{
                Axios({
                    url: DOMAIN + url_list.createEasyAnswerTitleInfo,
                    method: 'POST',
                    data: {
                        issues,
                        titleInfo: values
                    }
                }).then(res => {
                    if (res.data.code === 200) {
                        message.info('新增成功')
                    }
                })
            }
        })
    }

    handleDelete = () => {

    }

    handleAddIssue = () => {
        let id = 0
        const { form } = this.props
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(id++)
        form.setFieldsValue({
            keys: nextKeys
        })
        
    }

    render() {
        const formItem = [];
        const { labelProperty } = this.state;
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
                            <DatePicker/>
                        )}
                </FormItem>)
            } else {
                formItem.push(<FormItem {...formItemLayout} label={labelProperty[key].label} >
                    {getFieldDecorator(key, {
                            rules: labelProperty[key].rules
                        })(
                            <Input name="" />
                        )}
                </FormItem>)
            }
            
        }
        return (
            <div style={{height: '100%', overflow: 'auto'}}>
                <Form onSubmit={this.handleSubmitForm}>
                    {formItem.map((item, index) => <div key={index}>{item}</div>)}
                    <AppendIssueItems onRef={(ref) => this.child = ref}></AppendIssueItems>
                    <FormItem style={{textAlign:'center'}}>
                    <Button type='primary' htmlType="submit" style={{marginRight:50}}>提交</Button>
                    <Button type='default' style={{marginRight:50}} onClick={() => {this.props.history.goBack()}}>返回</Button>
                    <Button type="danger" onClick={() => this.handleDelete}>删除</Button>
                </FormItem>
                </Form>
            </div>
        )
    }
}

const CreateIssueForm = Form.create()(CreateIssue)
export default CreateIssueForm

