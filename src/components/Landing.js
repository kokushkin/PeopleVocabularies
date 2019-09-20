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
          <div className="jumbotron jumbotron-trainer p-3">
              <h1 className="display-4">Check text and learn new words to read freely!</h1>
              <p className="lead">Upload text what you are going to read and learn new words with a special algorithm to prepare yourself before reading.</p>
              <hr className="my-4"/>
              <p>
              Upload text what you are going to read and analyze it against your vocabulary. Then learn new words with a special algorithm what let you pass through a list of words several times and learn words easily than ever. After that you can read your text freely without interrupting  that lead to better understanding.
              </p>
              <Link to="/trainer">
                <div class="d-flex justify-content-end">
                  <a className="btn btn-success btn-lg float-right" href="" role="button">Analize text</a>
                </div>
              </Link>
          </div>
        </section>
        <section className="container mt-5">
          <div className="jumbotron jumbotron-fluid jumbotron-uploader  p-3">
              <h1 className="display-4">Build up your vocabulary quickly!</h1>
              <p className="lead">Build up your vocabulary, adding texts what you have already read.</p>
              <hr className="my-4"/>
              <p>
              You can create your vocabulary quickly just adding texts what you are sure to be simple for you to read. It considerably reliefs your efforts in the first time. Although you can do it later whenever you want.
              </p>
              <Link to="/uploader">
                <div class="d-flex justify-content-end">
                  <a className="btn btn-success btn-lg" href="" role="button">Build up vocabulary!</a>
                </div>
              </Link>
          </div>
        </section>
        <section className="container mt-5">
          <div className="jumbotron jumbotron-fluid jumbotron-corrector-translater p-3">
              <h1 className="display-4">Translate and correct your vocabulary!</h1>
              <p className="lead text-secondary">Translate words and kick of these what you have forgotten.</p>
              <hr className="my-4"/>
              <p>
              As you're going through the process of learning something you are forgetting as well. So that's why we give you a way how to correct your vocabulary when you translate. You can use it as a regular translator and kick off words from vocabulary if you understand you don't know them.
              </p>
              <Link to="/trainer">
                <div class="d-flex justify-content-end">
                  <a className="btn btn-success btn-lg" href="" role="button">Translate and correct</a>
                </div>
              </Link>
          </div>
        </section>
    </div>

  );
};

export default Landing;