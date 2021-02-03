import { ADD_TO_CART_REQUEST } from "../actions/types"

const initialState = {
    cart: [],
    operation_type: ""
};

const ProductReducer = (state = initialState, action) => {

    switch (action.type) {

        case ADD_TO_CART_REQUEST:
            console.log("REQ ", action.payload)
            return {
                ...state,
                cart: action.payload,
                operation_type: action.type,
            }

        default:
            console.log(state)
            return state;

    }
}

export default ProductReducer
