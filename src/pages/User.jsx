import React, { useEffect, useRef, useState } from 'react'
import { Table, Input, Button, Space, Tooltip, Tag } from 'antd'
import {
  SearchOutlined,
  EditOutlined,
  UserOutlined
} from '@ant-design/icons'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import useModal from '../utils/useModal'
import FormProfile from '../components/FormProfile'
import { useSelector } from 'react-redux'
import FormChangeRole from '../components/FormChangeRole'

let result = []
const User = () => {
  const searchInput = useRef(null)

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchValues, setSearchValues] = useState({})
  const [input, setInput] = useState({})
  const [currItem, setCurrItem] = useState(null)
  const { isShowing, toggle } = useModal()
  const { currentUser } = useSelector(state => state.user)
  const [isProfile,setModal] = useState(true)

  // Fetch product data
  const fetchUser = async () => {
    try {
      const token = await currentUser.getIdToken()
      result = await appApi.get(routes.GET_ALL_USERS,routes.getAccessTokenHeader(token))

      result = result.data.users.map((user, index) => ({
        ...user,
        roleValue: user.roleData.value,
        key: index
      }))

      setUsers(result)
    } catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchUser()
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
    setUsers(filteredResult)
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

  const showModal = (id,isProfile) => {
    toggle(true)
    setCurrItem(result.filter(r => r.id === id)[0])
    setModal(isProfile)
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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 30,
      sorter: (a, b) => sort(a, b, 'id'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p className='font-medium'>{r.id}</p>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 35,
      ...getColumnSearchProps('name', 'name'),
      sorter: (a, b) => sort(a, b, 'name'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p className=''>{r.name}</p>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 35,
      ...getColumnSearchProps('email', 'name'),
      sorter: (a, b) => sort(a, b, 'email'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) => <p className=''>{r.email}</p>
    },
    
    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 20,
      ...getColumnSearchProps('phoneNumber'),
      sorter: (a, b) => sort(a, b, 'phoneNumber'),
      sortDirections: ['descend', 'ascend'],
      className: ''
    },
    {
      title: 'Role',
      key: 'roleValue',
      width: 16,
      sorter: (a, b) => sort(a, b, 'roleValue'),
      sortDirections: ['descend', 'ascend'],
      render: (_, r) =>{
        switch (r.roleValue) {
          case 'Customer':
            return <Tag color='green'>Customer</Tag> //#87d068
          case 'Staff':
            return <Tag color='yellow'>Staff</Tag>
          case 'Admin':
            return <Tag color='red'>Admin</Tag>
          default:
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
          <Tooltip title='Profile'>
            <Button
              onClick={() => showModal(r.id,true)}
              icon={<UserOutlined />}
              type='primary'
              className='bg-blue-button'
            />
          </Tooltip>

          <Tooltip title='Change role'>
            <Button
              onClick={() => showModal(r.id,false)}
              danger
              icon={<EditOutlined />}
              type='primary'
              hidden={r.roleValue==='Customer'}
            />
          </Tooltip>
        </div>
      )
    }
  ]

  return (
    <React.Fragment>
      <h1 className='flex items-center justify-between mb-4'>
        <strong className='text-xl'>User list</strong>
        <div className='flex gap-2'>
          <Button onClick={() => clearFilters()} className='text-black'>
            Clear Filters
          </Button>
        </div>
      </h1>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        scroll={{
          x: 1000
        }}
      />

      <FormProfile
        title={'Profile'}
        isShowing={isShowing&&isProfile}
        onCancel={handleCancel}
        initial={currItem}
        setInitial={setCurrItem}
      />
      <FormChangeRole
        title={'Edit role'}
        isShowing={isShowing&&!isProfile}
        onCancel={handleCancel}
        onCreate={handleSave}
        initial={currItem}
        setInitial={setCurrItem}
      />
    </React.Fragment>
  )
}

export default User