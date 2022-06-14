const getMonthDate = (year, month) => {
  let array = []
  for (let i = 1; i < 29; i++) array.push(i)
  switch (month) {
    case 2:
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        array.push(29)
      }
      break
    case 4:
    case 6:
    case 9:
    case 11:
      array.push(29, 30)
      break
    default:
      array.push(29, 30, 31)
      break
  }

  return array
}

export default getMonthDate
