import { Button } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutInitiate } from '../actions'

const NotFound = ({ signout }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin')
    }
  }, [currentUser, navigate])

  const logout = () => {
    dispatch(logoutInitiate())
  }

  return (
    <div className='w-full h-screen absolute z-20 bg-white top-0 flex justify-center items-center flex-col space-y-4'>
      <strong className='text-[100px]'>404</strong>
      <div>
        The page you are looking for is not exist or you don't have permission
        to access it.
      </div>
      {signout && (
        <Button
          type='primary'
          className='bg-blue-button'
          onClick={() => logout()}
        >
          Sign out
        </Button>
      )}
    </div>
  )
}

export default NotFound
