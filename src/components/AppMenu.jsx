import React, { useState } from 'react'
import HambursyLogo from '../images/hambursy-logo.png'
import { Layout, Menu, Modal } from 'antd'
import {
  TransactionOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutInitiate } from '../actions'
import { MdFastfood } from 'react-icons/md'
const { Sider } = Layout

const AppMenu = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  function getItem(label, key, icon, onClick, style, children) {
    return {
      key,
      icon,
      children,
      label,
      onClick,
      style
    }
  }

  const redirectTo = path => {
    navigate('/' + path)
  }

  const dispatch = useDispatch()

  const confirm = () => {
    Modal.confirm({
      title: 'Warning',
      content: 'Are you sure you want to sign out?',
      cancelText: 'Cancel',
      onOk: logout
    })
  }

  const logout = () => {
    dispatch(logoutInitiate())
    navigate('/signin')
  }

  // Return menu items here
  const items = [
    getItem('Order', '1', <MdFastfood />, () => redirectTo('order')),
    getItem('Product', '2', <AppstoreOutlined />, () => redirectTo('product')),
    getItem('User', '3', <UserOutlined />, () => redirectTo('user')),
    getItem('Transaction', '4', <TransactionOutlined />, () =>
      redirectTo('transaction')
    ),
    getItem('Sign out', '5', <LogoutOutlined />, () => confirm(), {
      backgroundColor: 'transparent'
    })
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
      ></Menu>
    </Sider>
  )
}

export default AppMenu
