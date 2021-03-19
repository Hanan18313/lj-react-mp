import React, {useState, useEffect} from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, DatePicker, Row, Col, Select, message, Avatar, Table, Steps, InputNumber, Checkbox} from 'antd';
import { CloseOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Fetch from '../../config/fetch';
import CONFIG from '../../config/config'
import Axios from 'axios';
import moment from 'moment'
const { url_list, DOMAIN } = CONFIG

const { Option } = Select
const FormItem = Form.Item
const Step = Steps.Step


class AppendIssueItems extends React.Component {
    constructor () {
        super()
        this.state = {
            issues: [],
            disabled: false,
        }
    }
    componentWillReceiveProps(parentProps){

        this.setState({
            issues: parentProps.issues,
            disabled: parentProps.disabled
        })
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    handleAddIssue = () => {
        const appendIssue = {
            topic: '',
            options: ['','','',''],
            correctResult: 'A',
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

    // handleChangeTotal = (e, k) => {
    //     const { issues } = this.state
    //     issues[k].total = e
    //     this.setState({
    //         issues,
    //     })
    // }

    // handleChangeCheckBox = (e, k) => {

    //     const { issues } = this.state
    //     e.target.checked === false ?
    //     issues[k].total = '' :
    //     issues[k].total = '1'
    //     this.setState({
    //         issues
    //     })
    // }

    render() {

        const { issues, disabled } = this.state
        const renderIssueArr = [];
        
        issues.map((issue, index) => {
            const issueItem = [];
            for (let key in issue) {
                if (key === 'topic') {
                    issueItem.push(
                        <div key={key} className="topic">
                            <Row style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                                <Col style={{display:'flex', justifyContent: 'flex-end'}} span={6}>问题：</Col>
                                <Col span={18}><Input disabled={disabled} defaultValue={issue[key]} onChange={(v) => this.handleInputTopic(v,index) } /></Col>
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
                                    <Col span={18}><Input disabled={disabled} defaultValue={item} onChange={(v) => this.handleInputOption(v, index, idx)} /></Col>
                                </Row>
                            </div> 
                        )
                    })
                    issueItem.push(<div className="options" key={key}>{optionArr}</div>)
                } else if (key === 'correctResult')  {
                    issueItem.push(
                        <div key={key} className="solution">
                            <Row style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                                <Col style={{display:'flex', justifyContent: 'flex-end'}} span={6}>正确答案：</Col>
                                <Col span={18}>
                                <Select defaultValue={issue[key]} onChange={(e) => this.handleSelectSolution(e,index)} disabled={disabled}>
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
                //  else if (key === 'total') {
                //     issueItem.push(
                //         <div key={key} className="total">
                //             <Row style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                //                 <Col style={{display:'flex', justifyContent: 'flex-end'}} span={6}>
                //                     <Checkbox disabled={disabled} defaultChecked={issue[key] === '' ? false : true} onChange={(e) => this.handleChangeCheckBox(e, index)}>数量：</Checkbox>
                //                 </Col>
                //                 <Col span={18}>
                //                     <InputNumber min={1} max={1000} value={issue[key]} onChange={(e) => this.handleChangeTotal(e, index)} disabled={disabled ? true : issue[key] === '' ? true : false}/>
                //                 </Col>
                //             </Row>
                //         </div>
                //     )
                // }
            }
            renderIssueArr.push(
                <div key={index} style={{width: '50%'}}>
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}><Button disabled={disabled} type="primary" type="link" icon={<CloseOutlined />} onClick={() => this.handleDeleteIssue(index)}></Button></div>
                    <div className="issueItem" >{issueItem}</div>
                </div>
            
            )
        })
        return (
            <div style={{paddingBottom: 50}}>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {renderIssueArr}
                    <div style={{width:'50%'}} >
                        <Row style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                            <Col style={{display:'flex', justifyContent: 'flex-end'}} span={6}></Col>
                            <Col span={18}>
                                <Button disabled={disabled} type="dashed" onClick={() => this.handleAddIssue()} icon={<LegacyIcon type={PlusCircleOutlined} />}>
                                 添加问题
                            </Button></Col>
                        </Row>
                    </div>    
                </div>
                
            </div>
        );
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

class EditIssueForm extends React.Component {
    constructor() {
        super()
        this.state = {
            labelProperty: {
                title: { label: '标题', rules: [{required: true, message: '请输入奖品名称'}]},
                score: { label: '分值', rules: [{required: true, message: '请输入元宝分值'}] },
                deadline: { label: '截止时间', rules: [{type: 'object',required: true, message: '请选择时间'}] },
                total: { label: '数量', rules: [{required: false}], checkTotalBox: false, checkBoxDisabeld: false },
                status: { label: '问卷当前状态' }
            },
            issues: [],
            disabled: false,
            dataSource: [],
            column: column,
            nextStatus: '',
            lastestStatusDisabled: false,
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
        this.fetchAnswerList(id)
        this.fetchTitleInfo(id)
    }

    fetchTitleInfo = (id) => {
        Axios({
            url: DOMAIN + url_list.getEasyAnswerTitleById,
            method: "GET",
            params: {
                id: id
            }
        }).then(res => {
            if (res.data.data.code === 200) {
                const data = res.data.data.data[0]
                const { labelProperty } = this.state
                let disabled = false
               // const disabled = data.EaTitle_status === '未开始' ? false : true
                if (data.EaTitle_status === '未开始') {
                    disabled = false
                    labelProperty.total.checkBoxDisabeld = false
                    if (data.EaTitle_total && data.EaTitle_total > 0) {
                        labelProperty.total.checkTotalBox = true
                    } else {
                        labelProperty.total.checkTotalBox = false
                    }
                } else {
                    labelProperty.total.checkBoxDisabeld = true
                    disabled = true
                }
                const nextStatus = data.EaTitle_status === '未开始' ? '进行中' : '已关闭'
                const lastestStatusDisabled = data.EaTitle_status === '已关闭' ? true : false
                this.props.form.setFieldsValue({
                    title: data.EaTitle_title,
                    deadline: moment(data.EaTitle_deadline, 'YYYY-MM-DD'),
                    status: data.EaTitle_status,
                    score: data.EaTitle_score,
                    total: data.EaTitle_total
                })
                this.setState({
                    issues: data.issue,
                    nextStatus,
                    disabled,
                    lastestStatusDisabled,
                    labelProperty
                })
            }
            
        })
    }

    fetchAnswerList = (id) => {
        const dataSource = []
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
                data.answer.map(items => {
                    if (items.company.indexOf('杭州朗杰') === -1) {
                        dataSource.push(items)
                    }
                })
                this.setState({
                    issues: data.issue,
                    dataSource: dataSource
                })
            }
            
        })
    }
    exportExcel = () => {
        let id = this.props.location.search.split('=')[1]
        Fetch({
            url: url_list.exportAnswerInfoListToExcel,
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

    handleSubmitForm = (e) => {
        e.preventDefault()
        const { issues } = this.child.state
        let id = this.props.location.search.split('=')[1]
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(err){
                console.log(err)
            }else{
                Axios({
                    url: DOMAIN + url_list.updateEasyAnswerTitleInfo,
                    method: 'PUT',
                    data: {
                        id: id,
                        titleInfo: values,
                        issues
                    }
                }).then(res => {
                    if (res.data.data.code === 200) {
                        message.success('更新成功')
                        setTimeout(() => {
                            this.props.history.goBack()
                        }, 1000);
                    } else {
                        message.error('更新失败')
                    }
                })
            }
        })
    }

    handleDelete = () => {
        let id = this.props.location.search.split('=')[1]
        Axios({
            url: DOMAIN + url_list.deleteEasyAnswerTitleById,
            method: 'DELETE',
            data: {
                id,
            }
        }).then(res => {
            if (res.data.data.code === 200) {
                message.success('删除成功')
                setTimeout(() => {
                    this.props.history.goBack()
                }, 1000);
            }else {
                message.error('删除失败')
            }
        })
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

    handleChangeNextStatus = () => {

        let id = this.props.location.search.split('=')[1]
        const nextStatus = this.state.nextStatus
        const lastestStatusDisabled = nextStatus === '已关闭' ? true : false
        Axios({
            url: DOMAIN + url_list.updateTitleStatus,
            method: 'PUT',
            data: {
                id,
                status: nextStatus
            }
        }).then(res => {

            if (res.data.data.code === 200) {
                message.success('操作成功')
                setTimeout(() => {
                    this.props.history.goBack()
                }, 1000);
                this.setState({
                    lastestStatusDisabled,
                    nextStatus,
                    disabled: true
                })
                this.props.form.setFieldsValue({
                    status: nextStatus
                })
            }
        })
    }

    handleSendMessage = () => {
        Fetch({
            url: url_list.sendMessage,
            method: 'POST'
        }).then(res => {
            if (res.data.code === 200) {
                message.success('推送成功')
            }
        })
    }

    handleChangeCheckBox = (e, v) => {
        console.log(e)
        const { labelProperty } = this.state
        labelProperty.total.checkTotalBox = e.target.checked
        if (!e.target.checked) {
            this.props.form.setFieldsValue({
                total: undefined
            })
        } else {
            this.props.form.setFieldsValue({
                total: 1
            })
        }
        this.setState({
            labelProperty
        })
    }



    render() {
        const formItem = [];
        const { labelProperty, issues, pagination, dataSource, nextStatus, disabled, lastestStatusDisabled } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
			labelCol: {
				xs: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 16 },
			},
	    };
        for (let key in labelProperty) {
            if (key === 'deadline') {
                formItem.push(<Col key={key} span={12}>
                        <FormItem {...formItemLayout} label={labelProperty[key].label} >
                            {getFieldDecorator(key, {
                                    rules: labelProperty[key].rules
                                })(
                                    <DatePicker disabled={disabled} format={'YYYY-MM-DD'} />
                                )}
                        </FormItem>
                    </Col>)
            } else if (key === 'status') {
                formItem.push(<Col key={key} span={12}>
                    <FormItem {...formItemLayout} label={labelProperty[key].label} >
                        {getFieldDecorator(key, {
                                rules: labelProperty[key].rules
                            })(
                                <Input disabled={true} width={100} />
                            )}
                    </FormItem>
                </Col>)
            } else if (key === 'score') {
                formItem.push(<Col key={key} span={12}>
                    <FormItem {...formItemLayout} label={labelProperty[key].label}>
                    {getFieldDecorator(key, {
                        rules: labelProperty[key].rules
                    })(
                        <InputNumber min={0} disabled={disabled} name="" />
                    )}
                    </FormItem>
                </Col>)
            } else if (key === 'title') {
                formItem.push(<Col key={key} span={12}>
                    <FormItem {...formItemLayout} label={labelProperty[key].label} >
                    {getFieldDecorator(key, {
                        rules: labelProperty[key].rules
                    })(
                        <Input disabled={disabled} name="" />
                    )}
                    </FormItem>
                </Col>)
            } else {
                formItem.push(<Col key={key} span={12}>
                    <FormItem {...formItemLayout} label={<Checkbox disabled={labelProperty.total.checkBoxDisabeld} checked={labelProperty.total.checkTotalBox} onChange={(e) => this.handleChangeCheckBox(e, key)}>数量：</Checkbox>} >
                    {getFieldDecorator(key, {
                        rules: labelProperty[key].rules
                    })(
                        <InputNumber min={1} max={999} disabled={!labelProperty.total.checkTotalBox} name="" />
                    )}
                    </FormItem>
                </Col>)
            }
        }
        return (
            <div style={{height: '100%', overflow: 'auto'}}>
                <Form onSubmit={this.handleSubmitForm}>
                    {/* <Row>{formItem.map((item, index) => <div key={index}>{item}</div>)}</Row> */}
                    <Row>{formItem}</Row>
                    <AppendIssueItems onRef={(ref) => this.child = ref} issues={issues} disabled={disabled}></AppendIssueItems>
                    <FormItem style={{textAlign:'center'}}>
                        <Button type='primary' disabled={disabled} htmlType="submit" style={{marginRight:50}}>提交</Button>
                        <Button type='primary' disabled={lastestStatusDisabled} style={{marginRight:50}} onClick={() => this.handleSendMessage()}>消息推送</Button>
                        <Button type='default' style={{marginRight:50}} onClick={() => {this.props.history.goBack()}}>返回</Button>
                        <Button type="dashed" disabled={lastestStatusDisabled} style={{marginRight:50}} onClick={() => this.handleChangeNextStatus()}>切换下一状态（{nextStatus}）</Button>
                        <Button type="danger"  onClick={() => this.handleDelete()}>删除</Button>
                    </FormItem>
                </Form>
                <div className="table">
                    <div style={{display: 'flex', justifyContent: "space-between", margin: '10px 0'}}>
                        <h3 style={{fontWeight: 600}}>问卷统计</h3>
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

const EditIssue= Form.create()(EditIssueForm)
export default EditIssue

