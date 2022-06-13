import React, { useState } from 'react'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import { useEffect } from 'react'
import { List } from 'antd'

const ExpandOrderItem = ({ id, currentUser }) => {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!id) return

    fetchOrderItems(id)
  }, [id])

  const fetchOrderItems = async id => {
    setLoading(true)
    try {
      const token = await currentUser.getIdToken()
      const result = await appApi.get(routes.DISPLAY_ORDER_ITEM, {
        ...routes.getAccessTokenHeader(token),
        ...routes.getConfirmOrderParams(id)
      })
      setItems(result.data.items)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = items => {
    if (!items || !Array.isArray(items) || !items.length) return
    return items.reduce((prev, curr) => prev + curr.currentprice, 0)
  }

  return (
    <>
      <List
        itemLayout='horizontal'
        loading={loading}
        dataSource={items}
        renderItem={item => {
          if (item.id)
            return (
              <List.Item className='block'>
                <div className='flex items-center gap-4'>
                  {/* Item thumbnail */}
                  <div className='border-[1px]'>
                    <img
                      src={item?.Item?.itemImage}
                      alt='Product Thumbnail'
                      className='aspect-square w-28 object-cover'
                    />
                  </div>

                  {/* Name, price and quantity */}
                  <div className='flex-1 flex flex-col justify-between h-16'>
                    <p className='font-semibold'>{item?.Item?.itemName}</p>
                    <div className='flex justify-between'>
                      <p className='text-blue-500'>x {item?.number}</p>
                      <p>$ {item?.currentprice}</p>
                    </div>
                  </div>
                </div>
              </List.Item>
            )
        }}
      />

      <p className='border-t-[1px] my-4 w-[120%] -mx-10' />
      <div className='flex items-center float-right gap-4'>
        <p>Total: </p>
        <p className='text-xl text-red-500'>$ {calculateTotal(items)}</p>
      </div>
    </>
  )
}

export default ExpandOrderItem
