import React from "react";

import config from "./config";
// import {TemplatePage} from "./pages/TemplatePage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Amplify from "aws-amplify";
import { TemplatePage } from "./pages/TemplatePage";

Amplify.configure(config.amplify);

function App() {
  return <TemplatePage />;
}

export default App;
