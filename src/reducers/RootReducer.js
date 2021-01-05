import { combineReducers } from 'redux';

const allReducers = combineReducers({

});

const RootReducer = (state, action) => {
    return allReducers(state, action)
};

export default RootReducer