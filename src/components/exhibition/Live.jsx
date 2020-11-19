// /* eslint-disable jsx-a11y/anchor-is-valid */
// import { Table, Row, Col, Button, Popconfirm, Divider, Avatar, message, Input, Form } from 'antd';
// import React from 'react';
import Fetch from '../../config/fetch';
import CONFIG from '../../config/config'
import Axios from 'axios';
import config from '../../config/config';
import React from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Input, InputNumber, Popconfirm, Avatar, message } from 'antd';
const { DOMAIN, url_list } = CONFIG

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
            this.state = {
            pagination: {
                current: 1,
                pageSize: 50,
                total: 0,
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
                            <p style={{paddingRight:40,fontSize:'16px'}}>奖品数量：{total}</p>
                        </div>
                    )
                },
            },
            loading: false,
            dataSource: [],
            visible: false,
            inputValue: "",
            editingKey: '',
            columns: [
                { title: '编号', dataIndex: 'prize_ser_num', key: 'prize_ser_num' },
                { title: '奖品名', dataIndex: 'prize_name', key: 'prize_name' },
                { title: '图片', dataIndex: 'img_url', key: 'img_url',
                    render:(text) => (
                        <Avatar src={text} shape='square' size={40}/>
                    ) },
                { title: '轮次', dataIndex: 'round', key: 'round' },
                // { title: '附加', dataIndex: 'instrct', key: 'instrct' },
                { title: '中奖人', dataIndex: 'user', key: 'user',
                    editable: true,
                    render: (text) => {
                        if(text) {
                            return(<span>{text.user_name}</span>)
                        }
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: 'right',
                    render: (text, record) => {
                      const { editingKey } = this.state;
                      const editable = this.isEditing(record);
                      return editable ? (
                        <span>
                          <EditableContext.Consumer>
                            {form => (
                              // eslint-disable-next-line jsx-a11y/anchor-is-valid
                              <a onClick={() => this.save(form, record.prize_ser_num)}
                                style={{ marginRight: 8 }}
                              >
                                保存
                              </a>
                            )}
                          </EditableContext.Consumer>
                          <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.prize_ser_num)}>
                            <a>取消</a>
                          </Popconfirm>
                        </span>
                      ) : (
                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                        <a disabled={editingKey !== ''} onClick={() => this.edit(record.prize_ser_num)}>
                          编辑
                        </a>
                      );
                    },
                    
                  },
            ]
        }
  }

  isEditing = record => record.prize_ser_num === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.dataSource];
      const index = newData.findIndex(item => key === item.prize_ser_num);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
      } else {
        newData.push(row);
      }
        const data = {
            ser_num: key,
            openId: row.user
        }
        Axios({
            method: "PUT",
            url: config.DOMAIN + config.url_list.updateLiveRoomWinnerInfo,
            data: data
        }).then(res => {
            if (res.data.data.code === -20003) {
                this.setState({
                    editing: true,
                })
                message.error('不存在该用户')
            } else {
                this.Fetch()
            }
        })

    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  componentDidMount() {
      this.Fetch()
  }
      Fetch = () => {
        Axios({
            method: 'GET',
            url: config.DOMAIN + config.url_list.getPrizeList,
            params: {
                current: 1,
                pageSize: 30,
                filter:['live']
            },
        }).then(res => {
          console.log(res)
            if(res.data.code === 200) {
                res.data.data.map(item => {
                    item.img_url = DOMAIN + '/static/upload/' + item.img_url
                })
                this.setState({
                    dataSource: res.data.data,
                    loading: false,
                    editingKey: ''
                })
            }
        })
    }

  render() {
      const { loading, pagination } = this.state
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          rowKey={record => record.id}
          components={components}
          dataSource={this.state.dataSource}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
          scroll={{x: 600, y: window.innerHeight*0.7}}
          loading={loading}
          
        />
      </EditableContext.Provider>
    );
  }
}

const Live= Form.create()(EditableTable);
export default Live