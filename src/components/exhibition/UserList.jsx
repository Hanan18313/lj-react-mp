import React from 'react';
import { Table, Avatar, Input, Button, Row, Col, Form, message, Tag } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import '../../public/css/UserListCell.css'
import config from '../../config/config';
const { Search } = Input


const columns = [
    {
        key: 'user_name',
        title: '姓名',
        dataIndex: 'user_name',
        width: 150
    },
    {
        key: 'phone',
        title: '联系方式',
        dataIndex: 'phone',
        width: 150,
    },
    {
        key: 'company',
        title: '公司',
        dataIndex: 'company',
        width: 250,
    },
    {
        key: 'avatar',
        title: '头像',
        dataIndex: 'avatar',
        width: 150,
        render:(text, record) => (
            <Avatar src={text}/>
        )
    },
    {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        width: 150,
        filters: [{text: '未报名', value: '未报名'},{text: '未签到', value: '未签到'},{text: '已签到', value: '已签到'},{text: '已结束', value: '已结束'}],
        render:(text) => {
            console.log()
            // eslint-disable-next-line default-case
            switch(text) {
                case '未报名':
                    return(
                        <Tag>{text}</Tag>
                    )
                case '未签到':
                    return (
                        <Tag color='red'>{text}</Tag>
                    )
                case '已签到':
                    return (
                        <Tag color='blue'>{text}</Tag>
                    )
                case '已结束': 
                    return (
                        <Tag color="yellow">{text}</Tag>
                    )
            }
        }
    },
    {
        key: 'sign_up_time',
        title: '报名时间',
        dataIndex: 'sign_up_time',
        width: 200,
        render:(text) => {
            if(text) {
                return (<div>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>)
            }
        }
    },
    {
        key: 'sign_in_time',
        title: '签到时间',
        dataIndex: 'sign_in_time',
        width: 200,
        render:(text) => {
            if(text) {
                return (<div>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>)
            }
        }
    },
    {
        key: 'lottery_number',
        title: '抽奖号',
        dataIndex: 'lottery_number',
        width: 150,
        editable: true
    },
    {
        key: 'is_eat',
        title: '是否参加午宴',
        dataIndex: 'is_eat',
        width: 150,
        render:(text) => (
            text === 1 ? <Tag color="green">参加</Tag> :
            <Tag>不参加</Tag>
        )
    }
]


const EditableContext = React.createContext();

const EditableRow = ({ forms, index, ...props }) => {
    return(
        <EditableContext.Provider value={forms}>
          <tr {...props} />
        </EditableContext.Provider>
      )
};

 const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
        const data = {
            unionId: record.unionid,
            lottery_number: values.lottery_number
        }
        Axios({
            method: 'PUT',
            url: config.DOMAIN + config.url_list.updateUserLotteryNumber,
            data: data
        }).then(res => {
            if(res.data.data.code === -10005){
                message.error('请输入抽奖号')
                this.setState({
                    editing: true
                })
            }else if(res.data.data.code === -10004) {
                message.error('抽奖号冲突')
                this.setState({
                    editing: true
                })
            } else {
                message.success('更新成功！')
            }
        })
        if (error && error[e.currentTarget.id]) {
            return;
        }
        this.toggleEdit();
        handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} 不能为空`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}


export default class Participants extends React.Component {
    constructor() {
        super()
        this.state = {
            pagination: {
                current: 1,
                pageSize: 30,
                total: 0,
                lunchTotal: 0,
                keyWord: '',
                order: '',
                filter: {},
                showSizeChanger: true,
                pageSizeOptions: ['30','50','100','200'],
                onShowSizeChange:(current, pageSize) => {
                    const pagination = this.state.pagination
                    pagination.pageSize = pageSize
                    this.setState({
                        pageSize,
                    })
                },
                onChange:(current, pageSize) => {
                    const pagination = this.state.pagination
                    pagination.current = current
                    pagination.pageSize = pageSize
                },
                showTotal:(total) => {
                    return(
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <p style={{paddingRight:40,fontSize:'16px'}}>当前人数：{total}</p>
                            <p style={{paddingRight:40,fontSize:'16px'}}>就餐人数：{this.state.lunchTotal}</p>
                        </div>
                    )
                },
            },
            loading: false,
            dataSource: [],
            lunchTotal: 0,
        }
        //this.searchValue = React.createRef()
        //this.handleCancel = this.handleCancel.bind(this)
        this.handleTableChange = this.handleTableChange.bind(this)
        //this.handleCancel = this.handleCancel.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount() {
        this.Fetch({
            current: 1,
            pageSize: 30,
            filter: []
        })

    }

    Fetch = (params = {}) => {
        this.setState({
            loading: true
        })
        Axios({
            url: config.DOMAIN + config.url_list.getUserInfoList,
            method: 'GET',
            params: {
                ...params
            }
        }).then(res => {
            let need_lunch_total = 0
            res.data.data.forEach((item, index) => {
                if(item.is_eat == 1) {
                    need_lunch_total+=1
                }
            })
            this.setState({
                loading: false,
                dataSource: res.data.data,
                lunchTotal: need_lunch_total
            })
        }).catch(e => {
            console.log(e)
        })
    }


    handleSave= row => {
        const newData = [...this.state.dataSource]
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index]
        newData.splice(index, 1, {
            ...item,
            ...row
        })
        this.setState ({dataSource: newData})
    }

    handleTableChange(pagination, filter){

        const paper = this.state.pagination
        paper.current = pagination.current
        paper.pageSize = pagination.pageSize
        this.Fetch({
            current: paper.current,
            pageSize: paper.pageSize,
            filter: filter.status
        })
    }

    /**
     * 导出表格
     */
    handleExportExcel = () => {
        const { filter } = this.state.pagination
        // if(Object.keys(filter).length == 0){
        //     filter.state = [0,1,2,3]
        // }
        // Axios({
        //     method: 'GET',
        //     url: Common.exportExcel,
        //     params: {
        //         filter
        //     }
        // }).then(res => {
        //     if(res.data.code == 200) {
        //         window.location.href = res.data.data
        //     }else{
        //         message.error('暂无数据，不支持导出')
        //     }
        // })
    }
    /**
     * 搜索
     */
    handleSearch = (value) => {
        this.setState({
            loading: true,
            searchValue: value
        })
        Axios({
            method: 'GET',
            url: config.DOMAIN + config.url_list.searchUserInfoByNameOrCompany,
            params: {
                searchValue: value
            }
        }).then(res => {
            let need_lunch_total = 0
            res.data.data.data.forEach((item, index) => {
                if(item.user_is_eat == 1) {
                    need_lunch_total+=1
                }
            })
          //  this.transView({dataSource: res.data.data})
           // this.state.lunchTotal = need_lunch_total
            this.state.pagination.total = res.data.data.length
            this.setState({
                loading: false,
                dataSource: res.data.data.data,
                lunchTotal: need_lunch_total
            })
        }).catch(e => console.log(e))
    }

    // /**
    //  * 取消
    //  */
    handleCancel = () => {
        this.Fetch({
            current: 1,
            pageSize: this.state.pagination.pageSize,
            filter: []
        })
    }
    render() {
        let { pagination, dataSource, loading, searchValue } = this.state
        let components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell
            }
        }
        const column = columns.map(col => {
            if(!col.editable) {
                return col
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave
                })
            }
        })
        return (
            <div>
                <div>
                    <Row type='flex' justify='space-between' style={{marginBottom:12}}>
                        <Col span={8}>
                            <div style={{display:'flex',flexDirection:'row'}}>
                                <Search placeholder='输入姓名或者公司名称' id='searchValue'  onSearch={value =>this.handleSearch(value)} enterButton='Search'></Search>
                                <div style={{paddingLeft: '20px'}}><Button type='default' onClick={this.handleCancel}>取消</Button></div>
                            </div>
                        </Col>
                        <Col span={12} style={{display:'flex', justifyContent:'flex-end'}}>
                            {/* <Button type='default' onClick={this.handleExportExcel}>导出Excel表格</Button> */}
                        </Col>
                    </Row>
                </div>
                <Table
                components={components}
                rowKey={record => record.id}
                columns={column}
                rowClassName={() => 'editable-row'}
                scroll={{x:1300, y:window.innerHeight*0.7}}
                pagination={pagination}
                dataSource={dataSource}
                loading={loading}
                onChange={this.handleTableChange}
                ></Table>
            </div>
        )
    }
}

