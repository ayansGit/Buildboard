import { ADD_STATE_REQUEST } from "../actions/types"

const initialState = {
    stateList: [],
    operation_type: ""
};

const UserReducer = (state = initialState, action) => {

    switch (action.type) {

        case ADD_STATE_REQUEST:
            console.log("REQ ", action.payload)
            return {
                ...state,
                stateList: action.payload,
                operation_type: action.type,
            }

        default:
            console.log(state)
            return state;

    }
}

export default UserReducer
