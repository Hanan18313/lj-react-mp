import React from 'react';
import { Form, Button, Select, Input, InputNumber, message, } from 'antd';
import Fetch from '../../config/fetch';
import config from '../../config/config'
import { withRouter } from 'react-router';
const { Option } = Select


const CreateGuess = props => {

    const [ form ] = Form.useForm()

    const labelProperty = {
        topic: { label: '标题', rules: [{required: true, message: '请输入标题'}]},
        type: { label: '竞猜类型', rules: [{required: true, message: '请选择竞猜类型'}] },
        openMemType: { label: '竞猜会员类型', rules: [{required: true, message: '请选择竞猜会员类型'}] },
        noGuessLatestScore: { label: '免猜最低等级分', rules: [{required: true, message: '请输入最低等级分'}] },

    }

    const handleSubmit = () => {
        console.log(111)
    }
    const handleDelete = (e) => {
        console.log(e)
    }
    const finishForm = (v) => {
        if (v) {
            Fetch({
                url: config.url_list.createGuessTopicInfo,
                method: 'POST', 
                formData: v
            }).then(res => {
                console.log(res)
                try {
                    if (res.data.data.code === 200) {
                        message.success('新增成功')
                        setTimeout(() => {
                            props.history.goBack()
                        },1000)
                    } else {
                        message.error('新增失败')
                    }
                } catch (error) {
                    message.error('网络错误')
                }
            })
        }
        
    }
    const formItemArr = []
    const formItemLayout = {
        labelCol: {
            xs: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 12 },
        },
    }
    for (let key in labelProperty) {
        if (Object.prototype.hasOwnProperty.call(labelProperty, key)) {
            if (key === 'openMemType') {
                formItemArr.push(<Form.Item 
                    {...formItemLayout}
                    key={key}
                    label={labelProperty[key].label} 
                    name={key} 
                    rules={labelProperty[key].rules}>
                    <Select style={{width: 120}}>
                        <Option value="所有会员">所有会员</Option>
                        <Option value="商务会员">商务会员</Option>
                    </Select>
                </Form.Item>)
            } else if (key === 'noGuessLatestScore') {
                formItemArr.push(<Form.Item 
                    {...formItemLayout} 
                    key={key} 
                    label={labelProperty[key].label} 
                    name={key} 
                    rules={labelProperty[key].rules}>
                    <InputNumber min={0} name={key} />
                </Form.Item>)
            } else if (key === 'type') {
                formItemArr.push(<Form.Item 
                    {...formItemLayout}
                    key={key}
                    label={labelProperty[key].label} 
                    name={key} 
                    rules={labelProperty[key].rules}>
                    <Select style={{width: 160}}>
                        <Option value="股票每日竞猜">股票每日竞猜</Option>
                        <Option value="其它活动竞猜">其它活动竞猜</Option>
                    </Select>
                </Form.Item>)
            } else {
                formItemArr.push(<Form.Item 
                    {...formItemLayout} 
                    key={key} 
                    label={labelProperty[key].label} 
                    name={key} 
                    rules={labelProperty[key].rules}>
                    <Input name={key} />
                </Form.Item>)
            }
        }
    }
    return (
        <div>
            <Form
            form={form}
            name='control-hooks'
            onFinish={finishForm}
            >
                {formItemArr}
                <Form.Item style={{textAlign: 'center', paddingTop: 30}}>
                    <Button style={{marginRight: 50}} type="primary" htmlType="submit" onClick={handleSubmit}>提交</Button>
                    <Button type='default' onClick={(e) => props.history.goBack()}>返回</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default withRouter(CreateGuess)
