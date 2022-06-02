import React, { useEffect } from 'react';
import { Layout, Breadcrumb } from 'antd';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppMenu from '../components/AppMenu';
import getCurrentPath from '../utils/getCurrentPath';
const { Content, Footer } = Layout;

const Main = () => {
  const location = useLocation()
  const pathname = location.pathname
  const navigate = useNavigate()

  useEffect(() => {
    if (pathname === '/')
      navigate('/product')
  }, [pathname, navigate])

  return (
    <Layout className='min-h-screen' >
      <AppMenu />
      <Layout className="site-layout">
        <Content
          style={{
            margin: '0 16px',
          }}>
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}>
            {getCurrentPath(pathname).map((path, index) => {
              return <Breadcrumb.Item key={index}>{path}</Breadcrumb.Item>
            })}
          </Breadcrumb>
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Main