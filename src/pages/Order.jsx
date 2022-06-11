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

let pending = []
let rest = []

const Product = () => {
  const searchInput = useRef(null)
  const [pendingOrders, setPendingOrders] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchValues, setSearchValues] = useState({})
  const [input, setInput] = useState({})
  const { currentUser } = useSelector(state => state.user)

  const getProvinceName = province =>
    province.substring(province.indexOf('_') + 1)

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true)
    try {
      const token = await currentUser.getIdToken()

      let result = await appApi.get(
        routes.GET_RESTAURANT_ORDERS,
        routes.getAccessTokenHeader(token)
      )

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

      result.forEach(order => {
        if (order.billstatus === 1) pending.push(order)
        else rest.push(order)
      })

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
  }, [])

  const sort = (a, b, key) => {
    if (!a || !b) return 1
    if (!isNaN(a[key]) && !isNaN(b[key])) return a[key] - b[key]
    return String(a[key]).localeCompare(b[key])
  }

  const compareStr = (s1, s2) => s1.toLowerCase().includes(s2.toLowerCase())

  useEffect(() => {
    if (!pending.length) return
    let filteredResult = pending
    console.log('FilteredResult: ' + filteredResult)
    Object.keys(searchValues).forEach(k => {
      filteredResult = filteredResult.filter(item => {
        return compareStr(
          removeAccents(String(item[k])),
          removeAccents(searchValues[k])
        )
      })
    })
    setPendingOrders(filteredResult)
  }, [searchValues])

  const clearFilters = () => {
    setSearchValues({})
  }

  const handleSearch = (value, dataIndex) => {
    setSearchValues({
      ...searchValues,
      [dataIndex]: value
    })
  }

  const getColumnSearchProps = (dataIndex, title) => ({
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
            onPressEnter={e => handleSearch(e.target.value, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block'
            }}
          />
          <Space>
            <Button
              type='primary'
              // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              onClick={e =>
                setSearchValues({
                  ...searchValues,
                  [dataIndex]: e.target.value ? e.target.value : ''
                })
              }
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
                handleSearch('', dataIndex)
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

  const cancel = () => {
    Modal.confirm({
      title: 'Cancel',
      content: 'Cancel this order?',
      cancelText: 'Cancel',
      icon: <CloseCircleOutlined />
    })
  }

  const confirmDelivered = id => {
    Modal.confirm({
      title: 'Confirm Delivered',
      content: 'Confirm this order delivered?',
      cancelText: 'Cancel'
    })
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
    } finally {
      setLoading(false)
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
      ...getColumnSearchProps('name', "Customer's name"),
      sorter: (a, b) => sort(a, b, 'name'),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 10,
      ...getColumnSearchProps('total'),
      sorter: (a, b) => sort(a, b, 'total'),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 30,
      ...getColumnSearchProps('address'),
      sorter: (a, b) => sort(a, b, 'address'),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Date',
      key: 'date',
      width: 10,
      ...getColumnSearchProps('date'),
      sorter: (a, b) => sort(a, b, 'date'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p>{reformatDate(r.date.substring(0, 10))}</p>
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
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 10,
      render: (_, r) => {
        // If this order was delivered successfully, no action is allowed
        if (r.billstatus >= 3) return

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
                onClick={cancel}
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
        <Button onClick={clearFilters} className='text-black'>
          Clear Filters
        </Button>
      </h1>
      <Table
        columns={columns(0)}
        dataSource={pendingOrders}
        loading={loading}
        scroll={{
          x: 1300
        }}
        expandable={{
          columnWidth: 5
        }}
      />

      <Divider />

      <h1 className='flex items-center justify-between mb-4'>
        <strong className='text-xl'>Orders</strong>
        <Button onClick={clearFilters} className='text-black'>
          Clear Filters
        </Button>
      </h1>
      <Table
        columns={columns(1)}
        dataSource={orders}
        loading={loading}
        scroll={{
          x: 1300
        }}
        expandable={{
          columnWidth: 5
        }}
      />
    </React.Fragment>
  )
}

export default Product
