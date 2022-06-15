const round2digits = price => {
  return (Math.round(price * 100) / 100).toFixed(2)
}

export default round2digits
