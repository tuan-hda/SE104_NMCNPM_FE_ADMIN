import React from 'react'

const MainModal = ({ children }) => {
  return (
    <div className="fixed w-screen h-full top-0 left-0 bg-white bg-opacity-80">
      <div className="max-w-[520px] bg-white rounded-sm m-2">{children}</div>
    </div>
  )
}

export default MainModal
