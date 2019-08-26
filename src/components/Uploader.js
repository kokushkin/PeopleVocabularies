import React, { useState, useEffect, useRef, FunctionComponent } from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

var GetVocabularyQuery = `query {
  getVocabulary {
    user
    words
  }
}`;

var UploadWellKnownText = `mutation uploadWellKnownText($text: String!){
	uploadWellKnownText(text: $text) {
    code
    message
  }
}`;

const Uploader = () => {
  const [vocabulary, setVocabulary] = useState(undefined);
  const [upload, setUpload] = useState(undefined);
  const textForUploading = useRef(null);

  //load user Vocabulary
  useEffect(() => {
    const loadUserVocabulary = async () => {
      if (upload === undefined || upload === false) {
        let result = await API.graphql(graphqlOperation(GetVocabularyQuery));
        setVocabulary(result.data.getVocabulary);
      }
    };
    loadUserVocabulary();
  }, [upload]);

  useEffect(() => {
    const uploadWellKnownText = async () => {
      if (upload === true) {
        try {
          let result = await API.graphql(
            graphqlOperation(UploadWellKnownText, {
              text: textForUploading.current.value
            })
          );
          console.log("We uploaded text!!!");
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    uploadWellKnownText().then(() => setUpload(false));
  }, [upload]);

  return (
    <section className="container">
      <div className="row">
        <div className="col-md-8 col-sm-12">
          <div className="container">
            <h3 className="display-4">Build up your vocabulary quickly!</h3>
            <form>
              <div className="form-group">
                <textarea
                  ref={textForUploading}
                  className="form-control"
                  id="text"
                  rows="15"
                />
              </div>
              <button
                type="submit"
                onClick={event => {
                  event.preventDefault();
                  setUpload(true);
                }}
                className="btn btn-success mb-3"
              >
                Upload ...
              </button>
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

export default Uploader;
