import React, { useState, useEffect, useRef, FunctionComponent } from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";
import { Link } from "@reach/router";

import 'bootstrap';

var GetUnknownWordsByText = `query getUnknownWordsByText($text: String!){
  getUnknownWordsByText(text: $text)
}`;

var AddWordToVocabluary = `mutation AddWordToVocabluary($word: String!){
  addWordToVocabulary(word: $word) {
    code
    message
  }
}`;

const Landing = () => {

  return (
    <div>
        <section className="container mt-5">
          <div className="jumbotron jumbotron-fluid jumbotron-pic1 p-3">
              <h1 className="display-4">Check text and learn new words to read freely!</h1>
              <p className="lead">Upload text what you are going to read and learn new words with a special algorithm to prepare yourself before reading.</p>
              <hr className="my-4"/>
              <p>
              Upload text what you are going to read and analyze it against your vocabulary. Then learn new words with a special algorithm what let you pass through a list of words several times and learn words easily than ever. After that you can read your text freely without interrupting  that lead to better understanding.
              </p>
              <Link to="/trainer">
                <a className="btn btn-success btn-lg" href="" role="button">Analize text</a>
              </Link>
          </div>
        </section>
        <section className="container mt-5">
          <div className="jumbotron jumbotron-fluid jumbotron-pic2  p-3">
              <h1 className="display-4">Build up your vocabulary quickly!</h1>
              <p className="lead">Build up your vocabulary, adding texts what you have already read.</p>
              <hr className="my-4"/>
              <p>
              You can create your vocabulary quickly just adding texts what you are sure to be simple for you to read. It considerably reliefs your efforts in the first time. Although you can do it later whenever you want.
              </p>
              <Link to="/uploader">
                <a className="btn btn-success btn-lg" href="" role="button">Build up vocabulary!</a>
              </Link>
          </div>
        </section>
        <section className="container mt-5">
          <div className="jumbotron jumbotron-fluid jumbotron-pic1 p-3">
              <h1 className="display-4">Check text and learn new words to read freely!</h1>
              <p className="lead text-secondary">Upload text what you are going to read and learn new words with a special algorithm to prepare yourself before reading.</p>
              <hr className="my-4"/>
              <p>
              Upload text what you are going to read and analyze it against your vocabulary. Then learn new words with a special algorithm what let you pass through a list of words several times and learn words easily than ever. After that you can read your text freely without interrupting  that lead to better understanding.
              </p>
              <Link to="/trainer">
                <a className="btn btn-primary btn-lg" href="" role="button">Analize text</a>
              </Link>
          </div>
        </section>
    </div>

  );
};

export default Landing;
