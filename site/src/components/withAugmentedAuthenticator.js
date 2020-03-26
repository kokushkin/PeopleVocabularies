import React from "react";
import { useEffect } from "react";
import RecaptchaConformation from "./RecaptchaConformation";
import { ConfirmSignUp, ForgotPassword, RequireNewPassword, SignIn, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react';
 
const withUser = BaseComponent => ({onLogin, ...props}) => {

    useEffect(() => {
        onLogin(); 
    },[onLogin])

    return (<BaseComponent {...props}/>);
};

const withAugmentedAuthenticator = BaseComponent => 
    (withAuthenticator(withUser(BaseComponent), false, [
        <SignIn/>,
        <RecaptchaConformation override={'ConfirmSignIn'}/>,
        <VerifyContact/>,
        <SignUp/>,
        <ConfirmSignUp/>,
        <ForgotPassword/>,
        <RequireNewPassword />]));

export default withAugmentedAuthenticator;