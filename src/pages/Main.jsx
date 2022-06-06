import React, { useEffect, useState } from 'react'
import { Layout, Breadcrumb, Avatar } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import AppMenu from '../components/AppMenu'
import { UserOutlined } from '@ant-design/icons'
import getCurrentPath from '../utils/getCurrentPath'
import { useSelector } from 'react-redux'
import LoadingScreen from '../components/LoadingScreen'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
const { Content, Footer, Header } = Layout

const Main = () => {
  const location = useLocation()
  const pathname = location.pathname
  const navigate = useNavigate()
  const [fetching, setFetching] = useState(false)

  const { currentUser, loading } = useSelector(state => state.user)

  const fetctProfile = async pathname => {
    setFetching(true)
    try {
      const token = await currentUser.getIdToken()
      const result = await appApi.get(
        routes.GET_PROFILE,
        routes.getAccessTokenHeader(token)
      )
      if (result.data.users.roleData.value !== 'Customer') {
        navigate('/notfound')
      } else if (pathname === '/') navigate('/product')
    } catch (err) {
      console.log(err)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/signin')
    } else {
      fetctProfile(pathname)
    }
  }, [currentUser, loading, navigate])

  if (loading) return <LoadingScreen />

  return (
    <Layout className='min-h-screen'>
      <LoadingScreen loading={fetching} />
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
