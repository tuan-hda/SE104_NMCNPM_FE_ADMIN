const getDateNumber = (year, month) => {
  switch (month) {
    case 2:
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return new Array(29).fill(0)
      } else {
        return new Array(28).fill(0)
      }
    case 4:
    case 6:
    case 9:
    case 11:
      return new Array(30).fill(0)

    default:
      return new Array(31).fill(0)
  }
}

export default getDateNumber
