import { ADD_TO_CART_REQUEST, ADD_FILTER_COLOR, ADD_FILTER_CATEGORY } from "../actions/types"

const initialState = {
    cart: [],
    filter: null,
    filterCategory: [],
    filterColor: [],
    id: -1,
    operation_type: ""
};

const ProductReducer = (state = initialState, action) => {

    switch (action.type) {

        case ADD_TO_CART_REQUEST:
            console.log("REQ ", action.payload)
            let quantity = 0
            action.payload.map((value, index) => {
                quantity += value.quantity
            })
            return {
                ...state,
                cart: action.payload,
                quantity: quantity,
                operation_type: action.type,
            }

        case ADD_FILTER_CATEGORY:

        console.log("GG", action.payload)

            return {
                ...state,
                id: action.payload.id,
                filterCategory: action.payload.categoryList,
                operation_type: action.type
            }

        case ADD_FILTER_COLOR:

            return {
                ...state,
                filterColor: action.payload,
                operation_type: action.type
            }

        default:
            console.log(state)
            return state;

    }
}

export default ProductReducer
