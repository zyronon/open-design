import * as React from "react";
import {Routes, Route, Link} from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import {Button} from "antd";

function App() {
  return (
    <div className="App">
      <h1>App</h1>
      <Button type="primary">Button</Button>
      <p>
        <Link to="/home">Home</Link>
      </p>
      <p>
        <Link to="/about">About</Link>
      </p>
    </div>
  );
}

export default App
