import React, { useEffect, useRef, useState } from 'react'
import { Table, Input, Button, Space, Tooltip, Tag,Spin } from 'antd'
import {
  SearchOutlined,
  EditOutlined,
  UserOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import useModal from '../utils/useModal'
import { useSelector } from 'react-redux'
import FormChangeRole from '../components/FormChangeRole'
import FormChangeStatus from '../components/FormChangeStatus'
import FormAddStaff from '../components/FormAddStaff'

let result = []
const Staff = () => {
  const searchInput = useRef(null)

  const [staffs, setStaffs] = useState([])
  const [restaurants,setRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchValues, setSearchValues] = useState({})
  const [input, setInput] = useState({})
  const [currItem, setCurrItem] = useState(null)
  const { isShowing, toggle } = useModal()
  const { currentUser } = useSelector(state => state.user)
  const [isStatus, setModal] = useState(true)

  // Fetch staff data
  const fetchStaff = async () => {
    try {
      const token = await currentUser.getIdToken()
      result = await appApi.get(
        routes.GET_STAFFS_LIST,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      )

      result = result.data.staffs.map((staff, index) => ({
        ...staff,
        key: index
      }))
      // Sort result by id
      result.sort((a, b) => a.id - b.id)

      console.log(result)
      setStaffs(result)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRestaurant = async () => {
    try {
      let result = await appApi.get(
        routes.GET_RESTAURANT,
        routes.getRestaurantParams('ALL')
      )
      console.log(result.data)

      result = result.data.restaurants.map((restaurant, index) => ({
        id: restaurant.id,
        resAddress:restaurant.resAddress,
        key: index
      }))
      // Sort result by id
      result.sort((a, b) => a.id - b.id)
      setRestaurants(result)
    } catch (err) {
      if (err.response) {
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
      } else {
        console.log(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchStaff()
    fetchRestaurant()
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
        return compareStr(item[k], searchValues[k])
      })
    })
    setStaffs(filteredResult)
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

  const showModal = (id, modalID) => {
    toggle(true)
    setCurrItem(result.filter(r => r.id === id)[0])
    setModal(modalID)
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
      dataIndex: 'name',
      key: 'name',
      width: 25,
      ...getColumnSearchProps('name', 'name'),
      sorter: (a, b) => sort(a, b, 'name'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p className='font-medium'>{r.User.name}</p>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 30,
      ...getColumnSearchProps('email', 'name'),
      sorter: (a, b) => sort(a, b, 'email'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p className=''>{r.User.email}</p>
    },

    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 25,
      ...getColumnSearchProps('phoneNumber'),
      sorter: (a, b) => sort(a, b, 'phoneNumber'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p className=''>{r.User.phoneNumber}</p>
    },
    {
      title: 'Restaurant',
      dataIndex: 'name',
      key: 'name',
      width: 35,
      ...getColumnSearchProps('name', 'name'),
      sorter: (a, b) => sort(a, b, 'name'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p className=''>{r.Restaurant.resAddress}</p>
    },
    {
      title: 'Role',
      key: 'roleValue',
      width: 16,
      sorter: (a, b) => sort(a, b, 'roleValue'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => {
        switch (r.User.roleID) {
          case 0:
            return <Tag color='red'>{r.User.roleData.value}</Tag>
          case 1:
            return <Tag color='yellow'>{r.User.roleData.value}</Tag>
          default:
        }
      }
    },
    {
      title: 'Working day',
      key: 'workingDay',
      width: 20,
      ...getColumnSearchProps('date', null),
      sorter: (a, b) => sort(a, b, 'date'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p>{reformatDate(r.workingDay.substring(0, 10))}</p>
    },
    {
      title: 'Status',
      key: 'statusValue',
      width: 16,
      sorter: (a, b) => sort(a, b, 'statusValue'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => {
        switch (r.staffStatus) {
          case 1:
            return <Tag color='green'>{r.staffstatusData.value}</Tag> //#87d068
          default:
            return <Tag color='red'>{r.staffstatusData.value}</Tag>
        }
      }
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 18,
      render: (_, r) => (
        <div className='flex gap-4'>
          <Tooltip title='Change role'>
            <Button
              onClick={() => showModal(r.id, 0)}
              icon={<UserOutlined />}
              type='primary'
              className='bg-blue-button'
              hidden={r.UserId===currentUser.uid}
            />
          </Tooltip>

          <Tooltip title='Update status'>
            <Button
              onClick={() => showModal(r.id, 1)}
              danger
              icon={<EditOutlined />}
              type='primary'
              hidden={r.UserId===currentUser.uid}
            />
          </Tooltip>
        </div>
      )
    }
  ]

  const addStaff = () => {
    toggle(true)
    setCurrItem(null)
    setModal(2)
  }

  return (
    <React.Fragment>
      <h1 className='flex items-center justify-between mb-4'>
        <strong className='text-xl'>Staff list</strong>
        <div className='flex gap-2'>
          <Button
            type='primary'
            className='bg-blue-button flex items-center justify-center'
            onClick={() => addStaff()}
          >
            <PlusCircleOutlined />
            Add
          </Button>
          <Button onClick={() => clearFilters()} className='text-black'>
            Clear Filters
          </Button>
        </div>
      </h1>
      {loading?<Spin/>:
      <Table
        columns={columns}
        dataSource={staffs}
        loading={loading}
        scroll={{
          x: 1000
        }}
      />
      }
      <FormChangeRole
        title={'Edit role'}
        isShowing={isShowing && isStatus===0}
        onCancel={handleCancel}
        onCreate={handleSave}
        initial={currItem}
        setInitial={setCurrItem}
        fetchStaff={fetchStaff}
      />
      <FormChangeStatus
        title={'Update staff status'}
        isShowing={isShowing && isStatus===1}
        onCancel={handleCancel}
        onCreate={handleSave}
        initial={currItem}
        setInitial={setCurrItem}
        fetchStaff={fetchStaff}
      />
      <FormAddStaff
        title={'Add new staff'}
        isShowing={isShowing && isStatus===2}
        onCancel={handleCancel}
        onCreate={handleSave}
        initial={currItem}
        setInitial={setCurrItem}
        fetchStaff={fetchStaff}
        restaurants={restaurants}
      />
    </React.Fragment>
  )
}

export default Staff