import React, { useEffect } from 'react'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import Background from '../images/2999001.png'
import { useDispatch, useSelector } from 'react-redux'
import { signinInitiate } from '../actions'
import LoadingScreen from '../components/LoadingScreen'
import { clientDomain } from '../utils/clientDomain'

const App = () => {
  const { loading, currentUser } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])

  const onFinish = values => {
    dispatch(signinInitiate(values.email, values.password))
  }

  return (
    <div className='flex items-center justify-center h-screen w-screen'>
      <LoadingScreen loading={loading} />
      <img
        src={Background}
        alt='Background'
        className='fixed top-0 left-0 h-screen w-screen -z-10 object-cover'
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
            <a href={clientDomain + 'signup'} className='text-blue-button'>
              register now!
            </a>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default App
