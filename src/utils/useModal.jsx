import { useState } from 'react'

const useModal = () => {
  const [isShowing, setShowing] = useState(false)

  const toggle = () => {
    setShowing(!isShowing)
  }

  return {
    isShowing,
    setShowing
  }
}

export default useModal
