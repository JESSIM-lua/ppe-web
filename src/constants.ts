export const AUTH_URL = 'https://review.jabberwocky.addeteam.fr/api/auth/login'

// Worksites
export const GET_WORKSITES_QUERY = `query Query($worksiteStatuses: [WorksiteStatus!]!) {
  worksites(worksiteStatuses: $worksiteStatuses) {
    _id
    name
    startDate
    endDate
    worksiteStatus
  }
}`

export const UPDATE_WORKSITES_QUERY = `mutation Mutation($worksiteData: UpdateWorksiteInput!) {
  updateWorksite(worksiteData: $worksiteData) {
    _id
  }
}`
export const DELETE_WORKSITES_QUERY = `mutation Mutation($worksiteId: String!) {
  deleteWorksite(worksiteId: $worksiteId) {
    _id
  }
}`
export const CREATE_WORKSITE_QUERY = `mutation Mutation($worksiteData: CreateWorksiteInput!) {
  addWorksite(worksiteData: $worksiteData) {
    _id
  }
}`

// CART
export const GET_CART_QUERY = `
query Carts($cartStatuses: [CartStatus!]!) {
  Carts(cartStatuses: $cartStatuses) {
    _id
    cartStatus
    date
    items {
      
      articleID
      quantity
      isEmpty
      
      
    }
    worksite {
      _id
      name
    }  
    operator  
  }
}`
export const CREATE_CART_QUERY = `mutation Mutation($newCart: CreateCartInput!) {
  addCart(newCart: $newCart) {
    _id
  }
}`

export const UPDATE_CART_QUERY = `mutation Mutation($cartData: UpdateCartInput!) {
  updateCart(cartData: $cartData) {
    _id
  }
}`
export const DELETE_CART_QUERY = `mutation DeleteCart($cartId: String!) {
  deleteCart(CartID: $cartId) {
    _id
  }
}`
