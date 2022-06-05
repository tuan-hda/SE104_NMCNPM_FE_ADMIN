import { combineReducers } from 'redux'
import authReducer from './authReducer'

const allReducers = combineReducers({
  user: authReducer
})

export default allReducers
