import {ADD_TO_CART_REQUEST, ADD_FILTER_CATEGORY, ADD_FILTER_COLOR} from "./types"

export const addToCartRequest = (payload) => ({
    type: ADD_TO_CART_REQUEST,
    payload: payload
})

export const addFilteredCategory = (payload) => ({
    type: ADD_FILTER_CATEGORY,
    payload: payload
})

export const addFilteredColor = (payload) => ({
    type: ADD_FILTER_COLOR,
    payload: payload
})