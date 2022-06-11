import React, { useEffect } from 'react'
import { Form, Input, Button, Checkbox, Divider, Alert } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  FacebookOutlined,
  GoogleOutlined
} from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import Background from '../images/2999001.png'
import { useDispatch, useSelector } from 'react-redux'
import {
  facebookSigninInitiate,
  googleSigninInitiate,
  signinInitiate
} from '../actions'
import LoadingScreen from '../components/LoadingScreen'
import { clientDomain } from '../utils/clientDomain'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'

const App = () => {
  const { loading, currentUser, error } = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentUser) {
      navigate('/')
      createNewAccount()
    }
  }, [currentUser, navigate])

  const createNewAccount = async () => {
    try {
      const token = await currentUser.getIdToken()

      await appApi.post(
        routes.SIGN_UP,
        routes.getSignupBody(currentUser.email, currentUser.name),
        routes.getAccessTokenHeader(token)
      )
    } catch (err) {
      if (err.response) {
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
      } else {
        console.log(err.message)
      }
    }
  }

  const onFinish = values => {
    dispatch(signinInitiate(values.email, values.password))
  }

  const googleSignin = () => {
    dispatch(googleSigninInitiate())
  }

  const facebookSignin = () => {
    dispatch(facebookSigninInitiate())
  }

  const getErrorDescription = err => {
    if (err.includes('auth/popup-closed-by-user'))
      return 'You canceled sign in operation.'
    else if (
      err.includes('auth/wrong-password') ||
      err.includes('auth/user-not-found')
    )
      return 'Wrong email or password.'
    else if (err.includes('auth/too-many-requests'))
      return 'Too many requests. Try again later.'
    else if (err.includes('auth/invalid-email'))
      return 'The email is badly formatted'
    else return 'Some errors occured.'
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
        {error && (
          <Alert
            type='error'
            description={getErrorDescription(error)}
            message='Sign in failed'
          />
        )}
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
              Sign in
            </Button>
          </Form.Item>
          <div className='-mt-2'>
            <Divider plain>or</Divider>
          </div>
          {/* Facebook sign in */}
          <div className='space-y-2'>
            <Button
              icon={<GoogleOutlined />}
              onClick={googleSignin}
              className='w-full flex items-center justify-center text-white bg-[#F25C05]'
            >
              Sign in with Google
            </Button>
            <Button
              icon={<FacebookOutlined />}
              onClick={facebookSignin}
              className='w-full flex items-center justify-center text-black border-black'
            >
              Sign in with Facebook
            </Button>
          </div>
          <div className='mt-4'>
            Or{' '}
            <a href={clientDomain + 'signup'} className='text-blue-button'>
              register now!
            </a>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default App
