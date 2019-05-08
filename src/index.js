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
  let memoizedValue = reducer;

  // Memoizing to prevent recreation of devtoolReducer on each render.
  if (withDevTools) {
    memoizedValue = useMemo(() => devToolReducer(reducer), [reducer]);
  }

  const [state, dispatch] = useReducer(memoizedValue, initialState);

  useEffect(() => {
    if (withDevTools) {
      if (stores[name]) {
        throw new Error("Name already exists ", name);
      }
      memoizedValue.prototype.name = name;
      if (!memoizedValue.prototype.name) {
        memoizedValue.prototype.name = document.title + "_" + counter;
        counter++;
      }

      stores[
        memoizedValue.prototype.name
      ] = window.__REDUX_DEVTOOLS_EXTENSION__(reducer, initialState, {
        name: memoizedValue.prototype.name
      });

      subscribers[memoizedValue.prototype.name] = stores[
        memoizedValue.prototype.name
      ].subscribe(() => {
        dispatch({
          type: REDUX_DEVTOOL_SET_STATE,
          state: stores[memoizedValue.prototype.name].getState()
        });
      });
    }

    return () => {
      if (withDevTools) {
        subscribers[memoizedValue.prototype.name]();
        subscribers[memoizedValue.prototype.name] = undefined;
        stores[memoizedValue.prototype.name] = undefined;
      }
    };
  }, []);

  const customDispatch = action => {
    if (typeof action === "function") {
      return action(customDispatch);
    } else {
      if (withDevTools && stores[memoizedValue.prototype.name]) {
        stores[memoizedValue.prototype.name].dispatch(action);
      } else {
        dispatch(action);
      }
    }
  };

  return [state, customDispatch];
}
export default useReducerWithThunk;
