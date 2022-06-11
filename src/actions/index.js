import { auth } from '../firebase'
import * as types from './actionTypes'
import { googleAuthProvider, facebookAuthProvider } from '../firebase'

// SIGN IN

const signinStart = () => ({
  type: types.SIGN_IN_START
})

const signinSuccess = user => ({
  type: types.SIGN_IN_SUCCESS,
  payload: user
})

const signinFail = err => ({
  type: types.SIGN_IN_FAIL,
  payload: err
})

export const signinInitiate = (email, password) => dispatch => {
  dispatch(signinStart())
  auth
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      dispatch(signinSuccess(user))
    })
    .catch(err => {
      dispatch(signinFail(err.message))
    })
}

// SIGN UP

const signupStart = () => ({
  type: types.SIGN_UP_START
})

const signupSuccess = user => ({
  type: types.SIGN_UP_SUCCESS,
  payload: user
})

const signupFail = err => ({
  type: types.SIGN_UP_FAIL,
  payload: err
})

export const signupInitiate = (email, password, name) => dispatch => {
  dispatch(signupStart())
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(({ user }) => {
      // Add name to profile
      user
        .updateProfile({
          displayName: name
        })
        .then(() => dispatch(signupSuccess(user)))
    })
    .catch(err => {
      dispatch(signupFail(err.message))
    })
}

// Set user from local storage

export const setUser = user => ({
  type: types.SET_USER,
  payload: user
})

// LOG OUT

const logoutStart = () => ({
  type: types.LOG_OUT_START
})

const logoutSuccess = () => ({
  type: types.LOG_OUT_SUCCESS
})

const logoutFail = err => ({
  type: types.LOG_OUT_FAIL,
  payload: err
})

export const logoutInitiate = () => dispatch => {
  dispatch(logoutStart())
  auth
    .signOut()
    .then(() => dispatch(logoutSuccess))
    .catch(err => dispatch(logoutFail(err)))
}

// GOOGLE SIGN IN

const googleSigninStart = () => ({
  type: types.GOOGLE_SIGN_IN_START
})

const googleSigninSuccess = user => ({
  type: types.GOOGLE_SIGN_IN_SUCCESS,
  payload: user
})

const googleSigninFail = err => ({
  type: types.GOOGLE_SIGN_IN_FAIL,
  payload: err
})

export const googleSigninInitiate = () => dispatch => {
  dispatch(googleSigninStart())
  auth
    .signInWithPopup(googleAuthProvider)
    .then(({ user }) => {
      dispatch(googleSigninSuccess(user))
    })
    .catch(err => {
      dispatch(googleSigninFail(err.message))
    })
}

// FACEBOOK SIGN IN

const facebookSigninStart = () => ({
  type: types.FACEBOOK_SIGN_IN_START
})

const facebookSigninSuccess = user => ({
  type: types.FACEBOOK_SIGN_IN_SUCCESS,
  payload: user
})

const facebookSigninFail = err => ({
  type: types.FACEBOOK_SIGN_IN_FAIL,
  payload: err
})

export const facebookSigninInitiate = () => dispatch => {
  dispatch(facebookSigninStart())
  auth
    .signInWithPopup(facebookAuthProvider)
    .then(({ user }) => {
      dispatch(facebookSigninSuccess(user))
    })
    .catch(err => {
      dispatch(facebookSigninFail(err.message))
    })
}

// RESET PASSWORD

const resetPasswordStart = () => ({
  type: types.RESET_PASSWORD_START
})

const resetPasswordSuccess = () => ({
  type: types.RESET_PASSWORD_SUCCESS
})

const resetPasswordFail = err => ({
  type: types.RESET_PASSWORD_FAIL,
  payload: err
})

export const resetPasswordInitiate = email => dispatch => {
  dispatch(resetPasswordStart())
  auth
    .sendPasswordResetEmail(email)
    .then(() => dispatch(resetPasswordSuccess()))
    .catch(err => {
      dispatch(resetPasswordFail(err.message))
    })
}

// CHANGE PASSWORD

const changePasswordStart = () => ({
  type: types.CHANGE_PASSWORD_START
})

const changePasswordSuccess = () => ({
  type: types.CHANGE_PASSWORD_SUCCESS
})

const changePasswordFail = err => ({
  type: types.CHANGE_PASSWORD_FAIL,
  payload: err
})

export const changePasswordInitiate =
  (currentUser, newPassword) => dispatch => {
    dispatch(changePasswordStart())
    currentUser
      .updatePassword(newPassword)
      .then(() => dispatch(changePasswordSuccess()))
      .catch(err => {
        dispatch(changePasswordFail(err.message))
      })
  }

export const resetError = () => ({
  type: types.RESET_ERROR
})

// UPDATE ROLE
export const updateRole = role => ({
  type: types.UPDATE_ROLE,
  payload: role
})
