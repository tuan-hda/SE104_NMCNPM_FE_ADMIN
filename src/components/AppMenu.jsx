import React, { useState } from 'react'
import HambursyLogo from '../images/hambursy-logo.png'
import { Layout, Menu } from 'antd'
import {
  TransactionOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
const { Sider } = Layout

const AppMenu = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  function getItem(label, key, icon, onClick, children) {
    return {
      key,
      icon,
      children,
      label,
      onClick
    }
  }

  const redirectTo = path => {
    navigate('/' + path)
  }

  const logout = () => {}

  // Return menu items here
  const items = [
    getItem('Product', '1', <AppstoreOutlined />, () => redirectTo('product')),
    getItem('User', '2', <UserOutlined />, () => redirectTo('user')),
    getItem('Transaction', '3', <TransactionOutlined />, () =>
      redirectTo('transaction')
    ),
    getItem('Logout', '9', <LogoutOutlined />, () => logout())
  ]

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={value => setCollapsed(value)}
    >
      <div className='flex items-center justify-center gap-4 p-4'>
        <img src={HambursyLogo} alt='Application Logo' className='w-8 h-8' />
        <h1
          className={`text-white font-extrabold transition-opacity duration-100 ${
            collapsed ? 'absolute opacity-0' : ''
          }`}
        >
          HAMBURSY
        </h1>
      </div>
      <Menu
        theme='dark'
        defaultSelectedKeys={['1']}
        mode='inline'
        items={items}
      />
    </Sider>
  )
}

export default AppMenu
