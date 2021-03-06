import React, { useState, useEffect, useRef, useCallback } from "react";
import { API, graphqlOperation } from "aws-amplify";
import withAugmentedAuthenticator from "../components/withAugmentedAuthenticator";
import TrainerListWord from "./TrainerListWord";
import "bootstrap";
import { LoadingArea } from "./LoadingArea";
import { IWordDescription } from "./IWordDescription";

var GET_UNKNOWN_WORDS_BY_TEXT = `query getUnknownWordsByText($text: String!){
  getUnknownWordsByText(text: $text) {
    words {
      word
      translations
      exclusionForms
    }
  }
}`;

var ADD_WORD_TO_VOCABULARY = `mutation AddWordToVocabluary($word: String!){
  addWordToVocabulary(word: $word) {
    code
    message
  }
}`;

const Trainer = () => {
  const [wordsFromText, setWordsFromText] = useState<IWordDescription[]>([]);
  const [processing, setProcessing] = useState(false);

  //analize text
  const textElement = useRef<HTMLTextAreaElement>(null);
  const [textForAnalyze, setTextForAnalyze] = useState<string>();
  useEffect(() => {
    if (!textForAnalyze) return;
    const getUnknownWordsByText = async () => {
      try {
        const result = await API.graphql(
          graphqlOperation(GET_UNKNOWN_WORDS_BY_TEXT, {
            text: textForAnalyze,
          })
        );
        setWordsFromText(result.data.getUnknownWordsByText.words);
        setFirstPass(true);
        setProcessing(false);
        console.log("We get new words from Analize");
      } catch (ex) {
        setProcessing(false);
        console.log(ex);
      }
    };
    getUnknownWordsByText();
    setProcessing(true);
  }, [textForAnalyze]);

  const excludeWordFromList = useCallback(
    (word) =>
      setWordsFromText((wordsFromText) =>
        wordsFromText.filter((curWrd) => curWrd !== word)
      ),
    []
  );

  // add word to vicabulary
  const [wordToVocabulary, setWordToVocabulary] = useState<IWordDescription>();
  useEffect(() => {
    if (!wordToVocabulary) return;
    const addWordToVocabluary = async () => {
      try {
        await API.graphql(
          graphqlOperation(ADD_WORD_TO_VOCABULARY, {
            word: wordToVocabulary.word,
          })
        );
        console.log("We added new word");
      } catch (ex) {
        console.log(ex);
      }
      excludeWordFromList(wordToVocabulary);
    };
    addWordToVocabluary();
  }, [wordToVocabulary, excludeWordFromList]);

  const [firstPass, setFirstPass] = useState(false);
  const [unknownWords, setUnknownWords] = useState<IWordDescription[]>([]);
  if (wordsFromText.length === 0 && unknownWords.length > 0) {
    if (firstPass) {
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
                  rows={15}
                />
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  onClick={(event) => {
                    event.preventDefault();
                    if (!textElement.current) return;
                    setTextForAnalyze(textElement.current.value);
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
                  Analize
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-12 col-md-4 scroll-block">
          {processing === false && wordsFromText && wordsFromText.length > 0 ? (
            <ul className="list-group scroll-list">
              {wordsFromText.map((wrd) => (
                <TrainerListWord
                  key={wrd.word}
                  word={wrd}
                  onKnown={() => {
                    if (firstPass) setWordToVocabulary(wrd);
                    else excludeWordFromList(wrd);
                  }}
                  onUnknown={() => {
                    excludeWordFromList(wrd);
                    setUnknownWords((words) => words.concat(wrd));
                  }}
                />
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

export default withAugmentedAuthenticator(Trainer);
