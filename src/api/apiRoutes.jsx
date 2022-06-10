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
  type,
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
  type,
  itemImage,
  price,
  calories,
  featured,
  available
})

export const GET_RESTAURANT_ORDERS = 'display-order'