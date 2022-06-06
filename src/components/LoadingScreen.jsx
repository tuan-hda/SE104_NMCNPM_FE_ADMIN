import React from 'react'
import { Spin } from 'antd'

const LoadingScreen = ({ loading }) => {
  return (
    <div
      className={`${
        loading !== null && loading === false && 'opacity-0 pointer-events-none'
      } transition-opacity duration-300 fixed top-0 left-0 z-10 w-screen h-screen flex items-center justify-center bg-white bg-opacity-70`}
    >
      <Spin />
    </div>
  )
}

export default LoadingScreen
