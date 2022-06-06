import * as types from '../actions/actionTypes'

const initialState = {
  loading: true,
  currentUser: null,
  error: null,
  message: ''
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SIGN_UP_START:
    case types.SIGN_IN_START:
    case types.LOG_OUT_START:
    case types.GOOGLE_SIGN_IN_START:
    case types.FACEBOOK_SIGN_IN_START:
    case types.RESET_PASSWORD_START:
    case types.CHANGE_PASSWORD_START:
      return {
        ...state,
        message: '',
        loading: true
      }

    case types.SIGN_UP_SUCCESS:
    case types.SIGN_IN_SUCCESS:
    case types.GOOGLE_SIGN_IN_SUCCESS:
    case types.FACEBOOK_SIGN_IN_SUCCESS:
      return {
        loading: false,
        currentUser: action.payload,
        error: null,
        message: ''
      }

    case types.SIGN_UP_FAIL:
    case types.SIGN_IN_FAIL:
    case types.LOG_OUT_FAIL:
    case types.GOOGLE_SIGN_IN_FAIL:
    case types.FACEBOOK_SIGN_IN_FAIL:
    case types.RESET_PASSWORD_FAIL:
    case types.CHANGE_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: ''
      }

    case types.SET_USER:
      return {
        loading: false,
        error: null,
        currentUser: action.payload,
        message: ''
      }

    case types.LOG_OUT_SUCCESS:
      return {
        loading: false,
        error: null,
        currentUser: null,
        message: ''
      }

    case types.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        message: 'Email sent. Check your email for furthur instructions.'
      }

    case types.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        message: 'Password changed.'
      }

    case types.RESET_ERROR:
      return {
        ...state,
        error: null,
        loading: false
      }

    default:
      return state
  }
}

export default authReducer
