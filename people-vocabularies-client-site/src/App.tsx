import logo from "./logo.svg";
import "./App.css";
import React, { useContext, useState } from "react";

let x;

const y: any = (v: any) => v;

function App() {
  const a = 5;
  const [letter, setLetter] = useState("A");
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
