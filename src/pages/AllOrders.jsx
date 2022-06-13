import React from 'react'
import { useSelector } from 'react-redux'
import Order from './Order'
import NotFound from './NotFound'
import { useState } from 'react'
import { useEffect } from 'react'

const AllOrders = () => {
  const role = useSelector(state => state.role)
  const [initial, setInitial] = useState(0)
  useEffect(() => {
    if (!role || role === 'staff') {
      setInitial(0)
    } else {
      setInitial(1)
    }
  }, [role])
  if (!role || role === 'staff') return <NotFound isChildComponent />
  return <Order initial={1} />
}

export default AllOrders
