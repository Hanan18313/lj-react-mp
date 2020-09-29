import React from 'react';
import { Table, Form, Upload, Button, Input, Select, Layout, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import config from '../../config/config';
import Fetch from '../../config/fetch'
import Axios from 'axios';
const { url_list, DOMAIN } = config



class CreatePrize extends React.Component {
    constructor(props) {
        
        super()
        this.state = {
            labelProperty: {
                Prize_name: { label: '奖品名称', rules: [{required: true, message: '请输入奖品名称'}] },
                price: { label: '价格', rules: [{required: true, message: '请输入价格'}] },
                number: { label: '数量', rules: [{required: true, message: '请选择数量'}] },
                img_url: { label: '图片', rules: [{required: true, message: '请选择图片'}] },
                instrct: { label: '附加说明', rules: [{required: true, message: '请输入说明'}] }
            },
            fileList: []
        }
        this.onSubmit = this.onSubmit.bind(this)
    }
    uploadProps(e) {
        
        const props = {
            action: config.DOMAIN + config.url_list.uploadImg,
            accept:'image/*',
            // listType: 'picture',
            name: 'file',
            defaultFileList: [...this.state.fileList],
            multiple: false,
            onChange:(res) => {
                try {
                    console.log(res.file.response)
                    if (res.file.response.data.code === 200) {
                        message.success('图片上传成功')
                    }else{
                        message.error('图片上传失败')
                    }
                } catch (error) {
                    
                }
            },
            onRemove:(res) => {
                console.log(res)
            }
        }
        return props
    }

    onSubmit = (e) => {
        console.log(e)
    }
    onFinish = (v) => {
        console.log(v)
        Axios({
            url: DOMAIN + url_list.createPrizes,
            method:'POST',
            data: v,
        }).then(res => {
            console.log(res)
            if(res.data.code === 200) {
                message.info('新增成功').then(() => {
                    this.props.history.goBack()
                })
                
            }else{
                message.info('新增失败')
            }
        })

    }


    componentDidMount() {

    }

    render() {
        const { labelProperty } = this.state
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
			labelCol: {
				xs: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 12 },
			},
	    };
        return(
            <div className="form">
                <Form {...formItemLayout} onSubmit={this.handleSubmit} style={{padding: 24}} encType="multipart/form-data" onFinish={this.onFinish}>
                    <Form.Item name="prize_name" key="prize_name" label={labelProperty.Prize_name.label} rules={labelProperty.Prize_name.rules}><Input/></Form.Item>
                    <Form.Item name="price" key="price" label={labelProperty.price.label} rules={labelProperty.price.rules}><Input/></Form.Item>
                    <Form.Item name="img_url" key="img_url" label={labelProperty.img_url.label} rules={labelProperty.img_url.rules}><Upload {...this.uploadProps()}><Button icon={<UploadOutlined/>}>上传图片</Button></Upload></Form.Item>
                    <Form.Item name="number" key="number" label={labelProperty.number.label} rules={labelProperty.number.rules}><Input/></Form.Item>
                    <Form.Item name="instrct" key="instrct" label={labelProperty.instrct.label} rules={labelProperty.instrct.rules}><Input.TextArea/></Form.Item>
                    <Form.Item style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
                        <Button type='primary' htmlType="submit" style={{marginRight:50}}>提交</Button>
                        <Button type='default' onClick={() => {this.props.history.goBack()}}>返回</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
console.log(Form)
  const CreatePrizeForm = Form.create()(CreatePrize)

 export default CreatePrizeForm