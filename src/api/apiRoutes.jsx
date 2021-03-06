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
  featured
) => ({
  itemName,
  type: convertCategoryToInt(type),
  itemImage,
  price,
  calories,
  featured
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

// DELETE ITEM
export const DELETE_ITEM = 'delete-item'
export const getIdParams = id => ({
  params: { id }
})

export const GET_RESTAURANT_ORDERS = 'display-order'
export const getRestaurantOrdersParams = id => ({
  params: { id }
})

// GET ALL USERS
export const GET_ALL_USERS = 'get-all-users'

// CHANGE ROLE
export const CHANGE_ROLE = 'change-role'
export const getChangeRoleConfig = (token, id, roleID) => ({
  headers: {
    Authorization: 'Bearer ' + token
  },
  params: {
    id: id
  },
  data: {
    roleID: roleID
  }
})
export const getChangeRoleBody = (id, roleID) => ({
  id,
  roleID
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

export const CANCEL_ORDER = 'cancel-order'
export const getCancelOrderBody = note => ({
  note
})

export const CONFIRM_ORDER_DELIVERED = 'confirm-delivered'

export const DISPLAY_ORDER_ITEM = 'display-order-items'

export const GET_ALL_EXISTED_ORDERS = 'get-all-existed-orders'

// GET ALL PROMOTION
export const GET_ALL_PROMOTION = 'get-promotion'
export const getPromotionConfig = (token, id) => ({
  headers: {
    Authorization: 'Bearer ' + token
  },
  params: {
    id: id
  }
})

// ADD PROMOTION
export const ADD_PROMOTION = 'add-promotion'
export const getAddPromotionBody = (
  promotionName,
  begin,
  end,
  value,
  banner
) => ({
  promotionName,
  begin,
  end,
  value,
  banner
})
//DELETE PROMOTION
export const DELETE_PROMOTION = 'delete-promotion'
export const getDeletePromotionBody = id => ({
  id
})

// UPDATE PROMOTION
export const UPDATE_PROMOTION = 'update-promotion'
export const getUpdatePromotionBody = (
  id,
  name,
  begin,
  end,
  banner,
  value
) => ({
  id,
  name,
  begin,
  end,
  banner,
  value
})

// GET STAFFS LIST
export const GET_STAFFS_LIST = 'get-staff'
export const getStaffListConfig = (token, id) => ({
  headers: {
    Authorization: 'Bearer ' + token
  },
  params: {
    id: id
  }
})

// UPDATE STAFF STATUS
export const UPDATE_STAFF_STATUS = 'update-staff-status'
export const getStaffStatusBody = staffStatus => ({
  staffStatus
})
export const getUpdateStatusHeader = (token, id) => ({
  headers: {
    Authorization: 'Bearer ' + token
  },
  params: {
    id
  }
})

// ADD STAFF
export const ADD_STAFF = 'add-new-staff'
export const getAddStaffBody = (email, restaurantID) => ({
  email,
  restaurantID
})

// GET RESTAURANT
export const GET_RESTAURANT = 'get-all-restaurants'
export const getRestaurantParams = id => ({
  params: {
    id: id
  }
})

// STATISTICS
export const GET_TODAY_REPORT = 'get-today-reports'
export const GET_DAILY_REPORT = 'get-all-daily-reports'
export const getDailyReportBody = (year, month) => ({
  params: {
    year,
    month
  }
})
export const GET_MONTHLY_REPORT = 'get-all-monthly-reports'
export const getMonthlyBody = year => ({
  params: {
    year
  }
})
