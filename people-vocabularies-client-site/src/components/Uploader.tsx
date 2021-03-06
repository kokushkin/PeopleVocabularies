import React, { useState, useEffect, useRef, useMemo } from "react";
import { API, graphqlOperation } from "aws-amplify";
import withAugmentedAuthenticator from "./withAugmentedAuthenticator";
import "bootstrap";
import { LoadingArea } from "./LoadingArea";

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
}`;

// upload text and get renewed vocabulary
const Uploader = () => {
  const uploadTextElement = useRef<HTMLTextAreaElement>(null);
  const [textForUplodaing, setTextForUplodaing] = useState("");
  const [vocabulary, setVocabulary] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  useEffect(() => {
    const uploadWellKnownText = async () => {
      try {
        if (!uploadTextElement.current) {
          return;
        }
        await API.graphql(
          graphqlOperation(UPLOAD_WELL_KNOWN_TEXT, {
            text: uploadTextElement.current.value,
          })
        );
        setProcessing(false);
        console.log("We uploaded text!!!");
      } catch (ex) {
        setProcessing(false);
        console.log(ex);
      }
    };
    const loadUserVocabulary = async () => {
      const result = await API.graphql(graphqlOperation(GET_VOCABULARY));
      setVocabulary(result.data.getVocabulary.words);
    };
    uploadWellKnownText().then(loadUserVocabulary);
    setProcessing(true);
  }, [textForUplodaing, uploadTextElement]);

  // delete unknown word from vocabulary
  const [wordToDelete, setWordToDelete] = useState<string>();
  useEffect(() => {
    if (!wordToDelete) return;
    const deleteWordFromVocabulary = async () => {
      try {
        await API.graphql(
          graphqlOperation(DELETE_WORD_FROM_VOCABULARY, {
            word: wordToDelete,
          })
        );
        setVocabulary((vocabulary) =>
          vocabulary.filter((word) => word !== wordToDelete)
        );
        console.log("Word was deleted!!!");
      } catch (ex) {
        console.log(ex);
      }
    };
    deleteWordFromVocabulary();
  }, [wordToDelete]);

  const [searchText, setSearchText] = useState("");

  const filtredVocabulary = useMemo(() => {
    if (!searchText) {
      return vocabulary;
    }
    return vocabulary.filter(
      (word) => word.toLowerCase().indexOf(searchText.toLowerCase()) === 0
    );
  }, [vocabulary, searchText]);

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
                  rows={15}
                />
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  onClick={(event) => {
                    event.preventDefault();
                    if (uploadTextElement.current) {
                      setTextForUplodaing(uploadTextElement.current.value);
                    }
                  }}
                  className="btn btn-success mb-3"
                >
                  {processing && (
                    <span
                      className="spinner-border spinner-border-sm mr-1"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-12 col-md-4 scroll-block">
          <div className="input-group mb-3">
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="form-control"
              placeholder="Type to search"
              aria-label="Type tp search"
              aria-describedby="basic-addon2"
            />
            <div className="input-group-append">
              <i className="input-group-text fa fa-search text-warning" />
            </div>
          </div>
          {processing === false &&
          filtredVocabulary &&
          filtredVocabulary.length > 0 ? (
            <ul className="list-group scroll-list">
              {filtredVocabulary &&
                filtredVocabulary.map((wrd) => (
                  <li className="list-group-item" key={wrd}>
                    <div className="container-fluid">
                      <div className="float-left mt-3">
                        <span>{wrd}</span>
                      </div>
                      <button
                        className="btn float-right"
                        onClick={() => {
                          setWordToDelete(wrd);
                        }}
                      >
                        <i className="fa fa-2x fa-times text-danger" />
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          ) : processing === true ? (
            <LoadingArea />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default withAugmentedAuthenticator(Uploader);
