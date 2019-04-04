import React from "react";
import { useReducer } from "react";

function useReducerWithThunk(reducer, initialState) {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    let customDispatch = (action) => {
        if(typeof action === 'function'){
            action(dispatch, state);
        }else{
            dispatch(action);
        }
    };
    
    return [state, customDispatch];
}
export default useReducerWithThunk;