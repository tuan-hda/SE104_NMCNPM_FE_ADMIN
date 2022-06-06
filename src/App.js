import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Main from './pages/Main'
import Product from './pages/Product'
import User from './pages/User'
import Transaction from './pages/Transaction'
import SignIn from './pages/SignIn'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from './firebase'
import { setUser } from './actions'
import NotFound from './pages/NotFound'
import Order from './pages/Order'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser(user))
      } else {
        dispatch(setUser(null))
      }
    })

    return unsubcribe
  }, [dispatch])

  return (
    <Routes>
      <Route path='/signin' element={<SignIn />} />
      <Route path='/' element={<Main />}>
        <Route path='product' element={<Product />} />
        <Route path='user' element={<User />} />
        <Route path='transaction' element={<Transaction />} />
        <Route path='order' element={<Order />} />
      </Route>
      <Route path='/notfound' element={<NotFound signout={true} />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
