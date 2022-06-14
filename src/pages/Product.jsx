import React, { useEffect, useRef, useState } from 'react'
import { Table, Input, Button, Space, Tooltip, Tag, Modal } from 'antd'
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import useModal from '../utils/useModal'
import FormProductModify from '../components/FormProductModify'
import { useSelector } from 'react-redux'
import removeAccents from '../utils/removeAccents'

// const data = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//   },
//   {
//     key: '2',
//     name: 'Joe Black',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//   },
//   {
//     key: '3',
//     name: 'Jim Green',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park',
//   },
//   {
//     key: '4',
//     name: 'Jim Red',
//     age: 32,
//     address: 'London No. 2 Lake Park',
//   },
// ];
let result = []

const Product = () => {
  const searchInput = useRef(null)

  const [product, setProduct] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchValues, setSearchValues] = useState({})
  const [input, setInput] = useState({})
  const [currItem, setCurrItem] = useState(null)
  const { isShowing, toggle } = useModal()
  const { isShowing: isShowing2, toggle: toggle2 } = useModal()
  const { currentUser } = useSelector(state => state.user)
  const role = useSelector(state => state.role)

  // Fetch product data
  const fetchProduct = async () => {
    setLoading(true)
    try {
      result = await appApi.get(routes.GET_ITEM, routes.getItemParams('ALL'))

      // console.log('Before formatted: ', result)

      // Add category to object
      result = result.data.items.map((item, index) => ({
        ...item,
        typeValue: item.typeData.value,
        price: '$ ' + item.price,
        key: index
      }))

      // Sort result by id
      result.sort((a, b) => a.id - b.id)

      console.log('After formatted: ', result)
      setProduct(result)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [])

  const sort = (a, b, key) => {
    if (!a || !b) return 1
    if (!isNaN(a[key]) && !isNaN(b[key])) return a[key] - b[key]
    return String(a[key]).localeCompare(b[key])
  }

  const compareStr = (s1, s2) => s1.toLowerCase().includes(s2.toLowerCase())

  useEffect(() => {
    let filteredResult = result
    Object.keys(searchValues).forEach(k => {
      filteredResult = filteredResult.filter(item => {
        return compareStr(
          removeAccents(String(item[k])),
          removeAccents(searchValues[k])
        )
      })
    })
    setProduct(filteredResult)
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

  const showModal = id => {
    toggle(true)
    setCurrItem(result.filter(r => r.id === id)[0])
  }

  const handleCancel = () => {
    toggle(false)
  }

  const handleSave = () => {
    toggle(false)
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
      title: 'Warning',
      content: 'Are you sure you want to remove this item?',
      cancelText: 'Cancel',
      okType: 'danger',
      onOk: () => deleteItem(id)
    })
  }

  const deleteItem = async id => {
    try {
      console.log('Delete item: ', routes.getIdParams(id))
      const token = await currentUser.getIdToken()
      await appApi.put(routes.DELETE_ITEM, null, {
        ...routes.getAccessTokenHeader(token),
        ...routes.getIdParams(id)
      })
      fetchProduct()
      console.log('Success')
    } catch (err) {
      console.log(err)
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 8,
      sorter: (a, b) => sort(a, b, 'id'),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Name',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 40,
      ...getColumnSearchProps('itemName', 'name'),
      sorter: (a, b) => sort(a, b, 'itemName'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p className='font-medium'>{r.itemName}</p>
    },
    {
      title: 'Category',
      dataIndex: 'typeValue',
      key: 'typeValue',
      width: 20,
      ...getColumnSearchProps('typeValue', 'category'),
      sorter: (a, b) => sort(a, b, 'typeValue'),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 20,
      ...getColumnSearchProps('price'),
      sorter: (a, b) => sort(a, b, 'price'),
      sortDirections: ['descend', 'ascend'],
      className: 'text-red-500'
    },
    {
      title: 'Calories',
      dataIndex: 'calories',
      key: 'calories',
      width: 20,
      ...getColumnSearchProps('calories'),
      sorter: (a, b) => sort(a, b, 'calories'),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Featured',
      key: 'featured',
      width: 16,
      sorter: (a, b) => sort(a, b, 'featured'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) =>
        r.featuredData.value === 'Yes' ? (
          <Tag color='green'>Yes</Tag> // #87d068
        ) : (
          <Tag>No</Tag>
        )
    },
    {
      title: 'Available',
      key: 'available',
      width: 16,
      sorter: (a, b) => sort(a, b, 'available'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) =>
        r.availableData.value === 'Available' ? (
          <Tag color='green'>Yes</Tag> //#87d068
        ) : (
          <Tag>No</Tag>
        )
    },
    {
      title: 'Image',
      dataIndex: 'itemImage',
      key: 'itemImage',
      width: 20,
      render: (_, r) => (
        <img className='w-16 h-16' src={r.itemImage} alt={r.itemName} />
      )
    },
    {
      title: role === 'admin' && 'Action',
      key: 'operation',
      fixed: 'right',
      width: role === 'admin' ? 18 : 1,
      render: (_, r) => {
        if (role !== 'admin') return null
        return (
          <div className='flex gap-4'>
            <Tooltip title='Edit'>
              <Button
                onClick={() => showModal(r.id)}
                icon={<EditOutlined />}
                type='primary'
                className='bg-blue-button'
              />
            </Tooltip>

            <Tooltip title='Remove'>
              <Button
                onClick={() => confirm(r.id)}
                danger={r.available}
                icon={<DeleteOutlined />}
                type='primary'
                disabled={!r.available}
              />
            </Tooltip>
          </div>
        )
      }
    }
  ]

  const addProduct = () => {
    toggle(true)
    setCurrItem(null)
  }

  if (role === null) return null

  return (
    <React.Fragment>
      <h1 className='flex items-center justify-between mb-4'>
        <strong className='text-xl'>Item List</strong>
        <div className='flex gap-2'>
          {role === 'admin' && (
            <Button
              type='primary'
              className='bg-blue-button flex items-center justify-center'
              onClick={() => addProduct()}
            >
              <PlusCircleOutlined />
              Add
            </Button>
          )}
          <Button onClick={() => clearFilters()} className='text-black'>
            Clear Filters
          </Button>
        </div>
      </h1>
      <Table
        columns={columns}
        dataSource={product}
        loading={loading}
        scroll={{
          x: 1000
        }}
      />

      <FormProductModify
        title={currItem ? 'Edit Item' : 'Add Product'}
        isShowing={isShowing}
        onCancel={handleCancel}
        onCreate={handleSave}
        initial={currItem}
        setInitial={setCurrItem}
        fetchProduct={fetchProduct}
      />
    </React.Fragment>
  )
}

export default Product
