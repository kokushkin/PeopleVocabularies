import React, { useState, useEffect, useRef } from "react";
import { API, graphqlOperation } from "aws-amplify";
import withAugmentedAuthenticator from "../components/withAugmentedAuthenticator";


import 'bootstrap';
import { async } from "q";

const GET_VOCABULARY = `query {
  getVocabulary {
    user
    words
  }
}`;

const UPLOAD_WELL_KNOWN_TEXT = `mutation uploadWellKnownText($text: String!){
	uploadWellKnownText(text: $text) {
    code
    message
  }
}`;

const DELETE_WORD_FROM_VOCABULARY = `mutation deleteWordFromVocabulary($word: String!){
  deleteWordFromVocabulary(word: $word) {
    user
  }
}`

// upload text and get renewed vocabulary
const Uploader = () => {
  const uploadTextElement = useRef(null);
  const [textForUplodaing, setTextForUplodaing] = useState("");
  const [vocabulary, setVocabulary] = useState([]);
  useEffect(() => {
    const uploadWellKnownText = async () => {
        try {
          await API.graphql(
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
        const result = await API.graphql(graphqlOperation(GET_VOCABULARY));
        setVocabulary(result.data.getVocabulary.words);      
    };
    uploadWellKnownText().then(loadUserVocabulary);
  }, [textForUplodaing, uploadTextElement]);

  // delete unknown word from vocabulary
  const [wordToDelete, setWordToDelete] = useState();
  useEffect(() => {
    if(!wordToDelete)
      return;
    const deleteWordFromVocabulary = async () => {
      try {
        await API.graphql(graphqlOperation(DELETE_WORD_FROM_VOCABULARY, {
          word: wordToDelete
        }));
        setVocabulary(vocabulary => vocabulary.filter(word => word !== wordToDelete));
        console.log("Word was deleted!!!");
      } catch (ex) {
        console.log(ex);
      }
    };
    deleteWordFromVocabulary();
  }, [wordToDelete]);

  return (
    <section className="container">
      <div className="row">
        <div className="col-12 col-md-8">
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
        <div className="col-12 col-md-4">
          <ul className="list-group scroll-list">
            {vocabulary &&
              vocabulary.map(wrd => (
                <li className="list-group-item" key={wrd}>
                  <div className="container-fluid">
                    <div className="float-left mt-3">
                      <span>{wrd}</span>
                    </div>
                    <button className="btn float-right" onClick={() => {
                      setWordToDelete(wrd);
                    }}>
                      <i className="fa fa-2x fa-times text-danger" />
                    </button>
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
