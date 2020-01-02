import React, { useState, useEffect} from "react";
import { API, graphqlOperation } from "aws-amplify";
import withAugmentedAuthenticator from "../components/withAugmentedAuthenticator";
import 'bootstrap';


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
  }`

const Translator = () => {
  const [context, setContext] = useState();
  const [word, setWord] = useState();

  const [contextTranslation, setContextTranslation] = useState();
  const [vocabularyWord, setVocabularyWord] = useState();
  const [exclusionForms, setExclusionForms] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [inVocabulary, setInVocabulary] = useState(false);


  useEffect(() => {
    if(!word)
        return;
    const translateWord = async () => {
        try {
          const result = await API.graphql(
            graphqlOperation(TRANSLATE_WORD, {
              context,
              word
            })
          );
          setContextTranslation(result.data.translateWord.contextTranslation);
          setVocabularyWord(result.data.translateWord.wordDescription.word);
          setExclusionForms(result.data.translateWord.wordDescription.exclusionForms);
          setTranslations(result.data.translateWord.wordDescription.translations);
          setInVocabulary(result.data.translateWord.inVocabulary);
        } catch (ex) {
          console.log(ex);
        }
    };
    translateWord();
  }, [context, word]);

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
                <form onSubmit={e => {
                    e.preventDefault();
                    setContext(e.target.context.value);
                    setWord(e.target.word.value);}}>

                    <div className="form-group">
                        <label htmlFor="context">Context</label>
                        <textarea className="form-control" id="context" rows="2" defaultValue="I saw this guy." />
                    </div>
                    <div className="form-group">
                        <label htmlFor="word">Word</label>
                        <input type="text" className="form-control" id="word" defaultValue="saw"/>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-success">Translate</button>
                    </div>
                    <div className="form-group">
                        <label htmlFor="contextTranslation">Context translation</label>
                        <textarea readOnly={true} className="form-control bg-white" 
                            id="contextTranslation" rows="2" value={contextTranslation} 
                            defaultValue="Я видел этого парня" />
                    </div>
                    {vocabularyWord && 
                        <div className="form-group">
                            <label>In vocabulary this word would match to</label>
                            <div className="card big-bottom-margin">
                                    <h3 className="card-header">{vocabularyWord}</h3>
                                    <div className="card-body">
                                        {exclusionForms &&
                                            <h4 class="card-title">{exclusionForms.join(', ')}</h4>}
                                        
                                        <p class="card-text">{translations.join(', ')}</p>
                                    </div>
                                    {inVocabulary && 
                                        <div className="container-fluid card-footer">
                                            <div className="float-left mt-3">
                                                <span className="text-danger">This word in your vocabulary, meens you should know it. Wanna delete?</span>
                                            </div>
                                            <button className="btn float-right" onClick={() => setWordToDelete(vocabularyWord)}>
                                                <i className="fa fa-2x fa-times text-danger" />
                                            </button>
                                        </div>}
                                    
                            </div>
                        </div>}
                    
                </form>
           </div>
      </div>
    </section>
  );
};

export default withAugmentedAuthenticator(Translator);
