import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import withAugmentedAuthenticator from "../components/withAugmentedAuthenticator";
import "bootstrap";
import { LoadingArea } from "./LoadingArea";

const TRANSLATE_WORD = `query translateWord($context: String, $word: String!){
    translateWord(context: $context, word: $word) {
        contextTranslation
        wordDescription {
            word
            exclusionForms
            translations
        }
        inVocabulary
    }
  }`;

const DELETE_WORD_FROM_VOCABULARY = `mutation deleteWordFromVocabulary($word: String!){
    deleteWordFromVocabulary(word: $word) {
        user
    }
  }`;

const Translator = () => {
  const [context, setContext] = useState();
  const [word, setWord] = useState();

  const [contextTranslation, setContextTranslation] = useState();
  const [vocabularyWord, setVocabularyWord] = useState();
  const [exclusionForms, setExclusionForms] = useState<string[]>([]);
  const [translations, setTranslations] = useState<string[]>([]);
  const [inVocabulary, setInVocabulary] = useState(false);
  const [noTranslation, setNoTranslation] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!word) return;
    const translateWord = async () => {
      try {
        const result = await API.graphql(
          graphqlOperation(TRANSLATE_WORD, {
            context,
            word,
          })
        );
        setContextTranslation(result.data.translateWord.contextTranslation);
        if (result.data.translateWord.wordDescription) {
          setVocabularyWord(result.data.translateWord.wordDescription.word);
          setExclusionForms(
            result.data.translateWord.wordDescription.exclusionForms
          );
          setTranslations(
            result.data.translateWord.wordDescription.translations
          );
        } else {
          setNoTranslation(true);
        }
        setInVocabulary(result.data.translateWord.inVocabulary);
        setProcessing(false);
      } catch (ex) {
        setProcessing(false);
        console.log(ex);
      }
    };
    translateWord();
    setProcessing(true);
  }, [context, word]);

  // delete unknown word from vocabulary
  const [wordToDelete, setWordToDelete] = useState();
  useEffect(() => {
    if (!wordToDelete) return;
    const deleteWordFromVocabulary = async () => {
      try {
        await API.graphql(
          graphqlOperation(DELETE_WORD_FROM_VOCABULARY, {
            word: wordToDelete,
          })
        );
        setInVocabulary(false);
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
        <h3 className="display-4">Translate here!</h3>
      </div>
      <div className="row">
        <div className="col-12">
          <form
            // we got some ptoblems with e.target.context, e.target.word thats why it's "any"
            onSubmit={(e: any) => {
              e.preventDefault();

              setContext(e.target.context.value);
              setWord(e.target.word.value);
              setContextTranslation(undefined);
              setVocabularyWord(undefined);
              setExclusionForms([]);
              setTranslations([]);
              setInVocabulary(false);
              setNoTranslation(false);
            }}
          >
            <div className="form-group">
              <label htmlFor="context">Context (optional but useful)</label>
              <textarea
                className="form-control"
                id="context"
                rows={6}
                placeholder="I saw them last Monday."
              />
            </div>
            <div className="form-group">
              <label htmlFor="word">Word</label>
              <input
                type="text"
                className="form-control"
                id="word"
                placeholder="saw"
              />
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-success">
                {processing && (
                  <span
                    className="spinner-border spinner-border-sm mr-1"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                Translate
              </button>
            </div>

            {processing === false ? (
              <>
                {vocabularyWord ? (
                  <div className="form-group">
                    <label>In vocabulary this word would match to</label>
                    <div className="card">
                      <h3 className="card-header">{vocabularyWord}</h3>
                      <div className="card-body">
                        {exclusionForms && (
                          <h4 className="card-title">
                            {exclusionForms.join(", ")}
                          </h4>
                        )}
                        {translations && (
                          <p className="card-text">{translations.join(", ")}</p>
                        )}
                      </div>
                      {inVocabulary && (
                        <div className="container-fluid card-footer">
                          <div className="float-left mt-3">
                            <span className="text-danger">
                              This word is in your vocabulary, means you should
                              know it. Wanna delete?
                            </span>
                          </div>
                          <button
                            className="btn float-right"
                            onClick={() => setWordToDelete(vocabularyWord)}
                          >
                            <i className="fa fa-2x fa-times text-danger" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  noTranslation && (
                    <div className="form-group">
                      <label>
                        <span className="text-danger">
                          Sorry, we could not find any translation for this word
                          for the given context.
                        </span>
                      </label>
                    </div>
                  )
                )}

                <div className="form-group">
                  <label htmlFor="contextTranslation">
                    Context translation
                  </label>
                  <textarea
                    readOnly={true}
                    className="form-control bg-white"
                    id="contextTranslation"
                    rows={6}
                    value={contextTranslation}
                    defaultValue="Я видел их в прошлый понедельник."
                  />
                </div>
              </>
            ) : processing === true ? (
              <LoadingArea />
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
};

export default withAugmentedAuthenticator(Translator);
