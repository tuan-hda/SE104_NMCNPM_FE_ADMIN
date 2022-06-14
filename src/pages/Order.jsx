import React, { useEffect, useRef, useState } from 'react'
import { Table, Input, Button, Space, Tooltip, Tag, Modal, Divider } from 'antd'
import {
  SearchOutlined,
  CloseSquareOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import { useSelector } from 'react-redux'
import removeAccents from '../utils/removeAccents'
import ExpandOrderItem from '../components/ExpandOrderItem'
import getProvinceName from '../utils/getProvinceName'

let pending = []
let rest = []

const Orders = ({ initial }) => {
  const searchInput = useRef(null)
  const [pendingOrders, setPendingOrders] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchValues, setSearchValues] = useState({})
  const [searchValues2, setSearchValues2] = useState({})
  const [input, setInput] = useState({})
  const { currentUser } = useSelector(state => state.user)

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true)
    try {
      const token = await currentUser.getIdToken()

      pending = []
      rest = []

      let result = await appApi.get(
        // routes.GET_ALL_EXISTED_ORDERS,
        initial ? routes.GET_ALL_EXISTED_ORDERS : routes.GET_RESTAURANT_ORDERS,
        routes.getAccessTokenHeader(token)
      )

      console.log(result)

      result = result.data.orders.map((res, index) => ({
        ...res,
        address:
          getProvinceName(res.deliAddress) +
          ', ' +
          getProvinceName(res.deliWard) +
          ', ' +
          getProvinceName(res.deliDistrict) +
          ', ' +
          getProvinceName(res.deliProvince),
        key: index
      }))

      result.forEach((order, index) => {
        const order_m = {
          ...order,
          key: index
        }
        if (order.billstatus === 1) pending.push(order_m)
        else rest.push(order_m)
      })

      pending.sort((a, b) => a.id - b.id)
      rest.sort((a, b) => b.id - a.id)

      setPendingOrders(pending)
      setOrders(rest)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // useEffect(() => {
  //   console.log(pendingOrders)
  // }, [pendingOrders])

  useEffect(() => {
    fetchOrders()
    let timer = setInterval(() => {
      fetchOrders()
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const sort = (a, b, key) => {
    if (!a || !b) return 1
    if (!isNaN(a[key]) && !isNaN(b[key])) return a[key] - b[key]
    return String(a[key]).localeCompare(b[key])
  }

  const compareStr = (s1, s2) => s1.toLowerCase().includes(s2.toLowerCase())

  useEffect(() => {
    filterData(0, pending)
  }, [searchValues])

  useEffect(() => {
    filterData(1, rest)
  }, [searchValues2])

  // type = 0 => filter pending orders
  // type = 1 => filter the rest
  const filterData = (type, data) => {
    if (!data.length) return
    let filteredResult = data
    Object.keys(!type ? searchValues : searchValues2).forEach(k => {
      filteredResult = filteredResult.filter(item => {
        return compareStr(
          removeAccents(String(item[k])),
          removeAccents(!type ? searchValues[k] : searchValues2[k])
        )
      })
    })
    console.log('Filtered result: ', filteredResult)
    if (!type) setPendingOrders(filteredResult)
    else setOrders(filteredResult)
  }

  const clearFilters = type => {
    if (!type) setSearchValues({})
    else setSearchValues2({})
  }

  const handleSearch = (value, dataIndex, type) => {
    if (!type)
      setSearchValues({
        ...searchValues,
        [dataIndex]: value
      })
    else
      setSearchValues2({
        ...searchValues2,
        [dataIndex]: value
      })
  }

  const getColumnSearchProps = (dataIndex, title, type) => ({
    filterDropdown: ({ confirm }) => {
      return (
        <div
          style={{
            padding: 8
          }}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${title && title.toLowerCase()}`}
            value={input[dataIndex]}
            onChange={e =>
              setInput({
                ...input,
                [dataIndex]: e.target.value
              })
            }
            onPressEnter={e => handleSearch(e.target.value, dataIndex, type)}
            style={{
              marginBottom: 8,
              display: 'block'
            }}
          />
          <Space>
            <Button
              type='primary'
              // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              onClick={e => {
                if (!type)
                  setSearchValues({
                    ...searchValues,
                    [dataIndex]: e.target.value ? e.target.value : ''
                  })
                else
                  setSearchValues2({
                    ...searchValues2,
                    [dataIndex]: e.target.value ? e.target.value : ''
                  })
              }}
              icon={<SearchOutlined />}
              size='small'
              style={{
                width: 90
              }}
              className='flex items-center justify-between text-black'
            >
              Search
            </Button>
            <Button
              // onClick={() => clearFilters && handleReset(clearFilters)}
              onClick={() => {
                setInput({
                  ...input,
                  [dataIndex]: ''
                })
                handleSearch('', dataIndex, type)
              }}
              size='small'
              style={{
                width: 90
              }}
              className='flex items-center justify-center text-black'
            >
              Reset
            </Button>
            <Button
              type='link'
              size='small'
              onClick={() => {
                confirm({
                  closeDropdown: false
                })
              }}
            >
              Filter
            </Button>
          </Space>
        </div>
      )
    },
    filterIcon: filtered => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    }
  })

  const confirm = id => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Confirm this order?',
      cancelText: 'Cancel',
      onOk: () => confirmOrder(id)
    })
  }

  const cancel = id => {
    Modal.confirm({
      title: 'Cancel',
      content: 'Cancel this order?',
      cancelText: 'Cancel',
      icon: <CloseCircleOutlined />,
      onOk: () => cancelOrder(id)
    })
  }

  const confirmDelivered = id => {
    Modal.confirm({
      title: 'Confirm Delivered',
      content: 'Confirm this order delivered?',
      cancelText: 'Cancel',
      onOk: () => confirmOrderDelivered(id)
    })
  }

  const cancelOrder = async id => {
    setLoading(true)
    try {
      const token = await currentUser.getIdToken()
      await appApi.put(
        routes.CANCEL_ORDER,
        routes.getCancelOrderBody(
          'We are so sorry to tell you that this item is currently out-of-stock.'
        ),
        {
          ...routes.getAccessTokenHeader(token),
          ...routes.getConfirmOrderParams(id)
        }
      )
      fetchOrders()
    } catch (err) {
      console.log(err)
    }
  }

  const confirmOrder = async id => {
    setLoading(true)
    try {
      // console.log(id)
      const token = await currentUser.getIdToken()
      await appApi.put(routes.CONFIRM_ORDER, null, {
        ...routes.getAccessTokenHeader(token),
        ...routes.getConfirmOrderParams(id)
      })
      fetchOrders()
    } catch (err) {
      console.log(err)
    }
  }

  const confirmOrderDelivered = async id => {
    setLoading(true)
    try {
      const token = await currentUser.getIdToken()
      await appApi.put(routes.CONFIRM_ORDER_DELIVERED, null, {
        ...routes.getAccessTokenHeader(token),
        ...routes.getConfirmOrderParams(id)
      })
      fetchOrders()
    } catch (err) {
      console.log(err)
    }
  }

  const reformatDate = date => {
    const dates = date.split('-')
    return dates[2] + '-' + dates[1] + '-' + dates[0]
  }

  const columns = option => [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 6,
      sorter: (a, b) => sort(a, b, 'id'),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: "Customer's name",
      dataIndex: 'name',
      key: 'name',
      width: 20,
      ...getColumnSearchProps('name', "Customer's name", option),
      sorter: (a, b) => sort(a, b, 'name'),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 10,
      ...getColumnSearchProps('total', null, option),
      sorter: (a, b) => sort(a, b, 'total'),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 25,
      ...getColumnSearchProps('address', null, option),
      sorter: (a, b) => sort(a, b, 'address'),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Date',
      key: 'date',
      width: 10,
      ...getColumnSearchProps('date', null, option),
      sorter: (a, b) => sort(a, b, 'date'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p>{reformatDate(r.date.substring(0, 10))}</p>
    },
    {
      title: 'Delivered Date',
      key: 'deliveredDate',
      width: 10,
      ...getColumnSearchProps('deliveredDate', 'updatedAt', option),
      sorter: (a, b) => sort(a, b, 'updatedAt'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => (
        <p>{reformatDate((r.updatedAt || '    -  -  ').substring(0, 10))}</p>
      )
    },
    {
      title: 'Status',
      key: 'billstatus',
      width: 10,
      sorter: (a, b) => sort(a, b, 'billstatus'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => getStatusTag(r.billstatus)
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      width: 16
    },
    Table.EXPAND_COLUMN,
    {
      title: !initial && 'Action',
      key: 'operation',
      fixed: 'right',
      width: initial ? 1 : 10,
      render: (_, r, i) => {
        // If this order was delivered successfully, no action is allowed
        if (!option && pendingOrders[i].billstatus >= 3) return
        if (option && orders[i].billstatus >= 3) return

        if (initial) return

        // if option return true, that mean this function is called to generate columns for non-pending orders (its status maybe in progress, delivered or canceled)
        if (option) {
          return (
            <div className='flex w-full'>
              <Tooltip title='Confirm delivered'>
                <Button
                  type='primary'
                  className='bg-green-600 bg-opacity-70 hover:bg-opacity-100 hover:bg-green-600 border-0'
                  onClick={() => confirmDelivered(r.id)}
                  icon={<CheckSquareOutlined />}
                />
              </Tooltip>
            </div>
          )
        }
        return (
          <div className='flex w-full justify-between'>
            <Tooltip title='Cancel order'>
              <Button
                type='primary'
                danger
                className='bg-blue-button'
                onClick={() => cancel(r.id)}
                icon={<CloseSquareOutlined />}
              />
            </Tooltip>
            <Tooltip title='Confirm order'>
              <Button
                type='primary'
                className='bg-blue-button'
                onClick={() => confirm(r.id)}
                icon={<CheckSquareOutlined />}
              />
            </Tooltip>
          </div>
        )
      }
    }
  ]

  const getStatusTag = status => {
    switch (status) {
      case 1:
        return <Tag color='orange'>Pending</Tag>
      case 2:
        return <Tag color='blue'>In Progress</Tag>
      case 3:
        return <Tag color='green'>Delivered</Tag>
      case 4:
        return <Tag color='red'>Canceled</Tag>
      default:
        return <Tag>'Unknown'</Tag>
    }
  }

  return (
    <React.Fragment>
      <h1 className='flex items-center justify-between mb-4'>
        <strong className='text-xl'>Pending Orders</strong>
        <Button onClick={() => clearFilters(0)} className='text-black'>
          Clear Filters
        </Button>
      </h1>
      {
        <Table
          columns={columns(0)}
          dataSource={pendingOrders}
          loading={loading}
          scroll={{
            x: 1300
          }}
          expandable={{
            expandedRowRender: (_, index) => (
              <ExpandOrderItem
                currentUser={currentUser}
                id={pendingOrders[index].id}
              />
            ),
            columnWidth: 5,
            defaultExpandAllRows: true,
            defaultExpandedRowKeys: pendingOrders.map(o => o.key)
          }}
        />
      }
      <Divider />

      <h1 className='flex items-center justify-between mb-4'>
        <strong className='text-xl'>Orders</strong>
        <Button onClick={() => clearFilters(1)} className='text-black'>
          Clear Filters
        </Button>
      </h1>
      {
        <Table
          columns={columns(1)}
          dataSource={orders}
          loading={loading}
          scroll={{
            x: 1300
          }}
          expandable={{
            defaultExpandAllRows: true,
            expandedRowRender: (_, index) => (
              <ExpandOrderItem
                currentUser={currentUser}
                id={orders[index].id}
              />
            ),
            columnWidth: 5,
            defaultExpandedRowKeys: orders.map(o => o.key)
          }}
        />
      }
    </React.Fragment>
  )
}

export default Orders
