import React, { useState, useEffect, useRef, useCallback } from "react";
import { API, graphqlOperation } from "aws-amplify";
import withAugmentedAuthenticator from "../components/withAugmentedAuthenticator";
import 'bootstrap';


const Translator = () => {

  return (
    <section className="container">
      <div className="row">
        <h3 className="display-4">Translate here!</h3>
      </div>
      <div className="row">
           <div className="col-12">
                <form>
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
                        <textarea readonly="true" className="form-control bg-white" id="contextTranslation" rows="2" defaultValue="Я видел этого парня" />
                    </div> 
                    <div className="form-group">
                        <label>In vocabulary this word would match to</label>
                        <div className="card big-bottom-margin">
                                <h3 className="card-header">see</h3>
                                <div className="card-body">
                                    <h4 class="card-title">saw, seen</h4>
                                    <p class="card-text">видеть, увидеть, посмотреть, вижу, смотрите, узнать</p>
                                </div>
                                <div className="container-fluid card-footer">
                                    <div className="float-left mt-3">
                                        <span className="text-danger">This word in your vocabulary, meens you should know it. Wanna delete?</span>
                                    </div>
                                    <button className="btn float-right">
                                        <i className="fa fa-2x fa-times text-danger" />
                                    </button>
                                </div>
                        </div>
                    </div>
                    
                </form>
           </div>
      </div>
    </section>
  );
};

export default withAugmentedAuthenticator(Translator);
