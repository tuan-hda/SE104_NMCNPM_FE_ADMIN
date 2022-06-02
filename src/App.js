import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Main from './pages/Main'
import Product from './pages/Product'
import User from './pages/User'
import Transaction from './pages/Transaction'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Main />}>
        <Route path='product' element={<Product />} />
        <Route path='user' element={<User />} />
        <Route path='transaction' element={<Transaction />} />
      </Route>
      <Route path='*' element={<Navigate to='/product' />} />
    </Routes>
  )
}

export default App