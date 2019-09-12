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
            <h3 className="display-4">This is landing page!!</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
