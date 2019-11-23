import React from "react";
import { useLoggedInUser } from "../hooks/useLoggedInUser";
import { withAuthenticator } from "aws-amplify-react";
import { useEffect } from "react";

const withUser = BaseComponent => ({onLogin, ...props}) => {

    useEffect(() => {
        onLogin(); 
    },[])

    return (<BaseComponent {...props}/>);
};

const withAugmentedAuthenticator = BaseComponent => 
    (withAuthenticator(withUser(BaseComponent)));

export default withAugmentedAuthenticator;