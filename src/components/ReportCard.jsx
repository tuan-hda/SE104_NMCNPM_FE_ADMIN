import React from 'react'
import { Row, Col, Card } from 'antd'

const ReportCard = ({ data }) => {
  return (
    <Card className='rounded-xl max-w-sm'>
      <div className='flex justify-between items-center'>
        <div>
          <p className='font-semibold text-gray-500'>{data?.title}</p>
          <p className='font-extrabold text-3xl'>{data?.value}</p>
        </div>
        <div className='bg-[#1890FF] rounded-xl w-14 h-14 flex items-center justify-center'>
          <div className='rounded-full bg-white w-6 h-6 items-center justify-center flex'>
            {data?.icon}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ReportCard
