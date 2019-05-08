import { useReducer, useMemo, useEffect } from "react";

let stores = {};
let subscribers = {};
let counter = 0;

const REDUX_DEVTOOL_SET_STATE = "REDUX_DEVTOOL_SET_STATE";
const withDevTools =
  process.env.NODE_ENV === "development" &&
  typeof window !== "undefined" &&
  window.__REDUX_DEVTOOLS_EXTENSION__;

const devToolReducer = reducer => (state, action) => {
  if (action.type === REDUX_DEVTOOL_SET_STATE) {
    return action.state;
  } else {
    return reducer(state, action);
  }
};

function useReducerWithThunk(reducer, initialState, name) {
  let memoizedReducer = reducer;

  // Memoizing to prevent recreation of devtoolReducer on each render.
  if (withDevTools) {
    memoizedReducer = useMemo(() => devToolReducer(reducer), [reducer]);
  }

  const [state, dispatch] = useReducer(memoizedReducer, initialState);

  useEffect(() => {
    if (withDevTools) {
      memoizedReducer.prototype.name = getReducerName(name);

      if (stores[memoizedReducer.prototype.name]) {
        throw new Error("More than one useReducerWithThunk have same name");
      }

      stores[
        memoizedReducer.prototype.name
      ] = window.__REDUX_DEVTOOLS_EXTENSION__(reducer, initialState, {
        name: memoizedReducer.prototype.name
      });

      subscribers[memoizedReducer.prototype.name] = stores[
        memoizedReducer.prototype.name
      ].subscribe(() => {
        dispatch({
          type: REDUX_DEVTOOL_SET_STATE,
          state: stores[memoizedReducer.prototype.name].getState()
        });
      });
    }

    return () => {
      if (withDevTools) {
        subscribers[memoizedReducer.prototype.name]();
        subscribers[memoizedReducer.prototype.name] = undefined;
        stores[memoizedReducer.prototype.name] = undefined;
      }
    };
  }, []);

  const customDispatch = action => {
    if (typeof action === "function") {
      return action(customDispatch);
    } else {
      if (withDevTools && stores[memoizedReducer.prototype.name]) {
        stores[memoizedReducer.prototype.name].dispatch(action);
      } else {
        dispatch(action);
      }
    }
  };

  return [state, customDispatch];
}

const getReducerName = name => {
  if (!name) {
    const newName = document.title + "_" + counter;
    counter++;
    return newName;
  }
  return name;
};
export default useReducerWithThunk;
