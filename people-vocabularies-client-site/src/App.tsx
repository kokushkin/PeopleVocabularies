import React from "react";
import "./App.css";
import config from "./config";
// import {TemplatePage} from "./pages/TemplatePage";
import "bootstrap/dist/css/bootstrap.min.css";
import Amplify from "aws-amplify";

Amplify.configure(config.amplify);

function App() {
  return (
    <div></div>
    // <TemplatePage/>
  );
}

export default App;
