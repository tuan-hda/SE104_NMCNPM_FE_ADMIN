import React from 'react'

const PrivateRoute = ({ children }) => {
  return (
    <div className=' bg-black w-screen h-screen'>
      <div className='bg-red-500'>
        {children}
      </div>
    </div>
  )
}

export default PrivateRoute