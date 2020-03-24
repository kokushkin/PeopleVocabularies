import { ConfirmSignIn } from 'aws-amplify-react';
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";
import  { Auth } from 'aws-amplify';


class RecaptchaConformation extends ConfirmSignIn {
    constructor(props) {
      super(props);
      this.onChange = this.onChange.bind(this);
    }
  
    onChange(data) {
      Auth.sendCustomChallengeAnswer(this.props.authData, data)
      .then( (user) => { 
        console.log('user signed in!: ', user)
        this.changeState('signedIn', user);
      })
  
    }
  
    render() {
      if (this.props.authState === 'customConfirmSignIn') {
        return (
          <div className="container-fluid mt-5">
             <div className="row justify-content-md-center">
                <ReCAPTCHA
                sitekey="6Lc9VOEUAAAAAGty5dKNobpqYMUaWpRcfuCQJahb"
                onChange={this.onChange}
                />
             </div>
          </div>
          );
        } else {
          return null;
        }
      }
}

export default RecaptchaConformation;