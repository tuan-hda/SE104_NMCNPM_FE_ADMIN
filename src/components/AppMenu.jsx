import React, { useState } from 'react'
import HambursyLogo from '../images/hambursy-logo.png'
import { Layout, Menu, Modal } from 'antd'
import {
  AppstoreOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutInitiate } from '../actions'
import { MdFastfood } from 'react-icons/md'
import { TbDiscount2 } from 'react-icons/tb'
import { GiFoodTruck } from 'react-icons/gi'
const { Sider } = Layout

const AppMenu = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

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
    getItem('All Orders', '2', <GiFoodTruck />, () => redirectTo('all-orders')),
    getItem('Product', '3', <AppstoreOutlined />, () => redirectTo('product')),
    getItem('User', '4', <UserOutlined />, () => redirectTo('user')),
    getItem('Promotion', '5', <TbDiscount2 />, () => redirectTo('promotion')),
    getItem('Sign out', '6', <LogoutOutlined />, () => confirm(), {
      backgroundColor: 'transparent'
    })
  ]

  const getDefaultSelectedKeys = () => {
    const pathname = location.pathname.substring(1)
    switch (pathname) {
      case 'order':
        return ['1']
      case 'all-orders':
        return ['2']
      case 'product':
        return ['3']
      case 'user':
        return ['4']
      case 'promotion':
        return ['5']
      default:
        return ['0']
    }
  }

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
        selectedKeys={getDefaultSelectedKeys()}
        mode='inline'
        items={items}
      ></Menu>
    </Sider>
  )
}

export default AppMenu
