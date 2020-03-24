import React from "react";
import { withAuthenticator } from "aws-amplify-react";
import { useEffect } from "react";
import RecaptchaConformation from "./RecaptchaConformation";
import {  SignUp, SignIn } from 'aws-amplify-react'; 
 
const withUser = BaseComponent => ({onLogin, ...props}) => {

    useEffect(() => {
        onLogin(); 
    },[onLogin])

    return (<BaseComponent {...props}/>);
};

const withAugmentedAuthenticator = BaseComponent => 
    (withAuthenticator(withUser(BaseComponent), false, [<SignIn/>,<RecaptchaConformation override={'ConfirmSignIn'}/>,<SignUp/>]));

export default withAugmentedAuthenticator;