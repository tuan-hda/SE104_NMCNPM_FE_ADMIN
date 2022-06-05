import React from 'react'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import Background from '../images/2999001.png'

const App = () => {
  const onFinish = values => {
    console.log('Received values of form: ', values)
  }

  return (
    <div className='flex items-center justify-center h-screen w-screen'>
      <img
        src={Background}
        alt='Background'
        className='fixed top-0 left-0 -z-10'
      />

      {/* Actual Form */}
      <div className='w-full max-w-sm m-2 space-y-8 bg-white bg-opacity-80 p-8 rounded-sm'>
        <h1 className='font-black text-xl text-center'>Login</h1>
        <Form
          name='normal_login'
          className='login-form'
          initialValues={{
            remember: true
          }}
          title='Login'
          onFinish={onFinish}
        >
          <Form.Item
            name='email'
            rules={[
              {
                required: true,
                message: 'Please input your Email!'
              }
            ]}
          >
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Email'
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your Password!'
              }
            ]}
          >
            <Input
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Link
              to='/forgotpassword'
              className='login-form-forgot text-blue-button float-right'
            >
              Forgot password
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button w-full bg-blue-button'
            >
              Log in
            </Button>
            Or{' '}
            <Link to='/signup' className='text-blue-button'>
              register now!
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default App
