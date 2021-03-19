import { combineReducers } from 'redux';
import ProductReducer from "./ProductReducer"
import UserReducer from "./UserReducer"

const allReducers = combineReducers({
    user: UserReducer,
    product: ProductReducer,
});

const RootReducer = (state, action) => {
    return allReducers(state, action)
};

export default RootReducer