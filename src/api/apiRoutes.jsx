// GET ITEM
export const GET_ITEM = 'get-item'
export const getItemParams = id => ({
  params: {
    id: id
  }
})

// GET PROFILE
export const GET_PROFILE = 'get-user'
export const getProfileId = id => ({
  params: {
    id: id
  }
})

// ACCESS TOKEN
export const getAccessTokenHeader = token => ({
  headers: {
    Authorization: 'Bearer ' + token
  }
})

const convertCategoryToInt = category => {
  switch (category) {
    case 'Combos':
      return 0
    case 'Hamburger':
      return 1
    case 'Chicken':
      return 2
    case 'Rice':
      return 3
    case 'Sides':
      return 4
    case 'Desserts':
      return 5
    case 'Drinks':
      return 6
    default:
      return -1
  }
}

// ADD ITEM
export const ADD_ITEM = 'add-item'
export const getAddItemBody = (
  itemName,
  type,
  itemImage,
  price,
  calories,
  featured,
  available
) => ({
  itemName,
  type: convertCategoryToInt(type),
  itemImage,
  price,
  calories,
  featured,
  available
})

// UPDATE ITEM
export const UPDATE_ITEM = 'update-item'
export const getUpdateItemBody = (
  id,
  itemName,
  type,
  itemImage,
  price,
  calories,
  featured,
  available
) => ({
  id,
  itemName,
  type: convertCategoryToInt(type),
  itemImage,
  price,
  calories,
  featured,
  available
})

export const GET_RESTAURANT_ORDERS = 'display-order'
export const getRestaurantOrdersParams = id => ({
  params: { id }
})

// GET ALL USERS
export const GET_ALL_USERS = 'get-all-users'

// CHANGE ROLE
export const CHANGE_ROLE = 'change-role'
export const getChangeRoleBody = (roleID,id) => ({
  roleID: roleID,
  id: id
})

export const SIGN_UP = 'create-new-user'
export const getSignupBody = (email, name) => ({
  email: email,
  name: name
})

export const CONFIRM_ORDER = 'confirm-order'
export const getConfirmOrderParams = id => ({
  params: {
    id
  }
})
