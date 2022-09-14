import { useReducer, useMemo, useEffect, useRef } from "react";

let stores = {};
let subscribers = {};

const REDUX_DEVTOOL_SET_STATE = "REDUX_DEVTOOL_SET_STATE";
const withDevTools = (name) => {
  return (
    name &&
    process.env.NODE_ENV === "development" &&
    typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION__
  );
};

const devToolReducer = (reducer) => (state, action) => {
  if (action.type === REDUX_DEVTOOL_SET_STATE) {
    return action.state;
  } else {
    return reducer(state, action);
  }
};

function useReducerWithThunk(reducer, initialState, name) {
  let shouldConfigDevTools = withDevTools(name);
  const nameWithUniqueNameSpace = getReducerName(name);

  // Memoizing to prevent recreation of devtoolReducer on each render.
  const memoizedReducer = useMemo(() => {
    return shouldConfigDevTools ? devToolReducer(reducer) : reducer;
  }, [reducer, shouldConfigDevTools]);

  const [state, dispatch] = useReducer(memoizedReducer, initialState);

  const stateRef = useRef(state);
  stateRef.current = state;

  const getState = () => stateRef.current;

  useEffect(() => {
    if (shouldConfigDevTools) {
      if (stores[name]) {
        throw new Error("More than one useReducerWithThunk have same name");
      }

      stores[nameWithUniqueNameSpace] = window.__REDUX_DEVTOOLS_EXTENSION__(
        reducer,
        initialState,
        {
          name: nameWithUniqueNameSpace,
        }
      );

      subscribers[nameWithUniqueNameSpace] = stores[
        nameWithUniqueNameSpace
      ].subscribe(() => {
        dispatch({
          type: REDUX_DEVTOOL_SET_STATE,
          state: stores[nameWithUniqueNameSpace].getState(),
        });
      });
    }

    return () => {
      if (shouldConfigDevTools) {
        subscribers[nameWithUniqueNameSpace]();
        subscribers[nameWithUniqueNameSpace] = undefined;
        stores[nameWithUniqueNameSpace] = undefined;
      }
    };
  }, []);

  const customDispatch = (action) => {
    if (typeof action === "function") {
      return action(customDispatch, getState);
    } else {
      if (shouldConfigDevTools && stores[nameWithUniqueNameSpace]) {
        stores[nameWithUniqueNameSpace].dispatch(action);
      } else {
        dispatch(action);
      }
    }
  };

  return [state, customDispatch];
}

const getReducerName = (name) => {
  return "userReducerThunk_" + name;
};

export default useReducerWithThunk;
