import React from 'react'
import { useSelector } from 'react-redux'
import Order from './Order'
import NotFound from './NotFound'

const AllOrders = () => {
  const role = useSelector(state => state.role)
  if (!role || role === 'staff') return <NotFound isChildComponent />
  return <Order initial={1} />
}

export default AllOrders
