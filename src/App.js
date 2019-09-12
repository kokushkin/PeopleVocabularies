import React, { useState, useEffect, FunctionComponent } from "react";
import "./App.css";

import Amplify from "aws-amplify";
import config from "./config";
import { Auth, API, graphqlOperation } from "aws-amplify";
import $ from "jquery";

import { Router } from "@reach/router";

import Trainer from "./components/Trainer";
import Uploader from "./components/Uploader";
import Landing from "./components/Landing";
import { Link } from "@reach/router";
import logo from "./assets/voclogo.png";

import  { LandingPage, TrainerPage,  UploaderPage} from "./pages/Pages";


Amplify.configure(config.amplify);

function App() {
  return (
      <Router>
            <LandingPage path="/"/>
            <TrainerPage  path="/trainer"/>
            <UploaderPage  path="/uploader"/>
      </Router>
  );
}

export default App;
