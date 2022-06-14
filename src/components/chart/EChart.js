/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import ReactApexChart from 'react-apexcharts'
import eChart from './configs/eChart'
import getDateNumber from '../../utils/getDateNumber'
import getMonthDate from '../../utils/getMonthDate'
import eChartDaily from './configs/eChartDaily'

function EChart({ data, year, month }) {
  const handleMonthly = data => {
    const array = new Array(12).fill(0)
    if (!Array.isArray(data)) return
    ;(data || []).forEach(d => {
      if (d.month) {
        array[d.month - 1] = d.totalRevenue || 0
      }
    })
    // console.log(array)
    return array
  }

  const handleDaily = data => {
    const array = getDateNumber(year, month)

    ;(data?.dailyReport || []).forEach(d => {
      if (data.length !== 0) {
        array[parseInt(d.date.substring(8, 10)) - 1] = d.revenue
      }
    })

    return array
  }

  const getMonthlyReportsData = data => {
    // console.log(array)
    if (month === -1) return handleMonthly(data)
    else return handleDaily(data)
  }

  return (
    <>
      <div className='w-full' id='chart'>
        <ReactApexChart
          className='bar-chart'
          options={
            month === -1
              ? eChart.options
              : eChartDaily(getMonthDate(year, month)).options
          }
          series={[
            {
              name: 'Sales',
              data: getMonthlyReportsData(data),
              color: '#fff'
            }
          ]}
          type='bar'
          height={220}
        />
      </div>
    </>
  )
}

export default EChart
