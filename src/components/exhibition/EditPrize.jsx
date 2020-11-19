import React from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Upload, Button, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import config from '../../config/config';
import Axios from 'axios';
const FormItem = Form.Item
const { Option } = Select

class EditPrizeForm extends React.Component {
    formRef = React.createRef()
    constructor() {
        super()
        this.state = {
            labelProperty: {
                prize_ser_num: { label: '编号', rules: [{required: true, message: '请输入编号'}] },
                prize_name: { label: '奖品名称', rules: [{required: true, message: '请输入奖品名称'}] },
                price: { label: '价格', rules: [{required: true, message: '请输入价格'}] },
                round: { label: '轮次', rules: [{required: true, message: '请选择轮次'}] },
                type: { label: '类别', rules: [{required: true, message: '请选择类别'}] },
                img_url: { label: '图片', rules: [{required: true, message: '请选择图片'}] },
                instrct: { label: '附加说明', rules: [{required: true, message: '请输入说明'}] }
            },
            fileList:[]
        }
        this.uploadProps = this.uploadProps.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    uploadProps(e) {
        // console.log(e)
        const props = {
            action: config.DOMAIN + config.url_list.uploadImg,
            // headers: {
            //     'Content-Type':'application/x-www-form-urlencoded'//form-data
            // },
            accept:'image/*',
            listType: 'picture',
            name: 'file',
            defaultFileList: [...this.state.fileList],
            // fileList: [...this.state.fileList],
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
            },
            onPreview:(img) => {

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
                values.prizeId = this.props.location.search.split('=')[1]
                // values.img_url = values.img_url.split('/upload/')[values.img_url.split('/upload/').length - 1]
                Axios({
                    method: 'PUT',
                    url: config.DOMAIN + config.url_list.updatePrizeInfoById,
                    data: values
                }).then(res => {
                    if(res.data.code == 200){
                        this.props.history.goBack()
                    }
                })
            }
        })
    }

    componentDidMount() {
        let id = this.props.location.search.split('=')[1]
        this.Fetch({
            prizeId: id
        })
    }

    Fetch = (params = {}) => {
        Axios({
            method: 'GET',
            url: config.DOMAIN + config.url_list.getPrizeInfoById,
            params: params
        }).then(res => {
            console.log(this.formRef.current)
            let data = res.data.data[0]
            this.props.form.setFieldsValue({
                prize_ser_num: data.prize_prize_ser_num,
                prize_name: data.prize_prize_name,
                price: data.prize_price,
                round: data.prize_round,
                img_url: data.prize_img_url,
                type: data.prize_type,
                instrct: data.prize_instrct
            })
            this.setState({
                fileList: data.prize_img_url
            })
        })
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
            if(i === 'img_url') {
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
                // formItem_arr.push(<FormItem>
                    
                // </FormItem>)
            }else if(i === 'round'){
                formItem_arr.push(<FormItem
                {...formItemLayout}
                label={labelProperty[i].label}
                >
                    {getFieldDecorator(i, {
                        rules: labelProperty[i].rules
                    })(
                        <Select style={{width:150}}>
                            <Option value={1}>第一轮</Option>
                            <Option value={2}>第二轮</Option>
                            <Option value={3}>第三轮</Option>
                        </Select>
                    )}
                </FormItem>)
            } else if(i === 'instrct') {
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
            } else if (i === 'type') {
                formItem_arr.push(<FormItem
                    {...formItemLayout}
                    label={labelProperty[i].label}
                    >
                        {getFieldDecorator(i, {
                            rules: labelProperty[i].rules
                        })(
                            <Select style={{width:150}}>
                                <Option value='scene'>现场奖品</Option>
                                <Option value='live'>直播间奖品</Option>
                            </Select>
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
const EditPrize = Form.create()(EditPrizeForm)

export default EditPrize