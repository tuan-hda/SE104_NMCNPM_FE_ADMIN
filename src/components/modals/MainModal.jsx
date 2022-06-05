import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'

const MainModal = ({ title, children, isShowing, onSave, onCancel }) => {
  return (
    <div
      onClick={onCancel}
      className={`${
        isShowing ? '' : 'opacity-0 pointer-events-none'
      } transition-opacity duration-300 fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-5 z-10`}
    >
      <div
        onClick={e => e.stopPropagation()}
        className='relative max-w-[520px] bg-white rounded-sm sm:m-auto m-2 top-28'
      >
        <h1 className='font-semibold text-base px-6 py-4'>{title}</h1>
        <CloseOutlined className='absolute right-4 top-5' onClick={onCancel} />
        <hr />

        <div className='text-sm px-6 py-4'>{children}</div>
        <hr />

        <div className='flex justify-end gap-2 p-2'>
          <Button onClick={onCancel}>Cancel</Button>
          <Button className='bg-blue-button' type='primary' onClick={onSave}>
            OK
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MainModal
