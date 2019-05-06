import React from "react";
import { useReducer, useMemo, useEffect } from "react";

let stores = {};
let subscribers = {};

const withDevTools = (
    process.env.NODE_ENV === "development" && typeof window !==  'undefined' 
    && window.__REDUX_DEVTOOLS_EXTENSION__
);


const devToolReducer = reducer => (state, action) => {
    if(action && action.type === "DISPATCH") {
        if(action.payload.type === "JUMP_TO_STATE" || action.payload.type==="JUMP_TO_ACTION"){
            return action.state;
        }
    } 
     else {
        return reducer(state, action);
    }
}


function useReducerWithThunk(reducer, initialState, name) {
    let memoizedValue = reducer;
    if(withDevTools) {
        memoizedValue = useMemo(() => devToolReducer(reducer), [reducer]);
    }   
    const [state, dispatch] = useReducer(memoizedValue, initialState);

    useEffect(()=>{
        if(withDevTools){
            stores[name] = window.__REDUX_DEVTOOLS_EXTENSION__.connect({name});
            stores[name].init({ value: initialState });
    
            subscribers[name] = stores[name].subscribe((message) => {
                dispatch(message);
            });
        }
        return () => {
            if(withDevTools){
                subscribers[name]();
            }
        }
    },[])

    const customDispatch = (action) => {
        if(typeof action === 'function'){
            return action(customDispatch);
        }else{
            dispatch(action);
            if(window && window.__REDUX_DEVTOOLS_EXTENSION__ && withDevTools) {
                stores[name].send(action, reducer(state, action));
            }
        }
    };
    
    return [state, customDispatch];
}
export default useReducerWithThunk;