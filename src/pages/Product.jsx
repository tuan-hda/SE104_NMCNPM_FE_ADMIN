import React, { useEffect, useRef, useState } from 'react'
import { Table, Input, Button, Space, Tooltip, Tag } from 'antd'
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import useModal from 'antd/lib/modal/useModal'

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
  const { isShowing, toggle } = useModal()

  // Fetch product data
  const fetchProduct = async () => {
    try {
      result = await appApi.get(routes.GET_ITEM, routes.getItemParams('ALL'))

      // Add category to object
      result = result.data.items.map((item, index) => ({
        ...item,
        typeValue: item.typeData.value,
        price: '$ ' + item.price,
        key: index
      }))

      // Sort result by id
      result.sort((a, b) => a.id - b.id)

      console.log(result)
      setProduct(result)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    setLoading(true)
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
        // console.log(item[k] + ' - ' + searchValues[k])
        return compareStr(item[k], searchValues[k])
      })
    })
    setProduct(filteredResult)
  }, [searchValues])

  const clearFiltersAndSearch = () => {
    setSearchValues({})
  }

  const handleSearch = (value, dataIndex) => {
    setSearchValues({
      ...searchValues,
      [dataIndex]: value
    })
  }

  const showModal = () => {
    toggle(true)
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
              type="primary"
              // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              onClick={e =>
                setSearchValues({
                  ...searchValues,
                  [dataIndex]: e.target.value ? e.target.value : ''
                })
              }
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90
              }}
              className="flex items-center justify-between text-black"
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
              size="small"
              style={{
                width: 90
              }}
              className="flex items-center justify-center text-black"
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
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
      render: (_, r) => <p className="font-medium">{r.itemName}</p>
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
      title: 'Featured',
      key: 'featured',
      width: 16,
      render: (_, r) =>
        r.featuredData.value === 'Yes' ? (
          <Tag color="#87d068">Yes</Tag>
        ) : (
          <Tag>No</Tag>
        )
    },
    {
      title: 'Available',
      key: 'available',
      width: 16,
      render: (_, r) =>
        r.availableData.value === 'Available' ? (
          <Tag color="#87d068">Yes</Tag>
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
        <img className="w-16 h-16" src={r.itemImage} alt={r.itemName} />
      )
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 18,
      render: () => (
        <div className="flex gap-4">
          <Tooltip title="Edit">
            <Button
              onClick={showModal}
              icon={<EditOutlined />}
              type="primary"
              className="bg-blue-500"
            />
          </Tooltip>

          <Tooltip title="Remove">
            <Button danger icon={<DeleteOutlined />} type="primary" />
          </Tooltip>
        </div>
      )
    }
  ]

  return (
    <React.Fragment>
      <h1 className="flex items-center justify-between">
        <strong className="text-xl">Product</strong>
        <button
          onClick={() => clearFiltersAndSearch()}
          className="bg-color-primary text-white rounded-md p-2 mb-4 hover:bg-opacity-80 transition duration-300"
        >
          Clear Filters and Search
        </button>
      </h1>
      <Table
        columns={columns}
        dataSource={product}
        loading={loading}
        scroll={{
          x: 1000
        }}
      />
    </React.Fragment>
  )
}

export default Product
