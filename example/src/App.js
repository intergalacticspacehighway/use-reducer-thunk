import React from "react";
import logo from "./logo.svg";
import "./App.css";
import useReducerWithThunk from "use-reducer-thunk";

// Uncomment below line to test code from src
// import useReducerWithThunk from "../../src/index";

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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input type="number" readOnly value={count}></input>
        <button onClick={handleAsyncIncrement} disabled={loading}>
          Increment after 1 second
        </button>
        <button onClick={handleAsyncDecrement} disabled={loading}>
          {loading ? "loading..." : "Decrement after 1 second"}
        </button>
        <div>{loading && "loading..."}</div>
      </header>
    </div>
  );
}

export default App;
