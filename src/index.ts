// eslint-disable-file @typescript-eslint/ban-ts-comment

import { useReducer, useMemo, useEffect, useRef, Reducer } from "react";

type NotFunction<A> = Exclude<A, Function>;
type ThunkAction<S, A> = (
  dispatch: DispatchFunc<S, A>,
  getState: () => S
) => void;
type VariantAction<S, A> = NotFunction<A> | ThunkAction<S, A>;
type DispatchFunc<S, A> = (action: VariantAction<S, A>) => void;

let stores: Record<string, unknown> = {};
let subscribers: Record<string, unknown> = {};

const REDUX_DEVTOOL_SET_STATE = "REDUX_DEVTOOL_SET_STATE";
const withDevTools = (name: string) => {
  return (
    name &&
    process.env.NODE_ENV === "development" &&
    typeof window !== "undefined" &&
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__
  );
};

const devToolReducer =
  <S, A>(reducer: Reducer<S, A>) =>
  (state: S, action: A) => {
    // @ts-ignore
    if (action.type === REDUX_DEVTOOL_SET_STATE) {
      // @ts-ignore
      return action.state;
    } else {
      return reducer(state, action);
    }
  };

function useReducerWithThunk<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  name = ""
): [S, DispatchFunc<S, A>] {
  let shouldConfigDevTools = withDevTools(name);
  const nameWithUniqueNameSpace = getReducerName(name);

  // Memoizing to prevent recreation of devtoolReducer on each render.
  const memoizedReducer = useMemo(
    () => (shouldConfigDevTools ? devToolReducer(reducer) : reducer),
    [reducer, shouldConfigDevTools]
  );

  const [state, dispatch] = useReducer(memoizedReducer, initialState);

  const stateRef = useRef(state);
  stateRef.current = state;

  const getState = () => stateRef.current;

  useEffect(() => {
    if (shouldConfigDevTools) {
      if (stores[name]) {
        throw new Error("More than one useReducerWithThunk have same name");
      }

      // @ts-ignore
      stores[nameWithUniqueNameSpace] = window.__REDUX_DEVTOOLS_EXTENSION__(
        reducer,
        initialState,
        {
          name: nameWithUniqueNameSpace,
        }
      );

      // @ts-ignore
      subscribers[nameWithUniqueNameSpace] = stores[
        nameWithUniqueNameSpace
      ].subscribe(() => {
        // @ts-ignore
        dispatch({
          type: REDUX_DEVTOOL_SET_STATE,
          // @ts-ignore
          state: stores[nameWithUniqueNameSpace].getState(),
        });
      });
    }

    return () => {
      if (shouldConfigDevTools) {
        // @ts-ignore
        subscribers[nameWithUniqueNameSpace]();
        subscribers[nameWithUniqueNameSpace] = undefined;
        stores[nameWithUniqueNameSpace] = undefined;
      }
    };
  }, []);

  const customDispatch: DispatchFunc<S, A> = (action) => {
    if (typeof action === "function") {
      // @ts-ignore
      action(customDispatch, getState);
    } else {
      if (shouldConfigDevTools && stores[nameWithUniqueNameSpace]) {
        // @ts-ignore
        stores[nameWithUniqueNameSpace].dispatch(action);
      } else {
        dispatch(action);
      }
    }
  };

  return [state, customDispatch];
}

const getReducerName = (name: string) => {
  return "userReducerThunk_" + name;
};

export default useReducerWithThunk;
