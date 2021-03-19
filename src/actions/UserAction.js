import {ADD_STATE_REQUEST} from "./types"

export const addStateRequest = (payload) => ({
    type: ADD_STATE_REQUEST,
    payload: payload
})