import React, { useState, useEffect, useRef, FunctionComponent } from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import withAugmentedAuthenticator from "../components/withAugmentedAuthenticator";

import 'bootstrap';

var GET_UNKNOWN_WORDS_BY_TEXT = `query getUnknownWordsByText($text: String!){
  getUnknownWordsByText(text: $text)
}`;

var ADD_WORD_TO_VOCABULARY = `mutation AddWordToVocabluary($word: String!){
  addWordToVocabulary(word: $word) {
    code
    message
  }
}`;

const Trainer = () => {
  const [wordsFromText, setWordsFromText] = useState([]);
  
  //analize text
  const textElement = useRef(null);
  const [textForAnalyze, setTextForAnalyze] = useState("");
  useEffect(() => {
    const getUnknownWordsByText = async () => {
        try {
          let result = await API.graphql(
            graphqlOperation(GET_UNKNOWN_WORDS_BY_TEXT, {
              text: textForAnalyze
            })
          );
          setWordsFromText(result.data.getUnknownWordsByText);
          setFirstPass(true);
          console.log("We get new words from Analize");
        } catch (ex) {
          console.log(ex);
        }
    };
    getUnknownWordsByText();
  }, [textForAnalyze]);


  // add word to vicabulary
  const [wordToVocabulary, setWordToVocabulary] = useState(undefined);
  useEffect(() => {
    const addWordToVocabluary = async () => {
        try {
          let result = await API.graphql(
            graphqlOperation(ADD_WORD_TO_VOCABULARY, {
              word: wordToVocabulary
            })
          );
          console.log("We added new word");
        } catch (ex) {
          console.log(ex);
        }
        setWordsFromText(wordsFromText.filter(curWrd => curWrd !== wordToVocabulary));
    };
    addWordToVocabluary();
  }, [wordToVocabulary]);

  const [firstPass, setFirstPass] = useState(false);
  const [unknownWords, setUnknownWords] = useState([]);
  if(wordsFromText.length == 0 && unknownWords.length > 0) {
    if(firstPass) {
      setFirstPass(false);
    }
    setWordsFromText(unknownWords);
    setUnknownWords([]);      
  }
  

  return (
    <section className="container">
      <div className="row">
        <div className="col-12 col-md-8">
          <div className="container">
            <h3 className="display-4">Check text and learn new words!!</h3>
            <form>
              <div className="form-group">
                <textarea
                  ref={textElement}
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
                    setTextForAnalyze(textElement.current.value);
                  }}
                  className="btn btn-success mb-3"
                >
                  Analise
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <ul className="list-group scroll-list">
            {wordsFromText &&
              wordsFromText.map(wrd => (
                <li className="list-group-item" key={wrd}>
                  <div className="container-fluid">
                    <div className="float-left mt-3">
                      <span>{wrd}</span>
                    </div>
                    {/* KNOWN word button */}
                    <button
                      className="btn  float-right"
                      onClick={() => {
                        if(firstPass)
                          setWordToVocabulary(wrd);
                        else
                          setWordsFromText(wordsFromText.filter(curWrd => curWrd !== wrd))                      
                      }}
                    >
                      <i className="fa fa-2x fa-glass text-success" />
                    </button>
                    {/* UNKNOWN word button */}
                    <button
                      className="btn  float-right"
                      onClick={() => {
                          setWordsFromText(wordsFromText.filter(curWrd => curWrd !== wrd));
                          unknownWords.push(wrd);
                          setUnknownWords(unknownWords);
                        }}>
                      <i className="fa fa-2x fa-check text-warning" />
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

export default withAugmentedAuthenticator(Trainer);
