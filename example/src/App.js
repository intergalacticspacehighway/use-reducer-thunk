import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useReducerThunk } from "../../src/index";

const reducer = (state, action) => {
  return state;
};

function App() {
  const [state, dispatch] = useReducerThunk(reducer, {}, "test");
  console.log("state ", dispatch, state);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input type="number"></input>
        <button>Increment</button>
      </header>
    </div>
  );
}

export default App;
