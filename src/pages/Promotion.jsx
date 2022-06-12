import React, { useEffect, useRef, useState } from 'react'
import { Table, Input, Button, Space, Tooltip, Modal, Spin } from 'antd'
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import useModal from '../utils/useModal'
import FormPromotionModify from '../components/FormPromotionModify'
import { useSelector } from 'react-redux'
import removeAccents from '../utils/removeAccents'

let result = []

const Promotion = () => {
  const searchInput = useRef(null)

  const [promotion, setPromotion] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchValues, setSearchValues] = useState({})
  const [input, setInput] = useState({})
  const [currItem, setCurrItem] = useState(null)
  const { isShowing, toggle } = useModal()
  const { currentUser } = useSelector(state => state.user)

  // Fetch promotion data
  const fetchPromotion = async () => {
    setLoading(true)
    try {
      const token = await currentUser.getIdToken()
      result = await appApi.get(routes.GET_ALL_PROMOTION, routes.getPromotionConfig(token,'ALL'))
      
      result = result.data.promotions.map((promotion, index) => ({
        ...promotion,
        key: index
      }))
      // Sort result by id
      result.sort((a, b) => a.id - b.id)

      console.log(result)
      setPromotion(result)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotion()
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
    setPromotion(filteredResult)
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
      console.log(
        'Delete item (use update): ',
        routes.getUpdateItemBody(
          id,
          promotion[id].itemName,
          promotion[id].typeValue,
          promotion[id].itemImage,
          promotion[id].price.substring(2),
          promotion[id].calories,
          promotion[id].featured,
          0
        )
      )
      const token = await currentUser.getIdToken()
      await appApi.put(
        routes.UPDATE_ITEM,
        routes.getUpdateItemBody(
          id,
          promotion[id].itemName,
          promotion[id].typeValue,
          promotion[id].itemImage,
          promotion[id].price.substring(2),
          promotion[id].calories,
          promotion[id].featured,
          0
        ),
        routes.getAccessTokenHeader(token)
      )
      await fetchPromotion()
      console.log('Success')
    } catch (err) {
      console.log(err)
    }
  }
  const reformatDate = date => {
    const dates = date.split('-')
    return dates[2] + '-' + dates[1] + '-' + dates[0]
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
      dataIndex: 'promotionName',
      key: 'promotionName',
      width: 30,
      ...getColumnSearchProps('promotionName', 'name'),
      sorter: (a, b) => sort(a, b, 'promotionName'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p className='font-medium'>{r.promotionName}</p>
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: 20,
      ...getColumnSearchProps('value'),
      sorter: (a, b) => sort(a, b, 'value'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p className='text-red-500'>{r.value*100+'%'}</p>
    },
    {
      title: 'Begin',
      key: 'begin',
      width: 20,
      ...getColumnSearchProps('date'),
      sorter: (a, b) => sort(a, b, 'date'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p>{reformatDate(r.begin.substring(0, 10))}</p>
    },
    {
      title: 'End',
      key: 'end',
      width: 20,
      ...getColumnSearchProps('date'),
      sorter: (a, b) => sort(a, b, 'date'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p>{reformatDate(r.end.substring(0, 10))}</p>
    },
    {
      title: 'Banner',
      dataIndex: 'banner',
      key: 'banner',
      width: 20,
      render: (_, r) => (
        <img className='h-16' src={r.banner} alt={r.promotionName} />
      )
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 18,
      render: (_, r) => (
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
              danger={true}
              icon={<DeleteOutlined />}
              type='primary'
            />
          </Tooltip>
        </div>
      )
    }
  ]

  const addPromotion = () => {
    toggle(true)
    setCurrItem(null)
  }

  return (
    <React.Fragment>
      <h1 className='flex items-center justify-between mb-4'>
        <strong className='text-xl'>Item List</strong>
        <div className='flex gap-2'>
          <Button
            type='primary'
            className='bg-blue-button flex items-center justify-center'
            onClick={() => addPromotion()}
          >
            <PlusCircleOutlined />
            Add
          </Button>
          <Button onClick={() => clearFilters()} className='text-black'>
            Clear Filters
          </Button>
        </div>
      </h1>
      {loading?
        <Spin/>
        : <Table
        columns={columns}
        dataSource={promotion}
        loading={loading}
        scroll={{
          x: 1000
        }}
        />
      }

      <FormPromotionModify
        title={currItem ? 'Edit Promotion' : 'Add Promotion'}
        isShowing={isShowing}
        onCancel={handleCancel}
        onCreate={handleSave}
        initial={currItem}
        setInitial={setCurrItem}
        fetchPromotion={fetchPromotion}
      />
    </React.Fragment>
  )
}

export default Promotion
