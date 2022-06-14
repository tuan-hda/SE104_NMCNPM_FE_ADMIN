import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import appApi from '../api/appApi'
import * as routes from '../api/apiRoutes'
import { useState } from 'react'

const Statistic = () => {
  const [reports, setReports] = useState([])
  const { currentUser } = useSelector(state => state.user)

  /* report type
   0: Today report
   1: Daily report (month, year)
   2: Monthly repoprt (month)
  */
  const fetchReport = async (type, year, month) => {
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
          break
        case 2:
          result = await appApi(routes.GET_MONTHLY_REPORT, {
            ...routes.getMonthlyBody(year),
            ...routes.getAccessTokenHeader(token)
          })
          break
        default:
          result = []
      }

      console.log(result.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchReport(0)
  }, [])

  return <div>Statistic</div>
}

export default Statistic
