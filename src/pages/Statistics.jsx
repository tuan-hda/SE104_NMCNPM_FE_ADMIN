import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import { useState } from 'react'
import { BsCurrencyDollar } from 'react-icons/bs'
import ReportCard from '../components/ReportCard'
import { AppstoreOutlined, UserOutlined } from '@ant-design/icons'
import EChart from '../components/chart/EChart'
import LineChart from '../components/chart/LineChart'

const Statistic = () => {
  const [reports, setReports] = useState([])
  const [todayReports, setTodayReports] = useState({})
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState([])
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(-1)

  const { currentUser } = useSelector(state => state.user)

  /* report type
   0: Today report
   1: Daily report (month, year)
   2: Monthly repoprt (month)
  */
  const fetchReport = async (type, year, month) => {
    setLoading(true)
    try {
      const token = await currentUser.getIdToken()

      let result
      switch (type) {
        case 0:
          result = await appApi(
            routes.GET_TODAY_REPORT,
            routes.getAccessTokenHeader(token)
          )
          break
        case 1:
          result = await appApi(routes.GET_DAILY_REPORT, {
            ...routes.getDailyReportBody(year, month),
            ...routes.getAccessTokenHeader(token)
          })
          setReports(result.data.report)
          break
        case 2:
          result = await appApi(routes.GET_MONTHLY_REPORT, {
            ...routes.getMonthlyBody(year),
            ...routes.getAccessTokenHeader(token)
          })
          setReports(result.data.report)
          break
        default:
          result = []
      }

      // console.log(
      //   `Get ${
      //     type ? (type === 1 ? 'daily' : 'monthly') : 'today'
      //   } report results: `,
      //   result.data
      // )

      return result.data.report
    } catch (err) {
      console.log(err)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Fetch product data
  const fetchUser = async () => {
    try {
      const token = await currentUser.getIdToken()
      let result = await appApi.get(
        routes.GET_ALL_USERS,
        routes.getAccessTokenHeader(token)
      )

      result = result.data.users.map((user, index) => ({
        ...user,
        roleValue: user.roleData.value,
        key: index
      }))

      return result
    } catch (err) {
      console.log(err)
      return []
    }
  }

  // Fetch product data
  const fetchProduct = async () => {
    try {
      let result = await appApi.get(
        routes.GET_ITEM,
        routes.getItemParams('ALL')
      )
      // console.log('Before formatted: ', result)

      // Add category to object
      result = result.data.items

      return result
    } catch (err) {
      console.log(err)
      return []
    }
  }

  const fetchAllReport = async () => {
    try {
      const today = new Date()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const year = today.getFullYear()
      const result = await Promise.all([
        fetchReport(0, year, month),
        fetchUser(),
        fetchProduct()
      ])
      // console.log(result)
      setTodayReports(result[0])
      setUsers(result[1])
      setProducts(result[2])
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (parseInt(month) === -1) {
      fetchReport(2, year)
      console.log(1)
    } else {
      fetchReport(1, year, month)
      console.log(1)
    }
  }, [year, month])

  useEffect(() => {
    fetchAllReport()
  }, [])

  const data = [
    {
      title: "Today's revenue",
      value: '$ ' + todayReports.dailyReport?.revenue,
      icon: <BsCurrencyDollar />
    },
    {
      title: 'Users',
      value: users.length,
      icon: <UserOutlined />
    },
    {
      title: 'Products',
      value: products.length,
      icon: <AppstoreOutlined />
    }
  ]

  useEffect(() => {
    console.log(month === -1)
  }, [month])

  return (
    <>
      <h1 className='text-xl font-bold mb-4'>Overview</h1>

      <div className='grid grid-cols-3'>
        {data.map((d, i) => (
          <ReportCard data={d} key={i} />
        ))}
      </div>

      <h1 className='text-xl font-bold mb-4 mt-8'>
        {/* Year */}
        <span className='mr-4'>Year</span>
        <input
          type='number'
          className='rounded-md h-10 px-2 font-semibold'
          min={1999}
          max={new Date().getFullYear()}
          value={year}
          onChange={e => setYear(e.target.value)}
        />
        {/* Month */}
        <span className='ml-12 mr-4'>Month</span>

        <select
          value={month}
          onChange={e => setMonth(e.target.value)}
          className='rounded-md h-10 px-2 font-semibold'
        >
          <option value={-1}>None</option>
          <option value={1}>Jan</option>
          <option value={2}>Feb</option>
          <option value={3}>Mar</option>
          <option value={4}>Apr</option>
          <option value={5}>May</option>
          <option value={6}>Jun</option>
          <option value={7}>Jul</option>
          <option value={8}>Aug</option>
          <option value={9}>Sep</option>
          <option value={10}>Oct</option>
          <option value={11}>Nov</option>
          <option value={12}>Dec</option>
        </select>
      </h1>

      <div className=''>
        <EChart data={reports} month={parseInt(month)} year={year} />
        <LineChart data={reports} month={parseInt(month)} year={year} />
      </div>
    </>
  )
}

export default Statistic
