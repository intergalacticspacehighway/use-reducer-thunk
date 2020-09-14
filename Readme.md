## useReducer with thunk and redux devtools

### To get it working:

#### Async counter example

- The below example will set a redux devtool instance with name useReducerThunk_example.

```
import React from "react";
import useReducerWithThunk from "use-reducer-thunk";

function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + 1,
      };
    case "DECREMENT":
      return {
        ...state,
        count: state.count - 1,
      };
    case "SUCCESS":
      return {
        ...state,
        loading: false,
      };
    case "LOADING":
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducerWithThunk(
    reducer,
    { count: 0, loading: false },
    "example"
  );

  const { count, loading } = state;

  function handleIncrement() {
    dispatch({ type: "INCREMENT" });
  }

  function handleDecrement() {
    dispatch({ type: "DECREMENT" });
  }

  function asyncIncrementAction() {
    return (dispatch, getState) => {
      dispatch({ type: "LOADING" });
      console.log("prev state ", getState());

      setTimeout(() => {
        handleIncrement();
        dispatch({ type: "SUCCESS" });
      }, 1000);
    };
  }

  function asyncDecrementAction() {
    return (dispatch, getState) => {
      dispatch({ type: "LOADING" });
      console.log("prev state ", getState());

      setTimeout(() => {
        handleDecrement();
        dispatch({ type: "SUCCESS" });
      }, 1000);
    };
  }

  function handleAsyncIncrement() {
    dispatch(asyncIncrementAction());
  }

  function handleAsyncDecrement() {
    dispatch(asyncDecrementAction());
  }

  return (
    <div className="App">
        <input type="number" readOnly value={count}></input>
        <button onClick={handleAsyncIncrement} disabled={loading}>
          Increment after 1 second
        </button>
        <button onClick={handleAsyncDecrement} disabled={loading}>
          {loading ? "loading..." : "Decrement after 1 second"}
        </button>
        <div>{loading && "loading..."}</div>
    </div>
  );
}

export default App;

```
