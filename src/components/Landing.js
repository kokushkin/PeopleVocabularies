import React, { useState, useEffect, useRef, FunctionComponent } from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

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
  const [newWords, setNewWords] = useState(undefined);
  const [analize, setAnalize] = useState(undefined);
  const [addingWord, setAddingWord] = useState(undefined);
  const textForAnalis = useRef(null);

  useEffect(() => {
    const getUnknownWordsByText = async () => {
      if (analize === true) {
        try {
          let result = await API.graphql(
            graphqlOperation(GetUnknownWordsByText, {
              text: textForAnalis.current.value
            })
          );
          setNewWords(result.data.getUnknownWordsByText);
          console.log("We get new words from Analize");
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    getUnknownWordsByText();
    return () => {
      setAnalize(false);
    };
  }, [analize]);

  useEffect(() => {
    const addWordToVocabluary = async () => {
      if (addingWord !== undefined) {
        try {
          let result = await API.graphql(
            graphqlOperation(AddWordToVocabluary, {
              word: addingWord
            })
          );
          console.log("We added new word");
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    addWordToVocabluary();
    return () => {
      setAddingWord(undefined);
    };
  }, [addingWord]);

  return (
    <section className="container">
      <div className="row">
        <div className="col-md-8 col-sm-12">
          <div className="container">
            <h3 className="display-4">Check text and learn new words!!</h3>
            <form>
              <div className="form-group">
                <textarea
                  ref={textForAnalis}
                  className="form-control"
                  id="text"
                  rows="15"
                />
              </div>
              <button
                type="submit"
                onClick={event => {
                  event.preventDefault();
                  setAnalize(true);
                }}
                className="btn btn-success mb-3"
              >
                Analise ...
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-4 col-sm-12">
          <ul className="list-group">
            {newWords &&
              newWords.map(wrd => (
                <li className="list-group-item" key={wrd}>
                  <div className="container-fluid">
                    <div className="float-left mt-3">
                      <span>{wrd}</span>
                    </div>
                    <button
                      className="btn  float-right"
                      onClick={() => {
                        setAddingWord(wrd);
                        setNewWords(newWords.filter(curWrd => curWrd !== wrd));
                      }}
                    >
                      <i className="fa fa-2x fa-glass text-success" />
                    </button>
                    <button
                      className="btn  float-right"
                      onClick={() =>
                        setNewWords(newWords.filter(curWrd => curWrd !== wrd))
                      }
                    >
                      <i className="fa fa-2x fa-check text-warning" />
                    </button>
                  </div>
                </li>
                // <li
                //   className="list-group-item"
                //   key={event.id}
                //   data-toggle="modal"
                //   data-target="#myModal"
                //   onClick={() => setCurrentDescriptionId(event.id)}
                // >
                //   {event.title} - {friendlyDateTime(event.dateStart)}
                // </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Landing;
