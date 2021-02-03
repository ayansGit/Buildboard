import { combineReducers } from 'redux';
import ProductReducer from "./ProductReducer"

const allReducers = combineReducers({
    product: ProductReducer
});

const RootReducer = (state, action) => {
    return allReducers(state, action)
};

export default RootReducer