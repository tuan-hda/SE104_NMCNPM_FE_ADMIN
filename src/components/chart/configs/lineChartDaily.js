const lineChartDaily = arr => ({
  options: {
    chart: {
      width: '100%',
      height: 350,
      type: 'area',
      toolbar: {
        show: false
      }
    },

    legend: {
      show: false
    },

    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },

    yaxis: {
      labels: {
        style: {
          fontSize: '14px',
          fontWeight: 600,
          colors: ['#8c8c8c']
        }
      }
    },

    xaxis: {
      labels: {
        style: {
          fontSize: '14px',
          fontWeight: 600,
          colors: arr.map(() => '#8c8c8c')
        }
      },
      categories: arr
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return val
        }
      }
    }
  }
})

export default lineChartDaily
