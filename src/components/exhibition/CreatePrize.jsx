import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Table, Form, Upload, Button, Input, Select, Layout, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import config from '../../config/config';
import Axios from 'axios';
const FormItem = Form.Item
const { url_list, DOMAIN } = config



class CreatePrize extends React.Component {
    formRef = React.createRef()
    constructor(props) {
        
        super()
        this.state = {
            labelProperty: {
                prize_name: { label: '奖品名称', rules: [{required: true, message: '请输入奖品名称'}] },
                price: { label: '价格', rules: [{required: true, message: '请输入价格'}] },
                number: { label: '数量', rules: [{required: true, message: '请选择数量'}] },
                img_url: { label: '图片', rules: [{required: true, message: '请选择图片'}] },
                instrct: { label: '附加说明', rules: [{required: true, message: '请输入说明'}] }
            },
            fileList: []
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.uploadProps = this.uploadProps.bind(this)
    }
    onFinish = (v) => {
        console.log(v)
        Axios({
            url: DOMAIN + url_list.createPrizes,
            method:'POST',
            data: v,
        }).then(res => {
            if(res.data.code === 200) {
                message.info('新增成功').then(() => {
                    this.props.history.goBack()
                })
                
            }else{
                message.info('新增失败')
            }
        })

    }

    uploadProps(e) {
         const props = {
             action: config.DOMAIN + config.url_list.uploadImg,
             accept:'image/*',
             listType: 'picture',
             name: 'file',
             defaultFileList: [...this.state.fileList],
             multiple: false,
             onChange:(res) => {
                 if(res.file.status === 'done') {
                     let file_name = res.file.response.data.data.filename
                     this.props.form.setFieldsValue({
                         img_url: file_name
                     })
                 }
             },
             onRemove:(res) => {
                 this.props.form.setFieldsValue({
                     img_url: ''
                 })
             }
         }
         return props
     }
 
     handleSubmit = (e) => {
         e.preventDefault()
         this.props.form.validateFieldsAndScroll((err, values) => {
             if(err){
                 console.log(err)
             }else{
                 Axios({
                     method: 'POST',
                     url: DOMAIN + url_list.createPrizes,
                     data: values
                 }).then(res => {
                     message.success('新增成功')
                     setTimeout(() => {
                        this.props.history.goBack()
                     },1500)
                 })
             }
         })
     }


    componentDidMount() {

    }

    render() {
        const formItem_arr = []
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
        for(let i in labelProperty) {
            if(i == 'img_url') {
                let props = this.uploadProps()
                formItem_arr.push(<FormItem 
                    {...formItemLayout}
                    label={labelProperty[i].label}
                    >
                    <Upload {...props}>
                        <Button icon={<LegacyIcon type={UploadOutlined} />}>
                            上传照片
                        </Button>
                    </Upload>
                    {getFieldDecorator(i, {
                        initialValue: labelProperty[i].initialValue,
                        rules: labelProperty[i].rules
                    })(
                        <Input name='album' type='hidden' />
                    )}
                </FormItem>)
            }
            else if(i == 'instrct') {
                formItem_arr.push(<FormItem
                    {...formItemLayout}
                    label={labelProperty[i].label}
                    >
                        {getFieldDecorator(i, {
                           // rules: labelProperty[i].rules
                        })(
                            <Input.TextArea name=''  />
                        )}
                    </FormItem>)
            } else {
                formItem_arr.push(<FormItem
                key={i}
                {...formItemLayout}
                label={labelProperty[i].label}
                >
                    {getFieldDecorator(i, {
                        rules: labelProperty[i].rules
                    })(
                        <Input name='' />
                    )}
                </FormItem>)
            }
        }
        return(
            <Form onSubmit={this.handleSubmit} style={{padding: 24}} ref={this.formRef}>
                <div>
                    {
                        formItem_arr.map((item,index) =>
                            <div key={index} >{item}</div>
                        )
                    }
                </div>
                <FormItem style={{textAlign:'center'}}>
                    <Button type='primary' htmlType="submit" style={{marginRight:50}}>提交</Button>
                    <Button type='default' onClick={() => {this.props.history.goBack()}}>返回</Button>
                </FormItem>
            </Form>
        )
    }
}
const CreatePrizeForm = Form.create()(CreatePrize)

export default CreatePrizeForm