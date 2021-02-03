import {ADD_TO_CART_REQUEST} from "./types"

export const addToCartRequest = (payload) => ({
    type: ADD_TO_CART_REQUEST,
    payload: payload
})