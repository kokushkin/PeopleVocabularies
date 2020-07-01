import React from "react";
import { useEffect } from "react";
import RecaptchaConformation from "./RecaptchaConformation";
import {
  ConfirmSignUp,
  ForgotPassword,
  RequireNewPassword,
  SignIn,
  SignUp,
  VerifyContact,
  withAuthenticator,
} from "aws-amplify-react";

interface IComponentInterface {
  onLogin: () => Promise<void>;
  props: any;
}

const withUser = (BaseComponent: (props: any) => JSX.Element) => ({
  onLogin,
  props,
}: IComponentInterface) => {
  useEffect(() => {
    onLogin();
  }, [onLogin]);

  return <BaseComponent {...props} />;
};

const withAugmentedAuthenticator = (BaseComponent: () => JSX.Element) =>
  withAuthenticator(withUser(BaseComponent), false, [
    <SignIn />,
    <RecaptchaConformation />,
    <VerifyContact />,
    <SignUp />,
    <ConfirmSignUp />,
    <ForgotPassword />,
    <RequireNewPassword />,
  ]);

export default withAugmentedAuthenticator;
