const eChartDaily = arr => ({
  options: {
    chart: {
      type: 'bar',
      width: '100%',
      height: 'auto'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent']
    },
    grid: {
      show: true,
      borderColor: '#ccc',
      strokeDashArray: 2
    },
    xaxis: {
      categories: arr,
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: arr.map(() => '#fff')
        }
      }
    },
    yaxis: {
      labels: {
        show: true,
        align: 'right',
        minWidth: 0,
        maxWidth: 160,
        style: {
          colors: arr.map(() => '#fff')
        }
      }
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return '$ ' + val
        }
      }
    }
  }
})

export default eChartDaily
