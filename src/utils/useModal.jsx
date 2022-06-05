import { useState } from 'react'

const useModal = () => {
  const [isShowing, setShowing] = useState(false)

  const toggle = value => {
    setShowing(value)
  }

  return {
    isShowing,
    toggle
  }
}

export default useModal
