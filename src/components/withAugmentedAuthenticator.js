import React from "react";
import { useLoggedInUser } from "../hooks/useLoggedInUser";
import { withAuthenticator } from "aws-amplify-react";

const withUser = BaseComponent => ({onUser, ...props}) => {
    let {user, } = useLoggedInUser();
    onUser(user);
    return (<BaseComponent {...props}/>);
};

const withAugmentedAuthenticator = BaseComponent => 
    (withAuthenticator(withUser(BaseComponent)));

export default withAugmentedAuthenticator;