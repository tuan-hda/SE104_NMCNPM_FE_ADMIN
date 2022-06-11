import * as types from '../actions/actionTypes'

const roleReducer = (state = '', action) => {
  switch (action.type) {
    case types.UPDATE_ROLE:
      return action.payload
    default:
      return state
  }
}

export default roleReducer
