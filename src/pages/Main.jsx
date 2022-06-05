import React, { useEffect } from 'react'
import { Layout, Breadcrumb, Avatar } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import AppMenu from '../components/AppMenu'
import { UserOutlined } from '@ant-design/icons'
import getCurrentPath from '../utils/getCurrentPath'
const { Content, Footer, Header } = Layout

const Main = () => {
  const location = useLocation()
  const pathname = location.pathname
  const navigate = useNavigate()

  useEffect(() => {
    if (pathname === '/') navigate('/product')
  }, [pathname, navigate])

  return (
    <Layout className='min-h-screen'>
      <AppMenu />
      <Layout className='site-layout'>
        <Header className='bg-white flex items-center justify-end p-4 space-x-2'>
          <Avatar
            size='small'
            icon={<UserOutlined />}
            className='flex items-center justify-center'
          />
          <p>Hoàng Đình Anh Tuấn</p>
        </Header>
        <Content
          style={{
            margin: '0 16px'
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0'
            }}
          >
            {getCurrentPath(pathname).map((path, index) => {
              return <Breadcrumb.Item key={index}>{path}</Breadcrumb.Item>
            })}
          </Breadcrumb>
          <div className='-mt-4'>
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center'
          }}
        ></Footer>
      </Layout>
    </Layout>
  )
}

export default Main
