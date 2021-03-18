import { ADD_TO_CART_REQUEST } from "../actions/types"

const initialState = {
    cart: [],
    operation_type: ""
};

const ProductReducer = (state = initialState, action) => {

    switch (action.type) {

        case ADD_TO_CART_REQUEST:
            console.log("REQ ", action.payload)
            let quantity = 0
            action.payload.map((value, index) =>{
                quantity+=value.quantity
            })
            return {
                ...state,
                cart: action.payload,
                quantity: quantity,
                operation_type: action.type,
            }

        default:
            console.log(state)
            return state;

    }
}

export default ProductReducer
