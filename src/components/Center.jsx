import React from 'react';
import { Layout, Menu } from 'antd';
import CONFIG from '../config/config';
import Fetch from '../config/fetch';
import { Switch, Redirect, Route, Link  } from 'react-router-dom';
import Home from './Home';
import PrizeList from './exhibition/prizeList';
import UserList from './exhibition/UserList';
import '../public/css/Layout.css';
import '../public/css/App.css'
import CreatePrize from './exhibition/CreatePrize';
import EditPrize from './exhibition/EditPrize';
import DrawPrize from './exhibition/DrawPrize'
import Live from './exhibition/Live';
import Issue from './easyAnswer/Issue'
import CreateIssue from './easyAnswer/CreateIssue';
import EditIssue from './easyAnswer/EditIssue';
import IssueDetail from './easyAnswer/IssueDetail';
const { url_list, DOMAIN } = CONFIG
const { Sider, Content }  = Layout;
const SubMenu = Menu.SubMenu;

export default class Center extends React.Component {
    rootSubmenuKeys = [];
    state = {
        menus: [],
        openKeys: ['index']
    }

    componentDidMount() {
        Fetch({
            url: url_list.getMenusSider,
            method: "GET",
        }).then(res => {
            console.log(res)
            if(res.data.code === 200) {}
            this.setState({
                menus: res.data.data
            })
            // console.log(res)
        })
    }
    
    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };
    
    render(){
        const { menus, openKeys } = this.state;
        return(
            <div>
                <Layout>
                    <Layout>
                    <Sider width={200} style={{ background: '#fff' }}>
                        <Menu
                        mode="inline"
                        defaultSelectedKeys={['index']}
                        openKeys={openKeys}
                        onOpenChange={this.onOpenChange}
                        onClick={this.handleClick}
                        style={{ height: '100%', borderRight: 0 }}
                        >
                            {menus.map(menu => {
                                if(menu.subMenus.length === 0){
                                    return (
                                        <Menu.Item
                                        key={menu.key}
                                        >
                                            <Link to={menu.path}>{menu.text}</Link>
                                        </Menu.Item>
                                    )
                                }else{
                                    return (
                                        <SubMenu
                                        key={menu.key}
                                        title={
                                            <span>{menu.text}</span>
                                        }
                                        >
                                            {menu.subMenus.map(subMenu => {
                                                return (
                                                    <Menu.Item
                                                    key={subMenu.key}
                                                    >
                                                        <Link to={subMenu.path}>{subMenu.text}</Link>
                                                    </Menu.Item>
                                                )
                                            })}
                                        </SubMenu>
                                    )
                                }
                            })}
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 0 24px 24px', height: window.innerHeight }}>
                        <Content
                        style={{
                            background: '#fff',
                            padding: 24,
                            margin: 0,
                            minHeight: 600,
                        }}
                        >
                            <Switch>           
                                {/* <Route path='/Home' component={Home}/> */}
                                <Route path='/index' component={Home} />
                                <Route path="/exhibition/users" component={UserList}/>
                                <Route path="/exhibition/prizes" component={PrizeList}/>
                                <Route path="/exhibition/createPrize" component={CreatePrize}/>
                                <Route path="/exhibition/editPrize" component={EditPrize}/>
                                <Route path='/exhibition/drawPrizes' component={DrawPrize} />
                                <Route path="/exhibition/live" component={Live} />
                                <Route path="/easyAnswer/issue" component={Issue} />
                                <Route path="/easyAnswer/createIssue" component={CreateIssue} />
                                <Route path="/easyAnswer/editIssue" component={EditIssue} />
                                <Route path="/easyAnswer/issueDetail" component={IssueDetail}/>
                                <Redirect from='/' to='/index'/>
                            </Switch>
                        </Content>
                    </Layout>
                    </Layout>
                </Layout>
            </div>
        )
    }
}