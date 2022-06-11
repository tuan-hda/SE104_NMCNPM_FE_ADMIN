import { combineReducers } from 'redux'
import authReducer from './authReducer'
import roleReducer from './roleReducer'

const allReducers = combineReducers({
  user: authReducer,
  role: roleReducer
})

export default allReducers
