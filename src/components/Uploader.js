import React, { useState, useEffect, useRef, FunctionComponent } from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";
import withAugmentedAuthenticator from "../components/withAugmentedAuthenticator";

import 'bootstrap';

var GET_VOCABULARY = `query {
  getVocabulary {
    user
    words
  }
}`;

var UPLOAD_WELL_KNOWN_TEXT = `mutation uploadWellKnownText($text: String!){
	uploadWellKnownText(text: $text) {
    code
    message
  }
}`;

// upload text and get renewed vocabulary
const Uploader = () => {
  const uploadTextElement = useRef(null);
  const [textForUplodaing, setTextForUplodaing] = useState("");
  const [vocabulary, setVocabulary] = useState(undefined);
  useEffect(() => {
    const uploadWellKnownText = async () => {
        try {
          let result = await API.graphql(
            graphqlOperation(UPLOAD_WELL_KNOWN_TEXT, {
              text: uploadTextElement.current.value
            })
          );
          console.log("We uploaded text!!!");
        } catch (ex) {
          console.log(ex);
        }      
    };
    const loadUserVocabulary = async () => {
        let result = await API.graphql(graphqlOperation(GET_VOCABULARY));
        setVocabulary(result.data.getVocabulary);      
    };
    uploadWellKnownText().then(loadUserVocabulary);
  }, [textForUplodaing, uploadTextElement]);

  return (
    <section className="container">
      <div className="row">
        <div className="col-md-8 col-sm-12">
          <div className="container">
            <h3 className="display-4">Build up your vocabulary quickly!</h3>
            <form>
              <div className="form-group">
                <textarea
                  ref={uploadTextElement}
                  className="form-control"
                  id="text"
                  rows="15"
                />
              </div>
              <div class="d-flex justify-content-end">
                <button
                  type="submit"
                  onClick={event => {
                    event.preventDefault();
                    setTextForUplodaing(uploadTextElement.current.value)
                  }}
                  className="btn btn-success mb-3"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="overflow-auto col-md-4 col-sm-12">
          <ul className="list-group">
            {vocabulary &&
              vocabulary.words &&
              vocabulary.words.map(wrd => (
                <li className="list-group-item" key={wrd}>
                  <div className="container-fluid">
                    <div className="float-left mt-3">
                      <span>{wrd}</span>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default withAugmentedAuthenticator(Uploader);
