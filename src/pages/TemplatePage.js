import React, { useState, useEffect, FunctionComponent } from "react";

import Amplify from "aws-amplify";
import config from "../config";
import { API, graphqlOperation } from "aws-amplify";
import $ from "jquery";

import { Router } from "@reach/router";

import { Link } from "@reach/router";
import logo from "../assets/voclogo.png";
import { propStyle } from "aws-amplify-react/dist/AmplifyUI";
import { withAuthenticator } from "aws-amplify-react";
import { useLoggedInUser } from "../hooks/useLoggedInUser";


Amplify.configure(config.amplify);

function TemplatePage(props) {
  let {user, logOut} = useLoggedInUser();

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">
            <img
              src={logo}
              width="50"
              className="d-inline-block align-center"
              alt=""
            />
            People Vocabularies
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav  mr-auto mt-2 mt-lg-0">
              <li className="nav-item active">
                <Link to="/">
                  <a className="nav-link" href="#">
                    Home <span className="sr-only">(current)</span>
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/trainer">
                  <a className="nav-link" href="#">
                    Trainer
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/uploader">
                  <a className="nav-link" href="#">
                    Uploader
                  </a>
                </Link>
              </li>
            </ul>
            {user &&
              <form className="form-inline">
              <label className="mr-2">Hello, {user.username}</label>
              <button
                className="btn btn-outline-warning"
                type="button"
                onClick={logOut}
              >
                Logout
              </button>
            </form>            
            }
            
          </div>
        </nav>
      </header>

      <section className="container">
        <div className="row">
          <div className="col-12">
            {props.children}
          </div>       
        </div>
      </section>

      <footer className="footer bg-light fixed-bottom py-4">
        <div className="container text-center">
          Copyright &copy; peoplevocabularies.com
        </div>
      </footer>
    </>
  );
}

const TemplatePageWithAuth = withAuthenticator(TemplatePage);

export { TemplatePage, TemplatePageWithAuth };


