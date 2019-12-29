import React, {useState} from "react";
const TrainerListWord = ({word, onKnown, onUnknown}) => {
    const [showWordTranslations, setShowWordTranslations] = useState(false);
    return (
        <li className="list-group-item">
            <div className="container">
                <div className="row">
                    <div className="container-fluid">
                        <div className="float-left mt-3">
                            <span>{word.word}</span>
                        </div>
                        {/* KNOWN word button */}
                        <button
                            className="btn  float-right"
                            onClick={() => onKnown()}
                        >
                            <i className="fa fa-2x fa-glass text-success" />
                        </button>
                        {/* take a look */}
                        <button
                            className="btn  float-right"
                            onClick={() => setShowWordTranslations(showed => !showed)}
                        >
                            <i className="fa fa-2x fa-question text-info" />
                        </button>
                        {/* UNKNOWN word button */}
                        <button
                            className="btn  float-right"
                            onClick={() => onUnknown()}>
                            <i className="fa fa-2x fa-check text-warning" />
                        </button>
                    </div>
                </div>
                {showWordTranslations && word.exclusionForms && 
                    <div className="row">
                        {word.exclusionForms.join(', ')}
                    </div>}
                <div className="row">
                    {showWordTranslations && word.translations.join(', ')}
                </div>
            </div>
      </li>
    );
}

export default TrainerListWord;