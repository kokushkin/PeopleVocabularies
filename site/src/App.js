import React from "react";
import "./App.css";
import Amplify from "aws-amplify";
import config from "./config";
import {TemplatePage} from "./pages/TemplatePage";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';



Amplify.configure(config.amplify);

function App() {
  return (
      <TemplatePage/>
  );
}

export default App;
